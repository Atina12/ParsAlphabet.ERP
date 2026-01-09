var viewData_controllername = "AdmissionReportApi";
var viewData_form_title = "دریافت / پرداخت";
var viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashreportgetpage`;
var viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashreportcolumns`;
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissioncashreportcsv`;
var viewData_PreviewReport_GetmiladiDateTime = `${viewData_baseUrl_PB}/PublicApi/getmiladidatetime`;
var reportParameters = [];
var roleId = getRoleId();
var reportUrl = ""
var form = $('#admissionCashReport').parsley();



function initRepAdmissionCashReportForm() {

    $(".select2").select2();

    $("#fromCreateDateTimePersian").inputmask();
    $("#toCreateDateTimePersian").inputmask();
    $("#fromTime").inputmask();
    $("#toTime").inputmask();

    kamaDatepicker('fromCreateDateTimePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toCreateDateTimePersian', { withTime: false, position: "bottom" });

    settingReportModule();

    getHeaderColumns();

    tableResizable()

    fillDropDown()

    setTimeout(() => {
        $("#fromCreateDateTimePersian").focus();
    }, 20)
}

function tableResizable() {
    $("table#pagetable th").resizable({
        handles: "w",
        minWidth: 40,
        resize: function (event, ui) {
            var sizerID = "#" + $(event.target).attr("id") + "-sizer";
            $(sizerID).width(ui.size.width);
        }
    });
}

function fillDropDown() {
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true);
    fill_select2(`/api/FMApi/fundtypeactiveadm_getdropdown`, "fundTypeId", true, "", false, 3, "", undefined, "", false, false, true);
    fill_select2(`api/FM/CashierApi/getdropdown_pos`, "posId", true, "", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown`, "detailAccountId", true);
    fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown`, "userId", true, "2", false);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
}

function detailsReport() {
    var repParameters = reportParameter();
    var reportModel = {
        reportName: "صورت ریز دریافت و پرداخت به تفکیک کاربران",
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function summaryFormReport() {
    var repParameters = reportParameter();
    var reportModel = {
        reportName: "صورت خلاصه دریافت و پرداخت به تفکیک کاربران",
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

function parameter() {

    let fromDate = convertToMiladiDate($("#fromCreateDateTimePersian").val());
    let toDate = convertToMiladiDate($("#toCreateDateTimePersian").val());
    let fromTime = `${$("#fromTime").val()}:00.000`;
    let toTime = `${$("#toTime").val()}:59.999`;

    let parameters = {
        fromAdmissionMasterId: $("#fromAdmissionMasterId").val().toString() == "" ? null : +$("#fromAdmissionMasterId").val().toString(),
        toAdmissionMasterId: $("#toAdmissionMasterId").val().toString() == "" ? null : +$("#toAdmissionMasterId").val().toString(),
        branchId: +$("#branchId").val().toString() == "" ? null : $("#branchId").val().toString(),
        actionId: +$("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),
        stageId: +$("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        workflowId: +$("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        currencyId: +$("#currencyId").val() == 0 ? null : +$("#currencyId").val(),
        fundTypeId: +$("#fundTypeId").val().toString() == "" ? null : $("#fundTypeId").val().toString(),
        posIds: +$("#posId").val().toString() == "" ? null : $("#posId").val().toString(),
        DetailAccountId: +$("#detailAccountId").val() == 0 ? null : +$("#detailAccountId").val(),
        FromCashId: +$("#fromCashId").val() == 0 ? null : +$("#fromCashId").val(),
        ToCashId: +$("#toCashId").val() == 0 ? null : +$("#toCashId").val(),
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        userId: +$("#userId").val() == 0 ? null : +$("#userId").val(),
        pageno: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
    };

    return parameters;
}

function reportParameter() {

    let fromDate = convertToMiladiDate($("#fromCreateDateTimePersian").val());
    let toDate = convertToMiladiDate($("#toCreateDateTimePersian").val());
    let fromTime = `${$("#fromTime").val()}:00.000`;
    let toTime = `${$("#toTime").val()}:59.999`;

    let repParameters = [
        { Item: "FromAdmissionMasterId", Value: $(`#fromAdmissionMasterId`).val().toString() == "" ? null : $("#fromAdmissionMasterId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "ToAdmissionMasterId", Value: $(`#toAdmissionMasterId`).val().toString() == "" ? null : $("#toAdmissionMasterId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "BranchId", Value: +$(`#branchId`).val() == 0 ? null : +$("#branchId").val(), SqlDbType: dbtype.SmallInt, Size: 10 },
        { Item: "ActionId", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageId", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CurrencyId", Value: +$(`#currencyId`).val() == 0 ? null : +$("#currencyId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FundTypeId", Value: +$(`#fundTypeId`).val() == 0 ? null : +$("#fundTypeId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PosIds", Value: +$(`#posId`).val() == 0 ? null : +$("#posId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "DetailAccountId", Value: +$(`#detailAccountId`).val() == 0 ? null : +$("#detailAccountId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "FromCashId", Value: +$(`#fromCashId`).val() == 0 ? null : +$("#fromCashId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "ToCashId", Value: +$(`#toCashId`).val() == 0 ? null : +$("#toCashId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "FromDate", Value: $(`#fromCreateDateTimePersian`).val() == "" ? null : fromDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "ToDate", Value: $(`#ToCreateDateTimePersian`).val() == "" ? null : toDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "FromTime", Value: $(`#fromTime`).val() == "" ? null : fromTime, SqlDbType: dbtype.NVarChar, Size: 12 },
        { Item: "ToTime", Value: $(`#toTime`).val() == "" ? null : toTime, SqlDbType: dbtype.NVarChar, Size: 12 },
        { Item: "UserId", Value: +$("#userId").val() == 0 ? null : +$("#userId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromDatePersian", Value: $(`#fromCreateDateTimePersian`).val() != "" ? $(`#fromCreateDateTimePersian`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toCreateDateTimePersian`).val() != "" ? $(`#toCreateDateTimePersian`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
    ]


    let reportType = +$("#reportType").val()

    if (reportType == 101) {
        repParameters.push({ Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 })
        repParameters.push({ Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 })
    }

    return repParameters;
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

function export_AdmissionCashReport_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;


    loadingAsync(true, "exportCSV", "fa fa-file-excel");

    $.ajax({
        url: viewData_csv_url,
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
                window.URL.revokeObjectURL(viewData_csv_url);
            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
};

$("#branchId").on("change", function () {

    var branchId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
    stageClassId = "20";


    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", false, false, true);

});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
    stageClassId = "20,28,30",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true,
        `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$("#stageId").on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        stageClassId = "20",
        workFlowCategoryId = workflowCategoryIds.medicalCare.id;

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);

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

$("#showReport").on("click", async function () {

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

$("#reportType").on("change", function () {
    var reportType = +$(this).val();

    if (reportType === 101)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionCashReportPreview.mrt`;
    else
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionCashReportSummaryFormPreview.mrt`;

});

$("#modal-previewReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let reportType = +$("#reportType").val()
    if (reportType == 101)
        detailsReport()
    else
        summaryFormReport()

});

$("#fundTypeId").on("change", function () {
    var fundTypVal = $(this).val();

    $("#detailAccountId").prop("disabled", false);
    $("#detailAccountId").empty();

    if (fundTypVal.includes('2') || fundTypVal.length == 0)
        $("#posId").val(0).prop("disabled", false).trigger("change");
    else
        $("#posId").val(0).prop("disabled", true).trigger("change");




    if (fundTypVal.includes('1') || fundTypVal.includes('2') || fundTypVal.includes('9') || fundTypVal.includes('14') || fundTypVal.includes('15')) {
        $("#detailAccountId").val(0).prop("disabled", true).trigger("change");

    }
    else if (fundTypVal.includes('10') || fundTypVal.includes('13')) {

        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "detailAccountId", true)
        $("#detailAccountId").removeAttr("disabled");
    }
    else if (fundTypVal.includes('11')) {
        fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "detailAccountId", true, "2", true, 3)
        $("#detailAccountId").removeAttr("disabled");

    }
    else if (fundTypVal.includes('12') || fundTypVal.includes('16')) {
        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "detailAccountId", true, "2")
        $("#detailAccountId").removeAttr("disabled");
    }


});

initRepAdmissionCashReportForm()

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});


window.Parsley._validatorRegistry.validators.chekdoubledate = undefined
window.Parsley.addValidator('chekdoubledate', {
    validateString: function (value, requirement) {

        var value2 = $(`#${requirement}`).val();
        if ((+value == 0 || +value2 == 0)) return false;
        if (value !== "" && value2 !== "" && requirement !== "") {
            return chekdoubledate(value, value2);
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان یکسان نیستند.',
    }

});
