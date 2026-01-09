var viewData_controllername = "AdmissionReportApi";
var viewData_form_title = "گزارش تعرفه خدمات";
var viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repgetservicetariff`;
var viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repservicetariffcolumns`;
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repservicetariffcsv`;
var reportParameters = [];
var reportUrl = `${stimulsBaseUrl.MC.Rep}ServiceTariff.mrt`;
var form = $('#serviceTariff').parsley();



function initRepAdmissionServiceTariffForm() {

    $(".select2").select2()

    $("table#pagetable th").resizable({
        handles: "w",
        minWidth: 40,
        resize: function (event, ui) {
            var sizerID = "#" + $(event.target).attr("id") + "-sizer";
            $(sizerID).width(ui.size.width);
        }
    });

    $("#serviceStatus").prop("checked", true);
    funkyradio_onchange($("#serviceStatus"));

    settingReportModule();
    getHeaderColumns();

    fillDropDown()

    $("#basicInsurerLineId").val("").attr("disabled", true);
    $("#compInsurerLineId").val("").attr("disabled", true);

    $("#insurerTypeId").focus();
    $("#insurerTypeId").trigger("change");
}

function fillDropDown() {
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "fromServiceId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "toServiceId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, "insurerId", true, "1", false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, "compInsurerId", true, "2", false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, "thirdPartyId", true, "3", false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, "discountId", true, "5", false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceTypeApi/getdropdown`, "serviceTypeId", true, "2", false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "serviceId", true, "2", true);
    fill_select2(`/api/AdmissionsApi/getthrservicedropdown`, "fromNationalCode", true, 0, true);
    fill_select2(`/api/AdmissionsApi/getthrservicedropdown`, "toNationalCode", true, 0, true);
}

$("#insurerId").on("change", function () {
    var insurerId = $("#insurerId").val();
    if (insurerId != "" && insurerId > 0) {
        $("#basicInsurerLineId").attr("disabled", false);//.children().remove();
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerline`, "basicInsurerLineId", true, insurerId, false);
    }
    else
        $("#basicInsurerLineId").attr("disabled", true).children().remove();
});

$("#compInsurerId").on("change", function () {
    var compInsurerId = $("#compInsurerId").val();
    if (compInsurerId != "" && compInsurerId > 0) {
        $("#compInsurerLineId").empty();
        $("#compInsurerLineId").attr("disabled", false);//.children().remove();
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerline`, "compInsurerLineId", true, compInsurerId, false);
    }
    else
        $("#compInsurerLineId").attr("disabled", true);//.children().remove()
});

