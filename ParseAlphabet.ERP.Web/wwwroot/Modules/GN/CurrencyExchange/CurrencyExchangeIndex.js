var viewData_form_title = "نرخ تسعیر ارز";
var viewData_controllername = "CurrencyExchangeApi";
var viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}CurrencyExchange.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`;

$("#exportCSV").remove()

get_NewPageTableV1();

fill_dropdown(`${viewData_baseUrl_GN}/CurrencyExchangeApi/getdropdown`, "id", "name", "currencyId");

$("#updateDatePersian").inputmask();

kamaDatepicker('updateDatePersian', { withTime: false, position: "bottom" });

function modal_save(modal_name = null, pageVersion = "pagetable") {
    pageVersion = "pagetable"
    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);
}