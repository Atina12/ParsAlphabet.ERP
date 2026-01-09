
function getStageDocumentType(stageId) {

    var viewData_getStageDocumentType_url = `${viewData_baseUrl_WF}/StageApi/getdocumenttype`;

    let output = $.ajax({
        url: viewData_getStageDocumentType_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(stageId),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getStageDocumentType_url);
            return { id: 0, name: "" };
        }
    });

    return output.responseJSON;

}

function getInOutStage(id) {

    let url = `${viewData_baseUrl_WF}/StageApi/getinout`;

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return output.responseJSON;
}

function getParentRequestStageStep(requestId, workflowCategoryId) {

    var model = {
        requestId: requestId,
        workflowCategoryId: workflowCategoryId
    }

    let url = `${viewData_baseUrl_WF}/StageActionApi/getparentrequeststagestepactionbyid`;

    let outPut = $.ajax({
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
        }
    });
    return outPut.responseJSON;
}

function getHasStageFundItemType(stageId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/gethasstagefunditemtype/${stageId}`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
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

function getStageAction(workflowId, stageId, actionId, priority) {

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`

    let model = {
        workflowId,
        stageId,
        actionId,
        priority: priority,
        isActive: true
    }

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
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