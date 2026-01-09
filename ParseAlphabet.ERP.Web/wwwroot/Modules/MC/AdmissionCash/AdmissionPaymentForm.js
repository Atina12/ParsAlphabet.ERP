var model_cashLine = {},
    arr_tempCash = [],
    arr_tempService = [], userIdCash,
    emptyRowHTML = fillEmptyRow(13),
    isSame_Sum_CallBack = undefined,
    exchangeStatus = 100,
    admissionCashDetail = {};

var defaultCurrency = 0;

function initAdmissionPayemntForm() {

    $("#detailAccountId").select2();

    $("#detailAccountId").prop("disabled", true);

    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false);

    defaultCurrency = getDefaultCurrency();
    $("#currencyId").val(defaultCurrency).trigger("change.select2");

}

function addTempCashAdm() {

    let admMasterId = $("#admissionMasterId").val()

    if (admMasterId == undefined)
        admMasterId = +$("#trs_2_1").data("admissionmasterid")


    var resultOpenCash = checkOpenCashReimbursement(admMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق امکان افزودن وجه نمی باشد").delay(admission.delay);
        return;
    }

    var msg_c = alertify;
    // اگر نوع پرداخت بود
    if (+$("#inOut").val() === 2) {

        // اگر وجه از محل کارت بود
        if (+$("#fundTypeId").val() === 2) {
            msg_c = alertify.warning(admission.inOutFromCardNotValid);
            msg_c.delay(admission.delay);
            $("#fundTypeId").select2("focus");
            return;
        }
    }

    if (+$("#fundTypeId").val() === 0) {
        msg_c = alertify.warning(admission.fundTypeError);
        msg_c.delay(admission.delay);
        $("#fundTypeId").select2("focus");
        return;
    }

    if (+$("#fundTypeId").val() === 1 && +$("#currencyId").val() !== defaultCurrency && +removeSep($("#exchangeRate").val()) == 0) {
        msg_c = alertify.warning("در حالت ارزی نرخ تسعیر ارز اجباریست");
        msg_c.delay(admission.delay);
        $("#exchangeRate").focus();
        return;
    }

    if (+$("#fundTypeId").val() === 0) {

        msg_c = alertify.warning(admission.notDefinedOpenAccType);
        msg_c.delay(admission.delay);
        $("#fundTypeId").select2("focus");
        return;

    }

    if (+$("#fundTypeId").val() !== 1 && +$("#fundTypeId").val() !== 2) {

        if (checkExistOpenAccTypeAdm(+$("#inOut").val(), +$("#fundTypeId").val(), +$("#detailAccountId").val())) {
            msg_c = alertify.warning(admission.hasOpenAccType);
            msg_c.delay(admission.delay);
            $("#fundTypeId").select2("focus");
            return;
        }
    }

    if (+$("#fundTypeId").val() === 13 && +$("#detailAccountId").val() === 0) {
        msg_c = alertify.warning("لطفا تفضیل را وارد کنید");
        msg_c.delay(admission.delay);
        setTimeout(function () {
            //$("#pagetable thead tr:eq(1) select#detailAccountId").select2("focus");
            $("#detailAccountId").select2("focus")
        }, 1);
        return;
    }

    if (+$("#fundTypeId").val() === 11 && +$("#detailAccountId").val() === 0) {
        msg_c = alertify.warning("لطفا تفضیل را وارد کنید");
        msg_c.delay(admission.delay);
        setTimeout(function () {
            //$("#pagetable thead tr:eq(1) select#detailAccountId").select2("focus");
            $("#detailAccountId").select2("focus")
        }, 1);
        return;
    }

    if ((+$("#fundTypeId").val() === 12 || +$("#fundTypeId").val() === 16 || +$("#fundTypeId").val() === 10) && +$("#detailAccountId").val() === 0) {
        msg_c = alertify.warning("لطفا تفضیل را وارد کنید");
        msg_c.delay(admission.delay);
        setTimeout(function () {
            $("#detailAccountId").select2("focus")
        }, 1);
        return;
    }

    var amnt = +removeSep($("#amount").val());

    if (amnt === 0) {
        msg_c = alertify.error(admission.payAmountError);
        msg_c.delay(admission.delay);

        if (+$("#currencyId").val() == defaultCurrency)
            newPayAmount();

        selectText($("#amount"));
        return;
    }


    var newAmount = +removeSep($("#amount").val()) * +removeSep($("#exchangeRate").val());

    $("#payAmount").val(transformNumbers.toComma(newAmount));

    var payAmount = +removeSep($("#payAmount").val());

    if (payAmount == 0) {
        msg_c = alertify.error(admission.payAmountError);
        msg_c.delay(admission.delay);
        newPayAmount();
        selectText($("#amount"));
        return;
    }

    var model = {
        headerId: 0,
        rowNumber: arr_tempCash.length + 1,
        inOut: +$("#inOut").val(),
        inOutName: +$("#inOut").val() !== 0 ? $("#inOut option:selected").html() : "",
        fundTypeId: +$("#fundTypeId").val(),
        fundTypeName: +$("#fundTypeId").val() !== 0 ? $("#fundTypeId option:selected").html() : "",
        currencyId: +$("#currencyId").val(),
        currencyName: +$("#currencyId").val() !== 0 ? $("#currencyId option:selected").html() : "",
        amount: payAmount,
        exchangeRate: +$("#currencyId").val() == getDefaultCurrency() ? 1 : +removeSep($("#exchangeRate").val()),
        accountNo: "",
        refNo: "",
        terminalNo: "",
        cardNo: "",
        detailAccountId: +$("#detailAccountId").val(),
        detailAccountName: +$("#detailAccountId").val() !== 0 ? $("#detailAccountId option:selected").html() : "",
        userId: 0,
        createDateTimePersian: $("#cashCreateDateTimePersian").val(),
        posId: +$("#posId").val(),
        posName: +$("#posId").val() !== 0 ? $("#posId option:selected").html() : "",
        payAmount: +removeSep($("#payAmount").val()),
        userFullName: $("#editCashForm #userFullName").val(),
        isAccess: true,
    };

    if (model.posId !== 0 && +model.fundTypeId == 2 && +model.inOut == 1) {
        $("#addCashAdm").prop("disabled", true);
        sendToPcPos(model);
    }
    else if (model.posId !== 0)
        alertify.warning("با توجه به نوع و وجه مقدار POS معتبر نمیباشد.").delay(alertify_delay);
    else {
        arr_tempCash.push(model);

        appendCashAdm(model);
        resetAfterAdd();
    }
}

