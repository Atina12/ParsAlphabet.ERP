
//#region variables

var viewData_form_title = "Stand",
    viewData_modal_title = "",
    viewData_controllername = "AdmissionCashStandApi",
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Admission.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    timingPage = null,
    viewData_print_url = `/Report/Print`, timePageSecend = 0, timerPageSecend = $("#timerPageSecond"),
    admSelected = { admissionId: 0, admissionWorkflowId: 0, admissionStageId: 0, admissionActionId: 0, admissionTypeId: 0, netAmount: 0 };

//#endregion

$("#barcode").keydown(async function (e) {
    if (e.keyCode == KeyCode.Enter)
        filterByBarcode();
});

async function filterByBarcode() {

    if ($("#barcode").val().trim() == "")
        return

    var arrayBarcodeSplited = $("#barcode").val().split("-");

    let admissionId = +arrayBarcodeSplited[0];
    let admissionStageId = +arrayBarcodeSplited[1];
    let admissionWorkflowId = +arrayBarcodeSplited[2];

    $("#barcode").attr("disabled", true);
    $("#barcodeReset").attr("disabled", true)

    await get_patientInfo(admissionId, admissionStageId, admissionWorkflowId, true);
}

function get_patientInfo(admissionId, admissionStageId, admissionWorkflowId, isBracode = false) {

    let workflowStage = getAdmissionTypeId(admissionStageId, admissionWorkflowId)
    let admissionTypeId = ""

    if (checkResponse(workflowStage))
        admissionTypeId = workflowStage.admissionTypeId
    else {
        alertByStatus(9, "خطای سیستمی دوباره تلاش کنید")
        $("#barcode").removeAttr("disabled");
        $("#barcodeReset").removeAttr("disabled")
        $("#barcodeReset").click()
        return
    }

    admSelected.admissionTypeId = admissionTypeId

    get_patientInfoAsync(admissionId, admissionTypeId).then(
        (res) => {
            if (res != null)
                fill_patientInfo(res, admissionTypeId, isBracode);
            else {
                alertByStatus(1)
            }
        }
    );
}

function getAdmissionTypeId(admissionStageId, admissionWorkflowId) {

    let admissionTypeIdUrl = `/api/WF/StageActionOriginDestinationApi/getworkflowstage/${admissionWorkflowId}/${admissionStageId}`

    response = $.ajax({
        url: admissionTypeIdUrl,
        type: "get",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, admissionTypeIdUrl);
            return null
        }
    });

    return response.responseJSON;

}

async function get_patientInfoAsync(admissionId, admissionTypeId) {

    let response = null;

    let url = "";


    if (admissionTypeId === 2 || admissionTypeId === 3 || admissionTypeId === 4)
        url = `${hostDataPart.httpWithHostNameAndPort}${viewData_baseUrl_MC}/${viewData_controllername}/GetServicePatientInfo`;
    else
        url = `${hostDataPart.httpWithHostNameAndPort}${viewData_baseUrl_MC}/${viewData_controllername}/GetSalePatientInfo`;

    response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(admissionId),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return { data: null };
        }
    });

    return response;
}

function fill_patientInfo(res, admissionTypeId) {

    //$("#saleTypeId").val(res == null ? "" : res.medicalRevenue);
    //$("#admissionTypeId").val(res == null ? "" : admissionTypeId);

    admSelected.admissionWorkflowId = res == null ? 0 : res.admissionWorkflowId;
    admSelected.admissionStageId = res == null ? 0 : res.admissionStageId;
    admSelected.admissionActionId = res == null ? 0 : res.admissionActionId;
    admSelected.admissionId = res == null ? 0 : res.admissionId;
    admSelected.netAmount = res == null ? 0 : res.payAmount;

    $("#text_fieldset").removeClass("d-none");

    $("#serviceNetAmountOrSaleNetAmount").text(res == null ? "" : transformNumbers.toComma(res.payAmount) + " ريال ");

    if (admissionTypeId === 1) {
        $("#service_fieldset").addClass("d-none")
        $("#item_fieldset").removeClass("d-none")
        $("#saleAdmissionId").text(res == null ? "" : res.admissionId);
        $("#salePatientName").text(res == null ? "" : res.patientName);
        $("#saleNetAmount").val(res == null ? "" : transformNumbers.toComma(res.payAmount) + " ريال ");
    }
    else {
        $("#service_fieldset").removeClass("d-none")
        $("#item_fieldset").addClass("d-none")
        //$("#patientId").val(res == null ? "" : res.patientId);
        $("#serviceAdmissionId").text(res == null ? "" : res.admissionId);
        $("#servicePatientName").text(res == null ? "" : res.patientName);
        $("#basicInsurerName").val(res == null ? "" : res.basicInsurerName);
        $("#compInsurerName").val(res == null ? "" : res.compInsurerName);
        $("#thirdPartyName").val(res == null ? "" : res.thirdPartyName);
        $("#serviceNetAmount").val(res == null ? "" : transformNumbers.toComma(res.payAmount) + " ريال ");
    }

    if (res !== null) {
        sendToPcPos()
    }

}

