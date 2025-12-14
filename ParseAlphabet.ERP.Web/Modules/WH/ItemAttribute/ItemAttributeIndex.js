
var viewData_form_title = "صفات کالاو خدمات";
var viewData_controllername = "ItemAttributeApi";
var viewData_getrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`;
var viewData_inssubunitrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insertsubitem`;
var viewData_updrecord_url = `${viewData_baseUrl_WH}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}ItemAttribute.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 };
var viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
var itemList = []


function inteAttributeIndex() {

    $("#stimul_preview")[0].onclick = null;

    $("#readyforadd").remove()

    get_NewPageTableV1();
}

function run_button_AttributeTypeSimple(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD")
    if (!check)
        return;



    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
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

    listOfItemsThead()

    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecordbyid_itemattributeline`
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function modal_fill_items(item, modal_name = null,) {
    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    if (checkResponse(item.itemAttributeLineList))
        itemList = item.itemAttributeLineList
    else
        itemList = []

    listOfItems(true);
}

function saveUpdateRow(elm) {
    
    let idNumber = +$("#idNumber").val()
    let name = $("#name").val()
    let nameId = $("#name option:selected").text()
    let isActive = $("#isActiveTable").prop("checked")
    let itemAttributeId = $("#modal_keyid_value").text();
    let model = []
    if (itemAttributeId == 1 || itemAttributeId == 2 || itemAttributeId == 5 || itemAttributeId == 7) {
        if (!checkResponse(name) || name == "") {
            var msgItem = alertify.warning("نام را وارد کنید");
            msgItem.delay(alertify_delay);
            $("#name").focus()
            return
        }

        model = {
            id: idNumber,
            itemAttributeId: +$("#modal_keyid_value").text(),
            name,
            isActive
        }

    } else if (itemAttributeId == 6) {
        if (!checkResponse(name) || name == 0) {
            var msgItem = alertify.warning("نام را وارد کنید");
            msgItem.delay(alertify_delay);
            $("#name").focus()
            return
        }
        model = {
            id: idNumber == "" ? 0 : idNumber,
            itemAttributeId: +$("#modal_keyid_value").text(),
            name,
            isActive
        }
    } else {
        if (!checkResponse(name) || name == "") {
            var msgItem = alertify.warning("نام را وارد کنید");
            msgItem.delay(alertify_delay);
            $("#name").focus()
            return
        } else {
            let val = name.replace("/", ".")
            let regex = /^\d+(\.\d{1,3})?$/
            if (!regex.test(val)) {
                var msgItem = alertify.warning('نام را به صورت صحیح وارد کنید');
                msgItem.delay(alertify_delay);
                $("#name").focus()
                return
            }
        }
        model = {
            id: idNumber == "" ? 0 : +idNumber,
            itemAttributeId: +$("#modal_keyid_value").text(),
            name: name.replace("/", "."),
            isActive
        }
    }

    if (checkResponse(idNumber) && idNumber == "") {

        let viewData_insertsubitem = `${viewData_baseUrl_WH}/${viewData_controllername}/insertitemattributeline`

        $.ajax({
            url: viewData_insertsubitem,
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
                    model.id = result.id
                    itemList.push(model)
                    $("#tableLine tbody").empty()
                    listOfItems()
                    //resetInputsRow()
                } else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);

                    if ($("#name").hasClass("select2"))
                        $("#name").select2("focus")
                    else
                        $("#name").focus()

                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_insertsubitem)
            }
        });
    } else {

        let viewData_updatesubitem = `${viewData_baseUrl_WH}/${viewData_controllername}/updateitemattributeline`

        $.ajax({
            url: viewData_updatesubitem,
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
                    for (let i = 0; i < itemList.length; i++) {
                        if (itemList[i].id == idNumber) {
                            itemList[i].name = model.name
                            itemList[i].isActive = model.isActive
                            if (itemAttributeId == 6) {
                                itemList[i].nameId = nameId.split("-")[1]
                            }
                        }
                    }
                    $("#tableLine tbody").empty()
                    listOfItems()
                    //resetInputsRow()
                } else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);

                    if ($("#name").hasClass("select2"))
                        $("#name").select2("focus")
                    else
                        $("#name").focus()
                }
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updatesubitem)
            }
        });
    }
}

