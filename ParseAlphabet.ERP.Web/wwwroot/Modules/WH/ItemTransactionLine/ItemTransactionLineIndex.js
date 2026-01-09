
var viewData_form_title = "سطر های اسناد انبار",
    viewData_controllername = "ItemTransactionLineApi",
    viewData_getHeader_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getheader`,
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/display`,
    viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyids`,
    viewData_getpagetableLine_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getitemTransactionlinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insertItemTransactionLine`,
    viewData_previousStageLines_insert_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insertpreviousstagelines`,
    viewData_updrecord_header_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/update`,
    viewData_filter_url = `${viewData_baseUrl_WH}/ItemTransactionApi/getfilteritems`,
    viewData_requestItemTypes_url = `${viewData_baseUrl_WH}/ItemTransactionApi/requestitemtypegetdropdown`,
    viewData_requestItemTransactionLines_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getitemTransactionrequest`,
    headerModel = { accountDetailId: 0 },
    price = 0,
    currentWorkflowCategoryId = 11,
    workflowCategoryId = 0,
    headerLine_formkeyvalue = [],
    itemTransactionLine_formkeyvalue = [],
    additionalData = [],
    arr_headerLinePagetables = [],
    lastpagetable_formkeyvalue = [],
    lastFundType = 0,
    requestId = 0,
    stageId = 0,
    branchId = 0,
    workflowId = 0,
    branchId = 0,
    id = 0,
    warehouseId = 0,
    hasPriviousMode = false,
    header_pgnation = 0,
    requestIdChangeCount = 0,
    requestLinesData = [],
    updatedRequestId = 0, hasRefreshColumn = true,
    shamsiTransactionDate = "",
    itemTransactionLineCount = 0,
    conditionalProperties = {
        isRequest: false,
        isAfterChange: false,
        isPreviousStage: false,
        isCartable: false,
        isDataEntry: false
    },
    activePageId = "itemTransactionLinePage",
    selectedLineDetailId = 0,
    per1 = 0;

var itemtypeIdVal = 0, itemIdVal = 0, zoneId = 0;
headerLine_formkeyvalue.push($(`#${activePageId} #id`).val());
headerLine_formkeyvalue.push(+$(`#${activePageId} #isDefaultCurrency`).val());
$("#itemId").parents(".form-group").removeClass("displaynone");


$(`#${activePageId} #previousStagePageTable .relational-caption`).text("نوع آیتم");
$(`#${activePageId} #previousStagePageTable .relationalbox`).removeClass("displaynone");


//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonTransactionLineList",
    editable: true,
    selectable: false,
    pagerowscount: 15,
    currentpage: 1,
    isSum: true,
    pageno: 0,
    endData: false,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: null,
    headerType: "outline",
    getpagetable_url: viewData_getpagetableLine_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_WH}/${viewData_controllername}/updateItemTransactionLine`,
    getsum_url: `${viewData_baseUrl_WH}/WarehouseTransactionLineApi/getLineSum`,
    delRecord_Url: `${viewData_baseUrl_WH}/${viewData_controllername}/deleteItemTransactionLine`,
    pagetable_laststate: ""
},

    previousStagePage = {
        pagetable_id: "previousStagePageTable",
        endData: false,
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: viewData_requestItemTransactionLines_url,

        editable: true,
        pageNo: 0,
        pagetablefilter: false,
        lastPageloaded: 0
    };

arr_pagetables.push(previousStagePage);
arr_headerLinePagetables.push(pagelist1);

function call_initFormItemTransactionLine(header_Pagination = 0, elemId = undefined) {
    //$("#previousStagePageTable #countRowButton").remove()
    //$("#previousStagePageTable #lastRow").nextAll().remove()
    isFormLoaded = true;
    header_pgnation = header_Pagination;
    if (headerLine_formkeyvalue.length == 2)
        headerLine_formkeyvalue.push(header_Pagination);
    else
        headerLine_formkeyvalue[2] = header_pgnation;


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

function appendNavPageButton(pgId, hasHeaderNav) {
    if ($(`#${pgId} #header-div .button-items #headerFirst`).length == 0 && hasHeaderNav) {
        $(`#${pgId} #header-div .button-items`).append(`<button title="اولین" id="headerFirst" onclick="display_pagination('first')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-next"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="قبلی"  id="headerPrevious" onclick="display_pagination('previous')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<input id="headerIndex" onkeydown="headerindexChoose(event)" type="text" autocomplete="off" class="form-control number col-1 d-inline mr-2 ml-1" maxlength="10" placeholder="شناسه برگه"/>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="بعدی"  id="headerNext" onclick="display_pagination('next')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play fa-rotate-180"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="آخرین" id="headerLast" onclick="display_pagination('last')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-previous"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="چاپ تعدادی" id="headerLast" onclick="printFromPlateHeaderLine(true)" type="button" class="btn btn-print waves-effect"><i class="fa fa-print"></i>چاپ تعدادی</button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="چاپ ریالی" id="headerLast" onclick="printFromPlateHeaderLine(false)" type="button" class="btn btn-print waves-effect"><i class="fa fa-print"></i>چاپ ریالی</button>`);

    }
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
        fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, `${stageId}/11`);

        $(`#${activePageId} #itemTypeId`).val($("#itemTypeId option:first").val()).trigger("change");


        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #itemTypeId`).val());
        else
            headerLine_formkeyvalue[3] = +$(`#${activePageId} #itemTypeId`).val();

        $("#headerLineInsUp").removeClass("d-none");

        headerLine_formkeyvalue[4] = stageId;
        headerLine_formkeyvalue[5] = workflowId;
        headerLine_formkeyvalue[6] = 0;//  به طور پیش فرض تعدادی
    }



}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="itemTransactionExcel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="itemTransactionlist()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '>
                                                            <select style='width: 72%; float: right' class='form-control' id='actionItemTransactionForm'></select>
                                                            <button onclick='update_action()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa waves-effect' value=''>                       
                                                                <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                                <span style="margin-right:5px">ثبت گام</span>
                                                            </button>
                                                        </div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    stageId = +$(`#${activePageId} #stageId`).val();
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    requestId = +$(`#${activePageId} #formPlateHeaderTBody`).data("requestid");
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));
    workflowId = +$(`#${activePageId} #workFlowId`).val();

    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");

    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    conditionalProperties.stageClassId = +$(`#${activePageId} #formPlateHeaderTBody`).data("stageclassid");


    conditionalProperties.isRequest = +$(`#${activePageId} #formPlateHeaderTBody`).data("isrequest");
    conditionalProperties.parentworkflowcategoryid = +$(`#${activePageId} #formPlateHeaderTBody`).data("parentworkflowcategoryid");
    conditionalProperties.isEqualToParentRequest = $(`#${activePageId} #formPlateHeaderTBody`).data("isequaltoparentrequest");

    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;

    warehouseId = +$(`#${activePageId} #formPlateHeaderTBody`).data("warehouseid");
    actionId = +$(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
    headerModel.noSeriesId = +$(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid");
    var accountDetailName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetail");
    var accountDetailId = 0;
    if (accountDetailName != undefined && accountDetailName != "" && accountDetailName != null)
        accountDetailId = +accountDetailName.split("-")[0];
    headerModel.accountDetailId = accountDetailId

    headerModel.inOut = $(`#${activePageId} #formPlateHeaderTBody`).data("inout");
    headerModel.transactionDate = $(`#${activePageId} #formPlateHeaderTBody`).data("transactiondate");
    additionalData = [
        { name: "headerId", value: id },
        { name: "stageId", value: stageId },
        { name: "branchId", value: branchId },
        { name: "categoryId", value: 0 },
        { name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() },
        { name: "unitId", value: 0 },
        { name: "ratio", value: 1 },
        { name: "idSubUnit", value: 0 },
        { name: "inOut", value: 0 },
        { name: "noSeriesId", value: 0 },
        { name: "price", value: 1 },
        { name: "amount", value: 0 },
        { name: "quntity", value: 0 },
        { name: "currencyId", value: defaultCurrency },
        { name: "warehouseId", value: warehouseId },
        { name: "zoneId", value: 0 },
        { name: "binId", value: 0 },
        { name: "workflowCategoryId", value: workflowCategoryId },
        { name: "workflowId", value: workflowId },
        { name: "accountDetailId", value: accountDetailId },
        { name: "headerinOut", value: headerModel.inOut },
        { name: "headerDocumentDate", value: headerModel.transactionDate },
        { name: "stageClassId", value: conditionalProperties.stageClassId }
    ];


    $("#note").suggestBox({
        api: `/api/WH/WarehouseDescriptionApi/search`,
        paramterName: "name",
        suggestFilter: {
            items: [],
            filter: ""
        },
        form_KeyValue: [stageId]
    });

}

async function callBackLineFill() {

    $(`#${activePageId} #currencyId option[value='0']`).remove();
    var row1 = $("#itemTransactionLinePage #row1");
    if ($("#itemTransactionLinePage #row1").length > 0) {
        trOnclick("jsonTransactionLineList", row1, null);
    }
    else {
        configAfterChange();
        refreshRequestLinesBtn();
    }

    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "branchId", value: +$("#formPlateHeaderTBody").data("branchid") });
    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() });

    firstLineLoaded = true;

    $(`#${activePageId} #actionItemTransactionForm`).empty();
    let stageClassIds = "3,4,8,11,14,15,16";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionItemTransactionForm", true, `${stageId}/${workflowId}/1/0/${branchId}/${workflowCategoryIds.warehouse.id}/true/${stageClassIds}`);
    $(`#${activePageId} #actionItemTransactionForm`).val(actionId).trigger("change");

    $("#filter_itemType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_WH}/Item_WarehouseApi/getdropdown/${+warehouseId}/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);


        $("#filter_zone").data("api", `${viewData_baseUrl_WH}/ZoneApi/getalldatadropdown`);


        $("#filter_bin").data("api", `${viewData_baseUrl_WH}/WBinApi/getdropdown`);


    }




}

