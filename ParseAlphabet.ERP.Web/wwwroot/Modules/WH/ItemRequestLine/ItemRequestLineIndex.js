var viewData_form_title = "سطر های درخواست انبار",
    viewData_controllername = "ItemRequestLineApi",
    viewData_getHeader_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getheader`,
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/display`,
    viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyids`,
    viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/deleteItemRequestLine`,
    viewData_getpagetableLine_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getitemRequestlinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insertItemRequestLine`,
    viewData_uprecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/updateItemRequestLine`,
    viewData_itemRequestLines_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrequestfilteritems`,
    viewData_getsum_url = `${viewData_baseUrl_WH}/WarehouseTransactionLineApi/getLineSum`,
    viewData_updrecord_header_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/update`,

    headerModel = { isQuantityWarehouse: false, transactiondatepersian: null },
    price = 0,
    decimalprice = 0,
    headerLine_formkeyvalue = [],
    additionalData = [],
    arr_headerLinePagetables = [],
    requestId = 0,
    stageId = 0,
    workflowId = 0,
    branchId = 0,
    id = 0,
    existItemTransactionline = false,

    header_pgnation = 0,
    unitId = 0,
    ratio = 1,
    actionId = 0,
    conditionalProperties = {
        isRequest: false,
        isAfterChange: false,
        isTreasurySubject: false,
        isPreviousStage: false,
        isCartable: false,
        isDataEntry: false
    },
    activePageId = "itemRequestLinePage",
    selectedLineDetailId = 0,
    per1 = 0;
headerLine_formkeyvalue.push($(`#${activePageId} #id`).val());
headerLine_formkeyvalue.push(+$(`#${activePageId} #isDefaultCurrency`).val());
$("#itemId").parents(".form-group").removeClass("displaynone");


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
    upRecord_Url: viewData_uprecord_url,
    getsum_url: viewData_getsum_url,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: viewData_itemRequestLines_filter_url,
    pagetable_laststate: ""
};


arr_headerLinePagetables.push(pagelist1);

function call_initFormItemRequestyLine(header_Pagination = 0, elemId = undefined) {

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

async function callBackHeaderColumnFill() {

    if ((isFormLoaded || header_pgnation > 0)) {

        $(`#${activePageId} #itemTypeId `).empty();
        fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, stageId);
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

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="itemRequestExcel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="itemRequestlist()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '>
                                                        <select style='width: 72%; float: right' class='form-control' id='actionItemWarehouseForm'></select>
                                                        <button onclick='update_actionWarehouse()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa waves-effect' value=''>
                                                            <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                            <span style="margin-right:5px">ثبت گام</span>
                                                        </button>
                                                    </div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));

    stageId = +$(`#${activePageId} #stageId`).val();
    workflowId = +$(`#${activePageId} #workFlowId`).val();
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    //warehouseId = +$(`#${activePageId} #formPlateHeaderTBody`).data("warehouseid");
    actionId = + $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
    //headerModel.noSeriesId = +$(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid")
    //var accountDetailName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetail");
    //var accountDetailId = 0;
    //if (accountDetailName != undefined && accountDetailName != "" && accountDetailName != null)
    //    accountDetailId = +accountDetailName.split("-")[0];
    //headerModel.accountDetailId = accountDetailId;
    headerModel.isQuantityWarehouse = +$(`#${activePageId} #formPlateHeaderTBody`).data("isquantitywarehouse")
    headerLine_formkeyvalue[6] = headerModel.isQuantityWarehouse;
    headerModel.transactionDate = $(`#${activePageId} #formPlateHeaderTBody`).data("transactiondate");
    headerModel.transactiondatepersian = $(`#${activePageId} #formPlateHeaderTBody`).data("transactiondatepersian");
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
        { name: "price", value: 0 },
        { name: "amount", value: 0 },
        { name: "decimalAmount", value: 0 },
        { name: "currencyId", value: defaultCurrency },
        //{ name: "warehouseId", value: warehouseId },
        { name: "workFlowId", value: workflowId },
        { name: "headerDocumentDate", value: headerModel.transactionDate },
    ];

    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;


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

