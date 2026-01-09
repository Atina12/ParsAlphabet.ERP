var viewData_form_title = "کالا / خدمت";
var saveColumnsForLine = "";
var viewData_controllername = "ItemApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var itemId = 0;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}Item.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var ItemUnitDetail = [], ItemSubUnit = [], itemSubDetailList = [];
//var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var itemAttributeLinesItemByCategoryIdForAddAndDelete = [];
isSecondLang = true;

$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == 'Add') {
        modalClearItemsForm();
        itemId = 0;
        $("#itemTypeId").prop('disabled', false);
        $("#isActive").prop("checked", true).trigger("change")

        if ($("#vatEnable").prop("checked")) {
            $("#vatId").prop("required", true);
            $("#vatId").removeAttr("disabled");
        }
        else {
            $("#vatId").prop("required", false);
            $("#vatId").attr("disabled", "disabled");
        }
    }

    else if (modal_open_state == 'Edit') {
        if ($("#vatEnable").prop("checked")) {
            $("#vatId").prop("required", true);
            $("#vatId").removeAttr("disabled");
        }
        else {
            $("#vatId").prop("required", false);
            $("#vatId").attr("disabled", "disabled");
        }
        $("#itemTypeId").prop('disabled', true);
        $("#name").focus();

    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {

    ItemUnitDetail = []
    ItemSubUnit = []
    $(".share").addClass("displaynone")
    $(".charge").addClass("displaynone")
    $(".service").addClass("displaynone")
    $(".goods").addClass("displaynone")
    $(".itemVendor").addClass("displaynone")
    $("#tabpanelItem").addClass("displaynone")
})

$("#vatEnable").on('change', function () {
    if ($(this).prop("checked") == true) {
        $("#vatId").prop("disabled", false);
        $("#vatId").attr("required");
        $("#vatId").attr("data-parsley-selectvalzero", "");
    }
    else {
        $("#vatId").prop('disabled', true);
        $("#vatId").removeAttr("required");
        $("#vatId").removeAttr("data-parsley-selectvalzero");
        $("#vatId").val('0').trigger('change');
    }
});

$("#itemTypeId").on("change", function () {

    modalClearItemsForm()

    let itemTypeId = (+$(this).val() != 0 ? +$(this).val() : 0);

    configByItemTypeId(itemTypeId)

});

