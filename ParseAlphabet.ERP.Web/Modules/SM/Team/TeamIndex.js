var viewData_form_title = "تیم",
    viewData_controllername = "TeamApi",
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`,
    viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}Team.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`

//var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
isSecondLang = true;
teamSalesId = 0;
var pgt_teamSalesPerson = {
    pagetable_id: "teamSalesPerson_pagetable",
    editable: true,
    pagerowscount: 15,
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
    lastPageloaded: 0
}
arr_pagetables.push(pgt_teamSalesPerson);

function teamInit() {
    loadDropDown()
    get_NewPageTableV1();
}

function loadDropDown() {
    fill_dropdown(`/api/SMapi/commissionBasegetdropdown`, "id", "name", "commissionBaseId");
    fill_dropdown(`/api/SMapi/commissionMethodgetdropdown`, "id", "name", "commissionMethodId");
}

function run_button_teamSalesPerson(teamId, rowno, elem) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    //pagetable_id = "teamSalesPerson_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "teamSalesPerson_pagetable");

    arr_pagetables[index].pagetable_id = "teamSalesPerson_pagetable"
    arr_pagetables[index].editable = true
    arr_pagetables[index].pagerowscount = 15
    arr_pagetables[index].endData = false
    arr_pagetables[index].pageNo = 0
    arr_pagetables[index].currentpage = 1
    arr_pagetables[index].currentrow = 1
    arr_pagetables[index].currentcol = 0
    arr_pagetables[index].highlightrowid = 0
    arr_pagetables[index].trediting = false
    arr_pagetables[index].pagetablefilter = false
    arr_pagetables[index].filteritem = ""
    arr_pagetables[index].filtervalue = ""
    arr_pagetables[index].lastPageloaded = 0

    teamSalesId = teamId;

    $(`#teamSalesPerson_pagetable .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
    $(`#teamSalesPerson_pagetable .btnfilter`).text("مورد فیلتر");

    TeamSalesPerson_init(teamId, "teamSalesPerson_pagetable");

    viewData_modal_title = "تخصیص تیم";

    modal_show(`teamSalesPersonModal`);
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    pagetable_formkeyvalue = [0];
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`
    setDefaultActiveCheckbox($("#isActive"));
});

function parameter() {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
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
    var urlCSV = "";
    let title = "تیم فروش"
    urlCSV = viewData_csv_url


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

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CommissionBaseName", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        { Item: "CommissionMethodName", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
    ]

    stimul_report(reportParameters);
});


teamInit()



