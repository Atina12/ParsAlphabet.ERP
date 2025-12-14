

function admissionMasterDisplay(admissionMastrId) {
    $("#admissionMasterIdDisplay").text(admissionMastrId);
    getAdmissionList(admissionMastrId);
    getMasterCashRequest(admissionMastrId);
}

function getAdmissionList(admissionMasterId = 0) {

    $("#admissionMasterId").val(admissionMasterId == 0 ? "" : admissionMasterId)

    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getmasteradmissions/${admissionMasterId}`

        $.ajax({
            url: url,
            async: false,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                let admissionMasterCashInfo = getMasterCashInfo(admissionMasterId, 0);

                if (checkResponse(result) && result.length > 0)
                    buildAdmissionList(result, admissionMasterCashInfo)
                else {
                    var msg = alertify.warning('سطری برای نمایش وجود ندارد');
                    msg.delay(admission.delay);
                }
                return result
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });

    }
    else {
        var msg = alertify.warning('سطری برای نمایش وجود ندارد');
        msg.delay(admission.delay);
    }

}

function buildAdmissionList(admissions, admissionMasterCashInfo) {

    admissionListCount = admissions.length

    $("#admissionListTable").html("")

    let strTable = ""
    strTable = `
                    <thead class="table-thead-fixed">
                         <tr>
                             <th class="col-width-percent-5">شناسه</th>
                             
                             <th class="col-width-percent-12">جریان کار</th>
                             <th class="col-width-percent-12">مرحله</th>
                             <th class="col-width-percent-10">گام</th>
                             <th class="col-width-percent-8">داکتر</th>
                             <th class="col-width-percent-9">شیفت</th>
                             <th class="col-width-percent-4">نوبت</th>
                             <th class="col-width-percent-6">تاریخ رزرو</th>
                             <th class="col-width-percent-6">مبلغ</th>
                             <th class="col-width-percent-10">مراجعه کننده</th>
                             <th class="col-width-percent-8">کاربر ثبت کننده</th>
                             <th class="col-width-percent-5">تاریخ و زمان ثبت</th>
                         </tr>
                     </thead>
                     <tbody id="admissionListTbody">`


    if (checkResponse(admissions) && admissions.length != 0) {

        for (let i = 0; i < admissions.length; i++) {
            strTable += `<tr id="admL${i}" 
                             data-id="${admissions[i].id}" 
                             onclick="trOnclickAdmissionList(${i},'admissionListTable',event,this)" 
                             tabindex="-1"
                             data-admissionid="${admissions[i].id}"
                             data-workflowid="${admissions[i].workflowId}"
                             data-stageid="${admissions[i].stageId}"
                             data-actionid="${admissions[i].actionId}"
                             data-medicalrevenue="${admissions[i].medicalRevenue}"
                             data-admissionamount="${admissions[i].admissionAmount}"
                             data-attenderscheduleblockid="${admissions[i].attenderScheduleBlockId}">

                                 <td>${admissions[i].id}</td>
                                 <td>${admissions[i].workflow}</td>
                                 <td>${admissions[i].stage}</td>
                                 <td>${admissions[i].actionIdName}</td>
                                 <td>${admissions[i].attenderId == 0 ? "" : `${admissions[i].attenderId} - ${admissions[i].attenderName}`}</td>  
                                 <td>${checkResponse(admissions[i].reserveShiftId) ? `${admissions[i].reserveShiftId} - ${admissions[i].reserveShiftName}` : ""}</td>
                                 <td>${checkResponse(admissions[i].admissionNo) ? admissions[i].admissionNo : ""}</td>   
                                 <td>${checkResponse(admissions[i].reserveDatePersian) && admissions[i].reserveDatePersian != "" ? `${admissions[i].reserveDatePersian} ${admissions[i].reserveTime}` : ""}</td>
                                 <td>${admissions[i].admissionAmount >= 0 ? transformNumbers.toComma(admissions[i].admissionAmount) : `(${transformNumbers.toComma(Math.abs(admissions[i].admissionAmount))})`}</td>
                                 <td>${admissions[i].patientId} - ${admissions[i].patientFullName}</td>               
                                 <td>${admissions[i].createUserFullName}</td>
                                 <td>${admissions[i].createDateTimePersian}</td>
                         </tr>`

        }

        strTable += `<tr>
                        <td colspan="8" style="text-align:left">جمع</td>
                        <td  class=" money total-amount">${admissionMasterCashInfo.admissionMasterAmount >= 0 ? transformNumbers.toComma(admissionMasterCashInfo.admissionMasterAmount) : `(${transformNumbers.toComma(Math.abs(admissionMasterCashInfo.admissionMasterAmount))})`}</td>
                        <td colspan="4"></td>
                     </tr>`
    }
    else
        strTable += `<tr><td colspan="12" class="text-center">سطری وجود ندارد</td></tr>`

    strTable += `</tbody>`

    $("#admissionListTable").append(strTable)

    $("#admissionListTable #admL0").addClass("highlight").click()
}

function trOnclickAdmissionList(row, tabelId, ev, elm) {

    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#admL${row}`).addClass("highlight");
    $(`#${tabelId} tr#admL${row}`).focus();

    let admissionId = $(elm).data("admissionid")
    let stageId = $(elm).data("stageid")
    let workflowId = $(elm).data("workflowid")

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    $("#admissionRequestId").text(`( شناسه : ${admissionId} ) `)

    if (admissionTypeId == 1)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    else
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);



}

