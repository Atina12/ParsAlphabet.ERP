var viewData_form_title = "ورود به اتاق",
    viewData_controllername = "AdmissionCartableApi",
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}AdmissionInbound.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_Admission_Service = `${viewData_baseUrl_MC}/AdmissionApi/admissionservicelinelist`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/AdmissionApi/getrecordbyid`,
    isSecondLang = true, switchTimer = "off", timer = "", minutes = 0, seconds = 0, printUrl = "", rowNumberAdmission = 0,
    lastFormKeyValue = [], firstGetPage = true,
    selectLineInfo = [], actionErr = [], saveCurrentTabAction = null, isSetActionAccess = true;


var form3 = $('#filterInputBox').parsley()

async function initForminboundl() {

    var interval = null;
    clearInterval(interval);

    $("#stageId").select2()
    $("#workflowId").select2()
    $("#isSettled").select2()

    $(".tab-content").show();
    $("#toWorkDayDatePersian,#fromWorkDayDatePersian").val(getTodayPersianDate());

    kamaDatepicker('fromWorkDayDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toWorkDayDatePersian', { withTime: false, position: "bottom" });



    inputMask();
    inboundLoadDropdown()
    timerInbound();

    setTimeout(() => {
        $('#attenderId').select2('focus');
    }, 1000)
}

function inboundLoadDropdown() {

    $("#attenderId,#patientId,#branchId,#workflowId,#stageId").empty()

    var brachOption = new Option("انتخاب کنید", 0, true, true);
    $("#branchId").append(brachOption)

    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");
    fill_select2("api/MC/PatientApi/filter/2", "patientId", true, 0, true, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`${viewData_baseUrl_GN}/branchApi/getdropdown`, "branchId", true, "", false, 3, "");

    var workflowOption = new Option("انتخاب کنید", 0, true, true);
    $("#workflowId").append(workflowOption)
    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `0/10,14/17,22`, false, 3, "");


    var stageOption = new Option("انتخاب کنید", 0, true, true);
    $("#stageId").append(stageOption);

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/null/10,14/17,22,28/0/1`, false, 3, "");


}

function configCartablePageTable(pg_id) {

    get_NewPageTable(pg_id, false, () => {

        $(`#${pg_id} .filterBox`).html("");
        $(`#${pg_id} .filterBox`).removeClass("col-lg-7").removeClass("col-md-7").addClass("col-md-12")
        $(`#${pg_id} .filterBox`)
            .append(`
                        <div class="d-flex justify-content-end mb-2 step-app">
                            <div class="ml-2"><button class="step-btn waves-effect" onclick=runButtonPreviousOrNextActionSelect('${pg_id}',1)>قبلی</button></div>
                            <div><button class="step-btn waves-effect" onclick=runButtonPreviousOrNextActionSelect('${pg_id}',2)>بعدی</button></div>
                        </div>
            
                    `);

        ` onclick="multiChangeState('IN') onclick="multiChangeState('OUT')`
    })
}

function run_button_previousAction(admissionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return

    runButtonPreviousOrNextAction(admissionId, rowNo, elm, e, 1)
}

function run_button_nextAction(admissionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    runButtonPreviousOrNextAction(admissionId, rowNo, elm, e, 2)
}

function runButtonPreviousOrNextAction(admissionId, rowNo, elm, e, direction) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    let element = $(elm).parent().parent()
    let branchId = element.data("branchid")
    let centralId = element.data("centralid") == null ? 0 : element.data("centralid")
    let workflowId = element.data("workflowid")
    let stageId = element.data("stageid")
    let admissionWorkflowCategoryId = element.data("admissionworkflowcategoryid")
    let workflow = element.data("workflow")
    let stage = element.data("stage")
    let admissionMasterId = element.data("admissionmasterid")
    let patientId = element.data("patientid")
    let actionId = +element.parents(".card-body").prop("id").split("_")[2]

    let model = {
        direction,
        admissionId,
        branchId,
        workflowId,
        stageId,
        admissionWorkflowCategoryId,
        actionId,
        currentActionId: actionId,
        admissionMasterId,
        patientId
    }

    let previousActionUrl = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdateactioncartable`
    loaderOnPageTable(true, "tabBoxByAction")
    $.ajax({
        url: previousActionUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            loaderOnPageTable(false, "tabBoxByAction")

            if (result.successfull)
                selectActionsConfig(result.actionList, model.patientId, model.admissionId, model.workflowId, model.stageId, model.admissionWorkflowCategoryId, model.branchId, model.actionId, workflow, stage, model.admissionMasterId, centralId)
            else
                alertify.error(result.statusMessage).delay(admission.delay);
        },
        error: function (xhr) {
            error_handler(xhr, previousActionUrl);
        }
    });
}

function selectActionsConfig(actionList, patientId, admissionId, workflowId, stageId, admissionWorkflowCategoryId, branchId, actionId, workflow, stage, admissionMasterId, centralId) {

    let str = ""

    if (actionList.length > 1) {

        str +=
            `<tr class="highlight" data-admissionid="${admissionId}" data-centralid="${centralId}" data-workflowid="${workflowId}" data-branchid="${branchId}" data-admissionmasterid=${admissionMasterId} data-admissionworkflowcategoryid="${admissionWorkflowCategoryId}"  data-stageid="${stageId}" data-previousactionid="${actionId}">
                 <td style="text-align:center">1</td>
                 <td>${admissionId}</td>
                 <td>${workflow}</td>
                 <td>${stage}</td>
                 <td><div class="btn-group btn-group-toggle" data-toggle="buttons">
             `

        for (let i = 0; i < actionList.length; i++) {
            str += `<label class="btn btn-light ml-2" onclick="setAction('actionsModalTable',this,event,${actionList[i].id},${actionId},${patientId})" style="cursor:pointer;text-wrap: nowrap;">
                         <input type="radio" name="options" id="option1" checked="" style="font-size:11px !important" > 
                         <span>${actionList[i].text}</span>
                    </label>
                `
        }

        str += `</div></td></tr>`

        $("#actionModalTable").html(str)
        $("#actionModalTable #actionId1").addClass("highlight");
        modal_show("actionModal")
    }
    else
        updateActionAdmission(actionList[0].id, actionId, patientId, admissionId, workflowId, stageId, admissionWorkflowCategoryId, branchId, admissionMasterId, centralId)
}

function setAction(modalName, elm, e, actionId, currentActionId, patientId) {

    let trParent = $(elm).parent().parent().parent()
    let admissionId = trParent.data("admissionid")
    let centralId = trParent.data("centralid")
    let workflowId = trParent.data("workflowid")
    let stageId = trParent.data("stageid")
    let branchId = trParent.data("branchid")
    let admissionMasterId = trParent.data("admissionmasterid")

    let admissionWorkflowCategoryId = trParent.data("admissionworkflowcategoryid")

    updateActionAdmission(actionId, currentActionId, patientId, admissionId, workflowId, stageId, admissionWorkflowCategoryId, branchId, admissionMasterId, centralId)
}

async function updateActionAdmission(actionId, currentActionId, patientId, admissionId, workFlowId, stageId, admissionWorkflowCategoryId, branchId, admissionMasterId, centralId) {

    var model = {
        currentActionId: currentActionId,
        requestActionId: actionId,
        patientId: patientId,
        stageId,
        branchId,
        identityId: admissionId,
        workFlowId,
        workflowCategoryId: admissionWorkflowCategoryId,
        admissionMasterId,
        centralId
    }

    if (isSetActionAccess) {
        isSetActionAccess = false

        let resultValidate = await admissionValidateStageActionLog(model);
        if (resultValidate != null) {
            if (resultValidate.length == 0)
                updateStatusAdmission(model);
            else {
                alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                modal_close("actionModal")
                isSetActionAccess = true
            }
        }
    }


}

function updateStatusAdmission(model, theLast = null) {

    let viewData_updateAdmissionStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`
    
    $.ajax({
        url: viewData_updateAdmissionStep_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {
                if (theLast == null) {
                    alertify.success(result.statusMessage).delay(alertify_delay);
                    updatelastaction(model.requestActionId, model.identityId, null, model.admissionMasterId, model.currentActionId, model.patientId)
                }
                else
                    updatelastaction(model.requestActionId, model.identityId, theLast, model.admissionMasterId, model.currentActionId, model.patientId)
            }
            else {

                if (theLast == null) {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    isSetActionAccess = true

                }
                else {
                    actionErr.push({
                        admissionId: model.identityId,
                        err: generateErrorString(result.validationErrors)
                    })
                    if (theLast)
                        showActionErrors()

                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_updateTreasuryStep_url);
            isSetActionAccess = true
        }
    });
}

