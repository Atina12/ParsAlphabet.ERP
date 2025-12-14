
var viewData_controllername = "InsurerPriceLineApi";
var saveFilters = { itemTypeId: null, insurerTypeId: null }
var firstFillSelect2Rows = false
var beginPrice = 0
var endPrice = 0
var pricingModelId = 0
var viewData_sendcentral_url = `${viewData_baseUrl_MC}/${viewData_controllername}/sendcentralinsurerprice`;

var pgt_insurerPriceLine = {
    pagetable_id: "insurerPriceLine_pagetable",
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
    getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
}
arr_pagetables.push(pgt_insurerPriceLine);

$("#insurerPriceLineModal").on("hidden.bs.modal", async function () {
    saveFilters = {
        itemTypeId: null,
        insurerTypeId: null,
    }

    $("#medicalItemPrice_getPage .highlight").focus()
});

function showInsurerPriceLineApi(medicalItemPriceId, rowNo, elm, e) {
    
    $("#insurerPriceLineCsv").empty()

    let pagetable_id = "insurerPriceLine_pagetable";
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let itemTypeId = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("itemtypeid")
    let itemType = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("itemtype")
    let item = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("item")
    let insurerTypeId = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("insurertypeid")
    let insurerType = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("insurertype")
    let pricingModeName = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("pricingmodename")

    beginPrice = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("beginprice")
    endPrice = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("endprice")
    pricingModelId = $(`#medicalItemPrice_getPage tbody #row${rowNo}`).data("pricingmodelid")

    $("#insurerPriceLineCsv").html(`<button id="csvModal" onclick="csvModal(${medicalItemPriceId},${itemTypeId},${insurerTypeId})" type="button" class="btn btn-excel waves-effect"><i class="fa fa-file-excel ml-2"></i>اکسل</button>`)
    $(".insurerPriceIdModal").text(medicalItemPriceId)
    $(".insurerPriceItemTypeModal").text(itemType)
    $(".insurerPriceInsurerTypeModal").text(insurerType)
    $(".insurerItemModal").text(item)
    if (checkResponse(pricingModeName)) {
        $(".insurerPricePricingModeName").text(`مبنای تعرفه : ${pricingModeName}`)

        if (checkResponse(endPrice) && endPrice != 0)
            $(".insurerPricePricingModePrice").html(`(${transformNumbers.toComma(beginPrice)} - ${transformNumbers.toComma(endPrice)})`)
        else
            $(".insurerPricePricingModePrice").html(`(${transformNumbers.toComma(beginPrice)})`)
    }
    else {
        $(".insurerPricePricingModeName").text(`نرخ : `)
        $(".insurerPricePricingModePrice").html(`(${transformNumbers.toComma(beginPrice)})`)
    }

    saveFilters = {
        itemTypeId: itemTypeId,
        insurerTypeId: insurerTypeId,
    }

    pagetable_formkeyvalue = [itemTypeId, insurerTypeId, medicalItemPriceId];

    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].lastpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

    get_NewPageTableV1(pagetable_id, false, () => callbackAfterFilterV1(pagetable_id, true))

}

function callbackAfterFilterV1(pg_id, firstRun = false) {

    if (pg_id == "insurerPriceLine_pagetable" && firstRun)
        modal_show("insurerPriceLineModal")
}

