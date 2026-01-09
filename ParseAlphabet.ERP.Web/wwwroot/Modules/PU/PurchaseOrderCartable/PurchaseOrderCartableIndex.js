var viewData_form_title = "سفارش خرید",
    viewData_controllername = "PurchaseOrderCartableApi",
    viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpageorderscartable`,
    viewData_deleterecord_url = `${viewData_baseUrl_PU}/PurchaseOrderApi/delete`,
    viewData_getrecord_url = `${viewData_baseUrl_PU}/PurchaseOrderApi/getrecordbyid`,
    viewData_updrecord_url = `${viewData_baseUrl_PU}/PurchaseOrderApi/update`,
    viewData_csv_url = `${viewData_baseUrl_PU}/PurchaseOrderApi/csv`,
    viewData_personOrderStepList_url = `${viewData_baseUrl_PU}/PurchaseOrderActionApi/getpurchaseordersteplist`,
    isExistStageStep = false,
    selectedRowId = 0,
    existPersonOrderLine = 0,
    activePageTableId = null,
    headerLine_formkeyvalue = [],
    pageName = null,
    pageTableModel = {}, idForStepAction = "";

var stageId_PurchaseOrderCartable = +$("#stageIdPersonOrderParameter").val();

var isDisablenoSeriesId = {
    flg: true,
    edit: false
};
pagetable_formkeyvalue = ["", "", "my", null];

function run_button_editPersonOrdersCartable(personOrderId, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;
    var isDataEntry = $(`#${pageName} #row${rowNo}`).data("isdataentry");

    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }


    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(personOrderId);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(personOrderId),
        async: false,
        cache: false,
        success: function (response) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                modal_show();
                fillEditPersonOrder(result);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function initPurchasePersonOrdersGroup(stageId_PurchaseOrderCartable) {

    $("#orderDatePersian").inputmask();
    kamaDatepicker('orderDatePersian', { withTime: false, position: "bottom" });


    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    $('#userType').bootstrapToggle();

    $(".button-items").prepend($(".toggle"));

    if (checkResponse(stageId_PurchaseOrderCartable) && stageId_PurchaseOrderCartable > 0)
        pagetable_formkeyvalue = [stageId_PurchaseOrderCartable, "stageId", "my", null];
    else
        pagetable_formkeyvalue = ["", "", "my", null];

    getPurchasePersonOrdersTab(pagetable_formkeyvalue);

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getdropdown`, "stageId", true, '1/1/2/1');
    fill_select2("/api/GN/CurrencyApi/getdropdown", "currencyId", true);
    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true);
    $("#accountDetailId").select2()
    $("#noSeriesId").select2();

    $("#note").suggestBox({
        api: `${viewData_baseUrl_PU}/PurchaseDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });


    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm()" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));
}

function callBackSearche() {
    return stageId_PurchaseOrderCartable > 0
}

