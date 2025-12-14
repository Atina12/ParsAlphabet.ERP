var viewData_form_title = "اسناد خزانه",
    viewData_controllername = "NewTreasuryLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/display`,
    viewData_getHeader_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getheader`,
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyids`,
    viewData_getTreasuryDetailrecord_url = `${viewData_baseUrl_FM}/TreasuryDetailApi/getrecordbytreasurylineid`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/deleteTreasuryLine`,
    viewData_getpagetableLine_url = `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasurylinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insertTreasuryLine`,
    viewData_updrecord_header_url = `${viewData_baseUrl_FM}/NewTreasuryApi/updateinline`,
    viewData_TreasuryLineColumn_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryLineColumns`,
    viewData_previousStageLines_insert_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insertpreviousstagelines`,
    viewData_requestTreasuryLines_url = `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasuryrequest`,
    viewData_requestTreasuryLines_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrequestfilteritems`,
    viewData_requestFundTypes_url = `${viewData_baseUrl_FM}/NewTreasuryApi/requestfundtypegetdropdown`,
    viewData_getGlSGLbyRequestId = `${viewData_baseUrl_WF}/WorkflowApi/getrequestglsglbyworkflowcategory`,
    viewData_checkPreviousId_url = `/api/WFApi/stagehaspreviousid`,
    viewData_updateTreasuryStep_url = `${viewData_baseUrl_FM}/NewTreasuryApi/updatestep`,
    viewData_treasuryStepList_url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist`,
    viewData_request_list = `${viewData_baseUrl_FM}/NewTreasuryApi/treasuryrequest_getdropdown`,
    viewData_getTreasuryCheckExist = `${viewData_baseUrl_FM}/NewTreasuryApi/checkexist`,
    viewData_getTreasuryCheckBankInfo = `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryCheckBankInfo`,
    viewData_treasurySybjectStage_url = `/api/WFApi/treasurysubjectstage`,
    viewData_has_SendActionId = `${viewData_baseUrl_WF}/StageActionApi/getaction`,
    viewData_checkRequest_isLastConfirmHeader = `${viewData_baseUrl_FM}/NewTreasuryApi/requestislastconfirmheader`,
    glSGLModel = { accountGLId: 0, accountGLName: "", accountSGLId: 0, accountSGLName: "", accountDetailId: 0, accountDetailRequired: 0 },
    treasurySubjectInfo = {}, headerLine_formkeyvalue = [], treasuryLine_formkeyvalue = [], treasuryLine_additionalData = [],
    arr_headerLinePagetables = [], lastpagetable_formkeyvalue = [], shamsiTransactionDate = "",
    lastFundType = 0, requestId = 0, stageId = 0, branchId = 0, id = 0, hasPriviousMode = false, header_pgnation = 0, treasurySubjectChangeCount = 0, requestIdChangeCount = 0, requestLinesData = [],
    workflowCategoryId = null,
    workflowCategoryName = null,
    exitreasuryline = false,
    currentActionId = 0,
    requestedActionId = 0,
    branchId = 0,
    updatedRequestId = 0, hasRefreshColumn = true, workflowId = 0;


activePageId = "treasuryLinePage";
headerLine_formkeyvalue.push($(`#${activePageId} #treasuryId`).val());
headerLine_formkeyvalue.push(+$(`#${activePageId} #isDefaultCurrency`).val());

var selectedLineDetailId = 0, per1 = 0;

$(`#${activePageId} #previousStagePageTable .relational-caption`).text("نوع وجه");
$(`#${activePageId} #previousStagePageTable .relationalbox`).removeClass("displaynone");

//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonTreasuryLineList",
    editable: true,
    selectable: false,
    pagerowscount: 15,
    currentpage: 1,
    isSum: true,
    pageno: 0,
    endData: false,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: null,
    headerType: "outline",
    getpagetable_url: viewData_getpagetableLine_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/updateTreasuryLine`,
    getsum_url: `${viewData_baseUrl_FM}/${viewData_controllername}/treasurylinesum`,
    delRecord_Url: viewData_deleterecord_url,
    getColumn_Url: viewData_TreasuryLineColumn_url,
    pagetable_laststate: ""
},
    previousStagePage = {
        pagetable_id: "previousStagePageTable",
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        pageNo: 0,
        editable: false,
        endData: false,
        //lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        lastPageloaded: 0,
        getpagetable_url: viewData_requestTreasuryLines_url,
        getfilter_url: viewData_requestTreasuryLines_filter_url,
    };

arr_pagetables.push(previousStagePage);
arr_headerLinePagetables.push(pagelist1);

function call_initFormTreasuryLine(header_Pagination = 0, elemId = undefined) {
    //$("#previousStagePageTable #countRowButton").remove()
    //$("#previousStagePageTable #lastRow").nextAll().remove()
    isFormLoaded = true;
    header_pgnation = header_Pagination;
    if (headerLine_formkeyvalue.length == 2)
        headerLine_formkeyvalue.push(header_Pagination);
    else
        headerLine_formkeyvalue[2] = header_pgnation;


    if (header_pgnation > 0) {
        $(`#${activePageId} #header-div-content`).css("opacity", 0.1);
        $(`#${activePageId} #header-lines-div`).css("opacity", 0.1);
        $(`#${activePageId} #loader`).removeClass("displaynone");
    }

    InitForm(activePageId, true, callBackHeaderFill, null, callBackLineFill, callBackBeforeLineFill, callBackHeaderColumnFill, getRecordParameterFinalizeFunc);
}

async function callBackHeaderColumnFill() {

    if (conditionalProperties.isPreviousStage > 0 && requestId == 0)
        hasPriviousMode = true;
    else
        hasPriviousMode = false;

    if ((isFormLoaded || header_pgnation > 0)) {
        if ($(".ins-out #addRequestLines").length == 0)
            $(".ins-out").append(`<button onclick="add_requestLines()" type="button" id="addRequestLines" data-disabled="false" class="btn btn-success ml-2 pa float-sm-left waves-effect"  value="">افزودن از درخواست</button>`);

        $(`#${activePageId} #fundTypeId`).empty();

        fill_select2(`api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "fundTypeId", true, `${stageId}/6`);
        $(`#${activePageId} #fundTypeId`).val($("#fundTypeId option:first").val()).trigger("change");
        public_tr_object_onchange($(`#${activePageId} #fundTypeId`), 'jsonTreasuryLineList');

        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #fundTypeId`).val());
        else
            headerLine_formkeyvalue[3] = +$(`#${activePageId} #fundTypeId`).val();
        if (conditionalProperties.isBank) {
            $("#headerLineInsUp").addClass("d-none");
        }
        else
            $("#headerLineInsUp").removeClass("d-none");




        headerLine_formkeyvalue[4] = stageId;
        headerLine_formkeyvalue[5] = workflowId;
    }
}

async function callBackBeforeLineFill() {
    lastFundType = headerLine_formkeyvalue[3];
    InitFormLine();
}

function change_addRequestLineBtn_disabled(prop) {

    setTimeout(function () {
        if (prop) {

            if ($("#addRequestLines").attr("disabled") == undefined)
                if (conditionalProperties.isEqualToParentRequest)
                    $("#addRequestLines").attr('disabled', false);
                else
                    $("#addRequestLines").attr('disabled', prop);
            $("#addRequestLines").removeAttr('onclick');

        }
        else {
            if ($("#addRequestLines").attr("disabled") != undefined)
                $("#addRequestLines").removeAttr(`disabled`);

            if (conditionalProperties.isEqualToParentRequest || $("#formPlateHeaderTBody").data("isdataentry") == 2)
                $("#addRequestLines").attr('disabled', false);
            else
                $("#addRequestLines").attr('disabled', true);

            $("#addRequestLines").attr('onclick', 'add_requestLines()');
        }
    }, 100);
}

function getRecordParameterFinalizeFunc(getRecordModel) {
    getRecordModel.isDefaultCurrency = +$("#isDefaultCurrency").val();
    return getRecordModel;
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

//async function loadingAsync(loading, elementId) {
//    if (loading) {
//        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
//        $(`#${elementId}`).prop("disabled", true);
//    }
//    else {
//        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
//        $(`#${elementId}`).prop("disabled", false);
//    }
//}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="excelTearsury()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="listTearsury()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '>
                                                        <select style='width: 70%; float: right' class='form-control' id='action'></select>
                                                            <button onclick='update_action()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa waves-effect' value=''>
                                                            <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                            <span style="margin-right:5px">ثبت گام</span>
                                                        </button></div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));

    stageId = +$(`#${activePageId} #stageId`).val();
    workflowId = +$(`#${activePageId} #workFlowId`).val()

    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");

    requestId = +$(`#${activePageId} #formPlateHeaderTBody`).data("requestid");
    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    conditionalProperties.isTreasurySubject = +$(`#${activePageId} #formPlateHeaderTBody`).data("treasurysubjectid");
    conditionalProperties.isRequest = $(`#${activePageId} #formPlateHeaderTBody`).data("isrequest");
    conditionalProperties.isEqualToParentRequest = $(`#${activePageId} #formPlateHeaderTBody`).data("isequaltoparentrequest");
    conditionalProperties.parentworkflowcategoryid = +$(`#${activePageId} #formPlateHeaderTBody`).data("parentworkflowcategoryid");

    conditionalProperties.isBank = $(`#${activePageId} #formPlateHeaderTBody`).data("isbank");
    isDefaultActivateBtn = +$(`#${activePageId} #formPlateHeaderTBody`).data("isbank") == 1;
    glSGLModel.accountGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountglid");
    glSGLModel.accountGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountgl");
    glSGLModel.accountSGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountsglid");
    glSGLModel.accountSGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountsgl");
    glSGLModel.accountDetailRequired = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailrequired");
    glSGLModel.documentTypeId = +$(`#${activePageId} #formPlateHeaderTBody`).data("documenttypeid");
    glSGLModel.documentTypeName = $(`#${activePageId} #formPlateHeaderTBody`).data("documenttypename");
    glSGLModel.noSeriesId = $(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid");
    tempDocumentTypeId = glSGLModel.documentTypeId;
    glSGLModel.parentdocumentdatepersian = $(`#${activePageId} #formPlateHeaderTBody`).data("parentdocumentdatepersian");

    var accountDetailName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetail");
    var accountDetailId = 0;
    if (accountDetailName != undefined && accountDetailName != "" && accountDetailName != null)
        accountDetailId = +accountDetailName.split("-")[0];
    glSGLModel.accountDetailId = accountDetailId;

    additionalData = [
        { name: "treasuryId", value: id },
        { name: "stageId", value: stageId },
        { name: "accountDetailTreasuryId", value: accountDetailId },
        { name: "branchId", value: branchId },
        { name: "treasurySubjectId", value: conditionalProperties.isTreasurySubject },
        { name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() },
        { name: "parentId", value: requestId },
        { name: "parentWorkFlowCategoryId", value: conditionalProperties.parentworkflowcategoryid },
        { name: "noSeriesId", value: glSGLModel.noSeriesId },
        { name: "workflowId", value: workflowId },
    ];

    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;


    $(`#${activePageId} #bankId option[value='0']`).remove();

    $("#note").suggestBox({
        api: `/api/FM/JournalDescriptionApi/search`,
        paramterName: "name",
        suggestFilter: {
            items: [],
            filter: ""
        },
        form_KeyValue: [stageId]
    });

}

function excelTearsury() {
    let id = $('#formPlateHeaderTBody').data().id;
    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/csvline`;
    let csvModel = {
        FieldItem: "",
        FieldValue: "",
        Form_KeyValue: headerLine_formkeyvalue,
        pageno: null,
        pagerowscount: null
    }
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(csvModel),
        cache: false,
        success: function (result) {
            generateCsv(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function afterInsertLineHeaderLine() {

    configTreasuryElementPrivilage(`.ins-out`, false);

    $("#filter_fundType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}/6`);
}