async function admissionValidateStageActionLog(model) {

    let currentMedicalRevenue = getStepAction(model.workFlowId, model.stageId, model.currentActionId);
    let requestMedicalRevenue = getStepAction(model.workFlowId, model.stageId, model.requestActionId);
    let viewData_validateupdatestep_url = `/api/MC/AdmissionApi/validationadmissionservice/${model.admissionMasterId}/${model.currentActionId}/${model.centralId}`

    if (model.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 2
        && requestMedicalRevenue.medicalRevenue == 1)) {
        alertify.warning("امکان برگشت مرجوع پذیرش وجود ندارد").delay(alertify_delay);
        return;
    }

    if (model.centralId > 0 && (currentMedicalRevenue.medicalRevenue == 1
        && requestMedicalRevenue.medicalRevenue == 2)) {
        alertify.confirm('', "مرجوع پذیرش بیمار برگشت ندارد ; آیا از انجام آن اطمینان دارید ؟",
            function () {
                var promise = new Promise(function (resolve, reject) {

                    $.ajax({
                        url: viewData_validateupdatestep_url,
                        cache: false,
                        type: "post",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(model),
                        success: function (result) {
                            if (result.length == 0)
                                updateStatusAdmission(model);
                            else {
                                alertify.error(generateErrorString(result)).delay(alertify_delay);
                                modal_close("actionModal")
                                isSetActionAccess = true
                            }
                        },
                        error: function (xhr) {
                            reject(null)
                            error_handler(xhr, viewData_validateupdatestep_url);
                        }
                    });
                });

            },
            function () { var msg = alertify.error('انصراف از مرجوع'); msg.delay(alertify_delay); }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
    else {
        var promise = new Promise(function (resolve, reject) {

            $.ajax({
                url: viewData_validateupdatestep_url,
                cache: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (result) {
                    resolve(result)
                },
                error: function (xhr) {
                    reject(null)
                    error_handler(xhr, viewData_validateupdatestep_url);
                }
            });
        });
        return promise;

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

function updatelastaction(actionId, identityId, theLast, admissionMasterId, currentActionId, patientId) {

    let updatelastaction_url = `/api/MC/AdmissionApi/updatelastaction/${admissionMasterId}/${identityId}/${currentActionId}/${actionId}/${patientId}`

    $.ajax({
        url: updatelastaction_url,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            if (theLast == null) {
                $("#refreshPagetable").click();
                modal_close("actionModal")
                modal_close("actionsModal")
                isSetActionAccess = true
            }
            else {
                if (theLast) {
                    $("#refreshPagetable").click();
                    showActionErrors()
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, updatelastaction_url);
            isSetActionAccess = true
        }
    });
}

function newTrOnclick(row) {

    $(`#actionModal .highlight`).removeClass("highlight");
    $(`#actionModal #actionId${row}`).addClass("highlight");

    $(`#actionsModal .highlight`).removeClass("highlight");
    $(`#actionsModal #actionIds${row}`).addClass("highlight");
}

function runButtonPreviousOrNextActionSelect(pg_id, direction) {

    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    if (index == -1)
        return


    let selectedItems = arr_pagetables[index].selectedItems
    if (selectedItems.length == 0) {
        alertify.warning("حداقل یک سطر را انتخاب کنید").delay(admission.delay);
        return
    }


    let model = []
    let actionId = +pg_id.split("_")[2]
    selectLineInfo = []
    actionErr = []

    for (let i = 0; i < selectedItems.length; i++) {


        selectLineInfo.push({
            direction,
            admissionId: +selectedItems[i].id,
            branchId: +selectedItems[i].branchid,
            workflowId: +selectedItems[i].workflowid,
            admissionMasterId: +selectedItems[i].admissionmasterid,
            stageId: +selectedItems[i].stageid,
            actionId: null,
            currentActionId: actionId,
            patientId: +selectedItems[i].patientid,
            centralId: selectedItems[i].centralid == 'null' ? 0 : +selectedItems[i].centralid,
        })

        model.push({
            direction,
            branchId: +selectedItems[i].branchid,
            workflowId: +selectedItems[i].workflowid,
            stageId: +selectedItems[i].stageid,
            actionId
        })
    }

    
    model = _.uniqWith(model, (a, b) => a.stageId == b.stageId && a.workflowId == b.workflowId && a.branchId == b.branchId)

    let previousActionUrl = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdatebulkactioncartable`
    loaderOnPageTable(true, "tabBoxByAction")


    $.ajax({
        url: previousActionUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (checkResponse(result))
                buildActionListModal(result, selectLineInfo.patientId)
            else {
                loaderOnPageTable(false, "tabBoxByAction")
                alertify.error("خطای سیستمی دوباره تلاش کنید").delay(admission.delay);
            }


        },
        error: function (xhr) {
            error_handler(xhr, previousActionUrl);
        }
    });
}

function buildActionListModal(result, patientId) {

    let actionListInfo = []

    for (let i = 0; i < result.length; i++) {
        actionListInfo.push({
            actionList: result[i].actionList,
            workflowId: result[i].workflowId,
            workflowName: result[i].workflowName,
            stageId: result[i].stageId,
            stageName: result[i].stageName,
            branchId: result[i].branchId,
            patientId: result[i].patientId,
            statusMessage: result[i].statusMessage,
            successfull: result[i].successfull
        })
    }

    //allUnsuccessfull
    actionErr = []
    for (let i = 0; i < actionListInfo.length; i++) {
        let info = actionListInfo[i]
        if (!info.successfull) {
            for (let j = 0; j < selectLineInfo.length; j++) {
                let lineInfo = selectLineInfo[j]
                if (info.stageId == lineInfo.stageId && info.workflowId == lineInfo.workflowId) {
                    actionErr.push({
                        admissionId: lineInfo.admissionId,
                        err: info.statusMessage
                    })
                }
            }
        }
    }

    if (actionErr.length != 0) {
        loaderOnPageTable(false, "tabBoxByAction")
        showActionErrors()
        actionErr = []
        return
    }

    let checkAllActionsBeSame = true
    let lastActionList = actionListInfo[0].actionList

    if (lastActionList == null)
        checkAllActionsBeSame = actionListInfo.every(item => item.actionList == lastActionList)
    else if (lastActionList.length > 1)
        checkAllActionsBeSame = false
    else {
        for (let i = 0; i < actionListInfo.length; i++) {
            let actionList = actionListInfo[i].actionList

            if (actionList == null) {
                checkAllActionsBeSame = false
                break
            }
            else if (actionList.length != lastActionList.length) {
                checkAllActionsBeSame = false
                break
            }
            else if (actionList[0].id != lastActionList[0].id) {
                checkAllActionsBeSame = false
                break
            }
        }
    }

    if (checkAllActionsBeSame && checkResponse(lastActionList))
        modal_saveActions(null, null, lastActionList[0].id)
    else
        selectAllActionsConfig(actionListInfo)

}

function selectAllActionsConfig(actionListInfo) {

    loaderOnPageTable(false, "tabBoxByAction")
    loadingAsync(false, "modal_saveActions", "fa fa-check-circle");

    $("#modal_saveActions").prop("disabled", false)
    $("#actionsModal #modal-close").prop("disabled", false)

    $("#actionsModalTable").html("")

    let str = ""

    for (let i = 0; i < actionListInfo.length; i++) {

        let countAdmissison = selectLineInfo.filter((item) => item.workflowId == actionListInfo[i].workflowId && item.stageId == actionListInfo[i].stageId).length
        let lastBtnInRow = {}

        str = `<tr id="actionIds${i + 1}" onclick="newTrOnclick(${i + 1})" 
                        onkeydown="tr_onkeydownDisplay(${i + 1},this,event)"
                        data-workflowid="${actionListInfo[i].workflowId}" 
                        data-stageid="${actionListInfo[i].stageId}"
                        tabindex="-1"
                        >

                    <td style="text-align:center">${i + 1}</td>
                    <td>${actionListInfo[i].workflowId} - ${actionListInfo[i].workflowName}</td>
                    <td>${actionListInfo[i].stageId} - ${actionListInfo[i].stageName}</td>
                    <td>${countAdmissison}</td>
                `

        if (checkResponse(actionListInfo[i].actionList)) {
            str += `<td><div class="btn-group btn-group-toggle" data-toggle="buttons">`
            let currentActionList = actionListInfo[i].actionList

            for (let j = 0; j < currentActionList.length; j++) {
                str += `<label id="actionIds${i + 1}_action${j + 1}" class="btn btn-light ml-2" style="cursor:pointer;text-wrap: nowrap;" onclick="setActions(${i + 1},${currentActionList[j].id},event)">
                            <input type="radio" name="options" id="option1" checked="" style="font-size:11px !important" > 
                            <span>${currentActionList[j].text}</span>
                        </label>
                `

                if (currentActionList[j + 1] == undefined)
                    lastBtnInRow = `#actionIds${i + 1}_action${j + 1}`

            }
            str += "</div></td>"
        }
        else
            str += `<td style="text-align:center">${actionListInfo[i].statusMessage}</td>`

        str += `</tr>`

        $("#actionsModalTable").append(str)

        $(lastBtnInRow).click()

    }


    $("#actionsModalTable #actionIds1").click();

    let checkAllActionListIsNull = actionListInfo.every(item => item.actionList == null)
    checkAllActionListIsNull ? $("#modal_saveActions").addClass("d-none") : $("#modal_saveActions").removeClass("d-none")

    modal_show("actionsModal")

}

