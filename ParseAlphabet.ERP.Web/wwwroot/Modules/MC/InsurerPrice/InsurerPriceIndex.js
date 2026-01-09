
var viewData_controllername = "InsurerPrice",
    copyInsurerServicesDropdown = false,
    typeTransform = 1,
    sharePerIds = [],
    pageName = "#tempbasicCalculationMethod"; selectedId = "";
var pgt_medicalItemPrice = {
    pagetable_id: "medicalItemPrice_getPage",
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
    getpagetable_url: `${viewData_baseUrl_MC}/ServiceItemPricingApi/getpage`,
}
var viewData_sendcentral_url = `${viewData_baseUrl_MC}/InsurerPriceLineApi/sendcentralinsurerprice`;

arr_pagetables.push(pgt_medicalItemPrice);

function initInsurerPrice() {

    $("#medicalItemPrice_getPage .filterBox").remove()
    $("#sharePer").inputmask();

    $("#insuranceTransformServiceForm .select2").select2()
    $("#insurerPriceForm .select2").select2()
    $("#medicalItemPriceFilters .select2").select2()

    getDropDown()

    $("#itemTypeId").prop("selectedIndex", 0).trigger("change")

    addPriceOperation();
}

function getDropDown() {
    var data = { id: 0, text: 'انتخاب کنید' };
    var newOption = new Option(data.text, data.id, false, false);
    $('#medicalSubjectId').append(newOption).trigger('change');
    fill_select2(`/api/AdmissionsApi/medicalsubject_getdropdown`, "medicalSubjectId", true);
}

function addPriceOperation() {
    $(".header-title .button-items").prepend(`<button id="exportCSV" onclick="exportCsvServicesAndItem()" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel"></i>اکسل</button>`)
    $(".header-title .button-items").prepend(`<button type="button" onclick="displayModalInsurerPrice()" class="btn green_4 waves-effect"><i class="fa fa-edit"></i>تعرفه بیمه کالا و خدمات</button>`)
    $(".header-title .button-items").prepend(`<button type="button" onclick="copyInsurerServices()" class="btn blue_1  waves-effect"><i class="fa fa-file"></i>انتقال بیمه کالا و خدمات</button>`)
}

function exportCsvServicesAndItem() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let form = $("#medicalItemPriceFilters").parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    let urlCSV = "api/MC/ServiceItemPricingApi/csv";
    let title = "قیمت گذاری بیمه"

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { modelStringify: JSON.stringify(csvModel) },
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
        form_KeyValue: ["insurerprice"],
        sortModel: null,
        medicalItemPriceId: +$("#medicalItemPriceId").val() == 0 ? null : $("#medicalItemPriceId").val(),
        itemId: +$("#itemId").val() == 0 ? null : $("#itemId").val(),
        itemTypeId: +$("#itemTypeId").val() == 0 ? null : $("#itemTypeId").val(),
        insurerTypeId: +$("#insurerTypeId").val() == 0 ? null : $("#insurerTypeId").val(),
        medicalSubjectId: +$("#medicalSubjectId").val() == 0 ? null : $("#medicalSubjectId").val(),
        includeAll: false

    };
    return parameters;
}

