var viewData_form_title = "لیست ارتباط با حسابداری",
    viewData_add_form_title = "ارتباط با حسابداری",
    viewData_controllername = "PostingGroupApi",
    modal_open_state = "Add",
    viewData_pagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_pagetableline_url = `${viewData_baseUrl_FM}/${viewData_controllername}/linegetpage`,
    viewData_subject_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemstreasurysubject`,
    viewData_bankAccount_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemsbankaccount`,
    viewData_cash_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemscashier`,
    viewData_admission_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemsadmission`,
    viewData_personOrder_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemswarehouse`,
    viewData_treasury_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritemstreasury`,
    viewData_saverecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/save`,
    viewData_saveLinerecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/saveline`,
    viewData_getHeaderList_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getheaderdetaillist`,
    viewData_getHeaderList_filterurl = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterheaderlist`,
    viewData_getDetailList_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getdetaillist`,
    viewData_getDetailList_filterurl = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterdetaillist`,
    viewData_getDetailList_filterurlSale = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterdetaillistforordersale`,
    viewData_getDetailAdmList_filterurl = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterdetailadmlist`,
    viewData_getDetailListForOrderSale_filterurl = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterdetaillistforordersale`,
    typeId = 1, tabNo = 1, postingGroupModalTitle = "خزانه", linePagetable = {}, postingGroupHeaderId = 0, postingGroupLineId = 0, headerId = 0,
    currentLHRow = 0, stagId = 0, identityRow = 0, branchid = 0, lineId = 0, isgetrecordAfterSaveRow = false;

var subjectPagetable = {
    pagetable_id: "subject_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_pagetable_url,
    getfilter_url: viewData_subject_filter_url,
    tabId: 1,
};
arr_pagetables.push(subjectPagetable);

var bankAccountPagetable = {
    pagetable_id: "bankAccount_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_pagetable_url,
    getfilter_url: viewData_bankAccount_filter_url,
    tabId: 2
};
arr_pagetables.push(bankAccountPagetable);

var cashPagetable = {
    pagetable_id: "cash_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_pagetable_url,
    getfilter_url: viewData_cash_filter_url,
    tabId: 3
};
arr_pagetables.push(cashPagetable);

var admissionPagetable = {
    pagetable_id: "admission_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_pagetable_url,
    getfilter_url: viewData_admission_filter_url,
    tabId: 4
};
arr_pagetables.push(admissionPagetable);

var posingGroupHeaderPagetable = {
    pagetable_id: "postingGroupHeaderDetails_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_getHeaderList_url,
    getfilter_url: viewData_getHeaderList_filterurl
};
arr_pagetables.push(posingGroupHeaderPagetable);

var posingGroupLinePagetable = {
    pagetable_id: "postingGroupLineDetails_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_getDetailList_url,
    getfilter_url: viewData_getDetailList_filterurl
};
arr_pagetables.push(posingGroupLinePagetable);

var posingGroupLineAdmPagetable = {
    pagetable_id: "postingGroupLineAdmDetails_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_getDetailList_url,
    getfilter_url: viewData_getDetailAdmList_filterurl
};
arr_pagetables.push(posingGroupLineAdmPagetable);

var postingGroupLineDetailsForOrderSale_pagetable = {
    pagetable_id: "postingGroupLineDetailsForOrderSale_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_getDetailList_filterurlSale,
    getfilter_url: viewData_getDetailListForOrderSale_filterurl
};
arr_pagetables.push(postingGroupLineDetailsForOrderSale_pagetable);

var warehousePagetable = {
    pagetable_id: "warehouse_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    lastPageloaded: 0,
    getpagetable_url: viewData_pagetable_url,
    getfilter_url: viewData_treasury_filter_url,
    tabId: 11
};
arr_pagetables.push(warehousePagetable);

function initPostingGroup() {
    isgetrecordAfterSaveRow = false;
    pagetable_formkeyvalue = [tabNo, 0];

    get_NewPageTable(subjectPagetable.pagetable_id);
}

function run_button_postgroupdetaillist(id, rowno) {//1,6


    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupHeaderModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2">
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
            </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div>
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypress(event, this)" title="" placeholder="عبارت فیلتر">
            <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
        </div>
    `)


    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    postingGroupHeaderId = id;
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    stagId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("stageid");

    currentLHRow = rowno;

    pagetable_id = "postingGroupHeaderDetails_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

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
    arr_pagetables[index].lastPageloaded = 0

    typeId = tabNo;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(/*tabNo == 6 ? headerId :*/ stagId);

    get_NewPageTable(pagetable_id, false, function () {
        viewData_modal_title = postingGroupModalTitle;
        $("#postingGroupFormHeaderTitle").text(viewData_modal_title);

        $(".modal-content #Id").text(headerId);
        if (tabNo == 1) {

            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام مرحله  : <span>${$(`#subject_pagetable #col_${rowno}_5`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2" >نام موضوع  : <span>${$(`#subject_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>`;

            $(".modal-content #content").html(str);
        }

        modal_show(`postingGroupHeaderModals`);
    });
}

function run_button_postgrouplinedetaillistordersale(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(3, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;
    pagetable_id = "postingGroupLineDetailsForOrderSale_pagetable";

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

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
    arr_pagetables[index].lastPageloaded = 0

    typeId = "3_1";

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(3);
    pagetable_formkeyvalue.push(branchid);

    get_NewPageTable(pagetable_id, false, function () {
        viewData_modal_title = postingGroupModalTitle;
        $("#postingGroupFormLineTitle").text(viewData_modal_title);
        $(".modal-content #Id").text(headerId);

        if (tabNo == 2) {
            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
            $(".modal-content #content").html(str);

        }
        else if (tabNo == 3) {
            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
            $(".modal-content #content").html(str);
        }

        modal_show(`postingGroupLineOrderSaleModals`);

    });
}

function run_button_postgrouplinedetaillistorder(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(9, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;

    pagetable_id = "postingGroupLineDetails_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
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
    arr_pagetables[index].lastPageloaded = 0
    arr_pagetables[index].getfilter_url = viewData_getDetailList_filterurl;

    typeId = 9;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);

    get_NewPageTable(pagetable_id, false, function () {
        viewData_modal_title = postingGroupModalTitle;
        $("#postingGroupFormLineTitle").text(viewData_modal_title);
        $(".modal-content #Id").text(headerId);

        if (tabNo == 2) {
            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
            $(".modal-content #content").html(str);

        }
        else if (tabNo == 3) {
            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
            $(".modal-content #content").html(str);
        }

        modal_show(`postingGroupLineModals`);

    });
}

function run_button_postgrouplinedetaillist(id, rowno) { //2,3

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupLinePurchaseBankAcountModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2">
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
            </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div>
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypress(event, this)" title="" placeholder="عبارت فیلتر">
            <a onclick="filtervalue_onsearchclick(this)"><i class="fa fa-search"></i></a>
        </div>
    `)

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "postingGroupLineDetails_pagetableBankAcount");

    if (index == -1) {
        var pgt_postingGroupLineDetailsBankAcount = {
            pagetable_id: "postingGroupLineDetails_pagetableBankAcount",
            editable: false,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            filteritem: "",
            filtervalue: "",
            getpagetable_url: viewData_getDetailList_url,
            getfilter_url: viewData_getDetailList_filterurlSale,
            tabId: 3
        };
        arr_pagetables.push(pgt_postingGroupLineDetailsBankAcount);
    }
    else {
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].endData = false
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""

    }


    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    postingGroupLineId = id;
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;

    typeId = tabNo;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);

    get_NewPageTable("postingGroupLineDetails_pagetableBankAcount");

    viewData_modal_title = postingGroupModalTitle;
    $("#postingGroupFormLineBankAcountTitle").text(viewData_modal_title);
    $(".modal-content #Id").text(headerId);

    if (tabNo == 2) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);

    }
    else if (tabNo == 3) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);
    }

    modal_show(`postingGroupLinePurchaseBankAcountModals`);


}

function run_button_postGroupLineDetailListTreasury(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupLineTreasuryModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2" >
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
                </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div >
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)" title="" placeholder="عبارت فیلتر">
                <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
        </div>
        `)

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "postingGroupLineDetails_pagetableTreasury");

    var pgt_postingGroupLineDetailsTreasury = {
        pagetable_id: "postingGroupLineDetails_pagetableTreasury",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: viewData_getDetailList_url,
        getfilter_url: viewData_getDetailList_filterurl,
        tabId: 3
    };


    if (index != -1) {
        arr_pagetables[index] = pgt_postingGroupLineDetailsTreasury;
    } else {
        arr_pagetables.push(pgt_postingGroupLineDetailsTreasury);
    }

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(tabNo, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;

    typeId = tabNo;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);


    get_NewPageTable(pgt_postingGroupLineDetailsTreasury.pagetable_id);
    viewData_modal_title = postingGroupModalTitle;
    $("#postingGroupFormLineTreasuryTitle").text(viewData_modal_title + " - خزانه");
    $(".modal-content #Id").text(headerId);

    if (tabNo == 2) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);

    }
    else if (tabNo == 3) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);
    }

    modal_show(`postingGroupLineTreasuryModals`);
}

