var viewData_form_title = "محاسبات ریالی انبار",

    viewData_controllername = "UnitCostCalculationApi",
    viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`,
    viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`,
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}UnitCostCalculation.mrt`,
    modal_open_state = "",
    fiscalYearId = 0;



function initUnitCostCalculation() {

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalYearId", true);

    fill_select2(`/api/WHApi/costingMethod_getdropdown`, "costingMethodId", true);

    $("#fromDocumentDatePersian").inputmask();
    $("#toDocumentDatePersian").inputmask();

    kamaDatepicker('fromDocumentDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toDocumentDatePersian', { withTime: false, position: "bottom" });


    get_NewPageTableV1();



    setTimeout(() => {
        $("#fiscalYearId").select2("focus")
    }, 1000)
}

function getCostingMethodId(fiscalYearId) {

    let url = `${viewData_baseUrl_WH}/UnitCostCalculationApi/getUnitCostCalculationCountByfiscalYearId`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(fiscalYearId),
        success: function (result) {
            if (result > 0) {
                $("#costingMethodId").prop("disabled", true)
                $("#costingMethodId").removeAttr("required")
            }

            else {
                $("#costingMethodId").prop("disabled", false)
                $("#costingMethodId").attr("required", true)
            }




        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });
}

function getDate(fiscalYearId) {


    let url = `${viewData_baseUrl_GN}/FiscalYearApi/getrecordbyid`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(fiscalYearId),
        success: function (result) {

            var fiscalStartDate = result.data.startDatePersian;
            var fiscalEndDate = result.data.endDatePersian
            $("#fromDocumentDatePersian").val(fiscalStartDate);
            $("#toDocumentDatePersian").val(fiscalEndDate);

            $("#isActive").prop("disabled", true)
            if (result.data.closed)
                $("#isActive").prop("checked", true).trigger("change");
            else
                $("#isActive").prop("checked", false).trigger("change");



        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });
}

function modal_save(modal_name = null, enter_toline = false) {

    save(modal_name, enter_toline);
}

function save(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();

    validateSelect2(form);
    if (!validate) return;


    var newModel = {

        id: +$("#modal_keyid_value").text(),
        fiscalYearId: +$("#fiscalYearId").val(),
        costingMethodId: +$("#costingMethodId").val()
    }


    if (modal_open_state == "Add")
        recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {
            if (result.successfull) {
                if (result.id > 0) {
                    modal_close();
                    $(".modal-backdrop.fade.show").remove();
                    if (enter_toline)
                        navigation_item_click(`/WH/UnitCostCalculationLine/${result.id}/${newModel.fiscalYearId}/${newModel.costingMethodId}`);
                    else
                        get_NewPageTableV1();
                }
                else
                    alertify.error('عملیات ثبت با خطا مواجه شد.').delay(alertify_delay);
            }
            else {
                if (result.validationErrors.length > 0) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }
        });
    else if (modal_open_state == "Edit")
        recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {

            if (result.successfull) {
                if (result.id > 0) {

                    modal_close();
                    $(".modal-backdrop.fade.show").remove();

                    if (enter_toline)
                        navigation_item_click(`/WH/UnitCostCalculationLine/${result.id}/${newModel.fiscalYearId}/${newModel.costingMethodId}`);
                    else
                        get_NewPageTableV1();
                }
                else
                    alertify.error('عملیات ویرایش با خطا مواجه شد.').delay(alertify_delay);
            }
            else {
                if (result.validationErrors.length > 0) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }
        });

}

function run_button_detailSimple(fId, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var fiscalyear = $(elm).parents("tr").first().data("fiscalyear").split('-')[1];
    var costingMethodId = +$(elm).parents("tr").first().data("costingmethod").split('-')[0];
    navigation_item_click(`/WH/UnitCostCalculationLine/${fId}/${fiscalyear}/${costingMethodId}`);
}

function navigateToModalUnitCostCalculation(href) {

    initialPage();
    $("#contentdisplayUnitCostCalculationLineModel #content-page").addClass("displaynone");
    $("#contentdisplayUnitCostCalculationLineModel #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayUnitCostCalculationLineModel`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayUnitCostCalculationLineModel #loader,#contentdisplayUnitCostCalculationLineModel #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayUnitCostCalculationLineModel #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayUnitCostCalculationLineModel #form,#contentdisplayPersonInvoiceLine .content").css("margin", 0);
    $("#contentdisplayUnitCostCalculationLineModel .itemLink").css("pointer-events", " none");
}

$("#AddEditModal")
    .on({
        "hidden.bs.modal": function () {

            $("#fiscalYearId").empty()
            $("#costingMethodId").empty()
        },
        "shown.bs.modal": function () {

            if (modal_open_state == "Add") {

                fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalYearId", true);

                fill_select2(`/api/WHApi/costingMethod_getdropdown`, "costingMethodId", true);

                $("#fiscalYearId").select2("focus");
                $("#fiscalYearId").prop('disabled', false).trigger("change");
                $("#costingMethodId").prop('disabled', false).trigger("change");

            }
        }
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
        { Item: "id", Value: p_value, SqlDbType: p_type, Size: p_size },

    ]

    stimul_report(reportParameters);
});

$("#fiscalYearId").change(function () {

    let id = +$("#fiscalYearId").val()
    if (id != 0) {
        getDate(id);
        getCostingMethodId(id);
    }

    else {
        $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
        $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    }
})

initUnitCostCalculation()


