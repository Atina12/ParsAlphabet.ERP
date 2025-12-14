
var unitTreeViewPageTableId = 1
var showBtnJustOnSearchTreeView = false
var newArr = []
var pagetable_id = "pagetable"
var treeViewPageTableModel = [{
    treeViewId: "treeviewpage",
    getDatApi: "",
    insertApi: "",
    updateApi: "",
    deleteApi: "",
    colExpConfig: "",
    filter: ""
}]


async function getTreeViewPageTable(treeViewId, treeViewBtnAndInputs = true, treeViewCallback = undefined) {

    treeViewId = treeViewId == null ? "treeViewPageTable" : treeViewId

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);

    treeViewBtnAndInputs ? treeViewPageTableBuildPublicBtnAndInputs(treeViewId) : ""

    treeViewPageTableConfigAndBuildTree(treeViewId, treeViewCallback)

}

async function treeViewPageTableConfigAndBuildTree(treeViewId, treeViewCallback) {

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    let colExpConfig = treeViewPageTableModel[index].colExpConfig
    let treeViewEditMode = $(`#${treeViewId} #treeViewEditMode`).prop("checked")
    let treeJson = []

    delete treeViewPageTableModel[index].opr
    delete treeViewPageTableModel[index].copyList
    $(`#${treeViewId} #treeViewPathContent`).empty()
    $(`#${treeViewId} #treeViewCopyLineContent`).empty()


    //treeList = await treeViewPageTableGetList(treeViewId)

    //must be delete
    treeJson = ajaxFakeData(treeViewId)
    //

    treeViewPageTableBuild(treeViewId, treeJson, treeViewEditMode)



    setTimeout(() => {
        //if (colExpConfig == "collapseAll")
        //    $(`#${treeViewId} #treeViewHideAllChildren`).click()
        //else if (colExpConfig == "expandAll")
        //    $(`#${treeViewId} #treeViewShowAllChildren`).click()
        //else {
        //    $(`#${treeViewId} #treeViewHideAllChildren`).click()
        //    $(`#${treeViewId} #treeViewContentPlusMinus-0`).click()
        //}

        treeViewPageTableLoader(treeViewId, false)

    }, 1000)

    if (typeof treeViewCallback != "undefined") {
        treeViewCallback()
    }
}

async function treeViewPageTableGetList(treeViewId) {

    //treeViewPageTableLoader(treeViewId, true)
    //let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    //let treeviewGetDataUrl = treeViewPageTableModel[index].getDataApi
    //let treeViewFilter = $(`#${treeViewId} #treeViewSearchField`).val().trim()
    //let treeviewGetDataModel = {
    //    filter: treeViewFilter
    //}
    //let treeList = await$.ajax({
    //    url: treeviewGetDataUrl,
    //    type: "POST",
    //    data: JSON.stringify(treeviewGetDataModel),
    //    dataType: "json",
    //    contentType: "application/json",
    //    cache: false,
    //    success: function (result) {
    //        if (result.successfull) {
    //          treeViewPageTableLoader(treeViewId, false)
    //          return result.list
    //        }
    //        else {
    //          treeViewPageTableLoader(treeViewId, false)
    //        }
    //    },
    //    error: function (xhr) {
    //          treeViewPageTableLoader(treeViewId, false)
    //        error_handler(xhr, treeviewGetDataUrl);
    //    }
    //});

    //return treeList
}

function treeViewPageTableBuildPublicBtnAndInputs(treeViewId) {

    $(`#${treeViewId} #treeViewSearchModal .modal-footer `).html(`<button id="modal-close" onclick="treeViewModalClose('${treeViewId}','treeViewSearchModal')" class="btn btn-secondary waves-effect"><i class="fa fa-times-circle"></i>بستن</button>`)
    $(`#${treeViewId} #treeviewTreeBtn`).html(`
        <div>
            <button id="treeViewShowAllChildren" onclick="treeViewPageTableShowAllChildren('${treeViewId}',this)" type="button" class="btn btn-success">نمایش همه</button>
            <button id="treeViewHideAllChildren" onclick="treeViewPageTableHideAllChildren('${treeViewId}',this)" type="button" class="btn btn-danger mr-1">بستن همه</button>
            <div id="treeViewSearchFieldBox" class="mr-1">
                <input type="text" id="treeViewSearchField" onkeydown="treeViewPageTableSearchField('${treeViewId}',this,event)" maxlength="20" class="form-control" placeholder="عبارت جستجو را وارد کنید" />
            </div>
            <button id="treeViewSearchFieldBtn" type="button" onclick="treeViewPageTableSearchFieldBtn('${treeViewId}')" class="btn blue_1 waves-effect">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div>
              <button id="treeViewReset" onclick="treeViewPageTableReset('${treeViewId}',this)" type="button" class="btn btn-success">پیش فرض</button>
              <input id="treeViewEditMode"  onchange="treeViewPageTableEditMode('${treeViewId}',this)" type="checkbox" checked data-toggle="toggle" data-on="حالت واقعی" data-off="حالت نمایشی" data-onstyle="success" data-offstyle="info" data-width="180" data-height="27">
        </div>
    `)

    $(`#${treeViewId} #treeViewEditMode`).bootstrapToggle();
}

function treeViewPageTableBuild(treeViewId, treeJson, treeViewEditMode = true) {

    let findRoot = treeJson.data.filter((node) => node.parentId == null)

    treeViewPageTableBuildTreeHeader(treeViewId, treeJson.columns, treeViewEditMode)

    if (findRoot.length != 0) {
        return treeViewPageTableBuildTreeBody(treeViewId, treeJson, null, treeViewEditMode)
    }
    else {
        let treeViewRoot = treeJson.data[0].parentId
        return treeViewPageTableBuildTreeBody(treeViewId, treeJson, treeViewRoot, treeViewEditMode)
    }
}

function treeViewPageTableBuildTreeHeader(treeViewId, treeJsonHeader, treeViewEditMode) {

    let treeViewPageTableHeader = `<tr>`
    for (let i = 0; i < treeJsonHeader.length; i++) {

        treeViewPageTableHeader += `<th>${treeJsonHeader[i].title}</th>`

        if (treeJsonHeader.length - 1 == i && treeViewEditMode)
            treeViewPageTableHeader += `<th>عملیت</th>`

    }
    treeViewPageTableHeader += `</tr>`

    $(`#${treeViewId} #treeViewRootContent > table > thead `).html(treeViewPageTableHeader)

}

