
var form = $('#patientForm').parsley(),
    arr_tempService = [],
    viewData_modal_title = "پذیرش تامین",
    viewData_controllername = "AdmissionServiceTaminApi",
    patientId = 0,
    adm_Identity = 0,
    adm_admissionMasterId = 0,
    attenderScheduleValid = false,
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: adm_Identity, sqlDbType: 8, size: 0 },
    viewData_compare_date_url = `/api/SetupApi/comparetime`,
    printUrl = "",
    basicInsurerCode = 0,
    compInsurerCode = 0,
    basicInsurer = {},
    basicInsurerId = 0,
    referralUrl = "/MC/Admission",
    isReimburesment = true,
    referralTitle = "پذیرش",
    insurancesList = [],
    patientInsurer = null,
    getlastdayofyear = getLastDayOfYear(),
    inqueryID = 0,
    referringDoctorInfo = null,
    prescriptionVars = { ePrescriptionId: 0, paraTypeCode: 0 },
    isTamin = false,
    isAfterFill = false,
    isEditTamin = false,
    disabledInsurers = [1, 2, 37],
    newPriscriptionDatePersian = "",
    newReferringDoctorId = "",
    admissionTypeId = 0,
    saleTypeId = 0,
    admId = 0,
    admissionId = 0,
    admissionServiceId = 0,
    formLoaded = false,
    patientFullname = "",
    nationalCode = "",
    isPatientUndefined = false,
    dropDownCacheData = {
        compInsurerId: null,
        compInsurerLineId: null,
        thirdPartyInsurerId: null,
        basicInsurerId: 0,
        basicInsurerLineId: 0,
        basicInsurerLineTerminologyCode: 0,
        basicInsurerLineName: "",
        discountInsurerId: null
    },
    userInfoLogin = "",
    admissionMasterInfo = {
        admissionMasterActionId: 0,
        admissionMasterWorkflowId: 0,
        admissionMasterStageId: 0,
        admActionId: 0,
        admissionAmount: 0,
        admissionMasterAmount: 0,
        sumServiceAmount: 0,
        admissionMasterId: 0,
        admissionId: 0
    },
    firstRunAdmissionsMastertInfo = false,
    firstRunAdmissionsList = false,
    firstRunAdmissionsCash = false,
    admissionReserveDateTimePersian = "";



///////////////////////////////////////////////////////////  START INIT FORM /////////////////////////////////////////////////////////////////
async function initAdmissionForm(callback, admnId) {

    userInfoLogin = getCashIdByUserId()

    $(".select2").select2();

    setInputmask()

    loadSelectDependedent();

    $(".time-slot").addClass("time-slot-newadmission");

    if (admnId !== 0 && !isNaN(admnId))
        callback();
}

function setInputmask() {
    $("#prescriptionDatePersian").inputmask({ 'mask': '9999/99/99' })
    $("#birthDatePersian").inputmask({ 'mask': '9999/99/99' })
}

function isEditMode() {
    if ($("#admnId").val() == "")
        return false;
    else
        return true;
}

function expandAdmission(item) {

    let elmId = $(item).attr("id")

    if (elmId == "expandAdmissionListBtn") {
        if (!firstRunAdmissionsList) {
            firstRunAdmissionsList = true
            getAdmissionListForm($("#admnMasterId").val())
        }
    }
    else if (elmId == "expandAdmissionCashPayInfoBoxBtn") {
        if (!firstRunAdmissionsCash) {
            firstRunAdmissionsCash = true
            displayMasterCashRequest($("#admnMasterId").val())
        }
    }


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

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }
}

function loadSelectDependedent() {
    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true);
    $("#countryId").prop('selectedIndex', 0).trigger("change")

    fill_select2(`api/AdmissionsApi/taminlaboratorygroup_getdropdown`, "serviceLaboratoryGroupId", true, 0, false, 3, "انتخاب", undefined, "", false, true, false, false);
    //fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`, "attenderId", true, userInfoLogin.branchId, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ReferringDoctorApi/getdropdown`, "referringDoctorId", true, 1, true, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", true, `${dropDownCache.discount}/0`);
}

function saveAdmission() {

    var resultOpenCash = checkOpenCashReimbursement(+$("#admnId").val());
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق ویرایش پذیرش امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }

    if ($("#saveForm").attr("disabled") === "disabled")
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (+$("#attenderId").val() === 0) {
        linerAlertify(admission.notHasAttender, "warning", admission.delay);

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

    if (arr_tempService.length === 0) {
        linerAlertify(admission.notHasService, "error", admission.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    if (admissionMasterInfo.medicalRevenue == 3) {
        if (admissionMasterInfo.admissionMasterSettlement == 0) {
            if (+removeSep($("#admissionMasterBalanceVal").text()) != 0) {
                var msg_tabPayment = alertify.warning("پرونده باید تسویه شده باشد");
                msg_tabPayment.delay(admission.delay);
                $("#inOut").select2("focus")
                return
            }
        }
    }


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

    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];

    $("#saveForm").attr("disabled", "disabled");

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
        reserveDatePersian: reserveDatePersian,
        reserveTime: reserveTime,
        address: $("#address").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
        educationLevelId: +$("#educationLevelId").val()
    };

    let admissionCashStageId = admissionMasterInfo.admissionMasterWorkflowCategoryId == 14 ? admissionStage.admissionCashPayment.id : admissionStage.admissionCashRecieve.id

    let admissionExtraPropertyList = buildAdmissionExtraPropertyList(newPriscriptionDatePersian)
    let workflowId = 155
    let stageId = taminStageId

    var model_adm = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admnMasterId").val(),
        admissionMasterWorkflowId: admissionMasterInfo.admissionMasterWorkflowId,
        admissionMasterStageId: admissionMasterInfo.admissionMasterStageId,
        admissionMasterActionId: admissionMasterInfo.admissionMasterActionId,
        actionId: +$("#admnId").val() > 0 ? admissionMasterInfo.admActionId : 0,
        stageId,
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
        reserveShiftId: $("#reserveShift").val(),
        reserveNo: +$("#reserveNo").val(),
        reserveDatePersian: $("#reserveDate").val(),
        attenderScheduleBlockId: $("#scheduleBlockId").val(),
        referringDoctorId: newReferringDoctorId,
        admissionExtraPropertyList: admissionExtraPropertyList.length == 0 ? null : admissionExtraPropertyList,
        admissionPatient: model_patient,
        admissionLineServiceList: arr_tempService,
    }



    var admissionCashLine = {
        id: 0,
        admissionMasterId: admissionCashDetail.admissionMasterId,
        workflowId: +admissionCashDetail.admissionMasterWorkflowId,
        stageId: admissionCashStageId,
        actionId: 0,
        admissionLineCashList: arr_tempCash,
    }

    let modelValue = {
        admissionCashLine,
        admission: model_adm,
        updateAdmission: isReimburesment,
        reimburesment: isReimburesment
    };

    let viewData_save_admission = `${viewData_baseUrl_MC}/AdmissionApi/insertadmissionbycashline`;

    $.ajax({
        url: viewData_save_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelValue),
        async: false,
        success: function (result) {

            if (result.data.status === 100) {
                var messageSuccessAlert = alertify.success(result.data.statusMessage);
                messageSuccessAlert.delay(admission.delay);
                adm_Identity = result.data.id;
                adm_admissionMasterId = model.admissionMasterId;
                modal_close_newAdm(true);
            }
            else if (result.data.status === -1 || result.data.status === -102) {
                var messageSuccessAlert = alertify.error(result.data.statusMessage);
                messageSuccessAlert.delay(admission.delay);
                $("#saveForm").prop("disabled", false)
            }
            else {
                generateErrorValidation(result.validationErrors);
                $("#saveForm").prop("disabled", false)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_admission);
            $("#saveForm").prop("disabled", false)
        }
    });

}