function checkRequestDate() {

    let value = $("#headerTransactionDatePersian").val(),
        //shamsiTransactionDate = glSGLModel.parentdocumentdatepersian,
        transactionDate = moment.from(value, 'fa', 'YYYY/MM/DD'),
        reqDate = moment.from(shamsiTransactionDate, 'fa', 'YYYY/MM/DD');

    transactionDate = transactionDate.format('YYYY/MM/DD');
    reqDate = reqDate.format('YYYY/MM/DD');
    let dateIsValid = moment(reqDate).isSameOrBefore(transactionDate, 'day');

    if (!dateIsValid)
        return false;

    return true;
}

async function callBackLineFill() {

    $("#haederLineActive").removeClass("pulse");

    $(`#${activePageId} #currencyId option[value='0']`).remove();
    var row1 = $("#jsonTreasuryLineList #row1");
    if ($("#jsonTreasuryLineList #row1").length > 0) {
        trOnclick("jsonTreasuryLineList", row1, null);
    }
    else {

        configAfterChange();
        $("#bankId").val("0").trigger("change");
        $("#bankAccountId").val("0").trigger("change");
        refreshRequestLinesBtn();
        var dataEntryValue = $("#formPlateHeaderTBody").data("isdataentry");
        if (dataEntryValue == 2 && conditionalProperties.isBank) {
            $("#haederLineActive").addClass("pulse");
            $("#haederLineActive").attr("title", "جهت افزودن از درخواست ، ابتدا بانک و حساب بانکی را انتخاب نمایید");
        }
    }

    if (additionalData.filter(x => x.name === "treasurySubjectId").length == 0)
        additionalData.push({ name: "treasurySubjectId", value: +$("#formPlateHeaderTBody").data("treasurysubjectid") });
    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "branchId", value: +$("#formPlateHeaderTBody").data("branchid") });
    if (additionalData.filter(x => x.name === "branchId").length == 0)
        additionalData.push({ name: "isDefaultCurrency", value: +$("#isDefaultCurrency").val() });

    $(`#${activePageId} #finalAmount`).text("");
    $(`#${activePageId} #bankId option[value='0']`).remove();

    firstLineLoaded = true;

    $(`#${activePageId} #action`).empty();
    let stageClassIds = "3";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "action", true, `${stageId}/${workflowId}/1/0/${branchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);
    $(`#${activePageId} #action`).val(+$("#formPlateHeaderTBody").data("actionid")).trigger("change");

    //گرفتن اطلاعات بانک یکی از لاین های چک، در صورت وجود لاین چک
    if (conditionalProperties.isBank) {
        getTreasuryLineBankInfo();
    }

    $("#filter_fundType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}/6`);


}

function getTreasuryLineBankInfo() {

    $.ajax({
        url: viewData_getTreasuryCheckBankInfo,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            if (result != null) {
                $("#bankId").val(result.bankId).trigger("change");
                setTimeout(function () {
                    $("#bankAccountId").val(result.bankAccountId).trigger("change");
                }, 100);
                $("#bankId").prop("disabled", true);
                $("#bankId").data().disabled = true;
                $("#bankId").data().notreset = true;
                $("#bankAccountId").prop("disabled", true);
                $("#bankAccountId").data().disabled = true;
                $("#bankAccountId").data().notreset = true;
                if ($("#addRequestLines").attr("disabled") != undefined)
                    $("#addRequestLines").removeAttr(`disabled`);
                $("#addRequestLines").data(`disabled`, false);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getTreasuryCheckBankInfo);
        }
    });
}

function configPageTableByFundType(value) {

    if (headerLine_formkeyvalue[3] !== +$(`#${activePageId} #fundTypeId`).val()) {
        if (headerLine_formkeyvalue.length == 3)
            headerLine_formkeyvalue.push(+$(`#${activePageId} #fundTypeId`).val());
        else headerLine_formkeyvalue[3] = +$(`#${activePageId} #fundTypeId`).val();

        conditionalProperties.isAfterChange = true;
        lastFundType = arr_headerLinePagetables[3];
        InitFormLine();
    }
}

function after_insertLine() {
    $(`#${activePageId} #fundTypeId`).trigger("change");

    get_header()

}

function after_UpdateLine() {
    get_header();
}

async function update_action() {

    currentActionId = +$("#formPlateHeaderTBody").data("actionid");
    requestedActionId = +$("#action").val();

    if (currentActionId == requestedActionId)
        return;

    var model = {
        currentActionId: currentActionId,
        requestActionId: +$(`#${activePageId} #action`).val(),
        stageId: stageId,
        workflowId: +$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"),
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        requestId: +$(`#${activePageId} #formPlateHeaderTBody`).data("requestid"),
        workflowcategoryid: workflowCategoryIds.treasury.id,
        parentWorkflowCategoryId: conditionalProperties.parentworkflowcategoryid
    }

    loadingAsync(true, "stepRegistration", "");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);

        if (stepPermissionid > 0) {
            let resultValidate = null;

            if (model.requestActionId != model.currentActionId) {
                resultValidate = validateBeforSendTreasury(model);
                if (checkResponse(resultValidate)) {
                    if (resultValidate.length == 0) {

                        var currentStageAction = getStageAction(model.workflowId, model.stageId, model.currentActionId, 0);

                        var requestStageAction = getStageAction(model.workflowId, model.stageId, model.requestActionId, 0);


                        updateactionTreasury(model, currentStageAction, requestStageAction);
                    }
                    else {
                        loadingAsync(false, "stepRegistration", "");
                        alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                        $("#action").val(currentActionId);
                    }

                }
                else
                    loadingAsync(false, "stepRegistration", "");
            }
            else {
                var msgItem = alertify.warning("لطفا گام را مشخص کنید");
                msgItem.delay(alertify_delay);
                loadingAsync(false, "stepRegistration", "");
            }


        }
        else {

            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $(`#${activePageId} #action`).val(model.currentActionId);
            loadingAsync(false, "stepRegistration", "");
        }
    }, 10)



}

function updateactionTreasury(model, currentStageAction, requestStageAction) {
    
    //#region افزایش گام 
    if (currentStageAction.priority < requestStageAction.priority) {
        //#region گام3 به گام 4   

        var multipleSettlement = true;
        var currentRequest = null;

        if (model.parentWorkflowCategoryId != 0) {
            if (model.requestId > 0) {
                currentRequest = getTreasuryRequestInfo(model.requestId, model.parentWorkflowCategoryId);
                multipleSettlement = getMultipleSettlement(currentRequest.workflowId, currentRequest.stageId);
            }
           
        }


        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);
                if (result.data.successfull) {
                    sendDocument(model, () => {
                        updateStatus(model);
                    });
                }
                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $("#action").val(currentActionId);
                }
            }
            else {
                sendDocument(model, () => {
                    updateStatus(model);
                });
            }

        }

        //#endregion

        //#region گام2 به گام 3   

        else if (!currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {


            if (!multipleSettlement) {
                var result = checkHeaderBalance(model);

                if (result.data.successfull)
                    updateStatus(model,
                        () => {
                            $("#action").val(currentActionId)
                        });

                else {
                    alertify.error(result.data.statusMessage).delay(alertify_delay);
                    $("#action").val(currentActionId);
                }
            }
            else {
                updateStatus(model,
                    () => {
                        $("#action").val(currentActionId)
                    });
            }


        }

        //#endregion

    }

    //#region  کاهش گام
    else {
        // گام4 به گام 3 
        if (currentStageAction.isLastConfirmHeader && requestStageAction.isLastConfirmHeader) {

            sendDocument(model, () => {
                updateStatus(model,
                    () => {
                        $("#action").val(currentActionId).trigger("change")
                    });
            });
        }
        // گام3 به گام 2 
        else if (currentStageAction.isLastConfirmHeader && !requestStageAction.isLastConfirmHeader)
            updateStatus(model,
                () => {
                    $("#action").val(currentActionId).trigger("change")
                });
    }
    //#endregion

    loadingAsync(false, "stepRegistration", "");
}

function checkHeaderBalance(model) {

    var p_url = `/api/WFApi/checkheaderbalance`;

    var modelnew = {
        objectIds: model.requestId,
        workflowCategoryIdCurrentStage: +workflowCategoryIds.treasury.id,
        workflowCategoryIdParentStage: +conditionalProperties.parentworkflowcategoryid > 0 ? +conditionalProperties.parentworkflowcategoryid : workflowCategoryIds.treasury.id,
        amountOrQuantity: true
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

function sendDocument(model, callBack) {

    let requestedStageStep = checkIsSendActionId(model.workflowId, model.stageId, model.requestActionId), viewModelSend = {};

    let newmodel = {
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: +stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            viewModelSend = {
                model: [{ id: +$(`#${activePageId} #formPlateHeaderTBody`).data("id") }],
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`
            };

            sendDocPostingGroup(viewModelSend, () => {
                $(`#treasuryLinePage #action`).val($(`#treasuryLinePage #formPlateHeaderTBody`).data("actionid"))
            }, callBack);
        }
        else
            updateStatus(model);
    }
    else {
        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length !== 0) {
            viewModelSend = [{
                identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
                stageId: stageId
            }];
            undoDocPostingGroup(viewModelSend, () => { $(`#treasuryLinePage #action`).val($(`#treasuryLinePage #formPlateHeaderTBody`).data("actionid")) }, callBack);
        }
        else
            updateStatus(model);
    }

}

function checkIsSendActionId(workflow, stageId, requestActionId) {
    let model = {
        stageId: stageId,
        actionId: requestActionId,
        workflowId: workflow
    }
    var result = $.ajax({
        url: viewData_has_SendActionId,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_has_postGroup);
            return false;
        }
    });

    return result.responseJSON;
}

