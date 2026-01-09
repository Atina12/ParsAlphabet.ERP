var viewData_controllername = "PrescriptionTaminApi",
    viewData_get_prescriptionTamin = `${viewData_baseUrl_MC}/${viewData_controllername}/display`,
    viewData_getPrescriptionTaminCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    arrayLines = [], typeSave = "INS", identityForm = $("#prescriptionTaminId").val();

async function initPrescriptionForm() {
    
    await ColumnResizeable("list_1");
    await ColumnResizeable("list_2");
    await ColumnResizeable("list_3");
    await ColumnResizeable("list_5");
    await ColumnResizeable("list_6");
    await ColumnResizeable("list_4");
    await ColumnResizeable("list_7");
    await ColumnResizeable("list_12");
    await ColumnResizeable("list_13");
    await ColumnResizeable("list_14");
    await ColumnResizeable("list_17");
    await ColumnResizeable("list_16");
    getPrescriptionTamin(identityForm);
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistPrescriptionId(+elm.val());
        if (checkExist) {
            getPrescriptionTamin(+elm.val(), 0);
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistPrescriptionId(id) {

    let outPut = $.ajax({
        url: viewData_getPrescriptionTaminCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getPrescriptionTaminCheckExist);
        }
    });
    return outPut.responseJSON;
}

function display_pagination(opr) {
    var elemId = $("#prescriptionTaminId").val();
    display_paginationAsync(opr, elemId);
}

async function display_paginationAsync(opr, elemId) {

    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }
    getPrescriptionTamin(elemId, headerPagination);
}

