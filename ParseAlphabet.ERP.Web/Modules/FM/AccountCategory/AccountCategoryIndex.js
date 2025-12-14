var viewData_form_title = "گروه حساب",
    viewData_controllername = "AccountCategoryApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}AccountCategory.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "fm.AccountCategory",
    isSecondLang = true;

fill_dropdown("/api/FMApi/incomebalancetype_getdropdown", "id", "name", "incomeBalanceId");


function stimul_previewNew() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportParameters = []

    stimul_report(reportParameters);

}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

get_NewPageTableV1();
