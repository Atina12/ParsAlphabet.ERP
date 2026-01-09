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

function checkHeaderDeletePermission(model) {

    let url = "/api/PU/PurchaseOrderActionApi/validatedeletestep"

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

function fillStagePreviousInfo(workFlowId, stageId, actionId) {
    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")
    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");
    getStageItemTypePreviousList(workFlowId, stageId, actionId);
}

function getStageItemTypePreviousList(workFlowId, stageid, actionId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/getPreviousStageFundItemTypeListByStageId/${workFlowId}/${stageid}/${actionId}`;

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


async function fillAccountDetail(isRequest, value = null, isRequiredaccountDetail, noSeriesId, existLineCount) {

    var model = {
        id: value,
        noSeriesId: noSeriesId
    };

    let url = `${viewData_baseUrl_FM}/AccountSGLApi/getaccountdetailbygl`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            if (result) {
                var data = result.map(function (item) {
                    return {
                        id: item.id, text: `${item.id} - ${item.name}`
                    };
                });

                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).select2({
                    templateResult: function (item) {
                        if (item.loading)
                            return item.text;

                        var term = query.term || '';
                        var $result = markMatch(item.text, term);
                        return $result;
                    },
                    language: {
                        searching: function (params) {
                            query = params;
                            return 'در حال جستجو...';
                        }
                    },
                    placeholder: "انتخاب کنید...",
                    data: data,
                    closeOnSelect: true,
                    allowClear: true,
                    escapeMarkup: function (markup) {
                        return markup;
                    }
                });


                let accountDetailExistVal = +$("#accountDetailId").data("value");
                accountDetailExistVal = typeof accountDetailExistVal !== "undefined" ? +$("#accountDetailId").data("val") : accountDetailExistVal;

                if (accountDetailExistVal != null && accountDetailExistVal != undefined && !isNaN(accountDetailExistVal))
                    $("#accountDetailId").val(accountDetailExistVal).trigger("change.select2");
                else
                    $("#accountDetailId").val(value ?? 0).trigger("change.select2");

                if (isRequest) {
                    $("#noSeriesId").prop("disabled", true);
                    $("#accountDetailId").prop("required", false);
                    $("#accountDetailId").removeAttr("data-parsley-selectvalzero");
                    $("#accountDetailId").prop("disabled", true);
                    $("#accountDetailId").prop("required", true);
                    $("#accountDetailId").attr("data-parsley-selectvalzero", "");

                }
                else {


                    if (isRequiredaccountDetail == 3) {//ندارد
                        $("#noSeriesId").prop("disabled", true);
                        $("#noSeriesId").removeData("parsley-required-message");
                        $("#noSeriesId").prop("required", false);
                        $("#noSeriesId").removeAttr("data-parsley-selectvalzero");

                        $("#accountDetailId").prop("disabled", true);
                        $("#accountDetailId").removeData("parsley-required-message");
                        $("#accountDetailId").prop("required", false);
                        $("#accountDetailId").removeAttr("data-parsley-selectvalzero");


                    }
                    else if (isRequiredaccountDetail == 1) {//اجباری
                        $("#noSeriesId").prop("disabled", false);
                        $("#noSeriesId").data("parsley-required-message", "تفصیل اجباری است");
                        $("#noSeriesId").prop("required", true);
                        $("#noSeriesId").attr("data-parsley-selectvalzero", "");

                        $("#accountDetailId").prop("disabled", false);
                        $("#accountDetailId").data("parsley-required-message", "تفصیل اجباری است");
                        $("#accountDetailId").prop("required", true);
                        $("#accountDetailId").attr("data-parsley-selectvalzero", "");

                    }
                    else {//اختیاری

                        $("#noSeriesId").prop("disabled", false);
                        $("#noSeriesId").removeData("parsley-required-message");
                        $("#noSeriesId").prop("required", false);
                        $("#noSeriesId").removeAttr("data-parsley-selectvalzero");

                        $("#accountDetailId").prop("disabled", false);
                        $("#accountDetailId").removeData("parsley-required-message");
                        $("#accountDetailId").prop("required", false);
                        $("#accountDetailId").removeAttr("data-parsley-selectvalzero");

                    }


                }

                if (existLineCount) {// ویرایش در صورت داشتن لاین
                    $("#noSeriesId").prop("disabled", true);
                    $("#accountDetailId").prop("disabled", true);
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return true;
}