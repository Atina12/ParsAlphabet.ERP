
var viewData_getpagetableDisplay_url = `${viewData_baseUrl_FM}/JournalLineApi/getpage`,
    viewData_getJournalCheckExist = `${viewData_baseUrl_FM}/JournalApi/checkexist`,
    activePageIdDisplay = "JournalLineDisplayPage", lastPageHeaderDisplayloaded = 0, form_KeyValueDisplay = [], currentDisplayId = 0,
    pagetable_formkeyvalue = [],
    display_PageRowsCount = 15;

if (typeof arr_pagetables === 'undefined') {
    var arr_pagetables = []
}

function initDisplayJournalFrom(headerPagination = 0, id = 0) {

    pagetable_formkeyvalue[0] = id == 0 ? $(`#${activePageIdDisplay} #journalId`).val() : id;
    pagetable_formkeyvalue[1] = $(`#${activePageIdDisplay} #fromType`).val();
    pagetable_formkeyvalue[2] = "0";
    pagetable_formkeyvalue[3] = headerPagination;

    let pagetable = {};

    let index1 = arr_pagetables.findIndex(v => v.pagetable_id == "headerDisplay_pagetable");

    if (index1 == -1) {
        pagetable = {
            pagetable_id: "headerDisplay_pagetable",
            editable: false,
            pagerowscount: Number.MAX_SAFE_INTEGER,
            currentpage: 1,
            endData: false,
            pageNo: 0,
            lastPageloaded: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            filteritem: "",
            filtervalue: "",
            headerType: "outline",
            selectedItems: [],
            getpagetable_url: viewData_getpagetableDisplay_url

        };
        arr_pagetables.push(pagetable);
    } else {
        arr_pagetables[index1].pagetable_id = "headerDisplay_pagetable"
        arr_pagetables[index1].editable = false
        arr_pagetables[index1].pagerowscount = Number.MAX_SAFE_INTEGER
        arr_pagetables[index1].currentpage = 1
        arr_pagetables[index1].endData = false
        arr_pagetables[index1].pageNo = 0
        arr_pagetables[index1].lastPageloaded = 1
        arr_pagetables[index1].currentrow = 1
        arr_pagetables[index1].currentcol = 0
        arr_pagetables[index1].highlightrowid = 0
        arr_pagetables[index1].trediting = false
        arr_pagetables[index1].filteritem = ""
        arr_pagetables[index1].filtervalue = ""
        arr_pagetables[index1].headerType = "outline"
        arr_pagetables[index1].selectedItems = []
        arr_pagetables[index1].getpagetable_url = viewData_getpagetableDisplay_url
    }


    let index2 = arr_pagetables.findIndex(v => v.pagetable_id == "lineDisplay_pagetable");

    if (index2 == -1) {
        pagetable = {
            pagetable_id: "lineDisplay_pagetable",
            editable: false,
            pagerowscount: 15,
            currentpage: 1,
            endData: false,
            pageno: 0,
            lastPageloaded: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            isSum: true,
            filteritem: "",
            filtervalue: "",
            headerType: "outline",
            selectedItems: [],
            getpagetable_url: `${viewData_baseUrl_FM}/JournalLineApi/getjournallinepage`,
            getsum_url: `${viewData_baseUrl_FM}/JournalLineApi/journallinesum`
        };

        arr_pagetables.push(pagetable);
    } else {
        arr_pagetables[index2].pagetable_id = "lineDisplay_pagetable"
        arr_pagetables[index2].editable = false
        arr_pagetables[index2].pagerowscount = 15
        arr_pagetables[index2].currentpage = 1
        arr_pagetables[index2].endData = false
        arr_pagetables[index2].pageno = 0
        arr_pagetables[index2].lastPageloaded = 1
        arr_pagetables[index2].currentrow = 1
        arr_pagetables[index2].currentcol = 0
        arr_pagetables[index2].highlightrowid = 0
        arr_pagetables[index2].trediting = false
        arr_pagetables[index2].isSum = true
        arr_pagetables[index2].filteritem = ""
        arr_pagetables[index2].filtervalue = ""
        arr_pagetables[index2].headerType = "outline"
        arr_pagetables[index2].selectedItems = []
        arr_pagetables[index2].getpagetable_url = `${viewData_baseUrl_FM}/JournalLineApi/getjournallinepage`
        arr_pagetables[index2].getsum_url = `${viewData_baseUrl_FM}/JournalLineApi/journallinesum`
    }

    get_DisplayPageTable("headerDisplay_pagetable", () => {
        modal_show("displayJournalLineModel");
        reset_toParentForm();
    });
}

