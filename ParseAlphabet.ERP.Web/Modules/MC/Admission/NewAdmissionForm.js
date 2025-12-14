var form = $('#patientForm').parsley(),
    arr_tempService = [], viewData_modal_title = "پذیرش",
    viewData_controllername = "AdmissionApi",
    patientId = 0,
    adm_Identity = 0,
    calPriceModel = {},
    insurExpDateValid = true,
    priscriptionDateValid = true,
    attenderScheduleValid = false,
    printUrl = "",
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: adm_Identity, sqlDbType: 8, size: 0 },
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    basicInsurerCode = 0,
    compInsurerCode = 0,
    healthClaim = 1,
    basicInsurer = {},
    basicInsurerId = 0,
    disabledInsurers = [1, 2, 37],
    referralUrl = "/MC/Admission",
    referralTitle = "پذیرش",
    insurancesList = [], patientInsurer = null, getlastdayofyear = getLastDayOfYear(),
    attenderMsc = "0",
    attenderMscTypeId = 0,
    inqueryID = 0,
    referringDoctorInfo = null,
    firstTimeResetShabad = false,
    HIDIdentity = "",
    HID = "0",
    HIDOnline = false,
    REFFERINGHID = "0",
    sectionHID = $("#shabadForm .row > div"),
    isReimburesment = false,
    typeSaveDiag = "INS",
    arr_TempDiagnosis = [],
    currentDiagRowNumber = 0,
    getAdmissionInsurerInfoVar = "",
    disabledInsurersByCode = [8036, 8001, 8000],
    isActivePatient = true,
    admissionTypeId = 0,
    saleTypeId = 0,
    admissionId = 0,
    admissionServiceId = 0,
    formLoaded = false,
    patientFullname = "",
    nationalCode = "",
    admissionReserveDateTimePersian = "",
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
    userInfoLogin = {},
    admissionCashDetail = {},
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
    firstRunAdmissionsCash = false;





///////////////////////////////////////////////////////////  START INIT FORM /////////////////////////////////////////////////////////////////
async function initAdmissionForm(callback, admnId) {

    userInfoLogin = await getCashIdByUserId()

    $(".select2").select2();

    setInputmask()

    initSteps("admissionFormSteps", onChangeSetps, onFocusSetps, onNextSetps);

    isReimburesment = $("#admissionFormBox").parents(".modal").length > 0 ? true : false;

    if (isReimburesment)
        $("#historyReserves").addClass("d-none");
    else
        $("#historyReserves").removeClass("d-none");

    await loadSelectDependedent()

    $(".time-slot").addClass("time-slot-newadmission");

    $("#basicInsurerNo").val("").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").prop("disabled", true);

    var elm = $(".card-body #attenderForm select").first()
    $(".time-slot").css("max-height", "initial");

    if (admnId !== 0 && !isNaN(admnId))
        callback();

    return elm.attr("id")

}

async function loadSelectDependedent() {
    accessGetShiftReserve = false
    //fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`, "attenderId", true, userInfoLogin.branchId, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ReferringDoctorApi/getdropdown`, "referringDoctorId", true, 1, true, 3, "انتخاب", undefined, "'/MC/ReferringDoctor/'");
    fill_select2("/api/AdmissionsApi/patientrefferaltype_getdropdown", "referralTypeId", true, 0, false, 3, "انتخاب", function () {
        //$("#referralTypeId").val($("select#referralTypeId option:first").val()).trigger("change");
    }, "", false, true, false, false);
    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false, 3, "انتخاب کنید", function () { $("#countryId").val(101).trigger("change") });
    fill_select2("/api/AdmissionsApi/eliminatehidreason_getdropdown", "eliminateReasonId", false, "adm", false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`, "statusId", true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`, "diagnosisResonId", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/reasonforencounterid`, "reasonForEncounterId", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/serverityid`, "serverityId", true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", true, `${dropDownCache.discount}/0`);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
}

function isEditMode() {
    if ($("#admnId").val() == "")
        return false;
    else
        return true;
}

function setInputmask() {
    $("#prescriptionDatePersian").inputmask({ "mask": "9999/99/99" })
    $("#basicInsurerExpirationDatePersian").inputmask({ "mask": "9999/99/99" })
    $("#birthDatePersian").inputmask({ "mask": "9999/99/99" })
}

function getAdmission() {

    let admissionId = +$("#admnId").val();

    let viewData_get_admission = `${viewData_baseUrl_MC}/AdmissionApi/display`;

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

async function fillAdmission(ad) {
    
    //getAdmissionInsurerInfo(ad.id)

    ////////////////////////////////// START  HEADER ////////////////////////////////////////////////

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


    $("#admnId").val(ad.id);
    $("#admnMasterId").val(ad.admissionMasterId);
    $("#admBox").removeClass("d-none");

    buildAdmBoxTbody(ad)
    ////////////////////////////////// END  HEADER ////////////////////////////////////////////////




    ////////////////////////////////// START PAYMENT  ////////////////////////////////////////////////
    initPaymentForm(ad)
    ////////////////////////////////// END  PAYMENT ////////////////////////////////////////////////




    ////////////////////////////////// START SERVICE  ////////////////////////////////////////////////
    arr_tempService = [];
    fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, ad.attenderId, false, 3, "انتخاب خدمت");
    appendModeServiceLine(ad)

    if (ad.reasonForEncounterId !== 0) {
        let tempReasonEncounterAppend = null;
        $("#reasonForEncounterId").val(ad.reasonForEncounterId);
        tempReasonEncounterAppend = new Option(`${ad.reasonForEncounterId} - ${ad.reasonForEncounterName} - ${ad.reasonForEncounterCode}`, ad.reasonForEncounterId, true, true);
        $("#reasonForEncounterId").append(tempReasonEncounterAppend).trigger('change');
    }
    ////////////////////////////////// END SERVICE  ////////////////////////////////////////////////





    ////////////////////////////////// START ATTENDER SECTION ////////////////////////////////////////////////
    $("#attenderId").html(`<option value="${ad.attenderId}">${ad.attenderId} - ${ad.attenderFullName}</option>`)
    $("#attenderId").val(ad.attenderId).prop("disabled", true).trigger("change.select2");
    attenderMsc = ad.attenderMscId;
    attenderMscTypeId = ad.attenderMscTypeId;

    if (ad.referringDoctorId !== 0) {
        var refDoctorOption = new Option(`${ad.referringDoctorId} - ${ad.referringDoctorName} - ${ad.referringDoctorMsc}`, ad.referringDoctorId, true, true);
        $("#referringDoctorId").append(refDoctorOption).trigger('change.select2');
    }

    $("#referringDoctorId").prop("disabled", true);
    $("#prescriptionDatePersian").val(ad.prescriptionDatePersian).prop("disabled", true);
    fillReserveShift([{
        id: ad.reserveShiftId,
        text: `${ad.reserveShiftId} - ${ad.reserveShiftName}`
    }])

    admissionReserveDateTimePersian = `${ad.reserveTime} ${ad.reserveDatePersian}`;
    $("#reserveNo").val(ad.reserveNo);
    $("#reserveDate").val(admissionReserveDateTimePersian);
    $("#scheduleBlockId").val(ad.attenderScheduleBlockId)
    ////////////////////////////////// EMD ATTENDER SECTION ////////////////////////////////////////////////






    ////////////////////////////////// START PATIENT  ////////////////////////////////////////////////
    $("#patientId").val(ad.patientId);
    $("#referralTypeId").val(ad.referralTypeId).trigger("change").prop("disabled", true);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);
    dropDownCacheData.basicInsurerLineName = ad.basicInsurerLineName

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


    $("#basicInsurerLineId").prop("disabled", true);
    $("#basicInsurerNo").val(ad.basicInsurerNo);
    $("#basicInsurerExpirationDatePersian").val(ad.basicInsurerExpirationDatePersian);
    $("#basicInsurerBookletPageNo").val(ad.basicInsurerBookletPageNo).prop("disabled", true);

    $("#countryId").val(ad.countryId).trigger("change");
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
    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change");
    $("#educationLevelId").val(ad.educationLevelId).trigger("change");
    $("#fatherFirstName").val(ad.patientFatherFirstName);
    $("#searchPatient").prop("disabled", true)

    $("#basicInsurerNo").prop("disabled", true);
    $("#basicInsurerBookletPageNo").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").prop("disabled", true)
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
    ////////////////////////////////// END  INSERT ////////////////////////////////////////////////



    $("#attenderHID").val(ad.hid);
    HIDIdentity = ad.hid;
    inqueryID = ad.inqueryID;
    HIDOnline = ad.hidOnline;
    $("#hidonline").prop("checked", ad.hidOnline).trigger("change");
    $("#refferingHID").val(ad.referredHID);
    $("#editSectionShabad").prop("disabled", HIDOnline);
    $("#eliminateReasonId").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", true);
    $("#getAttenderHID").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0);
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#referralTypeId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0)
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0)
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);

    fillDiagnosis(ad.admissionDiagnosisList);


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
        var msg_att = alertify.warning(admission.notHasAttender);
        msg_att.delay(admission.delay);
        $("#attenderId").select2("focus");
        return;
    }
    else {
        if (+$("#reserveNo").val() === 0 || $("#reserveDate").val() === "" || $("#scheduleBlockId").val() === "") {
            msg_s = alertify.warning(admission.defineAdmission);
            msg_s.delay(admission.delay);
            $("#reserveShift").focus();
            return;
        }
    }

    if (+$("#referringDoctorId").val() !== 0) {
        if ($("#prescriptionDatePersian").val() !== "") {

            if (!isValidShamsiDate($("#prescriptionDatePersian").val())) {
                $("#prescriptionDatePersian").focus();
                msg_s = alertify.warning("تاریخ نسخه معتبر نمی باشد");
                msg_s.delay(admission.delay);
                return;
            }
            else {
                var modelCheckDate = {
                    date1: $("#prescriptionDatePersian").val()
                };

                var resultComparePris = compareTime(modelCheckDate);

                if (resultComparePris === 1 || resultComparePris === -2) {
                    msg_s = alertify.warning(admission.priscriptionDateNotValid);
                    msg_s.delay(admission.delay);
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
            msg_s = alertify.warning("تاریخ نسخه برای مراجعه کننده مورد نظر را وارد نمایید");
            msg_s.delay(admission.delay);
            return;
        }
    }

    if (arr_tempService.length === 0) {
        var msg_temp_srv = alertify.error(admission.notHasService);
        msg_temp_srv.delay(admission.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    if (!insurExpDateValid) {

        msg_s = alertify.warning(admission.insurExpDateNotValid);
        msg_s.delay(admission.delay);
        $("#basicInsurerExpirationDatePersian").focus();
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


    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این کدملی غیر فعال می باشد ، امکان ذخیره وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }


    $("#saveForm").attr("disabled", "disabled");

    let medicalSubjectId = ""
    let referralTypeId = +$("#referralTypeId").val()

    if (referralTypeId == 4)
        medicalSubjectId = medicalSubject.inPersonIPDTariff.id
    else
        medicalSubjectId = medicalSubject.inPersonTariff.id


    var nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    var mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();

    let admissionCashStageId = admissionMasterInfo.admissionMasterWorkflowCategoryId == 14 ? admissionStage.admissionCashPayment.id : admissionStage.admissionCashRecieve.id

    let admissionExtraPropertyList = buildAdmissionExtraPropertyList()
    let workflowId = 151,
        stageId = admissionStage.admissionService.id;


    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];

    var model_patient = {
        id: +$("#patientId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        genderId: +$("#genderId").val(),
        countryId: +$("#countryId").val(),
        nationalCode: nationalCode,
        mobileNo: mobileNo,
        address: $("#address").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        educationLevelId: +$("#educationLevelId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
    };

    var model_admission = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admnMasterId").val(),
        admissionMasterActionId: +$("#admnMasterId").val() > 0 ? admissionMasterInfo.admissionMasterActionId : 0,
        admissionMasterWorkflowId: admissionMasterInfo.admissionMasterWorkflowId,
        admissionMasterStageId: admissionMasterInfo.admissionMasterStageId,
        stageId,
        actionId: +$("#admnId").val() > 0 ? admissionMasterInfo.admActionId : 0,
        workflowId,
        bookingTypeId: 2,
        admissionTypeId: 2,
        basicInsurerId: dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId,
        basicInsurerNo: $("#basicInsurerNo").val() == "" ? "0" : $("#basicInsurerNo").val(),
        basicInsurerBookletPageNo: $("#basicInsurerBookletPageNo").val(),
        basicInsurerExpirationDatePersian: $("#basicInsurerExpirationDatePersian").val(),
        compInsurerId: +dropDownCacheData.compInsurerId == 0 ? null : +dropDownCacheData.compInsurerId,
        compInsurerLineId: +dropDownCacheData.compInsurerLineId == 0 ? null : +dropDownCacheData.compInsurerLineId,
        thirdPartyInsurerId: +dropDownCacheData.thirdPartyInsurerId == 0 ? null : +dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: +dropDownCacheData.discountInsurerId == 0 ? null : +dropDownCacheData.discountInsurerId,
        attenderId: +$("#attenderId").val(),
        reserveShiftId: $("#reserveShift").val(),
        reserveNo: $("#reserveNo").val(),
        attenderScheduleBlockId : $("#scheduleBlockId").val(),
        reserveDatePersian: reserveDatePersian,
        reserveTime: reserveTime,
        referringDoctorId: +$("#referringDoctorId").val(),
        medicalSubjectId,
        admissionPatient: model_patient,
        admissionLineServiceList: arr_tempService,
        admissionDiagnosisList: arr_TempDiagnosis,
        admissionExtraPropertyList: admissionExtraPropertyList.length == 0 ? null : admissionExtraPropertyList
    }


    var admissionCashLine = {
        id: 0,
        admissionMasterId: admissionCashDetail.admissionMasterId,
        workflowId: +admissionCashDetail.admissionMasterWorkflowId,
        stageId: admissionCashStageId,
        actionId: admissionCashDetail.admissionMasterActionId,
        admissionLineCashList: arr_tempCash,
    }


    let modelValue = {
        admissionCashLine,
        admission: model_admission,
        updateAdmission: isReimburesment,
        reimburesment: isReimburesment
    };


    let viewData_save_newAdmission = `${viewData_baseUrl_MC}/AdmissionApi/insertadmissionbycashline`;

    $.ajax({
        url: viewData_save_newAdmission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelValue),
        async: false,
        success: function (result) {

            if (result.data.status === 100) {
                if (!isReimburesment) {
                    var messageSuccessAlert = alertify.success(result.data.statusMessage);
                    messageSuccessAlert.delay(admission.delay);
                    adm_Identity = result.data.id;

                }
                else {
                    var messageSuccessAlert = alertify.success(admission.insert_success);
                    messageSuccessAlert.delay(admission.delay);
                    adm_Identity = result.data.id;


                }
                modal_close_newAdm(true);
            }
            else if (result.data.status === -1 || result.data.status === -102) {
                var msg_status_1 = alertify.error(result.data.statusMessage);
                msg_status_1.delay(admission.delay);
                $("#saveForm").prop("disabled", false)
            }
            else {
                generateErrorValidation(result.validationErrors);
                $("#saveForm").prop("disabled", false)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_newAdmission);
            $("#saveForm").prop("disabled", false)
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

    //admissionExtraProperty 5
    if (checkResponse(HIDIdentity) && HIDIdentity != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.hID,
            elementValue: HIDIdentity
        })
    }

    //admissionExtraProperty 6
    admissionExtraPropertyList.push({
        elementId: admissionExtraProperty.hIDOnline,
        elementValue: HIDOnline
    })

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

    //admissionExtraProperty 3
    admissionExtraPropertyList.push({
        elementId: admissionExtraProperty.referralTypeId,
        elementValue: +$("#referralTypeId").val()
    })

    //admissionExtraProperty 10
    if (+$("#reasonForEncounterId").val() != 0) {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.reasonForEncounterId,
            elementValue: +$("#reasonForEncounterId").val()
        })
    }

    //admissionExtraProperty 2
    if ($("#refferingHID").val() != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.referredHID,
            elementValue: $("#refferingHID").val()
        })
    }

    //admissionExtraProperty 21
    if ($("#prescriptionDatePersian").val() != "") {

        let prescriptionDateShmasi = $("#prescriptionDatePersian").val()
        let prescriptionDateMiladi = moment.from(prescriptionDateShmasi, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');

        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.prescriptionDate,
            elementValue: prescriptionDateMiladi
        })
    }

    return admissionExtraPropertyList
}

