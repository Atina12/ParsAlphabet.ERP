

var viewData_form_title = "سفارش  فروش / برگشت",
    viewData_controllername = "SaleOrderLineApi",
    viewData_getHeader_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getheader`,
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/display`,
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyids`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/deleteOrderLine`,
    viewData_getsaleorderlinepagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getsaleorderlinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insertOrderLine`,
    viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`,
    viewData_OrderLine_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getorderlinefilteritems`,

    viewData_updatePersonInvoiceStep_url = `${viewData_baseUrl_SM}/SaleOrderStepApi/updatestep`,
    viewData_getSaleOrderCheckExist = `${viewData_baseUrl_SM}/SaleOrderApi/checkexist`,
    viewData_saleOrderStepList_url = `${viewData_baseUrl_SM}/SaleOrderStepApi/getsaleordersteplist`,
    viewData_updrecord_header_url = `${viewData_baseUrl_SM}/SaleOrderApi/update`,
    viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}SaleOrderOfficial.mrt`,

    viewData_report_url = `/Report/Index`,
    headerModel = {},
    defaultCurrency = getDefaultCurrency(),
    defaultRounding = getRounding(defaultCurrency),
    headerLine_formkeyvalue = [],
    arr_headerLinePagetables = [],
    conditionalProperties = {
        isAfterChange: false,
        isCartable: false,
        isDataEntry: false
    },
    discountprice = 0,
    discountAmount = 0,
    netAmountPlusVAT = 0,
    activePageId = "saleOrderLinePage",
    hasVat = false;

