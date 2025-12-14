
var viewData_form_title = "سفارش خرید / برگشت",
    viewData_controllername = "PurchaseOrderApi",
    viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/update`,
    viewData_getrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyid`,
    viewData_filter_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.PU.Prn}PersonOrder.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`,
    viewData_request_list = `${viewData_baseUrl_PU}/${viewData_controllername}/personorderrequest_getdropdown`,
    statusId = 0,
    isExistStageStep = false,
    existPersonOrderLine = 0,
    personOrderLinecount = false,
    idForStepAction = "";

var isDisableNoSeriesId = {
    flg: true,
    edit: false
};

function initForm() {
    $("#stimul_preview").remove()
    
    $(".select2").select()
    $("#orderDatePersian").inputmask();
    kamaDatepicker('orderDatePersian', { withTime: false, position: "bottom" });

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)     
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    $(".button-items").prepend($(".toggle"));
    pagetable_formkeyvalue = ["myadm", 0];

    $('<div id="quickSearchContainer" style="display: contents;"></div>').insertBefore(".button-items .toggle")
  
    loadDropdownPurchaseOrderIndex()

    get_NewPageTableV1();

    $("#note").suggestBox({
        api: `/api/FM/JournalDescriptionApi/search`,
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

function loadDropdownPurchaseOrderIndex() {
    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true, 0, false);
}

function callBackSearche() {
    return +$("#stageId").val() > 0
}

function export_csv(elemId = undefined) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];


    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                Filters: arrSearchFilter[index].filters,
                Form_KeyValue: pagetable_formkeyvalue
            }
        }

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {

                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
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

function run_button_editPersonOrders(personOrderId, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var isDataEntry = $(`#row${rowNo}`).data("isdataentry");

    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }


    personOrderLinecount = existPersonOrderLine > 0 ? true : false;
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

    fillStagePreviousInfo(personOrder.workflowId, personOrder.stageId, personOrder.actionId);

    $("#note").val(personOrder.note);


    $("#accountDetailId").prop("disabled", true);
    $("#noSeriesId").prop("disabled", true);



    $("#branchId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#treasurySubjectId").prop("disabled", true);
    $('#inOut').prop("disabled", true);
    $('#workFlowId').prop("disabled", true);
    $('#note').prop("disabled", true);

    existPersonOrderLine = chekExistPersonOrderline(personOrder.id);
    isDisableNoSeriesId = {
        flg: (existPersonOrderLine > 0 ? false : true),
        edit: false
    };


    $("#orderDatePersian").val(personOrder.orderDatePersian);
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

