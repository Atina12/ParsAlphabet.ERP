//$(".tab-content").show();
//$(".select2").select2();
//$("input:text").focus(function () { $(this).select(); });
//$("input:text").focus(function () { $(this).select(); });
//$(".card-body").hide(1);

var viewData_controllername = "DeathCertificateApi",
    viewData_get_abuseDurationUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getabusedurationunitiddropdown`,
    viewData_get_amountOfAbuseUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getamountofabuseunitiddropdown`,
    viewData_get_conditionId = `${viewData_baseUrl_MC}/DentalApi/getconditioniddropdown`,
    viewData_get_onsetDurationToPresentUnitId_medicalHistory = `${viewData_baseUrl_MC}/DentalApi/getonsetdurationtopresentunitidmedicaldropdown`,
    viewData_get_deathLocationId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdeathlocationiddropdown`,
    viewData_get_sourceofDeathNotification = `${viewData_baseUrl_MC}/${viewData_controllername}/getsourceofdeathnotificationdropdown`,
    viewData_get_actionNameId = `${viewData_baseUrl_MC}/${viewData_controllername}/getactionnameiddropdown`,
    viewData_get_infantWeight = `${viewData_baseUrl_MC}/${viewData_controllername}/getinfantweightdropdown`,
    viewData_get_causeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getcauseiddropdown`,
    viewData_get_deliveryAgent = `${viewData_baseUrl_MC}/${viewData_controllername}/getdeliveryagentdropdown`,
    viewData_get_deliveryLocation = `${viewData_baseUrl_MC}/${viewData_controllername}/getdeliverylocationdropdown`,
    viewData_get_durationDeath = `${viewData_baseUrl_MC}/${viewData_controllername}/getdurationdeathdropdown`,
    viewData_get_methodId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmethodiddropdown`,
    viewData_get_DeathGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_CountryDivisions = `${viewData_baseUrl_MC}/${viewData_controllername}/countrydivisions`,
    viewData_get_AdMissingetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdeathcausestatusdropdown`,
    viewData_get_burialAttesterId = `${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    viewData_save_Death = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    admissionIdentity = 0, deathId = +$("#deathId").val(), deathHID = "",
    currentMedicalHistoryRowNumber = 0, currentDeathCauseRowNumber = 0,
    typeSaveMedicalHistory = "INS", typeSaveDeathCause = "INS", typeSaveInfantDelivery = "INS",
    arr_TempMedicalHistory = [], arr_TempDeathCertificate = [], arr_TempDeathCause = [], arr_TempInfantDelivery = [],
    FormMedicalHistory = $('#medicalHistoryForm').parsley(), FormDeathCause = $('#deathCauseForm').parsley(),
    FormInfantDelivery = $('#infantDeliveryForm').parsley(),
    formDeath = $('#deathForm2').parsley(), formDeath2 = $('#deathCauseForm').parsley();

var pagetable = {
    pagetable_id: "searchAdmissionModal_pagetable",
    pagerowscount: 50,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_get_SearchAdmission,
};

arr_pagetables.push(pagetable);

async function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}
fill_select2(viewData_get_CountryDivisions, "countryDivisionEstateId", true, 0, true,5);
fill_select2(viewData_get_CountryDivisions, "countryDivisionCityId", true, 0, true, 4);

var focusSearchedRow = (i) => {
    $("#tempAdmission tr").removeClass("highlight");
    $(`#tempAdmission #adm_${i}`).addClass("highlight");
    $(`#tempAdmission #adm_${i} > td > button`).focus();
}

function admissionRowKeyDown(index, event) {
    if (event.which === KeyCode.ArrowDown) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index + 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index + 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index + 1} > td > button`).focus();
        }
    }

    if (event.which === KeyCode.ArrowUp) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index - 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index - 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index - 1} > td > button`).focus();
        }
    }

}

function setAdmissionInfo_otherConfig(data) {
    admissionIdentity = +data.admissionId;
    referringDoctorId = data.attenderId;
    checkPatientNationalCode = data.patientNationalCode;
    admissionId = data.admissionId;
    $("#admissionSelected tr td:eq(6)").addClass("d-none")
    $("#admissionSelected tr td:eq(9)").addClass("d-none")
}

function displayAdmission(id) {
    var saleTypeId = 1;
    let admissionType = 2
    fillRequestHeader(admissionType, saleTypeId);
    getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionType, saleTypeId, id);
}


var getfeildByAdmissionId = (admId) => {
    var modelSearch = {
        //stateId: +stateId,
        stateId: 0,
        id: +admId,
        createDatePersian: "",
        patientFullName: "",
        patientNationalCode: ""
    }

    var result = $.ajax({
        url: viewData_get_AdmissionSearch,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionSearch);
            return null;
        }
    });
    return result.responseJSON;
};

