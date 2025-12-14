var viewData_updateAdmissionItemStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`,
    viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`,
    stageActionLogCurrent = { identityId: 0, admissionMasterId: 0, stageId: 0, branchId: 0, actionId: 0, workFlowId: 0, parentworkflowcategoryid: 0 };



function actionLogAdmissionItem(transactionId, stageId, workflowId) {

    var viewData_admissionItemStepList_url = `/api/WF/StageActionLogApi/getsteplist`;

    $("#stepLogRowsItem").html("");

    $.ajax({
        url: `${viewData_admissionItemStepList_url}/${transactionId}/${stageId}/${workflowId}`,
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
                $("#stepLogRowsItem").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_admissionItemStepList_url);
        }
    });
}

function update_actionItem() {

    var requestedActionId = +$("#actionTr").val();

    var currentActionId = +stageActionLogCurrent.actionId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentBranchId = +stageActionLogCurrent.branchId;
    var currentIdentityId = +stageActionLogCurrent.identityId;
    var currentworkFlowId = +stageActionLogCurrent.workFlowId;
    var currentparentworkflowcategoryid = +stageActionLogCurrent.parentworkflowcategoryid;
   
    if (currentActionId == requestedActionId)
        return;

    var model = {
        requestActionId: requestedActionId,
        identityId: currentIdentityId,
        stageId: currentStageId,
        branchId: currentBranchId,
        workFlowId: currentworkFlowId,
        workflowCategoryId: currentparentworkflowcategoryid
    }

    let resultValidate = validateAction(model);

    if (checkResponse(resultValidate)) {
        if (resultValidate.length == 0)
            updateActionAdmissionItem(model);
        else {
            alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
            $("#actionTr").val(currentActionId).trigger("change");
        }

    }
}

function validateAction(model) {

    let viewData_validateupdatestep_url = `${viewData_baseUrl_MC}/AdmissionItemApi/validationadmissionsale/${stageActionLogCurrent.admissionMasterId}`

    let outPut = $.ajax({
        url: viewData_validateupdatestep_url,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_validateupdatestep_url);
            return null;
        }
    });
    return outPut.responseJSON;
}

function sendDocument(model, callBack) {
    var stageId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("stageid");
    var id = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("id");
    var actionId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("actionid");
    var workflowId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("workflowid");

    var model = {
        requestActionId: requestedActionId,
        identityId: id,
        stageId: stageId,
        workFlowId: workflowId,
        actionId: actionId,
        workflowCategoryId: currentparentworkflowcategoryid
    }
    updateActionAdmissionItem(model);


}

function updateActionAdmissionItem(model) {

    if (model.requestActionId > 0) {
        //loadingAsync(true, "update_action_btn");
        $.ajax({
            url: viewData_updateAdmissionItemStep_url,
            async: true,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {

                    alertify.success(result.statusMessage);
                    stageActionLogCurrent.actionId = model.requestActionId;
                    updatelastaction().then(() => {
                        actionLogAdmissionItem(model.identityId, model.stageId, model.workFlowId)

                        modal_close("actionLogModalAdmissionItem")
                        get_NewPageTableV1();
                        //loadingAsync(false, "update_action_btn");
                    })

                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    loadingAsync(false, "update_action_btn");
                }
            },
            error: function (xhr) {
                loadingAsync(false, "update_action_btn");
                error_handler(xhr, viewData_updateAdmissionItemStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

async function updatelastaction() {

    let updatelastaction_url = `/api/MC/AdmissionItemApi/updatelastaction/${stageActionLogCurrent.admissionMasterId}/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.actionId}`

    $.ajax({
        url: updatelastaction_url,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, updatelastaction_url);
        }
    });
}


