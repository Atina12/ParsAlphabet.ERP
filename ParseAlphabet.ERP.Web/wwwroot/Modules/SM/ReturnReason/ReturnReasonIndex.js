var viewData_form_title = "دلایل برگشت";
var viewData_controllername = "ReturnReasonApi";
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}ReturnReason.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
isSecondLang = true;

var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;



get_NewPageTableV1()

$("#AddEditModal").on("shown.bs.modal", function () {
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
    let title = "علل مرجوعی"
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

