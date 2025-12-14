var form = $('#patientAndInsurerValidate').parsley(),
    arr_tempService = [],
    arr_tempItem = [],
    viewData_modal_title = "پذیرش",
    viewData_controllername = "AdmissionMasterApi",
    stageAndWorkflow = {},
    calPriceModel = {},
    calPriceServiceModel = {},
    calPriceItemModel = {},
    insurExpDateValid = true,
    prescriptionDateValid = true,
    attenderScheduleValid = false,
    medicalTimeShiftId = null,
    monthId = 0,
    printUrl = "",
    typeSaveDiag = "INS",
    arr_TempDiagnosis = [],
    currentDiagRowNumber = 0,
    viewData_print_model_adm = { url: printUrl, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
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
    admissionReserveDateTimePersian = "",
    HIDIdentity = "",
    HIDOnline = false,
    isActivePatient = true,
    userInfoLogin = {},
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
    changedStateCalPrice = false,
    errorCalPrice = {
        statusError: 0,
        messageError: "",
        itemId: false,
        itemPrice: false,
        salePriceModelActive: false,
        rangePrice: false,
        minQty: false,
        permissionDiscount: false,
        priceNotValid: false,
        exception: false
    },
    hasAttribute = false,
    admissionListCount = 0,
    isInsertService = true,
    actionIdOnEdit = 0,
    editModeAdmissionMasterVar = false,
    firstLoadSelect2 = true,
    stageActionLogCurrent = {};



async function initAdmissionMasterForm() {

    let admissionMasterId = +$("#admissionsMasterId").val()

    $("#admissionCash").prop("disabled", admissionMasterId > 0 ? true : false);
    userInfoLogin = await getCashIdByUserId()
    $("input").attr("autocomplete", "off");
    $(".select2").select2();
    $('#userTypeOnOff').bootstrapToggle();
    $("#admnId").val("")

    inputMask();

    await configFormByAdmissionMasterId(admissionMasterId);

    setTimeout(() => {
        $("#attenderId").select2("focus");
    }, 200)

}

async function loadSelectDependent() {

    $(`#attenderId,#referringDoctorId,#referralTypeId,#countryId,#eliminateReasonId,#educationLevelId
     ,#statusId,#diagnosisResonId,#reasonForEncounterId,#serverityId,#searchPatientCompInsurerThirdPartyId,
      #compInsurerThirdPartyId,#discountInsurerId,#searchPatientBasicInsurerLineId ,#ItemId,#searchPatientDiscountInsurerId`).empty()

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
        $("#referralTypeId option[value=2]").remove()
        $("#referralTypeId option[value=3]").remove()
        $("#referralTypeId").val($("select#referralTypeId option:first").val()).trigger("change");
    }, "", false, true, false, false);
    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false, 3, "انتخاب کنید", function () { $("#countryId").val(101).trigger("change") });
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "compInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, false, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", false, `${dropDownCache.discount}/0`);
    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientDiscountInsurerId", false, `${dropDownCache.discount}/0`);
    fill_select2(`${viewData_baseUrl_WH}/ItemApi/itemsaledropdown`, "ItemId", true);

    $("#genderId").prop("selectedIndex", 0).trigger("change")

}

function configFormByAdmissionMasterId(admissionMasterId) {

    if (admissionMasterId != 0)
        admissionMatserFormConfig(admissionMasterId, "EDIT")
    else
        admissionMatserFormConfig(admissionMasterId, "ADD")
}

function isEditMode() {
    if ($("#admissionsMasterId").val() == "")
        return false;
    else
        return true;
}

function expandAdmission(item) {

    if ($(item).attr("id") == 'expandAdmissionBtnDiag') {
        if (firstLoadSelect2) {
            firstLoadSelect2 = false
            fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`, "statusId", true);
            fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`, "diagnosisResonId", true, 0, true);
            fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/reasonforencounterid`, "reasonForEncounterId", true, 0, true);
            fill_select2(`${viewData_baseUrl_MC}/PrescriptionApi/serverityid`, "serverityId", true);
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

function resetAdmission() {

    let form1 = $('#patientAndInsurerValidate').parsley();
    form1.reset();

    $(`#temptimeShiftDaysAdmissionMaster`).html("");

    if (!$("#expandAdmissionBtn i").hasClass("fa-plus"))
        $("#expandAdmissionBtn").click();
    if (!$("#expandAdmissionBtnDiag i").hasClass("fa-plus"))
        $("#expandAdmissionBtnDiag").click();

    $("input.form-control").val("");


    if ($('#userTypeOnOff').prop("checked")) {
        $("#getPatientInfoWS").prop("disabled", true);
        $("#getPersobByBirthWS").prop("disabled", true);
    } else {
        $("#getPatientInfoWS").prop("disabled", false);
        $("#getPersobByBirthWS").prop("disabled", false);
    }


    resetItem(true)

    resetDiagnosis();
    firstLoadSelect2 = true
    actionIdOnEdit = 0
    editModeAdmissionMaster(null, false)
    patientInsurer = null
    arr_tempService = []
    arr_tempItem = []
    stageAndWorkflow = {}
    calPriceServiceModel = {}
    calPriceItemModel = {}
    insurExpDateValid = true
    prescriptionDateValid = true
    attenderScheduleValid = false
    arr_TempDiagnosis = []
    insurancesList = []
    attenderMsc = "0"
    attenderMscTypeId = 0
    inqueryID = 0
    referringDoctorInfo = null
    HIDIdentity = ""
    HIDOnline = false
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
    changedStateCalPrice = false
    errorCalPrice = {
        statusError: 0,
        messageError: "",
        itemId: false,
        itemPrice: false,
        salePriceModelActive: false,
        rangePrice: false,
        minQty: false,
        permissionDiscount: false,
        priceNotValid: false,
        exception: false
    }
    hasAttribute = false
    admissionListCount = 0

    //$("#tempService").html(emptyRowHTML);
    //$("#tempItem").html(emptyRowHTML);
    //$("#sumRowService").addClass("displaynone");
    //$("#sumRowItem").addClass("displaynone");
    //$(".sumNetPriceService").text("").removeClass("sum-is-same");
    //$(".sumNetPriceItem").text("").removeClass("sum-is-same");
    //$(".select2").removeAttr("disabled");
    //$("#patientForm .form-control:not(#patientId,#workshopName,#birthDatePersian)").removeAttr("disabled");
    //$("#userTypeOnOff").removeAttr("disabled")
    //$("#searchPatient").removeAttr("disabled")
    //$("#serviceBoxNetAmount").text(0)
    //$("#itemBoxNetAmount").text(0)
    //$("select").not("#basicInsurerLineId").prop("selectedIndex", 0).trigger("change.select2");
    //$("#hidonline").prop("checked", false).trigger("change");
}

function resetAdmCalPrice() {

    $("#basicServicePrice").val("");
    $("#basicShareAmount").val("")
    $("#compShareAmount").val("")
    $("#thirdPartyAmount").val("")
    $("#discountAmount").val("")
    $("#netAmount").val("")

    calPriceServiceModel = {};
}

function tabActionBoxConfig(currentTabId, e) {

    if (editModeAdmissionMasterVar) {
        if (e != null) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
    }

    afterAddOrDeleteTempServiceOrItem(currentTabId == 'servicePart' ? true : false)

    if (currentTabId == "servicePart") {

        $("#serviceBoxNetAmount").removeClass("elementInActive").addClass("elementActive")
        $("#itemBoxNetAmount").removeClass("elementActive").addClass("elementInActive")
        $('#serviceId').select2('close')
        $('#ItemId').select2('close')
        $('#itemcategoryattribute').select2('close')


        serviceOrItemFocus(true)
    }
    else {
        $("#serviceBoxNetAmount").removeClass("elementActive").addClass("elementInActive")
        $("#itemBoxNetAmount").removeClass("elementInActive").addClass("elementActive")
        $('#serviceId').select2('close')
        $('#ItemId').select2('close')
        $('#itemcategoryattribute').select2('close')

        serviceOrItemFocus(false)
    }

}

function serviceOrItemFocus(ServiceOrItem) {

    if (ServiceOrItem) {
        $("#serviceId").siblings("").removeClass("select2-container--focus")

        setTimeout(() => {
            $("#serviceId").select2("focus")
        }, 10)
    }
    else {
        $("#ItemId").siblings("").removeClass("select2-container--focus")

        setTimeout(() => {
            $("#ItemId").select2("focus")
        }, 10)
    }
}

function getAdmissionType() {

    let rowElm = $(`#admissionsList .highlight`)
    let stageId = +rowElm.data("stageid");
    let workflowId = +rowElm.data("workflowid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    return admissionTypeId
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        let currentActiveTab = $("#tabActionBox a.active").parent().prop("id")
        if (currentActiveTab == "servicePart")
            saveAdmissionService();
        else
            saveAdmissionItem();
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
    else if (e.ctrlKey && e.keyCode === KeyCode.ArrowRight) {
        if (!editModeAdmissionMasterVar) {

            $("#itemPart a").removeClass("active")
            $("#servicePart a").addClass("active")
            $("#itemBox").removeClass("active")
            $("#serviceBox").addClass("active")
            tabActionBoxConfig('servicePart')
        }
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.ArrowLeft) {
        if (!editModeAdmissionMasterVar) {

            $("#servicePart a").removeClass("active")
            $("#itemPart a").addClass("active")
            $("#serviceBox").removeClass("active")
            $("#itemBox").addClass("active")
            tabActionBoxConfig('itemPart')
        }
    }
    else {
        if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4, KeyCode.Insert].indexOf(e.which) == -1)
            return;
        switchPrint(e)
    }

};





// HEADER BUTTONS START ****************************************************************
function resetAdmBox() {
    $("#admissionsMasterId").val("")
    $("#masterDateTime").val("")
    $("#masterUserFullName").val("")
    $("#masterStageName").val("")
    $("#masterWorkflowName").val("")
    $("#masterActionName").val("")
    $("#masterActionId").val("")
}

$("#list_adm").on("click", function () {
    navigation_item_click("/MC/AdmissionMaster", "لیست طرح درمان");
});

$("#admissionCash").on("click", function () {
    let admissionMasterId = +$("#admissionsMasterId").val();

    if (admissionMasterId == 0)
        navigation_item_click("/MC/AdmissionCash", "لیست طرح درمان");

    else
        navigation_item_click(`/MC/AdmissionCash/form/${admissionMasterId}`, "دریافت و پرداخت صندوق");
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

    $("#nationalCode").val("")
    //$("#editSectionPatient").prop('disabled', true);
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


    $("#birthYear").animate({ width: '0', opacity: "0", paddingRight: "0", marginRight: "0" }, 350).val("");

    setTimeout(() => {
        $("#nationalCode").focus()
    }, 100)

})