async function saveDeathForm() {
   
    await disableSaveButtonAsync(true);

    if (validateDeathForm()) {
        await disableSaveButtonAsync(false);
        return;
    }

    //if (validateDeathForm2()) {
    //    await disableSaveButtonAsync(false);
    //    return;
    //}

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    var arrDeathDateTime = $("#deathDateTime").val().split(' ')
    
    var start = arrDeathDateTime[0];   
    var  end = $("#issueDate").val();
    var resComparison = comparisonStartEnd(start, end);

    if (resComparison) {
        var msgError = alertify.warning("تاریخ فوت نمیتواند از تاریخ صدور گواهی فوت بیشتر باشد");
        msgError.delay(alertify_delay);
        await disableSaveButtonAsync(false);
        return;
    }
    
  //  var checkStatus = $("#switchList").prop("checked");//checkStatus != false &&
    //if ( $("#nationalId").val() == '') {
    //    var msg_temp_srv = alertify.warning("لطفا نمبر تذکره را وارد نمایید");
    //    msg_temp_srv.delay(prMsg.delay);
    //    await disableSaveButtonAsync(false);
    //    return;
    //}

    if (validateAllTab()) {
        var msg_temp_srv = alertify.warning("حتما یک بخش را کامل نمایید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

 

    if (arr_TempDeathCause.length === 0) {
        var msg_temp_srv = alertify.warning("علت فوت را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }


    //for (var i = 0; i < arr_TempDeathCertificate.length; i++)
    //    arr_TempDeathCertificate[i].admissionId = admissionIdentity;
 
    var model = {
        id: deathId,
        admissionId: admissionIdentity,
     //   genderId: +$('#genderId').val(),
      //  birthDatePersian: $('#birthDate').val(),
      //  firstName: $('#firstName').val(),
      //  lastName: $('#lastName').val(),
       // nationalId: $('#nationalId').val(),
        burialAttesterId: +$('#burialAttesterId').val(),
        individualRegisterId: +$('#individualRegisterId').val(),
        countryId: 1,
        countryDivisionEstateId: +$('#countryDivisionEstateId').val(),
        countryDivisionCityId: +$('#countryDivisionCityId').val(),
        issueDatePersian: $('#issueDate').val(),
        serialNumber: $('#serialNumber').val(),
        comment: $('#comment').val(),
        deathDateTimePersian: $('#deathDateTime').val(),
        deathLocationId: +$('#deathLocationId').val(),
        householdHeadNationalCode: $('#householdHeadNationalCode').val(),
        sourceOfNotificationId: +$('#sourceOfNotificationId').val(),
        deathCauseLines: arr_TempDeathCause,
        deathInfantDeliveryLines: arr_TempInfantDelivery,
        deathMedicalHistoryLines: arr_TempMedicalHistory
    };

    saveDeathAsync(model).then(async (data) => {
         
        if (data.successfull) {
            setTimeout(() => {
                navigation_item_click("/MC/DeathCertificate", "لیست فوت");
            }, 400);
            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);
        }
        else {
            var msgError = alertify.error(data.statusMessage);
            msgError.delay(alertify_delay);
        }
    }).then(async () => {
        await disableSaveButtonAsync(false);
    });
}

function validateDeathForm() {
    
    var validate = formDeath.validate();
    validateSelect2(formDeath);
    return !validate;

}

function validateDeathForm2() {


    var validate = formDeath2.validate();
   // validateSelect2(formDeath2);
    return !validate;
}

function validateAllTab() {
    if (arr_TempDeathCause.length === 0 && arr_TempInfantDelivery.length === 0 && arr_TempMedicalHistory.length === 0) {
        return true;
    }
    return false;
}

async function saveDeathAsync(death) {

    let result = await $.ajax({
        url: viewData_save_Death,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(death),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_Death);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

async function bindDeathElement() {

    fill_select2(viewData_get_burialAttesterId, "individualRegisterId");
    fill_select2(viewData_get_burialAttesterId, "burialAttesterId");
    fill_select2(viewData_get_deathLocationId, "deathLocationId", true);
    fill_select2(viewData_get_sourceofDeathNotification, "sourceOfNotificationId", true);

    fill_select2(viewData_get_causeId, "causeId", true, 0, true);
    fill_select2(viewData_get_StatusId, "statusId", true);
    fill_select2(viewData_get_durationDeath, "durationDeathUnitId", true);

    fill_select2(viewData_get_infantWeight, "infantWeightUnitId", true);
    fill_select2(viewData_get_deliveryAgent, "deliveryAgentId", true);
    fill_select2(viewData_get_deliveryLocation, "deliveryLocationId", true);

    fill_select2(viewData_get_conditionId, "conditionId_medicalHistory", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_medicalHistory, "onsetDurationToPresentUnitId_medicalHistory", true);

    //fill_select2(viewData_get_infantWeight, "infantWeight", true);

    if (deathId !== 0)
        getDeathData(deathId);
}

function getDeathData(deathId, headerPagination = 0) {
    let model = {
         deathCertificateId : deathId,
         headerPagination : headerPagination
    }

    $.ajax({
        url: viewData_get_DeathGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            fillDeath(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_DeathGet);
        }
    });
};

var fillDeath = (data) => {
    if (data !== null) {
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#deathBox").removeClass("displaynone");

        deathHID = data.relatedHID;
        $("#deathId").val(deathHID);
        

        //setAdmissionInfo(data.admissionId, data.patientId, data.fullName, data.nationalCode,
        //    data.basicInsurerName, data.insuranceBoxName, data.compInsuranceBoxName, data.hid, data.insurExpDatePersian);
      
        let newData = {
            admissionId: data.admissionId,
            patientId: data.patientId,
            patientFullName: `${data.patientFirstName} ${data.patientLastName}`,
            patientNationalCode: data.nationalCode,
            basicInsurerName: data.basicInsuranceBoxName,
            insuranceBoxName: data.basicInsurerName,
            compInsuranceBoxName : data.compInsuranceBoxName,
            admissionHID: data.hid,
            insurExpDatePersian : data.insurExpDatePersian

        }

        fillAdmission(newData)

        $("#individualRegisterId").val(data.individualRegisterId).trigger('change');
        $("#burialAttesterId").val(data.burialAttesterId).trigger('change');
        $("#deathLocationId").val(data.deathLocationId).trigger('change');
        $("#sourceOfNotificationId").val(data.sourceOfNotificationId).trigger('change');
        $("#deathDateTime").val(data.deathDateTimePersian);
        $("#issueDate").val(data.issueDatePersian);
        $("#comment").val(data.comment);
        $("#serialNumber").val(data.serialNumber);
        $("#householdHeadNationalCode").val(data.householdHeadNationalCode);

        var stateData = new Option(`${data.countryDivisionEstateName}`, data.countryDivisionEstateId, true, true);
        $("#countryDivisionEstateId").append(stateData).trigger("change");

        var cityData = new Option(`${data.countryDivisionCityName}`, data.countryDivisionCityId, true, true);
        $("#countryDivisionCityId").append(cityData).trigger("change");
        ////if (data.nationalId != '' && data.nationalId != null && data.nationalId != '0')
        ////    $("#switchList").prop("checked", true).trigger("change");
        ////else
        ////    $("#switchList").prop("checked", false).trigger("change");
        $("#genderId").val(data.genderId).trigger('change');
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#nationalId").val(data.nationalId);
        $("#birthDate").val(data.birthDatePersian);
         
        var datadb, LineLength;
        // InfantDelivery
        if (data.deathInfantDeliveryLines != null) {
            LineLength = data.deathInfantDeliveryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathInfantDeliveryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    infantWeight: datadb.infantWeight,
                    infantWeightUnitId: datadb.infantWeightUnitId,
                    infantWeightUnitName: datadb.infantWeightUnitName,
                    deliveryNumber: datadb.deliveryNumber,
                    deliveryPriority: datadb.deliveryPriority,
                    deliveryAgentId: datadb.deliveryAgentId,
                    deliveryAgentName: datadb.deliveryAgentId + " - " + datadb.deliveryAgentName,
                    deliveryLocationId: datadb.deliveryLocationId,
                    deathLocationName: datadb.deliveryLocationId + " - " + datadb.deathLocationName,
                    motherNationalCode: datadb.motherNationalCode,
                    motherFirstName: datadb.motherFirstName,
                    motherLastName: datadb.motherLastName,
                    motherGenderId: 2,
                    motherBirthDatePersian: datadb.motherBirthDatePersian,
                    motherMobileNumber: datadb.motherMobileNumber,
                };

                arr_TempInfantDelivery.push(model);
                appendTempInfantDelivery(model);
                model = {};
            }
        }
        // InfantDelivery


        // deathCause
        if (data.deathCauseLines != null) {
            LineLength = data.deathCauseLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathCauseLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    statusId: datadb.statusId,
                    deathCauseStatusName: datadb.statusId + " - " + datadb.deathCauseStatusName,
                    durationDeathUnitId: datadb.durationDeathUnitId,
                    causeId: datadb.causeId,
                    causeName: datadb.causeId + " - " + datadb.causeName,
                    durationDeath: datadb.durationDeath,
                    durationDeathUnitName: datadb.durationDeath + " - " + datadb.durationDeathUnitName,
                    durationDeathUnitDescription: datadb.durationDeathUnitDescription,
                };

                arr_TempDeathCause.push(model);
                appendTempDeathCause(model);
                model = {};
            }
        }
        // deathCause


        // medicalHistory
        if (data.deathMedicalHistoryLines != null) {
            LineLength = data.deathMedicalHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathMedicalHistoryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    conditionId: datadb.conditionId,
                    conditionName: datadb.conditionId + " - " + datadb.conditionName,
                    description: datadb.description,
                    dateOfOnsetPersian: datadb.dateOfOnsetPersian,
                    onsetDurationToPresent: datadb.onsetDurationToPresent,
                    onsetDurationToPresent: datadb.onsetDurationToPresent,
                    onsetDurationToPresentUnitId: datadb.onsetDurationToPresentUnitId,
                    onsetDurationToPresentUnitName: datadb.onsetDurationToPresentUnitId + " - " + datadb.onsetDurationToPresentUnitName,
                    onsetDurationToPresentUnitDescription: datadb.onsetDurationToPresentUnitDescription,
                };

                arr_TempMedicalHistory.push(model);
                appendTempMedicalHistory(model);
                model = {};
            }
        }
        // medicalHistory


    }
};

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin")
}

