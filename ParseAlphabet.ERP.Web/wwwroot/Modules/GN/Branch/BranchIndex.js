var viewData_form_title = "شعبه";
var viewData_controllername = "BranchApi";
var viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`;
//var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`;
var viewData_sendcentral_url = `${viewData_baseUrl_GN}/${viewData_controllername}/sendcentralbranch`;
var branchLineList = [], centralId=0, form = $('#AddEditModal .mainBody').parsley();

function stimul_previewNew() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportUrl = `${stimulsBaseUrl.GN.Prn}Branch.mrt`;

    var repParameters = []

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function initForm() {
    $(".select2").select2();
    fill_select2(`${viewData_baseUrl_GN}/LocStateApi/getdropdown`, "stateId", true, 0);

    get_NewPageTableV1()
}

function run_button_accountDetail(id, rowNo, elm) {
    addAccountDetail(id, "gn.Branch", viewData_getrecord_url, "id", "name", "isActive", "", get_NewPageTableV1);
}


function modal_save(modal_name = null, pageVersion = "pagetable") {

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);

}

function parameter() {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [0],
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }

    return parameters;
}

function export_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let csvModel = parameter();
    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    var urlCSV = "";
    let title = "شعب"
    urlCSV = viewData_csv_url

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {
                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

$("#stateId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#cityId").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "cityId", true, +$(this).val());
    }

    if (($('#stateId :selected').length == 0) || ($('#stateId :selected').val() == 0)) {
        $('#cityId').attr('disabled', 'disabled');
        $("#cityId").val('0').trigger('change');
    }
    else {
        $('#cityId').removeAttr('disabled');
    }
});


async function saveBranch(type) {
    var url = "";

    if (modal_open_state == "Add")
        url = viewData_insrecord_url;
    else
        if (modal_open_state == "Edit")
            url = viewData_updrecord_url;

    if ($("#name").val() == "") {
        var msgError = alertify.warning("نام شعبه را وارد نمایید");
        msgError.delay(alertify_delay);
        return
    }

    if ($("#stateId").val() == 0 || $("#stateId").val() == null) {
        var msgError = alertify.warning(" ولایت را انتخاب نمایید");
        msgError.delay(alertify_delay);
        return
    }

    if ($("#cityId").val() == 0 || $("#cityId").val() == null) {
        var msgError = alertify.warning(" شهر را انتخاب نمایید");
        msgError.delay(alertify_delay);
        return
    }

    if ($("#address").val() == "" || $("#address").val() == null) {
        var msgError = alertify.warning(" آدرس را وارد نمایید");
        msgError.delay(alertify_delay);
        return
    }

    if (branchLineList.length == 0) {
        var msgError = alertify.warning("حداقل یک شماره تماس را وارد نمایید");
        msgError.delay(alertify_delay);
        return
    }


    let newBranchLineList = []

    for (let i = 0; i < branchLineList.length; i++) {

        let model = {
            branchLineTypeId: branchLineList[i].branchLineTypeId,
            value: branchLineList[i].value
        }

        newBranchLineList.push(model)
    }
    var model = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        stateId: $("#stateId").val(),
        cityId: $("#cityId").val(),
        address: $("#address").val(),
        isActive: $("#isActive").prop("checked"),
        saveAndSend: type,
        branchLineJsonList: newBranchLineList,
        centralId: centralId,
        latitude: $("#latitude").val(),
        longitude: $("#longitude").val()
    };

    saveBranchAsync(model,url)
        .then(async (data) => {
         //   saveBranchResult(data);
            if (data.successfull) {
                centralId = 0;

                var msgError = alertify.success(data.statusMessage);
                msgError.delay(alertify_delay);
                modal_close()

                setTimeout(() => {
                    $("#saveForm").removeAttr("disabled")
                }, 500)

                get_NewPageTableV1()
            }
            else {

                if (data.validationErrors.length > 0)
                    generateErrorValidation(data.validationErrors)
                if (data.statusMessage != null) {
                    var msgError = alertify.warning(data.statusMessage);
                    msgError.delay(alertify_delay);
                }
            }
        })
}