function tr_onkeydownDisplay(rowNo, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#actionsModalTable > tr#actionIds${rowNo - 1}`).length > 0) {
            $(`#actionsModalTable > tr.highlight`).removeClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo - 1}`).addClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#actionsModalTable > tr#actionIds${rowNo + 1}`).length > 0) {
            $(`#actionsModalTable > tr.highlight`).removeClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo + 1}`).addClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo + 1}`).focus();
        }
    }

}

function setActions(rowNo, actionId, e) {

    let trElement = $(`#actionsModalTable #actionIds${rowNo}`)
    let stageId = trElement.data("stageid")
    let workflowId = trElement.data("workflowid")

    for (let i = 0; i < selectLineInfo.length; i++) {
        if (selectLineInfo[i].stageId == stageId && selectLineInfo[i].workflowId == workflowId)
            selectLineInfo[i].actionId = actionId
    }
}

async function modal_saveActions(modalName, elm, lastId = null) {

    loadingAsync(true, "modal_saveActions", "fa fa-check-circle");
    $("#actionsModal #modal-close").prop("disabled", true)

    admissionSaveActions(modalName, elm, lastId)
}

async function admissionSaveActions(modalName, elm, lastId) {

    await setLastActionId(lastId)

    let AllActionsIsSet = await checkAllActionsIsSet()
    if (!AllActionsIsSet)
        return

    let modelList = []

    


    for (let i = 0; i < selectLineInfo.length; i++) {

        let model = {
            patientId: selectLineInfo[i].patientId,
            centralId: selectLineInfo[i].centralId,
            requestActionId: selectLineInfo[i].actionId,
            stageId: selectLineInfo[i].stageId,
            branchId: selectLineInfo[i].branchId,
            identityId: selectLineInfo[i].admissionId,
            admissionMasterId: selectLineInfo[i].admissionMasterId,
            workFlowId: selectLineInfo[i].workflowId,
            workflowCategoryId: +workflowCategoryIds.medicalCare.id,
            currentActionId: selectLineInfo[i].currentActionId,
        }

        modelList.push(model)

        if (modelList[i].requestActionId == 0) {
            actionErr.push({
                admissionId: model.identityId,
                err: "گام برای این شناسه مشخص نشده است"
            })
        }

        let response = await admissionValidateStageActionLog(model)
        
        if (response != undefined) {
            if (response.length != 0)
                actionErr.push({
                    admissionId: model.identityId,
                    err: generateErrorString(response)
                })
        }

    }

    if (actionErr.length != 0)
        showActionErrors()
    else
        updateActionAdmissions(modelList)
}

