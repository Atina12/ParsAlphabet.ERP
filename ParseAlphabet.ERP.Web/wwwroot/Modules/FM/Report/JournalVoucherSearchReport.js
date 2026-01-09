
var viewData_controllername = "JournalReportApi";
var viewData_form_title = "گزارش جستجو اسناد حسابداری";
var viewData_PreviewReport_GetReport = `${viewData_baseUrl_FM}/${viewData_controllername}/repjournalsearchpreview`;
var viewData_PreviewReport_GetHeader = `${viewData_baseUrl_FM}/${viewData_controllername}/repjournalsearchcolumns`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/repjournalsearchcsv`,
    viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
var reportParameters = [];
var reportUrl = "";
var form = $('#JournalVoucherSearch').parsley();
var roleId = getRoleId();


function init() {

    settingReportModule();
    getHeaderColumns();

    $("#JournalVoucherSearch .select2").select2();

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);


    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "defaultCurrencyId", true);
    fill_select2(`${viewData_baseUrl_FM}/DocumentTypeApi/getdropdownbysystem`, "documentTypeId", true);

    fill_select2(`/api/GN/UserApi/getdropdown`, "createUserId", true, "2/false/false", false);
    fill_select2(`api/FMApi/costobject_getdropdown`, "fromCostObjectId", true);
    fill_select2(`api/FMApi/costobject_getdropdown`, "toCostObjectId", true);



  
    $("#fromDocumentDatePersian").inputmask();
    $("#toDocumentDatePersian").inputmask();

    kamaDatepicker('fromDocumentDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toDocumentDatePersian', { withTime: false, position: "bottom" });

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
            {
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountSGLId")
    })

    $("#toAccountDetailId").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
        //modelItems: [
        //    $("#toAccountGLId"),
        //    $("#toAccountSGLId")
        //],
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
            {
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },
        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })
    $("#fromAccountDetailId").searchModal({
        searchUrl: "/api/FM/AccountDetailApi/search",
        //modelItems: [
        //    $("#fromAccountGLId"),
        //    $("#fromAccountSGLId")
        //],
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
            {
                id: "isActiveStr",
                name: "وضعیت",
                width: 30,
                isFilterParameter: false
            },

        ],
        onclickFunction: () => onclickFunctionValidRep("accountDetailId")
    })

    $("#toCostCenterId").searchModal({
        searchUrl: "/api/FM/CostCenterApi/search",
        modelItems: [
            $("#toAccountGLId"),
            $("#toAccountSGLId")
        ],
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
                name: "نام مرکز هزینه",
                width: 30,
                isFilterParameter: true
            },
        ],
    })
    $("#fromCostCenterId").searchModal({
        searchUrl: "/api/FM/CostCenterApi/search",
        modelItems: [
            $("#toAccountGLId"),
            $("#toAccountSGLId")
        ],
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
                name: "نام مرکز هزینه",
                width: 30,
                isFilterParameter: true
            },
        ],
    })

    $("#fromAccountGLId").val("1");
    $("#toAccountGLId").val("999");
    $("#fromAccountSGLId").val("1");
    $("#toAccountSGLId").val("9999");
    $("#fromAccountDetailId").val("-1");
    $("#toAccountDetailId").val("-1");

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 100)

}

$("#branchId").change(function () {

    let branchId = $(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = workflowCategoryIds.journal.id;

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `56/178/2/2/${branchId}/${workFlowCategoryId}/false/3`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);


});



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
            var fromDate = +$("#fromDocumentDatePersian").val().replace(/\//g, "");
            var toDate = +$("#toDocumentDatePersian").val().replace(/\//g, "");
            if ((fromDate <= fiscalEndDate && fromDate >= fiscalStartDate) && (toDate <= fiscalEndDate && toDate >= fiscalStartDate))
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

async function getReport() {

    let parameters = parameter();
    initialPageing();
    createPageFooterInfo(0, 0, 0, false);

    getReportAsync(parameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        checkSumDynamic(parameters);
    });
};

function parameter() {
    
    let parameters = {
        fiscalId: +$("#fiscalId").val() == 0 ? null : +$("#fiscalId").val(),
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        documentTypeId: +$("#documentTypeId").val() == 0 ? null : +$("#documentTypeId").val(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        defaultCurrencyId: +$("#defaultCurrencyId").val() == 0 ? null : +$("#defaultCurrencyId").val(),
        createUserId: +$("#createUserId").val() == 0 ? null : +$("#createUserId").val(),
        fromAccountGLId: +$("#fromAccountGLId").val() == 0 ? null : +$("#fromAccountGLId").val(),
        toAccountGLId: +$("#toAccountGLId").val() == 0 ? null : +$("#toAccountGLId").val(),
        fromAccountDetailId: +$("#fromAccountDetailId").val() == -1 ? null : +$("#fromAccountDetailId").val(),
        toAccountDetailId: +$("#toAccountDetailId").val() == -1 ? null : +$("#toAccountDetailId").val(),
        fromAccountSGLId: +$("#fromAccountSGLId").val() == 0 ? null : +$("#fromAccountSGLId").val(),
        toAccountSGLId: +$("#toAccountSGLId").val() == 0 ? null : +$("#toAccountSGLId").val(),
        fromDocumentNo: +$("#fromDocumentNo").val() == 0 ? null : +$("#fromDocumentNo").val(),
        toDocumentNo: +$("#toDocumentNo").val() == 0 ? null : +$("#toDocumentNo").val(),
        fromJournalId: +$("#fromJournalId").val() == 0 ? null : +$("#fromJournalId").val(),
        toJournalId: +$("#toJournalId").val() == 0 ? null : +$("#toJournalId").val(),
        toExchangeRate: +$("#toExchangeRate").val() == 0 ? null : transformNumbers.toNormal($("#toExchangeRate").val()),
        fromAmountDebit: +$("#fromAmountDebit").val() == 0 ? null : transformNumbers.toNormal($("#fromAmountDebit").val()),
        toAmountDebit: +$("#toAmountDebit").val() == 0 ? null : transformNumbers.toNormal($("#toAmountDebit").val()),
        fromAmountCredit: +$("#fromAmountCredit").val() == 0 ? null : transformNumbers.toNormal($("#fromAmountCredit").val()),
        toAmountCredit: +$("#toAmountCredit").val() == 0 ? null : transformNumbers.toNormal($("#toAmountCredit").val()),
        fromDocumentDatePersian: $("#fromDocumentDatePersian").val() == "" ? null : $("#fromDocumentDatePersian").val(),
        toDocumentDatePersian: $("#toDocumentDatePersian").val() == "" ? null : $("#toDocumentDatePersian").val(),
        description: $("#description").val() == "" ? null : $("#description").val(),
        bySystem: $("#bySystem").val() == -1 ? null : $("#bySystem").val(),
        pageNo: 0,
        pageRowsCount: +$(`#dropDownCountersName`).text(),
    };

    reportParameters = parameters;

    return parameters;
}

