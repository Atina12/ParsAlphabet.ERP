var viewData_form_title = "کاربر",

    viewData_controllername = "UserApi",
    viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`,
    viewData_check_nationalCode_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getnationalcode`,
    viewData_check_existmobilenumber_url = `${viewData_baseUrl_GN}/${viewData_controllername}/checkexistmobilenumber`,
    viewData_check_existemailAddress_url = `${viewData_baseUrl_GN}/${viewData_controllername}/checkexistemailaddress`,
    viewData_check_existusername_url = `${viewData_baseUrl_GN}/${viewData_controllername}/checkexistusername`,
    viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}User.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`;

get_NewPageTableV1();

fill_select2(`${viewData_baseUrl_GN}/RoleApi/getdropdown/1`, "roleId", true, 0, false, 0, "انتخاب کنید");


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


window.Parsley._validatorRegistry.validators.existemailaddress = undefined

window.Parsley.addValidator("existemailaddress", {
    validateString: function (value) {
        if (+$("#modal_keyid_value").text() != "") {
            if (value !== "") {
                return checkExistEmailAddress(value, +$("#modal_keyid_value").text());
            }
        }

        return true;
    },
    messages: {
        en: 'ایمیل قبلا ثبت شده است'
    }
});


window.Parsley._validatorRegistry.validators.existmobilenumber = undefined

window.Parsley.addValidator("existmobilenumber", {
    validateString: function (value) {
        if (value !== "") {
            return checkExistMobileNumber(value, +$("#modal_keyid_value").text());
        }

        return true;
    },
    messages: {
        en: 'شماره موبایل قبلا ثبت شده است'
    }
});


window.Parsley._validatorRegistry.validators.mobileemail = undefined

window.Parsley.addValidator("mobileemail", {
    validateString: function (value) {
        var mobail, email;
        mobail = +$("#mobileNo").val();
        email = +$("#email").val();

        if (email == 0 && mobail == 0)
            return false;
        return true;
    },
    messages: {
        en: 'یکی از مقادیر موبایل یا ایمیل باید پر شود'
    }
});


window.Parsley._validatorRegistry.validators.existusername = undefined
window.Parsley.addValidator("existusername", {
    validateString: function (value) {
        if (value !== "") {
            return checkExistUsername(value, +$("#modal_keyid_value").text());
        }
        return true;
    },
    messages: {
        en: 'نام کاربری قبلا ثبت شده است'
    }
});

function checkExistNationalCode(nationalCode, id) {

    var model = { id: id, name: nationalCode }
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


$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

function readPictureFromURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#picture').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function clearPicture(input) {
    $('#picture').attr('src', "/content/images/blank-person.png");
}

function run_button_changepass(p_keyvalue) {
    $("#modal1_keyid_value").text(p_keyvalue);
    $("#modal1_keyid_caption").text("شناسه : ");

    modal_show("ChangePassModal");
}

var form1 = $('#ChangePassModal div.modal-body').parsley();

$('#modal-changepass-save').on("click", function () {
    var validate = form1.validate();
    validateSelect2(form1);
    if (!validate) return;

    changepass();
});

function changepass() {
    var userid = $("#modal1_keyid_value").text();
    var password = $("#newpassword").val();
    var model = {
        id: userid,
        password: password
    }
    $.ajax({
        url: '/api/GN/UserApi/changepassword',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            var msg = alertify.success(msg_row_edited);
            $('#modal-changepass-close').click();
        },
        error: function (xhr) {
            error_handler(xhr, '/api/GN/UserApi/changepassword')
        }
    });
}

function showpicture(p_keyvalue) {
    $("#ShowPictureModal").modal({ "backdrop": "static" });
    $("#modal2_keyid_value").text(p_keyvalue);
    $("#modal2_keyid_caption").text("شناسه : ");
    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(p_keyvalue),
        success: function (result) {
            var item = result.data;
            var p_imagesrc = 'data:image/png;base64,' + item["picture"];
            $("#ShowPictureModal img").attr('src', p_imagesrc);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

$('#modal-showpicture-savefile').on("click", function () {
    var id = $("#modal2_keyid_value").text();
    var src = $("#ShowPictureModal img").attr("src");
    var pos = src.indexOf("base64,");
    var base64 = src.substring(pos + 7);
    var linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = `user_${id}.jpg`;
    downloadLink.click();
});

function checkExistMobileNumber(mobilenumber, id) {

    var model = { id: id, name: mobilenumber }


    let outPut = $.ajax({
        url: viewData_check_existmobilenumber_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_existmobilenumber_url);
        }
    });
    return outPut.responseJSON;

}

function checkExistEmailAddress(emailaddress, id) {

    var model = { id: id, name: emailaddress }

    let outPut = $.ajax({
        url: viewData_check_existemailAddress_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_existemailAddress_url);
        }
    });
    return outPut.responseJSON;

}

function checkExistUsername(username, id) {

    var model = { id: id, name: username }
    var output = $.ajax({
        url: viewData_check_existusername_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_existusername_url);
            return JSON.parse(false);
        }
    });

    return output.responseJSON;
}

$("#AddEditModal").on("hidden.bs.modal", function () {

    $("#mobileNo").val("");
});

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";
    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "UserName", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        { Item: "FullName", value: null, SqlDbType: dbtype.VarChar, Size: 0 }
        //{ Item: "NationalCode", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        //{ Item: "MobileNo", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        //{ Item: "Email", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        //{ Item: "Picture", value: null, SqlDbType: dbtype.Binary, Size: 0 },
        //{ Item: "RoleId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: "Role", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        //{ Item: "CompanyId", value: null, SqlDbType: dbtype.int, Size: 0 },
        //{ Item: "CompanyName", value: null, SqlDbType: dbtype.VarChar, Size: 0 },

    ]

    stimul_report(reportParameters);
});













