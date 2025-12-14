
var pagetable_id = "pagetable",
    pagetable_laststate = "",
    excelpagetable_formkeyvalue = [0],
    pagetable_filteritem = "",
    pagetable_filtervalue = "",
    pagetable_tr_editing = false,
    dataOrder = { colId: "", sort: "", index: 0 },
    OutPutCssTable = "",
    conditionTools = [],
    conditionAnswer = "",
    conditionElseAnswer = "",
    listForCondition = {},
    arraySearchPluginItems = [],
    excelPageInit = false,
    masterArray = [], masterArrayNoneFilter = [];

var excel_pagetables = [
    {
        pagetable_id: "pagetable",
        editable: false,
        pagerowscount: 15,
        currentpage: 1,
        lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        selectable: true,
        datarows: [],
        columns: [],
        errors: [],
    }
];

$('#hasErrorRows').bootstrapToggle();

$("#hasErrorRows").on("change", function () {
    if ($(".pagetablebodyEx tbody tr").length > 0)
        get_excelpagetable("tempimportExcelbody");
});

$('.table').keydown(function (e) {
    if ((e.keyCode == KeyCode.F2) || (e.ctrlKey && e.keyCode == KeyCode.Delete)) {
        e.preventDefault();

        var currow = $(`tr.highlight`).attr("id");

        //f2
        if (e.keyCode == KeyCode.F2) {
            $(`#btn_edit_${currow}`).click();
        }

        //del
        if (e.ctrlKey && e.keyCode == KeyCode.Delete) {
            $(`#btn_delete_${currow}`).click();
        }
    }
});