$("#unitId").on("change", function () {

    let unitId = +$(this).val();

    let url = `api/wh/ItemUnitApi/getrecordbyid_itemsubunit/${unitId}/${itemId}`

    if (checkResponse(unitId) && unitId != 0) {
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            data: unitId,
            async: false,
            cache: false,
            success: function (result) {
                if (checkResponse(result))
                    $(`[href="#unit"]`).click();
                ItemUnitDetail = []
                listOfcountingUnits(result)
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }
    else {
        ItemUnitDetail = []
        $("#tableLineunitId tbody").html('<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td></tr>')
    }

})

$("#categoryId").on("change", function () {

    let itemCategoryId = +$("#categoryId").val();

    if (itemCategoryId > 0) {

        let url1 = "api/WH/ItemCategoryAttributeApi/getlist_itemattributeline"
        $.ajax({
            url: url1,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(itemCategoryId),
            cache: false,
            success: function (result) {

                $(`[href="#itemCategory"]`).click();

                fillTableLineTheadColumns(result.data)

                getTableLineList(itemCategoryId);

            },
            error: function (xhr) {
                error_handler(xhr, url1)
            }
        });

    }
    else {
        $('[href="#itemCategory"]').click();
        $("#tableLineTheadColumns").html("<tr><th>سطر</th></tr>")
        $("#tableLineTbodyLines").html("<tr style='text-align :center'><td>سطری وجود ندارد</td></tr>")
    }
});

function initItem() {

    kamaDatepicker('subscriptionFromDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('subscriptionToDatePersian', { withTime: false, position: "bottom" });

    $(".share").addClass("displaynone");
    $(".charge").addClass("displaynone");
    $(".service").addClass("displaynone");
    $(".goods").addClass("displaynone");

    $("#tabpanelItem").addClass("displaynone")

    $("#itemTypeId").select2()
    $("#subscriptionFromDatePersian").inputmask();
    $("#subscriptionToDatePersian").inputmask();

    fillDropDown()

    pagetable_formkeyvalue = ["", ""];
    get_NewPageTableV1();

}

function configByItemTypeId(itemTypeId) {

    $("#categoryId").empty();

    $("#unitId").val(0).trigger("change")
    if (itemTypeId > 0) {

        fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype`, "categoryId", true, +itemTypeId);

        //Goods
        if (itemTypeId === 1 || itemTypeId === 4) {

            $(".share").addClass("displaynone");
            $(".charge").addClass("displaynone");
            $(".service").removeClass("displaynone");
            $(".goods").removeClass("displaynone");

            $("#subscriptionFromDatePersian").prop('required', false)
            $("#subscriptionToDatePersian").prop('required', false)
            $("#payrollTaxId").prop('required', false)
            $("#priceIncludingVat").prop('checked', false)
            $("#exclusiveSupplier").prop('checked', false)
            $("#barcodeMandatory").prop('checked', false)

            $("#tabpanelItem").removeClass("displaynone")

            if (modal_open_state == 'Add') {
                $(".itemCategory").removeClass("displaynone");
                $(".unit").removeClass("displaynone")
                $(".itemVendor").addClass("displaynone");
            }
            else {

                listOfUserItem();

                $(".itemCategory").removeClass("displaynone");
                $(".unit").removeClass("displaynone")
                $(".itemVendor").removeClass("displaynone")

                setTimeout(() => {
                    $(`[href="#itemCategory"]`).click();
                }, 200)
            }
        }
        // Service - ChargeItem
        else if (itemTypeId === 2 || itemTypeId === 3) {
            $(".goods").addClass("displaynone");
            $(".service").addClass("displaynone");
            $(".share").addClass("displaynone");
            $(".charge").removeClass("displaynone");


            $("#subscriptionFromDatePersian").prop('required', false)
            $("#subscriptionToDatePersian").prop('required', false)
            $("#priceIncludingVat").prop('checked', false)
            $("#exclusiveSupplier").prop('checked', false)
            $("#barcodeMandatory").prop('checked', false)

            if (modal_open_state == 'Add') {
                $("#tabpanelItem").addClass("displaynone")
            }
            else {

                listOfUserItem();

                $("#tabpanelItem").removeClass("displaynone")
                $(".itemCategory").addClass("displaynone");
                $(".unit").addClass("displaynone");
                $(".itemVendor").removeClass("displaynone");

                setTimeout(() => {
                    $(`[href="#itemVendor"]`).click();
                }, 200)
            }

        }
        //Subscription
        else if (itemTypeId === 5) {

            $(".goods").addClass("displaynone");
            $(".charge").addClass("displaynone");
            $(".service").addClass("displaynone");
            $(".share").removeClass("displaynone");

            
            $("#payrollTaxId").prop('required', false)
            $("#priceIncludingVat").prop('checked', false)
            $("#exclusiveSupplier").prop('checked', false)
            $("#barcodeMandatory").prop('checked', false)
            $("#subscriptionFromDatePersian").prop('required', false)
            $("#subscriptionToDatePersian").prop('required', false)
            $("#subscriptionFromDatePersian").parents(".form-group").addClass("displaynone")
            $("#subscriptionToDatePersian").parents(".form-group").addClass("displaynone")

            if (modal_open_state == 'Add') {
                $("#tabpanelItem").addClass("displaynone")
            }
            else {

                listOfUserItem();

                $("#tabpanelItem").removeClass("displaynone")
                $(".itemCategory").addClass("displaynone");
                $(".unit").addClass("displaynone");
                $(".itemVendor").removeClass("displaynone");

                setTimeout(() => {
                    $(`[href="#itemVendor"]`).click();
                }, 300)
            }

        }
    }
    else {
        $(".share").addClass("displaynone");
        $(".charge").addClass("displaynone");
        $(".service").addClass("displaynone");
        $(".goods").addClass("displaynone");
        $("#tabpanelItem").addClass("displaynone")
        $("#categoryId").val(0).trigger("change")
    }
}

function fillDropDown() {
    fill_dropdown("/api/WHApi/itemtype_getdropdown", "id", "name", "itemTypeId", true, "1,2,3,4,5");
    fill_select2(`${viewData_baseUrl_FM}/VATApi/getdropdown`, "vatId", true, 0);
    fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`, "unitId", true, 0);
    fill_select2(`${viewData_baseUrl_HR}/PayrollTaxBracketApi/getdropdown`, "payrollTaxId", true, false, 0, "انتخاب");
}

function getTableLineList(categoryId) {

    let url = "api/WH/ItemCategoryAttributeApi/getlist_baseitemattribute"
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(categoryId),
        async: false,
        cache: false,
        success: function (result) {

            itemAttributeLinesItemByCategoryIdForAddAndDelete = [];
            itemAttributeLinesItemByCategoryIdForAddAndDelete = result;
            fillTableLineItemByCategoryIdtbodyLines();
        },
        error: function (xhr) {
            error_handler(xhr, url2)
        }
    });
}

