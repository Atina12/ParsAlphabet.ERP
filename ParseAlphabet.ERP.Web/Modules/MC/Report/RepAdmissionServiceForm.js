
var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش پذیرش",
    reportUrl = "",
    form = $('.card-body').parsley(),
    roleId = getRoleId(),
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmission`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncsv`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncolumns`;


async function initAdmissionReport() {

    $(".select2").select2();

    settingReportModule();

    getHeaderColumns();

    $("#fromDate").inputmask();
    $("#toDate").inputmask();
    $("#fromReserveDate").inputmask();
    $("#toReserveDate").inputmask();

    kamaDatepicker('fromDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toDate', { withTime: false, position: "bottom" });
    kamaDatepicker('fromReserveDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toReserveDate', { withTime: false, position: "bottom" });

    fillDropDown()

    $("#basicInsurerLineId").val("").attr("disabled", true);
    $("#compInsurerLineId").val("").attr("disabled", true);

    setTimeout(() => {
        $("#fromDate").focus();
    }, 20);

}

function fillDropDown() {

    fill_select2(`${viewData_baseUrl_GN}/branchApi/getdropdown`, "branchId", true, "", false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerId", true, "1/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsurerId", true, "2/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyInsurerId", true, "4/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "discountInsurerId", true, "5/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ReferringDoctorApi/getdropdown`, "referringDoctorId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, 'departmentId', true, "", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceTypeApi/getdropdown`, "serviceTypeId", true, "2", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "serviceId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "patientId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/PatientApi/filter`, "patientNationalCode", true, "3", true, 3, "", undefined, "", false, false, false);
    fill_select2(`/api/GN/UserApi/getdropdown`, "userId", true, "2/false/false", false, 3, "", undefined, "", false, true, false);
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass);
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
        $(`#${elementId}`).prop("disabled", false)
    }
}

function parameter() {

    let patientId = "";
    if (+$("#patientId").val() > 0)
        patientId = +$("#patientId").val();
    else if (+$("#patientId").val() > 0 && +$("#patientNationalCode").val() != 0)
        patientId = +$("#patientNationalCode").val();
    else if (+$("#patientId").val() == 0 && +$("#patientNationalCode").val() > 0)
        patientId = +$("#patientId").val();
    else
        patientId = 0;

    let parameters = {
        id: ($("#id").val() == null || $("#id").val() == "") ? null : +$("#id").val(),
        admissionMasterId: ($("#admissionMasterId").val() == null || $("#admissionMasterId").val() == "") ? null : +$("#admissionMasterId").val(),
        branchId: +$("#branchId").val() == 0 ? null : $("#branchId").val().toString(),
        patientId: patientId == 0 ? null : patientId,
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
        fromReserveDatePersian: $("#fromReserveDate").val() == "" ? null : $("#fromReserveDate").val(),
        toReserveDatePersian: $("#toReserveDate").val() == "" ? null : $("#toReserveDate").val(),
        userId: +$("#userId").val() == 0 ? null : +$("#userId").val(),
        basicInsurerId: $("#basicInsurerId").val().toString() == "" ? null : $("#basicInsurerId").val().toString(),
        basicInsurerLineId: $("#basicInsurerLineId").val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(),
        compInsurerId: $("#compInsurerId").val().toString() == "" ? null : $("#compInsurerId").val().toString(),
        compInsurerLineId: $("#compInsurerLineId").val().toString() == "" ? null : $("#compInsurerLineId").val().toString(),
        thirdPartyInsurerId: $("#thirdPartyInsurerId").val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(),
        discountInsurerId: $("#discountInsurerId").val().toString() == "" ? null : $("#discountInsurerId").val().toString(),
        attenderId: $("#attenderId").val() == "" ? null : $("#attenderId").val().toString(),
        departmentIds: $("#departmentId").val().toString() == "" ? null : $("#departmentId").val().toString(),
        specialityId: $("#specialityId").val().toString() == "" ? null : $("#specialityId").val().toString(),
        serviceTypeId: $("#serviceTypeId").val().toString() == "" ? null : $("#serviceTypeId").val().toString(),
        serviceId: $("#serviceId").val().toString() == "" ? null : $("#serviceId").val().toString(),
        workflowId: $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        stageId: $("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        actionId: $("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),
        pageNo: 0

    };
    return parameters;
}

