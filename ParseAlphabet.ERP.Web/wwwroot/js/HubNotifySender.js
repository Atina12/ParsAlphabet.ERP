var connectionSignalR = new signalR.HubConnectionBuilder()
    .withUrl("/notifyHub")
    .build();

function startConnectionNotify() {
    connectionSignalR.start().then().catch(function (err) {

    });
}
startConnectionNotify();

//var enabledNotify = false;

//var connectionBookingSender = null;

//// هاب فرم ورود خروج داکتر با فرم پذیرش
//function hubAssistantAdmission() {
//    connectionBookingSender = new signalR.HubConnectionBuilder().withUrl("AttenderNotifyHub").build();
//    connectionBookingSender.start();
//}

//function sendAttenderNotify(message, sender) {
//    if (message.length > 0)
//        connectionBookingSender.invoke("SendAttenderBookingNotify", "", message)
//}
