var after_pageTable2;
var arr_pagetables2 = [],
    modelAssign = [],
    pagetable_laststate = "",
    modelDiAssign = [],
    OutPutCssTable = "",
    lastPageloaded = 0,
    pageTableId1 = "",
    pageTableId2 = "",
    backToList_overrided = undefined,
    arrayCounts = [15, 20, 50, 100];

$(document).ready(function () {
    $("#form_keyvalue").trigger("change");
    $("#formplate2").resizable();

    $(".formPlate2_Title").text(viewData_form_title);
    $(document).keydown(function (e) {
        if (e.key == "ArrowLeft" && e.ctrlKey) {
            assign_ins();
        }
        else if (e.key == "ArrowRight" && e.ctrlKey) {
            assign_del();
        }
    })
})

function backToList() {
    if (typeof (backToList_overrided) != "undefined")
        backToList_overrided();
}

function itemChange(elem) {

    var rowCount = $(elem).parents(".card-body tbody").find("tr").length;
    var pagetable_id = $(elem).parents(".card-body").attr("id");
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetable_id);
    var isSelected = $(elem).prop("checked");
    var primaryData = $(elem).parents("tr").data();

    if (isSelected === true) {
        var checks = $(`#${pagetable_id} input[type='checkbox']`);
        var count = 0;
        $.each(checks, function (k, v) {
            if ($(v).prop("checked") == true)
                count += 1;
        })

        if (count >= rowCount) {
            var pagetable = $($(elem).parents(".card-body")[0]);
            $(pagetable).find("input[type='checkbox']").first().prop("checked", true);
        }

        var item = "{ ";
        $.each(primaryData, function (k, v) {
            item += `"${k}": "${v}",`;
        })
        item += "}";
        item = item.replace(",}", "}");

        if (index == 0) {
            modelDiAssign.push(JSON.parse(item));

            if (typeof (refresh_diAssignListCount_func) != "undefined")
                refresh_diAssignListCount_func(modelDiAssign.length);
            else
                $("#deassign-list-count").html("تعداد انتخاب شده: " + modelDiAssign.length);

        }
        else {
            modelAssign.push(JSON.parse(item));

            if (typeof (refresh_assignListCount_func) != "undefined")
                refresh_assignListCount_func(modelAssign.length);
            else
                $("#assign-list-count").html("تعداد انتخاب شده: " + modelAssign.length);

        }
    }
    else {
        var pagetable = $($(elem).parents(".card-body")[0]);
        $(pagetable).find("input[type='checkbox']").first().prop("checked", false);

        if (index == 0) {

            var validCount = 0;
            var primaryCount = 0;

            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");
            primaryData = JSON.parse(item)

            $.each(modelDiAssign, function (k, v) {
                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (primaryData[key] == val)
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    modelDiAssign = jQuery.grep(modelDiAssign, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })
            if (typeof (refresh_diAssignListCount_func) != "undefined")
                refresh_diAssignListCount_func(modelDiAssign.length);
            else
                $("#deassign-list-count").html("تعداد انتخاب شده: " + modelDiAssign.length);

        }
        else {
            var validCount = 0;
            var primaryCount = 0;

            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");
            primaryData = JSON.parse(item)

            $.each(modelAssign, function (k, v) {

                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (primaryData[key] == val)
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    modelAssign = jQuery.grep(modelAssign, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })

            if (typeof (refresh_assignListCount_func) != "undefined")
                refresh_assignListCount_func(modelAssign.length);
            else
                $("#assign-list-count").html("تعداد انتخاب شده: " + modelAssign.length);

        }
    }
}

function ins_del_assign(apiUrl, op, p_modelAssign, callback = undefined, callbackResponse = undefined) {

    if (callback === undefined)
        return;

    var resultCallback = callback();

    if (!resultCallback.successfull) {
        var err = alertify.warning(resultCallback.messageError);
        err.delay(alertify_delay);
        return
    }
    if ((op == "Ins" && modelDiAssign.length > 0) || (op == "Del" && modelAssign.length > 0)) {
        p_modelAssign["Assign"] = op == "Ins" ? modelDiAssign : modelAssign;

        $.ajax({
            url: apiUrl,
            type: "POST",
            data: JSON.stringify(p_modelAssign),
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success: function (result) {

                if (result.successfull) {

                    modelDiAssign = [];
                    modelAssign = [];
                    if (typeof (refresh_assignListCount_func) != "undefined")
                        refresh_assignListCount_func(modelAssign.length);
                    else
                        $("#assign-list-count").html("تعداد انتخاب شده: " + modelAssign.length);

                    if (typeof (refresh_diAssignListCount_func) != "undefined")
                        refresh_diAssignListCount_func(modelDiAssign.length);
                    else
                        $("#deassign-list-count").html("تعداد انتخاب شده: " + modelDiAssign.length);

                    pagetableGotopage(1, pageTableId1);
                    pagetableGotopage(1, pageTableId2);
                }
                else {
                    if (checkResponse(result.statusMessage)) {
                        var err = alertify.error(result.statusMessage);
                        err.delay(alertify_delay);
                    }
                    else {
                        var err = alertify.error("خطا در انجام عملیات");
                        err.delay(alertify_delay);
                    }

                }
            },
            error: function (xhr) {
                error_handler(xhr, apiUrl)
            }
        });
    }
    else {
        var err = alertify.warning("حداقل یک سطر را انتخاب نمایید");
        err.delay(alertify_delay);
    }


}

function set_assignedCountDiv_id() {
    $(`#${pageTableId1} .selected-list`).attr("id", "deassign-list-count");
    $(`#${pageTableId2} .selected-list`).attr("id", "assign-list-count");
}

function bind_formPlate2(model, callback = undefined) {
    if (typeof callback != "undefined")
        after_pageTable2 = callback;

    pageTableId1 = model.pageTableId1 != undefined ? model.pageTableId1 : "pagetable1";
    pageTableId2 = model.pageTableId2 != undefined ? model.pageTableId2 : "pagetable2";

    set_assignedCountDiv_id();

    modelAssign = [];
    modelDiAssign = [];
    arr_pagetables2 = [];
    pagetable_formkeyvalue = [];
    var pagelist1 = { pagetable_id: pageTableId1, editable: true, selectable: true, isRowIndex: false, pagerowscount: 15, currentpage: 1, lastpage: 1, currentrow: 1, currentcol: 0, highlightrowid: 0, trediting: false, filteritem: "", filtervalue: "", getpagetable_url: model.url1_Pagetable, getfilter_url: model.url_Filter1 },
        pagelist2 = { pagetable_id: pageTableId2, editable: true, selectable: true, isRowIndex: false, pagerowscount: 15, currentpage: 1, lastpage: 1, currentrow: 1, currentcol: 0, highlightrowid: 0, trediting: false, filteritem: "", filtervalue: "", getpagetable_url: model.url2_Pagetable, getfilter_url: model.url_Filter2 }
    arr_pagetables2.push(pagelist1);
    arr_pagetables2.push(pagelist2);

    if (model.arrFormkeyValue === undefined) {
        pagetable_formkeyvalue.push(model.Id);
        pagetable_formkeyvalue.push(model.publicTypeid);
    }
    else {
        pagetable_formkeyvalue = model.arrFormkeyValue;
    }

    var pageTableLoadedCount = 0

    get_pagetable2(pageTableId1, false, false, function () {
        pageTableLoadedCount += 1;

        if (pageTableLoadedCount == 2 && typeof callback != "undefined")
            callback();
    });

    get_pagetable2(pageTableId2, false, false, function () {
        pageTableLoadedCount += 1;

        if (pageTableLoadedCount == 2 && typeof callback != "undefined")
            callback();
    });

}

function changeAll(elem) {

    var validCount = 0;
    var primaryCount = 0;

    var pagetable = $(elem).closest(".card-body");
    var checks = $(pagetable).find("input[type='checkbox']");
    var pagetable_id = $(elem).parents(".card-body").attr("id");
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetable_id);

    if ($(checks).prop("checked") == true) {

        $(pagetable).find("input[type='checkbox']").prop("checked", true);

        var rowsCount = +$(`#${pagetable_id} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var isSelected = +$(`#${pagetable_id} .pagetablebody > tbody > #row${i} > #col_${i}_1 > input[type="checkbox"]`).prop("checked");
            var primaryData = $(`#${pagetable_id} .pagetablebody > tbody > #row${i}`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}").replaceAll("\n", "");

            var itemRes = JSON.parse(item);

            if (index == 0) {
                $.each(modelDiAssign, function (k, v) {
                    $.each(v, function (key, val) {
                        primaryCount += 1;

                        if (itemRes[key] == val)
                            validCount += 1;

                    })
                    if (validCount == primaryCount) {
                        modelDiAssign = jQuery.grep(modelDiAssign, function (value) {
                            return value != v;
                        });
                    }
                    primaryCount = 0;
                    validCount = 0;
                })

                modelDiAssign.push(itemRes);
                if (typeof (refresh_diAssignListCount_func) != "undefined")
                    refresh_diAssignListCount_func(modelDiAssign.length);
                else
                    $("#deassign-list-count").html("تعداد انتخاب شده: " + modelDiAssign.length);
            }
            else {
                $.each(modelAssign, function (k, v) {
                    $.each(v, function (key, val) {
                        primaryCount += 1;

                        if (itemRes[key] == val)
                            validCount += 1;
                    })
                    if (validCount == primaryCount) {
                        modelAssign = jQuery.grep(modelAssign, function (value) {
                            return value != v;
                        });
                    }
                    primaryCount = 0;
                    validCount = 0;
                })
                modelAssign.push(itemRes);
                if (typeof (refresh_assignListCount_func) != "undefined")
                    refresh_assignListCount_func(modelAssign.length);
                else
                    $("#assign-list-count").html("تعداد انتخاب شده: " + modelAssign.length);

            }
        }
    }
    else {
        $(pagetable).find("input[type='checkbox']").prop("checked", false);

        var rowsCount = +$(`#${pagetable_id} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var primaryData = $(`#${pagetable_id} .pagetablebody > tbody > #row${i}`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");

            var itemRes = JSON.parse(item);

            if (index == 0) {
                $.each(modelDiAssign, function (k, v) {
                    $.each(v, function (key, val) {
                        $.each(itemRes, function (ky, vl) {
                            primaryCount += 1;
                            if (itemRes[key] == val)
                                validCount += 1;
                        })
                        if (validCount == primaryCount) {
                            modelDiAssign = jQuery.grep(modelDiAssign, function (value) {
                                return value != v;
                            });
                        }
                        primaryCount = 0;
                        validCount = 0;
                    })

                })

                if (typeof (refresh_diAssignListCount_func) != "undefined")
                    refresh_diAssignListCount_func(modelDiAssign.length);
                else
                    $("#deassign-list-count").html("تعداد انتخاب شده: " + modelDiAssign.length);
            }
            else {
                $.each(modelAssign, function (k, v) {
                    $.each(v, function (key, val) {
                        $.each(itemRes, function (ky, vl) {
                            primaryCount += 1;
                            if (itemRes[key] == val)
                                validCount += 1;
                        })
                        if (validCount == primaryCount) {
                            modelAssign = jQuery.grep(modelAssign, function (value) {
                                return value != v;
                            });
                        }
                        primaryCount = 0;
                        validCount = 0;
                    })

                })

                if (typeof (refresh_assignListCount_func) != "undefined")
                    refresh_assignListCount_func(modelAssign.length);
                else
                    $("#assign-list-count").html("تعداد انتخاب شده: " + modelAssign.length);
            }
        }
    }
}

