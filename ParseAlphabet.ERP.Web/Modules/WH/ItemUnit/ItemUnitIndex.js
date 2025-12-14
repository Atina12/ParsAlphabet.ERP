
var viewData_form_title = "واحدهای شمارش";
var viewData_controllername = "ItemUnitApi";
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemUnit.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "wh.ItemUnit";
var isSecondLang = true;
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var ItemSubUnit = [];


function initItemUnitIndex() {

    $("#ratio").inputmask()

    get_NewPageTableV1();

    loadDropDownItemUnitIndex()

}

function loadDropDownItemUnitIndex(){
    fill_select2(`${viewData_baseUrl_WH}/${viewData_controllername}/getdropdown`, "unitId", true);
}

function run_button_edit(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "AddEditModal";

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

    var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;

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
            Modal_fill_items(result.data, modal_name);
            modal_show(modal_name);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function resetItems() {
    $("#unitName").val("")
    setDefaultActiveCheckbox($("#isActiveHeader"));
}

function Modal_fill_items(result, modal_name) {
    resetItems()
    fillItems(result)
}

function fillItems(result) {
    $("#unitName").val(result.name)
    $("#isActiveHeader").prop("checked", result.isActive).trigger("change")
}

function modal_saveAddEditModal(modalName) {

    var form = $(`#${modalName} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (modal_open_state == "Add")
        modal_record_insertNew(modalName);
    else
        if (modal_open_state == "Edit")
            modal_record_updateNew(modalName);
}

function modal_record_insertNew(modalName) {

    let insertModel = {
        name: $("#unitName").val(),
        isActive: $("#isActiveHeader").prop("checked"),
    }

    var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
    $("#modal-save").prop("disabled", true)
    $.ajax({
        url: viewData_insrecord_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(insertModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                modal_close(modalName);
                get_NewPageTableV1();
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
            error_handler(xhr, viewData_insrecord_url)
        }
    });
}

function modal_record_updateNew(modalName) {

    let updateModel = {
        id: $("#modal_keyid_value").text(),
        Name: $("#unitName").val(),
        isActive: $("#isActiveHeader").prop("checked"),
    }

    var viewData_inssubunitrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
    $("#modal-save").prop("disabled", true)
    $.ajax({
        url: viewData_inssubunitrecord_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(updateModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                modal_close(modalName);
                get_NewPageTableV1();
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
            error_handler(xhr, viewData_inssubunitrecord_url)
        }
    });
}

function run_button_additem(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "AddEditModalItems";

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value_item").text(p_keyvalue);
    $("#modal_keyid_caption_item").text("شناسه : ");

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

    let viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid_itemsubunit/${p_keyvalue}/0`;
    $.ajax({
        url: viewData_getrecord_url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            Modal_fill_itemsNew(result.data);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function Modal_fill_itemsNew(result) {
    $("#unitId").prop('selectedIndex', 0).trigger("change");
    $("#ratio").val("")
    setDefaultActiveCheckbox($("#isActiveTable"));
    ItemSubUnit = []
    newFillItems(result)
}

function newResetItems() {

    ItemSubUnit = []
    setDefaultActiveCheckbox($("#isActiveTable"));
    $("#idNumber").val("")
    $("#idNumberReal").val("")
    $("#ratio").val("").removeAttr("disabled")
    $("#unitId").val("").removeAttr("disabled").prop('selectedIndex', 0).trigger("change");
}

function setDefaultActiveCheckbox(elm) {
    var switchValue = $(elm).attr("switch-value").split(',');
    if (!$(elm).prop("checked")) {
        $(elm).prop("checked", true);
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio1).text(switchValue[0]);
    }
}

function newFillItems(result) {
    let itemSubUnitList = result.itemSubUnitList
    let newItems = []

    if (checkResponse(itemSubUnitList)) {
        for (let i = 0; i < itemSubUnitList.length; i++) {
            newItems[i] = {
                unitId: itemSubUnitList[i].unitId,
                unitIdText: itemSubUnitList[i].itemSubUnitName,
                ratio: itemSubUnitList[i].ratio + "",
                isActive: itemSubUnitList[i].isActive,
            }
        }
    }

    ItemSubUnit = newItems
    listOfcountingUnits(true)
}

function saveUpdateRow(elm) {
    let idNumber = $("#idNumber").val()
    let idNumberReal = $("#idNumberReal").val()
    let unitIdText = $("#unitId option:selected").text()
    let unitId = $("#unitId").val()
    let ratio = $("#ratio").val()
    let isActive = $("#isActiveTable").prop("checked")

    if (!checkResponse(unitId) || unitId == "") {
        var msgItem = alertify.warning("واحد شمارش را وارد کنید");
        msgItem.delay(alertify_delay);
        $("#unitId").select2("focus")
        return
    }

    if (!checkResponse(ratio) || ratio == "") {
        var msgItem = alertify.warning("ضریب را وارد کنید");
        msgItem.delay(alertify_delay);
        $("#ratio").focus()
        return
    } else {
        let val = ratio.replace("/", ".")
        let regex = /^\d+(\.\d{1,3})?$/
        if (!regex.test(val)) {
            var msgItem = alertify.warning('ضریب را به صورت صحیح وارد کنید');
            msgItem.delay(alertify_delay);
            $("#ratio").focus()
            return
        }
        if (val == 0) {
            var msgItem = alertify.warning('ضریب نمی تواند صفر باشد');
            msgItem.delay(alertify_delay);
            $("#ratio").focus()
            return
        }
    }

    let model = {
        headerId: +$("#modal_keyid_value_item").text(),
        unitId,
        unitIdText,
        ratio: ratio.replace("/", "."),
        isActive
    }

    let newModel = {
        headerId: +$("#modal_keyid_value_item").text(),
        unitId: +unitId,
        ratio: +ratio.replace("/", "."),
        isActive
    }

    let viewData_insertsubitem = `${viewData_baseUrl_WH}/${viewData_controllername}/insertsubitem`
    let viewData_updatesubitem = `${viewData_baseUrl_WH}/${viewData_controllername}/updatesubitem`
    $.ajax({
        url: (checkResponse(idNumber) && idNumber == "") ? viewData_insertsubitem : viewData_updatesubitem,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                if (checkResponse(idNumber) && idNumber == "") {
                    ItemSubUnit.push(model)
                    $("#tableLine tbody").empty()
                    listOfcountingUnits()
                    resetInputsRowUnits()
                }
                else {
                    ItemSubUnit[idNumberReal - 1].unitId = newModel.unitId
                    ItemSubUnit[idNumberReal - 1].isActive = model.isActive
                    ItemSubUnit[idNumberReal - 1].unitIdText = model.unitIdText
                    ItemSubUnit[idNumberReal - 1].ratio = model.ratio
                    $("#tableLine tbody").empty()
                    listOfcountingUnits()
                    resetInputsRowUnits()
                }
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                if (checkResponse(idNumber) && idNumber == "")
                    $("#unitId").select2("focus")
                else
                    resetInputsRowUnits()
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_insertsubitem)
        }
    });


}

function listOfcountingUnits(isModalOpen = false) {
    $("#tableLine tbody").empty()

    let itemSubUnitReverse = ItemSubUnit

    if (itemSubUnitReverse.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="5" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLine tbody").append(emptyStr)
    } else {
        let j = 0
        for (let i = itemSubUnitReverse.length - 1; i >= 0; i--) {
            let newRtion = itemSubUnitReverse[i].ratio
            newRtion = newRtion.replace(".", "/")
            let str = `<tr id='rowItem${i + 1}' highlight=${j + 1} onclick="newTrOnclick(${j + 1})" onkeydown="newTrOnkeydown(this,event,${j + 1})" tabindex="-1">`
            str += `<td style="width:8%;text-align:center">${j + 1}</td>`
            str += `<td style="width:32%">${itemSubUnitReverse[i].unitIdText}</td>`
            str += `<td style="width:23%">${newRtion}</td>`

            if (itemSubUnitReverse[i].isActive) {
                str += `<td style="width:23% ;text-align:center"><i class="fas fa-check"></i></td>`
            } else {
                str += `<td style="width:23%; text-align:center"></td>`
            }

            str += `
                <td style="width:14% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine('AddEditModal',this,${i + 1},'${itemSubUnitReverse[i].unitId}','${itemSubUnitReverse[i].ratio}',${itemSubUnitReverse[i].isActive},event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine('AddEditModal',this,${j + 1},${i + 1},'${itemSubUnitReverse[i].unitId}','${itemSubUnitReverse[i].ratio}',${itemSubUnitReverse[i].isActive},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
            str += `</tr>`
            $("#tableLine tbody").append(str)
            j++
        }


        $(`#AddEditModalItems tbody tr[highlight=1]`).addClass("highlight");
    }

    if (!isModalOpen)
        $("#unitId").select2("focus")
         //resetInputsRowUnits()
         
}

function resetInputsRowUnits() {
    setDefaultActiveCheckbox($("#isActiveTable"));
    $("#idNumber").val("")
    $("#idNumberReal").val("")
    $("#ratio").val("").removeAttr("disabled")
    $("#unitId").val("").removeAttr("disabled").prop('selectedIndex', 0).trigger("change");
    $("#unitId").select2("focus")
}

function deleteLine(modal_name, elm, row, unitId, ratio, isActive, e) {
    e.preventDefault()
    e.stopPropagation()

    let insertModel = {
        headerId: +$("#modal_keyid_value_item").text(),
        unitId: +unitId,
        ratio: +ratio.replace("/", "."),
        isActive: isActive,
    }

    let url = "api/WH/ItemUnitApi/deletesubitem"

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(insertModel),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                ItemSubUnit.splice(row - 1, 1)
                $("#tableLine tbody").empty()
                listOfcountingUnits()
                resetInputsRowUnits()
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                resetInputsRowUnits()
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function editLine(modal_name, elm, showRow, realRow, unitId, ratio, isActive, e) {
    e.stopPropagation()
    
    $("#idNumber").val(showRow);
    $("#idNumberReal").val(realRow);
    $("#unitId").val(unitId).prop("disabled", true).trigger("change");
    $("#ratio").val(ratio.toString().replace(".", "/")).prop("disabled", true);
    $("#isActiveTable").prop("checked", isActive);

    $(".funkyradio").focus();
    var lbl_funkyradio = $(".funkyradio").find("label");
    lbl_funkyradio.addClass("border-thin");
}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#AddEditModalItems .highlight`).removeClass("highlight");
    $(`#AddEditModalItems tr[highlight=${row}]`).addClass("highlight");
    $(`#AddEditModalItems tr[highlight=${row}]`).focus();
}

function newTrOnkeydown(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#AddEditModalItems tr[highlight = ${row - 1}]`).length != 0) {
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tr[highlight = ${row - 1}]`).addClass("highlight");
            $(`#AddEditModalItems tr[highlight = ${row - 1}]`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#AddEditModalItems tr[highlight = ${row + 1}]`).length != 0) {
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tr[highlight = ${row + 1}]`).addClass("highlight");
            $(`#AddEditModalItems tr[highlight = ${row + 1}]`).focus();
        }
    }

}

$("#AddEditModalItems").on("show.bs.modal", function () {
    //if (modal_open_state == 'Add') {}
});

$("#AddEditModalItems").on("hidden.bs.modal", function () {
    $("#tableLineDsipaly").css("display", "none")
    newResetItems()
});

$("#stimul_preview")[0].onclick = null;

$("#stimul_preview").click(function () {
    var pagetable_id = "pagetable";

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");

    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");


    p_id = ""
    p_value = ""
    p_type = ""
    p_size = ""

    var p_url = viewData_print_file_url;
    var p_isPageTable = true;
    var p_tableName = "";
    var p_keyValue = 0/*+$("#form_keyvalue").val();*/
    var secondLang = false;
    window.open(`${viewData_print_url1}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == 'Add') {
        setDefaultActiveCheckbox($("#isActiveHeader"));
    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    resetItems()
});

initItemUnitIndex()


