var viewData_controllername = "FavoritePrescriptionApi",
    viewData_get_drugusagedropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/drugusagedropdown`,
    viewData_get_druginstructiondropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/druginstructiondropdown`,
    viewData_get_serviceId = `${viewData_baseUrl_MC}/PrescriptionTaminApi/getservicedropdownbytype`,
    viewData_get_plandropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/plandropdown`,
    viewData_get_illnessdropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/illnessdropdown`,
    viewData_get_organparentdropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/organparentdropdown`,
    viewData_get_organdropdown = `${viewData_baseUrl_MC}/PrescriptionTaminApi/organdropdown`,
    closedModel = true,
    currentEditId = 0,
    opr = "Ins",
    pageName = null,
    pageTableModel = {};


var currentTab = {
    id: 1,
    lastCurrentId: 0,
    rowNumber: 0
}

//1
var pgt_drugfavorite = {
    pagetable_id: "pagetable_p_1",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_drugfavorite);

//2
var pgt_azmayeshghahfavorite = {
    pagetable_id: "pagetable_p_2",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_azmayeshghahfavorite);

//3
var pgt_radiohfavorite = {
    pagetable_id: "pagetable_p_3",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_radiohfavorite);

//4
var pgt_sonofavorite = {
    pagetable_id: "pagetable_p_4",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_sonofavorite);

//5
var pgt_citihfavorite = {
    pagetable_id: "pagetable_p_5",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_citihfavorite);

//6
var pgt_mrifavorite = {
    pagetable_id: "pagetable_p_6",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_mrifavorite);

//7
var pgt_hastaeifavorite = {
    pagetable_id: "pagetable_p_7",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_hastaeifavorite);

//13
var pgt_phiziyofavorite = {
    pagetable_id: "pagetable_p_13",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_phiziyofavorite);

//14
var pgt_sanjeshfavorite = {
    pagetable_id: "pagetable_p_14",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_sanjeshfavorite);

//17
var pgt_khedmatfavorite = {
    pagetable_id: "pagetable_p_17",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_khedmatfavorite);

//12
var pgt_erjatfavorite = {
    pagetable_id: "pagetable_p_12",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    selectedItems: [],
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
}
arr_pagetables.push(pgt_erjatfavorite);


async function initFormFavorite() {

    $("#isBrFavorite").prop("checked", true).trigger("change");

    await bindElementFavorite();
}

async function bindElementFavorite() {

    await fill_select2(viewData_get_plandropdown, "planFavorite", true);
    await fill_select2(viewData_get_illnessdropdown, "illnessFavorite", true);
    await fill_select2(viewData_get_organparentdropdown, "parentOrganIdFavorite", true);
    await fill_select2(viewData_get_drugamountdropdown, "drugAmountFavorite", true);
    await fill_select2(viewData_get_drugusagedropdown, "drugUsageFavorite", true);
    await fill_select2(viewData_get_druginstructiondropdown, "drugInstructionFavorite", true);

    //Reference version , viewData_get_serviceId
    await fill_select2FavoriteTamin(17, "serviceIdFavorite_12", false, taminPrescriptionTypes.sideways.id, false, true);
    //Side services , viewData_get_serviceId
    await fill_select2FavoriteTamin(17, "serviceIdFavorite_17", false, taminPrescriptionTypes.sideways.id, false, true);
    //labratory service  viewData_get_serviceId   
    await fill_select2FavoriteTamin(19, "serviceIdFavorite_2", false, taminPrescriptionTypes.lab.id, false, true);
    //Radiology service  viewData_get_serviceId
    await fill_select2FavoriteTamin(20, "serviceIdFavorite_3", false, taminPrescriptionTypes.radio.id, false, true);
    //CT scan service  viewData_get_serviceId
    await fill_select2FavoriteTamin(21, "serviceIdFavorite_5", false, taminPrescriptionTypes.ctScan.id, false, true);
    //MRI service viewData_get_serviceId
    await fill_select2FavoriteTamin(22, "serviceIdFavorite_6", false, taminPrescriptionTypes.mRI.id, false, true);
    //Sonography service viewData_get_serviceId
    await fill_select2FavoriteTamin(23, "serviceIdFavorite_4", false, taminPrescriptionTypes.sono.id, false, true);
    //physiotherapy service viewData_get_serviceId
    await fill_select2FavoriteTamin(24, "serviceIdFavorite_13", false, taminPrescriptionTypes.physiotherapy.id, false, true);
    //nuclear medicine service  viewData_get_serviceId
    await fill_select2FavoriteTamin(29, "serviceIdFavorite_7", false, taminPrescriptionTypes.nuclear.id, false, true);
    //Bone Densitometry service viewData_get_serviceId
    await fill_select2FavoriteTamin(30, "serviceIdFavorite_14", false, taminPrescriptionTypes.densitometry.id, false, true);
}

function fill_select2FavoriteTamin(favoriteCategory, elementid, idandtitle = false, serviceType = "", isGeneric = false, isAjax = false, p_minimumInputLength = 3, placeholder = " انتخاب ") {


    var query = {};

    $(`#${elementid}`).empty()

    if (isAjax) {
        $(`#${elementid}`).select2({
            placeholder: placeholder,
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            minimumInputLength: p_minimumInputLength,
            closeOnSelect: true,
            selectOnClose: true,
            allowClear: true,
            ajax: {
                delay: 500,
                url: `${viewData_baseUrl_MC}/PrescriptionTaminApi/getservicedropdownbytype/1/0`,
                async: false,
                data: function (params) {
                    var query = {
                        id: admissionAttenderId,
                        favoriteCategory: favoriteCategory,
                        term: params.term,
                        serviceType,
                        isGeneric
                    }
                    return JSON.stringify(query);
                },
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                quietMillis: select2_delay,
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.name,
                                id: item.id
                            }
                        })
                    };
                }
            }
        });
    }

}

