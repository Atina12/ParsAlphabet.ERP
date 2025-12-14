var pagetable_id = "pagetable",
    pagetable_laststate = "",
    pagetable_formkeyvalue = [0],
    pagetable_filteritem = "",
    pagetable_filtervalue = "",
    pagetable_tr_editing = false,
    dataOrder = { colId: "", sort: "", index: 0 },
    OutPutCssTable = "",
    conditionTools = [],
    conditionAnswer = "",
    conditionElseAnswer = "",
    listForCondition = {},
    after_getPageTableCallBack = undefined,
    arraySearchPluginItems = [];

var arr_pagetables =
    [
        { pagetable_id: "pagetable", editable: false, pagerowscount: 15, currentpage: 1, lastpage: 1, currentrow: 1, currentcol: 0, highlightrowid: 0, trediting: false, pagetablefilter: false, filteritem: "", filtervalue: "" }
    ];

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

function filtervalue_onkeypress(e, fltvalue) {
    if (e.which == 13) {
        e.preventDefault();

        var pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id");

        //if (typeof csvModel !== "undefined") csvModel = null;

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].filtervalue = $(fltvalue).val();

        get_pagetable(pagetableId, () => callbackAfterFilter(pagetableId), true);
    }
}

function filtervalue_onsearchclick(elm_search) {
    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables[index].filtervalue = $(elm_search).prev("input").val();
    get_pagetable(pagetableId, () => callbackAfterFilter(pagetableId), true);
}

