var viewData_form_title = "بخش های سازمان";
var viewData_controllername = "OrganizationalDepartmentApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;

var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;
var viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}OrganizationalDepartment.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";


function initOrganizationDepartment() {
    $("#stimul_preview")[0].onclick = null;
    get_NewPageTableV1();
}

$('#AddEditModal').on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

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

initOrganizationDepartment()