function handlerInsert(pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";
    let elmenet = $(`#${pg_id} .table-responsive`);
    let elmenetjs = document.querySelector(`#${pg_id} .table-responsive`);

    elmenetjs.addEventListener('wheel', (event) => {
        if (elmenetjs.scrollHeight <= elmenetjs.offsetHeight)
            insertfirstPage(pg_id, event)
    });

    elmenet.on('scroll', (e) => {
        //if (elmenet[0].scrollHeight - elmenet.scrollTop() + 10 >= elmenet.outerHeight()) {
        if (elmenetjs.offsetHeight + elmenetjs.scrollTop + 10 >= elmenetjs.scrollHeight) {
            if (elmenetjs.scrollTop != 0)
                insertNewPage(pg_id);
        }
    });
}

function insertfirstPage(pg_id, e) {

    if (e.deltaY > 0) {
        let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id),
            pagetable_currentpage = arr_pagetables2[index].currentpage;
        if (pagetable_currentpage == 1)
            insertNewPage(pg_id);
    }
}

function createPageCounters(pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";
    let length = arrayCounts.length, outPut = "";

    for (var i = 0; i < length; i++)
        outPut += `<a class="dropdown-item" onclick="changePageRowsCount(${arrayCounts[i]},'${pg_id}'); return false;">${arrayCounts[i]}</a>`;

    let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    let currentCount = arr_pagetables2[index].pagerowscount;

    $(`#${pg_id} #dropCounteresPageTable`).html(outPut);
    $(`#${pg_id} #dropCounteresPageTableName`).text(currentCount);
}

