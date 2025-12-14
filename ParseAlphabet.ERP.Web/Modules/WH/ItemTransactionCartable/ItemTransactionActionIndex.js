var viewData_form_title = "لیست گام های ثبت شده",
    currentActionId = 0,

    stageActionLogCurrent = {
        identityId: 0,
        stageId: 0,
        workFlowId: 0,
        documentDatePersian: 0,
        actionId: 0,
        currentrequestId: 0,
        parentWorkflowCategoryId: 0,
        currentBranchId: 0
    };
$("#stepLogModalItemTransaction").on("shown.bs.modal", function () {
    $("#actionItemTransaction").focus();

});

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

function update_actionItemTransaction() {

    var requestedActionId = +$("#actionItemTransaction").val();

    var currentIdentity = +stageActionLogCurrent.identityId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentWorkFlowId = +stageActionLogCurrent.workFlowId;
    var documentDatePersian = stageActionLogCurrent.documentDatePersian;
    currentActionId = +stageActionLogCurrent.actionId;
    var requestId = +stageActionLogCurrent.currentrequestId;
    var parentWorkflowCategoryId = stageActionLogCurrent.parentWorkflowCategoryId;
    var currentBranchId = stageActionLogCurrent.currentBranchId;

    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        identityId: currentIdentity,
        stageId: currentStageId,
        workflowId: currentWorkFlowId,
        isLine: false,
        isItemRequestLine: false,
        workflowCategoryId: workflowCategoryIds.warehouse.id,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId,
        requestId: requestId,
        currentBranchId: currentBranchId
    }


    loadingAsync(true, "update_action_btn", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            let resultValidate = null;
            if (model.requestActionId != model.currentActionId) {
                resultValidate = checkValidateUpdateStep(model);
                if (checkResponse(resultValidate)) {
                    if (resultValidate.length == 0) {

                        var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                        var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);

                        updateactionTransaction(model, currentStageAction, requestStageAction);
                        loadingAsync(false, "update_action_btn", "");
                    }
                    else {
                        alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                        $("#actionItemTransaction").val(currentActionId);
                        loadingAsync(false, "update_action_btn", "");
                    }

                }
                else
                    loadingAsync(false, "update_action_btn", "");
            }
            else
                loadingAsync(false, "update_action_btn", "");
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionItemTransaction").val(model.currentActionId)
            loadingAsync(false, "update_action_btn", "");
        }
    
    }, 10)
}

function checkValidateUpdateStep(model) {

    let url = `api/WH/WarehouseTransactionApi/validateupdatestep`;

    var result = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

function updateactionTransaction(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 
    if (currentStageAction.priority < requestStageAction.priority) {

        var currentOrder = null;
        let multipleSettlement = true;
        if (model.parentWorkflowCategoryId == 1) {
            // دریافت وضعیت تسویه از درخواست خرید
            currentOrder = getPurchaseOrderInfo(model.requestId);
        }
        else if (model.parentWorkflowCategoryId == 11) {
            // دریافت وضعیت تسویه از درخواست خرید
            currentOrder = getWarehouseTransactionInfo(model.requestId);
        }
        if (model.requestId > 0)
            multipleSettlement = getMultipleSettlement(currentOrder.workflowId, currentOrder.stageId);
        //else
        //    multipleSettlement = false;


        if (requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);
                if (result.data.successfull) {
                    updateStatus_warehouse(model);

                }
                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $(`#actionItemTransaction`).val(currentActionId);
                }
            }
            else
                updateStatus_warehouse(model);
        }
        else
            updateStatus_warehouse(model);
    }
    //#region  کاهش گام
    else {
        // گام4 به گام 3 
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            var fiscalYearLineId = getfiscalYearLineId(model.documentDatePersian);

            var isPriceWarhouse = checkUnitCostCalculationCheckLock(fiscalYearLineId, model.currentBranchId);
            if (!isPriceWarhouse) {
                sendDocument(model, () => {
                    updateStatus_warehouse(model);
                });
            }
            else {
                let errorText = "انبار در این ماه ، ریالی شده است اجازه ی تغییر گام را ندارید.";
                alertify.error(errorText).delay(alertify_delay);

                if (model.isLine)
                    $(`#${activePageId} #actionItemTransactionForm`).val(currentActionId);
                else
                    $(`#actionItemTransaction`).val(currentActionId);
            }
        }
        // گام3 به گام 2 
        else if (currentStageAction.isLastConfirmHeader && !requestStageAction.isLastConfirmHeader)
            updateStatus_warehouse(model);
    }
    //#endregion
}

