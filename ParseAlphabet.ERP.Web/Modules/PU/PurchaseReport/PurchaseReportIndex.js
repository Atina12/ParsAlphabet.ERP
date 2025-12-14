var viewData_controllername = "PurchaseReportApi",
    viewData_form_title = "گزارش خرید",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_PU}/${viewData_controllername}/purchasereportpreview`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_PU}/${viewData_controllername}/reppurchasecolumns`,
    viewData_csv_url = `${viewData_baseUrl_PU}/${viewData_controllername}/reppurchasecsv`,
    viewData_stage_url = `${viewData_baseUrl_WF}/StageApi/getdropdown`,
    form = $('#purchaseForm').parsley(), reportUrl = ``,
    roleId = getRoleId(),
    viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;


function initPurcheseReportIndex() {

    $(".select2").select2();

    $("#fromCreateDate").inputmask();
    $("#toCreateDate").inputmask();

    kamaDatepicker('fromCreateDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toCreateDate', { withTime: false, position: "bottom" });

    settingReportModule();

    getHeaderColumns();

    fillDropDown()

    $("#reportType").val("101").trigger("change");

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 200)
}

function fillDropDown() {

    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);

    fill_select2(`/api/WHApi/itemTypeSalesPrice_getDropDown`, "itemTypeId", true, 0, false);
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true);
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false, 3, "", undefined, "", false, false, true);
    fill_select2(`/api/GN/UserApi/getdropdown`, "createUserId", true, "2/false/false", false);
    fill_select2(`/api/WH/ItemUnitApi/getdropdown`, "unitId", true, 0, false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "attributeId", true, null, false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_nextstage`, "noSeriesId", true, 1);

}

function documentDateValid(callBack = undefined) {
    $.ajax({
        url: viewData_fiscalYearGetReccord,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$("#fiscalId").val()),
        success: function (result) {
            var fiscalStartDate = +result.startDatePersian.replace(/\//g, "");
            var fiscalEndDate = +result.endDatePersian.replace(/\//g, "");
            var fromDate = +$("#fromCreateDate").val().replace(/\//g, "");
            var toDate = +$("#toCreateDate").val().replace(/\//g, "");
            if ((fromDate <= fiscalEndDate && fromDate >= fiscalStartDate) && (toDate <= fiscalEndDate && toDate >= fiscalStartDate))
                result = true;
            else
                result = false;
            if (typeof callBack == "function")
                callBack(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_fiscalYearGetReccord);
            return "";
        }
    });
}

async function getReport() {

    reportParameters = parameter();

    initialPageing();
    getReportAsync(reportParameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        createPageFooterInfo(1, +reportParameters.pageRowsCount, 1);
        checkSumDynamic(reportParameters);
    });
};

function parameter() {

    let fromCreateDate = moment.from($("#fromCreateDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let toCreateDate = moment.from($("#toCreateDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');

    let parameters = {

        pageNo: 0,
        pageRowsCount: +$(`#dropDownCountersName`).text(),
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        noSeriesId: +$("noSeriesId").val() == 0 ? null : +$("noSeriesId").val(),
        personGroupId: $("#personGroupId").val() == "" ? null : $("#personGroupId").val().toString(),
        accountDetailId: $("#accountDetailId").val() == "" ? null : $("#accountDetailId").val().toString(),
        workflowId: $("#workflowId").val() == "" ? null : $("#workflowId").val().toString(),
        stageId: $("#stageId").val() == "" ? null : $("#stageId").val().toString(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        currencyId: $("#currencyId").val() == "" ? null : $("#currencyId").val().toString(),
        createUserId: +$("#createUserId").val() == 0 ? null : +$("#createUserId").val(),
        itemTypeId: +$("#itemTypeId").val() == 0 ? null : +$("#itemTypeId").val(),
        itemId: $("#itemId").val() == "" ? null : $("#itemId").val().toString(),
        unitId: $("#unitId").val() == "" ? null : $("#unitId").val().toString(),
        attributeIds: $("#attributeId").val() == "" ? null : $("#attributeId").val().join("-").toString(),
        fromCreateDate: fromCreateDate == null ? "" : fromCreateDate,
        toCreateDate: toCreateDate == null ? "" : toCreateDate,

    };

    return parameters;
}

