var viewData_form_title = "مراجعین",
    viewData_controllername = "PatientApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_check_nationalCode_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getnationalcode`,
    viewData_getpersonbybirth_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpersonbybirth`,
    viewData_list_educationlevel = `${viewData_baseUrl_HR}/EmployeeApi/educationlevel`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Patient.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    flgCheckvalidatepatient = false,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

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
        filteritem: "",
        filtervalue: "",
        lastPageloaded: 0,
        widthColumnByRem: true
    }
],


$("#nationalCode").on("blur", function (eb) {

        let citizenCode = $('#citizenCode').val()

        if (citizenCode == '') {
            var nationalCode = $(this).val();

            if (!isValidIranianNationalCode(nationalCode) && nationalCode !== "") {
                var nCodeValid = alertify.warning("نمبر تذکره معتبر نمی باشد");
                nCodeValid.delay(alertify_delay);
                return;
            }

            if (nationalCode !== "")
                getPatientByNationalCode_adm(nationalCode, 0, (result) => {
                    if (checkResponse(result)) {
                        $("#patientId").val(result.id);
                        $("#firstName").val(result.firstName);
                        $("#lastName").val(result.lastName);
                        $("#birthDatePersian").val(result.birthDatePersian);
                        $("#genderId").val(result.genderId);
                        $("#countryId").val(result.countryId == 0 ? 101 : result.countryId).trigger("change");
                        $("#mobileNo").val(result.mobileNo);
                        $("#address").val(result.address);
                        $("#idCardNumber").val(result.idCardNumber);
                        $("#postalCode").val(result.postalCode);
                        $("#jobTitle").val(result.jobTitle);
                        $("#phoneNo").val(result.phoneNo);
                        $("#maritalStatusId").val(result.maritalStatusId).trigger("change");
                        $("#educationLevelId").val(result.educationLevelId).trigger("change");
                        $("#fatherFirstName").val(result.fatherFirstName);
                    }
                })
        }
    });

$("#getPersonByBirthWS").on("click", function () {

    loadingAsyncAdmissionSale(true, "getPersonByBirthWS");
    setTimeout(() => {
        $("#getPersonByBirthWS").prop("disabled", true);
        getPersonByBirthWS();
    }, 10);
});

$("#AddEditModal").on("hidden.bs.modal", resetPatientInfo);

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$("#editSectionPatient").on("click", function () {


    $(this).prop("disabled", true);
    $("#citizenCode").prop("disabled", false);
    $("#firstName").prop("disabled", false);
    $("#lastName").prop("disabled", false);
    $("#birthDatePersian").prop("disabled", false);
    $("#genderId").prop("disabled", false);
    $("#nationalCode").prop("disabled", false);
    $("#birthYear").prop("disabled", false);
    $("#fatherFirstName").prop("disabled", false);
    $("#countryId").prop("disabled", false);
    $("#mobileNo").prop("disabled", false);
    $("#phoneNo").prop("disabled", false);
    $("#idCardNumber").prop("disabled", false);
    $("#maritalStatusId").prop("disabled", false);
    $("#educationLevelId").prop("disabled", false);
    $("#jobTitle").prop("disabled", false);
    $("#postalCode").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#getPersonByBirthWS").prop("disabled", false);
   
    $("#citizenCode").focus();
});

function initPatient() {
    $("#exportCSV").remove()
    $("#stimul_preview").remove()
    $(".select2").select2()

    inputMask();

    fill_select2(`${viewData_baseUrl_GN}/LocCountryApi/getdropdown`, "countryId", true);
    fill_select2(viewData_list_educationlevel, "educationLevelId", true);

    get_NewPageTableV1();
}

function run_button_edit(p_keyvalue, rowno, elem) {

    flgCheckvalidatepatient = false;

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

            let birthYear = result.data.birthDatePersian
            birthYear = birthYear.slice(0, 4)
            $("#birthYear").val(birthYear);

            $("#citizenCode").prop("disabled", true);
            $("#nationalCode").prop("disabled", true);
            $("#getPersonByBirthWS").prop("disabled", true);
            $("#birthYear").prop("disabled", true);
            $("#firstName").prop("disabled", true);
            $("#lastName").prop("disabled", true);
            $("#genderId").prop("disabled", true);
            $("#birthDatePersian").prop("disabled", true);
            $("#fatherFirstName").prop("disabled", true);
            $("#countryId").prop("disabled", true).trigger('change');
            $("#mobileNo").prop("disabled", true);
            $("#phoneNo").prop("disabled", true);
            $("#idCardNumber").prop("disabled", true);
            $("#maritalStatusId").prop("disabled", true);
            $("#educationLevelId").prop("disabled", true).trigger('change');
            $("#jobTitle").prop("disabled", true);
            $("#postalCode").prop("disabled", true);
            $("#address").prop("disabled", true);
            $("#isActive").prop("checked", result.data.isActive).prop("disabled", false).trigger('change');
            $("#editSectionPatient").prop("disabled", false);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function checkExistNationalCode(nationalCode, id) {
    var model = { id: id, nationalCode: nationalCode }
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

async function clickCode(nationalCode, birthYear) {
    var model = {
        nationalCode: nationalCode,
        birthYear: birthYear
    };
    var url = `${viewData_baseUrl_MC}/PatientApi/GetPersonByBirth`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            if (result.successfull) {
                let patientInfo = result.data.patientInfo;
                $("#nationalCode").prop("disabled", true);
                $("#birthYear").val($("#birthYear").val()).prop("disabled", true);
                setFiledByCode(patientInfo);
            }
            else {
                var msgGetFeedBack = alertify.error(result.statusMessage);
                msgGetFeedBack.delay(alertify_delay);
                loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
                $("#getPersonByBirthWS").prop("disabled", false);
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getpersonbybirth_url);
            loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
            $("#getPersonByBirthWS").prop("disabled", true);
            return JSON.parse(false);

        }
    });
}

function resetPatientInfo(opr) {
    $('#citizenCode').val("").prop("disabled", false);
    $("#firstName").val("").prop("disabled", false);
    $("#lastName").val("").prop("disabled", false);
    $("#genderId").val("").prop("disabled", false);
    $("#getPatientInfoWS").val("").prop("disabled", false);
    $("#birthDatePersian").val("").prop("disabled", false);
    $("#nationalCode").val("").prop("disabled", false);
    $("#fatherFirstName").val("").prop("disabled", false);
    $("#countryId").val("101").prop("disabled", false).trigger("change");
    $("#mobileNo").val("").prop("disabled", false);
    $("#phoneNo").val("").prop("disabled", false);
    $("#idCardNumber").val("").prop("disabled", false);
    $("#maritalStatusId").val(-1).prop("disabled", false).trigger("change");
    $("#birthYear").val("").prop("disabled", false);
    $("#educationLevelId").val(-1).prop("disabled", false).trigger("change");
    $("#jobTitle").val("").prop("disabled", false);
    $("#postalCode").val("").prop("disabled", false);
    $("#address").val("").prop("disabled", false);
    $("#getPersonByBirthWS").val("").prop("disabled", false);
}

async function loadingAsyncAdmissionSale(loading, elementId) {
    if (loading)
        $(`#${elementId} i`).removeClass("fa-users").addClass(`fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin").addClass(`fa-users`);
}