function getMasterCashRequest(admissionMasterId = 0){


    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getadmissioncashbymaster/${admissionMasterId}`

        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {

                if (checkResponse(result) && result.length > 0)
                    buildAdmissionCashRequest(result)
                else
                    buildAdmissionCashRequest([])

            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildAdmissionCashRequest([])
            }
        });

    }
    else
        buildAdmissionCashRequest([])

}

function buildAdmissionCashRequest(cashInfo) {

    $("#divAdmissionCashPayInfo").prop("max-height:150px;","")
    $("#admissionCashPayInfo").html("");
    appendCashAdmDisplay([], "");
    sumCashAdmSum([]);
    $("#cashFormTitle").text("");

    let strTable = ""
    strTable = `
                    <thead class="table-thead-fixed">
                         <tr>
                             <th class="col-width-percent-5">شناسه</th>
                             <th class="col-width-percent-10">شعبه</th>
                             <th class="col-width-percent-15">جریان کار</th>
                             <th class="col-width-percent-15">مرحله</th>
                             <th class="col-width-percent-15">گام</th>
                             <th class="col-width-percent-15">مبلغ پرداخت شده</th>
                             <th class="col-width-percent-15">کاربر ثبت کننده</th>
                             <th class="col-width-percent-10">تاریخ و زمان ثبت</th>
                         </tr>
                     </thead>
                     <tbody id="admissionCashPayInfoBody">`


    if (checkResponse(cashInfo) && cashInfo.length != 0) {
        $("#divAdmissionCashPayInfo").attr("style", "max-height:150px;overflow-y:scroll !important;overflow-x:auto!important");

        for (let i = 0; i < cashInfo.length; i++) {
            strTable += `<tr id="cashInfo_${i}"  style="cursor:pointer"
                             data-cashid="${cashInfo[i].id}"
                             onclick="trOnclickCashInfo(${i},'admissionCashPayInfo',event,this)" 
                             tabindex="-1">
                                 <td>${cashInfo[i].id}</td>
                                 <td>${cashInfo[i].branchId == 0 ? "" : `${cashInfo[i].branchId} - ${cashInfo[i].branchName}`}</td> 
                                 <td>${cashInfo[i].workflowId == 0 ? "" : `${cashInfo[i].workflowId} - ${cashInfo[i].workflowName}`}</td>
                                 <td>${cashInfo[i].stageId == 0 ? "" : `${cashInfo[i].stageId} - ${cashInfo[i].stageName}`}</td>
                                 <td>${cashInfo[i].actionId == 0 ? "" : `${cashInfo[i].actionId} - ${cashInfo[i].actionName}`}</td>
                                 <td>${cashInfo[i].cashAmount < 0 ? `(${transformNumbers.toComma(Math.abs(cashInfo[i].cashAmount))})` : transformNumbers.toComma(cashInfo[i].cashAmount)} </td >
                                 <td>${cashInfo[i].createUser}</td>
                                <td>${cashInfo[i].createDateTimePersian}</td>
                         </tr > `
        }

    }
    else {
        strTable += `<tr><td colspan="8" class="text-center">سطری وجود ندارد</td></tr > `
        $("#divAdmissionCashPayInfo").attr("style", "max-height:60px");

    }

    strTable += `</tbody> `

    $("#admissionCashPayInfo").append(strTable)


    $("#admissionCashPayInfo #cashInfo_0").click()

}

function trOnclickCashInfo(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row} `).addClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row} `).focus();

    let id = $(elm).data("cashid")
    getAdmissionCashRequests(id)
}

function getAdmissionCashRequests(cashId = null) {

    var modelCashLine = {};
    let arr_tempCashDisplay = []
    let viewData_upd_admissionCashRequest = `${viewData_baseUrl_MC}/AdmissionCashApi/admissioncashdisplay`

    $.ajax({
        url: viewData_upd_admissionCashRequest,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(cashId),
        cache: false,
        async: false,
        success: async function (result) {

            if (result.successfull == true) {


                let payments = result.data.payments;

                if (payments != null) {


                    let defaultCurrency = getDefaultCurrency()

                    for (var i = 0; i < payments.length; i++) {
                        modelCashLine = {
                            headerId: cashId,
                            rowNumber: i + 1,
                            inOut: payments[i].inOut,
                            inOutName: payments[i].inOut === 1 ? "1 - دریافت" : "2 - پرداخت",
                            fundTypeId: payments[i].fundTypeId,
                            fundTypeName: `${payments[i].fundTypeId} - ${payments[i].fundTypeName} `,
                            currencyId: payments[i].currencyId,
                            currencyName: `${payments[i].currencyId} - ${payments[i].currencyName} `,
                            detailAccountId: payments[i].detailAccountId,
                            detailAccountName: payments[i].detailAccountId !== 0 ? `${payments[i].detailAccountId} - ${payments[i].detailAccountName} ` : "",
                            cardNo: payments[i].cardNo,
                            refNo: payments[i].refNo,
                            amount: payments[i].amount,
                            posId: payments[i].posId,
                            posName: (payments[i].posName != null ? payments[i].posName : ""),
                            exchangeRate: payments[i].currencyId == defaultCurrency ? 1 : payments[i].exchangeRate,
                            payAmount: payments[i].exchangeRate == 0 ? payments[i].amount : payments[i].amount * payments[i].exchangeRate,
                            userFullName: payments[i].userFullName,
                            createDateTimePersian: payments[i].createDateTimePersian,
                            userId: payments[i].userId
                        };

                        arr_tempCashDisplay.push(modelCashLine)

                        $("#tempCashDisplay .fullNameCash,#tempCashDisplay .createDateCash").removeClass("displaynone");

                    }

                    appendCashAdmDisplay(arr_tempCashDisplay, cashId);
                    sumCashAdmSum(arr_tempCashDisplay)
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

function appendCashAdmDisplay(arr_tempCashDisplay, cashId) {

    $("#cashFormTitle").text(cashId)

    if (arr_tempCashDisplay.length == 0) {
        $("#tempCashDisplay").html(`< tr id = "emptyRow" > <td colspan="11" class="text-center">سطری وجود ندارد</td></tr > `);
    }
    else {
        let output = ""

        for (let i = 0; i < arr_tempCashDisplay.length; i++) {
            let inOutClass = "";

            if (arr_tempCashDisplay[i].inOut === 2)
                inOutClass = `class="highlight-danger"`;

            output += `<tr ${inOutClass} id="c_${i}"
            onclick="trOnclickCashInfoDetails(${i},'admissionCashDisplay',event,this)"
            onkeydown="trOnKeydownCashInfoDetails(${i},'admissionCashDisplay',event)"
            tabindex="-1">
                
                <td>${arr_tempCashDisplay[i].rowNumber}</td>
                <td>${arr_tempCashDisplay[i].inOutName}</td>
                <td>${arr_tempCashDisplay[i].fundTypeName}</td>
                <td>${arr_tempCashDisplay[i].posId == 0 ? "" : `${arr_tempCashDisplay[i].posId} - ${arr_tempCashDisplay[i].posName}`}</td>
                <td>${arr_tempCashDisplay[i].currencyName}</td>
                <td>${arr_tempCashDisplay[i].detailAccountName}</td>
                <td class="d-none">${arr_tempCashDisplay[i].cardNo}</td>
                <td class="money">${arr_tempCashDisplay[i].inOut === 1 ? transformNumbers.toComma(arr_tempCashDisplay[i].amount) : `( ${transformNumbers.toComma(Math.abs(arr_tempCashDisplay[i].amount))} )`}</td>
                <td class="money">${transformNumbers.toComma(arr_tempCashDisplay[i].exchangeRate)}</td>
                <td class="money">${arr_tempCashDisplay[i].inOut === 1 ? transformNumbers.toComma(arr_tempCashDisplay[i].payAmount) : `( ${transformNumbers.toComma(arr_tempCashDisplay[i].payAmount)} )`}</td>
                <td class="fullNameCash" >${arr_tempCashDisplay[i].userId} - ${arr_tempCashDisplay[i].userFullName}</td>
                <td class="createDateCash">${arr_tempCashDisplay[i].createDateTimePersian}</td>
                      </tr > `;
        }


        $(`#tempCashDisplay`).html(output);

        setTimeout(() => {
            $("#tempCashDisplay tr#c_0").click()
        }, 50)
    }

}

