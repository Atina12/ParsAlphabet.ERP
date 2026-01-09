var viewData_form_title = "نوع خدمت",
    viewData_controllername = "ServiceTypeApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_get_ServiceType = `api/AdmissionsApi/getthrservicetypedropdown`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}ServiceType.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

get_NewPageTableV1();

fill_select2(viewData_get_ServiceType, "terminologyId", true, 0, false);
fill_select2(`${viewData_baseUrl_FM}/CostCenterApi/getdropdown`, "costCenterId", true, "1", false, 0, 'انتخاب کنید', undefined, "", true);

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});
