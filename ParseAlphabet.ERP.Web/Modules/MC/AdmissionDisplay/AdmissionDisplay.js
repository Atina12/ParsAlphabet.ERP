var sumNetAmountRequest = 0, sumNetAmountCash = 0, arr_TempDiagnosisDisplay = [];

function getRequestData(displayUrlApi, admissionTypeId, requestId) {

    displayLoading(admissionTypeId, true)
    loaderOnPageTable(true, "tbadmissionWorkFlow")
    loaderOnPageTable(true, "admissionWorkFlowDetailGet")

    $.ajax({
        url: displayUrlApi,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(requestId),
        success: function (result) {
            displayLoading(admissionTypeId, false)
            $("#admissionIdDisplay").text(requestId)
            fillRequestData(result, admissionTypeId);
            fillAdmissionWorkFlowGet(result, admissionTypeId);
        },
        error: function (xhr) {
            displayLoading(admissionTypeId, false)
            error_handler(xhr, displayUrlApi);
        }
    });
}

function displayLoading(admissionTypeId, on) {

    //if (admissionTypeId == 1)
    loaderOnPageTable(on, "itemSection")
    //else if (admissionTypeId == 2)
    loaderOnPageTable(on, "serviceSection")
    //else if (admissionTypeId == 3)
    loaderOnPageTable(on, "serviceSectionTamin")
    //else if (admissionTypeId == 4)
    loaderOnPageTable(on, "serviceSectionPrescriptionTamin")
}

function fillRequestData(result, admissionType) {
    if (result !== null) {

        if (admissionType === 1)
            configDisplayItem(result)
        else if (admissionType === 2)
            configDisplayAdmission(result)
        else if (admissionType === 3)
            configDisplayAdmissionTamin(result)
        else if (admissionType === 4)
            configDisplayAdmissionEprescriptionTamin(result)


        $("#sumNetAmountRequest").text(sumNetAmountRequest >= 0 ? transformNumbers.toComma(sumNetAmountRequest) : `(${transformNumbers.toComma(Math.abs(sumNetAmountRequest))})`);
        $("#rowSumRequest").removeClass("displaynone");
        modal_show('admissionRequestDisplayModal');

    }
}

function configDisplayItem(result) {

    requestServiceOrItem(result, 1)

    $("#serviceSection").addClass("d-none");
    $("#itemSection").removeClass("d-none");
    $("#serviceSectionTamin").addClass("d-none");
    $("#serviceSectionPrescriptionTamin").addClass("d-none");
    $("#tempDisplayPrsTaminFielset").addClass("d-none");

    $("#patientSale").html("");
    let output = `<tr>
                                <td class="text-burlywood">${result.patientId}-${result.patientFullName}</td>
                                <td>${result.idCardNumber}</td>
                                <td>${result.patientBirthDatePersian != "" ? result.patientBirthDatePersian.split(" ")[0] : ""}</td>
                                <td>${result.genderName}</td>
                                <td>${result.countryName}</td>
                                <td>${result.postalCode != null ? result.postalCode : ""}</td>
                                <td>${result.jobTitle != null ? result.jobTitle : ""}</td>
                                <td>${result.phoneNo != null ? result.phoneNo : ""}</td>
                                <td>${result.mobileNo != null ? result.mobileNo : ""}</td>
                                <td>${result.maritalStatusName != null ? result.maritalStatusName : ""}</td>
                                <td>${result.educationLevelName != null ? result.educationLevelName : ""}</td>
                                <td>${result.patientFatherFirstName != null ? result.patientFatherFirstName : ""}</td>
                                <td>${result.address != null ? result.address : ""}</td>
                           </tr>`;

    $("#patientSale").html(output);
}

function configDisplayAdmission(result) {

    requestServiceOrItem(result, 2)

    $("#serviceSection").removeClass("d-none");
    $("#itemSection").addClass("d-none");
    $("#serviceSectionTamin").addClass("d-none");
    $("#serviceSectionPrescriptionTamin").addClass("d-none");
    $("#tempDisplayPrsTaminFielset").addClass("d-none");

    $("#patientAdmission").html("");
    let output = `<tr>
                            <td class="text-burlywood">${result.patientId}-${result.patientFullName}</td>
                            <td>${result.nationalCode}</td>
                            <td>${result.genderName}</td>
                            <td>${result.countryName}</td>
                            <td>${result.postalCode != null ? result.postalCode : ""}</td>
                            <td>${result.idCardNumber != null ? result.idCardNumber : ""}</td>
                            <td>${result.mobileNo != null ? result.mobileNo : ""}</td>
                            <td>${result.maritalStatusName != null ? result.maritalStatusName : ""}</td>
                            <td>${result.educationLevelName != null ? result.educationLevelName : ""}</td>
                            <td>${result.basicInsurerNo !== 0 && result.basicInsurerNo != null ? result.basicInsurerNo : ""}</td>
                            <td>${result.basicInsurerBookletPageNo !== 0 && result.basicInsurerBookletPageNo != null ? result.basicInsurerBookletPageNo : ""}</td>
                            <td>${result.basicInsurerExpirationDatePersian !== null ? result.basicInsurerExpirationDatePersian : ""}</td>
                         </tr>`;
    $("#patientAdmission").html(output);

    fillDiagnosisDisplay(result.admissionDiagnosisList);
}

function configDisplayAdmissionTamin(result) {

    fillPrsListTamin(result);

    requestServiceOrItem(result, 3)

    $("#serviceSection").addClass("d-none");
    $("#itemSection").addClass("d-none");
    $("#serviceSectionTamin").removeClass("d-none");
    $("#serviceSectionPrescriptionTamin").addClass("d-none");
    $("#tempDisplayPrsTaminFielset").removeClass("d-none");



    $("#patientDisplayTamin").html("");
    let output = `<tr>
                   <td class="text-burlywood">${result.patientId} - ${result.patientFullName}</td>
                   <td>${result.nationalCode}</td>
                   <td>${result.inqueryID == null ? 0 : result.inqueryID}</td>
                   <td>${result.genderName}</td>
                   <td>${result.countryName}</td>
                   <td>${result.postalCode == null ? "" : result.postalCode}</td>
                   <td>${result.idCardNumber == null ? "" : result.idCardNumber}</td>
                   <td>${result.mobileNo == null ? "" : result.mobileNo}</td>
                   <td>${result.maritalStatusId !== 0 ? result.maritalStatusName : ""}</td>
                   <td>${result.educationLevelId !== 0 ? result.educationLevelName : ""}</td>
                 </tr>`;

    $("#patientDisplayTamin").html(output);
}

