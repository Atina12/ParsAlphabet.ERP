var viewData_controllername = "TreasuryReportApi",
    viewData_form_title = "گزارش حساب های بانکی",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_FM}/${viewData_controllername}/reptreasurybankaccountpreview`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_FM}/${viewData_controllername}/reptreasurybankaccountcolumns`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/reptreasurybankaccountcsv`,
    viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`,
    reportParameters = [], reportUrl = "", form = $('#TreasuryBankAccount').parsley(),
    reportUrl = `${stimulsBaseUrl.FM.Rep}TreasurySelectBankAccountReportPreview.mrt`,
    stageFormPlate = 'TreasuryIndex',
    statusId = 0, removedFundTypes = [1, 9], pagetable_formkeyvalue = [], arr_pagetables = [];



function initTreasuryBankAccountReport() {

    $(".select2").select2();

    inputMask();

    kamaDatepicker('fromTreasuryDatePersian', { withTime: false, position: "bottom" });

    kamaDatepicker('toTreasuryDatePersian', { withTime: false, position: "bottom" });

    settingReportModule();

    getHeaderColumns();

    fillDropDown()

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 1000)
}

function fillDropDown() {
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true, 0, false, 3, "انتخاب کنید");
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") });
    fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdown`, "bankId", true, 0, false, 3, "انتخاب کنید");
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false, 3, "انتخاب کنید");
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
            var fromDate = +$("#fromTreasuryDatePersian").val().replace(/\//g, "");
            var toDate = +$("#toTreasuryDatePersian").val().replace(/\//g, "");
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

    reportParameters = parameter();
    main_getReport();
};

function parameter() {

    let parameters = {
        fromTreasuryDatePersian: $("#fromTreasuryDatePersian").val() == "" ? null : $("#fromTreasuryDatePersian").val(),
        toTreasuryDatePersian: $("#toTreasuryDatePersian").val() == "" ? null : $("#toTreasuryDatePersian").val(),
        bankId: +$("#bankId").val() == 0 ? null : +$("#bankId").val(),
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        currencyId: +$("#currencyId").val() == 0 ? null : +$("#currencyId").val(),
        workflowId: $("#workflowId").val() == "" ? null : $("#workflowId").val().toString(),
        stageId: $("#stageId").val() == "" ? null : $("#stageId").val().toString(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        bankAccountId: +$("#bankAccountId").val() == 0 ? null : +$("#bankAccountId").val(),
        fundTypeId: +$("#fundTypeId").val() == 0 ? null : +$("#fundTypeId").val(),
        bankReportStatus: true,
        pageno: 0,
        //pagerowscount: +$(`#dropDownCountersName`).text()
    };
    return parameters;
}