function reportParameter() {

   

    let reportParameters = [
        { Item: "Pageno", Value: null },
        { Item: "Pagerowscount", Value: null },
        { Item: "branchId", Value: $("#branchId").val() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "documentTypeId", Value: +$("#documentTypeId").val() == 0 ? null : +$("#documentTypeId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "currencyId", Value: +$("#defaultCurrencyId").val() == 0 ? null : +$("#defaultCurrencyId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "actionId", Value: $("#actionId").val() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "createUserId", Value: +$("#createUserId").val() == 0 ? null : +$("#createUserId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "description", Value: $("#description").val() == "" ? null : $("#description").val(), SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "fromAccountGLId", Value: +$("#fromAccountGLId").val() == 0 ? null : +$("#fromAccountGLId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toAccountGLId", Value: +$("#toAccountGLId").val() == 0 ? null : +$("#toAccountGLId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromAccountSGLId", Value: +$("#fromAccountSGLId").val() == 0 ? null : +$("#fromAccountSGLId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toAccountSGLId", Value: +$("#toAccountSGLId").val() == 0 ? null : +$("#toAccountSGLId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromAccountDetailId", Value: +$("#fromAccountDetailId").val() == -1 ? null : +$("#fromAccountDetailId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toAccountDetailId", Value: +$("#toAccountDetailId").val() == -1 ? null : +$("#toAccountDetailId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromDocumentNo", Value: +$("#fromDocumentNo").val() == 0 ? null : +$("#fromDocumentNo").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toDocumentNo", Value: +$("#toDocumentNo").val() == 0 ? null : +$("#toDocumentNo").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromJournalId", Value: +$("#fromJournalId").val() == 0 ? null : +$("#fromJournalId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "toJournalId", Value: +$("#toJournalId").val() == 0 ? null : +$("#toJournalId").val(), SqlDbType: dbtype.Int, Size: 10 },
        { Item: "fromDocumentDate", Value: $(`#fromDocumentDatePersian`).val() != "" ? convertToMiladiDate($(`#fromDocumentDatePersian`).val()) : null, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toDocumentDate", Value: $(`#toDocumentDatePersian`).val() != "" ? convertToMiladiDate($(`#toDocumentDatePersian`).val()) : null, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "bySystem", Value: $("#bySystem").val() == -1 ? null : $("#bySystem").val() },
        { Item: "FromDocumentDatePersian", Value: $("#fromDocumentDatePersian").val(), itemType: "Var" },
        { Item: "ToDocumentDatePersian", Value: $("#toDocumentDatePersian").val(), itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
    ]

    return reportParameters;
}

function export_JournalVoucherSearch_csv() {
    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    export_csv_report(csvModel)
}

function customeresetFilterForms() {
    $("#fromAccountGLId").val("1");
    $("#toAccountGLId").val("999");
    $("#fromAccountSGLId").val("1");
    $("#toAccountSGLId").val("9999");
    $("#fromAccountDetailId").val("-1");
    $("#toAccountDetailId").val("-1");
    $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
    $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    $("#bySystem").val("-1");
}

$("#resetFilters").click(function () {
    $("#fiscalId").val("0").trigger("change");
    $("#branchId").val("0").trigger("change");
    $("#defaultCurrencyId").val("0").trigger("change");
    $("#documentTypeId").val("0").trigger("change");
    $("#actionId").val("0").trigger("change");
    $("#fromAccountGLId").val("0");
    $("#toAccountGLId").val("999");
    $("#fromAccountSGLId").val("0");
    $("#toAccountSGLId").val("9999");
    $("#fromAccountDetailId").val("-1");
    $("#toAccountDetailId").val("-1");
    $("#fromJournalId").val("");
    $("#toJournalId").val("");
    $("#fromDocumentNo").val("");
    $("#toDocumentNo").val("");
    $("#fromExchangeRate").val("");
    $("#toExchangeRate").val("");
    $("#fromAmountDebit").val("");
    $("#toAmountDebit").val("");
    $("#fromAmountCredit").val("");
    $("#toAmountCredit").val("");
    $("#description").val("");
    $("#createUserId").val("0").trigger("change");
    $("#fromDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
})

$("#getReport").on("click", async function () {

    var check = controller_check_authorize("JournalReportApi", "VIW");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {

            if (res) {
                loadingAsync(true, "getReport", "fas fa-sticky-note");
                getReport();
            }
            else {
                var msg = alertify.error('تاریخ سند در بازه معتبر نمیباشد');
                msg.delay(alertify_delay);
                return;
            }
        });
    }
    else {
        await loadingAsync(true, "getReport", "fas fa-sticky-note");
        await getReport();
    }
});

$("#showReport").on("click", async function () {

    var check = controller_check_authorize("JournalReportApi", "PRN");
    if (!check)
        return;

    var validate = form.validate();
    if (!validate) return;

    var reportParameters = reportParameter();

    var report_url = `${stimulsBaseUrl.FM.Prn}AccountJournal_Search.mrt`;

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: report_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

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
                var fiscalEndDate = result.endDatePersian;
                $("#fromDocumentDatePersian").val(fiscalStartDate);
                $("#toDocumentDatePersian").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_fiscalYearGetReccord);
                return "";
            }
        });
    }
    else {
        $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
        $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    }
})

window.Parsley._validatorRegistry.validators.comparedate = undefined
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

window.Parsley._validatorRegistry.validators.compareshamsidateyear = undefined
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

window.Parsley._validatorRegistry.validators.minlengthdescription = undefined
window.Parsley.addValidator('minlengthdescription', {
    validateString: function (value) {

        if (value == "")
            return true;

        if ($.trim(value).length < 4 && value !== "") {
            return false
        }

        return true;
    },
    messages: {
        en: 'تعداد کارکترهای وروردی باید بزرگتر یا مساوی %s باشد'
    }

});

init();