function changeCheckBoxFavoriteTamin(elm) {

    let checked = $(elm).prop("checked");

    if (checked) {
        $("#serviceIdFavorite_1").attr("favoritecategory", "13")
        $("#Titlefavorite_1").text("برند");
    }
    else {
        $("#serviceIdFavorite_1").attr("favoritecategory", "12")
        $("#Titlefavorite_1").text("ژنریک");
    }

    $("#serviceIdFavorite_1").html("")

    fill_select2FavoriteTamin(13, "serviceIdFavorite_1", true, taminPrescriptionTypes.drug.id, checked, true)

    funkyradio_onchange(elm);
}

function saveFavoriteTamin(type) {

    let attenderIdFavoriteTamin = +$("#attenderIdFavoriteTamin").val();
    if (attenderIdFavoriteTamin == 0) {
        alertify.warning("داکتر را انتخاب کنید").delay(alertify_delay);
        $("#attenderIdFavoriteTamin").focus()
    }

    else {

        let form = $(`#fromFavorite_${type}`).parsley();
        let validate = form.validate();

        validateSelect2(form);
        if (!validate) return;


        let model = {
            id: currentEditId > 0 ? currentEditId : null,
            attenderId: attenderIdFavoriteTamin,
            taminServicePrescriptionId: null,
            taminPrescriptionTypeId: type,
            codeTypeId: false,
            quantity: +$(`#quantityFavorite_${type}`).val(),
            taminDrugInstructionId: null,
            taminDrugAmountId: null,
            taminDrugUsageId: null,
            repeat: null,
            taminParentOrganId: null,
            taminOrganId: null,
            taminIllnessId: null,
            taminPlanId: null
        };


        switch (+type) {
            case 1:
                model.taminServicePrescriptionId = +$(`#serviceIdFavorite_${type}`).val();
                model.codeTypeId = $("#isBrFavorite").prop("checked");
                model.taminDrugInstructionId = +$("#drugInstructionFavorite").val();
                model.taminDrugAmountId = +$("#drugAmountFavorite").val();
                model.taminDrugUsageId = +$("#drugUsageFavorite").val();
                model.repeat = +$("#repeatFavorite").val();
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 12:
            case 17:
            case 14:
                model.taminServicePrescriptionId = +$(`#serviceIdFavorite_${type}`).val();
                break;
            case 13:
                model.taminServicePrescriptionId = +$(`#serviceIdFavorite_${type}`).val();
                model.taminParentOrganId = +$("#parentOrganIdFavorite").val();
                model.taminOrganId = +$("#organIdFavorite").val();
                model.taminPlanId = +$("#planFavorite").val();
                model.taminIllnessId = +$("#illnessFavorite").val();
                break;

            default:
                break;
        }

        let url = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/savefavorite`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {
                    getpageFavorite(model.attenderId, type, null);
                    resetFavoriteForm(type);
                }
                else {
                    var msg1 = alertify.error(result.validationErrors[0]);
                    msg1.delay(admission.delay);
                }
            },

            error: function (xhr) {
                error_handler(xhr, url);
                return {
                    status: -100,
                    statusMessage: "عملیات با خطا مواجه شد",
                    successfull: false
                };
            }
        });

    }
}

function resetFavoriteForm(type) {

    $(`#favoritembox_${type} .select2`).val("").trigger("change");
    $(`#favoritembox_${type} .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_${type} input.form-control`).val("");

    if (type == 1)
        $("#isBrFavorite").prop("checked", true).trigger("change");

    focusfavoriteFirstBoxAfterAction(type);
    currentEditId = 0;
    opr = "Ins";
}

function focusfavoriteFirstBoxAfterAction(type) {

    let firstInput = $(`#favoritembox_${type}`).find("[tabindex]:not(:disabled)").first();

    setTimeout(() => {
        if ($(firstInput).hasClass("select2"))
            $(`#${firstInput.attr("id")}`).next().find('.select2-selection').focus();
        else
            firstInput.focus();
    }, 50);
};

$("#attenderIdFavoriteTamin").on("change", function () {
    let attenderId = +$("#attenderIdFavoriteTamin").val();
    resetFavoriteForm(currentTab.id);
    getpageFavorite(attenderId, currentTab.id, null);

})

$("#parentOrganIdFavorite").on("change", function () {

    $("#organIdFavorite").html(`<option value="0">انتخاب کنید</option>`).trigger("change")
    if (+$(this).val() !== 0)
        fill_select2(viewData_get_organdropdown, "organIdFavorite", false, +$(this).val());

    if (document.getElementById('organIdFavorite').options.length > 1) {
        $("#organIdFavorite").prop("required", true)
        $("#organIdFavorite").attr("data-parsley-selectvalzero", "");
    }
    else {
        $("#organIdFavorite").prop("required", false)
        $("#organIdFavorite").removeAttr("data-parsley-selectvalzero");
    }
});

function getpageFavorite(attenderId, type, ids) {

    let pagetable_id = `pagetable_p_${type}`;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    pagetable_formkeyvalue = [attenderId, type, ids];

    arr_pagetables[index].editable = false;
    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].endData = false;
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].pagetablefilter = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";
    arr_pagetables[index].lastPageloaded = 0;
    arr_pagetables[index].selectedItems = [];

    get_NewPageTableV1(pagetable_id, false);


}

