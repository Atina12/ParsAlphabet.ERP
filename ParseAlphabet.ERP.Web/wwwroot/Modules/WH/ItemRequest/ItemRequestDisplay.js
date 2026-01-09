
var viewData_getpagetableDisplay_url = `${viewData_baseUrl_WH}/ItemRequestLineApi/display`,
    viewData_getlinepagetable_url = `${viewData_baseUrl_WH}/ItemRequestLineApi/getitemRequestlinepage`,
    viewData_getItemRequestCheckExist = `${viewData_baseUrl_WH}/ItemRequestApi/checkexist`,
    lastPageHeaderDisplayloaded = 0, activePageIdDisplay = "itemRequestDisplayPage",
    display_PageRowsCount = 15;

function initDisplayItemRequestForm(headerPagination = 0, id = 0) {

    pagetable_formkeyvalue[0] = id == 0 ? $(`#${activePageIdDisplay} #itemTransactionId`).val() : id;
    pagetable_formkeyvalue[1] = $(`#${activePageIdDisplay} #isDefaultCurrency`).val();
    pagetable_formkeyvalue[2] = headerPagination;
    pagetable_formkeyvalue[3] = "0";
    pagetable_formkeyvalue[4] = $(`#${activePageIdDisplay} #stageId`).val();
    pagetable_formkeyvalue[5] = $(`#${activePageIdDisplay} #workflowId`).val();

    let pagetable = {};

    let index1 = arr_pagetables.findIndex(v => v.pagetable_id == "headerDisplay_pagetable");

    if (arr_pagetables.findIndex(a => a.pagetable_id == "headerDisplay_pagetable") < 0) {
        pagetable = {
            pagetable_id: "headerDisplay_pagetable",
            editable: false,
            pagerowscount: 2147483647,
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
            getpagetable_url: viewData_getpagetableDisplay_url,
        };
        arr_pagetables.push(pagetable);
    } else {
        arr_pagetables[index1].pagetable_id = "headerDisplay_pagetable"
        arr_pagetables[index1].editable = false
        arr_pagetables[index1].pagerowscount = 2147483647
        arr_pagetables[index1].currentpage = 1
        arr_pagetables[index1].endData = false
        arr_pagetables[index1].pageNo = 0
        arr_pagetables[index1].lastpage = 1
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

    let index2 = arr_pagetables.findIndex(v => v.pagetable_id == "lineDisplay_pagetable")

    if (arr_pagetables.findIndex(a => a.pagetable_id == "lineDisplay_pagetable") < 0) {
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
            filteritem: "",
            filtervalue: "",
            isSum: true,
            headerType: "outline",
            selectedItems: [],
            getpagetable_url: viewData_getlinepagetable_url,
            getsum_url: `${viewData_baseUrl_WH}/WarehouseTransactionLineApi/getLineSum`
    
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
        arr_pagetables[index2].getpagetable_url = viewData_getlinepagetable_url
        arr_pagetables[index2].getsum_url = `${viewData_baseUrl_WH}/WarehouseTransactionLineApi/getLineSum`
        
    }

    get_DisplayPageTable("headerDisplay_pagetable", id => {

        pagetable_formkeyvalue[0] = id;
        get_DisplayNewPageTable("lineDisplay_pagetable",
            function () {
                modal_show("displayItemRequestLineModel");
                //reset_toParentForm();
                $("#lineDisplay_pagetable tbody #row1").addClass("highlight")
                $("#lineDisplay_pagetable tbody #row1").focus()
            }, id);
    });
}

function get_DisplayPageTable(pg_id = null, callBack = undefined) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    let pagetable_url = arr_pagetables[index].getpagetable_url;

    let pageViewModel = {
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [0],
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
        success: function (result) {
            fill_DisplayPageTable(result, pg_id, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

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
        pageno = 0,
        lastPageloaded = arr_pagetables[index].lastPageloaded;

    if (!pagetable_endData && +pagetable_pageNo == lastPageloaded) {
        pageno = +pagetable_pageNo + +pagetable_pagerowscount;
        arr_pagetables[index].currentpage = pagetable_currentpage + 1;
        arr_pagetables[index].pageno = pageno;
        get_DisplayNewPageTable(pg_id, undefined, true);
    }
}

function get_DisplayNewPageTable(pg_id = null, callBack = undefined, isInsert = false) {
    
    if (pg_id == null)
        pg_id = "pagetable";
    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].currentpage = 1;
        arr_pagetables[index].pageno = 0;
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].endData = false;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageno;

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

    let url = pagetable_url;
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            fill_DisplayNewPageTable(result, pg_id, pageViewModel, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function fill_DisplayNewPageTable(result, pageId = null, pageViewModel, callBack = undefined) {

    if (pageId == null) pageId = "pagetable";
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
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNewDisplay(`' + pageId + '`,this,event)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNewDisplay(`' + pageId + '`,this,event)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNewDisplay(`' + pageId + '`,this,event)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNewDisplay(`' + pageId + '`,this,event)" onclick="tr_onclickDisplay(`' + pageId + '`,this,event)" tabindex="-1">';
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
                        if (columns[j].hasLink) {
                            if (value != null && value != "")
                                str += `<td id="col_${rowno}_${colno}" style="${columns[j].align == "center" ? `text-align:${columns[j].align}!important;` : ''};width:${colwidth}%" class="itemLink" onclick="click_link_${columns[j].id}(this,event)">${value}</td>`;
                            else
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                        }
                        else if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                            if (value != null && value != "") {
                                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                            }
                            else {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                            }
                        }
                        else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                            if (value != null && value != "") {
                                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%">' + value + '</td>';
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

        elm_pbody.append(str);

        if (pagetable_currentpage == 1) {
            tr_Highlight(pageId);
            fillOptionHeaderDisplay(pageId);
        }

        if (typeof callBack !== "undefined")
            callBack();


        arr_pagetables[index].lastPageloaded = arr_pagetables[index].pageno;
        //lastPageHeaderDisplayloaded = arr_pagetables[index].pageno;
    }
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
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}rem"></td>`;
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
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}rem"></td>`;
                }
            }
            else if (columns[j].type == 2) {
                if (value == true)
                    value = '<i class="fas fa-check"></i>';
                else
                    value = '<i></i>';
                str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + 'rem;">' + value + '</td>';
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

    document.querySelector(`#${pageId} > div`).scrollLeft = 0
    if (typeof callBack !== "undefined")
        callBack(item.id);
}

