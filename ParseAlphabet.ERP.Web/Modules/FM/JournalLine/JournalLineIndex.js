var viewData_form_title = "تخصیص متغیرها - سند حسابداری",
    viewData_controllername = "JournalLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csvline`,
    viewData_getHeader_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getheader`,
    viewData_updrecord_header_url = `${viewData_baseUrl_FM}/JournalApi/updateinline`,
    viewData_getJournalCheckExist = `${viewData_baseUrl_FM}/JournalApi/checkexist`,
    viewData_getJournalBySystem = `${viewData_baseUrl_FM}/JournalApi/getbysystem`,
    viewData_JournalStepList_url = `${viewData_baseUrl_FM}/JournalApi/getjournalsteplist`,
    headerLine_formkeyvalue = [], arr_headerLinePagetables = [], bySystem = false,
    formTypeId = $("#fromType").val(),
    activePageId = "journalLinePage",
    id = 0,
    workflowJournal = 178,
    stageIdJournal = 56,
    onModalLoadFunction = undefined,
    conditionalProperties = {
        isCartable: false,
    };

headerLine_formkeyvalue.push($("#journalId").val());
headerLine_formkeyvalue.push($("#fromType").val());
//نمایش از تخصیص متغیر
headerLine_formkeyvalue.push("1");

// فیلدهایی مازادی که در زمان  ثبت سند حسابداری مورد نیاز می باشد
updateAdditionalData();
//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonJournalLineList",
    editable: true,
    selectable: false,
    hasRowIndex: false,
    endData: false,
    isSum: true,
    pageno: 0,
    pagerowscount: 100,
    currentpage: 1,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: null,
    headerType: "inline",
    getpagetable_url: `${viewData_baseUrl_FM}/${viewData_controllername}/getjournallinepage`,
    getsum_url: `${viewData_baseUrl_FM}/${viewData_controllername}/journallinesum`,
    insRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/insertJournalLine`,
    getRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyids`,
    saveValidationFunc: saveValidationFunction,
    upRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/updateJournalLine`,
    delRecord_Url: `${viewData_baseUrl_FM}/${viewData_controllername}/deleteJournalLine`,
    getfilter_url: `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterlinefilteritems`,
    pagetable_laststate: ""
};
arr_headerLinePagetables.push(pagelist1);

function accountGLSelected() {
    $("#accountSGLId").val("");
    accountSGLSelected();
}

function accountSGLSelected() {
    getSGLRequierd();
    $("#accountDetailId").val("");

    if (+$("#accountGLId").val() != 0)
        getName(+$("#accountGLId").val(), "accountGLName", "/api/FM/AccountGLApi/getname");
    else
        $("#accountGLName").text("");

    if (+$("#accountGLId").val() != 0 && +$("#accountSGLId").val() != 0) {
        var model = {
            id: $("#accountSGLId").val(),
            glid: $("#accountGLId").val()
        }
        getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname")
    }
    else
        $("#accountSGLName").text("");

    if (+$("#accountDetailId").val() != 0)
        getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname");
    else
        $("#accountDetailName").text("");

}

function call_initJournalLine(headerPagination = 0, elemId = undefined) {

    if (headerLine_formkeyvalue.length == 3) {
        headerLine_formkeyvalue.push(headerPagination);

    }
    else {
        headerLine_formkeyvalue[3] = headerPagination;
    }

    if (headerPagination == 0) {
        var bySystem = getJournalBySystem(+headerLine_formkeyvalue[0])

        if (bySystem) {
            alertify.warning("این شناسه در سیستم وجود ندارد").delay(alertify_delay);
            return;
        }

    }

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == "jsonJournalLineList");
    arr_headerLinePagetables[index].endData = false;
    InitForm(activePageId, true, callBackHeaderFill, null, callBackLineFill);
}

function updateAdditionalData() {
    additionalData = [
        { name: "headerId", value: headerLine_formkeyvalue[0] },
        { name: "stageId", value: stageIdJournal },
        { name: "workflowId", value: workflowJournal },
    ];
}

call_initJournalLine();
call_initform = call_initJournalLine;

//#region newCode
//, `#${activePageId} #formHeaderLine`
$(document).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrint(e)
});

