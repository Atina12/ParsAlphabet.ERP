var viewData_controllername = "ServiceItemPricingApi";
var itemTypeIdOnModal = null
var itemIdOnModal = null
var insurerTypeIdOnModal = null
var displayModalLoadDropDown = false;
var itemTypeIdInUpdateModal = null;
var copyPriceDropdownAccess = false;
var viewData_sendcentral_url = `${viewData_baseUrl_MC}/${viewData_controllername}/sendcentralmedicalitemprice`;
var selectedRow = [];

var pgt_services = {
    pagetable_id: "services_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/ServiceApi/getpage`
}
arr_pagetables.push(pgt_services);

var pgt_item = {
    pagetable_id: "items_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_WH}/ItemApi/getpage`
}
arr_pagetables.push(pgt_item);

var pgt_servicePricing = {
    pagetable_id: "servicePricing_pagetable",
    editable: true,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    form_KeyValue: ["itempricing"],
    getpagetable_url: `${viewData_baseUrl_MC}/ServiceItemPricingApi/getpage`,
}
arr_pagetables.push(pgt_servicePricing);

var pgt_itemPricing = {
    pagetable_id: "itemPricing_pagetable",
    editable: true,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    form_KeyValue: ["itempricing"],
    getpagetable_url: `${viewData_baseUrl_MC}/ServiceItemPricingApi/getpage`,
}
arr_pagetables.push(pgt_itemPricing);
function initServiceItemPricing() {

    $("#itemPriceForm .select2").select2()
    $("#servicePricePriceForm .select2").select2()
    $("#priceTransferServiceAndItemForm .select2").select2()

    changeTabInbound(1, "services_pagetable", "services")

    addPriceOperation();
}

function addPriceOperation() {
    $(".button-items").prepend(`<button id="exportCSV" onclick="exportCsvServicesAndItem()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
    $(".button-items").prepend(`<button type="button" onclick="displayModalServicePriceAndItemPrice()" class="btn green_4 waves-effect"><i class="fa fa-edit"></i>به روزرسانی تعرفه کالا و خدمات</button>`)
    $(".button-items").prepend(`<button type="button" onclick="transformServicePriceAndItemprice()" class="btn blue_1 waves-effect"><i class="fa fa-edit"></i>انتقال قیمت کالا و خدمات</button>`)
}


function run_button_sendToCentral(id, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");
    pagetable_formkeyvalue = [0];

    if (index == -1) {
        var pgt = {
            pagetable_id: "sendtoCentral_pagetable",
            editable: true,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            getpagetable_url: `${viewData_baseUrl_MC}/ServiceItemPricingApi/medicalitempricesendhistorygetpage`,
            lastPageloaded: 0,
        }

        arr_pagetables.push(pgt);
    }
    else {
        arr_pagetables[index].filteritem = "";
        arr_pagetables[index].filtervalue = "";
        arr_pagetables[index].editable = true;
        arr_pagetables[index].pagerowscount = 15;
        arr_pagetables[index].endData = false;
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].currentcol = 0;
        arr_pagetables[index].highlightrowid = 0;
        arr_pagetables[index].trediting = false;
        arr_pagetables[index].pagetablefilter = false;
        arr_pagetables[index].lastPageloaded = 0;
    }


    $(".serviceCodeSendModal").text(id)
    $(".serviceNameSendModal").text($(`#services_pagetable #parentPageTableBody tbody tr[data-id=${id}]`).data("name"))
    $(".serviceTypeSendModal").text($(`#services_pagetable #parentPageTableBody tbody tr[data-id=${id}]`).data("servicetype"))

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");


    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []

    }

    pagetable_formkeyvalue[1] = id;
    pagetable_formkeyvalue[2] = 0;

    get_NewPageTableV1("sendtoCentral_pagetable", false, () => {
        modal_show("sendModal")
        setTimeout(() => {
            $("#sendtoCentral_pagetable  .pagetablebody tbody  #row1").focus()

            $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
                $(this).prop('checked', false);

            })

        }, 400)

    })


}


function sendMedicalPriceToCentral() {

    var ids = '';
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");
    selectedRow = arr_pagetables[index].selectedItems;

    if (selectedRow.length == 0) {
        alertify.warning("حداقل یک سطر را انتخاب کنید").delay(admission.delay);
        return
    }
    for (let i = 0; i < selectedRow.length; i++) {
        ids += (+selectedRow[i].id) + ",";
    }

    sendToCentral(ids);
}
function sendToCentral(ids) {


    $.ajax({
        url: viewData_sendcentral_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function (result) {

            if (result != null) {

                if (result.successfull == true) {
                    alertify.success(result.statusMessage);
                    modal_close("sendModal");
                    get_NewPageTableV1();
                }
                else {
                    if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                        let messages = generateErrorString(result.validationErrors);
                        alertify.error(messages).delay(alertify_delay);
                        return;
                    }
                    else {
                        alertify.error(result.statusMessage).delay(alertify_delay);

                    }
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendcentral_url);
        }
    });
}
function displayModalServicePriceAndItemPrice() {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    if (!displayModalLoadDropDown) {
        servicePriceAndItemLoadDropdown()
        displayModalLoadDropDown = true
    }

    resetServicePriceAndItemPriceForm()

    $("#servicePriceAndItemPriceForm > ul .active").click()

    modal_show('servicePriceAndItemPriceModal');
}

function servicePriceAndItemLoadDropdown() {

    var medicalSubjectIdITOption1 = new Option(`انتخاب کنید`, 0, true, true);
    var medicalSubjectIdPSOption2 = new Option(`انتخاب کنید`, 0, true, true);
    $("#medicalSubjectIdIT").append(medicalSubjectIdITOption1).trigger('change');
    $("#medicalSubjectIdPS").append(medicalSubjectIdPSOption2).trigger('change');

    fill_select2("/api/MC/ServiceTypeApi/getdropdown", "serviceTypeIdPS", true, 1);
    fill_select2(`/api/AdmissionsApi/medicalsubject_getdropdown`, "medicalSubjectIdPS", true);
    fill_select2(`/api/AdmissionsApi/medicalsubject_getdropdown`, "medicalSubjectIdIT", true);
    fill_select2(`/api/WH/ItemCategoryApi/getalldatadropdownbytype/0`, "itemCategoryIdIT", true);

}

function transformServicePriceAndItemprice() {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    if (!copyPriceDropdownAccess) {
        copyPriceModalLoadDropDown()
        copyPriceDropdownAccess = true
    }

    resetCopyPriceModal()

    modal_show("priceTransferServiceAndItemModal")

}