async function appendCashAdm(model) {

    if (model) {

        var emptyRow = $("#tempCash").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempCash").html("");
            $("#sumRowCash").addClass("displaynone");
        }

        var inOutClass = "";

        if (model.inOut === 2)
            inOutClass = `class="highlight-danger"`;
        var actionColumn = fillActionColumn(model.isAccess, model.rowNumber, model.headerId);
        var output = `<tr ${inOutClass} id="c_${model.rowNumber}">
                          <td>${model.rowNumber}</td>
                          <td>${model.inOutName}</td>
                          <td>${model.fundTypeName}</td>
                          <td>${model.posId == 0 ? "" : `${model.posId} - ${model.posName}`}</td>
                          <td>${model.currencyName}</td>
                          <td>${model.detailAccountName}</td>
                          <td class="d-none">${model.cardNo}</td>
                          <td class="money">${model.inOut === 1 ? transformNumbers.toComma(model.amount) : `( ${transformNumbers.toComma(Math.abs(model.amount))} )`}</td>
                          <td class="money">${transformNumbers.toComma(model.exchangeRate)}</td>
                          <td class="money">${model.inOut === 1 ? transformNumbers.toComma(model.payAmount) : `( ${transformNumbers.toComma(model.payAmount)} )`}</td>
                           <td class="displaynone fullNameCash" >${model.userId} - ${model.userFullName}</td>
                           <td class="displaynone createDateCash">${model.createDateTimePersian}</td>
                          <td>${actionColumn}</td>
                      </tr>`;

        $(`#tempCash`).append(output);

        if (arr_tempCash !== null)
            if (arr_tempCash.length !== 0) {

                var sumCash = sumPayAmountCashAdm();

                if (sumCash >= 0)
                    $("#sumPayAmountCashAdm").text(transformNumbers.toComma(sumCash));
                else
                    $("#sumPayAmountCashAdm").text(`( ${transformNumbers.toComma(Math.abs(sumCash))} )`);

                $("#sumRowCash").removeClass("displaynone");
            }
            else {
                $("#sumRowCash").addClass("displaynone");
                $("#sumPayAmountCashAdm").text("");
            }

        await newPayAmount();
        isSame_sum();
    }
}

