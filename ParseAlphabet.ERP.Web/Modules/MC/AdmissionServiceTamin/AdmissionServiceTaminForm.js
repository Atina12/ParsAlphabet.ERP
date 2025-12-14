
var form = $('#patientForm').parsley(),
    arr_tempService = [],
    viewData_modal_title = "پذیرش تامین",
    viewData_controllername = "AdmissionServiceTaminApi",
    patientId = 0, adm_Identity = 0, adm_admissionMasterId = 0,
    admissionTaminId = 0,
    adm_actionTaminId = 0,
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: adm_Identity, sqlDbType: 8, size: 0 },
    printUrl = "",
    medicalTimeShiftId = null,
    monthId = 0,
    insurancesList = [], patientInsurer = null,
    inqueryID = 0, prescriptionVars = { ePrescriptionId: 0, paraTypeCode: 0 },
    isAfterFill = false,
    isEditTamin = false,
    taminStageId = admissionStage.admissionTaminParaClinic.id,
    userInfoLogin = "",
    saveAdmissionIsDone = false,
    saveAdmissionDetails = null,
    admissionReserveDateTimePersian = "",
    registerTaminResult = null,
    attenderMsc = "",
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

    $(".select2").select2()

    userInfoLogin = await getCashIdByUserId()

    if (userInfoLogin.counterTypeId != 3)
        $("#saveFormAndPrint").css("display", "none")

    loadSelectDependedent();

    $("#genderId").prop("selectedIndex", 0).trigger("change")

    setInputmask()

    if (admId !== 0 && !isNaN(admId))
        callback();

}

async function loadSelectDependedent() {

    $(`#serviceLaboratoryGroupId,#attenderId,#referringDoctorId,#basicInsurerLineId,#basicInsurerLineId,#compInsurerThirdPartyId,#discountInsurerId
       #searchPatientCompInsurerThirdPartyId,#searchPatientBasicInsurerLineId,#countryId,#educationLevelId,#searchPatientDiscountInsurerId`).empty()

    var newOption1 = new Option("انتخاب کنید", 0, true, true);
    var newOption2 = new Option("انتخاب کنید", 0, true, true);
    var newOption3 = new Option("انتخاب کنید", 0, true, true);
    var newOption4 = new Option("انتخاب کنید", 0, true, true);
    var newOption5 = new Option("انتخاب کنید", 0, true, true);
    var newOption6 = new Option("انتخاب کنید", 0, true, true);
    var newOption7 = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption1);
    $('#compInsurerThirdPartyId').append(newOption2);
    $('#discountInsurerId').append(newOption3);
    $('#searchPatientCompInsurerThirdPartyId').append(newOption4);
    $('#searchPatientBasicInsurerLineId').append(newOption5);
    $('#searchPatientDiscountInsurerId').append(newOption7);
    $('#serviceLaboratoryGroupId').append(newOption6);

    fill_select2(`api/AdmissionsApi/taminlaboratorygroup_getdropdown`, "serviceLaboratoryGroupId", true, 0, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderbookingparaclinic`, "attenderId", true, userInfoLogin.branchId, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ReferringDoctorApi/getdropdown`, "referringDoctorId", true, 1, true, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/1`)
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", false, `${dropDownCache.discount}/0`);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientDiscountInsurerId", false, `${dropDownCache.discount}/0`);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');

    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false, 3);
    $("#countryId").prop('selectedIndex', 0).trigger("change")
    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);

}

function setInputmask() {

    $("#prescriptionDatePersian").inputmask({ "mask": "9999/99/99" })
    $("#birthDatePersian").inputmask({ "mask": "9999/99/99" })
}

function isEditMode() {
    if ($("#admnId").val() == "")
        return false;
    else
        return true;
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

async function ValidBeforAddTempServiceAdm() {

    if (+$("#attenderId").val() == 0) {
        linerAlertify("داکتر را انتخاب کنید", "warning");
        return;
    }

    if (prescriptionVars.ePrescriptionId == 0) {
        linerAlertify("نسخه الکترونیک را انتخاب کنید", "warning");
        return;
    }

    if (+$("#referringDoctorId").val() !== 0) {
        if ($("#prescriptionDatePersian").val() != "") {
            if (!isValidShamsiDate($("#prescriptionDatePersian").val())) {
                $("#prescriptionDatePersian").focus();
                linerAlertify("تاریخ نسخه معتبر نمی باشد", "warning", admission.delay);
                return;
            }
            else {
                var modelCheckDate = {
                    date1: $("#prescriptionDatePersian").val()
                };

                var resultComparePris = compareTime(modelCheckDate);

                if (resultComparePris === 1 || resultComparePris === -2) {
                    linerAlertify(admission.priscriptionDateNotValid, "warning", admission.delay);

                    $("#prescriptionDatePersian").focus();
                    priscriptionDateValid = false;
                    return;
                }
                else {
                    priscriptionDateValid = true;
                }
            }
        }
        else {
            $("#prescriptionDatePersian").focus();
            linerAlertify("تاریخ نسخه برای مراجعه کننده مورد نظر را وارد نمایید", "warning", admission.delay);
            return;
        }
    }

    loadingAsync(true, "addService", "fa fa-arrow-down");

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexisteprescriptionId/${prescriptionVars.ePrescriptionId}/${admissionTaminId}`;

    await checkExitPrescraption(url).then((res) => {

        if (typeof res !== "undefined") {
            if (+res == 0) {
                let url = `${viewData_baseUrl_MC}/tamin/geteprescriptiondetail`,
                    model = { requestId: prescriptionVars.ePrescriptionId, paraClinicTypeCode: prescriptionVars.paraTypeCode };

                fetchGetPrescriptionDetails(url, model).then(result => {

                    if (checkResponse(result) && checkResponse(result.data))
                        checkValidAdd(result.data);
                    else
                        loadingAsync(false, "addService", "fa fa-arrow-down");
                });
            }
            else {
                linerAlertify(`نسخه انتخابی با شناسه (${prescriptionVars.ePrescriptionId}) قبلا در پذیرش با شناسه ${res} ثبت شده است `, "warning");
                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
        }
        else
            loadingAsync(false, "addService", "fa fa-arrow-down");
    });

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
                errorStringNotDefine += result[i].notDefine ? result[i].taminTarefCode + " / " : "";

                if (result[i].notDefine)
                    break;

                errorStringAttender += !result[i].isAttender ? result[i].taminTarefCode + " / " : "";
                errorStringInsurer += !result[i].isInsurer ? result[i].taminTarefCode + " / " : "";
            }

            if (errorStringNotDefine != "")
                errorString += `<div class="d-flex"><div>خدمت های زیر تعریف نشده اند : </div><div style="direction:ltr">${errorStringNotDefine}</div></div>`
            //errorString += `<span>خدمت های زیر تعریف نشده اند :</span><span>${errorStringNotDefine}</span> `;      

            if (errorStringAttender != "")
                errorString += `<div class="d-flex"><div>خدمت های زیر در لیست داکتر انتخابی نمی باشد : </div><div style="direction:ltr">${errorStringAttender}</div></div>`
            //errorString += `خدمت های زیر در لیست داکتر انتخابی نمی باشد : \n ${errorStringAttender}`;

            if (errorStringInsurer != "")
                errorString += `<div class="d-flex"><div>خدمت های زیر بدون تعرفه بیمه می باشد : </div><div style="direction:ltr">${errorStringInsurer}</div></div>`
            //errorString += `خدمت های زیر بدون تعرفه بیمه می باشد : \n ${errorStringInsurer}`;

            if (errorString != "") {
                linerAlertify(errorString, "warning", 30);
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

    let servicesLst = [], servicesParaLst = [],
        serviceListLn = serviceList.length;

    for (var i = 0; i < serviceListLn; i++)
        servicesParaLst.push(serviceList[i].paraClinicTypeCode);

    let result = await checkPraType(servicesParaLst.join());
    if (result === 'true') {
        linerAlertify("امکان ثبت این نسخه در این مجموعه وجود ندارد", "warning", 6);
        loadingAsync(false, "addService", "fa fa-arrow-down");
        return;
    }

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

                if (result.data[0].status == -100) {
                    linerAlertify(result.data[0].statusMessage, "warning", alertify_delay);
                    loadingAsync(false, "addService", "fa fa-arrow-down");
                    return
                }

                $("#tempService").html("");
                arr_tempService = [];
                let emptyIds = [];
                for (var i = 0; i < result.data.length; i++)
                    emptyIds.push(addTempServiceAdm(result.data[i]));

                if (emptyIds.filter(a => a !== "").length > 0) {
                    linerAlertify(generateErrorStringWithHeader(emptyIds, "خدمات با تعداد صفر:"), "warning");
                }

                $("#addService").prop("disabled", true);
                $("#removeAllService").prop("disabled", false);
                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
            else {
                if (result.status == -101) {
                    let validError = "", dataError = result.validationErrors, dataErrorLn = result.validationErrors.length;
                    for (var i = 0; i < dataErrorLn; i++)
                        validError += dataError[i] + `${i == dataErrorLn - 1 ? "" : " / "}`;

                    if (validError) {
                        linerAlertify(`برای خدمت های زیر تعرفه بیمه وجود ندارد :<br /> ${validError}`, "warning");
                    }
                }
                else {
                    linerAlertify("خطا در دریافت اطلاعات", "warning");
                }

                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
        }
        else
            loadingAsync(false, "addService", "fa fa-arrow-down");
    });

}