function run_button_postGroupLineDetailListPurchase(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupLinePurchaseModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2" >
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
                </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div >
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)" title="" placeholder="عبارت فیلتر">
                <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
        </div>
        `)

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "postingGroupLineDetails_pagetablePurchase");


    var pgt_postingGroupLineDetailsPurchase = {
        pagetable_id: "postingGroupLineDetails_pagetablePurchase",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: viewData_getDetailList_url,
        getfilter_url: viewData_getDetailList_filterurlSale,
        tabId: 3
    };

    if (index != -1) {
        arr_pagetables[index] = pgt_postingGroupLineDetailsPurchase;
    } else {
        arr_pagetables.push(pgt_postingGroupLineDetailsPurchase);
    }


    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(13, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;

    typeId = 13;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);


    get_NewPageTable(pgt_postingGroupLineDetailsPurchase.pagetable_id);

    viewData_modal_title = postingGroupModalTitle;
    $("#postingGroupFormLinePurchaseTitle").text(viewData_modal_title + " - خرید");
    $(".modal-content #Id").text(headerId);

    if (tabNo == 2) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);

    }
    else if (tabNo == 3) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);
    }

    modal_show(`postingGroupLinePurchaseModals`);
    callbackAfterFilter(pgt_postingGroupLineDetailsPurchase.pagetable_id);

}

function run_button_postGroupLineDetailListWarehouse(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupLineWarehouseModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2" >
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
                </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div >
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)" title="" placeholder="عبارت فیلتر">
                <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
        </div>
        `)
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "postingGroupLineDetails_pagetableWarehouse");


    var pgt_postingGroupLineDetailsWarehouse = {
        pagetable_id: "postingGroupLineDetails_pagetableWarehouse",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: viewData_getDetailList_url,
        getfilter_url: viewData_getDetailList_filterurlSale,
        tabId: 3
    };
    if (index != -1) {
        arr_pagetables[index] = pgt_postingGroupLineDetailsWarehouse;
    } else {
        arr_pagetables.push(pgt_postingGroupLineDetailsWarehouse);
    }

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(15, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;
    typeId = 15;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);


    get_NewPageTable(pgt_postingGroupLineDetailsWarehouse.pagetable_id);
    viewData_modal_title = postingGroupModalTitle;
    $("#postingGroupFormLineWarehouseTitle").text(viewData_modal_title + " - انبار");
    $(".modal-content #Id").text(headerId);


    if (tabNo == 2) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);

    }
    else if (tabNo == 3) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);
    }

    modal_show(`postingGroupLineWarehouseModals`);
    callbackAfterFilter(pgt_postingGroupLineDetailsWarehouse.pagetable_id);

}

