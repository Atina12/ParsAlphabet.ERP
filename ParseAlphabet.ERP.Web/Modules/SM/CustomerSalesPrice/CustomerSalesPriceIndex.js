
var viewData_form_title = "قیمت گذاری کالا",
    viewData_controllername = "CustomerSalesPriceApi",
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`,
    viewData_save_url = `${viewData_baseUrl_SM}/${viewData_controllername}/save`,
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_check_itemId_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getitemid`,
    viewData_itemsaleId_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getitemsale`,
    viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}CustomerSalesPrice.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`,
    arrayIdsCustomerGroup = [],
    modal_default_name = "AddEditModal";



function initCustomerSalePriceIndex() {
    get_NewPageTableV1();

    loadDropdownCustomerSalePriceIndex()

    getCustomerGroup()

    $("select").prop("selectedIndex", 0).trigger("change");

}

function loadDropdownCustomerSalePriceIndex() {
    fill_dropdown(`/api/GNapi/pricingmodlgetdropdown`, "id", "name", "pricingModelId");
    fill_dropdown(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "id", "name", "currencyId");
    fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, "vendorId", true, 0);
    fill_select2(`/api/SMApi/contracttypegetdropdown`, "contractTypeId", false, 0);
    fill_select2(`/api/GNApi/pricetypegetdropdown`, "priceTypeId", false);
    fill_dropdown("/api/WHApi/itemTypeSalesPrice_getDropDown", "id", "name", "itemTypeId", true);
}

function checkExistItemId(itemId, currencyId) {

    var model = { currencyId, itemId }
    var output = $.ajax({
        url: viewData_check_itemId_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_itemId_url);
            return JSON.parse(false);
        }
    });

    return output.responseJSON;
}

