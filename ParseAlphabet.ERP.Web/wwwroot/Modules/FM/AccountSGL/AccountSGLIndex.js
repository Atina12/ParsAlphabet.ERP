var viewData_form_title = "کدینگ حسابداری معین",
    viewData_controllername = "AccountSGLApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_getMaxId_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getmaxid`,
    viewData_getCategoryName_url = `${viewData_baseUrl_FM}/AccountGLApi/getaccountcategory`,
    viewData_getlLastAccountSGLId_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getlastaccountsglid`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}AccountSGL.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0, keyName: "GLId", keyValue: 0 },
    viewData_print_tableName = "",
    arrayCheck = [],
    currencyArrayCheck = [],
    form = $(`#addEditModalForm`).parsley(),
    isSecondLang = true;

function initFormAccountSGL() {

    get_NewPageTableV1();

    fill_select2(`${viewData_baseUrl_FM}/AccountGLApi/getactivedropdown`, "glId", true, 0, false);
    fillItemCheckBox();
    fillCurrencyItemCheckBox();
}

function fillCategory(id) {

    $.ajax({
        url: viewData_getCategoryName_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(id),
        success: function (result) {
            $("#accountCategoryName").val(result.text);
            GetLastAccountSGLId(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getCategoryName_url);
        }
    });
}

function GetLastAccountSGLId() {
    $("#id").val("");
    let accountGLId = +$("#glId").val();
    $.ajax({
        url: viewData_getlLastAccountSGLId_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(accountGLId),
        success: function (result) {
            $("#id").val(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getlLastAccountSGLId_url);
        }
    });

}

function getMaxId() {
    $.ajax({
        url: viewData_getMaxId_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (result) {
            $("#id").val(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getMaxId_url);
        }
    });
}

