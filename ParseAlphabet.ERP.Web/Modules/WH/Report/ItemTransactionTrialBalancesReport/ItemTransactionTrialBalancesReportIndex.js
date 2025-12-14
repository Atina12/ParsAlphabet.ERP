var viewData_controllername = "ItemTransactionTrialBalancesReportApi",
    viewData_form_title = "",//"گزارش تراز و دفاتر تعدادی",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactiontrialbalancepreview`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionlevelwarehousegetcolumns`,
    viewData_PreviewReport_LevelZoneGetColumn = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionlevelzonegetcolumns`,
    viewData_PreviewReport_LevelBinGetColumn = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionlevelbingetcolumns`,
    viewData_PreviewReport_NoteWarehouseGetColumn = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionnotewarehousecolumns`,
    viewData_PreviewReport_NoteZoneGetColumn = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionnotezonecolumns`,
    viewData_PreviewReport_NoteBinGetColumn = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionnotebincolumns`,
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactiontrialbalancecsv`,
    viewData_ReportJsonForTree_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getItemTransactionTrialBalanceReportJsonForTree`,
    levelWarehouseStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelWarehouseReportPreview.mrt`,
    levelWarehouseTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelWarehouseTrialReportPreview.mrt`,
    levelZoneStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelZoneReportPreview.mrt`,
    levelZoneTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelZoneTrialReportPreview.mrt`,
    levelBinStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelBinReportPreview.mrt`,
    levelBinTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}LevelBinTrialReportPreview.mrt`,
    noteWarehouseStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteWarehouseReportPreview.mrt`,
    noteWarehouseTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteWarehouseTrialReportPreview.mrt`,
    noteZoneStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteZoneReportPreview.mrt`,
    noteZoneTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteZoneTrialReportPreview.mrt`,
    noteBinStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteBinReportPreview.mrt`,
    noteBinTrialStimulUrl = `${stimulsBaseUrl.WH.Rep}NoteBinTrialReportPreview.mrt`,
    fromDocumentDate1 = null,
    toDocumentDate1 = null,
    levelWarehouseId = 0,
    levelZoneId = 0,
    levelBinId = 0,
    levelItemId = 0,
    defaultGetResult = false,
    levelGetReportForNextAndPrevious = null,
    stageclassIds = "1,3,4,8",
    saveFunctionsTrees = { funcName: null, func: null, currentId: null },
    trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 },
    isNext = false,
    itemtransactionwarehouse = "",
    itemtransactionzone = "",
    itemtransactionbin = "",
    parameters = [],
    roleId = getRoleId(),
    reportUrl = "",
    affectedQuantityBeginingSum = -1,
    affectedQuantityDebitSum = -1,
    affectedQuantityCreditSum = -1,
    affectedQuantityRemainingSum = -1,
    affectedAmountBeginingSum = -1,
    affectedAmountDebitSum = -1,
    affectedAmountCreditSum = -1,
    affectedAmountRemainingSum = -1,
    affectedAmountRemainSum = -1,
    form = $('#ItemTransactionTrialBalanceSearch').parsley();



function initform() {
    $(".select2").select2();
    //$("#ItemTransactionTrialBalanceSearch .select2").select2();

    $('#columnType').bootstrapToggle();
    $('#columnTypeForPrintAndExel').bootstrapToggle();
    $("#reportTypeIdForPrintAndExel").select2()

    $("#fromDocumentDatePersian").inputmask();
    $("#toDocumentDatePersian").inputmask();

    kamaDatepicker('fromDocumentDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toDocumentDatePersian', { withTime: false, position: "bottom" });



    settingReportModule();

    getHeaderColumns();


    fillDropDownItemTransAction()

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 1000)
};

function fillDropDownItemTransAction() {
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, false, false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown/2/false/false`, "createUserId", true);
    fill_select2("/api/WHApi/itemtype_getdropdown", "itemTypeId", true, "1,4", false, 4, "", () => { $("#itemTypeId").trigger("change") });
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true);
    fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/unitgetdropdown`, "unitId", true, false, false, 3, "", () => { $("#unitId").trigger("change") }, "", false, false, true);
}

