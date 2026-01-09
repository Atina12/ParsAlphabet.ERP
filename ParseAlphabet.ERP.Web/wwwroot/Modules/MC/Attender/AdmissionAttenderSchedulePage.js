var winAdmissionAttender;
var admissionAttenderWindow = true;
$("body").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode == 77 && admissionAttenderWindow == true) {
        openAdmissionAttenderSchedule();
    }
});

function openAdmissionAttenderSchedule() {
    if (typeof winAdmissionAttender == "undefined" || winAdmissionAttender.closed) {
        var screenWidth = $(window).width();
        winAdmissionAttender = window.open("/MC/Attender/admissionattenderschedule", "admissionAttenderSchedule", `height=570,width=${screenWidth}`);
        window.onbeforeunload = function () {
            winAdmissionAttender.close();
        };
    }
    else
        winAdmissionAttender.focus();
}
$(document).ready(function () {
    $("#admissionAttenderScheduleContainer").html('<button title="ctrl+shift+m" type="button" onClick="openAdmissionAttenderSchedule()" class="btn btn-success waves-effect ml-2">تقویم داکتر</button>');
})