function resetAdmission() {

    $("#stepHeader0").click();
    form = $('#patientForm').parsley();
    form.reset();

    // ----------------------------

    $("#admBox").addClass("d-none");
    $("#admnId").val("");
    $("#dateTime").val("");
    $("#userFullName").val("");
    $("#sumNetPriceTotal").text(0);


    if (!$("#expandAdmissionBtn i").hasClass("fa-plus"))
        $("#expandAdmissionBtn").click();
    if (!$("#expandAdmissionBtnDiag i").hasClass("fa-plus"))
        $("#expandAdmissionBtnDiag").click();

    // ----------------------------

    $("#tempService").html(emptyRowHTML);
    $("#tempCash").html(emptyRowHTML);
    $("#sumRowService").addClass("displaynone");
    $("#sumRowCash").addClass("displaynone");
    $(".sumNetPrice").text("").removeClass("sum-is-same");
    $("#sumPayAmountCashAdm").text("");
    $("#sumPayAmountCashAdm").removeClass("sum-is-same");
    $("input.form-control").val("");

    $(".select2").removeAttr("disabled");

    $("#patientForm").removeAttr("disabled");
    $("#patientForm .form-control:not(#patientId,#workshopName,#birthDatePersian)").removeAttr("disabled");
    $("#serviceForm").removeAttr("disabled");
    $("#cashForm").removeAttr("disabled");


    $("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change");

    $("#hidonline").prop("checked", false).trigger("change");
    $("#getAttenderHID").prop("disabled", false);
    $("#getPatientInfoWS").prop("disabled", false);
    $("#getPersobByBirthWS").prop("disabled", false);

    patientId = 0;
    insurancesList = [];
    patientInsurer = null;
    terminologyInfo = null;
    attenderMsc = "0";
    attenderMscTypeId = 0;
    inqueryID = 0;
    referringDoctorInfo = null;
    HIDIdentity = "0";
    HID = "0";
    HIDOnline = false;
    REFFERINGHID = "0";
    arr_tempService = [];
    adm_Identity = 0;
    calPriceModel = {};
    insurExpDateValid = true;
    priscriptionDateValid = true;
    attenderScheduleValid = false;
    basicInsurerCode = 37;
    compInsurerCode = 0;
    entitlement = 1;
    resetDiagnosis();
    dropDownCacheData = {
        compInsurerId: null,
        compInsurerLineId: null,
        thirdPartyInsurerId: null,
        basicInsurerId: 0,
        basicInsurerLineId: 0,
        basicInsurerLineTerminologyCode: 0,
        basicInsurerLineName: "",
        discountInsurerId: null
    }
}

function onChangeSetps(currentIndex, newIndex, stepDirection) {

    if (userInfoLogin.counterTypeId == 1)
        $("#stepHeader3").addClass("disabled-header");
    else
        $("#stepHeader3").removeClass("disabled-header");

    if (stepDirection === 'forward') {
        var from = $(`#stepIndex${currentIndex}`).parsley();

        if (currentIndex != "3") {
            if (currentIndex == "2")
                from = $(`#stepIndex${currentIndex} #mainStepIndex2`).parsley();

            var validate = from.validate();
            validateSelect2(from);
            if (!validate) return false;
        }

        if (currentIndex == "0") {
            if (isReimburesment)
                $("#basicInsurerExpirationDatePersian").prop("data-parsley-greatthentodey", false).prop("required", false);
        }

    }

    if (currentIndex == "2") {
        if (userInfoLogin.counterTypeId == 1) {
            $("#Finishbutton").addClass("d-inline-block");
            $("#nextbutton").addClass("d-none");


            if (stepDirection === 'forward')
                saveAdmission();

        }
    } else {
        $("#Finishbutton").removeClass("d-inline-block");
        $("#nextbutton").removeClass("d-none");
    }
    return true;
}

function onFocusSetps(currentIndex) {

    let firstInput = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").first(),
        tabIndexInput = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").first().prop("tabIndex"),
        last = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").last().prop("tabIndex");

    if (firstInput.length < 1)
        return $(`#${activeStepId}`).attr("tabindex", "-2").focus();

    if (!firstInput.prop("disabled") && (firstInput.hasClass("form-control") || firstInput.prop("tagName") == "BUTTON")) {
        for (var i = tabIndexInput; i < last; i++) {

            firstInput = $(`.step-tab-panel.active [tabindex=${i}]`).first();

            if (!firstInput.prop("disabled") && (firstInput.hasClass("form-control") || firstInput.prop("tagName") == "BUTTON")) {

                if (currentIndex == "1" && firstInput.attr("id") == "nationalCode" && firstInput.val() !== "") {
                    $("#firstName").focus();
                    break;
                }
                else {
                    firstInput.hasClass("select2") ?
                        $(`.step-tab-panel.active #${firstInput.attr("id")}`).next().find('.select2-selection').focus() : $(`.step-tab-panel.active #${firstInput.attr("id")}`).focus();
                    break;
                }
            }

        }
    }
    else
        firstInput.hasClass("select2") ?
            $(`.step-tab-panel.active #${firstInput.attr("id")}`).next().find('.select2-selection').focus() : firstInput.focus();
}

function onNextSetps(ev) {
    //let userInfoLogin = getCashIdByUserId()
    ev.preventDefault();
    ev.stopPropagation();
    let ln = $(".step-tab-panel").length;
    if ($(".step-tab-panel.active").data().step !== `step${userInfoLogin.counterTypeId == 1 ? +ln - 1 : ln}`) {
        $("#nextbutton").click();
    }
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
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_w) {
        e.preventDefault();
        e.stopPropagation();
        $("#getPatientInfoWS").click();
    }
    //else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_n) {
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

$("#stepHeader2").on("click", function () {
    setTimeout(() => {
        if ($("#basicInsurerBookletPageNo").prop("disabled"))
            $("#serviceId").select2("focus")
    }, 50)
})

