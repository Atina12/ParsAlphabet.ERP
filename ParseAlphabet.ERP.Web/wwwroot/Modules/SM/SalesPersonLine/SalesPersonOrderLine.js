var viewData_form_title = "سفارش / برگشت",
    viewData_controllername = "SalesPersonOrderLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`,
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyids`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/deleteOrderLine`,
    viewData_getorderlinepagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getorderlinepage`,
    viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insertOrderLine`,
    viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`,
    viewData_OrderLine_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getorderlinefilteritems`,
    headerLine_formkeyvalue = [],
    arr_headerLinePagetables = [];

headerLine_formkeyvalue.push($("#personOrderId").val());
headerLine_formkeyvalue.push($("#stageId").val());
headerLine_formkeyvalue.push($("#routCurrencyId").val());

var additionalData = [];

//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonOrderLineList",
    editable: true,
    selectable: false,
    pagerowscount: 15,
    currentpage: 1,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: null,
    headerType: "outline",
    getpagetable_url: viewData_getorderlinepagetable_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_SM}/${viewData_controllername}/updateOrderLine`,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: viewData_OrderLine_filter_url,
    pagetable_laststate:""
};

arr_headerLinePagetables.push(pagelist1);

InitForm(undefined, undefined, undefined, function () {
    $("#personTypeId").trigger("change");

    if (+$("#stageId").val() === 3)
        $("#returnReasonId").parents(".form-group").addClass("displaynone");
    else
        $("#returnReasonId").parents(".form-group").removeClass("displaynone");

    additionalData = [
        { name: "headerId", value: headerLine_formkeyvalue[0] },
        { name: "stageId", value: headerLine_formkeyvalue[1] },
        { name: "currencyId", value: headerLine_formkeyvalue[2] },
        { name: "orderDatePersian", value: $("#orderDatePersian").val() }
    ];
});

$(document).ready(function () {
    $(document).on("change", "#itemId", function () {
        if ($(this).val() == null) {
            clearColumns();
        }
    })
})

function object_onfocus(elem) {
    elem.select();
}
function object_onblur(elem) {

}
function object_onchange(elem) {

}
function object_onkeydown(e, elem) {

}

function tr_object_onblur(elem) {

    var elem = $(elem);
    var elemId = $(elem).attr("id");

    switch (elemId) {
        case "price":
            get_prices();
            break;
        case "discountAmount":
            get_prices();
            break;
        case "quantity":
            get_prices();
            break;
    }
}

function tr_object_onfocus(elem) {
    $(elem).select();
}

function tr_object_onkeydown(e, elem) {
    if (e.which === KeyCode.Enter) {

        var elem = $(elem);
        var elemId = $(elem).attr("id");

        switch (elemId) {
            case "price":
                get_prices();
                break;
            case "discountAmount":
                get_prices();
                break;
            case "quantity":
                get_prices();
                break;

        }
    }
}

function local_trObjectChange(elem) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");

    switch (elemId) {
        case "itemTypeName":
            fill_items(elem.val());
            break;
        case "itemId":
            get_prices();
            break;
    }
}

function clearColumns() {
    $("#grossAmount").val(0);
    $("#discountAmount").val(0);
    $("#price").val(0);
    $("#quantity").val(0);
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#netAmountPlusVAT").val(0);
    $("#jsonOrderLineList .ins-row").attr("data-hidden-discpercent", 0);
    $("#jsonOrderLineList .ins-row").attr("data-hidden-vatper", 0);
    $("#priceIncludingVAT input[type='checkbox']").val(0);
    $("#priceIncludingVAT input[type='checkbox']").removeAttr("checked");
}

function get_prices() {
    if ($("#itemId").val() != null && $("#itemId").val() != 0) {
        var model = [
            {
                Title: "ItemId", Value: $("#itemId").val()
            },
            {
                Title: "Quantity", Value: $("#quantity").val() == "" ? 0 : $("#quantity").val()
            },
            {
                Title: "Price", Value: $("#price").val() == "" ? 0 : parseInt($("#price").val().replace(',', ''))
            },
            {
                Title: "DiscountAmount", Value: $("#discountAmount").val() == "" ? 0 : parseInt($("#discountAmount").val().replace(',', ''))
            },
            {
                Title: "ItemTypeId", Value: $("#itemTypeName").val()
            },
            {
                Title: "OrderTypeId", Value: additionalData[1].value
            },
            {
                Title: "CurrencyId", Value: $("#currencyId").val()
            }
        ];

        $.ajax({
            url: `${viewData_baseUrl_SM}/${viewData_controllername}/getOrderLinePrice`,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {

                var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == "jsonOrderLineList");
                var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";

                if (headerId == "ins-row")
                    $(`#jsonOrderLineList .${headerId} #price`).parents("th").find(".range-price-table").addClass("displaynone");
                else
                    $(`#jsonOrderLineList .${headerId} #price`).parents("div").find(".range-price-table").addClass("displaynone");

                $("#price").removeAttr("onfocus");
                var data = result.data[0];
                if (data.status >= 0) {
                    $("#grossAmount").val(transformNumbers.toComma(data.grossAmount));
                    $("#exchangeRate").val(transformNumbers.toComma(data.exchangeRate));
                    $("#discountAmount").val(transformNumbers.toComma(data.discountAmount));
                    $("#netAmount").val(transformNumbers.toComma(data.netAmount));
                    $("#vatAmount").val(transformNumbers.toComma(data.vatAmount));
                    $("#netAmountPlusVAT").val(transformNumbers.toComma(data.netAmountPlusVat));
                    $(`#jsonOrderLineList .${headerId}`).attr("data-hidden-discpercent", data.discountPercent);
                    $(`#jsonOrderLineList .${headerId}`).attr("data-hidden-vatper", data.vatPer);
                    $("#priceIncludingVAT").val(data.priceIncludingVAT);

                    if (data.priceIncludingVAT == true)
                        $("#priceIncludingVAT input[type='checkbox']").attr("checked", "checked");
                    else
                        $("#priceIncludingVAT input[type='checkbox']").removeAttr("checked");

                    if (data.allowInvoiceDisc != true)
                        $("#discountAmount").attr("disabled", "disabled");
                    else
                        $("#discountAmount").removeAttr("disabled");

                    if (data.maxPrice != 0) {

                        var exist = null;
                        if (headerId == "ins-row")
                            exist = $(`#jsonOrderLineList .${headerId} #price`).parents("th").find(".range-price-table");
                        else
                            exist = $(`#jsonOrderLineList .${headerId} #price`).parent("div").find(".range-price-table");
                        $(`#jsonOrderLineList .${headerId} #price`).attr("data-parsley-range", `[${data.minPrice},${data.maxPrice}]`);
                        if (exist.length > 0)
                            exist.remove();
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${transformNumbers.toComma(data.minPrice)} - ${transformNumbers.toComma(data.maxPrice)} </div></div>`;

                        if (headerId == "ins-row") {
                            $(`#jsonOrderLineList .${headerId} #price`).parents("th").append(priceRangeControl);
                            $("#price").parents("th").css("position", "relative");
                        }
                        else {
                            $(`#jsonOrderLineList .${headerId} #price`).parent("div").append(priceRangeControl);
                            $("#price").parent("div").css("position", "relative");
                        }

                        $("#price").removeAttr("disabled");

                        $("#price").attr("onfocus", "showFocusRangeControl(this,'jsonOrderLineList')");
                    }
                    else {
                        if (headerId == "ins-row")
                            $(`#jsonOrderLineList .${headerId} #price`).parents("th").find(".range-price-table").addClass("displaynone");
                        else
                            $(`#jsonOrderLineList .${headerId} #price`).parent("div").find(".range-price-table").addClass("displaynone");

                        $(`#jsonOrderLineList .${headerId} #price`).removeAttr("data-parsley-range");


                        $("#price").val(transformNumbers.toComma(data.minPrice));
                        $("#price").attr("disabled", "disabled");
                    }
                }
                else {
                    var msg = alertify.error(data.statusMessage);
                    msg.delay(2);
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_getrecord_url)
            }
        });
    }
}