function run_button_postGroupLineDetailListSale(id, rowno) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    $("#postingGroupLineOrderSaleModals .filterBox").html(
        `
        <div class="btn-group float-right mb-2" >
            <button type="button" class="btn btn-default btnfilter" data-id="" data-type="8" data-size="0" data-toggle="dropdown">
                مورد فیلتر
                </button>
            <button type="button" id="btnOpenFilter" class="btn btn-secondary dropdown-toggle dropdown-toggle-split btnOpenFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <button type="button" id="btnRemoveFilter" class="btn btn-secondary remove-filter d-none btnRemoveFilter" onclick="removeFilterNew(this)"></button>
            <div class="dropdown-menu min-width-140 filteritems">
            </div>
        </div >
        <div class="form-group mt-0 float-right mb-2 app-search">
            <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)" title="" placeholder="عبارت فیلتر">
                <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
        </div>
        `)

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "postingGroupLineDetailsForOrderSale_pagetable");
    var pgt_postingGroupLineDetailsPurchase = {
        pagetable_id: "postingGroupLineDetailsForOrderSale_pagetable",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: viewData_getDetailList_url,
        getfilter_url: viewData_getDetailList_filterurlSale,
        tabId: 10
    };

    if (index != -1) {
        arr_pagetables[index] = pgt_postingGroupLineDetailsPurchase;
    } else {
        arr_pagetables.push(pgt_postingGroupLineDetailsPurchase);
    }

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    postingGroupLineId = getPostingGroupLineId(14, headerId);
    branchid = tabNo == 3 ? headerId : 0;
    currentLHRow = rowno;

    typeId = 14;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);
    pagetable_formkeyvalue.push(branchid);


    get_NewPageTable(pgt_postingGroupLineDetailsPurchase.pagetable_id);

    viewData_modal_title = postingGroupModalTitle;
    $("#postingGroupFormLineTitle").text(viewData_modal_title + " - فروش");
    $(".modal-content #Id").text(headerId);


    if (tabNo == 2) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام بانک  : <span>${$(`#bankAccount_pagetable #col_${rowno}_3`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">دسته بندی  : <span>${$(`#bankAccount_pagetable #col_${rowno}_4`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">نام حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>
                <div class="border-right mr-2">
                    <p class="d-inline-block pl-2 m-2">شماره حساب  : <span >${$(`#bankAccount_pagetable #col_${rowno}_7`).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);

    }
    else if (tabNo == 3) {
        let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام شعبه  : <span>${$(`#cash_pagetable #col_${rowno}_2 `).text()}</span></p>
                </div>`;
        $(".modal-content #content").html(str);
    }

    modal_show(`postingGroupLineOrderSaleModals`);
    callbackAfterFilter(pgt_postingGroupLineDetailsPurchase.pagetable_id);

}

function run_button_postgroupadmlinedetaillist(id, rowno) {//7,8

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    postingGroupLineId = 0;
    headerId = $(`#${arr_pagetables[indexParent].pagetable_id} #row${rowno}`).data("headerid");
    currentLHRow = rowno;
    pagetable_id = "postingGroupLineAdmDetails_pagetable";

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
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
    arr_pagetables[index].lastPageloaded = 0


    if (headerId == 52 || headerId == 53)
        typeId = 7;
    else if (headerId == 54 || headerId == 55)
        typeId = 8;

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(headerId);
    pagetable_formkeyvalue.push(typeId);


    get_NewPageTable(pagetable_id, false, function () {
        viewData_modal_title = postingGroupModalTitle;
        $("#postingGroupFormLineTitle").text(viewData_modal_title);

        if (tabNo == 4) {
            let str = `<h4 class="font-16 my-2"><span class="text-gray">شناسه : </span><span>${headerId}</span></h4>
                <div class="border-right mr-2" >
                    <p class="d-inline-block pl-2 m-2">نام مرحله  : <span>${$(`#admission_pagetable #col_${rowno}_2`).text()}</span></p>
                </div>`;
            $(".modal-content #content").html(str);
        }
        modal_show(`postingGroupLineAdmModals`);

    });
}

function getPostingGroupLineId(postingGroupTypeId, headerIdentityId) {
    let url = `${viewData_baseUrl_FM}/PostingGroupApi/getpostinggrouplineid/${postingGroupTypeId}/${headerIdentityId}`;

    var result = $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseText;

}

function callbackAfterFilter(pg_id) {

    //if (pg_id == "postingGroupLineDetails_pagetable" || pg_id == "postingGroupLineDetails_pagetableWarehouse" || pg_id == "postingGroupLineDetails_pagetableTreasury" || pg_id == "postingGroupLineDetails_pagetablePurchase" || pg_id == "postingGroupLineDetailsForOrderSale_pagetable") {
    //    if (typeId == 13) {
    //        $(`#${pg_id} .dropdown-menu #filter_stageName`).data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/1/0/2/0`);
    //    }
    //    else if (typeId == 14) {
    //        $(`#${pg_id} .dropdown-menu #filter_stageName`).data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/3/0/2/0`);
    //    }
    //    else if (typeId == 15) {
    //        $(`#${pg_id} .dropdown-menu #filter_stageName`).data("api", `${viewData_baseUrl_WF}/StageApi/getdropdown/11/0/2/0`);
    //    }

    //}
}

function tr_save_row(pg_name, keycode) {

    if (pg_name == "postingGroupHeaderDetails_pagetable") {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var pagetable_id = arr_pagetables[index].pagetable_id;
        var pagetable_currentrow = arr_pagetables[index].currentrow;
        if (typeId !== 1) stagId = headerId;
        var model = {
            id: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(),
            postingGroupHeaderId: postingGroupHeaderId,
            headerId: headerId,
            stageId: stagId,
            accountGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).val(),
            accountSGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).val(),
            branchId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_2`).text(),
            isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 input`).prop("checked"),
            postingGroupTypeId: typeId,
            postingGroupTypeLineId: 0,
        };

        if (model.isActive) {
            if (+model.accountGLId === 0) {
                var msg = alertify.error("کل را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).next().find('.select2-selection').focus();
                return;
            }
            else if (+model.accountSGLId === 0) {
                var msg = alertify.error("معین را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).next().find('.select2-selection').focus();
                return;
            }
        }

        $.ajax({
            url: viewData_saverecord_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result.successfull) {

                    postingGroupHeaderId = result.id;

                    var msg = alertify.success(msg_row_edited);
                    msg.delay(alertify_delay);
                    isgetrecordAfterSaveRow = true;
                    getrecord(pg_name);
                    after_save_row(pg_name, "success", keycode, false);

                    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);

                    if (tabNo == 1)
                        pagetable_formkeyvalue = [tabNo, +$("#subject_pagetable #form_keyvalue").val()];
                    else
                        pagetable_formkeyvalue = [tabNo, 0];

                    resetPageTableInfo(tabNo)

                    $(`#${arr_pagetables[indexParent].pagetable_id} .pagetablebody tbody`).empty()

                    get_NewPageTable(arr_pagetables[indexParent].pagetable_id, false,
                        function () {
                            pagetable_formkeyvalue = [];
                            pagetable_formkeyvalue.push(headerId);
                            pagetable_formkeyvalue.push(typeId);
                            pagetable_formkeyvalue.push(stagId);
                            tr_Highlight("postingGroupHeaderDetails_pagetable");
                            activePageTableId = "postingGroupHeaderDetails_pagetable";
                        });

                }
                else {
                    var msg = alertify.error(msg_row_edit_error);
                    msg.delay(alertify_delay);
                    isgetrecordAfterSaveRow = true;
                    getrecord(pg_name);
                    after_save_row(pg_name, "error", keycode, false);

                }
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, viewData_saverecord_url);
                getrecord(pg_name);
                after_save_row(pg_name, "error", keycode, false);

                return false;
            }
        });
    }
    else {
        if (pg_name == "postingGroupLineDetails_pagetable" ||
            pg_name == "postingGroupLineDetails_pagetableWarehouse" ||
            pg_name == "postingGroupLineDetails_pagetablePurchase" ||
            pg_name == "postingGroupLineDetails_pagetableTreasury" ||
            pg_name == "postingGroupLineDetailsForOrderSale_pagetable" ||
            pg_name == "postingGroupLineDetails_pagetableBankAcount" ||
            pg_name == "postingGroupLineAdmDetails_pagetable") {

            var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
            var pagetable_id = arr_pagetables[index].pagetable_id;
            var pagetable_currentrow = arr_pagetables[index].currentrow;

            let stagId = +$(`#${pg_name} #row${pagetable_currentrow}`).data("stageid"),
                fundItemId = +$(`#${pg_name} #row${pagetable_currentrow}`).data("funditemid"),
                inOut = +$(`#${pg_name} #row${pagetable_currentrow}`).data("inout"),
                stageFundItemType = +$(`#${pg_name} #row${pagetable_currentrow}`).data("stagefunditemtype"),
                itemCategoryId = +$(`#${pg_name} #row${pagetable_currentrow}`).data("itemcategoryid"),
                postingGroupTypeLineId = (typeId == 13 || typeId == 14 || typeId == 15 || typeId == 2 || typeId == 3 ? +$(`#${pg_name} #row${pagetable_currentrow}`).data("postinggrouptypelineid") : 0);



            let modelLine = {
                id: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(),
                postingGroupLineId: postingGroupLineId,
                headerId: headerId,
                stageId: stagId,
                fundItemId: isNaN(fundItemId) ? 0 : fundItemId,
                identityTypeId: stageFundItemType,
                inOut: inOut,
                branchId: tabNo == 3 || tabNo == 2 ? branchid : tabNo == 9 || tabNo == 10 ? 0 : +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("branchid"),
                accountGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${typeId == 13 || typeId == 14 || typeId == 15 ? 7 : 6} select`).val(),
                accountSGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${typeId == 13 || typeId == 14 || typeId == 15 ? 8 : 7} select`).val(),
                isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${typeId == 13 || typeId == 14 || typeId == 15 ? 9 : 8} input`).prop("checked"),
                postingGroupTypeId: typeId == "3_1" ? 3 : +typeId,
                postingGroupTypeLineId: postingGroupTypeLineId,
            };
            if (typeId == 13 || typeId == 14 || typeId == 15)
                modelLine.itemCategoryId = itemCategoryId;

            if (modelLine.isActive) {
                if (+modelLine.accountGLId === 0) {
                    var msg = alertify.error("کل را وارد کنید ");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 9 || tabNo == 10 ? tabNo == 2 || typeId == 13 || typeId == 14 || typeId == 15 ? 8 : 7 : 9} input`).next().removeClass("border-thin");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 9 || tabNo == 10 ? tabNo == 2 || typeId == 13 || typeId == 14 || typeId == 15 ? 6 : 5 : 6} select`).next().find('.select2-selection').focus();
                    return;
                }
                else if (+modelLine.accountSGLId === 0) {
                    var msg = alertify.error("معین را وارد کنید ");
                    msg.delay(alertify_delay);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 9 || tabNo == 10 ? tabNo == 2 || typeId == 13 || typeId == 14 || typeId == 15 ? 8 : 7 : 9} input`).next().removeClass("border-thin");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 9 || tabNo == 10 ? tabNo == 2 || typeId == 13 || typeId == 14 || typeId == 15 ? 7 : 6 : 7} select`).next().find('.select2-selection').focus();
                    return;
                }
            }

            $.ajax({
                url: viewData_saveLinerecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(modelLine),
                success: function (result) {

                    if (result.successfull) {

                        postingGroupLineId = result.id;

                        var msg = alertify.success(msg_row_edited);
                        msg.delay(alertify_delay);
                        lineId = result.lineId;
                        isgetrecordAfterSaveRow = true;
                        getrecord(pg_name);
                        after_save_row(pg_name, "success", keycode, false);

                        var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
                        pagetable_formkeyvalue = [tabNo, 0];

                        resetPageTableInfo(tabNo)

                        get_NewPageTable(arr_pagetables[indexParent].pagetable_id, false,
                            function () {
                                pagetable_formkeyvalue = [];
                                pagetable_formkeyvalue.push(headerId);
                                pagetable_formkeyvalue.push(typeId == "3_1" ? 3 : typeId);

                                if (tabNo !== 4)
                                    pagetable_formkeyvalue.push(branchid);

                                if (typeId == "3_1")
                                    pagetable_formkeyvalue.push(true);

                                tr_Highlight(pg_name);
                                activePageTableId = pg_name;
                            });
                    }
                    else {
                        var msg = alertify.error(msg_row_edit_error);
                        msg.delay(alertify_delay);
                        isgetrecordAfterSaveRow = true;
                        getrecord(pg_name);
                        after_save_row(pg_name, "error", keycode, false);

                    }
                    return result;
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_saverecord_url);
                    getrecord(pg_name);
                    after_save_row(pg_name, "error", keycode, false);

                    return false;
                }
            });
        }
    }
}

function resetPageTableInfo(tabNo) {

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    arr_pagetables[indexParent].editable = false
    arr_pagetables[indexParent].pagerowscount = 15
    arr_pagetables[indexParent].pageNo = 0

}

function getrecord(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    var url = "";
    if (pg_name == "postingGroupHeaderDetails_pagetable") {
        if (typeId !== 1) stagId = headerId;
        var model = {
            id: +headerId,
            postingGroupType: +typeId,
            branchId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_2`).text(),
            stageId: +stagId,
        }

        url = `${viewData_baseUrl_FM}/PostingGroupApi/getrecordbyid`;

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(model),
            success: function (result) {

                var data = result.data;
                if (data != null) {
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(data.id);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data().id = data.id;
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).data("value", data.accountGLId);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > div:first`).text(data.accountGLName);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).data("value", data.accountSGLId);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > div:first`).text(data.accountSGLName);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 input`).prop("checked", data.isActive);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_7`).text(data.createDateTimePersian);
                }
                else {

                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text("");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data().id = 0;
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).data("value", 0);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > div:first`).text("-");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).data("value", 0);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > div:first`).text("-");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 input`).prop("checked", false);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_7`).text("");

                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });

    }
    else {
        if (pg_name == "postingGroupLineDetails_pagetable" ||
            pg_name == "postingGroupLineDetails_pagetableWarehouse" ||
            pg_name == "postingGroupLineDetailsForOrderSale_pagetable" ||
            pg_name == "postingGroupLineAdmDetails_pagetable" ||
            pg_name == "postingGroupLineDetails_pagetablePurchase" ||
            pg_name == "postingGroupLineDetails_pagetableBankAcount" ||
            pg_name == "postingGroupLineDetails_pagetableTreasury") {

            var rowBranchId = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("branchid");
            //isgetrecordAfterSaveRow
            //دارد trueبعد از ذخیره(کلید اینتر) مقدار
            //دارد falseبعد از ذخیره(کلید اسکیپ) مقدار
            lineId = (isgetrecordAfterSaveRow == false ? $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("id") : lineId);

            var model = {
                id: +headerId,
                postingGroupType: typeId == "3_1" ? 3 : +typeId,
                branchId: +tabNo == 4 ? rowBranchId : + tabNo == 3 || tabNo == 2 ? branchid : null,
                lineId: +lineId,
            }
            url = `${viewData_baseUrl_FM}/PostingGroupApi/getrecordbyid`;
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                async: false,
                success: function (result) {

                    var columnNo = checkPostingGroupType(tabNo, typeId);

                    var data = result.data;

                    if (data != null) {
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(data.id);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data().id = data.id;
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[0]} select`).data("value", data.accountGLId);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[0]} > div:first`).text(data.accountGLName);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[1]} select`).data("value", data.accountSGLId);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[1]} > div:first`).text(data.accountSGLName);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[2]} input`).prop("checked", data.isActive);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[3]}`).text(data.createDateTimePersian);
                    }
                    else {

                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text("");
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data().id = 0;
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[0]} select`).data("value", 0);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[0]} > div:first`).text("-");
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[1]} select`).data("value", 0);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[1]} > div:first`).text("-");
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[2]} input`).prop("checked", false);
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${columnNo[3]}`).text("");
                    }

                },
                error: function (xhr) {
                    error_handler(xhr, url)
                }
            });
        }
    }

    isgetrecordAfterSaveRow = false;
}

