var viewData_summarycashfundtype = `${viewData_baseUrl_MC}/AdmissionCashApi/summarycashfundtype`;

function fillCashSummeryUser(userId, date) {
    var model = {
        CreateDatePersian: date,
        UserId: userId
    }

    $.ajax({
        url: viewData_summarycashfundtype,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {

            appandCashSummeryUser(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_summarycashfundtype);
        }
    });

}

function appandCashSummeryUser(result) {

    var summaryLength = checkResponse(result) ? result.length : 0;

    if (summaryLength > 0) {
        $("#tempCashSummeryUser").html("");
        let output = '',
            data = null,
            cash = 0,
            pos = 0,
            bankReceipt = 0,
            accountReceivable = 0,
            accountReceivableEmployeeDeductionAndAddition = 0,
            accountReceivablePatientCredit = 0,
            accountReceivableAttenderCommission = 0,
            accountReceivableEmployeeCredit = 0,
            accountReceivableCharityCredit = 0,
            accountReceivableInsurerCredit = 0,
            accountReceivableAttenderCredit = 0;


        for (var i = 0; i < summaryLength; i++) {

            data = result[i];

            output += `<tr>
                          <td>${data.workflow}</td >
                          <td>${data.stage}</td >
                          <td>${data.cash >= 0 ? transformNumbers.toComma(Math.abs(data.cash)) : `(${transformNumbers.toComma(Math.abs(data.cash))})`}</td >
                          <td>${data.pos >= 0 ? transformNumbers.toComma(Math.abs(data.pos)) : `(${transformNumbers.toComma(Math.abs(data.pos))})`}</td >
                          <td>${data.bankReceipt >= 0 ? transformNumbers.toComma(Math.abs(data.bankReceipt)) : `(${transformNumbers.toComma(Math.abs(data.bankReceipt))})`}</td >
                          <td>${data.accountReceivable >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivable)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivable))})`}</td >
                          <td>${data.accountReceivableEmployeeDeductionAndAddition >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableEmployeeDeductionAndAddition)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableEmployeeDeductionAndAddition))})`}</td >
                          <td>${data.accountReceivablePatientCredit >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivablePatientCredit)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivablePatientCredit))})`}</td >
                          <td>${data.accountReceivableAttenderCommission >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableAttenderCommission)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableAttenderCommission))})`}</td >
                          <td>${data.accountReceivableEmployeeCredit >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableEmployeeCredit)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableEmployeeCredit))})`}</td >
                          <td>${data.accountReceivableCharityCredit >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableCharityCredit)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableCharityCredit))})`}</td >
                          <td>${data.accountReceivableInsurerCredit >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableInsurerCredit)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableInsurerCredit))})`}</td >
                          <td>${data.accountReceivableAttenderCredit >= 0 ? transformNumbers.toComma(Math.abs(data.accountReceivableAttenderCredit)) : `(${transformNumbers.toComma(Math.abs(data.accountReceivableAttenderCredit))})`}</td >
                     </tr>`;


            cash += data.cash;
            pos += data.pos;
            bankReceipt += data.bankReceipt;
            accountReceivable += data.accountReceivable;
            accountReceivableEmployeeDeductionAndAddition += data.accountReceivableEmployeeDeductionAndAddition;
            accountReceivablePatientCredit += data.accountReceivablePatientCredit
            accountReceivableAttenderCommission += data.accountReceivableAttenderCommission;
            accountReceivableEmployeeCredit += data.accountReceivableEmployeeCredit;
            accountReceivableCharityCredit += data.accountReceivableCharityCredit;
            accountReceivableInsurerCredit += data.accountReceivableInsurerCredit;
            accountReceivableAttenderCredit += data.accountReceivableAttenderCredit;
        }

        $(output).appendTo("#tempCashSummeryUser");

        output = `<tr>
                          <td colspan="2" style="text-align:rigth" class="summary-title">  جمع  </td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${cash >= 0 ? transformNumbers.toComma(cash) : `(${transformNumbers.toComma(Math.abs(cash))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${pos >= 0 ? transformNumbers.toComma(pos) : `(${transformNumbers.toComma(Math.abs(pos))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${bankReceipt >= 0 ? transformNumbers.toComma(bankReceipt) : `(${transformNumbers.toComma(Math.abs(bankReceipt))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivable >= 0 ? transformNumbers.toComma(accountReceivable) : `(${transformNumbers.toComma(Math.abs(accountReceivable))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableEmployeeDeductionAndAddition >= 0 ? transformNumbers.toComma(accountReceivableEmployeeDeductionAndAddition) : `(${transformNumbers.toComma(Math.abs(accountReceivableEmployeeDeductionAndAddition))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivablePatientCredit >= 0 ? transformNumbers.toComma(accountReceivablePatientCredit) : `(${transformNumbers.toComma(Math.abs(accountReceivablePatientCredit))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableAttenderCommission >= 0 ? transformNumbers.toComma(accountReceivableAttenderCommission) : `(${transformNumbers.toComma(Math.abs(accountReceivableAttenderCommission))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableEmployeeCredit >= 0 ? transformNumbers.toComma(accountReceivableEmployeeCredit) : `(${transformNumbers.toComma(Math.abs(accountReceivableEmployeeCredit))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableCharityCredit >= 0 ? transformNumbers.toComma(accountReceivableCharityCredit) : `(${transformNumbers.toComma(Math.abs(accountReceivableCharityCredit))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableInsurerCredit >= 0 ? transformNumbers.toComma(accountReceivableInsurerCredit) : `(${transformNumbers.toComma(Math.abs(accountReceivableInsurerCredit))})`}</td >
                          <td class="font-weight-bold col-width-percent-5 sum-border">${accountReceivableAttenderCredit >= 0 ? transformNumbers.toComma(accountReceivableAttenderCredit) : `(${transformNumbers.toComma(Math.abs(accountReceivableAttenderCredit))})`}</td >
                    </tr>`;

        $(output).appendTo("#tempSumCashSummeryUser");


    }
    else {
        $("#tempCashSummeryUser").html(fillEmptyRow(13));
    }
}

function exportCashSummeryUserCsv() {
    var model = {
        CreateDatePersian: "",
        UserId: 0
    }

    let urlCSV = `${viewData_baseUrl_MC}/AdmissionCashApi/exportcashsummeryusercsv`,
        viewData_form_title = "لیست مانده خلاصه وجوه دریافت/پرداخت کاربر";

    $.ajax({
        url: urlCSV,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            generateCsv(result);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_csv_url);
        }
    });
}