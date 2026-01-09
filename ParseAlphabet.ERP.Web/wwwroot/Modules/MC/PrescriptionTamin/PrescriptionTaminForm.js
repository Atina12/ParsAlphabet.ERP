$(".tab-content").show();
$(".select2").select2();

var viewData_controllername = "PrescriptionTaminApi",
    viewData_get_drugamountdropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/drugamountdropdown`,
    viewData_get_favoritelist = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getfavoritelist`,
    viewData_get_drugusagedropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/drugusagedropdown`,
    viewData_get_druginstructiondropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/druginstructiondropdown`,
    viewData_get_serviceId = `${viewData_baseUrl_MC}/${viewData_controllername}/getservicedropdownbytype`,
    viewData_get_plandropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/plandropdown`,
    viewData_get_illnessdropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/illnessdropdown`,
    viewData_get_organparentdropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/organparentdropdown`,
    viewData_get_organdropdown = `${viewData_baseUrl_MC}/${viewData_controllername}/organdropdown`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_save_PrescriptionTamin = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_get_PrescriptionByAdmissionId = `${viewData_baseUrl_MC}/${viewData_controllername}/display`,
    viewData_get_PrescriptionOtpCode = `${viewData_baseUrl_MC}/requestPrescriptionTamin/getrequestprescription`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`, currentAdmission = {}, cerrentType = 0, admissionAttenderId = "", admissionIdentity = 0,
    arrayLines = [], typeSave = "INS", currentRowLine = 0, identityForm = $("#prescriptionTaminId").val(), prescriptionTyp1 = 0, currentPrescriptionId = 0, currentRequestEPrescriptionId = 0,
    serviceIds = [],
    strResultPrescriptionTamin = "",
    lineSendResult = 0, lineSendDatetime = null, lineNoteDetailsEprscId = null, currentPrescriptionTabId = 16;


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

function choiceAdmissionTaminForm() {

    initSearchAdmissionModal("mc.PrescriptionTamin")
    $("#workflowId").val("154");
    $("#workflowId").attr('disabled', 'disabled');
    modal_show('searchAdmissionModal');
}

async function initPrescriptionForm() {
    $(".select2").select2();
    $("input").inputmask();

    var newOption = new Option("انتخاب کنید", 0, true, true);
    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    $("#isBr").prop("checked", true).trigger("change");

    await bindPrescriptionElementFavorite();

    await ColumnResizeable("list_1");
    await ColumnResizeable("list_2");
    await ColumnResizeable("list_3");
    await ColumnResizeable("list_5");
    await ColumnResizeable("list_6");
    await ColumnResizeable("list_4");
    await ColumnResizeable("list_7");
    await ColumnResizeable("list_13");
    await ColumnResizeable("list_14");
    await ColumnResizeable("list_17");

    if (identityForm !== 0 && identityForm !== 'null' && identityForm !== undefined) {
        $("#choiceOfAdmission").css("display", "none")
        getPrescription(identityForm);
    }
    else
        $("#choiceOfAdmission").css("display", "inline")

}

async function bindPrescriptionElementFavorite() {


    await fill_select2Favorite(17, "serviceId_12", false, taminPrescriptionTypes.sideways.id, false, true);//Reference version , viewData_get_serviceId
    await fill_select2Favorite(17, "serviceId_17", false, taminPrescriptionTypes.sideways.id, false, true);//Side services , viewData_get_serviceId
    await fill_select2Favorite(19, "serviceId_2", false, taminPrescriptionTypes.lab.id, false, true);//labratory service  viewData_get_serviceId   
    await fill_select2Favorite(20, "serviceId_3", false, taminPrescriptionTypes.radio.id, false, true);//Radiology service  viewData_get_serviceId
    await fill_select2Favorite(21, "serviceId_5", false, taminPrescriptionTypes.ctScan.id, false, true);//CT scan service  viewData_get_serviceId
    await fill_select2Favorite(22, "serviceId_6", false, taminPrescriptionTypes.mRI.id, false, true);//MRI service viewData_get_serviceId
    await fill_select2Favorite(23, "serviceId_4", false, taminPrescriptionTypes.sono.id, false, true);//Sonography service viewData_get_serviceId
    await fill_select2Favorite(24, "serviceId_13", false, taminPrescriptionTypes.physiotherapy.id, false, true);//physiotherapy service viewData_get_serviceId
    await fill_select2Favorite(29, "serviceId_7", false, taminPrescriptionTypes.nuclear.id, false, true);//nuclear medicine service  viewData_get_serviceId
    await fill_select2Favorite(30, "serviceId_14", false, taminPrescriptionTypes.densitometry.id, false, true);//Bone Densitometry service viewData_get_serviceId


    await fill_select2(viewData_get_plandropdown, "plan", true);
    await fill_select2(viewData_get_illnessdropdown, "illness", true);
    await fill_select2(viewData_get_organparentdropdown, "parentOrganId", true);
    await fill_select2(viewData_get_drugamountdropdown, "drugAmount", true);
    await fill_select2(viewData_get_drugusagedropdown, "drugUsage", true);
    await fill_select2(viewData_get_druginstructiondropdown, "drugInstruction", true)
}

function showfavoriteTamin() {

    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderIdFavoriteTamin", true, 0, false, 0, "انتخاب داکتر...");


    currentTab.id = currentPrescriptionTabId == 16 ? 1 : currentPrescriptionTabId;

    $(`#favoriteLink${currentTab.id}`).addClass("active");
    $(`#favoritembox_${currentTab.id}`).addClass("active");

    if (+admissionAttenderId > 0) {

        $("#attenderIdFavoriteTamin").val(admissionAttenderId).trigger("change");

        getpageFavorite(+admissionAttenderId, currentTab.id, null);
    }
    else
        getpageFavorite(null, currentTab.id, null);

    currentTab.rowNumber = arrayLines.filter(x => +x.serviceTypeId == +currentPrescriptionTabId).length;

    modal_show("favoriteTaminModals");
}

function changeTabIdByClick(id) {

    currentPrescriptionTabId = id;
    currentTab.lastCurrentId = currentTab.id;
    currentTab.rowNumber = arrayLines.filter(x => +x.serviceTypeId == +currentPrescriptionTabId).length;
}



