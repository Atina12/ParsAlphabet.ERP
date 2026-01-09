
var viewData_controllername = "JournalReportApi";
var viewData_form_title = "گزارش تراز و دفاتر";
var viewData_PreviewReport_JournalDetailReportPreview = `${viewData_baseUrl_FM}/${viewData_controllername}/JournalDetailReportPreview`;
//var viewData_PreviewReport_NoteNewsPaperAccount_DetailReport = `${viewData_baseUrl_FM}/${viewData_controllername}/notenewspaperaccountdetailpreview`;
var viewData_PreviewReport_GetHeader = `${viewData_baseUrl_FM}/${viewData_controllername}/levelGlGetColumns`;
var viewData_PreviewReport_AccountGlGetColumn = `${viewData_baseUrl_FM}/${viewData_controllername}/accountglcolumns`;
var viewData_PreviewReport_AccountDetailGetColumn = `${viewData_baseUrl_FM}/${viewData_controllername}/accountdetailcolumns`;
//var viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getrecordbyid`;
var viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/repjournalsearchcsv`;
var viewData_ReportJsonForTree_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getJournalTrialReportJsonForTree`;
var viewData_PreviewReport_GetReport = "";/* onModalLoadFunction = undefined;*/
var defaultGetResult = false, firstNodeOpened = false, nodeTabIndex = 100, isLevelReport = false, levelGlId = 0, levelSglId = 0, mainReportType = 0;
var accountGl = "", accountSgl = "", accountDetail = "", levelOffices = "", reportTypeForLevel = "", levelGetReportForNextAndPrevious = null, reportTitleForExelPrint = "",
    affectedDebitSum = -1, affectedCreditSum = -1, affectedRemainingSum = -1;
var saveFunctionsTrees = { funcName: null, func: null, currentId: null }, trackingTree = { glId: 0, sglId: 0, detailsId: 0 }, isNext = false;
var levelGlCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/levelglcsv`,
    levelGlStimulUrl = `${stimulsBaseUrl.FM.Prn}LevelGLId_DetailReportPreview.mrt`,
    levelSglCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/levelsglcsv`,
    levelSglStimulUrl = `${stimulsBaseUrl.FM.Prn}LevelSGLId_DetailReportPreview.mrt`,
    levelAccountDetailCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/levelaccountdetailcsv`,
    levelAccountDetailStimulUrl = `${stimulsBaseUrl.FM.Prn}LevelAccountDetail_DetailReportPreview.mrt`,
    noteGlCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/noteglcsv`,
    noteGlStimulUrl = `${stimulsBaseUrl.FM.Prn}NoteGLId_DetailReportPreview.mrt`,
    noteSglCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/notesglcsv`,
    noteSglStimulUrl = `${stimulsBaseUrl.FM.Prn}NoteSGLId_DetailReportPreview.mrt`,
    noteAccountDetailCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/noteaccountdetailcsv`,
    noteAccountDetailStimulUrl = `${stimulsBaseUrl.FM.Prn}NoteAccountDetailId_DetailReportPreview.mrt`,
    noteNewsPaperCsvUrl = `${viewData_baseUrl_FM}/${viewData_controllername}/notenewspapercsv`,
    noteNewsPaperStimulUrl = `${stimulsBaseUrl.FM.Prn}NoteNews_DetailReportPreview.mrt`,
    parameters = [],
    roleId = getRoleId();
    fromDocumentDate1 = null,
    toDocumentDate1 = null;
var reportParameters = [];
var reportUrl = "";
var form = $('#JournalVoucherSearch').parsley();



function initJournalTrialBalanceSearchReport() {

    $("#stimul_preview")[0].onclick = null;

    $(".select2").select2()

    $("#fromDocumentDate").inputmask();
    $("#toDocumentDate").inputmask();

    kamaDatepicker('fromDocumentDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toDocumentDate', { withTime: false, position: "bottom" });

    $('#columnType').bootstrapToggle();
    $('#columnTypeForPrintAndExel').bootstrapToggle();

    resizableConfig()

    JournalTrialBalanceSearchReportLoadDropdown()

    getHeaderColumns();

    searchModalConfig()

    $("#reportType").trigger("change")

    //$("#JournalVoucherSearch select").prop("selectedIndex", 0).trigger("change");

    $(".card-body").children().first().children().children(".form-control").focus();

    if (typeof onModalLoadFunction !== 'undefined') {
        onModalLoadFunction();
        onModalLoadFunction = undefined
    }
    
}

function resizableConfig() {
    $("table#pagetable th").resizable({
        handles: "w",
        minWidth: 40,
        resize: function (event, ui) {
            var sizerID = "#" + $(event.target).attr("id") + "-sizer";
            $(sizerID).width(ui.size.width);
        }
    });
} 