var resetDeathT = async () => {
     
    $("#tempdeathCauseField").html(fillEmptyRow(5));
    $("#tempinfantDeliveryField").html(fillEmptyRow(12));
    $("#tempinsuranceField").html(fillEmptyRow(6));
    $("#tempdeathmedicalhistoryField").html(fillEmptyRow(6));

}

function plusR(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        $(".slideToggle:not(.current)").slideUp().removeClass("open");
        $(".slideToggle:not(.current)").siblings(".btn").html("<i class='fas fa-plus'></i>");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();

        $(item).nextAll(".slideToggle").removeClass("current");
    }
}

//  DeathCause START *************

$("#adddeathCause").on("click", function () {
     
    var validate = FormDeathCause.validate();
    validateSelect2(FormDeathCause);
    if (!validate) return;


    if (typeSaveDeathCause == "INS") {
        var rowNumberDeathCause = arr_TempDeathCause.length + 1;
        modelAppendDeathCause(rowNumberDeathCause, typeSaveDeathCause)
    }
    else {
        var rowNumberDeathCause = currentDeathCauseRowNumber;
        modelAppendDeathCause(rowNumberDeathCause, typeSaveDeathCause);
    }
});

function modelAppendDeathCause(rowNumber, typeSave) {

    var modelDeathCause = {
        headerId: 0,
        rowNumber: rowNumber,
        causeId: +$("#causeId").val(),
        causeName: $("#causeId").select2('data').length > 0 ? $("#causeId").select2('data')[0].text : "",
        statusId: +$("#statusId").val(),
        deathCauseStatusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
        durationDeath: +$("#durationDeath").val(),
        durationDeathUnitId: $("#durationDeathUnitId").val(),
        durationDeathUnitName: $("#durationDeathUnitId").select2('data').length > 0 ? $("#durationDeathUnitId").select2('data')[0].text : "",
        durationDeathUnitDescription: $("#durationDeathUnitId").select2('data').length > 0 ? $("#durationDeathUnitId").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempDeathCause.push(modelDeathCause);

    appendTempDeathCause(modelDeathCause, typeSaveDeathCause);
    typeSaveDeathCause = "INS";
}

var appendTempDeathCause = (data, tSave = "INS") => {
     
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempdeathCause").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempdeathCause").html("");

            dataOutput = `<tr id="ah_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.causeId != 0 ? data.causeName : ""}</td>
                          <td>${data.statusId != 0 ? `${data.deathCauseStatusName}` : ""}</td>
                          <td>${data.durationDeath}</td>
                          <td>${data.durationDeathUnitId != 0 ? `${data.durationDeathUnitDescription}` : ""}</td>
                          <td id="operationah_${data.rowNumber}">
                              <button type="button" id="deleteah_${data.rowNumber}" onclick="removeFromTempDeathCause(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editah_${data.rowNumber}" onclick="EditFromTempDeathCause(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempdeathCause");
        }
        else {
            var i = arr_TempDeathCause.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempDeathCause[i].headerId = data.headerId;
            arr_TempDeathCause[i].rowNumber = data.rowNumber;
            arr_TempDeathCause[i].causeId = data.causeId;
            arr_TempDeathCause[i].causeName = data.causeName;
            arr_TempDeathCause[i].statusId = data.statusId;
            arr_TempDeathCause[i].deathCauseStatusName = data.deathCauseStatusName;
            arr_TempDeathCause[i].durationDeath = data.durationDeath;
            arr_TempDeathCause[i].durationDeathUnitId = data.durationDeathUnitId;
            arr_TempDeathCause[i].durationDeathUnitName = data.durationDeathUnitName;


            $(`#ah_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#ah_${data.rowNumber} td:eq(1)`).text(`${data.causeId != 0 ? data.causeName : ""}`);
            $(`#ah_${data.rowNumber} td:eq(2)`).text(`${data.statusId != 0 ? data.deathCauseStatusName : ""}`);
            $(`#ah_${data.rowNumber} td:eq(3)`).text(`${data.durationDeath}`);
            $(`#ah_${data.rowNumber} td:eq(4)`).text(`${data.durationDeathUnitId != 0 ? `${data.durationDeathUnitDescription}` : ""}`);


        }
        resetDeathForm("deathCause");
    }
}

