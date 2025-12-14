var viewData_allocate_Order = `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getpersonorderlist`,
    viewData_allocate_OrderLine = `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/getpersonorderline`,
    viewData_allocate_Ins = `${viewData_baseUrl_PU}/PurchaseInvoiceLineApi/allocatepersonorderline`,
    emptyRow = fillEmptyRow(10),
    arrPersonHeader = [], arrPersonHeaderLine = [];

function personOrderList() {

    if ($("#officialInvoice").prop("checked")) {
        if (+$("#personId").val() === 0) {
            var msg_i = alertify.warning("ذینفع را مشخص نمایید");
            msg_i.delay(alertify_delay);
            return;
        }
    }


    var order_model = {
        branchId: +$("#branchId").val(),
        currencyId: +$("#currencyId").val(),
        orderTypeId: +$("#invoiceTypeId").val() === 45 ? 3 : 4,
        personGroupTypeId: +$("#personTypeId").val(),
        personId: +$("#personId").val(),
        officialInvoice: $("#officialInvoice").prop("checked")
    };

    $.ajax({
        url: viewData_allocate_Order,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(order_model),
        success: function (result) {

            $("#tempPersonOrder").html("");

            if (result.data.length > 0) {
                var output = "";

                var len = result.data.length;

                for (var i = 0; i < len; i++) {

                    var item = result.data[i];

                    output = `<tr id="hdr_${i}" onkeydown="allocateHeaderKeyDown(${i},event,${item.id},${item.orderTypeId},${branchId})">
                                    <td><input onchange="selectHeaderRow(${item.id},${item.orderTypeId},${item.branchId},this,event)" type="checkbox" /></td>
                                    <td>${i + 1}</td>
                                    <td>${item.id}</td>
                                    <td>${item.orderDatePersian}</td>
                                    <td>${item.branchId !== 0 ? `${item.branchId} - ${item.branchName}` : ``}</td>
                                    <td>${item.currencyId !== 0 ? `${item.currencyId} - ${item.currencyName}` : ``}</td>
                                    <td>${item.employeeId !== 0 ? `${item.employeeId} - ${item.employeeName}` : ``}</td>
                                    <td>${item.userId !== 0 ? `${item.userId} - ${item.userFullName}` : ``}</td>
                                    <td>${item.createDatePersian}</td>
                                    <td>${item.sumAmount}</td>
                                    <td>${item.statusName}</td>
                               </tr>`;

                    $(output).appendTo("#tempPersonOrder");
                }
                modal_show("allocatePersonOrderListModal");
            }
            else {
                var msg_p = alertify.error(msg_nothing_found);
                msg_p.delay(admission.delay);
                $("#tempPersonOrder").html(emptyRow);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_allocate_Order);
        }
    });
}

function personorderLineList() {

    if (arrPersonHeader.length === 0) {
        var msg_i = alertify.warning("حداقل یک سفارش را انتخاب نمایید");
        msg_i.delay(alertify_delay);
        return;
    }

    var modelHeaderLine = {
        getPersonOrderLines: arrPersonHeader
    }

    $.ajax({
        url: viewData_allocate_OrderLine,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelHeaderLine),
        success: function (result) {

            $("#tempPersonOrderLine").html("");

            if (result.data.length > 0) {
                var output = "";

                var lenLine = result.data.length;

                for (var l = 0; l < lenLine; l++) {

                    var item = result.data[l];

                    output = `<tr id="hdr_${l}" onkeydown="allocateHeaderKeyDown(${l},event,${item.id},${item.orderTypeId},${branchId})">
                                    <td><input onchange="selectHeaderLineRow(${item.headerId},${item.orderTypeId},${item.branchId},${item.itemTypeId},${item.itmId},this,event)" type="checkbox" /></td>
                                    <td>${item.rowNumber}</td>
                                    <td>${item.itemTypeId !== 0 ? `${item.itemTypeId} - ${item.itemTypeName}` : ``}</td>
                                    <td>${item.itmId !== 0 ? item.itmName : ""}</td>
                                    <td>${item.quantityToOrder}</td>
                                    <td>${item.quantityOrdered}</td>
                                    <td>${item.quantityBalance}</td>
                               </tr>`;

                    $(output).appendTo("#tempPersonOrderLine");
                }
            }
            else {
                var msg_p = alertify.error(msg_nothing_found);
                msg_p.delay(admission.delay);
                $("#tempPersonOrderLine").html(emptyRow);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_allocate_OrderLine);
        }
    });
}

