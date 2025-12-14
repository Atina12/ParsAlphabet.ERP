var viewData_controllername = "AdmissionReportApi",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repserviceattendertariff`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repserviceattendertariffcolumns`,
    viewData_form_title = "گزارش تعرفه خدمات داکتر",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repserviceattendertariffcsv`,
    reportUrl = `${stimulsBaseUrl.MC.Rep}Attender_ServiceTariff.mrt`,
    form = $('.card-body').parsley();


function initRepAdmissionServiceTariffForm() {

    settingReportModule();

    getHeaderColumns();

    fillDropdownRepAdmissionServiceAttenderTriffForm()

    $("#serviceStatus").prop("checked", true);

    funkyradio_onchange($("#serviceStatus"));

    $(".card-body").children().first().children().children(".form-control").focus();
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

function fillDropdownRepAdmissionServiceAttenderTriffForm() {
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "fromServiceId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "toServiceId", true, "2", true);
    fill_select2(`/api/AdmissionsApi/getthrservicedropdown`, "fromCode", true, 0, true);
    fill_select2(`/api/AdmissionsApi/getthrservicedropdown`, "toCode", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/ServiceTypeApi/getdropdown`, "serviceTypeId", true, "2");
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderId", true, "2", true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "departmentId", true, "", false);
    fill_select2("/api/MC/ServiceTypeApi/getdropdown", "serviceTypeId", true, "2");
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

function parameter() {
    let parameters = {
        AttenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        fromServiceId: +$("#fromServiceId").val() == 0 ? null : +$("#fromServiceId").val(),
        toServiceId: +$("#toServiceId").val() == 0 ? null : +$("#toServiceId").val(),
        ServiceTypeId: +$("#serviceTypeId").val() == 0 ? null : $("#serviceTypeId").val(),
        DepartmentId: +$("#departmentId").val() == 0 ? null : +$("#departmentId").val(),
        fromCode: +$("#fromCode").val() == 0 ? null : +$("#fromCode").val(),
        toCode: +$("#toCode").val() == 0 ? null : +$("#toCode").val(),
        isActive: $("#serviceStatus").prop("checked"),
        pageno: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
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

function export_serviceAttenderTariff_csv() {
    var parameters = parameter();
    parameters.pageno = null;
    parameters.pagerowscount = null;
    export_csv_report(parameters);
}

$("#showReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var repParameters = [
        { Item: "AttenderId", Value: +$(`#attenderId`).val() == 0 ? null : +$(`#attenderId`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromServiceId", Value: +$(`#fromServiceId`).val() == 0 ? null : +$(`#fromServiceId`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ToServiceId", Value: +$(`#toServiceId`).val() == 0 ? null : +$(`#toServiceId`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromCode", Value: +$(`#fromCode`).val() == 0 ? null : +$(`#fromCode`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ToCode", Value: +$(`#toCode`).val() == 0 ? null : +$(`#toCode`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsActive", Value: $(`#serviceStatus`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 0 },
        { Item: "ServiceTypeId", Value: +$(`#serviceTypeId`).val() == 0 ? null : $(`#serviceTypeId`).val(), SqlDbType: dbtype.NVarChar, Size: 4 },
        { Item: "DepartmentId", Value: +$(`#departmentId`).val() == 0 ? null : +$(`#departmentId`).val(), SqlDbType: dbtype.SmallInt, Size: 0 },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 }
    ]

    var reportModel = {
        reportName: "گزارش تعرفه خدمات داکتر",
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

initRepAdmissionServiceTariffForm()