async function saveBranchAsync(model,url) {

    $("#saveForm").prop("disabled", true)

    let result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            return data;
        },
        error: function (xhr) {

            setTimeout(() => {
                $("#saveForm").removeAttr("disabled")
            }, 500)
            error_handler(xhr, url);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

function run_button_sendToCentral(p_keyvalue) {

    sendBranchToCentral(p_keyvalue);
}

function sendBranchToCentral(p_keyvalue) {

    $.ajax({
        url: viewData_sendcentral_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        success: function (result) {
            
            if (result.successfull == true) {
                alertify.success(result.statusMessage);
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
function run_button_edit(p_keyvalue) {
    var check = controller_check_authorize(viewData_controllername, "UPD")
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    let url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}


function modal_fill_items(item, modal_name) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    $("#name").val(item.name);
    $("#stateId").val(item.stateId == null ? 0 : item.stateId).trigger("change");
    $("#cityId").val(item.cityId == null ? 0 : item.cityId).trigger("change");
    $("#address").val(item.address);
    $("#longitude").val(item.longitude);
    $("#latitude").val(item.latitude);
    $("#isActive").prop("checked", item.isActive).trigger("change");
    centralId = item.centralId;

    let newbranchLineList = item.branchLinesList

    if (checkResponse(newbranchLineList)) {

        for (let i = 0; i < newbranchLineList.length; i++) {

            let model = {
                branchLineId: newbranchLineList[i].branchLineId,
                branchLineTypeId: newbranchLineList[i].branchLineTypeId,
                branchLineTypeName: newbranchLineList[i].branchLineType,
                value: newbranchLineList[i].value
            }

            branchLineList.push(model)
        }

    }
    else
        branchLineList = []

    listOfItems();
}

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
    $("#name").focus()

    if (branchLineList.length == 0) {
        $("#tableLine tbody").html(`<tr><td colspan="4" style="text-align:center">سطری وجود ندارد</td></tr>`)
    }
    fill_select2("api/GN/BranchApi/getbranchlinetypelist", "lineType", true, 0);

});

$("#lineType").on("change", function () {
    var typ = +$(this).val();
    if (typ == 1 || typ == 2 || typ == 4 || typ == 5)
        $("#lineValue").addClass("str-number");
    else
        $("#lineValue").removeClass("str-number");

});


$("#AddEditModal").on("hidden.bs.modal", function () {
    branchLineList = [];
    resetInputs();
    resetInputsLine();
});

function listOfItems() {
    listOfItemsTbody();
    resetInputsLine();
}

function listOfItemsTbody() {

    $("#tableLine tbody").empty()

    if (branchLineList.length == 0) {
        let emptyStr = `<tr><td colspan="4" style="text-align:center">سطری وجود ندارد</td> </tr>`
        $("#tableLine tbody").append(emptyStr)
    }
    else {
        for (let i = 0; i < branchLineList.length; i++) {

            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:10%;">${i + 1}</td>`
            str += `<td style="width:10%;">${branchLineList[i].branchLineTypeName}</td>`
            str += `<td style="width:10%;">${branchLineList[i].value}</td>`
            str += `<td style="width:10% text-align="center">
                       <div style="display:flex;justify-content :center">
                            <button id='rowItemDelete${branchLineList[i].branchLineId}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine(${i + 1},event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                            <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine(${i + 1},'${branchLineList[i].branchLineId}','${branchLineList[i].branchLineTypeId}','${branchLineList[i].value}',event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                       </div>
                    </td>
                `;

            str += `</tr>`;

            $("#tableLine tbody").append(str)
        }

        $(`#AddEditModal tbody #rowItem1`).addClass("highlight");
        resetInputsLine()
        $("#lineType").select2("focus");

    }
}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#AddEditModal .highlight`).removeClass("highlight");
    $(`#AddEditModal #rowItem${row}`).addClass("highlight");
    $(`#AddEditModal #rowItem${row}`).focus();
}

function newTrOnkeydown(elm, ev, row) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row - 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).focus();
        }

    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row + 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).focus();
        }
    }

}

