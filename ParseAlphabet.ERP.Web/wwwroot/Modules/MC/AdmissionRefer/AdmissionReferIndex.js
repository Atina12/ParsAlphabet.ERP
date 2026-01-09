var viewData_form_title = "لیست نظام ارجاع",
    viewData_add_form_title = " نظام ارجاع",
    viewData_display_form_title = "نمایش ارجاع",
    viewData_edit_form_title = "ارجاع - ویرایش",

    viewData_controllername = "AdmissionReferApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_prescreptionType_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getprescriptiontypebyid`,
    viewData_display_page_url = "/MC/AdmissionItem/display",

    viewData_display_page_url = "/MC/AdmissionRefer/display",
    viewData_add_page_url_AdmissionRefer_Send = "/MC/AdmissionRefer/sendform",
    viewData_add_page_url_AdmissionRefer_Get = "/MC/AdmissionRefer/getform",
    viewData_add_page_url_AdmissionRefer_SendDisplay = "/MC/AdmissionRefer/displaysendrefer",
    viewData_add_page_url_AdmissionRefer_GetDisplay = "/MC/AdmissionRefer/displaygetrefer",
    viewData_get_referType_url = `${viewData_baseUrl_MC}/${viewData_controllername}/gettype`,

    viewData_print_model = { url: "", item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;


function initForm() {


    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    $("#userType").bootstrapToggle();
    pagetable_formkeyvalue = ["myRefer", 0];
    get_NewPageTableV1();

}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myRefer", 0];
    else
        pagetable_formkeyvalue = ["allRefer", 0];

    get_NewPageTableV1();

});


function AdmissionReferSendForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_AdmissionRefer_Send, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_AdmissionRefer_Send, "");
}

function AdmissionReferGetForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_AdmissionRefer_Get, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_AdmissionRefer_Get, "");
}

function run_button_printrefer(AdmissionReferId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_print_model.value = AdmissionReferId;

    $.ajax({
        url: viewData_prescreptionType_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(AdmissionReferId),
        cache: false,
        success: function (result) {
        },
        error: function (xhr) {
        }
    });

}

function run_button_displayrefer(AdmissionReferId, rowNo, btn) {
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;
   
    var typeRefer = getReferType(AdmissionReferId);  
    showAdmssionRefer(typeRefer, AdmissionReferId);
}

function run_button_editrefer(AdmissionReferId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var typeRefer = getReferType(AdmissionReferId);

    if (typeRefer == 3) {
        var href = `${viewData_add_page_url_AdmissionRefer_Send}/${AdmissionReferId}`;
        navigation_item_click(href, viewData_edit_form_title);
    }
    else if (typeRefer == 1) {
        var href = `${viewData_add_page_url_AdmissionRefer_Get}/${AdmissionReferId}`;
        navigation_item_click(href, viewData_edit_form_title);
    }
}

function getReferType(AdmissionReferId) {
    var output = $.ajax({
        url: viewData_get_referType_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(AdmissionReferId),
        cache: false,
        async: false,
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_referType_url);
            return 0;
        }
    });
    return output.responseJSON;
}

function showAdmssionRefer(type, AdmissionReferId) {
    if (type == 3) {
        var href = `${viewData_add_page_url_AdmissionRefer_SendDisplay}/${AdmissionReferId}`;
        navigateToModalDisplay(href, viewData_display_form_title);
    }
    else if (type == 1) {
        var href = `${viewData_add_page_url_AdmissionRefer_GetDisplay}/${AdmissionReferId}`;
        navigateToModalDisplay(href, viewData_display_form_title);
    }
}

function navigateToModalDisplay(href) {

    initialPage();
    $("#contentdisplayForm #content-page").addClass("displaynone");
    $("#contentdisplayForm #loader").removeClass("displaynone");
    lastpagetable_formkeyvalue = pagetable_formkeyvalue;
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayForm`).html(result);
            modal_show("displayFormModel");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayForm #loader,#contentdisplayForm #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayForm #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayForm #form,#contentdisplayForm .content").css("margin", 0);
    $("#contentdisplayForm .itemLink").css("pointer-events", " none");
}
initForm();