function configAfterChange() {
    setTimeout(function () {
        if (!conditionalProperties.isAfterChange) {
            configItemTransactionElementPrivilage(".ins-out", isAfterSave);
            isAfterSave = false;
        }
        else {
            $("#itemTypeName").select2("focus");
            conditionalProperties.isAfterChange = false;
        }
    }, 100)
}

function trOnclick(pg_name, elm, evt) {

    configAfterChange();
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);


    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow) {
        return;
    }

    if (trediting) {
        if (elm.hasClass("funkyradio"))
            elm.prop("checked", !elm.prop("checked"));

        return;
    }
    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
    tr_HighlightHeaderLine(pg_name);

    //var id = $(elm).data("id");
    //fillItemTransactionlineFooter(id);

}

function run_header_line_row_After_delete() {
    get_header();
    //if (conditionalProperties.parentworkflowcategoryid == 11)
    //    fillItemTransactionlineFooter(rowId);
}

function fillItemTransactionlineFooter(rowIdSelect) {

    getItemTransactionlineFooter(rowIdSelect).then(function (result) {
        $("#fillItemTransactionlineFooterTbody").html("")
        $("#header-lines-footer").css("marginTop", "15px");
        $("#header-lines-footer").html("")
        let strTbodyTh = "";
        if (result.data != null) {
            strTbodyTh = `
                <table style="margin-top:10px" id="itemTransactionlineFooter">
                    <thead >
                        <tr>`

            strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;text-align:center;width:35%">کل</th>`
            strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;text-align:center;width:35%">معین</th>`
            strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;text-align:center;width:35%">تفضیل</th>`

            strTbodyTh += ` </tr>
                           </thead>
                                 <tbody> <tr>`;

            strTbodyTh += result.data.accountGLIdName == null ? `<td style="background-color: #ffe4e4; text-align:center;"> _ </td>` : `<td>${result.data.accountGLIdName}</td>`
            strTbodyTh += result.data.accountSGIdLame == null ? `<td style="background-color: #ffe4e4; text-align:center;"> _ </td>` : `<td>${result.data.accountSGIdLame}</td>`
            strTbodyTh += result.data.accountDetailIdName == null ? `<td style="background-color: #ffe4e4; text-align:center;"> _ </td>` : `<td>${result.data.accountDetailIdName}</td>`


            strTbodyTh += `
                       </tr>
                    </tbody>
                </table>
                `
            $("#header-lines-footer").append(strTbodyTh);
            $("#fillItemTransactionlineFooterTbody").append(strTbodyTr)
        }
    });
}

async function getItemTransactionlineFooter(id) {

    var p_url = `/api/WH/ItemTransactionLineApi/postgroupfooter`;

    var response = await $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });

    return response;
}

function itemTransactionExcel() {
    let id = $('#formPlateHeaderTBody').data().id;
    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/csvline`;
    let csvModel = {
        FieldItem: "",
        FieldValue: "",
        FieldItem: $(`#jsonTransactionLineList .btnfilter`).attr("data-id"),
        FieldValue: $(`#jsonTransactionLineList .filtervalue`).val(),
        Form_KeyValue: headerLine_formkeyvalue,
        pageno: null,
        pagerowscount: null
    }
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

