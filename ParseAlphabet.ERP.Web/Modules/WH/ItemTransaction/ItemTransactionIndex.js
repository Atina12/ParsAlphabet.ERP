var viewData_form_title = "تراکنش های انبار",
    viewData_controllername = "ItemTransactionApi",
    viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemTransaction.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_deleterecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/deleteTransaction`,
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`,
    currentStageId = 0,
    currentPriority = 0,
    selectedRowId = 0,
    lastpagetable_formkeyvalue = [];


function initItemTransactionIndexForm() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    pagetable_formkeyvalue = ["my", 0];

    get_NewPageTableV1();

    $("#note").suggestBox({
        api: `/api/WH/WarehouseDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });

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
                //FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
                //FieldValue: arr_pagetables[index].filtervalue,
                Filters: arrSearchFilter[index].filters,
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

//نمایش تعدادی
function run_button_displaySimpleQuntity(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    var isQuntity = 0;
    navigateToModalItemTransaction(`/WH/ItemTransactionLine/display/${id}/1/${stageId}/${workflowId}/${isQuntity}`);
}

//نمایش ریالی
function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    var isQuntity = 1;
    navigateToModalItemTransaction(`/WH/ItemTransactionLine/display/${id}/1/${stageId}/${workflowId}/${isQuntity}`);
}

function navigateToModalItemTransaction(href) {

    initialPage();
    $("#contentdisplayItemTransactionLine #content-page").addClass("displaynone");
    $("#contentdisplayItemTransactionLine #loader").removeClass("displaynone");
    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayItemTransactionLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemTransactionLine #loader,#contentdisplayItemTransactionLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemTransactionLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemTransactionLine #form,#contentdisplayItemTransactionLine .content").css("margin", 0);
    $("#contentdisplayItemTransactionLine .itemLink").css("pointer-events", " none");
}

function run_button_printQuantity(transactionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let trElement = $(`#${activePageTableId} #row${rowNo}`);
    let reportTitle = `چاپ تعدادی`;
    let stageQuantity = true;
    let branch = trElement.data("branch")
    let documentTypeName = trElement.data("documenttype") == undefined ? "" : trElement.data("documenttype")
    let journalId = +trElement.data("journalid")
    let documentDatePersian = trElement.data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle, documentDatePersian);
}

function run_button_printAmount(transactionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let trElement = $(`#${activePageTableId} #row${rowNo}`)
    let reportTitle = `چاپ ریالی`;
    let stageQuantity = false;
    let branch = trElement.data("branch")
    let documentTypeName = trElement.data("documenttype") == undefined ? "" : trElement.data("documenttype")
    let journalId = +trElement.data("journalid")
    let documentDatePersian = trElement.data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle);
}

function run_button_delete(p_keyvalue, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var warehouseInfo = getWarehouseTransactionInfo(p_keyvalue);
    warehouseInfo.parentWorkflowCategoryId = workflowCategoryIds.warehouse.id;
    warehouseInfo.stageClass = "1";
    var resultValidate = checkHeaderDeletePermission(warehouseInfo);


    if (resultValidate) {
        return;
    }
    else {
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
}

function run_button_itemTransactionDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    navigation_item_click(`/WH/ItemTransactionLine/${lineId}/1/0`);
}

function run_button_showStepLogsItemTransaction(id, rowno) {
    
    selectedRowId = `row${rowno}`;
    activePageTableId = "pagetable"

    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var documentDatePersian = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("transactiondatepersian");
    var parentWorkflowCategoryId = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("parentworkflowcategoryid");
    var requestId = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("requestid");
    var currentIdentityId = id;

    stageActionLogCurrent = {
        identityId: currentIdentityId,
        stageId: currentStageId,
        branchId: currentBranchId,
        actionId: currentActionId,
        workFlowId: currentWorkFlowId,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId,
        currentrequestId: requestId,
        currentBranchId: currentBranchId
    }

    
    $("#actionItemTransaction").empty();
    let stageClassIds = "3,4,8,11,14,15,16";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionItemTransaction", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.warehouse.id}/true/${stageClassIds}`);

    var currentActionId = +$(`#parentPageTableBody tbody tr#${selectedRowId}`).data("actionid");
    $("#actionItemTransaction").val(currentActionId).trigger("change");
    stepLogItemTransaction(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");

    var bySystem = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("bysystem");
    $("#actionItemTransaction").val(currentActionId).trigger("change").prop("disabled", bySystem);
    $("#update_action_btn").prop("disabled", bySystem);

    modal_show("stepLogModalItemTransaction");
}

function displaySimpleHeader() {
    let stageId = +$(".highlight").attr("data-stageid");
    let workflowId = +$(".highlight").attr("data-workflowid");
    navigateToModalItemTransaction(`/WH/ItemTransactionLine/display/${+$(".highlight").attr("data-id")}/1/${stageId}/${workflowId}/0`);
}

$("#addItemTransaction").on("click", function () {
    viewData_insrecord_url = viewData_insrecord_url_itemTransaction;
    modal_ready_for_add("AddEditModalItemTransaction");
});

$("#userType").on("change", function () {
    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["my", 0];
    else
        pagetable_formkeyvalue = ["all", null];

    get_NewPageTableV1();
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


    var reportParameters = [
        { Item: `CreateUserId`, Value: $("#userType").prop("checked") ? getUserId() : null, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});

$('#displayItemTransactionLineModel').on("hidden.bs.modal", function (evt) {

    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, 0];
});

initItemTransactionIndexForm()












