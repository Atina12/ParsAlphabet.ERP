
var viewData_controllername = "RoleWorkflowPermissionApi",
    url_save = `${viewData_baseUrl_GN}/${viewData_controllername}/save`,
    urlApi = "", branchId = 0, workflowId = 0, stageId = 0,
    workslowCategoryId = 0, roleId = 0, workflowPermissionList = [], refreshRowNo = 0,
    tracking = { onSave: false, workflowRow: null, stageRow: null },
    arr_pagetablesTbAction = [];

function roleWorkflowPermission_init(role) {
    $("#workflowCategoryId").select2("focus");
    roleId = role;
    branchId = 0;
    workflowId = 0;
    stageId = 0;
    workslowCategoryId = 0;
    workflowPermissionList = [];
    resetTbsPermissionIndex();

    $("#workflowCategoryId").prop("selectedIndex", 0).trigger("change");
    $("#branchId").prop("selectedIndex", 0).trigger("change");

}

function resetTbsPermissionIndex() {
    $("#tbActionGet").html("");
    $("#tbStageGet").html("");
    $("#tbWorkflowGet").html("");
}

function tr_onclickDisplay(tableName, elm, rowNo) {

    var workflowCategory = $("#workflowCategoryId").val()

    if (workflowCategory == 0 || workflowCategory == null) {
        var msgError = alertify.warning("دسته بندی جریان کار را انتخاب نمایید.");
        msgError.delay(alertify_delay);
        return
    }

    admissionWorkFlowTrHighlight(tableName, rowNo)

    if (tableName == "tbworkflow") {

        resetTbsPermissionIndex();
        branchId = elm;

        urlApi = `${viewData_baseUrl_GN}/RoleWorkflowPermissionApi/roleworkflowpermissiongetlist/1/${roleId}/${toNumber(workflowCategory)}/${branchId}/0/0`;

        $.ajax({
            url: urlApi,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let output = '', data = null, resultLen = res.length;

                if (resultLen == 0) {

                    $("#tbWorkflowGet").append('')
                    $("#tbStageGet").append('')
                    $("#tbActionGet").append('')

                    let emptyStr = `
                        <tr>
                             <td colspan="3" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbWorkflowGet").append(emptyStr)

                    emptyStr = ``;

                    emptyStr = `
                        <tr>
                             <td colspan="7" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbStageGet").append(emptyStr)

                    emptyStr = ``;

                    emptyStr = `
                        <tr>
                             <td colspan="4" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbActionGet").append(emptyStr)

                }
                else {

                    for (var i = 0; i < resultLen; i++) {
                        data = res[i];
                        inputCheckedVal = `<i class="fas fa-check"></i>`
                        if (data.ExistObject == 0) inputCheckedVal = '';

                        output += `<tr id="tbstg_${i}" onclick="tr_onclickDisplay('tbstg',${data.Id},${i})">                       
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                        <td style='text-align:center'>${inputCheckedVal}</td>
                                    </tr>`;
                    }


                    $("#tbWorkflowGet").html(output);

                    setTimeout(() => {
                        $(`#tbstg_${rowNo}`).click()
                    }, 50)
                }
            },
            error: function (xhr) {
                error_handler(xhr, urlApi);
            }
        });
    }
    else if (tableName == "tbstg") {

        $("#tbActionGet").html("");
        $("#tbStageGet").html("");

        workflowId = elm;

        urlApi = `${viewData_baseUrl_GN}/RoleWorkflowPermissionApi/roleworkflowpermissiongetlist/2/${roleId}/${toNumber(workflowCategory)}/${branchId}/${workflowId}/0`;
        $.ajax({
            url: urlApi,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let output = '', data = null, resultLen = res.length;

                if (resultLen == 0) {

                    $("#tbStageGet").append('')
                    $("#tbActionGet").append('')

                    let emptyStr = `
                        <tr>
                             <td colspan="7" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbStageGet").append(emptyStr)

                    emptyStr = `
                        <tr>
                             <td colspan="4" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbActionGet").append(emptyStr)

                }
                else {
                    for (var i = 0; i < resultLen; i++) {
                        data = res[i];
                        inputCheckedVal = isActiveVal = `<i class="fas fa-check"></i>`;

                        if (data.ExistObject == 0) inputCheckedVal = '';
                        if (data.IsActive == 0) isActiveVal = '';


                        output += `<tr id="tbact_${i}" onclick="tr_onclickDisplay('tbact',${data.Id},${i})">                     
                        <td>${data.Id}</td>
                        <td>${data.Name}</td>
                        <td>${data.InOut == 1 ? 'بدهکار' : data.InOut == 2 ? 'بستانکار' : ""}</td>
                        <td>${data.StageClassId != null && data.StageClassId != 0 ? `${data.StageClassId} - ${data.StageClassName}` : ""}</td>
                        <td>${data.WorkflowCategoryId != null && data.WorkflowCategoryId != 0 ? data.WorkflowCategoryName : ""}</td>
                        <td style='text-align:center'>${isActiveVal}</td>
                        <td style='text-align:center'>${inputCheckedVal}</td>
                        </tr>`;
                    }

                    $("#tbStageGet").html(output);

                    setTimeout(() => {
                        tracking.workflowRow = rowNo

                        if (tracking.onSave)
                            $(`#tbact_${tracking.stageRow}`).click()
                        else
                            $("#tbact_0").click()

                    }, 50)
                }


            },
            error: function (xhr) {
                error_handler(xhr, urlApi);
            }
        });
    }
    else if (tableName == "tbact") {


        stageId = elm;

        urlApi = `${viewData_baseUrl_GN}/RoleWorkflowPermissionApi/roleworkflowpermissiongetlist/3/${roleId}/${toNumber(workflowCategory)}/${branchId}/${workflowId}/${stageId}`;

        $.ajax({
            url: urlApi,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let output = '', data = null, resultLen = res.length, inputCheckedVal = '', inputVal = '';
                $("#tbActionGet").html("")
                $("#getActionValAll").prop("checked", false)
                if (resultLen == 0) {
                    $("#tbActionGet").append('')
                    let emptyStr = `
                        <tr>
                             <td colspan="4" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbActionGet").append(emptyStr)
                }
                else {

                    for (var i = 0; i < resultLen; i++) {

                        data = res[i];
                        inputCheckedVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getActionVal(this,'tbAction',${resultLen})" checked>`;
                        inputVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getActionVal(this,'tbAction',${resultLen})" >`;

                        // Set Checked Value For Action Checkbox While its Selected By User
                        var chkSelected = workflowPermissionList.findIndex(x => x.branchId === branchId && x.workflowId === workflowId
                            && x.stageId === stageId && x.actionId === data.Id && x.isActive === true)

                        output = `<tr id="tblist_${i}" onclick="tr_onclickDisplay('tblist',${data.Id},${i})" onkeydown="tr_onkeydownDisplay(${i},${data.Id} ,this,event)" tabindex="-1">
                                        <td style="text-align:center"><label>${data.ExistObject == 1 || chkSelected != -1 ? inputCheckedVal : inputVal}</label></td>
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                        <td>${data.Priority}</td>
                                  </tr>`;


                        $("#tbActionGet").append(output);


                        if (data.ExistObject)
                            getActionVal(inputCheckedVal, 'tbAction', resultLen)
                    }


                    $("#tbAction #tblist_0").addClass("highlight").focus()
                }

                tracking.stageRow = rowNo
                tracking.onSave = false

            },
            error: function (xhr) {
                error_handler(xhr, urlApi);
            }
        });
    }
}