function headerLineActive(pageId) {
    var stageAction = getStageActionConfig(id);
    if (stageAction.isDataEntry) {
        $(".ins-out").removeData();
        $("#headerLineInsUp").attr("onclick", `headerLineIns('jsonTransactionLineList')`);
        configItemTransactionElementPrivilage(`.ins-out`, true, true);
        $("#zoneId").prop("disabled", true);
        $("#binId").prop("disabled", true);
        $("#inOut").prop("disabled", true);

    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

function click_link_header(elm) {

    if ($(elm).data().id == "requestNo")
        switch (conditionalProperties.parentworkflowcategoryid) {
            case 11:
                navigation_item_click(`/WH/ItemRequestLine/${+$(elm).text()}/${+$(`#itemTransactionLinePage #isDefaultCurrency`).val()}`);
                break;
            case 1:
                navigation_item_click(`/PU/PurchaseOrderLine/${+$(elm).text()}/${+$(`#itemTransactionLinePage #isDefaultCurrency`).val()}`);
                break;
        }

    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#itemTransactionLinePage #isDefaultCurrency`).val()}`);
}
/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configItemTransactionElementPrivilage(containerId, privilageType = null, checkrequestAndIsDataInteryForHeaderLineActive = false) {


    // فعالسازی : haederLineActive
    // افزودن از درخواست: add_requestLines
    // افزودن : headerLineInsUp
    // ویرایش لاین: btn_editPerson
    // حذف لاین: btn_delete

    $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)


    if (!privilageType) {
        $("#itemTypeId").prop("selectedIndex", 0).trigger("change");
        $("#subUnitId").prop("selectedIndex", 0).trigger("change");
    }


    if (checkrequestAndIsDataInteryForHeaderLineActive == true) {

        if (conditionalProperties.isRequest == 0 && conditionalProperties.isDataEntry == true) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true)
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
            $(`#${activePageId} .pagetablebody button`).prop("disabled", false)

        } else if (conditionalProperties.isRequest == 1 && $("#formPlateHeaderTBody").data("isdataentry") == 2) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", false)
            $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true)
            $("#jsonTransactionLineList .pagetablebody tbody tr  td button:first-child").prop("disabled", true)
            $("#jsonTransactionLineList .pagetablebody tbody tr  td button:last-child").prop("disabled", false)

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
        else if (conditionalProperties.isRequest == 1 && $("#formPlateHeaderTBody").data("isdataentry") == 2) {
            $(`#${activePageId} #addRequestLines`).prop("disabled", false);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            $("#jsonTransactionLineList .pagetablebody tbody tr  td button:first-child").prop("disabled", true)
            $("#jsonTransactionLineList .pagetablebody tbody tr  td button:last-child").prop("disabled", false)
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

            if (conditionalProperties.isDataEntry) {
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
                configItemTransactionElementPrivilage(".ins-out", false);

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
                        selector.prop("disabled", ($("#formPlateHeaderTBody").data("isdataentry") == 0 || $("#formPlateHeaderTBody").data("isdataentry") == 1) ? true : privilageType);

                }
                else {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.val(``);
                }
            }
        }
    }

    $("#categoryItemId").prop("disabled", true);
}
configLineElementPrivilage = configItemTransactionElementPrivilage;


$(document).on("keydown", `#${activePageId} #formHeaderLine`, function (e) {
    if (e.keyCode == KeyCode.Esc) {
        if (+$("#itemTypeId").val() != $("#itemTypeId").prop("selectedIndex", 0).val())
            $("#itemTypeId").val($("#itemTypeId").prop("selectedIndex", 0).val()).trigger("change");

        configItemTransactionElementPrivilage(".ins-out", false)

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine(true);
    }

});

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configItemTransactionElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configItemTransactionElementPrivilage(".ins-out", false);
    }
});

call_initFormItemTransactionLine();

call_initform = call_initFormItemTransactionLine;

function itemTransactionlist() {
    if (!conditionalProperties.isCartable)
        navigation_item_click('/WH/ItemTransaction', 'تراکنش های انبار');
    else
        navigation_item_click('/WH/ItemTransactionCartable', 'کارتابل تراکنش انبار');
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistItemTransactionId(+elm.val());
        if (checkExist)
            navigation_item_click(`/WH/ItemTransactionLine/${+elm.val()}/${+$(`#itemTransactionLinePage #isDefaultCurrency`).val()}/0`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistItemTransactionId(id) {

    let viewData_getCheckExist = `${viewData_baseUrl_WH}/ItemTransactionApi/checkexist`;
    let model = {
        id: id,
        bySystem: 0
    }
    let outPut = $.ajax({
        url: viewData_getCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getCheckExist);
        }
    });
    return outPut.responseJSON;
}

$("#headeUpdateModal").on("shown.bs.modal", function () {
    if (conditionalProperties.isRequest) {
        $("#requestId").select2("focus");
    }

})