var EditFromTempDeathCause = (rowNumber) => {

    $("#tempdeathCause tr").removeClass("highlight");
    $(`#ah_${rowNumber}`).addClass("highlight");

    var arr_TempDeathCauseAppend = "";

    var arr_TempDeathCauseE = arr_TempDeathCause.filter(line => line.rowNumber === rowNumber)[0];

    $("#causeId").val(arr_TempDeathCauseE.causeId);
    arr_TempDeathCauseAppend = new Option(`${arr_TempDeathCauseE.causeName}`, arr_TempDeathCauseE.causeId, true, true);
    $("#causeId").append(arr_TempDeathCauseAppend).trigger('change');
    arr_TempDeathCauseAppend = "";

    $("#statusId").val(arr_TempDeathCauseE.statusId);

    $("#statusId").val(arr_TempDeathCauseE.statusId).trigger('change');

    $("#durationDeath").val(arr_TempDeathCauseE.durationDeath);

    $("#durationDeathUnitId").val(arr_TempDeathCauseE.durationDeathUnitId);

    $("#durationDeathUnitId").val(arr_TempDeathCauseE.durationDeathUnitId).trigger('change');

    typeSaveDeathCause = "UPD";
    currentDeathCauseRowNumber = arr_TempDeathCauseE.rowNumber;
}

$("#canceleddeathCause").on("click", function () {

    $("#deathCauseBox .select2").val("").trigger("change");
    $("#deathCauseBox input.form-control").val("");
    $("#causeId").select2("focus");
    typeSaveDeathCause = "INS";
});

