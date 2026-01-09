var viewData_form_title = "گروه تخفیف مشتریان";
var viewData_controllername = "CustomerDiscountGroupApi";
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}CustomerDiscGroup.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;


fill_select2(`${viewData_baseUrl_SM}/CustomerGroupApi/getdropdown`, "personGroupId", true, 1);
fill_select2(`/api/SMApi/pricetypegetdropdown`, "priceTypeId", false, 0);


$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

get_NewPageTableV1();


$("#priceTypeId").on("change", function () {
    if (+$(this).val() === 1)
        $("#price").prop("maxlength", 3).attr("data-parsley-max", 100).val("");
    else
        $("#price").prop("maxlength", 15).removeAttr("data-parsley-max", 100).val("");//999,999,999,999

})