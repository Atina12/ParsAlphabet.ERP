
var after_getPageTableCallBack = undefined,
    arrayCounts = [15, 20, 50, 100], scrolls = { current: 0, prev: 0 }, dataOrder = { colId: "", sort: "", index: 0 }, pagetable_id = "pagetable",
    arr_pagetables = [
        {
            pagetable_id: "pagetable",
            editable: false,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            filteritem: "",
            filtervalue: "",
            lastPageloaded: 0
        }
    ],
    pagetable_formkeyvalue = [0];

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
    if (checkResponse(arr_pagetables[index].pagetable_formkeyvalue) && arr_pagetables[index].pagetable_formkeyvalue.length > 0)
        pageViewModel.form_KeyValue = arr_pagetables[index].pagetable_formkeyvalue;
    else
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

            if (pagetable_currentpage == 1) fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);

            if (typeof callBack != "undefined")
                callBack(result);

            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function configFilterNewPageTable(pg_id) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    let pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue,
        fieldItemType = +$(`#${pg_id} .btnfilter`).attr("data-type"),
        fieldValue = $(`#${pg_id} .filtervalue`);

    if (!$(fieldValue).hasClass("select2")) {
        if ($(fieldValue).hasClass("text-filter-value") && pagetable_filtervalue.length < 3) {
            alertify.error('حداقل سه حرف وارد کنید').delay(alertify_delay);
            return false;
        }
        else if (pagetable_filtervalue != "" && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
            alertify.error('مورد فیلتر انتخاب نشده').delay(alertify_delay);
            return false;
        }
        else if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && pagetable_filtervalue == "") {
            alertify.error('عبارت فیلتر وارد نشده').delay(alertify_delay);
            return false;
        }
        else if ([dbtype.Int, dbtype.BigInt, dbtype.SmallInt, dbtype.TinyInt, dbtype.dbtype_Decimal, dbtype.Float, dbtype.Real].indexOf(fieldItemType) > -1) {

            if (pagetable_filtervalue.indexOf(",") >= 0)
                pagetable_filtervalue = removeSep(pagetable_filtervalue);

            if (isNaN(pagetable_filtervalue)) {
                alertify.error('با توجه به مورد فیلتر ، عبارت فیلتر معتبر نمی باشد').delay(alertify_delay);
                return false;
            }
        }
    }
    else {
        if (+pagetable_filtervalue === 0) {
            alertify.error('مورد فیلتر انتخاب کنید').delay(alertify_delay);
            return false;
        }
    }
    return true;
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
                                str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}"  style="width:${colwidth}%;">`;



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
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" ${dataDisabled} value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" ${dataDisabled} disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
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

                                        if (value && columns[j].isCommaSep)
                                            value = value > 0 ? transformNumbers.toComma(value) : `(${transformNumbers.toComma(Math.abs(value))})`;

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
                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;" >' + value + '</td>';
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

        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack);
    }
}

function afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack) {

    if ($(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length > 0)
        createPageFooterInfo(1, $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length, pagetable_currentpage, pageId);
    else
        createPageFooterInfo(0, 0, 0, pageId);

    searchPluginConfig(pageId, columns);

    let pagetable_currentrow = arr_pagetables[index].currentrow;


    //elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus().addClass("highlight");

    if ($(`#${pageId} .pagetablebody tbody #emptyRow`).length == 0)
        $(`#${pageId} .pagetablebody tbody > #row${pagetable_currentrow}`).focus().addClass("highlight");
    else
        $(`#${pageId} .pagetablebody tbody #emptyRow`).prop("tabindex", -1).focus()


    let dataDatePicker = $(`#${pageId} .pagetablebody tbody .persian-datepicker`), dataDatePickerL = $(`#${pageId} .pagetablebody tbody .persian-datepicker`).length;
    for (var i = 0; i < dataDatePickerL; i++)
        kamaDatepicker(`${$(dataDatePicker[i]).attr('id')}`, { withTime: false, position: "bottom" });

    $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    if (typeof $(`#header_${dataOrder.index}`).data() != "undefined")
        $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;


    arr_pagetables[index].lastPageloaded = pagetable_pageNo;
    //lastPageloaded = pagetable_pageNo;
    //if (typeof callBack != "undefined")
    //    callBack(result);
}

function createConditionString(condition, item) {
    if (condition !== null) {

        let string = "", length = condition.length;

        for (var i = 0; i < length; i++)
            if (i + 1 == length)
                string += `(${item[condition[i].fieldName]} ${condition[i].operator} ${condition[i].fieldValue})`;
            else
                string += `(${item[condition[i].fieldName]} ${condition[i].operator} ${condition[i].fieldValue}) && `;

        return string;
    }
    return ""
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

function fill_FilterPageTable(result, pg_name) {

    if (result) {

        if (!result.hasFilter)
            return;
        var list = result.dataColumns;
        var str = '<div>';
        var filterLength = list.length;
        for (var i = 0; i < filterLength; i++) {
            var item = list[i];
            if (item.isFilterParameter)
                str += `<button class="dropdown-item" id="filter_${item.id}" data-filterminimumlength="${item.filterMinimumLength}" data-input="${item.filterType}" data-api="${item.filterTypeApi}" data-inputmask="${item.inputMask}" data-filterItems='${JSON.stringify(item.filterItems)}'
                        onclick="javascript:pagetable_change_filteritemNew('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}',this)">
                        ${item.title}</button>`;
        }

        str += "</div>";

        $(`#${pg_name} .filteritems`).html(str);

        if (typeof after_getPageTableCallBack != "undefined")
            after_getPageTableCallBack();
    }
}

function handlerInsert(pg_id = null) {

    if (pg_id == null) pg_id = "pagetable";
    let elmenet = $(`#${pg_id} #parentPageTableBody`);
    let elmenetjs = document.querySelector(`#${pg_id} #parentPageTableBody`);

    elmenetjs.addEventListener('wheel', (event) => {
        if (elmenetjs.scrollHeight == elmenetjs.offsetHeight)
            insertfirstPage(pg_id, event)
    });

    elmenet.on('scroll', (e) => {
        scrolls.current = elmenet.scrollTop();
        if (scrolls.prev !== scrolls.current) {
            scrolls.prev = scrolls.current;
            if (elmenetjs.offsetHeight + elmenetjs.scrollTop + 10 >= elmenetjs.scrollHeight) {
                if (elmenetjs.scrollTop != 0)
                    insertNewPage(pg_id);
            }
        }
    });
}

function insertfirstPage(pg_id, e) {
    if (e.deltaY > 0) {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id),
            pagetable_currentpage = arr_pagetables[index].currentpage;
        if (pagetable_currentpage == 1)
            insertNewPage(pg_id);
    }
}

function insertNewPage(pg_id) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id),
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_endData = arr_pagetables[index].endData,
        pageNo = 0,
        lastPageloaded = arr_pagetables[index].lastPageloaded;

    if (!pagetable_endData && +pagetable_pageNo == lastPageloaded) {
        pageNo = $(`#${pg_id} .pagetablebody tbody tr`).length;
        arr_pagetables[index].currentpage = pagetable_currentpage + 1;
        arr_pagetables[index].pageNo = pageNo;
        get_NewPageTable(pg_id, true);
    }
}

function run_button_edit(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    // pagetable_currentrow = p_currentrow;

    //viewData_modal_title = "ویرایش " + viewData_form_title;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function createPageCounters(pg_id = null) {

    if (pg_id == null) pg_id = "pagetable";

    let length = arrayCounts.length, outPut = "";

    for (var i = 0; i < length; i++)
        outPut += `<a class="dropdown-item" onclick="changePageRowsCount(${arrayCounts[i]},'${pg_id}'); return false;">${arrayCounts[i]}</a>`;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    let currentCount = arr_pagetables[index].pagerowscount;

    $(`#${pg_id} #dropCounteresPageTable`).html(outPut);
    $(`#${pg_id} #dropCounteresPageTableName`).text(currentCount);
}

function createPageFooterInfo(first, last, pageNo, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";

    $(`#${pg_id} #firstRow`).text(first);
    $(`#${pg_id} #lastRow`).text(last);
    $(`#${pg_id} #currentPage`).text(pageNo);
}