function chekExistItemTransactionline(id) {

    var result = $.ajax({
        url: `${viewData_baseUrl_WH}/ItemRequestLineApi/getItemTransactionCount`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_WH}/ItemRequestLineApi/getItemTransactionCount`);
            return 0;
        }
    });

    return result.responseJSON;
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

    selectText(elem);
}

function tr_object_onkeydown(e, elem) {

}

function run_header_line_row_editItemTransaction(pageId, rowNo, ev) {

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
        url: `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyids`,
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
                $("#attributeIds").val(data.attributeIds).trigger("change.select2");
                $("#subUnitId").val(data.subUnitId).trigger("change.select2");
                $("#totalQuantity").val(data.totalQuantity);
                $("#categoryItemId").val(data.categoryItemName);
                $("#quantity").val(data.quantity.toFixed(3));
                $("#price").val(transformNumbers.toComma(data.price.toFixed(3)));
                $("#amount").val(transformNumbers.toComma(data.amount.toFixed(3)));
                $("#zoneId").val(data.zoneId).trigger("change.select2");
                $("#binId").val(data.binId).trigger("change.select2");
                $("#inOut").val(data.inOut).trigger("change.select2");
                $("#itemId").select2("focus");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function getFundItemTypeInOut(itemTypeId) {

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

                if (result == 3) {
                    if (!$("#itemTypeId").data("disabledinout"))
                        $("#inOut").prop("disabled", false);
                    else
                        $("#inOut").prop("disabled", true);

                    $("#inOut").data("disabled", false);
                    $("#inOut").data("notreset", false);
                }
                else if (result == 1 || result == 2) {
                    if (+$("#inOut").val() != result) {
                        $("#inOut").val(result).trigger("change");
                        $("#inOut").prop("disabled", true);
                        $("#inOut").prop("notreset", true);
                    }
                    $("#inOut").data("disabled", true);
                }
                else {
                    $("#inOut").prop("disabled");
                    $("#inOut").val("0").trigger("change");
                }
            }
        })
    }
}

function getZoneDropDown() {
    $("#zoneId").prop("disabled", false);
    let itemtypeId = +$("#itemTypeId").val();
    let itemId = +$("#itemId").val();
    fill_select2(`/api/WH/ZoneApi/getdropdownbyitem`, "zoneId", true, `${warehouseId}/${itemtypeId}/${itemId}`);
    $(`#${activePageId} #zoneId`).val($("#zoneId option:first").val()).trigger("change");
}

function fill_items(itemTypeId) {
    $("#itemId").html("");
    var dropDownUrl = "";
    var param = '';
    dropDownUrl = `${viewData_baseUrl_WH}/Item_WarehouseApi/getdropdown`;
    param = `${warehouseId}/${itemTypeId}`;

    fill_select2(dropDownUrl, "itemId", true, param, false, 3, "انتخاب"
        , function () {
            $("#itemId").val($("#itemId").data("val")).trigger("change");
            $("#itemId").data("val", "");
        }
    );

    $("#itemId").val($("#itemId").prop("disabled", false).data("val"));
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

function getItemAttributeAndUnitWhitCategoryId(id, itemTypeId) {

    $('#attributeIds').empty();
    $('#subUnitId').empty();
    let itemId = id;
    if (id > 0) {
        $.ajax({
            url: `api/WH/ItemApi/getinfo/${id}`,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {

                if (result && itemId > 0) {
                    $('#categoryItemId').val(result.categoryIdName);
                    $("#categoryItemId").prop("disabled", true);
                    let itemCategoryId = result.categoryId
                    unitId = result.unitId
                    additionalData[5].value = +unitId;

                    if (+itemTypeId == 1) {
                        fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "attributeIds", true, itemCategoryId);
                        fill_select2(`/api/WH/ItemUnitApi/unititem_getdropdown`, "subUnitId", true, `${unitId}/${itemId}`);
                        $("#subUnitId").val(result.unitId).trigger("change");

                        ($('#attributeIds')[0].length == 0) ? $("#attributeIds").attr("disabled", true) : $("#attributeIds").removeAttr("disabled");
                        ($('#attributeIds')[0].length > 0) ? $("#attributeIds").attr("required", true) : $("#attributeIds").removeAttr("required");

                        ($('#subUnitId')[0].length == 0) ? $("#subUnitId").attr("disabled", true) : $("#subUnitId").removeAttr("disabled");
                        ($('#subUnitId')[0].length > 0) ? $("#subUnitId").attr("required", true) : $("#subUnitId").removeAttr("required");
                    }
                }

            }
        });
    }
}

function cal_getRatioItemTransaction() {

    let subUnitId = +$('#subUnitId').val();
    let newQuantity = +$("#quantity").val().replace("_", "000")
    let totalQuantity = newQuantity.toFixed(3)
    $("#quantity").val(totalQuantity)
    $('#totalQuantity').val(totalQuantity);
    if (additionalData.length > 0) {
        additionalData[6].value = 1;
        additionalData[7].value = 0;
    }

    if (subUnitId > 0) {

        if (checkResponse(subUnitId) != NaN && subUnitId != unitId && subUnitId != null) {

            $.ajax({
                url: `api/WH/ItemUnitApi/getratio/${subUnitId}`,
                type: "get",
                contentType: "application/json",
                success: function (result) {
                    if (checkResponse(result)) {

                        ratio = +result.ratio < 0 ? 1 : +result.ratio;

                        totalQuantity = +$('#quantity').val().replace("_", "000") * ratio;
                        $('#totalQuantity').val(totalQuantity.toFixed(3));
                        if (additionalData.length > 0) {
                            additionalData[6].value = ratio;
                            additionalData[7].value = +result.idSubUnit;
                        }


                        calcAmount();
                    }
                }
            });
        }
        else calcAmount();
    }
    else
        calcAmount();
}

function calcAmount() {

    if (+removeSep($("#price").val()) > 0) {
        price = +removeSep($("#price").val());
        var quantity = $("#totalQuantity").length > 0 ? +removeSep($("#totalQuantity").val()) : 0;
        var amount = quantity * price;
        $("#amount").val(transformNumbers.toComma(amount.toFixed(3)));
    }
}

function calcAmountDetail(rowno) {

    price = +removeSep($("#price_" + rowno + "").val());
    let ratio = +$(`#previousStagePageTable .pagetablebody tr#row${rowno}`).data("ratio");

    let quantity = +removeSep($("#quantity_" + rowno + "").val().replace(/\//g, ".").replace(/_/g, ""));
    quantity = Math.abs(quantity);

    let totalQuantity = (quantity * ratio).toFixed(3);

    $("#quantity_" + rowno + "").val(quantity.toFixed(3));
    $("#totalQuantity_" + rowno + "").val(totalQuantity.toString());


    var amount = (totalQuantity * price).toFixed(3);
    $("#amount_" + rowno + "").val(transformNumbers.toComma(amount));

    if (conditionalProperties.parentworkflowcategoryid === 11)
        $(`#col_${rowno}_12`).text(totalQuantity.toString())
    else
        $(`#col_${rowno}_11`).text(totalQuantity.toString())

    additionalData[10].value = price;
    additionalData[11].value = (amount > 0 ? amount : 0);
    additionalData[12].value = totalQuantity;
}

async function local_tr_object_onchange(elem, pageId) {

    var elemValue = $(elem).val();
    switch ($(elem).attr("id")) {
        case "itemTypeId":
            if (elemValue > 0) {
                fill_items(+elemValue);
            }
            break;
        case "itemId":
            if (elemValue > 0) {
                clearColumns();
                getFundItemTypeInOut(+$("#itemTypeId").val());
                getZoneDropDown(+$("#itemTypeId").val(), +elemValue);
                getCategoryIdByitemId(+elemValue);
                getItemAttributeAndUnitWhitCategoryId(+elemValue, +$("#itemTypeId").val());
                getItemTransactionFundItemTypeInOut(+$("#itemTypeId").val());
            }
            break;

        case "subUnitId":
        case "quantity":
        case "price":
            cal_getRatioItemTransaction();
            break;

        case "zoneId":
            if (elemValue > 0) {
                getBinDropDown(elemValue);
                break;
            }

    }
}

function tr_object_onchange(pageId, elem, rowno, colno) {

    if (pageId != "previousStagePageTable")
        return;

    var elem = $(elem);
    var elemValue = $(elem).val();
    var elemId = $(elem).attr("id");
    if (checkResponse(elemId)) {

        switch (elemId.split('_')[0]) {

            case "zoneId":

                additionalData[15].value = +elemValue;
                $(`#${pageId} .pagetablebody > tbody > tr#row` + rowno + ` > #col_` + rowno + `_8 > div:eq(1)`).removeClass("displaynone");
                fill_select2(`/api/WH/WBinApi/getdropdownbyitem`, "binId_" + rowno + "", true, `${+warehouseId}/${+itemtypeIdVal}/${+itemIdVal}/${+elemValue}`);

                break;
            case "binId":
                additionalData[16].value = +elemValue;
                $(`#${pageId} .pagetablebody > tbody > tr#row` + rowno + ` > #col_` + rowno + `_11 >`).attr("disabled", false);

                break;


        }
    }
}

function tr_object_onblur(pageId = '', elem, rowno = 0, colno = 0) {

    if (pageId != 'previousStagePageTable')
        return;

    var elem = $(elem);
    var elemValue = $(elem).val();
    var elemId = $(elem).attr("id");
    if (checkResponse(elemId)) {

        switch (elemId.split('_')[0]) {
            case "price":

                getCategoryIdByitemId(+itemIdVal);
                calcAmountDetail(rowno);

                break;


            case "quantity":

                getCategoryIdByitemId(+itemIdVal);
                calcAmountDetail(rowno);

                if (additionalData[15].value > 0 && additionalData[16].value == 0)
                    fill_select2(`/api/WH/ZoneApi/getdropdownbyitem`, "zoneId_" + rowno + "", true, `${warehouseId}/${+itemtypeIdVal}/${+itemIdVal}`);

                break;
        }
    }
}

function getItemTransactionFundItemTypeInOut(itemTypeId) {
    var model = {
        fundItemTypeId: +itemTypeId,
        stageId: stageId
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
                    additionalData[8].value = result;
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function afterInsertLineHeaderLine() {
    configItemTransactionElementPrivilage(`.ins-out`, false);

    $("#filter_itemType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_WH}/Item_WarehouseApi/getdropdown/${+warehouseId}/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);


        $("#filter_zone").data("api", `${viewData_baseUrl_WH}/ZoneApi/getalldatadropdown`);


        $("#filter_bin").data("api", `${viewData_baseUrl_WH}/WBinApi/getdropdown`);


    }
}

$("#headeUpdateModal").on("hidden.bs.modal", () => isLoadEdit = false);

function configPageTableByItemType(value) {

    if (headerLine_formkeyvalue[3] !== +$(`#${activePageId} #itemTypeId`).val()) {
        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #itemTypeId`).val());
        else headerLine_formkeyvalue[3] = +$(`#${activePageId} #itemTypeId`).val();

        conditionalProperties.isAfterChange = true;
        lastFundType = arr_headerLinePagetables[3];
        InitFormLine();
    }
}

function navigateToModalJournal(href) {

    initialPage();
    $("#contentdisplayJournalLine #content-page").addClass("displaynone");
    $("#contentdisplayJournalLine #loader").removeClass("displaynone");
    lastpagetable_formkeyvalue = pagetable_formkeyvalue;
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayJournalLine`).html(result);
            modal_show("displayJournalLineModel");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayJournalLine #loader").addClass("displaynone");
    $("#contentdisplayJournalLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayJournalLine #form,#contentdisplayJournalLine .content").css("margin", 0);
    $("#contentdisplayJournalLine .itemLink").css("pointer-events", " none");
}

function after_navigationModalClose() {
    headerLine_formkeyvalue = itemTransactionLine_formkeyvalue;
    call_initform = call_initFormItemTransactionLine;
    callbackLineFillFunc = callBackLineFill;
    callBackHeaderFillFunc = callBackHeaderFill;
}

async function public_object_onchange(elem) {

    if (typeof elem === "undefined") return;
    var elemId = $(elem).attr("id");
    switch (elemId) {
        case "requestId":
            requestId_change(+$(elem).val())
            break;
    }

}

function requestId_change(requestId) {

    shamsiTransactionDate = "";
    if (requestId > 0) {
        $("#noSeriesId").empty();
        $("#accountDetailId").empty();
        let workflowCategoryName = document.getElementById("requestId");
        let len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;
        workflowCategoryId = (len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0]);
        fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+$("#accountGLId").data("value")}/${+$("#accountSGLId").data("value")}`, false, 0, "انتخاب گروه تفضیل");
        let url = "";
        if (+workflowCategoryId == 1) {
            url = `${viewData_baseUrl_PU}/PurchaseOrderApi/getrecordbyid`;
        }
        else if (+workflowCategoryId == 11) {
            url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getrecordbyid`;
        }

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(requestId),
            async: false,
            cache: false,
            success: function (response) {
                shamsiTransactionDate = response.data.transactionDatePersian;
                $("#note").val(response.data.note);

                if (response.data.accountDetailId > 0) {
                    var noSeriesOption = new Option(`${response.data.noSeriesId} - ${response.data.noSeriesName}`, response.data.noSeriesId, true, true);
                    $("#noSeriesId").append(noSeriesOption).trigger('change');
                    $("#noSeriesId").prop("disabled", itemTransactionLineCount > 0 ? true : false);
                    if (+$("#noSeriesId").val() > 0) {
                        getModuleListByNoSeriesIdUrl(response.data.noSeriesId, "accountDetailId");
                        $("#accountDetailId").val(response.data.accountDetailId).trigger("change.select2");

                    }

                }
                else {
                    $("#accountDetailId").html(`<option value="0">0 - انتخاب کنید</option>`).val(0).trigger("change");
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }

}

async function resetFormWhenEnabled() {
}

function clearColumns() {

    $("#amount").val(0);
    $("#itemTransactionLinePage .ins-row").attr("data-hidden-discpercent", 0);
    $("#quantity").val("1");
}

function getBinDropDown(zoneId) {

    $("#binId").prop("disabled", false);
    let itemtypeId = +$("#itemTypeId").val();
    let itemId = +$("#itemId").val();
    fill_select2(`/api/WH/WBinApi/getdropdownbyitem`, "binId", true, `${+warehouseId}/${+itemtypeId}/${+itemId}/${+zoneId}`);
    $(`#${activePageId} #binId`).val($("#binId option:first").val()).trigger("change");
}

async function printFromPlateHeaderLine(stageQuantity) {

    let transactionId = +$("#formPlateHeaderTBody").data("id")
    let reportTitle = stageQuantity ? `چاپ تعدادی` : `چاپ ریالی`;
    let branch = $("#formPlateHeaderTBody").data("branch")
    let documentTypeName = $("#formPlateHeaderTBody").data("documenttype") == undefined ? "" : $("#formPlateHeaderTBody").data("documenttype")
    let journalId = $("#formPlateHeaderTBody").data("journalid")
    let documentDatePersian = $("#formPlateHeaderTBody").data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle, documentDatePersian);
}

function callBackAfterEdit() {
    getFundItemTypeInOut($("#itemTypeId").val());

    var itemId = +$("#itemId").val();
    fill_items($("#itemTypeId").val());
    $("#itemId").val(itemId).trigger("change");


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
    var model = {
        itemTypeId: +row.data("itemtypeid"),
        stageId: +$("#stageId").val()
    }
    if (model.itemTypeId > 0 && model.stageId > 0) {
        $.ajax({
            url: "api/WF/StageFundItemTypeApi/getstagefunditemtypeinout",
            type: "post",
            dataType: "json",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result == 3) {
                    $(inOutElem).removeAttr("readonly");
                    if (!$("#itemTypeId").data("disabledinout"))
                        $(inOutElem).removeProp("disabled");
                    else
                        $(inOutElem).prop("disabled", true);
                }
                else if (result == 1 || result == 2) {
                    $(inOutElem).attr("readonly", true);
                    $(inOutElem).prop("disabled", true);
                    $(inOutElem).attr("data-disabled", true);
                    $(inOutElem).val(result).trigger("change");
                }
                else {
                    $(inOutElem).attr("readonly", true);
                    $(inOutElem).prop("disabled", true);
                    $(inOutElem).attr("data-disabled", true);
                    $(inOutElem).val("0").trigger("change");
                }
            }
        })
    }
}

function trOnkeydown(ev, pg_name, elm) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space].indexOf(ev.which) == -1) return;

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_lastpage = arr_headerLinePagetables[index].lastpage;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    var pagetable_tr_editing = arr_headerLinePagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowUp);
            }
            else {
                pagetable_currentrow--;
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
                elm = $(`#row${pagetable_currentrow}`);
                after_change_trHeaderLine(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowUp);
            }
            else if (pagetable_currentpage !== 1)
                pagetablePrevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowDown);
            }
            else {
                pagetable_currentrow++;
                elm = $(`#row${pagetable_currentrow}`);
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

                after_change_trHeaderLine(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowDown);
            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                arr_headerLinePagetables[index].currentrow = 1;
                elm = $(`#row1`);
                pagetableNextpage(pagetable_id);
            }
        }
    }

    // var id = $(elm).data("model.id");
    // fillTreasuryLineFooter(id);
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

        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input:not([data-disabled]),select:not([data-disabled]),div.funkyradio:not([data-disabled])").attr("disabled", false);
    }
}