function checkPostingGroupType(tabNo, typeId) {

    let glColumnNo = 0, sglColumnNo = 0, isActiveColumnNo = 0, modifyDateColumnNo = 0;

    if ([4, 3, 2].includes(tabNo)) {
        if ([2, 3].includes(typeId)) {
            glColumnNo = 6;
            sglColumnNo = 7;
            isActiveColumnNo = 8;
            modifyDateColumnNo = 9;
        }
        else
            if ([13, 14, 15].includes(typeId)) {
                glColumnNo = 7;
                sglColumnNo = 8;
                isActiveColumnNo = 9;
                modifyDateColumnNo = 10;
            }
            //else if ([15].includes(typeId)) {
            //    glColumnNo = 6;
            //    sglColumnNo = 7;
            //    isActiveColumnNo = 8;
            //    modifyDateColumnNo = 9;
            //}
            else {
                glColumnNo = 5;
                sglColumnNo = 6;
                isActiveColumnNo = 7;
                modifyDateColumnNo = 8;
            }
    }
    else {
        glColumnNo = 4;
        sglColumnNo = 5;
        isActiveColumnNo = 6;
        modifyDateColumnNo = 7;
    }

    return [glColumnNo, sglColumnNo, isActiveColumnNo, modifyDateColumnNo]
}