function getPurchasePersonOrdersTab() {

    var byUser = pagetable_formkeyvalue[2];

    let url = `${viewData_baseUrl_PU}/${viewData_controllername}/purchaseordercartablesection/1/${byUser}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        data: {},
        async: false,
        success: function (result) {
            handlerPageLoding(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function handlerPageLoding(result) {
    resetCartable();
    fillTab(result);
    fillLinkTab(result);
}

function resetCartable() {
    $("#tabLinkPersonOrderBoxes").html("");
    $("#tabPersonOrderBoxes").html("");
}

function fillTab(result) {

    let resultLen = result.length,
        outPut = "",
        pagetableString = getPageTableString(),
        saveId = "";

    if (resultLen > 0) {

        for (var i = 0; i < resultLen; i++) {

            outPut = `<div class="tab-pane p-3" data-id="p_${result[i].id}" id="p_${result[i].id}Box" role="tabpanel">
                     <div class="" id="p_${result[i].id}Form" data-parsley-validate>
                          <div class="card-body " id="pagetable_p_${result[i].id}">${pagetableString}</div>
                     </div>
                 </div>`;

            $("#tabPersonOrderBoxes").append(outPut);
        }

        let index = result.findIndex((item) => item.id === stageId_PurchaseOrderCartable)
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
            changeTabByClick(`pagetable_p_${saveId}`, saveId);
        }
        else
            $("#tabPersonOrderBoxes").removeClass("group-box")
    }


}

function fillLinkTab(result) {
    let reasultLen = result.length, outPut = "";
    let active = "";
    for (var i = 0; i < reasultLen; i++) {
        if (checkResponse(stageId_PurchaseOrderCartable) && stageId_PurchaseOrderCartable > 0)
            active = (result[i].id == stageId_PurchaseOrderCartable ? "active" : "");
        else
            active = (i == 0 ? "active" : "");

        outPut = `<li class="nav-item waves-effect waves-light" id="p_${result[i].id}Item">
                    <a class="nav-link ${active}" data-toggle="tab" onclick="changeTabByClick('pagetable_p_${result[i].id}','${result[i].id}')" data-id="p_${result[i].id}" id="p_${result[i].id}Link" href="#p_${result[i].id}Box" role="tab">
                        <span class="d-md-block"> ${result[i].id} - ${result[i].name}</span>
                    </a>
                </li>`;

        $("#tabLinkPersonOrderBoxes").append(outPut);
    }
}

function getPageTableString() {

    let output =
        $.ajax({
            url: `PB/Public/newpagetablev1`,
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
                error_handler(xhr, `PB/Public/newpagetablev1`);
            }
        }), strReturn = "";

    strReturn = output.responseText

    return strReturn;
}

function changeTabByClick(namePage, id) {

    stageId_PurchaseOrderCartable = +id;
    pageName = namePage;
    pageTableModel.pagetable_id = pageName;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == `pagetable_p_${id}`);

    if (arr_pagetables.findIndex(a => a.pagetable_id == `pagetable_p_${id}`) < 0) {
        pageTableModel = {
            pagetable_id: `pagetable_p_${id}`,
            editable: false,
            pagerowscount: 15,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            endData: false,
            filteritem: "",
            filtervalue: "",
            getpagetable_url: viewData_getpagetable_url,
        };
        arr_pagetables.push(pageTableModel);
    } else {
        arr_pagetables[index].pagetable_id = `pagetable_p_${id}`
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
        arr_pagetables[index].getpagetable_url = viewData_getpagetable_url
    }

    if (pagetable_formkeyvalue.length == 1) {
        pagetable_formkeyvalue = ["", "", $("#userType").prop("checked") ? "my" : "all", $("#userType").prop("checked") ? 0 : null];
    }
    if (id > 0) {
        pagetable_formkeyvalue[0] = id;
        pagetable_formkeyvalue[1] = "stageId";
    }

    get_NewPageTableV1(pageName);
}

function clearForm() {
    $("#stageId").empty();
    $("#stageId").trigger("change");
    $('#inOut').val('');
    $("treasurySubjectId").empty();
    $("#treasurySubjectId").val(0).trigger("change");
    $("#noSeriesId").empty();
    $("#noSeriesId").trigger("change");
    $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
    $("#note").val("");
}

function getInOutStage(id) {
    let url = `${viewData_baseUrl_WF}/StageApi/getinout`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        success: function (result) {

            $('#inOut').val('')
            let InOutName
            if (result != null || result != NaN) {
                InOutName = (result == 1 ? "بدهکار" : "بستانکار")
                $('#inOut').val(InOutName)
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function modalClearItemsFormpurchase() {
    $('#note').val('')
}

function getdataByStageId(model) {

    getStageStep(model).then((response) => {

        if (checkResponse(response)) {

            isExistStageStep = true;
            currentIsTreasurySubject = response.isTreasurySubject;
            currentPriority = response.priority;
          
            fillStagePreviousInfo(model.workflowId, model.stageId, response.actionId);

            if (response.isTreasurySubject) {
                $("#treasurySubjectId").empty();
                fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${model.stageId}/1/1`);
            }

        }
        else
            isExistStageStep = false;
    });
}

function chekExistPersonOrderline(personOrderId) {
    var result = $.ajax({
        url: `api/PU/PurchaseOrderLineApi/getPurchasePersonLineQuantity`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(personOrderId),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `api/PU/PurchaseOrderLineApi/getPurchasePersonLineQuantity`);
            return 0;
        }
    });

    return result.responseJSON;
}

