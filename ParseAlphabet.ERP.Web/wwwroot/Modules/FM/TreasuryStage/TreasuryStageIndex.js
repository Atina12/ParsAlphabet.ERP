var viewData_form_title = "مراحل خزانه",

    viewData_controllername = "TreasuryStageApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}TreasuryStage.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    isSecondLang = false;

//fill_select2(`${viewData_baseUrl_FM}/NewTreasuryApi/treasurystage`, "stageId", true);
//fill_select2(`${viewData_baseUrl_FM}/NewTreasuryApi/treasurystage`, "previousStageId", true);
//fill_select2(`${viewData_baseUrl_FM}/${viewData_controllername}/getdropdownstageclass`, "stageClassId", true,0);
//fill_select2(`${viewData_baseUrl_FM}/${viewData_controllername}/getdropdowndocumenttype`, "documentTypeId", true,0);
//fill_select2(`${viewData_baseUrl_FM}/TreasuryReportApi/getfundtypeiddropdown`, "fundTypeId", true);
pagetable_formkeyvalue = [6];
get_NewPageTableV1(null, false, callbackAfterFilter);

function callbackAfterFilter() {
    $(".dropdown-menu #filter_stageClass").data("api", `${viewData_baseUrl_WF}/StageApi/getStageClassDropDown/6`);
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

if ($(`.button-items button`).length > 0) {
    var button = $(`.button-items button`);
    $(button[2]).addClass("displaynone");
}

function parameter() {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [6],
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
    let title = "تیم فروش"

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
        //{ Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        //{ Item: `WorkflowCategoryId`, Value: 6, SqlDbType: dbtype.Int, Size: p_size }
    ]

    stimul_report(reportParameters);
});
