var viewData_form_title = "تراکنش های انبار",
    viewData_controllername = "ItemTransactionApi",
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`,
    viewData_insrecord_url_itemTransaction = `${viewData_baseUrl_WH}/WarehouseTransactionApi/insertTransaction`,
    viewData_updrecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/updateTransaction`,
    viewData_request_list = `${viewData_baseUrl_WH}/${viewData_controllername}/request_getdropdown`,
    statusId = 0,
    isRequest = 0,
    stageclassIds = "3,4,8,11,14,15",
    shamsiTransactionDate = "",
    workflowCategoryId = 11,
    itemTransactionRequestId = null,
    itemTransactionIdentityId = null,
    isLoadEdit = false;

function initForm() {
    $("#transactionDatePersian").inputmask();
    kamaDatepicker('transactionDatePersian', { withTime: false, position: "bottom" });

    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true, 0, false);



    $(`#accountDetailId`).select2();

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

function clearItemTransactionForm(type) {

    //branch
    if (type == 1) {
        $("#warehouseId").empty();
        $("#workFlowId").empty();
    }
    //workflow
    else if (type == 2) {
        $("#stageId").empty();
    }

    $("#requestId").empty();
    $("#accountGLId").empty();
    $("#accountSGLId").empty();
    $("#accountGLId").val("");
    $("#accountSGLId").val("");
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    $("#documentTypeId").val("");
    $("#treasurySubjectId").empty();
    $("#divtreasurySubjectId").addClass("displaynone");
    $("#stagePreviousList").html("");
    $("#stageItemTypeList").html("");
    $('#inOut').val("")
}

function modal_save(modal_name = null, enter_toline = false) {
    if (+$("#modal_keyid_value").text() > 0) {
        var model = {
            stageId: +$("#stageId").val(),
            actionId: statusId
        };

        getStageStep(model).then(result => {
            if (result != null && result != undefined && result.isLastConfirmHeader) {
                var msg = alertify.error('مجاز به ویرایش سطر در گام جاری نمی باشید');
                msg.delay(alertify_delay);
            }
            else {
                save(modal_name, enter_toline);
            }
        });
    }
    else {
        save(modal_name, enter_toline);
    }
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
        workFlowId: $('#workFlowId').val(),
        stageId: +$("#stageId").val(),
        requestId: +$("#requestId").val(),
        treasurySubjectId: +$("#treasurySubjectId").val(),
        accountGLId: $("#accountGLId").data("value"),
        accountSGLId: $("#accountSGLId").data("value"),
        accountDetailId: +$("#accountDetailId").val(),
        documentTypeId: $("#documentTypeId").data("value"),
        noSeriesId: +$("#noSeriesId").val(),
        warehouseId: +$("#warehouseId").val(),
        transactionDatePersian: $("#transactionDatePersian").val(),
        note: $("#note").val(),
        createDateTime: $("#createDateTime").val(),
        actionId: $("#actionId").val(),
        inOut: +$('#inOut').data("value"),
        parentWorkflowCategoryId: (workflowCategoryId != null ? +workflowCategoryId : 0),

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
                            navigation_item_click(`/WH/ItemTransactionLine/${result.id}/1/0`);
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
                            navigation_item_click(`/WH/ItemTransactionLine/${result.id}/1/0`);
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


function run_button_editItemTransaction(id, rowNo, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var isDataEntry = $(`#row${rowNo}`).data("isdataentry");
    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }
    var modal_name = "AddEditModalItemTransaction";

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

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



    let url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getrecordbyid`;
    $.ajax({
        url: url,
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
                    fillEditItemTransaction(result);
                    modal_show(modal_name);
                }
                else {
                    alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });


}

function fillEditItemTransaction(itemTransaction) {

    $("#branchId").val(+itemTransaction.branchId).trigger("change.select2");

    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getDropDownByUserId`, "warehouseId", true, itemTransaction.branchId);

    $("#warehouseId").val(itemTransaction.warehouseId).trigger("change.select2");

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${+itemTransaction.branchId}/11/${stageclassIds}`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(+itemTransaction.workflowId).trigger("change.select2");


    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${+itemTransaction.branchId}/${+itemTransaction.workflowId}/11/${stageclassIds}/0/1`);
    $("#stageId").val(itemTransaction.stageId).trigger("change.select2");


    $("#requestId").empty();

    itemTransactionRequestId = itemTransaction.requestId == 0 ? null : itemTransaction.requestId;
    itemTransactionIdentityId = itemTransaction.id == 0 ? null : itemTransaction.id;

    var parentWorkflowCategoryId = itemTransaction.parentWorkflowCategoryId;
    getItemTransactiondataByStageId(+itemTransaction.stageId, +itemTransaction.workflowId, +itemTransactionIdentityId, parentWorkflowCategoryId);

    fill_select2(viewData_request_list, "requestId", true, `${+itemTransaction.branchId}/${+itemTransaction.workflowId}/${+itemTransaction.stageId}/${+itemTransactionRequestId}/${+itemTransactionIdentityId}`, false, 0, "انتخاب درخواست");

    $("#requestId").data("val", itemTransaction.requestId);

    var inOutResult = getInOutStage(+itemTransaction.stageId);

    if (inOutResult != null || inOutResult != NaN) {
        let InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
        $('#inOut').val(InOutName);
        $('#inOut').data("value", inOutResult);
    }


    $("#note").val(itemTransaction.note).trigger("change");
    $("#createDateTime").val(itemTransaction.createDateTime);
    statusId = itemTransaction.actionId;
    $("#actionId").val(itemTransaction.actionId);

    $("#transactionDatePersian").val(itemTransaction.transactionDatePersian);

    shamsiTransactionDate = itemTransaction.parentTransactionDatePersian ?? '';

    $("#noSeriesId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);

    $("#noSeriesId").data("value",itemTransaction.noSeriesId);
    $("#accountDetailId").data("value", itemTransaction.accountDetailId);

    $("#branchId").prop("disabled", true);
    $("#warehouseId").prop("disabled", true);
    $("#workFlowId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#requestId").prop("disabled", true);
    $("#note").prop("disabled", true);
}

