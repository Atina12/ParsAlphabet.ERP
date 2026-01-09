
var viewData_form_title = " بارکد ";
var viewData_controllername = "ItemBarcodeApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemBarcode.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var itemAttributeLinesForAddAndDelete = [];
var itemAttributeArrayCheck = [];
var itemCategoryId=0;


function initItemBarcodeIndex() {
    get_NewPageTableV1();

    $("#categoryItemId").prop("disabled", true);
    $("#barcode").prop("disabled", true);
    $("#itemNameId").select2({ placeholder: "انتخاب کنبد" });
    $("#itemAttributeIds").select2({ placeholder: "انتخاب کنبد" });

    fill_dropdown("/api/WHApi/itemtype_getdropdown", "id", "name", "itemTypeId", true, "1,4");
}

function resetInputs() {
    $("#itemTypeId").prop('selectedIndex', 0).trigger("change");
    $("#categoryItemId").val("");
    $("#itemAttributeIds").html("");
}

function getItemCategoryAttribute() {
    $('#itemAttributeIds').html('');
    url = `/api/WH/ItemCategoryApi/getitemcategoryattribute/${itemCategoryId}`;
    $.ajax({
        url: url,
        type: "get",
        contentType: "application/json",
        async: false,
        success: function (result) {
            hasAttribute = result;
            if (result) {
                $("#itemAttributeIds").attr("disabled", true);
                $("#itemAttributeIds").val("0").trigger("change");
            }
            else {
                fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "itemAttributeIds", true, itemCategoryId);
                $("#itemAttributeIds").attr("disabled", false);

            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });


}

function getCategoryItemName(id, itemTypeId) {

    $('#attributeIds').empty();
    
    $("#categoryItemId").val("");
    let url = `api/WH/ItemApi/getinfo/${id}`;
    

    let itemId = +id;
    if (id > 0) {
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {
                
                if (result && itemId > 0) {
                  
                    itemCategoryId = result.categoryId;
                    $('#categoryItemId').val(result.categoryIdName);
                    $("#barcode").prop("disabled", false);                   
                }
                else {
                    $('#categoryItemId').val("");
                    $("#barcode").prop("disabled", true);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
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

    let ItemAttributeIds = "";
    let newModel = {
        ItemId: $("#itemNameId").val(),
        AttributeIds: $("#itemAttributeIds").val(),
        Barcode:  $("#barcode").val(),
        
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

    let newModel = {
        id,
        ItemId: $("#itemNameId").val(),
        AttributeIds: $("#itemAttributeIds").val(),
        Barcode: $("#barcode").val(),

    }

    var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;

    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, undefined);
}

function recordInsertUpdate(url, insertModel, modalName, callBack = undefined) {

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
                resetInputs();
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
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
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
    
    $("#itemTypeId").val(item.itemTypeId).trigger("change");
    $("#itemNameId").val(item.itemId).trigger("change");
    $("#itemAttributeIds").val(item.attributeIds).trigger("change");
    $("#barcode").val(item.barcode)
   
}

function run_button_itemAttributeLineSimple(p_keyvalue, rowno, elem, ev) {
    navigation_item_click(`/WH/ItemCategoryAttribute/${+p_keyvalue}`);
}

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == 'Add') {
        $("#itemTypeId").val(0).trigger("change");
        $("#itemTypeId").prop("disabled", false);
        $("#divItemAttributeIds").addClass("d-none");
        $("#itemAttributeIds").prop("disabled", false);
    }
    else {
        $("#itemTypeId").prop("disabled", true);
        // $("#itemAttributeIds").prop("disabled", true);
    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#itemTypeId").prop('selectedIndex', 0).trigger("change");

});

$("#itemTypeId").on("change", async function () {
    let itemTypeId = $(this).val()
    if (+itemTypeId != 0) {
        fill_dropdown("/api/WH/ItemApi/getdropdownwithitemtypeid", "id", "name", "itemNameId", true, + $("#itemTypeId").val());
        $("#itemNameId").val(1).trigger("change");
    }
    else {
        $("#itemNameId").html("");
        $("#itemAttributeIds").html("");
        $("#categoryItemId").val("");
    }
})

$("#itemNameId").on("change", async function () {

    let itemNameId = $(this).val()

    if (+$("#itemNameId").val()) {
        getCategoryItemName(itemNameId, +$("#itemTypeId").val());
        getItemCategoryAttribute();
        //  fill_dropdown("/api/WH/ItemAttributeApi/attributeitem_getdropdown", "id", "name", "ItemAttributeIds", true, + $("#categoryItemId").val());
    }

})

initItemBarcodeIndex()