function checkHeaderBalance(model) {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: +stageActionLogCurrent.requestId,
        workflowCategoryIdCurrentStage: +workflowCategoryIds.warehouse.id,
        workflowCategoryIdParentStage: +stageActionLogCurrent.parentWorkflowCategoryId > 0 ? +stageActionLogCurrent.parentWorkflowCategoryId : +workflowCategoryIds.warehouse.id,
        amountOrQuantity: false
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

function getfiscalYearLineId(PersianDate) {
    let url = `/api/GNApi/getfiscalyearlineidbypersiandate`;
    let outPut = $.ajax({
        url: url,
        data: JSON.stringify(PersianDate),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null) {
                return res;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return outPut.responseJSON;
}

function checkUnitCostCalculationCheckLock(fiscalYearLineId, currentBranchId) {

    let model = {
        fiscalYearLineId: fiscalYearLineId,
        branchId: currentBranchId
    }
    let url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/checkunitcostcalculation_checkLock`;
    let outPut = $.ajax({
        url: url,
        data: JSON.stringify(model),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null) {
                return res;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return outPut.responseJSON;
}

function updateStatus_warehouse(model) {

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

                    if (model.isLine)
                        afterUpdateStatus(result, model.isItemRequestLine);
                    else {

                        stepLogItemTransaction(model.identityId, model.stageId, model.workflowId)
                        get_NewPageTableV1();
                        stageActionLogCurrent.actionId = model.requestActionId;
                    }
                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    if (model.isLine)
                        $(`# itemTransactionLinePage #actionItemTransactionForm`).val(model.currentActionId)
                    else
                        $(`#actionItemTransaction`).val(model.currentActionId)
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateWarehouseStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

function stepLogItemTransaction(id, stageId, workFlowId) {

    let viewData_WarehouseStepList_url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist`;
    $("#stepLogRowsItemTransaction").html("");
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
                $("#stepLogRowsItemTransaction").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_WarehouseStepList_url);
        }
    });
}

function afterUpdateStatus(result) {

    if (result.successfull) {
        get_header();

    }
    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }

    configItemTransactionElementPrivilage(`.ins-out`, false);
}

function getPurchaseOrderInfo(id) {

    let url = "/api/PU/PurchaseOrderApi/getinfo"

    let outPut = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return outPut.responseJSON;
}

function sendDocument(model, callBack) {

    let requestedStageStep = checkIsSendActionId(model.workflowId, model.stageId, model.requestActionId), modelSend = {};
    let newmodel = {
        identityId: +model.identityId,
        stageId: +model.stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            modelSend = [{
                id: model.identityId,
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`
            }];
            sendDocPostingGroup(modelSend, () => {
                $(`#actionItemTransaction`).val(model.actionId)
            }, callBack);
        }
        else
            updateStatus_warehouse(model);
    }
    else {
        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length !== 0) {
            modelSend = [{
                identityId: model.identityId,
                stageId: model.stageId
            }];
            undoDocPostingGroup(modelSend, () => { $(`#actionItemTransaction`).val(model.actionId) }, callBack);
        }
        else
            updateStatus_warehouse(model);
    }

}

function checkIsSendActionId(workflowId, stageId, actionId) {

    let viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`;
    let model = {
        workflowId: workflowId,
        stageId: stageId,
        actionId: actionId
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