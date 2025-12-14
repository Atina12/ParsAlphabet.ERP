var viewData_form_title = "موقعیت دارایی ثابت";
var viewData_controllername = "FixedAssetLocationApi";
var viewData_getrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.FA.Prn}FixedAssetLocation.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_FA}/${viewData_controllername}/csv`;


function initForm() {
    get_NewPageTableV1();
    loadDropdown()
}

function loadDropdown() {
    fill_dropdown("/api/GN/LocCountryApi/getdropdown", "id", "name", "countryId");
    fill_select2(`${viewData_baseUrl_GN}/LocStateApi/getdropdown`, "stateId", true, 0);
}

$("#stateId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#cityId").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "cityId", true, +$(this).val());
    }

    if (($('#stateId :selected').length == 0) || ($('#stateId :selected').val() == 0)) {
        $('#cityId').attr('disabled', 'disabled');
        $("#cityId").val('0').trigger('change');
    }
    else {
        $('#cityId').removeAttr('disabled');
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

initForm()