function setGlSglInfoItemTransaction(model) {

    $.ajax({
        url: `${viewData_baseUrl_FM}/PostingGroupApi/getglsgl`,
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {

            if (typeof result !== "undefined" && result != null) {

                $("#accountGLId").val(result.accountGLId == 0 ? "" : `${result.accountGLId} - ${result.accountGLName}`);
                $("#accountGLId").data("value", result.accountGLId);
                $("#accountSGLId").val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $("#accountSGLId").data("value", result.accountSGLId);
            }
            else {
                $("#accountGLId").val("");
                $("#accountGLId").data("value", 0);
                $("#accountSGLId").val("");
                $("#accountSGLId").data("value", 0);
            }
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`);
        }
    });

}

function getItemTransactiondataByStageId(stageId, workFlowId, itemTransactionIdentityId,parentWorkflowCategoryId) {

    let model = {};

    if (!isLoadEdit) {
        model = {
            stageId: stageId,
            priority: 1,
            workFlowId: workFlowId
        };
    }
    else {
        model = {
            stageId: stageId,
            actionId: statusId,
            workFlowId: workFlowId
        };
    }

    getStageStep(model).then((response) => {

        model = {
            headerId: +$("#stageId").val(),
            stageId: +stageId,
            branchId: +$("#branchId").val(),
            postingGroupTypeId: 11
        }

        if (checkResponse(response)) {

            currentPriority = response.priority;

            if (response != undefined && response.actionId > 0) {
                fillStagePreviousInfo(workFlowId, stageId, response.actionId);
            }

            $("#requestId").empty().prop("disabled", true);
            $("#requestId").prop("required", false);
            $("#requestId").prop("data-parsley-selectvalzero", false);
            $("#requestId").prop("data-parsley-checkglsglrequied", true);


            var documentType = getStageDocumentType(stageId);
            $("#documentTypeId").val(documentType.id != 0 ? `${documentType.id} - ${documentType.name}` : "");
            $(`#documentTypeId`).data("value", documentType.id);
            tempDocumentTypeId = documentType.id;



            $("#accountGLId").empty();
            $("#accountSGLId").empty();
            $("#accountGLId").val("");
            $("#accountSGLId").val("");

            $("#stageId").prop("data-parsley-checkglsglrequied", true);

            setGlSglInfoItemTransaction(model);

            if (response.isRequest) {

                $("#requestId").prop("required", true);
                $("#requestId").prop("data-parsley-selectvalzero", true);
                $("#requestId").prop("data-parsley-checkglsglrequied", true);
                $("#requestId").prop("disabled", modal_open_state == "Add" ? false : true);


                $("#transactionDatePersian").attr("data-parsley-transactiondateissame", "");


                var requestIdVal = +$("#requestId").data("val");

                if (requestIdVal > 0 && modal_open_state != "Add") {

                    fill_select2(viewData_request_list, "requestId", true, `${+$("#branchId").val()}/${+$("#workFlowId").val()}/${+$("#stageId").val()}/${requestIdVal}/${+itemTransactionIdentityId}`, false, 3, "انتخاب درخواست", undefined, "", true);
                    $("#requestId").val(requestIdVal).trigger("change");

                }
                else
                    fill_select2(viewData_request_list, "requestId", true, `${+$("#branchId").val()}/${+$("#workFlowId").val()}/${+$("#stageId").val()}/null/null`, false, 3, "انتخاب درخواست", undefined, "", true);


                if (parentWorkflowCategoryId == 11) {

                    fill_select2(`/api/GN/NoSeriesLineApi/noseriesliststage`, "noSeriesId", true, `${stageId}/${+$("#branchId").val()}`);

                    $("#noSeriesId").prop("disabled", false).prop("required", true);

                    var noSeriesId = +$("#noSeriesId").data("value");

                    if (noSeriesId > 0) {

                        $("#noSeriesId").val(noSeriesId).trigger("change");
                        var accountDetailId = +$("#accountDetailId").data("value");
                        $("#accountDetailId").val(accountDetailId).trigger("change");

                        $("#noSeriesId").prop("disabled", true);
                        $("#accountDetailId").prop("disabled", true);

                    }
                    else {

                        $("#accountDetailId").empty();
                        $("#accountDetailId").prop("disabled", true);

                    }

                    $("#transactionDatePersian").removeAttr("data-parsley-transactiondateissame");
                }

            }
            else {

                fill_select2(`/api/GN/NoSeriesLineApi/noseriesliststage`, "noSeriesId", true, `${stageId}/${+$("#branchId").val()}`);

                $("#noSeriesId").prop("disabled", false).prop("required", true);

                var noSeriesId = +$("#noSeriesId").data("value");

                if (noSeriesId > 0) {

                    $("#noSeriesId").val(noSeriesId).trigger("change");
                    var accountDetailId = +$("#accountDetailId").data("value");
                    $("#accountDetailId").val(accountDetailId).trigger("change");
                }
                else {

                    $("#accountDetailId").empty();
                    $("#accountDetailId").prop("disabled", true);

                }

                $("#transactionDatePersian").removeAttr("data-parsley-transactiondateissame");
            }
        }
    });
}

