
var viewData_form_title = "صورنحساب  خرید / برگشت",
    viewData_controllername = "PurchaseInvoiceLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpage`,
    viewData_getrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyids`,
    viewData_deleterecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/deleteInvoiceLine`,
    viewData_insrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insertInvoiceLine`,
    viewData_OrderLine_filter_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getorderlinefilteritems`,
    viewData_getPersonInvoiceCheckExist = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/checkexist`,
    viewData_get_accountDetail_by_gl = `${viewData_baseUrl_FM}/AccountSGLApi/getaccountdetailbygl`,
    viewData_updrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/update`,
    viewData_updrecord_header_url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/update`,
    viewData_getHeader_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getheader`,
    viewData_csv_url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`,
    viewData_getsum_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getLineSum`,
    viewData_report_url = `/Report/Index`,
    headerModel = {},
    currentWorkflowCategoryId = 1,
    shamsiOrderDate = "",
    headerLine_formkeyvalue = [],
    arr_headerLinePagetables = [],
    exipurchaseline = false,
    grossprice = 0,
    discountprice = 0,
    vatAmount = 0,
    stageId = 0,
    currentActionId = 0,
    requestedActionId = 0,
    rowId = 0,
    branchId = 0,
    workflowId = 0,
    netAmountPlusVAT = 0,
    discountAmount = 0,
    hasPriviousMode = false,
    conditionalProperties = {
        isRequest: false,
        isAfterChange: false,
        isPreviousStage: false,
        isCartable: false,
        isDataEntry: false,
        isQuantityPurchase: false
    };
var stageIdFormisCartable = 0;
var activePageId = "purchaseInvoiceLinePage";
var additionalData = [];
var unitId;
var ratio = 0;
//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonOrderLineList",
    editable: true,
    selectable: false,
    pagerowscount: 15,
    currentpage: 1,
    isSum: true,
    //--
    pageno: 0,
    endData: false,
    //--
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: null,
    headerType: "outline",
    getpagetable_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getinvoicelinepage`,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_PU}/${viewData_controllername}/updateInvoiceLine`,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getorderlinefilteritems`,
    getsum_url: viewData_getsum_url,
    pagetable_laststate: ""
};
var previousStagePage = {
    pagetable_id: "previousStagePageTable",
    selectable: true,
    pagerowscount: 15,
    currentpage: 1,
    //--
    pageno: 0,
    endData: false,
    //--
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    selectedItems: [],
    getpagetable_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getpersoninvoicerequest`,
    getfilter_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getrequestfilteritems`,
};
arr_headerLinePagetables.push(pagelist1);
arr_pagetables.push(previousStagePage);


headerLine_formkeyvalue.push($("#personOrderId").val());
headerLine_formkeyvalue.push($("#isDefaultCurrency").val());

$(`#${activePageId} #previousStagePageTable .relational-caption`).text("نوع آیتم");
$(`#${activePageId} #previousStagePageTable .relationalbox`).removeClass("displaynone");

function call_initFormPurchaseOrderLine(header_Pagination = 0, elemId = undefined) {
    //$("#previousStagePageTable #countRowButton").remove()
    //$("#previousStagePageTable #lastRow").nextAll().remove()
    isFormLoaded = true;
    header_pgnation = header_Pagination;
    if (headerLine_formkeyvalue.length == 2) {
        headerLine_formkeyvalue.push(header_Pagination);
    }
    else {
        headerLine_formkeyvalue[2] = header_pgnation;
    }

    if (header_pgnation > 0) {
        $(`#${activePageId} #header-div-content`).css("opacity", 0.1);
        $(`#${activePageId} #header-lines-div`).css("opacity", 0.1);
        $(`#${activePageId} #loader`).removeClass("displaynone");
    }
    InitForm(activePageId, true, callBackHeaderFill, null, callBackLineFill, callBackBeforeLineFill, callBackHeaderColumnFill);
}

async function callBackBeforeLineFill() {
    InitFormLine();
}

function printFromPlateHeaderLine() {

    let stageClassId = $(`#formPlateHeaderTBody`).data("stageclassid")
    let Id = $(`#formPlateHeaderTBody`).data("id")

    if (stageClassId == 7)
        perchaseInvoicePettyCashPrint(Id)
    else
        printFromPlateHeaderLineReport(Id)

}