function copyPriceModalLoadDropDown() {
    fill_select2(`api/AdmissionsApi/medicalsubject_getdropdown`, "fromMedicalSubjectId", true, 0);
    fill_select2(`api/AdmissionsApi/medicalsubject_getdropdown`, "toMedicalSubjectId", true, 0)
}

function fillItemtype() {

    let serviceOrItem = +$("#serviceOrItem").val();
    let fromInsurerTypeId = +$("#fromInsurerTypeId").val();
    let fromMedicalSubjectId = +$("#fromMedicalSubjectId").val();
    $("#fromItemId").empty();
    if (serviceOrItem > 0 && fromInsurerTypeId > 0 && fromMedicalSubjectId > 0) {
        fill_select2(`/api/MC/ServiceItemPricingApi/getdropdown`, "fromItemId", true, `${serviceOrItem}/${fromInsurerTypeId}/${fromMedicalSubjectId}`, true);
    }
}



$("#serviceOrItem").on("change", function () {
    $("#fromItemId").empty();
    fillItemtype();
})

$("#fromInsurerTypeId").on("change", function () {
    $("#fromItemId").empty();
    fillItemtype();
})

$("#fromMedicalSubjectId").on("change", function () {
    let fromMedicalSubjectId = +$(this).val()

    if (fromMedicalSubjectId > 0)
        fillItemtype();
})
function resetCopyPriceModal() {

    $(`#priceTransferServiceAndItemForm select`).prop("selectedIndex", 0).prop("disabled", false).trigger("change");
    $(".price-details").text("-");
    $("#perviewTransformPriceCounter,#saveTransformPriceCounter,#deleteTransformPriceCounter").text(0);
    //$("#saveTransformPrice").prop("disabled", true);
    $("#perviewTransformServiceBox").prop("disabled", false)
    $("#enableFormCopy").prop("disabled", true)
    let form = $(`#priceTransferServiceAndItemForm`).parsley();
    form.reset();
    validateSelect2(form);
}

function saveCopyPrice(isPreview = false) {

    var operationType = $("#operationType").val();

    let form = $(`#priceTransferServiceAndItemForm`).parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;


    let model = {
        fromInsurerTypeId: +$("#fromInsurerTypeId").val(),
        toInsurerTypeId: +$("#toInsurerTypeId").val(),
        fromMedicalSubjectId: +$("#fromMedicalSubjectId").val(),
        toMedicalSubjectId: +$("#toMedicalSubjectId").val(),
        itemTypeId: +$("#serviceOrItem").val(),
        itemId: +$("#fromItemId").val() > 0 ? +$("#fromItemId").val() : null,
        operationType,
        isPreview,
    }

    let result = copyPriceServiceAndItem(model);


    if (isPreview) {

        if (result.successfull) {

            if (result.affectedRows == 0) {
                var msgResult = alertify.warning("خدمتی برای حذف یا به روزرسانی وجود ندارد");
                msgResult.delay(alertify_delay);
            }
            else {
                var msgResult = alertify.success(result.statusMessage);
                msgResult.delay(alertify_delay);

                $("#perviewTransformPriceCounter,#saveTransformPriceCounter,#deleteTransformPriceCounter").text(0);
                $("#perviewTransformPriceCounter").text(result.affectedRows);

                disableEnableFildCopy(true)

                $("#saveTransformPrice").prop("disabled", false);
                $("#deleteTransformPrice").prop("disabled", false);

                if (operationType == 1)
                    $("#saveTransformPriceLable").focus();
                else
                    $("#deleteTransformPriceLable").focus();
            }

        }
        else {

            switch (result.status) {
                case -100:
                    alertify.error(result.statusMessage).delay(7);

                    $("#perviewTransformPriceCounter").text(0);
                    $("#saveTransformPrice").removeAttr("disabled");
                    $("#deleteTransformPrice").removeAttr("disabled");

                    if (operationType == 1)
                        $("#saveTransformPriceLable").focus();
                    else
                        $("#deleteTransformPriceLable").focus();
                    break;

                case -104:
                    // generateErrorValidation(result.validationErrors);

                    let msg = generateErrorString(result.validationErrors);

                    if (msg !== "") {
                        var err = alertify.warning(msg);
                        err.delay(10);
                    }

                    $("#perviewTransformPriceCounter").text(0);
                    $("#saveTransformPrice").removeAttr("disabled");
                    $("#deleteTransformPrice").removeAttr("disabled");

                    if (operationType == 1)
                        $("#saveTransformPriceLable").focus();
                    else
                        $("#deleteTransformPriceLable").focus();
                    break;

                //var msgResult = alertify.error(result.statusMessage);
                //msgResult.delay(alertify_delay);

            }

        }


    }
    else {
        if (result.successfull) {

            var msgResult = alertify.success(result.statusMessage);
            msgResult.delay(alertify_delay);

            $("#perviewTransformPriceCounter,#saveTransformPriceCounter,#deleteTransformPriceCounter").text(0);

            $(`#priceTransferServiceAndItemForm select:not(#operationType)`).prop("selectedIndex", 0).trigger("change");

            if (operationType == 1) {
                $("#saveTransformPriceCounter").text(result.affectedRows);
                $("#deleteTransformPriceCounter").text(0);
            }
            else {
                $("#saveTransformPriceCounter").text(0);
                $("#deleteTransformPriceCounter").text(result.affectedRows);
            }

            $("#saveTransformPrice").prop("disabled", true);
            $("#deleteTransformPrice").prop("disabled", true);
        }
        else {
            switch (result.status) {
                case -100:
                case -101:
                case -103:
                    alertify.error(result.statusMessage).delay(7);
                    $(`#priceTransferServiceAndItemForm select:not(#operationType)`).prop("selectedIndex", 0).trigger("change");

                    $("#saveTransformPriceCounter").text(0);
                    $("#saveTransformPrice").removeAttr("disabled");

                    $("#deleteTransformPriceCounter").text(0);
                    $("#deleteTransformPrice").removeAttr("disabled");
                    break;

                case -102:
                    generateErrorValidation(result.validationErrors);
                    $(`#priceTransferServiceAndItemForm select:not(#operationType)`).prop("selectedIndex", 0).trigger("change");

                    $("#saveTransformPriceCounter").text(0);
                    $("#saveTransformPrice").removeAttr("disabled");

                    $("#deleteTransformPriceCounter").text(0);
                    $("#deleteTransformPrice").removeAttr("disabled");
                    break;

                //var msgResult = alertify.error(result.statusMessage);
                //msgResult.delay(alertify_delay);
            }

        }

        disableEnableFildCopy(false);
    }
}

