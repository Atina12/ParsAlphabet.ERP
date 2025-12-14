
var viewData_form_title = "کالا و خدمات کیوسک",
    viewData_controllername = "BundleApi",
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`,
    opr = "Ins",
    count = 0,
    ratio = 1,
    unitId = 0,
    idSubUnit = 0,
    bundleLineDetail = [],
    bundleLine = [];



function bundle_init() {

    $(".select2").select2();

    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true);
    $("#branchId").prop("selectedIndex", 0).trigger("change");
    get_NewPageTableV1();
}

$("#branchId").on("change", function () {

    var branchId = +$(this).val();

    $("#itemId").empty();
    $("#cashierId").empty().append("<option value='0'>انتخاب کنید</option>");

    if (branchId !== 0)
        fill_select2(`${viewData_baseUrl_FM}/CashierApi/getdropdowncashstand`, "cashierId", true, branchId, false);

})

$("#cashierId").on("change", function () {

    var cashierId = +$(this).val() == 0 ? null : +$(this).val();
    if (cashierId > 0) {
        $("#itemTypeId").attr("disabled", false);
        $("#itemTypeId").trigger("change");
    }


})

$("#itemTypeId").on("change", function () {


    var itemTypeId = +$(this).val() == 0 ? null : +$(this).val()

    $("#itemId").val("").trigger("change");
    $("#attributeIds").empty();
    $("#subUnitId").empty();
    $("#ratio").val("");
    $("#quntity").val("");
    $("#totalQuntity").val("");
    $("#itemId").attr("disabled", false);


    if (itemTypeId == 1) {
        fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdownitemwithitemtypeid`, "itemId", true, itemTypeId, true);
        $("subUnitId").attr("disabled", false);
    }
    else if (itemTypeId == 2) {
        fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "itemId", true, `${itemTypeId} , 1`, true);

        $("subUnitId").attr("disabled", true);
    }


})

$("#itemId").on("change", function () {

    var itemId = +$(this).val() == 0 ? null : +$(this).val();
    var itemTypeId = +$("#itemTypeId").val()
    $("#ratio").val("");

    if (itemTypeId == 1) {
        $('#subUnitId').val("").trigger("change");
        $("#subUnitId").attr("disabled", false);
        getCategoryItemName(itemId);
    }
    else {
        $("#ratio").val(ratio);
        $("#ratio").attr("disabled", true);
        $("#attributeIds").attr("disabled", true);
        $("#subUnitId").attr("disabled", true);
        unitId = 0;
    }

    $("#quntity").attr("disabled", false);
    $("#saveRow").attr("disabled", false);
    $("#resetInputs").attr("disabled", false);
})

$("#subUnitId").on("change", function () {
    $("#ratio").empty();
    getratio();
})

