var form = $('#patientForm').parsley(),
    arr_tempService = [],
    viewData_modal_title = "پذیرش",
    viewData_controllername = "AdmissionApi",
    adm_Identity = 0,
    adm_admissionMasterId = 0,
    adm_actionId = 0,
    admissionMasterActionId = 0,
    medicalTimeShiftId = null,
    stageAndWorkflow = {},
    calPriceModel = {},
    insurExpDateValid = true,
    prescriptionDateValid = true,
    attenderScheduleValid = false,
    printUrl = "",
    typeSaveDiag = "INS",
    arr_TempDiagnosis = [],
    currentDiagRowNumber = 0,
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: adm_Identity, sqlDbType: 8, size: 0 },
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    healthClaim = 1,
    basicInsurer = {},
    basicInsurerId = 0,
    insurancesList = [],
    patientInsurer = null,
    getlastdayofyear = getLastDayOfYear(),
    disabledInsurers = [1, 2, 37],
    attenderMsc = "0",
    attenderMscTypeId = 0,
    inqueryID = 0,
    referringDoctorInfo = null,
    firstTimeResetShabad = false,
    HIDIdentity = "",
    HIDOnline = false,
    isActivePatient = true,
    userInfoLogin = {},
    admissionReserveDateTimePersian = "",
    monthId = 0,
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
    changedStateCalPrice = false;


async function initAdmissionForm(callback, admId) {

    userInfoLogin = await getCashIdByUserId()

    $("input").attr("autocomplete", "off");
    $(".select2").select2();
    $('#userTypeOnOff').bootstrapToggle();
    $("#getPersobByBirthWS").prop('disabled', true);
    $("#getPatientInfoWS").prop('disabled', true);
    $("#basicInsurerNo").val("").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    inputMask();

    loadSelectDependent();

    $("#genderId").prop("selectedIndex", 0).trigger("change")


    if (userInfoLogin.counterTypeId != 3)
        $("#saveFormAndPrint").css("display", "none")

    if (admId !== 0 && !isNaN(admId))
        callback();
}

async function loadSelectDependent() {

    $(`#attenderId,#referringDoctorId,#referralTypeId,#countryId,#eliminateReasonId,#educationLevelId
     ,#statusId,#diagnosisResonId,#reasonForEncounterId,#serverityId,#searchPatientCompInsurerThirdPartyId,
      #compInsurerThirdPartyId,#discountInsurerId,#searchPatientBasicInsurerLineId,#searchPatientDiscountInsurerId`).empty()

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

    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`, "attenderId", true, userInfoLogin.branchId, false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ReferringDoctorApi/getdropdown`, "referringDoctorId", true, 1, true, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2("/api/AdmissionsApi/patientrefferaltype_getdropdown", "referralTypeId", true, 0, false, 3, "انتخاب", function () {
        $("#referralTypeId").val($("select#referralTypeId option:first").val()).trigger("change");
    }, "", false, true, false, false);
    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false, 3, "انتخاب کنید", function () { $("#countryId").val(101).trigger("change") });
    fill_select2("/api/AdmissionsApi/eliminatehidreason_getdropdown", "eliminateReasonId", false, "adm", false, 3, "انتخاب", undefined, "", false, true, false, false);
    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`, "statusId", true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`, "diagnosisResonId", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/reasonforencounterid`, "reasonForEncounterId", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/serverityid`, "serverityId", true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", false, `${dropDownCache.discount}/0`);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientDiscountInsurerId", false, `${dropDownCache.discount}/0`);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');

}

function isEditMode() {
    if ($("#admnId").val() == "")
        return false;
    else
        return true;
}