function getPersonByBirthWS() {

    if (+$("#nationalCode").val() == 0) {
        alertify.warning("نمبر تذکره الزامي .").delay(alertify_delay);
        loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
        $("#getPersonByBirthWS").prop("disabled", false);
        $("#nationalCode").focus();
        return;
    }
    if (+$("#birthYear").val() == 0) {
        alertify.warning("سال تولد الزامي .").delay(alertify_delay);
        loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
        $("#getPersonByBirthWS").prop("disabled", false);
        $("#birthYear").focus();
        return;
    }
    let currentYear = moment().format("yyyy"),
        firstYear = moment.from("1300", 'fa', 'YYYY').format("yyyy"),
        valueYear = moment.from(+$("#birthYear").val(), 'fa', 'YYYY').format("yyyy");

    if (valueYear > currentYear || valueYear < firstYear) {
        alertify.warning("سال تولد باید کوچکتر مساوی سال  جاری و بزرگتر مساوی سال 1300  باشد").delay(alertify_delay);
        loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
        $("#getPersonByBirthWS").prop("disabled", false);
        $("#birthYear").focus();
        return;
    }

    if (+$("#countryId").val() == 101) {
        if (!isValidIranianNationalCode($("#nationalCode").val())) {
            var msgvalidNationalCode = alertify.warning("نمبر تذکره معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
            $("#getPersonByBirthWS").prop("disabled", false);
            $("#nationalCode").focus();
            return;
        }
    }
    else {
        if ($("#citizenCode").val().length < 12) {
            var msgvalidNationalCode = alertify.warning("کد اتباع معتبر نمی باشد");
            msgvalidNationalCode.delay(alertify_delay);
            loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
            $("#getPersonByBirthWS").prop("disabled", false);
            $("#citizenCode").focus();
            return;
        }
    }

    $("#firstName").val("");
    $("#lastName").val("");
    $("#birthDatePersian").val("");
    $("#workshopName").val("");
    $("#genderId").val("0").trigger("change");
    $("#getPersonByBirthWS").prop("disabled", true);

    setTimeout(() => {
        clickCode($("#nationalCode").val(), +$("#birthYear").val());
    }, 10);
}

async function setFiledByCode(data) {
    if (data != null) {

        $("#nationalCode").val(data.nationalCode == null ? $("#nationalCode").val() : data.nationalCode).prop("disabled", true);
        $("#firstName").val(data.firstName == null ? $("#firstName").val() : data.firstName).prop("disabled", true);
        $("#lastName").val(data.lastName == null ? $("#lastName").val() : data.lastName).prop("disabled", true);
        $("#birthDatePersian").val(data.birthDate == null ? $("#birthDatePersian").val() : data.birthDate).prop("disabled", true);
        $("#genderId").val(data.genderId == null ? $("#genderId").val() : data.genderId).prop("disabled", true);
        $("#fatherFirstName").val(data.father_FirstName == null ? $("#fatherFirstName").val() : data.father_FirstName).prop("disabled", true);
        $("#countryId").val(data.nationalityId == null ? $("#countryId").val() : data.nationalityId).prop("disabled", true);

        $("#editSectionPatient").prop("disabled", false);

    }
    loadingAsyncAdmissionSale(false, "getPersonByBirthWS");
    $("#getPersonByBirthWS").prop("disabled", true);

    let firstElm = $(".modal-body input.form-control:not(:disabled,.filtervalue),.modal-body select.form-control:not(:disabled)").eq(0);
    if (firstElm.hasClass("select2")) {
        firstElm.focus();
    }
    else {
        firstElm.focus();
    }
}

function run_button_accountDetail(id) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    addAccountDetail(id, "mc.Patient", viewData_getrecord_url, "id", "fullName", "isActive", "", get_NewPageTableV1);
}