$("#stepHeader3").on("click", async function () {

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

$("#saveForm").on("click", function () {
    saveAdmission();
});

$("#admissionFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});
///////////////////////////////////////////////////////////  END INIT FORM /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START ATTENDER  /////////////////////////////////////////////////////////////////
function editReferingDoctorInfo() {

    $("#referringDoctorId").prop("disabled", false).trigger("change")
    $("#referringDoctorId").select2("focus")

    if (typeof configEditReferingDoctorInfoInAdmissionImaging != "undefined")
        configEditReferingDoctorInfoInAdmissionImaging()
}

function setReserve(res, currentDate) {
    if (res) {
        let reserveDateTime = `${res.reserveTime}  ${moment.from(currentDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}`;
        admissionReserveDateTimePersian = reserveDateTime;
        $("#reserveNo").val(res.reserveNo);
        $("#reserveDate").val(reserveDateTime);
        $("#scheduleBlockId").val(res.scheduleBlockId)
    }
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

    if (firstTimeResetShabad) {

        $("#reserveNo").val("");
        $("#reserveDate").val("");
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
            setReserve(reserve, currentDate);
        }
        else if (reserveStatus === -1 || reserveStatus === -2 || reserveStatus === -4) {

            attenderScheduleValid = false;

            var msg = alertify.warning(reserve['statusMessage']);
            msg.delay(admission.delay);
            $("#reserveNo").val("");
            $("#reserveDate").val("");
            $("#reserveShift").val(0);
            $("#scheduleBlockId").val("")
            $("#attenderId").select2("focus");
        }
        else {
            var msg = alertify.warning(reserve['statusMessage']);
            msg.delay(admission.delay);
            $("#referralTypeId").select2("focus");
            //if (!isReimburesment)
            //    await reserve_init(attenderId, isReimburesment);
        }
    }
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

$("#attenderId").on("change", async function () {
    var attenderId = +$(this).val();

    $("#serviceId").empty();

    resetAdmCalPrice();

    getShiftReserve();

    if (attenderId !== 0) {
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, attenderId, false, 3, "انتخاب خدمت");
        getAttenderInfo(+$(this).val());
        if (!isReimburesment)
            await reserve_init(attenderId, isReimburesment);
    }
    else {
        attenderMsc = "0";
        attenderMscTypeId = 0;
        $("#reserveShift").val(0)
        $("#reserveBox").addClass("d-none");
    }
});

$("#referringDoctorId").on("change", function () {
    if (+$(this).val() !== 0) {
        referringDoctorInfo = getReferringDoctorInfo(+$(this).val());
        $("#prescriptionDatePersian").prop("required", true).prop("disabled", false);
    }
    else {
        referringDoctorInfo = null;
        $("#prescriptionDatePersian").val("").prop("disabled", true).prop("required", false);
    }
});
///////////////////////////////////////////////////////////  END ATTENDER  /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START PATIENT  /////////////////////////////////////////////////////////////////
function OpenSearchPanelByNationalCode() {
    /// در اینجا در صورت ورود متن نمبر تذکره مقدار، را دریافت کرده و آنرا در جستجو استفاده میکند، پس از قرار دادن نمبر تذکره  جستجو را انجام داده و فوکوس را به ردیف اول میدهد
    let nationalCode = $("#nationalCode").val();
    if (nationalCode != "" && nationalCode != undefined) {
        $("#tempPatient").html(fillEmptyRow(18));
        displayCountRowModal(0, "searchPatientModal");
        $("#searchPatientNationalCode").val(nationalCode);
        $("#searchPatientAdmission").click();
        if (!isReimburesment) {
            setTimeout(() => {
                getPateitnReservedList();
            }, 500);
        }
    }
}

function getPateitnReservedList() {

    let url = `${viewData_baseUrl_MC}/AdmissionApi/getpateitnreservedlist`,
        id = +$("#patientId").val();

    if (+$("#patientId").val() !== 0)
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(id),
            success: function (result) {
                fillReservedList(result);
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return 0;
            }
        });
}

function fillReservedList(result) {
    var output = "";
    if (result != null) {
        if (result.length > 0) {
            $("#pateitnReservedList").html("");
            for (var i in result) {
                var data = result[i];

                output = `<tr>
                          <td>${data.id}</td> 
                          <td>${data.attenderId} - ${data.attenderFullName}</td>
                          <td>${data.branchName}</td>
                          <td>${data.saleTypeName}</td>
                          <td>${data.stateId} - ${data.stateName}</td>
                          <td>${data.reserveDateTimePersian}</td>
                          <td>${data.createDateTimePersian}</td>
                          <td>${data.userFullName}</td>
                          <td>${data.patientFullName}</td>
                          <td>${data.nationalCode}</td>
                          <td>${data.admissionNo}</td>
                          <td>${data.reserveShiftId == 1 ? "صبح" : "عصر"}</td>
                     </tr>`

                $(output).appendTo("#pateitnReservedList");
            }
        }
        else {
            $("#pateitnReservedList").html(fillEmptyRow(12));
        }
    }
}

function loadingDoneCallUp() {
    $("#getPatientInfoWS").html(`<i class="fas fa-cogs"></i>`);
}

function loadingDonePersonByBirth() {
    $("#getPersobByBirthWS i").removeClass(`fa-spinner fa-spin`).addClass(`fa-users`);
}

function callUpInsurance(btn) {

    $(btn).html(`<i class="fa fa-spinner fa-spin"></i>`);

    setTimeout(function () {
        var referralTypeId = $("#referralTypeId").val();

        // اگرنوع مراجعه مجهول بود این متد اجرا نخواهد شد
        if (+referralTypeId === 2) {
            var msgreferral = alertify.error("در صورت دسترسی به نمبر تذکره مراجعه کننده ، سایر انواع مواجعه را انتخاب نمایید");
            msgreferral.delay(alertify_delay);
            $(btn).prop("disabled", false);
            loadingDoneCallUp();
            $("#referralTypeId").select2("focus");
            $("#nationalCode").removeAttr("disabled")
            return;
        }
        // اگر نوع مراجعه اصلی - نوزاد  و اتباع بود
        else if (+referralTypeId === 1 || +referralTypeId === 3 || +referralTypeId === 4) {
            var isForeign = referralTypeId === "4" && $("#nationalCode").val().length === 12;
            var id = attenderMsc;
            var mscType = attenderMscTypeId;

            callUpInsuranceWS($("#nationalCode").val(), isForeign, id, mscType, btn);
        }

    }, 10);
}

