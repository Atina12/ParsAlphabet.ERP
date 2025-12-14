var viewData_form_title = "سفارش  خرید / برگشت",
    viewData_controllername = "PurchaseOrderLineApi",
    viewData_getHeader_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getheader`,
    viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/display`,
    viewData_getrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyids`,
    viewData_deleterecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/deleteOrderLine`,
    viewData_getorderlinepagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getorderlinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insertOrderLine`,
    viewData_uprecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/updateorderLine`,
    viewData_OrderLine_filter_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getorderlinefilteritems`,
    viewData_updatePersonInvoiceStep_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`,
    viewData_getPurchaseOrderCheckExist = `${viewData_baseUrl_PU}/PurchaseOrderApi/checkexist`,
    viewData_personOrderStepList_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/getpurchaseordersteplist`,
    viewData_updrecord_header_url = `${viewData_baseUrl_PU}/PurchaseOrderApi/update`,
    viewData_print_file_url = `${stimulsBaseUrl.PU.Prn}PurchaseOrderOfficial.mrt`,
    viewData_getsum_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getLineSum`,
    stageId = 0,
    branchId=0,
    workflowId = 0,
    actionId = 0,
    hasPriviousMode = false,
    orderDatePersian = "",
    viewData_report_url = `/Report/Index`,
    headerModel = {},
    headerLine_formkeyvalue = [],
    arr_headerLinePagetables = [],
    conditionalProperties = {
        isAfterChange: false,
        isCartable: false,
        isDataEntry: false,
        isPreviousStage: false,
        isQuantityPurchase: false
    },
    currentActionId = 0,
    discountprice = 0,
    discountAmount = 0,
    netAmountPlusVAT = 0,
    activePageId = "purchaseOrderLinePage",
    hasVat = false,
    isAmount = false;

headerLine_formkeyvalue.push($("#personOrderId").val());
headerLine_formkeyvalue.push($("#isDefaultCurrency").val());
$("#itemId").parents(".form-group").removeClass("displaynone");
var additionalData = [];
var unitId;
var ratio = 1;
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
    getpagetable_url: viewData_getorderlinepagetable_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: viewData_uprecord_url,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: viewData_OrderLine_filter_url,
    getsum_url: viewData_getsum_url,
    pagetable_laststate: ""
};

arr_headerLinePagetables.push(pagelist1);

function call_initFormPurchaseOrderLine(header_Pagination = 0, elemId = undefined) {

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
    var p_id = "id";
    var p_value = id;
    var p_type = 8;
    var p_size = 0;

    var reportParameters = [
        { Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "StageName", Value: "سفارش خرید", itemType: "Var" },
    ]

    stimul_report(reportParameters);
}

function stimul_report(reportParameters) {

    var reportModel = {
        reportUrl: viewData_print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="personOrderExcel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="personOrderList()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '><select style='width: 72%; float: right' class='form-control' id='action'></select>
                                                     <button onclick='update_action()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa waves-effect' value=''>
                                                           <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                           <span style="margin-right:5px">ثبت گام</span>
                                                     </button></div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));
    stageId = +$(`#${activePageId} #stageId`).val();
    workflowId = +$(`#${activePageId} #workFlowId`).val();
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    actionId = +$(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
    OrderDate = $(`#${activePageId} #formPlateHeaderTBody`).data("orderdate");
    headerModel.documentTypeId = +$(`#${activePageId} #formPlateHeaderTBody`).data("documenttypeid");
    headerModel.documentTypeName = $(`#${activePageId} #formPlateHeaderTBody`).data("documenttypename");
    headerModel.accountGLId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountglid");
    headerModel.accountSGLId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountsglid");
    headerModel.accountDetailId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailid");
    headerModel.returnReasonId = $(`#${activePageId} #formPlateHeaderTBody`).data("returnreasonid");
    headerModel.accountDetailVatEnable = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatinclude");
    headerModel.accountDetailVatInclude = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatenable");
    headerModel.inOut = $(`#${activePageId} #formPlateHeaderTBody`).data("inout");
    var accountDetailId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailid");

    headerModel.accountDetailId = accountDetailId;

    additionalData = [
        { name: "headerId", value: id },
        { name: "stageId", value: stageId },
        { name: "branchId", value: branchId },
        { name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() },
        { name: "headerAccountDetailId", value: +headerModel.accountDetailId },
        { name: "vatId", value: 0 },
        { name: "ratio", value: 1 },
        { name: "idSubUnit", value: 0 },
        { name: "vatAccountDetailId", value: 0 },
        { name: "vatNoSeriesId", value: 0 },
        { name: "unitId", value: 0 },
        { name: "inOut", value: 0 },
        { name: "discountAmount", value: 0 },
        { name: "price", value: 0 },
        { name: "grossAmount", value: 0 },
        { name: "vatPer", value: 0 },
        { name: "vatAmount", value: 0 },
        { name: "netAmountPlusVAT", value: 0 },
        { name: "discountType", value: 0 },
        { name: "discountValue", value: 0 },
        { name: "netAmount", value: 0 },
        { name: "workFlowId", value: workflowId },
        { name: "categoryId", value: 0 },
    ];

    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;
    conditionalProperties.isQuantityPurchase = $("#formPlateHeaderTBody").data("isquantitypurchase") == 1 ? true : false;

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
    configPersonOrderElementPrivilage(".ins-out", false);
    modal_close("headeUpdateModal");
}

