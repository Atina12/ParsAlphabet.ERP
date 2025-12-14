var viewData_form_title = "پرسنل";


var viewData_controllername = "EmployeeApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}Employee.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;

get_NewPageTableV1();

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "hr.Employee", `${viewData_baseUrl_HR}/EmployeeApi/getrecordbyid`, "id", "fullNameEm","isActiveEm", "", get_NewPageTableV1);
}