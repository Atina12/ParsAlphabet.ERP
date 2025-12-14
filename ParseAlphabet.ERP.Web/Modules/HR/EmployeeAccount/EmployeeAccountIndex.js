var viewData_form_title = "حساب‌های پرسنل";
var viewData_controllername = "EmployeeAccountApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;
var employeeAccountTypeId = 3;
var viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}EmployeeAccount.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 };
var viewData_print_tableName = "";



inputMask();

fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "personId", true, '', true);
fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "bankId", true, 0, false);

pagetable_formkeyvalue = [0, employeeAccountTypeId];

get_NewPageTableV1();


$("#AddEditModal").on("show.bs.modal", function () {

    if (modal_open_state == "Edit") {
        $("#bankId").prop("disabled", true);
        $("#accountNo").prop("disabled", true);
        $("#personId").prop("disabled", true);
        $("#personId").prop("required", false);;
    }
    else {
        addFormKeyValue();
        $("#bankId").prop("disabled", false);
        $("#accountNo").prop("disabled", false);
        $("#personId").prop("disabled", false);
        $("#personId").prop("required", true);
        $("#isActive").prop("checked", "checked");
        funkyradio_onchange($("#isActive"));

    }

})

function addFormKeyValue() {
    
    let personFullName = $($(`#${activePageTableId} .highlight`).children()[1]).text()
    let personId = +personFullName.split("-")[0]

    if (personId === 0)
        model.personName = "انتخاب کنید...";

    $('#personId').empty();
    var newOption = new Option(personFullName, personId, false, false);
    $('#personId').append(newOption).trigger('change');
}

function run_button_getaccount(p_keyvalue, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");

    if (modal_name == null)
        modal_name = modal_default_name;

    viewData_modal_title = "ویرایش " + viewData_form_title;
    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });

    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    var getRow = $(`#row${rowNo}`);

    var modelAccount = {
        BankId: getRow.find(`#col_${rowNo}_1`).text(),
        PersonId: +getRow.find(`#col_${rowNo}_2`).text(),
        AccountNo: getRow.find(`#col_${rowNo}_5`).text()
    };

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelAccount),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
            //mask region
            $("#shebaNo").val("IR" + result.data.shebaNo);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    csvModel = {
        filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0, employeeAccountTypeId]
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
            error_handler(xhr, viewData_csv_url)
        }
    });


});

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

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "KeyId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 3, SqlDbType: dbtype.TinyInt, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});