var removeFromTempDeathCause = (rowNumber) => {
    currentDeathCauseRowNumber = rowNumber;

    $("#tempdeathCause tr").removeClass("highlight");
    $(`#ah_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDeathCause, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#ah_${rowNumber}`).remove();

    if (arr_TempDeathCause.length == 0) {
        var colspan = $("#tempdeathCauseList thead th").length;
        $("#tempdeathCause").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDeathCauseRow();
}

function rebuildDeathCauseRow() {

    var arr = arr_TempDeathCause;

    var table = "tempdeathCause";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `ah_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[5].innerHTML !== "") {


            $(`#${table} tr`)[b].children[5].innerHTML = `<button type="button" onclick="removeFromTempDeathCause(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempDeathCause(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempDeathCause = arr;
}

//  DeathCause END *************


// ADMISSIONREFER infantDelivery START *************

$("#addinfantDelivery").on("click", function () {
     
    var validate = FormInfantDelivery.validate();
    validateSelect2(FormInfantDelivery);
    if (!validate) return;

    var start = $("#deliveryPriority").val();
    var end = $("#deliveryNumber").val();
    var resComparison = comparisonStartEnd(start, end);

    if (resComparison) {
        var msgError = alertify.warning("مرتبه قل نمیتواند از تعداد قل بیشتر باشد");
        msgError.delay(alertify_delay);
        return;
    }

    if (typeSaveInfantDelivery == "INS") {

        var rowNumberInfantDelivery = arr_TempInfantDelivery.length + 1;
        if (rowNumberInfantDelivery != 1)            
        {
            var msg_temp_srv = alertify.warning("اطلاعات نوزاد قبلا وارد شده");
            msg_temp_srv.delay(prMsg.delay);

            return;

        }


        modelAppendInfantDelivery(rowNumberInfantDelivery, typeSaveInfantDelivery)
    }
    else {
        var rowNumberInfantDelivery = currentInfantDeliveryRowNumber;
        modelAppendInfantDelivery(rowNumberInfantDelivery, typeSaveInfantDelivery);
    }
});


function modelAppendInfantDelivery(rowNumber, typeSave) {
     
    var modelInfantDelivery = {
        headerId: 0,
        rowNumber: rowNumber,
        infantWeight: +$("#infantWeight").val(),
        infantWeightUnitId: +$("#infantWeightUnitId").val(),
        infantWeightUnitName: $("#infantWeightUnitId").select2('data').length > 0 ? $("#infantWeightUnitId").select2('data')[0].text : "",
        deliveryNumber: +$("#deliveryNumber").val(),
        deliveryPriority: +$("#deliveryPriority").val(),
        deliveryAgentId: +$("#deliveryAgentId").val(),
        deliveryAgentName: $("#deliveryAgentId").select2('data').length > 0 ? $("#deliveryAgentId").select2('data')[0].text : "",
        deliveryLocationId: +$("#deliveryLocationId").val(),
        deathLocationName: $("#deliveryLocationId").select2('data').length > 0 ? $("#deliveryLocationId").select2('data')[0].text : "",
        motherNationalCode: $("#motherNationalCode").val(),
        motherFirstName: $("#motherFirstName").val(),
        motherLastName: $("#motherLastName").val(),
        motherBirthDatePersian: $("#motherBirthDate").val(),
        motherMobileNumber: $("#motherMobileNumber").val(),

    }

    if (typeSave == "INS")
        arr_TempInfantDelivery.push(modelInfantDelivery);

    appendTempInfantDelivery(modelInfantDelivery, typeSaveInfantDelivery);
    typeSaveInfantDelivery = "INS";
}

var appendTempInfantDelivery = (data, tSave = "INS") => {
   
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempinfantDelivery").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempinfantDelivery").html("");

            dataOutput = `<tr id="dh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.infantWeight}</td>
                          <td>${data.infantWeightUnitId != 0 ? `${data.infantWeightUnitName}` : ""}</td>
                          <td>${data.deliveryNumber}</td>
                          <td>${data.deliveryPriority}</td>
                          <td>${data.deliveryAgentId != 0 ? `${data.deliveryAgentName}` : ""}</td>
                          <td>${data.deliveryLocationId != 0 ? `${data.deathLocationName}` : ""}</td>
                          <td>${data.motherNationalCode}</td>
                          <td>${data.motherFirstName}</td>
                          <td>${data.motherLastName}</td>
                          <td>${data.motherBirthDatePersian}</td>
                          <td>${data.motherMobileNumber}</td>
                          <td id="operationdh_${data.rowNumber}">
                              <button type="button" id="deletedh_${data.rowNumber}" onclick="removeFromTempInfantDelivery(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editdh_${data.rowNumber}" onclick="EditFromTempInfantDelivery(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempinfantDelivery");
        }
        else {
            var i = arr_TempInfantDelivery.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempInfantDelivery[i].headerId = data.headerId;
            arr_TempInfantDelivery[i].rowNumber = data.rowNumber;
            arr_TempInfantDelivery[i].infantWeight = data.infantWeight;
            arr_TempInfantDelivery[i].infantWeightUnitId = data.infantWeightUnitId;
            arr_TempInfantDelivery[i].infantWeightUnitName = data.infantWeightUnitName;
            arr_TempInfantDelivery[i].deliveryNumber = data.deliveryNumber;
            arr_TempInfantDelivery[i].deliveryPriority = data.deliveryPriority;
            arr_TempInfantDelivery[i].deliveryAgentId = data.deliveryAgentId;
            arr_TempInfantDelivery[i].deliveryAgentName = data.deliveryAgentName;
            arr_TempInfantDelivery[i].infantWeightUnitName = data.infantWeightUnitName;
            arr_TempInfantDelivery[i].deliveryLocationId = data.deliveryLocationId;
            arr_TempInfantDelivery[i].deathLocationName = data.deathLocationName;
            arr_TempInfantDelivery[i].motherNationalCode = data.motherNationalCode;
            arr_TempInfantDelivery[i].motherFirstName = data.motherFirstName;
            arr_TempInfantDelivery[i].motherLastName = data.motherLastName;
            arr_TempInfantDelivery[i].motherBirthDatePersian = data.motherBirthDatePersian;
            arr_TempInfantDelivery[i].motherMobileNumber = data.motherMobileNumber;

            $(`#dh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#dh_${data.rowNumber} td:eq(1)`).text(`${data.infantWeight}`);
            $(`#dh_${data.rowNumber} td:eq(2)`).text(`${data.infantWeightUnitId != 0 ? `${data.infantWeightUnitName}` : ""}`);
            $(`#dh_${data.rowNumber} td:eq(3)`).text(`${data.deliveryNumber}`);
            $(`#dh_${data.rowNumber} td:eq(4)`).text(`${data.deliveryPriority}`);
            $(`#dh_${data.rowNumber} td:eq(5)`).text(`${data.deliveryAgentId != 0 ? `${data.deliveryAgentName}` : ""}`);
            $(`#dh_${data.rowNumber} td:eq(6)`).text(`${data.deliveryLocationId != 0 ? `${data.deathLocationName}` : ""}`);
            $(`#dh_${data.rowNumber} td:eq(7)`).text(`${data.motherNationalCode}`);
            $(`#dh_${data.rowNumber} td:eq(8)`).text(`${data.motherFirstName}`);
            $(`#dh_${data.rowNumber} td:eq(9)`).text(`${data.motherLastName}`);
            $(`#dh_${data.rowNumber} td:eq(10)`).text(`${data.motherBirthDatePersian}`);
            $(`#dh_${data.rowNumber} td:eq(11)`).text(`${data.motherMobileNumber}`);
        }
        resetDeathForm("infantDelivery");
    }
}