function getCategoryItemName(id) {

    $('#attributeIds').empty();

    let url = `api/WH/ItemApi/getinfo/${id}`;

    let itemId = +id;
    if (id > 0) {
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {

                if (result && itemId > 0) {

                    let itemCategoryId = result.categoryId
                    unitId = result.unitId
                    if (unitId > 0 && unitId != null) {
                        fill_select2(`/api/WH/ItemUnitApi/unititem_getdropdown`, "subUnitId", true, `${unitId}/${itemId}`);

                        $("#subUnitId").val(result.unitId).trigger("change");
                        $("#subUnitId").attr("disabled", false);
                        $("#subUnitId").attr("required", true);
                    }
                    else {
                        $("#subUnitId").empty();
                        $("#subUnitId").attr("disabled", true);
                        $("#subUnitId").attr("required", false);
                    }



                    getItemAttributeWhitCategoryId(itemCategoryId);


                }

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function getItemAttributeWhitCategoryId(itemCategoryId) {

    $("#ratio").empty();

    if (itemCategoryId > 0) {
        url = `api/WH/ItemCategoryApi/getitemcategoryattribute/${itemCategoryId}`;
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {
                if (!result) {
                    $("#attributeIds").attr("disabled", true);
                    $("#attributeIds").attr("required", false);
                }
                else {

                    fill_select2(`/api/WH/ItemAttributeApi/attributeitem_getdropdown`, "attributeIds", true, itemCategoryId);
                    $("#attributeIds").attr("disabled", false);
                    $("#attributeIds").attr("required", true);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

function getratio() {

    let id = +$("#subUnitId").val();
    if (+id > 0) {


        $.ajax({
            url: `api/WH/ItemUnitApi/getratio/${id}`,
            type: "get",
            contentType: "application/json",
            success: function (result) {

                if (checkResponse(result)) {
                    idSubUnit = +result.idSubUnit;
                    ratio = +result.ratio > 0 ? +result.ratio : 1;
                    $("#ratio").val(ratio);
                }
                else {
                    $("#ratio").val(ratio);
                    idSubUnit = 0;
                }


            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
    else {
        $("#ratio").val(ratio);
        idSubUnit = 0;
    }

    $("#totalQuntity").val(+$("#quntity").val() * +$("#ratio").val());
}

function validationBundel() {

    var result = true;

    if (+$("#itemTypeId").val() <= 0) {
        alertify.error("آیتم را انتخاب کنید").delay(alertify_delay);
        $("#itemTypeId").select2("focus");
        return false;
    }
    if (+$("#itemId").val() <= 0) {
        alertify.error("نوع آیتم را انتخاب کنید").delay(alertify_delay);
        $("#itemId").select2("focus");
        return false;
    }
    if (+$("#itemTypeId").val() == 1 && !$("#attributeIds").prop("disabled") && +$("#attributeIds").val() <= 0 && opr == "Ins") {
        alertify.error("صفت را انتخاب کنید").delay(alertify_delay);
        $("#attributeIds").select2("focus");
        return false;
    }
    if (+$("#subUnitId").val() <= 0 && +$("#itemTypeId").val() == 1) {
        alertify.error("واحد شمارش را انتخاب کنید").delay(alertify_delay);
        $("#subUnitId").select2("focus");
        return false;
    }
    if (+$("#quntity").val() <= 0) {
        alertify.error("تعداد را وارد کنید").delay(alertify_delay);
        $("#quntity").fo;
        return false;
    }

    return result;
}

function saveUpdateRow() {

    let result = validationBundel();
    if (!result) return false;



    let modelDetail = {
        itemTypeId: +$("#itemTypeId").val(),
        itemId: +$("#itemId").val(),
        itemUnitId: +unitId > 0 ? unitId : null,
        itemSubUnitId: +idSubUnit == 0 ? null : (+$("#subUnitId").val() == 0 ? null : +$("#subUnitId").val()),
        attributeIds: $("#attributeIds").val() != "" ? $("#attributeIds").val() : null,
        ratio: +$("#ratio").val(),
        qty: +$("#quntity").val()
    };

    let isSave = true;
    if (+$("#idNumber").val() == 0) {

        for (var i = 0; i < bundleLine.length; i++) {

            let checkRepeat = null;
            if (modelDetail.itemTypeId == 1) {

                checkRepeat = bundleLine.filter(x => x.itemTypeId === modelDetail.itemTypeId &&
                    x.itemId === modelDetail.itemId &&
                    x.itemUnitId === modelDetail.itemUnitId &&
                    x.itemSubUnitId === modelDetail.itemSubUnitId &&
                    x.attributeIds === modelDetail.attributeIds &&
                    x.ratio === modelDetail.ratio)
            }
            else {
                checkRepeat = bundleLine.filter(x => x.itemTypeId === modelDetail.itemTypeId)
            }
            //&& x.itemId === modelDetail.itemId

            if (checkRepeat.length != 0)
                isSave = false;
        }
    }
    if (isSave) {


        bundleLine.push(modelDetail);
        count = bundleLine.length;

        let itemTypeId = $("#itemTypeId option:selected").text();
        let item = $("#itemId option:selected").text();
        let attributeIds = $("#attributeIds option:selected").text();
        let subUnitId = $("#subUnitId option:selected").text();

        let model = {
            id: count,
            itemTypeId: +$("#itemTypeId").val(),
            itemId: +$("#itemId").val(),
            itemSubUnitId: +idSubUnit == 0 ? null : +$("#subUnitId").val(),
            itemType: itemTypeId,
            item: item.split('-')[1],
            itemSubUnit: subUnitId == 0 ? null : subUnitId,
            attribute: attributeIds,
            ratio: +$("#ratio").val(),
            qty: +$("#quntity").val(),
            qtyFinal: +$("#ratio").val() * +$("#quntity").val(),
        };

        bundleLineDetail.push(model);



        if (+$("#idNumber").val() > 0) {
            let id = +$("#idNumber").val();
            $(`#tempBundelList tr#rowItem${id}`).remove();

            bundleLine.splice(id - 1, 1);
            bundleLineDetail.splice(id - 1, 1);
        }


        let idNumber = +$("#idNumber").val() == 0 ? count : +$("#idNumber").val();
        let idNumberReal = +$("#idNumberReal").val() == 0 ? idNumber : +$("#idNumberReal").val();


        let str = "";

        str = `<tr id='rowItem${idNumber}' highlight=${idNumber} onclick="newTrOnclickBundelDetail(${idNumber})" onkeydown="newTrOnkeydownBundelDetail(this,event,${idNumber})" tabindex="-1"
                            data-id="${model.id}"  data-itemtypeid="${model.itemTypeId}"  data-itemid="${model.itemId}"  data-itemname="${model.item}" data-attributeids="${attributeIds}"  
                            data-itemsubunit="${+modelDetail.itemSubUnitId > 0 ? modelDetail.itemSubUnitId : +modelDetail.itemUnitId}"  
                            data-ratio="${model.ratio}" data-qty="${model.qty}" data-qtyfinal="${model.qtyFinal}">`


        str += `<td  style="width:6%">${idNumber}</td>`
        str += `<td  style="width:9%">${itemTypeId}</td>`
        str += `<td  style="width:23%">${item}</td>`
        str += `<td  style="width:22%">${attributeIds}</td>`
        str += `<td  style="width:12%">${subUnitId != null ? subUnitId : ""}</td>`
        str += `<td  style="width:6%">${modelDetail.ratio}</td>`
        str += `<td  style="width:6%">${modelDetail.qty}</td>`
        str += `<td  style="width:6%">${modelDetail.ratio * modelDetail.qty}</td>`


        str += `
                <td style="width:10% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowBundelDetailDelete${count}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteBundelDetail(${idNumber - 1})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editBundelDetail(${idNumber},${idNumberReal},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
        str += `</tr>`

        $("#tempBundelList").append(str);


        restBundelDetail();

    }

    else {
        if (modelDetail.itemTypeId == 2)
            alertify.error("خدمت قبلا ثبت شده است ").delay(alertify_delay);
        else
            alertify.error("آیتم تکراری است در لیست وجود دارد ").delay(alertify_delay);

        $("#itemTypeId").select2("focus");
    }

}

function modal_ready_for_add(modal_name = null) {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;
    $("#rowKeyId").addClass("d-none");
    modal_open_state = 'Add';

    if (modal_name == null)
        modal_name = `AddEditModal`

    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        ele.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    modal_clear_items();
    viewData_modal_title = "افزودن " + viewData_form_title;
    $("#modal_keyid_value").text("");
    $("#modal_keyid_caption").text("");
    modal_show(modal_name);
    opr = "Ins";
    bundleLine = [];
    $("#tempBundelList").html("");

    $("#branchId").attr("disabled", false);
    $("#cashierId").attr("disabled", false);
    $("#type").attr("disabled", false);
    restBundelDetail();
}

function resetInputsRowUnits() {
    restBundelDetail();
}

function restBundelDetail() {
    ratio = 1;
    $("#itemId").empty();
    $("#itemTypeId").attr("disabled", false);
    $("#itemTypeId").val("0").trigger("change").select2("focus");
    $("#attributeIds").val("");
    $("#subUnitId").val("");
    $("#ratio").val("");
    $("#quntity").val("");
    $("#totalQuntity").val("");
    $("#idNumber").val("");
    $("#idNumberReal").val("");

}

function deleteBundelDetail(id) {

    bundleLine.splice(id, 1);

    bundleLineDetail.splice(id, 1);
    let str = "";
    let j = 0
    $("#tempBundelList").html("");
    for (let i = 0; i < bundleLineDetail.length; i++) {

        let itemName = bundleLineDetail[i].itemName;
        str = `<tr  id='rowItem${i + 1}' highlight=${j + 1} onclick="newTrOnclickBundelDetail(${j + 1})" onkeydown="newTrOnkeydownBundelDetail(this,event,${j + 1})" tabindex="-1" 
                            data-id="${bundleLineDetail[i].id}"   data-itemtypeid="${bundleLineDetail[i].itemTypeId}"  data-itemname="${itemName}"  data-itemid="${bundleLineDetail[i].itemId}" data-attributeids="${bundleLineDetail[i].attributeIds}"  
                            data-itemsubunit="${bundleLineDetail[i].itemSubUnitId}"  data-ratio="${bundleLineDetail[i].ratio}" data-qty="${bundleLineDetail[i].qty}" data-qtyfinal="${bundleLineDetail[i].qtyFinal}">`

        str += `<td  style="width:6%">${j + 1}</td>`
        str += `<td  style="width:9%">${bundleLineDetail[i].itemType}</td>`
        str += `<td  style="width:23%">${bundleLineDetail[i].item}</td>`
        str += `<td  style="width:22%">${bundleLineDetail[i].attribute}</td>`
        str += `<td  style="width:12%">${bundleLineDetail[i].itemSubUnit != null ? bundleLineDetail[i].itemSubUnit : ""}</td>`
        str += `<td  style="width:6%">${bundleLineDetail[i].ratio}</td>`
        str += `<td  style="width:6%">${bundleLineDetail[i].qty}</td>`
        str += `<td  style="width:6%">${bundleLineDetail[i].qtyFinal}</td>`


        str += `
                <td style="width:10% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowBundelDetailDelete${bundleLine[i].id}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteBundelDetail(${i})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editBundelDetail(${i + 1},${bundleLine[i].id},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
        str += `</tr>`
        $("#tempBundelList").append(str);
        j++
    }

}

function editBundelDetail(showRow, id, e) {

    e.stopPropagation()


    $("#idNumber").val(showRow);
    $("#idNumberReal").val(id);


    $("#itemTypeId").val($(`#tempBundelList > #rowItem${showRow}`).data("itemtypeid")).trigger("change");

    let itemid = $(`#tempBundelList > #rowItem${showRow}`).data("itemid");


    $("#itemId").empty();
    let itemName = $(`#tempBundelList > #rowItem${showRow}`).data("itemname");
    var itemOption = new Option(`${itemid} - ${itemName}`, itemid, true, true);
    $("#itemId").append(itemOption).trigger('change');




    $("#attributeIds").val($(`#tempBundelList > #rowItem${showRow}`).data("attributeids")).trigger("change");

    $("#subUnitId").attr("disabled", +$("#itemTypeId").val() == 2);

    $("#subUnitId").val($(`#tempBundelList > #rowItem${showRow}`).data("itemsubunit")).trigger("change");

    $("#ratio").val($(`#tempBundelList > #rowItem${showRow}`).data("ratio"));
    $("#quntity").val($(`#tempBundelList > #rowItem${showRow}`).data("qty"));
    $("#totalQuntity").val($(`#tempBundelList > #rowItem${showRow}`).data("qtyfinal"));


    $("#itemTypeId").attr("disabled", true);
    $("#itemId").attr("disabled", false);
    $("#attributeIds").attr("disabled", $("#attributeIds").val() != null ? false : true);

    $("#itemId").select2("focus");


}

function modal_saveBundel(modalName) {

    if (+$("#name").val() == "") {
        alertify.error("نام را انتخاب کنید").delay(alertify_delay);
        $("#name").focus();
        return false;
    }

    if (+$("#cashierId").val() <= 0) {
        alertify.error("صندوق را انتخاب کنید").delay(alertify_delay);
        $("#cashierId").select2("focus");
        return false;
    }
    if (+$("#type").val() <= 0) {
        alertify.error("نوع  را انتخاب کنید").delay(alertify_delay);
        $("#type").select2("focus");
        return false;
    }


    let model = {
        id: opr == "Ins" ? 0 : +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        cashierId: +$("#cashierId").val(),
        branchId: +$("#branchId").val(),
        type: +$("#type").val(),
        isActive: $("#isActiveHeader").prop("checked"),
        bundleLineList: bundleLine
    };

    $.ajax({
        url: viewData_insrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull == true) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                modal_close("AddEditModal");
                get_NewPageTableV1();
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                }


            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_insrecord_url);
            return "";
        }
    });
}


function run_button_edit(id, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    restBundelDetail();
    opr = "Upd";
    bundleLine = [];
    bundleLineDetail = [];
    idSubUnit = 0;
    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(id);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (response) {
            modal_open_state = 'Edit';

            result = response.data
            if (checkResponse(result)) {
                bundleLineDetail = result.bundleLineList;
                fillBundel(result);

                modal_show();
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function fillBundel(data) {

    $("#cashierId").empty();
    $("#branchId").val(data.branchId).trigger("change");
    $("#name").val(data.name);
    $("#cashierId").val(data.cashierId).trigger("change");
    $("#type").val(data.type).trigger("change");
    $("#isActiveHeader").prop("checked", data.isActive).trigger("change");

    $("#branchId").attr("disabled", true);
    $("#cashierId").attr("disabled", true);
    $("#type").attr("disabled", true);


    $("#tempBundelList").html("");
    if (data.bundleLineList.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="9" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tempBundelList").append(emptyStr);
    }
    else {


        let str = "";
        let j = 0
        for (let i = 0; i < data.bundleLineList.length; i++) {

            let model = {
                itemTypeId: data.bundleLineList[i].itemTypeId,
                itemId: data.bundleLineList[i].itemId,
                itemUnitId: +data.bundleLineList[i].itemUnitId > 0 ? +data.bundleLineList[i].itemUnitId : null,
                itemSubUnitId: +data.bundleLineList[i].itemSubUnitId > 0 ? +data.bundleLineList[i].itemSubUnitId : null,
                attributeIds: data.bundleLineList[i].attributeIds,
                ratio: data.bundleLineList[i].ratio,
                qty: data.bundleLineList[i].qty
            };

            bundleLine.push(model);

            let itemName = data.bundleLineList[i].itemName.toString();

            str = `<tr  id='rowItem${i + 1}' highlight=${j + 1} onclick="newTrOnclickBundelDetail(${j + 1})" onkeydown="newTrOnkeydownBundelDetail(this,event,${j + 1})" tabindex="-1" 
                            data-id="${data.bundleLineList[i].id}"   data-itemtypeid="${data.bundleLineList[i].itemTypeId}"  data-itemname="${itemName}"  data-itemid="${data.bundleLineList[i].itemId}"   data-attributeids="${data.bundleLineList[i].attributeIds}"  
                            data-itemsubunit="${+data.bundleLineList[i].itemSubUnitId > 0 ? +data.bundleLineList[i].itemSubUnitId : +data.bundleLineList[i].itemUnitId}"  data-ratio="${data.bundleLineList[i].ratio}" data-qty="${data.bundleLineList[i].qty}" data-qtyfinal="${data.bundleLineList[i].qtyFinal}">`

            str += `<td  style="width:6%">${j + 1}</td>`
            str += `<td  style="width:9%">${data.bundleLineList[i].itemType}</td>`
            str += `<td  style="width:23%">${data.bundleLineList[i].item}</td>`
            str += `<td  style="width:22%">${data.bundleLineList[i].attribute}</td>`
            str += `<td  style="width:12%">${data.bundleLineList[i].itemSubUnit != "" ? data.bundleLineList[i].itemSubUnit : (data.bundleLineList[i].itemUnit != "" ? data.bundleLineList[i].itemUnit : "")}</td>`
            str += `<td  style="width:6%">${data.bundleLineList[i].ratio}</td>`
            str += `<td  style="width:6%">${data.bundleLineList[i].qty}</td>`
            str += `<td  style="width:6%">${data.bundleLineList[i].qtyFinal}</td>`


            str += `
                <td style="width:10% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowBundelDetailDelete${data.bundleLineList[i].id}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteBundelDetail(${i})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editBundelDetail(${i + 1},${data.bundleLineList[i].id},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
            str += `</tr>`
            $("#tempBundelList").append(str);
            j++
        }

    }


    $("#itemId").select2("focus");
}


function newTrOnclickBundelDetail(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#tableLine .highlight`).removeClass("highlight");
    $(`#tableLine tr[highlight=${row}]`).addClass("highlight");
    $(`#tableLine tr[highlight=${row}]`).focus();
}

function newTrOnkeydownBundelDetail(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#tableLine tr[highlight = ${row - 1}]`).length != 0) {
            $(`#tableLine .highlight`).removeClass("highlight");
            $(`#tableLine tr[highlight = ${row - 1}]`).addClass("highlight");
            $(`#tableLine tr[highlight = ${row - 1}]`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#tableLine tr[highlight = ${row + 1}]`).length != 0) {
            $(`#tableLine .highlight`).removeClass("highlight");
            $(`#tableLine tr[highlight = ${row + 1}]`).addClass("highlight");
            $(`#tableLine tr[highlight = ${row + 1}]`).focus();
        }
    }

}

function run_button_delete(p_keyvalue, rowno, elem, ev) {


    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    alertify.confirm('', msg_delete_row,
        function () {

            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(p_keyvalue),
                async: false,
                cache: false,
                success: function (result) {

                    if (result.successfull == true) {

                        get_NewPageTableV1();
                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {

                        if (result.statusMessage !== undefined && result.statusMessage !== null) {
                            var msg = alertify.error(result.statusMessage);
                            msg.delay(alertify_delay);
                        }

                    }
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });


}

bundle_init();