function checkOpenCashReimbursement(id) {
    let result = $.ajax({
        url: `${viewData_baseUrl_MC}/AdmissionApi/opencash`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_MC}/AdmissionApi/opencash`);
            return null;
        }
    });
    return result.responseJSON;
}

function buildAdmBoxTbody(ad) {

    $("#admBoxTbody")
        .html(`
            <tr>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.id}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.createDateTimePersian}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.createUserId} - ${ad.createUserFullName}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.workflowId} - ${ad.workflowName}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.stageId} - ${ad.stageName}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${ad.actionId} - ${ad.actionName}</td>
                <td style="padding: 4px;border: 1px solid #dee2e6;">${admissionMasterInfo.admissionAmount < 0 ? `(${transformNumbers.toComma(Math.abs(admissionMasterInfo.admissionAmount))})` : transformNumbers.toComma(admissionMasterInfo.admissionAmount)}</td>
            </tr>
        `)
}

function fillAdmission(ad) {

    
    ////////////////////////////////// START  HEADER ////////////////////////////////////////////////

    admissionTaminId = ad.id;
    admissionMasterInfo.admissionMasterId = ad.admissionMasterId
    admissionMasterInfo.admissionId = ad.id
    admissionMasterInfo.admissionAmount = getAdmissionAmount(ad.id)
    admissionMasterInfo.admissionMasterCashInfo = getMasterCashInfo(ad.admissionMasterId, ad.id)
    admissionMasterInfo.admissionMasterWorkflowCategoryId = ad.admissionMasterWorkflowCategoryId

    admissionMasterInfo.admActionId = ad.actionId;
    admissionMasterInfo.admissionMasterActionId = ad.admissionMasterActionId;
    admissionMasterInfo.admissionMasterWorkflowId = ad.admissionMasterWorkflowId;
    admissionMasterInfo.admissionMasterStageId = ad.admissionMasterStageId;

    let stageAction = getStageAction(ad.admissionMasterWorkflowId, ad.admissionMasterStageId, ad.admissionMasterActionId, 0);
    admissionMasterInfo.medicalRevenue = stageAction.medicalRevenue
    admissionCashDetail.admissionMedicalRevenue = 1
    admissionMasterInfo.admissionMasterSettlement = stageAction.admissionMasterSettlement
    isAfterFill = true;
    isEditTamin = true;

    $("#admnMasterId").val(ad.admissionMasterId);
    $("#admnId").val(ad.id);
    $("#workflowName").val(`${ad.workflowId} - ${ad.workflowName}`);
    $("#searchPatient").prop("disabled", true)
    $("#admBox").removeClass("d-none");
    buildAdmBoxTbody(ad)
    ////////////////////////////////// START  HEADER ////////////////////////////////////////////////





    ////////////////////////////////// START  payment ////////////////////////////////////////////////
    initPaymentForm(ad)
    //getAdmissionCashRequests(+ad.cashId);
    ////////////////////////////////// end  payment ////////////////////////////////////////////////





    ////////////////////////////////// START SERVICE  ////////////////////////////////////////////////
    arr_tempService = [];
    fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, ad.attenderId, false, 3, "انتخاب خدمت");
    appendModeServiceLine(ad)
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0)
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0)
    $("#addService").prop("disabled", arr_tempService.length > 0);
    $("#removeAllService").prop("disabled", arr_tempService.length == 0);
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $(".setprescription-check,.infoprescription,#tryGetPrescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");
    isEditTamin = false;
    ////////////////////////////////// END SERVICE  ////////////////////////////////////////////////





    ///////////////////////////////// START ATTENDER SECTION ////////////////////////////////////////////////
    $("#attenderId").html(`<option value="${ad.attenderId}">${ad.attenderId} - ${ad.attenderFullName}</option>`)
    $("#attenderId").prop("disabled", true).val(ad.attenderId).trigger("change.select2");
    attenderMsc = ad.attenderMscId;
    attenderMscTypeId = ad.attenderMscTypeId;
    if (ad.referringDoctorId !== 0) {
        var refDoctorOption = new Option(`${ad.referringDoctorId}-${ad.referringDoctorName}`, ad.referringDoctorId, true, true);
        $("#referringDoctorId").append(refDoctorOption).trigger('change');
    }
    $("#referringDoctorId").prop("disabled", true);
    $("#prescriptionDatePersian").val(ad.prescriptionDatePersian).prop("disabled", true)
    fillReserveShift([{
        id: ad.reserveShiftId,
        text: `${ad.reserveShiftId} - ${ad.reserveShiftName}`
    }])

    admissionReserveDateTimePersian = `${ad.reserveTime} ${ad.reserveDatePersian}`;
    $("#reserveNo").val(ad.reserveNo);
    $("#reserveDate").val(admissionReserveDateTimePersian);
    $("#scheduleBlockId").val(ad.attenderScheduleBlockId);
    ///////////////////////////////// END ATTENDER SECTION ////////////////////////////////////////////////







    ////////////////////////////////// START PATIENT  ////////////////////////////////////////////////
    $("#patientId").val(ad.patientId);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#countryId").val(ad.countryId).trigger("change")
    $("#getDeserveInfo").prop("disabled", true);

    if (ad.basicInsurerLineId === "")
        $("#basicInsurerLineId").val("1-73").trigger("change");
    else
        $("#basicInsurerLineId").val(`1-${ad.basicInsurerLineId}`).trigger("change").prop("disabled", true);

    if (ad.compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${ad.compInsurerLineId}-${ad.compInsurerId}`).prop("disabled", true).trigger("change");
    else if (ad.thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${ad.thirdPartyInsurerId}`).prop("disabled", true).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).prop("disabled", true).trigger("change");


    if (ad.discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${ad.discountInsurerId}`).prop("disabled", true).trigger("change");
    else
        $("#discountInsurerId").val(0).prop("disabled", true).trigger("change");

    $("#firstName").val(ad.firstName).prop("disabled", true);
    $("#lastName").val(ad.lastName).prop("disabled", true);
    $("#birthDatePersian").val(ad.birthDatePersian).prop("disabled", true);
    $("#genderId").val(ad.genderId).trigger("change");
    $("#mobile").val(ad.mobileNo);
    $("#address").val(ad.address);
    $("#idCardNumber").val(ad.idCardNumber);
    $("#postalCode").val(ad.postalCode);
    $("#jobTitle").val(ad.jobTitle);
    $("#phoneNo").val(ad.phoneNo);
    $("#serviceLaboratoryGroupId").val(ad.serviceLaboratoryGroupId).trigger("change");
    $("#diagnosisCode").val(ad.diagnosisCode);
    $("#diagnosisComment").val(ad.diagnosisComment);


    fillOwnerPrescription(ad.firstName + " " + ad.lastName, ad.nationalCode, "...", "...", "...");

    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change.select2");
    $("#educationLevelId").val(ad.educationLevelId).trigger("change.select2");
    $("#fatherFirstName").val(ad.patientFatherFirstName);

    inqueryID = ad.inqueryID;
    $("#editSectionPatient").prop("disabled", true);
    ////////////////////////////////// END PATIENT  ////////////////////////////////////////////////








    ////////////////////////////////// START INSERT  ////////////////////////////////////////////////
    if (checkResponse(ad.responsibleNationalCode))
        patientInsurer.responsibleNationalCode = ad.responsibleNationalCode

    if (checkResponse(ad.relationType))
        patientInsurer.relationType = ad.relationType

    if (checkResponse(ad.covered))
        patientInsurer.covered = ad.covered

    if (checkResponse(ad.recommendationMessage))
        patientInsurer.recommendationMessage = ad.recommendationMessage
    ////////////////////////////////// END INSERT  ////////////////////////////////////////////////






    ////////////////////////////////// START DETAILS  ////////////////////////////////////////////////
    let prsData = [{
        ePrescriptionId: ad.requestEPrescriptionId,
        paraTypeCode: ad.paraClinicTypeCode,
        paraTypeName: ad.paraclinicTypeCodeName,
        patientMobile: ad.patientMobile,
        provinceName: ad.provinceName,
        nationalCode: ad.patientNationalCode,
        attenderFullName: ad.attenderName,
        attenderMSC: ad.attenderMSC,
        attenderSpecialityName: ad.attenderSpeciality,
        prescriptionDate: ad.prescriptionDatePersian,
        reasonForRefer: ad.referReason,
        comment: ad.comments,

    }]

    appendPrescriptionInfo(prsData);
    ////////////////////////////////// START DETAILS  ////////////////////////////////////////////////
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
    if (checkResponse(patientInsurer) && +patientInsurer.recommendationMessage != 0) {
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

function onChangeSetps(currentIndex, newIndex, stepDirection) {

    if (userInfoLogin.counterTypeId == 1)
        $("#stepHeader4").addClass("disabled-header");
    else
        $("#stepHeader4").removeClass("disabled-header");

    if (stepDirection === 'forward') {
        var from = $(`#stepIndex${currentIndex}`).parsley();

        if (currentIndex != "4") {
            var validate = from.validate();
            validateSelect2(from);
            if (!validate) return false;
        }
    }
    return true;
}

function onNextSetps(ev) {

    ev.preventDefault();
    ev.stopPropagation();
    let ln = $(".step-tab-panel").length;
    if ($(".step-tab-panel.active").data().step !== `step${userInfoLogin.counterTypeId == 1 ? +ln - 1 : ln}`) {
        $("#nextbutton").click();
    }
}

function onFocusSetps() { }

function printForm() {
    if (printUrl === "" || !printUrl.includes(".mrt")) {
        modal_show("printAdmissionModal");
    }
    else {
        adm_print(adm_Identity, adm_admissionMasterId, printUrl);
        navigation_item_click("/MC/AdmissionServiceTamin", viewData_modal_title);
    }
    return;
}

function adm_print(admnId, admissionMasterId, printurl) {
    
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
            contentPrintAdmissionCompress(admnId);
            return;
        }
        if (printurl.indexOf("Prn_AdmissionDouble.mrt") != -1) {
            let element = $("#bcTarget")
            let bcTargetPrintprescription = doubleprintBarcode(element, 3, 1, admnId)
            contentPrintAdmissionCompressDouble(admnId, bcTargetPrintprescription);
            return;
        }
        if (printurl.indexOf("Prn_Admission.mrt") != -1) {
            contentPrintAdmission(admnId);
            return;
        }

        viewData_print_model.value = admnId;
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
    var admissionid = +$("#admnId").val();

    let viewData_get_admission = `${viewData_baseUrl_MC}/AdmissionApi/display`;
    $.ajax({
        url: viewData_get_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(admissionid),
        success: function (result) {
            if (result !== null)
                fillAdmission(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_admission);
        }
    });
}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmission();
    }
    //else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_f) {
    //    e.preventDefault();
    //    e.stopPropagation();
    //    $("#searchPatient").click();
    //}
    //else if (e.ctrlKey && e.altKey && e.keyCode === KeyCode.key_n) {
    //    e.preventDefault();
    //    e.stopPropagation();
    //    $("#newForm").click();
    //}
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_l) {
        e.preventDefault();
        e.stopPropagation();
        $("#list_adm").click();
    }
};