function JournalTrialBalanceSearchReportLoadDropdown() {

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_FM}/DocumentTypeApi/getdropdownbysystem`, "journalDocumentTypeId", true);
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true);
    fill_select2(`/api/GN/UserApi/getdropdown`, "createUserId", true, "2/false/false", false);
   
    fill_select2(`api/FMApi/costobject_getdropdown`, "fromCostObjectId", true);
    fill_select2(`api/FMApi/costobject_getdropdown`, "toCostObjectId", true);


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `56/178/2/2/null/${workflowCategoryIds.journal.id}/false/3`);
}

$("#branchId").change(function () {

    let branchId = $(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = workflowCategoryIds.journal.id;

    $("#actionId").empty();
    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `56/178/2/2/${branchId}/${workFlowCategoryId}/false/3`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);

});

function searchModalConfig() {

    $("#toAccountGLId").searchModal({
        searchUrl: "/api/FM/AccountGLApi/search",
        modelItems: null,
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
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },
        ],

    })

    $("#fromAccountGLId").searchModal({
        searchUrl: "/api/FM/AccountGLApi/search",
        modelItems: null,
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
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },
        ],
    })

    $("#toAccountSGLId").searchModal({
        searchUrl: "/api/FM/AccountSGLApi/accountsglcategorydropdown",
        //modelItems: [
        //    $("#toAccountGLId")
        //],
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
                name: "نام معین",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "accountGL",
                name: " کل",
                width: 30,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
            {
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },

        ],
        onclickFunction: () => onclickFunctionValidRep("accountSGLId")
    })

    $("#fromAccountSGLId").searchModal({
        searchUrl: "/api/FM/AccountSGLApi/accountsglcategorydropdown",
        //modelItems: [
        //    $("#fromAccountGLId")
        //],
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
                name: "نام معین",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "accountGL",
                name: " کل",
                width: 30,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountSGLId")
    })

    $("#toAccountDetailId").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
        selectColumn: "id",
        column: [
            {
                id: "id",
                name: "شناسه",
                width: 5,
                isFilterParameter: true
            },
            {
                id: "name",
                name: "نام تفصیل",
                width: 10,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
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
                id: "toAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountSGLId",
                idInput: "fromAccountSGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountSGLId"
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })

    $("#fromAccountDetailId").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
        selectColumn: "id",
        column: [
            {
                id: "id",
                name: "شناسه",
                width: 5,
                isFilterParameter: true
            },
            {
                id: "name",
                name: "نام تفصیل",
                width: 10,
                isFilterParameter: true
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
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountSGLId",
                idInput: "fromAccountSGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountSGLId"
            },

        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })

    $("#toAccountGLIdPrint").searchModal({
        searchUrl: "/api/FM/AccountGLApi/search",
        modelItems: null,
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
        ],

    })

    $("#fromAccountGLIdPrint").searchModal({
        searchUrl: "/api/FM/AccountGLApi/search",
        modelItems: null,
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
        ],
    })

    $("#toAccountSGLIdPrint").searchModal({
        searchUrl: "/api/FM/AccountSGLApi/accountsglcategorydropdown",
        //modelItems: [
        //    $("#toAccountGLId")
        //],
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
                name: "نام معین",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "accountGL",
                name: " کل",
                width: 30,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },

        ],
        onclickFunction: () => onclickFunctionValidRep("accountSGLId")
    })

    $("#fromAccountSGLIdPrint").searchModal({
        searchUrl: "/api/FM/AccountSGLApi/accountsglcategorydropdown",
        //modelItems: [
        //    $("#fromAccountGLId")
        //],
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
                name: "نام معین",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "accountGL",
                name: " کل",
                width: 30,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountSGLId")
    })

    $("#toAccountDetailIdPrint").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
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
                name: "نام تفصیل",
                width: 30,
                isFilterParameter: true
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                id: "noSeriesName",
                name: "گروه تفصیل",
                isFilterParameter: true,
                width: 30
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountSGLId",
                idInput: "fromAccountSGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountSGLId"
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })

    $("#fromAccountDetailIdPrint").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
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
                name: "نام تفصیل",
                width: 30,
                isFilterParameter: true
            },
            {
                id: "noSeriesName",
                name: "گروه تفصیل",
                isFilterParameter: true,
                width: 30
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountGLId",
                idInput: "fromAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "accountSGLId",
                idInput: "fromAccountSGLId"
            },
            {
                isDtParameter: false,
                isFilterParameter: true,
                id: "toAccountSGLId"
            },

        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })

    $("#fromAccountGLId").val("1");
    $("#toAccountGLId").val("999");
    $("#fromAccountSGLId").val("1");
    $("#toAccountSGLId").val("9999");
    $("#fromAccountDetailId").val("");
    $("#toAccountDetailId").val("");

}

function onclickFunctionValidRep(id) {

    if (id == "accountSGLId") {

        if (+$("#fromAccountGLId").val() == 0 || +$("#toAccountGLId").val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $("#fromAccountGLId").focus();
            return false;
        }
        else if (+$("#fromAccountGLId").val() > +$("#toAccountGLId").val()) {
            alertify.warning("رنج کد کل صحیح وارد نشده").delay(alertify_delay);
            $("#fromAccountGLId").focus();
            return false;
        }
    }
    else if (id == "accountDetailId") {

        if (+$("#fromAccountGLId").val() == 0 || +$("#toAccountGLId").val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $("#fromAccountGLId").focus();
            return false;
        }
        else if (+$("#fromAccountGLId").val() > +$("#toAccountGLId").val()) {
            alertify.warning("رنج کد کل صحیح وارد نشده").delay(alertify_delay);
            $("#fromAccountGLId").focus();
            return false;
        }

        if (+$("#fromAccountSGLId").val() == 0 || +$("#toAccountSGLId").val() == 0) {
            alertify.warning("کد معین وارد نشده").delay(alertify_delay);
            $("#fromAccountSGLId").focus();
            return false;
        }
        else if (+$("#fromAccountSGLId").val() > +$("#toAccountSGLId").val()) {
            alertify.warning("رنج کد معین صحیح وارد نشده").delay(alertify_delay);
            $("#fromAccountSGLId").focus();
            return false;
        }

    }
    return true;
}

async function levelGetReport() {

    reportTitleForExelPrint = 'level'
    affectedCreditSum = -1;
    affectedDebitSum = -1;
    affectedRemainingSum = -1;

    callbackPerRequest = undefined;

    if (levelGetReportForNextAndPrevious == null)
        levelGetReportForNextAndPrevious = "next"
    //if (!isLevelReport) {
    levelGlId = 0;
    levelSglId = 0;
    //}


    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;
    setTitleReport(reportTitleForExelPrint)

    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {
            if (res) {
                defaultGetResult = false;
                loadingAsync(true, "levelAndNoteGetReport", "fas fa-sticky-note");
                GetReport();
                isLevelReport = true;
            }
            else {
                var msg = alertify.error('بازه تاریخ سند در محدوده سال مالی نمی باشد');
                msg.delay(alertify_delay);
                return;
            }
        })
    }
    else {
        reportTypeForLevel = $("#reportType").val()
        //if (reportTypeForLevel == 1) {
        //    $("#fromAccountGLId").val(1).trigger("change");
        //    $("#toAccountGLId").val(999).trigger("change");
        //    $("#fromAccountSGLId").val(1).trigger("change");
        //    $("#toAccountSGLId").val(9999).trigger("change");
        //}

        levelOffices = "level"
        defaultGetResult = false;
        await loadingAsync(true, "levelAndNoteGetReport", "fas fa-sticky-note");
        await GetReport();
        isLevelReport = true;

    }
}

async function noteGetReport() {

    reportTitleForExelPrint = 'note'
    //if (isLevelReport) {
    levelGlId = 0;
    levelSglId = 0;
    //}

    affectedCreditSum = -1;
    affectedDebitSum = -1;
    affectedRemainingSum = -1;

    callbackPerRequest = setAffectedValuePerRequest;

    var validate = form.validate();
    if (!validate) return;

    setTitleReport(reportTitleForExelPrint)

    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {
            if (res) {
                defaultGetResult = false;
                loadingAsync(true, "levelAndNoteGetReport", "fas fa-sticky-note");
                GetNoteReport();
                isLevelReport = false;
            }
            else {
                var msg = alertify.error('تاریخ سند در بازه معتبر نمیباشد');
                msg.delay(alertify_delay);
                return;
            }
        });
    }
    else {
        levelOffices = "offices"
        defaultGetResult = false;
        await loadingAsync(true, "levelAndNoteGetReport", "fas fa-sticky-note");
        await GetNoteReport();
        isLevelReport = false;
    }
}

function documentDateValid(callBack = undefined) {
    $.ajax({
        url: viewData_fiscalYearGetReccord,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$("#fiscalId").val()),
        success: function (result) {
            
            var fiscalStartDate = +result.startDatePersian.replace(/\//g, "");
            var fiscalEndDate = +result.endDatePersian.replace(/\//g, "");
            var fromDocumentDate = +$("#fromDocumentDate").val().replace(/\//g, "");
            var toDocumentDate = +$("#toDocumentDate").val().replace(/\//g, "");
            if ((fromDocumentDate <= fiscalEndDate && fromDocumentDate >= fiscalStartDate) && (toDocumentDate <= fiscalEndDate && toDocumentDate >= fiscalStartDate))
                result = true;
            else
                result = false;
            if (typeof callBack == "function")
                callBack(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_fiscalYearGetReccord);
            return "";
        }
    });

}

async function GetReport() {
    
    parameters = parameter();
    parameters.mainReportType = 1;
    mainReportType = 1;
    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;
    if (+$("#reportType").val() == 11) {
        var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

        initialPageing();
        //اگر نوع گزارش 'کل' بود
        createPageFooterInfo(0, 0, 0, false);
        if (!isLoadingData) {
            getReportAsync(parameters, () => {
                loadingAsync(false, "levelAndNoteGetReport", "fas fa-sticky-note");
                $("#treeHeaderReport").addClass("displaynone");
                checkMainNode();


                if (isNext)
                    $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
                else {
                    if (trackingTree.glId == 0)
                        $(`#dataRowsReport tr:eq(0)`).addClass("highlight");
                    else
                        $(`#dataRowsReport tr[data-accountglid=${trackingTree.glId}]`).addClass("highlight");
                }
                
                checkSumDynamic(parameters);
            });
            $("#next-level").removeAttr("disabled");
        }
    }
    else {

        var reportType = +$("#reportType").val();
        var nodeDetailFunc = reportType == 12 ? "getLevelSgl_Detail" : "getLevelAccountDetail_Detail";
        var level = reportType == 12 ? 1 : 2;

        GetReportJsonForTreeAsync(parameters).then(
            (result) => {
                loadingAsync(false, "levelAndNoteGetReport", "fas fa-sticky-note");

                if (result.length == 0) {

                    alertify.warning("موردی یافت نشد").delay(alertify_delay);

                    $("#dataRowsReport").html(fillEmptyRow(+$("#headerColumnReport th").length));
                    $("#dataRowsReport #emptyRow").addClass("highlight")
                    resetSummeryReport();
                }


                nodeTabIndex = 100;
                var generateResult = generate_treeview(result, level, nodeDetailFunc);

                $("#treeHeaderReport").removeClass("displaynone");
                $("#treeview").html("");
                $("#treeview").append(generateResult);
                $("#treeview").hummingbird();
                $("#treeview").hummingbird("collapseAll");
                checkMainNode();
                checkNodeHasChildren();


                let currentElm = $(`#${saveFunctionsTrees.currentId}`);
                if (isNext && result.length != 0)
                    currentElm.click()
                else if (result.length != 0) {
                    if (trackingTree.glId == 0)
                        currentElm.click()
                    else
                        if (saveFunctionsTrees.funcName == "getLevelSgl_Detail") {
                            currentElm = $(`#gl-0-${trackingTree.glId}`)
                            getLevelSgl_Detail(currentElm, false, `${trackingTree.glId}`, 0)
                        }
                }
            },
            (result) => {
                loadingAsync(false, "levelAndNoteGetReport", "fas fa-sticky-note");
                return;
            })

    }
};

