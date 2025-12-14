var admissionSaleType = 0, callSearchPatient = false,
    emptyRowHTML = fillEmptyRow(13),
    viewData_addTreasury_page_url = "/MC/AdmissionCash/form",
    viewData_addTreasury_form_title = "دریافت/پرداخت صندوق",
    viewData_getPatientByNationalCode_url = `${viewData_baseUrl_MC}/PatientApi/getrecordbynationalcode`,

    viewData_get_printAdmission_data_url = `${viewData_baseUrl_MC}/AdmissionApi/getseparationprintadmission`,
    viewData_standprint_model = { item: "@AdmissionMasterId", value: '', sqlDbType: dbtype.NVarChar, size: 50 };

function getCashIdByUserId() {
    var url = `${viewData_baseUrl_MC}/AdmissionCounterApi/getrecordbyuserid`;

    var output = $.ajax({
        url: url,
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return output.responseJSON.data;
}

function checkOpenCash(id) {

    let result = $.ajax({
        url: viewData_opencash,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_opencash);
            return null;
        }
    });
    return result.responseJSON;
}

function fillFundTypeAdm(getModel, elementId) {

    var p_url = `/api/FMApi/fundtypeadm_getdropdown`

    $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(getModel),
        success: function (result) {
            if (result) {

                var list = result;
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var text = `${item.id} - ${item.name}`;

                    if (i !== 0)
                        str += `<option value="${item.id}">${text}</option>`;
                    else
                        str += `<option value="${item.id}" selected>${text}</option>`;
                }
                $(`#${elementId}`).append(str);
                $(`#${elementId}`).trigger("change");
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function patientSearch(model, isAdmissionSale = false, isTamin = false) {

    let url = "";

    if (isAdmissionSale)
        url = `${viewData_baseUrl_MC}/PatientApi/patientsearchsale`;
    else
        url = `${viewData_baseUrl_MC}/PatientApi/patientsearchservice`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            fillPatientSearch(result, isAdmissionSale, isTamin);
            callSearchPatient = false;
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function patientInsurerSearch(patientId, isTamin = false) {

    let url = `${viewData_baseUrl_MC}/PatientApi/patientsearchinsurer/${patientId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            fillPatientInsurerSearch(result, isTamin);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function fillPatientSearch(result, isAdmissionSale = false, isTamin = false) {

    $("#tempPatient").html("");
    displayCountRowModal(0, "searchPatientModal");
    if (isAdmissionSale) {
        if (result.length > 0) {
            if (result.length === 1)
                setPatientInfo(
                    result[0].id, result[0].firstName, result[0].lastName, result[0].genderId, result[0].mobileNo, result[0].nationalCode, result[0].countryId,
                    result[0].birthDatePersian, result[0].address, result[0].idCardNumber, result[0].postalCode, result[0].jobTitle,
                    result[0].phoneNo, result[0].maritalStatusId, result[0].fatherFirstName, result[0].educationLevelId, result[0].patientReferralTypeId, result[0].basicInsurerLineId,
                    result[0].compInsurerLineId, result[0].compInsurerId, result[0].thirdPartyInsurerId, result[0].discountInsurerId);

            var output = "";
            var len = result.length;
            displayCountRowModal(len, "searchPatientModal");
            //<td>${item.customerGroupId !== 0 ? `${item.customerGroupId} - ${item.customerGroupName}` : ""}</td>
            for (var i = 0; i < len; i++) {
                var item = result[i];
                output = `<tr id="pi_${i}" onclick="patientRowClick(${i},event,true)" onkeydown="patientRowKeyDown(${i},event,true)">
                                    <td>${i + 1}</td>
                                    <td>${item.patientReferralTypeId != 0 && item.patientReferralTypeId != null ? `${item.patientReferralTypeId} - ${item.patientReferralTypeName}` : ""}</td>
                                    <td>${item.id}</td>
                                    <td>${item.nationalCode}</td>
                                    <td>${item.firstName}</td>
                                    <td>${item.lastName}</td>
                                    <td>${item.birthDatePersian}</td>
                                    <td>${item.genderName}</td>
                                    <td>${item.countryName}</td>
                                    <td>${item.basicInsurerId != 0 && item.basicInsurerId != null ? `${item.basicInsurerId} - ${item.basicInsurerName}` : ""}</td>
                                    <td>${item.basicInsurerLineId != 0 ? `${item.basicInsurerLineId} - ${item.basicInsurerLineName}` : ""}</td>
                                    <td></td>
                                    <td></td>                                    
                                    <td>${item.compInsurerLineId != 0 && item.compInsurerLineId != null ? `${item.compInsurerLineId} - ${item.compInsurerLineName}` : ""}</td>
                                    <td>${item.ThirdPartyInsurerId != 0 && item.ThirdPartyInsurerId != null ? `${item.ThirdPartyInsurerId} - ${item.ThirdPartyInsurerName}` : ""}</td>
                                    <td>${item.discountInsurerId != 0 && item.discountInsurerId != null ? `${item.discountInsurerId} - ${item.discountInsurerName}` : ""}</td>
                                    <td>${item.mobileNo}</td>
                                    <td>
                <button type="button" onclick="setPatientInfo(${item.id},'${item.firstName}','${item.lastName}','${item.genderId}',
                                                             '${item.mobileNo}','${item.nationalCode}','${item.countryId}','${item.birthDatePersian}',
                                                             '${item.address}','${item.idCardNumber}','${item.postalCode}','${item.jobTitle}','${item.phoneNo}',
                                                              ${item.maritalStatusId},'${item.fatherFirstName}',${item.educationLevelId}
                                                             ,${item.patientReferralTypeId},${item.basicInsurerLineId},${item.compInsurerLineId},${item.compInsurerId},
                                                              ${item.thirdPartyInsurerId},${item.discountInsurerId},event)"
                class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                              <i class="fa fa-check"></i>
                                        </button>
                                    </td>
                               </tr>`;

                $(output).appendTo("#tempPatient");
            }
        }
        else {
            $("#tempPatient").html(fillEmptyRow(18));
            var msg_p = alertify.error(msg_nothing_found);
            msg_p.delay(admission.delay);
            return;
        }
    }
    else {
        if (result.length > 0) {
            if (result.length === 1)
                setPatientInfo(
                    result[0].id, result[0].patientReferralTypeId, result[0].basicInsurerLineId, result[0].nationalCode, result[0].basicInsurerNo,
                    result[0].basicInsurerExpirationDatePersian, result[0].firstName, result[0].lastName, result[0].birthDatePersian,
                    result[0].genderId, result[0].countryId, result[0].compInsurerLineId, result[0].compInsurerId, result[0].thirdPartyInsurerId, result[0].mobileNo, result[0].address,
                    result[0].idCardNumber, result[0].postalCode, result[0].jobTitle, result[0].phoneNo, result[0].maritalStatusId, result[0].fatherFirstName, result[0].educationLevelId, result[0].discountInsurerId);

            var output = "";

            var len = result.length;
            displayCountRowModal(len, "searchPatientModal");
            for (var i = 0; i < len; i++) {
                var item = result[i];
                output = `<tr id="p_${i}" onclick="patientRowClick(${i},event)" onkeydown="patientRowKeyDown(${i},event)">
                                    <td>${i + 1}</td>
                                    <td>${item.patientReferralTypeId != 0 && checkResponse(item.patientReferralTypeId) ? `${item.patientReferralTypeId} - ${item.patientReferralTypeName}` : ""}</td>
                                    <td>${item.id}</td>
                                    <td>${item.nationalCode}</td>
                                    <td>${item.firstName}</td>
                                    <td>${item.lastName}</td>
                                    <td>${item.birthDatePersian}</td>
                                    <td>${item.genderName}</td>
                                    <td>${item.countryName}</td>`;

                if (!isTamin) {
                    output += `<td>${item.basicInsurerId != 0 ? `${item.basicInsurerId} - ${item.basicInsurerName}` : ""}</td>
                                    <td>${item.basicInsurerLineId != 0 ? `${item.basicInsurerLineId} - ${item.basicInsurerLineName}` : ""}</td>
                                    <td>${item.basicInsurerNo == null ? "" : item.basicInsurerNo}</td>
                                    <td>${checkResponse(item.basicInsurerExpirationDatePersian) ? item.basicInsurerExpirationDatePersian : ""}</td>`;
                }

                output += `<td>${item.compInsurerLineId != 0 ? `${item.compInsurerLineId} - ${item.compInsurerLineName}` : ""}</td>
                                    <td>${item.thirdPartyInsurerId != 0 ? `${item.thirdPartyInsurerId} - ${item.thirdPartyInsurerName}` : ""}</td>
                                    <td>${item.discountInsurerId != 0 ? `${item.discountInsurerId} - ${item.discountInsurerName}` : ""}</td>
                                    <td>${item.mobileNo}</td>
                                    <td>
                                        <button type="button" onclick="setPatientInfo(
                                             ${item.id},${item.patientReferralTypeId},${item.basicInsurerLineId},'${item.nationalCode}',
                                            '${item.basicInsurerNo == null ? "" : item.basicInsurerNo}','${checkResponse(item.basicInsurerExpirationDatePersian) ? item.basicInsurerExpirationDatePersian : ""}',
                                            '${item.firstName}','${item.lastName}','${item.birthDatePersian}',${item.genderId},${item.countryId},${item.compInsurerLineId},${item.compInsurerId},
                                            '${item.thirdPartyInsurerId}','${item.mobileNo}','${item.address}','${item.idCardNumber}','${item.postalCode}',
                                            '${item.jobTitle}','${item.phoneNo}',${item.maritalStatusId},
                                            '${item.fatherFirstName}',${item.educationLevelId},${item.discountInsurerId},event)"
                                             class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                              <i class="fa fa-check"></i>
                                        </button>
                                    </td>
                               </tr>`;


                $(output).appendTo("#tempPatient");
            }
        }
        else {
            $("#tempPatient").html(fillEmptyRow(18));
            var msg_p = alertify.error(msg_nothing_found);
            msg_p.delay(admission.delay);
            return;
        }
    }

}

function fillPatientInsurerSearch(result, isTamin = false) {

    $("#tempPatientI").html("");
    displayCountRowModal(0, "searchPatientInsurerModal")

    if (result.length > 0) {

        var output = `<tr id="pI_0" onclick="patientRowClickI(0,event)" onkeydown="patientRowKeyDownI(0,event)"><td>1</td>`;
        if (!isTamin)
            output += `<td>	8036 - آزاد</td><td>73 - آزاد</td><td></td><td></td>`;
        output += `<td></td><td></td><td></td><td>
                                        <button type="button" onclick="setPatientInsurerInfo('73','','',0,0,0)" class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                              <i class="fa fa-check"></i>
                                        </button>
                                    </td></tr>`;

        $(output).appendTo("#tempPatientI");

        if (result[0].basicInsurerLineId === 73 && result[0].basicInsurerId === 8036) {
            modal_show("searchPatientInsurerModal");
        }
        else {
            var len = result.length;
            displayCountRowModal(len + 1, "searchPatientInsurerModal")
            for (var i = 0; i < len; i++) {
                var item = result[i];
                output = `<tr id="pI_${i + 1}" onclick="patientRowClickI(${i + 1},event)" onkeydown="patientRowKeyDownI(${i + 1},event)">
                                    <td>${i + 2}</td>`;

                if (!isTamin) {
                    output += `<td>${item.basicInsurerId} - ${item.basicInsurerName}</td>
                                    <td>${item.basicInsurerLineId} - ${item.basicInsurerLineName}</td>
                                    <td>${item.basicInsurerNo == null ? "" : item.basicInsurerNo}</td>
                                    <td>${item.basicInsurerExpirationDatePersian == null || item.basicInsurerExpirationDatePersian == "" ? "" : item.basicInsurerExpirationDatePersian}</td>`;
                }

                output += `<td>${item.compInsurerLineId != 0 ? `${item.compInsurerLineId} - ${item.compInsurerName}` : ""}</td>
                           <td>${item.thirdPartyInsurerId != 0 ? `${item.thirdPartyInsurerId} - ${item.thirdPartyInsurerName}` : ""}</td>
                           <td>${item.discountInsurerId != 0 ? `${item.discountInsurerId} - ${item.discountInsurerName}` : ""}</td>
                           <td>
                                <button type="button"
                                        onclick="setPatientInsurerInfo('${item.basicInsurerLineId}',${item.basicInsurerNo == null ? null : `'${item.basicInsurerNo}'`},
                                                                        ${item.basicInsurerExpirationDatePersian == null ? null : `'${item.basicInsurerExpirationDatePersian}'`},
                                                                        ${item.compInsurerLineId},${item.compInsurerId},${item.thirdPartyInsurerId},${item.discountInsurerId})"
                                        class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                     <i class="fa fa-check"></i>
                                </button>
                           </td>
                          </tr>`;


                $(output).appendTo("#tempPatientI");
                modal_show("searchPatientInsurerModal");
            }
        }


    }
    //else {
    ////    var msg_p = alertify.error(msg_nothing_found);
    // //   msg_p.delay(admission.delay);
    //    return;
    //}
}

var focusSearchedRow = (i, type = "") => {
    $(`#tempPatient${type} tr`).removeClass("highlight");
    $(`#tempPatient${type} #p${type}_${i}`).addClass("highlight");
    $(`#tempPatient${type} #p${type}_${i} > td > button`).focus();
}

