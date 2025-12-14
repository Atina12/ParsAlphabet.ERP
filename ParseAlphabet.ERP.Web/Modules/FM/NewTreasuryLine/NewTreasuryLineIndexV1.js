var viewData_form_title = "اسناد خزانه",
    viewData_controllername = "NewTreasuryLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/display`,
    viewData_getHeader_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getheader`,
    viewData_updrecord_header_url = `${viewData_baseUrl_FM}/NewTreasuryApi/updateinline`,
    glSGLModel = { accountGLId: 0, accountGLName: "", accountSGLId: 0, accountSGLName: "", accountDetailId: 0, accountDetailRequired: 0 },
    defaultCurrency = getDefaultCurrency(), defaultRounding = getRounding(defaultCurrency),
    treasurySubjectInfo = {}, headerLine_formkeyvalue = [], treasuryLine_formkeyvalue = [], treasuryLine_additionalData = [], arr_headerLinePagetables = [], lastpagetable_formkeyvalue = [],
    lastFundType = 0, requestId = 0, stageId = 0, branchId = 0, id = 0, hasPriviousMode = false, header_pgnation = 0, treasurySubjectChangeCount = 0, requestIdChangeCount = 0, requestLinesData = [],
    updatedRequestId = 0, hasRefreshColumn = true;

activePageId = "treasuryLinePage";
headerLine_formkeyvalue.push($(`#${activePageId} #treasuryId`).val());
headerLine_formkeyvalue.push(+$(`#${activePageId} #isDefaultCurrency`).val());

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
    getpagetable_url: `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasurylinepage`,
    insRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/insertTreasuryLine`,
    getRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyids`,
    upRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/updateTreasuryLine`,
    getsum_url: `${viewData_baseUrl_FM}/${viewData_controllername}/treasurylinesum`,
    delRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/deleteTreasuryLine`,
    getColumn_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryLineColumns`,
    pagetable_laststate: "",
    saveValidationFunc: function () {
        var treasuryAction = getTreasuryStageActionConfig(id);
        if (treasuryAction.isDataEntry || treasuryAction.isBank) {
            return true;
        }
        else {
            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
            msgItem.delay(alertify_delay);
            return false;
        }
    }
},
    previousStagePage = {
        pagetable_id: "previousStagePageTable",
        selectable: true,
        pagerowscount: 15,
        currentpage: 1,
        lastpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasuryrequest`,
        getfilter_url: `${viewData_baseUrl_FM}/${viewData_controllername}/getrequestfilteritems`
    };

arr_pagetables.push(previousStagePage);
arr_headerLinePagetables.push(pagelist1);

function call_initFormTreasuryLine(header_Pagination = 0) {
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

    InitForm(activePageId, true, callBackHeaderFill, null, callBackLineFill, callBackBeforeLineFill, getRecordParameterFinalizeFunc);
}



async function callBackBeforeLineFill() {

    if ((isFormLoaded || header_pgnation > 0)) {
        if ($(".ins-out #addRequestLines").length == 0)
            $(".ins-out").append(`<button onclick="add_requestLines()" type="button" id="addRequestLines" data-disabled="false" class="btn btn-success ml-2 pa float-sm-left waves-effect" value="">افزودن از درخواست</button>`);

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
    }

    lastFundType = headerLine_formkeyvalue[3];

    InitFormLine();

}

function change_addRequestLineBtn_disabled(prop) {
    setTimeout(function () {
        if (prop) {
            if ($("#addRequestLines").attr("disabled") == undefined)
                $("#addRequestLines").attr('disabled', prop);
            $("#addRequestLines").removeAttr('onclick');
        }
        else {
            if ($("#addRequestLines").attr("disabled") != undefined)
                $("#addRequestLines").removeAttr(`disabled`);
            $("#addRequestLines").data(`disabled`, prop);
            $("#addRequestLines").attr('onclick', 'add_requestLines()');
        }
    }, 100);
}

function getRecordParameterFinalizeFunc(getRecordModel) {
    getRecordModel.isDefaultCurrency = +$("#isDefaultCurrency").val();
    return getRecordModel;
}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="excelTearsury()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="listTearsury()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '><select style='width: 78%; float: right' class='form-control' id='action'></select><button onclick='update_action()' type='button' class='btn btn-success ml-2 pa waves-effect' value=''>ثبت گام</button></div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    stageId = +$(`#${activePageId} #stageId`).val();
    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");

    requestId = isNaN(+$(`#${activePageId} #requestId`).data("val")) ? 0 : +$(`#${activePageId} #requestId`).data("val");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");

    isDefaultActivateBtn = +$(`#${activePageId} #formPlateHeaderTBody`).data("isbank") == 1;
    glSGLModel.accountGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountglid");
    glSGLModel.accountGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountgl");
    glSGLModel.accountSGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountsglid");
    glSGLModel.accountSGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountsgl");
    glSGLModel.accountDetailRequired = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountdetailrequired");
    glSGLModel.documentTypeId = +$(`#${activePageId} #formPlateHeaderTBody`).data("documenttypeid");
    glSGLModel.documentTypeName = $(`#${activePageId} #formPlateHeaderTBody`).data("documenttypename");

    tempDocumentTypeId = glSGLModel.documentTypeId;

    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    conditionalProperties.isTreasurySubject = +$(`#${activePageId} #formPlateHeaderTBody`).data("treasurysubjectid");
    conditionalProperties.isRequest = +$(`#${activePageId} #formPlateHeaderTBody`).data("isrequest");
    conditionalProperties.isBank = +$(`#${activePageId} #formPlateHeaderTBody`).data("isbank");
    conditionalProperties.isDataEntry = $("#formPlateHeaderTBody").data("isdataentry") == 1 ? true : false;

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
        { name: "decimalAmount", value: 0 }
    ];



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

    if ($("#jsonTreasuryLineList").data("formReset") == undefined)
        configTreasuryElementPrivilage("ins-out", "reset");
}

