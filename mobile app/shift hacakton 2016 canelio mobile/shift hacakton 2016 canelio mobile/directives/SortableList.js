function SortableList(config) {
    var $scope = {};

    var itemHeight = config.itemHeight;
    var numItems = config.numItems;
    var maxScrollY = itemHeight * numItems;
    var IscrollFixAddHeight = config.IscrollFixAddHeight;


    var wrapper =  $(config.container +' #wrapper')[0];

    var myScroll = new IScroll(wrapper, { useTransition: true, preventDefault: false });



    console.log("maxScrollY",maxScrollY);
    //console.log(maxScrollY);
    //myScroll._initEvents(true);
    //myScroll._initEvents();
    //myScroll.startY = -5;
    //myScroll.y = -5;
    myScroll.refresh(maxScrollY + IscrollFixAddHeight, 0, 0, 0);

    var list = $(config.container + ' #slipList')[0];
    var slip = new Slip(list);
    slip.maxScrollY = maxScrollY - config.containerHeight;
    //slip.scrollableContainer = document.getElementById('scroller');
    slip.scrollableContainer =$(config.container + '  #scroller')[0];

    $scope.refresh = function (num , containerHeight) {
        numItems = num;
        containerHeight = containerHeight || config.containerHeight;
        maxScrollY = numItems * itemHeight;
        myScroll.refresh(maxScrollY, 0, 0, 0);
        slip.maxScrollY = maxScrollY - config.containerHeight;
    }

    $scope.getComponents = function () {
       return{
            iscroll: myScroll,
            slip:slip
       }
    }



    list.addEventListener('slip:beforereorder', function (e) {
        myScroll._initEvents(true); //remove events
        console.log("removed events");
        console.log("set slip y at:", myScroll.y);
        slip.currentScrollY = 0 - myScroll.y;
    }, false);


    list.addEventListener('slip:reorder', function (e) {
        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
        myScroll._initEvents(); //add events
        myScroll.startY = 0 - slip.currentScrollY;
        myScroll.y = 0 - slip.currentScrollY;
        console.log("set iscroll startY at:", 0 - slip.currentScrollY)
        myScroll.refresh(maxScrollY, 0, 0, 0);
        console.log("returned false");
    }, false);



    return $scope

}