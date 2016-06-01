function ScrollableListY(config){
    config = {
        itemHeight: 45,
        containerHeight: $('body').height() - 48,
        element: '#scroller',
        totalItems : 250,
    };


    var $scope;

    var startDate = new Date();
    var endDate = new Date();
    var itemHeight = config.itemHeight;
    var containerHeight = config.containerHeight;

    var element = config.element;
    var totalItems = config.totalItems;

    var pages = 8;
    var itemsPerPage = Math.ceil(containerHeight / itemHeight);
    var batchSize = itemsPerPage * pages;
    var appendPagesAtStart = 7;
    var startAppendingScrollPages = 3;
    var startPrependingScrollPages = 2;
    var loaderSize = 95;
    var staticLoaderSize = 95;

    var spaceSize = 0;
    var trigerAppendNewData = 0;
    var trigerAppendNewDataWithoutSpaceSize = 0;
    ///renderam na pocetku 6 stranica i na 4 dodajem 1 item na kraj i micem 1 s pocetka
    var trigerAppendNewPage = 0;
    var trigerAppendNewPageWithoutSpaceSize = 0;
    var dataPointerAppend = 0;
    var dataPointerPrepend = 0;
    var trigerPrependNewPage = 0;
    var trigerPrependNewPageWithoutSpaceSize = 0;
    var prependMinimum = 0;
    var data = [];
    var elements = [];
    var myScroll;

    var firstDataLoad = true;
    var firstPageAppend = true;
    var loadAppendDataInProgress = false;
    var appendInProgress = false;
    var hasPrependLoader = false;
    var hasAppendLoader = false;

    var firstPrependDataLoad = true;
    var firstPagePrepend = true;
    var loadPrependDataInProgress = false;
    var prependInProgress = false;

    var loaderVisible = true;
    var latestDirection = 0;




    $scope.mainNav_settings_click = function () {
        var avaliableItems = dataPointerAppend - appendPagesAtStart * itemsPerPage;
    }

    function renderItem(data) {
        if (data.nan) {
            return '<li class="liReplacer"><div class="date">' + data['date'] + '</div></li>';
        } else {
            return '<li class="liReplacer"><div class="date">' + data['date'] + '</div><div class="timesTrained">' + data['total'] + '</div><div class="successRate">' + data['success'] + '%</div></li>';
        }
    }

    function replaceItemContent(data) {
        if (data.nan) {
            return '<div class="date">' + data['date'] + '</div>';
        } else {
            return '<div class="date">' + data['date'] + '</div><div class="timesTrained">' + data['total'] + '</div><div class="successRate">' + data['success'] + '%</div>';
        }
    }


    function setupPrepend() {
        prependMinimum = itemsPerPage * (0) * itemHeight;
        trigerPrependNewPage = itemsPerPage * (startPrependingScrollPages) * itemHeight;;
        trigerPrependNewPageWithoutSpaceSize = trigerPrependNewPage;

    }

    function updateLoader(prepend) {
        if (prepend) {
            var transformY = spaceSize - loaderSize;
            $(element + ' .loader')[0].style.transform = ' translate(0px,' + transformY + 'px) translateZ(0px)';;
        } else {
            var transformY = dataPointerAppend * itemHeight;
            $(element + ' .loader')[0].style.transform = ' translate(0px,' + transformY + 'px) translateZ(0px)';;
        }
    }

    function toggleLoader() {
        if (loaderVisible) {
            loaderSize = 0;
            $(element + ' .loader')[0].style.display = 'none';
            loaderVisible = false;
        } else {
            loaderSize = staticLoaderSize;
            $(element + ' .loader')[0].style.display = 'block';
            loaderVisible = true;
        }
    }


    function appendItemsAtStart(insertPages) {
        appendInProgress = true;
        var insertDataLength = itemsPerPage * (insertPages);
        var insertData = data.slice(dataPointerAppend, itemsPerPage * (insertPages) + dataPointerAppend);
        for (var i = 0; i < insertData.length; i++) {
            var result = renderItem(insertData[i]);
            var transformY = i * itemHeight + spaceSize;
            $(element + ' .content').append(result);
        }
        elementsJquery = $(element + ' .content li');
        for (var i = 0; i < elementsJquery.length; i++) {
            var transformY = i * itemHeight + spaceSize;
            elementsJquery[i].style.transform = ' translate(0px,' + transformY + 'px) translateZ(0px)';
            elements.push(elementsJquery[i]);
        }



        dataPointerAppend = (insertPages) * itemsPerPage;
        updateLoader();

        trigerAppendNewPage = itemsPerPage * (startAppendingScrollPages) * itemHeight;
        trigerAppendNewPageWithoutSpaceSize = trigerAppendNewPage;
        firstPageAppend = false;

        myScroll.refresh(itemsPerPage * itemHeight * insertPages + loaderSize, 0);


        appendInProgress = false;
    }

    function prependItem(y) {


        //check if items avaliable if not hide loader
        var avaliableItems = dataPointerAppend - appendPagesAtStart * itemsPerPage;

        if (avaliableItems <= 0) {
            if (loaderVisible && latestDirection == -1) {
                toggleLoader();
            }
        } else {
            if (!loaderVisible && latestDirection == -1) {
                toggleLoader();
            }
        }

        if (appendInProgress || y > trigerPrependNewPageWithoutSpaceSize) {
            return null;
        }



        var spaceForNewItems = trigerPrependNewPageWithoutSpaceSize - y;
        var nmItems = Math.floor(spaceForNewItems / itemHeight);
        if (nmItems > avaliableItems) {
            nmItems = avaliableItems;
        }

        appendInProgress = true;
        var i = 0;
        while (i < nmItems) {
            var position = dataPointerAppend - appendPagesAtStart * itemsPerPage - 1;
            var insertData = data[position];
            //elements

            var singleItem = elements.pop();
            var result = replaceItemContent(insertData);
            singleItem.innerHTML = result;
            elements.unshift(singleItem);

            var transformY = (position) * itemHeight;
            singleItem.style.transform = ' translate(0px,' + transformY + 'px) translateZ(0px)';
            dataPointerAppend--;

            spaceSize -= itemHeight;
            i++;
        }

        updateLoader(true);
        hasPrependLoader = true;

        var size = itemHeight * nmItems;
        trigerPrependNewPageWithoutSpaceSize -= size;
        trigerPrependNewPage = trigerPrependNewPageWithoutSpaceSize + spaceSize;

        trigerAppendNewPageWithoutSpaceSize -= size;

        myScroll.refresh(itemsPerPage * itemHeight * appendPagesAtStart + spaceSize + loaderSize, (spaceSize - loaderSize) * -1, true);

        appendInProgress = false;

    }


    function appendItem(y) {
        //update loader
        var avaliableItems = dataPointerAppend;
        if (avaliableItems >= totalItems) {
            if (loaderVisible && latestDirection == 1) {
                toggleLoader();
            }
        } else {
            if (!loaderVisible && latestDirection == 1) {
                toggleLoader();
            }
        }


        if (appendInProgress || y < trigerAppendNewPageWithoutSpaceSize) {
            return null;
        }

        var spaceForNewItems = y - trigerAppendNewPageWithoutSpaceSize;
        var nmItems = Math.floor(spaceForNewItems / itemHeight);
        if (nmItems + dataPointerAppend > totalItems) {
            nmItems = totalItems - dataPointerAppend;
        }
        if (dataPointerAppend - 1 + nmItems >= data.length) {
            return null;
        }
        appendInProgress = true;
        var i = 0;
        while (i < nmItems) {

            var insertData = data[dataPointerAppend];
            //elements

            var singleItem = elements.shift();
            var result = replaceItemContent(insertData);
            singleItem.innerHTML = result;
            elements.push(singleItem);

            var transformY = (dataPointerAppend) * itemHeight;
            singleItem.style.transform = ' translate(0px,' + transformY + 'px) translateZ(0px)';
            dataPointerAppend++;

            spaceSize += itemHeight;
            i++;
        }

        hasAppendLoader = true;
        updateLoader();

        var size = itemHeight * nmItems;
        trigerAppendNewPageWithoutSpaceSize += size;
        trigerAppendNewPage = trigerAppendNewPageWithoutSpaceSize + spaceSize;

        trigerPrependNewPageWithoutSpaceSize += size;

        myScroll.refresh(itemsPerPage * itemHeight * appendPagesAtStart + spaceSize + loaderSize, spaceSize * -1, true);

        appendInProgress = false;
    }

    function loadNewDataPageForAppend() {
        console.log("loadNewDataPageForAppend");
        if (loadAppendDataInProgress) {
            return null;
        }
        loadAppendDataInProgress = true;

        var sendData = {
            from: kendo_DateHelper.calculateDateMinusDays(endDate, batchSize),
            to: kendo_DateHelper.calculateDateMinusDays(endDate, 0),
            trick_id: 3
        };
        var def = $.Deferred()
        var promise = def.promise();
        promise.then(function (newData) {
            data = data.concat(newData);

            var lastDate = kendo_DateHelper.getDateFromIsoFormat(newData[newData.length - 1]['date']);
            endDate = kendo_DateHelper.getDateFromIsoFormat(kendo_DateHelper.calculateDateMinusDays(lastDate, 1));
            //calculate when to load new page
            if (firstDataLoad) {
                trigerAppendNewData = batchSize * 0.5 * itemHeight;
                trigerAppendNewDataWithoutSpaceSize = trigerAppendNewData;
                firstDataLoad = false;
            } else {
                trigerAppendNewDataWithoutSpaceSize += batchSize * itemHeight;
                trigerAppendNewData = spaceSize + trigerAppendNewDataWithoutSpaceSize;
            }
            loadAppendDataInProgress = false;
            //if firstAppend append 6 pages
            if (firstPageAppend) {
                appendItemsAtStart(appendPagesAtStart);
            }
        }, function (error) {
        });
        kmodel_TrickStatistics.getStatistic(def, sendData);
    }



    $('#MyContainer').css('height', containerHeight + 'px');

    function updatePositionScroll() {
        var y = Math.abs(this.y);
        if (y > trigerAppendNewDataWithoutSpaceSize) {
            loadNewDataPageForAppend();
        }
        ;
        updatePositionsFromRaf(y, this.directionY);
    }

    function updatePositionScrollEnd() {
        var y = Math.abs(this.y);
        if (y > trigerAppendNewDataWithoutSpaceSize) {
            loadNewDataPageForAppend();
        }
        ;

        prependItem(y);
        appendItem(y);

    }



    function updatePositionsFromRaf(y, direction) {
        latestDirection = direction;
        if (direction == 1) {
            appendItem(y);
        } else if (direction == -1) {
            prependItem(y);
        }
    }

    var wrapper = document.getElementById('wrapper');

    myScroll = new IScroll(wrapper, { probeType: 3, updateItems: updatePositionsFromRaf, useTransition: true });
    myScroll.refresh();
    myScroll.on('scroll', updatePositionScroll);
    myScroll.on('scrollEnd', updatePositionScrollEnd);


    setupPrepend();
    loadNewDataPageForAppend();

    $scope.updateTotal = function(total){
        totalItems = total;
    }

    return $scope;
}