function generateCsvServiceAndItem(data, title) {

    var csv = "\ufeff";
    csv += data.columns + "\r\n";
    var rows = data.rows;
    rows.forEach(function (currentRow) {
        for (var item in currentRow) {
            var value = currentRow[item] != null ? currentRow[item].toString() : "";
            value = value.replace(/"/g, "");
            csv += quote(value) + ",";
        }
        csv += "\r\n";
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `${title}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function displayModalInsurerPrice() {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    insurerPriceModalResetform()

    modal_show('insurerPriceModal');

}

function insurerPriceModalResetform() {

    $(".modal-dialog").css({ "top": "unset", "left": "unset" });


    //$("#savePriceService").prop("disabled", true);
    $("#insurerPriceItemTypeId").val("1").trigger("change");

    $("#insurerTypePI").val("1").trigger("change");

    $("#hasNationalCodePI").val("0").trigger("change");

    $("#insurerPI").val("").trigger("change");

    $("#insuranceBoxPI").val("").trigger("change");

    $("#attributePI").val("0").trigger("change");

    $("#serviceTypeIdPI").val("0")

    $("#insurerPriceCalculationMethodIdPI").val("").trigger("change");

    $("#fromServiceIdPI").val("");

    $("#toServiceIdPI").val("");

    $("#fromNationalCodePI").val("");

    $("#toNationalCodePI").val("");

    $("#priceProfessionalCodePI").val("");

    $("#priceTechnicalCodePI").val("");

    $("#priceAnesthesiaBasePI").val("");

    $("#compPrice").val("");

    $("#affectedRowsInsurer").text("0");

    $("#perviewInsurerPriceCounter").text("0")

    $("#sharePer").val("");
}

function saveCopyInsurer(isPreview = false) {
    var operationType = $("#operationTypeInsurance").val();

    let form = $(`#insuranceTransformServiceForm .tabToggle${typeTransform}`).parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    let model = {
        fromInsurerId: 0,
        toInsurerId: 0,
        fromInsurerLineId: 0,
        fromInsurerPriceCalculationMethodId: 0,
        fromInsurerSharePer: null,
        toInsurerLineId: 0,
        toInsurerPrice: 0,
        toInsurerSharePer: 0,
        isPreview,
        itemTypeId: 0,
        itemId: 0,
        operationType
    }

    if (typeTransform == 1) {
        model.fromInsurerId = +$("#basicInsurerIdFrom").val();
        model.toInsurerId = +$("#basicInsurerIdTo").val() > 0 ? +$("#basicInsurerIdTo").val() : null;
        model.fromInsurerLineId = +$("#basicInsuranceBoxIdFrom").val();
        model.toInsurerLineId = +$("#basicInsuranceBoxIdTo").val();
        model.itemTypeId = +$("#serviceOrItemInsurance").val();
        model.itemId = +$("#basicItemId").val() > 0 ? +$("#basicItemId").val() : null;
        model.fromInsurerPriceCalculationMethodId = +$("#basicCalculationMethodId").val();
        model.toInsurerSharePer = +$("#basicInsurerSharePer").val() > 0 ? +$("#basicInsurerSharePer").val() : null;
    }
    else if (typeTransform == 2) {
        model.fromInsurerId = +$("#compInsuranceBoxIdFrom").val();
        model.toInsurerId = +$("#compInsuranceBoxIdTo").val() ? +$("#compInsuranceBoxIdTo").val() : null;
        model.fromInsurerLineId = +$("#compInsurerLineIdFrom").val();
        model.toInsurerLineId = +$("#compInsurerLineIdTo").val();
        model.itemTypeId = +$("#serviceOrItemCompInsurance").val();
        model.itemId = +$("#compItemId").val() > 0 ? +$("#compItemId").val() : null;
        model.fromInsurerPriceCalculationMethodId = +$("#compCalculationMethodId").val();
        model.toInsurerSharePer = +$("#compInsurerSharePer").val() ? +$("#compInsurerSharePer").val() : null;
    }
    else if (typeTransform == 3) {
        model.fromInsurerId = + $("#thirdPartyIdFrom").val();
        model.toInsurerId = +$("#thirdPartyIdTo").val() ? +$("#thirdPartyIdTo").val() : null;
        model.fromInsurerLineId = null;
        model.toInsurerLineId = null;
        model.itemTypeId = +$("#serviceOrItemThirdParty").val();
        model.itemId = +$("#thirdItemId").val() > 0 ? +$("#thirdItemId").val() : null;
        model.fromInsurerPriceCalculationMethodId = +$("#thirdCalculationMethodId").val();
        model.toInsurerSharePer = +$("#thirdInsurerSharePer").val() ? +$("#thirdInsurerSharePer").val() : null;
    }
    else if (typeTransform == 4) {
        model.fromInsurerId = $("#discountIdFrom").val();
        model.toInsurerId = +$("#discountIdTo").val() ? $("#discountIdTo").val() : null;
        model.fromInsurerLineId = null;
        model.toInsurerLineId = null;
        model.itemTypeId = +$("#serviceOrItemDiscount").val();
        model.itemId = +$("#discountItemId").val() > 0 ? +$("#discountItemId").val() : null;
        model.fromInsurerPriceCalculationMethodId = +$("#discountCalculationMethodId").val();
        model.toInsurerSharePer = +$("#discountInsurerSharePer").val() ? +$("#discountInsurerSharePer").val() : null;
    }


    var ids = [];

    for (var i = 0; i < sharePerIds.length; i++) {
        ids.push(sharePerIds[i].id);
    }

    model.fromInsurerSharePer = ids.join(",");

    let result = copyInsurer(model);

    if (isPreview) {

        if (result.successfull) {


            if (result.affectedRows == 0) {
                var msgResult = alertify.warning("خدمتی برای حذف یا به روزرسانی وجود ندارد");
                msgResult.delay(alertify_delay);

            }
            else {
                var msgResult = alertify.success(result.statusMessage);
                msgResult.delay(alertify_delay);

                $("#perviewTransformServiceCounter").text(0);
                $("#saveTransformServiceCounter").text(0);
                $("#deleteTransformServiceCounter").text(0);

                $("#perviewTransformServiceCounter").text(result.affectedRows);

                disableEnableFildCopy(true)

                $("#saveTransformService").prop("disabled", false);
                $("#deleteTransformService").prop("disabled", false);
                $("#basicInsurerSharePer").prop("disabled", true);
                $("#compInsurerSharePer").prop("disabled", true);
                $("#thirdInsurerSharePer").prop("disabled", true);
                $("#discountInsurerSharePer").prop("disabled", true);
                if (operationType == 2)
                    $("#saveTransformServiceLable").focus();
                else
                    $("#deleteTransformServiceLable").focus();
            }

        }
        else {

            var msgResult = alertify.error(result.statusMessage);
            msgResult.delay(alertify_delay);

            $("#perviewTransformServiceCounter").text(0);
            $("#saveTransformService").removeAttr("disabled");
            $("#deleteTransformService").removeAttr("disabled");

            if (operationType == 2)
                $("#saveTransformServiceLable").focus();
            else
                $("#deleteTransformServiceLable").focus();
        }
    }
    else {
        if (result.successfull) {

            var msgResult = alertify.success(result.statusMessage);
            msgResult.delay(alertify_delay);

            $("#perviewTransformServiceCounter").text(0);
            $("#saveTransformServiceCounter").text(0);
            $("#deleteTransformServiceCounter").text(0);

            $(`#insuranceTransformServiceForm .tabToggle${typeTransform} select:not('#operationTypeInsurance,#operationTypeCompInsurance,#operationTypeThirdParty,#operationTypeDiscount')`).prop("selectedIndex", 0).trigger("change");

            $("#basicInsurerSharePer").val("");
            $("#compInsurerSharePer").val("");
            $("#thirdInsurerSharePer").val("");
            $("#discountInsurerSharePer").val("");

            if (operationType == 1) {
                $("#saveTransformServiceCounter").text(result.affectedRows);
                $("#deleteTransformServiceCounter").text(0);
            }
            else {
                $("#saveTransformServiceCounter").text(0);
                $("#deleteTransformServiceCounter").text(result.affectedRows);
            }

            $("#saveTransformService").prop("disabled", true);
            $("#deleteTransformService").prop("disabled", true);

        }
        else {
            switch (result.status) {
                case -100:
                case -101:
                case -103:
                    var msgResult = alertify.error(result.statusMessage);
                    msgResult.delay(alertify_delay);
                    break;
                case -102:
                    generateErrorValidation(result.validationErrors);
                    break;
            }
            $(`#insuranceTransformServiceForm .tabToggle${typeTransform} select:not('#operationTypeInsurance,#operationTypeCompInsurance,#operationTypeThirdParty,#operationTypeDiscount')`).prop("selectedIndex", 0).trigger("change");
            $("#basicInsurerSharePer").val("");
            $("#compInsurerSharePer").val("");
            $("#thirdInsurerSharePer").val("");
            $("#discountInsurerSharePer").val("");

            $("#saveTransformServiceCounter").text(0);
            $("#saveTransformService").removeAttr("disabled");

            $("#deleteTransformServiceCounter").text(0);
            $("#deleteTransformService").removeAttr("disabled");

        }

        disableEnableFildCopy(false);
    }
}

function disableEnableFildCopy(type) {

    $("#basicInsurerIdFrom").prop("disabled", type);
    $("#basicInsuranceBoxIdFrom").prop("disabled", type);
    $("#compInsuranceBoxIdFrom").prop("disabled", type);
    $("#compInsurerLineIdFrom").prop("disabled", type);
    $("#thirdPartyIdFrom").prop("disabled", type);
    $("#discountIdFrom").prop("disabled", type);


    $("#operationTypeInsurance").prop("disabled", type);

    if (+$("#operationTypeInsurance").val() == 2) {
        $("#basicInsurerIdTo").prop("disabled", true);
        $("#basicInsuranceBoxIdTo").prop("disabled", true);
        $("#basicInsurerSharePer").prop("disabled", true);
    }
    else {
        $("#basicInsurerIdTo").prop("disabled", type);
        $("#basicInsuranceBoxIdTo").prop("disabled", type);
        $("#basicInsurerSharePer").prop("disabled", false);
    }

    $("#operationTypeCompInsurance").prop("disabled", type);

    if (+$("#operationTypeCompInsurance").val() == 2) {
        $("#compInsuranceBoxIdTo").prop("disabled", true);
        $("#compInsurerLineIdTo").prop("disabled", true);

        $("#compInsurerSharePer").prop("disabled", true);

    }
    else {
        $("#compInsuranceBoxIdTo").prop("disabled", type);
        $("#compInsurerLineIdTo").prop("disabled", type);
        $("#compInsurerSharePer").prop("disabled", false);

    }


    $("#operationTypeThirdParty").prop("disabled", type);

    if (+$("#operationTypeThirdParty").val() == 2) {
        $("#thirdPartyIdTo").prop("disabled", true);
        $("#thirdInsurerSharePer").prop("disabled", true);
    }
    else {
        $("#thirdPartyIdTo").prop("disabled", type);
        $("#thirdInsurerSharePer").prop("disabled", false);
    }



    $("#operationTypeDiscount").prop("disabled", type);
    if (+$("#operationTypeDiscount").val() == 2) {
        $("#discountIdTo").prop("disabled", true);
        $("#discountInsurerSharePer").prop("disabled", true);
    }
    else {
        $("#discountIdTo").prop("disabled", type);
        $("#discountInsurerSharePer").prop("disabled", false);

    }


    $("#enableFormCopy").prop("disabled", !type);
    $("#previewTransformService").prop("disabled", type)


    $("#serviceOrItemInsurance").prop("disabled", type);
    $("#serviceOrItemCompInsurance").prop("disabled", type);
    $("#serviceOrItemThirdParty").prop("disabled", type);
    $("#serviceOrItemDiscount").prop("disabled", type);


    $("#basicCalculationMethodId").prop("disabled", type);
    $("#compCalculationMethodId").prop("disabled", type);
    $("#thirdCalculationMethodId").prop("disabled", type);
    $("#discountCalculationMethodId").prop("disabled", type);



    $("#basicItemId").prop("disabled", type);
    $("#compItemId").prop("disabled", type);
    $("#thirdItemId").prop("disabled", type);
    $("#discountItemId").prop("disabled", type);

    $(`#tempbasicCalculationMethod > tr> td>input`).prop("disabled", type);
    $(`#tempcompCalculationMethod > tr> td>input`).prop("disabled", type);
    $(`#tempthirdCalculationMethod > tr> td>input`).prop("disabled", type);
    $(`#tempdiscountCalculationMethod > tr> td>input`).prop("disabled", type);


    $(`#tempbasicCalculationMethod > tr> td>button`).prop("disabled", type);
    $(`#tempcompCalculationMethod > tr> td>button`).prop("disabled", type);
    $(`#tempthirdCalculationMethod > tr> td>button`).prop("disabled", type);
    $(`#tempdiscountCalculationMethod > tr> td>button`).prop("disabled", type);


}

function enableForm(elm, typeFrom, saveButton) {

    $("#perviewInsurerPriceCounter").text(0);
    $("#perviewServicePriceCounter").text(0);

    if (typeFrom == 'pi') {

        disableEnableFildPI(false);
        if ($("#insurerTypePI").val() == 1) {

            $("#compPrice").attr("disabled", "")


        }
        else {

            $("#compPrice").prop("disabled", true)
        }
        setTimeout(() => { $(".modal-body#insurerPriceForm select#insurerTypePI").select2("focus"); }, 200);
    }
    else if (typeFrom == 'copy') {
        $("#perviewTransformServiceCounter").text(0);
        disableEnableFildCopy(false);
        setTimeout(() => {
            focusInput($(".nav-link.active").data("no"));
        }, 200);
    }

    $(saveButton).prop("disabled", true);
    $(elm).prop("disabled", true);
}

function copyInsurerServices() {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    if (!copyInsurerServicesDropdown) {
        copyInsurerServicesLoadDropDown()
        copyInsurerServicesDropdown = true
    }

    resetInsurerModal()

    modal_show("insuranceTransformServiceModal");
}

function copyInsurerServicesLoadDropDown() {
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerIdFrom", true, `${dropDownCache.insurerLine}/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerIdTo", true, `${dropDownCache.insurerLine}/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsuranceBoxIdFrom", true, `2/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsuranceBoxIdTo", true, `2/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyIdFrom", true, `4/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyIdTo", true, `4/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "discountIdFrom", true, `5/false/1/true`, false);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "discountIdTo", true, `5/false/1/true`, false)
}

