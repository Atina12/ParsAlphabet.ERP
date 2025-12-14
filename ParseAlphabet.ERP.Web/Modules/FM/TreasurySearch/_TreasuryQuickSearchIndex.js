var viewData_controllername = "TreasurySearchApi",
    viewData_form_title = "جستجوی سریع", modelSearchDetail2 = {},
    viewData_requestFundTypes_url = `/api/FMApi/fundtype_getdropdown`,
    viewData_requestBank_url = `/api/FM/BankApi/getdropdownhasaccount`,
    viewData_getpagetable_QuickSearch_url = `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasuryquicksearch`,
    viewData_getpagetable_QuickSearchType_url = `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasuryquicksearchtype`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    element = $('#boxQuickSearch #parentPageTableBody'),
    addResizer = document.getElementById("quickSearchPageTable");
var resizer = document.createElement('div');
var lastpagetable_formkeyvalue = []

function initForm() {

    fill_select2(viewData_requestFundTypes_url, "fundTypeId", true, "treasurysearch", false);
    fill_select2(viewData_requestBank_url, "bankId", true, 0, false);
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

$("#searchTreasury").on("click", function () {
    let from = $("#TreasuryQuickSearchContainer").parsley();
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
        fundTypeId: +$("#fundTypeId").val() == 0 ? null : +$("#fundTypeId").val(),
        bankId: +$("#bankId").val() == 0 ? null : +$("#bankId").val(),
        serial: +$("#serial").val() == 0 ? null : +$("#serial").val(),
        fromPrice: +$("#fromPrice").val() == 0 ? null : +removeSep($("#fromPrice").val()),
        toPrice: +$("#toPrice").val() == 0 ? null : +removeSep($("#toPrice").val()),
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
    };
}

function run_button_selection(documentNo, bondSerialNo, bankId, rowNo, elm) {
    getQuickSearchType(documentNo, bondSerialNo, bankId, "selection");
}

function run_button_displayTreasury(id, requestId, stageId, stageClassId, workflowId) {

    if (stageClassId == "1") {
        navigateToModalTreasuryRequest(`/FM/TreasuryRequestLine/display/${id}/0/${stageId}/${workflowId}`);
    }
    else {
        navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/0/${stageId}/${workflowId}`);
    }
}

function navigateToModalTreasury(href) {
    initialPage();
    $("#contentdisplayTreasuryLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryLine #loader").removeClass("displaynone");

    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayTreasuryLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayTreasuryLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
    $("#contentdisplayTreasuryLine .itemLink").css("pointer-events", " none");
}

function navigateToModalTreasuryRequest(href) {

    initialPage();
    $("#contentdisplayTreasuryRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #loader").removeClass("displaynone");
    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayTreasuryRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayTreasuryRequestLine #loader,#contentdisplayTreasuryRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine #form,#contentdisplayTreasuryRequestLine .content").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine .itemLink").css("pointer-events", " none");
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

        let documentNo = $(elm).data("documentno");
        let bondSerialNo = $(elm).data("bondserialno");
        let bankId = $(elm).data("bankid");
        getQuickSearchType(documentNo, bondSerialNo, bankId, "tr_onclick");
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
            arr_pagetables[index].currentrow = pagetable_currentrow;
            arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
            if (pg_name == "quickSearchPageTable" && ev.target.tagName == "TR") {
                let documentNo = $(elm).data("documentno");
                let bondSerialNo = $(elm).data("bondserialno");
                let bankId = $(elm).data("bankid");
                getQuickSearchType(documentNo, bondSerialNo, bankId, "tr_onkeydown");
            }
        }
    }

    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);

}

function getQuickSearchType(documentNo, bondSerialNo, bankId, fromTg) {
    //searchTreasury
    modelSearchDetail2 = {
        documentNo: documentNo,
        bondSerialNo: bondSerialNo,
        bankId: bankId
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