var EditFromTempInfantDelivery = (rowNumber) => {
     
    $("#tempinfantDelivery tr").removeClass("highlight");
    $(`#dh_${rowNumber}`).addClass("highlight");
    var detailInfantDelivery = "";
    var arr_TempInfantDeliveryE = arr_TempInfantDelivery.filter(line => line.rowNumber === rowNumber)[0];

    $("#infantWeightUnitId").val(arr_TempInfantDeliveryE.infantWeightUnitId);
    $("#infantWeightUnitId").val(arr_TempInfantDeliveryE.infantWeightUnitId).trigger('change');

    $("#infantWeight").val(arr_TempInfantDeliveryE.infantWeight);

    $("#deliveryAgentId").val(arr_TempInfantDeliveryE.deliveryAgentId);
    $("#deliveryAgentId").val(arr_TempInfantDeliveryE.deliveryAgentId).trigger('change');

    $("#deliveryLocationId").val(arr_TempInfantDeliveryE.deliveryLocationId);
    $("#deliveryLocationId").val(arr_TempInfantDeliveryE.deliveryLocationId).trigger('change');


    $("#deliveryNumber").val(arr_TempInfantDeliveryE.deliveryNumber);
    $("#deliveryPriority").val(arr_TempInfantDeliveryE.deliveryPriority);
    $("#motherNationalCode").val(arr_TempInfantDeliveryE.motherNationalCode);
    $("#motherLastName").val(arr_TempInfantDeliveryE.motherLastName);
    $("#motherFirstName").val(arr_TempInfantDeliveryE.motherFirstName);
    $("#motherBirthDate").val(arr_TempInfantDeliveryE.motherBirthDatePersian);
    $("#motherMobileNumber").val(arr_TempInfantDeliveryE.motherMobileNumber);


    $("#infantWeight").focus;
    typeSaveInfantDelivery = "UPD";
    currentInfantDeliveryRowNumber = arr_TempInfantDeliveryE.rowNumber;
}

$("#canceledinfantDelivery").on("click", function () {

    $("#infantDeliveryBox .select2").val("").trigger("change");
    $("#infantDeliveryBox input.form-control").val("");
    $("#infantWeight").select2("focus");
    typeSaveInfantDelivery = "INS";
});

var removeFromTempInfantDelivery = (rowNumber) => {
     
    currentInfantDeliveryRowNumber = rowNumber;

    $("#tempinfantDelivery tr").removeClass("highlight");
    $(`#dh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempInfantDelivery, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dh_${rowNumber}`).remove();

    if (arr_TempInfantDelivery.length == 0) {
        var colspan = $("#tempinfantDeliveryList thead th").length;
        $("#tempinfantDelivery").html(emptyRow.replace("thlength", colspan));
    }

    rebuildInfantDeliveryRow();
}

function rebuildInfantDeliveryRow() {
     
    var arr = arr_TempInfantDelivery;

    var table = "tempinfantDelivery";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `dh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[12].innerHTML !== "") {


            $(`#${table} tr`)[b].children[12].innerHTML = `<button type="button" onclick="removeFromTempInfantDelivery(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempInfantDelivery(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempInfantDelivery = arr;
}

