var viewData_controllername_Attender_Assistant = "Attender_AssistantApi";

$("#selectedAttender").select2({ placeholder: "نحوه نمایش" });

$("#selectedAttender").on("change", function () {    
    pagetable_formkeyvalue[1] = +$(this).val();
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "assistant_pagetable");
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    get_NewPageTableV1("assistant_pagetable");
});

function assistant_init(attrId, pg_name) {

    pagetable_formkeyvalue[0] = +attrId;
    modal_attender_info("assistantModal", attrId);

    pagetable_formkeyvalue[1] = +$("#selectedAttender").val();

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "assistant_pagetable");
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    if (arrSearchFilter[index] != undefined)
        arrSearchFilter[index].filters = []

    get_NewPageTableV1("assistant_pagetable", false, () => {
        modal_show("assistantModal");
        setTimeout(() => {
            $("#assistant_pagetable tbody > #row1").focus()
        }, 300)
    });


};

function modal_attender_info(modalName, attrId) {
    
    var url = `${viewData_baseUrl_MC}/AttenderApi/getrecordbyid`;

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