async function checkPraType(paraTypes) {
    let url = `/api/MC/AdmissionServiceTaminApi/checkacceptableparatype/${paraTypes}`;
    var output = $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "text/html",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return undefined;
        }
    });
    return output.responseText;
}

async function checkExitPrescraption(url) {
    var output = $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "text/html",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return undefined;
        }
    });
    return output.responseText;
}

function addTempServiceAdm(data) {

    if (data.qty == 0)
        return data.serviceId;

    var model = {
        rowNumber: arr_tempService.length + 1,
        serviceId: data.serviceId,
        qty: 1,
        serviceName: data.serviceName,
        basicServicePrice: data.basicServicePrice,
        basicShareAmount: data.basicShareAmount,
        basicPercentage: data.basicPercentage,
        basicCalculationMethodId: data.basicCalculationMethodId,
        basicPrice: data.basicPrice,
        compPrice: data.compPrice,
        compServicePrice: data.compServicePrice,
        compShareAmount: data.compShareAmount,
        compPercentage: data.compPercentage,
        compCalculationMethodId: data.compCalculationMethodId,
        thirdPartyPrice: data.thirdPartyPrice,
        thirdPartyServicePrice: data.thirdPartyServicePrice,
        thirdPartyAmount: data.thirdPartyAmount,
        thirdPartyPercentage: data.thirdPartyPercentage,
        thirdPartyCalculationMethodId: data.thirdPartyCalculationMethodId,
        discountPrice: data.discountPrice,
        discountServicePrice: data.discountServicePrice,
        discountAmount: data.discountAmount,
        discountPercentage: data.discountPercentage,
        discountCalculationMethodId: data.discountCalculationMethodId,
        patientShareAmount: data.patientShareAmount,
        netAmount: data.netAmount,
        attenderCommissionAmount: data.attenderCommissionAmount,
        attenderTaxPercentage: data.attenderTaxPercentage,
        attenderCommissionType: data.attenderCommissionType,
        attenderCommissionValue: data.attenderCommissionValue,
        attenderCommissionPrice: data.attenderCommissionPrice,

        penaltyId: null,
        penaltyAmount: 0
    };

    arr_tempService.push(model);
    appendServiceAdm(model);


    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $(".setprescription-check,.infoprescription,#tryGetPrescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");
    $("#diagnosisComment,#diagnosisCode,#serviceLaboratoryGroupId").prop("disabled", arr_tempService.length > 0);
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);
    $("#prescriptionDatePersian").prop("disabled", arr_tempService.length > 0);


    return "";
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

function setHighlightTr(rowNumber) {
    $("#tempService tr").removeClass("highlight");
    $(`#s_${rowNumber}`).addClass("highlight");
}

function removeFromTempServiceAll() {

    if (saveAdmissionIsDone && $("#admnId").val() == "") {
        linerAlertify("ذخیره انجام شده است , امکان حذف خدمت وجود ندارد.", "danger", admission.delay);
        return
    }

    $("#tempService").html("");
    arr_tempService = [];

    $("#sumRowService").addClass("displaynone");
    $(".sumNetPrice").text("");
    $(`#tempService`).html(emptyRowHTML);
    $("#amount").val("");

    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);

    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#attenderId").prop("disabled", arr_tempService.length > 0);

    $(".setprescription-check,.infoprescription,#tryGetPrescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");//.css("pointer-event", arr_tempService.length > 0?"none":"all")
    $("#diagnosisComment,#diagnosisCode,#serviceLaboratoryGroupId").prop("disabled", arr_tempService.length > 0);

    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);

    if (+$("#referringDoctorId").val() != 0) {
        $("#prescriptionDatePersian").prop("disabled", arr_tempService.length > 0);
    }

    $("#addService").prop("disabled", false);
    $("#removeAllService").prop("disabled", true);

    $("#editSectionPatient").prop("disabled", arr_tempService.length > 0 || $("#admnId").val() != 0);
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
        $("#reserveNo").val(res.reserveNo);
        $("#reserveDate").val(reserveDateTime);
        $("#scheduleBlockId").val(res.scheduleBlockId)
    }
}

