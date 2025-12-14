var viewData_form_title = "تخصیص کاربر به کدینگ حسابداری";
var viewData_getpagetable_url = `${viewData_baseUrl_GN}/UserApi/getpage`,
    viewData_filter_url = `${viewData_baseUrl_GN}/UserApi/getfilteritems`,
    viewData_getrecord_url_item = `${viewData_baseUrl_GN}/UserApi/getrecordbyid`,
    item_id = 0;

$('#exportCSV').hide();
$('#stimul_preview').hide();
$('#readyforadd').hide();

pagetable_formkeyvalue = [1];

function run_button_accountSGLUser(id, rowNo, elm) {

    var check = controller_check_authorize("UserApi", "INS");
    if (!check)
        return;

    let userFullName = $(`#row${rowNo}`).data("fullname");

    navigation_item_click(`/FM/AccountSGLUserLine/${id}/${userFullName}`, "تخصیص کاربر به کدینگ حسابداری - تخصیص متغیرها");
}

get_NewPageTableV1();