function changePageRowsCount(count, pg_id = null) {

    if (pg_id == null) pg_id = "pagetable";

    $(`#${pg_id} .pagerowscount #dropCounteresPageTableName`).text(count);
    let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables2[index].pagerowscount = count;
    get_pagetable2(pg_id, false, false, undefined);
}

function fillOption(result, pg_id = null, fromChangeFilter) {
    if (pg_id == null) pg_id = "pagetable";

    let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables2[index].currentrow = 1;
    arr_pagetables2[index].endData = false;

    if (typeof csvModel !== "undefined") csvModel = null;

    handlerInsert(pg_id);
    createPageCounters(pg_id);
    fill_filter_items2(arr_pagetables2[index].getfilter_url, pg_id, fromChangeFilter);
}

function insertNewPage(pg_id) {
    let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id),
        pagetable_pageNo = arr_pagetables2[index].pageNo,
        pagetable_currentpage = arr_pagetables2[index].currentpage,
        pagetable_pagerowscount = arr_pagetables2[index].pagerowscount,
        pagetable_endData = arr_pagetables2[index].endData,
        lastPageloaded = arr_pagetables2[index].lastPageloaded,
        pageNo = 0;

    if (!pagetable_endData && +pagetable_pageNo == lastPageloaded) {
        pageNo = $(`#${pg_id} .pagetablebody tbody tr`).length;
        arr_pagetables2[index].currentpage = pagetable_currentpage + 1;
        arr_pagetables2[index].pageNo = pageNo;
        get_pagetable2(pg_id, true);
    }
}

