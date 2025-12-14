var winQuickSearch, quickSearchWindow = true;

$("body").on("keydown", ev => {
    if (ev.ctrlKey && ev.keyCode == 77 && quickSearchWindow == true)
        openQuickSearchForm();
});

function openQuickSearchForm(isRequest = true) {

    if (typeof winQuickSearch == "undefined" || winQuickSearch.closed) {

        let screenWidth = $(window).width();
        let screenHeight = $(window).height();

        if (isRequest)
            winQuickSearch = window.open("/WH/WarehouseTransactionSearch/quicksearchrequest", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);
        else
            winQuickSearch = window.open("/WH/WarehouseTransactionSearch/quicksearchtransaction", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);

        window.onbeforeunload = () => winQuickSearch.close();
    }
    else
        winQuickSearch.focus();
}