function treeViewPageTableColumnResizeable(treeViewId) {
    //ColumnResizeable(treeViewId)

    var ColumnLength = $(`#${treeViewId} #treeViewRootContent > table > thead th`).length;


    for (var j = 0; j < ColumnLength; j++)
        $(`#${treeViewId} #treeViewRootContent > table > thead th:eq(${j + 1})`).attr("id", j + 1).append(`<div class="${j + 1}-sizer"></div>`);

    $($(`#${treeViewId} #treeViewRootContent > table > thead th`)).resizable({
        handles: "w",
        animateDuration: "fast",
        minWidth: 30
    });
}

function treeViewPageTableBuildTreeBody(treeViewId, treeJson, parentId, treeViewEditMode) {

    let treeBody = ""
    let treeColumns = treeJson.columns
    let treeViewCurrentLevelList = []

    treeViewCurrentLevelList = treeJson.data.filter((node) => node.parentId == parentId)

    console.log(treeJson.data)

    for (let i = 0; i < treeViewCurrentLevelList.length; i++) {

        let treeViewCurrentLevelListItem = treeViewCurrentLevelList[i]

        treeBody += `<tr>`

        for (let j = 0; j < treeColumns.length; j++) {

            if (j == 0) {
                treeBody += `<td>${treeViewCurrentLevelListItem[treeColumns[j].id]}</td>`
            }
            else {
                treeBody += `<td>${treeViewCurrentLevelListItem[treeColumns[j].id]}</td>`
            }

            if (treeColumns.length - 1 == j && treeViewEditMode) {
                treeBody += `<td>دکمه های عملیات</td>`
            }

            
        }

        treeBody += `</tr>`
    }

    $(`#${treeViewId} #treeViewRootContent > table tbody `).html(treeBody)

    treeViewPageTableColumnResizeable(treeViewId)

    //for (let i = 0; i < treeViewCurrentLevelList.length; i++) {
    //    let treeviewCHild = treeList.filter((node) => node.parentId == treeViewCurrentLevelList[i].id)
    //    let hasChild = treeviewCHild.length != 0 ? true : false

    //    tree += `<li id='treeViewLi-${treeViewCurrentLevelList[i].id}' class="treeViewLi" data-parent='${parentId}'>`
    //    tree += treeViewPageTableContentBuild(treeViewId, treeViewCurrentLevelList[i], hasChild, treeViewEditMode)

    //    if (treeviewCHild.length != 0)
    //        tree += treeViewPageTableBuildTree(treeViewId, treeList, treeViewCurrentLevelList[i].id, treeViewEditMode)

    //    tree += "</li>"
    //}

    //tree += "</ul>"
    //return tree

    //$(`#${treeViewId} #treeViewRootContent > table tbody `).html(treeView)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function treeViewPageTableContentBuild(treeViewId, children, hasChild, treeViewEditMode) {

    let btnBaseRoot = `
                         <button id='treeViewContentTextAndBtnBtnEdit-${children.id}' onclick="treeViewPageTableContentBtnEdit('${treeViewId}' ,this,event,${children.id},${children.parentId})" type="button" title="ویرایش" class="btn treeViewContentTextAndBtnBtnEdit"><i class="fas fa-edit"></i></button>    
                         <button id='treeViewContentTextAndBtnBtnDelete-${children.id}' onclick="treeViewPageTableContentBtnDelete('${treeViewId}' ,this,event,${children.id},${children.parentId})" type="button" title="حذف" class="btn treeViewContentTextAndBtnBtnDelete"><i class="fa fa-trash"></i></button>                                  
                         <button id='treeViewContentTextAndBtnBtnCopy-${children.id}' onclick="treeViewPageTableContentTextAndBtnBtnCopy('${treeViewId}' ,this,event,${children.id},${children.parentId})" type="button" title="کپی" class="btn treeViewContentTextAndBtnBtnCopy"><i class="fa fa-copy"></i></button>                                  
                      `

    let btnBox = `
                 <div id="treeViewContentTextAndBtnBtn-${children.id}" class="treeViewContentTextAndBtnBtn treeviewShowHideBtn">
                     <button id='treeViewContentTextAndBtnBtnBuildChild-${children.id}' onclick="treeViewPageTableContentBtnBuildChild('${treeViewId}',this,event,${children.id},${children.parentId})" type="button" title="ایجاد فرزند" class="btn treeViewContentTextAndBtnBtnBuildChild"><i class="fa fa-plus"></i></button>                  
                     ${children.parentId == null ? "" : btnBaseRoot} 
                 </div>
                `

    let content = `             
                <div class="treeViewContent">
                    <div id='treeViewContentPlusMinus-${children.id}' class="treeViewContentPlusMinus ${!hasChild ? 'd-none' : ''}"  onclick="treeViewPageTableCollapseAndExpand('${treeViewId}',this,event)"><i class="fa fa-minus"></i></div>
                    <div id='treeViewContentTextAndBtn-${children.id}' class="treeViewContentTextAndBtn">
                        <div id='treeViewContentTextAndBtnText-${children.id}' class="treeViewContentTextAndBtnText" onclick="treeViewPageTableShowBtnAndPath('${treeViewId}',this,event,${children.id},${children.parentId})">${children.text}</div>           
                        ${treeViewEditMode ? btnBox : ""} 
                    </div>               
                </div>
                `

    return content
}

function treeViewPageTableShowAllChildren(treeViewId, elm) {
    $(`#${treeViewId} .treeViewContentPlusMinus i`).removeClass("fa-plus")
    $(`#${treeViewId} .treeViewContentPlusMinus i`).addClass("fa-minus")
    $(`#${treeViewId} #treeViewRootContent > ul ul`).removeClass("d-none")
}

function treeViewPageTableHideAllChildren(treeViewId, elm) {
    $(`#${treeViewId} .treeViewContentPlusMinus i`).addClass("fa-plus")
    $(`#${treeViewId} .treeViewContentPlusMinus i`).removeClass("fa-minus")
    $(`#${treeViewId} #treeViewRootContent > ul ul`).addClass("d-none")
}

function treeViewPageTableSearchField(treeViewId, elm, e) {
    if (e.keyCode == 13)
        treeViewPageTableSearchFieldBtn(treeViewId)
}