function changeTabByClick(id) {

    currentTab.id = id;


    pageName = `pagetable_p_${id}`;
    pageTableModel.pagetable_id = pageName;

    pagetable_formkeyvalue = [+$("#attenderIdFavoriteTamin").val(), id, null];

    let index = arr_pagetables.findIndex(v => v.pagetable_id == `pagetable_p_${id}`);

    if (arr_pagetables.findIndex(a => a.pagetable_id == `pagetable_p_${id}`) < 0) {
        pageTableModel = {
            pagetable_id: `pagetable_p_${id}`,
            editable: false,
            pagerowscount: 15,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            selectedItems: [],
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            endData: false,
            filteritem: "",
            filtervalue: "",
            getpagetable_url: `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`,
        };

        arr_pagetables.push(pageTableModel);
    }

    else {
        arr_pagetables[index].pagetable_id = `pagetable_p_${id}`
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].endData = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`
    }

    get_NewPageTableV1(pageName, false, () => focusfavoriteFirstBoxAfterAction(currentTab.id));

}

function run_button_editfavoritetamin(id, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    currentEditId = id;
    opr = "Upd";
    let url = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getrecordfavoritebyid`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (response) {

            result = response.data
            if (checkResponse(result))
                fillEditfavoritetamin(result);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function fillEditfavoritetamin(result) {

    focusfavoriteFirstBoxAfterAction(currentTab.id);

    switch (currentTab.id) {
        case 1:

            $("#isBrFavorite").prop("checked", result.codeTypeId).trigger("change");
            $("#drugInstructionFavorite").val(+result.taminDrugInstructionId).trigger("change");
            $("#drugAmountFavorite").val(+result.taminDrugAmountId).trigger("change");
            $("#drugUsageFavorite").val(+result.taminDrugUsageId).trigger("change");
            $("#repeatFavorite").val(+result.repeat);
            break;

        case 13:
            $("#parentOrganIdFavorite").val(+result.taminParentOrganId).trigger("change");
            $("#organIdFavorite").val(+result.taminOrganId).trigger("change");
            $("#planFavorite").val(+result.taminPlanId).trigger("change");
            $("#illnessFavorite").val(+result.taminIllnessId).trigger("change");
            break;


    }

    $(`#quantityFavorite_${currentTab.id}`).val(+result.quantity);

    $(`#serviceIdFavorite_${currentTab.id}`).val(+result.taminServicePrescriptionId);

    var serviceIdFavoriteOption = new Option(`${result.serviceName}-${result.serviceCode}/${+result.taminServicePrescriptionId}`, +result.taminServicePrescriptionId, true, true);

    $(`#serviceIdFavorite_${currentTab.id}`).append(serviceIdFavoriteOption).trigger('change');
    serviceIdFavoriteOption = "";
}

function run_button_deletefavoritetamin(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    let url = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/deletefavoriteid`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull == true) {

                var pagetableid = `pagetable_p_${currentTab.id}`;

                get_NewPageTableV1(pagetableid, false, () => focusfavoriteFirstBoxAfterAction(currentTab.id));
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
            error_handler(xhr, url)
        }
    });
}

function itemChange(elem) {

    if (elem.length < 1) return;
    let rowCount = $(elem).parents(".card-body tbody").find("tr").length,
        pagetable_id = `pagetable_p_${currentTab.id}`,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id),
        selectedItems = typeof arr_pagetables[index].selectedItems == "undefined" ? [] : arr_pagetables[index].selectedItems,
        isSelected = $(elem).prop("checked"),
        primaryData = $(elem).parents("tr").data();

    if (isSelected) {
        var checks = $(`#${pagetable_id} .selectedItem-checkbox input[type='checkbox']`),
            checksL = checks.length,
            count = 0;
        for (var i = 0; i < checksL; i++) {
            var v = checks[i];
            if ($(v).prop("checked") == true)
                count += 1;
        }

        if (count >= rowCount) {
            var pagetable = $(`#${pagetable_id}`);
            $(pagetable).find(".selectedItem-checkbox-all").prop("checked", true);
        }
        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        selectedItems.push(JSON.parse(item));

    }
    else {

        // var pagetable = $(elem).parents(".card-body");
        var pagetable = $(`#${pagetable_id}`);
        $(`#${pagetable_id}`).find(".selectedItem-checkbox-all").prop("checked", false);
        var validCount = 0,
            primaryCount = 0,
            selectedItemsL = selectedItems.length;

        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        primaryData = JSON.parse(item)

        for (var k = 0; k < selectedItemsL; k++) {
            var v = selectedItems[k];
            $.each(v, function (key, val) {
                primaryCount += 1;

                if (primaryData[key].toString() == val.toString())
                    validCount += 1;

            })
            if (validCount == primaryCount) {
                selectedItems = jQuery.grep(selectedItems, function (value) {
                    return value != v;
                });
            }
            primaryCount = 0;
            validCount = 0;
        }
    }

    arr_pagetables[index].selectedItems = selectedItems;
}

function addPrescriptionFavoriteLines(type) {

    let pagetable_id = `pagetable_p_${type}`,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id),
        selectedItems = typeof arr_pagetables[index].selectedItems == "undefined" ? [] : arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {


        let ids = [];

        for (var i = 0; i < selectedItems.length; i++) {
            ids.push(selectedItems[i].id);
        }


        pagetable_formkeyvalue = [+$("#attenderIdFavoriteTamin").val(), type, ids.join(",")];

        let model = null;
        model = {
            Form_KeyValue: pagetable_formkeyvalue,
        }



        let url = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getpagefavorite`;

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            cache: false,
            success: function (result) {
                bindappendLine(result.data, type);
                if (closedModel)
                    modal_close("favoriteTaminModals");

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
    else {
        var msg_temp = alertify.warning("آیتمی از لیست انتخاب نشده است");
        msg_temp.delay(prMsg.delay);
    }
}

function bindappendLine(data, type) {

    if (data.length > 0) {

        let rowNumber = currentTab.rowNumber;

        let arr = [];
        let arrlist = {};
        var repeatListArr = [];
        for (var i = 0; i < data.length; i++) {
            switch (type) {

                case 1:
                    arr = arrayLines.filter(x => +x.serviceTypeId == +type &&
                        +x.quantity == +data[i].quantity &&
                        +x.serviceId == +data[i].taminServicePrescriptionId &&
                        +x.drugAmountId == +data[i].taminDrugAmountId &&
                        +x.repeat == +data[i].repeat &&
                        +x.drugInstructionId == +data[i].taminDrugInstructionId &&
                        +x.drugUsageId == +data[i].taminDrugUsageId);

                    if (arr.length > 0) {
                        arrlist = {
                            id: +data[i].id,
                            serviceId: +data[i].taminServicePrescriptionId,
                            serviceName: data[i].serviceName
                        }

                        repeatListArr.push(arrlist);
                        closedModel = false;
                    }


                    break;

                case 13:
                    arr = arrayLines.filter(x => +x.serviceTypeId == +type &&
                        +x.quantity == +data[i].quantity &&
                        +x.serviceId == +data[i].taminServicePrescriptionId &&
                        +x.parentOrganId == +data[i].taminParentOrganId &&
                        +x.organId == +data[i].taminOrganId &&
                        +x.planId == +data[i].taminPlanId &&
                        +x.illnessId == +data[i].taminIllnessId);

                    if (arr.length > 0) {
                        arrlist = {
                            id: +data[i].id,
                            serviceId: +data[i].taminServicePrescriptionId,
                            serviceName: data[i].serviceName
                        }

                        repeatListArr.push(arrlist);
                        closedModel = false;
                    }

                    break;

                default:
                    arr = arrayLines.filter(x => +x.serviceTypeId == +type &&
                        +x.quantity == +data[i].quantity &&
                        +x.serviceId == +data[i].taminServicePrescriptionId);

                    if (arr.length > 0) {
                        arrlist = {
                            id: +data[i].id,
                            serviceId: +data[i].taminServicePrescriptionId,
                            serviceName: data[i].serviceName
                        }

                        repeatListArr.push(arrlist);
                        closedModel = false;
                    }

                    break;
            }
        }
        if (repeatListArr.length == 0) {
            closedModel = true;

            for (var i = 0; i < data.length; i++) {
                rowNumber = rowNumber == 0 ? 1 : rowNumber + 1;
                let model = {
                    id: 0,
                    indexRow: rowNumber,
                    rowNumber: rowNumber,
                    prescriptionId: $("#prescriptionTaminId").val() != "null" ? +$("#prescriptionTaminId").val() : 0,
                    quantity: data[i].quantity,
                    serviceTypeId: type,
                    noteDetailsEprscId: null,
                    sendResult: null,
                    sendDateTime: null
                };

                switch (+type) {
                    case 1:
                        model.serviceId = +data[i].taminServicePrescriptionId;
                        model.serviceName = data[i].serviceName;
                        model.isBr = data[i].codeTypeId;
                        model.drugAmountId = data[i].taminDrugAmountId;
                        model.drugAmountName = data[i].taminDrugAmountName;
                        model.repeat = data[i].repeat;
                        model.doDatePersian = data[i].effectiveDatePersian;
                        model.drugInstructionId = data[i].taminDrugInstructionId;
                        model.drugInstructionName = data[i].taminDrugInstructionName;
                        model.drugUsageId = data[i].taminDrugUsageId;
                        model.drugUsageName = data[i].taminDrugUsageName;
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 12:
                    case 14:
                    case 17:
                        model.serviceId = +data[i].taminServicePrescriptionId;
                        model.serviceName = data[i].serviceName;
                        model.quantity = data[i].quantity;
                        break;
                    case 13:
                        model.serviceId = +data[i].taminServicePrescriptionId;
                        model.serviceName = data[i].serviceName;
                        model.quantity = data[i].quantity;
                        model.parentOrganId = data[i].taminParentOrganId;
                        model.parentOrganName = data[i].taminParentOrganName;
                        model.organId = data[i].taminOrganId;
                        model.organName = data[i].taminOrganName;
                        model.planId = data[i].taminPlanId;
                        model.planName = data[i].taminPlanName;
                        model.illnessId = data[i].taminIllnessId;
                        model.illnessName = data[i].taminIllnessName;
                        break;

                }


                if (+type == 6) {
                    $(`[href="#box_12"]`).click();
                }
                else {
                    $(`[href="#box_${type}"]`).click();
                }
                appendLines(model, type, "INS");
            }
        }

        else
            showRepeatList(repeatListArr)
    }



}


function showRepeatList(arr) {
    let output = "";

    for (var i = 0; i < arr.length; i++) {
        output += `<tr><td>${arr[i].id}</td><td >${arr[i].serviceId + '-' + arr[i].serviceName}</td></tr>`;
    }

    $(`#tempRepeatList`).html(output);
    modal_show("errorRepeatList");

}

$("#favoriteTaminModals").on("hidden.bs.modal", function () {

    $(`#favoritembox_1 .select2`).val("").trigger("change");
    //$(`#favoritembox_1 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_1 input.form-control`).val("");

    $(`#favoritembox_2 .select2`).val("").trigger("change");
    $(`#favoritembox_2 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_2 input.form-control`).val("");

    $(`#favoritembox_3 .select2`).val("").trigger("change");
    $(`#favoritembox_3 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_3 input.form-control`).val("");


    $(`#favoritembox_4 .select2`).val("").trigger("change");
    $(`#favoritembox_4 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_4 input.form-control`).val("");

    $(`#favoritembox_5 .select2`).val("").trigger("change");
    $(`#favoritembox_5 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_5 input.form-control`).val("");

    $(`#favoritembox_6 .select2`).val("").trigger("change");
    $(`#favoritembox_6 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_6 input.form-control`).val("");

    $(`#favoritembox_7 .select2`).val("").trigger("change");
    $(`#favoritembox_7 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_7 input.form-control`).val("");

    $(`#favoritembox_12 .select2`).val("").trigger("change");
    $(`#favoritembox_12 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_12 input.form-control`).val("");

    $(`#favoritembox_13 .select2`).val("").trigger("change");
    $(`#favoritembox_13 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_13 input.form-control`).val("");

    $(`#favoritembox_14 .select2`).val("").trigger("change");
    $(`#favoritembox_14 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_14 input.form-control`).val("");

    $(`#favoritembox_17 .select2`).val("").trigger("change");
    $(`#favoritembox_17 .funkyradio input:checkbox`).prop("checked", false).trigger("change");
    $(`#favoritembox_17 input.form-control`).val("");

    //setTimeout(() => {
    //    $("#isBrFavorite").prop("checked", true).trigger("change");

    //}, 20);

    $(`#favoriteLink${currentTab.id}`).removeClass("active");
    $(`#favoritembox_${currentTab.id}`).removeClass("active");

    currentEditId = 0;
    opr = "Ins";
    pagetable_formkeyvalue = [];
})


$("#favoriteTaminModals").on("shown.bs.modal", function () {
    initFormFavorite();
});