function getAdmission() {

    let admissionId = +$("#admnId").val();
    let viewData_get_admission = `${viewData_baseUrl_MC}/${viewData_controllername}/display`;

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

    adm_actionId = ad.actionId;
    admissionMasterActionId = ad.admissionMasterActionId;
    //adm Section 
    $("#admnId").val(ad.id);
    $("#dateTime").val(ad.createDateTimePersian);
    $("#userFullName").val(`${ad.createUserId} - ${ad.createUserFullName}`);
    $("#stageName").val(`${ad.stageId} - ${ad.stageName}`);
    $("#workflowName").val(`${ad.workflowId} - ${ad.workflowName}`);
    $("#admBox").removeClass("d-none");

    arr_tempService = [];
    arr_tempCash = [];

    $("#attenderId").val(ad.attenderId).prop("disabled", true).trigger("change");
    $("#userTypeOnOff").prop("disabled", true)

    if (ad.referringDoctorId !== 0) {
        var refDoctorOption = new Option(`${ad.referringDoctorId} - ${ad.referringDoctorName} - ${ad.referringDoctorMsc}`, ad.referringDoctorId, true, true);
        $("#referringDoctorId").append(refDoctorOption).trigger('change');
    }

    admissionReserveDateTimePersian = `${ad.reserveTime} ${ad.reserveDatePersian}`;

    $("#referringDoctorId").prop("disabled", true);
    $("#prescriptionDate").val(ad.prescriptionDatePersian).prop("disabled", true);
    fillReserveShift([{
        id: ad.reserveShiftId,
        text: `${ad.reserveShiftId} - ${ad.reserveShiftName}`
    }])
    //$("#reserveShift").val(ad.reserveShiftId);
    $("#reserveNo").val(ad.reserveNo);
    $("#reserveDate").val(admissionReserveDateTimePersian);
    $("#scheduleBlockId").val(ad.attenderScheduleBlockId)
    $("#referralTypeId").val(ad.referralTypeId).trigger("change").prop("disabled", true);
    $("#patientId").val(ad.patientId);
    $("#admissionMasterId").val(ad.admissionMasterId);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);

    dropDownCacheData.basicInsurerLineId = ad.basicInsurerLineId
    dropDownCacheData.basicInsurerLineName = ad.basicInsurerLineName

    if (ad.basicInsurerLineId === "")
        $("#basicInsurerLineId").val("1-73").trigger("change");
    else
        $("#basicInsurerLineId").val(`1-${ad.basicInsurerLineId}`).trigger("change").prop("disabled", true);

    $("#basicInsurerLineId").prop("disabled", true);
    $("#basicInsurerNo").val(ad.basicInsurerNo).prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").val(ad.basicInsurerExpirationDatePersian).prop("disabled", true);

    if (ad.reasonForEncounterId !== 0) {
        let tempReasonEncounterAppend = null;
        $("#reasonForEncounterId").val(ad.reasonForEncounterId);
        tempReasonEncounterAppend = new Option(`${ad.reasonForEncounterId} - ${ad.reasonForEncounterName} - ${ad.reasonForEncounterCode}`, ad.reasonForEncounterId, true, true);
        $("#reasonForEncounterId").append(tempReasonEncounterAppend).trigger('change');
    }


    $("#firstName").val(ad.firstName).prop("disabled", true);
    $("#lastName").val(ad.lastName).prop("disabled", true);
    $("#birthDatePersian").val(ad.birthDatePersian).prop("disabled", true);

    $("#genderId").val(ad.genderId).trigger("change")
    $("#countryId").val(ad.countryId).trigger("change")
    $("#mobile").val(ad.mobileNo)
    $("#address").val(ad.address)
    $("#description").val(ad.description)
    $("#idCardNumber").val(ad.idCardNumber)
    $("#postalCode").val(ad.postalCode)
    $("#jobTitle").val(ad.jobTitle)
    $("#phoneNo").val(ad.phoneNo)
    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change")
    $("#educationLevelId").val(ad.educationLevelId).trigger("change")
    $("#fatherFirstName").val(ad.patientFatherFirstName)

    if (ad.discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${ad.discountInsurerId}`).trigger("change");
    else
        $("#discountInsurerId").val(0).trigger("change");

    if (ad.compInsurerLineId != 0)
        $("#compInsurerThirdPartyId").val(`2-${ad.compInsurerLineId}-${ad.compInsurerId}`).prop("disabled", true).trigger("change");
    else if (ad.thirdPartyInsurerId != 0)
        $("#compInsurerThirdPartyId").val(`4-${ad.thirdPartyInsurerId}`).prop("disabled", true).trigger("change");
    else
        $("#compInsurerThirdPartyId").val(0).prop("disabled", true).trigger("change");

    if (checkResponse(ad.responsibleNationalCode))
        patientInsurer.responsibleNationalCode = ad.responsibleNationalCode

    if (checkResponse(ad.relationType))
        patientInsurer.relationType = ad.relationType

    if (checkResponse(ad.covered))
        patientInsurer.covered = ad.covered

    if (checkResponse(ad.recommendationMessage))
        patientInsurer.recommendationMessage = ad.recommendationMessage


    // SHABAD Section
    $("#basicInsurerBookletPageNo").val(ad.basicInsurerBookletPageNo).prop("disabled", true)
    $("#attenderHID").val(ad.hid);
    HIDIdentity = ad.hid;

    inqueryID = ad.inqueryID;
    HIDOnline = ad.hidOnline;
    $("#hidonline").prop("checked", ad.hidOnline).trigger("change");
    $("#refferingHID").val(ad.referredHID == null ? "" : ad.referredHID);

    $("#editSectionShabad").prop("disabled", HIDOnline);
    $("#eliminateReasonId").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", true);
    $("#getAttenderHID").prop("disabled", true);

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
                    healthInsuranceClaim: adsl.healthInsuranceClaim,
                    grossPrice: adsl.grossPrice,

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

    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#referralTypeId").prop("disabled", arr_tempService.length > 0);

    //if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode))
    //    $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
    //else
    //    $("#basicInsurerNo").prop("disabled", true);

    //$("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0)
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0)
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#editSectionPatient").prop("disabled", true);
    $("#searchPatient").prop("disabled", true)

    if (checkResponse(ad.admissionDiagnosisList))
        if (ad.admissionDiagnosisList.length !== 0)
            $(".diagnosis-filed").prop("disabled", true);

    fillDiagnosis(ad.admissionDiagnosisList);
    setTimeout(() => $("#serviceId").select2("focus"), 50);


    //fillShiftdetails();
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
        var sumNetPriceTxt = transformNumbers.toComma(sumAdmissionLine());

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

function sumAdmissionLine() {

    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
}

async function setPatientInfo(id, referralTypeId, basicInsurerLineId,
    nationalCode, basicInsurerNo, basicInsurerExpirationDatePersian, firstName, lastName, birthDatePersian, genderId, countryId,
    compInsurerLineId, compInsurerId, thirdPartyInsurerId, mobileNo, address, description, idCardNumber, postalCode, jobTitle, phoneNo, maritalStatusId, fatherFirstName, educationLevelId, discountInsurerId) {

    /*patientId = id;*/
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
    $("#idCardNumber").val(idCardNumber);
    $("#postalCode").val(postalCode);
    $("#jobTitle").val(jobTitle);
    $("#phoneNo").val(phoneNo);
    $("#maritalStatusId").val(maritalStatusId).trigger("change");
    $("#educationLevelId").val(educationLevelId).trigger("change");
    $("#fatherFirstName").val(fatherFirstName);
    $("#address").val(address);
    $("#description").val(description)
    modal_close("searchPatientModal");
}

function expandAdmission(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        //$(".slideToggle:not(.current)").slideUp().removeClass("open");
        //$(".slideToggle:not(.current)").siblings(".btn").html("<i class='fas fa-plus'></i>");

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

async function setPatientInsurerInfo(basicInsurerLineId, basicInsurerNo, basicInsurerExpirationDatePersian, compInsurerLineId, compInsurerId, thirdPartyInsurerId, discountInsurerId) {

    if (+$("#referralTypeId").val() == 2) {
        modal_close("searchPatientInsurerModal");
        getShabadPatientInsurer(() => {
            $("#basicInsurerExpirationDatePersian").val("");
            $("#basicInsurerNo").val("");
        });
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

    getShabadPatientInsurer(() => {
        $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian == null ? "" : basicInsurerExpirationDatePersian);
        $("#basicInsurerNo").val(basicInsurerNo == null ? "" : basicInsurerNo);
    });

}

function searchPatient() {
    $("#tempPatient").html(fillEmptyRow(18));
    displayCountRowModal(0, "searchPatientModal");
    modal_show("searchPatientModal");
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

    let viewData_calc_admissionprice = `${viewData_baseUrl_MC}/${viewData_controllername}/calculateadmissionPrice`;

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
};

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
        $("#tempService").html(emptyRowHTML);
    }
    else {

        var vSumNetPrice = sumAdmissionLine();

        $("#sumRowService").removeClass("displaynone");
        $(".sumNetPrice").text(transformNumbers.toComma(vSumNetPrice));

        rebuildRow(arr_tempService, "tempService");
    }

    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    $("#attenderId").prop("disabled", arr_tempService.length > 0)

    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0 || $("#hidonline").prop("checked"));
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);

    $("#basicInsurerBookletPageNo").prop("disabled", (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) || +$("#admnId").val() != 0)

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    }

    if (+$("#referringDoctorId").val() !== 0) {
        $("#prescriptionDate").prop("disabled", arr_tempService.length > 0);
    }

    $("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);
    $("#searchPatient").prop("disabled", true)
    $("#serviceId").select2("focus");

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

function resetService() {
    $("#serviceForm input.form-control").val("");
    $("#serviceForm .select2").val("").trigger("change");
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

    if ($("#saveForm").attr("disabled") === "disabled" || $("#saveFormAndPrint").attr("disabled") === "disabled")
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
        if (+$("#reserveNo").val() === 0 || $("#reserveDate").val() === "" || $("#scheduleBlockId").val() == "") {
            msg_s = alertify.warning(admission.defineAdmission);
            msg_s.delay(admission.delay);
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
        var msg_temp_srv = alertify.error(admission.notHasService);
        msg_temp_srv.delay(admission.delay);
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

    if (!insurExpDateValid) {
        msg_s = alertify.warning(admission.insurExpDateNotValid);
        msg_s.delay(admission.delay);
        $("#basicInsurerExpirationDatePersian").focus();
        return;
    }

    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد امکان ذخیره وجود ندارد..");
        msg_s.delay(admission.delay);
        return;
    }

    $("#patientForm").attr("disabled", "disabled");
    $("#serviceForm").attr("disabled", "disabled");

    $(".select2").attr("disabled", "disabled");
    $("#saveForm").attr("disabled", "disabled");
    $("#saveFormAndPrint").attr("disabled", "disabled");

    let medicalSubjectId = ""
    let referralTypeId = +$("#referralTypeId").val()

    if (referralTypeId == 4)
        medicalSubjectId = medicalSubject.inPersonIPDTariff.id
    else
        medicalSubjectId = medicalSubject.inPersonTariff.id


    var nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    var mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();

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
        description: $("#description").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
        educationLevelId: +$("#educationLevelId").val()
    };

    let admissionExtraPropertyList = buildAdmissionExtraPropertyList()
    let workflowId = 151,
        stageId = admissionStage.admissionService.id;


    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];


    var model_adm = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admissionMasterId").val(),
        admissionMasterWorkflowId: workflowId,
        admissionMasterStageId: admissionStage.admissionMasterOutPatient.id,
        stageId,
        actionId: +$("#admnId").val() > 0 ? adm_actionId : 0,
        admissionMasterActionId: +$("#admissionMasterId").val() > 0 ? admissionMasterActionId : 0,
        workflowId: workflowId,
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
        reserveDatePersian: reserveDatePersian,
        reserveTime: reserveTime,
        reserveShiftId: $("#reserveShift").val(),
        reserveNo: $("#reserveNo").val(),
        attenderScheduleBlockId: $("#scheduleBlockId").val(),
        referringDoctorId: +$("#referringDoctorId").val(),
        medicalSubjectId,
        admissionPatient: model_patient,
        admissionLineServiceList: arr_tempService,
        admissionDiagnosisList: arr_TempDiagnosis,
        admissionExtraPropertyList: admissionExtraPropertyList.length == 0 ? null : admissionExtraPropertyList,
    }

    let viewData_save_admission = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;

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
                $("#patientForm").prop("disabled", false);
                $("#serviceForm").prop("disabled", false);
                $("#serviceId").prop("disabled", false);

                if (result.validationErrors !== null) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
            }
            else if (result.data.status === 100) {
                var messageSuccessAlert = alertify.success(result.data.statusMessage);
                messageSuccessAlert.delay(admission.delay);
                adm_Identity = result.data.id;
                adm_admissionMasterId = result.data.admissionMasterId;
                stageAndWorkflow = { workflowId, stageId }
                if (!isEditMode()) {
                    if (userInfoLogin.counterTypeId === 3) {
                        if (sumAdmissionLine() > 0) {
                            if (saveOrPrint == "saveForm") {

                                navigation_item_click(`${viewData_addTreasury_page_url}/${result.data.admissionMasterId}/2`, viewData_addTreasury_form_title);
                            } else if (saveOrPrint == "saveFormAndPrint") {
                                printForm(workflowId, stageId);
                            }
                            return;
                        }
                        else {
                            if (saveOrPrint == "saveForm")
                                navigation_item_click("/MC/Admission", viewData_modal_title);
                            else if (saveOrPrint == "saveFormAndPrint")
                                printForm(workflowId, stageId);
                        }
                    }
                    else if (userInfoLogin.counterTypeId === 1) {
                        if (saveOrPrint == "saveForm")
                            navigation_item_click("/MC/Admission", viewData_modal_title);
                        else if (saveOrPrint == "saveFormAndPrint")
                            printForm(workflowId, stageId);
                    }
                }
                else {
                    if (saveOrPrint == "saveForm")
                        navigation_item_click("/MC/Admission", viewData_modal_title);
                    else if (saveOrPrint == "saveFormAndPrint")
                        printForm(workflowId, stageId);
                }
            }
            else if (result.data.status === -1 || result.data.status === -102) {
                var msg_status_1 = alertify.error(result.data.statusMessage);
                msg_status_1.delay(admission.delay);
            }
            else {
                var msg = alertify.error(admission.insert_error);
                msg.delay(admission.delay);
                generateErrorValidation(result.validationErrors);
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_admission);
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
    if ($("#prescriptionDate").val() != "") {

        let prescriptionDateShmasi = $("#prescriptionDate").val()
        let prescriptionDateMiladi = moment.from(prescriptionDateShmasi, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');

        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.prescriptionDate,
            elementValue: prescriptionDateMiladi
        })
    }

    return admissionExtraPropertyList

}

function printForm(workflowId, stageId) {

    if (printUrl === "" || !printUrl.includes(".mrt")) {
        modal_show("printAdmissionModal");
    }
    else {
        adm_print(adm_Identity, adm_admissionMasterId, printUrl, workflowId, stageId);
        navigation_item_click("/MC/Admission", viewData_modal_title);
    }

    return;
}

function resetAdmission() {

    form = $('#patientForm').parsley();
    form.reset();
    //----------------------------

    $(`#temptimeShiftDays`).html("");

    // ----------------------------

    $("#admBox").addClass("d-none");
    $("#admnId").val("");
    $("#dateTime").val("");
    $("#userFullName").val("");
    // ----------------------------

    if (!$("#expandAdmissionBtn i").hasClass("fa-plus"))
        $("#expandAdmissionBtn").click();
    if (!$("#expandAdmissionBtnDiag i").hasClass("fa-plus"))
        $("#expandAdmissionBtnDiag").click();

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
    $("#patientForm .form-control:not(#patientId,#workshopName,#birthDatePersian)").removeAttr("disabled");
    $("#serviceForm").removeAttr("disabled");
    $("#cashForm").removeAttr("disabled");

    loadSelectDependent();
    //$("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");

    $("#hidonline").prop("checked", false).trigger("change");
    $("#getAttenderHID").prop("disabled", false);

    if ($('#userTypeOnOff').prop("checked")) {
        $("#getPatientInfoWS").prop("disabled", true);
        $("#getPersobByBirthWS").prop("disabled", true);
    } else {
        $("#getPatientInfoWS").prop("disabled", false);
        $("#getPersobByBirthWS").prop("disabled", false);
    }

    $("#userTypeOnOff").removeAttr("disabled")
    $("#searchPatient").removeAttr("disabled")
    $("#attenderId").focus();
    $("#admissionMasterId").val("").prop("disabled", true)
    insurancesList = [];
    patientInsurer = null;
    attenderMsc = "0";
    attenderMscTypeId = 0;
    inqueryID = 0;
    referringDoctorInfo = null;
    HIDIdentity = "0";
    HID = "0";
    HIDOnline = false;
    arr_tempService = [];
    adm_Identity = 0;
    adm_admissionMasterId = 0;
    stageAndWorkflow = {}
    calPriceModel = {};
    insurExpDateValid = true;
    prescriptionDateValid = true;
    attenderScheduleValid = false;
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

function adm_print(admId, admissionMasterId, printurl, workflowId, stageId) {

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

function resetAdmCalPrice() {

    $("#basicServicePrice").val("");
    $("#basicShareAmount").val("")
    $("#compShareAmount").val("")
    $("#thirdPartyAmount").val("")
    $("#discountAmount").val("")
    $("#netAmount").val("")

    calPriceModel = {};
}

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

function printAdmission(printname) {

    printUrl = `/Stimuls/MC/${printname}`;
    modal_close("printAdmissionModal");
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
            $("#nationalCode").attr("maxlength", "15");
    }
    else if (referralTypeId === 2)
        $("#nationalCode").attr("maxlength", "15");
    else
        $("#nationalCode").attr("maxlength", "13");
}

async function getShabadPatientInsurer(callBack = undefined) {

    resetShabadElements();
    if (+dropDownCacheData.basicInsurerLineTerminologyCode == 1 || +dropDownCacheData.basicInsurerLineTerminologyCode == 2) {

        await $("#getAttenderHID").click();
        $("#serviceId").select2("focus");
    }
    if (+dropDownCacheData.basicInsurerLineTerminologyCode != 1 && +dropDownCacheData.basicInsurerLineTerminologyCode != 2) {
        $("#basicInsurerBookletPageNo").focus();
    }

    if (typeof callBack !== "undefined")
        callBack();
}

function eliminateHid() {

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
        if (attenderId === 0)
            return;

        let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime();

        let attenderTimeShiftList = await getAttenderTimeShiftList(attenderId, userInfoLogin.branchId, currentDate, currentTime, false)

        medicalTimeShiftId = attenderTimeShiftList.length > 0 ? attenderTimeShiftList[0].id : null;
        fillReserveShift(attenderTimeShiftList);


        if (!checkResponse(attenderTimeShiftList) || attenderTimeShiftList.length == 0) {
            var msg = alertify.warning(" این داکتر  برای روز جاری نوبت ندارد");
            msg.delay(admission.delay);
            $(`#temptimeShiftDays`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
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
            $("#scheduleBlockId").val("");
            $("#attenderId").select2("focus");
        }
        else {
            var msg = alertify.warning(reserve['statusMessage']);
            msg.delay(admission.delay);

            setTimeout(function () {
                $("#referralTypeId").select2("focus");
            }, 1);

        }

        var currentPersianDate = moment(currentDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
        monthId = currentPersianDate.split("/")[1];
        getTimeShiftDays(attenderId, medicalTimeShiftId);
    }
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
                     <td  colspan="5"style="text-align:center" >سطری یافت نشد</td>
                   </tr>`;


    }


    $(`#temptimeShiftDays`).html(output);

}

function addTempServiceAdm() {
    var msg_s = alertify;

    var serviceIdIndex = arr_tempService.findIndex(s => s.serviceId === +$("#serviceId").val());

    var referralTypeId = $("#referralTypeId").val();

    if (+referralTypeId == 5)
        referralTypeId == "1";

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

    if (+$("#referringDoctorId").val() !== 0) {
        if ($("#prescriptionDate").val() !== "") {

            if (!isValidShamsiDate($("#prescriptionDate").val())) {
                $("#prescriptionDate").focus();
                msg_s = alertify.warning("تاریخ نسخه معتبر نمی باشد");
                msg_s.delay(admission.delay);
                return;
            }
            else {
                var modelCheckDate = {
                    date1: $("#prescriptionDate").val()
                };

                var resultComparePris = compareTime(modelCheckDate);

                if (resultComparePris === 1 || resultComparePris === -2) {
                    msg_s = alertify.warning(admission.priscriptionDateNotValid);
                    msg_s.delay(admission.delay);
                    $("#prescriptionDate").focus();
                    prescriptionDateValid = false;
                    return;
                }
                else {
                    prescriptionDateValid = true;
                }
            }
        }
        else {
            $("#prescriptionDate").focus();
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

    if (!prescriptionDateValid) {
        msg_s = alertify.warning(admission.priscriptionDateNotValid);
        msg_s.delay(admission.delay);
        $("#prescriptionDate").focus();
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

    if (calPriceModel == undefined || calPriceModel.netAmount < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        return;
    }


    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد، امکان افزودن خدمت ندارد.");
        msg_s.delay(admission.delay);
        return;
    }


    if (calPriceModel.basicServicePrice == 0 && calPriceModel.basicPrice == 0 && calPriceModel.basicShareAmount == 0 &&
        calPriceModel.compShareAmount == 0 &&
        calPriceModel.netAmount == 0) {

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
        penaltyId: null,
        penaltyAmount: 0
    };

    arr_tempService.push(model);
    appendServiceAdm(model);
    resetService();

    $("#userTypeOnOff").prop("disabled", true)
    $("#serviceId").select2("focus");
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
    $("#referralTypeId").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0);
    $("#editSectionShabad").prop("disabled", arr_tempService.length > 0);
    $("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0);
    $("#prescriptionDate").prop("disabled", arr_tempService.length > 0);
    $("#attenderId").prop("disabled", arr_tempService.length > 0);
    $("#reserveBox button").prop("disabled", arr_tempService.length > 0);

    if (+$("#admnId").val() == 0) {
        $("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
    }
    else
        $("#editSectionPatient").prop("disabled", true)


    $("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);
    $("#nationalCode").prop("disabled", arr_tempService.length > 0);
    $("#getPatientInfoWS").prop("disabled", arr_tempService.length > 0);
    $("#getPersobByBirthWS").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);


    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    }

    $("#firstName").prop("disabled", arr_tempService.length > 0);
    $("#lastName").prop("disabled", arr_tempService.length > 0);

    $("#searchPatient").prop("disabled", true)
    //$("#basicInsurerBookletPageNo").prop("disabled", true)
    $("#tempPatient").html(fillEmptyRow(17));

    displayCountRowModal(0, "searchPatientModal");

}

function getPatientInsurer() {

    if ($("#userTypeOnOff").prop("checked")) {

        if (+$("#patientId").val() == 0) {
            $("#tempPatientI").html(fillEmptyRow(8));
            displayCountRowModal(len, "searchPatientInsurerModal");
            return;
        }

        let patientId = +$("#patientId").val()

        patientInsurerSearch(patientId);
    }
}

function resetPatientInfo(opr) {
    $("#referralTypeId").prop("disabled", false)
    $("#attenderId").prop("disabled", false);
    $("#userTypeOnOff").prop("disabled", false)
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0).select2("focus");
    $("#compInsurerThirdPartyId").prop("disabled", false)
    $("#discountInsurerId").prop("disabled", false)

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0);
        $("#basicInsurerExpirationDatePersian").prop("disabled", false);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    }

    if (+$("#referralTypeId").val() !== 2)
        $("#nationalCode").prop("disabled", false);

    $("#referringDoctorId").prop("disabled", false);
    $("#firstName").prop("disabled", false);
    $("#lastName").prop("disabled", false);
    $("#genderId").prop("disabled", false);

    if ($("#referralTypeId").val() == 2) {
        $("#getPatientInfoWS").prop("disabled", true);
        $("#getPersobByBirthWS").prop("disabled", true);
        $("#searchPatient").prop("disabled", true);

    }
    else {
        $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
        $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
        $("#searchPatient").prop("disabled", false);
    }


    $("#idCardNumber").prop("disabled", false);
    $("#postalCode").prop("disabled", false);
    $("#jobTitle").prop("disabled", false);
    $("#phoneNo").prop("disabled", false);
    $("#maritalStatusId").prop("disabled", false);
    $("#educationLevelId").prop("disabled", false);
    $("#fatherFirstName").prop("disabled", false);
    $("#countryId").prop("disabled", false);
    $("#mobile").prop("disabled", false);
    $("#address").prop("disabled", false);

    //$("#referringDoctorId").prop("disabled", false);
    //$("#priscriptionDatePersian").prop("disabled", false);
    $("#editSectionPatient").prop("disabled", true);


    if (+$("#referralTypeId").val() == 2) {
        $("#nationalCode").val("").prop("disabled", true).blur();
        $("#basicInsurerExpirationDatePersian").val("").prop("disabled", true);
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        setTimeout(() => $("#firstName").focus(), 5);
    }

    loadingDoneCallUp();
    loadingDonePersonByBirth();
}

//function resetPatientInfo(opr) {


//    if (+$("#admnId").val() == 0) {

//        $("#referralTypeId").prop("disabled", false)
//        $("#attenderId").prop("disabled", false);
//        $("#userTypeOnOff").prop("disabled", false)
//        $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0).select2("focus");
//        $("#compInsurerThirdPartyId").prop("disabled", false)
//        $("#discountInsurerId").prop("disabled", false)

//        if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
//            $("#basicInsurerNo").prop("disabled", false);
//            $("#basicInsurerExpirationDatePersian").prop("disabled", false);
//        }
//        else {
//            $("#basicInsurerNo").prop("disabled", true);
//            $("#basicInsurerExpirationDatePersian").prop("disabled", true);
//        }

//        if (+$("#referralTypeId").val() !== 2)
//            $("#nationalCode").prop("disabled", false);

//        $("#referringDoctorId").prop("disabled", false);

//        if (+$("#referringDoctorId").val() != 0)
//            $("#priscriptionDatePersian").prop("disabled", false);
//        else
//            $("#priscriptionDatePersian").prop("disabled", true);

//        $("#firstName").prop("disabled", false);
//        $("#lastName").prop("disabled", false);

//        if ($("#referralTypeId").val() == 2) {
//            $("#getPatientInfoWS").prop("disabled", true);
//            $("#getPersobByBirthWS").prop("disabled", true);
//            $("#searchPatient").prop("disabled", true);

//        }
//        else {
//            $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
//            $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
//            $("#searchPatient").prop("disabled", false);
//        }


//        $("#editSectionPatient").prop("disabled", true);

//        if (+$("#referralTypeId").val() == 2) {
//            $("#nationalCode").val("").prop("disabled", true).blur();
//            $("#basicInsurerExpirationDatePersian").val("").prop("disabled", true);
//            $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
//            $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
//            $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
//            setTimeout(() => $("#firstName").focus(), 5);
//        }

//        loadingDoneCallUp();
//        loadingDonePersonByBirth();
//    }
//    else {

//        $("#attenderId").prop("disabled", false);

//        $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0).select2("focus");
//        if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
//            $("#basicInsurerNo").prop("disabled", false);
//            $("#basicInsurerExpirationDatePersian").prop("disabled", false);
//        }
//        else {
//            $("#basicInsurerNo").prop("disabled", true);
//            $("#basicInsurerExpirationDatePersian").prop("disabled", true);
//        }

//        $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0)
//        $("#discountInsurerId").prop("disabled", arr_tempService.length > 0)


//        $("#referringDoctorId").prop("disabled", false);

//        if (+$("#referringDoctorId").val() != 0)
//            $("#priscriptionDatePersian").prop("disabled", false);
//        else
//            $("#priscriptionDatePersian").prop("disabled", true);

//        $("#editSectionPatient").prop("disabled", true);

//        setTimeout(() => $("#basicInsurerLineId").select2("focus"), 5);

//        loadingDoneCallUp();
//        loadingDonePersonByBirth();
//    }
//}

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

                resetPatientOnGetPatientInfo("getPatientInfoWS")

                $("#attenderId").prop("disabled", true);
                $("#referralTypeId").prop("disabled", true);
                $("#nationalCode").prop("disabled", true);
                $("#birthDatePersian").val(data.birthDate).prop("disabled", true);
                $("#firstName").val(data.firstName).prop("disabled", true);
                $("#lastName").val(data.lastName).prop("disabled", true);
                $("#genderId").val(data.genderId).prop("disabled", true);

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
                    resetPatientInfo();
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
            loadingDoneCallUp();
            $("#nationalCode").removeAttr("disabled")
            error_handler(xhr, url);
        }
    });
}

