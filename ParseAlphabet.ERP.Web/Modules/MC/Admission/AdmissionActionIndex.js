var stageActionLogCurrent = {};

function actionLogAdmission() {

    fillDropDownAction()

    let getListUrl = `/api/WF/StageActionLogApi/getsteplist/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workflowId}`

    $.ajax({
        url: getListUrl,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            $("#stepLogRowsAdmission").html("")
            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;

            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
                $("#stepLogRowsAdmission").append(trString);
            }

        },
        error: function (xhr) {
            error_handler(xhr, getListUrl);
        }
    });

}

function fillDropDownAction() {

    $("#actionDropDown").empty()

    fill_select2(`/api/WF/StageActionApi/getdropdownactionlistbystage`, "actionDropDown", true, `${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workflowId}/1/0/null/${stageActionLogCurrent.admissionMasterworkflowCategoryId}/true/null`, false, 3, "انتخاب");

    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change.select2")

}

async function update_actionAdmission() {


    var requestActionId = +$("#actionDropDown").val();
    var identityId = +stageActionLogCurrent.identityId;
    var stageId = +stageActionLogCurrent.stageId;
    var branchId = +stageActionLogCurrent.branchId;
    var workFlowId = +stageActionLogCurrent.workflowId;
    var workflowCategoryId = +workflowCategoryIds.medicalCare.id;


    if (requestActionId == +stageActionLogCurrent.actionId)
        return;


    var model = {
        requestActionId,
        stageId,
        branchId,
        identityId,
        workFlowId,
        workflowCategoryId,
    }

    let resultValidate = admissionValidateStageActionLog(model);
    
    if (resultValidate != undefined) {
        if (resultValidate.length == 0) {
            updateActionAdmission(model);
        }
        else {
            alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
            $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change");
        }
    }
}


function admissionValidateStageActionLog(model) {
    
    let outPut = '';
    let currentMedicalRevenue = getStepAction(model.workFlowId, model.stageId, +stageActionLogCurrent.actionId);
    let requestMedicalRevenue = getStepAction(model.workFlowId, model.stageId, model.requestActionId);
    let viewData_validateupdatestep_url = `/api/MC/AdmissionApi/validationadmissionservice/${stageActionLogCurrent.admissionMasterId}/${+stageActionLogCurrent.actionId}/${+stageActionLogCurrent.centralId}`

    if (+stageActionLogCurrent.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 2
        && requestMedicalRevenue.medicalRevenue == 1)) {
        alertify.warning("امکان برگشت مرجوع پذیرش وجود ندارد").delay(alertify_delay);
        return;
    }

    if (+stageActionLogCurrent.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 1
        && requestMedicalRevenue.medicalRevenue == 2)) {
        alertify.confirm('', "مرجوع پذیرش بیمار برگشت ندارد ; آیا از انجام آن اطمینان دارید ؟",
            function () {
                outPut = $.ajax({
                    url: viewData_validateupdatestep_url,
                    async: false,
                    cache: false,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(model),
                    success: function (result) {
                        
                        if (result.length == 0) {
                            updateActionAdmission(model);
                        }
                        else {
                            alertify.error(generateErrorString(result)).delay(alertify_delay);
                            $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change");
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, viewData_validateupdatestep_url);
                        return null;
                    }
                });
                
                
            },
            function () { var msg = alertify.error('انصراف از مرجوع'); msg.delay(alertify_delay); }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        outPut = $.ajax({
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
}

function getStepAction(workflowId, stageId, actionId) {

    let model = {
        workflowId: workflowId,
        stageId: stageId,
        actionId: actionId
    }

    let url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

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
function updateActionAdmission(model) {

    let viewData_updateAdmissionStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`

    if (model.requestActionId > 0) {
        loadingAsync(true, "update_action_btn");
        $.ajax({
            url: viewData_updateAdmissionStep_url,
            async: true,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {

                    alertify.success(result.statusMessage);

                    stageActionLogCurrent.actionId = model.requestActionId;

                    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change")

                    updatelastaction()
                        .then(() => {
                            actionLogAdmission()

                            modal_close("actionLogModalAdmission")
                            get_NewPageTableV1();

                            loadingAsync(false, "update_action_btn");
                        })

                }
                else {
                    $("#actionDropDown").val(stageActionLogCurrent.actionId).trigger("change")
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    loadingAsync(false, "update_action_btn");
                }
            },
            error: function (xhr) {
                loadingAsync(false, "update_action_btn");
                error_handler(xhr, viewData_updateTreasuryStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

async function updatelastaction() {

    let updatelastaction_url = `/api/MC/AdmissionApi/updatelastaction/${stageActionLogCurrent.admissionMasterId}/${stageActionLogCurrent.identityId}/${stageActionLogCurrent.currentActionId}/${stageActionLogCurrent.actionId}/${stageActionLogCurrent.patientId}`

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