function getReferringDoctorInfo(referringDoctorId) {

    var url = `${viewData_baseUrl_MC}/ReferringDoctorApi/getreferringdoctormsc`;

    var result = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(referringDoctorId),
        cache: false,
        async: false,
        success: function (result) {

            return result.data;

        },
        error: function (xhr) {
            error_handler(xhr, url)
            return null;
        }
    });

    return result.responseJSON;
}

$("#searchPatientNationalCode").on("input", function () {
    callSearchPatient = true;
}).on("blur", async () => {
    if (callSearchPatient)
        await $("#searchPatientAdmission").click();
});

$("#searchPatientMobileNo").on("input", function () {
    callSearchPatient = true;
}).on("blur", async () => {
    if (callSearchPatient)
        await $("#searchPatientAdmission").click();
});

$("#searchPatientInsurNo").on("input", function () {
    callSearchPatient = true;
}).on("blur", async () => {
    if (callSearchPatient)
        await $("#searchPatientAdmission").click();
});

$("#patientInsuranceBoxId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#searchPatientBasicInsurerNo").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#searchPatientBasicInsurerLineId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#searchPatientCompInsurerThirdPartyId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#searchPatientDiscountInsurerId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#patientCustomerGroupId").on("change", async () => {
    await $("#searchPatientAdmission").click();
}).on("keydown", function (ex) {
    if (ex.which == KeyCode.Enter) {
        if (("#tempPatient tr").length > 0)
            focusSearchedRow(0);
    }
});

$("#searchPatientFullName").on("input", function () {
    callSearchPatient = true;
}).on("blur", async () => {
    if (callSearchPatient)
        await $("#searchPatientAdmission").click();
});

$("#patientCompInsuranceBoxId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

$("#patientThirdPartyId").on("change", async () => {
    await $("#searchPatientAdmission").click();
});

function getAutoReserve(attenderId, departmentTimeShiftId, currentDateTime, isOnline) {


    var model = {
        attenderId,
        departmentTimeShiftId,
        currentDateTime,
        isOnline
    },
        viewData_get_autoreserve = `${viewData_baseUrl_MC}/AdmissionApi/getscheduleblockautoreserve`;

    var output = $.ajax({
        url: viewData_get_autoreserve,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_autoreserve);
            return JSON.parse(-4);
        }
    });

    return output.responseJSON;
}

function thirdPartyKeyDown(ex) {
    if (ex.which == KeyCode.Enter) {
        ex.preventDefault();
        if (("#tempPatient tr").length > 0)
            focusSearchedRow(0);
    }
}

function modal_closeAdmission(modal_name = null, isClose = true) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    $(`#${modal_name} div.modal-body *`).removeClass("parsley-error");
    if (typeof form !== "undefined" && form !== undefined)
        if (form.length > 1)
            form[0].reset();
        else
            form.reset();


    $(`#${modal_name}`).modal("hide");
    $(`#${modal_name} .pagerowscount`).removeClass("dropup");
    $(`#${modal_name} .modal-dialog`).removeAttr("style");

    pagetable_id = "pagetable";

    if (typeof arr_pagetables != "undefined") {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
        var pagetable_currentrow = arr_pagetables[index].currentrow;

        $(`#pagetable .pagetablebody > tbody > #row${pagetable_currentrow}`).focus();
    }
    if (isClose) {
        $(":focus").blur();
        setTimeout(() => $("#firstName").focus(), 2);

    }
}