function changeTabTransform(tabNo) {

    setTimeout(() => {
        if (tabNo == 1)
            $("#serviceOrItemInsurance").select2("focus")
        else if (tabNo == 2)
            $("#serviceOrItemCompInsurance").select2("focus")
        else if (tabNo == 3)
            $("#serviceOrItemThirdParty").select2("focus")
        else if (tabNo == 4)
            $("#serviceOrItemDiscount").select2("focus")
    }, 20)

    typeTransform = tabNo;
    sharePerIds = [];
    resetInsurerModal();

    if (typeTransform == 1)
        pageName = "#tempbasicCalculationMethod";
    else if (typeTransform == 2)
        pageName = "#tempcompCalculationMethod";
    else if (typeTransform == 3)
        pageName = "#tempthirdCalculationMethod";
    else if (typeTransform == 4)
        pageName = "#tempdiscountCalculationMethod";
}

function resetInsurerModal() {
    $(`#insuranceTransformServiceForm select`).prop("selectedIndex", 0).prop("disabled", false).trigger("change");

    $("#perviewTransformServiceCounter,#saveTransformServiceCounter , #deleteTransformServiceCounter").text(0);
    $("#saveTransformService").prop("disabled", true);
    $("#deleteTransformService").prop("disabled", true);
    $("#previewTransformService").prop("disabled", false);
    $("#enableFormCopy").prop("disabled", true);


    $("#basicInsurerSharePer").val("");
    $("#compInsurerSharePer").val("");
    $("#thirdInsurerSharePer").val("");
    $("#discountInsurerSharePer").val("");

    let form = $(`#insuranceTransformServiceForm`).parsley();
    form.reset();
    validateSelect2(form);
}