function listOfItems(onShowModal = false) {


    listOfItemsTbody()

    resetInputsRow(onShowModal);
}

function listOfItemsThead() {
 
    let p_keyvalue = $("#modal_keyid_value").text();

    $("#tableLine #tableLineThead").html(`<tr>
                                            <th style="width:10%">سطر</th>
                                            <th style="width:32%">نام</th>
                                            <th style="width:23%">وضعیت</th>
                                            <th style="width:14%">عملیات</th>
                                        </tr>`)

    $("#tableLine #tableLineTheadItems").html(` 
                                         <tr>
                                            <th style="width:10%" disabled>
                                                <input id="idNumber" type="text" class="form-control atoz-valid text-center" maxlength="50" title="" disabled>
                                            </th>
                                            <th style="width:40%">
                                                <div id="selectInputById">
                                                    <input id="name" type="text" class="form-control atoz0t9-dash-underline-valid" title="" maxlength="50" required tabindex="1" />
                                                </div>
                                            </th>
                                            <th style="width:40%">
                                                <div class="form-group" style="margin-bottom:0px">
                                                    <div class="funkyradio funkyradio-success" onkeydown="funkyradio_keydown(event,'isActiveTable');" tabindex="2">
                                                        <input id="isActiveTable" type="checkbox" name="checkbox" onchange="funkyradio_onchange(this)" switch-value="فعال,غیرفعال" />
                                                    </div>
                                                </div>
                                            </th>
                                            <th style="width:10%">
                                                <div style="display:flex;justify-content:center;width:100%">
                                                    <button id="saveRow" type="button" onclick="saveUpdateRow(this)" class="btn blue_outline_1 pa float-sm-right" style="word-break:initial" tabindex="3">
                                                        <i class="fa fa-plus"></i>
                                                    </button>
                                                    <button id="resetInputs" type="button" onclick="resetInputsRow()" class="btn btn-outline-danger pa mr-2 float-sm-right" tabindex="4">
                                                        <i class="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </th>
                                        </tr>
                                    `)

    if (p_keyvalue == 1 || p_keyvalue == 2 || p_keyvalue == 5 || p_keyvalue == 7) {
        $("#selectInputById").html(`<input id="name" type="text" class="form-control atoz0t9-dash-underline-valid" title="" required tabindex="1" maxlength="50" />`)
    }
    else if (p_keyvalue == 6) {
        $("#selectInputById").html(`<select id="name" data-placeholder="انتخاب کنید" class="form-control select2" tabindex="1"></select>`)
        fill_select2("api/WH/ItemAttributeApi/getdropdown_sex", "name");
    }
    else {
        $("#selectInputById").html(`<input id="name" type="text" class="form-control decimal mask"  maxlength="9" title="" tabindex="1">`)
        $("#name").inputmask({ 'mask': '9{1,5}/9{1,3}', 'radixPoint': '/' })
    }

    if (p_keyvalue == 9) {
       
        $("#tableLineThead tr th").last().remove()
        $("#tableLineTheadItems tr th").last().remove()
        $("#name").prop("disabled", true)
        $("#isActiveTable").prop("disabled", true)
    }

    changeCheckbox("isActiveTable", true);

}

