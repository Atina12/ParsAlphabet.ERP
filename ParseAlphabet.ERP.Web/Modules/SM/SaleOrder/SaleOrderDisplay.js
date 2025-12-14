
var viewData_getpagetableDisplay_url = `${viewData_baseUrl_SM}/SaleOrderLineApi/display`,
    viewData_getlinepagetable_url = `${viewData_baseUrl_SM}/SaleOrderLineApi/getsaleorderlinepage`,
    viewData_getSaleOrderCheckExist = `${viewData_baseUrl_SM}/SaleOrderApi/checkexist`,
    activePageIdDisplay = "saleOrderLineDisplayPage";


function display_pagination_display(opr) {
    var elemId = +$("#headerDisplay_pagetable #col_1_1").text();
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

    initDisplaySaleOrderFrom(headerPagination, elemId)
}

function headerindexChoose_display(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistSaleOrderLineId(+elm.val());
        if (checkExist) {
            initDisplaySaleOrderFrom(0, +elm.val());
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
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

function initDisplaySaleOrderFrom(headerPagination = 0, id = 0) {
    
    pagetable_formkeyvalue[0] = id == 0 ? $(`#${activePageIdDisplay} #saleOrderId`).val() : id;
    pagetable_formkeyvalue[1] = $(`#${activePageIdDisplay} #isDefaultCurrency`).val();
    pagetable_formkeyvalue[2] = headerPagination;
    pagetable_formkeyvalue[3] = "1";
    pagetable_formkeyvalue[4] = $(`#${activePageIdDisplay} #stageId`).val();

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
            getpagetable_url: viewData_getlinepagetable_url,
        };
        arr_pagetables.push(pagetable);

    } else {
        arr_pagetables[index2].pagetable_id = "lineDisplay_pagetable"
        arr_pagetables[index2].editable = false
        arr_pagetables[index2].pagerowscount = 2147483647
        arr_pagetables[index2].currentpage = 1
        arr_pagetables[index2].endData = false
        arr_pagetables[index2].pageNo = 0
        arr_pagetables[index2].lastpage = 1
        arr_pagetables[index2].currentrow = 1
        arr_pagetables[index2].currentcol = 0
        arr_pagetables[index2].highlightrowid = 0
        arr_pagetables[index2].trediting = false
        arr_pagetables[index2].filteritem = ""
        arr_pagetables[index2].filtervalue = ""
        arr_pagetables[index2].headerType = "outline"
        arr_pagetables[index2].selectedItems = []
        arr_pagetables[index2].getpagetable_url = viewData_getlinepagetable_url
    }


    get_DisplayPageTable("headerDisplay_pagetable", id => {
        pagetable_formkeyvalue[0] = id;
        get_DisplayNewPageTable("lineDisplay_pagetable",
            function () {
                modal_show("displaySalesOrderLineModel");
                reset_toParentForm();
                $("#lineDisplay_pagetable tbody #row1").addClass("highlight")
                $("#lineDisplay_pagetable tbody #row1").focus()
            });
    });
}

function reset_toParentForm() {
    pagetable_formkeyvalue = [0];
    viewData_controllername = "SaleOrderApi";
}

function get_DisplayNewPageTable(pg_id = null, callBack = undefined) {

    if (pg_id == null)
        pg_id = "pagetable";
    activePageTableId = pg_id;
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo;

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
            fill_DisplayNewPageTable(result, pg_id, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function fill_DisplayNewPageTable(result, pageId = null, callBack = undefined) {

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
        pagetable_highlightrowid = arr_pagetables[index].highlightrowid;


    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";



    let elm_pbody = $(`#${pageId} .pagetablebody`),
        str = "",
        rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

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


                    if (columns[j].hasSumValue && columns[j].calculateSum) {
                        columns[j].sumValue += isNaN(item[columns[j].id]) ? 0 : +item[columns[j].id];
                    }

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
                    else if (columns[j].type === 5) {
                        if (value != null && value != "") {

                            countDecimal = value.toString().countDecimals();
                            let decimalValue = parseFloat(value).toFixed(countDecimal);
                            value = decimalValue.toString();

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
                                value = value.toString();

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
                            str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                        else
                            str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                    }
                }
            }
            str += '</tr>';
        }

    str += '</tbody><tfoot>';
    if (list != null && list.length !== 0) {
        var cli = 0,
            colwidth = 0,
            firstHasValue = false,
            afterFirstHasValue = false;
        for (var cl in columns) {

            colwidth = columns[cl].width;
            if (columns[cl].isDtParameter == true && columns[cl].id !== "action") {
                cli += 1;
                if (cli == 1) {
                    str += `<td id="totalrecord" class="text-right  font-600" style="width:${colwidth}%;">تعداد سطر: ${list.length}</td>`;
                    if (columns[cl].id == "action")
                        recordcolwidth += colwidth;
                }
                else if (cli == 2) {
                    str += `<td id="totalSum" class="text-left  font-600" style="width:${colwidth}%;"> جمع</td>`;
                    if (columns[cl].id == "action")
                        Sumcolwidth += colwidth;
                }
                else if (columns[cl].hasSumValue == true) {
                    var value = item[columns[cl].id];

                    var sumValue = "0";

                    if (columns[cl].sumValue >= 0) {
                        if (columns[cl].type === 5)
                            sumValue = parseFloat(columns[cl].sumValue).toFixed(3)
                        else
                            sumValue = transformNumbers.toComma(Math.abs(columns[cl].sumValue));
                    }
                    else {
                        if (columns[cl].type === 5)
                            sumValue = `(${parseFloat(columns[cl].sumValue).toFixed(3)})`
                        else
                            sumValue = `(${transformNumbers.toComma(Math.abs(columns[cl].sumValue))})`;
                    }

                    str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;

                    firstHasValue = true;
                    afterFirstHasValue = true;
                }
                else {
                    str += `<td class="font-600" style="width:${colwidth}%;"></td>`;
                }
            }
        }
    }
    str += "</tr>";
    str += "</tfoot>";

    elm_pbody.append(str);

    if (typeof callBack !== "undefined")
        callBack();
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
        width = (+$(`#${pageId} table`).width() / 101) * +col.width;
        if (col.isDtParameter && col.id !== "action") {
            str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + width + 'px;' : '') + '"';
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
            else if (columns[j].type === 5) {

                if (value != null && value != "") {

                    countDecimal = value.toString().countDecimals();
                    let decimalValue = parseFloat(value).toFixed(countDecimal);
                    value = decimalValue.toString();

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
                        value = value.toString();

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
                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                else
                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
            }
        }
    }
    str += '</tr></tbody>';

    elm_pbody.append(str);
    if (typeof callBack !== "undefined")
        callBack(item.id);
}

initDisplaySaleOrderFrom();

//---------------
