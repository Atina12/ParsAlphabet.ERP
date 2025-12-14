var enabledNotify = false;
var connectionBookingReciever = null;

// هاب فرم ورود خروج داکتر با فرم پذیرش
function hubAssistantAdmission() {
    connectionBookingReciever = new signalR.HubConnectionBuilder().withUrl("AttenderNotifyHub").build();
    connectionBookingReciever.on("RecieveBookingAttender", recieveBookingAttender);
    connectionBookingReciever.start();
}

function recieveBookingAttender(name, time, message) {
    if (enabledNotify) {
        var msgNotify = alertify.warning(message);
        msgNotify.delay(alertify_delay);
    }
}

function sendBookingAttender(message, sender) {
    if (message.length > 0)
        connectionBookingReciever.invoke("SendAttenderBookingNotify", "", message)
}
