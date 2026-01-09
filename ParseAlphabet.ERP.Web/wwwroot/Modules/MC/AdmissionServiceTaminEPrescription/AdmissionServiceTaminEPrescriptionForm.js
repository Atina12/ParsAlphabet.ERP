var form = $('#patientForm').parsley(),
    arr_tempService = [],
    viewData_modal_title = "پذیرش نسخه نویسی تامین",
    viewData_controllername = "AdmissionServiceTaminApi",
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: adm_Identity, sqlDbType: 8, size: 0 },
    viewData_compare_date_url = `/api/SetupApi/comparetime`,
    viewData_AdmissionCounter_getField = `${viewData_baseUrl_MC}/AdmissionCounterApi/counterinfo`,
    patientId = 0, adm_Identity = 0, adm_admissionMasterId = 0, stageAndWorkflow = {},
    attenderScheduleValid = false,
    printUrl = "",
    adm_actionServiceTaminId = 0,
    admissionMasterActionId = 0,
    medicalTimeShiftId = null,
    monthId = 0,
    admissionReserveDateTimePersian = "",
    userInfoLogin = {},
    insurancesList = [], patientInsurer = null,
    inqueryID = 0,
    isTamin = false, isAfterFill = false, isEditTamin = false,
    taminStageId = admissionStage.admissionTaminPrescription.id,
    
    calPriceModel = {},
    isGetDeserveInfo = true,
    dropDownCacheData = {
        compInsurerId: null,
        compInsurerLineId: null,
        thirdPartyInsurerId: null,
        basicInsurerId: 0,
        basicInsurerLineId: 0,
        basicInsurerLineTerminologyCode: 0,
        basicInsurerLineName: "",
        discountInsurerId: null
    };

async function initAdmissionForm(callback, admId) {

    userInfoLogin = getCashIdByUserId()

    $(".select2").select2()

    loadSelectDependedent();

    setInputmask()

    if (admId !== 0 && !isNaN(admId))
        callback();
}

async function loadSelectDependedent() {

    $(`#countryId ,#attenderId ,#basicInsurerLineId,#compInsurerThirdPartyId ,#discountInsurerId,#searchPatientCompInsurerThirdPartyId,#searchPatientBasicInsurerLineId,#educationLevelId`).empty()

    var newOption1 = new Option("انتخاب کنید", 0, true, true);
    var newOption2 = new Option("انتخاب کنید", 0, true, true);
    var newOption3 = new Option("انتخاب کنید", 0, true, true);
    var newOption4 = new Option("انتخاب کنید", 0, true, true);
    var newOption5 = new Option("انتخاب کنید", 0, true, true);
    var newOption6 = new Option("انتخاب کنید", 0, true, true);


    $('#attenderId').append(newOption1);
    $('#compInsurerThirdPartyId').append(newOption2);
    $('#discountInsurerId').append(newOption3);
    $('#searchPatientCompInsurerThirdPartyId').append(newOption4);
    $('#searchPatientBasicInsurerLineId').append(newOption5);
    $('#searchPatientDiscountInsurerId').append(newOption6);


    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false, 3, "انتخاب کنید", function () { $("#countryId").val(101).trigger("change") });
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`, "attenderId", true, userInfoLogin.branchId, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/1`)
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", false, `${dropDownCache.discount}/0`);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientDiscountInsurerId", false, `${dropDownCache.discount}/0`);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);

    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);

}

function isEditMode() {
    if ($("#admnId").val() == "")
        return false;
    else
        return true;
}

function setInputmask() {
    $("#birthDatePersian").inputmask({ 'mask': '9999/99/99' })
}

function expandAdmission(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        $(item).nextAll(".slideToggle").removeClass("current");


        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        if (!$("#idCardNumber").prop('disabled')) {
            firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
        }
    }
}

async function checkValidAdd(result) {

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getattenderinsurerservice`,
        model = {
            attenderId: +$("#attenderId").val(),
            taminCode: [],
            medicalSubjectId: 1
        },
        dataList = result.detailList;

    let dataListLn = dataList.length;

    for (var i = 0; i < dataListLn; i++)
        model.taminCode.push(dataList[i].serviceTarefCode);

    await fetchManager(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model),
    }).then(result => {

        if (checkResponse(result)) {
            let resultLn = result.length,
                errorStringAttender = "",
                errorStringInsurer = "",
                errorStringNotDefine = "",
                errorString = "";

            for (var i = 0; i < resultLn; i++) {
                errorStringNotDefine += result[i].notDefine ? result[i].taminTarefCode + `${i == resultLn - 1 ? "<br/>" : " / "}` : "";

                if (result[i].notDefine)
                    break;

                errorStringAttender += !result[i].isAttender ? result[i].taminTarefCode + `${i == resultLn - 1 ? "<br/>" : " / "}` : "";
                errorStringInsurer += !result[i].isInsurer ? result[i].taminTarefCode + `${i == resultLn - 1 ? "<br/>" : " / "}` : "";
            }
            if (errorStringNotDefine != "")
                errorString += `خدمت های زیر تعریف نشده اند :<br/> ${errorStringNotDefine}`;

            if (errorStringAttender != "")
                errorString += `خدمت های زیر در لیست داکتر انتخابی نمی باشد :<br/> ${errorStringAttender}`;

            if (errorStringInsurer != "")
                errorString += `خدمت های زیر بدون تعرفه بیمه می باشد :<br/> ${errorStringInsurer}`;


            if (errorString != "") {
                linerAlertify(errorString, "warning", 15);
                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
            else
                getDataCallPrice(dataList);

        }
        else loadingAsync(false, "addService", "fa fa-arrow-down");
    });
}

async function getDataCallPrice(serviceList) {
    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpriceservicetamin`;

    let servicesLst = [],
        serviceListLn = serviceList.length;
    for (var i = 0; i < serviceListLn; i++)
        servicesLst.push({ serviceTaminCode: serviceList[i].serviceTarefCode, qty: serviceList[i].remainingQuantity });


    let attenderId = +$("#attenderId").val()
    let medicalSubjectId = 1
    let basicInsurerId = +dropDownCacheData.basicInsurerId
    let basicInsurerLineId = +dropDownCacheData.basicInsurerLineId
    let compInsurerId = +dropDownCacheData.compInsurerId == 0 ? null : +dropDownCacheData.compInsurerId
    let compInsurerLineId = +dropDownCacheData.compInsurerLineId == 0 ? null : +dropDownCacheData.compInsurerLineId
    let thirdPartyInsurerId = +dropDownCacheData.thirdPartyInsurerId == 0 ? null : +dropDownCacheData.thirdPartyInsurerId
    let discountInsurerId = +dropDownCacheData.discountInsurerId == 0 ? null : +dropDownCacheData.discountInsurerId

    let model = {
        services: servicesLst,
        attenderId,
        basicInsurerLineId,
        compInsurerLineId,
        thirdPartyId: thirdPartyInsurerId,
        discountInsurerId,
        medicalSubjectId,
    }

    await fetchManager(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model),
    }).then(async result => {

        if (checkResponse(result)) {
            if (result.successfull) {
                $("#tempService").html("");
                arr_tempService = [];
                let emptyIds = [];
                for (var i = 0; i < result.data.length; i++)
                    emptyIds.push(addTempServiceAdm(result.data[i]));

                if (emptyIds.filter(a => a !== "").length > 0)
                    linerAlertify(generateErrorStringWithHeader(emptyIds, "خدمات با تعداد صفر:"), "warning");

                $("#addService").prop("disabled", true);
                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
            else {
                if (result.status == -101) {
                    let validError = "", dataError = result.validationErrors, dataErrorLn = result.validationErrors.length;
                    for (var i = 0; i < dataErrorLn; i++)
                        validError += dataError[i] + `${i == dataErrorLn - 1 ? "" : " / "}`;

                    if (validError)
                        linerAlertify(`برای خدمت های زیر تعرفه بیمه وجود ندارد :<br /> ${validError}`, "warning");

                }
                else
                    linerAlertify("خطا در دریافت اطلاعات", "warning");


                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
        }
        else
            loadingAsync(false, "addService", "fa fa-arrow-down");
    });

}

async function setPatientInfo(id, referralTypeId, basicInsurerLineId,
    nationalCode, basicInsurerNo, basicInsurerExpirationDatePersian, firstName, lastName, birthDatePersian, genderId, countryId,
    compInsurerLineId, compInsurerId, thirdPartyInsurerId, mobileNo, address, idCardNumber, postalCode, jobTitle, phoneNo, maritalStatusId, fatherFirstName, educationLevelId, discountInsurerId) {

    patientId = id;
    $("#patientId").val(id === 0 ? "" : id);
    $("#basicInsurerLineId").val(`1-${basicInsurerLineId}`).trigger("change");
    $("#nationalCode").val(nationalCode);
    $("#firstName").val(firstName);
    $("#lastName").val(lastName);
    $("#birthDatePersian").val(birthDatePersian);
    $("#genderId").val(genderId).trigger("change");
    $("#countryId").val(countryId).trigger("change");

    if (compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${compInsurerLineId}-${compInsurerId}`).trigger("change");
    else if (thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${thirdPartyInsurerId}`).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).trigger("change");

    if (discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${discountInsurerId}`).trigger("change");
    else
        $("#discountInsurerId").val(0).trigger("change");

    $("#mobile").val(mobileNo);
    $("#idCardNumber").val(idCardNumber);
    $("#postalCode").val(postalCode);
    $("#jobTitle").val(jobTitle);
    $("#phoneNo").val(phoneNo);
    $("#maritalStatusId").val(maritalStatusId).trigger("change");
    $("#educationLevelId").val(educationLevelId).trigger("change");
    $("#fatherFirstName").val(fatherFirstName);
    $("#address").val(address);
    modal_closeAdmission('searchPatientModal', true)
}

async function setPatientInsurerInfo(basicInsurerLineId, basicInsurerNo, basicInsurerExpirationDatePersian, compInsurerLineId, compInsurerId, thirdPartyInsurerId, discountInsurerId) {
    modal_close("searchPatientInsurerModal");

    $("#basicInsurerLineId").val(`1-${basicInsurerLineId}`).trigger("change");

    if (compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${compInsurerLineId}-${compInsurerId}`).trigger("change");
    else if (thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${thirdPartyInsurerId}`).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).trigger("change");


    if (discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${discountInsurerId}`).trigger("change");
    else
        $("#discountInsurerId").val(0).trigger("change");

}