function saveAdmission(saveOrPrint = "saveForm") {

    if ($("#saveForm").attr("disabled") === "disabled" || $("#saveFormAndPrint").attr("disabled") === "disabled" || $("#saveAndSendToWebService").attr("disabled") === "disabled")
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
        if (+$("#reserveNo").val() === 0 || $("#reserveDate").val() === "" || $("#reserveShift").val() == "0" || $("#scheduleBlockId").val() == "") {
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
        linerAlertify(admission.notHasService, "warning", admission.delay);
        $("#saveForm").removeAttr("disabled");
        $("#saveFormAndPrint").removeAttr("disabled");
        $("#saveAndSendToWebService").removeAttr("disabled");
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


    let newPriscriptionDatePersian = "", newReferringDoctorId = "";
    let prescriptiondatee = $("#content-page #tempPrescription .highlight").data("prescriptiondate")
    let attenderfullnamee = $("#content-page #tempPrescription .highlight").data("attenderfullname")
    let attenderfullnamesplit = attenderfullnamee.split("-")

    let checkSinglePartArrayLength = false
    for (i = 0; i < attenderfullnamesplit.length; i++) {
        if (attenderfullnamesplit[i].length == 0)
            checkSinglePartArrayLength = true
    }

    if (attenderfullnamesplit.length == 2 && checkSinglePartArrayLength == false) {

        newReferringDoctorId = +$("#referringDoctorId").val() == 0 ? null : +$("#referringDoctorId").val()
        newPriscriptionDatePersian = prescriptiondatee

    }
    else {

        if ($("#referringDoctorId").val() == 0) {
            linerAlertify("داکتر ارجاع دهنده را وارد کنید", "warning", admission.delay);
            $("#referringDoctorId").focus();
            $("#referringDoctorId").prop("disabled", false);
            return
        }
        if ($("#prescriptionDatePersian").val() == null || $("#prescriptionDatePersian").val() == "") {
            linerAlertify("تاریخ نسخه را وارد کنید", "warning", admission.delay);
            $("#prescriptionDatePersian").focus();
            return
        }

        newReferringDoctorId = +$("#referringDoctorId").val() == 0 ? null : +$("#referringDoctorId").val()
        newPriscriptionDatePersian = $("#prescriptionDatePersian").val()
    }


    $("#saveForm").attr("disabled", "disabled");
    $("#saveFormAndPrint").attr("disabled", "disabled");
    $("#saveAndSendToWebService").attr("disabled", "disabled");


    let nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    let mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();
    let model_patient = {
        id: +$("#patientId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        genderId: +$("#genderId").val(),
        countryId: +$("#countryId").val() == 0 ? 101 : +$("#countryId").val(),
        nationalCode: nationalCode,
        mobileNo: mobileNo,
        address: $("#address").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
        educationLevelId: +$("#educationLevelId").val()
    };


    let admissionExtraPropertyList = buildAdmissionExtraPropertyList(newPriscriptionDatePersian);
    let workflowId = 155;
    let stageId = taminStageId;

    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];

    var model_adm = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admissionMasterId").val(),
        admissionMasterWorkflowId: workflowId,
        admissionMasterStageId: admissionStage.admissionMasterOutPatient.id,
        stageId,
        actionId: +$("#admnId").val() > 0 ? adm_actionTaminId : 0,
        workflowId,
        bookingTypeId: 2,
        medicalSubjectId: 1,
        admissionTypeId: 3,
        basicInsurerId: dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId,
        compInsurerId: +dropDownCacheData.compInsurerId == 0 ? null : +dropDownCacheData.compInsurerId,
        compInsurerLineId: +dropDownCacheData.compInsurerLineId == 0 ? null : +dropDownCacheData.compInsurerLineId,
        thirdPartyInsurerId: +dropDownCacheData.thirdPartyInsurerId == 0 ? null : +dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: +dropDownCacheData.discountInsurerId == 0 ? null : +dropDownCacheData.discountInsurerId,
        attenderId: +$("#attenderId").val(),
        reserveDatePersian: reserveDatePersian,
        reserveTime: reserveTime,
        reserveShiftId: $("#reserveShift").val(),
        reserveNo: +$("#reserveNo").val(),
        attenderScheduleBlockId: $("#scheduleBlockId").val(),
        referringDoctorId: newReferringDoctorId,
        admissionExtraPropertyList: admissionExtraPropertyList.length == 0 ? null : admissionExtraPropertyList,
        admissionPatient: model_patient,
        admissionLineServiceList: arr_tempService,
    }


    if ($("#admnId").val() == "") {
        if (!saveAdmissionIsDone)
            saveAdmissionAjax(model_adm, saveOrPrint)
        else {
            if (saveOrPrint == "saveForm" || saveOrPrint == "saveFormAndPrint") {
                $("#saveForm").prop("disabled", false);
                $("#saveFormAndPrint").prop("disabled", false);
                $("#saveAndSendToWebService").prop("disabled", false);
                linerAlertify("ذخیره انجام شده است , دکمه ذخیره و ارسال به وب سرویس را بزنید.", "warning", admission.delay);
            }
            else
                sendEPrescription(saveAdmissionDetails)
        }
    }
    else {
        saveAdmissionAjax(model_adm, saveOrPrint)
    }

}

function buildAdmissionExtraPropertyList(prescriptionDatePersian) {

    let admissionExtraPropertyList = []

    //admissionExtraProperty 4
    if (checkResponse(inqueryID) && inqueryID != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.inqueryId,
            elementValue: inqueryID
        })
    }

    //admissionExtraProperty 30
    if (checkResponse(patientInsurer) && patientInsurer.responsibleNationalCode != "") {
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


    //admissionExtraProperty 21
    if (prescriptionDatePersian != "") {

        let prescriptionDateShmasi = prescriptionDatePersian
        let prescriptionDateMiladi = moment.from(prescriptionDateShmasi, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');

        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.prescriptionDate,
            elementValue: prescriptionDateMiladi
        })
    }

    //admissionExtraProperty 11
    if (checkResponse(prescriptionVars.ePrescriptionId) && +prescriptionVars.ePrescriptionId != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.requestEPrescriptionId,
            elementValue: prescriptionVars.ePrescriptionId
        })
    }

    //admissionExtraProperty 15
    if (checkResponse(prescriptionVars.provinceName) && prescriptionVars.provinceName != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.provinceName,
            elementValue: prescriptionVars.provinceName
        })
    }

    //admissionExtraProperty 17
    if (checkResponse(prescriptionVars.nationalCode) && +prescriptionVars.nationalCode != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.patientNationalCode,
            elementValue: prescriptionVars.nationalCode
        })
    }

    //admissionExtraProperty 18
    if (checkResponse(prescriptionVars.attenderFullName) && prescriptionVars.attenderFullName != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.attenderName,
            elementValue: prescriptionVars.attenderFullName
        })
    }

    //admissionExtraProperty 19
    if (checkResponse(prescriptionVars.attenderMSC) && +prescriptionVars.attenderMSC != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.attenderMSC,
            elementValue: prescriptionVars.attenderMSC
        })
    }

    //admissionExtraProperty 20
    if (checkResponse(prescriptionVars.attenderSpecialityName) && prescriptionVars.attenderSpecialityName != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.attenderSpeciality,
            elementValue: prescriptionVars.attenderSpecialityName
        })
    }

    //admissionExtraProperty 23
    if (checkResponse(prescriptionVars.patientMobile) && +prescriptionVars.patientMobile != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.patientMobile,
            elementValue: prescriptionVars.patientMobile
        })
    }

    //admissionExtraProperty 24
    if (checkResponse(prescriptionVars.reasonForRefer) && prescriptionVars.reasonForRefer != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.referReason,
            elementValue: prescriptionVars.reasonForRefer
        })
    }

    //admissionExtraProperty 22
    if (checkResponse(prescriptionVars.comment) && prescriptionVars.comment != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.comments,
            elementValue: prescriptionVars.comment
        })
    }

    //admissionExtraProperty 13
    admissionExtraPropertyList.push({
        elementId: admissionExtraProperty.serviceTypeId,
        elementValue: 4020
    })

    //admissionExtraProperty 25
    if (+$("#serviceLaboratoryGroupId").val() != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.serviceLaboratoryGroupId,
            elementValue: $("#serviceLaboratoryGroupId").val()
        })
    }

    //admissionExtraProperty 26
    if ($("#diagnosisCode").val() != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.diagnosisCode,
            elementValue: +$("#diagnosisCode").val()
        })
    }

    //admissionExtraProperty 27
    if ($("#diagnosisComment").val() != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.diagnosisComment,
            elementValue: $("#diagnosisComment").val()
        })
    }

    //admissionExtraProperty 14
    if (checkResponse(prescriptionVars.paraTypeCode) && +prescriptionVars.paraTypeCode != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.paraClinicTypeCode,
            elementValue: prescriptionVars.paraTypeCode
        })
    }

    //admissionExtraProperty 16
    if (checkResponse(prescriptionVars.paraTypeName) && prescriptionVars.paraTypeName != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.paraclinicTypeCodeName,
            elementValue: prescriptionVars.paraTypeName
        })
    }

    return admissionExtraPropertyList

}

