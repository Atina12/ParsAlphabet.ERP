var viewData_form_title = "سفارش / برگشت",
    viewData_controllername = "SalesPersonOrderApi",
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/SalesPersonOrderApi`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`,
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`,
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}Customer.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`,
    stageFormPlate = "3/0/2/1";

//$(document).ready(function () {
//    $("#form_keyvalue").trigger("change");
//});

//$("#form_keyvalue").html("");
//fill_select2("/api/WF/StageApi/getdropdown", "form_keyvalue", true, stageFormPlate);
//$("#form_keyvalue").val($("#form_keyvalue").prop("selectedIndex", 0).val());

fill_select2("/api/WF/StageApi/getdropdown", "stageId", true, stageFormPlate);
fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
fill_select2("/api/GN/CurrencyApi/getdropdown", "currencyId", true);
fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true);

$("#orderDatePersian").inputmask();
kamaDatepicker('orderDatePersian', { withTime: false, position: "bottom" });

$(".relational-caption").text("نوع");
$(".relationalbox").removeClass("displaynone");

$("#readyforadd")[0].onclick = null;

$("#readyforadd").click(function () {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#rowKeyId").addClass("d-none");
    modal_open_state = 'Add';

    var modalName = `AddEditModal`

    $(`#${modalName} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        ele.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        });
    });


    $(`#${modalName} div [hidden-on-edit=true]`).each(function () {
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

    $("#stageId").val(0).trigger('change.select2');

    $("#branchId").prop("disabled", false);
    $("#stageId").prop("disabled", false);
    $("#currencyId").prop("disabled", false);

    if (modal_open_state == 'Add') {
        $("#stageId").prop("disabled", false);
        $("#officialInvoice").prop("disabled", false);
    }
    else if (modal_open_state == 'Edit') {
        $("#stageId").prop("disabled", true);
        $("#officialInvoice").prop("disabled", true);
    }

    if (+$("#stageId").val() === 3)
        $("#returnReason").addClass("displaynone");
    else 
        $("#returnReason").removeClass("displaynone");

    modal_show(modalName);
});

$("#AddEditModal").on("show.bs.modal", function () {
    if (+$("#stageId").val() === 3 )
        $("#returnReasonId").val("").trigger("change");
    else if (+$("#stageId").val() === 4)
        $("#returnReasonId").val(1).trigger("change");
});


$("#stageId").on("change", function () {
    var item = $(this);
    if (item.val() == "3") {
        $("#returnReason").addClass("displaynone");
        $("#returnReasonId").val("").trigger("change");
    }
    else {
        $("#returnReason").removeClass("displaynone");
        $("#returnReasonId").val(1).trigger("change");
    }
})

function run_button_editOrder(p_keyvalue, rowno, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");

    if (modal_name == null)
        modal_name = modal_default_name;

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

    $("#branchId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#currencyId").prop("disabled", true);
    $("#officialInvoice").prop("disabled", true);

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

    $("#stageId").val($("#stageId option:first").val());
    $("#currencyId").val($("#currencyId option:first").val());
    $("#branchId").val($("#branchId option:first").val());
    $("#returnReasonId").val($("#returnReasonId option:first").val());

    $("#stageId").removeAttr("disabled");
    $("#branchId").removeAttr("disabled");

}

function run_button_OrderDetail(lineId, rowNo) {
    navigation_item_click(`/SM/SalesPersonOrderLine/${lineId}/${$(`#row${rowNo} #col_${rowNo}_2`).text()}/${$(`#row${rowNo} #col_${rowNo}_5`).text()}`, "ثبت سفارش");
}