function documentDateValid(callBack = undefined) {
    let url = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$("#fiscalId").val()),
        success: function (result) {
            var fiscalStartDate = +result.startDatePersian.replaceAll(/\//g, "");
            var fiscalEndDate = +result.endDatePersian.replaceAll(/\//g, "");
            var fromDate = +$("#fromDocumentDatePersian").val().replaceAll(/\//g, "");
            var toDate = +$("#toDocumentDatePersian").val().replaceAll(/\//g, "");
            if ((fromDate <= fiscalEndDate && fromDate >= fiscalStartDate) && (toDate <= fiscalEndDate && toDate >= fiscalStartDate))
                result = true;
            else
                result = false;
            if (typeof callBack == "function")
                callBack(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });
}

async function getReport() {

    reportParameters = parameter();
    //parameters = parameter();
    let reportType = +$("#reportTypeId").val();

    if (reportType == 1) {
        var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");
        viewData_form_title = "تراز - انبار";
        initialPageing();


        createPageFooterInfo(0, 0, 0, false);
        if (!isLoadingData) {
            getReportAsync(reportParameters, () => {
                loadingAsync(false, "levelGetReport", "fas fa-sticky-note");

                $("#treeHeaderReport").addClass("displaynone");

                checkMainNode();


                if (isNext)
                    $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
                else {
                    if (trackingTree.warehouseId == 0)
                        $(`#dataRowsReport tr:eq(0)`).addClass("highlight");
                    else
                        $(`#dataRowsReport tr[data-warehouseid=${trackingTree.warehouseId}]`).addClass("highlight");
                }

                setTitleReport(viewData_form_title);
                setAffectedValuePerRequest();
                checkSumDynamic(reportParameters);
            });

        }
        $("#next-level").removeAttr("disabled");
    }
    else {

        var level = (reportType == 2 || reportType == 4) ? 1 : (reportType == 3 || reportType == 5) ? 2 : 3;
        /*        reportParameters = parameter();*/
        var nodeDetailFunc = "";


        switch (reportType) {
            case 2:
                //perentId=warehouseId , zoneId=identityId
                nodeDetailFunc = "getLevelZone_Detail"
                viewData_form_title = "تراز - انبار - بخش";
                break;
            case 3:
                //perentId=zoneId , binId=identityId
                nodeDetailFunc = "getLevelBin_Detail"
                viewData_form_title = "تراز - انبار - بخش - پالت";
                break;
            case 4:
                //perentId=warehouseId , itemId=identityId
                nodeDetailFunc = "getLevelItem_Detail"
                viewData_form_title = "کاردکس - انبار";
                break;
            case 5:
                //perentId=zoneId , itemId=identityId
                nodeDetailFunc = "getLevelZoneItem_Detail"
                viewData_form_title = "کاردکس - انبار - بخش";
                break;
            case 6:
                //perentId=binId , itemId=identityId
                nodeDetailFunc = "getLevelBinItem_Detail"
                viewData_form_title = "کاردکس - انبار -  بخش - پالت";
                break;
            default:
                nodeDetailFunc = "getLevelZone_Detail"
                viewData_form_title = "تراز - انبار ";
                break;
        }

        GetReportJsonForTreeAsync(reportParameters).then(
            (result) => {
                loadingAsync(false, "levelGetReport", "fas fa-sticky-note");

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

                checkSumDynamic(reportParameters);
                setTitleReport(viewData_form_title);
                defaultGetResult = false;

                let currentElm = $(`#${saveFunctionsTrees.currentId}`);

                if (isNext && result.length != 0)
                    currentElm.click()

                else if (result.length != 0) {

                    if (trackingTree.warehouseId == 0)
                        currentElm.click()

                    else {

                        if (saveFunctionsTrees.funcName == "getLevelZone_Detail")
                            getLevelZone_Detail(currentElm, false, `${trackingTree.zoneId}`, `${trackingTree.warehouseId}`)

                        else if (saveFunctionsTrees.funcName == "getLevelItem_Detail")
                            getLevelItem_Detail(currentElm, false, `${trackingTree.itemId}`, `${trackingTree.warehouseId}`)

                        else if (saveFunctionsTrees.funcName == "getLevelBin_Detail")
                            getLevelBin_Detail(currentElm, false, `${trackingTree.binId}`, `${trackingTree.zoneId}`)

                        else if (saveFunctionsTrees.funcName == "getLevelZoneItem_Detail")
                            getLevelZoneItem_Detail(currentElm, false, `${trackingTree.itemId}`, `${trackingTree.zoneId}`)

                        else if (saveFunctionsTrees.funcName == "getLevelBinItem_Detail")
                            getLevelBinItem_Detail(currentElm, false, `${trackingTree.itemId}`, `${trackingTree.binId}`)

                    }
                }
            },
            (result) => {
                loadingAsync(false, "levelGetReport", "fas fa-sticky-note");

                return;
            })
    }

};

function getZonePrintDropDown() {
    $("#zoneIdPrint").empty();
    $("#binIdPrint").empty();
    let warehouseId = $("#warehouseIdPrint").val();

    if (warehouseId.length > 0)
        fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneIdPrint", true, `${warehouseId.toString()}`, false, 3, "انتخاب", undefined, "", false, false, true);

    else {
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    }

}

function getBinPrintDropDown(zoneIdPrint) {

    let warehouseIdPrint = $("#warehouseIdPrint").val();
    $("#binIdPrint").empty();
    if (warehouseId.length > 0 && zoneId.length > 0)

        fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binIdPrint", true, `${warehouseIdPrint.toString()}/${zoneIdPrint.toString()}`, false, 3, "انتخاب", undefined, "", false, false, true);
    else

        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);

}

function export_ItemTransactionTrialSearch_csv() {
    loadingAsync(true, "exportCSV", "fa fa-save");
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();

    csvModel.warehouseId = +$("#warehouseIdPrint").val() == 0 ? null : +$("#warehouseIdPrint").val();
    csvModel.zoneId = +$("#zoneIdPrint").val() == 0 ? null : +$("#zoneIdPrint").val();
    csvModel.binId = +$("#binIdPrint").val() == 0 ? null : +$("#binIdPrint").val();
    csvModel.columnType = $("#columnTypeForPrintAndExel").prop("checked") == true ? 0 : 1
    csvModel.reportType = +$("#reportTypeIdForPrintAndExel").val() == null ? 0 : +$("#reportTypeIdForPrintAndExel").val()

    csvModel.affectedQuantityBeginingSum = -1;
    csvModel.affectedQuantityDebitSum = -1;
    csvModel.affectedQuantityCreditSum = -1;
    csvModel.affectedQuantityRemainingSum = -1;
    csvModel.affectedAmountBeginingSum = -1;
    csvModel.affectedAmountDebitSum = -1;
    csvModel.affectedAmountCreditSum = -1;
    csvModel.affectedAmountRemainingSum = -1;
    csvModel.affectedAmountRemainSum = -1;


    csvModel.pageno = null;
    csvModel.pagerowscount = null;

    switch (csvModel.reportType) {
        case 1:

            viewData_form_title = "تراز انبار";
            break;
        case 2:
            viewData_form_title = "تراز انبار بخش";
            break;
        case 3:
            viewData_form_title = "تراز انبار بخش پالت";
            break;
        case 4:
            viewData_form_title = "کاردکس انبار";
            break;
        case 5:
            viewData_form_title = "کاردکس انبار بخش";
            break;
        case 6:
            viewData_form_title = "کاردکس انبار بخش پالت";
            break;
    }

    exportCsv(csvModel, viewData_form_title)

}

function exportCsv(csvModel, viewData_form_title) {

    var urlCSV = viewData_csv_url;

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            loadingAsync(false, "exportCSV", "fa fa-save");
            var downloadUrl = URL.createObjectURL(result);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${viewData_form_title}.csv`;
            document.body.appendChild(a);
            a.click();

        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });
}

function beforExport_TransactionTrialSearch_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $("#warehouseIdPrint").empty()
    $("#zoneIdPrint").empty()
    $("#binIdPrint").empty()

    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getalldatadropdown/null`, "warehouseIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);


    $("#exportCSV").removeClass("d-none")
    $("#stimul_preview").addClass("d-none")
    $("#exportCSV").attr("tabindex", 37)
    modal_show("getCsvReportParameter")
    $("#printOrExelModalTitle").text("اکسل")
}

function parameter() {

    var arrAttribute = [];

    if ($(`#atrributeId`).val() !== "") {
        var attrbute = $(`#atrributeId`).val();
        attrbute.forEach(function (x, i) {
            arrAttribute.push({ AttributeIds: x });
        });
    }

    let parameters = {
        columnType: $("#columnType").prop("checked") == true ? 0 : 1,
        fromDocumentDatePersian: $("#fromDocumentDatePersian").val() == "" ? null : $("#fromDocumentDatePersian").val(),
        toDocumentDatePersian: $("#toDocumentDatePersian").val() == "" ? null : $("#toDocumentDatePersian").val(),
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        warehouseId: $(`#warehouseId`).val().toString() == "" ? null : $(`#warehouseId`).val().toString(),
        zoneId: $(`#zoneId`).val().toString() == "" ? null : $(`#zoneId`).val().toString(),
        binId: $(`#binId`).val().toString() == "" ? null : $(`#binId`).val().toString(),
        itemCategoryId: $(`#categoryId`).val().toString() == "" ? null : $(`#categoryId`).val().toString(),
        workflowId: $(`#workflowId`).val().toString() == "" ? null : $(`#workflowId`).val().toString(),
        stageId: $(`#stageId`).val().toString() == "" ? null : $(`#stageId`).val().toString(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        itemTypeId: +$("#itemTypeId").val() == 0 ? null : +$("#itemTypeId").val(),
        itemIds: $(`#itemId`).val().toString() == "" ? null : $(`#itemId`).val().toString(),
        attributeIdList: $(`#atrributeId`).val() !== "" ? $(`#atrributeId`).val().join("-") : null,
        unitIds: $(`#unitId`).val().toString() == "" ? null : $(`#unitId`).val().toString(),
        subUnitIds: $(`#subUnitId`).val().toString() == "" ? null : $(`#subUnitId`).val().toString(),
        headerCreateUserId: +$("#createUserId").val() == 0 ? null : +$(`#createUserId`).val(),
        reportType: +$("#reportTypeId").val() == 0 ? null : +$("#reportTypeId").val(),
        pageRowsCount: +$(`#dropDownCountersName`).text(),
        pageNo: 0,
        affectedQuantityBeginingSum: affectedQuantityBeginingSum,
        affectedQuantityDebitSum: affectedQuantityDebitSum,
        affectedQuantityCreditSum: affectedQuantityCreditSum,
        affectedQuantityRemainingSum: affectedQuantityRemainingSum,
        affectedAmountBeginingSum: affectedAmountBeginingSum,
        affectedAmountDebitSum: affectedAmountDebitSum,
        affectedAmountCreditSum: affectedAmountCreditSum,
        affectedAmountRemainingSum: affectedAmountRemainingSum,
        affectedAmountRemainSum: affectedAmountRemainSum
    };
    reportParameter = parameters;
    return parameters;
}

function setAffectedValuePerRequest() {

    let affectedQuantityBeginingText = "";
    let affectedQuantityRemainingText = "";
    let affectedQuantityDebitText = "";
    let affectedQuantityCreditText = "";
    let affectedAmountBeginingText = "";
    let affectedAmountRemainingText = "";
    let affectedAmountDebitText = "";
    let affectedAmountCreditText = "";
    let affectedAmountRemainText = "";

    switch (+$("#reportTypeId").val()) {
        case 1:
        case 4:
            if ($("#columnType").prop("checked")) {//تعدادی

                if (fromDocumentDate1 != null) {

                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(7)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(7)`).text() : "-1";
                    affectedQuantityRemainingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                }
                else {
                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(7)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(7)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                }

            }
            else {//ریالی
                if (fromDocumentDate1 != null) {

                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(7)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(7)`).text() : "-1";
                    affectedAmountRemainingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                }
                else {
                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(7)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(7)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                }
            }
            break;

        case 2:
        case 5:
            if ($("#columnType").prop("checked")) {//تعدادی
                if (fromDocumentDate1 != null) {

                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedQuantityRemainingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                }
                else {
                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                }
            }
            else {//ریالی
                if (fromDocumentDate1 != null) {

                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedAmountRemainingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                }
                else {
                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(8)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(8)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                }
            }
            break;

        case 3:
        case 6:
            if ($("#columnType").prop("checked")) {//تعدادی
                if (fromDocumentDate1 != null) {

                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedQuantityRemainingText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(13)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(13)`).text() : "-1";
                }
                else {
                    affectedQuantityBeginingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedQuantityDebitText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedQuantityCreditText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                }

            }
            else {//ریالی
                if (fromDocumentDate1 != null) {

                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountRemainingText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(13)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(13)`).text() : "-1";
                }
                else {
                    affectedAmountBeginingText = $(`#dataRowsReport tr:last td:eq(9)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(9)`).text() : "-1";
                    affectedAmountDebitText = $(`#dataRowsReport tr:last td:eq(10)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(10)`).text() : "-1";
                    affectedAmountCreditText = $(`#dataRowsReport tr:last td:eq(11)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(11)`).text() : "-1";
                    affectedAmountRemainText = $(`#dataRowsReport tr:last td:eq(12)`).text() != "" ? $(`#dataRowsReport tr:last td:eq(12)`).text() : "-1";
                }
            }
            break;


        default:
    }



    if ($("#columnType").prop("checked")) {//تعدادی
        affectedQuantityBeginingSum = (affectedQuantityBeginingText.indexOf("(") !== -1 ? -1 : 1) * (+affectedQuantityBeginingText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedQuantityDebitSum = (affectedQuantityDebitText.indexOf("(") !== -1 ? -1 : 1) * (+affectedQuantityDebitText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedQuantityCreditSum = (affectedQuantityCreditText.indexOf("(") !== -1 ? -1 : 1) * (+affectedQuantityCreditText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedQuantityRemainingSum = (affectedQuantityRemainingText.indexOf("(") !== -1 ? -1 : 1) * (+affectedQuantityRemainingText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));

    }
    else {
        affectedAmountBeginingSum = (affectedAmountBeginingText.indexOf("(") !== -1 ? -1 : 1) * (+affectedAmountBeginingText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedAmountDebitSum = (affectedAmountDebitText.indexOf("(") !== -1 ? -1 : 1) * (+affectedAmountDebitText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedAmountCreditSum = (affectedAmountCreditText.indexOf("(") !== -1 ? -1 : 1) * (+affectedAmountCreditText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
        affectedAmountRemainingSum = (affectedAmountRemainingText.indexOf("(") !== -1 ? -1 : 1) * (+affectedAmountRemainingText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));
    }

    affectedAmountRemainSum = (affectedAmountRemainText.indexOf("(") !== -1 ? -1 : 1) * (+affectedAmountRemainText.replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""));

    //reportParameters.affectedCreditSum = affectedCreditSum;
    //reportParameters.affectedDebitSum = affectedDebitSum;
    //reportParameters.affectedRemainingSum = affectedRemainingSum;
}

async function getdateRange() {
    fromDocumentDate1 = null;
    toDocumentDate1 = null;

    let newFromDocumentDate = $("#fromDocumentDatePersian").val()
    let url = '/api/wh/ItemTransactionTrialBalancesReportApi/getdaterange'

    await $.ajax({
        url: url,
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
            error_handler(xhr, url)
        }
    });
}

function nexLevel() {

    if ($("#dataRowsReport #emptyRow").length == 0) {
        var selectedRow = $("#dataRowsReport tr.highlight:not(#emptyRow)");
        if (selectedRow.length > 0) {

            if (+$("#reportTypeId").val() == 1) {
                $("#reportTypeId").val(2).trigger("change");
                var warhouseId = +$(selectedRow).data("warhouseid");
                levelWarehouseId = warhouseId;
                levelGetReport();
            }
            else if (+$("#reportTypeId").val() == 2) {
                $("#reportTypeId").val(3).trigger("change");
                var zoneId = +$(selectedRow).data("zoneid");
                levelWarehouseId = +$("li span.treeSelected").parent("li").data("id");
                levelZoneId = zoneId;
                levelGetReport();
                $("#next-level").attr("disabled", "disabled");
            }

            else if (+$("#reportTypeId").val() == 4) {

                $("#reportTypeId").val(5).trigger("change");
                var itemId = +$(selectedRow).data("itemid");
                levelWarehouseId = +$("li span.treeSelected").parent("li").data("id");
                levelItemId = itemId;
                levelGetReport();
            }
            else if (+$("#reportTypeId").val() == 5) {
                $("#next-level").attr("disabled", "disabled");
                $("#reportTypeId").val(6).trigger("change");
                var itemId = +$(selectedRow).data("itemid");
                levelZoneId = +$("li span.treeSelected").parent("li").data("id");
                levelItemId = itemId;
                levelGetReport();
            }


        }

        $("#treeHeaderReport").focus();
        loadingAsync(false, "next-level", "fas fa-arrow-down");
    }
    else
        loadingAsync(false, "next-level", "fas fa-arrow-down");
}

function previousLevel() {

    var selectedRow = $("#dataRowsReport tr.highlight");
    if (selectedRow.length > 0) {

        if (+$("#reportTypeId").val() == 6) {
            isNext = true
            $("#reportTypeId").val(5).trigger("change");
            levelGetReport()
        }

        else if (+$("#reportTypeId").val() == 5) {
            isNext = true
            $("#reportTypeId").val(4).trigger("change");
            levelGetReport()
            $("#previous-level").attr("disabled", "disabled");
            $("#next-level").removeAttr("disabled");
        }

        else if (+$("#reportTypeId").val() == 3) {
            $("#next-level").removeAttr("disabled");
            isNext = true
            $("#reportTypeId").val(2).trigger("change");
            levelGetReport()
        }


        else if (+$("#reportTypeId").val() == 2) {

            isNext = true
            $("#reportTypeId").val(1).trigger("change");
            levelGetReport()
        }



    }

    $("#treeHeaderReport").focus();
    loadingAsync(false, "previous-level", "fas fa-arrow-up");

}

async function levelGetReport() {


    levelWarehouseId = 0;
    levelZoneId = 0;
    levelBinId = 0;
    levelItemId = 0;

    if (levelGetReportForNextAndPrevious == null)
        levelGetReportForNextAndPrevious = "next";

    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {
            if (res) {
                defaultGetResult = false;
                loadingAsync(true, "levelGetReport", "fas fa-sticky-note");
                getReport();
            }
            else {
                var msg = alertify.error('بازه تاریخ  در محدوده سال مالی نمی باشد');
                msg.delay(alertify_delay);
                return;
            }
        })
    }
    else {
        reportTypeForLevel = $("#reportType").val()


        levelOffices = "level"
        defaultGetResult = false;
        await loadingAsync(true, "levelGetReport", "fas fa-sticky-note");
        await getReport();

    }
}

function checkMainNode() {

    if ($("#treeHeaderReport").hasClass("displaynone")) {
        $("#previous-level").attr("disabled", "disabled");
    }
    else {
        var selectedNodeId = $("#treeview").find(".treeSelected").parent("li").attr("id");
        if (typeof selectedNodeId !== "undefined") {
            if (selectedNodeId.indexOf("warehouse") == 0)
                $("#previous-level").attr("disabled", "disabled");
            else {
                if (+$("#reportTypeId").val() == 4)
                    $("#previous-level").attr("disabled", "disabled");
                else
                    $("#previous-level").removeAttr("disabled");
            }

        }
        else
            $("#previous-level").attr("disabled", "disabled");

    }
}

function generate_treeview(list, level, clickFunc, parentId = 0, gparentId = 0, nodeLevelGlId = 0) {

    let reportType = +$("#reportTypeId").val()

    if (list == null) return "";

    var str = "";
    firstNodeOpened = false;
    for (var i = 0; i < list.length; i++) {
        nodeTabIndex += 1;
        var item = list[i];


        if (item.level == 1) {
            parentParentId = item.id
        }

        var itemFunc = "";
        if (item.level == level) {

            itemFunc = `${clickFunc}(this,true,${item.id},${parentId})`

        }


        var classStyle = "";
        var idName = "";
        var isSelected = false;

        if (item.level == level)
            classStyle = "cur-pointer";

        if (item.childCount != 0 && i == list.length - 1)
            classStyle += " none-border";

        if (item.level == 0) {
            idName = `warehouse-${parentId}-${item.id}`;
            item.warehouseId = item.id
        }
        else if (item.level == 1) {
            idName = `zone-0-${parentId}-${item.id}-${item.attributeIds}-${item.unitId}`;
            gparentId = parentId

            item.warehouseId = parentId

            if (reportType == 4)
                item.itemId = item.id
            else
                item.zoneId = item.id

        }
        else if (item.level == 2) {
            idName = `bin-0-${parentId}-${item.id}-${item.attributeIds}-${item.unitId}`;
            item.warehouseId = gparentId

            gparentId = parentId

            item.zoneId = parentId

            if (reportType == 5)
                item.itemId = item.id
            else
                item.binId = item.id
        }
        else {
            idName = `item-${gparentId}-${parentId}-${item.id}-${item.attributeIds}-${item.unitId}`
            item.zoneId = gparentId
            item.binId = parentId
            item.itemId = item.id
        }


        if ((((i == 0 || i == 1) && levelWarehouseId == 0 && levelZoneId == 0 && levelBinId == 0 && item.level == level) ||
            (level == 1 && levelWarehouseId != 0 && item.id == levelWarehouseId) ||
            (
                (item.level == 2 && level == 2 && parentId == levelWarehouseId && (levelZoneId == 0 || item.id == levelZoneId) && (levelBinId == 0 || item.id == levelBinId)) ||
                (item.level == 3 && level == 3 && parentId == levelZoneId && nodeLevelGlId == levelWarehouseId) ||
                (item.level == 3 && level == 3 && parentId == levelZoneId && nodeLevelGlId == levelZoneId)
            ))
            &&
            !defaultGetResult) {
            isSelected = true;
            defaultGetResult = true;
            saveFunctionsTrees.funcName = clickFunc
            saveFunctionsTrees.func = `${clickFunc}(this,false,${item.id},${parentId})`
            saveFunctionsTrees.currentId = idName

        }

        if (item.childCount != 0) {
            if (itemFunc == "")
                str += `<li class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}'  data-warehouseId='${item.warehouseId}' data-zoneId='${item.zoneId}'  data-binId='${item.binId}' data-attributeId='${item.attributeIds}'  data-unitId='${item.unitId}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;
            else
                str += `<li onclick="${itemFunc}" class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-warehouseId='${item.warehouseId}' data-zoneId='${item.zoneId}'  data-binId='${item.binId}' data-id='${item.id}' data-attributeId='${item.attributeIds}'  data-unitId='${item.unitId}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;

            str += (i == 0 && levelWarehouseId == 0 && levelZoneId == 0) || ((item.level == 1 && item.id == levelWarehouseId) || (item.level == 2 && (item.id == levelZoneId || item.id == levelItemId))) ? '<i class="fa fa-minus"></i>' : '<i class="fa fa-plus"></i>';
            str += `<span class="${isSelected ? 'treeSelected' : ''}">(${item.id}) ${item.name} </span> `;
            str += `<ul ${(i == 0 && levelWarehouseId == 0 && levelZoneId == 0) || ((item.level == 1 && item.id == levelWarehouseId) || (item.level == 2 && (item.id == levelZoneId || item.id == levelItemId))) ? 'style="display: block;"' : ''}>`;
            str += generate_treeview(item.children, level, clickFunc, item.id, gparentId, level == 3 ? parentId : 0);
            str += "</ul>";
            str += '</li>';

        }
        else {

            idname = "node-" + item.id;
            if (itemFunc == "")
                str += `<li class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-warehouseId='${item.warehouseId}' data-zoneId='${item.zoneId}'  data-binId='${item.binId}' data-attributeId='${item.attributeIds}'  data-unitId='${item.unitId}' data-childrenLength=${item.children != null ? item.children.length : 0}>`;
            else
                str += `<li onclick="${itemFunc}" class="${classStyle}" id="${idName}" tabindex=${nodeTabIndex} data-id='${item.id}' data-warehouseId='${item.warehouseId}' data-zoneId='${item.zoneId}'  data-binId='${item.binId}' data-attributeId='${item.attributeIds}'  data-unitId='${item.unitId}'  data-childrenLength=${item.children != null ? item.children.length : 0}>`;

            str += `<span class="${isSelected ? 'treeSelected' : ''}">(${item.id}) ${item.name} </span>`;
            str += '</li>';
        }
    }
    return str;

};

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

function getLevelZone_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;


    if (isNext || isTreeClicked) {
        trackingTree = {
            warehouseId: parentId,
            zoneId: identityId,
            binId: 0,
            itemId: 0,
            attributeId: 0,
            unitId: 0
        }
    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    reportParameters = parameter();
    reportParameters.warehouseId = parentId;
    reportParameters.zoneId = identityId;

    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();


    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {
        getReportAsync(reportParameters, () => {

            set_itemtransactionwarehouse($("li span.treeSelected").parents("li").first());

            if (!isNext && trackingTree.zoneId != 0) {
                $(`#dataRowsReport tr[data-zoneid=${trackingTree.zoneId}]`).addClass("highlight");
            }
            else
                $(`#dataRowsReport tr:eq(0)`).addClass("highlight");
            createPageFooterInfo(1, +reportParameters.pageRowsCount, 1);
            setAffectedValuePerRequest();
            checkSumDynamic(reportParameters);

        });
    }
}

function getLevelItem_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;


    if (isNext || isTreeClicked) {
        trackingTree = {
            warehouseId: parentId,
            zoneId: 0,
            binId: 0,
            itemId: identityId,
            attributeId: 0,
            unitId: 0
        }

    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    trackingTree.attributeId = $("#treeview").find(".treeSelected").parent("li").data("attributeid");
    trackingTree.unitId = +$("#treeview").find(".treeSelected").parent("li").data("unitid");

    $(`#${elmId}`).focus()


    let attributeIdlength = 0;
    attributeIdlength = checkResponse(trackingTree.attributeId.toString().split('_')) ? trackingTree.attributeId.toString().split('_').length : 1;

    var arrAttribute = [];
    let AttributeIds = (attributeIdlength > 1 ? trackingTree.attributeId.replaceAll('_', ',') : trackingTree.attributeId)

    if (AttributeIds != "")
        arrAttribute = AttributeIds;
    else
        arrAttribute = null


    reportParameters = parameter();

    reportParameters.warehouseId = parentId;
    reportParameters.itemIds = identityId;
    reportParameters.attributeIdList = arrAttribute;
    reportParameters.unitIds = trackingTree.unitId;


    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();


    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {
        getReportAsync(reportParameters, () => {

            set_itemtransactionwarehouse($("li span.treeSelected").parents("li").first());

            if (!isNext && trackingTree.itemId != 0) {
                $(`#dataRowsReport tr[data-zoneid=${trackingTree.itemId}]`).addClass("highlight");
            }
            else
                $(`#dataRowsReport tr:eq(0)`).addClass("highlight");

            setAffectedValuePerRequest();
            checkSumDynamic(reportParameters);
        });
    }

}

function getLevelBin_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;

    if (isNext || isTreeClicked) {

        trackingTree = {
            warehouseId: 0,
            zoneId: parentId,
            binId: identityId,
            itemId: 0,
            attributeId: 0,
            unitId: 0
        }

    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(`#${elmId}`).focus()

    reportParameters = parameter();

    reportParameters.zoneId = parentId;
    reportParameters.binId = identityId;


    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();


    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {

        getReportAsync(reportParameters, () => {
            set_itemtransactionwarehouse($("li span.treeSelected").parents("li").first().parents("li").first());
            set_itemtransactionzone($("li span.treeSelected").parents("li").first());

            $(`#dataRowsReport tr:eq(0)`).addClass("highlight")

            setAffectedValuePerRequest();
            checkSumDynamic(reportParameters);
        });
    }


}

function getLevelZoneItem_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;

    if (isNext || isTreeClicked) {
        0
        trackingTree = {
            warehouseId: 0,
            zoneId: parentId,
            binId: 0,
            itemId: identityId,
            attributeId: 0,
            unitId: 0
        }

    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(`#${elmId}`).focus()


    trackingTree.attributeId = $("#treeview").find(".treeSelected").parent("li").data("attributeid");
    trackingTree.unitId = +$("#treeview").find(".treeSelected").parent("li").data("unitid");

    $(`#${elmId}`).focus()



    let attributeIdlength = 0;
    attributeIdlength = checkResponse(trackingTree.attributeId.toString().split('_')) ? trackingTree.attributeId.toString().split('_').length : 1;
    var arrAttribute = [];

    let AttributeIds = (attributeIdlength > 1 ? trackingTree.attributeId.replaceAll('_', ',') : trackingTree.attributeId)

    if (AttributeIds != "")
        arrAttribute = AttributeIds;
    else
        arrAttribute = null


    reportParameters = parameter();

    reportParameters.zoneId = parentId;
    reportParameters.itemIds = identityId;
    reportParameters.attributeIdList = arrAttribute;
    reportParameters.unitIds = trackingTree.unitId;




    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();


    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {

        getReportAsync(reportParameters, () => {
            set_itemtransactionwarehouse($("li span.treeSelected").parents("li").first().parents("li").first());
            set_itemtransactionzone($("li span.treeSelected").parents("li").first());

            $(`#dataRowsReport tr:eq(0)`).addClass("highlight")

            setAffectedValuePerRequest();
            checkSumDynamic(reportParameters);
        });
    }

}

function getLevelBinItem_Detail(elm, isTreeClicked, id, parentId) {

    identityId = id;
    if (isNext || isTreeClicked) {
        trackingTree = {
            warehouseId: 0,
            zoneId: 0,
            binId: parentId,
            itemId: identityId,
            attributeId: 0,
            unitId: 0
        }
    }

    $("li span.treeSelected").removeClass("treeSelected");

    let elmId = $(elm).attr("id");

    $(`#${elmId} span`).addClass("treeSelected");

    $(`#${elmId}`).focus()


    trackingTree.attributeId = $("#treeview").find(".treeSelected").parent("li").data("attributeid");
    trackingTree.unitId = +$("#treeview").find(".treeSelected").parent("li").data("unitid");

    $(`#${elmId}`).focus()


    let attributeIdlength = 0;
    attributeIdlength = checkResponse(trackingTree.attributeId.toString().split('_')) ? trackingTree.attributeId.toString().split('_').length : 1;

    var arrAttribute = [];
    let AttributeIds = (attributeIdlength > 1 ? trackingTree.attributeId.replaceAll('_', ',') : trackingTree.attributeId)

    if (AttributeIds != "")
        arrAttribute = AttributeIds;
    else
        arrAttribute = null


    reportParameters = parameter();

    reportParameters.binId = parentId;
    reportParameters.itemIds = identityId;
    reportParameters.attributeIdList = arrAttribute;
    reportParameters.unitIds = trackingTree.unitId;



    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");

    initialPageing();


    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {

        getReportAsync(reportParameters, () => {
            set_itemtransactionwarehouse($("li span.treeSelected").parents("li").first().parents("li").first());
            set_itemtransactionzone($("li span.treeSelected").parents("li").first());

            $(`#dataRowsReport tr:eq(0)`).addClass("highlight")

            setAffectedValuePerRequest();
            checkSumDynamic(reportParameters);
        });
    }

}

function set_itemtransactionwarehouse(elem) {

    var word = $(elem).find("span").first().text().replaceAll('(', '');
    var firstPartWord = word.indexOf("(");
    var seccondPartWord = word.indexOf(")");
    var identityId = word.substring(firstPartWord, seccondPartWord + 1).replaceAll('(', '').replaceAll(')', '');
    itemtransactionwarehouse = `${identityId} - ${word.replaceAll(word.substring(firstPartWord, seccondPartWord + 1), '')}`;
}

function set_itemtransactionzone(elem) {

    var word = $(elem).find("span").first().text().replaceAll('(', '');
    var firstPartWord = word.indexOf("(");
    var seccondPartWord = word.indexOf(")");
    var identityId = word.substring(firstPartWord, seccondPartWord + 1).replaceAll('(', '').replaceAll(')', '');
    itemtransactionzone = `${identityId} - ${word.replaceAll(word.substring(firstPartWord, seccondPartWord + 1), '')}`;
}

function setTitleReport(reportName) {

    $("#showKindOfReportDisplay").removeClass("d-none")
    $("#showKindOfReport").text(reportName);


}

$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let reportType = +$("#reportTypeIdForPrintAndExel").val()
    let columnType = $("#columnTypeForPrintAndExel").prop("checked") == true ? 0 : 1

    switch (reportType) {
        case 1:
            viewData_print_file_url = (columnType == 0 ? levelWarehouseTrialStimulUrl : levelWarehouseStimulUrl);
            viewData_form_title = "تراز انبار";
            break;
        case 2:
            viewData_print_file_url = (columnType == 0 ? levelZoneTrialStimulUrl : levelZoneStimulUrl);
            viewData_form_title = "تراز انبار بخش";
            break;
        case 3:
            viewData_print_file_url = (columnType == 0 ? levelBinTrialStimulUrl : levelBinStimulUrl);
            viewData_form_title = "تراز انبار بخش پالت";
            break;
        case 4:
            viewData_print_file_url = (columnType == 0 ? noteWarehouseTrialStimulUrl : noteWarehouseStimulUrl);
            viewData_form_title = "کاردکس انبار";
            break;
        case 5:
            viewData_print_file_url = (columnType == 0 ? noteZoneTrialStimulUrl : noteZoneStimulUrl);
            viewData_form_title = "کاردکس انبار بخش";
            break;
        case 6:
            viewData_print_file_url = (columnType == 0 ? noteBinTrialStimulUrl : noteBinStimulUrl);
            viewData_form_title = "کاردکس انبار بخش پالت";
            break;
    }


    getdateRange();

    if (+$("#warehouseIdPrint").val() > 0 || +$("#zoneIdPrint").val() > 0 || +$("#binIdPrint").val() > 0)
        trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 }

    reportParameters = parameter();

    var repParamaters = ReportParameter();


    let index1 = repParamaters.findIndex(item => item.Item == "warehouseId")
    repParamaters[index1].Value = +$("#warehouseIdPrint").val() == 0 ? null : +$("#warehouseIdPrint").val()

    let index2 = repParamaters.findIndex(item => item.Item == "zoneId")
    repParamaters[index2].Value = +$("#zoneIdPrint").val() == 0 ? null : +$("#zoneIdPrint").val();

    let index3 = repParamaters.findIndex(item => item.Item == "binId")
    repParamaters[index3].Value = +$("#binIdPrint").val() == 0 ? null : +$("#binIdPrint").val();



    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: viewData_print_file_url,
        parameters: repParamaters,
        reportSetting: reportSettingModel
    }


    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

