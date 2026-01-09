var viewData_form_title = "درخواست خزانه",
    viewData_controllername = "TreasuryRequestLineApi",
    viewData_getHeader_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getheader`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/display`,
    viewData_updrecord_header_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/updateinline`,
    viewData_getpagetableLine_url = `${viewData_baseUrl_FM}/${viewData_controllername}/gettreasuryrequestlinepage`,
    viewData_requestTreasuryLines_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrequestfilteritems`,
    accountDetailId = 0,
    workflowId = 0,
    branchId = 0,
    existTreasuryRequestline = 0,
    defaultCurrency = getDefaultCurrency(),
    defaultRounding = getRounding(defaultCurrency),
    headerLine_formkeyvalue = [],
    arr_headerLinePagetables = [],
    lastpagetable_formkeyvalue = [],
    glSGLModel = { accountGLId: 0, accountGLName: "", accountSGLId: 0, accountSGLName: "", accountDetailId: 0 },
    activePageId = "treasuryRequestLinePage";


headerLine_formkeyvalue.push($(`#${activePageId} #treasuryId`).val());
headerLine_formkeyvalue.push(+$(`#${activePageId} #isDefaultCurrency`).val());


//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonTreasuryRequestLineList",
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
    insRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/inserttreasuryrequestLine`,
    getRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyids`,
    upRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/updatetreasuryrequsetLine`,
    getsum_url: `${viewData_baseUrl_FM}/${viewData_controllername}/treasuryrequestlinesum`,
    delRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/deletetreasuryrequestLine`,
    getColumn_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/getrreasurylinecolumns`,
    pagetable_laststate: "",

};

arr_headerLinePagetables.push(pagelist1);

function call_initFormTreasuryRequestLine(header_Pagination = 0, elemId = undefined) {

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

async function callBackLineFill() {

    $("#haederLineActive").removeClass("pulse");

    $(`#${activePageId} #currencyId option[value='0']`).remove();
    var row1 = $("#jsonTreasuryRequestLineList #row1");
    if ($("#jsonTreasuryRequestLineList #row1").length > 0) {
        trOnclick("jsonTreasuryRequestLineList", row1, null);
    }
    else {

        configAfterChange();
        $("#bankId").val("0").trigger("change");
        $("#bankAccountId").val("0").trigger("change");

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

    $(`#${activePageId} #actionTreasuryRequest`).empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionTreasuryRequest", true, `${stageId}/${workflowId}/1/0/${branchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);
    $(`#${activePageId} #actionTreasuryRequest`).val(+$("#formPlateHeaderTBody").data("actionid")).trigger("change");
    $("#filter_fundType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}/6`);
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

async function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="excelTearsuryRequest()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="listTearsuryRequest()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa waves-effect' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width: 310px; margin-bottom: -13px; '>
                                                        <select style='width: 72%; float: right' class='form-control' id='actionTreasuryRequest'></select>
                                                            <button onclick='update_action()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa waves-effect' value=''>
                                                                <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                                <span style="margin-right:5px">ثبت گام</span>
                                                            </button>
                                                        </div>`);
    }

    $(`#${activePageId} #stageId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("stageid"));
    $(`#${activePageId} #workFlowId`).val(+$(`#${activePageId} #formPlateHeaderTBody`).data("workflowid"));

    stageId = +$(`#${activePageId} #stageId`).val();
    workflowId = +$(`#${activePageId} #workFlowId`).val();

    branchId = +$(`#${activePageId} #formPlateHeaderTBody`).data("branchid");
    conditionalProperties.isPreviousStage = +$(`#${activePageId} #formPlateHeaderTBody`).data("ispreviousstage");
    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
    conditionalProperties.isTreasurySubject = +$(`#${activePageId} #formPlateHeaderTBody`).data("treasurysubjectid");
    conditionalProperties.isRequest = +$(`#${activePageId} #formPlateHeaderTBody`).data("isrequest");
    conditionalProperties.isBank = +$(`#${activePageId} #formPlateHeaderTBody`).data("isbank");
    isDefaultActivateBtn = +$(`#${activePageId} #formPlateHeaderTBody`).data("isbank") == 1;
    glSGLModel.accountGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountglid");
    glSGLModel.accountGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountgl");
    glSGLModel.accountSGLId = +$(`#${activePageId} #formPlateHeaderTBody`).data("accountsglid");
    glSGLModel.accountSGLName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountsgl");
    glSGLModel.noSeriesId = $(`#${activePageId} #formPlateHeaderTBody`).data("noseriesid");

    var accountDetailName = $(`#${activePageId} #formPlateHeaderTBody`).data("accountdetail");

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

async function callBackHeaderColumnFill() {

    if ((isFormLoaded || header_pgnation > 0)) {

        $(`#${activePageId} #fundTypeId`).empty();
        public_tr_object_onchange($(`#${activePageId} #fundTypeId`), 'jsonTreasuryRequestLineList');

        fill_select2(`api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "fundTypeId", true, `${stageId}/6`);

        $(`#${activePageId} #fundTypeId`).val($("#fundTypeId option:first").val()).trigger("change");



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

function getRecordParameterFinalizeFunc(getRecordModel) {
    getRecordModel.isDefaultCurrency = +$("#isDefaultCurrency").val();
    return getRecordModel;
}

function excelTearsuryRequest() {
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

    configTreasuryRequestElementPrivilage(`.ins-out`, false);
    $("#filter_fundType").data("api", `api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/${stageId}/6`);
}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configTreasuryRequestElementPrivilage(containerId, privilageType = null) {

    $(`#${activePageId} #headerLineInsUp`).removeClass("d-none");
    $(`#${activePageId} #header-div-content button`).prop("disabled",
        !(conditionalProperties.isDataEntry || $("#formPlateHeaderTBody").data("isdataentry") == 2));

    if (!conditionalProperties.isBank) {
        $("#fundTypeId").data("disabledinout", !privilageType)
        if (!privilageType)
            $("#fundTypeId").prop("selectedIndex", 0).trigger("change");
    }

    if (conditionalProperties.isDataEntry) {
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
        $(`#${activePageId} .pagetablebody button`).prop("disabled", false);



    }
    else {
        if (conditionalProperties.isDataEntry || conditionalProperties.isBank)
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", false);
        else
            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);


        $(`#${activePageId} .pagetablebody button`).prop("disabled", true);

        if ($("#formPlateHeaderTBody").data("isdataentry") == 2) {
            $(`#${activePageId} .pagetablebody button#btn_delete`).prop("disabled", false);
            $(`#${activePageId} #headerLineInsUp`).addClass("d-none");


        }
    }
    if (privilageType != null) {
        var selector,
            allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp`);


        if (privilageType) {

            $("#haederLineActive").removeClass("pulse");
            $("#haederLineActive").removeAttr("title");

            $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
            if (conditionalProperties.isDataEntry || conditionalProperties.isBank) {
                lineSelectedId = 0;
                for (var i = 0; i < allSelector.length; i++) {
                    selector = $(allSelector[i]);
                    if (allSelector[i].id != "") {
                        if (selector.hasClass("select2-hidden-accessible")) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content") {
                                selector.prop("selectedIndex", 0).trigger("change");
                                selector.val("0").trigger("change");
                            }
                        }
                        else if (selector.hasClass(".funkyradio")) {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.prop("checked", false);
                        }

                        else {
                            if (!selector.data().disabled)
                                selector.prop("disabled", !privilageType);
                            if (!selector.data().notreset && containerId != "#header-div-content")
                                selector.val(``);
                        }
                    }
                }
            }
            else

                configTreasuryRequestElementPrivilage(".ins-out", false);

            setTimeout(() => {
                var firstElement = $(`#${activePageId} ${containerId} ${containerId.indexOf("ins-out") == -1 ? 'th' : ''}`).find("input:not(:disabled),select:not(:disabled),div.funkyradio:not(:disabled),select.select2:not(:disabled)").first();
                if (firstElement.length > 0) {
                    if (firstElement.attr("class") != undefined && firstElement.attr("class").indexOf("select2") != -1 && !firstElement.attr("disabled")) {
                        $(firstElement).select2("focus");
                    }
                    else
                        $(firstElement).focus();
                }
            }, 200);
        }
        else {
            if ($("#formPlateHeaderTBody").data("isdataentry") == 2 && conditionalProperties.isBank && $("#jsonTreasuryRequestLineList #row1").length == 0) {
                $("#haederLineActive").addClass("pulse");
                $("#haederLineActive").attr("title", "جهت افزودن از درخواست ، لطفا بانک و حساب بانکی را انتخاب نمایید");
            }
            else if ($("#jsonTreasuryRequestLineList #row1").length > 0) {
                $("#haederLineActive").removeClass("pulse");
                $("#haederLineActive").removeAttr("title");
            }

            if (conditionalProperties.isDataEntry || (conditionalProperties.isBank && $("#jsonTreasuryRequestLineList #row1").length == 0))
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", !conditionalProperties.isDataEntry);
            else
                $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);

            for (var i = 0; i < allSelector.length; i++) {
                selector = $(allSelector[i]);
                if (selector.hasClass("select2-hidden-accessible")) {
                    selector.prop("disabled", !privilageType);
                    if (!selector.data().notreset && containerId != "#header-div-content") {
                        selector.prop("selectedIndex", 0).trigger("change");
                        selector.val("0").trigger("change");
                    }
                }
                else if (selector.hasClass(".funkyradio")) {
                    if (!selector.data().notreset && containerId != "#header-div-content")
                        selector.prop("checked", !privilageType);
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

configLineElementPrivilage = configTreasuryRequestElementPrivilage;


function listTearsuryRequest() {
    if (!conditionalProperties.isCartable)
        navigation_item_click('/FM/TreasuryRequest', 'درخواست خزانه');
    else
        navigation_item_click(`/FM/TreasuryRequestCartable/${stageId}`, 'کارتابل درخواست');
}

function header_updateValidtion() {

    if ($("#accountDetailId").prop("required") && +$("#accountDetailId").val() == 0) {
        alertify.warning("تفصیل اجباری است").delay(alertify_delay);
        return;
    }


    header_update_TrasuryRequsetLine();
}

$('#displayTreasuryRequestLineModel').on("hidden.bs.modal", function (evt) {
    let pagetable = ""
    let switchUser = ""
    activePageTableId = "pagetable"
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = [switchUser, null];
});

function header_update_TrasuryRequsetLine() {

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
            if (result.successfull == true) {
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

}

function configAfterChange() {

    setTimeout(function () {
        if (!conditionalProperties.isAfterChange && !isFormLoaded) {

            configTreasuryRequestElementPrivilage(".ins-out", isAfterSave);
            isAfterSave = false;
        }
        else {
            $("#fundTypeId").select2("focus");
            conditionalProperties.isAfterChange = false;
        }
    }, 100)
}

function after_insertLine() {
    $(`#${activePageId} #fundTypeId`).trigger("change");
}

function after_UpdateLine() {
}
//*************************

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistTreasuryRequestLineId(+elm.val());
        if (checkExist)
            navigation_item_click(`/FM/TreasuryRequestLine/${+elm.val()}/${+$(`#treasuryRequestLinePage #isDefaultCurrency`).val()}`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistTreasuryRequestLineId(id) {

    var viewData_getTreasuryRequestCheckExist = `${viewData_baseUrl_FM}/TreasuryRequestApi/checkexist`;
    let outPut = $.ajax({
        url: viewData_getTreasuryRequestCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getTreasuryRequestCheckExist);
        }
    });
    return outPut.responseJSON;

}

function click_link_header(elm) {
    if ($(elm).data().id == "requestNo")
        navigation_item_click(`/FM/TreasuryRequestLine/${+$(elm).text()}/${+$(`#treasuryRequestLinePage #isDefaultCurrency`).val()}`);
    else if ($(elm).data().id == "journalId")
        navigateToModalJournal(`/FM/journal/journaldisplay/${+$(elm).text()}/${0}/${+$(`#treasuryRequestLinePage #isDefaultCurrency`).val()}`);
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

async function public_object_onchange(elm) {
    if (typeof elm === "undefined") return;

    var elmId = $(elm).attr("id");

    if (elmId === "treasurySubjectId") {

        var subjectIndex = additionalData.findIndex(x => x.name === "treasurySubjectId");
        if (subjectIndex != -1)
            additionalData[subjectIndex].value = +$("#formPlateHeaderTBody").data("treasurysubjectid");

        var model = {
            id: +$(elm).val(),
            stageId: +stageId,
            branchId: +branchId,
        };
        GetnoSeriesWhitGlSgl(model, 6);
    }
    if (elmId === "noSeriesId") {
        $("#accountDetailId").empty();
        getModuleListByNoSeriesIdUrl(+$(elm).val(), "accountDetailId");

    }
}

function GetnoSeriesWhitGlSgl(model, workflowCategoryId) {

    $.ajax({
        url: `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`,
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (result) {

            $("#noSeriesId").empty();
            $("#noSeriesId").prop("disabled", false).prop("required", true);
            if (typeof result !== "undefined" && result != null) {

                $("#accountGLId").empty();
                var accountGLId = new Option(`${result.accountGLId} - ${result.accountGLName}`, result.accountGLId, true, true);
                $("#accountGLId").append(accountGLId).trigger('change');

                $("#accountSGLId").empty();
                var accountSGLId = new Option(`${result.accountSGLId} - ${result.accountSGLName}`, result.accountSGLId, true, true);
                $("#accountSGLId").append(accountSGLId).trigger('change');

                fill_select2(`${viewData_baseUrl_GN}/NoSeriesLineApi/getdropdown_noseriesbyworkflowId`, "noSeriesId", true, `${+workflowCategoryId}/${+result.accountGLId}/${+result.accountSGLId}`, false, 0, "انتخاب گروه تفضیل");
                $("#noSeriesId").trigger("change");
            }


        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/TreasurySubjectApi/glsglinfo`);
        }
    });

}

function run_header_line_row_moreInfo(id, rowno) {
    var row = $(`#jsonTreasuryRequestLineList #row${rowno}`).data();
    $("#treasuryDetailRows").html("");
    var trString = `<tr><td>${row['model.bankissuer']}</td><td>${row['model.bankaccountissuer']}</td><td>${row['model.bondduedatepersian']}</td></tr>`;
    $("#treasuryDetailRows").append(trString);
    $("#jsonTreasuryRequestLineList").modal("show");
}

async function local_tr_object_onchange(elem, pageId) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");

    switch (elemId) {
        case "fundTypeId":
            if (elem.val() > 0)
                getTreasuryFundItemTypeInOut($(elem).val());
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

function getTreasuryFundItemTypeInOut(fundTypeId) {

    var lineId = $(`#${activePageId} #jsonTreasuryRequestLineList .ins-out`).data("model.id");

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

function run_header_line_row_After_delete() {

    if (conditionalProperties.isBank) {
        if ($(`#jsonTreasuryRequestLineList .pagetablebody tbody tr:not(#emptyRow,.font-15)`).length == 0) {
            $("#bankId").data().disabled = false;
            $("#bankId").data().notreset = false;
            $("#bankAccountId").data().disabled = false;
            $("#bankAccountId").data().notreset = false;
        }
    }
}

$(document).on("keydown", `#${activePageId} #formHeaderLine`, function (e) {
    if (e.keyCode == KeyCode.Esc) {
        if (+$("#fundTypeId").val() != $("#fundTypeId").prop("selectedIndex", 0).val())
            $("#fundTypeId").val($("#fundTypeId").prop("selectedIndex", 0).val()).trigger("change");

        configTreasuryRequestElementPrivilage(".ins-out", false);

    }
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printFromPlateHeaderLine();
    }

});

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configTreasuryRequestElementPrivilage(".ins-out", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configTreasuryRequestElementPrivilage(".ins-out", false);
    }
});
function printFromPlateHeaderLine() {

    let stageClassId = $("#formPlateHeaderTBody").data("stageclassid"),
        currentInOut = $("#formPlateHeaderTBody").data("currentinout"),
        treasuryId = $("#formPlateHeaderTBody").data("id"),
        reportTitle = $(`#formPlateHeaderTBody td:eq(4)`).text().split('-')[1];

    printDocumentTreasury(stageClassId, currentInOut, treasuryId, reportTitle);
}

function clearColumns() {
    $("#fundTypeId").val("");
    $("#bankAccountId").val("");
    $("#amount").val(0);
    $("#jsonTreasuryRequestLineList .ins-row").attr("data-hidden-discpercent", 0);
    $("#jsonTreasuryRequestLineList .ins-row").attr("data-hidden-vatper", 0);
    $("#treasuryRequestLinePage .ins-out").attr("data-hidden-discpercent", 0);
    $("#treasuryRequestLinePage .ins-row").attr("data-hidden-discpercent", 0);
}

function tr_object_onfocus(elem) {

    selectText(elem);
}

function tr_object_onkeydown(e, elem) {

}

function headerLineActive(pageId) {

    var treasuryAction = getTreasuryStageActionConfig(id);
    if (treasuryAction.isDataEntry || treasuryAction.isBank) {
        $(".ins-out").removeData();
        $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonTreasuryRequestLineList')");
        configTreasuryRequestElementPrivilage(`.ins-out`, true);
    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}
call_initFormTreasuryRequestLine();

call_initform = call_initFormTreasuryRequestLine;

function object_onfocus(elem) {
}

function object_onblur(elem) {
}

function object_onchange(elem) {
}

function object_onkeydown(e, elem) {
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

function checkEditOrDeletePermission(opr = "Upd") {

    var treasuryAction = getTreasuryStageActionConfig(id);

    if (opr == "Upd") {
        if (treasuryAction.isDataEntry == 1)
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
//#region  Action

function update_action() {

    var currentActionId = +$("#formPlateHeaderTBody").data("actionid");
    var workflowId = +$("#formPlateHeaderTBody").data("workflowid");
    var requestedActionId = +$("#actionTreasuryRequest").val();

    if (currentActionId == requestedActionId)
        return;

    var model = {
        requestActionId: +$(`#${activePageId} #actionTreasuryRequest`).val(),
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id"),
        stageId: stageId,
        workflowId: workflowId,
        workflowCategoryId: workflowCategoryIds.treasury.id
    }

    loadingAsync(true, "stepRegistration");

    setTimeout(() => {
        var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);

        if (stepPermissionid > 0) {
            let resultValidate = validateBeforSendTreasuryRequest(model);

            if (checkResponse(resultValidate)) {

                if (resultValidate.length == 0)
                    treasuryRequestUpdateStatus(model);
                else {
                    alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
                    $(`#${activePageId} #actionTreasuryRequest`).val(currentActionId);
                    loadingAsync(false, "stepRegistration");
                }
            }
            else
                loadingAsync(false, "stepRegistration");
        }
        else {
            loadingAsync(false, "stepRegistration");
            var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
            msgItem.delay(alertify_delay);
            $(`#actionTreasuryRequest`).val(currentActionId);
        }
    }, 10)



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

function treasuryRequestUpdateStatus(model) {
    if (model.requestActionId > 0) {
        $.ajax({
            url: `${viewData_baseUrl_FM}/TreasuryRequestApi/updatestep`,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                afterupdateStatusTreasuryRequest(result);
            },
            error: function (xhr) {
                loadingAsync(false, "stepRegistration", "");
                error_handler(xhr, viewData_updateTreasuryStep_url);
            }
        });
    }
    else {
        loadingAsync(false, "stepRegistration");
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
    }

}

function afterupdateStatusTreasuryRequest(result) {

    if (result.successfull) {
        alertify.success(result.statusMessage);
        get_header();
    }
    else {
        var data_action = $(`#${activePageId} #formPlateHeaderTBody`).data("actionid");
        $(`#${activePageId} #action`).val(data_action);
        let errorText = generateErrorString(result.validationErrors);
        alertify.error(errorText).delay(alertify_delay);
    }
    configTreasuryRequestElementPrivilage(`.ins-out`, false);
    loadingAsync(false, "stepRegistration");
}

function showStepLogs() {
    stepLogTreasuryRequest(id, stageId, workflowId);
    modal_show(`${activePageId} #stepLogModalTreasuryRequest`);
}

function close_modal_stepLogs() {
    modal_close("stepLogModalTreasuryRequest");
}

//#endregion