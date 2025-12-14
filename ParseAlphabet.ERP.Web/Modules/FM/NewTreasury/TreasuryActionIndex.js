var viewData_updateTreasuryStep_url = `${viewData_baseUrl_FM}/NewTreasuryApi/updatestep`,
    viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`,
    currentActionId = 0,
    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0, workFlowId: 0, parentworkflowcategoryid: 0, requestId: 0 };

function stepLogTreasury() {
    
    id = +stageActionLogCurrent.identityId;
    stageId = +stageActionLogCurrent.stageId;
    workflowId = +stageActionLogCurrent.workFlowId

    var url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist/${id}/${stageId}/${workflowId}`;

    $("#stepLogRowsTreasury").html("");


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
                $("#stepLogRowsTreasury").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function update_actionTreasury() {
    
    var requestedActionId = +$("#actionTr").val();
    currentActionId = +stageActionLogCurrent.actionId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentIdentityId = +stageActionLogCurrent.identityId;
    var currentworkFlowId = +stageActionLogCurrent.workFlowId;
    var currentrequestId = +stageActionLogCurrent.requestId;
    var currentWorkflowcategoryId = workflowCategoryIds.treasury.id;


    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        stageId: currentStageId,
        workflowId: currentworkFlowId,
        identityId: currentIdentityId,
        workflowcategoryid: currentWorkflowcategoryId,
        requestId: currentrequestId,
        parentWorkflowCategoryId: stageActionLogCurrent.parentworkflowcategoryid
    }

    loadingAsync(true, "update_action_btn", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            let resultValidate = null;

            if (model.requestActionId != model.currentActionId) {

                resultValidate = validateBeforSendTreasury(model);
                if (checkResponse(resultValidate)) {
                    if (resultValidate.length == 0) {

                        var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                        var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);


                        updateactionTreasury(model, currentStageAction, requestStageAction);
                    }
                    else {
                        alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                        $("#actionTr").val(currentActionId);
                        loadingAsync(false, "update_action_btn", "");
                    }

                }
            }
            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "update_action_btn", "");
            }
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionTr").val(model.currentActionId)
            loadingAsync(false, "update_action_btn", "");
        }

    
    },10)

}

function updateactionTreasury(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 
    if (currentStageAction.priority < requestStageAction.priority) {
        //#region گام3 به گام 4   

        var multipleSettlement = true;
        var currentRequest = null;


        if (model.parentWorkflowCategoryId != 0) {
            if (model.requestId > 0) {
                currentRequest = getTreasuryRequestInfo(model.requestId, model.parentWorkflowCategoryId);
                multipleSettlement = getMultipleSettlement(currentRequest.workflowId, currentRequest.stageId);
            }
           
        }


        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);
                if (result.data.successfull) {
                    sendDocumentTreasury(model, () => {
                        updateStatusTreasury(model,
                            () => {
                                $("#actionTr").val(currentActionId).trigger("change")
                            });
                    });
                }
                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $("#actionTr").val(currentActionId);
                }
            }
            else {
                sendDocumentTreasury(model, () => {
                    updateStatusTreasury(model);
                });
            }

        }

        //#endregion

        //#region گام2 به گام 3  

        else if (!currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);

                if (result.data.successfull)
                    updateStatusTreasury(model,
                        () => {
                            $("#actionTr").val(currentActionId).trigger("change")
                        });

                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $("#actionTr").val(currentActionId);
                }
            }
            else {
                sendDocumentTreasury(model, () => {
                    updateStatusTreasury(model);
                });
            }

        }

        //#endregion
    }


    //#endregion

    //#region  کاهش گام
    else {

        //#region گام4 به گام 3 
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            sendDocumentTreasury(model, () => {
                updateStatusTreasury(model,
                    () => {
                        $("#actionTr").val(currentActionId).trigger("change")
                    });
            });
        }
        //#endregion
        //#region گام3 به گام 2  
        else if (currentStageAction.isLastConfirmHeader && !requestStageAction.isLastConfirmHeader)

            updateStatusTreasury(model,
                () => {
                    $("#actionTr").val(currentActionId).trigger("change")
                });

        //#endregion
    }

    //#endregion

    loadingAsync(false, "update_action_btn", "");
}

function checkHeaderBalance(model) {
    
    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: model.requestId,
        workflowCategoryIdCurrentStage: +workflowCategoryIds.treasury.id,
        workflowCategoryIdParentStage: +stageActionLogCurrent.parentworkflowcategoryid > 0 ? +stageActionLogCurrent.parentworkflowcategoryid : workflowCategoryIds.treasury.id,
        amountOrQuantity: true
    }

    var outPut = $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelnew),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            return 0;
        }
    });

    return outPut.responseJSON;
}

function sendDocumentTreasury(model, callBack) {

    var stageId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("stageid");
    var id = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("id");
    var actionId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("actionid");
    var workflowId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("workflowid");


    let requestedStageStep = checkIsSendActionIdTreasury(stageId, model.requestActionId, workflowId), modelSend = {};

    let newmodel = {
        identityId: +id,
        stageId: +stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            modelSend = {
                model: [{ id: id }],
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`
            };
            sendDocPostingGroup(modelSend,
                () => {
                    $(`#actionTr`).val(model.requestActionId)
                }, callBack);
        }
        else
            updateStatusTreasury(model);
    }
    else {
        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length !== 0) {
            modelSend = [{
                identityId: id,
                stageId: stageId
            }];
            undoDocPostingGroup(modelSend, () => {

                $("#actionTr").val(currentActionId);

            }, callBack);

        }
        else
            updateStatusTreasury(model);
    }

}

function updateStatusTreasury(model, callBack1) {

    if (model.requestActionId > 0) {

        $.ajax({
            url: viewData_updateTreasuryStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {

                    alertify.success(result.statusMessage);
                    if (stepLogModalTreasuryForCloseModal == true)
                        modal_close('stepLogModalTreasury');

                    stepLogTreasury(model.identityId, model.stageId, model.workflowId)

                    get_NewPageTableV1();

                    stageActionLogCurrent.actionId = model.requestActionId;
                    stageActionLogCurrent.workFlowId = model.workflowId;

                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    callBack1()
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateTreasuryStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
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