function perchaseInvoicePettyCashPrint(Id) {

    var reportParameters = reportParameter(true, Id);

    var reportModel = {
        reportName: "گزارش تنخواه",
        reportUrl: `${stimulsBaseUrl.PU.Prn}PurchaseInvoicePettyCash.mrt`,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function printFromPlateHeaderLineReport(Id) {

    var reportParameters = reportParameter(false, Id);

    var print_file_url = `${stimulsBaseUrl.PU.Prn}PurchaseInvoiceOfficial.mrt`;
    var reportModel = {
        reportUrl: print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

}


function reportParameter(isStageClass7, Id) {
    let reportParameters = []

    if (isStageClass7) {
        reportParameters = [
            { Item: "StageClassId", Value: 7, SqlDbType: dbtype.Int, Size: 0 },
            { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
            { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        ]
    }
    else {
        reportParameters = [
            { Item: `Id`, Value: Id, SqlDbType: 8, Size: 0 },
            { Item: "StageName", Value: "صورتحساب خرید", itemType: "Var" },
        ]
    }

    return reportParameters;
}

async function callBackHeaderColumnFill() {

    if (conditionalProperties.isPreviousStage > 0 && requestId == 0)
        hasPriviousMode = true;
    else
        hasPriviousMode = false;

    if ((isFormLoaded || header_pgnation > 0)) {
        if ($(".ins-out #addRequestLines").length == 0)
            $(".ins-out").append(`<button onclick="add_requestLines()" type="button" id="addRequestLines" data-disabled="false" class="btn btn-success ml-2 pa float-sm-left waves-effect" value="">افزودن از درخواست</button>`);

        $(`#${activePageId} #itemTypeId `).empty();

        fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, `${stageId}/1`);
        $(`#${activePageId} #itemTypeId`).val($("#itemTypeId option:first").val()).trigger("change");

        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #itemTypeId`).val());
        else
            headerLine_formkeyvalue[3] = +$(`#${activePageId} #itemTypeId`).val();

        $("#headerLineInsUp").removeClass("d-none");

        headerLine_formkeyvalue[4] = stageId;
        headerLine_formkeyvalue[5] = workflowId;
    }


}

async function callBackHeaderFill() {

    if (
        $(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="personOrderExcel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="personOrderList()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '>
                                                            <select style='width: 71%; float: right' class='form-control' id='action'></select>
                                                            <button onclick='update_action()' id='stepRegistration' type='button' class='btn btn-success ml-2 pa waves-effect' value=''>
                                                                <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                                <span>ثبت گام</span>
                                                            </button>
                                                        </div>`);
    }


    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    stageId = +$(`#${activePageId} #stageId`).val();
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));
    workflowId = +$(`#${activePageId} #workFlowId`).val();
    actionId = +$(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
    OrderDate = $(`#${activePageId} #formPlateHeaderTBody`).data("orderdate");
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    requestId = +$(`#${activePageId} #formPlateHeaderTBody`).data("requestid");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    exipurchaseline = checkExistpurchaseline(id);
    conditionalProperties.treasurySubjectId = +$(`#${activePageId} #formPlateHeaderTBody`).data("treasurysubjectid");
    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    conditionalProperties.isRequest = +$(`#${activePageId} #formPlateHeaderTBody`).data("isrequest");
    conditionalProperties.isEqualToParentRequest = $(`#${activePageId} #formPlateHeaderTBody`).data("isequaltoparentrequest");

    conditionalProperties.parentworkflowcategoryid = +$(`#${activePageId} #formPlateHeaderTBody`).data("parentworkflowcategoryid");
    conditionalProperties.stageClassId = +$(`#${activePageId} #formPlateHeaderTBody`).data("stageclassid");

    headerModel.isRequest = conditionalProperties.isRequest;
    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;
    headerModel.documentTypeId = +$(`#${activePageId} #formPlateHeaderTBody`).data("documenttypeid");
    headerModel.documentTypeName = $(`#${activePageId} #formPlateHeaderTBody`).data("documenttype");
    headerModel.note = $(`#${activePageId} #formPlateHeaderTBody`).data("note");
    headerModel.returnReasonId = $(`#${activePageId} #formPlateHeaderTBody`).data("returnreasonid");
    headerModel.accountGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountglid");
    headerModel.accountGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountgl");
    headerModel.accountSGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountsglid");
    headerModel.accountSGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountsgl");
    headerModel.noSeriesId = +$(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid");
    headerModel.noseriesName = $(`#${activePageId} #formPlateHeaderTBody`).data("noseries");
    headerModel.accountDetailVatEnable = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatinclude");
    headerModel.accountDetailVatInclude = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatenable");
    headerModel.parentdocumentdatepersian = $(`#${activePageId} #formPlateHeaderTBody`).data("parentdocumentdatepersian");
    var accountDetailName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetail");

    var accountDetailId = 0;
    if (accountDetailName != undefined && accountDetailName != "" && accountDetailName != null)
        accountDetailId = +accountDetailName.split("-")[0];
    headerModel.accountDetailId = accountDetailId;
    headerModel.accountDetailName = accountDetailName.split("-")[1]

    additionalData = [
        { name: "headerId", value: id },
        { name: "stageId", value: stageId },
        { name: "branchId", value: branchId },
        { name: "categoryId", value: 0 },
        { name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() },
        { name: "headerAccountDetailId", value: +headerModel.accountDetailId },
        { name: "vatId", value: 0 },
        { name: "vatAccountDetailId", value: 0 },
        { name: "vatNoSeriesId", value: 0 },
        { name: "unitId", value: 0 },
        { name: "ratio", value: 0 },
        { name: "idSubUnit", value: 0 },
        { name: "headerNoSeriesId", value: +headerModel.noSeriesId },
        { name: "inOut", value: 0 },
        { name: "discountAmount", value: 0 },
        { name: "requestId", value: requestId },
        { name: "parentWorkFlowCategoryId", value: conditionalProperties.parentworkflowcategoryid },
        { name: "workFlowId", value: workflowId },
        { name: "orderDate", value: OrderDate },
        { name: "stageClassId", value: conditionalProperties.stageClassId },
    ];

    $("#note").suggestBox({
        api: `/api/FM/JournalDescriptionApi/search`,
        paramterName: "name",
        suggestFilter: {
            items: [],
            filter: ""
        },
        form_KeyValue: [stageId]
    });


}

function headeUpdateModal_close() {
    public_tr_object_onchange($(`#${activePageId} #itemTypeId`), 'jsonOrderLineList');
    configPersonOrderElementPrivilage(".ins-out", false, false);
    modal_close("headeUpdateModal");
}

async function callBackLineFill() {

    $(`#${activePageId} #currencyId option[value='0']`).remove();

    var row1 = $("#purchaseInvoiceLinePage #row1");
    if ($("#purchaseInvoiceLinePage #row1").length > 0) {
        trOnclick("jsonOrderLineList", row1, null);
    }
    else {
        configAfterChange();
        refreshRequestLinesBtn();
    }
    firstLineLoaded = true;

    $(`#${activePageId} #action`).empty();
    let stageClassIds = "2,3,7";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "action", true, `${stageId}/${workflowId}/1/0/${branchId}/${workflowCategoryIds.purchase.id}/true/${stageClassIds}`);
    $(`#${activePageId} #action`).val(+$("#formPlateHeaderTBody").data("actionid")).trigger("change");

    $("#filter_itemType").data("api", `/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_PU}/VendorItemsApi/getvendoritemslist/${headerModel.accountDetailId}/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `/api/WH/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);
    }

}

function configAfterChange() {
    setTimeout(function () {
        if (!conditionalProperties.isAfterChange) {
            configPersonOrderElementPrivilage(".ins-out", isAfterSave, false);
            isAfterSave = false;
        }
        else {
            $("#itemTypeName").select2("focus");
            conditionalProperties.isAfterChange = false;
        }
    }, 100)
}

function getCategoryIdByitemId(itemId) {

    let url = `${viewData_baseUrl_WH}/ItemApi/getItemCategoryId`,
        id = 0, index = additionalData.findIndex(a => a.name == "categoryId");



    if (+itemId !== 0)
        id = getCategoryIdByitemIdAjax(url, itemId);

    additionalData[index].value = +id;
}

function getCategoryIdByitemIdAjax(url, id) {

    var result = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(id),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseText;

}

function refreshRequestLinesBtn() {


    if (conditionalProperties.isRequest == 0 && conditionalProperties.isDataEntry == true) {
        $(`#${activePageId} #addRequestLines`).prop("disabled", true)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
    }
    else if (conditionalProperties.isRequest == 1 && conditionalProperties.isDataEntry == true) {
        $(`#${activePageId} #addRequestLines`).prop("disabled", false)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
    }
    else {
        $(`#${activePageId} #addRequestLines`).prop("disabled", true)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)
    }


}

function personOrderExcel() {

    var csvModel = {
        FieldItem: $(`#jsonOrderLineList .btnfilter`).attr("data-id"),
        FieldValue: $(`#jsonOrderLineList .filtervalue`).val(),
        Form_KeyValue: headerLine_formkeyvalue,
        pageno: null,
        pagerowscount: null
    }
    let url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(csvModel),
        cache: false,
        success: function (result) {
            generateCsv(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function add_requestLines() {

    let listType = requestId == 0 ? 2 : 1;

    let stageStep = getParentRequestStageStep(requestId, currentWorkflowCategoryId);

    if (listType == 1)
        if (!stageStep.isLastConfirmHeader) {
            alertify.warning(" درخواست در حالت منتشر نشده می باشد مجاز به ویرایش نمی باشید").delay(alertify_delay);
            return;
        }

    conditionalProperties.isQuantityPurchase = stageStep.isQuantityPurchase;

    var paramRequestItemTypeList = `${requestId}/1`

    fill_select2(`${viewData_baseUrl_PU}/PurchaseInvoiceApi/requestitemtypegetdropdown`, "previousStagePageTable #form_keyvalue", true, paramRequestItemTypeList, false, 3, 'انتخاب', undefined, "", true);
    if (+$("#previousStagePageTable #form_keyvalue option:first").val() != 0)
        $("#previousStagePageTable #form_keyvalue").val($("#previousStagePageTable #form_keyvalue option:first").val()).trigger("change");
    else {
        var msgItem = alertify.warning("مبانی وجوه برگه مرجع و جاری همخوانی ندارد، به مدیر سیستم اطلاع دهید");
        msgItem.delay(alertify_delay);
    }

    configPersonOrderElementPrivilage(".ins-out", false, false);
}

function close_modal_previousStageRequests() {
    modal_close("previousStagePersonInvoiceLines");
}

function click_link_header(elm) {
    if ($(elm).data().id == "requestNo")
        navigation_item_click(`/PU/PurchaseOrderLine/${+$(elm).text()}/${+$(`#purchaseInvoiceLinePage #isDefaultCurrency`).val()}`, "ثبت سفارش (ریالی)");
    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#purchaseInvoiceLinePage #isDefaultCurrency`).val()}`);
}

function checkRequestIsLastConfirmHeader(requestId) {

    var url = `${viewData_baseUrl_SM}/PurchaseInvoiceApi/requestislastconfirmheader`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(requestId),
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

function checkEditOrDeletePermission(opr = "Upd") {

    var purchaseAction = getStageAction(workflowId, stageId, actionId, 0);

    if (opr == "Upd") {
        if (purchaseAction.isDataEntry == 1)
            return true;
        else
            return false;
    }
    else {
        if (purchaseAction.isDataEntry != 0)
            return true;
        else
            return false;
    }
}

$("#previousStagePersonInvoiceLines").on("shown.bs.modal", function () {
    $("#previousStagePersonInvoiceLines").css("overflow", "hidden");
    $("#purchaseInvoiceLinePage").css("overflow", "hidden");
    $("#previousStagePageTable table tbody tr").first().focus();

})

$("#previousStagePageTable #form_keyvalue").change(function () {
    get_requestStageLines();
})

$(document).on("keydown", ".funkyradio", function (ev) {
    if (ev.which === KeyCode.Space) {
        var elm = $(this);
        if (elm.hasClass("funkyradio") && !elm.find("input").first().prop("disabled")) {
            ev.preventDefault();
            elm.find("input").first().prop("checked", !elm.find("input").first().prop("checked")).trigger("change");
        }
    }
})

$(document).on("keydown", `#${activePageId} #formHeaderLine`, function (e) {
    if (e.keyCode == KeyCode.Esc) {
        if (+$("#itemTypeId").val() != $("#itemTypeId").prop("selectedIndex", 0).val())
            $("#itemTypeId").val($("#itemTypeId").prop("selectedIndex", 0).val()).trigger("change");
        configPersonOrderElementPrivilage(".ins-out", false, false);
        //$(`#${activePageId} #purchaseInvoiceLinePage .ins-out > .row`).parsley().reset();

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

function get_requestStageLines() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    arr_pagetables[index].selectedItems = [];
    var itemTypeId = +$("#previousStagePageTable #form_keyvalue").val();

    arr_pagetables[index] = {
        pagetable_id: "previousStagePageTable",
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        //--
        pageno: 0,
        endData: false,
        //--
        lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getpersoninvoicerequest`,
        getfilter_url: `${viewData_baseUrl_PU}/${viewData_controllername}/getrequestfilteritems`
    }


    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;

    var listType = requestId == 0 ? 2 : 1;
    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(requestId);
    pagetable_formkeyvalue.push(itemTypeId);
    pagetable_formkeyvalue.push(+$("#isDefaultCurrency").val());
    pagetable_formkeyvalue.push(stageId);
    pagetable_formkeyvalue.push(listType);
    pagetable_formkeyvalue.push(branchId);
    pagetable_formkeyvalue.push(id);
    pagetable_formkeyvalue.push(workflowId);
    pagetable_formkeyvalue.push(conditionalProperties.parentworkflowcategoryid);
    pagetable_formkeyvalue.push(0);
    pagetable_formkeyvalue.push(1);
    pagetable_formkeyvalue.push(headerModel.accountDetailId);

    $(`#previousStagePageTable .btnRemoveFilter`).addClass("d-none");
    $(`#previousStagePageTable .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritemNew('filter-non', 'مورد فیلتر', '0', '0', "previousStagePageTable");


}

function callbackAfterFilter(pgName) {
    $("input").inputmask();
    modal_show(`previousStagePersonInvoiceLines`);
}

function get_NewPageTablePurchasePersonInvoice(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";
    activePageTableId = pg_id;
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    let pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue;

    let pageViewModel = {
        pageno: pagetable_pageNo,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue,
        form_KeyValue: [0],
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }
    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (response) {
            if (pagetable_currentpage == 1) fillOption(response, pg_id);

            let result = {
                columns: {
                    dataColumns: response.columns.dataColumns,
                    buttons: response.columns.buttons,
                    isEditable: true,
                    isSelectable: response.columns.isSelectable,
                    conditionOn: response.columns.conditionOn,
                    answerCondition: response.columns.answerCondition,
                    elseAnswerCondition: response.columns.elseAnswerCondition,
                },
                data: response.data.requests
            }

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function appendDetails(columns) {

    $("#header-lines-footer").html("");
    let arr_Temp = [];
    output = `<div class="detail-headerLine row col-md-12">`;
    for (var i in columns) {
        var col = columns[i], idcol = col.id;
        if (col.isDisplayItem == true)
            arr_Temp.push({ id: idcol, titles: col.title });
    }

    for (var j in arr_Temp) {
        var vals = arr_Temp[j];
        output += `<div class="item-detail-box"><div class="item-detail-group">
            <label class="item-detail">${vals.titles}</label>
            <label id="${vals.id}" class="item-detail-val"></label>
            </div></div>`;

    }

    output += `</div >`;
    $(output).appendTo("#header-lines-footer");
}

function trOnclick(pg_name, elm, evt) {

    configAfterChange();

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;


    if (trediting) {
        if (elm.hasClass("funkyradio"))
            elm.prop("checked", !elm.prop("checked"));

        return;
    }
    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
    tr_HighlightHeaderLine(pg_name);

    //rowId = $(elm).data("model.id");
    //fillPersonInvoicePurchaselineFooter(rowId);
}

function run_header_line_row_After_delete() {

    get_header();
    exipurchaseline = checkExistpurchaseline(id);
    //fillPersonInvoicePurchaselineFooter(rowId);
}

function fillPersonInvoicePurchaselineFooter(rowIdSelect) {

    getPersonInvoicePurchaselineFooter(rowIdSelect).then(function (data) {
        $("#fillPersonInvoicePurchaselineFooterTbody").html("")
        $("#header-lines-footer").css("marginTop", "15px");
        $("#header-lines-footer").html("")
        let strTbodyTr = "";
        let strTbodyTd = "";
        let uniqueDecimalArray = _.uniqBy(data, 'isDecimal');
        let columncount = (data.length / uniqueDecimalArray.length) * 3;
        let width = 100 / columncount;
        if (data != null) {

            let strTbodyTh = `
                <table style="margin-top:10px" id="purchaseInvoiceLineFooter">
                    <thead >
                        <tr>
                            <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}"></th>`

            for (var j = 0; j < (columncount / 3); j++) {

                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/کل</th>`
                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/معین</th>`
                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/تفضیل</th>`
            }
            strTbodyTh += ` </tr>
                           </thead>
                                 <tbody>`;

            for (var k = 0; k < uniqueDecimalArray.length; k++) {
                strTbodyTh += `<tr>
                                    <td style="background-color:#e1e1e1">${uniqueDecimalArray[k].isDecimalName}</td>`;
                for (var r = 0; r < data.length; r++) {

                    if (data[r].isDecimal == k + 1) {

                        if (data[r].isDecimal == 1) {
                            strTbodyTh += data[r].accountGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountGLName}</td>`
                            strTbodyTh += data[r].accountSGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountSGLName}</td>`
                            strTbodyTh += data[r].accountDetailName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountDetailName}</td>`
                        }
                        if (data[r].isDecimal == 2) {

                            strTbodyTh += data[r].accountGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountGLName}</td>`
                            strTbodyTh += data[r].accountSGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountSGLName}</td>`
                            strTbodyTh += data[r].accountDetailName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountDetailName}</td>`
                        }
                    }
                }

                strTbodyTh += strTbodyTd + `</tr>`;
            }
            strTbodyTh += `
                       
                    </tbody>
                </table>
                `
            $("#header-lines-footer").append(strTbodyTh)
            $("#fillPersonInvoicePurchaselineFooterTbody").append(strTbodyTr)
        }

    });
}

async function getPersonInvoicePurchaselineFooter(id) {

    var p_url = `/api/WFApi/postgrouplinefooter`;
    var model = {
        id: id,
        workflowCategoryId: 1
    }
    var response = await $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });

    return response;
}

function appendDetails(columns) {

}

function headerLineActive(pageId) {

    $(".ins-out").removeData();
    $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonOrderLineList')");
    configPersonOrderElementPrivilage(`.ins-out`, true, true);

}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configPersonOrderElementPrivilage(containerId, privilageType = null, checkrequestAndIsDataInteryForHeaderLineActive = false) {

    // فعالسازی : haederLineActive
    // افزودن از درخواست: add_requestLines
    // افزودن : headerLineInsUp
    // ویرایش لاین: btn_editPerson
    // حذف لاین: btn_delete


    $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)


    $("#itemTypeId").prop("selectedIndex", 0).trigger("change");


    if (checkrequestAndIsDataInteryForHeaderLineActive == true) {
        if (conditionalProperties.isRequest == 0 && conditionalProperties.isDataEntry == true) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true)
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
            $(`#${activePageId} .pagetablebody button`).prop("disabled", false);
        }
        else if (conditionalProperties.isRequest == 1 && $("#formPlateHeaderTBody").data("isdataentry") == 3) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", false)
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)
            $(`#${activePageId} .pagetablebody button`).prop("disabled", true);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        }
        else {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true)
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)
            $(`#${activePageId} .pagetablebody button`).prop("disabled", true);
        }
    }
    else {


        if (conditionalProperties.isDataEntry) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
            $(`#${activePageId} .pagetablebody button`).prop("disabled", false);
        }

        else if ($("#formPlateHeaderTBody").data("isdataentry") == 3) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", false);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            $("#jsonOrderLineList .pagetablebody tbody tr  td button:first-child").prop("disabled", true)
            $("#jsonOrderLineList .pagetablebody tbody tr  td button:last-child").prop("disabled", false)

        }
        else {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true);
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", true);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            $(`#${activePageId} .pagetablebody button`).prop("disabled", true);

        }
    }


    if (privilageType != null) {
        var selector,
            allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp,
                         #${activePageId} ${containerId} #addRequestLines`);
        if (privilageType) {

            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            if (conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 3) {
                lineSelectedId = 0;
                for (var i = 0; i < allSelector.length; i++) {
                    selector = $(allSelector[i]);
                    if (allSelector[i].id != "" || selector.hasClass("funkyradio")) {
                        if (selector.hasClass("select2-hidden-accessible")) {

                            if (!selector.data().disabled) {
                                if (conditionalProperties.isEqualToParentRequest)
                                    selector.prop("disabled", false);
                                else
                                    selector.prop("disabled", !privilageType);
                            }

                            if (!selector.data().notreset && containerId != "#header-div-content") {
                                selector.prop("selectedIndex", 0).trigger("change");
                                selector.val("0").trigger("change");
                            }
                        }
                        else if (selector.hasClass("funkyradio")) {
                            if (!selector.data().disabled) {
                                selector.find("input").first().prop("disabled", !privilageType);
                            }
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.find("input").first().prop("checked", false).trigger("change");
                        }

                        else if (selector.attr("id") == "addRequestLines")
                            selector.prop("disabled", true);
                        else {

                            if (!selector.data().disabled) {
                                if (conditionalProperties.isEqualToParentRequest)
                                    selector.prop("disabled", false);
                                else
                                    selector.prop("disabled", !privilageType);
                            }
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.val(``);
                        }
                    }
                }
            }
            else
                configPersonOrderElementPrivilage(".ins-out", false, false);

            setTimeout(() => {
                var firstElement = $(`#${activePageId} ${containerId} ${containerId.indexOf("ins-out") == -1 ? 'th' : ''}`).find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)").first();
                if (firstElement.length > 0) {
                    if (firstElement.attr("class") != undefined && firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled")) {
                        $(firstElement).select2("focus");
                    }
                    else
                        $(firstElement).focus();
                }
            }, 200);
        }
        else {


            for (var i = 0; i < allSelector.length; i++) {
                selector = $(allSelector[i]);
                if (selector.hasClass("select2-hidden-accessible")) {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                        selector.prop("selectedIndex", 0).trigger("change");
                        selector.val("0").trigger("change");
                    }
                }
                else if (selector.hasClass("funkyradio")) {
                    var lbl_funkyradio = selector.find("label");
                    lbl_funkyradio.removeClass("border-thin");

                    if (!selector.data().disabled) {
                        selector.find("input").first().prop("disabled", !privilageType);
                    }
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                        selector.find("input").first().prop("checked", false).trigger("change");
                    }
                }
                else if (selector.attr("id") == "addRequestLines") {
                    if (!selector.data().disabled)
                        selector.prop("disabled", ($("#formPlateHeaderTBody").data("isdataentry") == 1 || $("#formPlateHeaderTBody").data("isdataentry") == 0) ? true : false);

                }

                else {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.val(``);
                }
            }
        }
    }

    if (+$(`#${activePageId} #action`).val() >= 3) {
        $(`#${activePageId} #btn_header_update`).prop("disabled", true);
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
    }

    $("#categoryItemId").prop("disabled", true);
}