window.addEventListener("keydown", function (e) {

    // space and arrow keys
    if ([KeyCode.ArrowUp, KeyCode.ArrowDown].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function pagetable_hasfilter(pg_name, hasFilter) {
    if (!hasFilter)
        $(`#${pg_name} .filterBox`).addClass("d-none");
    else
        $(`#${pg_name} .filterBox`).removeClass("d-none");
}

function excelfiltervalue_onkeypress(e, fltvalue) {

    if (e.which == 13) {
        e.preventDefault();

        var pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id");

        var index = excel_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        excel_pagetables[index].currentrow = 1;
        excel_pagetables[index].filtervalue = $(fltvalue).val();
        get_excelpagetable(pagetableId);
    }
}

function filtervalue_onsearchclick(elm_search) {
    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    excel_pagetables[index].filtervalue = $(elm_search).prev("input").val();
    get_pagetable(pagetableId);
}

function fill_filter_items(result, pg_name = null) {
    pg_name = pg_name == null ? "pagetable" : pg_name;

    //$.ajax({
    //    url: p_url,
    //    type: "post",
    //    dataType: "json",
    //    contentType: "application/json",
    //    async: false,
    //    cache: false,
    //    success: function (result) {
    if (result) {

        if (!result.hasFilter)
            return;

        var list = result.dataColumns;
        var str = '<div>';
        var filterLength = list.length;
        for (var i = 0; i < filterLength; i++) {
            var item = list[i];
            if (item.isFilterParameter)
                str += `<button class="dropdown-item" onclick="javascript:excelpagetable_change_filteritem('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}')">${item.title}</button>`;
        }

        str += `<button class="dropdown-item" onclick="javascript:excelpagetable_change_filteritem('errorRows','سطرهای خطا دار','0','0','${pg_name}')">سطرهای خطا دار</button>`;


        str += "</div>";

        $(`#${pg_name} .filteritems`).html(str);
    }
    //    },
    //    error: function (xhr) {
    //        error_handler(xhr, p_url)
    //    }
    //});
}

function pagetable_pagination(max, pageno, pg_id) {
    $(`#${pg_id} .pagination`).html("");
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);
    excel_pagetables[index].lastpage = max;
    excel_pagetables[index].currentpage = pageno;

    var str = "";
    if (pageno == 1)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:excelpagetable_gotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    var br = 5;
    if (max <= 7) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else
        if (pageno < br)
            for (i = 1; i <= max; i++) {
                if (i == pageno) {
                    str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                }
                else {
                    if (i <= br || i == max)
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
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
                        str += '<li class="page-item"><button class="page-link" onclick="javascript:excelpagetable_gotopage(' + (i - 1).toString() + ',\'' + pg_id + '\')">' + (i - 1).toString() + '</button></li>';
                        str += '<li class="page-item active"><button class="page-link" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + (i + 1).toString() + ',\'' + pg_id + '\')">' + (i + 1).toString() + '</button></li>';
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                    }
                    else {
                        if (i == 1 || i == max)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                }
            else
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                    else {
                        if (i == 1 || i > max - br)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        if (i == max - br) {
                            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                        }
                    }
                }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:excelpagetable_gotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function pagetable_pagination_mobile(max, pageno, pg_id) {

    $(`#${pg_id} .pagination`).html("");

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);
    excel_pagetables[index].lastpage = max;
    excel_pagetables[index].currentpage = pageno
    var str = "";
    if (pageno == 1)
        str += "<li class='page-item disabled'>";
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:excelpagetable_gotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    if (max < 4) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else {
        if (pageno > 1 && pageno < max) {
            str += '<li class="page-item"><button class="page-link" onclick="javascript:excelpagetable_gotopage(1,\'' + pg_id + '\')">' + 1 + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
            str += '<li class="page-item active"><button class="page-link" onclick="#">' + pageno.toString() + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            str += '<li class="page-item"><button class="page-link" onclick="javascript:excelpagetable_gotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
        else {
            if (pageno == 1)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(1,\'' + pg_id + '\')">1</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(1,\'' + pg_id + '\')">1</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            if (pageno == max)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">' + max.toString() + '</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:excelpagetable_gotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
    }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:excelpagetable_gotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function excelpagetable_gotopage(pageno = 0, pg_id) {

    if (pageno === 0) pageno = 1;

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);
    excel_pagetables[index].currentpage = pageno;
    get_excelpagetable(pg_id);
}

function excelpagetable_nextpage(pagetable_id) {
    pagetable_laststate = "nextpage";
    get_pagetable(pagetable_id);
}

function excelpagetable_prevpage(pagetable_id) {
    pagetable_laststate = "prevpage";
    get_pagetable(pagetable_id);
}

function excelpagetable_pagefooterinfo(count, from, to, pg_id) {
    $(`#${pg_id} .pagetablefooterinfo`).html("");
    str = '<div class="dataTables_info text-right">نمایش ' + from.toString() + ' تا ' + to.toString() + ' از ' + count.toString() + ' سطر</div>';
    $(`#${pg_id} .pagetablefooterinfo`).append(str);
}

function excelpagetable_change_pagerowscount(count, elem) {

    var pagetableid = $(elem).parent().parent().parent().parent().parent().parent().attr("id");
    $(`#${pagetableid} .pagerowscount > button:first`).text(count);


    var index = excel_pagetables.findIndex(v => v.pagetable_id == pagetableid);
    excel_pagetables[index].pagerowscount = count;
    excel_pagetables[index].currentpage = 1;
    excel_pagetables[index].currentrow = 1;

    get_excelpagetable(pagetableid);
}

function excelpagetable_change_filteritem(itemid, title, type, size, pg_name) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    excel_pagetables[index].currentpage = 1;

    var elm = $(`#${pg_name} .btnfilter`)
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);

    //pagetable_filteritem = itemid;
    excel_pagetables[index].filteritem = itemid;

    var elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    //pagetable_filtervalue = "";
    excel_pagetables[index].filtervalue = "";

    if (itemid.toLowerCase().indexOf("date") >= 0)
        elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
    else
        elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    if (itemid === "filter-non") {
        get_excelpagetable(pg_name);
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

var removeFilter = (elem) => {
    var pagetableId = $(elem).closest(".card-body").attr("id");
    $(`#${pagetableId} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetableId} .btnOpenFilter`).removeClass("d-none");
    masterArray = masterArrayNoneFilter;
    excelpagetable_change_filteritem('filter-non', 'مورد فیلتر', '0', '0', pagetableId);
}

function changeRowsChecks(pg_id) {
    let checkError = $("#errorRowsCheck").prop("checked");
    let checkSuccess = $("#successRowsCheck").prop("checked");
    let index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (checkError && !checkSuccess)
        excel_pagetables[index].filterPageType = "1";
    else if (!checkError && checkSuccess)
        excel_pagetables[index].filterPageType = "2";
    else
        excel_pagetables[index].filterPageType = "0";

    excel_pagetables[index].currentpage = 1;
    get_excelpagetable(pg_id);
}

function get_excelpagetable(pg_id = null, callBack = undefined) {
    if (pg_id == null)
        pg_id = "pagetable";

    activePageTableId = pg_id;
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);
    var dataRows = excel_pagetables[index].datarows;
    var pagetable_currentpage = excelPageInit ? 0 : excel_pagetables[index].currentpage;
    var pagetable_lastpage = excel_pagetables[index].lastpage;
    var pagetable_filteritem = excelPageInit ? "" : excel_pagetables[index].filteritem;
    var pagetable_filtervalue = excelPageInit ? "" : excel_pagetables[index].filtervalue;
    var pagetable_getColumns_url = excel_pagetables[index].getColumns_url;
    var pagetable_url = excel_pagetables[index].getpagetable_url;
    var pagetable_filter = excel_pagetables[index].getfilter_url

    var checks = $(`#${activePageTableId} input[type='checkbox']`)
    var checksL = checks.length
    var count = 0;

    for (var i = 1; i <= checksL; i++) {
        var v = checks[i];
        if ($(v).prop("checked") == true)
            count += 1;
    }

    let getTotalrecord = parseInt($("#totalrecord").text().split(" ")[0])

    //if ((pagetable_currentpage == pagetable_lastpage) && (count == getTotalrecord)) {
    //    pagetable_currentpage = pagetable_lastpage - 1
    //}

    if (pagetable_laststate == "nextpage") {
        if (pagetable_currentpage < pagetable_lastpage)
            pagetable_currentpage++;
    }
    else if (pagetable_laststate == "prevpage") {
        if (pagetable_currentpage > 1)
            pagetable_currentpage--;
    }
    if (pagetable_currentpage === 0) pagetable_currentpage = 1



    excel_pagetables[index].currentpage = pagetable_currentpage;
    var pagetable_pagerowscount = excel_pagetables[index].pagerowscount;
    if (pagetable_pagerowscount === 0)
        pagetable_pagerowscount = $(`#${pg_id} .pagerowscount > button:first`).text();

    if (pagetable_filtervalue != "" && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
        var msg = alertify.error('مورد فیلتر انتخاب نشده');
        msg.delay(alertify_delay);
        return;
    }

    if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && pagetable_filtervalue == "") {
        var msg = alertify.error('عبارت فیلتر وارد نشده');
        msg.delay(alertify_delay);
        return;
    }

    var fieldItemType = +$(`#${pg_id} .btnfilter`).attr("data-type");

    if ([dbtype.Int, dbtype.BigInt, dbtype.SmallInt, dbtype.TinyInt, dbtype.dbtype_Decimal, dbtype.Float, dbtype.Real].indexOf(fieldItemType) > -1)
        if (isNaN(pagetable_filtervalue)) {
            var msg = alertify.error('با توجه به مورد فیلتر ، عبارت فیلتر معتبر نمی باشد');
            msg.delay(alertify_delay);
            return;
        }

    var pageViewModel = {
        pageno: pagetable_currentpage,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue,
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        },
        getColumns_url: pagetable_getColumns_url,
    }

    pageViewModel.Form_KeyValue = excelpagetable_formkeyvalue;

    filterUrl = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    if (pagetable_filter === undefined)
        filterUrl = viewData_filter_url;
    else
        filterUrl = pagetable_filter;

    getPageTable(pageViewModel, dataRows, pg_id).then(function (result) {
        
        if (result == '') {
            return
        }
        if (result.data.length > 0 && !checkFileExcel(result.data[0])) {
            alertify.error("فایل صحیح نیست").delay(alertify_delay);
            $(`#${pg_id} .pagetablebodyEx,#${pg_id} .pagetablefooterinfo ,#${pg_id} .pagination `).html("");
            loadingExcel(false);
            $(`#deleteRows,#btnCreate,#verifyData`).prop("disabled", true);
            return;
        }

        fill_pagetableEx(result, pg_id, callBack);
        fill_filter_items(result.columns, pg_id);
        if (detect_Mobile())
            pagetable_pagination_mobile(result.maxPageCount, result.currentPage, pg_id);
        else
            pagetable_pagination(result.maxPageCount, result.currentPage, pg_id);
        excelpagetable_pagefooterinfo(result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);
    });
}

async function getPageTable(pageViewModel, dataRow, pg_id) {
    
    let result = {}, columns = [], data = [], dateLn = 0;
    dataRow = dataRow == null ? [] : dataRow;
    columns = getPageTableColsExels(pageViewModel.idHeader, pageViewModel.getColumns_url);
    if (excelPageInit) {
        masterArrayNoneFilter = createDate(dataRow, columns.dataColumns, pg_id, true);
        excelPageInit = false;
    }
    masterArray = createDate(dataRow, columns.dataColumns, pg_id);

    if (pageViewModel.fieldItem != "filter-non" && pageViewModel.fieldValue != "")
        masterArray = _.filter(masterArray, function (item) {
            var isStringColumn = columns.dataColumns.filter(a => a.id == pageViewModel.fieldItem && (a.type == 3 || a.type == 10 || a.type == 11 || a.type == 12 || a.type == 18 || a.type == 22))[0];
            if (isStringColumn != null && isStringColumn != undefined)
                return item[pageViewModel.fieldItem].toString().indexOf(pageViewModel.fieldValue) > -1;
            else
                return item[pageViewModel.fieldItem] == pageViewModel.fieldValue;
        });

    if (masterArrayNoneFilter.length > 3005) {
        alertify.warning("تعداد سطر ها از حد مجاز بیشتر است").delay(alertify_delay);
        loadingExcel(false)
        return [];s
    }


    dateLn = masterArray.length;

    if (pageViewModel.pageno > Math.ceil(dateLn / pageViewModel.pagerowscount)) {
        pageViewModel.pageno = Math.ceil(dateLn / pageViewModel.pagerowscount)
    }

    data = _.take(_.drop(masterArray, pageViewModel.pagerowscount * (pageViewModel.pageno - 1)), pageViewModel.pagerowscount);

    result = {
        columns: columns,
        currentPage: pageViewModel.pageno,
        data: data,
        headerColumns: null,
        maxPageCount: Math.ceil(dateLn / pageViewModel.pagerowscount),
        message: null,
        pageEndRow: dateLn,
        pageStartRow: 1,
        recordSet: null,
        successfull: true,
        totalRecordCount: dateLn
    };

    return result;
}

function createDate(datas, headers, pg_id, noneFilter = false) {

    let model = {}, resArray = [], value = [];
    let datasLn = datas.length;
    let headersLn = headers.length, flagEmpty = 0;
    let index = excel_pagetables.findIndex(v => v.pagetable_id == pg_id);
    let filterErorr = excel_pagetables[index].filterPageType;

    if (noneFilter) {
        for (var i = 0; i < datasLn; i++) {
            model = {};
            value = datas[i];
            flagEmpty = 0;

            for (var j = 0; j < headersLn; j++) {
                if (!isNaN(+value[j]) && (headers[j].type === 0 || headers[j].type === 8 || headers[j].type === 16 || headers[j].type === 20 || headers[j].type === 5 || headers[j].type === 6))
                    model[headers[j].id] = +value[j];
                else
                    model[headers[j].id] = value[j];

                if (value[j] == undefined || +value[j] == 0)
                    ++flagEmpty;
            }
            if (flagEmpty != headersLn) {
                model["index"] = i;
                resArray.push(model);
            }
        }
    }
    else {
        let subData = [];
        if (filterErorr == "1")
            subData = masterArrayNoneFilter.filter(x => x.hasError);
        else if (filterErorr == "2")
            subData = masterArrayNoneFilter.filter(x => !x.hasError)
        else
            subData = masterArrayNoneFilter;

        resArray = subData;
    }

    return resArray;
}

function getPageTableColsExels(id, url) {
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            data = result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

    return data;
}

function tr_onkeydownEx(ev, pg_name) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentcol = excel_pagetables[index].currentcol
    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var pagetable_currentpage = excel_pagetables[index].currentpage;
    var pagetable_lastpage = excel_pagetables[index].lastpage;
    var pagetable_editable = excel_pagetables[index].editable;
    var pagetable_selectable = excel_pagetables[index].selectable;
    var pagetable_tr_editing = excel_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (isSearcheModalOpen) return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else {
                pagetable_currentrow--;
                excel_pagetables[index].currentrow = pagetable_currentrow;
                after_change_trEx(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else if (pagetable_currentpage !== 1)
                pagetable_prevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if (document.activeElement.className.indexOf("select2") >= 0) // Open when ArrowDone In Select2
            return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else {
                pagetable_currentrow++;
                excel_pagetables[index].currentrow = pagetable_currentrow;

                after_change_trEx(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                excel_pagetables[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
            }
        }
    }
    else if (ev.which === KeyCode.Enter) {
        if (pagetable_editable) {

            if (pagetable_tr_editing)
                if (+$(`#${pg_name} .editrow`).parents("tr").attr("id").split("row")[1] !== pagetable_currentrow)
                    return;

            if (!pagetable_tr_editing) {
                configSelect2_trEditingEx(pagetable_id, pagetable_currentrow, true);
                configSearchPlugins(pagetable_id, pagetable_currentrow, true);
                pagetable_currentcol = excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
            }
            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:not([type=checkbox]),select,div.funkyradio,.search-modal-container > input").first()
            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editingEx(pg_name);

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
                    // المنت بعدی وجود داشت
                    if (nextElm != undefined && nextElm.length != 0) {
                        if (currentElm.hasClass("funkyradio")) {
                            var td_lbl_funkyradio = currentElm.find("label");
                            td_lbl_funkyradio.removeClass("border-thin");
                        }
                        if (nextElm.hasClass("select2")) {
                            var colno = nextElm.parent().parent().attr("id").split("_")[2];
                            tr_onfocusEx(pg_name, colno);
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
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                excel_pagetables[index].currentrow = pagetable_currentrow;

                                after_change_trEx(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                let index = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("index");
                                if (index + 1 == masterArray.length)
                                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).addClass("highlight").focus();
                                else {
                                    pagetable_nextpage(pagetable_id);
                                    $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight").focus();
                                }
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
                configSelect2_trEditingEx(pagetable_id, pagetable_currentrow);
                configSearchPlugins(pagetable_id, pagetable_currentrow);
                after_change_trEx(pg_name, KeyCode.Esc);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);
                    pagetable_currentcol = excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
                }
            }
            else
                confirmForClose();

        }
        else confirmForClose();
    }
    else if (ev.which === KeyCode.Space) {

        //if (pagetable_editable === false && pagetable_tr_editing === false) {
        //    ev.preventDefault();
        //    return;
        //}

        if (pagetable_editable && pagetable_tr_editing) {



            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio")) {

                ev.preventDefault();
                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol} .funkyradio #btn_${pagetable_currentrow}_${pagetable_currentcol}`);
                checkbox_funky.prop("checked", !checkbox_funky.prop("checked")).trigger("change");
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
                itemChangeEx(elm);
            }
        }
    }
}