async function loadingAsync(loading, element) {
    if (loading)
        $(element).find("i").addClass(`fa fa-spinner fa-spin`);
    else
        $(element).find("i").removeClass("fa fa-spinner fa-spin").addClass("fa fa-check")
}

//#region pcPos
function sendToPcPos() {

    refreshTimingPage()

    let result = getPeymentStatus(admSelected.admissionId, admSelected.admissionWorkflowId, admSelected.admissionStageId, admSelected.admissionActionId);

    if (!result) {
        alertByStatus(2)
        return
    }

    if (result) {
        try {

            $(".image-arrow-figure-pay").addClass("d-none");

            let modelSend = {
                PayerId: `${admSelected.admissionId}${admSelected.admissionStageId}${admSelected.admissionWorkflowId}`,
                Amount: admSelected.netAmount
            };

            if (modelSend.Amount < 10000) {
                alertByStatus(3)
                return;
            }

            $(".waiting-card").removeClass("d-none");
            $("#service_fieldset").addClass("d-none")
            $("#item_fieldset").addClass("d-none")
            $("#barcode").attr("disabled", true);
            $("#barcodeReset").attr("disabled", true);

            posPayment(modelSend).then(function (result) {
                handlerPos(result, modelSend.PayerId);
            })

        }
        catch (e) {
            alertByStatus(4)
            console.log("STAND Error Try Chatch:", e);
            return;
        }

    }
    else {
        alertByStatus(5)
        return;
    }
}

async function posPayment(modelSend) {

    let url = posBaseUrl.behPardakht.payment;

    let output = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSend),
        cache: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null
        }
    });

    return output;
}

function handlerPos(result, admissionId) {

    var admissionTypeId = admSelected.admissionTypeId;

    if (!result.successfull) {
        let error = generateErrorString(result.validationErrors);
        alertByStatus(6, error)
    }
    else {
        let returnCode = 0, reasonCode = 0, returnMessage = "", reasonMessage = "", data = result.data;

        returnCode = +data.returnCode;//100
        reasonCode = data.reasonCode == "" ? -1 : +data.reasonCode;//0

        returnMessage = returnCode + " - " + dataPcPos.returnCode[returnCode];
        reasonMessage = reasonCode == -1 ? "" : reasonCode + " - " + dataPcPos.reasonCode[reasonCode];

        if (returnCode == 100) {
            saveAdmissionCashStand(data).then(result => {
                if (result == null || !result.successfull) {
                    alertByStatus(7, result)
                }
                else {

                    if (admissionTypeId == 1)
                        contentPrintAdmissionSale(admSelected.admissionId);
                    else
                        contentPrintAdmissionCompress(admSelected.admissionId);

                    beep(300, 2500, 15);
                    resetAllAction()
                }
            });
        }
        else {
            let messages = reasonMessage !== "" ? [returnMessage, reasonMessage] : [returnMessage];
            let error = generateErrorString(messages);
            alertByStatus(9, error)
        }

    }

}
//#endregion

//#region save&print

async function saveAdmissionCashStand(pcPosResult) {


    var admissionId = admSelected.admissionId;

    var admissionStageId = admSelected.admissionStageId
    var admissionWorkflowId = admSelected.admissionWorkflowId
    var admissionActionId = admSelected.admissionActionId

    var workflowId = admissionWorkflowId;
    var stageId = 66;
    var actionId = 28;

    var admissionPatientId = +$("#patientId").val()

    var model = {
        admissionId,
        admissionStageId,
        admissionWorkflowId,
        admissionActionId,

        stageId,
        workflowId,
        actionId,

        admissionPatientId: admissionPatientId,
        netAmount: +pcPosResult.totalAmount,
        exchangeRate: 1,
        terminalNo: pcPosResult.terminalNo,
        accountNo: pcPosResult.accountNo,
        refNo: pcPosResult.traceNumber,
        createDateTimePersian: pcPosResult.transactionDate + " " + pcPosResult.transactionTime,
        posId: pcPosResult.posId,
        branchId: pcPosResult.branchId,
    };

    let url = `${hostDataPart.httpWithHostNameAndPort}${viewData_baseUrl_MC}/${viewData_controllername}/SaveAdmissionCashStand`;

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return output.responseJSON;
}