function fillTableLineTheadColumns(itemAttributeLines) {

    let strTableLineTheadColumns = ""
    let repeatColumns = []
    let tabindex = 1

    $("#tableLineTheadColumns").html("")

    strTableLineTheadColumns += "<tr>"
    strTableLineTheadColumns += "<th>سطر</th>"

    for (let i = 0; i < itemAttributeLines.length; i++) {

        if (repeatColumns.length != 0) {

            let checkRepeat = repeatColumns.filter((itemAttributeId) => itemAttributeId == itemAttributeLines[i].itemAttributeId)
            if (checkRepeat.length == 0) {
                repeatColumns.push(itemAttributeLines[i].itemAttributeId)
                strTableLineTheadColumns += `<th>${itemAttributeLines[i].itemAttributeName}</th>`
                tabindex++
            }

        }
        else {

            repeatColumns.push(itemAttributeLines[i].itemAttributeId)
            strTableLineTheadColumns += `<th>${itemAttributeLines[i].itemAttributeName}</th>`
            tabindex++

        }
    }

    tabindex = saveColumnsForLine = tabindex - 1

    if (tabindex == 1) { width = '90%' }
    else if (tabindex == 2) { width = '45%' }
    else if (tabindex == 3) { width = '30%' }
    else { width = '22.5%' }

    strTableLineTheadColumns += "</tr>"
    $("#tableLineTheadColumns").html(strTableLineTheadColumns)

}

function fillTableLineItemByCategoryIdtbodyLines() {

    $("#tableLineTbodyLines").html("")

    let columns = saveColumnsForLine
    let columnsWidth = (100 / columns) + "%"

    if (itemAttributeLinesItemByCategoryIdForAddAndDelete.length === 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="${columns + 2}" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLineTbodyLines").append(emptyStr)
    }
    else {
        for (let i = 0; i < itemAttributeLinesItemByCategoryIdForAddAndDelete.length; i++) {

            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(this ,event, ${i + 1},'tableLineTbodyLines')" onkeydown="newTrOnkeydown(this,event,${i + 1},'tableLineTbodyLines')" tabindex="-1">`
            str += `<td style="width:5%;text-align:center">${i + 1}</td>`
            for (let j = 1; j <= columns; j++) {
                let Attribute = itemAttributeLinesItemByCategoryIdForAddAndDelete[i][`Attribute${j - 1}`];
                let AttributeName = itemAttributeLinesItemByCategoryIdForAddAndDelete[i][`AttributeName${j - 1}`];

                str += `<td id="td_row${i}_columns${j}" style="width:${columnsWidth};text-align:center">${Attribute} - ${AttributeName}</td>`
            }


            str += `</tr>`
            $("#tableLineTbodyLines").append(str)
        }
        $(`#tableLineTbodyLines  #rowItem1`).addClass("highlight");
    }
}

