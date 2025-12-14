var viewData_controllername = "PrescriptionReportApi",
    viewData_form_title = "نسخه نویسی",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/`,
    viewData_get_iamgeServiceId = `${viewData_baseUrl_MC}/PrescriptionApi/imageserviceid`,
    viewData_get_labServiceId = `${viewData_baseUrl_MC}/PrescriptionApi/labserviceid`,
    viewData_get_productId = `${viewData_baseUrl_MC}/PrescriptionApi/productid/`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`,
    viewData_get_DiagnosisReasonId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`,
    viewData_get_lateralityId = `${viewData_baseUrl_MC}/PrescriptionApi/lateralityId`,
    viewData_get_totalnumberunitid = `${viewData_baseUrl_MC}/PrescriptionApi/totalnumberunitid`,
    viewData_get_frequencyId = `${viewData_baseUrl_MC}/PrescriptionApi/frequencyid`,
    viewData_get_routeId = `${viewData_baseUrl_MC}/PrescriptionApi/routeid`,
    viewData_get_reasonId = `${viewData_baseUrl_MC}/PrescriptionApi/reasonid`,
    viewData_get_Serverity = `${viewData_baseUrl_MC}/PrescriptionApi/serverityid`,
    reportParameters = [], reportUrl = ``, form = $('#PrescriptionReport').parsley();


$(document).ready(function () {

    settingReportModule();
    //getHeaderColumns();

    $(".select2").select2();
    $("#reportType").val("1").trigger("change");

    fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "patientId", true, "2", true);

    //fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, "basicInsurerId", true, "1", false);
    //fill_select2("/api/AdmissionsApi/compinsurancebox_getdropdown", "compInsuranceBoxId", true, "true/2", false);
    //fill_select2(`${viewData_baseUrl_MC}/ThirdPartyApi/getdropdown`, "thirdPartyId", true, "true/2", false);

    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerId", true, "1/true/2/false");
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsuranceBoxId", true, "2/true/2/false");
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyId", true, "4/true/2/false");

    fill_select2(`/api/GN/UserApi/getdropdown`, "userId", true, "2/false/false" , false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceCenterApi/getdropdown`, "serviceCenterId", true, "2/", false);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "2", true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderId", true, "2", true);
    fill_select2(viewData_get_iamgeServiceId, "imageServiceId", true, 0, true, 2);
    fill_select2(viewData_get_labServiceId, "labServiceId", true, 0, true, 2);
    fill_select2(viewData_get_productId, "productId", true, 0, true);
    fill_select2(viewData_get_StatusId, "statusId", true);
    fill_select2(viewData_get_DiagnosisReasonId, "diagnosisResonId", true, 0, true);
    fill_select2(viewData_get_lateralityId, "lateralityId", true);
    fill_select2(viewData_get_totalnumberunitid, "totalNumberUnitId", true);
    fill_select2(viewData_get_frequencyId, "frequencyId", true);
    fill_select2(viewData_get_routeId, "routeId", true);
    fill_select2(viewData_get_reasonId, "labReasonId", true, 0, true, 3);
    fill_select2(viewData_get_Serverity, "serverityId", true);


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

    let reportParameters = reportParameter(),

        reportModel = {
            reportName: $("#reportType option:selected").text(),
            reportUrl: reportUrl,
            parameters: reportParameters,
            reportSetting: reportSettingModel
        }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
});

async function getReport() {

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
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
    }
}