function insurerPriceTempSave(isPreview) {

    var resultSave = 0;

    $("#affectedRowsInsurer").val("0");

    var modelInsurer = {
        insurerTypeId: +$("#insurerTypePI").val() == "0" ? null : +$("#insurerTypePI").val(),
        insurerId: +$("#insurerPI").val() == "0" ? null : +$("#insurerPI").val(),
        insurerLineId: +$("#insuranceBoxPI").val() == "0" ? null : +$("#insuranceBoxPI").val(),
        attribute: $("#attributePI").val() == "0" ? null : $("#attributePI").val(),
        serviceTypeId: $("#serviceTypeIdPI").val() == "0" ? null : $("#serviceTypeIdPI").val(),
        insurerPriceCalculationMethodId: +$("#insurerPriceCalculationMethodIdPI").val() == "0" ? null : +$("#insurerPriceCalculationMethodIdPI").val(),
        professionalPrice: +removeSep($("#priceProfessionalCodePI").val()) == "0" ? null : +removeSep($("#priceProfessionalCodePI").val()),
        technicalPrice: +removeSep($("#priceTechnicalCodePI").val()) == "0" ? null : +removeSep($("#priceTechnicalCodePI").val()),
        anesthesiaPrice: +removeSep($("#priceAnesthesiaBasePI").val()) == "0" ? null : +removeSep($("#priceAnesthesiaBasePI").val()),
        compPrice: +removeSep($("#compPrice").val()) == "0" ? null : +removeSep($("#compPrice").val()),
        sharePer: +$("#sharePer").val().replace(/\//g, "."),
        fromNationalCode: +$("#fromNationalCodePI").val() == "" || +$("#fromNationalCodePI").val() == "0" ? null : +$("#fromNationalCodePI").val(),
        toNationalCode: +$("#toNationalCodePI").val() == "" || +$("#toNationalCodePI").val() == "0" ? null : +$("#toNationalCodePI").val(),
        fromServiceId: +$("#fromServiceIdPI").val() == "" || +$("#fromServiceIdPI").val() == "0" ? null : +$("#fromServiceIdPI").val(),
        toServiceId: +$("#toServiceIdPI").val() == "" || +$("#toServiceIdPI").val() == "0" ? null : +$("#toServiceIdPI").val(),
        hasNationalCode: +$("#hasNationalCodePI").val() == 0 ? true : false,
        isPreview: isPreview,
        itemTypeId: +$("#insurerPriceItemTypeId").val()
    }

    var url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/updateinsurerprice`;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(modelInsurer),
        success: function (result) {
            resultSave = result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
    return resultSave;
}

function disableEnableFildPI(type) {
    $("#insurerTypePI").prop("disabled", type);
    $("#hasNationalCodePI").prop("disabled", type);
    $("#insurerPI").prop("disabled", type);
    $("#insuranceBoxPI").prop("disabled", type);
    $("#attributePI").prop("disabled", type);
    $("#serviceTypeIdPI").prop("disabled", type);
    $("#insurerPriceCalculationMethodIdPI").prop("disabled", type);
    $("#fromServiceIdPI").prop("disabled", type);
    $("#toServiceIdPI").prop("disabled", type);
    $("#fromNationalCodePI").prop("disabled", type);
    $("#toNationalCodePI").prop("disabled", type);
    $("#priceProfessionalCodePI").prop("disabled", type);
    $("#priceTechnicalCodePI").prop("disabled", type);
    $("#priceAnesthesiaBasePI").prop("disabled", type);
    $("#compPrice").prop("disabled", type);
    $("#sharePer").prop("disabled", type);
    $("#perviewInsurerPrice").prop("disabled", type);
    $("#insurerPriceItemTypeId").prop("disabled", type);
}

function changePI(type, code) {

    var insurerTypePI = $("#insurerTypePI").val();
    if (code == 0) {//دارد
        $("#fromNationalCodePIDiv").removeClass("displaynone");
        $("#toNationalCodePIDiv").removeClass("displaynone");
        $("#attributePIIDiv").removeClass("displaynone");

        if (insurerTypePI == 1) {//اجباری
            $("#priceProfessionalCodePIDiv").removeClass("displaynone");
            $("#priceTechnicalCodePIDiv").removeClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").removeClass("displaynone");
            $("#compPriceDiv").addClass("displaynone");
            $("#priceProfessionalCodePI").prop("required", true);
            $("#priceTechnicalCodePI").prop("required", true);
            $("#priceAnesthesiaBasePI").prop("required", true);
            $("#compPrice").prop("required", false);
            $("#compPrice").prop("disabled", true);

        }
        else {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
            $("#priceAnesthesiaBasePI").prop("required", false);
            $("#compPrice").prop("required", true);
            $("#compPrice").prop("disabled", false);

        }
    }
    else {//ندارد

        if (insurerTypePI == 1) {//اجباری
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", false);
            $("#compPrice").prop("required", true);
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#fromNationalCodePIDiv").addClass("displaynone");
            $("#toNationalCodePIDiv").addClass("displaynone");
            $("#attributePIIDiv").addClass("displaynone");
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
            $("#priceAnesthesiaBasePI").prop("required", false);

        }
        else {
            $("#compPrice").prop("disabled", true);
            $("#compPrice").prop("required", false);
            $("#fromNationalCodePIDiv").addClass("displaynone");
            $("#toNationalCodePIDiv").addClass("displaynone");
            $("#attributePIIDiv").addClass("displaynone");
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
            $("#priceAnesthesiaBasePI").prop("required", false);
            $("#compPrice").prop("required", true);
        }
    }
    $("#compPrice").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceAnesthesiaBasePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceTechnicalCodePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceProfessionalCodePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#toNationalCodePI").val("");
    $("#fromNationalCodePI").val("");
    $("#toServiceIdPI").val("");
    $("#fromServiceIdPI").val("");
    $("#attributePI").val("0");
}

function getMedicalItemPriceList() {

    let form = $("#medicalItemPriceFilters").parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == 'medicalItemPrice_getPage');
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;


    pagetable_formkeyvalue[0] = 'insurerprice'
    get_NewPageTable('medicalItemPrice_getPage')
}

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";

    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    let pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue;

    let pageViewModel = {}


    if (pg_id == "medicalItemPrice_getPage") {

        pageViewModel = {
            pageno: pagetable_pageNo,
            pagerowscount: pagetable_pagerowscount,
            fieldItem: pagetable_filteritem,
            fieldValue: pagetable_filtervalue,
            form_KeyValue: [0],
            sortModel: {
                colId: dataOrder.colId,
                sort: dataOrder.sort
            },
            medicalItemPriceId: +$("#medicalItemPriceId").val() == 0 ? null : +$("#medicalItemPriceId").val(),
            itemId: +$("#itemId").val() === 0 ? null : +$("#itemId").val(),
            itemTypeId: +$("#itemTypeId").val(),
            insurerTypeId: +$("#insurerTypeId").val(),
            medicalSubjectId: +$("#medicalSubjectId").val() == 0 ? null : +$("#medicalSubjectId").val(),
            includeAll: false
        }

    }
    else {
        pageViewModel = {
            pageno: pagetable_pageNo,
            pagerowscount: pagetable_pagerowscount,
            fieldItem: pagetable_filteritem,
            fieldValue: pagetable_filtervalue,
            form_KeyValue: [0],
            sortModel: {
                colId: dataOrder.colId,
                sort: dataOrder.sort
            }
        }
    }


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
                fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);

            if (typeof callBack != "undefined")
                callBack(result);

            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function run_button_insurerline(id, row, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    showInsurerPriceLineApi(id, row, elm, e)
}

function copyInsurer(model) {

    let viewData_save_duplicate_url = `${viewData_baseUrl_MC}/ServiceItemPricingApi/insuranceduplicate`;

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

function operatonTypeConfig(tabNo, type) {

    if (type == 1) {
        $("#deleteTransformServiceBox").addClass("d-none")
        $("#saveTransformServiceBox").removeClass("d-none")
    }
    else {
        $("#deleteTransformServiceBox").removeClass("d-none")
        $("#saveTransformServiceBox").addClass("d-none")
    }


    if (tabNo == 1) {
        if (type == 1) {
            $("#basicInsurerIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#basicInsuranceBoxIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#basicInsurerSharePer").removeAttr("disabled", "").attr("data-parsley-maxminpercent", "").prop("required", true);


        }
        else {
            $("#basicInsurerIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#basicInsuranceBoxIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#basicInsurerSharePer").prop("disabled", true).removeAttr("data-parsley-maxminpercent", "").prop("required", false);
            $("#basicInsurerSharePer").val("");
        }

    }
    else if (tabNo == 2) {

        if (type == 1) {
            $("#compInsuranceBoxIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#compInsurerLineIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#compInsurerSharePer").removeAttr("disabled", "").attr("data-parsley-maxminpercent", "").prop("required", true);


        }
        else {
            $("#compInsuranceBoxIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#compInsurerLineIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#compInsurerSharePer").prop("disabled", true).removeAttr("data-parsley-maxminpercent", "").prop("required", false);
            $("#compInsurerSharePer").val("");
        }
    }
    else if (tabNo == 3)
        if (type == 1) {
            $("#thirdPartyIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#thirdInsurerSharePer").removeAttr("disabled", "").attr("data-parsley-maxminpercent", "").prop("required", true);
        }

        else {
            $("#thirdPartyIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#thirdInsurerSharePer").prop("disabled", true).removeAttr("data-parsley-maxminpercent", "").prop("required", false);
            $("#thirdInsurerSharePer").val("");
        }


    else
        if (type == 1) {
            $("#discountIdTo").prop("selectedIndex", 0).removeAttr("disabled", "").attr("data-parsley-validationmodal", "").attr("data-parsley-selectvalzero", "").trigger("change")
            $("#discountInsurerSharePer").removeAttr("disabled", "").attr("data-parsley-maxminpercent", "").prop("required", true);
        }
        else {
            $("#discountIdTo").prop("selectedIndex", 0).attr("disabled", "").removeAttr("data-parsley-validationmodal").removeAttr("data-parsley-selectvalzero").trigger("change")
            $("#discountInsurerSharePer").prop("disabled", true).removeAttr("data-parsley-maxminpercent", "").prop("required", false);
            $("#discountInsurerSharePer").val("");
        }


    $("#perviewTransformServiceCounter").text(0);
    $("#saveTransformServiceCounter").text(0);
    $("#deleteTransformServiceCounter").text(0);
}

function filllItemService() {

    let insurerTypeId = +$("#insurerTypeId").val()
    let itemTypeId = +$("#itemTypeId").val()
    let medicalSubjectId = +$("#medicalSubjectId").val() == 0 ? null : +$("#medicalSubjectId").val()

    $("#itemId").empty()

    fill_select2(`/api/MC/ServiceItemPricingApi/getdropdown`, "itemId", true, `${itemTypeId}/${insurerTypeId}/${medicalSubjectId}`, true);

    itemTypeId == 1 ? $("#itemIdLabel").text("کالا") : itemTypeId == 2 ? $("#itemIdLabel").text("خدمت") : $("#itemIdLabel").text("کالا / خدمت")
}

function lastElementTab() {
    $("[tabindex = 100004]").focus();
}

function getValueFilterParamCalculationMethodId(type = null) {
    let itemId = ""
    let itemTypeId = ""
    let insurerId = ""
    let insurerLineId = ""
    let insurerPriceCalculationMethodId = ""

    //type 1 : بیمه اجباری
    if (type == 1) {
        itemTypeId = +$("#serviceOrItemInsurance").val()

        insurerId = +$("#basicInsurerIdFrom").val()
        insurerLineId = +$("#basicInsuranceBoxIdFrom").val()
        insurerPriceCalculationMethodId = +$("#basicCalculationMethodId").val() > 0 ? +$("#basicCalculationMethodId").val() : null
        itemId = + $("#basicItemId ").val() > 0 ? +$("#basicItemId ").val() : null
    }
    //type 2 : بیمه تکمیلی
    else if (type == 2) {
        itemTypeId = +$("#serviceOrItemCompInsurance").val()

        insurerId = +$("#compInsuranceBoxIdFrom").val()
        insurerLineId = +$("#compInsurerLineIdFrom").val()
        insurerPriceCalculationMethodId = +$("#compCalculationMethodId").val() > 0 ? +$("#compCalculationMethodId").val() : null
        itemId = + $("#compItemId ").val() > 0 ? +$("#compItemId ").val() : null
    }
    //type 3 : طرف قرارداد 
    else if (type == 3) {
        itemTypeId = +$("#serviceOrItemThirdParty").val()
        insurerId = +$("#thirdPartyIdFrom").val()
        insurerLineId = null
        insurerPriceCalculationMethodId = +$("#thirdCalculationMethodId").val() > 0 ? +$("#thirdCalculationMethodId").val() : null
        itemId = + $("#thirdItemId ").val() > 0 ? +$("#thirdItemId ").val() : null
    }
    //type 4 : تخفیف
    else {
        itemTypeId = +$("#serviceOrItemDiscount").val()
        insurerId = +$("#discountIdFrom").val()
        insurerLineId = null
        insurerPriceCalculationMethodId = +$("#discountCalculationMethodId").val() > 0 ? +$("#discountCalculationMethodId").val() : null
        itemId = + $("#discountItemId ").val() > 0 ? +$("#discountItemId ").val() : null
    }


    return { itemTypeId: itemTypeId, itemId: itemId, insurerId: insurerId, insurerLineId: insurerLineId, insurerPriceCalculationMethodId: insurerPriceCalculationMethodId }

}

function checkValidationValueFilterParamCalculationMethod(model) {
    return model.itemTypeId > 0 && model.insurerId > 0 && model.insurerLineId > 0;
}

function checkValidationValueParamCalculationMethod(model) {
    return model.itemTypeId > 0 && model.insurerId > 0;
}


function getServiceCountCalculationMethodList(model) {

    let url = `${viewData_baseUrl_MC}/InsurerPriceLineApi/getservicecountcalculationmethodlist`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            fillServiceCountCalculationMethodList(model.itemTypeId, model.insurerId, model.insurerLineId, result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
}

function fillServiceCountCalculationMethodList(itemTypeId, insurerId, insurerLineId, data) {

    let output = "";

    if (typeTransform == 1)
        $("#basicCalculationMethodResult").removeClass("displaynone")
    else if (typeTransform == 2)
        $("#compCalculationMethodResult").removeClass("displaynone")
    else if (typeTransform == 3)
        $("#thirdCalculationMethodResult").removeClass("displaynone")
    else if (typeTransform == 4)
        $("#discountCalculationMethodResult").removeClass("displaynone")

    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            output += `<tr highlight=${i + 1} id=row_${i + 1} onclick="tr_onclickCalculationMethod(${i + 1})"  onkeydown="tr_onkeydownCalculationMethodDisplay(${i + 1},this,event)" tabindex="-1">
                         <td style="width:10%;"><input id="chk_${i + 1}"  type="checkbox" onchange="arrayCalculationMethodChecked(this)" /></td>
                         <td style="width:10%;text-align:center">${i + 1}</td>
                         <td style="width:30%;">${data[i].insurerPriceCalculationMethodId} - ${data[i].insurerPriceCalculationMethodName}</td>
                         <td id="sharePer_${i + 1}"style="width:20%;">${data[i].insurerSharePer}</td>
                         <td style="width:20%;">${data[i].serviceCount}</td>
                         <td style="width:10%;"><button type="button" id="exportCSV" onclick="export_csvCalculationMethod(${itemTypeId}, ${insurerId}, ${insurerLineId},${data[i].insurerPriceCalculationMethodId},${data[i].insurerSharePer})" class="btn green_outline_1 ml-1" ><i class="fa fa-file-excel"></i></button></td>
                       </tr>`;
        }
    }
    else {
        output = `<tr>
                       <td colspan="6" style="text-align:center">سطری وجود ندارد</td>
                   </tr>
                  `}

    $(`${pageName}`).html(output);
    $(`${pageName} > tr#row_1`).addClass("highlight");


}

function tr_onclickCalculationMethod(rowNo) {


    $(`${pageName} > tr`).removeClass("highlight");
    $(`${pageName} > tr#row_${rowNo}`).addClass("highlight");
}

function tr_onkeydownCalculationMethodDisplay(rowNo, elm, e) {


    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`${pageName} > tr#row_${rowNo - 1}`).length > 0) {
            $(`${pageName} > tr.highlight`).removeClass("highlight");
            $(`${pageName} > tr#row_${rowNo - 1}`).addClass("highlight");
            $(`${pageName} > tr#row_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`${pageName} > tr#row_${rowNo + 1}`).length > 0) {
            $(`${pageName} > tr.highlight`).removeClass("highlight");
            $(`${pageName} > tr#row_${rowNo + 1}`).addClass("highlight");
            $(`${pageName} > tr#row_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();
        $(`${pageName} > tr#row_${rowNo} input`).click();
    }
}

function arrayCalculationMethodChecked(item) {

    let idChcke = item.id.split('_')[1];


    let sharePerId = +$(`${pageName} > tr#row_${idChcke} > td#sharePer_${idChcke}`).text();

    var currencyIndex = sharePerIds.findIndex(x => x.id === sharePerId);

    if ($(item).prop("checked")) {
        if (currencyIndex === -1)
            sharePerIds.push({ id: sharePerId })
    }
    else {
        if (currencyIndex !== -1)
            sharePerIds.splice(currencyIndex, 1);
    }


}

function export_csvCalculationMethod(itemTypeId, insurerId, insurerLineId, insurerPriceCalculationMethodId, insurerSharePer) {


    let csvModel = {
        itemTypeId: itemTypeId,
        insurerId: insurerId,
        insurerLineId: insurerLineId,
        insurerPriceCalculationMethodId: insurerPriceCalculationMethodId,
        insurerSharePer: insurerSharePer,
    }


    let title = csvModel.itemTypeId == 1 ? "لیست کالا" : "لیست خدمات";


    let urlCSV = `${viewData_baseUrl_MC}/InsurerPriceLineApi/csvCalculationMethod`;
    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { modelStringify: JSON.stringify(csvModel) },
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

function fillDropDownForm(type) {

    let model = getValueFilterParamCalculationMethodId(type);

    let calculationMethodId = type == 1 ? "basicCalculationMethodId" : type == 2 ? "compCalculationMethodId" : type == 3 ? "thirdCalculationMethodId" : "discountCalculationMethodId";
    let itemId = type == 1 ? "basicItemId" : type == 2 ? "compItemId" : type == 3 ? "thirdItemId" : "discountItemId";
    let checkValidate = (type == 1 || type == 2) ? checkValidationValueFilterParamCalculationMethod(model) : checkValidationValueParamCalculationMethod(model);
    $(`#${itemId}`).empty();
    if (checkValidate) {

        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/calculationmethodidgetlistbyinsurer`, `${calculationMethodId}`, true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}`, false);

        getServiceCountCalculationMethodList(model);
    }

    if (model.insurerId > 0 && model.insurerLineId > 0 && model.itemTypeId > 0 && model.insurerPriceCalculationMethodId > 0)
        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/getitemsinsurerprice`, `${itemId}`, true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}/${model.insurerPriceCalculationMethodId}`, false);



}