function changeTabPostingGroup(currentTabNo) {

    resetPageTableInfo(currentTabNo)

    var indexParent = arr_pagetables.findIndex(v => v.tabId == currentTabNo);

    switch (currentTabNo) {
        case 1:
            pagetable_formkeyvalue = [currentTabNo, +$("#subject_pagetable #form_keyvalue").val()];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "موضوع دریافت و پرداخت";
            break;
        case 2:
            pagetable_formkeyvalue = [currentTabNo, 0];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "حساب بانکی";
            break;
        case 3:
            pagetable_formkeyvalue = [currentTabNo, 0];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "شعب";
            break;
        case 4:
            pagetable_formkeyvalue = [currentTabNo, 0];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "پذیرش";
            break;

        case 11:
            pagetable_formkeyvalue = [currentTabNo, 0];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "انبار";
            break;
        default:
            pagetable_formkeyvalue = [currentTabNo, 0];
            get_NewPageTable(arr_pagetables[indexParent].pagetable_id);
            postingGroupModalTitle = "خزانه";
            break;
    }

    tabNo = currentTabNo;
};

function fillAccountDetailElm(accountDetailElementId, accountGLId, accountSGLId) {

    var model = {
        accountGLId: accountGLId,
        accountSGLId: accountSGLId
    };

    $.ajax({
        url: `${viewData_baseUrl_FM}/TreasuryLineApi/getaccountdetail`,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            if (result) {

                var data = result.map(function (item) {
                    return {
                        id: item.id, text: `${item.id} - ${item.name}`
                    };
                });
                $(`#${accountDetailElementId}`).html("").select2({
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
                    placeholder: "تفصیل را انتخاب نمایید",
                    data: data,
                    closeOnSelect: true,
                    allowClear: true,
                    escapeMarkup: function (markup) {
                        return markup;
                    }
                });
            }
        },
        error: function (xhr) {
            if (callback != undefined)
                callback();
            error_handler(xhr, p_url);
        }
    });
}

