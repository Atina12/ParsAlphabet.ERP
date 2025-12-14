var viewData_controllername = "CostOfGoodsTemplateLineApi";
var costOfGoodsList = [], costObjectVar = '';


$("#AddEditModalItems").on("hidden.bs.modal", function () {
    resetAllItems()
});

function initCostOfGoodsTemplateLine() {
    
    loadDrowpdown()
}

function loadDrowpdown() {
    
    fill_select2(`${viewData_baseUrl_FM}/${viewData_controllername}/getcostitemtypedropdown`, "itemTypeId", true);
    fill_select2(`${viewData_baseUrl_FM}/${viewData_controllername}/getitemcategorydropdown`, "itemCategory", true);
}

$("#itemCategory").on("change", function () {
    
    let categoryId = +$(this).val();
    let url = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getitemtypeidbycategoryid`;
    $("#itemTypeId").val("").trigger("change");

    if (categoryId > 0) {
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(categoryId),
            async: false,
            cache: false,
            success: function (result) {
                if (result > 0) {
                    $("#itemTypeId").val(result).trigger("change");
                    $("#costRelationId").empty();
                    $("#allocate").val("");
                    fill_select2(`${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getcostobjectdropdown`, "costRelationId", true, `${+result}`);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }

});

$("#costRelationId").on("change", function () {
    
    let costRelationId = +$(this).val(); 
    let itemTypeId = +$("#itemTypeId").val();
    $("#allocate").val("");
    if (costRelationId > 0 && itemTypeId > 0) { 
        let url = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getallocatname`;
        let model = {
            itemTypeId: itemTypeId,
            costRelationId: costRelationId
        }
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {

                $("#allocate").val((result == "0" ? " تسهیم شده - 0": " تسهیم نشده - 1"));
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }

});

function run_button_additem(p_keyvalue, rowno, elem, ev) {
    
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "AddEditModalItems";

    $(".modal").find("#modal_title").text("تخصیص متغیر " + viewData_form_title);

    $("#modal_keyid_value_item").text(p_keyvalue);
    $("#modal_keyid_caption_item").text("شناسه : ");

    let url = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getpage`;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(p_keyvalue),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            
            modal_open_state = 'Edit';
            Modal_fill_itemsNew(result);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}


function Modal_fill_itemsNew(result) {
    
    let getCostOfGoodsList = result
    let newItems = []

    if (checkResponse(getCostOfGoodsList)) {
        for (let i = 0; i < getCostOfGoodsList.length; i++) {
            
            newItems[i] = {
                costOfGoodsTemplateLineId: getCostOfGoodsList[i].costOfGoodsTemplateLineId == 0 ? getCostOfGoodsList[i].id : getCostOfGoodsList[i].costOfGoodsTemplateLineId,
                itemCategoryId: getCostOfGoodsList[i].itemCategoryId,
                itemCategory: getCostOfGoodsList[i].itemCategory,
                itemTypeId: getCostOfGoodsList[i].itemTypeId,
                itemType: getCostOfGoodsList[i].itemType,
                costObjectId: getCostOfGoodsList[i].costObjectId,
                costObject: getCostOfGoodsList[i].costObject,
                allocated: getCostOfGoodsList[i].isAllocated ==  "0" ? " تسهیم شده - 0" : " تسهیم نشده - 1"
                
            }
        }
    }

    costOfGoodsList = newItems
    makeCostOfGoodsLineList()
}


function makeCostOfGoodsLineList() {
    
    $("#tableLine tbody").empty()
    
    let currentCostOfGoodsList = costOfGoodsList

    if (currentCostOfGoodsList.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="7" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLine tbody").append(emptyStr)
    }
    else {
        

        for (let i = 0; i < currentCostOfGoodsList.length; i++) {


            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:3%;text-align:center">${i + 1}</td>`
            str += `<td style="width:10%;text-align:center">${currentCostOfGoodsList[i].costOfGoodsTemplateLineId}</td>`
            str += `<td style="width:18%">${currentCostOfGoodsList[i].itemCategory}</td>`
            str += `<td style="width:18%">${currentCostOfGoodsList[i].itemType}</td>`
            str += `<td style="width:25%">${currentCostOfGoodsList[i].costObject}</td>`
            str += `<td style="width:16%">${currentCostOfGoodsList[i].allocated}</td>`


            str += `
                <td style="width:10% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine(${i + 1},'${currentCostOfGoodsList[i].costOfGoodsTemplateLineId}',event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine(event,${i + 1},${currentCostOfGoodsList[i].costOfGoodsTemplateLineId})" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
            str += `</tr>`

            $("#tableLine tbody").append(str)
        }



        $(`#AddEditModalItems tbody #rowItem1`).addClass("highlight");
    }

}


