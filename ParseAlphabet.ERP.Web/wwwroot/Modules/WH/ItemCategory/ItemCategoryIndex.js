
var viewData_form_title = "دسته بندی کالا / خدمت";
var viewData_controllername = "ItemCategoryApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemCategory.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var itemAttributeLinesForAddAndDelete = [];
var itemAttributeArrayCheck = [];
var itemAttributeText = [];



function initItemCategoryIndex() {

    get_NewPageTableV1();

    fillDropDown()

    fillItemAttributeIdsItemCheckBox();
}

$("#AddEditModal").on("show.bs.modal", function () {

    if (modal_open_state == 'Add') {
        $("#itemTypeId").prop("disabled", false);
        $("#divItemAttributeIds").addClass("d-none");
        $("#itemAttributeIds").prop("disabled", false);
    }
    else {
        $("#itemTypeId").prop("disabled", true);
        $("#itemAttributeIds").prop("disabled", true);
        itemAttributeText = [];
    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#itemTypeId").prop('selectedIndex', 0).trigger("change");
    $("#divItemAttributeIds").removeClass("d-none");
    $("#itemAttributeIds input").removeAttr("disabled");
    itemAttributeArrayCheck = [];
    itemAttributeText = [];
});

$("#itemTypeId").on("change", async function () {
    let itemTypeId = $(this).val()

    itemAttributeArrayCheck = []

    $("#itemAttributeIds input").prop("checked", false).trigger("change")

    if (itemTypeId == 1) {
        $("#divItemAttributeIds").removeClass("d-none");
        $("#itemAttributeIds input").removeAttr("disabled");
    } else {
        $("#divItemAttributeIds").addClass("d-none");
        $("#itemAttributeIds input").attr("disabled", true);
    }
})

function fillDropDown() {
    fill_dropdown("/api/WHApi/itemtype_getdropdown", "id", "name", "itemTypeId", true, "1,2,3,4,5");
}

function modal_save(modal_name = null, pageVersion = "pagetable") {
    if (modal_name == null)
        modal_name = modal_default_name;
    
    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    
    let itemAttributeIds = "";

    if ($("#itemTypeId").val() == 1) {

        if (itemAttributeArrayCheck.length > 4) {
            var msg = alertify.warning("صفات کالا حداکثر 4 مورد می تواند باشد");
            msg.delay(alertify_delay);
            //$("#itemAttributeIds").focus()
            return
        }
        else {
            for (var i = 0; i < itemAttributeArrayCheck.length; i++) {
                itemAttributeIds += itemAttributeArrayCheck[i].id + ',';
            }
            itemAttributeIds = itemAttributeIds.substring(0, itemAttributeIds.length - 1)
        }

        if (itemAttributeArrayCheck.length == 0)
            itemAttributeIds = "9"
    }
    else

        itemAttributeIds = null;



    let newModel = {
        isActive: $("#isActive").prop("checked"),
        itemAttributeIds,
        itemTypeId: $("#itemTypeId").val(),
        name: $("#name").val()
    }

   
    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }


    var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, undefined)
}

function modal_record_update(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let id = +$("#modal_keyid_value").text();

    let itemAttributeIds = "";

    if ($("#itemTypeId").val() == 1) {
        if (itemAttributeArrayCheck.length > 4) {
            var msg = alertify.warning("صفات کالا حداکثر 4 مورد می تواند باشد");
            msg.delay(alertify_delay);
            //$("#itemAttributeIds").focus()
            return
        }
        else {
            for (var i = 0; i < itemAttributeArrayCheck.length; i++) {
                itemAttributeIds += itemAttributeArrayCheck[i].id + ',';
            }
            itemAttributeIds = (itemAttributeIds.substring(0, itemAttributeIds.length - 1));
        }

        if (itemAttributeArrayCheck.length == 0)
            itemAttributeIds = "9"
    }
    else

        itemAttributeIds = null;

    let newModel = {
        id,
        isActive: $("#isActive").prop("checked"),
        itemAttributeIds,
        itemTypeId: $("#itemTypeId").val(),
        name: $("#name").val()
    }

    var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }


    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, undefined);
}

function recordInsertUpdate(url, insertModel, modalName, callBack = undefined) {
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

                var msg = alertify.success("عملیات با موفقیت انجام شد");
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
            error_handler(xhr, url)
        }
    });
}