configLineElementPrivilage = configPersonOrderElementPrivilage;

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configPersonOrderElementPrivilage(".ins-out", false, false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configPersonOrderElementPrivilage(".ins-out", false, false);
    }
});

call_initFormPurchaseOrderLine();

call_initform = call_initFormPurchaseOrderLine;

function afterInsertLineHeaderLine() {
    configPersonOrderElementPrivilage(".ins-out", false, false);


    $("#filter_itemType").data("api", `/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_PU}/VendorItemsApi/getvendoritemslist/${headerModel.accountDetailId}/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `/api/WH/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);
    }
}

function personOrderList() {

    if (!conditionalProperties.isCartable)
        navigation_item_click('/PU/PurchaseInvoice', 'صورتحساب خرید / برگشت');
    else
        navigation_item_click(`/PU/PurchaseInvoiceCartable/${stageId}`, 'کارتابل مالی صورتحساب خرید');

}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistPersonOrderLineId(+elm.val());
        if (checkExist)
            navigation_item_click(`/PU/PurchaseInvoiceLine/${+elm.val()}/${+$(`#purchaseInvoiceLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistPersonOrderLineId(id) {

    var url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/checkexist`;

    let outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return outPut.responseJSON;

}

$("#headeUpdateModal").on("shown.bs.modal", function () {
    if (conditionalProperties.isRequest) {
        $("#requestId").select2("focus");
    }
    else {
        $("#orderDatePersian").focus();
    }
})

function checkExistpurchaseline(purchaseid) {

    var result = $.ajax({
        url: `${viewData_baseUrl_PU}/${viewData_controllername}/getPurchaseLineCount`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(purchaseid),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return result.responseJSON;
}

async function public_object_onchange(elm) {
    if (typeof elm === "undefined") return;

    var elmId = $(elm).attr("id");

    if (elmId === "requestId")
        if (+$(elm).val() !== 0) {

            workflowCategoryName = document.getElementById("requestId");
            var len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;
            workflowCategoryId = len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0];
            shamsiOrderDate = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[0].split('-')[1];
            $(`#orderDatePersian`).val(shamsiOrderDate);
            getGlSGLbyRequestId(+$(elm).val(), +workflowCategoryId);
        }
}

function getGlSGLbyRequestId(identityId, workflowCategoryId) {

    let url = `${viewData_baseUrl_WF}/WorkflowApi/getrequestglsglbyworkflowcategory/${workflowCategoryId}/${identityId}`;
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: JSON.stringify(+id),
        contentType: "application/json",
        success: function (result) {
            if (typeof result !== "undefined" && result != null) {

                $(`#accountGLId`).val(result.accountGLId == 0 ? "" : `${result.accountGLId} - ${result.accountGLName}`);
                $(`#accountGLId`).data("value", result.accountGLId);
                $(`#accountSGLId`).val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $(`#accountSGLId`).data("value", result.accountSGLId);

                $(`#documentTypeId`).val(headerModel.documentTypeId == 0 ? "" : headerModel.documentTypeName);
                $(`#documentTypeId`).data("value", headerModel.documentTypeId);


                $(`#note`).val(headerModel.note);
                $(`#orderDatePersian`).val(result.documentDatePersian);

                isRequest = id > 0 ? true : false;

                var treasurySubjectOption = new Option(`${result.treasurySubjectId} - ${result.treasurySubjectName}`, result.treasurySubjectId, true, true);
                $("#treasurySubjectId").append(treasurySubjectOption).trigger('change');

                if (result.accountGLId !== 0 && result.accountSGLId !== 0) {
                    $("#noSeriesId").prop("disabled", isRequest).prop("required", isRequest);
                    fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                    $("#noSeriesId").val(result.noSeriesId).trigger("change.select2");

                    $("#accountDetailId").empty();
                    $("#accountDetailId").prop("disabled", isRequest).prop("required", isRequest);
                    getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
                    $("#accountDetailId").val(result.accountDetailId).trigger("change.select2");

                }

            }
            else {
                $("#treasurySubjectId").empty().prop("disabled", true).prop("required", true);
                $(`#accountGLId`).val("").prop("disabled", true).prop("required", true);
                $(`#accountSGLId`).val("").prop("disabled", true).prop("required", true);
                $(`#noSeriesId`).empty().prop("disabled", true).prop("required", true);
                $(`#accountDetailId`).val("").prop("disabled", true).prop("required", true);
                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).val(0).trigger("change");
                $(`#documentTypeId`).val("").prop("disabled", true).prop("required", true);


            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function getTreasuryRequestTreasurySubject(requestId) {
    var url = `${viewData_baseUrl_FM}/NewTreasuryApi/getrequesttreasurytreasurysubject`

    var tresurySubject = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: JSON.stringify(+requestId),
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return { id: 0, name: "" }
        }
    });

    return tresurySubject.responseJSON;
}

function object_onfocus(elem) {
}

function object_onblur(elem) {
}

function object_onchange(elem) {
}

function object_onkeydown(e, elem) {

}

function tr_object_onfocus(elem) {

    $(elem).select();
}

function tr_object_onkeydown(e, elem) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");

    if (e.keyCode === KeyCode.Enter) {

    }

}

function local_tr_object_onchange(elem, pageId, ev) {

    var elem = $(elem);
    var elemId = $(elem).attr("id");
    let id = 1;
    switch (elemId) {
        case "itemTypeId":
            if (elem.val() > 0) {
                id = elem.val();
                fill_items(id);
            }
            break;
        case "itemId":
            if (elem.val() > 0 && checkResponse(elem.val())) {
                clearColumns();

                getPurchaceInvoiceFundItemTypeInOut(+$("#itemTypeId").val());

                // headerModel.accountDetailVatInclude =false   اجازه ثبت سطر دارد
                // headerModel.accountDetailVatInclude =true && headerModel.accountDetailVatEnable =false   اجازه ثبت سطر ندارد
                if (!headerModel.accountDetailVatInclude && headerModel.accountDetailVatEnable) {
                    alertify.error(`لطفا تنظیمات اعتبار مالیات را برای تامین کننده  ${headerModel.accountDetailName} تعریف نمایید. `);
                    return;
                }
                else
                    get_itemVat(elem.val(), +$("#itemTypeId").val());

                getCategoryItemName(elem.val());
            }
            else {
                $("#categoryItemId").prop("disabled", true);
            }
            break;

        case "currencyId":
            if (elem.val() <= 1) {
                $("#exchangeRate").val("1");
                $("#exchangeRate").prop("disabled", true);
            }
            else {
                $("#exchangeRate").val("");
                $("#exchangeRate").prop("disabled", false);
            }
            break;

        case "price":
        case "exchangeRate":
            calc_grossAmount();
            calc_discountAmount();
            break;
        case "subUnitId":
            fillAcountDetailId(ev, "");
        case "quantity":
            cal_getRatio();
            break;
        case "discountValue":
            calc_discountAmount();
            break;
        case "discountType":

            if (elem.val() > 0) {
                $("#discountValue").val("0").change();
                $("#discountValue").prop("disabled", false);
                $("#discountValue").data("disabled", false);

                $("#discountValue").attr("data-parsley-required", true);
                if (elem.val() == 1) {
                    $("#discountValue").attr("data-parsley-min", 1);
                    $("#discountValue").attr("data-parsley-max", 99);
                    $("#discountValue").attr("maxlength", 3);
                }
                else {
                    $("#discountValue").attr("data-parsley-min", 1);
                    $("#discountValue").attr("data-parsley-max", +removeSep($("#grossAmount").val()));
                    $("#discountValue").removeAttr("maxlength");
                }
            }
            else {
                $("#discountValue").removeAttr("data-parsley-required");
                $("#discountValue").removeAttr("data-parsley-min");
                $("#discountValue").removeAttr("data-parsley-max");
                $("#discountValue").removeAttr("maxlength");
                $("#discountValue").val("0").change();
                $("#discountValue").prop("disabled", true);
                $("#discountValue").data("disabled", true);
                calc_grossAmount();
                calc_discountAmount();
            }
            break;

    }
}

