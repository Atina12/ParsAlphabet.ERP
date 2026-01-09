var viewData_form_title = "صندوق",
    viewData_controllername = "CashierApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/update`,
    viewData_getCategoryName_url = `${viewData_baseUrl_FM}/AccountCategoryApi/getincomebalance`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_check_ip_url = `${viewData_baseUrl_FM}/${viewData_controllername}/checkexistip`,
    viewData_check_ip_ping_url = `${viewData_baseUrl_PB}/PublicApi/pingip`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`, arrayPoses = [],
    typeSavePos = "INS", currentPosRowNumber = 0, currentPosId = 0, dataPoses = [
        { id: "1", text: `به پرداخت ملت`, src: "/StaticFiles/Pos/behpardakht.png" },
        { id: "2", text: `سامان کیش`, src: "/StaticFiles/Pos/saman.png" }
    ];

var viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}Cashier.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";

get_NewPageTableV1();
fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true);

function run_button_edit(p_keyvalue, rowno, elem) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;


    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });



    $.ajax({
        url: viewData_getrecord_url,
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
            if (result.data.posList !== null && result.data.posList.length > 0) {
                let arrayIdsPos = result.data.posList;
                let arrayIdsPosLen = arrayIdsPos.length;

                for (var i = 0; i < arrayIdsPosLen; i++) {
                    arrayIdsPos[i].rowNumber = i + 1;
                    arrayPoses.push(arrayIdsPos[i]);
                    appendTempPos(arrayIdsPos[i]);
                }
            }
            $('#ipAddress').val(result.data.ipAddress);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function saveCashier() {

    let form = $("#cashierForm").parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (arrayPoses.length == 0) {
        alertify.warning("خودپرداز ها انتخاب کنید").delay(alertify_delay);
        return;
    }
    if (arrayPoses.length > 1 && $("#isStand").prop("checked")) {
        alertify.warning("برای کیوسک فقط امکان ثبت 1 پوز است").delay(alertify_delay);
        return;
    }

    var model = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        branchId: +$("#branchId").val(),
        isActive: $("#isActive").prop("checked"),
        isStand: $("#isStand").prop("checked"),
        ipAddress: $("#ipAddress").val(),
        posList: arrayPoses
    };

    ajaxSaveCashier(model).then(async (data) => {
        if (data.successfull) {
            var msgError = alertify.success("عملیات با موفقیت انجام شد.");
            msgError.delay(alertify_delay);
            modal_close("AddEditModal");
            get_NewPageTableV1();
        }
        else {
            var msgError = alertify.error("عملیات با خطا مواجه شد");
            msgError.delay(alertify_delay);
        }
    });

}

async function ajaxSaveCashier(data) {

    let url = "";
    if (data.id !== 0)
        url = viewData_updrecord_url;
    else
        url = viewData_insrecord_url;

    $("#modal-save").prop("disabled", true)

    let result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {

            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)

            return data;
        },
        error: function (xhr) {

            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
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

function standChange(elm) {
    let checked = $(elm).prop("checked");

    funkyradio_onchange(elm);
    $(`.checkcash`).prop('checked', false);

    $("#ipAddress").val("").prop("disabled", !checked).prop("required", checked);
    $("#getReplayIpCashier").addClass("btn-secondary").removeClass("btn-success btn-danger").prop("disabled", false).data("ping", "");
    $("#getReplayIpCashier i").addClass("fa-network-wired").removeClass("fa-check fa-times");
    $("#posFormMain *").prop("disabled", arrayPoses.length > 0 && $("#isStand").prop("checked"));
}

//#region PosTab

$("#addPos").on("click", function () {

    let from = $("#posForm").parsley();
    let validate = from.validate();
    validateSelect2(from);
    if (!validate) return;

    configAppendPos(typeSavePos);
});

function configAppendPos(typeSavePos) {
    if (typeSavePos == "INS") {

        if ($("#isStand").prop("checked") && arrayPoses.length > 0) {
            alertify.warning("برای کیوسک فقط امکان تخصیص یک پوز هست").delay(prMsg.delay);
            $("#posProviderId").select2("focus");
            return;
        }

        let checkExist = checkNotExistValueInArray(arrayPoses, 'posProviderId', +$("#posProviderId").val());
        if (!checkExist) {
            alertify.warning("این تامین کننده وجود دارد").delay(prMsg.delay);
            $("#posProviderId").select2("focus");
            return;
        }
        modelAppendPos(arrayPoses.length + 1, typeSavePos);
    }
    else {
        let checkExist = checkNotExistValueInArrayUpd(arrayPoses, 'posProviderId', +$("#posProviderId").val(), currentPosRowNumber - 1);
        if (!checkExist) {
            alertify.warning("این تامین کننده وجود دارد").delay(prMsg.delay);
            $("#posProviderId").select2("focus");
            return;
        }

        modelAppendPos(currentPosRowNumber, typeSavePos);
    }
}

function modelAppendPos(rowNumber, typeSave) {

    let modelPos = {
        id: 0,
        headerId: 0,
        rowNumber: rowNumber,
        name: $("#name_pos").val(),
        bankId: +$("#bankId").val(),
        bankName: $("#bankId").select2('data').length > 0 ? $("#bankId").select2('data')[0].text : "",
        bankAccountId: +$("#bankAccountId").val(),
        bankAccountName: $("#bankAccountId option[selected]").text(),
        isPcPos: $("#isPcPos").prop("checked"),
        posProviderId: +$("#posProviderId").val(),
        isActive: $("#isActive_Pos").prop("checked"),
    }

    if (typeSave == "INS")
        arrayPoses.push(modelPos);

    appendTempPos(modelPos, typeSavePos);
    typeSavePos = "INS";
}

var appendTempPos = (data, tSave = "INS") => {
    let dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            let emptyRow = $("#tempPos").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempPos").html("");

            dataOutput = `<tr id="p_${data.rowNumber}">
                          <td>${data.id == 0 ? "" : data.id}</td>
                          <td>${data.name}</td>
                          <td>${data.bankId != 0 ? data.bankName : ""}</td>
                          <td>${data.bankAccountId != 0 ? data.bankAccountName : ""}</td>
                          <td>${data.isPcPos ? "دارد" : "ندارد"}</td>
                          <td>${dataPoses.filter(a => a.id == data.posProviderId)[0].text}</td>
                          <td>${data.isActive ? "فعال" : "غیرفعال"}</td>
                          <td id="operationp_${data.rowNumber}">
                              <button type="button" id="deletep_${data.rowNumber}" onclick="removeFromTempPos(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editp_${data.rowNumber}" onclick="EditFromTempPos(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempPos");
        }
        else {
            let i = arrayPoses.findIndex(x => x.rowNumber == data.rowNumber);
            arrayPoses[i] = data;
            arrayPoses[i].id = currentPosId;

            $(`#p_${data.rowNumber} td:eq(0)`).text(data.id);
            $(`#p_${data.rowNumber} td:eq(1)`).text(data.name);
            $(`#p_${data.rowNumber} td:eq(2)`).text(data.bankId != 0 ? data.bankName : "");
            $(`#p_${data.rowNumber} td:eq(3)`).text(data.bankAccountId != 0 ? data.bankAccountName : "");
            $(`#p_${data.rowNumber} td:eq(4)`).text(data.isPcPos ? "دارد" : "ندارد");
            $(`#p_${data.rowNumber} td:eq(5)`).text(data.posProviderName);
            $(`#p_${data.rowNumber} td:eq(6)`).text(data.isActive ? "فعال" : "غیرفعال");

        }
        resetPosForm();
    }
}