$("#insurerPriceItemTypeId").on("change", function () {

    let insurerPriceItemTypeId = +$(this).val()

    $("#serviceTypeIdPI").empty()

    if (insurerPriceItemTypeId == 2) {
        $("#serviceTypeIdPIDiv").removeClass("displaynone")
        fill_select2("/api/MC/ServiceTypeApi/getdropdown", "serviceTypeIdPI", true, 1);
    }
    else

        $("#serviceTypeIdPIDiv").addClass("displaynone")

    $("#insurerPriceCalculationMethodIdPI").empty();
    var insurerTypePI = +$("#insurerTypePI").val();
    fill_select2(`/api/AdmissionsApi/calculationmethod_getdropdown/${insurerPriceItemTypeId}/${insurerTypePI}`, "insurerPriceCalculationMethodIdPI", true);

})

$("#insurerPriceLineModal").on("hidden.bs.modal", function () {
    pagetable_formkeyvalue = []
    pagetable_formkeyvalue[0] = 'insurerprice'
});

$("#savePriceInsurer").on("click", function () {

    var form = $('#insurerPriceForm').parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var resultSave = insurerPriceTempSave(false);
    
    if (resultSave.successfull) {
        $("#affectedRowsInsurer").text(resultSave.affectedRows);
        var msgResult = alertify.success(resultSave.statusMessage);
        msgResult.delay(alertify_delay);
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

    enableForm("#enableFormPI", 'pi', '#savePriceInsurer');

    //var msgResult = alertify.success("عملیات با موفقیت انجام شد");
    //msgResult.delay(alertify_delay);
});

$("#insurerTypePI").on("change", function () {

    var insurerTypePI = +$(this).val()
    var hasNationalCode = +$("#hasNationalCodePI").val();
    let itemTypeId = +$("#insurerPriceItemTypeId").val()

    $("#insurerPI").empty()
    $("#insurerPriceCalculationMethodIdPI").empty()

    if (insurerTypePI != 0) {

        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "insurerPI", true, `${insurerTypePI}/true/2/false`, false, 3, "انتخاب کنید", () => {
            $("#insurerPI").prop("selectedIndex", 0).trigger("change")
        });

    }
    else
        $("#insurerPI").val(0).trigger("change")

    fill_select2(`/api/AdmissionsApi/calculationmethod_getdropdown/${itemTypeId}/${insurerTypePI}`, "insurerPriceCalculationMethodIdPI", true);

    if (hasNationalCode == 0) { //دارد 
        if (insurerTypePI == 1) {
            $("#priceProfessionalCodePIDiv").removeClass("displaynone");
            $("#priceTechnicalCodePIDiv").removeClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").removeClass("displaynone");
            $("#insuranceBoxPIDiv").removeClass("displaynone");
            $("#compPriceDiv").addClass("displaynone");
            $("#priceProfessionalCodePI").prop("required", true);
            $("#priceTechnicalCodePI").prop("required", true);
            $("#priceAnesthesiaBasePI").prop("required", true);
        }
        else if (insurerTypePI == 2) {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePI").removeAttr("required");
            $("#insuranceBoxPIDiv").removeClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", true);
            $("#compPrice").prop("required", false);
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
        }
        else {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePI").removeAttr("required");
            $("#insuranceBoxPIDiv").addClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", true);
            $("#compPrice").prop("required", false);
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
        }
    }
    else { // ندارد
        if (insurerTypePI == 1) {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePI").removeAttr("required");
            $("#insuranceBoxPIDiv").removeClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", false);
            $("#compPrice").prop("required", true);
        }
        else if (insurerTypePI == 2) {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePI").removeAttr("required");
            $("#insuranceBoxPIDiv").removeClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", true);
            $("#compPrice").prop("required", false);
            $("#priceProfessionalCodePI").prop("required", false);
            $("#priceTechnicalCodePI").prop("required", false);
        }
        else {
            $("#priceProfessionalCodePIDiv").addClass("displaynone");
            $("#priceTechnicalCodePIDiv").addClass("displaynone");
            $("#priceAnesthesiaBasePIDiv").addClass("displaynone");
            $("#insuranceBoxPIDiv").addClass("displaynone");
            $("#compPriceDiv").removeClass("displaynone");
            $("#compPrice").prop("disabled", true);
            $("#compPrice").prop("required", false);
        }
    }
    $("#compPrice").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceAnesthesiaBasePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceTechnicalCodePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#priceProfessionalCodePI").val("").removeClass("parsley-error").parent().find("ul li").html("");
    $("#toNationalCodePI").val("");
    $("#fromNationalCodePI").val("");
    $("#toServiceIdPI").val("");
    $("#fromServiceIdPI").val("");
    $("#attributePI").val("0");

});