async function resetAfterAdd() {


    let sum_netprice = 0
    let sumRemain = 0
    let sum_cash = sumPayAmountCashAdm();

    sum_netprice = admissionCashDetail.admissionMasterRemain 

    if (!checkResponse($("#dispId").val()) || $("#dispId").val() == "")
        sumRemain = sum_netprice - sum_cash
    else
        sumRemain = sum_netprice - sum_cash + admissionCashDetail.sumCashAmount;

    $("#addCashAdm").prop("disabled", sumRemain == 0);

    if ($("#inOut").val() == 1)
        $("#fundTypeId").val("2").trigger("change");
    else
        $("#fundTypeId").val("1").trigger("change");

    $("#currencyId").val(1).trigger("change");
    $("#detailAccountId").val("").trigger("change").prop("disabled", true);


    setTimeout(function () {
        $("#inOut").select2("focus");
    }, 100);
}

function resetCash() {

    $("#detailAccountId").val("").trigger("change");

    setTimeout(function () {
        $("#fundTypeId").select2("focus");
    }, 100);
}

function getAdmissionMasterBalance(admissionMasterId) {

    let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getadmissionmasterbalance/${admissionMasterId}`

    var output = $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return output.responseJSON;
}

async function calcSumRemain(admMasterId) {
    let admissionMasterSumRemain = 0

    admissionMasterSumRemain = await getAdmissionMasterBalance(admMasterId);

    return admissionMasterSumRemain
}

async function newPayAmount() {

    let sumRemain = 0
    let remainAmount = 0
    let sumPayAmount = sumPayAmountCashAdm();

    if (checkResponse(admissionCashDetail.admissionMasterId))
        sumRemain = await calcSumRemain(admissionCashDetail.admissionMasterId)


    admissionCashDetail.admissionMasterRemain = sumRemain

    if (!checkResponse($("#dispId").val()) || $("#dispId").val() == "")
        remainAmount = sumRemain - sumPayAmount;
    else
        remainAmount = sumRemain - sumPayAmount + admissionCashDetail.sumCashAmount;


    $("#exchangeRate").val("1");
    $("#payAmount").val("");
    $("#currencyId").val(defaultCurrency).trigger("change");

    $("#amount").val(transformNumbers.toComma(Math.abs(remainAmount)));

    if (remainAmount < 0) {
        $("#admissionMasterBalanceTitle").text("مبلغ مانده بدهی به مراجعه کننده");
        $("#admissionMasterBalanceVal").text(`(${transformNumbers.toComma(Math.abs(remainAmount))})`);
        $("#admissionMasterBalanceVal").removeClass("highlight-success").addClass("highlight-danger")

        $("#amount").removeClass("highlight-success").addClass("highlight-danger")
        $("#inOut").val("2").trigger("change")
    }
    else if (remainAmount > 0) {
        $("#admissionMasterBalanceTitle").text("مبلغ مانده مطالبات از مراجعه کننده");
        $("#admissionMasterBalanceVal").text(transformNumbers.toComma(Math.abs(remainAmount)));
        $("#admissionMasterBalanceVal").removeClass("highlight-danger").addClass("highlight-success")

        $("#amount").removeClass("highlight-danger").addClass("highlight-success")
        $("#inOut").val("1").trigger("change")
    }
    else {
        $("#admissionMasterBalanceTitle").text("مبلغ مانده");
        $("#admissionMasterBalanceVal").text(0);
        $("#admissionMasterBalanceVal").removeClass("highlight-danger").removeClass("highlight-success")

        $("#amount").removeClass("highlight-danger").removeClass("highlight-success")
        $("#inOut").val("1").trigger("change")
    }
}

async function isSame_sum() {

    var sumRemain = 0
    let remainAmount = 0

    //if (checkResponse(admissionCashDetail.admissionMasterId))
    //    sumRemain = await calcSumRemain(admissionCashDetail.admissionMasterId);

    sumRemain = admissionCashDetail.admissionMasterRemain
    var sum_cash = sumPayAmountCashAdm();

    if (!checkResponse($("#dispId").val()) || $("#dispId").val() == "")
        remainAmount = sumRemain - sum_cash
    else
        remainAmount = sumRemain - sum_cash + admissionCashDetail.sumCashAmount;

   

    //if (sumRemain === 0 && sum_cash === 0)
    //    return;

    //if (sumRemain === sum_cash) {

   
    if (remainAmount == 0) {
        
        $("#sumNetPrice").addClass("sum-is-same");
        $("#sumPayAmountCashAdm").addClass("sum-is-same");

        $("#inOut").prop("disabled", true);
        $("#fundTypeId").attr("disabled", true);

        $("#currencyId").prop("disabled", true);
        $("#posId").prop("disabled", true);
        $("#amount").prop("disabled", true);
        $("#addCashAdm").prop("disabled", true);
        $("#c_1").attr("tabindex", "-1").focus();

        configFundType(+$("#fundTypeId").val());

        if (isSame_Sum_CallBack != undefined)
            isSame_Sum_CallBack(true);
    }
    else {
        $("#sumNetPrice").removeClass("sum-is-same");
        $("#sumPayAmountCashAdm").removeClass("sum-is-same");

        $("#inOut").removeAttr("disabled");
        $("#fundTypeId").removeAttr("disabled");
        $("#currencyId").removeAttr("disabled");
        $("#posId").removeAttr("disabled");

        $("#amount").removeAttr("disabled");
        $("#addCashAdm").removeAttr("disabled");

        configFundType(+$("#fundTypeId").val());

        setTimeout(function () {
            $("#inOut").select2("focus");
        }, 10);
        if (isSame_Sum_CallBack != undefined)
            isSame_Sum_CallBack(false);
    }

}

function sumPayAmountCashAdm() {

    var amountIn = 0, amountOut = 0;

    for (var i = 0; i < arr_tempCash.length; i++) {
        var item = arr_tempCash[i];

        if (item.inOut === 1)
            amountIn += +item.payAmount;
        else
            amountOut += +item.payAmount;
    }

    return amountIn - amountOut
}

function checkOpenCashReimbursement(id) {
    let result = $.ajax({
        url: `${viewData_baseUrl_MC}/AdmissionApi/opencash`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_MC}/AdmissionApi/opencash`);
            return null;
        }
    });
    return result.responseJSON;
}

