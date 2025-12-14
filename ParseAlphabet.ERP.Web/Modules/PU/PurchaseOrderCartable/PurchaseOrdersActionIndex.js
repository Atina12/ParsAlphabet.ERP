
var currentActionId = 0;
var stageActionLogCurrent = {
    identityId: 0,
    stageId: 0,
    actionId: 0,
    workFlowId: 0,
    documentDatePersian: null,
    parentWorkflowCategoryId: 0
}
$("#stepLogModalPurchasePersonOrders").on("shown.bs.modal", function () {
    $("#actionPurchasePersonOrders").focus();
});

function stepLogPurchasePersonOrders(id, stageId, workflowId) {

    $("#stepLogRowsPurchasePersonOrders").html("");
    $("#tempErrorUpdateStepResultLines").html("");
    $("#temperrorPurchaseOrderCheckisAllocatedList").html("");
    $("#itemUpdateStepPageTablefieldset").addClass("displaynone");
    $("#purchaseOrderCheckisAllocatedListfieldset").addClass("displaynone");

    var url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist/${id}/${stageId}/${workflowId}`

    $.ajax({
        url: url,
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
                $("#stepLogRowsPurchasePersonOrders").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function update_actionPurchasePersonOrders() {

    $("#itemUpdateStepPageTablefieldset").addClass("displaynone");
    $("#purchaseOrderCheckisAllocatedListfieldset").addClass("displaynone");

    $("#tempErrorUpdateStepResultLines").html("");
    $("#temperrorPurchaseOrderCheckisAllocatedList").html("");


    var requestedActionId = +$("#actionPurchasePersonOrders").val();
    currentActionId = +stageActionLogCurrent.actionId;
    var currentStageId = +stageActionLogCurrent.stageId;
    var currentWorkFlowId = +stageActionLogCurrent.workFlowId;
    var documentDatePersian = stageActionLogCurrent.documentDatePersian;
    var parentWorkflowCategoryId = +stageActionLogCurrent.parentWorkflowCategoryId;


    var model = {
        currentActionId: currentActionId,
        requestActionId: requestedActionId,
        identityId: +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("id"),
        stageId: currentStageId,
        workflowId: currentWorkFlowId,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId
    }

    loadingAsync(true, "update_action_btn", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
        if (stepPermissionid > 0) {
            if (model.requestActionId != model.currentActionId)
                checkValidateUpdateStep(model);
           
            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "update_action_btn", "");
            }
        }
        else {
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $("#actionPurchasePersonOrders").val(model.currentActionId)
            loadingAsync(false, "update_action_btn", "");
        }
      
    },10)
}

function checkValidateUpdateStep(model) {

    let url = `api/PU/PurchaseOrderActionApi/validateupdatestep`;

    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {
                var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);

                updateaction(model, currentStageAction, requestStageAction);
                loadingAsync(false, "update_action_btn", "");
            }
            else {

                if (checkResponse(result.validationErrors)) {
                    $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                }
                loadingAsync(false, "update_action_btn", "");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            loadingAsync(false, "update_action_btn", "");
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

function updateaction(model, currentStageAction, requestStageAction) {

    //#region افزایش گام 

    if (currentStageAction.priority < requestStageAction.priority) {



        //#region گام3 به گام 9   
        if ((!currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var result = checkHeaderBalance(model);

            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            }
        }
        //#endregion

        //#region گام9 به گام 10
        else if ((currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var result = checkHeaderBalance(model);
            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            }
        }
        //#endregion

        //#region گام3 به گام 10  
        else if ((!currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {
            var result = checkHeaderBalance(model);
            if (result.data.successfull) {
                getLastConfirmHeader(model, requestStageAction.costofItemOrdered, requestStageAction.costofItemInvoiced);
            }
            else {
                alertify.error(result.data.statusMessage).delay(alertify_delay);
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            }
        }

        //#endregion

        else {

            //#region گام2 به گام 3  

            // ویرایش گام انجام می شود
            updateStatusPurchasePersonOrders(model, () => {
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            });
            //#endregion
        }
    }

    //#endregion

    //#region  کاهش گام

    else {

        //#region  گام 10 به گام 3

        if ((!currentStageAction.costofItemOrdered && currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var unitCostCalculation = checkIsUnitCostCalculatedPurchaseOrder(model);
            if (unitCostCalculation === 1) {
                alertify.error("رسید های  انبار متصل به این درخواست خرید ریالی شده اند").delay(alertify_delay);
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            }

            else
                returninvoiceprice(model);
        }
        //#endregion

        //#region گام10 به گام 9

        else if ((!currentStageAction.costofItemOrdered && currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            var unitCostCalculation = checkIsUnitCostCalculatedPurchaseOrder(model);
            if (unitCostCalculation === 1) {
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
                alertify.error("رسید های  انبار متصل به این درخواست خرید ریالی شده اند").delay(alertify_delay);
            }
            else
                returninvoiceprice(model);
        }

        //#endregion

        //#region گام 9  به گام 3

        else if ((currentStageAction.costofItemOrdered && !currentStageAction.costofItemInvoiced && !currentStageAction.unitCostCalculationWarehouse) &&
            (!requestStageAction.costofItemOrdered && !requestStageAction.costofItemInvoiced && !requestStageAction.unitCostCalculationWarehouse)) {

            if (requestStageAction.isQuantityPurchase)
                returnrequestprice(model);

            else
                // ویرایش گام انجام می شود
                updateStatusPurchasePersonOrders(model, () => {
                    $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
                });
        }

        //#endregion

        //#region گام3 به گام 2  
        else {
            // ویرایش گام انجام می شود
            updateStatusPurchasePersonOrders(model, () => {
                $("#actionPurchasePersonOrders").val(model.currentActionId).trigger("change")
            });
        }

        //#endregion
    }

    //#endregion
}

function checkHeaderBalance(model) {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: model.identityId,
        workflowCategoryIdCurrentStage: 1,
        workflowCategoryIdParentStage: 1,
        amountOrQuantity: false
    }
    var outPut = $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelnew),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            return 0;
        }
    });

    return outPut.responseJSON;
}

function getLastConfirmHeader(model, costofItemOrdered, costofItemInvoiced) {

    var p_url = `/api/pu/PurchaseOrderActionApi/getnolastconfirmheader`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {

            if (result.data.length > 0) {

                showErrorValidtionUpdateStep(result.data);
            }

            else {
                if (costofItemOrdered) {
                    //ریالی کردن برگه سفارش خرید
                    updaterequestprice(model);
                }
                else if (costofItemInvoiced) {
                    // بررسی دسته بندی هایی درخواست برای بهای تمام شده 
                    getpurchaseordercheckisallocatedlist(model);
                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function export_csvLastConfirmHeader() {

    let id = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("id");

    pagetable_formkeyvalue = ["id", id];

    setTimeout(function () {

        if (csvModel == null) {
            csvModel = {
                Filters: [],
                Form_KeyValue: pagetable_formkeyvalue
            }
        }
        viewData_form_title = "لیست صورتحساب های متصل به درخواست جاری";
        let url = `/api/pu/PurchaseOrderActionApi/csv`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                $("#actionPurchasePersonOrders").val(currentActionId).trigger("change");
                generateCsv(result);

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }, 500);
}

function getpurchaseordercheckisallocatedlist(model) {
    var p_url = `/api/pu/PurchaseOrderActionApi/purchaseordercheckisallocated`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {

            if (result.data.length > 0)
                showErrorPurchaseOrderCheckisAllocatedList(result.data)
            else
                //محاسبه بهای تمام شده صورتحساب
                updateinvoiceprice(model);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function showErrorPurchaseOrderCheckisAllocatedList(data) {

    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")


    $("#purchaseOrderCheckisAllocatedListfieldset").removeClass("displaynone");
    $("#temperrorPurchaseOrderCheckisAllocatedList").html("");


    let strtablePurchaseOrderCheckisAllocatedList = ""
    for (var i = 0; i < data.length; i++) {
        strtablePurchaseOrderCheckisAllocatedList += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
        strtablePurchaseOrderCheckisAllocatedList += `<td style="width:50%"><div  type="text" >${data[i].stage}</td>`
        strtablePurchaseOrderCheckisAllocatedList += `<td style="width:50%"><div  type="text" >${data[i].itemCategory}</td>`
        strtablePurchaseOrderCheckisAllocatedList += "</tr>"
    }
    $(`#temperrorPurchaseOrderCheckisAllocatedList`).html(strtablePurchaseOrderCheckisAllocatedList);
    modal_show("stepLogModalPurchasePersonOrders");
}