function display_pagination_display(opr) {
    var elemId = +$("#JournalLineDisplayPage #headerDisplay_pagetable #col_1_1").text();
    display_paginationAsync_display(opr, elemId);
}

async function display_paginationAsync_display(opr, elemId) {
    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }

    initDisplayJournalFrom(headerPagination, elemId)
}

function checkExistJournalLineId(id) {

    let outPut = $.ajax({
        url: viewData_getJournalCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getJournalCheckExist);
        }
    });
    return outPut.responseJSON;

}

function headerindexChoose_display(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistJournalLineId(+elm.val());
        if (checkExist) {
            initDisplayJournalFrom(0, +elm.val());
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }

}

function reset_toParentForm() {

    if (typeof lastpagetable_formkeyvalue !== "undefined") {
        pagetable_formkeyvalue = [...lastpagetable_formkeyvalue];
    }

}

function getPagetable_HeaderLineDisplay(callBack = undefined, isInsert = false) {
    let pg_id = "lineDisplay_pagetable";

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    if (!isInsert) {
        arr_pagetables[index].currentpage = 1;
        arr_pagetables[index].pageno = 0;
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].endData = false;
    }

    let pagetable_pageno = arr_pagetables[index].pageno;
    let pagetable_pagerowscount = arr_pagetables[index].pagerowscount;
    let pagetable_filteritem = arr_pagetables[index].filteritem;
    let pagetable_filtervalue = arr_pagetables[index].filtervalue;
    let pagetable_url = arr_pagetables[index].getpagetable_url;

    var pageViewModel = {
        pageno: pagetable_pageno,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue,
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }
    pageViewModel.Form_KeyValue = form_KeyValueDisplay;
    var url = pagetable_url;
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            fill_NewPageTableJournal(result, pageViewModel, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function fill_NewPageTableJournal(result, pageViewModel, callBack = undefined) {

    let pageId = "lineDisplay_pagetable";
    if (!result) return "";

    let columns = result.columns.dataColumns;
    let list = result.data == null ? [] : result.data,
        columnsL = columns.length,
        listLength = list.length,
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
        pagetable_endData = arr_pagetables[index].endData,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_isSum = arr_pagetables[index].isSum,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount;


    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    if (!pagetable_endData) {
        list = list == null ? [] : list;
        arr_pagetables[index].endData = list.length < pagetable_pagerowscount;
        let elm_pbody = $(`#${pageId} .pagetablebody`),
            str = "",
            rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (pagetable_currentpage == 1) {

            let col = {}, width = 0;
            rowLength = 0;
            elm_pbody.html("");
            str += '<thead class="table-thead-fixed">';
            str += '<tr>';
            if (pagetable_editable == true)
                str += `<th style="width:${(+($(`#${pageId}`).parents(".modal").width() - 100) / 101) * 2}px"></th>`;
            if (pagetable_selectable == true)
                str += `<th style="width:${(+($(`#${pageId}`).parents(".modal").width() - 100) / 101) * 2}px;text-align:center !important"><input onchange="changeAll(this,'${pageId}')" ${typeof pagetable_selectedItems == "undefined" ?
                    "" : pagetable_selectedItems.length == list.length ? "checked" : ""} class="checkall" type = "checkbox" ></th >`;
            for (var i = 0; i < columnsL; i++) {
                col = columns[i];
                width = Math.abs((+($(`#${pageId}`).parents(".modal").width() - 100) / 101) * +col.width);
                if (col.isDtParameter && col.id != "action") {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + width + 'px;' : '') + '"';
                    str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
        }
        else {
            elm_pbody = $(`#${activePageIdDisplay} #${pageId} .pagetablebody tbody`);
            str = '';
        }

        if (list.length == 0) {
            if (pagetable_currentpage == 1)
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
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownDisplay(event,`' + pageId + '`,this)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownDisplay(event,`' + pageId + '`,this)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownDisplay(event,`' + pageId + '`,this)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownDisplay(event,`' + pageId + '`,this)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-1">';
                            }
                        }
                        if (pagetable_editable == true)
                            str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                        if (pagetable_selectable == true) {
                            str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

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
                    if (columns[j].isDtParameter && columns[j].id != "action") {
                        colno += 1;
                        var value = item[columns[j].id];
                        if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
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
                        else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
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
                                    value = value.toString();
                                if (isMainas)
                                    value = `(${value})`;

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
                                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                            else
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                        }
                    }
                }
                str += '</tr>';
            }


        if (pagetable_currentpage == 1) {
            str += `</tbody><tfoot class="${!pagetable_isSum ? "d-none" : ""} table-summarybody-fixed" id="tfoot_${activePageIdDisplay}">`;
            if (pagetable_isSum)
                str += createTfootHeaderLineDisplay(pageId, pageViewModel, columns, list);
            str += "</tfoot>";
        }
        else
            $("#total_qty_rows_display").text(+$("#total_qty_rows_display").text() + +list.length);

        if (pagetable_currentpage == 1) {
            appendDetails(columns)
        }

        elm_pbody.append(str);

        if (pagetable_currentpage == 1)
            afterFillPage(pageId);

        if (typeof callBack !== "undefined")
            callBack();

        lastPageHeaderDisplayloaded = arr_pagetables[index].pageno;
    }
}