function resetPosForm() {
    $("#posBox .select2").val("").trigger("change");
    $("#posBox input.form-control").val("");
    $("#posBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#getReplayIp").addClass("btn-secondary").removeClass("btn-success btn-danger").prop("disabled", false).data("ping", "");
    $("#getReplayIp i").addClass("fa-network-wired").removeClass("fa-check fa-times");
    $("#name_pos").focus();
    typeSavePos = "INS";
    currentPosId = 0;
    currentPosRowNumber = 0;
}

var EditFromTempPos = (rowNumber) => {

    $("#tempPos tr").removeClass("highlight");
    $(`#p_${rowNumber}`).addClass("highlight");

    $("#posFormMain *").prop("disabled", false);

    let arrayPosesE = arrayPoses.filter(line => line.rowNumber === rowNumber)[0];

    $("#name_pos").val(arrayPosesE.name);

    $("#bankId").val(arrayPosesE.bankId).trigger('change');

    $("#bankAccountId").val(arrayPosesE.bankAccountId).trigger('change');

    changeCheckbox("isPcPos", arrayPosesE.isPcPos);

    $("#posProviderId").val(arrayPosesE.posProviderId).trigger('change');

    changeCheckbox("isActive_Pos", arrayPosesE.isActive);

    $("#name_pos").focus();
    typeSavePos = "UPD";
    currentPosRowNumber = arrayPosesE.rowNumber;
    currentPosId = arrayPosesE.id;
}

