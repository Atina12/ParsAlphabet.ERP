var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش پذیرش",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashclosegetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashclosecolumns`,
    viewData_form_title = "گزارش بستن صندوق",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashclosecsv`;

var reportUrl = "";
var form = $('.card-body').parsley();

function initadmissionCashClose() {
    settingReportModule();
    getHeaderColumns();
    $(".select2").select2();
    $("#fromWorkDayDatePersian").inputmask();
    $("#toWorkDayDatePersian").inputmask();
    kamaDatepicker('fromWorkDayDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toWorkDayDatePersian', { withTime: false, position: "bottom" });

    fill_select2("/api/GN/BranchApi/getdropdown", "branchId", true, 0, false);
    fill_select2(`/api/GN/UserApi/getdropdown`, "createUserId", true, "2", false);
    setTimeout(() => $("#branchId").select2("focus"), 5);
}

$("#reportType").on("change", function () {
    reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionClose${$(this).val()}.mrt`;
});

$("#reportType").val("6").trigger("change");

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


    var repParameters = [
        { Item: "FromWorkDayDate", Value: convertToMiladiDate($(`#fromWorkDayDatePersian`).val()), SqlDbType: dbtype.Date, },
        { Item: "ToWorkDayDate", Value: convertToMiladiDate($(`#toWorkDayDatePersian`).val()), SqlDbType: dbtype.Date, },
        { Item: "CreateUserId", Value: +$(`#createUserId`).val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "BranchId", Value: +$(`#branchId`).val(), SqlDbType: dbtype.SmallInt, Size: 10 },
        { Item: "FromWorkDayDatePersian", Value: $(`#fromWorkDayDatePersian`).val(), itemType: "Var" },
        { Item: "ToWorkDayDatePersian", Value: $(`#toWorkDayDatePersian`).val(), itemType: "Var" },
    ]

    var reportModel = {
        reportName: $("#reportType option:selected").text(),
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

function parameter() {
    let parameters = {
        fromWorkDayDatePersian: $("#fromWorkDayDatePersian").val(),
        toWorkDayDatePersian: $("#toWorkDayDatePersian").val(),
        createUserId: +$("#createUserId").val(),
        branchId: +$("#branchId").val(),
        pageNo: 0
    };
    return parameters;
}

async function getReport() {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    reportParameters = parameter();
    initialPageing();
    createPageFooterInfo(0, 0, 0, true);
    getReportAsync(reportParameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        checkSumDynamic(reportParameters);
    });
};

function export_serviceAttenderTariff_csv() {
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

window.Parsley._validatorRegistry.validators.rangeidth = undefined
window.Parsley.addValidator("rangeidth", {
    validateString: function (value) {
        var from = +$("#fromServiceId").val();
        var to = +$("#toServiceId").val();
        var range = comparisonStartEnd(from, to);

        return !range;
    },
    messages: {
        en: 'محدوده شناسه خدمت اشتباه می باشد'
    }
});


initadmissionCashClose()