$("#newForm").on("click", function () {


    alertify.confirm('', msg_confirm_new_page,
        function () {

            if ($(".editFlag i:not(.d-none)").length > 0) {

                let lastEditRowAdmissionId = $(".editFlag i:not(.d-none)").parents("tr").data("id")

                let currentMassage = `شناسه درخواست ${lastEditRowAdmissionId} در حالت ویرایش می باشد ، در صورت تایید اطلاعات ویرایش شده حذف می شوند!!`

                alertify.confirm('اخطار', currentMassage,
                    function () {
                        admissionMatserFormConfig(0, "ADD")
                        $("#attenderId").select2("focus");
                    },
                    function () { }
                ).set('labels', { ok: 'بله', cancel: 'خیر' });
            }
            else {
                admissionMatserFormConfig(0, "ADD")
                $("#attenderId").select2("focus");
            }

        },
        function () {

            var msg = alertify.error('انصراف');
            msg.delay(admission.delay);
            $("#attenderId").select2("focus");

        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
});
// HEADER BUTTONS END ****************************************************************





//ADMISSION LIST SECTION START ****************************************************************
function switchPrint(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printShortcut(1);
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        printShortcut(2);
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        printShortcut(3);
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printShortcut(4);
    }
}

function printShortcut(type) {

    if (type === 1) {
        let admissionType = getAdmissionType()
        if (admissionType == 1)
            separationprintSale();
        else
            separationprint();
    }
    else if (type === 2)
        aggregationprint();
    else if (type === 3)
        doubleprint();
    else if (type === 4) {
        let admissionType = getAdmissionType()
        if (admissionType == 1)
            admissionitemstandprint();
        else
            admissionstandprint();
    }

}

function separationprintSale() {

    var check = controller_check_authorize("AdmissionItemApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")

    contentPrintAdmissionSale(admissionId);

    modal_close('PrnAdmissionItem')
}

function admissionitemstandprint() {

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")
    let medicalrevenue = row.data("medicalrevenue");

    standprint(admissionId, medicalrevenue);
    modal_close('PrnAdmissionItem')
}

function separationprint() {

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")

    contentPrintAdmission(admissionId);

    modal_close('PrnAdmission')
}

function aggregationprint() {

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")

    contentPrintAdmissionCompress(admissionId);

    modal_close('PrnAdmission');
}

function doubleprint() {

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let element = $("#bcTarget")

    let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
    contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

    modal_close('PrnAdmission');
}

function admissionstandprint() {

    let row = $(`#admissionsList .highlight`);
    let admissionId = row.data("admissionid")
    let medicalrevenue = $(row).data("medicalrevenue");

    standprint(admissionId, medicalrevenue);

    modal_close('PrnAdmission')
}



function admissionMatserFormConfig(admissionMasterId, opr, callback = null) {

    if (opr == 'ADD')//افزودن یا جدید
        configFormByOprADD(admissionMasterId, opr, callback)
    else if (opr == 'EDIT')//ویرایش پرونده
        configFormByOprEDIT(admissionMasterId, opr, callback)
    else if (opr == 'EDITR')//ویرایش یک پذیرش یا سفارش کالا
        configFormByOprEDITR(admissionMasterId, opr, callback)
    else if (opr == 'INS')// افزودن یک  پذیرش یا سفارش کالا
        configFormByOprINS(admissionMasterId, opr, callback)
    else if (opr == 'DEL')//حذف یک پذیرش یا سفارش کالا
        configFormByOprDEL(admissionMasterId, opr, callback)
    else if (opr == 'STEP')// تغییر گام پذیرش یا سفارش کالا
        configFormByOprACTION(admissionMasterId, opr, callback)

}

async function getAdmissionsList(admissionMasterId = 0) {

    $("#admissionsMasterId").val(admissionMasterId == 0 ? "" : admissionMasterId)


    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getmasteradmissions/${admissionMasterId}`

        let res = $.ajax({
            url: url,
            async: false,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                let admissionMasterCashInfo = getMasterCashInfo(admissionMasterId, 0);

                if (checkResponse(result) && result.length > 0) {
                    buildAdmissionsList(result, admissionMasterId, admissionMasterCashInfo)
                }
                else {
                    buildAdmissionsList([], admissionMasterId, admissionMasterCashInfo)
                }

                return result
            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildAdmissionsList([], admissionMasterId, admissionMasterCashInfo)
                return []
            }
        });

        return res

    }
    else {
        buildAdmissionsList([], admissionMasterId, 0)
        return []
    }

}

function buildAdmissionsList(admissions, admissionMasterId, admissionMasterCashInfo) {

    admissionListCount = admissions.length

    $("#admissionsListTable").html("")

    let strTable = ""
    strTable = `
                    <thead class="table-thead-fixed">
                         <tr>
                             <th class="col-width-percent-2"></th>
                             <th class="col-width-percent-5">شناسه</th>
                             <th class="col-width-percent-11">جریان کار</th>
                             <th class="col-width-percent-11">مرحله</th>
                             <th class="col-width-percent-10">گام</th>
                             <th class="col-width-percent-10">داکتر</th>
                             <th class="col-width-percent-9">شیفت</th>
                             <th class="col-width-percent-6">نوبت</th>
                             <th class="col-width-percent-5">تاریخ رزرو</th>
                             <th class="col-width-percent-6">مبلغ</th>
                             <th class="col-width-percent-8">مراجعه کننده</th>
                             <th class="col-width-percent-8">کاربر ثبت کننده</th>
                             <th class="col-width-percent-5">تاریخ و زمان ثبت</th>
                             <th class="col-width-percent-4">عملیات</th>
                         </tr>
                     </thead>
                     <tbody id="admissionsListTbody">`

    if (checkResponse(admissions) && admissions.length != 0) {

        for (let i = 0; i < admissions.length; i++) {
            strTable += `<tr id="admL${i}" 
                             data-id="${admissions[i].id}" 
                             onclick="trOnclickAdmissionsList(${i},'admissionsListTable',event)" 
                             onkeydown="trOnkeydownAdmissionList(${i},'admissionsListTable',event)" 
                             tabindex="-1"
                             data-admissionid="${admissions[i].id}"
                             data-centralid="${admissions[i].centralId}"
                             data-workflowid="${admissions[i].workflowId}"
                             data-stageid="${admissions[i].stageId}"
                             data-actionid="${admissions[i].actionId}"
                             data-medicalrevenue="${admissions[i].medicalRevenue}"
                             data-admissionamount="${admissions[i].admissionAmount}"    
                             data-branchid="${admissions[i].branchId}"
                             data-patientid="${admissions[i].patientId}"
                             data-admissionmasterId="${admissionMasterId}">
                                 <td id="admLEdit${i}" class="editFlag"><i class="fas fa-edit editrow d-none"></i></td>
                                 <td>${admissions[i].id}</td>
                                 <td>${admissions[i].workflow}</td>
                                 <td>${admissions[i].stage}</td>
                                 <td>${admissions[i].actionIdName}</td>
                                 <td>${admissions[i].attenderId == 0 ? "" : `${admissions[i].attenderId} - ${admissions[i].attenderName}`}</td>    
                                 <td>${checkResponse(admissions[i].reserveShiftId) && admissions[i].reserveShiftName != null ? `${admissions[i].reserveShiftId} - ${admissions[i].reserveShiftName}` : ""}</td>
                                 <td>${checkResponse(admissions[i].admissionNo) ? admissions[i].admissionNo : ""}</td>   
                                 <td>${checkResponse(admissions[i].reserveDatePersian) && admissions[i].reserveDatePersian != "" ? `${admissions[i].reserveDatePersian} ${admissions[i].reserveTime}` : ""}</td>
                                 <td>${admissions[i].admissionAmount >= 0 ? transformNumbers.toComma(admissions[i].admissionAmount) : `(${transformNumbers.toComma(Math.abs(admissions[i].admissionAmount))})`}</td>
                                 <td>${admissions[i].patientId} ${admissions[i].patientFullName}</td>
                                 <td>${admissions[i].createUserFullName}</td>
                                 <td>${admissions[i].createDateTimePersian}</td>
                             `

            strTable += `<td>
                            <div class="dropright">
                                <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                    <button id="displayAdmissionId${i}" onclick="runBtnDisplayAdmission(${admissionMasterId})" class="dropdown-item" title="نمایش">
                                        <i class="far fa-file-alt ml-2"></i>
                                        <span>نمایش</span>   
                                    </button>

                                    <button id="printAdmissionId${i}" onclick="runBtnPrintAdmission(${admissions[i].id},${i},event)" class="dropdown-item" title="چاپ">
                                        <i class="fa fa-print ml-2"></i>
                                        <span>چاپ</span>   
                                    </button>

                                    <button id="editAdmissionId${i}" onclick="runBtnEditAdmission(${admissions[i].id},${i},event)" class="dropdown-item editAdmission" title="ویرایش">
                                        <i class="fa fa-edit color-green ml-2"></i>
                                        <span>ویرایش</span>   
                                    </button>`

            if ($("#admBox").hasClass('d-none'))
                strTable += `
                                    <button id="deleteAdmissionId${i}" onclick="runBtnDeleteAdmission(${admissions[i].id},${admissions[i].branchId},${i},event)" class="dropdown-item" title="حذف">
                                        <i class="fa fa-trash color-maroon ml-2"></i>
                                        <span>حذف</span>   
                                    </button>`
            strTable += `
                                    <div class="button-seprator-hor"></div>
                                    <button id="changeActionId${i}" onclick="runBtnChangeAction(${admissions[i].id},${i},event)" class="dropdown-item" title="گام">
                                        <i class="fas fa-cash-register ml-2"></i>
                                        <span>گام</span>
                                    </button>
                                   
                                </div>
                            </div>
                        </td></tr>`
        }


        strTable += `<tr>
                        <td colspan="9" style="text-align:left">جمع</td>
                        <td  class=" money total-amount">${admissionMasterCashInfo.admissionMasterAmount >= 0 ? transformNumbers.toComma(admissionMasterCashInfo.admissionMasterAmount) : `(${transformNumbers.toComma(Math.abs(admissionMasterCashInfo.admissionMasterAmount))})`}</td>
                        <td colspan="4"></td>
                     </tr>`



    }
    else
        strTable += `<tr><td colspan="14" class="text-center">سطری وجود ندارد</td></tr>`

    strTable += `</tbody>`

    $("#admissionsListTable").append(strTable)

    $("#admissionsListTable #admL0").addClass("highlight")
}

function getAdmissionInfo(admissionId, admissionTypeId, opr, admissionMasterInfo) {

    let viewData_get_admission = ""

    if (admissionTypeId == 1)
        viewData_get_admission = `${viewData_baseUrl_MC}/AdmissionItemApi/display`
    else
        viewData_get_admission = `${viewData_baseUrl_MC}/AdmissionApi/display`


    let res = $.ajax({
        url: viewData_get_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(admissionId),
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_admission);
            return null
        }
    });

    return res
}

function editModeAdmissionMaster(admissionTypeId, isEditMode) {

    editModeAdmissionMasterVar = isEditMode

    if (isEditMode) {
        if (admissionTypeId == 1) {
            $("#servicePartAccess").removeClass("d-none")
            $("#itemPartAccess").addClass("d-none")
        }
        else {
            $("#servicePartAccess").addClass("d-none")
            $("#itemPartAccess").removeClass("d-none")
        }
    }
    else {
        $("#servicePartAccess").addClass("d-none")
        $("#itemPartAccess").addClass("d-none")
    }

}

function configFormByOprADD(admissionMasterId, opr) {


    $("#userTypeOnOff").prop("disabled", false)

    $("#admBox").addClass("d-none")

    getAdmissionsList(admissionMasterId)

    resetAdmission()

    loadSelectDependent();


    //admbox and item Section start *****************************************************************************
    admbox(null, admissionMasterId)
    //admbox and item Section end *****************************************************************************


    //service and item Section start *****************************************************************************
    $(".cancelEdit").prop("disabled", true)
    serviceAndItemSectionConfig(null, 1)
    serviceAndItemSectionConfig(null, 2)
    //service and item Section end *****************************************************************************


    //attender section start *******************************************************************************
    attenderSectionConfig(null)
    //attender section end *******************************************************************************


    //patient section start *******************************************************************************
    patientSectionConfig(null)
    //patient section end *******************************************************************************


    //insurer section start *******************************************************************************
    insurerSectionConfig(null)
    //insurer section end *******************************************************************************


    //SHABAD Section start *******************************************************************************
    shabadSectionConfig(null)
    //SHABAD Section end *******************************************************************************


    //DiagAdmissionForm section start *************************************************************************
    diagAdmissionConfig(null)
    //DiagAdmissionForm section end *************************************************************************

    //afterAddOrDeleteTempServiceOrItem()

    setTimeout(() => $("#attenderId").select2("focus"), 50);
}

async function configFormByOprEDIT(admissionMasterId, opr) {
    $("#userTypeOnOff").prop("disabled", true)

    resetAdmission()

    loadSelectDependent();

    $("#admBox").removeClass("d-none")

    let admissions = await getAdmissionsList(admissionMasterId)


    //admbox and item Section start *****************************************************************************
    admbox(admissions, admissionMasterId)
    //admbox and item Section end *****************************************************************************


    //service and item Section start *****************************************************************************
    $(".cancelEdit").prop("disabled", true)
    serviceAndItemSectionConfig(null, 1)
    serviceAndItemSectionConfig(null, 2)
    //service and item Section end *****************************************************************************


    //attender section start *******************************************************************************
    attenderSectionConfig(null)
    //attender section end *******************************************************************************


    //insurer section start *******************************************************************************
    insurerSectionConfig(null)
    //insurer section end *******************************************************************************


    //SHABAD Section start *******************************************************************************
    shabadSectionConfig(null)
    //SHABAD Section END *******************************************************************************


    //patient section start *******************************************************************************
    if (checkResponse(admissions) && admissions.length != 0) {
        let admissionId = admissions[0].id
        let workflowId = admissions[0].workflowId
        let stageId = admissions[0].stageId
        let workflowStage = getAdmissionTypeId(stageId, workflowId)
        let admissionTypeId = workflowStage.admissionTypeId
        let admissionInfo = await getAdmissionInfo(admissionId, admissionTypeId)
        patientSectionConfig(admissionInfo)
    }
    else
        patientSectionConfig(null, null)
    //patient section end *******************************************************************************


    //DiagAdmissionForm section start *************************************************************************
    diagAdmissionConfig(null)
    //DiagAdmissionForm section end *************************************************************************

    //afterAddOrDeleteTempServiceOrItem()

    setTimeout(() => $("#attenderId").select2("focus"), 50);

}

async function configFormByOprEDITR(admissionMasterId, opr, callback) {

    let rowInfo = callback()

    let admissionInfo = await getAdmissionInfo(rowInfo.admissionId, rowInfo.admissionTypeId)
    let admissionTypeId = rowInfo.admissionTypeId

    actionIdOnEdit = rowInfo.actionId
    $("#admnId").val(admissionInfo.id)



    //service and item Section start *****************************************************************************
    if (admissionTypeId == 1) {
        serviceAndItemSectionConfig(admissionInfo, admissionTypeId)
        serviceAndItemSectionConfig(null, 2)
    }
    else {
        serviceAndItemSectionConfig(null, 1)
        serviceAndItemSectionConfig(admissionInfo, admissionTypeId)
    }
    //service and item Section end *****************************************************************************


    //attender section start *******************************************************************************
    attenderSectionConfig(admissionInfo, admissionTypeId)
    //attender section end *******************************************************************************


    //insurer section start *******************************************************************************
    insurerSectionConfig(admissionInfo)
    //insurer section end *******************************************************************************


    //SHABAD Section start *******************************************************************************
    shabadSectionConfig(admissionInfo)
    //SHABAD Section end *******************************************************************************


    //DiagAdmissionForm section start *************************************************************************
    if (admissionTypeId == 2)
        diagAdmissionConfig(admissionInfo)
    //DiagAdmissionForm section end *************************************************************************

    editModeAdmissionMasterVar = false

    if (admissionTypeId == 1)
        $("#itemPart a").click()
    else
        $("#servicePart a").click()

    setTimeout(() => {
        editModeAdmissionMaster(admissionTypeId, true)
    }, 50)

}

async function configFormByOprINS(admissionMasterId, opr, callback) {

    let admissionTypeId = callback()
    let admissionInfo = await getAdmissionsList(admissionMasterId)



    $(".cancelEdit").prop("disabled", true)
    $(".editFlag i").addClass("d-none")

    $("#admnId").val("")


    HIDIdentity = ""
    inqueryID = 0
    HIDOnline = false
    actionIdOnEdit = 0


    //admbox and item Section start *****************************************************************************
    admbox(admissionInfo, admissionMasterId)
    //admbox and item Section end *****************************************************************************




    //service and item Section start *****************************************************************************
    if (admissionTypeId == 1)
        serviceAndItemSectionConfig(null, 1)
    else
        serviceAndItemSectionConfig(null, 2)
    //service and item Section end *******************************************************************************


    //attender section start *******************************************************************************
    if (admissionTypeId == 2)
        getShiftReserve(false);
    //attender section end *******************************************************************************


    //SHABAD Section start *******************************************************************************
    shabadSectionConfig(null)
    //SHABAD Section end *******************************************************************************


    //DiagAdmissionForm section start *************************************************************************
    if (admissionTypeId == 2)
        diagAdmissionConfig(null)
    //DiagAdmissionForm section end *************************************************************************


    //INSURER section start *************************************************************************
    if (admissionTypeId == 2)
        $("#basicInsurerBookletPageNo").val("")
    //INSURER section end *************************************************************************


    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))

    editModeAdmissionMaster(admissionTypeId, false)

    setTimeout(() => {

        if (admissionTypeId == 1)
            $("ItemId").select2("focus")
        else
            $("#serviceId").select2("focus")
    }, 50)

}

async function configFormByOprDEL(admissionMasterId, opr, callback) {

    let admissionTypeId = callback()
    let admissionInfo = await getAdmissionsList(admissionMasterId)

    $(".cancelEdit").prop("disabled", true)
    $(".editFlag i").addClass("d-none")

    $("#admnId").val("")
    $("#reserveNo").val("")
    $("#reserveDate").val("")
    $("#scheduleBlockId").val("")

    HIDIdentity = ""
    inqueryID = 0
    HIDOnline = false
    actionIdOnEdit = 0


    //admbox and item Section start *****************************************************************************
    admbox(admissionInfo, admissionMasterId)
    //admbox and item Section end *****************************************************************************



    //attender section start *******************************************************************************
    getShiftReserve(false);
    //attender section end *******************************************************************************


    //SHABAD Section start *******************************************************************************
    shabadSectionConfig(null)
    //SHABAD Section end *******************************************************************************


    //DiagAdmissionForm section start *************************************************************************
    if (admissionTypeId == 2)
        diagAdmissionConfig(null)
    //DiagAdmissionForm section end *************************************************************************

    //INSURER section start *************************************************************************
    if (admissionTypeId == 2)
        $("#basicInsurerBookletPageNo").val("")
    //INSURER section end *************************************************************************

    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))

    editModeAdmissionMaster(admissionTypeId, false)

    setTimeout(() => {

        if (admissionTypeId == 1)
            $("ItemId").select2("focus")
        else
            $("#serviceId").select2("focus")
    }, 50)
}

async function configFormByOprACTION(admissionMasterId, opr) {
    getAdmissionsList(admissionMasterId)

    let currentTab = $("#servicePart a").hasClass("active")
    afterAddOrDeleteTempServiceOrItem(currentTab)
}

function getAdmissionMasterActionId(admissionMasterId) {

    let getAdmissionMasterActionUrl = `${viewData_baseUrl_MC}/AdmissionMasterApi/getaction/${admissionMasterId}`

    $.ajax({
        url: getAdmissionMasterActionUrl,
        type: "get",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {
            if (checkResponse(result))
                $("#masterActionId").val(result)
            else
                $("#masterActionId").val("")

        },
        error: function (xhr) {
            error_handler(xhr, getAdmissionMasterActionUrl);
        }
    });
}

function admbox(admissionMasterInfo, admissionMasterId) {

    getAdmissionMasterActionId(admissionMasterId)

    if (checkResponse(admissionMasterInfo) && admissionMasterInfo.length > 0) {
        $("#masterDateTime").val(admissionMasterInfo[0].masterCreateDateTimePersian);
        $("#masterUserFullName").val(admissionMasterInfo[0].masterCreateUser);
        $("#masterStageName").val(admissionMasterInfo[0].masterStage);
        $("#masterWorkflowName").val(admissionMasterInfo[0].masterWorkflow);
        $("#masterActionName").val(admissionMasterInfo[0].masterActionIdName)
        //$("#masterActionId").val(admissionMasterInfo[0].masterActionId)
    }
    else {
        $("#admissionsMasterId").val("");
        $("#masterDateTime").val("");
        $("#masterUserFullName").val("");
        $("#masterStageName").val("");
        $("#masterWorkflowName").val("");
        $("#masterActionName").val("")
        //$("#masterActionId").val("")
    }
}

function serviceAndItemSectionConfig(admissionInfo, admissionTypeId) {

    if (admissionTypeId == 1) {

        arr_tempItem = [];
        $("#ItemId").val(0).trigger("change")

        if (checkResponse(admissionInfo) && checkResponse(admissionInfo.admissionLineList)) {
            if (admissionInfo.admissionLineList.length > 0) {
                var modelServiceLine = null,
                    admLineLen = admissionInfo.admissionLineList.length;

                $("#tempItem").html("");
                $("#sumRowItem").addClass("displaynone");
                for (var q = 0; q < admLineLen; q++) {

                    var adsl = admissionInfo.admissionLineList[q];

                    modelServiceLine = {
                        rowNumber: q + 1,
                        itemId: adsl.itemId,
                        itemName: adsl.itemId + "-" + adsl.itemName,
                        attributeIds: adsl.attributeIds,
                        qty: adsl.qty,
                        discountAmount: adsl.discountAmount,
                        basicShareAmount: adsl.basicShareAmount,
                        compShareAmount: adsl.compShareAmount,
                        thirdPartyAmount: adsl.thirdPartyAmount,
                        patientShareAmount: adsl.patientShareAmount,
                        netAmount: adsl.netAmount,
                        contractTypeId: adsl.contractTypeId,
                        priceTypeId: adsl.priceTypeId,
                        vendorCommissionAmount: adsl.vendorCommissionAmount,
                        vendorId: adsl.vendorId,
                        basicPrice: adsl.basicPrice,
                        basicItemPrice: adsl.basicItemPrice,
                        basicPercentage: adsl.basicPercentage,
                        basicCalculationMethodId: adsl.basicCalculationMethodId,
                        compPrice: adsl.compPrice,
                        compItemPrice: adsl.compItemPrice,
                        compPercentage: adsl.compPercentage,
                        compCalculationMethodId: adsl.compCalculationMethodId,
                        thirdPartyPrice: adsl.thirdPartyPrice,
                        thirdPartyItemPrice: adsl.thirdPartyItemPrice,
                        thirdPartyPercentage: adsl.thirdPartyPercentage,
                        thirdPartyCalculationMethodId: adsl.thirdPartyCalculationMethodId,
                        discountPrice: adsl.discountPrice,
                        discountItemPrice: adsl.discountItemPrice,
                        discountPercentage: adsl.discountPercentage,
                        discountCalculationMethodId: adsl.discountCalculationMethodId,
                        vATPercentage: adsl.vatPercentage,

                        penaltyId: null,
                        penaltyAmount: 0
                    };

                    arr_tempItem.push(modelServiceLine);

                    appendItem(modelServiceLine);
                }

                $("#tempItem tr").first().addClass("highlight")

            }
        }
        else {
            $("#tempItem").html(`<tr id="emptyRow"><td colspan="11" style="text-align:center">سطری وجود ندارد</td></tr>`);
            $("#sumRowService").addClass("displaynone");
            $("#sumRowItem").addClass("displaynone");
            $("#itemBoxNetAmount").text(0)
        }

    }
    else {
        arr_tempService = [];
        $("#serviceId").val(0).trigger("change")
        if (checkResponse(admissionInfo) && checkResponse(admissionInfo.admissionLineList)) {
            if (admissionInfo.admissionLineList.length > 0) {
                var modelServiceLine = null,
                    admLineLen = admissionInfo.admissionLineList.length;

                $("#tempService").html("");
                $("#sumRowService").addClass("displaynone");
                for (var q = 0; q < admLineLen; q++) {

                    var adsl = admissionInfo.admissionLineList[q];

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

                $("#tempService tr").first().addClass("highlight")
            }
        }
        else {
            $("#tempService").html(`<tr id="emptyRow"><td colspan="13" class="text-center">سطری وجود ندارد</td></tr>`)
            $("#sumRowService").addClass("displaynone");
            $("#sumRowItem").addClass("displaynone");
            $("#serviceBoxNetAmount").text(0)
        }
    }
}

function attenderSectionConfig(admissionInfo, admissionTypeId = null) {

    if (checkResponse(admissionInfo)) {

        if (admissionTypeId != 1) {
            $("#attenderId").val(admissionInfo.attenderId).prop("disabled", true).trigger("change.select2");

            $("#serviceId").empty();
            resetAdmCalPrice();
            fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getdropdown`, "serviceId", true, admissionInfo.attenderId, false, 3, "انتخاب خدمت");
            getAttenderInfo(admissionInfo.attenderId);
            //getShiftReserve(false);


            if (admissionInfo.referringDoctorId !== 0) {
                var refDoctorOption = new Option(`${admissionInfo.referringDoctorId} - ${admissionInfo.referringDoctorName} - ${admissionInfo.referringDoctorMsc}`, admissionInfo.referringDoctorId, true, true);
                $("#referringDoctorId").append(refDoctorOption).trigger('change.select2');
            }
            $("#referringDoctorId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0)
            fillReserveShift([{
                id: admissionInfo.reserveShiftId,
                text: `${admissionInfo.reserveShiftId} - ${admissionInfo.reserveShiftName}`
            }])

            admissionReserveDateTimePersian = `${admissionInfo.reserveTime} ${admissionInfo.reserveDatePersian}`;

            $("#reserveNo").val(admissionInfo.reserveNo);
            $("#reserveDate").val(admissionReserveDateTimePersian);
            $("#scheduleBlockId").val(admissionInfo.attenderScheduleBlockId)
            $("#prescriptionDate").val(admissionInfo.prescriptionDatePersian).prop("disabled", true);
        }
    }
    else {
        $("#attenderId").val(0).prop("disabled", false).trigger("change");
        //$("#reserveShift").val(0).trigger("change");
        fillReserveShift([])
        $("#referringDoctorId").val("").prop("disabled", false)
        if (+$("#referringDoctorId").val() != 0)
            $("#prescriptionDate").val("").prop("disabled", false)
        else
            $("#prescriptionDate").val("").prop("disabled", true)
        $("#reserveNo").val("");
        $("#reserveDate").val("");
        $("#scheduleBlockId").val("")
    }
}