function pagetable_nextpage(pagetable_id) {

    //pagetable_laststate = "nextpage";
    //get_excelpagetable(pagetable_id);
}

function pagetable_prevpage(pagetable_id) {
    //pagetable_laststate = "prevpage";
    //get_excelpagetable(pagetable_id);
}

function configSearchPlugins(pg_name, rowno, enableConfig = false) {
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var columns = excel_pagetables[index].columns;
    var dataRowSearch = columns.filter(a => a.searchPlugin);
    for (var i = 0; i < dataRowSearch.length; i++) {
        var tempModelSearch = dataRowSearch[i].searchPlugin;
        if (enableConfig) {
            var newModelItems = configModelItemByRow(tempModelSearch.modelItems, rowno);
            let idSearch = dataRowSearch[i].id, callBackS = tempModelSearch.callBack;
            $(`#${dataRowSearch[i].id}_${rowno}`).searchModal({
                searchUrl: tempModelSearch.searchUrl,
                modelItems: newModelItems,
                selectColumn: tempModelSearch.selectColumn,
                column: tempModelSearch.column,
                modalSize: tempModelSearch.modalSize,
                selectedCallBack: () => {
                    selectedCallBackFunction(idSearch, rowno);
                    if (typeof callBackS !== "undefined")
                        callBackS();
                },
                onclickFunction: () => onclickFunctionValidator(idSearch, rowno)
            });
        }
        else {
            tempModelSearch = dataRowSearch[i];
            firstElement = $(`#${tempModelSearch.id}_${rowno}`);
            $(firstElement).parents("td").first().html(firstElement);
        }

    }
}