$("#showReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var insurerId = 0, insurerLineId = null;
    let repParameters = ""

    switch (+$("#insurerTypeId").val()) {
        case 1:
            insurerId = +$("#insurerId").val();
            insurerLineId = +$("#basicInsurerLineId").val();
            repParameters = reportParameter(insurerId, insurerLineId);
            getReportPrint(repParameters);
            break;
        case 2:
            insurerId = +$("#compInsurerId").val();
            insurerLineId = +$("#compInsurerLineId").val();
            repParameters = reportParameter(insurerId, insurerLineId);
            break;
        case 4:
            insurerId = +$("#thirdPartyId").val();
            repParameters = reportParameter(insurerId, null);
            getReportPrint(repParameters);
            break;
        case 5:
            insurerId = +$("#discountId").val();
            repParameters = reportParameter(insurerId, null);
            getReportPrint(repParameters);
            break;
    }
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

$("#insurerTypeId").on("change", function () {
    var insurerTypeId = $(this).val();
    switch (+insurerTypeId) {
        case 1:
            $("#compInsurerId").attr("disabled", "disabled");
            $("#compInsurerId").val("0").trigger("change");
            $("#thirdPartyId").attr("disabled", "disabled");
            $("#thirdPartyId").val("0").trigger("change");
            $("#basicInsurerLineId").attr("disabled", "disabled");
            $("#basicInsurerLineId").val("0").trigger("change");
            $("#insurerId").removeAttr("disabled");
            $("#insurerId").prop("required", true);
            $("#basicInsurerLineId").prop("required", true);
            $("#compInsurerId").prop("required", false);
            $("#thirdPartyId").prop("required", false);
            $("#compInsurerLineId").attr("disabled", "disabled");
            $("#compInsurerLineId").val("0").trigger("change");
            $("#compInsurerLineId").prop("required", false);
            $("#discountId").attr("disabled", "disabled");
            $("#discountId").val("0").trigger("change");
            $("#discountId").prop("required", false);

            $("#insurerId").attr("data-parsley-selectvalzero", "data-parsley-selectvalzero");
            $("#basicInsurerLineId").attr("data-parsley-selectvalzero", "data-parsley-selectvalzero");
            $("#compInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#compInsurerId").removeAttr("data-parsley-selectvalzero");
            $("#discountId").removeAttr("data-parsley-selectvalzero");
            $("#thirdPartyId").removeAttr("data-parsley-selectvalzero");

            break;
        case 2:
            $("#compInsurerId").removeAttr("disabled");
            $("#thirdPartyId").attr("disabled", "disabled");
            $("#thirdPartyId").val("0").trigger("change");
            $("#insurerId").val("0").trigger("change");
            $("#insurerId").attr("disabled", "disabled");
            $("#basicInsurerLineId").val("0").trigger("change");
            $("#basicInsurerLineId").attr("disabled", "disabled");
            $("#insurerId").prop("required", false);
            $("#compInsurerId").prop("required", true);
            $("#thirdPartyId").prop("required", false);
            $("#basicInsurerLineId").prop("required", false);
            $("#compInsurerLineId").prop("required", false);
            $("#compInsurerLineId").val("0").trigger("change");
            $("#compInsurerLineId").attr("disabled", "disabled");
            $("#discountId").val("0").trigger("change");
            $("#discountId").attr("disabled", "disabled");
            $("#discountId").prop("required", false);
            $("#insurerId").removeAttr("data-parsley-selectvalzero");
            $("#discountId").removeAttr("data-parsley-selectvalzero");
            $("#basicInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#compInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#compInsurerId").attr("data-parsley-selectvalzero", "data-parsley-selectvalzero");
            $("#thirdPartyId").removeAttr("data-parsley-selectvalzero");

            break;
        case 3:
            $("#compInsurerId").attr("disabled", "disabled");
            $("#compInsurerId").val("0").trigger("change");
            $("#thirdPartyId").removeAttr("disabled");
            $("#insurerId").val("0").trigger("change");
            $("#insurerId").attr("disabled", "disabled");
            $("#basicInsurerLineId").val("0").trigger("change");
            $("#basicInsurerLineId").attr("disabled", "disabled");
            $("#insurerId").prop("required", false);
            $("#basicInsurerLineId").prop("required", false);
            $("#compInsurerLineId").prop("required", false);
            $("#compInsurerId").prop("required", false);
            $("#thirdPartyId").prop("required", true);
            $("#compInsurerLineId").val("0").trigger("change");
            $("#compInsurerLineId").attr("disabled", "disabled");
            $("#discountId").val("0").trigger("change");
            $("#discountId").attr("disabled", "disabled");
            $("#discountId").prop("required", false);

            $("#compInsurerId").removeAttr("data-parsley-selectvalzero");
            $("#basicInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#compInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#insurerId").removeAttr("data-parsley-selectvalzero");
            $("#discountId").removeAttr("data-parsley-selectvalzero");
            $("#thirdPartyId").attr("data-parsley-selectvalzero", "data-parsley-selectvalzero");

            break;
        case 5:
            $("#compInsurerId").attr("disabled", "disabled");
            $("#compInsurerId").val("0").trigger("change");
            $("#insurerId").val("0").trigger("change");
            $("#insurerId").attr("disabled", "disabled");
            $("#basicInsurerLineId").val("0").trigger("change");
            $("#basicInsurerLineId").attr("disabled", "disabled");
            $("#insurerId").prop("required", false);
            $("#basicInsurerLineId").prop("required", false);
            $("#compInsurerLineId").prop("required", false);
            $("#compInsurerId").prop("required", false);
            $("#thirdPartyId").prop("required", false);
            $("#compInsurerLineId").val("0").trigger("change");
            $("#compInsurerLineId").attr("disabled", "disabled");

            $("#compInsurerId").removeAttr("data-parsley-selectvalzero");
            $("#basicInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#compInsurerLineId").removeAttr("data-parsley-selectvalzero");
            $("#insurerId").removeAttr("data-parsley-selectvalzero");
            $("#discountId").removeAttr("disabled");
            $("#discountId").prop("required", true);
            $("#discountId").attr("data-parsley-selectvalzero", "data-parsley-selectvalzero");

            break;
    }
    $("#insurerIdContainer").parent().find("ul li").html("");
    $("#compInsurerIdContainer").parent().find("ul li").html("");
    $("#thirdPartyIdContainer").parent().find("ul li").html("");
    $("#basicInsurerLineIdContainer").parent().find("ul li").html("");
    $("#compInsurerLineIdContainer").parent().find("ul li").html("");
    $("#discountIdContainer").parent().find("ul li").html("");
});

$("#modal-previewReport").on("click", function () {
    var insurerId = 0, insurerLineId = null;

    let repParameters = ""

    switch (+$("#insurerTypeId").val()) {
        case 1:
            insurerId = +$("#insurerId").val();
            insurerLineId = +$("#basicInsurerLineId").val();
            repParameters = reportParameter(insurerId, insurerLineId);
            getReportPrint(repParameters);
            break;
        case 2:
            insurerId = +$("#compInsurerId").val();
            insurerLineId = +$("#compInsurerLineId").val();
            repParameters = reportParameter(insurerId, insurerLineId);
            break;
        case 4:
            insurerId = +$("#thirdPartyId").val();
            repParameters = reportParameter(insurerId, null);
            getReportPrint(repParameters);
            break;
        case 5:
            insurerId = +$("#discountId").val();
            repParameters = reportParameter(insurerId, null);
            getReportPrint(repParameters);
            break;
    }
});

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

function parameter() {
    var insurerId = 0, insurerLineId = 0;
    switch (+$("#insurerTypeId").val()) {
        case 1:
            insurerId = +$("#insurerId").val();
            insurerLineId = +$("#basicInsurerLineId").val();
            break;
        case 2:
            insurerId = +$("#compInsurerId").val();
            insurerLineId = +$("#compInsurerLineId").val();
            break;
        case 4:
            insurerId = +$("#thirdPartyId").val();
            insurerLineId = null;
            break;
        case 5:
            insurerId = +$("#discountId").val();
            insurerLineId = null;
            break;
    }

    let parameters = {
        serviceTypeId: +$("#serviceTypeId").val() == 0 ? null : $("#serviceTypeId").val(),
        fromServiceId: +$("#fromServiceId").val() == 0 ? null : +$("#fromServiceId").val(),
        toServiceId: +$("#toServiceId").val() == 0 ? null : +$("#toServiceId").val(),
        insurerId: insurerId,
        insurerLineId: insurerLineId,
        serviceActive: $("#serviceStatus").prop("checked"),
        insurerTypeId: +$("#insurerTypeId").val() == 0 ? null : +$("#insurerTypeId").val(),
        fromNationalCode: +$("#fromNationalCode").val() == 0 ? null : +$("#fromNationalCode").val(),
        toNationalCode: +$("#toNationalCode").val() == 0 ? null : +$("#toNationalCode").val(),
        pageno: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
    };

    return parameters;
}

function getReportPrint(repParameters) {
    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function reportParameter(insurerId, insurerLineId) {
    let repParameters = [
        { Item: "ServiceTypeId", Value: $(`#serviceTypeId`).val() == 0 ? null : $("#serviceTypeId").val(), SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "FromServiceId", Value: +$(`#fromServiceId`).val() == 0 ? null : +$("#fromServiceId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ToServiceId", Value: +$(`#toServiceId`).val() == 0 ? null : +$("#toServiceId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "InsurerId", Value: insurerId, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "InsurerLineId", Value: insurerLineId, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ServiceActive", Value: $("#serviceStatus").prop("checked"), SqlDbType: dbtype.Bit, Size: 0 },
        { Item: "InsurerTypeId", Value: +$(`#insurerTypeId`).val() == 0 ? null : +$("#insurerTypeId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromNationalCode", Value: +$(`#fromNationalCode`).val() == 0 ? null : +$("#fromNationalCode").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ToNationalCode", Value: +$(`#toNationalCode`).val() == 0 ? null : +$("#toNationalCode").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 }
    ]
    return repParameters;
}

function export_serviceTariff_csv() {
    var parameters = parameter();
    parameters.pageno = null;
    parameters.pagerowscount = null;
    export_csv_report(parameters);
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

initRepAdmissionServiceTariffForm()

window.Parsley._validatorRegistry.validators.selectvalzero = undefined
window.Parsley.addValidator("selectvalzero", {
    validateString: function (value) {
        if (value == 0)
            return false;

        return true;
    },
    messages: {
        en: 'ورود اطلاعات الزامي'
    }
});

window.Parsley._validatorRegistry.validators.rangeidth = undefined;
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

