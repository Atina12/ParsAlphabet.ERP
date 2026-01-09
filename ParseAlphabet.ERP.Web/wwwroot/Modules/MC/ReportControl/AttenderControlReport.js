var viewData_controllername = "ReportControlApi",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/attendercontrolgetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/attendercontrolcolumns`,
    viewData_form_title = "گزارش کنترلی داکتران",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/attendercontrolcsv`,
    reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_Control.mrt`,
    form = $('.card-body').parsley();


function initAttenderControllerReport() {

    settingReportModule();

    getHeaderColumns();

    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, 'attenderId', true, "2", true);

    $("#serviceStatus").prop("checked", true);

    funkyradio_onchange($("#serviceStatus"));

    $(".card-body select#branchId").select2("focus");

    $("table#pagetable th").resizable({
        handles: "w",
        minWidth: 40,
        resize: function (event, ui) {
            var sizerID = "#" + $(event.target).attr("id") + "-sizer";
            $(sizerID).width(ui.size.width);
        }
    });
    $("#attenderId").select2("focus");
}

async function getReport() {
    let parameters = parameter();
    initialPageing();
    getReportAsync(parameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        createPageFooterInfo(0, 0, 0, true);
        checkSumDynamic(parameters);
    });
};

function parameter() {
    let Parameters = {
        AttenderId: +$("#attenderId").val(),
        Type: +$("#type").val(),
        IsActive: $("#serviceStatus").prop("checked")
    };
    return Parameters;
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

function exportd_insurerControl_csv() {
    var parameters = parameter();
    export_csv_report(parameters);
}

function export_csv_report(csvModel) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    if (csvModel == null) {
        var msg = alertify.warning("پارامترهای گزارش مقدار دهی نشده");
        msg.delay(alertify_delay);
    }
    else {
        loadingAsync(true, "exportCSV", "fa fa-file-excel");
        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);
                loadingAsync(false, "exportCSV", "fa fa-file-excel");
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url)
                loadingAsync(false, "exportCSV", "fa fa-file-excel");
            }
        });
    }

}

$("#showReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var repParameters = [
        { Item: "AttenderId", Value: +$(`#attenderId`).val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "Type", Value: +$(`#type`).val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "IsActive", Value: $(`#serviceStatus`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 10 }
    ]

    var reportModel = {
        reportName: `${viewData_form_title} ${$("#type option:selected").text()}`,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

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

initAttenderControllerReport()

