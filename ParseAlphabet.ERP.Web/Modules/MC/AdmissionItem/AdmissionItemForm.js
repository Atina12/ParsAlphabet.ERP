var form = $('#patientForm').parsley(),
    arr_tempService = [], calPriceModel = {},
    viewData_modal_title = "سفارش کالا",
    viewData_controllername = "AdmissionItemApi",
    patientId = 0, sale_Identity = 0, sale_admissionMasterId = 0, stageAndWorkflow = {},
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}AdmissionSales.mrt`,
    errorCalPrice = { statusError: 0, messageError: "", itemId: false, itemPrice: false, salePriceModelActive: false, rangePrice: false, minQty: false, permissionDiscount: false, priceNotValid: false, exception: false },
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: sale_Identity, sqlDbType: 8, size: 0 },
    viewData_AdmissionCounter_getField = `${viewData_baseUrl_MC}/AdmissionCounterApi/counterinfo`,
    printUrlSale = "", isActivePatient = true, medicalSubjectId = 0, attributeIds = "", hasAttribute = false,
    userInfoLogin = "",
    admItemActionId = 0,
    admissionMasterActionId = 0,
    dropDownCacheData = {
        compInsurerId: null,
        compInsurerLineId: null,
        thirdPartyInsurerId: null,
        basicInsurerId: 0,
        basicInsurerLineId: 0,
        basicInsurerLineTerminologyCode: 0,
        basicInsurerLineName: "",
        discountInsurerId: null
    };

async function initAdmissionSaleForm(callback, admItmId) {
    $(".select2").select2();

    userInfoLogin = await getCashIdByUserId()

    loadDropDownsForm()

    if (userInfoLogin.counterTypeId != 3)
        $("#saveFormSaleAndPrint").css("display", "none")

    $("#birthDatePersian").inputmask({ "mask": "9999/99/99" })
    $("#referralTypeId").val(1).trigger("change")

    $('#basicInsurerLineId').val('1-73').trigger("change")
    $("#contractTypeId").val("").trigger("change")
    $("#genderId").prop("selectedIndex", 0).trigger("change")

    setTimeout(function () {
        $("#countryId").prop("selectedIndex", 0).trigger("change")

        if (admItmId !== 0 && !isNaN(admItmId))
            callback();
        else
            $("#referralTypeId").select2("focus")
    }, 100)
}

function loadDropDownsForm() {

    $(`#referralTypeId , #itemId , #countryId ,#educationLevelId, #discountInsurerId , #compInsurerId ,#basicInsurerLineId ,#searchPatientBasicInsurerLineId,#searchPatientCompInsurerThirdPartyId
       ,#searchPatientDiscountInsurerId`).empty()

    var newOption1 = new Option("انتخاب کنید", 0, true, true);

    $('#compInsurerId').append(newOption1);
    $('#discountInsurerId').append(newOption1);
    $('#searchPatientCompInsurerThirdPartyId').append(newOption1);
    $('#searchPatientBasicInsurerLineId').append(newOption1);
    $('#searchPatientDiscountInsurerId').append(newOption1);

    fill_select2("/api/AdmissionsApi/patientrefferaltype_getdropdown", "referralTypeId", true, 0, false, 3, "انتخاب", function () {
        $("#referralTypeId option[value=3]").remove()

        $("#referralTypeId").val($("select#referralTypeId option:first").val()).trigger("change");

    }, "", false, true, false, false);

    fill_select2(`${viewData_baseUrl_WH}/ItemApi/itemsaledropdown`, "itemId", true);

    fill_select2("/api/SetupApi/country_getdropdown", "countryId", true, 0, false);

    fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/educationlevel`, "educationLevelId", true);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "discountInsurerId", false, `${dropDownCache.discount}/1`);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "compInsurerId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/1`);

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientBasicInsurerLineId", false, `${dropDownCache.insurerLine}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true);
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientCompInsurerThirdPartyId", false, `${dropDownCache.compInsurerLineThirdParty}/0`, false, 3, "انتخاب", undefined, "", false, true, false, true, true, '/', 'text-info');
    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "searchPatientDiscountInsurerId", false, `${dropDownCache.discount}/0`);

}

function getItemCategoryAttribute(itemId) {
    $('#itemcategoryattribute').html('');

    var getItemCategoryUrl = `/api/WH/ItemApi/getItemCategoryId`;
    var categoryId = 0;
    $.ajax({
        url: getItemCategoryUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(itemId),
        async: false,
        success: function (result) {

            if (result != null) {
                categoryId = result;
                url = `/api/WH/ItemCategoryApi/getitemcategoryattribute/${categoryId}`;
                $.ajax({
                    url: url,
                    type: "get",
                    contentType: "application/json",
                    async: false,
                    success: function (result) {
                        hasAttribute = result;
                        if (!result) {
                            $("#itemcategoryattribute").attr("disabled", true);
                            $("#itemcategoryattribute").val("0").trigger("change");
                        }
                        else {
                            fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "itemcategoryattribute", true, categoryId, false, 3, "",
                                () => {
                                    if ($("#itemcategoryattribute").children().length == 0)
                                        $("#itemcategoryattribute").prop("disabled", true);
                                    else
                                        $("#itemcategoryattribute").prop("disabled", false);
                                });
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, url);
                    }
                });
            }
        },
        error: function (xhr) {
            error_handler(xhr, getItemCategoryUrl);
        }
    });
}

function checkInsurerTamin(basicInsurerId, referralTypeId) {

    let insurerId = ""

    if (basicInsurerId != 0 && basicInsurerId != null)
        insurerId = basicInsurerId
    else
        insurerId = null

    if (referralTypeId === 1) {
        if (insurerId === 8000)
            $("#nationalCode").attr("maxlength", "16");
        else
            $("#nationalCode").attr("maxlength", "10");
    }
    else
        $("#nationalCode").attr("maxlength", "13");
}

function isEditMode() {
    if ($("#admItemId").val() == "")
        return false;
    else
        return true;
}

function expandAdmission(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        $(item).nextAll(".slideToggle").removeClass("current");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }
}