async function callBackHeaderColumnFill() {


    if ((isFormLoaded || header_pgnation > 0)) {

        $(`#${activePageId} #itemTypeId `).empty();
        fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, `${stageId}/1`);
        $(`#${activePageId} #itemTypeId`).val($("#itemTypeId option:first").val()).trigger("change");



        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #itemTypeId`).val());
        else
            headerLine_formkeyvalue[3] = +$(`#${activePageId} #itemTypeId`).val();

        if (conditionalProperties.isBank) {
            $("#headerLineInsUp").addClass("d-none");
        }
        else
            $("#headerLineInsUp").removeClass("d-none");

        headerLine_formkeyvalue[4] = stageId;
        headerLine_formkeyvalue[5] = workflowId
    }

}

async function callBackLineFill() {
    
    $(`#${activePageId} #currencyId option[value='0']`).remove();
    var row1 = $("#purchaseOrderLinePage #row1");
    if ($("#purchaseOrderLinePage #row1").length > 0) {
        trOnclick("jsonOrderLineList", row1, null);


    }
    else {
        configAfterChange();
    }
    firstLineLoaded = true;

    $(`#${activePageId} #action`).empty();
    let stageClassIds = "1";
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

function personOrderExcel() {

    let url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`;
    var csvModel = {
        FieldItem: $(`#jsonOrderLineList .btnfilter`).attr("data-id"),
        FieldValue: $(`#jsonOrderLineList .filtervalue`).val(),
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

function configAfterChange() {
    setTimeout(function () {
        if (!conditionalProperties.isAfterChange) {
            configPersonOrderElementPrivilage(".ins-out", isAfterSave);
            isAfterSave = false;
        }
        else {
            $("#itemTypeName").select2("focus");
            conditionalProperties.isAfterChange = false;
        }
    }, 100)
}

function headerLineActive(pageId) {
    $(".ins-out").removeData();
    $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonOrderLineList')");
    configPersonOrderElementPrivilage(`.ins-out`, true);
}

function click_link_header(elm) {
    if ($(elm).data().id == "invoiceId")
        navigation_item_click(`/PU/PurchaseInvoiceLine/${+$(elm).text()}/${+$(`#purchaseOrderLinePage #isDefaultCurrency`).val()}`);
    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#purchaseOrderLinePage #isDefaultCurrency`).val()}`);
}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configPersonOrderElementPrivilage(containerId, privilageType = null) {

    $(`#${activePageId} #headerLineInsUp`).removeClass("d-none");

    $(`#${activePageId} #header-div-content button`).prop("disabled", !(conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 2));

    if (!privilageType) {
        $("#itemTypeId").prop("selectedIndex", 0).trigger("change");
        $("#subUnitId").prop("selectedIndex", 0).trigger("change");
    }

    if (conditionalProperties.isDataEntry) {
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        $(`#${activePageId} .pagetablebody button`).prop("disabled", false);

    }
    else {
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        $(`#${activePageId} .pagetablebody button`).prop("disabled", true);
        $(`#${activePageId} .pagetablebody button#btn_averagePrices`).prop("disabled", false);
        $("#jsonOrderLineList .pagetablebody tbody tr  td button:last-child").prop("disabled", false)

    }
    if (privilageType != null) {
        var selector,
            allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp`);
        if (privilageType) {

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
                        else if (selector.attr("id") == "addRequestLines")
                            selector.prop("disabled", privilageType);
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
                configPersonOrderElementPrivilage(".ins-out", false);

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

            if ($("#jsonOrderLineList #row1").length > 0) {
                $("#haederLineActive").removeClass("pulse");
                $("#haederLineActive").removeAttr("title");
            }

            if (conditionalProperties.isDataEntry)
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);

            else {
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
                $(`#${activePageId} #btn_header_update`).prop("disabled", true);
            }


            for (var i = 0; i < allSelector.length; i++) {
                selector = $(allSelector[i]);
                if (selector.hasClass("select2-hidden-accessible")) {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                        selector.prop("selectedIndex", 0).trigger("change");
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

    $("#categoryItemId").prop("disabled", true);




}

configLineElementPrivilage = configPersonOrderElementPrivilage;

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
        configPersonOrderElementPrivilage(".ins-out", false);
        // $(`#${activePageId} #purchaseOrderLinePage .ins-out > .row`).parsley().reset();

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configPersonOrderElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configPersonOrderElementPrivilage(".ins-out", false);
    }
});

call_initFormPurchaseOrderLine();

call_initform = call_initFormPurchaseOrderLine;

function afterInsertLineHeaderLine() {
    configPersonOrderElementPrivilage(`.ins-out`, false);
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
        navigation_item_click('/PU/PurchaseOrder', 'سفارش خرید / برگشت');
    else
        navigation_item_click(`/PU/PurchaseOrderCartable/${stageId}`, 'کارتابل مالی سفارش خرید');

}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistPurchaseOrderId(+elm.val());

        if (checkExist)
            navigation_item_click(`/PU/PurchaseOrderLine/${+elm.val()}/${+$(`#purchaseOrderLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("شناسه درخواست در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistPurchaseOrderId(id) {

    let outPut = $.ajax({
        url: viewData_getPurchaseOrderCheckExist,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getPurchaseOrderCheckExist);
        }
    });
    return outPut.responseJSON;

}