function callUpInsuranceWS(nationalCode, isForeign, id, mscType) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/callupinsurance`

    var personModel = {
        nationalCode: nationalCode,
        isForeign: isForeign
    }

    var provider = {
        id: id,
        mscType: mscType
    }

    var callUpInsuranceModel = {
        person: personModel,
        provider: provider
    }

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(callUpInsuranceModel),
        success: function (result) {

            loadingDoneCallUp();
            var resultPatientIdentity = null;
            resultPatientIdentity = result;

            if (resultPatientIdentity.successfull) {
                var data = resultPatientIdentity.data;

                $("#referralTypeId").prop("disabled", true);
                $("#nationalCode").prop("disabled", true);
                $("#birthDatePersian").val(data.birthDate).prop("disabled", true);
                $("#firstName").val(data.firstName).prop("disabled", true);
                $("#lastName").val(data.lastName).prop("disabled", true);
                $("#genderId").val(data.genderId).prop("disabled", true).trigger("change");

                // اگر بیمه داشت
                if (data.insurances !== null) {

                    insurancesList = data.insurances;

                    // اگر تعداد بیمه صفر بود
                    if (data.insurances.length === 0) {
                        resetPatientInfo();
                        var alertInsurer = alertify.warning("مراجعه کننده تحت پوشش بیمه نمی باشد");
                        alertInsurer.delay(alertify_delay);
                        return;
                    }
                    // اگر تعداد بیمه 1 بود
                    else if (data.insurances.length === 1) {
                        var insurance = data.insurances[0];
                        if (insurance.covered) {

                            patientInsurer = data.insurances[0];

                            inqueryID = insurance.inquiryId;

                            $("#basicInsurerLineId").val(`1-${insurance.basicInsurerLineId}`).trigger("change").prop("disabled", true);
                            $("#basicInsurerExpirationDatePersian").val(insurance.expireDate).prop("disabled", true);
                            $("#basicInsurerNo").val(insurance.insuranceNumber).prop("disabled", true);
                            $("#workshopName").val(insurance.workShopName);
                            $("#editSectionPatient").prop("disabled", false);
                            $("#countryId").select2("focus");
                        }
                        else {
                            resetPatientInfo();
                            var alertInsurer = alertify.warning("مراجعه کننده تحت پوشش بیمه نمی باشد");
                            alertInsurer.delay(alertify_delay);
                            return;
                        }
                    }
                    // اگر تعداد بیمه بزرگتر از 1 بود
                    else {
                        var lenInsurer = data.insurances.length;
                        var outputInsurance = "";
                        $("#tempInsurances").html(outputInsurance);

                        for (var n = 0; n < lenInsurer; n++) {

                            data.insurances[n].rowNumber = n + 1;

                            var insurer = data.insurances[n];

                            outputInsurance = `<tr ${insurer.recommendationMessage !== null ? 'class="highlight"' : ""}>
                                       <td>${insurer.insurerId}</td>
                                       <td>${insurer.basicInsurerLineId}</td>
                                       <td>${insurer.insuranceName}</td>
                                       <td>${insurer.insuranceNumber}</td>
                                       <td>${insurer.expireDate}</td>
                                       <td>${insurer.covered ? `<button type="button" onclick="setPatientInsurer(${insurer.rowNumber})" class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                                                                  <i class="fa fa-check"></i>
                                                                           </button>` : 'اعتبار ندارد'}</td>                   
                               </tr>`;

                            $(outputInsurance).appendTo("#tempInsurances");
                        }

                        loadingDoneCallUp();


                        modal_show(`patientInsuranceModal`);
                    }
                }
                else {
                    resetPatientInfo();
                    var alertInsurer = alertify.warning("برای این نمبر تذکره بیمه ای ثبت نشده");
                    alertInsurer.delay(alertify_delay);

                    return;
                }
            }
            else {
                if (resultPatientIdentity.status === -104) {

                    $("#basicInsurerLineId").val("1-73").trigger("change");

                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    loadingDoneCallUp();
                    $("#editSectionPatient").prop("disabled", false);
                    $("#nationalCode").removeAttr("disabled")
                    return;
                }
                if (resultPatientIdentity.status === -105) {
                    $("#basicInsurerLineId").val("1-73").trigger("change");
                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    loadingDoneCallUp();
                    resetPatientInfo();
                }
                else if (resultPatientIdentity.status === -103) {
                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    loadingDoneCallUp();
                    resetPatientInfo();
                }
                else {
                    resetPatientInfo();
                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            $("#nationalCode").removeAttr("disabled")
            loadingDoneCallUp();
            error_handler(xhr, url);
        }
    });
}

function checkInsurerTamin(referralTypeId) {

    let insurerId = ""

    if (checkResponse(dropDownCacheData))
        insurerId = +dropDownCacheData.basicInsurerId
    else
        insurerId = null

    if (referralTypeId === 1 || referralTypeId === 3) {
        if (insurerId === 8000)
            $("#nationalCode").attr("maxlength", "16");
        else
            $("#nationalCode").attr("maxlength", "10");
    }
    else if (referralTypeId === 2)
        $("#nationalCode").attr("maxlength", "10");
    else
        $("#nationalCode").attr("maxlength", "13");
}

function clearDataPatient() {
    if (+$("#patientId").val() != 0)
        alertify
            .confirm('', `مشخصات ${$("#patientId").val()} ${$("#firstName").val()} ${$("#lastName").val()} 
                        در بانک اطلاعاتی مراجعه کنندگان کامل  می باشد. در صورت انتصاب نوع مراجعه مجهول،می بایست مجدد اطلاعات فردی را ثبت نموده و 
                        <b style="font-weight: bolder;">به عنوان یک مراجعه کننده جدید پذیرش نمایید</b>`,
                function () {
                    $("#nationalCode").val("").prop("disabled", true).blur();
                    $("#basicInsurerLineId").val("1-73").trigger("change").prop("disabled", true);
                    $("#compInsurerThirdPartyId").val("0").prop("disabled", true).trigger("change");
                    $("#discountInsurerId").val("0").trigger("change");
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
                    $("#compInsurerThirdPartyId").val("0").trigger("change");
                    setTimeout(() => $("#firstName").focus(), 5);
                },
                function () {
                    $("#referralTypeId").val(1).trigger("change.select2");
                    setTimeout(() => $("#firstName").focus(), 5);
                }).set('labels', { ok: 'بلی', cancel: 'خیر' });
    else {
        $("#nationalCode").val("").prop("disabled", true).blur();
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
        $("#compInsurerThirdPartyId").val("0").prop("disabled", true).trigger("change");
        $("#discountInsurerId").val("0").trigger("change");
        setTimeout(() => $("#firstName").focus(), 5);
    }
}

function setInsurerInfo(insurerTypeId, isurerId) {

    if (insurerTypeId == 1) {
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

        //disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)
        if (disabledInsurersByCode.includes(+dropDownCacheData.basicInsurerId)) {
            $("#basicInsurerNo").val('').prop("disabled", true);
            $("#basicInsurerBookletPageNo").val('').prop("disabled", true);
            $("#basicInsurerExpirationDatePersian").val('').prop("disabled", true);
        }
        else {
            $("#basicInsurerNo").prop("disabled", false);
            $("#basicInsurerBookletPageNo").prop("disabled", false);
            $("#basicInsurerExpirationDatePersian").val(getlastdayofyear).prop("disabled", false);

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

        let discountInsurerId = isurerId

        let insurerInfo = getInsurerInfo(+discountInsurerId, 0, '', '');

        dropDownCacheData.discountInsurerId = insurerInfo.insurerId
    }

}

function resetPatientInfo(opr) {



    $("#referralTypeId").prop("disabled", true)
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#nationalCode").prop("disabled", true);

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerExpirationDatePersian").prop("disabled", false);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    }

    $("#firstName").prop("disabled", true);
    $("#lastName").prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);
    $("#searchPatient").prop("disabled", true);


    //$("#genderId").prop("disabled", false);
    //$("#idCardNumber").prop("disabled", false);
    //$("#postalCode").prop("disabled", false);
    //$("#jobTitle").prop("disabled", false);
    //$("#phoneNo").prop("disabled", false);
    //$("#maritalStatusId").prop("disabled", false);
    //$("#educationLevelId").prop("disabled", false);
    //$("#fatherFirstName").prop("disabled", false);
    //$("#countryId").prop("disabled", false);
    //$("#mobile").prop("disabled", false);
    //$("#address").prop("disabled", false);

    $("#editSectionPatient").prop("disabled", true);

    if (+$("#referralTypeId").val() == 2) {
        $("#nationalCode").val("").prop("disabled", true).blur();
        $("#basicInsurerExpirationDatePersian").val("").prop("disabled", true);
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
        $("#compInsurerThirdPartyId").val("0").prop("disabled", true).trigger("change");
        $("#discountInsurerId").val("0").prop("disabled", true).trigger("change");
        setTimeout(() => $("#firstName").focus(), 5);
    }
    else {
        $("#compInsurerThirdPartyId").prop("disabled", false);
        $("#discountInsurerId").prop("disabled", false);
    }

    loadingDoneCallUp();
    loadingDonePersonByBirth();
}

async function setPatientInfo(id, referralTypeId, basicInsurerLineId,
    nationalCode, basicInsurerNo, basicInsurerExpirationDatePersian, firstName, lastName, birthDatePersian, genderId, countryId,
    compInsurerLineId, compInsurerId, thirdPartyInsurerId, mobileNo, address, idCardNumber, postalCode, jobTitle, phoneNo, maritalStatusId, fatherFirstName, educationLevelId, discountInsurerId) {

    getPateitnReservedList();
    patientId = id;
    $("#patientId").val(id === 0 ? "" : id);
    $("#referralTypeId").val(referralTypeId).trigger("change");
    $("#basicInsurerLineId").val(`1-${basicInsurerLineId}`).trigger("change");
    $("#nationalCode").val(nationalCode);
    $("#basicInsurerNo").val(basicInsurerNo);
    $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian);
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
    $("#address").val(address);
    $("#idCardNumber").val(idCardNumber);
    $("#postalCode").val(postalCode);
    $("#jobTitle").val(jobTitle);
    $("#phoneNo").val(phoneNo);
    $("#maritalStatusId").val(maritalStatusId);
    $("#educationLevelId").val(educationLevelId);
    $("#fatherFirstName").val(fatherFirstName);
    $("#address").val(address);

    modal_close("searchPatientModal");
    $("#address").focus();

}

async function setPatientInsurerInfo(basicInsurerLineId, basicInsurerNo, basicInsurerExpirationDatePersian, compInsurerLineId, compInsurerId, thirdPartyInsurerId, discountInsurerId) {

    if (+$("#referralTypeId").val() == 2) {
        modal_close("searchPatientInsurerModal");
        //getShabadPatientInsurer(() => {
        //    $("#basicInsurerExpirationDatePersian").val("");
        //    $("#basicInsurerNo").val("");
        //});
        $("#mobile").focus();
        return;
    }

    modal_close("searchPatientInsurerModal");


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

    if (+$("#referralTypeId").val() == 5)
        $("#basicInsurerLineId").val("1-73").trigger("change");
    else
        $("#basicInsurerLineId").val(`1-${basicInsurerLineId}`).trigger("change");


    $("#basicInsurerNo").val(basicInsurerNo);
    $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian);

    $("#basicInsurerNo").val(basicInsurerNo == null ? "" : basicInsurerNo);
    $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian == null ? "" : basicInsurerExpirationDatePersian);

    //getShabadPatientInsurer(() => {
    //    $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian == "null" ? "" : basicInsurerExpirationDatePersian);
    //    $("#basicInsurerNo").val(basicInsurerNo == "null" ? "" : basicInsurerNo);
    //});

    $("#mobile").focus();

}

function getPatientInsurer() {

    if (+$("#patientId").val() == 0) {
        $("#tempPatientI").html(fillEmptyRow(8));
        displayCountRowModal(len, "searchPatientInsurerModal");
        return;
    }

    let patientId = +$("#patientId").val()

    patientInsurerSearch(patientId);
}

function getPersobByBirthWS() {

    $("#nationalCode").attr("disabled", "disabled")

    if (+$("#birthYear").val() == 0) {
        alertify.warning("سال تولد الزامي .").delay(alertify_delay);
        $("#nationalCode").removeAttr("disabled")
        return;
    }

    let currentYear = moment().format("yyyy"),
        firstYear = moment.from("1300", 'fa', 'YYYY').format("yyyy"),
        valueYear = moment.from(+$("#birthYear").val(), 'fa', 'YYYY').format("yyyy");

    if (valueYear > currentYear || valueYear < firstYear) {
        alertify.warning("سال تولد باید کوچکتر مساوی سال  جاری و بزرگتر مساوری سال 1300  باشد").delay(alertify_delay);
        $("#nationalCode").removeAttr("disabled")
        return;
    }


    if (+$("#referralTypeId").val() !== 4) {
        if (!isValidIranianNationalCode($("#nationalCode").val())) {
            var msgvalidNationalCode = alertify.warning("نمبر تذکره معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            $("#nationalCode").removeAttr("disabled")
            return;
        }
    }
    else {
        if ($("#nationalCode").val().length < 12) {
            var msgvalidNationalCode = alertify.warning("کد اتباع معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            $("#nationalCode").removeAttr("disabled")
            return;
        }
    }

    if (attenderMsc === "0" || attenderMscTypeId === 0) {

        resetPatientInfo();

        var alert = alertify.warning("انتخاب داکتر  برای اجرای وب سرویس الزامیست")
        alert.delay(alertify_delay);

        $("#attenderId").select2("focus");
        return;
    }

    $("#firstName").val("");
    $("#lastName").val("");
    $("#birthDatePersian").val("");
    $("#workshopName").val("");
    $("#genderId").val("0").trigger("change");
    $("#getPersobByBirthWS").prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS i").addClass(`fa-spinner fa-spin`).removeClass(`fa-users`);

    setTimeout(() => {
        getPersonByBirthWS($("#nationalCode").val(), +$("#birthYear").val());
    }, 10);
}

async function getPersonByBirthWS(nationalCode, birthYear) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/getpersonbybirth`;

    let model = {
        nationalCode: nationalCode,
        birthYear: birthYear
    };

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            var resultPatientIdentity = result;
            loadingDonePersonByBirth();

            if (resultPatientIdentity.successfull) {

                if (resultPatientIdentity.data.patientInfo === null) {

                    resetPatientInfo();

                    var alertPatientInfo = alertify.warning("اطلاعات مراجعه کننده موردنظر یافت نشد")
                    alertPatientInfo.delay(alertify_delay);
                    return;
                }

                var dataPatient = resultPatientIdentity.data.patientInfo;

                $("#referralTypeId").prop("disabled", true);
                $("#nationalCode").prop("disabled", true);
                $("#birthDatePersian").val(dataPatient.birthDate).prop("disabled", true);
                $("#firstName").val(dataPatient.firstName).prop("disabled", true);
                $("#lastName").val(dataPatient.lastName).prop("disabled", true);
                $("#genderId").val(dataPatient.genderId).prop("disabled", true).trigger("change");
                $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");
                $("#editSectionPatient").prop("disabled", false);

                $("#basicInsurerNo").focus();
            }

            else {
                resetPatientInfo();
                var alertPatientInfo1 = alertify.warning(resultPatientIdentity.statusMessage)
                alertPatientInfo1.delay(alertify_delay);
                loadingDonePersonByBirth();
                $("#birthYear").focus();
                return;
            }

        },
        error: function (xhr) {
            $("#nationalCode").removeAttr("disabled")
            error_handler(xhr, url);
        }
    });


}

function birthYearKeydown(e) {
    if (e.keyCode === KeyCode.Enter) {
        e.stopPropagation();
        e.preventDefault();
        getPersobByBirthWS();
    }
}

function birthYearcclick(e) {
    e.stopPropagation();
    e.preventDefault();
    $(e.currentTarget).select();
}

$("#referralTypeId").on("change", function () {

    var patientRefId = +$(this).val();
    $("#basicInsurerLineId").html("")

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/${patientRefId}`)

    $('#basicInsurerLineId').prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    $("#nationalCode").prop("disabled", false);
    $("#searchPatient").prop("disabled", false);

    if (patientRefId === 5) {
        $("#basicInsurerLineId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    }
    else if (patientRefId === 2)
        clearDataPatient();
    else {
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#basicInsurerLineId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    }

    checkInsurerTamin(+$("#referralTypeId").val());
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

    //if (!isReimburesment)
    resetShabadElements();

    HIDIdentity = "";
    HIDOnline = false;
    $("#hid").val("");
    $("#hidonline").prop("checked", false).trigger("change");

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

$("#nationalCode").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter && +dropDownCacheData.basicInsurerId === 8000 && +$("#referralTypeId").val() === 1 && $("#nationalCode").val().length === 16) {
        var valScannr = $(this).val();
        $(this).val(valScannr.substring(0, 10));
    }
});

$("#nationalCode").on("blur", function (e) {

    var nationalCode = $(this).val();

    if (+$("#referralTypeId").val() === 1 || +$("#referralTypeId").val() === 3) {
        if (!isValidIranianNationalCode(nationalCode) && nationalCode !== "") {
            var nCodeValid = alertify.warning("نمبر تذکره معتبر نمی باشد");
            nCodeValid.delay(alertify_delay);
            return;
        }
    }
    else if (+$("#referralTypeId").val() === 2 && nationalCode !== "") {
        var nCodeValid = alertify.warning("در صورت دسترسی به نمبر تذکره ، نوع مراجعه را اصلاح نمایید");
        nCodeValid.delay(alertify_delay);
        return;
    }

    if (nationalCode !== "")
        getPatientByNationalCode_adm(nationalCode, 2, (result) => {
            if (checkResponse(result)) {
                isActivePatient = result.isActive
                $("#patientId").val(result.id);
                $("#firstName").val(result.firstName);
                $("#lastName").val(result.lastName);
                $("#birthDatePersian").val(result.birthDatePersian);
                $("#genderId").val(result.genderId).trigger("change");
                $("#countryId").val(result.countryId == 0 ? 101 : result.countryId).trigger("change");
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

});

$("#nationalCode").on("input", function () {

    if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").val("").prop("disabled", true);
        $("#basicInsurerBookletPageNo").val('').prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").val("").prop("disabled", true);
    }
    else {

        $("#basicInsurerExpirationDatePersian").val(getlastdayofyear).prop("disabled", false);
        $("#basicInsurerNo").val('').prop("disabled", false);
        $("#basicInsurerBookletPageNo").val('').prop("disabled", false);
    }

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

$("#getPatientInfoWS").on("click", function () {

    $("#nationalCode").attr("disabled", "disabled")

    if (attenderMsc === "0" || attenderMscTypeId === 0) {

        resetPatientInfo();

        $("#nationalCode").val("").blur();

        var alert = alertify.warning("شماره نظام داکتری و نوع نظام داکتری داکتر ثبت نشده");
        alert.delay(alertify_delay);
        $("#attenderId").select2("focus");
        return;
    }

    if (+$("#referralTypeId").val() !== 4) {
        if (!isValidIranianNationalCode($("#nationalCode").val())) {
            var msgvalidNationalCode = alertify.warning("نمبر تذکره معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            $("#nationalCode").removeAttr("disabled")
            return;
        }
    }
    else {
        if ($("#nationalCode").val().length < 12) {
            var msgvalidNationalCode = alertify.warning("کد اتباع معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            $("#nationalCode").removeAttr("disabled")
            return;
        }
    }


    inqueryID = 0;

    $(this).prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);

    callUpInsurance($(this));
});

$("#getPersobByBirthWS").on("click", function () {
    if (+$("#birthYear").width() == 0)
        $("#birthYear").animate({ width: '35', opacity: "1", paddingRight: "5", marginRight: "5" }, 350).focus();
    else
        $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");
});

$("#searchPatient").on("click", function () {
    modal_show("searchPatientModal");
    OpenSearchPanelByNationalCode();
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
        mobileNo: $("#searchPatientMobileNo").val(),// == "" ? null : $("#searchPatientMobileNo").val(),
        insurNo: $("#searchPatientBasicInsurerNo").val().trim(),// == "" ? null : $("#searchPatientBasicInsurerNo").val().trim(),
        insurerLineId: basicInsurerLineId,
        compInsurerLineId,
        thirdPartyInsurerId,
    }

    patientSearch(patientSearchModel);
});

$("#searchPatientInsurerModal").on("hidden.bs.modal", async function () {
    setTimeout(function () {
        $("#mobile").focus();
    }, 10);
});

$("#searchPatientModal").on("shown.bs.modal", function () {
    setTimeout(function () {
        resetSearchPatient();
        $(`#tempPatient #p_0`).addClass("highlight");
        $(`#tempPatient #p_0 > td > button`).focus();
    }, 10);
});