function getSGLRequierdPostingGroup(glId, sglId) {

    var model = {
        glId: +glId,
        id: +sglId
    }, resluteReqStatus;

    if (+glId != 0 && +sglId != 0) {
        resluteReqStatus = $.ajax({
            url: "/api/FM/AccountSGLApi/getsetting",
            async: false,
            cache: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result != null && result != undefined)
                    if (result.accountDetailRequired == 1)
                        return 1;
                    else if (result.accountDetailRequired == 2)
                        return 2;
                    else
                        return 3;

            },
            error: function (xhr) {
                error_handler(xhr, url);
                return 0;
            }
        });
        return resluteReqStatus.responseJSON;
    }
    return 0;
}

function getSaveModel(pg_name) {

    let model = {};

    if (pg_name == "postingGroupHeaderDetails_pagetable") {
        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var pagetable_id = arr_pagetables[index].pagetable_id;
        var pagetable_currentrow = arr_pagetables[index].currentrow;

        if (typeId !== 1) stagId = headerId;

        if (typeId !== 1) stagId = headerId;

        model = {
            id: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(),
            postingGroupHeaderId: postingGroupHeaderId,
            headerId: headerId,
            stageId: stagId,
            documentTypeId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).val(),
            accountGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).val(),
            accountSGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 select`).val(),
            branchId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_2`).text(),
            isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).prop("checked"),
            postingGroupTypeId: typeId,
        };

        return model;
    }
    else if (pg_name == "postingGroupLineDetails_pagetable") {
        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var pagetable_id = arr_pagetables[index].pagetable_id;
        var pagetable_currentrow = arr_pagetables[index].currentrow;

        let stagId = +$(`#postingGroupLineDetails_pagetable #row${pagetable_currentrow}`).data("stageid"),
            fundTypeId = +$(`#postingGroupLineDetails_pagetable #row${pagetable_currentrow}`).data("fundtypeid");

        model = {
            id: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(),
            postingGroupLineId: postingGroupLineId,
            headerId: headerId,
            stageId: stagId,
            fundTypeId: fundTypeId,
            branchId: tabNo == 3 || tabNo == 2 ? branchid : +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3`).text(),
            accountGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 5 : 7} select`).val(),
            accountSGLId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 6 : 8} select`).val(),
            isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 8 : 10} input`).prop("checked"),
            postingGroupTypeId: typeId == "3_1" ? 3 : +typeId,
        };

        return model
    }
}