function header_updateValidtion() {

    if ($("#accountDetailId").prop("required") && +$("#accountDetailId").val() == 0) {
        alertify.warning("تفصیل اجباری است").delay(alertify_delay);
        return;
    }
    let requestIdentity = +$("#requestId").val();
    if (conditionalProperties.isRequest && requestIdentity !== 0) {
        if (!checkRequestDate(requestIdentity)) {
            alertify.warning("تاریخ برگه باید بزرگتر، مساوی تاریخ درخواست باشد").delay(alertify_delay);
            return;
        }
    }


    header_update_NewTrasuryLine();
}
$("#headeUpdateModal").on("hidden.bs.modal", () => isLoadEdit = false);

function header_update_NewTrasuryLine() {

    var newModel = {};
    var swReturn = false;
    var element = $(`#${activePageId} #headeUpdateModal .modal-body .row`);
    newModel.id = id;

    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");
        var val = "";
        if (elm.data("value") != undefined) {
            val = elm.data("value");
        }
        else {
            if (elm.hasClass("money"))
                val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
            else if (elm.hasClass("decimal"))
                val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
            else if (elm.hasClass("number"))
                val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
            else if (elm.hasClass("str-number"))
                val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
            else if (elm.attr("type") == "checkbox")
                val = elm.prop("checked");
            else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
                val = +elm.val();
            else
                if (val !== null)
                    val = myTrim(elm.val());
        }
        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        if (val != "")
            newModel[elmid] = val;
    });
    if (swReturn)
        return;

    $.ajax({
        url: viewData_updrecord_header_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);
                headeUpdateModal_close();
                get_header();
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(4);
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
            error_handler(xhr, viewData_updrecord_header_url)
        }
    });
}

function checkRequestDate(id) {
    let value = $("#headerTransactionDatePersian").val(),
        shamsiTransactionDate = getShamsiTransactionDate(id),
        transactionDate = moment.from(value, 'fa', 'YYYY/MM/DD'),
        reqDate = moment.from(shamsiTransactionDate, 'fa', 'YYYY/MM/DD');

    transactionDate = transactionDate.format('YYYY/MM/DD');
    reqDate = reqDate.format('YYYY/MM/DD');
    let dateIsValid = moment(reqDate).isSameOrBefore(transactionDate, 'day');

    if (!dateIsValid)
        return false;

    return true;
}

function getShamsiTransactionDate(id) {
    let url = `${viewData_baseUrl_FM}/NewTreasuryApi/gettransactionDate`,
        output = $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(id),
            success: function (result) {
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return "";
            }
        });

    return output.responseText;
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
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "action", true, `${stageId}/${workflowId}/1/0`);
    $(`#${activePageId} #action`).val(+$("#formPlateHeaderTBody").data("actionid")).trigger("change");

    //گرفتن اطلاعات بانک یکی از لاین های چک، در صورت وجود لاین چک
    if (conditionalProperties.isBank) {
        getTreasuryLineBankInfo();
    }

    $("#filter_fundType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}/6`);

    configTreasuryElementPrivilage("ins-out", "load");
}

function getTreasuryLineBankInfo() {

    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/getTreasuryCheckBankInfo`;


    $.ajax({
        url: url,
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
            error_handler(xhr, url);
        }
    });
}

function after_insertLine() {
    configTreasuryElementPrivilage("", "reset");
}

function after_UpdateLine() {
    configTreasuryElementPrivilage("", "reset");
}

function update_action() {

    var currentActionId = +$("#formPlateHeaderTBody").data("actionid");
    var requestedActionId = +$("#action").val();

    if (currentActionId == requestedActionId)
        return;

    var model = {
        requestActionId: +$(`#${activePageId} #action`).val(),
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: stageId
    }

    let resultValidate = validateBeforSendTreasury(model);
    if (checkResponse(resultValidate)) {
        if (resultValidate.length == 0)
            sendDocument(model, () => {
                updateStatus(model);
            });
        else {
            alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
            $("#action").val(currentActionId);
        }
    }
}

function sendDocument(model, callBack) {
    let requestedStageStep = checkIsSendActionId(stageId, model.requestActionId), modelSend = {};

    let newmodel = {
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: +stageId,
        fromDatePersian: null,
        toDatePersian: null,

    }

    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            modelSend = [{
                id: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/treasurypost`
            }];
            sendDocPostingGroup(modelSend, () => { $(`#treasuryLinePage #action`).val($(`#treasuryLinePage #formPlateHeaderTBody`).data("actionid")) }, callBack);
        }
        else
            updateStatus(model);
    }
    else {
        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length !== 0) {
            modelSend =[{
                identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
                stageId: stageId
            }];
            undoDocPostingGroup(modelSend, () => { $(`#treasuryLinePage #action`).val($(`#treasuryLinePage #formPlateHeaderTBody`).data("actionid")) }, callBack);
        }
        else
            updateStatus(model);
    }

}

