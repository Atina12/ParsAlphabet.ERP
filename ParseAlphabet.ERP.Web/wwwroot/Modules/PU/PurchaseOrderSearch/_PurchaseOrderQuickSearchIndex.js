var viewData_controllername = "PurchaseOrderSearchApi",
    viewData_form_title = "جستجوی سریع",
    modelSearchDetail2 = {},
    viewData_getpagetable_QuickSearch_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpurchasepersonquicksearch`,
    viewData_getpagetable_QuickSearchType_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpurchasepersonquicksearchtype`,
    element = $('#boxQuickSearch #parentPageTableBody'),
    addResizer = document.getElementById("quickSearchPageTable");
var resizer = document.createElement('div');
var lastpagetable_formkeyvalue = [];

function initForm() {
    //$('#quickSearchTypePageTable #footerPageing').css('display', 'none')
    fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/null/1`, "itemTypeId", false);
    let pagetable = {};
    pagetable = {
        pagetable_id: "quickSearchPageTable",
        editable: false,
        pagerowscount: 15,
        currentpage: 1,
        endData: false,
        pageNo: 0,
        lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        headerType: "outline",
        selectedItems: [],
        getpagetable_url: viewData_getpagetable_QuickSearch_url,
    };
    arr_pagetables.push(pagetable);

    pagetable = {
        pagetable_id: "quickSearchTypePageTable",
        editable: false,
        pagerowscount: 15,
        currentpage: 1,
        endData: false,
        pageNo: 0,
        lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        headerType: "outline",
        selectedItems: [],
        getpagetable_url: viewData_getpagetable_QuickSearchType_url,
    };
    arr_pagetables.push(pagetable);


    $("#fromDate").inputmask();
    kamaDatepicker('fromDate', { withTime: false, position: "bottom" });
    $("#toDate").inputmask();
    kamaDatepicker('toDate', { withTime: false, position: "bottom" });

}

$("#searchPurchasePerson").on("click", function () {

    let from = $("#PurchasePersonQuickSearchContainer").parsley();
    let validate = from.validate();
    if (!validate)
        return;

    modelSearchDetail2 = {};
    $("#quickSearchTypePageTable .table").text('')
    get_NewPageTable("quickSearchPageTable");
});

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {
    
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

    pageViewModel = quickSearchParameter(pg_id);

    if (pg_id == "quickSearchPageTable") {
        pageViewModel.pageno = pagetable_pageNo;
        pageViewModel.pagerowscount = pagetable_pagerowscount;
        pageViewModel.form_KeyValue = [0];
        pageViewModel.sortModel = {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        };

        pageViewModel.form_KeyValue = pagetable_formkeyvalue;
    }
    else {
        pageViewModel.pageno = pagetable_pageNo;
        pageViewModel.pagerowscount = pagetable_pagerowscount;
    }


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
        success: function (result) {

            if (pagetable_currentpage == 1)
                fillOption(result, pg_id);

            //if (pg_id == 'quickSearchTypePageTable') {
            //    $('#quickSearchTypePageTable #footerPageing').css('display', 'none')
            //}
            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);

            if (pagetable_currentpage == 1)
                createFooter(pg_id, result, pageViewModel);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });
}

function fillOption(result, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].endData = false;

    if (typeof csvModel !== "undefined") csvModel = null;

    handlerInsert(pg_id);
    createPageCounters(pg_id);
    fill_FilterPageTable(result.columns, pg_id);
}

async function createFooter(pg_id, data, pageViewModel) {

    let sumDynamic = data.columns.sumDynamic;

    if (sumDynamic) {
        let getSumApi = data.columns.getSumApi;
        let dataColumns = data.columns.dataColumns;
        let resultSum = getDataSum(getSumApi, pageViewModel);
        let columnsLn = dataColumns.length;
        let value = {};

        let str = `<tfoot class="table-summarybody-fixed"><tr>`;
        for (var i = 0; i < columnsLn; i++) {
            value = dataColumns[i];
            if (value.isDtParameter) {
                if (value.hasSumValue) {
                    str += `<td class="font-12 font-weight-bold col-width-percent-5 sum-border">${resultSum[value.id] > 0 ? transformNumbers.toComma(resultSum[value.id]) : `(${transformNumbers.toComma(Math.abs(resultSum[value.id]))})`}</td>`;
                }
                else {

                    if (i == 0)
                        str += `<td class="summary-title" id="">جمع</td>`;
                    else
                        str += `<td></td>`;

                }
            }

        }
        str += `</tr></tfoot>`;
        $(`#${pg_id} .pagetablebody`).append(str);
    }
}