async function getdateRange() {
    fromDocumentDate1 = null;
    toDocumentDate1 = null;

    let newFromDocumentDate = $("#fromDocumentDate").val()
    let newUrl = '/api/fm/JournalReportApi/getdaterange'

    await $.ajax({
        url: newUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(newFromDocumentDate),
        success: function (result) {
            fromDocumentDate1 = result.item1 == null ? null : result.item1
            toDocumentDate1 = result.item2 == null ? null : result.item2
        },
        error: function (xhr) {
            error_handler(xhr, newUrl)
        }
    });
}

async function GetNoteReport() {

    await getdateRange();
    parameters = parameter();
    parameters.mainReportType = 2;
    mainReportType = 2;
    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;

    var reportType = +$("#reportType").val();
    var nodeDetailFunc = reportType == 14 ? "getNoteAccountGlDetailReport" : reportType == 15 ? "getNoteAccountSglDetailReport" : "getNoteAccountDetail_DetailReport";
    GetReportJsonForTreeAsync(parameters).then(
        (result) => {
            loadingAsync(false, "levelAndNoteGetReport", "fas fa-sticky-note");

            if (result.length == 0) {

                alertify.warning("موردی یافت نشد").delay(alertify_delay);

                $("#dataRowsReport").html(fillEmptyRow(+$("#headerColumnReport th").length));
                $("#dataRowsReport #emptyRow").addClass("highlight")

                resetSummeryReport();

            }

            nodeTabIndex = 100;

            var newLevel = +$("#reportType").val() == 14 ? 1 : +$("#reportType").val() == 15 ? 2 : 3

            var generateResult = generate_treeview(result, newLevel, nodeDetailFunc);
            $("#treeHeaderReport").removeClass("displaynone");
            $("#treeview").html("");
            $("#treeview").append(generateResult);
            $("#treeview").hummingbird();
            $("#treeview").hummingbird("collapseAll");
            checkMainNode();
            checkNodeHasChildren();


            
            if (isNext && result.length != 0) {
                let currentElm = $(`#${saveFunctionsTrees.currentId}`);
                currentElm.click();
            }
            else if (result.length != 0) {
                let currentElm = ""/*`#${saveFunctionsTrees.currentId}`*/

                if (saveFunctionsTrees.funcName == "getNoteAccountGlDetailReport") {
                    currentElm = $(`#gl-0-${trackingTree.glId}`)
                    getNoteAccountGlDetailReport(currentElm, false, `${trackingTree.glId}`, 0)
                }

                else if (saveFunctionsTrees.funcName == "getNoteAccountSglDetailReport") {
                    currentElm = $(`#sgl-0-${trackingTree.glId}-${trackingTree.sglId}`)
                    getNoteAccountSglDetailReport(currentElm, false, trackingTree.sglId, trackingTree.glId);
                }    
                else if (saveFunctionsTrees.funcName == "getNoteAccountDetail_DetailReport") {
                    currentElm = $(`#acDetail-${trackingTree.glId}-${trackingTree.sglId}-${trackingTree.detailsId}`)
                    getNoteAccountDetail_DetailReport(currentElm, false, trackingTree.detailsId, trackingTree.sglId);
                }
            }

        },
        (result) => {
            loadingAsync(false, "levelAndNoteGetReport", "fas fa-sticky-note");
            return;
        })

};

function checkMainNode() {

    if ($("#treeHeaderReport").hasClass("displaynone")) {
        $("#previous-level").attr("disabled", "disabled");
    }
    else {
        var selectedNodeId = $("#treeview").find(".treeSelected").parent("li").attr("id");
        if (typeof selectedNodeId !== "undefined") {
            if (selectedNodeId.indexOf("gl") == 0 && !isLevelReport)
                $("#previous-level").attr("disabled", "disabled");
            else
                $("#previous-level").removeAttr("disabled");
        }
        else
            $("#previous-level").attr("disabled", "disabled");

    }
}

function checkNodeHasChildren() {
    var selectedNodeChildrenLngth = +$("#treeview").find(".treeSelected").parent("li").data("childrenlength");
    if (selectedNodeChildrenLngth == 0)
        $("#next-level").attr("disabled", "disabled");
    else
        $("#next-level").removeAttr("disabled");
}