function newTrOnkeydown(elm, ev, row, parentId) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${parentId} #rowItem${row - 1}`).length != 0) {
            $(`#${parentId} .highlight`).removeClass("highlight");
            $(`#${parentId} #rowItem${row - 1}`).addClass("highlight");
            $(`#${parentId} #rowItem${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${parentId} #rowItem${row + 1}`).length != 0) {
            $(`#${parentId} .highlight`).removeClass("highlight");
            $(`#${parentId} #rowItem${row + 1}`).addClass("highlight");
            $(`#${parentId} #rowItem${row + 1}`).focus();
        }
    }
}

function newTrOnclick(elm, ev, row, parentId) {

    $(`#${parentId} .highlight`).removeClass("highlight");
    $(`#${parentId} #rowItem${row}`).addClass("highlight");
    $(`#${parentId} #rowItem${row}`).focus();
}

function run_button_warehouse(itemId) {
}

function modalClearItemsForm() {

    $("#name").val('')
    $("#categoryId").val('0').trigger("change")
    $("#unitId").val('0').trigger("change")
    $("#vatEnable").prop("checked", false).trigger("change")
    $("#vatId").val('0').trigger("change")
    $("#unlimited").prop("checked", false).trigger("change")
    $("#subscriptionFromDatePersian").val('')
    $("#subscriptionToDatePersian").val('')
    $("#isActive").prop("checked", true).trigger("change")
    $("#barcodeMandatory").prop("checked", false).trigger("change")
    $("#priceIncludingVat").prop("checked", false).trigger("change")
    $("#exclusiveSupplier").prop("checked", false).trigger("change")

    $("#tableLineunitId tbody").html("")
    $("#tableLineunitId tbody").html(`<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td></tr>`)

    $("#tableLineitemCategory tbody").html("")
    $("#tableLineitemCategory tbody").html(`<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td></tr>`)

    $("#tableLineitemVendor tbody").html("")
    $("#tableLineitemVendor tbody").html(`<tr><td colspan="6" style="text-align:center">سطری وجود ندارد</td></tr>`)



    ItemUnitDetail = []
    ItemSubUnit = []
}

function listOfcountingUnits(result) {

    $("#tableLineunitId tbody").html("");
    ItemSubUnit = []
    ItemSubUnit = result.data.itemSubUnitList

    if (checkResponse(ItemSubUnit) && ItemSubUnit.length != 0) {

        for (let i = 0; i < ItemSubUnit.length; i++) {
            let newRtion = +ItemSubUnit[i].ratio
            let newRtionForShow = newRtion.toString()
            newRtionForShow = newRtionForShow.replace(".", "/")

            let str = "<tr>"

            str += `<td style="width:8%;text-align:center"><input type = "checkbox" name = "checkbox"  id="chk_${+ItemSubUnit[i].unitId}" ${ItemSubUnit[i].checked ? "checked" : ""} onchange= "changeUnitId(this,${i})"/></td>`
            str += `<td style="width:23%">${ItemSubUnit[i].itemSubUnitName}</td>`
            str += `<td style="width:23%">${newRtionForShow}</td>`

            str += `</tr>`

            $("#tableLineunitId tbody").append(str)
        }
    }
    else {
        let emptyStr = `<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td></tr>`
        $("#tableLineunitId tbody").append(emptyStr)
    }
    itemSubDetailList = []

}