function copyPriceServiceAndItem(model) {

    let viewData_save_duplicate_url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/medicalitempriceduplicate`;

    let output = $.ajax({
        url: viewData_save_duplicate_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_save_duplicate_url)
            return 0;
        }
    });
    return output.responseJSON;
}

function disableEnableFildCopy(type) {

    $("#operationType").prop("disabled", type);
    $("#fromItemId").prop("disabled", type);
    $("#serviceOrItem").prop("disabled", type);
    $("#fromInsurerTypeId").prop("disabled", type);
    $("#toInsurerTypeId").prop("disabled", type);
    $("#fromMedicalSubjectId").prop("disabled", type);
    $("#toMedicalSubjectId").prop("disabled", type);
    $("#enableFormCopy").prop("disabled", !type);
    $("#previewTransformPrice").prop("disabled", type)
    $("#saveTransformPrice").prop("disabled", !type)
    $("#deleteTransformPrice").prop("disabled", !type)
}

function changeTabUpdateServiceItem(tabNo, itemTypeId = null) {

    itemTypeIdInUpdateModal = itemTypeId

    resetServicePriceAndItemPriceForm()

    setTimeout(() => {
        itemTypeIdInUpdateModal == 2 ? $("#medicalSubjectIdPS").select2("focus") : $("#medicalSubjectIdIT").select2("focus")
    }, 100)

}

function resetServicePriceAndItemPriceForm() {

    $("#affectedRowsServiceAndItem").text("0");
    $("#perviewServicePriceAndItemPriceCounter").text("0")
    $("#fromNationalCode").val("");
    $("#toNationalCode").val("");
    $("#priceProfessionalCodePS").val("");
    $("#priceTechnicalCodePS").val("");
    $("#priceAnesthesiaBasePS").val("");
    $("#attributePS").val("0").trigger("change");
    $("#serviceTypeIdPS").val("0").trigger("change");
    $("#fromServiceIdPS").val("");
    $("#toServiceIdPS").val("");
    $("#beginPriceIT").val("");
    $("#endPriceIT").val("");
    $("#priceTypeIT").val("0").trigger("change");
    $("#fromItemIdIT").val("");
    $("#toItemIdIT").val("");

    $(".modal-dialog").css({ "top": "unset", "left": "unset" });
    $("#saveServicePriceAndItemPrice").prop("disabled", true);
    $("#enableFormPSAndIt").prop("disabled", true);
    disableEnableFildPSOrIt(false);
    $("#servicePricePriceForm .select2").prop("selectedIndex", "0").trigger("change");
    $("#itemPriceForm .select2").prop("selectedIndex", "0").trigger("change");
    $("#hasNationalCodePS").val(0).trigger("change");
    $("#servicePriceAndItemPriceForm input.form-control").val("");

}

function servicePriceAndItemPriceTempSave(isPreview, serviceOrItem) {

    let resultSave = ""
    let serviceOrItemModel = ""
    let url = ""

    $("#affectedRowsServiceAndItem").val("0")


    if (serviceOrItem == 2) {

        url = `${viewData_baseUrl_MC}/${viewData_controllername}/updateserviceprice`

        serviceOrItemModel = {
            serviceTypeId: +$("#serviceTypeIdPS").val() == "0" ? null : $("#serviceTypeIdPS").val(),
            medicalSubjectId: +$("#medicalSubjectIdPS").val() == "0" ? null : toNumber($("#medicalSubjectIdPS").val()),
            insurerTypeId: +$("#insurerTypeIdPS").val() == "0" ? null : +$("#insurerTypeIdPS").val(),
            attribute: +$("#attributePS").val() == "0" ? null : $("#attributePS").val(),
            professionalPrice: +removeSep($("#priceProfessionalCodePS").val()) == "0" ? null : +removeSep($("#priceProfessionalCodePS").val()),
            technicalPrice: +removeSep($("#priceTechnicalCodePS").val()) == "0" ? null : +removeSep($("#priceTechnicalCodePS").val()),
            anesthesiaPrice: +removeSep($("#priceAnesthesiaBasePS").val()) == "0" ? null : +removeSep($("#priceAnesthesiaBasePS").val()),
            compPrice: +removeSep($("#compPricePS").val()) == "0" ? null : +removeSep($("#compPricePS").val()),
            fromNationalCode: +$("#fromNationalCode").val() == "0" ? null : +$("#fromNationalCode").val(),
            toNationalCode: +$("#toNationalCode").val() == "0" ? null : +$("#toNationalCode").val(),
            fromServiceId: +$("#fromServiceIdPS").val() == "0" ? null : +$("#fromServiceIdPS").val(),
            toServiceId: +$("#toServiceIdPS").val() == "0" ? null : +$("#toServiceIdPS").val(),
            hasNationalCode: +$("#hasNationalCodePS").val() == 0 ? true : false,
            isPreview: isPreview,
            includeAll: false,
        }
    }
    else {

        url = `${viewData_baseUrl_MC}/${viewData_controllername}/updateitemprice`;

        serviceOrItemModel = {
            fromItemId: +$("#fromItemIdIT").val() == "" || +$("#fromItemIdIT").val() == "0" ? null : +$("#fromItemIdIT").val(),
            toItemId: +$("#toItemIdIT").val() == "" || +$("#toItemIdIT").val() == "0" ? null : +$("#toItemIdIT").val(),
            medicalSubjectId: +$("#medicalSubjectIdIT").val() == "0" ? null : +$("#medicalSubjectIdIT").val(),
            insurerTypeId: +$("#insurerTypeIdIT").val() == "0" ? null : +$("#insurerTypeIdIT").val(),
            itemCategoryId: +$("#itemCategoryIdIT").val() == "0" ? null : +$("#itemCategoryIdIT").val(),
            pricingModelId: +$("#priceTypeIT").val() == "0" ? null : $("#priceTypeIT").val(),
            beginPrice: +removeSep($("#beginPriceIT").val()) == "0" ? null : +removeSep($("#beginPriceIT").val()),
            endPrice: +removeSep($("#endPriceIT").val()) == "0" ? null : +removeSep($("#endPriceIT").val()),
            isPreview: isPreview,
            includeAll: false,
        }


        if (serviceOrItemModel.pricingModelId == 1) {

            if (serviceOrItemModel.beginPrice == "") {
                var msg = alertify.warning("تعرفه اول نمی تواند خالی بماند");
                msg.delay(alertify_delay);
                return;
            }

            if (serviceOrItemModel.beginPrice == 0) {
                var msg = alertify.warning("تعرفه اول نمی تواند صفر باشد");
                msg.delay(alertify_delay);
                return;
            }

            serviceOrItemModel.endPrice = 0

        }
        else if (serviceOrItemModel.pricingModelId == 2) {

            if (serviceOrItemModel.beginPrice == 0) {
                var msg = alertify.warning("تعرفه اول نمی تواند خالی بماند.");
                msg.delay(alertify_delay);
                return;
            }

            if (serviceOrItemModel.endPrice == 0) {
                var msg = alertify.warning("تعرفه دوم باید بزرگتر از صفر باشد");
                msg.delay(alertify_delay);
                return;
            }

            if (serviceOrItemModel.beginPrice >= serviceOrItemModel.endPrice) {
                var msg = alertify.warning("تعرفه دوم باید بزرگتر از تعرفه اول باشد.");
                msg.delay(alertify_delay);
                return;
            }

        }
    }

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(serviceOrItemModel),
        success: function (result) {
            resultSave = result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    return resultSave;
}

function enableForm(elm, typeFrom, saveButton) {
    $("#perviewTransformPriceCounter").text(0);
    $("#perviewServicePriceAndItemPriceCounter").text(0);

    if (typeFrom == 'copy')
        disableEnableFildCopy(false);
    else if (typeFrom == 'ps')
        disableEnableFildPSOrIt(false)

    $(saveButton).prop("disabled", true);
    $(elm).prop("disabled", true);
}

function disableEnableFildPSOrIt(type) {

    $("#medicalSubjectIdPS").prop("disabled", type);
    $("#insurerTypeIdPS").prop("disabled", type);
    $("#insurerIdPS").prop("disabled", type);
    $("#hasNationalCodePS").prop("disabled", type);
    $("#serviceTypeIdPS").prop("disabled", type);
    $("#attributePS").prop("disabled", type);
    $("#fromServiceIdPS").prop("disabled", type);
    $("#toServiceIdPS").prop("disabled", type);
    $("#fromNationalCode").prop("disabled", type);
    $("#toNationalCode").prop("disabled", type);
    $("#priceProfessionalCodePS").prop("disabled", type);
    $("#priceTechnicalCodePS").prop("disabled", type);
    $("#priceAnesthesiaBasePS").prop("disabled", type);
    $("#compPricePS").prop("disabled", type);
    $("#perviewServicePriceAndItemPrice").prop("disabled", type);


    $("#insurerTypeIdIT").prop("disabled", type);
    $("#medicalSubjectIdIT").prop("disabled", type);
    $("#itemCategoryIdIT").prop("disabled", type);
    $("#fromItemIdIT").prop("disabled", type);
    $("#toItemIdIT").prop("disabled", type);
    $("#priceTypeIT").prop("disabled", type);

    if ($("#priceTypeIT").val() == 1) {
        if (type == true) {
            $('#endPriceIT').attr("disabled", type)
            $('#endPriceIT').attr("required", !type)
        }
    }
    else {
        $('#endPriceIT').attr("disabled", type)
        $('#endPriceIT').attr("required", !type)
    }
    $("#beginPriceIT").prop("disabled", type);
    $("#perviewItemPrice").prop("disabled", type);

}

function changeTabInbound(tabNo, page_name) {
    $(`#${page_name} .btnRemoveFilter`).addClass("d-none");
    $(`#${page_name} .btnOpenFilter`).removeClass("d-none");

    if (tabNo == 1) {
        itemTypeIdOnModal = 2
        pagetable_formkeyvalue = ["itempricing"];
        get_NewPageTableV1(page_name)
    }
    else {
        itemTypeIdOnModal = 1
        pagetable_formkeyvalue = ["itempricing", 1];
        get_NewPageTableV1(page_name)
    }
}

