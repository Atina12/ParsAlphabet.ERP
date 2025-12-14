var orginalModel = { Id: 0, ParentId: 0 }
var nodes = "";
$('#treev1').treed();

var flag = false;

function generateNodes(arr) {

    if (flag === false) {
        flag = true;
        nodes += `<ul id="tree1">`;
    }
    else {
        nodes += `<ul>`;
    }

    for (var i = 0; i < arr.length; i++) {

        var val = arr[i];

        nodes += `<li collapse="true">
                    <span id="nodeTxt${val.id}"  onclick="clicknode(this,event,${val.parentId},${val.id})">${val.name}
                        <div class='button-operation max-height-30'>
                            <button type='button' onclick='addNode(this,event,${val.parentId},${val.id})' class='btn btn-info pl-1 pr-2 border-left'>
                                    <i class='fa fa-plus'></i>
                            </button>
                            <button type='button' id='editNode' onclick='editNode(this,event,${val.parentId},${val.id})' class='btn btn-success pl-2 border-left'>
                                    <i class='fa fa-edit'></i>
                            </button>
                            <button type='button' onclick='deleteNode(this,event,${val.parentId},${val.id})'  class='btn btn-danger px-1'>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                    </span>`;

        if (val.children !== null) {
            generateNodes(val.children);
        }
        nodes += "</li>";
    }

    nodes += "</ul>";
    return nodes;
}

function clicknode(element, ev, parentId, nodeId) {
    //ev.preventDefault();

    var collapse = $(element).closest('li').attr("collapse");
    $(element).closest('li').attr("collapse", !(collapse === "true"));

    orginalModel.Id = nodeId;
    orginalModel.ParentId = parentId;

    $(element).closest('li').click();
}

var data = [
    {
        id: 1, name: 'شاخه اصلی', parentId: 0, children: [
            {
                id: 2, name: 'includes', parentId: 1, children: [
                    { id: 3, name: 'inc-1', parentId: 2, children: null },
                    { id: 4, name: 'inc-2', parentId: 2, children: null },
                ]
            },
            {
                id: 5, name: 'css', parentId: 0, children: [
                    {
                        id: 6, name: 'images', parentId: 5, children: [
                            {
                                id: 7, name: 'logos', parentId: 6, children: [
                                    { id: 8, name: 'white.svg', parentId: 7, children: null },
                                    { id: 9, name: 'dark.svg', parentId: 7, children: null },
                                ]
                            },
                            {
                                id: 10, name: 'gallery', parentId: 6, children: [
                                    { id: 11, name: '1.jpg', parentId: 10, children: null },
                                    { id: 12, name: '2.jpg', parentId: 10, children: null },
                                    { id: 13, name: '3.jpg', parentId: 10, children: null },
                                    { id: 14, name: '4.jpg', parentId: 10, children: null },
                                    { id: 15, name: '5.jpg', parentId: 10, children: null },
                                ]
                            },
                            { id: 16, name: 'contact-page.jpg', parentId: 6, children: null },
                        ]
                    },
                    { id: 17, name: 'style.css', parentId: 5, children: null },
                ]
            },
            {
                id: 18, name: 'js', parentId: 0, children: [
                    { id: 19, name: 'jquery.js', parentId: 18, children: null },
                    { id: 20, name: 'main.js', parentId: 18, children: null },
                ]
            },
            { id: 21, name: 'index.php', parentId: 0, children: null },
            { id: 22, name: 'contact.php', parentId: 0, children: null },
            { id: 23, name: 'about-us.php', parentId: 0, children: null }
        ]
    }
];

var result = generateNodes(data);
nodes = "";
$("#treev1").html(result);
$('#treev1').treed();

function addNode(elm, ev, parentId, id) {

    ev.preventDefault();
    ev.stopPropagation();

    var findNode = $(elm).parents()[2];

    if ($("#addNodeBox").length > 0) {
        alertify.error("نود قبلی اصلاح شود");
    }
    else if ($(findNode).has('ul').length > 0) {

        var findLastNode = $(findNode).find('ul li').last()

        $(findLastNode).after(`<li collapse="true">
                                    <input id="addNodeBox" class="form-control" onkeydown="submitAddNode(this,event,${parentId},${id})" value="" />
                               </li>`);

        $("#addNodeBox").trigger('focus');
    }
    else {

        var nodeOutput = `<ul>
                                <li collapse="true">
                                    <input id="addNodeBox" class="form-control" onkeydown="submitAddNode(this,event,${parentId},${id})" value="" />
                                </li>
                           </ul>`;
        
        $(nodeOutput).appendTo(findNode);

        $("#addNodeBox").trigger('focus');
    }
}

function colexp(indicator) {
    var icon = $(indicator);
    icon.toggleClass('fa-minus-circle' + " " + 'fa-plus-circle');
    $(indicator).parent().children().children().toggle();

    var collapse = $(indicator).closest('li').attr("collapse");
    $(indicator).closest('li').attr("collapse", !(collapse === "true"));

}