function tr_object_onchange(pageId = '', elem, rowno = 0, colno = 0) {

    if (pageId != "previousStagePageTable") {
        return;
    }

    var elem = $(elem);
    var elemId = $(elem).attr("id");
    if (checkResponse(elemId)) {

        switch (elemId.split('_')[0]) {

            case "discountType":
                if (elem.val() > 0) {
                    $("#discountValue_" + rowno + "").val("0").change();
                    $("#discountValue_" + rowno + "").prop("disabled", false);
                    $("#discountValue_" + rowno + "").data("disabled", false);

                    $("#discountValue_" + rowno + "").attr("data-parsley-required", true);
                    if (elem.val() == 1) {
                        $("#discountValue_" + rowno + "").attr("data-parsley-min", 1);
                        $("#discountValue_" + rowno + "").attr("data-parsley-max", 99);
                        $("#discountValue_" + rowno + "").attr("maxlength", 3);
                    }
                    else {
                        var grossAmountId = $("#grossAmount_" + rowno + "");
                        $("#discountValue_" + rowno + "").attr("data-parsley-min", 1);
                        $("#discountValue_" + rowno + "").attr("data-parsley-max", +removeSep(grossAmountId.val()));
                        $("#discountValue_" + rowno + "").attr("maxlength", 15)
                    }
                }
                else {
                    $("#discountValue_" + rowno + "").removeAttr("data-parsley-required");
                    $("#discountValue_" + rowno + "").val("0").change();
                    $("#discountValue_" + rowno + "").prop("disabled", true);
                    $("#discountValue_" + rowno + "").data("disabled", true);

                }
                calc_discountAmountDetail(rowno);
                break;

        }
    }
}

function tr_object_onblur(pageId = '', elem, rowno = 0, colno = 0, ev) {

    if (pageId != "previousStagePageTable") {

        var elem = $(elem);
        var elemId = $(elem).attr("id");

        if (checkResponse(elemId)) {

            switch (elemId) {
                case "vatAmount":
                    setNetAmountPlusVAT();
                    break;

                case "price":
                case "exchangeRate":
                case "quantity":
                    fillAcountDetailId(ev);
                    break;
                case "discountValue":
                    if ($("#vatAmount").prop("disabled"))
                        fillAcountDetailId(ev, "before");
                    else
                        fillAcountDetailId(ev, "");
                    break;
            }
        }
    }
    else {
        var elem = $(elem);
        var elemId = $(elem).attr("id");

        if (checkResponse(elemId)) {

            switch (elemId.split('_')[0]) {

                case "currencyId":
                    if (elem.val() <= 1) {
                        $("#exchangeRate").val("1");
                        $("#exchangeRate").prop("disabled", true);
                    }
                    else {
                        $("#exchangeRate").val("");
                        $("#exchangeRate").prop("disabled", false);
                    }
                    break;
                case "price":
                    calc_grossAmountDetail(rowno);
                    calc_discountAmountDetail(rowno);
                    break;
                case "quantity":
                    calc_grossAmountDetail(rowno);
                    calc_discountAmountDetail(rowno);
                    break;
                case "exchangeRate":
                    calc_grossAmountDetail(rowno);
                    break;
                case "discountValue":
                case "discountType":
                    calc_discountAmountDetail(rowno, "discountType");
                    break;
            }
        }
    }



}