function changeCheckbox(id, value= true) {
    var elm = $(`#${id}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (value == true) {
        elm.prop("checked", true);
        elm.nextAll().remove();
        elm.after(`<label class="border-thin" for="${elm.attr("id")}">${switchValue[0]}</label>`);
        elm.trigger("change");
    } else {
        elm.prop("checked", false);
        elm.nextAll().remove();
        elm.after(`<label class="border-thin" for="${elm.attr("id")}">${switchValue[1]}</label>`);
        elm.trigger("change");
    }
    elm.blur();
}

function listOfItemsTbody() {

    let p_keyvalue = $("#modal_keyid_value").text();
    $("#tableLine tbody").empty()

    if (itemList.length == 0) {
        let emptyStr = `<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td> </tr>`
        $("#tableLine tbody").append(emptyStr)
    }
    else {
        for (let i = 0; i < itemList.length; i++) {

            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:10%;text-align:center">${itemList[i].id}</td>`

            if (p_keyvalue == 1 || p_keyvalue == 2 || p_keyvalue == 5 || p_keyvalue == 7)
                str += `<td style="width:40%">${itemList[i].name}</td>`

            else if (p_keyvalue == 6)
                str += `<td style="width:40%">${itemList[i].name}</td>`

            else
                str += `<td style="width:40%">${itemList[i].name.replace(".", "/")}</td>`


            if (itemList[i].isActive)
                str += `<td style="width:40% ;text-align:center"><i class="fas fa-check"></i></td>`
            else
                str += `<td style="width:40%; text-align:center"></td>`


            str += `
                    <td style="width:10% text-align="center">
                       <div style="display:flex;justify-content :center">
                            <button id='rowItemDelete${itemList[i].id}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine('AddEditModal',this,${i + 1},'${itemList[i].id}','${itemList[i].name}',${itemList[i].isActive},event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                            <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine('AddEditModal',this,${i + 1},'${itemList[i].id}','${itemList[i].name}',${itemList[i].isActive},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                       </div>
                    </td>
                `;

            str += `</tr>`;

            $("#tableLine tbody").append(str)
        }

        if (p_keyvalue == 9) {
            $("#tableLine tbody tr td").last().remove()
        }

        $(`#AddEditModal tbody #rowItem1`).addClass("highlight");
    }
}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#AddEditModal .highlight`).removeClass("highlight");
    $(`#AddEditModal #rowItem${row}`).addClass("highlight");
    $(`#AddEditModal #rowItem${row}`).focus();
}

function newTrOnkeydown(elm, ev, row) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row - 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).focus();
        }

    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row + 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).focus();
        }
    }

}

function deleteLine(modal_name, elm, row, id, name, isActive, e) {

    e.preventDefault()
    e.stopPropagation()
    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/deleteitemattributeline`

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
                itemList.splice(row - 1, 1)
                $("#tableLine tbody").empty()
                listOfItems()
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function editLine(modal_name, elm, row, id, name, isActive, e) {
    e.preventDefault()
    e.stopPropagation()

    getAttributeLineRecord(id, row);

}

function resetInputsRow(onShowModal = false) {

    let p_keyvalue = $("#modal_keyid_value").text();

    setDefaultActiveCheckbox($("#isActiveTable"));

    $("#idNumber").val("")

    if (p_keyvalue == 1 || p_keyvalue == 2 || p_keyvalue == 5 || p_keyvalue == 7)
        $("#name").val("").focus()
    else if (p_keyvalue == 3 || p_keyvalue == 4) {

        if (onShowModal)
            $("#name").val("")
        else
            $("#name").val("").focus()
    }
    else
        $("#name").prop('selectedIndex', 0).trigger("change");
}

function resetItems() {
    itemList = []
    listOfItems()
}

function setDefaultActiveCheckbox(elm) {
    var switchValue = $(elm).attr("switch-value").split(',');
    if (!$(elm).prop("checked")) {
        $(elm).prop("checked", true);
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio1).text(switchValue[0]);
    }
}

function getAttributeLineRecord(id, row) {

    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/getrecorditemattributeline`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            if (checkResponse(result)) {
                
                let p_keyvalue = +$("#modal_keyid_value").text();

                $("#isActiveTable").prop("checked", result.isActive)

                $("#idNumber").val(result.id);

                if (p_keyvalue == 1 || p_keyvalue == 2 || p_keyvalue == 5 || p_keyvalue == 7)
                    $("#name").val(result.name).focus()
                else if (p_keyvalue == 6)
                    $("#name").val(result.name).trigger("change").focus()
                else
                    $("#name").val(result.name.replace(".", "/")).focus()

                $(`#AddEditModal tbody tr`).removeClass("highlight");
                $(`#AddEditModal tbody #rowItem${row}`).addClass("highlight");
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

$("#stimul_preview").click(function () {
    var pagetable_id = "pagetable";

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");

    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    p_id = ""
    p_value = ""
    p_type = ""
    p_size = ""

    var p_url = viewData_print_file_url;
    var p_isPageTable = true;
    var p_tableName = "";
    var p_keyValue = 0
    var secondLang = false;
    window.open(`${viewData_print_url1}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    resetItems()
});

inteAttributeIndex()