function run_button_getrecord(p_keyvalue, rowNo, elem) {

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

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
            var arrayIdsCustomerGroupLen = arrayIdsCustomerGroup.length,
                customerSalesPriceDetailData = result.data.customerSalesPriceDetail,
                customerSalesPriceDetailLen = customerSalesPriceDetailData.length;

            for (var i = 0; i < arrayIdsCustomerGroupLen; i++)
                for (var j = 0; j < customerSalesPriceDetailLen; j++)
                    if (arrayIdsCustomerGroup[i] === customerSalesPriceDetailData[j].id)
                        $(`#c_${arrayIdsCustomerGroup[i]}`).prop("checked", true);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function run_button_deleterecord(p_keyvalue, rowNo) {


    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var getRow = $(`#row${rowNo}`);
    var modelSalePrice = {
        itemTypeId: +getRow.find(`#col_${rowNo}_1`).text(),
        itemId: +getRow.find(`#col_${rowNo}_3`).text(),
        currencyId: getRow.find(`#col_${rowNo}_5`).text()
    };
    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(modelSalePrice),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {
                        //var pagetableid = $(elem).closest("td").parent().parent().parent().parent().parent().attr("id");

                        get_NewPageTableV1();

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {
                        var msg = alertify.error(result.statusMessage);
                        msg.delay(alertify_delay);
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

function getCustomerGroup() {

    var url = `${viewData_baseUrl_SM}/CustomerDiscountGroupApi/getlist`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(),
        success: function (result) {
            appendCustomerGroup(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return JSON.parse(false);
        }
    });
}

async function appendCustomerGroup(result) {
    var resultLen = result.length;
    if (resultLen > 0) {
        $("#tempCustomersGroup").html("");
        let output = '', data = null;
        for (var i = 0; i < resultLen; i++) {

            data = result[i];
            arrayIdsCustomerGroup.push(data.id);
            output += `<tr tabindex="-1" id="rowSale_${+i + 1}" onkeydown="eventTrTable(${+i + 1},event,${result.length},'${data.id}')" onclick="eventclickRow(${+i + 1})">
                          <td class="text-center"><input class="checkSale" type="checkbox" id="c_${data.id}" /></td>
                          <td>${data.id}</td>
                          <td>${data.personGroup}</td>
                          <td>${data.minQuantity}</td>
                          <td>${data.minQuantitySale}</td>
                          <td>${data.priceTypeId == 1 ? "درصد" : "نرخ"}</td>
                          <td>${transformNumbers.toComma(data.price == null ? 0 : data.price)}</td>
                     </tr>`;
        }
        $(output).appendTo("#tempCustomersGroup");
    }
    else {
        $("#tempCustomersGroup").html(fillEmptyRow(6));
    }
}

function eventTrTable(row, e, countRow, id) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Space].indexOf(e.keyCode) < 0) return;

    $(`#tempCustomersGroup tr`).removeClass("highlight");
    var mode = $(`#rowSale_${row} .checkSale`).prop("checked") ? false : true;

    if (e.keyCode === KeyCode.ArrowUp)
        if (row > 1)
            $(`#rowSale_${row - 1}`).addClass("highlight").focus();
        else
            $(`#rowSale_${row}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (row < countRow)
            $(`#rowSale_${row + 1}`).focus().addClass("highlight");
        else
            $(`#rowSale_${row}`).focus().addClass("highlight");


    if (e.keyCode === KeyCode.Space) {
        $(`#rowSale_${row}`).addClass("highlight").focus();
        $(`#rowSale_${row} .checkSale`).prop("checked", mode);
    }

}

function eventclickRow(row) {
    $(`#tempCustomersGroup tr`).removeClass("highlight"); $(`#rowSale_${row}`).focus().addClass("highlight");
};

function saveCustomerSalesPrice() {
    var form = $("#customerSalesPriceForm").parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) {
        if ($("#box1 *").hasClass("parsley-error")) valditionCustomerSalePrie(1);
        else if ($("#box3 *").hasClass("parsley-error")) valditionCustomerSalePrie(3);
        return;
    }
    var arrayIdsCustomerGroupLen = arrayIdsCustomerGroup.length, newModelCustomers = [];
    for (var i = 0; i < arrayIdsCustomerGroupLen; i++)
        if ($(`#c_${arrayIdsCustomerGroup[i]}`).prop("checked"))
            newModelCustomers.push({ id: arrayIdsCustomerGroup[i] });

    var model = {
        id: +$("#modal_keyid_value").text(),
        itemTypeId: +$("#itemTypeId").val(),
        itemId: +$("#itemId").val(),
        currencyId: +$("#currencyId").val(),
        pricingModelId: +$("#pricingModelId").val(),
        minPrice: +removeSep($("#minPrice").val()),
        maxPrice: +removeSep($("#maxPrice").val()),
        allowInvoiceDisc: $("#allowInvoiceDisc").prop("checked"),
        priceIncludingVAT: $("#priceIncludingVAT").prop("checked"),
        isActive: $("#isActive").prop("checked"),
        contractTypeId: +$("#contractTypeId").val(),
        priceTypeId: +$("#priceTypeId").val() === 0 ? null : +$("#priceTypeId").val(),
        comissionPrice: +removeSep($("#comissionPrice").val()),
        vendorId: +$("#vendorId").val(),
        customerSalesPriceDetail: newModelCustomers
    };
    saveCustomerSalePriceAsync(model).then(async (data) => {
        if (data.successfull) {
            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);

            modal_close("AddEditModal");
            get_NewPageTableV1();
        }
        else {
            var msgError = alertify.error(data.statusMessage);
            msgError.delay(alertify_delay);
        }
    });
}

function valditionCustomerSalePrie(boxNo) {
    var parsleyLength = $(`#box${boxNo} .parsley-error`).length, elmenetId;
    for (var i = 0; i < parsleyLength; i++) {

        elmenetId = $(`#box${boxNo} .parsley-error:eq(${i})`).attr("id");
        changeTabCustomerSale(+boxNo - 1);

        if (typeof elmenetId != "undefined" && elmenetId != "")
            if ($(`#${elmenetId}`).hasClass("select2")) {

                setTimeout(() => { $(`#${elmenetId}`).select2("focus"); }, 50);
                break;
            }
            else {

                setTimeout(() => { $(`#${elmenetId}`).focus(); }, 50);
                break;
            }

    }
}

