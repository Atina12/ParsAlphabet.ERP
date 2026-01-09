
var viewData_form_title = "لیست طرح درمان",
    viewData_controllername = "AdmissionMasterApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_opencash = `${viewData_baseUrl_MC}/AdmissionApi/opencash`,
    rowNumberAdmissionMaster = 0;


function initAdmissionMaster() {

    $('#userType').bootstrapToggle();

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    pagetable_formkeyvalue = ["myadm", 0];
    get_NewPageTableV1();

}

function admissionMasterForm() {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var check1 = checkCounter()
    if (!check1.successfull) {
        var msg = alertify.warning(check1.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    navigation_item_click("/MC/AdmissionMaster/form", "طرح درمان");
}

function run_button_editMaster(admissionMasterId, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var resultOpenCash = checkOpenCash(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق  پذیرش امکان ویرایش نمی باشد").delay(admission.delay);
        return;
    }

    var check1 = checkCounter()
    if (!check1.successfull) {
        var msg = alertify.warning(check1.statusMessage);
        msg.delay(admission.delay);
        return;
    }


    let actionId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("actionid");
    let stageId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("stageid");
    let workflowId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("workflowid");


    //let workflowStage = getAdmissionTypeId(stageId, workflowId)
    //let admissionTypeId = workflowStage.admissionTypeId
    //if (admissionTypeId == 1 || admissionTypeId == 2) {
    //    var msgEdit = alertify.warning("امکان ویرایش پرونده وجود ندارد");
    //    msgEdit.delay(admission.delay);
    //    return;
    //}


    let stageAction = getStageAction(workflowId, stageId, actionId, 0);
    if (stageAction.isDataEntry != 1 || stageAction.medicalRevenue != 1) {
        var msgUpdate = alertify.warning("امکان ویرایش پرونده وجود ندارد");
        msgUpdate.delay(admission.delay);
        return;
    }

    navigation_item_click(`/MC/AdmissionMaster/form/${admissionMasterId}`, "طرح درمان - ویرایش");

}

function switchPrint(e) {
    //if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
    //    e.preventDefault();
    //    printShortcut(1);
    //}
    //else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
    //    e.preventDefault();
    //    printShortcut(2);
    //}
    //else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
    //    e.preventDefault();
    //    printShortcut(3);
    //}
    //else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
    //    e.preventDefault();
    //    printShortcut(4);
    //}
    //else

    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        admissionMasterForm();
    }
}

function run_button_display(admissionMasterId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)
}

async function run_button_admissionActionList(admissionMasterId, row, elm) {

    let actionId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("actionid")
    let stageId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("stageid")
    let branchId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("branchid")
    let workflowId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("workflowid")


    stageActionLogCurrentMaster = {
        actionId,
        stageId,
        branchId,
        workflowId,
        admissionMasterId,
    }

    actionLogAdmissionMaster();

    modal_show("actionLogModalAdmissionMaster");

}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];

    get_NewPageTableV1();

});

$("#pagetable").on("keydown", function (e) {

    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4, KeyCode.Insert].indexOf(e.which) == -1)
        return;

    switchPrint(e)

});

initAdmissionMaster()