function getWarehouseTransactionInfo(id) {

    let url = "/api/WH/WarehouseTransactionApi/getinfo"

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

async function getStageStep(model) {
  
    let url = `/api/WF/StageActionApi/getaction`;
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

function checkHeaderDeletePermission(model) {

    let url = "/api/WH/WarehouseTransactionApi/validatedeletestep"

    let outPut = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

    var errors = outPut.responseJSON;
    var permission = errors != null && errors.length > 0;

    var errorStr = "";
    var erroLength = errors != null ? errors.length : 0;

    for (var i = 0; i < erroLength; i++) {
        var error = errors[i];

        errorStr += error + "<br/>";

    }

    if (errorStr != "") {
        alertify.warning(errorStr).delay(alertify_delay);
    }

    return permission;
}

function fillStagePreviousInfo(workFlowId, stageId, actionId) {
    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")
    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");
    getStageItemTypePreviousList(workFlowId, stageId, actionId);
}

function getStageItemTypePreviousList(workFlowId, stageId, actionId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/getPreviousStageFundItemTypeListByStageId/${workFlowId}/${stageId}/${actionId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            filStageItemTypePrevious(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function filStageItemTypePrevious(res) {
    if (res.length > 0) {
        var previous = res.filter(x => x.selectType == 1);
        var itemType = res.filter(x => x.selectType == 2);

        fillStagePrevious(previous);
        fillItemTypeList(itemType);
    }
}

function fillStagePrevious(data) {
    var output = ``;
    len = data.length;
    for (var i = 0; i < len; i++) {
        var prev = data[i];
        output += `<tr>
                       <td>${prev.id}</td>
                       <td>${prev.name}</td>
                  </tr>`
    }

    $("#stagePreviousList").html(output);

}

function fillItemTypeList(data) {
    var output = ``;
    len = data.length;
    for (var i = 0; i < len; i++) {
        var itemtype = data[i];
        output += `<tr>
                       <td>${itemtype.id}</td>
                       <td>${itemtype.name}</td>
                  </tr>`
    }

    $("#stageItemTypeList").html(output);
}