function patientRowKeyDown(row, ev, isSale = false) {

    if (ev.which === KeyCode.ArrowDown) {

        ev.preventDefault();


        if (isSale) {
            if ($(`#tempPatient #pi_${row + 1}`).length > 0) {

                $(`#tempPatient tr`).removeClass("highlight");

                $(`#tempPatient tr`).removeClass("highlight");
                $(`#tempPatient #pi_${row + 1}`).addClass("highlight");
                $(`#tempPatient #pi_${row + 1} > td > button`).focus();
            }
        }
        else {
            if ($(`#tempPatient #p_${row + 1}`).length > 0) {

                $(`#tempPatient tr`).removeClass("highlight");

                $(`#tempPatient tr`).removeClass("highlight");
                $(`#tempPatient #p_${row + 1}`).addClass("highlight");
                $(`#tempPatient #p_${row + 1} > td > button`).focus();
            }
        }

    }
    else if (ev.which === KeyCode.ArrowUp) {

        ev.preventDefault();



        if (isSale) {
            if ($(`#tempPatient #pi_${row - 1}`).length > 0) {

                $(`#tempPatient tr`).removeClass("highlight");

                $(`#tempPatient #pi_${row - 1}`).addClass("highlight");
                $(`#tempPatient #pi_${row - 1} > td > button`).focus();
            }
        }
        else {
            if ($(`#tempPatient #p_${row - 1}`).length > 0) {

                $(`#tempPatient tr`).removeClass("highlight");
                $(`#tempPatient #p_${row - 1}`).addClass("highlight");
                $(`#tempPatient #p_${row - 1} > td > button`).focus();
            }
        }

    }

}

function patientRowClick(row, ev, isSale = false) {

    $(`#tempPatient tr`).removeClass("highlight");

    if (isSale) {
        $(`#tempPatient #pi_${row}`).addClass("highlight");
        $(`#tempPatient #pi_${row} > td > button`).focus();
    }
    else {
        $(`#tempPatient #p_${row}`).addClass("highlight");
        $(`#tempPatient #p_${row} > td > button`).focus();
    }
}

function patientRowKeyDownI(row, ev) {

    if (ev.which === KeyCode.ArrowDown) {

        ev.preventDefault();

        if ($(`#tempPatientI #pI_${row + 1}`).length > 0) {

            $(`#tempPatientI tr`).removeClass("highlight");

            $(`#tempPatientI tr`).removeClass("highlight");
            $(`#tempPatientI #pI_${row + 1}`).addClass("highlight");
            $(`#tempPatientI #pI_${row + 1} > td > button`).focus();
        }
    }
    else if (ev.which === KeyCode.ArrowUp) {

        ev.preventDefault();

        if ($(`#tempPatientI #pI_${row - 1}`).length > 0) {

            $(`#tempPatientI tr`).removeClass("highlight");
            $(`#tempPatientI #pI_${row - 1}`).addClass("highlight");
            $(`#tempPatientI #pI_${row - 1} > td > button`).focus();
        }
    }

}

function patientRowClickI(row, ev) {

    $(`#tempPatientI tr`).removeClass("highlight");
    $(`#tempPatientI #pI_${row}`).addClass("highlight");
    $(`#tempPatientI #pI_${row} > td > button`).focus();
}

function getPatientByNationalCode_adm(nationalCode, admissionType, callback) {
    var model = {
        nationalCode: nationalCode
    };

    var viewData_getPatientByNationalCode_url = `${viewData_baseUrl_MC}/PatientApi/getrecordbynationalcode`;

    $.ajax({
        url: viewData_getPatientByNationalCode_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            if (checkResponse(result)) {
                callback(result)
                if (admissionType == 2 || admissionType == 1) {
                    if (result.isActive) {
                        if (admissionType == 2) {
                            if (typeof isReimburesment == "undefined" || !isReimburesment)
                                getPatientInsurer()
                        }
                    } else {
                        if (admissionType == 2) {
                            var nCodeValid = alertify.warning("وضعیت نمبر تذکره غیر فعال می باشد ، ثبت پذیرش امکان پذیر نیست.");
                            nCodeValid.delay(alertify_delay);
                        } else {
                            var nCodeValid = alertify.warning("وضعیت نمبر تذکره غیر فعال می باشد ، امکان ثبت کالا وجود ندارد.");
                            nCodeValid.delay(alertify_delay);
                        }
                    }
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getPatientByNationalCode_url);
        }
    });

}

function stimul_standprint() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_standprint_model),
        async: false,
        cache: false,
        success: function (result) {
            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url)
        }
    });
}

function standprint(admissionId, medicalrevenue) {

    if (medicalrevenue != 1) {
        var msg = alertify.error(`فقط برای موارد تسویه نشده امکان چاپ کیوسک وجود دارد`);
        msg.delay(alertify_delay);
        return;
    }

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var admissionInfo = `${admissionId}`;

    viewData_standprint_model.url = `${stimulsBaseUrl.MC.Prn}AdmissionStand.mrt`;
    viewData_standprint_model.value = admissionInfo;
    stimul_standprint();

}

