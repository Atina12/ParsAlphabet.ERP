var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش کاربران",
    viewData_PreviewReport_AdmissionUserSeviceReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionserviceuserreportpreview`,
    viewData_PreviewReport_AdmissionUserSaleReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionsaleuserreportpreview`,
    viewData_PreviewReport_GetReport = "",
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionuserreportcolumns`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionuserreportcsv`,
    form = $('#AdmissionUserReport').parsley(),
    roleId = getRoleId(),
    reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceUserReportPreview.mrt`;

//var reportParameters = reportParameterDetails(0);

function initRepAdmissionUserForm() {

    $(".select2").select2();

    $("#fromDate").inputmask();
    $("#toDate").inputmask();

    kamaDatepicker('fromDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toDate', { withTime: false, position: "bottom" });

    fillDropDown();

    tableResizable()

    settingReportModule();

    getHeaderColumns();

    setTimeout(() => {
        $("#fromDate").focus();
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

    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderId", true, "2", true);
    fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown`, "userId", true, "2/false/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, 'departmentId', true, 0, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, "vendorId", true, 0, false, 3, "", undefined, "", false, false, true);
}

async function getReport() {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    viewData_PreviewReport_GetReport = "";

    if ($("#itemType").val() == 1)
        viewData_PreviewReport_GetReport = viewData_PreviewReport_AdmissionUserSaleReport;
    else
        viewData_PreviewReport_GetReport = viewData_PreviewReport_AdmissionUserSeviceReport;

    reportParameters = parameter();

    initialPageing();
    getReportAsync(reportParameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        createPageFooterInfo(1, +reportParameters.pageRowsCount, 1);
        checkSumDynamic(reportParameters);
    });

    //main_getReport();

   
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
    let Parameters = {
        itemTypeId: +$("#itemType").val() == 0 ? null : +$("#itemType").val(),
        branchId: +$("#branchId").val().toString() == "" ? null : $("#branchId").val().toString(),
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : $("#attenderId").val(),
        departmentId: +$("#departmentId").val() == 0 ? null : $("#departmentId").val(),
        actionId: +$("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),
        stageId: +$("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        workflowId: +$("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        vendorId: +$("#vendorId").val().toString() == "" ? null : $("#vendorId").val().toString(),
        userId: $("#userId").val().toString() == "" ? null : $("#userId").val().toString(),
        pageNo: 0,
        pagerowscount: +$(`#dropDownCountersName`).text()
    };
    return Parameters;
}

function reportParameterDetails(type) {

    var sd = $(`#fromDate`).val().trim().split('/');
    var sdate = sd[0].trim() + "/" + sd[1].trim() + "/" + sd[2].trim();
    var ed = $(`#toDate`).val().trim().split('/');
    var edate = ed[0].trim() + "/" + ed[1].trim() + "/" + ed[2].trim();

    let reportParameters = [];

    reportParameters = [
        { Item: "BranchId", Value: $(`#branchId`).val().toString() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "FromDate", Value: $(`#fromDate`).val() == "" ? null : convertToMiladiDate(sdate), SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToDate", Value: $(`#toDate`).val() == "" ? null : convertToMiladiDate(edate), SqlDbType: dbtype.NVarChar, Size: 10 },

        { Item: "ActionId", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageId", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },

        { Item: "UserId", Value: $("#userId").val().toString() == "" ? null : $("#userId").val().toString(), SqlDbType: dbtype.NVarchar, Size: 500 },

        { Item: "FromDatePersian", Value: $(`#fromDate`).val() != "" ? $(`#fromDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toDate`).val() != "" ? $(`#toDate`).val() : "", itemType: "Var" },       
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
    ];

    if (type == 1 || type == 3) {
        reportParameters.push({ Item: "VendorId", Value: +$(`#vendorId`).val() == 0 ? null : $("#vendorId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 });
        reportParameters.push({ Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 });

    }

    if (type == 2 || type == 4) {
        reportParameters.push({ Item: "AttenderId", Value: +$(`#attenderId`).val() == 0 ? null : $("#attenderId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "DepartmentId", Value: +$(`#departmentId`).val() == 0 ? null : $("#departmentId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 });
        reportParameters.push({ Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 });
    }

    if (type == 5) {

        reportParameters.push({ Item: "DepartmentId", Value: +$(`#departmentId`).val() == 0 ? null : $("#departmentId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "AttenderId", Value: +$(`#attenderId`).val() == 0 ? null : $("#attenderId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "VendorId", Value: +$(`#vendorId`).val() == 0 ? null : $("#vendorId").val(), SqlDbType: dbtype.NVarChar, Size: 500 });
        reportParameters.push({ Item: "ItemTypeId", Value: +$("#itemType").val() == 0 ? null : +$("#itemType").val(), SqlDbType: dbtype.Int, Size: 500 });
    }
    return reportParameters;
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

$("#reportType").on("change", function () {
    var val = $(this).val();

    if (val === "1")
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionSaleUserReportPreview.mrt`;
    else if (val === "3")
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionDetailSaleUser.mrt`;
    else if (val === "2")
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionDetailServiceUser.mrt`;
    else if (val === "4")
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceUserByAttenderReportPreview.mrt`;
    else if (val === "5")
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionUserReportPreview.mrt`;
});

$("#branchId").on("change", function () {

    var branchId = $(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id;
    if (+$("#itemType").val() == 2)
        stageClassId = "17,22,28";
    else
        stageClassId = "19,30";

    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", false, false, true);
});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        bySystem = 0,
        isActive = 2;
    if (+$("#itemType").val() == 2)
        stageClassId = "17,22,28";
    else
        stageClassId = "19,30";




    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),       
        workFlowCategoryId = "10,14";// workflowCategoryIds.medicalCare.id;

    if (+$("#itemType").val() == 2)
        stageClassId = "17,22,28";
    else
        stageClassId = "19,30";

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);

});

$("#itemType").change(function () {

    let itemTypeVal = +$(this).val()
    var branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id;
    if (itemTypeVal == 1) {
        $("#attenderContainer").addClass("displaynone");
        $("#departmentContainer").addClass("displaynone");
        $("#vendorContainer").removeClass("displaynone");
        $(".salePreview").removeClass("d-none");
        $(".servicePreview").addClass("d-none");
        stageClassId = "17,22";
    }
    else {
        $("#attenderContainer").removeClass("displaynone");
        $("#departmentContainer").removeClass("displaynone");
        $("#vendorContainer").addClass("displaynone");
        $(".salePreview").addClass("d-none");
        $(".servicePreview").removeClass("d-none");
        stageClassId = "19";
    }

    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", false, false, true);

    $("#reportType").find("option:not(.d-none)").first().prop("selected", true);
    $("#reportType").trigger("change")

    $("#actionId").val(0).trigger("change")
    $("#branchId").val(0).trigger("change")
    $("#userId").val(0).trigger("change")
    $("#attenderId").val(0).trigger("change")
    $("#vendorId").val(0).trigger("change")
    $("#departmentId").val(0).trigger("change")

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

$("#reportType").prop("selectedIndex", 0).trigger("change");

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

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let repParameters = reportParameterDetails(+$("#reportType").val());

    var reportModel = {
        reportName: $("#reportType option:selected").text(),
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
});

initRepAdmissionUserForm()

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

