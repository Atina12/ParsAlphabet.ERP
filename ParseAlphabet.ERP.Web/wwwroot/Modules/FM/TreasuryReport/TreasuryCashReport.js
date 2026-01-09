var viewData_controllername = "TreasuryReportApi",
    viewData_form_title = "گزارش صندوق",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_FM}/${viewData_controllername}/treasuryfundreportpreview`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_FM}/${viewData_controllername}/reptreasurycashcolumns`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/reptreasurysearchcsv`,
    stageFormPlate = 'TreasuryIndex', form = $('#TreasuryCash').parsley(),
    reportParameters = [],
    reportUrl = `${stimulsBaseUrl.FM.Rep}TreasuryCashReportPreview.mrt`,
    viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`,
    pagetable_formkeyvalue = [], arr_pagetables = [];


function initTresuryCashReport() {

    $(".select2").select2()

    $("#lastStep").prop("checked", true);
    funkyradio_onchange($("#lastStep"));

    kamaDatepicker('fromTreasuryDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toTreasuryDatePersian', { withTime: false, position: "bottom" });

    inputMask()
    settingReportModule();
    getHeaderColumns();

    fillDropDown()

    $("#cashFlowCategoryId").val(0);
    $("#treasurySubjectId").val(0).trigger("change");

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 100)
}

function fillDropDown() {

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true, 0, false, 3, "انتخاب کنید");
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") });
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false, 3, "انتخاب کنید");
    fill_select2(`api/GNApi/noseries_getdropdown`, "noSeriesId", true, 0, false, 3, "انتخاب کنید", () => { $("#noSeriesId").trigger("change") });
    fill_select2("/api/FM/TreasurySubjectApi/getdropdown", "treasurySubjectId", true, 1, false, 3, "انتخاب کنید");
    fill_select2(`/api/GN/UserApi/getdropdown`, "createUserId", true, "2/false/false", false, 3, "انتخاب کنید");
    fill_select2(`/api/FM/BankApi/getdropdownhasaccount`, "bankId", true, 0, false, 3, "انتخاب کنید");
    fill_dropdown("/api/FMApi/cashflowcategory_getdropdown", "id", "name", "cashFlowCategoryId", true, 0);

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
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        createUserId: +$("#createUserId").val() == 0 ? null : +$("#createUserId").val(),
        stageId: $("#stageId").val() == "" ? null : $("#stageId").val().join(","),
        currencyId: +$("#currencyId").val() == 0 ? null : +$("#currencyId").val(),
        fundTypeId: +$("#fundTypeId").val() == 0 ? null : +$("#fundTypeId").val(),
        TreasurySubjectId: +$("#treasurySubjectId").val() == 0 ? null : +$("#treasurySubjectId").val(),
        bankId: +$("#bankId").val() == 0 ? null : +$("#bankId").val(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().join(","),
        lastStep: $("#lastStep").prop("checked") == true ? 2 : 1,
        workFlowId: $("#workflowId").val() == "" ? null : $("#workflowId").val().join(","),
        inOut: +$("#inOut").val() == 0 ? null : +$("#inOut").val(),
        cashFlowCategoryId: +$("#cashFlowCategoryId").val() == 0 ? null : +$("#cashFlowCategoryId").val(),
        noSeriesId: +$("#noSeriesId").val() == 0 ? null : +$("#noSeriesId").val(),
        accountDetailId: +$("#accountDetailId").val() == 0 ? null : +$("#accountDetailId").val(),
        pageno: 0,
        //pagerowscount: +$(`#dropDownCountersName`).text(),
    };
    return parameters;

}

function getCashFlowCategoryId(treasurySubjectId) {
    let url = `${viewData_baseUrl_FM}/TreasurySubjectApi/getcashflowcategoryid`;
    let outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(treasurySubjectId),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return outPut.responseJSON;
}

