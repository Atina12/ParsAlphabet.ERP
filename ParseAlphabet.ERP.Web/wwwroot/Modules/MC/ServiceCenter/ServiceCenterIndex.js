var viewData_form_title = "بخش خدمت";
var viewData_controllername = "ServiceCenterApi";
var viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}ServiceCenter.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

function initForm() {

    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "departmentId", true);

    get_NewPageTableV1();

}

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Add") {
        $("#isActive").prop("checked", "checked");
        funkyradio_onchange($("#isActive"));
    }

});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") 
        $("#departmentId").attr("disabled", true)
    else
        $("#departmentId").removeAttr("disabled")
})

initForm()