function searchPluginConfig(pageId, columns) {
    var rows = $(`#${pageId} .pagetablebody tbody tr`);
    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            var serachPluginCols = $(rows[i]).find(".searchPlugin");
            if (serachPluginCols.length > 0) {
                for (var j = 0; j < serachPluginCols.length; j++) {
                    var colId = $($(serachPluginCols[j]).parents("td")[0]).attr("id");
                    var columnIndex = colId.split("_")[2];
                    var searchPlugin = columns[+columnIndex - 1].searchPlugin;
                    var modelItems = [];
                    var inputId = $(serachPluginCols[j]).attr("id");
                    if (searchPlugin.modelItems.length > 0 && searchPlugin.modelItems != null)
                        modelItems = convertSearchPluginModelItem(pageId, i + 1, searchPlugin);

                    $(`#${inputId}`).searchModal({
                        searchUrl: searchPlugin.searchUrl,
                        selectColumn: searchPlugin.selectColumn,
                        column: searchPlugin.column,
                        modelItems: modelItems,
                    })
                }
            }
        }
    }
}

function tr_onclick(pg_name, elm, evt) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var trediting = arr_pagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow) {
        //evt.preventDefault();
        return;
    }

    //if (trediting) {
    //    if (elm.hasClass("funkyradio"))
    //        elm.prop("checked", !elm.prop("checked"));

    //    return;
    //}

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);

    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
}

function tr_object_onchange(pageId, elem, rowno, colno) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = arr_pagetables[index].columns;
    var column = null;
    var colId = "";
    var elemId = $(elem).attr("id");
    if (elemId != undefined) {
        colId = $(elem).attr("id").split("_")[0];;
        column = columns.filter(a => a.id == colId)[0];
    }

    //#region select2 config
    if (column != undefined && column != null && column.isSelect2) {
        if ($(elem).val() != null && $(elem).val() != undefined && $(elem).val() != "")
            $(elem).data("value", $(elem).val());
        var title = $(`#select2-${elemId}-container`).attr("title");
        if (title != undefined)
            $(`#col_${rowno}_${colno} div`).first().html($(`#select2-${elemId}-container`).attr("title").split("-")[1]);
        if (column.fillColumnInputSelectIds != null) {
            var fillColumnInputSelectIds = column.fillColumnInputSelectIds;
            for (var i = 0; i < fillColumnInputSelectIds.length; i++) {
                var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
                var columns = arr_pagetables[index].columns;
                var changeItemCol = columns.filter(a => a.id == fillColumnInputSelectIds[i])[0];

                var getInputSelectConfig = changeItemCol.getInputSelectConfig;
                if (changeItemCol.isSelect2 && getInputSelectConfig != null) {
                    var elemId = `${changeItemCol.id}_${rowno}`;
                    //$(`#${elemId}`).data("value", 0);
                    var params = "";
                    var parameterItems = getInputSelectConfig.parameters;
                    if (parameterItems.length > 0) {
                        for (var i = 0; i < parameterItems.length; i++) {
                            var paramItem = parameterItems[i].id;
                            if (parameterItems[i].inlineType)
                                params += $(`#${pageId} #${paramItem}_${rowno}`).val();
                            else
                                params += $(`#${paramItem}`).val();

                            if (i < parameterItems.length - 1)
                                params += "/";
                        }
                    }
                    $(`#${pageId} #${elemId}`).empty();

                    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                        fill_select2(getInputSelectConfig.fillUrl, `${pageId} #${elemId}`, true, params, false, 0, '', function () {
                            $(`#${pageId} #${elemId}`).trigger("change");
                        });
                    }
                }
            }
        }
    }
    //#endregion

}

function tr_select2_onchange(elem, pageId, rowno, colno) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = arr_pagetables[index].columns.filter(a => a.isDtParameter);
    var select2Config = columns[+colno - 1].select2Config;
    var param = "";
    var modelItems = select2Config.modelItems;
    if (modelItems.length > 0) {
        for (var i = 0; i < modelItems.length; i++) {
            var modelItem = modelItems[i];
            param += $(`#${modelItem}_${rowno}`).val();
            if (i < modelItems.length - 1)
                param += "/";
        }
    }

    var itemId = `${select2Config.itemId}_${rowno}`;
    $(`#${itemId}`).empty();

    if (param.split("/").filter(a => a == "0" || a == "null").length == 0) {
        fill_select2(select2Config.fillUrl, itemId, true, param);
        var val = +$(`#${itemId}`).data("value");
        if (val > 0)
            $(`#${itemId}`).val(val).trigger("change");
        else
            $(`#${itemId}`).trigger("change");
    }
}