function setLastActionId(lastId) {
    if (checkResponse(lastId))
        for (let i = 0; i < selectLineInfo.length; i++) {
            selectLineInfo[i].actionId = lastId
        }
    else
        selectLineInfo = selectLineInfo.filter(item => item.actionList == null)
}

function checkAllActionsIsSet() {

    for (let i = 0; i < selectLineInfo.length; i++) {
        if (selectLineInfo[i].actionId == null) {
            alertify.warning("تعدادی از سطر ها ، گام انتخاب نشده است").delay(admission.delay);
            loadingAsync(false, "modal_saveActions", "fa fa-check-circle");
            $("#modal_saveActions").prop("disabled", false)
            $("#actionsModal #modal-close").prop("disabled", false)
            return false
        }
    }

    return true
}

function updateActionAdmissions(modelList) {

    actionErr = []
    let theLast = false
    for (let i = 0; i < modelList.length; i++) {
        if (modelList[i + 1] == undefined)
            theLast = true
        updateStatusAdmission(modelList[i], theLast);
    }

}

async function showActionErrors() {

    let messageSeparation = _.uniqWith(actionErr, (a, b) => a.err.trim().split(" ").join("") == b.err.trim().split(" ").join(""))
    let errorsModel = []

    for (let i = 0; i < messageSeparation.length; i++) {
        let message = messageSeparation[i].err
        let currentIds = ""

        for (let j = 0; j < actionErr.length; j++) {
            let currentActionErr = actionErr[j].err

            if (message == currentActionErr) {
                if (j == 0)
                    currentIds += `${actionErr[j].admissionId}`
                else
                    currentIds += `<span style="color:red !important"> , </span> ${actionErr[j].admissionId}`
            }
        }

        errorsModel.push({
            ids: currentIds,
            err: message
        })
    }



    if (errorsModel.length == 0)
        alertify.success("تمام سطر ها با موفقیت ذخیره شده اند");
    else {
        let str = ""

        for (let i = 0; i < errorsModel.length; i++) {

            str += `<tr>
                        <td style="text-align:center" rowspan="2">${i + 1}</td>
                        <td>
                            <div class="d-flex justify-content-between w-100">
                                <div id="showIds${i}" class="showIds">${errorsModel[i].ids}</div>
                                <div class="mr-2 d-flex">
                                    <div>
                                        <button class="btn btn-light border-orange mr-2" title="دریافت شناسه ها" onclick="copyIdsToClipboard(${i})"><i class="fas fa-copy"></i></button>
                                    </div>
                                    <div>
                                        <button id="loadMoreIds${i}" class="btn btn-light border-orange mr-1" title="نمایش بیشتر" onclick="loadMoreIds(${i} ,this,event)"><i class="fas fa-plus"></i></button>
                                    </div>
                                </div>
                            </div>               
                        </td>
                    </tr>
                    <tr>
                        <td>${errorsModel[i].err}</td>
                    </tr>
                `
        }

        $("#actionErrTable").html(str)
        modal_show("actionErrModal")
    }



    loaderOnPageTable(false, "tabBoxByAction")
    modal_close("actionModal")
    modal_close("actionsModal")
    isSetActionAccess = true

}

function copyIdsToClipboard(rowNo) {
    navigator.clipboard.writeText($(`#showIds${rowNo}`).text());
}

function loadMoreIds(rowNo, elm, e) {

    let showIdsElm = $(`#showIds${rowNo}`)

    if (showIdsElm.hasClass("showAllIds")) {
        showIdsElm.removeClass("showAllIds")
        $(`#loadMoreIds${rowNo} i`).removeClass("fa-minus").addClass("fa-plus")
    }

    else {
        showIdsElm.addClass("showAllIds")
        $(`#loadMoreIds${rowNo} i`).removeClass("fa-plus").addClass("fa-minus")
    }


}

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

function run_button_waitingservicelist(id, row, elm) {
    displayAdmission(id, elm);
};

function run_button_inboundservicelist(id, rowNo) {
    var admissionMasterId = $(`[data-id="${id}"]`).data("admissionmasterid")

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)
};

function run_button_waitingprint(id, row, elm) {
    setIdentity(id);
    modalPrintShowen(id);
};

function run_button_inboundprint(id, row, elm) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    setIdentity(id);
    modalPrintShowen(id);
};

function setIdentity(id) {
    rowNumberAdmission = id;
};

function modalPrintShowen(id) {
    modal_show(`PrnAdmission`);
    $("#modal_keyid_value").text(id);
};

function separationprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    contentPrintAdmission(admissionId);

    modal_close('PrnAdmission')
}

function aggregationprint() {
    var admissionId = rowNumberAdmission;
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    contentPrintAdmissionCompress(admissionId);
    modal_close('PrnAdmission');

}

function doubleprint() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#parentPageTableBody .highlight`);
    let admissionId = rowNumberAdmission;
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let element = $("#bcTarget")

    let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
    contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

}

function displayAdmission(admissionId, elm) {

    let currentRow = $(elm).parents("tr")
    let workflowId = $(currentRow).data("workflowid")
    let stageId = $(currentRow).data("stageid")
    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    if (admissionTypeId == 1)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    else if (admissionTypeId == 2 || admissionTypeId == 3 || admissionTypeId == 4)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);

}


$("#isSettled").on("change", function () {
    let result = validateBoxInputs()
    if (!result)
        return

    getCartableTabAction();
});