function selectHeaderRow(id, orderTypeId, branchId, check, ev) {

    var indexArr = arrPersonHeader.findIndex(x => x.id === id && x.orderTypeId === orderTypeId && x.branchId === branchId);

    if ($(check).prop("checked")) {

        var model = {}

        if (indexArr === -1) {

            model = {
                id: id,
                orderTypeId: orderTypeId,
                branchId: branchId
            }

            arrPersonHeader.push(model);
        }
    }
    else {
        $("#checkAllOrder").prop("checked", false);
        arrPersonHeader.splice(indexArr, 1);
    }

    $("#checkAllOrder").prop("checked", getCheckAll("tempPersonOrder"));
}

function selectHeaderLineRow(id, orderTypeId, branchId, itemTypeId, itemId, check, event) {

    var indexArrLine = arrPersonHeader.findIndex(x => x.id === id && x.orderTypeId === orderTypeId && x.branchId === branchId && x.itemTypeId === itemTypeId && x.itemId === itemId);

    if ($(check).prop("checked")) {

        var model = {};

        if (indexArrLine === -1) {
            model = {
                id: id,
                orderTypeId: orderTypeId,
                branchId: branchId,
                itemTypeId: itemTypeId,
                itemId: itemId
            }
            arrPersonHeaderLine.push(model);
        }

        model = {};
    }
    else {
        $("#checkAllLine").prop("checked", false);
        arrPersonHeaderLine.splice(indexArrLine, 1);
    }

    $("#checkAllLine").prop("checked", getCheckAll("tempPersonOrderLine"));
}

function allocateToInvoice() {
    if (arrPersonHeaderLine.length === 0) {
        var msg_i = alertify.warning("حداقل یک آیتم را انتخاب نمایید");
        msg_i.delay(alertify_delay);
        return;
    }

    var allocateLineModel = {
        HeaderId: +$("#id").val(),
        AllocatePersonOrderLines: arrPersonHeaderLine
    }

    $.ajax({
        url: viewData_allocate_Ins,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(allocateLineModel),
        success: function (result) {
            if (result.successfull) {
                var msg_s = alertify.success(result.statusMessage);
                msg_s.delay(alertify_delay);

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

                modal_close("allocatePersonOrderListModal");

                $("#tempPersonOrder").html("");
                $("#tempPersonOrderLine").html("");
                arrPersonHeader = [];
                arrPersonHeaderLine = [];

                return;
            }
            else {
                var msg_s = alertify.warning(result.statusMessage);
                msg_s.delay(alertify_delay);
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_allocate_Ins);
        }
    });
}

function checkAllOrder() {
    var headerLen = $("#tempPersonOrder >tr").length;

    var isCheckAllOrder = $("#checkAllOrder").prop("checked");

    for (var h = 0; h < headerLen; h++) {
        var trHeader = $("#tempPersonOrder >tr")[h];
        $(trHeader).find("td:eq(0) > input:checkBox").prop("checked", isCheckAllOrder).trigger("change")
    }
}

function checkAllOrderLine() {
    var lineLen = $("#tempPersonOrderLine >tr").length;
    var isCheckAllLine = $("#checkAllLine").prop("checked");

    for (var l = 0; l < lineLen; l++) {
        var trLine = $("#tempPersonOrderLine >tr")[l];
        $(trLine).find("td:eq(0) > input:checkBox").prop("checked", isCheckAllLine).trigger("change")
    }
}

function getCheckAll(tableName) {

    var length = $(`#${tableName} >tr`).length;
    var count = 0;

    for (var r = 0; r < length; r++) {
        var row = $(`#${tableName} >tr`)[r];
        if ($(row).find("td:eq(0) > input:checkBox").prop("checked"))
            count++;
    }

    return count === length;
}

$("#allocatePersonOrderListModal").on("hidden.bs.modal", function () {

    $("#tempPersonOrder").html("");
    $("#tempPersonOrderLine").html("");
    arrPersonHeader = [];
    arrPersonHeaderLine = [];
});