function contentPrintAdmissionCompress(admissionId) {

    let setupInfo = getSetupInfo();
    let contentData = getCompressContentData(admissionId);

    let lnContentData = contentData != null && contentData != undefined ? contentData.length : 0;

    //let contentDataPresenceDay = lnContentData > 0 ? getpresencedays(contentData[0].attenderId, contentData[0].branchId, contentData[0].reserveDate) : null;
    let sumPatientShareAmount = 0
    let sumNetAmount = 0
    let sumQty = 0
    let sumBasicServiceAmount = 0

    let sumBasicShareAmount = 0
    let sumCompShareAmount = 0
    let sumThirdPartyAmount = 0
    let sumDiscountAmount = 0

    for (let i = 0; i < lnContentData; i++) {

        sumPatientShareAmount += contentData[i].patientShareAmount
        sumNetAmount += contentData[i].netAmount
        sumQty += contentData[i].qty
        sumBasicServiceAmount += contentData[i].basicServiceAmount

        sumBasicShareAmount += contentData[i].basicShareAmount
        sumCompShareAmount += contentData[i].compShareAmount
        sumThirdPartyAmount += contentData[i].thirdPartyAmount
        sumDiscountAmount += contentData[i].discountAmount
    }

    let content =
        `<div style="display: flex; width: 246px; flex-wrap: wrap;word-break: break-word;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'"> 
           <div style="width:100%;display: inline-flex;padding:2px;">
                <span style="width:30%; text-align: center">
                    <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;" />
                </span>                
                  <div style="width: 70%; text-align: right; display: grid; ">
                    <span style="width:100%; text-align:right">${setupInfo.name}</span>                   
                  </div>
            </div>
            <div style="border-bottom:1px solid #000;">
              <span style="width:100%;font-size:17px;font-weight: bolder; text-align:right">پذیرش مراجعه کننده - ${contentData[0].workflowName}</span> 
            </div>

            <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].departmentName}</div>
                    <div style="width: 55%">:بخش خدمت</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width:45%;">${contentData[0].alterTime} ${contentData[0].alterDate}</div>
                    <div style="width: 55%">:تاریخ/زمان ثبت</div>
                </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:45%;">${contentData[0].reserveTime} ${contentData[0].reserveDatePersian}</div>
                        <div style="width: 55%;">:تاریخ/زمان رزرو</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${contentData[0].admissionNo}</div>
                        <div style="width: 55%;">:نوبت</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].reserveShiftName}</div>
                        <div style="width: 55%">:شیفت</div>
                    </div>      
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].patientFullName}</div>
                    <div style="width: 55%">:نام مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].patientNationalCode}</div>
                    <div style="width: 55%">:نمبر تذکره مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;font-weight: bold;">${contentData[0].inqueryID == null ? 0 : contentData[0].inqueryID}</div>
                    <div style="width: 55%;">:شناسه استحقاق درمان</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].attenderFullName} - ${contentData[0].msc}</div>
                    <div style="width: 55%">:داکتر</div>
                </div>
            </div>

            <div style="width:100%;border-bottom:2px solid #000; display: inline-flex;flex-wrap: wrap;padding:2px;">
              
                 <div style="width: 100%;display: flex;flex-direction: column">
                      <div style="width: 100%">:بیمه اجباری</div>
                      <div style="width: 100%">${contentData[0].basicInsurerName} - ${contentData[0].basicInsurerLineName}</div>              
                 </div>

                ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                        <div style="width: 100%">:بیمه تکمیلی</div>
                        <div style="width: 100%">${contentData[0].compInsurerName}</div>                
                    </div>`: ""}
                ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                        <div style="width: 100%">:طرف قرارداد</div>
                        <div style="width: 100%">${contentData[0].thirdPartyInsurerName}</div>             
                    </div>`: ""}
                ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                        <div style="width: 100%">:تخفیف</div>
                        <div style="width: 100%">${contentData[0].discountInsurerName}</div>                 
                    </div>`: ""}

                ${+contentData[0].basicInsurerNo !== 0 ?
            `<div style="width: 100%;display: inline-flex">
                            <div style="width: 45%">${contentData[0].basicInsurerNo}</div>
                            <div style="width: 55%">:شماره بیمه</div>
                    </div>`: ""}

            </div>
            <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width:100%;direction: rtl;"> نوع خدمت : ${contentData[0].serviceName}</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${sumQty}</div>
                    <div style="width: 55%">:تعداد</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumBasicServiceAmount)}</div>
                    <div style="width: 55%">:مبلغ خدمت</div>
                </div>

                ${sumBasicShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumBasicShareAmount)}</div>
                    <div style="width: 55%">:سهم بیمه اجباری</div>
                </div>`
            : ""}
                ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumCompShareAmount)}</div>
                    <div style="width: 55%">:سهم بیمه تکمیلی</div>
                </div>`
            : ""}
                ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumThirdPartyAmount)}</div>
                    <div style="width: 55%">:سهم طرف قرارداد</div>
                </div>`
            : ""}
                ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumDiscountAmount)}</div>
                    <div style="width: 55%">:سهم تخفیف</div>
                </div>`
            : ""}

                <div style="width: 100%;display: inline-flex;">
                     <div style="width: 45%">${transformNumbers.toComma(sumPatientShareAmount)}</div>
                     <div style="width: 55%">:سهم مراجعه کننده</div>
                </div>
        </div>

            <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].admissionMasterId}</div>
                    <div style="width: 55%;">:شناسه پرونده</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].id}</div>
                    <div style="width: 55%">:شناسه پذیرش</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].createUserFullName}</div>
                    <div style="width: 55%">:کاربر پذیرش</div>
                </div>
            </div>

            <div style="width:100%;${contentData[0].admissionCashInfoList == null ? "" : "border-bottom:1px solid #000"};display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${transformNumbers.toComma(sumNetAmount)}</div>
                    <div style="width: 55%">:جمع پذیرش</div>
                </div>
            </div>
        `;

    if (contentData[0].admissionCashInfoList != null) {
        content += `
                        <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">شناسه صندوق</div>
                                <div style="width: 50%;">مبلغ</div>
                            </div>
                        </div>
                 
                    `

        var admissionCashInfoList = contentData[0].admissionCashInfoList
        var admissionCashInfoListLen = contentData[0].admissionCashInfoList.length

        for (let i = 0; i < admissionCashInfoListLen; i++) {
            content += `
                          <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">${admissionCashInfoList[i].id}</div>
                                <div style="width: 50%;">
                                    ${admissionCashInfoList[i].cashAmount < 0
                    ? `( ${transformNumbers.toComma(admissionCashInfoList[i].cashAmount)} )`
                    : transformNumbers.toComma(admissionCashInfoList[i].cashAmount)}
                                </div>
                            </div>
                        </div>
                        `
        }

    }
    //if (contentDataPresenceDay.length > 0) {
    //    content += `   <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
    //                        <div style="width: 100%;display: inline-flex;">
    //                        <table style="width:100% !important">
    //                               <tbody>`



    //    for (var i = 0; i < contentDataPresenceDay.length; i++) {
    //        content += `<tr style="font-size:13px;">
    //                     <td style = "width:100%; text-align:right">از ${contentDataPresenceDay[i].startTime} تا ${contentDataPresenceDay[i].endTime}  ${contentDataPresenceDay[i].dayName}</td>
    //                    </tr>
    //                   `
    //    }
    //    content += `</tbody></table></div></div>`


    //}

    if (checkResponse(contentData[0].branchAddress) && contentData[0].branchAddress != "") {
        content += `
                       <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;${contentData[0].admissionCashInfoList != null ? "" : "border-top:2px solid #000"}">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 100%;;text-align:center"">${contentData[0].branchAddress}</div>
                            </div>
                        </div>
                    `
    }

    if (contentData[0].branchLineInfoList != null) {

        var branchLineInfoList = contentData[0].branchLineInfoList;
        var branchLineInfoListLen = contentData[0].branchLineInfoList.length;
        let branchLineTypeNameList = "";
        for (let i = 0; i < branchLineInfoListLen; i++) {
            if (branchLineInfoList[i].branchLineTypeId == 1) {
                if (checkResponse(branchLineInfoList[i].value) && branchLineInfoList[i].value != "")
                    branchLineTypeNameList += `${branchLineInfoList[i].value} /`;

            }
        }

        if (branchLineTypeNameList != "")
            content += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center">${branchLineTypeNameList.slice(0, -1)}</div></div>`

    }


    content += "</div>"

    if (setupInfo.centralWebsite != "" && setupInfo.centralWebsite != null)
        content += ` <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center"> ${setupInfo.centralWebsite} : نوبت دهی </div></div></div>`

    sendToPrint(content);
}

