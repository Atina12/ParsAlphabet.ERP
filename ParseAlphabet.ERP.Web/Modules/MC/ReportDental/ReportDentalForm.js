var viewData_controllername = "DentalReportApi",
    viewData_form_title = "نسخه نویسی",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repdentalgetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repdentalcolumns`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repdentalcsv`,
    viewData_get_toothName = `${viewData_baseUrl_MC}/DentalApi/gettoothnamedropdown`,
    viewData_get_toothPart = `${viewData_baseUrl_MC}/DentalApi/gettoothpartdropdown`,
    viewData_get_toothSegment = `${viewData_baseUrl_MC}/DentalApi/gettoothsegmentdropdown`,

    reportParameters = [], reportUrl = ``, form = $('#DentalReport').parsley();


$(document).ready(function () {

    settingReportModule();

    $(".select2").select2();
    $("#reportType").val("1").trigger("change");

    fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "patientId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerId", true, "1/true/2/false");
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsurerId", true, "2/true/2/false");
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyId", true, "4/true/2/false");
    fill_select2(`/api/GN/UserApi/getdropdown`, "userId", true, "2/false/false" , false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceCenterApi/getdropdown`, "serviceCenterId", true,"2/", false);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderId", true, "2", true);
    fill_select2(viewData_get_toothName, "toothId", true);
    fill_select2(viewData_get_toothPart, "partId", true);
    fill_select2(viewData_get_toothSegment, "segmentId", true);

    $("#fromDatePersian").inputmask();
    $("#toDatePersian").inputmask();

    kamaDatepicker('fromDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toDatePersian', { withTime: false, position: "bottom" });

    $("#fromDatePersian").focus();
});

$("#basicInsurerId").on("change", function () {

    //$("#basicInsuranceBoxId").attr("disabled", false).children().remove();
    //var insurerId = $("#basicInsurerId").val();
    //if (+insurerId !== 0) fill_select2(`/api/AdmissionsApi/insurancebox_getdropdown/${insurerId}`, "basicInsuranceBoxId", true, 0, false);
    //else $("#basicInsuranceBoxId").attr("disabled", true).children().remove();

    let insurerId = +$(this).val();

    if (insurerId != 0) {

        $("#basicInsuranceBoxId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsuranceBoxId", true, `${insurerId}/2`);
    }
    else
        $("#basicInsuranceBoxId").attr("disabled", true).html("");

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

$("#reportType").on("change", function () {
    var val = $(this).val();

    if (val === "101")
        reportUrl = `${stimulsBaseUrl.MC.Rep}`;
    else if (val === "102")
        reportUrl = `${stimulsBaseUrl.MC.Rep}`;
    else
        reportUrl = `${stimulsBaseUrl.MC.Rep}`;

});

$("#showReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    modal_show('previewReportModal');
});

$("#modal-previewReport").on("click", function () {

    let repParameters = reportParameter(),

        reportModel = {
            reportName: $("#reportType option:selected").text(),
            reportUrl: reportUrl,
            parameters: repParameters,
            reportSetting: reportSettingModel
        }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
});

async function getReport() {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    let parameters = parameter();
    initialPageing();
    getReportAsync(parameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        createPageFooterInfo(1, +parameters.pagerowscount, 1);
        checkSumDynamic(parameters);
    });
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
    let parameters = {
        fromDatePersian: $("#fromDatePersian").val() == "" ? null : $("#fromDatePersian").val(),
        toDatePersian: $("#toDatePersian").val() == "" ? null : $("#toDatePersian").val(),
        patientId: +$("#patientId").val() == 0 ? null : +$("#patientId").val(),
        basicInsurerId: +$("#basicInsurerId").val() == 0 ? null : +$("#basicInsurerId").val(),
        basicInsuranceBoxId: +$("#basicInsuranceBoxId").val() == 0 ? null : +$("#basicInsuranceBoxId").val(),
        compInsuranceBoxId: +$("#compInsurerId").val() == 0 ? null : +$("#compInsurerId").val(),
        thirdPartyId: +$("#thirdPartyId").val() == 0 ? null : +$("#thirdPartyId").val(),
        shabadStatus: $("#shabadStatus").prop("checked"),
        userId: +$("#userId").val() == 0 ? null : +$("#userId").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        serviceCenterId: +$("#serviceCenterId").val() == 0 ? null : +$("#serviceCenterId").val(),
        specialityId: +$("#specialityId").val() == 0 ? null : +$("#specialityId").val(),
        isMissing: $("#isMissing").prop("checked"),
        toothId: +$("#toothId").val() == 0 ? null : +$("#toothId").val(),
        partId: +$("#partId").val() == 0 ? null : +$("#partId").val(),
        segmentId: +$("#segmentId").val() == 0 ? null : +$("#segmentId").val(),
        pageno: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
    };
    return parameters;
}

function reportParameter() {
    let repParameters = [
        { Item: "FromDate", Value: $(`#fromDatePersian`).val() != "" ? convertToMiladiDate($(`#fromDatePersian`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToDate", Value: $(`#toDatePersian`).val() != "" ? convertToMiladiDate($(`#toDatePersian`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "PatientId", Value: +$(`#patientId`).val() != 0 ? +$(`#patientId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurerId", Value: +$(`#basicInsurerId`).val() != 0 ? +$(`#basicInsurerId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsuranceBoxId", Value: +$(`#basicInsuranceBoxId`).val() != 0 ? +$(`#basicInsuranceBoxId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CompInsuranceBoxId", Value: +$(`#compInsurerId`).val() != 0 ? +$(`#compInsurerId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ThirdPartyId", Value: +$(`#thirdPartyId`).val() != 0 ? +$(`#thirdPartyId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ShabadStatus", Value: $(`#shabadStatus`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 0 },
        { Item: "UserId", Value: +$(`#userId`).val() != 0 ? +$(`#userId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "AttenderId", Value: +$(`#attenderId`).val() != 0 ? +$(`#attenderId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ServiceCenterId", Value: +$(`#serviceCenterId`).val() != 0 ? +$(`#serviceCenterId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "SpecialityId", Value: +$(`#specialityId`).val() != 0 ? +$(`#specialityId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsMissing", Value: $(`#isMissing`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 0 },
        { Item: "ToothId", Value: +$(`#toothId`).val() != 0 ? +$(`#toothId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PartId", Value: +$(`#partId`).val() != 0 ? +$(`#partId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "SegmentId", Value: +$(`#segmentId`).val() != 0 ? +$(`#segmentId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromDatePersian", Value: $(`#fromDatePersian`).val() != "" ? $(`#fromDatePersian`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toDatePersian`).val() != "" ? $(`#toDatePersian`).val() : "", itemType: "Var" }
    ]
    return repParameters;
}

function export_AdmissionCashReport_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
 
    export_csv_report(csvModel);
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
