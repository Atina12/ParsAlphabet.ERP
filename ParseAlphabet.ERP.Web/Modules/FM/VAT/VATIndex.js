var viewData_form_title = "مالیات ارزش افزوده";


var viewData_controllername = "VATApi";

var viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;

var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}VAT.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";

get_NewPageTableV1();

function initForm() {
    fill_select2(`/api/GNApi/gettaxtype`, "vatTypeId", true);
    fill_select2(`/api/GN/NoSeriesLineApi/getdropdown_noseries`, "noSeriesId", true);
}


$("#AddEditModal")
    .on({
        "hidden.bs.modal": function () {

            $('#vatPer').val("");

            $("#vatTypeId").prop("disabled", false).val(1).trigger("change");
            $("#vatTypeId").prop("required", true);
            $("#noSeriesId").prop("disabled", false).val(0).trigger("change");
            $("#accountDetailId").prop("disabled", false).val(0).trigger("change");

        },
        "shown.bs.modal": function () {

           


            if (modal_open_state == "Add") {
                setDefaultActiveCheckbox($("#isActive"));

                $("#vatTypeId").prop("disabled", false);
                $("#vatTypeId").prop("required", false);

                $("#noSeriesId").prop("disabled", false);
                $("#noSeriesId").prop("required", true).trigger("change");


                $("#accountDetailId").attr("data-parsley-selectvalzero");
                $("#accountDetailId").prop("disabled", false).prop("required", true);
            }
            else {
                $("#vatTypeId").prop("disabled", true);
                $("#vatTypeId").prop("required", true);


                if (+$('#vatTypeId').val() == 2) {
                    $("#vatPer").prop("disabled", true);
                    $("#vatPer").prop("required", false);
                }

                else {
                    $("#vatPer").prop("disabled", true);
                    $("#vatPer").prop("required", true);
                }

            }
        }
    });






function checkExistVatId(model) {


    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/checkExist`;

    let outPut = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return outPut.responseJSON;

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
        name: $("#name").val(),
        vatTypeId: +$("#vatTypeId").val(),
        vatPer: +$("#vatPer").val(),
        noSeriesId: +$("#noSeriesId").val(),
        accountDetailId: +$("#accountDetailId").val(),
        isActive: $("#isActive").prop("checked"),

    }


    if (modal_open_state == "Add") {

        let checkExist = false;
        checkExist = checkExistVatId(newModel);
        if (checkExist)
            alertify.warning("نوع مالیات انتخاب شده قبلا ثبت شده است ، مجوز ثبت تکراری ندارید").delay(alertify_delay);
        else
            recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {
                if (result.successfull) {

                    modal_close();
                    $(".modal-backdrop.fade.show").remove();
                    get_NewPageTableV1();
                }
                else
                    alertify.error('عملیات ثبت با خطا مواجه شد.').delay(alertify_delay);

            });
    }

    else if (modal_open_state == "Edit")
        recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {

            if (result.successfull) {
                modal_close();
                $(".modal-backdrop.fade.show").remove();
                get_NewPageTableV1();
            }
            else
                alertify.error('عملیات ویرایش با خطا مواجه شد.').delay(alertify_delay);

        });


}


function run_button_editVat(vatId, rowNo, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(vatId);
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

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(vatId),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                fillEditVat(result);
                modal_show();

            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function fillEditVat(vat) {

    $("#modal_keyid_value").text(vat.id);

    $("#name").val(vat.name);

    $("#vatTypeId").val(+vat.vatTypeId).trigger("change.select2");



    if (+vat.vatTypeId === 2) {
        $("#vatPer").prop("disabled", true);
        $("#vatPer").prop("required", false);
        $("#requestId").prop("data-parsley-selectvalzero", false);
        $("#vatPer").val('');
    }
    else {

        $("#vatPer").prop("disabled", false);
        $("#vatPer").prop("required", true);
        $("#requestId").prop("data-parsley-selectvalzero", true);
        $("#vatPer").val(+vat.vatPer);
    }

    $("#noSeriesId").val(+vat.noSeriesId).trigger("change.select2");

    getModuleListByNoSeriesIdUrl(+vat.noSeriesId, "accountDetailId", () => {
        
        $("#accountDetailId").val(+vat.accountDetailId).trigger("change.select2");
    });


    $("#isActive").prop("checked", vat.isActive)


}

$("#noSeriesId").on("change", function () {
    
    if (+$(this).val() !== 0) {
        $("#accountDetailId").empty();
        $("#accountDetailId").prop("disabled", false);
        $("#accountDetailId").prop("required", true);

        getModuleListByNoSeriesIdUrl(+$("#noSeriesId").val(), "accountDetailId", undefined);
    }
    else
        $("#accountDetailId").empty();
});



$("#vatTypeId").on("change", function () {

    let vatTypeId = +$('#vatTypeId').val()

    if (vatTypeId == 2) {
        $('#vatPer').val("");
        $("#vatPer").prop("disabled", true);
        $("#vatPer").prop("required", false);
    }

    else {
        $("#vatPer").prop("disabled", false);
        $("#vatPer").prop("required", true);
    }

});


function getModuleListByNoSeriesIdUrl(noSeriesId, elmId, calback = undefined) {
    var url = "";
    
    if (noSeriesId === 0) {
        return;
    }
    else if (noSeriesId === 102) {
        fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });

    }
    else if (noSeriesId === 103) {
        fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 104) {
        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 105) {
        fill_select2(`${viewData_baseUrl_CR}/ContactApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 106) {
        fill_select2(`${viewData_baseUrl_FM}/ShareHolderApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 108) {
        fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 109) {
        fill_select2(`${viewData_baseUrl_FM}/CostCenterApi/getdropdown`, elmId, true, "1", false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 110) {
        fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getdropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 201) {
        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, elmId, true, "1/", false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 202) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "1,2", false, 0, "", () => { if (checkResponse(calback)) calback() });

    }
    else if (noSeriesId === 203) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "4", false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 204) {
        fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, elmId, true, "1/", true, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 205) {
        fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, elmId, true, 0, false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    else if (noSeriesId === 206) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "2", false, 0, "", () => { if (checkResponse(calback)) calback() });
    }
    // insurer -discount
    else {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "5", false, 0, "", () => { if (checkResponse(calback)) calback() });
    }

}



initForm();