function contentPrintAdmissionCompressDouble(admissionId, bcTargetPrintprescription) {

    let setupInfo = getSetupInfo();
    let contentData = getCompressContentData(admissionId);
    let lnContentData = contentData.length;
    //let contentDataPresenceDay = lnContentData > 0 ? getpresencedays(contentData[0].attenderId, contentData[0].branchId, contentData[0].reserveDate) : null;

    let sumPatientShareAmount = 0
    let sumNetAmount = 0
    let sumQty = 0
    let sumBasicServiceAmount = 0


    let sumBasicShareAmount = 0
    let sumCompShareAmount = 0
    let sumThirdPartyAmount = 0
    let sumDiscountAmount = 0


    for (let i = 0; i < contentData.length; i++) {
        sumPatientShareAmount += contentData[i].patientShareAmount
        sumNetAmount += contentData[i].netAmount
        sumQty += contentData[i].qty
        sumBasicServiceAmount += contentData[i].basicServiceAmount


        sumBasicShareAmount += contentData[i].basicShareAmount
        sumCompShareAmount += contentData[i].compShareAmount
        sumThirdPartyAmount += contentData[i].thirdPartyAmount
        sumDiscountAmount += contentData[i].discountAmount
    }


    let admissionCashInfoListContent = ""

    if (contentData[0].admissionCashInfoList != null) {
        admissionCashInfoListContent += `
                        <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">شناسه صندوق</div>
                                <div style="width: 50%;">مبلغ</div>
                            </div>
                        </div>            
                    `

        var admissionCashInfoList = contentData[0].admissionCashInfoList
        var admissionCashInfoListLen = contentData[0].admissionCashInfoList.length

        for (let i = 0; i < admissionCashInfoListLen; i++) {
            admissionCashInfoListContent += `
                        <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-bottom:2px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">${admissionCashInfoList[i].id}</div>
                                <div style="width: 50%;">
                                ${admissionCashInfoList[i].cashAmount < 0
                    ? `( ${transformNumbers.toComma(admissionCashInfoList[i].cashAmount)} )`
                    : transformNumbers.toComma(admissionCashInfoList[i].cashAmount)}
                                </div>
                            </div>
                        </div>
                        `
        }

    }

    //let admissionDataPresenceDayContent = ""
    //if (contentDataPresenceDay.length > 0) {
    //    admissionDataPresenceDayContent += `   <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
    //                        <div style="width: 100%;display: inline-flex;">
    //                        <table style="width:100% !important">
    //                               <tbody>`



    //    for (var i = 0; i < contentDataPresenceDay.length; i++) {
    //        admissionDataPresenceDayContent += `<tr style="font-size:13px;">
    //                     <td style = "width:100%; text-align:right">از ${contentDataPresenceDay[i].startTime} تا ${contentDataPresenceDay[i].endTime}  ${contentDataPresenceDay[i].dayName}</td>
    //                    </tr>
    //                   `
    //    }
    //    admissionDataPresenceDayContent += `</tbody></table></div></div>`


    //}


    let admissionAdressAndPhoneContent = ""
    if (checkResponse(contentData[0].branchAddress) && contentData[0].branchAddress != "") {
        let setBorderByCondition =
            (checkResponse(contentData[0].serviceDescription) && contentData[0].serviceDescription != "") ||
                (checkResponse(contentData[0].prescriptionComment) && contentData[0].prescriptionComment != "")
                ? "border-top:2px solid #000" : "border-top:1px solid #000"

        admissionAdressAndPhoneContent += `
                       <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;${setBorderByCondition}">
                            <div style="width: 100%;display: inline-flex;text-align:center">
                                <div style="width: 100%;text-align:center"">${contentData[0].branchAddress}</div>
                           </div>
                        </div>
                    `
    }

    if (contentData[0].branchLineInfoList != null) {

        var branchLineInfoList = contentData[0].branchLineInfoList;
        var branchLineInfoListLen = contentData[0].branchLineInfoList.length;
        let branchLineTypeNameList = "";
        for (let i = 0; i < branchLineInfoListLen; i++) {
            if (branchLineInfoList[i].branchLineTypeId == 1) {
                if (checkResponse(branchLineInfoList[i].value) && branchLineInfoList[i].value != "")
                    branchLineTypeNameList += `${branchLineInfoList[i].value} /`;

            }
        }

        if (branchLineTypeNameList != "")
            admissionAdressAndPhoneContent += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px">
                             <div style="width: 100%;display: inline-flex;text-align:right">
                                <div style="width: 100%;text-align:center">${branchLineTypeNameList.slice(0, -1)}</div>
                             </div>
                            </div>
                           `

    }

    let content =
        `<div style="display: inline-flex;">
        <div style="display: inline-flex;width: 50%;padding-right: 2%;border-right: 1px solid;flex-wrap: wrap;word-break: break-word;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'">
             
             <div style="width:100%;display: inline-flex;padding:2px;">
                <span style="width:30%; text-align: center">
                    <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;" />
                </span>                
                  <div style="width: 70%; text-align: right; display: grid; ">
                    <span style="width:100%; text-align:right">${setupInfo.name}</span>                   
                  </div>
            </div>
            <div style="border-bottom:1px solid #000;">
              <span style="width:100%;font-size:17px;font-weight: bolder; text-align:right">پذیرش مراجعه کننده - ${contentData[0].workflowName}</span> 
            </div>

                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;justify-content:center; padding:2px">
                        <div style="width:100%;height:35px;!important">${bcTargetPrintprescription}</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].departmentName}</div>
                        <div style="width: 55%">:بخش خدمت</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:45%;">${contentData[0].alterTime} ${contentData[0].alterDate}</div>
                        <div style="width: 55%">:تاریخ/زمان ثبت</div>
                    </div>
                        <div style="width: 100%;display: inline-flex;">
                           <div style="width:45%;">${contentData[0].reserveTime} ${contentData[0].reserveDatePersian}</div>
                            <div style="width: 55%;">:تاریخ/زمان رزرو</div>
                        </div>
                        <div style="width: 100%;display: inline-flex;">
                            <div style="width: 45%;">${contentData[0].admissionNo}</div>
                            <div style="width: 55%;">:نوبت</div>
                        </div>
                        <div style="width: 100%;display: inline-flex;">
                            <div style="width: 45%">${contentData[0].reserveShiftName}</div>
                            <div style="width: 55%">:شیفت</div>
                        </div>          
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].patientFullName}</div>
                        <div style="width: 55%">:نام مراجعه کننده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].patientNationalCode}</div>
                        <div style="width: 55%">:نمبر تذکره مراجعه کننده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;font-weight: bold;">${contentData[0].inqueryID == null ? 0 : contentData[0].inqueryID}</div>
                        <div style="width: 55%;">:شناسه استحقاق درمان</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].attenderFullName} - ${contentData[0].msc}</div>
                        <div style="width: 55%">:داکتر</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].referringDoctorFullName == null ? "" : contentData[0].referringDoctorFullName}</div>
                        <div style="width: 55%">:داکتر ارجاع دهنده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].prescriptionDatePersian}</div>
                        <div style="width: 55%">:تاریخ نسخه</div>
                    </div>
                </div>
                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">

                    <div style="width: 100%;display: flex;flex-direction: column">
                         <div style="width: 100%">:بیمه اجباری</div>
                         <div style="width: 100%">${contentData[0].basicInsurerName} - ${contentData[0].basicInsurerLineName}</div>                     
                    </div>    

                    ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display:flex;flex-direction: column">
                            <div style="width: 100%">:بیمه تکمیلی</div>
                            <div style="width: 100%">${contentData[0].compInsurerName}</div>                    
                         </div>`
            : ""}
                     ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display:flex;flex-direction: column">
                              <div style="width: 100%">:طرف قرارداد</div>
                              <div style="width: 100%">${contentData[0].thirdPartyInsurerName}</div>
                         </div>`: ""}
                    ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                              <div style="width: 100%">:تخفیف</div>
                              <div style="width: 100%">${contentData[0].discountInsurerName}</div>                   
                         </div>`: ""}

                     ${+contentData[0].basicInsurerNo !== 0 ?
            `<div style="width: 100%; display: inline-flex">
                               <div style="width: 45%">${contentData[0].basicInsurerNo}</div>
                               <div style="width: 55%">:شماره بیمه</div>
                        </div>`
            : ""}   

                </div>
                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:100%;direction: rtl;"> نوع خدمت : ${contentData[0].serviceName}</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${sumQty}</div>
                        <div style="width: 55%">:تعداد</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumBasicServiceAmount)}</div>
                        <div style="width: 55%">:مبلغ خدمت</div>
                    </div>
                    ${sumBasicShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                        <div style="width: 45%">${transformNumbers.toComma(sumBasicShareAmount)}</div>
                                        <div style="width: 55%">:سهم بیمه اجباری</div>
                                    </div>`
            : ""}
                    ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                        <div style="width: 45%">${transformNumbers.toComma(sumCompShareAmount)}</div>
                                        <div style="width: 55%">:سهم بیمه تکمیلی</div>
                                    </div>`
            : ""}
                    ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                                <div style="width: 45%">${transformNumbers.toComma(sumThirdPartyAmount)}</div>
                                                <div style="width: 55%">:سهم طرف قرارداد</div>
                                            </div>`
            : ""}
                    ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                        <div style="width: 45%">${transformNumbers.toComma(sumDiscountAmount)}</div>
                                        <div style="width: 55%">:سهم تخفیف</div>
                                    </div>`
            : ""}

                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumPatientShareAmount)}</div>
                        <div style="width: 55%">:سهم مراجعه کننده</div>
                    </div>

                </div>
                <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                     <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${contentData[0].admissionMasterId}</div>
                        <div style="width: 55%;">:شناسه پرونده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].id}</div>
                        <div style="width: 55%">:شناسه پذیرش</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].createUserFullName}</div>
                        <div style="width: 55%">:کاربر پذیرش</div>
                    </div>
                </div>
                <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumNetAmount)}</div>
                        <div style="width: 55%">:جمع پذیرش</div>
                    </div>
                </div>

                ${admissionCashInfoListContent}

                ${checkResponse(contentData[0].serviceDescription) && contentData[0].serviceDescription != "" ?
            `
                            <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px">
                                <div style="width: 100%;display: inline-flex;">
                                    <div style="width: 100%">:توضیحات خدمت</div>
                                </div>
                                <div style="width: 100%;display: inline-flex;">
                                    <div style="width: 100%">${contentData[0].serviceDescription}</div>
                                </div>
                            </div>

                        `
            :
            ""
        }
                ${checkResponse(contentData[0].prescriptionComment) && contentData[0].prescriptionComment != "" ?
            `
                            <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px">
                                <div style="width: 100%;display: inline-flex;">
                                    <div style="width: 100%">:توضیحات نسخه</div>
                                </div>
                                <div style="width: 100%;display: inline-flex;">
                                    <div style="width: 100%">${contentData[0].prescriptionComment}</div>
                                </div>
                            </div>
                        `
            :
            ""
        }

        ${admissionAdressAndPhoneContent}
            
        ${(setupInfo.centralWebsite != "" && setupInfo.centralWebsite != null) ?
            ` <div style = "width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000" >
              <div style="width: 100%;display: inline-flex;">
                <div style="width: 100%;text-align:center"> ${setupInfo.centralWebsite} : نوبت دهی </div></div></div>`
            : ""
        }
        </div>
        <div style="display: inline-flex;width: 50%;padding-left: 2%;flex-wrap: wrap;word-break: break-word;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'">

                 <div style="width:100%;display: inline-flex;padding:2px;">
                     <span style="width:30%; text-align: center">
                         <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;" />
                     </span>                
                       <div style="width: 70%; text-align: right; display: grid; ">
                         <span style="width:100%; text-align:right">${setupInfo.name}</span>                   
                       </div>
                 </div>
                 <div style="border-bottom:1px solid #000;">
                   <span style="width:100%;font-size:17px;font-weight: bolder; text-align:right">پذیرش مراجعه کننده - ${contentData[0].workflowName}</span> 
                 </div>

                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;justify-content:center; padding:2px">
                        <div style="width:100%;height:35px;!important">${bcTargetPrintprescription}</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].departmentName}</div>
                        <div style="width: 55%">:بخش خدمت</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:45%;">${contentData[0].alterTime} ${contentData[0].alterDate}</div>
                        <div style="width: 55%">:تاریخ/زمان ثبت</div>
                    </div>
                  
                        <div style="width: 100%;display: inline-flex;">
                           <div style="width:45%;">${contentData[0].reserveTime} ${contentData[0].reserveDatePersian}</div>
                            <div style="width: 55%;">:تاریخ/زمان رزرو</div>
                        </div>
                        <div style="width: 100%;display: inline-flex;">
                            <div style="width: 45%;">${contentData[0].admissionNo}</div>
                            <div style="width: 55%;">:نوبت</div>
                        </div>
                        <div style="width: 100%;display: inline-flex;">
                            <div style="width: 45%">${contentData[0].reserveShiftName}</div>
                            <div style="width: 55%">:شیفت</div>
                        </div>
                   
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].patientFullName}</div>
                        <div style="width: 55%">:نام مراجعه کننده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].patientNationalCode}</div>
                        <div style="width: 55%">:نمبر تذکره مراجعه کننده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;font-weight: bold;">${contentData[0].inqueryID == null ? 0 : contentData[0].inqueryID}</div>
                        <div style="width: 55%;">:شناسه استحقاق درمان</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].attenderFullName} - ${contentData[0].msc}</div>
                        <div style="width: 55%">:داکتر</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].referringDoctorFullName == null ? "" : contentData[0].referringDoctorFullName}</div>
                        <div style="width: 55%">:داکتر ارجاع دهنده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].prescriptionDatePersian}</div>
                        <div style="width: 55%">:تاریخ نسخه</div>
                    </div>
                </div>
                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">

                   
                        <div style="width: 100%;display: flex;flex-direction: column">
                            <div style="width:100%">:بیمه اجباری</div>
                            <div style="width: 100%">${contentData[0].basicInsurerName} - ${contentData[0].basicInsurerLineName}</div>
                            
                        </div> 

                    ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                                <div style="width: 100%">:بیمه تکمیلی</div>
                             <div style="width: 100%">${contentData[0].compInsurerName}</div>
                             
                        </div>`: ""}
                    ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                                <div style="width: 100%">:طرف قرارداد</div>
                              <div style="width: 100%">${contentData[0].thirdPartyInsurerName}</div>
                              
                        </div>`: ""}
                    ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                              <div style="width: 100%">:تخفیف</div>
                              <div style="width: 100%">${contentData[0].discountInsurerName}</div>
                              
                          </div>`: ""}
                    ${+contentData[0].basicInsurerNo !== 0 ?
            `<div style="width: 100%;display:flex">
                               <div style="width: 45%">${contentData[0].basicInsurerNo}</div>
                               <div style="width: 55%">:شماره بیمه</div>
                         </div>`: ""}                
                </div>
                <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:100%;direction: rtl;"> نوع خدمت : ${contentData[0].serviceName}</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${sumQty}</div>
                        <div style="width: 55%">:تعداد</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumBasicServiceAmount)}</div>
                        <div style="width: 55%">:مبلغ خدمت</div>
                    </div>

                    ${sumBasicShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                            <div style="width: 45%">${transformNumbers.toComma(sumBasicShareAmount)}</div>
                            <div style="width: 55%">:سهم بیمه اجباری</div>
                        </div>`
            : ""}
                    ${sumCompShareAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                               <div style="width: 45%">${transformNumbers.toComma(sumCompShareAmount)}</div>
                               <div style="width: 55%">:سهم بیمه تکمیلی</div>
                        </div>`
            : ""}
                    ${sumThirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                   <div style="width: 45%">${transformNumbers.toComma(sumThirdPartyAmount)}</div>
                                    <div style="width: 55%">:سهم طرف قرارداد</div>
                     </div>`
            : ""}
                    ${sumDiscountAmount !== 0 ?
            `<div style="width: 100%;display: inline-flex;">
                                    <div style="width: 45%">${transformNumbers.toComma(sumDiscountAmount)}</div>
                                    <div style="width: 55%">:سهم تخفیف</div>
                                </div>`
            : ""}

                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumPatientShareAmount)}</div>
                        <div style="width: 55%">:سهم مراجعه کننده</div>
                    </div>
                </div>
                <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${contentData[0].admissionMasterId}</div>
                        <div style="width: 55%;">:شناسه پرونده</div>
                    </div>                   
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].id}</div>
                        <div style="width: 55%">:شناسه پذیرش</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].createUserFullName}</div>
                        <div style="width: 55%">:کاربر پذیرش</div>
                    </div>
                </div>
                <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-bottom:1px solid #000">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${transformNumbers.toComma(sumNetAmount)}</div>
                        <div style="width: 55%">:جمع پذیرش</div>
                    </div>
                </div>
            
                ${admissionCashInfoListContent}
           
                ${contentData[0].serviceDescription != "" && checkResponse(contentData[0].serviceDescription) ?
            `
                                    <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px">
                                        <div style="width: 100%;display: inline-flex;">
                                            <div style="width: 100%">:توضیحات خدمت</div>
                                        </div>
                                        <div style="width: 100%;display: inline-flex;">
                                            <div style="width: 100%">${contentData[0].serviceDescription}</div>
                                        </div>
                                    </div>

                                `
            :
            ""
        }
                ${contentData[0].prescriptionComment != "" && checkResponse(contentData[0].prescriptionComment) ?
            `
                                    <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px">
                                        <div style="width: 100%;display: inline-flex;">
                                            <div style="width: 100%">:توضیحات نسخه</div>
                                        </div>
                                        <div style="width: 100%;display: inline-flex;">
                                            <div style="width: 100%">${contentData[0].prescriptionComment}</div>
                                        </div>
                                    </div>
                                `
            :
            ""
        }

        ${admissionAdressAndPhoneContent}

        ${(setupInfo.centralWebsite != "" && setupInfo.centralWebsite != null) ?
            ` <div style = "width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000" >
              <div style="width: 100%;display: inline-flex;">
                <div style="width: 100%;text-align:center"> ${setupInfo.centralWebsite} : نوبت دهی </div></div></div>`
            : ""
        }
        </div>
    </div>`;




    sendToPrint(content);
}