//#endregion

function resetAllAction() {
    resetAll();
    resetTimePage();
}

function resetAll(isCancel = false) {
    $(".image-arrow-figure-pay").removeClass("d-none");
    fill_patientInfo(null, 1);
    fill_patientInfo(null, 2);
    $(".filter-item").removeClass("stand-filter-item-btn");
    $("#service_fieldset").addClass("d-none");
    $(".waiting-card").addClass("d-none")
    $("#barcode").attr("disabled", false);
    $("#barcodeReset").attr("disabled", false);
    $("#text_fieldset").addClass("d-none");
    $("#barcode").val("").focus();
    if (isCancel)
        resetTimePage();
}

$(document).ready(function () {
    $(document).on("click", function () {
        $("#barcode").focus()
    })
    setInterval(reLoadFrom, 600000);
    setTimeout(function () {
        $("#barcode").val("");
        $("#barcode").focus();
        $("#barcode").click();
    }, 100);
})

function reLoadFrom() {
    if (getrefreshkiosk()) {
        updaterefreshkiosk();
        document.location.reload(true);
    }
}

function getPeymentStatus(admissionId, admissionWorkflowId, admissionStageId, admissionActionId) {

    let url = `${viewData_baseUrl_MC}/AdmissionCashApi/getadmissioncashpaymentinfo`;

    let model = {
        admissionId,
        admissionWorkflowId,
        admissionStageId,
        admissionActionId
    };

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(model),
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });



    let response = output.responseJSON;
    let result = response.data

    if (result == null)
        return false;

    if (!response.successfull)
        return false;
    else
        return result.payableAmount != 0;

}

function updaterefreshkiosk() {
    let output = $.ajax({
        url: `api/SetupApi/updaterefreshkiosk`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: result => result,
        error: () => null
    });
    return output.responseJSON;
}

function getrefreshkiosk() {
    let output = $.ajax({
        url: `api/SetupApi/getrefreshkiosk`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: result => result,
        error: () => null
    });
    return output.responseJSON;
}

function configTimingPage() {
    timerPageSecend.text(timePageSecend++);
}

function resetTimePage() {
    clearInterval(timingPage);
    refreshTimingPage(true);
    timingPage = null;
}

function refreshTimingPage(isClear = false) {

    if (timingPage == null && !isClear) {
        timingPage = setInterval(configTimingPage, 1000)
    }
    else {
        timePageSecend = 0
        timerPageSecend.text('0')
    }

};

function alertByStatus(status, error = null) {

    if (status == 1)
        alertify.alert("-", `<div class="text-danger">${cashStandMessage.notPossiblePayment}</div>`, /*() => $("#barcode").focus()*/);
    else if (status == 2)
        alertify.alert('خطای سرور', `<div class="text-danger">${cashStandMessage.errorSystem}</div>`, /*() => $("#barcode").focus()*/);
    else if (status == 3)
        alertify.alert('خطا', `<div class="text-danger">${cashStandMessage.min10000}</div>`, /*() => $("#barcode").focus()*/);
    else if (status == 4)
        alertify.alert('خطای سرور', `<div class="text-danger">${cashStandMessage.errorSystem}</div>`, /*() => $("#barcode").focus()*/);
    else if (status == 5)
        alertify.alert('خطای سرور', `<div class="text-danger">این پذیرش قبلا پرداخت شده است.</div>`, /*() => $("#barcode").focus()*/);
    else if (status == 6)
        alertify.alert('خطای دستگاه پز', `<div class="text-danger">${error}</div>`, /*() =>  $("#barcode").focus() */);
    else if (status == 7)
        alertify.alert('خطای دستگاه پز', `<div class="text-danger">${error.statusMessage}</div>`, /*() => $("#barcode").focus()*/);
    //else if (status == 8)
    //    alertify.alert('دستگاه پز', `<div class="text-success">${error.statusMessage}</div>`, () => $("#barcode").focus());
    else if (status == 9)
        alertify.alert('خطای دستگاه پز', `<div class="text-danger">${error}</div>`, /*() => $("#barcode").focus()*/);


    setTimeout(() => {
        if (!$(".ajs-close").parent().parent().parent().parent().hasClass("ajs-hidden"))
            $(".ajs-close").click()
    }, 3000);

    resetAllAction()
}

function beep(duration, frequency, volume) {
    return new Promise((resolve, reject) => {
        const myAudioContext = new AudioContext();
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try {
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type = "square";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        } catch (error) {
            reject(error);
        }
    });
}

$("body").on("focus", function () {
    $("#barcode").val("");
    $("#barcode").focus();
});