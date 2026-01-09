var viewData_form_title = "درخواست های انبار",
    viewData_controllername = "ItemRequestApi",
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`,
    viewData_insrecord_url_itemRequest = `${viewData_baseUrl_WH}/WarehouseTransactionApi/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/update`,
    statusId = 0,
    selectedRowId = "";


function initForm() {

    $("#transactionDatePersian").inputmask();
    kamaDatepicker('transactionDatePersian', { withTime: false, position: "bottom" });
    $("#transactionDatePersian").val(moment().format('jYYYY/jMM/jDD'));

    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true, 0, false);


    $("#note").suggestBox({
        api: `/api/WH/WarehouseDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });
}

function callBackSearche() {
    return +$("#stageId").val() > 0
}

$("#AddEditModalItemRequest").on("show.bs.modal", function () {

    $("#transactionDatePersian").inputmask();


    if (modal_open_state == "Add") {
        //$("#warehouseId").prop('disabled', false);
        $("#workFlowId").prop('disabled', false);
        //$("#noSeriesId").prop("required", false).val(0).trigger("change")
        //$("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
        $("#stageId").val(0).trigger('change.select2');
        $("#branchId").prop('disabled', false).trigger("change");
        $("#stageId").prop('disabled', false);
        $("#transactionDatePersian").val(moment().format('jYYYY/jMM/jDD'))
        $("#note").prop('disabled', false);
        $("#note").val("").trigger("change");
        $("#transactionDatePersian").prop("disabled", false);
        $("#open-datepicker-transactionDatePersian").prop("disabled", false);
    }
    else {

        $("#transactionDatePersian").prop("disabled", true);
        $("#open-datepicker-transactionDatePersian").prop("disabled", true);
    }

});

$("#branchId").change(function () {
    let branchId = +$(this).val();

    clearFormWhitBranchId();

    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/11/1`, false, 0, 'انتخاب کنید', undefined, "", true);

});

$("#workFlowId").change(function () {

    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();

    clearFormWorkFlowId();

    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/11/1/0/1`);
});

$("#stageId").change(function () {

    clearFormStageId();

    var stageId = +$(this).val();

    if (stageId !== 0 && modal_open_state == "Add") {

        var inOutResult = getInOutStage(stageId);

        if (inOutResult != null || inOutResult != NaN) {
            let InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
            $('#inOut').val(InOutName);
            $('#inOut').data("value", inOutResult);
        }
    }

    $("#note").suggestBox({
        api: `/api/WH/WarehouseDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });

    $("#note").val("").trigger("change");
});

$("#AddEditModalItemRequest").on("hide.bs.modal", function () {
    $("#transactionDatePersian").val("");
    $("#note").val("").trigger("change");
    $(".currentStage").text("-");
});

function modal_save(modal_name = null, enter_toline = false) {

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
        workflowId: +$("#workFlowId").val(),
        stageId: +$("#stageId").val(),
        note: $("#note").val(),
        transactionDatePersian: $("#transactionDatePersian").val(),
        createDateTime: $("#createDateTime").val(),
        actionId: $("#actionId").val(),
        inOut: +$('#inOut').data("value"),

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
                            navigation_item_click(`/WH/ItemRequestLine/${result.id}/1`);
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
                            navigation_item_click(`/WH/ItemRequestLine/${result.id}/1`);
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

function run_button_editItemRequest(id, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var isDataEntry = $(`#row${rowNo}`).data("isdataentry");

    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }
    var bySystem = $(`#row${rowNo}`).data("bysystem");
    if (bySystem) {
        var msg = alertify.warning("امکان ویرایش سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var modal_name = "AddEditModalItemRequest";
    $(".modal").find("#modal_title").text("ویرایش درخواست انبار");


    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $("#modal_keyid_value").text(id);
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

    let viewData_getrecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getrecordbyid`;
    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                if (result.isDataEntry == 1 || result.isDataEntry == 2) {
                    fillEditItemRequest(result);
                    modal_show(modal_name);
                }
                else {
                    alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });


}

function fillEditItemRequest(itemTransaction) {

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${+itemTransaction.branchId}/11/1`, false, 0, 'انتخاب کنید', undefined, "", true);

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${+itemTransaction.branchId}/${+itemTransaction.workflowId}/11/1/0/1`);

    var inOutResult = getInOutStage(+itemTransaction.stageId);

    if (inOutResult != null || inOutResult != NaN) {
        let InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
        $('#inOut').val(InOutName);
        $('#inOut').data("value", inOutResult);
    }

    $("#no").val(itemTransaction.no);
    $("#createDateTime").val(itemTransaction.createDateTime);
    $("#actionId").val(itemTransaction.actionId);
    $("#branchId").val(itemTransaction.branchId).trigger("change.select2");
    $("#stageId").val(itemTransaction.stageId).trigger("change.select2");

    $("#workFlowId").val(itemTransaction.workflowId).trigger("change.select2");
    $("#transactionDatePersian").removeAttr("data-parsley-dateissame");


    $(`#documentTypeId`).val(itemTransaction.documentTypeId == 0 ? "" : `${itemTransaction.documentTypeName}`);
    $(`#documentTypeId`).data("value", itemTransaction.documentTypeId);
    var documentType = getStageDocumentType(itemTransaction.stageId);
    $(`#documentTypeId`).prop("required", documentType.stageClassId != 1);

    $("#transactionDatePersian").val(itemTransaction.transactionDatePersian);
    $("#note").val(itemTransaction.note).trigger("change");

    $("#branchId").prop("disabled", true);

    $("#workFlowId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#note").prop("disabled", true);
}

function clearFormWhitBranchId() {

    $("#workFlowId").empty();

    $("#stageId").empty();
    $("#note").val("");
    $("#stagePreviousList").html("");
    $("#stageItemTypeList").html("");
    $('#inOut').val("");
}

function clearFormWorkFlowId() {

    $("#stageId").empty();
    $("#note").val("");
    $("#stagePreviousList").html("");
    $("#stageItemTypeList").html("");
    $('#inOut').val("");
}

function clearFormStageId() {

    $("#note").val("");
    $("#stagePreviousList").html("");
    $("#stageItemTypeList").html("");
    $('#inOut').val("");
}



initForm();