function setHighlightTr(rowNumber) {
    $("#tempService tr").removeClass("highlight");
    $(`#s_${rowNumber}`).addClass("highlight");
}

function removeFromTempServiceAll() {

    let admId = +$("#admnId").val();

    if (admId > 0) {
        for (var i = 0; i < arr_tempService.length; i++) {
            let serviceId = arr_tempService[i].serviceId;
            deleteAdmissionLine(admId, serviceId);
        }
    }

    $("#tempService").html("");
    arr_tempService = [];

    $("#sumRowService").addClass("displaynone");
    $(".sumNetPrice").text("");
    $(`#tempService`).html(emptyRowHTML);
    $("#amount").val("");
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $(".setprescription-check,.infoprescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");
    $("#addService").prop("disabled", false);
}

function rebuildRow(arr, table) {

    if (arr.length === 0 || table === "")
        return;

    for (var b = 0; b < arr.length; b++) {
        arr[b].rowNumber = b + 1;
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `s_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[10].innerHTML !== "")
            $(`#${table} tr`)[b].children[10].innerHTML = `<button type="button" onclick="removeFromTempService(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف خدمت">
                                                                     <i class="fa fa-trash"></i>
                                                          </button>`;

    }
}

function setReserve(res, currentDate) {

    if (res) {
        let reserveDateTime = `${res.reserveTime} ${moment.from(currentDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}`;
        admissionReserveDateTimePersian = reserveDateTime;
        $("#reserveNo").val(res["reserveNo"]);
        $("#reserveDate").val(reserveDateTime);
        $("#scheduleBlockId").val(res.scheduleBlockId)
    }

}

function saveAdmission(saveOrPrint = "saveForm") {

    if ($("#saveForm").attr("disabled") === "disabled" || $("#saveFormAndPrint").attr("disabled") === "disabled")
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (+$("#attenderId").val() === 0) {
        linerAlertify(admission.notHasAttender, "warning");
        $("#attenderId").select2("focus");
        return;
    }
    else {
        if (+$("#reserveNo").val() === 0 || $("#reserveDate").val() === "" || $("#scheduleBlockId").val() == "") {
            linerAlertify(admission.defineAdmission, "warning", admission.delay);

            $("#reserveShift").focus();
            return;
        }
    }

    if (+$("#basicInsurerLineId").val() == 0) {
        msg_s = alertify.warning("بیمه اجباری را وارد کنید");
        msg_s.delay(admission.delay);
        $("#basicInsurerLineId").select2("focus");
        return;
    }

    if (arr_tempService.length === 0) {
        linerAlertify(admission.notHasService, "danger", admission.delay);
        $("#saveForm").removeAttr("disabled");
        $("#saveFormAndPrint").removeAttr("disabled");
        return;
    }

    if (+$("#admnId").val() != 0) {
        if (+$("#admissionMasterId").val() == 0) {
            var msg_hid_srv = alertify.warning("پذیرش بدون شناسه پرونده می باشد");
            msg_hid_srv.delay(admission.delay);
            $("#saveForm").removeAttr("disabled");
            $("#saveFormAndPrint").removeAttr("disabled");
            return;
        }
    }

    $("#saveForm").attr("disabled", "disabled");
    $("#saveFormAndPrint").attr("disabled", "disabled");

    let nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    let mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();
    let model_patient = {
        id: +$("#patientId").val(),
        nationalCode: nationalCode,
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        genderId: +$("#genderId").val(),
        countryId: +$("#countryId").val() == 0 ? 101 : +$("#countryId").val(),
        mobileNo: mobileNo,
        address: $("#address").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
        educationLevelId: +$("#educationLevelId").val(),
    };

    let admissionExtraPropertyList = buildAdmissionExtraPropertyList();
    let workflowId = 154;
    let stageId = taminStageId;


    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];

    var model_adm = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admissionMasterId").val(),
        admissionMasterActionId: +$("#admissionMasterId").val() > 0 ? admissionMasterActionId : 0,
        admissionMasterWorkflowId: workflowId,
        admissionMasterStageId: admissionStage.admissionMasterOutPatient.id,
        bookingTypeId: 2, // out patient
        admissionTypeId: 4, // TaminAdmission
        stageId,
        actionId: +$("#admnId").val() > 0 ? adm_actionServiceTaminId : 0,
        workflowId,
        attenderId: +$("#attenderId").val(),
        attenderName: $("#attenderId option:selected").text(),
        patientId: +$("#patientId").val(),
        basicInsurerId: dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId,
        compInsurerId: +dropDownCacheData.compInsurerId == 0 ? null : +dropDownCacheData.compInsurerId,
        compInsurerLineId: +dropDownCacheData.compInsurerLineId == 0 ? null : +dropDownCacheData.compInsurerLineId,
        thirdPartyInsurerId: +dropDownCacheData.thirdPartyInsurerId == 0 ? null : +dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: +dropDownCacheData.discountInsurerId == 0 ? null : +dropDownCacheData.discountInsurerId,
        reserveDatePersian: reserveDatePersian,
        reserveTime: reserveTime,
        reserveShiftId: $("#reserveShift").val(),
        reserveNo: +$("#reserveNo").val(),
        attenderScheduleBlockId: $("#scheduleBlockId").val(),
        medicalSubjectId: 1,
        admissionPatient: model_patient,
        admissionLineServiceList: arr_tempService,
        admissionExtraPropertyList: admissionExtraPropertyList.length == 0 ? null : admissionExtraPropertyList,
        referringDoctorId: 0,
    };

    let userInfoLogin = getCashIdByUserId()

    let viewData_save_admission = `${viewData_baseUrl_MC}/AdmissionApi/insert`;

    $.ajax({
        url: viewData_save_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model_adm),
        async: false,
        success: function (result) {

            if (!result.successfull) {

                $("#saveForm").prop("disabled", false);
                $("#saveFormAndPrint").prop("disabled", false);

                if (result.validationErrors !== null) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
            }
            else if (result.data.status === 100) {

                var msg = alertify.success(result.data.statusMessage);
                msg.delay(admission.delay);

                adm_Identity = result.data.id;
                adm_admissionMasterId = result.data.admissionMasterId;
                stageAndWorkflow = { workflowId, stageId }
                if (!isEditMode()) {

                    if (userInfoLogin.counterTypeId === 3) {
                        if (sumAdmissionLineTamin() > 0) {
                            if (saveOrPrint == "saveForm") {
                                navigation_item_click(`${viewData_addTreasury_page_url}/${result.data.admissionMasterId}/2`, viewData_addTreasury_form_title);

                            } else if (saveOrPrint == "saveFormAndPrint") {
                                printForm(stageId, workflowId);
                            }
                        }
                        else {
                            if (saveOrPrint == "saveForm")
                                navigation_item_click("/MC/Admission", "لیست پذیرش");
                            else if (saveOrPrint == "saveFormAndPrint")
                                printForm(stageId, workflowId);

                        }
                    }
                    else if (userInfoLogin.counterTypeId === 1) {
                        if (saveOrPrint == "saveForm")
                            navigation_item_click("/MC/Admission", "لیست پذیرش");
                        else if (saveOrPrint == "saveFormAndPrint")
                            printForm(stageId, workflowId);
                    }
                }
                else {
                    if (saveOrPrint == "saveForm")
                        navigation_item_click("/MC/Admission", "لیست پذیرش");
                    else if (saveOrPrint == "saveFormAndPrint")
                        printForm(stageId, workflowId);
                }
            }
            else if (result.data.status === -1 || result.data.status === -102) {
                linerAlertify(result.data.statusMessage, "error", admission.delay);
            }
            else {
                linerAlertify(admission.insert_error, "error", admission.delay);
                generateErrorValidation(result.validationErrors);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_admission);
            $("#saveForm").removeAttr("disabled");
            $("#saveFormAndPrint").removeAttr("disabled");
        }
    });
}

function buildAdmissionExtraPropertyList() {

    let admissionExtraPropertyList = []

    //admissionExtraProperty 4 
    if (checkResponse(inqueryID) && inqueryID != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.inqueryId,
            elementValue: inqueryID
        })
    }

    //admissionExtraProperty 30 
    if (checkResponse(patientInsurer) && +patientInsurer.responsibleNationalCode != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.responsibleNationalCode,
            elementValue: patientInsurer.responsibleNationalCode
        })
    }

    //admissionExtraProperty 32 
    if (checkResponse(patientInsurer) && patientInsurer.relationType != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.relationType,
            elementValue: patientInsurer.relationType
        })
    }

    //admissionExtraProperty 33 
    if (checkResponse(patientInsurer) && checkResponse(patientInsurer.covered)) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.covered,
            elementValue: patientInsurer.covered
        })
    }

    //admissionExtraProperty 34 
    if (checkResponse(patientInsurer) && patientInsurer.recommendationMessage != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.recommendationMessage,
            elementValue: patientInsurer.recommendationMessage
        })
    }

    //reasonForEncounterId 13 
    admissionExtraPropertyList.push({
        elementId: admissionExtraProperty.serviceTypeId,
        elementValue: 4020
    })

    return admissionExtraPropertyList

}

/// در اینجا در صورت ورود متن نمبر تذکره مقدار، را دریافت کرده و آنرا در جستجو استفاده میکند
///، پس از قرار دادن نمبر تذکره  جستجو را انجام داده و فوکوس را به ردیف اول میدهد
function OpenSearchPanelByNationalCode() {

    let nationalCode = $("#nationalCode").val();
    if (nationalCode != "" && nationalCode != undefined) {
        $("#tempPatient").html(fillEmptyRow(17));
        displayCountRowModal(0, "searchPatientModal");
        $("#searchPatientModal #searchPatientNationalCode").val(nationalCode);
        $("#searchPatientAdmission").click();
        setTimeout(() => {
            $(`#tempPatient #p_0`).addClass("highlight");
            $(`#tempPatient #p_0 > td > button`).focus();
        }, 1000);
    }
}

