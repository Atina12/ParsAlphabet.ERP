
var viewData_controllername = "AdmissionCashApi",
    viewData_insert_admissionCashLine = `${viewData_baseUrl_MC}/AdmissionApi/insertadmissioncashline`,
    admissionTypeId = 0,
    saleTypeId = 0,
    admissionServiceId = 0,
    patientFullname = "",
    nationalCode = "",
    isPatientUndefined = false,
    userIdCash = 0, admnMasterInfo = {};

isSame_Sum_CallBack = isSame_SumCallBack;

function initAdmissionCashUpd() {

    $(".select2").select2();

    defaultCurrency = getDefaultCurrency();

    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false);

    $("#currencyId").val(defaultCurrency).trigger("change");

    getAdmissionCashRequests();

}

function getStageAction(workflowId, stageId, actionId, priority) {

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`

    let model = {
        workflowId,
        stageId,
        actionId,
        priority: priority,
        isActive: true
    }

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseJSON;
}

function getAdmissionCashRequests() {

    let viewData_upd_admissionCashRequest = `${viewData_baseUrl_MC}/${viewData_controllername}/admissioncashdisplay`;

    $.ajax({
        url: viewData_upd_admissionCashRequest,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admissionCashId),
        cache: false,
        async: false,
        success: async function (result) {

            if (result.successfull) {

                var requests = result.data.requests;
                $("#tempSelectedRequests").html("");
       
                if (requests != null) {

                    fillCashSummeryUser(requests[0].userId, requests[0].createDateTimePersian);
                    $("#dateTime").val(requests[0].createDateTimePersian);
                    $("#userFullName").val(requests[0].userFullName);

                    let remaining = getAdmissionMasterBalance(requests[0].admissionMasterId)

                    requests[0].remainingAmount = remaining


                    admissionCashDetail.admissionMasterId = requests[0].admissionMasterId
                    admissionCashDetail.admissionMasterStageId = requests[0].stageId
                    admissionCashDetail.admissionMasterWorkflowId = requests[0].workflowId
                    admissionCashDetail.admissionMedicalRevenue = requests[0].medicalRevenue
                    admissionCashDetail.sumCashAmount = requests[0].sumCashAmount
                    admnMasterInfo.workflowCategoryId = requests[0].workflowCategoryId



                    for (var i = 0; i < requests.length; i++) {
                        if (addToServiceArr(requests[i]) == true) {
                            addToGridService(requests[i], "tempSelectedRequests");
                        }
                    }
                }

                var payments = result.data.payments;

                if (payments != null) {
                    for (var i = 0; i < payments.length; i++) {
                        var modelCashLine =
                        {
                            headerId: admissionCashId,
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
                            posId: payments[i].posId,
                            posName: (payments[i].posName != null ? payments[i].posName : " "),
                            refNo: payments[i].refNo,
                            amount: payments[i].amount,
                            exchangeRate: payments[i].currencyId == getDefaultCurrency() ? 1 : payments[i].exchangeRate,
                            payAmount: payments[i].exchangeRate == 0 ? payments[i].amount : payments[i].amount * payments[i].exchangeRate,
                            createDateTimePersian: payments[i].createDateTimePersian,
                            userFullName: payments[i].userFullName,
                            isAccess: payments[i].isAccess,
                            userId: payments[i].userId,
                        };
                        arr_tempCash.push(modelCashLine);
                        appendCashAdm(modelCashLine);
                    }
                }


                //resetCash();
                await newPayAmount();
                isSame_sum();
                resetAfterAdd()
                getAdmissionListForm(requests[0].admissionMasterId)
            }
            else {
                //generateErrorValidation(result.data.validationErrors);
                var msgItem = alertify.warning(result.message);
                msgItem.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_search_admissionCashRequest);
        }
    });

}

function IsEditMode() {
    if ($("#admCashId").val() == "")
        return false;
    else
        return true;
}

function calcSumPriceUpd() {

    var rows = $("#tempSelectedRequests").find("tr");
    var sumNetPrice = 0;
    for (var i = 0; i < rows.length; i++) {
        if ($(rows[i]).find(`#col_8_${i}`).text().includes("("))
            sumNetPrice += +$(rows[i]).find(`#col_8_${i}`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '') * -1;
        else
            sumNetPrice += +$(rows[i]).find(`#col_8_${i}`).text().replaceAll(',', '').replaceAll(')', '').replaceAll('(', '');
    }
    $("#sumNetPrice").text(sumNetPrice >= 0 ? transformNumbers.toComma(sumNetPrice) : `(${transformNumbers.toComma(Math.abs(sumNetPrice))})`);
}

