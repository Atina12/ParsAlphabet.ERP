var viewData_form_title = "درخواست های انبار",
    viewData_controllername = "ItemRequestApi",
    viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemRequest.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    currentStageId = 0,
    identityItemRequsetStageActionLog = 0,
    lastpagetable_formkeyvalue = [];

function initItemRequestIndexForm() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    $(".button-items").prepend($(".toggle"));
    pagetable_formkeyvalue = ["my", 0];

    get_NewPageTableV1();

    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm()" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));


}

function export_csv() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                Filters: arrSearchFilter[index].filters,
                Form_KeyValue: [$("#userType").prop("checked") ? "my" : "all", $("#userType").prop("checked") ? 0 : null]
            }
        }
        let viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;

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
        let viewData_deleterecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/delete`;
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

function run_button_showStepLogsItemRequset(id, rowno, elm, ev) {

    ev.stopPropagation();
    activePageTableId = "pagetable"
    let selectedRowId = `row${rowno}`;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var documentDatePersian = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("transactiondatepersian");
    var currentIdentityId = id;


    stageActionLogCurrent = {
        identityId: currentIdentityId,
        stageId: currentStageId,
        branchId: currentBranchId,
        actionId: currentActionId,
        workFlowId: currentWorkFlowId,
        documentDatePersian: documentDatePersian
    };


    $("#actionItemWarehouse").empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionItemWarehouse", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.warehouse.id}/true/${stageClassIds}`);
    $("#actionItemWarehouse").val(currentActionId).trigger("change");
    stepLogWarehouse(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalWarehouseTransaction");
}

function displaySimpleHeader() {
    navigateToModalItemTransaction(`/WH/ItemRequsetLine/display/${+$(".highlight").attr("data-id")}/1`);
}

function run_button_displaySimple(id, rowNo, elm) {
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalItemRequest(`/WH/ItemRequestLine/display/${id}/1/${stageId}/${workflowId}`);

}

function navigateToModalItemRequest(href) {
    initialPage();
    $("#contentdisplayItemRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayItemRequestLine #loader").removeClass("displaynone");
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

            $(`#contentdisplayItemRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemRequestLine #loader,#contentdisplayItemRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemRequestLine #form,#contentdisplayItemRequestLine .content").css("margin", 0);
    $("#contentdisplayItemRequestLine .itemLink").css("pointer-events", " none");
}

function run_button_itemRequestDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    navigation_item_click(`/WH/ItemRequestLine/${lineId}/1`);
}

function run_button_printRequestQuantity(id, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
 
    let trElement = $(`#${activePageTableId} #row${rowNo}`);
    let transactionId = trElement.data("id");
    let reportTitle = `چاپ تعدادی`;
    let stageQuantity = true;
    let branch = trElement.data("branch")
    let documentTypeName = ""
    let journalId = 0
    let documentDatePersian = trElement.data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle, documentDatePersian);
}

$('#displayItemRequestLineModel').on("hidden.bs.modal", function (evt) {

    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, 0];
});

$("#userType").on("change", function () {
    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["my", 0];
    else
        pagetable_formkeyvalue = ["all", null];

    get_NewPageTableV1();
});

$("#addItemRequest").on("click", function () {
    viewData_insrecord_url = viewData_insrecord_url_itemRequest;
    viewData_updrecord_url
    modal_ready_for_add("AddEditModalItemRequest");
});

$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var userId = null;
    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

initItemRequestIndexForm();



