function configDisplayAdmissionEprescriptionTamin(result) {

    requestServiceOrItem(result, 4)

    $("#serviceSection").addClass("d-none");
    $("#itemSection").addClass("d-none");
    $("#serviceSectionTamin").addClass("d-none");
    $("#serviceSectionPrescriptionTamin").removeClass("d-none");
    $("#tempDisplayPrsTaminFielset").addClass("d-none");

    $("#patientDisplayPrescriptionTamin").html("");
    let output = `<tr>
                       <td class="text-burlywood">${result.patientId} - ${result.patientFullName}</td>
                       <td>${result.nationalCode}</td>
                       <td>${result.genderName}</td>
                       <td>${result.countryName}</td>
                       <td>${result.postalCode == null ? "" : result.postalCode}</td>
                       <td>${result.idCardNumber == null ? "" : result.idCardNumber}</td>
                       <td>${result.mobileNo == null ? "" : result.mobileNo}</td>
                       <td>${result.maritalStatusId !== 0 ? result.maritalStatusName : ""}</td>
                       <td>${result.educationLevelId !== 0 ? result.educationLevelName : ""}</td> 
                 </tr>`;

    $("#patientDisplayPrescriptionTamin").html(output);
}

function requestServiceOrItem(result, admissionTypeId) {

    if (admissionTypeId == 1)
        requestServiceOrItemBuild(result)
    else if (admissionTypeId == 2)
        requestServiceOrServiceBuild(result)
    else if (admissionTypeId == 3)
        requestServiceOrServiceTaminBuild(result)
    else if (admissionTypeId == 4)
        requestServiceOrServiceTaminPrescriptionBuild(result)

}

function requestServiceOrItemBuild(result) {
    let createDateTimePersianSplit = result.createDateTimePersian.split(" ")

    let strItem = ""

    strItem += `<thead class="table-thead-fixed">
                        <tr>
                            <th style="width:17rem">نوع مراجعه</th>
                            <th style="width:20rem">بیمه اجباری</th>
                            <th style="width:20rem">صندوق بیمه اجباری</th>
                            <th style="width:10rem">کدملی/نمبر تابعیت (خارجی )</th>
                            <th style="width:20rem">بیمه تکمیلی</th>
                            <th style="width:20rem">صندوق بیمه تکمیلی</th>
                            <th style="width:20rem">طرف قرارداد</th>
                            <th style="width:20rem">تخفیف</th>
                            <th style="width:30rem">مرحله</th>
                            <th style="width:20rem">جریان کار</th>
                            <th style="width:12rem">تاریخ ثبت</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${result.referralTypeId != 0 ? `${result.referralTypeId} - ${result.referralTypeName}` : ""}</th>
                            <td>${result.basicInsurerId != 0 ? `${result.basicInsurerId} - ${result.basicInsurerName}` : ""}</th>
                            <td>${result.basicInsurerLineId != 0 ? `${result.basicInsurerLineId} - ${result.basicInsurerLineName}` : ""}</th>
                            <td>${result.nationalCode}</th>
                            <td>${result.compInsurerId != 0 && result.compInsurerId != null ? `${result.compInsurerId} - ${result.compInsurerName} ` : ""}</th>
                            <td>${result.compInsurerLineId != 0 && result.compInsurerLineId != null ? `${result.compInsurerLineId} - ${result.compInsurerLineName}` : ""}</th>
                            <td>${result.thirdPartyInsurerId != 0 && result.thirdPartyInsurerId != null ? `${result.thirdPartyInsurerId} - ${result.thirdPartyInsurerName}` : ""}</th>
                            <td>${result.discountInsurerId != 0 && result.discountInsurerId != null ? `${result.discountInsurerId} - ${result.discountInsurerName}` : ""}</th>
                            <td>${result.stageId} - ${result.stageName}</th>
                            <td>${result.workflowId} - ${result.workflowName}</th>
                             <td>${createDateTimePersianSplit[0]} - ${createDateTimePersianSplit[1]}</th>
                        </tr>
                    </tbody>
                    `
    $("#requestItemSection").html(strItem)
}