function setPatientInsurer(rowNumber) {

    patientInsurer = insurancesList.find(i => i.rowNumber === rowNumber);
    inqueryID = patientInsurer.inquiryId;

    $("#basicInsurerLineId").val(`1-${patientInsurer.basicInsurerLineId}`).trigger("change").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").val(patientInsurer.expireDate).prop("disabled", true);
    $("#basicInsurerNo").val(patientInsurer.insuranceNumber).prop("disabled", true);
    $("#workshopName").val(patientInsurer.workShopName);
    $("#editSectionPatient").prop("disabled", false);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);

    modal_close("patientInsuranceModal");

    $("#countryId").select2("focus");
}

async function getPersonByBirthWS(nationalCode, birthYear) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/getpersonbybirth`
    var modelGetPerson = {
        nationalCode: nationalCode,
        birthYear: birthYear
    }

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(modelGetPerson),
        success: function (result) {

            var resultPatientIdentity = result;
            loadingDonePersonByBirth();


            if (resultPatientIdentity.successfull) {

                if (resultPatientIdentity.data.patientInfo === null) {

                    resetPatientInfo();

                    var alertPatientInfo = alertify.warning("اطلاعات مراجعه کننده موردنظر یافت نشد");
                    alertPatientInfo.delay(alertify_delay);
                    return;
                }

                var dataPatient = resultPatientIdentity.data.patientInfo;

                resetPatientOnGetPatientInfo("getPersobByBirthWS")

                $("#attenderId").prop("disabled", true);
                $("#referralTypeId").prop("disabled", true);
                $("#nationalCode").prop("disabled", true);
                $("#birthDatePersian").val(dataPatient.birthDate).prop("disabled", true);
                $("#firstName").val(dataPatient.firstName).prop("disabled", true);
                $("#lastName").val(dataPatient.lastName).prop("disabled", true);
                $("#genderId").val(dataPatient.genderId).prop("disabled", true);
                $("#editSectionPatient").prop("disabled", false);
                $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");
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

function modalClosePatientInsurance(modalName) {
    resetPatientInfo();
    modal_close(modalName);
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

    //$("#firstName").val("");
    //$("#lastName").val("");
    //$("#birthDatePersian").val("");
    //$("#workshopName").val("");
    //$("#genderId").val("0").trigger("change");

    $("#getPersobByBirthWS").prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS i").addClass(`fa-spinner fa-spin`).removeClass(`fa-users`);

    setTimeout(() => {
        getPersonByBirthWS($("#nationalCode").val(), +$("#birthYear").val());
    }, 10);
}

function birthYearKeydown(e) {
    if (e.keyCode === KeyCode.Enter) {
        e.stopPropagation();
        e.preventDefault();
        getPersobByBirthWS();
    }
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
                    $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
                    $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
                    $("#patientId").val("");
                    $("#firstName").val("");
                    $("#lastName").val("");
                    $("#countryId").prop('selectedIndex', 0).trigger("change");
                    $("#mobile").val("");
                    $("#address").val("");
                    $("#description").val("");
                    $("#birthDatePersian").val("");
                    $("#workshopName").val("");
                    $("#idCardNumber").val("");
                    $("#postalCode").val("");
                    $("#jobTitle").val("");
                    $("#phoneNo").val("");
                    $("#maritalStatusId").val(-1).trigger("change");
                    $("#educationLevelId").val(-1).trigger("change");
                    $("#fatherFirstName").val("");

                    setTimeout(() => $("#firstName").focus(), 5);
                },
                function () {
                    $("#referralTypeId").val(1).trigger("change.select2");
                    setTimeout(() => $("#firstName").focus(), 5);
                }).set('labels', { ok: 'بلی', cancel: 'خیر' });
    else {
        $("#nationalCode").val("").prop("disabled", true).blur();
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        setTimeout(() => $("#firstName").focus(), 5);
    }

    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);
    $("#searchPatient").prop("disabled", true);
}

function resetShabad() {
    $("#attenderHID").val("");
    $("#refferingHID").val("");
    $("#basicInsurerExpirationDatePersian").val("");
    $("#basicInsurerBookletPageNo").val("");
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

function tabkeyDownDescription(e) {
    if ([KeyCode.Tab, KeyCode.Enter].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#basicInsurerBookletPageNo").focus();
    }

}

function fillAttenderHID(id) {
    $("#refferingHID").val(id); modal_close("referralIdModel"); setTimeout(() => { $("#serviceId").select2("focus"); }, 10);
};

function loadingRefrallHID() {
    $("#getrefferingHID").html(`<i class="fas fa-cogs"></i>`);
}

function getHID(insurerId) {
    var viewData_get_HID_url = `${viewData_baseUrl_MC}/HealthIDOrderApi/gethid`;

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

function eventReferralRow(row) {
    $(`#tempReferralIdList tr`).removeClass("highlight"); $(`#rowRef_${row}`).focus().addClass("highlight");
};

