var viewData_form_title = "تنظیمات مراحل خرید",

    viewData_controllername = "StageActionApi",
    viewData_getpagetable_url = `${viewData_baseUrl_WF}/${viewData_controllername}/getpage`,
    viewData_csv_url = `${viewData_baseUrl_WF}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.PU.Prn}PurchaseOrderStageAction.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    isSecondLang = false;

pagetable_formkeyvalue = [1];

get_NewPageTableV1(null, false, callbackAfterFilter);

function callbackAfterFilter() {
    $(".dropdown-menu #filter_stageId").data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/1/0/2/1`);
    $(".dropdown-menu #filter_actionId").data("api", `${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage/null/1/1/0/null/${workflowCategoryIds.purchase.id}/false/null`);
}
    
if ($(`.button-items button`).length > 0) {
    var button = $(`.button-items button`);
    $(button[2]).addClass("displaynone");
}

function parameter() {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    let parameters = {
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [1],
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }
    return parameters;
}

function export_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();
    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    var urlCSV = viewData_csv_url;
    let title = "تنظیمات مراحل خرید"

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
            if (result) {
                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {

    var check = controller_check_authorize("PurchaseOrderStageActionApi", "PRN");
    if (!check)
        return;

    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");
    var id = actionId = stageId = null;
    if (p_value != "") {
        if (p_id == "id")
            id = p_value;
        if (p_id == "actionId")
            actionId = p_value;
        if (p_id == "stageId")
            stageId = p_value;
    }

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "WorkflowCategoryId", Value: 1, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "WorkflowId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: `Id`, Value: id, SqlDbType: p_type, Size: p_size },
        { Item: `ActionId`, Value: actionId, SqlDbType: p_type, Size: p_size },
        { Item: `StageId`, Value: stageId, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});