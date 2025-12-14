var viewData_form_title = "پالت های انبار";


var viewData_controllername = "WBinApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
var viewData_check_checkExistBin_url = `${viewData_baseUrl_WH}/${viewData_controllername}/checkExistBinByRankId`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}Bin.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;

fill_select2("/api/WH/ZoneApi/getdropdown", "zoneId", true);
fill_select2("/api/WHApi/binCategory_getdropdown", "categoryId", true);
fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getdropdown`, "warehouseId", true, 0);

get_NewPageTableV1();

$("#warehouseId").change(function () {
    $("#zoneId").empty();
    fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneId", true, +$(this).val());
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
    if (modal_open_state == 'Add') {
        $("#warehouseId").prop("disabled", false);
        $("#warehouseId").trigger("change");
        $("#zoneId").prop("disabled", false);
    }
    else {
        $("#warehouseId").prop("disabled", true);
        $("#zoneId").prop("disabled", true);
    }
});

function checkExistBinrank(id, keyId) {
    var output = $.ajax({
        url: `${viewData_check_checkExistBin_url}/${id}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_check_checkExistBin_url}/${id}`);
            return JSON.parse(false);
        }
    });
    if (output.responseJSON == 0)
        return true
    else
        return output.responseJSON == keyId;

}

window.Parsley._validatorRegistry.validators.binrankexit = undefined;
window.Parsley.addValidator("binrankexit", {
    validateString: function (value) {
        if (+value !== 0)
            return checkExistBinrank(value, +$("#modal_keyid_value").text());

        return true;
    },
    messages: {
        en: 'شناسه پالت  قبلا ثبت شده است'
    }
});