function get_pagetable2(pg_id = null, isInsert = false, fromChangeFilter, callback = undefined) {
    if (pg_id == null)
        pg_id = "pagetable";


    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables2[index].pageNo = 0;
        arr_pagetables2[index].currentpage = 1;
    }

    var pagetable_currentpage = arr_pagetables2[index].currentpage;
    var pagetable_lastpage = arr_pagetables2[index].lastpage;
    var pagetable_pageNo = arr_pagetables2[index].pageNo;
    var pagetable_filteritem = arr_pagetables2[index].filteritem;
    var pagetable_filtervalue = arr_pagetables2[index].filtervalue;
    var pagetable_url = arr_pagetables2[index].getpagetable_url;
    var pagetable_filter = arr_pagetables2[index].getfilter_url

    if (pagetable_laststate == "nextpage") {
        if (pagetable_currentpage < pagetable_lastpage)
            pagetable_currentpage++;
    }
    else if (pagetable_laststate == "prevpage") {
        if (pagetable_currentpage > 1)
            pagetable_currentpage--;
    }

    arr_pagetables2[index].currentpage = pagetable_currentpage;

    var pagetable_pagerowscount = arr_pagetables2[index].pagerowscount;
    if (pagetable_pagerowscount === 0)
        pagetable_pagerowscount = $(`#${pg_id} .pagerowscount > button:first`).text();

    if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && pagetable_filtervalue == "") {
        var msg = alertify.error('عبارت فیلتر وارد نشده');
        msg.delay(alertify_delay);
        return;
    }

    if (pagetable_filtervalue != "" && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
        var msg = alertify.error('مورد فیلتر انتخاب نشده');
        msg.delay(alertify_delay);
        return;
    }

    var pageViewModel = {
        pageno: pagetable_pageNo,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue
    }

    pageViewModel.Form_KeyValue = pagetable_formkeyvalue;

    var url = "", filterUrl = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    if (pagetable_filter === undefined)
        filterUrl = viewData_filter_url;
    else
        filterUrl = pagetable_filter;
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            if (pagetable_currentpage == 1)
                fillOption(result, pg_id, fromChangeFilter);

            fill_pagetable2(result, pg_id);

            //fill_filter_items2(filterUrl, pg_id, fromChangeFilter);
            if (detect_Mobile())
                pagetablePagination_mobile(result.maxPageCount, pagetable_currentpage, pg_id);
            else
                pagetablePagination(result.maxPageCount, pagetable_currentpage, pg_id);
            //pagetablePagefooterinfo(result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);

            if (typeof callback != "undefined") {
                callback();
                return;
            }

            if (typeof after_pageTable2 != "undefined") {
                after_pageTable2();
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function fill_pagetable2(result, pageId) {

    if (!result) return "";
    var columns = result.columns.dataColumns;
    var buttoncount = 2;
    var buttons = result.columns.buttons;

    if (buttons != null)
        buttoncount += buttons.length;
    var list = result.data != null ? result.data.assigns : null;
    var listLength = list.length;

    if (result.data != null)
        if (typeof fill_header === "function")
            fill_header(result.data);

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pageId);
    arr_pagetables2[index].editable = result.columns.isEditable;
    var pagetable_editable = arr_pagetables2[index].editable;
    var pagetable_pagerowscount = arr_pagetables2[index].pagerowscount;
    var pagetable_isRowIndex = arr_pagetables2[index].isRowIndex;
    var pagetable_currentpage = arr_pagetables2[index].currentpage;
    var pagetable_pageNo = arr_pagetables2[index].pageNo;
    var pagetable_selectable = arr_pagetables2[index].selectable;
    var pagetable_highlightrowid = arr_pagetables2[index].highlightrowid;
    var pagetable_endData = arr_pagetables2[index].endData;

    if (!pagetable_endData) {
        arr_pagetables2[index].endData = listLength < pagetable_pagerowscount;

        pagetable_hasfilter2(pageId, result.columns.hasFilter);

        var elm_pbody = $(`#${pageId} .pagetablebody`),
            rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (pagetable_currentpage == 1)
            elm_pbody.html("");
        var str = "";

        var btn_tbidx = 1000;
        if (pagetable_currentpage == 1) {
            let col = {}, width = 0;
            rowLength = 0;

            str += '<thead>';
            str += '<tr>';

            if (pagetable_editable == true)
                str += '<th style="width:5%"></th>';
            if (pagetable_selectable == true)
                str += '<th style="width:3%;text-align:center !important"><input onchange="changeAll(this)" class="checkall" type="checkbox"></th>';

            if (pagetable_isRowIndex == true)
                str += '<th style="width:5%">ردیف</th>';

            for (var i in columns) {
                col = columns[i];
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
        }
        else
            elm_pbody = $(`#${pageId} .pagetablebody tbody`);


        if ((list == null || list.length == 0) && rowLength == 0) {
            var columnCount = 0;
            if (pagetable_editable)
                columnCount++;
            if (pagetable_selectable)
                columnCount++;

            str += fillEmptyRow(columns.filter(a => a.isDtParameter).length + columnCount);
        }
        else
            for (var i = 0; i < listLength; i++) {
                var item = list[i];
                var rowno = rowLength + (+i) + 1;
                var colno = 2;
                var colwidth = 0;
                for (var j in columns) {
                    var primaries = "";

                    $.each(columns, function (k, v) {
                        if (v["isPrimary"] === true)
                            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                    })
                    colwidth = columns[j].width;

                    if (j == 0) {
                        if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                            str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-2">';
                        }
                        else {
                            str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                        }

                        if (pagetable_editable)
                            str += `<td id="col_${rowno}_0" style="width:5%"></td>`;

                        if (pagetable_selectable) {
                            str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox" `;

                            var index = arr_pagetables2.findIndex(v => v.pagetable_id == pageId);

                            if (index == 0) {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelDiAssign, function (k, v) {
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

                            }
                            if (index == 1) {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelAssign, function (k, v) {
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
                            }
                            str += '</td >';
                        }

                        if (pagetable_isRowIndex == true) {
                            if (arr_pagetables2[index].currentpage == 1)
                                str += `<td id="col_${rowno}_2" style="width:5%">${parseInt(i) + 1}</td>`;
                            else
                                str += `<td id="col_${rowno}_2" style="width:5%">${(parseInt(i) + 1) + ((arr_pagetables2[index].currentpage - 1) * arr_pagetables2[index].pagerowscount)}</td >`;
                        }
                    }

                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];
                            if (columns[j].editable) {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;
                                if (columns[j].inputType == "select") {
                                    str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="trOnfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs.length;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];

                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="trOnfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="trOnfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input type="checkbox" name="checkbox" id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                                }
                                else if (columns[j].inputType == "searchplugin") {

                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="trOnfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled />`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="trOnfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled />`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="trOnfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled />`;
                                else
                                    str += `<input type="text" value="${value}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="trOnfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled />`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onfocus="trOnfocus('${pageId}',${colno})" autocomplete="off" readonly />`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="trOnfocus('${pageId}',${colno})" autocomplete="off" readonly />`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onfocus="trOnfocus('${pageId}',${colno})"  autocomplete="off" readonly />`;
                                else
                                    str += `<input type="text" value="${value}" class="form-control" onfocus="trOnfocus('${pageId}',${colno})" autocomplete="off" readonly />`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
                                    if (value != null && value != "") {
                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5) {
                                            value = value.toString().split('.').join("/");
                                        }
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
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
                                        str += `<td style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {

                            if (result.columns.actionType === "dropdown") {
                                str += `<td style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                for (var k in buttons) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                    }
                                    else
                                        str += `<div class="button-seprator-hor"></div>`;
                                }

                                str += `</div>
                                </div>`;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td style="width:${colwidth}%">`;

                                for (var k in buttons) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button type="button" id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                    }
                                    else
                                        str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                        //else {
                        //    str += `<td style="width:${colwidth}%">`;

                        //    for (var k in buttons) {
                        //        var btn = buttons[k];
                        //        if (btn.isSeparator == false) {
                        //            btn_tbidx++;
                        //            str += `<button type="button" id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]})" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                        //        }
                        //        else
                        //            str += `<span class="button-seprator-ver"></span>`;
                        //    }

                        //    str += '</td>';
                        //}
                    }


                }

                str += '</tr>';

            }
        str += '</tbody>';

        elm_pbody.append(str);

        //var pagetable_currentrow = arr_pagetables2[index].currentrow;
        //var pagetable_currentcol = arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pageId);

        //if (pagetable_laststate == "" && pagetable_currentrow != 0) {
        //    var elm_pbody_row = elm_pbody.find(`tbody >  #row${pagetable_currentrow}`)
        //    if (elm_pbody_row[0] == undefined) {
        //        pagetable_currentrow = 1;
        //        arr_pagetables2[index].currentrow = pagetable_currentrow;
        //    }

        //    elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).addClass("highlight");
        //    elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus();

        //    if (pagetable_editable)
        //        $(`td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:first,select:first").focus();
        //}
        //else if (pagetable_laststate == "" || pagetable_laststate == "nextpage") {
        //    pagetable_currentrow = 1;
        //    arr_pagetables2[index].currentrow = pagetable_currentrow;

        //    elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        //    elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
        //}
        //else if (pagetable_laststate == "prevpage") {

        //    pagetable_currentrow = +elm_pbody.find("tbody > tr:last").attr("id").replace(/row/g, "");
        //    arr_pagetables2[index].currentrow = pagetable_currentrow;

        //    elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        //    elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
        //}

        //pagetable_laststate = "";

        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo);

        if ((list == null || list.length == 0) && rowLength > 0) {
            arr_pagetables2[index].currentpage -= 1;
            $("#currentPage").text(arr_pagetables2[index].currentpage);
        }
    }
}

function afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo) {

    if ($(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length > 0)
        createPageFooterInfo(1, $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length, pagetable_currentpage, pageId);
    else
        createPageFooterInfo(0, 0, 0, pageId);

    let pagetable_currentrow = arr_pagetables2[index].currentrow;
    elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus().addClass("highlight");

    //if ($("#parentPageTableBody").prop('scrollHeight') <= $("#parentPageTableBody").height() && pagetable_currentpage == 1)
    //    insertNewPage(pageId);

    let dataDatePicker = $(".persian-datepicker"), dataDatePickerL = $(".persian-datepicker").length;
    for (var i = 0; i < dataDatePickerL; i++)
        kamaDatepicker(`${$(dataDatePicker[i]).attr('id')}`, { withTime: false, position: "bottom" });

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pageId);
    arr_pagetables2[index].lastPageloaded = pagetable_pageNo
}

function createPageFooterInfo(first, last, pageNo, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";

    $(`#${pg_id} #firstRow`).text(first);
    $(`#${pg_id} #lastRow`).text(last);
    $(`#${pg_id} #currentPage`).text(pageNo);
}

function fill_filter_items2(p_url, pg_name = null, fromChangeFilter) {
    pg_name = pg_name == null ? "pagetable" : pg_name;

    $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        success: function (result) {
            if (result) {
                if (!result.hasFilter)
                    return;
                var list = result.dataColumns;
                var str = '<div>';
                var filterLength = list.length;
                for (var i = 0; i < filterLength; i++) {
                    var item = list[i];
                    if (item.isFilterParameter)
                        str += `<button class="dropdown-item" id="filter_${item.id}" data-input="${item.filterType}" data-api="${item.filterTypeApi}" onclick="pagetable_changefilteritem2('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}',this)">${item.title}</button>`;
                }

                str += "</div>";

                $(`#${pg_name} .filteritems`).html(str);

                if (fromChangeFilter != true) {
                    var elm_v = $(`#${pg_name} .filtervalue`);
                    elm_v.val("");
                    var parentfilterVal = elm_v.parents(".app-search");

                    var outPut = "";
                    $(parentfilterVal).find(".filtervalue").remove();
                    outPut = `<input type="text" class="form-control filtervalue" onkeypress="filter_value_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>`;
                    $(parentfilterVal).html(outPut);

                    let elm = $(`#${pg_name} .btnfilter`);
                    elm.text("مورد فیلتر");

                    $(`#${pg_name} .btnRemoveFilter`).addClass("d-none");
                    $(`#${pg_name} .btnOpenFilter`).removeClass("d-none");

                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function resetFilterInput(parentfilterVal, pg_name) {
    let outPut = "";
    $(parentfilterVal).find(".filtervalue").remove();
    outPut = `
                    <input type="text" class="form-control filtervalue" onkeypress="filter_value_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
                                `
    $(parentfilterVal).html(outPut);
    elm_v = $(`#${pg_name} .filtervalue`);

};

function pagetable_changefilteritem2(itemid, title, type, size, pg_name, elmDrop = null) {
    let index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    let elm = $(`#${pg_name} .btnfilter`);
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);
    arr_pagetables2[index].filteritem = itemid;

    let elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    if (elmDrop == null) {

        resetFilterInput(elm_v.parents(".app-search"), pg_name);
        arr_pagetables2[index].filtervalue = "";

        if (itemid.toLowerCase().indexOf("date") >= 0)
            elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
        else
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    }
    else {
        let type = $(elmDrop).data("input"),
            api = $(elmDrop).data("api"),
            parentfilterVal = elm_v.parents(".app-search"),
            outPut = "";


        if (!elm_v.hasClass("select2") && !elm_v.hasClass("double-input"))
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir").attr("class", "form-control filtervalue");
        else
            resetFilterInput(parentfilterVal, pg_name);


        switch (type) {
            case "text":
                elm_v.addClass("text-filter-value");
            case "number":
            case "money":
            case "decimal":
                elm_v.addClass(type);
                break;

            case "strnumber":
                elm_v.addClass("str-number");
                break;

            case "persiandate":
                elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
                break;

            case "doublepersiandate":
                //elm_v.inputmask("9999/99/99     9999/99/99", {
                //    "placeholder": "(از)" + "/__/__     " + "(تا)" + "/__/__"
                //}).attr("dir", "ltr");
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `
                    <div class="double-input-box">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filter_value_onkeypress(event, 'next')" oninput="filtervalue_onInput(event, this)"   data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filter_value_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)"  data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                            <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
                    <div>`;

                $(parentfilterVal).html(outPut);
                $(`#${pg_name} .filtervalue`).inputmask();
                $(`#${pg_name} .filtervalue.double-input:eq(0)`).focus();
                break;

            case "select2":
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `<select id="${itemid}" class="form-control select2 filtervalue" onChange="filtervalue_onChange(this)"></select>`;
                $(parentfilterVal).html(outPut);
                fill_select2(api, `${pg_name} #${itemid}`, true, 0, false, 0, "انتخاب کنید", () => { $(`#${pg_name} #${itemid}`).select2(); });

                break;

            default:
                break;
        }

    }

    if (itemid === "filter-non") {
        resetFilterInput(elm_v.parents(".app-search"), pg_name);
        get_pagetable2(pg_name);
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function filtervalue_onChange(fltvalue) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables2[index].filtervalue = $(fltvalue).val();

    if (+$(fltvalue).val() !== 0)
        get_pagetable2(pagetableId, false, true);
}

function filtervalue_onInput(e, fltvalue) {

    if (e.which != 13) {

        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables2[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
    }
}

function filter_value_onkeypress(e, fltvalue) {
    if (e.which == 13) {

        e.preventDefault();

        if (fltvalue == "next") {
            $(e.currentTarget).next().val(e.currentTarget.value).focus();
            selectText($(e.currentTarget).next());
            return;
        }

        var pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id");
        var index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables2[index].currentrow = 1;


        if ($(fltvalue).hasClass("double-input")) {
            let isValidInputDates = checkValidInputDates(pagetableId, $(fltvalue), index)
            if (!isValidInputDates)
                return

            arr_pagetables2[index].filtervalue = genarateValueFilter($(fltvalue))
        }
        else {
            arr_pagetables2[index].filtervalue = $(fltvalue).val()
        }

        //arr_pagetables2[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();

        get_pagetable2(pagetableId, false, true);
    }
}

function filtervalue_onsearchclick(elm_search) {

    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetableId);

    let elm = $(elm_search)


    if (!elm.prev("input").hasClass("double-input")) {
        arr_pagetables2[index].filtervalue = elm.prev("input").val();
    }
    else {
        let isValidInputDates = checkValidInputDates(pagetableId, elm.prev("input"), index)
        if (!isValidInputDates)
            return

        arr_pagetables2[index].filtervalue = genarateValueFilter(elm.prev("input"))
    }

    get_pagetable2(pagetableId, false, true);
}

function checkValidInputDates(pagetableId, fltvalue, index) {

    let filterValueEndTime = fltvalue
    let filterValueStartTime = fltvalue.prev("input")


    let filterValueEndTimeVal = filterValueEndTime.val()
    let filterValueStartVal = filterValueStartTime.val()

    if (!isValidShamsiDate(filterValueStartVal)) {
        alertify.warning('فرمت تاریخ صحیح نیست').delay(alertify_delay);
        filterValueStartTime.select()
        return false
    }
    else if (!isValidShamsiDate(filterValueEndTimeVal)) {
        alertify.warning('فرمت تاریخ صحیح نیست').delay(alertify_delay);
        filterValueEndTime.select()
        return false
    }

    if (!compareShamsiDate(filterValueStartVal, filterValueEndTimeVal)) {
        alertify.warning('تاریخ شروع باید کوچکتر از تاریخ پایان باشد.').delay(alertify_delay);
        filterValueStartTime.select()
        return false
    }

    return true
}

function pagetablePagination_mobile(max, pageno, pg_id) {

    $(`#${pg_id} .pagination`).html("");
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables2[index].lastpage = max;
    arr_pagetables2[index].currentpage = pageno
    var str = "";
    if (pageno == 1)
        str += "<li class='page-item disabled'>";
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetableGotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    if (max < 4) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else {
        if (pageno > 1 && pageno < max) {
            str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetableGotopage(1,\'' + pg_id + '\')">' + 1 + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
            str += '<li class="page-item active"><button class="page-link" onclick="#">' + pageno.toString() + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetableGotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
        else {
            if (pageno == 1)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(1,\'' + pg_id + '\')">1</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(1,\'' + pg_id + '\')">1</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            if (pageno == max)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">' + max.toString() + '</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
    }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetableGotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function pagetablePagination(max, pageno, pg_id) {
    $(`#${pg_id} .pagination`).html("");
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables2[index].lastpage = max;
    arr_pagetables2[index].currentpage = pageno;

    var str = "";
    if (pageno == 1)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetableGotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    var br = 5;
    if (max <= 7) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else
        if (pageno < br)
            for (i = 1; i <= max; i++) {
                if (i == pageno) {
                    str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                }
                else {
                    if (i <= br || i == max)
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    if (i == br) {
                        str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                    }
                }
            }
        else
            if (pageno >= br && pageno <= max - br + 1)
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                        str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetableGotopage(' + (i - 1).toString() + ',\'' + pg_id + '\')">' + (i - 1).toString() + '</button></li>';
                        str += '<li class="page-item active"><button class="page-link" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + (i + 1).toString() + ',\'' + pg_id + '\')">' + (i + 1).toString() + '</button></li>';
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                    }
                    else {
                        if (i == 1 || i == max)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                }
            else
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                    else {
                        if (i == 1 || i > max - br)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetableGotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        if (i == max - br) {
                            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                        }
                    }
                }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetableGotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function pagetableChange_pagerowscount(count, elem) {
    var pagetableid = $(elem).parent().parent().parent().parent().parent().parent().attr("id");
    $(`#${pagetableid} .pagerowscount > button:first`).text(count);
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pagetableid);
    arr_pagetables2[index].pagerowscount = count;
    arr_pagetables2[index].currentpage = 1;
    arr_pagetables2[index].currentrow = 1;
    get_pagetable2(pagetableid);
}

//function pagetablePagefooterinfo(count, from, to, pg_id) {
//    $(`#${pg_id} .pagetablefooterinfo`).html("");
//    str = '<div class="dataTables_info text-right">نمایش ' + from.toString() + ' تا ' + to.toString() + ' از ' + count.toString() + ' سطر</div>';
//    $(`#${pg_id} .pagetablefooterinfo`).append(str);
//}

function get_FirstColIndexHasInput(pg_name) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    var pagetable_editable = arr_pagetables2[index].editable;
    var pagetable_selectable = arr_pagetables2[index].selectable;

    if (pagetable_editable) {
        var p_Elmbody = $(`#${pg_name} .pagetablebody`);
        var td_id_has_elm = p_Elmbody.find(`tbody >  #row${pagetable_currentrow} > td > input:not([type='checkbox']),tbody >  #row${pagetable_currentrow} > td > select:first:not([readonly]),tbody >  #row${pagetable_currentrow} > td  > .funkyradio >input`).closest("td").attr("id");

        if (checkResponse(td_id_has_elm)) {
            var index_uline_Second = td_id_has_elm.indexOf("_", td_id_has_elm.indexOf("_") + 1);
            var column_index = td_id_has_elm.replace(td_id_has_elm.substring(0, index_uline_Second + 1), "");
            return +column_index;
        }

    }
}

var remove_filter = (elem) => {
    var pagetableId = $(elem).closest(".card-body").attr("id");
    $(`#${pagetableId} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetableId} .btnOpenFilter`).removeClass("d-none");
    pagetable_changefilteritem2('filter-non', 'مورد فیلتر', '0', '0', pagetableId);
}

function pagetable_hasfilter2(pg_name, hasFilter) {
    if (!hasFilter)
        $(`#${pg_name} .filterBox`).addClass("d-none");
    else
        $(`#${pg_name} .filterBox`).removeClass("d-none");
}

function pagetableGotopage(pageno = 0, pg_id) {
    if (pageno === 0) pageno = 1;
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables2[index].currentpage = pageno;

    get_pagetable2(pg_id, false, true);
}

function pagetableNextpage(pagetable_id) {
    pagetable_laststate = "nextpage";
    get_pagetable2(pagetable_id);
}

function pagetablePrevpage(pagetable_id) {
    pagetable_laststate = "prevpage";
    get_pagetable2(pagetable_id);
}

function trOnkeydown(ev, pg_name) {
    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space].indexOf(ev.which) == -1) return;

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables2[index].currentcol;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    var pagetable_currentpage = arr_pagetables2[index].currentpage;
    var pagetable_lastpage = arr_pagetables2[index].lastpage;
    var pagetable_selectable = arr_pagetables2[index].selectable;
    var pagetable_editable = arr_pagetables2[index].editable;
    var pagetable_tr_editing = arr_pagetables2[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;


    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_row2(pagetable_id, KeyCode.ArrowUp);
            }
            else {
                pagetable_currentrow--;
                arr_pagetables2[index].currentrow = pagetable_currentrow;
                after_change_tr2(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_row2(pagetable_id, KeyCode.ArrowUp);
            }
            //else if (pagetable_currentpage !== 1)
            //    pagetablePrevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_row2(pagetable_id, KeyCode.ArrowDown);
            }
            else {
                pagetable_currentrow++;
                arr_pagetables2[index].currentrow = pagetable_currentrow;

                after_change_tr2(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_row2(pagetable_id, KeyCode.ArrowDown);
            }
            //else if (pagetable_currentpage != pagetable_lastpage) {
            //    arr_pagetables2[index].currentrow = 1;
            //    pagetableNextpage(pagetable_id);
            //}
        }
    }
    else if (ev.which === KeyCode.Enter) {

        if (pagetable_editable) {

            if (!pagetable_tr_editing)
                pagetable_currentcol = arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pg_name);

            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio").first()
            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editing2(pg_name);

                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else
                        currentElm.focus();
                }
                else {

                    var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input,select,div.funkyradio").first();
                    // المنت بعدی وجود داشت
                    if (nextElm.length != 0) {
                        if (nextElm.hasClass("funkyradio")) {
                            nextElm.focus();

                            var td_lbl_funkyradio = nextElm.find("label");
                            td_lbl_funkyradio.addClass("border-thin");
                        }
                        else
                            nextElm.focus();
                    }
                    else {
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row2 === "function")
                                    tr_save_row2(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                arr_pagetables2[index].currentrow = pagetable_currentrow;

                                after_change_tr2(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row2 === "function")
                                    tr_save_row2(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetableNextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select").attr("disabled", true);
                }
            }
        }
    }
    else if (ev.which === KeyCode.Esc) {
        if (pagetable_editable) {
            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {

                after_change_tr2(pg_name, KeyCode.Esc);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);
                    pagetable_currentcol = arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pg_name);
                }
            }
            else {
                var modal_name = $(`#${pagetable_id}`).closest("div.modal").attr("id");
                //modal_close(modal_name);
            }
        }
    }
    else if (ev.which === KeyCode.Space) {
        if (pagetable_editable && pagetable_tr_editing) {

            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio")) {
                ev.preventDefault();
                var checkbox_funky = $(`#btn_${pagetable_currentrow}_${pagetable_currentcol}`)
                checkbox_funky.prop("checked", !checkbox_funky.prop("checked"))
            }
            else if (elm.prop("tagName").toLowerCase() === "select") {
                //var selected = $(elm)[0].selectedIndex;
                //$(elm).prop('selectedIndex', selected);
                //$(elm).click();
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

function trOnclick(pg_name, elm, evt) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    var trediting = arr_pagetables2[index].trediting;
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
    arr_pagetables2[index].currentrow = pagetable_currentrow;
    tr_Highlight2(pg_name);
    arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pg_name);
}

function tr_Highlight2(pg_name) {
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;

    $(`#${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

function trOnfocus(pg_name, colno) {
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    arr_pagetables2[index].currentcol = colno;
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var currentrow = arr_pagetables2[index].currentrow;
    var trediting = arr_pagetables2[index].trediting;

    if (trediting) {
        var elm = $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input[type=text]");
        if (!elm.hasClass("funkyradio"))
            elm.select();
    }
}

function after_save_row2(pg_name, result_opr, keycode, initial) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    var pagetable_currentpage = arr_pagetables2[index].currentpage;
    var pagetable_lastpage = arr_pagetables2[index].lastpage;
    var trediting = arr_pagetables2[index].trediting;

    if (trediting)
        initialRow2(pagetable_id, initial);

    if (keycode == KeyCode.ArrowDown) {
        // اگر سطر بعدی وجود داشت
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow++;
                arr_pagetables2[index].currentrow = pagetable_currentrow;

                tr_Highlight2(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow2(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage != pagetable_lastpage) {
                arr_pagetables2[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
            }
            else if (pagetable_currentpage == pagetable_lastpage)
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
        }
    }
    else if (keycode == KeyCode.ArrowUp) {
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow--;
                arr_pagetables2[index].currentrow = pagetable_currentrow >= 1 ? pagetable_currentrow : 1;
                tr_Highlight2(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow2(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage == 1) {
                if (result_opr == "success" || result_opr == "cancel")
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
                if (result_opr == "cancel")
                    initialRow2(pagetable_id, initial);
            }
            else if (pagetable_currentpage != 1)
                pagetable_prevpage(pagetable_id);
        }
    }

    arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pagetable_id);
}

function set_row_editing2(pg_name) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    var pagetable_editable = arr_pagetables2[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables2[index].currentcol = get_FirstColIndexHasInput(pg_name);

    if (pagetable_editable) {
        arr_pagetables2[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).append("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,div.funkyradio").attr("disabled", false);
    }
}

function initialRow2(pg_name, isInitial) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    arr_pagetables2[index].trediting = false;

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).find(".editrow").remove();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input:not([type='checkbox']),select,div.funkyradio").attr("disabled", true);
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio > label").removeClass("border-thin");

    if (isInitial) {
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input").val("");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("select").val("0").trigger("change");
    }

}

function after_change_tr2(pg_name, keycode) {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables2[index].pagetable_id;
    var currentrow = arr_pagetables2[index].currentrow;
    var tr_editing = arr_pagetables2[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_Highlight2(pg_name);
    if (keycode === KeyCode.Esc) {
        if (tr_editing) {
            initialRow2(pagetable_id, false);
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

function genarateValueFilter(element) {
    return $(element).val() + "-" + $(element).prev(".double-input").val();
}