function printForm(stageId, workflowId) {

    if (printUrl === "" || !printUrl.includes(".mrt")) {
        modal_show("printAdmissionModal");
    }
    else {

        adm_print(adm_Identity, adm_admissionMasterId, printUrl, stageId, workflowId);
        navigation_item_click("/MC/Admission", "لیست پذیرش");
    }

    return;
}

function switchPrintAdmissionModal(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printAdmission('Prn_Admission.mrt')
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        printAdmission('Prn_AdmissionCompress.mrt')
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        printAdmission('Prn_AdmissionDouble.mrt')
    }

    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printAdmission('Prn_AdmissionStand.mrt')
    }


}

function resetAdmissionTamin() {

    form = $('#patientForm').parsley();
    form.reset();

    resetPatientInfo();

    //-----------------------------
    $(`#temptimeShiftDays`).html("");
    // ----------------------------

    $("#admBox").addClass("d-none");
    $("#admnId").val("");
    $("#dateTime").val("");
    $("#userFullName").val("");
    $("#saveForm").removeAttr("disabled");
    $("#saveFormAndPrint").removeAttr("disabled");

    if (!$("#expandAdmissionBtn i").hasClass("fa-plus"))
        $("#expandAdmissionBtn").click();

    // ----------------------------

    $(`#tempService`).html(emptyRowHTML);
    $(`#tempCash`).html(emptyRowHTML);
    $("#sumRowService").addClass("displaynone");
    $("#sumRowCash").addClass("displaynone");
    $(".sumNetPrice").text("").removeClass("sum-is-same");
    $("#sumPayAmountCashAdm").text("");
    $("#sumPayAmountCashAdm").removeClass("sum-is-same");
    $("input.form-control").val("");
    $(".select2:not(#basicInsurerLineId)").removeAttr("disabled");
    $("#patientForm").removeAttr("disabled");
    $("#patientForm .form-control:not(#patientId , #birthDatePersian,#basicInsurerLineId)").removeAttr("disabled");
    //$("#serviceForm").removeAttr("disabled");
    $("#cashForm").removeAttr("disabled");

    loadSelectDependedent();
    //$("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");
    //$(".select2").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");
    $("#admissionMasterId").val("").prop("disabled", true)
    $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");

    patientId = 0;
    insurancesList = [];
    patientInsurer = null;
    inqueryID = 0;
    arr_tempService = [];
    adm_Identity = 0;
    attenderScheduleValid = false;
    entitlement = 1;
}

function adm_print(admId, admissionMasterId, printurl) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if (printurl.indexOf("Prn_AdmissionStand") != -1) {
        viewData_print_model.sqlDbType = 22;
        viewData_print_model.item = "@AdmissionMasterId";
        viewData_print_model.value = `${admissionMasterId}`;
    }
    else {
        if (printurl.indexOf("Prn_AdmissionCompress.mrt") != -1) {
            contentPrintAdmissionCompress(admId);
            return;
        }
        if (printurl.indexOf("Prn_AdmissionDouble.mrt") != -1) {
            let element = $("#bcTarget")
            let bcTargetPrintprescription = doubleprintBarcode(element, 3, 1, admId)

            contentPrintAdmissionCompressDouble(admId, bcTargetPrintprescription);
            return;
        }
        if (printurl.indexOf("Prn_Admission.mrt") != -1) {
            contentPrintAdmission(admId);
            return;
        }

        viewData_print_model.value = admId;
    }
    viewData_print_model.url = printurl;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_print_model),
        async: false,
        cache: false,
        success: function (result) {
            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url);
        }
    });
}

function getAdmission() {
    var admissionId = +$("#admnId").val();

    let viewData_get_admission = `${viewData_baseUrl_MC}/admissionApi/display`;

    $.ajax({
        url: viewData_get_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(admissionId),
        success: function (result) {
            if (result !== null)
                fillAdmission(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_admission);
        }
    });
}