function patientSectionConfig(admissionInfo, admissionTypeId) {
    //dropdowncachedata.basicinsurerlineid = admissionInfo.basicinsurerlineid
    //dropdowncachedata.basicinsurerlinename = admissionInfo.basicinsurerlinename

    if (checkResponse(admissionInfo)) {
        $("#patientId").val(admissionInfo.patientId);
        $("#referralTypeId").val(admissionInfo.referralTypeId).trigger("change").prop("disabled", true);
        $("#nationalCode").val(admissionInfo.nationalCode).prop("disabled", true);
        $("#getPatientInfoWS").prop("disabled", true);
        $("#getPersobByBirthWS").prop("disabled", true);
        $("#firstName").val(admissionInfo.firstName).prop("disabled", true);
        $("#lastName").val(admissionInfo.lastName).prop("disabled", true);
        $("#birthDatePersian").val(admissionInfo.birthDatePersian).prop("disabled", true);
        $("#genderId").val(admissionInfo.genderId).trigger("change")
        $("#countryId").val(admissionInfo.countryId).trigger("change")
        $("#mobile").val(admissionInfo.mobileNo)
        $("#address").val(admissionInfo.address)
        $("#description").val(admissionInfo.description)
        $("#idCardNumber").val(admissionInfo.idCardNumber)
        $("#postalCode").val(admissionInfo.postalCode)
        $("#jobTitle").val(admissionInfo.jobTitle)
        $("#phoneNo").val(admissionInfo.phoneNo)
        $("#maritalStatusId").val(admissionInfo.maritalStatusId).trigger("change")
        $("#educationLevelId").val(admissionInfo.educationLevelId).trigger("change")
        $("#fatherFirstName").val(admissionInfo.patientFatherFirstName)
        $("#searchPatient").prop("disabled", true)
    }
    else {
        $("#patientId").val("");
        $("#referralTypeId").val(1).trigger("change").prop("disabled", false);
        $("#nationalcode").val("").prop("disabled", false);
        $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
        $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
        $("#firstName").val("").prop("disabled", false);
        $("#lastName").val("").prop("disabled", false);
        $("#birthDatePersian").val("").prop("disabled", true);
        $("#genderId").val(0).trigger("change")
        $("#countryId").val(101).trigger("change")
        $("#mobile").val("")
        $("#address").val("")
        $("#description").val("")
        $("#idcardNumber").val("")
        $("#postalCode").val("")
        $("#jobTitle").val("")
        $("#phoneNo").val("")
        $("#maritalStatusId").val(0).trigger("change")
        $("#educationLevelId").val(0).trigger("change")
        $("#fatherFirstName").val("")
        $("#searchPatient").prop("disabled", false)
    }
}