function onclickFunctionValidator(id, rowNo) {

}

function selectedCallBackFunction(id, rowNo) {

}

function configModelItemByRow(modelItems, row) {
    var newModelItems = JSON.parse(JSON.stringify(modelItems));
    for (var i = 0; i < newModelItems.length; i++) {
        newModelItems[i] = `#${newModelItems[i]}_${row}`;
    }
    return newModelItems;
}

function configSelect2_trEditingEx(pg_name, rowno, enableConfig = false) {
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

        var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var columns = excel_pagetables[index].columns;
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

    if (typeof after_configSelect2_trEditingEx != "undefined")
        after_configSelect2_trEditingEx();

}

$(document).on('focus', '.pagetablebodyEx tbody .select2-selection.select2-selection--single', function (e) {
    var pg_name = $($(this).parents(".card-body")[0]).attr("id");
    var colno = $(this).parent().parent().parent().parent().attr("id").split("_")[2];
    tr_onfocusEx(pg_name, colno);
});

function tr_onfocusEx(pg_name, colno) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    excel_pagetables[index].currentcol = colno;
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var currentrow = excel_pagetables[index].currentrow;
    var trediting = excel_pagetables[index].trediting;

    if (trediting) {
        var elm = $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input:not([type=checkbox]):first,select:first,div.funkyradio:first");
        if (!elm.hasClass("funkyradio"))
            elm.select();
    }
}