$("#perviewInsurerPrice").on("click", function () {

    var form = $('#insurerPriceForm').parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var resultSave = insurerPriceTempSave(true);

    if (resultSave.successfull) {
        if (resultSave.affectedRows == 0) {
            var msgResult = alertify.warning("موردی برای به روزرسانی وجود ندارد");
            msgResult.delay(alertify_delay);
            return
        }
        else {
            var msgResult = alertify.success(resultSave.statusMessage);
            msgResult.delay(alertify_delay);

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


    //if (resultSave == 0) {
    //    var msgResult = alertify.warning("موردی برای به روزرسانی وجود ندارد");
    //    msgResult.delay(alertify_delay);
    //    return
    //}

    disableEnableFildPI(true);

    $("#affectedRowsInsurer").text("0");
    $("#perviewInsurerPriceCounter").text(resultSave.affectedRows);
    $("#savePriceInsurer").prop("disabled", false);
    $("#enableFormPI").prop("disabled", false);
    $(".preview-box-btn-lable").blur();
    $("[tabindex = '47']").focus();

});

$("#insurerPI").on("change", function () {

    let insurerId = +$(this).val();

    if (insurerId != 0) {

        $("#insuranceBoxPI").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "insuranceBoxPI", true, `${insurerId}/2`);
    }
    else
        $("#insuranceBoxPI").attr("disabled", true).html("");
});

$("#hasNationalCodePI").on("change", function () {
    var code = $("#hasNationalCodePI").val();
    changePI(2, code);
});

$("#insuranceTransformServiceModal").on("hidden.bs.modal", function () {
    $("#firstTab").click();
    resetInsurerModal();
    $("#serviceOrItemInsurance").select2("focus");
    typeTransform = 1;

    pageName = "#tempbasicCalculationMethod";

});

$("#itemTypeId").on("change", function () {
    filllItemService();
});

$("#insurerTypeId").on("change", function () {
    filllItemService();
})

$("#medicalSubjectId").on("change", function () {
    filllItemService();
})

$("#operationTypeInsurance").on("change", function () {
    let operationTypeInsurance = +$(this).val()
    operatonTypeConfig(1, operationTypeInsurance)
})

$("#basicInsurerIdFrom").on("change", function () {

    let insurerId = +$(this).val();
    $("#basicItemId").empty();
    $("#basicCalculationMethodId").empty();
    $("#basicCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);
    $("#basicCalculationMethodResult").addClass("displaynone")
    $("#basicInsuranceBoxIdFrom").html(`<option value="0">انتخاب کنید</option>`);
    fillServiceCountCalculationMethodList(null, null, null, []);
    if (insurerId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsuranceBoxIdFrom", true, `${insurerId}/1`, false, 3);



});


$("#basicCalculationMethodId").on("change", function () {
    sharePerIds = [];
    let model = getValueFilterParamCalculationMethodId(1);

    if (checkValidationValueFilterParamCalculationMethod(model))
        getServiceCountCalculationMethodList(model);

    $("#basicItemId").empty();
    if (model.insurerId > 0 && model.insurerLineId > 0 && model.itemTypeId > 0 && model.insurerPriceCalculationMethodId > 0)
        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/getitemsinsurerprice`, "basicItemId", true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}/${model.insurerPriceCalculationMethodId}`, false);

    $(`#tempbasicCalculationMethod > tr#row_1`).focus();
});


$("#compCalculationMethodId").on("change", function () {
    sharePerIds = [];
    let model = getValueFilterParamCalculationMethodId(2);

    if (checkValidationValueFilterParamCalculationMethod(model))
        getServiceCountCalculationMethodList(model);

    $("#compItemId").empty();
    if (model.insurerId > 0 && model.insurerLineId > 0 && model.itemTypeId > 0 && model.insurerPriceCalculationMethodId > 0)
        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/getitemsinsurerprice`, "compItemId", true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}/${model.insurerPriceCalculationMethodId}`, false);

    $(`#tempcompCalculationMethod > tr#row_1`).focus();
});


$("#thirdCalculationMethodId").on("change", function () {
    sharePerIds = [];
    let model = getValueFilterParamCalculationMethodId(3);

    if (checkValidationValueParamCalculationMethod(model))
        getServiceCountCalculationMethodList(model);

    $("#thirdItemId").empty();
    if (model.insurerId > 0 && model.insurerLineId > 0 && model.itemTypeId > 0 && model.insurerPriceCalculationMethodId > 0)
        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/getitemsinsurerprice`, "thirdItemId", true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}/${model.insurerPriceCalculationMethodId}`, false);

    $(`#tempthirdCalculationMethod > tr#row_1`).focus();
});


