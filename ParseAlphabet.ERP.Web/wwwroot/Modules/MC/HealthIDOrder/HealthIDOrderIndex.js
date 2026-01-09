
var viewData_form_title = "انبار شباد",
    viewData_controllername = "HealthIDOrderApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}HealthIDOrder.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

function initHealthOrderIndex() {
    $("#readyforadd").remove()
    get_NewPageTableV1();
}

function run_button_requestHID(id, rowno, elem) {
    arrayCounts = [20, 50, 100]
    var insurer = $(`#pagetable #row${rowno} #col_${rowno}_2`).text()
    var insurerArray = insurer.split('-');
    var insurerId = insurerArray[0];
    var insurerName = insurerArray[1];

    $("#insId").text(insurerId);
    $("#insurerName").text(insurerName);

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "healthId_pagetable");

    var pagetable_health = {
        pagetable_id: "healthId_pagetable",
        editable: false,
        pagerowscount: 20,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        lastPageloaded: 0,
        getpagetable_url: `${viewData_baseUrl_MC}/HealthIDOrderApi/getpagehealthId`,
        getfilter_url: `${viewData_baseUrl_MC}/HealthIDOrderApi/getfilterhealthitems`,
        lastPageloaded: 0,
    }

    if (index == -1)
        arr_pagetables.push(pagetable_health);
    else
        arr_pagetables[index] = pagetable_health

    pagetable_formkeyvalue = [insurerId];

    $(`#healthId_pagetable .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
    $(`#healthId_pagetable .btnfilter`).text("مورد فیلتر");

    get_NewPageTableV1("healthId_pagetable");
    modal_show("healthIDModal");
}

function run_button_countHID() {
    $("#countHID").attr("disabled", "disabled");
    setTimeout(function () {
        getCountByInsurerId();
    }, 100);
}

function run_button_deleteExpiredHID(id, rowno, thisbtn) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var insurerDataId = +$(`#row${rowno}`).data("insurerid");

    var deleteExpiredHIDResponse = getJsonData(`${viewData_baseUrl_MC}/${viewData_controllername}/deleteexpiredhid`, "json", insurerDataId);

    var deleteExpiredHIDResult = deleteExpiredHIDResponse.responseJSON;

    if (deleteExpiredHIDResult.successfull) {
        get_NewPageTableV1();
        alertify.success(deleteExpiredHIDResult.statusMessage).delay(alertify_delay);
    }
    else
        alertify.error(deleteExpiredHIDResult.statusMessage).delay(alertify_delay);

}

function getCountByInsurerId() {

    var url = `${viewData_baseUrl_MC}/${viewData_controllername}/generatebatchhid`;

    var insurerId = +$(`#insId`).text();

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(insurerId),
        success: function (result) {
            $("#countHID").removeAttr("disabled");
            if (result.successfull) {
                get_NewPageTableV1("healthId_pagetable");
            }
            else {
                var msg_p = alertify.error(result.statusMessage);
                msg_p.delay(admission.delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

$("#healthIDModal").on("hidden.bs.modal", function () {
    arrayCounts = [15, 20, 50, 100]
    pagetable_formkeyvalue = [0];
})

initHealthOrderIndex()