function fill_select2Favorite(favoriteCategory, elementid, idandtitle = false, serviceType = "", isGeneric = false, isAjax = false, p_minimumInputLength = 3, placeholder = " انتخاب ") {

    var dataModel = {
        id: admissionAttenderId,
        favoriteCategory: favoriteCategory,
        Term: "",
        serviceType,
        isGeneric
    }
    var query = {};

    $(`#${elementid}`).empty()

    if (isAjax) {
        $(`#${elementid}`).select2({
            placeholder: placeholder,
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            minimumInputLength: p_minimumInputLength,
            closeOnSelect: true,
            selectOnClose: true,
            allowClear: true,
            ajax: {
                delay: 500,
                url: function () {
                    let url = ""

                    url = `${viewData_get_serviceId}/1/0`

                    return url;
                },
                async: false,
                data: function (params) {
                    var query = {
                        id: admissionAttenderId,
                        favoriteCategory: favoriteCategory,
                        term: params.term,
                        serviceType,
                        isGeneric
                    }
                    return JSON.stringify(query);
                },
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                quietMillis: select2_delay,
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {

                            return {
                                text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                                id: item.id
                            }
                        })
                    };
                }
            }
        });
    }
    else {
        $.ajax({
            url: viewData_get_favoritelist,
            async: false,
            data: JSON.stringify(dataModel),
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                if (result) {
                    var data = result.map(function (item) {
                        return {
                            id: item.id,
                            text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                        };
                    });
                    $(`#${elementid}`).select2({
                        templateResult: function (item) {
                            if (item.loading) {
                                return item.text;
                            }
                            var term = query.term || '';
                            var $result = markMatch(item.text, term);
                            return $result;
                        },
                        language: {
                            searching: function (params) {
                                query = params;
                                return 'در حال جستجو...';
                            }
                        },
                        placeholder: placeholder,
                        data: data,
                        closeOnSelect: true,
                        allowClear: true,
                        escapeMarkup: function (markup) {
                            return markup;
                        }
                    });

                    $(`#${elementid}`).val(0).trigger('change.select2');
                }

            },
            error: function (xhr) {
                error_handler(xhr, viewData_get_favoritelist);
            }
        });
    }

}

