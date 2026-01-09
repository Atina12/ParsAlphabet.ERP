var viewData_form_title = "مرکز هزینه";


var viewData_controllername = "CostCenterApi";

var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;
var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}CostCenter.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0, isSecondLang }
var viewData_print_tableName = "";
isSecondLang = true;

get_NewPageTableV1();

fill_dropdown("/api/FMApi/costdrivertype_getdropdown", "id", "name", "costDriverTypeId", true, 0);
fill_dropdown("/api/FMApi/costcategory_getdropdown", "id", "name", "costCategoryId", true, 0);

$("#costDriverTypeId").on("change", function (ev) {

    var driverTypeId = +$(this).val();
    $("#costDriverId").html(`<option value="0">انتخاب کنید</option>`);

    if (driverTypeId !== 0) {
        fill_dropdown("/api/FMApi/costdriver_getdropdown", "id", "name", "costDriverId", true, driverTypeId);
        $("#costDriverId").prop("disabled", false);
    }
    else
        $("#costDriverId").prop("disabled", true).val('0').trigger('change');

});
$("#costDriverTypeId").val('0').trigger("change");

function checkIsActive(id) {

    var output = $.ajax({
        url: `${viewData_baseUrl_FM}/CostCenterApi/isactive/${id}`,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/CostCenterApi/isactive/{id}`);
            return JSON.parse(null);
        }
    });
    return output.responseJSON;
}

function run_button_costcenterline(lineId, rowNo) {


    var check = controller_check_authorize("CostCenterApi", "INS");
    if (!check)
        return;

    var resultIsActive = checkIsActive(lineId);
    let costCenterName = $(`#row${rowNo}`).data("name");
    if (resultIsActive == true)
        navigation_item_click(`/FM/CostCenterLine/${lineId}/${costCenterName}`, "مرکز هزینه - تخصیص متغیرها");

    else {
        var msg = alertify.warning("این مرکز هزینه غیرفعال است");
        msg.delay(admission.delay);
        return false;
    }
}

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "fm.CostCenter", `${viewData_baseUrl_FM}/CostCenterApi/getrecordbyid`, "id", "name", "isActive", "", get_NewPageTableV1);
}
$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});