function getPrescriptionTamin(prescriptionId, headerPagination = 0) {
    let nextPrescriptionModel = {
        prescriptionId: prescriptionId,
        headerPagination: headerPagination
    }

    $.ajax({
        url: viewData_get_prescriptionTamin,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(nextPrescriptionModel),
        success: function (data) {

            resetPrescriptionFormTamin();
            if (data != null && data != undefined) {
                fillPrescriptionTamin(data);
                if (data.prescriptionTypeId == 6)
                    $(`[href="#box_12"]`).click()
                else {

                    if (checkResponse(data.prescriptionLines))
                        $(`[href="#box_${data.prescriptionLines[0].serviceTypeId}"]`).click();
                }
            }
            //$(`#prescriptionLink${data.prescriptionTypeId}`).click();
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_prescriptionTamin);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

};

function resetPrescriptionFormTamin() {
    $("#prescriptionTaminId").val(0);
    $("#temp_1").html(fillEmptyRow(7));
    $("#temp_17").html(fillEmptyRow(3));
    $("#temp_12").html(fillEmptyRow(3));
    $("#temp_2").html(fillEmptyRow(3));
    $("#temp_3").html(fillEmptyRow(3));
    $("#temp_4").html(fillEmptyRow(3));
    $("#temp_5").html(fillEmptyRow(3));
    $("#temp_6").html(fillEmptyRow(3));
    $("#temp_13").html(fillEmptyRow(7));
    $("#temp_7").html(fillEmptyRow(3));
    $("#temp_14").html(fillEmptyRow(3));
}

function fillPrescriptionTamin(pr) {

    if (pr !== null && pr != undefined) {
        $("#userFullName").val(`${pr.createUserId} - ${pr.createUserFullName}`);
        $("#creatDateTime").val(pr.createDateTimePersian);
        $("#prescriptionBox").removeClass("displaynone");
        $("#expiryDatePersian").val(pr.expireDatePersian);
        $("#note").val(pr.comment);
        $('#prescriptionTaminId').val(pr.id)

        fillAdmissionInfo(pr.admissionServiceTaminId, pr.patientId, pr.patientFullName, pr.patientNationalCode, pr.basicInsrerName,
            pr.basicInsuranceBoxName, pr.compInsuranceBoxName, pr.attenderFullName, pr.thirdPartyId, pr.thirdPartyName)

        if (pr.prescriptionTypeId == 3) {
            $("#description").val(pr.comment);
            return;
        }

        fillLinePrescriptionTamin(pr.prescriptionLines, pr.prescriptionLines[0].taminPrescriptionTypeId);
    }
};

function fillAdmissionInfo(...data) {
    $("#admissionSelected")
        .html(`<tr>
            <td>${data[0]}</td> 
            <td>${data[1]} - ${data[2]}</td> 
            <td>${data[3] == null ? "" : data[3]}</td> 
            <td>${data[4] == null ? "" : data[4]}</td> 
            <td>${data[5] == null ? "" : data[5]}</td> 
            <td>${data[6] == null ? "" : data[6]}</td> 
            <td>${data[8] == 0 ? "" : `${data[8]} - ${data[9]}`}</td>
            <td>${data[7] == null ? "" : data[7]}</td> 
        </tr>`);
}

function fillLinePrescriptionTamin(prescriptionLines, prescriptionTypeId) {
    appendLines(prescriptionLines, prescriptionTypeId)
}

function appendLines(data, prescriptionType) {
    
    if (!checkResponse(data))
        return;

    let type = +prescriptionType;//data[0].serviceTypeId




    if (+prescriptionType == 6)
        type = 12

    datalength = data.length
    if (datalength > 0) {

        if (+prescriptionType == 6) {
            $(`[href="#box_12"]`).click();
        }
        else {
            $(`[href="#box_${type}"]`).click();
        }
    }
    for (var i = 0; i < datalength; i++) {

        let output = "",
            tbodyTable = $(`#temp_${type}`);

        if ($(`#temp_${type} tr:not(#emptyRow)`).length == 0)
            tbodyTable.html("");

        output = `<tr id="row_${i + 1}_${type}">
                        <td style="width:6px;">${i + 1}</td>`;
        switch (+type) {
            case 1:
                output += `
                        <td style="width:46px;">${data[i].serviceId != 0 ? `${data[i].serviceId} - ${data[i].serviceCodeName}` : ""}</td>
                        <td style="width:4px;">${data[i].quantity}</td>
                        <td style="width:8px;">${data[i].drugInstructionId != 0 ? `${data[i].drugInstructionId} - ${data[i].drugInstructionName}` : ""}</td>  
                        <td style="width:8px;">${data[i].drugAmountId != 0 ? `${data[i].drugAmountId} - ${data[i].drugAmountName}` : ""}</td>  
                        <td style="width:8px;">${data[i].drugUsageId != 0 ? `${data[i].drugUsageId} - ${data[i].drugUsageName}` : ""}</td>
                        <td style="width:4px;">${data[i].repeat}</td>
                        <td style="width:6px;">${data[i].doDatePersian != null && data[i].doDatePersian != "" ? data[i].doDatePersian : ""}</td >`;

                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 12:
            case 14:
            case 17:
                output += `
                        <td style="width:84px;">${data[i].serviceId != 0 ? `${data[i].serviceId} - ${data[i].serviceCodeName}` : ""}</td>
                        <td style="width:10px;">${data[i].quantity}</td>`;
                break;

            case 13:
                output += `
                        <td style="width:58px;">${data[i].serviceId != 0 ? `${data[i].serviceId} - ${data[i].serviceCodeName}` : ""}</td>
                        <td style="width:6px;">${data[i].quantity}</td>
                        <td style="width:7px;">${data[i].parentOrganId != 0 ? `${data[i].parentOrganId} - ${data[i].parentOrganName}` : ""}</td>
                        <td style="width:7px;">${data[i].organId != 0 ? `${data[i].organId} - ${data[i].organName}` : ""}</td>
                        <td style="width:7px;">${data[i].illnessId != 0 ? `${data[i].illnessId} - ${data[i].illnessName}` : ""}</td>
                        <td style="width:7px;">${data[i].planId != 0 ? `${data[i].planId} - ${data[i].planCodeName}` : ""}</td>`;
                break;

            default:
                break;
        }
        output += `</tr>`;
        tbodyTable.append(output);
        arrayLines.push(data[i]);
    }
}

initPrescriptionForm();