var viewData_form_title = "حساب‌های بانکی";
var viewData_controllername = "BankAccountApi";
var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}BankAccount.mrt`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;
var viewData_print_tableName = "";

$("#shebaNo").inputmask();

pagetable_formkeyvalue = [0];

get_NewPageTableV1();

fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "bankId", true, 0, false);
fill_dropdown("/api/FMApi/bankaccountcategory_getdropdown", "id", "name", "bankAccountCategoryId", true, 0);
fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryId", true);
fill_select2("/api/GN/LocStateApi/getdropdown", "locStateId", true);

$("#locStateId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityId").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityId", true, +$(this).val());
    }

    if (($('#locStateId :selected').length == 0) || ($('#locStateId :selected').val() == 0)) {
        $('#locCityId').attr('disabled', 'disabled');
        $("#locCityId").val('0').trigger('change');
    }
    else {
        $('#locCityId').removeAttr('disabled');
    }
});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") {
        $("#bankId").prop("disabled", true);
        $("#bankId").prop("disabled", true);
        $("#bankId").prop("required", false);
    }
    else {
        $("#bankId").val(0).trigger("change");
        $("#bankId").prop("disabled", false);
        $("#bankId").prop("disabled", false);
        $("#bankId").prop("required", true);
    }
})

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    csvModel = {
        filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0]
    }

    $.ajax({
        url: viewData_csv_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(csvModel),
        cache: false,
        success: function (result) {
            generateCsv(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_csv_url)
        }
    });


});

//--------------
$("#searchlocStateId").on('click', function () {
    getvalueSearch("/api/GN/LocStateApi/getdropdown", "/api/GN/LocStateApi/search", null, "locStateId");
});

$(".filterSearchInput").on("keydown", function (e) {
    if (e.shiftKey && e.ctrlKey && e.keyCode === KeyCode.key_f) {
        getvalueSearch("/api/GN/LocStateApi/getdropdown", "/api/GN/LocStateApi/search", null, "locStateId");
    }
});

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "fm.BankAccount", `${viewData_baseUrl_FM}/BankAccountApi/getrecordbyid`, "id", "name", "isActive", "", get_NewPageTableV1);
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