headerLine_formkeyvalue.push($("#saleOrderId").val());
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
    getpagetable_url: viewData_getsaleorderlinepagetable_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_SM}/${viewData_controllername}/updateorderLine`,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: viewData_OrderLine_filter_url,
    pagetable_laststate: ""
};

arr_headerLinePagetables.push(pagelist1);

function call_initFormSaleOrderLine(header_Pagination = 0, elemId = undefined) {

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
        { Item: "StageName", Value: "سفارش فروش", itemType: "Var" },
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

async function callBackHeaderColumnFill() {

    if ((isFormLoaded || header_pgnation > 0)) {

        $(`#${activePageId} #itemTypeId `).empty();

        fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, stageId);
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
    }

}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="saleOrderExcel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="saleOrderList()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '><select style='width: 78%; float: right' class='form-control' id='action'></select><button onclick='update_action()' type='button' class='btn btn-success ml-2 pa waves-effect' value=''>ثبت گام</button></div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    stageId = +$(`#${activePageId} #stageId`).val();
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    headerModel.documentTypeId = +$(`#${activePageId} #formPlateHeaderTBody`).data("documenttypeid");
    headerModel.documentTypeName = $(`#${activePageId} #formPlateHeaderTBody`).data("documenttypename");
    headerModel.accountDetailId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailid");
    headerModel.returnReasonId = $(`#${activePageId} #formPlateHeaderTBody`).data("returnreasonid");
    headerModel.accountDetailVatEnable = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatinclude");
    headerModel.accountDetailVatInclude = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailvatenable");
    var accountDetailId = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailid");

    headerModel.accountDetailId = accountDetailId;

    additionalData = [
        { name: "headerId", value: id },
        { name: "stageId", value: stageId },
        { name: "branchId", value: branchId },
        { name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() },
        { name: "headerAccountDetailId", value: +headerModel.accountDetailId },
        { name: "vatId", value: 0 },
        { name: "vatAccountDetailId", value: 0 },
        { name: "vatNoSeriesId", value: 0 },
        { name: "unitId", value: 0 },
        { name: "ratio", value: 1 },
        { name: "idSubUnit", value: 0 },
        { name: "inOut", value: 0 },
        { name: "discountAmount", value: 0 },
    ];

    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;


    $("#note").suggestBox({
        api: `${viewData_baseUrl_SM}/SaleDescriptionApi/search`,
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
    var row1 = $("#saleOrderLinePage #row1");
    if ($("#saleOrderLinePage #row1").length > 0) {
        trOnclick("jsonOrderLineList", row1, null);
    }
    else {
        configAfterChange();
    }
    firstLineLoaded = true;

    $(`#${activePageId} #action`).empty();
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "action", true, `${stageId}/1`);
    $(`#${activePageId} #action`).val(+$("#formPlateHeaderTBody").data("actionid")).trigger("change");

    $("#filter_itemType").data("api", `/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}`);


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

function saleOrderExcel() {

    let url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;
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

function checkEditOrDeletePermission() {
    return true;
}

function configAfterChange() {
    setTimeout(function () {
        if (!conditionalProperties.isAfterChange) {
            configSaleOrderElementPrivilage(".ins-out", isAfterSave);
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
    configSaleOrderElementPrivilage(`.ins-out`, true);
}

function click_link_header(elm) {
    if ($(elm).data().id == "saleOrderId")
        navigation_item_click(`/SM/SaleOrderLine/${+$(elm).text()}/${+$(`#saleOrderLinePage #isDefaultCurrency`).val()}`);
    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#purchaseOrderLinePage #isDefaultCurrency`).val()}`);
}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configSaleOrderElementPrivilage(containerId, privilageType = null) {

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
                configSaleOrderElementPrivilage(".ins-out", false);

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

configLineElementPrivilage = configSaleOrderElementPrivilage;

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
        configSaleOrderElementPrivilage(".ins-out", false);


    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configSaleOrderElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configSaleOrderElementPrivilage(".ins-out", false);
    }
});

call_initFormSaleOrderLine();

call_initform = call_initFormSaleOrderLine;


function saleOrderList() {

    if (!conditionalProperties.isCartable)
        navigation_item_click('/SM/SaleOrder', 'سفارش فروش / برگشت');
    else
        navigation_item_click(`/SM/SaleOrdersCartable/${stageId}`, 'کارتابل مالی سفارش فروش');

}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistSaleOrderLineId(+elm.val());
        if (checkExist)
            navigation_item_click(`/SM/SaleOrderLine/${+elm.val()}/${+$(`#saleOrderLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("شناسه درخواست در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistSaleOrderLineId(id) {

    let outPut = $.ajax({
        url: viewData_getSaleOrderCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getSaleOrderCheckExist);
        }
    });
    return outPut.responseJSON;

}

function after_showHeaderModal() {

    var saleOrderId = additionalData[0].value;
    IsShowNoSeriesSaleOrder(saleOrderId);
    $(`#documentTypeId`).val(headerModel.documentTypeId == 0 ? "" : headerModel.documentTypeName);
    $(`#documentTypeId`).data("value", headerModel.documentTypeId);
    $("#accountDetailId").empty();

    var stageId = +$(`#${activePageId} #formPlateHeaderTBody`).data("stageid")
    var branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid")
    var noSeriesId = +$(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid")
    fill_select2(`/api/GN/NoSeriesLineApi/noserieslistnextstage`, "noSeriesId", true, `${+stageId}/${+branchId}`);


    $("#noSeriesId").val(noSeriesId).trigger("change")

    getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
    $("#accountDetailId").val(headerModel.accountDetailId).trigger("change");

    $("#returnReasonId").empty();
    fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
    $("#returnReasonId").val(headerModel.returnReasonId).trigger("change");

    if (stageId === 3 || stageId === 4)
        $("#returnReasonId").parents(".form-group").addClass("displaynone");
    else
        $("#returnReasonId").parents(".form-group").removeClass("displaynone");

    configSaleOrderElementPrivilage(".ins-out", false);

}

async function IsShowNoSeriesSaleOrder(saleOrderId) {
    var url = `api/SM/SaleOrderLineApi/getsaleorderLineQuantity/${saleOrderId}`;
    await $.ajax({
        url: url,
        type: "get",
        contentType: "application/json",
        success: function (result) {
            if (result) {
                $("#noSeriesId").prop('disabled', true)
                $("#accountDetailId").prop('disabled', true)
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
            return null;
        }
    });


}

function object_onfocus(elem) {
    elem.select();
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
                getSaleOrderFundItemTypeInOut(+id);
            }

            break;
        case "itemId":

            if (elem.val() > 0) {
                clearColumns();

                // headerModel.accountDetailVatInclude =false   اجازه ثبت سطر دارد
                // headerModel.accountDetailVatInclude =true && headerModel.accountDetailVatEnable =false   اجازه ثبت سطر ندارد
                if (!headerModel.accountDetailVatInclude && headerModel.accountDetailVatEnable) {
                    alertify.error(`لطفا تنظیمات اعتبار مالیات را برای تامین کننده  ${headerModel.accountDetailName} تعریف نمایید. `);
                    return;
                }
                else {
                    get_itemVat(elem.val());
                }

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
            calc_grossAmount();
            calc_discountAmount();
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
                    $("#discountValue").attr("data-parsley-max", 99);
                    $("#discountValue").attr("maxlength", 3);
                }
                else {

                    $("#discountValue").attr("data-parsley-min", 1);
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

function run_header_line_row_editSaleOrder(pageId, rowNo, ev) {

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
        url: "/api/SM/SaleOrderLineApi/getrecordbyids",
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

                if (data.currencyId > 0) {
                    $("#currencyId").val(data.currencyId).trigger("change.select2");
                    $("#exchangeRate").val(data.exchangeRate)
                }
                $("#categoryItemId").val(data.categoryItemName);
                $("#quantity").val(data.quantity);
                $("#price").val(transformNumbers.toComma(data.price));
                $("#grossAmount").val(transformNumbers.toComma(data.grossAmount));
                $("#discountType").val(data.discountType).trigger("change");
                $("#discountValue").val(transformNumbers.toComma(data.discountValue));
                $("#netAmount").val(transformNumbers.toComma(data.netAmount));
                $("#vatAmount").val(transformNumbers.toComma(data.vatAmount));
                $("#netAmountPlusVAT").val(transformNumbers.toComma(data.netAmountPlusVAT));
                if (result.data.priceIncludingVAT)
                    $("#priceIncludingVAT").prop("checked", true);

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
    $("#price").val("");
    $("#quantity").val(0);
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#netAmountPlusVAT").val(0);
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

            if (result.data != undefined || result.data != null) {
                if (checkResponse(result.data.vatEnable) && result.data.vatEnable && result.data.vatPer == 0) {
                    alertify.error(`لطفا درصد مالیات را برای آیتم ${result.data.itemName} تعریف نمایید. `);
                    return;

                }
                else {
                    $(".ins-out").data("model.vatper", result.data.vatPer);
                    additionalData[5].value = result.data.vatId;
                    additionalData[6].value = result.data.accountDetailId;
                    additionalData[7].value = result.data.noSeriesId;
                }

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
    let totalQuantity = +removeSep($("#quantity").val().replace(/\//g, "."));
    $('#totalQuantity').val(totalQuantity);
    additionalData[9].value = 1;
    additionalData[10].value = 0;
    if (subUnitId > 0) {

        if (+$("#itemTypeId").val() == 1 && checkResponse(subUnitId) != NaN && subUnitId != unitId && subUnitId != null) {

            $.ajax({
                url: `api/WH/ItemUnitApi/getratio/${subUnitId}`,
                type: "get",
                contentType: "application/json",
                success: function (result) {
                    if (checkResponse(result)) {
                        ratio = result.ratio;
                        totalQuantity = +$('#quantity').val() * ratio;
                        $('#totalQuantity').val(totalQuantity);
                        additionalData[9].value = ratio;
                        additionalData[10].value = result.subUnitId;

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

        let grossprice = (+removeSep($("#price").val()));
        var exchangeRate = +$("#isDefaultCurrency").val() ? 1 : +removeSep($("#exchangeRate").val());
        let quantity = +removeSep($("#totalQuantity").val().replace(/\//g, "."));
        var grossAmount = quantity * +grossprice * exchangeRate;
        $("#grossAmount").val(transformNumbers.toComma(grossAmount.toFixed(defaultRounding)));
    }
}


function calc_discountAmount() {
    var netAmount = 0;
    var grossAmount = +removeSep($("#grossAmount").val());
    if (grossAmount > 0) {
        if (+$("#discountType").val() == 0) {
            netAmount = grossAmount;
            additionalData[12].value = 0;
        }
        //تخفیف به صورت درصد باشد
        else if (+$("#discountType").val() == 1) {
            discountprice = (+$("#discountValue").val() > 0 ? (+$("#discountValue").val()) : 0);
            discountAmount = grossAmount * (discountprice / 100);
            netAmount = grossAmount - discountAmount;
            $("#netAmount").val(transformNumbers.toComma(netAmount.toFixed(defaultRounding)));
            additionalData[12].value = discountAmount;
        }
        //تخفیف بصورت مبلغ
        else {

            discountprice = (+removeSep($("#discountValue").val()) > 0 ? (+removeSep($("#discountValue").val())) : 0);
            netAmount = grossAmount - discountprice;
            $("#netAmount").val(transformNumbers.toComma(netAmount.toFixed(defaultRounding)));
            additionalData[12].value = discountprice;

        }
        var vatper = 0;
        if (checkResponse(headerModel.accountDetailId) > 0) {
            get_enableVat(headerModel.accountDetailId);
            if (hasVat)//در صورتی که کد تفضیل مشمول مالیات بر ارزش افزوده باشد
            {
                get_itemVat($("#itemId").val());
                vatper = +$(".ins-out").data("model.vatper");
            }
        }

        if (checkResponse(vatper) && !isNaN(vatper) && vatper != 0) {
            $("#vatPer").val(vatper);
            $("#vatAmount").val(transformNumbers.toComma(((vatper / 100) * netAmount).toFixed(defaultRounding)));
            netAmountPlusVAT = +removeSep($("#vatAmount").val()) + netAmount;
            $("#netAmountPlusVAT").val(transformNumbers.toComma(netAmountPlusVAT.toFixed(defaultRounding)));

        }
        else {
            $("#vatPer").val(0);
            $("#vatAmount").val(0);
            $("#netAmountPlusVAT").val(0);
        }

    }

}

function update_action() {

    var currentActionId = +$("#formPlateHeaderTBody").data("actionid");
    var requestedActionId = +$("#action").val();

    if (currentActionId == requestedActionId)
        return;

    var model = {
        requestActionId: +$(`#${activePageId} #action`).val(),
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: stageId
    }

    updateStatus(model);
}

function updateStatus(model) {
    if (model.requestActionId > 0) {
        $.ajax({
            url: viewData_updateSaleOrderStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                afterUpdateStatus(result);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateSaleOrderStep_url);
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
    configSaleOrderElementPrivilage(`.ins-out`, false);
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

    $.ajax({
        url: viewData_saleOrderStepList_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$(`#${activePageId} #formPlateHeaderTBody`).data("id")),
        success: function (result) {
            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.stepDateTimePersian}</td></tr>`;
                $("#stepLogRows").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_saleOrderStepList_url);
        }
    });
}

function getSaleOrderFundItemTypeInOut(itemTypeId) {

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

function getCategoryItemName(id, itemTypeId) {

    $('#attributeIds').empty();
    $('#subUnitId').empty();
    $("#categoryItemId").val("");
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
                    $('#categoryItemId').val(result.categoryIdName);
                    $("#categoryItemId").prop("disabled", true);
                    let itemCategoryId = result.categoryId;
                    unitId = result.unitId;
                    additionalData[8].value = +unitId;

                    fill_select2(`/api/WH/ItemUnitApi/unititem_getdropdown`, "subUnitId", true, `${unitId}/${itemId}`);
                    if (itemTypeId == 1) {
                        fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "attributeIds", true, itemCategoryId);

                        $("#subUnitId").val(result.unitId).trigger("change");
                        ($('#attributeIds')[0].length == 0) ? $("#attributeIds").attr("disabled", true) : $("#attributeIds").attr("disabled", false);
                        ($('#subUnitId')[0].length == 0) ? $("#subUnitId").attr("disabled", true) : $("#subUnitId").attr("disabled", false);
                    }


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

function triggerChange(e) {
    if (e === "itemTypeId") {
        $("#itemTypeId").trigger("change")
    }


}


window.Parsley._validatorRegistry.validators.checkcompareamount = undefined;
window.Parsley.addValidator("checkcompareamount", {
    validateString: function (value) {
       
        var netAmount = +removeSep($("#netAmount").val().replace(/\//g, "."));
       
        if (netAmount < 0 ) {
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




