var viewData_form_title = "صورت حساب فروش/ برگشت";


var viewData_controllername = "SalesPersonInvoiceApi";
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}PersonInvoice.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;

$("#invoiceDatePersian").inputmask();
kamaDatepicker('invoiceDatePersian', { withTime: false, position: "bottom" });


fill_dropdown("/api/SM/ReturnReasonApi/getdropdown", "id", "name", "returnReasonId", true);
fill_dropdown("/api/GN/CurrencyApi/getdropdown", "id", "name", "currencyId", true);
fill_dropdown("/api/GN/BranchApi/getactivedropdown", "id", "name", "branchId", true);

//$("#form_keyvalue").html('<option value="45">45 - فروش</option><option value ="46">46 - برگشت از فروش</option>');
//$("#form_keyvalue").addClass("form-control");
$(".relational-caption").addClass("displaynone");
$(".relationalbox").removeClass("displaynone");


$("#invoiceTypeId").on("change", function () {
    var item = $(this);
    if (item.val() == "45")
        $("#returnReason").addClass("displaynone");
    else
        $("#returnReason").removeClass("displaynone");
});

//$(document).ready(function () {
//    $("#form_keyvalue").trigger("change");
//});

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    csvModel = {
        Filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0]
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
        },
        error: function (xhr) {
            error_handler(xhr, viewData_csv_url)
        }
    });


});

function run_button_getpersoninvoice(p_keyvalue, rowNo, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    // pagetable_currentrow = p_currentrow;

    viewData_modal_title = "ویرایش " + viewData_form_title;
    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    //var getRow = $(`#row${rowNo}`);

    //var modelPersonInvoice = {
    //    Id: getRow.find(`#col_${rowNo}_1`).text(),
    //    InvoiceTypeId: +getRow.find(`#col_${rowNo}_2`).text(),
    //    BranchId: getRow.find(`#col_${rowNo}_3`).text()
    //};

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);

            $("#invoiceTypeId").prop("disabled", true);
            $("#branchId").prop("disabled", true);
            $("#officialInvoice").prop("disabled", true);

            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function modal_ready_for_add(modal_name = null) {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;
    $("#rowKeyId").addClass("d-none");
    modal_open_state = 'Add';

    if (modal_name == null)
        modal_name = `AddEditModal`

    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        ele.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    modal_clear_items();
    viewData_modal_title = "افزودن " + viewData_form_title;
    $("#modal_keyid_value").text("");
    $("#modal_keyid_caption").text("");
    modal_show(modal_name);

    $("#invoiceTypeId").val($("#invoiceTypeId option:first").val());
    $("#currencyId").val($("#currencyId option:first").val());
    $("#branchId").val($("#branchId option:first").val());
    $("#returnReasonId").val($("#returnReasonId option:first").val());

    $("#invoiceTypeId").val(0).trigger("change");
    $("#invoiceTypeId").prop("disabled", false);
    $("#branchId").prop("disabled", false);
    $("#officialInvoice").prop("disabled", false);

}

function run_button_deletePersonInvoice(p_keyvalue, rowNo) {
    var getRow = $(`#row${rowNo}`);
    var modelInvoice = {
        id: getRow.find(`#col_${rowNo}_1`).text(),
       // invoiceTypeId: +getRow.find(`#col_${rowNo}_2`).text(),
       // branchId: getRow.find(`#col_${rowNo}_3`).text()
    };
    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(modelInvoice),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {
                        get_NewPageTableV1();

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {
                        var msg = alertify.error(result.statusMessage);
                        msg.delay(alertify_delay);
                    }
                },
                error: function (xhr) {

                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function run_button_InvoiceDetail(lineId, rowNo) {    
    navigation_item_click(`/SM/SalesPersonInvoiceLine/${lineId}/${$(`#row${rowNo} #col_${rowNo}_5`).text()}`, "ثبت سفارش");
}
