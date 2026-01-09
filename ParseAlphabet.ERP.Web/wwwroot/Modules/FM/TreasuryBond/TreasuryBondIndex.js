var viewData_form_title = "چک";
var viewData_controllername = "TreasuryBondApi";
var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}TreasuryBond.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;
var bankCategoryId = 1;

pagetable_formkeyvalue = [0];

get_NewPageTableV1();

fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown_bankCategoryId`, "bankAccountId", true, 1, false);

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") {
        $("#bankAccountId").prop("disabled", true);
        $("#bankAccountId").prop("disabled", true);
        $("#bankAccountId").prop("required", false);
    }
    else {
        $("#bankAccountId").val(0).trigger("change");
        $("#bankAccountId").prop("disabled", false);
        $("#bankAccountId").prop("disabled", false);
        $("#bankAccountId").prop("required", true);
    }
})

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    csvModel = {
        Filters: arrSearchFilter[index].filters,
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


