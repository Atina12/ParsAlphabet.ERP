var viewData_form_title = "سهامدار";

var viewData_controllername = "ShareHolderApi";
var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}ShareHolder.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;
var formShareHolder_Item = $('#shareHolder_item_pagetable').parsley();
var ShareHolderItemsId = 0;
var id = +$("#id").val();
get_NewPageTableV1();

var run_button_accountDetail = (id, rowNo, elm) => addAccountDetail(id, "fm.ShareHolder", `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`, "id", "fullNameSh", "isActiveSh", "", get_NewPageTableV1);
