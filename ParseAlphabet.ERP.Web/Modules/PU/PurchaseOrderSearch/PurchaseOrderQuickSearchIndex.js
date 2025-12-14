var winQuickSearch, quickSearchWindow = true;

$("body").on("keydown", ev => {
    if (ev.ctrlKey && ev.keyCode == 77 && quickSearchWindow == true)
        openQuickSearchForm();
});

function openQuickSearchForm(isOrder = true) {

    if (typeof winQuickSearch == "undefined" || winQuickSearch.closed) {

        let screenWidth = $(window).width();
        let screenHeight = $(window).height();


        if (isOrder)
            winQuickSearch = window.open("/PU/PurchaseOrderSearch/quicksearchorder", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);
        else
            winQuickSearch = window.open("/PU/PurchaseOrderSearch/quicksearchinvoice", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);


        window.onbeforeunload = () => winQuickSearch.close();
    }
    else
        winQuickSearch.focus();
}


