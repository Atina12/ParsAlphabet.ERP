var viewData_form_title = "بخش انبار";


var viewData_controllername = "ZoneApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
var viewData_check_checkExistZone_url = `${viewData_baseUrl_WH}/${viewData_controllername}/checkExistZoneByRankId`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}Zone.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;

fill_select2("/api/WH/WarehouseApi/getdropdown", "warehouseId", true)


get_NewPageTableV1();

$("#AddEditModal").on("show.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));

    if (modal_open_state == 'Add') {
        $("#warehouseId").prop("disabled", false).val(0).trigger("change");
    }
    else {
        $("#warehouseId").prop("disabled", true);
    }
});


window.Parsley._validatorRegistry.validators.zonerankexit = undefined

window.Parsley.addValidator("zonerankexit", {
    validateString: function (value) {
        if (+value !== 0)
            return checkExistZonerank(value, +$("#modal_keyid_value").text());

        return true;
    },
    messages: {
        en: 'شناسه بخش قبلا ثبت شده است'
    }
});


function checkExistZonerank(id, keyId) {
    var output = $.ajax({
        url: `${viewData_check_checkExistZone_url}/${id}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_check_checkExistZone_url}/${id}`);
            return JSON.parse(false);
        }
    });
    if (output.responseJSON == 0)
        return true
    else
        return output.responseJSON == keyId;
}

function nameAccessToCaracters(elm) {
    $(elm).val(function (index, value) {
        return value.replace(/[^ا-ی0-9]/g, "");
    });
}