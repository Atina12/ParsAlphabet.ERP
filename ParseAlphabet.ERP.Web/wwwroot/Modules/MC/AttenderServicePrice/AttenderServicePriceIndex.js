var viewData_form_title = "کمیسون داکتران",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/AttenderApi/getpageattendercommission`,
    viewData_filter_url = `${viewData_baseUrl_MC}/AttenderApi/getfilteritems`,
    viewData_getrecord_url_item = `${viewData_baseUrl_MC}/AttenderApi/getrecordbyid`,
    viewData_sendcentral_url = `${viewData_baseUrl_MC}/AttenderServicePriceLineApi/sendcentralattenderservice`,
    item_id = 0,selectedId=0,
    viewData_controllername = "AttenderServicePriceApi",
    serviceIds = [],
    tblLength = 0,
    printInfo = {};

function initAttenderServicePrice() {
    $('#exportCSV').hide();
    $('#stimul_preview').hide();
    $('#readyforadd').hide();

    loadDropDown()

    addPriceOperation();

    get_NewPageTableV1();
}

function run_button_sendToCentral(id, rowNo) {
    
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");
    pagetable_formkeyvalue = [0];

    if (index == -1) {
        var pgt = {
            pagetable_id: "sendtoCentral_pagetable",
            editable: true,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            getpagetable_url: `${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getpageattendersendhistorygetpage`,
            lastPageloaded: 0,
        }

        arr_pagetables.push(pgt);
    }
    else {
        arr_pagetables[index].filteritem = "";
        arr_pagetables[index].filtervalue = "";
        arr_pagetables[index].editable = true;
        arr_pagetables[index].pagerowscount = 15;
        arr_pagetables[index].endData = false;
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].currentcol = 0;
        arr_pagetables[index].highlightrowid = 0;
        arr_pagetables[index].trediting = false;
        arr_pagetables[index].pagetablefilter = false;
        arr_pagetables[index].lastPageloaded = 0;
    }

    
    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "sendtoCentral_pagetable");
        
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []

    }

    pagetable_formkeyvalue[1] = id;
    pagetable_formkeyvalue[2] = 0;

    get_NewPageTableV1("sendtoCentral_pagetable", false, () => {
        modal_show("sendModal")
        setTimeout(() => {
            $(".attenderInfoModal").text($(`#sendtoCentral_pagetable .pagetablebody tbody #row1`).data("attender"))

            $("#sendtoCentral_pagetable  .pagetablebody tbody  #row1").focus()
            var i = 1;
            //$('#sendtoCentral_pagetable  .pagetablebody tbody tr').each(function () {
            //     chk = '<input  id="chk_' + $(`#sendtoCentral_pagetable .pagetablebody #row${i}`).data("id") + '" type="checkbox" onchange="getVal(this)" >';
            //    $(this).children('td:first').append(chk)
            //    i = i + 1;
            //});

            $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
                $(this).prop('checked', false);
                $(this).attr("id", "chk_" + $(`#sendtoCentral_pagetable .pagetablebody #row${i}`).data('id'));
                i = i + 1;
            })

        }, 400)

    })
    
   
}
function itemChange(elem) {
    
    if(elem.id != undefined)
        selectedId = elem.id.split("chk_")[1];
    else
        selectedId = elem[0].id.split("chk_")[1];
    $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
        if ($(this).attr("id") != "chk_" + selectedId)
            $(this).prop('checked', false);
    })
}
function changeAll(elem) {
    
    $(`#sendtoCentral_pagetable  .pagetablebody tbody tr`).find("input", "checkbox").each(function () {
            $(this).prop('checked', false);
    })
    $(`#sendtoCentral_pagetable  .pagetablebody #row1`).find("input", "checkbox").each(function () {
        $(this).prop('checked', true);
        selectedId = $(this)[0].id.split("chk_")[1];

    })
}
$("#sendModal").on("hidden.bs.modal", function () {
    pagetable_formkeyvalue = [];
});