function treeViewPageTableSearchFieldBtn(treeViewId) {

    let treeViewFilter = $(`#${treeViewId} #treeViewSearchField`).val().trim()

    if (!checkResponse(treeViewFilter) || treeViewFilter == "") {
        alertify.notify('عبارت فیلتر را وارد کنید', 'warning', 5, function () { });
        $(`#${treeViewId} #treeViewSearchField`).select()
        return
    }

    //ajax send filterValue
    getTreeViewPageTable(treeViewId, false)


    //let filterValue = $(`#${treeViewId} #treeViewSearchField`).val().trim()
    //let allContent = $(`#${treeViewId} .treeViewContentTextAndBtnText`)
    //let searchList = []
    ////fake
    //$(allContent).each(function (index) {
    //    let id = $(this).attr("id")
    //    let content = $(this).text()
    //    if (filterValue == content) {
    //        searchList.push({
    //            id: id
    //        })
    //    }
    //}).promise().done(function () {
    //    if (searchList.length != 0) {
    //        treeViewSearchListModal(treeViewId, searchList)
    //    }
    //    else {
    //        alertify.notify('موردی یافت نشد', 'warning', 5, function () { });
    //        $(`#${treeViewId} #treeViewSearchField`).select()
    //    }
    //});
}

function treeViewPageTableCollapseAndExpand(treeViewId, elm, e) {

    e.preventDefault()
    e.stopPropagation()

    let el = $(elm)
    let elmIcon = $(elm).children("i")

    if ($(elmIcon).hasClass("fa-plus")) {
        $(elmIcon).removeClass("fa-plus")
        $(elmIcon).addClass("fa-minus")
        $(el).parent().parent().children("ul").removeClass("d-none")
    }
    else {
        $(elmIcon).removeClass("fa-minus")
        $(elmIcon).addClass("fa-plus")
        $(el).parent().parent().children("ul").addClass("d-none")
    }
}

function treeViewPageTableShowBtnAndPath(treeViewId, elm, e, id, parentId) {

    let checkBtnShowOrHidden = $(`#${treeViewId} #treeViewContentTextAndBtnBtn-${id}`).hasClass("treeviewShowHideBtn")

    $(`#${treeViewId} .treeViewContentTextAndBtnText`).css("color", "#616161")

    if (showBtnJustOnSearchTreeView) {
        if (checkBtnShowOrHidden) {
            $(`#${treeViewId} .treeViewContentTextAndBtnBtn`).addClass("treeviewShowHideBtn").animate({ width: '0' }, 150)
            $(`#${treeViewId} #treeViewContentTextAndBtnBtn-${id}`).removeClass("treeviewShowHideBtn").animate({ width: parentId == null ? '24' : '107' }, 150)
        }
    }
    else {
        if (checkBtnShowOrHidden) {
            $(`#${treeViewId} .treeViewContentTextAndBtnBtn`).addClass("treeviewShowHideBtn").animate({ width: '0' }, 150)
            $(`#${treeViewId} #treeViewContentTextAndBtnBtn-${id}`).removeClass("treeviewShowHideBtn").animate({ width: parentId == null ? '24' : '107' }, 150)
        }
        else {
            $(`#${treeViewId} #treeViewContentTextAndBtnBtn-${id}`).addClass("treeviewShowHideBtn").animate({ width: parentId == null ? '24' : '0' }, 150)
        }
    }

    $(`#${treeViewId} .treeViewEditElementPositon`).remove()
    $(`#${treeViewId} .treeviewBuildChildPosition`).remove()
    $(`#${treeViewId} .treeViewCopyChildPosition`).remove()

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
    $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")

    let makeLine = $(elm).parents(".treeViewLi")
    let makeLineLine = $(makeLine).length
    let saveRoadMap = []
    let saveRoadMapText = ""
    let currentElmFromTop = 0

    $(".treeViewContentPlusMinus").css("background-color", "#a2a5b5")
    $(".treeViewContentPlusMinus").css("color", "black")

    $(makeLine).each(function (index) {

        let id = $(this).attr("id")
        let showUlsOnPath = $(`#${treeViewId} #${id} > div .treeViewContentPlusMinus`).attr("id")
        let el = $(`#${treeViewId} #${showUlsOnPath}`)
        let elmIcon = el.children("i")

        saveRoadMap.push({ id: id.split("treeViewLi-")[1], text: $(`#${treeViewId} #${id} > div .treeViewContentTextAndBtnText`).text() })

        if (index != 0)
            if (showBtnJustOnSearchTreeView)
                if ($(elmIcon).hasClass("fa-plus")) {
                    $(elmIcon).removeClass("fa-plus")
                    $(elmIcon).addClass("fa-minus")
                    $(el).parent().parent().children("ul").removeClass("d-none")
                }

    }).promise().done(function () {

        $(makeLine).each(function (index) {
            let id = $(this).attr("id")
            if (makeLineLine != index + 1)
                currentElmFromTop += $(`#${treeViewId} #${id}`).position().top

            $(`#${treeViewId} #treeViewContentPlusMinus-${id.split("treeViewLi-")[1]}`).css("background-color", "red")
            $(`#${treeViewId} #treeViewContentPlusMinus-${id.split("treeViewLi-")[1]}`).css("color", "white")

        }).promise().done(function () {
            if (showBtnJustOnSearchTreeView)
                $(`#${treeViewId} #treeViewRootContent`).scrollTop(currentElmFromTop)
            showBtnJustOnSearchTreeView = false
        });

    });

    $(elm).css("color", "red")

    saveRoadMap = saveRoadMap.reverse()
    for (let i = 0; i < saveRoadMap.length; i++) {
        if (saveRoadMap.length != 1 && saveRoadMap.length - 1 == i)
            saveRoadMapText += `<div class="treeviewPathLine" onclick="treeViewPageTableGoToPath('${treeViewId}',this,${saveRoadMap[i].id})"><span>${saveRoadMap[i].text}</span></div>`
        else
            saveRoadMapText += `<div class="treeviewPathLine" onclick="treeViewPageTableGoToPath('${treeViewId}',this,${saveRoadMap[i].id})"><span>${saveRoadMap[i].text}</span><span class="treeview-path-seperate"> / </span></div>`
    }

    $(`#${treeViewId} #treeViewPathContent`).html(saveRoadMapText)
}

function treeViewPageTableGoToPath(treeViewId, elm, id) {
    showBtnJustOnSearchTreeView = true
    $(`#${treeViewId} #treeViewContentTextAndBtnText-${id}`).click()
}