$("#searchPatientInsurerModal").on("shown.bs.modal", function () {
    setTimeout(function () {
        $(`#tempPatientI #pI_0`).addClass("highlight");
        $(`#tempPatientI #pI_0 > td > button`).focus();
    }, 10);
});

$("#editSectionPatient").on("click", function () {
    resetPatientInfo();
    $(this).prop("disabled", true);
});

$("#reserveModal").on("hidden.bs.modal", function () {
    $("#referralTypeId").select2("focus");
});
///////////////////////////////////////////////////////////  END PATIENT  /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START SERVICE  /////////////////////////////////////////////////////////////////
function resetShabadElements() {
    if (firstTimeResetShabad) {

        if ($("#hidonline").prop("checked")) {
            $("#eliminateReasonId").val(1).trigger("change");
            eliminateHid();
        }

        HIDIdentity = "";
        $("#attenderHID").val("");
        $("#getAttenderHID").prop("disabled", false);
        $("#hidonline").prop("checked", false).trigger("change");
    }
}

function getAttenderHID(btnHID) {

    $(btnHID).html(`<i class="fa fa-spinner fa-spin"></i>`);

    setTimeout(function () {

        var referralTypeId = +$("#referralTypeId").val();

        var arrHasWWebService = [1, 2, 37];

        var person = {
            nationalCode: $("#nationalCode").val(),
            isForeign: $("#referralTypeId").val() === "4"
        }

        var provider = {
            id: attenderMsc,
            mscType: attenderMscTypeId
        }

        var insurer = {
            id: dropDownCacheData == null ? null : dropDownCacheData.basicInsurerLineTerminologyCode,
            name: dropDownCacheData == null ? null : dropDownCacheData.basicInsurerLineName
        }

        var referring = null;

        if (referringDoctorInfo !== null) {

            referring = {
                id: referringDoctorInfo.msc,
                mscTypeId: referringDoctorInfo.mscTypeId,
            }
        }
        else {
            referring = {
                id: null,
                mscTypeId: 0
            }
        }

        var resultHID = null;
        HIDIdentity = "";
        $("#attenderHID").val("");
        HIDOnline = false;
        $("#hidonline").prop("checked", false).trigger("change");

        // اگر بیمه تامین - خدمات درمانی و آزاد نبود رجوع به انبار
        if (arrHasWWebService.indexOf(insurer.id) === -1) {
            // رجوع به انبار با Insurer=37

            var HID = getHID(37);
            loadingDoneHID();

            if (HID === "") {
                var alertHID = alertify.warning("به فرم درخواست HID مراجعه نمایید");
                alertHID.delay(alertify_delay);
                return;
            }

            HIDIdentity = HID;
            $("#attenderHID").val(HIDIdentity);

            $("#editSectionPatient").prop("disabled", true);
            $(btnHID).prop("disabled", true);
            //$("#editSectionShabad").prop("disabled", false);
            $("#serviceId").select2("focus");
        }
        // اگر نوع مراجعه اصلی بود یا اتباع و اگر بیمه تامین - خدمات درمانی و آزاد بود رجوع به وب سرویس
        else if ((referralTypeId === 1 || referralTypeId === 5 || referralTypeId === 4 || referralTypeId === 6) && (arrHasWWebService.indexOf(insurer.id) > -1)) {

            resultHID = getHIDWS(person, provider, insurer, referring, inqueryID);
            loadingDoneHID();

            // اگر دریافت شناسه شباد موفقیت آمیز بود
            if (resultHID.successfull) {
                HIDIdentity = resultHID.data.id;
                HIDOnline = true;
                $("#attenderHID").val(HIDIdentity);

                $("#editSectionPatient").prop("disabled", true);
                $(btnHID).prop("disabled", true);
                $("#editSectionShabad").prop("disabled", true);
                $("#hidonline").prop("checked", true).trigger("change");
                $("#serviceId").select2("focus");
            }
            else {

                // اگر وب سرویس قطع بود دریافت شناسه شباد از انبار
                if (resultHID.status === -103 || resultHID.status === -105 || resultHID.status === -101) {

                    if (resultHID.status === -105) {
                        var reloadWebServiceAlert = alertify.warning(resultHID.statusMessage);
                        reloadWebServiceAlert.delay(alertify_delay);
                    }

                    var hidOfflineAlert = alertify.warning("دریافت شباد آفلاین");
                    hidOfflineAlert.delay(alertify_delay);

                    // دریافت hid از انبار
                    var HID = getHID(insurer.id);
                    loadingDoneHID();

                    if (HID === "") {
                        var alertHID = alertify.warning("به فرم درخواست HID مراجعه نمایید");
                        alertHID.delay(alertify_delay);
                        return;
                    }

                    HIDIdentity = HID;
                    $("#attenderHID").val(HIDIdentity);

                    $("#editSectionPatient").prop("disabled", true);
                    $(btnHID).prop("disabled", true);
                    $("#editSectionShabad").prop("disabled", true);
                    $("#serviceId").select2("focus");
                }
                else if (resultHID.status === -104) {

                    var hidmessage = alertify.warning(resultHID.statusMessage);
                    hidmessage.delay(alertify_delay);

                    var HID = getHID(insurer.id);
                    loadingDoneHID();

                    if (HID === "") {
                        var alertHID = alertify.warning("به فرم درخواست HID مراجعه نمایید");
                        alertHID.delay(alertify_delay);
                        return;
                    }

                    HIDIdentity = HID;
                    $("#attenderHID").val(HIDIdentity);

                    $("#editSectionPatient").prop("disabled", true);
                    $(btnHID).prop("disabled", true);
                    $("#editSectionShabad").prop("disabled", false);
                    $("#serviceId").select2("focus");
                }
                else if (resultHID.status === -106) {
                    var hidmessage = alertify.warning(resultHID.statusMessage);
                    hidmessage.delay(alertify_delay);

                    var HID = getHID(insurer.id);
                    loadingDoneHID();

                    if (HID === "") {
                        var alertHID = alertify.warning("به فرم درخواست HID مراجعه نمایید");
                        alertHID.delay(alertify_delay);
                        return;
                    }

                    HIDIdentity = HID;
                    $("#attenderHID").val(HIDIdentity);

                    $("#editSectionPatient").prop("disabled", true);
                    $(btnHID).prop("disabled", true);
                    $("#editSectionShabad").prop("disabled", false);
                    $("#serviceId").select2("focus");
                }
                // خطا در اجرای وب سرویس
                else if (resultHID.status === -102 || resultHID.status === -101) {

                    var msgErrHID = alertify.warning(resultHID.statusMessage);
                    msgErrHID.delay(alertify_delay);
                    return;
                }
            }
        }
        // اگر نوع مراجعه مجهول و نوزاد بود و بیمه تامین - خدمات درمان - آزاد بود رجوع به انبار
        else if ((+referralTypeId === 2 || +referralTypeId === 3) && (arrHasWWebService.indexOf(insurer.id) > -1)) {

            // رجوع به انبار با InsurerId
            var HID = getHID(insurer.id);
            loadingDoneHID();

            if (HID === "") {
                var alertHID = alertify.warning("به فرم درخواست HID مراجعه نمایید");
                alertHID.delay(alertify_delay);
                return;
            }

            HIDIdentity = HID;
            $("#attenderHID").val(HIDIdentity);

            $("#editSectionPatient").prop("disabled", false);
            $(btnHID).prop("disabled", true);
            $("#serviceId").select2("focus");

            $("#editSectionShabad").prop("disabled", true);
        }

        //============ STEPS ============//
        if ($("#attenderHID").val() !== "")
            $("#attenderHID").removeClass("parsley-error").parents(".form-group").find("ul li").html("");
        //============ STEPS ============//

    }, 100);
}

function getHID(insurerId) {

    let viewData_get_HID_url = `${viewData_baseUrl_MC}/HealthIDOrderApi/gethid`;

    var result = $.ajax({
        url: viewData_get_HID_url,
        type: "POST",
        dataType: "text",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(insurerId),
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_HID_url);
            return "";
        }
    });

    return result.responseText;
}

function loadingDoneHID() {
    $("#getAttenderHID").html(`<i class="fas fa-cogs"></i>`);
}