function tr_onkeydownDisplay(rowNo, id, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#tbAction > tbody > tr#tblist_${rowNo - 1}`).length > 0) {
            $(`#tbAction > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbAction > tbody > tr#tblist_${rowNo - 1}`).addClass("highlight");
            $(`#tbAction > tbody > tr#tblist_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#tbAction > tbody > tr#tblist_${rowNo + 1}`).length > 0) {
            $(`#tbAction > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbAction > tbody > tr#tblist_${rowNo + 1}`).addClass("highlight");
            $(`#tbAction > tbody > tr#tblist_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();

        $(`#tbAction > tbody > tr#tblist_${rowNo} input`).click()
    }

}

function admissionWorkFlowTrHighlight(tableName, rowNo) {
    if (tableName.includes('tbstg')) {
        $(`#tbWorkflow > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbWorkflow > tbody > tr#${tableName}_${rowNo}`).addClass("highlight");
    }
    else if (tableName.includes('tbact')) {
        $(`#tbStage > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbStage > tbody > tr#${tableName}_${rowNo}`).addClass("highlight");
    }
    else if (tableName.includes('tblist')) {
        $(`#tbAction > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbAction > tbody > tr#${tableName}_${rowNo}`).addClass("highlight");
    }
}

function getActionVal(elm, pagetable_id, tbodyLength) {


    let idChcke = $(elm).attr('id');

    let index = workflowPermissionList.findIndex(x => {
        return x.branchId === branchId && x.workflowId === workflowId && x.stageId === stageId && x.actionId === toNumber(idChcke)
    });

    if ($(elm).prop("checked")) {

        var workflowPermissionmodel = {};

        if (index === -1) {
            workflowPermissionmodel = {
                branchId: branchId,
                workflowId: workflowId,
                stageId: stageId,
                actionId: toNumber(idChcke),
                isActive: 1
            }

            workflowPermissionList.push(workflowPermissionmodel)

        }
        else {
            workflowPermissionList[index].isActive = 1
        }

        workflowPermissionmodel = {};
    }
    else {
        if (index != -1)
            workflowPermissionList[index].isActive = 0;
    }


    let currentTbActionList = workflowPermissionList.filter(x => x.branchId === branchId && x.workflowId === workflowId && x.stageId === stageId)
    let checkAll = currentTbActionList.every(item => item.isActive === 1)

    if (tbodyLength == currentTbActionList.length && checkAll)
        $("#getActionValAll").prop("checked", checkAll)
    else
        $("#getActionValAll").prop("checked", false)

}