function modal_save(modal_name = null, pageVersion = "pagetable") {
    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {};
    var swReturn = false;


    newModel = getPatientModel()

    if (swReturn)
        return;



    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, undefined, get_NewPageTableV1)
}

function modal_record_update(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    if (flgCheckvalidatepatient) {
        var validate = form.validate();

        validateSelect2(form);
        if (!validate) return;
    }

    var newModel = {};

    newModel["Id"] = +$("#modal_keyid_value").text();

    var swReturn = false;
    ///////////////////////////////////////////////
    //var elmentid = $(`#${modal_name}`).attr("id");

    newModel = getPatientModel()

    ////////////////////////////////////////////////
    if (swReturn)
        return;



    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }
    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, undefined, get_NewPageTableV1);
}

function getPatientModel() {
    let nationalCode = $('#nationalCode').val()
    let citizenCode = $('#citizenCode').val()

    let nationalCitizen = ''
    if (nationalCode !== '') {
        nationalCitizen = nationalCode
    }
    else if (citizenCode !== '') {
        nationalCitizen = citizenCode
    }

    let model = {
        address: $('#address').val(),
        birthDatePersian: $('#birthDatePersian').val(),
        countryId: $('#countryId').val(),
        educationLevelId: $('#educationLevelId').val(),
        fatherFirstName: $('#fatherFirstName').val(),
        firstName: $('#firstName').val(),
        genderId: $('#genderId').val(),
        idCardNumber: $('#idCardNumber').val(),
        jobTitle: $('#jobTitle').val(),
        lastName: $('#lastName').val(),
        maritalStatusId: $('#maritalStatusId').val(),
        mobileNo: $('#mobileNo').val(),
        nationalCode: nationalCitizen,
        phoneNo: $('#phoneNo').val(),
        postalCode: $('#postalCode').val(),
        id: +$("#modal_keyid_value").text(),
        isActive: $("#isActive").prop("checked")
    }
    return model;
}

