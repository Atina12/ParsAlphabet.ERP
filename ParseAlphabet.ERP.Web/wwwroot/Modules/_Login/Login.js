async function initLoginForm() {
    get_companyinfo();
    $("#_username").focus();
}

var formInsurer = $('div .card-body').parsley();

var elements = $('#card-body-login input,checkbox').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var nextElement = elements.get(elements.index(this) + 1);
        if (nextElement)
            nextElement.focus();
        else {
            check_login();
        }
    }
});

var elements = $('#card-body-forget input,checkbox').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var nextElement = elements.get(elements.index(this) + 1);
        if (nextElement)
            nextElement.focus();
        else {
            send_forget_sms();
        }
    }
});

var elements = $('#card-body-getactive input,checkbox').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var nextElement = elements.get(elements.index(this) + 1);
        if (nextElement)
            nextElement.focus();
        else {
            check_actiovationcode();
        }
    }
});

var elements = $('#card-body-resetpass input,checkbox').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var nextElement = elements.get(elements.index(this) + 1);
        if (nextElement)
            nextElement.focus();
        else {
            reset_password();
        }
    }
});

function check_login() {
    var validate = formInsurer.validate();
    validateSelect2(formInsurer);
    if (!validate) return;

    spinner.removeClass("displaynone");
    var username = $('#_username').val();
    var password = $('#_password').val();
    //var remember = $('#_rememberpass').prop('checked');

    var loginModel = {
        UserName: username,
        Password: password,
        //RememberPass: remember
    }

    var p_url = '/api/LoginApi/checklogin/';
    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(loginModel),
        success: function (resultQuery) {

            let result = resultQuery.statusMessage;
            if (result === "error_active") {
                alertify.alert("اخطار", "حساب کاربری غیرفعال می باشد", () => { check_login_errorCallback()});
                spinner.addClass("displaynone");
                return;
            }
            if (result === "error_incorrect") {
                alertify.alert("اخطار", "نام کاربری یا رمز عبور اشتباه است", () => { check_login_errorCallback() });
                spinner.addClass("displaynone");
                return;
            }
            if (result === "error_db") {
                alertify.alert('خطای سیستمی', msg_sql_error, () => { check_login_errorCallback() });
                spinner.addClass("displaynone");
                return;
            }

            if (result === "success") {
                spinner.addClass("displaynone");
                var href = window.location.href;
                var pos = href.indexOf("ReturnUrl=");
                if (pos == -1)
                    window.location = "/Home";
                else {
                    var rhref = href.substring(pos + 10)
                    rhref = rhref.replace(new RegExp("%2F", "g"), "/").replace("#", "");
                    window.location = rhref;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
            spinner.addClass("displaynone");
        }
    });
}

function check_login_errorCallback() {
    setTimeout(() => {
        $("#_password").select()
    },300)
}

function go_forget_password() {
    window.location = "/Login/ForgotPassword";
}

function send_forget_sms() {
    var validate = formInsurer.validate();
    validateSelect2(formInsurer);
    if (!validate) return;

    var username = $("#_username").val();
    var mobileno = $("#mobileno").val();

    var forgetPassModel = {
        UserName: username,
        MobileNo: mobileno
    }

    var p_url = '/api/LoginApi/sendforgetsms';
    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(forgetPassModel),
        success: function (resultQuery) {
            var result = resultQuery.message;
            if (result == "error_incorrect") {
                alertify.alert("اخطار", "نام کاربری یا شماره همراه اشتباه است");
            }
            else
                if (result == "error_gencode") {
                    alertify.alert("اخطار", "خطار در ایجاد کد فعال سازی");
                }
            if (result == "error_sendsms") {
                alertify.alert("اخطار", "خطار در ارسال پیامک");
            }
            else
                if (result == "success") {
                    window.location = "/Login/GetActivationCode/" + username;
                }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function check_actiovationcode() {
    var validate = formInsurer.validate();
    validateSelect2(formInsurer);
    if (!validate) return;

    var username = $("#_username").val();
    var actcode = $("#actcode").val();

    var actModel = {
        UserName: username,
        ActCode: actcode
    }

    var p_url = '/api/LoginApi/checkactivationcode';
    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(actModel),
        success: function (resultQuery) {
            var result = resultQuery.message;
            if (result == "error_incorrect") {
                alertify.alert("اخطار", "کد فعال سازی اشتباه است");
            }
            else
                if (result == "success") {
                    window.location = "/Login/ResetPassword/" + username;
                }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function reset_password() {
    var validate = formInsurer.validate();
    validateSelect2(formInsurer);
    if (!validate) return;

    var username = $("#_username").val();
    var newpassword = $("#_newpassword").val();
    var newpasswordconf = $("#_newpasswordconf").val();

    var resetModel = {
        UserName: username,
        NewPassword: newpassword
    }

    var p_url = '/api/LoginApi/changepassword';
    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(resetModel),
        success: function (resultQuery) {
            var result = resultQuery.message;
            if (result == "error_nouserid") {
                alertify.alert("اخطار", "کد کاربری نامشخص است");
            }
            else
                if (result == "success") {
                    alertify.success("", "رمز عبور جدید بازنشانی شد");
                    window.location = "/";
                }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function get_companyinfo() {
    var p_url = '/api/CompanyApi/getcompanyinfo';
    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            fill_companyinfo(result);
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

initLoginForm();