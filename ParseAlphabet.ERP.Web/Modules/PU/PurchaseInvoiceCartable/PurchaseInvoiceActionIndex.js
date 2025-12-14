var currentActionId = 0;
var stageActionLogCurrent = {
    identityId: 0,
    stageId: 0,
    actionId: 0,
    workFlowId: 0,
    currentrequestId: 0,
    documentDatePersian: null,
    parentWorkflowCategoryId: 0
}
$("#stepLogModalPurchaseInvoice").on("shown.bs.modal", function () {
    $("#actionPurchaseInvoice").focus();
});

function stepLogPurchasePersonInvoice(id, stageId, workflowId) {
    $("#stepLogRowsPurchaseInvoice").html("");

    var url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist/${id}/${stageId}/${workflowId}`

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
                $("#stepLogRowsPurchaseInvoice").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function update_actionPurchasePersonInvoice() {

    var requestedActionId = +$("#actionPurchasePersonInvoice").val();

    currentActionId = +stageActionLogCurrent.actionId;
    var currentWorkflowId = +stageActionLogCurrent.workFlowId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var documentDatePersian = stageActionLogCurrent.documentDatePersian;
    var requestId = +stageActionLogCurrent.currentrequestId;
    var parentWorkflowCategoryId = +stageActionLogCurrent.parentWorkflowCategoryId;


    var model = {
        requestActionId: requestedActionId,
        currentActionId: currentActionId,
        identityId: +stageActionLogCurrent.identityId,
        stageId: currentStageId,
        isLine: false,
        isPurchaceOrderLine: false,
        workflowId: currentWorkflowId,
        workflowCategoryId: workflowCategoryIds.purchase.id,
        parentWorkflowCategoryId: parentWorkflowCategoryId,
        documentDatePersian: documentDatePersian,
        requestId: requestId
    }

    loadingAsync(true, "update_action_btn", "");
   
    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            if (model.requestActionId != model.currentActionId)
                checkValidateUpdateStep(model);

            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "update_action_btn", "");
            }
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionPurchasePersonInvoice").val(model.currentActionId)
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

function checkValidateUpdateStep(model) {

    let url = `api/PU/PurchaseOrderActionApi/validateupdatestep`;

    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {

                var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);

                updateactionPurchase(model, currentStageAction, requestStageAction);
            }
            else {
                if (checkResponse(result.validationErrors)) {
                    $("#actionPurchasePersonInvoice").val(model.currentActionId).trigger("change")
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                }
            }
            loadingAsync(false, "update_action_btn", "");
        },
        error: function (xhr) {
            error_handler(xhr, url);
            loadingAsync(false, "update_action_btn", "");
            return false;
        }
    });


}

function updateactionPurchase(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 
    if (currentStageAction.priority < requestStageAction.priority) {
        let multipleSettlement = true;
        // بررسی وضعیت تسویه بر اساس جریان کار و مرحله  درخواست
        var purchaseOrder = getPurchaseOrderInfo(model.requestId);
        if (model.requestId > 0)
            multipleSettlement = getMultipleSettlement(purchaseOrder.workflowId, purchaseOrder.stageId);
        else
            multipleSettlement = false;

        //#region گام3 به گام 4
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance();
                if (result.data.successfull) {
                    sendDocument(model, () => {
                        updateStatusPurchasePersonInvoice(model,
                            () => {
                                $(`#actionPurchasePersonInvoice`).val(currentActionId)
                            });
                    });
                }
                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $(`#actionPurchasePersonInvoice`).val.val(currentActionId);
                }
            }
            else {
                sendDocument(model, () => {
                    updateStatusPurchasePersonInvoice(model,
                        () => {
                            $(`#actionPurchasePersonInvoice`).val(currentActionId)
                        });
                });
            }

        }

        //#endregion

        //#region گام2 به گام 3   

        else if (!currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance();

                if (result.data.successfull)
                    updateStatusPurchasePersonInvoice(model,
                        () => {
                            $(`#actionPurchasePersonInvoice`).val(currentActionId)
                        });

                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $(`#actionPurchasePersonInvoice`).val(currentActionId);
                }
            }
            else {
                updateStatusPurchasePersonInvoice(model,
                    () => {
                        $(`#actionPurchasePersonInvoice`).val(currentActionId)
                    });
            }


        }

        //#endregion

    }

    //#region  کاهش گام
    else {
        // گام4 به گام 3 
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            sendDocument(model, () => {
                updateStatusPurchasePersonInvoice(model,
                    () => {
                        $("#actionPurchasePersonInvoice").val(currentActionId).trigger("change")
                    });
            });
        }
        // گام3 به گام 2 
        else if (currentStageAction.isLastConfirmHeader && !requestStageAction.isLastConfirmHeader)
            updateStatusPurchasePersonInvoice(model,
                () => {
                    $("#actionPurchasePersonInvoice").val(currentActionId).trigger("change")
                });
    }
    //#endregion
}

function checkHeaderBalance() {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: +stageActionLogCurrent.currentrequestId,
        workflowCategoryIdCurrentStage: 1,
        workflowCategoryIdParentStage: 1,
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

function sendDocument(model, callBack) {

    let newmodel = {
        identityId: +model.identityId,
        stageId: +model.stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    let requestedStageStep = checkIsSendActionId(model), viewModelSend = {};

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length === 0) {
            viewModelSend = {
                model: [{ id: model.identityId }],
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/purchasepost`
            };
            sendDocPostingGroup(viewModelSend,

                () => {
                    $(`#actionPurchasePersonInvoice`).val(model.requestActionId)
                }, callBack);
        }

        else
            updateStatusPurchasePersonInvoice(model,
                () => {
                    $(`#actionPurchasePersonInvoice`).val(model.currentActionId)
                });
    }
    else {

        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length !== 0) {
            viewModelSend = [{
                identityId: +model.identityId,
                stageId: +model.stageId
            }];

            undoDocPostingGroup(viewModelSend, () => {
                $("#actionPurchasePersonInvoice").val(model.currentActionId)
            }, callBack);
        }
        else
            updateStatusPurchasePersonInvoice(model);
    }

}

function checkIsSendActionId(obj) {
    let model = {
        stageId: obj.stageId,
        actionId: obj.requestActionId,
        worFlowId: obj.worFlowId
    }

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
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

function updateStatusPurchasePersonInvoice(model, callBack1) {

    if (model.requestActionId > 0) {

        let url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`;

        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {
                    alertify.success(result.statusMessage);
                    stepLogPurchasePersonInvoice(idForStepAction, model.stageId, model.workflowId)

                    get_NewPageTableV1();

                    stageActionLogCurrent.actionId = +model.requestActionId;
                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    callBack1()
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}