function treeViewPageTableContentBtnEdit(treeViewId, elm, e, id, parentId) {
    e.preventDefault()

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    if (treeViewPageTableModel[index].opr == "copy") {
        alertify.notify('شما در وضعیت کپی هستید، ابتدا این مرحله را به پایان برسانید', 'warning', 5, function () { });
        return
    }


    let el = $(elm)
    let elmIcon = el.children("i")

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
    $(`#${treeViewId} .treeviewBuildChildPosition`).remove()
    $(`#${treeViewId} .treeViewCopyChildPosition`).remove()

    if (elmIcon.hasClass("fa-edit")) {

        $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
        $(`#${treeViewId} .treeViewEditElementPositon`).remove()
        el.children("i").removeClass("fa-edit").addClass("fa-times")
        el.attr("title", "انصراف")

        el.parent().parent().append(`
        <div class="treeViewEditElementPositon">
            <div class="treeViewEditElement" >
                <input type="text" id="treeViewEditElement-${id}" maxlength="20" class="form-control"  onkeydown="treeViewPageTableUpdateOnKeydown('${treeViewId}',this,event,${id},${parentId})" placeholder="نام را وارد کنید" />
                <button id='treeViewEditElementEdit-${id}' onclick='treeViewPageTableUpdateBtn('${treeViewId}' ,this,event,${id},${parentId})' type="button" title="ویرایش" class="btn treeViewEditElementEdit"><i class="fa fa-save"></i></button>                  
            </div> 
        </div>    
        `)

        $(`#${treeViewId} #treeViewEditElement-${id}`).val($(`#${treeViewId} #treeViewContentTextAndBtnText-${id}`).text().trim())

        $(`#${treeViewId} .treeViewEditElement`).animate({ width: '190' }, 350);
        setTimeout(() => {
            $(`#${treeViewId} .treeViewEditElement`).children("input").select()
        }, 400)
    }
    else {
        $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
        elmIcon.removeClass("fa-times").addClass("fa-edit")
        el.attr("title", "ویرایش")
        $(`#${treeViewId} .treeViewEditElement`).remove()
    }
}

function treeViewPageTableContentBtnBuildChild(treeViewId, elm, e, id, parentId) {
    e.preventDefault()

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    if (treeViewPageTableModel[index].opr == "copy") {
        alertify.notify('شما در وضعیت کپی هستید، ابتدا این مرحله را به پایان برسانید', 'warning', 5, function () { });
        return
    }

    let el = $(elm)
    let elmIcon = el.children("i")

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
    $(`#${treeViewId} .treeViewEditElementPositon`).remove()
    $(`#${treeViewId} .treeViewCopyChildPosition`).remove()

    if (elmIcon.hasClass("fa-plus")) {
        $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
        $(`#${treeViewId} .treeviewBuildChildPosition`).remove()

        elmIcon.removeClass("fa-plus").addClass("fa-times")
        el.attr("title", "انصراف")

        el.parent().parent().append(`
        <div class="treeviewBuildChildPosition">
           <div class="treeviewBuildChild" >
                <input type="text" id="treeview-buildChild-${id}" maxlength="20" class="form-control" onkeydown="treeViewPageTableBuildChildOnKeydown('${treeViewId}' , this,event,${id},${parentId})" onclick="treeViewPageTableBuildChildOnClick('${treeViewId}' ,event)" placeholder="نام زیر شاخه را وارد کنید"/>
                <button id='treeviewBuildChildInsert-${id}' onclick="treeViewPageTableBuildChildBtnClick('${treeViewId}',this,event,${id},${parentId})" type="button" title="ذخیره" class="btn treeViewBuildChildInsert"><i class="fa fa-save"></i></button>                  
           </div>
        </div> 
        `)

        $(`#${treeViewId} .treeviewBuildChild`).animate({ width: '190' }, 350);

        setTimeout(() => {
            $(`#${treeViewId} .treeviewBuildChild`).children("input").focus()
        }, 400)

    }
    else {
        $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
        elmIcon.removeClass("fa-times").addClass("fa-plus")
        el.attr("title", "ایجاد فرزند")
        $(`#${treeViewId} .treeviewBuildChild`).remove()
    }
}

function treeViewPageTableContentBtnDelete(treeViewId, elm, e, id, parentId) {

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    if (treeViewPageTableModel[index].opr == "copy") {
        alertify.notify('شما در وضعیت کپی هستید، ابتدا این مرحله را به پایان برسانید', 'warning', 5, function () { });
        return
    }

    //similar
    let el = $(elm)
    let childLength = el.closest("li").children("ul").children().length

    if (childLength != 0) {
        alertify.notify('به دلیل داشتن زیر شاخه اجاره حذف ندارید', 'warning', 5, function () { });
    }
    else {

        let elementForDelete = el.closest("li").remove()
        alertify.notify('حذف با موفقیت انجام شد', 'success', 5, function () { });

        if ($(`#${treeViewId} #treeViewLi-${parentId} > ul`).children("li").length == 0) {
            $(`#${treeViewId} #treeViewContentPlusMinus-${parentId}`).addClass("d-none")
        }

        $(`#${treeViewId} #treeViewContentTextAndBtnText-${parentId}`).click()

    }

    //ajax...


    //let index = treeViewPageTableModel.findIndex(v => v.treeViewId == pg_id);
    //ajax

    //let treeview_deleteUrl = treeViewPageTableModel.delete_api
    //let treeview_editModel = id

    //$.ajax({
    //    url: treeViewPageTableModel_editUrl,
    //    type: "POST",
    //    data: JSON.stringify(treeview_editModel),
    //    dataType: "json",
    //    contentType: "application/json",
    //    cache: false,
    //    success: function (result) {

    //if (result.successfull) {

    //}
    //else {

    //}
    //    },
    //    error: function (xhr) {
    //        error_handler(xhr, url);
    //    }
    //});
}