function IsShowNoSeriesPurchasePerson(id) {

    let result = $.ajax({
        url: `api/PU/PurchaseOrderLineApi/getPurchasePersonLineQuantity`,
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
            error_handler(xhr, `api/PU/PurchaseOrderLineApi/getPurchasePersonLineQuantity/${personOrderId}`)
            return 0;
        }
    });
    return result.responseJSON;
}

function run_header_line_row_After_delete() {

    get_header();

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

    if (e.which === KeyCode.Enter) {

        var elem = $(elem);
        var elemId = $(elem).attr("id");

        switch (elemId) {

        }
    }
}

function local_tr_object_onchange(elem) {

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

            if (elem.val() > 0) {
                clearColumns();
                getPersonOrderFundItemTypeInOut(+$("#itemTypeId").val());
                // headerModel.accountDetailVatInclude =false   اجازه ثبت سطر دارد
                // headerModel.accountDetailVatInclude =true && headerModel.accountDetailVatEnable =false   اجازه ثبت سطر ندارد
                if (!headerModel.accountDetailVatInclude && headerModel.accountDetailVatEnable) {
                    alertify.error(`لطفا تنظیمات اعتبار مالیات را برای تامین کننده  ${headerModel.accountDetailName} تعریف نمایید. `);
                    return;
                }
                else
                    get_itemVat(elem.val());


                getCategoryItemName(elem.val(), +$("#itemTypeId").val());
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
            //calc_grossAmount();
            //calc_discountAmount();
            cal_amount();
            break;

        case "subUnitId":
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
                    $("#discountValue").removeAttr("data-parsley-checkcompareamount", +removeSep($("#grossAmount").val()));
                    $("#discountValue").attr("data-parsley-max", 99);
                    $("#discountValue").attr("maxlength", 3);
                }
                else {
                    $("#discountValue").attr("data-parsley-min", 1);
                    $("#discountValue").removeAttr("data-parsley-max", 99);
                    $("#discountValue").attr("data-parsley-checkcompareamount", +removeSep($("#grossAmount").val()));
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
            }

            break;

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
        url: "/api/PU/PurchaseOrderLineApi/getrecordbyids",
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
                data.totalQuantity == 0 ? $("#totalQuantity").val(data.quantity) : $("#totalQuantity").val(data.totalQuantity);


                if (data.currencyId > 0) {
                    $("#currencyId").val(data.currencyId).trigger("change.select2");
                    $("#exchangeRate").val(data.exchangeRate)
                }

                $("#categoryItemId").val(data.categoryItemName);
                $("#quantity").val(data.quantity).trigger("change");
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

                $(".ins-out").data("model.vatper", data.vatPer);
                $("#itemId").select2("focus");

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
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#netAmountPlusVAT").val(0);
    $("#vatPer").val(0);
    $("#purchaseOrderLinePage .ins-out").attr("data-hidden-discpercent", 0);
    $("#purchaseOrderLinePage .ins-row").attr("data-hidden-discpercent", 0);
    $(".ins-out").data("model.vatper", 0);
    $("#priceIncludingVAT input[type='checkbox']").val(0);
    $("#priceIncludingVAT input[type='checkbox']").removeAttr("checked");
    $("#categoryItemId").prop("disabled", true);
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

    var elm = $(elem);
    var elemId = $(elem).attr("id");
    var elmValue = +$(elm).val();
    if (elmValue === 0 || isNaN(elmValue)) {
        return;
    }

    if (elemId === "treasurySubjectId") {
        $("#noseriesid").empty();
        $("#accountDetailId").empty();
        $("#noSeriesId").val("").trigger("change");
        $("#accountDetailId").val("").trigger("change");
        var model = {
            id: elmValue,
            stageId: stageId,
            branchId: branchId,
        };
        GetnoSeriesListWhitGlSgl(model, 1);
    }
    if (elemId === "noSeriesId") {
        let noSeriesId = elmValue
        $("#accountDetailId").empty();
        getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
    }

}