function changeTabCustomerSale(no) {
    $("#customerSalesPriceForm .nav-link").removeClass("active");
    $(`#customerSalesPriceForm .nav-link:eq(${no})`).addClass("active");
    $("#customerSalesPriceForm .tab-pane").removeClass("active");
    $(`#customerSalesPriceForm .tab-pane:eq(${no})`).addClass("active");
}

function resetFormCustomerSalePrice() {
    $("#AddEditModal select").prop("selectedIndex", 0).trigger("change");
    $("input").val("");
    $("[type='checkbox']").prop("checked", false);
    $("#firsTab a").click();
}

function focusSaveButton(e) {
    if (e.keyCode === KeyCode.Enter) $("#modal-save").focus();
};

async function saveCustomerSalePriceAsync(data) {
    $("#modal-save").prop("disabled", true)
    let result = await $.ajax({
        url: viewData_save_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
            return data;
        },
        error: function (xhr) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
            error_handler(xhr, viewData_save_url);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

$("#priceTypeId").on("change", function () {

    if ($(this).val() == 1)
        $("#comissionPrice").attr("data-parsley-percentage", true).attr("maxlength", "3").val("");
    else
        $("#comissionPrice").removeAttr("data-parsley-percentage").attr("maxlength", "13").val("");
    $("#comissionPrice").removeClass("parsley-error").parent().find("ul li").html("");
});

$("#contractTypeId").on("change", function () {

    if (+$(this).val() !== 0) {
        if ($(this).val() == 1) {
            $("#priceTypeId").removeAttr("data-parsley-selectvalzero").removeAttr("required").prop("disabled", true).prop("selectedIndex", 0).trigger("change");
            $("#comissionPrice").removeAttr("required").prop("disabled", true).removeAttr("data-parsley-percentage").val("");
            $("#vendorId").removeAttr("data-parsley-selectvalzero").removeAttr("required").prop("disabled", true).prop("selectedIndex", 0).trigger("change");
        }
        else {
            $("#priceTypeId").attr("data-parsley-selectvalzero", true).attr("required", true).prop("disabled", false).prop("selectedIndex", 0).trigger("change");
            $("#comissionPrice").attr("required", true).prop("disabled", false).val("");
            $("#vendorId").attr("data-parsley-selectvalzero", true).attr("required", true).prop("disabled", false).prop("selectedIndex", 0).trigger("change");
        }
        $("#priceTypeId").removeClass("parsley-error").parent().find("ul li").html("");
        $("#comissionPrice").removeClass("parsley-error").parent().find("ul li").html("");
        $("#vendorId").removeClass("parsley-error").parent().find("ul li").html("");
    }
    else
        $("#contractTypeId").val(1).trigger("change");

});

$("#itemTypeId").on('change', function () {
    $("#itemId").html(`<option value="0">انتخاب کنید</option>`);
    fill_select2(viewData_itemsaleId_url, "itemId", true, +$(this).val());
    $("#itemId").prop("selectedIndex", 0).trigger("change");
});

$("#AddEditModal").on("hidden.bs.modal", () => { resetFormCustomerSalePrice() });

$("#AddEditModal").on("shown.bs.modal", function () {

    if (modal_open_state == "Edit") {
        $("#itemId").prop("disabled", true);
        $("#currencyId").prop("disabled", true);
        $("#itemTypeId").prop("disabled", true);
        $("#itemId").prop("required", false);
        $("#itemId").removeAttr("data-parsley-existitemid");
    }
    else {
        $("#pricingModelId").val("1").trigger("change");
        $("#itemId").prop("disabled", false);
        $("#currencyId").prop("disabled", false);
        $("#itemTypeId").prop("disabled", false);
        $("#itemId").prop("required", true);
        $("#itemId").attr("data-parsley-existitemid", "");
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#pricingModelId").on('change', function () {
    if (+$(this).val() === 1) {
        $("#captionFixPrice").text("نرخ")
        $("#rangePrice").addClass("displaynone");
        $("#maxPrice").val("");
        $("#minPrice").removeAttr("data-parsley-minmaxprice");
    } else {
        $("#captionFixPrice").text("نرخ اول")
        $("#rangePrice").removeClass("displaynone");
        $("#maxPrice").val("");
        $("#minPrice").attr("data-parsley-minmaxprice", true);
    }
    $("#minPrice").removeClass("parsley-error").parent().find("ul li").html("");
});

$("#itemId").change(function () {
    if (+$(this).val() == 0) {
        $("#categoryName").val("");
        return;
    }
    if (+$("#itemTypeId").val() == 1 || +$("#itemTypeId").val() == 2) {
        var url = `${viewData_baseUrl_WH}/ItemApi/getinfo/${+$(this).val()}`;
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            async: false,
            success: function (result) {
                $("#categoryName").val(result.categoryName == null ? "" : result.categoryName);
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return JSON.parse(false);
            }
        });
    }
    else if (+$("#itemTypeId").val() == 4) {
        var url = `${viewData_baseUrl_FA}/FixedAssetApi/getcategory`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(+$(this).val()),
            success: function (result) {
                $("#categoryName").val(result.text == null ? "" : result.text);
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return JSON.parse(false);
            }
        });
    }
});

