var viewData_form_title = "لیست پذیرش",
    viewData_controllername = "AdmissionApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Admission.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_opencash = `${viewData_baseUrl_MC}/${viewData_controllername}/opencash`,
    rowNumberAdmission = 0;

function initAdmissionIndexForm() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    pagetable_formkeyvalue = ["myadm", 0];
    get_NewPageTableV1();
}

function admissionForm(admissionTypeId) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var check1 = checkCounter()
    if (!check1.successfull) {
        var msg = alertify.warning(check1.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    if (admissionTypeId == 2)
        navigation_item_click("/MC/Admission/form", "پذیرش");
    else if (admissionTypeId == 3)
        navigation_item_click("/MC/AdmissionServiceTamin/form", "پذیرش تامین");
    else if (admissionTypeId == 4)
        navigation_item_click("/MC/AdmissionServiceTaminEPrescription/form", "پذیرش نسخه نویسی");

}

function modal_ready_for_add() {
    admissionForm(2);
}

function run_button_display(id, rowNo) {
    var admissionMasterId = +$(`#row${rowNo}`).data("admissionmasterid");
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)

}

function run_button_print(rowNumber) {

    var check = controller_check_authorize(viewData_controllername, "PRN");

    if (!check)
        return;


    $("#modal_keyid_value").text(rowNumber);

    rowNumberAdmission = rowNumber;

    let row = $(`#parentPageTableBody .highlight`);
    let medicalrevenue = $(row).data("medicalrevenue");

    if (medicalrevenue != 1)
        $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
    else
        $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");

    if (medicalrevenue == 2)
        contentPrintAdmission(rowNumber)
    else
        modal_show(`PrnAdmission`)

}

function run_button_editAdm(id, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    let admissionMasterId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("admissionmasterid");


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

    let stageAction = getStageAction(workflowId, stageId, actionId, 0);

    if (stageAction.isDataEntry != 1 || stageAction.medicalRevenue != 1) {
        var msgUpdate = alertify.warning("امکان ویرایش پذیرش وجود ندارد");
        msgUpdate.delay(admission.delay);
        return;
    }

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId


    if (admissionTypeId == 2)
        navigation_item_click(`/MC/Admission/form/${id}`, "پذیرش - ویرایش");
    else if (admissionTypeId == 3)
        navigation_item_click(`/MC/AdmissionServiceTamin/form/${id}`, "پذیرش تامین - ویرایش");
    else if (admissionTypeId == 4)
        navigation_item_click(`/MC/AdmissionServiceTaminEPrescription/form/${id}`, "پذیرش نسخه نویسی - ویرایش");

}

async function run_button_admissionActionList(admissionId, row, elm, e) {
    
    let patientId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("patientid")
    let centralId = (+$(`#${activePageTableId}  tbody tr#row${row}`).data("centralid") == null ? 0 : +$(`#${activePageTableId}  tbody tr#row${row}`).data("centralid"))
    let actionId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("actionid")
    let stageId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("stageid")
    let branchId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("branchid")
    let workflowId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("workflowid")
    let admissionMasterId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("admissionmasterid")
    let medicalrevenue = +$(`#${activePageTableId}  tbody tr#row${row}`).data("medicalrevenue")
    let admissionMasterworkflowCategoryId = +$(`#${activePageTableId}  tbody tr#row${row}`).data("admissionmasterworkflowcategoryid")
    let requestAmount = await getAdmissionAmount(admissionId)

    stageActionLogCurrent = {
        actionId,
        stageId,
        branchId,
        workflowId,
        admissionMasterId,
        identityId: admissionId,
        requestAmount,
        medicalrevenue,
        admissionMasterworkflowCategoryId,
        patientId,
        currentActionId: actionId,
        centralId
    }

    actionLogAdmission();

    modal_show("actionLogModalAdmission");

}

function switchPrint(e) {
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
    else if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        admissionForm(2);
    }
}

function printShortcut(type) {

    let row = $(`#${activePageTableId} .highlight`);
    let rowNo = row.attr("id").split("row")[1]
    rowNumberAdmission = +row.data("id");

    if (type === 1)
        separationprint();
    else if (type === 2)
        aggregationprint();
    else if (type === 3)
        doubleprint();
    else if (type === 4)
        admissionstandprint();

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

    contentPrintAdmissionCompress(admissionId);

    modal_close('PrnAdmission');
}

function doubleprint() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#${activePageTableId} .highlight`);
    let admissionId = rowNumberAdmission;
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let element = $("#bcTarget")

    let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
    contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

    modal_close('PrnAdmission');
}

function admissionstandprint() {
    
    let row = $("#parentPageTableBody .highlight");

    let medicalrevenue = $(row).data("medicalrevenue");
    let admissionmasterid = row.data("admissionmasterid");
    standprint(admissionmasterid, medicalrevenue);

    modal_close('PrnAdmission')
}

function run_button_verifyhid(id, rowNo) {

    var check1 = checkCounter()
    if (!check1.successfull) {
        var msg = alertify.warning(check1.statusMessage);
        msg.delay(admission.delay);
        return;
    }

    let stageId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("stageid");
    let workflowId = +$(`#${activePageTableId}  tbody tr#row${rowNo}`).data("workflowid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    admissionTypeId == 2 ? getDataHidDetail(id) : ""

}

function getDataHidDetail(id) {

    let viewData_verifyhid_url = `${viewData_baseUrl_MC}/${viewData_controllername}/verifyhid`

    $.ajax({
        url: viewData_verifyhid_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            if (result.successfull) {
                fillTableHidVerify(result.data);
            }
            else {
                var msgSend = alertify.warning(result.statusMessage);
                msgSend.delay(alertify_delay);
            }
        },
        error: function (xhr) {

            error_handler(xhr, viewData_verifyhid_url);
            removeWaitingWSPAsync(rowNo);
        }
    });
}

async function removeWaitingWSPAsync(rowNo) {
    $(`#row${rowNo}`).removeClass("operating-error");
}

function fillTableHidVerify(data) {

    $("#tempverifyhidAdmission").html("");
    var hidDataOutput = "";

    if (data) {

        var emptyRow = $("#tempverifyhidAdmission").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempverifyhidAdmission").html("");

        hidDataOutput = `<tr>
                          <td>${data.id}</td>
                          <td>${data.hid}</td>
                          <td>${data.status}</td>
                     </tr>`

        $(hidDataOutput).appendTo("#tempverifyhidAdmission");

    }

    modal_show(`verifyhidAdmissionModal`);

}

$("#stepLogModalAdmission").on("hidden.bs.modal", function () {
    stageActionLogCurrent = {};
});

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


$(`#pagetable`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrint(e)
});

$(`#PrnAdmission`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrint(e)
});
initAdmissionIndexForm();