$("#stepHeader0").on("click", function () {
    setTimeout(() => {
        if (!$("#referringDoctorId").prop("disabled"))
            $("#referringDoctorId").select2("focus")
    }, 50)
})

$("#stepHeader1").on("click", function () {
    setTimeout(() => {
        $("#countryId").select2("focus")
    }, 50)
})

$("#stepHeader3").on("click", function () {
    $("#inOut").siblings().removeClass("select2-container--focus")
    setTimeout(() => {
        if (!$("#inOut").prop("disabled"))
            $("#inOut").select2("focus")
    }, 200)
})

$("#stepHeader4").on("click", async function () {
    $("#inOut").siblings().removeClass("select2-container--focus")


    if (!firstRunAdmissionsMastertInfo) {
        firstRunAdmissionsMastertInfo = true
        buildAdmissionMasterInfo(admissionMasterInfo.buildAdmissionMasterInfoModel)
    }

    calcSumPrice();
    await newPayAmount();
    isSame_sum();


    setTimeout(() => {
        if (!$("#inOut").prop("disabled"))
            $("#inOut").select2("focus")
    }, 50)
})

$("#admissionFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});

$("#list_adm").on("click", function () {
    navigation_item_click("/MC/AdmissionServiceTamin", "پذیرش تامین");
});

$("#saveForm").on("click", function () {
    saveAdmission();
});
///////////////////////////////////////////////////////////  END INIT FORM /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START ATTENDER  /////////////////////////////////////////////////////////////////
function editReferingDoctorInfo() {

    $("#referringDoctorId").prop("disabled", false).trigger("change")
    $("#referringDoctorId").select2("focus")

    if (typeof configEditReferingDoctorInfoInAdmissionImaging != "undefined")
        configEditReferingDoctorInfoInAdmissionImaging()
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
    $("#reserveTime").val("");
    $("#scheduleBlockId").val("")

    var attenderId = +$("#attenderId").val();
    if (attenderId === 0) return;

    let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime()

    let attenderTimeShiftList = await getAttenderTimeShiftList(attenderId, userInfoLogin.branchId, currentDate, currentTime, false)

    fillReserveShift(attenderTimeShiftList)

    if (!checkResponse(attenderTimeShiftList) || attenderTimeShiftList.length == 0) {
        var msg = alertify.warning("برای این داکتر هیچ نوبتی تعریف نشده است");
        msg.delay(admission.delay);
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
        $("#attenderId").select2("focus");
        //if (!isReimburesment)
        //    await reserve_init(attenderId, isReimburesment);


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

function resetAdmissionTamin() {

    form = $('#patientForm').parsley();
    form.reset();

    resetPatientInfo();
    resetPrescription();
    $("#tryGetPrescription").prop("disabled", true);
    fillOwnerPrescription("...", "...", "...", "...", "...");
    $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
    // ----------------------------

    $("#admBox").addClass("d-none");
    $("#admnId").val("");
    $("#dateTime").val("");
    $("#userFullName").val("");
    //$("#sumNetPriceTotal").text(0);
    $("#saveForm").removeAttr("disabled");

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
    $(".select2").removeAttr("disabled");
    $("#patientForm").removeAttr("disabled");
    $("#patientForm .form-control:not(#patientId)").removeAttr("disabled");
    $("#cashForm").removeAttr("disabled");
    $("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change");

    setDefaultValueInsurerId();
    patientId = 0;
    insurancesList = [];
    patientInsurer = null;
    inqueryID = 0;
    referringDoctorInfo = null;
    arr_tempService = [];
    adm_Identity = 0;
    adm_admissionMasterId = 0;
    attenderScheduleValid = false;
    basicInsurerCode = 37;
    compInsurerCode = 0;
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

function saveReferingDoctorInfo() {

    let referringDoctorId = +$("#referringDoctorId").val()

    if (referringDoctorId == 0) {
        var msg = alertify.warning("داکتر ارجاع دهنده را وارد کنید");
        msg.delay(alertify_delay);
        $("#referringDoctorId").select2("focus")
        return
    }

    var validate = $("#prescriptionDatePersian").parsley().isValid();
    if (!validate) {
        $("#prescriptionDatePersian").focus()
        return;
    }

    var modelCheckDate = {
        date1: $("#prescriptionDatePersian").val()
    };

    var resultComparePris = compareTime(modelCheckDate);

    if (resultComparePris === 1 || resultComparePris === -2) {
        msg_s = alertify.warning(admission.priscriptionDateNotValid);
        msg_s.delay(admission.delay);
        $("#prescriptionDatePersian").focus();
        return;
    }

    let prescriptionDatePersian = $("#prescriptionDatePersian").val()

    let model = {
        admissionServiceId: +$("#admnId").val(),
        referringDoctorId: referringDoctorId,
        prescriptionDatePersian: prescriptionDatePersian,
    }

    loadingAsync(true, "saveReferingDoctorInfoId");

    let url = `${viewData_baseUrl_MC}/AdmissionApi/updatereferringdoctorinfo`

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            loadingAsync(false, "saveReferingDoctorInfoId");
            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
            }
            else {
                var msg = alertify.warning(result.statusMessage);
                msg.delay(alertify_delay);
            }

            $("#editReferingDoctorInfoId").removeAttr("disabled")
            $("#referringDoctorId").prop("disabled", true)
            $("#prescriptionDatePersian").prop("disabled", true)
            $("#saveReferingDoctorInfoId").prop("disabled", true)

        },
        error: function (xhr) {
            error_handler(xhr, url);
            loadingAsync(false, "saveReferingDoctorInfoId");

            $("#editReferingDoctorInfoId").removeAttr("disabled")
            $("#referringDoctorId").prop("disabled", true)
            $("#prescriptionDatePersian").prop("disabled", true)
            $("#saveReferingDoctorInfoId").prop("disabled", true)

        }
    });


}

$("#attenderId").on("change", function () {
    var attenderId = +$(this).val();

    if (!isAfterFill)
        getShiftReserve();
    else
        isAfterFill = false;

    if (attenderId !== 0) {
        reserve_init(attenderId, isReimburesment);
    }
    else {
        $("#reserveShift").val(0)
        $("#reserveBox").addClass("d-none");
    }
});

$("#referringDoctorId").on("change", function () {
    if (+$(this).val() !== 0) {
        $("#prescriptionDatePersian").prop("disabled", false).prop("required", true);
        referringDoctorInfo = getReferringDoctorInfo(+$(this).val());
    }
    else {
        $("#prescriptionDatePersian").val("").prop("disabled", true).prop("required", false);
        referringDoctorInfo = null;
    }

});
////////////////////////////////////////////////////////////  END ATTENDER  /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START PATIENT //////////////////////////////////////////////////////////////////
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
    $("#maritalStatusId").val(maritalStatusId);
    $("#educationLevelId").val(educationLevelId);
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

function printAdmission(printname) {
    printUrl = `/Stimuls/MC/${printname}`;
    modal_close("printAdmissionModal");
}

