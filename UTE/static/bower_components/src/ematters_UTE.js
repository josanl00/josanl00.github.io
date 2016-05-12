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
        /*var cons = [
            Math.round(data.averageConsumption),
            Math.round(data.consumption)
        ];*/

        var cons_d = attrs.data.consumption;
        var avg_d = attrs.data.averageConsumption;
        var colorin = d3.scale.ordinal().range(["#AECCEC", "#3278C2", "#161686"]);
        var avgcolorin = d3.scale.ordinal().range(["#F6CF9F", "#ED933D", "#FE733A"]);

        //Make list of arrays
        /*var a = {"apples": 3, "oranges": 4, "bananas": 42};    
        var array_keys = new Array();
        var array_values = new Array();
        for (var key in a) {
            array_keys.push(key);
            array_values.push(a[key]);
        };
        alert(array_keys);
        alert(array_values);*/

        var cons = new Array();
        var avg = new Array();
        for (var key in cons_d || avg_d) {
          cons.push(cons_d[key]);
          avg.push(avg_d[key]);
        };



console.log("cons is", cons)
console.log("avgcons is", avg)

        cons.sort(function(a,b) {return b-a;});
        avg.sort(function(a,b) {return b-a;});

console.log("cons is", cons)
console.log("avgcons is", avg)
        /*cons.forEach(
            function (d) {
                //var y0 = 0;
                //d.tariffs = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                d.p1 = d.p1,
                d.p2 = d.p2,
                d.p3 = d.p3
            }
        );*/


        /*
        Some calculated metadata for CT105
        */

        /*ct105.getEfficientCustomersPercent = function() {
            return parseFloat(((
                data.numberCustomersEff / (
                    data.numberCustomersEff + data.numberCustomers
                )
            ) * 100).toFixed(2));
        };

        ct105.getRanking = function() {
            if (data.consumption < data.averageEffConsumption) {
                return 'GREAT';
            }
            else if (data.consumption < data.averageConsumption) {
                return 'GOOD';
            }
            else {
                return 'BAD';
            }

        };*/

        /*
        Definition of labels
        */

        var styles = {
          0: 'averageConsumption',
          1: 'consumption'
        };
        var labels = attrs.labels || {
            0: 'Your neighbors',
            1: 'You'
        };
        var icons = {
            0: '\uf0c0',
            1: '\uf007'
        };

        /*
        Definition of chart environment
        */

 


        var width =  400,// other type of make it responsive but without autoresizing: var width = parseInt(d3.select('#per').style('width'), 10),
        height = 300,
        barWidth = width/2,

        labelSize = 24,
        barHeight = height - labelSize - 20,
        rectWidth = barWidth * 0.375,
        barEnerWidth = barWidth * 0.5;

        var main = d3.select(attrs.container)
                   .append('div')
                   .classed("svg-container-ct105", true) //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 600 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true);    

        var y = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0, d3.max(cons)]);

        var ycons = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0, d3.max(cons)]);
        
        var yavg = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0, d3.max(avg)]);
        

        /*
        Definition of chart details
        */

        //MAIN CHART DEFINITION
        var bar_cons = main.selectAll('div')
            .data(cons)
            .enter().append('g')
            .style("fill", function(d, i) { return colorin(i); })
            .style('text-anchor', 'end')
            .attr('transform', 'translate(' + (width-width/8) + ',0)')
            //.attr('class', function(d, i) {return 'ot101 ' + styles[i]; })
            //.attr('transform', function(d, i) {return 'translate(100,0)'; //+ i * barWidth + ', 0)';
//          })
;


        var bar_avg = main.selectAll('div')
            .data(avg)
            .enter().append('g')
            .style("fill", function(d, i) { return avgcolorin(i); })
            .attr('transform', 'translate(0,0)')
            //.attr('class', function(d, i) {return 'ot101 ' + styles[i]; })
            //.attr('transform', function(d, i) {return 'translate('+ 200 + ',100)'; //+ i * barWidth + ', 0)';
          //})