function fillAdmission(ad) {
    //adm Section 

    adm_actionServiceTaminId = ad.actionId;
    admissionMasterActionId = ad.admissionMasterActionId;
    $("#admnId").val(ad.id);
    $("#dateTime").val(ad.createDateTimePersian);
    $("#userFullName").val(ad.createUserFullName);
    $("#stageName").val(`${ad.stageId} - ${ad.stageName}`);
    $("#workflowName").val(`${ad.workflowId} - ${ad.workflowName}`);
    $("#admBox").removeClass("d-none");

    arr_tempService = [];
    arr_tempCash = [];
    isAfterFill = true;
    isEditTamin = true;

    $("#attenderId").val(ad.attenderId).prop("disabled", true).trigger("change");

    if (ad.attenderId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, ad.attenderId, false, 3, "انتخاب خدمت");


    admissionReserveDateTimePersian = `${ad.reserveTime.trim()} ${ad.reserveDatePersian.trim()}`;


    fillReserveShift([{
        id: ad.reserveShiftId,
        text: `${ad.reserveShiftId} - ${ad.reserveShiftName}`
    }])

    //$("#reserveShift").val(ad.reserveShiftId);
    $("#reserveNo").val(ad.reserveNo);
    $("#reserveDate").val(admissionReserveDateTimePersian);
    $("#scheduleBlockId").val(ad.attenderScheduleBlockId);


    // patient Section
    $("#patientId").val(ad.patientId);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#getDeserveInfo").prop("disabled", true);
    $("#countryId").val(ad.countryId).trigger("change")
    $("#firstName").val(ad.firstName).prop("disabled", true);
    $("#lastName").val(ad.lastName).prop("disabled", true);
    $("#birthDatePersian").val(ad.birthDatePersian).prop("disabled", true);

    $("#genderId").val(ad.genderId).trigger("change")
    $("#mobile").val(ad.mobileNo)
    $("#address").val(ad.address)
    $("#idCardNumber").val(ad.idCardNumber)
    $("#postalCode").val(ad.postalCode)
    $("#jobTitle").val(ad.jobTitle)
    $("#phoneNo").val(ad.phoneNo)
    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change")
    $("#educationLevelId").val(ad.educationLevelId).trigger("change")
    $("#fatherFirstName").val(ad.patientFatherFirstName)

    
    if (checkResponse(ad.responsibleNationalCode))
        patientInsurer.responsibleNationalCode = ad.responsibleNationalCode

    if (checkResponse(ad.relationType))
        patientInsurer.relationType = ad.relationType

    if (checkResponse(ad.covered))
        patientInsurer.covered = ad.covered

    if (checkResponse(ad.recommendationMessage))
        patientInsurer.recommendationMessage = ad.recommendationMessage

    inqueryID = ad.inqueryID;
    isGetDeserveInfo = true
    $("#editSectionPatient").prop("disabled", true)
    $("#admissionMasterId").val(ad.admissionMasterId);
    //service Section
    if (ad.admissionLineList !== null)
        if (ad.admissionLineList.length > 0) {
            var modelServiceLine = null,
                admLineLen = ad.admissionLineList.length;
            for (var q = 0; q < admLineLen; q++) {

                var adsl = ad.admissionLineList[q];

                modelServiceLine = {

                    rowNumber: q + 1,
                    serviceId: adsl.serviceId,
                    serviceName: adsl.serviceId > 0 ? adsl.serviceId + " - " + (+adsl.rvuCode != 0 ? adsl.rvuCode : 0) + " / " + (adsl.cdtCode != null ? adsl.cdtCode : "") + " / " + (adsl.taminCode != null ? adsl.taminCode : "") + " / " + adsl.serviceName : "",
                    qty: adsl.qty,

                    basicShareAmount: adsl.basicShareAmount,
                    basicPercentage: adsl.basicPercentage,
                    basicCalculationMethodId: adsl.basicCalculationMethodId,
                    basicServicePrice: adsl.basicServicePrice,
                    basicPrice: adsl.basicPrice,

                    compShareAmount: adsl.compShareAmount,
                    compServicePrice: adsl.compServicePrice,
                    compPrice: adsl.compPrice,
                    compPercentage: adsl.compPercentage,
                    compCalculationMethodId: adsl.compCalculationMethodId,

                    thirdPartyPrice: adsl.thirdPartyPrice,
                    thirdPartyAmount: adsl.thirdPartyAmount,
                    thirdPartyServicePrice: adsl.thirdPartyServicePrice,
                    thirdPartyPercentage: adsl.thirdPartyPercentage,
                    thirdPartyCalculationMethodId: adsl.thirdPartyCalculationMethodId,

                    discountAmount: adsl.discountAmount,
                    discountPrice: adsl.discountPrice,
                    discountServicePrice: adsl.discountServicePrice,
                    discountPercentage: adsl.discountPercentage,
                    discountCalculationMethodId: adsl.discountCalculationMethodId,

                    patientShareAmount: adsl.patientShareAmount,
                    netAmount: adsl.netAmount,

                    attenderTaxPercentage: adsl.attenderTaxPercentage,
                    attenderCommissionAmount: adsl.attenderCommissionAmount,
                    attenderCommissionType: adsl.attenderCommissionType,
                    attenderCommissionValue: adsl.attenderCommissionValue,
                    attenderCommissionPrice: adsl.attenderCommissionPrice,

                    penaltyId: null,
                    penaltyAmount: 0
                };

                arr_tempService.push(modelServiceLine);

                appendServiceAdm(modelServiceLine);
            }
        }


    if (ad.discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${ad.discountInsurerId}`).trigger("change");
    else
        $("#discountInsurerId").val(0).trigger("change");

    if (ad.compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${ad.compInsurerLineId}-${ad.compInsurerId}`).trigger("change");
    else if (ad.thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${ad.thirdPartyInsurerId}`).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).trigger("change");

    if (+ad.basicInsurerLineId === 0)
        $("#basicInsurerLineId").val("1-73").trigger("change");
    else
        $("#basicInsurerLineId").val(`1-${ad.basicInsurerLineId}`).trigger("change");

    setTimeout(() => {
        $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0).trigger("change");
        $("#discountInsurerId").prop("disabled", arr_tempService.length > 0).trigger("change");
        $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0).trigger("change");
    }, 500)


    $("#removeAllService").prop("disabled", arr_tempService.length < 0);
    $("#searchPatient").prop("disabled", true)
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    isEditTamin = false;
}

function printAdmission(printname) {

    printUrl = `/Stimuls/MC/${printname}`;
    modal_close("printAdmissionModal");
}

function sumAdmissionLineTamin() {
    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
}

function getPatientInsurer() {
    if
        (+$("#patientId").val() == 0) {
        $("#tempPatientI").html(fillEmptyRow(8));
        displayCountRowModal(len, "searchPatientInsurerModal");
        return;
    }

    let patientId = +$("#patientId").val()

    patientInsurerSearch(patientId, true);
}

function fillReserveShift(attenderTimeShiftList) {

    let strReserveShift = '<option value="0" selected>انتخاب شیفت</option>'

    $("#reserveShift").html("")

    if (checkResponse(attenderTimeShiftList) && attenderTimeShiftList.length != 0) {
        for (let i = 0; i < attenderTimeShiftList.length; i++) {
            strReserveShift += `<option value="${attenderTimeShiftList[i].id}">${attenderTimeShiftList[i].text}</option>`
        }
        $("#reserveShift").html(strReserveShift)
        $("#reserveShift").val(attenderTimeShiftList[0].id)
    }
    else {
        $("#reserveShift").html(strReserveShift)
        $("#reserveShift").val(0)
    }
}

async function getShiftReserve() {

    $("#reserveNo").val("");
    $("#reserveDate").val("");
    $("#scheduleBlockId").val("")

    var attenderId = +$("#attenderId").val();
    if (attenderId === 0)
        return;


    let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime()

    let attenderTimeShiftList = await getAttenderTimeShiftList(attenderId, userInfoLogin.branchId, currentDate, currentTime, false)

    medicalTimeShiftId = attenderTimeShiftList.length > 0 ? attenderTimeShiftList[0].id : null;

    fillReserveShift(attenderTimeShiftList)

    if (!checkResponse(attenderTimeShiftList) || attenderTimeShiftList.length == 0) {
        var msg = alertify.warning("برای این داکتر هیچ نوبتی تعریف نشده است");
        msg.delay(admission.delay);
        $(`#temptimeShiftDays`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
        return
    }

    var reserve = getAutoReserve(attenderId, attenderTimeShiftList[0].id, currentDateTime, false);

    var reserveStatus = reserve['status'];

    attenderScheduleValid = true;

    if (reserveStatus === 100) {
        setReserve(reserve, currentDateTime);
    }
    else if (reserveStatus === -1 || reserveStatus === -2 || reserveStatus === -4) {

        attenderScheduleValid = false;

        linerAlertify(reserve['statusMessage'], "warning", admission.delay);
        $("#reserveNo").val("");
        $("#reserveDate").val("");
        $("#reserveShift").val(0);
        $("#scheduleBlockId").val("")
        $("#attenderId").select2("focus");
    }
    else {
        linerAlertify(reserve['statusMessage'], "warning", admission.delay);
        $("#nationalCode").focus();
    }

    var currentPersianDate = moment(currentDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    monthId = currentPersianDate.split("/")[1];
    getTimeShiftDays(attenderId, medicalTimeShiftId);
}

function getTimeShiftDays(attenderId, medicalTimeShiftId) {

    if ($("#reserveDate").val() != "") {
        monthId = $("#reserveDate").val().toString().split(" ")[1].split("/")[1];
    }
    let pageViewModel = {
        pageno: 0,
        pagerowscount: 1,
        fieldItem: null,
        fieldValue: null,
        form_KeyValue: [attenderId, null, userInfoLogin.branchId, +monthId, null, null, medicalTimeShiftId, $("#reserveDate").val(), $("#reserveDate").val()],
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }

    let url = `${viewData_baseUrl_MC}/attendertimesheetlineapi/getdetailmedicaltimeshift`;



    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(pageViewModel),
        async: false,
        cache: false,
        success: function (result) {
            fillTimeShiftDays(result.data);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }


    });
}