function treeViewPageTableContentTextAndBtnBtnCopy(treeViewId, elm, e, id, parentId) {
    e.preventDefault()

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    let arrChild = $(`#${treeViewId} #treeViewLi-${id} .treeViewLi`)
    let listOfCHild = []
    let el = $(elm)
    let elmIcon = el.children("i")
    let copyMode = elmIcon.hasClass("fa-copy")

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
    $(`#${treeViewId} .treeViewEditElementPositon`).remove()

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
    $(`#${treeViewId} .treeviewBuildChildPosition`).remove()

    if (copyMode) {

        if (arrChild.length == 0) {
            alertify.notify('مورد انتخاب شده بدون زیرشاخه می باشد', 'warning', 5, function () { });
            return
        }

        listOfCHild.push({
            id,
            parentId: null
        })

        $(arrChild).each(function (index) {

            let elm = $(this)
            let currentId = +elm.attr("id").split("treeViewLi-")[1]
            let currentParentId = elm.data("parent")
            let currentValue = $(`#treeViewContentTextAndBtnText-${currentId}`).text()

            listOfCHild.push({
                id: currentId,
                text: currentValue,
                parentId: currentParentId
            })
        })

        if (listOfCHild.length != 0) {
            $(`#${treeViewId} .treeViewContentTextAndBtnBtnCopy`).attr("title", "انتقال")
            $(`#${treeViewId} .treeViewContentTextAndBtnBtnCopy i`).removeClass("fa-copy").addClass("fa-arrow-down")
            treeViewPageTableModel[index].opr = "copy"
            treeViewPageTableModel[index].copyList = listOfCHild
            alertify.notify('دریافت اطلاعات انجام شد', 'success', 5, function () { });
        }

        treeViewPageTableCopyPathBuild(treeViewId, elm)

    }
    else {

        let copyList = treeViewPageTableModel[index].copyList
        let copyIsAllow = true

        for (let i = 0; i < copyList.length; i++) {
            if (copyList[i].id == id || copyList[i].parentId == id) {
                copyIsAllow = false
                alertify.notify('امکان کپی زیرشاخه ها برای این مورد امکان پذیر نیست', 'warning', 5, function () { });
                break
            }
        }

        let treeViewCopyChildPosition = $(`#${treeViewId} .treeViewCopyChildPosition`)

        if (treeViewCopyChildPosition.length == 0) {

            if (copyIsAllow) {
                el.parent().parent().append(`
                    <div class="treeViewCopyChildPosition">
                        <div class="treeViewPasteElement" >
                            <button id='treeViewPasteElement-${id}' onclick="treeViewPageTablePasteElementCancel('${treeViewId}' ,this,event,${id},${parentId})" type="button" title="انصراف" class="btn treeViewPasteElementBtnCancel"><i class="fa fa-times"></i></button>                  
                            <button id='treeViewPasteElement-${id}' onclick="treeViewPageTablePasteElement('${treeViewId}' ,this,event,${id},${parentId})" type="button" title="انتقال" class="btn treeViewPasteElementBtn"><i class="fa fa-paste"></i></button>                  
                        </div> 
                    </div>    
                    `)
                $(`#${treeViewId} .treeViewPasteElement`).animate({ width: '62' }, 150);
            }
            else {
                el.parent().parent().append(`
                    <div class="treeViewCopyChildPosition">
                        <div class="treeViewPasteElement" >
                            <button id='treeViewPasteElement-${id}' onclick="treeViewPageTablePasteElementCancel('${treeViewId}' ,this,event,${id},${parentId})" type="button" title="انصراف" class="btn treeViewPasteElementBtnCancel"><i class="fa fa-times"></i></button>                  
                        </div> 
                    </div>    
                    `)
                $(`#${treeViewId} .treeViewPasteElement`).animate({ width: '32' }, 150);
            }
        }
        else {
            $(`#${treeViewId} .treeViewCopyChildPosition`).remove()
        }

    }

}

function treeViewPageTableCopyPathBuild(treeViewId, elm) {

    let makeLine = $(elm).parents(".treeViewLi")
    let saveRoadMap = []
    let saveRoadMapText = ""

    $(makeLine).each(function (index) {
        let id = $(this).attr("id")
        saveRoadMap.push({ id: id.split("treeViewLi-")[1], text: $(`#${treeViewId} #${id} > div .treeViewContentTextAndBtnText`).text() })
    })

    saveRoadMap = saveRoadMap.reverse()

    for (let i = 0; i < saveRoadMap.length; i++) {
        if (saveRoadMap.length != 1 && saveRoadMap.length - 1 == i)
            saveRoadMapText += `<div class="treeviewPathLine"><span>${saveRoadMap[i].text}</span></div>`
        else
            saveRoadMapText += `<div class="treeviewPathLine"><span>${saveRoadMap[i].text}</span><span class="treeview-path-seperate"> / </span></div>`
    }

    $(`#${treeViewId} #treeViewCopyLineContent`).html(saveRoadMapText)
}

function treeViewPageTablePasteElementCancel(treeViewId, elm, e, id, parentId) {

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnCopy i`).removeClass("fa-arrow-down").addClass("fa-copy")
    $(`#${treeViewId} .treeViewCopyChildPosition`).remove()

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    delete treeViewPageTableModel[index].opr
    delete treeViewPageTableModel[index].copyList
    $(`#${treeViewId} #treeViewCopyLineContent`).empty()

    alertify.notify('عملیات کپی کنسل شد', 'success', 5, function () { });

}

function treeViewPageTablePasteElement(treeViewId, elm, e, id, parentId) {

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    let copyList = treeViewPageTableModel[index].copyList
    let copyListRoot = copyList.find((item) => item.parentId == null)
    let newCopyListWithoutRoot = copyList.filter(item => item.parentId != null)
    let newListParentId = id
    let treeViewEditMode = $(`#${treeViewId} #treeViewEditMode`).prop("checked")


    // ajax send (copyListRoot.id , newListParentId , newCopyListWithoutRoot)
    let ajax = true

    if (ajax) {

        //get from ajax
        let newCopyListWithoutRootFinall = treeViewPageTableNewPageBuild(treeViewId, copyList, copyListRoot, newCopyListWithoutRoot, newListParentId)
        //


        let tree = treeViewPageTableBuild(treeViewId, newCopyListWithoutRootFinall, treeViewEditMode)
        let currentLiUlLength = $(`#${treeViewId} #treeViewRootContent #treeViewLi-${id} > ul`).length

        if (currentLiUlLength == 0) {
            $(`#${treeViewId} #treeViewRootContent #treeViewLi-${id}`).append(tree)
        }
        else {
            tree = tree.substring(4, tree.length)
            tree = tree.substring(0, tree.length - 5)
            $(`#${treeViewId} #treeViewRootContent #treeViewLi-${id} > ul`).append(tree)
        }

        $(`#${treeViewId} #treeViewContentPlusMinus-${id}`).removeClass("d-none")

        delete treeViewPageTableModel[index].opr
        delete treeViewPageTableModel[index].copyList

    }
    else {

    }


}

