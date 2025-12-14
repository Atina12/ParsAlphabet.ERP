var viewData_form_title = "قرارداد پرسنل";
var viewData_controllername = "EmployeeContractApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}EmployeeContract.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;

function initContractIndex() {
    kamaDatepicker('startDatePersian');
    kamaDatepicker('expDatePersian');
    $("#startDatePersian").inputmask();
    $("#expDatePersian").inputmask();
    $(".select2").select2();
    $(".relational-caption").text("پرسنل");
    $("#relationalBox").removeClass("displaynone");

    pagetable_formkeyvalue = +$("#form_keyvalue").val();
    get_NewPageTableV1();
    loadDropDown()
}

function loadDropDown() {
    fill_dropdown(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "id", "name", "employeeId", true);
    fill_dropdown(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "id", "name", "serviceId", true);
    fill_dropdown(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "id", "name", "form_keyvalue", true);
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

initContractIndex()