function sumAdmissionLine() {
    let lastPayAmount = $("#tempSelectedRequests tr:eq(0)").data("summasteramount")
    return lastPayAmount;
}

function isSame_SumCallBack(result) {
    if (result) {
        $("#admissionServiceForm :button").not("#btnSelectedRequests,#btnprintRequests").prop("disabled", true)
    }
    else {
        $("#admissionServiceForm :button").not("#btnSelectedRequests,#btnprintRequests").prop("disabled", false)
    }
}

function saveForm() {

    if (arr_tempService.length === 0) {
        let msg = alertify.warning("انتخاب درخواست را کلیک  کنید");
        msg.delay(admission.delay);
        return
    }



    let stageId = admnMasterInfo.workflowCategoryId == 14 ? admissionStage.admissionCashPayment.id : admissionStage.admissionCashRecieve.id

    let actionList = getStageAction(+admissionCashDetail.admissionMasterWorkflowId, stageId, 0, 1);

    let model = {
        id: admissionCashId,
        admissionMasterId: admissionCashDetail.admissionMasterId,
        stageId,
        actionId: actionList.actionId,
        admissionLineCashList: arr_tempCash,
        workflowId: admissionCashDetail.admissionMasterWorkflowId,
    }

    let prop = [
        "id",
        "admissionMasterId",
        "workflowId",
        "stageId",
        "actionId",
        "admissionLineCashList"
    ]

    let modelSend = {};

    modelSend = safeJSONParse(JSON.stringify(model), prop);

    $.ajax({
        url: viewData_insert_admissionCashLine,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSend),
        cache: false,
        async: false,
        success: function (result) {

            if (result.successfull == true) {
                var msg_status0 = alertify.success(msg_row_edited);
                msg_status0.delay(admission.delay);
                navigation_item_click("/MC/AdmissionCash", viewData_form_title);
            }
            else {
                var msgItem = alertify.warning(result.message);
                msgItem.delay(alertify_delay);
                $("#saveForm").removeAttr("disabled")
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_insert_admissionCashLine);
        }
    });


}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveForm();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_l) {
        e.preventDefault();
        e.stopPropagation();
        $("#list_admCash").click();
    }

};

$("#admissionCashUpdFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        saveForm();
    }
});

$("#list_admCash").on("click", function () {
    navigation_item_click("/MC/AdmissionCash", viewData_form_title);
});



////////////////////////////////////// START BTN REQUESTS ///////////////////////////////////////////////
function addToServiceArr(model) {
    if (!existServiceItem(model.id)) {
        arr_tempService.push(model);
        return true;
    }
    else
        return false;
}

function existServiceItem(id) {
    for (var i = 0; i < arr_tempService.length; i++) {
        if (arr_tempService[i].id == id)
            return true;
    }
    return false;
}

function addToGridService(model) {
    getStrRequest(model)
        .then(requestStr => {
            $(`#tempSelectedRequests`).append(requestStr);
            $("#trs_2_1").addClass("highlight")
            calcSumPriceUpd();
            $("#sumRowRequest").removeClass("displaynone");
        });

}