function treeViewPageNewPageBuild(treeViewId, copyList, copyListRoot, newCopyListWithoutRoot, newListParentId) {

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnCopy i`).removeClass("fa-arrow-down").addClass("fa-copy")
    $(`#${treeViewId} .treeViewCopyChildPosition`).remove()
    $(`#${treeViewId} .treeViewContentTextAndBtnBtn`).addClass("treeviewShowHideBtn").animate({ width: '0' }, 150)


    //set parent root
    for (let i = 0; i < newCopyListWithoutRoot.length; i++) {
        if (newCopyListWithoutRoot[i].parentId == copyListRoot.id) {
            newCopyListWithoutRoot[i].parentId = newListParentId
        }
    }


    //set child root

    for (let i = 0; i < newCopyListWithoutRoot.length; i++) {

        let currentId = newCopyListWithoutRoot[i].id

        newCopyListWithoutRoot[i].id = unitTreeViewPageTableId

        for (let j = 0; j < newCopyListWithoutRoot.length; j++) {

            if (newCopyListWithoutRoot[j].parentId == currentId) {
                newCopyListWithoutRoot[j].parentId = newCopyListWithoutRoot[i].id
            }

        }

        unitTreeViewPageTableId++
    }

    return newCopyListWithoutRoot
}

function treeViewPageTableBuildChildOnKeydown(treeViewId, elm, e, id, parentId) {
    // e.preventDefault()
    // e.stopPropagation()
    if (e.keyCode == 13)
        treeViewPageTableBuildChild(treeViewId, elm, e, id, parentId)
}

function treeViewPageTableBuildChildOnClick(treeViewId, e) {
    e.preventDefault()
    e.stopPropagation()
}

function treeViewPageTableBuildChildBtnClick(treeViewId, elm, e, id, parentId) {
    e.preventDefault()
    e.stopPropagation()
    let el = $(`#${treeViewId} #treeview-buildChild-${id}`)
    treeViewPageTableBuildChild(treeViewId, el, e, id, parentId)
}

function treeViewPageTableBuildChild(treeViewId, el, e, id, parentId) {

    let index = treeViewPageTableModel.findIndex(item => item.treeViewId == treeViewId);
    if (treeViewPageTableModel[index].opr == "copy") {
        alertify.notify('شما در وضعیت کپی هستید، ابتدا این مرحله را به پایان برسانید', 'warning', 5, function () { });
        return
    }

    let element = $(el)
    let elementVal = $(el).val()
    let newChildId = unitTreeViewPageTableId++
    let treeViewSampleStatus = $("#treeViewEditMode").prop("checked")

    if (element.val() == null || element.val() == undefined || element.val().trim() == "") {
        alertify.notify('نام نمی تواند خالی بماند', 'warning', 5, function () { });
        $(`#${treeViewId} #treeViewEditElement-${id}`).focus()
        return
    }

    if (treeViewSampleStatus) {
        //ajax
        //let treeview_buildChildUrl = treeViewPageTableModel.insetApi
        //let treeview_buildChildModel = {
        //    parent: id,
        //    value: elementVal
        //}
        //$.ajax({
        //    url: treeview_buildChildUrl,
        //    type: "POST",
        //    data: JSON.stringify(treeview_buildChildModel),
        //    dataType: "json",
        //    contentType: "application/json",
        //    cache: false,
        //    success: function (result) {
        //if (result.successfull) {
        //  treeViewPageBuildChildAppendFunc(treeViewId, id, result.newChildId, elementVal)
        //}
        //else {
        //}
        //    },
        //    error: function (xhr) {
        //        error_handler(xhr, url);
        //    }
        //});
    }
    else {
        //treeViewPageBuildChildAppendFunc(treeViewId, id, newChildId, elementVal)
    }

    treeViewPageTableBuildChildAppendFunc(treeViewId, id, newChildId, element, elementVal)


}

