var viewData_form_title = "گروه مشتریان";


var viewData_controllername = "CustomerGroupApi";
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;

var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}CustomerGroup.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;

pagetable_formkeyvalue = [1];
get_NewPageTableV1();

fill_select2(`/api/SMApi/pricetypegetdropdown`, "priceTypeId", false, 0);
$("select").prop("selectedIndex", 0).trigger("change");

$("#priceTypeId").on("change", function () {

    if ($(this).val() == 1)
        $("#price").attr("data-parsley-percentage", true).attr("maxlength", "3").val("");
    else
        $("#price").removeAttr("data-parsley-percentage").attr("maxlength", "13").val("");

    $("#price").removeClass("parsley-error").parent().find("ul li").html("");
});

$("#AddEditModal").on("hidden.bs.modal", () => { resetFormCustomerGroup() });

function resetFormCustomerGroup() {
    $("select").prop("selectedIndex", 0).trigger("change");
    $("input").val("");
    $("[type='checkbox']").prop("checked", false);
}

window.Parsley._validatorRegistry.validators.checkminquantity = undefined
window.Parsley.addValidator("checkminquantity", {
    validateString: function (value) {
        var minQuantitySale = +removeSep($("#minQuantitySale").val());
        var minQuantity = +removeSep($("#minQuantity").val());

        if (minQuantitySale <= minQuantity)
            return true;

        return false;
    },
    messages: {
        en: 'حداقل تعداد فروش نباید از حداقل تعداد بیشتر باشد'
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 1, SqlDbType: dbtype.TinyInt, Size: 0 },
        { Item: "PersonType", Value: 1, itemType: "Var" },

    ]

    stimul_report(reportParameters);
});
