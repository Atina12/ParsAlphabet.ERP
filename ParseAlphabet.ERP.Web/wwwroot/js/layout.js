async function initForm() {
    get_corpinfo();
    get_userinfo();
    get_languages();
    get_navigation();

}

function get_userinfo() {
    var p_url = '/api/HomeApi/getuserimage';
    $.ajax({
        url: p_url,
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            fill_userpicture(result);
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function get_navigation() {
    var p_url = '/api/HomeApi/getnavigation';
    $.ajax({
        url: p_url,
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            $("#menu").html(``);
            $(`#menu`).append(`<li><a onclick="navigation_item_click('/Dashboard/DashboardIndex','داشبورد',this);" class="waves-effect level-one-nav nav-menu-click"><i class="icon-accelerator"></i><span class="sidebar-nav-item">داشبورد</span></a></li>`);
            var str = fill_navigation(result);
            $("#menu").append(str);
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function navigation_item_click(href, titlePage = null, elm = null) {
    admissionAttenderWindow = false;
    $("li a.nav-item-mm").parent().removeClass("mm-active");
    var t0 = performance.now();

    if (elm != null) {
        $(elm).parent().addClass("mm-active");
    }

    if (+window.innerWidth <= 768 && !$("body").hasClass("enlarged"))
        $("button.button-menu-mobile").click();

    initialPage();
    $("#content-page").addClass("displaynone");
    $("#loader").removeClass("displaynone");

    if (titlePage != null)
        $("#title_page").text(`${titlePage} | ${serviceProviderFullTitle}`);
    else {
        if (typeof viewData_form_title !== "undefined")
            $("#title_page").text(`${viewData_form_title} | ${serviceProviderFullTitle}`);
        else
            $("#title_page").text(serviceProviderFullTitle);
    }

    let tl = 0;

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#content`).html(result);
            t1 = performance.now();
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#loader").addClass("displaynone");
    $("#content-page").fadeIn().removeClass("displaynone");

    // Don't Remove
    //console.log(`LoadingTTL ${href} => ${t1 - t0}`);
}

function navigationClick_modal(navigationConfig, newActivePgId, oldPageActiveId) {
    activePageId = newActivePgId;
    $("#navigation_modal_close").attr("onclick", `navigation_modal_close("${oldPageActiveId}")`);

    var url = navigationConfig.url;
    var parameters = navigationConfig.parameters;
    if (parameters != undefined && parameters != null && parameters.length > 0) {
        for (var i = 0; i < parameters.length; i++) {
            url += "/" + parameters[i].value;
        }
    }

    if (navigationConfig.modal != undefined && navigationConfig.modal != null) {
        $(`#navigationModal #modal_title`).text(navigationConfig.modal.headerTitle);
        if (navigationConfig.modal.modalSize != "") {
            $(`#navigationModal #modal-dialog`).removeClass();
            $(`#navigationModal #modal-dialog`).addClass("modal-dialog");
            $(`#navigationModal #modal-dialog`).addClass("modal-size-" + navigationConfig.modal.modalSize);
        }
    }
    $.ajax({
        url: url,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#navigationModalContent`).find("script").remove();
            $(`#navigationModalContent`).html(result);
            modal_show("navigationModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

}

function navigation_modal_close(oldActivePgId) {
    activePageId = oldActivePgId;
    if (typeof after_navigationModalClose != "undefined")
        after_navigationModalClose();
    modal_close("navigationModal");
}

function initialPage() {
    $(".relational-caption").text("");
    $(".relationalbox").addClass("displaynone");
}

function get_languages() {
    var p_url = '/api/HomeApi/getuserlanguages';
    $.ajax({
        url: p_url,
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            fill_languages(result);
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function get_corpinfo() {
    var p_url = '/api/SetupApi/getsetupinfo';
    $.ajax({
        url: p_url,
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            fill_layout_corpinfo(result);
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function fill_layout_corpinfo(item) {
    if (item == null)
        return "";

    $("#corpinfo").html("");
    $("#corpinfo-sm").html("");
    var str = "";
    str = `<img src="data:image/png;base64,${item.logo}" height="30" alt="لوگوی ${item.name}" title="${item.name}" />
           <label>${item.name}</label>
          `;

    $("#corpinfo").append(str);
    str = "";
    if (item.logo != null)
        str += `<img src="data:image/png;base64,${item.logo}" alt="لوگوی ${item.name}" title="${item.name}" height="37">`;
    $("#corpinfo-sm").append(str);
}

function fill_userpicture(item) {
    if (item == null)
        return "";
    var str = "";
    str += '<li>';
    if (item.picture != null)
        str += '<img src="data:image/png;base64,' + item.picture + '" alt="' + item.fullname + '" class="rounded-circle">';
    else
        str += '<img src="/Content/images/blank-person.png" class="rounded-circle">';
    $("#userimage").append(str);
}

function fill_navigation(list) {
    if (list == null)
        return "";

    var str = "";

    for (var i in list) {
        var item = list[i];

        if (item.children.length != 0) {
            str += '<li>';
            if (item.linkAddress == "/") {
                if (item.level == 1)
                    str += `<a id="level_one${item.id}" href="javascript:void(0);" class="waves-effect nav-menu-click level-one-nav">`;
                else if (item.level == 2)
                    str += `<a id="level_two${item.id}" href="javascript:void(0);" class="waves-effect nav-menu-click level-two-nav">`;
                else if (item.level == 2)
                    str += `<a id="level_tree${item.id}" href="javascript:void(0);" class="waves-effect nav-menu-click" nav-menu-click level-two-nav>`;
                else
                    str += `<a href="javascript:void(0);" class="waves-effect nav-menu-click">`;

            }
            else
                str += `<a onclick="navigation_item_click('${item.linkAddress}','${item.title}',this)" href="javascript:void(0);" class="waves-effect">`;


            if (item.level == 1)
                str += '<i class="sidebar-nav-item-icon ' + item.iconName + '"></i>';
            str += '<span>' + item.title + '<span class="float-left menu-arrow"><i class="mdi mdi-chevron-right"></i><span></span>';
            str += '</a>';
            str += `<ul class="submenu ${item.level == 1 ? "level-ul-one" : item.level == 2 ? "level-ul-two" : item.level == 3 ? "level-ul-tree" : ""}">`;
            str += fill_navigation(item.children);
            str += "</ul>";
            str += '</li>';
        }
        else {
            str += '<li>';
            if (item.linkAddress != "" && item.linkAddress != "/")
                str += `<a class="nav-item-mm" onclick="navigation_item_click('${item.linkAddress}','${item.title}',this)">${item.title}`;
            else
                str += `<a>${item.title}`;

            str += '</a>';
            str += '</li>';
        }
    }
    return str;
}

function fill_languages(list) {
    if (list == null)
        return "";
    var str1 = "";
    var str2 = "";
    for (var i in list) {
        if (list[i].isActive == true)
            str1 += '<img src = "/Content/images/flags/' + list[i].flagName + '_flag.jpg" class="ml-2" height = "12" alt = "" />' + list[i].name + '<span class="mdi mdi-chevron-down" ></span >';
        else
            str2 += '<a class="dropdown-item" href="/Home/ChangeLanguage?langcode=' + list[i].code + '"><img src="/Content/images/flags/' + list[i].flagName + '_flag.jpg" alt="" height="16" /><span>' + list[i].name + '</span></a>';
    }
    $("#activelanguage").append(str1);
    $("#languages").append(str2);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

initForm();

$("a.nav-menu-click").on("click", function () {
    $("div.waves-ripple.waves-rippling").remove();
});