function fill_items(id) {

    $("#itemId").html("");
    var dropDownUrl = "";
    var param = 0;
    switch (id) {
        case "1":
            dropDownUrl = `${viewData_baseUrl_WH}/ItemApi/getdropdownbytype`;
            param = 1;
            break;
        case "2":
            dropDownUrl = `${viewData_baseUrl_WH}/ItemApi/getdropdownbytype`;
            param = 2;
            break;
        case "3":
            dropDownUrl = `${viewData_baseUrl_HR}/EmployeeApi/getdropdown`;
            break;
        case "4":
            dropDownUrl = `${viewData_baseUrl_FA}/FixedAssetApi/getDropDownByType`;
            break;
        case "5":
            dropDownUrl = `${viewData_baseUrl_FA}/FixedAssetApi/getDropDownByType`;
            break;
    }
    fill_select2(dropDownUrl, "itemId", true, param, false, 3, "انتخاب"
        , function () {
            $("#itemId").val($("#itemId").data("val")).trigger("change");;
            $("#itemId").data("val", "");
        }
    );
    $("#itemId").val($("#itemId").data("val"));
}

function local_objectChange(elem) {
    var elem = $(elem);
    var elemId = $(elem).attr("id");

    switch (elemId) {
        case "personTypeId":
            fill_personTypes(elem.val());
            break;
    }
}

function fill_personTypes(id) {

    $("#personId").html("");
    var dropDownUrl = "";
    switch (id) {
        case "1":
            dropDownUrl = viewData_baseUrl_SM + "/CustomerApi" + "/getdropdown";
            fill_select2(dropDownUrl, "personId", true, 0, false, 3, "انتخاب"
                , function () {
                    $("#personId").val($("#personId").data("val")).trigger("change");;
                    $("#personId").data("val", "");
                }
            );
            $("#personId").val($("#personId").data("val"));
            break;
        case "2":
            dropDownUrl = viewData_baseUrl_PU + "/VendorApi" + "/getdropdown";
            fill_select2(dropDownUrl, "personId", true, 0, false, 3, "انتخاب", function () {
                $("#personId").val($("#personId").data("val")).trigger("change");
                $("#personId").data("val", "");
            });
            break;
        case "3":
            dropDownUrl = viewData_baseUrl_HR + "/EmployeeApi" + "/getdropdown";
            fill_select2(dropDownUrl, "personId", true, 0, false, 3, "انتخاب", function () {
                $("#personId").val($("#personId").data("val")).trigger("change");
                $("#personId").data("val", "");
            });
            break;
        case "4":
            dropDownUrl = viewData_baseUrl_CR + "/ContactApi" + "/getdropdown";
            fill_select2(dropDownUrl, "personId", true, 0, false, 3, "انتخاب", function () {
                $("#personId").val($("#personId").data("val")).trigger("change");
                $("#personId").data("val", "");
            });
            break;
    }
}