function run_button_basicPricing(id, row, elm, event) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    insurerTypeIdOnModal = 1
    itemTypeIdOnModal == 2 ? run_button_basicPricing_service(id, row, elm, event, "تعرفه پایه") : run_button_basicPricing_item(id, row, elm, event, "تعرفه پایه")
}

function run_button_compPricing(id, row, elm, event) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    insurerTypeIdOnModal = 2
    itemTypeIdOnModal == 2 ? run_button_basicPricing_service(id, row, elm, event, "تعرفه تکمیلی") : run_button_basicPricing_item(id, row, elm, event, "تعرفه تکمیلی")
}

function run_button_thirdpartyPricing(id, row, elm, event) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    insurerTypeIdOnModal = 4
    itemTypeIdOnModal == 2 ? run_button_basicPricing_service(id, row, elm, event, "تعرفه طرف قرارداد") : run_button_basicPricing_item(id, row, elm, event, "تعرفه طرف قرارداد")
}

function run_button_discountPricing(id, row, elm, event) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    insurerTypeIdOnModal = 5
    itemTypeIdOnModal == 2 ? run_button_basicPricing_service(id, row, elm, event, "تعرفه تخفیف") : run_button_basicPricing_item(id, row, elm, event, "تعرفه تخفیف")
}

function run_button_basicPricing_service(serviceId, row, elm, event, type) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    let pagetable_id = "servicePricing_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    pagetable_formkeyvalue = [0];

    arr_pagetables[index].editable = false;
    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].endData = false;
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].pagetablefilter = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";
    arr_pagetables[index].lastPageloaded = 0;



    itemIdOnModal = serviceId
    $(".serviceTypeOfpricing").text(type)
    $(".serviceCodeModal").text(serviceId)
    $(".serviceNameModal").text($(`#services_pagetable #parentPageTableBody tbody tr[data-id=${serviceId}]`).data("name"))
    $(".serviceTypeModal").text($(`#services_pagetable #parentPageTableBody tbody tr[data-id=${serviceId}]`).data("servicetype"))

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

    get_NewPageTableV1(pagetable_id, false, () => callbackAfterFilterV1(pagetable_id, true))

}

function run_button_basicPricing_item(itemId, row, elm, event, type) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    let pagetable_id = "itemPricing_pagetable";
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    pagetable_formkeyvalue = [0];

    arr_pagetables[index].editable = false;
    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].endData = false;
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].pagetablefilter = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";
    arr_pagetables[index].lastPageloaded = 0;


    itemIdOnModal = itemId
    $(".itemTypeOfpricing").text(type)
    $(".itemIdModal").text(itemId)
    $(".itemNameModal").text($(`#items_pagetable #parentPageTableBody tbody tr[data-id=${itemId}]`).data("name"))
    $(".itemUnitModal").text($(`#items_pagetable #parentPageTableBody tbody tr[data-id=${itemId}]`).data("unit"))
    $(".itemCategoryModal").text($(`#items_pagetable #parentPageTableBody tbody tr[data-id=${itemId}]`).data("category"))

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

    get_NewPageTableV1(pagetable_id, false, () => callbackAfterFilterV1(pagetable_id, true))
}