function showErrorValidtionUpdateStep(errors) {

    $("#itemUpdateStepPageTablefieldset").removeClass("displaynone");
    $("#tempErrorUpdateStepResultLines").html("");

    if (errors !== null) {
        let strtableLineTheadFields = ""

        for (var i = 0; i < errors.length; i++) {

            strtableLineTheadFields += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
            strtableLineTheadFields += `<td style = "width:13%" > <div id="header_${i + 1}" type="text" >${errors[i].headerId}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="workflow_${i + 1}" type="text" >${errors[i].workflow}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="stage_${i + 1}" type="text" >${errors[i].stage}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="action_${i + 1}" type="text" >${errors[i].action}</td>`
            strtableLineTheadFields += `<td style="width:13%"><div id="date_${i + 1}" type="text" >${errors[i].documentDatePersian}</td>`
            strtableLineTheadFields += "</tr>"
        }

        $(`#tempErrorUpdateStepResultLines`).html(strtableLineTheadFields);

        modal_show("stepLogModalPurchasePersonOrders");
        $("#actionPurchasePersonOrders").val(currentActionId).trigger("change.select2");
        alertify.warning(" صورتحساب های متصل به درخواست جاری را تایید نمایید").delay(alertify_delay);
    }


}

function updaterequestprice(model) {
    var p_url = `/api/pu/PurchaseOrderActionApi/updaterequestprice`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatusPurchasePersonOrders(model, () => {
                    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function updateinvoiceprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/updateinvoiceprice`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatusPurchasePersonOrders(model, () => {
                    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function returninvoiceprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/returninvoiceprice`;
    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatusPurchasePersonOrders(model, () => {
                    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function returnrequestprice(model) {

    var p_url = `/api/pu/PurchaseOrderActionApi/returnrequestprice`;

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+model.identityId),
        success: function (result) {
            if (result.successfull)
                // ویرایش گام انجام می شود
                updateStatusPurchasePersonOrders(model, () => {
                    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")
                });
            else
                alertify.error(resulta.statusMessage).delay(alertify_delay);


        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function checkIsUnitCostCalculatedPurchaseOrder(model) {

    var url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/checkisunitcostcalculated`;

    var outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model.identityId),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return outPut.responseJSON;
}

function updateStatusPurchasePersonOrders(model, callback1 = undefined) {

    if (model.requestActionId > 0) {
        var viewData_updatePersonOrderStep_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/updatestep`;

        $.ajax({
            url: viewData_updatePersonOrderStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result.successfull) {

                    alertify.success(result.statusMessage);
                    stepLogPurchasePersonOrders(model.identityId, model.stageId, model.workflowId);

                    get_NewPageTableV1();

                    stageActionLogCurrent.actionId = +model.requestActionId;
                }
                else {
                    $("#actionPurchasePersonOrders").val(currentActionId).trigger("change")

                    alertify.error(result.validationErrors).delay(alertify_delay);
                    callback1()
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updatePersonOrderStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }
}





