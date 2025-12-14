var viewData_updateTreasuryRequestStep_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/updatestep`,
    viewData_treasuryStepList_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/gettreasuryrequeststeplist`,
    viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`,
    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0, workFlowId: 0, parentworkflowcategoryid: 0 };

function stepLogTreasuryRequest(id, stageId, workflowId) {

    var url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist/${id}/${stageId}/${workflowId}`;

    $("#stepLogRowsTreasuryRequest").html("");

    $.ajax({
        url: url,
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
                $("#stepLogRowsTreasuryRequest").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function validateBeforSendTreasuryRequest(model) {

    let url = `${viewData_baseUrl_FM}/TreasuryRequestApi/validateupdatestep`;
    let outPut = $.ajax({
        url: url,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return outPut.responseJSON;
}

function update_actionTreasuryRequest() {

    var requestedActionId = +$("#actionTreasuryRequest").val();

    var currentActionId = +stageActionLogCurrent.actionId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentIdentityId = +stageActionLogCurrent.identityId;
    var currentworkFlowId = +stageActionLogCurrent.workFlowId;

    if (currentActionId == requestedActionId)
        return;

    var model = {
        requestActionId: requestedActionId,
        identityId: currentIdentityId,
        stageId: currentStageId,
        workflowId: currentworkFlowId,
        workflowCategoryId: workflowCategoryIds.treasury.id
    }


    loadingAsync(true, "update_action_btn");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            let resultValidate = validateBeforSendTreasuryRequest(model);

            if (checkResponse(resultValidate)) {
                if (resultValidate.length == 0)
                    updateStatusTreasuryRequest(model);

                else {
                    alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                    $("#actionTreasuryRequest").val(currentActionId);
                    loadingAsync(false, "update_action_btn");
                }

            }
            else
                loadingAsync(false, "update_action_btn");
           
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionTreasuryRequest").val(currentActionId)
            loadingAsync(false, "update_action_btn");
        }
    },10)
}

function updateStatusTreasuryRequest(model) {
 

    if (model.requestActionId > 0) {

        $.ajax({
            url: viewData_updateTreasuryRequestStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result.successfull) {

                    alertify.success(result.statusMessage);
                    if (stepLogModalTreasuryForCloseModal == true)
                        modal_close('stepLogModalTreasuryRequest');
                    stepLogTreasuryRequest(model.identityId, model.stageId, model.workflowId);

                    get_NewPageTableV1();

                    stageActionLogCurrent.actionId = model.requestActionId;

                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                }
                loadingAsync(false, "update_action_btn");

            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateTreasuryRequestStep_url);
                loadingAsync(false, "update_action_btn");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
        loadingAsync(false, "update_action_btn");
    }

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

function checkIsSendActionIdTreasury(stageId, requestActionId, workflowId) {
    let model = {
        stageId: stageId,
        actionId: requestActionId,
        workflowId: workflowId
    }
    var result = $.ajax({
        url: viewData_has_SendActionId,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_has_postGroup);
            return false;
        }
    });

    return result.responseJSON;
}