function checkIsSendActionId(stageId, requestActionId) {
    let model = {
        stageId: stageId,
        actionId: requestActionId
    }

    let url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
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

function updateStatus(model) {


    if (model.requestActionId > 0) {

        let url = `${viewData_baseUrl_FM}/NewTreasuryApi/updatestep`;

        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                afterUpdateStatus(result);
            },
            error: function (xhr) {
                error_handler(xhr, url);
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
    configTreasuryElementPrivilage(`.ins-out`, "load");
}

function showStepLogs() {
    stepLog();
    modal_show(`${activePageId} #stepLogModal`);
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistTreasuryLineId(+elm.val());
        if (checkExist)
            navigation_item_click(`/FM/NewTreasuryLine/${+elm.val()}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("شناسه در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function click_link_header(elm) {
    if ($(elm).data().id == "requestNo")
        navigation_item_click(`/FM/NewTreasuryLine/${+$(elm).text()}/${+$(`#treasuryLinePage #isDefaultCurrency`).val()}`);
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

function checkExistTreasuryLineId(id) {

    let url = `${viewData_baseUrl_FM}/NewTreasuryApi/checkexist`;

    let outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return outPut.responseJSON;

}

//#region stagePrevious
function add_requestLines() {
    var treasuryAction = getTreasuryStageActionConfig(id);
    updatedRequestId = treasuryAction.requestId;

    if (treasuryAction.treasuryIsPreviousStage || treasuryAction.isRequest) {
        var fundTypeParam = "";
        if (updatedRequestId > 0) {
            fundTypeParam = `${+id}/${updatedRequestId}/1`;
            if (!treasuryAction.requestIsLastConfirmHeader) {
                alertify.warning(`درخواست ${updatedRequestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
                return;
            }

        }
        else
            fundTypeParam = `${+id}/${updatedRequestId}/2`;

        fill_select2(`${viewData_baseUrl_FM}/NewTreasuryApi/requestfundtypegetdropdown`, "previousStagePageTable #form_keyvalue", true, fundTypeParam, false, 3, 'انتخاب', undefined, "", true);
        if (+$("#previousStagePageTable #form_keyvalue option:first").val() != 0)
            $("#previousStagePageTable #form_keyvalue").val($("#previousStagePageTable #form_keyvalue option:first").val()).trigger("change");
        else {
            var msgItem = alertify.warning("مبانی وجوه برگه مرجع و جاری همخوانی ندارد، به مدیر سیستم اطلاع دهید");
            msgItem.delay(alertify_delay);
        }
    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان افزودن از درخواست وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

$("#previousStageTreasuryLines").on("shown.bs.modal", function () {
    $("#previousStagePageTable table tbody tr").first().focus();
})


$("#previousStagePageTable #form_keyvalue").change(function () {
    get_requestStageLines();
})

function get_requestStageLines() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    arr_pagetables[index].selectedItems = [];
    var fundTypeId = +$("#previousStagePageTable #form_keyvalue").val();
    var lineFieldValues = {
        "fundTypeId": fundTypeId
    };

    var listType = updatedRequestId == 0 ? 2 : 1;
    var requestStageStepConfig = treasury_updateStageStepConfigModel(stageStepConfig, lineFieldValues);
    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(updatedRequestId);
    pagetable_formkeyvalue.push(fundTypeId);
    pagetable_formkeyvalue.push(+$("#isDefaultCurrency").val());
    pagetable_formkeyvalue.push(stageId);
    pagetable_formkeyvalue.push(listType);
    pagetable_formkeyvalue.push(branchId);
    pagetable_formkeyvalue.push(id);

    get_NewPageTable("previousStagePageTable", false, function (result) {
        modal_show(`previousStageTreasuryLines`);
    });
}

function fill_pagetable(result, pageId, callBack = undefined) {
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

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    var pagetable_highlightrowid = arr_pagetables[index].highlightrowid;

    pagetable_hasfilter(pageId, result.columns.hasFilter);

    var elm_pbody = $(`#${pageId} .pagetablebody`);
    elm_pbody.html("");

    var btn_tbidx = 1000;
    var str = "";

    str += '<thead>';
    str += '<tr>';
    if (pagetable_editable)
        str += '<th style="width:2%"></th>';
    if (pagetable_selectable)
        str += `<th style="width:2%;text-align:center !important"><input onchange="changeAll(this,'${pageId}')" class="checkall" type="checkbox"></th>`;
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
            var rowno = i + 1;
            var colno = 0;
            var colwidth = 0;
            for (var j = 0; j < columnsL; j++) {
                var primaries = "";
                for (var k = 0; k < columnsL; k++) {
                    var v = columns[k];
                    if (v["isPrimary"])
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
                    if (pagetable_editable)
                        str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                    if (pagetable_selectable) {
                        str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

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
                            resultClass = conditionalProperties.isDataEntry && !columns[j].isReadOnly ? "enable-requst-field" : "";
                            str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}" class="${resultClass}" style="width:${colwidth}%;">`;

                            if (columns[j].inputType == "select") {
                                str += `<select id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
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

                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask != null ? columns[j].inputMask.mask:""}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

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
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${+value != 0 && !isNaN(+value) ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
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
                                str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
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
                                        value = value.toString().split('.').join("/");
                                    }
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                }
                                else {
                                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                            }
                            else if (columns[j].type == 2) {
                                if (value)
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
                                if (!btn.isSeparator) {
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
                                if (!btn.isSeparator) {
                                    btn_tbidx++;
                                    str += `<button type="button" ${btn.isFocusInline ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
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

    //searchPlugin config
    searchPluginConfig(pageId, columns);

    //select2 config
    //select2Config(pageId);

    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pageId);

    if (pagetable_laststate == "" && pagetable_currentrow != 0) {
        var elm_pbody_row = elm_pbody.find(`tbody >  #row${pagetable_currentrow}`)
        if (elm_pbody_row[0] == undefined) {
            pagetable_currentrow = 1;
            arr_pagetables[index].currentrow = pagetable_currentrow;
        }

        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus();

        if (pagetable_editable)
            $(`td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:first,select:first").focus();
    }
    else if (pagetable_laststate == "" || pagetable_laststate == "nextpage") {
        pagetable_currentrow = 1;
        arr_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
    }
    else if (pagetable_laststate == "prevpage") {

        pagetable_currentrow = +elm_pbody.find("tbody > tr:last").attr("id").replace(/row/g, "");
        arr_pagetables[index].currentrow = pagetable_currentrow;

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
    }

    pagetable_laststate = "";

    $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    if (typeof $(`#header_${dataOrder.index}`).data() != "undefined") {
        $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;
    }


    if ($("#previousStageTreasuryLines .pagetablebody tbody input:not([type=checkbox])").length > 0)
        $("#previousStageTreasuryLines .pagetablebody tbody input:not([type=checkbox])").inputmask();

    if (typeof callBack != "undefined")
        callBack(result);
}

call_initFormTreasuryLine();

call_initform = call_initFormTreasuryLine;

//#endregion

function after_showHeaderModal() {

    let currentRequestId = $("#formPlateHeaderTBody").data("requestid");
    if (conditionalProperties.isTreasurySubject > 0) {
        $("#treasurySubjectId").attr("required", true);
        $("#treasurySubjectId").attr("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

        $("#treasurySubjectId").prop("disabled", (stageId == 35 || stageId == 49));
        $("#treasurySubjectId").empty();

        if (stageId == 35 || stageId == 49) {
            var data = getTreasuryRequestTreasurySubject(currentRequestId);
            var treasurySubjectOption = new Option(`${data.id} - ${data.name}`, data.id, true, true);
            $("#treasurySubjectId").append(treasurySubjectOption).trigger('change');
        }
        else {

            fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid/${stageId}/6/2`, "treasurySubjectId", true, 0, false, 0, 'انتخاب');
            $("#treasurySubjectId").val(conditionalProperties.isTreasurySubject).trigger("change.select2")
        }

    }
    else {
        $("#treasurySubjectId").removeAttr("required");
        $("#treasurySubjectId").removeAttr("data-parsley-selectvalzero");
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
        $("#treasurySubjectId").prop("disabled", true);
    }

    if (conditionalProperties.isRequest) {
        $("#requestId").attr("required", true);
        $("#requestId").attr("data-parsley-selectvalzero", true);
        $("#requestId").prop("data-parsley-checkglsglrequied", true);
        $("#transactionDatePersian").attr("data-parsley-dateissame", "");
    }
    else {
        $("#requestId").removeAttr("required");
        $("#requestId").removeAttr("data-parsley-selectvalzero");
    }

    $("#requestId").empty();

    let parentParameter = +currentRequestId == 0 ? null : currentRequestId;
    let identityParameter = id == 0 ? null : id;

    if (parentParameter != null) {
        fill_select2(`${viewData_baseUrl_FM}/NewTreasuryApi/treasuryrequest_getdropdown`, "requestId", true, `${branchId}/${stageId}/${parentParameter}/${identityParameter}`, false, 0, "انتخاب درخواست");
        $("#requestId").val(currentRequestId).prop("disabled", !conditionalProperties.isRequest).trigger("change.select2");
        $("#requestIdContainer").removeClass("displaynone");
    }





    $(`#accountGLId`).val(glSGLModel.accountGLId == 0 ? "" : `${glSGLModel.accountGLName}`);
    $(`#accountGLId`).data("value", glSGLModel.accountGLId);
    $(`#accountSGLId`).val(glSGLModel.accountSGLId == 0 ? "" : `${glSGLModel.accountSGLName}`);
    $(`#accountSGLId`).data("value", glSGLModel.accountSGLId);
    $(`#documentTypeId`).val(glSGLModel.documentTypeId == 0 ? "" : glSGLModel.documentTypeName);
    $(`#documentTypeId`).data("value", glSGLModel.documentTypeId);

    $(`#accountDetailId`).removeData("val");
    $(`#accountDetailId`).removeAttr("data-val");
    setTimeout(function () {
        if (glSGLModel.accountGLId !== 0 && glSGLModel.accountSGLId !== 0)
            fillAccountDetail(currentRequestId, glSGLModel.accountDetailId, glSGLModel.accountDetailRequired);
        else
            $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", true).val(0).trigger("change");
    }, 50)
}

function close_modal_stepLogs() {
    modal_close("stepLogModal");
}

function stepLog() {

    $("#stepLogRowsTreasury").html("");

    let url = `${viewData_baseUrl_FM}/NewTreasuryApi/gettreasurysteplist`;

    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$(`#${activePageId} #formPlateHeaderTBody`).data("id")),
        success: function (result) {

            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.stepDateTimePersian}</td></tr>`;
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
    loadingAsync(true, $(this).prop("id"));
    var treasuryAction = await getTreasuryStageActionConfig(id);
    if (treasuryAction.requestId > 0 && !treasuryAction.requestIsLastConfirmHeader) {
        alertify.warning(`درخواست ${treasuryAction.requestId} در حالت تائید شده نمیباشد ، مجاز به افزودن از درخواست نمی باشید.`).delay(alertify_delay);
        await loadingAsync(false, $(this).prop("id"))
        return;
    }

    await run_button_insert_PreviousStageLines();
})

function tr_save_row(pagetable_id, keycode) {
    after_save_row(pagetable_id, "success", keycode, false);
}


$("#previousStageTreasuryLines")
    .on("shown.bs.modal", function () {
        if (conditionalProperties.isBank)
            $("#bankAccountId,#bankId").prop("disabled", true);
    })
    .on("hidden.bs.modal", function () {
        if (conditionalProperties.isBank && $("#jsonTreasuryLineList #row1").length == 0)
            if ($("#haederLineActive").prop("disabled"))
                $("#bankAccountId,#bankId").prop("disabled", false);
    })


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
                //itemError = true;
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
    //if (id == 0) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
    var selectedItems = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        if ($(`#previousStagePageTable .pagetablebody > tbody > tr .editrow`).length == 0) {
            if (validate_lineTable() == 0) {
                selectedItems.forEach(function (value) {
                    var rowElems = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().find("td:not(:eq(1))").find("input,select"),
                        fundTypeId = +$(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("fundtypeid"),
                        inOut = +$(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("inout").split("-")[0],
                        bankAccountId = $(`#previousStagePageTable .pagetablebody > tbody > tr[data-id="${value.id}"]`).first().data("bankaccountid"),
                        isDefaultCurrency = +$(`#${activePageId} #isDefaultCurrency`).val(),
                        item = `
                                    { "id": ${value.id},
                                      "headerId":${+$("#formPlateHeaderTBody").data("id")},
                                      "parentId":${+$("#formPlateHeaderTBody").data("requestid")},
                                      "stageId":${+$("#formPlateHeaderTBody").data("stageid")},
                                      "bankAccountId":${typeof bankAccountId === 'undefined' ? null : +bankAccountId},
                                      "fundTypeId":${fundTypeId},
                                      "inOut":${inOut},${isDefaultCurrency == 1 ? `"currencyId":"${defaultCurrency}",` : ""}`;

                    for (var i = 0; i < rowElems.length; i++) {
                        var val = set_columnFormat($(rowElems[i]));
                        if (val != "" && val != 0 && val != null && val != undefined) {
                            var elemId = $(rowElems[i]).attr("id").split("_")[0];
                            if (elemId != "inOut") {
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

        insert_PreviousStageLinessAsync(data).then(
            (res) => {
                loadingAsync(false, $("#insertPreviousStageLine").prop("id"));
                if (res.validationErrors.length > 0) {
                    generateErrorValidation(res.validationErrors);
                }
                else {
                    var msgItem = alertify.success("اطلاعات با موفقیت ثبت شد");
                    msgItem.delay(alertify_delay);

                    close_modal_previousStageRequests();
                }
                var index = arr_pagetables.findIndex(v => v.pagetable_id == "previousStagePageTable");
                arr_pagetables[index].selectedItems = [];
                $(`#previousStagePageTable`).find("input[type='checkbox']").prop("checked", false);
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

function run_header_line_row_After_delete() {

    if (conditionalProperties.isBank) {
        if ($(`#jsonTreasuryLineList .pagetablebody tbody tr:not(#emptyRow,.font-15)`).length == 0) {
            $("#bankId").data().disabled = false;
            $("#bankId").data().notreset = false;
            $("#bankAccountId").data().disabled = false;
            $("#bankAccountId").data().notreset = false;
        }
    }
}

async function insert_PreviousStageLinessAsync(data) {

    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/insertpreviousstagelines`;

    let response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });

    return response;
}

async function loadingAsync(loading, elementId) {

    if (loading) {

        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true);
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
        $(`#${elementId}`).prop("disabled", false);
    }
}

function checkHasPreviousId(stageId, callBack = undefined) {

    let url = `/api/WFApi/stagehaspreviousid`;

    $.ajax({
        url: `${url}/${stageId}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            if (typeof callBack != 'undefined')
                callBack(result.data);

        },
        error: function (xhr) {
            error_handler(xhr, url);
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

function calcAmount(exchangeAmount, rowno = 0) {
    var exchangeRateId = rowno == 0 ? "exchangeRate" : `exchangeRate_${rowno}`;
    var exchangeRate = $(`#${exchangeRateId}`).length > 0 ? +removeSep($(`#${exchangeRateId}`).val()) : 1;
    var amountId = rowno == 0 ? "amountExchange" : `amountExchange_${rowno}`;
    if (exchangeAmount > 0 && exchangeRate > 0) {
        var amount = exchangeRate * exchangeAmount;
        let decimalprice = getIntegerAndDecimalNumber(amount, defaultRounding)[1];
        additionalData[6].value = decimalprice;

        $(`#${amountId}`).val(transformNumbers.toComma(amount));
    }
    else if (exchangeRate == 0) {
        $(`#${amountId}`).val(0);
    }
}

function after_navigationModalClose() {
    //headerLine_formkeyvalue = treasuryLine_formkeyvalue;
    headerLine_formkeyvalue = [];
    additionalData = [];
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

// Elements in modal update header
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
        if (+$(elm).val() !== 0)
            getGlSGLbyRequestId($(elm).val());

}

function getGlSGLbyRequestId(id,workflowCategoryId=0) {

    let url = `${viewData_baseUrl_FM}/WorkflowApi/getrequestglsglbyworkflowcategory/${workflowCategoryId}/${id}`;

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

                if (result.accountGLId !== 0 && result.accountSGLId !== 0)
                    fillAccountDetail(requestId, result.accountDetailId, result.AccountDetailRequired);
                else
                    $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).val(0).trigger("change");

                $(`#note`).val(result.note);
                var stageId = +$("#stageId").val();

                if (stageId == 35 || stageId == 49) {
                    var treasurySubjectOption = new Option(`${result.treasurySubjectId} - ${result.treasurySubjectName}`, result.treasurySubjectId, true, true);
                    $("#treasurySubjectId").append(treasurySubjectOption).trigger('change');
                }
            }
            else {
                $(`#accountGLId`).val("");
                $(`#accountSGLId`).val("");
                $("#accountDetailId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", true).val(0).trigger("change");
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
            setGlSglInfo(model, conditionalProperties.isRequest);
        }
        //else {
        //    model = {
        //        headerId: stageId,
        //        stageId: stageId,
        //        branchId: branchId,
        //    }
        //    setGlSglInfo(model, conditionalProperties.isRequest);
        //}
    }
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



            let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == "jsonTreasuryLineList");
            let headerColumn = arr_headerLinePagetables[index].headerColumns;

            if (allowTrigger)
                getStageStepConfig(null, headerColumn, null, "jsonTreasuryLineList");

            getTreasuryFundItemTypeInOut($(elem).val());

            break;
        case "currencyId":
            checkCurrency();
            break;
        case "bankId":
            fill_select2("/api/FM/BankAccountApi/getdropdown_bankId", "bankAccountId", true, $(elem).val(), false, 3, "", undefined, "", true, false, false, false, false)
            break;
        case "bankAccountId":

            if (conditionalProperties.isBank)
                refreshRequestLinesBtn();
            break;
    }
}

function getTreasuryFundItemTypeInOut(fundTypeId) {

    var lineId = $(`#treasuryLinePage #jsonTreasuryLineList .ins-out`).data("model.id");

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

async function getTreasuryLineFooter(id) {

    var p_url = `/api/FM/NewTreasuryLineApi/treasurylinefooter`;

    var response = await $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });

    return response;
}

function trOnclick(pg_name, elm, evt) {

    configAfterChange();

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");


    if (tr_clicked_rowno == pagetable_currentrow) {
        return;
    }

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

function tr_object_oninput(ev, elem) {

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

function treasury_updateStageStepConfigModel(stageStepConfig, lineFieldValues = null) {
    var result = JSON.parse(JSON.stringify(stageStepConfig));
    if (stageStepConfig != null) {

        if (stageStepConfig.headerFields != null && stageStepConfig.headerFields.length > 0) {
            for (var i = 0; i < stageStepConfig.headerFields.length; i++) {
                result.headerFields[i].fieldValue = $(`#${stageStepConfig.headerFields[i].fieldId}`).val();
            }
        }

        if (stageStepConfig.lineFields != null && stageStepConfig.lineFields.length > 0) {
            for (var i = 0; i < stageStepConfig.lineFields.length; i++) {
                result.lineFields[i].fieldValue = lineFieldValues[`${stageStepConfig.lineFields[i].fieldId}`];
            }
        }
    }
    return result;
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
            else if (pagetable_currentpage !== 1)
                pagetable_prevpage(pagetable_id);
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
            else if (pagetable_currentpage != pagetable_lastpage) {
                arr_pagetables[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
            }
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
            if ($(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td.enable-requst-field`).length === 0) return;
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
                                pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
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
            else if (elm.prop("tagName").toLowerCase() === "select") {

            }
        }

        else if (!pagetable_editable && !pagetable_tr_editing || pagetable_selectable) {
            ev.preventDefault();
            pagetable_currentcol = 1;

            var editMode = false;
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input", "select").each(function () {
                if (!$(this).prop("disabled") && $(this).attr("type") != "checkbox")
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
    if (e.keyCode == KeyCode.Esc) {


        if ($("#jsonTreasuryLineList").data("formReset") == undefined)
            configTreasuryElementPrivilage(".ins-out", "reset");

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

window.Parsley._validatorRegistry.validators.dateissamebonddue = undefined
window.Parsley.addValidator("dateissamebonddue", {
    validateString: function (value) {
        var bondDueDatePersianDate = moment.from(value, 'fa', 'YYYY/MM/DD');
        var treasuryDate = moment.from(getShamsiTransactionDate(id), 'fa', 'YYYY/MM/DD');
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
        navigation_item_click(`/FM/PostingGroupCartable/${stageId}`, 'کارتابل مالی');
}



function headerLineActive(pageId) {

    var treasuryAction = getTreasuryStageActionConfig(id);
    if (treasuryAction.isDataEntry || treasuryAction.isBank) {
        $(".ins-out").removeData();
        $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonTreasuryLineList')");
        configTreasuryElementPrivilage(`.ins-out`, "add");
    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

function checkEditOrDeletePermission() {
    var treasuryAction = getTreasuryStageActionConfig(id);
    return treasuryAction.isDataEntry;
}

function refreshRequestLinesBtn() {
    var dataEntryValue = $("#formPlateHeaderTBody").data("isdataentry");
    if (dataEntryValue == 1) {
        if (conditionalProperties.isPreviousStage == 1 || requestId > 0)
            change_addRequestLineBtn_disabled(false)
        else
            change_addRequestLineBtn_disabled(true)
    }
    else if (dataEntryValue == 2) {

        $(`#${activePageId} .pagetablebody  button.btn_delete`).prop("disabled", false);
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
function configTreasuryElementPrivilage(containerId, action = "load") {

    // اگر برگه isRequest=false باشد کلا غیرفعال می باشد اافزودن/ویرایش/لود اول
    // بدون در نظر گرفتن لود اول - ایجاد یا ویرایش
    // دکمه افزودن از درخواست اگر برگه تغییر پذیر باشد و درخواست باشد فعال می شود- در غیر اینصورت غیزفعال میشود

    $("#jsonTreasuryLineList").removeData();

    if (action == "load") {

        $("#jsonTreasuryLineList").data("formReset", true);

        if (conditionalProperties.isDataEntry) {
            $("#addRequestLines").prop("disabled", !conditionalProperties.isRequest);
        }
        else
            $("#addRequestLines").prop("disabled", true);

        $("#btn_header_update").prop("disabled", !conditionalProperties.isDataEntry);
        $("#haederLineActive").prop("disabled", !conditionalProperties.isDataEntry);
        $("#headerLineInsUp").prop("disabled", true);
        $("#jsonTreasuryLineList .pagetablebody button").prop("disabled", !conditionalProperties.isDataEntry);
        $(".ins-out .element-line").prop("disabled", true);

    }
    else if (action == "edit") {

        // بعد از کلیک دکمه ویرایش اگر isDataentry = true بود
        // افزودن از درخواست غیرفعال میشود
        // فعالسازی غیرفعال میشود
        // افزودن فعال میشود

        $("#addRequestLines").prop("disabled", true);
        $("#haederLineActive").prop("disabled", true);
        $("#headerLineInsUp").prop("disabled", !conditionalProperties.isDataEntry);
        $(".ins-out .row .element-line:not(#inOut,#fundTypeId)").prop("disabled", false);

        //var firstElement = $(`#${activePageId} ${containerId} ${containerId.indexOf("ins-out") == -1 ? 'th' : ''}`).find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)").first();
        //if (firstElement.length > 0) {
        //    if (firstElement.attr("class") != undefined && firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled")) {
        //        $(firstElement).select2("focus");
        //    }
        //    else
        //        $(firstElement).focus();
        //}
    }
    else if (action == "add") {

        // زمان افزودن
        // با کلیک دکمه فعالسازی
        // دکمه افزودن از درخواست غیرفعال میشود
        // دکمه فعالسازی غیرفعال میشود
        // دکمه افزودن فعال میشود اگر isdataEntry = true باشد


        $("#addRequestLines").prop("disabled", true);
        $("#haederLineActive").prop("disabled", true);
        $("#headerLineInsUp").prop("disabled", !conditionalProperties.isDataEntry);
        $(".ins-out .element-line:not(#inOut)").prop("disabled", false);
        $("#fundTypeId").select2("focus");
    }
    else if (action == "reset") {

        $("#addRequestLines").prop("disabled", conditionalProperties.isDataEntry && !conditionalProperties.isRequest);
        $("#haederLineActive").prop("disabled", !conditionalProperties.isDataEntry);
        $("#headerLineInsUp").prop("disabled", true);
        $(".ins-out .element-line").prop("disabled", true);

        $("#fundTypeId").prop('selectedIndex', 0).trigger("change");
        $(`#jsonTreasuryLineList #outLineElement .element-line`).prop("disabled", true);
        $(`#${activePageId} #jsonTreasuryLineList .ins-out > .row`).parsley().reset();

        $("#jsonTreasuryLineList").data("formReset", true);

    }

    if (action == "add" || action == "edit") {

        let firstElement = $(`#${activePageId} .ins-out`).find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)").first();

        if (firstElement.length > 0) {
            if (firstElement.attr("class") != undefined) {
                if (firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled"))
                    $(firstElement).select2("focus");
                else
                    $(firstElement).focus();
            }
        }

        //#region old policy privilage

        //// نمایش دکمه افزودن
        //$(`#${activePageId} #headerLineInsUp`).removeClass("d-none");

        //// فعالسازی/غیزقعالسازی دکمه ویرایش سربرگ
        //$(`#${activePageId} #header-div-content button`).prop("disabled", !(conditionalProperties.isDataEntry));


        //// اگر isBank=true باشد 
        //if (!conditionalProperties.isBank) {
        //    $("#fundTypeId").data("disabledinout", !privilageType)
        //    if (!privilageType)
        //        $("#fundTypeId").prop("selectedIndex", 0).trigger("change");
        //}

        //if (conditionalProperties.isDataEntry) {
        //    $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        //    $(`#${activePageId} .pagetablebody button`).prop("disabled", false);

        //    if (conditionalProperties.isPreviousStage == 1 || requestId > 0)
        //        $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
        //    else
        //        $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);

        //}
        //else {
        //    // اگر isdataentry 1/2 یا isBank=true
        //    if (conditionalProperties.isDataEntry || conditionalProperties.isBank)
        //        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        //    else
        //        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

        //    $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);
        //    $(`#${activePageId} .pagetablebody button`).prop("disabled", true);

        //    // اگر isdayaentry=2 بود - امکان حذف وجود ندارد
        //    if ($("#formPlateHeaderTBody").data("isdataentry") == 2) {

        //        $(`#${activePageId} .pagetablebody button.btn_delete`).prop("disabled", false);
        //        $(`#${activePageId} #headerLineInsUp`).addClass("d-none");

        //        if (conditionalProperties.isBank && +$("#bankAccountId").val() == 0)
        //            $(`#${activePageId} #addRequestLines`).prop("disabled", true).data("disabled", true);
        //        else if (conditionalProperties.isBank && +$("#bankAccountId").val() !== 0)
        //            $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
        //        else
        //            $(`#${activePageId} #addRequestLines`).prop("disabled", false).data("disabled", false);
        //    }
        //}

        //if (privilageType != null) {
        //    if (privilageType) {

        //        $("#haederLineActive").removeClass("pulse");
        //        $("#haederLineActive").removeAttr("title");

        //        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        //        $("#addRequestLines").prop("disabled", privilageType);
        //        $("#headerLineInsUp").prop("disabled", privilageType);

        //        if (conditionalProperties.isDataEntry || conditionalProperties.isBank) {

        //            for (var i = 0; i < allSelector.length; i++) {

        //                selector = $(allSelector[i]);

        //                if (allSelector[i].id != "") {

        //                    if (allSelector[i].id == "headerLineInsUp" || allSelector[i].id == "addRequestLines") {

        //                        if (selector.hasClass("select2-hidden-accessible")) {
        //                            if (!selector.data().disabled)
        //                                selector.prop("disabled", !privilageType);
        //                            if (!selector.data().notreset && containerId != "#header-div-content") {
        //                                selector.prop("selectedIndex", 0).trigger("change");
        //                                selector.val("0").trigger("change");
        //                            }
        //                        }
        //                        else if (selector.hasClass(".funkyradio")) {
        //                            if (!selector.data().disabled)
        //                                selector.prop("disabled", !privilageType);
        //                            if (!selector.data().notreset && containerId != "#header-div-content")
        //                                selector.prop("checked", false);
        //                        }
        //                        else if (selector.attr("id") == "addRequestLines") {
        //                            selector.prop("disabled", privilageType);
        //                        }
        //                        else {
        //                            if (!selector.data().disabled)
        //                                selector.prop("disabled", !privilageType);
        //                            if (!selector.data().notreset && containerId != "#header-div-content")
        //                                selector.val(``);
        //                        }

        //                    }

        //                }
        //            }
        //        }
        //        else
        //            configTreasuryElementPrivilage(".ins-out", false);

        //        setTimeout(() => {
        //            var firstElement = $(`#${activePageId} ${containerId} ${containerId.indexOf("ins-out") == -1 ? 'th' : ''}`).find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)").first();
        //            if (firstElement.length > 0) {
        //                if (firstElement.attr("class") != undefined && firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled")) {
        //                    $(firstElement).select2("focus");
        //                }
        //                else
        //                    $(firstElement).focus();
        //            }
        //        }, 200);
        //    }
        //    else {
        //        if ($("#formPlateHeaderTBody").data("isdataentry") == 2 && conditionalProperties.isBank && $("#jsonTreasuryLineList #row1").length == 0) {
        //            $("#haederLineActive").addClass("pulse");
        //            $("#haederLineActive").attr("title", "جهت افزودن از درخواست ، لطفا بانک و حساب بانکی را انتخاب نمایید");
        //        }
        //        else if ($("#jsonTreasuryLineList #row1").length > 0) {
        //            $("#haederLineActive").removeClass("pulse");
        //            $("#haederLineActive").removeAttr("title");
        //        }

        //        if (conditionalProperties.isDataEntry || (conditionalProperties.isBank && $("#jsonTreasuryLineList #row1").length == 0))
        //            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        //        else
        //            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

        //        for (var i = 0; i < allSelector.length; i++) {
        //            selector = $(allSelector[i]);

        //            if (selector.hasClass("select2-hidden-accessible")) {
        //                selector.prop("disabled", !privilageType);
        //                if (!selector.data().notreset && containerId != "#header-div-content") {
        //                    selector.prop("selectedIndex", 0).trigger("change");
        //                    selector.val("0").trigger("change");
        //                }
        //            }
        //            else if (selector.hasClass(".funkyradio")) {
        //                if (!selector.data().notreset && containerId != "#header-div-content")
        //                    selector.prop("checked", !privilageType);
        //            }
        //            else if (selector.attr("id") == "addRequestLines") {
        //                if (!selector.data().disabled)
        //                    selector.prop("disabled", privilageType);
        //            }
        //            else {
        //                selector.prop("disabled", !privilageType);
        //                if (!selector.data().notreset && containerId != "#header-div-content")
        //                    selector.val(``);
        //            }
        //        }
        //    }
        //}


        //#endregion
    }

}
configLineElementPrivilage = configTreasuryElementPrivilage;

$(`#${activePageId} #header-div-content`).on("focus", function () {

    if ($("#jsonTreasuryLineList").data("formReset") == undefined)
        configTreasuryElementPrivilage(".ins-out", "reset");
});


$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        if ($("#jsonTreasuryLineList").data("formReset") == undefined) {
            configTreasuryElementPrivilage(".ins-out", "reset");
        }
    }
});

//$(`#${activePageId} #jsonTreasuryLineList table`).on("focus", function (e) {

//    if ($("#jsonTreasuryLineList").data("formReset") == undefined) {
//        configTreasuryElementPrivilage(".ins-out", "reset");
//    }
//});

function run_header_line_row_moreInfo(id, rowno) {
    var row = $(`#jsonTreasuryLineList #row${rowno}`).data();
    $("#treasuryDetailRows").html("");
    var trString = `<tr><td>${row['model.bankissuer']}</td><td>${row['model.bankaccountissuer']}</td><td>${row['model.bondduedatepersian']}</td></tr>`;
    $("#treasuryDetailRows").append(trString);
    $("#treasuryLineDetailModal").modal("show");
}

//#region not used function

//function checkBankAccountInput(fundTypeId) {

//    $.ajax({
//        url: `/api/FMApi/getfundtypeinputmethod`,
//        async: false,
//        type: "post",
//        dataType: "json",
//        contentType: "application/json",
//        data: JSON.stringify(fundTypeId),
//        success: function (result) {

//            if (result == 2) {

//                $("#btn-search-bankAccountId").css("display", "none");
//                $("#bankAccountId").unbind("keydown");
//            }
//            else {

//                $("#btn-search-bankAccountId").css("display", "block");
//                $("#bankAccountId").unbind("keydown").bind("keydown", elemOnKeyDown);
//            }
//        },
//        error: function (xhr) {
//            if (callback != undefined)
//                callback();
//            error_handler(xhr, p_url);
//        }
//    });
//}

//async function resetFormWhenEnabled() {
//}

//function treasury_getStageStepConfigFieldTable(formKey, callBack = undefined) {
//    $.ajax({
//        url: getStageStepFieldTable_url,
//        data: JSON.stringify(formKey),
//        method: "POST",
//        dataType: "json",
//        contentType: "application/json",
//        success: function (res) {
//            if (res != null && res.data != null) {
//                if (typeof callBack != "undefined")
//                    callBack(res.data);
//            }
//        }
//    })
//}

//function checkRequestIsLastConfirmHeader(requestId) {

//    let url = `${viewData_baseUrl_FM}/NewTreasuryApi/requestislastconfirmheader`;

//    var result = $.ajax({
//        url: url,
//        type: "POST",
//        dataType: "json",
//        contentType: "application/json",
//        async: false,
//        data: JSON.stringify(requestId),
//        success: function (result) {
//            return JSON.parse(result);
//        },
//        error: function (xhr) {
//            error_handler(xhr, url);
//            return false;
//        }
//    });

//    return result.responseJSON;
//}

//# end

//*endregion

    //#endregion