function callbackAfterFilterV1(pg_id, firstRun = false) {
    if (firstRun)
        if (pg_id == "servicePricing_pagetable")
            modal_show("servicePricingModal")
        else if (pg_id == "itemPricing_pagetable")
            modal_show("itemPricingModal")
}

function get_NewPageTableV1(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null)
        pg_id = "pagetable";

    activePageTableId = pg_id;


    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pg_id);
    let filterItemsModel = []
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;

        if (filterIndex == -1) {
            arrSearchFilter.push({
                pagetable_id: pg_id,
                filters: []
            })
            arrSearchFilterSelect2ajax.push({
                pagetable_id: pg_id,
                filters: []
            })
        }
    }


    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage;

    let pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue;



    let pageViewModel = {}

    if (pg_id == "servicePricing_pagetable" || pg_id == "itemPricing_pagetable") {

        pageViewModel = {
            pageno: pagetable_pageNo,
            pagerowscount: pagetable_pagerowscount,
            form_KeyValue: [0],
            filters: [],
            sortModel: {
                colId: dataOrder.colId,
                sort: dataOrder.sort
            },
            itemId: itemIdOnModal,
            itemTypeId: itemTypeIdOnModal,
            insurerTypeId: insurerTypeIdOnModal,
            insurerId: null,
            medicalSubjectId: null,
            includeAll: true
        }

    }
    else {
        pageViewModel = {
            pageno: pagetable_pageNo,
            pagerowscount: pagetable_pagerowscount,
            fieldItem: pagetable_filteritem,
            fieldValue: pagetable_filtervalue,
            form_KeyValue: [0],
            filters: [],
            sortModel: {
                colId: dataOrder.colId,
                sort: dataOrder.sort
            }
        }
    }

    if (pg_id == "items_pagetable") {

        let newfilterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pg_id);
        let newFilterArrForItems = arrSearchFilter[newfilterIndex].filters.findIndex(item => item.name == "itemType")

        if (newFilterArrForItems == -1) {
            arrSearchFilter[newfilterIndex].filters.push({
                name: "itemType",
                value: 1
            })
        }
        else {
            arrSearchFilter[newfilterIndex].filters[newFilterArrForItems] = {
                name: "itemType",
                value: 1
            }
        }
    }

    filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pg_id);

    if (arrSearchFilter[filterIndex].filters.length != 0)
        for (let i = 0; i < arrSearchFilter[filterIndex].filters.length; i++) {
            filterItemsModel[i] = {
                name: arrSearchFilter[filterIndex].filters[i].name,
                value: arrSearchFilter[filterIndex].filters[i].value,
            }
        }


    pageViewModel.filters = checkResponse(filterItemsModel) ? (filterItemsModel.length == 0 ? [] : filterItemsModel) : [];
    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            if (pagetable_currentpage == 1)
                fillOptionV1(result, pg_id);

            fill_NewPageTableV1(result, pg_id, callBack);

            if (typeof callBack != "undefined")
                callBack(result);

            refreshBackPageTableV1(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function tr_object_onchange(pg_name, selectObject, rowno, colno) {

    if (pg_name == "servicePricing_pagetable") { }
    else if (pg_name == "itemPricing_pagetable") {

        let currentElm = $(selectObject)
        let pricingModelId = ""
        let beginPrice = ""
        let endPrice = ""


        if (insurerTypeIdOnModal == 1) {
            pricingModelId = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_3 > input`);
            beginPrice = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_4 > input`);
            endPrice = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_5 > input`);

            if (currentElm.attr("id") == `pricingModelId_${rowno}`) {

                if (selectObject.localName == "select") {
                    if ($(selectObject).val() == "1") {
                        beginPrice.val("").removeAttr("readonly")
                        endPrice.val("").attr("readonly", "readonly");

                    }
                    else if ($(selectObject).val() == "2") {
                        beginPrice.val("").removeAttr("readonly");
                        endPrice.val("").removeAttr("readonly");

                    }
                    else {
                        beginPrice.val("").attr("readonly", "readonly");
                        endPrice.val("").attr("readonly", "readonly")

                    }
                }
            }
        }
        else {

        }

    }

}

function tr_object_onblur(pg_name, selectObject, rowno, colno) {

    if (pg_name == "servicePricing_pagetable") {

    }
    else if (pg_name == "itemPricing_pagetable") {

        let currentElm = $(selectObject)
        let pricingModelId = ""
        let beginPrice = ""
        let endPrice = ""


        if (insurerTypeIdOnModal == 1) {
            pricingModelId = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_3 > input`);
            beginPrice = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_4 > input`);
            endPrice = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_5 > input`);

            if (currentElm.attr("id") == `pricingModelId_${rowno}`) {

                if (selectObject.localName == "select") {
                    if ($(selectObject).val() == "1") {
                        beginPrice.removeAttr("readonly")
                        endPrice.attr("readonly", "readonly");
                    }
                    else if ($(selectObject).val() == "2") {
                        beginPrice.removeAttr("readonly");
                        endPrice.removeAttr("readonly");
                    }
                    else {
                        beginPrice.attr("readonly", "readonly");
                        endPrice.attr("readonly", "readonly")
                    }
                }
            }
        }
        else {
        }
    }

}