function changeCheckbox(id, value) {
    var elm = $(`#${id}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (value == true) {
        elm.prop("checked", true);
        elm.nextAll().remove();
        elm.after(`<label class="border-thin" for="${elm.attr("id")}">${switchValue[0]}</label>`);
        elm.trigger("change");
    } else {
        elm.prop("checked", false);
        elm.nextAll().remove();
        elm.after(`<label class="border-thin" for="${elm.attr("id")}">${switchValue[1]}</label>`);
        elm.trigger("change");
    }
    elm.blur();
}

$("#canceledPos").on("click", resetPosForm);

var removeFromTempPos = (rowNumber) => {
    currentPosRowNumber = rowNumber;

    $("#tempPos tr").removeClass("highlight");
    $(`#p_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arrayPoses, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#p_${rowNumber}`).remove();

    if (arrayPoses.length == 0)
        $("#tempPos").html(fillEmptyRow($("#tempPosList thead th").length));


    rebuildPosRow();
}

function rebuildPosRow() {
    let arr = arrayPoses,
        table = "tempPos";


    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].setAttribute("id", `p_${arr[b].rowNumber}`);

        if ($(`#${table} tr`)[b].children[9].innerHTML !== "") {


            $(`#${table} tr`)[b].children[9].innerHTML = `<button type="button" onclick="removeFromTempPos(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempPos(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arrayPoses = arr;
    standChange($("#isStand"));
    $("#posFormMain *").prop("disabled", arrayPoses.length > 0 && $("#isStand").prop("checked"));
}

//#endregion

//#region PosPraperty
$(".select2").select2();
fill_select2ImagePos();
standChange($("#isStand"));
fill_select2("/api/FM/BankApi/getdropdownhasaccount", "bankId", true, 0, false);
$("#bankId").on("change", function () {

    $("#bankAccountId").html("");

    if (+$(this).val() != 0)
        fill_dropdown(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown_bankId`, "id", "name", "bankAccountId", false, +$(this).val());
});

$("#ipAddress").inputmask()

function checkExistIp(id, ip) {
    var model = { id: id, name: ip }
    var output = $.ajax({
        url: viewData_check_ip_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_ip_url);
            return JSON.parse(false);
        }
    });
    return output.responseJSON;
}


window.Parsley._validatorRegistry.validators.existposip = undefined

window.Parsley.addValidator("existposip", {
    validateString: function (value) {
        return checkExistIp(+$("#modal_keyid_value").text(), value);
    },
    messages: {
        en: 'آی پی قبلا ثبت شده است'
    }
});


function fill_select2ImagePos() {
    $(`#posProviderId`).empty();

    $(`#posProviderId`).select2({
        templateResult: function (item) {
            return $(`<div class="image"><img height="32" class="ml-1" src="${item.src ?? ""}"><span> ${item.text}</span></div>`);
        },
        placeholder: "انتخاب",
        data: dataPoses,
    });

}

function getPing(ip) {

    $.ajax({
        url: viewData_check_ip_ping_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(ip),
        success: function (result) {
            configPingResult(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_ip_ping_url);
        }
    });
}

function configPingResult(result) {

    if (result) {
        $("#getReplayIp").addClass("btn-success").removeClass("btn-danger btn-secondary").prop("disabled", true).data("ping", "y");
        $("#getReplayIp i").addClass("fa-check").removeClass("fa-times fa-network-wired");
    }
    else {
        $("#getReplayIp").addClass("btn-danger").removeClass("btn-success btn-secondary").prop("disabled", false).data("ping", "n");
        $("#getReplayIp i").addClass("fa-times").removeClass("fa-check fa-network-wired");
    }
}

//#endregion Pos

$("#AddEditModal").on("hidden.bs.modal", resetAfterClose);
$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
    setDefaultActiveCheckbox($("#isActive_Pos"));
});

function resetAfterClose() {
    $("#getReplayIp").addClass("btn-secondary").removeClass("btn-success btn-danger").prop("disabled", false).data("ping", "");
    $("input.form-control").val("");
    $("#getReplayIp i").addClass("fa-network-wired").removeClass("fa-check fa-times");
    $("#tempPos").html(fillEmptyRow(10));
    $("#firstTab").click();
    arrayPoses = [];
    typeSavePos = "INS";
    currentPosRowNumber = 0;
    $(".parsley-errors-list li").html("");
    $("#getReplayIpCashier").addClass("btn-secondary").removeClass("btn-success btn-danger").prop("disabled", false).data("ping", "");
    $("#getReplayIpCashier i").addClass("fa-network-wired").removeClass("fa-check fa-times");
    resetPosForm();
    standChange($("#isStand"));
}

//#region stand
$("#ipAddress").on("input", function () {
    $("#getReplayIpCashier").addClass("btn-secondary").removeClass("btn-success btn-danger").prop("disabled", false).data("ping", "");
    $("#getReplayIpCashier i").addClass("fa-network-wired").removeClass("fa-check fa-times");
});

function getPingStand(ip) {

    $.ajax({
        url: viewData_check_ip_ping_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(ip),
        success: function (result) {
            configPingResultStand(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_ip_ping_url);
        }
    });
}

function configPingResultStand(result) {

    if (result) {
        $("#getReplayIpCashier").addClass("btn-success").removeClass("btn-danger btn-secondary").prop("disabled", true);
        $("#getReplayIpCashier i").addClass("fa-check").removeClass("fa-times fa-network-wired");
    }
    else {
        $("#getReplayIpCashier").addClass("btn-danger").removeClass("btn-success btn-secondary").prop("disabled", false);
        $("#getReplayIpCashier i").addClass("fa-times").removeClass("fa-check fa-network-wired");
    }
}

//#endregion 