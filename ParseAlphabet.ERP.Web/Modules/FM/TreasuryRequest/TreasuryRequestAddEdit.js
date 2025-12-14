
var viewData_controllername = "TreasuryRequestApi",
    viewData_insrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_getrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_request_list = `${viewData_baseUrl_FM}/${viewData_controllername}/treasuryrequest_getdropdown`,
    conditionalProperties = {
        isAfterChange: false,
        isTreasurySubject: false,
        isPreviousStage: false,
        isBank: false,
        isDataEntry: false,
        isCartable: false
    },
    actionId = 0,
    currentPriority = 0,
    currentIsTreasurySubject = false,
    treasuryIdentityId = 0,
    inOutResult = 1,
    statusId = 0,
    isRequest = 0,
    isExistStageStep = false,
    isLoadEdit = false,
    isRequestnextStageId = false,
    lastpagetable_formkeyvalue = [],
    stagePostingGroup = 0,
    isShowTransactionDatePersian = false,
    selectedRowId = "";


function initTreasuryRequestIndexForm() {

    $("#transactionDatePersian").inputmask();

    kamaDatepicker('transactionDatePersian', { withTime: false, position: "bottom" });
    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true, 0, false);


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
}

function clearForm() {
    $("#accountGLId").empty();
    $("#accountSGLId").empty();
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();

    $("#accountGLId").val("");
    $("#accountSGLId").val("");
    $("#noSeriesId").val("");
    $("#accountDetailId").val("");

    $("#stagePreviousList").empty();
    $("#stageFundTypeList").empty();
    $("#treasurySubjectId").empty();
    $("#treasurySubjectId").html("").prop("required", false).prop("disabled", true).prop("data-parsley-validate-if-empty", false);
    $("#noSeriesId").empty();
    $("#noSeriesId").prop("disabled", true).prop("required", false);
    $("#accountDetailId").prop("disabled", true).prop("data-parsley-validate-if-empty", false);

}

function callBackSearche() {
    return +$("#stageId").val() > 0
}