function updateStatus(model) {
    if (model.requestActionId > 0) {
        $.ajax({
            url: viewData_updateTreasuryStep_url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                afterUpdateStatus(result);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateTreasuryStep_url);
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

function afterUpdateStatus(result) {

    if (result.successfull) {
        $(`#${activePageId} #action`).val(requestedActionId);
        alertify.success(result.statusMessage);
        get_header();

        //گرفتن اطلاعات بانک یکی از لاین های چک، در صورت وجود لاین چک
        if (conditionalProperties.isBank) {
            getTreasuryLineBankInfo();
        }

    }
    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }
    exitreasuryline = chekExistTreasuryline(id);

    configTreasuryElementPrivilage(`.ins-out`, false);
}

function showStepLogs() {
    stepLog();
    modal_show(`${activePageId} #stepLogModal`);
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistTreasuryId(+elm.val());
        if (checkExist)
            navigation_item_click(`/FM/NewTreasuryLine/${+elm.val()}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function click_link_header(elm) {

    if ($(elm).data().id == "requestNo")
        switch (conditionalProperties.parentworkflowcategoryid) {
            case 6:
                navigation_item_click(`/FM/TreasuryRequestLine/${+$(elm).text()}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
                break;
            case 1:
                navigation_item_click(`/PU/PurchaseOrderLine/${+$(elm).text()}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
                break;
        }

    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
}

function navigateToModalJournal(href) {

    initialPage();
    $("#contentdisplayJournalLine #content-page").addClass("displaynone");
    $("#contentdisplayJournalLine #loader").removeClass("displaynone");
    lastpagetable_formkeyvalue = pagetable_formkeyvalue;
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayJournalLine`).html(result);
            modal_show("displayJournalLineModel");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayJournalLine #loader").addClass("displaynone");
    $("#contentdisplayJournalLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayJournalLine #form,#contentdisplayJournalLine .content").css("margin", 0);
    $("#contentdisplayJournalLine .itemLink").css("pointer-events", " none");
}

function checkExistTreasuryId(id) {

    let model = {
        id: id,
        bySystem: 0
    }

    let outPut = $.ajax({
        url: viewData_getTreasuryCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getTreasuryCheckExist);
        }
    });
    return outPut.responseJSON;

}

function chekExistTreasuryline(id) {

    var result = $.ajax({
        url: `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryLineCount`,
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

function add_requestLines() {

    var workflowCategoryId = conditionalProperties.parentworkflowcategoryid;

    var treasuryActionStep = getParentRequestStageStep(requestId, workflowCategoryId);

    updatedRequestId = requestId;
    workflowId = (checkResponse(treasuryActionStep) && treasuryActionStep != null) ? treasuryActionStep.workflowId : workflowId;

    var fundTypeParam = "";
    if (updatedRequestId > 0) {
        fundTypeParam = `${+id}/${workflowId}/${updatedRequestId}/1`;
        if (!treasuryActionStep.isLastConfirmHeader) {
            alertify.warning(`درخواست ${updatedRequestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
            return;
        }

    }
    else
        fundTypeParam = `${+id}/${workflowId}/${updatedRequestId}/2`;

    fill_select2(viewData_requestFundTypes_url, "previousStagePageTable #form_keyvalue", true, fundTypeParam, false, 3, 'انتخاب', undefined, "", true);
    if (+$("#previousStagePageTable #form_keyvalue option:first").val() != 0) {
        $("#previousStagePageTable #form_keyvalue").val($("#previousStagePageTable #form_keyvalue option:first").val()).trigger("change");
    }
    else {
        var msgItem = alertify.warning("مبانی وجوه برگه مرجع و جاری همخوانی ندارد، به مدیر سیستم اطلاع دهید");
        msgItem.delay(alertify_delay);
    }


    configTreasuryElementPrivilage(".ins-out", false);
}

$("#previousStageTreasuryLines").on("shown.bs.modal", function () {
    $("#previousStagePageTable table tbody tr").first().focus();
})

$("#previousStageTreasuryLineDetails").on("hidden.bs.modal", function () {
    $(`#previousStagePageTable table tbody tr.highlight`).focus();
})

$("#previousStagePageTable #form_keyvalue").change(function () {
    get_requestStageLines();

})

function get_requestStageLines() {


    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    arr_pagetables[index].selectedItems = [];

    arr_pagetables[index] = previousStagePage = {
        pagetable_id: "previousStagePageTable",
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        pageNo: 0,
        editable: false,
        endData: false,
        //lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        lastPageloaded: 0,
        getpagetable_url: viewData_requestTreasuryLines_url,
        getfilter_url: viewData_requestTreasuryLines_filter_url,
    };

    var fundTypeId = +$("#previousStagePageTable #form_keyvalue").val();
    var lineFieldValues = {
        "fundTypeId": fundTypeId
    };

    var listType = updatedRequestId == 0 ? 2 : 1;
    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(updatedRequestId);
    pagetable_formkeyvalue.push(fundTypeId);
    pagetable_formkeyvalue.push(+$("#isDefaultCurrency").val());
    pagetable_formkeyvalue.push(stageId);
    pagetable_formkeyvalue.push(listType);
    pagetable_formkeyvalue.push(branchId);
    pagetable_formkeyvalue.push(id);
    pagetable_formkeyvalue.push(workflowId);

    $(`#previousStagePageTable .btnRemoveFilter`).addClass("d-none");
    $(`#previousStagePageTable .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritemNew('filter-non', 'مورد فیلتر', '0', '0', "previousStagePageTable");

    //get_NewPageTable("previousStagePageTable", false, () => {
    //    modal_show(`previousStageTreasuryLines`)
    //});

}

function callbackAfterFilter(pgName) {
    modal_show(`previousStageTreasuryLines`)
}

function fill_NewPageTable(result, pageId = null, callBack = undefined) {

    if (pageId == null) pageId = "pagetable";
    if (!result) return "";

    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    var columns = result.columns.dataColumns,
        buttons = result.columns.buttons,
        list = result.data,
        columnsL = columns.length,
        listLength = checkResponse(list.requests) ? list.requests.length : 0,
        arrayMonys = [],
        resultClass = "",
        fundTypeId = 0,
        buttonsL = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_selectedItems = arr_pagetables[index].selectedItems;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_pageNo = arr_pagetables[index].pageNo;
    var pagetable_endData = arr_pagetables[index].endData
    var pagetable_pagerowscount = arr_pagetables[index].pagerowscount


    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    if (!pagetable_endData) {
        arr_pagetables[index].endData = listLength < pagetable_pagerowscount;

        var pagetable_highlightrowid = arr_pagetables[index].highlightrowid;

        pagetable_hasfilter(pageId, result.columns.hasFilter);

        var elm_pbody = $(`#${pageId} .pagetablebody`);
        var btn_tbidx = 1000;
        var str = "";

        if (pagetable_currentpage == 1) {

            elm_pbody.html("");
            str += '<thead>';
            str += '<tr>';
            if (pagetable_editable == true)
                str += '<th style="width:2%"></th>';
            if (pagetable_selectable == true)

                str += `<th style="width:2%;text-align:center !important"><input class="selectedItem-checkbox-all" onchange="changeAll(this,'${pageId}')" ${typeof pagetable_selectedItems == "undefined" ?
                    "" : list.length !== 0 && pagetable_selectedItems.length == list.length ? "checked" : ""} class="checkall" type = "checkbox" ></th >`;

            for (var i = 0; i < columnsL; i++) {
                var col = columns[i];
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '"';
                    if (col.id != "action") {
                        if (result.columns.order)
                            str += `class="headerSorting" id="header_${i}" data-type="" data-col="${col.id}" data-index="${i}" onclick="sortingButtonsByTh(${result.columns.order},this)"><span id="sortIconGroup" class="sortIcon-group">
                <i id="desc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                <i id="asc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
            </span>` + col.title + '</th>';
                        else
                            str += '>' + col.title + '</th>';
                    }
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
        }

        var rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (list.length == 0) {
            str += fillEmptyRow(columns.length);
        }
        else
            for (var i = 0; i < listLength; i++) {
                var item = list.requests[i];
                columns = result.data.columns.filter(a => a.identityId == item["fundTypeId"])[0].dataColumns;
                columnsL = columns == null ? 0 : columns.length;
                buttons = result.data.columns.filter(a => a.identityId == item["fundTypeId"])[0].buttons;

                buttonsL = buttons == null ? 0 : buttons.length;
                var rowno = rowLength + i + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j = 0; j < columnsL; j++) {
                    var primaries = "";
                    for (var k = 0; k < columnsL; k++) {
                        var v = columns[k];
                        if (v["isPrimary"] === true)
                            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                    }

                    colwidth = columns[j].width;
                    if (j == 0) {
                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1">';
                            }
                        }
                        if (pagetable_editable == true)
                            str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                        if (pagetable_selectable == true) {
                            str += `<td id="col_${rowno}_1" class="selectedItem-checkbox" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

                            var validCount = 0;
                            var primaryCount = 0;
                            var isCol = false;

                            var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
                            var selectedItems = arr_pagetables[index].selectedItems;
                            $.each(selectedItems, function (k, v) {
                                $.each(v, function (key, val) {
                                    var column = columns.filter(a => a.id.toLowerCase() == key)[0];
                                    primaryCount += 1;
                                    if (item[column.id] == val)
                                        validCount += 1;
                                })
                                if (validCount == primaryCount)
                                    isCol = true;
                                primaryCount = 0;
                                validCount = 0;
                            })
                            if (isCol) {
                                str += 'checked />';
                            }
                            else {
                                str += '/>';
                            }
                            str += '</td >';

                        }
                    }
                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;


                            var value = item[columns[j].id];
                            if (columns[j].editable) {

                                fundTypeId = +$("#previousStagePageTable #form_keyvalue").val();
                                var dataDisabled = columns[j].isReadOnly ? `data-disabled="true"` : "";
                                resultClass = columns[j].isReadOnly ? "enable-requst-field" : "";
                                str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}"  class="${resultClass}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {
                                    str += `<select id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${dataDisabled} disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;
                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "dynamicSelect") {

                                    str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;
                                    var inputsName = `${columns[j].id}Inputs`;
                                    var lenInput = item[inputsName] != null ? item[inputsName].length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = item[inputsName][h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                                }
                                else if (columns[j].inputType == "searchPlugin") {
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number searchPlugin" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                }
                                else if (columns[j].inputType == "select2") {

                                    var onchange = `tr_object_onchange('${pageId}',this,${rowno},${colno})`;
                                    var nameVlue = "";
                                    if (columns[j].id.indexOf("Id") != -1) {
                                        var val = item[columns[j].id.replace("Id", "") + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }
                                    else {
                                        var val = item[columns[j].id + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }

                                    str += `<div>${nameVlue}</div>`
                                    str += `<div class="displaynone"><select data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select></div>";
                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${+value != 0 && !isNaN(+value) ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${+value != 0 && !isNaN(+value) ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${+value != 0 && !isNaN(+value) ? value.toString() : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "strnumber")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" class="form-control str-number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
                                    if (value != null && value != "") {
                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5) {
                                            value = value.toString();
                                        }
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else {
                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                    else
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {
                            colno += 1;
                            if (result.columns.actionType === "dropdown") {
                                str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                    }
                                    else
                                        str += `<div class="button-seprator-hor"></div>`;
                                }

                                str += `</div>
                                </div>`;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button type="button" ${btn.isFocusInline == true ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                    }
                                    else
                                        str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                    }
                }
                str += '</tr>';
            }
        str += '</tbody>';

        elm_pbody.append(str);

        if ($("#previousStageTreasuryLines .pagetablebody tbody input:not([type=checkbox])").length > 0)
            $("#previousStageTreasuryLines .pagetablebody tbody input:not([type=checkbox])").inputmask();

        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack);

    }

}

function afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack) {


    searchPluginConfig(pageId, columns);

    let pagetable_currentrow = arr_pagetables[index].currentrow;

    if ($(`#${pageId} .pagetablebody tbody #emptyRow`).length == 0)
        $(`#${pageId} .pagetablebody tbody > #row${pagetable_currentrow}`).focus().addClass("highlight");
    else
        $(`#${pageId} .pagetablebody tbody #emptyRow`).prop("tabindex", -1).focus()


    let dataDatePicker = $(`#${pageId} .persian-datepicker`), dataDatePickerL = $(`#${pageId} .persian-datepicker`).length;
    for (var i = 0; i < dataDatePickerL; i++)
        kamaDatepicker(`${$(dataDatePicker[i]).attr('id')}`, { withTime: false, position: "bottom" });

    $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    if (typeof $(`#header_${dataOrder.index}`).data() != "undefined")
        $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;

    arr_pagetables[index].lastPageloaded = pagetable_pageNo;

}

function config_lineDetailColumn(columns, pageId) {

    var colno = 0;
    var btn_tbidx = 2001;
    var firstElemFocus = false;
    for (var i in columns) {
        var column = columns[i];
        var newElemId = column.id;
        var divContainer = "previousStageTreasuryLineDetails";
        var oldColumnContainer = $(`#${divContainer} #${newElemId}`).parents(".form-group").first();
        var validators = "";
        if (column.validations != null) {
            var validations = column.validations;
            for (var v = 0; v < validations.length; v++) {
                if (validations[v].value1 == null && validations[v].value2 == null) {
                    validators += " " + validations[v].validationName;
                }
                else if (validations[v].validationName.indexOf("range") >= 0) {
                    validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                }
                else if (validations[v].value1 != undefined) {
                    validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                }
                else {
                    validators += ` ${validations[v].validationName} `;
                }
            }
        }
        var colwidth = column.width;
        colno += 1;
        var value = "";
        var itemheader = "";
        if (oldColumnContainer.length > 0)
            itemheader = `<label>${column.title}</label>`;
        else
            itemheader = `<div class="form-group col-sm-${column.width}"><label>${column.title}</label><div>`

        if (column.inputType == "select2") {
            itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} class="form-control" id="${column.id}" 
                                            ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''}
                                            tabindex="${btn_tbidx}" onchange="tr_detailObject_onchange('${pageId}',this)" onblur="object_onblur(this)" onfocus="tr_object_onfocus(this)">`;

            if (column.childApiUrl != undefined) {
                itemheader += ` data-childurl="${column.childApiUrl}" `;
            }
            if (column.childID != undefined) {
                itemheader += ` data-childid="${column.childID}" `;
            }

            if (column.pleaseChoose)
                itemheader += `<option value="0">انتخاب کنید</option>`;

            var lenInput = column.inputs == null ? 0 : column.inputs.length;

            for (var h = 0; h < lenInput; h++) {
                var input = column.inputs[h];
                itemheader += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
            }
            itemheader += "</select></div>";

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader);
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }


            if (column.isSelect2 === true) {
                if (column.editable && !firstElemFocus) {

                    $(`#${divContainer} #${column.id}`).val(0);
                    firstElemFocus = true;
                }
                else {
                    $(`#${divContainer} #${column.id}`).val(0);
                }

                $(`#${divContainer} #${column.id}`).select2();
            }
            else
                $(`#${divContainer} #${column.id}`).val(0);
            btn_tbidx++;

        }
        else if (column.inputType == "datepersian") {


            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }
            else
                itemheader += "</div>";

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }

            $(`#${divContainer} #${column.id}`).inputmask();
            if (column.editable /*&& !firstElemFocus*/) {

                $(`#${divContainer} #${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else if (column.inputType == "datepicker") {
            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" tabindex="${btn_tbidx}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} class="form-control persian-datepicker" data-inputmask="${column.inputMask.mask}" onkeydown="tr_object_onkeydown(event,this)" onchange="tr_detailObject_onchange('${pageId}',this)" placeholder="____/__/__" maxlength="10" autocomplete="off"/></div>`;

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }


            $(`#${column.id}`).inputmask();
            if (column.editable /*&& !firstElemFocus*/) {

                $(`#${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else if (column.inputType == "checkbox") {
            itemheader += `<div tabindex="${btn_tbidx}" class="funkyradio funkyradio-success" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${columns[j].notResetInHeader == true ? ' data-notReset="true"' : ''}  onchange="tr_detailObject_onchange('${pageId}',this)"  onkeydown="tr_object_onkeydown(event,this)" tabindex="-1">`;



            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="checkbox" id="${column.id}" name="checkbox" id="btn_${rowno}_${colno}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} />
                                <label for="btn_${column.id}"></label>
                                </div></div>`;

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }

            if (column.editable && !firstElemFocus) {
                $(`#${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else if (column.inputType == "number") {
            if (column.isRangeValue == true) {
                var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${column.minValue} - ${column.maxValue} </div></div>`;

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${columns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="tr_detailObject_onchange('${pageId}',this)" onblur="priceRangeBlur(this,'${pageId})'" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;
                itemheader += priceRangeControl;
            }
            else {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control number" onchange="tr_detailObject_onchange('${pageId}',this)" onblur="tr_object_onblur(this,event)"  onfocus="tr_object_onfocus(this)" onkeydown="tr_object_onkeydown(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;
            }

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }

            if (column.editable && !firstElemFocus) {
                $(`#${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else if (column.inputType == "money") {

            showFocusRangeControl
            if (column.isRangeValue == true) {
                var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${column.minValue} - ${column.maxValue} </div></div>`;

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="tr_detailObject_onchange('${pageId}',this)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;
                itemheader += priceRangeControl;
            }
            else {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="tr_detailObject_onchange('${pageId}',this)"  onkeydown="tr_object_onkeydown(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;
            }

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }

            if (column.editable && !firstElemFocus) {
                $(`#${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else if (column.inputType == "decimal") {

            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control decimal" onchange="tr_detailObject_onchange('${pageId}',this)"  onkeydown="tr_object_onkeydown(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }

            if (column.editable && !firstElemFocus) {
                $(`#${column.id}`).focus();
                firstElemFocus = true;
            }
            btn_tbidx++;
        }
        else {

            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + column.id + "ErrorContainer'" : ""} type="text" id="${column.id}" ${column.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${column.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control" onchange="tr_detailObject_onchange('${pageId}',this)"  onkeydown="tr_object_onkeydown(event,this)" ${column.maxLength != 0 ? 'maxlength="' + column.maxLength + '"' : ''} autocomplete="off"/></div>`;

            if (validators != "") {
                itemheader += `<div id="${column.id}ErrorContainer"></div></div>`;
            }

            if (oldColumnContainer.length > 0) {
                oldColumnContainer.html("");
                oldColumnContainer.append(itemheader)
                oldColumnContainer.removeClass("displaynone");
            }
            else {
                $(`#${pageId} .ins-out .row`).append(itemheader);
            }


            btn_tbidx++;
        }
    }
    $("#previousStageTreasuryLineDetails #modal-save").attr("tabindex", btn_tbidx);

    var itemContainers = $(`#${pageId} .ins-out .row .form-group`);
    for (var i = 0; i < itemContainers.length; i++) {
        //delete column
        var elemId = $($(itemContainers[i]).find("select,input")[0]).attr("id");
        if (columns.filter(a => a.id == elemId).length == 0) {
            $(`#${divContainer} #${elemId}`).parents(".form-group").first().addClass("displaynone");
            $(`#${divContainer} #${elemId}`).parents(".form-group").first().find(".select2-container").remove();
            $(`#${divContainer} #${elemId}`).parents(".form-group").first().append(`<input id = "${elemId}_1"/>`);
            $(`#${divContainer} #${elemId}`).remove();
            $(`#${divContainer} #${elemId}_1`).attr("id", elemId);

        }
    }
}

function tr_detailObject_onchange(pageId, elem) {
    var divContainer = "previousStageTreasuryLineDetails";

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = arr_pagetables[index].columns;
    var column = null;
    var colId = "";
    var elemId = $(elem).attr("id");
    if (elemId != undefined) {
        colId = $(elem).attr("id").split("_")[0];;
        column = columns.filter(a => a.id == colId)[0];
    }
    //#region select2 config
    if (column != undefined && column != null && column.isSelect2) {
        if ($(elem).val() != null && $(elem).val() != undefined && $(elem).val() != "")
            $(elem).data("value", $(elem).val());

        if (column.fillColumnInputSelectIds != null) {
            var fillColumnInputSelectIds = column.fillColumnInputSelectIds;
            for (var i = 0; i < fillColumnInputSelectIds.length; i++) {
                var changeItemCol = columns.filter(a => a.id == fillColumnInputSelectIds[i])[0];

                var getInputSelectConfig = changeItemCol.getInputSelectConfig;
                if (changeItemCol.isSelect2 && getInputSelectConfig != null) {
                    var elemId = changeItemCol.id;
                    var params = "";
                    var parameterItems = getInputSelectConfig.parameters;
                    if (parameterItems.length > 0) {
                        for (var i = 0; i < parameterItems.length; i++) {
                            var paramItem = parameterItems[i].id;
                            if (parameterItems[i].inlineType)
                                params += $(`#${divContainer} #${paramItem}_${rowno}`).val();
                            else
                                params += $(`#${divContainer} #${paramItem}`).val();

                            if (i < parameterItems.length - 1)
                                params += "/";
                        }
                    }

                    $(`#${divContainer} #${elemId}`).empty();

                    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                        fill_select2(getInputSelectConfig.fillUrl, `${divContainer} #${elemId}`, true, params, false, 0, '', function () {
                            $(`#${elemId}`).trigger("change");
                        });
                    }
                }
            }
        }
    }
    //#endregion

}

function request_fillInputSelectItems(newHeaderColumns, rowno = 0, callback = undefined) {
    var divContainer = "previousStageTreasuryLineDetails";
    for (var i in newHeaderColumns) {
        var column = newHeaderColumns[i];
        var getInputSelectConfig = column.getInputSelectConfig;
        if (getInputSelectConfig != null && column.isSelect2) {
            var elemId = column.id;
            var params = "";
            var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;
            if (parameterItems.length > 0) {
                for (var i = 0; i < parameterItems.length; i++) {
                    var paramItem = parameterItems[i].id;
                    if (parameterItems[i].inlineType && rowno > 0)
                        params += $(`#${paramItem}_${rowno}`).val();
                    else
                        params += $(`#${divContainer} #${paramItem}`).val();

                    if (i < parameterItems.length - 1)
                        params += "/";
                }
            }
            $(`#${divContainer} #${elemId}`).empty();
            if (getInputSelectConfig.fillUrl != "" && ((params.split("/").filter(a => a == "0" || a == "null").length == 0) || params == "")) {
                fill_select2(getInputSelectConfig.fillUrl, `${divContainer} #${elemId}`, true, params, false, 0, '', function () {
                    //$(`#${elemId}`).trigger("change");
                });
            }
        }
    }

    if (typeof callback != "undefined")
        callback();
}

call_initFormTreasuryLine();

call_initform = call_initFormTreasuryLine;

function chekExistTreasury(treasuryid) {

    var result = $.ajax({
        url: `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryLineCount`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(treasuryid),
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

function close_modal_stepLogs() {
    modal_close("stepLogModal");
}

function stepLog() {

    $("#stepLogRowsTreasury").html("");

    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    stageId = +$(`#${activePageId} #formPlateHeaderTBody`).data("stageid");
    workflowId = +$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid");

    var url = `${viewData_treasuryStepList_url}/${id}/${stageId}/${workflowId}`;

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
                $("#stepLogRowsTreasury").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function close_modal_previousStageRequests() {
    modal_close("previousStageTreasuryLines");
}

$("#insertPreviousStageLine").click(async function () {


    var treasuryAction = await getTreasuryStageActionConfig(id);
    if (treasuryAction.requestId > 0 && !treasuryAction.requestIsLastConfirmHeader) {
        alertify.warning(`درخواست ${treasuryAction.requestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
        await loadingAsync(false, $(this).prop("id"))
        return;
    }

    loadingAsync(true, $(this).prop("id"));
    await run_button_insert_PreviousStageLines();
})

$("#previousStageTreasuryLineDetails #modal-save").on("keydown", function () {
})

function tr_save_row(pagetable_id, keycode) {
    after_save_row(pagetable_id, "success", keycode, false);
}

async function run_button_insert_PreviousStageLineDetails(id = 0, rowNo = 0, elem = null) {
    selectedLineDetailId = id;
    var data = requestLinesData.filter(a => a.id == id)[0];
    var modalId = "#previousStageTreasuryLineDetails";
    $(`${modalId} #bondBranchNo`).val(data.bondBranchNo);
    $(`${modalId} #bondBranchName`).val(data.bondBranchName);
    $(`${modalId} #bondSerialNo`).val(data.bondSerialNo);
    $(`${modalId} #bondIssuer`).val(data.bondIssuer);
    $(`${modalId} #bankIssuerId`).val(data.bankIssuerId).trigger("change");
    $(`${modalId} #bankAccountIssuer`).val(data.bankAccountIssuer);
    modal_show(modalId);
}

$("#previousStageTreasuryLineDetails").on("shown.bs.modal", function () {
    $("#previousStageTreasuryLineDetails #detailBondBranchNo").focus();
})

$("#previousStageTreasuryLines")
    .on("shown.bs.modal", function () {
        if (conditionalProperties.isBank)
            $("#bankAccountId,#bankId").prop("disabled", true);
    })
    .on("hidden.bs.modal", function () {

        emptyRowColSpan = $("#previousStagePageTable .pagetablebody thead tr th").length;
        $("#previousStagePageTable .pagetablebody tbody").html(`<tr id="emptyRow" colspan="${emptyRowColSpan}" tabindex="-1"><td style="text-align:center">سطری وجود ندارد</td></tr>`)
        if (conditionalProperties.isBank && $("#jsonTreasuryLineList #row1").length == 0)
            if ($("#haederLineActive").prop("disabled"))
                $("#bankAccountId,#bankId").prop("disabled", false);

    })

function close_modal_previousStageLineDetails() {
    modal_close("previousStageTreasuryLineDetails");

}

function save_previousStageLineDetail() {
    var modalId = "#previousStageTreasuryLineDetails";
    form = $(`${modalId}`).find(".modal-body").parsley();
    validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var data = requestLinesData.filter(a => a.id == selectedLineDetailId)[0];
    data.detailBondBranchNo = $(`${modalId} #detailBondBranchNo`).val();
    data.detailBondBranchName = $(`${modalId} #detailBondBranchName`).val();
    data.detailBondSerialNo = $(`${modalId} #detailBondSerialNo`).val();
    data.detailBondIssuer = $(`${modalId} #detailBondIssuer`).val();
    data.detailBankIssuerId = $(`${modalId} #detailBankIssuerId`).val();
    data.detailBankAccountIssuer = $(`${modalId} #detailBankAccountIssuer`).val();
    modal_close(modalId);
    tr_save_row("previousStagePageTable");
}

function validate_lineTable() {
    $(`#previousStagePageTable .pagetablebody > tbody > tr`).removeClass("row-danger");
    var errorCount = 0;
    var fundTypeId = +$("#previousStagePageTable #form_keyvalue").val();
    var rowElems = $(`#previousStagePageTable .pagetablebody > tbody > tr `);

    for (var j = 0; j < rowElems.length; j++) {
        var id = +$(rowElems[j]).data("id");
        if ($(rowElems[j]).find("input[type='checkbox']").first().prop("checked")) {

            var elems = $(rowElems[j]).first().find("td:not(:eq(1))").find("input,select");
            var item = `{ "id": "${id}","headerId":"${+$("#formPlateHeaderTBody").data("id")}","stageId":"${$("#stageId").val()}","fundTypeId":"${$("#previousStagePageTable #form_keyvalue").val()}",`;
            for (var i = 0; i < elems.length; i++) {
                var val = set_columnFormat($(elems[i]));
                item += `"${$(elems[i]).attr("id").split("_")[0]}": "${val}",`;
            }
            item += "}";
            item = item.replace(",}", "}");

            item = JSON.parse(item);

            var itemError = false, itemValidError = false;
            var resultMessage = "", resultValidMessage = "";
            if (+item.inOut == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "نوع گردش";

            }
            if (+item.documentNo == 0) {
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "شماره سند";
            }

            if (+item.currencyId == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "نوع ارز";
            }

            if (+item.exchangeRate == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "نرخ تسعیر";
            }

            if (+item.amountExchange == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "مبلغ";
            }

            if (+item.amount == 0) {
                itemError = true;
                if (resultMessage != "")
                    resultMessage += " - ";
                resultMessage += "مبلغ دریافتی";
            }

            if (fundTypeId == 3) {
                if (+item.bankId == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "بانک";
                }

                if (+item.bondBranchNo == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "شماره شعبه چک";
                }
                if (+item.bondBranchName == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "نام شعبه چک";
                }
                if (+item.bondSerialNo == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "شماره سریال چک";
                }
                if (+item.bondIssuer == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "نام صادرکننده چک";
                }
            }
            if (fundTypeId == 6 || fundTypeId == 7 || fundTypeId == 8) {

                if (+item.bankAccountId == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "شماره حساب";
                }
                if (+item.bondSerialNo == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "شماره سریال چک";
                }
                if (+item.sayadNumber == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "شماره صیاد";
                }
                if (+item.bondDueDatePersian == 0) {
                    itemError = true;
                    if (resultMessage != "")
                        resultMessage += " - ";
                    resultMessage += "تاریخ سررسید چک";
                }

                if (checkResponse(item.bondDueDatePersian) && +item.bondDueDatePersian !== 0)
                    if (!isValidShamsiDate(item.bondDueDatePersian)) {
                        itemValidError = itemError = true;
                        if (resultValidMessage != "")
                            resultValidMessage += " - ";
                        resultValidMessage += "تاریخ سررسید چک";
                    }

            }

            if (itemError) {
                errorCount += 1;

                if (resultMessage !== "")
                    resultMessage += " را وارد نمایید";


                if (itemValidError) {
                    resultValidMessage += " معتبر نیست";
                    resultMessage = resultMessage + " | " + resultValidMessage;
                }

                $(rowElems[j]).attr("title", resultMessage);
                $(rowElems[j]).addClass("row-danger");
            }
            else {
                $(rowElems[j]).attr("title", "");
                $(rowElems[j]).removeClass("row-danger");
            }

        }
    }

    return errorCount;
}

function set_columnFormat(elm) {
    var val = undefined;
    if (elm.hasClass("money"))
        val = +removeSep(elm.val()) !== 0 && !isNaN(+removeSep(elm.val())) ? +removeSep(elm.val()) : 0;
    else if (elm.hasClass("decimal"))
        val = +removeSep(elm.val()) !== 0 && !isNaN(+removeSep(elm.val())) ? removeSep(elm.val().replace(/\//g, ".")) : 0;
    else if (elm.hasClass("number"))
        val = +removeSep(elm.val()) != 0 && !isNaN(+removeSep(elm.val())) ? +elm.val() : 0;
    else if (elm.hasClass("str-number"))
        val = +removeSep(elm.val()) !== 0 && !isNaN(+removeSep(elm.val())) ? elm.val() : "";
    else if (elm.attr("type") == "checkbox")
        val = elm.prop("checked");
    else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
        val = elm.data("value");
    else
        if (val !== null)
            val = myTrim(elm.val());

    return val;
}

async function run_button_insert_PreviousStageLines(id = 0, rowNo = 0, elem = null) {

    var data = [];
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    var selectedItems = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        if ($(`#previousStagePageTable .pagetablebody > tbody > tr .editrow`).length == 0) {
            if (validate_lineTable() == 0) {
                selectedItems.forEach(function (value) {


                    var rowNo = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).attr("id").replace("row", ""),
                        rowElems = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().find("td:not(:eq(1))").find("input,select"),
                        fundTypeId = +$(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("fundtypeid"),
                        inOut = +$(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("inout").split("-")[0],
                        bankAccountId = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("bankaccountid"),
                        bankId = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("bankid"),
                        amount = +removeSep($(`#balanceAmount_${rowNo}`).val()) > 0 ? +removeSep($(`#balanceAmount_${rowNo}`).val()) : +value.amount,
                        //balanceAmount = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("amount"),
                        balanceAmount = +removeSep($(`#amount_${rowNo}`).val())
                    isDefaultCurrency = +$(`#${activePageId} #isDefaultCurrency`).val(),

                        item = `
                                    { "id": ${value.id},
                                      "headerId":${+$("#formPlateHeaderTBody").data("id")},
                                      "parentId":${+$("#formPlateHeaderTBody").data("requestid")},
                                      "stageId":${+$("#formPlateHeaderTBody").data("stageid")},
                                      "bankAccountId":${typeof bankAccountId === 'undefined' ? null : +bankAccountId},
                                      "bankId":${typeof bankId === 'undefined' ? null : +bankId},
                                      "fundTypeId":${fundTypeId},
                                      "workflowId":${+workflowId},
                                      "parentWorkflowCategoryId":${+$("#formPlateHeaderTBody").data("parentworkflowcategoryid")},
                                      "inOut":${inOut},                                      
                                      "balanceAmount":${typeof balanceAmount === 'undefined' ? 0 : +balanceAmount},
                                      "amount":${amount},
                                      ${isDefaultCurrency == 1 ? `"currencyId":"${defaultCurrency}",` : ""}`;


                    for (var i = 0; i < rowElems.length; i++) {
                        var val = set_columnFormat($(rowElems[i]));
                        if (val != "" && val != 0 && val != null && val != undefined) {
                            var elemId = $(rowElems[i]).attr("id").split("_")[0];

                            if (elemId != "inOut" && elemId != "amount" && elemId != "balanceAmount") {
                                item += `"${elemId}": "${val}",`;
                            }
                        }
                    }
                    item += "}";
                    item = item.replace(",}", "}");
                    item = JSON.parse(item);

                    if (fundTypeId == 3 || fundTypeId == 6 || fundTypeId == 7 || fundTypeId == 8) {
                        item.treasuryDetailId = +$(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${item.id}"]`).first().data("treasurydetailid");
                        if (conditionalProperties.isBank) {
                            item.bankId = +$("#bankId").val();
                            item.bankAccountId = +$("#bankAccountId").val();
                        }
                    }


                    data.push(item);

                });
            }
            else {
                loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                var msgItem = alertify.error("تعدادی از سطرها دارای خطا است");
                msgItem.delay(alertify_delay);
            }
        }
        else {
            loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
            var msgItem = alertify.error("ابتدا وضعیت تمام سطرها را مشخص کنید");
            msgItem.delay(alertify_delay);
        }
    }
    else {
        loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

    if (data.length > 0) {

        var errordata = [];
        errordata = data.filter(x => x.amount < 0);
        if (errordata.length > 0) {


            let stringIds = "";
            for (var i = 0; i < data.length; i++) {
                stringIds = data[i].id + ",";
            }
            var msgItem = alertify.warning(`سطرهای  فوق ${stringIds}دارای مبالغ منفی است مجوز ثبت ندارید`);
            msgItem.delay(8);

            await loadingAsync(false, "insertPreviousStageLine");

            return;
        }
        else {
            insert_PreviousStageLinessAsync(data).then(
                (res) => {

                    loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                    if (res.validationErrors.length > 0) {

                        generateErrorValidation(res.validationErrors);
                    }
                    else {
                        var msgItem = alertify.success("اطلاعات با موفقیت ثبت شد");
                        msgItem.delay(alertify_delay);
                        get_header();
                        exitreasuryline = chekExistTreasuryline(id);

                        close_modal_previousStageRequests();

                    }
                    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
                    arr_pagetables[index].selectedItems = [];

                    $(`#previousStagePageTable .selectedItem-checkbox-all`).prop("checked", false).trigger("change");
                    //$(`#previousStagePageTable`).find("input[type='checkbox']").prop("checked", false);
                    if (res.successfull) {
                        if (conditionalProperties.isBank) {
                            $("#bankId").prop("disabled", true);
                            $("#bankId").data().disabled = true;
                            $("#bankId").data().notreset = true;
                            $("#bankAccountId").prop("disabled", true);
                            $("#bankAccountId").data().disabled = true;
                            $("#bankAccountId").data().notreset = true;
                        }
                        getPagetable_HeaderLine("jsonTreasuryLineList");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                    return;
                },
                (result) => {
                    modal_close("previousStageTreasuryLines");
                    return;
                });
        }
    }
}

function run_header_line_row_After_delete() {

    if (conditionalProperties.isBank) {
        if ($(`#jsonTreasuryLineList .pagetablebody tbody tr:not(#emptyRow,.font-15)`).length == 0) {
            $("#bankId").data().disabled = false;
            $("#bankId").data().notreset = false;
            $("#bankAccountId").data().disabled = false;
            $("#bankAccountId").data().notreset = false;
        }
    }

    get_header();

    exitreasuryline = chekExistTreasuryline(id);
    configTreasuryElementPrivilage(".ins-out", false);
}

async function insert_PreviousStageLinessAsync(data) {

    let response = await $.ajax({
        url: `${viewData_previousStageLines_insert_url}`,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_previousStageLines_insert_url);
            return "";
        }
    });

    return response;
}



function checkHasPreviousId(stageId, callBack = undefined) {
    $.ajax({
        url: `${viewData_checkPreviousId_url}/${stageId}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            if (typeof callBack != 'undefined')
                callBack(result.data);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_checkPreviousId_url);
        }
    });

}

function checkCurrency() {
    if ($("#currencyId").val() == getDefaultCurrency()) {
        $("#exchangeRate").prop("disabled", true);
        $("#exchangeRate").data("disabled", "true");
        $("#exchangeRate").val(1);
    }
    else {
        $("#exchangeRate").prop("disabled", false);
        $("#exchangeRate").removeData("disabled");

    }
}

$(document).ready(function () {

    $(document).on("change", "#flowTypeId", function () {

        if ($(this).val() == null)
            clearColumns();
    });

});

function object_onfocus(elem) {
}

function object_onblur(elem) {
}

function object_onchange(elem) {

}

function object_onkeydown(e, elem) {

}

function calcAmount(exchangeAmount, rowno = 0) {

    var exchangeRateId = rowno == 0 ? "exchangeRate" : `exchangeRate_${rowno}`;
    var exchangeRate = $(`#${exchangeRateId}`).length > 0 ? +removeSep($(`#${exchangeRateId}`).val()) : 1;
    var amountId = rowno == 0 ? "amountExchange" : `amountExchange_${rowno}`;
    if (exchangeAmount > 0 && exchangeRate > 0) {

        var amount = exchangeRate * exchangeAmount;
        $(`#${amountId}`).val(transformNumbers.toComma(amount.toFixed(defaultRounding)));
    }
    else if (exchangeRate == 0) {
        $(`#${amountId}`).val(0);
    }
}

function tr_object_onfocus(elem) {

    selectText(elem);
}

function tr_object_onkeydown(e, elem) {

}

function after_navigationModalClose() {
    headerLine_formkeyvalue = treasuryLine_formkeyvalue;
    additionalData = treasuryLine_additionalData;
    call_initform = call_initFormTreasuryLine;
    callbackLineFillFunc = callBackLineFill;
    callBackHeaderFillFunc = callBackHeaderFill;
}

function SetRequiredParsley(type, fieldName, elemId) {
    if (type) {
        if ($(`#${elemId}`).attr("data-parsley-required") == undefined) {
            $(`#${elemId}`).attr("data-parsley-required-message", `${fieldName} اجباری است`);
            $(`#${elemId}`).attr("data-parsley-required", true);
            $(`#${elemId}`).attr("data-parsley-errors-container", `#${elemId}ErrorContainer`);
            if ($($(`#${elemId}`).parents(".form-group")[0]).find(`#${elemId}ErrorContainer`).length == 0)
                $($(`#${elemId}`).parents(".form-group")[0]).append(`<div id='${elemId}ErrorContainer'></div>`);
            else
                $($(`#${elemId}`).parents(".form-group")[0]).find(`#${elemId}ErrorContainer`).removeClass("displaynone");
        }
    }
    else {
        if ($(`#${elemId}`).attr("data-parsley-required") != undefined) {
            $(`#${elemId}`).removeAttr("data-parsley-required-message");
            $(`#${elemId}`).removeAttr("data-parsley-required");
            $(`#${elemId}`).removeAttr("data-parsley-errors-container");
            $($(`#${elemId}`).parents(".form-group")[0]).find(`#${elemId}ErrorContainer`).addClass("displaynone");
        }
    }
}

async function public_object_onchange(elm) {
    if (typeof elm === "undefined") return;

    var elmId = $(elm).attr("id");

    if (elmId === "treasurySubjectId") {

        var subjectIndex = additionalData.findIndex(x => x.name === "treasurySubjectId");
        if (subjectIndex != -1)
            additionalData[subjectIndex].value = +$("#formPlateHeaderTBody").data("treasurySubjectId");

        getGLSGLFromPostingGroup();
    }

    else if (elmId === "requestId")
        if (+$(elm).val() !== 0) {

            workflowCategoryName = document.getElementById("requestId");
            var len = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',').length;
            workflowCategoryId = len == 2 ? workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[1].split('-')[0] : workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[2].split('-')[0];
            shamsiTransactionDate = workflowCategoryName.options[workflowCategoryName.selectedIndex].text.split(',')[0].split('-')[1];
            $(`#headerTransactionDatePersian`).val(shamsiTransactionDate);
            getGlSGLbyRequestId(+$(elm).val(), +workflowCategoryId);
        }
}

function getGlSGLbyRequestId(identityId, workflowCategoryId) {
    let url = `${viewData_getGlSGLbyRequestId}/${workflowCategoryId}/${identityId}`;
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: JSON.stringify(+id),
        contentType: "application/json",
        success: function (result) {
            if (typeof result !== "undefined" && result != null) {

                $(`#accountGLId`).val(result.accountGLId == 0 ? "" : `${result.accountGLId} - ${result.accountGLName}`);
                $(`#accountGLId`).data("value", result.accountGLId);
                $(`#accountSGLId`).val(result.accountSGLId == 0 ? "" : `${result.accountSGLId} - ${result.accountSGLName}`);
                $(`#accountSGLId`).data("value", result.accountSGLId);

                $(`#documentTypeId`).val(result.documentTypeId == 0 ? "" : `${result.documentTypeId} - ${result.documentTypeName}`);
                $(`#documentTypeId`).data("value", result.documentTypeId);
                tempDocumentTypeId = result.documentTypeId;

                $(`#note`).val(result.note);
                $(`#transactionDatePersian`).val(result.documentDatePersian);

                isRequest = id > 0 ? true : false;


                var stageId = +$("#stageId").val();

                // if (stageId == 35 || stageId == 49) {
                var treasurySubjectOption = new Option(`${result.treasurySubjectId} - ${result.treasurySubjectName}`, result.treasurySubjectId, true, true);
                $("#treasurySubjectId").append(treasurySubjectOption).trigger('change');
                // }

                if (result.accountGLId !== 0 && result.accountSGLId !== 0) {
                    $("#noSeriesId").prop("disabled", isRequest).prop("required", isRequest);
                    fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                    $("#noSeriesId").val(result.noSeriesId).trigger("change.select2");

                    $("#accountDetailId").empty();
                    $("#accountDetailId").prop("disabled", isRequest).prop("required", isRequest);
                    getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId");
                    $("#accountDetailId").val(result.accountDetailId).trigger("change.select2");

                }

            }
            else {
                $(`#accountGLId`).val("");
                $(`#accountSGLId`).val("");
                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", true).val(0).trigger("change");
                $(`#documentTypeId`).val("");

            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function getTreasuryRequestTreasurySubject(requestId) {

    var url = `${viewData_baseUrl_FM}/NewTreasuryApi/getrequesttreasurytreasurysubject`

    var tresurySubject = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: JSON.stringify(+requestId),
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return { id: 0, name: "" }
        }
    });

    return tresurySubject.responseJSON;
}

function getGLSGLFromPostingGroup() {

    let model = {};
    if (!$("#treasurySubjectId").prop("disabled")) {
        if (+$("#treasurySubjectId").val() != 0) {
            model = {
                headerId: +$("#treasurySubjectId").val(),
                stageId: stageId,
                branchId: branchId,
                postingGroupTypeId: 1
            }

            setGlSglInfo(model, conditionalProperties.isRequest, glSGLModel.noSeriesId);
        }

    }
}

function checkBankAccountInput(fundTypeId) {

    $.ajax({
        url: `/api/FMApi/getfundtypeinputmethod`,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(fundTypeId),
        success: function (result) {

            if (result == 2) {

                $("#btn-search-bankAccountId").css("display", "none");
                $("#bankAccountId").unbind("keydown");
            }
            else {

                $("#btn-search-bankAccountId").css("display", "block");
                $("#bankAccountId").unbind("keydown").bind("keydown", elemOnKeyDown);
            }
        },
        error: function (xhr) {
            if (callback != undefined)
                callback();
            error_handler(xhr, p_url);
        }
    });
}

async function resetFormWhenEnabled() {
}

function clearColumns() {
    $("#fundTypeId").val("");
    $("#bankAccountId").val("");
    $("#transitNo").val(0);
    $("#documentNo").val(0);
    $("#documentDatePersian").val(0);
    $("#amount").val(0);
    $("#jsonTreasuryLineList .ins-row").attr("data-hidden-discpercent", 0);
    $("#jsonTreasuryLineList .ins-row").attr("data-hidden-vatper", 0);
}

async function local_objectChange(elem) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");
}

async function local_tr_object_onchange(elem, pageId) {

    switch ($(elem).attr("id")) {
        case "fundTypeId":
            if (!isFormLoaded) {
                getTreasuryFundItemTypeInOut($(elem).val());

                if (!conditionalProperties.isRequest)
                    $("#bondDueDatePersian").removeAttr("data-parsley-dateissamebonddue");
            }

            break;
        case "currencyId":
            checkCurrency();
            break;
        case "bankAccountId":
            if (conditionalProperties.isBank)
                refreshRequestLinesBtn();
            break;
    }
}

function getTreasuryFundItemTypeInOut(fundTypeId) {

    var lineId = $(`#treasuryLinePage #jsonTreasuryLineList .ins-out`).data("model.id");

    if (checkResponse(lineId))
        $("#fundTypeId").attr("disabled", true);


    var model = {
        fundItemTypeId: +fundTypeId,
        stageId: +$("#stageId").val()
    }
    if (model.fundItemTypeId > 0 && model.stageId > 0) {
        $.ajax({
            url: "api/WF/StageFundItemTypeApi/getstagefunditemtypeinout",
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result == 3) {
                    if (!$("#fundTypeId").data("disabledinout"))
                        $("#inOut").prop("disabled", false);
                    else
                        $("#inOut").prop("disabled", true);

                    $("#inOut").data("disabled", false);
                    $("#inOut").data("notreset", false);
                }
                else if (result == 1 || result == 2) {
                    if (+$("#inOut").val() != result) {
                        $("#inOut").val(result).trigger("change");
                        $("#inOut").prop("disabled", true);
                        $("#inOut").prop("notreset", true);
                    }
                    $("#inOut").data("disabled", true);
                }
                else {
                    $("#inOut").prop("disabled");
                    $("#inOut").val("0").trigger("change");
                }
            }
        })
    }
}

function callBackAfterEdit() {
    getTreasuryFundItemTypeInOut($("#fundTypeId").val());
}

function configSelect2_trEditing(pg_name, rowno, enableConfig = false) {
    $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td[data-select2='true'].enable-requst-field`).each(function () {
        if ($(`#${pg_name} #${$(this).attr("id")} div`).first().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).first().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).first().addClass("displaynone");

        if ($(`#${pg_name} #${$(this).attr("id")} div`).last().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).last().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).last().addClass("displaynone");

    })
    if (enableConfig) {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var columns = arr_pagetables[index].columns;
        $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td.enable-requst-field`).find("select.select2").each(function () {
            var elemId = $(this).attr("id");
            var colId = elemId.split("_")[0];
            var column = columns.filter(a => a.id == colId)[0];
            var getInputSelectConfig = column.getInputSelectConfig;
            if (getInputSelectConfig != null && column.isSelect2) {
                var params = "";
                var parameterItems = getInputSelectConfig.parameters;
                if (parameterItems != null && parameterItems.length > 0) {
                    for (var i = 0; i < parameterItems.length; i++) {
                        var paramItem = parameterItems[i].id;
                        if (parameterItems[i].inlineType)
                            params += $(`#${pg_name} #${paramItem}_${rowno}`).val();
                        else
                            params += $(`#${paramItem}`).val();

                        if (i < parameterItems.length - 1)
                            params += "/";
                    }
                }
                var val = +$(`#${pg_name} #${elemId}`).data("value");
                $(`#${pg_name} #${elemId}`).empty();

                if (column.pleaseChoose)
                    $(`#${pg_name} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                    fill_select2(getInputSelectConfig.fillUrl, `${pg_name} #${elemId}`, true, params, false, 0, '', function () {
                        $(`#${pg_name} #${elemId}`).val(val).trigger("change");
                    });
                }
            }
            else {
                var val = +$(`#${pg_name} #${$(this).attr("id")}`).data("value");
                $(`#${pg_name} #${elemId}`).select2();
                $(`#${pg_name} #${elemId}`).val(val).trigger("change");
            }
        });
    }

    if (typeof after_configSelect2_trEditing != "undefined")
        after_configSelect2_trEditing();

}

function after_configSelect2_trEditing() {
    var row = $($("#previousStagePageTable table tbody tr.highlight")[0]);
    var inOutElem = undefined;
    row.find("td select").each(function () {
        if ($(this).attr("id").indexOf("inOut") != -1)
            inOutElem = $(this);
    });
    var model = {
        fundItemTypeId: +row.data("fundtypeid"),
        stageId: +$("#stageId").val()
    }
    if (model.fundItemTypeId > 0 && model.stageId > 0) {
        $.ajax({
            url: "api/WF/StageFundItemTypeApi/getstagefunditemtypeinout",
            type: "post",
            dataType: "json",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result == 3) {
                    $(inOutElem).removeAttr("readonly");
                    if (!$("#fundTypeId").data("disabledinout"))
                        $(inOutElem).removeProp("disabled");
                    else
                        $(inOutElem).prop("disabled", true);
                }
                else if (result == 1 || result == 2) {
                    $(inOutElem).attr("readonly", true);
                    $(inOutElem).prop("disabled", true);
                    $(inOutElem).attr("data-disabled", true);
                    $(inOutElem).val(result).trigger("change");
                }
                else {
                    $(inOutElem).attr("readonly", true);
                    $(inOutElem).prop("disabled", true);
                    $(inOutElem).attr("data-disabled", true);
                    $(inOutElem).val("0").trigger("change");
                }
            }
        })
    }
}

function checkRequestIsLastConfirmHeader(requestId) {

    var result = $.ajax({
        url: viewData_checkRequest_isLastConfirmHeader,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(requestId),
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_checkRequest_isLastConfirmHeader);
            return false;
        }
    });

    return result.responseJSON;
}

function trOnclick(pg_name, elm, evt) {

    configAfterChange();

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;


    if (trediting) {
        if (elm.hasClass("funkyradio"))
            elm.prop("checked", !elm.prop("checked"));

        return;
    }
    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
    tr_HighlightHeaderLine(pg_name);

    //var id = $(elm).data("model.id");    
    //fillTreasuryLineFooter(id);
}

function fillTreasuryLineFooter(rowIdSelect) {

    getfillTreasuryLineFooter(rowIdSelect).then(function (data) {

        $("#header-lines-footer").css("marginTop", "15px");
        $("#header-lines-footer").html("");
        let strTbodyTr = "";
        let strTbodyTd = "";

        if (data != null) {

            let uniqueDecimalArray = _.uniqBy(data, 'isDecimal');
            let columncount = (data.length / uniqueDecimalArray.length) * 3;
            let width = 100 / columncount;

            let strTbodyTh = `
                <table style="margin-top:10px" id="fillTreasurylineFooterTbody">
                    <thead >
                        <tr>
                            <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}"></th>`

            for (var j = 0; j < (columncount / 3); j++) {

                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/کل</th>`
                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/معین</th>`
                strTbodyTh += ` <th style="background-color: #dee2e6;border: 1px solid white ;width:${width}">${data[j].name}/تفضیل</th>`
            }
            strTbodyTh += ` </tr>
                           </thead>
                                 <tbody>`;

            for (var k = 0; k < uniqueDecimalArray.length; k++) {
                strTbodyTh += `<tr><td>${uniqueDecimalArray[k].isDecimalName}</td>`;
                for (var r = 0; r < data.length; r++) {

                    if (data[r].isDecimal == k + 1) {

                        if (data[r].isDecimal == 1) {
                            strTbodyTh += data[r].accountGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountGLName}</td>`
                            strTbodyTh += data[r].accountSGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountSGLName}</td>`
                            strTbodyTh += data[r].accountDetailName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountDetailName}</td>`
                        }
                        if (data[r].isDecimal == 2) {

                            strTbodyTh += data[r].accountGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountGLName}</td>`
                            strTbodyTh += data[r].accountSGLName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountSGLName}</td>`
                            strTbodyTh += data[r].accountDetailName == null ? `<td style="background-color: #ffe4e4; text-align: center;"> _ </td>` : `<td>${data[r].accountDetailName}</td>`
                        }
                    }
                }

                strTbodyTh += strTbodyTd + `</tr>`;
            }
            strTbodyTh += `
                       
                    </tbody>
                </table>
                `
            $("#header-lines-footer").append(strTbodyTh)
            $("#fillTreasurylineFooterTbody").append(strTbodyTr)
        }

        else
            $("#fillTreasurylineFooterTbody").addClass("displaynone");
    });
}

async function getfillTreasuryLineFooter(id) {

    var p_url = `/api/WFApi/postgrouplinefooter`;

    var model = {
        id: id,
        workflowCategoryId: 6
    }
    var response = await $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });

    return response;
}

function configAfterChange() {

    setTimeout(function () {
        if (!conditionalProperties.isAfterChange && !isFormLoaded) {

            configTreasuryElementPrivilage(".ins-out", isAfterSave);
            isAfterSave = false;
        }
        else {
            $("#fundTypeId").select2("focus");
            conditionalProperties.isAfterChange = false;
        }
    }, 100)
}

function tr_object_onblur(pageId = '', elem, rowno = 0, colno = 0) {
    var elem = $(elem);
    var elemId = elem.attr("id");
    var elemIdSplited = elemId.split("_")[0];
    switch (elemIdSplited) {
        case "amount":

            calcAmount(+removeSep(elem.val()), rowno);
            break;
    }

}

function trOnkeydown(ev, pg_name, elm) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space].indexOf(ev.which) == -1) return;

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_lastpage = arr_headerLinePagetables[index].lastpage;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    var pagetable_tr_editing = arr_headerLinePagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {

        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowUp);
            }
            else {
                pagetable_currentrow--;
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
                elm = $(`#row${pagetable_currentrow}`);
                after_change_trHeaderLine(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowUp);
            }
            else if (pagetable_currentpage !== 1)
                pagetablePrevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowDown);
            }
            else {
                pagetable_currentrow++;
                elm = $(`#row${pagetable_currentrow}`);
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

                after_change_trHeaderLine(pg_name, KeyCode.ArrowDown);
            }
        }
        else {

            /////////////////////////////
            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_rowHeaderLine === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowDown);
            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                arr_headerLinePagetables[index].currentrow = 1;
                elm = $(`#row1`);
                pagetableNextpage(pagetable_id);
            }
        }
    }

}

function treasury_getStageStepConfigFieldTable(formKey, callBack = undefined) {

    $.ajax({
        url: getStageStepFieldTable_url,
        data: JSON.stringify(formKey),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            if (res != null && res.data != null) {
                if (typeof callBack != "undefined")
                    callBack(res.data);
            }
        },
        error: function (xhr) {
            error_handler(xhr, getStageStepFieldTable_url);
        }

    })
}

function set_row_editing(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_editable = arr_pagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
    var pagetable_currentcol = arr_pagetables[index].currentcol;
    if (pagetable_editable) {
        arr_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        if (pg_name !== "previousStagePageTable")
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);
        else
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} td.enable-requst-field`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);

    }
}

function tr_onkeydown(pg_name, elem, ev) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables[index].currentcol
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else {
                pagetable_currentrow--;
                arr_pagetables[index].currentrow = pagetable_currentrow;
                after_change_tr(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            //else if (pagetable_currentpage !== 1)
            //    pagetable_prevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if (document.activeElement.className.indexOf("select2") >= 0) // Open when ArrowDone In Select2
            return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else {
                pagetable_currentrow++;
                arr_pagetables[index].currentrow = pagetable_currentrow;
                after_change_tr(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            //else if (pagetable_currentpage != pagetable_lastpage) {
            //    arr_pagetables[index].currentrow = 1;
            //    pagetable_nextpage(pagetable_id);
            //}
        }
    }
    else if (ev.which === KeyCode.Enter) {

        if (pagetable_editable) {

            if (!pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow, true);
                pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
            }
            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio,.search-modal-container > input").first()
            var tdLength = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td`).find("input,select,div.funkyradio,.search-modal-container > input").length;

            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editing(pg_name);

                    if (pg_name == "previousStagePageTable")
                        if (currentElm.parents("tr").hasClass("enable-requst-field")) {
                            currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td.enable-requst-field`).find("input,select,div.funkyradio,.search-modal-container > input").first()
                        }
                        else {
                            let tdEdit = currentElm.parents("td");
                            for (var i = 0; i < tdLength; i++) {
                                if (tdEdit.hasClass("enable-requst-field")) {
                                    currentElm = tdEdit.find("input,select,div.funkyradio,.search-modal-container > input");
                                    break;
                                }
                                else
                                    tdEdit = tdEdit;
                            }
                        }


                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else if (currentElm.hasClass("select2")) {
                        var colno = currentElm.parent().parent().attr("id").split("_")[2];
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2();
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2("focus");
                    }
                    else
                        currentElm.focus();
                }
                else {
                    var nextElm = undefined,
                        nextTds = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} td`),
                        nextTdsL = nextTds.length;

                    for (var x = pagetable_selectable ? 1 : 0; x < nextTdsL; x++) {
                        var v = nextTds[x];
                        if (nextElm == undefined) {
                            if ($(v).attr("id") != undefined) {
                                var currentcol = $(v).attr("id").split("_")[2];
                                if (+currentcol > +pagetable_currentcol) {
                                    var nxtElm = $(v).find('input,select,div.funkyradio,button[data-isfocusinline="true"]').first();
                                    if (nxtElm.length > 0 && $(nxtElm).attr("readonly") != "readonly" && $(nxtElm).attr("disabled") != "disabled") {
                                        nextElm = nxtElm;
                                    }
                                }
                            }
                        }
                    }
                    // المنت بعدی وجود داشت
                    if (nextElm != undefined && nextElm.length != 0) {
                        if (currentElm.hasClass("funkyradio")) {
                            var td_lbl_funkyradio = currentElm.find("label");
                            td_lbl_funkyradio.removeClass("border-thin");
                        }
                        if (nextElm.hasClass("select2")) {
                            var colno = nextElm.parent().parent().attr("id").split("_")[2];
                            tr_onfocus(pg_name, colno);
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2();
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2("focus");
                        }
                        else if (nextElm.hasClass("funkyradio")) {
                            nextElm.focus();

                            var td_lbl_funkyradio = nextElm.find("label");
                            td_lbl_funkyradio.addClass("border-thin");
                        }
                        else
                            nextElm.focus();
                    }
                    else {
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                arr_pagetables[index].currentrow = pagetable_currentrow;

                                after_change_tr(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                //pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).focus();
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first,.search-modal-container > input");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,.search-modal-container > input").attr("disabled", true);
                }
            }
        }
    }
    else if (ev.which === KeyCode.Esc) {
        if (pagetable_editable) {

            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow);
                after_change_tr(pg_name, KeyCode.Esc);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);
                    pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
                }
            }
            else {
                var modal_name = $(`#${pagetable_id}`).closest("div.modal").attr("id");
                modal_close(modal_name);
            }
        }
    }
    else if (ev.which === KeyCode.Space) {


        if (pagetable_editable && pagetable_tr_editing) {



            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio")) {

                ev.preventDefault();
                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol} .funkyradio #btn_${pagetable_currentrow}_${pagetable_currentcol}`);
                checkbox_funky.prop("checked", !checkbox_funky.prop("checked")).trigger("change");
            }
            //else if (elm.prop("tagName").toLowerCase() === "select") {

            //}
        }

        else if (pagetable_editable === false && pagetable_tr_editing === false || pagetable_selectable) {
            ev.preventDefault();
            pagetable_currentcol = 1;

            var editMode = false;
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input", "select").each(function () {
                if ($(this).prop("disabled") == false && $(this).attr("type") != "checkbox")
                    editMode = true;
            })
            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input[type='checkbox']").first();
            if (!editMode) {
                if (elm.prop("checked")) {
                    var pagetable = $(`#${pg_name}`);
                    $(pagetable).find("input[type='checkbox']").first().prop("checked", false);
                }
                elm.prop("checked", !elm.prop("checked"));
                itemChange(elm);
            }
        }
    }
}