function createTfootHeaderLineDisplay(pageId, pageViewModel, columns, list) {
    pageViewModel.form_KeyValue[0] = currentDisplayId;
    pageViewModel.form_KeyValue[3] = 0;
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    let urlSum = arr_pagetables[index].getsum_url;
    let dataSum = getTfootHeaderLineDisplay(urlSum, pageViewModel);
    let str = "";

    if (checkResponse(dataSum)) {
        str += "<tr>"
        if (list != null && list.length !== 0) {

            let firstHasValue = false;
            let cli = 0;
            for (var cl in columns) {
                colwidth = columns[cl].width;
                if (columns[cl].isDtParameter == true) {

                    cli += 1;
                    if (cli == 1)
                        str += `<td id="totalrecord" class="text-right font-12 font-600" style="width:${colwidth}%;">تعداد سطر: <span id="total_qty_rows_display">${list.length}</span></td>`;

                    else if (cli == 2)
                        str += `<td id="totalSum" class="text-left font-12 font-600" style="width:${colwidth}%;"> جمع</td>`;

                    else if (columns[cl].hasSumValue == true) {
                        var sumValue = "0";
                        sumValue = dataSum[columns[cl].id] >= 0 ?
                            transformNumbers.toComma(dataSum[columns[cl].id]) : `(${transformNumbers.toComma(Math.abs(dataSum[columns[cl].id]))})`;


                        if (columns[cl].id == "amountCredit") {
                            let finalAmount = parseFloat(dataSum["amountDebit"]) - parseFloat(dataSum["amountCredit"]);
                            let amountCreditSumValue = finalAmount >= 0 ?
                                transformNumbers.toComma(finalAmount) : `(${transformNumbers.toComma(Math.abs(finalAmount))})`;

                            str += `<td class="total-amount" style="width:${colwidth}%"><span style="margin-left:20px!important">${sumValue}</span> <span class="${+finalAmount != 0 ? "highlight-danger" : ""}"> / ${amountCreditSumValue}</span></td>`;
                        }
                        else
                            str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;

                        firstHasValue = true;
                    }

                    else if (!firstHasValue)
                        str += `<td class="font-600" style="width:${colwidth}%;"></td>`;
                }
            }
        }
        str += "</tr>";
    }
    return str;

}

function getTfootHeaderLineDisplay(url, model) {
    let result = $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return result.responseJSON;
}

function fillOptionHeaderDisplay(pg_id) {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].pageno = 0;
    arr_pagetables[index].endData = false;
    arr_pagetables[index].currentpage = 1;

    handlerInsertHeaderLineDisplay(pg_id);
}

