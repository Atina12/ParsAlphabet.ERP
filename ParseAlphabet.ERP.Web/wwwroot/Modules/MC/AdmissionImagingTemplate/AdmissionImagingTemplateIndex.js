var viewData_form_title = "لیست قالب تصویربرداری",
    viewData_add_form_title = "قالب تصویربرداری",
    viewData_controllername = "AdmissionImagingTemplateApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_add_page_url_AdmissionImagingForm = "/MC/AdmissionImagingTemplate/form";
get_NewPageTableV1();

function modal_ready_for_add() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_AdmissionImagingForm, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_AdmissionImagingForm, "");
}

function run_button_edit(id) {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(`${viewData_add_page_url_AdmissionImagingForm}/${id}`, viewData_add_form_title);
    else
        navigation_item_click(`${viewData_add_page_url_AdmissionImagingForm}/${id}`, "");
}

