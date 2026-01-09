var viewData_controllername = "UserApi";
var viewData_profile_url = `${viewData_baseUrl_GN}/${viewData_controllername}/profile`
    , formChangePass = $('#changePassForm').parsley();

function fillProfile(result) {

            //if (result.picture)
            //    elm.attr("src", "data:image/png;base64," + result.picture);
    $("#fullName").text(result.fullName)
    $("#firstName").val(result.firstName);
    $("#lastName").val(result.lastName);
    $("#nationalCode").val(result.nationalCode);
    $("#roleName").val(result.roleName);
    $("#roleTitle").text(result.roleName);
    $("#userName").val(result.userName);
    $("#email").val(result.email);
    $("#ip").val(result.ip);
    $("#operatingSystem").val(result.operatingSystem);
    $("#browser").val(result.browser);
}
function getProfile() {
    $.ajax({
        url: viewData_profile_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: {},
        cache: false,
        success: function (result) {
            if (result != null)
                fillProfile(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_profile_url);
            return 0;
        }
    });
}
getProfile();

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

function changepass() {

    var formPass = $("#changePassForm").parsley();

    var validate = formPass.validate();
    validateSelect2(formPass);
    if (!validate)
        return;

    var password = $("#newpassword").val();
    var model = {
        id: profileUserId,
        password: password
    }
    $.ajax({
        url: '/api/GN/UserApi/changepasswordprofile',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            var msg = alertify.success(msg_row_edited);
            msg.delay(alertify_delay);
        },
        error: function (xhr) {
            error_handler(xhr, '/api/GN/UserApi/changepasswordprofile')
        }
    });
}