function fillTimeShiftDays(data) {
    $(`#temptimeShiftDays`).html("");
    let output = "";
    if (data.length > 0) {

        for (var i = 0; i < data.length; i++) {
            output += `<tr>
                    <td style="width:20px;">${data[i].workDayDatePersian}</td>
                    <td style="width:20px;">${data[i].shift}</td>
                    <td style="width:20px;">${data[i].time}</td>
                    <td style="width:20px;">${data[i].numberOffline}</td>
                    <td style="width:20px;">${data[i].numberOnline}</td>
                   
                   </tr>`;
        }
    }
    else {
        output += `<tr>
                     <td  colspan="5" style="text-align:center">سطری یافت نشد</td>
                   </tr>`;


    }


    $(`#temptimeShiftDays`).html(output);

}

function resetPatientInfo(opr) {

    $("#nationalCode").prop("disabled", false).focus();
    $("#firstName").prop("disabled", false);
    $("#lastName").prop("disabled", false);
    $("#getDeserveInfo").prop("disabled", false);
    $("#searchPatient").prop("disabled", false)

    $("#attenderId").prop("disabled", false)
    $("#editSectionPatient").prop("disabled", true);

    loadingDonePersonByBirth();
}

function setPatientInsurer(rowNumber) {

    patientInsurer = insurancesList.find(ii => ii.rowNumber === rowNumber);
    inqueryID = patientInsurer.inquiryId;

    $("#basicInsurerLineId").val(patientInsurer.basicInsurerLineId).trigger("change");
    //$("#insurExpDatePersian").val(patientInsurer.expireDate);
    //$("#insurNo").val(patientInsurer.insuranceNumber);
    //$("#workshopName").val(patientInsurer.workShopName);1
    $("#editSectionPatient").prop("disabled", false);
    $("#getDeserveInfo").prop("disabled", true);

    modal_close("patientInsuranceModal");

    $("#countryId").select2("focus");
}

function modalClosePatientInsurance(modalName) {
    resetPatientInfo();
    modal_close(modalName);
}

function loadingDonePersonByBirth() {
    $("#getDeserveInfo i").removeClass(`fa-spinner fa-spin`).addClass(`fa-users`);
}

function tabkeyDownAddress(e) {
    if ([KeyCode.Tab, KeyCode.Enter].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#serviceId").select2("focus");
    }

}

function keyDownMobile(e) {
    if ([KeyCode.Tab].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#idCardNumber").focus();
    }

}

async function getPatientByDeserveInfo(nationalCode) {

    if (nationalCode == "") {
        linerAlertify("نمبر تذکره را وارد نمایید", "warning");
        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        $("#nationalCode").focus()
        $(`#getDeserveInfo`).prop("disabled", false);

        return;
    }

    if (nationalCode.length < 10) {
        linerAlertify("نمبرتذکره کمتر از 10 کاراکتر نمی تواند باشد", "warning");
        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        $("#nationalCode").focus()
        $(`#getDeserveInfo`).prop("disabled", false);
        return;
    }

    var AttenderId1 = $("#attenderId").val();

    if (AttenderId1 == "" || AttenderId1 == null || AttenderId1 == "0") {
        linerAlertify("داکتر انتخاب نمایید", "warning");
        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        $("#attenderId").select2("focus")
        $(`#getDeserveInfo`).prop("disabled", false);
        return;
    }

    let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/deserveinfo/${nationalCode}/${AttenderId1}`;

    await fetchManager(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then((result) => {

        if (checkResponse(result) && result.successfull) {

            if (result.data.code != null || result.data.message != null) {
                $(`#getDeserveInfo`).prop("disabled", false);

                return afterFailedRequest(result.data.message, result.data.code, alertify_delay);
            }
            else
                fillPatientByDeserveInfo(result.data, nationalCode);
        }
        else
            return afterFailedRequest(result.statusDesc, result.status, alertify_delay);
    });
}

function afterFailedRequest(message, code, messageTime, successfull = false) {

    resetPatientInfo();

    loadingAsync(false, "getDeserveInfo", "fas fa-users");
    $("#basicInsurerLineId").val("1-73").trigger("change");

    let statusMessage = "";
    let type = "warning";

    if (message.startsWith("Malformed token provided.")) {
        statusMessage = `${message} . به مدیر سیستم اطلاع دهید`;
        type = "error";
    }
    else if (code == "999") {
        statusMessage = `${code} - ${message} . به مدیر سیستم اطلاع دهید`;
    }
    else {
        statusMessage = `${code} - ${message}`;
    }

    linerAlertify(statusMessage, type, messageTime);

    if (successfull) {
        $("#firstName,#lastName,#nationalCode,#getDeserveInfo").prop("disabled", true);
        $("#editSectionPatient").prop("disabled", false);

        if ($("#serviceId").val() != 0)
            admissionCalPrice();
    }


    $("#genderId").select2("focus");

    return false;
}

async function loadingAsync(loading, elementId, iconClass) {

    if (loading)
        $(`#${elementId} i`).removeClass(iconClass).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(iconClass);
}

function fillPatientByDeserveInfo(result, nationalCode) {
    
    let isTamin = result.hasHealthDeserve;
    inqueryID = result.trackingCode;
    isGetDeserveInfo = true;

    if (!isTamin) {
        msg_s = alertify.warning("استحقاق درمان تامین اجتماعی اعتبار ندارد");
        msg_s.delay(admission.delay);

        $(`#getDeserveInfo`).prop("disabled", false);

    }


    $("#basicInsurerLineId").val(isTamin ? "1-1" : "1-73").trigger("change");
    $("#firstName").val(result.firstName).prop("disabled", true);
    $("#lastName").val(result.lastName).prop("disabled", true);
    $("#nationalCode,#getDeserveInfo").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", false);
    $("#birthDatePersian").focus();
    $("#searchPatient").prop("disabled", true);

    $("#genderId").select2("focus");

    loadingAsync(false, "getDeserveInfo", "fas fa-users");
}