$("#AddEditModalItemTransaction")
    .on({
        "hidden.bs.modal": function () {

            $("#accountGLId").val("");
            $("#accountGLId").data("value", 0);
            $("#accountSGLId").val("");
            $("#accountSGLId").data("value", 0);
            $("#transactionDatePersian").val("");
            $("#noSeriesId").prop("disabled", true).val(0).trigger("change");
            $("#accountDetailId").prop("disabled", true).val(0).trigger("change");
            $("#stagePreviousList").html("");
            $("#stageItemTypeList").html("");
            $(".currentStage").text("-");
            $("#note").val("").trigger("change");


        },
        "shown.bs.modal": function () {
            if (modal_open_state == "Add") {

                $("#branchId").select2("focus");
                $("#branchId").prop('disabled', false).trigger("change");

                $("#warehouseId").prop('disabled', false).trigger("change");
                $("#workFlowId").prop('disabled', false).trigger("change");

                $("#stageId").val(0).trigger("change");
                $("#stageId").prop('disabled', false);

                $("#requestId").empty();
                $("#requestId").prop("disabled", true);
                $("#requestId").trigger("change");

                $("#noSeriesId").prop("disabled", false);
                $("#noSeriesId").prop("required", false).val(0).trigger("change");

                $("#accountGLId").val("");
                $("#accountGLId").data("value", 0);

                $("#accountSGLId").val("");
                $("#accountSGLId").data("value", 0);

                $("#accountDetailId").removeData("parsley-required-message");
                $("#accountDetailId").prop("required", false);
                $("#accountDetailId").removeAttr("data-parsley-selectvalzero");
                $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change");
                $("#accountDetailId").prop("disabled", false);

                $("#requestNameContainer").addClass("displaynone");

                $("#treasurySubjectId").val(0).trigger("change");

                $("#note").prop("disabled", false);
                $("#note").val("").trigger("change");
                itemTransactionRequestId = null;
                itemTransactionIdentityId = null;
                $("#stagePreviousList").html("");
                $("#stageItemTypeList").html("");

                $("#transactionDatePersian").val(moment().format('jYYYY/jMM/jDD'));
                $("#transactionDatePersian").prop("disabled", false);
                $("#open-datepicker-transactionDatePersian").prop("disabled", false);

            }
            else {

                $("#requestId").select2("focus");
                $("#branchId").prop("disabled", true);
                $("#warehouseId").prop("disabled", true);
                $("#workFlowId").prop("disabled", true);
                $("#stageId").prop("disabled", true);
                $("#transactionDatePersian").prop("disabled", true);
                $("#open-datepicker-transactionDatePersian").prop("disabled", true);
                $("#note").prop("disabled", true);

            }
        }
    });

