var viewData_form_title = "شرح سند حسابداری";


var viewData_controllername = "JournalDescriptionApi";
var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;
var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}JournalDescription.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";


fill_select2(`${viewData_baseUrl_WF}/StageApi/getdropdown/2,6/0/2/1`, "stageId", true);

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

    var reportParameters = []

    stimul_report(reportParameters);
});


$("#showReport").on("click", function () {

});
pagetable_formkeyvalue = ["2,6"];

function export_csv() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
        
        if (csvModel == null) {
            csvModel = {
                filters: arrSearchFilter[index].filters,
                Form_KeyValue: ["2, 6"]
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

get_NewPageTableV1(null, false, callbackAfterFilter);

function callbackAfterFilter() {
    $(".dropdown-menu #filter_stage").data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/2,6/0/2/1`)
}

$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == "Add") {
        $("#isActive").prop("checked", true);
        funkyradio_onchange($("#isActive"));
    }
});