function requestServiceOrServiceBuild(result) {

    let createDateTimePersianSplit = result.createDateTimePersian.split(" ")
    let strItem = ""

    strItem += `<thead class="table-thead-fixed">
                        <tr>
                            <th style="width:13rem">نوع مراجعه</th>
                            <th style="width:20rem">داکتر</th>
                            <th style="width:20rem">شیفت</th>
                            <th style="width:8rem">شماره نوبت</th>
                            <th style="width:7rem">تاریخ رزرو</th>
                            <th style="width:7rem">زمان رزرو</th>
                            <th style="width:20rem">داکتر ارجاع دهنده</th>
                            <th style="width:8rem">تاریخ نسخه</th>                        
                            <th style="width:25rem">بیمه اجباری</th>
                            <th style="width:25rem">صندوق بیمه اجباری</th>
                            <th style="width:10rem">کدملی/نمبر تابعیت (خارجی )</th>
                            <th style="width:25rem">بیمه تکمیلی</th>
                            <th style="width:25rem">صندوق بیمه تکمیلی</th>
                            <th style="width:25rem">طرف قرارداد</th>
                            <th style="width:25rem">تخفیف</th>
                            <th style="width:13rem">شباد</th>
                            <th style="width:12rem">وضعیت فراخوانی</th>
                            <th style="width:12rem">کد ارجاع</th>
                            <th style="width:25rem">علت مراجعه</th>
                            <th style="width:30rem">مرحله</th>
                            <th style="width:12rem">زمان ثبت</th>
                            <th style="width:25rem">شناسه بلاک زمانی</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${result.referralTypeId != null && result.referralTypeId != 0 ? `${result.referralTypeId} - ${result.referralTypeName}` : ""}</td>
                            <td>${result.attenderFullName}</td>
                            <td>${result.reserveShiftId} - ${result.reserveShiftName}</td>
                            <td>${result.admissionNo}</td>
                            <td>${result.reserveDatePersian}</td>
                            <td>${result.reserveTime}</td>
                            <td>${result.referringDoctorId != 0 ? `${result.referringDoctorId} - ${result.referringDoctorName}` : ""}</td>
                            <td>${checkResponse(result.prescriptionDatePersian) && result.prescriptionDatePersian != "" ? result.prescriptionDatePersian : ""}</td>                       
                            <td>${result.basicInsurerId == 0 ? "" : `${result.basicInsurerId} - ${result.basicInsurerName}`}</td>
                            <td>${result.basicInsurerLineId != 0 && result.basicInsurerLineId != null ? result.basicInsurerLineId + ' - ' + result.basicInsurerLineName : ""}</td>
                            <td>${result.nationalCode}</td>
                            <td>${result.compInsurerId != 0 && result.compInsurerId != null ? result.compInsurerId + ' - ' + result.compInsurerName : ""}</td>
                            <td>${result.compInsurerLineId != 0 && result.compInsurerLineId != null ? result.compInsurerLineId + ' - ' + result.compInsurerLineName : ""}</td>
                            <td>${result.thirdPartyInsurerId != 0 && result.thirdPartyInsurerId != null ? result.thirdPartyInsurerId + ' - ' + result.thirdPartyInsurerName : ""}</td>
                            <td>${result.discountInsurerId != 0 && result.discountInsurerId != null ? result.discountInsurerId + ' - ' + result.discountInsurerName : ""}</td>
                            <td>${checkResponse(result.hid) && result.hid != 0 ? result.hid : ""}</td>
                            <td ${result.hidOnline ? `style="color:green"` : `style="color:red"`}>${result.hidOnline ? 'آنلاین' : 'آفلاین'}</td>
                            <td>${checkResponse(result.referredHID) ? result.referredHID : ""}</td>
                            <td>${checkResponse(result.reasonForEncounterName) ? result.reasonForEncounterName : ""}</td>
                            <td>${result.stageId != 0 ? `${result.stageId} - ${result.stageName}` : ""}</td>
                            <td>${createDateTimePersianSplit[0]} - ${createDateTimePersianSplit[1]}</td>
                            <td>${result.attenderScheduleBlockId}</td>
                            
                        </tr>
                    </tbody>
                    `
    $("#requestServiceSection").html(strItem)
}

function requestServiceOrServiceTaminBuild(result) {
    if (result != undefined) {
        let createDateTimePersianSplit = result.createDateTimePersian.split(" ")

        let strItem = ""

        strItem += `<thead class="table-thead-fixed">
                        <tr>
                            <th style="width:20rem">داکتر</th>
                            <th style="width:20rem">داکتر ارجاع دهنده</th>
                            <th style="width:8rem">تاریخ نسخه</th>     
                            <th style="width:20rem">شیفت</th>
                            <th style="width:8rem">شماره نوبت</th>
                            <th style="width:7rem">تاریخ رزرو</th>
                            <th style="width:7rem">زمان رزرو</th>
                            <th style="width:25rem">بیمه اجباری</th>
                            <th style="width:25rem">صندوق بیمه اجباری</th>
                            <th style="width:10rem">کدملی/نمبر تابعیت (خارجی )</th>
                            <th style="width:25rem">بیمه تکمیلی</th>
                            <th style="width:25rem">صندوق بیمه تکمیلی</th>
                            <th style="width:25rem">طرف قرارداد</th>
                            <th style="width:25rem">تخفیف</th>
                            <th style="width:30rem">مرحله</th>
                            <th style="width:25rem">شماره نسخه الکترونیک</th>
                            <th style="width:12rem">زمان ثبت</th>                        
                            <th style="width:25rem">شناسه بلاک زمانی</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${result.attenderFullName}</td>
                            <td>${result.referringDoctorId == 0 ? "" : `${result.referringDoctorId} - ${result.referringDoctorName}`}</td>
                            <td>${checkResponse(result.prescriptionDatePersian) && result.prescriptionDatePersian != "" ? result.prescriptionDatePersian : ""}</td>
                            <td>${result.reserveShiftId} - ${result.reserveShiftName}</td>
                            <td>${result.admissionNo}</td>
                            <td>${result.reserveDatePersian}</td>
                            <td>${result.reserveTime}</td>
                            <td>${result.basicInsurerId == 0 ? "" : `${result.basicInsurerId} - ${result.basicInsurerName}`}</td>
                            <td>${result.basicInsurerLineId != 0 && result.basicInsurerLineId != null ? result.basicInsurerLineId + ' - ' + result.basicInsurerLineName : ""}</td>
                            <td>${result.nationalCode}</td>
                            <td>${result.compInsurerId != 0 && result.compInsurerId != null ? result.compInsurerId + ' - ' + result.compInsurerName : ""}</td>
                            <td>${result.compInsurerLineId != 0 && result.compInsurerLineId != null ? result.compInsurerLineId + ' - ' + result.compInsurerLineName : ""}</td>
                            <td>${result.thirdPartyInsurerId != 0 && result.thirdPartyInsurerId != null ? result.thirdPartyInsurerId + ' - ' + result.thirdPartyInsurerName : ""}</td>
                            <td>${result.discountInsurerId != 0 && result.discountInsurerId != null ? result.discountInsurerId + ' - ' + result.discountInsurerName : ""}</td>
                            <td>${result.stageId != 0 ? `${result.stageId} - ${result.stageName}` : ""}</td>
                            <td>${result.requestEPrescriptionId}</td>
                            <td>${createDateTimePersianSplit[0]} - ${createDateTimePersianSplit[1]}</td>
                            <td>${result.attenderScheduleBlockId}</td>
                        </tr>
                    </tbody>
                    `
        $("#requestServiceSectionTamin").html(strItem)
    }
  
}