function addTempServiceAdm() {

    var msg_s = alertify;

    var serviceIdIndex = arr_tempService.findIndex(s => s.serviceId === +$("#serviceId").val());

    if (serviceIdIndex !== -1) {
        msg_s = alertify.warning(admission.hasService);
        msg_s.delay(admission.delay);

        $("#serviceId").select2("focus");
        return;
    }

    var model = {};

    if (+$("#attenderId").val() === 0) {
        if ($("#attenderId").prop("disabled"))
            $("#serviceId").select2("focus");
        else
            $("#attenderId").select2("focus");
        msg_s = alertify.warning(admission.notHasAttender);
        msg_s.delay(admission.delay);
        return;
    }

    if (!attenderScheduleValid && ($("#reserveNo").val() === "" && $("#reserveDate").val() === "" && $("#reserveShift").val() == "0" && $("#scheduleBlockId").val() == "")) {
        msg_s = alertify.warning(admission.setReserveInfo);
        msg_s.delay(admission.delay);
        $("#reserveShift").focus();
        return;
    }

    if ($("#nationalCode").val() === "" || $("#firstName").val() === "" || $("#lastName").val() === "" || $("#genderId").val() === "0") {
        msg_s = alertify.warning("اطلاعات مراجعه کننده را کامل وارد نمایید");
        msg_s.delay(admission.delay);
        return;
    }


    if ($("#nationalCode").val().length < 10) {
        linerAlertify("نمبرتذکره کمتر از 10 کاراکتر نمی تواند باشد", "warning");
        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        return;
    }

    if (!isGetDeserveInfo) {
        
        console.log("مقدار", isGetDeserveInfo)
        msg_s = alertify.warning("استحقاق درمان انجام نشده");
        msg_s.delay(admission.delay);
        return;
    }


    if (+$("#basicInsurerLineId").val() == 0) {
        msg_s = alertify.warning("سایر اطلاعات بیمه ای را وارد نمایید");
        msg_s.delay(admission.delay);

        $("#basicInsurerLineId").select2("focus");

        return;
    }

    if (+$("#serviceId").val() === 0) {
        $("#serviceId").select2("focus");
        msg_s = alertify.warning(admission.notHasService);
        msg_s.delay(admission.delay);
        return;
    }

    if (+$("#qty").val() === 0) {
        $("#qty").focus();
        msg_s = alertify.warning(admission.notHasQty);
        msg_s.delay(admission.delay);
        return;
    }
    else if (+$("#qty").val() > 15) {
        $("#qty").focus();
        msg_s = alertify.warning("تعداد نمی تواند بیشتر 15 باشد");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceModel == undefined || calPriceModel.netPrice < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        return;
    }


    if (calPriceModel.basicServicePrice == 0 && calPriceModel.basicPrice == 0 && calPriceModel.basicShareAmount == 0 &&
        calPriceModel.compShareAmount == 0 && calPriceModel.netAmount == 0) {

        msg_s = alertify.warning("این خدمت اجازه ثبت ندارد");
        msg_s.delay(admission.delay);
        $("#serviceId").focus();
        return;
    }

    if (calPriceModel == undefined || calPriceModel.netAmount < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        return;
    }

    var validate = form.validate("addservice");
    if (!validate)
        return;


    model = {

        rowNumber: arr_tempService.length + 1,
        serviceId: +$("#serviceId").val(),
        qty: +$("#qty").val(),
        serviceName: $("#serviceId").select2('data').length > 0 ? $("#serviceId").select2('data')[0].text : "",

        basicServicePrice: +calPriceModel.basicServicePrice,
        basicPrice: +calPriceModel.basicPrice,
        basicShareAmount: +calPriceModel.basicShareAmount,
        basicPercentage: +calPriceModel.basicPercentage,//do not display
        basicCalculationMethodId: +calPriceModel.basicCalculationMethodId, //do not display

        compServicePrice: +calPriceModel.compServicePrice,
        compPrice: +calPriceModel.compPrice,
        compShareAmount: +calPriceModel.compShareAmount,
        compPercentage: +calPriceModel.compPercentage,//do not display
        compCalculationMethodId: +calPriceModel.compCalculationMethodId,//do not display

        thirdPartyPrice: +calPriceModel.thirdPartyPrice,
        thirdPartyServicePrice: +calPriceModel.thirdPartyServicePrice,
        thirdPartyAmount: +calPriceModel.thirdPartyAmount,
        thirdPartyPercentage: +calPriceModel.thirdPartyPercentage,//do not display
        thirdPartyCalculationMethodId: +calPriceModel.thirdPartyCalculationMethodId,//do not display

        discountServicePrice: +calPriceModel.discountServicePrice,
        discountPrice: +calPriceModel.discountPrice,
        discountAmount: +calPriceModel.discountAmount,
        discountPercentage: +calPriceModel.discountPercentage,//do not display
        discountCalculationMethodId: +calPriceModel.discountCalculationMethodId,//do not display

        patientShareAmount: +calPriceModel.patientShareAmount,
        netAmount: calPriceModel.netAmount,

        attenderTaxPercentage: +calPriceModel.attenderTaxPercentage,//do not display
        attenderCommissionAmount: +calPriceModel.attenderCommissionAmount,//do not display
        attenderCommissionType: +calPriceModel.attenderCommissionType,//do not display
        attenderCommissionValue: +calPriceModel.attenderCommissionValue,//do not display
        attenderCommissionPrice: +calPriceModel.attenderCommissionPrice,

        penaltyId: null,
        penaltyAmount: 0
    };

    arr_tempService.push(model);
    appendServiceAdm(model);
    resetService();

    $("#getDeserveInfo").prop("disabled", true)
    $("#serviceId").select2("focus");
    $("#birthDatePersian").prop("disabled", arr_tempService.length > 0);
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#attenderId").prop("disabled", arr_tempService.length > 0);
    $("#editSectionPatient").prop("disabled", true);
    $("#nationalCode").prop("disabled", arr_tempService.length > 0);
    $("#firstName").prop("disabled", arr_tempService.length > 0);
    $("#lastName").prop("disabled", arr_tempService.length > 0);

    //$("#genderId").prop("disabled", arr_tempService.length > 0);
    //$("#countryId").prop("disabled", arr_tempService.length > 0);
    //$("#mobile").prop("disabled", arr_tempService.length > 0);
    //$("#address").prop("disabled", arr_tempService.length > 0);
    //$("#idCardNumber").prop("disabled", arr_tempService.length > 0);
    //$("#postalCode").prop("disabled", arr_tempService.length > 0);
    //$("#jobTitle").prop("disabled", arr_tempService.length > 0);
    //$("#phoneNo").prop("disabled", arr_tempService.length > 0);
    //$("#maritalStatusId").prop("disabled", arr_tempService.length > 0);
    //$("#educationLevelId").prop("disabled", arr_tempService.length > 0);
    //$("#fatherFirstName").prop("disabled", arr_tempService.length > 0);

    $("#tempPatient").html(fillEmptyRow(17));
    displayCountRowModal(0, "searchPatientModal");
}

function resetAdmCalPrice() {

    $("#basicServicePrice").val("");
    $("#basicShareAmount").val("")
    $("#compShareAmount").val("")
    $("#thirdPartyAmount").val("")
    $("#discountAmount").val("")
    $("#netAmount").val("")

    calPriceModel = {};
}

function admissionCalPrice() {

    if (+$("#serviceId").val() === 0)
        return;

    let medicalSubjectId = 1
    let serviceId = +$("#serviceId").val()
    let attenderId = +$("#attenderId").val()
    let qty = +$("#qty").val()
    var basicInsurerId = +dropDownCacheData.basicInsurerId
    var basicInsurerLineId = +dropDownCacheData.basicInsurerLineId
    var compInsurerId = +dropDownCacheData.compInsurerId == 0 ? null : +dropDownCacheData.compInsurerId
    var compInsurerLineId = +dropDownCacheData.compInsurerLineId == 0 ? null : +dropDownCacheData.compInsurerLineId
    var thirdPartyId = +dropDownCacheData.thirdPartyInsurerId == 0 ? null : +dropDownCacheData.thirdPartyInsurerId
    var discountInsurerId = +dropDownCacheData.discountInsurerId == 0 ? null : +dropDownCacheData.discountInsurerId

    var modelCalculatePrices = {
        serviceId,
        qty,
        basicInsurerLineId,
        compInsurerLineId,
        thirdPartyId,
        discountInsurerId,
        attenderId,
        //healthClaim,
        medicalSubjectId,
    }

    let viewData_calc_admissionprice = `${viewData_baseUrl_MC}/AdmissionApi/calculateadmissionPrice`;

    $.ajax({
        url: viewData_calc_admissionprice,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelCalculatePrices),
        cache: false,
        async: false,
        success: function (result) {
            if (result.status === -102) {
                var msgItem = alertify.warning(result.statusMessage);
                msgItem.delay(alertify_delay);
            }

            if (result.status === -100) {
                var msgItem = alertify.warning(result.statusMessage);
                msgItem.delay(alertify_delay);
            }


            calPriceModel = result;

            $("#basicServicePrice").val(transformNumbers.toComma(result.basicServicePrice));
            $("#basicShareAmount").val(transformNumbers.toComma(result.basicShareAmount));
            $("#compShareAmount").val(transformNumbers.toComma(result.compShareAmount));
            $("#thirdPartyAmount").val(transformNumbers.toComma(result.thirdPartyAmount));
            $("#discountAmount").val(transformNumbers.toComma(result.discountAmount));
            $("#netAmount").val(transformNumbers.toComma(result.netAmount));

        },
        error: function (xhr) {
            error_handler(xhr, viewData_calc_admissionprice);
        }
    });
}

function appendServiceAdm(model) {

    if (model) {

        var emptyRow = $("#tempService").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempService").html("");
            $("#sumRowService").addClass("displaynone");
        }

        var output = `<tr id="s_${model.rowNumber}" onclick="setHighlightTr(${model.rowNumber})">
                          <td>${model.rowNumber}</td>
                          <td>${model.serviceName}</td>
                          <td>${model.qty}</td>
                          <td>${transformNumbers.toComma(model.basicServicePrice)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicShareAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.compShareAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.thirdPartyAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.discountAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.netAmount)}</td>
                          <td>
                              <button type="button" onclick="removeFromTempService(${model.rowNumber})" class="btn maroon_outline"  data-toggle="tooltip" data-placement="bottom" data-original-title="حذف">
                                   <i class="fa fa-trash"></i>
                              </button>
                          </td>
                      </tr>`;

        $(`#tempService`).append(output);
        var sumNetPriceTxt = transformNumbers.toComma(sumAdmissionLineTamin());

        if (arr_tempService.length !== 0) {
            $(".sumNetPrice").text(sumNetPriceTxt);
            $("#sumRowService").removeClass("displaynone");
        }
        else {
            $("#sumRowService").addClass("displaynone");
            $(".sumNetPrice").text(sumNetPriceTxt);
        }
    }
}