function treeViewPageTableBuildChildAppendFunc(treeViewId, id, newChildId, element, elementVal) {
    let treeViewContent = element.closest(".treeViewLi")

    $(`#${treeViewId} #treeViewContentPlusMinus-${id}`).removeClass("d-none")
    $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
    $(`#${treeViewId} .treeviewBuildChild`).remove()
    $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
    $(`#${treeViewId} .treeViewEditElement`).remove()

    if ($(treeViewContent).children("ul").length == 0) {
        treeViewContent.append(`
            <ul>
                <li id='treeViewLi-${newChildId}' class="treeViewLi" data-parent='${id}'>
                    <div class="treeViewContent">
                        <div id='treeViewContentPlusMinus-${newChildId}' class="treeViewContentPlusMinus d-none"  onclick="treeViewPageTableCollapseAndExpand('${treeViewId}' ,this,event)"><i class="fa fa-minus"></i></div>
                            <div id='treeViewContentTextAndBtn-${newChildId}' class="treeViewContentTextAndBtn">
                                <div id='treeViewContentTextAndBtnText-${newChildId}' class="treeViewContentTextAndBtnText" onclick="treeViewPageTableShowBtnAndPath('${treeViewId}',this,event,${newChildId},${id})">${elementVal.trim()}</div>
                                <div id="treeViewContentTextAndBtnBtn-${newChildId}" class="treeViewContentTextAndBtnBtn treeviewShowHideBtn">
                                    <button id='treeViewContentTextAndBtnBtnBuildChild-${newChildId}' onclick="treeViewPageTableContentBtnBuildChild('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="ایجاد فرزند" class="btn treeViewContentTextAndBtnBtnBuildChild"><i class="fa fa-plus"></i></button>                  
                                    <button id='treeViewContentTextAndBtnBtnEdit-${newChildId}' onclick="treeViewPageTableContentBtnEdit('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="ویرایش" class="btn treeViewContentTextAndBtnBtnEdit"><i class="fas fa-edit"></i></button>    
                                    <button id='treeViewContentTextAndBtnBtnDelete-${newChildId}' onclick="treeViewPageTableContentBtnDelete('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="حذف" class="btn treeViewContentTextAndBtnBtnDelete"><i class="fa fa-trash"></i></button>                  
                                    <button id='treeViewContentTextAndBtnBtnCopy-${newChildId}' onclick="treeViewPageTableContentTextAndBtnBtnCopy('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="کپی زیر شاخه" class="btn treeViewContentTextAndBtnBtnCopy"><i class="fa fa-copy"></i></button>                                  

                                </div> 
                            </div>
                        </div>               
                    </div>
                </li>
            </ul>
        `)
    }
    else {
        $(treeViewContent).children("ul").append(`
            <li id='treeViewLi-${newChildId}' class="treeViewLi" data-parent='${id}'>
                <div class="treeViewContent">
                    <div id='treeViewContentPlusMinus-${newChildId}' class="treeViewContentPlusMinus d-none"  onclick="treeViewPageTableCollapseAndExpand('${treeViewId}' ,this,event)"><i class="fa fa-minus"></i></div>
                        <div id='treeViewContentTextAndBtn-${newChildId}' class="treeViewContentTextAndBtn">
                               <div id='treeViewContentTextAndBtnText-${newChildId}' class="treeViewContentTextAndBtnText" onclick="treeViewPageTableShowBtnAndPath('${treeViewId}' ,this,event,${newChildId},${id})">${element.val().trim()}</div>
                               <div id="treeViewContentTextAndBtnBtn-${newChildId}" class="treeViewContentTextAndBtnBtn">
                                    <button id='treeViewContentTextAndBtnBtnBuildChild-${newChildId}' onclick="treeViewPageTableContentBtnBuildChild('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="ایجاد فرزند" class="btn treeViewContentTextAndBtnBtnBuildChild"><i class="fa fa-plus"></i></button>                  
                                    <button id='treeViewContentTextAndBtnBtnEdit-${newChildId}' onclick="treeViewPageTableContentBtnEdit('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="ویرایش" class="btn treeViewContentTextAndBtnBtnEdit"><i class="fas fa-edit"></i></button>    
                                    <button id='treeViewContentTextAndBtnBtnDelete-${newChildId}' onclick="treeViewPageTableContentBtnDelete('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="حذف" class="btn treeViewContentTextAndBtnBtnDelete"><i class="fa fa-trash"></i></button>                  
                                    <button id='treeViewContentTextAndBtnBtnCopy-${newChildId}' onclick="treeViewPageTableContentTextAndBtnBtnCopy('${treeViewId}' ,this,event,${newChildId},${id})" type="button" title="کپی" class="btn treeViewContentTextAndBtnBtnCopy"><i class="fa fa-copy"></i></button>                                  
                               </div> 
                         </div>
                    </div>               
                 </div>
            </li>
        `)
    }

    alertify.notify(`زیرشاخه جدید به ${$(`#treeViewContentTextAndBtnText-${id}`).text()} اضافه شد`, 'success', 5, function () { });

    if ($(`#treeViewContentPlusMinus-${id} i`).hasClass("fa-plus"))
        $(`#treeViewContentPlusMinus-${id}`).click()
}

function treeViewPageTableUpdateOnKeydown(treeViewId, el, e, id, parentId) {
    // e.preventDefault()
    // e.stopPropagation()
    if (e.keyCode == 13)
        treeViewPageTableUpdateCurrentElement(treeViewId, el, e, id, parentId)
}

function treeViewPageTableUpdateBtn(treeViewId, elm, e, id, parentId) {
    e.preventDefault()
    e.stopPropagation()
    let el = $(`#${treeViewId} #treeViewEditElement-${id}`)
    treeViewPageTableUpdateCurrentElement(treeViewId, el, e, id, parentId)
}

function treeViewPageTableUpdateCurrentElement(treeViewId, elm, e, id, parentId) {

    let el = $(elm)
    let elmVal = $(elm).val()
    let treeViewSampleStatus = $("#treeViewEditMode").prop("checked")

    if (elmVal == null || elmVal == undefined || elmVal.trim() == "") {
        alertify.notify('نام نمی تواند خالی بماند', 'warning', 5, function () { });
        $(`#${treeViewId} #treeViewEditElement-${id}`).focus()
        return
    }


    if (treeViewSampleStatus) {
        //let treeview_editUrl = treeViewPageTableModel.edit_api
        //let treeview_editModel = id
        //$.ajax({
        //    url: treeViewPageTableModel_editUrl,
        //    type: "POST",
        //    data: JSON.stringify(treeview_editModel),
        //    dataType: "json",
        //    contentType: "application/json",
        //    cache: false,
        //    success: function (result) {
        //if (result.successfull) {
        // treeViewPageUpdateCurrentElementAppendFunc(treeViewId,result.id,elmVal)
        //}
        //else {
        //}
        //    },
        //    error: function (xhr) {
        //        error_handler(xhr, url);
        //    }
        //});
    }
    else {
        //treeViewPageUpdateCurrentElementAppendFunc(treeViewId, id, elmVal)
    }

    treeViewPageTableUpdateCurrentElementAppendFunc(treeViewId, id, elmVal)

}

function treeViewPageTableUpdateCurrentElementAppendFunc(treeViewId, id, elmVal) {

    $(`#${treeViewId} #treeViewContentTextAndBtnText-${id}`).text(`${elmVal.trim()}`)

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnEdit i`).removeClass("fa-times").addClass("fa-edit")
    $(`#${treeViewId} .treeViewEditElement`).remove()

    $(`#${treeViewId} .treeViewContentTextAndBtnBtnBuildChild i`).removeClass("fa-times").addClass("fa-plus")
    $(`#${treeViewId} .treeviewBuildChild`).remove()

    alertify.notify('تغییر نام با موفقیت انجام شد', 'success', 5, function () { });
}

function treeViewPageTableExpand(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");
        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
        $(item).nextAll(".slideToggle").removeClass("current");
        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();
        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }
}

function treeViewPageTableLoader(treeViewId, status) {
    if (status) {
        $(`#${treeViewId} #treeViewContent`).append(`<div id="treeviewLoading"><i class="fas fa-spinner"></i></div>`)
        $(`#${treeViewId} #treeViewRootContent`).css("overflow", "hidden")
    }
    else {
        $(`#${treeViewId} #treeViewContent #treeviewLoading`).remove()
        $(`#${treeViewId} #treeViewRootContent`).css("overflow", "auto")
    }
}

function treeViewPageTableEditMode(treeViewId, elm) {
    $(`#${treeViewId} #treeViewSearchField`).val("")
    $(`#${treeViewId} #treeViewRootContent > table >thead `).empty()
    $(`#${treeViewId} #treeViewRootContent > table >tbody `).empty()
    $(`#${treeViewId} #treeViewRootContent`).scrollTop(0)
    $(`#${treeViewId} #treeViewPathContent`).empty()
    $(`#${treeViewId} #treeViewCopyLineContent`).empty()

    getTreeViewPageTable(treeViewId, false, () => treeViewPageTableCallbackChangeMode(treeViewId))
}

function treeViewPageTableCallbackChangeMode(treeViewId) {
}