function getDataSum(api, parameters) {
    let outPut = $.ajax({
        url: api,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(parameters),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, api);
        }
    });
    return outPut.responseJSON;
}

function quickSearchParameter(pg_name) {

    if (pg_name === "quickSearchTypePageTable")
        return modelSearchDetail2;

    return {
        itemTypeId: +$("#itemTypeId").val() == 0 ? null : +$("#itemTypeId").val(),
        fromPrice: +$("#fromPrice").val() == 0 ? null : +removeSep($("#fromPrice").val()),
        toPrice: +$("#toPrice").val() == 0 ? null : +removeSep($("#toPrice").val()),
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
    };
}

function run_button_selection(id, rowNo, elm) {
    getQuickSearchType(id, "selection");
}

function run_button_displayPurchase(id, requestId, stageId, stageClassId, workflowId) {

    if (stageClassId == "1") {

        navigateToModalPurchaseOredr(`/PU/PurchaseOrderLine/display/${id}/1/${stageId}/${workflowId}`);
    }
    else {
        navigateToModalPurchaseInvoice(`/PU/PurchaseInvoiceLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`);
    }

}

function navigateToModalPurchaseOredr(href) {
    $(`#contentdisplayPurchasePersonOrderLine`).html("");
    initialPage();
    $("#contentdisplayPurchasePersonOrderLine #content-page").addClass("displaynone");
    $("#contentdisplayPurchasePersonOrderLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayPurchasePersonOrderLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayPurchasePersonOrderLine #loader,#contentdisplayPurchasePersonOrderLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayPurchasePersonOrderLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayPurchasePersonOrderLine #form,#contentdisplayPurchasePersonOrderLine .content").css("margin", 0);
    $("#contentdisplayPurchasePersonOrderLine .itemLink").css("pointer-events", " none");
}

function navigateToModalPurchaseInvoice(href) {
    $(`#contentdisplayPurchasePersonInvoiceLine`).html("");
    initialPage();
    $("#contentdisplayPurchasePersonInvoiceLine #content-page").addClass("displaynone");
    $("#contentdisplayPurchasePersonInvoiceLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayPurchasePersonInvoiceLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayPurchasePersonInvoiceLine #loader,#contentdisplayPurchasePersonInvoiceLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayPurchasePersonInvoiceLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayPurchasePersonInvoiceLine #form,#contentdisplayPurchasePersonInvoiceLine .content").css("margin", 0);
    $("#contentdisplayPurchasePersonInvoiceLine .itemLink").css("pointer-events", " none");
}

function tr_onclick(pg_name, elm, event) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;

    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow)
        return;

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);

    if (pg_name == "quickSearchPageTable" && event.target.tagName == "TD") {
        let id = $(elm).data("id");
        getQuickSearchType(id, "tr_onclick");
    }
}

function tr_onkeydownNew(pg_name, elm, ev) {
    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;
 
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pg_name} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            pagetable_currentrow--;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {

        ev.preventDefault();
        if (document.activeElement.className.indexOf("select2") >= 0) return;

        if ($(`#${pg_name} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {
            pagetable_currentrow++;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }
    }
    else if (ev.which === KeyCode.Enter) {

        ev.preventDefault();
        if (document.activeElement.className.indexOf("select2") >= 0) return;

        if ($(`#${pg_name} .pagetablebody > tbody > #row${pagetable_currentrow}`)[0] !== undefined) {

            if (pg_name == "quickSearchPageTable" && ev.target.tagName == "TR") {
                let id = $(elm).data("id");
                getQuickSearchType(id, "tr_onkeydown");
            }
        }
    }

    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
}

function getQuickSearchType(id, fromTg) {

    modelSearchDetail2 = {
        id: id
    }

    get_NewPageTable("quickSearchTypePageTable");
}
//#region Resizer
resizer.className = 'resizer';
addResizer.appendChild(resizer);
resizer.addEventListener('mousedown', initResize, false);

function initResize(e) {
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
}

function resize(e) {
    element.attr("style", `height:${(e.clientY - element.offset().top)}px!important`);
}

function stopResize(e) {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
}

$(".form-control").on("focus", function () {
    selectText($(this));
});
//#endregion

initForm();