function resetService() {

    $("#serviceForm input.form-control").val("");

    $("#serviceForm .select2").val("").trigger("change");
}

function removeFromTempService(rowNo) {

    let admId = +$("#admnId").val();
    if (admId > 0) {
        let serviceId = arr_tempService.find(x => x.rowNumber == rowNo).serviceId;
        deleteAdmissionLine(admId, serviceId);
    }

    for (var i = 0; i < arr_tempService.length; i++) {
        item = arr_tempService[i];
        if (item["rowNumber"] === rowNo) {
            arr_tempService.splice(i, 1);
            $(`#s_${rowNo}`).remove();
            break;
        }
    }

    if (arr_tempService.length === 0) {
        $("#sumRowService").addClass("displaynone");
        $(".sumNetPrice").text("");
        $(`#tempService`).html(emptyRowHTML);
        //$("#amount").val("");
        //$("#discountPrice").val("");
        $("#editSectionPatient").prop('disabled', false)
    }
    else {

        var vSumNetPrice = sumAdmissionLineTamin();

        $("#sumRowService").removeClass("displaynone");
        $(".sumNetPrice").text(transformNumbers.toComma(vSumNetPrice));

        rebuildRow(arr_tempService, "tempService");
    }

    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#attenderId").prop("disabled", arr_tempService.length > 0);

    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0 || $("#hidonline").prop("checked") || $("#admnId").val() != 0);
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);

    $("#serviceId").select2("focus");
}

function setInsurerInfo(insurerTypeId, isurerId) {

    if (insurerTypeId == 1) {

        let basicInsurerLineTypeId = insurerTypeId
        let basicInsurerLineId = isurerId

        if (basicInsurerLineId !== 0) {

            let insurerInfo = getInsurerInfo(0, basicInsurerLineId, '', '');

            if (insurerInfo.insurerTypeId == 1) {
                dropDownCacheData.basicInsurerId = +insurerInfo.insurerId
                dropDownCacheData.basicInsurerLineId = +insurerInfo.insurerLineId
                dropDownCacheData.basicInsurerLineTerminologyCode = +insurerInfo.insurerTerminologyCode
                dropDownCacheData.basicInsurerLineName = insurerInfo.insurerLineName
            }
        }
        else {
            dropDownCacheData.basicInsurerId = 0
            dropDownCacheData.basicInsurerLineId = 0
            dropDownCacheData.basicInsurerLineTerminologyCode = 0
            dropDownCacheData.basicInsurerLineName = ""
        }

    }
    else if (insurerTypeId == 2 || insurerTypeId == 4) {

        let compInsurerThirdPartyTypeId = insurerTypeId
        let compInsurerThirdPartyId = isurerId

        if (compInsurerThirdPartyTypeId == 2) {

            let insurerInfo = getInsurerInfo(0, +compInsurerThirdPartyId, '', '');
            dropDownCacheData.thirdPartyInsurerId = null
            dropDownCacheData.compInsurerId = insurerInfo.insurerId
            dropDownCacheData.compInsurerLineId = insurerInfo.insurerLineId

        }
        else if (compInsurerThirdPartyTypeId == 4) {

            let insurerInfo = getInsurerInfo(+compInsurerThirdPartyId, 0, '', '');
            dropDownCacheData.thirdPartyInsurerId = insurerInfo.insurerId
            dropDownCacheData.compInsurerId = null
            dropDownCacheData.compInsurerLineId = null

        }
    }
    else if (insurerTypeId == 5) {

        let discountInsurerType = insurerTypeId
        let discountInsurerId = isurerId

        let insurerInfo = getInsurerInfo(+discountInsurerId, 0, '', '');

        dropDownCacheData.discountInsurerId = insurerInfo.insurerId
    }

}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmission();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        e.stopPropagation();
        $("#searchPatient").click();
    }
    else if (e.ctrlKey && e.altKey && e.keyCode === KeyCode.key_n) {
        e.preventDefault();
        e.stopPropagation();
        $("#newForm").click();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_l) {
        e.preventDefault();
        e.stopPropagation();
        $("#list_adm").click();
    }
};

initAdmissionForm(getAdmission, +$("#admnId").val()).then(id => {

    //$("#searchPatientBasicInsurerLineId").html($("#basicInsurerLineId").html()).prop("disabled", true);

    if (!isEditMode()) {
        $(`#basicInsurerLineId`).val("1-73").trigger("change");
        $("#searchPatientBasicInsurerLineId").val("1-73").trigger("change.select2");
    }

    $("#attenderId").select2("focus");
});

$("#printAdmissionModal").on("hidden.bs.modal", function (ev) {

    navigation_item_click("/MC/Admission", "لیست پذیرش");

    if (printUrl !== "")
        adm_print(adm_Identity, adm_admissionMasterId, printUrl, stageAndWorkflow.stageId, stageAndWorkflow.workflowId)

});

$("#searchPatient").on("click", function () {

    $("#patientListPagetable thead tr").html(`
                   <th class="col-width-percent-3">ردیف</th>
                                <th class="col-width-percent-8">نوع مراجعه</th>
                                <th class="col-width-percent-4">شناسه</th>
                                <th class="col-width-percent-7">نمبرتذکره</th>
                                <th class="col-width-percent-5">نام</th>
                                <th class="col-width-percent-8"> تخلص</th>
                                <th class="col-width-percent-4">تاریخ تولد</th>
                                <th class="col-width-percent-3">جنسیت</th>
                                <th class="col-width-percent-4">ملیت</th>
                                <th class="col-width-percent-8">بیمه تکمیلی</th>
                                <th class="col-width-percent-8">طرف قرارداد</th>
                                <th class="col-width-percent-8">تخفیف</th>
                                <th class="col-width-percent-5">موبایل</th>
                                <th class="col-width-percent-3">انتخاب</th>`);

    modal_show("searchPatientModal");

    /// جهت خالی کردن لیست و ریست کردن 
    $("#tempPatient").html(fillEmptyRow(18));

    $("#searchPatientBasicInsurerLineId").val("1-1").trigger("change")

    displayCountRowModal(0, "searchPatientModal");
});

$("#searchPatientAdmission").on("click", function () {

    if
        (
        $("#searchPatientFullName").val().trim().length < 3 &&
        $("#searchPatientNationalCode").val().length === 0 &&
        $("#searchPatientMobileNo").val().length === 0 &&
        $("#searchPatientBasicInsurerNo").val().trim().length === 0 &&
        $("#searchPatientBasicInsurerLineId").val() == 0 &&
        $("#searchPatientCompInsurerThirdPartyId").val() == 0 &&
        $("#searchPatientDiscountInsurerId").val() == 0
    ) {
        $("#tempPatient").html(fillEmptyRow(18));
        displayCountRowModal(0, "searchPatientModal");
        return;
    }


    let basicInsurerLineId = $("#searchPatientBasicInsurerLineId").val().split("-")[1] == undefined ? 0 : $("#searchPatientBasicInsurerLineId").val().split("-")[1]
    let compInsuranceThirdPartyType = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[0]
    let compInsurerLineId = 0
    let thirdPartyInsurerId = 0
    let discountInsurerId = $("#searchPatientDiscountInsurerId").val().split("-")[1] == undefined ? 0 : $("#searchPatientDiscountInsurerId").val().split("-")[1]


    if (compInsuranceThirdPartyType == 2) {
        compInsurerLineId = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[1]
        thirdPartyInsurerId = 0
    }
    else if (compInsuranceThirdPartyType == 4) {
        thirdPartyInsurerId = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[1]
        compInsurerLineId = 0
    }
    else {
        thirdPartyInsurerId = 0
        compInsurerLineId = 0
    }

    let patientSearchModel = {
        patientFullName: $("#searchPatientFullName").val().trim(),// == "" ? null : $("#searchPatientFullName").val().trim(),
        patientNationalCode: $("#searchPatientNationalCode").val(),// == "" ? null : $("#searchPatientNationalCode").val(),
        mobileNo: $("#searchPatientMobileNo").val(),//== "" ? null : $("#searchPatientMobileNo").val(),
        insurNo: $("#searchPatientBasicInsurerNo").val().trim(),// == "" ? null : $("#searchPatientBasicInsurerNo").val().trim(),
        insurerLineId: +basicInsurerLineId,
        compInsurerLineId: +compInsurerLineId,
        thirdPartyInsurerId: +thirdPartyInsurerId,
        discountInsurerId: +discountInsurerId,
        includeUnknown: 0
    }


    patientSearch(patientSearchModel, false, true);
});