function sendAttenderService() {
        
    if (selectedId == 0 || selectedId =='' ) {
        alertify.warning("موردی انتخاب نشده است").delay(admission.delay);
        return
    }
  
    $.ajax({
        url: viewData_sendcentral_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(selectedId),
        success: function (result) {

            if (result.successfull == true) {
                alertify.success(result.statusMessage);
                modal_close("sendModal");
                get_NewPageTableV1();
            }
            else {
                if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendcentral_url);
        }
    });

}

function loadDropDown() {
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "fromAttender", true, "1", true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "toAttender", true, "1", true);


}

function addPriceOperation() {
    $(".button-items").prepend(`<button type="button" onclick="servicsTransform()" class="btn blue_1 waves-effect"><i class="fa fa-file-import"></i>انتقال خدمات داکتران</button>`)
}

function run_button_commissionservice(attenderId, row, elm, event) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    let departmentId = $(`#row${row}`).data("departmentid");
    let attenderFullName = $(`#row${row}`).data("fullname");
    navigation_item_click(`/MC/AttenderServicePriceLine/${attenderId}/${attenderFullName}/${departmentId}`, "تخصیص حق  حق الزحمه طبابین");

}

function run_button_attenderServiceList(attenderId, row, elm, event) {

    modal_attender_info("attenderServiceListModal", attenderId)
    attenderServiceList_init(attenderId);

    let rowElm = $(`#pagetable tr#row${row}`)
    let attenderNationalCode = rowElm.data("nationalcode")
    let attenderFullName = rowElm.data("fullname")

    printInfo = { attenderId, attenderFullName, attenderNationalCode }

    modal_show("attenderServiceListModal");
}

function servicsTransform() {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    resetFormServicsTransform();

    modal_show(`attenterTransformServiceModal`);
}

function resetFormServicsTransform() {

    $(`#saveTransformServiceCounter`).text(0);
    $("#fromAttender").val("").trigger("change");
    $("#toAttender").val("").trigger("change");
}

function insurerPriceTempSave(isPreview) {

    var resultSave = 0;
    $("#saveTransformServiceCounter").text("0");

    var serviceListIds = [];
    let fromMedicalSubjectId = null;

    if (serviceIds.length > 0) {
        for (var i = 0; i < serviceIds.length; i++) {
            serviceListIds.push(serviceIds[i].id);
        }

        fromMedicalSubjectId = serviceListIds.join(",");
    }

    var model = {
        fromAttenderId: +$("#fromAttender").val(),
        toAttenderId: +$("#toAttender").val(),
        fromServiceIds: fromMedicalSubjectId,
        fromMedicalSubjectId: +$("#medicalSubjectId").val() > 0 ? +$("#medicalSubjectId").val() : null,
        fromAttenderMarginBracketId: +$("#attenderMarginBracketId").val() > 0 ? +$("#attenderMarginBracketId").val() : null,
        isPreview: isPreview
    }

    var url = `${viewData_baseUrl_MC}/AttenderServicePriceLineApi/attenderduplicate`;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            resultSave = result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
    return resultSave;
}

function getAttenterTransformServiceList(fromAttender, medicalSubjectId, attenderMarginBracketId, type) {

    let url = `${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getpropertiesdropdown/${fromAttender}/${medicalSubjectId}/${attenderMarginBracketId}/${type}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            fillAttenterTransformServiceList(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
}

function fillAttenterTransformServiceList(data) {

    let output = "";

    if (data.length > 0) {

        for (var i = 0; i < data.length; i++) {
            output += `<tr highlight=${i + 1} id=row_${i + 1}  onclick="tr_onclickAttenderServiceDuplicate(${i + 1})"   onkeydown="tr_onkeydownAttenderServiceDuplicate(${i + 1},this,event)"  tabindex="-1">
                         <td  style="width:5%;"><input id="chk_${i + 1}"  type="checkbox" onchange="arrayAttenterTransformServiceChecked(this)" /></td>
                         <td id="serviceId_${i + 1}" style="width:15%;">${data[i].id} </td>
                         <td style="width:80%;">${data[i].name}</td>
                       </tr>`;
        }
    }
    else {
        output = `<tr>
                       <td colspan="3" style="text-align:center">سطری وجود ندارد</td>
                   </tr>
                  `}
    $(`#tempattenterTransformService`).html(output);

    $(`#tempattenterTransformService > tr#row_1`).addClass("highlight");
    $(`#tempattenterTransformService > tr#row_1`).focus();
}

