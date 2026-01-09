var viewData_controllername_Attender_Assistant = "Attender_AssistantApi";

var viewData_assistant_getrecord_url = `${viewData_baseUrl_GN}/UserApi/getrecordbyid`;

$("#selectedAssistant").select2({ placeholder: "نحوه نمایش" });

$("#selectedAssistant").on("change", function () {

    pagetable_formkeyvalue[1] = +$(this).val();
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "userAssistant_pagetable");
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    get_NewPageTableV1("userAssistant_pagetable");
});

function user_init(userId, userFullName, pg_name) {

    pagetable_formkeyvalue[0] = +userId;

    modal_user_info("userAssistantModal", userId, userFullName);

    pagetable_formkeyvalue[1] = +$("#selectedAssistant").val();

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "userAssistant_pagetable");
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    if (arrSearchFilter[index] != undefined)
        arrSearchFilter[index].filters = []

    get_NewPageTableV1("userAssistant_pagetable", false, () => {
        modal_show("userAssistantModal");
        setTimeout(() => {
            $("#userAssistant_pagetable tbody > #row1").focus()
        }, 500)
    });

    //setTimeout(() => {
    //    $("#userAssistant_pagetable tbody > #row1").focus()
    //}, 500)
};

function modal_user_info(modalName, userId, userFullName) {

    if (userId)
        $(`#${modalName}`).find("#userId").html(userId);
    else
        $(`#${modalName}`).find("#userId").html("");

    if (userFullName)
        $(`#${modalName}`).find("#userFullName").html(userFullName);
    else
        $(`#${modalName}`).find("#userFullName").html("");


    $.ajax({
        url: viewData_assistant_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(userId),
        cache: false,
        async: false,
        success: function (result) {

            var item = result.data;

            if (item.id)
                $(`#${modalName}`).find("#userId").html(userId);
            else
                $(`#${modalName}`).find("#userId").html("");

            if (item.firstName || item.lastName)
                $(`#${modalName}`).find("#userFullName").html(`${item.firstName !== null ? item.firstName : ""} ${item.lastName !== null ? item.lastName : ""}`);
            else
                $(`#${modalName}`).find("#userFullName").html("");

        },
        error: function (xhr) {
            error_handler(xhr, viewData_assistant_getrecord_url)
        }
    });
}
