
async function getPrescriptionInfoDetails(EPrescriptionId, ParaTypeCode, rowNo, tableId, id) {
    loadingAsync(true, id, "fas fa-info");
    await addWaitingHIDAsync(EPrescriptionId, ParaTypeCode, rowNo, tableId)
        .then(({ EPrescriptionId, ParaTypeCode, rowNo, tableId }) => {

            let url = `${viewData_baseUrl_MC}/tamin/geteprescriptiondetail`,
                model = {
                    requestId: EPrescriptionId,
                    paraClinicTypeCode: ParaTypeCode
                };

            fetchGetPrescriptionDetails(url, model)
                .then(result => {
                    loadingAsync(false, id, "fas fa-info");
                    if (checkResponse(result) && result.successfull) {
                        result.problems = !checkResponse(result.problems) ? [] : result.problems;

                        if (result.problems.length > 0) {
                            alertify.warning(generateErrorStringTamin(result.problems)).delay(alertify_delay);
                            removeWaitingHIDAsync(rowNo, tableId);
                            return;
                        }
                        appendPrescriptionInfoDetails(result.data, rowNo, tableId);
                    }
                    else {
                        removeWaitingHIDAsync(rowNo, tableId);
                        alertify.warning("پاسخی از وب سرویس دریافت نشد. دوباره تلاش نمایید").delay(alertify_delay);
                    }
                });
        });
}

async function addWaitingHIDAsync(EPrescriptionId, ParaTypeCode, rowNo, tableId) {

    $(`#${tableId} #row${rowNo}`).addClass("operating-success");
    return { EPrescriptionId, ParaTypeCode, rowNo, tableId };
}

async function removeWaitingHIDAsync(rowNo, tableId) {

    $(`#${tableId} #row${rowNo}`).removeClass("operating-success");
}

async function fetchGetPrescriptionDetails(url, model) {
    return await fetchManager(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model),
    });
}

function appendPrescriptionInfoDetails(res, rowNo, tableId) {

    if (checkResponse(res)) {

        let result = res.detailList;
        let resLn = result.length, output = "", data = {}, sum = 0;

        output = `<tr>
                          <td>${res.ePrescriptionId}</td>
                          <td>${res.paraTypeCode} - ${res.paraTypeName}</td>
                          <td>${res.nationalCode}</td>
                          <td>${res.attenderFullName}</td>
                          <td>${res.attenderMSC}</td>
                          <td>${res.attenderSpecialityName}</td>
                          <td>${res.prescriptionDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')}</td>
                      </tr>`;

        $("#tempHeaderPrescriptionInfo").html(output);

        output = "";

        $("#tempPrescriptionInfo").html(output);

        for (var i = 0; i < resLn; i++) {
            data = result[i];
            output += `<tr id="prD_${i + 1}">
                          <td>${i + 1}</td>
                          <td><h6><span>${data.serviceTarefCode}</span><span onclick="copyServiceTarefCode('${data.serviceTarefCode}')" title="کپی کد خدمت" class="badge badge-primary" style="float:left"><i class="fa fa-copy"></i></span></h6></td>
                          <td>${data.serviceTarefName}</td>
                          <td>${data.paraClinicTypeCode} - ${data.paraClinicTypeName}</td>
                          <td>${data.requestQuantity}</td>
                          <td>${data.remainingQuantity}</td>
                          <td>${transformNumbers.toComma(data.serviceTarefPrice)}</td>
                      </tr>`;
            sum += +data.serviceTarefPrice;
        }

        removeWaitingHIDAsync(rowNo, tableId);
        $("#tempPrescriptionInfo").html(output);
        $("#sumPrescriptionInfo .sum-prescription").html(transformNumbers.toComma(sum));

        modal_show(`prescriptionInfoModal`);

    }
    else {

        $("#tempPrescriptionInfo").html(fillEmptyRow(7));
        $("#tempHeaderPrescriptionInfo").html("");
        $("#sumPrescriptionInfo .sum-prescription").html(0);

        modal_show(`prescriptionInfoModal`);
        removeWaitingHIDAsync(rowNo, tableId);
    }
}

function copyServiceTarefCode(serviceTarefCode) {
    navigator.clipboard.writeText(serviceTarefCode);
}