function tr_onclickAttenderServiceDuplicate(rowNo) {
    let pageName = "#tempattenterTransformService";
    $(`${pageName} > tr`).removeClass("highlight");
    $(`${pageName} > tr#row_${rowNo}`).addClass("highlight");
}

function arrayAttenterTransformServiceChecked(item) {

    let idChcke = item.id.split('_')[1];

    let serviceId = +$(`#tempattenterTransformService > tr#row_${idChcke} > td#serviceId_${idChcke}`).text();

    var currencyIndex = serviceIds.findIndex(x => x.id === serviceId);

    if ($(item).prop("checked")) {
        if (currencyIndex === -1) {
            serviceIds.push({ id: serviceId });
        }
    }
    else {
        if (currencyIndex !== -1) {
            serviceIds.splice(currencyIndex, 1);
        }
    }

    var countSelected = +$(`#tempattenterTransformService > tr input[type=checkbox]:checked`).length;

    if (countSelected == +$(`#tempattenterTransformService > tr `).length)
        $("#chkAll").prop("checked", true);
    else
        $("#chkAll").prop("checked", false);
}

function tr_onkeydownAttenderServiceDuplicate(rowNo, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#tempattenterTransformService > tr#row_${rowNo - 1}`).length > 0) {
            $(`#tempattenterTransformService > tr.highlight`).removeClass("highlight");
            $(`#tempattenterTransformService > tr#row_${rowNo - 1}`).addClass("highlight");
            $(`#tempattenterTransformService > tr#row_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#tempattenterTransformService > tr#row_${rowNo + 1}`).length > 0) {
            $(`#tempattenterTransformService > tr.highlight`).removeClass("highlight");
            $(`#tempattenterTransformService > tr#row_${rowNo + 1}`).addClass("highlight");
            $(`#tempattenterTransformService > tr#row_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();
        $(`#tempattenterTransformService > tr#row_${rowNo} input`).click();
    }
}

function resetTransformService() {

    $("#fromAttender").prop("disabled", false);
    $("#toAttender").prop("disabled", false);
    $("#medicalSubjectId").prop("disabled", false);
    $("#attenderMarginBracketId").prop("disabled", false);

    $("#fromAttender").empty().trigger("change");
    $("#toAttender").empty().trigger("change");
    $("#medicalSubjectId").empty().trigger("change");
    $("#attenderMarginBracketId").empty().trigger("change");

    fillAttenterTransformServiceList([]);
    $("#saveTransformService").prop("disabled", true);
    $("#perviewTransformService").prop("disabled", false);
    $("#enableForm").prop("disabled", true);

    serviceIds = [];
    $("#perviewTransformService").prop("disabled", false);
    $("#chkAll").prop("checked", false);
    $("#chkAll").prop("disabled", false);
}

function attenterTransformServiceSelectAll() {

    serviceIds = [];

    var checkAll = $("#chkAll").prop("checked");

    let tblLength = $(`#tempattenterTransformService > tr `).length;
    for (var i = 0; i <= tblLength; i++) {
        $(`#tempattenterTransformService > tr#row_${i} input`).prop("checked", checkAll).trigger("change")
    }
  
}

function disabledForm() {

    $("#perviewTransformService").prop("disabled", false);
    $("#saveTransformService").prop("disabled", true);
    $("#enableForm").prop("disabled", true);
    $("#fromAttender").prop("disabled", false);
    $("#toAttender").prop("disabled", false);
    $("#medicalSubjectId").prop("disabled", false);
    $("#attenderMarginBracketId").prop("disabled", false);
    $(`#tempattenterTransformService > tr> td>input`).prop("disabled", false);
    $("#chkAll").prop("disabled", false);
}

function enabledForm() {

    $("#perviewTransformService").prop("disabled", true);
    $("#saveTransformService").prop("disabled", false);
    $("#enableForm").prop("disabled", false);
    $("#fromAttender").prop("disabled", true);
    $("#toAttender").prop("disabled", true);
    $("#medicalSubjectId").prop("disabled", true);
    $("#attenderMarginBracketId").prop("disabled", true);
    $(`#tempattenterTransformService > tr> td>input`).prop("disabled", true);
    $("#chkAll").prop("disabled", true);
}

