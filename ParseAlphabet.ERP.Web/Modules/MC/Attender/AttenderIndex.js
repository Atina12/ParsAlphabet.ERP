var viewData_form_title = "داکتر",
    viewData_controllername = "AttenderApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,

    viewData_check_nationalCode_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getnationalcode`,

    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Attender.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "", arrayCheck = [], acceptableParaclinic_arrayCheck = [], centralId = 0,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`,
    viewData_sendcentral_url = `${viewData_baseUrl_MC}/${viewData_controllername}/sendcentralattender`,
    form = $(`#AddEditModalBody`).parsley(),
    flgCheckvalidateattender = false,
    arr_pagetables = [
        {
            pagetable_id: "pagetable",
            editable: false,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            lastPageloaded: 0,
        }
    ];


function initAttenderIndex() {
    get_NewPageTableV1();

    $("#msC_ExpDatePersian").inputmask();
    $("#birthDatePersian").inputmask();
    $(".select2").select2();
    $("#contractType").val(1).trigger("change");

    loadDropdown()

    fillPrescriptionCheckBox();
}

function loadDropdown() {
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getdropdown`, "filterAttender", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "filterSpeciality", true, "1", true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "departmentId", true);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "1", true);
    fill_select2("/api/AdmissionsApi/role_GetDropDown", "roleId", true, 0);
    fill_select2(`${viewData_baseUrl_GN}/LocStateApi/getdropdown`, "locStateId", true);
    fill_dropdown("/api/AdmissionsApi/msctype_getdropdown", "id", "name", "msC_TypeId", true, 0);
}

function fillPrescriptionCheckBox() {
    var viewData_get_fillPrescription_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getdropdownprescriptiontype`;

    $.get(viewData_get_fillPrescription_url, function (result) {
        let str = result.map(item => {
            return `<div class="col-sm-6 pr-0"><label><input id="pr_${item.id}" data-value="${item.id}" type="checkbox" onchange="arrayChecked(this)"/> ${item.name}</label></div>`;
        })
        $("#fillPrescription").html(str);
    });
}

function arrayChecked(item) {
    let idChcke = $(item).data().value;
    if ($(item).prop("checked")) {
        if (!arrayCheck.includes(idChcke))
            arrayCheck.push(idChcke);
    }
    else {
        let index = arrayCheck.findIndex(x => x === idChcke);
        arrayCheck.splice(index, 1);
    }

}