function modal_save(modal_name = null, enter_toline = false) {

    if (+$("#modal_keyid_value").text() > 0) {
        var model = {
            stageId: +$("#stageId").val(),
            actionId: statusId,
            workflowId: +$("#workFlowId").val()
        };

        getStageStep(model).then(result => {
            if (result != null && result != undefined && result.isLastConfirmHeader) {
                var msg = alertify.error('مجاز به ویرایش سطر در گام جاری نمی باشید');
                msg.delay(alertify_delay);
            }
            else {
                isExistStageStep = true;
                save(modal_name, enter_toline);
            }
        });
    }
    else {
        save(modal_name, enter_toline);
    }

    //save(modal_name, enter_toline);
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

function save(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);

    if (!validate)
        return;

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
    let hasStageFundItemType = getHasStageFundItemType(newModel.stageId);

    if (!hasStageFundItemType) {
        var msg = alertify.error("تنظیمات برگه برای این مرحله انجام نشده ، به مدیر سیستم اطلاع دهید");
        msg.delay(alertify_delay);
        return;
    }
    else {
        if (modal_open_state == "Add") {
            recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {
                if (result.successfull) {
                    if (result.id > 0) {
                        modal_close();
                        $(".modal-backdrop.fade.show").remove();

                        if (enter_toline)
                            navigation_item_click(`/PU/PurchaseOrderLine/${result.id}/1`);
                        else
                            get_NewPageTableV1();
                    }
                    else
                        alertify.error('عملیات ثبت با خطا مواجه شد.').delay(alertify_delay);
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
        else if (modal_open_state == "Edit") {
            recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {
                if (result.successfull) {
                    if (result.id > 0) {

                        modal_close();
                        $(".modal-backdrop.fade.show").remove();

                        if (enter_toline)
                            navigation_item_click(`/PU/PurchaseOrderLine/${result.id}/1`);
                        else
                            get_NewPageTableV1();
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
}

function run_button_orderDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/PU/PurchaseOrderLine/${lineId}/1`, "ثبت سفارش (ریالی)");
}

function run_button_orderDetailAdvance(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/PU/PurchaseOrderLine/${lineId}/0`, "ثبت سفارش (ارزی)");
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonOrder(`/PU/PurchaseOrderLine/display/${id}/1/${stageId}/${workflowId}`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonOrder(`/PU/PurchaseOrderLine/display/${id}/0/${stageId}/${workflowId}`);
}

function run_button_printFromPlateHeaderLine(id) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
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

function run_button_showStepLogsPurchaseOrderCartable(id, rowno) {
    
    idForStepAction = id
    activePageTableId = "pagetable"
    selectedRowId = `row${rowno}`;

    var currentIdentityId = id;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var documentDatePersian = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("orderdatepersian");
    var currentBranchId = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var parentWorkflowCategoryId = +workflowCategoryIds.purchase.id;
    stageActionLogCurrent = {
        identityId: currentIdentityId,
        stageId: currentStageId,
        actionId: currentActionId,
        workFlowId: currentWorkFlowId,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId
    }

    $(`#actionPurchasePersonOrders`).empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionPurchasePersonOrders", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.purchase.id}/true/${stageClassIds}`);

    var currentActionId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("actionid");
    $(`#actionPurchasePersonOrders`).val(currentActionId).trigger("change");

    stepLogPurchasePersonOrders(id, currentStageId, currentWorkFlowId);

    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalPurchasePersonOrders");
}

function run_button_delete(p_keyvalue, rowno, elem, ev) {


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

$("#AddEditModal").on({
    "hidden.bs.modal": function () {
        $("#noSeriesId").prop("disabled", true).val(0).trigger("change");
        $("#accountDetailId").prop("disabled", true).val(0).trigger("change");
        $("#treasurySubjectId").val(0).trigger("change");
        $("#note").val("").trigger("change");
        $("#stagePreviousList").html("");
        $("#stageItemTypeList").html("");
        $(".currentStage").text("-");
        $("#treasurySubjectId").select2("focus");
        $("#branchId").prop("disabled", false);
        $("#workFlowId").prop("disabled", false);
        $("#stageId").prop("disabled", false);
        $("#orderDatePersian").prop("disabled", false);
        $('#note').prop("disabled", false);

    },
    "shown.bs.modal": function () {

        if (modal_open_state == "Add") {
            $("#orderDatePersian").val(moment().format('jYYYY/jMM/jDD'));
            isDisableNoSeriesId = {
                flg: false,
                edit: false
            };
            $("#branchId").select2("focus");
            $("#branchId").prop('disabled', false).trigger("change");
            $("#workFlowId").prop("disabled", false);
            $("#stageId").prop("disabled", false);
            $("#noSeriesId").prop("disabled", false);

            $("#noSeriesId").prop("required", false).val(0).trigger("change")
            $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")

            $("#returnReason").addClass("displaynone");
            $("#treasurySubjectId").prop("disabled", false);
            $("#treasurySubjectId").empty();

            $("#treasurySubjectId").val(0).trigger("change");
            $('#note').prop("disabled", false);
            $("#note").val("").trigger("change");
            $("#orderDatePersian").prop("disabled", false);
            $("#open-datepicker-orderDatePersian").prop("disabled", false);
        }
        else {

            $("#treasurySubjectId").select2("focus");
            $("#branchId").prop("disabled", true);
            $("#workFlowId").prop("disabled", true);
            $("#stageId").prop("disabled", true);
            $("#orderDatePersian").prop("disabled", true);
            $("#open-datepicker-orderDatePersian").prop("disabled", true);
            $('#note').prop("disabled", true);
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

    $('#note').val('');

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
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    if (+$(this).val() > 0 && modal_open_state != "Edit") {


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
    if (!isDisableNoSeriesId.edit) {
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
        if (isDisableNoSeriesId.flg) {
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

$("#userType").on("change", function () {
 
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check) {
        $("#userType").prop('disabled', true);
        return;
    }
       

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];

    get_NewPageTableV1();

});

$('#displayPersonOrderLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "myadm"
    } else {
        switchUser = "alladm"
    }
    pagetable_formkeyvalue = [switchUser, 0];
});

$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";
    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    var userId = null;
    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        //{ Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "StageId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

initForm();