function addTempServiceAdm() {

    //let admnId = $("#admnId").val()
    let admissionMasterId = $("#admnMasterId").val()

    var resultOpenCash = checkOpenCashReimbursement(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق افزودن خدمت امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }

    var msg_s = alertify;

    var serviceIdIndex = arr_tempService.findIndex(s => s.serviceId === +$("#serviceId").val());

    var referralTypeId = $("#referralTypeId").val();

    if (+referralTypeId == 5 || +referralTypeId == 6)
        referralTypeId == "1";

    if (serviceIdIndex !== -1) {
        msg_s = alertify.warning(admission.hasService);
        msg_s.delay(admission.delay);

        $("#serviceId").select2("focus");
        return;
    }

    var model = {};

    if (+$("#attenderId").val() === 0) {

        $("#attenderId").select2("focus");
        msg_s = alertify.warning(admission.notHasAttender);
        msg_s.delay(admission.delay);
        return;
    }

    if (+$("#referringDoctorId").val() !== 0) {
        if ($("#prescriptionDatePersian").val() !== "") {
            if (!isValidShamsiDate($("#prescriptionDatePersian").val())) {
                $("#prescriptionDatePersian").focus();
                msg_s = alertify.warning("تاریخ نسخه معتبر نمی باشد");
                msg_s.delay(admission.delay);
                return;
            }
            else {
                var modelCheckDate = {
                    date1: $("#prescriptionDatePersian").val()
                };

                var resultComparePris = compareTime(modelCheckDate);

                if (resultComparePris === 1 || resultComparePris === -2) {
                    msg_s = alertify.warning(admission.priscriptionDateNotValid);
                    msg_s.delay(admission.delay);
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
            msg_s = alertify.warning("تاریخ نسخه برای مراجعه کننده مورد نظر را وارد نمایید");
            msg_s.delay(admission.delay);
            return;
        }
    }

    if (!attenderScheduleValid && ($("#reserveNo").val() === "" && $("#reserveDate").val() === "" && $("#reserveShift").val() == "0" && $("#scheduleBlockId").val() == "")) {
        msg_s = alertify.warning(admission.setReserveInfo);
        msg_s.delay(admission.delay);
        $("#reserveShift").focus();
        return;
    }

    if ((+referralTypeId == 1 || +referralTypeId == 3 || +referralTypeId == 4) && ($("#nationalCode").val() === "" || $("#firstName").val() === "" || $("#lastName").val() === "" || $("#genderId").val() === "0")) {
        msg_s = alertify.warning("اطلاعات مراجعه کننده را کامل وارد نمایید");
        msg_s.delay(admission.delay);
        return;
    }

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode) && ($("#basicInsurerNo").val() === "" || $("#basicInsurerExpirationDatePersian").val() === "" || +$("#basicInsurerLineId").val() == 0)) {
        msg_s = alertify.warning("سایر اطلاعات بیمه ای را وارد نمایید");
        msg_s.delay(admission.delay);

        if (+$("#basicInsurerLineId").val() == 0)
            $("#basicInsurerLineId").select2("focus");
        else if ($.trim($("#basicInsurerNo").val()) === "")
            $("#basicInsurerNo").focus();
        else if ($.trim($("#basicInsurerExpirationDatePersian").val()) === "")
            $("#basicInsurerExpirationDatePersian").focus();

        return;
    }

    if (+referralTypeId === 2 && $("#nationalCode").val() !== "" && (isValidIranianNationalCode($("#nationalCode").val()) || $("#nationalCode").val().length == 12)) {
        var msgreferral = alertify.error("در صورت دسترسی به نمبر تذکره مراجعه کننده ، سایر انواع مواجعه را انتخاب نمایید");
        msgreferral.delay(alertify_delay);
        $("#referralTypeId").select2("focus");
        return;
    }

    if (!priscriptionDateValid) {
        msg_s = alertify.warning(admission.priscriptionDateNotValid);
        msg_s.delay(admission.delay);
        $("#prescriptionDatePersian").focus();
        return;
    }

    if (!insurExpDateValid) {

        msg_s = alertify.warning(admission.insurExpDateNotValid);
        msg_s.delay(admission.delay);
        $("#basicInsurerExpirationDatePersian").focus();
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
    else if (+$("#qty").val() > 200) {
        $("#qty").focus();
        msg_s = alertify.warning("200");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceModel == undefined || calPriceModel.netPrice < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        return;
    }


    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیرفعال می باشد ، امکان افزودن خدمت وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceModel.basicServicePrice == 0 && calPriceModel.basicPrice == 0 && calPriceModel.basicShareAmount == 0 && calPriceModel.compShareAmount == 0 && calPriceModel.netAmount == 0) {
        msg_s = alertify.warning("این خدمت اجازه ثبت ندارد");
        msg_s.delay(admission.delay);
        $("#serviceId").select2("focus")
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
        healthInsuranceClaim: healthClaim,
    };

    arr_tempService.push(model);
    appendServiceAdm(model);
    resetService();

    $("#serviceId").select2("focus");
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#referralTypeId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#thirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);
    $("#prescriptionDatePersian").prop("disabled", arr_tempService.length > 0);
    $("#reserveBox button").prop("disabled", arr_tempService.length > 0);
    $("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);
    $("#getPatientInfoWS").prop("disabled", arr_tempService.length > 0);
    $("#getPersobByBirthWS").prop("disabled", arr_tempService.length > 0);
    $("#nationalCode").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerBookletPageNo").prop("disabled", arr_tempService.length > 0);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
        $("#basicInsurerBookletPageNo").prop("disabled", true);
    }

    $("#firstName").prop("disabled", arr_tempService.length > 0);
    $("#lastName").prop("disabled", arr_tempService.length > 0);
    $("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
    $("#idCardNumber").prop("disabled", arr_tempService.length > 0);
    $("#postalCode").prop("disabled", arr_tempService.length > 0);
    $("#jobTitle").prop("disabled", arr_tempService.length > 0);
    $("#phoneNo").prop("disabled", arr_tempService.length > 0);
    $("#maritalStatusId").prop("disabled", arr_tempService.length > 0);
    $("#educationLevelId").prop("disabled", arr_tempService.length > 0);
    $("#fatherFirstName").prop("disabled", arr_tempService.length > 0);
    $("#searchPatient").prop("disabled", arr_tempService.length > 0);
    $("#tempPatient").html(fillEmptyRow(17));
    displayCountRowModal(0, "searchPatientModal");

}

function appendServiceAdm(model) {

    if (model) {

        var emptyRow = $("#tempService").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempService").html("");
            $("#sumRowService").addClass("displaynone");
        }

        var healthClaimTitle = "";

        if (model.healthInsuranceClaim == 1)
            healthClaimTitle = `<div class="highlight-success">دارد</div>`;
        else if (model.healthInsuranceClaim == 2)
            healthClaimTitle = `<div class="highlight-danger">ندارد</div>`;
        else
            healthClaimTitle = `<div>بیمار خاص</div>`

        var output = `<tr id="s_${model.rowNumber}" onclick="setHighlightTr(${model.rowNumber})">
                          <td>${model.rowNumber}</td>
                          <td>${model.serviceName}</td>
                          <td>${model.qty}</td>
                          <td>${transformNumbers.toComma(model.basicServicePrice * model.qty)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicShareAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.compShareAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.thirdPartyAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.discountAmount)}</td>
                          <td class="money">${transformNumbers.toComma(model.netAmount)}</td>
                          <td >${healthClaimTitle}</td>
                          <td>
                              <button type="button" onclick="removeFromTempService(${model.rowNumber})" class="btn maroon_outline"  data-toggle="tooltip" data-placement="bottom" data-original-title="حذف">
                                   <i class="fa fa-trash"></i>
                              </button>
                          </td>
                      </tr>`;

        healthClaim = 1;
        $("#healthClaimTitle").html("استحقاق خدمت <span class=\"highlight-success\">دارد</span>");

        $(`#tempService`).append(output);
        let sumNetPriceVal = sumAdmissionLine()
        var sumNetPriceTxt = transformNumbers.toComma(sumNetPriceVal);

        //createServiceRequest(model, sumNetPriceVal);

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

function admissionCalPrice() {

    resetAdmCalPrice();

    if (+$("#serviceId").val() === 0)
        return;

    let medicalSubjectId = ""
    let referralTypeId = $("#referralTypeId").val()
    if (referralTypeId == 4)
        medicalSubjectId = medicalSubject.inPersonIPDTariff.id
    else
        medicalSubjectId = medicalSubject.inPersonTariff.id

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
        healthClaim,
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

            if (result.status < 0) {
                var msgItem = alertify.warning(result.statusMessage);
                msgItem.delay(alertify_delay);
            }

            calPriceModel = result;

            $("#basicServicePrice").val(transformNumbers.toComma(result.basicServiceAmount));
            $("#basicShareAmount").val(transformNumbers.toComma(result.basicShareAmount));
            $("#compShareAmount").val(transformNumbers.toComma(result.compShareAmount));
            $("#thirdPartyAmount").val(transformNumbers.toComma(result.thirdPartyAmount));
            $("#discountAmount").val(transformNumbers.toComma(result.discountAmount));
            $("#netAmount").val(transformNumbers.toComma(result.netAmount));

            changedStateCalPrice = false;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_calc_admissionprice);
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

function removeFromTempService(rowNo) {

    let admnId = $("#admnId").val()

    var resultOpenCash = checkOpenCashReimbursement(admnId);

    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق حذف خدمت امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }

    if (admnId > 0) {
        let serviceId = arr_tempService.find(x => x.rowNumber == rowNo).serviceId;
        deleteAdmissionLine(admnId, serviceId);
    }

    let netPriceRemoved = 0;
    for (var i = 0; i < arr_tempService.length; i++) {
        item = arr_tempService[i];
        if (item["rowNumber"] === rowNo) {
            netPriceRemoved = arr_tempService[i].netAmount;
            arr_tempService.splice(i, 1);
            $(`#s_${rowNo}`).remove();
            break;
        }
    }

    if (arr_tempService.length === 0) {
        $("#sumRowService").addClass("displaynone");
        $(".sumNetPrice").text("");
        $("#tempService").html(emptyRowHTML);
        $("#amount").val("");
        $("#discountPrice").val("");
    }
    else {

        var vSumNetPrice = sumAdmissionLine();

        $("#sumRowService").removeClass("displaynone");
        $(".sumNetPrice").text(transformNumbers.toComma(vSumNetPrice));

        rebuildRow(arr_tempService, "tempService");
    }

    //mainasServiceRequest(netPriceRemoved, vSumNetPrice);


    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);

    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0 || $("#hidonline").prop("checked"));
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);

    if (!isReimburesment) {

        $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);
        $("#reserveBox button").prop("disabled", arr_tempService.length > 0);

        if (+$("#referringDoctorId").val() !== 0) {
            $("#prescriptionDatePersian").prop("disabled", arr_tempService.length > 0);
        }
    }

    $("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);
    $("#nationalCode").prop("disabled", true);


    //$("#basicInsurerNo").prop("disabled", true);
    //$("#basicInsurerBookletPageNo").prop("disabled", true);
    //$("#basicInsurerExpirationDatePersian").prop("disabled", true)

    if (arr_tempService.length > 0) {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerBookletPageNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true)
    }
    else {
        //if (typeof getAdmissionInsurerInfoVar.data.basicInsurerId !== "undefined" && disabledInsurersByCode.includes(getAdmissionInsurerInfoVar.data.basicInsurerId)) {
        if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
            $("#basicInsurerNo").prop("disabled", arr_tempService.length);
            //$("#basicInsurerBookletPageNo").prop("disabled", arr_tempService.length);
            $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length)
        }
        else {
            $("#basicInsurerNo").prop("disabled", true);
            //$("#basicInsurerBookletPageNo").prop("disabled", true);
            $("#basicInsurerExpirationDatePersian").prop("disabled", true)
        }
    }

    $("#basicInsurerBookletPageNo").prop("disabled", (arr_tempService.length > 0 || disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) || +$("#admnId").val() != 0)

    $("#firstName").prop("disabled", true);
    $("#lastName").prop("disabled", true);
    //$("#genderId").prop("disabled", arr_tempService.length > 0);
    //$("#countryId").prop("disabled", arr_tempService.length > 0);
    //$("#mobile").prop("disabled", arr_tempService.length > 0);
    //$("#searchPatient").prop("disabled", arr_tempService.length > 0);
    //$("#searchPatient").prop("disabled", true);
    $("#tempPatient").html(fillEmptyRow(17));
    displayCountRowModal(0, "searchPatientModal");
    $("#serviceId").select2("focus");
}

function resetService() {
    $("#serviceForm input.form-control").val("");
    $("#serviceForm .select2").val("").trigger("change");
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

                //sumAdmLineServiceEdit += adsl.amountWithVat;

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
                //grossPrice: adsl.grossPrice,

                arr_tempService.push(modelServiceLine);
                appendServiceAdm(modelServiceLine);

            }
        }

}

function resetShabad() {
    $("#attenderHID").val("");
    $("#refferingHID").val("");
    $("#basicInsurerExpirationDatePersian").val("");
    $("#basicInsurerBookletPageNo").val("");
}

