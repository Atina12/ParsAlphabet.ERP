var viewData_form_title = "گروه اشخاص";
var viewData_controllername = "ContactGroupApi";
var viewData_getrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.CR.Prn}PersonGroup.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_CR}/${viewData_controllername}/csv`;



function initContactGroupIndex() {
    $("#stimul_preview")[0].onclick = null;
    pagetable_formkeyvalue = [4];
    get_NewPageTableV1();
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 4, SqlDbType: dbtype.TinyInt, Size: 0 },

        { Item: "PersonType", Value: 4, itemType: "Var" },
        { Item: "ReportTitle", Value: "لیست گروه اشخاص", itemType: "Var" }
    ]

    stimul_report(reportParameters);
});

initContactGroupIndex()