function addTempItem() {
    var msg_s = alertify;
    var model = {};


    if (+$("#itemId").val() === 0) {
        $("#itemId").select2("focus");
        msg_s = alertify.warning(admissionSale.notHasItem);
        msg_s.delay(admissionSale.delay);
        return;
    }

    if (errorCalPrice.statusError != null && errorCalPrice.statusError != 0) {
        msg_s = alertify.warning(errorCalPrice.messageError);
        msg_s.delay(admissionSale.delay);
        $("#itemId").select2("focus")
        return;
    }

    if (calPriceModel.basicItemPrice == 0 && calPriceModel.basicPrice == 0 && calPriceModel.basicShareAmount == 0 && calPriceModel.compShareAmount == 0 && calPriceModel.netAmount <= 0) {
        msg_s = alertify.warning("این خدمت اجازه ثبت ندارد");
        msg_s.delay(admission.delay);
        $("#itemId").select2("focus")
        return;
    }

    if (+$("#qty").val() === 0) {
        msg_s = alertify.warning("تعداد را مشخص نمایید");
        msg_s.delay(admissionSale.delay);
        $("#qty").focus();
        return;
    }

    if (+removeSep($("#netAmount").val()) < 0) {
        msg_s = alertify.warning("مبالغ معتبر نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#qty").focus();
        return;
    }

    if (+$("#pricingModelId").val() === 1 && +removeSep($("#fixPrice").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (+$("#pricingModelId").val() === 2 && +removeSep($("#price").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (!isBetween(+removeSep($("#minPrice").val()), +removeSep($("#price").val()), +removeSep($("#maxPrice").val()))) {
        msg_s = alertify.error("نرخ در محدوده مجاز نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (errorCalPrice.minQty) {
        msg_s = alertify.error(errorCalPrice.messageError);
        msg_s.delay(admissionSale.delay);
        return;
    }

    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد، امکان افزودن کالا وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }

    if (calPriceModel == undefined || calPriceModel.netAmount < 0) {
        msg_s = alertify.warning("خالص دریافتی نمیتواند کوچکتر از صفر باشد");
        msg_s.delay(admission.delay);
        $("#itemId").select2("focus")
        return;
    }

    var referralTypeId = $("#referralTypeId").val();
    if ((+referralTypeId == 1 || +referralTypeId == 4) && ($("#nationalCode").val() === "" || $("#firstName").val() === "" || $("#lastName").val() === "" || $("#genderId").val() === "0")) {
        msg_s = alertify.warning("اطلاعات مراجعه کننده را کامل وارد نمایید");
        msg_s.delay(admission.delay);
        return;
    }

    model = {
        rowNumber: arr_tempService.length + 1,
        itemId: +$("#itemId").val(),
        itemName: $("#itemId").select2('data').length > 0 ? $("#itemId").select2('data')[0].text : "",
        attributeIds: $("#itemcategoryattribute").val(),
        qty: +$("#qty").val(),
        discountAmount: +calPriceModel.discountAmount,
        basicShareAmount: +calPriceModel.basicShareAmount,
        compShareAmount: +calPriceModel.compShareAmount,
        thirdPartyAmount: +calPriceModel.thirdPartyAmount,
        patientShareAmount: +calPriceModel.patientShareAmount,
        netAmount: +calPriceModel.netAmount,
        contractTypeId: calPriceModel.contractTypeId,
        priceTypeId: +calPriceModel.vendorCommissionType,
        vendorCommissionAmount: calPriceModel.vendorCommissionAmount,
        vendorId: +calPriceModel.vendorId === 0 ? null : calPriceModel.vendorId,
        basicPrice: +calPriceModel.basicPrice,
        basicItemPrice: +calPriceModel.basicItemPrice,
        basicPercentage: +calPriceModel.basicPercentage,
        basicCalculationMethodId: +calPriceModel.basicCalculationMethodId,
        compPrice: +calPriceModel.compPrice,
        compItemPrice: +calPriceModel.compItemPrice,
        compPercentage: +calPriceModel.compPercentage,
        compCalculationMethodId: +calPriceModel.compCalculationMethodId,
        thirdPartyPrice: +calPriceModel.thirdPartyPrice,
        thirdPartyItemPrice: +calPriceModel.thirdPartyItemPrice,
        thirdPartyPercentage: +calPriceModel.thirdPartyPercentage,
        thirdPartyCalculationMethodId: +calPriceModel.thirdPartyCalculationMethodId,
        discountPrice: +calPriceModel.discountPrice,
        discountItemPrice: +calPriceModel.discountItemPrice,
        discountPercentage: +calPriceModel.discountPercentage,
        discountCalculationMethodId: +calPriceModel.discountCalculationMethodId,
        vATPercentage: +calPriceModel.vatPercentage,
    };

    if (checkNotExistValueInArray(arr_tempService, "itemId", model.itemId)) {
        arr_tempService.push(model);
        appendItem(model);
        resetItem(true);
        $(`#itemId`).select2("focus");
        return;
    }
    else {
        msg_s = alertify.warning(admissionSale.hasItem);
        msg_s.delay(admission.delay);
        $(`#itemId`).select2("focus");
    }

}

function getPersobByBirthWS() {

    if (+$("#birthYear").val() == 0) {
        alertify.warning("سال تولد الزامي .").delay(alertify_delay);
        loadingAsyncAdmissionSale(false, "getPersobByBirthWS");
        $("#birthYear").focus();
        return;
    }
    if ($("#referralTypeId").val() != 2) {
        if ($("#nationalCode").val() == "") {
            alertify.warning("نمبر تذکره وارد نشده است").delay(alertify_delay);
            loadingAsyncAdmissionSale(false, "getPersobByBirthWS");
            $("#nationalCode").focus();
            return;
        }
    }
    let currentYear = moment().format("yyyy"),
        firstYear = moment.from("1300", 'fa', 'YYYY').format("yyyy"),
        valueYear = moment.from(+$("#birthYear").val(), 'fa', 'YYYY').format("yyyy");

    if (valueYear > currentYear || valueYear < firstYear) {
        alertify.warning("سال تولد باید کوچکتر مساوی سال  جاری و بزرگتر مساوی سال 1300  باشد").delay(alertify_delay);
        return;
    }

    if (+$("#countryId").val() == 101 && +$("#referralTypeId").val() == 1) {
        if (!isValidIranianNationalCode($("#nationalCode").val())) {
            var msgvalidNationalCode = alertify.warning("نمبر تذکره معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            return;
        }
    }
    else {
        if ($("#nationalCode").val().length > 13) {
            var msgvalidNationalCode = alertify.warning("کد اتباع معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            return;
        }
    }


    if (($("#referralTypeId").val() != 0 && $("#referralTypeId").val() != null) && ($("#nationalCode").val() === "" || $("#firstName").val() === "" || $("#lastName").val() === "" || $("#genderId").val() === "0")) {
        var msgvalidNationalCode = alertify.warning("اطلاعات مراجعه کننده را کامل وارد نمایید");
        msgvalidNationalCode.delay(alertify_delay);
        return;
    }
    $("#firstName").val("");
    $("#lastName").val("");
    $("#birthDatePersian").val("");
    $("#genderId").val("0").trigger("change");
    $("#getnationalCodeWS").prop("disabled", true);
    //loadingAsyncAdmissionSale(true, "getPersobByBirthWS");
    setTimeout(() => {
        getPersonByBirthWS($("#nationalCode").val(), +$("#birthYear").val());
        $("#getPersobByBirthWS").prop("disabled", true);
    }, 10);
}

async function loadingAsyncAdmissionSale(loading, elementId) {
    if (loading)
        $(`#${elementId} i`).removeClass("fa-users").addClass(`fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin").addClass(`fa-users`);
}

function appendItem(model) {

    if (model) {
        var emptyRow = $("#tempItem").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempItem").html("");
            $("#sumRowItem").addClass("displaynone");
        }

        var output = `<tr id="s_${model.itemId}">
                          <td>${model.rowNumber}</td>
                          <td>${model.itemName}</td>
                          <td class="money">${model.qty}</td>
                          <td class="money">${transformNumbers.toComma(model.basicItemPrice)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicItemPrice * model.qty)}</td>
                          <td class="money">${transformNumbers.toComma(model.basicShareAmount)}</td>
                          <td class="money">${model.compShareAmount > 0 ? transformNumbers.toComma(model.compShareAmount) : 0}</td>
                          <td class="money">${model.thirdPartyAmount > 0 ? transformNumbers.toComma(model.thirdPartyAmount) : 0}</td>
                          <td class="money">${model.discountAmount > 0 ? transformNumbers.toComma(model.discountAmount) : 0}</td>
                          <td class="money">${model.netAmount > 0 ? transformNumbers.toComma(model.netAmount) : 0}</td>
                          <td>
                              <button type="button" onclick="removeFromTempItem(${model.itemId})" class="btn maroon_outline"  data-toggle="tooltip" data-placement="bottom" data-original-title="حذف">
                                   <i class="fa fa-trash"></i>
                              </button>
                          </td>
                      </tr>`;

        getItemCategoryAttribute(model.itemId);
        $(`#tempItem`).append(output);
        var sumNetPriceTxt = transformNumbers.toComma(sumAdmissionLine());

        if (arr_tempService.length !== 0) {
            $(".sumNetPrice").text(sumNetPriceTxt);
            $("#sumRowItem").removeClass("displaynone");
        }
        else {
            $("#sumRowItem").addClass("displaynone");
            $(".sumNetPrice").text(sumNetPriceTxt);
        }


        $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);
        $("#referralTypeId").prop("disabled", arr_tempService.length > 0);
        $("#compInsurerId").prop("disabled", arr_tempService.length > 0);
        $("#nationalCode").prop("disabled", arr_tempService.length > 0);
        $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
        $("#birthYear").prop("disabled", arr_tempService.length > 0);
        $("#getPersobByBirthWS").prop("disabled", arr_tempService.length > 0);
        $("#searchPatient").prop("disabled", arr_tempService.length > 0);
        $("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
        $("#firstName").prop("disabled", arr_tempService.length > 0);
        $("#lastName").prop("disabled", arr_tempService.length > 0);
    }
}

function setHighlightTr(rowNumber) {
    $("#tempItem tr").removeClass("highlight");
    $(`#s_${rowNumber}`).addClass("highlight");
}

function sumAdmissionLine() {
    var lastPayAmount = 0;

    for (var i = 0; i < arr_tempService.length; i++) {
        var item = arr_tempService[i];
        lastPayAmount += +item.netAmount;
    }

    return lastPayAmount;
}

function itemCalPrice() {


    initialErrorCalPrice();

    if (+$("#itemId").val() == 0)
        return


    let viewData_calc_admissionSalePrice = `${viewData_baseUrl_MC}/${viewData_controllername}/calitemprice`
    let model = {
        itemId: +$("#itemId").val(),
        qty: +$("#qty").val(),
        price: +$("#pricingModelId").val() === 1 ? +removeSep($("#fixPrice").val()) : +removeSep($("#price").val()),
        basicInsurerId: dropDownCacheData.basicInsurerId == 0 ? null : dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId == 0 ? null : dropDownCacheData.basicInsurerLineId,
        compInsurerId: dropDownCacheData.compInsurerId == 0 ? null : dropDownCacheData.compInsurerId,
        compInsurerLineId: dropDownCacheData.compInsurerLineId == 0 ? null : dropDownCacheData.compInsurerLineId,
        thirdPartyId: dropDownCacheData.thirdPartyInsurerId == 0 ? null : dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: dropDownCacheData.discountInsurerId == 0 ? null : dropDownCacheData.discountInsurerId,
        medicalSubjectId: medicalSubjectId
    }


    if (+$("#itemId").val() != 0) {
        $.ajax({
            url: viewData_calc_admissionSalePrice,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            cache: false,
            async: false,
            success: function (result) {

                if (!checkResponse(result))
                    return

                var res = result;

                if (res.status === 100) {

                    calPriceModel = res;

                    $("#pricingModelName").val(res.pricingModelName);
                    $("#pricingModelId").val(res.pricingModelId);

                    displayPricingBox(res.pricingModelId, res.minPrice, res.maxPrice);

                    $("#contractTypeId").val(res.contractTypeId).trigger("change")
                    $("#unitItemName").val(res.unitName);
                    $("#categoryName").val(res.categoryName);
                    $("#netAmount").val(transformNumbers.toComma(res.netAmount));
                    $("#categoryName").val(res.categoryName);

                    if (res.contractTypeId == 1)
                        $("#vendorId").val(res.companyName)
                    else
                        $("#vendorId").val(`${res.vendorId} - ${res.vendorName}`)


                    $("#basicPrice").val(res.basicPrice > 0 ? transformNumbers.toComma(res.basicPrice) : 0);
                    $("#basicShareAmount").val(res.basicShareAmount > 0 ? transformNumbers.toComma(res.basicShareAmount) : 0);
                    $("#basicItemPrice").val(res.basicItemAmount > 0 ? transformNumbers.toComma(res.basicItemAmount) : 0);
                    $("#compShareAmount").val(res.compShareAmount > 0 ? transformNumbers.toComma(res.compShareAmount) : 0);
                    $("#thirdPartyAmount").val(res.thirdPartyAmount > 0 ? transformNumbers.toComma(res.thirdPartyAmount) : 0);
                    $("#discountAmount").val(res.discountAmount > 0 ? transformNumbers.toComma(res.discountAmount) : 0);
                    $("#patientShareAmount").val(res.patientShareAmount > 0 ? transformNumbers.toComma(res.patientShareAmount) : 0);

                }
                else {
                    $("#itemcategoryattribute").val(0).prop("disabled", true).trigger("change")
                    $("#qty").val(1)
                    displayPricingBox(1, "", "")
                    errorCalPrice.statusError = res.status;
                    errorCalPrice.messageError = res.statusMessage;
                    errorCalPrice.itemId = res.status == -101;
                    errorCalPrice.itemPrice = res.status == -102;
                    errorCalPrice.salePriceModelActive = res.status == -103;
                    errorCalPrice.rangePrice = res.status == -104;
                    errorCalPrice.minQty = res.status == -105;
                    errorCalPrice.permissionDiscount = res.status == -106;
                    errorCalPrice.priceNotValid = res.status == -107;
                    errorCalPrice.exception = res.status == -108;

                    var msgitem = alertify.warning(res.statusMessage);
                    msgitem.delay(res.status !== -105 ? alertify_delay : 7);
                    return res;
                }
                return res;
            },
            error: function (xhr) {
                error_handler(xhr, viewData_calc_admissionSalePrice);
                return {};
            }
        });
    }

}

function displayPricingBox(pricingModelId, minPrice, maxPrice) {

    if (pricingModelId === 1) {
        $("#pricingRangeBox").addClass("displaynone");
        $("#pricingFixBox").removeClass("displaynone");
        $("#minPrice").val("");
        $("#maxPrice").val("");
        $("#price").val("");
        $("#fixPrice").val(transformNumbers.toComma(minPrice));
    }
    else if (pricingModelId === 2) {
        $("#pricingRangeBox").removeClass("displaynone");
        $("#pricingFixBox").addClass("displaynone");
        $("#minPrice").val(minPrice > 0 ? transformNumbers.toComma(minPrice) : 0).removeClass("displaynone");
        $("#maxPrice").val(maxPrice > 0 ? transformNumbers.toComma(maxPrice) : 0).removeClass("displaynone");
        $("#fixPrice").val("");
    }
}

function changeDisplayform(id) {

    if (id !== 0) {
        var url = `${viewData_baseUrl_SM}/CustomerSalesPriceApi/getpricingmodel`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            cache: false,
            data: JSON.stringify(id),
            success: function (result) {
                if (result === 1) {
                    $("#pricingRangeBox").addClass("displaynone");
                    $("#pricingFixBox").removeClass("displaynone");
                }
                else {
                    $("#pricingRangeBox").removeClass("displaynone");
                    $("#pricingFixBox").addClass("displaynone");
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function removeFromTempItem(itemId) {

    for (var i = 0; i < arr_tempService.length; i++) {
        item = arr_tempService[i];
        if (item["itemId"] === itemId) {
            arr_tempService.splice(i, 1);
            $(`#s_${itemId}`).remove();
            break;
        }
    }

    if (arr_tempService.length === 0) {
        $("#sumRowItem").addClass("displaynone");
        $(".sumNetPrice").text("");
        $(`#tempItem`).html(emptyRowHTML);
        $("#itemId").val(0).trigger("change").select2("focus");
    }
    else {
        var vSumNetPrice = sumAdmissionLine();
        $("#sumRowItem").removeClass("displaynone");
        $(".sumNetPrice").text(transformNumbers.toComma(vSumNetPrice));
        rebuildRow(arr_tempService, "tempItem");
        $("#itemId").val(0).trigger("change").select2("focus");
    }

    $("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
    $("#compInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#discountInsurerId").prop("disabled", arr_tempService.length > 0);
    $("#basicInsurerLineId").prop("disabled", arr_tempService.length > 0);

    /*if (+$("#admItemId").val() == 0) {*/
    //$("#editSectionPatient").prop("disabled", arr_tempService.length > 0);
    //}
    //else
    //    $("#editSectionPatient").prop("disabled", true)

}

function resetItem(all) {

    $("#itemForm input.form-control").not("#qty").val("");
    $("#itemcategoryattribute").val("").prop("disabled", true).trigger("change");
    $("#contractTypeId").val("").trigger("change")

    if ($("#qty").val() == "")
        $("#qty").val("1");

    if (all)
        $("#itemForm .select2").val("").trigger("change");
}

function rebuildRow(arr, table) {

    if (arr.length === 0 || table === "")
        return;

    var arrLen = arr.length;

    for (var i = 0; i < arrLen; i++) {
        arr[i].rowNumber = i + 1;
        $(`#${table} tr`)[i].children[0].innerText = arr[i].rowNumber;
    }
}

function saveAdmissionSale(saveOrPrint = "saveFormSale") {

    if ($("#saveFormSale").attr("disabled") === "disabled" || $("#saveFormSaleAndPrint").attr("disabled") === "disabled")
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (arr_tempService.length === 0) {
        var msg = alertify.warning(admissionSale.notHasItem);
        msg.delay(admissionSale.delay);
        $("#saveFormSale").removeAttr("disabled");
        $("#saveFormSaleAndPrint").removeAttr("disabled");
        return;
    }

    if (+$("#admItemId").val() != 0) {
        if (+$("#admissionMasterId").val() == 0) {
            var msg_hid_srv = alertify.warning("سفارش کالا بدون شناسه پرونده می باشد");
            msg_hid_srv.delay(admission.delay);
            $("#saveForm").removeAttr("disabled");
            $("#saveFormAndPrint").removeAttr("disabled");
            return;
        }
    }


    $("#saveFormSale").prop("disabled", true);
    $("#saveFormSaleAndPrint").prop("disabled", true);

    if (isActivePatient == false) {
        msg_s = alertify.warning("وضعیت این نمبر تذکره غیر فعال می باشد ، امکان ذخیره وجود ندارد.");
        msg_s.delay(admission.delay);
        return;
    }


    var nationalCode = $("#nationalCode").val() === "0" ? null : $("#nationalCode").val();
    var mobileNo = $("#mobile").val() === "0" ? null : $("#mobile").val();
    let workflowId = 172

    var model_patient = {
        id: +$("#patientId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        genderId: +$("#genderId").val(),
        nationalCode: nationalCode,
        mobileNo: mobileNo,
        countryId: +$("#countryId").val(),
        address: $("#address").val(),
        idCardNumber: $("#idCardNumber").val(),
        postalCode: $("#postalCode").val(),
        jobTitle: $("#jobTitle").val(),
        phoneNo: $("#phoneNo").val(),
        maritalStatusId: +$("#maritalStatusId").val(),
        fatherFirstName: $("#fatherFirstName").val(),
        educationLevelId: +$("#educationLevelId").val()

    };

    var model_sale = {
        id: $("#admItemId").val() == "" ? 0 : $("#admItemId").val(),
        admissionMasterId: +$("#admissionMasterId").val(),
        admissionMasterWorkflowId: workflowId,
        admissionMasterStageId: admissionStage.admissionMasterOutPatient.id,
        actionId: +$("#admItemId").val() > 0 ? admItemActionId : 0,
        admissionMasterActionId: +$("#admissionMasterId").val() > 0 ? admissionMasterActionId : 0,
        stageId: admissionStage.admissionSaleItem.id,
        workflowId,
        basicInsurerId: dropDownCacheData.basicInsurerId == 0 ? null : dropDownCacheData.basicInsurerId,
        basicInsurerLineId: dropDownCacheData.basicInsurerLineId == 0 ? null : dropDownCacheData.basicInsurerLineId,
        compInsurerId: dropDownCacheData.compInsurerId == 0 ? null : dropDownCacheData.compInsurerId,
        compInsurerLineId: dropDownCacheData.compInsurerLineId == 0 ? null : dropDownCacheData.compInsurerLineId,
        thirdPartyInsurerId: dropDownCacheData.thirdPartyInsurerId == 0 ? null : dropDownCacheData.thirdPartyInsurerId,
        discountInsurerId: dropDownCacheData.discountInsurerId == 0 ? null : dropDownCacheData.discountInsurerId,
        referralTypeId: $("#referralTypeId").val(),
        medicalSubjectId: medicalSubjectId,
        admissionPatientJSON: model_patient,
        admissionItemLineList: arr_tempService
    };


    let viewData_save_SaleItem = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`

    $.ajax({
        url: viewData_save_SaleItem,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model_sale),
        async: false,
        success: function (result) {

            if (result.successfull === false) {
                $("#saveFormSale").prop("disabled", false);
                $("#saveFormSaleAndPrint").prop("disabled", false);

                if (result.validationErrors !== null) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
            }
            else if (result.data.status === 100) {
                var msg = alertify.success(admissionSale.insert_success);
                msg.delay(admission.delay);
                sale_Identity = result.data.id;
                sale_admissionMasterId = result.data.admissionMasterId;
                stageAndWorkflow = { workflowId: model_sale.workflowId, stageId: model_sale.stageId }
                if (!isEditMode()) {
                    if (userInfoLogin.counterTypeId === 3) {
                        if (sumAdmissionLine() > 0) {

                            if (saveOrPrint == "saveFormSale") {
                                navigation_item_click(`${viewData_addTreasury_page_url}/${result.data.admissionMasterId}/1`, viewData_addTreasury_form_title);
                            }
                            else if (saveOrPrint == "saveFormSaleAndPrint") {
                                printForm(model_sale.stageId, model_sale.workflowId);
                                //resetAdmissionSale();
                            }

                        } else {
                            if (saveOrPrint == "saveFormSale") {
                                navigation_item_click("/MC/AdmissionItem", viewData_modal_title);
                            }
                            else if (saveOrPrint == "saveFormSaleAndPrint") {
                                printForm(model_sale.stageId, model_sale.workflowId);
                                //resetAdmissionSale();
                            }

                        }
                    }
                    else if (userInfoLogin.counterTypeId === 1) {
                        if (saveOrPrint == "saveFormSale") {
                            navigation_item_click("/MC/AdmissionItem", viewData_modal_title);
                        }
                        else if (saveOrPrint == "saveFormSaleAndPrint")
                            printForm(model_sale.stageId, model_sale.workflowId);
                        return;
                    }
                }
                else {
                    if (saveOrPrint == "saveFormSale") {
                        navigation_item_click("/MC/AdmissionItem", viewData_modal_title);
                    }
                    else if (saveOrPrint == "saveFormSaleAndPrint")
                        printForm(model_sale.stageId, model_sale.workflowId);
                }

            }
            else if (result.data.status === -1) {

                var msg1 = alertify.error(result.data.message);
                msg1.delay(admission.delay);

                $("#saveFormSale").removeAttr("disabled");
                $("#saveFormSaleAndPrint").removeAttr("disabled");

            }
            else {

                $("#saveFormSale").removeAttr("disabled");
                $("#saveFormSaleAndPrint").removeAttr("disabled");

                var msg2 = alertify.error(admissionSale.insert_error);
                msg2.delay(admissionSale.delay);

                generateErrorValidation(result.validationErrors);

            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_SaleItem);
        }
    });
}

function resetAdmissionSale() {
    if (!$("#expandAdmissionSale i").hasClass("fa-plus"))
        $("#expandAdmissionSale").click();

    $("#searchPatient").prop("disabled", false)
    $("#tempItem").html(emptyRowHTML);
    $("#sumRowItem").addClass("displaynone");
    $(".sumNetPrice").text("").removeClass("sum-is-same");
    $("input.form-control").val("");


    loadDropDownsForm()
    $("#itemId").val("").trigger("change")
    //$(".select2").prop("selectedIndex", 0).trigger("change.select2");
    //$(".select2").not("#vendorId").removeAttr("disabled");

    arr_tempService = [];
    patientId = 0;
    $("#patientForm").removeAttr("disabled");
    $("#itemForm").removeAttr("disabled");
    $("#saveFormSale").removeAttr("disabled");
    $("#saveFormSaleAndPrint").removeAttr("disabled");

    $("#nationalCode").removeAttr("disabled")
    $("#birthYear").removeAttr("disabled")
    $("#firstName").removeAttr("disabled")
    $("#lastName").removeAttr("disabled")
    $("#genderId").removeAttr("disabled")
    $('#itemcategoryattribute').html('');
    $("#contractTypeId").prop("disabled", true)

    $("#basicInsurerLineId").removeAttr("disabled").prop("selectedIndex", 0).trigger("change")
    $("#referralTypeId").removeAttr("disabled")
    $("#compInsurerId").removeAttr("disabled")
    $("#discountInsurerId").removeAttr("disabled")
    $("#getPersobByBirthWS").removeAttr("disabled")




    $("#countryId").removeAttr("disabled")
    $("#mobile").removeAttr("disabled")
    $("#address").removeAttr("disabled")
    $("#idCardNumber").removeAttr("disabled")
    $("#postalCode").removeAttr("disabled")
    $("#jobTitle").removeAttr("disabled")
    $("#phoneNo").removeAttr("disabled")
    $("#maritalStatusId").removeAttr("disabled")
    $("#educationLevelId").removeAttr("disabled")
    $("#fatherFirstName").removeAttr("disabled")

    console.log("miad reset mishe")
    $("#admissionMasterId").val("").prop("disabled", true)
    $("#admBox").addClass("d-none")
    setTimeout(() => $("#nationalCode").focus(), 10);
}

function printAdmission(printname) {

    printUrlSale = `/Stimuls/MC/${printname}`;
    modal_close("printAdmissionItemModal");
}

function adm_print(sale_Identity, sale_admissionMasterId, printurl) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if (printurl.indexOf("Prn_AdmissionStand") != -1) {
        viewData_print_model.sqlDbType = 22;
        viewData_print_model.item = "@AdmissionMasterId";
        viewData_print_model.value = `${sale_admissionMasterId}`

    }
    else {
        if (printurl.indexOf("Prn_AdmissionSales") != -1) {
            contentPrintAdmissionSale(sale_Identity);
            return;
        }
        viewData_print_model.value = sale_Identity;
    }

    viewData_print_model.url = printurl;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_print_model),
        async: false,
        cache: false,
        success: function (result) {

            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url);
        }
    });
}

function saleItem_print(itmId) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_print_model.value = itmId;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_print_model),
        async: false,
        cache: false,
        success: function (result) {
            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url)
        }
    });
}

function initialErrorCalPrice() {
    errorCalPrice.statusError = 0;
    errorCalPrice.messageError = "";
    errorCalPrice.itemId = false;
    errorCalPrice.itemPrice = false;
    errorCalPrice.salePriceModelActive = false;
    errorCalPrice.rangePrice = false;
    errorCalPrice.minQty = false;
    errorCalPrice.permissionDiscount = false;
    errorCalPrice.priceNotValid = false;
    errorCalPrice.exception = false;
}

function setPatientInfo(id, firstName, lastName, genderId, mobileNo, nationalCode, countryId, birthDatePersian,
    address, idCardNumber, postalCode, jobTitle, phoneNo, maritalStatusid, fatherFirstName, educationLevelId,
    referralTypeId, basicInsurerLineId, compInsurerLineId, compInsurerId, thirdPartyInsurerId, discountInsurerId) {
    patientId = id;
    $("#patientForm input:not(#admissionMasterId)").val("")
    $("#patientId").val(id);
    $("#firstName").val(firstName);
    $("#lastName").val(lastName);
    $("#genderId").val(genderId).trigger("change");
    $("#mobile").val(mobileNo);
    $("#birthDatePersian").val(birthDatePersian);
    $("#nationalCode").val(nationalCode);
    $("#address").val(address);
    $("#idCardNumber").val(idCardNumber);
    $("#postalCode").val(postalCode);
    $("#jobTitle").val(jobTitle);
    $("#phoneNo").val(phoneNo);
    $("#maritalStatusId").val(maritalStatusid).trigger("change");
    $("#fatherFirstName").val(fatherFirstName);
    $("#educationLevelId").val(educationLevelId).trigger("change");
    $("#countryId").val(countryId).trigger("change");
    $("#referralTypeId").val(referralTypeId).trigger("change");

    $("#basicInsurerLineId").val(`1-${basicInsurerLineId}`).trigger("change");

    if (compInsurerLineId != 0)
        $("#compInsurerId").val(`2-${compInsurerLineId}-${compInsurerId}`).trigger("change");
    else if (thirdPartyInsurerId != 0)
        $("#compInsurerId").val(`4-${thirdPartyInsurerId}`).trigger("change");
    else
        $("#compInsurerId").val(0).trigger("change");

    if (discountInsurerId != 0)
        $("#discountInsurerId").val(`5-${discountInsurerId}`).trigger("change");
    else
        $("#discountInsurerId").val(0).trigger("change");

    modal_close("searchPatientModal");
}

async function getPersonByBirthWS(nationalCode, birthYear) {
    loadingAsyncAdmissionSale(true, "getPersobByBirthWS");
    var url = `${viewData_baseUrl_MC}/AdmissionApi/getpersonbybirth`
    let model = {
        nationalCode: nationalCode,
        birthYear: birthYear
    }

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {

                if (result.data.patientInfo === null) {
                    resetPatientInfo();
                    var alertPatientInfo = alertify.warning("اطلاعات مراجعه کننده موردنظر یافت نشد")
                    alertPatientInfo.delay(alertify_delay);
                    return;
                }

                var dataPatient = result.data.patientInfo;

                $("#patientId").prop("disabled", true);
                $("#nationalCode").prop("disabled", true);
                $("#firstName").val(dataPatient.firstName).prop("disabled", true);
                $("#lastName").val(dataPatient.lastName).prop("disabled", true);
                $("#birthDatePersian").val(dataPatient.birthDate).prop("disabled", true);
                $("#genderId").val(dataPatient.genderId).prop("disabled", true).trigger("change");
                $("#birthYear").val($("#birthYear").val()).prop("disabled", true);
                $("#editSectionPatient").prop("disabled", false);
                $("#searchPatient").prop("disabled", true)
                $("#countryId").select2("focus");


                loadingAsyncAdmissionSale(false, "getPersobByBirthWS");
            }
            else {
                resetPatientInfo();
                var alertPatientInfo1 = alertify.warning(result.statusMessage)
                alertPatientInfo1.delay(alertify_delay);
                $("#countryId").select2("focus");
                return;
            }
        },
        error: function (xhr) {
            loadingAsyncAdmissionSale(false, "getPersobByBirthWS");
            error_handler(xhr, url);
        }
    });
}

function resetPatientInfo() {

    loadingAsyncAdmissionSale(false, "getPersobByBirthWS");

    //if (+$("#admItemId").val() == 0) {
    $("#patientId").prop("disabled", true);
    $("#nationalCode").prop("disabled", false);
    $("#firstName").prop("disabled", false);
    $("#lastName").prop("disabled", false);
    $("#genderId").prop("disabled", false);
    $("#getPersobByBirthWS").prop("disabled", false);
    $("#birthYear").prop("disabled", false);
    $("#searchPatient").prop("disabled", false)
    $("#nationalCode").focus();
    $("#referralTypeId").removeAttr("disabled")
    $("#compInsurerId").removeAttr("disabled")
    $("#discountInsurerId").removeAttr("disabled")
    $("#getPersobByBirthWS").removeAttr("disabled")
    $("#editSectionPatient").prop("disabled", true);

    //}

}

function fillAdmissionItem(ad) {


    console.log(ad);

    admItemActionId = ad.actionId;
    admissionMasterActionId = ad.admissionMasterActionId;

    //admBox
    $("#searchPatient").prop("disabled", true)
    $("#admItemId").val(ad.id);
    $("#dateTime").val(ad.createDateTimePersian);
    $("#userFullName").val(ad.createUserFullName);
    $("#stageName").val(`${ad.stageId} - ${ad.stageName}`);
    $("#workflowName").val(`${ad.workflowId} - ${ad.workflowName}`);
    sale_Identity = ad.id;
    $("#admBox").removeClass("d-none");
    arr_tempService = [];
    // patient Box
    $("#patientId").val(ad.patientId);
    $("#admissionMasterId").val(ad.admissionMasterId);
    $("#nationalCode").val(ad.nationalCode).prop("disabled", true);
    $("#birthYear").prop("disabled", true);

    setTimeout(() => { $("#countryId").val(ad.countryId).trigger("change"); }, 10);// add

    $("#firstName").val(ad.firstName).prop("disabled", true);
    $("#lastName").val(ad.lastName).prop("disabled", true);

    $("#genderId").val(ad.genderId).trigger("change");
    $("#birthDatePersian").val(ad.patientBirthDate == null ? "" : ad.patientBirthDatePersian).prop("disabled", true);
    $("#mobile").val(ad.mobileNo)
    $("#address").val(ad.address)
    $("#idCardNumber").val(ad.idCardNumber)
    $("#postalCode").val(ad.postalCode)
    $("#jobTitle").val(ad.jobTitle)
    $("#phoneNo").val(ad.phoneNo)
    $("#maritalStatusId").val(ad.maritalStatusId).trigger("change")
    $("#educationLevelId").val(ad.educationLevelId).trigger("change")
    $("#referralTypeId").val(ad.referralTypeId).trigger("change");
    $("#fatherFirstName").val(ad.patientFatherFirstName)
    $("#getPersobByBirthWS").prop("disabled", true);
    $("#editSectionPatient").prop("disabled", true);

    if (ad.basicInsurerLineId !== 0) {
        let basicinsurerInfo = getInsurerInfo(0, ad.basicInsurerLineId, '', '');
        if (basicinsurerInfo.insurerTypeId == 1) {
            dropDownCacheData.basicInsurerId = basicinsurerInfo.insurerId
            dropDownCacheData.basicInsurerLineId = basicinsurerInfo.insurerLineId
            var isurerId = basicinsurerInfo.insurerTypeId + '-' + dropDownCacheData.basicInsurerLineId
            $("#basicInsurerLineId").val(isurerId).trigger("change");
        }

    }
    else {
        dropDownCacheData.basicInsurerId = 0
        dropDownCacheData.basicInsurerLineId = 0

    }

    if (ad.compInsurerLineId !== 0) {
        let compInsurerInfo = getInsurerInfo(0, ad.compInsurerLineId, '', '');
        dropDownCacheData.thirdPartyInsurerId = 0
        dropDownCacheData.compInsurerId = compInsurerInfo.insurerId
        dropDownCacheData.compInsurerLineId = compInsurerInfo.insurerLineId

        var compisurerId = compInsurerInfo.insurerTypeId + '-' + compInsurerInfo.insurerLineId + '-' + compInsurerInfo.insurerId
        $("#compInsurerId").val(compisurerId).trigger("change");
    }
    else {
        dropDownCacheData.compInsurerId = 0
        dropDownCacheData.compInsurerLineId = 0
    }

    if (ad.thirdPartyInsurerId != 0) {

        let thirdInsurerInfo = getInsurerInfo(ad.thirdPartyInsurerId, 0, '', '');
        dropDownCacheData.thirdPartyInsurerId = thirdInsurerInfo.insurerId
        dropDownCacheData.compInsurerId = 0
        dropDownCacheData.compInsurerLineId = 0

        var thirdPartyId = thirdInsurerInfo.insurerTypeId + '-' + thirdInsurerInfo.insurerId
        $("#compInsurerId").val(thirdPartyId).trigger("change");

    }
    else {
        dropDownCacheData.thirdPartyInsurerId = 0
    }

    if (ad.discountInsurerId !== 0) {
        let discountInfo = getInsurerInfo(ad.discountInsurerId, 0, '', '');
        dropDownCacheData.discountInsurerId = discountInfo.insurerId

        var discountId = discountInfo.insurerTypeId + '-' + discountInfo.insurerId
        $("#discountInsurerId").val(discountId).trigger("change");
    }
    else {
        dropDownCacheData.discountInsurerId = 0
    }
    //service Box

    if (ad.admissionLineList !== null)
        if (ad.admissionLineList.length > 0) {
            var modelServiceLine = null,
                admLineLen = ad.admissionLineList.length;

            for (var q = 0; q < admLineLen; q++) {

                var adsl = ad.admissionLineList[q];

                modelServiceLine = {
                    rowNumber: q + 1,
                    itemId: adsl.itemId,
                    itemName: adsl.itemId + "-" + adsl.itemName,
                    attributeIds: adsl.attributeIds,
                    qty: adsl.qty,
                    discountAmount: adsl.discountAmount,
                    basicShareAmount: adsl.basicShareAmount,
                    compShareAmount: adsl.compShareAmount,
                    thirdPartyAmount: adsl.thirdPartyAmount,
                    patientShareAmount: adsl.patientShareAmount,
                    netAmount: adsl.netAmount,
                    contractTypeId: adsl.contractTypeId,
                    priceTypeId: adsl.priceTypeId,
                    vendorCommissionAmount: adsl.vendorCommissionAmount,
                    vendorId: adsl.vendorId,
                    basicPrice: adsl.basicPrice,
                    basicItemPrice: adsl.basicItemPrice,
                    basicPercentage: adsl.basicPercentage,
                    basicCalculationMethodId: adsl.basicCalculationMethodId,
                    compPrice: adsl.compPrice,
                    compItemPrice: adsl.compItemPrice,
                    compPercentage: adsl.compPercentage,
                    compCalculationMethodId: adsl.compCalculationMethodId,
                    thirdPartyPrice: adsl.thirdPartyPrice,
                    thirdPartyItemPrice: adsl.thirdPartyItemPrice,
                    thirdPartyPercentage: adsl.thirdPartyPercentage,
                    thirdPartyCalculationMethodId: adsl.thirdPartyCalculationMethodId,
                    discountPrice: adsl.discountPrice,
                    discountItemPrice: adsl.discountItemPrice,
                    discountPercentage: adsl.discountPercentage,
                    discountCalculationMethodId: adsl.discountCalculationMethodId,
                    vATPercentage: adsl.vatPercentage,
                };

                arr_tempService.push(modelServiceLine);

                appendItem(modelServiceLine);
            }
        }
}

function getAdmissionItem() {

    var admissionItemId = +$("#admItemId").val();
    let viewData_get_admissionItem = `${viewData_baseUrl_MC}/${viewData_controllername}/display`

    $.ajax({
        url: viewData_get_admissionItem,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(admissionItemId),
        success: function (result) {
            if (result !== null)
                fillAdmissionItem(result);
            $("#itemId").select2("focus");

        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_admission);

        }
    });
}

function printForm(stageId, workflowId) {

    if (printUrlSale === "" || !printUrlSale.includes(".mrt")) {
        modal_show("printAdmissionItemModal");
    }
    else {
        adm_print(sale_Identity, sale_admissionMasterId, printUrlSale, stageId, workflowId);
        navigation_item_click("/MC/AdmissionItem", viewData_modal_title);
    }

    return;
}

function switchprintAdmissionItemModal(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printAdmission('Prn_AdmissionSales.mrt', 1)
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printAdmission('Prn_AdmissionStand.mrt', 1)
    }
}

function tabkeyDownAddress(e) {
    if ([KeyCode.Tab, KeyCode.Enter].includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        $("#itemId").select2("focus");
    }
}

function searchPatientModalReset() {
    $("#searchPatientFullName").val("")
    $("#searchPatientNationalCode").val("")
    $("#searchPatientMobileNo").val("")
    $("#searchPatientModal #tempPatient").html("<tr id='emptyRow'> <td colspan='10' class='text-center'>سطری وجود ندارد</td></tr>")
}

function searchPatient() {
    $("#tempPatient").html(fillEmptyRow(18));
    displayCountRowModal(0, "searchPatientModal");
    modal_show("searchPatientModal");
}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmissionSale("saveFormSale");
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        e.stopPropagation();
        searchPatient();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_w) {
        e.preventDefault();
        e.stopPropagation();
        $("#getPersobByBirthWS").click();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_n) {
        e.preventDefault();
        e.stopPropagation();
        $("#newFormSale").click();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_l) {
        e.preventDefault();
        e.stopPropagation();
        $("#list_sale").click();
    }
    else if (e.keyCode == KeyCode.F3) {
        e.preventDefault();
        searchPatient();

    }

}

$("#basicInsurerLineId").on("change", function () {

    let basicInsurerLineId = $(this).val()

    if (checkResponse(basicInsurerLineId) && basicInsurerLineId !== 0 && basicInsurerLineId !== '0') {
        insurerTypeId = +$(this).val().split("-")[0]
        basicInsurerLineId = +$(this).val().split("-")[1]

        if (basicInsurerLineId !== 0) {
            let insurerInfo = getInsurerInfo(0, basicInsurerLineId, '', '');

            if (insurerInfo.insurerTypeId == 1) {
                dropDownCacheData.basicInsurerId = insurerInfo.insurerId
                dropDownCacheData.basicInsurerLineId = insurerInfo.insurerLineId
                dropDownCacheData.basicInsurerLineCode = insurerInfo.insurerLineTerminologyCode
                dropDownCacheData.basicInsurerLineName = insurerInfo.insurerLineName
            }

        }
        else {
            dropDownCacheData.basicInsurerId = 0
            dropDownCacheData.basicInsurerLineId = 0
            dropDownCacheData.basicInsurerLineCode = 0
            dropDownCacheData.basicInsurerLineName = ""
        }

    }
    else {
        dropDownCacheData.basicInsurerId = 0
        dropDownCacheData.basicInsurerLineId = 0
        dropDownCacheData.basicInsurerLineCode = 0
        dropDownCacheData.basicInsurerLineName = ""
    }

    itemCalPrice();

});

$("#compInsurerId").on("change", function () {

    let compInsurerId = $(this).val()
    let compInsurerType = ""

    if (checkResponse(compInsurerId) && compInsurerId != 0 && compInsurerId != '0') {
        compInsurerType = compInsurerId.split("-")[0]
        compInsurerId = compInsurerId.split("-")[1]

        if (compInsurerType == 2) {
            if (compInsurerId !== 0) {
                let insurerInfo = getInsurerInfo(0, +compInsurerId, '', '');
                dropDownCacheData.thirdPartyInsurerId = 0
                dropDownCacheData.compInsurerId = insurerInfo.insurerId
                dropDownCacheData.compInsurerLineId = insurerInfo.insurerLineId

            }
        }
        else if (compInsurerType == 4) {
            if (compInsurerId !== 0) {

                let insurerInfo = getInsurerInfo(+compInsurerId, 0, '', '');

                dropDownCacheData.thirdPartyInsurerId = insurerInfo.insurerId
                dropDownCacheData.compInsurerId = 0
                dropDownCacheData.compInsurerLineId = 0
            }

        }
    }
    else {
        dropDownCacheData.compInsurerId = 0
        dropDownCacheData.compInsurerLineId = 0
        dropDownCacheData.thirdPartyInsurerId = 0
    }

    itemCalPrice();

});

$("#discountInsurerId").on("change", function () {

    let discountInsurerId = $(this).val()
    let discountInsurerType = ""

    if (checkResponse(discountInsurerId) && discountInsurerId != 0 && discountInsurerId != '0') {
        discountInsurerType = discountInsurerId.split("-")[0]
        discountInsurerId = discountInsurerId.split("-")[1]


        if (discountInsurerType == 5) {
            if (discountInsurerId !== 0) {
                let insurerInfo = getInsurerInfo(+discountInsurerId, 0, '', '');
                dropDownCacheData.discountInsurerId = insurerInfo.insurerId
            }
        }
    }
    else
        dropDownCacheData.discountInsurerId = 0;

    itemCalPrice();

})

$("#referralTypeId").on("change", function () {

    $("#basicInsurerLineId").prop("disabled", false);
    $("#nationalCode").prop("disabled", false);
    $("#compInsurerId").prop("disabled", false);

    let referralTyp = $(this).val()

    $("#basicInsurerLineId").html("")

    medicalSubjectId = referralTyp == 4 ? medicalSubject.inPersonIPDTariff.id : medicalSubject.inPersonTariff.id;

    fill_select2(`/api/MC/InsuranceApi/getinsurancelistbytype`, "basicInsurerLineId", false, `${dropDownCache.insurerLine}/${referralTyp}`)

    $("#getPersobByBirthWS").prop("disabled", false);
    $("#searchPatient").prop("disabled", false);

    checkInsurerTamin(dropDownCacheData.basicInsurerId, +$("#referralTypeId").val());

    if (referralTyp == 1) {
        $('#basicInsurerLineId').val('1-73').trigger("change")
        $("#birthYear").prop("disabled", false)
        $("#getPersobByBirthWS").prop("disabled", false)
        $("#compInsurerId").prop("disabled", false)
        $("#discountInsurerId").prop("disabled", false)
    }
    else if (referralTyp == 4) {
        $('#basicInsurerLineId').val('1-73').trigger("change")
        $("#birthYear").prop("disabled", false)
        $("#getPersobByBirthWS").prop("disabled", false)
        $("#compInsurerId").prop("disabled", false)
        $("#discountInsurerId").prop("disabled", false)
    }
    else if (referralTyp == 2) {
        $("#birthYear").val("").prop("disabled", true)
        $("#getPersobByBirthWS").prop("disabled", true)
        $('#basicInsurerLineId').val('1-73').prop("disabled", true).trigger("change")

        $("#nationalCode").val("").prop("disabled", true);
        $("#compInsurerId").val(0).prop("disabled", true).trigger("change");
        $("#discountInsurerId").val(0).prop("disabled", true).trigger("change");
    }
    else {
        $('#basicInsurerLineId').prop("selectedIndex", 0).trigger("change")
        $("#birthYear").prop("disabled", false)
        $("#getPersobByBirthWS").prop("disabled", false)
        $("#compInsurerId").prop("disabled", false)
        $("#discountInsurerId").prop("disabled", false)
    }

})

$("#getPersobByBirthWS").on("click", function (e) {


    setTimeout(() => {
        $("#getPersobByBirthWS").prop("disabled", false);
        getPersobByBirthWS($("#nationalCode").val(), +$("#birthYear").val());
    }, 10);

});

$("#printAdmissionItemModal").on("hidden.bs.modal", function (ev) {

    navigation_item_click("/MC/AdmissionItem", viewData_modal_title);

    if (printUrlSale !== "")
        adm_print(sale_Identity, sale_admissionMasterId, printUrlSale, stageAndWorkflow.stageId, stageAndWorkflow.workflowId,);
});

$("#itemId").on("change", function () {

    resetItem(false);
    $("#qty").val(1);
    var itemId = $(this).val();

    if (+itemId !== 0) {
        getItemCategoryAttribute(itemId);
        $("#qty").val(1);
        itemCalPrice();
    }
    else {
        $("#pricingRangeBox").addClass("displaynone");
        $("#pricingFixBox").removeClass("displaynone");
        $("#minPrice").val("");
        $("#maxPrice").val("");
        $("#price").val("");
        $("#fixPrice").val(0);
        $("#qty").val("");
    }

});

$("#qty").on({
    focus: function () { selectText($(this)); },
    input: function () {
        $("#itemForm input.form-control:not(#price,#qty)").val("");
        $("#contractTypeId").val("").trigger("change")
        $("#itemForm .select2:not(#itemId,#itemcategoryattribute)").val("").trigger("change");

        var qty = +$(this).val();
        if (qty > 100) {
            var qtyAlert = alertify.warning("حداکثر تعداد قابل قبول 100 عدد می باشد");
            qtyAlert.delay(admission.delay);
            return;
        }
    },
    blur: function () {
        let qty = +$(this).val();

        if (qty > 0 && qty <= 100) {
            if (checkResponse($("#itemId").val())) {
                itemCalPrice();
            }
            else {
                var qtyAlert = alertify.warning("کالا را وارد کنید");
                qtyAlert.delay(admission.delay);
                $("#itemId").select2("focus");
            }
        }
    }

})

$("#addItem").on("click", function () {
    addTempItem();
});

$("#searchPatientAdmission").on("click", function () {

    if (
        $("#searchPatientFullName").val().trim().length === 0 &&
        $("#searchPatientNationalCode").val().length === 0 &&
        $("#searchPatientMobileNo").val().length === 0 &&
        $("#searchPatientBasicInsurerNo").val().trim().length === 0 &&
        $("#searchPatientBasicInsurerLineId").val() == 0 &&
        $("#searchPatientCompInsurerThirdPartyId").val() == 0 &&
        $("#searchPatientDiscountInsurerId").val() == 0
    ) {
        $("#tempPatient").html(fillEmptyRow(18));
        displayCountRowModal(0, "searchPatientModal");
        return;
    }

    let basicInsurerLineId = $("#searchPatientBasicInsurerLineId").val() === null ? 0 : $("#searchPatientBasicInsurerLineId").val().split("-")[1]

    let compInsuranceThirdPartyType = $("#searchPatientCompInsurerThirdPartyId").val() !== null ? $("#searchPatientCompInsurerThirdPartyId").val().split("-")[0] : 0;
    let compInsurerLineId = 0
    let discountInsurerId = +$("#searchPatientDiscountInsurerId").val() != null ? 0 : $("#searchPatientDiscountInsurerId").val().split("-")[1];

    if (compInsuranceThirdPartyType == 2) {
        compInsurerLineId = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[1]
        thirdPartyInsurerId = 0
    }
    else if (compInsuranceThirdPartyType == 4) {
        thirdPartyInsurerId = $("#searchPatientCompInsurerThirdPartyId").val().split("-")[1]
        compInsurerLineId = 0
    }
    else {
        thirdPartyInsurerId = 0
        compInsurerLineId = 0
    }


    var patientSearchModel = {
        patientNationalCode: $("#searchPatientNationalCode").val(),
        patientFullName: $("#searchPatientFullName").val().trim(),
        mobileNo: $("#searchPatientMobileNo").val(),
        insurNo: $("#searchPatientBasicInsurerNo").val().trim(),// == "" ? null : $("#searchPatientBasicInsurerNo").val().trim(),
        insurerLineId: basicInsurerLineId,
        compInsurerLineId,
        thirdPartyInsurerId,
        discountInsurerId,
        includeUnknown: 0
    }

    patientSearch(patientSearchModel, true);
});

$("#printAdmissionItemModal").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchprintAdmissionItemModal(e)
});

$("#searchPatientModal").on("hidden.bs.modal", async function () {
    searchPatientModalReset()
    $("#itemId").select2("focus");
});

$("#searchPatientModal").on('shown.bs.modal', function () {
    $(`#searchPatientFullName`).focus();
});

$("#editSectionPatient").on("click", function () {
    resetPatientInfo();
    $(this).prop("disabled", true);
});

$("#price").on("blur", function () {

    if (+$("#pricingModelId").val() === 2 && +removeSep($("#price").val()) === 0) {
        msg_s = alertify.warning("نرخ کالا مشخص نشده");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (!isBetween(+removeSep($("#minPrice").val()), +removeSep($("#price").val()), +removeSep($("#maxPrice").val()))) {
        msg_s = alertify.error("نرخ در محدوده مجاز نمی باشد");
        msg_s.delay(admissionSale.delay);
        $("#price").focus();
        return;
    }

    if (+$("#qty").val() == 0) {
        var msg_qty_zero = alertify.warning("تعداد را وارد کنید");
        msg_qty_zero.delay(admission.delay);
        $("#qty").focus()
        return
    }

    if (+$("#qty").val() > 100) {
        var msg_qty_hundred = alertify.warning("تعداد حداکثر می تواند 100 عدد باشد");
        msg_qty_hundred.delay(admission.delay);
        $("#qty").focus()
        return
    }

    if (!$("#pricingRangeBox").hasClass("displaynone") && $("#price").val() != "")
        itemCalPrice();
});

$("#print_sale").on("click", function () {
    saleItem_print(sale_Identity);
});

$("#list_sale").on("click", function () {
    navigation_item_click("/MC/AdmissionItem", "لیست سفارش فروش");
});

$("#newFormSale").on("click", function () {
    alertify.confirm('', msg_confirm_new_page,
        function () {
            resetAdmissionSale();
        },
        function () {
            var msg = alertify.error('انصراف');
            msg.delay(admission.delay);
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
});

$("#saveFormSale").on("click", function () {
    saveAdmissionSale("saveFormSale");
});

$("#saveFormSaleAndPrint").on("click", function () {
    saveAdmissionSale("saveFormSaleAndPrint");
});

$("#nationalCode").on({
    blur: function () {

        var nCode = $(this).val();
        if (nCode == "") {
            $("#patientId").val("");
            $("#firstName").val("");
            $("#lastName").val("");
            $("#birthDatePersian").val("");
            $("#genderId").val("0").trigger("change");
            $("#countryId").val("101").trigger("change");
            $("#mobile").val("");
            return;
        }

        if (+$("#referralTypeId").val() == 1) {
            if (!isValidIranianNationalCode($("#nationalCode").val())) {
                $("#patientId").val("");
                $("#firstName").val("");
                $("#lastName").val("");
                $("#birthDatePersian").val("");
                $("#genderId").val("0").trigger("change");
                $("#countryId").val("101").trigger("change");
                $("#mobile").val("");
                var msgvalidNationalCode = alertify.warning("نمبر تذکره معتبر نمی باشد");
                msgvalidNationalCode.delay(alertify_delay);
                $("#nationalCode").removeAttr("disabled")
                return;
            }
        }
        else {
            if ($("#nationalCode").val().length != 13) {
                var msgvalidNationalCode = alertify.warning("کد اتباع معتبر نمی باشد");
                msgvalidNationalCode.delay(alertify_delay);
                $("#nationalCode").removeAttr("disabled")
                return;
            }
        }

        getPatientByNationalCode_adm(nCode, 1, (result) => {
            if (checkResponse(result)) {
                isActivePatient = result.isActive
                $("#patientId").val(result.id);
                $("#firstName").val(result.firstName);
                $("#lastName").val(result.lastName);
                $("#birthDatePersian").val(result.birthDatePersian);
                $("#genderId").val(result.genderId).trigger("change");
                $("#countryId").val(result.countryId == 0 ? 101 : result.countryId).trigger("change");
                $("#mobile").val(result.mobileNo);
                $("#address").val(result.address);
                $("#idCardNumber").val(result.idCardNumber);
                $("#postalCode").val(result.postalCode);
                $("#jobTitle").val(result.jobTitle);
                $("#phoneNo").val(result.phoneNo);
                $("#maritalStatusId").val(result.maritalStatusId).trigger("change");
                $("#educationLevelId").val(result.educationLevelId).trigger("change");
                $("#fatherFirstName").val(result.fatherFirstName);
            }
        });

    },
    input: function () {
        $("#patientId").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#countryId").val("101").trigger("change");
        $("#mobile").val("");
        $("#address").val("");
        $("#birthDatePersian").val("");
        $("#idCardNumber").val("");
        $("#postalCode").val("");
        $("#jobTitle").val("");
        $("#phoneNo").val("");
        $("#maritalStatusId").val(0).trigger("change");
        $("#educationLevelId").val(0).trigger("change");
        $("#fatherFirstName").val("");
    }
})

initAdmissionSaleForm(getAdmissionItem, +$("#admItemId").val());

