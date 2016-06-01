function d3AreaChart(config) {
    var $scope  = {};

    var totalHeight = 300;
    if (config.height) {
        console.log("setting totalheight", config.height)
        totalHeight = config.height;
    }

    var margin = { top: 20, right: 0, bottom: 80, left: 0 },
    width = $('body').width()  - margin.right - margin.left,
    height = totalHeight - margin.top - margin.bottom,
    numberOfYTicks = 4;
    var animationLength = 1000;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var xScale = d3.scale.linear();

    var x = xScale
        .range([0, width]);



    var yScale = d3.scale.linear();

    yScale.ticks(numberOfYTicks);

    var y = yScale
        .range([height, 0]);



    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(numberOfYTicks);

    function xValueScaled(d, i) {
        return x(i);
    }

    var area = d3.svg.area()
        .x(function (d, i) { return x(i); })
        .y0(height)
        .y1(function (d) { return y(d[config.yField]); });
    if (config.curved) {
        area.interpolate("cardinal")
    }

    var line = d3.svg.line()
    .x(function (d, i) { return x(i); })
    .y(function (d) { return y(d[config.yField]); });
    if(config.curved){
        line.interpolate("cardinal")
    }
    


    var svg = d3.select(config.element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    svg.append("g")
    .attr("class", "y axis")

    var areaSvg = svg.append("path")
        .attr("class", "area");
    if (config.areaFillColor) {
        areaSvg.style("fill", config.areaFillColor)
    }
    if (config.areaFillOpacity) {
        areaSvg.style("fill-opacity", config.areaFillOpacity);
    }

    var lineSvg = svg.append("path")
        .attr("class", "areaLine")
        .style("fill", "none");
    if (config.lineColor) {
        lineSvg.style('stroke', config.lineColor);
    }
    if (config.lineWidth) {
        lineSvg.style('stroke-width', config.lineWidth);
    }


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")

    svg.append("g")
        .attr("class", "yNumbers")

    //.attr("transform", "translate(40, 0)");





    $scope.data = function (data) {
        var single = false;
        var howManyDecimals = 0;
        var seeMaxTick = config.seeMaxTick;
        if (data.length == 1) {
            single = true;
            seeMaxTick = true;
            var obj = {};
            $.extend(obj,data[0])
            data.push(obj);
        } else if (data.length == 0) {
            return false;
        }

        function sortByDateAscending(a, b) {
            // Dates will be cast to numbers automagically:
            return a[config.xField] - b[config.xField];
        }
        

        console.log("------------------", JSON.stringify(data));

        data.forEach(function (d) {
            if (config.xIsMysqlDate) {
                d[config.xField] = kendo_DateHelper.getDateFromIsoFormat(d[config.xField]);
            } else {
                d[config.xField] = d[config.xField];
            }
            
            d[config.yField] = +d[config.yField];
        });
        data = data.sort(sortByDateAscending);


        x.domain([0, data.length - 1]);


        var brTikova = data.length - 1;
        var pomakZaPrvogIzadnjeg = 30;
        var jedanTickZauzima = 40;
        var maxBrojTikova = ($('body').width() - pomakZaPrvogIzadnjeg) / 40;
        if (brTikova > maxBrojTikova) {
            brTikova = maxBrojTikova;
        }
        var danMje7 = d3.time.format("%d.%b, %y");

        xAxis.tickSize(0, 0, 0);
        xAxis.ticks(brTikova).tickFormat(
                    function (v, i) {
                        var dat = danMje7(data[v][config.xField]);
                        return dat;
                    });



        var yMin = d3.min(data, function (d) { return d[config.yField]; });
        var yMax = d3.max(data, function (d) { return d[config.yField]; });

        var yTicks = 4;
        if (single) {
            yMin = 0;
        }

        function stepY(min, max, single) {

            if (seeMaxTick) {
                var step = Math.floor((max - min) / yTicks);
                if (step == 0) {
                    howManyDecimals = 1;
                    step = Math.floor(((max - min) / yTicks) * 10) / 10;
                    if (step == 0) {
                        step = Math.floor(((max - min) / yTicks) * 100) / 100;
                        howManyDecimals = 2;
                        if (step == 0) {
                            step = Math.floor(((max - min) / yTicks) * 1000) / 1000;
                            howManyDecimals = 3;
                        }
                    }
                }
            } else {
                var step = Math.round((max - min) / yTicks);
                if (step == 0) {
                    step = Math.round(((max - min) / yTicks) * 10) / 10;
                    howManyDecimals = 1;
                    if (step == 0) {
                        step = Math.round(((max - min) / yTicks) * 100) / 100;
                        howManyDecimals = 2;
                        if (step == 0) {
                            step = Math.round(((max - min) / yTicks) * 1000) / 1000;
                            howManyDecimals = 3;
                        }
                    }
                }
            }
            return step == 0 ? 0.001 : step;
        }

        //y.domain([yMin, yMax]);
        y.domain([yMin, yMax]);
        y = yScale
       .range([height, 0]);

        yAxis.tickSize(-width, 0, 0)
        .tickValues(d3.range(yMin, yMax, stepY(yMin, yMax)))

        if (config.yLabelFormat) {
            yAxis.tickFormat(config.yLabelFormat(howManyDecimals));
        }
        svg.selectAll(".area").data([data]);
        //   .attr("d", area)
        //   .attr("transform", "translate(0,"+height+"),scale(1,0)");

        svg.selectAll(".areaLine").data([data]);
        //.attr("transform", "translate(0," + height + "),scale(1,0)");

        //update y grid lines

        //cleanup rules before
        //svg.selectAll(".rule").remove();
        //var rules = svg.selectAll("x.tick")
        //  .data(y.ticks(numberOfYTicks))
        //  .enter().append("svg:g")
        //  .attr("class", "rule");

        //rules.append("svg:line")
        //.attr("x1", 0)
        //.attr("x2", width - 1)
        //.attr("y1", y)
        //.attr("y2", y);


        //rules.append("svg:line")
        //.attr("x1", 0)
        //.attr("x2", width - 1)
        //.attr("y1", y)
        //.attr("y2", y);
        //end update y grid lines

        svg.selectAll(".x")
            //.transition(animationLength)
          .call(xAxis);

        svg.selectAll(".y")
            .transition(animationLength)
           .call(yAxis);

        yAxis.tickSize(0, 0, 0)
        svg.selectAll(".yNumbers")
            .transition(animationLength)
           .call(yAxis);


        //var gridLines = svg.selectAll('.y.tick')
        // .append("svg:line")
        //.attr("x1", -40)
        //.attr("x2", width - 1)
        //.attr("y1", 0)
        //.attr("y2", 0)
        //.attr("class", 'gridLine');

        //clean up y axis
        //svg.selectAll(".y .tick line").remove();
        svg.selectAll(".y .domain").remove();
        svg.selectAll(".y .tick text").remove();
        svg.selectAll(".yNumbers .tick  text").attr("transform", "translate(60, -10)");

        //add svg for adding text because it is possible real svg will have display none
        var heightSvg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + 0 + "," + 9999 + ")")
        .attr('id', 'heightSvg')

        var getHiddenElementHeight = function (element) {
            
            var tempId = 'tmp-' + Math.floor(Math.random() * 99999);//generating unique id just in case
            $(element).clone()
            .css('position', 'absolute')
            .css('height', 'auto').css('width', '1000px')
            //inject right into parent element so all the css applies (yes, i know, except the :first-child and other pseudo stuff..
            .appendTo($('#heightSvg'))
            .css('left', '-10000em')
            .addClass(tempId).show()
            h = d3.select('#heightSvg text').node().getBBox().height;
            $('.' + tempId).remove()
            return h;
        }

        //rotate dates on x axis
        var textCenterHeightMultipler = 1.8;
        svg.selectAll(".x text")  // select all the text elements for the xaxis
         .attr("transform", function (d) {
             return "translate(" + getHiddenElementHeight(this) + "," + getHiddenElementHeight(this) * textCenterHeightMultipler + "),rotate(90)";
         })

        //move first a little bit
        var firstXg = svg.selectAll(".x g").first();
        firstXg.attr('transform', 'translate(5, 0)');

        var firstXgTick = svg.selectAll('.x g line').first().attr('transform', 'translate(-4, 0)');


        var lastXg = svg.selectAll(".x g").last();
        var lastXgTransform = lastXg.attr('transform');
        lastXgTransform = lastXgTransform.split('(')[1];

        lastXgTransform = lastXgTransform.split(',')[0];
        lastXgTransform = parseFloat(lastXgTransform);
        //ako je veci od body width-1 stavi na body width-1
        var maxLastTrasformX = $('body').width() - 1;

        if (lastXgTransform > maxLastTrasformX) {

            lastXgTransform = maxLastTrasformX;
            lastXg.attr('transform', 'translate(' + lastXgTransform + ',0)');
        }

        var lastText = svg.selectAll(".x g text").last();

        var heightText = getHiddenElementHeight(lastText.node());
        var luft = 3;
        if ((lastXgTransform + luft) > maxLastTrasformX) {

            var textTransformX = maxLastTrasformX - (lastXgTransform + luft);

            lastText.attr('transform', 'translate(' + textTransformX + ',' + heightText * textCenterHeightMultipler + '),rotate(90)');
        }



        d3.select("#heightSvg").remove();


        //make transition
        svg.selectAll(".area")
            .attr('transform', 'translate(0,' + height + '),scale(1,0)')
            .attr("d", area)
           .transition()
           .duration(animationLength)
            .attr('transform', 'translate(0,0),scale(1,1)')

        //.attr("transform", "translate(0,0),scale(1,1)");

        svg.selectAll(".areaLine")
            .attr('transform', 'translate(0,' + height + '),scale(1,0)')
            .attr("d", line)
           .transition()
           .duration(animationLength)
           .attr("d", line)
          .attr("transform", "translate(0,0),scale(1,1)");
    }
    
    return $scope

}