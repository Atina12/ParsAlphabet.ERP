var viewData_form_title = "گروه سهامداران";


var viewData_controllername = "ShareHolderGroupApi";
var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.CR.Prn}PersonGroup.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;

pagetable_formkeyvalue = [5];

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

get_NewPageTableV1();

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    p_id = ""
    p_value = ""
    p_type = ""
    p_size = ""

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 5, SqlDbType: dbtype.TinyInt, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "PersonType", Value: 5, itemType: "Var" },
        { Item: "ReportTitle", Value: "لیست گروه سهامداران", itemType: "Var" }
    ]

    stimul_report(reportParameters);
});