function reportParameter() {

    let reportParameters = [
        { Item: "FromTreasuryDate", Value: $("#fromTreasuryDatePersian").val() == "" ? null : convertToMiladiDate($(`#fromTreasuryDatePersian`).val()), SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToTreasuryDate", Value: $("#toTreasuryDatePersian").val() == "" ? null : convertToMiladiDate($(`#toTreasuryDatePersian`).val()), SqlDbType: dbtype.Date, Size: 10 },
        { Item: "BankId", Value: +$("#bankId").val() == 0 ? null : +$("#bankId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BranchId", Value: $("#branchId").val() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "CurrencyId", Value: +$("#currencyId").val() == 0 ? null : +$("#currencyId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FundTypeId", Value: +$("#fundTypeId").val() == 0 ? null : +$("#fundTypeId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "StageId", Value: $("#stageId").val() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ActionId", Value: $("#actionId").val() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "BankAccountId", Value: +$("#bankAccountId").val() == 0 ? null : +$("#bankAccountId").val(), SqlDbType: dbtype.BigInt, Size: 0 },
        { Item: "FromDatePersian", Value: $(`#fromTreasuryDatePersian`).val(), itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toTreasuryDatePersian`).val(), itemType: "Var" },
        { Item: "pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
    ]
    return reportParameters;
}

function export_TreasurySearch_csv() {

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    export_csv_report(csvModel)
}

function click_link_report(elm) {

    let id = $(elm).text();
    let stageId = $(elm).parents("tr").data("stageid");
    let requestId = $(elm).parents("tr").data("requestid");
    let workflowId = $(elm).parents("tr").data("workflowid");
    let stageClassId = $(elm).parents("tr").data("stageclassid");

    if (+stageClassId == 3)
        navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`,3);
    else
        navigateToModalTreasury(`/FM/TreasuryRequestLine/display/${id}/1/${stageId}/${workflowId}`);

}

function navigateToModalTreasury(href, treasuryOrTresuryRequets = null) {

    initialPage();
    if (treasuryOrTresuryRequets == 3) {
        $("#contentdisplayTreasuryLine #content-page").addClass("displaynone");
        $("#contentdisplayTreasuryLine #loader").removeClass("displaynone");
    }
    else {
        $("#contentdisplayTreasuryRequestLine #content-page").addClass("displaynone");
        $("#contentdisplayTreasuryRequestLine #loader").removeClass("displaynone");
    }

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            treasuryOrTresuryRequets == 3 ? $(`#contentdisplayTreasuryLine`).html(result) : $(`#contentdisplayTreasuryRequestLine`).html(result);

        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    if (treasuryOrTresuryRequets == 3) {
        $("#contentdisplayTreasuryLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
        $("#contentdisplayTreasuryLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
        $("#contentdisplayTreasuryLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
        $("#contentdisplayTreasuryLine .itemLink").css("pointer-events", " none");
    }
    else {
        $("#contentdisplayTreasuryRequestLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
        $("#contentdisplayTreasuryRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
        $("#contentdisplayTreasuryRequestLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
        $("#contentdisplayTreasuryRequestLine .itemLink").css("pointer-events", " none");
    }
}

function customeresetFilterForms() {
    $("#fromTreasuryDatePersian").val(moment().format("jYYYY/01/01"));
    $("#toTreasuryDatePersian").val(moment().format("jYYYY/jMM/jDD"));
}

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
                $("#fromTreasuryDatePersian").val(fiscalStartDate);
                $("#toTreasuryDatePersian").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_fiscalYearGetReccord);
                return "";
            }
        });
    }
    else {
        $("#fromTreasuryDatePersian").val($("#yearDate").val());
        $("#toTreasuryDatePersian").val($("#nowDate").val());
    }
})

$("#bankId").on("change", function () {

    var bankId = +$(this).val();
    if (bankId > 0) {
        $("#bankAccountId").empty().prop("disabled", false).trigger("change");
        $("#bankAccountId").html(`<option value="0">انتخاب کنید</option>`);
        fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown_bankId`, "bankAccountId", true, bankId, false);
    }
    else
        $("#bankAccountId").val(0).prop("disabled", true).trigger("change");
});

$("#branchId").change(function () {

    var branchId = +$(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = workflowCategoryIds.treasury.id,
        stageClassId = 0;

    $("#workflowId").empty();
  

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "", () => { $("#workflowId").trigger("change") }, "", false, false, true);
});

$("#workflowId").change(function () {

    let workflowId = +$(this).val() == ""  ? null : +$(this).val().join(","),
        branchId = $("#branchId").val() == ""  ? null : $("#branchId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.treasury.id,
        stageClassId = "1,3",
        bySystem = 0,
        isActive = 2;
    
    $("#stageId").empty();
    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);
   
});

$('#stageId').on('change', function () {

    let stageId = +$("#stageId").val() == "" ? null : $("#stageId").val().join(",");
    let workflowId = +$("#workflowId").val() == "" ? null : $("#workflowId").val().join(",");
    let branchId = +$("#branchId").val() == "" ? null : $("#branchId").val().join(",");
    let workFlowCategoryId = workflowCategoryIds.treasury.id;
    let stageClassId = "1,3";

    $("#actionId").empty();
   
    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);

    $("#fundTypeId").html("<option value='0'>انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_WF}/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "fundTypeId", true, `${stageId}/6`);
});

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;


    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {

            if (res) {
                loadingAsync(true, "getReport", "fas fa-sticky-note");
                setTimeout(() => { getReport(); }, 5);
            }
            else {
                var msg = alertify.error('تاریخ سند در بازه معتبر نمیباشد');
                msg.delay(alertify_delay);
                return;
            }
        });
    }
    else {
        loadingAsync(true, "getReport", "fas fa-sticky-note");
        setTimeout(() => { getReport(); }, 5);
    }
});

$("#showReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportParameters = reportParameter();

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

initTreasuryBankAccountReport()