function getCartableTabAction() {


    let pageViewModel = {
        pageno: 0,
        pagerowscount: 50,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
        sortModel: {
            colId: "",
            sort: ""
        }
    }

    pageViewModel.form_KeyValue = [
        +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        +$("#id").val() == 0 ? null : +$("#id").val(),
        +$("#serviceId").val() == 0 ? null : +$("#serviceId").val(),
        $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        null,
        +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        +$("#admissionsMasterId").val() == 0 ? null : +$("#admissionsMasterId").val(),
        +$("#isSettled").val() == -1 ? null : +$("#isSettled").val(),
    ]

    let countModel = {
        stageId: +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        workflowId: +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        patientId: +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        id: +$("#id").val() == 0 ? null : +$("#id").val(),
        serviceId: +$("#serviceId").val() == 0 ? null : +$("#serviceId").val(),
        fromWorkDayDatePersian: $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        toWorkDayDatePersian: $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        actionId: null,
        branchId: +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        admissionMasterId: +$("#admissionsMasterId").val() == 0 ? null : +$("#admissionsMasterId").val(),
        isSettled: +$("#isSettled").val() == -1 ? null : +$("#isSettled").val()
    }

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getsectioncartable`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(pageViewModel),
        async: false,
        success: function (result) {
            fillCartableTabSection(result, countModel);
            getCartable(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function fillCartableTabSection(result, countModel) {

    let reasultLen = result.length,
        outPut = "",
        active = "";

    let isLastActionExist = false

    if (reasultLen > 0) {

        let currentIndex = result.findIndex(item => item.id == saveCurrentTabAction)

        if (currentIndex != -1)
            isLastActionExist = true
    }

    $("#tabActionBox").html("");
    for (var i = 0; i < reasultLen; i++) {


        if (isLastActionExist) {
            if (checkResponse(saveCurrentTabAction) && saveCurrentTabAction > 0)
                active = (result[i].id == saveCurrentTabAction ? "active" : "");
            else
                active = (i == 0 ? "active" : "");
        }
        else
            active = (i == 0 ? "active" : "");


        outPut = `<li class="nav-item waves-effect waves-light" id="p_${result[i].id}Item">
                      <a class="nav-link ${active}" data-toggle="tab" onclick="changeCartableTabByClick('pagetable_p_${result[i].id}','${result[i].id}')" data-id="p_${result[i].id}" id="p_${result[i].id}Link" href="#p_${result[i].id}Box" role="tab">
                          <div class="d-flex justify-content-center align-items-center w-100" style="font-size: 11px!important;">
                             <span class="d-md-block"> ${result[i].id} - ${result[i].name}</span>
                             <div id="countOfListWaiting_${result[i].id}" resetstyle="true" class="countOfListWaiting  ${(i == 0 ? "elementActive" : "elementInActive")} mr-2 d-flex justify-content-center align-items-center"></div>
                          </div>
                      </a>
                   </li>`;

        $("#tabActionBox").append(outPut);

        countModel.actionId = result[i].id

        fillCartableCount(`countOfListWaiting_${result[i].id}`, countModel)
    }

    if ($("#tabActionBox").html() == '')
        $("#tabBoxByAction").addClass("d-none")
    else
        $("#tabBoxByAction").removeClass("d-none")

}

function getCartable(result) {

    let resultLen = result.length,
        outPut = "",
        pagetableString = getPageTableString(),
        saveId = "";


    $("#tabBoxByAction").html("")

    if (resultLen != 0) {

        for (var i = 0; i < resultLen; i++) {

            outPut += `
                      <div class="tab-pane p-3" data-id="p_${result[i].id}" id="p_${result[i].id}Box" role="tabpanel">
                        <div class="" id="p_${result[i].id}Form" data-parsley-validate>
                          <div class="card-body " id="pagetable_p_${result[i].id}" >${pagetableString}</div>
                        </div>
                      </div>        
                  `;
        }

        $(outPut).appendTo("#tabBoxByAction");
        $(".filterBox").html("");


        /////////////////////////////////

        let index = result.findIndex((item) => item.id === saveCurrentTabAction)

        if (index == -1) {
            $(`#p_${result[0].id}Box`).addClass("active")
            saveId = result[0].id
        }
        else {
            $(`#p_${result[index].id}Box`).addClass("active")
            saveId = result[index].id
        }


        if (resultLen != 0) {
            $("#tabPersonOrderBoxes").addClass("group-box")
            changeCartableTabByClick(`pagetable_p_${saveId}`, saveId);
        }
        else
            $("#tabPersonOrderBoxes").removeClass("group-box")
    }
    else {
        alertify.warning("گامی برای نمایش وجود ندارد").delay(admission.delay);
    }


}

function fillCartableCount(pg_id, countModel) {

    let url = `/api/MC/AdmissionCartableApi/getworklistcount`

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(countModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            $(`#${pg_id}`).html(result)
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function changeCartableTabByClick(pg_id, actionId) {
    saveCurrentTabAction = +actionId
    configStyleCartableCountBox(pg_id, actionId)

    var pageTableModel = {
        pagetable_id: `pagetable_p_${actionId}`,
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionCartableApi/getcartable`,
        lastPageloaded: 0
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageTableModel.pagetable_id);
    if (index == -1) {
        arr_pagetables.push(pageTableModel);
    } else {
        arr_pagetables[index].pagetable_id = `pagetable_p_${actionId}`
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].endData = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionCartableApi/getcartable`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0

    }

    var validateResult = validateBoxInputs()
    if (!validateResult)
        return

    pagetable_formkeyvalue = [
        +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        +$("#id").val() == 0 ? null : +$("#id").val(),
        +$("#serviceId").val() == 0 ? null : +$("#serviceId").val(),
        $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        +actionId,
        +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        +$("#admissionsMasterId").val() == 0 ? null : +$("#admissionsMasterId").val(),
        +$("#isSettled").val() == -1 ? null : +$("#isSettled").val()

    ]
    lastFormKeyValue = pagetable_formkeyvalue

    configCartablePageTable(pg_id)
}

function configStyleCartableCountBox(pg_id, actionId) {

    if ($(`#countOfListWaiting_${actionId}`).hasClass("elementActive"))
        return

    $(".countOfListWaiting").removeClass("elementActive").addClass("elementInActive")

    $(`#countOfListWaiting_${actionId}`).removeClass("elementInActive").addClass("elementActive")

}

function getPageTableString() {

    let output =
        $.ajax({
            url: `PB/Public/newpagetable`,
            type: "get",
            datatype: "html",
            contentType: "application/html; charset=utf-8",
            async: false,
            cache: false,
            dataType: "html",
            success: function (result) {
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, `PB/Public/newpagetable`);
            }
        });

    var strReturn = "";

    //strReturn = $($(output.responseText)[4]).html()

    strReturn = output.responseText

    return strReturn;
}

function fillServiceIdByAttender() {

    let attenderId = $("#attenderId").val()
    let attenderStatus = false
    $("#serviceId").empty();
    $("#serviceId").html('<option value="0">انتخاب کنید</option>').prop("disabled", true).trigger("change.select2")

    if (checkResponse(attenderId) && attenderId != "" && attenderId != 0) {
        attenderStatus = true
        let fromWorkDayDatePersian = $("#fromWorkDayDatePersian").val();
        let toWorkDayDatePersian = $("#toWorkDayDatePersian").val();

        if (isValidShamsiDate(fromWorkDayDatePersian) && isValidShamsiDate(toWorkDayDatePersian) && compareShamsiDate(fromWorkDayDatePersian, toWorkDayDatePersian)) {
            fill_select2(`/api/MC/AdmissionApi/getservicelistbyadmissionattender?attenderId=${attenderId}&fromWorkDayDatePersian=${fromWorkDayDatePersian}&toWorkDayDatePersian=${toWorkDayDatePersian}`, "serviceId", true);
        }

        $("#serviceId").prop("disabled", false);

        $("#refreshPagetable").click();
    }

    return attenderStatus
}

function expandAdmission(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        $(item).nextAll(".slideToggle").removeClass("current");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }

}

