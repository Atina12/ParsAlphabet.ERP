
var viewData_form_title = `${$("#vendorId").val()} - ${$("#vendorFullName").val()}`,

    viewData_controllername = "VendorItemPriceLineApi",
    viewData_getPageTableDiAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpagediassign`,
    viewData_getPageTableAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpageassign`,
    viewData_filterItemDiAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilterdiassign`,
    viewData_filterItemAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilterassign`,
    viewData_assign_api_url = `${viewData_baseUrl_MC}/${viewData_controllername}/save`;
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csvassign`;

$("#priceTypeId").on("change", function () {
    let priceTypeId = +$(this).val()

    if (priceTypeId == 2) {
        $("#commisionValue").val("").prop("maxLength", "11")
        $("#commisionValueLabel").text("نرخ")
    }
    else {
        $("#commisionValue").val("").prop("maxLength", "3")
        $("#commisionValueLabel").text("درصد")
    }
})

function initVendorItemPriceLine() {

    fill_select2(`api/GNApi/pricetypegetdropdown`, "priceTypeId", true);

    $("#form_keyvalue").addClass("d-none");

    $("#head-title").append(`<span class="float-right">تخصیص حق الزحمهتامین کنندگان درمان</span>`);

    $("#priceTypeId").val(1).trigger("change")

    bind_model();
}

function assign_ins() {
    
    let commisionValue = $("#commisionValue").val()
    let priceTypeId = +$("#priceTypeId").val()
    let contractTypeId = +$("#contractTypeId").val()
    let vendorId = +$("#vendorId").val()

    if (commisionValue == 0) {
        var msgItem = alertify.warning("مقدار نرخ یا درصد را وارد کنید");
        msgItem.delay(alertify_delay);
        $("#commisionValue").focus()
        return
    } else if (priceTypeId == 2) {
        commisionValue = +removeSep(commisionValue)
    }
    else {
        commisionValue = +removeSep(commisionValue)
        if (commisionValue > 100) {
            var msgItem = alertify.warning("مقدار درصد نمی تواند بیشتر از 100 باشد");
            msgItem.delay(alertify_delay);
            $("#commisionValue").focus()
            return
        }
    }


    modelAssing = {
        vendorId,
        opr: "Ins",
        contractTypeId,
        priceTypeId,
        commisionValue
    }

    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)

    $("#contractTypeId").val(2).trigger("change")
    $("#priceTypeId").val(1).trigger("change")

}

function assign_del() {

    modelAssing = {
        vendorId: +$("#vendorId").val(),
        opr: "Del",
    }

    ins_del_assign(viewData_assign_api_url, "Del", modelAssing, delete_assign_validate)
}

function backToList() {
    navigation_item_click('/MC/VendorItemPrice', 'حق  حق الزحمه طبابین')
}


function export_csv(elemId = undefined, value = undefined) {
    var check = controller_check_authorize("VendorItems", "PRN");
    if (!check)
        return;

    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
        let vendorId = +$("#vendorId").val()
        var csvModel = {
            FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
            FieldValue: arr_pagetables2[index].filtervalue,
            Form_KeyValue: [vendorId]
        }

        

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
}


function insert_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

function delete_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

function bind_model() {

    var modelBind2 = {
        arrFormkeyValue: [+$("#vendorId").val()],
        url1_Pagetable: viewData_getPageTableDiAssign_url,
        url2_Pagetable: viewData_getPageTableAssign_url,
        url_Filter1: viewData_filterItemDiAssign_url,
        url_Filter2: viewData_filterItemAssign_url,
        pageTableId1: "pagetable1",
        pageTableId2: "pagetable2"
    };

    bind_formPlate2(modelBind2);
}

initVendorItemPriceLine()
