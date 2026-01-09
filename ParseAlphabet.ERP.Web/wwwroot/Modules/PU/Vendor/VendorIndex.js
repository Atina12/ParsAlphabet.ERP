var viewData_form_title = "تامین کننده";
var viewData_controllername = "VendorApi";
var viewData_getrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.PU.Prn}Vendor.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`;
var formVendor_Item = $('#vendor_item_pagetable').parsley();
var vendorItemsId = 0;
var id = +$("#id").val();


get_NewPageTableV1();

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "gn.Branch", `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyid`, "id", "fullNameVe", "isActiveVe", "", get_NewPageTableV1);
}