function OpenSearchPanelByNationalCode() {
    /// در اینجا در صورت ورود متن نمبر تذکره مقدار، را دریافت کرده و آنرا در جستجو استفاده میکند
    ///، پس از قرار دادن نمبر تذکره  جستجو را انجام داده و فوکوس را به ردیف اول میدهد

    let nationalCode = $("#nationalCode").val();
    if (nationalCode != "" && nationalCode != undefined) {
        $("#tempPatient").html(fillEmptyRow(18));
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

    let patientId = +$("#patientId").val()

    patientInsurerSearch(patientId, true);
}

function resetPatientInfo(opr) {


    $("#nationalCode").prop("disabled", true)
    $("#firstName").prop("disabled", true);
    $("#lastName").prop("disabled", true);
    $("#getDeserveInfo").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", true);
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
    //$("#removeAllService").prop("disabled", true);
    $("#prescriptionForm button").prop("disabled", true);
    $("#prescriptionForm input").val("").prop("disabled", true);
    $("#prescriptionForm select").val(0).trigger("change").prop("disabled", true);
    $("#prescriptionForm table tbody").html(fillEmptyRow(11));
    fillOwnerPrescription(name, nationalCode, "...", "...", "...");
}

function setPatientInsurer(rowNumber) {

    patientInsurer = insurancesList.find(ii => ii.rowNumber === rowNumber);

    inqueryID = patientInsurer.inquiryId;

    $("#basicInsurerLineId").val(patientInsurer.basicInsurerLineId).trigger("change");

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

function keyDownMobile(e) {
    if ([KeyCode.Tab].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#idCardNumber").focus();
    }
}

async function getPatientByDeserveInfo(nationalCode) {

    if (nationalCode == "") {
        linerAlertify("نمبر تذکره را وارد نمایید", "warning", alertify_delay);

        loadingAsync(false, "getDeserveInfo", "fas fa-users");
        return;
    }
    if (!isValidIranianNationalCode(nationalCode)) {
        linerAlertify("نمبر تذکره معتبر نمی باشد", "warning", alertify_delay);

        loadingAsync(false, "getDeserveInfo", "fas fa-users");
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
    $("#basicInsurerLineId").val("1-73").trigger("change");
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

async function getDataPrescriptionInfo(nationalCode) {

    if (nationalCode == "") {
        linerAlertify("نمبر تذکره را وارد نمایید", "warning", alertify_delay);

        return;
    }
    if (!isValidIranianNationalCode(nationalCode)) {
        linerAlertify("نمبر تذکره معتبر نمی باشد", "warning", alertify_delay);

        return;
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
                linerAlertify(generateErrorStringTamin(result.problems), "warning", alertify_delay);

                return;
            }

            appendPrescriptionInfo(result.data);
        }
        else
            linerAlertify("پاسخی از وب سرویس دریافت نشد. دوباره تلاش نمایید", "warning", alertify_delay);


    });

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

        if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
            $("#basicInsurerNo").val('').prop("disabled", true);
            $("#basicInsurerBookletPageNo").val('').prop("disabled", true);
            $("#basicInsurerExpirationDatePersian").val('').prop("disabled", true);
        }
        else {
            $("#basicInsurerExpirationDatePersian").val(getlastdayofyear);
            $("#basicInsurerNo").val('').prop("disabled", false);
            $("#basicInsurerBookletPageNo").val('').prop("disabled", false);
            $("#basicInsurerExpirationDatePersian").val('').prop("disabled", false);

            checkInsurerTamin(+$("#referralTypeId").val());
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

$("#nationalCode").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter && +dropDownCacheData.basicInsurerId === 8000 && $("#nationalCode").val().length === 16) {
        var valScannr = $(this).val();
        $(this).val(valScannr.substring(0, 10));

    }
});

$("#nationalCode").on("blur", function (eb) {

    var nationalCode = $(this).val();

    if (!isValidIranianNationalCode(nationalCode) && nationalCode !== "") {
        linerAlertify("نمبر تذکره معتبر نمی باشد", "warning", alertify_delay);

        return;
    }

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

    resetPerscription("...", "...");
    $("#patientId").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#countryId").prop('selectedIndex', 0).trigger("change")
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

$("#searchPatientModal").on('shown.bs.modal', function () {

    OpenSearchPanelByNationalCode();
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();

});

$("#editSectionPatient").on("click", function () {
    resetPatientInfo();
    $(this).prop("disabled", true);
});

$("#getDeserveInfo").on("click", function () {
    loadingAsync(true, "getDeserveInfo", "fas fa-users");
    getPatientByDeserveInfo($("#nationalCode").val());
});

$("#prescriptionInfoModal").on("hidden.bs.modal", () => setTimeout(() => $("#tryGetPrescription").focus(), 10));

$("#prescriptionInfoModal").on("shown.bs.modal", () => setTimeout(() => $("#tempHeaderPrescriptionInfo tr:eq(0)").prop("tabindex", "88888").focus(), 10));

$("#basicInsurerLineId").on("change", function () {

    let basicInsurerLineId = $(this).val()
    let basicInsurerLineTypeId = ""

    $("#searchPatientBasicInsurerLineId").val(basicInsurerLineId).trigger("change");

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
    $("#tempPatient").html(fillEmptyRow(17));

    displayCountRowModal(0, "searchPatientModal");
});

$("#searchPatientAdmission").on("click", function () {

    return
    if (
        $("#searchPatientFullName").val().trim().length < 3 &&
        $("#searchPatientNationalCode").val().length === 0 &&
        $("#searchPatientMobileNo").val().length === 0 &&
        $("#searchPatientBasicInsurerNo").val().trim().length === 0 &&
        +$("#searchPatientBasicInsurerLineId").val() == 0 &&
        +$("#searchPatientCompInsurerThirdPartyId").val() == 0
    ) {
        $("#tempPatient").html(fillEmptyRow(18));
        displayCountRowModal(0, "searchPatientModal");
        return;
    }

    let basicInsurerLineId = $("#searchPatientBasicInsurerLineId").val().split("-")[1] == undefined ? 0 : $("#searchPatientBasicInsurerLineId").val().split("-")[1]
    let compInsuranceThirdPartyType = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[0]
    let compInsurerLineId = 0
    let thirdPartyInsurerId = 0

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
        insurerLineId: basicInsurerLineId,
        compInsurerLineId,
        thirdPartyInsurerId,
    }

    patientSearch(patientSearchModel, false, true);

});

$("#searchPatientInsurerModal").on("hidden.bs.modal", async function () {
    $("#mobile").focus();
});

$("#countryId").on("change", function () {

    if ($("#countryId").val() == 0)
        $("#countryId").prop('selectedIndex', 0).trigger("change")

});

$("#searchPatientModal").on("shown.bs.modal", function () {
    $("#tempPatient #p_0").addClass("highlight");
    $("#tempPatient #p_0 > td > button").focus();
});

$("#searchPatientInsurerModal").on("shown.bs.modal", function () {
    $(`#tempPatientI #pI_0`).addClass("highlight");
    $(`#tempPatientI #pI_0 > td > button`).focus();
});

$("#showReserve").on("click", function () {

    var attenderId = +$("#attenderId").val();

    if (attenderId === 0) {
        linerAlertify(admission.select_attender, "warning", admission.delay);
        return;
    }

    reserve_init(attenderId);
    modal_show("reserveModal");
});
///////////////////////////////////////////////////////////  END PATIENT  /////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////  END PRINT  /////////////////////////////////////////////////////////////////
function cashstandprint() {
    
    let row = $(`#admissionListForm tr.highlight`);
    let medicalrevenue = $(row).data("medicalrevenue");
    let admissionmasterid = row.data("admissionmasterid");
    standprint(admissionmasterid, medicalrevenue)

    modal_close('PrnAdmissionSale')
    modal_close('PrnAdmission')
}

function separationprint() {

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionListForm tr.highlight`);
    let admissionId = $(row).data("admissionid")


    contentPrintAdmission(admissionId);

    modal_close('PrnAdmission')
}

function aggregationprint() {

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionListForm tr.highlight`);
    let admissionId = $(row).data("admissionid")

    contentPrintAdmissionCompress(admissionId);

    modal_close('PrnAdmission');
}

function doubleprint() {


    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionListForm .highlight`);
    let admissionId = $(row).data("admissionid")
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let element = $("#bcTarget")

    let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
    contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

    modal_close('PrnAdmission');
}

function saleseparationprint() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#admissionListForm .highlight`);
    let admissionId = $(row).data("admissionid")

    contentPrintAdmissionSale(admissionId);

    modal_close('PrnAdmissionSale');
}
///////////////////////////////////////////////////////////  END PRINT  /////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////  START SERVICE //////////////////////////////////////////////////////////////////
function sumAdmissionLine() {
    var lastPayAmount = 0;
    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }
    return lastPayAmount;
}

