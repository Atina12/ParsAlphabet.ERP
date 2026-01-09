var viewData_form_title = "لیست دریافت/پرداخت صندوق",
    viewData_display_form_title = "نمایش دریافت/پرداخت صندوق",
    viewData_add_page_url = "/MC/AdmissionCash/form",
    viewData_controllername = "AdmissionCashApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    rowNumberAdmission = 0;

function initAdmissionCashIndex() {

    pagetable_formkeyvalue = ["mycash", 0];

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    get_NewPageTableV1();
}

function run_button_editAdmissionCash(id, row, elm) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;


    var checkCounterResult = checkCounter()
    if (!checkCounterResult.successfull) {
        var msg = alertify.warning(checkCounterResult.statusMessage);
        msg.delay(admission.delay);
        return;
    }


    let currentElm = $(elm).parents(`#row${row}`)
    let admissionMasterId = currentElm.data("admissionmasterid")


    viewData_opencash = `${viewData_baseUrl_MC}/AdmissionApi/opencash`

    var resultOpenCash = checkOpenCash(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق ویرایش دریافت/پرداخت صندوق امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }


    var checkvalidation = checkValidation(admissionMasterId);
    if (checkvalidation) {
        var msg = alertify.warning("امکان ویرایش  ندارید");
        msg.delay(admission.delay);
        return;
    }

    var viewData_edit_cashline_form_title = "دریافت/پرداخت صندوق";
    var href = `/MC/AdmissionCash/updatecash/${id}`;
    navigation_item_click(href, viewData_edit_cashline_form_title);
}


function run_button_print(cashId, rowNo) {

    let row = $(`#row${rowNo}`)
    let admissionId = row.data("admissionid")
    let medicalrevenue = row.data("medicalrevenue");
    let workflowId = row.data("admissionworkflowid");
    let stageId = row.data("admissionstageid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    configPrint(admissionTypeId, admissionId, medicalrevenue, cashId);
}

function configPrint(admissionTypeId, admissionId, medicalrevenue, cashId) {

    rowNumberAdmission = admissionId;

    if (medicalrevenue == 2) {
        if (admissionTypeId !== 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmissionSale .card-body .PrnModalDiv:last").addClass("d-none");
    }
    else {

        if (admissionTypeId !== 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");
        else
            $("#PrnAdmissionSale .card-body .PrnModalDiv:last").removeClass("d-none");
    }

    if (admissionTypeId === 2 || admissionTypeId === 3 || admissionTypeId == 4) {//Admission
        if (medicalrevenue == 1) {
            $("#PrnAdmission #modal_keyid_value").text(cashId)
            modal_show("PrnAdmission");
        }
        else
            contentPrintAdmission(admissionId);

    }
    else {
        if (medicalrevenue === 2) {
            $("#PrnAdmissionSale #modal_keyid_value").text(cashId)
            modal_show("PrnAdmissionSale");
        }
        else
            contentPrintAdmissionSale(admissionId);
    }
}

function cashstandprint() {

    let row = $(`#parentPageTableBody .highlight`);
    let medicalrevenue = $(row).data("medicalrevenue");
    let admissionmasterid = row.data("admissionmasterid");
    standprint(admissionmasterid, medicalrevenue)

    modal_close('PrnAdmissionSale')
    modal_close('PrnAdmission')
}

function separationprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    contentPrintAdmission(admissionId);

    modal_close('PrnAdmission')
}

function aggregationprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#parentPageTableBody .highlight`)
    let medicalrevenue = row.data("medicalrevenue");

    if (medicalrevenue === 1)
        contentPrintAdmissionCompress(admissionId);
    else
        contentPrintAdmission(admissionId);

    //modal_close('PrnAdmission');
}

function doubleprint() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#parentPageTableBody .highlight`);
    let admissionId = rowNumberAdmission;
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let medicalrevenue = row.data("medicalrevenue");
    let element = $("#bcTarget")

    if (medicalrevenue == 1) {
        let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
        contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);
    }
    else {
        contentPrintAdmission(admissionId);
    }
}

function saleseparationprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    contentPrintAdmissionSale(admissionId);

    modal_close('PrnAdmissionSale');
}

function run_button_displayAdmissionCash(id, rowNo) {

    var admissionMasterId = +$(`#row${rowNo}`).data("admissionmasterid");
    var check = controller_check_authorize(viewData_controllername, "VIW");

    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId);
}

function addCashForm() {

    var check = controller_check_authorize("AdmissionCashApi", "INS");
    if (!check)
        return;

    var checkCounterResult = checkCounter()
    if (!checkCounterResult.successfull) {
        var msg = alertify.warning(checkCounterResult.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    var viewData_add_form_title = "دریافت/پرداخت صندوق";

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url, "");
}

initAdmissionCashIndex()

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check) {
        $("#userType").prop('disabled', false);
    }
    else {
        $("#userType").prop('disabled', true);
        return;
    }

    arr_pagetables[0].currentpage = 1;
    arr_pagetables[0].pageNo = 0;


    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["mycash", 0];
    else
        pagetable_formkeyvalue = ["allcash", 0];
    get_NewPageTableV1();

});

$(`#parentPageTableBody`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4, KeyCode.Insert].indexOf(e.which) == -1)
        return;


    let row = $("#parentPageTableBody tr.highlight")
    let admissionId = row.data("admissionid")
    let medicalrevenue = row.data("medicalrevenue");
    let workflowId = row.data("workflowid");
    let admissionstageid = row.data("admissionstageid");

    let workflowStage = getAdmissionTypeId(admissionstageid, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    rowNumberAdmission = admissionId

    if (admissionTypeId === 2 || admissionTypeId == 3 || admissionTypeId == 4) {
        if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
            e.preventDefault();
            printShortcut(1);
        }
        else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
            e.preventDefault();
            printShortcut(2);
        }
        else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
            e.preventDefault();
            printShortcut(3);
        }
        else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
            e.preventDefault();
            printShortcut(4);
        }
    }
    else {
        if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
            e.preventDefault();
            printShortcut(0, true);
        }
        else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
            e.preventDefault();
            printShortcut(4, true);
        }
    }
    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        addForm();
    }
});

function printShortcut(type, admissionSale = false) {
    if (!admissionSale) {
        if (type === 1) separationprint();
        else if (type === 2) aggregationprint();
        else if (type === 3) doubleprint();
        else if (type === 4) cashstandprint();
    }
    else {
        if (type == 4)
            cashstandprint();
        else
            saleseparationprint();
    }
}