function click_link_report(elm) {
    let id = $(elm).text();
    let stageId = $(elm).parents("tr").data("stageid");
    let requestId = $(elm).parents("tr").data("requestid");
    let workflowId = $(elm).parents("tr").data("workflowid");
    let stageClassId = $(elm).parents("tr").data("stageclassid");

    if (stageClassId == 3)
        navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`, 3);
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

function reportParameter() {

    let reportParameters = [
        { Item: "FromTreasuryDate", Value: $(`#fromTreasuryDatePersian`).val() != "" ? convertToMiladiDate($(`#fromTreasuryDatePersian`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToTreasuryDate", Value: $(`#toTreasuryDatePersian`).val() != "" ? convertToMiladiDate($(`#toTreasuryDatePersian`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "BankId", Value: +$(`#bankId`).val() == 0 ? null : +$("#bankId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "TreasurySubjectId", Value: +$(`#treasurySubjectId`).val() == 0 ? null : +$("#treasurySubjectId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "BranchId", Value: $(`#branchId`).val() == "" ? null : $("#branchId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 20 },
        { Item: "CurrencyId", Value: +$("#currencyId").val() == 0 ? null : $("#currencyId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "StageId", Value: $(`#stageId`).val() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 20 },
        { Item: "ActionId", Value: $(`#actionId`).val() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 20 },
        { Item: "CreateUserId", Value: +$(`#createUserId`).val() == 0 ? null : $("#createUserId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "FundTypeId", Value: +$(`#fundTypeId`).val() == 0 ? null : +$("#fundTypeId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "LastStep", Value: $("#lastStep").prop("checked") == true ? 2 : 1 },
        { Item: "Inout", Value: +$(`#inOut`).val() == 0 ? null : $("#inOut").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "CashFlowCategoryId", Value: $("#cashFlowCategoryId").val() == 0 ? null : $("#cashFlowCategoryId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "NoSeriesId", Value: $("#noSeriesId").val() == 0 ? null : $("#noSeriesId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "AccountDetailId", Value: $("#accountDetailId").val() == 0 ? null : $("#accountDetailId").val(), SqlDbType: dbtype.Int, Size: 20 },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 },

        { Item: "FromDatePersian", Value: $(`#fromTreasuryDatePersian`).val() != "" ? $(`#fromTreasuryDatePersian`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toTreasuryDatePersian`).val() != "" ? $(`#toTreasuryDatePersian`).val() : "", itemType: "Var" },
    ]
    return reportParameters;
}

function export_TreasurySearch_csv() {

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    export_csv_report(csvModel)
}

function customeresetFilterForms() {
    $("#fromTreasuryDatePersian").val(moment().format("jYYYY/01/01"));
    $("#toTreasuryDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    $("#lastStep").prop("checked", true).trigger("change");
}

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

$("#branchId").change(function () {

    var branchId = $(this).val() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = workflowCategoryIds.treasury.id,
        stageClassId = 0;
    //stageClassId = "17,22";
    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "", () => { $("#workflowId").trigger("change") }, "", false, false, true);

});

$("#workflowId").change(function () {

    let workflowId = $(this).val() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.treasury.id,
        stageClassId = "1,3",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);
});

$('#stageId').on('change', function () {
    
    let stageId = $("#stageId").val() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val() == "" ? null : $("#workflowId").val().join(","),
        stageClassId = "1,3";
    let branchId = +$("#branchId").val() == "" ? null : $("#branchId").val().join(",");
    let workFlowCategoryId = workflowCategoryIds.treasury.id;

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);

   

    $("#fundTypeId").html("<option value='0'>انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_WF}/StageFundItemTypeApi/stagefunditemtype_getdropdown`, "fundTypeId", true, `${stageId}/6`);

});

$('#treasurySubjectId').on('change', function () {
    if (+$("#treasurySubjectId").val() > 0) {
        let result = getCashFlowCategoryId(+$("#stageId").val(), +$("#actionId").val());
        if (result == 0)
            $("#cashFlowCategoryId").val(0).prop("disabled", false).trigger("change");
        else
            $("#cashFlowCategoryId").val(result).prop("disabled", true).trigger("change");
    }
    else
        $("#cashFlowCategoryId").val(0).prop("disabled", false).trigger("change");
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

$("#noSeriesId").on("change", function () {

    let noSeriesId = +$(this).val()

    $("#accountDetailId").html('<option value="0">انتخاب کنید</option>').val(0).trigger("change.slect2")

    if (noSeriesId == 0) {
        $("#accountDetailId").prop("disabled", true)
        return
    }

    $("#accountDetailId").removeAttr("disabled")

    getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId")

})

initTresuryCashReport()
