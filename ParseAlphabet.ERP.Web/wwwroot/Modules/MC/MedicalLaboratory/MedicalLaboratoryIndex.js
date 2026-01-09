var viewData_form_title = "لیست آزمایشگاه",
    viewData_add_form_title = " نظام آزمایشگاه",
    viewData_display_form_title = "نمایش آزمایشگاه",
    viewData_edit_form_title = "آزمایشگاه - ویرایش",

    viewData_controllername = "MedicalLaboratoryApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_prescreptionType_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getprescriptiontypebyid`,

    viewData_display_page_url = "/MC/MedicalLaboratory/display",
    viewData_add_page_url_MedicalLaboratory_Get = "/MC/MedicalLaboratory/getform",
    viewData_get_MedicalLaboratoryType_url = `${viewData_baseUrl_MC}/${viewData_controllername}/gettype`,

    viewData_print_model = { url: "", item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "";


function initFrom() {


    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    $('#userType').bootstrapToggle();

    pagetable_formkeyvalue = ["mylab", 0];


    get_NewPageTableV1();
}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["mylab", 0];
    else
        pagetable_formkeyvalue = ["alllab", 0];

    get_NewPageTableV1();

});


function MedicalLaboratoryGetForm() {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_MedicalLaboratory_Get, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_MedicalLaboratory_Get, "");
}

function run_button_printMedicalLaboratory(medicalLaboratoryId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_print_model.value = medicalLaboratoryId;

    $.ajax({
        url: viewData_prescreptionType_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(medicalLaboratoryId),
        cache: false,
        success: function (result) {
        },
        error: function (xhr) {
        }
    });

}

function run_button_displayMedicalLaboratory(medicalLaboratoryId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var href = `${viewData_display_page_url}/${medicalLaboratoryId}`;
    navigateToModalDisplay(href, viewData_display_form_title);
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

function run_button_editMedicalLaboratory(medicalLaboratoryId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;


    var href = `${viewData_add_page_url_MedicalLaboratory_Get}/${medicalLaboratoryId}`;
    navigation_item_click(href, viewData_edit_form_title);

}


$(document).on("keydown", function (e) {
    if ([KeyCode.Insert].indexOf(e.which) == -1) return;


    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        MedicalLaboratoryGetForm();
    }

});

function modal_ready_for_add() {
    MedicalLaboratoryGetForm();
}
initFrom();