function configSelect2_trEditing(pg_name, rowno, enableConfig = false) {
    $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td[data-select2='true']`).each(function () {
        if ($(`#${pg_name} #${$(this).attr("id")} div`).first().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).first().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).first().addClass("displaynone");

        if ($(`#${pg_name} #${$(this).attr("id")} div`).last().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).last().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).last().addClass("displaynone");

    })
    if (enableConfig) {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var columns = arr_pagetables[index].columns;
        $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td`).find("select.select2").each(function () {

            var elemId = $(this).attr("id");
            var colId = elemId.split("_")[0];
            var column = columns.filter(a => a.id == colId)[0];
            var getInputSelectConfig = column.getInputSelectConfig;
            if (getInputSelectConfig != null && column.isSelect2) {
                var params = "";
                var parameterItems = getInputSelectConfig.parameters;
                if (parameterItems != null && parameterItems.length > 0) {
                    for (var i = 0; i < parameterItems.length; i++) {
                        var paramItem = parameterItems[i].id;
                        if (parameterItems[i].inlineType)
                            params += $(`#${pg_name} #${paramItem}_${rowno}`).val();
                        else
                            params += $(`#${paramItem}`).val();

                        if (i < parameterItems.length - 1)
                            params += "/";
                    }
                }
                var val = +$(`#${pg_name} #${elemId}`).data("value");
                $(`#${pg_name} #${elemId}`).empty();

                if (column.pleaseChoose)
                    $(`#${pg_name} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                    fill_select2(getInputSelectConfig.fillUrl, `${pg_name} #${elemId}`, true, params, false, 0, '', function () {
                        firstFillSelect2Rows = true
                        $(`#${pg_name} #${elemId}`).val(val).trigger("change");
                    });
                }
            }
            else {
                var val = +$(`#${pg_name} #${$(this).attr("id")}`).data("value");
                $(`#${pg_name} #${elemId}`).select2();
                firstFillSelect2Rows = true
                $(`#${pg_name} #${elemId}`).val(val).trigger("change");
            }
        });
    }

    if (typeof after_configSelect2_trEditing != "undefined")
        after_configSelect2_trEditing();

}

