var viewData_form_title = "صورتحساب خرید",
    viewData_controllername = "PurchaseInvoiceCartableApi",
    viewData_getpagetable_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getpageinvoicecartable`,
    viewData_deleterecord_url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/delete`,
    viewData_getrecord_url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/getrecordbyid`,
    viewData_updrecord_url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/update`,
    viewData_csv_url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/csv`,
    viewData_stage_url = `${viewData_baseUrl_WF}/StageApi/getdropdown`,
    viewData_request_list = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/personinvoicerequest_getdropdown`,
    activePageTableId = null,
    selectedRowId = 0,
    stageId = 0,
    pageName = null,
    currentPriority = 0,
    personOrderRequestId = null,
    personOrderIdentityId = null,
    shamsiOrderDate = "",
    workflowCategoryId = 0,
    workflowCategoryName = "",
    stageIdByrequset = null,
    pageTableModel = {}, idForStepAction = "";


var stageId_PurchaseInvoiceCartable = +$("#stageIdInvoiceParameter").val();
var isDisablenoSeriesId = {
    flg: true,
    edit: false
};

pagetable_formkeyvalue = ["", "", "my", null];

function initPurchasenInvoiceGroup() {

    $("#orderDatePersian").inputmask();
    kamaDatepicker('orderDatePersian', { withTime: false, position: "bottom" });

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    $(".button-items").prepend($(".toggle"));

    if (checkResponse(stageId_PurchaseInvoiceCartable) && stageId_PurchaseInvoiceCartable > 0)
        pagetable_formkeyvalue = [stageId_PurchaseInvoiceCartable, "stageId", "my", null];
    else
        pagetable_formkeyvalue = ["", "", "my", null];

    getPurchasePersonInvoiceTab(pagetable_formkeyvalue);

    fill_select2(viewData_stage_url, "stageId", true, '1/2/2/1');
    fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
    fill_select2("/api/GN/CurrencyApi/getdropdown", "currencyId", true);
    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true);
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
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm(false)" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));
}

function callBackSearche() {
    return stageId_PurchaseInvoiceCartable > 0

}

function getPurchasePersonInvoiceTab() {


    var byUser = pagetable_formkeyvalue[2];

    let url = `${viewData_baseUrl_PU}/${viewData_controllername}/purchaseinvoicecartablesection/2,3,7/${byUser}`;

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
    fillLinkTab(result);
    fillTab(result);
}

function resetCartable() {
    $("#tabLinkPersonInvoiceBoxes").html("");
    $("#tabPersonInvoiceBoxes").html("");
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


            $("#tabPersonInvoiceBoxes").append(outPut);
        }

        let index = result.findIndex((item) => item.id === stageId_PurchaseInvoiceCartable)
        if (index == -1) {
            $(`#p_${result[0].id}Box`).addClass("active")
            saveId = result[0].id
        }
        else {
            $(`#p_${result[index].id}Box`).addClass("active")
            saveId = result[index].id
        }

        if (resultLen != 0) {
            $("#tabPersonInvoiceBoxes").addClass("group-box")
            changeTabByClick(`pagetable_p_${saveId}`, saveId);
        }
        else
            $("#tabPersonInvoiceBoxes").removeClass("group-box")
    }

}