function eliminateHid() {
    //if (!isReimburesment) {

    var insurerId = "";

    if (+dropDownCacheData.basicInsurerLineTerminologyCode === 1) {
        insurerId = "1";
    }
    else if (+dropDownCacheData.basicInsurerLineTerminologyCode === 2)
        insurerId = "2";
    else
        insurerId = "37";

    var hidModel = {
        id: HIDIdentity,
        assignerCode: insurerId
    }

    var personModel = {
        nationalCode: $("#nationalCode").val(),
        IsForeign: +$("#referralTypeId") === 4 && $("#nationalCode").val().length === 12
    }

    var eliminateReasonName = $("#eliminateReasonId").select2('data').length > 0 ? $("#eliminateReasonId").select2('data')[0].text : ""

    var reasonValue = eliminateReasonName;
    var description = eliminateReasonName;

    var resultEliminate = eliminateHIDWS(hidModel, personModel, reasonValue, description);

    if (resultEliminate.successfull) {

        $("#hidonline").prop("checked", false).trigger("change");
        HIDIdentity = "";
        $("#attenderHID").val("");

        var eliminateAlert = alertify.success(`ابطال شناسه شباد ${HIDIdentity} ، با موفقیت انجام شد`);
        eliminateAlert.delay(6);
        $("#getAttenderHID").prop("disabled", false);
        $("#editSectionPatient").prop("disabled", false).focus();
        $("#editSectionShabad").prop("disabled", true);
        $("#eliminateReasonId").val(0).trigger('change');

        return;
    }
    else {

        if (resultEliminate.status == -104) {
            $("#attenderHID").val("");
            $("#hidonline").prop("checked", false).trigger("change");
            $("#getAttenderHID").prop("disabled", false);
            $("#editSectionPatient").prop("disabled", false).focus();
            $("#editSectionShabad").prop("disabled", true);
            $("#eliminateReasonId").val(0).trigger('change');

            HIDOnline = false;
            HIDIdentity = "";
        }

        var eliminateAlert = alertify.error(resultEliminate.statusMessage);
        eliminateAlert.delay(6);
        return;
    }

}

function modalClosePatientInsurance(modalName) {
    resetPatientInfo();
    modal_close(modalName);
}

async function appendRefferalIds(result) {
    var insurreDataOutput = "";
    if (result != null) {
        if (result.length > 0) {
            $("#tempReferralIdList").html("");
            for (var i in result) {
                var data = result[i];

                var nameAssigner = data.assigner.toLowerCase();
                if (nameAssigner == "tamin")
                    nameAssigner = "بیمه تامین اجتماعی";
                else if (nameAssigner == "bitsa")
                    nameAssigner = "آزاد";
                else
                    nameAssigner = "بیمه سلامت ";

                var nameType = data.type.toLowerCase();
                if (nameType == "tamin")
                    nameType = "بیمه تامین اجتماعی";
                else if (nameType == "bitsa")
                    nameType = "آزاد";
                else
                    nameType = "بیمه سلامت ";

                insurreDataOutput = `<tr tabindex="-1" id="rowRef_${+i + 1}" onkeydown="eventTrTable(${+i + 1},event,${result.length},'${data.id}')" onclick="eventReferralRow(${+i + 1})">
                          <td>${data.id}</td>
                          <td>${nameAssigner}</td>
                          <td>${nameType}</td>
                          <td><button type="button" onclick="fillAttenderHID('${data.id}')" class="btn btn-info">
                                <i class="fa fa-check"></i>
                            </button></td>                   
                     </tr>`

                $(insurreDataOutput).appendTo("#tempReferralIdList");
            }
        }
        else {
            $("#tempReferralIdList").html(fillEmptyRow(4));
        }
        return 1;
    }
}

function eventTrTable(row, e, countRow, id) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;

    $(`#tempReferralIdList tr`).removeClass("highlight");

    if (e.keyCode === KeyCode.ArrowUp)
        if (row > 1)
            $(`#rowRef_${row - 1}`).addClass("highlight").focus();
        else
            $(`#rowRef_${row}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (row < countRow)
            $(`#rowRef_${row + 1}`).focus().addClass("highlight");
        else
            $(`#rowRef_${row}`).focus().addClass("highlight");


    if (e.keyCode === KeyCode.Enter)
        fillAttenderHID(id);

}

function fillAttenderHID(id) {
    $("#refferingHID").val(id); modal_close("referralIdModel"); setTimeout(() => { $("#serviceId").select2("focus"); }, 10);
};

function eventReferralRow(row) {
    $(`#tempReferralIdList tr`).removeClass("highlight"); $(`#rowRef_${row}`).focus().addClass("highlight");
};

function loadingRefrallHID() {
    $("#getrefferingHID").html(`<i class="fas fa-cogs"></i>`);
}

$("#serviceId").on("focus", function () {
    $("#serviceId").select2("focus");
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

$("#qty").on({
    input: function () {
        changedStateCalPrice = true;
        var qty = +$(this).val();
        resetAdmCalPrice();
        if (qty > 200) {
            var qtyAlert = alertify.warning("حداکثر تعداد قابل قبول 200 عدد می باشد");
            qtyAlert.delay(admission.delay);
            return;
        }
    },
    blur: function () {
        let qty = +$(this).val();
        if (qty > 0 && qty <= 200 && changedStateCalPrice)
            admissionCalPrice();
    }
});

$("#healthInsuranceClaim").on("click", function () {

    if (healthClaim === 1) {
        $("#healthClaimTitle").html("استحقاق خدمت <span class=\"highlight-danger\">ندارد</span>");
        healthClaim = 2;
    }
    else {
        $("#healthClaimTitle").html("استحقاق خدمت <span class=\"highlight-success\">دارد</span>");
        healthClaim = 1;
    }

    admissionCalPrice();
});

$("#addService").on("click", function () {
    setTimeout(function () {
        addTempServiceAdm();
    }, 500);
});

$("#editSectionShabad").on("click", function () {
    // Eliminate Web service

    if (HIDIdentity !== "" && HIDOnline) {
        eliminateHid();
    }
    else {
        //if (!isReimburesment)
        $("#getAttenderHID").prop("disabled", false);
        $("#editSectionPatient").prop("disabled", false).focus();
        $("#editSectionShabad").prop("disabled", true);

        $("#basicInsurerBookletPageNo").prop("disabled", disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode))

        $("#eliminateReasonId").val(0).trigger('change');

    }
});

$("#basicInsurerExpirationDatePersian").on("blur", function () {
    if ($(this).val() !== "") {
        var model = {
            date1: $(this).val()
        };

        var resultCompareExp = compareTime(model);

        if (resultCompareExp === -1 || resultCompareExp === -2 || !isValidShamsiDate($(this).val())) {
            $("#parsley-expdate").removeClass("d-none");
            $(this).addClass("parsley-error");
            insurExpDateValid = false;
        }
        else {
            $("#parsley-expdate").addClass("d-none");
            $(this).removeClass("parsley-error");
            insurExpDateValid = true;
        }
    }
});

$("#getrefferingHID").on("click", function () {

    $(this).html(`<i class="fa fa-spinner fa-spin"></i>`);

    var nationalCode = $("#nationalCode").val();
    if (+nationalCode != 0) {
        var url = `${viewData_baseUrl_MC}/AdmissionReferApi/getactivereferralid`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(nationalCode),
            success: function (result) {
                if (+result.status == 100)
                    appendRefferalIds(result.data.referralIds)
                        .then((rowNo) => {

                            modal_show(`referralIdModel`);
                            return rowNo;
                        })
                        .then((rowNo) => {
                            $(`#rowRef_${rowNo}`).addClass("highlight").focus();
                            loadingRefrallHID();
                        });
                else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                    loadingRefrallHID();
                    return;
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
                loadingRefrallHID();
            }
        });
    }
    else {
        var msg = alertify.warning("نمبر تذکره را وارد کنید");
        msg.delay(alertify_delay);
        loadingRefrallHID();
        return;
    }
});

$("#eliminateReasonId").on("change", function () {
    $("#editSectionShabad").prop("disabled", (+$(this).val() == 0));
});