async function ValidBeforAddTempServiceAdm() {
    if (+$("#attenderId").val() == 0) {
        linerAlertify("داکتر را انتخاب کنید", "warning", alertify_delay);

        return;
    }
    if (prescriptionVars.ePrescriptionId == 0) {
        linerAlertify("نسخه الکترونیک را انتخاب کنید", "warning", alertify_delay);
        return;
    }

    loadingAsync(true, "addService", "fa fa-arrow-down");

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexisteprescriptionId/${prescriptionVars.ePrescriptionId}/${admissionTaminId}`;
    await checkExitPrescraption(url).then((res) => {
        if (checkResponse(res)) {

            if (+res == 0) {
                let url = `${viewData_baseUrl_MC}/tamin/geteprescriptiondetail`,
                    model = { RequestId: prescriptionVars.ePrescriptionId, ParaClinicTypeCode: prescriptionVars.paraTypeCode };

                fetchGetPrescriptionDetails(url, model).then(result => {
                    if (checkResponse(result) && checkResponse(result.data))
                        checkValidAdd(result.data);
                    else
                        loadingAsync(false, "addService", "fa fa-arrow-down");
                });
            }
            else {
                linerAlertify(`نسخه قبلا در شناسه ${res} ثبت شده است `, "warning", alertify_delay);
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

                if (emptyIds.filter(a => a !== "").length > 0)
                    linerAlertify(generateErrorStringWithHeader(emptyIds, "خدمات با تعداد صفر:"), "warning", alertify_delay);

                $("#addService").prop("disabled", true);
                $("#removeAllService").prop("disabled", false);
                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
            else {
                if (result.status == -101) {
                    let validError = "", dataError = result.validationErrors, dataErrorLn = result.validationErrors.length;
                    for (var i = 0; i < dataErrorLn; i++)
                        validError += dataError[i] + `${i == dataErrorLn - 1 ? "" : " / "}`;

                    if (validError)
                        linerAlertify(`برای خدمت های زیر تعرفه بیمه وجود ندارد :<br /> ${validError}`, "warning", alertify_delay);

                    loadingAsync(false, "addService", "fa fa-arrow-down");

                }
                else
                    linerAlertify("خطا در دریافت اطلاعات", "warning", alertify_delay);

                loadingAsync(false, "addService", "fa fa-arrow-down");
            }
        }
        else
            loadingAsync(false, "addService", "fa fa-arrow-down");
    });

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
        attenderCommissionPrice: data.attenderCommissionPrice
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
                          <td class="money">${transformNumbers.toComma(model.patientShareAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.discountAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.netAmount)}</td>
   
                      </tr>`;

        $(`#tempService`).append(output);
        var sumNetPriceTxt = transformNumbers.toComma(sumAdmissionLineTamin());

        //createServiceRequest(model);

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

function sumAdmissionLineTamin() {
    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
}

function setHighlightTr(rowNumber) {
    $("#tempService tr").removeClass("highlight");
    $(`#s_${rowNumber}`).addClass("highlight");
}

function removeFromTempServiceAll() {

    let newadmId = $("#admnId").val()
    var resultOpenCash = checkOpenCashReimbursement(newadmId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق امکان حذف خدمت نمی باشد").delay(admission.delay);
        return;
    }

    if (newadmId > 0) {
        for (var i = 0; i < arr_tempService.length; i++) {
            let serviceId = arr_tempService[i].serviceId;
            deleteAdmissionLine(newadmId, serviceId);
        }
    }

    $("#tempService").html("");
    arr_tempService = [];


    $("#sumRowService").addClass("displaynone");
    $(".sumNetPrice").text("");
    $(`#tempService`).html(emptyRowHTML);
    $("#amount").val("");
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $(".setprescription-check,.infoprescription,#tryGetPrescription,#tempPrescription tr").prop("disabled", arr_tempService.length > 0).css("pointer-events", arr_tempService.length > 0 ? "none" : "all");//.css("pointer-event", arr_tempService.length > 0?"none":"all")
    $("#diagnosisComment,#diagnosisCode,#serviceLaboratoryGroupId").prop("disabled", arr_tempService.length > 0);
    $("#addService").prop("disabled", false);
    //$("#removeAllService").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", false);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
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

function appendModeServiceLine(ad) {

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
                    healthInsuranceClaim: adsl.healthInsuranceClaim,


                    attenderTaxPercentage: adsl.attenderTaxPercentage,
                    attenderCommissionAmount: adsl.attenderCommissionAmount,
                    attenderCommissionType: adsl.attenderCommissionType,
                    attenderCommissionValue: adsl.attenderCommissionValue,
                    attenderCommissionPrice: adsl.attenderCommissionPrice,

                };

                arr_tempService.push(modelServiceLine);
                appendServiceAdm(modelServiceLine);
            }
        }
}

function appendPrescriptionInfo(prsData) {

    let result = prsData == null || typeof prsData == "undefined" ? [] : prsData;
    let resLn = result.length, output = "", data = {};
    ColumnResizeable("tablePrescription");

    for (var i = 0; i < resLn; i++) {
        data = result[i];

        output += `<tr id="row${i + 1}" data-attenderFullName="${data.attenderFullName}" data-prescriptionDate="${data.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')}" onclick='setPrescriptionInfo(${i + 1},$("#row${i + 1} .setprescription-check"),${JSON.stringify(data)})'>
                          <td>${data.ePrescriptionId}</td>
                          <td>${data.provinceName == null ? "" : data.provinceName}</td>
                          <td>${data.paraTypeCode} - ${data.paraTypeName}</td>
                          <td>${data.nationalCode == null ? "" : data.nationalCode}</td>
                          <td>${data.attenderFullName}</td>
                          <td>${data.attenderMSC}</td>
                          <td>${data.attenderSpecialityName}</td>
                          <td>${(data.prescriptionDate != null && data.prescriptionDate != undefined ? data.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3') : "")}</td>
                          <td>${data.reasonForRefer == null ? "" : data.reasonForRefer}</td>
                          <td>${data.comment == null ? "" : data.comment}</td>
                          <td>
                              <button type="button" onclick="getPrescriptionInfoDetails('${data.ePrescriptionId}','${data.paraTypeCode}',${i + 1},'tablePrescription')" class="btn btn-info infoprescription"  data-toggle="tooltip" data-placement="bottom" data-original-title="جزئیات">
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

function fillOwnerPrescription(name = null, nationalCode = null, prescriptionType = null, prescriptionCode = null, attenderName = null) {

    $("#ownerName").text(name == null ? $("#ownerName").text() : name);
    $("#ownerNationalCode").text(nationalCode == null ? $("#ownerNationalCode").text() : nationalCode);
    $("#ownerPrescriptionType").text(prescriptionType == null ? $("#ownerPrescriptionType").text() : prescriptionType);
    $("#ownerPrescriptionNo").text(prescriptionCode == null ? $("#ownerPrescriptionNo").text() : prescriptionCode);
    $("#ownerAttenderName").text(attenderName == null ? $("#ownerAttenderName").text() : attenderName);
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
        $(`#diagnosisComment`).prop("disabled", !mode).prop("required", mode).removeClass("parsley-error").parents(".form-group").find("ul li").html("");
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

    if (mode)
        $("#diagnosisComment,#diagnosisCode,#serviceLaboratoryGroupId").prop("disabled", arr_tempService.length > 0);

    taminStageId = mode ? admissionStage.admissionTaminLaboratory.id : admissionStage.admissionTaminParaClinic.id;
    $(`#tempPrescription tr`).removeClass("highlight");
    $(`#tempPrescription #row${rowNo}`).addClass("highlight");

    $(`.setprescription-check`).removeClass("green_outline_1").addClass("btn-success");
    $(elm).addClass("green_outline_1").removeClass("btn-success").blur();

    $("#errorPrs").html("").addClass("d-none");
    fillOwnerPrescription(null, null, prescriptionVars.paraTypeCode + " - " + prescriptionVars.paraTypeName, prescriptionVars.ePrescriptionId, prescriptionVars.attenderFullName);
    $("#addService").prop("disabled", false);
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

    $("#basicInsurerLineId").val(isTamin ? "1-1" : "1-73").trigger("change");
    $("#birthDatePersian").val(result.birthDate).prop("disabled", true);
    $("#firstName").val(result.firstName).prop("disabled", true);
    $("#lastName").val(result.lastName).prop("disabled", true);
    $("#nationalCode,#getDeserveInfo").prop("disabled", true);
    $("#editSectionPatient,#tryGetPrescription").prop("disabled", false);
    $("#searchPatient").prop("disabled", true);
    $("#genderId").select2("focus");
    loadingAsync(false, "getDeserveInfo", "fas fa-users");
}

$("#addService").on("click", function () {

    let newadmId = $("#admnId").val()

    var resultOpenCash = checkOpenCashReimbursement(newadmId);

    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق امکان افزودن خدمت نمی باشد").delay(admission.delay);
        return;
    }

    var form = $("#lanInputForm").parsley();

    var validate = form.validate();

    validateSelect2(form);

    if (!validate)
        return;

    ValidBeforAddTempServiceAdm();
});
///////////////////////////////////////////////////////////  END SERVICE //////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START PAYMENT //////////////////////////////////////////////////////////////////
function initPaymentForm(allInfo) {
    arr_tempCash = [];


    if (admissionCashDetail.admissionMedicalrevenue == 1)
        $("#inOut").val("1").trigger("change");
    else
        $("#inOut").val("2").trigger("change");

    $("#detailAccountId").select2();
    $("#detailAccountId").prop("disabled", true);

    fillCashSummeryUser(0, "");

    buildMasterSections(allInfo);

}