function tr_save_row(pg_name, keycode) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;
    let id = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("medicalitempriceid")
    let medicalSubjectId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("medicalsubjectid")
    //let insurerId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerid")


    if (pagetable_id == "servicePricing_pagetable") {
        let itemId = +$(".serviceCodeModal").text()
        let beginPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > input`).val();
        let servicePricing_model = {
            id,
            itemId,
            itemTypeId: itemTypeIdOnModal,
            insurerTypeId: insurerTypeIdOnModal,
            medicalSubjectId,
            pricingModelId: 1,
            beginPrice: +removeSep(beginPrice),
            endPrice: 0,
            isActive: true,
        }

        //insert
        if (id == 0) {
            if (servicePricing_model.beginPrice == 0) {
                after_save_row(pagetable_id, "success", keycode, false);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > input`).val("");
                return
            }
            saveItemPricing(pagetable_id, servicePricing_model, pagetable_currentrow, keycode)
        }
        //insert update delete
        else {
            if (servicePricing_model.beginPrice == 0)
                deleteItemPricing(pagetable_id, servicePricing_model.id, pagetable_currentrow, keycode)
            else
                saveItemPricing(pagetable_id, servicePricing_model, pagetable_currentrow, keycode)
        }
    }
    else if (pagetable_id == "itemPricing_pagetable") {

        let itemId = +$(".itemIdModal").text()
        let pricingModelId = 0
        let beginPrice = "0"
        let endPrice = "0"

        if (insurerTypeIdOnModal == 1) {
            pricingModelId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > select`).val();
            beginPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).val();
            endPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).val();
        }
        else {
            beginPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > input`).val();
        }


        var itemPricing_model = {
            id,
            itemId,
            itemTypeId: itemTypeIdOnModal,
            insurerTypeId: insurerTypeIdOnModal,
            medicalSubjectId,
            pricingModelId,
            beginPrice: +removeSep(beginPrice),
            endPrice: +removeSep(endPrice),
            isActive: true,

        }

        if (+itemPricing_model.insurerTypeId == 1) {
            if (+itemPricing_model.pricingModelId == 1) {

                if (itemPricing_model.beginPrice == 0) {
                    var msg = alertify.warning("تعرفه اول نمی تواند خالی بماند");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).focus();
                    return;
                }

                if (itemPricing_model.beginPrice == 0) {
                    var msg = alertify.warning("تعرفه اول نمی تواند صفر باشد");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).focus();
                    return;
                }


                itemPricing_model.endPrice = 0
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).val("");

                saveItemPricing(pagetable_id, itemPricing_model, pagetable_currentrow, keycode)
            }
            else if (+itemPricing_model.pricingModelId == 2) {

                if (itemPricing_model.beginPrice == 0) {
                    var msg = alertify.warning("تعرفه اول نمی تواند خالی بماند.");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).focus();
                    return;
                }

                if (itemPricing_model.endPrice == 0) {
                    var msg = alertify.warning("تعرفه دوم باید بزرگتر از صفر باشد");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).focus();
                    return;
                }

                if (itemPricing_model.beginPrice >= itemPricing_model.endPrice) {
                    var msg = alertify.warning("تعرفه دوم باید بزرگتر از تعرفه اول باشد.");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).focus();
                    return;
                }

                saveItemPricing(pagetable_id, itemPricing_model, pagetable_currentrow, keycode)
            }
            else {

                if (itemPricing_model.id == 0)
                    after_save_row(pagetable_id, "success", keycode, false);
                else
                    deleteItemPricing(pagetable_id, itemPricing_model.id, pagetable_currentrow, keycode)
            }
        }
        else {

            itemPricing_model.pricingModelId = 1
            itemPricing_model.endPrice = 0

            if (itemPricing_model.beginPrice == 0) {

                if (itemPricing_model.id == 0)
                    after_save_row(pagetable_id, "success", keycode, false);
                else
                    deleteItemPricing(pagetable_id, itemPricing_model.id, pagetable_currentrow, keycode)
            }
            else {
                saveItemPricing(pagetable_id, itemPricing_model, pagetable_currentrow, keycode)
            }

        }
    }
}

function saveItemPricing(pagetable_id, model, pagetable_currentrow, keycode) {

    let viewData_save_url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/save`;
    
    $.ajax({
        url: viewData_save_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            
            if (result.successfull) {
                
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("medicalitempriceid", +result.id)

                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                getrecord(pagetable_id);
                after_save_row(pagetable_id, "success", keycode, false);
            }
            else {
                
                if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                }
                else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                }
                if (result.status == -100) {
                    getrecord(pagetable_id);
                    after_save_row(pagetable_id, "cancel", keycode, false);
                }
                else {
                    getrecord(pagetable_id);
                    after_save_row(pagetable_id, "success", keycode, false);
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_url);
            after_save_row(pagetable_id, "cancel", keycode, false);
        }
    });
}

function deleteItemPricing(pagetable_id, id, pagetable_currentrow, keycode) {

    let viewData_delete_url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/delete`;

    $.ajax({
        url: viewData_delete_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: async function (result) {

            if (result.successfull) {

                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("medicalitempriceid", +result.id)

                var msg = alertify.success(result.statusMessage)
                msg.delay(alertify_delay)

                setDefaultRowOnModal(pagetable_id, pagetable_currentrow)
                after_save_row(pagetable_id, "success", keycode, false);
            }
            else {
                if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }

                await getrecord(pagetable_id);
                after_save_row(pagetable_id, "cancel", keycode, false);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_delete_url);
            //await getrecord(pagetable_id)
            after_save_row(pagetable_id, "cancel", keycode, false);
        }
    });
}

function getrecord(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    let id = +$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow}`).data("medicalitempriceid")

    if (pagetable_id == "servicePricing_pagetable" || pagetable_id == "itemPricing_pagetable") {

        if (id == 0)
            setDefaultRowOnModal(pagetable_id, currentrow)
        else
            getrecordAjax(pagetable_id, currentrow, id)

    }
}

function getrecordAjax(pagetable_id, currentrow, id) {

    let url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/getrecordbyid`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            getrecord_setValue(result, pagetable_id, currentrow)
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

function getrecord_setValue(result, pagetable_id, currentrow) {

    if (pagetable_id == "servicePricing_pagetable") {
        if (result != null) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.id);
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val(checkResponse(result.beginPrice) ? transformNumbers.toComma(result.beginPrice) : "");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4`).text(`${result.createUserId} - ${result.createUserFullName}`);
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5`)
                .html(`${result.createDateTimePersian.split(" ")[0]}<p class="mb-0 mt-neg-5">${result.createDateTimePersian.split(" ")[1]}</p>`);
        }
        else
            setDefaultRowOnModal(pagetable_id, currentrow)
    }
    else {
        if (result != null) {

            if (insurerTypeIdOnModal == 1) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.id);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > select`).val(result.pricingModelId).trigger("change");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val(checkResponse(result.beginPrice) ? transformNumbers.toComma(result.beginPrice) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val(checkResponse(result.endPrice) && result.endPrice != 0 ? transformNumbers.toComma(result.endPrice) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6`).text(`${result.createUserId} - ${result.createUserFullName}`);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_7`)
                    .html(`${result.createDateTimePersian.split(" ")[0]}<p class="mb-0 mt-neg-5">${result.createDateTimePersian.split(" ")[1]}</p>`);
            }
            else {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.id);
                //$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > select`).val(result.pricingModelId).trigger("change");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val(checkResponse(result.beginPrice) ? transformNumbers.toComma(result.beginPrice) : "");
                //$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 > input`).val(checkResponse(result.endPrice) && result.endPrice != 0 ? transformNumbers.toComma(result.endPrice) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4`).text(`${result.createUserId} - ${result.createUserFullName}`);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5`)
                    .html(`${result.createDateTimePersian.split(" ")[0]}<p class="mb-0 mt-neg-5">${result.createDateTimePersian.split(" ")[1]}</p>`);
            }

        }
        else
            setDefaultRowOnModal(pagetable_id, currentrow)
    }
}