function resetPatientOnGetPatientInfo(nationalOrBirthDay) {

    if (nationalOrBirthDay == "getPatientInfoWS") {
        $("#insuranceNo").val("");
        $("#basicInsurerExpirationDatePersian").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#birthDatePersian").val("");
        $("#workshopName").val("");
        $("#genderId").val("0");
    }
    else {
        $("#firstName").val("");
        $("#lastName").val("");
        $("#birthDatePersian").val("");
        $("#workshopName").val("");
        $("#genderId").val("0").trigger("change");
    }

}

function birthYearcclick(e) {
    e.stopPropagation();
    e.preventDefault();
    $(e.currentTarget).select();
}

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

async function getAttenderHID(btnHID) {

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

    }, 100);
}

function loadingDoneCallUp() {
    $("#getPatientInfoWS").html(`<i class="fas fa-cogs"></i>`);
}

function loadingDonePersonByBirth() {
    $("#getPersobByBirthWS i").removeClass(`fa-spinner fa-spin`).addClass(`fa-users`);
}

function loadingDoneHID() {
    $("#getAttenderHID").html(`<i class="fas fa-cogs"></i>`);
}

function keyDownMobile(e) {
    if (e.shiftKey && e.keyCode === KeyCode.Tab) {
        e.preventDefault();
        e.stopPropagation();
        $("#discountInsurerId").select2("focus");
    }
    else if (e.keyCode === KeyCode.Tab) {
        e.preventDefault();
        e.stopPropagation();
        $("#idCardNumber").focus();
    }
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
            $("#basicInsurerNo").prop("disabled", false);
            $("#basicInsurerBookletPageNo").prop("disabled", false);
            $("#basicInsurerExpirationDatePersian").prop("disabled", false);

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

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmission("saveForm");
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        e.stopPropagation();
        $("#searchPatient").click();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_w) {
        e.preventDefault();
        e.stopPropagation();
        $("#getPatientInfoWS").click();
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

window.Parsley._validatorRegistry.validators.nationalcodeadmission = undefined

window.Parsley.addValidator('nationalcodeadmission', {
    validateString: function (value) {

        if ([4, 5, 6].includes(+$("#referralTypeId").val()))
            return true;

        if (!value) return true;

      

        return isValidIranianNationalCode(value);
    },
    messages: {
        en: 'فرمت نمبر تذکره صحیح نیست .',
    }
});

window.Parsley._validatorRegistry.validators.rqinsur = undefined;
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

$("#userTypeOnOff").on("change", function () {

    let userTypeOnOff = $("#userTypeOnOff").prop("checked")

    if ($("#referralTypeId").val() == 2) {
        $("#getPatientInfoWS").prop("disabled", userTypeOnOff);
        $("#getPersobByBirthWS").prop("disabled", userTypeOnOff);
        $("#searchPatient").prop("disabled", true);
    }
    else {
        $("#attenderId").prop("disabled", false)
        $("#referralTypeId").prop("disabled", false)
        $("#basicInsurerLineId").prop("disabled", false)
        $("#nationalCode").prop("disabled", false)
        $("#firstName").prop("disabled", false)
        $("#lastName").prop("disabled", false)
        $("#getPatientInfoWS").prop("disabled", userTypeOnOff);
        $("#getPersobByBirthWS").prop("disabled", userTypeOnOff);
        $("#searchPatient").prop("disabled", false);
    }

    //if ($(this).parent().hasClass('off')) {
    //    $("#getPersobByBirthWS").prop('disabled', false);
    //    $("#getPatientInfoWS").prop('disabled', false);
    //}
    //else {
    //    $("#getPersobByBirthWS").prop('disabled', true);
    //    $("#getPatientInfoWS").prop('disabled', true);
    //}

    //if ($("#referralTypeId").val() == 2)
    //    $("#searchPatient").prop("disabled", true);
    //else
    //    $("#searchPatient").prop("disabled", false);

    $("#nationalCode").val("")
    $("#editSectionPatient").prop('disabled', true);
    $("#patientId").val('').prop('disabled', true);
    $("#referralTypeId").prop('selectedIndex', 0).prop('disabled', false).trigger("change");
    $("#basicInsurerLineId").prop('selectedIndex', 0).trigger("change");
    $("#basicInsurerNo").val('');
    $("#basicInsurerExpirationDatePersian").val('')
    $("#firstName").val('').prop('disabled', false)
    $("#lastName").val('').prop('disabled', false)
    $("#workshopName").val('')
    $("#birthDatePersian").val('')
    $("#genderId").val('').prop('disabled', false).trigger('change')
    $("#countryId").prop('selectedIndex', 0).trigger("change")
    $("#compInsurerThirdPartyId").val(0).trigger('change')
    $("#discountInsurerId").val(0)
    $("#mobile").val('')
    $("#idCardNumber").val('')
    $("#postalCode").val('')
    $("#jobTitle").val('')
    $("#phoneNo").val('')
    $("#maritalStatusId").prop('selectedIndex', 0).trigger('change')
    $("#educationLevelId").val('selectedIndex', 1).trigger('change')
    $("#fatherFirstName").val('')
    $("#address").val('')
    $("#description").val('')

    $("#nationalCode").focus()

    $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");

    setTimeout(() => {
        $("#nationalCode").focus()
    }, 100)

})

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
        patientNationalCode: $("#searchPatientNationalCode").val(), // == "" ? null : $("#searchPatientNationalCode").val(),
        mobileNo: $("#searchPatientMobileNo").val(),//= "" ? null : $("#searchPatientMobileNo").val(),
        insurNo: $("#searchPatientBasicInsurerNo").val().trim(),//= "" ? null : $("#searchPatientBasicInsurerNo").val().trim(),
        insurerLineId: +basicInsurerLineId,
        compInsurerLineId: +compInsurerLineId,
        thirdPartyInsurerId: +thirdPartyInsurerId,
        discountInsurerId: +discountInsurerId,
        includeUnknown: 0
    }

    patientSearch(patientSearchModel);
});

