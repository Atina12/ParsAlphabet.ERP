var viewData_form_title = "اسناد خزانه",
    viewData_controllername = "NewTreasuryApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}Treasury.mrt`,    
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    stageFormPlate = 'NewTreasuryIndex',
    shamsiTransactionDate = "",   
    selectedRowId=0,
    activePageTableId = "",
    stepLogModalTreasuryForCloseModal = false;


function initNewTreasuryIndexForm() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    pagetable_formkeyvalue = ["my", 0];

    $('#userType').bootstrapToggle();

    get_NewPageTableV1();

    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm(false)" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));

}

function export_csv() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {

            csvModel = {
                filters: arrSearchFilter[index].filters,
                Form_KeyValue: [$("#userType").prop("checked") ? "my" : "all", $("#userType").prop("checked") ? 0 : null]
            }
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
                error_handler(xhr, viewData_csv_url);
            }
        });
    }, 500);
}

function run_button_showStepLogsTreasury(id, rowno) {
   
    selectedRowId = `row${rowno}`;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var branchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentIdentityId = id;
    var currentworkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var currentrequestId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("requestid");
    var currentparentworkflowcategoryid = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("parentworkflowcategoryid");
    stageActionLogCurrent = { identityId: currentIdentityId, stageId: currentStageId, actionId: currentActionId, workFlowId: currentworkFlowId, parentworkflowcategoryid: currentparentworkflowcategoryid, requestId: currentrequestId }

    $("#actionTr").empty();
    let stageClassIds = "3";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionTr", true, `${currentStageId}/${currentworkFlowId}/1/0/${branchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);
    $("#actionTr").val(currentActionId).trigger("change");
 
    stepLogTreasury();
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    
    modal_show("stepLogModalTreasury");
}

function run_button_treasuryDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("NewTreasuryApi", "INS");
    if (!check)
        return;
    
    navigation_item_click(`/FM/NewTreasuryLine/${lineId}/1`);
    conditionalProperties.isCartable = false;
}

function run_button_treasuryDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("NewTreasuryApi", "INS");
    if (!check)
        return;
    
    navigation_item_click(`/FM/NewTreasuryLine/${lineId}/0`);
    conditionalProperties.isCartable = false;
}

function run_button_print(rowId, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let stageClass = +$(`#row${rowNo}`).data("stageclassid"),
        id = $(`#row${rowNo}`).data("id"),
        currentInOut = $(`#${activePageTableId} .pagetablebody tr.highlight`).data("currentinout"),
        stage = $(`#row${rowNo} #col_${rowNo}_4`).text().split('-')[1],
        reportTitle = `خزانه - ${stage}`;

    printDocumentTreasury(stageClass, currentInOut, id, reportTitle);
}

function run_button_printRequest(identity, rowNo, elm) {

    let stageClass = +$(`#row${rowNo}`).data("stageclassid"),
        currentInOut = +$(`#row${rowNo}`).data("currentinout"),
        id = $(`#row${rowNo}`).data("id"),
        stage = $(`#row${rowNo} #col_${rowNo}_4`).text().split('-')[1],
        reportTitle = `خزانه - ${stage}`;

    printDocumentTreasury(stageClass, currentInOut, id, reportTitle);
}

function run_button_delete(p_keyvalue, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(p_keyvalue),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {

                        get_NewPageTableV1();

                        let messages = generateErrorString(result.validationErrors);
                        alertify.success(messages).delay(alertify_delay);
                    }
                    else {
                        let messages = generateErrorString(result.validationErrors);
                        alertify.error(messages).delay(alertify_delay);
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

$("#userType").on("change", function () {
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["my", null];
    else
        pagetable_formkeyvalue = ["all", null];

    get_NewPageTableV1();
});

$("#addTreasury").on("click", function () {
    viewData_insrecord_url = viewData_insrecord_url_tr;
    modal_ready_for_add("AddEditModalTreasury");
});

$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";
    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    var userId = getUserId();
    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ActionName", Value: null, SqlDbType: dbtype.NVarChar, Size: p_size },
        { Item: "AccountDetail", Value: null, SqlDbType: dbtype.NVarChar, Size: p_size },
        { Item: "BranchId", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "CreateUserId", Value: $("#userType").prop("checked") ? userId : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "WorkflowId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromTreasuryDate", Value: null, SqlDbType: dbtype.DateTime2, Size: 0 },
        { Item: "ToTreasuryDate", Value: null, SqlDbType: dbtype.DateTime2, Size: 0 },
        { Item: "TreasuryId", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "RequestId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "StageId", Value: null, SqlDbType: dbtype.TinyInt, Size: p_size },
        { Item: "TreasurySubject", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "NoSeriesId", Value: null, SqlDbType: dbtype.Int, Size: 0 },

    ]

    stimul_report(reportParameters);
});

$(`#pagetable`).on("keydown", function (e) {

    if ([KeyCode.key_General_1].indexOf(e.which) == -1) return;

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        let stageClass = +$(`#${activePageTableId} .pagetablebody tr.highlight`).data("stageclassid"),
            id = $(`#${activePageTableId} .pagetablebody tr.highlight`).data("id"),
            currentInOut = $(`#${activePageTableId} .pagetablebody tr.highlight`).data("currentinout"),
            stage = $(`#${activePageTableId} .pagetablebody tr.highlight td:eq(3)`).text().split('-')[1],
            reportTitle = `خزانه - ${stage}`;

        printDocumentTreasury(stageClass, currentInOut, id, reportTitle);

    }
});

$('#displayTreasuryLineModel').on("hidden.bs.modal", function (evt) {
    let pagetable =""
    let switchUser = ""
    activePageTableId = "pagetable"
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, null];
});

$("#stepLogModalTreasury").on("hidden.bs.modal", async function () {

    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0 };
});

initNewTreasuryIndexForm();