function contentPrintAdmissionSale(admissionId) {

    let setupInfo = getSetupInfo();
    let contentData = getCompressContentDataSale(admissionId);
    let lnContentData = contentData.length;
    let sumPatientShareAmount = 0;

    let content =
        `<div style="display: flex; width: 246px; flex-wrap: wrap;word-word: break-all;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'">
            <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;padding:2px;">
                <span style="width:30%; text-align: center">
                    <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;">
                </span>                
                  <div style="width: 70%; text-align: right; display: grid; ">
                    <span style="width:100%; text-align:right">${setupInfo.name}</span>
                    <span style="width:100%;font-size:17px;font-weight: bolder;  text-align:right;" >سفارش کالا</span>
                  </div>
            </div>
            <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].admissionMasterId}</div>
                        <div style="width: 55%">:شناسه پرونده</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].id}</div>
                        <div style="width: 55%">:شناسه</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:45%;">${contentData[0].userId}</div>
                        <div style="width:55%;">:کد کاربر</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width:22%;">${contentData[0].alterTime}</div>
                        <div style="width:23%;">${contentData[0].alterDate}</div>
                        <div style="width: 55%">:تاریخ</div>
                    </div>
                    <div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%">${contentData[0].patientFullName}</div>
                        <div style="width: 55%">:مراجعه کننده</div>
                    </div>
            </div>
            <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;">
                <div style="width: 100%;display: inline-flex;text-align:center;">
                    <div style="width:25%;">مبلغ</div>
                    <div style="width:15%;border-left:1px solid">تعداد</div>
                    <div style="width:60%;border-left:1px solid">نام کالا</div>
                </div>
            </div>`;
    for (var i = 0; i < lnContentData; i++) {
        content +=
            `<div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;">
                <div style="width: 100%;display: inline-flex;text-align:center;">
                    <div style="width:25%;">${contentData[i].patientShareAmount}</div>
                    <div style="width:15%;border-left:1px solid">${contentData[i].qty}</div>
                    <div style="width:60%;border-left:1px solid">${contentData[i].itemName}</div>
                </div>
            </div>`;
        sumPatientShareAmount += contentData[i].patientShareAmount;


    }
    content +=
        `<div style="width:100%;${contentData[0].admissionCashInfoList != null ? "" : "border - bottom: 2px solid #000"};display: inline-flex;flex-wrap: wrap;padding:3px;">
            <div style="width: 100%;display: inline-flex;">
                <div style="width: 45%">${transformNumbers.toComma(sumPatientShareAmount)}</div>
                <div style="width: 55%">:مبلغ</div>
            </div>
        </div>
        `;


    if (checkResponse(contentData[0].branchAddress) && contentData[0].branchAddress != "") {
        content += `
                       <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:1px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 100%;text-align:center">${contentData[0].branchAddress}</div>
                            </div>
                        </div>
                    `
    }

    if (contentData[0].branchLineInfoList != null) {

        var branchLineInfoList = contentData[0].branchLineInfoList;
        var branchLineInfoListLen = contentData[0].branchLineInfoList.length;
        let branchLineTypeNameList = "";
        for (let i = 0; i < branchLineInfoListLen; i++) {
            if (branchLineInfoList[i].branchLineTypeId == 1) {
                if (checkResponse(branchLineInfoList[i].value) && branchLineInfoList[i].value != "")
                    branchLineTypeNameList += `${branchLineInfoList[i].value} /`;

            }
        }

        if (branchLineTypeNameList != "")
            content += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center">${branchLineTypeNameList.slice(0, -1)}</div></div>`

    }


    content += "</div>"


    sendToPrint(content);
}