$("#perviewTransformService").on("click", function () {

    var form = $('#attenterTransformServiceForm').parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;
    if (serviceIds.length > 0)

        var resultSave = insurerPriceTempSave(true);
    else {
        var msgResult = alertify.warning("از لیست ،خدمت را انتخاب نمایید");
        msgResult.delay(alertify_delay);
        $(`#tempattenterTransformService > tr#row_1`).focus();
        return
    }

    if (resultSave == 0) {
        var msgResult = alertify.warning("موردی برای به روزرسانی وجود ندارد");
        msgResult.delay(alertify_delay);
        return
    }

    enabledForm();
    $("#perviewTransformServiceCounter").text(resultSave);
    $(".preview-box-btn-lable").blur();
    $("[tabindex='100003']").focus();
});

$("#saveTransformService").on("click", function () {

    var form = $('#attenterTransformServiceForm').parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    if (serviceIds.length > 0)
        var resultSave = insurerPriceTempSave(false);
    else {
        var msgResult = alertify.warning("از لیست ،خدمت را انتخاب نمایید");
        msgResult.delay(alertify_delay);
        $(`#tempattenterTransformService > tr#row_1`).focus();
        return
    }
   

    $("#saveTransformServiceCounter").text(resultSave);
    $("#perviewTransformServiceCounter").text(0);

    setTimeout(() => { $("#attenterTransformServiceModal select#fromAttender").select2("focus"); }, 200);

    resetTransformService();

    var msgResult = alertify.success("عملیات با موفقیت انجام شد");
    msgResult.delay(alertify_delay);

});

$("#enableForm").on("click", function () {

    $("#perviewTransformServiceCounter").text(0);

    disabledForm();

})

$("#attenterTransformServiceModal").on("hidden.bs.modal", function () {

    $("#saveTransformServiceCounter").text("0");
    $("#perviewTransformServiceCounter").text("0");
    disabledForm();
    fillAttenterTransformServiceList([]);
    serviceIds = [];
})

$("#attenderServiceListModal").on("hidden.bs.modal", function () {
    printInfo = {}
})

$("#fromAttender").on("change", function () {

    let fromAttender = +$(this).val();
    $("#medicalSubjectId").empty();
    $("#attenderMarginBracketId").empty();
    fillAttenterTransformServiceList([]);
    $("#chkAll").prop("checked", false);
    serviceIds = [];
    if (fromAttender > 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getpropertiesdropdown`, "medicalSubjectId", true, `${fromAttender}/null/null/1`);

});

$("#medicalSubjectId").on("change", function () {

    let medicalSubjectId = +$(this).val();
    let fromAttender = +$("#fromAttender").val();
    $("#attenderMarginBracketId").empty();
    fillAttenterTransformServiceList([]);
    $("#chkAll").prop("checked", false);
    serviceIds = [];
    if (medicalSubjectId > 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderServicePriceLineApi/getpropertiesdropdown`, "attenderMarginBracketId", true, `${fromAttender}/${medicalSubjectId}/null/2`);

});

$("#attenderMarginBracketId").on("change", function () {

    let attenderMarginBracketId = +$(this).val();
    let medicalSubjectId = +$("#medicalSubjectId").val();
    let fromAttender = +$("#fromAttender").val();
    fillAttenterTransformServiceList([]);
    $("#chkAll").prop("checked", false);
    serviceIds = [];
    if (attenderMarginBracketId > 0)
        getAttenterTransformServiceList(fromAttender, medicalSubjectId, attenderMarginBracketId, 3);

});

window.Parsley._validatorRegistry.validators.attenderchnage = undefined
window.Parsley.addValidator("attenderchnage", {
    validateString: function (value) {
        var to = $("#toAttender").val(), from = $("#fromAttender").val();
        if (to == from)
            return false;

        return true;
    },
    messages: {
        en: 'داکتر مبدا و مقصد نمیتواند یک شخص باشد'
    }
});

initAttenderServicePrice()