$("#discountCalculationMethodId").on("change", function () {
    sharePerIds = [];
    let model = getValueFilterParamCalculationMethodId(4);

    if (checkValidationValueParamCalculationMethod(model))
        getServiceCountCalculationMethodList(model);

    $("#discountItemId").empty();
    if (model.insurerId > 0 && model.insurerLineId > 0 && model.itemTypeId > 0 && model.insurerPriceCalculationMethodId > 0)
        fill_select2(`${viewData_baseUrl_MC}/InsurerPriceLineApi/getitemsinsurerprice`, "discountItemId", true, `${model.insurerId}/${model.insurerLineId}/${model.itemTypeId}/${model.insurerPriceCalculationMethodId}`, false);


    $(`#tempdiscountCalculationMethod > tr#row_1`).focus();
});

$("#basicInsurerIdTo").on("change", function () {

    let insurerId = +$(this).val();

    $("#basicInsuranceBoxIdTo").html(`<option value="0">انتخاب کنید</option>`);

    if (insurerId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsuranceBoxIdTo", true, `${insurerId}/1`, false, 3);

    //serviceCountConfig(1, false)

});

$("#serviceOrItemInsurance").on("change", function () {

    let serviceOrItemInsurance = +$(this).val()

    $("#basicCalculationMethodId").empty();
    $("#basicCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);


    if (serviceOrItemInsurance !== 0)
        fillDropDownForm(1);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);


})

$("#basicInsuranceBoxIdFrom").on("change", function () {

    let basicInsuranceBoxIdFrom = +$(this).val()

    $("#basicCalculationMethodId").empty();
    $("#basicCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);

    if (basicInsuranceBoxIdFrom !== 0)
        fillDropDownForm(1);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#serviceOrItemCompInsurance").on("change", function () {

    let serviceOrItemCompInsurance = +$(this).val()
    let compInsuranceBoxIdFrom = +$("#compInsuranceBoxIdFrom").val()
    let compInsurerLineIdFrom = +$("#compInsurerLineIdFrom").val()
    $("#compCalculationMethodId").empty();
    $("#compCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);
    if (serviceOrItemCompInsurance !== 0 && compInsuranceBoxIdFrom != 0 && compInsurerLineIdFrom != 0)
        fillDropDownForm(2);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#operationTypeCompInsurance").on("change", function () {
    let operationTypeCompInsurance = +$(this).val()
    operatonTypeConfig(2, operationTypeCompInsurance)
})

$("#compInsuranceBoxIdFrom").on("change", function () {
    let insurerId = +$(this).val();
    $("#compItemId").empty();
    $("#compCalculationMethodId").empty();
    $("#compCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);
    $("#compInsurerLineIdFrom").html(`<option value="0">انتخاب کنید</option>`);
    fillServiceCountCalculationMethodList(null, null, null, []);
    if (insurerId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "compInsurerLineIdFrom", true, `${insurerId}/1`, false, 3);

});

$("#serviceOrItemThirdParty").on("change", function () {

    let serviceOrItemThirdParty = +$(this).val()
    let thirdPartyIdFrom = +$("#thirdPartyIdFrom").val()
    $("#thirdCalculationMethodId").empty();
    $("#thirdCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);

    if (serviceOrItemThirdParty > 0 && thirdPartyIdFrom > 0)
        fillDropDownForm(3);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#serviceOrItemDiscount").on("change", function () {

    let serviceOrItemDiscount = +$(this).val()
    let discountIdFrom = +$("#discountIdFrom").val()
    $("#discountCalculationMethodId").empty();
    $("#discountCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);

    if (serviceOrItemDiscount > 0 && discountIdFrom > 0)
        fillDropDownForm(4);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#compInsuranceBoxIdTo").on("change", function () {

    let insurerId = +$(this).val();

    $("#compInsurerLineIdTo").html(`<option value="0">انتخاب کنید</option>`);

    if (insurerId !== 0)
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "compInsurerLineIdTo", true, `${insurerId}/1`, false, 3);

});

$("#compInsurerLineIdFrom").on("change", function () {

    let compInsurerLineIdFrom = +$(this).val()

    if (compInsurerLineIdFrom !== 0)
        fillDropDownForm(2);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#operationTypeThirdParty").on("change", function () {
    let operationTypeThirdParty = +$(this).val()
    operatonTypeConfig(3, operationTypeThirdParty)
})

$("#thirdPartyIdFrom").on("change", function () {

    let thirdPartyIdFrom = +$(this).val()
    $("#thirdItemId").empty();
    $("#thirdCalculationMethodId").empty();
    $("#thirdCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);

    if (thirdPartyIdFrom !== 0)
        fillDropDownForm(3);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);
})

$("#operationTypeDiscount").on("change", function () {
    let operationTypeDiscount = +$(this).val()
    operatonTypeConfig(4, operationTypeDiscount)
})

$("#discountIdFrom").on("change", function () {

    let discountIdFrom = +$(this).val()
    $("#discountItemId").empty();
    $("#discountCalculationMethodId").empty();
    $("#discountCalculationMethodId").html(`<option value="0">انتخاب کنید</option>`);

    if (discountIdFrom !== 0)
        fillDropDownForm(4);
    else
        fillServiceCountCalculationMethodList(null, null, null, []);

})

$("#insurerPriceModal").on("hidden.bs.modal", function () {
    $("#medicalItemPrice_getPage .highlight").focus()
});


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
            getpagetable_url: `${viewData_baseUrl_MC}/InsurerPriceLineApi/insurerpricesendhistorygetpage`,
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

    var serviceId = $(`#medicalItemPrice_getPage  #parentPageTableBody tbody tr[data-medicalitempriceid=${id}]`).data("itemid")
    var serviceName = $(`#medicalItemPrice_getPage  #parentPageTableBody tbody tr[data-medicalitempriceid=${id}]`).data("item")
    //  $(".serviceCodeSendModal").text(serviceId)
    $(".serviceNameSendModal").text(serviceName)

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");


    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []

    }
    pagetable_formkeyvalue[1] = null;
    pagetable_formkeyvalue[2] = null;
    pagetable_formkeyvalue[3] = serviceId;
    pagetable_formkeyvalue[4] = 0;

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

function sendInsurerToCentral() {

    if (selectedId == 0 || selectedId == '') {
        alertify.warning("حداقل یک سطر را انتخاب کنید").delay(admission.delay);
        return
    }
    var selectedArr = $.unique(selectedId.split(','));
    selectedId = selectedArr.join(",");

    sendToCentral(selectedId);
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

function itemChange(elem) {
    d
    $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
        if ($(this).prop('checked') == true) {
            selectedId += $(`#sendtoCentral_pagetable  #parentPageTableBody tbody tr`).data("id") + ',';

        }
        else {
            selectedId = selectedId.replace($(`#sendtoCentral_pagetable  #parentPageTableBody tbody tr`).data("id") + ',', '')
        }
    })
}
function changeAll(elem) {
    
    if ($(elem).prop("checked") == true) {
        $(`#sendtoCentral_pagetable  .pagetablebody #row1`).find("input", "checkbox").each(function () {
            $(this).prop('checked', true);
            selectedId += $(`#sendtoCentral_pagetable  #parentPageTableBody tbody tr`).data("id") + ',';
        })
    }
    else {
        $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
            $(this).prop('checked', false);
            selectedId = '';
        })
    }
    
}
initInsurerPrice()

window.Parsley._validatorRegistry.validators.rangeidPI = undefined
window.Parsley.addValidator("rangeidPI", {
    validateString: function (value) {
        var from = +$("#fromServiceIdPI").val();
        var to = +$("#toServiceIdPI").val();
        var range = comparisonStartEnd(from, to);

        return !range;
    },
    messages: {
        en: 'محدوده شناسه خدمت اشتباه می باشد'
    }
});

window.Parsley._validatorRegistry.validators.maxminpercent = undefined
window.Parsley.addValidator("maxminpercent", {
    validateString: function (value) {
        var val = value.replace(/\//g, ".");
        if (+val > 0 && +val <= 100.00)
            return true;

        return false;
    },
    messages: {
        en: 'عدد باید بزرگتر از 0 و کوچکتر مساوی 100 باشد'
    }
});

window.Parsley._validatorRegistry.validators.nationalcoderangei = undefined
window.Parsley.addValidator("nationalcoderangei", {
    validateString: function (value) {
        var from = +$("#fromNationalCodePI").val();
        var to = +$("#toNationalCodePI").val();

        var range = comparisonStartEnd(from, to);

        return !range;
    },
    messages: {
        en: 'محدوده نمبر تذکره اشتباه می باشد'
    }
});

window.Parsley._validatorRegistry.validators.vildtionmodal = undefined
window.Parsley.addValidator("validationmodal", {
    validateString: value => {

        let fromInsurerId = 0;
        let toInsurerId = 0;
        let fromInsurerLineId = 0;
        let toInsurerLineId = 0;

        if (typeTransform == 1) {
            fromInsurerId = +$("#basicInsurerIdFrom").val();
            toInsurerId = +$("#basicInsurerIdTo").val();
            fromInsurerLineId = +$("#basicInsuranceBoxIdFrom").val();
            toInsurerLineId = +$("#basicInsuranceBoxIdTo").val();
        }
        else if (typeTransform == 2) {
            fromInsurerId = +$("#compInsuranceBoxIdFrom").val();
            toInsurerId = +$("#compInsuranceBoxIdTo").val();
            fromInsurerLineId = +$("#compInsurerLineIdFrom").val();
            toInsurerLineId = +$("#compInsurerLineIdTo").val();
        }

        else if (typeTransform == 3) {
            fromInsurerId = +$("#thirdPartyIdFrom").val();
            toInsurerId = +$("#thirdPartyIdTo").val();
            fromInsurerLineId = 0;
            toInsurerLineId = 0;
        }

        else if (typeTransform == 4) {
            fromInsurerId = +$("#discountIdFrom").val();
            toInsurerId = +$("#discountIdTo").val();

        }



        if (toInsurerId !== 0 && fromInsurerId !== 0 && fromInsurerId == toInsurerId && typeTransform >= 3)
            return false;

        if (toInsurerId !== 0 && fromInsurerId !== 0 && fromInsurerId == toInsurerId && typeTransform < 3)
            if (fromInsurerLineId !== 0 && toInsurerLineId !== 0 && fromInsurerLineId == toInsurerLineId)
                return false;
        return true;
    },
    messages: {
        en: 'بیمه های مبدا و مقصد نمی تواند یک مقدار داشته باشد'
    }

});