function saveUpdateRow() {
    let idNumber = +$("#idNumber").val()
    let typeId = $("#lineType").val()
    let typeName = $("#lineType option:selected").text()
    let lineValue = $("#lineValue").val();


    if (!checkResponse(typeId) || typeId == "0") {
        var msgItem = alertify.warning("نوع را انتخاب نمایید");
        msgItem.delay(alertify_delay);
        $("#lineType").select2("focus");

        return
    }
    if (!checkResponse(lineValue) || lineValue == "") {
        var msgItem = alertify.warning("مقدار را انتخاب نمایید");
        msgItem.delay(alertify_delay);
        $("#lineValue").focus();

        return
    }

    if (typeId == 1 || typeId == 2) {
        var phoneformat = /^0\d{2,3}\d{5,8}$/;
        if (!lineValue.match(phoneformat)) {
            var msgError = alertify.warning("فرمت شماره تلفن/نمابر نادرست است");
            msgError.delay(alertify_delay);
            $("#lineValue").focus();

            return;
        }
    }
    if (typeId == 3) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!lineValue.match(mailformat)) {
            var msgError = alertify.warning("فرمت ایمیل نادرست است");
            msgError.delay(alertify_delay);
            $("#lineValue").focus();
            return;
        }
    }

    if (typeId == 4 || typeId == 5) {
        var mobileformat = /{?(0?9[0-9]{9,9}}?)$/;
        if (!lineValue.match(mobileformat)) {
            var msgError = alertify.warning("فرمت شماره همراه نادرست است");
            msgError.delay(alertify_delay);
            $("#lineValue").focus();
            return;
        }
    }
    if (typeId == 6) {
        var instaformat = /(?!.*\.\.)(?!.*\.$)[^\W][\w.]([A-Za-z0-9-_\.][^0-9]+)/gm
        if (!lineValue.match(instaformat)) {
            var msgError = alertify.warning("فرمت نام کاربری اینستاگرام نادرست است");
            msgError.delay(alertify_delay);
            $("#lineValue").focus();
            return;
        }
    }
    if (checkResponse(idNumber) && idNumber == "") {

        var model = {
            branchLineTypeId: typeId,
            branchLineTypeName: typeName,
            value: lineValue
        }

        let index = branchLineList.findIndex(v => v.branchLineTypeId == typeId && v.value == lineValue);

        if (index == -1) {
            branchLineList.push(model);
            $("#tableLine tbody").empty()
            listOfItems()
        }
        else {
            var msgError = alertify.warning("نوع و مقدار تکراری است");
            msgError.delay(alertify_delay);
        }

    }
    else {

        let index = branchLineList.findIndex(v => v.branchLineTypeId == $("#lineType").val() && v.value == $("#lineValue").val());

        if (index == -1) {
            branchLineList[idNumber - 1].branchLineTypeId = $("#lineType").val()
            branchLineList[idNumber - 1].branchLineTypeName = $("#lineType option:selected").text()
            branchLineList[idNumber - 1].value = $("#lineValue").val()

            listOfItems();
        }
        else {
            var msgError = alertify.warning("نوع و مقدار تکراری است");
            msgError.delay(alertify_delay);
        }
    }
    $("#lineType").select2("focus");
}

function editLine(row, id, type, value, e) {
    e.preventDefault()
    e.stopPropagation()

    $("#idNumber").val(row);
    $("#lineValue").val(value);
    $("#lineType").val(parseInt(type)).trigger("change");
    $("#lineType").select2("focus");
    $(`#AddEditModal tbody tr`).removeClass("highlight");

}

function deleteLine(row, e) {
    e.preventDefault()
    e.stopPropagation()

    branchLineList.splice(row - 1, 1)
    listOfItems()
    $("#lineType").select2("focus");

}

function resetInputsLine() {
    $("#idNumber").val("")
    $("#lineValue").val("")
    $("#lineType").prop("selectedIndex", 0).trigger("change")
    $("#lineType").select2("focus");
}

function resetInputs() {

    $("#name").val("");
    $("#address").val("");
    $("#stateId").prop("selectedIndex", 0).trigger("change");
    $("#cityId").html("");
}
initForm()

