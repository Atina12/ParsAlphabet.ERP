var viewData_form_title = "انبار";
var viewData_controllername = "WarehouseApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}Warehouse.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var arrayCheck = [];



function initWareHouseIndex() {
    get_NewPageTableV1();

    loadDropDownWareHouse()

    $("#locCountryId").trigger("change");
    $("#locStateId").trigger("change");
}

function loadDropDownWareHouse() {
    fill_select2(`/api/WHApi/costingMethod_getdropdown`, "costingMethodId", true);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true)
    fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryId", true);
}

function recordInsertUpdate(url, insertModel, modalName, message, callBack = undefined, callBackPageTable = undefined) {
  
    insertModel["itemTypes"] = arrayCheck.toLocaleString();

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

function resetPatientInfo() {
    $("#name").val("")
    $("#branchId").val("").trigger("change")
    $("#locCountryId").val("").trigger("change")
    $("#locStateId").val("").prop("disabled", true).trigger("change")
    $("#locCityId").val("").prop("disabled", true).trigger("change")
    $("#postalCode").val("")
    $("#isActive").prop("checked", true)
    $("#costingMethodId").val('').trigger("change")
    $("#address").val("")
}

function run_button_accountDetail(id, rowNo, elm) {
    
    addAccountDetail(id, "wh.Warehouse", viewData_getrecord_url, "id", "name", "isActive", "", get_NewPageTableV1);
}

$("#locCountryId").on("change", function () {

    if (+$(this).val() != 0) {
        $("#locStateId").html("");
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateId", true);
    }

    if (($('#locCountryId :selected').length == 0) || $('#locCountryId :selected').val() != 101) {
        $('#locStateId').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locStateId').prop('disabled', false).prop("required", true).trigger("change");
    }
});

$("#locStateId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityId").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityId", true, +$(this).val());
    }

    if (($('#locStateId :selected').length == 0) || ($('#locStateId :selected').val() == 0)) {
        $('#locCityId').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locCityId').prop('disabled', false).prop("required", true).trigger("change");
    }
});

$("#AddEditModal").on("show.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
    if (modal_open_state == 'Add') {
        resetPatientInfo()
        $("#branchId").prop("disabled", false);
    }
    else {
        $("#branchId").prop("disabled", true);
    }
});

$("#AddEditModal").on("hidden.bs.modal", resetPatientInfo);

initWareHouseIndex()