function headeUpdateModal_close() {
    public_tr_object_onchange($(`#${activePageId} #itemTypeId`), 'jsonTransactionLineList');
    configItemRequestElementPrivilage(".ins-out", false);
    modal_close("headeUpdateModal");
}

async function callBackLineFill() {



    $(`#${activePageId} #currencyId option[value='0']`).remove();
    var row1 = $("#itemRequestLinePage #row1");
    if ($("#itemRequestLinePage #row1").length > 0) {
        trOnclick("jsonTransactionLineList", row1, null);
    }
    else
        configAfterChange();

    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "branchId", value: +$("#formPlateHeaderTBody").data("branchid") });
    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() });

    firstLineLoaded = true;
    let stageClassIds = "1";
    $(`#${activePageId} #actionItemWarehouseForm`).empty();
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionItemWarehouseForm", true, `${stageId}/${workflowId}/1/0/${branchId}/${workflowCategoryIds.warehouse.id}/true/${stageClassIds}`);
    $(`#${activePageId} #actionItemWarehouseForm`).val(actionId).trigger("change");

    $("#filter_itemType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_WH}/ItemApi/getdropdownwithitemtypeid/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `/api/WH/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);

        //$("#filter_zone").data("api", `${viewData_baseUrl_WH}/ZoneApi/getalldatadropdown`);

        //$("#filter_bin").data("api", `${viewData_baseUrl_WH}/WBinApi/getdropdown`);


    }


}