$("#branchId").change(function () {

    clearItemTransactionForm(1);

    let branchId = +$(this).val();
    if (branchId !== 0) {
        fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getDropDownByUserId`, "warehouseId", true, branchId);
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/11/${stageclassIds}`, false, 0, 'انتخاب کنید', undefined, "", true);

    }
});

$("#workFlowId").change(function () {
    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    //clearFormWorkFlowId();
    clearItemTransactionForm(2)

    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/11/${stageclassIds}/0/1`);
});

$("#stageId").on("change", function () {

    var val = +$(this).val();
    let workFlowId = +$("#workFlowId").val();

    //clearFormStageId();
    clearItemTransactionForm(3)

    if (val !== 0 && modal_open_state == "Add") {
        getItemTransactiondataByStageId(val, workFlowId);

        var inOutResult = getInOutStage(val);
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

$("#requestId").on("change", function () {


    shamsiTransactionDate = "";
    var requestId = +$(this).val();
    if (requestId === 0)
        return;

    $("#treasurySubjectId").empty();
    let workflowCategoryName = document.getElementById("requestId");
    let len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;

    workflowCategoryId = (len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0]);

    shamsiTransactionDate = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[0].split('-')[1];

    if (modal_open_state == "Add")
        $("#transactionDatePersian").val(shamsiTransactionDate);

    let url = "";
    if (+workflowCategoryId == 1) {
        url = `${viewData_baseUrl_PU}/PurchaseOrderApi/getrecordbyid`;
    }
    else if (+workflowCategoryId == 11) {
        url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getrecordbyid`;
    }

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(requestId),
        async: false,
        cache: false,
        success: function (response) {

            if (+workflowCategoryId == 1) {
                $("#divtreasurySubjectId").removeClass("displaynone");
                $("#treasurySubjectId").empty();
                var treasurySubjectOption = new Option(`${response.data.treasurySubjectId} - ${response.data.treasurySubjectName}`, response.data.treasurySubjectId, true, true);
                $("#treasurySubjectId").append(treasurySubjectOption);
            }
            else {
                $("#divtreasurySubjectId").addClass("displaynone");
            }


            if (+$("#accountGLId").val() === 0) {
                $("#accountGLId").val(response.data.accountGLId == 0 ? "" : `${response.data.accountGLId} - ${response.data.accountGLName}`);
                $("#accountGLId").data("value", response.data.accountGLId);
            }

            if (+$("#accountSGLId").val() === 0) {
                $("#accountSGLId").val(response.data.accountSGLId == 0 ? "" : `${response.data.accountSGLId} - ${response.data.accountSGLName}`);
                $("#accountSGLId").data("value", response.data.accountSGLId);
            }

            if (+$("#accountGLId").data("value") !== 0 && +$("#accountSGLId").data("value") != 0 && modal_open_state == "Add" && +workflowCategoryId == 11) {

                fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${$("#accountGLId").data("value")}/${$("#accountSGLId").data("value")}`, false, 0, "انتخاب گروه تفضیل");
                $("#noSeriesId").val(0).trigger("change");
            }
            else if (response.data.accountDetailId > 0) {

                var noSeriesOption = new Option(`${response.data.noSeriesId} - ${response.data.noSeriesName}`, response.data.noSeriesId, true, true);
                $("#noSeriesId").prop("disabled", true);
                $("#noSeriesId").append(noSeriesOption).trigger('change');
                $("#noSeriesId").val(+response.data.noSeriesId);
                if (+$("#noSeriesId").val() > 0) {
                    accountDetail_getName(response.data.accountDetailId, response.data.noSeriesId).then(result => {
                        $("#accountDetailId").prop("disabled", true);
                        $("#accountDetailId").html(`<option value="${response.data.accountDetailId}">${response.data.accountDetailId} - ${result == undefined || result == null ? "" : result}</option>`).val(response.data.accountDetailId).trigger("change");
                    });
                }
            }
            else {
                $("#accountDetailId").html(`<option value="0">0 - انتخاب کنید</option>`).val(0).trigger("change");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

});

$("#noSeriesId").on("change", function (ev) {
    var noSeriesId = +$(this).val();

    if (noSeriesId == 0 || noSeriesId == null) {
        $("#accountDetailId").prop("disabled", true).val(0).trigger("change")
    } else {
        $("#accountDetailId").prop("disabled", false);
        $("#accountDetailId").empty();
        getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
    }
});

window.Parsley._validatorRegistry.validators.transactiondateissame = undefined
window.Parsley.addValidator("transactiondateissame", {
    validateString: function (value) {

        var transactionDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var reqDate = moment.from(shamsiTransactionDate, 'fa', 'YYYY/MM/DD');
        if (transactionDate.isValid()) {
            transactionDate = transactionDate.format('YYYY/MM/DD');
            reqDate = reqDate.format('YYYY/MM/DD');
            var dateIsValid = moment(reqDate).isSameOrBefore(transactionDate, 'day');
            return dateIsValid;
        }
        return false;
    },
    messages: {
        en: 'تاریخ برگه باید بزرگتر، مساوی تاریخ درخواست باشد'
    }
});

window.Parsley._validatorRegistry.validators.checkglsglrequied = undefined
window.Parsley.addValidator("checkglsglrequied", {
    validateString: function (value) {

        var gl = +$("#accountGLId").data("value");
        var sgl = +$("#accountSGLId").data("value")

        if ((currentPriority == 1) && (+gl === 0 || +sgl === 0))
            return false;

        return true;
    },
    messages: {
        en: 'مبانی ارتباط با حسابداری تعریف نشده است(کل-معین...)'
    }
});


initForm();