function ReportParameter() {


    let attributeIdlength = 0;
    attributeIdlength = checkResponse(trackingTree.attributeId.toString().split('_')) ? trackingTree.attributeId.toString().split('_').length : 1;
    var arrAttribute = [];

    let AttributeIds = (attributeIdlength > 1 ? trackingTree.attributeId.replaceAll('_', ',') : trackingTree.attributeId)

    if (AttributeIds != "")
        arrAttribute = AttributeIds;
    else
        arrAttribute = null

    //arrAttribute.push({ AttributeIds: (attributeIdlength > 1 ? trackingTree.attributeId.replaceAll('_', ',') : trackingTree.attributeId) });


    let fromDocumentDateMiladi = moment.from($("#fromDocumentDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let toDocumentDateMiladi = moment.from($("#toDocumentDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');

    let type = +$("#reportTypeIdForPrintAndExel").val().toString()
    let typeName = ""
    let AmountOrQuantity = $("#columnTypeForPrintAndExel").prop("checked") ? 0 : 1

    if (type == 1 && AmountOrQuantity == 0)
        typeName = "تراز تعدادی انبار";
    else if (type == 1 && AmountOrQuantity == 1)
        typeName = "تراز ریالی انبار"

    else if (type == 2 && AmountOrQuantity == 0)
        typeName = "تراز تعدادی انبار - بخش"
    else if (type == 2 && AmountOrQuantity == 1)
        typeName = "تراز ریالی انبار - بخش"

    else if (type == 3 && AmountOrQuantity == 0)
        typeName = "تراز تعدادی انبار -  بخش - پالت"
    else if (type == 3 && AmountOrQuantity == 1)
        typeName = "تراز ریالی انبار -  بخش - پالت"

    else if (type == 4 && AmountOrQuantity == 0)
        typeName = "کاردکس تعدادی انبار"
    else if (type == 4 && AmountOrQuantity == 1)
        typeName = "کاردکس ریالی انبار"

    else if (type == 5 && AmountOrQuantity == 0)
        typeName = "کاردکس تعدادی انبار - بخش"
    else if (type == 5 && AmountOrQuantity == 1)
        typeName = "کاردکس ریالی انبار - بخش"

    else if (type == 6 && AmountOrQuantity == 0)
        typeName = "کاردکس تعدادی انبار - بخش - پالت"
    else if (type == 6 && AmountOrQuantity == 1)
        typeName = "کاردکس ریالی انبار - بخش - پالت"

    

    let reportParameters = [
        { Item: "pageNo", Value: null, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "pageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 10 },
        { Item: "branchId", Value: +$("#branchId").val() == 0 ? null : +$("#branchId").val(), SqlDbType: dbtype.NVarChar, Size: 15 },
        { Item: "itemCategoryId", Value: $(`#categoryId`).val().toString() == "" ? null : $(`#categoryId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "workFlowId", Value: $(`#workflowId`).val().toString() == "" ? null : $(`#workflowId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "stageId", Value: $(`#stageId`).val().toString() == "" ? null : $(`#stageId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "actionId", Value: +$("#actionId").val() == 0 ? null : +$("#actionId").val(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "createUserId", Value: $(`#createUserId`).val().toString() == "0" ? null : $(`#createUserId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "itemTypeId", Value: +$("#itemTypeId").val() == 0 ? null : +$("#itemTypeId").val(), SqlDbType: dbtype.Int, Size: 15 },
        { Item: "attributeId", Value: $("#atrributeId").val().toString() == "" ? (AttributeIds != "" ? trackingTree.attributeId.replaceAll("_", "-") : null) : $("#atrributeId").val().join('-'), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "unitId", Value: $(`#unitId`).val().toString() == "" ? +trackingTree.unitId > 0 ? +trackingTree.unitId : null : $(`#unitId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "subUnitId", Value: $(`#subUnitId`).val().toString() == "" ? null : $(`#subUnitId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "fromDocumentDate", Value: $("#fromDocumentDatePersian").val() == "" ? null : fromDocumentDateMiladi, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "fromDocumentDate1", Value: fromDocumentDate1, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toDocumentDate", Value: $("#toDocumentDatePersian").val() == "" ? null : toDocumentDateMiladi, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "toDocumentDate1", Value: toDocumentDate1, SqlDbType: dbtype.NVarChar, Size: 10 },
        { Item: "FromDatePersian", Value: $("#fromDocumentDatePersian").val(), itemType: "Var" },
        { Item: "ToDatePersian", Value: $("#toDocumentDatePersian").val(), itemType: "Var" },
        { Item: "FromDocumentDate1", Value: fromDocumentDate1, itemType: "Var" },
        { Item: "ToDocumentDate1", Value: toDocumentDate1, itemType: "Var" },
        { Item: "warehouseId", Value: $(`#warehouseId`).val().toString() == "" ? +trackingTree.warehouseId > 0 ? +trackingTree.warehouseId : null : $(`#warehouseId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "zoneId", Value: $(`#zoneId`).val().toString() == "" ? +trackingTree.zoneId > 0 ? +trackingTree.zoneId : null : $(`#zoneId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "binId", Value: $(`#binId`).val().toString() == "" ? +trackingTree.binId > 0 ? +trackingTree.binId : null : $(`#binId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "itemId", Value: $(`#itemId`).val().toString() == "" ? +trackingTree.itemId > 0 ? +trackingTree.itemId : null : $(`#itemId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "amountOrQuantity", Value: AmountOrQuantity },
        { Item: "AmountOrQuantity", Value: AmountOrQuantity, itemType: "Var" },
        { Item: "type", Value: type, SqlDbType: dbtype.Int, Size: 15 },
        { Item: "TypeName", Value: typeName, itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 10 },
    ]
    return reportParameters;

}

$("#previous-level").click(function () {
    trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 }
    isNext = false
    levelGetReportForNextAndPrevious = ""
    loadingAsync(true, "previous-level", "fas fa-arrow-up");
    previousLevel();

});

$("#resetFilters").click(function () {
    $("#fiscalId").val("0").trigger("change");
    $("#branchId").val("0").trigger("change");
    $("#workflowId").val("0").trigger("change");
    $("#stageId").val("0").trigger("change");
    $("#actionId").val("0").trigger("change");
    $("#createUserId").val("0").trigger("change");
    $("#itemTypeId").val("0").trigger("change");
    $("#categoryId").val("0").trigger("change");
    $("#itemId").val("0").trigger("change");
    $("#atrributeId").val("0").trigger("change");
    $("#unitId").val("0").trigger("change");
    $("#warehouseId").val("0").trigger("change");
    $("#zoneId").val("0").trigger("change");
    $("#binId").val("0").trigger("change");
    $("#fromDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
})

$("#reportTypeId").change(function () {
    let reportTypeId = $("#reportTypeId").val();
    if (reportTypeId == 3) {
        trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 }
        levelGetReport();
        $("#next-level").attr("disabled", "disabled");

    }

    if (reportTypeId == 4) {

        trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 }
        levelGetReport()
        $("#previous-level").attr("disabled", "disabled");
        $("#next-level").removeAttr("disabled");
    }

});

$("#next-level").click(function () {
    trackingTree = { warehouseId: 0, zoneId: 0, binId: 0, itemId: 0, attributeId: 0, unitId: 0 }
    isNext = true
    levelGetReportForNextAndPrevious = "next"
    loadingAsync(true, "next-level", "fas fa-arrow-down");
    nexLevel();

});

$("#beforStimul_preview").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $("#warehouseIdPrint").empty()
    $("#zoneIdPrint").empty()
    $("#binIdPrint").empty()
    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getalldatadropdown/null`, "warehouseIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);

    $("#exportCSV").addClass("d-none")
    $("#stimul_preview").removeClass("d-none")
    $("#stimul_preview").attr("tabindex", 37)
    modal_show("getCsvReportParameter")

})

$("#getCsvReportParameter").on("show.bs.modal", function () {
    $("#printOrExelModalTitle").text("گزارش")
    setTimeout(() => {
        $("#reportTypeIdForPrintAndExel").select2("focus")
    }, 500)
});

$("#getCsvReportParameter").on("hidden.bs.modal", function () {
    $("#warehouseIdPrint").val("")
    $("#zoneIdPrint").val("")
    $("#binIdPrint").val("")
    $("#exportCSV").removeClass("d-none")
    $("#stimul_preview").removeClass("d-none")
    $("#exportCSV").removeAttr("tabindex")
    $("#stimul_preview").removeAttr("tabindex")
});

$("#warehouseIdPrint").change(function () {
    getZonePrintDropDown();
});

$("#zoneIdPrint").change(function () {
    let zoneIdPrint = $(this).val();

    $("#binIdPrint").empty();

    if (zoneIdPrint.length > 0)
        getBinPrintDropDown(zoneIdPrint.toString());

    else
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binIdPrint", true, false, false, 3, "انتخاب", undefined, "", false, false, true);

});

$("#levelGetReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    isNext = true;
    getReport();
})

$("#fiscalId").change(function () {
    if (+$(this).val() != 0) {
        let url = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(+$("#fiscalId").val()),
            success: function (result) {

                var fiscalStartDate = result.startDatePersian;
                var fiscalEndDate = result.endDatePersian
                $("#fromDocumentDatePersian").val(fiscalStartDate);
                $("#toDocumentDatePersian").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return "";
            }
        });
    }
    else {
        $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
        $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    }
})

$("#branchId").change(function () {

    var branchId = $(this).val() == "" ? null : $(this).val().join(","),
        stageclassIds = "1,3,4,8",
        workFlowCategoryId = workflowCategoryIds.warehouse.id;

    $("#warehouseId").empty();
    $("#workflowId").empty();

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageclassIds}`, false, 3, "", () => { $("#workflowId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getDropDownByUserId`, "warehouseId", true, branchId, false, 3, "", () => { $("#warehouseId").trigger("change") }, "", false, false, true);



});

$("#workflowId").change(function () {
    let workflowId = $(this).val() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.warehouse.id,
        stageclassIds = "1,3,4,8,11,14,15,16",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageclassIds}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);


});

$("#stageId").change(function () {

    let stageId = $("#stageId").val() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.warehouse.id,
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        stageclassIds = "1,3,4,8,11,14,15,16";

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageclassIds}`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);

});

$("#warehouseId").change(function () {

    let warehouseId = $("#warehouseId").val();
    $("#zoneId").empty();

    if (warehouseId.length > 0)
        fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneId", true, `${warehouseId.toString()}`, false, 3, "", () => { $("#zoneId").trigger("change") }, "", false, false, true);
    else
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, false, false, 3, "", () => { $("#zoneId").trigger("change") }, "", false, false, true);


});

$("#zoneId").change(function () {

    let zoneId = $(this).val();
    let warehouseId = $("#warehouseId").val();
    $("#binId").empty();

    if (warehouseId.length > 0) {
        if (zoneId.length > 0)
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/${zoneId.toString()}`, false, 3, "", undefined, "", false, false, true);
        else
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/null`, false, 3, "", undefined, "", false, false, true);
    }
    else
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, false, false, 3, "", undefined, "", false, false, true);

});

$("#itemTypeId").change(function () {

    let itemTypeId = +$(this).val();
    $("#categoryId").empty();

    if (itemTypeId !== 0)
        fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype`, "categoryId", true, itemTypeId, false, 3, "",
            () => { $("#categoryId").trigger("change") }, "", false, false, true);
    else
        fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype/0`, "categoryId", true, 0, false, 3, "",
            () => { $("#categoryId").trigger("change") }, "", false, false, true);

});

$("#unitId").change(function () {

    let unitId = $(this).val();

    $("#subUnitId").empty();

    if (unitId.length > 0)
        fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/subunitgetdropdown`, "subUnitId", true, `${unitId}`, false, 3, "", undefined, "", false, false, true);

});

$("#categoryId").change(function () {

    let categoryId = $(this).val();
    $("#itemId").empty();
    $("#atrributeId").empty();

    if (categoryId.length > 0) {
        fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdownwithcategoryid`, "itemId", true, categoryId, false, 3, "", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "atrributeId", true, categoryId, false, 3, "", undefined, "", false, false, true);
    }
    else {
        fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdown`, "itemId", true, 0, false, 3, "", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "atrributeId", true, null, false, 3, "", undefined, "", false, false, true);
    }

});

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

initform()