$("#itemTypeId").change(function () {

    if ($("#itemTypeId").val() == 1)
        $("#categoryNameDiv").removeClass("displaynone");
    else
        $("#categoryNameDiv").addClass("displaynone");
});

window.Parsley._validatorRegistry.validators.minmaxprice = undefined
window.Parsley.addValidator("minmaxprice", {
    validateString: function (value) {
        var min = +removeSep($("#minPrice").val());
        var max = +removeSep($("#maxPrice").val());
        if (min <= max)
            return true;

        return false;
    },
    messages: {
        en: 'نرخ اول باید کوچیکتر مساوی نرخ دوم باشد'
    }
});

window.Parsley._validatorRegistry.validators.existitemid = undefined
window.Parsley.addValidator("existitemid", {
    validateString: function (value) {
        if (value !== "") {
            return checkExistItemId(value, +$("#modal_keyid_value").text());
        }

        return true;
    },
    messages: {
        en: 'کد کالا قبلا ثبت شده است'
    }
});

window.Parsley._validatorRegistry.validators.doublepricecheck = undefined
window.Parsley.addValidator("doublepricecheck", {
    validateString: function (value) {
        if ($("#contractTypeId").val() != 1)
            if ($("#priceTypeId").val() != 1)
                if ($("#pricingModelId").val() == 1) {
                    var price = +removeSep($("#minPrice").val()), comission = +removeSep($("#comissionPrice").val());
                    if (price < comission) {
                        return false;
                    }
                }
        return true;
    },
    messages: {
        en: "در مدل قیمت گذاری نرخ ثابت ، نرخ حق الزحمهنمیتواند بیشتر از نرخ باشد"
    }
});

window.Parsley._validatorRegistry.validators.singlepricecheck = undefined
window.Parsley.addValidator("singlepricecheck", {
    validateString: function (value) {
        if ($("#contractTypeId").val() != 1)
            if ($("#priceTypeId").val() != 1)
                if ($("#pricingModelId").val() != 1) {
                    var min = +removeSep($("#minPrice").val()), max = +removeSep($("#maxPrice").val()), comission = +removeSep($("#comissionPrice").val());
                    if (min > comission || max < comission) {
                        return false;
                    }
                }
        return true;
    },
    messages: {
        en: "در مدل قیمت گذاری محدوده نرخ ، نرخ حق الزحمهنمیتواند خارج از محدوده نرخ باشد"
    }
});

initCustomerSalePriceIndex()
