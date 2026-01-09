var viewData_form_title = "‌نوع قرارداد";

var viewData_controllername = "EmployeeContractTypeApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;
var viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}EmployeeContractType.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";

$('#AddEditModal').on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});
get_NewPageTableV1();

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});