function validateModel(pg_name, model) {
    if (model.isActive) {
        if (pg_name == "postingGroupHeaderDetails_pagetable") {
            if (+model.documentTypeId === 0) {
                var msg = alertify.error("نوع سند را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 select`).next().find('.select2-selection').focus();
                return true;
            }
            else if (+model.accountGLId === 0) {
                var msg = alertify.error("کل را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 select`).next().find('.select2-selection').focus();
                return true;
            }
            else if (+model.accountSGLId === 0) {
                var msg = alertify.error("معین را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 select`).next().find('.select2-selection').focus();
                return true;
            }

            let validtion = getSGLRequierdPostingGroup(model.accountGLId, model.accountSGLId);
            if (+validtion.accountDetailRequired === 1 && +model.accountDetailId === 0) {
                var msg = alertify.error("تقضیل را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_8 input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_7 select`).next().find('.select2-selection').focus();
                return true;
            }

            return false;
        }
        else if (pg_name == "postingGroupLineDetails_pagetable") {
            if (+modelLine.accountGLId === 0) {
                var msg = alertify.error("کل را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 7 : 9} input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 4 : 6} select`).next().find('.select2-selection').focus();
                return true;
            }
            else if (+modelLine.accountSGLId === 0) {
                var msg = alertify.error("معین را وارد کنید ");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 7 : 9} input`).next().removeClass("border-thin");
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_${tabNo == 3 || tabNo == 2 ? 5 : 7} select`).next().find('.select2-selection').focus();
                return true;
            }
            return false;
        }
    }
    else
        return true;
}

function getSaveUrl(pg_name) {
    pg_name == "postingGroupHeaderDetails_pagetable" ? viewData_saverecord_url : viewData_saveLinerecord_url
}

$("#postingGroupHeaderModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} tbody tr`).removeClass("highlight")
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;

    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

$("#postingGroupLineModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} tbody tr`).removeClass("highlight")
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;

    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

$("#postingGroupLineOrderSaleModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;
    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

$("#postingGroupLineAdmModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} tbody tr`).removeClass("highlight")
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;
    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

$("#postingGroupLinePurchaseBankAcountModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} tbody tr`).removeClass("highlight")
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;
    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

$("#postingGroupLineTreasuryModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(tabNo);
    pagetable_formkeyvalue.push(0);

    var indexParent = arr_pagetables.findIndex(v => v.tabId == tabNo);
    $(`#${arr_pagetables[indexParent].pagetable_id} tbody tr.highlight`).focus()
    //$(`#${arr_pagetables[indexParent].pagetable_id} tbody tr`).removeClass("highlight")
    //$(`#${arr_pagetables[indexParent].pagetable_id} #row${currentLHRow}`).addClass("highlight").focus();
    //arr_pagetables[indexParent].currentrow = currentLHRow;
    activePageTableId = arr_pagetables[indexParent].pagetable_id;
});

initPostingGroup();