async function removeFromTempCash(row, elm) {

    let admId = $("#admnId").val()

    if (admId == undefined)
        admId = +$("#trs_2_1").data("admissionmasterid")

    var resultOpenCash = checkOpenCashReimbursement(admId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق امکان حذف درخواست وجه نمی باشد").delay(admission.delay);
        return;
    }

    if (row !== null) {
        for (var i = 0; i < arr_tempCash.length; i++) {
            item = arr_tempCash[i];

            if (item["rowNumber"] === row) {
                arr_tempCash.splice(i, 1);
                $(`#c_${row}`).remove();
                break;
            }
        }


        if (arr_tempCash.length === 0) {
            $("#sumRowCash").addClass("displaynone");
            $("#sumPayAmountCashAdm").text("");

            $("#tempCash").html(emptyRowHTML);
            $("#amount").val(0);
        }
        else {
            $("#sumRowCash").removeClass("displaynone");

            var sumCash = sumPayAmountCashAdm();

            //$("#sumPayAmountCashAdm").text(transformNumbers.toComma(sumPayAmountCashAdm()));
            if (sumCash >= 0)
                $("#sumPayAmountCashAdm").text(transformNumbers.toComma(sumCash));
            else
                $("#sumPayAmountCashAdm").text(`( ${transformNumbers.toComma(Math.abs(sumCash))} )`);
        }

        if (arr_tempCash.length > 0)
            arr_tempCash = rebuildRowCash(arr_tempCash, "tempCash");

        await newPayAmount();
        isSame_sum();
    }
    else
        alertify.warning("امکان حذف وجود ندارد").delay(alertify_delay);

}

function rebuildRowCash(arr, table) {

    if (arr.length === 0 || table === "")
        return;

    var arrLen = arr.length;
    let lastTd = $("#tempCash tr:eq(0) td").length - 1;
    for (var j = 0; j < arrLen; j++) {
        var newRowNo = j + 1, isAccess = arr[j].isAccess;
        arr[j].rowNumber = newRowNo;
        $("#tempCash tr")[j].setAttribute("id", `c_${newRowNo}`);
        $("#tempCash tr")[j].children[0].innerText = arr[j].rowNumber;

        if ($("#tempCash tr")[j].children[lastTd].innerHTML !== "") {
            $("#tempCash tr")[j].children[lastTd].innerHTML = fillActionColumn(isAccess, arr[j].rowNumber, arr[j].headerId);
        }
    }

    return arr;
}