function insurerSectionConfig(admissionInfo) {

    if (checkResponse(admissionInfo)) {

        if (admissionInfo.basicInsurerLineId === "")
            $("#basicInsurerLineId").val("1-73").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");
        else
            $("#basicInsurerLineId").val(`1-${admissionInfo.basicInsurerLineId}`).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");


        if (admissionInfo.compInsurerLineId != 0)
            $("#compInsurerThirdPartyId").val(`2-${admissionInfo.compInsurerLineId}-${admissionInfo.compInsurerId}`).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");
        else if (admissionInfo.thirdPartyInsurerId != 0)
            $("#compInsurerThirdPartyId").val(`4-${admissionInfo.thirdPartyInsurerId}`).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");
        else
            $("#compInsurerThirdPartyId").val(0).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");


        if (admissionInfo.discountInsurerId != 0)
            $("#discountInsurerId").val(`5-${admissionInfo.discountInsurerId}`).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");
        else
            $("#discountInsurerId").val(0).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0).trigger("change");


        $("#basicInsurerNo").val(admissionInfo.basicInsurerNo).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);
        $("#basicInsurerExpirationDatePersian").val(admissionInfo.basicInsurerExpirationDatePersian).prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);
        $("#basicInsurerBookletPageNo").val(admissionInfo.basicInsurerBookletPageNo).prop("disabled", (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) || $("#admnId").val() != "")
    }
    else {
        $("#basicInsurerLineId").prop("disabled", false)
        $("#compInsurerThirdPartyId").prop("disabled", false)
        $("#discountInsurerId").prop("disabled", false)

        if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
            $("#basicInsurerNo").val('').prop("disabled", true);
            $("#basicInsurerBookletPageNo").val('').prop("disabled", true);
            $("#basicInsurerExpirationDatePersian").val('').prop("disabled", true);
        }
        else {
            $("#basicInsurerNo").val('').prop("disabled", false);
            $("#basicInsurerBookletPageNo").val('').prop("disabled", false);
            $("#basicInsurerExpirationDatePersian").val('').prop("disabled", false);
        }
    }
}

function diagAdmissionConfig(admissionInfo) {

    if (checkResponse(admissionInfo)) {
        if (admissionInfo.reasonForEncounterId !== 0) {
            let tempReasonEncounterAppend = null;
            $("#reasonForEncounterId").val(admissionInfo.reasonForEncounterId);
            tempReasonEncounterAppend = new Option(`${admissionInfo.reasonForEncounterId} - ${admissionInfo.reasonForEncounterName} - ${admissionInfo.reasonForEncounterCode}`, admissionInfo.reasonForEncounterId, true, true);
            $("#reasonForEncounterId").append(tempReasonEncounterAppend).trigger('change');
        }

        if (checkResponse(admissionInfo.responsibleNationalCode))
            patientInsurer.responsibleNationalCode = admissionInfo.responsibleNationalCode

        if (checkResponse(admissionInfo.relationType))
            patientInsurer.relationType = admissionInfo.relationType

        if (checkResponse(admissionInfo.covered))
            patientInsurer.covered = admissionInfo.covered

        if (checkResponse(admissionInfo.recommendationMessage))
            patientInsurer.recommendationMessage = admissionInfo.recommendationMessage

        if (checkResponse(admissionInfo.admissionDiagnosisList))
            if (admissionInfo.admissionDiagnosisList.length !== 0)
                $(".diagnosis-filed").prop("disabled", true);

        fillDiagnosis(admissionInfo.admissionDiagnosisList);
    }
    else {

        $(".diagnosis-filed").prop("disabled", false);
        arr_TempDiagnosis = []
        $("#tempDiagForm").html(`<tr id="emptyRow"><td colspan="6" class="text-center">سطری وجود ندارد</td></tr>`)
    }
}

function shabadSectionConfig(admissionInfo) {

    //$("#attenderHID").val(ad.hid);
    //$("#hidonline").prop("checked", ad.hidOnline).trigger("change");
    //$("#refferingHID").val(ad.referredHID == null ? "" : ad.referredHID);
    //$("#editSectionShabad").prop("disabled", HIDOnline);
    //$("#eliminateReasonId").prop("disabled", true);
    //$("#editSectionPatient").prop("disabled", true).css("visibility", "hidden");
    //$("#getAttenderHID").prop("disabled", true);

    if (checkResponse(admissionInfo)) {
        HIDIdentity = admissionInfo.hid == undefined ? "" : admissionInfo.hid;
        inqueryID = admissionInfo.inqueryID == undefined ? 0 : admissionInfo.inqueryID;
        HIDOnline = admissionInfo.hidOnline == admissionInfo.hidOnline ? false : admissionInfo.hidOnline;
    }
    else {
        HIDIdentity = ""
        inqueryID = 0
        HIDOnline = false
    }

}

function trOnclickAdmissionsList(row, tabelId, ev) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#admL${row}`).addClass("highlight");
    $(`#${tabelId} tr#admL${row}`).focus();
}

function trOnkeydownAdmissionList(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row - 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row - 1}`).addClass("highlight");
            $(`#${tabelId} tr#admL${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row + 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row + 1}`).addClass("highlight");
            $(`#${tabelId} tr#admL${row + 1}`).focus();
        }
    }
}

function runBtnDisplayAdmission(admissionMasterId, admissionId, rowNo, e) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)

}