function setDefaultRowOnModal(pagetable_id, currentrow) {

    if (pagetable_id == "servicePricing_pagetable") {
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val("");
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4`).text("");
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5`).html("");
    }
    else {

        if (insurerTypeIdOnModal == 1) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > select`).val(0).trigger("change");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_7`).html("");
        }
        else {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
            //$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > select`).val(0).trigger("change");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val("");
            //$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5`).html("");
        }

    }
}

function exportCsvServicesAndItem() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    var urlCSV = "";
    let title = ""


    if (itemTypeIdOnModal == 2) {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "services_pagetable");
        urlCSV = "api/MC/ServiceApi/csv"
        csvModel.Form_KeyValue = ["itempricing"];
        title = "خدمت"
        csvModel.filters = arrSearchFilter[index].filters
    }
    else {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "items_pagetable");
        urlCSV = "api/WH/ItemApi/csv"
        csvModel.Form_KeyValue = ["itempricing", 1];
        csvModel.filters = arrSearchFilter[index].filters
        title = "کالا"
    }

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {

                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

function parameter() {


    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
        filters: [],
        sortModel: null
    }
    return parameters;
}

$("#operationType").on("change", function () {
    let operationType = +$(this).val()

    if (operationType == 1) {
        $("#deleteTransformPriceBox").addClass("d-none")
        $("#saveTransformPriceBox").removeClass("d-none")
        $("#toInsurerTypeId").prop("selectedIndex", 0).removeAttr("disabled").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
        $("#toMedicalSubjectId").prop("selectedIndex", 0).removeAttr("disabled").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
    }
    else {
        $("#deleteTransformPriceBox").removeClass("d-none")
        $("#saveTransformPriceBox").addClass("d-none")
        $("#toInsurerTypeId").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
        $("#toMedicalSubjectId").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
    }

})

$("#priceTypeIT").on("change", function () {

    let priceTypeIT = +$(this).val()

    if (priceTypeIT == 1) {
        $('#endPriceIT').attr("disabled", true)
        $('#endPriceIT').attr("required", false)
        $('#endPriceIT').val("");
    }
    else {
        $('#endPriceIT').attr("disabled", false)
        $('#endPriceIT').attr("required", true)
    }

})

$("#insurerTypeIdPS").on("change", function () {

    let insurerTypeId = $(this).val()
    var data = { id: 0, text: 'انتخاب کنید' };
    var newOption = new Option(data.text, data.id, false, false);

    $("#insurerIdPS").empty()

    if (insurerTypeId != 0) {
        $('#insurerIdPS').append(newOption)
        fill_select2(`/api/MC/InsuranceApi/getinsurerdropdown/${insurerTypeId}/1`, "insurerIdPS", true);
        $('#insurerIdPS').removeAttr("disabled")
    }
    else
        $('#insurerIdPS').append(newOption).prop("disabled", "").trigger('change');

})

$("#hasNationalCodePS").on("change", function () {
    var code = $(this).val();

    if (code == 0) {
        $("#priceProfessionalCodePSDiv").removeClass("displaynone");
        $("#priceTechnicalCodePSDiv").removeClass("displaynone");
        $("#priceAnesthesiaBasePSDiv").removeClass("displaynone");
        $("#fromNationalCodeDiv").removeClass("displaynone");
        $("#toNationalCodeDiv").removeClass("displaynone");
        $("#attributePSDiv").removeClass("displaynone");

        $("#compPricePSDiv").addClass("displaynone").prop("disabled", true);
        $("#toServiceIdPSDiv").addClass("displaynone");
        $("#fromServiceIdPSDiv").addClass("displaynone");

        $("#compPricePS").val("");
        $("#toServiceIdPS").val("");
        $("#fromServiceIdPS").val("");
        $("#priceProfessionalCodePS").val("");
        $("#priceTechnicalCodePS").val("");
        $("#priceAnesthesiaBasePS").val("");
        $("#fromNationalCode").val("");
        $("#toNationalCode").val("");
        $("#attributePS").val("0");

        $("#priceProfessionalCodePS").prop("required", true);
        $("#priceTechnicalCodePS").prop("required", true);
        $("#priceAnesthesiaBasePS").prop("required", true);
        $("#compPricePS").prop("required", false);
    }
    else {
        $("#priceProfessionalCodePSDiv").addClass("displaynone");
        $("#priceTechnicalCodePSDiv").addClass("displaynone");
        $("#priceAnesthesiaBasePSDiv").addClass("displaynone");
        $("#fromNationalCodeDiv").addClass("displaynone");
        $("#toNationalCodeDiv").addClass("displaynone");
        $("#attributePSDiv").addClass("displaynone");

        $("#compPricePS").val("");
        $("#toServiceIdPS").val("");
        $("#fromServiceIdPS").val("");
        $("#priceProfessionalCodePS").val("");
        $("#priceTechnicalCodePS").val("");
        $("#priceAnesthesiaBasePS").val("");
        $("#fromNationalCode").val("");
        $("#toNationalCode").val("");
        $("#attributePS").val("0");

        $("#compPricePSDiv").removeClass("displaynone").removeAttr("disabled");
        $("#toServiceIdPSDiv").removeClass("displaynone");
        $("#fromServiceIdPSDiv").removeClass("displaynone");

        $("#priceProfessionalCodePS").val("");
        $("#priceTechnicalCodePS").val("");
        $("#priceAnesthesiaBasePS").val("");
        $("#fromNationalCode").val("");
        $("#toNationalCode").val("");
        $("#attributePS").val("0");

        $("#priceProfessionalCodePS").prop("required", false);
        $("#priceTechnicalCodePS").prop("required", false);
        $("#priceAnesthesiaBasePS").prop("required", false);
        $("#compPricePS").prop("required", true);
    }

});