function tr_onkeydownNewDisplay(pg_name, elem, ev) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables[index].currentcol
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
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
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {

        ev.preventDefault();
        if (document.activeElement.className.indexOf("select2") >= 0) return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
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
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
        }
    }
    else if (ev.which === KeyCode.Enter) {
        if (pagetable_editable) {
            if (!pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow, true);
                pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
            }
            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio,.search-modal-container > input").first()
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editing(pg_name);

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

                    for (var x = 0; x < nextTdsL; x++) {
                        var v = nextTds[x];
                        if (nextElm == undefined) {
                            if ($(v).attr("id") != undefined) {
                                var currentcol = $(v).attr("id").split("_")[2];
                                if (+currentcol > +pagetable_currentcol) {
                                    var nxtElm = $(v).find('input,select,div.funkyradio,button[data-isfocusinline="true"]').first();
                                    if (nxtElm.length > 0 && $(nxtElm).attr("readonly") != "readonly") {
                                        nextElm = nxtElm;
                                    }
                                }
                            }
                        }
                    }
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
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
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
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first,.search-modal-container > input");
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
            else if (elm.prop("tagName").toLowerCase() === "select") {
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

function tr_onclickDisplay(pg_name, elm, evt) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var trediting = arr_pagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow) 
        return;

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);

    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
}



function display_pagination_display(opr) {
    var elemId = +$("#itemRequestDisplayPage #headerDisplay_pagetable #col_1_1").text();
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
    initDisplayItemRequestForm(headerPagination, elemId)
}

function headerindexChoose_display(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistItemRequestLineId(+elm.val());
        if (checkExist) {
            initDisplayItemRequestForm(0, +elm.val());
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }

}

function checkExistItemRequestLineId(id) {
    
    
    let outPut = $.ajax({
        url: viewData_getItemRequestCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getItemRequestCheckExist);
        }
    });
    return outPut.responseJSON;

}

function reset_toParentForm() {
    pagetable_formkeyvalue = [0];
    viewData_controllername = "ItemRequestApi";
}

function tr_Highlight(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    $(`#${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

function createTfootHeaderLineDisplay(pageId, pageViewModel, columns, list) {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    let urlSum = arr_pagetables[index].getsum_url;
    let dataSum = getTfootHeaderLineDisplay(urlSum, pageViewModel);
    let str = "", colwidth = 0, ln = columns.length;

    if (checkResponse(dataSum)) {
        str += "<tr>"
        if (list != null && list.length !== 0) {
            for (var cl = 0; cl < ln; cl++) {
                colwidth = columns[cl].width;
                if (columns[cl].isDtParameter == true && columns[cl].id !== 'action') {
                    if (cl == 0)
                        str += `<td id="totalrecord" class="text-right" style="width:${colwidth}%;">تعداد سطر: <span id="total_qty_rows_display">${list.length}</span></td>`;
                    else if (cl == 1)
                        str += `<td id="totalSum" class="text-left" style="width:${colwidth}%;"> جمع</td>`;
                    else if (columns[cl].hasSumValue == true) {
                        var sumValue = "0";
                        if (columns[cl].isCommaSep) {
                            sumValue = dataSum[columns[cl].id] >= 0 ?
                                transformNumbers.toComma(dataSum[columns[cl].id]) : `(${transformNumbers.toComma(Math.abs(dataSum[columns[cl].id]))})`;
                        }
                        else {
                            sumValue = dataSum[columns[cl].id] >= 0 ?
                                dataSum[columns[cl].id].toString() : `(${Math.abs(dataSum[columns[cl].id]).toString()})`;
                        }

                        str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;
                    }
                    else {
                        str += `<td style="width:${colwidth}%;"></td>`;
                    }
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

initDisplayItemRequestForm();

