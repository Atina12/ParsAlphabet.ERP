var dataMessage = [
    {
        id: 1,
        message: "تست",
        isRead: false,
        content: 'یک پیغام برای تست  '
    }, {
        id: 2,
        message: "تست 2",
        isRead: false,
        content: 'یک پیغام برای 1تست  '
    }, {
        id: 3,
        message: "3 تست",
        isRead: false,
        content: `یک پیغام برای 2تست `
    }
];

function fillNotify() {
    let data = dataMessage.filter(x => x.isRead == false);
    let dataLn = data.length;
    let outPutMessage = `<h6 class="dropdown-item-text text-right">اعلان ها</h6>`;
    if (dataLn == 0)
        outPutMessage += ` <div class="notification-item-list">
                                <a class="dropdown-item notify-item active text-right">
                                    <p class="notify-details font-12"><b>هیچ اعلانی وجود ندارد</b></p>
                                </a>
                            </div>`;
    else
        for (var i = 0; i < dataLn; i++)
            outPutMessage += ` <div class="notification-item-list">
                                <a onclick="getMessage(${data[i].id})" class="dropdown-item notify-item active text-right">
                                    <p class="notify-details font-12"><b>${data[i].message}</b></p>
                                </a>
                            </div>`;


    $("#conterNotify").html(dataLn);
    $("#resultMessage").html(outPutMessage);
}

function getMessage(id) {
    let data = dataMessage.find(x => x.id == id);
    $("#messageModal").find(".modal-title").html(data.message);
    $("#messageModal").find(".modal-body").html(data.content);
    $("#messageModal").data("id", id);
    $("#messageModal").modal("show");
}

function keyDownModalMessage(ev, modal) {
    if (ev.keyCode == KeyCode.Esc)
        closeMessageModal(modal);

}

function closeMessageModal(modal) {
    let id = $(modal).data("id");
    let index = dataMessage.findIndex(x => x.id == id);
    dataMessage[index].isRead = true;
    fillNotify();
    $(modal).modal(`hide`);
}

fillNotify();