function contentPrintAdmission(admissionId) {

    let setupInfo = getSetupInfo();
    let contentData = getAdmissionContentData(admissionId);
    let lnContentData = contentData.length;
    let sumNetPrice = 0;
    //let contentDataPresenceDay = lnContentData > 0 ? getpresencedays(contentData[0].attenderId, contentData[0].branchId, contentData[0].reserveDate) : null;

    let content =
        `<div style="display: flex; width: 246px; flex-wrap: wrap;word-break: break-word;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'">

            <div style="width:100%;display: inline-flex;padding:2px;">
                <span style="width:30%; text-align: center">
                    <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;" />
                </span>                
                  <div style="width: 70%; text-align: right; display: grid; ">
                    <span style="width:100%; text-align:right">${setupInfo.name}</span>
                  </div>
            </div>

            <div style="border-bottom:1px solid #000;">
              <span style="width:100%;font-size:17px;font-weight: bolder; text-align:right">پذیرش مراجعه کننده - ${contentData[0].workflowName}</span> 
            </div>


            <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].departmentName}</div>
                    <div style="width: 55%;">:بخش خدمت</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width:45%;">${contentData[0].alterTime} ${contentData[0].alterDate}</div>
                    <div style="width: 55%;">:تاریخ/زمان ثبت</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width:45%;">${contentData[0].reserveTime} ${contentData[0].reserveDatePersian}</div>
                    <div style="width: 55%;">:تاریخ/زمان رزرو</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].admissionNo}</div>
                    <div style="width: 55%;">:نوبت</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${contentData[0].reserveShiftName}</div>
                    <div style="width: 55%;">:شیفت</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].patientFullName}</div>
                    <div style="width: 55%;">:نام مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].patientNationalCode}</div>
                    <div style="width: 55%;">:نمبر تذکره مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;font-weight: bold;">${contentData[0].inqueryID == null ? 0 : contentData[0].inqueryID}</div>
                    <div style="width: 55%;">:شناسه استحقاق درمان</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[0].attenderFullName} - ${contentData[0].msc}</div>
                    <div style="width: 55%;">:داکتر</div>
                </div>
            </div>

            <div style="width:100%;border-bottom:2px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">

              
            <div style="width: 100%;display:flex;flex-direction: column">
                        <div style="width: 100%;">:بیمه اجباری</div>
                        <div style="width: 100%;">${contentData[0].basicInsurerName} - ${contentData[0].basicInsurerLineName}</div>                
            </div>

                ${+contentData[0].compShareAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                            <div style="width: 100%;">:بیمه تکمیلی</div>
                            <div style="width: 100%;">${contentData[0].compInsurerName}</div>                    
                    </div>` : ""}
                ${+contentData[0].thirdPartyAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                            <div style="width: 100%;">:طرف قرارداد</div>
                            <div style="width: 100%;">${contentData[0].thirdPartyInsurerName}</div>                   
                    </div>` : ""}
                ${+contentData[0].discountAmount !== 0 ?
            `<div style="width: 100%;display: flex;flex-direction: column">
                            <div style="width: 100%;">:تخفیف</div>
                            <div style="width: 100%;">${contentData[0].discountInsurerName}</div>                     
                    </div>` : ""}

                 ${+contentData[0].basicInsurerNo !== 0 ?
            `<div style="width: 100%;display: inline-flex">
                            <div style="width: 45%;">${contentData[0].basicInsurerNo}</div>
                            <div style="width: 55%;">:شماره بیمه</div>
                    </div>` : ""} 

                </div>`;

    for (var i = 0; i < lnContentData; i++) {
        content +=
            `<div style="width:100%;border-bottom:${lnContentData - 1 == i ? "2" : "1"}px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width:100%;direction: rtl;"> نام خدمت : ${contentData[i].serviceName}</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${contentData[i].qty}</div>
                    <div style="width: 55%;">:تعداد</div>
                </div>
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${transformNumbers.toComma(contentData[i].basicServicePrice)}</div>
                    <div style="width: 55%;">:مبلغ خدمت</div>
                </div>

                ${+contentData[i].basicShareAmount !== 0 ?
                `<div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${transformNumbers.toComma(contentData[i].basicShareAmount)}</div>
                    <div style="width: 55%;">:سهم بیمه اجباری</div>
                </div>` : ""}
                ${+contentData[i].compShareAmount !== 0 ?
                `<div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${transformNumbers.toComma(contentData[i].compShareAmount)}</div>
                        <div style="width: 55%;">:سهم بیمه تکمیلی</div>
                </div>` : ""}
                ${+contentData[i].thirdPartyAmount !== 0 ?
                `<div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${transformNumbers.toComma(contentData[i].thirdPartyAmount)}</div>
                        <div style="width: 55%;">:سهم طرف قرارداد</div>
                </div>` : ""}
                ${+contentData[i].discountAmount !== 0 ?
                `<div style="width: 100%;display: inline-flex;">
                        <div style="width: 45%;">${transformNumbers.toComma(contentData[i].discountAmount)}</div>
                        <div style="width: 55%;">:سهم تخفیف</div>
                </div>` : ""}

                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%;">${transformNumbers.toComma(contentData[i].patientShareAmount)}</div>
                    <div style="width: 55%;">:سهم مراجعه کننده</div>
                 </div>
            </div>`;
        sumNetPrice += contentData[i].netAmount;
    }

    content +=
        `
        <div style="width:100%;border-bottom:1px solid #000;display: inline-flex;flex-wrap: wrap;padding:2px;">
            <div style="width: 100%;display: inline-flex;">
                <div style="width: 45%;">${contentData[0].admissionMasterId}</div>
                <div style="width: 55%;">:شناسه پرونده</div>
            </div>
            <div style="width: 100%;display: inline-flex;">
                <div style="width: 45%;">${contentData[0].id}</div>
                <div style="width: 55%;">:شناسه پذیرش</div>
            </div>
            <div style="width: 100%;display: inline-flex;">
                <div style="width: 45%;">${contentData[0].createUserFullName}</div>
                <div style="width: 55%;">:کاربر پذیرش</div>
            </div>
        </div>
        <div style="width:100%;${contentData[0].admissionCashInfoList == null ? "" : "border-bottom:1px solid #000"};display: inline-flex;flex-wrap: wrap;padding:2px;">
            <div style="width: 100%;display: inline-flex;">
                <div style="width: 45%;">${transformNumbers.toComma(sumNetPrice)}</div>
                <div style="width: 55%;">:جمع پذیرش</div>
            </div>
        </div>`;

    if (contentData[0].admissionCashInfoList != null) {
        content += `
                        <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">شناسه صندوق</div>
                                <div style="width: 50%;">مبلغ</div>
                            </div>
                        </div>
                 
                    `

        var admissionCashInfoList = contentData[0].admissionCashInfoList
        var admissionCashInfoListLen = contentData[0].admissionCashInfoList.length

        for (let i = 0; i < admissionCashInfoListLen; i++) {
            content += `
                        <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 50%;">${admissionCashInfoList[i].id}</div>
                                <div style="width: 50%;">
                                    ${admissionCashInfoList[i].cashAmount < 0
                    ? `( ${transformNumbers.toComma(admissionCashInfoList[i].cashAmount)} ) `
                    : transformNumbers.toComma(admissionCashInfoList[i].cashAmount)
                }</div>
                            </div>
                        </div>
                        `
        }

    }

    //if (contentDataPresenceDay.length > 0) {
    //    content += `  <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000">
    //                        <div style="width: 100%;display: inline-flex;">
    //                        <table style="width:100% !important">
    //                               <tbody>`



    //    for (var i = 0; i < contentDataPresenceDay.length; i++) {
    //        content += `<tr style="font-size:13px;">
    //                     <td style = "width:100%; text-align:right">از ${contentDataPresenceDay[i].startTime} تا ${contentDataPresenceDay[i].endTime}  ${contentDataPresenceDay[i].dayName}</td>
    //                    </tr>
    //                   `
    //    }
    //    content += `</tbody></table></div></div>`


    //}

    if (checkResponse(contentData[0].branchAddress) && contentData[0].branchAddress != "") {
        content += `
                       <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                                <div style="width: 100%;text-align:center">${contentData[0].branchAddress}</div>
                            </div>
                        </div>
                    `
    }

    if (contentData[0].branchLineInfoList != null) {

        var branchLineInfoList = contentData[0].branchLineInfoList;
        var branchLineInfoListLen = contentData[0].branchLineInfoList.length;
        let branchLineTypeNameList = "";
        for (let i = 0; i < branchLineInfoListLen; i++) {
            if (branchLineInfoList[i].branchLineTypeId == 1) {
                if (checkResponse(branchLineInfoList[i].value) && branchLineInfoList[i].value != "")
                    branchLineTypeNameList += `${branchLineInfoList[i].value} /`;

            }
        }

        if (branchLineTypeNameList != "")
            content += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center">${branchLineTypeNameList.slice(0, -1)}</div></div>`


    }



    content += "</div>"

    if (setupInfo.centralWebsite != "" && setupInfo.centralWebsite != null)
        content += ` <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center"> ${setupInfo.centralWebsite} : نوبت دهی </div></div></div>`
    sendToPrint(content);

}