async function buildMasterSections(allInfo) {

    let admMasterId = allInfo.admissionMasterId
    let admissionMasterCashInfo = admissionMasterInfo.admissionMasterCashInfo
    let admissionMasterAmount = admissionMasterCashInfo.admissionMasterAmount
    let cashAmount = admissionMasterCashInfo.cashAmount
    let remainingAmount = await calcSumRemain(admMasterId)

    admissionCashDetail.admissionMasterId = allInfo.admissionMasterId
    admissionCashDetail.admissionMasterStageId = allInfo.admissionMasterStageId
    admissionCashDetail.admissionMasterWorkflowId = allInfo.admissionMasterWorkflowId
    admissionCashDetail.admissionMasterActionId = allInfo.admissionMasterActionId

    let model = {
        id: allInfo.admissionMasterId,
        patientNationalCode: allInfo.nationalCode,
        patientId: +allInfo.patientId,
        patientName: allInfo.patientFullName,
        stageId: +allInfo.admissionMasterStageId,
        stageName: allInfo.stageName,
        workflowId: +allInfo.admissionMasterWorkflowId,
        workflowName: allInfo.workflowName,
        medicalRevenue: admissionCashDetail.admissionMedicalRevenue,
        actionId: +allInfo.admissionMasterActionId,
        remainingAmount: remainingAmount, //+admissionMasterInfo.remainingAmount,
        sumCashAmount: cashAmount, //+admissionMasterInfo.sumCashAmount,
        sumRequestAmount: admissionMasterAmount, //admissionMasterInfo.sumRequestAmount,
    }


    admissionMasterInfo.buildAdmissionMasterInfoModel = model

    //calcSumPrice();
    //await newPayAmount();
    //isSame_sum();
}

function runBtnPrintAdmission(admissionId, rowNo, e) {

    let stageId = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("stageid");
    let workflowId = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("workflowid");
    let medicalrevenue = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("medicalrevenue");


    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId
    let checkController = admissionTypeId === 1 ? "AdmissionItemApi" : "AdmissionApi"

    var check = controller_check_authorize(checkController, "PRN");
    if (!check)
        return;


    if (admissionTypeId == 1) {

        $("#modal_keyid_valueItem").text(admissionId);

        if (medicalrevenue != 1)
            $("#PrnAdmissionItem .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmissionItem .card-body .PrnModalDiv:last").removeClass("d-none");

        if (medicalrevenue == 2)
            contentPrintAdmissionSale(admissionId);
        else
            modal_show(`PrnAdmissionItem`)

    }
    else {

        $("#modal_keyid_value").text(admissionId);

        if (medicalrevenue != 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");

        if (medicalrevenue == 2)
            contentPrintAdmission(admissionId)
        else
            modal_show(`PrnAdmission`)
    }

}

function getAdmissionListForm(admissionMasterId = 0) {

    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getmasteradmissions/${admissionMasterId} `

        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {

                if (checkResponse(result) && result.length > 0)
                    buildAdmissionListForm(result)
                else
                    buildAdmissionListForm([])
            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildAdmissionList([])
            }
        });
    }
    else
        buildAdmissionListForm([])

}

function buildAdmissionListForm(admissions) {

    $("#admissionListTableForm").html("")

    let strTable = ""

    strTable = `
                <thead class="table-thead-fixed">
                    <tr>
                        <th class="col-width-percent-3">ردیف</th>
                        <th class="col-width-percent-6">شناسه</th>
                        <th class="col-width-percent-8">نمبرتذکره</th>
                        <th class="col-width-percent-18">نام و  تخلص</th>
                        <th class="col-width-percent-25">جریان کار</th>
                        <th class="col-width-percent-25">مرحله</th>
                        <th class="col-width-percent-10">مبلغ</th>
                        <th class="col-width-percent-5">عملیات</th>
                    </tr>
                     </thead >
                <tbody id="admissionListTbody">`

    if (checkResponse(admissions) && admissions.length != 0) {

        for (let i = 0; i < admissions.length; i++) {
            strTable += `<tr id="admL${i}" 
                             data-id="${admissions[i].id}" 
                             onclick="trOnclickAdmissionListForm(${i},'admissionListTableForm',event)" 
                             onkeydown="trOnkeydownAdmissionListForm(${i},'admissionListTableForm',event)" 
                             tabindex="-1"
                             data-admissionid="${admissions[i].id}"
                             data-workflowid="${admissions[i].workflowId}"
                             data-stageid="${admissions[i].stageId}"
                             data-actionid="${admissions[i].actionId}"
                             data-medicalrevenue="${admissions[i].medicalRevenue}"
                             data-admissionamount="${admissions[i].admissionAmount}"    
                             data-branchid="${admissions[i].branchId}">
                                 <td class="text-center">${i + 1}</td>
                                 <td>${admissions[i].id}</td>
                                 <td>${admissions[i].patientNationalCode}</td>
                                 <td>${admissions[i].patientId} - ${admissions[i].patientFullName}</td>
                                 <td>${admissions[i].workflow}</td>
                                 <td>${admissions[i].stage}</td>
                                 <td ${admissions[i].admissionAmount < 0 ? "style='color:#da1717'" : ""} >${admissions[i].admissionAmount < 0 ? `(${transformNumbers.toComma(admissions[i].admissionAmount)})` : transformNumbers.toComma(admissions[i].admissionAmount)}</td>
                                 <td>
                                     <button type="button" id="printAdmissionId${i}" onclick="runBtnPrintAdmission(${admissions[i].id},${i},event)" class="btn btn-print" data-toggle="tooltip" data-placement="top" title="چاپ">
                                         <i class="fa fa-print"></i>
                                     </button>
                                </td>
                        </tr>`
        }
    }
    else
        strTable += `<tr><td colspan="8" class="text-center">سطری وجود ندارد</td></tr>`

    strTable += `</tbody>`

    $("#admissionListTableForm").append(strTable)

    $("#admissionListTableForm #admL0").addClass("highlight")
}

function trOnclickAdmissionListForm(row, tabelId, ev) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#admL${row} `).addClass("highlight");
    $(`#${tabelId} tr#admL${row} `).focus();
}

function trOnkeydownAdmissionListForm(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row - 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row - 1} `).addClass("highlight");
            $(`#${tabelId} tr#admL${row - 1} `).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row + 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row + 1} `).addClass("highlight");
            $(`#${tabelId} tr#admL${row + 1} `).focus();
        }
    }
}

function trOnclickAdmissionList(row, tabelId, ev, elm) {

    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#admL${row} `).addClass("highlight");
    $(`#${tabelId} tr#admL${row} `).focus();

    let admissionId = $(elm).data("admissionid")
    let stageId = $(elm).data("stageid")
    let workflowId = $(elm).data("workflowid")

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    $("#admissionRequestId").text(`(شناسه : ${admissionId})`)


    if (admissionTypeId == 1)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    else
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);
}

