
var viewData_form_title = "صورتحساب خرید / برگشت";

var viewData_controllername = "PurchaseInvoiceApi";
var viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/update`;
var viewData_getrecord_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getrecordbyid`;
var viewData_filter_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getfilteritems`;
var viewData_get_accountDetail_by_gl = `${viewData_baseUrl_FM}/AccountSGLApi/getaccountdetailbygl`;
var viewData_print_file_url = `${stimulsBaseUrl.PU.Prn}PersonInvoice.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_PU}/${viewData_controllername}/csv`,
    viewData_request_list = `${viewData_baseUrl_PU}/${viewData_controllername}/personinvoicerequest_getdropdown`;
var personOrderRequestId = null,
    personOrderIdentityId = null,
    shamsiOrderDate = "",
    existPersonInvoiceLine = 0,
    isRequest = 0,
    selectedRowId = 0,
    workflowCategoryId = 0,
    workflowCategoryName = "",
    activePageTableId = "",
    idForStepAction = "";


function initForm() {

    $("#stimul_preview").remove();

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

    $('<div id="quickSearchContainer" style="display: contents;"></div>').insertBefore(".button-items .toggle");

    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true, 0, false);

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
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm(false)" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));
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

function clearForm() {

    $('#inOut').val("");
    $("#requestId").empty();
    $("#documentTypeId").val("");
    $("#noSeriesId").empty();
    $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")

    $("#accountGLId").val("");
    $("#accountSGLId").val("");
    $("#accountDetailId").empty();
    $("#treasurySubjectId").html("").prop("required", false).prop("disabled", true).prop("data-parsley-validate-if-empty", false);
    $("#returnReasonId").val("");
    $("#stagePreviousList").html("");
    $("#stageItemTypeList").html("");
    $("#noSeriesId").prop("disabled", true).prop("required", false);
    $("#accountDetailId").prop("disabled", true).prop("data-parsley-validate-if-empty", false);
    $("#requestId").html("").prop("required", false).prop("disabled", true).prop("data-parsley-validate-if-empty", false);
    $("#note").val("");

}

function callBackSearche() {

    return +$("#stageId").val() > 0

}

function getInvoicedataByStageId(workFlowId, stageId) {

    //#region documentType
    var documentType = getStageDocumentType(stageId);
    if (+documentType.id > 0) {
        $("#documentTypeId").val(`${documentType.id} - ${documentType.name}`);
        $("#documentTypeId").data("value", documentType.id);
        $("#requestId").prop("required", true);
    }
    else
        $("#documentTypeId").prop("required", false);

    //#endregion


    let model = {};
    model = {
        stageId: +stageId,
        priority: 1,
        workflowId: workFlowId
    };

    getStageStep(model).then((response) => {
        model = {
            headerId: +$("#stageId").val(),
            stageId: +stageId,
            branchId: +$("#branchId").val(),
            postingGroupTypeId: 9
        }

        if (checkResponse(response)) {

            isRequest = response.isRequest;

            if (response != undefined && response.actionId > 0) {
                fillStagePreviousInfo(workFlowId, stageId, response.actionId);
            }
            $("#requestId").empty().prop("disabled", true);
            $("#requestId").prop("required", false);
            $("#requestId").prop("data-parsley-selectvalzero", false);
            $("#requestId").prop("data-parsley-checkglsglrequied", true);

            $("#orderDatePersian").removeAttr("data-parsley-dateissame");


            $("#treasurySubjectId").prop("required", false);
            $("#treasurySubjectId").prop("data-parsley-selectvalzero", false);
            $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
            $("#treasurySubjectId").empty().prop("disabled", true);

            $("#accountGLId").val("");
            $("#accountSGLId").val("");
            $("#accountDetailId").val(0).trigger("change");

            if (response.isRequest) {

                $("#requestId").prop("required", true);
                $("#requestId").prop("data-parsley-selectvalzero", true);
                $("#requestId").prop("data-parsley-checkglsglrequied", true);
                $("#requestId").prop("disabled", false);
                $("#orderDatePersian").attr("data-parsley-dateissame", "");

                fill_select2(viewData_request_list, "requestId", true, `${+$("#branchId").val()}/${+$("#workFlowId").val()}/${+$("#stageId").val()}/null/null`, false, 3, "انتخاب درخواست", undefined, "", true);
            }
            if (response.isRequest && !response.isTreasurySubject) {

                $("#treasurySubjectId").prop("disabled", true);
                $("#treasurySubjectId").prop("required", true);
                $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);
                $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

                fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${stageId}/1/1`, false, 0, 'انتخاب موضوع', undefined, "", true);
            }
            else if (!response.isRequest && response.isTreasurySubject) {
                $("#treasurySubjectId").prop("disabled", false);
                $("#treasurySubjectId").prop("required", true);
                $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);
                $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

                fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${stageId}/1/7`, false, 0, 'انتخاب موضوع', undefined, "", true);
            }
        }
    });
}

function GetnoSeriesNameWhitStagePurchasePersonInvoice(stageId) {

    fill_select2(`${viewData_baseUrl_PU}/${viewData_controllername}/noseriesnamewhitstage_getname`, "noSeriesId", true, stageId);

}

function getGlSGLbyparentId(identityId, workflowCategoryId, existPurchaseLineCount) {
    let url = `${viewData_baseUrl_WF}/WorkflowApi/getrequestglsglbyworkflowcategory/${workflowCategoryId}/${identityId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            if (typeof result !== "undefined" && result != null) {

                $(`#accountGLId`).val(result.accountGLId == 0 ? "" : `${result.accountGLId} - ${result.accountGLName}`);
                $(`#accountGLId`).data("value", result.accountGLId);
                $(`#accountSGLId`).val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $(`#accountSGLId`).data("value", result.accountSGLId);

                $(`#orderDatePersian`).val(result.documentDatePersian);

                var treasurySubjectOption = new Option(`${result.treasurySubjectId} - ${result.treasurySubjectName}`, result.treasurySubjectId, true, true);
                $("#treasurySubjectId").append(treasurySubjectOption);

                shamsiOrderDate = result.documentDatePersian;

                let hasrequestId = +$("#requestId").val() > 0 ? true : false;

                if (result.accountGLId !== 0 && result.accountSGLId !== 0) {
                    $("#noSeriesId").prop("required", true);
                    $("#noSeriesId").attr("data-parsley-selectvalzero", "");
                    fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                    $("#noSeriesId").val(result.noSeriesId).trigger("change.select2");
                    fillAccountDetail(hasrequestId, result.accountDetailId, result.accountDetailRequired, result.noSeriesId, existPurchaseLineCount);
                }

            }
            else {
                shamsiTransactionDate = moment().format('jYYYY/jMM/jDD');
                $(`#accountGLId`).val("");
                $(`#accountSGLId`).val("");
                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", true).val(0).trigger("change");
                $(`#orderDatePersian`).val("");

            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

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
        stageId: +$("#stageId").val(),
        treasurySubjectId: +$("#treasurySubjectId").val(),
        requestId: +$("#requestId").val(),
        documentTypeId: +$("#documentTypeId").data("value"),
        orderDatePersian: $("#orderDatePersian").val(),
        note: $("#note").val(),
        refrenceNo: ($("#refrenceNo").val() == undefined || $("#refrenceNo").val() == "undefined") ? "" : $("#refrenceNo").val(),
        actionId: +$("#actionId").val(),
        accountGLId: $("#accountGLId").data("value"),
        accountSGLId: $("#accountSGLId").data("value"),
        accountDetailId: +$("#accountDetailId").val(),
        personId: ($("#personId").val() == undefined || $("#personId").val() == "undefined") ? "" : +$("#personId").val(),
        returnReasonId: +$("#returnReasonId").val(),
        noSeriesId: +$("#noSeriesId").val(),
        inOUt: +$('#inOut').val().split('-')[0],
        workFlowId: +$('#workFlowId').val(),
        parentWorkflowCategoryId: (workflowCategoryId != null ? +workflowCategoryId : 0),
    }


    let hasStageFundItemType = getHasStageFundItemType(newModel.stageId);

    if (!hasStageFundItemType) {
        var msg = alertify.error("تنظیمات برگه برای این مرحله انجام نشده ، به مدیر سیستم اطلاع دهید");
        msg.delay(alertify_delay);
        return;
    }
    else {
        if (modal_open_state == "Add")
            recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {
                if (result.successfull) {
                    if (result.id > 0) {
                        modal_close();
                        $(".modal-backdrop.fade.show").remove();
                        if (enter_toline)
                            navigation_item_click(`/PU/PurchaseInvoiceLine/${result.id}/1`);
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

        else if (modal_open_state == "Edit")
            recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {

                if (result.successfull) {
                    if (result.id > 0) {

                        modal_close();
                        $(".modal-backdrop.fade.show").remove();

                        if (enter_toline)
                            navigation_item_click(`/PU/PurchaseInvoiceLine/${result.id}/1`);
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

function checkExistpurchaseline(id) {

    var result = $.ajax({
        url: `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getPurchaseLineCount`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getPurchaseLineCount`);
            return 0;
        }
    });

    return result.responseJSON;
}

function run_button_editPersonInvoice(invoiceId, rowNo, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(invoiceId);
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
        data: JSON.stringify(invoiceId),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                if (result.isDataEntry == 1 || result.isDataEntry == 2 || result.isDataEntry == 3) {
                    fillEditPersonInvoice(result);
                    modal_show();
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

function fillEditPersonInvoice(invoice) {


    existPersonInvoiceLine = checkExistpurchaseline(invoice.id);
    var existPersonInvoiceLineCount = existPersonInvoiceLine > 0 ? true : false;

    $("#branchId").val(invoice.branchId).trigger("change.select2");

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${invoice.branchId}/1/2,3,7`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(invoice.workflowId).trigger("change.select2");

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${invoice.branchId}/${invoice.workflowId}/1/2,3,7/0/1`);
    $("#stageId").val(invoice.stageId).trigger("change.select2");


    $("#actionId").val(invoice.actionId);
    $("#inOut").val(invoice.inOutName);
    $("#orderDatePersian").removeAttr("data-parsley-purchasedateissame");

    fillStagePreviousInfo(invoice.workflowId, invoice.stageId, invoice.actionId);
    isRequest = invoice.isRequest;


    workflowCategoryId = invoice.parentWorkflowCategoryId;
    if (invoice.inOut === 2) {
        $("#returnReason").addClass("displaynone");
        $("#returnReasonId").val("").trigger("change");
        $("#returnReasonId").prop('required', false).removeAttr('data-parsley-selectvalzero')
    }
    else {
        $("#returnReasonId").html(`<option value="0">انتخاب کنید</option>`);
        fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
        $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
        $("#returnReasonId").val(invoice.returnReasonId).trigger("change");
        $("#returnReason").removeClass("displaynone");
    }

    $("#requestId").empty();
    $("#accountGLId").empty();
    $("#accountSGLId").empty();

    if (invoice.isRequest) {

        $("#requestId").attr("required", true);
        $("#requestId").attr("data-parsley-selectvalzero", true);
        $("#requestId").prop("data-parsley-checkglsglrequied", true);
        $("#orderDatePersian").attr("data-parsley-dateissame", "");

        personOrderRequestId = invoice.requestId == 0 ? null : invoice.requestId;
        personOrderIdentityId = invoice.id == 0 ? null : invoice.id;
        fill_select2(viewData_request_list, "requestId", true, `${invoice.branchId}/${invoice.workflowId}/${invoice.stageId}/${personOrderRequestId}/${personOrderIdentityId}`, false, 0, "انتخاب درخواست");
        $("#requestId").val(invoice.requestId).trigger("change.select2").prop("disabled", !invoice.isRequest);

        var noSeriesOption = new Option(`${invoice.noSeriesId} - ${invoice.noSeriesName}`, invoice.noSeriesId, true, true);
        $("#noSeriesId").empty();
        $("#noSeriesId").prop("disabled", true);
        $("#noSeriesId").append(noSeriesOption)
        $("#noSeriesId").val(invoice.noSeriesId).trigger('change.select2');

        var accountDetailOption = new Option(`${invoice.accountDetailId} - ${invoice.accountDetailName}`, invoice.accountDetailId, true, true);
        $("#accountDetailId").empty();
        $("#accountDetailId").prop("disabled", true);
        $("#accountDetailId").append(accountDetailOption)
        $("#accountDetailId").val(invoice.accountDetailId).trigger('change.select2');

        getGlSGLbyparentId(invoice.requestId, invoice.parentWorkflowCategoryId, existPersonInvoiceLineCount);

    }
    else {
        $("#requestId").removeAttr("required");
        $("#requestId").removeAttr("data-parsley-selectvalzero");
        $("#requestId").prop("disabled", true);

        $("#noSeriesId").prop("disabled", invoice.isLine > 0);
        $("#noSeriesId").empty();
        $("#noSeriesId").html(`<option value="0">انتخاب کنید</option>`);
        $("#accountDetailId").prop("disabled", invoice.isLine > 0);

        fill_select2(`${viewData_baseUrl_PU}/${viewData_controllername}/noseriesnamewhitstage_getname`, "noSeriesId", true, invoice.stageId);
        $("#noSeriesId").val(invoice.noSeriesId).trigger("change");

        $("#accountDetailId").val(invoice.accountDetailId).trigger("change");

    }


    if (invoice.treasurySubjectId > 0 && invoice.isRequest) {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);
        var treasurySubjectOption = new Option(`${invoice.treasurySubjectId} - ${invoice.treasurySubjectName}`, invoice.treasurySubjectId, true, true);
        fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid/${invoice.stageId}/1/2`, "treasurySubjectId", true, 0, false, 0, 'انتخاب');
        $("#treasurySubjectId").append(treasurySubjectOption).trigger('change.select2');
    }
    else {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);
        var treasurySubjectOption = new Option(`${invoice.treasurySubjectId} - ${invoice.treasurySubjectName}`, invoice.treasurySubjectId, true, true);
        fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid/${invoice.stageId}/1/7`, "treasurySubjectId", true, 0, false, 0, 'انتخاب');
        $("#treasurySubjectId").append(treasurySubjectOption).trigger('change.select2');

        $("#accountGLId").val(+invoice.accountGLId == 0 ? "" : `${+invoice.accountGLId} - ${invoice.accountGLName}`);
        $("#accountGLId").data("value", result.accountGLId);

        $("#accountSGLId").val(invoice.accountSGLId == 0 ? "" : `${invoice.accountSGLId} - ${invoice.accountSGLName}`);
        $("#accountSGLId").data("value", invoice.accountSGLId);

    }


    $("#documentTypeId").val(invoice.documentTypeId == 0 ? "" : `${invoice.documentTypeId}-${invoice.documentTypeName}`);
    $("#documentTypeId").data("value", invoice.documentTypeId);

    $("#orderDatePersian").val(invoice.orderDatePersian);
    $("#note").prop("disabled", true);
    $("#note").val(invoice.note);

    $("#noSeriesId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);

    $("#branchId").prop("disabled", true);
    $("#note").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#treasurySubjectId").prop("disabled", true);
    $("#requestId").prop("disabled", true);
    $("#documentTypeId").prop("disabled", true);
    $("#returnReasonId").prop("disabled", true);


}

function run_button_OrderDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/PU/PurchaseInvoiceLine/${lineId}/1`, "ثبت صورتحساب (ریالی)");
}

function run_button_OrderDetailAdvance(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/PU/PurchaseInvoiceLine/${lineId}/0`, "ثبت صورتحساب (ارزی)");
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var requestId = +$(elm).parents("tr").first().data("requestid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonInvoice(`/PU/PurchaseInvoiceLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var requestId = +$(elm).parents("tr").first().data("requestid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonInvoice(`/PU/PurchaseInvoiceLine/display/${id}/${requestId}/0/${stageId}/${workflowId}`);
}

function run_button_printFromPlateHeaderLine(id, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

  
    let stageClassId = $(`#${activePageTableId} tr#row${rowNo}`).data("stageclassid")

    if (stageClassId == 7)
        perchaseInvoicePettyCashPrint(id)
    else
        printFromPlateHeaderLine(id)

}

function perchaseInvoicePettyCashPrint(id) {

    var reportParameters = reportParameter(true, id);

    var reportModel = {
        reportName: "گزارش تنخواه",
        reportUrl: `${stimulsBaseUrl.PU.Prn}PurchaseInvoicePettyCash.mrt`,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function printFromPlateHeaderLine(id) {

    var reportParameters = reportParameter(false, id);

    var print_file_url = `${stimulsBaseUrl.PU.Prn}PurchaseInvoiceOfficial.mrt`;
    var reportModel = {
        reportUrl: print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function reportParameter(isStageClass7, id) {
    let reportParameters = []

    if (isStageClass7) {

        reportParameters = [
            { Item: "StageClassId", Value: 7, SqlDbType: dbtype.Int, Size: 0 },
            { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
            { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        ]
    }
    else {

        reportParameters = [
            { Item: `Id`, Value: id, SqlDbType: 8, Size: 0 },
            { Item: "StageName", Value: "صورتحساب خرید", itemType: "Var" },
        ]

    }

    return reportParameters;
}

function navigateToModalPersonInvoice(href) {

    initialPage();
    $("#contentdisplayPersonInvoiceLine #content-page").addClass("displaynone");
    $("#contentdisplayPersonInvoiceLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayPersonInvoiceLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayPersonInvoiceLine #loader,#contentdisplayPersonInvoiceLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayPersonInvoiceLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayPersonInvoiceLine #form,#contentdisplayPersonInvoiceLine .content").css("margin", 0);
    $("#contentdisplayPersonInvoiceLine .itemLink").css("pointer-events", " none");
}

function run_button_showStepLogsPurchaseInvoiceCartable(id, rowno) {

    idForStepAction = id
    activePageTableId = "pagetable"
    selectedRowId = `row${rowno}`;

    var currentIdentityId = id;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    let currentrequestId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("requestid");
    var documentDatePersian = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("orderdatepersian");
    var parentWorkflowCategoryId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("parentworkflowcategoryid");
    var currentBranchId = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    stageActionLogCurrent = {
        identityId: currentIdentityId,
        stageId: currentStageId,
        actionId: currentActionId,
        workFlowId: currentWorkFlowId,
        currentrequestId: currentrequestId,
        documentDatePersian: documentDatePersian,
        parentWorkflowCategoryId: parentWorkflowCategoryId
    }

    $(`#actionPurchasePersonInvoice`).empty();
    let stageClassIds = "2,3,7";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionPurchasePersonInvoice", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.purchase.id}/true/${stageClassIds}`);

    var currentActionId = +$(`#${activePageTableId} #parentPageTableBody tbody tr#${selectedRowId}`).data("actionid");
    $(`#actionPurchasePersonInvoice`).val(currentActionId).trigger("change");

    stepLogPurchasePersonInvoice(stageActionLogCurrent.identityId, currentStageId, currentWorkFlowId);

    modal_show("stepLogModalPurchaseInvoice");
}

function run_button_delete(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var purchaseInfo = getPurchaseOrderInfo(p_keyvalue);
    purchaseInfo.StageClass = "2,3,7";
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

$("#AddEditModal")
    .on({
        "hidden.bs.modal": function () {
            $("#orderDatePersian").prop("disabled", false);
            $("#open-datepicker-orderDatePersian").prop("disabled", false);
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

                $("#workFlowId").prop('disabled', false).trigger("change");


                $("#stageId").val(0).trigger("change");
                $("#stageId").prop('disabled', false);


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

                $("#returnReason").addClass("displaynone");
                $("#returnReasonId").val("0").trigger("change.select2");
                $("#requestIdContainer").removeClass("displaynone");

                $("#requestId").empty();
                $("#requestId").prop("disabled", false);
                $("#requestId").trigger("change");


                $("#currencyId").prop('disabled', false);

                $("#treasurySubjectId").empty();
                $("#treasurySubjectId").prop("disabled", true);

                $("#treasurySubjectId").val(0).trigger("change");
                $("#note").prop("disabled", false);
                $("#note").val("").trigger("change");
                personOrderRequestId = null;
                personOrderIdentityId = null;
                $("#orderDatePersian").val(moment().format('jYYYY/jMM/jDD'));
                $("#orderDatePersian").prop("disabled", false);
                $("#open-datepicker-orderDatePersian").prop("disabled", false);
                $("#returnReasonId").prop("disabled", false);
            }
            else {
                //$("#noSeriesId").select2("focus");
                $("#branchId").prop("disabled", true);
                $("#warehouseId").prop("disabled", true);
                $("#workFlowId").prop("disabled", true);
                $("#stageId").prop("disabled", true);
                $("#requestId").prop("disabled", true);
                $("#treasurySubjectId").prop("disabled", true);
                $("#note").prop("disabled", true);
                $("#orderDatePersian").prop("disabled", true);
                $("#open-datepicker-orderDatePersian").prop("disabled", true);
                $("#returnReasonId").prop("disabled", true);
            }

        }
    });

$('#displayPersonInvoiceLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "myadm"
    } else {
        switchUser = "alladm"
    }
    pagetable_formkeyvalue = [switchUser, null];
});

$("#userType").on("change", function () {
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];

    get_NewPageTableV1();

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
        { Item: "RequestId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 }
    ]

    stimul_report(reportParameters);
});

$("#branchId").change(function () {
    let branchId = +$(this).val();
    $("#workFlowId").empty();
    $("#stageId").empty();
    clearForm();
    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/1/2,3,7`, false, 0, 'انتخاب کنید', undefined, "", true);

});

$("#workFlowId").change(function () {

    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    $("#stageId").empty();
    clearForm();
    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/1/2,3,7/0/1`);
});

$("#stageId").on("change", function () {

    clearForm();
    var stageId = +$(this).val();
    if (stageId !== 0 && (modal_open_state != "Edit")) {

        getInvoicedataByStageId(+$("#workFlowId").val(), stageId);

        var inOutResult = getInOutStage(stageId);
        let InOutName;

        if (checkResponse(inOutResult) && (inOutResult == 1 || inOutResult == 2)) {
            InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
            $('#inOut').val(InOutName);
            $('#inOut').data("value", inOutResult);
            $("#accountGLId").attr("required", true);
            $("#accountGLId").attr("data-parsley-selectvalzero", true);
            $("#accountGLId").attr("data-parsley-checkglsglrequied", true);
            $("#accountSGLId").attr("required", true);
            $("#accountSGLId").attr("data-parsley-selectvalzero", true);
            $("#accountSGLId").attr("data-parsley-checkglsglrequied", true);

            if ($('#inOut').data("value") === 2) {
                $("#returnReason").addClass("displaynone");
                $("#returnReasonId").val("").trigger("change");
                $("#returnReasonId").prop('required', false).removeAttr('data-parsley-selectvalzero')
            }
            else {
                $("#returnReason").removeClass("displaynone");
                $("#returnReasonId").val(1).trigger("change");
                $("#returnReasonId").html(`<option value="0">انتخاب کنید</option>`);
                fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
                $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
            }
        }

        else {
            $("#accountGLId").removeAttr("required", false);
            $("#accountGLId").removeAttr("data-parsley-selectvalzero", false);
            $("#accountGLId").removeAttr("data-parsley-checkglsglrequied", false);
            $("#accountSGLId").removeAttr("required", false);
            $("#accountSGLId").removeAttr("data-parsley-selectvalzero", false);
            $("#accountSGLId").removeAttr("data-parsley-checkglsglrequied", false);
        }
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
});

$("#requestId").on("change", function () {

    shamsiOrderDate = "";
    $("#noSeriesId").empty().prop("disabled", true);
    $("#accountDetailId").empty().prop("disabled", true);
    var requestId = +$(this).val();
    if (requestId !== 0) {
        workflowCategoryName = document.getElementById("requestId");
        var len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;
        workflowCategoryId = len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0];
        getGlSGLbyparentId($(this).val(), +workflowCategoryId, false);
    }
});

$("#noSeriesId").on("change", function () {

    if (+$(this).val() !== 0) {
        $("#accountDetailId").prop("disabled", false).prop("required", true);
        getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
    }
    else
        $("#accountDetailId").empty();
});

$("#treasurySubjectId").on("change", function () {
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    if (+$(this).val() > 0 && modal_open_state != "Edit") {

        workflowCategoryId = 1;
        var model = {
            id: +$(this).val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
        };

        GetnoSeriesListWhitGlSgl(model, 1);
    }
});

window.Parsley._validatorRegistry.validators.purchasedateissame = undefined;
window.Parsley.addValidator("purchasedateissame", {
    validateString: function (value) {
        
        if (+$("#requestId").val() > 0) {
            var orderDate = moment.from(value, 'fa', 'YYYY/MM/DD');
            var reqDate = moment.from(shamsiOrderDate, 'fa', 'YYYY/MM/DD');
            if (orderDate.isValid()) {
                orderDate = orderDate.format('YYYY/MM/DD');
                reqDate = reqDate.format('YYYY/MM/DD');

                var dateIsValid = moment(reqDate).isSameOrBefore(orderDate, 'day');
                return dateIsValid;
            }
            return false;
        }
        else
            return true;

    },
    messages: {
        en: 'تاریخ برگه باید بزرگتر، مساوی تاریخ درخواست باشد'
    }
});

initForm();