function get_enableVat(accountDetailId) {

    var url = `${viewData_baseUrl_PU}/VendorApi/getenablevat/${accountDetailId}`
    $.ajax({
        url: url,
        async: false,
        type: "get",
        success: function (result) {

            hasVat = (result == "False" ? false : true);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function get_itemVat(itemId) {

    let itemTypeId = +$("#itemTypeId").val();
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
                        additionalData[5].value = result.data.vatId;
                        additionalData[8].value = result.data.accountDetailId;
                        additionalData[9].value = result.data.noSeriesId;
                    }
                }

                else {
                    $(".ins-out").data("model.vatper", 0);
                }

            }
            else {

                additionalData[5].value = 0;
                additionalData[8].value = 0;
                additionalData[9].value = 0;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function cal_amount() {
    let price = (+removeSep($("#price").val())) > 0 ? (+removeSep($("#price").val())) : 1;
    $("#price").val(price);

    calc_grossAmount();
    calc_discountAmount();
}

function cal_getRatio() {

    let subUnitId = +$('#subUnitId').val();
    let newQuantity = +$("#quantity").val().replace("_", "000")
    let totalQuantity = newQuantity.toFixed(3)
    $('#quantity').val(totalQuantity);
    $('#totalQuantity').val(totalQuantity);
    additionalData[6].value = 1;
    additionalData[7].value = 0;

    if (subUnitId > 0) {

        if (checkResponse(subUnitId) != NaN && subUnitId != additionalData[10].value && subUnitId != null) {

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
                        additionalData[6].value = ratio;
                        additionalData[7].value = result.idSubUnit;

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

    let grossAmount = 0;

    grossprice = (+removeSep($("#price").val()));
    let exchangeRate = +$("#isDefaultCurrency").val() ? 1 : +removeSep($("#exchangeRate").val());
    let quantity = +removeSep($("#totalQuantity").val().replace("._", "0"));

    grossAmount = quantity * +grossprice * exchangeRate;
    $("#grossAmount").val(transformNumbers.toComma(grossAmount.toFixed(3)));

    $("#price").val(transformNumbers.toComma(grossprice.toFixed(3)));
    //مقدار دهی  مبالغ در صورتی که برگه  تعدادی باشد
    additionalData[13].value = (+removeSep($("#price").val())) > 0 ? (+removeSep($("#price").val())) : 1;
    additionalData[14].value = +removeSep($("#grossAmount").val());
}

function calc_discountAmount() {

    var netAmount = 0;
    $("#netAmount").val();
    var grossAmount = +removeSep($("#grossAmount").val());
    if (grossAmount > 0) {

        if (+$("#discountType").val() == 0) {
            netAmount = grossAmount.toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount));
            additionalData[12].value = 0;
            additionalData[20].value = netAmount;
            $("#grossAmount").val(transformNumbers.toComma(grossAmount.toFixed(3)));
        }
        //تخفیف به صورت درصد باشد
        else if (+$("#discountType").val() == 1) {

            discountprice = (+$("#discountValue").val() > 0 ? (+$("#discountValue").val()) : 0);
            discountAmount = (grossAmount * (discountprice / 100));
            netAmount = (grossAmount.toFixed(3) - discountAmount.toFixed(3)).toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount));
            additionalData[12].value = discountAmount;
        }
        //تخفیف بصورت مبلغ
        else {

            discountprice = (+removeSep($("#discountValue").val()) > 0 ? (+removeSep($("#discountValue").val())) : 0);
            netAmount = (grossAmount.toFixed(3) - discountprice.toFixed(3)).toFixed(3);
            $("#netAmount").val(transformNumbers.toComma(netAmount));
            additionalData[12].value = discountprice.toFixed(3);

        }

        let vatper = 0;

        if (checkResponse(headerModel.accountDetailId) > 0) {
            get_enableVat(headerModel.accountDetailId);
            if (hasVat)//در صورتی که کد تفضیل مشمول مالیات بر ارزش افزوده باشد
            {

                get_itemVat($("#itemId").val());
                vatper = +$(".ins-out").data("model.vatper");
            }
        }

        if (checkResponse(vatper) && !isNaN(vatper) && vatper != 0) {
            //$("#vatPer").val(vatper);
            let vatAmount = ((vatper / 100) * netAmount);
            $("#vatAmount").val(transformNumbers.toComma(vatAmount.toFixed(3)));
            netAmountPlusVAT = (+vatAmount) + (+netAmount);
            $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmountPlusVAT.toFixed(3)));



        }
        else {

            $("#vatPer").val(0);
            $("#vatAmount").val(0);
            $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmount));

        }
        //مقدار دهی  مبالغ در صورتی که برگه  تعدادی باشد
        additionalData[15].value = conditionalProperties.isQuantityPurchase ? $("#vatPer").val() : 0;
        additionalData[16].value = conditionalProperties.isQuantityPurchase ? $("#vatAmount").val() : 0;
        additionalData[17].value = conditionalProperties.isQuantityPurchase ? $("#netAmountPlusVAT").val() : 0;

    }

}