function tr_object_onchange(pg_name, selectObject, rowno, colno) {

    if (pg_name == "insurerPriceLine_pagetable") {

        //پایه و تکمیلی
        if (saveFilters.insurerTypeId == 1 || saveFilters.insurerTypeId == 2) {
            var priceElm1 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_5 > input`);
            var priceElm2 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_6 > input`);
        }
        //طرف قرارداد و تخفیف
        else {
            var priceElm1 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_4 > input`);
            var priceElm2 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_5 > input`);
        }

        if (selectObject.localName == "select") {
            if ($(selectObject).val() == "0") {
                priceElm1.val("").attr("readonly", "readonly")
                priceElm2.val("").attr("readonly", "readonly");
            }
            else {
                if (saveFilters.insurerTypeId == 1) {
                    if ($(selectObject).val() == "7" || $(selectObject).val() == "1") {

                        firstFillSelect2Rows == true ? priceElm1.attr("readonly", "readonly") : priceElm1.val("").attr("readonly", "readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                    else {
                        firstFillSelect2Rows == true ? priceElm1.removeAttr("readonly") : priceElm1.val("").removeAttr("readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                }
                else if (saveFilters.insurerTypeId == 2) {
                    if ($(selectObject).val() == "13" || $(selectObject).val() == "14" ||
                        $(selectObject).val() == "19" || $(selectObject).val() == "20") {

                        firstFillSelect2Rows == true ? priceElm1.attr("readonly", "readonly") : priceElm1.val("").attr("readonly", "readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                    else {
                        firstFillSelect2Rows == true ? priceElm1.removeAttr("readonly") : priceElm1.val("").removeAttr("readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly");
                    }
                }
                else if (saveFilters.insurerTypeId == 4) {
                    if ($(selectObject).val() == "15" || $(selectObject).val() == "16" || $(selectObject).val() == "11" ||
                        $(selectObject).val() == "5" || $(selectObject).val() == "21" || $(selectObject).val() == "22") {

                        firstFillSelect2Rows == true ? priceElm1.attr("readonly", "readonly") : priceElm1.val("").attr("readonly", "readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                    else {
                        firstFillSelect2Rows == true ? priceElm1.removeAttr("readonly") : priceElm1.val("").attr("readonly", "readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                }
                else if (saveFilters.insurerTypeId == 5) {
                    if ($(selectObject).val() == "12" || $(selectObject).val() == "17" || $(selectObject).val() == "18" ||
                        $(selectObject).val() == "6" || $(selectObject).val() == "23" || $(selectObject).val() == "24") {

                        firstFillSelect2Rows == true ? priceElm1.attr("readonly", "readonly") : priceElm1.val("").attr("readonly", "readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")
                    }
                    else {
                        firstFillSelect2Rows == true ? priceElm1.removeAttr("readonly") : priceElm1.val("").removeAttr("readonly")
                        firstFillSelect2Rows == true ? priceElm2.removeAttr("readonly") : priceElm2.val("").removeAttr("readonly")

                    }
                }
            }
        }

        firstFillSelect2Rows = false
    }
}

function tr_object_onblur(pg_name, selectObject, rowno, colno) {

    //if (pg_name == "insurerPriceLine_pagetable") {

    //    //پایه و تکمیلی
    //    if (saveFilters.insurerTypeId == 1 || saveFilters.insurerTypeId == 2) {
    //        var priceElm1 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_4 > input`);
    //        var priceElm2 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_5 > input`);
    //    }
    //    //طرف قرارداد و تخفیف
    //    else {
    //        var priceElm1 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_3 > input`);
    //        var priceElm2 = $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} > #col_${rowno}_4 > input`);
    //    }


    //    if (firstFillSelect2Rows) {

    //        if (selectObject.localName == "select") {
    //            if ($(selectObject).val() == "1" || $(selectObject).val() == "7") {
    //                priceElm1.attr("readonly", "readonly")
    //                priceElm2.removeAttr("readonly");
    //            }
    //        }

    //        firstFillSelect2Rows = false
    //        return
    //    }

    //    if (selectObject.localName == "select") {
    //        if ($(selectObject).val() == "0") {
    //            priceElm1.val("").attr("readonly", "readonly")
    //            priceElm2.val("").attr("readonly", "readonly");
    //        }
    //        else if ($(selectObject).val() == "1" || $(selectObject).val() == "7") {
    //            priceElm1.val("").attr("readonly", "readonly")
    //            priceElm2.val("").removeAttr("readonly");
    //        }
    //        else {
    //            priceElm1.val("").removeAttr("readonly")
    //            priceElm2.val("").removeAttr("readonly")
    //        }

    //    }

    //}

}

function tr_save_row(pg_name, keycode) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;


    let insurerpriceid = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerpriceid")
    let insurerId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerid")
    let insurerLineId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerlineid")
    let medicalItemPriceId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("medicalitempriceid")

    let insurerPriceCalculationMethodId = ""
    let insurerPrice = ""
    let insurerSharePer = ""

    if (saveFilters.insurerTypeId == 1 || saveFilters.insurerTypeId == 2) {
        insurerPriceCalculationMethodId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > div:eq(1) > select`).val()
        insurerPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).val().trim()
        insurerSharePer = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).val().trim()
    }
    else {
        insurerPriceCalculationMethodId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > div:eq(1) > select`).val()
        insurerPrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).val().trim()
        insurerSharePer = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).val().trim()
    }


    if (pagetable_id == "insurerPriceLine_pagetable") {

        let insurerPriceLine_model = {
            id: insurerpriceid,
            insurerId,
            insurerLineId: insurerLineId == 0 ? null : insurerLineId,
            medicalItemPriceId,
            insurerPriceCalculationMethodId,
            insurerPrice: +removeSep(insurerPrice),
            insurerSharePer: +removeSep(insurerSharePer),

        }

        //insert
        if (insurerPriceLine_model.id == 0) {
            saveInsurerPriceLine(pagetable_id, insurerPriceLine_model, pagetable_currentrow, keycode)
        }
        //insert update delete
        else {
            if (insurerPriceLine_model.insurerPriceCalculationMethodId == 0)
                deleteInsurerPriceLine(pagetable_id, insurerPriceLine_model.id, pagetable_currentrow, keycode)
            else
                saveInsurerPriceLine(pagetable_id, insurerPriceLine_model, pagetable_currentrow, keycode)
        }
    }

}

function saveInsurerPriceLine(pagetable_id, model, pagetable_currentrow, keycode) {

    if (model.insurerPriceCalculationMethodId == 0) {
        after_save_row(pagetable_id, "cancel", keycode, false);
        return
    }

    //پایه 
    if (saveFilters.insurerTypeId == 1) {

        if (model.insurerPriceCalculationMethodId == "1" || model.insurerPriceCalculationMethodId == "7") {
            if (model.insurerSharePer == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer > 100) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
                msg.delay(alertify_delay);
                return
            }
        }
        else {

            if (model.insurerPrice == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                var msg = alertify.warning("تعرفه بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer > 100) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
                msg.delay(alertify_delay);
                return
            }
        }



        if (saveFilters.itemTypeId == 1) //کالا
        {
            //نوع محاسبه روش محاسبه بیمه اجباری
            if (model.insurerPriceCalculationMethodId == 2 || model.insurerPriceCalculationMethodId == 3) {
                if (pricingModelId == 1) //نرخ ثابت
                {
                    if (model.insurerPrice > beginPrice) {
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                        var msg = alertify.warning("تعرفه بیمه نمی تواند بزرگتر از تعرفه آیتم باشد");
                        msg.delay(alertify_delay);
                        return
                    }
                }
                else if (pricingModelId == 2) //نرخ محدوده
                {
                    if (model.insurerPrice > endPrice) {
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                        var msg = alertify.warning("تعرفه بیمه نمی تواند بزرگتر از تعرفه آیتم باشد");
                        msg.delay(alertify_delay);
                        return
                    }
                    else if (model.insurerPrice < beginPrice) {
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                        var msg = alertify.warning("تعرفه بیمه نمی تواند کمتر از تعرفه آیتم باشد");
                        msg.delay(alertify_delay);
                        return
                    }
                }
            }
        }
        else //خدمت
            //نوع محاسبه روش محاسبه هر دو
            if (model.insurerPriceCalculationMethodId == 8 || model.insurerPriceCalculationMethodId == 9) {
                //نرخ ثابت
                if (model.insurerPrice > beginPrice) {
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                    var msg = alertify.warning("تعرفه بیمه نمی تواند بزرگتر از تعرفه آیتم باشد");
                    msg.delay(alertify_delay);
                    return
                }
            }

    }
    //تکمیلی
    else if (saveFilters.insurerTypeId == 2) {
        if (model.insurerPriceCalculationMethodId == "13" || model.insurerPriceCalculationMethodId == "14" || model.insurerPriceCalculationMethodId == "19" || model.insurerPriceCalculationMethodId == "20") {

            if (model.insurerSharePer == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer > 100) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
                msg.delay(alertify_delay);
                return
            }
        }
        else {

            if (model.insurerPrice == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
                var msg = alertify.warning("تعرفه بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer == 0) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه را وارد کنید");
                msg.delay(alertify_delay);
                return
            }

            if (model.insurerSharePer > 100) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > input`).select();
                var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
                msg.delay(alertify_delay);
                return
            }
        }
    }
    //طرف قرارداد
    else if (saveFilters.insurerTypeId == 4) {
        //if (model.insurerPriceCalculationMethodId == "15" || model.insurerPriceCalculationMethodId == "16" || model.insurerPriceCalculationMethodId == "11" ||
        //    model.insurerPriceCalculationMethodId == "5" || model.insurerPriceCalculationMethodId == "21" || model.insurerPriceCalculationMethodId == "12") {

        if (model.insurerSharePer == 0) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
            var msg = alertify.warning("سهم بیمه را وارد کنید");
            msg.delay(alertify_delay);
            return
        }

        if (model.insurerSharePer > 100) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
            var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
            msg.delay(alertify_delay);
            return
        }
        //}
    }
    //تخفیف
    else if (saveFilters.insurerTypeId == 5) {
        //if (model.insurerPriceCalculationMethodId == "12" || model.insurerPriceCalculationMethodId == "17" || model.insurerPriceCalculationMethodId == "18" ||
        //    model.insurerPriceCalculationMethodId == "6" || model.insurerPriceCalculationMethodId == "23" || model.insurerPriceCalculationMethodId == "24") {

        if (model.insurerSharePer == 0) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
            var msg = alertify.warning("سهم بیمه را وارد کنید");
            msg.delay(alertify_delay);
            return
        }

        if (model.insurerSharePer > 100) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).select();
            var msg = alertify.warning("سهم بیمه نمی تواند بیشتر از 100 باشد");
            msg.delay(alertify_delay);
            return
        }
        //}
    }


    let viewData_save_url = model.id == 0 ? `${viewData_baseUrl_MC}/InsurerPriceLineApi/insert` : `${viewData_baseUrl_MC}/InsurerPriceLineApi/update`;

    $.ajax({
        url: viewData_save_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: async function (result) {
            
            if (result.successfull) {

                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerpriceid", +result.id)

                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                await getrecord(pagetable_id);
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
                    await getrecord(pagetable_id);
                    after_save_row(pagetable_id, "cancel", keycode, false);
                }
                else {
                    await getrecord(pagetable_id);
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

function deleteInsurerPriceLine(pagetable_id, id, pagetable_currentrow, keycode) {

    let viewData_delete_url = `${viewData_baseUrl_MC}/InsurerPriceLineApi/delete`;

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

                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("insurerpriceid", +result.id)

                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                setDefaultRowOnModal(pagetable_id, pagetable_currentrow)

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
                await getrecord(pagetable_id);

                after_save_row(pagetable_id, "cancel", keycode, false);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_delete_url);
            after_save_row(pagetable_id, "cancel", keycode, false);
        }
    });
}

function getrecord(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    let id = +$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow}`).data("insurerpriceid")

    if (pagetable_id == "insurerPriceLine_pagetable") {

        if (id == 0)
            setDefaultRowOnModal(pagetable_id, currentrow)
        else
            getrecordAjax(pagetable_id, currentrow, id)
    }

}

function getrecordAjax(pagetable_id, currentrow, id) {

    let url = `${viewData_baseUrl_MC}/InsurerPriceLineApi/getrecordbyid`;

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

    if (pagetable_id == "insurerPriceLine_pagetable") {
        if (result != null) {

            //طرف قرارداد و تخفیف
            if (saveFilters.insurerTypeId == 4 || saveFilters.insurerTypeId == 5) {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.id);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(0)`).text(result.insurerPriceCalculationMethodName);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(1) > select`).val(result.insurerPriceCalculationMethodId).trigger("change");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(1) > select`).data("value", result.insurerPriceCalculationMethodId.toString());
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val(checkResponse(result.insurerPrice) ? transformNumbers.toComma(result.insurerPrice) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val(checkResponse(result.insurerSharePer) ? transformNumbers.toComma(result.insurerSharePer) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_7`).text(`${result.createUserId} - ${result.createUserFullName}`);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_8`)
                    .html(`${result.createDateTimePersian.split(" ")[0]}<p class="mb-0 mt-neg-5">${result.createDateTimePersian.split(" ")[1]}</p>`);
            }
            //پایه و تکمیلی
            else {
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.id);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(0)`).text(result.insurerPriceCalculationMethodName);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(1) > select`).val(result.insurerPriceCalculationMethodId).trigger("change");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(1) > select`).data("value", result.insurerPriceCalculationMethodId.toString());
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val(checkResponse(result.insurerPrice) ? transformNumbers.toComma(result.insurerPrice) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 > input`).val(checkResponse(result.insurerSharePer) ? transformNumbers.toComma(result.insurerSharePer) : "");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_8`).text(`${result.createUserId} - ${result.createUserFullName}`);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_9`)
                    .html(`${result.createDateTimePersian.split(" ")[0]}<p class="mb-0 mt-neg-5">${result.createDateTimePersian.split(" ")[1]}</p>`);
            }
        }
        else
            setDefaultRowOnModal(pagetable_id, currentrow)
    }

}

function setDefaultRowOnModal(pagetable_id, currentrow) {

    if (pagetable_id == "insurerPriceLine_pagetable") {

        //طرف قرارداد و تخفیف
        if (saveFilters.insurerTypeId == 4 || saveFilters.insurerTypeId == 5) {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(0)`).text("-");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(1) > select`).val(0).trigger("change");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > div:eq(1) > select`).data("value", 0);
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_7`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_8`).html("");
        }
        //پایه و تکمیلی
        else {
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(0)`).text("-");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(1) > select`).val(0).trigger("change");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > div:eq(1) > select`).data("value", 0);
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 > input`).val("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_8`).text("");
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_9`).html("");
        }
    }

}

function csvModal(medicalItemPriceId, itemTypeId, insurerTypeId) {

    let csv_url = "api/MC/InsurerPriceLineApi/csv"
    let title = "صندوق بیمه"


    let csvModel = parameterInsurerPrice();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    csvModel.form_KeyValue = [itemTypeId, insurerTypeId, medicalItemPriceId]

    $.ajax({
        url: csv_url,
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
                window.URL.revokeObjectURL(csvModel);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

function parameterInsurerPrice() {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == "insurerPriceLine_pagetable");

    let parameters = {
        filters: arrSearchFilter[index].filters,
        form_KeyValue: "",
        fieldItem: "",
        fieldValue: "",
        sortModel: null
    }
    return parameters;
}