function itemChangeEx(elem) {
    if (elem.length < 1) return;
    var rowCount = $(elem).parents(".card-body tbody").find("tr").length;
    var pagetable_id = $(elem).parents(".card-body").attr("id");
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    var selectedItems = typeof excel_pagetables[index].selectedItems == "undefined" ? [] : excel_pagetables[index].selectedItems;
    var isSelected = $(elem).prop("checked");
    var primaryData = $(elem).parents("tr").data();

    if (isSelected === true) {
        var checks = $(`#${pagetable_id} input[type='checkbox']`),
            checksL = checks.length,
            count = 0;
        for (var i = 0; i < checksL; i++) {
            var v = checks[i];
            if ($(v).prop("checked") == true)
                count += 1;
        }

        if (count >= rowCount) {
            var pagetable = $(`#${pagetable_id}`);
            $(pagetable).find("input[type='checkbox']").first().prop("checked", true);
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
        $(`#${pagetable_id}`).find("input[type='checkbox']").first().prop("checked", false);
        var validCount = 0,
            primaryCount = 0,
            selectedItemsL = selectedItems.length;
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

    excel_pagetables[index].selectedItems = selectedItems;
}

function changeAllEx(elem, pageId) {
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
    var selectedItems = excel_pagetables[index].selectedItems == undefined ? [] : excel_pagetables[index].selectedItems;

    var validCount = 0;
    var primaryCount = 0;

    if ($(elem).prop("checked") == true) {


        $(`#${pageId} tbody`).find("input[type='checkbox']").prop("checked", true);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > #row${i}`).data();
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

        $(`#${pageId} tbody`).find("input[type='checkbox']").prop("checked", false);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > #row${i}`).data();
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

    excel_pagetables[index].selectedItems = selectedItems;
}

function tr_onclickEx(pg_name, elm, evt) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;
    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var trediting = excel_pagetables[index].trediting;
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
    excel_pagetables[index].currentrow = pagetable_currentrow;
    tr_HighlightEx(pg_name);
    excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
}

function fill_pagetableEx(result, pageId, callBack = undefined) {
    if (!result) return "";

    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    var columns = result.columns.dataColumns,
        list = result.data,
        columnsL = columns.length,
        listLength = list.length;

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
    excel_pagetables[index].editable = result.columns.isEditable;
    excel_pagetables[index].selectable = result.columns.isSelectable;
    excel_pagetables[index].columns = columns;
    excel_pagetables[index].trediting = false;
    var pagetable_editable = excel_pagetables[index].editable;
    var pagetable_selectable = excel_pagetables[index].selectable;
    var pagetable_hasRowNumber = result.columns.hasRowNumber;

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    var pagetable_highlightrowid = excel_pagetables[index].highlightrowid;

    pagetable_hasfilter(pageId, result.columns.hasFilter);

    var elm_pbody = $(`#${pageId} .pagetablebody`);
    elm_pbody.html("");

    var btn_tbidx = 1000;
    var str = "", isValid = true;

    str += '<thead>';
    str += '<tr>';
    if (pagetable_editable == true)
        str += '<th style="width:2%"></th>';
    if (pagetable_selectable == true)
        str += `<th style="width:2%;text-align:center !important"><input onchange="changeAllEx(this,'${pageId}')" class="checkall" type="checkbox"></th>`;
    if (pagetable_hasRowNumber)
        str += '<th style="width:3%">ردیف</th>';

    for (var i = 0; i < columnsL; i++) {
        var col = columns[i];
        if (col.isDtParameter) {
            str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '"';
            if (col.id != "action") {
                if (result.columns.order)
                    str += `class="headerSorting" id="header_${i}" data-type="" data-col="${col.id}" data-index="${i}" onclick="sortingButtonsByTh(${result.columns.order},this)"><span id="sortIconGroup" class="sortIcon-group">
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
    if (list.length == 0)
        str += fillEmptyRow(columns.length);
    else
        for (var i = 0; i < listLength; i++) {
            var item = list[i];
            var rowno = i + 1;
            var colno = 0;
            var colwidth = 0;
            for (var j = 0; j < columnsL; j++) {
                var primaries = "";


                for (var k = 0; k < columnsL; k++) {
                    var v = columns[k];

                    if (v["isPrimary"] === true)
                        primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                }

                if (columns[j].hasSumValue && columns[j].calculateSum) {
                    columns[j].sumValue += +isNaN(item[columns[j].id]) ? 0 : +item[columns[j].id];
                }

                colwidth = columns[j].width;
                if (j == 0) {

                    if (conditionResult != "noCondition") {
                        if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                            str += '<tr data-parsley-validate' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownEx(event,`' + pageId + '`)" onclick="tr_onclickEx(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                        }
                        else {
                            str += '<tr data-parsley-validate' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownEx(event,`' + pageId + '`)" onclick="tr_onclickEx(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                        }
                    }
                    else {
                        if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                            str += '<tr data-parsley-validate' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownEx(event,`' + pageId + '`)" onclick="tr_onclickEx(`' + pageId + '`,this,event)" tabindex="-2">';
                        }
                        else {
                            str += '<tr data-parsley-validate' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownEx(event,`' + pageId + '`)" onclick="tr_onclickEx(`' + pageId + '`,this,event)" tabindex="-1">';
                        }
                    }
                    if (pagetable_editable == true)
                        str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                    if (pagetable_selectable == true) {
                        str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChangeEx(this)" name="checkbox" type="checkbox"`;

                        var validCount = 0;
                        var primaryCount = 0;
                        var isCol = false;

                        var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
                        var selectedItems = excel_pagetables[index].selectedItems;
                        $.each(selectedItems, function (k, v) {
                            $.each(v, function (key, val) {
                                var column = columns.filter(a => a.id.toLowerCase() == key)[0];
                                if (typeof column !== "undefined") {
                                    primaryCount += 1;
                                    if (item[column.id] == val)
                                        validCount += 1;
                                }
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

                    if (pagetable_hasRowNumber)
                        str += `<td style="width:2%">${excel_pagetables[index].currentpage == 1 ? i + 1 : (i + 1) + ((excel_pagetables[index].currentpage - 1) * excel_pagetables[index].pagerowscount)}</td>`;
                }
                if (columns[j].isDtParameter) {

                    var validators = "";

                    if (columns[j].validations != null) {
                        var validations = columns[j].validations;
                        for (var v = 0; v < validations.length; v++) {
                            if (validations[v].value1 == null && validations[v].value2 == null) {
                                validators += " " + validations[v].validationName;
                            }
                            else if (validations[v].validationName.indexOf("range") >= 0) {
                                validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                            }
                            else {
                                validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                            }
                        }
                    }

                    if (columns[j].id != "action") {
                        colno += 1;
                        var value = item[columns[j].id];
                        if (columns[j].editable) {
                            str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                            if (columns[j].inputType == "select") {
                                str += `<select ${validators} id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})"  disabled>`;
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

                                str += `<select ${validators} class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})"  disabled>`;
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
                           
                                str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocusEx('${pageId}',${colno})" placeholder="____/__/__" required ${column[j].maxLength != 0 ? 'maxlength="' + column[j].maxLength + '"' : 'maxlength="10"' } autocomplete="off" disabled />`;

                            }
                            else if (columns[j].inputType == "datepicker") {

                                str += `<input ${validators} type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocusEx('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                            }
                            else if (columns[j].inputType == "checkbox") {
                                str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})" disabled tabindex="-1">
                                            <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                            }
                            else if (columns[j].inputType == "select2") {
                                var onchange = `tr_object_onchangeEx('${pageId}',this,${rowno},${colno})`;
                                var nameVlue = "";
                                if (columns[j].id.indexOf("Id") != -1) {
                                    var val = item[columns[j].id.replace("Id", "") + "Name"];
                                    nameVlue = val != null ? val : '';
                                }
                                else {
                                    var val = item[columns[j].id + "Name"];
                                    nameVlue = val != null ? val : '';
                                }

                                str += `<div>${nameVlue}</div>`
                                str += `<div class="displaynone"><select ${validators} data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})"  disabled>`;
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
                                str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchangeEx('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocusEx('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            else if (columns[j].inputType == "money") {
                                str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${+value != 0 ? transformNumbers.toComma(value).trim() : 0}" class="form-control money" onchange="tr_object_onchangeEx('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            }
                            else if (columns[j].inputType == "decimal")
                                str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onchange="tr_object_onchangeEx('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            else {
                                if (columns[j].type == 8) {
                                    str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}"  data-parsley-errors-container="#${columns[j].id}_${rowno}ErorrContiner" class="form-control number" onchange="tr_object_onchangeEx('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled><div id="${columns[j].id}_${rowno}ErorrContiner"></div>`;
                                }
                                else {
                                    str += `<input ${validators} oninput="tr_object_oninput(event,this)" type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" data-parsley-errors-container="#${columns[j].id}_${rowno}ErorrContiner" class="form-control" onchange="tr_object_onchangeEx('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblurEx('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocusEx('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled><div id="${columns[j].id}_${rowno}ErorrContiner"></div>`;
                                }

                            }
                            str += "</td>"
                        }
                        else if (columns[j].isReadOnly) {

                            str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                            if (columns[j].inputType == "number")
                                str += `<input ${validators} type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocusEx('${pageId}',${colno})" autocomplete="off" readonly>`;
                            else if (columns[j].inputType == "money")
                                str += `<input ${validators} type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value).trim() : ""}" class="form-control money" onfocus="tr_onfocusEx('${pageId}',${colno})" autocomplete="off" readonly>`;
                            else if (columns[j].inputType == "decimal")
                                str += `<input ${validators} type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onfocus="tr_onfocusEx('${pageId}',${colno})"  autocomplete="off" readonly>`;
                            else
                                str += `<input ${validators} type="text" id="${columns[j].id}_${rowno}" value="${value}" class="form-control" onfocus="tr_onfocusEx('${pageId}',${colno})" autocomplete="off" readonly>`;

                            str += "</td>"
                        }
                        else {
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
                }
            }
            str += '</tr>';
        }

    str += '</tbody>';
    str += `<tfoot id="footerPageTableEx"></tfoot>`;

    elm_pbody.append(str);
    createFooterTable(list, pagetable_selectable, columns, pagetable_hasRowNumber);

    //searchPlugin config
    //searchPluginConfig(pageId, columns);

    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var pagetable_currentcol = excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pageId);

    if (pagetable_laststate == "" && pagetable_currentrow != 0) {
        var elm_pbody_row = elm_pbody.find(`tbody >  #row${pagetable_currentrow}`)
        if (elm_pbody_row[0] == undefined) {
            pagetable_currentrow = 1;
            excel_pagetables[index].currentrow = pagetable_currentrow;
        }

        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus();

        if (pagetable_editable)
            $(`td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:first,select:first").focus();
    }
    else if (pagetable_laststate == "" || pagetable_laststate == "nextpage") {
        pagetable_currentrow = 1;
        excel_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
    }
    else if (pagetable_laststate == "prevpage") {

        pagetable_currentrow = +elm_pbody.find("tbody > tr:last").attr("id").replace(/row/g, "");
        excel_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
    }
    else {
        $(`#${pageId} tr`).removeClass("highlight");
        $(`#${pageId} #row${pagetable_currentrow}`).addClass("highlight").focus();
    }

    pagetable_laststate = "";

    var dataDatePicker = $(".persian-datepicker"),
        dataDatePickerL = $(".persian-datepicker").length,
        dataSearchPlagin = $(".searchplugin"),
        dataSearchPlaginL = $(".searchplugin").length;

    for (var i = 0; i < dataDatePickerL; i++) {
        var val = dataDatePicker[i];
        kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
    }

    $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    if (typeof $(`#header_${dataOrder.index}`).data() != "undefined") {
        $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;
    }

    loadingExcel(false, true);

    if (+$("#errorRows").text() > 0) {
        if (typeof excel_pagetables[index].verifyDataFunc != "undefined")
            excel_pagetables[index].verifyDataFunc(false);
    }

    if (typeof callBack != "undefined")
        callBack(result);
}

function createFooterTable(list, pagetable_selectable, columns, pagetable_hasRowNumber) {


    var hasRowNumber = pagetable_hasRowNumber == true;
    let str = "", str1 = "";

    if (list != null && list.length !== 0) {
        str += `<tr><td rowspan="2" colspan="${pagetable_selectable ? 2 : 1}" id="totalrecord" class="text-right font-12 font-600">${list.length} #</td>`;
        str1 += `<tr>`;

        let cli = 0, isFirstSum = true, sumValue = "0", colLn = columns.filter(a => a.isDtParameter == true).length;

        for (var cl in columns) {
     
            if (columns[cl].isDtParameter == true) {
                if (columns[cl].hasSumValue == true) {


                    if (cli > 0)
                        if (isFirstSum) {
                            str += `<td class="totalSum text-left font-12 font-600" colspan="${cli + hasRowNumber}"> جمع صفحه</td>`;
                            str1 += `<td class="totalSum text-left font-12 font-600" colspan="${cli + hasRowNumber}"> جمع کل صفحات</td>`;
                            isFirstSum = false;
                        }
                        else {
                            str += `<td class="totalSum" colspan="${cli}"></td>`;
                            str1 += `<td class="totalSum" colspan="${cli}"></td>`;
                        }

                    str += `<td class="total-amount">${getAllSum(list, columns[cl].id)}</td>`;
                    str1 += `<td class="total-amount">${getAllSum(masterArrayNoneFilter, columns[cl].id)}</td>`;

                    cli = 0;
                }
                else
                    cli += 1;

                if (colLn - 1 == +cl && cli > 0) {
                    str += `<td class="totalSum" colspan="${cli}"></td>`;
                    str1 += `<td class="totalSum" colspan="${cli}"></td>`;
                }

            }
        }
    }


    str += `</tr>${str1}</tr>`;
    $("#footerPageTableEx").html(str);

    if (typeof afterCreateFooterTable != "undefined")
        afterCreateFooterTable();

}

function checkFileExcel(list) {
    let result = true;
    Object.keys(list).map(index => {
        if (typeof list[index] === "undefined" || list[index] === undefined)
            result = false;
    });
    return result;
}

function searchPluginConfigEx(pageId, columns) {
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

function select2Config(pageId) {
    var rows = $(`#${pageId} .pagetablebody tbody tr`);
    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            var select2Items = $(rows[i]).find(".select2");
            if (select2Items.length > 0) {
                for (var j = 0; j < select2Items.length; j++) {
                    var selectId = $(select2Items[j]).attr("id");
                    $(`#${selectId}`).select2();
                    if (+$(`#${selectId}`).val() > 0)
                        $(`#${selectId}`).trigger("change");
                }
            }
        }
    }
}

function tr_object_onchangeEx(pageId, elem, rowno, colno) {
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = excel_pagetables[index].columns;
    var column = null;
    var colId = "";
    var elemId = $(elem).attr("id");
    if (elemId != undefined) {
        colId = $(elem).attr("id").split("_")[0];;
        column = columns.filter(a => a.id == colId)[0];
    }
    //#region select2 config
    if (column != undefined && column != null && column.isSelect2) {
        if ($(elem).val() != null && $(elem).val() != undefined && +$(elem).val() != 0)
            $(elem).data("value", $(elem).val());
        var title = $(`#select2-${elemId}-container`).attr("title");
        if (title != undefined)
            $(`#col_${rowno}_${colno} div`).first().html($(`#select2-${elemId}-container`).attr("title").split("-")[1]);
        if (column.fillColumnInputSelectIds != null) {
            var fillColumnInputSelectIds = column.fillColumnInputSelectIds;
            for (var i = 0; i < fillColumnInputSelectIds.length; i++) {
                var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
                var columns = excel_pagetables[index].columns;
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
                    $(`#${pageId} #${elemId}`).html("");

                    if (changeItemCol.pleaseChoose)
                        $(`#${pageId} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                        fill_select2(getInputSelectConfig.fillUrl, `${pageId} #${elemId}`, true, params, false, 0, 'انتخاب', function () {
                            $(`#${pageId} #${elemId}`).trigger("change");
                        });
                    }
                }
            }
        }
    }
    //#endregion

}

function tr_select2_onchangeEx(elem, pageId, rowno, colno) {
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = excel_pagetables[index].columns.filter(a => a.isDtParameter);
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

function convertSearchPluginModelItem(pageId, rowNo, searchPlugin) {
    var modelItems = [];
    for (var i = 0; i < searchPlugin.modelItems.length; i++) {
        var colIndex = +searchPlugin.modelItems[i];
        var modelItem = $($(`#${pageId} .pagetablebody tbody #row${rowNo} #col_${rowNo}_${colIndex} input`)[0]);
        modelItems.push(modelItem);
    }
    return modelItems;
}

function sortingButtons(elm) {
    dataOrder = { colId: "", sort: "", index: 0 };
    var data = $(elm).data();

    dataOrder = { colId: data.colId, sort: data.sort, index: data.index };
    $("i").removeClass("active-sortIcon");
    get_pagetable();
}

function sortingButtonsByTh(has, elm, pg_name) {

    if (has) {
        var data = $(elm).data();
        dataOrder = { colId: "", sort: "", index: 0 };
        var sort = data.sort == "desc" ? "asc" : "desc";
        dataOrder = { colId: data.colid, sort: sort, index: data.index };
        $("i").removeClass("active-sortIcon");
        get_pagetable(pg_name);
    }
}

function after_change_trEx(pg_name, keycode) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var currentrow = excel_pagetables[index].currentrow;
    var tr_editing = excel_pagetables[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_HighlightEx(pg_name);
    if (keycode === KeyCode.Esc) {
        if (tr_editing) {
            initialRowEx(pagetable_id, false);
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

function after_save_rowEx(pg_name, result_opr, keycode, initial) {

    let index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = excel_pagetables[index].pagetable_id,
        pagetable_currentrow = excel_pagetables[index].currentrow,
        pagetable_pagerowscount = excel_pagetables[index].pagerowscount,
        pagetable_currentpage = excel_pagetables[index].currentpage,
        pagetable_selectable = excel_pagetables[index].selectable,
        pagetable_lastpage = excel_pagetables[index].lastpage,
        trediting = excel_pagetables[index].trediting,
        pagetable_columns = excel_pagetables[index].columns;
    let list = _.take(_.drop(masterArray, pagetable_pagerowscount * (pagetable_currentpage - 1)), pagetable_pagerowscount);

    if (trediting)
        initialRowEx(pagetable_id, initial);

    configSearchPlugins(pagetable_id, pagetable_currentrow);
    configSelect2_trEditingEx(pagetable_id, pagetable_currentrow);

    createFooterTable(list, pagetable_selectable, pagetable_columns);

    if (keycode == KeyCode.ArrowDown) {
        // اگر سطر بعدی وجود داشت
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow++;
                excel_pagetables[index].currentrow = pagetable_currentrow;

                tr_HighlightEx(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRowEx(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage != pagetable_lastpage) {
                excel_pagetables[index].currentrow = 1;
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
                excel_pagetables[index].currentrow = pagetable_currentrow >= 1 ? pagetable_currentrow : 1;
                tr_HighlightEx(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRowEx(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage == 1) {
                if (result_opr == "success" || result_opr == "cancel")
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
                if (result_opr == "cancel")
                    initialRowEx(pagetable_id, initial);
            }
            else if (pagetable_currentpage != 1)
                pagetable_prevpage(pagetable_id);
        }
    }

    excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pagetable_id);
}

function initialRowEx(pg_name, isInitial) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentrow = excel_pagetables[index].currentrow;

    excel_pagetables[index].trediting = false;

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).find(".editrow").remove();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input:not([type='checkbox']),select,div.funkyradio").attr("disabled", true);
    //$(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio").blur();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio > label").removeClass("border-thin");

    if (isInitial) {
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input").val("");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("select").val("0").trigger("change");
    }

}

function getFirstColIndexHasInputEx(pg_name) {
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var pagetable_editable = excel_pagetables[index].editable;

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

function set_row_editingEx(pg_name) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var pagetable_editable = excel_pagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
    var pagetable_currentcol = excel_pagetables[index].currentcol;

    if (pagetable_editable) {

        excel_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);
    }
}

function tr_HighlightEx(pg_name) {

    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentrow = excel_pagetables[index].currentrow;

    $(`#${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

function get_cell_value(pagetable_id, columnindex, rowindex) {
    var cellvalue = $(`#${pagetable_id} .pagetablebody tbody > #row${rowindex} td:eq(${columnindex})`).text();
    return cellvalue;
}

function tr_object_onblurEx() {

}

function confirmForClose() {
}

function getAllSum(array, id) {
   
    let sum = 0, fainalSum = 0, masterLength = array.length;

    for (var i = 0; i < masterLength; i++) {
        if (typeof array[i][id] == "string") {
   
            let concatValueItems = +removeSep(array[i][id].toString())
            sum += isNaN(concatValueItems) ? 0 : +concatValueItems;
        } else {
            sum += isNaN(array[i][id]) ? 0 : + array[i][id];
        }
    }
        
    fainalSum = sum >= 0 ? transformNumbers.toComma(sum).replaceAll('.', '/') : `(${transformNumbers.toComma(Math.abs(sum)).replaceAll('.', '/')})`;

    return fainalSum;
}