function run_header_line_row_editPerson(pageId, rowNo, ev) {

    $("#itemTypeId").attr("disabled", true);
    let elementhasclass = $(`#${pageId} .highlight`)
    $(elementhasclass).removeClass("highlight")

    var elm_pbody = $(`#${pageId} .pagetablebody`);
    elm_pbody.find(`tbody >  #row${rowNo}`).addClass("highlight");
    elm_pbody.find(`tbody >  #row${rowNo}`).focus();


    if (ev != undefined)
        ev.stopPropagation();

    if (typeof checkEditOrDeletePermission != "undefined") {
        if (!checkEditOrDeletePermission()) {
            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }

    if (typeof validationEditRow !== "undefined") {
        let valid = validationEditRow();
        if (!valid) return;
    }


    $("#headerLineInsUp").prop("disabled", false)


    let lineId = $(`#${pageId} tbody tr[id="row${rowNo}"]`).data('model.id')

    $.ajax({
        url: "/api/PU/PurchaseInvoiceLineApi/getrecordbyids",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(lineId),
        cache: false,
        success: function (result) {

            if (result.data != null) {
                var data = result.data;
                var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
                arr_headerLinePagetables[index].headerType = "outline"

                $(`.ins-out`).data("model.id", data.id);

                $("#itemTypeId").val(data.itemTypeId).trigger("change.select2");
                $("#itemId").val(data.itemId).trigger("change.select2");

                if (+data.itemTypeId == 1 || +data.itemTypeId == 4) {
                    $("#attributeIds").val(data.attributeIds).trigger("change.select2");
                    $("#subUnitId").val(data.subUnitId).trigger("change.select2");
                    data.totalQuantity == 0 ? $("#totalQuantity").val(data.quantity) : $("#totalQuantity").val(data.totalQuantity);
                }
                else {
                    $("#attributeIds").val("");
                    $("#subUnitId").val("");
                    $("#attributeIds").addClass("displaynone");
                    $("#subUnitId").addClass("displaynone");
                }

                if (data.currencyId > 0) {
                    $("#currencyId").val(data.currencyId).trigger("change.select2");
                    $("#exchangeRate").val(data.exchangeRate)
                }
                $("#categoryItemId").val(data.categoryItemName);
                $("#quantity").val(data.quantity.toFixed(3));
                $("#price").val(transformNumbers.toComma(data.price.toFixed(3)));
                $("#grossAmount").val(transformNumbers.toComma(data.grossAmount.toFixed(3)));
                $("#discountType").val(data.discountType).trigger("change");

                let discountValue = data.discountType == 2 ? transformNumbers.toComma(data.discountValue.toFixed(3)) : data.discountValue;
                $("#discountValue").val(discountValue);

                $("#netAmount").val(transformNumbers.toComma(data.netAmount.toFixed(3)));
                $("#vatAmount").val(transformNumbers.toComma(data.vatAmount.toFixed(3)));
                $("#netAmountPlusVAT").val(transformNumbers.toComma(data.netAmountPlusVAT.toFixed(3)));
                if (result.data.priceIncludingVAT)
                    $("#priceIncludingVAT").prop("checked", true);

                $("#itemId").select2("focus");

                fillAcountDetailId(undefined, "", () => {
                    if (data.stageClassId == 7)
                        $("#accountDetailId").val(data.accountDetailId).trigger("change")
                })


            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });


}

function clearColumns() {
    $("#grossAmount").val(0);
    $("#discountType").val(0).trigger("change");
    $("#discountValue").val(0);
    $("#price").val(0);
    $("#quantity").val(1);
    $("#grossAmount").val(0);
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#vatPer").val(0);
    $("#netAmountPlusVAT").val(0);
    $("#purchaseInvoiceLinePage .ins-out").attr("data-hidden-discpercent", 0);
    $("#purchaseInvoiceLinePage .ins-row").attr("data-hidden-discpercent", 0);
    $(".ins-out").data("model.vatper", 0);
    $("#priceIncludingVAT input[type='checkbox']").val(0);
    $("#priceIncludingVAT input[type='checkbox']").removeAttr("checked");
    $("#categoryItemId").prop("disabled", true);
}

function getPurchaceInvoiceFundItemTypeInOut(itemTypeId) {
    var model = {
        fundItemTypeId: +itemTypeId,
        stageId: +$("#stageId").val()
    }
    if (model.fundItemTypeId > 0 && model.stageId > 0) {
        $.ajax({
            url: "api/WF/StageFundItemTypeApi/getstagefunditemtypeinout",
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (additionalData.length > 0)
                    additionalData[13].value = result;
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function fill_items(itemTypeId) {
    $("#itemId").html("");
    var dropDownUrl = "";
    var param = '';
    dropDownUrl = `${viewData_baseUrl_PU}/VendorItemsApi/getvendoritemslist`;
    param = `${headerModel.accountDetailId}/${itemTypeId}`;

    fill_select2(dropDownUrl, "itemId", true, param, false, 3, "انتخاب"
        , function () {
            $("#itemId").data("val", "");
        }
    );
    $("#itemId").val($("#itemId").prop("disabled", false).data("val"));
}

function local_objectChange(elem) {

    var elem = $(elem);
    var elemval = +elem.val();

    var elemId = $(elem).attr("id");
    switch (elemId) {
        case "requestId":
            requestId_change(+elemval)
            break;
        case "noSeriesId":
            if (elemval > 0) {

                $("#accountDetailId").empty();
                $("#accountDetailId").prop("disabled", false);
                $("#accountDetailId").prop("required", true);
                fill_select2("/api/FM/AccountDetailApi/getaccountdetailnamewhitnoseries", "accountDetailId", true, elemval, false);
                $("#accountDetailId").val(headerModel.accountDetailId).trigger("change");
            }
            break;
    }
}

function requestId_change(requestId) {

    shamsiOrderDate = "";
    $("#accountDetailId").prop("disabled", true);
    if (requestId > 0) {
        $.ajax({
            url: `${viewData_baseUrl_PU}/PurchaseInvoiceApi/getrecordbyid`,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(requestId),
            async: false,
            cache: false,
            success: function (response) {

                shamsiOrderDate = response.data.orderDatePersian;
                if (response.data.noSeriesId > 0) {
                    GetnoSeriesNamePurchasePersonInvoiceLine(response.data.noSeriesId);
                }


                if (response.data.accountDetailId > 0 && response.data.noSeriesId > 0) {
                    GetaccountDetailNamePurchasePersonInvoice(response.data.accountDetailId, response.data.noSeriesId);
                }
                else {
                    $("#accountDetailId").html(`<option value="0">0 - انتخاب کنید</option>`).val(0).trigger("change");
                }
            },
            error: function (xhr) {
                error_handler(xhr, `${viewData_baseUrl_Pu}/PurchaseInvoiceApi/getrecordbyid`)
            }
        });
    }

}

function GetnoSeriesNamePurchasePersonInvoiceLine(id) {
    $.ajax({
        url: `/api/GNApi/noseries_getname/${id}`,
        type: "get",
        contentType: "application/json",
        success: function (result) {
            if (result) {

                $("#noSeriesId").html(`<option value="${id}">${id} - ${result}</option>`).val(id).trigger("change");
                $("#noSeriesId").prop("disabled", true);
            }
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/AccountDetailApi/getnameNoSeries`)
            return null;
        }
    });
}

function GetaccountDetailNamePurchasePersonInvoice(id, noSeriesId) {

    $.ajax({
        url: `${viewData_baseUrl_FM}/AccountDetailApi/getnameaccountDetail`,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({ id: id, noSeriesId: noSeriesId }),
        success: function (result) {
            if (result) {
                $("#accountDetailId").prop("disabled", true);
                $("#accountDetailId").html(`<option value="${id}">${id} - ${result == undefined || result == null ? "" : result}</option>`).val(id).trigger("change");
            }
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/AccountDetailApi/getnameNoSeries`)
            return null;
        }
    });
}

function get_itemVat(itemId, itemTypeId) {

    var url = `${viewData_baseUrl_WH}/ItemApi/getitemvat/${itemId}/${itemTypeId}`
    $.ajax({
        url: url,
        async: false,
        type: "get",
        success: function (result) {

            if (checkResponse(result.data)) {
                if (result.data.vatTypeId === 1) {

                    if (checkResponse(result.data.vatEnable) && result.data.vatEnable && result.data.vatPer == 0) {
                        alertify.error(`لطفا درصد مالیات را برای آیتم ${result.data.itemName} تعریف نمایید. `);
                        return;
                    }
                    else {
                        $(".ins-out").data("model.vatper", result.data.vatPer);
                        $("#vatPer").val(result.data.vatPer);
                        additionalData[6].value = result.data.vatId;
                        additionalData[7].value = result.data.accountDetailId;
                        additionalData[8].value = result.data.noSeriesId;
                        $("#vatAmount").prop("disabled", true);
                    }
                }

                else {
                    $(".ins-out").data("model.vatper", 0);
                    $("#vatAmount").prop("disabled", false);
                    additionalData[6].value = result.data.vatId;
                    additionalData[7].value = result.data.accountDetailId;
                    additionalData[8].value = result.data.noSeriesId;
                }


            }
            else {
                $(".ins-out").data("model.vatper", 0);
                $("#vatAmount").prop("disabled", true);
            }


        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function cal_amount() {
    calc_grossAmount();
    calc_discountAmount();
}

function cal_getRatio() {

    let subUnitId = +$('#subUnitId').val();
    let newQuantity = +$("#quantity").val().replace("_", "000")
    let totalQuantity = newQuantity.toFixed(3)
    $('#quantity').val(totalQuantity);
    $('#totalQuantity').val(totalQuantity);
    additionalData[10].value = 1;
    additionalData[11].value = 0;
    if (subUnitId > 0) {

        if (checkResponse(subUnitId) != NaN && subUnitId != unitId && subUnitId != null) {

            $.ajax({
                url: `api/WH/ItemUnitApi/getratio/${subUnitId}`,
                type: "get",
                contentType: "application/json",
                success: function (result) {

                    if (checkResponse(result)) {
                        ratio = +result.ratio > 0 ? +result.ratio : 1;
                        totalQuantity = +$('#quantity').val().replace("_", "000") * ratio;
                        $('#totalQuantity').val(totalQuantity.toFixed(3));
                        if ($('#totalQuantity').val() == 0) {
                            $("#totalQuantity").attr("required", true);
                            $("#totalQuantity").attr("data-parsley-selectvalzero", true);
                        }
                        additionalData[10].value = ratio;
                        additionalData[11].value = result.idSubUnit;

                        cal_amount();
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, url);
                }
            });
        }
        else cal_amount();
    }
    else
        cal_amount();
}

function calc_grossAmount() {

    if (+removeSep($("#price").val()) > 0) {

        grossprice = +removeSep($("#price").val());
        var exchangeRate = +$("#isDefaultCurrency").val() ? 1 : +removeSep($("#exchangeRate").val());
        let quantity = +removeSep($("#totalQuantity").val().replace(/\//g, "."));
        var grossAmount = quantity * (+grossprice) * exchangeRate;

        $("#grossAmount").val(transformNumbers.toComma(grossAmount.toFixed(3)));
    }
}

function calc_grossAmountDetail(rowno) {

    if (checkResponse(rowno)) {


        let ratio = +$(`#previousStagePageTable .pagetablebody tr#row${rowno}`).data("ratio");

        let quantity = +removeSep($("#quantity_" + rowno + "").val().replace(/\//g, ".").replace(/_/g, ""));

        let totalQuantity = (quantity * ratio).toFixed(3);

        $("#quantity_" + rowno + "").val(quantity.toFixed(3));
        $("#totalQuantity_" + rowno + "").val(totalQuantity.toString());
        let exchangeRate = +$("#isDefaultCurrency").val() ? 1 : +removeSep($("#exchangeRate_" + rowno + "").val());

        grossprice = (+removeSep($("#price_" + rowno + "").val()) > 0 ? +removeSep($("#price_" + rowno + "").val()) : 0);

        let grossAmount = (totalQuantity * +grossprice * exchangeRate).toFixed(3);

        $("#grossAmount_" + rowno + "").val(transformNumbers.toComma(grossAmount));

    }
}

function calc_discountAmount() {

    var netAmount = 0;
    var grossAmount = +removeSep($("#grossAmount").val());
    if (grossAmount > 0) {
        if (+$("#discountType").val() == 0) {
            discountAmount = 0; discountprice = 0;
            netAmount = grossAmount.toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount));
            additionalData[14].value = 0;
            $("#grossAmount").val(transformNumbers.toComma(grossAmount.toFixed(3)));
        }
        //تخفیف به صورت درصد باشد
        else if (+$("#discountType").val() == 1) {
            discountAmount = 0; discountprice = 0;
            discountprice = (+$("#discountValue").val() > 0 ? (+$("#discountValue").val()) : 0);
            discountAmount = (grossAmount * (discountprice / 100));
            netAmount = grossAmount.toFixed(3) - discountAmount.toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount.toFixed(3)));
            additionalData[14].value = discountAmount;
        }
        //تخفیف بصورت مبلغ
        else {
            discountAmount = 0;
            discountprice = (+removeSep($("#discountValue").val()) > 0 ? (+removeSep($("#discountValue").val())) : 0);
            discountAmount = discountprice;
            netAmount = grossAmount.toFixed(3) - discountprice.toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount));
            additionalData[14].value = discountprice.toFixed(3);
        }


        var vatper = +$(".ins-out").data("model.vatper");


        if (checkResponse(vatper) && !isNaN(vatper) && vatper != 0) {
            //$("#vatPer").val(vatper);
            let vatAmount = ((vatper / 100) * netAmount);
            $("#vatAmount").val(transformNumbers.toComma(vatAmount.toFixed(3)));
            netAmountPlusVAT = (+vatAmount) + (+netAmount);
            $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmountPlusVAT.toFixed(3)));

        }
        else {
            $("#vatPer").val(0);
            $("#vatAmount").val(additionalData[6].value == 0 ? 0 : $("#vatAmount").val());
            $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmount));
        }

    }

}

function calc_discountAmountDetail(rowno, currentElm = null) {

    if (checkResponse(rowno)) {

        let netAmount = 0;
        let orderId = +$(`#previousStagePageTable .pagetablebody tr#row${rowno}`).data("id");


        let grossAmount = +removeSep($("#grossAmount_" + rowno + "").val().replace(/\//g, "."));
        if (grossAmount > 0) {
            if (+$("#discountType_" + rowno + "").val() == 0) {
                $("#discountValue_" + rowno + "").removeAttr("data-parsley-required");
                $("#discountValue_" + rowno + "").val("0").change();
                $("#discountValue_" + rowno + "").prop("disabled", true);
                $("#discountValue_" + rowno + "").data("disabled", true);
                netAmount = grossAmount.toFixed(3);
                $("#netAmount_" + rowno + "").val(transformNumbers.toComma(netAmount));
                additionalData[14].value = 0;
            }
            //تخفیف به صورت درصد باشد
            else if (+$("#discountType_" + rowno + "").val() == 1) {

                discountprice = +removeSep($("#discountValue_" + rowno + "").val());
                discountAmount = (grossAmount * (discountprice / 100)).toFixed(3);
                $("#discountAmount_" + rowno + "").val(transformNumbers.toComma(discountAmount));
                netAmount = (grossAmount - discountAmount).toFixed(3);
                $("#netAmount_" + rowno + "").val(transformNumbers.toComma(netAmount));
                additionalData[14].value = discountAmount;
            }
            //تخفیف بصورت مبلغ
            else {


                if (conditionalProperties.isQuantityPurchase) {//درخواست تعدادی می باشد

                    discountprice = +removeSep($("#discountValue_" + rowno + "").val());
                    netAmount = (grossAmount - discountprice).toFixed(3);
                    $("#netAmount_" + rowno + "").val(transformNumbers.toComma(netAmount));
                    $("#discountAmount_" + rowno + "").val(transformNumbers.toComma(discountprice));
                    additionalData[14].value = discountprice;

                }
                else {// درخواست ریالی می باشد

                    var result = getPurchaceOrderItems(orderId);
                    var totalQuantityBeforechange = result.totalQuantity;
                    var discountAmountBeforechange = result.discountAmount;
                    discountprice = (discountAmountBeforechange / totalQuantityBeforechange).toFixed(3);

                    let totalQuantity = $("#totalQuantity_" + rowno + "").val();

                    let discountAmount = totalQuantity * discountprice;

                    $("#discountValue_" + rowno + "").val(transformNumbers.toComma(discountAmount));
                    $("#discountAmount_" + rowno + "").val(transformNumbers.toComma(discountAmount));

                    netAmount = (grossAmount - discountAmount).toFixed(3);
                    $("#netAmount_" + rowno + "").val(transformNumbers.toComma(netAmount));
                    additionalData[14].value = discountAmount;
                }
            }

            var vatper = +$("#row" + rowno + "").data("vatper");
            if (checkResponse(vatper) && !isNaN(vatper) && vatper != 0) {
                $("#vatPer_" + rowno + "").val(vatper);
                vatAmount = +((vatper / 100) * (+(netAmount.toString())));
                $("#vatAmount_" + rowno + "").val(transformNumbers.toComma(vatAmount.toFixed(3)));

                netAmountPlusVAT = +(vatAmount + (+(netAmount.toString())));
                $("#netAmountPlusVat_" + rowno + "").val(transformNumbers.toComma(netAmountPlusVAT.toFixed(3)));

            }
            else {

                $("#vatPer_" + rowno + "").val(0);
                $("#vatAmount_" + rowno + "").val(0);
                $("#netAmountPlusVat_" + rowno + "").val(transformNumbers.toComma(netAmount));

            }
        }
    }
}

function setNetAmountPlusVAT() {

    $("#netAmountPlusVAT").val('');
    let vatAmount = +removeSep($("#vatAmount").val());
    let netAmount = +removeSep($("#netAmount").val());
    netAmountPlusVAT = vatAmount + netAmount;
    $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmountPlusVAT));



}

function fillAcountDetailId(evp, beforDiscount, callback = undefined) {

    if (evp != undefined) {

        evp.preventDefault();
        evp.stopPropagation();

    }

    let categoryId = +additionalData[3].value;
    let grossAmount = +removeSep($("#grossAmount").val());
    let discount = +discountAmount > 0 ? +discountAmount : 0;

    $("#accountDetailId").html("<option value='0'>انتخاب کنید</option>");
    $("#accountDetailId").val("0").trigger("change");

    if (categoryId > 0 && grossAmount > 0) {

        let postingGroupTypeLineIds = '';
        postingGroupTypeLineIds += (grossAmount != Math.floor(grossAmount) ? '13,19,' : '13,');
        postingGroupTypeLineIds += (discount == 0 ? '' : (discount != Math.floor(discount) ? '14,21,' : '14,'));
        postingGroupTypeLineIds = postingGroupTypeLineIds.slice(0, -1);

        try {

            setTimeout(function () {
                //$("#accountDetailId").select2('destroy');

                fill_select2(`/api/FM/AccountDetailApi/getaccountdetailbyitem`, "accountDetailId", true, `${categoryId}/${stageId}/${postingGroupTypeLineIds}/${branchId}`, false, "3", "انتخاب تفصیل",
                    function () {


                        if (beforDiscount == "before") {
                            $("#accountDetailId").select2("focus");
                        }

                        if (callback != undefined)
                            callback()
                    }, "",
                    false, true, false, false, false, false, "");

            }, 500);

        } catch (e) {
            console.log(e)
        }
    }

}

function getPurchaceOrderItems(orderId) {
    let url = `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getrequestinfo`;
    var result = $.ajax({
        url: url,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(orderId),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

async function update_action() {

    currentActionId = actionId;
    requestedActionId = +$(`#${activePageId} #action`).val();

    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        identityId: +id,
        stageId: stageId,
        isLine: true,
        isPurchaceOrderLine: false,
        workflowId: workflowId,
        workflowCategoryId: workflowCategoryIds.purchase.id,
        documentDatePersian: $(`#${activePageId} #formPlateHeaderTBody`).data("orderdatepersian"),
        parentWorkflowCategoryId: conditionalProperties.parentworkflowcategoryid,
        requestId: requestId
    }


    loadingAsync(true, "stepRegistration", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {

            if (model.requestActionId != currentActionId)
                checkValidateUpdateStep(model);

            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "stepRegistration", "");
            }
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $(`#${activePageId} #action`).val(model.currentActionId);
            loadingAsync(false, "stepRegistration", "");
        }


    }, 10)

}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}


function checkValidateUpdateStep(model) {

    let url = `api/PU/PurchaseOrderActionApi/validateupdatestep`;

    let outPut = $.ajax({
        url: url,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {

                var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);

                updateActionPurchase(model, currentStageAction, requestStageAction);
            }
            else {

                if (checkResponse(result.validationErrors)) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                    $(`#purchaseInvoiceLinePage #action`).val(model.currentActionId);
                }
            }
            loadingAsync(false, "stepRegistration", "");
        },
        error: function (xhr) {
            error_handler(xhr, url);
            loadingAsync(false, "stepRegistration", "");
        }
    });
    return outPut.responseJSON;


}