function switchPrint(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        //چاپ سند حسابداری تاریخ ثبت
        printJournalSetting(1, $(`#formPlateHeaderTBody`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        //چاپ دفتر حسابداری کل معین تفصیل
        printJournalSetting(2, $(`#formPlateHeaderTBody`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        //چاپ دفتر معین
        printJournalSetting(3, $(`#formPlateHeaderTBody`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        //چاپ دفتر تفصیل
        printJournalSetting(4, $(`#formPlateHeaderTBody`));
    }
}

function printJournalSetting(type, rowElmn) {
    let reportParameters = [], repUrl = "", id = rowElmn.data("id"), documentNo = rowElmn.data("documentno"), reportModel = {}, reportName = "";
    let documentDate = rowElmn.data("headerdocumentdatepersian");

    if (type == 1) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByDateReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس تاریخ ثبت`
    }
    else if (type == 2) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByGlSGLReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس کل - معین - تفصیل`
    }
    else if (type == 3) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelSglReportPreview.mrt`;
        reportName = `چاپ در سطح معین`;
    }
    else if (type == 4) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelAccountDetailsReportPreview.mrt`;
        reportName = `چاپ در سطح تفصیل`
    }
    reportParameters = [
        { Item: "journalId", Value: id, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "documentNo", Value: documentNo, itemType: "Var" },
        { Item: "documentDate", Value: documentDate, itemType: "Var" },
    ];

    reportModel = {
        reportName: reportName,
        reportUrl: repUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function run_header_line_row_journalTrialBalance(pageId, rowNo, e) {
    navigateToModalTrialBalance(`/FM/JournalReport/JournalTrialBalance`);
}

function run_header_line_row_subSystemNone(pageId, rowNo, e) {
}

function clickModalJounal(type) {
    printJournalSetting(type, $(`#formPlateHeaderTBody`));
}

function printFromPlateHeaderLine() {
    $("#modal_keyid_journal_value").text($(`#formPlateHeaderTBody`).data("id"));
    modal_show(`PrnJournal`);
}

function callBackLineFill() {
    $("#amount").prop("disabled", true);
    $("#amount").data("disabled", "true");
    checkCurrency(true);

    $("#accountGLId").searchModal({
        searchUrl: "/api/FM/AccountGLApi/accountGLDropDownByUser",
        //modelItems: null,
        selectColumn: "id",
        column: [
            {
                id: "id",
                name: "شناسه",
                width: 20,
                isFilterParameter: true
            },
            {
                id: "name",
                name: "نام کل",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "accountCategoryName",
                name: "گروه حساب",
                width: 30
            },
        ],
        selectedCallBack: accountGLSelected,
        filter: " AND IsActive=1"
    });

    $("#accountSGLId").searchModal({
        searchUrl: "/api/FM/AccountSGLApi/accountSGLDropDownByUser",
        selectColumn: "id",
        //modelItems: [
        //    $("#accountGLId")
        //],
        column: [
            {
                id: "id",
                name: "شناسه",
                isFilterParameter: true
            },
            {
                id: "name",
                name: "نام معین",
                isFilterParameter: true
            },
            {
                id: "accountDetailRequiredTitle",
                name: "تنظیمات تفصیل"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId"
            },
        ],
        selectedCallBack: accountSGLSelected,
        filter: " AND IsActive=1",
        onclickFunction: () => onclickFunctionValid("accountSGLId")
    });

    $("#accountDetailId").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
        selectColumn: "id",
        column: [
            {
                id: "id",
                name: "شناسه",
                isFilterParameter: true,
                width: 5
            },
            {
                id: "name",
                name: "نام تفصیل",
                isFilterParameter: true,
                width: 10
            },
            {
                id: "noSeriesName",
                name: "گروه تفصیل",
                isFilterParameter: true,
                width: 10
            },
            {
                id: "idNumber",
                name: "شماره",
                isFilterParameter: true,
                width: 5
            },
            {
                id: "agentFullName",
                name: "نام نماینده",
                isFilterParameter: true,
                width: 15
            },
            {
                id: "jobTitle",
                name: "عنوان شغلی",
                isFilterParameter: true,
                width: 10
            },
            {
                id: "brandName",
                name: "نام تجاری",
                isFilterParameter: true,
                width: 10
            },
            {
                id: "partnerTypeStr",
                name: "نوع شخصیت",
                width: 10
            },
            {
                id: "includeVatStr",
                name: "مشمول مالیات ",
                width: 7
            },

            {
                id: "enableVatStr",
                name: "اعتبار مالیات",
                width: 7
            },
            {
                id: "nationalCode",
                name: "نمبر تذکره",
                isFilterParameter: true,
                width: 5
            },
            {
                id: "personGroupName",
                name: "گروه مشتری",
                isFilterParameter: true,
                width: 10
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountSGLId",
            }
        ],
        onclickFunction: () => onclickFunctionValid("accountDetailId"),
        form_KeyValue: [true],
        modalSize: "modal-size-xxlg"
    });

    $("#description").suggestBox({
        api: `/api/FM/JournalDescriptionApi/search`,
        paramterName: "name",
        suggestFilter: {
            items: [],
            filter: ""
        },
        inTable: true,
        form_KeyValue: [stageIdJournal]
    });

    var row1 = $("#jsonJournalLineList #row1");
    if ($("#jsonJournalLineList #row1").length > 0) {

        var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == "jsonJournalLineList");
        arr_headerLinePagetables[index].currentrow = 0;

        trOnclick("jsonJournalLineList", row1, null);
    }
    else
        setTimeout(function () {
            configTreasuryElementPrivilage(".ins-row", false);
        }, 100)


    $(`#${activePageId} #status`).empty();

    fill_dropdown(`${viewData_baseUrl_FM}/JournalStageActionApi/list`, "id", "name", "status", true, stageIdJournal);
    $(`#${activePageId} #status`).val(+$("#formPlateHeaderTBody").data("status")).trigger("change");

    bySystem = $(`#${activePageId} #formPlateHeaderTBody`).data("bysystem");
    chckBySystemsLines(bySystem);

    if (+$("#status").val() === 3) {
        $("#haederLineActive").data("disabled", true);

        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", true);
    }
    else {
        $("#haederLineActive").data("disabled", false);

        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", false);
    }

}

function onclickFunctionValid(id) {
    if (id == "accountSGLId") {

        if (+$("#accountGLId").val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $("#accountGLId").focus();
            return false;
        }

    }
    else if (id == "accountDetailId") {

        if (+$("#accountGLId").val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $("#accountGLId").focus();
            return false;
        }
        else if (+$("#accountSGLId").val() == 0) {
            alertify.warning("کد معین وارد نشده").delay(alertify_delay);
            $("#accountSGLId").focus();
            return false;
        }

    }
    return true;
}

function header_updateValidtion() {
    if (!bySystem)
        header_update();
    else
        alertify.warning("سند سیستمی است  وامکان انجام عملیات وجود ندارد").delay(alertify_delay);

}

function update_status() {

    loadingAsync(true, "stepRegistration", "");

    setTimeout(() => {
        updateStatus()
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

function updateStatus() {

    var model = {
        requestStepId: +$(`#${activePageId} #status`).val(),
        identityId: +$(`#${activePageId} #formPlateHeaderTBody`).data("id")
    }

    var url = `${viewData_baseUrl_FM}/JournalApi/updatestep`;

    if (model.requestStepId > 0) {
        $.ajax({
            url: url,
            async: true,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                loadingAsync(false, "stepRegistration", "");

                if (result.successfull) {
                    alertify.success(result.validationErrors[0]).delay(alertify_delay);

                    headerLine_formkeyvalue[3] = 0;

                    get_header();
                    if (+$(`#${activePageId} #formPlateHeaderTBody`).data("status") === 3) {
                        $("#btn_header_update").prop("disabled", true);

                        $("#haederLineActive").data("disabled", true);
                        $("#haederLineActive").prop("disabled", true);

                        $("#jsonJournalLineList .inputsearch-icon").prop("disabled", true);
                        $("#jsonJournalLineList thead tr.ins-row #headerLineInsUp").prop("disabled", true);
                        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", true);

                        $("#jsonJournalLineList thead tr.ins-row .form-control").val("").trigger("change").prop("disabled", true);
                    }
                    else {
                        $("#btn_header_update").prop("disabled", false);

                        $("#haederLineActive").data("disabled", false);
                        $("#haederLineActive").prop("disabled", false);

                        $("#jsonJournalLineList .inputsearch-icon").prop("disabled", true);
                        $("#jsonJournalLineList thead tr.ins-row #headerLineInsUp").prop("disabled", true);
                        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", false);

                        $("#jsonJournalLineList thead tr.ins-row .form-control").val("").trigger("change").prop("disabled", true);
                    }

                }
                else {
                    var data_status = $(`#${activePageId} #formPlateHeaderTBody`).data("status");
                    $(`#${activePageId} #status`).val(data_status);
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
                loadingAsync(false, "stepRegistration", "");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
        loadingAsync(false, "stepRegistration", "");
    }
}

function callBackHeaderFill() {

    if ($(`#${activePageId} #header-div .button-items #showStepLogs`).length == 0) {
        $(`#${activePageId} #header-div .button-items`).append(`<button onclick="journalLineExel()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
        $(`#${activePageId} #header-div .button-items`).append(`<button type="button" onclick="listJournal()" class="btn btn_green_1 waves-effect"><i class="fa fa-list-ul"></i>لیست</button>`)
        $(`#${activePageId} .button-items`).prepend("<button onclick='showStepLogs()' id='showStepLogs' type='button' class='btn btn-success ml-2 pa' value=''><i class='fas fa-history'></i>گام ها</button>");
        $(`#${activePageId} .button-items`).prepend(`<div style='display: inline-block;width:310px; margin-bottom: -13px; '>
                                                        <select style='width:70%; float: right' class='form-control' id='status'></select>
                                                        <button onclick='update_status()' id="stepRegistration" type='button' class='btn btn-success ml-2 pa' value=''>
                                                            <i class="fa fa-check-circle" style="padding:0!important;float:right;margin:2px"></i>
                                                            <span style="margin-right:5px">ثبت گام</span>
                                                        </button>
                                                    </div>`);
    }

    id = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");

}

function listJournal() {
    
    let stageId = stageIdJournal;
    if (!conditionalProperties.isCartable)
        navigation_item_click('/FM/Journal', 'اسناد حسابداری');
    else
        navigation_item_click(`/FM/PostingGroupCartable/${stageId}`, 'کارتابل اسناد');
}

function chckBySystemsLines(bySystem) {
    $("#journalLinePage #header-div-content button").prop("disabled", bySystem);
    $("#journalLinePage #header-lines-div button:not(.btn-default,#btnOpenFilter,.dropdown-item)").prop("disabled", bySystem);
    $("#journalLinePage #formHeaderLine .button-items div:eq(0) *").prop("disabled", bySystem);
    if (bySystem) {
        $("#journalLinePage #header-div-content button").data("disabled", true);
        $("#journalLinePage #header-lines-div button:not(.btn-default,#btnOpenFilterm,.dropdown-item)").data("disabled", true);
    }
}

function showStepLogs() {
    stepLog();
    modal_show(`${activePageId} #stepLogModal`);
}

function stepLog() {

    $("#stepLogRowsJournal").html("");

    $.ajax({
        url: viewData_JournalStepList_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$(`#${activePageId} #formPlateHeaderTBody`).data("id")),
        success: function (result) {

            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                $("#stepLogRowsJournal").append(`<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.stepName}</td><td>${data.userFullName}</td><td>${data.stepDateTimePersian}</td></tr>`);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_JournalStepList_url);
        }
    });
}

function close_modal_stepLogs() {
    modal_close("stepLogModal");
}

function journalLineExel() {
    let id = $('#formPlateHeaderTBody').data().id;

    let csvModel = {
        FieldItem: "",
        FieldValue: "",
        Form_KeyValue: [id, formTypeId]
    }
    let url = viewData_csv_url;
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

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistJournalLineId(+elm.val());
        if (checkExist) {
            var bySystem = getJournalBySystem(+elm.val());

            if (bySystem) {
                alertify.warning("برگه درخواستی سیستمی می باشد ، مجاز به ویرایش نمی باشید").delay(alertify_delay);
                return;
            }

            navigation_item_click(`/FM/JournalLine/${+elm.val()}/0/${+$(`#journalLinePage #fromType`).val()}`);
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }

}

function checkExistJournalLineId(id) {

    let outPut = $.ajax({
        url: viewData_getJournalCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getJournalCheckExist);
        }
    });
    return outPut.responseJSON;

}

function getJournalBySystem(id) {

    let outPut = $.ajax({
        url: viewData_getJournalBySystem,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getJournalBySystem);
            return false;
        }
    });
    return outPut.responseJSON;

}

function navigateToModalTrialBalance(href) {

    initialPage();
    $("#contentJournalTrialBalanceSearch #content-page").addClass("displaynone");
    $("#contentJournalTrialBalanceSearch #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            onModalLoadFunction = initModalForm;

            $(`#contentJournalTrialBalanceSearch`).html(result);

            modal_show(`journalTrialBalanceSearchModel`);

        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

}

function initModalForm() {

    $("#contentJournalTrialBalanceSearch #resetFilters").click();
    $("#contentJournalTrialBalanceSearch #loader").addClass("displaynone");
    $("#contentJournalTrialBalanceSearch #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentJournalTrialBalanceSearch #form,#contentJournalTrialBalanceSearch .content").css("margin", 0);
    $("#contentJournalTrialBalanceSearch #fromJournalId,#contentJournalTrialBalanceSearch #toJournalId").val(+$(`#${activePageId} #formPlateHeaderTBody`).data("id"));
    $("#contentJournalTrialBalanceSearch #fromDate,#contentJournalTrialBalanceSearch #toDate").val($("#formPlateHeaderTBody td:eq(3)").text());
    $("#contentJournalTrialBalanceSearch #noteGetReport").click();
}

function validationEditRow() {
    if (bySystem) {
        alertify.warning("سند سیستمی است  وامکان انجام عملیات وجود ندارد").delay(alertify_delay);
        return false;
    }
    return true;
}

function validationDeleteRow() {
    if (bySystem) {
        alertify.warning("سند سیستمی است  وامکان انجام عملیات وجود ندارد").delay(alertify_delay);
        return false;
    }
    return true;
}

//#endregion

function chekExistValue(value, url, id, ex = null) {

    if (ex != null) {
        ex.stopPropagation();
        ex.preventDefault();
    }

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(value),
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

function saveValidationFunction(modelData) {

    if (bySystem) {
        alertify.warning("سند سیستمی است  وامکان انجام عملیات وجود ندارد").delay(alertify_delay);
        return false;
    }

    var status = getSGLRequierd();
    var resultValidate = true;

    if (modelData != null) {
        if (+$("#accountGLId").val() != 0) {
            var existgl = chekExistValue($("#accountGLId").val(), `/api/FM/AccountGLApi/checkexistglid/1`, "accountGLId");
            if (existgl == 2) {
                var alertMsg = alertify.warning("کد کل غیر فعال می باشد");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountGLId").val("").focus();
                return resultValidate;
            }
            else if (existgl == 3) {
                var alertMsg = alertify.warning("کد کل تعریف نشده است");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountGLId").val("").focus();
                return resultValidate;
            }

        }
        else {
            var alertMsg = alertify.warning("کد کل وارد نشده");
            alertMsg.delay(alertify_delay);
            resultValidate = false;
            $("#accountGLId").focus();
            return resultValidate;
        }
        //----------
        if (+$("#accountSGLId").val() != 0) {
            var modelsgl = {
                id: $("#accountSGLId").val(),
                glid: $("#accountGLId").val(),
                isActive: 1

            };
            if (+modelsgl.glid == 0) {
                var alertMsg = alertify.warning("کد کل وارد نشده");
                alertMsg.delay(alertify_delay);
                $("#accountGLId").focus();
                return;
            }
            var existsgl = chekExistValue(modelsgl, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId");

            if (existsgl == 2) {
                var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountSGLId").focus().val("");
                return resultValidate;
            }
            else if (existsgl == 3) {
                var alertMsg = alertify.warning("کد معین تعریف نشده است");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountSGLId").focus().val("");
                return resultValidate;
            }
        }
        else {
            var alertMsg = alertify.warning("کد معین وارد نشده");
            alertMsg.delay(alertify_delay);
            resultValidate = false;
            $("#accountSGLId").focus();
            return resultValidate;
        }
        //----------
        if (+$("#accountDetailId").val() != 0) {
            var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId");
            if (exist == 2) {
                var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountDetailId").focus().val("");
                return resultValidate;
            }
            else if (exist == 3) {
                var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountDetailId").focus().val("");
                return resultValidate;
            }
        }
        else {
            if (status.accountDetailRequired == 1) {
                var alertMsg = alertify.warning("کد تفصیل  وارد نشده");
                alertMsg.delay(alertify_delay);
                resultValidate = false;
                $("#accountDetailId").focus();
                return resultValidate;
            }
        }

        //----------
        if ($("#description").val().trim() === "") {
            var alertMsg = alertify.warning("شرح سند را وارد نمایید");
            alertMsg.delay(alertify_delay);
            resultValidate = false;
            $("#description").focus();
            return resultValidate;
        }
        //----------
        if (modelData.amountCredit > 0 && modelData.amountDebit > 0) {
            var msg = alertify.error("نمیتوانید مقادیر بستانکار و بدهکار را همزمان وارد نمایید");
            msg.delay(alertify_delay);
            resultValidate = false;
            $("#amountDebit").focus();
            return resultValidate;
        }
        else if ((modelData.amountCredit == 0 || modelData.amountCredit == undefined) && (modelData.amountDebit == 0 || modelData.amountDebit == undefined)) {
            var msg = alertify.error("یکی از مقادیر بدهکار یا بستانکار را وارد نمایید");
            msg.delay(alertify_delay);
            resultValidate = false;
            $("#amountDebit").focus();
            return resultValidate;
        }

    }
    return resultValidate;
}

function trOnclick(pg_name, elm, evt) {
    setTimeout(function () {
        configTreasuryElementPrivilage(".ins-row", isAfterSave);
        isAfterSave = false;
    }, 100);

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
    
    var id = $(elm).data("model.id");
    fillJournalLineFooter(id);
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

                if (typeof tr_save_row2 === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowUp);
            }
            //else if (pagetable_currentpage !== 1)
            //    pagetablePrevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {

                if (typeof tr_save_row2 === "function")
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

                if (typeof tr_save_row2 === "function")
                    tr_save_rowHeaderLine(pagetable_id, KeyCode.ArrowDown);
            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                //arr_headerLinePagetables[index].currentrow = 1;
                //elm = $(`#row1`);
                //pagetableNextpage(pagetable_id);
            }
        }
    }

    var id = $(elm).data("model.id");

    fillJournalLineFooter(id);
}

function afterInsertLineHeaderLine() {
    let bySystem = $(`#${activePageId} #formPlateHeaderTBody`).data("bysystem");
    let status = +$(`#${activePageId} #formPlateHeaderTBody`).data("status");
    chckBySystemsLines(bySystem);

    if (status === 3) {
        $("#btn_header_update").prop("disabled", true);

        $("#haederLineActive").data("disabled", true);
        $("#haederLineActive").prop("disabled", true);

        $("#jsonJournalLineList .inputsearch-icon").prop("disabled", true);
        $("#jsonJournalLineList thead tr.ins-row #headerLineInsUp").prop("disabled", true);
        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", true);

        $("#jsonJournalLineList thead tr.ins-row .form-control").val("").trigger("change").prop("disabled", true);
    }
    else {
        $("#btn_header_update").prop("disabled", false);

        $("#haederLineActive").data("disabled", false);
        $("#haederLineActive").prop("disabled", false);

        $("#jsonJournalLineList .inputsearch-icon").prop("disabled", true);
        $("#jsonJournalLineList thead tr.ins-row #headerLineInsUp").prop("disabled", true);
        $("#jsonJournalLineList tbody tr button.btn,#jsonJournalLineList thead tr.ins-row #haederLineActive").prop("disabled", false);

        $("#jsonJournalLineList thead tr.ins-row .form-control").val("").trigger("change").prop("disabled", true);
    }
}

function fillJournalLineFooter(rowId) {

    getJournalLineFooter(rowId).then(function (data) {
        
        if (data != null) {
            $("#accountGLName").text(data.accountGLName);
            $("#accountSGLName").text(data.accountSGLName);
            $("#accountDetailName").text(data.accountDetailName);
            $("#accountCategoryName").text(data.accountCategoryName);
            $("#jobTitle").text(data.jobTitle);
            $("#userFullName").text(data.userFullName);
            $("#nationalCode").text(data.nationalCode);
            $("#createDateTimePersian").text(data.createDateTimePersian);
            $("#costDriveName").text(data.costDriverName);
            $("#vatEnableStr").text(data.vatEnableStr);
            $("#vatIncludeStr").text(data.vatIncludeStr);
            $("#noSeriesName").text(data.noSeriesName);
            $("#agentFullName").text(data.agentFullName);
            $("#brand").text(data.brand);
            $("#idNumber").text(data.idNumber);

        }
        else {
            $("#accountGLName").text("");
            $("#accountSGLName").text("");
            $("#accountDetailName").text("");
            $("#accountCategoryName").text("");
            $("#jobTitle").text("");
            $("#userFullName").text("");
            $("#nationalCode").text("");
            $("#createDateTimePersian").text("");
            $("#costDriveName").text("");
            $("#vatEnableStr").text("");
            $("#vatIncludeStr").text("");
            $("#noSeriesName").text("");
            $("#agentFullName").text("");
            $("#brand").text("");
            $("#idNumber").text("");
        }
    });
}

async function getJournalLineFooter(id) {

    var p_url = `/api/FM/JournalLineApi/journallinefooter`;

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

function object_onfocus(elem) {
    if ($(elem).attr("id") != "description")
        selectText($(elem));
}

function tr_object_onblur(pageId = '', elm, rowno = 0, colno = 0, ex = null) {

    var elem = $(elm);
    var elemId = $(elem).attr("id");
    switch (elemId) {
        case "amountDebit":
            if (+$("#fromType").val() == 2)
                calcAmount(+removeSep($("#amountDebit").val()));
            break;
        case "amountCredit":
            if (+$("#fromType").val() == 2)
                calcAmount(+removeSep($("#amountCredit").val()));
            break;
        case "accountGLId":

            if (+$("#accountGLId").val() != 0) {

                var exist = chekExistValue($("#accountGLId").val(), `/api/FM/AccountGLApi/checkexistglid/1`, "accountGLId", ex);
                if (exist == 1) {
                    var accessGLSGL = checkAccessGLSGL(+$("#accountGLId").val(), 0);
                    if (!accessGLSGL) {
                        var alertMsg = alertify.warning("دسترسی به کد کل انتخابی ندارید");
                        alertMsg.delay(alertify_delay);
                        $("#accountGLId").val("");
                    }
                }
                else if (exist == 2) {
                    var alertMsg = alertify.warning("کد کل غیر فعال می باشد");
                    alertMsg.delay(alertify_delay);
                    $("#accountGLId").val("");
                }
                else {
                    var alertMsg = alertify.warning("کد کل تعریف نشده است");
                    alertMsg.delay(alertify_delay);
                    $("#accountGLId").val("");
                }
            }
            getSGLRequierd();
            break;
        case "accountSGLId":
            if (+$("#accountSGLId").val() != 0) {
                var model = {
                    id: $("#accountSGLId").val(),
                    glid: $("#accountGLId").val(),
                    isActive: 1
                };
                if (+model.glid == 0) {
                    var alertMsg = alertify.warning("کد کل وارد نشده");
                    alertMsg.delay(alertify_delay);
                    $("#accountGLId").focus();
                    return;
                }
                var exist = chekExistValue(model, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId", ex);
                if (exist == 1) {

                    var accessGLSGL = checkAccessGLSGL(+$("#accountGLId").val(), 0);
                    if (!accessGLSGL) {
                        ex.preventDefault();
                        var alertMsg = alertify.warning("دسترسی به کد معین انتخابی ندارید");
                        alertMsg.delay(alertify_delay);
                        $("#accountSGLId").val("").focus();
                        return;
                    }
                }
                else if (exist == 2) {
                    var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                    alertMsg.delay(alertify_delay);
                    $("#accountSGLId").val("");
                }
                else {
                    var alertMsg = alertify.warning("کد معین تعریف نشده است");
                    alertMsg.delay(alertify_delay);
                    $("#accountSGLId").val("");
                }
            }

            getSGLRequierd();
            break;
        case "accountDetailId":

            if (+$("#accountDetailId").val() != 0) {
                var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId", ex);
                if (exist == 2) {
                    var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                    alertMsg.delay(alertify_delay);
                    $("#accountDetailId").val("");
                }
                else if (exist == 3) {
                    var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                    alertMsg.delay(alertify_delay);
                    $("#accountDetailId").val("");
                }
            }
            getSGLRequierd();
            break;
    }
}

function tr_object_oninput(ev, elm) {

    var elem = $(elm);
    var elemId = $(elem).attr("id");
    switch (elemId) {
        case "accountGLId":
            $("#accountSGLId,#accountDetailId").val("");
            $("#accountSGLName,#accountDetailName").text("");
            break;
        case "accountSGLId":
            $("#accountDetailId").val("");
            $("#accountDetailName").text("");
            break;
        default:
            break;
    }
}

function tr_object_onfocus(elem, ex) {
    if ($(elem).attr("id") != "description")
        selectText($(elem));
}

async function tr_object_onkeydown(ex, elm) {

    var elem = $(elm);
    var elemId = $(elem).attr("id");
    if (ex.keyCode === KeyCode.Esc) {
        $("#accountGLId").val("").prop("disabled", true)
        $("#btn-search-accountGLId").prop("disabled", true)
        $("#accountSGLId").val("").prop("disabled", true)
        $("#btn-search-accountSGLId").prop("disabled", true)
        $("#accountDetailId").val("").prop("disabled", true)
        $("#btn-search-accountDetailId").prop("disabled", true)
        $("#description").val("").prop("disabled", true)
        $("#amountDebit").val("").prop("disabled", true)
        $("#amountCredit").val("").prop("disabled", true)
        $("#headerLineInsUp").prop("disabled", true)
        $("#haederLineActive").prop("disabled", false)
        $("#currency").prop("disabled", true)
    }
    if (ex.keyCode === KeyCode.Enter || ex.keyCode === KeyCode.Tab) {
        ex.preventDefault();
        ex.stopPropagation();
        if (+formTypeId == 1) {
            if (ex.shiftKey && ex.keyCode === KeyCode.Tab)
                switch (elemId) {
                    case "accountSGLId":
                        getSGLRequierd();
                        if (+$("#accountSGLId").val() != 0) {
                            var model = {
                                id: $("#accountSGLId").val(),
                                glid: $("#accountGLId").val(),
                                isActive: 1
                            };
                            if (+model.glid == 0) {
                                var alertMsg = alertify.warning("کد کل وارد نشده");
                                alertMsg.delay(alertify_delay);
                                $("#accountGLId").focus();
                                return;
                            }
                            var exist = chekExistValue(model, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId", ex);
                            await getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname");
                        }


                        if (exist == 1) {

                            var accessGLSGL = checkAccessGLSGL(+$("#accountGLId").val(), +$("#accountSGLId").val());
                            if (!accessGLSGL) {
                                ex.preventDefault();
                                var alertMsg = alertify.warning("دسترسی به کد معین انتخابی ندارید");
                                alertMsg.delay(alertify_delay);
                                $("#accountSGLId").val("").focus();
                                return;
                            }

                            $("#accountGLId").focus();
                        }
                        else if (exist == 2) {
                            var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        else {
                            var alertMsg = alertify.warning("کد معین تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }

                        if ($("#accountSGLId").val() == "")
                            $("#accountSGLName").text("");

                        break;
                    case "accountDetailId":
                        if (+$("#accountDetailId").val() != 0)
                            var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId", ex);
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else {
                            $("#accountSGLId").focus();

                            await getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname");
                        }
                        if ($("#accountDetailId").val() == "")
                            $("#accountDetailName").text("");

                        break;
                    case "description":
                        if (!$("#accountDetailId").prop("disabled"))
                            $("#accountDetailId").focus();
                        else
                            $("#accountSGLId").focus();
                        break;
                    case "amountDebit":
                        $("#description").focus();
                        break;
                    case "amountCredit":
                        $("#amountDebit").focus();
                        break;
                    case "headerLineInsUp":
                        $("#amountCredit").focus();
                        break;
                }
            else
                switch (elemId) {
                    case "accountGLId":
                        getSGLRequierd();
                        if (+$("#accountGLId").val() != 0) {
                            var exist = chekExistValue($("#accountGLId").val(), `/api/FM/AccountGLApi/checkexistglid/1`, "accountGLId", ex);
                            await getName(+$("#accountGLId").val(), "accountGLName", "/api/FM/AccountGLApi/getname")
                        }

                        if (exist == 1) {
                            var accessGLSGL = checkAccessGLSGL(+$("#accountGLId").val(), 0);
                            if (!accessGLSGL) {

                                var alertMsg = alertify.warning("دسترسی به کد کل انتخابی ندارید");
                                alertMsg.delay(alertify_delay);
                                $("#accountGLId").focus().val("");
                            }
                            else {
                                $("#accountSGLId").focus();
                            }
                        }
                        else if (exist == 2) {
                            var alertMsg = alertify.warning("کد کل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountGLId").focus().val("");
                        }
                        else {
                            var alertMsg = alertify.warning("کد کل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountGLId").focus().val("");
                        }

                        if ($("#accountGLId").val() == "")
                            $("#accountGLName").text("");

                        break;
                    case "accountSGLId":
                        getSGLRequierd();
                        if (+$("#accountSGLId").val() != 0) {
                            var model = {
                                id: $("#accountSGLId").val(),
                                glid: $("#accountGLId").val(),
                                isActive: 1
                            };
                            if (+model.glid == 0) {
                                var alertMsg = alertify.warning("کد کل وارد نشده");
                                alertMsg.delay(alertify_delay);
                                $("#accountGLId").focus();
                                return;
                            }
                            var exist = chekExistValue(model, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId", ex);
                            await getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname")
                        }

                        if (exist == 1) {
                            var accessGLSGL = checkAccessGLSGL(+$("#accountGLId").val(), +$("#accountSGLId").val());
                            if (!accessGLSGL) {
                                ex.preventDefault();
                                var alertMsg = alertify.warning("دسترسی به کد معین انتخابی ندارید");
                                alertMsg.delay(alertify_delay);
                                $("#accountSGLId").val("").focus();
                                return;
                            }

                            if (!$("#accountDetailId").prop("disabled"))
                                $("#accountDetailId").focus();
                            else
                                $("#description").focus();
                        }
                        else if (exist == 2) {

                            var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        else {

                            var alertMsg = alertify.warning("کد معین تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }

                        if ($("#accountSGLId").val() == "")
                            $("#accountSGLName").text("");

                        break;
                    case "accountDetailId":
                        if (+$("#accountDetailId").val() != 0) {
                            var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId", ex);
                        }
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else {
                            $("#description").focus();

                            await getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname");
                        }
                        if ($("#accountDetailId").val() == "")
                            $("#accountDetailName").text("");

                        break;
                    case "description":
                        $("#amountDebit").focus();
                        break;
                    case "amountDebit":
                        $("#amountCredit").focus();
                        break;
                    case "amountCredit":
                        $("#headerLineInsUp").focus();
                        break;
                }
        }
        else {
            if (ex.shiftKey && ex.keyCode === KeyCode.Tab)
                switch (elemId) {
                    case "accountSGLId":
                        if (+$("#accountSGLId").val() != 0) {
                            getSGLRequierd();
                            var model = {
                                id: $("#accountSGLId").val(),
                                glid: $("#accountGLId").val(),
                                isActive: 1
                            };
                            if (+model.glid == 0) {
                                var alertMsg = alertify.warning("کد کل وارد نشده");
                                alertMsg.delay(alertify_delay);
                                $("#accountGLId").focus();
                                return;
                            }
                            var exist = chekExistValue(model, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId", ex);
                            await getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname");
                        }
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد معین تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        else {
                            $("#accountGLId").focus();
                        }

                        if ($("#accountSGLId").val() == "")
                            $("#accountSGLName").text("");

                        break;
                    case "accountDetailId":
                        if (+$("#accountDetailId").val() != 0)
                            var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId", ex);
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else {
                            $("#accountSGLId").focus();

                            await getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname");
                        }
                        if ($("#accountDetailId").val() == "")
                            $("#accountDetailName").text("");

                        break;
                    case "description":
                        if (!$("#accountDetailId").prop("disabled"))
                            $("#accountDetailId").focus();
                        else
                            $("#accountSGLId").focus();
                        break;
                    case "currency":
                        $("#description").focus();
                        break;
                    case "exchangeRate":
                        $("#currency").select2("focus");
                        break;
                    case "amountDebit":
                        if (!$("#exchangeRate").prop("disabled"))
                            $("#exchangeRate").focus();
                        else
                            $("#currency").select2("focus");
                        break;
                    case "amountCredit":
                        $("#amountDebit").focus();
                        break;
                    case "headerLineInsUp":
                        $("#amountCredit").focus();
                        break;
                }
            else
                switch (elemId) {
                    case "accountGLId":
                        getSGLRequierd();
                        if (+$("#accountGLId").val() != 0) {
                            var exist = chekExistValue($("#accountGLId").val(), `/api/FM/AccountGLApi/checkexistglid/1`, "accountGLId", ex);
                            await getName(+$("#accountGLId").val(), "accountGLName", "/api/FM/AccountGLApi/getname")
                        }

                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد کل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountGLId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد کل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountGLId").focus().val("");
                        }
                        else {
                            $("#accountSGLId").focus();
                        }

                        if ($("#accountGLId").val() == "")
                            $("#accountGLName").text("");

                        break;
                    case "accountSGLId":
                        if (+$("#accountSGLId").val() != 0) {
                            getSGLRequierd();
                            var model = {
                                id: $("#accountSGLId").val(),
                                glid: $("#accountGLId").val(),
                                isActive: 1
                            };
                            if (+model.glid == 0) {
                                var alertMsg = alertify.warning("کد کل وارد نشده");
                                alertMsg.delay(alertify_delay);
                                $("#accountGLId").focus();
                                return;
                            }
                            var exist = chekExistValue(model, `/api/FM/AccountSGLApi/checkexistsglid`, "accountSGLId", ex);
                            await getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname")
                        }
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد معین غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        if (exist == 3) {
                            var alertMsg = alertify.warning("کد معین تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountSGLId").focus().val("");
                        }
                        else {
                            if (!$("#accountDetailId").prop("disabled"))
                                $("#accountDetailId").focus();
                            else
                                $("#description").focus();

                        }
                        if ($("#accountSGLId").val() == "")
                            $("#accountSGLName").text("");

                        break;
                    case "accountDetailId":
                        if (+$("#accountDetailId").val() != 0) {
                            var exist = chekExistValue($("#accountDetailId").val(), `/api/FM/AccountDetailApi/checkexistaccountdetail/1`, "accountDetailId", ex);
                        }
                        if (exist == 2) {
                            var alertMsg = alertify.warning("کد تفصیل غیر فعال می باشد");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else if (exist == 3) {
                            var alertMsg = alertify.warning("کد تفصیل تعریف نشده است");
                            alertMsg.delay(alertify_delay);
                            $("#accountDetailId").focus().val("");
                        }
                        else {
                            $("#description").focus();

                            await getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname");
                        }
                        if ($("#accountDetailId").val() == "")
                            $("#accountDetailName").text("");

                        break;
                    case "description":
                        $("#currency").select2("focus");
                        break;
                    case "currency":
                        if (!$("#exchangeRate").prop("disabled"))
                            $("#exchangeRate").focus();
                        else
                            $("#amountDebit").focus();
                        break;
                    case "exchangeRate":
                        $("#amountDebit").focus();
                        break;
                    case "amountDebit":
                        $("#amountCredit").focus();
                        break;
                    case "amountCredit":
                        $("#headerLineInsUp").focus();
                        break;
                }
        }
    }
}

async function getName(value, nameId, url) {

    $.ajax({
        url: url,
        type: "post",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify(value),
        success: async function (result) {
            await $(`#${nameId}`).text(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
}

async function resetFormWhenEnabled() {

    $("#accountGLName").text("");
    $("#accountSGLName").text("");
    $("#accountDetailName").text("");
    $("#accountCategoryName").text("");
    $("#jobTitle").text("");
    $("#userFullName").text("");
    $("#nationalCode").text("");
    $("#createDateTimePersian").text("");
    $("#costDriveName").text("");

    getSGLRequierd();

    if (+$("#accountGLId").val() != 0)
        await getName(+$("#accountGLId").val(), "accountGLName", "/api/FM/AccountGLApi/getname")

    if (+$("#accountGLId").val() != 0) {
        var model = {
            id: $("#accountSGLId").val(),
            glid: $("#accountGLId").val()
        }
        await getName(model, "accountSGLName", "/api/FM/AccountSGLApi/getname")
    }

    if (+$("#accountDetailId").val() != 0)
        await getName(+$("#accountDetailId").val(), "accountDetailName", "/api/FM/AccountDetailApi/getname")


}

function after_showHeaderModal() {

}

function public_tr_object_onchange(elem) {

    var elem = $(elem);
    var elemId = $(elem).attr("id");

    switch (elemId) {
        case "currency":
            checkCurrency();
            break;
    }
}

function calcAmount(exchangeAmount) {
    if (exchangeAmount > 0 && +removeSep($("#exchangeRate").val()) > 0) {
        var amount = exchangeAmount / (+removeSep($("#exchangeRate").val()));
        $("#amount").val(transformNumbers.toComma(amount));
    }
    else if (+removeSep($("#exchangeRate").val()) == 0) {
        $("#amount").val(0);
    }
}

function checkCurrency(isformLoaded = false) {
    if ($("#currency").val() == getDefaultCurrency()) {
        $("#exchangeRate").prop("disabled", true);
        $("#exchangeRate").data("disabled", "true");
        $("#exchangeRate").val("1");
    }
    else if (!isformLoaded) {
        $("#exchangeRate").prop("disabled", false);
        $("#exchangeRate").removeData("disabled");
    }
}

function local_objectChange(elem) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");
}

function getSGLRequierd() {

    var model = {
        glId: +$("#accountGLId").val(),
        id: +$("#accountSGLId").val()
    }, resluteReqStatus = {};

    if (+$("#accountGLId").val() != 0 && +$("#accountSGLId").val() != 0) {
        resluteReqStatus = $.ajax({
            url: "/api/FM/AccountSGLApi/getsetting",
            async: false,
            cache: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result != null && result != undefined) {
                    if (result.accountDetailRequired == 1) {
                        $("#accountDetailId").data("parsley-required-message", "تفصیل اجباری است");
                        $("#accountDetailId").prop("required", true);
                        $("#accountDetailId").removeAttr("disabled");
                        $("#btn-search-accountDetailId").removeAttr("disabled");

                    }
                    else if (result.accountDetailRequired == 2) {
                        $("#accountDetailId").removeData("parsley-required-message");
                        $("#accountDetailId").prop("required", false);
                        $("#accountDetailId").removeAttr("disabled");
                        $("#btn-search-accountDetailId").removeAttr("disabled");
                    }
                    else {
                        $("#accountDetailId").removeData("parsley-required-message");
                        $("#accountDetailId").prop("required", false);
                        $("#accountDetailId").attr("disabled", "disabled");
                        $("#btn-search-accountDetailId").attr("disabled", "disabled");
                    }
                }
                if (checkResponse(result))
                    if (typeof result.accountDetailRequired != "undefined")
                        return result.accountDetailRequired;
                    else
                        return {};
                else
                    return {};
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return 0;
            }
        });
    }

    if ($("#accountDetailId").prop("disabled") == true) {
        $("#accountDetailId").val("");
        $("#accountDetailName").text("");
    }
    return resluteReqStatus.responseJSON;
}

function object_onblur(elem) {
}

function object_onchange(elem) {
}

function object_onkeydown(e, elm) {
}

function checkEditOrDeletePermission() {

    var journalAction = getJournalStageActionConfig(id);
    return journalAction.isDataEntry;
}

function headerLineActive(pageId) {
    var journalAction = getJournalStageActionConfig(id);
    if (journalAction.isDataEntry) {
        $(".ins-row").removeData();
        fillJournalLineFooter(0);
        $("#headerLineInsUp").attr("onclick", "headerLineIns('jsonJournalLineList')");
        configTreasuryElementPrivilage(`.ins-row`, true);
    }
    else {
        var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
        msgItem.delay(alertify_delay);
    }
}

/**
 * عملیات دسترسی المان های برگه
 * @param {any} containerId آیدی یا کلاس دیو پرنت
 * @param {any} privilageType نوع دسترسی => true:فعال/false:غیر فعال
 */
function configTreasuryElementPrivilage(containerId, privilageType) {
    $(`#${activePageId} #headerLineInsUp`).removeClass("d-none");

    var selector,
        allSelector = $(`#${activePageId} ${containerId} .form-control,
                         #${activePageId} ${containerId} .inputsearch-icon ,
                         #${activePageId} ${containerId} .select2 ,
                         #${activePageId} ${containerId} .funkyradio,
                         #${activePageId} ${containerId} #headerLineInsUp`);

    lineSelectedId = 0;

    $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", privilageType);

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
    if ($("#currency").val() == null)
        $("#currency").val(getDefaultCurrency()).trigger("change");
    if (privilageType) {

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

    if (+$(`#${activePageId} #formPlateHeaderTBody`).data("status") == 3) {
        $(`#${activePageId} #btn_header_update`).prop("disabled", true);
        $(`#${activePageId} ${containerId} #haederLineActive`).prop("disabled", true);
    }
}

configLineElementPrivilage = () => fillJournalLineFooter($("#jsonJournalLineList tbody tr.highlight").data("model.id"));

$(`#${activePageId} #header-div-content`).on("focus", function () {
    configTreasuryElementPrivilage(".ins-row", false);
})

$(`#${activePageId} #header-lines-div`).on("focus", function (e) {
    if (e.currentTarget.id === 'header-lines-div') {
        configTreasuryElementPrivilage(".ins-row", false);
    }
});

$("#headeUpdateModal").on("shown.bs.modal", function () {
    $("#documentNo").prop("disabled", true);
    $("#headerDocumentDatePersian").focus();

});