function saveAdmissionAjax(model_adm, saveOrPrint) {

    let viewData_save_admission = `${viewData_baseUrl_MC}/AdmissionApi/insert`

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
                $("#saveAndSendToWebService").prop("disabled", false);

                if (result.validationErrors !== null) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
            }
            else if (result.data.status === 100) {
                linerAlertify(result.data.statusMessage, "success", admission.delay);
                saveAdmissionIsDone = true
                saveAdmissionDetails = result.data.id

                adm_Identity = result.data.id;
                adm_admissionMasterId = result.data.admissionMasterId;
                stageAndWorkflow = { workflowId: model_adm.workflowId, stageId: model_adm.stageId }
                if (!isEditMode()) {

                    if (userInfoLogin.counterTypeId === 3) {
                        if (sumAdmissionLineTamin() > 0) {

                            if (saveOrPrint == "saveForm")
                                navigation_item_click(`${viewData_addTreasury_page_url}/${result.data.admissionMasterId}/2`, viewData_addTreasury_form_title);
                            else if (saveOrPrint == "saveFormAndPrint")
                                printForm(result.data.id, model_adm.stageId, model_adm.workflowId);
                            else
                                sendEPrescription(result.data.id)
                        }
                        else {
                            if (saveOrPrint == "saveForm")
                                navigation_item_click("/MC/Admission", "لیست پذیرش");
                            else if (saveOrPrint == "saveFormAndPrint")
                                printForm(result.data.id, model_adm.stageId, model_adm.workflowId);
                            else
                                sendEPrescription(result.data.id)
                        }
                    }
                    else if (userInfoLogin.counterTypeId === 1) {
                        if (saveOrPrint == "saveForm")
                            navigation_item_click("/MC/Admission", "لیست پذیرش");
                        else if (saveOrPrint == "saveFormAndPrint")
                            printForm(result.data.id, model_adm.stageId, model_adm.workflowId);
                        else
                            sendEPrescription(result.data.id)
                    }
                }
                else {
                    if (saveOrPrint == "saveForm")
                        navigation_item_click("/MC/Admission", "لیست پذیرش");
                    else if (saveOrPrint == "saveFormAndPrint")
                        printForm(result.data.id, model_adm.stageId, model_adm.workflowId);
                    else
                        sendEPrescription(result.data.id)
                }
            }
            else if (result.data.status === -1 || result.data.status === -102) {
                linerAlertify(result.data.statusMessage, "error", admission.delay);
                return
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
            $("#saveAndSendToWebService").removeAttr("disabled");

        }
    });
}

async function sendEPrescription(admissionId) {

    if (registerTaminResult == 1) {
        linerAlertify("ارسال به وب سرویس برای این پذیرش انجام شده است ,امکان انجام دوباره این درخواست میسر نیست.", "warning", admission.delay);
        setTimeout(() => {
            navigation_item_click("/MC/Admission", "لیست پذیرش");
        }, 1000)
        return
    }

    linerAlertify("درخواست ارسال به وب سرویس در حال انجام است لطفا شکیبا باشید", "success", 4);
    loadingAsync(true, "saveAndSendToWebService", "fa fa-save");
    const blockPage = document.createElement("div");
    $(blockPage).attr("id", "blockPage")
    $(blockPage).css("position", "absolute")
    $(blockPage).css("height", "100%")
    $(blockPage).css("width", "100%")
    $(blockPage).css("top", "0px")
    $(blockPage).css("z-index", "9999")
    $("#content").append(blockPage)

    $(".nav-item-mm").css("pointer-events", "none")
    $("#saveForm").prop("disabled", true);
    $("#saveFormAndPrint").prop("disabled", true);
    $("#saveAndSendToWebService").prop("disabled", true);

    var data = [];
    data.push(+admissionId);

    sendEPrescriptionTamin(data)
        .then(result => {
            $(".nav-item-mm").css("pointer-events", "auto")
            loadingAsync(false, "saveAndSendToWebService", "fa fa-save");
            $(blockPage).remove()

            if (result.successfull) {
                linerAlertify(result.statusMessage, "success", 4);
                setTimeout(() => {
                    navigation_item_click("/MC/Admission", "لیست پذیرش");
                }, 1000)
            }
            else if (checkResponse(result.data) && result.data.length > 0) {

                $("#wcfTaminBody").html("");
                let str = "";

                for (var ix = 0; ix < result.data.length; ix++) {
                    let dataRes = result.data[ix].item2;
                    let id = result.data[ix].item1;

                    dataRes.problems = dataRes.problems == null ? [] : dataRes.problems;
                    if (typeof dataRes.problems !== "undefined" && dataRes.problems.length == 0)
                        str += `<tr><td>${id}</td><td>${dataRes.status} - ${dataRes.statusDesc}</td></tr>`
                    else
                        str += generateErrorStringTamin(dataRes.problems, id, true);
                }

                $("#wcfTaminBody").append(str);
                linerAlertify("درخواست ارسال به وب سرویس با خطا مواجه شده است", "warning", 4);
                modal_show("wcf_tamin_error_result");
            }
            else if (!result.successfull && result.status === 401) {
                linerAlertify(result.statusMessage, "warning", 4);
                $("#saveForm").prop("disabled", false);
                $("#saveFormAndPrint").prop("disabled", false);
                $("#saveAndSendToWebService").prop("disabled", false);
            }

        })
        .catch(err => {
            linerAlertify("درخواست با مشکل روبه رو شده است، دوباره تلاش کنید.", "warning", 4);
            loadingAsync(false, "saveAndSendToWebService", "fa fa-save");
            $(".nav-item-mm").css("pointer-events", "auto")
            $(blockPage).remove()
        })
}

async function sendEPrescriptionTamin(data) {
    let viewData_send_ePrescription_url = `${viewData_baseUrl_MC}/tamin/sendeprescription`
    let response = await $.ajax({
        url: viewData_send_ePrescription_url,
        type: "PUT",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_send_ePrescription_url);
            return "";
        }
    });

    return response;
}