function printShortcut(type) {

    let row = $(`#${activePageTableId} .highlight`);

    rowNumberAdmission = row.data("id");

    if (type === 1)
        separationprint();
    else if (type === 2)
        aggregationprint();
    else if (type === 3)
        doubleprint();
}

function multiChangeState(type) {

    if (type == "IN") {
        //run_button_inbound
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable_p_17"),
            selectedItems = arr_pagetables[index].selectedItems,
            selectedItemsln = selectedItems.length;

        //for (var i = 0; i < selectedItemsln; i++)
        //    if (i == selectedItemsln - 1)
        //        updateInbound(selectedItems[i].id, true, 1, selectedItems[i].reservedatepersian.split(" ")[0]).then((res) => messagingChange(res));
        //    else
        //        updateInbound(selectedItems[i].id, true, 1, selectedItems[i].reservedatepersian.split(" ")[0], false);

    }
    else {
        //run_button_waiting
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable_p_5"),
            selectedItems = arr_pagetables[index].selectedItems,
            selectedItemsln = selectedItems.length;

        //for (var i = 0; i < selectedItemsln; i++)
        //    if (i == selectedItemsln - 1)
        //        updateInbound(selectedItems[i].id, true, 2, selectedItems[i].reservedatepersian.split(" ")[0]).then((res) => messagingChange(res));
        //    else
        //        updateInbound(selectedItems[i].id, true, 2, selectedItems[i].reservedatepersian.split(" ")[0], false);
    }
}

function messagingChange(res) {
    $("#refreshPagetable").click();
}

function showModalChangeReserveDate() {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    modal_show("displacementReserveDateModal")
}



function timerInbound() {

    var timer2 = "00:30";

    emptyInterval();

    interval = setInterval(function () {

        if (switchTimer == "off") return;

        timer = timer2.split(':');

        minutes = +timer[0];
        seconds = +timer[1];
        --seconds;

        if (seconds < 10)
            $("#timerBox").addClass("highlight-danger");
        else
            $("#timerBox").removeClass("highlight-danger");

        if (!seconds) {

            if (seconds === 0) {

            }

            timerInbound();
            interval = null;

            clearInterval(interval);

            $("#refreshPagetable").click();
        }
        else {

            minutes = (seconds < 0) ? --minutes : minutes;

            if (minutes <= 0) clearInterval(interval);

            seconds = (seconds < 0) ? 30 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;

            timer2 = zeroPad(minutes, "00") + ':' + seconds;
            $('#timerBox').html(timer2);
        }

    }, 1000);
}

function emptyInterval() {
    var maxInterval = setTimeout(function () { }, 10);
    for (var i = 0; i < maxInterval; i++) {
        clearInterval(i);
    }
}

