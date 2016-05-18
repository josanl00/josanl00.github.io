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
        for (var key in cons_d) {
          tariffs.push(key);
          cons.push(cons_d[key]);
        };
        for (var key in avg_d) {
          avg.push(avg_d[key]);
        };

        ///Array for legends depending on 
        ///number of tariffs
        var l_legend = new Array(); 
        for (key in tariffs) {
            l_legend.push(40);
        };
        //console.log("", tariffs) //e.g. [40,40,40]
        var l_position = []; //legend positions
        l_legend.reduce(function(a,b,i) { return l_position[i] = a+b; },0);

        ///Sorted values according to preference of 
        ///data visualization.
        //Caution! to perform this method, keys should 
        ///be ordered from more consumption (i.e. "pN") to
        ///less (i.e. "p0")
        cons.sort(function(a,b) {return b-a;});
        avg.sort(function(a,b) {return b-a;});
        l_position.sort(function(a,b) {return b-a;});

        ///Add to beginning of arrays each key to allow
        ///the matrix calculation
        cons.unshift("consumption");
        avg.unshift("averageConsumption");

        console.log("tariffs", tariffs) //e.g. ["three","two","one"]
        console.log("user consumption", cons) //e.g. [180,100,20,1]
        console.log("average consumption", avg) //e.g. [180,100,20,1]
        console.log("legend positions", l_position) //e.g. [120,80,40]

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
        var ycons = d3.scale.linear().range([0, barHeight]);
        var yavg = d3.scale.linear().range([0, barHeight]); 
        //var z = d3.scale.ordinal().range(["darkblue", "blue", "lightblue"])
        var cons_color = d3.scale.ordinal().range(["#AECCEC", "#3278C2", "#161686"]);
        var avg_color = d3.scale.ordinal().range(["#F6CF9F", "#ED933D", "#FE733A"]);

        ///Data model as matrix for each chart:
        ///1 row & CHART_ID+TARIFF_N columns like CHART_ID,TARIFF_1,...,TARIFF_N
        var cons_matrix = [cons];
        var avg_matrix = [avg];

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

        ///Call to stacked method with x, y0, y1 predefined
        var cons_stacked = d3.layout.stack()(cons_remapped);
        var avg_stacked = d3.layout.stack()(avg_remapped);

        ///Definition of domains
        ycons.domain([0, d3.max(cons_stacked[cons_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);
        yavg.domain([0, d3.max(avg_stacked[avg_stacked.length - 1], 
            function(d) { return d.y0 + d.y; })]);

        ///MAIN CHART DEFINITION
        ///Right chart 
        var cons_bar = main.selectAll("div")
        .data(cons_stacked)
        .enter().append("g")
        .style("fill", function(d, i) { return cons_color(i); })
        .attr("transform", "translate("+(width*2-25-barEnerWidth-rectWidth+5)+",20) rotate(180)");
        //.style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

        ///Left chart
        var avg_bar = main.selectAll("div")
        .data(avg_stacked)
        .enter().append("g")
        .style("fill", function(d, i) { return avg_color(i); })
        .attr("transform", "translate("+(barEnerWidth+rectWidth*2+5)+",20) rotate(180)");
        //.style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

        ///Legend chart
        var cons_legend = main.selectAll('div')
            .data(l_position)
            .enter().append('g')
            .style("fill", function(d, i) { return cons_color(i); })
            .attr('transform', 'translate(' + (barWidth+5) + ','+
                (l_position.length<4 ? barHeight-30 : barHeight+5)+')');

        var avg_legend = main.selectAll('div')
            .data(l_position)
            .enter().append('g')
            .style("fill", function(d, i) { return avg_color(i); })
            .attr('transform', 'translate(' + (barWidth+5) + ','+
                (l_position.length<4 ? barHeight-30 : barHeight+5)+')');

        ///DRAWING STACKED BAR WITH ROUNDED EFFECT
        ///Right chart 
        cons_bar.selectAll("path")
            .data(function(d){return d;})
            .enter().append("path")          
            .attr("d", function(d) { 
                return roundedRect(
                    rectWidth,-ycons(d.y)-ycons(d.y0), barEnerWidth, ycons(d.y)+barEnerWidth/5, barEnerWidth/5, 
                    false, false, true, true);
                    //true, true, false, false);
                });

        ///Left chart
        avg_bar.selectAll("path")
            .data(function(d){return d;})
            .enter().append("path")          
            .attr("d", function(d) { 
                return roundedRect(
                    rectWidth,-yavg(d.y)-yavg(d.y0), barEnerWidth, yavg(d.y)+barEnerWidth/5, barEnerWidth/5, 
                    false, false, true, true);
                    //true, true, false, false);
                });

        ///Legend chart
        cons_legend.append('path')
                .attr('d', function(d,i) {
                    return roundedRect(
                        100, -l_position[i], 50, 25, 14, 
                        false, true, false, true);
                });

        avg_legend.append('path')
                .attr('d', function(d,i) {
                    return roundedRect(
                        50, -l_position[i], 50, 25, 14,
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
            .attr('x', -barEnerWidth-25)
            .attr('y', function(d) {return  22+(ycons(d.y0))-25;})
            .attr("transform","translate(0,0) rotate(180)")
            .attr('class', 'label_ct105_bar')
            .attr('style', 'fill: white')
            .attr("text-anchor", "middle")
            .text(function(d,i) {return Math.round(d.y) + ' kWh';});

        ///Left chart
        avg_bar.selectAll("text")
            .data(function(d){return d;})
            .enter().append("text")
            .attr('x', -barEnerWidth-25)
            .attr('y', function(d) {return  22+(yavg(d.y0))-25;})
            .attr("transform","translate(0,0) rotate(180)")
            .attr('class', 'label_ct105_bar')
            .attr('style', 'fill: white')
            .attr("text-anchor", "middle")
            .text(function(d,i) {return Math.round(d.y) + ' kWh';});

        ///Legend chart
        avg_legend.append('text')
            .attr('x', 100)//barWidth-width/8-(width/8)/2 )
            .attr('y', function(d,i) { return -l_position[i]+16; })
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
            .attr("transform", "translate("+(45)+","+-barHeight+") rotate(180)")
            .text(icons[1]);

        ///Left chart
        avg_bar.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' +
                            'text-anchor: end')
            .attr("transform", "translate("+(barWidth)+","+-barHeight+") rotate(180)")
            .text(icons[0]);

        ///LINE BETWEEEN CHART AND ICON
        ///Right chart
        cons_bar.append("rect")
            .attr("class", "line")
            .attr("width", rectWidth+barEnerWidth-10)
            .attr("height", 2)
            .attr("transform", "translate("+(barWidth-15-10)+","+-barHeight+") rotate(180)")
            .style("stroke-width", "1px");
        
        ///Left chart
        avg_bar.append("rect")
            .attr("class", "line")
            .attr("width", rectWidth+barEnerWidth-10)
            .attr("height", 2)
            .attr("transform", "translate("+(barWidth+50-10)+","+-barHeight+") rotate(180)")
            .style("stroke-width", "1px");

        ///LABEL TEXTS
        ///Right chart
        cons_bar.append('text')
        .attr("text-anchor", "middle")
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .attr("transform", "translate("+(barWidth-65)+","+(-barHeight-40)+") rotate(180)")
            .text(labels[1]);

        ///Left chart
        avg_bar.append('text')
        .attr("text-anchor", "middle")
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .attr("transform", "translate("+(barWidth-85)+","+(-barHeight-40)+") rotate(180)")
            .text(labels[0]);
 
        return ct105;

    };


    Empowering.Graphics.CT202A = function(attrs) {

        var ct202a = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        /*
        Some calculated metadata for OT302A
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

        /*var types =
            ['Supervalley',
            'Valley',
            'Peak'
        ];*/

        var arr = attrs.data["dailyStats"];

        removeByAttr(arr, "timeSlot", "total");    
        
        /*
        Definition of time formats
        */              

        var parseDate = d3.time.format('%Y%m%d').parse;

        /*
        Data restructuration
        */

        var nested = d3.nest()
          .key(function(d) {return d.day;})
          .key(function(d) {return d.timeSlot;})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) { 
            return {
              //"length": leaves.length, 
              "cons": d3.sum(leaves, function(d) {return parseFloat(d.consumption);
              })
            } 
          })
          .entries(arr);

        /*
        Definition of chart environment
        */

        var margin = {top: 50, right: 20, bottom: 20, left: 30},
            width  = 672 - margin.left - margin.right, //Default: 1000-margin-left-margin-right
            height = 336  - margin.top  - margin.bottom; //Default: 500-margin.top-margin-bottom

        var color = d3.scale.ordinal()
            .range(["#225C10","#84E464","#c4e464","#64e4c4"]);

        console.log("color",color)

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

        //Sorting data to be represented
        var processed_data = nested.map( function (d) {
            var return_object = 0;
            var y0 = 0;
            var total = 0;
            return {
                date: d.key,
                values: (d.values).map( function (d, i) {
                    return_object = {
                        tariff: d.key,
                        consumption: d.values.cons,
                        y0: y0,
                        y1: y0 + d.values.cons
                    };
                    y0 = y0 + d.values.cons;
                    total = total + d.values.cons;
                  return return_object;
                  }),
                total: total
            };
        });



        // Define the color domain:
        var tariffs = [];

        processed_data.forEach(
            function (d) {
                d.date = parseDate(d.date),
                d.values.forEach(
                    function(d) {
                        if (!(tariffs.indexOf(d.tariff) > -1)) {
                            console.log("tariff", d.tariff)
                                    console.log("get",d)
                            tariffs.push(d.tariff)
                        }
                    }
                ) 
            }
        );
        color.domain(tariffs);

        var types =  {
            0: 'Supervalley',
            1: 'Valley',
            2: 'Peak'
        };

        /*var replace = function (d) {
          if  (d === "rot" )
            {return types[0]}
          //else remove(d)
        };*/

        var replaceTarname = function (d) {
          if  ( d === "grün")
            {return types[0]}
          if ( d === "gelb")
            {return types[1]}
          if ( d === "rot")
            {return types[2]}
        };

        console.log("tar",tariffs[0]);
        //console.log("tar0",processed_data.values.tariff[0])
        //console.log("tar1",processed_data[d].values);

        ///Labels from the origin or from the HTML template (prioritized over origin):
        ///Each label is refered to a position 0,1,2... without limitation for introducing it
        function getname(name) {
                    //var i = name.length;
                    console.log("len",name.length);
                    var Rates = {
                    0: 'e',
                    1: 'o',
                    2: 't',
                    };


                    if (name==='string') {
                      //name[i]===Rates[i];
                      return name===Rates[0];
                    }

                    //return Rates;
                  };

   

        /*var removeByAttr = function(arr, attr, value){
          var i = arr.length;
          while(i--){
            if( arr[i] 
              && arr[i].hasOwnProperty(attr) 
              && (arguments.length > 2 && arr[i][attr] === value ) ){ 

              arr.splice(i,1);

            }
          }
          return arr;
        }*/
        //console.log("func",func(tariffs));

        var tarname = [];
        processed_data.forEach(function(d,i) {tarname.push(d.tariff);});
        console.log("dar",processed_data)
        console.log("da",tarname)


        //var types = attrs.types || tarname;




        var poplabels = attrs.poplabels || {
            0: 'Tariff',
            1: 'Consumption',
        };


        // helper function for applying d3.time.scale instead of the default d3.ordinales.scale
        function getDate(d) {
            return new Date(d.date);
        }

        // get max and min dates - this assumes data is sorted
        var minDate = getDate(processed_data[0]),
            maxDate = getDate(processed_data[processed_data.length-1]);

        var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);

        var y = d3.scale.linear()
        .domain([0, d3.max(processed_data, function(d) { return d.total+1; })])
        .rangeRound([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format('%_d'))
            .ticks(processed_data.length);
            //.ticks(5);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.tickFormat(d3.format(".2s"))
            .ticks(5);

          ///***Definition of function for grid lines: Vertical and Horitzontal***
          function make_V_grid() {
              return d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .ticks(5)
          }
          function make_H_grid() {
              return d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(5);
          }

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
                  .tickSize(-(width/processed_data.length)*(processed_data.length+1))//(-width, 0, 0)
                  .tickFormat(""));

          svg.append("g")
              .attr("class", "x axis")
              //.attr("transform", "translate(0," + height + ")")
              .attr("transform", "translate(" + (width/processed_data.length)/2 + "," + height + ")")
              .call(xAxis)
                .selectAll("text")  
                .style("font-size", "58%")
                //.style("font-weight", "bold")
                .style("text-anchor", "middle");      

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .style("font-size", "66%")
              //.style("font-weight", "bold")
              .style("text-anchor", "start") 
              .append("text")
                .style("font-size", "112%")
                .style("text-transform", "uppercase")
                .attr('dy', '-2.05em')
                .attr('dx', '-1.35em')
                .text(attrs.labels || "consumption");

          svg.append("g")
              .attr("class", "y axis")
              //.call(yAxis)
              .append("text")
                //.attr("transform", "rotate(-90)")
                //.attr("y", 6)
                .attr("dy", "-1.1em")
                .attr('dx', '-1.5em')       
                .style("font-size", "66%")
                //.style("font-weight", "bold")
                .style("text-anchor", "start")
                .text(attrs.units || "kWh/day");

          var selection = svg.selectAll(".selection")
              .data(processed_data)
            .enter().append("g")
              .attr("class", "selection")
              //.attr("transform", function (d) { return "translate(" + x(d.date) + ",0)"; });
              .attr("transform", function (d) { return "translate(" + x(getDate(d)) + ",0)"; });

          selection.selectAll("rect")
            .data(function (d) { return d.values; })
          .enter().append("rect")
            .attr("width", width / processed_data.length)
            //.attr("width", x.rangeBand())
            //.attr("width", 20)
            .attr("y", function (d) { return y(d.y1); })
            .attr("height", function (d) { return y(d.y0) - y(d.y1); })
            .style("fill", function (d) { return color(d.tariff); })
            .style("stroke", "white")
            .on("mouseover", function (d) { showPopover.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

          function removePopovers () {
            $('.popover').each(function() {
              $(this).remove();
            }); 
          }

          function showPopover (d) {
            $(this).popover({
              title: d.name,
              placement: 'auto top',
              container: 'body',
              trigger: 'manual',
              html : true,
              content: function() { 
                //return poplabels[0] + ": " + d.tariff + "
                                return poplabels[0] + ": " + replaceTarname(d.tariff) + //(tariff === 'string' ? tariffs[i] == types[i] : d.tariff) + 
                //with labels: return "Tarifa: " + getLabels(d.tariff) +
                       //"<br/>Consumption: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0) + " kWh"; }
                       "<br/>" + poplabels[1] + ": " + d3.round(d3.format(",")(d.value ? d.value: d.y1 - d.y0), 1) + " kWh"; }
            });
            $(this).popover('show')
          }
        return ct202a;
        };


//(d3.select('text').text(function(d){return d.types;})
    Empowering.Graphics.CT202B = function(attrs) {

        var ct202b = {};
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
            .range(["#225C10","#84E464","#c4e464","#64e4c4"]),
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


        return ct202b;

        };


    Empowering.Graphics.OT401 = function(attrs) {
        var ot401 = {};

        var LOCALES = {
            ca: 'catalan',
            es: 'spanish',
            en: 'english',
            de: 'german',
            it: 'italian',
            fr: 'french'
        };

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        var width = 1100;//1075;

        var iconSize = attrs.iconSize || 80;

        ot401.plot = d3.select(attrs.container)
                .append('div')
                .attr('class', 'ot401');

        var tip = ot401.plot.selectAll('div')
            .data(attrs.data)
            .enter().append('div')
            .attr('class', 'tip')
            .classed("svg-container-ot401", true)
            .attr('style', 'width: ' + width/3 + 'px');
       
        tip.append('div')
            .attr('class', 'icon')
            .append('i')
            .attr('class', function(d) { return 'icon-TIP_' +
                parseInt(d.tipId).toString().charAt(0);})
            .attr('style', 'font-size: ' + iconSize + 'px');

        tip.append('div')
            .attr('class', 'text')
            .text(function(d) {
                return d.tipDescription[LOCALES[attrs.locale]];
            });
    };


    Empowering.Graphics.OT503 = function(attrs) {
        var ot503 = {};

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

        ///***Definition of primary chart environment: Bar chart***
        var barWidth = width / data.length;

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

        ///***Definition of scales for the three axis. For the x, width is limited in order to define 
        ///a stroke between bars e.g. ".3" establishes the stroke by barWitdh-30%***
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .3);
        //var x = d3.time.scale().range([0, width]); //without stroke between bars
        var y = d3.scale.linear().range([height, 0]);
        var y0 = d3.scale.linear().range([height, 0]);

        ///***Preparation for data selection***
        data.forEach(function(d) {
            d.month = parseDate(d.month + "");
            d.consumption = +d.consumption;
            d.temperature = +d.temperature;
        });

        ///***Definition of data domains: it is here necessary to define specific 
        ///values for min and max domains depending on each climate area
        ///e.g. min 5 and max 30***
        x.domain(data.map(function(d) { return d.month; })); //x.domain(d3.extent(data, function(d) { return d.month; })); //other way to define
        y.domain([0, 50+d3.max(data, function(d) { return d.consumption; })]); //y.domain([0, 200]); //other way to define
        y0.domain([
            (d3.min(data, function(d) { return d.temperature; }) <= 5) ? true : 5,
            (d3.max(data, function(d) { return d.temperature; })) >= 30 ? true : 30*1.1
            ]); //y0.domain([0, 40]); //other way to define
        
        ///***Definition of selection for user language or predefined language***
        var locale = Empowering.LOCALES[attrs.locale || "en_UK"];

        ///***Definition of orientation and format for the three axis***
        var xAxis = d3.svg.axis().scale(x).orient("bottom")
            .tickSize(5)
            .tickFormat(locale.timeFormat("%b %y"))
            .ticks(d3.min([12, data.length])); //.ticks(d3.time.years, 2); //other way to define
        var yAxisLeft = d3.svg.axis().scale(y).orient("left").ticks(5);
        var yAxisRight = d3.svg.axis().scale(y0).orient("right").ticks(5);

        ///***Definition of secondary chart environment: line chart***
        var line = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y0(d.temperature); })
            .interpolate("cardinal")
            .tension(0.6);

        ///***Definition of function for grid lines: Vertical and Horitzontal***
        function make_V_grid() {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(5)
        }
        function make_H_grid() {
            return d3.svg.axis()
                .scale(y0)
                .orient("left")
                .ticks(5);
        }

        ///***Definition of style for the three axis***
        ///xAxis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")") //move to bottom
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "41%")
            .attr("dx", "-.7em")
            .attr("dy", "0em")
            .attr("transform", "rotate(-35)" );

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
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar") //.style("stroke", "white") //when a stroke was not defined in the scales
            .attr("x", function(d) { return x(d.month); })
            .attr("width", x.rangeBand()) //.attr("width", barWidth) //other way to define
            .attr("y", function(d) { return y(d.consumption); })
            .attr("height", function(d) { return height - y(d.consumption); })
            .on("mouseover", function (d) { showPopoverBar.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

        ///***Introducing data in the secondary environment: line chart***
        svg.append("path") //line path
            .datum(data)
            .attr("class", "line temperature")
            .attr("transform", "translate(" + barWidth/2*(1-0.3) + ",0)") //.attr("transform", function (d) { return "translate(" + x(d.month) + "10,0)"; }) //other way to define
            .attr("d", line(data));

        ///***Introducing data in an extra environment: points of the line chart***
        svg.selectAll('.ot503')
            .data(data).enter()
            .append('circle') //points
            .attr('class', 'point temperature')
            .attr("transform", "translate(" + barWidth/2*(1-0.3) + ",0)")
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y0(d.temperature); })
            .attr('r', 4)
            .on("mouseover", function (d) { showPopoverLine.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

        ///***Definition of legend***
        ///LABELS FOR THE PRIMARY AND SECONDARY ENVIRONMENT
        var labels = attrs.labels || {
            0: 'Consumption',
            1: 'Temperature',
        };

        var units = attrs.units || {
            0: 'kWh/month',
            1: 'ºC',
        };

        ///UPPER VISUALIZATION FOR THE TEXT (LABELS)
        ///yAxisLeft
        svg.append("g") 
        .attr("class", "y axis")
        //.attr("transform", "translate(-5,0)") //move to left
        .call(yAxisLeft)
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start") 
            .append("text")
            .style("font-size", "112%")
            .style("text-transform", "uppercase")
            .attr('dy', '-1.05em')
            //.attr('dx', '4.8em') //left xtreme
            .attr('dx', '9.7em')
            .text(labels[0]);

        svg.append("g") 
        .attr("class", "y axis")
        //.attr("transform", "translate(-5,0)") //move to left
        //.call(yAxisLeft)
            .append("text")
            .attr("dy", "-0.1em")
            .attr('dx', '-2.2em')       
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start")
            .text(units[0]);

        ///yAxisRight
        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width) + " ,0)") //move to right
        .call(yAxisRight)
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "start") 
            .append("text")
            .style("font-size", "112%")
            .style("text-transform", "uppercase")
            .attr('dy', '-1.05em')
            //.attr('dx', '1.5em') //right xtreme
            .attr('dx', '-12.4em')
            .text(labels[1]);

        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width) + " ,0)") //move to right
        //.call(yAxisRight)
            .append("text")
            .attr("dy", "-0.1em")
            .attr('dx', '1.7em')       
            .style("font-size", "66%")
            //.style("font-weight", "bold")
            .style("text-anchor", "end")
            .text(units[1]);

        ///VISUALIZATION FOR LEGEND OF THE BAR CHART
        //BOTTOM
        /*var legendBar = svg.append("rect")
              .attr("class", "bar")
              .attr("x", width/2.5-50)
              .attr("y", height + margin.bottom/1.25)
              .attr("width", x.rangeBand())
              .attr("height", 10);*/
        ///UPPER
        var legendBar = svg.append("rect")
              .attr("class", "bar")
              //.attr("x", 5-margin.left) //left xtreme
              .attr("x", 170-margin.left)
              .attr("y", 18-margin.top)
              //.attr('dy', 'width-5em')
              //.attr('dx', '0.4em')
              .attr("width", x.rangeBand())
              .attr("height", 15);
        ///VISUALIZATION FOR LEGEND OF THE POINTS OF THE LINE CHART 
        //BOTTOM
        /*var legendCircle = svg.append('circle')
                .attr('class', 'point temperature')
                .attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cy", 0)
                .attr('r', 4);*/
        ///UPPER
        var legendCircle = svg.append('circle')
                .attr('class', 'point temperature')
                //.attr("cx", width-155+1.1*x.rangeBand()/2) //right xtreme
                .attr("cx", width-265+1.1*x.rangeBand()/2)
                .attr("cy", 25.5-margin.top)
                .attr('r', 6);

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
                .attr("x", width-265) 
                .attr("y", 25.5-margin.top)
                .attr("width", 1.1*x.rangeBand())
                .attr("height", 1)
                .style("stroke-width", "1px");

        ///***Definition of functions for dynamisation of chart***
        ///WHEN NO OVER 
        function removePopovers () {
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
        }

        return ot503;
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