function updateActionPurchase(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 
    if (currentStageAction.priority < requestStageAction.priority) {

        let multipleSettlement = true;
        // بررسی وضعیت تسویه بر اساس جریان کار و مرحله  درخواست
        var purchaseOrder = getPurchaseOrderInfo(model.requestId);
        if (model.requestId > 0)
            multipleSettlement = getMultipleSettlement(purchaseOrder.workflowId, purchaseOrder.stageId);
        else
            multipleSettlement = false;

        //#region گام3 به گام 4

        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);
                if (result.data.successfull) {
                    sendDocument(model, () => {
                        updateStatus(model);
                    });
                }
                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $(`#purchaseInvoiceLinePage #action`).val(model.currentActionId);
                }
            }
            else {
                sendDocument(model, () => {
                    updateStatus(model);
                });
            }

        }

        //#endregion

        //#region گام2 به گام 3   

        else if (!currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);

                if (result.data.successfull)
                    updateStatus(model,
                        () => {
                            $(`#purchaseInvoiceLinePage #action`).val(model.requestedActionId)
                        });

                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $(`#purchaseInvoiceLinePage #action`).val(model.currentActionId);
                }
            }
            else {
                updateStatus(model,
                    () => {
                        $(`#purchaseInvoiceLinePage #action`).val(model.requestedActionId)
                    });
            }


        }

        //#endregion

    }

    //#region  کاهش گام
    else {
        // گام4 به گام 3 
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            sendDocument(model, () => {
                updateStatus(model,
                    () => {
                        $("#action").val(model.requestedActionId).trigger("change")
                    });
            });
        }
        // گام3 به گام 2 
        else if (currentStageAction.isLastConfirmHeader && !requestStageAction.isLastConfirmHeader)
            updateStatus(model,
                () => {
                    $("#action").val(model.requestedActionId).trigger("change")
                });
    }
    //#endregion
}

function checkHeaderBalance(model) {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: model.requestId,
        workflowCategoryIdCurrentStage: +workflowCategoryIds.purchase.id,
        workflowCategoryIdParentStage: +workflowCategoryIds.purchase.id,
        amountOrQuantity: false
    }

    var outPut = $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelnew),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            return 0;
        }
    });

    return outPut.responseJSON;
}

function sendDocument(model, callBack) {

    let newmodel = {
        identityId: +model.identityId,
        stageId: +model.stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    let requestedStageStep = checkIsSendActionId(model), viewModelSend = {};

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);


        if (isPostGroupList.length === 0) {
            viewModelSend = {
                model: [{ id: model.identityId }],
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/purchasepost`
            };
            sendDocPostingGroup(viewModelSend,
                () => { $(`#purchaseInvoiceLinePage #action`).val($(`#purchaseInvoiceLinePage #formPlateHeaderTBody`).data("actionid")) }, callBack);
        }
        else
            updateStatus(model);
    }
    else {

        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length !== 0) {
            viewModelSend = [{
                identityId: +model.identityId,
                stageId: +model.stageId
            }];
            undoDocPostingGroup(viewModelSend, () => {
                $(`#purchaseInvoiceLinePage #action`).val(model.requestActionId)
            }, callBack);
        }
        else
            updateStatus(model);
    }

}

function checkIsSendActionId(obj) {
    let model = {
        stageId: obj.stageId,
        actionId: obj.requestActionId,
        worFlowId: obj.worFlowId
    }

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

function updateStatus(model) {

    var url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`;

    if (model.requestActionId > 0) {
        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                afterUpdateStatus(result);
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

function afterUpdateStatus(result) {

    if (result.successfull) {
        $(`#${activePageId} #action`).val(requestedActionId);
        alertify.success(result.statusMessage);
        get_header();

    }
    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }
    configPersonOrderElementPrivilage(`.ins-out`, false, false);
}

function showStepLogs() {
    stepLog();
    modal_show(`${activePageId} #stepLogModal`);
}

function close_modal_stepLogs() {
    modal_close("stepLogModal");
}

function stepLog() {

    $("#stepLogRows").html("");

    var url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist/${id}/${stageId}/${workflowId}`

    $.ajax({
        url: url,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
                $("#stepLogRows").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function fill_NewPageTable(result, pageId = null, callBack = undefined) {

    if (pageId == null) pageId = "pagetable";
    if (!result) return "";

    let columns = result.columns.dataColumns,
        buttons = result.columns.buttons;
    let list = result.data,
        columnsL = columns.length,
        listLength = list.length,
        buttonsL = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pageId),
        conditionTools = [],
        conditionAnswer = "",
        conditionElseAnswer = "",
        isMainas = false;


    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;

    let pagetable_editable = arr_pagetables[index].editable,
        pagetable_selectedItems = arr_pagetables[index].selectedItems,
        pagetable_selectable = arr_pagetables[index].selectable,
        pagetable_highlightrowid = arr_pagetables[index].highlightrowid,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_endData = arr_pagetables[index].endData;

    if (list.length == 0) {
        if (pagetable_currentpage == 1) {
            if ($(`#${pageId} table.pagetablebody > thead`).find("tr th").length != 0) {
                let lengthColumn = $(`#${pageId} table.pagetablebody > thead`).find("tr th").length;
                $(`#${pageId} .pagetablebody tbody`).empty()
                let emptyRow = fillEmptyRow(lengthColumn);
                $(`#${pageId} .pagetablebody tbody`).html(emptyRow);
                return
            }
        }
        else
            return
    }

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";
    if (!pagetable_endData) {
        //arr_pagetables[index].endData = true;

        arr_pagetables[index].endData = listLength < pagetable_pagerowscount;

        let elm_pbody = $(`#${pageId} .pagetablebody`);
        if (pagetable_currentpage == 1)
            elm_pbody.html("");

        let btn_tbidx = 1000,
            str = "",
            rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (pagetable_currentpage == 1) {
            let col = {}, width = 0, rowLength = 0;

            str += '<thead class="table-thead-fixed">';
            str += '<tr>';
            if (pagetable_editable == true)
                str += `<th style="width:2%"></th>`;
            if (pagetable_selectable == true)
                str += `<th style="width:2%;text-align:center !important"><input class="selectedItem-checkbox-all" onchange="changeAll(this,'${pageId}')" ${typeof pagetable_selectedItems == "undefined" ?
                    "" : list.length !== 0 && pagetable_selectedItems.length == list.length ? "checked" : ""} class="checkall" type = "checkbox" ></th >`;
            for (var i = 0; i < columnsL; i++) {
                col = columns[i];
                width = col.width;
                if (col.isDtParameter) {
                    str += '<th style="' + ' text-align:' + col.align + '!important;' + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '"';
                    if (col.id != "action") {
                        if (col.order)
                            str += `class="headerSorting" id="header_${i}" data-type="" data-col="${col.id}" data-index="${i}" onclick="sortingButtonsByThNew(${result.columns.order},this,'${pageId}')"><span id="sortIconGroup" class="sortIcon-group">
                                <i id="desc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                                <i id="asc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
                            </span>` + col.title + '</th>';
                        else
                            str += '>' + col.title + '</th>';
                    }
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';

        }
        else
            elm_pbody = $(`#${pageId} .pagetablebody tbody`);

        if (list.length == 0) {
            if (rowLength == 0)
                str += fillEmptyRow($(str).find("tr th").length);
        }
        else
            for (var i = 0; i < listLength; i++) {
                var item = list[i];
                var rowno = rowLength + i + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j = 0; j < columnsL; j++) {
                    var primaries = "";


                    for (var k = 0; k < columnsL; k++) {
                        var v = columns[k];
                        if (v["isPrimary"] === true)
                            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                    }

                    colwidth = columns[j].width;
                    if (j == 0) {
                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1">';
                            }
                        }
                        if (pagetable_editable == true)
                            str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                        if (pagetable_selectable == true) {
                            str += `<td id="col_${rowno}_1" class="selectedItem-checkbox" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

                            var validCount = 0;
                            var primaryCount = 0;
                            var isCol = false;

                            var selectedItems = arr_pagetables[index].selectedItems;
                            $.each(selectedItems, function (k, v) {
                                $.each(v, function (key, val) {
                                    var column = columns.filter(a => a.id.toLowerCase() == key)[0];
                                    primaryCount += 1;
                                    if (item[column.id] == val)
                                        validCount += 1;
                                })
                                if (validCount == primaryCount)
                                    isCol = true;
                                primaryCount = 0;
                                validCount = 0;
                            })
                            if (isCol) {
                                str += 'checked />';
                            }
                            else {
                                str += '/>';
                            }
                            str += '</td >';

                        }
                    }

                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {

                            colno += 1;
                            var value = item[columns[j].id];

                            if (columns[j].editable) {
                                var dataDisabled = columns[j].isReadOnly ? `data-disabled="true"` : "";
                                resultClass = columns[j].isReadOnly ? "enable-requst-field" : "";


                                str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}"  class="${resultClass}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {
                                    str += `<select id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${dataDisabled} disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "dynamicSelect") {

                                    str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${dataDisabled} disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;
                                    var inputsName = `${columns[j].id}Inputs`;
                                    var lenInput = item[inputsName] != null ? item[inputsName].length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = item[inputsName][h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" ${dataDisabled} disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" ${dataDisabled} disabled />`;

                                }


                                else if (columns[j].inputType == "decimal") {

                                    countDecimal = value.toString().countDecimals();
                                    let decimalValue = parseFloat(value).toFixed(countDecimal);
                                    decimalValue = decimalValue.toString()

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${decimalValue}" class="form-control decimal mask" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" required maxlength="10" autocomplete="off" ${dataDisabled} disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input type="checkbox" name="checkbox" ${dataDisabled} disabled id="${columns[j].id}_${rowno}" ${value ? "checked" : ""} />
                                            <label for="${columns[j].id}_${rowno}"></label>
                                        </div>`;
                                }
                                else if (columns[j].inputType == "searchPlugin") {
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" ${dataDisabled} class="form-control number searchPlugin" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                }
                                else if (columns[j].inputType == "select2") {

                                    var onchange = `tr_object_onchange('${pageId}',this,${rowno},${colno})`;
                                    var nameVlue = "";
                                    if (columns[j].id.indexOf("Id") != -1) {
                                        var val = item[columns[j].id.replace("Id", "") + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }
                                    else {
                                        var val = item[columns[j].id + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }

                                    str += `<div ${dataDisabled} >${nameVlue}</div>`
                                    str += `<div class="displaynone"><select data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select></div>";
                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].hasLink) {
                                    if (value != null && value != "")
                                        str += `<td id="col_${rowno}_${colno}" style="${columns[j].align == "center" ? `text-align:${columns[j].align}!important;` : ''};width:${colwidth}%" class="itemLink" onclick="click_link_${columns[j].id}(this,event)">${value}</td>`;
                                    else
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%" >' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type === 5) {
                                    if (value != null && value != "") {

                                        if (value && columns[j].isCommaSep)
                                            value = value > 0 ? transformNumbers.toComma(value) : `(${transformNumbers.toComma(Math.abs(value))})`;

                                        countDecimal = value.toString().countDecimals();

                                        if (countDecimal > 0) {
                                            let decimalValue = parseFloat(value).toFixed(countDecimal);
                                            value = decimalValue.toString()
                                        }

                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 6 || columns[j].type === 9) || (columns[j].inputType == "ip")) {

                                    if (value != null && value != "") {

                                        if (!isNaN(+value)) {
                                            isMainas = value < 0;
                                            value = Math.abs(value);
                                        }
                                        else
                                            isMainas = false;

                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5)
                                            value = value.toString()

                                        if (isMainas && columns[j].type === 9) {
                                            value = `(${value})`;
                                        } else if (isMainas && columns[j].type !== 9) {
                                            value = -value;
                                        }


                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else if (columns[j].type == 7) {
                                    value = '<img src="' + value + '" height="35" ></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else {
                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;" >' + value + '</td>';
                                    else
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {
                            colno += 1;
                            let strBtn = "";

                            let runButtonIndex = result.columns.runButtonIndex;
                            let inputParameterRunButton = `${item[columns[0].id]},${rowno},this,event`

                            if (runButtonIndex !== "") {
                                let runButtonIndexArray = runButtonIndex.split(',');

                                let runButtonIndexArrayLength = runButtonIndexArray.length;
                                inputParameterRunButton = "";
                                for (var rbi = 0; rbi < runButtonIndexArrayLength; rbi++) {
                                    let parameterValue = item[runButtonIndexArray[rbi]];
                                    inputParameterRunButton += `'${parameterValue}',`;
                                }

                                inputParameterRunButton += `${rowno},this,event`
                            }

                            if (result.columns.actionType === "dropdown") {
                                str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    strBtn += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    strBtn += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    var condition = createConditionString(btn.condition, item);
                                    if (btn.isSeparator == false) {
                                        if (btn.condition == null || eval(condition)) {
                                            btn_tbidx++;
                                            strBtn += `<button id="btn_${btn.name}" onclick="run_button_${btn.name}(${inputParameterRunButton})" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                        }
                                    }
                                    else
                                        if (btn.condition == null || eval(condition))
                                            strBtn += `<div class="button-seprator-hor"></div>`;
                                }

                                strBtn += `</div>
                                </div>`;

                                if ($(strBtn).find("button:not(.dropdown-toggle)").length == 0)
                                    strBtn = "";
                                str += strBtn;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    var condition = createConditionString(btn.condition, item);
                                    if (!btn.isSeparator) {

                                        if (btn.condition == null || eval(condition)) {
                                            btn_tbidx++;
                                            str += `<button type="button" ${btn.isFocusInline == true ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${inputParameterRunButton},event)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                        }
                                    }
                                    else
                                        if (btn.condition == null || eval(condition))
                                            str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                    }
                }
                str += '</tr>';
            }

        if (pagetable_currentpage == 1)
            str += '</tbody>';

        elm_pbody.append(str);

        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack);
    }
}

function tr_onkeydownNew(pg_name, elem, ev) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables[index].currentcol
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else {
                pagetable_currentrow--;
                arr_pagetables[index].currentrow = pagetable_currentrow;
                after_change_tr(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            //else if (pagetable_currentpage !== 1)
            //    pagetable_prevpage(pagetable_id);
        }
    }

    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if (document.activeElement.className.indexOf("select2") >= 0) // Open when ArrowDone In Select2
            return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else {
                pagetable_currentrow++;
                arr_pagetables[index].currentrow = pagetable_currentrow;

                after_change_tr(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            //else if (pagetable_currentpage != pagetable_lastpage) {
            //    arr_pagetables[index].currentrow = 1;
            //    pagetable_nextpage(pagetable_id);
            //}
        }
    }

    else if (ev.which === KeyCode.Enter) {

        if (pagetable_editable) {

            if (!pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow, true);
                pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
            }
            var currentElm;
            var tdLength;


            currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio,.search-modal-container > input").first()
            tdLength = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td`).find("input,select,div.funkyradio,.search-modal-container > input").length;

            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editing(pg_name);

                    if (pg_name == "previousStagePageTable")
                        if (currentElm.parents("td").hasClass("enable-requst-field")) {

                            currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td.enable-requst-field`).find("input,select,div.funkyradio,.search-modal-container > input").first()

                        }
                        else {
                            let tdEdit = currentElm.parents("td");
                            for (var i = 0; i < tdLength; i++) {
                                if (tdEdit.hasClass("enable-requst-field")) {
                                    currentElm = tdEdit.find("input,select,div.funkyradio,.search-modal-container > input");
                                    break;
                                }
                                else
                                    tdEdit = tdEdit;
                            }
                        }


                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else if (currentElm.hasClass("select2")) {

                        var colno = currentElm.parent().parent().attr("id").split("_")[2];
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2();
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2("focus");
                    }
                    else
                        currentElm.focus();
                }
                else {
                    var nextElm = undefined,
                        nextTds = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} td`),
                        nextTdsL = nextTds.length;

                    for (var x = pagetable_selectable ? 1 : 0; x < nextTdsL; x++) {
                        var v = nextTds[x];
                        if (nextElm == undefined) {
                            if ($(v).attr("id") != undefined) {
                                var currentcol = $(v).attr("id").split("_")[2];
                                if (+currentcol > +pagetable_currentcol) {
                                    var nxtElm;
                                    nxtElm = $(v).find('input,select,div.funkyradio,button[data-isfocusinline="true"]').first();

                                    if (nxtElm.length > 0 && $(nxtElm).attr("readonly") != "readonly" && $(nxtElm).attr("disabled") != "disabled") {
                                        nextElm = nxtElm;
                                    }
                                }
                            }
                        }
                    }
                    // المنت بعدی وجود داشت
                    if (nextElm != undefined && nextElm.length != 0) {
                        if (currentElm.hasClass("funkyradio")) {
                            var td_lbl_funkyradio = currentElm.find("label");
                            td_lbl_funkyradio.removeClass("border-thin");
                        }
                        if (nextElm.hasClass("select2")) {
                            var colno = nextElm.parent().parent().attr("id").split("_")[2];
                            tr_onfocus(pg_name, colno);
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2();
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2("focus");
                        }
                        else if (nextElm.hasClass("funkyradio")) {
                            nextElm.focus();

                            var td_lbl_funkyradio = nextElm.find("label");
                            td_lbl_funkyradio.addClass("border-thin");
                        }
                        else
                            nextElm.focus();
                    }
                    else {
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                arr_pagetables[index].currentrow = pagetable_currentrow;

                                after_change_tr(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).
                    find("input:first,select:first,div.funkyradio:first,.search-modal-container > input");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,.search-modal-container > input").attr("disabled", true);
                }
            }

        }

    }

    else if (ev.which === KeyCode.Esc) {
        if (pagetable_editable) {

            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow);
                after_change_tr(pg_name, KeyCode.Esc);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);
                    pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
                }
            }
            else {
                var modal_name = $(`#${pagetable_id}`).closest("div.modal").attr("id");
                modal_close(modal_name);
            }
        }
    }

    else if (ev.which === KeyCode.Space) {
        if (pagetable_editable && pagetable_tr_editing) {

            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio")) {

                ev.preventDefault();

                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol} .funkyradio > input[type="checkbox"]`)[0];
                $(checkbox_funky).prop("checked", !$(checkbox_funky).prop("checked")).trigger("change");
            }
            //else if (elm.prop("tagName").toLowerCase() === "select") {

            //}
        }

        else if (pagetable_editable === false && pagetable_tr_editing === false || pagetable_selectable) {
            ev.preventDefault();
            pagetable_currentcol = 1;

            var editMode = false;
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input", "select").each(function () {
                if ($(this).prop("disabled") == false && $(this).attr("type") != "checkbox")
                    editMode = true;
            })
            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input[type='checkbox']").first();
            if (!editMode) {
                if (elm.prop("checked")) {
                    var pagetable = $(`#${pg_name}`);
                    $(pagetable).find("input[type='checkbox']").first().prop("checked", false);
                }
                elm.prop("checked", !elm.prop("checked"));
                itemChange(elm);
            }
        }
    }
}