$("#searchPatientInsurerModal").on("hidden.bs.modal", async function () {
    $("#mobile").focus();
});

$("#admissionFormBox").on("keydown", function (ev) {

    if (ev.ctrlKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});

$("#reserveModal").on("hidden.bs.modal", function (ev) {
    $("#nationalCode").focus()
});

$("#discountInsurerId").on("change", function () {

    let discountInsurerId = $(this).val()
    let discountInsurerTypeId = ""

    if (checkResponse(discountInsurerId) && discountInsurerId != 0) {
        discountInsurerTypeId = discountInsurerId.split("-")[0]
        discountInsurerId = discountInsurerId.split("-")[1]

        setInsurerInfo(discountInsurerTypeId, discountInsurerId)

    }
    else {
        dropDownCacheData.discountInsurerId = null
    }

    admissionCalPrice()
})

$("#compInsurerThirdPartyId").on("change", function () {

    let compInsurerThirdPartyId = $(this).val()
    let compInsurerThirdPartyTypeId = ""

    if (checkResponse(compInsurerThirdPartyId) && compInsurerThirdPartyId != 0) {
        compInsurerThirdPartyTypeId = compInsurerThirdPartyId.split("-")[0]
        compInsurerThirdPartyId = compInsurerThirdPartyId.split("-")[1]

        setInsurerInfo(compInsurerThirdPartyTypeId, compInsurerThirdPartyId)

    }
    else {
        dropDownCacheData.compInsurerId = null
        dropDownCacheData.compInsurerLineId = null
        dropDownCacheData.thirdPartyInsurerId = null
    }

    if (+$(`#serviceId`).val() !== 0)
        $(`#serviceId`).trigger("change");

    admissionCalPrice();
});

$("#basicInsurerLineId").on("change", function () {

    let basicInsurerLineId = $(this).val()
    let basicInsurerLineTypeId = ""

    if (checkResponse(basicInsurerLineId) && basicInsurerLineId !== 0) {

        basicInsurerLineTypeId = +basicInsurerLineId.split("-")[0]
        basicInsurerLineId = +basicInsurerLineId.split("-")[1]

        setInsurerInfo(basicInsurerLineTypeId, basicInsurerLineId)

        admissionCalPrice();
    }
    else
        $(this).prop("selectedIndex", 0).trigger("change");
});

$("#attenderId").on("change", function () {
    var attenderId = +$(this).val();
    $("#serviceId").empty();

    resetAdmCalPrice();

    if (attenderId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, attenderId, false, 3, "انتخاب خدمت");
    else {
        $("#reserveShift").val(0);
        $(`#temptimeShiftDays`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
    }


    if (!isAfterFill)
        getShiftReserve();
    else
        isAfterFill = false;
});

$("#countryId").on(`change`, function () {

    if (+$("#countryId").val() == 0)
        +$("#countryId").val(101).trigger("cahnge");

});

$("#searchPatientModal").on("shown.bs.modal", function () {
    resetSearchPatient();
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();
});

$("#searchPatientInsurerModal").on("shown.bs.modal", function () {
    $(`#tempPatientI #pI_0`).addClass("highlight");
    $(`#tempPatientI #pI_0 > td > button`).focus();
});

$("#showReserve").on("click", function () {
    var attenderId = +$("#attenderId").val();
    if (attenderId === 0) {

        var msg_status_1 = alertify.warning(admission.select_attender);
        msg_status_1.delay(admission.delay);
        return;
    }

    reserve_init(attenderId);
    modal_show("reserveModal");
});

$("#list_adm").on("click", function () {
    navigation_item_click("/MC/Admission", "لیست پذیرش");
});

$("#newForm").on("click", function () {
    $("#attenderId").select2("focus");
    alertify.confirm('', msg_confirm_new_page,
        function () {
            resetAdmissionTamin();
        },
        function () {
            linerAlertify("انصراف", "error");
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
});

$("#saveForm").on("click", function () {
    saveAdmission();
});

$("#saveFormAndPrint").on("click", function () {
    saveAdmission("saveFormAndPrint");
})

$("#nationalCode").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter && $(this).val() != "") {

        if (isValidIranianNationalCode($(this).val())) {

            loadingAsync(true, "getDeserveInfo", "fas fa-users");

            getPatientByDeserveInfo($(this).val());
        }
    }
});

$("#nationalCode").on("blur", function (eb) {

    var nationalCode = $(this).val();

    if (nationalCode !== "") {
        $("#patientInsurerListPagetable thead tr").html(`
            <th class="col-width-percent-3">ردیف</th>
            <th class="col-width-percent-8">بیمه تکمیلی</th>
            <th class="col-width-percent-8">طرف قرارداد</th>
            <th class="col-width-percent-3">انتخاب</th>
        `);
        getPatientByNationalCode_adm(nationalCode, 3, (result) => {
            if (checkResponse(result)) {
                $("#patientId").val(result.id);
                $("#firstName").val(result.firstName);
                $("#lastName").val(result.lastName);
                $("#birthDatePersian").val(result.birthDatePersian);
                $("#genderId").val(result.genderId).trigger("change");
                $("#countryId").val(result.countryId).trigger("change");
                $("#mobile").val(result.mobileNo);
                $("#address").val(result.address);
                $("#idCardNumber").val(result.idCardNumber);
                $("#postalCode").val(result.postalCode);
                $("#jobTitle").val(result.jobTitle);
                $("#phoneNo").val(result.phoneNo);
                $("#maritalStatusId").val(result.maritalStatusId).trigger("change");
                $("#educationLevelId").val(result.educationLevelId).trigger("change");
                $("#fatherFirstName").val(result.fatherFirstName);
            }
        });
    }
});

$("#nationalCode").on("input", function () {
    
    $("#patientId").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#countryId").val("101");
    $("#mobile").val("");
    $("#address").val("");
    $("#birthDatePersian").val("");
    $("#workshopName").val("");
    $("#idCardNumber").val("");
    $("#postalCode").val("");
    $("#jobTitle").val("");
    $("#phoneNo").val("");
    $("#maritalStatusId").val(-1).trigger("change");
    $("#educationLevelId").val(-1).trigger("change");
    $("#fatherFirstName").val("");
    
    console.log("مقدار دیز", $(this));
    if ($(this).val() == "")
        isGetDeserveInfo = false;
    else if (!isValidIranianNationalCode($(this).val())) { }
        isGetDeserveInfo = false;

});

$("#serviceId").on("change", function () {

    if (+$(this).val() !== 0) {
        $("#qty").val(1);
        admissionCalPrice();
    }
    else {
        terminologyInfo = null;
        $("#qty").val("");
        admissionCalPrice();
    }

});

$("#qty").on("input", function () {
    var qty = +$(this).val();

    resetAdmCalPrice();

    if (qty > 15) {
        var qtyAlert = alertify.warning("ورودي بايد کوچکتر يا مساوي 15 باشد.");
        qtyAlert.delay(admission.delay);
        return;
    }
    if (qty > 0)
        admissionCalPrice();
});

$("#editSectionPatient").on("click", function () {
    resetPatientInfo();
    $(this).prop("disabled", true);
});

$("#getDeserveInfo").on("click", function () {

    loadingAsync(true, "getDeserveInfo", "fas fa-users");
    $(this).prop("disabled", true);
    getPatientByDeserveInfo($("#nationalCode").val());




    console.log({
        isGetDeserveInfo,
        nationalCode: $("#nationalCode").val(),
        attenderId: $("#attenderId").val(),
        getDeserveInfoDisabled: $("#getDeserveInfo").is(":disabled")
    });

});

$("#addService").on("click", function () {
    setTimeout(function () {
        addTempServiceAdm();
    }, 500);
});

$("#printAdmissionModal").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrintAdmissionModal(e)
});

$("#mobile").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        if (!checkResponse($("#getDeserveInfo").attr("disabled"))) {
            linerAlertify("استحقاق درمان انجام نشده است", "warning");
            $("#getDeserveInfo").focus()
        }
        else
            $("#serviceId").select2("focus")
    }
})



