var viewData_controllername = "WarehouseTransactionSearchApi",
    viewData_form_title = "جستجوی سریع",
    modelSearchDetail2 = {},
    viewData_getpagetable_QuickSearch_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getwarehousetransactionquicksearch`,
    viewData_getpagetable_QuickSearchType_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getwarehousetransactionquicksearchtype`,
    element = $('#boxQuickSearch #parentPageTableBody'),
    addResizer = document.getElementById("quickSearchPageTable");
var resizer = document.createElement('div');
var lastpagetable_formkeyvalue = [];

function initForm() {

    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getalldatadropdown/null`, "warehouseId", true, 0, false, 0, 'انتخاب کنید');
    fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, 0, false, 0, 'انتخاب کنید');
    fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, 0, false, 0, 'انتخاب کنید');
    fill_select2(`/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "itemTypeId", true, `null/11`, false);
    fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "atrributeId", true, null, false);


    if ($("#atrributeId option").length == 0)
        $("#atrributeId").prop("disabled", true);
    else
        $("#atrributeId").prop("disabled", false);


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

$("#searchWarehouseTransaction").on("click", function () {

    let from = $("#WarehouseTransactionQuickSearchContainer").parsley();
    let validate = from.validate();
    if (!validate)
        return;

    modelSearchDetail2 = {};
    $("#quickSearchTypePageTable .table").text('')
    get_NewPageTable("quickSearchPageTable");
});

$("#warehouseId").change(function () {

    $("#zoneId").empty();
    $("#binId").empty();
    $("#zoneId").html("<option value=\"0\">انتخاب کنید</option>");
    $("#binId").html("<option value=\"0\">انتخاب کنید</option>");
    let warehouseId = +$(this).val();
    if (warehouseId > 0) {
        fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneId", true, `${warehouseId.toString()}`, false, 0, 'انتخاب کنید');
        fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/null`, false, 0, 'انتخاب کنید');
    }


    else {
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, 0, false, 0, 'انتخاب کنید');
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, 0, false, 0, 'انتخاب کنید');
    }
});

$("#zoneId").change(function () {

    let zoneId = +$(this).val();
    let warehouseId = +$("#warehouseId").val();
    $("#binId").empty();
    $("#binId").html("<option value=\"0\">انتخاب کنید</option>");
    if (warehouseId > 0) {
        if (zoneId > 0)
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/${zoneId.toString()}`, false, 0, 'انتخاب کنید');
        else
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/null`, false, 0, 'انتخاب کنید');
    }
    else
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, 0, false, 0, 'انتخاب کنید');

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
        warehouseId: +$("#warehouseId").val() == 0 ? null : +removeSep($("#warehouseId").val()),
        zoneId: +$("#zoneId").val() == 0 ? null : +removeSep($("#zoneId").val()),
        binId: +$("#binId").val() == 0 ? null : +removeSep($("#binId").val()),
        atrributeId: +$("#atrributeId").val() == 0 ? null : $("#atrributeId").val(),
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
    };
}

function run_button_selection(stageId, warehouseId, zoneId, binId, rowNo, elm) {
    getQuickSearchType(stageId, warehouseId, zoneId, binId);
}

function run_button_displayWarehouse(id, requestId, stageId, stageClassId, workflowId) {

    if (stageClassId == "1") {

        navigateToModalItemRequest(`/WH/ItemRequestLine/display/${id}/1/${stageId}/${workflowId}`);
    }
    else {
        navigateToModalItemTransaction(`/WH/ItemTransactionLine/display/${id}/1/${stageId}/${workflowId}/0`);
    }

}

function navigateToModalItemRequest(href) {
    $(`#contentdisplayItemRequestLine`).html("");
    initialPage();
    $("#contentdisplayItemRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayItemRequestLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayItemRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemRequestLine #loader,#contentdisplayItemRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemRequestLine #form,#contentdisplayItemRequestLine .content").css("margin", 0);
    $("#contentdisplayItemRequestLine .itemLink").css("pointer-events", " none");
}

function navigateToModalItemTransaction(href) {
    $(`#contentdisplayItemTransactionLine`).html("");
    initialPage();
    $("#contentdisplayItemTransactionLine #content-page").addClass("displaynone");
    $("#contentdisplayItemTransactionLine #loader").removeClass("displaynone");
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

            $(`#contentdisplayItemTransactionLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemTransactionLine #loader,#contentdisplayItemTransactionLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemTransactionLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemTransactionLine #form,#contentdisplayItemTransactionLine .content").css("margin", 0);
    $("#contentdisplayItemTransactionLine .itemLink").css("pointer-events", " none");
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

        var stageId = +$(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("stageid");
        var warehouseId = +$(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("warehouseid");
        var zoneId = +$(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("zoneid");
        var binId = +$(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("binid");
        getQuickSearchType(stageId, warehouseId, zoneId, binId);
    }
}

function tr_onkeydownNew(pg_name, elm, ev) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(ev.which) == -1)
        return;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);

    if (index == -1)
        return;

    var pagetable_currentrow = arr_pagetables[index].currentrow;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        var newRowNo = pagetable_currentrow - 1;

        if (newRowNo === 0)
            newRowNo = 1;

        if ($(`#${pg_name} .pagetablebody > tbody > #row${newRowNo}`)[0] !== undefined) {
            pagetable_currentrow = newRowNo;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {

        ev.preventDefault();

        if (document.activeElement.className.indexOf("select2") >= 0)
            return;

        var newRowNo = pagetable_currentrow + 1;

        if ($(`#${pg_name} .pagetablebody > tbody > #row${newRowNo}`)[0] === undefined)
            newRowNo = pagetable_currentrow;


        if ($(`#${pg_name} .pagetablebody > tbody > #row${newRowNo}`)[0] !== undefined) {

            pagetable_currentrow = newRowNo;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }
    }
    else if (ev.which === KeyCode.Enter) {

        ev.preventDefault();
        if (document.activeElement.className.indexOf("select2") >= 0) return;

        if ($(`#${pg_name} .pagetablebody > tbody > #row${pagetable_currentrow}`)[0] !== undefined) {

            if (pg_name == "quickSearchPageTable" && ev.target.tagName == "TR") {

                var stageId = $(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("stageid");
                var warehouseId = $(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("warehouseid");
                var zoneId = $(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("zoneid");
                var binId = $(`#${pg_name} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).data("binid");
                getQuickSearchType(stageId, warehouseId, zoneId, binId);
            }
        }
    }


    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
}

function getQuickSearchType(stageId, warehouseId, zoneId, binId) {

    modelSearchDetail2 = {
        fromDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
        stageId: +stageId,
        warehouseId: warehouseId == "null" ? null : +warehouseId,
        zoneId: +zoneId == 0 ? null : +zoneId,
        binId: +binId == 0 ? null : +binId
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


