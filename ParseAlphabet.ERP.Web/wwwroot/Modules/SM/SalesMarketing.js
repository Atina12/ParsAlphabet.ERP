var viewData_personOrderStepList_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/getpurchaseordersteplist`;
var viewData_updatePersonOrderStep_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`;
var viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`;
var viewData_personOrderStageStep_url = `/api/WF/StageActionApi/getaction`;

var viewData_document_PostingGroup_url = `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`;




function reset_amountFields() {
    $("#grossAmount").val(0);
    $("#discountValue").val(0);
    $("#discountType").val(0);
    $("#price").val(0);
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#netAmountPlusVAT").val(0);
}




function run_button_showStepLogs(id, rowno) {
    var stageId = +$(`#parentPageTableBody tbody tr#row${rowno}`).data("stageid");
    $(`#action`).empty();
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "action", true, `${stageId}/1`);
    var currentActionId = +$(`#parentPageTableBody tbody tr#row${rowno}`).data("actionid");
    $(`#action`).val(currentActionId).trigger("change");
    stepLog(id);
    modal_show("stepLogModal");
}

$("#stepLogModal").on("shown.bs.modal", function () {
    $("#action").focus();
});

function stepLog(id) {

    $("#stepLogRows").html("");

    $.ajax({
        url: viewData_personOrderStepList_url,
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
                $("#stepLogRows").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_personOrderStepList_url);
        }
    });
}

function fillStagePreviousInfo(workFlowId, stageId, actionId) {
    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")
    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");
    getStageItemTypePreviousList(workFlowId, stageId, actionId);
}

function getStageItemTypePreviousList(workFlowId,stageId, actionId) {
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


async function getStageStep(model) {
  
    let output = await $.ajax({
        url: viewData_personOrderStageStep_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_personOrderStageStep_url);
            return null;
        }
    });

    return output;
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