function requestServiceOrServiceTaminPrescriptionBuild(result) {
    
    let createDateTimePersianSplit = result.createDateTimePersian.split(" ")

    let strItem = ""

    strItem += `<thead class="table-thead-fixed">
                        <tr>
                            <th style="width:20rem">داکتر</th>
                            <th style="width:20rem">شیفت</th>
                            <th style="width:8rem">شماره نوبت</th>
                            <th style="width:7rem">تاریخ رزرو</th>   
                            <th style="width:7rem">زمان رزرو</th>
                            <th style="width:25rem">بیمه اجباری</th>
                            <th style="width:25rem">صندوق بیمه اجباری</th>
                            <th style="width:10rem">کدملی/نمبر تابعیت (خارجی )</th>
                            <th style="width:25rem">بیمه تکمیلی</th>
                            <th style="width:25rem">صندوق بیمه تکمیلی</th>
                            <th style="width:25rem">طرف قرارداد</th>
                            <th style="width:25rem">تخفیف</th>
                            <th style="width:30rem">مرحله</th>
                            <th style="width:12rem">زمان ثبت</th>
                            <th style="width:25rem">شناسه بلاک زمانی</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${result.attenderFullName}</td>
                            <td>${result.reserveShiftId} - ${result.reserveShiftName}</td>
                            <td>${result.admissionNo}</td>
                            <td>${result.reserveDatePersian}</td>
                            <td>${result.reserveTime}</td>
                            <td>${result.basicInsurerId == 0 ? "" : `${result.basicInsurerId} - ${result.basicInsurerName}`}</td>
                            <td>${result.basicInsurerLineId != 0 && result.basicInsurerLineId != null ? result.basicInsurerLineId + ' - ' + result.basicInsurerLineName : ""}</td>
                            <td>${result.nationalCode}</td>
                            <td>${result.compInsurerId != 0 && result.compInsurerId != null ? result.compInsurerId + ' - ' + result.compInsurerName : ""}</td>
                            <td>${result.compInsurerLineId != 0 && result.compInsurerLineId != null ? result.compInsurerLineId + ' - ' + result.compInsurerLineName : ""}</td>
                            <td>${result.thirdPartyInsurerId != 0 && result.thirdPartyInsurerId != null ? result.thirdPartyInsurerId + ' - ' + result.thirdPartyInsurerName : ""}</td>
                            <td>${result.discountInsurerId != 0 && result.discountInsurerId != null ? result.discountInsurerId + ' - ' + result.discountInsurerName : ""}</td>
                            <td>${result.stageId != 0 ? `${result.stageId} - ${result.stageName}` : ""}</td>
                            <td>${createDateTimePersianSplit[0]} - ${createDateTimePersianSplit[1]}</td>
                            <td>${result.attenderScheduleBlockId}</td>
                        </tr>
                    </tbody>
                    `
    $("#requestServiceSectionPrescriptionTamin").html(strItem)
}

function fillAdmissionWorkFlowGet(result, admissionTypeId) {

    if (result !== null) {

        urlApi = `${viewData_baseUrl_MC}/AdmissionCartableApi/getadmissionworkflowstageaction`;

        var model = {
            transactionId: result.id,
            workflowId: result.workflowId,
            stageId: result.stageId
        }



        $.ajax({
            url: urlApi,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (res) {
                loaderOnPageTable(false, "tbadmissionWorkFlow")
                $("#admissionWorkFlowGet").html("");
                $("#admissionWorkFlowDetailGet").html("");

                let output = '', data = null, resultLen = res.length;

                if (resultLen != 0) {
                    $("#admissionWorkFlowDetailGet").parents("fieldset").removeClass("d-none")
                    for (var i = 0; i < resultLen; i++) {
                        data = res[i];
                        output += `<tr id="workflowRow${i + 1}" 
                                    onclick="tr_onclickWorkfloaw('tbadmissionWorkFlow',this,${i + 1},${admissionTypeId},${data.transactionId})"                           
                                    style="cursor: pointer;"
                                    tabindex="-1">
                          <td>${data.transactionId}</td>
                          <td>${data.workflowId + ' - ' + data.workflowName}</td>
                          <td>${data.stageId + ' - ' + data.stageName}</td>
                          <td>${data.actionId + ' - ' + data.actionName}</td>
                          <td>${data.createDateTimePersian}</td>
                          <td>${data.createUserId + ' - ' + data.createUserFullName}</td>
                          <td class="d-none"><button id="workflowRowBtn${i}">${i}</button></td>                  
                     </tr>`;
                    }
                    $(output).appendTo("#admissionWorkFlowGet");
                    setTimeout(() => {
                        $("#workflowRow1").click()
                    }, 50)
                }
                else {
                    $("#admissionWorkFlowDetailGet").parents("fieldset").addClass("d-none")
                    output += `<tr id="emptyRow"><td colspan="6" class="text-center">سطری وجود ندارد</td></tr></tr>`;
                    $(output).appendTo("#admissionWorkFlowGet");
                }


            },
            error: function (xhr) {
                loaderOnPageTable(false, "tbadmissionWorkFlow")
                error_handler(xhr, urlApi);
            }
        });

    } else {
        loaderOnPageTable(false, "tbadmissionWorkFlow")
        $("#admissionWorkFlowGet").html(fillEmptyRow($("#admissionWorkFlowGet").prev().find("tr th").length));
        $("#admissionWorkFlowDetailGet").parents("fieldset").addClass("d-none")
    }
}