function generate_treeview(list, level, clickFunc, parentId = 0, gparentId = 0, nodeLevelGlId = 0) {
    /**
     * نمایش گزارش در ساختار درختی با تعیین سطح
     */
    $("#next-level").removeAttr("disabled");

    if (list == null) return "";

    var str = "";
    firstNodeOpened = false;
    for (var i = 0; i < list.length; i++) {
        nodeTabIndex += 1;
        var item = list[i];

        //if (item.type != "") {
        //    itemType = item.type == 1 ? "مرکز هزینه" : "تفصیل";
        //}

        if (item.level == 1) {
            parentParentId = item.id
        }

        var itemFunc = "";
        if (item.level == level) {
            //if (+item.type == 0)
            //    itemFunc = `${clickFunc}('${item.id}-${i}',${parentId},${parentParentId})`;
            //else
            itemFunc = `${clickFunc}(this,true,${item.id},${parentId})`

        }


        var classStyle = "";
        var idName = "";
        var isSelected = false;

        if (item.level == level)
            classStyle = "cur-pointer";

        if (item.childCount != 0 && i == list.length - 1)
            classStyle += " none-border";

        if (item.level == 1) {
            idName = `gl-${parentId}-${item.id}`;
        }
        else if (item.level == 2) {    
            idName = `sgl-0-${parentId}-${item.id}`;
            gparentId = parentId
        }
        else {
            idName = `acDetail-${gparentId}-${parentId}-${item.id}`
        }

        if (((i == 0 && levelGlId == 0 && levelSglId == 0 && item.level == level) ||
            (level == 1 && levelGlId != 0 && item.id == levelGlId) ||
            (
                (item.level == 2 && level == 2 && parentId == levelGlId &&
                    (levelSglId == 0 || item.id == levelSglId)) ||
                (item.level == 3 && level == 3 && parentId == levelSglId && nodeLevelGlId == levelGlId)
            )
        ) && !defaultGetResult) {
            isSelected = true;
            defaultGetResult = true;
            saveFunctionsTrees.funcName = clickFunc
            saveFunctionsTrees.func = `${clickFunc}(this,false,${item.id},${parentId})`
            saveFunctionsTrees.currentId = idName
            //eval(`${clickFunc}(this,${item.id},${parentId})`);
        }

        if (item.childCount != 0) {
            if (itemFunc == "")
                str += `<li class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;
            else
                str += `<li onclick="${itemFunc}" class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;

            str += (i == 0 && levelGlId == 0 && levelSglId == 0) || ((item.level == 1 && item.id == levelGlId) || (item.level == 2 && item.id == levelSglId)) ? '<i class="fa fa-minus"></i>' : '<i class="fa fa-plus"></i>';
            str += `<span class="${isSelected ? 'treeSelected' : ''}">(${item.id}) ${item.name} </span> `;
            str += `<ul ${(i == 0 && levelGlId == 0 && levelSglId == 0) || ((item.level == 1 && item.id == levelGlId) || (item.level == 2 && item.id == levelSglId)) ? 'style="display: block;"' : ''}>`;
            str += generate_treeview(item.children, level, clickFunc, item.id, gparentId, level == 3 ? parentId : 0);
            str += "</ul>";
            str += '</li>';
            //firstNodeOpened = true;
        }
        else {

            idname = "node-" + item.id;
            if (itemFunc == "")
                str += `<li class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;
            else
                str += `<li onclick="${itemFunc}" class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;

            str += `<span class="${isSelected ? 'treeSelected' : ''}">(${item.id}) ${item.name} </span>`;
            str += '</li>';
        }
    }
    return str;

};

function getLevelSgl_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;

    $("#fromAccountGLId").val(identityId).trigger("change")
    $("#toAccountGLId").val(identityId).trigger("change")
    $("#fromAccountSGLId").val(1).trigger("change")
    $("#toAccountSGLId").val(9999).trigger("change")
    $("#fromAccountDetailId").val("").trigger("change")
    $("#toAccountDetailId").val("").trigger("change")

    if (isNext || isTreeClicked) {
        trackingTree.glId = identityId
        trackingTree.sglId = 0
        trackingTree.detailsId = 0
    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    parameters = parameter();
    parameters.mainReportType = 1;
    mainReportType = 1;
    parameters.fromAccountGLId = identityId;
    parameters.toAccountGLId = identityId;

    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;

    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();
    //اگر نوع گزارش 'کل' بود
    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {
        getReportAsync(parameters, () => {

            set_accountgl($("li span.treeSelected").parents("li").first());

            if (!isNext && trackingTree.sglId != 0) {
                $(`#dataRowsReport tr[data-accountsglid=${trackingTree.sglId}]`).addClass("highlight");
            }
            else
                $(`#dataRowsReport tr:eq(0)`).addClass("highlight");


            checkSumDynamic(parameters);

        });
    }
}

function getLevelAccountDetail_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;

    $("#fromAccountGLId").val(parentId).trigger("change")
    $("#toAccountGLId").val(parentId).trigger("change")
    $("#fromAccountSGLId").val(identityId).trigger("change")
    $("#toAccountSGLId").val(identityId).trigger("change")
    //$("#fromAccountDetailId").val("").trigger("change")
    //$("#toAccountDetailId").val("").trigger("change")

    if (isNext || isTreeClicked) {
        trackingTree.glId = parentId
        trackingTree.sglId = identityId
        trackingTree.detailsId = 0
    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(`#${elmId}`).focus()

    parameters = parameter();

    parameters.mainReportType = 1;
    mainReportType = 1;
    parameters.fromAccountSGLId = identityId;
    parameters.toAccountSGLId = identityId;
    parameters.fromAccountGLId = parentId;
    parameters.toAccountGLId = parentId;

    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;

    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();
    //اگر نوع گزارش 'کل' بود
    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {

        getReportAsync(parameters, () => {
            set_accountgl($("li span.treeSelected").parents("li").first().parents("li").first());
            set_accountSgl($("li span.treeSelected").parents("li").first());

            $(`#dataRowsReport tr:eq(0)`).addClass("highlight")

            checkSumDynamic(parameters);
        });
    }
    checkNodeHasChildren();

}