function listOfClientByStatus() {

    var validate1 = form3.validate();
    validateSelect2(form3);

    if (!validate1) {
        alertify.warning("پارامتر های فیلتر را چک کنید").delay(alertify_delay);
        return;
    }

    let model = {
        stageIds: +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        workflowId: +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        branchId: +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        id: +$("#id").val() == 0 ? null : +$("#id").val(),
        admissionMasterId: +$("#admissionsMasterId").val() == 0 ? null : +$("#admissionsMasterId").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        serviceId: +$("#serviceId").val() == 0 ? null : +$("#serviceId").val(),
        patientId: +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        fromWorkDayDatePersian: $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        toWorkDayDatePersian: $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val()
    }

    if (model == null)
        return

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getworklistheader`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            createReceptionTabs(result)
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function createReceptionTabs(receptions) {

    let receptionLength = receptions.length
    let strReceptionListsTab = ""
    let strReceptionListContent = ""

    if (receptionLength == 0) {
        alertify.warning("لیستی برای نمایش وجود ندارد").delay(admission.delay);
        return
    }

    for (let i = 0; i < receptionLength; i++) {
        let reception = receptions[i]

        strReceptionListsTab += `
                                <li id="tabPos${i + 1}" class="nav-item waves-effect waves-light" onclick="changeTabReception('countOfList_${i + 1}',${i + 1},${reception.actionId})">
                                    <a class="nav-link ${i == 0 ? 'active' : ''}" data-toggle="tab" href="#reception_${i + 1}" role="tab">
                                        <div class="d-flex justify-content-center align-items-center w-100" style="font-size: 11px!important;">
                                            <span>${reception.actionId} - ${reception.actionName}</span>
                                            <div id="countOfList_${i + 1}" resetstyle="true" style="min-width:20px;padding-right:2px;padding-left:2px;width:auto;height:20px;border-radius:50px;font-size:14px" class="${i == 0 ? 'elementActive' : 'elementInActive'} countOfList mr-2 d-flex justify-content-center align-items-center">${reception.count}</div>
                                        </div>                                     
                                    </a>
                                </li>
                                `

        strReceptionListContent += `
                                    <div class="tab-pane ${i == 0 ? 'active' : ''} pr-3 pl-3 pb-3 pt-0" id="reception_${i + 1}" role="tabpanel" style="height:590px">
                                        <div class="row tabToggle${i + 1}">
                                            <div class="col-12">
                                                <div class="card">
                                                    <div class="card-body" >
                                                        <div class="d-flex" id="reception_content${i + 1}">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `
    }

    $("#receptionListsTab").html(strReceptionListsTab)
    $("#receptionListContent").html(strReceptionListContent)
    changeTabReception('countOfList_1', 1, receptions[0].actionId)

    modal_show("listOfClientByStatusModal")
}

function changeTabReception(elementCountId, tabNo, actionId) {

    configStyleCountBox(elementCountId, actionId)

    let model = {
        stageIds: +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        workflowId: +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        branchId: +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        id: +$("#id").val() == 0 ? null : +$("#id").val(),
        admissionMasterId: +$("#admissionsMasterId").val() == 0 ? null : +$("#admissionsMasterId").val(),
        attenderId: +$("#attenderId").val() == 0 ? null : +$("#attenderId").val(),
        serviceId: +$("#serviceId").val() == 0 ? null : +$("#serviceId").val(),
        patientId: +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        fromWorkDayDatePersian: $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        toWorkDayDatePersian: $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        actionId
    }

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getworklistline`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            createReceptionContent(tabNo, result)
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function configStyleCountBox(elementCountId, actionId) {

    let elementCount = $(`#${elementCountId}`)

    if (!elementCount.hasClass("elementActive")) {
        $("#receptionListsTab div[resetstyle=true]").removeClass("elementActive")
        $("#receptionListsTab div[resetstyle=true]").addClass("elementInActive")
        elementCount.removeClass("elementInActive")
        elementCount.addClass("elementActive")
    }
}

function createReceptionContent(tabNo, content) {

    $("#receptionListContent").animate({ scrollLeft: 0 }, 50);
    $(`#reception_content${tabNo}`).html("")

    let contentLength = content.length
    let contentLengthCeil = Math.ceil(contentLength / 15)

    if (content.length != 0) {
        let realCount = 1
        let countInStep = 0

        let strContent = ""
        strContent += '<div class="d-flex">'

        for (let j = 0; j < contentLengthCeil; j++) {
            strContent += '<div style="width: 350px !important">'
            strContent += '<ul style="list-style:none">'

            for (let i = countInStep; i < countInStep + 15; i++) {
                if (content[i] != undefined) {
                    strContent += `                          
                                      <li id="box_${i}" class="p-2 m-3 d-flex" style="${content[i].lineCount > 1 ? 'background-color:#59c6fb9e' : ''};cursor: pointer;position:relative;box-shadow: 0px 0px 2px rgba(0,0,0,0.5);border-radius:5px" title="${content[i].id} /${content[i].patientId} - ${content[i].patientFullName} / ${content[i].patientNationalCode}">
                                         <div style="width:30px;position:relative">
                                             <div class="d-flex justify-content-center align-items-center" style="position:absolute;top:-6px;right:-5px;width:28px;height:27px;border-radius:0px 5px 5px 0px;background-color:rgba(255, 99, 71, 0.8);color:black">
                                                ${realCount}   
                                             </div>
                                         </div>
                                         <div style="width:60px;overflow: hidden;white-space: nowrap">${content[i].id}</div>
                                         <div style="width:180px;overflow: hidden;white-space: nowrap"><span style="color:red">/ </span>${content[i].patientId} - ${content[i].patientFullName}</div>
                                         <div style="width:80px;overflow: hidden;white-space: nowrap"><span style="color:red;${content[i].patientNationalCode == "" ? 'display:none' : ''}">/ </span>${content[i].patientNationalCode}</div>                                           
                                      </li>                                  
                                   `
                    realCount++
                }
            }

            strContent += "</ul></div>"
            countInStep = countInStep + 15
        }
        strContent += `</div>`

        $(`#reception_content${tabNo}`).append(strContent)

    }
}

function validateBoxInputs() {

    var validate1 = form3.validate();
    validateSelect2(form3);
    if (!validate1) {
        resetPageTable_waitingInbound();
        return false;
    }

    let from = moment.from($("#fromWorkDayDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let to = moment.from($("#toWorkDayDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let preMonth = moment.from(moment($("#toWorkDayDatePersian").val()).format('YYYY/MM/DD'), 'fa', 'YYYY/MM/DD').subtract(30, 'day').format('YYYY/MM/DD');
    //let afterValid = moment(to).isSameOrAfter(from, 'day');
    //let beforeValid = moment(from).isSameOrAfter(preMonth, 'day');

    var diffDay = moment(to).diff(moment(from), 'day');

    if (diffDay > 30) {
        alertify.warning("بازه تاریخ مجاز 30 روز می باشد").delay(alertify_delay);
        resetPageTable_waitingInbound()
        return false;
    }

    let attenderId = $("#attenderId").val()
    if (!checkResponse(attenderId) || attenderId == 0 || attenderId == "") {

        alertify.warning("داکتر را انتخاب کنید").delay(alertify_delay);
        resetPageTable_waitingInbound();
        return false;
    }

    return true
}

function resetPageTable_waitingInbound() {

    $("#tabBoxByAction").html("")
    $("#tabActionBox").html("")
    $("#tabBoxByAction").addClass("d-none")


}

$("#actionErrModal").on("hidden.bs.modal", async function () {
    actionErr = []
});

$("#actionModal").on("hidden.bs.modal", async function () {
    $("#actionModalTable").html("<tr><td colspan='3' style='text-align:center'>سطری وجود ندارد</td></tr>")
    isSetActionAccess = true
});

$("#actionModal").on("shown.bs.modal", async function () {
    isSetActionAccess = true
});

$("#actionsModal").on("hidden.bs.modal", async function () {
    isSetActionAccess = true
    selectLineInfo = []
    $("#actionsModalTable").html("<tr><td colspan='4' style='text-align:center'>سطری وجود ندارد</td></tr>")
    setTimeout(() => {
        loadingAsync(false, "modal_saveActions", "fa fa-check-circle");
        $("#actionsModal #modal-close").prop("disabled", false)
    }, 500)

});

$("#branchId").on("change", function () {

    var branchId = $(this).val() == "" ? null : $(this).val();
    let workFlowCategoryId = "10,14";
    let stageClassId = "17,22"

    $("#workflowId").empty();

    var workflowOption = new Option("انتخاب کنید", 0, true, true);

    $("#workflowId").append(workflowOption)

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "", () => { $("#workflowId").trigger("change") });

});

$("#workflowId").on("change", function () {

    let workflowId = +$(this).val() == 0 ? null : $(this).val();
    var branchId = +$("#branchId").val() == 0 ? null : $("#branchId").val();
    let workFlowCategoryId = "10,14";
    let stageClassId = "17,22,28"
    let bySystem = 0
    let isActive = 1

    $("#stageId").empty();

    var stageOption = new Option("انتخاب کنید", 0, true, true);

    $("#stageId").append(stageOption)

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "", () => { $("#refreshPagetable").click() });

});



$("#patientId").on('change', function (e) {

    $("#refreshPagetable").click();
});

$("#stopTimerInterval").on("click", function () {

    if (switchTimer == "on") {
        emptyInterval();
        switchTimer = "off";
        $(this).removeClass("btn-danger").addClass("btn-success");
        $(this).html(`<i class="fa fa-play"></i>`);
    }
    else {
        switchTimer = "on";
        timerInbound();

        interval = null;
        clearInterval(interval);

        $(this).removeClass("btn-success").addClass("btn-danger");
        $(this).html(`<i class="fa fa-stop"></i>`)
    }
});

$("#refreshPagetable").on("click", function () {

    let result = validateBoxInputs()
    if (!result)
        return

    getCartableTabAction();
});

$("#attenderId").on("change", function () {
    fillServiceIdByAttender()
});

$("#fromWorkDayDatePersian").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter) {

        if (!isValidShamsiDate($("#fromWorkDayDatePersian").val())) {
            var msg = alertify.error("قرمت تاریخ صحیح نیست");
            msg.delay(alertify_delay);
            return;
        }
        else {
            $("#toWorkDayDatePersian").val($("#fromWorkDayDatePersian").val());
            let attenderStatus = fillServiceIdByAttender()
            if (!attenderStatus) {

                var msg = alertify.warning("داکتر را انتخاب کنید");
                msg.delay(admission.delay);
            }
        }
    }
});

$("#toWorkDayDatePersian").on("keydown", function (ev) {

    if (ev.keyCode === KeyCode.Enter) {
        if (!isValidShamsiDate($("#toWorkDayDatePersian").val())) {
            var msg = alertify.error("قرمت تاریخ صحیح نیست");
            msg.delay(alertify_delay);
            return;
        }
        else {
            let attenderStatus = fillServiceIdByAttender()
            if (!attenderStatus) {

                var msg = alertify.warning("داکتر را انتخاب کنید");
                msg.delay(admission.delay);
            }
        }
    }
});