function trOnclickCashInfoDetails(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#c_${row} `).addClass("highlight");
    $(`#${tabelId} tr#c_${row} `).focus();
}

function trOnKeydownCashInfoDetails(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row - 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row - 1} `).addClass("highlight");
            $(`#${tabelId} tr#c_${row - 1} `).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row + 1} `).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row + 1} `).addClass("highlight");
            $(`#${tabelId} tr#c_${row + 1} `).focus();
        }
    }
}

function sumCashAdmSum(arr_tempCashDisplay) {

    if (arr_tempCashDisplay !== null)

        if (arr_tempCashDisplay.length !== 0) {

            let sumCash = sumPayAmountCashAdmDisplay(arr_tempCashDisplay);

            if (sumCash >= 0)
                $("#sumPayAmountCashAdmDisplay").text(transformNumbers.toComma(sumCash));
            else
                $("#sumPayAmountCashAdmDisplay").text(`(${transformNumbers.toComma(Math.abs(sumCash))})`);

            $("#sumRowCashDisplay").removeClass("displaynone");
            $("#sumRowCashDisplay tr#sumRow").css("display", "")
            $("#sumRowCashDisplay tr#emptyRowCashDisplay").css("display", "none")
        }
        else {
            $("#sumRowCashDisplay tr#sumRow").css("display", "none")
            $("#sumRowCashDisplay tr#emptyRowCashDisplay").css("display", "")

        }

}

function sumPayAmountCashAdmDisplay(arr_tempCashDisplay) {

    var amountIn = 0, amountOut = 0;

    for (var i = 0; i < arr_tempCashDisplay.length; i++) {
        var item = arr_tempCashDisplay[i];

        if (item.inOut === 1)
            amountIn += +item.payAmount;
        else
            amountOut += +item.payAmount;
    }

    return amountIn - amountOut

}