function getNoteAccountGlDetailReport(elm, isTreeClicked, id) {
    
    identityId = id;

    affectedCreditSum = -1;
    affectedDebitSum = -1;
    affectedRemainingSum = -1;

    $("li .treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(elm).focus()

    $("#fromAccountGLId").val(identityId).trigger("change")
    $("#toAccountGLId").val(identityId).trigger("change")
    $("#fromAccountSGLId").val(1).trigger("change")
    $("#toAccountSGLId").val(9999).trigger("change")

    if (isNext || isTreeClicked) {
        trackingTree.glId = identityId
        trackingTree.sglId = 0
        trackingTree.detailsId = 0
    }

    parameters = parameter();

    parameters.fromAccountGLId = identityId;
    parameters.toAccountGLId = identityId;
    parameters.mainReportType = 2;
    mainReportType = 2;

    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;
    initialPageing();
    createPageFooterInfo(0, 0, 0, false);
    //اگر نوع گزارش 'کل' بود
    getReportAsync(parameters, () => {

        set_accountgl($("li span.treeSelected").parents("li").first());

        $(`#dataRowsReport tr:eq(0)`).addClass("highlight");

        setAffectedValuePerRequest();

        reportParameters.affectedCreditSum = affectedCreditSum;
        reportParameters.affectedDebitSum = affectedDebitSum;
        reportParameters.affectedRemainingSum = affectedRemainingSum;

        checkSumDynamic(parameters);
    });
    checkNodeHasChildren();
}

function getNoteAccountSglDetailReport(elm, isTreeClicked, id, parentId) {
    
    identityId = id;

    affectedCreditSum = -1;
    affectedDebitSum = -1;
    affectedRemainingSum = -1;

    $("li .treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(elm).focus()

    $("#fromAccountGLId").val(parentId).trigger("change")
    $("#toAccountGLId").val(parentId).trigger("change")
    $("#fromAccountSGLId").val(identityId).trigger("change")
    $("#toAccountSGLId").val(identityId).trigger("change")
    $("#fromAccountDetailId").val("").trigger("change")
    $("#toAccountDetailId").val("").trigger("change")

    if (isNext || isTreeClicked) {
        trackingTree.glId = parentId
        trackingTree.sglId = identityId
        trackingTree.detailsId = 0
    }

    parameters = parameter();
    parameters.fromAccountSGLId = identityId;
    parameters.toAccountSGLId = identityId;
    parameters.fromAccountGLId = parentId;
    parameters.toAccountGLId = parentId;
    parameters.mainReportType = 2;
    mainReportType = 2;
    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;


    initialPageing();
    //اگر نوع گزارش 'کل' بود
    createPageFooterInfo(0, 0, 0, false);
    getReportAsync(parameters, () => {

        set_accountgl($("li span.treeSelected").parents("li").first().parents("li").first());
        set_accountSgl($("li span.treeSelected").parents("li").first());

        $(`#dataRowsReport tr:eq(0)`).addClass("highlight")

        setAffectedValuePerRequest();

        reportParameters.affectedCreditSum = affectedCreditSum;
        reportParameters.affectedDebitSum = affectedDebitSum;
        reportParameters.affectedRemainingSum = affectedRemainingSum;

        checkSumDynamic(parameters);
    });

    checkNodeHasChildren();
}

function getNoteAccountDetail_DetailReport(elm, isTreeClicked, id, parentId) {
    
    identityId = id;

    affectedCreditSum = -1;
    affectedDebitSum = -1;
    affectedRemainingSum = -1;

    $("li .treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");
    $(`#${elmId} span`).addClass("treeSelected");

    let grandParent = $("li .treeSelected").parent("li").parent("ul").parent("li").parent("ul").parent("li").data("id")

    $("#fromAccountGLId").val(grandParent).trigger("change")
    $("#toAccountGLId").val(grandParent).trigger("change")
    $("#fromAccountSGLId").val(parentId).trigger("change")
    $("#toAccountSGLId").val(parentId).trigger("change")
    $("#fromAccountDetailId").val(identityId).trigger("change")
    $("#toAccountDetailId").val(identityId).trigger("change")

    if (isNext || isTreeClicked) {
        trackingTree.glId = grandParent
        trackingTree.sglId = parentId
        trackingTree.detailsId = identityId
    }

    parameters = parameter();
    parameters.fromAccountDetailId = identityId;
    parameters.toAccountDetailId = identityId;
    parameters.fromAccountSGLId = parentId;
    parameters.toAccountSGLId = parentId;
    parameters.mainReportType = 2;
    mainReportType = 2;
    viewData_PreviewReport_GetReport = viewData_PreviewReport_JournalDetailReportPreview;

    initialPageing();

    //اگر نوع گزارش 'کل' بود
    createPageFooterInfo(0, 0, 0, false);
    getReportAsync(parameters, () => {

        set_accountgl($("li span.treeSelected").parents("li").first().parents("li").first().parents("li").first());
        set_accountSgl($("li span.treeSelected").parents("li").first().parents("li").first());
        set_accountDetail($("li span.treeSelected").parent("li").first());

        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();


        setAffectedValuePerRequest();

        reportParameters.affectedCreditSum = affectedCreditSum;
        reportParameters.affectedDebitSum = affectedDebitSum;
        reportParameters.affectedRemainingSum = affectedRemainingSum;

        checkSumDynamic(parameters);
    });
    checkNodeHasChildren();
}

function setAffectedValuePerRequest() {

    var affectedDebitText = $(`#dataRowsReport tr:last td:eq(5)`).text();
    var affectedCreditText = $(`#dataRowsReport tr:last td:eq(6)`).text();
    var affectedRemainingText = $(`#dataRowsReport tr:last td:eq(7)`).text();

    affectedDebitSum = (affectedDebitText.indexOf("(") !== -1 ? -1 : 1) * (+affectedDebitText.replaceAll(",", "").replace("(", "").replace(")", ""));
    affectedCreditSum = (affectedCreditText.indexOf("(") !== -1 ? -1 : 1) * (+affectedCreditText.replaceAll(",", "").replace("(", "").replace(")", ""));
    affectedRemainingSum = (affectedRemainingText.indexOf("(") !== -1 ? -1 : 1) * (+affectedRemainingText.replaceAll(",", "").replace("(", "").replace(")", ""));

    reportParameters.affectedCreditSum = affectedCreditSum;
    reportParameters.affectedDebitSum = affectedDebitSum;
    reportParameters.affectedRemainingSum = affectedRemainingSum;
}

function set_accountgl(elem) {
    var word = $(elem).find("span").first().text().replace('(', '');
    var firstPartWord = word.indexOf("(");
    var seccondPartWord = word.indexOf(")");
    var identityId = word.substring(firstPartWord, seccondPartWord + 1).replace('(', '').replace(')', '');
    accountGl = `${identityId} - ${word.replace(word.substring(firstPartWord, seccondPartWord + 1), '')}`;
}

function set_accountSgl(elem) {
    var word = $(elem).find("span").first().text().replace('(', '');
    var firstPartWord = word.indexOf("(");
    var seccondPartWord = word.indexOf(")");
    var identityId = word.substring(firstPartWord, seccondPartWord + 1).replace('(', '').replace(')', '');
    accountSgl = `${identityId} - ${word.replace(word.substring(firstPartWord, seccondPartWord + 1), '')}`;
}

function set_accountDetail(elem) {
    var word = $(elem).find("span").first().text().replace('(', '');
    var firstPartWord = word.indexOf("(");
    var seccondPartWord = word.indexOf(")");
    var identityId = word.substring(firstPartWord, seccondPartWord + 1).replace('(', '').replace(')', '');
    accountDetail = `${identityId} - ${word.replace(word.substring(firstPartWord, seccondPartWord + 1), '')}`;
}

function click_link_report(elm) {
    if (typeof onModalLoadFunction === 'undefined')
        navigateToModalJournal(`/FM/journal/journaldisplay/${$(elm).text()}/" "/2`);
}

function navigateToModalJournal(href) {

    initialPage();
    $("#contentdisplayJournalLine #content-page").addClass("displaynone");
    $("#contentdisplayJournalLine #loader").removeClass("displaynone");

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
            $(".modal-dialog").css("height", "auto")
            modal_show("displayJournalLineModel");
            $(".nav-link span").removeClass("d-none")
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

async function GetReportJsonForTreeAsync(data) {

    let response = await $.ajax({
        url: viewData_ReportJsonForTree_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_ReportJsonForTree_url);
            return "";
        }
    });

    return response;
}

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass);
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
    }
}

function previousLevel() {

    var selectedRow = $("#dataRowsReport tr.highlight");
    var currentLi = $("li span.treeSelected").parent("li");
    if (isLevelReport && selectedRow.length > 0) {

        if (currentLi.attr("id").indexOf("sgl") != -1) {
            $("#reportType").val("12").trigger("change");
            //$("#fromAccountGLId").val(selectedRow.data("accountgl").toString().split("-")[0]).trigger("change");
            //$("#toAccountGLId").val(selectedRow.data("accountgl").toString().split("-")[0]).trigger("change");
            //$("#fromAccountSGLId").val(selectedRow.data("accountsgl").toString().split("-")[0]).trigger("change");
            //$("#toAccountSGLId").val(selectedRow.data("accountsgl").toString().split("-")[0]).trigger("change");
            $("#fromAccountGLId").val(1).trigger("change");
            $("#toAccountGLId").val(999).trigger("change");
            $("#fromAccountSGLId").val(1).trigger("change");
            $("#toAccountSGLId").val(9999).trigger("change");
            $("#fromAccountDetailId").val("").trigger("change")
            $("#toAccountDetailId").val("").trigger("change")
            /*$("#levelGetReport").click();*/ levelGetReport()
        }
        else if (currentLi.attr("id").indexOf("gl") == 0) {
            $("#reportType").val("11").trigger("change");
            $("#fromAccountGLId").val(1).trigger("change");
            $("#toAccountGLId").val(999).trigger("change");
            $("#fromAccountSGLId").val(1).trigger("change");
            $("#toAccountSGLId").val(9999).trigger("change");
            $("#fromAccountDetailId").val("").trigger("change")
            $("#toAccountDetailId").val("").trigger("change")
            /*$("#levelGetReport").click();*/
            levelGetReport()
        }

    }
    else {

        //var Id = +$("li span.treeSelected").parent("li").data("id");
        //if (Id > 0) {
        if (currentLi.attr("id").indexOf("acDetail") != -1 || currentLi.attr("id").indexOf("costDetail") != -1) {
            $("#reportType").val("15").trigger("change");
            $("#fromAccountSGLId").val(1).trigger("change");
            $("#toAccountSGLId").val(9999).trigger("change");
            $("#fromAccountDetailId").val("").trigger("change")
            $("#toAccountDetailId").val("").trigger("change")
            /*$("#noteGetReport").click();*/ noteGetReport()
        }
        else if (currentLi.attr("id").indexOf("sgl") != -1) {
            levelSglId = 0;
            $("#reportType").val("14").trigger("change");
            $("#fromAccountGLId").val(1).trigger("change");
            $("#toAccountGLId").val(999).trigger("change");
            $("#fromAccountSGLId").val(1).trigger("change");
            $("#toAccountSGLId").val(9999).trigger("change");
            $("#fromAccountDetailId").val("").trigger("change")
            $("#toAccountDetailId").val("").trigger("change")
           /* $("#noteGetReport").click();*/ noteGetReport()
        }
        //}
    }
    $("#treeHeaderReport").focus();
    loadingAsync(false, "previous-level", "fas fa-arrow-up");

}

