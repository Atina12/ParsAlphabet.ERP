
function getStageActionConfig(id) {

    let viewData_getStageStepByWarehouseItem = `${viewData_baseUrl_WH}/WarehouseStageActionApi/getwarehousestageaction`;
    let outPut = $.ajax({
        url: viewData_getStageStepByWarehouseItem,
        data: JSON.stringify(id),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null) {
                return res;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getStageStepByWarehouseItem);
        }
    });

    return outPut.responseJSON;
}

//function getWarehousedataByStageId(stageId, workFlowId) {

//    let model = {};
//    model = {
//        stageId: +stageId,
//        priority: 1,
//        workFlowId: workFlowId
//    };

//}



function printDocumentItemTransactionQuantity(isQuantity, id, branch, documentTypeName, journalId, reportTitle, documentDatePersian) {

    let reportModel = null;

    let reportParameters = [
        { Item: "ItemTransactionId", Value: id, SqlDbType: dbtype.Int },
        { Item: "Branch", Value: branch, itemType: "Var" },
        { Item: "DocumentTypeName", Value: documentTypeName, itemType: "Var" },
        { Item: "JournalId", Value: journalId, itemType: "Var" },
        { Item: "DocumentDatePersian", Value: documentDatePersian, itemType: "Var" },    
    ];

    let reportUrl = "";

    if (isQuantity)
        reportUrl = `${stimulsBaseUrl.WH.Prn}ItemTransactionQuantity.mrt`;
    else
        reportUrl = `${stimulsBaseUrl.WH.Prn}ItemTransactionAmount.mrt`;

    reportModel = {
        reportName: reportTitle,
        reportUrl: reportUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    };

    window.open(`/Report/Index?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function printDocumentItemTransaction(id, reportTitle, branch, documentTypeName) {

    let reportParameters = [
        { Item: "AmountOrQuantity", Value: 1, SqlDbType: dbtype.TinyInt },
        { Item: "Id", Value: id, SqlDbType: dbtype.Int },
        { Item: "BranchName", Value: branch, itemType: "Var" },
        { Item: "DocumentTypeName", Value: documentTypeName, itemType: "Var" }
    ]

    let reportModel = {
        reportName: reportTitle,
        reportUrl: `${stimulsBaseUrl.WH.Prn}WarehouseItemTransaction.mrt`,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    };

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

async function accountDetail_getName(id, noSeriesId) {

    let output = await $.ajax({
        url: `${viewData_baseUrl_FM}/AccountDetailApi/getnameaccountDetail`,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({ id: id, noSeriesId: noSeriesId }),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/AccountDetailApi/getnameaccountDetail`)
            return null;
        }
    });

    return output;
}