function tr_save_row(pagetable_id, keycode) {
    after_save_row(pagetable_id, "success", keycode, false);
}

function checkEditOrDeletePermission(opr = "Upd") {
    var itemTransactionAction = getStageActionConfig(id);

    if (opr == "Upd") {
        if (itemTransactionAction.isDataEntry == 1)
            return true;
        else
            return false;
    }
    else {
        if (itemTransactionAction.isDataEntry != 0)
            return true;
        else
            return false;
    }
}

function refreshRequestLinesBtn() {

    if (conditionalProperties.isRequest == 0 && conditionalProperties.isDataEntry == true) {
        $(`#${activePageId} #addRequestLines`).prop("disabled", true)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
    } else if (conditionalProperties.isRequest == 1 && conditionalProperties.isDataEntry == true) {
        $(`#${activePageId} #addRequestLines`).prop("disabled", false)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", false)
    } else {
        $(`#${activePageId} #addRequestLines`).prop("disabled", true)
        $(`#${activePageId} #headerLineInsUp`).prop("disabled", true)
    }
}

function add_requestLines() {


    viewData_requestItemTransactionLines_url = (conditionalProperties.parentworkflowcategoryid == 11 ?
        `${viewData_baseUrl_WH}/${viewData_controllername}/getitemTransactionrequest` :
        `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getpersoninvoicerequest`);
    previousStagePage.getpagetable_url = viewData_requestItemTransactionLines_url;

    //درخواست خرید باشد
    if (conditionalProperties.parentworkflowcategoryid == 1) {
        let listType = requestId == 0 ? 2 : 1;
        additionalData[17].value = 1;
        let stageStep = getParentRequestStageStep(requestId, conditionalProperties.parentworkflowcategoryid);
        if (stageStep == null) {
            alertify.warning(" درخواست وجود ندارد ").delay(alertify_delay);
            return;
        }
        conditionalProperties.isQuantityPurchase = stageStep.isQuantityPurchase;
        conditionalProperties.isQuantityWarehouse = stageStep.isQuantityWarehouse;
        if (listType == 1)
            if (!stageStep.isLastConfirmHeader) {
                alertify.warning(" درخواست در حالت منتشر نشده می باشد مجاز به ثبت نمی باشید").delay(alertify_delay);
                return;
            }

        conditionalProperties.isQuantityPurchase = (stageStep.isQuantityPurchase == 1 ? true : false);

        var paramItemTypeList = `${requestId}/11`;


        fill_select2(`${viewData_baseUrl_PU}/PurchaseInvoiceApi/requestitemtypegetdropdown`, "previousStagePageTable #form_keyvalue", true, paramItemTypeList, false, 3, 'انتخاب', undefined, "", true);


        if (+$("#previousStagePageTable #form_keyvalue option:first").val() != 0)
            $("#previousStagePageTable #form_keyvalue").val($("#previousStagePageTable #form_keyvalue option:first").val()).trigger("change");
        else {
            var msgItem = alertify.warning("مبانی نوع گردش برگه جاری و مرجع همخوانی ندارد، به مدیر سیستم اطلاع دهید");
            msgItem.delay(alertify_delay);
        }
    }
    //درخواست انبار باشد
    else if (conditionalProperties.parentworkflowcategoryid == 11) {

        var itemTransactionAction = getParentRequestStageStep(requestId, conditionalProperties.parentworkflowcategoryid);

        additionalData[17].value = 11;
        conditionalProperties.isQuantityPurchase = itemTransactionAction.isQuantityPurchase;
        conditionalProperties.isQuantityWarehouse = itemTransactionAction.isQuantityWarehouse;


        var param = "";
        if (!itemTransactionAction.isLastConfirmHeader) {
            alertify.warning(`درخواست ${requestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
            return;
        }


        param = `${+id}/${requestId}`;
        fill_select2(viewData_requestItemTypes_url, "previousStagePageTable #form_keyvalue", true, param, false, 3, 'انتخاب', undefined, "", true);

        if (+$("#previousStagePageTable #form_keyvalue option:first").val() != 0)
            $("#previousStagePageTable #form_keyvalue").val($("#previousStagePageTable #form_keyvalue option:first").val()).trigger("change");
        else {
            var msgItem = alertify.warning("مبانی نوع گردش برگه جاری و مرجع همخوانی ندارد، به مدیر سیستم اطلاع دهید");
            msgItem.delay(alertify_delay);
        }

    }

    configItemTransactionElementPrivilage(".ins-out", false);

}

$("#previousStageItemTransactionLines").on("shown.bs.modal", function () {
    $("#previousStageItemTransactionLines").css("overflow", "hidden");
    $("#itemTransactionLinePage").css("overflow", "hidden");
    $("#previousStagePageTable table tbody tr").first().focus();

})

$("#previousStagePageTable #form_keyvalue").change(function () {
    get_requestStageLines();
})

function get_requestStageLines() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    arr_pagetables[index].selectedItems = [];
    var itemTypeId = +$("#previousStagePageTable #form_keyvalue").val();
    var listType = requestId == 0 ? 2 : 1;



    arr_pagetables[index] = {
        pagetable_id: "previousStagePageTable",
        endData: false,
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: viewData_requestItemTransactionLines_url,
        // getfilter_url: `${viewData_baseUrl_WH}/${viewData_controllername}/getrequestfilteritems`,
        editable: true,
        pageNo: 0,
        pagetablefilter: false,
        lastPageloaded: 0
    };


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
    pagetable_formkeyvalue.push(warehouseId);
    pagetable_formkeyvalue.push(11);
    pagetable_formkeyvalue.push(headerModel.accountDetailId);


    $(`#previousStagePageTable .btnRemoveFilter`).addClass("d-none");
    $(`#previousStagePageTable .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritemNew('filter-non', 'مورد فیلتر', '0', '0', "previousStagePageTable");

}

function callbackAfterFilter(pgName) {
    modal_show(`previousStageItemTransactionLines`);
}

function validate_lineTable() {
    return 0;
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

function showErrorValidtionPreviousStageLines(errors) {

    if (errors !== null) {
        const errorsLn = errors.length;
        let output = "", errorValItem = "", errorValExistItem = "", cama = "", errorStrItem = "", errorStrExistItem = "";

        for (var i = 0; i < errorsLn; i++) {
            if (errors[i].split('-')[0] == "0") {
                output = `<tr><td id="error_${0}">${errors[i].split('-')[1]}</td></tr>`;
            }

            else if (errors[i].split('-')[0] == "1") {
                cama = ""
                cama = ","
                errorStrItem = "در مرحله و نوع آیتم انتخابی برای آیتم های زیر کدینگ حسابداری تعیین نشده است";
                errorValItem += `${errors[i + 1].split('-')[1]}${cama}`;
                i++;
            }
            else if (errors[i].split('-')[0] == "2") {
                cama = ","
                cama = "</br>,"
                errorStrExistItem = "کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
                errorValExistItem += `${errors[i + 1].split('-')[0] + '-' + errors[i + 1].split('-')[1]}${cama}`;
                i++;
            }
            else if (errors[i].split('-')[0] == "3") {
                output += `<tr><td id="error_${0}">${errors[i + 1]}</td></tr>`;
                i++;
            }
            else {
                output += `<tr><td id="error_${0}">${errors[i].split('-')[0]}</td></tr>`;
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

        $(`#tempPreviousStageLines`).html(output);
        modal_show("errorPreviousStageLinesResult");


    }


}

async function insert_PreviousStageLinessAsync(data) {

    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/insertpreviousstagelines`;

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

async function run_button_insert_PreviousStageLines(id = 0, rowNo = 0, elem = null) {

    var data = [];
    id = additionalData[0].value;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    var selectedItemsTransaction = [];
    selectedItemsTransaction = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;

    if (selectedItemsTransaction.length > 0) {
        if ($(`#previousStagePageTable .pagetablebody > tbody > tr .editrow`).length == 0) {

            if (validate_lineTable() == 0) {
                selectedItemsTransaction.forEach(function (value) {

                    var rowId = $(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).attr("id");
                    var rowNumber = +rowId.replace("row", "");

                    let zoneId = 0;
                    let binId = 0;

                    //if (conditionalProperties.parentworkflowcategoryid == 1) {
                    zoneId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"] #zoneId_${rowNumber}`).val();
                    binId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"] #binId_${rowNumber}`).val();
                    //}
                    //else {
                    //    zoneId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).data("zoneid");
                    //    binId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).data("binid");
                    //}

                    let categoryId = 0,
                        subUnitId = 0,
                        unitId = 0,
                        quantity = 0;

                    if (checkResponse(value.categoryid))
                        categoryId = +value.categoryid;
                    else
                        categoryId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).data("categoryid");

                    if (checkResponse(value.subunitid))
                        subUnitId = +value.subunitid
                    else
                        subUnitId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).data("subunitid");

                    if (checkResponse(value.unitid))
                        unitId = +value.unitid
                    else
                        unitId = +$(`#previousStagePageTable .pagetablebody [data-id="${value.id}"]`).data("unitid");

                    quantity = $(`#previousStagePageTable .pagetablebody [data-id="${value.id}"] #quantity_${rowNumber}`).val();

                    if (+quantity.replace(/\//g, ".").replace(/_/g, "") !== 0 && !isNaN(+removeSep(quantity.replace(/\//g, ".").replace(/_/g, ""))))
                        quantity = +removeSep(quantity.replace(/\//g, ".").replace(/_/g, ""));
                    else
                        quantity = 0;


                    if (value.attributeids == "" || value.attributeids == "null" || value.attributeids == null)
                        value.attributeids = null;

                    quantity = Math.abs(quantity);

                    var model = {
                        id: +value.id,
                        headerId: +$("#formPlateHeaderTBody").data("id"),
                        branchId: branchId,
                        stageId: +$("#formPlateHeaderTBody").data("stageid"),
                        categoryId: categoryId,
                        requestId: requestId,
                        headerAccountDetailId: +headerModel.accountDetailId,
                        headerNoSeriesId: +headerModel.noSeriesId,
                        isquantity: conditionalProperties.isQuantityWarehouse,
                        quantity: quantity,
                        totalquantity: +(quantity * value.ratio),
                        subUnitId: subUnitId,
                        unitId: unitId,
                        price: 1,
                        amount: +quantity * 1,
                        warehouseId: additionalData[14].value,
                        zoneId: zoneId,
                        binId: binId,
                        workflowCategoryId: additionalData[17].value,
                        itemid: value.itemid,
                        itemtypeid: value.itemtypeid,
                        attributeids: value.attributeids,
                        workflowId: additionalData[18].value,
                        headerInOut: additionalData[20].value,
                        headerDocumentDate: additionalData[21].value,
                        ratio: +value.ratio,
                        inOut: +value.inout,
                        currencyId: defaultCurrency,
                        stageClassId: additionalData[22].value,
                    };

                    let prop = [
                        "id", "headerId", "branchId", "stageId", "categoryId",
                        "accountDetailId", "requestId", "headerAccountDetailId", "headerNoSeriesId",
                        "isquantity", "quantity", "totalquantity", "subUnitId", "price", "amount",
                        "warehouseId", "zoneId", "binId", "workflowCategoryId",
                        "itemid", "itemtypeid", "unitId", "attributeids", "workflowId", "headerInOut", "headerDocumentDate", "ratio", "inOut", "currencyId", "stageClassId"
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
        errordata = data.filter(x => x.zoneId == 0 || x.binId == 0 || x.quantity == 0);
        if (errordata.length > 0) {

            let stringIds = "";
            for (var i = 0; i < errordata.length; i++) {
                stringIds += errordata[i].id + ",";
            }
            var msgItem = alertify.warning(`برای سطرهای  فوق ${stringIds}بخش و پالت و تعداد را مشخص نمایید مجوز ثبت ندارید`);
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
                        getPagetable_HeaderLine("jsonTransactionLineList");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                    return;
                },
                (result) => {
                    modal_close("previousStageItemTransactionLines");
                    return;
                });
        }
    }
}

$("#insertPreviousStageLine").click(async function () {

    if (conditionalProperties.parentworkflowcategoryid == 1) {
        let listType = requestId == 0 ? 2 : 1;

        let stageStep = getParentRequestStageStep(requestId, conditionalProperties.parentworkflowcategoryid);

        if (listType == 1)
            if (!stageStep.isLastConfirmHeader) {
                alertify.warning(" درخواست در حالت منتشر نشده می باشد مجاز به ثبت نمی باشید").delay(alertify_delay);
                return;
            }


    }
    //درخواست انبار باشد
    else if (conditionalProperties.parentworkflowcategoryid == 11) {
        var itemTransactionAction = getParentRequestStageStep(requestId, conditionalProperties.parentworkflowcategoryid);
        updatedRequestId = itemTransactionAction.requestId;
        if (updatedRequestId > 0) {
            if (!itemTransactionAction.isLastConfirmHeader) {
                alertify.warning(`درخواست ${updatedRequestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
                return;
            }
        }

    }

    await loadingAsync(true, $(this).prop("id"));
    await run_button_insert_PreviousStageLines();


})

function close_modal_previousStageRequests() {
    modal_close("previousStageItemTransactionLines");
}

function getPurchaseOrderInfo(id) {

    let url = "/api/PU/PurchaseOrderApi/getinfo"

    let outPut = $.ajax({
        url: url,
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
            return null;
        }
    });

    return outPut.responseJSON;
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
                    if (columns[j].id == "totalQuantity" && i == 13)

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

                                if (columns[j].id == "zoneId" || columns[j].id == "binId")
                                    columns[j].inputType = "select2";

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
                                else if (columns[j].inputType == "number") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                }
                                else if (columns[j].inputType == "money") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                }
                                else {
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                }

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
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
                                    if (value != null && value != "") {

                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;" >' + value + '</td>';
                                    }
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

        $("input").inputmask();

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
                        if (currentElm.parents("tr").hasClass("enable-requst-field")) {

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
                        $(`#${pg_name} .pagetablebody > tbody > tr#row` + pagetable_currentrow + ` > #col_` + pagetable_currentrow + `_7 > div:eq(1)`).removeClass("displaynone");

                        itemtypeIdVal = $(`#${pg_name} .pagetablebody > tbody > tr#row` + pagetable_currentrow + ` > #col_` + pagetable_currentrow + `_2 `).text().split('-')[0];

                        itemIdVal = $(`#${pg_name} .pagetablebody > tbody > tr#row` + pagetable_currentrow + ` > #col_` + pagetable_currentrow + `_3 `).text().split('-')[0];

                        fill_select2(`/api/WH/ZoneApi/getdropdownbyitem`, currentElm.attr('id'), true, `${warehouseId}/${+itemtypeIdVal}/${+itemIdVal}`);

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

function showStepLogs() {

    $(`#${activePageId} #actionItemTransaction`).addClass("displaynone");
    $(`#${activePageId} #update_action_btn`).addClass("displaynone");
    stepLogItemTransaction(id, stageId, workflowId);
    modal_show(`${activePageId} #stepLogModalItemTransaction`);
}

function update_action() {

    var currentActionId = actionId;
    var requestedActionId = +$("#actionItemTransactionForm").val();


    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        identityId: +id,
        stageId: stageId,
        workflowId: +workflowId,
        isLine: true,
        isItemRequestLine: false,
        workflowCategoryId: workflowCategoryIds.warehouse.id,
        documentDatePersian: $(`#${activePageId} #formPlateHeaderTBody`).data("transactiondatepersian"),
        parentWorkflowCategoryId: conditionalProperties.parentworkflowcategoryid,
        requestId: $(`#${activePageId} #formPlateHeaderTBody`).data("requestid"),
        currentBranchId: branchId
    }


    loadingAsync(true, "stepRegistration", "")

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            let resultValidate = null;
            if (model.requestActionId != model.currentActionId) {
                resultValidate = checkValidateUpdateStep(model);
                if (checkResponse(resultValidate)) {
                    if (resultValidate.length == 0) {

                        var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                        var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);

                        updateactionTransaction(model, currentStageAction, requestStageAction);
                        loadingAsync(false, "stepRegistration", "");
                    }
                    else {
                        alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                        $("#actionItemTransactionForm").val(currentActionId);
                        loadingAsync(false, "stepRegistration", "");
                    }

                }
                else
                    loadingAsync(false, "stepRegistration", "");
            }
            else
                loadingAsync(false, "stepRegistration", "");
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $(`#actionItemTransactionForm`).val(model.currentActionId);
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

function sendDocument(model, callBack) {

    let requestedStageStep = checkIsSendActionId(model.workflowId, model.stageId, model.requestActionId), modelSend = {};
    let newmodel = {
        identityId: +model.identityId,
        stageId: +model.stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            modelSend = [{
                id: model.identityId,
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`
            }];
            sendDocPostingGroup(modelSend, () => {
                $(`#itemTransactionLinePage #actionItemWarehouseForm`).val(model.actionId)
            }, callBack);
        }
        else
            updateStatus_warehouse(model);
    }
    else {
        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length !== 0) {
            modelSend = [{
                identityId: model.identityId,
                stageId: model.stageId
            }];
            undoDocPostingGroup(modelSend, () => { $(`#itemTransactionLinePage #actionItemWarehouseForm`).val(model.actionId) }, callBack);
        }
        else
            updateStatus_warehouse(model);
    }

}