function run_button_edit(p_keyvalue, rowno, elem) {
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

function run_button_delete(p_keyvalue, rowno, elem) {

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
                        else if ($(`#${pagetableid} .pagetablebody `).hasClass("new-page-table"))
                            get_NewPageTable(pagetableid, false, () => callbackAfterFilter(pagetableid));
                        else
                            get_pagetable(pagetableid, () => callbackAfterFilter(pagetableid));

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

function fill_filter_items(p_url, pg_name = null, fromChangeFilter = false) {
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
                        str += `<button class="dropdown-item" id="filter_${item.id}" data-input="${item.filterType}" data-api="${item.filterTypeApi}"  data-inputmask="${item.inputMask}" onclick="javascript:pagetable_change_filteritem('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}',this)">${item.title}</button>`;
                }

                str += "</div>";
                $(`#${pg_name} .filteritems`).html(str);

                if (!fromChangeFilter) {
                    var elm_v = $(`#${pg_name} .filtervalue`);
                    elm_v.val("");
                    var parentfilterVal = elm_v.parents(".app-search");

                    var outPut = "";
                    $(parentfilterVal).find(".filtervalue").remove();
                    outPut = `<input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>`;
                    $(parentfilterVal).html(outPut);
                    callbackAfterFilter(pg_name);
                }

                if (typeof after_getPageTableCallBack != "undefined")
                    after_getPageTableCallBack();


            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function pagetable_pagination(max, pageno, pg_id) {
    $(`#${pg_id} .pagination`).html("");
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].lastpage = max;
    arr_pagetables[index].currentpage = pageno;

    var str = "";
    if (pageno == 1)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_gotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    var br = 5;
    if (max <= 7) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else
        if (pageno < br)
            for (i = 1; i <= max; i++) {
                if (i == pageno) {
                    str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                }
                else {
                    if (i <= br || i == max)
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
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
                        str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetable_gotopage(' + (i - 1).toString() + ',\'' + pg_id + '\')">' + (i - 1).toString() + '</button></li>';
                        str += '<li class="page-item active"><button class="page-link" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + (i + 1).toString() + ',\'' + pg_id + '\')">' + (i + 1).toString() + '</button></li>';
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                    }
                    else {
                        if (i == 1 || i == max)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                }
            else
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                    else {
                        if (i == 1 || i > max - br)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        if (i == max - br) {
                            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                        }
                    }
                }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_gotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function pagetable_pagination_mobile(max, pageno, pg_id) {

    $(`#${pg_id} .pagination`).html("");

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].lastpage = max;
    arr_pagetables[index].currentpage = pageno
    var str = "";
    if (pageno == 1)
        str += "<li class='page-item disabled'>";
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_gotopage(' + (pageno - 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">قبلی</button>';
    str += '</li>';
    if (max < 4) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else {
        if (pageno > 1 && pageno < max) {
            str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetable_gotopage(1,\'' + pg_id + '\')">' + 1 + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
            str += '<li class="page-item active"><button class="page-link" onclick="#">' + pageno.toString() + '</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetable_gotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
        else {
            if (pageno == 1)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(1,\'' + pg_id + '\')">1</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(1,\'' + pg_id + '\')">1</button></li>';
            str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
            if (pageno == max)
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">' + max.toString() + '</button></li>';
            else
                str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_gotopage(' + max.toString() + ',\'' + pg_id + '\')">' + max.toString() + '</button></li>';
        }
    }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_gotopage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function pagetable_gotopage(pageno = 0, pg_id) {

    if (pageno === 0) pageno = 1;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].currentpage = pageno;
    get_pagetable(pg_id, () => callbackAfterFilter(pg_id));
}

function pagetable_nextpage(pagetable_id) {
    pagetable_laststate = "nextpage";
    get_pagetable(pagetable_id, () => callbackAfterFilter(pagetable_id));
}

function pagetable_prevpage(pagetable_id) {
    pagetable_laststate = "prevpage";
    get_pagetable(pagetable_id, () => callbackAfterFilter(pagetable_id));
}

function pagetable_pagefooterinfo(count, from, to, pg_id) {
    $(`#${pg_id} .pagetablefooterinfo`).html("");
    str = '<div class="dataTables_info text-right">نمایش ' + from.toString() + ' تا ' + to.toString() + ' از ' + count.toString() + ' سطر</div>';
    $(`#${pg_id} .pagetablefooterinfo`).append(str);
}

function pagetable_change_pagerowscount(count, elem) {

    var pagetableid = $(elem).parent().parent().parent().parent().parent().parent().attr("id");
    $(`#${pagetableid} .pagerowscount > button:first`).text(count);


    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableid);
    arr_pagetables[index].pagerowscount = count;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;

    get_pagetable(pagetableid, () => callbackAfterFilter(pagetableid));
}

function pagetable_change_filteritem(itemid, title, type, size, pg_name, elmDrop = null) {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let elm = $(`#${pg_name} .btnfilter`);
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);
    arr_pagetables[index].filteritem = itemid;

    let elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    if (elmDrop == null) {

        resetFilterInput(elm_v.parents(".app-search"), pg_name);
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
            parentfilterVal = elm_v.parents(".app-search"),
            outPut = "";


        if (!elm_v.hasClass("select2") && !elm_v.hasClass("double-input"))
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir").attr("class", "form-control filtervalue");
        else
            resetFilterInput(parentfilterVal, pg_name);


        switch (type) {
            case "text":
                elm_v.addClass("text-filter-value");
                elm_v.inputmask({ "mask": inputMask });
                break;
            case "number":
            case "money":
            case "decimal":
                elm_v.addClass(type);
                elm_v.inputmask({ "mask": inputMask });
                break;

            case "strnumber":
                elm_v.addClass("str-number");
                elm_v.inputmask({ "mask": inputMask });
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
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypress(event, 'next')" oninput="filtervalue_onInput(event, this)"   data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)"  data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                            <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
                    <div>`;

                $(parentfilterVal).html(outPut);
                $(`#${pg_name} .filtervalue`).inputmask();
                $(`#${pg_name} .filtervalue.double-input:eq(0)`).focus();
                break;

            case "select2":
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChange(this)"></select>`;
                $(parentfilterVal).html(outPut);
                fill_select2(api, `${pg_name} #filterValueSelect2`, true, 0, false, 0, "انتخاب کنید", () => { $(`#${pg_name} #filterValueSelect2`).select2(); });

                break;

            default:
                break;
        }

    }

    if (itemid === "filter-non") {
        resetFilterInput(elm_v.parents(".app-search"), pg_name);
        get_pagetable(pg_name, () => callbackAfterFilter(pg_name));
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function filtervalue_onInput(e, fltvalue) {

    if (e.which != 13) {
        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
    }
}

function genarateValueFilter(element) {
    return $(element).val() + "     " + $(element).prev(".double-input").val();
}

function resetFilterInput(parentfilterVal, pg_name) {
    let outPut = "";
    $(parentfilterVal).find(".filtervalue").remove();
    outPut = `
                    <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypress(event, this)" oninput="filtervalue_onInput(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
                                `
    $(parentfilterVal).html(outPut);
    elm_v = $(`#${pg_name} .filtervalue`);

};

function filtervalue_onChange(fltvalue) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables[index].filtervalue = $(fltvalue).val();
    if (+$(fltvalue).val() !== 0)
        get_pagetable(pagetableId, () => callbackAfterFilter(pagetableId), true);
}

function resetModalCsv() {
    if (typeof csvModel !== "undefined")
        csvModel = null;
}

var removeFilter = (elem) => {
    var pagetableId = $(elem).closest(".card-body").attr("id");
    $(`#${pagetableId} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetableId} .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritem('filter-non', 'مورد فیلتر', '0', '0', pagetableId);
}

function callbackAfterFilter(pg_id) {
}

function get_pagetable(pg_id = null, callBack = undefined, fromChangeFilter = false) {
    if (pg_id == null)
        pg_id = "pagetable";

    activePageTableId = pg_id;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (fromChangeFilter)
        arr_pagetables[index].currentpage = 1

    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_filteritem = arr_pagetables[index].filteritem;
    var pagetable_filtervalue = arr_pagetables[index].filtervalue;
    var pagetable_url = arr_pagetables[index].getpagetable_url;
    var pagetable_filter = arr_pagetables[index].getfilter_url

    if (pagetable_laststate == "nextpage") {
        if (pagetable_currentpage < pagetable_lastpage)
            pagetable_currentpage++;
    }
    else if (pagetable_laststate == "prevpage") {
        if (pagetable_currentpage > 1)
            pagetable_currentpage--;
    }

    if (pagetable_currentpage === 0) pagetable_currentpage = 1;

    arr_pagetables[index].currentpage = pagetable_currentpage;

    var pagetable_pagerowscount = arr_pagetables[index].pagerowscount;


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
        }
    }

    resetModalCsv();//reset csv Model for Exprot Execl

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
            fill_pagetable(result, pg_id, callBack);
            fill_filter_items(filterUrl, pg_id, fromChangeFilter);
            if (detect_Mobile())
                pagetable_pagination_mobile(result.maxPageCount, pagetable_currentpage, pg_id);
            else
                pagetable_pagination(result.maxPageCount, pagetable_currentpage, pg_id);
            pagetable_pagefooterinfo(result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function tr_onkeydown(ev, pg_name) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables[index].currentcol
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

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
                arr_pagetables[index].currentrow = pagetable_currentrow;
                after_change_tr(pg_name, KeyCode.ArrowUp);
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
                arr_pagetables[index].currentrow = pagetable_currentrow;

                after_change_tr(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                arr_pagetables[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
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
            // ستون فعلی - input یا select وجود داشت
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
                    // المنت بعدی وجود داشت
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
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
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
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
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
                itemChange(elm);
            }
        }
    }
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

$(document).on('focus', '.pagetablebody tbody .select2-selection.select2-selection--single', function (e) {
    var pg_name = $($(this).parents(".card-body")[0]).attr("id");
    var colno = $(this).parent().parent().parent().parent().attr("id").split("_")[2];
    tr_onfocus(pg_name, colno);
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

function itemChange(elem) {
    if (elem.length < 1) return;
    var rowCount = $(elem).parents(".card-body tbody").find("tr").length;
    var pagetable_id = $(elem).parents(".card-body").attr("id");
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    var selectedItems = typeof arr_pagetables[index].selectedItems == "undefined" ? [] : arr_pagetables[index].selectedItems;
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

function changeAll(elem, pageId) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var selectedItems = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;

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

    arr_pagetables[index].selectedItems = selectedItems;
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

function fill_pagetable(result, pageId, callBack = undefined) {
    if (!result) return "";

    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    var columns = result.columns.dataColumns,
        buttons = result.columns.buttons,
        list = result.data,
        columnsL = columns.length,
        listLength = list.length,

        buttonsL = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    var pagetable_highlightrowid = arr_pagetables[index].highlightrowid;

    pagetable_hasfilter(pageId, result.columns.hasFilter);

    var elm_pbody = $(`#${pageId} .pagetablebody`);
    elm_pbody.html("");

    var btn_tbidx = 1000;
    var str = "";

    str += '<thead>';
    str += '<tr>';
    if (pagetable_editable == true)
        str += '<th style="width:2%"></th>';
    if (pagetable_selectable == true)
        str += `<th style="width:2%;text-align:center !important"><input onchange="changeAll(this,'${pageId}')" class="checkall" type="checkbox"></th>`;
    for (var i = 0; i < columnsL; i++) {
        var col = columns[i];
        if (col.isDtParameter) {
            str += '<th style="text-align:' + col.align + '!important;' + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '"';
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
    if (list.length == 0) {
        str += fillEmptyRow(columns.length);
    }
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

                colwidth = columns[j].width;
                if (j == 0) {
                    if (conditionResult != "noCondition") {
                        if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                            str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                        }
                        else {
                            str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                        }
                    }
                    else {
                        if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                            str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2">';
                        }
                        else {
                            str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1">';
                        }
                    }
                    if (pagetable_editable == true)
                        str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                    if (pagetable_selectable == true) {
                        str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

                        var validCount = 0;
                        var primaryCount = 0;
                        var isCol = false;

                        var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
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
                            str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                            if (columns[j].inputType == "select") {
                                str += `<select id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
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

                                str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
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

                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                            }
                            else if (columns[j].inputType == "datepicker") {

                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                            }
                            else if (columns[j].inputType == "checkbox") {
                                str += `<div class="funkyradio funkyradio-success" 
                                            onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                            onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" 
                                            onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">

                                            <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                            }
                            else if (columns[j].inputType == "searchPlugin") {
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number searchPlugin" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
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

                                str += `<div>${nameVlue}</div>`
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
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            else if (columns[j].inputType == "money")
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            else if (columns[j].inputType == "decimal")
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            else
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

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
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%" >' + value + '</td>';
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
                                        value = value.toString();
                                    }
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%" >' + value + '</td>';
                                }
                                else {
                                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%" ></td>`;
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
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;" >' + value + '</td>';
                                else
                                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                            }
                        }
                    }
                    else {
                        colno += 1;

                        if (result.columns.actionType === "dropdown") {
                            str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                            if (window.innerWidth >= 1680)
                                str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                            else
                                str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                            for (var k = 0; k < buttonsL; k++) {
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
                            str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                            for (var k = 0; k < buttonsL; k++) {
                                var btn = buttons[k];
                                if (btn.isSeparator == false) {
                                    btn_tbidx++;
                                    str += `<button type="button" ${btn.isFocusInline == true ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                }
                                else
                                    str += `<span class="button-seprator-ver"></span>`;
                            }

                            str += '</td>';
                        }
                    }
                }
            }
            str += '</tr>';
        }
    str += '</tbody>';

    elm_pbody.append(str);

    //searchPlugin config
    searchPluginConfig(pageId, columns);

    //select2 config
    //select2Config(pageId);

    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pageId);

    if (pagetable_laststate == "" && pagetable_currentrow != 0) {
        var elm_pbody_row = elm_pbody.find(`tbody >  #row${pagetable_currentrow}`)
        if (elm_pbody_row[0] == undefined) {
            pagetable_currentrow = 1;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }

        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus();

        if (pagetable_editable)
            $(`td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:first,select:first").focus();
    }
    else if (pagetable_laststate == "" || pagetable_laststate == "nextpage") {
        pagetable_currentrow = 1;
        arr_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
    }
    else if (pagetable_laststate == "prevpage") {

        pagetable_currentrow = +elm_pbody.find("tbody > tr:last").attr("id").replace(/row/g, "");
        arr_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
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

    if (typeof callBack != "undefined")
        callBack(result);
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
        if ($(elem).val() != null && $(elem).val() != undefined && +$(elem).val() != 0)
            $(elem).data("value", $(elem).val());
        var title = $(`#select2-${elemId}-container`).attr("title");
        if (title != undefined)
            $(`#col_${rowno}_${colno} div`).first().html(title);
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
    var pg_name = $(elm).parents("div.card-body").attr("id");
    dataOrder = { colId: data.colId, sort: data.sort, index: data.index };
    $("i").removeClass("active-sortIcon");
    get_pagetable(pg_name, () => callbackAfterFilter(pg_name));
}

function sortingButtonsByTh(has, elm, pg_name) {

    if (has) {
        var data = $(elm).data();
        dataOrder = { colId: "", sort: "", index: 0 };
        var sort = data.sort == "desc" ? "asc" : "desc";
        dataOrder = { colId: data.colid, sort: sort, index: data.index };
        $("i").removeClass("active-sortIcon");
        get_pagetable(pg_name, () => callbackAfterFilter(pg_name));
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

function after_save_row(pg_name, result_opr, keycode, initial) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var trediting = arr_pagetables[index].trediting;
    var filtervalue = arr_pagetables[index].filtervalue;

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
            if (filtervalue !== "")
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            else if (pagetable_currentpage != pagetable_lastpage) {
                arr_pagetables[index].currentrow = 1;

                if ($(`#${pagetable_id} .pagetablebody `).hasClass("new-page-tableV1"))
                    insertNewPageV1(pagetable_id);
                else if ($(`#${pagetable_id} .pagetablebody `).hasClass("new-page-table"))
                    insertNewPage(pagetable_id);
                else
                    pagetable_nextpage(pagetable_id);

                //pagetable_nextpage(pagetable_id);
            }
            else if (pagetable_currentpage == pagetable_lastpage)
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
            if (pagetable_currentpage == 1) {
                if (result_opr == "success" || result_opr == "cancel")
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
                if (result_opr == "cancel")
                    initialRow(pagetable_id, initial);
            }
            else if (pagetable_currentpage != 1)
                pagetable_prevpage(pagetable_id);
        }
    }

    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pagetable_id);
}

function initialRow(pg_name, isInitial) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    arr_pagetables[index].trediting = false;

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).find(".editrow").remove();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input:not([type='checkbox']),select,div.funkyradio").attr("disabled", true);
    //$(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio").blur();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio > label").removeClass("border-thin");

    if (isInitial) {
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input").val("");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("select").val("0").trigger("change");
    }

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

function set_row_editing(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_editable = arr_pagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
    var pagetable_currentcol = arr_pagetables[index].currentcol;

    if (pagetable_editable) {

        arr_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);
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

function get_cell_value(pagetable_id, columnindex, rowindex) {
    var cellvalue = $(`#${pagetable_id} .pagetablebody tbody > #row${rowindex} td:eq(${columnindex})`).text();
    return cellvalue;
}

function tr_object_onblur() {

}

$(".persian-date,.persian-datepicker,.double-input,.double-inputsearch").on("keydown", function (e) {

    if ([KeyCode.Enter].indexOf(e.keyCode) < 0) return;

    var valThis = $(this).val(), elmAfter;

    if ($(this).hasClass("persian-date") || $(this).hasClass("persian-datepicker")) {

        elmAfter = $(this).parents(".form-group").next().find("input");
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