function saveUpdateRow(elm) {

    
    let id = +$("#costOfGoodsTemplateLineId").val()
    let headerId = +$("#modal_keyid_value_item").text()
    let itemCategoryId = $("#itemCategory").val()
    let itemCategoryText = $("#itemCategory option:selected").text()

    let itemTypeId = $("#itemTypeId").val();
    let itemTypeText = $("#itemTypeId option:selected").text()

    let costRelationId = $("#costRelationId").val()
    let costRelationText = $("#costRelationId option:selected").text()

    let isAllocated = $("#allocate").val().split('-')[1];
    let allocated = $("#allocate").val();

    if (!checkResponse(itemCategory) || itemCategory == "") {
        var msg = alertify.warning("دسته بندی آیتم  را وارد کنید.");
        msg.delay(alertify_delay);
        $("#itemCategory").select2("focus")
        return
    }
    if (!checkResponse(itemTypeId) || itemTypeId == "") {
        var msg = alertify.warning(" نوع آیتم را وارد کنید.");
        msg.delay(alertify_delay);
        $("#itemTypeId").select2("focus")
        return
    }
    if (!checkResponse(costRelationId) || costRelationId == "") {
        var msg = alertify.warning("موضوع هزینه را وارد کنید.");
        msg.delay(alertify_delay);
        $("#costRelationId").select2("focus")
        return
    }


    let model = {
        id,
        headerId,
        itemCategoryId: +itemCategoryId,
        itemTypeId: +itemTypeId,
        costObjectId: +costRelationId,
        allocated: allocated,
        isAllocated: +isAllocated
    }

    let viewData_insertItem = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/insert`

    $.ajax({
        url: viewData_insertItem,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            
            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                
                let index = costOfGoodsList.findIndex(v => v.costOfGoodsTemplateLineId == result.id);
                
                if (index == -1) {

                    model.itemCategory = itemCategoryText
                    model.itemTypeId = itemTypeId
                    model.itemType = itemTypeText
                    model.costObjectId = costRelationId
                    model.allocated = allocated
                    model.costOfGoodsTemplateLineId = result.id
                    model.costObject = costRelationText
                    costOfGoodsList.push(model)
                    makeCostOfGoodsLineList()
                    resetInputs()
                }
                else {
                    costOfGoodsList[index].itemCategory = itemCategoryText
                    costOfGoodsList[index].itemTypeId = itemTypeId
                    costOfGoodsList[index].itemType = itemTypeText
                    costOfGoodsList[index].costRelationId = costRelationId
                    costOfGoodsList[index].costObject = costRelationText
                    costOfGoodsList[index].allocated = allocated
                    makeCostOfGoodsLineList()
                    resetInputs()
                }
            }
            else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                resetInputs()

            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_insertItem)
        }
    });


}


function deleteLine(row, id, e) {
    e.preventDefault()
    e.stopPropagation()

    const arr_ids = costOfGoodsList.map(item => +item.costOfGoodsTemplateLineId);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    if (+id != +largestId) {
        var msg = alertify.warning("از آخرین سطر اجازه حذف دارید.");
        msg.delay(alertify_delay);
        return
    }

    let url = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/delete`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+id),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                costOfGoodsList.splice(row - 1, 1)
                makeCostOfGoodsLineList()
                resetInputs()
            }
            else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                resetInputsRowUnits()
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function editLine(e, row, id) {
    
    e.preventDefault()
    e.stopPropagation()

    const arr_ids = costOfGoodsList.map(item => +item.costOfGoodsTemplateLineId);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    let url = `${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getrecordbyid`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+id),
        async: false,
        cache: false,
        success: function (result) {
            
            $("#rowNumber").val(+row)
            $("#costOfGoodsTemplateLineId").val(result.id) 
            $("#itemCategory").val(result.itemCategoryId).trigger("change");
            $("#itemTypeId").val(result.itemTypeId).trigger("change");
            $("#costRelationId").val(result.costObjectId).trigger("change")
            $("#allocated").val(result.isAllocated ? " تسهیم شده - 1" : " تسهیم نشده - 0")
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row}`).addClass("highlight");
            $("#itemCategory").select2("focus")
           
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}


function resetInputs() {
    $("#rowNumber").val("")
    $("#costOfGoodsTemplateLineId").val("")
    $("#itemTypeId").val("").trigger("change")
    $("#itemCategory").val("").trigger("change")
    $("#costRelationId").val("").trigger("change")
    $("#allocated").val("")
}

function resetAllItems() {
    resetInputs()
    costOfGoodsList = []
    makeCostOfGoodsLineList()
}


function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#AddEditModalItems .highlight`).removeClass("highlight");
    $(`#AddEditModalItems tbody #rowItem${row}`).addClass("highlight");
    $(`#AddEditModalItems tbody #rowItem${row}`).focus();
}

initCostOfGoodsTemplateLine();