function run_button_getaccountsgl(p_keyvalue, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    if (modal_name == null)
        modal_name = modal_default_name;

    viewData_modal_title = "ویرایش " + viewData_form_title;

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
        glId: +getRow.find(`#col_${rowNo}_1`).text(),
        id: getRow.find(`#col_${rowNo}_3`).text()
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

            $("#fillItem div label").children("input[type='checkbox']:checked").prop("checked", false);
            $("#currencyContainer div label").children("input[type='checkbox']:checked").prop("checked", false);

            modal_fill_items(result.data, modal_name);

            var chekBox = $("#fillItem div label").children("input[type='checkbox']");
            for (var i = 0; i < chekBox.length; i++) {
                let NoSeriesId = result.data.ids;
                let inputChek = chekBox[i];
                for (var j = 0; j < NoSeriesId.length; j++) {
                    if (NoSeriesId[j].id == $(inputChek).data().value) {
                        $(inputChek).prop("checked", true).trigger("change");
                    }
                }
            }

            var chekBox3 = $("#currencyContainer div label").children("input[type='checkbox']");
            for (var i = 0; i < chekBox3.length; i++) {
                let NoSeriesId = result.data.currencyIds;
                let inputChek = chekBox3[i];
                for (var j = 0; j < NoSeriesId.length; j++) {
                    if (NoSeriesId[j].id == $(inputChek).data().value) {
                        $(inputChek).prop("checked", true).trigger("change");
                    }
                }
            }

            if (+result.data.accountDetailRequired == 0)
                $("#accountDetailRequired").val("3").trigger("change");

            modal_show(modal_name);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function run_button_deletesgl(p_keyvalue, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var getRow = $(`#row${rowNo}`);
    var modelAccount = {
        glId: +getRow.find(`#col_${rowNo}_1`).text(),
        id: getRow.find(`#col_${rowNo}_3`).text()
    };
    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(modelAccount),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {

                        get_NewPageTableV1();

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {
                        if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                            generateErrorValidation(result.validationErrors);
                            return;
                        }
                        else {
                            alertify.error(result.statusMessage).delay(alertify_delay);

                        }
                    }


                },
                error: function (xhr) {

                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function fillItemCheckBox() {
    let url = "/api/GNApi/noseries_getdropdown";
    $.get(url, function (result) {
        let str = result.map(item => {
            return `<div class="col-sm-6 pr-0"><label><input id="no_${item.id}" data-value="${item.id}" type="checkbox" onchange="arrayChecked(this)"/> ${item.name}</label></div>`;
        })
        $("#fillItem").html(str)
    });
}

function fillCurrencyItemCheckBox() {
    let url = "/api/GN/CurrencyApi/getdropdown";
    $.get(url, function (result) {
        let str = result.map(item => {
            return `<div class="col-sm-6 pr-0"><label><input id="cr_${item.id}" data-value="${item.id}" type="checkbox" onchange="currencyArrayChecked(this)"/> ${item.name}</label></div>`;
        })
        $("#currencyContainer").html(str)
    });
}

function arrayChecked(item) {
    let idChcke = $(item).data().value;

    var noSeriesIndex = arrayCheck.findIndex(x => x.id === idChcke);

    if ($(item).prop("checked")) {
        if (noSeriesIndex === -1)
            arrayCheck.push({ id: idChcke })
    }
    else {
        var noSeriesIndex = arrayCheck.findIndex(x => x.id === idChcke);
        if (noSeriesIndex !== -1)
            arrayCheck.splice(noSeriesIndex, 1);
    }
}

function currencyArrayChecked(item) {
    let idChcke = $(item).data().value;

    var currencyIndex = currencyArrayCheck.findIndex(x => x.id === idChcke);

    if ($(item).prop("checked")) {
        if (currencyIndex === -1)
            currencyArrayCheck.push({ id: idChcke })
    }
    else {
        if (currencyIndex !== -1)
            currencyArrayCheck.splice(currencyIndex, 1);
    }
}

function modal_operation() {

    var validate = form.validate();
    validateSelect2(form);
    var modal_name = "AddEditModal";

    if (!validate) return;
    if (($("#accountDetailRequired").val() == 1 || $("#accountDetailRequired").val() == 2) && arrayCheck.length <= 0) {
        var msg = alertify.warning("تفصیل اجباریست / اختیاریست حداقل یک مورد را انتخاب نمایید");
        msg.delay(alertify_delay);
        return;
    }

    if (currencyArrayCheck.length <= 0) {
        var msg = alertify.warning("حداقل یک مورد ارز را انتخاب نمایید");
        msg.delay(alertify_delay);
        return;
    }

    if ($("#accountDetailRequired").val() == 3)
        arrayCheck = [];

    let parameters = {
        gLId: $("#glId").val(),
        id: +$("#id").val(),
        name: $("#name").val(),
        isActive: $("#isActive").prop("checked"),
        accountDetailRequired: $("#accountDetailRequired").val(),
        ids: arrayCheck,
        currencyIds: currencyArrayCheck,
        accountCategoryId: $("#accountCategoryId").val()
    };

    if (modal_open_state == "Add")
        recordInsertUpdate(viewData_insrecord_url, parameters, modal_name, msg_row_created, undefined, get_NewPageTableV1);
    else if (modal_open_state == "Edit")
        recordInsertUpdate(viewData_updrecord_url, parameters, modal_name, msg_row_edited, undefined, get_NewPageTableV1);
}

$("#accountDetailRequired").on("change", function () {

    var chekBox = $("#fillItem div label").children("input[type='checkbox']");

    if (+this.value == 3)
        for (var i = 0; i < chekBox.length; i++) {
            let inputChek = chekBox[i];
            $(inputChek).prop("checked", false).trigger("change").prop("disabled", true);
        }
    else
        for (var i = 0; i < chekBox.length; i++) {
            let inputChek = chekBox[i];
            $(inputChek).prop("disabled", false);
        }


});

$("#glId").on('change', function () {
    if (+$(this).val() > 0)
        fillCategory(+$(this).val());
    else
        $("#accountCategoryName").val("");
});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Add") {
        $("#id").prop("disabled", false);
        $("#glId").val(0).trigger("change");
        getMaxId();
        $("#isActive").prop("checked", true);
        $(`[href="#accountDetail"]`).click();
        funkyradio_onchange($("#isActive"));
        $("#fillItem input").prop("disabled", false)
    }
    else {
        if ($("#accountDetailRequired").val() == 3)
            $("#fillItem input").prop("disabled", true)
        $(`[href="#accountDetail"]`).click();
        $("#id").prop("disabled", true);
    }


});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") {
        $("#glId").prop('disabled', true);
        $("#name").focus().first();
    }
    else
        $("#glId").prop('disabled', false);
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    arrayCheck = [];
    currencyArrayCheck = [];
})

initFormAccountSGL();