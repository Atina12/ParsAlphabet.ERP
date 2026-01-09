var viewData_form_title = "درخواست خزانه",
    viewData_controllername = "TreasuryRequestApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_insrecord_url_trRequest = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}TreasuryRequest.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    stepLogModalTreasuryForCloseModal = false;




function initTreasuryRequestIndexForm() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $(".button-items").prepend($(".toggle"));

    pagetable_formkeyvalue = ["my", 0];

    $('#userType').bootstrapToggle();

    get_NewPageTableV1();

    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm()" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));

}

$("#userType").on("change", function () {
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["my", 0];
    else
        pagetable_formkeyvalue = ["all", null];

    get_NewPageTableV1();

});

$("#addTreasuryRequest").on("click", function () {
    viewData_insrecord_url = viewData_insrecord_url_trRequest;
    modal_ready_for_add("AddEditModalTreasuryRequest");
});

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
        { Item: "StageId", Value: null, SqlDbType: dbtype.TinyInt, Size: p_size },
        { Item: "TreasurySubject", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "NoSeriesId", Value: null, SqlDbType: dbtype.Int, Size: 0 },

    ]

    stimul_report(reportParameters);
});

function printDocumentTreasury(stageClass, inOut, id, reportTitle) {

    if (stageClass == 1) {
        let reportParameters = [{ Item: "TreasuryId", Value: id, SqlDbType: dbtype.BigInt, Size: 0 }, { Item: "StageClassId", Value: stageClass, SqlDbType: dbtype.Int, Size: 0 }],
            reportModel = {
                reportName: reportTitle,
                reportUrl: `${stimulsBaseUrl.FM.Prn}RequestReceiveMoney.mrt`,
                parameters: reportParameters,
                reportSetting: reportSettingModel
            };

        window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
    }
    else if (stageClass == 3) {
        let reportParameters = [{ Item: "TreasuryId", Value: id, SqlDbType: dbtype.BigInt, Size: 0 }, { Item: "StageClassId", Value: stageClass, SqlDbType: dbtype.Int, Size: 0 }],
            reportModel = {
                reportName: reportTitle,
                reportUrl: `${stimulsBaseUrl.FM.Prn}TreasuryPaymentReceipt.mrt`,
                parameters: reportParameters,
                reportSetting: reportSettingModel
            };

        window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
    }
    else {
        var msg = alertify.warning('هیچ گونه چاپی برای این سطر تعیین نشده است.');
        msg.delay(alertify_delay);
    }
}

function run_button_printRequest(identity, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let stageClass = +$(`#row${rowNo}`).data("stageclassid"),
        currentInOut = +$(`#row${rowNo}`).data("currentinout"),
        id = $(`#row${rowNo}`).data("id"),
        stage = $(`#row${rowNo} #col_${rowNo}_3`).text().split('-')[1],
        reportTitle = `اسنادخزانه - ${stage}`;

    printDocumentTreasury(stageClass, currentInOut, id, reportTitle);
}

async function getStageStep(model) {
   
    var url = `api/WF/StageActionApi/getaction`;
    let output = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return output;

}

function run_button_deleteTreasuryRequest(p_keyvalue, rowNo) {

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

$('#displayTreasuryRequestLineModel').on("hidden.bs.modal", function (evt) {

    let switchUser = ""
    activePageTableId = "pagetable"
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, null];
});

$("#stepLogModalTreasuryRequest").on("hidden.bs.modal", async function () {

    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0, workFlowId: 0, parentworkflowcategoryid: 0 };
});

function run_button_showStepLogsTreasury(id, rowno) {
    
    selectedRowId = `row${rowno}`;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentIdentityId = id;
    var currentworkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    stageActionLogCurrent = { identityId: currentIdentityId, stageId: currentStageId, actionId: currentActionId, workFlowId: currentworkFlowId }

    
    $("#actionTreasuryRequest").empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionTreasuryRequest", true, `${currentStageId}/${currentworkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);

    $("#actionTreasuryRequest").val(currentActionId).trigger("change");
    stepLogTreasuryRequest(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId );
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalTreasuryRequest");
}

initTreasuryRequestIndexForm();