function submitAddNode(elem, ev, parentId, id) {
    if (ev.which === KeyCode.Enter) {
        var inputVal = $(elem).val().trim();
        var findNode = $(elem).parents()[2];

        if ($('#addNodeBox').val() == '') {
            alertify.error("ورود اطلاعات الزامی");
        }

        else if ($(findNode).has('ul li span').length > 0) {

            $("#addNodeBox").replaceWith(`<span id="nodeTxt${id}"  onclick="clicknode(this,event,${parentId},${id})">${inputVal}
                                               <div class='button-operation'>
                                                   <button type='button' onclick='addNode(this,event,${parentId},${id})' class='btn btn-info pl-1 pr-2 border-left'>
                                                           <i class='fa fa-plus'></i>
                                                   </button>
                                                   <button type='button' id='editNode' onclick='editNode(this,event,${parentId},${id})' class='btn btn-success px-1 border-left'>
                                                           <i class='fa fa-edit'></i>
                                                   </button>
                                                   <button type='button' onclick='deleteNode(this,event,${parentId},${id})' class='btn btn-danger px-1'>
                                                           <i class='fa fa-times'></i>
                                                   </button>
                                               </div>
                                          </span>`);
        }

        else {

            var findSpan = $(findNode).children()[0];
            $(findNode).addClass("branch");
            $(findSpan).before(`<i class="indicator fa fa-minus-circle" onclick="colexp(this)"></i>`);

            $("#addNodeBox").replaceWith(`<span id="nodeTxt${id}"  onclick="clicknode(this,event,${parentId},${id})">${inputVal}
                                               <div class='button-operation'>
                                                   <button type='button' onclick='addNode(this,event,${parentId},${id})' class='btn btn-info pl-1 pr-2 border-left'>
                                                           <i class='fa fa-plus'></i>
                                                   </button>
                                                   <button type='button' id='editNode' onclick='editNode(this,event,${parentId},${id})' class='btn btn-success px-1 border-left'>
                                                           <i class='fa fa-edit'></i>
                                                   </button>
                                                   <button type='button' onclick='deleteNode(this,event,${parentId},${id})' class='btn btn-danger px-1'>
                                                           <i class='fa fa-times'></i>
                                                   </button>
                                               </div>
                                          </span>`);
        }
    }

    if (ev.which === KeyCode.Esc) {
        var findNode = $(elem).parents()[2];
        var findChildUl = $(findNode).children()[2];
        var findChildLi = $(findChildUl).find('li').last();

        if ($(findNode).has('ul > li > span').length > 0)
            $(findChildLi).remove();

        else
            $(elem).remove(findChildUl);
        
       
    }
}

function editNode(elm, ev, parentId, id) {

    ev.preventDefault();
    ev.stopPropagation();

    $("#delNode").remove();

    if ($("#editNodeBox").length > 0) {
        alertify.error("نود قبلی اصلاح شود");
    }
    else {
        var node = $(`#nodeTxt${id}`);
        var elm = node.text().trim();
        node.replaceWith(`<input id="editNodeBox" required class="form-control" onkeydown="submitEditNode(this,event,${parentId},${id})" value="${elm}" />`);
        $("#editNodeBox").focus();
    }
}

function submitEditNode(elem, ev, parentId, id) {
    if (ev.which === KeyCode.Enter) {

        var inputVal = $(elem).val().trim();

        if ($('#editNodeBox').val() == '') {
            alertify.error("ورود اطلاعات الزامی");
        }

        else {
            // function Submit To DB
            $("#editNodeBox").replaceWith(`<span id="nodeTxt${id}"  onclick="clicknode(this,event,${parentId},${id})">${inputVal}
                                           <div class='button-operation'>
                                               <button type='button' onclick='addNode(this,event,${parentId},${id})' class='btn btn-info pl-1 pr-2 border-left'>
                                                       <i class='fa fa-plus'></i>
                                               </button>
                                               <button type='button' id='editNode' onclick='editNode(this,event,${parentId},${id})' class='btn btn-success px-1 border-left'>
                                                       <i class='fa fa-edit'></i>
                                               </button>
                                               <button type='button' onclick='deleteNode(this,event,${parentId},${id})' class='btn btn-danger px-1'>
                                                       <i class='fa fa-times'></i>
                                               </button>
                                           </div>
                                       </span>`);

        }
    }

    if (ev.which === KeyCode.Esc) {
        var oldInput = $(elem).attr("value");

        $("#editNodeBox").replaceWith(`<span id="nodeTxt${id}"  onclick="clicknode(this,event,${parentId},${id})">${oldInput}
                                           <div class='button-operation'>
                                               <button type='button' onclick='addNode(this,event,${parentId},${id})' class='btn btn-info pl-1 pr-2 border-left'>
                                                       <i class='fa fa-plus'></i>
                                               </button>
                                               <button type='button' id='editNode' onclick='editNode(this,event,${parentId},${id})' class='btn btn-success px-1 border-left'>
                                                       <i class='fa fa-edit'></i>
                                               </button>
                                               <button type='button' onclick='deleteNode(this,event,${parentId},${id})' class='btn btn-danger px-1'>
                                                       <i class='fa fa-times'></i>
                                               </button>
                                           </div>
                                       </span>`);

    }
}

function deleteNode(elm, ev) {

    ev.preventDefault();
    ev.stopPropagation();

    $("#delNode").remove();

    $(elm).after(`<div id="delNode" class="del-node-box">
                    <div class="triangle-up"></div>
                    <div class="del-node">
                        <p class="text-center font-13 mb-0">حذف شود؟</p>
                        <button type="submit" onclick='submitYesDel(this,event)' class="btn btn-outline-success">بله</button>
                        <button type="submit" onclick='submitNoDel(this,event)' class="btn btn-outline-dark">خیر</button> 
                    </div>
                 </div>`).fadeIn("slow");

}

function submitYesDel(elm) {

    var findNode = $(elm).parents()[4];
    $(findNode).remove();
    alertify.success('حذف سطر انجام شد');
    $("#delNode").remove();

}

function submitNoDel() {
    alertify.warning('انصراف از حذف');

    $("#delNode").remove();
}

function testbl(ev) {
    ev.preventDefault();
  
    $("#delNode").remove();
}