function fillEditPersonOrder(personOrder) {

    statusId = personOrder.actionId;
    if (personOrder.inOut === 2) {
        $("#returnReason").addClass("displaynone");

        $("#returnReasonId").val("").prop('required', false).removeAttr('data-parsley-selectvalzero');
    }
    else if (personOrder.inOut === 1) {
        fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
        $("#returnReason").removeClass("displaynone");
        $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
    }

    $("#inOut").val(personOrder.inOutName);

    $("#orderDatePersian").val(personOrder.orderDatePersian);
    $("#actionId").val(personOrder.actionId);

    $("#branchId").val(personOrder.branchId).trigger("change.select2");

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${personOrder.branchId}/1/1`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(personOrder.workflowId).trigger("change.select2");

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${personOrder.branchId}/${personOrder.workflowId}/1/1/0/1`);
    $("#stageId").val(personOrder.stageId).trigger("change.select2");


    fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${personOrder.stageId}/1/1`);
    $("#treasurySubjectId").val(personOrder.treasurySubjectId).trigger("change.select2");


    let model = {
        id: +personOrder.treasurySubjectId,
        stageId: +personOrder.stageId,
        branchId: +personOrder.branchId,
    };

    fillEditNoSeriesListWhitGlSgl(model, personOrder.noSeriesId, personOrder.accountDetailId);

    $("#returnReasonId").val(personOrder.returnReasonId).trigger("change.select2");

    $("#note").val(personOrder.note);

    fillStagePreviousInfo(personOrder.workflowId, personOrder.stageId, personOrder.actionId);

    


    $("#branchId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#treasurySubjectId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);
    $("#noSeriesId").prop("disabled", true);
    $('#inOut').prop("disabled", true);
    $('#workFlowId').prop("disabled", true);
    $("#orderDatePersian").prop("disabled", true);
    $("#note").prop("disabled", true);

    existPersonOrderLine = chekExistPersonOrderline(personOrder.id);
    isDisablenoSeriesId = {
        flg: (existPersonOrderLine > 0 ? false : true),
        edit: false
    };
}

function fillEditNoSeriesListWhitGlSgl(model, noSeriesId, accountDetailId) {
    $.ajax({
        url: `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`,
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {

            if (typeof result !== "undefined" && result != null) {
                $("#accountGLId").val(+result.accountGLId == 0 ? "" : `${+result.accountGLId} - ${result.accountGLName}`);
                $("#accountGLId").data("value", result.accountGLId);
                $("#accountSGLId").val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $("#accountSGLId").data("value", result.accountSGLId);
                $("#noSeriesId").empty();
                $("#noSeriesId").prop("disabled", false).prop("required", true);
                fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `1/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                $("#noSeriesId").val(noSeriesId).trigger("change.select2");
                $("#accountDetailId").empty();
                $("#accountDetailId").prop("disabled", false).prop("required", true);
                if ($("#noSeriesId").val() > 0) {
                    getModuleListByNoSeriesIdUrl(+noSeriesId, "accountDetailId");
                    $("#accountDetailId").val(accountDetailId).trigger("change.select2");
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`);
        }
    });
}

async function IsShownoSeries(personOrderId) {

    await $.ajax({
        url: `api/PU/PurchaseOrderLineApi/getPurchasePersonLineQuantity/${personOrderId}`,
        type: "get",
        contentType: "application/json",
        success: function (result) {

            isDisablenoSeriesId = {
                flg: result,
                edit: true
            };
            if (isDisablenoSeriesId.flg) {
                $("#noSeriesId").prop('disabled', true)
                $("#accountDetailId").prop('disabled', true)
            }
            else {
                $("#noSeriesId").prop("disabled", false)
                $("#accountDetailId").prop("disabled", false)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
            return null;
        }
    });


}

function modal_save(modal_name = null, enter_toline = false) {
    isExistStageStep = true;
    save(modal_name, enter_toline);
}

function save(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {
        id: +$("#modal_keyid_value").text(),
        branchId: +$("#branchId").val(),
        stageId: +$("#stageId").val(),
        orderDatePersian: $("#orderDatePersian").val(),
        treasurySubjectId: +$("#treasurySubjectId").val(),
        note: $("#note").val(),
        actionId: +$("#actionId").val(),
        returnReasonId: +$("#returnReasonId").val(),
        accountDetailId: +$("#accountDetailId").val(),
        noSeriesId: +$("#noSeriesId").val(),
        inOut: +$('#inOut').val().split("-")[0],
        workFlowId: $('#workFlowId').val(),
    }

    if (!isExistStageStep) {// StageActionبررسی وجود 
        alertify.warning('گام تعریف نشده است!').delay(alertify_delay);
        return;
    }

    if (modal_open_state == "Edit") {
        recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {
            if (result.successfull) {
                if (result.id > 0) {
                    stageId_PurchaseOrderCartable = newModel.stageId;
                    modal_close();
                    $(".modal-backdrop.fade.show").remove();

                    if (enter_toline) {

                        navigation_item_click(`/PU/PurchaseOrderLine/${result.id}/1`);
                        conditionalProperties.isCartable = true;
                    }

                    else
                        get_NewPageTableV1(pageName);
                }
                else
                    alertify.error('عملیات ویرایش با خطا مواجه شد.').delay(alertify_delay);
            }
            else {
                if (result.validationErrors.length > 0) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);
                }
            }
        });
    }
}

function run_button_OrderDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("PurchaseOrderApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/PU/PurchaseOrderLine/${lineId}/0`, "ثبت سفارش (ارزی)");
    conditionalProperties.isCartable = true;
}