async function getStrRequest(request) {

    var index = 0;
    var requestStr = `<tr ${request.medicalRevenue == 2 ? 'class="highlight-danger"' : ""} 
                          id="trs_2_${index + 1}" 
                          tabindex="-1" data-stageid="${request.stageId}" 
                          onclick="setHighlightTr(${index + 1},2)" 
                          onkeydown="setHighlightTrKeyDown(${index + 1},event,2,${index + 1})"
                          data-workflowid="${request.workflowId}" 
                          data-stageid="${request.stageId}"
                          data-admissionmasterid="${request.admissionMasterId}"
                          data-actionid="${request.actionId}"
                          data-medicalrevenue="${request.medicalRevenue}"
                          data-summasteramount="${request.sumRequestAmount}"
                      >`;


    if ($("#sumRowRequest").hasClass("displaynone")) {
        $("#sumRowRequest").removeClass("displaynone");
        $("#emptyRow").remove();
    }

    //ردیف - شناسه - نمبرتذکره - نام خانواگی - جریان کار - مرحله - قابل دریافت پرداخت - عملیات
    requestStr += `
        <td id="col_${0}_${index}">${index + 1}</td>
        <td id="col_${1}_${index}" >${request.id}</td >
        <td id="col_${2}_${index}" data-patientid="${request.patientId}">${request.patientNationalCode}</td>
        <td id="col_${3}_${index}" >${request.patientId} - ${request.patientFullName}</td>
        <td id="col_${4}_${index}" data-workflowid="${request.workflowId}">${request.workflowName}</td>
        <td id="col_${5}_${index}" data-stageid="${request.stageId}">${request.stageName}</td>
        <td id="col_${6}_${index}" >${+request.sumRequestAmount >= 0 ? transformNumbers.toComma(request.sumRequestAmount) : `(${transformNumbers.toComma(Math.abs(request.sumRequestAmount))})`}</td >
        <td id="col_${7}_${index}" >${+request.sumCashAmount >= 0 ? transformNumbers.toComma(request.sumCashAmount) : `(${transformNumbers.toComma(Math.abs(request.sumCashAmount))})`}</td >
        <td id="col_${8}_${index}" >${+request.remainingAmount >= 0 ? transformNumbers.toComma(request.remainingAmount) : `(${transformNumbers.toComma(Math.abs(request.remainingAmount))})`}</td >
        <td>
            <button type="button" onclick="displayMasterRequest(${request.admissionMasterId})" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="نمایش درخواست">
                <i class="fa fa-list"></i>
            </button>
            </button>
            <button type="button" onclick="displayMasterCashRequest(${request.admissionMasterId})" class="btn btn-print" data-toggle="tooltip" data-placement="top" title="نمایش دریافت پرداخت">
                <i class="fa fa-list"></i>
            </button>
       </td>`;


    requestStr += "</tr>";
    return requestStr;
}

function displayMasterRequest(admissionMasterId) {

    var check = controller_check_authorize("AdmissionMasterApi", "VIW");
    if (!check)
        return;

    $("#AdmissionMasterId").text("شناسه پرونده : ")
    $("#admissionList").removeClass("d-none")
    admissionMasterDisplay(admissionMasterId)
}

function setHighlightTr(rowNumber, id) {

    $("#tempRequests tr").removeClass("highlight");

    $(`#trs_${id}_${rowNumber}`).addClass("highlight");
}

function setHighlightTrKeyDown(rowNumber, e, id, value) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;
    $("#tempRequests tr").removeClass("highlight");
    var countRow = $("#tempRequests tr").length;
    if (e.keyCode === KeyCode.ArrowUp)
        if (rowNumber > 1)
            $(`#trs_${id}_${rowNumber - 1}`).addClass("highlight").focus();
        else
            $(`#trs_${id}_${rowNumber}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (rowNumber < countRow)
            $(`#trs_${id}_${rowNumber + 1}`).addClass("highlight").focus();
        else
            $(`#trs_${id}_${rowNumber}`).addClass("highlight").focus();

}

function switchPrnAdmission(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        separationprint()
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        aggregationprint()
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        doubleprint()
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        cashstandprint()
    }
}

function switchPrnAdmissionSale(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        saleseparationprint()
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        cashstandprint()
    }
}

function cashstandprint() {

    let row = $(`#trs_2_1`);
    let medicalrevenue = $(row).data("medicalrevenue");
    let admissionmasterid = row.data("admissionmasterid");
    standprint(admissionmasterid, medicalrevenue)

    modal_close('PrnAdmissionSale')
    modal_close('PrnAdmission')
}

function separationprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    contentPrintAdmission(admissionId);

    modal_close('PrnAdmission')
}

function aggregationprint() {
    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;


    contentPrintAdmissionCompress(admissionId);

    modal_close('PrnAdmission');
}

function doubleprint() {

    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize("AdmissionApi", "PRN");
    if (!check)
        return;

    let row = $(`#admissionServiceForm #tempSelectedRequests .highlight`);
    var admissionId = rowNumberAdmission;
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")
    let element = $("#bcTarget")

    let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
    contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

    modal_close('PrnAdmission');
}

function saleseparationprint() {
    var admissionId = rowNumberAdmission;

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    contentPrintAdmissionSale(admissionId);

    modal_close('PrnAdmissionSale');
}