function reportParameter() {
    
    let patientId = "";
    if (+$("#patientId").val() > 0)
        patientId = +$("#patientId").val();
    else if (+$("#patientId").val() > 0 && +$("#patientNationalCode").val() != 0)
        patientId = +$("#patientNationalCode").val();
    else if (+$("#patientId").val() == 0 && +$("#patientNationalCode").val() > 0)
        patientId = +$("#patientId").val();
    else
        patientId = 0;

    var repParameters = [
        { Item: "Id", Value: +$("#id").val() == 0 ? null : $("#id").val(), SqlDbType: dbtype.Int },
        { Item: "AdmissionMasterId", Value: +$("#admissionMasterId").val() == 0 ? null : $("#admissionMasterId").val(), SqlDbType: dbtype.Int },
        { Item: "BranchId", Value: $(`#branchId`).val().toString() == "" ? null : $("#branchId").val().join(","), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "PatientId", Value: patientId == 0 ? null : patientId, SqlDbType: dbtype.Int},
        { Item: "FromDate", Value: $(`#fromDate`).val() != "" ? convertToMiladiDate($(`#fromDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToDate", Value: $(`#toDate`).val() != "" ? convertToMiladiDate($(`#toDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "FromReserveDate", Value: $(`#fromReserveDate`).val() != "" ? convertToMiladiDate($(`#fromReserveDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToReserveDate", Value: $(`#toReserveDate`).val() != "" ? convertToMiladiDate($(`#toReserveDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "UserId", Value: +$(`#userId`).val() == 0 ? null : +$("#userId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurerId", Value: $(`#basicInsurerId`).val().toString() == "" ? null : $("#basicInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "BasicInsurerLineId", Value: $(`#basicInsurerLineId`).val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerId", Value: $(`#compInsurerId`).val().toString() == "" ? null : $("#compInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerLineId", Value: $(`#compInsurerLineId`).val().toString() == "" ? null : $("#compInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ThirdPartyInsurerId", Value: $(`#thirdPartyInsurerId`).val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "DiscountInsurerId", Value: $(`#discountInsurerId`).val().toString() == "" ? null : $("#discountInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "AttenderId", Value: $(`#attenderId`).val().toString() == "" ? null : $("#attenderId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "DepartmentIds", Value: $(`#departmentId`).val() == "" ? null : $("#departmentId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "SpecialityId", Value: $(`#specialityId`).val().toString() == "" ? null : $("#specialityId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ServiceTypeId", Value: $(`#serviceTypeId`).val().toString() == 0 ? null : $("#serviceTypeId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ServiceId", Value: $(`#serviceId`).val().toString() == "" ? null : $("#serviceId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageId", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ActionId", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "FromDatePersian", Value: $(`#fromDate`).val() != "" ? $(`#fromDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toDate`).val() != "" ? $(`#toDate`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 }
    ]

    return repParameters;
}

function fill_select2Stage(elementid) {

    $(`#${elementid}`).html(`<option value="0">انتخاب کنید</option>`);

    let data = Object.keys(admissionStage).map(function (item) {
        return {
            id: admissionStage[item].id, text: admissionStage[item].id + " - " + admissionStage[item].name
        };
    });
    $(`#${elementid}`).select2({
        templateResult: function (item) {
            return item.text;
        },
        placeholder: "انتخاب",
        data: data,
        allowClear: true,
    });

}

$("#basicInsurerId").on("change", function () {

    let insurerId = $(this).val().toString();

    if (insurerId != "") {

        $("#basicInsurerLineId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsurerLineId", true, `${insurerId}/2`, false, 3, "", undefined, "", false, false, true);
    }
    else
        $("#basicInsurerLineId").attr("disabled", true).html("");

});

$("#compInsurerId").on("change", function () {

    let insurerId = $(this).val().toString();

    if (insurerId != "") {

        $("#compInsurerLineId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "compInsurerLineId", true, `${insurerId}/2`, false, 3, " انتخاب ", undefined, "", false, false, true);
    }
    else
        $("#compInsurerLineId").attr("disabled", true).html("");
});

$("#branchId").on("change", function () {

    let branchId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", true, false, true)

});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        bySystem = 0,
        isActive = 2;


    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", true, false, true);
});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true,
        `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "",
        () => { $("#actionId").trigger("change") }, "", true, false, true);


});


$("#previewReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    modal_show("previewReportModal");
    $("#reportType").val("101").trigger("change");
    setTimeout(function () {
        $('#previewReportModal').trigger('blur');
        $("#previewReportModal select").focus()
    }, 200);


});

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    await loadingAsync(true, "getReport", "fas fa-sticky-note");
    await getReport();

});

$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    var urlCSV = viewData_csv_url;
    loadingAsync(true, "exportCSV", "fa fa-file-excel");
    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
})


$("#reportType").on("change", function () {
    var reportType = +$(this).val();

    if (reportType === 101)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService.mrt`;
    else if (reportType === 103)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService_ByPatientId.mrt`;

});

$("#modal-previewReport").on("click", function () {
   
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let repParameters = reportParameter();

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');


});

initAdmissionReport();

window.Parsley._validatorRegistry.validators.comparedate = undefined
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            var value2 = $(`#${requirement}`).val();

            if (value === "" || value2 === "")
                return true;

            var compareResult = compareShamsiDate(value, value2);
            return compareResult;
        }

    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

window.Parsley._validatorRegistry.validators.chekdoubledate = undefined
window.Parsley.addValidator('chekdoubledate', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            if ((+$("#fromDate").val() == 0 || +$("#toDate").val() == 0) && (+$("#fromReserveDate").val() == 0 || +$("#toReserveDate").val() == 0)) return false;

            return true;
        }
    },
    messages: {
        en: 'وارد کردن تاریخ ثبت یا تاریخ رزرو الزامیست.',
    }
});

window.Parsley._validatorRegistry.validators.shamsidateservice = undefined
window.Parsley.addValidator('shamsidateservice', {
    validateString: function (value) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            if (+value !== 0)
                return isValidShamsiDate(value);
            else
                return true;
        }

    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});



window.Parsley._validatorRegistry.validators.dateisonemonth = undefined;
window.Parsley.addValidator('dateisonemonth', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            let toDateValue = $(`#${requirement}`).val();
            let fromDateValue = value;
            return checkDateIsOnMonth(fromDateValue, toDateValue);
        }


    },
    messages: {
        en: 'بازه تاریخ نمیتواند بیشتر از یک ماه باشد.',
    }
});