function handlerInsertHeaderLineDisplay(pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";


    let elmenet = $(`#${pg_id} .table-responsive `);
    let elmenetjs = document.querySelector(`#${pg_id} .table-responsive `);

    elmenet.on('scroll', (e) => {

        scrolls.current = elmenet.scrollTop();
        if (scrolls.prev !== scrolls.current) {
            scrolls.prev = scrolls.current;
            if (elmenetjs.offsetHeight + elmenetjs.scrollTop + 10 >= elmenetjs.scrollHeight)
                insertNewPageHeaderLineDisplay(pg_id);
        }
    });
}

function insertNewPageHeaderLineDisplay(pg_id) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id),
        pagetable_pageNo = arr_pagetables[index].pageno,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_endData = arr_pagetables[index].endData,
        pageno = 0;

    if (!pagetable_endData && +pagetable_pageNo == lastPageHeaderDisplayloaded) {
        pageno = +pagetable_pageNo + +pagetable_pagerowscount;
        arr_pagetables[index].currentpage = pagetable_currentpage + 1;
        arr_pagetables[index].pageno = pageno;
        getPagetable_HeaderLineDisplay(undefined, true);
    }
}

function get_DisplayPageTable(pg_id = null, callBack = undefined) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    let pagetable_url = arr_pagetables[index].getpagetable_url;

    fillOptionHeaderDisplay("lineDisplay_pagetable")

    let pageViewModel = {
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [0],
    }
    pageViewModel.form_KeyValue = pagetable_formkeyvalue;
    form_KeyValueDisplay = pagetable_formkeyvalue;

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
            fill_DisplayPageTable(result, pg_id);
            fill_NewPageTableJournal(result.data.jsonJournalLineList, pageViewModel, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function fill_DisplayPageTable(result, pageId = null, callBack = undefined) {

    if (!result)
        return "";

    let columns = result.columns.dataColumns;
    let list = result.data,
        columnsL = columns.length,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pageId),
        isMainas = false;

    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;

    let elm_pbody = $(`#${pageId} table`), str = "", col = {}, width = 0;

    elm_pbody.html("");
    str += '<thead class=""><tr>';
    currentDisplayId = list.id;
    for (var i = 0; i < columnsL; i++) {
        col = columns[i];
        //width = (+$(`#${pageId} table`).width() / 101) * +col.width;
        if (col.isDtParameter && col.id !== "action") {
            str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + 'rem;' : '') + '"';
            str += '>' + col.title + '</th>';
        }
    }
    str += '</tr></thead><tbody>';

    let item = list, rowno = 1, colno = 0, colwidth = 0;
    for (var j = 0; j < columnsL; j++) {

        colwidth = columns[j].width;
        if (columns[j].isDtParameter && columns[j].id !== "action") {
            colno += 1;
            var value = item[columns[j].id];
            if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                if (value != null && value != "") {
                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                }
                else {
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                }
            }
            else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                if (value != null && value != "") {
                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + 'rem">' + value + '</td>';
                }
                else {
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}rem"></td>`;
                }
            }
            else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
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
                        value = value.toString();
                    if (isMainas)
                        value = `(${value})`;

                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem">' + value + '</td>';
                }
                else {
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                }
            }
            else if (columns[j].type == 7) {
                value = '<img src="' + value + '" height="35" ></a>'
                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem;">' + value + '</td>';
            }
            else if (columns[j].type == 21) {
                value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem;">' + value + '</td>';
            }
            else {
                if (value != null && value != "")
                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem;">' + value + '</td>';
                else
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}rem"></td>`;
            }
        }
    }
    str += '</tr></tbody>';

    elm_pbody.append(str);


    if (typeof callBack !== "undefined")
        callBack(item.id);


}

function appendDetails(columns) {

    $("#headerLinesFooterDisplay").html("");
    var arr_Temp = [];
    var output = `<div class="detail-headerLine row col-md-12">`;
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
    $(output).appendTo("#headerLinesFooterDisplay");

}

function afterFillPage(pg_name) {

    var id = $(`#${pg_name} #row1`).data("id");
    fillJournalLineFooterDisplay(id);
    tr_Highlight(pg_name);
}