function getPrescription(prescriptionId) {

    let nextPrescriptionModel = {
        prescriptionId: prescriptionId,
        headerPagination: 0
    }
    $.ajax({
        url: viewData_get_PrescriptionByAdmissionId,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(nextPrescriptionModel),
        success: function (data) {
            fillPrescriptionTamin(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_PrescriptionByAdmissionId);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

};

function getOtpCode() {

    var modal1 = { id: currentPrescriptionId, opr: "" };

    $.ajax({
        url: viewData_get_PrescriptionOtpCode,
        type: "get",
        dataType: "",
        contentType: "application/json",
        data: modal1,
        async: false,
        cache: false,
        success: function (result) {

            if (result != null && result.status == 200) {

                $("#OptCode").prop("disabled", false);
                $("#OptCode").val("");
                alertify.success("عملیات با موفقیت انجام شد");
            }
            else {

                alertify.warning("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", 6);
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_PrescriptionOtpCode)
        }
    });

};

function fillPrescriptionTamin(pr) {

    if (pr !== null && pr != undefined) {

        $("#userFullName").val(`${pr.createUserId} - ${pr.createUserFullName}`);
        $("#creatDateTime").val(pr.createDateTimePersian);
        $("#prescriptionBox").removeClass("displaynone");
        $("#expiryDatePersian").val(pr.expireDatePersian);
        $("#note").val(pr.comment);
        $("#description").val(pr.comment);
        if (pr.otpCode != null && pr.otpCode != "") {
            $("#OptCode").prop("disabled", true);
            $("#OptCode").val(pr.otpCode);
        }
        else
            $("#OptCode").prop("disabled", false);

        let newData = {
            admissionId: pr.admissionServiceTaminId,
            patientId: pr.patientId,
            patientFullName: pr.patientFullName,
            patientNationalCode: pr.patientNationalCode,
            basicInsrerName: pr.basicInsrerName,
            basicInsuranceBoxName: pr.basicInsuranceBoxName,
            compInsuranceBoxName: pr.compInsuranceBoxName,
            thirdPartyId: pr.thirdPartyId,
            thirdPartyName: pr.thirdPartyName,
            attenderFullName: pr.attenderFullName
        }

        fillAdmission(newData)


        currentAdmission = {
            admissionServiceTaminId: pr.admissionServiceTaminId,
            patientId: pr.patientId,
            patientFullName: pr.patientFullName,
            patientNationalCode: pr.patientNationalCode,
            basicInsrerName: pr.basicInsrerName,
            basicInsuranceBoxName: pr.basicInsuranceBoxName,
            compInsuranceBoxName: pr.compInsuranceBoxName,
            attenderFullName: pr.attenderFullName,
            admissionTypeId: 3,
            admissionTaminWorkflowId: pr.workflowId,
            admissionTaminStageId: pr.stageId
        };
        currentAdmission.admissionId = pr.admissionServiceTaminId;
        currentAdmission.attenderId = pr.attenderId;
        currentPrescriptionId = pr.id;
        currentRequestEPrescriptionId = pr.requestEPrescriptionId;

        if (currentRequestEPrescriptionId > 0 && pr.sendResult != 3) {
            $("#OptCode").removeClass("displaynone");
            $("#getOtpCode").removeClass("displaynone");
            $("#OTPLbl").removeClass("displaynone");
        }

        cerrentType = pr.taminPrescriptionCategoryId

        if (pr.taminPrescriptionCategoryId == 3) {
            $(`[href="#box_16"]`).click();
        }
        else {
            if (pr.prescriptionLines.length > 0) {

                if (pr.taminPrescriptionCategoryId == 6) {
                    $(`[href="#box_12"]`).click();
                }
                else {
                    $(`[href="#box_${pr.prescriptionLines[0].taminPrescriptionTypeId}"]`).click();
                }
            }
        }

        if (checkResponse(pr.prescriptionLines) && pr.prescriptionLines.length > 0) {
            for (var i = 0; i < pr.prescriptionLines.length; i++)
                fillLinePrescriptionTamin(pr.prescriptionLines[i], pr.prescriptionLines[i].taminPrescriptionTypeId, pr.taminPrescriptionCategoryId);
        }


    }
};

function fillLinePrescriptionTamin(data, type, prescriptionType) {

    let thisTypeArray = arrayLines.filter(x => +x.serviceTypeId == +type);
    lineSendDatetime = data.sendDateTime;
    lineSendResult = data.sendResult;
    lineNoteDetailsEprscId = data.noteDetailsEprscId;

    cerrentType = type;

    let model = {
        id: data.id,
        indexRow: arrayLines.length == 0 ? 1 : arrayLines[arrayLines.length - 1].indexRow + 1,
        rowNumber: arrayLines.length == 0 ? 1 : arrayLines.length + 1,//thisTypeArray.length + 1,
        prescriptionId: data.prescriptionId,
        serviceId: +data.serviceId,
        serviceName: `${data.serviceId} - ${data.serviceCodeName}`,
        quantity: +data.quantity,
        serviceTypeId: type,
        sendResult: +data.sendResult,
        sendDateTime: data.sendDateTime,
        noteDetailsEprscId: data.noteDetailsEprscId
    };

    switch (+type) {
        case 1:
            model.isBr = data.serviceGenericCode == "" ? false : true;
            model.drugAmountId = +data.drugAmountId;
            model.drugAmountName = `${data.drugAmountId} - ${data.drugAmountName}`;
            model.repeat = data.repeat;
            model.doDatePersian = data.doDatePersian;
            model.drugInstructionId = +data.drugInstructionId;
            model.drugInstructionName = `${data.drugInstructionId} - ${data.drugInstructionName}`;
            model.drugUsageId = +data.drugUsageId;
            model.drugUsageName = `${data.drugUsageId} - ${data.drugUsageName}`;

            break;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 12:
        case 14:
        case 16:
        case 17:
            //model.isEn = true;
            break;

        case 13:
            model.parentOrganId = +data.parentOrganId;
            model.parentOrganName = `${data.parentOrganId} - ${data.parentOrganName}`;
            model.organId = +data.organId;
            model.organName = `${data.organId} - ${data.organName}`;
            model.planId = +data.planId;
            model.planName = `${data.planId} - ${data.planName}`;
            model.illnessId = +data.illnessId;
            model.illnessName = `${data.illnessId} - ${data.illnessName}`;

            break;

        default:
            break;
    }
    //تب ویزیت
    if (prescriptionType == 3)
        type = 16;
    else {
        //تب نسخه ارجاعی
        if (prescriptionType == 6) {
            type = 12;
        }
    }
    appendLines(model, +type);
}

$("#parentOrganId").on("change", function () {
    $("#organId").html(`<option value="0">انتخاب کنید</option>`).trigger("change")
    if (+$(this).val() !== 0)
        fill_select2(viewData_get_organdropdown, "organId", false, +$(this).val());

    if (document.getElementById('organId').options.length > 1) {
        $("#organId").prop("required", true)
        $("#organId").attr("data-parsley-selectvalzero", "");
    }
    else {
        $("#organId").prop("required", false)
        $("#organId").removeAttr("data-parsley-selectvalzero");
    }
});

function addPrescriptionTaminLines(type) {

    let form = $(`#from_${type}`).parsley();
    let validate = form.validate();

    validateSelect2(form);
    if (!validate) return;

    //اون فیلد هایی که نیست 
    //dose
    //serviceCode
    //paraclinicTareffGroupId
    //planCode
    let data = arrayLines.filter(x => +x.rowNumber == currentRowLine)
    thisTypeArray = arrayLines.filter(x => +x.serviceTypeId == +type);
    let model = {
        id: 0,
        indexRow: typeSave == "INS" ? arrayLines.length == 0 ? 1 : arrayLines[arrayLines.length - 1].indexRow + 1 : currentRowLine,
        rowNumber: typeSave == "INS" ? thisTypeArray.length + 1 : currentRowLine,
        prescriptionId: $("#prescriptionTaminId").val() != "null" ? +$("#prescriptionTaminId").val() : 0,
        quantity: +$(`#quantity_${type}`).val(),
        serviceTypeId: type,
        noteDetailsEprscId: data.length > 0 ? data[0].noteDetailsEprscId : null,
        sendResult: data.length > 0 ? data[0].sendResult : null,
        sendDateTime: data.length > 0 ? data[0].sendDateTime : null
    };

    switch (+type) {
        case 1:
            model.serviceId = +$(`#serviceId_${type}`).val();
            model.serviceName = $(`#serviceId_${type}`).select2('data').length > 0 ? $(`#serviceId_${type}`).select2('data')[0].text : ``;
            model.isBr = $("#isBr").prop("checked");
            model.drugAmountId = +$("#drugAmount").val();
            model.drugAmountName = $("#drugAmount").select2('data').length > 0 ? $("#drugAmount").select2('data')[0].text : "";
            model.repeat = +$("#repeat").val();
            model.doDatePersian = $("#doDatePersian").val();
            model.drugInstructionId = +$("#drugInstruction").val();
            model.drugInstructionName = $("#drugInstruction").select2('data').length > 0 ? $("#drugInstruction").select2('data')[0].text : "";
            model.drugUsageId = +$("#drugUsage").val();
            model.drugUsageName = $("#drugUsage").select2('data').length > 0 ? $("#drugUsage").select2('data')[0].text : "";
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
            model.serviceId = +$(`#serviceId_${type}`).val();
            model.serviceName = $(`#serviceId_${type}`).select2('data').length > 0 ? $(`#serviceId_${type}`).select2('data')[0].text : ``;
            break;
        case 13:
            model.serviceId = +$(`#serviceId_${type}`).val();
            model.serviceName = $(`#serviceId_${type}`).select2('data').length > 0 ? $(`#serviceId_${type}`).select2('data')[0].text : ``;
            model.parentOrganId = +$("#parentOrganId").val();
            model.parentOrganName = $("#parentOrganId").select2('data').length > 0 ? $("#parentOrganId").select2('data')[0].text : "";
            model.organId = +$("#organId").val();
            model.organName = $("#organId").select2('data').length > 0 ? $("#organId").select2('data')[0].text : "";
            model.planId = +$("#plan").val();
            model.planName = $("#plan").select2('data').length > 0 ? $("#plan").select2('data')[0].text : "";
            model.illnessId = +$("#illness").val();
            model.illnessName = $("#illness").select2('data').length > 0 ? $("#illness").select2('data')[0].text : "";
            break;

        default:
            break;
    }
    appendLines(model, type, typeSave);
}

function changeCheckBoxPrescriptionTamin(elm) {

    let id = $(elm).attr("id").split("_")[0], type = $(elm).attr("id").split("_")[1],
        checked = $(elm).prop("checked");

    if (id == "isBr") {

        if (checked) {
            $("#serviceId_1").attr("favoritecategory", "13")
            $("#Title_1").text("برند");
        }
        else {
            $("#serviceId_1").attr("favoritecategory", "12")
            $("#Title_1").text("ژنریک");
        }

        $("#serviceId_1").html("")

        if (checked)
            fill_select2Favorite(13, "serviceId_1", false, taminPrescriptionTypes.drug.id, true, true)
        else
            fill_select2Favorite(12, "serviceId_1", false, taminPrescriptionTypes.drug.id, false, true)

    }

    funkyradio_onchange(elm);
}

function appendLines(data, type, typeSave = "INS") {



    let output = "",
        tbodyTable = $(`#temp_${type}`);

    if ($(`#temp_${type} tr:not(#emptyRow)`).length == 0)
        tbodyTable.html("");

    if (typeSave == "INS") {
        output = `<tr id="row_${data.rowNumber}_${type}"><td style="width:6px;">${data.rowNumber}</td>`

        switch (type) {
            case 1:
                output += `
                        <td style="width:40px;">${data.serviceId != 0 ? data.serviceName : ""}</td>
                        <td style="width:6px;">${data.quantity}</td>
                        <td style="width:6px;">${data.drugInstructionId != 0 ? data.drugInstructionName : ""}</td>
                        <td style="width:6px;">${data.drugAmountId != 0 ? data.drugAmountName : ""}</td>
                        <td style="width:6px;">${data.drugUsageId != 0 ? data.drugUsageName : ""}</td>
                        <td style="width:6px;">${data.repeat}</td>
                        <td style="width:6px;">${data.doDatePersian != null && data.doDatePersian != "" ? data.doDatePersian : ""}</td>`;
                break;
            case 13:
                output += `
                        <td style="width:50px;">${data.serviceId != 0 ? data.serviceName : ""}</td>
                        <td style="width:6px;">${data.quantity}</td>
                        <td style="width:7px;">${data.parentOrganId != 0 ? data.parentOrganName : ""}</td>
                        <td style="width:7px;">${data.organId != 0 ? data.organName : ""}</td>
                        <td style="width:7px;">${data.illnessId != 0 ? data.illnessName : ""}</td>
                        <td style="width:7px;">${data.planId != 0 ? data.planName : ""}</td>`;
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
                output += `<td style="width:70px;">${data.serviceId != 0 ? data.serviceName : ""}</td>
                        <td style="width:10px;">${data.quantity}</td>`;
                break;
            case 16:
                output += `<td style="width:10px;">${data.comment}</td>`;
                prescriptionTyp1 = 16;
                break;
        }
        output += `<td  style="width:10px;" id="operation_${data.rowNumber}_${type}">
                     <button type="button" id="delete_${data.rowNumber}_${type}" onclick="removeFromTemp(${data.rowNumber},'${type}')" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                          <i class="fa fa-trash"></i>
                     </button>
                     <button type="button" id="edit_${data.rowNumber}_${type}" onclick="editFromTemp(${data.rowNumber},'${type}')" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                          <i class="fa fa-pen"></i>
                     </button>
                  </td></tr>`;
        tbodyTable.append(output);

        arrayLines.push(data);

    }
    else {

        let rowNo = data.rowNumber;
        let index = arrayLines.findIndex(x => x.rowNumber == rowNo && +x.serviceTypeId == +type);
        arrayLines[index] = data;

        lineSendDatetime = data.sendDateTime;
        lineSendResult = data.sendResult;
        lineNoteDetailsEprscId = data.noteDetailsEprscId;


        /*if ([1, 13].includes(type))*/
        switch (type) {
            case 1:
                $(`#row_${rowNo}_${type} td:eq(1)`).text(data.serviceId != 0 ? data.serviceName : "");
                $(`#row_${rowNo}_${type} td:eq(2)`).text(data.quantity);
                $(`#row_${rowNo}_${type} td:eq(3)`).text(data.drugInstructionId != 0 ? data.drugInstructionName : "");
                $(`#row_${rowNo}_${type} td:eq(4)`).text(data.drugAmountId != 0 ? data.drugAmountName : "");
                $(`#row_${rowNo}_${type} td:eq(5)`).text(data.drugUsageId != 0 ? data.drugUsageName : "");
                $(`#row_${rowNo}_${type} td:eq(6)`).text(data.repeat);
                $(`#row_${rowNo}_${type} td:eq(7)`).text(data.doDatePersian != null && data.doDatePersian != "" ? data.doDatePersian : "");
                break;
            case 13:
                $(`#row_${rowNo}_${type} td:eq(1)`).text(data.serviceId != 0 ? data.serviceName : "");
                $(`#row_${rowNo}_${type} td:eq(2)`).text(data.quantity);
                $(`#row_${rowNo}_${type} td:eq(3)`).text(data.parentOrganId != 0 ? data.parentOrganName : "");
                $(`#row_${rowNo}_${type} td:eq(4)`).text(data.organId != 0 ? data.organName : "");
                $(`#row_${rowNo}_${type} td:eq(5)`).text(data.illnessId != 0 ? data.illnessName : "");
                $(`#row_${rowNo}_${type} td:eq(6)`).text(data.planId != 0 ? data.planName : "");
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
                $(`#row_${rowNo}_${type} td:eq(1)`).text(data.serviceId != 0 ? data.serviceName : "");
                $(`#row_${rowNo}_${type} td:eq(2)`).text(data.quantity);
                break;
            case 16:
                $(`#row_${rowNo}_${type} td:eq(1)`).text(data.comment);
                prescriptionTyp1 = 16;
                break;
        }

    }
    resetForm(type);
}

function resetForm(type) {
    $(`#box_${type} .select2`).val("").trigger("change");
    $(`#box_${type} .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#box_${type} input.form-control`).val("");

    if (type == 1)
        $("#isBr").prop("checked", true).trigger("change");

    typeSave = "INS";
    focusFirstBoxAfterAction(type);
}

function removeFromTemp(rowNumber, type) {

    let removeRowResult = removeRowFromArrayPrescription(arrayLines, "rowNumber", rowNumber, type);
    if (removeRowResult.statusMessage == "removed")
        $(`#temp_${type} tr#row_${rowNumber}_${type}`).remove();

    let thisTypeArray = arrayLines.filter(x => +x.serviceTypeId == +type);
    if (thisTypeArray.length == 0)
        $(`#temp_${type}`).html(fillEmptyRow($(`#list_${type} th`).length));
    else
        rebuildRow(type);

    resetForm(type);
}

function removeRowFromArrayPrescription(arr, param, value, type) {

    var statusMessage = "failed";

    if (arr.length === 0) return { value: arr, status: 100, statusMessage: statusMessage };

    var item = null;

    for (var i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        if (item[param] === value && item.serviceTypeId == type) {
            arr.splice(i, 1);
            statusMessage = "removed";
            break;
        }
    }

    return { value: arr, status: 100, statusMessage: statusMessage };
}

function rebuildRow(type) {

    let arrTemp = arrayLines;
    let tableId = `temp_${type}`, listId = `list_${type}`;
    let columnsLn = $(`#${listId} th`).length;
    let lastCol = columnsLn - 1;
    let currentRowRebuild = null;
    let thisTypeArray = arrayLines.filter(x => +x.serviceTypeId == +type);
    let thisLn = thisTypeArray.length;
    let indexRootArray = 0, rowNumber = 0;

    for (var i = 0; i < thisLn; i++) {
        indexRootArray = arrTemp.findIndex(x => x.indexRow == thisTypeArray[i].indexRow);
        currentRowRebuild = $(`#${tableId} tr`)[i];
        rowNumber = i + 1;

        arrTemp[indexRootArray].rowNumber = rowNumber;
        currentRowRebuild.setAttribute("id", `row_${rowNumber}_${type}`);
        currentRowRebuild.children[0].innerText = rowNumber;

        currentRowRebuild.children[lastCol].id = `operation_${rowNumber}_${type}`;
        currentRowRebuild.children[lastCol].innerHTML =
            `<button type="button" id="delete_${rowNumber}_${type}" onclick="removeFromTemp(${rowNumber},'${type}')" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                <i class="fa fa-trash"></i>
            </button>
            <button type="button" id="edit_${rowNumber}_${type}" onclick="editFromTemp(${rowNumber},'${type}')" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                <i class="fa fa-pen"></i>
            </button>`;
    }
    arrayLines = arrTemp;
}

function focusFirstBoxAfterAction(type) {
    let firstInput = $(`#box_${type}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {
        if ($(firstInput).hasClass("select2"))
            $(`#${firstInput.attr("id")}`).next().find('.select2-selection').focus();
        else
            firstInput.focus();
    }, 10);
};

function editFromTemp(rowNumber, type) {

    $(`#temp_${type} tr`).removeClass("highlight");
    $(`#row_${rowNumber}_${type}`).addClass("highlight");

    let tempOption = "";
    let currentLine = arrayLines.filter(line => line.rowNumber == rowNumber && line.serviceTypeId == type)[0];



    switch (+type) {
        case 1:
            $("#isBr").prop("checked", currentLine.isBr).trigger('change');
            $("#drugInstruction").val(currentLine.drugInstructionId).trigger('change');
            $("#drugAmount").val(currentLine.drugAmountId).trigger('change');
            $("#drugUsage").val(currentLine.drugUsageId).trigger('change');
            $("#repeat").val(currentLine.repeat);
            $("#doDatePersian").val(currentLine.doDatePersian);

            break;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 12:
        case 14:
        case 16:
        case 17:
            //$(`#isEn_${type}`).prop("checked", currentLine.isEn).trigger('change');
            break;

        case 13:
            $("#parentOrganId").val(currentLine.parentOrganId).trigger("change");
            $("#organId").val(currentLine.organId).trigger("change");
            $("#illness").val(currentLine.illnessId).trigger("change");
            $("#plan").val(currentLine.planId).trigger("change");
            break;

        default:
            break;
    }

    $(`#serviceId_${type}`).val(currentLine.serviceId);
    tempOption = new Option(currentLine.serviceName, currentLine.serviceId, true, true);
    $(`#serviceId_${type}`).append(tempOption).trigger('change');
    tempOption = "";


    $(`#quantity_${type}`).val(currentLine.quantity);
    typeSave = "UPD";
    currentRowLine = currentLine.rowNumber;
    focusFirstBoxAfterAction(type);
}

function resetFormPrescriptionTamin() {
    alertify.confirm('بازنشانی', "آیا اطمینان دارید؟", resetPrescriptionTamin, () => {
    })
        .set('labels', { ok: 'بله', cancel: 'خیر' });
}

function resetPrescriptionTamin() {
    admissionIdentity = 0

    $("#choiceOfAdmission").css("display", "inline")
    let form = $(`#peracraptionFilset`).parsley();
    form.reset();
    validateSelect2(form);
    admissionAttenderId = ""
    $(`.select2`).val("").trigger("change");
    $(`.funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`input.form-control`).val("");

    currentAdmission = {};
    arrayLines = [];
    typeSave = "INS";
    currentRowLine = 0;
    $("#expiryDatePersian").val(moment().add(15, 'days').format('jYYYY/jMM/jDD'));
    $("#repeatCount").val(1);
    $("#isBr").prop("checked", true).trigger("change");
    $("#prescriptionLink1").click();
    cerrentType = 0;
    identityForm = 0;
    $("#prescriptionTaminId").val(0);
    $("#temp_1").html(fillEmptyRow(8));
    $("#temp_2").html(fillEmptyRow(4));
    $("#temp_3").html(fillEmptyRow(4));
    $("#temp_4").html(fillEmptyRow(4));
    $("#temp_5").html(fillEmptyRow(4));
    $("#temp_6").html(fillEmptyRow(4));
    $("#temp_7").html(fillEmptyRow(4));
    $("#temp_13").html(fillEmptyRow(8));
    $("#temp_14").html(fillEmptyRow(4));
    $("#temp_17").html(fillEmptyRow(4));
    $("#admissionSelected").html("");
    $("#userFullName").val(``);
    $("#creatDateTime").val('');
    $("#prescriptionBox").addClass("displaynone");
    currentPrescriptionId = 0;
    currentRequestEPrescriptionId = 0;

    //$("#switchList").bootstrapToggle('on')

}

function savePrescriptionTaminForm() {

    var note1 = '';
    let form = $(`#headerForm`).parsley();
    if (prescriptionTyp1 != 16) {
        let validate = form.validate();
        validateSelect2(form);
        if (!validate) return;
    }

    let expiryDatePersian = $("#expiryDatePersian").val()
    if (!checkResponse(expiryDatePersian) || expiryDatePersian == "") {
        alertify.warning("تاریخ اعتبار نسخه نمی تواند خالی باشد").delay(alertify_delay);
        $("#expiryDatePersian").focus()
        return
    }

    if (typeof currentAdmission.admissionId == "undefined") {
        alertify.warning("پذیرش مورد نظر را انتخاب کنید").delay(alertify_delay);
        return;
    }
    if (arrayLines.length == 0 && currentAdmission.admissionTypeId != 3) {
        alertify.warning("هیچ سطری وارد نشده است.").delay(alertify_delay);
        return;
    }

    if (currentRequestEPrescriptionId != 0 && currentRequestEPrescriptionId != null && (cerrentType == 16 || cerrentType == 17)) {
        alertify.warning("پس از ارسال نسخه ، نسخه های ویزیت و خدمات قابل ویرایش نمی باشند").delay(alertify_delay);
        return;
    }

    if ($("#description").val() != '' && $("#description").val() != null) {
        note1 = $("#description").val();
    }
    else {
        note1 = $("#note").val();
    }

    if (note1 == "") {
        alertify.warning("توضیحات داکتر ثبت کنید").delay(alertify_delay);
        return;
    }

    if (currentAdmission.admissionTypeId != 3) {

        var model = {
            id: currentPrescriptionId,
            admissionServiceTaminId: currentAdmission.admissionId,
            attenderId: currentAdmission.attenderId,
            patientId: currentAdmission.patientId,
            comment: note1,
            expireDatePersian: $("#expiryDatePersian").val(),
            prescriptions: genratePrescriptions(arrayLines),
            workflowId: currentAdmission.admissionTaminWorkflowId,
            stageId: admissionStage.prescriptionTamin.id,
            admissionTaminWorkflowId: currentAdmission.admissionTaminWorkflowId,
            admissionTaminStageId: currentAdmission.admissionTaminStageId,
            oTPCode: $("#OptCode").val() == "" || $("#OptCode").val() == "0" ? null : $("#OptCode").val()
        }

        savePrescriptionAsync(model).then(async (data) => {

            let ln = data.length, flag = 0;
            for (var i = 0; i < ln; i++)
                if (data[i].successfull)
                    ++flag;
                else
                    alertify.error(generateErrorString(data.validationErrors)).delay(alertify_delay);

            if (flag == ln) {
                alertify.success(prMsg.insert_success).delay(prMsg.delay);
                setTimeout(() => navigation_item_click("/MC/PrescriptionTamin", "لیست نسخه نویسی"), 500);
            }


        }).then(async () => {
            await disableSaveButtonAsync(false);
        });



    }
    else {
        var model = {
            id: currentPrescriptionId,
            admissionServiceTaminId: currentAdmission.admissionId,
            attenderId: currentAdmission.attenderId,
            patientId: currentAdmission.patientId,
            comment: note1,
            expireDatePersian: $("#expiryDatePersian").val(),
            prescriptions: genratePrescriptions(arrayLines),
            workflowId: currentAdmission.admissionTaminWorkflowId,
            stageId: admissionStage.prescriptionTamin.id,
            admissionTaminWorkflowId: currentAdmission.admissionTaminWorkflowId,
            admissionTaminStageId: currentAdmission.admissionTaminStageId,
            oTPCode: $("#OptCode").val() == "" || $("#OptCode").val() == "0" ? null : $("#OptCode").val()
        }



        savePrescriptionAsync(model).then(async (data) => {

            let ln = data.length, flag = 0;
            for (var i = 0; i < ln; i++)
                if (data[i].successfull)
                    ++flag;
                else
                    alertify.error(generateErrorString(data.validationErrors)).delay(alertify_delay);

            if (flag == ln) {


                alertify.success(prMsg.insert_success).delay(prMsg.delay);
                setTimeout(() => navigation_item_click("/MC/PrescriptionTamin", "لیست نسخه نویسی"), 500);




            }

        }).then(async () => {
            await disableSaveButtonAsync(false);

        });

    }


}

function genratePrescriptions(arrayLines) {

    let prescriptions = [], tempPrescriptionsLine = {};
    let prescriptionsLines = _.groupBy(arrayLines, 'serviceTypeId'),
        tempServiceLine = [];

    Object.keys(prescriptionsLines).map(index => {
        tempServiceLine = prescriptionsLines[index];

        tempPrescriptionsLine = {
            id: cerrentType == index ? +$("#prescriptionTaminId").val() : 0,
            taminPrescriptionCategoryId: index,
            requestEPrescriptionId: currentRequestEPrescriptionId,
            lines: tempServiceLine
        };



        prescriptions.push(tempPrescriptionsLine);
    });
    return prescriptions;
}

async function savePrescriptionAsync(prescription) {


    let result = await $.ajax({
        url: viewData_save_PrescriptionTamin,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(prescription),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_PrescriptionTamin);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

async function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}

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

function displayAdmission(id) {

    let admissionType = 3

    getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionType, id);
}

function setAdmissionInfo_otherConfig(data) {

    admissionIdentity = +data.admissionId;
    admissionAttenderId = data.attenderId
    currentAdmission = data;
    currentAdmission.admissionId = data.admissionId;
    currentAdmission.admissionTaminWorkflowId = data.workflowId;
    currentAdmission.admissionTaminStageId = data.stageId;
    $("#admissionSelected tr td:eq(7)").addClass("d-none")
    $("#admissionSelected tr td:eq(8)").addClass("d-none")
}

function saveAndSendPrescriptionTaminForm() {


    var note1 = '';
    let form = $(`#headerForm`).parsley();
    if (prescriptionTyp1 != 16) {
        let validate = form.validate();
        validateSelect2(form);
        if (!validate) return;
    }

    let expiryDatePersian = $("#expiryDatePersian").val()
    if (!checkResponse(expiryDatePersian) || expiryDatePersian == "") {
        alertify.warning("تاریخ اعتبار نسخه نمی تواند خالی باشد").delay(alertify_delay);
        $("#expiryDatePersian").focus()
        return
    }

    if (typeof currentAdmission.admissionId == "undefined") {
        alertify.warning("پذیرش مورد نظر را انتخاب کنید").delay(alertify_delay);
        return;
    }
    if (arrayLines.length == 0 && currentAdmission.admissionTypeId != 3) {
        alertify.warning("هیچ سطری وارد نشده است.").delay(alertify_delay);
        return;
    }

    if (currentRequestEPrescriptionId != 0 && currentRequestEPrescriptionId != null && (cerrentType == 16 || cerrentType == 17)) {
        alertify.warning("پس از ارسال نسخه ، نسخه های ویزیت و خدمات قابل ویرایش نمی باشند").delay(alertify_delay);
        return;
    }

    if ($("#description").val() != '' && $("#description").val() != null) {
        note1 = $("#description").val();
    }
    else {
        note1 = $("#note").val();
    }

    if (note1 == "") {
        alertify.warning("توضیحات داکتر ثبت کنید").delay(alertify_delay);
        return;
    }


    loadingAsync(true, "saveAndSendToWebService", "btn btn-success waves-effect");

    //$("#saveForm").prop('disabled', true);

    if (currentAdmission.admissionTypeId != 3) {

        var model = {
            id: currentPrescriptionId,
            admissionServiceTaminId: currentAdmission.admissionId,
            attenderId: currentAdmission.attenderId,
            patientId: currentAdmission.patientId,
            comment: note1,
            expireDatePersian: $("#expiryDatePersian").val(),
            prescriptions: genratePrescriptions(arrayLines),
            workflowId: currentAdmission.admissionTaminWorkflowId,
            stageId: admissionStage.prescriptionTamin.id,
            admissionTaminWorkflowId: currentAdmission.admissionTaminWorkflowId,
            admissionTaminStageId: currentAdmission.admissionTaminStageId,
            oTPCode: $("#OptCode").val() == "" || $("#OptCode").val() == "0" ? null : $("#OptCode").val()
        }

        savePrescriptionAsync(model).then(async (data) => {


            let ln = data.length, flag = 0;
            var prescriptionTaminArray = [];

            for (var i = 0; i < ln; i++) {

                prescriptionTaminArray.push(data[i].id);

                if (data[i].successfull)
                    ++flag;

                else
                    alertify.error(generateErrorString(data.validationErrors)).delay(alertify_delay);
            }


            if (flag == ln) {

                alertify.success(prMsg.insert_success).delay(prMsg.delay);

                if (data.length == 1)
                    sendEPrescriptionTamin(prescriptionTaminArray[0]);
                else
                    showEPrescriptionTamin(data);
            }



        }).then(async () => {
            await disableSaveButtonAsync(false);
        });



    }
    else {
        var model = {
            id: currentPrescriptionId,
            admissionServiceTaminId: currentAdmission.admissionId,
            attenderId: currentAdmission.attenderId,
            patientId: currentAdmission.patientId,
            comment: note1,
            expireDatePersian: $("#expiryDatePersian").val(),
            prescriptions: genratePrescriptions(arrayLines),
            workflowId: currentAdmission.admissionTaminWorkflowId,
            stageId: admissionStage.prescriptionTamin.id,
            admissionTaminWorkflowId: currentAdmission.admissionTaminWorkflowId,
            admissionTaminStageId: currentAdmission.admissionTaminStageId,
            oTPCode: $("#OptCode").val() == "" || $("#OptCode").val() == "0" ? null : $("#OptCode").val()
        }



        savePrescriptionAsync(model).then(async (data) => {

            let ln = data.length, flag = 0;
            var prescriptionTaminArray = [];

            for (var i = 0; i < ln; i++) {
                prescriptionTaminArray.push(data[i].id);
                if (data[i].successfull)
                    ++flag;
                else
                    alertify.error(generateErrorString(data.validationErrors)).delay(alertify_delay);
            }


            if (flag == ln) {

                alertify.success(prMsg.insert_success).delay(prMsg.delay);

                if (data.length == 1)
                    sendEPrescriptionTamin(prescriptionTaminArray[0]);
                else
                    showEPrescriptionTamin(data.id);
            }



        }).then(async () => {
            await disableSaveButtonAsync(false);

        });

    }


}

async function getResultPrescriptionTamin(id) {

    let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/sendrequestprescription`;
    let response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }


    });

    return response;
}

function sendEPrescriptionTamin(data) {

    getResultPrescriptionTamin(data).then(result => {

        if (result.successfull) {
            setTimeout(() => navigation_item_click("/MC/PrescriptionTamin", "لیست نسخه نویسی"), 500);

        }
        else if (checkResponse(result.data) && result.data.length > 0) {

            $("#result_prescription_tamin_row").html("");
            let str = "";

            for (var ix = 0; ix < result.data.length; ix++) {
                let dataRes = result.data[ix].item2;
                let id = result.data[ix].item1;

                dataRes.problems = dataRes.validationErrors == null ? [] : dataRes.validationErrors;

                if (typeof dataRes.validationErrors !== "undefined" && dataRes.validationErrors.length == 0)
                    str += `<tr><td>${id}</td><td>${result.data[ix].item2.status}</td></tr>`
                else
                    str += `<tr><td>${result.data[ix].item1}</td><td>${result.data[ix].item2.status} | ${result.data[ix].item2.validationErrors}</td></tr>`;
            }



            $("#result_prescription_tamin_row").append(str);

            modal_show("wcf_prescription_tamin_error_result");

        }
        else if (!result.successfull && result.status === 401) {
            var msgItem = alertify.warning(result.statusMessage);
            msgItem.delay(alertify_delay);
        }

    });
}


function wcfPrescriptionTaminResultModalClose() {
    modal_close("wcf_prescription_tamin_error_result");

}

function wcfPrescriptionTamintModalClose() {

    $(`#ePrescriptionTamin_Modal`).modal({ backdrop: "static", show: true });
    modal_close("ePrescriptionTamin_Modal");

    setTimeout(() => {
        navigation_item_click('/MC/PrescriptionTamin', 'نسخه نویسی');
    }, 500);


}



function showEPrescriptionTamin(data) {

    let output = "";
    $("#resultEPrescriptionTamin").html("");
    for (var i = 0; i < data.length; i++) {



        let prescriptionServiceTypeId = +data[i].prescriptionServiceTypeId;
        let prescriptionServiceTypeName = "";
        let requestEPrescriptionId = "", action = "", createDateTimePersian = "";
        switch (prescriptionServiceTypeId) {
            case 1:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.drug.name;
                break;
            case 2:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.lab.name;
                break;
            case 3:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.radio.name;
                break;
            case 4:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.sono.name;
                break;
            case 5:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.ctScan.name;
                break;
            case 6:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.mRI.name;
                break;
            case 7:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.nuclear.name;
                break;
            case 13:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.physiotherapy.name;
                break;
            case 14:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.densitometry.name;
                break;
            case 17:
                prescriptionServiceTypeName = prescriptionServiceTypeId + " - " + taminPrescriptionTypes.sideways.name;
                break;
        }

        output += `<tr highlight = ${i + 1} id="row_${i + 1}" onclick = "tr_onclickEPrescriptionTamin(${i + 1})"   onkeydown = "tr_onkeydownEPrescriptionTamin(${i + 1},this,event)"  tabindex = "-1" >
                     <td style="width:5%;"><input id="chk_${i + 1}"  type="checkbox" onchange="arrayEPrescriptionTaminServiceChecked(this)" /></td>
                     <td style="width:10px;" id="serviceId_${i + 1}">${data[i].id}</td>
                     <td style="width:30px;">${currentAdmission.patientFullName}</td>
                     <td style="width:15px;">${prescriptionServiceTypeName}</td>
                     <td style="width:15px;" id="requestEPrescriptionId_${data[i].id}">${requestEPrescriptionId}</td>
                     <td style="width:15px;" id="action_${data[i].id}">${action}</td>
                     <td style="width:10px;" id="createDateTime_${data[i].id}">${createDateTimePersian}</td>
                    
                </tr>`;

    }


    $("#resultEPrescriptionTamin").append(output);
    modal_show("ePrescriptionTamin_Modal");

}

function arrayEPrescriptionTaminServiceChecked(item) {

    let idChcke = item.id.split('_')[1];

    let serviceId = +$(`#resultEPrescriptionTamin > tr#row_${idChcke} > td#serviceId_${idChcke}`).text();

    var currencyIndex = serviceIds.findIndex(x => x.id === serviceId);

    if ($(item).prop("checked")) {
        if (currencyIndex === -1) {
            serviceIds.push({ rowId: idChcke, id: serviceId });
        }
    }
    else {
        if (currencyIndex !== -1) {
            serviceIds.splice(currencyIndex, 1);
        }
    }

    var countSelected = +$(`#resultEPrescriptionTamin > tr input[type=checkbox]:checked`).length;

    if (countSelected == +$(`#resultEPrescriptionTamin > tr `).length)
        $("#chkAll").prop("checked", true);
    else
        $("#chkAll").prop("checked", false);
}

function tr_onclickEPrescriptionTamin(rowNo) {
    let pageName = "#resultEPrescriptionTamin";
    $(`${pageName} > tr`).removeClass("highlight");
    $(`${pageName} > tr#row_${rowNo}`).addClass("highlight");
}

function tr_onkeydownEPrescriptionTamin(rowNo, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#resultEPrescriptionTamin > tr#row_${rowNo - 1}`).length > 0) {
            $(`#resultEPrescriptionTamin > tr.highlight`).removeClass("highlight");
            $(`#resultEPrescriptionTamin > tr#row_${rowNo - 1}`).addClass("highlight");
            $(`#resultEPrescriptionTamin > tr#row_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#resultEPrescriptionTamin > tr#row_${rowNo + 1}`).length > 0) {
            $(`#resultEPrescriptionTamin > tr.highlight`).removeClass("highlight");
            $(`#resultEPrescriptionTamin > tr#row_${rowNo + 1}`).addClass("highlight");
            $(`#resultEPrescriptionTamin > tr#row_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();
        $(`#resultEPrescriptionTamin > tr#row_${rowNo} input`).click();
    }
}

async function getResultRequestPrescriptionTamin(id, rowId) {

    let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/sendrequestprescription`;

    let response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {

            showResultRequestPrescriptionTamin(result, id, rowId);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }

    });

    return response;
}

function showResultRequestPrescriptionTamin(result, id, rowId) {

    if (result.successfull) {
        $(`#resultEPrescriptionTamin > tr#row_${rowId}> td#requestEPrescriptionId_${id}`).text(result.data[0].item2.requestEPrescriptionId);
        $(`#resultEPrescriptionTamin > tr#row_${rowId}> td#action_${id}`).text(result.data[0].item2.action);
        $(`#resultEPrescriptionTamin > tr#row_${rowId}> td#createDateTime_${id}`).text(result.data[0].item2.createDateTimePersian);
        $(`#resultEPrescriptionTamin > tr#row_${rowId} input`).prop("disabled", true);
    }

    else if (checkResponse(result.data) && result.data.length > 0) {


        strResultPrescriptionTamin = "";

        for (var ix = 0; ix < result.data.length; ix++) {
            let dataRes = result.data[ix].item2;
            let id = result.data[ix].item1;

            dataRes.problems = dataRes.validationErrors == null ? [] : dataRes.validationErrors;

            if (typeof dataRes.validationErrors !== "undefined" && dataRes.validationErrors.length == 0)
                strResultPrescriptionTamin += `<tr><td>${id}</td><td>${result.data[ix].item2.status}</td></tr>`
            else
                strResultPrescriptionTamin += `<tr><td>${result.data[ix].item1}</td><td>${result.data[ix].item2.status} | ${result.data[ix].item2.validationErrors}</td></tr>`;
        }


        $("#result_prescription_tamin_row").append(strResultPrescriptionTamin);


    }

    else if (!result.successfull && result.status === 401) {
        var msgItem = alertify.warning(result.statusMessage);
        msgItem.delay(alertify_delay);
    }


}

async function sendToWebService() {


    loadingAsync(true, "sendToWebService", "fa fa-paper-plane color-blue");

    $("#result_prescription_tamin_row").html("");

    if (serviceIds.length > 0) {

        for (var i = 0; i < serviceIds.length; i++) {

            let id = +serviceIds[i].id;
            let rowId = +serviceIds[i].rowId;

            await getResultRequestPrescriptionTamin(id, rowId);
        }


        if (strResultPrescriptionTamin != "") {

            modal_show("wcf_prescription_tamin_error_result");

            loadingAsync(false, "sendToWebService", "fa fa-paper-plane color-blue");

            loadingAsync(false, "saveAndSendToWebService", "fa fa-save");

            $(`#sendToWebService`).prop("disabled", false);
        }

        else {

            $(`#ePrescriptionTamin_Modal`).modal({ backdrop: "static", show: true });
            modal_close("ePrescriptionTamin_Modal");

            setTimeout(() => {
                navigation_item_click('/MC/PrescriptionTamin', 'نسخه نویسی');
            }, 500);

        }

    }

    else {
        alertify.warning("خدمتی برای ارسال انتخاب نشده است");
        loadingAsync(false, "sendToWebService", "fa fa-paper-plane color-blue");
        $(`#sendToWebService`).prop("disabled", false);
    }



}

function ePrescriptionTaminSelectAll() {

    serviceIds = [];

    var checkAll = $("#chkAll").prop("checked");

    let tblLength = $(`#resultEPrescriptionTamin > tr `).length;
    for (var i = 0; i <= tblLength; i++) {

        isclick = $(`#resultEPrescriptionTamin > tr#row_${i + 1} input`).prop("checked");
        isdisabled = $(`#resultEPrescriptionTamin > tr#row_${i + 1} input`).prop("disabled");

        if (!isdisabled)
            $(`#resultEPrescriptionTamin > tr#row_${i + 1} input`).prop("checked", checkAll).trigger("change")
    }

}


async function loadingAsync(loading, elementId, iconClass) {

    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)

    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(iconClass);
        $(`#${elementId}`).prop("disabled", true)

    }
}

initPrescriptionForm();

window.Parsley._validatorRegistry.validators.validdate = undefined;
window.Parsley.addValidator("validdate", {
    validateString: function (value) {
        let dateValue = moment.from(value, 'fa', 'YYYY/MM/DD');
        let toDate = moment().format('YYYY/MM/DD');
        if (dateValue.isValid()) {
            dateValue = dateValue.format('YYYY/MM/DD');
            return moment(dateValue).isSameOrAfter(toDate, 'day');
        }
        return true;
    },
    messages: {
        en: 'تاریخ اعتبار نسخه باید بزرگتر، مساوی تاریخ روز جاری باشد'
    }
});


document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        savePrescriptionTaminForm()
    }

    if (e.ctrlKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        modal_show('searchAdmissionModal')
    }
}