function tr_onkeydownNew(pg_name, elem, ev) {

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

function tr_Highlight(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    $(`#${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

function getFirstColIndexHasInput(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_editable = arr_pagetables[index].editable;

    if (pagetable_editable) {
        var p_Elmbody = $(`#${pg_name} .pagetablebody`);
        var td_id_has_elm = p_Elmbody.find(`tbody >  #row${pagetable_currentrow} > td > input:not([type='checkbox']),tbody >  #row${pagetable_currentrow} > td select:not(:disabled),tbody >  #row${pagetable_currentrow} > td select:not([readonly]),tbody >  #row${pagetable_currentrow} > td  > .funkyradio >input,tbody >  #row${pagetable_currentrow} > td .search-modal-container > input`).closest("td").first().attr("id");

        if (td_id_has_elm != undefined) {
            var index_uline_Second = td_id_has_elm.indexOf("_", td_id_has_elm.indexOf("_") + 1);
            var column_index = td_id_has_elm.replace(td_id_has_elm.substring(0, index_uline_Second + 1), "");
            return +column_index;
        }
        else
            return 0;
    }
}

function after_change_tr(pg_name, keycode) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    var tr_editing = arr_pagetables[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_Highlight(pg_name);
    if (keycode === KeyCode.Esc) {
        if (tr_editing) {
            initialRow(pagetable_id, false);
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

function initialRow(pg_name, isInitial) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    arr_pagetables[index].trediting = false;

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).find(".editrow").remove();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input:not([type='checkbox']),select,div.funkyradio").attr("disabled", true);
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio > label").removeClass("border-thin");

    if (isInitial) {
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input").val("");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("select").val("0").trigger("change");
    }

}

function set_row_editing(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_editable = arr_pagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);

    if (pagetable_editable) {

        arr_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);
    }
}

function changePageRowsCount(count, pg_id = null) {

    if (pg_id == null)
        pg_id = "pagetable";

    $(`#${pg_id} .pagerowscount #dropCounteresPageTableName`).text(count);

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    arr_pagetables[index].pagerowscount = count;

    get_NewPageTable(pg_id, false, () => callbackAfterFilter(pg_id));
}

function refreshBackPageTable(mode, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";
    if (mode) {
        $(`#${pg_id} #parentPageTableBody`).addClass("disabled-box-report");
        $(`#${pg_id} #countRowButton`).addClass("not-click");
        $(`#${pg_id} .loadin-div`).removeClass("displaynone");
        $(`#${pg_id} .loadin-div button`).removeClass("displaynone");
    }
    else {
        $(`#${pg_id} #parentPageTableBody`).removeClass("disabled-box-report");
        $(`#${pg_id} #countRowButton`).removeClass("not-click");
        $(`#${pg_id} .loadin-div`).addClass("displaynone");
        $(`#${pg_id} .loadin-div button`).addClass("displaynone");
    }
}

function refreshBackbutton(elm) {
    let pg_name = $(elm).parents(".card-body").attr("id");

    refreshBackPageTable(false, pg_name);
    get_NewPageTable(pg_name, true);
}

function changeAll(elem, pageId) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var selectedItems = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;

    var validCount = 0;
    var primaryCount = 0;

    if ($(elem).prop("checked") == true) {


        $(`#${pageId} tbody`).find(".selectedItem-checkbox input[type='checkbox']").prop("checked", true);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 0; i < rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > tr:eq(${i})`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");

            var itemRes = JSON.parse(item);

            $.each(selectedItems, function (k, v) {
                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (itemRes[key].toString() == val.toString())
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    selectedItems = jQuery.grep(selectedItems, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })

            selectedItems.push(itemRes);
        }
    }
    else {

        $(`#${pageId} tbody`).find(".selectedItem-checkbox input[type='checkbox']").prop("checked", false);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 0; i < rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > tr:eq(${i})`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");

            var itemRes = JSON.parse(item);

            $.each(selectedItems, function (k, v) {
                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (itemRes[key].toString() == val.toString())
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    selectedItems = jQuery.grep(selectedItems, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })
        }
    }

    arr_pagetables[index].selectedItems = selectedItems;
}