function displayMasterCashRequest(admissionMasterId) {

    $("#admissionCashPayInfoModalId").text(admissionMasterId)

    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getadmissioncashbymaster/${admissionMasterId}`

        $.ajax({
            url: url,
            async: false,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {

                if (checkResponse(result) && result.length > 0)
                    buildCashRequest(result)
                else
                    buildCashRequest([])

            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildCashRequest([])
            }
        });

    }
    else
        buildCashRequest([])

}

function buildCashRequest(cashInfo) {

    modal_show("admissionCashInfoModal")

    $("#admissionCashPayInfo").html("")

    let strTable = ""
    strTable = `
                    <thead class="table-thead-fixed">
                         <tr>
                             <th class="col-width-percent-5">شناسه</th>
                             <th class="col-width-percent-10">شعبه</th>
                             <th class="col-width-percent-15">جریان کار</th>
                             <th class="col-width-percent-15">مرحله</th>
                             <th class="col-width-percent-15">گام</th>
                             <th class="col-width-percent-15">مبلغ پرداخت شده</th>
                             <th class="col-width-percent-15">کاربر ثبت کننده</th>
                             <th class="col-width-percent-10">تاریخ و زمان ثبت</th>
                         </tr>
                     </thead>
                     <tbody id="admissionCashPayInfoBody">`


    if (checkResponse(cashInfo) && cashInfo.length != 0) {

        for (let i = 0; i < cashInfo.length; i++) {
            strTable += `<tr id="cashInfo_${i}"  style="cursor:pointer"
                             data-cashid="${cashInfo[i].id}"
                             onclick="trOnclickCashInfo(${i},'admissionCashPayInfo',event,this)" 
                             tabindex="-1">
                                 <td>${cashInfo[i].id}</td>
                                 <td>${cashInfo[i].branchId == 0 ? "" : `${cashInfo[i].branchId} - ${cashInfo[i].branchName}`}</td> 
                                 <td>${cashInfo[i].workflowId == 0 ? "" : `${cashInfo[i].workflowId} - ${cashInfo[i].workflowName}`}</td>
                                 <td>${cashInfo[i].stageId == 0 ? "" : `${cashInfo[i].stageId} - ${cashInfo[i].stageName}`}</td>
                                 <td>${cashInfo[i].actionId == 0 ? "" : `${cashInfo[i].actionId} - ${cashInfo[i].actionName}`}</td>
                                 <td>${cashInfo[i].cashAmount < 0 ? `(${transformNumbers.toComma(Math.abs(cashInfo[i].cashAmount))})` : transformNumbers.toComma(cashInfo[i].cashAmount)} </td >
                                 <td>${cashInfo[i].createUser}</td>
                                <td>${cashInfo[i].createDateTimePersian}</td>
                         </tr > `
        }

    }
    else
        strTable += `<tr><td colspan="8" class="text-center">سطری وجود ندارد</td></tr > `

    strTable += `</tbody> `

    $("#admissionCashPayInfo").append(strTable)


    if (cashInfo.length == 0) {
        $("#cashFormDisplay").addClass("d-none")
    }
    else {
        $("#cashFormDisplay").removeClass("d-none")
        $("#admissionCashPayInfo #cashInfo_0").click()
    }

}

function calcSumPrice() {
    var row = $("#tempSelectedRequests").find("tr")[0];
    var sumNetPrice = 0;
    if ($(row).find(`#col_8_0`).text().includes("("))
        sumNetPrice += +$(row).find(`#col_8_0`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '') * -1;
    else
        sumNetPrice += +$(row).find(`#col_8_0`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '');

    $("#sumNetPrice").text(sumNetPrice >= 0 ? transformNumbers.toComma(sumNetPrice) : `(${transformNumbers.toComma(Math.abs(sumNetPrice))})`);
}

async function calcSumRemain(admMasterId) {
    let admissionMasterRemainAmount = 0

    admissionMasterRemainAmount = await calcRemainAmount()

    return admissionMasterRemainAmount
}

async function calcRemainAmount() {

    let sumRemain = 0
    let currentAdmId = admissionMasterInfo.admissionId
    let currentAdmMasterId = admissionMasterInfo.admissionMasterId
    let admissionMasterCashInfo = await getMasterCashInfo(currentAdmMasterId, currentAdmId)
    let admissionAmount = admissionMasterInfo.admissionAmount
    let sumNetPriceTotal = sumAdmissionLine()
    let admissionMasterAmount = admissionMasterCashInfo.admissionMasterAmount
    let cashAmount = admissionMasterCashInfo.cashAmount

    sumRemain = admissionMasterAmount - admissionAmount + sumNetPriceTotal - cashAmount

    return sumRemain
}

function buildAdmissionMasterInfo(request) {

    $(`#tempSelectedRequests`).html("");
    var index = 0;
    var requestStr = `<tr ${request.medicalRevenue == 2 ? 'class="highlight-danger"' : ""} 
                          id="trs_2_${index + 1}" 
                          tabindex="-1" data-stageid="${request.stageId}" 
                          data-workflowid="${request.workflowId}" 
                          data-stageid="${request.stageId}"
                          data-admissionmasterid="${request.id}"
                          data-actionid="${request.actionId}"
                          data-medicalrevenue="${request.medicalRevenue}"
                          data-summasteramount="${request.sumRequestAmount}"
                      >`;


    if ($("#sumRowRequest").hasClass("displaynone")) {
        $("#sumRowRequest").removeClass("displaynone");
        $("#emptyRow").remove();
    }

    //ردیف - شناسه - نمبرتذکره - نام خانواگی - جریان کار - مرحله - قابل دریافت پرداخت - عملیات
    requestStr += `
        <td id="col_${0}_${index}">${index + 1}</td>
        <td id="col_${1}_${index}" >${request.id}</td >
        <td id="col_${2}_${index}" data-patientid="${request.patientId}">${request.patientNationalCode}</td>
        <td id="col_${3}_${index}" >${request.patientId} - ${request.patientName}</td>
        <td id="col_${4}_${index}" data-workflowid="${request.workflowId}">${request.workflowId} - ${request.workflowName}</td>
        <td id="col_${5}_${index}" data-stageid="${request.stageId}">${request.stageId} -${request.stageName}</td>
        <td id="col_${6}_${index}" >${+request.sumRequestAmount >= 0 ? transformNumbers.toComma(request.sumRequestAmount) : `(${transformNumbers.toComma(Math.abs(request.sumRequestAmount))})`}</td >
        <td id="col_${7}_${index}" >${+request.sumCashAmount >= 0 ? transformNumbers.toComma(request.sumCashAmount) : `(${transformNumbers.toComma(Math.abs(request.sumCashAmount))})`}</td >
        <td id="col_${8}_${index}" >${+request.remainingAmount >= 0 ? transformNumbers.toComma(request.remainingAmount) : `(${transformNumbers.toComma(Math.abs(request.remainingAmount))})`}</td >
        <td>
            <button type="button" onclick="displayMasterRequest(${request.id},${request.stageId})" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="نمایش پرونده">
                <i class="fa fa-list"></i>
            </button>
       </td>`;

    requestStr += "</tr>";

    $(`#tempSelectedRequests`).html(requestStr);

    $("#trs_2_1").addClass("highlight")
}

function displayMasterRequest(admissionMasterId) {

    var check = controller_check_authorize("AdmissionMasterApi", "VIW");
    if (!check)
        return;

    $("#AdmissionMasterId").text("شناسه پرونده : ")
    $("#admissionList").removeClass("d-none")
    admissionMasterDisplay(admissionMasterId)
}

function getAdmissionCashRequests(id) {

    let viewData_upd_admissionCashRequest = `${viewData_baseUrl_MC}/AdmissionCashApi/admissioncashdisplay`;

    $.ajax({
        url: viewData_upd_admissionCashRequest,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            if (result.successfull == true) {

                var payments = result.data.payments;
                if (payments != null) {
                    for (var i = 0; i < payments.length; i++) {
                        var modelCashLine =
                        {
                            headerId: id,
                            rowNumber: i + 1,
                            inOut: payments[i].inOut,
                            inOutName: payments[i].inOut === 1 ? "1 - دریافت" : "2 - پرداخت",
                            fundTypeId: payments[i].fundTypeId,
                            fundTypeName: `${payments[i].fundTypeId} - ${payments[i].fundTypeName}`,
                            currencyId: payments[i].currencyId,
                            currencyName: `${payments[i].currencyId} - ${payments[i].currencyName}`,
                            detailAccountId: payments[i].detailAccountId,
                            detailAccountName: payments[i].detailAccountId !== 0 ? `${payments[i].detailAccountId} - ${payments[i].detailAccountName}` : "",
                            cardNo: payments[i].cardNo,
                            refNo: payments[i].refNo,
                            posId: payments[i].posId,
                            posName: (payments[i].posName != null ? payments[i].posName : ""),
                            amount: payments[i].amount,
                            exchangeRate: payments[i].currencyId == getDefaultCurrency() ? 1 : payments[i].exchangeRate,
                            payAmount: payments[i].exchangeRate == 0 ? payments[i].amount : payments[i].amount * payments[i].exchangeRate,
                            createDateTimePersian: payments[i].createDateTimePersian,
                            userFullName: payments[i].userFullName,
                            isAccess: payments[i].isAccess,
                            userId: payments[i].userId
                        };

                        arr_tempCash.push(modelCashLine);
                        appendCashAdm(modelCashLine);
                    }
                }

                isSame_sum();
                //resetCash();
            }
            else {
                linerAlertify(result.message, "warning", alertify_delay);

            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_upd_admissionCashRequest);
        }
    });

}

