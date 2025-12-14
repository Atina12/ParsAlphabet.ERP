
var
    viewData_getNoSeriesId_url = `${viewData_baseUrl_GN}/NoSeriesLineApi/getnoseriesid`,
    viewData_insAccountDetail_url = `${viewData_baseUrl_FM}/AccountDetailApi/save`,
    viewData_validateupdatestep_url = `${viewData_baseUrl_FM}/NewTreasuryApi/validateupdatestep`,
    viewData_treasuryStageStep_url = `api/WF/StageActionApi/getaction`,
    viewData_document_Undo_PostingGroup_url = `${viewData_baseUrl_FM}/JournalLineApi/undopostgroup`,
    viewData_getTreasuryStageStepByTreasury = `${viewData_baseUrl_FM}/TreasuryStageActionApi/GetTreasuryStageActionByTreasury`,
    viewData_getJournalStageStepByTreasury = `${viewData_baseUrl_FM}/JournalActionApi/GetJournalStageActionByJournal`



function getMultipleSettlement(workflowId, stageId) {

    var url = `${viewData_baseUrl_WF}/StageActionApi/getmultiplesettlement`

    let model = {
        workflowId,
        stageId
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

function GetStageActionGetNext(model) {

    var url = `${viewData_baseUrl_WF}/StageActionApi/getstageactiongetnext`


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
function GetRoleWorkflowStageStepPermission(workflowId, stageId, actionId) {
    
    var url = `${viewData_baseUrl_GN}/RoleWorkflowPermissionApi/roleworkflowstagesteppermission`;


    let model = {
        workflowId,
        stageId,
        actionId
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
function getTreasuryStageActionConfig(treasuryId) {
    let outPut = $.ajax({
        url: viewData_getTreasuryStageStepByTreasury,
        data: JSON.stringify(treasuryId),
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
            error_handler(xhr, viewData_getTreasuryStageStepByTreasury);
            return null;
        }
    });

    return outPut.responseJSON;
}

function getJournalStageActionConfig(treasuryId) {

    let outPut = $.ajax({
        url: viewData_getJournalStageStepByTreasury,
        data: JSON.stringify(treasuryId),
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
            error_handler(xhr, viewData_getJournalStageStepByTreasury);
            return null;
        }
    });

    return outPut.responseJSON;
}

async function getStageStep(model) {

    let output = await $.ajax({
        url: viewData_treasuryStageStep_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_treasuryStageStep_url);
            return null;
        }
    });

    return output;

}

function checkAccessGLSGL(glId, sglId) {

    let url = `${viewData_baseUrl_FM}/AccountSGLUserLineApi/checkaccess`;

    let modelCheckAccess = {
        accountGLId: glId,
        AccountSGLId: sglId
    }

    let outPut = $.ajax({
        url: url,
        data: JSON.stringify(modelCheckAccess),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            return res;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return outPut.responseJSON;

}

function addAccountDetail(accountDetailId, tbName, getRecordUrl, detailIdName, detailName, isActive, dataJson, callback = undefined) {
    
    var checkExist = getJsonData(`${viewData_baseUrl_FM}/AccountDetailApi/checkexistaccountdetail/2`, 'json', accountDetailId).responseJSON;
    
    //if (checkExist !== 3) {
    //    var msg = alertify.error("کد تفصیل در سیستم موجود می باشد");
    //    msg.delay(alertify_delay);
    //    return;
    //}

    var modelAjax = {
        apiUrl: viewData_getNoSeriesId_url,
        type: "post",
        dataType: "text",
        contentType: "application/json",
        data: tbName,
        isAsync: false,
        cache: false,
        failValue: 0
    }

    var noSeriesId = +callApi(modelAjax).responseText;

    if (noSeriesId == 0 || isNaN(noSeriesId)) {
        var msg = alertify.error("تنظیمات کدینگ تفصیل مشخص نشده به مدیر سیستم اطلاع دهید");
        msg.delay(alertify_delay);
        return;
    }

    getJsonDataAsync(getRecordUrl, 'json', accountDetailId, -1).then((response) => {
        if (response != null) {
            
            var detailModel = response.data;
            dataJson = response.data.jsonAccountDetailList;
            var accDetailModel = {
                id: detailModel[detailIdName],
                name: detailModel[detailName],
                noSeriesId: noSeriesId,
                dataJson: dataJson,
                isActive: detailModel[isActive]
            }

            var result = getJsonDataAsync(viewData_insAccountDetail_url, 'json', accDetailModel, { successfull: false }).then((res) => {
                if (res.successfull) {
                    var msg = alertify.success("ثبت کد تفصیل با موفقیت انجام شد");
                    msg.delay(alertify_delay);

                    if (callback !== undefined)
                        callback();

                    return;
                }
                else {
                    var msg = alertify.error("ثبت کد تفصیل با خطا مواجه شد");
                    msg.delay(alertify_delay);
                    return;
                }
            });
        }
    });

}

async function accountDetail_getName(id) {

    let output = await $.ajax({
        url: `${viewData_baseUrl_FM}/AccountDetailApi/getname`,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/AccountDetailApi/getname`)
            return null;
        }
    });

    return output;
}

function hasPostGroup(model) {


    let url = `${viewData_baseUrl_FM}/JournalLineApi/haspostgroup`;

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

function undoDocPostingGroup(model, getType, callback = undefined, callbackSuccses = undefined, callbackError = undefined) {

    $.ajax({
        url: viewData_document_Undo_PostingGroup_url,
        type: "post",
        dataType: "json",
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {


           
            if (result.successfull) {

                if (typeof callbackSuccses != "undefined")
                    callbackSuccses(model, getType);
                alertify.success("حذف سند با موفقیت انجام شد").delay(alertify_delay);


            }
            else {
                alertify.error(result.statusMessage).delay(alertify_delay);
                if (typeof callbackError != "undefined")
                    callbackError();
            }

            if (typeof callback != "undefined")
                callback(result.successfull);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_document_Undo_PostingGroup_url);
            if (typeof callbackError != "undefined")
                callbackError();
        }
    });
}

function sendDocPostingGroup(viewModel, callback = undefined, callbackSuccses = undefined, callbackError = undefined) {

    $.ajax({
        url: viewModel.url,
        type: "post",
        dataType: "json",
        data: JSON.stringify(viewModel.model),
        contentType: "application/json",
        success: function (result) {
            
            if (result.results != null) {

                if (typeof callback != "undefined")
                    callback(result.successfull);

                if (result.successfull) {
                    if (typeof callbackSuccses != "undefined")
                        callbackSuccses();

                    alertify.success("ثبت سند با موفقیت انجام شد").delay(alertify_delay);
                }
                else {
                    if (typeof callbackError != "undefined")
                        callbackError();

                    appendresultTable(result.results);
                }

            }
            else {
                var alrtPost = new alertify.warning("ثبت با خطا مواجه شد");
                alrtPost.delay(alertify_delay);
                if (typeof callbackError != "undefined")
                    callbackError();

            }
        },
        error: function (xhr) {
            error_handler(xhr, viewModel.url);
            if (typeof callbackError != "undefined")
                callbackError();
        }
    });
}

function appendresultTable(result) {
    
    if (result.length != 0) {
        $("#tempPostingGroupError").html("");

        let output = "", itemError = {};
        itemError = result[0].validationErrors;
        
        for (var i = 0; i < result.length; i++) {
            if (!result[i].successfull && checkResponse(result[i].statusMessage))
                output += `<tr><td>${result[i].statusMessage}</td></tr>`;
        }
        if (itemError.length > 0) 
            output += `<tr><td>${generateErrorString(itemError)}</td></tr>`;


        $(output).appendTo("#tempPostingGroupError");
        modal_show(`errorPostingGroupResult`);
        return
    }
    else
        alertify.warning("موردی وجود ندارد").delay(alertify_delay);
}



function setGlSglInfo(model, isRequest, noSeriesId) {

    $.ajax({
        url: `${viewData_baseUrl_FM}/PostingGroupApi/getglsgl`,
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {

            if (typeof result !== "undefined" && result != null) {

                $(`#accountGLId`).val(result.accountGLId == 0 ? "" : `${result.accountGLId} - ${result.accountGLName}`);
                $(`#accountGLId`).data("value", result.accountGLId);
                $(`#accountSGLId`).val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $(`#accountSGLId`).data("value", result.accountSGLId);
                $(`#noSeriesId`).data("value", result.noSeriesId);

                if (result.accountGLId !== 0 && result.accountSGLId !== 0 && result.accountDetailId !== 0)
                    fillAccountDetail(isRequest, result.accountDetailId, result.accountDetailRequired, noSeriesId);


            }
            else {

                $("#accountGLId").val("");
                $("#accountGLId").data("value", 0);
                $("#accountSGLId").val("");
                $("#accountSGLId").data("value", 0);
                $("#accountDetailId").removeAttr("data-parsley-selectvalzero");
                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", true).val(0).trigger("change");

            }


        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`);
        }
    });

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

function getBrandNamebyaccountDetailId(accountDetailId) {

    let url = `${viewData_baseUrl_FM}/AccountDetailApi/getbrandname`;
    $.ajax({
        url: url,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({ accountDetailId: +accountDetailId }),
        success: function (result) {
            if (checkResponse(result) && result != "")
                $('#brandName').val(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return true;
}

function printDocumentTreasury(stageClass, inOut, id, reportTitle) {

    if (stageClass == 1) {
        let reportParameters = [{ Item: "TreasuryId", Value: id, SqlDbType: dbtype.BigInt, Size: 0 }, { Item: "StageClassId", Value: stageClass, SqlDbType: dbtype.Int, Size: 0 }],
            reportModel = {
                reportName: reportTitle,
                reportUrl: `${stimulsBaseUrl.FM.Prn}RequestReceiveMoney.mrt`,
                parameters: reportParameters,
                reportSetting: reportSettingModel
            };

        window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
    }
    else if (stageClass == 3) {
        let reportParameters = [{ Item: "TreasuryId", Value: id, SqlDbType: dbtype.BigInt, Size: 0 }, { Item: "StageClassId", Value: stageClass, SqlDbType: dbtype.Int, Size: 0 }],
            reportModel = {
                reportName: reportTitle,
                reportUrl: `${stimulsBaseUrl.FM.Prn}TreasuryPaymentReceipt.mrt`,
                parameters: reportParameters,
                reportSetting: reportSettingModel
            };

        window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
    }
    else {
        var msg = alertify.warning('هیچ گونه چاپی برای این سطر تعیین نشده است.');
        msg.delay(alertify_delay);
    }
}

function validateBeforSendTreasury(model) {

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

function GetnoSeriesListWhitGlSgl(model, workflowCategoryId) {

    $.ajax({
        url: `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`,
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {
            $("#accountGLId").val("");
            $("#accountSGLId").val("");
            $("#noSeriesId").val("");
            $("#accountDetailId").val("");
            
            $("#accountGLId").prop("disabled", true);
            $("#accountSGLId").prop("disabled", true);
            $("#noSeriesId").prop("disabled", true);
            $("#accountDetailId").prop("disabled", true);
           

            if (typeof result !== "undefined" && result != null) {
                $("#accountGLId").val(+result.accountGLId == 0 ? "" : `${+result.accountGLId} - ${result.accountGLName}`);
                $("#accountGLId").data("value", result.accountGLId);

                $("#accountSGLId").val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $("#accountSGLId").data("value", result.accountSGLId);


                $("#accountGLId").attr("required", true);
                $("#accountGLId").attr("data-parsley-selectvalzero", true);
                $("#accountSGLId").attr("required", true);
                $("#accountSGLId").attr("data-parsley-selectvalzero", true);

                fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                $("#noSeriesId").prop("disabled", false).prop("required", true);
                $("#noSeriesId").trigger("change");
            }
            else 

                $("#noSeriesId").prop("disabled", false).prop("required", true);


        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`);
        }
    });

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

function getTreasuryRequestInfo(id, workflowCategoryId) {

    let url = "";

    if (workflowCategoryId == 1) {
        url = "/api/PU/PurchaseOrderApi/getinfo";
    }
    else {
        url = "/api/FM/TreasuryRequestApi/getinfo";
    }


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