function fillLinkTab(result) {
    let reasultLen = result.length, outPut = "";
    let active = "";
    for (var i = 0; i < reasultLen; i++) {
        if (checkResponse(stageId_PurchaseInvoiceCartable) && stageId_PurchaseInvoiceCartable > 0)
            active = (result[i].id == stageId_PurchaseInvoiceCartable ? "active" : "");
        else
            active = (i == 0 ? "active" : "");

        outPut = `<li class="nav-item waves-effect waves-light" id="p_${result[i].id}Item">
                    <a class="nav-link ${active}" data-toggle="tab" onclick="changeTabByClick('pagetable_p_${result[i].id}','${result[i].id}')" data-id="p_${result[i].id}" id="p_${result[i].id}Link" href="#p_${result[i].id}Box" role="tab">
                        <span class="d-md-block"> ${result[i].id} - ${result[i].name}</span>
                    </a>
                </li>`;

        $("#tabLinkPersonInvoiceBoxes").append(outPut);
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

    stageId_PurchaseInvoiceCartable = +id;
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
    }
    else {
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

function GetnoSeriesNameWhitStagePurchasePersonInvoice(stageId) {

    var url = `${viewData_baseUrl_PU}/PurchaseInvoiceApi/noseriesnamewhitstage_getname`
    fill_select2(url, "noSeriesId", true, stageId);

}

function getInvoicedataByStageId(stageId) {

    let model = {};
    model = {
        stageId: +stageId,
        priority: 1
    };
    var documentType = getStageDocumentType(stageId);
    $("#documentTypeId").val(`${documentType.id} - ${documentType.name}`);
    $(`#documentTypeId`).data("value", documentType.id);

    getStageStep(model).then((response) => {
        model = {
            headerId: +$("#stageId").val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
            postingGroupTypeId: 9
        }

        if (response != undefined) {
            currentPriority = response.priority;
            if (response.actionId > 0) {
                fillStagePreviousInfo(stageId, response.actionId);
            }
            $("#requestId").empty().prop("disabled", true);
            $("#requestId").prop("required", false);
            $("#requestId").prop("data-parsley-selectvalzero", false);
            $("#stageId").prop("data-parsley-checkglsglrequied", true);



            if (response.isRequest) {
                $("#noSeriesId").prop("disabled", true);
                $("#requestId").prop("required", true);
                $("#requestId").prop("data-parsley-selectvalzero", true);
                $("#requestId").prop("disabled", false);
                fill_select2(viewData_request_list, "requestId", true, `${+$("#branchId").val()}/${+$("#stageId").val()}/${response.actionId}/${personOrderRequestId}/${personOrderIdentityId}`, false, 3, "انتخاب درخواست", undefined, "", true);

                var requestIdVal = +$("#requestId").data("val");
                if (requestIdVal > 0)
                    $("#requestId").val(requestIdVal).trigger("change");
            }
            else {

                $("#orderDatePersian").removeAttr("data-parsley-purchasedateissame");
                $("#noSeriesId").prop("disabled", false);
                fill_select2(`${viewData_baseUrl_PU}/PurchaseInvoiceApi/noseriesnamewhitstage_getname`, "noSeriesId", true, $("#stageId").val());
            }

            setGlSglInfo(model, response.isRequest, + $("#noSeriesId").val());
        }
        else {

            $("#requestId").empty().prop("disabled", true);


            $("#orderDatePersian").removeAttr("data-parsley-purchasedateissame");
            $("#noSeriesId").prop("disabled", false);
            fill_select2(`${viewData_baseUrl_PU}/PurchaseInvoiceApi/noseriesnamewhitstage_getname`, "noSeriesId", true, $("#stageId").val());
        }


    });
}

function clearForm() {
    $('#inOut').val("");
    $("#requestId").empty();
    $("#documentTypeId").val("");
    $("#noSeriesId").empty();
    $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
    $("#note").val("");
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

}

function getInOutStage(id) {

    let url = `${viewData_baseUrl_WF}/StageApi/getinout`;

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return output.responseJSON;
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
        documentTypeId: $("#documentTypeId").data("value"),
        personId: ($("#personId").val() == undefined || $("#personId").val() == "undefined") ? "" : +$("#personId").val(),
        returnReasonId: +$("#returnReasonId").val(),
        noSeriesId: +$("#noSeriesId").val(),
        inOUt: +$('#inOut').val().split('-')[0],
        workFlowId: +$('#workFlowId').val(),
        parentWorkflowCategoryId: (workflowCategoryId != null ? +workflowCategoryId : 0),
    }

    if (modal_open_state == "Edit") {
        recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {
            if (result.successfull) {
                if (result.id > 0) {

                    modal_close();
                    $(".modal-backdrop.fade.show").remove();

                    if (enter_toline) {
                        navigation_item_click(`/PU/PurchaseInvoiceLine/${result.id}/1`);
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

                $(`#transactionDatePersian`).val(result.documentDatePersian);

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
                $(`#transactionDatePersian`).val("");
                $(`#note`).val("");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function run_button_editPersonInvoiceCartable(invoiceId, rowNo, elem) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "UPD");
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

function fillEditPersonInvoice(invoice) {

    $("#branchId").val(invoice.branchId).trigger("change.select2");

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${invoice.branchId}/1/2`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(invoice.workflowId).trigger("change.select2");

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${invoice.branchId}/${invoice.workflowId}/1/2/0/1`);
    $("#stageId").val(invoice.stageId).trigger("change.select2");


    $("#actionId").val(invoice.actionId);
    $("#inOut").val(invoice.inOutName);
    $("#orderDatePersian").removeAttr("data-parsley-purchasedateissame");

    fillStagePreviousInfo(invoice.workflowId, invoice.stageId, invoice.actionId);
    isRequest = invoice.isRequest;
    if (invoice.treasurySubjectId > 0) {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);
        var treasurySubjectOption = new Option(`${invoice.treasurySubjectId} - ${invoice.treasurySubjectName}`, invoice.treasurySubjectId, true, true);
        fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid/${invoice.stageId}/1/2`, "treasurySubjectId", true, 0, false, 0, 'انتخاب');
        $("#treasurySubjectId").append(treasurySubjectOption).trigger('change.select2');
    }

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


    $("#accountGLId").empty();
    $("#accountSGLId").empty();
    existPersonInvoiceLine = checkExistpurchaseline(invoice.id);
    var existPersonInvoiceLineCount = existPersonInvoiceLine > 0 ? true : false;
    getGlSGLbyparentId(invoice.requestId, invoice.parentWorkflowCategoryId, existPersonInvoiceLineCount);
    $("#documentTypeId").val(invoice.documentTypeId == 0 ? "" : `${invoice.documentTypeId}-${invoice.documentTypeName}`);
    $("#documentTypeId").data("value", invoice.documentTypeId);

    $("#orderDatePersian").val(invoice.orderDatePersian);
    $("#note").val(invoice.note);



    $("#branchId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#treasurySubjectId").prop("disabled", true);
    $("#requestId").prop("disabled", true);
    $("#documentTypeId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);
    $("#noSeriesId").prop("disabled", true);
    $("#orderDatePersian").prop("disabled", true);
    $("#note").prop("disabled", true);
}

function run_button_OrderDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/PU/PurchaseInvoiceLine/${lineId}/1`, "ثبت صورتحساب (ریالی)");
    conditionalProperties.isCartable = true;
}

function run_button_OrderDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/PU/PurchaseInvoiceLine/${lineId}/0`, "ثبت صورتحساب (ارزی)");
    conditionalProperties.isCartable = true;
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "VIW");
    if (!check)
        return;

    var requestId = +$(elm).parents("tr").first().data("requestid");
    var workflowid = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalPersonInvoice(`/PU/PurchaseInvoiceLine/display/${id}/${requestId}/1/${stageId_PurchaseInvoiceCartable}/${workflowid}`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "VIW");
    if (!check)
        return;

    var requestId = +$(elm).parents("tr").first().data("requestid");
    navigateToModalPersonInvoice(`/PU/PurchaseInvoiceLine/display/${id}/${requestId}/0/${stageId_PurchaseInvoiceCartable}/${workflowid}`);
}

function run_button_printFromPlateHeaderLine(id) {

    var check = controller_check_authorize("PurchaseInvoiceApi", "PRN");
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
    
    activePageTableId = pageName
    idForStepAction = id
    selectedRowId = `row${rowno}`;
    currentStageId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("stageid");
    currentWorkFlowId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("workflowid");
    var currentActionId = +$(`#${pageName} #parentPageTableBody  tbody tr#${selectedRowId}`).data("actionid");
    let currentrequestId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("requestid");
    var documentDatePersian = $(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("orderdatepersian");
    var parentWorkflowCategoryId = +workflowCategoryIds.purchase.id;
    var currentBranchId = $(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("branchid");
    stageActionLogCurrent = {
        identityId: id,
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
    var currentActionId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("actionid");
    $(`#actionPurchasePersonInvoice`).val(currentActionId).trigger("change");
    stepLogPurchasePersonInvoice(id, currentStageId, currentWorkFlowId);
    currentdentityId = +$(`#${pageName} #parentPageTableBody tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalPurchaseInvoice");
}

function run_button_deletePersonInvoiceCartable(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var purchaseInfo = getPurchaseOrderInfo(p_keyvalue);
    purchaseInfo.StageClass = "2,3";
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

$('#displayPersonInvoiceLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "myadm"
    } else {
        switchUser = "alladm"
    }
    pagetable_formkeyvalue = [`${stageId_PurchaseInvoiceCartable}`, 'stageId', switchUser, null];
});

$("#AddEditModal").on("shown.bs.modal", function () {

    if (modal_open_state != "Add") {
        $("#noSeriesId").select2("focus");
        $("#branchId").prop("disabled", true);
        $("#workFlowId").prop("disabled", true);
        $("#stageId").prop("disabled", true);
    }
    $("#orderDatePersian").val(moment().format('jYYYY/jMM/jDD'));

});

$("#branchId").change(function () {
    let branchId = +$(this).val();
    $("#workFlowId").empty();
    $("#stageId").empty();
    clearForm();
    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/1/2`, false, 0, 'انتخاب کنید', undefined, "", true);

});

$("#workFlowId").change(function () {
    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    $("#stageId").empty();
    clearForm();
    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/1/2/0/1`);
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

});

$("#userType").on("change", function () {
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", null];
    else
        pagetable_formkeyvalue = ["", "", "all", null];

    if (stageId_PurchaseInvoiceCartable > 0) {
        pagetable_formkeyvalue[0] = stageId_PurchaseInvoiceCartable;
        pagetable_formkeyvalue[1] = "stageId";
    }
    getPurchasePersonInvoiceTab();

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

window.Parsley._validatorRegistry.validators.purchasedateissame = undefined
window.Parsley.addValidator("purchasedateissame", {
    validateString: function (value) {

        var orderDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var reqDate = moment.from(shamsiOrderDate, 'fa', 'YYYY/MM/DD');
        if (orderDate.isValid()) {
            orderDate = orderDate.format('YYYY/MM/DD');
            reqDate = reqDate.format('YYYY/MM/DD');
            var dateIsValid = moment(reqDate).isSameOrBefore(orderDate, 'day');
            return dateIsValid;
        }
        return false;
    },
    messages: {
        en: 'تاریخ برگه باید بزرگتر، مساوی تاریخ درخواست باشد'
    }
});

initPurchasenInvoiceGroup();