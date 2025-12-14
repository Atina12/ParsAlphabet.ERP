var viewData_controllername = "VendorApi";
var viewData_form_title = "تخصیص کالا به تامین کنندگان";
var viewData_getpagetable_url = `${viewData_baseUrl_PU}/VendorApi/vendoritemcommission`
var viewData_csv_url = `${viewData_baseUrl_PU}/VendorApi/csv`;


function initVendorItemPrice() {

    
    $('#stimul_preview').hide();
    $('#readyforadd').hide();

    //appendBtn()

    get_NewPageTableV1();
}

function run_button_vendorItemPrice(vendorId, row, elm, event) {

    var check = controller_check_authorize("VendorItemsApi", "INS");
    if (!check)
        return;

    let vendorFullName = $(`#row${row}`).data("vendorfullname");

    navigation_item_click(`/MC/VendorItemPriceLine/${vendorId}/${vendorFullName}`, "تخصیص حق الزحمهتامین کنندگان درمان");
}

function run_button_vendorItemList(vendorId, row, elm, event) {

    modal_vendor_info("vendorItemListModal", vendorId)
    vendorItemList_init(vendorId);


    let rowElm = $(`#pagetable tr#row${row}`)
    let nationalCode = rowElm.data("nationalcode")
    let patientfullName = rowElm.data("vendorfullname")

    printInfo = { patientfullName, nationalCode, vendorId }

    modal_show("vendorItemListModal");
}

function export_csv(elemId = undefined, value = undefined) {
    var check = controller_check_authorize("VendorItemsApi", "PRN");
    if (!check)
        return;

    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
        
        var csvModel = {
            filters: arrSearchFilter[index].filters,
            Form_KeyValue: [1]
        }

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
}

$("#vendorItemListModal").on("hidden.bs.modal", function () {
    printInfo = {}
})


initVendorItemPrice()