$("#perviewServicePriceAndItemPrice").on("click", function () {

    itemTypeIdInUpdateModal == 2 ? form = $("#servicePricePriceForm").parsley() : form = $("#itemPriceForm").parsley()

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    let resultSave = ""

    resultSave = servicePriceAndItemPriceTempSave(true, itemTypeIdInUpdateModal);

    if (resultSave.successfull) {
        if (resultSave.affectedRows == 0) {
            var msgResult = alertify.warning("موردی برای به روزرسانی وجود ندارد");
            msgResult.delay(alertify_delay);
            return
        }
        else {
            var msgResult = alertify.success(resultSave.statusMessage);
            msgResult.delay(alertify_delay);
            disableEnableFildPSOrIt(true);

            $("#enableFormPSAndIt").prop("disabled", false);
            $("#perviewServicePriceAndItemPriceCounter").text(resultSave.affectedRows);
            $("#saveServicePriceAndItemPrice").prop("disabled", false);
            $("#affectedRowsServiceAndItem").text("0");
        }
    }
    else {
        switch (resultSave.status) {
            case -100:
            case -101:
            case -103:
                alertify.error(resultSave.statusMessage).delay(7);
                break;

            case -102:
            case -104:
                let msg = generateErrorString(resultSave.validationErrors);

                if (msg !== "") {
                    var err = alertify.warning(msg);
                    err.delay(10);
                    return;
                }
                break;
        }
    }


});

$("#saveServicePriceAndItemPrice").on("click", function () {

    itemTypeIdInUpdateModal == 2 ? form = $("#servicePricePriceForm").parsley() : form = $("#itemPriceForm").parsley()

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    var resultSave = servicePriceAndItemPriceTempSave(false, itemTypeIdInUpdateModal);

    if (resultSave.successfull) {

        var msgResult = alertify.success(resultSave.statusMessage);
        msgResult.delay(alertify_delay);

        $("#affectedRowsServiceAndItem").text(resultSave.affectedRows);
        enableForm("#enableFormPSAndIt", "ps", '#saveServicePriceAndItemPrice');

    }
    else {
        switch (resultSave.status) {
            case -100:
            case -101:
            case -103:
                alertify.error(resultSave.statusMessage).delay(7);
                break;

            case -102:
            case -104:
                //generateErrorValidation(resultSave.validationErrors);
                let msg = generateErrorString(resultSave.validationErrors);

                if (msg !== "") {
                    var err = alertify.warning(msg);
                    err.delay(10);
                }
                break;
        }
    }



    //var msgResult = alertify.success("عملیات با موفقیت انجام شد");
    //msgResult.delay(alertify_delay);

    if (itemTypeIdInUpdateModal == 2)
        changeTabInbound(1, "services_pagetable", "services")
    else
        changeTabInbound(2, "services_pagetable", "item")

});
$("#sendModal").on("hidden.bs.modal", function () {
    pagetable_formkeyvalue = [];
    selectedRow = [];
});
$("#servicePricingModal").on("hidden.bs.modal", function () {
    if (itemTypeIdOnModal == 2)
        pagetable_formkeyvalue = ["itempricing"];
    else if (itemTypeIdOnModal == 1)
        pagetable_formkeyvalue = ["itempricing", 1];

    itemIdOnModal = null
    insurerTypeIdOnModal = null
});

$("#itemPricingModal").on("hidden.bs.modal", function () {
    if (itemTypeIdOnModal == 2)
        pagetable_formkeyvalue = ["itempricing"];
    else if (itemTypeIdOnModal == 1)
        pagetable_formkeyvalue = ["itempricing", 1];

    //itemTypeIdOnModal = null
    itemIdOnModal = null
    insurerTypeIdOnModal = null
});

$("#compPricePS").on("keydown", function (e) {
    if (e.keyCode == 13) {
        $("[tabindex = 32]").focus()
    }
})

$("#priceAnesthesiaBasePS").on("keydown", function (e) {
    if (e.keyCode == 13) {
        $("[tabindex = 32]").focus()
    }
})

$('#toMedicalSubjectId').on('select2:close', function (e) {
    $("[tabindex = 256]").focus()
})

$("#beginPriceIT").on("keydown", function (e) {
    let priceTypeIT = +$("#priceTypeIT").val()

    if (priceTypeIT == 1) {
        if (e.keyCode == 13)
            $("[tabindex = 32]").focus()
    }

})

$("#servicePriceAndItemPriceModal").on("hidden.bs.modal", function () {
    if (itemTypeIdOnModal == 2)
        $("#services_pagetable .highlight").focus()
    else
        $("#items_pagetable .highlight").focus()
})

$("#priceTransferServiceAndItemModal").on("hidden.bs.modal", function () {
    if (itemTypeIdOnModal == 2)
        $("#services_pagetable .highlight").focus()
    else
        $("#items_pagetable .highlight").focus()
})

initServiceItemPricing()

window.Parsley._validatorRegistry.validators.nationalcoderange = undefined
window.Parsley.addValidator("nationalcoderange", {
    validateString: function (value) {

        var from = +$("#fromNationalCode").val();
        var to = +$("#toNationalCode").val();

        var range = comparisonStartEnd(from, to);

        return !range;
    },
    messages: {
        en: 'محدوده نمبر تذکره اشتباه می باشد'
    }
});

window.Parsley._validatorRegistry.validators.rangeid = undefined
window.Parsley.addValidator("rangeid", {
    validateString: function (value) {
        var from = +$("#fromServiceIdPS").val();
        var to = +$("#toServiceIdPS").val();
        var range = comparisonStartEnd(from, to);

        return !range;
    },
    messages: {
        en: 'محدوده شناسه خدمت اشتباه می باشد'
    }
});


window.Parsley._validatorRegistry.validators.vildtionmodal = undefined
window.Parsley.addValidator("validationmodal", {
    validateString: value => {

        let fromInsurerId = +$("#fromInsurerTypeId").val()

        let toInsurerId = +$("#toInsurerTypeId").val()

        let fromMedicalSubjectId = +$("#fromMedicalSubjectId").val()

        let toMedicalSubjectId = +$("#toMedicalSubjectId").val()

        if (toInsurerId !== 0 && fromInsurerId !== 0 && fromInsurerId == toInsurerId)
            if (fromMedicalSubjectId !== 0 && toMedicalSubjectId !== 0 && fromMedicalSubjectId == toMedicalSubjectId)
                return false;
        return true;
    },
    messages: {
        en: 'بیمه های مبدا و مقصد نمی تواند یک مقدار داشته باشد'
    }

});
