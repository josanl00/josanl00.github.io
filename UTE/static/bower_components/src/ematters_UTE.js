/* global Handlebars, d3, Backform, Backbone */
var Empowering = {};

(function() {
    'use strict';

    Empowering.Service = function(spec) {
        var service = {};

        service.foo = function() {
            return spec.name;
        };

        return service;
    };

    Empowering.LOCALES = {
        en: d3.locale({
            decimal: ",",
            thousands: ".",
            grouping: [3],
            currency: ["", " €"],
            dateTime: '%A, %e de %B de %Y, %X',
            date: '%d/%m/%Y',
            time: "%H:%M:%S",
            periods: ["AM", "PM"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }),
        ca: d3.locale({
            decimal: ',',
            thousands: '.',
            grouping: [3],
            currency: ['', ' €'],
            dateTime: '%A, %e de %B de %Y, %X',
            date: '%d/%m/%Y',
            time: '%H:%M:%S',
            periods: ['AM', 'PM'],
            days: [
                'diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous',
                'divendres', 'dissabte'
            ],
            shortDays: ['dg.', 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.'],
            months: [
                'gener', 'febrer', 'març', 'abril', 'maig', 'juny',
                'juliol', 'agost', 'setembre', 'octubre', 'novembre',
                'desembre'
            ],
            shortMonths: [
                'gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.',
                'set.', 'oct.', 'nov.', 'des.'
            ]
        }),
        es: d3.locale({
            decimal: ',',
            thousands: '.',
            grouping: [3],
            currency: ['', ' €'],
            dateTime: '%A, %e de %B de %Y, %X',
            date: '%d/%m/%Y',
            time: '%H:%M:%S',
            periods: ['AM', 'PM'],
            days: [
                'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes',
                'sábado'
            ],
            shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ],
            shortMonths: [
                'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep',
                'oct', 'nov', 'dic'
            ]
        })
    };

    Empowering.Graphics = {

    };
    //x: x-coordinate
    // y: y-coordinate
    //w: width
    //h: height
    //r: corner radius
    //tl: top_left rounded?
    //tr: top_right rounded?
    //bl: bottom_left rounded?
    //br: bottom_right rounded?
    function roundedRect(x, y, w, h, r, tl, tr, bl, br) {
        var retval;
        retval  = 'M' + (x + r) + ',' + y;
        retval += 'h' + (w - 2 * r);
        if (tr) {
            retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r;
        }
        else {
            retval += 'h' + r;
            retval += 'v' + r;
        }
        retval += 'v' + (h - 2 * r);
        if (br) {
            retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + r;
        }
        else {
            retval += 'v' + r;
            retval += 'h' + -r;
        }
        retval += 'h' + (2 * r - w);
        if (bl) {
            retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + -r;
        }
        else {
            retval += 'h' + -r;
            retval += 'v' + -r;
        }
        retval += 'v' + (2 * r - h);
        if (tl) {
            retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r;
        }
        else {
            retval += 'v' + -r;
            retval += 'h' + r;
        }
        retval += 'z';
        return retval;
    }

    Empowering.Graphics.CT105 = function(attrs) {

        var ct105 = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;
        console.log("data is", data)

        ///Main chart must be divided into 2 different charts 
        ///"cons_bar" and "avg_bar" in order to get a good effect 
        ///of the "roundedRect" function
        var cons_d = attrs.data.consumption;
        var avg_d = attrs.data.averageConsumption;
        console.log("cons_d",cons_d)
        ///How to make list of arrays
        /*var a = {"apples": 3, "oranges": 4, "bananas": 42};    
        var array_keys = new Array();
        var array_values = new Array();
        for (var key in a) {
            array_keys.push(key);
            array_values.push(a[key]);
        };
        alert(array_keys);
        alert(array_values);*/

        ///Arrays of different data for bar charts
        var tariffs = new Array(); 
        var cons = new Array(); //cons_bar data, "consumption" key is assigned as 1 for matrix calculation
        var avg = new Array(); // avg_bar data,  "averageConsumption" key is assigned as 2 for matrix calculation
        var total = new Array(); 
        for (var key in cons_d) {
          tariffs.push(key);
          cons.push(cons_d[key]);
          total.push(cons_d[key]);
        };
        for (var key in avg_d) {
          avg.push(avg_d[key]);
          total.push(avg_d[key]);
        };

        ///Array for legends depending on 
        ///number of tariffs
        var l_tariffs = new Array(); 
        for (key in tariffs) {
            l_tariffs.push(40);
        };
        //console.log("number of tariffs", l_tariffs) //e.g. [40,40,40]
        var l_stacked = []; //legend positions
        l_tariffs.reduce(function(a,b,i) { return l_stacked[i] = a+b; },0);

        ///Sorted values according to preference of 
        ///data visualization.
        //Caution! to perform this method, keys should 
        ///be ordered from more consumption (i.e. "pN") to
        ///less (i.e. "p0")
        cons.sort(function(a,b) {return a-b;});
        avg.sort(function(a,b) {return a-b;});
        total.sort(function(a,b) {return b-a;});
        l_stacked.sort(function(a,b) {return a-b;});

        ///Add to beginning of arrays each key to allow
        ///the matrix calculation
        cons.unshift("consumption");
        avg.unshift("averageConsumption");
        total.unshift("total");

        console.log("tariffs", tariffs) //e.g. ["three","two","one"]
        console.log("user consumption", cons) //e.g. [180,100,20,1]
        console.log("average consumption", avg) //e.g. [180,100,20,1]
        console.log("total", total) //e.g. ["three","two","one"]
        console.log("legend positions", l_stacked) //e.g. [120,80,40]

        ///Definition of chart environment

        ///Internal sizes
        var width =  400,
        height = 300,
        barWidth = width/2,
        labelSize = 24,
        barHeight = height - labelSize-40,
        rectWidth = barWidth * 0.375,
        barEnerWidth = barWidth * 0.5;

        ///Responsive environment
        var main = d3.select(attrs.container)
                   .append('div')
                   .classed("svg-container-ct105", true) //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 600 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true); 

        ///Definition of ranges
        var ycons = d3.scale.linear().range([0,barHeight]);
        var yavg = d3.scale.linear().range([0, barHeight]);
        var ytext = d3.scale.linear().range([0,-barHeight]);
        //var z = d3.scale.ordinal().range(["darkblue", "blue", "lightblue"])
        //var cons_color = d3.scale.ordinal().range(["#AECCEC", "#3278C2", "#161686"]);
        //var avg_color = d3.scale.ordinal().range(["#F6CF9F", "#ED933D", "#FE733A"]);
        var cons_color = d3.scale.ordinal().range(["#161686", "#3278C2", "#AECCEC"]);
        var avg_color = d3.scale.ordinal().range(["#FE733A", "#ED933D", "#F6CF9F"]);

        ///Data model as matrix for each chart:
        ///1 row & CHART_ID+TARIFF_N columns like CHART_ID,TARIFF_1,...,TARIFF_N
        var cons_matrix = [cons];
        var avg_matrix = [avg];
        var total_matrix = [total];

        ///Distribution of data for each chart
        //var cons_remapped =["c1","c2","c3"].map(function(dat,i){
        var cons_remapped =tariffs.map(function(dat,i){
            return cons_matrix.map(function(d,ii){
                return {x: ii, y: d[i+1] };
            })
        });
        //var avg_remapped =["c1","c2","c3"].map(function(dat,i){
        var avg_remapped =tariffs.map(function(dat,i){  
            return avg_matrix.map(function(d,ii){
                return {x: ii, y: d[i+1] };
            })
        });
        var total_remapped =tariffs.map(function(dat,i){  
            return total_matrix.map(function(d,ii){
                return {x: ii, y: d[i+1] };
            })
        });

        ///Call to stacked method with x, y0, y1 predefined
        var cons_stacked = d3.layout.stack()(cons_remapped);
        var avg_stacked = d3.layout.stack()(avg_remapped);
        var total_stacked = d3.layout.stack()(total_remapped);

        ///Definition of domains
        ycons.domain([0, d3.max(total_stacked[total_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);
        yavg.domain([0, d3.max(total_stacked[total_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);
        ytext.domain([0, d3.max(total_stacked[total_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);
        /*ycons.domain([0, d3.max(cons_stacked[cons_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);
        yavg.domain([0, d3.max(avg_stacked[avg_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);*/

        ///MAIN CHART DEFINITION
        ///Right chart
        //var y_stacked = []; //legend positions
        //(function (d){return ycons(cons_stacked[d][0].y);}).reduce(function(a,b,i) { return y_stacked[i] = a+b; },0)
        //console.log("max",y_stacked)
        var cons_bar = main.selectAll("div")
        .data(cons_stacked)
        .enter().append("g")
        .style("fill", function(d, i) { return cons_color(i); })
        //.style("fill-opacity", .8)
        .attr('transform', 'translate(' + (width-width/8) + ',228)')
        /*.attr("transform", function(d) {
            console.log("daigiual",ycons(y_varois))
            return "translate("+(width*2-25-barEnerWidth-rectWidth+5)+","+
            (-ycons(y_varois)+barHeight)+") rotate(180)"
        ;}*/
        ;

            //"translate("+(width*2-25-barEnerWidth-rectWidth+5)+","+
            //(-barHeight+stack_cons)+") rotate(180)");
        //.style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

        ///Left chart
        var avg_bar = main.selectAll("div")
        .data(avg_stacked)
        .enter().append("g")
        .style("fill", function(d, i) { return avg_color(i); })
        /*.attr("transform", function(d) {
            console.log("daigiual",yavg(ya_varois))
            return "translate("+(barEnerWidth+rectWidth*2+5)+","+
            (-yavg(ya_varois)+barHeight)+") rotate(180)"
        ;}*/
        .attr('transform', 'translate(10,228)')
        ;
        //.style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

        ///Legend chart
        var cons_legend = main.selectAll('div')
            .data(l_stacked)
            .enter().append('g')
            .style("fill", function(d, i) { return cons_color(i); })
            .attr('transform', 'translate(' + (barWidth+5) + ','+
                (l_stacked.length<4 ? barHeight-30 : barHeight+5)+')');

        var avg_legend = main.selectAll('div')
            .data(l_stacked)
            .enter().append('g')
            .style("fill", function(d, i) { return avg_color(i); })
            .attr('transform', 'translate(' + (barWidth+5) + ','+
                (l_stacked.length<4 ? barHeight-30 : barHeight+5)+')');

        ///DRAWING STACKED BAR WITH ROUNDED EFFECT
        ///Right chart 
        cons_bar.selectAll("path")
            .data(function(d){return d;})
            .enter().append("path")          
            .attr("d", function(d) { 
                console.log("ji",d)
                console.log("jor",ycons(d.y))
                console.log("jor1",ycons(d.y0))
                return roundedRect(
                    //rectWidth, ycons(d.y), barEnerWidth,-ycons(d.y)-ycons(d.y0),0,// barEnerWidth/5, 
                    rectWidth, -ycons(d.y)-ycons(d.y0), barEnerWidth, ycons(d.y)+barEnerWidth/5, barEnerWidth/5, 
                    //rectWidth,-ycons(d.y)-ycons(d.y0), barEnerWidth, ycons(d.y)+barEnerWidth/5, barEnerWidth/5, 
                    //x(d.x),-y(d.y)-y(d.y0)-100,100,y((d).y)+25,25,
                    //false, false, true, true);
                    //false,false,false, false);
                    true, true,false, false);
                });

        ///Left chart
        avg_bar.selectAll("path")
            .data(function(d){return d;})
            .enter().append("path")          
            .attr("d", function(d) { 
                /*console.log("ji",d)
                console.log("jor",ycons(d.y))
                console.log("jor1",ycons(d.y0))*/
                return roundedRect(
                    //rectWidth, yavg(d.y), barEnerWidth,-yavg(d.y)-yavg(d.y0),0,// barEnerWidth/5,
                    rectWidth,-yavg(d.y)-yavg(d.y0), barEnerWidth, yavg(d.y)+barEnerWidth/5, barEnerWidth/5, 
                    //false, false, true, true);
                    true, true, false, false);
                });

        ///Legend chart
        cons_legend.append('path')
                .attr('d', function(d,i) {
                    return roundedRect(
                        100, -l_stacked[i], 50, 25, 14, 
                        false, true, false, true);
                });

        avg_legend.append('path')
                .attr('d', function(d,i) {
                    return roundedRect(
                        50, -l_stacked[i], 50, 25, 14,
                        true, false, true, false);
                });

        ///DEFINITION OF LABELS
        ///Sorted from more to less
        tariffs = attrs.tariffs || {
            0: 'More consumption++',
            1: 'More consumption+',
            2: 'More consumption',
            3: 'Less consumption',
            4: 'Less consumption-',
            5: 'Less consumption--'
        };
        /*var styles = {
          0: 'averageConsumption',
          1: 'consumption'
        };*/
        var labels = attrs.labels || {
            0: 'Your neighbors',
            1: 'You'
        };
        var icons = {
            0: '\uf0c0',
            1: '\uf007'
        };

        //TEXT INSIDE BAR
        ///Right chart
        cons_bar.selectAll("text")
            .data(function(d){return d;})
            .enter().append("text")
            .attr('x', barWidth-width/8-(width/8)/2 )
            .attr('y', function(d) { return 10 +ytext(d.y0)+ytext(d.y)+30; })
            //.attr('x', -barEnerWidth-25)
            //.attr('y', function(d) {return  22+(ycons(d.y0))-25;})
            //.attr("transform","translate(0,0) rotate(180)")
            .attr('class', 'label_ct105_bar')
            .attr('style', 'fill: white')
            .attr("text-anchor", "middle")
            .text(function(d,i) {return Math.round(d.y) + ' kWh';});

        ///Left chart
        avg_bar.selectAll("text")
            .data(function(d){return d;})
            .enter().append("text")
            .attr('x', barWidth-width/8-(width/8)/2)
            .attr('y', function(d) { return 10 +ytext(d.y0)+ytext(d.y)+30;})
            //.attr('x', -barEnerWidth-25)
            //.attr('y', function(d) {return  22+(yavg(d.y0))-25;})
            //.attr("transform","translate(0,0) rotate(180)")
            .attr('class', 'label_ct105_bar')
            .attr('style', 'fill: white')
            .attr("text-anchor", "middle")
            .text(function(d,i) {return Math.round(d.y) + ' kWh';});

        ///Legend chart
        avg_legend.append('text')
            .attr('x', 100)//barWidth-width/8-(width/8)/2 )
            .attr('y', function(d,i) { return -l_stacked[i]+16; })
            .attr('class', 'label_ct105_legend')
            .attr('style', 'fill: white')
            .attr("text-anchor", "middle")
            .text(function(d,i) { return tariffs[i]; });

        ///ICONS
        ///Right chart
        cons_bar.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' +
                            'text-anchor: start')
            .style("fill", function(d, i) { return cons_color(length); })
            .attr('x', rectWidth+barEnerWidth+25+5)
            .attr('y', 20)
            //.attr("transform", "translate("+(45)+","+(-barHeight+25)+") rotate(180)")
            .text(icons[1]);

        ///Left chart
        avg_bar.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' +
                            'text-anchor: end')
            .style("fill", function(d, i) { return avg_color(length); })
            .attr('x', rectWidth-30)
            .attr('y', 20)
            //.attr("transform", "translate("+(barWidth)+","+(-barHeight+25)+") rotate(180)")
            .text(icons[0]);

        ///LINE BETWEEEN CHART AND ICON
        ///Right chart
        cons_bar.append("rect")
            .attr("class", "line")
            .attr("x", rectWidth+barEnerWidth-100) 
            .attr("y", 20)
            .attr("width", rectWidth+barEnerWidth-10)
            .attr("height", 2)
            .style("fill", function(d, i) { return cons_color(length); })
            //.attr("transform", "translate("+(barWidth-15-10)+","+(-barHeight)+") rotate(180)")
            .style("stroke-width", "1px");
        
        ///Left chart
        avg_bar.append("rect")
            .attr("class", "line")
            .attr("x", 10) 
            .attr("y", 20)
            .attr("width", rectWidth+barEnerWidth-10)
            .attr("height", 2)
            .style("fill", function(d, i) { return avg_color(length); })
            //.attr("transform", "translate("+(barWidth+50-10)+","+(-barHeight+yavg(ya_varois)-10)+") rotate(180)")
            .style("stroke-width", "1px");

        ///LABEL TEXTS
        ///Right chart
        cons_bar.append('text')
        .attr("text-anchor", "middle")
            .attr('x', barWidth/2+24)
            .attr('y', 65)
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .style("fill", function(d, i) { return cons_color(length); })
            //.attr("transform", "translate("+(barWidth-65)+","+(-barHeight-40+25)+") rotate(180)")
            .text(labels[1]);

        ///Left chart
        avg_bar.append('text')
        .attr("text-anchor", "middle")
            .attr('x', barWidth/2+20)
            .attr('y', 65)
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .style("fill", function(d, i) { return avg_color(length); })
            //.attr("transform", "translate("+(barWidth-85)+","+(-barHeight-40)+") rotate(180)")
            .text(labels[0]);
 
        return ct105;

    };


    Empowering.Graphics.CT202A = function(attrs) {

        var ct202a = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        var dataIn = attrs.data["monthlyStats"];
        console.log("conss",dataIn);

        //removeByAttr(arr, "timeSlot", "total");    
        
        /*
        Definition of time formats
        */              

        var parseDate = d3.time.format('%Y%m').parse;

        ///***Preparation for data selection***
        dataIn.forEach(function(d) {
            d.month = parseDate(d.month + "");
        });

        /*
        Definition of chart environment
        */
        /*var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;*/
        var margin = {top: 50, right: 20, bottom: 20, left: 30},
            width  = 672 - margin.left - margin.right, //Default: 1000-margin-left-margin-right
            height = 336  - margin.top  - margin.bottom; //Default: 500-margin.top-margin-bottom
         
        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);
         
        var x1 = d3.scale.ordinal();
         
        var y = d3.scale.linear()
            .range([height, 0]);
         
        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");
         
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));
         
        /*var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);*/
        //var color = d3.scale.ordinal()
        //    .range(["#161686","#3278C2","#AECCEC"]);
        var color = d3.scale.ordinal().range(["#161686", "#3278C2", "#AECCEC","#FE733A", "#ED933D", "#F6CF9F"]);
        //var avg_color = d3.scale.ordinal().range(["#FE733A", "#ED933D", "#F6CF9F"]);

        var svg = d3.select(attrs.container)
                   .append('div')
                   .classed("svg-container-ot302a", true) //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 672 336")
                   //class to make it responsive
                   .classed("svg-content-responsive", true)
                   .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        /*var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/
         
        var yBegin;
         
        var innerColumns = {
          "column1" : ["p1_cons","p2_cons","p3_cons"],
          "column2" : ["p1_avg","p2_avg","p3_avg"]
        };
        console.log("inner",innerColumns);

        var columnHeaders = d3.keys(dataIn[0]).filter(function(key) { return (key !== "month"); });
        color.domain(d3.keys(dataIn[0]).filter(function(key) { return (key !== "month"); }));
        console.log("headers",columnHeaders);
        
        dataIn.forEach(function(d) {
            var yColumn = new Array();
            d.columnDetails = columnHeaders.map(function(name) {
              for (var ic in innerColumns) {
                if($.inArray(name, innerColumns[ic]) >= 0){
                  if (!yColumn[ic]){
                    yColumn[ic] = 0;
                  }
                  yBegin = yColumn[ic];
                  yColumn[ic] += +d[name];
                  return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
                }
              }
            });
            d.total = d3.max(d.columnDetails, function(d) { 
              return d.yEnd; 
            });
          });
        console.log("later",dataIn);

 
  x0.domain(dataIn.map(function(d) { return d.month; }));
  x1.domain(d3.keys(innerColumns)).rangeRoundBands([0, x0.rangeBand()]);
 
  y.domain([0, d3.max(dataIn, function(d) { 
    return d.total; 
  })]);
 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
 
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("");
 
  var project_stackedbar = svg.selectAll(".project_stackedbar")
      .data(dataIn)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.month) + ",0)"; });
 
  project_stackedbar.selectAll("rect")
      .data(function(d) { return d.columnDetails; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { 
        return x1(d.column);
         })
      .attr("y", function(d) { 
        return y(d.yEnd); 
      })
      .attr("height", function(d) { 
        return y(d.yBegin) - y(d.yEnd); 
      })
      .style("fill", function(d) { return color(d.name); });
 
  var legend = svg.selectAll(".legend")
      .data(columnHeaders.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
 
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
 
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
 

 



        return ct202a;
        };


//(d3.select('text').text(function(d){return d.types;})
    Empowering.Graphics.CT202B_CONS = function(attrs) {

        var ct202b_cons = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        var dataIn = attrs.data["summary"];
console.log("gg",dataIn)
        /*
        Definition of formats and widths
        */

        var w = 150,                        //width, default: 300
            h = 150,                            //height, default: 300
            //r = 75,                          //radius, default: 100
            r = Math.min(w, h) / 2,
            color = d3.scale.ordinal()
            .range(["#161686", "#3278C2", "#AECCEC"]),
            percentageFormat = d3.format("%");

        /*
        Data restructuration*/

        var cons = [dataIn[0]["p1_cons"],dataIn[0]["p2_cons"],dataIn[0]["p3_cons"]];
console.log("hello",cons);


        /*var nested = d3.nest()
          .key(function(d) {return d.type;})
          .key(function(d) {return d.consumption;})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) { 
            return {
              //"length": leaves.length, 
              "cons": d3.sum(leaves, function(d) {return console.log("hello",d); parseFloat(d.p1_cons);}),
                "cons": d3.sum(leaves, function(d) {return parseFloat(d.p2_cons);})
            } 
          })
          .entries(dataIn);*/
          //.entries(data);
        var acum = cons.reduce(function(a,b) { return a+b; },0);

        /*var acum = d3.sum(nested, function(d) { 
                        return d.cons; 
                    });*/
        var percentage =[];
        cons.forEach(function(d,i) {
                        percentage[i] = cons[i] / acum ;
                    });

        console.log("hello",cons);
        /*
        Definition of chart environment
        */

        var vis = d3.select(attrs.container)
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([percentage])                  //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
        console.log("datain",dataIn[0]);

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()
            .value(function(d,i) { console.log("per",percentage); return percentage[i]; });
            //.value(percentage);


        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice") ;   //allow us to style things in the slices (like text)
                    //.on("mouseover", function (d) { 
                      //console.log("d is", d);
                     // showPopover.call(this, d.data); })
                    //.on("mouseout",  function (d) { removePopovers(); });

        ///Labels from the origin or from the HTML template (prioritized over origin):
        ///Each label is refered to a position 0,1,2... without limitation for introducing it
        /*var tarname = [];
        nested.forEach(function(d) {tarname.push(d.key);});*/

        var types = attrs.types;// || tarname;

        var poplabels = attrs.poplabels || {
            0: 'Percentage',
            1: 'Consumption',
        };

        /*function removePopovers () {
            $('.popover').each(function() {
              $(this).remove();
            }); 
          }

        function showPopover (d) {
            $(this).popover({
              //title: d.name,
              //placement: 'auto top',
              placement: function(tip, element) { //$this is implicit
                var position = $(element).position();
                var minleft = 210;
                var mintop = 325;
                if (position.left < minleft && position.top > mintop) {
                    return "left";
                }
                if (position.left > minleft && position.top > mintop) {
                    return "right";
                }
                if (position.top < mintop){
                    return "top";
                }
                return "bottom";
              },
              container: 'body',
              trigger: 'manual',
              html : true,
              content: function() { 
                return poplabels[0]+ ": " + percentageFormat(d.percentage) + 
                       "<br/>"+ poplabels[1] + ": " + d3.round(d.values.cons, 1) + " kWh"}
            });
            $(this).popover('show')
          }*/

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } )
                    .style("stroke", "white") //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);

                    //return "translate(" + c[0]*2 +"," + c[1]*2 + ")"; 
                     return "translate("  + c[0]*1 +"," + c[1]*1 + ")";  
                     //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","58%")
                .style("font-weight","normal") 
                .attr("dx", "0em")
                .attr("dy", "-0.5em")                        //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return types[i];
                });       
        

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);
                    return "translate("  + c[0]*1 +"," + c[1]*1 + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","66%") 
                .style("font-weight","bold") 
                .attr("dx", "0em")
                .attr("dy", "0.7em")                      //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return percentageFormat(percentage[i]);
                });   


        return ct202b_cons;

        };

    Empowering.Graphics.CT202B_AVG = function(attrs) {

          var ct202b_cons = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        var dataIn = attrs.data["summary"];
console.log("gg",dataIn)
        /*
        Definition of formats and widths
        */

        var w = 150,                        //width, default: 300
            h = 150,                            //height, default: 300
            //r = 75,                          //radius, default: 100
            r = Math.min(w, h) / 2,
            color = d3.scale.ordinal()
            .range(["#FE733A", "#ED933D", "#F6CF9F"]),
            percentageFormat = d3.format("%");

        /*
        Data restructuration*/

        var cons = [dataIn[1]["p1_avg"],dataIn[1]["p2_avg"],dataIn[1]["p3_avg"]];
console.log("hello",cons);


        /*var nested = d3.nest()
          .key(function(d) {return d.type;})
          .key(function(d) {return d.consumption;})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) { 
            return {
              //"length": leaves.length, 
              "cons": d3.sum(leaves, function(d) {return console.log("hello",d); parseFloat(d.p1_cons);}),
                "cons": d3.sum(leaves, function(d) {return parseFloat(d.p2_cons);})
            } 
          })
          .entries(dataIn);*/
          //.entries(data);
        var acum = cons.reduce(function(a,b) { return a+b; },0);

        /*var acum = d3.sum(nested, function(d) { 
                        return d.cons; 
                    });*/
        var percentage =[];
        cons.forEach(function(d,i) {
                        percentage[i] = cons[i] / acum ;
                    });

        console.log("hello",cons);
        /*
        Definition of chart environment
        */

        var vis = d3.select(attrs.container)
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([percentage])                  //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
        console.log("datain",dataIn[0]);

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()
            .value(function(d,i) { console.log("per",percentage); return percentage[i]; });
            //.value(percentage);


        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice") ;   //allow us to style things in the slices (like text)
                    //.on("mouseover", function (d) { 
                      //console.log("d is", d);
                     // showPopover.call(this, d.data); })
                    //.on("mouseout",  function (d) { removePopovers(); });

        ///Labels from the origin or from the HTML template (prioritized over origin):
        ///Each label is refered to a position 0,1,2... without limitation for introducing it
        /*var tarname = [];
        nested.forEach(function(d) {tarname.push(d.key);});*/

        var types = attrs.types;// || tarname;

        var poplabels = attrs.poplabels || {
            0: 'Percentage',
            1: 'Consumption',
        };

        /*function removePopovers () {
            $('.popover').each(function() {
              $(this).remove();
            }); 
          }

        function showPopover (d) {
            $(this).popover({
              //title: d.name,
              //placement: 'auto top',
              placement: function(tip, element) { //$this is implicit
                var position = $(element).position();
                var minleft = 210;
                var mintop = 325;
                if (position.left < minleft && position.top > mintop) {
                    return "left";
                }
                if (position.left > minleft && position.top > mintop) {
                    return "right";
                }
                if (position.top < mintop){
                    return "top";
                }
                return "bottom";
              },
              container: 'body',
              trigger: 'manual',
              html : true,
              content: function() { 
                return poplabels[0]+ ": " + percentageFormat(d.percentage) + 
                       "<br/>"+ poplabels[1] + ": " + d3.round(d.values.cons, 1) + " kWh"}
            });
            $(this).popover('show')
          }*/

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } )
                    .style("stroke", "white") //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);

                    //return "translate(" + c[0]*2 +"," + c[1]*2 + ")"; 
                     return "translate("  + c[0]*1 +"," + c[1]*1 + ")";  
                     //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","58%")
                .style("font-weight","normal") 
                .attr("dx", "0em")
                .attr("dy", "-0.5em")                        //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return types[i];
                });       
        

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);
                    return "translate("  + c[0]*1 +"," + c[1]*1 + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","66%") 
                .style("font-weight","bold") 
                .attr("dx", "0em")
                .attr("dy", "0.7em")                      //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return percentageFormat(percentage[i]);
                });   



        return ct202b_avg;

        };

    Empowering.Graphics.CT206_CONS = function(attrs) {

        var ct206_cons = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        /*
        Some calculated metadata for OT302B
        */

        var removeByAttr = function(arr, attr, value){
          var i = arr.length;
          while(i--){
            if( arr[i] 
              && arr[i].hasOwnProperty(attr) 
              && (arguments.length > 2 && arr[i][attr] === value ) ){ 

              arr.splice(i,1);

            }
          }
          return arr;
        }

        var arr = attrs.data["summary"];

        removeByAttr(arr, "timeSlot", "total");                   
        //console.log("totaldata is", arr);

        /*
        Definition of formats and widths
        */

        var w = 150,                        //width, default: 300
            h = 150,                            //height, default: 300
            //r = 75,                          //radius, default: 100
            r = Math.min(w, h) / 2,
            color = d3.scale.ordinal()
            .range(["#161686", "#3278C2", "#AECCEC"]),
            percentageFormat = d3.format("%");

        /*
        Data restructuration
        */

        var removal = function (d) {
          if  (d === "total" || d === "rot")
            {return d}
          else remove(d)
        };


        var nested = d3.nest()
          .key(function(d) {return d.timeSlot;})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) { 
            return {
              //"length": leaves.length, 
              "cons": d3.sum(leaves, function(d) {return parseFloat(d.sum);
              })
            } 
          })
          .entries(arr);
          //.entries(data);

        var acum = d3.sum(nested, function(d) { 
                        return d.values.cons; 
                    });

        nested.forEach(function(d) {
                        d.percentage = d.values.cons / acum;
                    });

        /*
        Definition of chart environment
        */

        var vis = d3.select(attrs.container)
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([nested])                  //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()
            .value(function(d) { return d.percentage; });

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice")    //allow us to style things in the slices (like text)
                    .on("mouseover", function (d) { 
                      //console.log("d is", d);
                      showPopover.call(this, d.data); })
                    .on("mouseout",  function (d) { removePopovers(); });

        ///Labels from the origin or from the HTML template (prioritized over origin):
        ///Each label is refered to a position 0,1,2... without limitation for introducing it
        var tarname = [];
        nested.forEach(function(d) {tarname.push(d.key);});

        var types = attrs.types || tarname;

        var poplabels = attrs.poplabels || {
            0: 'Percentage',
            1: 'Consumption',
        };

        function removePopovers () {
            $('.popover').each(function() {
              $(this).remove();
            }); 
          }

        function showPopover (d) {
            $(this).popover({
              //title: d.name,
              //placement: 'auto top',
              placement: function(tip, element) { //$this is implicit
                var position = $(element).position();
                var minleft = 210;
                var mintop = 325;
                if (position.left < minleft && position.top > mintop) {
                    return "left";
                }
                if (position.left > minleft && position.top > mintop) {
                    return "right";
                }
                if (position.top < mintop){
                    return "top";
                }
                return "bottom";
              },
              container: 'body',
              trigger: 'manual',
              html : true,
              content: function() { 
                return poplabels[0]+ ": " + percentageFormat(d.percentage) + 
                       "<br/>"+ poplabels[1] + ": " + d3.round(d.values.cons, 1) + " kWh"}
            });
            $(this).popover('show')
          }

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } )
                    .style("stroke", "white") //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);

                    //return "translate(" + c[0]*2 +"," + c[1]*2 + ")"; 
                     return "translate("  + c[0]*1 +"," + c[1]*1 + ")";  
                     //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","58%")
                .style("font-weight","normal") 
                .attr("dx", "0em")
                .attr("dy", "-0.5em")                        //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return types[i];
                });       
        

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);
                    return "translate("  + c[0]*1 +"," + c[1]*1 + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","66%") 
                .style("font-weight","bold") 
                .attr("dx", "0em")
                .attr("dy", "0.7em")                      //center the text on it's origin
                .text(function(d) { 
                //return d.data.key; //get the label from our original data array
                return percentageFormat(d.data.percentage);
                });   


        return ct206_cons;

        };

    Empowering.Graphics.CT206_AVG = function(attrs) {

        var ct206_avg = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        /*
        Some calculated metadata for OT302B
        */

        var removeByAttr = function(arr, attr, value){
          var i = arr.length;
          while(i--){
            if( arr[i] 
              && arr[i].hasOwnProperty(attr) 
              && (arguments.length > 2 && arr[i][attr] === value ) ){ 

              arr.splice(i,1);

            }
          }
          return arr;
        }

        var arr = attrs.data["summary"];

        removeByAttr(arr, "timeSlot", "total");                   
        //console.log("totaldata is", arr);

        /*
        Definition of formats and widths
        */

        var w = 150,                        //width, default: 300
            h = 150,                            //height, default: 300
            //r = 75,                          //radius, default: 100
            r = Math.min(w, h) / 2,
            color = d3.scale.ordinal()
            .range(["#FE733A","#ED933D", "#F6CF9F"]),
            percentageFormat = d3.format("%");

        /*
        Data restructuration
        */

        var removal = function (d) {
          if  (d === "total" || d === "rot")
            {return d}
          else remove(d)
        };


        var nested = d3.nest()
          .key(function(d) {return d.timeSlot;})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) { 
            return {
              //"length": leaves.length, 
              "cons": d3.sum(leaves, function(d) {return parseFloat(d.sum);
              })
            } 
          })
          .entries(arr);
          //.entries(data);

        var acum = d3.sum(nested, function(d) { 
                        return d.values.cons; 
                    });

        nested.forEach(function(d) {
                        d.percentage = d.values.cons / acum;
                    });

        /*
        Definition of chart environment
        */

        var vis = d3.select(attrs.container)
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([nested])                  //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()
            .value(function(d) { return d.percentage; });

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice")    //allow us to style things in the slices (like text)
                    .on("mouseover", function (d) { 
                      //console.log("d is", d);
                      showPopover.call(this, d.data); })
                    .on("mouseout",  function (d) { removePopovers(); });

        ///Labels from the origin or from the HTML template (prioritized over origin):
        ///Each label is refered to a position 0,1,2... without limitation for introducing it
        /*var tarname = [];
        nested.forEach(function(d) {tarname.push(d.key);});*/

        var types = attrs.types;

        var poplabels = attrs.poplabels || {
            0: 'Percentage',
            1: 'Consumption',
        };

        function removePopovers () {
            $('.popover').each(function() {
              $(this).remove();
            }); 
          }

        function showPopover (d) {
            $(this).popover({
              //title: d.name,
              //placement: 'auto top',
              placement: function(tip, element) { //$this is implicit
                var position = $(element).position();
                var minleft = 210;
                var mintop = 325;
                if (position.left < minleft && position.top > mintop) {
                    return "left";
                }
                if (position.left > minleft && position.top > mintop) {
                    return "right";
                }
                if (position.top < mintop){
                    return "top";
                }
                return "bottom";
              },
              container: 'body',
              trigger: 'manual',
              html : true,
              content: function() { 
                return poplabels[0]+ ": " + percentageFormat(d.percentage) + 
                       "<br/>"+ poplabels[1] + ": " + d3.round(d.values.cons, 1) + " kWh"}
            });
            $(this).popover('show')
          }

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } )
                    .style("stroke", "white") //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);

                    //return "translate(" + c[0]*2 +"," + c[1]*2 + ")"; 
                     return "translate("  + c[0]*1 +"," + c[1]*1 + ")";  
                     //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","58%")
                .style("font-weight","normal") 
                .attr("dx", "0em")
                .attr("dy", "-0.5em")                        //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return types[i];
                });       
        

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var c = arc.centroid(d);
                    return "translate("  + c[0]*1 +"," + c[1]*1 + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")
                .style("fill","white")
                .style("font-size","66%") 
                .style("font-weight","bold") 
                .attr("dx", "0em")
                .attr("dy", "0.7em")                      //center the text on it's origin
                .text(function(d) { 
                //return d.data.key; //get the label from our original data array
                return percentageFormat(d.data.percentage);
                });   


        return ct206_avg;

        };       

   Empowering.Graphics.CT409 = function(attrs) {
        var ct409 = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        var linedataUpper = data[0].cosFiUpper;
        var linedataLower = data[0].cosFiLower;

        /*
        Definition of chart environment 
        */

        var parseDate = d3.time.format('%Y%m').parse;

        var margin = {top: 5, right: 40, bottom: 85, left: 40};
        var width = 1040 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var svg = d3.select(attrs.container)
                   .append('div')
                   .classed("svg-container-ot103", true) //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 1040 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true)
                   .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "ot103");

        ///***Definition of scales for the two axis***
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height-50, 0]);

        ///***Preparation for data selection***
        var allCons = [];
        var cosFiConsumption = [];
        var cosFiAverageConsumption = [];
        var cosFiLower = [];
        var cosFiUpper = [];

        data.forEach(function(d) {
            d.month = parseDate(d.month + '');
            if (d.cosFiConsumption !== null) {
                cosFiConsumption.push(d);
            }
            if (d.cosFiAverageConsumption !== null) {
                cosFiAverageConsumption.push(d);
            }
            if (d.cosFiLower !== null) {
                cosFiLower.push(d);
            }
            if (d.cosFiUpper !== null) {
                cosFiUpper.push(d);
            }

            allCons.push(
                d.cosFiConsumption, d.cosFiAverageConsumption, d.cosFiLower, d.cosFiUpper
            );
        });

        ///***Definition of data domains***
        x.domain(d3.extent(data, function(d) { return d.month; }));
        y.domain(d3.extent(allCons));

        ///***Definition of selection for user language or predefined language***
        var locale = Empowering.LOCALES[attrs.locale || "en_UK"];

        ///***Definition of orientation and format for the two axis***
        var xAxis = d3.svg.axis().scale(x).orient("bottom")
            //.tickSize(5)
            .tickFormat(d3.time.format('%m/%Y'))
            //.tickFormat(locale.timeFormat("%b %y"))
            .ticks(d3.min([12, data.length])); //.ticks(d3.time.years, 2); //other way to define
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

        ///***Definition of multiline chart***
        var line = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y(d.cosFiConsumption); });

        var lineAvg = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y(d.cosFiAverageConsumption); });

        ///***Definition of legend***
        var labels = attrs.labels || {
            0: 'Your neighbors',
            1: 'You',
        };

        var styles = {
          0: 'cosFiAverageConsumption',
          1: 'cosFiConsumption',

        };

        var poplabels = attrs.poplabels || {
            0: 'Consumption'
        };

        ///***Definition of style for the two axis***
        ///xAxis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
        ///yAxis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
              //.attr('transform', 'rotate(-90)')
              .attr('x', 0)
              .attr('y', -5)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text(poplabels[0]);



        ///VISUALIZATION FOR THE TEXT
        [0, 1, 2].forEach(function(idx) {
            svg.append('g')
                .attr('class', 'legend')
                .append('text')
                .attr('x', 130+(idx*width/3.1))
                .attr('y', height + margin.bottom/1.2)
                .attr('class', styles[idx]) ///when a specific style is defined in CSS file, put it here
                .text(labels[idx]);
        });

        ///VISUALIZATION FOR THE POINTS 
        var legend = svg.append('circle')
                .attr('class', 'point consumption')
                //.attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cx", width/2-70)
                .attr("cy", height + margin.bottom/1.35)
                .attr('r', 12);

        var legendAvg = svg.append('circle')
                .attr('class', 'point averageConsumption')
                //.attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cx", 0+100)
                .attr("cy", height + margin.bottom/1.35)
                .attr('r', 10);

        /*var legendAvgEff = svg.append('circle')
                .attr('class', 'point averageEffConsumption')
                //.attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cx", width-240)
                .attr("cy", height + margin.bottom/1.35)
                .attr('r', 10);*/

        ///***Definition of paths***
        svg.selectAll('.ot103')
            .data(data).enter()
            .append('line')
            .attr('class', 'x vertical')
            .attr('x1', function(d) { return x(d.month); })
            .attr('x2', function(d) { return x(d.month); })
            .attr('y1', 0)
            .attr('y2', height);

        /*svg.append('path')
            .datum(averageEffConsumption)
            .attr('class', 'line averageEffConsumption')
            .attr('d', lineAvgEff);

        svg.selectAll('.ot103')
            .data(averageEffConsumption).enter()
            .append('circle')
            .attr('class', 'point averageEffConsumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.averageEffConsumption); })
            .attr('r', 6)
            .on("mouseover", function (d) { showPopoverLineEff.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });*/

        svg.append('path')
            .datum(cosFiAverageConsumption)
            .attr('class', 'line averageConsumption')
            .attr('d', lineAvg);

        svg.selectAll('.ot103')
            .data(cosFiAverageConsumption).enter()
            .append('circle')
            .attr('class', 'point averageConsumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.cosFiAverageConsumption); })
            .attr('r', 6)
            .on("mouseover", function (d) { showPopoverLineAvg.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

        svg.append('path')
            .datum(cosFiConsumption)
            .attr('class', 'line consumption')
            .attr('d', line);

        svg.selectAll('.ot103')
            .data(cosFiConsumption).enter()
            .append('circle')
            .attr('class', 'point consumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.cosFiConsumption); })
            .attr('r', 8)
            .on("mouseover", function (d) { showPopoverLine.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

        ///*********///
        ///***Definition of secondary chart environment: line chart***
        /*var line = d3.svg.line()
            .x(width)//.x(function(d) { return x(d); })
            .y(function(d) { return y(d); });
            //.interpolate("cardinal")
            //.tension(0.6);*/



        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(linedataLower))
            .attr("y2", y(linedataLower))
            .style("stroke", "red");

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(linedataUpper))
            .attr("y2", y(linedataUpper))
            .style("stroke", "orange");

        svg.append("text")
            .attr("class", "y axis")
            //.style("font-size", "61%")
            .style("fill", "red")
            .attr("transform", "translate(" + -40.5 + ","+(y(linedataLower)*1.02)+")")
            .style("text-anchor", "start")
            .text(linedataLower);

        svg.append("text")
            .attr("class", "y axis")
            //.style("font-size", "61%")
            .style("fill", "orange")
            .attr("transform", "translate(" + -40.5 + ","+(y(linedataUpper)*1.06)+")")
            .style("text-anchor", "start")
            .text(linedataUpper);

        /*svg.append("line")
        .style("stroke", "black")
        .attr("x1", 0)
        .attr("y1", line(100))
        .attr("x2", width)
        .attr("y2", line(100));*/

        ///***Introducing data in the secondary environment: line chart***
        /*svg.append("path") //line path
            .datum(0.04)
            .style("stroke", "black")
            .attr("transform", "translate(" + 0 + ",0)") //.attr("transform", function (d) { return "translate(" + x(d.month) + "10,0)"; }) //other way to define
            .attr("d", line(0.04));*/


        /*svg.append("text")
            .attr("class", "y axis")
            .style("font-size", "61%")
            .attr("transform", "translate(" + (width/2+100) + ","+(height+19)+")")
            .style("text-anchor", "start")
            .text(labels[0]);

        svg.append("line")
    .style("stroke", "black")
    .attr("x1", 0)
    .attr("y1", y(0.07))
    .attr("x2", width)
    .attr("y2", y(0.07));*/

        ///VISUALIZATION FOR LEGEND OF THE LINE CHART 
        //BOTTOM
        /*var legendLine = svg.append("rect")
                .attr("class", "line temperature")
                .attr("x", width/2.5+x.rangeBand()*2)
                .attr("y", 0)
                .attr("width", x.rangeBand())
                .attr("height", 1)
                .style("stroke-width", "0.5px");*/
        ///UPPER
        var legendLine = svg.append("rect")
                .attr("class", "line temperature")
                //.attr("x", width-155) //right xtreme
                .attr("transform", "translate(" + (width/2+70)+ ","+(height+12)+")")
                //.attr("x", width-265) 
                //.attr("y", 25.5-margin.top)
                .attr("width", 24)
                .attr("height", 1)
                .style("stroke-width", "1px");

        //************///
        ///***Definition of functions for dynamisation of chart***
        ///WHEN NO OVER 
        function removePopovers () {
        $('.popover').each(function() {
          $(this).remove();
        }); 
        }

        ///WHEN OVER POINT OF EACH LINE
        function showPopoverLineAvg (d) {
        $(this).popover({
          title: labels[0],//d.name,
          placement: 'auto top',
          container: 'body',
          trigger: 'manual',
          html : true,
          content: function() { 
            return  poplabels[0] + ": " + d3.round(d3.format(",")(d.cosFiAverageConsumption), 1)+ " kWh";
            }
        });
        $(this).popover('show')
        }

        function showPopoverLine (d) {
        $(this).popover({
          title: labels[1],//d.name,
          placement: 'auto top',
          container: 'body',
          trigger: 'manual',
          html : true,
          content: function() { 
            return  poplabels[0] + ": " + d3.round(d3.format(",")(d.cosFiConsumption), 1)+ " kWh";
            }
        });
        $(this).popover('show')
        }

        /*function showPopoverLineEff (d) {
        $(this).popover({
          title: labels[2],//d.name,
          placement: 'auto top',
          container: 'body',
          trigger: 'manual',
          html : true,
          content: function() { 
            return  poplabels[0] + ": " + d3.round(d3.format(",")(d.averageEffConsumption), 1)+ " kWh";
            }
        });
        $(this).popover('show')
        }*/

        return ct409;
    };




    Empowering.Graphics.CT410 = function(attrs) {
        var ct410 = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        var parseDate = d3.time.format("%Y%m").parse;

        /*
        Definition of chart environment
        */

        var margin = {top: 50, right: 28, bottom: 35, left: 40};
        var width = 672 - margin.left - margin.right;
        var height = 336 - margin.top - margin.bottom;
        var barWidth = width / data.length;

        ///***Definition of scales for the three axis. For the x, width is limited in order to define 
        ///a stroke between bars e.g. ".3" establishes the stroke by barWitdh-30%***
        var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .3);
        //var x0 = d3.time.scale().range([0, width]); //without stroke between bars
        var x1 = d3.scale.ordinal();
        var y = d3.scale.linear().range([height, 0]);
        var y0 = d3.scale.linear().range([height-25, 0]);

        var color = d3.scale.ordinal().range(["#161686", "#3278C2", "#AECCEC"]);

        ///***Definition of selection for user language or predefined language***
        var locale = Empowering.LOCALES[attrs.locale || "en_UK"];

        ///***Definition of orientation and format for the three axis***
        var xAxis = d3.svg.axis().scale(x0).orient("bottom")
            .tickSize(5)
            .tickFormat(locale.timeFormat("%b %y"));
            //.ticks(d3.min([12, data.length])); //.ticks(d3.time.years, 2); //other way to define
        var yAxisLeft = d3.svg.axis().scale(y).orient("left").ticks(5);

        var yAxisRight = d3.svg.axis().scale(y0).orient("right").ticks(5);
        //.tickFormat(d3.format(".2s"));

         ///***Definition of primary chart environment: Bar chart***
        /*var svg = d3.select(attrs.container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "ot503");*/

        var svg = d3.select(attrs.container)
                   .append('div')
                   .classed("svg-container-ot503", true) //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 672 336")
                   //class to make it responsive
                   .classed("svg-content-responsive", true)
                   .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "ot503");

        ///***Preparation for data selection***
        data.forEach(function(d) {
            d.month = parseDate(d.month + "");
            //d.consumption = +d.consumption;
            //d.temperature = +d.temperature;
        });

        var seriesNames = d3.keys(data[0]).filter(function(key) { 
            //return (key === "consumption") && (key === "aconsumption"); });
            return (key !== "month") && (key !== "saving"); });
        console.log("seriesnames",seriesNames);
        //alert(seriesNames);
        data.forEach(function(d) {
            d.Tariffs = seriesNames.map(function(name) { return {name: name, value: +d[name]}; });
          });
        console.log("names",data);

        ///***Definition of data domains: it is here necessary to define specific 
        ///values for min and max domains depending on each climate area
        ///e.g. min 5 and max 30***
        x0.domain(data.map(function(d) { return d.month; })); //x.domain(d3.extent(data, function(d) { return d.month; })); //other way to define
        x1.domain(seriesNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, (d3.max(data, function (d) { 
            return d3.max(d.Tariffs, function (d) { return d.value; }); }))]);
        /*y.domain([0, 50+d3.max(data, function(d) { 
        return d3.max(d.Tariffs, function (d) { 
        return d.value; }); }))]); //y.domain([0, 200]); //other way to define*/
        /*y0.domain([
            (d3.min(data, function(d) { return d.saving; }) <= 5) ? true : 5,
            (d3.max(data, function(d) { return d.saving; })) >= 30 ? true : 30*1.1
            ]); */
        y0.domain([0,(d3.max(data, function (d) { 
            return d3.max(d.Tariffs, function (d) { return d.value; }); })) +
        (d3.max(data, function(d) { return d.saving; }))]); 
            //y0.domain([0, 40]); //other way to define
        



        ///***Definition of function for grid lines: Vertical and Horitzontal***
        function make_V_grid() {
            return d3.svg.axis()
                .scale(x0)
                .orient("bottom")
                .ticks(5)
        }
        function make_H_grid() {
            return d3.svg.axis()
                .scale(y0)
                .orient("left")
                .ticks(5);
        }

        ///***Definition of legend***
        ///LABELS FOR THE PRIMARY AND SECONDARY ENVIRONMENT
        var labels = attrs.labels || {
            0: 'tariff1',
            1: 'tariff2',
            2: 'tariff3',
            4: 'saving'
        };

        var units = attrs.units || {
            0: 'kWh/month',
            1: 'ºC',
        };

        /*var seriesNames = attrs.seriesNames || {
            0: 'tariff1',
            1: 'tariff2',
        };*/

        ///***Definition of style for the three axis***
        ///xAxis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height-25) + ")") //move to bottom
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "41%")
            .attr("dx", "-.7em")
            .attr("dy", "0em")
            .style("text-transform", "uppercase")
            .attr("transform", "rotate(-35)" );
        
        ///yAxisLeft
        svg.append("g") 
        .attr("class", "y axis")
        .attr("transform", "translate(0,-25)") //move to left
        .call(yAxisLeft)
            .style("font-size", "58%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start") ;
            /*.append("text")
            .style("font-size", "112%")
            .style("text-transform", "uppercase")
            .attr('dy', '-1.05em')
            //.attr('dx', '4.8em') //left xtreme
            .attr('dx', '9.7em')
            .text(labels[0]);*/

        svg.append("g") 
        .attr("class", "y axis")
        //.attr("transform", "translate(-5,0)") //move to left
        //.call(yAxisLeft)
            .append("text")
            .attr("dy", "-2.4em")
            .attr('dx', '-2.2em')       
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start")
            .text(units[0]);

        ///legend for saving based on yAxisRight
        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width-5) + " ,0)") //move to right
        .call(yAxisRight)
            .style("font-size", "41%")
            //.style("font-weight", "bold")
            .style("text-anchor", "end") 
            .append("text")
            .style("font-size", "112%")
            //.style("text-transform", "uppercase")
            //.attr('dy', '-1.05em')
            //.attr('dx', '1.5em') //right xtreme
           // .attr('dx', '-12.4em')
            //.text(labels[1]);

        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width) + " ,0)") //move to right
        //.call(yAxisRight)
            .append("text")
            .attr("dy", "-2.4em")
            .attr('dx', '0.2em')       
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start")
            .text(units[1]);
        ///***Drawing the grid lines***
        ///VERTICAL
        /*svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_V_grid()
                .tickSize(-height, 0, 0)
                .tickFormat("")
            )*/
        ///HORITZONTAL   
        svg.append("g")
            .attr("class", "x axis")
            .call(make_H_grid()
                .tickSize(-width, 0, 0)
                .tickFormat(""));

        ///***Introducing data in the primary environment: bar chart***
        var grouped = svg.selectAll(".tariffs")
            .data(data)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) { return "translate(" + x0(d.month) + ",-25)"; });

        //alert(JSON.stringify(d.Flights[0]));
        grouped.selectAll("rect")
            .data(function (d) { return d.Tariffs; })
        .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) { return x1(d.name); })
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); })
            .style("fill", function (d) { return color(d.name); });

        /*svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            //.attr("class", "bar") //.style("stroke", "white") //when a stroke was not defined in the scales
            .attr("x", function(d) { return x1(d.name); })
            .attr("width", x1.rangeBand()) //.attr("width", barWidth) //other way to define
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function (d) { return color(d.name); });*/

            //.on("mouseover", function (d) { showPopoverBar.call(this, d); })
            //.on("mouseout",  function (d) { removePopovers(); });

        ///***Definition of secondary chart environment: line chart***
        var line = d3.svg.line()
            .x(function(d) { return x0(d.month); })
            .y(function(d) { return y0(d.saving); });
            //.interpolate("cardinal")
            //.tension(0.6);

        ///***Introducing data in the secondary environment: line chart***
        svg.append("path") //line path
            .datum(data)
            .attr("class", "line temperature")
            .attr("transform", "translate(" + barWidth/(seriesNames.length) + ",0)") //.attr("transform", function (d) { return "translate(" + x(d.month) + "10,0)"; }) //other way to define
            .attr("d", line(data));


        svg.append("text")
            .attr("class", "y axis")
            .style("font-size", "61%")
            .attr("transform", "translate(" + (width/2+100) + ","+(height+19)+")")
            .style("text-anchor", "start")
            .text(labels[0]);
        ///VISUALIZATION FOR LEGEND OF THE LINE CHART 
        //BOTTOM
        /*var legendLine = svg.append("rect")
                .attr("class", "line temperature")
                .attr("x", width/2.5+x.rangeBand()*2)
                .attr("y", 0)
                .attr("width", x.rangeBand())
                .attr("height", 1)
                .style("stroke-width", "0.5px");*/
        ///UPPER
        var legendLine = svg.append("rect")
                .attr("class", "line temperature")
                //.attr("x", width-155) //right xtreme
                .attr("transform", "translate(" + (width/2+70)+ ","+(height+12)+")")
                //.attr("x", width-265) 
                //.attr("y", 25.5-margin.top)
                .attr("width", 24)
                .attr("height", 1)
                .style("stroke-width", "1px");
        ///***Introducing data in an extra environment: points of the line chart***
        /*svg.selectAll('.ot503')
            .data(data).enter()
            .append('circle') //points
            .attr('class', 'point temperature')
            .attr("transform", "translate(" + barWidth/2*(1-0.3) + ",0)")
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y0(d.temperature); })
            .attr('r', 4)
            .on("mouseover", function (d) { showPopoverLine.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });*/

        ///VISUALIZATION FOR THE TEXT
        /*[0, 1, 2].forEach(function(idx) {
            svg.append('g')
                .attr('class', 'legend')
                .append('text')
                .attr('x', 130+(idx*width/3.1))
                .attr('y', height + margin.bottom/1.2)
                .attr('class', styles[idx]) ///when a specific style is defined in CSS file, put it here
                .text(labels[idx]);
        });*/

        var legend = svg.selectAll(".legend")
            .data(seriesNames.slice())//seriesNames.slice().reverse())
        .enter().append("g")
            .attr("class", "y axis")
            .style("font-size", "61%")
            .attr("transform", function (d, i) { console.log("f",i*width/6); return "translate(" +(i*width/5-width) + ","+(height+10)+")"; });

        legend.append("rect")
            .attr("x", width - 24 +40)
            .attr("width", 24)
            .attr("height", 9)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24 +40+24+5)
            .attr("y", 9)
            //.attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (d,i) { return labels[i+1]; });
            //.on("click", function (d) {
            //   alert(d);});




        ///VISUALIZATION FOR LEGEND OF THE BAR CHART
        //BOTTOM
        /*var legendBar = svg.append("rect")
              .attr("class", "bar")
              .attr("x", width/2.5-50)
              .attr("y", height + margin.bottom/1.25)
              .attr("width", x0.rangeBand())
              .attr("height", 10);*/
        ///UPPER
        /*var legendBar = svg.append("rect")
              .attr("class", "bar")
              //.attr("x", 5-margin.left) //left xtreme
              //.attr("x", 170-margin.left)
              //.attr("y", 18-margin.top)
              .attr("width", x1.rangeBand())
              .attr("x", 170-margin.left+function (d) { return x1(d.name); })
              .attr("y", 18-margin.top+function (d) { return y(d.value); })
              //.attr("height", function (d) { return height - y(d.value); })
              //.style("fill", function (d) { return color(d.name); });
              //.attr('dy', 'width-5em')
              //.attr('dx', '0.4em')
              //.attr("width", x0.rangeBand())
              .attr("height", 15);*/
        ///VISUALIZATION FOR LEGEND OF THE POINTS OF THE LINE CHART 
        //BOTTOM
        /*var legendCircle = svg.append('circle')
                .attr('class', 'point temperature')
                .attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cy", 0)
                .attr('r', 4);*/
        ///UPPER
        /*var legendCircle = svg.append('circle')
                .attr('class', 'point temperature')
                //.attr("cx", width-155+1.1*x.rangeBand()/2) //right xtreme
                .attr("cx", width-265+1.1*x.rangeBand()/2)
                .attr("cy", 25.5-margin.top)
                .attr('r', 6);*/



        ///***Definition of functions for dynamisation of chart***
        ///WHEN NO OVER 
        /*function removePopovers () {
        $('.popover').each(function() {
          $(this).remove();
        }); 
        }
        ///WHEN OVER BAR
        function showPopoverBar (d) {
        $(this).popover({
          //title: d.name,
          placement: 'auto top',
          container: 'body',
          trigger: 'manual',
          html : true,
          content: function() { 
            return labels[0] + ": " + d3.round(d3.format(",")(d.consumption), 1) + " kWh";
            }
        });
        $(this).popover('show')
        }
        ///WHEN OVER POINT OF THE LINE
        function showPopoverLine (d) {
        $(this).popover({
          //title: d.name,
          placement: 'auto top',
          container: 'body',
          trigger: 'manual',
          html : true,
          content: function() { 
            return labels[1] + ": " + d3.round(d3.format(",")(d.temperature), 1)+ " ºC";
            }
        });
        $(this).popover('show')
        }*/

        return ct410;
    };


    Empowering.Graphics.CCH = function(attrs) {

        var cch = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        var margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 45
        };

        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .domain(d3.extent(data, function(d) {
            return d.date;
        }))
            .range([0, width]);

        var y = d3.scale.linear()
            .domain(d3.extent(data, function(d) {
            return d.value;
        }))
            .range([height, 0]);

        var line = d3.svg.line()
            .interpolate('monotone')
            .x(function(d) {
            return x(d.date);
        })
            .y(function(d) {
            return y(d.value);
        });

        var area = d3.svg.area()
            .interpolate('monotone')
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.value); });

        function zoomed() {
            cch.plot.select('.x.axis').call(xAxis).selectAll('text')
                .attr('dx', '-2.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');
            cch.plot.select('.y.axis').call(yAxis);
            cch.plot.select('.x.grid')
                .call(makeXAxis()
                .tickSize(-height, 0, 0)
                .tickFormat(''));
            cch.plot.select('.y.grid')
                .call(makeYAxis()
                .tickSize(-width, 0, 0)
                .tickFormat(''));
            cch.plot.select('.line')
                .attr('class', 'line')
                .attr('d', line);
            cch.plot.select('.area')
                .attr('class', 'area')
                .attr('d', area(data));
        }

        function mousemove() {
            var coords = d3.mouse(this);
            var bisectDate = d3.bisector(function(d) { return d.date; }).left;
            var x0 = x.invert(coords[0]);
            var i = bisectDate(data, x0, 1);
            var d0 = data[i - 1];
            var d1 = data[i];
            var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr('transform',
                       'translate(' + x(d.date) + ',' + y(d.value) + ')');
            focus.select('text').text(d.value + ' Wh');
        }

        var zoom = d3.behavior.zoom()
            .x(x)
            .scaleExtent([1, data.length / 12])
            .on('zoom', zoomed);

        cch.plot = d3.select(attrs.container)
            .append('svg:svg')
            .attr('class', 'cch')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('svg:g')
            .attr('transform',
                  'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        if (data.length === 0) {
            return cch;
        }

        cch.plot.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'plot')
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
            })
            .on('mousemove', mousemove);

        var makeXAxis = function() {
            return d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(12);
        };

        var makeYAxis = function() {
            return d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(5);
        };

        var locale = Empowering.LOCALES[attrs.locale || 'en_UK'];

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(12)
            .tickFormat(locale.timeFormat.multi([
              ['.%L', function(d) { return d.getMilliseconds(); }],
              [':%S', function(d) { return d.getSeconds(); }],
              ['%I:%M', function(d) { return d.getMinutes(); }],
              ['%I %p', function(d) { return d.getHours(); }],
              ['%a %d', function(d) {
                  return d.getDay() && d.getDate() !== 1;
              }],
              ['%b %d', function(d) { return d.getDate() !== 1; }],
              ['%B', function(d) { return d.getMonth(); }],
              ['%Y', function() { return true; }]
            ]));

        cch.plot.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis)
            .selectAll('text')
            .attr('dx', '-2.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5);

        cch.plot.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Wh');

        cch.plot.append('g')
            .attr('class', 'x grid')
            .attr('transform', 'translate(0,' + height + ')')
            .call(makeXAxis()
            .tickSize(-height, 0, 0)
            .tickFormat(''));

        cch.plot.append('g')
            .attr('class', 'y grid')
            .call(makeYAxis()
            .tickSize(-width, 0, 0)
            .tickFormat(''));

        cch.plot.append('svg:clipPath')
            .attr('id', 'clip')
            .append('svg:rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height);

        cch.plot.append('path')
            .attr('class', 'area')
            .attr('clip-path', 'url(#clip)')
            .attr('d', area(data));

        var chartBody = cch.plot.append('g')
            .attr('clip-path', 'url(#clip)')
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
            })
            .on('mousemove', mousemove);

        chartBody.append('svg:path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);

        var focus = cch.plot.append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focus.append('circle')
            .attr('r', 4.5);

        focus.append('text')
            .attr('x', 9)
            .attr('dy', '.35em');

        cch.downloadCSV = function() {
            var csvDateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
            var csv = ['date;value'];
            attrs.data.forEach(function(el) {
                csv.push(csvDateFormat(new Date(el.date)) + ';' + el.value);
            });
            var fileName = 'cch_profile.csv';

            var blob = new Blob([csv.join('\n')], {
                type: 'text/csv;charset=utf-8;'
            });

            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);

            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, fileName);
                return;
            }
            else {
                window.open(url);
            }
        };

        return cch;
    };

    Empowering.Forms = {};

    Empowering.Forms.BuildingData = function(attrs) {

        var buildingDataModel = new Backbone.Model({});

        var buildingData = new Backform.Form({
            el: attrs.container,
            model: buildingDataModel,
            fields: [
                {
                    name: 'buildingConstructionYear',
                    label: 'Construction Year',
                    control: 'input',
                    type: 'number'
                },
                {
                    name: 'dwellingArea',
                    label: 'Dwelling Area',
                    control: 'input'
                },
                {
                    name: 'buildingType',
                    label: 'Building Type',
                    control: 'select',
                    options: [
                        {label: 'Single house', value: 'Single_house'},
                        {label: 'Apartment', value: 'Apartment'}
                    ]

                },
                {
                    name: 'dwellingPositionInBuilding',
                    label: 'Dwelling Position in Building',
                    control: 'select',
                    options: [
                        {label: 'First Floor', value: 'first_floor'},
                        {label: 'Middle Floor', value: 'middle_floor'},
                        {label: 'Last Floor', value: 'last_floor'},
                        {label: 'Other', value: 'other'}
                    ]
                },
                {
                    name: 'dwellingOrientation',
                    label: 'Dwelling Orientation',
                    control: 'select',
                    options: [
                        {label: 'South', value: 'S'},
                        {label: 'Southeast', value: 'SE'},
                        {label: 'East', value: 'E'}
                    ]
                }
            ]
        });
        return buildingData;
    };
}());

Handlebars.registerHelper({
    positive: function(value, options) {
        'use strict';
        if (value >= 0) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    },
    abs: function(value) {
        'use strict';
        return Math.abs(value);
    },
    absInt: function(value) {
        'use strict';
        return Math.abs(parseInt(value));
    }
});

//Resize function for desktop and mobile browsers, it does not work with Wkhtmltopdf

/*$(document).ready(resSize);
$(window).resize(resSize);

function resSize()
{
    var mobileMaxWidth= 560; //Define this to whatever size you want, e.g. the minimum width for sm- column reference at Bootstrap
    if($(window).width() < mobileMaxWidth) //original: if($(window).width() > mobileMaxWidth)
    {
        $("div#desktop").hide();
        $("div#mobile").show(); 
    }
    else
    {
        $("div#desktop").show();
        $("div#mobile").hide(); 
    }
}*/