function fillActionColumn(isAccess, rowNumber, headerId) {
    var actionColumnDel = "", actionColumnInfo = "";
    let dispId = $("#dispId").val();

    if (isAccess)
        actionColumnDel = `<button  type = "button" onclick = "removeFromTempCash(${rowNumber},this)" class="btn maroon_outline "  data-toggle="tooltip" data-placement="bottom" data-original-title="حذف">
                                    <i class="fa fa-trash"></i>
                            </button>`;
    else
        actionColumnDel = `<i title="امکان حذف نمی باشد" class="maroon_outline fa fa-times  ml-2"></i>`;

    if (dispId != null && headerId > 0)
        actionColumnInfo = `<button type = "button" onclick = "infoTempCash(${rowNumber})" class="btn blue_outline_1"  data-toggle="tooltip" data-placement="bottom" data-original-title="اطلاعات">
                                    <i class="fa fa-info"></i>
                            </button>`;
    else
        actionColumnInfo = ``;

    return actionColumnDel + actionColumnInfo;
}

function checkExistOpenAccTypeAdm(inOut, fundType, detailAccountId) {

    var lenArrService = arr_tempCash.length;
    var existOpenAcc = false;
    for (var i = 0; i < lenArrService; i++) {
        var csha = arr_tempCash[i];
        if (csha.inOut === inOut && csha.fundTypeId === fundType && csha.detailAccountId === detailAccountId) {
            existOpenAcc = true;
            break;
        }
    }

    return existOpenAcc;
}

async function configFundType(id) {

    let fundTypeId = id
    let sum_netprice = 0
    let remainAmount = 0 

    //if (checkResponse(admissionCashDetail.admissionMasterId))
    //    sum_netprice = await calcSumRemain(admissionCashDetail.admissionMasterId);

    sum_netprice = admissionCashDetail.admissionMasterRemain
    let sum_cash = sumPayAmountCashAdm();

    if (!checkResponse($("#dispId").val()) || $("#dispId").val() == "")
        remainAmount = sum_netprice - sum_cash
    else
        remainAmount = sum_netprice - sum_cash + admissionCashDetail.sumCashAmount;

  

    //if (sum_netprice !== sum_cash) {

    if (remainAmount !== 0) {
        configFundTypeCondition(fundTypeId)
    }
    else {
        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").prop("disabled", true).val(0).trigger("change");
        $("#detailAccountId").val(0).trigger("change");
        $("#detailAccountId").prop("disabled", true);
        $("#addCashAdm").prop("disabled", true);
    }


}

function configFundTypeCondition(fundTypeId) {
    if (fundTypeId === 1) {
        $("#currencyId").prop("disabled", false);
        $("#posId").val(0).trigger("change").prop("disabled", true);
        $("#detailAccountId").val(0).trigger("change");
        $("#detailAccountId").prop("disabled", true);
    }
    else if (fundTypeId === 2) {
        $("#posId").prop("disabled", false);
        $("#currencyId").prop("disabled", true);
        fill_select2Image(`/api/MC/AdmissionCounterApi/admissioncounterposdropdown`, "posId");
        $("#currencyId").val(defaultCurrency).trigger("change");
        $("#detailAccountId").val(0).trigger("change");
        $("#detailAccountId").prop("disabled", true);
    }
    else if (fundTypeId === 13 || fundTypeId === 10) {
        $("#detailAccountId").html("")
        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "detailAccountId", true, 0, false, 3, "انتخاب پرسنل");
        $("#detailAccountId").prop("disabled", false);
        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").val(0).trigger("change").prop("disabled", true);
    }
    else if (fundTypeId === 16) {
        $("#detailAccountId").html("")
        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "detailAccountId", true, "1", true, 3, "انتخاب پرسنل");
        $("#detailAccountId").prop("disabled", false);
        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").val(0).trigger("change").prop("disabled", true);
    }
    else if (fundTypeId === 12 || fundTypeId === 11) {

        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").val(0).trigger("change").prop("disabled", true);

        if (arr_tempService.length > 0 && arr_tempService != null) {

            var currentAdmnMasterId = +admissionCashDetail.admissionMasterId;

            if (currentAdmnMasterId > 0) {
                $("#detailAccountId").html("");

                if (fundTypeId == 12)
                    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "detailAccountId", true, "1", false, 3, "انتخاب تفصیل");
                else
                    fill_detailAccount_by_admission_select2(`${viewData_baseUrl_MC}/AdmissionApi/getdetailaccountbyadmissionmasterid`, "detailAccountId", true,
                            `${currentAdmnMasterId}/${fundTypeId}`, false, 3, "انتخاب تفصیل");

                $("#detailAccountId").prop("disabled", false);
            }
        }
    }
    else if (fundTypeId == 9) {
        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").val(0).trigger("change").prop("disabled", true);
        $("#detailAccountId").val(0).trigger("change");
        $("#detailAccountId").prop("disabled", true);
    }
    else {
        $("#detailAccountId").prop("disabled", true).val(0).trigger("change");
        $("#currencyId").val(defaultCurrency).prop("disabled", true).trigger("change");
        $("#posId").val(0).trigger("change").prop("disabled", true);
    }
}

