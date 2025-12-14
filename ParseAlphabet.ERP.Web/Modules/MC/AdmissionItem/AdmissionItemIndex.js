var viewData_form_title = "لیست سفارش کالا",
    viewData_add_form_title = "سفارش کالا",
    viewData_display_form_title = "نمایش سفارش کالا",
    viewData_edit_cashline_form_title = "سفارش کالا - ویرایش وجوه",

    viewData_controllername = "AdmissionItemApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_display_page_url = `${viewData_baseUrl_MC}/${viewData_controllername}/display`,
    viewData_opencash = `${viewData_baseUrl_MC}/${viewData_controllername}/opencash`,
    rowNumberAdmission = 0,
    selectedRowId = 0,
    activePageTableId = "pagetable";

function initAdmissionItem() {


    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $("#userType").bootstrapToggle();

    pagetable_formkeyvalue = ["myadm", 0];
    get_NewPageTableV1();
}

function run_button_editAdmItem(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    selectedRowId = `row${rowno}`;
    var stageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var actionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var workflowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var admissionMasterId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("admissionmasterid"); 


    let stageAction = getStageAction(workflowId, stageId, actionId, 0);
    if (stageAction.isDataEntry != 1 || stageAction.medicalRevenue != 1) {
        var msgUpdate = alertify.warning("امکان ویرایش کالا وجود ندارد");
        msgUpdate.delay(admission.delay);
        return;
    }

    let checkCounterResult = checkCounter()
    if (!checkCounterResult.successfull) {
        var msg = alertify.warning(checkCounterResult.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    let resultOpenCash = checkOpenCash(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق ویرایش کالا امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }

    let viewData_add_page_url = "/MC/AdmissionItem/form"
    var href = `${viewData_add_page_url}/${id}`;
    navigation_item_click(href, viewData_edit_cashline_form_title);
}

function checkAdmissionItemUpdate(id) {

    let viewData_check_update_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdate`

    var output = $.ajax({
        url: viewData_check_update_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_update_url);
            return 0;
        }
    });

    return output.responseJSON;
}

function admissionItemForm() {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var checkCounterResult = checkCounter()
    if (!checkCounterResult.successfull) {
        var msg = alertify.warning(checkCounterResult.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    let viewData_add_page_url_admissionItemForm = "/MC/AdmissionItem/form"

    navigation_item_click(viewData_add_page_url_admissionItemForm, viewData_add_form_title);

}

function run_button_print(rowNumber) {
    
    $("#modal_keyid_value").text(rowNumber);
    rowNumberAdmission = rowNumber;

    let row = $(`#parentPageTableBody .highlight`);
    let medicalrevenue = $(row).data("medicalrevenue");

    if (medicalrevenue != 1)
        $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
    else
        $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");

    if (medicalrevenue == 2)
        contentPrintAdmissionSale(rowNumber);
    //contentPrintAdmission(rowNumber)
    else
        modal_show(`PrnAdmission`)
}

function switchPrnAdmissionSale(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        separationprintSale();
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        admissionitemstandprint();
    }
    //else if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
    //    e.preventDefault();
    //    admissionItemForm();
    //}
}

function modal_ready_for_add() {
    admissionItemForm();
}

function separationprintSale() {
    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    contentPrintAdmissionSale(admissionId);

    modal_close('PrnAdmission')
}

function admissionitemstandprint() {

    let row = $("#parentPageTableBody .highlight");

    let medicalrevenue = $(row).data("medicalrevenue");
    let admissionmasterid = row.data("admissionmasterid");
    standprint(admissionmasterid, medicalrevenue);
    modal_close('PrnAdmission')
}

function run_button_display(id, rowNo) {
    var admissionMasterId = +$(`#row${rowNo}`).data("admissionmasterid");
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)
}

async function run_button_showStepLogsAdmissionItem(id, rowno) {
    
    selectedRowId = `row${rowno}`;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentbranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentIdentityId = id;
    var currentworkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    let admissionMasterworkflowCategoryId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("admissionmasterworkflowcategoryid");
    let admissionMasterId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("admissionmasterid");
  
    let requestAmount = await getAdmissionAmount(id);
   
    stageActionLogCurrent = {
        identityId: currentIdentityId,
        admissionMasterId,
        stageId: currentStageId,
        branchId: currentbranchId,
        actionId: currentActionId,
        workFlowId: currentworkFlowId,
        parentworkflowcategoryid: workflowCategoryIds.medicalCare.id,
        requestAmount,
        admissionMasterworkflowCategoryId
    }

    $("#actionTr").empty();

    fill_select2(`/api/WF/StageActionApi/getdropdownactionlistbystage`, "actionTr", true,
        `${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workFlowId}/1/0/null/${stageActionLogCurrent.admissionMasterworkflowCategoryId}/true/null`, false, 3, "انتخاب");

    $("#actionTr").val(currentActionId).trigger("change.select2");

    actionLogAdmissionItem(id, currentStageId, currentworkFlowId);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("actionLogModalAdmissionItem");
}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    arr_pagetables[0].currentpage = 1;
    arr_pagetables[0].pageNo = 0;

    pagetable_formkeyvalue = $(this).prop("checked") ? ["myadm", 0] : ["alladm", 0];

    get_NewPageTableV1(); 

});

$(`#parentPageTableBody`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4, KeyCode.Insert].indexOf(e.which) == -1)
        return;
    e.preventDefault();

    let row = $(`#parentPageTableBody .highlight`);
    rowNumberAdmission = +row.data("id")

    switchPrnAdmissionSale(e)
});

$("#stepLogModalAdmissionItem").on("hidden.bs.modal", async function () {
    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0 };
});

initAdmissionItem()