function fillPrsListTamin(data) {

    $("#tempDisplayPrsTamin").html("");
    let output = `<tr>
                   <td>${+data.requestEPrescriptionId == 0 ? "" : data.requestEPrescriptionId}</td>
                   <td>${data.provinceName != null ? data.provinceName : ""}</td>
                   <td>${data.paraClinicTypeCode == 0 || data.paraClinicTypeCode == null ? "" : `${data.paraClinicTypeCode} - ${data.paraclinicTypeCodeName}`}</td>
                   <td>${data.patientNationalCode != null ? data.patientNationalCode : ""}</td>
                   <td>${data.attenderName != null ? data.attenderName : ""}</td>
                   <td>${data.attenderMSC != null ? data.attenderMSC : ""}</td>
                   <td>${data.attenderSpeciality != null ? data.attenderSpeciality : ""}</td>
                   <td>${data.prescriptionDatePersian != null ? data.prescriptionDatePersian : ""}</td>
                   <td>${data.referReason !== null ? data.referReason : ""}</td>
                   <td>${data.comments !== null ? data.comments : ""}</td>
                   <td>${+data.serviceLaboratoryGroupId == 0 ? "" : data.serviceLaboratoryGroup}</td>
                   <td>${+data.diagnosisCode == 0 ? "" : data.diagnosisCode}</td>
                   <td>${data.diagnosisComment !== null ? data.diagnosisComment : ""}</td>
                 </tr>`;

    $("#tempDisplayPrsTamin").html(output);
}