function itemChange(elem) {
    if (elem.length < 1) return;
    let rowCount = $(elem).parents(".card-body tbody").find("tr").length,
        pagetable_id = $(elem).parents(".card-body").attr("id"),
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id),
        selectedItems = typeof arr_pagetables[index].selectedItems == "undefined" ? [] : arr_pagetables[index].selectedItems,
        isSelected = $(elem).prop("checked"),
        primaryData = $(elem).parents("tr").data();

    if (isSelected) {
        var checks = $(`#${pagetable_id} .selectedItem-checkbox input[type='checkbox']`),
            checksL = checks.length,
            count = 0;
        for (var i = 0; i < checksL; i++) {
            var v = checks[i];
            if ($(v).prop("checked") == true)
                count += 1;
        }

        if (count >= rowCount) {
            var pagetable = $(`#${pagetable_id}`);
            $(pagetable).find(".selectedItem-checkbox-all").prop("checked", true);
        }

        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        selectedItems.push(JSON.parse(item));

    }
    else {

        var pagetable = $(elem).parents(".card-body");
        $(`#${pagetable_id}`).find(".selectedItem-checkbox-all").prop("checked", false);
        var validCount = 0,
            primaryCount = 0,
            selectedItemsL = selectedItems.length;

        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        primaryData = JSON.parse(item)

        for (var k = 0; k < selectedItemsL; k++) {
            var v = selectedItems[k];

            $.each(v, function (key, val) {
                primaryCount += 1;

                if (primaryData[key].toString() == val.toString())
                    validCount += 1;

            })

            if (validCount == primaryCount) {

                selectedItems = jQuery.grep(selectedItems, function (value) {
                    return value != v;
                });
            }
            primaryCount = 0;
            validCount = 0;
        }
    }

    arr_pagetables[index].selectedItems = selectedItems;
}

function resetFilterInputNew(parentfilterVal, pg_name) {
    let outPut = "";
    $(parentfilterVal).find(".filtervalue").remove();
    outPut = `
                    <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
                                `
    $(parentfilterVal).html(outPut);
    elm_v = $(`#${pg_name} .filtervalue`);

};

