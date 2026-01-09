
var reportUrl = "",
    form = $('.card-body').parsley(), typeCsv = "attender",
    viewData_form_title = "گزارش دستمزد داکتران",
    viewData_controllername = "AdmissionReportApi",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repattendercommissiongetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repattendercommissioncolumns`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repattendercommissioncsv`,
    roleId = getRoleId();

function initRepAdmissionAttenderCommissionForm() {
    $(".select2").select2();

    settingReportModule();

    getHeaderColumns();

    ColumnResizeable("tempCommissionList");

    fillDroptDown()

    $("#dateFrom").inputmask();
    $("#dateTo").inputmask();

    kamaDatepicker('dateFrom', { withTime: false, position: "bottom" });
    kamaDatepicker('dateTo', { withTime: false, position: "bottom" });

    $("#reportType").val("101").trigger("change");

    setTimeout(() => {
        $("#dateFrom").focus();
    }, 20)

}

function fillDroptDown() {
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, 'attenderId', true, "2", true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, 'departmentId', true, "", false, 3, "انتخاب", undefined, "", false, false, true);
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

function parameter() {
    let parameters = {

        branchId: $("#branchId").val().toString() == "" ? null : $("#branchId").val().toString(),
        workflowId: $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        stageId: $("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        actionId: $("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),

        attenderId: +$(`#attenderId`).val() == 0 ? null : +$(`#attenderId`).val(),
        fromDatePersian: $(`#dateFrom`).val(),
        toDatePersian: $(`#dateTo`).val(),
        departmentIds: $(`#departmentId`).val().toString() == "" ? null : $(`#departmentId`).val().toString(),
        pageNo: 0
    };
    return parameters;
}

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

$("#showReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    modal_show("previewReportModal");
    setTimeout(function () {
        $('#previewReportModal').trigger('blur');
        $("#previewReportModal select").focus()
    }, 200);
});

$("#modal-previewReport").on("click", function () {
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (!compareShamsiDate($("#dateFrom").val(), $("#dateTo").val())) {
        var msg = alertify.error("تاریخ شروع از تاریخ پایان بزرگتر است");
        msg.delay(alertify_delay);
        return;
    }
    
    
    let repParameters = [
        { Item: "FromDate", Value: convertToMiladiDate($(`#dateFrom`).val()), SqlDbType: dbtype.VarChar, Size: 10 },
        { Item: "ToDate", Value: convertToMiladiDate($(`#dateTo`).val()), SqlDbType: dbtype.VarChar, Size: 10 },
        { Item: "AttenderId", Value: +$(`#attenderId`).val() == 0 ? null : +$(`#attenderId`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ActionId", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "BranchId", Value: $(`#branchId`).val().toString() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageId", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "DepartmentIds", Value: $(`#departmentId`).val().toString() == "" ? null : $(`#departmentId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 200 },
        { Item: "FromDatePersian", Value: $(`#dateFrom`).val() != "" ? $(`#dateFrom`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#dateTo`).val() != "" ? $(`#dateTo`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 }
    ];

    var reportModel = {
        reportName: `${viewData_form_title} ${$("#reportType option:selected").text()}`,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    };

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    await loadingAsync(true, "getReport", "fas fa-sticky-note");
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) {
        await loadingAsync(false, "getReport", "fas fa-sticky-note");
        return;
    }

    setTimeout(() => { getReport(); }, 5);
});

$("#branchId").on("change", function () {

    var branchId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";// workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22";

    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", false, false, true);

});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";// workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(",");

    $("#actionId").empty();


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);


});

$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repattendercommissioncsv`;
    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    viewData_form_title = "گزارش دستمزد داکتران - صورت ریز";
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
                let element = document.createElement('a');
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
});


$("#exportSummaryCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repattendercommissionsummarycsv`;
    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    viewData_form_title = "گزارش دستمزد داکتران -  صورت خلاصه";
    var urlCSV = viewData_csv_url;

    loadingAsync(true, "exportSummaryCSV", "fa fa-file-excel");

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
                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
            loadingAsync(false, "exportSummaryCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportSummaryCSV", "fa fa-file-excel");
        }
    });
});

$("#reportType").on("change", function () {
    if ($(this).val() === "101")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Service_Summary.mrt`;
    else if ($(this).val() === "102")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Detail.mrt`;
    else if ($(this).val() === "104")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Department.mrt`;
    else if ($(this).val() === "105")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Daily.mrt`;
    else if ($(this).val() === "106")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_DailyDate.mrt`;
    else if ($(this).val() === "108")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Summary.mrt`;
    else if ($(this).val() === "109")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Insurer.mrt`;
    else if ($(this).val() === "110")
        reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Commission_Commission.mrt`;

});

initRepAdmissionAttenderCommissionForm()

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        return compareShamsiDate(value, value2);
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }

});