function run_button_OrderDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize("PurchaseOrderApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/PU/PurchaseOrderLine/${lineId}/1`, "ثبت سفارش (ریالی)");
    conditionalProperties.isCartable = true;
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize("PurchaseOrderApi", "VIW");
    if (!check)
        return;

    var workflowid = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonOrder(`/PU/PurchaseOrderLine/display/${id}/1/${stageId_PurchaseOrderCartable}/${workflowid}`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize("PurchaseOrderApi", "VIW");
    if (!check)
        return;

    var workflowid = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonOrder(`/PU/PurchaseOrderLine/display/${id}/0/${stageId_PurchaseOrderCartable}/${workflowid}`);
}

function run_button_printFromPlateHeaderLine(id) {


    var check = controller_check_authorize("PurchaseOrderApi", "PRN");
    if (!check)
        return;

    var p_id = "id";
    var p_value = id;
    var p_type = 8;
    var p_size = 0;

    var reportParameters = [
        { Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "StageName", Value: "سفارش خرید", itemType: "Var" },
    ]

    stimul_reportHeaderLine(reportParameters);
}

function stimul_reportHeaderLine(reportParameters) {
    var print_file_url = `${stimulsBaseUrl.PU.Prn}PurchaseOrderOfficial.mrt`;
    var reportModel = {
        reportUrl: print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function run_button_showStepLogsPurchaseOrderCartable(id, rowno) {
  
    activePageTableId = pageName
    idForStepAction = id
    selectedRowId = `row${rowno}`;
    currentStageId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("stageid");
    currentWorkFlowId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("workflowid");
    var currentActionId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("actionid");
    var documentDatePersian = $(`#${pageName} #parentPageTableBody tr#${selectedRowId}`).data("orderdatepersian");
    var currentBranchId  = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("branchid");
    var parentWorkflowCategoryId = +workflowCategoryIds.purchase.id;
    stageActionLogCurrent = {
        identityId: id,
        stageId: currentStageId,
        actionId: currentActionId,
        workFlowId: currentWorkFlowId,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId
    }
    $(`#actionPurchasePersonOrders`).empty();

    let stageClassIds = "1";
    
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionPurchasePersonOrders", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.purchase.id}/true/${stageClassIds}`);
    $(`#actionPurchasePersonOrders`).val(currentActionId).trigger("change");

    stepLogPurchasePersonOrders(id, currentStageId, currentWorkFlowId);

    modal_show("stepLogModalPurchasePersonOrders");
}

function run_button_deletePersonOrdersCartable(p_keyvalue, rowno, elem, ev) {


    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var purchaseInfo = getPurchaseOrderInfo(p_keyvalue);
    purchaseInfo.parentWorkflowCategoryId = workflowCategoryIds.purchase.id;
    purchaseInfo.StageClass = "1";
    var resultValidate = checkHeaderDeletePermission(purchaseInfo);


    if (resultValidate) {
        return;
    }
    else {

        alertify.confirm('', msg_delete_row,
            function () {

                $.ajax({
                    url: viewData_deleterecord_url,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(p_keyvalue),
                    async: false,
                    cache: false,
                    success: function (result) {

                        if (result.successfull == true) {

                            var pagetableid = $(elem).parents(".card-body").attr("id");

                            get_NewPageTableV1(pagetableid, false, () => callbackAfterFilterV1(pagetableid));

                            var msg = alertify.success('حذف سطر انجام شد');
                            msg.delay(alertify_delay);
                        }
                        else {

                            if (result.statusMessage !== undefined && result.statusMessage !== null) {
                                var msg = alertify.error(result.statusMessage);
                                msg.delay(alertify_delay);
                            }
                            else if (result.validationErrors !== undefined) {
                                generateErrorValidation(result.validationErrors);
                            }
                            else {
                                var msg = alertify.error(msg_row_create_error);
                                msg.delay(2);
                            }
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, viewData_deleterecord_url)
                    }
                });

            },
            function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }

}

function navigateToModalPersonOrder(href) {

    initialPage();
    $("#contentdisplayPersonOrderLine #content-page").addClass("displaynone");
    $("#contentdisplayPersonOrderLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayPersonOrderLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayPersonOrderLine #loader,#contentdisplayPersonOrderLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayPersonOrderLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayPersonOrderLine #form,#contentdisplayPersonOrderLine .content").css("margin", 0);
    $("#contentdisplayPersonOrderLine .itemLink").css("pointer-events", " none");
}

$('#displayPersonOrderLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [`${stageId_PurchaseOrderCartable}`, 'stageId', switchUser, null];

});

$("#stageId").on("change", function () {

    $("#stagePreviousList").empty();
    $("#stageItemTypeList").empty();
    $('#inOut').val("");
    $("treasurySubjectId").empty();
    $("#treasurySubjectId").val(0).trigger("change");
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();

    var stageId = +$(this).val();

    if (stageId !== 0) {

        let model = {
            stageId: +stageId,
            priority: 1,
            workflowId: +$("#workFlowId").val()
        };

        getdataByStageId(model);

        modalClearItemsFormpurchase();

        var inOutResult = getInOutStage(stageId);

        if (inOutResult != null || inOutResult != NaN) {
            let InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
            $('#inOut').val(InOutName);
            $('#inOut').data("value", inOutResult);
        }
    }

    if ($('#inOut').data("value") === 2) {
        $("#returnReason").addClass("displaynone");
        $("#returnReasonId").val("").trigger("change");
        $("#returnReasonId").val("").prop('required', false).removeAttr('data-parsley-selectvalzero');

    }
    else {
        $("#returnReason").removeClass("displaynone");
        $("#returnReasonId").html(`<option value="0">انتخاب کنید</option>`);
        fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
        $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
    }

    $("#note").suggestBox({
        api: `/api/FM/JournalDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [stageId],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });
})

$("#treasurySubjectId").on("change", function () {

    if (+$(this).val() > 0) {
        $("#noSeriesId").empty();
        $("#accountDetailId").empty();

        var model = {
            id: +$(this).val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
        };

        GetnoSeriesListWhitGlSgl(model, 1);
    }
});

$("#noSeriesId").on("change", function (ev) {

    var noSeriesId = +$(this).val();
    if (!isDisablenoSeriesId.edit) {
        if ((noSeriesId == 0 || noSeriesId == null)) {
            $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
        }
        else {
            $("#accountDetailId").prop("disabled", false).prop("required", true)
            $("#accountDetailId").empty();
            getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
        }
    }
    else {
        if (isDisablenoSeriesId.flg) {
            $("#accountDetailId").prop("disabled", true).prop("required", false)
        }
        else {
            if ((noSeriesId == 0 || noSeriesId == null)) {
                $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
            }
            else {
                $("#accountDetailId").prop("disabled", false).prop("required", true)
                $("#accountDetailId").empty();
                getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
            }

        }

    }

});

$("#branchId").change(function () {
    let branchId = +$(this).val();
    $("#workFlowId").empty();
    clearForm();
    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/1/1`, false, 0, 'انتخاب کنید', undefined, "", true);

});

$("#workFlowId").change(function () {
    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    clearForm();
    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/1/1/0/1`);
});

$("#AddEditModal").on({
    "hidden.bs.modal": function () {
        $("#noSeriesId").prop("disabled", true).val(0).trigger("change");
        $("#accountDetailId").prop("disabled", true).val(0).trigger("change");
        $("#treasurySubjectId").val(0).trigger("change");
        $("#note").val("").trigger("change");
        $("#stagePreviousList").html("");
        $("#stageItemTypeList").html("");
        $(".currentStage").text("-");

    },
    "shown.bs.modal": function () {

        if (modal_open_state != "Add") {
            $("#treasurySubjectId").select2("focus");
            $("#branchId").prop("disabled", true);
            $("#workFlowId").prop("disabled", true);
            $("#stageId").prop("disabled", true);
        }
        $("#orderDatePersian").val(moment().format('jYYYY/jMM/jDD'));
    }
});

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", null];

    else
        pagetable_formkeyvalue = ["", "", "all", null];

    if (stageId_PurchaseOrderCartable > 0) {
        pagetable_formkeyvalue[0] = stageId_PurchaseOrderCartable;
        pagetable_formkeyvalue[1] = "stageId";
    }
    getPurchasePersonOrdersTab();

});

initPurchasePersonOrdersGroup();