function printForm(admissionId, stageId, workflowId) {

    if (printUrl === "" || !printUrl.includes(".mrt")) {
        modal_show("printAdmissionModal");
    }
    else {
        adm_print(admissionId, adm_admissionMasterId, printUrl, stageId, workflowId);
        navigation_item_click("/MC/Admission", "لیست پذیرش");
    }
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
        printAdmission('Prn_AdmissionDouble.mrt')
    }
}

function resetAdmissionTamin() {

    form = $('#patientForm').parsley();
    form.reset();

    resetPatientInfo();
    resetPrescription();
    $("#tryGetPrescription").prop("disabled", true);
    fillOwnerPrescription("...", "...", "...", "...", "...");

    //-----------------------------
    $(`#temptimeShiftDays`).html("");
    // ----------------------------

    $("#admBox").addClass("d-none");
    $("#admnId").val("");
    $("#dateTime").val("");
    $("#userFullName").val("");
    $("#saveForm").removeAttr("disabled");
    $("#saveFormAndPrint").removeAttr("disabled");
    $("#saveAndSendToWebService").removeAttr("disabled");

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
    $("#patientForm .form-control:not(#patientId , #birthDatePersian)").removeAttr("disabled");
    $("#serviceForm").removeAttr("disabled");
    $("#cashForm").removeAttr("disabled");
    $("#editSectionPatient")


    //$("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change");
    //$(".select2").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change");

    //setDefaultValueInsurerId();

    loadSelectDependedent();


    $("#serviceLaboratoryGroupId").attr('disabled', 'disabled');
    //$("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");
    //$(".select2").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");
    $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
    $("#admissionMasterId").val("").prop("disabled", true)
    $("#referringDoctorId").val(null).trigger("change")



    patientId = 0;
    insurancesList = [];
    patientInsurer = null;
    attenderMsc = "0";
    //attenderMscTypeId = 0;
    registerTaminResult = null
    inqueryID = 0;
    saveAdmissionIsDone = false
    arr_tempService = [];
    adm_Identity = 0;
    adm_admissionMasterId = 0;
    stageAndWorkflow = {}
    attenderBookingEnabled = false;
    //insurExpDateValid = true;
    priscriptionDateValid = true;
    attenderScheduleValid = false;
    entitlement = 1;
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
}