;

        //ICONS
        bar_cons.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' +
                            'text-anchor: end')
            .attr('x', width-3*width/8)
            .attr('y', barHeight)
            .text(icons[1]);

        bar_avg.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' +
                            'text-anchor: start')
            .attr('x', 0)
            .attr('y', barHeight)
            .text(icons[0]);

        //LINE BETWEEEN CHART AND ICON
         bar_cons.append("rect")
                .attr("class", "line")
                .attr("x", rectWidth+barEnerWidth-100) 
                .attr("y", barHeight)
                .attr("width", rectWidth+barEnerWidth-10)
                .attr("height", 2)
                .style("stroke-width", "1px");
         bar_avg.append("rect")
                .attr("class", "line")
                .attr("x", 10) 
                .attr("y", barHeight)
                .attr("width", rectWidth+barEnerWidth-10)
                .attr("height", 2)
                .style("stroke-width", "1px");
        //STACKED BAR WITH ROUNDED EFFECT
        bar_cons.append('path')
        //bar.append('path')
                .attr('d', function(d) {
                    return roundedRect(
                        rectWidth, ycons(d), barEnerWidth, barHeight - ycons(d), barEnerWidth/5, //The string "barEnerWidth/4" is referred to the radio of the rounded border 
                        true, true, false, false);
                });
        bar_avg.append('path')
        //bar.append('path')
                .attr('d', function(d) {
                    return roundedRect(
                        rectWidth, yavg(d), barEnerWidth, barHeight - yavg(d), barEnerWidth/5, //The string "barEnerWidth/4" is referred to the radio of the rounded border 
                        true, true, false, false);
                });

        //TEXT INSIDE BAR
        bar_cons.append('text')
                .attr('x', barWidth-width/8-(width/8)/2 )
                .attr('y', function(d) { return ycons(d) + 15*2.5; })
                //.attr('dy', '.' + width * 0.125 + 'em')
                //.attr('style', 'font-size:' +1+'px')
                .attr('class', 'label')
                //.attr('style', 'font-size: 1px')
                .attr('style', 'fill: white')
                .attr("text-anchor", "middle")
                .text(function(d) { return Math.round(d) + ' kWh'; });

        bar_avg.append('text')
                .attr('x', barWidth-width/8-(width/8)/2)
                .attr('y', function(d) { return yavg(d) + 15*2.5; })
                //.attr('dy', '.' + width * 0.125 + 'em')
                .attr('class', 'label')
                .attr('style', 'font-size: ' + width * 0.0 + 'px')
                .attr('style', 'fill: white')
                .attr("text-anchor", "middle")
                .text(function(d) { return Math.round(d) + ' kWh'; });

        //LABEL TEXTS
        bar_cons.append('text')
        .attr("text-anchor", "middle")
            .attr('x', barWidth/2)
            .attr('y', height -10)
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .text(labels[1]);

        bar_avg.append('text')
        .attr("text-anchor", "middle")
            .attr('x', barWidth/2)
            .attr('y', height -10)
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .text(labels[0]);

        //LEGEND
        bar_cons.append("rect")
                .attr("class", "line")
                .attr("x", rectWidth+barEnerWidth-100) 
                .attr("y", height/2)
                .attr("width", rectWidth+barEnerWidth-10)
                .attr("height", 2)
                .style("stroke-width", "1px");
         bar_avg.append("rect")
                .attr("class", "line")
                .attr("x", 10) 
                .attr("y", height/2)
                .attr("width", rectWidth+barEnerWidth-10)
                .attr("height", 2)
                .style("stroke-width", "1px");

        return ct105;

    };

    Empowering.Graphics.OT102 = function(attrs) {
        var ot102 = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        /*
        Some calculated metadata for OT102
        */

        ot102.getCertificationRate = function(v) {

            var Rates = {
            'A': (1/7)/2,
            'B': (1/7+2/7)/2,
            'C': (2/7+3/7)/2,
            'D': (3/7+4/7)/2,
            'E': (4/7+5/7)/2,
            'F': (5/7+6/7)/2,
            'G': (6/7+7/7)/2
            };

            if (v < 1/7) {
                return Rates['A'];
            }
            else if (v >=1/7 && v < 2/7) {
                return Rates['B'];
            }
            else if (v >=2/7 && v < 3/7) {
                return Rates['C'];
            }
            else if (v >=3/7 && v < 4/7) {
                return Rates['D'];
            }
            else if (v >=4/7 && v < 5/7) {
                return Rates['E'];
            }
            else if (v >=5/7 && v < 6/7) {
                return Rates['F'];
            }
            else if (v >=6/7 && v < 7/7) {
                return Rates['G'];
            }
        
        };

        /*
        Definition of chart environment
        */

        (function() {
          var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

          percent = ot102.getCertificationRate(data.quantile);

          barWidth = 90; //default: 40

          numSections = 7;

          sectionPerc = 1 / numSections / 2;

          padRad = 0.05;

          chartInset = 50;

          totalPercent = .75;

          el = d3.select(attrs.container)
          .append('div')
          .classed("svg-container-ot102", true); //container class to make it responsive

          margin = {
            top: -40, //default: 20
            right: 0, //default: 20
            bottom: 10, //default: 30
            left: 0 //default: 20
          };

          width  = 500 - margin.left - margin.right, 

          height = width;

          radius = Math.min(width, height) / 2;

          percToDeg = function(perc) {
            return perc * 360;
          };

          percToRad = function(perc) {
            return degToRad(percToDeg(perc));
          };

          degToRad = function(deg) {
            return deg * Math.PI / 180;
          };

          svg = el.append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 500 500")
                //class to make it responsive
                .classed("svg-content-responsive", true);

          chart = svg.append('g')
                //.attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");
                .attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");


          for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
            arcStartRad = percToRad(totalPercent);
            arcEndRad = arcStartRad + percToRad(sectionPerc);
            totalPercent += sectionPerc;
            startPadRad = sectionIndx === 0 ? 0 : padRad / 4;//padRad / 2;
            endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
            arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
            chart.append('path').attr('class', "arc chart-color" + sectionIndx).attr('d', arc);
          }
        
          //Adding labels
          chart.append("text")
          .attr("dy", percent<1/7 ? "-0.5em" : "-1.3em")
          .attr("dx", percent<1/7 ? "-3.7em" : "-7.7em")
          .style("fill", "white")
          .style("font-size", percent<1/7 ? "175%" : "83%")
          .style("font-weight", percent<1/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          //.attr("transform", "translate (-65,-125) rotate(-80)")
          .text("A");

          chart.append("text")
          .attr("dy",percent>=1/7 && percent<2/7 ? "-2em" : "-4.5em")
          .attr("dx", percent>=1/7 && percent<2/7 ? "-3em" : "-6.3em")
          .style("fill", "white")
          .style("font-size", percent>=1/7 && percent<2/7 ? "175%" : "83%")
          .style("font-weight", percent>=1/7 && percent<2/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("B");

          chart.append("text")
          .attr("dy", percent>=2/7 && percent<3/7 ? "-3.1em"  : "-6.8em")
          .attr("dx", percent>=2/7 && percent<3/7 ? "-1.7em"  : "-3.5em")
          .style("fill", "white")
          .style("font-size", percent>=2/7 && percent<3/7 ? "175%" : "83%")
          .style("font-weight", percent>=2/7 && percent<3/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("C");

          chart.append("text")
          .attr("dy", percent>=3/7 && percent<4/7 ? "-3.4em"  : "-7.5em")
          .attr("dx", percent>=3/7 && percent<4/7 ? "0em"  : "0em")
          .style("fill", "white")
          .style("font-size", percent>=3/7 && percent<4/7 ? "175%" : "83%")
          .style("font-weight", percent>=3/7 && percent<4/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("D");

          chart.append("text")
          .attr("dy", percent>=4/7 && percent<5/7 ? "-3.1em"  : "-6.8em")
          .attr("dx", percent>=4/7 && percent<5/7 ? "1.65em"  : "3.3em")
          .style("fill", "white")
          .style("font-size", percent>=4/7 && percent<5/7 ? "175%" : "83%")
          .style("font-weight", percent>=4/7 && percent<5/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("E");

          chart.append("text")
          .attr("dy", percent>=5/7 && percent<6/7 ? "-2em"  : "-4.7em")
          .attr("dx", percent>=5/7 && percent<6/7 ? "3em"  : "6.2em")
          .style("fill", "white")
          .style("font-size", percent>=5/7 && percent<6/7 ? "175%" : "83%")
          .style("font-weight", percent>=5/7 && percent<6/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("F");
          
          chart.append("text")
          .attr("dy", percent>=6/7 && percent<7/7 ? "-0.5em" : "-1.3em")
          .attr("dx", percent>=6/7 && percent<7/7 ? "3.7em" : "7.7em")
          .style("fill", "white")
          .style("font-size", percent>=6/7 && percent<7/7 ? "175%" : "83%")
          .style("font-weight", percent>=6/7 && percent<7/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("G");

          //Adding needle to the Pie chart
          Needle = (function() {
            function Needle(len, radius1) {
              this.len = len;
              this.radius = radius1;
            }

            Needle.prototype.drawOn = function(el, perc) {
              el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
              return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
            };

            Needle.prototype.animateOn = function(el, perc) {
              var self;
              self = this;
              return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function() {
                return function(percentOfPercent) {
                  var progress;
                  progress = percentOfPercent * perc;
                  return d3.select(this).attr('d', self.mkCmd(progress));
                };
              });
            };

            Needle.prototype.mkCmd = function(perc) {
              var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
              thetaRad = percToRad(perc / 2);
              centerX = 0;
              centerY = 0;
              topX = centerX - this.len * Math.cos(thetaRad);
              topY = centerY - this.len * Math.sin(thetaRad);
              leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
              leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
              rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
              rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
              return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
            };

            return Needle;

          })();

          needle = new Needle(130,21);//(90, 15);

          ///Without animation
          needle.drawOn(chart, percent);

          ///With animation
          ///needle.drawOn(chart, 0);
          ///needle.animateOn(chart, percent);

        }).call(this);
        return ot102;
    };

    Empowering.Graphics.OT103 = function(attrs) {
        var ot103 = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        /*
        Some calculated metadata for OT103
        */

        ot103.getDiffConsumption = function() {
            var eff = 0;
            var med = 0;
            var consumption_last12month = d3.sum(data, function(d) {
                return d.consumption;
            });
            var avgConsumption_last12month = d3.sum(data, function(d) {
                if (d.consumption !== null) {
                    return d.averageConsumption;
                }
            });
            var avgEffConsumption_last12month = d3.sum(data, function(d) {
                if (d.consumption !== null) {
                    return d.averageEffConsumption;
                }
            });
            var consumption_last3month = d3.sum(data.slice(length-3,length[length]), function(d) {
                return d.consumption;
            });
            var avgConsumption_last3month = d3.sum(data.slice(length-3,length[length]), function(d) {
                if (d.consumption !== null) {
                    return d.averageConsumption;
                }
            });
            var avgEffConsumption_last3month = d3.sum(data.slice(length-3,length[length]), function(d) {
                if (d.consumption !== null) {
                    return d.averageEffConsumption;
                }
            });

            eff = parseFloat(((avgEffConsumption_last3month-consumption_last3month)/(consumption_last12month) * 100).toFixed(2));
            med = parseFloat(((avgConsumption_last3month-consumption_last3month)/(consumption_last12month) * 100).toFixed(2));
            return {eff: eff, med: med};
        };

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
        var y = d3.scale.linear().range([height, 0]);

        ///***Preparation for data selection***
        var allCons = [];
        var consumption = [];
        var averageConsumption = [];
        var averageEffConsumption = [];

        data.forEach(function(d) {
            d.month = parseDate(d.month + '');
            if (d.consumption !== null) {
                consumption.push(d);
            }
            if (d.averageConsumption !== null) {
                averageConsumption.push(d);
            }
            if (d.averageEffConsumption !== null) {
                averageEffConsumption.push(d);
            }
            allCons.push(
                d.consumption, d.averageEffConsumption, d.averageConsumption
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
            .y(function(d) { return y(d.consumption); });

        var lineAvgEff = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y(d.averageEffConsumption); });

        var lineAvg = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y(d.averageConsumption); });

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
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('kWh');

        ///***Definition of legend***
        var labels = attrs.labels || {
            0: 'Your neighbors',
            1: 'You',
            2: 'Your efficient neighbors'
        };

        var styles = {
          0: 'averageConsumption',
          1: 'consumption',
          2: 'averageEffConsumption'
        };

        var poplabels = attrs.poplabels || {
            0: 'Consumption'
        };

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

        var legendAvgEff = svg.append('circle')
                .attr('class', 'point averageEffConsumption')
                //.attr("cx", width/2.5+x.rangeBand()*2.5)
                .attr("cx", width-240)
                .attr("cy", height + margin.bottom/1.35)
                .attr('r', 10);

        ///***Definition of paths***
        svg.selectAll('.ot103')
            .data(data).enter()
            .append('line')
            .attr('class', 'x vertical')
            .attr('x1', function(d) { return x(d.month); })
            .attr('x2', function(d) { return x(d.month); })
            .attr('y1', 0)
            .attr('y2', height);

        svg.append('path')
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
            .on("mouseout",  function (d) { removePopovers(); });

        svg.append('path')
            .datum(averageConsumption)
            .attr('class', 'line averageConsumption')
            .attr('d', lineAvg);

        svg.selectAll('.ot103')
            .data(averageConsumption).enter()
            .append('circle')
            .attr('class', 'point averageConsumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.averageConsumption); })
            .attr('r', 6)
            .on("mouseover", function (d) { showPopoverLineAvg.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

        svg.append('path')
            .datum(consumption)
            .attr('class', 'line consumption')
            .attr('d', line);

        svg.selectAll('.ot103')
            .data(consumption).enter()
            .append('circle')
            .attr('class', 'point consumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.consumption); })
            .attr('r', 8)
            .on("mouseover", function (d) { showPopoverLine.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); });

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
            return  poplabels[0] + ": " + d3.round(d3.format(",")(d.averageConsumption), 1)+ " kWh";
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
            return  poplabels[0] + ": " + d3.round(d3.format(",")(d.consumption), 1)+ " kWh";
            }
        });
        $(this).popover('show')
        }

        function showPopoverLineEff (d) {
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
        }

        return ot103;
    };

    Empowering.Graphics.OT201 = function(attrs) {

        var ot201 = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        /*
        Some calculated metadata for OT201
        */

        ot201.getDiffConsumption = function() {
            var diff = (data.actualConsumption - data.previousConsumption);
            diff = diff / data.previousConsumption;
            return parseFloat((diff * 100).toFixed(2));
        };

        /*
        Definition of time formats
        */

        var locale = Empowering.LOCALES[attrs.locale || "en_UK"];

        var parseDate = d3.time.format('%Y%m').parse;

        var timeYear = d3.time.format('%Y');

        var timeMonth = locale.timeFormat('%B');

        var cons = [
            parseInt(data.previousConsumption),
            parseInt(data.actualConsumption)
        ];

        /*
        Definition of different chart sources
        */

        var styles = {
          0: 'previousConsumption',
          1: 'consumption'
        };

        var icons = {
            0: '\uf007',
            1: '\uf007'
        };

        var years = {
          0: timeYear(parseDate(data.month - 100 + "")),
          1: timeYear(parseDate(data.month + ""))
        }

        var months = {
          0: timeMonth(parseDate(data.month - 100 + "")),
          1: timeMonth(parseDate(data.month + ""))
        }

        /*
        Definition of chart environment
        */

        var width = 462;
        var height = 231;

        ot201.plot = d3.select(attrs.container)
           .append('div')
           .classed("svg-container-ot201", true) //container class to make it responsive
           .append("svg")
           //responsive SVG needs these 2 attributes and no width and height attr
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 462 231")
           //class to make it responsive
           .classed("svg-content-responsive", true);

        var barWidth = width / cons.length;
        //var labelSize = 10;
        var barHeight = height - 20;//- labelSize - 10;
        var rectWidth = barWidth *0.25;//* 0.375;
        var barEnerWidth = barWidth *0.5;//* 0.5;

        var y = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0, d3.max(cons)]);

        ///Bars in the chart
        var bar = ot201.plot.selectAll('g')
            .data(cons)
            .enter().append('g')
            .attr('class', function(d, i) {return 'ot201 ' + styles[i]; })
            .attr('transform', function(d, i) {
                return 'translate(' + i * barWidth + ', 0)';
            });

        ///Adding bars with rounded corners
        bar.append('path')
        .attr('d', function(d) {
            return roundedRect(
                rectWidth, y(d), barEnerWidth, barHeight - y(d), barEnerWidth/5, //The string "barEnerWidth/4" is referred to the radio of the rounded border 
                true, true, false, false);
        });

        ///Upper text
        bar.append('text')
                .attr('x', rectWidth +58)//38 )
                .attr('y', function(d) { return y(d) + 37; })
                .attr('dy', '.' + width * 0.125 + 'em')
            .attr('class', 'value')
                .attr('style', 'font-size: ' + width * 0.05 + 'px')
                .text(function(d) { return d + ' kWh'; });

        ///Lower text
        bar.append('text')
            .attr('x', rectWidth +58)
            .attr('y', height - 50)
            //.attr('class', 'label')
            .attr('class', 'value')
            .attr('style', 'font-size: ' + width * 0.037 + 'px')
            //.style('font-weight', 'bold')
            .text(function(d, i) { return years[i]; });

        bar.append('text')
            .attr('x', rectWidth +58)
            .attr('y', height - 30)
            //.attr('class', 'label')
            .attr('class', 'value')
            .attr('style', 'font-size: ' + width * 0.037  + 'px')
            .style('text-transform', 'uppercase')
            //.style('font-weight', 'bold')
            .text(function(d, i) { return months[i]; });

        ///Adding icon
        var icon = ot201.plot.selectAll('.icon')
            .data(cons)
            .enter().append('g')
            .attr('class', 'ot201 icon')
            .append('text')

                .attr('style', 'font: ' + parseInt(width / 8) + 'px FontAwesome;' + // width/12
                                'text-anchor: start')
                .attr('x', barWidth-23)
                //.attr('y', barHeight)
                .attr('y', barHeight)
                //.text(function(d, i) {return icons[i]; });
                .text('\uf007');

        ///Line in the chart
        var line = ot201.plot.selectAll('.line')
            .data(cons)
            .enter().append('g')
            .attr('class', 'ot201 consumption')
            .append('line')
                .attr("transform", "translate (0,0)")
                .attr('x1', 0)//width * 0.025)
                .attr('x2', barWidth*2 )//rectWidth + barEnerWidth)
                .attr('y1', barHeight)
                .attr('y2', barHeight);

        return ot201;

    };

    Empowering.Graphics.OT302A = function(attrs) {

        var ot302a = {};
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
        return ot302a;
        };


//(d3.select('text').text(function(d){return d.types;})
    Empowering.Graphics.OT302B = function(attrs) {

        var ot302b = {};
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


        return ot302b;

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
