var viewData_controllername = "NewTreasuryApi",
    viewData_insrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_getrecord_url_tr = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getGlSGLbyparentId = `${viewData_baseUrl_WF}/WorkflowApi/getrequestglsglbyworkflowcategory`,
    viewData_request_list = `${viewData_baseUrl_FM}/${viewData_controllername}/treasuryrequest_getdropdown`,
    conditionalProperties = {
        isRequest: false,
        isAfterChange: false,
        isTreasurySubject: false,
        isPreviousStage: false,
        isBank: false,
        isDataEntry: false,
        isCartable: false
    },
    tempDocumentTypeId = 0,
    isShowTransactionDatePersianTreasury = false,
    currentPriority = 0,
    workflowCategoryId = 0,
    workflowCategoryName = null,
    currentIsTreasurySubject = false,
    isnextStageId = false,
    treasuryIdentityId = 0,
    treasuryParentId = 0,
    statusId = 0,
    actionId = 0,
    isRequest = 0,
    isTreasurySubject = false,
    isTreasuryRequest = false,
    isRequired = 0,
    isLoadEdit = false,
    isExistStageStep = false,
    shamsiTransactionDate = "",
    lastpagetable_formkeyvalue = [],
    selectedRowId = "";



function initTreasuryIndexForm() {

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
    $(`#documentTypeId`).val("");
    $(`#note`).val("");

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
    $("#parentId").html("").prop("required", false).prop("disabled", true).prop("data-parsley-validate-if-empty", false);
    treasuryParentId = 0;
    treasuryIdentityId = 0;
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
            isRequest = response.isRequest;


            if (!isLoadEdit) {


                var documentType = getStageDocumentType(stageId);
                $("#documentTypeId").val(documentType.id != 0 ? `${documentType.id} - ${documentType.name}` : "");
                $(`#documentTypeId`).data("value", documentType.id);
                tempDocumentTypeId = documentType.id;
                $(`#documentTypeId`).prop("required", documentType.stageClassId != 1);

                $("#parentId").empty().prop("disabled", true);

                $("#parentId").prop("required", false);
                $("#parentId").prop("data-parsley-selectvalzero", false);
                $("#parentId").prop("data-parsley-checkglsglrequied", false);

                $("#transactionDatePersian").removeAttr("data-parsley-dateissame");


                $("#treasurySubjectId").prop("required", false);
                $("#treasurySubjectId").prop("data-parsley-selectvalzero", false);
                $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
                $("#treasurySubjectId").empty().prop("disabled", true);


                $("#accountGLId").val("");
                $("#accountSGLId").val("");
                $("#accountDetailId").val(0).trigger("change");



                if (response.isRequest) {
                    isRequired = false;
                    $("#parentId").prop("required", true);
                    $("#parentId").prop("data-parsley-selectvalzero", true);
                    $("#parentId").prop("data-parsley-checkglsglrequied", true);
                    $("#parentId").prop("disabled", false);
                    $("#transactionDatePersian").attr("data-parsley-dateissame", "");

                    let parentParameter = treasuryParentId == 0 ? null : treasuryParentId;
                    let identityParameter = treasuryIdentityId == 0 ? null : treasuryIdentityId;

                    fill_select2(viewData_request_list, "parentId", true, `${+$("#branchId").val()}/${+$("#workFlowId").val()}/${+$("#stageId").val()}/${parentParameter}/${identityParameter}`, false, 3, "انتخاب درخواست", undefined, "", true);
                }
                else {
                    shamsiTransactionDate = moment().format('jYYYY/jMM/jDD');
                    $("#transactionDatePersian").removeAttr("data-parsley-dateissame");
                }


                if (response.isTreasurySubject) {

                    $("#treasurySubjectId").prop("disabled", (stageId == 35 || stageId == 49));
                    $("#treasurySubjectId").prop("required", true);
                    $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);
                    $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

                    fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${stageId}/6/3`, false, 0, 'انتخاب موضوع', undefined, "", true);
                }


                isRequired = setRequiredElement(response.isTreasurySubject, response.stageId, response.previousStageActionId, response.isRequest);
                validationRequiredGlSGl();

            }
            else
                isnextStageId = GetStageActionGetNext(model);

            fillStagePreviousInfo(workFlowId, stageId, response.actionId);

        }
        else
            isExistStageStep = false;
    });
}

function setRequiredElement(isTreasurySubject, stageId, previousStageActionId, isRequest) {

    var inOutResult = getInOutStage(stageId);

    // required=1
    if (inOutResult == 3 && previousStageActionId != null && isRequest) {
        return 1;
    }
    //required=2
    else if (inOutResult != 3 && previousStageActionId != null && !isRequest) {
        return 2;
    }
    //required=3
    else if (isTreasurySubject && !isRequest) {
        return 3;
    }
    //required=4
    else if (previousStageActionId == null && !isRequest) {
        return 4;
    }
    //required=5
    else {
        return 5;
    }
}

function validationRequiredGlSGl() {


    // isrequest=true / previous=true / inout=3   
    if (isRequired == 1) {
        $("#parentId").prop("disabled", false);
        $("#parentId").prop("required", true);
        $("#parentId").prop("data-parsley-selectvalzero", true);
        $("#parentId").prop("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").prop("disabled", true);
        $("#accountGLId").prop("disabled", true);
        $("#accountSGLId").prop("disabled", true);
        $("#noSeriesId").prop("disabled", true);
        $("#accountDetailId").prop("disabled", true);

        $("#treasurySubjectId").removeAttr("required", true);
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountGLId").removeAttr("required", true);
        $("#accountGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountSGLId").removeAttr("required", true);
        $("#accountSGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountSGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#noSeriesId").removeAttr("required", true);
        $("#noSeriesId").removeAttr("data-parsley-selectvalzero", true);
        $("#noSeriesId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#accountDetailId").removeAttr("required", true);
        $("#accountDetailId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountDetailId").removeAttr("data-parsley-checkglsglrequied", true);
    }
    // isrequest=false / previous=false / inout !=3
    else if (isRequired == 2) {

        $("#parentId").prop("disabled", true);
        $("#treasurySubjectId").prop("disabled", true);
        $("#accountGLId").prop("disabled", true);
        $("#accountSGLId").prop("disabled", true);
        $("#noSeriesId").prop("disabled", true);
        $("#accountDetailId").prop("disabled", true);

        $("#parentId").removeAttr("required", true);
        $("#parentId").removeAttr("data-parsley-selectvalzero", true);
        $("#parentId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").removeAttr("required", true);
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountGLId").removeAttr("required", true);
        $("#accountGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountSGLId").removeAttr("required", true);
        $("#accountSGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountSGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#noSeriesId").removeAttr("required", true);
        $("#noSeriesId").removeAttr("data-parsley-selectvalzero", true);
        $("#noSeriesId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#accountDetailId").removeAttr("required", true);
        $("#accountDetailId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountDetailId").removeAttr("data-parsley-checkglsglrequied", true);
    }
    // isTreasurySubject==true / isRequest=false
    else if (isRequired == 3) {

        $("#treasurySubjectId").prop("disabled", false);

        $("#parentId").prop("disabled", true);
        $("#accountGLId").prop("disabled", true);
        $("#accountSGLId").prop("disabled", true);
        $("#noSeriesId").prop("disabled", false);
        $("#accountDetailId").prop("disabled", false);

        $("#parentId").removeAttr("required", true);
        $("#parentId").removeAttr("data-parsley-selectvalzero", true);
        $("#parentId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

        $("#accountGLId").attr("required", true);
        $("#accountGLId").attr("data-parsley-selectvalzero", true);
        $("#accountGLId").attr("data-parsley-checkglsglrequied", true);

        $("#accountSGLId").attr("required", true);
        $("#accountSGLId").attr("data-parsley-selectvalzero", true);
        $("#accountSGLId").attr("data-parsley-checkglsglrequied", true);

        $("#noSeriesId").attr("required", true);
        $("#noSeriesId").attr("data-parsley-selectvalzero", true);
        $("#noSeriesId").attr("data-parsley-checkglsglrequied", true);

        $("#accountDetailId").attr("required", true);
        $("#accountDetailId").attr("data-parsley-selectvalzero", true);
        $("#accountDetailId").attr("data-parsley-checkglsglrequied", true);
    }

    // isrequest=false / previous=true 
    else if (isRequired == 4) {

        $("#parentId").prop("disabled", true);
        $("#treasurySubjectId").prop("disabled", true);
        $("#accountGLId").prop("disabled", true);
        $("#accountSGLId").prop("disabled", true);
        $("#noSeriesId").prop("disabled", true);
        $("#accountDetailId").prop("disabled", true);

        $("#parentId").removeAttr("required", true);
        $("#parentId").removeAttr("data-parsley-selectvalzero", true);
        $("#parentId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").removeAttr("required", true);
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountGLId").removeAttr("required", true);
        $("#accountGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#accountSGLId").removeAttr("required", true);
        $("#accountSGLId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountSGLId").removeAttr("data-parsley-checkglsglrequied", true);


        $("#noSeriesId").removeAttr("required", true);
        $("#noSeriesId").removeAttr("data-parsley-selectvalzero", true);
        $("#noSeriesId").removeAttr("data-parsley-checkglsglrequied", true);

        $("#accountDetailId").removeAttr("required", true);
        $("#accountDetailId").removeAttr("data-parsley-selectvalzero", true);
        $("#accountDetailId").removeAttr("data-parsley-checkglsglrequied", true);
    }
    else {
        $("#parentId").prop("disabled", false);
        $("#parentId").prop("required", true);
        $("#parentId").prop("data-parsley-selectvalzero", true);
        $("#parentId").prop("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").prop("disabled", true);
        $("#accountGLId").prop("disabled", true);
        $("#accountSGLId").prop("disabled", true);
        $("#noSeriesId").prop("disabled", true);
        $("#accountDetailId").prop("disabled", true);

        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

        $("#accountGLId").attr("required", true);
        $("#accountGLId").attr("data-parsley-selectvalzero", true);
        $("#accountGLId").attr("data-parsley-checkglsglrequied", true);

        $("#accountSGLId").attr("required", true);
        $("#accountSGLId").attr("data-parsley-selectvalzero", true);
        $("#accountSGLId").attr("data-parsley-checkglsglrequied", true);

        $("#noSeriesId").attr("required", true);
        $("#noSeriesId").attr("data-parsley-selectvalzero", true);
        $("#noSeriesId").attr("data-parsley-checkglsglrequied", true);

        $("#accountDetailId").attr("required", true);
        $("#accountDetailId").attr("data-parsley-selectvalzero", true);
        $("#accountDetailId").attr("data-parsley-checkglsglrequied", true);
    }

}

function fillStagePreviousInfo(workFlowId, stageId, actionId) {

    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")

    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");

    getStageFundPreviousList(workFlowId, stageId, actionId);

}

function getStageFundPreviousList(workFlowId, stageId, actionId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/getPreviousStageFundItemTypeListByStageId/${workFlowId}/${stageId}/${actionId}`;

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

function chekExistTreasuryline(id) {
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

function fillEditTreasury(treasury) {
    
    let exitreasuryline = chekExistTreasuryline(treasury.id);

    $("#no").val(treasury.no);
    $("#createDateTime").val(treasury.createDateTimePersian);
    $("#actionId").val(treasury.actionId);
    $("#transactionDatePersian").val(treasury.transactionDatePersian);
    $("#branchId").val(treasury.branchId).trigger("change.select2");
    fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${treasury.branchId}/6/3`, false, 0, 'انتخاب کنید', undefined, "", true);
    $("#workFlowId").val(treasury.workflowId).trigger("change.select2");
    fill_select2(`/api/WF/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${treasury.branchId}/${treasury.workflowId}/6/3,1/0/1`);
    $("#stageId").val(treasury.stageId).trigger("change");
    $("#branchId").prop('disabled', true);
    $("#stageId").prop('disabled', true);
    $("#createUserId").val(treasury.createUserId);
    treasuryParentId = treasury.requestId ?? 0;
    shamsiTransactionDate = treasury.transactionDatePersian;
    treasuryIdentityId = treasury.id;

    $("#transactionDatePersian").removeAttr("data-parsley-dateissame");

    workflowCategoryId = treasury.parentworkflowcategoryId;
    statusId = treasury.actionId;
    getdataByStageId(treasury.workflowId, treasury.stageId);


    isTreasurySubject = treasury.treasurySubjectId > 0 ? true : false;
    isTreasuryRequest = treasury.isRequest;

    if (treasury.treasurySubjectId > 0) {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);
        $("#treasurySubjectId").prop("disabled", true);
        $("#treasurySubjectId").empty();

        if (treasury.isRequest) {
            var treasurySubjectOption = new Option(`${treasury.treasurySubjectId} - ${treasury.treasurySubjectName}`, treasury.treasurySubjectId, true, true);
            $("#treasurySubjectId").append(treasurySubjectOption).trigger('change.select2');
        }
        else {
            fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${treasury.stageId}/6/3`, false, 0, 'انتخاب موضوع', undefined, "", true);

            $("#treasurySubjectId").val(treasury.treasurySubjectId).trigger('change.select2');
        }



    }
    else {
        $("#treasurySubjectId").removeAttr("required");
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero");
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);

        $("#stageId").prop("data-parsley-checkglsglrequied", true);
    }
    isRequest = treasury.isRequest;
    if (treasury.isRequest) {

        $("#parentId").attr("required", true);
        $("#parentId").attr("data-parsley-selectvalzero", true);
        $("#parentId").prop("data-parsley-checkglsglrequied", true);

        $("#transactionDatePersian").attr("data-parsley-transactiondateissame", "");

        let parentParameter = treasuryParentId == 0 ? null : treasuryParentId;
        let identityParameter = treasuryIdentityId == 0 ? null : treasuryIdentityId;

        fill_select2(viewData_request_list, "parentId", true, `${treasury.branchId}/${treasury.workflowId}/${treasury.stageId}/${parentParameter}/${identityParameter}`, false, 0, "انتخاب درخواست");

        $("#parentId").val(treasury.requestId).prop("disabled", !treasury.isRequest).trigger("change.select2");


    }
    else {
        $("#parentId").removeAttr("required");
        $("#parentId").removeAttr("data-parsley-selectvalzero");
        $("#transactionDatePersian").removeAttr("data-parsley-transactiondateissame");

    }




    $("#parentIdContainer").removeClass("displaynone");


    let accountGLName = treasury.accountGLId + ' - ' + treasury.accountGLName;
    let accountSGLName = treasury.accountSGLId + ' - ' + treasury.accountSGLName;
    $(`#accountGLId`).val(treasury.accountGLId == 0 ? "" : accountGLName);
    $(`#accountGLId`).data("value", treasury.accountGLId);
    $(`#accountSGLId`).val(treasury.accountSGLId == 0 ? "" : accountSGLName);
    $(`#accountSGLId`).data("value", treasury.accountSGLId);

    $(`#documentTypeId`).val(treasury.documentTypeId == 0 ? "" : `${treasury.documentTypeName}`);
    $(`#documentTypeId`).data("value", treasury.documentTypeId);
    var documentType = getStageDocumentType(treasury.stageId);
    $(`#documentTypeId`).prop("required", documentType.stageClassId != 1);

    $("#noSeriesId").empty();
    $("#noSeriesId").prop("disabled", treasury.isRequest).prop("required", treasury.isRequest);

    fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${treasury.accountGLId}/${treasury.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
    $("#noSeriesId").val(treasury.noSeriesId).trigger("change.select2");

    $("#accountDetailId").empty();
    $("#accountDetailId").prop("disabled", treasury.isRequest).prop("required", treasury.isRequest);
    if ($("#noSeriesId").val() > 0) {
        if (+$("#noSeriesId").val() == 204) {

            let accountDetailIdOption = getAcountDetail(treasury.accountDetailId);
            getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
            var accountDetailOption = new Option(`${treasury.accountDetailId} - ${accountDetailIdOption.data.fullName}`, treasury.accountDetailId, true, true);
            $("#accountDetailId").append(accountDetailOption).trigger('change.select2');
        }
        else {
            getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
            $("#accountDetailId").val(treasury.accountDetailId).trigger("change");
        }

    }

    $("#note").val(treasury.note);

    isRequired = setRequiredElement(treasury.treasurySubjectId, treasury.stageId, treasury.previousStageActionId, treasury.isRequest);
    validationRequiredGlSGl();

    $("#noSeriesId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);
    if (exitreasuryline >= 0) {

        $("#treasurySubjectId").prop("disabled", true);

        $(`#documentTypeId`).prop("disabled", true);
    }
    else {
        $("#treasurySubjectId").prop("disabled", false);

        $(`#documentTypeId`).prop("disabled", false);
    }

    $("#parentId").prop("disabled", true);
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
            isShowTransactionDatePersianTreasury = (isnextStageId && currentPriority == 1) ? false : true;

            $("#transactionDatePersian").prop("disabled", isShowTransactionDatePersianTreasury);
            $("#open-datepicker-transactionDatePersian").prop("disabled", isShowTransactionDatePersianTreasury);
            $("#accountDetailId").prop("disabled", isTreasuryRequest || !isTreasurySubject ? true : isShowTransactionDatePersianTreasury);
            $("#note").prop("disabled", isShowTransactionDatePersianTreasury);

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

function getGlSGLbyparentId(identityId, workflowCategoryId) {

    let url = `${viewData_getGlSGLbyparentId}/${workflowCategoryId}/${identityId}`
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

                $(`#note`).val(result.note);

                $(`#transactionDatePersian`).val(result.documentDatePersian);

                var treasurySubjectOption = new Option(`${result.treasurySubjectId} - ${result.treasurySubjectName}`, result.treasurySubjectId, true, true);
                $("#treasurySubjectId").append(treasurySubjectOption);
                shamsiTransactionDate = result.documentDatePersian;

                let hasrequestId = +$("#parentId").val() > 0 ? true : false;

                fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                $("#noSeriesId").val(result.noSeriesId).trigger("change.select2");

                if (checkResponse($("#noSeriesId").val()))
                    fillAccountDetail(hasrequestId, result.accountDetailId, result.accountDetailRequired, result.noSeriesId);


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
            error_handler(xhr, viewData_getGlSGLbyparentId);
        }
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
        parentId: +$("#parentId").val(),
        accountGLId: +$(`#accountGLId`).data("value"),
        accountSGLId: +$("#accountSGLId").data("value"),
        noSeriesId: +$("#noSeriesId").val(),
        accountDetailId: +$("#accountDetailId").val(),
        documentTypeId: $("#documentTypeId").data("value"),
        transactionDatePersian: $("#transactionDatePersian").val(),
        note: $("#note").val(),
        createDateTime: $("#createDateTime").val(),
        actionId: actionId,
        parentWorkflowCategoryId: (workflowCategoryId != null ? +workflowCategoryId : 0),
        createUserId: $("#createUserId").val(),

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
                            navigation_item_click(`/FM/NewTreasuryLine/${result.id}/1`);
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
                            navigation_item_click(`/FM/NewTreasuryLine/${result.id}/1`);
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

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize("NewTreasuryApi", "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var requestId = +$(elm).parents("tr").first().data("requestid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");

    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`);
}

function displaySimpleHeader() {
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${+$(".highlight").attr("data-id")}/${parentId}/1`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize("NewTreasuryApi", "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var requestId = +$(elm).parents("tr").first().data("requestid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/0/${stageId}/${workflowId}`);
}

function navigateToModalTreasury(href) {

    initialPage();
    $("#contentdisplayTreasuryLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryLine #loader").removeClass("displaynone");

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
            $(`#contentdisplayTreasuryLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayTreasuryLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
    $("#contentdisplayTreasuryLine .itemLink").css("pointer-events", " none");
}

function run_button_edittreasury(treasuryId, rowNo, elem) {

    conditionalProperties.isCartable = false;
    var check = controller_check_authorize("NewTreasuryApi", "UPD");
    if (!check)
        return;

    var treasuryAction = getTreasuryStageActionConfig(treasuryId);
    if (treasuryAction.isDataEntry == 0) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }



    var modal_name = "AddEditModalTreasury";

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
                    fillEditTreasury(result);
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

$("#AddEditModalTreasury").on("show.bs.modal", function () {

    if (modal_open_state == "Edit") {
        $("#branchId").prop('disabled', true);
        $("#workFlowId").prop('disabled', true);
        $("#stageId").prop('disabled', true);
        $("#currencyId").prop('disabled', true);
        isLoadEdit = true;
    }
    else {
        $("#transactionDatePersian").val(moment().format('jYYYY/jMM/jDD'));
        $("#transactionDatePersian").prop('disabled', false);
        $("#accountDetailId").removeData("parsley-required-message");
        $("#accountDetailId").prop("required", false);
        $("#accountDetailId").removeAttr("data-parsley-selectvalzero");
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero");
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
        $("#treasurySubjectId").removeAttr("required");
        $("#treasurySubjectId").data("id", 0);
        $("#parentIdContainer").removeClass("displaynone");
        $("#requestNameContainer").addClass("displaynone");
        $("#treasurySubjectId").empty();
        $("#treasurySubjectId").prop("disabled", true);
        $("#branchId").prop('disabled', false).trigger("change");
        $("#workFlowId").prop('disabled', false).trigger("change");
        $("#stageId").val(0).trigger('change.select2');
        $("#stageId").prop('disabled', false);
        $("#currencyId").prop('disabled', false);
        $("#treasurySubjectId").val(0).trigger("change");
        $("#accountGLId").val("");
        $("#accountGLId").data("value", 0);
        $("#accountSGLId").val("");
        $("#accountSGLId").data("value", 0);
        $("#accountDetailId").val(0).trigger("change");
        $("#note").prop("disabled", false);
        $("#note").val("").trigger("change");
        isLoadEdit = false;

        isTreasurySubject = false;
        isTreasuryRequest = false;
    }

});

$("#branchId").change(function () {

    let branchId = +$(this).val();
    $("#workFlowId").empty();
    clearForm();
    if (branchId !== 0)
        fill_select2("/api/WF/WorkflowApi/getdropdown", "workFlowId", true, `${branchId}/6/3`, false, 0, 'انتخاب کنید', undefined, "", true);

});

$("#workFlowId").change(function () {
    let workFlowId = +$(this).val(),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val();
    clearForm();
    $("#stageId").empty();
    if (workFlowId !== 0)
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workFlowId}/6/3/0/1`);
});

$("#stageId").change(function () {
    clearForm();

    var stageId = +$(this).val();
    if (stageId !== 0 && (modal_open_state != "Edit"))
        getdataByStageId(+$("#workFlowId").val(), stageId);

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
    $("#note").val("");
});

$("#treasurySubjectId").on("change", function () {

    $("#noSeriesId").empty();
    $("#accountDetailId").empty();

    if (+$(this).val() > 0) {
        model = {
            headerId: +$(this).val(),
            stageId: +$("#stageId").val(),
            branchId: +$("#branchId").val(),
            postingGroupTypeId: 1
        }

        if (+$("#noSeriesId").val() > 0)
            setGlSglInfo(model, isRequest, +$("#noSeriesId").val());
        else {

            var model = {
                id: +$(this).val(),
                stageId: +$("#stageId").val(),
                branchId: +$("#branchId").val(),
            };

            GetnoSeriesListWhitGlSgl(model, 6);
        }
    }
});

$("#parentId").on("change", function () {

    shamsiTransactionDate = "";
    if (+$(this).val() !== 0) {
        $("#noSeriesId").empty();
        $("#accountDetailId").empty();
        workflowCategoryName = document.getElementById("parentId");
        var len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;
        workflowCategoryId = len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0];
        getGlSGLbyparentId($(this).val(), +workflowCategoryId);

    }
});

$("#noSeriesId").on("change", function () {
    $("#accountDetailId").empty();
    if (+$(this).val() !== 0) {
        $("#accountDetailId").prop("disabled", false).prop("required", true);
        getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
    }
  
});

$("#accountDetailId").on("change", function () {
    $('#brandName').val("");
    if (+$(this).val() !== 0) {
        getBrandNamebyaccountDetailId($(this).val());

    }
});

$("#AddEditModalTreasury").on("hidden.bs.modal", function () {
    $("#parentId").empty();
    $("#parentId").val(0).trigger("change").prop("disabled", true);
    $("#treasurySubjectId").val(0).trigger("change").prop("disabled", true);
    $("#accountGLId").val("");
    $("#accountGLId").data("value", 0);
    $("#accountSGLId").val("");
    $("#accountSGLId").data("value", 0);
    $("#noSeriesId").empty();
    $("#accountDetailId").val(0).trigger("change");
    $("#note").val("").trigger("change");
    $(".currentStage").text("-");
    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");
    treasuryParentId = 0;
    treasuryIdentityId = 0;
    isLoadEdit = false;
});

initTreasuryIndexForm();

window.Parsley._validatorRegistry.validators.transactiondateissame = undefined
window.Parsley.addValidator("transactiondateissame", {
    validateString: function (value) {
        if (+$("#parentId").val() > 0) {
            var transactionDate = moment.from(value, 'fa', 'YYYY/MM/DD');
            var reqDate = moment.from(shamsiTransactionDate, 'fa', 'YYYY/MM/DD');
            if (transactionDate.isValid()) {
                transactionDate = transactionDate.format('YYYY/MM/DD');
                reqDate = reqDate.format('YYYY/MM/DD');
                var dateIsValid = moment(reqDate).isSameOrBefore(transactionDate, 'day');
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