$("#id").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        if ($(this).val() != "")
            $("#refreshPagetable").click();
    }
})

$("#patientName").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        $("#refreshPagetable").click();
    }
})

$("#patientNationalCode").on("keydown", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        $("#refreshPagetable").click();
    }
})

$("#serviceId").on("change", function (e) {
    if (checkResponse($("#serviceId").val()) && $("#serviceId").val() != "") {
        $("#refreshPagetable").click();
    }
})

$("#refreshlist").on("click", function () {
    $("#refreshPagetable").click();
})

$("#resetList").on("click", function () {
    $("#id").val("")
    $("#patientName").val("")
    $("#admissionsMasterId").val("")
    $("#patientNationalCode").val("")
    $("#fromWorkDayDatePersian").val(moment().format("jYYYY/jMM/jDD"))
    $("#toWorkDayDatePersian").val(moment().format("jYYYY/jMM/jDD"))
    //$("#branchId").prop("selectedIndex", 0).trigger("change.select2");
    $("#tabActionBox").html("")
    $("#tabBoxByAction").addClass("d-none")
    $("#tabBoxByAction").html("")
    inboundLoadDropdown()
})

$("#scheduleInfo").on("click", function () {

    var attenderId = +$("#attenderId").val();
    if (attenderId === 0) {

        var msg = alertify.warning("داکتر را انتخاب کنید");
        msg.delay(admission.delay);
        return;
    }
    isReadOnly = true;
    reserve_init(attenderId);
    modal_show("reserveModal");
});

$(".group-box").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3].indexOf(e.which) == -1) return;

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printShortcut(1);
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        printShortcut(2);
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        printShortcut(3);
    }
});


$("#displacementReserveDateModal").on("hidden.bs.modal", async function () {

    clearAttenderScheduleBlockReplaceTab();

    clearAttenderScheduleBlockMoveTab();


    $("#attenderScheduleBlockReplaceTab").addClass('active');
    $("#attenderScheduleBlockReplace").addClass('active');

    $("#attenderScheduleBlockMoveTab").removeClass('active');
    $("#attenderScheduleBlockMove").removeClass('active');


    scheduleBlockList = [];
    scheduleBlockListIds = [];

});

$("#displacementReserveDateModal").on("shown.bs.modal", async function () {

    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderIdReplace", true, 0, false, 0, "انتخاب داکتر...");

    fill_select2("api/MC/PatientApi/filter/2", "patientIdReplaceFrom", true, 0, true, 3, "انتخاب", undefined, "", false, true, false, true);

    fill_select2("api/MC/PatientApi/filter/2", "patientIdReplaceTo", true, 0, true, 3, "انتخاب", undefined, "", false, true, false, true);


    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderIdMoveModal", true, 0, false, 0, "انتخاب داکتر...");

    fill_select2("api/MC/PatientApi/filter/2", "patientIdMove", true, 0, true, 3, "انتخاب", undefined, "", false, true, false, true);

    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchIdMove", true, 0, false, 0, "انتخاب شعبه...");

    fill_select2("/api/PB/PublicApi/getdropdowndays", "dayInWeek", true, 0, false, 0, "روزهفته...");

    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderIdShiftModel", true, 0, false, 0, "انتخاب داکتر...");


});


function addValidatorScheduleBlockOperation() {

    window.Parsley._validatorRegistry.validators.shamsidate = undefined
    window.Parsley.addValidator('shamsidate', {
        validateString: function (value) {
            return isValidShamsiDate(value);
        },
        messages: {
            en: 'فرمت تاریخ صحیح نیست .',
        }
    });
    window.Parsley._validatorRegistry.validators.compareshamsidate = undefined
    window.Parsley.addValidator('compareshamsidate', {
        validateString: function (value, requirement) {

            var value2 = $(`#${requirement}`).val();
            if (value !== "" && value2 !== "" && requirement !== "")
                return compareShamsiDate(value, value2);
            else
                return true;
        },
        messages: {
            en: 'تاریخ شروع باید کوچکتر از تاریخ پایان باشد.',
        }
    });

    window.Parsley._validatorRegistry.validators.compareshamsidateyear = undefined
    window.Parsley.addValidator('compareshamsidateyear', {
        validateString: function (value, requirement) {

            var value2 = $(`#${requirement}`).val();
            if (value !== "" && value2 !== "" && requirement !== "") {
                return compareShamsiDateYear(value, value2);
            }
            else
                return true;
        },
        messages: {
            en: 'تاریخ شروع و پایان باید در یک سال باشند.',
        }

    });


    window.Parsley._validatorRegistry.validators.chekdoubledate = undefined
    window.Parsley.addValidator('chekdoubledate', {
        validateString: function (value, requirement) {

            var value2 = $(`#${requirement}`).val();
            if ((+value == 0 || +value2 == 0)) return false;

            return true;
        },
        messages: {
            en: 'وارد کردن تاریخ  الزامیست.',
        }
    });

    window.Parsley._validatorRegistry.validators.chekdate = undefined
    window.Parsley.addValidator('chekdate', {
        validateString: function (value) {

            if ((+value == 0)) return false;

            return true;
        },
        messages: {
            en: 'وارد کردن تاریخ  الزامیست.',
        }
    });
    window.Parsley._validatorRegistry.validators.dateisonemonth = undefined;
    window.Parsley.addValidator('dateisonemonth', {
        validateString: function (value, requirement) {

            let toDateValue = $(`#${requirement}`).val();
            let fromDateValue = value;
            return checkDateIsOnMonth(fromDateValue, toDateValue);

        },
        messages: {
            en: 'بازه تاریخ نمیتواند بیشتر از یک ماه باشد.',
        }
    });



    kamaDatepicker('fromReserveDateMove', { withTime: false, position: "bottom" });
    kamaDatepicker('toReserveDateMove', { withTime: false, position: "bottom" });

    kamaDatepicker('fromAppointmentDateMove', { withTime: false, position: "bottom" });
    kamaDatepicker('toAppointmentDateMove', { withTime: false, position: "bottom" });


    kamaDatepicker('fromReserveDate2', { withTime: false, position: "bottom" });
    kamaDatepicker('toReserveDate2', { withTime: false, position: "bottom" });

    kamaDatepicker('fromReserveDate1', { withTime: false, position: "bottom" });
    kamaDatepicker('toReserveDate1', { withTime: false, position: "bottom" });
}

window.Parsley._validatorRegistry.validators.shamsidate = undefined
window.Parsley.addValidator('shamsidate', {
    validateString: function (value) {
        if (+value !== 0) return isValidShamsiDate(value);
        else return true;
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});


initForminboundl()
addValidatorScheduleBlockOperation();