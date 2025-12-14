var viewData_form_title = "لیست گام های ثبت شده",
    stageActionLogCurrent = { identityId: 0, stageId: 0, branchId: 0, actionId: 0, workFlowId: 0, documentDatePersian: 0 }

$("#stepLogModalWarehouseTransaction").on("shown.bs.modal", function () {
    $("#actionItemWarehouse").focus();

});

function update_actionWarehouse() {

    var requestedActionId = +$("#actionItemWarehouse").val();
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentIdentity = +stageActionLogCurrent.identityId;
    var currentWorkFlowId = +stageActionLogCurrent.workFlowId;
    var documentDatePersian = stageActionLogCurrent.documentDatePersian;


    var model = {
        requestActionId: requestedActionId,
        currentActionId: +stageActionLogCurrent.actionId,
        identityId: currentIdentity,
        stageId: currentStageId,
        workflowId: currentWorkFlowId,
        isLine: false,
        isItemRequestLine: false,
        workflowCategoryId: workflowCategoryIds.warehouse.id,
        parentWorkflowCategoryId: workflowCategoryIds.warehouse.id,
        documentDatePersian: documentDatePersian
    }


    loadingAsync(true, "update_action_btn", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            if (model.requestActionId != model.currentActionId)
                updateStatus_ItemRequset(model);
            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                $("#actionItemWarehouse").val(model.currentActionId)

            }
            loadingAsync(false, "update_action_btn", "");
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionItemWarehouse").val(model.currentActionId)
            loadingAsync(false, "update_action_btn", "");
        }

 
    },10)
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

function updateStatus_ItemRequset(model) {

    let viewData_updateWarehouseStep_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/updatestep`;

    if (model.requestActionId > 0) {
        $.ajax({
            url: viewData_updateWarehouseStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {
                    alertify.success(result.statusMessage);
                    stageActionLogCurrent.actionId = +model.requestActionId;
                    if (model.isLine)
                        afterUpdateStatus(result);
                    else {
                        stepLogWarehouse(model.identityId, model.stageId, model.workflowId)
                        get_NewPageTableV1();
                    }
                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);

                    if (model.isLine)
                        $(`#itemRequestLinePage #actionItemWarehouseForm`).val(+model.currentActionId)
                    else
                        $("#actionItemWarehouse").val(stageActionLogCurrent.actionId)
                    stageActionLogCurrent.actionId = +model.currentActionId;
                }
                loadingAsync(false, "stepRegistration", "");
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateWarehouseStep_url);
                loadingAsync(false, "stepRegistration", "");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
        loadingAsync(false, "stepRegistration", "");
    }

}

function stepLogWarehouse(id, stageId, workFlowId) {

    let viewData_WarehouseStepList_url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist`;
    $("#stepLogRowsItemRequest").html("");
    $.ajax({
        url: `${viewData_WarehouseStepList_url}/${id}/${stageId}/${workFlowId}`,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
                $("#stepLogRowsItemRequest").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_WarehouseStepList_url);
        }
    });
}



function afterUpdateStatus(result) {

    if (result.successfull)
        get_header();

    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }

    configItemRequestElementPrivilage(".ins-out", false);

}