function fillItemAttributeIdsItemCheckBox() {

    let url = "api/WH/ItemCategoryApi/getlistitemattribute"
    $.get(url, function (result) {
        let str = ""

        for (let i = 0; i < result.length; i++) {
            str += `<div class="col-md-3" >
                      <div  class="d-flex align-items-center w-100 h-100" >
                          <label class="d-flex jusftify-content-center align-items-center ml-1">
                            <input  id="input_${result[i].id}" tabindex="${i + 4}" onchange="itemAttributeChecked(this)"  data-value="${result[i].id}"  data-text="${result[i].name}" type="checkbox" />${result[i].name}
                          </label>
                     </div>
                   </div>`;
        }
        $("#itemAttributeIds").html(str)
        //$("#modal-save").prop("tabindex", result.length + 4)
    });

}

function itemAttributeChecked(item) {

    let dataValue = $(item).data("value");
    dataValue = dataValue.toString()
    let checked = $(item).prop("checked")
    let itemAttributeIndex = itemAttributeArrayCheck.findIndex(object => object.id == dataValue);

    //add
    if (checked) {
        let isInArr = itemAttributeArrayCheck.find(item => item.id == dataValue)
        if (isInArr === undefined)
            itemAttributeArrayCheck.push({ id: dataValue })
        else
            itemAttributeArrayCheck[itemAttributeIndex] = { id: dataValue }

    }//delete
    else {
        let isInArr = itemAttributeArrayCheck.find(item => item.id == dataValue)
        if (isInArr !== undefined) {
            itemAttributeArrayCheck = itemAttributeArrayCheck.filter(item => item.id != dataValue)
        }
    }

    if (itemAttributeArrayCheck.length != 0) {
        let newLegend = ""

        for (let i = 0; i < itemAttributeArrayCheck.length; i++) {
            newLegend += `${$(`#input_${itemAttributeArrayCheck[i].id}`).data("text")} , ` 
        }

        newLegend = (newLegend.substring(0, newLegend.length - 3));
        $('#divItemAttributeIds fieldset legend').text(`(صفات کالا : ${newLegend})`);
    }
    else
        $('#divItemAttributeIds fieldset legend').text("(صفات کالا)");

}

function run_button_edit(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;


    $("#AddEditModal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("سطر : ");

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

function modal_fill_items(item, modal_name = null) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;
    $("#itemTypeId").val(item.itemTypeId).trigger("change.select2");
    $("#isActive").prop("checked", item.isActive).trigger("change")
    $("#name").val(item.name)
    $("#itemAttributeIds div div label").children("input[type='checkbox']:checked").prop("checked", false);

    if ($("#itemTypeId").val() == 1) {
        $("#divItemAttributeIds").removeClass("d-none");
        $("#itemAttributeIds div div label").children("input[type='checkbox']").prop("disabled", false);
        itemAttributeArrayCheck = []
        var chekBox = $("#itemAttributeIds div div label").children("input[type='checkbox']");

        let newLegend = ""
        if (item.itemAttributeIds != null) {

            for (var i = 0; i < chekBox.length; i++) {
                let itemAttributeId = item.itemAttributeIds.split(',');
                let inputChek = chekBox[i];
                for (var j = 0; j < itemAttributeId.length; j++) {
                    if (itemAttributeId[j] == $(inputChek).data().value) {
                        $(inputChek).prop("checked", true);
                        newLegend += `${$(inputChek).data("text")} , `
                        itemAttributeArrayCheck.push({ id: itemAttributeId[j] });
                    }
                }

            }
            newLegend = (newLegend.substring(0, newLegend.length - 3));
            $('#divItemAttributeIds fieldset legend').text(`(صفات کالا : ${newLegend})`);
        }
        else
            $('#divItemAttributeIds fieldset legend').text("(صفات کالا)");

    }
    else {
        $("#divItemAttributeIds").addClass("d-none");
    }
    if (item.countItemCategoryAttribute > 0) {
        $("#itemAttributeIds div div label").children("input[type='checkbox']").prop("disabled", true);
    }

}

function run_button_itemAttributeLineSimple(p_keyvalue, rowno, elem, ev) {
    navigation_item_click(`/WH/ItemCategoryAttribute/${+p_keyvalue}`);
}

initItemCategoryIndex()