function update_action() {

    currentActionId = +$("#formPlateHeaderTBody").data("actionid");
    var requestedActionId = +$(`#${activePageId} #action`).val();
    var currentWorkFlowId = +$("#formPlateHeaderTBody").data("workflowid");



    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: stageId,
        workflowId: currentWorkFlowId,
        workflowCategoryId: workflowCategoryIds.purchase.id,
        documentDatePersian: $(`#${activePageId} #formPlateHeaderTBody`).data("orderdatepersian"),
        parentWorkflowCategoryId: workflowCategoryIds.purchase.id
    }

  
    loadingAsync(true, "stepRegistration", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            if (model.requestActionId != model.currentActionId)
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
       
    },10)
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

    $.ajax({
        url: url,
        async: false,
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
                    $("#action").val(model.currentActionId).trigger("change")
                }
            }
            loadingAsync(false, "stepRegistration", "");
        },
        error: function (xhr) {
            error_handler(xhr, url);
            loadingAsync(false, "stepRegistration", "");
        }
    });

}

function updateActionPurchase(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 

    if (currentStageAction.priority < requestStageAction.priority) {

        //#region گام3 به گام 9   
        if ((!currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var result = checkHeaderBalance(model);

            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#action").val(currentActionId).trigger("change")
            }
        }
        //#endregion

        //#region گام9 به گام 10
        else if ((currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var result = checkHeaderBalance(model);
            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#action").val(currentActionId).trigger("change")
            }
        }
        //#endregion

        //#region گام3 به گام 10  
        else if ((!currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var result = checkHeaderBalance(model);

            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#action").val(currentActionId).trigger("change")
            }
        }
        else {
            //#region گام2 به گام 3  

            // ویرایش گام انجام می شود
            updateStatus(model, () => {
                $("#action").val(currentActionId).trigger("change")
            });
            //#endregion
        }

        //#endregion

    }

    //#endregion

    //#region  کاهش گام

    else {

        //#region  گام 10 به گام 3

        if ((!currentStageAction.costofItemOrdered && currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var unitCostCalculation = checkIsUnitCostCalculatedPurchaseOrder(model);
            if (unitCostCalculation === 1) {
                alertify.error("رسید های  انبار متصل به این درخواست خرید ریالی شده اند").delay(alertify_delay);
                $("#action").val(currentActionId).trigger("change")
            }

            else
                returninvoiceprice(model);
        }
        //#endregion

        //#region گام10 به گام 9

        else if ((!currentStageAction.costofItemOrdered && currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var unitCostCalculation = checkIsUnitCostCalculatedPurchaseOrder(model);
            if (unitCostCalculation === 1) {

                $("#action").val(currentActionId).trigger("change")

                alertify.error("رسید های  انبار متصل به این درخواست خرید ریالی شده اند").delay(alertify_delay);
            }
            else
                returninvoiceprice(model);
        }

        //#endregion

        //#region گام 9  به گام 3

        else if ((currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            if (requestStageAction.isQuantityPurchase)
                returnrequestprice(model);

            else
                // ویرایش گام انجام می شود
                updateStatus(model, () => {
                    $("#action").val(currentActionId).trigger("change")
                });
        }

        //#endregion

        //#region گام3 به گام 2  
        else {
            // ویرایش گام انجام می شود
            updateStatus(model, () => {
                $("#actions").val(currentActionId).trigger("change")
            });
        }

        //#endregion
    }

    //#endregion
}

function checkHeaderBalance(model) {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: model.identityId,
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

function getLastConfirmHeader(model, costofItemOrdered, costofItemInvoiced) {

    var p_url = `/api/pu/PurchaseOrderActionApi/getnolastconfirmheader`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {


            if (result.data.length > 0) {
                showErrorValidtionUpdateStep(result.data);
            }

            else {
                if (costofItemOrdered) {
                    //ریالی کردن برگه سفارش خرید
                    updaterequestprice(model);
                }
                else if (costofItemInvoiced) {
                    // بررسی دسته بندی هایی درخواست برای بهای تمام شده 
                    getpurchaseordercheckisallocatedlist(model);
                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function export_csvLastConfirmHeader() {

    let id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");

    pagetable_formkeyvalue = ["id", id];

    setTimeout(function () {

        if (csvModel == null) {
            csvModel = {
                Filters: [],
                Form_KeyValue: pagetable_formkeyvalue
            }
        }
        viewData_form_title = "لیست صورتحساب های متصل به درخواست جاری";
        let url = `/api/pu/PurchaseOrderActionApi/csv`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                $("#actions").val(currentActionId).trigger("change")
                generateCsv(result);

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }, 500);
}

function getpurchaseordercheckisallocatedlist(model) {
    var p_url = `/api/pu/PurchaseOrderActionApi/purchaseordercheckisallocated`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {

            if (result.data.length > 0)
                showErrorPurchaseOrderCheckisAllocatedList(result.data)
            else
                //محاسبه بهای تمام شده صورتحساب
                updateinvoiceprice(model);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function showErrorPurchaseOrderCheckisAllocatedList(data) {

    $("#action").val(currentActionId).trigger("change")

    $("#temperrorPurchaseOrderCheckisAllocatedList").html("");


    let strtablePurchaseOrderCheckisAllocatedList = ""
    for (var i = 0; i < data.length; i++) {
        strtablePurchaseOrderCheckisAllocatedList += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
        strtablePurchaseOrderCheckisAllocatedList += `<td style="width:50%"><div  type="text" >${data[i].stage}</td>`
        strtablePurchaseOrderCheckisAllocatedList += `<td style="width:50%"><div  type="text" >${data[i].itemCategory}</td>`
        strtablePurchaseOrderCheckisAllocatedList += "</tr>"
    }
    $(`#temperrorPurchaseOrderCheckisAllocatedList`).html(strtablePurchaseOrderCheckisAllocatedList);
    modal_show("errorPurchaseOrderCheckisAllocatedList");
}

function showErrorValidtionUpdateStep(errors) {

    $("#errorUpdateStepResult").removeClass("displaynone");
    $("#tempErrorUpdateStepResultLines").html("");
    if (errors !== null) {
        let strtableLineTheadFields = ""

        for (var i = 0; i < errors.length; i++) {

            strtableLineTheadFields += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
            strtableLineTheadFields += `<td style="width:13%"><div id="header_${i + 1}" type="text" >${errors[i].headerId}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="workflow_${i + 1}" type="text" >${errors[i].workflow}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="stage_${i + 1}" type="text" >${errors[i].stage}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="action_${i + 1}" type="text" >${errors[i].action}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="date_${i + 1}" type="text" >${errors[i].documentDatePersian}</td>`
            strtableLineTheadFields += "</tr>"
        }


        $(`#tempErrorUpdateStepResultLines`).html(strtableLineTheadFields);
        modal_show("errorUpdateStepResult");
        $("#action").val(currentActionId).trigger("change.select2");
        alertify.warning(" صورتحساب های متصل به درخواست جاری را تایید نمایید").delay(alertify_delay);
    }
}

function updaterequestprice(model) {
    var p_url = `/api/pu/PurchaseOrderActionApi/updaterequestprice`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatus(model, () => {
                    $("#action").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function updateinvoiceprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/updateinvoiceprice`;
    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatus(model, () => {
                    $("#action").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function returninvoiceprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/returninvoiceprice`;
    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatus(model, () => {
                    $("#action").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function returnrequestprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/returnrequestprice`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatus(model, () => {
                    $("#action").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function checkIsUnitCostCalculatedPurchaseOrder(model) {

    var url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/checkisunitcostcalculated`;

    var outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model.identityId),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return outPut.responseJSON;
}

function updateStatus(model) {

    if (model.requestActionId > 0) {
        var url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`;

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
        alertify.success(result.statusMessage);
        get_header();
    }
    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }
    configPersonOrderElementPrivilage(`.ins-out`, false);
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

function getPersonOrderFundItemTypeInOut(itemTypeId) {

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
                    additionalData[11].value = result;
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

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

function getCategoryItemName(id, itemTypeId) {

    $('#attributeIds').empty();
    $('#subUnitId').empty();
    $("#categoryItemId").html("");
    let url = `api/WH/ItemApi/getinfo/${id}`;


    let itemId = +id;
    if (itemId > 0) {
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {

                if (result && itemId > 0) {

                    $("#categoryItemId").val(result.categoryIdName);
                    $("#categoryItemId").prop("disabled", true);

                    let itemCategoryId = result.categoryId;
                    additionalData[22].value = +itemCategoryId;

                    unitId = +result.unitId;

                    additionalData[10].value = result.unitId;

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
                    $('#categoryItemId').val();
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }

        });
    }
}

function run_header_line_row_averagePrices(pageId, rowNo, ev) {
    ev.stopPropagation();



    $(`#jsonOrderLineList .pagetablebody tbody tr`).removeClass("highlight");
    $(`#${pageId} tbody tr[id="row${rowNo}"]`).addClass("highlight");

    let lineId = $(`#${pageId} tbody tr[id="row${rowNo}"]`).data('model.id')


    $("#tempAveragePricesRows").html("");
    $.ajax({
        url: viewData_getrecord_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(lineId),
        async: false,
        cache: false,
        success: function (result) {
            if (result.data != null) {
                output = `<tr class="highlight" id="row${rowNo}" onkeydown="tr_onkeydownNew(${pageId},this,event)" >
                            <td>${transformNumbers.toComma(result.data.avgGrossPrice)}</td>
                            <td>${transformNumbers.toComma(result.data.avgDiscountPrice)}</td>
                            <td>${transformNumbers.toComma(result.data.avgNetPrice)}</td>
                            <td>${transformNumbers.toComma(result.data.avgVATPrice)}</td>
                            <td>${transformNumbers.toComma(result.data.avgFinalPrice)}</td>
                         </tr>`;

                $(output).appendTo("#tempAveragePricesRows");
            }

            modal_show(`averagePricesModal`);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function triggerChange(e) {
    if (e === "itemTypeId") {
        $("#itemTypeId").trigger("change")
    }


}

window.Parsley._validatorRegistry.validators.checkcompareamount = undefined;
window.Parsley.addValidator("checkcompareamount", {
    validateString: function (value) {

        var netAmount = +removeSep($("#netAmount").val().replace(/\//g, "."));

        if (netAmount < 0) {

            var amount = $("#grossAmount").val();
            var msg = `مبلغ تخفیف باید از ${amount} کمتر باشد`;
            var obj =
            {
                "en": msg
            }
            var error = JSON.stringify(obj.en);

            window.Parsley.addMessage('en', 'checkcompareamount', error);
            return error === '';
        }

    }
});