async function getCurrentExchangeRate(inOut, currencyId) {

    if (currencyId === 0)
        return;


    if (currencyId != defaultCurrency) {

        $("#amount").val("");

        $("#exchangeRate").val(1).prop("disabled", false);

    }
    else {

        $("#exchangeRate").val(1).prop("disabled", true);
        $("#addCashAdm").prop("disabled", false);

        let sumRemain = 0
        //if (checkResponse(admissionCashDetail.admissionMasterId))
        //    sumRemain = await calcSumRemain(admissionCashDetail.admissionMasterId);
        let newAmount = 0

        sumRemain = admissionCashDetail.admissionMasterRemain

        if (!checkResponse($("#dispId").val()) || $("#dispId").val() == "")
            newAmount = sumRemain - sumPayAmountCashAdm()
        else
            newAmount = sumRemain - sumPayAmountCashAdm() + admissionCashDetail.sumCashAmount;

        $("#addCashAdm").prop("disabled", newAmount == 0);

        $("#amount").val(transformNumbers.toComma(Math.abs(newAmount)));

        newAmount = +removeSep($("#amount").val()) * +removeSep($("#exchangeRate").val());
        $("#payAmount").val(transformNumbers.toComma(newAmount));

    }
}

function fill_detailAccount_by_admission_select2(p_url, elementid, idandtitle = false, param = 0, isAjax = false, p_minimumInputLength = 3, placeholder = " انتخاب ", callback = undefined, addUrl = "") {
    p_url = param == 0 ? p_url : `${p_url}/${param}`;
    var query = {};

    if (isAjax)
        $(`#${elementid}`).select2({
            placeholder: placeholder,
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            minimumInputLength: p_minimumInputLength,
            closeOnSelect: true,
            selectOnClose: true,
            allowClear: true,
            ajax: {
                delay: 500,
                url: p_url,
                async: false,
                type: "get",
                quietMillis: select2_delay,
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                                id: item.id
                            }
                        })
                    };

                    if ((callback !== void 0) && (typeof callback === "function"))
                        callback();
                }
            }
        });
    else {
        $.ajax({
            url: p_url,
            async: false,
            type: "get",

            success: function (result) {
                if (result) {
                    var data = result.map(function (item) {
                        return {
                            id: item.id, text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`
                        };
                    });
                    $(`#${elementid}`).select2({
                        templateResult: function (item) {
                            if (item.loading) {
                                return item.text;
                            }
                            var term = query.term || '';
                            var $result = markMatch(item.text, term);
                            return $result;
                        },
                        language: {
                            searching: function (params) {
                                query = params;
                                return 'در حال جستجو...';
                            }
                        },
                        placeholder: placeholder,
                        data: data,
                        closeOnSelect: true,
                        allowClear: true,
                        escapeMarkup: function (markup) {
                            return markup;
                        }
                    });

                    $(`#${elementid}`).val(0).trigger('change.select2');
                }
                if (callback != undefined)
                    callback();
            },
            error: function (xhr) {
                if (callback != undefined)
                    callback();
                error_handler(xhr, p_url);
            }
        });
    }

    if (addUrl !== "") {
        setTimeout(function () {
            $(`#${elementid}`).attr("qa-addurl", addUrl);
        }, 100);
    }
}