function treeViewPageTableReset(treeViewId) {
    $(`#${treeViewId} #treeViewSearchField`).val("")
    getTreeViewPageTable(treeViewId, false)

}

//must be delete

function ajaxFakeData(treeViewId) {

    treeViewPageTableLoader(treeViewId, true)

    let treeList = buildTreeList()

    return treeList
}

function buildTreeList() {

    let treeJson = { columns: [], data: [] }
    let arrIds = ["id", "email", "createDateTime"]
    let maxList = Math.floor(Math.random() * 100)

    treeJson.columns = [
        { id: "text", title: "درخت" },
        { id: "email", title: "ایمیل" },
        { id: "createDateTime", title: "تاریخ ایجاد" },
    ]

    treeJson.data.push({
        id: unitTreeViewPageTableId,
        parent: null,
        text: `(${unitTreeViewPageTableId}) مقدار : ${makeid(10)} / ای جدی پدر : null / ای جدی : ${unitTreeViewPageTableId}`,
        title: arrIds[Math.floor(Math.random() * (2 - 0 + 1) + 0)], 
        tree: unitTreeViewPageTableId,
        email: `${unitTreeViewPageTableId}@email.com`,
        createDateTime: Date.now()
    })
    unitTreeViewPageTableId++

    for (let i = 0; i < maxList; i++) {

        let buildParentId = treeJson.data.length == 1 ? 0 : makeParent(treeJson.data, unitTreeViewPageTableId)

        treeJson.data.push({
            id: unitTreeViewPageTableId,
            parent: buildParentId,
            text: `(${unitTreeViewPageTableId}) مقدار : ${makeid(10)} / ای جدی پدر : ${buildParentId} / ای جدی : ${unitTreeViewPageTableId}`,
            title: arrIds[Math.floor(Math.random() * (2 - 0 + 1) + 0)],    
            tree: unitTreeViewPageTableId,
            email: `${unitTreeViewPageTableId}@email.com`,
            createDateTime: Date.now()
        })
        unitTreeViewPageTableId++
    }

    return treeJson
}

function makeParent(treeArray, unitTreeViewPageTableId) {

    let random = randomFunc(Math.floor(Math.random() * 100), unitTreeViewPageTableId)

    if (treeArray[random] != undefined)
        return treeArray[random].id
    else
        return makeParent(treeArray, unitTreeViewPageTableId)

}

function randomFunc(randomNumber, unitTreeViewPageTableId) {
    if (randomNumber != unitTreeViewPageTableId)
        return randomNumber
    if (randomNumber == unitTreeViewPageTableId)
        randomFunc(Math.floor(Math.random() * 100), unitTreeViewPageTableId)
}

function makeid(length) {
    let result = '';
    const characters = 'ضصثقفغعهخحجچشسیبلاتنمکگپظطزرذدئو';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function treeViewSearchListModal(treeViewId, searchList) {

    let searchListLength = searchList.length
    let saveRoadMap = []
    let saveRoadMapText = ""


    $(`#${treeViewId} #treeViewSearchList`).html("")

    for (let i = 0; i < searchListLength; i++) {

        let makeLine = $(`#${searchList[i].id}`).parents(".treeViewLi")
        let saveRoadMapLine = []
        let saveId = ""
        let treeList = []

        $(makeLine).each(function (index) {
            let id = $(this).attr("id")

            if (index == 0) {
                saveId = id.split("treeViewLi-")[1]
            }

            saveRoadMapLine.push($(`#${treeViewId} #${id} > div .treeViewContentTextAndBtnText`).text())

        })

        saveRoadMap.push({
            id: saveId,
            saveRoadMapLine,

        })
    }

    for (let c = 0; c < saveRoadMap.length; c++) {
        let currentId = saveRoadMap[c].id
        let newSaveRoadMap = saveRoadMap[c].saveRoadMapLine.reverse()

        saveRoadMapText += `<li onclick="treeViewSeachModalSelectLine('${treeViewId}' , this , event ,${currentId})">`
        saveRoadMapText += `<div class="treeViewModalNumberOfBox">${c + 1}</div>`
        saveRoadMapText += `<div class="treeViewModalBox">`

        for (let i = 0; i < newSaveRoadMap.length; i++) {

            if (newSaveRoadMap.length != 1 && newSaveRoadMap.length - 1 == i)
                saveRoadMapText += `<div class="treeviewPathLine text-danger"><span>${newSaveRoadMap[i]}</span></div>`
            else
                saveRoadMapText += `<div class="treeviewPathLine"><span>${newSaveRoadMap[i]}</span><span class="treeview-path-seperate"> / </span></div>`

        }

        saveRoadMapText += `</div></li>`
    }

    $(`#${treeViewId} #treeViewSearchList`).html(saveRoadMapText)
    treeViewModalShow(treeViewId, "treeViewSearchModal")
}

function treeViewSeachModalSelectLine(treeViewId, elm, e, id) {
    treeViewModalClose(treeViewId, "treeViewSearchModal")
    showBtnJustOnSearchTreeView = true
    $(`#treeViewContentTextAndBtnText-${id}`).click()
}

function treeViewModalShow(treeViewId, modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var firstRowsCountItem = $(`#${treeViewId} #${modal_name} .pagerowscount .dropdown-menu .dropdown-item:first`).text();
    $(`#${treeViewId} #${modal_name} .pagerowscount button:first`).text(firstRowsCountItem);

    $("input").attr("autocomplete", "off");

    $(`#${treeViewId} #${modal_name}`).modal({ backdrop: "static", show: true });
}

function treeViewModalClose(treeViewId, modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var form = $(`#${treeViewId} #${modal_name} div.modal-body`).parsley();
    $(`#${treeViewId} #${modal_name} div.modal-body *`).removeClass("parsley-error");
    if (typeof form !== "undefined" && form !== undefined)
        if (form.length > 1)
            form[0].reset();
        else
            form.reset();


    $(`#${treeViewId} #${modal_name}`).modal("hide");
    $(`#${treeViewId} #${modal_name} .pagerowscount`).removeClass("dropup");
    $(`#${treeViewId} #${modal_name} .modal-dialog`).removeAttr("style");

    pagetable_id = "pagetable";

    if (typeof arr_pagetables != "undefined") {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (index >= 0) {

            var pagetable_currentrow = arr_pagetables[index].currentrow;

            $(`#${treeViewId} #pagetable .pagetablebody > tbody > #row${pagetable_currentrow}`).focus();
        }

    }
}