$(document).on("keydown", `#${activePageId} #formHeaderLine`, function (e) {
    if (e.keyCode == 27) {
        if (+$("#fundTypeId").val() != $("#fundTypeId").prop("selectedIndex", 0).val())
            $("#fundTypeId").val($("#fundTypeId").prop("selectedIndex", 0).val()).trigger("change");

        configTreasuryElementPrivilage(".ins-out", false)
        $(`#${activePageId} #jsonTreasuryLineList .ins-out > .row`).parsley().reset();

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

function printFromPlateHeaderLine() {

    let stageClassId = $("#formPlateHeaderTBody").data("stageclassid"),
        currentInOut = $("#formPlateHeaderTBody").data("currentinout"),
        treasuryId = $("#formPlateHeaderTBody").data("id"),
        reportTitle = $(`#formPlateHeaderTBody td:eq(4)`).text().split('-')[1];

    printDocumentTreasury(stageClassId, currentInOut, treasuryId, reportTitle);
}

window.Parsley._validatorRegistry.validators.dateissamebonddue = undefined;

window.Parsley.addValidator("dateissamebonddue", {
    validateString: function (value) {

        var bondDueDatePersianDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var treasuryDate = glSGLModel.parentdocumentdatepersian;

        if (bondDueDatePersianDate.isValid()) {
            bondDueDatePersianDate = bondDueDatePersianDate.format('YYYY/MM/DD');
            treasuryDate = treasuryDate.format('YYYY/MM/DD');
            var dateIsValid = moment(bondDueDatePersianDate).isSameOrAfter(treasuryDate, 'day');
            return dateIsValid;
        }
        return false;
    },
    messages: {
        en: 'تاریخ رسید چک باید بزرگتر، مساوی تاریخ برگه درخواست باشد'
    }
});

function listTearsury() {
    if (!conditionalProperties.isCartable)
        navigation_item_click('/FM/NewTreasury', 'اسناد خزانه');
    else
        navigation_item_click(`/FM/PostingGroupCartable/${stageId}`, 'کارتابل اسناد');
}

function disable_dataEntry_btnRows() {
    if (conditionalProperties.isDataEntry != undefined) {
        var prop = !conditionalProperties.isDataEntry;
        $(`#${activePageId} .pagetablebody  button:not()`).prop("disabled", prop);

    }
}

function headerLineActive(pageId) {

    var treasuryAction = getTreasuryStageActionConfig(id);
    if (treasuryAction.isDataEntry || treasuryAction.isBank) {
        $(".ins-out").removeData();
        $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonTreasuryLineList')");
        configTreasuryElementPrivilage(`.ins-out`, true);
    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

function checkEditOrDeletePermission(opr = "Upd") {

    var treasuryAction = getTreasuryStageActionConfig(id);

    if (opr == "Upd") {
        if (treasuryAction.isDataEntry == 1 || treasuryAction.isDataEntry == 3)
            return true;
        else
            return false;
    }
    else {
        if (treasuryAction.isDataEntry != 0)
            return true;
        else
            return false;
    }
}

function printFromPlateHeaderLine() {
    let stageClassId = $("#formPlateHeaderTBody").data("stageclassid"),
        currentInOut = $("#formPlateHeaderTBody").data("currentinout"),
        treasuryId = $("#formPlateHeaderTBody").data("id"),
        reportTitle = $(`#formPlateHeaderTBody td:eq(4)`).text().split('-')[1];

    printDocumentTreasury(stageClassId, currentInOut, treasuryId, reportTitle);
}

function refreshRequestLinesBtn() {

    var dataEntryValue = $("#formPlateHeaderTBody").data("isdataentry");
    if (dataEntryValue == 1 || dataEntryValue == 3) {
        if (conditionalProperties.isPreviousStage == 1 || conditionalProperties.isRequest)
            change_addRequestLineBtn_disabled(false)
        else
            change_addRequestLineBtn_disabled(true)
    }
    else if (dataEntryValue == 2) {

        $(`#${activePageId} .pagetablebody  button#btn_delete`).prop("disabled", false);
        if (conditionalProperties.isBank && +$("#bankAccountId").val() == 0) {
            change_addRequestLineBtn_disabled(true);
        }
        else if (conditionalProperties.isBank && +$("#bankAccountId").val() !== 0) {
            change_addRequestLineBtn_disabled(false)
        }
        else {
            change_addRequestLineBtn_disabled(false)
        }
    }
    else {
        change_addRequestLineBtn_disabled(true);
    }

}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configTreasuryElementPrivilage(containerId, privilageType = null) {
    
    // فعالسازی : haederLineActive
    // افزودن از درخواست: add_requestLines
    // افزودن : headerLineInsUp
    // ویرایش لاین: btn_editPerson
    // حذف لاین: btn_delete


    $(`#${activePageId} #headerLineInsUp`).removeClass("d-none");

    if (!conditionalProperties.isBank) {
        $("#fundTypeId").data("disabledinout", !privilageType)
        if (!privilageType)
            $("#fundTypeId").prop("selectedIndex", 0).trigger("change");
    }


    if (conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 3) {

        if (conditionalProperties.isPreviousStage == 1 || conditionalProperties.isRequest) {

            if (conditionalProperties.isEqualToParentRequest) {
                $(`#${activePageId} #addRequestLines`).prop("disabled", false);
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
                $("#jsonTreasuryLineList .pagetablebody tbody tr  td button:first-child").prop("disabled", true)
            }
            else {
                $("#jsonTreasuryLineList .pagetablebody tbody tr  td button").prop("disabled", false)
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
            }

        }

        else {
            $(`#${activePageId} #addRequestLines`).prop("disabled", true);
            $(`#${activePageId} .pagetablebody button`).prop("disabled", false);
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        }


    }
    else {
        if (conditionalProperties.isDataEntry || conditionalProperties.isBank)
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        else
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);


        $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);
        $(`#${activePageId} .pagetablebody button`).prop("disabled", true);

        if ($("#formPlateHeaderTBody").data("isdataentry") == 2) {

            $("#jsonTreasuryLineList .pagetablebody tbody tr  td button:last-child").prop("disabled", false)
            $(`#${activePageId} #headerLineInsUp`).addClass("d-none");



            if (conditionalProperties.isBank && +$("#bankAccountId").val() == 0)
                $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);

            else if (conditionalProperties.isBank && +$("#bankAccountId").val() !== 0)
                $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
            else
                $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
        }
    }


    if (privilageType != null) {
        var selector,
            allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp,
                         #${activePageId} ${containerId} #addRequestLines`);


        if (privilageType) {

            $("#haederLineActive").removeClass("pulse");
            $("#haederLineActive").removeAttr("title");

            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

            if (conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 3 || conditionalProperties.isBank) {
                lineSelectedId = 0;
                for (var i = 0; i < allSelector.length; i++) {
                    selector = $(allSelector[i]);
                    if (allSelector[i].id != "") {
                        if (selector.hasClass("select2-hidden-accessible")) {

                            if (!selector.data().disabled) {
                                if (conditionalProperties.isEqualToParentRequest && conditionalProperties.isRequest)
                                    selector.prop("disabled", false);
                                else
                                    selector.prop("disabled", !privilageType);
                            }


                            if (!selector.data().notreset && containerId != "#header-div-content") {
                               
                                if (!conditionalProperties.isBank) {
                                    selector.prop("selectedIndex", 0).trigger("change");
                                    selector.val("0").trigger("change");
                                }

                            }
                        }
                        else if (selector.hasClass(".funkyradio")) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.prop("checked", false);
                        }

                        else if (selector.attr("id") == "addRequestLines") {
                            if (conditionalProperties.isEqualToParentRequest && conditionalProperties.isRequest)
                                selector.prop("disabled", false);
                            else 
                                selector.prop("disabled", true);
                            
                        }

                        else {

                            if (!selector.data().disabled) {
                                if (conditionalProperties.isEqualToParentRequest && conditionalProperties.isRequest)
                                    selector.prop("disabled", false);
                                else
                                    selector.prop("disabled", !privilageType);
                            }

                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.val(``);
                        }
                    }
                }
            }
            else
                configTreasuryElementPrivilage(".ins-out", false);

            setTimeout(() => {

                var firstElement = $(`#${activePageId} ${containerId} ${containerId.indexOf("ins-out") == -1 ? 'th' : ''} .form-group`)
                    .not('.displaynone')
                    .find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)")
                    .first();



                if (firstElement.length > 0) {
                    if (firstElement.attr("class") != undefined && firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled")) {
                        $(firstElement).select2("focus");
                    }
                    else
                        $(firstElement).focus();
                }
            }, 300);
        }
        else {
            if ($("#formPlateHeaderTBody").data("isdataentry") == 2 && conditionalProperties.isBank && $("#jsonTreasuryLineList #row1").length == 0) {
                $("#haederLineActive").addClass("pulse");
                $("#haederLineActive").attr("title", "جهت افزودن از درخواست ، لطفا بانک و حساب بانکی را انتخاب نمایید");
            }
            else if ($("#jsonTreasuryLineList #row1").length > 0) {
                $("#haederLineActive").removeClass("pulse");
                $("#haederLineActive").removeAttr("title");
            }


            for (var i = 0; i < allSelector.length; i++) {
                selector = $(allSelector[i]);

                if (selector.hasClass("select2-hidden-accessible")) {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                       
                        if (!conditionalProperties.isBank) {
                            selector.prop("selectedIndex", 0).trigger("change");
                            selector.val("0").trigger("change");
                        }

                    }
                }
                else if (selector.hasClass(".funkyradio")) {
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.prop("checked", !privilageType);
                }

                else if (selector.attr("id") == "addRequestLines") {

                    if (conditionalProperties.isEqualToParentRequest) {
                        if (conditionalProperties.isRequest) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : privilageType);
                        }
                        else
                            selector.prop("disabled", true);
                    }
                    else
                        selector.prop("disabled", true);


                }
                else {
                    selector.prop("disabled", !privilageType);

                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.val(``);
                }

            }
        }
    }
}

configLineElementPrivilage = configTreasuryElementPrivilage;

$(`#${activePageId} #header-div-content`).on("focus", function () {

    configTreasuryElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configTreasuryElementPrivilage(".ins-out", false);
    }
});

function run_header_line_row_moreInfo(id, rowno) {
    var row = $(`#jsonTreasuryLineList #row${rowno}`).data();
    $("#treasuryDetailRows").html("");
    var trString = `<tr><td>${row['model.bankissuer']}</td><td>${row['model.bankaccountissuer']}</td><td>${row['model.bondduedatepersian']}</td></tr>`;
    $("#treasuryDetailRows").append(trString);
    $("#treasuryLineDetailModal").modal("show");
}