function modal_saveAttender(pageVersion = "pagetable") {

    saveAttender(pageVersion, "save")
}
function saveAttender(pageVersion, saveAndSend = "save") {

    if (modal_open_state == "Edit") {
        if (flgCheckvalidateattender) {
            var validate = form.validate();
            validateSelect2(form);
            if (!validate) return;
        }
    }
    else {
        var validate = form.validate();
        validateSelect2(form);
        if (!validate) return;
    }

    var modal_name = "AddEditModal";

    let parameters = {
        id: +$("#modal_keyid_value").text(),
        centralId: centralId == 0 ? null : centralId,
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        genderId: $("#genderId").val(),
        fatherName: $("#fatherName").val(),
        mobileNo: $("#mobileNo").val(),
        phoneNo: $("#phoneNo").val(),
        idNumber: $("#idNumber").val(),
        nationalCode: $("#nationalCode").val(),
        birthDatePersian: $("#birthDatePersian").val(),
        attenderTaxPer: $("#attenderTaxPer").val(),
        locStateId: +$("#locStateId").val(),
        locCityId: $("#locCityId").val(),
        address: $("#address").val(),
        isActive: $("#isActive").prop("checked"),
        acceptableParaclinic: $("#acceptableParaclinic").prop("checked"),
        departmentId: $("#departmentId").val(),
        specialityId: $("#specialityId").val(),
        roleId: $("#roleId").val(),
        msC_TypeId: $("#msC_TypeId").val(),
        contractType: $("#contractType").val(),
        msc: $("#msc").val(),
        msC_ExpDatePersian: $("#msC_ExpDatePersian").val(),
        prescriptionTypeId: arrayCheck.join()
    };

    if (pageVersion == "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }

    if (modal_open_state == "Add")
        recordInsertUpdate(viewData_insrecord_url, parameters, modal_name, msg_row_created, undefined, get_NewPageTableV1);
    else if (modal_open_state == "Edit")
        recordInsertUpdate(viewData_updrecord_url, parameters, modal_name, msg_row_edited, undefined, get_NewPageTableV1);

}

function attenderInit() {
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
}
async function saveAttenderAsync(parameters, url) {
    let result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(parameters),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
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
function run_button_schedule(attrId) {
    modal_show(`scheduleModal`);
    schedule_init(attrId);
}
function run_button_sendToCentral(p_keyvalue) {

    sendAttenderToCentral(p_keyvalue);
}

function run_button_edit(p_keyvalue, rowno, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;
    flgCheckvalidateattender = false;
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

            if (result.data.acceptableParaclinic !== null && result.data.acceptableParaclinic !== undefined) {
                if (result.data.acceptableParaclinic.includes("False")) {
                    $("#acceptableParaclinic").prop("checked", false)
                }
            } else {
                $("#acceptableParaclinic").prop("checked", true)
            }


            funkyradio_onchange("#acceptableParaclinic")

            modal_show(modal_name);
            centralId = result.data.centralId;
            if (result.data.prescriptionTypeId !== null && result.data.prescriptionTypeId !== "") {
                let arrayIds = result.data.prescriptionTypeId.split(",");
                let arrayIdsLn = arrayIds.length;
                arrayCheck = [...arrayIds];

                for (var i = 0; i < arrayIdsLn; i++)
                    $(`#pr_${arrayIds[i]}`).prop("checked", true);
            }

            $('#ipAddress').val(result.data.ipAddress);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function sendAttenderToCentral(p_keyvalue) {

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
function modal_clear_items(modal_name = null, expectedItem = null) {
    if (modal_name == null)
        modal_name = modal_default_name;

    var element = $(`#${modal_name}`);

    if (element.find(".nav-item a").length > 0) //reset Tabs
        $($(`#${"AddEditModalVe"}`).find(".nav-item a")[0]).click();


    $("#firstName").val("")
    $("#lastName").val("")
    $("#genderId").val(1)
    $("#fatherName").val("")
    $("#mobileNo").val("")
    $("#phoneNo").val("")
    $("#idNumber").val("")
    $("#nationalCode").val("")
    $("#birthDatePersian").val("")
    $("#attenderTaxPer").val("")
    $("#locStateId").val(0).trigger("change")
    $("#locCityId").val("").trigger("change")
    $("#address").val("").trigger("change")

    $("#departmentId").val("").trigger("change")
    $("#specialityId").val("").trigger("change")
    $("#roleId").val("").trigger("change")
    $("#msC_TypeId").val("").trigger("change")
    $("#msc").val("").trigger("change")
    $("#msC_ExpDatePersian").val("").trigger("change")
    $("#contractType").val("on").trigger("change")
    $("#acceptableParaclinic").prop("checked", false)

    $("#pr_1").prop("checked", false)
    $("#pr_2").prop("checked", false)
    $("#pr_3").prop("checked", false)
    $("#pr_4").prop("checked", false)
    $("#pr_5").prop("checked", false)
    $("#pr_6").prop("checked", false)
    $("#pr_7").prop("checked", false)

}

function resetAddEditModal() {
    arrayCheck = [];
    $("#fillPrescription [type='checkbox']").prop("checked", false);
    $("#firstTab").click();

    $("#departmentId").prop("disabled", false);

}

function modal_attender_info(modalName, attrId) {
    var url = viewData_getrecord_url
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(attrId),
        cache: false,
        async: false,
        success: function (result) {
            var item = result.data;

            if (item.id)
                $(`#${modalName}`).find("#attrId").html(attrId);
            else
                $(`#${modalName}`).find("#attrId").html("");

            if (item.firstName || item.lastName)
                $(`#${modalName}`).find("#attrfullName").html(`${item.firstName !== null ? item.firstName : ""} ${item.lastName !== null ? item.lastName : ""}`);
            else
                $(`#${modalName}`).find("#attrName").html("");

            if (item.serviceCenterName)
                $(`#${modalName}`).find("#attrServiceCenter").html(item.serviceCenterName);
            else
                $(`#${modalName}`).find("#attrServiceCenter").html("");

            if (item.msc)
                $(`#${modalName}`).find("#attrMsc").html(item.msc);
            else
                $(`#${modalName}`).find("#attrMsc").html("");
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function checkExistNationalCode(id, name) {

    var model = { id: id, nationalCode: name }
    var output = $.ajax({
        url: viewData_check_nationalCode_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_nationalCode_url);
            return JSON.parse(false);
        }
    });

    return output.responseJSON;
}

function viewAttenterSchedule() {
    $("#AttenterSchedulebody").html(ResetSchedule);
    var x, y, z;
    var data = [], outPut = "";
    for (var i = 1; i <= 7; i++) {

        data = arraySchedule[i], outPut = "";

        for (var j = 0; j < data.length; j++) {

            x = Math.floor(Math.random() * (255 - 150 + 1) + 0);
            y = Math.floor(Math.random() * (255 - 0 + 100) + 0);
            z = Math.floor(Math.random() * (255 - 0 + 1) + 200);

            outPut += `<div class="row-att" style="background-color: rgb(${x} ${y} ${z}/ 0.10);" data-row="${j + 1}" data-week="${i}" id="rowAtt_${j + 1}_${i}" data-toggle="tooltip" data-html="true" onmouseover="getToltipRow(this)">`;
            $.each(data[j], (index, val) => {
                if (index != "id")
                    outPut += `<div class="sub-row-att" data-row="${data[j].id}" data-week="${i}" id="subRowAtt_${j + 1}">${val}</div>`;
            });
            outPut += `</div>`;
        }

        $(`#AttSchedule_${i}`).append(outPut);

    }

    modal_show(`AttenterScheduleModal`);
}

function getToltipRow(elm) {
    var data = $(elm).data()
        , res = {
            allnum: 60,
            resnum: 50,
            noresnum: 10
        };

    $(`#rowAtt_${data.row}_${data.week}`)[0].setAttribute("data-original-title", `
        تمامی نوبت ها : ${res.allnum}<br/>نوبت های رزرو شده : ${res.resnum}<br/> نوبت های باقی مانده : ${res.noresnum}
     `);
    $(`#rowAtt_${data.row}_${data.week}`).tooltip('show');
}

function run_button_accountDetail(id, rowNo, elm) {

    addAccountDetail(id, "mc.Attender", viewData_getrecord_url, "id", "fullName", "isActive", "", get_NewPageTableV1);
}

function checkAttenderInput(ev) {

    if (modal_open_state == "Edit")
        flgCheckvalidateattender = true;
}

window.Parsley._validatorRegistry.validators.existnationalcode = undefined;
window.Parsley.addValidator("existnationalcode", {
    validateString: function (value) {
        if (value !== "") {
            return checkExistNationalCode(+$("#modal_keyid_value").text(), value);
        }

        return true;
    },
    messages: {
        en: 'نمبر تذکره قبلا ثبت شده است'
    }
});

$("#AddEditModal").on("hidden.bs.modal", resetAddEditModal);

$("#locStateId").on('change', function () {
    $("#locCityId").html("").prop("disabled", true).prop("required", false);

    if (+$(this).val() > 0) {
        $("#locCityId").prop("disabled", false).prop("required", true);
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityId", true, +$(this).val());
    }
});

$("#readyforadd").on("click", function () {
    $(".select2").val("").trigger("change");
});

$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == "Edit") {
        flgCheckvalidateattender = true;

        $("#departmentId").prop("disabled", true);
    }

    setDefaultActiveCheckbox($("#isActive"));


});

initAttenderIndex();