function getdataByStageId(workFlowId, stageId) {


    let model = {};
    if (!isLoadEdit) {
        model = {
            stageId: stageId,
            priority: 1,
            workflowId: workFlowId
        };
    }
    else {
        model = {
            stageId: stageId,
            actionId: statusId,
            workflowId: workFlowId
        };
    }

    getStageStep(model).then((response) => {

        if (checkResponse(response)) {
            isExistStageStep = true;
            
            currentIsTreasurySubject = response.isTreasurySubject;
            currentPriority = response.priority;


            if (!isLoadEdit) {

                $("#transactionDatePersian").removeAttr("data-parsley-dateissame");

                if (response.isTreasurySubject) {
                    $("#treasurySubjectId").prop("disabled", false);
                    $("#treasurySubjectId").prop("required", true);
                    $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);

                    fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${stageId}/6/1`, false, 0, 'انتخاب موضوع', undefined, "", true);
                }


                if (stagePostingGroup == 1) {
                    fill_select2(`/api/GN/NoSeriesLineApi/noserieslistnextstage`, "noSeriesId", true, `${stageId}/${+$("#branchId").val()}`);
                    $("#noSeriesId").prop("disabled", false).prop("required", true);
                }
            }
            else
                isRequestnextStageId = GetStageActionGetNext(model);

            fillStagePreviousInfo(workFlowId, stageId, response.actionId);

        }
        else isExistStageStep = false;
    });
}

function fillStagePreviousInfo(workflowId, stageId, actionId) {
    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")

    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");

    getStageFundPreviousList(workflowId, stageId, actionId);

}

function getStageFundPreviousList(workflowId, stageId, actionId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/getPreviousStageFundItemTypeListByStageId/${workflowId}/${stageId}/${actionId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            filStageFundTypePrevious(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function chekExistTreasuryRequestline(id) {
    let url = `${viewData_baseUrl_FM}/NewTreasuryLineApi/getTreasuryLineCount`;
    var result = $.ajax({
        url: url,
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
            error_handler(xhr, url);
            return 0;
        }
    });

    return result.responseJSON;
}

function fillEditTreasuryRequest(treasury) {

    let exitreasuryline = chekExistTreasuryRequestline(treasury.id);
    isLoadEdit = true;
    actionId = treasury.actionId;
    $("#no").val(treasury.no);
    $("#createDateTime").val(treasury.createDateTimePersian);
    $("#actionId").val(treasury.actionId);
    $("#transactionDatePersian").val(treasury.transactionDatePersian);
    $("#branchId").val(treasury.branchId).trigger("change.select2");
    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${treasury.branchId}/6/1`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(treasury.workflowId).trigger("change.select2");
    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${treasury.branchId}/${treasury.workflowId}/6/1/0/1`);
    $("#stageId").val(treasury.stageId).trigger("change.select2");

    $("#createUserId").val(treasury.createUserId);
    shamsiTransactionDate = treasury.parentTreasuryDatePersian ?? '';
    treasuryIdentityId = treasury.id;
    $("#transactionDatePersian").removeAttr("data-parsley-dateissame");


    statusId = actionId;
    getdataByStageId(treasury.workflowId, treasury.stageId);


    if (treasury.treasurySubjectId > 0) {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);

        $("#treasurySubjectId").prop("disabled", false);
        $("#treasurySubjectId").empty();

        fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${treasury.stageId}/6/1`, false, 0, 'انتخاب');
        $("#treasurySubjectId").val(treasury.treasurySubjectId).trigger("change.select2");


    }
    else {
        $("#treasurySubjectId").empty();
        $("#treasurySubjectId").removeAttr("required");
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero");
    }


    $("#noSeriesId").prop("disabled", false).prop("required", true)
    $("#noSeriesId").empty();

    var model = {
        id: +$("#treasurySubjectId").val(),
        stageId: +$("#stageId").val(),
        branchId: +$("#branchId").val(),
    };



    GetnoSeriesListWhitGlSgl(model, 6);


    let accountGLId = $("#accountGLId").val();
    $("#accountGLId").attr("required", accountGLId != "" ? true : false);
    $("#accountGLId").attr("data-parsley-selectvalzero", accountGLId != "" ? true : false);

    let accountSGLId = $("#accountSGLId").val();
    $("#accountSGLId").attr("required", accountSGLId != "" ? true : false);
    $("#accountSGLId").attr("data-parsley-selectvalzero", accountSGLId != "" ? true : false);

    $("#noSeriesId").attr("required", +treasury.noSeriesId > 0 ? true : false);
    $("#noSeriesId").attr("data-parsley-selectvalzero", +treasury.noSeriesId > 0 ? true : false);
    $("#noSeriesId").prop("disabled", +treasury.noSeriesId > 0 ? false : true);
    $("#noSeriesId").val(treasury.noSeriesId).trigger("change.select2");


    $("#accountDetailId").attr("required", +treasury.accountDetailId > 0 ? true : false);
    $("#accountDetailId").attr("data-parsley-selectvalzero", +treasury.accountDetailId > 0 ? true : false);
    $("#accountDetailId").empty();
    if ($("#noSeriesId").val() > 0) {

        if (+$("#noSeriesId").val() == 204) {

            let accountDetailIdOption = getAcountDetail(treasury.accountDetailId);
            getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
            var accountDetailOption = new Option(`${treasury.accountDetailId} - ${accountDetailIdOption.data.fullName}`, treasury.accountDetailId, true, true);
            $("#accountDetailId").append(accountDetailOption).trigger('change.select2');
        }
        else {
            getModuleListByNoSeriesIdUrl(treasury.noSeriesId, "accountDetailId");
            $("#accountDetailId").val(treasury.accountDetailId).trigger("change.select2");
        }

    }


    $("#note").val(treasury.note).trigger("change");

    $("#noSeriesId").prop("disabled", true);

    if (exitreasuryline >= 0)
        $("#treasurySubjectId").prop("disabled", true);

    else
        $("#treasurySubjectId").prop("disabled", false);


}


function getAcountDetail(id) {

    let url = `${viewData_baseUrl_MC}/PatientApi/getrecordbyid`;
    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
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

function filStageFundTypePrevious(res) {

    if (res.length > 0) {
        var previous = res.filter(x => x.selectType == 1);
        var fundtype = res.filter(x => x.selectType == 2);

        fillStagePrevious(previous);

        fillFundTypeList(fundtype);

        if (isLoadEdit) {

            isShowTransactionDatePersian = (isRequestnextStageId && currentPriority == 1) ? false : true;

            $("#transactionDatePersian").prop("disabled", isShowTransactionDatePersian);
            $("#open-datepicker-transactionDatePersian").prop("disabled", isShowTransactionDatePersian);
            $("#accountDetailId").prop("disabled", isShowTransactionDatePersian);
            $("#note").prop("disabled", isShowTransactionDatePersian);
        }
    }
}

function fillFundTypeList(data) {
    var output = ``;
    len = data.length;

    for (var i = 0; i < len; i++) {
        var fundtype = data[i];
        output += `<tr>
                       <td>${fundtype.id}</td>
                       <td>${fundtype.name}</td>
                  </tr>`
    }

    $("#stageFundTypeList").html(output);

}

function fillStagePrevious(data) {
    var output = ``;
    len = data.length;

    for (var i = 0; i < len; i++) {
        var prev = data[i];
        output += `<tr>
                       <td>${prev.id}</td>
                       <td>${prev.name}</td>
                  </tr>`
    }

    $("#stagePreviousList").html(output);

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
                isExistStageStep = true;
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

    if (!validate)
        return;

    var newModel = {
        id: +$("#modal_keyid_value").text(),
        branchId: +$("#branchId").val(),
        workFlowId: +$("#workFlowId").val(),
        stageId: +$("#stageId").val(),
        treasurySubjectId: +$("#treasurySubjectId").val(),
        noSeriesId: +$("#noSeriesId").val(),
        accountDetailId: +$("#accountDetailId").val(),
        transactionDatePersian: $("#transactionDatePersian").val(),
        currentInout: inOutResult,
        note: $("#note").val(),
        actionId: actionId,
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
            recordInsertUpdate(viewData_insrecord_url_tr, newModel, modal_name, msg_row_created, function (result) {
                if (result.successfull) {
                    if (result.id > 0) {

                        $(".modal-backdrop.fade.show").remove();

                        if (enter_toline)
                            navigation_item_click(`/FM/TreasuryRequestLine/${result.id}/1`);
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
            recordInsertUpdate(viewData_updrecord_url_tr, newModel, modal_name, msg_row_edited, function (result) {
                if (result.successfull) {
                    if (result.id > 0) {

                        modal_close();
                        $(".modal-backdrop.fade.show").remove();

                        if (enter_toline)
                            navigation_item_click(`/FM/TreasuryRequestLine/${result.id}/1`);
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

function run_button_displayTreasuryRequestSimple(id, rowNo, elm) {

    var check = controller_check_authorize("TreasuryRequestApi", "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalTreasuryRequest(`/FM/TreasuryRequestLine/display/${id}/1/${stageId}/${workflowId}`);
}

function displaySimpleHeader() {

    navigateToModalTreasuryRequest(`/FM/TreasuryRequestLine/display/${+$(".highlight").attr("data-id")}/${parentId}/1`);
}

function run_button_displayTreasuryRequestAdvance(id, rowNo, elm) {

    var check = controller_check_authorize("TreasuryRequestApi", "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalTreasuryRequest(`/FM/TreasuryRequestLine/display/${id}/0/${stageId}/${workflowId}`);
}

function navigateToModalTreasuryRequest(href) {

    initialPage();
    $("#contentdisplayTreasuryRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #loader").removeClass("displaynone");
    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayTreasuryRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayTreasuryRequestLine #loader,#contentdisplayTreasuryRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine #form,#contentdisplayTreasuryRequestLine .content").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine .itemLink").css("pointer-events", " none");
}

function run_button_treasuryRequestDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize("TreasuryRequestApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/TreasuryRequestLine/${lineId}/1`);
}

function run_button_treasuryRequestDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("TreasuryRequestApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/TreasuryRequestLine/${lineId}/0`);
}

function getTreasuryStageActionConfig(treasuryId) {
    let url = `${viewData_baseUrl_FM}/TreasuryStageActionApi/GetTreasuryStageActionByTreasury`;
    let outPut = $.ajax({
        url: url,
        data: JSON.stringify(treasuryId),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null) {
                return res;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return outPut.responseJSON;
}

function run_button_editTreasuryRequest(treasuryId, rowNo, elem) {

    var check = controller_check_authorize("TreasuryRequestApi", "UPD");
    if (!check)
        return;

    conditionalProperties.isCartable = false;

    var treasuryAction = getTreasuryStageActionConfig(treasuryId);
    if (treasuryAction.isDataEntry == 0) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }

    var modal_name = "AddEditModalTreasuryRequest";

    $("#rowKeyId").removeClass("d-none");

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(treasuryId);
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
        url: viewData_getrecord_url_tr,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(treasuryId),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {

                if (result.isDataEntry !== 0) {
                    fillEditTreasuryRequest(result);
                    modal_show(modal_name);
                }
                else {
                    alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url_tr)
        }
    });


}

function navigateToModalItemRequest(href) {
    initialPage();
    $("#contentdisplayItemRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayItemRequestLine #loader").removeClass("displaynone");
    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayItemRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemRequestLine #loader,#contentdisplayItemRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemRequestLine #form,#contentdisplayItemRequestLine .content").css("margin", 0);
    $("#contentdisplayItemRequestLine .itemLink").css("pointer-events", " none");
}

$("#treasurySubjectId").on("change", function () {

    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    $("#accountGLId").empty();
    $("#accountSGLId").empty();

    if (+$(this).val() > 0) {
        $("#noSeriesId").empty();
        $("#accountDetailId").empty();

        var model = {
            id: +$(this).val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
        };

        GetnoSeriesListWhitGlSgl(model, 6);
    }


});

$("#AddEditModalTreasuryRequest").on("hidden.bs.modal", function () {

    $("#treasurySubjectId").val(0).trigger("change").prop("disabled", true);
    $("#accountDetailId").val(0).trigger("change");
    $("#note").val("").trigger("change");
    $(".currentStage").text("-");
    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");
    treasuryIdentityId = 0;
    isShowTransactionDatePersian = false;
    isLoadEdit = false;

});

$("#AddEditModalTreasuryRequest").on("show.bs.modal", function () {
    isShowTransactionDatePersian = false;
    $("#transactionDatePersian").prop("disabled", false);
    $("#open-datepicker-transactionDatePersian").prop("disabled", false);

    if (modal_open_state == "Edit") {
        $("#branchId").prop('disabled', true);
        $("#workFlowId").prop('disabled', true);
        $("#stageId").prop('disabled', true);
        $("#currencyId").prop('disabled', true);
        isLoadEdit = true;

    }
    else {
        isLoadEdit = false;
        $("#transactionDatePersian").val(moment().format('jYYYY/jMM/jDD'));

        $("#accountGLId").removeData("parsley-required-message");
        $("#accountGLId").prop("required", false);
        $("#accountGLId").removeAttr("data-parsley-selectvalzero");


        $("#accountSGLId").removeData("parsley-required-message");
        $("#accountSGLId").prop("required", false);
        $("#accountSGLId").removeAttr("data-parsley-selectvalzero");


        $("#accountDetailId").removeData("parsley-required-message");
        $("#accountDetailId").prop("required", false);
        $("#accountDetailId").removeAttr("data-parsley-selectvalzero");

        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero");
        $("#treasurySubjectId").removeAttr("required");
        $("#treasurySubjectId").data("id", 0);
        $("#requestNameContainer").addClass("displaynone");
        $("#treasurySubjectId").empty();
        $("#treasurySubjectId").prop("disabled", true);
        $("#branchId").prop('disabled', false).trigger("change");
        $("#workFlowId").prop('disabled', false).trigger("change");
        $("#stageId").val(0).trigger('change.select2');
        $("#stageId").prop('disabled', false);
        $("#currencyId").prop('disabled', false);
        $("#treasurySubjectId").val(0).trigger("change");
        $("#accountDetailId").val(0).trigger("change");
        $("#note").prop("disabled", false);
        $("#note").val("").trigger("change");

    }

});

$("#branchId").change(function () {

    let branchId = +$(this).val();
    $("#workFlowId").empty();
    clearForm();
    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/6/1`, false, 0, 'انتخاب کنید', undefined, "", true);
});

$("#workFlowId").change(function () {
    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    clearForm();
    $("#stageId").empty();

    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/6/1/0/1`);
});

$("#stageId").change(function () {

    clearForm();
    var stageId = +$(this).val();
    if (stageId !== 0) {
        inOutResult = getInOutStage(stageId);
        getdataByStageId(+$("#workFlowId").val(), stageId);

    }


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
    $("#note").val("").trigger("change");
});

$("#treasurySubjectId").on("change", function () {



    if (+$(this).val() > 0) {
        $("#accountGLId").val("");
        $("#accountSGLId").val("");
        $("#noSeriesId").val("");
        $("#accountDetailId").val("");

        var model = {
            id: +$(this).val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
        };

        GetnoSeriesListWhitGlSgl(model, 6);
    }
});

$("#noSeriesId").on("change", function (ev) {
    var noSeriesId = +$(this).val();
    if ((noSeriesId == 0 || noSeriesId == null)) {
        $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
    }
    else {
        $("#accountDetailId").prop("disabled", false).prop("required", true)
        $("#accountDetailId").empty();
        getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
    }

});

initTreasuryRequestIndexForm();

window.Parsley._validatorRegistry.validators.checkglsglrequied = undefined;
window.Parsley.addValidator("checkglsglrequied", {

    validateString: function (value) {
        var gl = +$("#accountGLId").data("value");
        var sgl = +$("#accountSGLId").data("value")

        if ((currentPriority == 1 && currentIsTreasurySubject) && (+gl === 0 || +sgl === 0))
            return false;

        return true;
    },
    messages: {
        en: 'مبانی ارتباط با حسابداری تعریف نشده است(کل-معین...)'
    }
});