$("#getAttenderHID").on("click", function () {

    if (HIDIdentity !== "" && HIDOnline) {
        var msgHasHID = alertify.error("برای دریافت مجدد شناسه شباد ، نیاز به استعلام بیمه می باشد");
        msgHasHID.delay(alertify_delay);
        return;
    }

    getAttenderHID($(this));
});
///////////////////////////////////////////////////////////  END SERVICE  /////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////  START PAYMENTFORM  /////////////////////////////////////////////////////////////////
async function initPaymentForm(allInfo) {

    arr_tempCash = [];

    $("#detailAccountId").select2();
    $("#detailAccountId").prop("disabled", true);

    if (!isReimburesment)
        fillCashSummeryUser(0, "");
    else
        $("#CashSummeryUser").addClass("d-none");

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
        medicalRevenue: 1,
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

function calcSumPrice() {
    var row = $("#tempSelectedRequests").find("tr")[0];
    var sumNetPrice = 0;
    if ($(row).find(`#col_8_0`).text().includes("("))
        sumNetPrice += +$(row).find(`#col_8_0`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '') * -1;
    else
        sumNetPrice += +$(row).find(`#col_8_0`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '');

    $("#sumNetPrice").text(sumNetPrice >= 0 ? transformNumbers.toComma(sumNetPrice) : `(${transformNumbers.toComma(Math.abs(sumNetPrice))})`);
}

function buildAdmissionMasterInfo(request) {


    //onclick = "setHighlightTr(${index + 1},2)"
    //onkeydown = "setHighlightTrKeyDown(${index + 1},event,2,${index + 1})"

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

    //ردیف - شناسه - کدملی - نام خانواگی - جریان کار - مرحله - قابل دریافت پرداخت - عملیات
    requestStr += `
        <td id="col_${0}_${index}">${index + 1}</td>
        <td id="col_${1}_${index}" >${request.id}</td >
        <td id="col_${2}_${index}" data-patientid="${request.patientId}">${request.patientNationalCode}</td>
        <td id="col_${3}_${index}" >${request.patientId} - ${request.patientName}</td>
        <td id="col_${4}_${index}" data-workflowid="${request.workflowId}">${request.workflowId} - ${request.workflowName}</td>
        <td id="col_${5}_${index}" data-stageid="${request.stageId}">${request.stageId} - ${request.stageName}</td>
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

        setTimeout(() => {
            $("#tempCashDisplay tr#c_0").click()
        }, 50)
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

async function mainasServiceRequest(netPrice, sumServicePrice) {

    if (+netPrice !== 0) {
        //$("#inOut").trigger("change");
        //let sumTotalPrice = removeSep($("#sumNetPriceTotal").text());
        //let currentValue = parseInt(sumTotalPrice) - netPrice;
        //$("#sumNetPriceTotal").text(transformNumbers.toComma(currentValue));
        //admissionCashDetail.sumNetPriceTotal = currentValue
        //admissionMasterInfo.sumServiceAmount = sumServicePrice
        await newPayAmount();
        isSame_sum();
    }

}

async function createServiceRequest(model, sumServicePrice) {

    if (model) {
        //$("#inOut").trigger("change");
        //let sumTotalPrice = removeSep($("#sumNetPriceTotal").text());
        //let currentValue = parseInt(sumTotalPrice) + model.netAmount;
        //$("#sumNetPriceTotal").text(transformNumbers.toComma(currentValue));
        //admissionCashDetail.sumNetPriceTotal = currentValue
        //admissionMasterInfo.sumServiceAmount = sumServicePrice
        await newPayAmount();
        isSame_sum();
    }
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

async function calcSumRemain(admMasterId) {
    let admissionMasterRemainAmount = 0

    admissionMasterRemainAmount = await calcRemainAmount()

    return admissionMasterRemainAmount
}

function sumAdmissionLine() {
    var lastPayAmount = 0;
    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }
    return lastPayAmount;
}

function displayMasterRequest(admissionMasterId) {

    var check = controller_check_authorize("AdmissionMasterApi", "VIW");
    if (!check)
        return;

    $("#AdmissionMasterId").text("شناسه پرونده : ")
    $("#admissionList").removeClass("d-none")
    admissionMasterDisplay(admissionMasterId)
}

async function getAdmissionMaster(admissionMasterId) {

    let pageViewModel = {
        pageno: 0,
        pagerowscount: 1,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [0],
        workflowId: 0,
        stageId: 0,
        admissionMasterId: admissionMasterId,
        patientNationalCode: null,
        patientFullName: "",
        sortModel: {
            colId: "",
            sort: ""
        }
    }

    let url = `${viewData_baseUrl_MC}/AdmissionCashApi/admissioncashsearch`;


    let admissionMasterBalance = $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

    return admissionMasterBalance.responseJSON.data[0]
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
                        <th class="col-width-percent-8">کدملی</th>
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
///////////////////////////////////////////////////////////  END PAYMENTFORM  /////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////  END PRINT  /////////////////////////////////////////////////////////////////
function cashstandprint() {
    
    let row = $(`#admissionListForm tr.highlight`);
    let admissionId = $(row).data("admissionid")
    let medicalrevenue = $(row).data("medicalrevenue");

    standprint(admissionId, medicalrevenue)

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





/////////////////////////////////////////// ADMISSION Diagnosis Start ///////////////////////////////////////
$("#addDiagnosis").on("click", function () {

    let diagForm = $('#diagForm').parsley()
    let validate = diagForm.validate()

    validateSelect2(diagForm);
    if (!validate) return;

    var checkExist = false;
    var modelDiag = {};

    if (+$("#statusId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectStatusIdDiagnosis);
        msgNotDefined.delay(prMsg.delay);
        return;
    }
    if (typeSaveDiag == "INS") {

        checkExist = checkNotExistValueInArray(arr_TempDiagnosis, 'statusId', +$("#statusId").val());

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existStatusIdDiagnosis);
            msgExist.delay(prMsg.delay);
            $("#statusId").select2("focus");
            return;
        }
        var rowNumberDiag = arr_TempDiagnosis.length + 1;
        modelAppendDiagnosis(rowNumberDiag, typeSaveDiag)
    }
    else {
        var rowNumberDiag = currentDiagRowNumber;
        modelAppendDiagnosis(rowNumberDiag, typeSaveDiag)
    }
});

$("#canceledDiagnosis").on("click", function () {

    $("#diagBox .select2").val("").trigger("change");
    $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#diagBox input.form-control").val("");
    $("#statusId").select2("focus");

    typeSaveDiag = "INS";

});

function modelAppendDiagnosis(rowNumber, typeSave) {

    var modelDiag = {
        admissionId: 0,
        rowNumber: rowNumber,
        statusId: +$("#statusId").val(),
        statusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
        diagnosisResonId: +$("#diagnosisResonId").val(),
        diagnosisResonName: $("#diagnosisResonId").select2('data').length > 0 ? $("#diagnosisResonId").select2('data')[0].text : "",
        serverityId: +$("#serverityId").val(),
        serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
        comment: $("#comment").val()
    };

    if (typeSave == "INS")
        arr_TempDiagnosis.push(modelDiag);

    appendTempDiagnosis(modelDiag, typeSaveDiag);
    typeSaveDiag = "INS";
    setTimeout(() => {
        $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
    }, 500)

}

function appendTempDiagnosis(diag, tSave = "INS") {
    var diagOutput = "";

    if (diag) {
        if (tSave == "INS") {

            var emptyRow = $("#tempDiag").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDiag").html("");

            diagOutput = `<tr id="dg_${diag.rowNumber}">
                          <td>${diag.rowNumber}</td>
                          <td>${diag.statusId != 0 ? `${diag.statusName}` : ""}</td>
                          <td>${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}</td>
                          <td>${diag.serverityId != -1 ? `${diag.serverityName}` : ""}</td>
                          <td>${diag.comment}</td>
                          <td id="operationdg_${diag.rowNumber}">
                              <button type="button" id="deleteDiag_${diag.rowNumber}" onclick="removeFromTempDiag(${diag.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditDiag_${diag.rowNumber}" onclick="EditFromTempDiag(${diag.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(diagOutput).appendTo("#tempDiag");
        }
        else {
            var i = arr_TempDiagnosis.findIndex(x => x.rowNumber == diag.rowNumber);
            arr_TempDiagnosis[i].admissionId = diag.admissionId;
            arr_TempDiagnosis[i].rowNumber = diag.rowNumber;
            arr_TempDiagnosis[i].statusId = diag.statusId;
            arr_TempDiagnosis[i].statusName = diag.statusName;
            arr_TempDiagnosis[i].diagnosisResonId = diag.diagnosisResonId;
            arr_TempDiagnosis[i].diagnosisResonName = diag.diagnosisResonName;
            arr_TempDiagnosis[i].serverityId = diag.serverityId;
            arr_TempDiagnosis[i].serverityName = diag.serverityName;
            arr_TempDiagnosis[i].comment = diag.comment;

            $(`#dg_${diag.rowNumber} td:eq(0)`).text(`${diag.rowNumber}`);
            $(`#dg_${diag.rowNumber} td:eq(1)`).text(`${diag.statusId != 0 ? `${diag.statusName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(2)`).text(`${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(3)`).text(`${diag.serverityId != 0 ? `${diag.serverityName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(4)`).text(`${diag.comment}`);
        }
    }
    resetDiagnosis();
}

function EditFromTempDiag(rowNumber) {

    $("#statusId").select2("focus");

    $("#tempDiag tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");
    var arr_TempDiagAppend = "";
    var arr_TempDiagE = arr_TempDiagnosis.filter(line => line.rowNumber === rowNumber)[0];

    $("#statusId").val(arr_TempDiagE.statusId).trigger('change');

    $("#diagnosisResonId").val(arr_TempDiagE.diagnosisResonId);
    arr_TempDiagAppend = new Option(`${arr_TempDiagE.diagnosisResonName}`, arr_TempDiagE.diagnosisResonId, true, true);
    $("#diagnosisResonId").append(arr_TempDiagAppend).trigger('change');
    arr_TempDiagAppend = "";

    $("#serverityId").val(arr_TempDiagE.serverityId).trigger('change');

    $("#comment").val(arr_TempDiagE.comment);

    typeSaveDiag = "UPD";
    currentDiagRowNumber = arr_TempDiagE.rowNumber;
}

function removeFromTempDiag(rowNumber) {

    currentDiagRowNumber = rowNumber;
    $("#tempDiag tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDiagnosis, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dg_${rowNumber}`).remove();

    if (arr_TempDiagnosis.length == 0) {
        var colspan = $("#tempdiagnosisList thead th").length;
        $("#tempDiag").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDaigRow();
    $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
}

function rebuildDaigRow() {
    var arrDiag = arr_TempDiagnosis;
    var table = "tempDiag";

    if (arrDiag.length === 0)
        return;

    for (var l = 0; l < arrDiag.length; l++) {
        arrDiag[l].rowNumber = l + 1;
        $(`#${table} tr`)[l].children[0].innerText = arrDiag[l].rowNumber;
        $(`#${table} tr`)[l].setAttribute("id", `dg_${arrDiag[l].rowNumber}`);
        $(`#${table} tr`)[l].children[0].innerText = arrDiag[l].rowNumber;

        if ($(`#${table} tr`)[l].children[5].innerHTML !== "") {

            $(`#${table} tr`)[l].children[5].innerHTML = `<button type="button" onclick="removeFromTempDiag(${arrDiag[l].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempDiag(${arrDiag[l].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>`;
        }
    }

    arr_TempDiagnosis = arrDiag;
}

function resetDiagnosis() {
    $("#diagBox .select2:not(#reasonForEncounterId)").val("").trigger("change");
    $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#diagBox input.form-control").val("");
    $("#statusId").select2("focus");
    typeSaveDiag = "INS";
}

function fillDiagnosis(data) {
    if (data != null) {
        $("#tempDiag").html("");
        var LineLength = data.length;
        for (var dld = 0; dld < LineLength; dld++) {
            var datadb = data[dld];
            var model = {
                admissionId: datadb.admissionId,
                rowNumber: datadb.rowNumber,
                statusId: datadb.statusId,
                statusName: datadb.statusId + " - " + datadb.statusName,
                diagnosisResonId: datadb.diagnosisReasonId,
                diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                serverityId: datadb.serverityId,
                serverityName: datadb.serverityId + " - " + datadb.serverityName,
                comment: datadb.comment,
            };

            arr_TempDiagnosis.push(model);
            appendTempDiagnosis(model);
            model = {};
        }
        rebuildDaigRow()
        $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
    }
};

function getAttenderInfo(attenderId) {

    let viewData_get_attenderMSC = `${viewData_baseUrl_MC}/AttenderApi/getattendermsc`;

    $.ajax({
        url: viewData_get_attenderMSC,
        type: "post",
        dataType: "json",
        cache: false,
        async: false,
        contentType: "application/json",
        data: JSON.stringify(attenderId),
        success: function (result) {

            if (result !== null) {
                attenderMsc = result.name;
                attenderMscTypeId = result.id;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_attenderMSC);
        }
    });
}
/////////////////////////////////////////////// ADMISSION Diagnosis END ///////////////////////////////////////////



initAdmissionForm(getAdmission, +$("#admnId").val())
    .then(id => {
        if ($(`#${id}`).hasClass("select2"))
            $(`#${id}`).select2("focus");
        else
            $(`#${id}`).focus();

        firstTimeResetShabad = true;
    });



/////////////////////////////////////////////////VALIDATE FORM/////////////////////////////////////////////
window.Parsley._validatorRegistry.validators.cheklengthlinestep = undefined;
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

window.Parsley._validatorRegistry.validators.nationalcodeadmission = undefined;
window.Parsley.addValidator('nationalcodeadmission', {
    validateString: function (value) {

        if (+$("#referralTypeId").val() === 5 || +$("#referralTypeId").val() === 4 || +$("#referralTypeId").val() === 6)
            return true;

        return isValidIranianNationalCode(value);
    },
    messages: {
        en: 'فرمت نمبر تذکره صحیح نیست .',
    }
});

window.Parsley._validatorRegistry.validators.greatthentodey = undefined;
window.Parsley.addValidator('greatthentodey', {
    validateString: function (value, todey) {
        if (!isReimburesment)
            return compareShamsiDate(todey, value);

        return true;
    },
    messages: {
        en: 'تاریخ انقضا باید از تاریخ امروز بزرگتر باشد.',
    }
});

window.Parsley._validatorRegistry.validators.rqinsur = undefined
window.Parsley.addValidator("rqinsur", {
    validateString: function (value) {
        if (+value !== 8036 && +value !== 8001 && +value !== 8000) {
            if ($.trim($("#basicInsurerNo").val()) === "") {
                $("#basicInsurerNo").focus();
                return false;
            }
            else if ($.trim($("#basicInsurerExpirationDatePersian").val()) === "") {
                $("#basicInsurerExpirationDatePersian").focus();
                return false;
            }
        }

        return true;
    },
    messages: {
        en: 'سایر اطلاعات بیمه را وارد نمایید'
    }
});
/////////////////////////////////////////////////VALIDATE FORM/////////////////////////////////////////////





///////////////////////////////////////////////// START NOT USED//////////////////////////////////////////////////////
function getAdmissionInsurerInfo(admissionId) {
    let url = `${viewData_baseUrl_MC}/AdmissionServiceReimbursmentApi/getadmissioninsurerinfo`;
    var output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(admissionId),
        success: function (result) {
            getAdmissionInsurerInfoVar = result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return output.responseJSON;
}

function printAdmission(printname) {

    printUrl = `/Stimuls/MC/${printname}`;
    modal_close("printAdmissionModal");
}
/////////////////////////////////////////////////END NOT USED//////////////////////////////////////////////////////