// ADMISSIONREFER InfantDelivery END *************


// ADMISSIONREFER medicalHistory START *************

$("#addmedicalHistory").on("click", function () {
     
    var validate = FormMedicalHistory.validate();
    validateSelect2(FormMedicalHistory);
    if (!validate) return;

    if (typeSaveMedicalHistory == "INS") {
        var rowNumberMedicalHistory = arr_TempMedicalHistory.length + 1;
        modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory)
    }
    else {
        var rowNumberMedicalHistory = currentMedicalHistoryRowNumber;
        modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory);
    }
});

function modelAppendMedicalHistory(rowNumber, typeSave) {

    var modelMedicalHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        conditionId: +$("#conditionId_medicalHistory").val(),
        conditionName: $("#conditionId_medicalHistory").select2('data').length > 0 ? $("#conditionId_medicalHistory").select2('data')[0].text : "",
        description: $("#description_medicalHistory").val(),
        dateOfOnsetPersian: $("#dateOfOnSet").val(),
        onsetDurationToPresent: +$("#onsetDurationToPresent_medicalHistory").val(),
        onsetDurationToPresentUnitId: +$("#onsetDurationToPresentUnitId_medicalHistory").val(),
        onsetDurationToPresentUnitName: $("#onsetDurationToPresentUnitId_medicalHistory").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_medicalHistory").select2('data')[0].text : "",
        onsetDurationToPresentUnitDescription: $("#onsetDurationToPresentUnitId_medicalHistory").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_medicalHistory").select2('data')[0].text : "",

    }

    if (typeSave == "INS")
        arr_TempMedicalHistory.push(modelMedicalHistory);

    appendTempMedicalHistory(modelMedicalHistory, typeSaveMedicalHistory);
    typeSaveMedicalHistory = "INS";
}

var appendTempMedicalHistory = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempmedicalHistory").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempmedicalHistory").html("");

            dataOutput = `<tr id="mh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.conditionId != 0 ? `${data.conditionName}` : ""}</td>
                          <td>${data.dateOfOnsetPersian}</td>
                          <td>${data.onsetDurationToPresent}</td>
                          <td>${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}</td>
                          <td>${data.description}</td>
                           <td id="operationmh_${data.rowNumber}">
                              <button type="button" id="deletemh_${data.rowNumber}" onclick="removeFromTempMedicalHistory(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editmh_${data.rowNumber}" onclick="EditFromTempMedicalHistory(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempmedicalHistory");
        }
        else {
            var i = arr_TempMedicalHistory.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempMedicalHistory[i].headerId = data.headerId;
            arr_TempMedicalHistory[i].rowNumber = data.rowNumber;
            arr_TempMedicalHistory[i].conditionId = data.conditionId;
            arr_TempMedicalHistory[i].conditionName = data.conditionName;
            arr_TempMedicalHistory[i].description = data.description;
            arr_TempMedicalHistory[i].dateOfOnsetPersian = data.dateOfOnsetPersian;
            arr_TempMedicalHistory[i].onsetDurationToPresent = data.onsetDurationToPresent;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitId = data.onsetDurationToPresentUnitId;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitName = data.onsetDurationToPresentUnitName;

            $(`#mh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#mh_${data.rowNumber} td:eq(1)`).text(`${data.conditionId != 0 ? `${data.conditionName}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(2)`).text(`${data.dateOfOnsetPersian}`);
            $(`#mh_${data.rowNumber} td:eq(3)`).text(`${data.onsetDurationToPresent}`);
            $(`#mh_${data.rowNumber} td:eq(4)`).text(`${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(5)`).text(`${data.description}`);
        }
        resetDeathForm("medicalHistory");
    }
}

var EditFromTempMedicalHistory = (rowNumber) => {
     
    $("#tempmedicalHistory tr").removeClass("highlight");
    $(`#mh_${rowNumber}`).addClass("highlight");
    var detailMedicalHistory = "";
    var arr_TempMedicalHistoryE = arr_TempMedicalHistory.filter(line => line.rowNumber === rowNumber)[0];

    $("#conditionId_medicalHistory").val(arr_TempMedicalHistoryE.conditionId);
    detailMedicalHistory = new Option(`${arr_TempMedicalHistoryE.conditionName}`, arr_TempMedicalHistoryE.conditionId, true, true);
    $("#conditionId_medicalHistory").append(detailMedicalHistory).trigger('change');
    detailMedicalHistory = "";

    $("#description_medicalHistory").val(arr_TempMedicalHistoryE.description);
    $("#dateOfOnSet").val(arr_TempMedicalHistoryE.dateOfOnsetPersian);
    $("#onsetDurationToPresent_medicalHistory").val(arr_TempMedicalHistoryE.onsetDurationToPresent);

    $("#onsetDurationToPresentUnitId_medicalHistory").val(arr_TempMedicalHistoryE.onsetDurationToPresentUnitId).trigger('change');

    $("#conditionId_medicalHistory").select2("focus");
    typeSaveMedicalHistory = "UPD";
    currentMedicalHistoryRowNumber = arr_TempMedicalHistoryE.rowNumber;
}

$("#canceledmedicalHistory").on("click", function () {
    $("#medicalHistoryBox .select2").val("").trigger("change");
    $("#medicalHistoryBox input.form-control").val("");
    $("#conditionId_medicalHistory").select2("focus");
    typeSaveMedicalHistory = "INS";
});