function nexLevel() {

    if ($("#dataRowsReport #emptyRow").length == 0) {
        var selectedRow = $("#dataRowsReport tr.highlight:not(#emptyRow)");
        if (isLevelReport && selectedRow.length > 0) {

            if (+$("#reportType").val() == 11) {
                $("#reportType").val(12).trigger("change");
                var accountGlId = +$(selectedRow).data("accountglid");
                levelGlId = accountGlId;
                /*$("#levelGetReport").click();*/ levelGetReport()
            }
            else if (+$("#reportType").val() == 12) {
                $("#reportType").val(13).trigger("change");;
                var accountSGlId = +$(selectedRow).data("accountsglid");;
                levelGlId = +$("li span.treeSelected").parent("li").data("id");
                levelSglId = accountSGlId;
                /*$("#levelGetReport").click();*/ levelGetReport()
            }
        }
        else {
            var Id = +$("li span.treeSelected").parent("li").data("id");
            if (Id > 0) {
                var currentLi = $("li span.treeSelected").parent("li");
                if (currentLi.attr("id").indexOf("gl") == 0) {
                    levelGlId = Id;
                    $("#reportType").val("15").trigger("change");;
                   /* $("#noteGetReport").click();*/ noteGetReport()
                }
                else if (currentLi.attr("id").indexOf("sgl") != -1) {
                    levelGlId = +$($("li span.treeSelected").parent("li").parents("li")[0]).data("id");
                    levelSglId = Id;
                    $("#reportType").val("16").trigger("change");;
                    /*$("#noteGetReport").click();*/ noteGetReport()
                }
            }
        }
        $("#treeHeaderReport").focus();
        loadingAsync(false, "next-level", "fas fa-arrow-down");
    }
    else
        loadingAsync(false, "next-level", "fas fa-arrow-down");
}