function modal_fill_items(item, modal_name = null) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    if (isValidIranianNationalCode(item.nationalCode)) {
        $('#nationalCode').val(item.nationalCode)
        $('#citizenCode').val("");
    }
    else {
        $('#nationalCode').val("")
        $('#citizenCode').val(item.nationalCode);
    }

    $('#address').val(item.address);
    $('#birthDatePersian').val(item.birthDatePersian);
    $('#countryId').val(item.countryId);
    $('#educationLevelId').val(item.educationLevelId);
    $('#fatherFirstName').val(item.fatherFirstName);
    $('#firstName').val(item.firstName);
    $('#genderId').val(item.genderId);
    $('#idCardNumber').val(item.idCardNumber);
    $('#jobTitle').val(item.jobTitle);
    $('#lastName').val(item.lastName);
    $('#maritalStatusId').val(item.maritalStatusId);
    $('#mobileNo').val(item.mobileNo);
    $('#phoneNo').val(item.phoneNo);
    $('#postalCode').val(item.postalCode);
    $("#isActive").prop("checked", item.isActive);
}

function checkPatientInput(ev) {
    if (modal_open_state == "Edit")
        flgCheckvalidatepatient = true;
}

window.Parsley._validatorRegistry.validators.existnationalcode = undefined
window.Parsley.addValidator("existnationalcode", {
    validateString: function (value) {
        if (value !== "") {

            return checkExistNationalCode(value, +$("#modal_keyid_value").text());
        }
        return true;
    },
    messages: {
        en: 'نمبر تذکره قبلا ثبت شده است'
    }
});

window.Parsley._validatorRegistry.validators.nationalcitizen = undefined
window.Parsley.addValidator("nationalcitizen", {
    validateString: function (value) {
        let nationalCode = $("#nationalCode").val()
        let citizenCode = $("#citizenCode").val()
        return !(nationalCode == "" && citizenCode == "");
    },
    messages: {
        en: 'نمبر تابعیت (خارجی ) یا کدملی نمی تواند خالی بماند'
    }
});

window.Parsley._validatorRegistry.validators.compareidcitizen = undefined
window.Parsley.addValidator("compareidcitizen", {
    validateString: function (value) {
        let nationalCode = $("#nationalCode").val()
        let citizenCode = $("#citizenCode").val()
        return !(nationalCode !== "" && citizenCode !== "");
    },
    messages: {
        en: 'نمبر تذکره و نمبر تابعیت (خارجی ) نمی توانند همزمان ارسال شوند'
    }
});

initPatient()
