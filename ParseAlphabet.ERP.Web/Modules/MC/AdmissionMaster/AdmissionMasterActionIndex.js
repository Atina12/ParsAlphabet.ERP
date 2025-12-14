
var stageActionLogCurrentMaster = {};

function actionLogAdmissionMaster() {

    fillDropDownAction()

    stepLogAdmissionMasterList()

}

function fillDropDownAction() {

    $("#actionDropDownMaster").empty()

    fill_select2(`/api/WF/StageActionApi/getdropdownactionlistbystage`, "actionDropDownMaster", true, `${stageActionLogCurrentMaster.stageId}/${stageActionLogCurrentMaster.workflowId}/1/0/null/14/true/null`, false, 3, "انتخاب",
        () => {
            $("#actionDropDownMaster").val(stageActionLogCurrentMaster.actionId).trigger("change.select2")
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

function stepLogAdmissionMasterList() {

    let getListUrl = `/api/WF/StageActionLogApi/getsteplist/${stageActionLogCurrentMaster.admissionMasterId}/${stageActionLogCurrentMaster.stageId}/${stageActionLogCurrentMaster.workflowId}`

    $.ajax({
        url: getListUrl,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            buildActionLogAdmissionMasterList(result)
        },
        error: function (xhr) {
            error_handler(xhr, getListUrl);
        }
    });
}

function buildActionLogAdmissionMasterList(result) {

    $("#stepLogRowsAdmissionMaster").html("")
    var dataList = result.data;
    var listlen = dataList == null ? 0 : dataList.length, trString;

    if (listlen != 0) {
        for (var i = 0; i < listlen; i++) {
            var data = dataList[i];
            trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
            $("#stepLogRowsAdmissionMaster").append(trString);
        }
    }
    else {
        $("#stepLogRowsAdmissionMaster").html(`<tr id="emptyRow"><td colspan="3" class="text-center">سطری وجود ندارد</td></tr>`);
    }

}

function update_actionAdmissionMaster() {


    var requestActionId = +$("#actionDropDownMaster").val();
    var identityId = +stageActionLogCurrentMaster.admissionMasterId;
    var stageId = +stageActionLogCurrentMaster.stageId;
    var branchId = +stageActionLogCurrentMaster.branchId;
    var workFlowId = +stageActionLogCurrentMaster.workflowId;
    var workflowCategoryId = 14 //+workflowCategoryIds.medicalCare.id;
    var admissionMasterId = +stageActionLogCurrentMaster.admissionMasterId;

    if (requestActionId == +stageActionLogCurrentMaster.actionId)
        return;

    var model = {
        requestActionId,
        stageId,
        branchId,
        identityId,
        workFlowId,
        workflowCategoryId,
        admissionMasterId
    }


    loadingAsync(true, "update_action_master_btn");
    let resultValidate = admissionMasterValidateStageActionLog(model);

    if (resultValidate.length == 0)
        updateActionAdmission(model);
    else {
        alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
        $("#actionDropDownMaster").val(stageActionLogCurrentMaster.actionId).trigger("change");

        loadingAsync(false, "update_action_master_btn");
    }

}

function admissionMasterValidateStageActionLog(model) {

    let viewData_validateupdatestep_url = `/api/MC/AdmissionMasterApi/validationadmissionmaster`


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

function updateActionAdmission(model) {

    let viewData_updateAdmissionStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`

    var checkvalidation = checkValidation(model.admissionMasterId,true);
    if (checkvalidation) {
        var msg = alertify.warning("امکان ترخیص گام وجود ندارد");
        msg.delay(admission.delay);
        return;
    }


    if (model.requestActionId > 0) {

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
                    get_NewPageTableV1();
                    stageActionLogCurrentMaster.actionId = model.requestActionId;

                    $("#actionDropDownMaster").val(stageActionLogCurrentMaster.actionId).trigger("change")

                    updatelastactionMaster()
                        .then(() => {

                            stepLogAdmissionMasterList()

                            loadingAsync(false, "update_action_master_btn");
                        })
                        .catch(err => {
                            loadingAsync(false, "update_action_master_btn")
                        })

                }
                else {
                    $("#actionDropDownMaster").val(stageActionLogCurrentMaster.actionId).trigger("change")
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    loadingAsync(false, "update_action_master_btn");
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateTreasuryStep_url);

                loadingAsync(false, "update_action_master_btn");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);

        loadingAsync(false, "update_action_master_btn");
    }

}

async function updatelastactionMaster() {


    let updatelastaction_url = `/api/MC/AdmissionMasterApi/updatelastaction/${stageActionLogCurrentMaster.admissionMasterId}/${stageActionLogCurrentMaster.actionId}`

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