function parameter() {
    let fromDocumentDateMiladi = moment.from($("#fromDocumentDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let toDocumentDateMiladi = moment.from($("#toDocumentDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');

    let parameters = {
        columnType: $("#columnType").prop("checked") == true ? 1 : 0,
        reportType: +$("#reportType").val() == null ? 0 : +$("#reportType").val(),
        mainReportType: mainReportType,
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        currencyId: +$("#currencyId").val() == 0 ? null : +$("#currencyId").val(),
        documentTypeId: +$("#journalDocumentTypeId").val() == 0 ? null : +$("#journalDocumentTypeId").val(),
        actionId: $("#actionId").val() == "" ? null : +$("#actionId").val().toString(),

        fromAccountGLId: +$("#fromAccountGLId").val() == 0 ? null : +$("#fromAccountGLId").val(),
        toAccountGLId: +$("#toAccountGLId").val() == 0 ? null : +$("#toAccountGLId").val(),
        fromAccountSGLId: +$("#fromAccountSGLId").val() == 0 ? null : +$("#fromAccountSGLId").val(),
        toAccountSGLId: +$("#toAccountSGLId").val() == 0 ? null : +$("#toAccountSGLId").val(),
        fromAccountDetailId: $("#fromAccountDetailId").val() == "" ? null : +$("#fromAccountDetailId").val(),
        toAccountDetailId: $("#toAccountDetailId").val() == "" ? null : +$("#toAccountDetailId").val(),

        fromCostObjectId: +$("#fromCostObjectId").val() == 0 ? null : +$("#fromCostObjectId").val(),
        toCostObjectId: +$("#toCostObjectId").val() == 0 ? null : +$("#toCostObjectId").val(),
        fromDocumentDate: $("#fromDocumentDate").val() == null ? null : fromDocumentDateMiladi,
        toDocumentDate: $("#toDocumentDate").val() == null ? null : toDocumentDateMiladi,
        fromDocumentDate1: fromDocumentDate1,
        toDocumentDate1: toDocumentDate1,
        fromDocumentNo: +$("#fromDocumentNo").val() == 0 ? null : +$("#fromDocumentNo").val(),
        toDocumentNo: +$("#toDocumentNo").val() == 0 ? null : +$("#toDocumentNo").val(),
        fromJournalId: +$("#fromJournalId").val() == 0 ? null : +$("#fromJournalId").val(),
        toJournalId: +$("#toJournalId").val() == 0 ? null : +$("#toJournalId").val(),
        createUserId: +$("#createUserId").val() == 0 ? null : +$("#createUserId").val(),
        openingJournal: $("#openingJournal").prop("checked") == true ? 1 : 0,
        endingJournal: $("#endingJournal").prop("checked") == true ? 1 : 0,
        temporaryJournal: $("#temporaryJournal").prop("checked") == true ? 1 : 0,
        pageNo: 0,
        roleId:0,
        pageRowsCount: +$(`#dropDownCountersName`).text(),
        affectedDebitSum: affectedDebitSum,
        affectedCreditSum: affectedCreditSum,
        affectedRemainingSum: affectedRemainingSum
    };
    reportParameters = parameters;
    return parameters;
}

function ReportParameter() {

    
    let reportParameters = [
        { Item: "trialBalanceType", Value: +$("#reportTypeForPrintAndExel").val().toString(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "pageNo", Value: null, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 10 },
        { Item: "pageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "branchId", Value: parameters.branchId, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "documentTypeId", Value: parameters.documentTypeId, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "currencyId", Value: parameters.currencyId, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ActionId", Value: parameters.actionId, SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "createUserId", Value: parameters.createUserId, SqlDbType: dbtype.Int, Size: 0 },

        { Item: "fromDocumentDate", Value: parameters.fromDocumentDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "fromDocumentDate1", Value: fromDocumentDate1, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toDocumentDate", Value: parameters.toDocumentDate, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toDocumentDate1", Value: toDocumentDate1, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "FromDatePersian", Value: $("#fromDocumentDate").val(), itemType: "Var" },
        { Item: "ToDatePersian", Value: $("#toDocumentDate").val(), itemType: "Var" },
        { Item: "FromDocumentDate1", Value: fromDocumentDate1, itemType: "Var" },
        { Item: "ToDocumentDate1", Value: toDocumentDate1, itemType: "Var" },

        { Item: "AccountGl", Value: accountGl, itemType: "Var" },
        { Item: "AccountSgl", Value: accountSgl, itemType: "Var" },
        { Item: "AccountDetail", Value: accountDetail, itemType: "Var" },
        { Item: "fromJournalId", Value: parameters.fromJournalId, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toJournalId", Value: parameters.toJournalId, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromDocumentNo", Value: parameters.fromDocumentNo, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toDocumentNo", Value: parameters.toDocumentNo, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromAccountGLId", Value: +$("#fromAccountGLIdPrint").val() == 0 ? null : +$("#fromAccountGLIdPrint").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toAccountGLId", Value: +$("#toAccountGLIdPrint").val() == 0 ? null : +$("#toAccountGLIdPrint").val(), Size: 10 },
        { Item: "fromAccountSGLId", Value: +$("#fromAccountSGLIdPrint").val() == 0 ? null : +$("#fromAccountSGLIdPrint").val(), Size: 10 },
        { Item: "toAccountSGLId", Value: +$("#toAccountSGLIdPrint").val() == 0 ? null : +$("#toAccountSGLIdPrint").val(), Size: 10 },
        { Item: "fromAccountDetailId", Value: $("#fromAccountDetailIdPrint").val() == "" ? null : +$("#fromAccountDetailIdPrint").val(), Size: 10 },
        { Item: "toAccountDetailId", Value: $("#toAccountDetailIdPrint").val() == -1 || $("#toAccountDetailIdPrint").val() == "" ? null : +$("#toAccountDetailIdPrint").val(), Size: 10 },
        { Item: "openingJournal", Value: parameters.openingJournal, SqlDbType: dbtype.dbtype_Bit, Size: 10 },
        { Item: "endingJournal", Value: parameters.endingJournal, SqlDbType: dbtype.dbtype_Bit, Size: 10 },
        { Item: "ColumnType", Value: $("#columnTypeForPrintAndExel").prop("checked") == true ? 1 : 0, itemType: "Var" },
        { Item: "temporaryJournal", Value: parameters.temporaryJournal, SqlDbType: dbtype.dbtype_Bit, Size: 10 },
    ]
    return reportParameters;
}

function beforExport_JournalTrialSearch_csv() {

    $("#fromAccountGLIdPrint").val($("#fromAccountGLId").val())
    $("#toAccountGLIdPrint").val($("#toAccountGLId").val())
    $("#fromAccountSGLIdPrint").val($("#fromAccountSGLId").val())
    $("#toAccountSGLIdPrint").val($("#toAccountSGLId").val())
    $("#fromAccountDetailIdPrint").val($("#fromAccountDetailId").val())
    $("#toAccountDetailIdPrint").val($("#toAccountDetailId").val())
    $("#reportTypeForPrintAndExel").val($("#reportType").val()).trigger("change")
    $("#columnTypeForPrintAndExel").prop("checked", $("#columnType").prop("checked")).trigger("change")
    $("#exportCSV").removeClass("d-none")
    $("#stimul_preview").addClass("d-none")
    $("#exportCSV").attr("tabindex", 37)
    modal_show("getCsvReportParameter")
    $("#printOrExelModalTitle").text("اکسل")
}

function export_JournalTrialSearch_csv() {

    var check = controller_check_authorize("JournalReportApi", "PRN");
    if (!check)
        return;

    loadingAsync(true, "exportCSV", "fa fa-save");
    csvModel = parameter();

    csvModel.fromAccountGLId = +$("#fromAccountGLIdPrint").val() == 0 ? null : +$("#fromAccountGLIdPrint").val()
    csvModel.toAccountGLId = +$("#toAccountGLIdPrint").val() == 0 ? null : +$("#toAccountGLIdPrint").val()
    csvModel.fromAccountSGLId = +$("#fromAccountSGLIdPrint").val() == 0 ? null : +$("#fromAccountSGLIdPrint").val()
    csvModel.toAccountSGLId = +$("#toAccountSGLIdPrint").val() == 0 ? null : +$("#toAccountSGLIdPrint").val()
    csvModel.fromAccountDetailId = $("#fromAccountDetailIdPrint").val() == ""? null : +$("#fromAccountDetailIdPrint").val()
    csvModel.toAccountDetailId = $("#toAccountDetailIdPrint").val() == -1 || $("#toAccountDetailIdPrint").val() == "" ? null : +$("#toAccountDetailIdPrint").val()
    csvModel.columnType = $("#columnTypeForPrintAndExel").prop("checked") == true ? 1 : 0
    csvModel.reportType = +$("#reportTypeForPrintAndExel").val() == null ? 0 : +$("#reportTypeForPrintAndExel").val()

    csvModel.affectedDebitSum = -1;
    csvModel.affectedCreditSum = -1;
    csvModel.affectedRemainingSum = -1;

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    switch (csvModel.reportType) {
        case 11:
            viewData_csv_url = levelGlCsvUrl;
            viewData_form_title = "تراز کل";
            break;
        case 12:
            viewData_csv_url = levelSglCsvUrl;
            viewData_form_title = "تراز معین";
            break;
        case 13:
            viewData_csv_url = levelAccountDetailCsvUrl;
            viewData_form_title = "تراز تفصیل";
            break;
        case 14:
            viewData_csv_url = noteGlCsvUrl;
            viewData_form_title = "دفاتر کل";
            break;
        case 15:
            viewData_csv_url = noteSglCsvUrl;
            viewData_form_title = "دفاتر معین";
            break;
        case 16:
            viewData_csv_url = noteAccountDetailCsvUrl;
            viewData_form_title = "دفاتر تفصیل";
            break;
    }

    if (["11", "12", "13"].includes(csvModel.reportType.toString()))
        csvModel.mainReportType = 1;
    else
        csvModel.mainReportType = 2;

    exportCsv(csvModel, viewData_form_title)

}

function exportCsv(csvModel, viewData_form_title) {

    var urlCSV = viewData_csv_url;

    $.ajax({
        url: urlCSV,
        type: "post",
        datatype: "text",
        contentType: "application/json",
        xhrFields: {
            responseType: 'blob'
        },
        data: JSON.stringify(csvModel),
        success: function (result) {
            loadingAsync(false, "exportCSV", "fa fa-save");
            //var blob = new Blob([result], { type: 'text/csv' });
            var downloadUrl = URL.createObjectURL(result);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${viewData_form_title}.csv`;
            document.body.appendChild(a);
            a.click();
        },
        error: function (xhr) {
            loadingAsync(false, "exportCSV", "fa fa-save");
            error_handler(xhr)
        }
    });
}

function setTitleReport(reportTitle) {

    $("#showKindOfReportDisplay").removeClass("d-none")
    let reportType = +$("#reportType").val()

    switch (reportType) {
        case 11:
            $("#showKindOfReport").text(`تراز - کل`)
            break;
        case 12:
            $("#showKindOfReport").text(`تراز - معین`)
            break;
        case 13:
            $("#showKindOfReport").text(`تراز - تفضیل`)
            break;
        case 14:
            $("#showKindOfReport").text(`دفتر - کل`)
            break;
        case 15:
            $("#showKindOfReport").text(`دفتر - معین`)
            break;
        case 16:
            $("#showKindOfReport").text(`دفتر - تفضیل`)
            break;
    }

}

function after_change_tr(pg_name, keycode) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    var tr_editing = arr_pagetables[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_Highlight(pg_name);
    if (keycode === KeyCode.Esc) {
        if (tr_editing) {
            initialRow(pagetable_id, false);
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

$("#levelAndNoteGetReport").on("click", function () {

    var check = controller_check_authorize("JournalReportApi", "VIW");
    if (!check)
        return;

    isNext = true
    let reportType = +$("#reportType").val()

    if (reportType == 11 || reportType == 12 || reportType == 13)
        levelGetReport()
    else
        noteGetReport()

})

$("#fiscalId").change(function () {
    if (+$(this).val() != 0) {
        $.ajax({
            url: viewData_fiscalYearGetReccord,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(+$("#fiscalId").val()),
            success: function (result) {
                var fiscalStartDate = result.startDatePersian;
                var fiscalEndDate = result.endDatePersian
                $("#fromDocumentDate").val(fiscalStartDate);
                $("#toDocumentDate").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_fiscalYearGetReccord);
                return "";
            }
        });
    }
    else {
        $("#fromDocumentDate").val($("#yearDate").val());
        $("#toDocumentDate").val($("#nowDate").val());
    }
})

$("#beforStimul_preview").on("click", function () {

    $("#fromAccountGLIdPrint").val($("#fromAccountGLId").val())
    $("#toAccountGLIdPrint").val($("#toAccountGLId").val())
    $("#fromAccountSGLIdPrint").val($("#fromAccountSGLId").val())
    $("#toAccountSGLIdPrint").val($("#toAccountSGLId").val())
    $("#fromAccountDetailIdPrint").val($("#fromAccountDetailId").val())
    $("#toAccountDetailIdPrint").val($("#toAccountDetailId").val())
    $("#reportTypeForPrintAndExel").val($("#reportType").val()).trigger("change")
    $("#columnTypeForPrintAndExel").prop("checked", $("#columnType").prop("checked")).trigger("change")
    $("#exportCSV").addClass("d-none")
    $("#stimul_preview").removeClass("d-none")
    $("#stimul_preview").attr("tabindex", 37)
    modal_show("getCsvReportParameter")

})

$("#getCsvReportParameter").on("show.bs.modal", function () {
    //let showKindOfReport = $("#showKindOfReport").text()
    $("#printOrExelModalTitle").text("گزارش")
    /*${showKindOfReport.split("-")[0]}*/
    setTimeout(() => {
        $("#reportTypeForPrintAndExel").select2("focus")
    }, 500)
});

$("#getCsvReportParameter").on("hidden.bs.modal", function () {
    $("#fromAccountGLIdPrint").val("")
    $("#toAccountGLIdPrint").val("")
    $("#fromAccountSGLIdPrint").val("")
    $("#toAccountSGLIdPrint").val("")
    $("#fromAccountDetailIdPrint").val("")
    $("#toAccountDetailIdPrint").val("")
    $("#exportCSV").removeClass("d-none")
    $("#stimul_preview").removeClass("d-none")
    $("#exportCSV").removeAttr("tabindex")
    $("#stimul_preview").removeAttr("tabindex")
});

$("#previous-level").click(function () {
    isNext = false
    levelGetReportForNextAndPrevious = ""
    loadingAsync(true, "previous-level", "fas fa-arrow-up");
    previousLevel();
});

$("#next-level").click(function () {
    isNext = true
    levelGetReportForNextAndPrevious = "next"
    loadingAsync(true, "next-level", "fas fa-arrow-down");
    nexLevel();
});

$("#resetFilters").click(function () {
    levelGlId = 0;
    levelSglId = 0;
    $("#reportType").val("11").trigger("change");
    $("#fiscalId").val(0).trigger("change");
    $("#branchId").val("0").trigger("change");
    $("#currencyId").val("0").trigger("change");
    $("#journalDocumentTypeId").val("0").trigger("change");
    $("#actionId").val("0").trigger("change");
    $("#fromAccountGLId").val("1");
    $("#toAccountGLId").val("999");
    $("#fromAccountSGLId").val("1");
    $("#toAccountSGLId").val("9999");
    $("#fromAccountDetailId").val("");
    $("#toAccountDetailId").val("");
    $("#fromCostObjectId").val("0").trigger("change");
    $("#toCostObjectId").val("0").trigger("change");
    $("#fromJournalId").val("");
    $("#toJournalId").val("");
    $("#fromDocumentNo").val("");
    $("#toDocumentNo").val("");
    $("#createUserId").val("0").trigger("change");
    $("#fromDocumentDate").val($("#yearDate").val());
    $("#toDocumentDate").val($("#nowDate").val());
    $("#openingJournal").prop("checked", false);
    funkyradio_onchange($("#openingJournal"));

    $("#endingJournal").prop("checked", false);
    funkyradio_onchange($("#endingJournal"));

    $("#temporaryJournal").prop("checked", false);
    funkyradio_onchange($("#temporaryJournal"));

})

$("#showReport").on("click", async function () {
    var report_url = `${stimulsBaseUrl.FM.Prn}AccountJournal_Search.mrt`;

    var reportModel = {
        reportUrl: report_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

$("#mainReport").on("click", ".highlight", function () {

    if (levelOffices == "level")

        if (reportTypeForLevel == 11) {
            trackingTree.glId = $(this).data("accountglid").toString().split("-")[0]
            $("#fromAccountGLId").val($(this).data("accountglid").toString().split("-")[0]).trigger("change")
            $("#toAccountGLId").val($(this).data("accountglid").toString().split("-")[0]).trigger("change")
        } else if (reportTypeForLevel == 12) {
            $("#fromAccountGLId").val($(this).data("accountgl").toString().split("-")[0]).trigger("change")
            $("#toAccountGLId").val($(this).data("accountgl").toString().split("-")[0]).trigger("change")
            $("#fromAccountSGLId").val($(this).data("accountsglid").toString().split("-")[0]).trigger("change")
            $("#toAccountSGLId").val($(this).data("accountsglid").toString().split("-")[0]).trigger("change")
        } else if (reportTypeForLevel == 13) {
            $("#fromAccountGLId").val($(this).data("accountgl").toString().split("-")[0]).trigger("change")
            $("#toAccountGLId").val($(this).data("accountgl").toString().split("-")[0]).trigger("change")
            $("#fromAccountSGLId").val($(this).data("accountsgl").toString().split("-")[0]).trigger("change")
            $("#toAccountSGLId").val($(this).data("accountsgl").toString().split("-")[0]).trigger("change")
            $("#fromAccountDetailId").val($(this).data("accountdetailid").toString().split("-")[0]).trigger("change")
            $("#toAccountDetailId").val($(this).data("accountdetailid").toString().split("-")[0]).trigger("change")
        }
})

$("#stimul_preview").click(function () {

    var check = controller_check_authorize("JournalReportApi", "PRN");
    if (!check)
        return;

    //if (isLevelReport) {
    let reportType = +$("#reportTypeForPrintAndExel").val()
    switch (reportType) {
        case 11:
            viewData_print_file_url = levelGlStimulUrl;
            break;
        case 12:
            viewData_print_file_url = levelSglStimulUrl;
            break;
        case 13:
            viewData_print_file_url = levelAccountDetailStimulUrl;
            break;
        case 14:
            viewData_print_file_url = noteGlStimulUrl;
            break;
        case 15:
            viewData_print_file_url = noteSglStimulUrl;
            break;
        case 16:
            viewData_print_file_url = noteAccountDetailStimulUrl;
            break;
    }

    getdateRange();
    parameters = parameter();

    if (["11", "12", "13"].includes(reportType.toString()))
        parameters.mainReportType = 1;
    else
        parameters.mainReportType = 2;

    var repParamaters = ReportParameter();

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: viewData_print_file_url,
        parameters: repParamaters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

initJournalTrialBalanceSearchReport()

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

window.Parsley._validatorRegistry.validators.compareshamsidateyear = undefined;
window.Parsley.addValidator('compareshamsidateyear', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        if (value !== "" && value2 !== "" && requirement !== "") {
            return compareShamsiDateYear(value, value2);
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان باید در یک سال باشند.',
    }
});
