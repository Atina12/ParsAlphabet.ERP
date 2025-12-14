var viewData_form_title = "مراحل / نوع آیتم",

    viewData_controllername = "WarehouseStageItemTypeApi",
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}WarehouseStageItemType.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    isSecondLang = false;

pagetable_formkeyvalue = [11];

get_NewPageTableV1(null, false, callbackAfterFilter);

function callbackAfterFilter() {
    $(".dropdown-menu #filter_stageId").data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/11/0/2/1`);
    $(".dropdown-menu #filter_fundItemTypeId").data("api", `${viewData_baseUrl_WF}/StageFundItemTypeApi/stagefunditemtype_getdropdown/null/11`);
}

if ($(`.button-items button`).length > 0) {
    var button = $(`.button-items button`);
    $(button[2]).addClass("displaynone");
}

function export_csv() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                Filters: arrSearchFilter[index].filters,
                Form_KeyValue: [11]
            }
        }

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
            }
        });
    }, 500);
}

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");


    var userId = getUserId();
    var reportParameters = [
        { Item: `WorkflowCategoryId`, Value: 11, SqlDbType: dbtype.Int, Size: p_size }
    ]

    stimul_report(reportParameters);
});