$("#searchPatientModal").on("hidden.bs.modal", async function () {
    resetShabadElements();
    if (+dropDownCacheData.basicInsurerLineTerminologyCode == 1 || +dropDownCacheData.basicInsurerLineTerminologyCode == 2) {

        await $("#getAttenderHID").click();
        $("#serviceId").select2("focus");
    }
    else {
        $("#basicInsurerBookletPageNo").focus();
    }
});

$("#searchPatientInsurerModal").on("hidden.bs.modal", async function () {
    if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode))
        $("#getAttenderHID").focus();
    else {
        if (!$("#basicInsurerNo").prop("disabled"))
            $("#basicInsurerNo").focus();
        else
            $("#basicInsurerBookletPageNo").focus();
    }
});

$("#admissionFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }

});

$("#printAdmissionModal").on("hidden.bs.modal", function (ev) {

    navigation_item_click("/MC/Admission", viewData_modal_title);

    if (printUrl !== "")
        adm_print(adm_Identity, adm_admissionMasterId, printUrl, stageAndWorkflow.workflowId, stageAndWorkflow.stageId,);

});

$("#printAdmissionModal").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrintAdmissionModal(e)
});

$("#serviceId").on("change", function () {

    if (+$(this).val() !== 0) {
        $("#qty").val(1);
        admissionCalPrice();
    }
    else {
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

$("#referringDoctorId").on("change", function () {
    if (+$(this).val() !== 0) {
        $("#prescriptionDate").val("").prop("disabled", false);
        referringDoctorInfo = getReferringDoctorInfo(+$(this).val());
    }
    else {
        $("#prescriptionDate").val("").prop("disabled", true);
        referringDoctorInfo = null;
    }
});

$("#attenderId").on("change", function () {

    var attenderId = +$(this).val();

    $("#serviceId").empty();


    resetAdmCalPrice();

    if (attenderId !== 0) {
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, attenderId, false, 3, "انتخاب خدمت");
        getAttenderInfo(+$(this).val());
    }
    else {
        attenderMsc = "0";
        attenderMscTypeId = 0;
        $("#reserveShift").val(0);
        $(`#temptimeShiftDays`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
    }

    getShiftReserve();

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

    //if (+$(`#serviceId`).val() !== 0)
    //    $(`#serviceId`).trigger("change");

    admissionCalPrice();
});

$("#basicInsurerLineId").on("change", function () {

    resetShabadElements();

    let basicInsurerLineId = $(this).val()
    let basicInsurerLineTypeId = ""

    HIDIdentity = "";
    HIDOnline = false;
    $("#hid").val("");
    $("#hidonline").prop("checked", false).trigger("change");

    if (checkResponse(basicInsurerLineId) && basicInsurerLineId !== 0) {

        basicInsurerLineTypeId = +basicInsurerLineId.split("-")[0]
        basicInsurerLineId = +basicInsurerLineId.split("-")[1]

        setInsurerInfo(basicInsurerLineTypeId, basicInsurerLineId)

        admissionCalPrice();
    }
    else
        $(this).prop("selectedIndex", 0).trigger("change");
});

$("#basicInsurerNo").on("focus", function () {
    selectText($(this));
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
        var msg = alertify.warning(admission.select_attender);
        msg.delay(admission.delay);
        return;
    }

    reserve_init(attenderId);

    modal_show("reserveModal");


});

$("#reserveModal").on("hidden.bs.modal", function () {
    $("#referralTypeId").select2("focus");
});

$("#list_adm").on("click", function () {
    navigation_item_click("/MC/Admission", "لیست پذیرش");
});

$("#newForm").on("click", function () {
    $("#attenderId").select2("focus");
    alertify.confirm('', msg_confirm_new_page,
        function () {
            resetAdmission();
        },
        function () {
            var msg = alertify.error('انصراف');
            msg.delay(admission.delay);
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
});

$("#saveForm").on("click", function () {
    saveAdmission("saveForm");
});

$("#saveFormAndPrint").on("click", function () {
    saveAdmission("saveFormAndPrint");
});

$("#nationalCode").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter && +dropDownCacheData.basicInsurerId === 8000 && +$("#referralTypeId").val() === 1 && $("#nationalCode").val().length === 16) {
        var valScannr = $(this).val();
        $(this).val(valScannr.substring(0, 10));
    }

});

$("#nationalCode").on("blur", function (eb) {

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
                $("#description").val(result.description)
                $("#idCardNumber").val(result.idCardNumber);
                $("#postalCode").val(result.postalCode);
                $("#jobTitle").val(result.jobTitle);
                $("#phoneNo").val(result.phoneNo);
                $("#maritalStatusId").val(result.maritalStatusId).trigger("change");
                $("#educationLevelId").val(result.educationLevelId).trigger("change");
                $("#fatherFirstName").val(result.fatherFirstName);
            }

        });
    //}
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
    $("#description").val("");
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

    //OpenSearchPanelByNationalCode();
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();

});

