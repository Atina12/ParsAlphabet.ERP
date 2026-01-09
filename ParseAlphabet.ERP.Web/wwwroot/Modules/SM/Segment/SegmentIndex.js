var viewData_form_title = "بخش بندی بازار";


var viewData_controllername = "SegmentApi";

var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;

var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}CostCenter.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
isSecondLang = true;

get_NewPageTableV1();


//fill_dropdown("/api/FMApi/costdrivertype_getdropdown", "id", "name", "costDriverTypeId", true, 0);
//fill_dropdown("/api/FMApi/costcategory_getdropdown", "id", "name", "costCategoryId", true, 0);

$("#costDriverTypeId").on("change", function (ev) {

    var driverTypeId = +$(this).val();
    $("#costDriverId").html("");

    if (driverTypeId !== 0)
        fill_dropdown("/api/FMApi/costdriver_getdropdown", "id", "name", "costDriverId", true, driverTypeId);
    else
        $("#costDriverId").html("");
});

function checkIsActive(id) {

    var output = $.ajax({
        url: `${viewData_baseUrl_FM}/CostCenterApi/isactive/${id}`,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_FM}/CostCenterApi/isactive/{id}`);
            return JSON.parse(null);
        }
    });
    return output.responseJSON;
}

function run_button_segmentline(lineId) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    //var resultIsActive = checkIsActive(lineId);

    //if (resultIsActive == true)
        navigation_item_click(`/SM/SegmentLine/${lineId}`, "تخصیص متغیرها");

    //else {
    //    var msg = alertify.warning("این مرکز هزینه غیرفعال است");
    //    msg.delay(admission.delay);
    //    return false;
    //}
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

function parameter() {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    let parameters = {
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
    let title = "بخش بندی انبار"
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


