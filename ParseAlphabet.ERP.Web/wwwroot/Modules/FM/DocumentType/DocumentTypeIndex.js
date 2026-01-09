var viewData_form_title = "انواع سند",
    viewData_controllername = "DocumentTypeApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}DocumentType.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "";

fill_select2(`/api/WFApi/WorkflowCategory_getdropdown`, "workflowCategoryId", true);

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

get_NewPageTableV1();