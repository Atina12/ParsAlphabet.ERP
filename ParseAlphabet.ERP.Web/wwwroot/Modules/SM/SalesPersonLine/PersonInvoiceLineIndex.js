
var viewData_form_title = "سفارش / برگشت";

debugger
var viewData_controllername = "SalesPersonInvoiceLineApi";
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;

var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyids`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/deleteInvoiceLine`;
var viewData_getInvoicelinepagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getinvoicelinepage`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insertInvoiceLine`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_InvoiceLine_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilterlinefilteritems`;

var headerLine_formkeyvalue = [];
var arr_headerLinePagetables = [];

headerLine_formkeyvalue.push($("#personInvoiceId").val());
headerLine_formkeyvalue.push($("#routCurrencyId").val());

var additionalData = [
    { name: "HeaderId", value: headerLine_formkeyvalue[0] },
    //{ name: "InvoiceTypeId", value: headerLine_formkeyvalue[1] },
    //{ name: "BranchId", value: headerLine_formkeyvalue[2] }
];

//  pagetable_id => باید دقیقا با آیتم معادل آن که از ریپازیتوری گرفته میشود یکی باشد
var pagelist1 = {
    pagetable_id: "jsonInvoiceLineList",
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
    getpagetable_url: viewData_getInvoicelinepagetable_url,
    insRecord_Url: viewData_insrecord_url,
    getRecord_Url: viewData_getrecord_url,
    upRecord_Url: `${viewData_baseUrl_PU}/${viewData_controllername}/updateInvoiceLine`,
    delRecord_Url: viewData_deleterecord_url,
    getfilter_url: viewData_InvoiceLine_filter_url,
    pagetable_laststate:""
};

arr_headerLinePagetables.push(pagelist1);

//InitForm();
InitForm(function () {

    $("#itemTypeName").val("0").trigger("change");
    $("#personTypeId").trigger("change");

    if (+$("#invoiceTypeId").val() === 45)
        $("#returnReasonId").parents(".form-group").addClass("displaynone");
    else
        $("#returnReasonId").parents(".form-group").removeClass("displaynone");

    if (!$("#officialInvoice").prop("checked")) {
        $("#personTypeId").prop("disabled", true);
        $("#personId").prop("disabled", true);
    }
});

$(document).ready(function () {

    $(document).on("change", "#itemId", function () {

        if ($(this).val() == null)
            clearColumns();
    });
});

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
        case "discAmount":
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
            case "discAmount":
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
            //clearColumns();
            fill_items(elem.val());
            break;
        case "itemId":
            //clearColumns();
            get_prices();
            break;
    }
}

function clearColumns() {
    $("#grossAmount").val(0);
    $("#discAmount").val(0);
    $("#price").val(0);
    $("#quantity").val(0);
    $("#netAmount").val(0);
    $("#vatAmount").val(0);
    $("#netAmountPlusVAT").val(0);
    $("#jsonInvoiceLineList .ins-row").attr("data-hidden-discpercent", 0);
    $("#jsonInvoiceLineList .ins-row").attr("data-hidden-vatper", 0);
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
                Title: "DiscountAmount", Value: $("#discAmount").val() == "" ? 0 : parseInt($("#discAmount").val().replace(',', ''))
            },
            {
                Title: "ItemTypeId", Value: $("#itemTypeName").val()
            },
            {
                Title: "InvoiceTypeId", Value: $("#invoiceTypeId").val()
            },
            {
                Title: "CurrencyId", Value: $("#currencyId").val()
            }
        ];

        $.ajax({
            url: `${viewData_baseUrl_SM}/${viewData_controllername}/getInvoiceLinePrice`,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {

                var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == "jsonInvoiceLineList");
                var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";

                if (headerId == "ins-row")
                    $(`#jsonInvoiceLineList .${headerId} #price`).parents("th").find(".range-price-table").addClass("displaynone");
                else
                    $(`#jsonInvoiceLineList .${headerId} #price`).parents("div").find(".range-price-table").addClass("displaynone");

                $("#price").removeAttr("onfocus");
                var data = result.data[0];
                if (data.status >= 0) {
                    $("#grossAmount").val(transformNumbers.toComma(data.grossAmount));
                    $("#exchangeRate").val(transformNumbers.toComma(data.exchangeRate));
                    $("#discAmount").val(transformNumbers.toComma(data.discAmount));
                    $("#netAmount").val(transformNumbers.toComma(data.netAmount));
                    $("#vatAmount").val(transformNumbers.toComma(data.vatAmount));
                    $("#netAmountPlusVAT").val(transformNumbers.toComma(data.netAmountPlusVAT));
                    $(`#jsonInvoiceLineList .${headerId}`).attr("data-hidden-discpercent", data.discPercent);
                    $(`#jsonInvoiceLineList .${headerId}`).attr("data-hidden-vatper", data.vatPer);
                    $("#priceIncludingVAT").val(data.priceIncludingVAT);

                    if (data.priceIncludingVAT == true)
                        $("#priceIncludingVAT input[type='checkbox']").attr("checked", "checked");
                    else
                        $("#priceIncludingVAT input[type='checkbox']").removeAttr("checked");

                    if (data.allowInvoiceDisc != true)
                        $("#discAmount").attr("disabled", "disabled");
                    else
                        $("#discAmount").removeAttr("disabled");

                    if (data.maxPrice != 0) {

                        var exist = null;
                        if (headerId == "ins-row")
                            exist = $(`#jsonInvoiceLineList .${headerId} #price`).parents("th").find(".range-price-table");
                        else
                            exist = $(`#jsonInvoiceLineList .${headerId} #price`).parent("div").find(".range-price-table");
                        $(`#jsonInvoiceLineList .${headerId} #price`).attr("data-parsley-range", `[${data.minPrice},${data.maxPrice}]`);
                        if (exist.length > 0)
                            exist.remove();
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${transformNumbers.toComma(data.minPrice)} - ${transformNumbers.toComma(data.maxPrice)} </div></div>`;

                        if (headerId == "ins-row") {
                            $(`#jsonInvoiceLineList .${headerId} #price`).parents("th").append(priceRangeControl);
                            $("#price").parents("th").css("position", "relative");
                        }
                        else {
                            $(`#jsonInvoiceLineList .${headerId} #price`).parent("div").append(priceRangeControl);
                            $("#price").parent("div").css("position", "relative");
                        }

                        $("#price").removeAttr("disabled");

                        $("#price").attr("onfocus", "showFocusRangeControl(this,'jsonInvoiceLineList')");
                    }
                    else {
                        if (headerId == "ins-row")
                            $(`#jsonInvoiceLineList .${headerId} #price`).parents("th").find(".range-price-table").addClass("displaynone");
                        else
                            $(`#jsonInvoiceLineList .${headerId} #price`).parent("div").find(".range-price-table").addClass("displaynone");

                        $(`#jsonInvoiceLineList .${headerId} #price`).removeAttr("data-parsley-range");


                        $("#price").val(transformNumbers.toComma(data.minPrice));
                        $("#price").attr("disabled", "disabled");
                    }
                }
                else {
                    var msg = alertify.error(data.statusMsg);
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

function run_button_allocatePersonOrder() {
    personOrderList();
}