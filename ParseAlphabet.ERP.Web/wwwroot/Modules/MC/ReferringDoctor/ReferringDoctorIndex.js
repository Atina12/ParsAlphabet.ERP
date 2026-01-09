
var viewData_form_title = "داکتر ارجاع دهنده",
    viewData_controllername = "ReferringDoctorApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}ReferringDoctor.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

function initForm() {
    $(".select2").select2()
    get_NewPageTableV1();
    loadDropDown()
}

function loadDropDown() {
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, 0, true);
    fill_select2("/api/AdmissionsApi/role_GetDropDown", "roleId", true, 0);
    fill_select2(`${viewData_baseUrl_GN}/LocStateApi/getdropdown`, "locStateId", true);
    fill_dropdown("/api/AdmissionsApi/msctype_getdropdown", "id", "name", "msC_TypeId", true, 0);
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#specialityId").html("");
    $("#genderId").val("0").trigger("change");
});

$("#locStateId").on('change', function () {
    if ($("#locStateId").val() == 0) {
        $("#locCityId").html("").prop("disabled", true).prop("required", false).trigger("change");
    } else {
        $("#locCityId").html(`<option value="0">انتخاب کنید</option>`).prop("disabled", false).prop("required", false).trigger("change");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityId", true, +$(this).val());
    }

});

$("#locStateId").trigger("change")

$("#msc").on("blur", function (ev) {
    var curentMsc = $(this).val();
    $(this).val(curentMsc.padStart(10, '0'));
});

initForm()