function runBtnPrintAdmission(admissionId, rowNo, e) {

    let stageId = +$(`#admissionsList  tbody tr#admL${rowNo}`).data("stageid");
    let workflowId = +$(`#admissionsList  tbody tr#admL${rowNo}`).data("workflowid");
    let medicalrevenue = +$(`#admissionsList  tbody tr#admL${rowNo}`).data("medicalrevenue");
    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId
    let checkController = admissionTypeId === 1 ? "AdmissionItemApi" : "AdmissionApi"

    var check = controller_check_authorize(checkController, "PRN");
    if (!check)
        return;

    $("#modal_keyid_value").text(admissionId);

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

function runBtnEditAdmission(admissionId, rowNo, e) {

    if ($(".editFlag i:not(.d-none)").length > 0) {

        let lastEditRowAdmissionId = $(".editFlag i:not(.d-none)").parents("tr").data("id")

        let currentMassage = `شناسه درخواست ${lastEditRowAdmissionId} در حالت ویرایش می باشد ، در صورت تایید اطلاعات ویرایش شده حذف می شوند!!`

        alertify.confirm('اخطار', currentMassage,
            function () {

                accessEditAdmission(admissionId, rowNo)

            },
            function () {

                //var msg = alertify.error('انصراف از دریافت نوبت اضافه');
                //msg.delay(admission.delay);
            }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        accessEditAdmission(admissionId, rowNo)
    }

}

function accessEditAdmission(admissionId, rowNo) {

    let editFlag = $(`#admissionsList #admLEdit${rowNo} i`)
    let currentRow = $(`#admissionsList #admL${rowNo}`)
    let workflowId = currentRow.data("workflowid")
    let stageId = currentRow.data("stageid")
    let actionId = currentRow.data("actionid")

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId
    let currentViewData_controllername = admissionTypeId == 1 ? "AdmissionItemApi" : "AdmissionApi"
    let admissionMasterId = +$("#admissionsMasterId").val()

    $("#admnId").val("")

    var check = controller_check_authorize(currentViewData_controllername, "UPD");
    if (!check)
        return;

    let resultOpenCash = checkOpenCash(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق  پذیرش امکان ویرایش نمی باشد").delay(admission.delay);
        return;
    }

    let check11 = checkCounter()
    if (!check11.successfull) {
        var msg = alertify.warning(check11.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    let stageAction = getStageAction(workflowId, stageId, actionId, 0);
    if (stageAction.isDataEntry != 1 || stageAction.medicalRevenue != 1) {
        var msgUpdate = alertify.warning("امکان ویرایش پذیرش وجود ندارد");
        msgUpdate.delay(admission.delay);
        return;
    }


    $(".editFlag i").addClass("d-none")
    $(".cancelEdit").prop("disabled", false)

    setTimeout(() => {
        editFlag.removeClass("d-none")
    }, 10)

    admissionMatserFormConfig(admissionMasterId, "EDITR", () => {
        return { admissionTypeId, workflowId, stageId, actionId, admissionId }
    })

}

function cancelEdit() {

    $(".cancelEdit").prop("disabled", true)
    $(".editFlag i").addClass("d-none")

    let currentTab = $("#servicePart a").hasClass("active")

    if (currentTab)
        serviceAndItemSectionConfig(null, 2)
    else
        serviceAndItemSectionConfig(null, 1)

    $("#admnId").val("")
    $("#reserveNo").val("")
    $("#reserveDate").val("")
    $("#scheduleBlockId").val("")
    getShiftReserve(false);

    HIDIdentity = ""
    inqueryID = 0
    HIDOnline = false
    actionIdOnEdit = 0
    editModeAdmissionMaster(null, false)

    afterAddOrDeleteTempServiceOrItem(currentTab)


    if (currentTab)
        $("#serviceId").select2("focus")
    else
        $("#ItemId").select2("focus")

}

function runBtnChangeAction(admissionId, row) {

    if ($(".editFlag i:not(.d-none)").length > 0) {

        let lastEditRowAdmissionId = $(".editFlag i:not(.d-none)").parents("tr").data("id")

        let currentMassage = `شناسه درخواست ${lastEditRowAdmissionId} در حالت ویرایش می باشد ، در صورت تایید اطلاعات ویرایش شده حذف می شوند!!`

        alertify.confirm('اخطار', currentMassage,
            function () {
                accessChangeAction(admissionId, row)
            },
            function () {

            }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        accessChangeAction(admissionId, row)
    }

}

function accessChangeAction(admissionId, row) {

    $(".cancelEdit").prop("disabled", true)
    $(".editFlag i").addClass("d-none")

    let currentTab = $("#servicePart a").hasClass("active")

    if (currentTab)
        serviceAndItemSectionConfig(null, 2)
    else
        serviceAndItemSectionConfig(null, 1)

    $("#admnId").val("")

    HIDIdentity = ""
    inqueryID = 0
    HIDOnline = false
    actionIdOnEdit = 0

    stageActionLogCurrent = {}

    let actionId = +$(`#admissionsListTable  tbody tr#admL${row}`).data("actionid")
    let centralId = (+$(`#admissionsListTable  tbody tr#admL${row}`).data("centralid") == null ? 0 : +$(`#admissionsListTable  tbody tr#admL${row}`).data("centralid"))
    let stageId = +$(`#admissionsListTable  tbody tr#admL${row}`).data("stageid")
    let workflowId = +$(`#admissionsListTable  tbody tr#admL${row}`).data("workflowid")
    let branchId = +$(`#admissionsListTable  tbody tr#admL${row}`).data("branchid")
    let patientId = +$(`#admissionsListTable  tbody tr#admL${row}`).data("patientid")
    let admissionMasterId = +$("#admissionsMasterId").val()
    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId
    stageActionLogCurrent = { actionId, stageId, workflowId, identityId: admissionId, admissionTypeId, branchId, admissionMasterId, patientId, currentActionId: actionId, centralId }

    actionLogAdmission();

    modal_show("actionLogModalAdmission");

}

function runBtnDeleteAdmission(admissionId, branchId, row) {

    if ($(".editFlag i:not(.d-none)").length > 0) {

        let lastEditRowAdmissionId = $(".editFlag i:not(.d-none)").parents("tr").data("id")

        let currentMassage = `شناسه درخواست ${lastEditRowAdmissionId} در حالت ویرایش می باشد ، در صورت تایید اطلاعات ویرایش شده حذف می شوند!!`

        alertify.confirm('اخطار', currentMassage,
            function () {
                accessDeleteAdmission(admissionId, branchId, row)
            },
            function () {

            }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        accessDeleteAdmission(admissionId, branchId, row)
    }
}

function accessDeleteAdmission(admissionId, branchId, row) {

    $(".cancelEdit").prop("disabled", true)
    $(".editFlag i").addClass("d-none")

    $("#admnId").val("")

    HIDIdentity = ""
    inqueryID = 0
    HIDOnline = false
    actionIdOnEdit = 0

    let rowElm = $(`#admissionsList tr#admL${row}`)
    let stageId = +rowElm.data("stageid");
    let workflowId = +rowElm.data("workflowid");
    let admissionMasterId = +rowElm.data("workflowid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    let url = ""

    if (admissionTypeId == 1)
        url = `api/MC/AdmissionItemApi/deleteadmissionitem/${admissionMasterId}/${admissionId}/${branchId}`
    else
        url = `api/MC/AdmissionApi/deleteadmissionservice/${admissionMasterId}/${admissionId}/${branchId}`

    $.ajax({
        url: url,
        type: "get",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {

            if (result.successfull) {
                var msg = alertify.success(result.StatusMessage);
                msg.delay(admission.delay);
                admissionMatserFormConfig(+$("#admissionsMasterId").val(), "DEL", () => { return admissionTypeId })
            }
            else {
                if (result.validationErrors !== null) {
                    generateErrorValidation(result.validationErrors);
                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function actionLogAdmission() {

    fillDropDownAction()

    stepLogAdmissionList()

}

function stepLogAdmissionList() {

    let getListUrl = `/api/WF/StageActionLogApi/getsteplist/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workflowId}`

    $.ajax({
        url: getListUrl,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            buildActionLogAdmissionList(result)
        },
        error: function (xhr) {
            error_handler(xhr, getListUrl);
        }
    });
}

function buildActionLogAdmissionList(result) {
    $("#stepLogRowsAdmission").html("")
    var dataList = result.data;
    var listlen = dataList == null ? 0 : dataList.length, trString;

    if (listlen != 0) {
        for (var i = 0; i < listlen; i++) {
            var data = dataList[i];
            trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
            $("#stepLogRowsAdmission").append(trString);
        }
    }
    else {
        $("#stepLogRowsAdmission").html(`<tr id="emptyRow"><td colspan="3" class="text-center">سطری وجود ندارد</td></tr>`);
    }

}

function fillDropDownAction() {

    $("#actionDropDown").empty()
    fill_select2(`/api/WF/StageActionApi/getdropdownactionlistbystage`, "actionDropDown", true, `${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workflowId}/1/0/null/14/true/null`, false, 3, "انتخاب");
    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change.select2")
}

function update_actionAdmission() {

    var requestActionId = +$("#actionDropDown").val();
    var identityId = +stageActionLogCurrent.identityId;
    var stageId = +stageActionLogCurrent.stageId;
    var branchId = +stageActionLogCurrent.branchId;
    var workFlowId = +stageActionLogCurrent.workflowId;
    var workflowCategoryId = +workflowCategoryIds.medicalMaster.id;
    var admissionMasterId = +stageActionLogCurrent.admissionMasterId;
    var centralId = +stageActionLogCurrent.centralId;
    var patientId = +stageActionLogCurrent.patientId;
    if (requestActionId == +stageActionLogCurrent.actionId)
        return;

    var model = {
        requestActionId,
        stageId,
        branchId,
        identityId,
        workFlowId,
        workflowCategoryId,
        admissionMasterId,
        centralId,
        patientId
    }

    loadingAsync(true, "update_action_btn");
    let resultValidate = admissionValidateStageActionLog(model);

    if (resultValidate != undefined) {
        if (resultValidate.length == 0)
            updateActionAdmission(model);
        else {
            alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
            $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change");

            loadingAsync(false, "update_action_btn");
        }
    }
}

function admissionValidateStageActionLog(model) {
    
    let outPut = ""
    let viewData_validateupdatestep_url = ""

    if (stageActionLogCurrent.admissionTypeId == 1)
        viewData_validateupdatestep_url = `/api/MC/AdmissionItemApi/validationadmissionsale/${model.admissionMasterId}`
    else
        viewData_validateupdatestep_url = `/api/MC/AdmissionApi/validationadmissionservice/${model.admissionMasterId}/${+stageActionLogCurrent.actionId}/${model.centralId}`

    let currentMedicalRevenue = getStepAction(model.workFlowId, model.stageId, +stageActionLogCurrent.actionId);
    let requestMedicalRevenue = getStepAction(model.workFlowId, model.stageId, model.requestActionId);

    if (model.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 2
        && requestMedicalRevenue.medicalRevenue == 1)) {
        alertify.warning("امکان برگشت مرجوع پذیرش وجود ندارد").delay(alertify_delay);
        return;
    }

    if (+stageActionLogCurrent.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 1
        && requestMedicalRevenue.medicalRevenue == 2)) {
        alertify.confirm('', "مرجوع پذیرش بیمار برگشت ندارد ; آیا از انجام آن اطمینان دارید ؟",
            function () {
                outPut = $.ajax({
                    url: viewData_validateupdatestep_url,
                    async: false,
                    cache: false,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(model),
                    success: function (result) {

                        if (result.length == 0)
                            updateActionAdmission(model);
                        else {
                            alertify.error(generateErrorString(result)).delay(alertify_delay);
                            $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change");

                            loadingAsync(false, "update_action_btn");
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, viewData_validateupdatestep_url);
                        return null;
                    }
                });
            },
            function () { var msg = alertify.error('انصراف از مرجوع'); msg.delay(alertify_delay); }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        outPut = $.ajax({
            url: viewData_validateupdatestep_url,
            async: false,
            cache: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: result => result,
            error: function (xhr) {
                error_handler(xhr, viewData_validateupdatestep_url);
                return null;
            }
        });
    }
    return outPut.responseJSON;
}
function getStepAction(workflowId, stageId, actionId) {

    let model = {
        workflowId: workflowId,
        stageId: stageId,
        actionId: actionId
    }

    let url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

function updateActionAdmission(model) {

    let viewData_updateAdmissionStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`

    if (model.requestActionId > 0) {

        $.ajax({
            url: viewData_updateAdmissionStep_url,
            async: true,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {

                    alertify.success(result.statusMessage);

                    stageActionLogCurrent.actionId = model.requestActionId;

                    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change")

                    updatelastaction()
                        .then(() => {
                            stepLogAdmissionList()

                            admissionMatserFormConfig(+$("#admissionsMasterId").val(), "STEP")

                            loadingAsync(false, "update_action_btn");
                        })
                        .catch(err => {
                            loadingAsync(false, "update_action_btn")
                        })

                }
                else {
                    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change")
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    loadingAsync(false, "update_action_btn");
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateTreasuryStep_url);

                loadingAsync(false, "update_action_btn");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);

        loadingAsync(false, "update_action_btn");
    }

}

async function updatelastaction() {

    let updatelastaction_url = ""

    if (stageActionLogCurrent.admissionTypeId == 1)
        updatelastaction_url = `/api/MC/AdmissionItemApi/updatelastaction/${stageActionLogCurrent.admissionMasterId}/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.actionId}`
    else
        updatelastaction_url = `/api/MC/AdmissionApi/updatelastaction/${stageActionLogCurrent.admissionMasterId}/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.currentActionId}/${stageActionLogCurrent.actionId}/${stageActionLogCurrent.patientId}`

    $.ajax({
        url: updatelastaction_url,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, updatelastaction_url);
        }
    });
}

$("#stepLogModalAdmission").on("hidden.bs.modal", function () {
    stageActionLogCurrent = {};
});
//ADMISSION LIST SECTION END ****************************************************************





//ATTENDER SECTION START ****************************************************************
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

async function getShiftReserve(attenderOrInsert) {

    $("#reserveNo").val("");
    $("#reserveDate").val("");
    $("#scheduleBlockId").val("")

    var attenderId = +$("#attenderId").val();
    if (attenderId === 0) return;

    let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime()
    let attenderTimeShiftList = await getAttenderTimeShiftList(attenderId, userInfoLogin.branchId, currentDate, currentTime, false)
    medicalTimeShiftId = attenderTimeShiftList.length > 0 ? attenderTimeShiftList[0].id : null;

    fillReserveShift(attenderTimeShiftList);

    if (!checkResponse(attenderTimeShiftList) || attenderTimeShiftList.length == 0) {
        var msg = alertify.warning(" این داکتر  برای روز جاری نوبت ندارد");
        msg.delay(admission.delay);
        $(`#temptimeShiftDaysAdmissionMaster`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
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
        if (attenderOrInsert) {

            var msg = alertify.warning(reserve['statusMessage']);
            msg.delay(admission.delay);

            setTimeout(function () {
                if ($("#referralTypeId").prop("disabled"))
                    $("#genderId").select2("focus")
                else
                    $("#referralTypeId").select2("focus");
            }, 1);

        }
        else {
            setTimeout(function () {
                if ($("#referralTypeId").prop("disabled")) {
                    if ($("#servicePart a").hasClass("isActive"))
                        $("#serviceId").select2("focus")
                    else
                        $("#ItemId").select2("focus")
                }
                else
                    $("#referralTypeId").select2("focus");
            }, 1);
        }

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
            fillTimeShiftDaysAdmissionMaster(result.data);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }


    });
}

function fillTimeShiftDaysAdmissionMaster(data) {
    $(`#temptimeShiftDaysAdmissionMaster`).html("");
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
                     <td  colspan="5" style="text-align:center" >سطری یافت نشد</td>
                   </tr>`;

    }


    $(`#temptimeShiftDaysAdmissionMaster`).html(output);

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
    else {
        insurExpDateValid = !disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)
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
        $(`#temptimeShiftDaysAdmissionMaster`).html(`<tr><td  colspan="5" style="text-align:center">سطری یافت نشد</td></tr>`);
    }

    getShiftReserve(true);

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
    if (!$("#referralTypeId").prop("disabled"))
        $("#referralTypeId").select2("focus");
    else if (!$("#basicInsurerLineId").prop("disabled"))
        $("#basicInsurerLineId").select2("focus")
    else {
        if ($("#servicePart a").hasClass("active"))
            $("#serviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    }
});
//ATTENDER SECTION END ****************************************************************





//PATIENT SECTION START ****************************************************************
function searchPatient() {
    $("#tempPatient").html(fillEmptyRow(18));
    displayCountRowModal(0, "searchPatientModal");
    modal_show("searchPatientModal");
}

async function setPatientInfo(id, referralTypeId, basicInsurerLineId,
    nationalCode, basicInsurerNo, basicInsurerExpirationDatePersian, firstName, lastName, birthDatePersian, genderId, countryId,
    compInsurerLineId, compInsurerId, thirdPartyInsurerId, mobileNo, address, description, idCardNumber, postalCode, jobTitle, phoneNo, maritalStatusId, fatherFirstName, educationLevelId, discountInsurerId) {


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

function resetPatientInfo(opr) {

    tempServiceLength = arr_tempService.length;


    $("#userTypeOnOff").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0 || admissionListCount > 0)

    // ATTENDER SETION START ****************************************************
    $("#attenderId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0);
    $("#referringDoctorId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0);
    // ATTENDER SETION END ****************************************************

    $("#referralTypeId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0 || admissionListCount > 0)


    $("#basicInsurerLineId").prop("disabled", tempServiceLength > 0).select2("focus");
    $("#compInsurerThirdPartyId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0)
    $("#discountInsurerId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0)

    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0);
        $("#basicInsurerExpirationDatePersian").prop("disabled", false);
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
    }

    if (+$("#referralTypeId").val() !== 2)
        $("#nationalCode").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0 || admissionListCount > 0);


    $("#firstName").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0 || admissionListCount > 0);
    $("#lastName").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0 || admissionListCount > 0);
    $("#genderId").prop("disabled", tempServiceLength > 0 || arr_tempItem.length > 0);

    if ($("#referralTypeId").val() == 2) {
        $("#getPatientInfoWS").prop("disabled", true);
        $("#getPersobByBirthWS").prop("disabled", true);
        $("#searchPatient").prop("disabled", true);

    }
    else {
        $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked") || admissionListCount > 0);
        $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked") || admissionListCount > 0);
        $("#searchPatient").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0);
    }


    if (+$("#referralTypeId").val() == 2) {
        $("#nationalCode").val("").prop("disabled", true).blur();
        $("#basicInsurerExpirationDatePersian").val("").prop("disabled", true);
        $("#basicInsurerLineId").val("1-73").prop("disabled", true).trigger("change");
        $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", true).trigger("change");
        setTimeout(() => $("#firstName").focus(), 5);
    }

    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);

    $("#basicInsurerBookletPageNo").prop("disabled", (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) || $("#admnId").val() != "")

    if (+$("#referringDoctorId").val() !== 0) {
        $("#prescriptionDate").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);
    }

    loadingDoneCallUp();
    loadingDonePersonByBirth();
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

                // اگر بیمه داشت
                if (data.insurances !== null) {

                    insurancesList = data.insurances;

                    // اگر تعداد بیمه صفر بود
                    if (data.insurances.length === 0) {
                        afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
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
                            //$("#editSectionPatient").prop("disabled", false);
                            $("#countryId").select2("focus");
                        }
                        else {
                            afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
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
                    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
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

                    //$("#editSectionPatient").prop("disabled", false);
                    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
                    return;
                }
                if (resultPatientIdentity.status === -105) {
                    $("#basicInsurerLineId").val("1-73").trigger("change");
                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    loadingDoneCallUp();

                    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
                }
                else if (resultPatientIdentity.status === -103) {
                    var messagePatientResult = alertify.warning(resultPatientIdentity.statusMessage);
                    messagePatientResult.delay(alertify_delay);
                    loadingDoneCallUp();

                    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
                }
                else {
                    afterAddOrDeleteTempServiceOrItem($("#servicePart a").hasClass("active"))
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

function birthYearKeydown(e) {
    if (e.keyCode === KeyCode.Enter) {
        e.stopPropagation();
        e.preventDefault();
        getPersobByBirthWS();
    }
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

    $("#getPersobByBirthWS").prop("disabled", true);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS i").addClass(`fa-spinner fa-spin`).removeClass(`fa-users`);

    setTimeout(() => {
        getPersonByBirthWS($("#nationalCode").val(), +$("#birthYear").val());
    }, 10);
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
                //$("#editSectionPatient").prop("disabled", false);
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

function tabkeyDownDescription(e) {
    if ([KeyCode.Tab, KeyCode.Enter].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#basicInsurerBookletPageNo").focus();
    }

}

function setPatientInsurer(rowNumber) {

    patientInsurer = insurancesList.find(i => i.rowNumber === rowNumber);
    inqueryID = patientInsurer.inquiryId;

    $("#basicInsurerLineId").val(`1-${patientInsurer.basicInsurerLineId}`).trigger("change").prop("disabled", true);
    $("#basicInsurerExpirationDatePersian").val(patientInsurer.expireDate).prop("disabled", true);
    $("#basicInsurerNo").val(patientInsurer.insuranceNumber).prop("disabled", true);
    $("#workshopName").val(patientInsurer.workShopName);
    //$("#editSectionPatient").prop("disabled", false);
    $("#getPatientInfoWS").prop("disabled", true);
    $("#getPersobByBirthWS").prop("disabled", true);

    modal_close("patientInsuranceModal");

    $("#countryId").select2("focus");
}

async function setPatientInsurerInfo(basicInsurerLineId, basicInsurerNo, basicInsurerExpirationDatePersian, compInsurerLineId, compInsurerId, thirdPartyInsurerId, discountInsurerId) {


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


    $("#basicInsurerExpirationDatePersian").val(basicInsurerExpirationDatePersian == null ? "" : basicInsurerExpirationDatePersian);
    $("#basicInsurerNo").val(basicInsurerNo == null ? "" : basicInsurerNo);

    modal_close("searchPatientInsurerModal");

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

function birthYearcclick(e) {
    e.stopPropagation();
    e.preventDefault();
    $(e.currentTarget).select();
}

function patientSearch(model, isAdmissionSale = false, isTamin = false) {

    let url = "";

    if (isAdmissionSale)
        url = `${viewData_baseUrl_MC}/PatientApi/patientsearchsale`;
    else
        url = `${viewData_baseUrl_MC}/PatientApi/patientsearchservice`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            fillPatientSearch(result, false, isTamin);
            callSearchPatient = false;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function setInsurerInfo(insurerTypeId, isurerId) {

    if (insurerTypeId == 1) {
        let basicInsurerLineTypeId = insurerTypeId
        let basicInsurerLineId = isurerId

        let itemOrService = $("#servicePart a").hasClass("active")

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
            $("#basicInsurerExpirationDatePersian").val(itemOrService ? getlastdayofyear : "");
            $("#basicInsurerNo").prop("disabled", !itemOrService);
            $("#basicInsurerBookletPageNo").prop("disabled", !itemOrService);
            $("#basicInsurerExpirationDatePersian").prop("disabled", !itemOrService);

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

$("#referralTypeId").on("change", function () {

    var patientRefId = +$(this).val();
    $("#basicInsurerLineId").html("")

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/${patientRefId}`)

    $("#nationalCode").prop("disabled", false);
    $("#getPatientInfoWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
    $("#getPersobByBirthWS").prop("disabled", $("#userTypeOnOff").prop("checked"));
    if (admissionListCount == 0)
        $("#searchPatient").prop("disabled", false);


    $("#basicInsurerLineId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    $("#compInsurerThirdPartyId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    $("#discountInsurerId").prop("selectedIndex", 0).prop("disabled", false).trigger("change");

    checkInsurerTamin(patientRefId);
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
                $("#description").val(result.description);
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

$("#getPatientInfoWS").on("click", function () {

    if (!$('#userTypeOnOff').prop("checked")) {

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

$("#searchPatientModal").on("hidden.bs.modal", async function () {
    if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode))
        if ($("#servicePart a").hasClass("active"))
            $("#serviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    else {
        $("#basicInsurerNo").focus()
    }
});

$("#searchPatientModal").on("shown.bs.modal", function () {

    resetSearchPatient();
    $("#ItemOrService").val(2).trigger("change.select2")
    $(`#tempPatient #p_0`).addClass("highlight");
    $(`#tempPatient #p_0 > td > button`).focus();
});

$("#searchPatientInsurerModal").on("hidden.bs.modal", async function () {
    if (disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode))
        if ($("#servicePart a").hasClass("active"))
            $("#serviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    else {
        $("#basicInsurerNo").focus()
    }
});

$("#searchPatientInsurerModal").on("shown.bs.modal", function () {
    $(`#tempPatientI #pI_0`).addClass("highlight");
    $(`#tempPatientI #pI_0 > td > button`).focus();
});

$("#ItemOrService").on("change", function () {
    $("#searchPatientAdmission").click()
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
    let itemOrService = +$("#ItemOrService").val()

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
        patientFullName: $("#searchPatientFullName").val().trim(),
        patientNationalCode: $("#searchPatientNationalCode").val(),
        mobileNo: $("#searchPatientMobileNo").val(),
        insurNo: $("#searchPatientBasicInsurerNo").val().trim(),
        insurerLineId: basicInsurerLineId,
        compInsurerLineId: +compInsurerLineId,
        thirdPartyInsurerId: +thirdPartyInsurerId,
        discountInsurerId: +discountInsurerId,
        includeUnknown: 2
    }

    patientSearch(patientSearchModel, itemOrService == 1 ? true : false);
});

$("#basicInsurerBookletPageNo").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter) {
        e.preventDefault();
        e.stopPropagation();

        let currentActiveTab = $("#tabActionBox a.active").parent().prop("id")
        if (currentActiveTab == "servicePart")
            $("#serviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    }

})
//PATIENT SECTION END ****************************************************************





//INSURER SECTION START ****************************************************************
$("#basicInsurerLineId").on("change", function () {

    //resetShabadElements();

    let basicInsurerLineId = $(this).val()
    let basicInsurerLineTypeId = ""

    HIDIdentity = "";
    HIDOnline = false;

    if (checkResponse(basicInsurerLineId) && basicInsurerLineId !== 0) {

        basicInsurerLineTypeId = +basicInsurerLineId.split("-")[0]
        basicInsurerLineId = +basicInsurerLineId.split("-")[1]

        setInsurerInfo(basicInsurerLineTypeId, basicInsurerLineId)

        admissionCalPrice();
        itemCalPrice()
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

    admissionCalPrice()
    itemCalPrice()
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

    admissionCalPrice();
    itemCalPrice()
});
//INSURER SECTION END ****************************************************************





//SERVICE SECTION START ****************************************************************
function resetService() {
    $("#serviceForm input.form-control").val("");
    $("#serviceForm .select2").val("").trigger("change");
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

    if (!attenderScheduleValid && ($("#reserveNo").val() === "" && $("#reserveDate").val() === "" && $("#reserveShift").val() == "0" && $("#scheduleBlockId").val() === "")) {
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

    if (+$("#qtyService").val() === 0) {
        $("#qtyService").focus();
        msg_s = alertify.warning(admission.notHasQty);
        msg_s.delay(admission.delay);
        return;
    }
    else if (+$("#qtyService").val() > 200) {
        $("#qtyService").focus();
        msg_s = alertify.warning("200");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceServiceModel == undefined || calPriceServiceModel.netAmount < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        return;
    }


    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد، امکان افزودن خدمت ندارد.");
        msg_s.delay(admission.delay);
        return;
    }


    if (calPriceServiceModel.basicServicePrice == 0 &&
        calPriceServiceModel.basicPrice == 0 &&
        calPriceServiceModel.basicShareAmount == 0 &&
        calPriceServiceModel.compShareAmount == 0 &&
        calPriceServiceModel.netAmount == 0) {

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
        qty: +$("#qtyService").val(),
        serviceName: $("#serviceId").select2('data').length > 0 ? $("#serviceId").select2('data')[0].text : "",

        basicServicePrice: +calPriceServiceModel.basicServicePrice,
        basicPrice: +calPriceServiceModel.basicPrice,
        basicShareAmount: +calPriceServiceModel.basicShareAmount,
        basicPercentage: +calPriceServiceModel.basicPercentage,//do not display
        basicCalculationMethodId: +calPriceServiceModel.basicCalculationMethodId, //do not display

        compServicePrice: +calPriceServiceModel.compServicePrice,
        compPrice: +calPriceServiceModel.compPrice,
        compShareAmount: +calPriceServiceModel.compShareAmount,
        compPercentage: +calPriceServiceModel.compPercentage,//do not display
        compCalculationMethodId: +calPriceServiceModel.compCalculationMethodId,//do not display

        thirdPartyPrice: +calPriceServiceModel.thirdPartyPrice,
        thirdPartyServicePrice: +calPriceServiceModel.thirdPartyServicePrice,
        thirdPartyAmount: +calPriceServiceModel.thirdPartyAmount,
        thirdPartyPercentage: +calPriceServiceModel.thirdPartyPercentage,//do not display
        thirdPartyCalculationMethodId: +calPriceServiceModel.thirdPartyCalculationMethodId,//do not display

        discountServicePrice: +calPriceServiceModel.discountServicePrice,
        discountPrice: +calPriceServiceModel.discountPrice,
        discountAmount: +calPriceServiceModel.discountAmount,
        discountPercentage: +calPriceServiceModel.discountPercentage,//do not display
        discountCalculationMethodId: +calPriceServiceModel.discountCalculationMethodId,//do not display

        patientShareAmount: +calPriceServiceModel.patientShareAmount,
        netAmount: calPriceServiceModel.netAmount,

        attenderTaxPercentage: +calPriceServiceModel.attenderTaxPercentage,//do not display
        attenderCommissionAmount: +calPriceServiceModel.attenderCommissionAmount,//do not display
        attenderCommissionType: +calPriceServiceModel.attenderCommissionType,//do not display
        attenderCommissionValue: +calPriceServiceModel.attenderCommissionValue,//do not display
        attenderCommissionPrice: +calPriceServiceModel.attenderCommissionPrice,
        healthInsuranceClaim: healthClaim,

        penaltyId: null,
        penaltyAmount: 0
    };

    arr_tempService.push(model);
    appendServiceAdm(model);
    resetService();

    //resetPatientInfo()
    afterAddOrDeleteTempServiceOrItem(true)

    setTimeout(() => {
        $("#serviceId").select2("focus")
    }, 50)
}

function afterAddOrDeleteTempServiceOrItem(itemOrService) {


    // HEADER SECTION START **************************************************
    $("#userTypeOnOff").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0)
    // HEADER SECTION END **************************************************



    // ATTENDER SETION START ****************************************************
    $("#attenderId").prop("disabled", arr_tempService.length > 0 || !itemOrService);
    $("#referringDoctorId").prop("disabled", arr_tempService.length > 0 || !itemOrService);
    if (+$("#referringDoctorId").val() !== 0) {
        $("#prescriptionDate").prop("disabled", arr_tempService.length > 0 || !itemOrService);
    }
    else
        $("#prescriptionDate").prop("disabled", true)
    $("#showReserve").prop("disabled", !itemOrService)
    $("#reserveBox button").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || !itemOrService);
    // ATTENDER SETION END ****************************************************



    // PATIENT SETION START ****************************************************

    $("#referralTypeId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0)
    $("#nationalCode").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0)
    $("#getPatientInfoWS").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || $("#userTypeOnOff").prop("checked") || admissionListCount > 0);
    $("#getPersobByBirthWS").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || $("#userTypeOnOff").prop("checked") || admissionListCount > 0);
    $("#searchPatient").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0);
    $("#firstName").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0);
    $("#lastName").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || admissionListCount > 0);

    $("#tempPatient").html(fillEmptyRow(18));
    displayCountRowModal(0, "searchPatientModal");
    // PATIENT SETION START ****************************************************



    // INSURER SETION START ****************************************************
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);
    $("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0)


    if (!disabledInsurers.includes(+dropDownCacheData.basicInsurerLineTerminologyCode)) {
        $("#basicInsurerNo").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || !itemOrService);
        $("#basicInsurerExpirationDatePersian").prop("disabled", arr_tempService.length > 0 || arr_tempItem.length > 0 || !itemOrService);
        $("#basicInsurerBookletPageNo").prop("disabled", $("#admnId").val() != 0 || !itemOrService)
    }
    else {
        $("#basicInsurerNo").prop("disabled", true);
        $("#basicInsurerExpirationDatePersian").prop("disabled", true);
        $("#basicInsurerBookletPageNo").prop("disabled", true)
    }
    // INSURER SETION END ****************************************************



    loadingDoneCallUp();
    loadingDonePersonByBirth();

}

function sumAdmissionLine() {

    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
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

        var output = `<tr id="s_${model.rowNumber}" 
                         onclick="setHighlightTr(${model.rowNumber},'tempService',event)">
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
            $(".sumNetPriceService").text(sumNetPriceTxt);
            $("#sumRowService").removeClass("displaynone");
        }
        else {
            $("#sumRowService").addClass("displaynone");
            $(".sumNetPriceService").text(sumNetPriceTxt);
        }

        $("#serviceBoxNetAmount").text(sumNetPriceTxt)
    }

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
        $(".sumNetPriceService").text("");
        $("#tempService").html(emptyRowHTML);
        $("#serviceBoxNetAmount").text(0)
    }
    else {
        var vSumNetPrice = sumAdmissionLine();
        $("#sumRowService").removeClass("displaynone");
        $(".sumNetPriceService").text(transformNumbers.toComma(vSumNetPrice));
        rebuildRowService(arr_tempService, "tempService");
        $("#serviceBoxNetAmount").text(transformNumbers.toComma(vSumNetPrice))
    }

    //$("#compInsurerThirdPartyId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    //$("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    //$("#discountInsurerId").prop("disabled", arr_tempService.length > 0 || +$("#referralTypeId").val() == 2);
    //$("#editSectionShabad").prop("disabled", arr_tempService.length > 0 || $("#hidonline").prop("checked"));
    //$("#getrefferingHID").prop("disabled", arr_tempService.length > 0);
    //$("#eliminateReasonId").prop("disabled", arr_tempService.length > 0);
    //$("#searchPatient").prop("disabled", true)
    //$("#serviceId").select2("focus");

    //if (arr_tempService.length == 0)
    //resetPatientInfo()
    afterAddOrDeleteTempServiceOrItem(true)

    if (arr_tempItem.length == 0 && arr_tempService.length == 0) {
        $("#basicInsurerLineId").select2("focus")
    }
    else {
        if ($("#servicePart a").hasClass("active"))
            $("#seviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    }


    //$("#serviceId").select2("focus");
}

function rebuildRowService(arr, table) {

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

function getAdmissionHID() {


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
    HIDOnline = false;

    // اگر بیمه تامین - خدمات درمانی و آزاد نبود رجوع به انبار
    if (arrHasWWebService.indexOf(insurer.id) === -1) {
        // رجوع به انبار با Insurer=37

        var HID = getHID(37);


        HIDIdentity = HID;
        return HIDIdentity

    }
    // اگر نوع مراجعه اصلی بود یا اتباع و اگر بیمه تامین - خدمات درمانی و آزاد بود رجوع به وب سرویس
    else if ((referralTypeId === 1 || referralTypeId === 5 || referralTypeId === 4 || referralTypeId === 6) && (arrHasWWebService.indexOf(insurer.id) > -1)) {

        resultHID = getHIDWS(person, provider, insurer, referring, inqueryID);


        // اگر دریافت شناسه شباد موفقیت آمیز بود
        if (resultHID.successfull) {
            HIDIdentity = resultHID.data.id;
            HIDOnline = true;
            return HIDIdentity
        }
        else {

            // اگر وب سرویس قطع بود دریافت شناسه شباد از انبار
            if (resultHID.status === -103 || resultHID.status === -105 || resultHID.status === -101) {

                // دریافت hid از انبار
                var HID = getHID(insurer.id);


                HIDIdentity = HID;
                return HIDIdentity
            }
            else if (resultHID.status === -104) {

                var HID = getHID(insurer.id);

                HIDIdentity = HID;
                return HIDIdentity
            }
            else if (resultHID.status === -106) {

                var HID = getHID(insurer.id);

                HIDIdentity = HID;
                return HIDIdentity
            }
            // خطا در اجرای وب سرویس
            else if (resultHID.status === -102 || resultHID.status === -101) {

                //var msgErrHID = alertify.warning(resultHID.statusMessage);
                //msgErrHID.delay(alertify_delay);
                //return;
            }
        }
    }
    // اگر نوع مراجعه مجهول و نوزاد بود و بیمه تامین - خدمات درمان - آزاد بود رجوع به انبار
    else if ((+referralTypeId === 2 || +referralTypeId === 3) && (arrHasWWebService.indexOf(insurer.id) > -1)) {

        // رجوع به انبار با InsurerId
        var HID = getHID(insurer.id);

        HIDIdentity = HID;
        return HIDIdentity

    }
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

async function saveAdmissionService() {

    if ($("#saveFormService").attr("disabled") === "disabled")
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


    if (HIDIdentity == "")
        HIDIdentity = await getAdmissionHID()


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

    var arrayReserveDateTime = admissionReserveDateTimePersian.split(" ");
    var reserveTime = arrayReserveDateTime[0];
    var reserveDatePersian = arrayReserveDateTime[1];


    var model_adm = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admissionsMasterId").val(),
        admissionMasterWorkflowId: 175,
        admissionMasterStageId: admissionStage.admissionMasterMedicalPlan.id,
        admissionMasterActionId: +$("#masterActionId").val(),
        stageId: admissionStage.admissionServiceMaster.id,
        actionId: actionIdOnEdit,
        workflowId: 175,
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

    let viewData_save_admission = `${viewData_baseUrl_MC}/AdmissionApi/insert`;

    loadingAsync(true, "saveFormService");
    loadingAsync(true, "saveFormItem");

    $.ajax({
        url: viewData_save_admission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model_adm),
        async: false,
        success: function (result) {

            if (!result.successfull) {
                if (result.validationErrors !== null)
                    generateErrorValidation(result.validationErrors);
            }
            else if (result.data.status === 100) {
                var messageSuccessAlert = alertify.success(result.data.statusMessage);
                messageSuccessAlert.delay(admission.delay);
                $("#admissionsMasterId").val(result.data.admissionMasterId)

                admissionMatserFormConfig(result.data.admissionMasterId, "INS", () => { return 2 })
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

            loadingAsync(false, "saveFormService");
            loadingAsync(false, "saveFormItem");
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_admission);
            loadingAsync(false, "saveFormService");
            loadingAsync(false, "saveFormItem");
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

        inqueryID = 0
    }

    //admissionExtraProperty 5
    if (checkResponse(HIDIdentity) && HIDIdentity != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.hID,
            elementValue: HIDIdentity
        })
        HIDIdentity = ""
    }

    //admissionExtraProperty 6
    admissionExtraPropertyList.push({
        elementId: admissionExtraProperty.hIDOnline,
        elementValue: HIDOnline
    })

    HIDOnline = false

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
    if ($("#reasonForEncounterId").val() != "") {
        admissionExtraPropertyList.push({
            elementId: admissionExtraProperty.reasonForEncounterId,
            elementValue: +$("#reasonForEncounterId").val()
        })
    }

    //admissionExtraProperty 2
    //if (+$("#refferingHID").val() != 0) {
    //    admissionExtraPropertyList.push({
    //        elementId: admissionExtraProperty.referredHID,
    //        elementValue: $("#refferingHID").val()
    //    })
    //}

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
    let qty = +$("#qtyService").val()
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

            calPriceServiceModel = result;

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

function setHighlightTr(rowNumber, tableId, ev) {
    $(`#${tableId} tr`).removeClass("highlight");
    $(`#${tableId} #s_${rowNumber}`).addClass("highlight");
}

$("#saveFormService").on("click", function () {
    saveAdmissionService();
})

$("#serviceId").on("change", function () {

    if (+$(this).val() !== 0) {
        $("#qtyService").val(1);
        admissionCalPrice();

        //$('html').animate({
        //    scrollTop: $("html").offset().top + document.body.scrollHeight
        //}, 1000);
    }
    else {
        $("#qtyService").val("");
        admissionCalPrice();
    }

});

$("#qtyService").on({
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
//SERVICE SECTION END ****************************************************************





//ITEM SECTION START ****************************************************************
function sumAdmissionLineItem() {

    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempItem.length; i++) {
        var item = arr_tempItem[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
}

function displayPricingBox(pricingModelId, minPrice, maxPrice) {

    if (pricingModelId === 1) {
        $("#pricingRangeBox").addClass("displaynone");
        $("#pricingFixBox").removeClass("displaynone");
        $("#minPrice").val("");
        $("#maxPrice").val("");
        $("#price").val("");
        $("#fixPrice").val(transformNumbers.toComma(minPrice));
    }
    else if (pricingModelId === 2) {
        $("#pricingRangeBox").removeClass("displaynone");
        $("#pricingFixBox").addClass("displaynone");
        $("#minPrice").val(minPrice > 0 ? transformNumbers.toComma(minPrice) : 0).removeClass("displaynone");
        $("#maxPrice").val(maxPrice > 0 ? transformNumbers.toComma(maxPrice) : 0).removeClass("displaynone");
        $("#fixPrice").val("");
    }
}

function initialErrorCalPrice() {
    errorCalPrice.statusError = 0;
    errorCalPrice.messageError = "";
    errorCalPrice.itemId = false;
    errorCalPrice.itemPrice = false;
    errorCalPrice.salePriceModelActive = false;
    errorCalPrice.rangePrice = false;
    errorCalPrice.minQty = false;
    errorCalPrice.permissionDiscount = false;
    errorCalPrice.priceNotValid = false;
    errorCalPrice.exception = false;
}

function itemCalPrice() {

    initialErrorCalPrice();

    if (+$("#ItemId").val() == 0)
        return

    let viewData_calc_admissionSalePrice = `${viewData_baseUrl_MC}/AdmissionItemApi/calitemprice`

    let model = {
        itemId: +$("#ItemId").val(),
        qty: +$("#qtyItem").val(),
        price: +$("#pricingModelId").val() === 1 ? +removeSep($("#fixPrice").val()) : +removeSep($("#price").val()),
        basicInsurerId: dropDownCacheData.basicInsurerId == 0 ? null : dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId == 0 ? null : dropDownCacheData.basicInsurerLineId,
        compInsurerId: dropDownCacheData.compInsurerId == 0 ? null : dropDownCacheData.compInsurerId,
        compInsurerLineId: dropDownCacheData.compInsurerLineId == 0 ? null : dropDownCacheData.compInsurerLineId,
        thirdPartyId: dropDownCacheData.thirdPartyInsurerId == 0 ? null : dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: dropDownCacheData.discountInsurerId == 0 ? null : dropDownCacheData.discountInsurerId,
        medicalSubjectId: $("#referralTypeId").val() == 4 ? medicalSubject.inPersonIPDTariff.id : medicalSubject.inPersonTariff.id
    }

    if (+$("#ItemId").val() != 0) {
        $.ajax({
            url: viewData_calc_admissionSalePrice,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            cache: false,
            async: false,
            success: function (result) {

                if (!checkResponse(result))
                    return

                var res = result;

                if (res.status === 100) {

                    calPriceItemModel = res;

                    $("#pricingModelName").val(res.pricingModelName);
                    $("#pricingModelId").val(res.pricingModelId);

                    displayPricingBox(res.pricingModelId, res.minPrice, res.maxPrice);

                    $("#contractTypeId").val(res.contractTypeId).trigger("change")
                    $("#unitItemName").val(res.unitName);
                    $("#categoryName").val(res.categoryName);
                    $("#netAmountItem").val(transformNumbers.toComma(res.netAmount));
                    $("#categoryName").val(res.categoryName);

                    if (res.contractTypeId == 1)
                        $("#vendorId").val(res.companyName)
                    else
                        $("#vendorId").val(`${res.vendorId} - ${res.vendorName}`)


                    //$("#basicPrice").val(res.basicPrice > 0 ? transformNumbers.toComma(res.basicPrice) : 0);
                    $("#basicShareAmountItem").val(res.basicShareAmount > 0 ? transformNumbers.toComma(res.basicShareAmount) : 0);
                    $("#basicItemPrice").val(res.basicItemAmount > 0 ? transformNumbers.toComma(res.basicItemAmount) : 0);
                    $("#compShareAmountItem").val(res.compShareAmount > 0 ? transformNumbers.toComma(res.compShareAmount) : 0);
                    $("#thirdPartyAmountItem").val(res.thirdPartyAmount > 0 ? transformNumbers.toComma(res.thirdPartyAmount) : 0);
                    $("#discountAmountItem").val(res.discountAmount > 0 ? transformNumbers.toComma(res.discountAmount) : 0);
                    //$("#patientShareAmountItem").val(res.patientShareAmount > 0 ? transformNumbers.toComma(res.patientShareAmount) : 0);

                }
                else {
                    $("#itemcategoryattribute").val(0).prop("disabled", true).trigger("change")
                    $("#qtyItem").val(1)
                    displayPricingBox(1, "", "")
                    errorCalPrice.statusError = res.status;
                    errorCalPrice.messageError = res.statusMessage;
                    errorCalPrice.itemId = res.status == -101;
                    errorCalPrice.itemPrice = res.status == -102;
                    errorCalPrice.salePriceModelActive = res.status == -103;
                    errorCalPrice.rangePrice = res.status == -104;
                    errorCalPrice.minQty = res.status == -105;
                    errorCalPrice.permissionDiscount = res.status == -106;
                    errorCalPrice.priceNotValid = res.status == -107;
                    errorCalPrice.exception = res.status == -108;

                    var msgitem = alertify.warning(res.statusMessage);
                    msgitem.delay(res.status !== -105 ? alertify_delay : 7);
                    return res;
                }
                return res;
            },
            error: function (xhr) {
                error_handler(xhr, viewData_calc_admissionSalePrice);
                return {};
            }
        });
    }

}

function getItemCategoryAttribute(itemId) {
    $('#itemcategoryattribute').html('');

    let getItemCategoryUrl = `/api/WH/ItemApi/getItemCategoryId`;
    let categoryId = 0;

    $.ajax({
        url: getItemCategoryUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(itemId),
        async: false,
        success: function (result) {

            if (result != null) {
                categoryId = result;

                url = `/api/WH/ItemCategoryApi/getitemcategoryattribute/${categoryId}`;

                $.ajax({
                    url: url,
                    type: "get",
                    contentType: "application/json",
                    async: false,
                    success: function (result) {
                        hasAttribute = result;
                        if (!result) {
                            $("#itemcategoryattribute").attr("disabled", true);
                            $("#itemcategoryattribute").val("0").trigger("change");
                        }
                        else {
                            fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "itemcategoryattribute", true, categoryId, false, 3, "",
                                () => {
                                    if ($("#itemcategoryattribute").children().length == 0)
                                        $("#itemcategoryattribute").prop("disabled", true);
                                    else
                                        $("#itemcategoryattribute").prop("disabled", false);
                                });
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, url);
                    }
                });
            }
        },
        error: function (xhr) {
            error_handler(xhr, getItemCategoryUrl);
        }
    });
}

function resetItem(all) {

    $("#itemForm input.form-control").not("#qtyItem").val("");
    $("#itemcategoryattribute").val("").prop("disabled", true).trigger("change");
    $("#contractTypeId").val("").trigger("change")

    if ($("#qtyItem").val() == "")
        $("#qtyItem").val("1");

    if (all)
        $("#itemForm .select2").val("").trigger("change");
}

function addTempItem() {
    var msg_s = alertify;
    var model = {};


    if (+$("#ItemId").val() === 0) {
        $("#ItemId").select2("focus");
        msg_s = alertify.warning(admissionSale.notHasItem);
        msg_s.delay(admissionSale.delay);
        return;
    }

    if (errorCalPrice.statusError != null && errorCalPrice.statusError != 0) {
        msg_s = alertify.warning(errorCalPrice.messageError);
        msg_s.delay(admissionSale.delay);
        $("#ItemId").select2("focus")
        return;
    }

    if (calPriceItemModel.basicItemPrice == 0 && calPriceItemModel.basicPrice == 0 && calPriceItemModel.basicShareAmount == 0 && calPriceItemModel.compShareAmount == 0 && calPriceItemModel.netAmount <= 0) {
        msg_s = alertify.warning("این خدمت اجازه ثبت ندارد");
        msg_s.delay(admission.delay);
        $("#ItemId").select2("focus")
        return;
    }

    if (+$("#qtyItem").val() === 0) {
        msg_s = alertify.warning("تعداد را مشخص نمایید");
        msg_s.delay(admissionSale.delay);
        $("#qtyItem").focus();
        return;
    }

    if (+calPriceItemModel.netAmount < 0) {
        msg_s = alertify.warning("مبالغ معتبر نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#qtyItem").focus();
        return;
    }

    if (+$("#pricingModelId").val() === 1 && +removeSep($("#fixPrice").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (+$("#pricingModelId").val() === 2 && +removeSep($("#price").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (!isBetween(+removeSep($("#minPrice").val()), +removeSep($("#price").val()), +removeSep($("#maxPrice").val()))) {
        msg_s = alertify.error("نرخ در محدوده مجاز نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (errorCalPrice.minQty) {
        msg_s = alertify.error(errorCalPrice.messageError);
        msg_s.delay(admissionSale.delay);
        return;
    }

    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد، امکان افزودن کالا وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceItemModel == undefined || calPriceItemModel.netAmount < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        $("#ItemId").select2("focus")
        return;
    }

    var referralTypeId = $("#referralTypeId").val();
    if ((+referralTypeId == 1 || +referralTypeId == 4) && ($("#nationalCode").val() === "" || $("#firstName").val() === "" || $("#lastName").val() === "" || $("#genderId").val() === "0")) {
        msg_s = alertify.warning("اطلاعات مراجعه کننده را کامل وارد نمایید");
        msg_s.delay(admission.delay);
        return;
    }

    model = {
        rowNumber: arr_tempItem.length + 1,
        itemId: +$("#ItemId").val(),
        itemName: $("#ItemId").select2('data').length > 0 ? $("#ItemId").select2('data')[0].text : "",
        attributeIds: $("#itemcategoryattribute").val(),
        qty: +$("#qtyItem").val(),
        discountAmount: +calPriceItemModel.discountAmount,
        basicShareAmount: +calPriceItemModel.basicShareAmount,
        compShareAmount: +calPriceItemModel.compShareAmount,
        thirdPartyAmount: +calPriceItemModel.thirdPartyAmount,
        patientShareAmount: +calPriceItemModel.patientShareAmount,
        netAmount: +calPriceItemModel.netAmount,
        contractTypeId: calPriceItemModel.contractTypeId,
        priceTypeId: +calPriceItemModel.vendorCommissionType,
        vendorCommissionAmount: calPriceItemModel.vendorCommissionAmount,
        vendorId: +calPriceItemModel.vendorId === 0 ? null : calPriceItemModel.vendorId,
        basicPrice: +calPriceItemModel.basicPrice,
        basicItemPrice: +calPriceItemModel.basicItemPrice,
        basicPercentage: +calPriceItemModel.basicPercentage,
        basicCalculationMethodId: +calPriceItemModel.basicCalculationMethodId,
        compPrice: +calPriceItemModel.compPrice,
        compItemPrice: +calPriceItemModel.compItemPrice,
        compPercentage: +calPriceItemModel.compPercentage,
        compCalculationMethodId: +calPriceItemModel.compCalculationMethodId,
        thirdPartyPrice: +calPriceItemModel.thirdPartyPrice,
        thirdPartyItemPrice: +calPriceItemModel.thirdPartyItemPrice,
        thirdPartyPercentage: +calPriceItemModel.thirdPartyPercentage,
        thirdPartyCalculationMethodId: +calPriceItemModel.thirdPartyCalculationMethodId,
        discountPrice: +calPriceItemModel.discountPrice,
        discountItemPrice: +calPriceItemModel.discountItemPrice,
        discountPercentage: +calPriceItemModel.discountPercentage,
        discountCalculationMethodId: +calPriceItemModel.discountCalculationMethodId,
        vATPercentage: +calPriceItemModel.vatPercentage,
    };

    if (checkNotExistValueInArray(arr_tempItem, "itemId", model.itemId)) {
        arr_tempItem.push(model);
        appendItem(model);
        resetItem(true);
        //$(`#ItemId`).select2("focus");
        //afterAddOrDeleteTempServiceOrItem()
    }
    else {
        msg_s = alertify.warning(admissionSale.hasItem);
        msg_s.delay(admission.delay);
        /*$(`#ItemId`).select2("focus")*/;
    }

    //resetPatientInfo()
    afterAddOrDeleteTempServiceOrItem(false)

    setTimeout(() => {
        $("#ItemId").select2("focus")
    }, 50)


}

function appendItem(model) {

    if (model) {
        var emptyRow = $("#tempItem").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempItem").html("");
            $("#sumRowItem").addClass("displaynone");
        }

        var output = `<tr id="s_${model.itemId}"    
                          onclick="setHighlightTr(${model.rowNumber},'tempItem')">
                          <td>${model.rowNumber}</td>
                          <td>${model.itemName}</td>
                          <td class="money">${model.qty}</td>
                          <td class="money">${transformNumbers.toComma(model.basicItemPrice)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicItemPrice * model.qty)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicShareAmount)}</td>
                          <td class="money">${model.compShareAmount > 0 ? transformNumbers.toComma(model.compShareAmount) : 0}</td>
                          <td class="money">${model.thirdPartyAmount > 0 ? transformNumbers.toComma(model.thirdPartyAmount) : 0}</td>
                          <td class="money">${model.discountAmount > 0 ? transformNumbers.toComma(model.discountAmount) : 0}</td>
                          <td class="money">${model.netAmount > 0 ? transformNumbers.toComma(model.netAmount) : 0}</td>
                          <td>
                              <button type="button" onclick="removeFromTempItem(${model.itemId})" class="btn maroon_outline"  data-toggle="tooltip" data-placement="bottom" data-original-title="حذف">
                                   <i class="fa fa-trash"></i>
                              </button>
                          </td>
                      </tr>`;

        getItemCategoryAttribute(model.itemId);

        $(`#tempItem`).append(output);

        var sumNetPriceTxt = transformNumbers.toComma(sumAdmissionLineItem());

        if (arr_tempService.length !== 0) {
            $(".sumNetPriceItem").text(sumNetPriceTxt);
            $("#sumRowItem").removeClass("displaynone");
        }
        else {
            $("#sumRowItem").addClass("displaynone");
            $(".sumNetPriceItem").text(sumNetPriceTxt);
        }

        $("#itemBoxNetAmount").text(sumNetPriceTxt)

    }
}

function removeFromTempItem(itemId) {

    for (var i = 0; i < arr_tempItem.length; i++) {
        item = arr_tempItem[i];
        if (item["itemId"] === itemId) {
            arr_tempItem.splice(i, 1);
            $(`#s_${itemId}`).remove();
            break;
        }
    }

    if (arr_tempItem.length === 0) {
        $("#sumRowItem").addClass("displaynone");
        $(".sumNetPriceItem").text("");
        $(`#tempItem`).html(emptyRowHTML);
        $("#ItemId").val(0).trigger("change")
        $("#itemBoxNetAmount").text(0)
    }
    else {
        var vSumNetPrice = sumAdmissionLineItem();
        $("#sumRowItem").removeClass("displaynone");
        $(".sumNetPriceItem").text(transformNumbers.toComma(vSumNetPrice));
        rebuildRowItem(arr_tempItem, "tempItem");
        $("#ItemId").val(0).trigger("change")
        $("#itemBoxNetAmount").text(transformNumbers.toComma(vSumNetPrice))
    }

    //resetPatientInfo()
    afterAddOrDeleteTempServiceOrItem(false)

    if (arr_tempItem.length == 0 && arr_tempService.length == 0) {
        $("#basicInsurerLineId").select2("focus")
    }
    else {
        if ($("#servicePart a").hasClass("active"))
            $("#seviceId").select2("focus")
        else
            $("#ItemId").select2("focus")
    }

}

function rebuildRowItem(arr, table) {

    if (arr.length === 0 || table === "")
        return;

    var arrLen = arr.length;

    for (var i = 0; i < arrLen; i++) {
        arr[i].rowNumber = i + 1;
        $(`#${table} tr`)[i].children[0].innerText = arr[i].rowNumber;
    }
}

function saveAdmissionItem() {

    if ($("#saveFormItem").attr("disabled") === "disabled")
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (+$("#basicInsurerLineId").val() == 0) {
        msg_s = alertify.warning("بیمه اجباری را وارد کنید");
        msg_s.delay(admission.delay);
        $("#basicInsurerLineId").select2("focus");
        return;
    }

    if (arr_tempItem.length === 0) {
        var msg = alertify.warning(admissionSale.notHasItem);
        msg.delay(admissionSale.delay);
        $("#saveFormItem").removeAttr("disabled");
        return;
    }

    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد ، امکان ذخیره وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }

    var nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    var mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();

    let referralTypeId = $("#referralTypeId").val()
    let medicalSubjectId = ""

    if (referralTypeId == 4)
        medicalSubjectId = medicalSubject.inPersonIPDTariff.id
    else
        medicalSubjectId = medicalSubject.inPersonTariff.id


    var model_patient = {
        id: +$("#patientId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        genderId: +$("#genderId").val(),
        nationalCode: nationalCode,
        mobileNo: mobileNo,
        countryId: +$("#countryId").val(),
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

    var model_sale = {
        id: +$("#admnId").val(),
        admissionMasterId: +$("#admissionsMasterId").val(),
        admissionMasterWorkflowId: 175,
        admissionMasterStageId: admissionStage.admissionMasterMedicalPlan.id,
        stageId: admissionStage.admissionSaleItemMaster.id,
        admissionMasterActionId: +$("#masterActionId").val(),
        workflowId: 175,
        actionId: actionIdOnEdit,
        basicInsurerId: dropDownCacheData.basicInsurerId == 0 ? null : dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId == 0 ? null : dropDownCacheData.basicInsurerLineId,
        compInsurerId: dropDownCacheData.compInsurerId == 0 ? null : dropDownCacheData.compInsurerId,
        compInsurerLineId: dropDownCacheData.compInsurerLineId == 0 ? null : dropDownCacheData.compInsurerLineId,
        thirdPartyInsurerId: dropDownCacheData.thirdPartyInsurerId == 0 ? null : dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: dropDownCacheData.discountInsurerId == 0 ? null : dropDownCacheData.discountInsurerId,
        referralTypeId: referralTypeId,
        medicalSubjectId: medicalSubjectId,
        admissionPatientJSON: model_patient,
        admissionItemLineList: arr_tempItem
    };


    let viewData_save_SaleItem = `${viewData_baseUrl_MC}/AdmissionItemApi/insert`

    loadingAsync(true, "saveFormService");
    loadingAsync(true, "saveFormItem");

    $.ajax({
        url: viewData_save_SaleItem,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model_sale),
        async: false,
        success: function (result) {

            if (result.successfull === false) {
                if (result.validationErrors !== null)
                    generateErrorValidation(result.validationErrors);

            }
            else if (result.data.status === 100) {

                var msg = alertify.success(admissionSale.insert_success);
                msg.delay(admission.delay);

                $("#admissionsMasterId").val(result.data.admissionMasterId)
                admissionMatserFormConfig(result.data.admissionMasterId, "INS", () => { return 1 })

            }
            else if (result.data.status === -1) {

                var msg1 = alertify.error(result.data.message);
                msg1.delay(admission.delay);
            }
            else {
                var msg2 = alertify.error(admissionSale.insert_error);
                msg2.delay(admissionSale.delay);
                generateErrorValidation(result.validationErrors);
            }
            loadingAsync(false, "saveFormService");
            loadingAsync(false, "saveFormItem");

        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_SaleItem);
            loadingAsync(false, "saveFormService");
            loadingAsync(false, "saveFormItem");
        }
    });
}

$("#ItemId").on("change", function () {

    resetItem(false);
    $("#qtyItem").val(1);
    var itemId = $(this).val();

    if (+itemId !== 0) {
        getItemCategoryAttribute(itemId);
        $("#qtyItem").val(1);
        itemCalPrice();
        //$('html').animate({
        //    scrollTop: $("html").offset().top + document.body.scrollHeight
        //}, 1000);
    }
    else {
        $("#pricingRangeBox").addClass("displaynone");
        $("#pricingFixBox").removeClass("displaynone");
        $("#minPrice").val("");
        $("#maxPrice").val("");
        $("#price").val("");
        $("#fixPrice").val(0);
        $("#qtyItem").val("");
    }

});

$("#qtyItem").on({
    focus: function () { selectText($(this)); },
    input: function () {
        $("#itemForm input.form-control:not(#price,#qtyItem)").val("");
        $("#contractTypeId").val("").trigger("change")
        $("#itemForm .select2:not(#ItemId,#itemcategoryattribute)").val("").trigger("change");

        var qty = +$(this).val();
        if (qty > 100) {
            var qtyAlert = alertify.warning("حداکثر تعداد قابل قبول 100 عدد می باشد");
            qtyAlert.delay(admission.delay);
            return;
        }
    },
    blur: function () {
        let qty = +$(this).val();

        if (qty > 0 && qty <= 100) {
            if (checkResponse($("#ItemId").val())) {
                itemCalPrice();
            }
            else {
                var qtyAlert = alertify.warning("کالا را وارد کنید");
                qtyAlert.delay(admission.delay);
                $("#ItemId").select2("focus");
            }
        }
    }
})

$("#price").on("blur", function () {

    if (+$("#pricingModelId").val() === 2 && +removeSep($("#price").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (!isBetween(+removeSep($("#minPrice").val()), +removeSep($("#price").val()), +removeSep($("#maxPrice").val()))) {
        msg_s = alertify.error("نرخ در محدوده مجاز نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (+$("#qtyItem").val() == 0) {
        var msg_qty_zero = alertify.warning("تعداد را وارد کنید");
        msg_qty_zero.delay(admission.delay);
        $("#qtyItem").focus()
        return
    }

    if (+$("#qtyItem").val() > 100) {
        var msg_qty_hundred = alertify.warning("تعداد حداکثر می تواند 100 عدد باشد");
        msg_qty_hundred.delay(admission.delay);
        $("#qtyItem").focus()
        return
    }

    if (!$("#pricingRangeBox").hasClass("displaynone") && $("#price").val() != "")
        itemCalPrice();
});

$("#addItem").on("click", function () {
    addTempItem();
});

$("#saveFormItem").on("click", function () {
    saveAdmissionItem();
})
//ITEM SECTION END ****************************************************************




// ADMISSION Diagnosis Start ****************************************************************
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

            var emptyRow = $("#tempDiagForm").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDiagForm").html("");

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

            $(diagOutput).appendTo("#tempDiagForm");
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
    $("#tempDiagForm tr").removeClass("highlight");
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
    $("#tempDiagForm tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDiagnosis, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dg_${rowNumber}`).remove();

    if (arr_TempDiagnosis.length == 0) {
        var colspan = $("#tempdiagnosisesList thead th").length;
        $("#tempDiagForm").html(emptyRow.replace("thlength", colspan));
    }
    $(".diagnosis-filed").prop("disabled", arr_TempDiagnosis.length > 0);
    rebuildDaigRow();
}

function rebuildDaigRow() {

    var arrDiag = arr_TempDiagnosis;
    var table = "tempDiagForm";

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
        $("#tempDiagForm").html("");
        arr_TempDiagnosis = []
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
// ADMISSION Diagnosis END ****************************************************************




//VALIDATION FORM START ****************************************************************
window.Parsley._validatorRegistry.validators.nationalcodeadmission = undefined
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
//VALIDATION FORM START ****************************************************************


initAdmissionMasterForm()