var removeFromTempMedicalHistory = (rowNumber) => {
    currentMedicalHistoryRowNumber = rowNumber;

    $("#tempmedicalHistory tr").removeClass("highlight");
    $(`#mh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempMedicalHistory, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#mh_${rowNumber}`).remove();

    if (arr_TempMedicalHistory.length == 0) {
        var colspan = $("#tempmedicalHistoryList thead th").length;
        $("#tempmedicalHistory").html(emptyRow.replace("thlength", colspan));
    }

    rebuildMedicalHistoryRow();
}

function rebuildMedicalHistoryRow() {
    var arr = arr_TempMedicalHistory;

    var table = "tempmedicalHistory";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `mh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[6].innerHTML !== "") {


            $(`#${table} tr`)[b].children[6].innerHTML = `<button type="button" onclick="removeFromTempMedicalHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempMedicalHistory(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempMedicalHistory = arr;
}

// ADMISSIONREFER medicalHistory END *************


function resetDeathForm(typeBox) {

    if (typeBox == "deathCause") {

        $("#deathCauseBox .select2").val("").trigger("change");
        $("#deathCauseBox input.form-control").val("");
        $("#causeId").select2("focus");
        typeSavedeathCause = "INS";
    }

    else if (typeBox == "infantDelivery") {
        $("#infantDeliveryBox .select2").val("").trigger("change");
        $("#infantDeliveryBox input.form-control").val("");
        $("#infantWeight").focus();
        typeSaveInfantDelivery = "INS";
    }
    else if (typeBox == "medicalHistory") {
        $("#medicalHistoryBox .select2").val("").trigger("change");
        $("#medicalHistoryBox input.form-control").val("");
        $("#conditionId_medicalHistory").select2("focus");
        typeSaveMedicalHistory = "INS";
    }


}

//$("#switchList").on("change", async function () {

//    var checkStatus = $(this).prop("checked");

//    $("#nationalId").prop("disabled", !checkStatus);
//    if (checkStatus == false)
//    { $("#nationalId").val(""); }
//        //$("#infantWeightUnitId").prop("disabled", !checkStatus);
//        //$("#deliveryNumber").prop("disabled", !checkStatus);
//        //$("#deliveryPriority").prop("disabled", !checkStatus);
//        //$("#deliveryAgentId").prop("disabled", !checkStatus);
//        //$("#deliveryLocationId").prop("disabled", !checkStatus);
//        //$("#motherNationalCode").prop("disabled", !checkStatus);
//        //$("#motherFirstName").prop("disabled", !checkStatus);
//        //$("#motherLastName").prop("disabled", !checkStatus);
//        //$("#motherBirthDate").prop("disabled", !checkStatus);
//        //$("#motherMobileNumber").prop("disabled", !checkStatus);
 
//});



initSendDeathForm();

async function initSendDeathForm() {
    var newOption = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    ColumnResizeable("tempdeathCauseFieldList");
    ColumnResizeable("tempadmissionFieldList");
    ColumnResizeable("tempinfantDeliveryFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempinfantDeliveryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempmedicalHistoryList");

   // $("#switchList").bootstrapToggle();

    bindDeathElement();
    inputMask();

    $(".card-body").fadeIn(1000);
}

function resetFormDeath() {

    alertify.confirm('بازنشانی', "ایا اطمینان دارید؟",
        function () {
            arr_TempDeathCause = [];
            arr_TempInfantDelivery = [];
            arr_TempDrugOrdered = [];
            arr_TempMedicalHistory = [];
            arr_TempDeathCertificate = [];

            $("#tempdeathCauseField").html(fillEmptyRow(8));
            $("#tempinfantDeliveryField").html(fillEmptyRow(3));
            $("#tempinsuranceField").html(fillEmptyRow(6));
            $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
            $("#tempinfantDelivery").html(fillEmptyRow(4));
            $("#tempmedicalHistory").html(fillEmptyRow(7));
            $("#tempdeathCause").html(fillEmptyRow(6));

            $("#admissionSelected").html("");
            $("#admissionId").val("");
            $("#patientNationalCode").val("");
            $("#patientFullName").val("");
            $("#createDatePersian").val("");
            $("#searchAdmission").val("");

            $("#patientNationalCode").val("");
            $("#patientFullName").val("");
            $("#createDatePersian").val("");
            $("#genderId").val("0").trigger('change');
            $("#deathId").val(0);
            deathId = 0;
            $("#userFullName").val("");
           // $("#deathBox").addClass("displaynone");
            $("#deathBox input.form-control").val("");
            $("#deathBox .select2").val("").trigger("change");


            $("#deathForm .select2").val("").trigger("change");
            $("#deathForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#deathForm input.form-control").val("");

            $("#deathFormT .select2").val("").trigger("change");
            $("#deathFormT .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#deathFormT input.form-control").val("");

            $("#deathCauseBox .select2").val("").trigger("change");
            $("#deathCauseBox input.form-control").val("");
            $("#durationDeath").val("");
            $("#infantDeliveryBox .select2").val("").trigger("change");
            $("#infantDeliveryBox input.form-control").val("");

            $("#medicalHistoryBox .select2").val("").trigger("change");
            $("#medicalHistoryBox input.form-control").val("");


        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/DeathCertificate', 'لیست فوتی')
});
