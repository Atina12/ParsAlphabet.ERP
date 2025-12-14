var viewData_form_title = "کدینگ حسابداری - تفضیل",
    viewData_controllername = "AccountDetailApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_insrecord_url;
var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}AccountDetail.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";

$("#addCustomer").on("click", function () {

    var check = controller_check_authorize("CustomerApi", "PRN");
    if (!check)
        return;

    showModaolforSave("customer", "Cu", viewData_insrecord_url_cu, "مشتریان")
});

$("#addEmployee").on("click", function () {

    var check = controller_check_authorize("EmployeeApi", "PRN");
    if (!check)
        return;

    showModaolforSave("employee", "Em", viewData_insrecord_url_em, "پرسنل")
});

$("#addVendor").on("click", function () {

    var check = controller_check_authorize("VendorApi", "PRN");
    if (!check)
        return;

    showModaolforSave("vendor", "Ve", viewData_insrecord_url_ve, "تامین کنندگان")
});

//function export_csv(elemId = undefined) {

//    var check = controller_check_authorize(viewData_controllername, "PRN");
//    if (!check)
//        return;

//    if ($("#userType").prop("checked"))
//        pagetable_formkeyvalue = ["myadm", 0];
//    else
//        pagetable_formkeyvalue = ["alladm", 0];


//    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

//    setTimeout(function () {
//        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetableDetails");

//        if (csvModel == null) {
//            csvModel = {
//                Filters: arrSearchFilter[index].filters,
//                Form_KeyValue: pagetable_formkeyvalue
//            }
//        }

//        $.ajax({
//            url: viewData_csv_url,
//            type: "post",
//            dataType: "json",
//            contentType: "application/json",
//            data: JSON.stringify(csvModel),
//            cache: false,
//            success: function (result) {

//                generateCsv(result);

//                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
//            },
//            error: function (xhr) {
//                error_handler(xhr, viewData_csv_url);
//                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
//            }
//        });
//    }, 500);
//}

function parameter() {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetableDetails");
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
    var urlCSV = viewData_csv_url;
    let title = "کدینگ حسابداری - تفضیل"

    if ($("#userType").prop("checked"))
        csvModel.form_KeyValue = ["myadm", 0];
    else
        csvModel.form_KeyValue = ["alladm", 0];

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

function initFormAcconuntDetail() {

    arr_pagetables.push({
        pagetable_id: "pagetableDetails",
        editable: false,
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
        lastPageloaded: 0,
    })
    get_NewPageTableV1("pagetableDetails");
}

function showModaolforSave(sectionName, subSectionName, urlInsert, titleName) {

    $(`#${sectionName}AddEditModal input`).val("");
    $(`#${sectionName}AddEditModal .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    resetSelects(subSectionName);

    $(`#${sectionName}AddEditModal #rowKeyId`).addClass("d-none");
    modal_show(`${sectionName}AddEditModal #AddEditModal${subSectionName}`);
    $(`#${sectionName}AddEditModal #modal_title`).text(`افزودن ${titleName}`);
    $(`#${sectionName}AddEditModal #modal-save`).attr("onclick", `modal_save()`);
    modal_open_state = "Add";
    viewData_insrecord_url = "";
    viewData_insrecord_url = urlInsert;
    modal_clear_items(`AddEditModal${subSectionName}`);
}

function resetSelects(subSectionName) {

    if (subSectionName == "Cu") {
        $("#customerAddEditModal select").val(0);
        $("#partnerTypeIdCu").val(1);
        $("#genderIdCu").val(1);
        $("select").trigger("change");
    }
    else if (subSectionName == "Em") {
        $("#employeeAddEditModal select").val(0);
        $("#genderIdEm").val(1);
        $("select").trigger("change");
    }
    else if (subSectionName == "Ve") {
        $("#vendorAddEditModal select").val(0);
        $("#partnerTypeIdVe").val(1);
        $("#genderIdVe").val(1);
        $("select").trigger("change");
    }
}

initFormAcconuntDetail();