function parameter() {
    let parameters = {
        fromDatePersian: $("#fromDatePersian").val() == "" ? null : $("#fromDatePersian").val(),
        toDatePersian: $("#toDatePersian").val() == "" ? null : $("#toDatePersian").val(),
        patientId: +$("#patientId").val() == 0 ? null : +$("#patientId").val(),
        basicInsurerId: +$("#basicInsurerId").val() == 0 ? null : +$("#basicInsurerId").val(),
        basicInsuranceBoxId: +$("#basicInsuranceBoxId").val() == 0 ? null : +$("#basicInsuranceBoxId").val(),
        compInsuranceBoxId: +$("#compInsuranceBoxId").val() == 0 ? null : +$("#compInsuranceBoxId").val(),
        thirdPartyId: +$("#thirdPartyId").val() == 0 ? null : +$("#thirdPartyId").val(),
        shabadStatus: $("#shabadStatus").prop("checked"),
        userId: +$("#userId").val() == 0 ? null : +$("#userId").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        serviceCenterId: +$("#serviceCenterId").val() == 0 ? null : +$("#serviceCenterId").val(),
        specialityId: +$("#specialityId").val() == 0 ? null : +$("#specialityId").val(),
        productId: +$("#productId").val() == 0 ? null : +$("#productId").val(),
        totalNumber: +$("#totalNumber").val() == 0 ? null : +$("#totalNumber").val(),
        totalNumberUnitId: +$("#totalNumberUnitId").val() == 0 ? null : +$("#totalNumberUnitId").val(),
        //totalNumberUnitName: $("#totalNumberUnitId").select2('data').length > 0 ? $("#totalNumberUnitId").select2('data')[0].text : "",
        frequencyId: +$("#frequencyId").val() == 0 ? null : +$("#frequencyId").val(),
        //frequencyName: $("#frequencyId").select2('data').length > 0 ? $("#frequencyId").select2('data')[0].text : "",
        routeId: +$("#routeId").val() == 0 ? null : +$("#routeId").val() == 0,
        //routeName: $("#routeId").select2('data').length > 0 ? $("#routeId").select2('data')[0].text : "",
        isCompounded: $("#isCompounded").prop("checked"),
        imageServiceId: +$("#imageServiceId").val() == 0 ? null : +$("#imageServiceId").val(),
        patientInstruction: $("#patientInstruction").val(),
        lateralityId: +$("#lateralityId").val() == 0 ? null : +$("#lateralityId").val(),
        // lateralityName: $("#lateralityId").select2('data').length > 0 ? $("#lateralityId").select2('data')[0].text : "",
        labServiceId: +$("#labServiceId").val() == 0 ? null : +$("#labServiceId").val(),
        reasonId: +$("#labReasonId").val() == 0 ? null : +$("#labReasonId").val(),
        //reasonName: $("#labReasonId").select2('data').length > 0 ? $("#labReasonId").select2('data')[0].text : "",
        statusId: +$("#statusId").val() == 0 ? null : +$("#statusId").val(),
        diagnosisResonId: +$("#diagnosisResonId").val() == 0 ? null : +$("#diagnosisResonId").val(),
        serverityId: +$("#serverityId").val() == 0 ? null : +$("#serverityId").val(),
        //serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
        pageno: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
    };
    return parameters;
}

function reportParameter() {
    let reportParameters = [
        { Item: "FromDate", Value: $(`#fromDatePersian`).val() != "" ? convertToMiladiDate($(`#fromDatePersian`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToDate", Value: $(`#toDatePersian`).val() != "" ? convertToMiladiDate($(`#toDatePersian`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "PatientId", Value: +$(`#patientId`).val() != 0 ? +$(`#patientId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurerId", Value: +$(`#basicInsurerId`).val() != 0 ? +$(`#basicInsurerId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsuranceBoxId", Value: +$(`#basicInsuranceBoxId`).val() != 0 ? +$(`#basicInsuranceBoxId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CompInsuranceBoxId", Value: +$(`#compInsuranceBoxId`).val() != 0 ? +$(`#compInsuranceBoxId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ThirdPartyId", Value: +$(`#thirdPartyId`).val() != 0 ? +$(`#thirdPartyId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ShabadStatus", Value: $(`#shabadStatus`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 0 },
        { Item: "UserId", Value: +$(`#userId`).val() != 0 ? +$(`#userId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "AttenderId", Value: +$(`#attenderId`).val() != 0 ? +$(`#attenderId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ServiceCenterId", Value: +$(`#serviceCenterId`).val() != 0 ? +$(`#serviceCenterId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "SpecialityId", Value: +$(`#specialityId`).val() != 0 ? +$(`#specialityId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ProductId", Value: +$(`#productId`).val() != 0 ? +$(`#productId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        //--------------------
        { Item: "TotalNumber", Value: +$(`#totalNumber`).val() != 0 ? +$(`#totalNumber`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "TotalNumberUnitId", Value: +$(`#totalNumberUnitId`).val() != 0 ? +$(`#totalNumberUnitId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FrequencyId", Value: +$(`#frequencyId`).val() != 0 ? +$(`#frequencyId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "RouteId", Value: +$(`#routeId`).val() != 0 ? +$(`#routeId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PatientInstruction", Value: $(`#patientInstruction`).val() != "" ? $(`#patientInstruction`).val() : "", itemType: "Var" },
        { Item: "LateralityId", Value: +$(`#lateralityId`).val() != 0 ? +$(`#lateralityId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "LabReasonId", Value: +$(`#labReasonId`).val() != 0 ? +$(`#labReasonId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ServerityId", Value: +$(`#serverityId`).val() != 0 ? +$(`#serverityId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },

        { Item: "IsCompounded", Value: $(`#isCompounded`).prop("checked"), SqlDbType: dbtype.dbtype_Bit, Size: 0 },
        { Item: "ImageServiceId", Value: +$(`#imageServiceId`).val() != 0 ? +$(`#imageServiceId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "LabServiceId", Value: +$(`#labServiceId`).val() != 0 ? +$(`#labServiceId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "StatusId", Value: +$(`#statusId`).val() != 0 ? +$(`#statusId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "DiagnosisResonId", Value: +$(`#diagnosisResonId`).val() != 0 ? +$(`#diagnosisResonId`).val() : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromDatePersian", Value: $(`#fromDatePersian`).val() != "" ? $(`#fromDatePersian`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toDatePersian`).val() != "" ? $(`#toDatePersian`).val() : "", itemType: "Var" }
    ]
    return reportParameters;
}

function export_AdmissionCashReport_csv() {

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    export_csv_report(csvModel);
}