function tr_onclickWorkfloaw(tableName, elm, rowNo, admissionTypeId, transactionId) {

    admissionWorkFlowTrHighlight(tableName, rowNo)

    var id = elm.cells[0].outerText;
    var workflowId = elm.cells[1].outerText.split('-')[0];
    var stageId = elm.cells[2].outerText.split('-')[0];

    urlApi = `${viewData_baseUrl_MC}/AdmissionCartableApi/getadmissionworkflowstageactiondetail`;

    var model = {
        transactionId: id,
        workflowId: workflowId,
        stageId: stageId
    }



    $.ajax({
        url: urlApi,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (res) {

            loaderOnPageTable(false, "admissionWorkFlowDetailGet")

            let output = '',
                data = null,
                resultLen = res.length,
                headerTable = res.length > 0 ? res[0].HeaderTableName : "",
                sumAmount = 0,
                sumNetAmount = 0;

            $("#admissionWorkFlowIdOnDetails").text(`( شناسه : ${transactionId} )`)
            $("#admissionWorkFlowDetailGetColumn").html(getAdmissionWorkflowDetailColumn(headerTable))
            $("#tbadmissionWorkFlowDetailGet").addClass("displaynone")

            if (resultLen !== 0) {
                $("#admissionWorkFlowDetailGet").parents("fieldset").removeClass("d-none")
                for (var i = 0; i < resultLen; i++) {

                    data = res[i];

                    if (headerTable == "mc.AdmissionSale") {
                        output += `<tr id="workFlowDetail${i + 1}"
                                        onclick="newTrOnclickWorkFlowDetail(this ,event, ${i + 1},'admissionWorkFlowDetailGet')" 
                                        tabindex="-1"
                                        onkeydown="newTrOnkeydownWorkFlowDetail(this,event,${i + 1},'admissionWorkFlowDetailGet')">
                                  <td>${data.Id}</td>
                                  <td>${data.ItemId + '-' + data.ItemName}</td>
                                  <td>${data.Quantity}</td>
                                  <td>${data.BasicItemPrice > 0 ? transformNumbers.toComma(data.BasicItemPrice) : 0}</td>
                                  <td>${data.BasicShareAmount > 0 ? transformNumbers.toComma(data.BasicShareAmount) : 0}</td>
                                  <td>${data.CompShareAmount > 0 ? transformNumbers.toComma(data.CompShareAmount) : 0}</td>
                                  <td>${data.ThirdPartyAmount > 0 ? transformNumbers.toComma(data.ThirdPartyAmount) : 0}</td>
                                  <td>${data.DiscountAmount > 0 ? transformNumbers.toComma(data.DiscountAmount) : 0}</td>
                                  <td ${data.NetAmount < 0 ? `style="color:#f00"` : ""}>${data.NetAmount > 0 ? transformNumbers.toComma(data.NetAmount) : 0}</td>
                                  <td>${moment.from(data.CreateDateTime, 'en', 'YYYY/MM/DD  h:mm:ss').locale('fa').format('YYYY/MM/DD  h:mm:ss')}</td>
                                  <td>${data.CreateUserId + ' - ' + data.CreateUserFullName}</td>
                              </tr>`;
                        sumNetAmount += data.NetAmount
                    }
                    else if (headerTable == "mc.AdmissionService") {

                        output += `<tr id="workFlowDetail${i + 1}" 
                                        onclick="newTrOnclickWorkFlowDetail(this ,event, ${i + 1},'admissionWorkFlowDetailGet')" 
                                        tabindex="-1"
                                        onkeydown="newTrOnkeydownWorkFlowDetail(this,event,${i + 1},'admissionWorkFlowDetailGet')">
                                   <td>${data.Id}</td>
                                   <td>${data.ServiceId + '-' + data.ServiceName}</td>
                                   <td>${data.ServiceCode !== null ? data.ServiceCode : ""}</td>
                                   <td>${data.Quantity}</td>
                                   <td>${data.BasicServicePrice > 0 ? transformNumbers.toComma(data.BasicServicePrice) : 0}</td>
                                   <td>${data.BasicShareAmount > 0 ? transformNumbers.toComma(data.BasicShareAmount) : 0}</td>
                                   <td>${data.CompShareAmount > 0 ? transformNumbers.toComma(data.CompShareAmount) : 0}</td>
                                   <td>${data.ThirdPartyAmount > 0 ? transformNumbers.toComma(data.ThirdPartyAmount) : 0}</td>
                                   <td>${data.DiscountAmount > 0 ? transformNumbers.toComma(data.DiscountAmount) : 0}</td>
                                   <td>${data.BasicInsurerExpirationDate != null ? moment.from(data.BasicInsurerExpirationDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD') : ""}</td>
                                   <td ${data.NetAmount < 0 ? `style="color:#f00"` : ""}>${data.NetAmount > 0 ? transformNumbers.toComma(data.NetAmount) : 0}</td>
                                   <td ${data.PenaltyAmount < 0 ? `style="color:#f00"` : ""}>${data.PenaltyAmount > 0 ? transformNumbers.toComma(data.PenaltyAmount) : 0}</td>
                                   <td>${moment.from(data.CreateDateTime, 'en', 'YYYY/MM/DD  h:mm:ss').locale('fa').format('YYYY/MM/DD  h:mm:ss')}</td>
                                   <td>${data.CreateUserId + ' - ' + data.CreateUserFullName}</td>
                              </tr>`;
                        sumNetAmount += data.NetAmount
                    }
                    else if (headerTable == "mc.AdmissionCash") {

                        let amount = transformNumbers.toComma(Math.abs(data.Amount))

                        output += `<tr id="workFlowDetail${i + 1}" ${data.InOut == 1 ? "" : `class="highlight-danger"`} 
                                            onclick="newTrOnclickWorkFlowDetail(this ,event, ${i + 1},'admissionWorkFlowDetailGet')" 
                                            tabindex="-1"
                                            onkeydown="newTrOnkeydownWorkFlowDetail(this,event,${i + 1},'admissionWorkFlowDetailGet')">
                                     <td>${data.Id}</td>
                                     <td>${data.InOut == 1 ? "1 - دریافت" : "2 - پرداخت"}</td>
                                     <td>${data.FundTypeId + ' - ' + data.FundTypeName}</td>
                                     <td>${data.CurrencyId != null && data.CurrencyId != 0 ? data.CurrencyName : ""}</td>
                                     <td>${data.DetailAccountId != null && data.DetailAccountId != 0 ? data.DetailAccountId + ' - ' + data.DetailAccountName : ""}</td>
                                     <td>${data.InOut == 1 ? `${amount}` : `(${amount})`}</td>
                                     <td>${data.ExchangeRate != null && data.ExchangeRate != 0 ? data.ExchangeRate : ""}</td>
                                     <td>${moment.from(data.CreateDateTime, 'en', 'YYYY/MM/DD  h:mm:ss a').locale('fa').format('YYYY/MM/DD h:mm:ss')}</td>
                                     <td>${data.CreateUserId + ' - ' + data.CreateUserFullName}</td>
                              </tr>`;
                        sumAmount += data.Amount

                    }
                    else if (headerTable == "mc.AdmissionImaging") {
                        output += `<tr id="workFlowDetail${i + 1}" 
                                        onclick="newTrOnclickWorkFlowDetail(this ,event, ${i + 1},'admissionWorkFlowDetailGet')" 
                                        tabindex="-1"
                                        onkeydown="newTrOnkeydownWorkFlowDetail(this,event,${i + 1},'admissionWorkFlowDetailGet')">
                                   <td>${data.Id}</td>
                                   <td>${data.AttenderId} - ${data.AttenderFullName}</td>
                                   <td>${moment.from(data.CreateDateTime, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD  h:mm:ss')}</td>
                                   <td>${data.referringDoctorId != null ? data.ReferringDoctorId + " - " + data.ReferringDoctorFullName : ""}</td>
                            </tr>`;
                    }
                    else if (headerTable == "mc.PrescriptionTamin") {
                        output += `<tr id="workFlowDetail${i + 1}" 
                                        onclick="newTrOnclickWorkFlowDetail(this ,event, ${i + 1},'admissionWorkFlowDetailGet')" 
                                        tabindex="-1"
                                        onkeydown="newTrOnkeydownWorkFlowDetail(this,event,${i + 1},'admissionWorkFlowDetailGet')">
                                   <td>${data.Id}</td>
                                   <td>${moment.from(data.ExpireDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}</td>
                                   <td>${data.ServiceId != null && data.ServiceId != 0 ? data.ServiceId + " - " + data.ServiceName : ""}</td>
                                   <td>${data.TaminPrescriptionTypeID != null && data.TaminPrescriptionTypeID != 0 ? data.TaminPrescriptionTypeID + " - " + data.TaminPrescriptionTypeName : ""}</td>
                                   <td>${data.Quantity}</td>
                                   <td>${data.DrugAmountId != null && data.DrugAmountId != 0 ? data.DrugAmountId + " - " + data.DrugAmountName : ""}</td>
                                   <td>${data.Repeat != null && data.Repeat != 0 ? data.Repeat : ""}</td>
                                    <td>${moment.from(data.DoDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}</td>
                                   <td>${data.DrugInstructionId != null && data.DrugInstructionId != 0 ? data.DrugInstructionId + " - " + data.DrugInstructionName : ""}</td>
                                   <td>${data.DrugUsageId != null && data.DrugUsageId != 0 ? data.DrugUsageId + " - " + data.DrugUsageName : ""}</td>
                                   <td>${data.ParentOrganId != null && data.ParentOrganId != 0 ? data.ParentOrganId + " - " + data.ParentOrganName : ""}</td>
                                   <td>${data.OrganId != null && data.OrganId != 0 ? data.OrganId + " - " + data.OrganName : ""}</td>
                                   <td>${data.IllnessId != null && data.IllnessId != 0 ? data.IllnessId + " - " + data.IllNessName : ""}</td>
                                   <td>${data.PlanId != null && data.PlanId != 0 ? data.PlanId + " - " + data.PlanName : ""}</td>
                                   <td>${data.Comment}</td>
                                   <td>${moment.from(data.PrescriptionDate, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}</td>
                            </tr>`;
                    }
                }


                if (headerTable == "mc.AdmissionSale") {
                    output += `<tr>
                                  <td colspan="8" style="text-align:left">جمع</td>
                                  <td style="background-color:#c6c6c6 !important;${sumNetAmount >= 0 ? "" : "color:#f00"}">${sumNetAmount >= 0 ? transformNumbers.toComma(sumNetAmount) : `( ${transformNumbers.toComma(sumNetAmount)} )`}</td>
                              </tr>`
                }
                else if (headerTable == "mc.AdmissionService") {
                    output += `<tr>
                                  <td colspan="10" style="text-align:left">جمع</td>
                                  <td style="background-color:#c6c6c6 !important;${sumNetAmount >= 0 ? "" : "color:#f00"}">${sumNetAmount >= 0 ? transformNumbers.toComma(sumNetAmount) : `( ${transformNumbers.toComma(sumNetAmount)} )`}</td>
                              </tr>`
                }
                else if (headerTable == "mc.AdmissionCash") {
                    output += `<tr>
                                  <td colspan="5" style="text-align:left">جمع</td>
                                  <td style="background-color:#c6c6c6 !important;${sumAmount >= 0 ? "" : "color:#f00"}">${sumAmount >= 0 ? transformNumbers.toComma(Math.abs(sumAmount)) : `( ${transformNumbers.toComma(Math.abs(sumAmount))} )`}</td>
                              </tr>`
                }

                $("#admissionWorkFlowDetailGet").html("").html(output);

                $("#tbadmissionWorkFlowDetailGet").removeClass("displaynone");

                $("#workFlowDetail1").addClass("highlight").focus()
            }
            else {
                $("#admissionWorkFlowDetailGet").parents("fieldset").addClass("d-none")
            }
        },
        error: function (xhr) {
            loaderOnPageTable(false, "admissionWorkFlowDetailGet")
            error_handler(xhr, urlApi);
        }
    });
}

