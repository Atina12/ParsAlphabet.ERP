var viewData_form_title = "مبانی حق  حق الزحمه طبابین";
var viewData_controllername = "AttenderMarginBracketApi";
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}CurrencyExchange.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

$("#AddEditModal").on("show.bs.modal", function () {

    if (modal_open_state == 'Add') {
        setDefaultActiveCheckbox($("#isActive"));
    }
   
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#name").val("").prop("disabled", false);
    setDefaultActiveCheckbox($("#isActive"));
});

function initAttenderMarginBracket() {
    get_NewPageTableV1();
}

function run_button_edit(p_keyvalue, rowno, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;


    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    let viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`;

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
            modal_fill_items(result, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function modal_fill_items(items, modal_name) {

    $("#name").val(checkResponse(items.name) ? items.name : "")
    $("#isActive").prop("checked", items.isActive).trigger("change")
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {
        id: 0,
        name: $("#name").val(),
        isActive: $("#isActive").prop("checked")
    };

    var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/save`

    //موقت

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, undefined, get_NewPageTableV1)
}

function modal_record_update(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    var newModel = {};



    var newModel = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        isActive: $("#isActive").prop("checked")
    };

    var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/save`


    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_edited, undefined, get_NewPageTableV1);
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

initAttenderMarginBracket()