function configPrint(id, admissionTypeId, medicalrevenue, stateId) {

    rowNumberAdmission = id;

    if (medicalrevenue == 2) {
        if (admissionTypeId !== 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmissionSale .card-body .PrnModalDiv:last").addClass("d-none");
    }
    else {

        if (admissionTypeId !== 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");
        else
            $("#PrnAdmissionSale .card-body .PrnModalDiv:last").removeClass("d-none");
    }

    if (admissionTypeId === 2 || admissionTypeId === 3 || admissionTypeId == 4) {//Admission
        if (medicalrevenue == 1) {
            $("#PrnAdmission #modal_keyid_value").text(id)
            modal_show("PrnAdmission");
        }
        else
            contentPrintAdmission(id);
    }
    else {
        if (medicalrevenue === 2) {
            $("#PrnAdmissionSale #modal_keyid_value").text(id)
            modal_show("PrnAdmissionSale");
        }
        else
            contentPrintAdmissionSale(id);
    }
}

function adm_print(admId, adm_admissionMasterId, printurl) {
    
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let row = $(`#admissionServiceForm #tempSelectedRequests tr`);
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")

    if (printurl.indexOf("Prn_AdmissionStand") != -1) {
        viewData_print_model.sqlDbType = 22;
        viewData_print_model.item = "@AdmissionKey";
        viewData_print_model.value = `${adm_admissionMasterId}`

    }
    else {
        if (printurl.indexOf("Prn_AdmissionCompress.mrt") != -1) {
            contentPrintAdmissionCompress(admId);
            return;
        }
        if (printurl.indexOf("Prn_AdmissionDouble.mrt") != -1) {


            var admissionId = admId;
            let element = $("#bcTarget")

            let bcTargetPrintprescription = doubleprintBarcode(element, admissionId, stageId, workflowId)
            contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription);

            return;
        }
        if (printurl.indexOf("Prn_AdmissionSales.mrt") != -1) {
            contentPrintAdmissionSale(admId);
            return;
        }
        if (printurl.indexOf("Prn_Admission.mrt") != -1) {
            contentPrintAdmission(admId);
            return;
        }

        viewData_print_model.value = admId;
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

function printAdmission(printname, medicalRevenue = 2) {

    if (medicalRevenue == 1) {
        printUrlSale = `/Stimuls/MC/${printname}`;
        modal_close("printAdmissionItemModal");
    }
    else {
        printUrl = `/Stimuls/MC/${printname}`;
        modal_close("printAdmissionModal");
    }
}

function switchPrintAdmissionModal(e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printAdmission('Prn_Admission.mrt')
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        printAdmission('Prn_AdmissionCompress.mrt')
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        printAdmission('Prn_AdmissionDouble.mrt')
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printAdmission('Prn_AdmissionStand.mrt')
    }
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

$("#PrnAdmission").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrnAdmission(e)
});

$("#PrnAdmissionSale").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrnAdmissionSale(e)
});

$("#printAdmissionModal").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrintAdmissionModal(e)
});

//$("#printAdmissionModal").on("hidden.bs.modal", function (ev) {
//    if (printUrl !== "")
//        adm_print(admissionCashDetail.admissionId, printUrl);

//    navigation_item_click("/MC/Admission", "لیست پذیرش صحت");

//});

$("#printAdmissionItemModal").on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchprintAdmissionItemModal(e)
});

//$("#printAdmissionItemModal").on("hidden.bs.modal", function (ev) {

//    if (printUrlSale !== "")
//        adm_print(admissionCashDetail.admissionId, printUrlSale);

//    navigation_item_click("/MC/AdmissionItem", "لیست کالا");

//});
////////////////////////////////////// END PRINT ADMISSIONORSALE////////////////////////////////////





