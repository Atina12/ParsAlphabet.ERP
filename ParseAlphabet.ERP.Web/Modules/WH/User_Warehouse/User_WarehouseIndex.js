var viewData_form_title = "تخصیص کاربران به انبار";
var viewData_controllername_item_warehouse = "User_WarehouseApi";

var viewData_getpagetable_url = `${viewData_baseUrl_WH}/WarehouseApi/getpage`,
    viewData_filter_url = `${viewData_baseUrl_WH}/WarehouseApi/getfilteritems`,
    viewData_getrecord_url_item = `${viewData_baseUrl_WH}/WarehouseApi/getrecordbyid`,
    item_id = 0;

$('#exportCSV').hide();
$('#stimul_preview').hide();
$('#readyforadd').hide();

pagetable_formkeyvalue = [2];
var pgt_warehouse = {
    pagetable_id: "user_warehouse_pagetable",
    editable: true,
    pagerowscount: 15,
    currentpage: 1,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: viewData_getpagetable_url,
    getfilter_url: viewData_filter_url
}
arr_pagetables.push(pgt_warehouse);

function run_button_userwarehouse(warehouseId, rowNo) {

    var check = controller_check_authorize(viewData_controllername_item_warehouse, "INS");
    if (!check)
        return;

    let warehouseName = $(`#row${rowNo}`).data("name");
    navigation_item_click(`/WH/User_WarehouseLine/${warehouseId}/${warehouseName}`, "تخصیص کاربران به انبار - تخصیص متغیرها");
}

function run_button_accountDetail(warehouseId, rowNo, elm) {
    
    let viewData_getrecord_url = `${viewData_baseUrl_WH}/WarehouseApi/getrecordbyid`;
    addAccountDetail(warehouseId, "wh.Warehouse", viewData_getrecord_url, "id", "name", "isActive", "", get_NewPageTableV1);
}


get_NewPageTableV1();