function configAfterChange() {
    setTimeout(function () {
        if (!conditionalProperties.isAfterChange) {
            configItemRequestElementPrivilage(".ins-out", isAfterSave);
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


}

function itemRequestExcel() {
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

async function printFromPlateHeaderLine() {

    let reportTitle = `چاپ تعدادی`;
    let stageQuantity = true;
    let transactionId = +$("#formPlateHeaderTBody").data("id")
    let branch = $("#formPlateHeaderTBody").data("branch")
    let documentTypeName = ""
    let journalId = 0
    let documentDatePersian = $("#formPlateHeaderTBody").data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle, documentDatePersian);

}

function checkEditOrDeletePermission(opr = "Upd") {
    var itemRequestAction = getStageActionConfig(id);

    if (opr == "Upd") {
        if (itemRequestAction.isDataEntry == 1)
            return true;
        else
            return false;
    }
    else {
        if (itemRequestAction.isDataEntry != 0)
            return true;
        else
            return false;
    }
}

//باتن فعال کردن
function headerLineActive(pageId) {

    var stageAction = getStageActionConfig(id);
    if (stageAction.isDataEntry) {
        $(".ins-out").removeData();
        $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonTransactionLineList')");
        configItemRequestElementPrivilage(`.ins-out`, true);
        //$("#zoneId").prop("disabled", true);
        //$("#binId").prop("disabled", true);

    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

function click_link_header(elm) {
    if ($(elm).data().id == "itemTransactionId")
        navigation_item_click(`/WH/ItemTransactionLine/${+$(elm).text()}/${+$(`#itemRequestLinePage #isDefaultCurrency`).val()}/0`);

}


/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */

function configItemRequestElementPrivilage(containerId, privilageType = null) {

    $(`#${activePageId} #headerLineInsUp`).removeClass("d-none");
    $(`#${activePageId} #header-div-content button`).prop("disabled", !(conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 2));


    if (!privilageType) {
        $("#itemTypeId").prop("selectedIndex", 0).trigger("change");
        $("#subUnitId").prop("selectedIndex", 0).trigger("change");
    }

    if (conditionalProperties.isDataEntry) {
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        $(`#${activePageId} .pagetablebody button`).prop("disabled", false);

        if (conditionalProperties.isPreviousStage == 1 || requestId > 0)
            $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
        else
            $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);

    }
    else {
        if (conditionalProperties.isDataEntry)
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        else
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

        $(`#${activePageId} .pagetablebody button`).prop("disabled", true);
    }
    if (privilageType != null) {
        var selector,
            allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp`);

        if (privilageType) {

            $("#haederLineActive").removeClass("pulse");
            $("#haederLineActive").removeAttr("title");

            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            if (conditionalProperties.isDataEntry) {
                lineSelectedId = 0;
                for (var i = 0; i < allSelector.length; i++) {
                    selector = $(allSelector[i]);
                    if (allSelector[i].id != "") {
                        if (selector.hasClass("select2-hidden-accessible")) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content") {
                                selector.val("0").trigger("change");
                            }
                        }
                        else if (selector.hasClass(".funkyradio")) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.prop("checked", false);
                        }

                        else {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.val(``);
                        }
                    }
                }
            }
            else
                configItemRequestElementPrivilage(".ins-out", false);

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
            if ($("#itemRequestLinePage #row1").length > 0) {
                $("#haederLineActive").removeClass("pulse");
                $("#haederLineActive").removeAttr("title");
            }

            if (conditionalProperties.isDataEntry)
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
            else
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

            for (var i = 0; i < allSelector.length; i++) {
                selector = $(allSelector[i]);
                if (selector.hasClass("select2-hidden-accessible")) {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                        selector.val("0").trigger("change");
                    }
                }
                else if (selector.hasClass(".funkyradio")) {
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.prop("checked", !privilageType);
                }

                else {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.val(``);
                }
            }
        }
    }
}

configLineElementPrivilage = configItemRequestElementPrivilage;

$(document).on("keydown", `#${activePageId} #formHeaderLine`, function (e) {
    if (e.keyCode == KeyCode.Esc) {
        if (+$("#itemTypeId").val() != $("#itemTypeId").prop("selectedIndex", 0).val())
            $("#itemTypeId").val($("#itemTypeId").prop("selectedIndex", 0).val()).trigger("change");

        configItemRequestElementPrivilage(".ins-out", false)
        // $(`#${activePageId} #itemRequestLinePage .ins-out > .row`).parsley().reset();

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configItemRequestElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configItemRequestElementPrivilage(".ins-out", false);
    }
});

call_initFormItemRequestyLine();

call_initform = call_initFormItemRequestyLine;

function afterInsertLineHeaderLine() {
    configItemRequestElementPrivilage(".ins-out", false);

    $("#filter_itemType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);

    if (+$("#itemTypeId").val()) {

        $("#filter_item").data("api", `${viewData_baseUrl_WH}/ItemApi/getdropdownwithitemtypeid/${+$("#itemTypeId").val()}`);

        $("#filter_categoryItemName").data("api", `/api/WH/ItemCategoryApi/getdropdownbytype/${+$("#itemTypeId").val()}`);

        $("#filter_attributeName").data("api", `${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown/null`);

        $("#filter_unitNames").data("api", `${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`);
    }
}

function itemRequestlist() {

    if (!conditionalProperties.isCartable)
        navigation_item_click('/WH/ItemRequest', 'درخواست های انبار');
    else
        navigation_item_click('/WH/ItemRequestCartable', 'کارتابل درخواست انبار');
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistItemTransactionId(+elm.val());
        if (checkExist)
            navigation_item_click(`/WH/ItemRequestLine/${+elm.val()}/${+$(`#itemRequestLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistItemTransactionId(id) {

    let viewData_getItemRequsetCheckExist = `${viewData_baseUrl_WH}/ItemRequestApi/checkexist`;

    let outPut = $.ajax({
        url: viewData_getItemRequsetCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getItemRequsetCheckExist);
        }
    });
    return outPut.responseJSON;
}

function chekExistItemTransactionline(id) {

    var result = $.ajax({
        url: `${viewData_baseUrl_WH}/${viewData_controllername}/getItemTransactionCount`,
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
            error_handler(xhr, url);
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

async function local_tr_object_onchange(elem, pageId) {

    var elemValue = $(elem).val();
    switch ($(elem).attr("id")) {
        case "itemTypeId":
            if (elemValue > 0) {
                fill_items(+elemValue);
                getFundItemTypeInOut(elemValue);
            }
            break;
        case "itemId":
            if (elemValue > 0) {
                clearColumns();
                //getZoneDropDown();
                getCategoryIdByitemId(+$("#itemId").val());
                getItemAttributeAndUnitWhitCategoryId(+elemValue, +$("#itemTypeId").val());
            }
            break;

        case "subUnitId":
        case "quantity":
        case "price":
            cal_getRatio();
            break;

        //case "zoneId":
        //    if (elemValue > 0) {
        //        getBinDropDown(elemValue);
        //        break;
        //    }
    }
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
                if (additionalData.length > 0)
                    additionalData[8].value = result;
            }
        });
    }
}

function tr_object_onblur(pageId = '', elem, rowno = 0, colno = 0) {
    var elem = $(elem);
    var elemId = elem.attr("id");
    var elemIdSplited = elemId.split("_")[0];
    switch (elemIdSplited) {
        case "quantity":
        case "price":
            cal_getRatio();
            break;
    }

}

function run_header_line_row_editItemRequset(pageId, rowNo, ev) {

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
    let get_record_model = {
        id: lineId
    }

    $.ajax({
        url: `${viewData_baseUrl_WH}/ItemRequestLineApi/getrecordbyids`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(get_record_model),
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
                $("#amount").val(transformNumbers.toComma((data.amount + data.decimalAmount).toFixed(3)));
                //$("#zoneId").val(data.zoneId).trigger("change.select2");
                //$("#binId").val(data.binId).trigger("change.select2");
                $("#itemId").select2("focus");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function clearColumns() {
    $("#amount").val(0);
    $("#itemRequestLinePage .ins-row").attr("data-hidden-discpercent", 0);
    $("#quantity").val("1");

}

function fill_items(itemTypeId) {

    $("#itemId").empty();
    var dropDownUrl = "";
    var param = '';
    dropDownUrl = `${viewData_baseUrl_WH}/ItemApi/getdropdownwithitemtypeid`;
    param = `${itemTypeId}`;
    fill_select2(dropDownUrl, "itemId", true, param, false, 3, "انتخاب"
        , function () {
            $("#itemId").val($("#itemId").data("val")).trigger("change");
            $("#itemId").data("val", "");
        }
    );
    $("#itemId").val($("#itemId").data("val"));
}

function local_objectChange(elem) {

    var elm = $(elem);
    var elemId = $(elem).attr("id");
    var elmValue = +$(elm).val();
    if (elmValue === 0 || isNaN(elmValue)) {
        return;
    }


}

function run_header_line_row_moreInfo(id, rowno) {
    var row = $(`#itemRequestLinePage #row${rowno}`).data();
    $("#itemRequestDetailRows").html("");
    var trString = `<tr><td>${row['model.bankissuer']}</td><td>${row['model.bankaccountissuer']}</td><td>${row['model.bondduedatepersian']}</td></tr>`;
    $("#itemRequestDetailRows").append(trString);
    $("#itemRequestineDetailModal").modal("show");
}

function cal_getRatio() {

    let subUnitId = +$('#subUnitId').val();
    let newQuantity = +$("#quantity").val().replace("_", "000")
    let totalQuantity = newQuantity.toFixed(3)
    $("#quantity").val(totalQuantity)
    $('#totalQuantity').val(totalQuantity);
    additionalData[6].value = 1;
    additionalData[7].value = 0;
    if (subUnitId > 0) {

        if (checkResponse(subUnitId) && subUnitId != unitId && subUnitId != NaN) {

            $.ajax({
                url: `api/WH/ItemUnitApi/getratio/${subUnitId}`,
                type: "get",
                contentType: "application/json",
                success: function (result) {
                    if (checkResponse(result)) {

                        ratio = result.ratio;
                        totalQuantity = +$('#quantity').val().replace("_", "000") * ratio;
                        $('#totalQuantity').val(totalQuantity.toFixed(3));
                        additionalData[6].value = ratio;
                        additionalData[7].value = result.idSubUnit;

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

    price = +removeSep($("#price").val()) > 0 ? +removeSep($("#price").val()) : 1;
    $("#price").val(price);
    var quantity = $(`#totalQuantity`).length > 0 ? +removeSep($(`#totalQuantity`).val()) : 0;
    var amount = quantity * price;
    $(`#amount`).val(transformNumbers.toComma(amount));
    additionalData[10].value = $("#price").val();
    additionalData[11].value = amount;

}

//function getBinDropDown(zoneId) {
//    $("#binId").empty();
//    $("#binId").prop("disabled", false);
//    let itemtypeId = +$("#itemTypeId").val();
//    let itemId = +$("#itemId").val();
//    fill_select2(`/api/WH/WBinApi/getdropdownbyitem`, "binId", true, `${warehouseId}/${itemtypeId}/${itemId}/${zoneId}`);
//    $(`#${activePageId} #binId`).val($("#binId option:first").val()).trigger("change");
//}

//function getZoneDropDown() {
//    $("#zoneId").empty();
//    $("#zoneId").prop("disabled", false);
//    let itemtypeId = +$("#itemTypeId").val();
//    let itemId = +$("#itemId").val();
//    fill_select2(`/api/WH/ZoneApi/getdropdownbyitem`, "zoneId", true, `${warehouseId}/${itemtypeId}/${itemId}`);
//    $(`#${activePageId} #zoneId`).val($("#zoneId option:first").val()).trigger("change");
//}

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

window.Parsley._validatorRegistry.validators.dateissamebonddue = undefined;
window.Parsley.addValidator("dateissamebonddue", {
    validateString: function (value) {
        var bondDueDatePersianDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var itemRequestDate = moment.from(getShamsiTransactionDate(id), 'fa', 'YYYY/MM/DD');
        if (bondDueDatePersianDate.isValid()) {
            bondDueDatePersianDate = bondDueDatePersianDate.format('YYYY/MM/DD');
            itemRequestDate = itemRequestDate.format('YYYY/MM/DD');
            var dateIsValid = moment(bondDueDatePersianDate).isSameOrAfter(itemRequestDate, 'day');
            return dateIsValid;
        }
        return false;
    },
    messages: {
        en: 'تاریخ رسید چک باید بزرگتر، مساوی تاریخ برگه درخواست باشد'
    }
});

function showStepLogs() {

    $(`#${activePageId} #actionItemWarehouse`).addClass("displaynone");
    $(`#${activePageId} #update_action_btn`).addClass("displaynone");
    stepLogWarehouse(id, stageId, workflowId);
    modal_show(`${activePageId} #stepLogModalWarehouseTransaction`);
}

function update_actionWarehouse() {

    var currentActionId = actionId;
    var requestedActionId = +$("#actionItemWarehouseForm").val();
    var documentDatePersian = headerModel.transactiondatepersian;


    var model = {
        requestActionId: requestedActionId,
        currentActionId,
        identityId: +id,
        stageId: stageId,
        workflowId: workflowId,
        isLine: true,
        isItemRequestLine: true,
        workflowCategoryId: workflowCategoryIds.warehouse.id,
        documentDatePersian: documentDatePersian

    }

    loadingAsync(true, "stepRegistration", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            if (model.requestActionId != currentActionId)
                updateStatus_ItemRequset(model);
            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "stepRegistration", "");
            }

        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $(`#actionItemWarehouseForm`).val(currentActionId);
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

$('#displayItemRequestLineModel').on("hidden.bs.modal", function (evt) {

    let pagetable = ""
    let switchUser = ""
    activePageTableId = "pagetable"
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, null];
});