function pagetable_change_filteritemNew(itemid, title, type, size, pg_name, elmDrop = null) {

    let dbType = type
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);

    let elm = $(`#${pg_name} .btnfilter`);
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);
    elm.attr("data-filterminimumlength", $(elmDrop).data("filterminimumlength"));
    arr_pagetables[index].filteritem = itemid;

    let elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    if (elmDrop == null) {

        resetFilterInputNew(elm_v.parents(".app-search"), pg_name);
        arr_pagetables[index].filtervalue = "";

        if (itemid.toLowerCase().indexOf("date") >= 0)
            elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
        else
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    }
    else {
        let type = $(elmDrop).data("input"),
            api = $(elmDrop).data("api"),
            inputMask = $(elmDrop).data("inputmask"),
            filterItems = $(elmDrop).data("filteritems"),
            parentfilterVal = elm_v.parents(".app-search"),
            outPut = "";


        if (!elm_v.hasClass("select2") && !elm_v.hasClass("double-input"))
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir").attr("class", "form-control filtervalue");
        else
            resetFilterInputNew(parentfilterVal, pg_name);


        $(parentfilterVal).find(".filtervalue").attr("onkeypress", `filtervalue_onkeypressNew(event, this,${dbType})`)
        $(parentfilterVal).find(".filtervalue").next().attr("onclick", `filtervalue_onsearchclickNew(this,${dbType})`)

        if (type === "text") {

            elm_v.addClass("text-filter-value");
            if (checkResponse(inputMask))
                elm_v.inputmask({ "mask": inputMask });

        }
        else if (type === "number" || type === "money" || type === "decimal") {

            elm_v.addClass(type);
            if (checkResponse(inputMask))
                elm_v.inputmask({ "mask": inputMask });

        }
        else if (type === "strnumber") {

            elm_v.addClass("str-number");
            if (checkResponse(inputMask))
                elm_v.inputmask({ "mask": inputMask });

        }
        else if (type === "persiandate") {

            elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");

        }
        else if (type === "doublepersiandate") {

            $(parentfilterVal).find(".filtervalue").remove();
            outPut = `
                    <div class="double-input-box">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressNew(event, 'next',${dbType})" oninput="filtervalue_onInputNew(event, this)"   data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressNew(event, this,${dbType})" oninput="filtervalue_onInputNew(event, this)"  data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <a onclick="filtervalue_onsearchclickNew(this,${dbType})"><i class="fa fa-search"></i></a>
                    <div>`;

            $(parentfilterVal).html(outPut);
            $(`#${pg_name} .filtervalue`).inputmask();
            $(`#${pg_name} .filtervalue.double-input:eq(0)`).focus();

        }
        else if (type === "select2") {

            $(parentfilterVal).find(".filtervalue").remove();
            outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChangeNew(this,'select2')"></select>`;
            $(parentfilterVal).html(outPut);
            fill_select2(api, `${pg_name} #filterValueSelect2`, true, 0, false, 0, "انتخاب کنید",
                () => {
                    $(`#${pg_name} #filterValueSelect2`).select2();
                }
            );

        }
        else if (type === "select2ajax") {

            $(parentfilterVal).find(".filtervalue").remove();
            outPut = `<select id="filterValueSelect2Ajax" class="form-control select2 filtervalue" onChange="filtervalue_onChangeNew(this,'select2')"></select>`;
            $(parentfilterVal).html(outPut);
            fill_select2(api, `${pg_name} #filterValueSelect2Ajax`, true, 0, true, 3, "انتخاب کنید", undefined, "", false, true, false, true);

        }
        else if (type === "select2static") {

            $(parentfilterVal).find(".filtervalue").remove();
            outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChangeNew(this,'select2static')">`;
            if (filterItems != null) {
                //filterItems.reverse()
                for (let i = 0; i < filterItems.length; i++) {
                    outPut += `<option value="${filterItems[i].id}">${filterItems[i].text}</option>`;
                }
            }
            outPut += `</select>`;
            $(parentfilterVal).html(outPut);
            $(`#${pg_name} #filterValueSelect2`).select2()
            $(`#${pg_name} #filterValueSelect2`).val(-1).trigger('change')

        }
    }


    if (itemid === "filter-non") {
        resetFilterInputNew(elm_v.parents(".app-search"), pg_name);
        get_NewPageTable(pg_name, false, () => callbackAfterFilter(pg_name));
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function removeFilterNew(elem) {
    var pagetableId = $(elem).closest(".card-body").attr("id");
    $(`#${pagetableId} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetableId} .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritemNew('filter-non', 'مورد فیلتر', '0', '0', pagetableId);
}

function callbackAfterFilter(pg_id) {
}

function filtervalue_onkeypressNew(e, fltvalue, dbType = null) {

    if (e.which == 13) {

        if ($(fltvalue).hasClass("text-filter-value") && $(fltvalue).val().trim().length < 3) {
            alertify.error('حداقل سه حرف وارد کنید').delay(alertify_delay);
            return false;
        }

        if ($(fltvalue).hasClass("str-number") && $(fltvalue).val().trim().length < 3) {
            alertify.error(`حداقل کارکتر مجاز 3 کارکتر می باشد`).delay(alertify_delay);
            return false;
        }

        if (fltvalue == "next") {
            $(e.currentTarget).next().val(e.currentTarget.value).focus();
            return;
        }


        let checkInputValue = checkingTheCorrectInputValueSwitch(dbType, $(fltvalue))
        if (!checkInputValue)
            return
        e.preventDefault();

        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
        get_NewPageTable(pagetableId, false, () => callbackAfterFilter(pagetableId));
    }
}

function filtervalue_onInputNew(e, fltvalue) {

    if (e.which != 13) {
        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
    }
}

function filtervalue_onChangeNew(fltvalue, type) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables[index].filtervalue = $(fltvalue).val();

    if (type === "select2" || type === "select2static") {
        if (+$(fltvalue).val() !== 0)
            get_NewPageTable(pagetableId, false, () => callbackAfterFilter(pagetableId));
    }
}

function filtervalue_onsearchclickNew(elm_search, dbType = null) {

    let inputSearch = $(elm_search).closest("div").children("input")
    let checkInputValue = checkingTheCorrectInputValueSwitch(dbType, $(inputSearch))
    if (!checkInputValue)
        return

    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables[index].filtervalue = $(elm_search).prev("input").hasClass("double-input") ? genarateValueFilter($(elm_search).prev("input")) : $(elm_search).prev("input").val();

    get_NewPageTable(pagetableId, false, () => callbackAfterFilter(pagetableId));
}

function checkingTheCorrectInputValueSwitch(dbtype, inputSearch) {

    let maxVal = +maxValue[dbtype]
    let inputValue = +inputSearch.val()
    let check = true

    if (inputValue > maxVal) {
        var msg = alertify.warning("عبارت فیلتر بزرگتر از حد مجاز است");
        msg.delay(alertify_delay);
        check = false
    }

    return check
}

function genarateValueFilter(element) {
    return $(element).val() + "     " + $(element).prev(".double-input").val();
}

function run_button_edit(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    // pagetable_currentrow = p_currentrow;

    //viewData_modal_title = "ویرایش " + viewData_form_title;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function run_button_delete(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    alertify.confirm('', msg_delete_row,
        function () {

            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(p_keyvalue),
                async: false,
                cache: false,
                success: function (result) {

                    if (result.successfull == true) {

                        var pagetableid = $(elem).parents(".card-body").attr("id");

                        if ($(`#${pagetableid} .pagetablebody `).hasClass("new-page-tableV1"))
                            get_NewPageTableV1(pagetableid, false, () => callbackAfterFilterV1(pagetableid));
                        else
                            get_NewPageTable(pagetableid, false, () => callbackAfterFilter(pagetableid));

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {

                        if (result.statusMessage !== undefined && result.statusMessage !== null) {
                            var msg = alertify.error(result.statusMessage);
                            msg.delay(alertify_delay);
                        }
                        else if (result.validationErrors !== undefined) {
                            generateErrorValidation(result.validationErrors);
                        }
                        else {
                            var msg = alertify.error(msg_row_create_error);
                            msg.delay(2);
                        }
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function sortingButtonsByThNew(has, elm, pg_name) {
    if (has) {
        var data = $(elm).data();
        dataOrder = { colId: "", sort: "", index: 0 };
        var sort = data.sort == "desc" ? "asc" : "desc";
        dataOrder = { colId: data.col, sort: sort, index: data.index };
        $("i").removeClass("active-sortIcon");
        get_NewPageTable(pg_name, false, () => callbackAfterFilter(pg_name));
    }
}

$(".persian-date,.persian-datepicker,.double-input,.double-inputsearch").on("keydown", function (e) {

    if ([KeyCode.Enter].indexOf(e.keyCode) < 0)
        return;

    var valThis = $(this).val(), elmAfter;

    if ($(this).hasClass("persian-date") || $(this).hasClass("persian-datepicker")) {

        elmAfter = $(this).parent().parent().next().find("input");

        if (elmAfter.length === 0)
            elmAfter = $(this).parent().parent().parent().next().find("input");

        if (elmAfter.hasClass("persian-date") || elmAfter.hasClass("persian-datepicker"))
            elmAfter.val(valThis);
    }
    else if ($(this).hasClass("double-input")) {

        elmAfter = $(this).next();
        if (elmAfter.hasClass("double-input"))
            elmAfter.val(valThis);
    }
    else if ($(this).hasClass("double-inputsearch")) {

        elmAfter = $(this).parent().next().find("input");
        if (elmAfter.hasClass("double-inputsearch"))
            elmAfter.val(valThis);
    }

});

function tr_onfocus(pg_name, colno) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    arr_pagetables[index].currentcol = colno;
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    var trediting = arr_pagetables[index].trediting;

    if (trediting) {
        var elm = $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input:first,select:first,div.funkyradio:first");
        if (!elm.hasClass("funkyradio"))
            elm.select();
    }
}

function tr_object_onblur() {

}

function after_save_row(pg_name, result_opr, keycode, initial) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var trediting = arr_pagetables[index].trediting;
    var endData = arr_pagetables[index].endData

    if (trediting)
        initialRow(pagetable_id, initial);

    configSelect2_trEditing(pagetable_id, pagetable_currentrow);
    if (keycode == KeyCode.ArrowDown) {
        // اگر سطر بعدی وجود داشت
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow++;
                arr_pagetables[index].currentrow = pagetable_currentrow;

                tr_Highlight(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (!endData/*pagetable_currentpage != pagetable_lastpage*/) {

                if ($(`#${pagetable_id} .pagetablebody `).hasClass("new-page-tableV1"))
                    insertNewPageV1(pagetable_id);
                else
                    insertNewPage(pagetable_id);
            }
            else
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
        }
    }
    else if (keycode == KeyCode.ArrowUp) {
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow--;
                arr_pagetables[index].currentrow = pagetable_currentrow >= 1 ? pagetable_currentrow : 1;
                tr_Highlight(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (result_opr == "success" || result_opr == "cancel")
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            if (result_opr == "cancel")
                initialRow(pagetable_id, initial);
        }
    }

    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pagetable_id);
}

function configSelect2_trEditing(pg_name, rowno, enableConfig = false) {
    $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td[data-select2='true']`).each(function () {
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
        $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td`).find("select.select2").each(function () {
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