function fill_select2Image(p_url, elementid, param = 0, callback = undefined, initial = false, setDefault = true) {

    if (param !== 0)
        p_url = `${p_url}/${param}`;


    if (initial)
        $(`#${elementid}`).empty();

    $.ajax({
        url: p_url,
        async: false,
        type: "get",
        success: function (result) {
            if (result) {
                let data = result.map(function (item) {
                    return {
                        id: item.id, text: item.name, src: item.iconUrl
                    };
                });
                $(`#${elementid}`).select2({
                    templateResult: function (item) {
                        return $(`<div class="image"><img height="32" class="ml-1" src="${item.src ?? ""}"><span> ${item.text}</span></div>`);
                    },
                    placeholder: "انتخاب",
                    data: data,
                    allowClear: true,
                });

                if (setDefault)
                    $(`#${elementid}`).val(0).trigger('change.select2');
            }
        },
        error: function (xhr) {
            if (callback != undefined)
                callback();
            error_handler(xhr, p_url);
        }
    });

    if (callback != undefined)
        callback();

}

function infoTempCash(rowNo) {
    let dispId = $("#dispId").val();
    var model =
    {
        cashId: dispId,
        rowNumber: rowNo
    }

    let viewData_show_DetailCash = `${viewData_baseUrl_MC}/AdmissionCashApi/getdetailcash`

    $.ajax({
        url: viewData_show_DetailCash,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            if (result.length > 0) {

                modal_show(`detailAdmissionCash`);
                $("#detailCash").html("");
                let output = '';
                for (var i = 0; i < result.length; i++) {
                    var data = result[i];
                    let newAmount = +data.amount * (+data.exchangeRate > 0 ? +data.exchangeRate : 1);

                    output += `
                          <td>${data.headerId}</td>
                          <td>${data.rowNumber}</td>
                          <td>${data.inOut == 1 ? "1 - دریافت" : "2 - پرداخت"}</td>
                          <td>${(data.fundTypeId == 0 ? "" : data.fundTypeId)} - ${data.fundTypeName}</td>
                          <td>${data.posId == 0 ? "" : data.pos}</td>
                          <td>${(data.currencyId == 0 ? "" : data.currencyId)} - ${data.currencyName}</td>
               
                          <td>${data.detailAccountId == 0 ? "" : data.detailAccount}</td>
                          <td>${transformNumbers.toComma(data.amount)}</td>
                          <td>${transformNumbers.toComma(data.exchangeRate)}</td>
                          <td>${transformNumbers.toComma(newAmount)}</td>
                          <td>${data.accountNo == null ? "" : data.accountNo}</td>
                          <td>${data.refNo == null ? "" : data.refNo}</td>
                          <td>${data.cardNo == null ? "" : data.cardNo}</td>
                          <td>${data.terminalNo == null ? "" : data.terminalNo}</td>
                          <td>${data.createDateTimePersan == null ? "" : data.createDateTimePersan}</td>
                          <td>${data.userId} - ${data.userFullName}</td>
                     </tr>`;
                }
                $(output).appendTo("#detailCash");
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_show_DetailCash);
            return JSON.parse(-4);
        }
    });
}

function sendToPcPos(data) {

    $("#admissionCash caption").removeClass("d-none");
    let modelSend = {
        PosId: data.posId,
        PayerId: +$("#tempSelectedRequests tr #col_1_0").text(),
        Amount: data.amount
    }
    if (data.amount < 10_000) {
        alertify.error("حداقل مبلغ 10,000 می باشد").delay(alertify_delay);
        $("#addCashAdm").prop("disabled", false);
        $("#amount").focus();
        $("#admissionCash caption").addClass("d-none");
        return;
    }
    posPayment(modelSend).then(function (result) {
        handlerPos(result, data);
    })

}

async function posPayment(modelSend) {

    let viewData_payment_BehPadakht = posBaseUrl.behPardakht.payment

    let output = await $.ajax({
        url: viewData_payment_BehPadakht,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSend),
        cache: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_payment_BehPadakht);
            return null
        }
    });

    return output;
}