function reportParameter() {

    let fromCreateDate = moment.from($("#fromCreateDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let toCreateDate = moment.from($("#toCreateDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    

    let reportParameters = [

        { Item: "BranchId", Value: $(`#branchId`).val() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 20 },
        { Item: "NoSeriesId", Value: +$(`#noSeriesId`).val() == 0 ? null : $("#noSeriesId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "PersonGroupId", Value: $(`#personGroupId`).val() == "" ? null : $("#personGroupId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "AccountDetailId", Value: $(`#accountDetailId`).val() == "" ? null : $("#accountDetailId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "stageId", Value: $(`#stageId`).val() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "ActionId", Value: $(`#actionId`).val() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "CurrencyId", Value: $("#currencyId").val() == "" ? null : $("#currencyId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "CreateUserId", Value: +$(`#createUserId`).val() == 0 ? null : +$("#createUserId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "ItemTypeId", Value: +$(`#itemTypeId`).val() == 0 ? null : +$("#itemTypeId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "ItemId", Value: +$(`#itemId`).val() == 0 ? null : +$("#itemId").val(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "UnitId", Value: $(`#unitId`).val() == "" ? null : $("#unitId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "AttributeIds", Value: $(`#attributeId`).val() == "" ? null : $("#attributeId").val().join("-").toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "fromCreateDate", Value: fromCreateDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toCreateDate", Value: toCreateDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "FromCreateDate", Value: $("#fromCreateDate").val() != "" ? $("#fromCreateDate").val() : "", itemType: "Var" },
        { Item: "ToCreateDate", Value: $("#toCreateDate").val() != "" ? $("#toCreateDate").val() : "", itemType: "Var" },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromDatePersian", Value: $(`#fromCreateDate`).val() != "" ? $(`#fromCreateDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toCreateDate`).val() != "" ? $(`#toCreateDate`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
    ]
    return reportParameters;
}

function export_purchase_csv() {

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    export_csv_report(csvModel);
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
})

$("#modal-previewReport").on("click", function () {
    var reportParameters = reportParameter();

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
})

$("#reportType").on("change", function () {
    if ($(this).val() === "101")
        reportUrl = `${stimulsBaseUrl.PU.Rep}PurchaseOrder_Details.mrt`;
    else if ($(this).val() === "102")
        reportUrl = `${stimulsBaseUrl.PU.Rep}PurchaseOrder_VendorDetails.mrt`;
})

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;


    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {

            if (res) {
                loadingAsync(true, "getReport", "fas fa-sticky-note");
                setTimeout(() => { getReport(); }, 5);
            }
            else {
                var msg = alertify.error('تاریخ سند در بازه معتبر نمیباشد');
                msg.delay(alertify_delay);
                return;
            }
        });
    }
    else {
        loadingAsync(true, "getReport", "fas fa-sticky-note");
        setTimeout(() => { getReport(); }, 5);
    }
})

$("#branchId").on("change", function () {
    
    var branchId = $(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = workflowCategoryIds.purchase.id,
        stageClassId = 0;

    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "", () => { $("#workflowId").trigger("change") }, "", false, false, true);

})

$("#workflowId").on("change", function () {
    
    let workflowId = $(this).val() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.purchase.id,
        stageClassId = 0,
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);

})

$('#stageId').on('change', function () {
    
    let stageId = $("#stageId").val() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.purchase.id,
        stageClassId = "1,2,3,7",
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(",");

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);
  
})

$("#fiscalId").change(function () {
    if (+$(this).val() != 0) {
        $.ajax({
            url: viewData_fiscalYearGetReccord,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(+$("#fiscalId").val()),
            success: function (result) {
                var fiscalStartDate = result.startDatePersian;
                var fiscalEndDate = result.endDatePersian
                $("#fromCreateDate").val(fiscalStartDate);
                $("#toCreateDate").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_fiscalYearGetReccord);
                return "";
            }
        });
    }
    else {
        $("#fromCreateDate").val($("#yearDate").val());
        $("#toCreateDate").val($("#nowDate").val());
    }
})

$("#itemTypeId").on("change", function () {

    var itemTypeId = +$(this).val() == 0 ? null : +$(this).val()

    $("#itemId").empty()

    fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdownwithitemtypeid`, "itemId", true, itemTypeId, false, 3, "", undefined, "", false, false, true);

})

$("#noSeriesId").on("change", function () {

    let noSeriesId = +$(this).val()

    $("#personGroupId").empty()
    $("#accountDetailId").empty()

    if (noSeriesId == 0) {
        $("#personGroupId").prop("disabled", true)
        $("#accountDetailId").prop("disabled", true)
        return
    }

    $("#personGroupId").removeAttr("disabled")
    $("#accountDetailId").removeAttr("disabled")

    if (noSeriesId == 102) {
        fill_select2(`${viewData_baseUrl_PU}/VendorGroupApi/getdropdown`, "personGroupId", true, 2, false, 3, "", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
    }
    else if (noSeriesId == 103) {
        fill_select2(`${viewData_baseUrl_SM}/CustomerGroupApi/getdropdown`, "personGroupId", true, 2, false, 3, "", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
    }
    else {
        fill_select2(`${viewData_baseUrl_HR}/EmployeeGroupApi/getdropdown`, "personGroupId", true, 2, false, 3, "", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
    }

})

$("#personGroupId").on("change", function () {

    let noSeriesId = +$("#noSeriesId").val()
    let personGroupId = $(this).val()

    $("#accountDetailId").empty()

    if (personGroupId == "") {
        if (noSeriesId == 102)
            fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
        else if (noSeriesId == 103)
            fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
        else
            fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "accountDetailId", true, 0, false, 3, "", undefined, "", false, false, true);
    }
    else {

        if (noSeriesId == 102)
            fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdownbygroupid`, "accountDetailId", true, personGroupId, false, 3, "", undefined, "", false, false, true);
        else if (noSeriesId == 103)
            fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdownbygroupid`, "accountDetailId", true, personGroupId, false, 3, "", undefined, "", false, false, true);
        else
            fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdownbygroupid`, "accountDetailId", true, personGroupId, false, 3, "", undefined, "", false, false, true);

    }

})

initPurcheseReportIndex()
