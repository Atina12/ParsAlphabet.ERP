var viewData_form_title = "مشتری";


var viewData_controllername = "CustomerApi";
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
var viewData_check_nationalCode_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getnationalcode`;

var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}Customer.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;


get_NewPageTableV1();

function customerInit() {
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
}

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "sm.Customer", `${viewData_baseUrl_SM}/CustomerApi/getrecordbyid`, "id", "fullNameCu","isActiveCu", "", get_NewPageTable);
}