function tr_save_row(pagetable_id, keycode) {

    after_save_row(pagetable_id, "success", keycode, false);
}

function set_row_editing(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_editable = arr_pagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
    var pagetable_currentcol = arr_pagetables[index].currentcol;

    if (pagetable_editable) {
        arr_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");

        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input[data-disabled],select[data-disabled],div.funkyradio[data-disabled]").attr("disabled", false);

    }
}

function configSelect2_trEditing(pg_name, rowno, enableConfig = false) {
    $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td[data-select2='true'].enable-requst-field`).each(function () {
        if ($(`#${pg_name} #${$(this).attr("id")} div`).first().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).first().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).first().addClass("displaynone");

        if ($(`#${pg_name} #${$(this).attr("id")} div`).last().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).last().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).last().addClass("displaynone");

    })
    if (enableConfig) {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var columns = arr_pagetables[index].columns;
        $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td.enable-requst-field`).find("select.select2").each(function () {
            var elemId = $(this).attr("id");
            var colId = elemId.split("_")[0];
            var column = columns.filter(a => a.id == colId)[0];
            var getInputSelectConfig = column.getInputSelectConfig;
            if (getInputSelectConfig != null && column.isSelect2) {
                var params = "";
                var parameterItems = getInputSelectConfig.parameters;
                if (parameterItems != null && parameterItems.length > 0) {
                    for (var i = 0; i < parameterItems.length; i++) {
                        var paramItem = parameterItems[i].id;
                        if (parameterItems[i].inlineType)
                            params += $(`#${pg_name} #${paramItem}_${rowno}`).val();
                        else
                            params += $(`#${paramItem}`).val();

                        if (i < parameterItems.length - 1)
                            params += "/";
                    }
                }
                var val = +$(`#${pg_name} #${elemId}`).data("value");
                $(`#${pg_name} #${elemId}`).empty();

                if (column.pleaseChoose)
                    $(`#${pg_name} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                    fill_select2(getInputSelectConfig.fillUrl, `${pg_name} #${elemId}`, true, params, false, 0, '', function () {
                        $(`#${pg_name} #${elemId}`).val(val).trigger("change");
                    });
                }
            }
            else {
                var val = +$(`#${pg_name} #${$(this).attr("id")}`).data("value");
                $(`#${pg_name} #${elemId}`).select2();
                $(`#${pg_name} #${elemId}`).val(val).trigger("change");
            }
        });
    }

    if (typeof after_configSelect2_trEditing != "undefined")
        after_configSelect2_trEditing();

}

function after_configSelect2_trEditing() {
    var row = $($("#previousStagePageTable table tbody tr.highlight")[0]);
    var inOutElem = undefined;
    row.find("td select").each(function () {
        if ($(this).attr("id").indexOf("inOut") != -1)
            inOutElem = $(this);
    });

}

function validate_lineTable() {

    var errorCount = 0;
    var rowElems = $(`#previousStagePageTable .pagetablebody > tbody > tr `);
    for (var j = 0; j < rowElems.length; j++) {
        var id = +$(rowElems[j]).data("id");
        if ($(rowElems[j]).find("input[type='checkbox']").first().prop("checked")) {

            var elems = $(rowElems[j]).first().find("td:not(:eq(1))").find("input,select");
            var item = `{ "id": "${id}","headerId":"${+$("#formPlateHeaderTBody").data("id")}","stageId":"${$("#stageId").val()}","fundTypeId":"${$("#previousStagePageTable #form_keyvalue").val()}",`;
            for (var i = 0; i < elems.length; i++) {
                var val = set_columnFormat($(elems[i]));
                item += `"${$(elems[i]).attr("id").split("_")[0]}": "${val}",`;
            }
            item += "}";
            item = item.replace(",}", "}");

            item = JSON.parse(item);

            var itemError = false, itemValidError = false;
            var resultMessage = "", resultValidMessage = "";

            if (+item.price == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "مبلغ ";

            }

            if (itemError) {
                errorCount += 1;

                if (resultMessage !== "")
                    resultMessage += " را وارد نمایید";


                if (itemValidError) {
                    resultValidMessage += " معتبر نیست";
                    resultMessage = resultMessage + " | " + resultValidMessage;
                }

                $(rowElems[j]).attr("title", resultMessage);
                $(rowElems[j]).addClass("row-danger");
            }
            else {
                $(rowElems[j]).attr("title", "");
                $(rowElems[j]).removeClass("row-danger");
            }
        }
    }
    return errorCount;
}