$("#editSectionPatient").on("click", function () {
    resetPatientInfo();
    $(this).prop("disabled", true);
});

$("#editSectionShabad").on("click", function () {
    // Eliminate Web service
    if (HIDIdentity !== "" && HIDOnline)
        eliminateHid();
    else {
        $("#getAttenderHID").prop("disabled", false);
        $("#editSectionPatient").prop("disabled", false).focus();
        $("#editSectionShabad").prop("disabled", true);
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

$("#getPatientInfoWS").on("click", function () {

    if ($('#userTypeOnOff').prop("checked") === false) {

        $("#nationalCode").attr("disabled", "disabled")
        if (attenderMsc === "0" || attenderMscTypeId === 0) {

            resetPatientInfo();

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
    }
});

$("#getPersobByBirthWS").on("click", function () {
    if (+$("#birthYear").width() == 0)
        $("#birthYear").animate({ width: '60', opacity: "1", paddingRight: "5", marginRight: "5" }, 350).focus();
    else
        $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");
});

$("#eliminateReasonId").on("change", function () {
    $("#editSectionShabad").prop("disabled", (+$(this).val() == 0));
});

$("#referralTypeId").on("change", function () {

    var patientRefId = +$(this).val();
    $("#basicInsurerLineId").html("")

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/${patientRefId}`)

    $('#basicInsurerLineId').prop("selectedIndex", 0).trigger("change");
    $("#nationalCode").prop("disabled", false);
    $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
    $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
    $("#searchPatient").prop("disabled", false);

    if (patientRefId === 5) {
        $("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change").prop("disabled", false);
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    }
    else if (patientRefId === 2)
        clearDataPatient();
    else {
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
        $("#basicInsurerLineId").prop("disabled", false);
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    }

    checkInsurerTamin(+$("#referralTypeId").val());
});

$("#getAttenderHID").on("click", async function () {


    if (HIDIdentity !== "" && HIDOnline) {
        var msgHasHID = alertify.error("برای دریافت مجدد شناسه شباد ، نیاز به استعلام بیمه می باشد");
        msgHasHID.delay(alertify_delay);
        return;
    }

    await getAttenderHID($(this));
});

$("#getrefferingHID").on("click", function () {

    $(this).html(`<i class="fa fa-spinner fa-spin"></i>`);

    var nationalCode = $("#nationalCode").val();
    if (+nationalCode != 0) {
        var url = p_url = `${viewData_baseUrl_MC}/AdmissionReferApi/getactivereferralid`;

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

// ADMISSION Diagnosis Start *************

$("#addDiagnosis").on("click", function () {

    let diagForm = $('#diagForm').parsley(),
        validate = diagForm.validate();
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
        comment: $("#comment").val(),
    };
    if (typeSave == "INS")
        arr_TempDiagnosis.push(modelDiag);

    appendTempDiagnosis(modelDiag, typeSaveDiag);
    typeSaveDiag = "INS";
    $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
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
    $(".diagnosis-filed").prop("disabled", false);
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
    $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
    rebuildDaigRow();
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
    $("#statusId").select2("focus");
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
    }
};

// ADMISSION Diagnosis END *************

initAdmissionForm(getAdmission, +$("#admnId").val()).then(id => {

    if (!isEditMode())
        $(`#basicInsurerLineId`).val("1-73").trigger("change");

    firstTimeResetShabad = true;

    if (+$("#admnId").val() > 0)
        $("#serviceId").select2("focus");
    else
        $("#attenderId").select2("focus");

});