function listOfUserItem() {

    let str = "";
    let itemId = +$("#modal_keyid_value").text();
    let url = `${viewData_baseUrl_PU}/VendorItemsApi/getlistitemVendor`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(itemId),
        async: false,
        cache: false,
        success: function (result) {

            if (checkResponse(result)) {

                $("#tableLineitemVendorTbodyLines").html("")

                if (result.length != 0) {

                    for (let i = 0; i < result.length; i++) {

                        str += `<tr id=rowItem${i + 1}>`
                        str += `<td id="td_row${i}_columns${1}" >${i + 1}</td>`
                        str += `<td id="td_row${i}_columns${2}" >${result[i].personGroup}</td>`
                        str += `<td id="td_row${i}_columns${3}" >${result[i].fullNameIds}</td>`
                        str += `<td id="td_row${i}_columns${4}" >${result[i].userFullName}</td>`
                        str += `<td id="td_row${i}_columns${5}" >${result[i].createDateTimePersian}</td>`
                        str += `<td id="td_row${i}_columns${1}" >${result[i].isActiveStr}</td>`
                        str += `</tr>`

                    }
                }
                else {
                    str = '<tr id=rowItem1><td colspan=""></td></tr>'
                }


                $("#tableLineitemVendorTbodyLines").append(str)

                $(`#tableLineitemVendorTbodyLines  #rowItem1`).addClass("highlight");
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function changeUnitId(elm, row) {

    var itemUnitObject = {
        unitId: 0,
        subUnitId: 0,
        ratio: 0,
    }
    var isSelected = $(elm).prop("checked");
    if (isSelected === true) {
        itemUnitObject = {
            unitId: +$("#unitId").val(),
            subUnitId: +ItemSubUnit[row].unitId,
            ratio: +ItemSubUnit[row].ratio,
        }
        ItemUnitDetail.push(itemUnitObject)
    }
    else
        ItemUnitDetail = ItemUnitDetail.filter(item => item.subUnitId != +ItemSubUnit[row].unitId);
}

function modal_record_insert(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;


    let insertModel = {
        id: 0,
        itemTypeId: +$("#itemTypeId").val(),
        name: $("#name").val(),
        categoryId: +$("#categoryId").val(),
        unitId: +$("#unitId").val(),
        vatEnable: $("#vatEnable").prop("checked"),
        vatId: +$("#vatId").val(),
        isActive: $("#isActive").prop("checked"),
        barcodeMandatory: $("#barcodeMandatory").prop("checked"),
        priceIncludingVat: $("#priceIncludingVat").prop("checked"),
        exclusiveSupplier: $("#exclusiveSupplier").prop("checked"),
        subscriptionFromDatePersian: $("#subscriptionFromDatePersian").val(),
        subscriptionToDatePersian: $("#subscriptionToDatePersian").val(),
        unlimited: $("#unlimited").prop("checked"),
        itemUnitDetail: ItemUnitDetail.length == 0 ? [] : ItemUnitDetail,
        payrollTaxId: (+$("#itemTypeId").val() == 2 || +$("#itemTypeId").val() == 3 ? +$("#payrollTaxId").val() : null)

    }

    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }

    recordInsertUpdate(viewData_insrecord_url, insertModel, modal_name, msg_row_created, undefined, definePageTable)
}

function modal_record_update(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let insertModel = {
        id: +$("#modal_keyid_value").text(),
        itemTypeId: +$("#itemTypeId").val(),
        name: $("#name").val(),
        categoryId: +$("#categoryId").val(),
        unitId: +$("#unitId").val(),
        vatEnable: $("#vatEnable").prop("checked"),
        vatId: +$("#vatId").val(),
        isActive: $("#isActive").prop("checked"),
        barcodeMandatory: $("#barcodeMandatory").prop("checked"),
        priceIncludingVat: $("#priceIncludingVat").prop("checked"),
        exclusiveSupplier: $("#exclusiveSupplier").prop("checked"),
        subscriptionFromDatePersian: $("#subscriptionFromDatePersian").val(),
        subscriptionToDatePersian: $("#subscriptionToDatePersian").val(),
        unlimited: $("#unlimited").prop("checked"),
        itemUnitDetail: ItemUnitDetail.length == 0 ? [] : ItemUnitDetail,
        payrollTaxId: (+$("#itemTypeId").val() == 2 || +$("#itemTypeId").val() == 3 ? +$("#payrollTaxId").val() : null)
    }

    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }


    recordInsertUpdate(viewData_updrecord_url, insertModel, modal_name, msg_row_edited, undefined, definePageTable);
}

function recordInsertUpdate(url, insertModel, modalName, message, callBack = undefined, callBackPageTable = undefined) {
    $("#modal-save").prop("disabled", true)
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(insertModel),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull == true) {

                var msg = alertify.success(message);
                msg.delay(alertify_delay);
                modal_close(modalName);

                if (callBack != undefined)
                    callBack(result);

                //موقت
                if (callBackPageTable != undefined)
                    callBackPageTable();
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

            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
        },
        error: function (xhr) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
            error_handler(xhr, url)
        }
    });
}