function admissionWorkFlowTrHighlight(tableName, rowNo) {
    $(`#${tableName} > tbody > tr.highlight`).removeClass("highlight");
    $(`#${tableName} > tbody > tr#workflowRow${rowNo}`).addClass("highlight");
}

function getAdmissionWorkflowDetailColumn(headerTable) {

    var outputColumn = "";

    if (headerTable == "mc.AdmissionService") {
        outputColumn = `
                        <tr>
                             <th class="col-width-percent-4">شناسه</th>
                             <th class="col-width-percent-12">خدمت</th>
                             <th class="col-width-percent-5">کد خدمت</th>
                             <th class="col-width-percent-5">تعداد</th>
                             <th class="col-width-percent-5">مبلغ خدمت</th>
                             <th class="col-width-percent-7">سهم بیمه پایه</th>
                             <th class="col-width-percent-7">سهم بیمه تکمیلی</th>
                             <th class="col-width-percent-7">سهم طرف قرارداد</th>
                             <th class="col-width-percent-7">سهم تخفیف</th>
                             <th class="col-width-percent-8">تاریخ انقضا دفترچه</th>
                             <th class="col-width-percent-8">سهم مراجعه کننده</th>
                             <th class="col-width-percent-9">سهم کنسلی نوبت مراجعه کننده</th>
                             <th class="col-width-percent-8">تاریخ ثبت</th>
                             <th class="col-width-percent-8">کاربر ثبت کننده</th>
                        </tr>
                       `
    }
    else if (headerTable == "mc.AdmissionSale") {
        outputColumn = `
                        <tr>
                            <th class="col-width-percent-4">شناسه</th>
                            <th class="col-width-percent-15">کالا/خدمت</th>
                            <th class="col-width-percent-5">تعداد</th>
                            <th class="col-width-percent-5">مبلغ خدمت</th>
                            <th class="col-width-percent-7">سهم بیمه پایه</th>
                            <th class="col-width-percent-7">سهم بیمه تکمیلی</th>
                            <th class="col-width-percent-7">سهم طرف قرارداد</th>
                            <th class="col-width-percent-7">سهم تخفیف</th>
                            <th class="col-width-percent-9">سهم مراجعه کننده</th>
                            <th class="col-width-percent-8">تاریخ ثبت</th>
                            <th class="col-width-percent-8">کاربر ثبت کننده</th>
                        </tr>
                       `
    }
    else if (headerTable == "mc.AdmissionCash") {
        outputColumn = `
                        <tr>
                            <th class="col-width-percent-4">شناسه</th>
                            <th class="col-width-percent-5">دریافت / پرداخت</th>
                            <th class="col-width-percent-13">نوع وجه</th>
                            <th class="col-width-percent-3">ارز</th>
                            <th class="col-width-percent-12">تفصیل</th>
                            <th class="col-width-percent-5">مبلغ</th>
                            <th class="col-width-percent-4">نرخ ارز تسعیر</th>
                            <th class="col-width-percent-7">تاریخ ثبت</th>
                            <th class="col-width-percent-6">کاربر ثبت کننده</th>
                        </tr>
                       `
    }
    else if (headerTable == "mc.PrescriptionTamin") {
        outputColumn = `
                        <tr>
                            <th class="col-width-percent-3">شناسه</th>
                            <th class="col-width-percent-4">تاریخ اعتبار نسخه</th>
                            <th class="col-width-percent-13">خدمت</th>
                            <th class="col-width-percent-5">نوع خدمت </th>
                            <th class="col-width-percent-2">تعداد</th>
                            <th class="col-width-percent-5">مقادیر مصرف</th>
                            <th class="col-width-percent-3">دوره تکرار</th>
                            <th class="col-width-percent-5">تاریخ موثر انجام</th>
                            <th class="col-width-percent-5">زمان مصرف</th>
                            <th class="col-width-percent-5">طریقه مصرف</th>
                            <th class="col-width-percent-5"> عنوان اندام</th>
                            <th class="col-width-percent-3">اندامک</th>
                            <th class="col-width-percent-5">نام بیماری</th>
                            <th class="col-width-percent-5">طرح درمان</th>
                            <th class="col-width-percent-7">توضیحات</th>
                            <th class="col-width-percent-4">تاریخ ثبت</th>
                        </tr>
                       `
    }
    else {
        outputColumn = `
                        <tr>
                            <th class="col-width-percent-3">شناسه</th>
                            <th class="col-width-percent-7">رادیولوژیست</th>
                            <th class="col-width-percent-7">تاریخ ثبت</th>
                            <th class="col-width-percent-7">داکتر ارجاع دهنده</th>
                        </tr>
                       `
    }

    return outputColumn;

}

function newTrOnkeydownWorkFlowDetail(elm, ev, row, parentId) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${parentId} tr#workFlowDetail${row - 1}`).length != 0) {
            $(`#${parentId} .highlight`).removeClass("highlight");
            $(`#${parentId} tr#workFlowDetail${row - 1}`).addClass("highlight");
            $(`#${parentId} tr#workFlowDetail${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if ($(`#${parentId} tr#workFlowDetail${row + 1}`).length != 0) {
            $(`#${parentId} .highlight`).removeClass("highlight");
            $(`#${parentId} tr#workFlowDetail${row + 1}`).addClass("highlight");
            $(`#${parentId} tr#workFlowDetail${row + 1}`).focus();
        }
    }
}