function sendToPrint(content) {
    $('#frmDirectPrint').contents().find("body").html(content + footerBodyPrintIfrem);
}

function getCompressContentData(id) {

    var viewData_get_printAdmissioncomppress_data_url = `${viewData_baseUrl_MC}/AdmissionApi/getaggregationprintadmission`;

    let output = $.ajax({
        url: viewData_get_printAdmissioncomppress_data_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_get_printAdmissioncomppress_data_url);
            return null;
        }
    });
    return output.responseJSON;
}

function deleteAdmissionLine(admissionId, serviceId) {
    let model = { admissionId, serviceId };
    var viewData_get_deleteAdmission_data_url = `${viewData_baseUrl_MC}/AdmissionServiceReimbursmentApi/deletefromadmission`;

    let output = $.ajax({
        url: viewData_get_deleteAdmission_data_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_get_deleteAdmission_data_url);
            return null;
        }
    });
    return output.responseJSON;
}

function getCompressContentDataSale(id) {

    var viewData_get_printAdmissioncomppressSale_data_url = `${viewData_baseUrl_MC}/AdmissionItemApi/getprintadmissionsale`;

    let output = $.ajax({
        url: viewData_get_printAdmissioncomppressSale_data_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_get_printAdmissioncomppressSale_data_url);
            return null;
        }
    });
    return output.responseJSON;
}

function getAdmissionContentData(id) {

    let output = $.ajax({
        url: viewData_get_printAdmission_data_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, viewData_get_printAdmission_data_url);
            return null;
        }
    });
    return output.responseJSON;
}

function getpresencedays(attenderId, branchId, reserveDate) {

    let model = {
        attenderId: attenderId,
        branchId: branchId,
        workDayDate: reserveDate

    }
    let url = `/api/MC/AttenderTimeSheetLineApi/getpresencedays`
    let output = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return output.responseJSON;
}

function doubleprintBarcode(element, admissionId, stageId, workflowId) {

    element.barcode(`${admissionId}-${stageId}-${workflowId}`, "code128", { barWidth: 2, barHeight: 30, output: 'bmp' });
    let bcTargetPrintprescription = element.html()
    return bcTargetPrintprescription

}

function resetSearchPatient() {
    $("#searchPatientFullName").val("");
    $("#searchPatientNationalCode").val("");
    $("#searchPatientBasicInsurerNo").val("");
    $("#searchPatientMobileNo").val("");
    $("#searchPatientBasicInsurerLineId").val("0");
    $("#searchPatientCompInsurerThirdPartyId").val("0");
    $("#searchPatientDiscountInsurerId").val("0");
}

function checkCounter(isCash = false) {

    var cashier = getCashIdByUserId();
    var result = { successfull: true, statusMessage: "" }

    if (checkResponse(cashier)) {
        if (!cashier.isActive)
            result = { successfull: false, statusMessage: "غرفه فعال نمی باشد" }
        else if (isCash) {
            if (cashier.counterTypeId === 1)
                result = { successfull: false, statusMessage: "این غرفه مجوز ثبت دریافت/پرداخت ندارد" }
        }
        else if (cashier.counterTypeId === 2)
            result = { successfull: false, statusMessage: "این غرفه مجوز ثبت پذیرش ندارد" }
    }
    else
        result = { successfull: false, statusMessage: "شناسه غرفه برای این سیستم مشخص نشده است ." }

    return result;
}

function getInsurerInfo(insurerId = 0, insurerLineId = 0, insurerCode = "", insurerLineCode = "") {

    var model = { insurerId, insurerLineId, insurerCode, insurerLineCode };

    var viewData_get_insurerCode_url = `${viewData_baseUrl_MC}/InsuranceApi/getinsurerinfo`;

    var result = $.ajax({
        url: viewData_get_insurerCode_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_insurerCode_url);
            return {};
        }
    });

    return result.responseJSON;
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

function getAdmissionAmount(admissionId) {

    let getAdmissionAmountUrl = `${viewData_baseUrl_MC}/AdmissionApi/getadmissionamount`

    let result = $.ajax({
        url: getAdmissionAmountUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admissionId),
        cache: false,
        async: false,
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, getAdmissionAmountUrl);
            return null
        }
    });

    return result.responseJSON
}

function getMasterCashInfo(currentAdmMasterId, currentAdmId) {

    let getMasterCashInfoUrl = `${viewData_baseUrl_MC}/AdmissionMasterApi/getadmissionmasteramount/${currentAdmMasterId}/${currentAdmId}`

    let getMasterCashInfoResult = $.ajax({
        url: getMasterCashInfoUrl,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, getMasterCashInfoUrl);
            return null
        }
    });

    return getMasterCashInfoResult.responseJSON

}

function getAttenderTimeShiftList(attenderId = 0, branchId = 0, currentDate = "", currentTime = "", isOnline = false) {

    let attenderTimeShiftListUrl = `${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/getattendertimeshiftlist`

    let attenderTimeShiftListModel = {
        attenderId,
        currentDate,
        currentTime,
        branchId,
        isOnline
    }

    let result = $.ajax({
        url: attenderTimeShiftListUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(attenderTimeShiftListModel),
        cache: false,
        async: false,
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, attenderTimeShiftListUrl);
            return null
        }
    });

    return result.responseJSON

}

function checkValidation(id, isMaster = false) {

    let url = `/api/AdmissionsApi/checksettelmentmaster/${id}/${isMaster}`;

    let outPut = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null) {
                return res;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    console.log(`check medicalrevenue ${outPut.responseJSON}`)

    return outPut.responseJSON;

}