function handlerPos(result, model) {

    if (!result.successfull) {
        let error = generateErrorString(result.validationErrors);
        alertify.error(error).delay(alertify_delay);
        $("#addCashAdm").prop("disabled", false);
        $("#amount").focus();
        $("#admissionCash caption").addClass("d-none");
    }
    else {
        let returnCode = 0, reasonCode = 0,
            returnMessage = "", reasonMessage = "", data = result.data;

        returnCode = +data.returnCode;//100
        reasonCode = data.reasonCode == "" ? -1 : +data.reasonCode;//0

        returnMessage = returnCode + " - " + dataPcPos.returnCode[returnCode];
        reasonMessage = reasonCode == -1 ? "" : reasonCode + " - " + dataPcPos.reasonCode[reasonCode];


        if (returnCode == 100) {
            alertify.success(returnMessage).delay(alertify_delay);

            model.amount = +data.totalAmount;
            model.refNo = data.traceNumber;
            model.terminalNo = data.terminalNo;
            model.cardNo = "";
            model.createDateTimePersian = data.transactionDate + " " + data.transactionTime;
            model.accountNo = data.accountNo;

            arr_tempCash.push(model);

            appendCashAdm(model);
            resetAfterAdd();

            $("#addCashAdm").prop("disabled", false);
            $("#admissionCash caption").addClass("d-none");
        }
        else {
            let messages = reasonMessage !== "" ? [returnMessage, reasonMessage] : [returnMessage];
            let error = generateErrorString(messages);
            alertify.error(error).delay(alertify_delay);
            $("#addCashAdm").prop("disabled", false);
            $("#admissionCash caption").addClass("d-none");
            $("#amount").focus();
        }

    }

}

$("#inOut").on("change", function () {
  
    var getfundType = {
        saleTypeId: admissionCashDetail.admissionMedicalRevenue,
        inOut: +$(this).val(),
    };

    $("#fundTypeId").html("");

    if (getfundType.saleTypeId != 0)
        fillFundTypeAdm(getfundType, "fundTypeId")

    if (isPatientUndefined == true)
        $("#fundTypeId option[value=9]").remove()

    //if (admissionCashDetail.admissionTypeId == 1)
    //    $("#fundTypeId option[value=12]").remove();

    $("#detailAccountId").val("0").trigger("change")

    if (+$("#currencyId").val() != defaultCurrency)
        getCurrentExchangeRate(+$("#inOut").val(), +$("#currencyId").val())

    if (+$(this).val() == 1)
        $("#fundTypeId").val("2").trigger("change")
    else
        $("#fundTypeId").val("1").trigger("change")

});

$("#fundTypeId").on("change", function () {

    let fundTypeId = +$(this).val()

    configFundType(fundTypeId);

});

$("#amount")
    .on("focus", function () { selectText($(this)); })
    .on("blur", function () {
        var newAmount = +removeSep($("#amount").val()) * (+removeSep($("#exchangeRate").val()) > 0 ? +removeSep($("#exchangeRate").val()) : 1);
        $("#payAmount").val(transformNumbers.toComma(newAmount));
    });

$("#exchangeRate")
    .on("focus", function () { selectText($(this)); })
    .on("blur", function () {
        var newAmount = +removeSep($("#amount").val()) * +removeSep($("#exchangeRate").val());
        $("#payAmount").val(transformNumbers.toComma(newAmount));
    });

$("#currencyId").on("change", function () {
    getCurrentExchangeRate(+$("#inOut").val(), +$("#currencyId").val());
});

window.Parsley._validatorRegistry.validators.rqopenaccemp = undefined
window.Parsley.addValidator("rqopenaccemp", {
    validateString: function (value) {
        if (+value === 3)
            if (+$("#detailAccountId").val() === 0) {
                $("#detailAccountId").select2("focus");
                return false;
            }

        return true;
    },
    messages: {
        en: 'لطفا پرسنل را انتخاب نمایید'
    }
});

window.Parsley._validatorRegistry.validators.rqfundtypeopenacc = undefined
window.Parsley.addValidator("rqfundtypeopenacc", {
    validateString: function (value) {
        if (+value === 0) {
            //if (+$("#openAccTypeId").val() === 0) {
            $("#fundTypeId").select2("focus");
            return false;
        }

        return true;
    },
    messages: {
        en: 'نوع وجه را انتخاب کنید'
    }
});

initAdmissionPayemntForm()