function getActionValAll(elem, pageId) {
    
    if ($(elem).prop("checked") == true)
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", true).trigger("change");
    else
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", false).trigger("change");
}

function save() {

    var model = {
        roleId: roleId,
        workflowPermissionList: workflowPermissionList
    };

    $(`#roleWorkflowPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", true)
    let result = $.ajax({
        url: url_save,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {

            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);

            if (model.workflowPermissionList.length > 0) {
                tracking.onSave = true
                $("#branchId").prop("selectedIndex", refreshRowNo).trigger("change");
            }

            setTimeout(() => {
                $(`#roleWorkflowPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)

        },
        error: function (xhr) {
            setTimeout(() => {
                $(`#roleWorkflowPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)
            error_handler(xhr, url_save);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

}

$("#workflowCategoryId").on("change", function () {
    tracking = { onSave: false, workflowRow: null, stageRow: null };
    resetTbsPermissionIndex();
    $("#branchId").prop("selectedIndex", 0).trigger("change");
});

$("#branchId").on("change", function () {

    refreshRowNo = document.getElementById("branchId").selectedIndex

    if (refreshRowNo != -1) {

        if (tracking.onSave)
            tr_onclickDisplay('tbworkflow', $("#branchId").val(), tracking.workflowRow)
        else
            tr_onclickDisplay('tbworkflow', $("#branchId").val(), 0)


    }
})

$("#roleWorkflowPermissionModal").on("hidden.bs.modal", function () {
    tracking = { onSave: false, workflowRow: null, stageRow: null };
});