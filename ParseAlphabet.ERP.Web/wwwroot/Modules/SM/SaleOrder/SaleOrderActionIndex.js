var viewData_updateSaleOrderStep_url = `${viewData_baseUrl_SM}/SaleOrderStepApi/updatestep`,
    viewData_saleorderStepList_url = `${viewData_baseUrl_SM}/SaleOrderStepApi/getsaleordersteplist`,
    viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

$("#stepLogModalSaleOrder").on("shown.bs.modal", function () {
    $("#actionSaleOrder").focus();
});

function stepLogSaleOrder(id) {

    $("#stepLogRowsSaleOrder").html("");

    $.ajax({
        url: viewData_saleorderStepList_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {

                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.stepDateTimePersian}</td></tr>`;
                $("#stepLogRowsSaleOrder").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_saleorderStepList_url);
        }
    });
}

function update_actionSaleOrder() {
    var requestedActionId = +$("#actionSaleOrder").val();
    var currentActionId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("actionid");
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    if (currentActionId == requestedActionId) {
        return;
    }

    var model = {
        requestActionId: requestedActionId,
        identityId: +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("id"),
        stageId: currentStageId
    }

    sendDocumentSaleOrder(model,
        () => { updateStatusSaleOrder(model, () => { $("#actionSaleOrder").val(currentActionId).trigger("change") }); },
        () => { $("#actionSaleOrder").val(currentActionId).trigger("change") }
    );
}

function sendDocumentSaleOrder(model, callBack = undefined, callBack1 = undefined) {
    var id = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("id");
    var actionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var stageId = model.stageId;
    let requestedStageStep = checkIsSendActionId(stageId, model.requestActionId), modelSend = {};
    let newmodel = {
        identityId: +id,
        stageId: +stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }
    if (requestedStageStep.isPostedGroup) {

        let isPostGroup = hasPostGroup(newmodel);
        if (!isPostGroup) {
            modelSend = [{
                id: id,
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/purchasepost`,
            }];
            sendDocPostingGroup(modelSend, (isSuccess) => {
                $(`#actionSaleOrder`).val(actionId);
                if (!isSuccess)
                    $("#SaleOrderErrorResult").insertAfter("#stepLogRowsSaleOrder");

            }, callBack);
        }
        else
            updateSaleOrder(model, callBack1);
    }
    else {
        let isPostGroup = hasPostGroup(newmodel);
        if (isPostGroup) {
            modelSend = [{ identityId: id, stageId: stageId }];
            undoDocPostingGroup(modelSend, undefined, callBack, undefined);

        }
        else
            updateStatusSaleOrder(model, callBack1);
    }
}

function updateStatusSaleOrder(model, callback1 = undefined) {

    if (model.requestActionId > 0) {
        $.ajax({
            url: viewData_updateSaleOrderStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result.successfull) {

                    alertify.success(result.statusMessage);
                    stepLogSaleOrder(idForStepAction)

                    get_NewPageTableV1();
                }
                else {

                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    callback1()
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateSaleOrderStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

function checkIsSendActionId(stageId, requestActionId) {
    let model = {
        stageId: stageId,
        actionId: requestActionId
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
            error_handler(xhr, viewData_has_SendActionId);
            return false;
        }
    });

    return result.responseJSON;
}