////////////////////////////////////// START SHOW REQUESTS /////////////////////////
function buildAdmissionListForm(admissions, admissionMasterId) {

    
    $("#admissionListTableForm").html("")

    let strTable = ""
    strTable = `
                    <thead class="table-thead-fixed">
                         <tr>
                             <th class="col-width-percent-3">ردیف</th>
                             <th class="col-width-percent-6">شناسه</th>
                             <th class="col-width-percent-8">نمبرتذکره</th>
                             <th class="col-width-percent-10">نام و  تخلص</th>
                             <th class="col-width-percent-19">جریان کار</th>
                             <th class="col-width-percent-18">مرحله</th>
                             <th class="col-width-percent-13">مبلغ</th>
                             <th class="col-width-percent-10">عملیات</th>
                         </tr>
                     </thead>
                     <tbody id="admissionListTbody">`


    if (checkResponse(admissions) && admissions.length != 0) {
        
        for (let i = 0; i < admissions.length; i++) {
            strTable += `<tr id="admL${i}" 
                             data-id="${admissions[i].id}" 
                             onclick="trOnclickAdmissionListForm(${i},'admissionListTableForm',event)" 
                             onkeydown="trOnkeydownAdmissionListForm(${i},'admissionListTableForm',event)" 
                             tabindex="-1"
                             data-admissionid="${admissions[i].id}"
                             data-workflowid="${admissions[i].workflowId}"
                             data-stageid="${admissions[i].stageId}"
                             data-actionid="${admissions[i].actionId}"
                             data-medicalrevenue="${admissions[i].medicalRevenue}"
                             data-admissionamount="${admissions[i].admissionAmount}"    
                             data-branchid="${admissions[i].branchId}">
                                 <td class="text-center">${i + 1}</td>
                                 <td>${admissions[i].id}</td>
                                 <td>${admissions[i].patientNationalCode}</td>
                                 <td>${admissions[i].patientFullName}</td>
                                 <td>${admissions[i].workflow}</td>
                                 <td>${admissions[i].stage}</td>
                                 <td ${admissions[i].admissionAmount < 0 ? "style='color:#da1717'" : ""} >${admissions[i].admissionAmount < 0 ? `(${transformNumbers.toComma(admissions[i].admissionAmount)})` : transformNumbers.toComma(admissions[i].admissionAmount)}</td>
                                 <td>
                                     <button type="button" id="displayAdmissionId${i}" onclick="runBtnDisplayAdmission(${admissionMasterId})" class="btn btn-info" data-toggle="tooltip" title="نمایش">
                                        <i class="fa fa-list"></i>
                                     </button>
                                     <button type="button" id="printAdmissionId${i}" onclick="runBtnPrintAdmission(${admissions[i].id},${i},event)" class="btn btn-print" data-toggle="tooltip" data-placement="top" title="چاپ">
                                         <i class="fa fa-print"></i>
                                     </button>
                                </td>
                        </tr>`
        }

    }
    else
        strTable += `<tr><td colspan="8" class="text-center">سطری وجود ندارد</td></tr>`

    strTable += `</tbody>`

    $("#admissionListTableForm").append(strTable)

    $("#admissionListTableForm #admL0").addClass("highlight")
}

function runBtnDisplayAdmission(admissionMasterId) {
    
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)
}

function runBtnPrintAdmission(admissionId, rowNo, e) {

    rowNumberAdmission = admissionId

    let stageId = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("stageid");
    let workflowId = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("workflowid");
    let medicalrevenue = +$(`#admissionListForm  tbody tr#admL${rowNo} `).data("medicalrevenue");


    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId
    let checkController = admissionTypeId === 1 ? "AdmissionItemApi" : "AdmissionApi"

    var check = controller_check_authorize(checkController, "PRN");
    if (!check)
        return;


    if (admissionTypeId == 1) {

        $("#modal_keyid_valueItem").text(admissionId);

        if (medicalrevenue != 1)
            $("#PrnAdmissionItem .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmissionItem .card-body .PrnModalDiv:last").removeClass("d-none");

        if (medicalrevenue == 2)
            contentPrintAdmissionSale(admissionId);
        else
            modal_show(`PrnAdmissionItem`)

    }
    else {

        $("#modal_keyid_value").text(admissionId);

        if (medicalrevenue != 1)
            $("#PrnAdmission .card-body .PrnModalDiv:last").addClass("d-none");
        else
            $("#PrnAdmission .card-body .PrnModalDiv:last").removeClass("d-none");

        if (medicalrevenue == 2)
            contentPrintAdmission(admissionId)
        else
            modal_show(`PrnAdmission`)
    }

}

function trOnclickAdmissionListForm(row, tabelId, ev) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#admL${row}`).addClass("highlight");
    $(`#${tabelId} tr#admL${row}`).focus();
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

function trOnkeydownAdmissionListForm(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row - 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row - 1}`).addClass("highlight");
            $(`#${tabelId} tr#admL${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#admL${row + 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#admL${row + 1}`).addClass("highlight");
            $(`#${tabelId} tr#admL${row + 1}`).focus();
        }
    }
}