function modal_close(modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    $(`#${modal_name} div.modal-body *`).removeClass("parsley-error");
    if (typeof form !== "undefined" && form !== undefined)
        if (form.length > 1)
            form[0].reset();
        else
            form.reset();


    $(`#${modal_name}`).modal("hide");
    $(`#${modal_name} .pagerowscount`).removeClass("dropup");
    $(`#${modal_name} .modal-dialog`).removeAttr("style");

    pagetable_id = "pagetable";

    if (typeof arr_pagetables != "undefined") {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
        var pagetable_currentrow = arr_pagetables[index].currentrow;

        $(`#pagetable .pagetablebody > tbody > #row${pagetable_currentrow}`).focus();
    }
    ItemUnitDetail = [], ItemSubUnit = [], itemSubDetailList = [];
}

async function modal_fill_items(item, modal_name = null) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;
    await fillinput(item, modal_name).then(result => {
        itemSubDetailList = item.itemSubDetailList;
    })
}

async function fillinput(item, modal_name) {

    var element = $(`#${modal_name}`);
    itemId = item.id;
    element.find("input,select,img,textarea").each(function () {

        var elm = $(this);
        var elmid = elm.attr("id");
        if (!elmid)
            return;
        var tag = elm.prop("tagName").toLowerCase();
        var val = item[elmid];

        if (tag === `input`) {
            var type = elm.attr("type").toLowerCase();
            if (type === `text` || type === `number`) {
                if (val) {
                    if (elm.hasClass("money"))
                        elm.val(transformNumbers.toComma(val));
                    else if (elm.hasClass("decimal")) {

                        let valueSplited = val.toString().split('.');

                        if (valueSplited.length === 1)
                            elm.val(`${val}/000`);
                        else
                            elm.val(val.toString().split('.').join("/"));
                    }
                    else
                        elm.val(val);
                }
            }
            else
                if (type === `checkbox`)
                    elm.prop("checked", val).trigger("change");
        }
        else if (tag === "textarea") {
            if (val)
                elm.val(val);
        }
        else if (tag === `select`) {
            if (val == null) val = 0;
            if (elm.hasClass(`select2`)) {
                var attrTitleId = elm.attr('titleId');

                if (typeof attrTitleId !== typeof undefined && attrTitleId !== false) {
                    if (item[attrTitleId] !== null) {
                        var newOption = new Option(`${val} - ${item[attrTitleId]}`, val, true, true);
                        elm.append(newOption).trigger('change');
                    }
                }
                else
                    elm.val(val).trigger('change');
            }
            else
                elm.val(val).trigger('change');
        }
        else if (tag === `img`) {
            if (!val)
                elm.attr("src", "/content/images/blank-person.png")
            else
                elm.attr("src", "data:image/png;base64," + val);
        }
    });
    return true;
}

function fillItemSubDetailsList() {
    $('#tableLineunitId tbody input').each(function () {
        for (var i = 0; i < itemSubDetailList.length; i++) {
            let inputChek = $(this).attr("id").split('_')[1];
            if (+inputChek == +itemSubDetailList[i].subUnitId)
                $(this).attr("checked", true);
        }
    })
}

function parameter() {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [""],
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }
    return parameters;
}
$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    var urlCSV = "api/WH/itemApi/csv";

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });
})

initItem()