function newTrOnclickWorkFlowDetail(elm, ev, row, parentId) {

    ev.preventDefault();
    $(`#${parentId} .highlight`).removeClass("highlight");
    $(`#${parentId} tr#workFlowDetail${row}`).addClass("highlight");
    $(`#${parentId} tr#workFlowDetail${row}`).focus();
}

function displayRequest(admissionId, admissionTypeId, stageId) {
    if (admissionTypeId == 1)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    else if (admissionTypeId == 2 || admissionTypeId == 3 || admissionTypeId == 4)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);
}

$("#admissionRequestDisplayModal").on("hidden.bs.modal", function () {
    sumNetAmountCash = 0;
    sumNetAmountRequest = 0;

    $("#cashRequestDataSale").html(fillEmptyRow(8));
    $("#casheRequestDataSale").html(fillEmptyRow(8));
    $("#sumNetAmountRequest").text(0);
    $("#sumNetAmountCash").text(0);
    $("#rowSumCash").addClass("displaynone");
    $("#rowSumRequest").addClass("displaynone");
    $("#serviceSection").addClass("d-none");
    $("#rowSumCashTamin").addClass("displaynone");
    $("#rowSumRequestTamin").addClass("displaynone");
    $("#serviceSectionTamin").addClass("d-none");
    $("#cashRequestDataSaleTamin").html(fillEmptyRow(8));
    $("#casheRequestDataSaleTamin").html(fillEmptyRow(8));
    $("#sumNetAmountRequestTamin").text(0);
    $("#sumNetAmountCashTamin").text(0);
    $("#admissionWorkFlowDetailGetColumn").empty()
    $("#admissionWorkFlowDetailGet").empty()
    $("#admissionWorkFlowGet").empty()

});

//Start Diag
function fillDiagnosisDisplay(data) {
    if (data != null && data.length > 0) {
        $("#tempDiagDisplay").html("");
        var LineLength = data.length;
        for (var dld = 0; dld < LineLength; dld++) {
            var datadb = data[dld];
            var model = {
                admissionId: datadb.admissionId,
                rowNumber: datadb.rowNumber,
                statusId: datadb.statusId,
                statusName: datadb.statusId + " - " + datadb.statusName,
                diagnosisResonId: datadb.diagnosisReasonId,
                diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                serverityId: datadb.serverityId,
                serverityName: datadb.serverityId + " - " + datadb.serverityName,
                comment: datadb.comment,
            };
            arr_TempDiagnosisDisplay.push(model);
            appendTempDiagnosisDisplay(model);
            model = {};
        }
        rebuildDaigRowDisplay()
    }
    else
        $("#tempDiagDisplay").html(fillEmptyRow(5));
};

function appendTempDiagnosisDisplay(diag, tSave = "INS") {
    var diagOutput = "";

    if (diag) {
        if (tSave == "INS") {

            var emptyRow = $("#tempDiagDisplay").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDiagDisplay").html("");

            diagOutput = `<tr id="dg_${diag.rowNumber}">
                          <td>${diag.rowNumber}</td>
                          <td>${diag.statusId != 0 ? `${diag.statusName}` : ""}</td>
                          <td>${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}</td>
                          <td>${diag.serverityId != -1 ? `${diag.serverityName}` : ""}</td>
                          <td>${diag.comment}</td>
                     </tr>`

            $(diagOutput).appendTo("#tempDiagDisplay");
        }
        else {
            var i = arr_TempDiagnosisDisplay.findIndex(x => x.rowNumber == diag.rowNumber);
            arr_TempDiagnosisDisplay[i].admissionId = diag.admissionId;
            arr_TempDiagnosisDisplay[i].rowNumber = diag.rowNumber;
            arr_TempDiagnosisDisplay[i].statusId = diag.statusId;
            arr_TempDiagnosisDisplay[i].statusName = diag.statusName;
            arr_TempDiagnosisDisplay[i].diagnosisResonId = diag.diagnosisResonId;
            arr_TempDiagnosisDisplay[i].diagnosisResonName = diag.diagnosisResonName;
            arr_TempDiagnosisDisplay[i].serverityId = diag.serverityId;
            arr_TempDiagnosisDisplay[i].serverityName = diag.serverityName;
            arr_TempDiagnosisDisplay[i].comment = diag.comment;

            $(`#dg_${diag.rowNumber} td:eq(0)`).text(`${diag.rowNumber}`);
            $(`#dg_${diag.rowNumber} td:eq(1)`).text(`${diag.statusId != 0 ? `${diag.statusName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(2)`).text(`${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(3)`).text(`${diag.serverityId != 0 ? `${diag.serverityName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(4)`).text(`${diag.comment}`);
        }
    }
}

function rebuildDaigRowDisplay() {
    var arrDiag = arr_TempDiagnosisDisplay;
    if (arrDiag.length === 0)
        return;

    for (var l = 0; l < arrDiag.length; l++) {
        arrDiag[l].rowNumber = l + 1;
    }

    arr_TempDiagnosisDisplay = arrDiag;
}

function modelAppendDiagnosisDisplay(rowNumber, typeSave) {

    var modelDiag = {
        admissionId: 0,
        rowNumber: rowNumber,
        statusId: +$("#statusId").val(),
        statusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
        diagnosisResonId: +$("#diagnosisResonId").val(),
        diagnosisResonName: $("#diagnosisResonId").select2('data').length > 0 ? $("#diagnosisResonId").select2('data')[0].text : "",
        serverityId: +$("#serverityId").val(),
        serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
        comment: $("#comment").val()
    };
    if (typeSave == "INS")
        arr_TempDiagnosisDisplay.push(modelDiag);

    appendTempDiagnosisDisplay(modelDiag, typeSaveDiag);
    typeSaveDiag = "INS";
}
//End Diag