function adm_print(admId, admissionMasterId, printurl, stageId, workflowId) {

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
            let bcTargetPrintprescription = doubleprintBarcode(element, admId, stageId, workflowId)
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
    let admissionId = +$("#admnId").val();
    let viewData_get_admission = `${viewData_baseUrl_MC}/AdmissionApi/display`

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

    adm_actionTaminId = ad.actionId;
    $("#admnId").val(ad.id);
    $("#dateTime").val(ad.createDateTimePersian);
    $("#userFullName").val(ad.createUserFullName);
    $("#stageName").val(`${ad.stageId} - ${ad.stageName}`);
    $("#admBox").removeClass("d-none");
    $("#workflowName").val(`${ad.workflowId} - ${ad.workflowName}`);
    admissionTaminId = ad.id;
    inqueryID = ad.inqueryID
    arr_tempService = [];
    arr_tempCash = [];
    isAfterFill = true;
    isEditTamin = true;

    $("#attenderId").val(ad.attenderId).prop("disabled", true).trigger("change");

    if (ad.referringDoctorId !== 0) {
        var refDoctorOption = new Option(`${ad.referringDoctorId} - ${ad.referringDoctorName}`, ad.referringDoctorId, true, true);
        $("#referringDoctorId").append(refDoctorOption).trigger('change');
    }


    admissionReserveDateTimePersian = `${ad.reserveTime.trim()} ${ad.reserveDatePersian.trim()}`;

    $("#referringDoctorId").prop("disabled", true);
    $("#admissionMasterId").val(ad.admissionMasterId);


    fillReserveShift([{
        id: ad.reserveShiftId,
        text: `${ad.reserveShiftId} - ${ad.reserveShiftName}`
    }])

    //$("#reserveShift").val(ad.reserveShiftId);
    $("#prescriptionDatePersian").val(ad.prescriptionDatePersian).prop("disabled", true);
    $("#reserveNo").val(ad.reserveNo);
    $("#reserveDate").val(admissionReserveDateTimePersian);
    $("#scheduleBlockId").val(ad.attenderScheduleBlockId)


    // patient Section
    $("#patientId").val(ad.patientId);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#getDeserveInfo").prop("disabled", true);

    if (+ad.basicInsurerLineId === 0)
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
    else
        $("#basicInsurerLineId").val(`1-${ad.basicInsurerLineId}`).prop("disabled", true).trigger("change");

    if (ad.discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${ad.discountInsurerId}`).prop("disabled", true).trigger("change");
    else
        $("#discountInsurerId").val(0).prop("disabled", true).trigger("change");

    if (ad.compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${ad.compInsurerLineId}-${ad.compInsurerId}`).prop("disabled", true).trigger("change");
    else if (ad.thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${ad.thirdPartyInsurerId}`).prop("disabled", true).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).prop("disabled", true).trigger("change");


    $("#serviceLaboratoryGroupId").val(ad.serviceLaboratoryGroupId).attr("disabled", "disabled").trigger('change');
    $("#diagnosisCode").val(ad.diagnosisCode).attr("disabled", "disabled").trigger('change');
    $("#diagnosisComment").val(ad.diagnosisComment).attr("disabled", "disabled").trigger('change');
    $("#firstName").val(ad.firstName).prop("disabled", true);
    $("#lastName").val(ad.lastName).prop("disabled", true);

    $("#countryId").val(ad.countryId).trigger('change')
    $("#birthDatePersian").val(ad.birthDatePersian).prop("disabled", true);
    $("#genderId").val(ad.genderId).trigger("change");
    $("#mobile").val(ad.mobileNo);
    $("#address").val(ad.address)
    $("#idCardNumber").val(ad.idCardNumber)
    $("#postalCode").val(ad.postalCode)
    $("#jobTitle").val(ad.jobTitle)
    $("#phoneNo").val(ad.phoneNo)
    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change");
    $("#educationLevelId").val(ad.educationLevelId).trigger("change");
    $("#fatherFirstName").val(ad.patientFatherFirstName)

    fillOwnerPrescription(ad.firstName + " " + ad.lastName, ad.nationalCode, "...", "...", "...");



    if (checkResponse(ad.responsibleNationalCode))
        patientInsurer.responsibleNationalCode = ad.responsibleNationalCode

    if (checkResponse(ad.relationType))
        patientInsurer.relationType = ad.relationType

    if (checkResponse(ad.covered))
        patientInsurer.covered = ad.covered

    if (checkResponse(ad.recommendationMessage))
        patientInsurer.recommendationMessage = ad.recommendationMessage

    registerTaminResult = ad.registerTaminResult
    $("#searchPatient").prop("disabled", true)
    $("#editSectionPatient").prop("disabled", true)

    //service Section
    if (ad.admissionLineList !== null)
        if (ad.admissionLineList.length > 0) {
            var modelServiceLine = null,
                admLineLen = ad.admissionLineList.length;
            for (var q = 0; q < admLineLen; q++) {

                var adsl = ad.admissionLineList[q];

                //  sumAdmLineServiceEdit += adsl.amountWithVat;

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

    let prsData = [{
        ePrescriptionId: ad.requestEPrescriptionId != null ? ad.requestEPrescriptionId : "",
        paraTypeCode: ad.paraClinicTypeCode != null ? ad.paraClinicTypeCode : "",
        paraTypeName: ad.paraclinicTypeCodeName != null ? ad.paraclinicTypeCodeName : "",
        patientMobile: ad.patientMobile != null ? ad.patientMobile : "",
        provinceName: ad.provinceName != null ? ad.provinceName : "",
        nationalCode: ad.patientNationalCode != null ? ad.patientNationalCode : "",
        attenderFullName: ad.attenderName != null ? ad.attenderName : "",
        attenderMSC: ad.attenderMSC != null ? ad.attenderMSC : "",
        attenderSpecialityName: ad.attenderSpeciality != null ? ad.attenderSpeciality : "",
        prescriptionDate: ad.prescriptionDatePersian != null ? ad.prescriptionDatePersian : "",
        reasonForRefer: ad.referReason != null ? ad.referReason : "",
        comment: ad.comments != null ? ad.comments : "",

    }]

    attenderMsc = ad.attenderMSC != null ? ad.attenderMSC : ""
    appendPrescriptionInfo(prsData);


    $("#addService").prop("disabled", arr_tempService.length > 0);
    $("#removeAllService").prop("disabled", arr_tempService.length == 0);
    $("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $(".setprescription-check,.infoprescription,#tryGetPrescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");
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

function getPatientInsurer() {
    if
        (+$("#patientId").val() == 0) {
        $("#tempPatientI").html(fillEmptyRow(8));
        displayCountRowModal(len, "searchPatientInsurerModal");
        return;
    }

    //var patientSearchModel = {
    //    patientId: +$("#patientId").val(),
    //}

    let patientId = +$("#patientId").val()

    patientInsurerSearch(patientId, true);
}

function resetPatientInfo(opr) {


    if (+$("#admnId").val() != 0) {
        $("#nationalCode").prop("disabled", true).focus();
        $("#firstName").prop("disabled", true);
        $("#lastName").prop("disabled", true);
        $("#getDeserveInfo").prop("disabled", true);
        $("#searchPatient").prop("disabled", true)
    }
    else {
        $("#nationalCode").prop("disabled", false).focus();
        $("#firstName").prop("disabled", false);
        $("#lastName").prop("disabled", false);
        $("#getDeserveInfo").prop("disabled", false);
        $("#searchPatient").prop("disabled", false)
    }

    $("#attenderId").prop("disabled", false);
    $("#editSectionPatient").prop("disabled", true);


    //$("#compInsurerThirdPartyId").prop("disabled", false)
    //$("#discountInsurerId").prop("disabled", false)

    $("#basicInsurerLineId").prop("disabled", true)


    loadingDonePersonByBirth();

    var firstName = $("#firstName").val() === "" ? "" : $("#firstName").val(),
        lastName = $("#lastName").val() === "" ? "" : $("#lastName").val(),
        nationalCode = $("#nationalCode").val();

    resetPerscription(`${firstName} ${lastName}`, nationalCode);
}

function resetPerscription(name, nationalCode) {
    removeFromTempServiceAll();

    $("#addService").prop("disabled", true);
    $("#removeAllService").prop("disabled", true);
    $("#prescriptionForm button").prop("disabled", true);
    $("#prescriptionForm input").val("").prop("disabled", true);
    $("#prescriptionForm select").val(0).trigger("change").prop("disabled", true);
    $("#prescriptionForm table tbody").html(fillEmptyRow(11));
    fillOwnerPrescription(name, nationalCode, "...", "...", "...");
}

function setPatientInsurer(rowNumber) {

    patientInsurer = insurancesList.find(ii => ii.rowNumber === rowNumber);
    inqueryID = patientInsurer.inquiryId;

    $("#basicInsurerLineId").val(`1-${patientInsurer.basicInsurerLineId}`).trigger("change");
    //$("#insurExpDatePersian").val(patientInsurer.expireDate);
    //$("#insurNo").val(patientInsurer.insuranceNumber);
    $("#workshopName").val(patientInsurer.workShopName);
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
        $("#tryGetPrescription").focus();
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
        return;
    }
    if (nationalCode.length < 10) {
        linerAlertify("کدملی کمتر از 10 کاراکتر نمی تواند باشد", "warning");
        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        $("#nationalCode").focus()
        return;
    }
    let url = `${viewData_baseUrl_MC}/tamin/deserveinfo/${nationalCode}`;

    await fetchManager(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then((result) => {

        if (checkResponse(result) && result.successfull) {
            if (result.problems.length > 0)
                return afterFailedRequest(generateErrorStringTamin(result.problems), 15, true);

            fillPatientByDeserveInfo(result.data, nationalCode);
        }
        else
            return afterFailedRequest("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", alertify_delay);
    });
}

function afterFailedRequest(message, messageTime, successfull = false) {
    resetPatientInfo();
    resetPrescription();

    var firstName = $("#firstName").val() === "" ? "" : $("#firstName").val(),
        lastName = $("#lastName").val() === "" ? "" : $("#lastName").val(),
        nationalCode = $("#nationalCode").val();

    fillOwnerPrescription(`${firstName} ${lastName}`, nationalCode, "...", "...", "...");
    loadingAsync(false, "getDeserveInfo", "fas fa-users");
    $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");

    linerAlertify(message, "warning", messageTime);

    if (successfull) {
        $("#firstName,#lastName,#nationalCode,#getDeserveInfo").prop("disabled", true);
        $("#editSectionPatient,#tryGetPrescription").prop("disabled", false);
    }
    $("#genderId").select2("focus");
    return false;
}

function resetPrescription() {
    $("#tempPrescription").html(fillEmptyRow(11));
    $("#errorPrs").html("").addClass("d-none");
    prescriptionVars.paraTypeCode = 0;
    prescriptionVars.ePrescriptionId = 0;
}

async function loadingAsync(loading, elementId, iconClass) {

    if (loading)
        $(`#${elementId} i`).removeClass(iconClass).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(iconClass);

}

function fillPatientByDeserveInfo(result, nationalCode) {

    let isTamin = result.hasHealthDeserve;

    fillOwnerPrescription($("#firstName").val() + "  " + $("#lastName").val(), $("#nationalCode").val(), "...", "...", "...");

    $("#basicInsurerLineId").val(isTamin ? "1-1" : "1-73").prop("disabled", true).trigger("change");
    $("#birthDatePersian").val(result.birthDate).prop("disabled", true);
    $("#firstName").val(result.firstName).prop("disabled", true);
    $("#lastName").val(result.lastName).prop("disabled", true);
    $("#nationalCode,#getDeserveInfo").prop("disabled", true);
    $("#editSectionPatient,#tryGetPrescription").prop("disabled", false);
    $("#genderId").select2("focus");
    inqueryID = result.trackingCode
    $("#searchPatient").prop("disabled", true)
    loadingAsync(false, "getDeserveInfo", "fas fa-users");
}

async function getDataPrescriptionInfo(nationalCode) {

    if (nationalCode == "") {
        linerAlertify("نمبر تذکره را وارد نمایید", "warning");
        return
    }

    await loadingAsync(true, "tryGetPrescription", "fa fa-undo-alt");

    let url = `${viewData_baseUrl_MC}/tamin/geteprescriptionbynationalcode/${nationalCode}/00000`;
    await fetchManager(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then((result) => {
        loadingAsync(false, "tryGetPrescription", "fa fa-undo-alt");
        resetPrescription();
        if (checkResponse(result) && result.successfull) {

            if (result.problems.length > 0) {
                linerAlertify(generateErrorStringTamin(result.problems), "warning");
                return
            }

            appendPrescriptionInfo(result.data);

        }
        else {
            linerAlertify("پاسخی از وب سرویس دریافت نشد. دوباره تلاش نمایید", "warning");
        }
    });
}

function fillOwnerPrescription(name = null, nationalCode = null, prescriptionType = null, prescriptionCode = null, attenderName = null) {

    $("#ownerName").text(name == null ? $("#ownerName").text() : name);
    $("#ownerNationalCode").text(nationalCode == null ? $("#ownerNationalCode").text() : nationalCode);
    $("#ownerPrescriptionType").text(prescriptionType == null ? $("#ownerPrescriptionType").text() : prescriptionType);
    $("#ownerPrescriptionNo").text(prescriptionCode == null ? $("#ownerPrescriptionNo").text() : prescriptionCode);
    $("#ownerAttenderName").text(attenderName == null ? $("#ownerAttenderName").text() : attenderName);
}//ok

function appendPrescriptionInfo(res) {

    let result = res == null || typeof res == "undefined" ? [] : res;
    let resLn = result.length, output = "", data = {};
    ColumnResizeable("tablePrescription");

    for (var i = 0; i < resLn; i++) {
        data = result[i];

        output += `<tr id="row${i + 1}" data-attenderFullName="${data.attenderFullName}" data-prescriptionDate="${data.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')}" onclick='setPrescriptionInfo(${i + 1},$("#row${i + 1} .setprescription-check"),${JSON.stringify(data)})'>
                          <td>${data.ePrescriptionId}</td>
                          <td>${data.provinceName}</td>
                          <td>${data.paraTypeCode} - ${data.paraTypeName}</td>
                          <td>${data.nationalCode}</td>
                          <td>${data.attenderFullName}</td>
                          <td>${data.attenderMSC}</td>
                          <td>${data.attenderSpecialityName}</td>
                          <td>${data.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')}</td>
                          <td>${data.reasonForRefer == null ? "" : data.reasonForRefer}</td>
                          <td>${data.comment == null ? "" : data.comment}</td>
                          <td>
                              <button type="button" id="getPrescriptionInfoDetailsId${i + 1}" onclick="getPrescriptionInfoDetails('${data.ePrescriptionId}','${data.paraTypeCode}',${i + 1},'tablePrescription','getPrescriptionInfoDetailsId${i + 1}')" class="btn btn-info infoprescription"  data-toggle="tooltip" data-placement="bottom" data-original-title="جزئیات">
                                   <i class="fa fa-info"></i>
                              </button>
                              <button type="button" onclick='setPrescriptionInfo(${i + 1},this,${JSON.stringify(data)})'
                                       class="btn btn-success setprescription-check"  data-toggle="tooltip" data-placement="bottom" data-original-title="جزئیات">
                                   <i class="fa fa-check"></i>
                              </button>
                          </td>
                      </tr>`;
    }

    $("#tempPrescription").html(output);

    $("#tempPrescription .setprescription-check:eq(0)").click();
}

async function setPrescriptionInfo(rowNo, elm, dataPrs) {

    prescriptionVars.ePrescriptionId = dataPrs.ePrescriptionId;
    prescriptionVars.paraTypeCode = dataPrs.paraTypeCode;
    prescriptionVars.paraTypeName = dataPrs.paraTypeName;
    prescriptionVars.patientMobile = dataPrs.patientMobile;
    prescriptionVars.provinceName = dataPrs.provinceName;
    prescriptionVars.nationalCode = dataPrs.nationalCode;
    prescriptionVars.attenderFullName = dataPrs.attenderFullName;
    prescriptionVars.attenderMSC = dataPrs.attenderMSC;
    attenderMsc = dataPrs.attenderMSC
    prescriptionVars.attenderSpecialityName = dataPrs.attenderSpecialityName;
    prescriptionVars.prescriptionDate = dataPrs.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
    prescriptionVars.reasonForRefer = dataPrs.reasonForRefer;
    prescriptionVars.comment = dataPrs.comment;

    let mode = +prescriptionVars.paraTypeCode == 2;
    if (isEditTamin) {
        $(`#serviceLaboratoryGroupId`).prop("disabled", !mode).prop("required", mode)
            .parents(".form-group").find(".select2-selection").removeClass("parsley-error").parents(".form-group").find("ul li").html("");

        if (mode)
            $(`#serviceLaboratoryGroupId`).attr("data-parsley-selectvalzero", "");
        else
            $(`#serviceLaboratoryGroupId`).removeAttr("data-parsley-selectvalzero");

        $(`#diagnosisCode`).prop("disabled", !mode).prop("required", mode).removeClass("parsley-error").parents(".form-group").find("ul li").html("");
        $(`#diagnosisComment`).prop("disabled", !mode).removeClass("parsley-error").parents(".form-group").find("ul li").html("");
    }
    else {
        if (mode === true) {

            $(`#serviceLaboratoryGroupId`).prop("disabled", !mode).prop("required", mode).val(4).trigger("change").parents(".form-group").find(".select2-selection")
                .removeClass("parsley-error").parents(".form-group").find("ul li").html("");

            if (mode)
                $(`#serviceLaboratoryGroupId`).attr("data-parsley-selectvalzero", "");
            else
                $(`#serviceLaboratoryGroupId`).removeAttr("data-parsley-selectvalzero");

            $(`#diagnosisCode`).prop("disabled", !mode).prop("required", mode).val(1).removeClass("parsley-error").parents(".form-group").find("ul li").html("");
            $(`#diagnosisComment`).prop("disabled", !mode).val("").removeClass("parsley-error").parents(".form-group").find("ul li").html("");

        }
        else {

            $(`#serviceLaboratoryGroupId`).prop("disabled", !mode).prop("required", mode).val(0).trigger("change").parents(".form-group").find(".select2-selection")
                .removeClass("parsley-error").parents(".form-group").find("ul li").html("");

            if (mode)
                $(`#serviceLaboratoryGroupId`).attr("data-parsley-selectvalzero", "");
            else
                $(`#serviceLaboratoryGroupId`).removeAttr("data-parsley-selectvalzero");

            $(`#diagnosisCode`).prop("disabled", !mode).prop("required", mode).val("").removeClass("parsley-error").parents(".form-group").find("ul li").html("");
            $(`#diagnosisComment`).prop("disabled", !mode).prop("required", mode).val("").removeClass("parsley-error").parents(".form-group").find("ul li").html("");
        }

    }

    if (mode)
        $("#diagnosisComment,#diagnosisCode,#serviceLaboratoryGroupId").prop("disabled", arr_tempService.length > 0);


    taminStageId = mode ? admissionStage.admissionTaminLaboratory.id : admissionStage.admissionTaminParaClinic.id;

    $(`#tempPrescription tr`).removeClass("highlight");
    $(`#row${rowNo}`).addClass("highlight");

    $(`.setprescription-check`).removeClass("green_outline_1").addClass("btn-success");
    $(elm).addClass("green_outline_1").removeClass("btn-success").blur();

    $("#errorPrs").html("").addClass("d-none");
    fillOwnerPrescription(null, null, prescriptionVars.paraTypeCode + " - " + prescriptionVars.paraTypeName, prescriptionVars.ePrescriptionId, prescriptionVars.attenderFullName);
    $("#addService").prop("disabled", false);
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

window.Parsley._validatorRegistry.validators.nationalcodeadmission = undefined;
window.Parsley.addValidator('nationalcodeadmission', {
    validateString: function (value) {
        return isValidIranianNationalCode(value);
    },
    messages: {
        en: 'فرمت نمبر تذکره صحیح نیست .',
    }
});

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

$("#searchPatient").on("click", function () {

    $("#patientListPagetable thead tr").html(`
                   <th class="col-width-percent-3">ردیف</th>
                                <th class="col-width-percent-8">نوع مراجعه</th>
                                <th class="col-width-percent-4">شناسه</th>
                                <th class="col-width-percent-7">کدملی</th>
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

    //$("#searchPatientBasicInsurerLineId").val("1-1").prop("disabled", true).trigger("change")

    displayCountRowModal(0, "searchPatientModal");

});

$("#searchPatientAdmission").on("click", function () {

    if (
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

$("#getDeserveInfo").on("click", function () {

    loadingAsync(true, "getDeserveInfo", "fas fa-users");
    getPatientByDeserveInfo($("#nationalCode").val());

});

$("#mobile").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        if ($("#tryGetPrescription").attr("disabled")) {
            linerAlertify("استحقاق درمان انجام نشده است", "warning");
            $("#getDeserveInfo").focus()
        }
        else
            $("#tryGetPrescription").focus()
    }
})

$("#searchPatientModal").on('shown.bs.modal', function () {
    resetSearchPatient();
    //OpenSearchPanelByNationalCode();
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();

});

$("#editSectionPatient").on("click", function () {
    if (saveAdmissionIsDone && $("#admnId").val() == "") {
        linerAlertify("ذخیره انجام شده است , امکان ویرایش وجود ندارد.", "danger", admission.delay);
        return
    }

    resetPatientInfo()

    $(this).prop("disabled", true);
});

$("#countryId").on("change", function () {
    if (+$("#countryId").val() == 0)
        $("#countryId").prop('selectedIndex', 0).trigger("change");
});

$("#basicInsurerLineId").on("change", function () {

    let basicInsurerLineId = $(this).val()
    let basicInsurerLineTypeId = ""

    $("#searchPatientBasicInsurerLineId").val(basicInsurerLineId).trigger("change.select2");

    if (checkResponse(basicInsurerLineId) && basicInsurerLineId !== 0) {

        basicInsurerLineTypeId = +basicInsurerLineId.split("-")[0]
        basicInsurerLineId = +basicInsurerLineId.split("-")[1]
        setInsurerInfo(basicInsurerLineTypeId, basicInsurerLineId)

    }
    else
        $(this).prop("selectedIndex", 0).trigger("change");

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
    //admissionCalPrice()
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

    //admissionCalPrice();
});

$("#searchPatientModal").on("shown.bs.modal", function () {
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();
});

$("#searchPatientInsurerModal").on("shown.bs.modal", function () {
    $(`#tempPatientI #pI_0`).addClass("highlight");
    $(`#tempPatientI #pI_0 > td > button`).focus();
});

$("#showReserve").on("click", function () {

    if (saveAdmissionIsDone && $("#admnId").val() == "") {
        linerAlertify("ذخیره انجام شده است ,امکان تغییر شیفت وجود ندارد.", "warning", admission.delay);
        return
    }

    var attenderId = +$("#attenderId").val();
    if (attenderId === 0) {
        linerAlertify(admission.select_attender, "warning", admission.delay);
        return;
    }

    reserve_init(attenderId)
    modal_show("reserveModal");
});

$("#list_adm").on("click", function () {
    navigation_item_click("/MC/Admission", "لیست پذیرش");
});

$("#newForm").on("click", function () {

    if (saveAdmissionIsDone && $("#admnId").val() == "") {
        linerAlertify("ذخیره انجام شده است , امکان انجام عملیات جدید وجود ندارد.", "warning", admission.delay);
        return
    }

    $("#attenderId").select2("focus");

    alertify.confirm('', msg_confirm_new_page,
        function () {
            resetAdmissionTamin();
        },
        function () {
            linerAlertify("انصراف", "error");
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' })

});

$("#saveForm").on("click", function () {
    saveAdmission("saveForm");
});

$("#saveFormAndPrint").on("click", function () {
    saveAdmission("saveFormAndPrint");
});

$("#saveAndSendToWebService").on("click", function () {
    saveAdmission("saveAndSendToWebService");
})

$("#nationalCode").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter && /*+basicInsurer.id === 8000*/dropDownCacheData.basicInsurerId === 8000 && $("#nationalCode").val().length === 16) {
        var valScannr = $(this).val();
        $(this).val(valScannr.substring(0, 10));

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
                $("#genderId").val(result.genderId).trigger("change");;
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

    resetPerscription("...", "...");
    $("#patientId").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#countryId").prop('selectedIndex', 0).trigger("change");
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

$("#printAdmissionModal").on("hidden.bs.modal", function (ev) {

    navigation_item_click("/MC/Admission", "لیست پذیرش");

    if (printUrl !== "")
        adm_print(adm_Identity, adm_admissionMasterId, printUrl, stageAndWorkflow.stageId, stageAndWorkflow.workflowId)

});

$("#referringDoctorId").on("change", function () {

    let referringDoctorIdValue = $(this).val() == null ? 0 : +$(this).val()

    if (referringDoctorIdValue != 0)
        $("#prescriptionDatePersian").prop("disabled", false).prop("required", true);
    else
        $("#prescriptionDatePersian").val("").prop("disabled", true).prop("required", false);

});

$("#attenderId").on("change", function () {

    let attender = $(this)
   
    if (!isAfterFill)
        getShiftReserve();
    else
        isAfterFill = false;

    if (attender.val() == 0) {
        $("#reserveShift").val(0);
        $(`#temptimeShiftDays`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
    }
});

$("#printAdmissionModal").on("keydown", function (e) {

    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1)
        return;

    switchPrintAdmissionModal(e)

});

$("#wcf_tamin_error_result").on("hidden.bs.modal", async function () {
    $("#saveForm").prop("disabled", false);
    $("#saveFormAndPrint").prop("disabled", false);
    $("#saveAndSendToWebService").prop("disabled", false);
    //navigation_item_click("/MC/AdmissionServiceTamin", viewData_modal_title);
});

$("#wcfresultmodal-close").click(() => modal_close("wcf_tamin_error_result"));

$("#addService").on("click", function () {

    var form = $("#lanInputForm").parsley();
    var validate = form.validate();
    validateSelect2(form);

    if (!validate)
        return;

    ValidBeforAddTempServiceAdm();
});

initAdmissionForm(getAdmission, +$("#admnId").val()).then(id => {

    if (!isEditMode()) {
        $("#basicInsurerLineId").val("1-73").trigger("change");
        $("#searchPatientBasicInsurerLineId").val("1-73").trigger("change.select2");
    }

    $("#attenderId").select2("focus");

});