function trOnclickCashInfo(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row} `).addClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row} `).focus();

    let id = $(elm).data("cashid")
    getAdmissionCashRequestsDisplay(id)
}

function getAdmissionCashRequestsDisplay(cashId = null) {

    let viewData_upd_admissionCashRequest = `${viewData_baseUrl_MC}/AdmissionCashApi/admissioncashdisplay`

    $.ajax({
        url: viewData_upd_admissionCashRequest,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(cashId),
        cache: false,
        async: false,
        success: async function (result) {
            if (result.successfull == true) {

                let payments = result.data.payments;

                if (payments != null) {

                    let arr_tempCashDisplay = []
                    let defaultCurrency = getDefaultCurrency()

                    for (var i = 0; i < payments.length; i++) {
                        modelCashLine = {
                            headerId: cashId,
                            rowNumber: i + 1,
                            inOut: payments[i].inOut,
                            inOutName: payments[i].inOut === 1 ? "1 - دریافت" : "2 - پرداخت",
                            fundTypeId: payments[i].fundTypeId,
                            fundTypeName: `${payments[i].fundTypeId} - ${payments[i].fundTypeName} `,
                            currencyId: payments[i].currencyId,
                            currencyName: `${payments[i].currencyId} - ${payments[i].currencyName} `,
                            detailAccountId: payments[i].detailAccountId,
                            detailAccountName: payments[i].detailAccountId !== 0 ? `${payments[i].detailAccountId} - ${payments[i].detailAccountName} ` : "",
                            cardNo: payments[i].cardNo,
                            refNo: payments[i].refNo,
                            amount: payments[i].amount,
                            posId: payments[i].posId,
                            posName: (payments[i].posName != null ? payments[i].posName : ""),
                            exchangeRate: payments[i].currencyId == defaultCurrency ? 1 : payments[i].exchangeRate,
                            payAmount: payments[i].exchangeRate == 0 ? payments[i].amount : payments[i].amount * payments[i].exchangeRate,
                            userFullName: payments[i].userFullName,
                            createDateTimePersian: payments[i].createDateTimePersian,
                            userId: payments[i].userId
                        };

                        arr_tempCashDisplay.push(modelCashLine)

                        $("#tempCashDisplay .fullNameCash,#tempCashDisplay .createDateCash").removeClass("displaynone");

                    }

                    appendCashAdmDisplay(arr_tempCashDisplay, cashId);
                    sumCashAdmSum(arr_tempCashDisplay)
                }
            }
            else {
                var msgItem = alertify.warning(result.message);
                msgItem.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_search_admissionCashRequest);
        }
    });

}

function appendCashAdmDisplay(arr_tempCashDisplay, cashId) {

    $("#cashFormTitle").text(cashId)

    if (arr_tempCashDisplay.length == 0) {
        $("#tempCashDisplay").html(`< tr id = "emptyRow" > <td colspan="11" class="text-center">سطری وجود ندارد</td></tr > `);
    }
    else {
        let output = ""

        for (let i = 0; i < arr_tempCashDisplay.length; i++) {
            let inOutClass = "";

            if (arr_tempCashDisplay[i].inOut === 2)
                inOutClass = `class="highlight-danger"`;

            output += `<tr ${inOutClass} id="c_${i}"
            onclick="trOnclickCashInfoDetails(${i},'admissionCashDisplay',event,this)"
            onkeydown="trOnKeydownCashInfoDetails(${i},'admissionCashDisplay',event)"
            tabindex="-1"
                >
                <td>${arr_tempCashDisplay[i].rowNumber}</td>
                <td>${arr_tempCashDisplay[i].inOutName}</td>
                <td>${arr_tempCashDisplay[i].fundTypeName}</td>
                <td>${arr_tempCashDisplay[i].posId == 0 ? "" : `${arr_tempCashDisplay[i].posId} - ${arr_tempCashDisplay[i].posName}`}</td>
                <td>${arr_tempCashDisplay[i].currencyName}</td>
                <td>${arr_tempCashDisplay[i].detailAccountName}</td>
                <td class="d-none">${arr_tempCashDisplay[i].cardNo}</td>
                <td class="money">${arr_tempCashDisplay[i].inOut === 1 ? transformNumbers.toComma(arr_tempCashDisplay[i].amount) : `( ${transformNumbers.toComma(Math.abs(arr_tempCashDisplay[i].amount))} )`}</td>
                <td class="money">${transformNumbers.toComma(arr_tempCashDisplay[i].exchangeRate)}</td>
                <td class="money">${arr_tempCashDisplay[i].inOut === 1 ? transformNumbers.toComma(arr_tempCashDisplay[i].payAmount) : `( ${transformNumbers.toComma(arr_tempCashDisplay[i].payAmount)} )`}</td>
                <td class="fullNameCash" >${arr_tempCashDisplay[i].userId} - ${arr_tempCashDisplay[i].userFullName}</td>
                <td class="createDateCash">${arr_tempCashDisplay[i].createDateTimePersian}</td>
                      </tr > `;
        }


        $(`#tempCashDisplay`).html(output);

        //setTimeout(() => {
        //    $("#tempCashDisplay tr#c_0").focus()
        //}, 50)
    }

}

function trOnclickCashInfoDetails(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#c_${row} `).addClass("highlight");
    $(`#${tabelId} tr#c_${row} `).focus();
}

function trOnKeydownCashInfoDetails(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row - 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row - 1} `).addClass("highlight");
            $(`#${tabelId} tr#c_${row - 1} `).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row + 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row + 1} `).addClass("highlight");
            $(`#${tabelId} tr#c_${row + 1} `).focus();
        }
    }
}

function sumCashAdmSum(arr_tempCashDisplay) {

    if (arr_tempCashDisplay !== null)

        if (arr_tempCashDisplay.length !== 0) {

            let sumCash = sumPayAmountCashAdmDisplay(arr_tempCashDisplay);

            if (sumCash >= 0)
                $("#sumPayAmountCashAdmDisplay").text(transformNumbers.toComma(sumCash));
            else
                $("#sumPayAmountCashAdmDisplay").text(`(${transformNumbers.toComma(Math.abs(sumCash))})`);

            $("#sumRowCashDisplay").removeClass("displaynone");

        }
        else {
            $("#sumPayAmountCashAdmDisplay").text("");
        }

}

function sumPayAmountCashAdmDisplay(arr_tempCashDisplay) {

    var amountIn = 0, amountOut = 0;

    for (var i = 0; i < arr_tempCashDisplay.length; i++) {
        var item = arr_tempCashDisplay[i];

        if (item.inOut === 1)
            amountIn += +item.payAmount;
        else
            amountOut += +item.payAmount;
    }

    return amountIn - amountOut

}
///////////////////////////////////////////////////////////  END PAYMENT  /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START VALIDATION  /////////////////////////////////////////////////////////////////
window.Parsley._validatorRegistry.validators.nationalcodeadmission = undefined
window.Parsley.addValidator('nationalcodeadmission', {
    validateString: function (value) {
        return isValidIranianNationalCode(value);
    },
    messages: {
        en: 'فرمت نمبر تذکره صحیح نیست .',
    }
});

window.Parsley._validatorRegistry.validators.cheklengthlinestep = undefined
window.Parsley.addValidator('cheklengthlinestep', {
    validateString: function (value) {

        if (arr_tempService.length < 1)
            return false;

        return true;
    },
    messages: {
        en: 'حداقل یک خدمت برای پذیرش اضافه کنید',
    }
});
///////////////////////////////////////////////////////////  END VALIDATION  /////////////////////////////////////////////////////////////////





initAdmissionForm(getAdmission, +$("#admnId").val())
    .then(id => {
        $("#patientInsuranceBoxId").html($("#insuranceBoxId").html());

        $("#patientInsuranceBoxId").prop("disabled", true);

        if (!isEditMode()) {
            $(`#insuranceBoxId`).val("1-73").trigger("change.select2");
            $("#patientInsuranceBoxId").val("1-73").trigger("change.select2");
        }

        initSteps("admissionTaminFormSteps", onChangeSetps, onFocusSetps, onNextSetps);
    })