function tr_onclickDisplay(pg_name, elm, evt) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var trediting = arr_pagetables[index].trediting;
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
    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);

    var id = $(elm).data("id");
    fillJournalLineFooterDisplay(id);
}

function tr_onkeydownDisplay(ev, pg_name, elm) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space].indexOf(ev.which) == -1) return;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            pagetable_currentrow--;
            arr_pagetables[index].currentrow = pagetable_currentrow;
            elm = $(`#row${pagetable_currentrow}`);
            after_change_tr(pg_name, KeyCode.ArrowUp);

            let id = $(`#lineDisplay_pagetable #row${arr_pagetables[index].currentrow}`).data("id");
            fillJournalLineFooterDisplay(id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            pagetable_currentrow++;
            elm = $(`#row${pagetable_currentrow}`);
            arr_pagetables[index].currentrow = pagetable_currentrow;

            after_change_tr(pg_name, KeyCode.ArrowDown);

            let id = $(`#lineDisplay_pagetable #row${arr_pagetables[index].currentrow}`).data("id");
            fillJournalLineFooterDisplay(id);
        }
    }

}

function fillJournalLineFooterDisplay(rowId) {

    getJournalLineFooter(rowId).then(function (data) {

        if (data != null) {

            $("#headerLinesFooterDisplay #accountGLName").text(data.accountGLName);

            $("#headerLinesFooterDisplay #accountSGLName").text(data.accountSGLName);


            $("#headerLinesFooterDisplay #accountDetailName").text(data.accountDetailName);

            $("#headerLinesFooterDisplay #accountCategoryName").text(data.accountCategoryName);


            $("#headerLinesFooterDisplay #jobTitle").text(data.jobTitle);

            $("#headerLinesFooterDisplay #userFullName").text(data.userFullName);

            $("#headerLinesFooterDisplay #nationalCode").text(data.nationalCode);

            $("#headerLinesFooterDisplay #createDateTimePersian").text(data.createDateTimePersian);

            $("#headerLinesFooterDisplay #costDriveName").text(data.costDriverName);

            $("#headerLinesFooterDisplay #vatEnableStr").text(data.vatEnableStr);

            $("#headerLinesFooterDisplay #vatIncludeStr").text(data.vatIncludeStr);

            $("#headerLinesFooterDisplay #noSeriesName").text(data.noSeriesName);

            $("#headerLinesFooterDisplay #agentFullName").text(data.agentFullName);

            $("#headerLinesFooterDisplay #brand").text(data.brand);

            $("#headerLinesFooterDisplay #idNumber").text(data.idNumber);


        }
        else {

            $("#headerLinesFooterDisplay #accountGLName").text("");

            $("#headerLinesFooterDisplay #accountSGLName").text("");


            $("#headerLinesFooterDisplay #accountDetailName").text("");


            $("#headerLinesFooterDisplay #accountCategoryName").text("");


            $("#headerLinesFooterDisplay #jobTitle").text("");

            $("#headerLinesFooterDisplay #userFullName").text("");

            $("#headerLinesFooterDisplay #nationalCode").text("");

            $("#headerLinesFooterDisplay #createDateTimePersian").text("");

            $("#headerLinesFooterDisplay #costDriveName").text("");

            $("#headerLinesFooterDisplay #vatEnableStr").text("");

            $("#headerLinesFooterDisplay #vatIncludeStr").text("");

            $("#headerLinesFooterDisplay #noSeriesName").text("");

            $("#headerLinesFooterDisplay #agentFullName").text("");

            $("#headerLinesFooterDisplay #brand").text("");

            $("#headerLinesFooterDisplay #idNumber").text("");

        }
    });
}

async function getJournalLineFooter(id) {

    var p_url = `/api/FM/JournalLineApi/journallinefooter`;

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

function tr_Highlight(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    $(`#${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

$("#displayJournalLineModel").on("hidden.bs.modal", async function () {

    arr_pagetables = arr_pagetables.filter(v => v.pagetable_id != "headerDisplay_pagetable" && v.pagetable_id != "lineDisplay_pagetable")

});

initDisplayJournalFrom();