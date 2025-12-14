
var viewData_controllername = "AdmissionCashApi",
    admissionCashDetail = { rowNumber: 1, admissionTypeId: 0, admissionId: 0, admissionAmount: 0, admissionPatientId: 0, admissionSaleTypeId: 0 };



function getAdmissionCashRequests(id = null) {

    let viewData_upd_admissionCashRequest = `${viewData_baseUrl_MC}/${viewData_controllername}/admissioncashdisplay`

    $.ajax({
        url: viewData_upd_admissionCashRequest,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: async function (result) {
            if (result.successfull == true) {

                var requests = result.data.requests;
                $("#tempSelectedRequests").html("");


                if (requests != null) {
                    for (var i = 0; i < requests.length; i++) {
                        if (addToServiceArr(requests[i]) == true) {
                            addToGridService(requests[i], "tempSelectedRequests");
                        }
                    }
                    calcSumPriceUpd();
                    $("#sumRowRequest").removeClass("displaynone");
                }

                var payments = result.data.payments;
                if (payments != null) {
                    for (var i = 0; i < payments.length; i++) {
                        modelCashLine = {
                            headerId: id,
                            rowNumber: i + 1,
                            inOut: payments[i].inOut,
                            inOutName: payments[i].inOut === 1 ? "1 - دریافت" : "2 - پرداخت",
                            fundTypeId: payments[i].fundTypeId,
                            fundTypeName: `${payments[i].fundTypeId} - ${payments[i].fundTypeName}`,
                            currencyId: payments[i].currencyId,
                            currencyName: `${payments[i].currencyId} - ${payments[i].currencyName}`,
                            detailAccountId: payments[i].detailAccountId,
                            detailAccountName: payments[i].detailAccountId !== 0 ? `${payments[i].detailAccountId} - ${payments[i].detailAccountName}` : "",
                            cardNo: payments[i].cardNo,
                            refNo: payments[i].refNo,
                            amount: payments[i].amount,
                            posId: payments[i].posId,
                            posName: (payments[i].posName != null ? payments[i].posName : ""),
                            exchangeRate: payments[i].currencyId == getDefaultCurrency() ? 1 : payments[i].exchangeRate,
                            payAmount: payments[i].exchangeRate == 0 ? payments[i].amount : payments[i].amount * payments[i].exchangeRate,
                            userFullName: payments[i].userFullName,
                            createDateTimePersian: payments[i].createDateTimePersian,
                            userId: payments[i].userId
                        };

                        arr_tempCash.push(modelCashLine);

                        appendCashAdm(modelCashLine);

                        $("#tempCash .fullNameCash,#tempCash .createDateCash").removeClass("displaynone");

                    }
                }
            }
            else {
                var msgItem = alertify.warning(result.message);
                msgItem.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_search_admissionCashRequest);
        }
    });

}

function appendCashAdm(model) {

    if (model) {

        var emptyRow = $("#tempCash").find("#emptyRow");

        if (emptyRow.length !== 0) {
            $("#tempCash").html("");
            $("#sumRowCash").addClass("displaynone");
        }

        var inOutClass = "";

        if (model.inOut === 2)
            inOutClass = `class="highlight-danger"`;

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
                          <td class="fullNameCash" >${model.userId} - ${model.userFullName}</td>
                          <td class="createDateCash">${model.createDateTimePersian}</td>
                      </tr>`;

        $(`#tempCash`).append(output);

        if (arr_tempCash !== null)
            if (arr_tempCash.length !== 0) {

                var sumCash = sumPayAmountCashAdm();

                if (sumCash >= 0)
                    $("#sumPayAmountCashAdm").text(transformNumbers.toComma(sumCash));
                else
                    $("#sumPayAmountCashAdm").text(`(${transformNumbers.toComma(Math.abs(sumCash))})`);

                $("#sumRowCash").removeClass("displaynone");

                if ($("#sumNetPrice").text() == $("#sumPayAmountCashAdm").text()) {
                    $("#sumNetPrice").addClass("sum-is-same")
                    $("#sumPayAmountCashAdm").addClass("sum-is-same")
                } else {
                    $("#sumNetPrice").removeClass("sum-is-same")
                    $("#sumPayAmountCashAdm").removeClass("sum-is-same")
                }

            }
            else {
                $("#sumRowCash").addClass("displaynone");
                $("#sumPayAmountCashAdm").text("");
            }
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

function calcSumPriceUpd() {
    var rows = $("#tempSelectedRequests").find("tr");
   
    var sumNetPrice = 0;
    for (var i = 0; i < rows.length; i++) {
        if ($(rows[i]).find(`#col_7_${i}`).text().includes("("))
            sumNetPrice += +$(rows[i]).find(`#col_7_${i}`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '') * -1;
        else
            sumNetPrice += +$(rows[i]).find(`#col_7_${i}`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '');
    }
    $("#sumNetPrice").text(sumNetPrice >= 0 ? transformNumbers.toComma(sumNetPrice) : `(${transformNumbers.toComma(Math.abs(sumNetPrice))})`);

}

function addToServiceArr(model) {
    if (!existServiceItem(model.id)) {
        arr_tempService.push(model);
        return true;
    }
    else
        return false;
}

function addToGridService(model) {
    var requestStr = getStrRequest(model);
    $("#tempSelectedRequests").append(requestStr);
}

function getStrRequest(request) {

    var index = $(`#tempSelectedRequests`).find("tr").length;

    `<td id="col_${3}_${index}">${request.admissionId}</td>`

    var requestStr = `<tr>` +
        `<td id="col_${1}_${index}">${index + 1}</td>
         <td id="col_${2}_${index}">${request.id}</td>      
         <td id="col_${3}_${index}">${request.patientNationalCode}</td>
         <td id="col_${4}_${index}">${request.patientFullName != null ? request.patientFullName : ""}</td>
         <td id="col_${5}_${index}">${request.workflowId != 0 ? `${request.workflowId} - ${request.workflowName}` : ""}</td>
         <td id="col_${6}_${index}">${request.stageId != 0 ? `${request.stageId} - ${request.stageName}` : ""}</td>
         <td id="col_${7}_${index}">${request.sumRequestAmount >= 0 ? transformNumbers.toComma(request.sumRequestAmount) : `(${transformNumbers.toComma(Math.abs(request.sumRequestAmount))})`}</td>
         <td id="col_${7}_${index}">${request.sumCashAmount >= 0 ? transformNumbers.toComma(request.sumCashAmount) : `(${transformNumbers.toComma(Math.abs(request.sumCashAmount))})`}</td>
        </tr>`;

    return requestStr;
}

function existServiceItem(id) {
    for (var i = 0; i < arr_tempService.length; i++) {
        if (arr_tempService[i].id == id)
            return true;
    }
    return false;
}

function resetShowDisplayCash() {
    $("#tempSelectedRequests").html("");
    $("#tempCash").html("");
    arr_tempCash = [];
    arr_tempService = [];
}

function initShowDisplayCash(id) {

    resetShowDisplayCash();
    getAdmissionCashRequests(id);
}