function set_columnFormat(elm) {

    var val = undefined;
    if (elm.hasClass("money"))
        val = +removeSep(elm.val().replace(/\//g, ".")) !== 0 && !isNaN(+removeSep(elm.val().replace(/\//g, "."))) ? +removeSep(elm.val().replace(/\//g, ".")) : 0;
    else if (elm.hasClass("decimal"))
        val = +removeSep(elm.val().replace(/\//g, ".").replace(/_/g, "")) !== 0 && !isNaN(+removeSep(elm.val().replace(/\//g, ".").replace(/_/g, ""))) ? removeSep(elm.val().replace(/\//g, ".").replace(/_/g, "")) : 0;
    else if (elm.hasClass("number"))
        val = +removeSep(elm.val()) != 0 && !isNaN(+removeSep(elm.val())) ? +elm.val() : 0;
    else if (elm.hasClass("str-number"))
        val = +removeSep(elm.val()) !== 0 && !isNaN(+removeSep(elm.val())) ? elm.val() : "";
    else if (elm.attr("type") == "checkbox")
        val = elm.prop("checked");
    else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
        val = elm[0].value;
    else
        if (val !== null)
            val = myTrim(elm.val());

    return val;
}

function run_button_insert_PreviousStageLines(id = 0, rowNo = 0, elem = null) {

    var data = [];
    id = additionalData[0].value;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    let selectedItemsPurchaseInvoice = [];
    selectedItemsPurchaseInvoice = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;
    var accountDetailId = +$("#formPlateHeaderTBody").data("accountdetail").split("-")[0];

    if (selectedItemsPurchaseInvoice.length > 0) {
        if ($(`#previousStagePageTable .pagetablebody > tbody > tr .editrow`).length == 0) {

            if (validate_lineTable() == 0) {
                selectedItemsPurchaseInvoice.forEach(function (value) {
                    var rowElems = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().find("td:not(:eq(1))").find("input,select");


                    var rowId = $(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).attr("id");
                    var rowNumber = +rowId.replace("row", "");

                    let quantity = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"] #quantity_${rowNumber}`).val().replaceAll("._", "");
                    let discountAmount = $(`#previousStagePageTable .pagetablebody [data-id="${value.id}"] #discountAmount_${rowNumber}`).val().replaceAll("._", "");
                    discountAmount = +removeSep(discountAmount);


                    var model = {
                        id: +value.id,
                        headerId: +$("#formPlateHeaderTBody").data("id"),
                        branchId: branchId,
                        stageId: +$("#formPlateHeaderTBody").data("stageid"),
                        categoryId: +value.categoryid,
                        accountDetailId: accountDetailId,
                        requestId: requestId,
                        personOrderId: id,
                        headerAccountDetailId: +headerModel.accountDetailId,
                        headerNoSeriesId: +headerModel.noSeriesId,
                        vatId: +value.vatid,
                        vatNoSeriesId: +value.vatnoseriesid,
                        vatAccountDetailId: +value.vataccountdetailid,
                        isquantity: value.isquantity,
                        quantity: +quantity,
                        totalquantity: +(quantity * +value.ratio),
                        subUnitId: checkResponse(value.subunitid) ? +value.subunitid : 0,
                        priceIncludingVAT: checkResponse(value.priceincludingvat) ? value.priceincludingvat : false,
                        discountAmount: discountAmount,
                        workFlowId: additionalData[17].value,
                        currencyId: defaultCurrency,
                        inOut: +value.inout,
                        itemTypeId: +value.itemtypeid,
                        stageClassId: additionalData[19].value,

                    };

                    for (var i = 0; i < rowElems.length; i++) {
                        var val = set_columnFormat($(rowElems[i]));
                        if (val != "" && val != 0 && val != null && val != undefined) {



                            var elemId = $(rowElems[i]).attr("id").split("_")[0];
                            if (elemId != "inOut") {
                                model[elemId] = val;
                            }
                            if (elemId == "discountValue") {
                                model[elemId] = val;
                                model.discountAmount = val;
                            }
                            if (elemId == "discountType") {
                                model[elemId] = val;
                                model.discountType = val;
                            }
                        }
                    }




                    let prop = ["accountDetailId", "branchId", "categoryId", "discountType", "discountValue",
                        "grossAmount", "headerId", "headerAccountDetailId", "headerNoSeriesId", "vatId", "vatNoSeriesId",
                        "vatAccountDetailId", "isquantity", "id", "netAmount", "netAmountPlusVat", "personOrderId",
                        "price", "quantity", "totalquantity", "requestId", "stageId", "vatAmount", "subUnitId", "priceIncludingVAT", "discountAmount", "workFlowId", "currencyId", "inOut", "itemTypeId", "stageClassId"
                    ],

                        modelSend = {};

                    modelSend = safeJSONParse(JSON.stringify(model), prop);

                    data.push(modelSend);

                });
            }
            else {
                loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                var msgItem = alertify.error("تعدادی از سطرها دارای خطا است");
                msgItem.delay(alertify_delay);
            }
        }
        else {
            loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
            var msgItem = alertify.error("ابتدا وضعیت تمام سطرها را مشخص کنید");
            msgItem.delay(alertify_delay);
        }
    }

    else {
        loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }


    if (data.length > 0) {
        var errordata = [];
        errordata = data.filter(x => x.netAmount < 0 || x.netAmountPlusVat < 0 || x.vatAmount < 0 || x.discountAmount < 0);
        if (errordata.length > 0) {

            let stringIds = "";
            for (var i = 0; i < errordata.length; i++) {
                stringIds += errordata[i].id + ",";
            }
            var msgItem = alertify.warning(`سطرهای  فوق ${stringIds}دارای مبالغ منفی است مجوز ثبت ندارید`);
            msgItem.delay(8);

            loadingAsync(false, "insertPreviousStageLine");

            return;
        }

        else {

            insert_PreviousStageLinessAsync(data).then(

                (res) => {

                    loadingAsync(false, $("#insertPreviousStageLine").prop("id"));

                    if (res.validationErrors.length > 0) {
                        showErrorValidtionPreviousStageLines(res.validationErrors);
                        return;
                    }
                    else {

                        get_header();

                        var msgItem = alertify.success("اطلاعات با موفقیت ثبت شد");
                        msgItem.delay(alertify_delay);

                        close_modal_previousStageRequests();

                    }
                    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
                    arr_pagetables[index].selectedItems = [];
                    //$(`#previousStagePageTable`).find(".selectedItem-checkbox input[type='checkbox']").prop("checked", false);
                    $(`#previousStagePageTable .selectedItem-checkbox-all`).prop("checked", false).trigger("change");
                    if (res.successfull) {
                        getPagetable_HeaderLine("jsonOrderLineList");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                    return;
                },
                (result) => {
                    modal_close("previousStagePersonInvoiceLines");
                    return;
                });
        }
    }

}

function showErrorValidtionPreviousStageLines(errors) {

    if (errors !== null) {
        const errorsLn = errors.length;
        let output = "", errorValItem = "", errorValExistItem = "", errorValExistItem1 = "", errorValExistItem2 = "", cama = "", errorStrItem = "", errorStrExistItem = "", errorStrExistItem1 = "", errorStrExistItem2 = "";

        for (var i = 0; i < errorsLn; i++) {
            if (errors[i].split('-')[0] == "0") {
                output = `<tr><td id="error_${0}">${errors[i].split('-')[1]}</td></tr>`;
            }
            else if (errors[i].split('-')[0] == "1") {
                cama = ""
                cama = ","
                errorStrItem = "شناسه کالاهای ذکر شده به تامین کننده تخصیص داده نشده است";
                errorValItem += errors[i + 1].split('-').length > 1 ? `${errors[i + 1].split('-')[1]}${cama}` : `${errors[i + 1]}${cama}`;
                i++;
            }
            else if (errors[i].split('-')[0] == "2") {
                cama = ""
                cama = "</br>,"
                errorStrExistItem = "کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
                errorValExistItem += `${errors[i + 1].split('-')[0] + '-' + errors[i + 1].split('-')[1]}${cama}`;
                i++;
            }
            else if (errors[i].split('-')[0] == "3") {
                cama = ""
                cama = "</br>,"
                errorStrExistItem1 = "برای آیتم های زیر مبلغ با ارزش افزوده نمی تواند صفر باشد";
                errorValExistItem1 += `${errors[i + 1].split('-')[0] + '-' + errors[i + 1].split('-')[1]}${cama}`;
                i++;
            }
            else if (errors[i].split('-')[0] == "4") {
                cama = ""
                cama = "</br>,"
                errorStrExistItem2 = "برای آیتم های زیر ، تخفیف را مشخص نمایید";
                errorValExistItem2 += `${errors[i + 1].split('-')[0] + '-' + errors[i + 1].split('-')[1]}${cama}`;
                i++;
            }
            else {
                output += `<tr><td id="error_${0}">${errors[i]}</td></tr>`;
                i++;
            }
        }
        if (errorValItem != null && errorValItem != "") {

            output += `<tr><td id="error_${0}">${errorStrItem}</td></tr>`;
            output += `<tr><td id="error_${1}">${(errorValItem.slice(0, -1))}</td></tr>`;
        }
        if (errorValExistItem != null && errorValExistItem != "") {
            output += `<tr><td id="error_${2}">${errorStrExistItem}</td></tr>`;
            output += `<tr><td id="error_${3}">${(errorValExistItem.slice(0, -1))}</td></tr>`;
        }

        if (errorValExistItem1 != null && errorValExistItem1 != "") {
            output += `<tr><td id="error_${4}">${errorStrExistItem1}</td></tr>`;
            output += `<tr><td id="error_${5}">${(errorValExistItem1.slice(0, -1))}</td></tr>`;
        }

        if (errorValExistItem2 != null && errorValExistItem2 != "") {
            output += `<tr><td id="error_${6}">${errorStrExistItem2}</td></tr>`;
            output += `<tr><td id="error_${7}">${(errorValExistItem2.slice(0, -1))}</td></tr>`;
        }

        $(`#tempPreviousStageLines`).html(output);
        modal_show("errorPreviousStageLinesResult");
    }


}

async function insert_PreviousStageLinessAsync(data) {



    var url = `${viewData_baseUrl_PU}/${viewData_controllername}/insertpreviousstagelines`;

    let response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });

    return response;
}

//async function loadingAsync(loading, elementId) {

//    if (loading)
//        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
//    else
//        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
//}

$("#insertPreviousStageLine").click(function () {
    let listType = requestId == 0 ? 2 : 1,
        stageStep = getParentRequestStageStep(requestId, currentWorkflowCategoryId);
    if (listType == 1)
        if (!stageStep.isLastConfirmHeader) {
            alertify.warning(" درخواست در حالت منتشر نشده می باشد مجاز به ثبت نمی باشید").delay(alertify_delay);
            return;
        }

    loadingAsync(true, $(this).prop("id"));
    run_button_insert_PreviousStageLines();
})

window.Parsley._validatorRegistry.validators.purchaselinedateissame = undefined;
window.Parsley.addValidator("purchaselinedateissame", {
    validateString: function (value) {
        var orderDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var reqDate = moment.from(shamsiOrderDate, 'fa', 'YYYY/MM/DD');
        if (orderDate.isValid()) {
            orderDate = orderDate.format('YYYY/MM/DD');
            reqDate = reqDate.format('YYYY/MM/DD');
            var dateIsValid = moment(reqDate).isSameOrBefore(orderDate, 'day');
            return dateIsValid;
        }
        return false;
    },
    messages: {
        en: 'تاریخ برگه باید بزرگتر، مساوی تاریخ درخواست باشد'
    }
});

function getItemAttributeWhitCategoryId(itemCategoryId) {

    if (itemCategoryId > 0) {
        url = `api/WH/ItemCategoryApi/getitemcategoryattribute/${itemCategoryId}`;
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {
                if (!result) {
                    $("#attributeIds").attr("disabled", true);
                    $("#attributeIds").attr("required", false);
                }
                else {

                    fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "attributeIds", true, itemCategoryId);
                    $("#attributeIds").attr("disabled", false);
                    $("#attributeIds").attr("required", true);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function getCategoryItemName(id) {

    $('#attributeIds').empty();
    $('#subUnitId').empty();
    $("#categoryItemId").html("");
    let url = `api/WH/ItemApi/getinfo/${id}`;

    let itemId = +id;
    if (id > 0) {
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {

                if (result && itemId > 0) {
                    $("#categoryItemId").val(result.categoryIdName);
                    $("#categoryItemId").prop("disabled", true);

                    let itemCategoryId = result.categoryId
                    unitId = result.unitId
                    additionalData[9].value = +unitId;
                    additionalData[3].value = result.categoryId;

                    if (unitId > 0 && unitId != null) {
                        fill_select2(`/api/WH/ItemUnitApi/unititem_getdropdown`, "subUnitId", true, `${unitId}/${itemId}`);
                        $("#subUnitId").val(result.unitId).trigger("change");
                        $("#subUnitId").attr("disabled", false);
                        $("#subUnitId").attr("required", true);
                    }
                    else {
                        $("#subUnitId").empty();
                        $("#subUnitId").attr("disabled", true);
                        $("#subUnitId").attr("required", false);
                        totalQuantity = +$('#quantity').val();
                        $('#totalQuantity').val(totalQuantity.toFixed(3));
                    }

                    getItemAttributeWhitCategoryId(itemCategoryId);


                }
                else {
                    $('#categoryItemId').val("");
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}