function getAdmissionListForm(admissionMasterId = 0) {

    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getmasteradmissions/${admissionMasterId}`

        $.ajax({
            url: url,
            async: true,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                if (checkResponse(result) && result.length > 0)
                    buildAdmissionListForm(result, admissionMasterId)
                else
                    buildAdmissionListForm([],0)
            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildAdmissionList([])
            }
        });

    }
    else
        buildAdmissionListForm([],0)

}

function displayMasterCashRequest(admissionMasterId) {

    $("#admissionCashPayInfoModalId").text(admissionMasterId)

    if (admissionMasterId != 0) {

        let url = `${viewData_baseUrl_MC}/AdmissionMasterApi/getadmissioncashbymaster/${admissionMasterId}`

        $.ajax({
            url: url,
            async: false,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {

                if (checkResponse(result) && result.length > 0)
                    buildCashRequest(result)
                else
                    buildCashRequest([])

            },
            error: function (xhr) {
                error_handler(xhr, url);
                buildCashRequest([])
            }
        });

    }
    else
        buildCashRequest([])

}

function buildCashRequest(cashInfo) {

    modal_show("admissionCashInfoModal")

    $("#admissionCashPayInfo").html("")

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

        for (let i = 0; i < cashInfo.length; i++) {
            strTable += `<tr id="cashInfo_${i}" 
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
                         </tr>`
        }

    }
    else
        strTable += `<tr><td colspan="8" class="text-center">سطری وجود ندارد</td></tr>`

    strTable += `</tbody>`

    $("#admissionCashPayInfo").append(strTable)

    $("#admissionCashPayInfo #cashInfo_0").click()


}

function trOnclickCashInfo(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row}`).addClass("highlight");
    $(`#${tabelId} tr#cashInfo_${row}`).focus();

    
    let id = $(elm).data("cashid")
    getAdmissionCashRequestsDisplay(id)
}

function getAdmissionCashRequestsDisplay(cashId = null) {

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

                    let arr_tempCashDisplay = []
                    let defaultCurrency = getDefaultCurrency()

                    for (var i = 0; i < payments.length; i++) {
                        modelCashLine = {
                            headerId: cashId,
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
        $("#tempCashDisplay").html(`<tr id="emptyRow"> <td colspan="11" class="text-center">سطری وجود ندارد</td></tr>`);
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
                                tabindex="-1"
                            >
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
                      </tr>`;
        }


        $(`#tempCashDisplay`).html(output);

        setTimeout(() => {
            $("#tempCashDisplay tr#c_0").click()
        }, 50)

    }

}

//function sumCashAdmSum(arr_tempCashDisplay) {

//    if (arr_tempCashDisplay !== null)

//        if (arr_tempCashDisplay.length !== 0) {

//            let sumCash = sumPayAmountCashAdmDisplay(arr_tempCashDisplay);

//            if (sumCash >= 0)
//                $("#sumPayAmountCashAdmDisplay").text(transformNumbers.toComma(sumCash));
//            else
//                $("#sumPayAmountCashAdmDisplay").text(`(${transformNumbers.toComma(Math.abs(sumCash))})`);

//            $("#sumRowCashDisplay").removeClass("displaynone");

//        }
//        else {
//            $("#sumPayAmountCashAdmDisplay").text("");
//        }

//}

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

function trOnclickCashInfoDetails(row, tabelId, ev, elm) {
    ev.preventDefault();
    $(`#${tabelId} .highlight`).removeClass("highlight");
    $(`#${tabelId} tr#c_${row}`).addClass("highlight");
    $(`#${tabelId} tr#c_${row}`).focus();
}

function trOnKeydownCashInfoDetails(row, tabelId, ev) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row - 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row - 1}`).addClass("highlight");
            $(`#${tabelId} tr#c_${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${tabelId} tr#c_${row + 1}`).length != 0) {
            $(`#${tabelId} .highlight`).removeClass("highlight");
            $(`#${tabelId} tr#c_${row + 1}`).addClass("highlight");
            $(`#${tabelId} tr#c_${row + 1}`).focus();
        }
    }
}
////////////////////////////////////// START SHOW REQUESTS /////////////////////////




////////////////////////////////////// START REQUEST ////////////////////////////////////////////
function selectRequestCancel() {
    modal_close("admissionRequestModal");
}
////////////////////////////////////// END REQUEST ////////////////////////////////////////////


initAdmissionCashUpd()

