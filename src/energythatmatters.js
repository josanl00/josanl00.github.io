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

    Empowering.Graphics.OT101 = function(attrs) {

        /*
        {
              'contractId': '123457ABC',
              'companyId': 1234567890,
              'month': 201307,
              'setup': 52234e386cb9fea66d5b2511,
              'consumption': 1,
              'averageEffConsumption': 1,
              'averageConsumption': 1,
              'diffAverageEffConsumption': -33,
              'diffAverageConsumption': -61,
              'numberCustomersEff': 1,
              'numberCustomers': 1
         }
         */

        var ot101 = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;
        var cons = [
            Math.round(data.averageConsumption),
            Math.round(data.consumption),
            Math.round(data.averageEffConsumption)
        ];

        /*
        Some calculated metadata for OT101
        */

        ot101.getEfficientCustomersPercent = function() {
            return parseFloat(((
                data.numberCustomersEff / (
                    data.numberCustomersEff + data.numberCustomers
                )
            ) * 100).toFixed(2));
        };

        ot101.getRanking = function() {
            if (data.consumption < data.averageEffConsumption) {
                return 'GREAT';
            }
            else if (data.consumption < data.averageConsumption) {
                return 'GOOD';
            }
            else {
                return 'BAD';
            }

        };

        var styles = {
          0: 'averageConsumption',
          1: 'consumption',
          2: 'averageEffConsumption'
        };
        var labels = attrs.labels || {
            0: 'Your neighbors',
            1: 'You',
            2: 'Your efficient neighbors'
        };
        var icons = {
            0: '\uf0c0',
            1: '\uf007',
            2: '\uf0c0'
        };
        var width = attrs.width || 600;
        var height = attrs.height || 300;

        ot101.plot = d3.select(attrs.container)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

        var barWidth = width / cons.length;
        var labelSize = 24;
        var barHeight = height - labelSize - 10;
        var rectWidth = barWidth * 0.375;
        var barEnerWidth = barWidth * 0.5;

        var y = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0, d3.max(cons)]);

        var bar = ot101.plot.selectAll('g')
            .data(cons)
            .enter().append('g')
            .attr('class', function(d, i) {return 'ot101 ' + styles[i]; })
            .attr('transform', function(d, i) {
                return 'translate(' + i * barWidth + ', 0)';
            });

        bar.append('text')
            .attr('class', 'icons')
            .attr('style', 'font: ' + parseInt(width / 12) + 'px FontAwesome;' +
                            'text-anchor: start')
            .attr('x', 0)
            .attr('y', barHeight)
            .text(function(d, i) {return icons[i]; });

        bar.append('line')
                .attr('x1', width * 0.025)
                .attr('x2', rectWidth + barEnerWidth)
                .attr('y1', barHeight)
                .attr('y2', barHeight);

        bar.append('path')
                .attr('d', function(d) {
                    return roundedRect(
                        rectWidth, y(d), barEnerWidth, barHeight - y(d), barEnerWidth/5, //The string "barEnerWidth/4" is referred to the radio of the rounded border 
                        true, true, false, false);
                });

        bar.append('text')
                .attr('x', width * 0.21)
                .attr('y', function(d) { return y(d) + 15*2.5; })
                .attr('dy', '.' + width * 0.125 + 'em')
            .attr('class', 'value')
                .attr('style', 'font-size: ' + width * 0.033 + 'px')
                .text(function(d) { return d + ' kWh'; });

        bar.append('text')
            .attr('x', 0)
            .attr('y', height - 2)
            .attr('class', 'label')
            .attr('style', 'font-size: ' + labelSize + 'px')
            .text(function(d, i) { return labels[i]; });

        return ot101;
    };

    Empowering.Graphics.OT102 = function(attrs) {
        var ot102 = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;
        //var cons = [
        //    parseInt(data.quantile)
        //];


        /*ot102.certificationAverage = {
            "A": (1/7)/2,
            'B': (1/7+2/7)/2,
            'C': (2/7+3/7)/2,
            'D': (3/7+4/7)/2,
            'E': (4/7+5/7)/2,
            'F': (5/7+6/7)/2,
            'G': (6/7+7/7)/2
        };*/


        ot102.getCertificationRate = function(v) {
            //for (sectionIndx = 0; data.quantile > sectionIndx/numSections && data.quantile <= (sectionIndx+1)/numSections; sectionIndx++) {
            //  data.quantile = (sectionIndx/numSections+(sectionIndx+1)/numSections)/2;
            //}
            var Rates = {
            'A': (1/7)/2,
            'B': (1/7+2/7)/2,
            'C': (2/7+3/7)/2,
            'D': (3/7+4/7)/2,
            'E': (4/7+5/7)/2,
            'F': (5/7+6/7)/2,
            'G': (6/7+7/7)/2
            };

            //var v = 0;

            //for (var i in ot102.certificationAverage) {
           //certificationAverage = this;

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
        //It was made for extracting the scale into the Handlebars template for ot102, but it didn't worked...
        /*ot102.getKeyByValue = function (v) {
            for (var prop in Rates) {
                if(Rates.hasOwnProperty(prop)) {
                    if(Rates[prop]===v)
                       return prop;
                }
            }
        };*/



        (function() {
          var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

          percent = ot102.getCertificationRate(data.quantile);

          barWidth = 90; //default: 40

          numSections = 7;

          sectionPerc = 1 / numSections / 2;

          padRad = 0.05;

          chartInset = 50;

          totalPercent = .75;

          el = d3.select(attrs.container);

          margin = {
            top: -20, //default: 20
            right: 0, //default: 20
            bottom: 10, //default: 30
            left: 0 //default: 20
          };

          //width = el[0][0].offsetWidth - margin.left - margin.right;
          //width = document.body.offsetWidth;
          width  = (attrs.width || 500) - margin.left - margin.right, 

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

          svg = el.append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

          chart = svg.append('g')
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

          console.log("Rates", percent);
           /*if (v < 1/7) {
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
            }*/
        
          //Adding labels
          chart.append("text")
          .attr("dy", percent<1/7 ? "-0.5em" : "-1.3em")
          .attr("dx", percent<1/7 ? "-3.7em" : "-7.7em")
          .style("fill", "white")
          .style("font-size", percent<1/7 ? "42px" : "20px")
          .style("font-weight", percent<1/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          //.attr("transform", "translate (-65,-125) rotate(-80)")
          .text("A");

          chart.append("text")
          .attr("dy",percent>=1/7 && percent<2/7 ? "-2em" : "-4.5em")
          .attr("dx", percent>=1/7 && percent<2/7 ? "-3em" : "-6.3em")
          .style("fill", "white")
          .style("font-size", percent>=1/7 && percent<2/7 ? "42px" : "20px")
          .style("font-weight", percent>=1/7 && percent<2/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("B");

          chart.append("text")
          .attr("dy", percent>=2/7 && percent<3/7 ? "-3.1em"  : "-6.8em")
          .attr("dx", percent>=2/7 && percent<3/7 ? "-1.7em"  : "-3.5em")
          .style("fill", "white")
          .style("font-size", percent>=2/7 && percent<3/7 ? "42px" : "20px")
          .style("font-weight", percent>=2/7 && percent<3/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("C");

          chart.append("text")
          .attr("dy", percent>=3/7 && percent<4/7 ? "-3.4em"  : "-7.5em")
          .attr("dx", percent>=3/7 && percent<4/7 ? "0em"  : "0em")
          .style("fill", "white")
          .style("font-size", percent>=3/7 && percent<4/7 ? "42px" : "20px")
          .style("font-weight", percent>=3/7 && percent<4/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("D");

          chart.append("text")
          .attr("dy", percent>=4/7 && percent<5/7 ? "-3.1em"  : "-6.8em")
          .attr("dx", percent>=4/7 && percent<5/7 ? "1.65em"  : "3.3em")
          .style("fill", "white")
          .style("font-size", percent>=4/7 && percent<5/7 ? "42px" : "20px")
          .style("font-weight", percent>=4/7 && percent<5/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("E");

          chart.append("text")
          .attr("dy", percent>=5/7 && percent<6/7 ? "-2em"  : "-4.7em")
          .attr("dx", percent>=5/7 && percent<6/7 ? "3em"  : "6.2em")
          .style("fill", "white")
          .style("font-size", percent>=5/7 && percent<6/7 ? "42px" : "20px")
          .style("font-weight", percent>=5/7 && percent<6/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("F");
          
          chart.append("text")
          .attr("dy", percent>=6/7 && percent<7/7 ? "-0.5em" : "-1.3em")
          .attr("dx", percent>=6/7 && percent<7/7 ? "3.7em" : "7.7em")
          .style("fill", "white")
          .style("font-size", percent>=6/7 && percent<7/7 ? "42px" : "20px")
          .style("font-weight", percent>=6/7 && percent<7/7 ? "bold" : "normal")
          .attr("text-anchor", "middle")
          .text("G");

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

            //Previous method only based on 12 months
            /*if (consumption < avgEffConsumption) {
                eff = (avgEffConsumption - consumption) / avgEffConsumption;
                eff = eff * -1;
                med = (avgConsumption - consumption) / avgConsumption;
                med = med * -1;
            }
            else if (consumption < avgConsumption) {
                eff = (consumption - avgEffConsumption) / avgEffConsumption;
                med = (avgConsumption - consumption) / avgConsumption;
                med = med * -1;
            }
            else {
                eff = (consumption - avgEffConsumption) / avgEffConsumption;
                med = (consumption - avgConsumption) / avgConsumption;
            }
            eff = parseFloat((eff * 100).toFixed(2));
            med = parseFloat((med * 100).toFixed(2));
            return {eff: eff, med: med};*/
            eff = parseFloat(((avgEffConsumption_last3month-consumption_last3month)/(consumption_last12month) * 100).toFixed(2));
            med = parseFloat(((avgConsumption_last3month-consumption_last3month)/(consumption_last12month) * 100).toFixed(2));
            return {eff: eff, med: med};
        };

        var parseDate = d3.time.format('%Y%m').parse;

        var margin = {top: 5, right: 40, bottom: 85, left: 40};
        var width = (attrs.width || 600) - margin.left - margin.right;
        var height = (attrs.height || 300) - margin.top - margin.bottom;
        ///var width = (attrs.width || 600) + margin.left + margin.right;
        ///var height = (attrs.height || 300) + margin.top + margin.bottom;

        ///***Definition of chart environment***
        var svg = d3.select(attrs.container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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
        var locale = Empowering.LOCALES[attrs.locale || "ca_ES"];

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

        ///VISUALIZATION FOR THE TEXT
        [0, 1, 2].forEach(function(idx) {
            svg.append('g')
                .attr('class', 'legend')
                .append('text')
                //.style("text-align", "right")
                //.attr('x', width/2.5+120*idx)
                //.attr('y', height + margin.bottom/1.1)
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

        /*.attr('class', 'point consumption')
            .attr('cx', function(d) { return x(d.month); })
            .attr('cy', function(d) { return y(d.consumption); })
            .attr('r', 7);*/

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
            .attr('r', 6);

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
            .attr('r', 6);

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
            .attr('r', 8);

        return ot103;
    };

    Empowering.Graphics.OT201 = function(attrs) {

        /*
        {
            'contractId": "1234567ABC",
            "companyId": 1234567890,
            "month": 201307,
            "setup": "52234e386cb9fea66d5b2511",
            "actualConsumption": 1,
            "previousConsumption": 1,
            "diffConsumption": 1
        }
         */

        var ot201 = {};

        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }
        var data = attrs.data;

        ot201.getDiffConsumption = function() {
            var diff = (data.actualConsumption - data.previousConsumption);
            diff = diff / data.previousConsumption;
            return parseFloat((diff * 100).toFixed(2));
        };

        var locale = Empowering.LOCALES[attrs.locale || "ca_ES"];

        var parseDate = d3.time.format('%Y%m').parse;

        var timeYear = d3.time.format('%Y');

        var timeMonth = locale.timeFormat('%B');

        var cons = [
            parseInt(data.previousConsumption),
            parseInt(data.actualConsumption)
        ];
        var styles = {
          0: 'previousConsumption',
          1: 'consumption'
        };
        /*var labels = attrs.labels || {
            0: 'Last year consumption',
            1: 'Actual consumption'
        };*/

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

        var width = attrs.width || 600;
        var height = attrs.height || 300;

        ot201.plot = d3.select(attrs.container)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

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
        /*bar.append('path')
            .attr('d', function(d) {
                return roundedRect(
                    rectWidth, y(d), barEnerWidth, barHeight - y(d), 10,
                    true, true, false, false);
            });*/
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


        /*bar.append('text')
            .attr('x', (rectWidth + 10) * 1.5)
            .attr('y', function(d) { return y(d) + 25; })
            .attr('class', 'value')
            .attr('style', 'font-size: ' + width * 0.05 + 'px') 
            .text(function(d) { return d + ' kWh'; });*/


        return ot201;

    };


    Empowering.Graphics.OT302A = function(attrs) {

        var ot302a = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

        //var data = attrs.data["dailyStats"];
        //console.log(data)

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

        var arr = attrs.data["dailyStats"];

        removeByAttr(arr, "timeSlot", "total");                  

        var parseDate = d3.time.format('%Y%m%d').parse;

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
          //console.log("arr is", arr);
          //console.log("nested is", nested);

        var margin = {top: 50, right: 20, bottom: 20, left: 30},
            width  = (attrs.width || 600) - margin.left - margin.right, //Default: 1000-margin-left-margin-right
            height = (attrs.height || 300)  - margin.top  - margin.bottom; //Default: 500-margin.top-margin-bottom

        var color = d3.scale.ordinal()
            .range(["#225C10","#84E464","#c4e464","#64e4c4"]);

        var svg = d3.select(attrs.container).append("svg")
            .attr("width",  width  + margin.left + margin.right)
            .attr("height", height + margin.top  + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        //var dayFormat = d3.time.format("%d");
        //d3.csv("data/crunchbase-quarters.csv", function (error, data) {
        //var labelVar = 'quarter';
        //var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});

        var processed_data = nested.map( function (d) {
            var return_object = 0;
            var y0 = 0;
            var total = 0;
            return {
                date: d.key,
                values: (d.values).map( function (d, i) {
                  //console.log("d is:", d)
                  //console.log("i is:", i)
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
        //console.log("return", processed_data.length)

        /*var varNames = d3.entries(data[0]).filter(function (key) {
          var nested_data = d3.nest()
          .key(function(d) {return d.timeSlot;})
          .entries(data);
          for (consumption in nested_data) {
          if (data.hasOwnProperty(consumption)) {
            if (data[consumption] === value)
          return value !== "0.77986";
          }
        }
        });*/

        // Define the color domain:
        var tariffs = [];

        processed_data.forEach(
            function (d) {
              //console.log("d is", d)
                d.date = parseDate(d.date),
                //d.date = d.date,
                d.values.forEach(
                    function(d) {
                      //console.log("tar is", d)
                        if (!(tariffs.indexOf(d.tariff) > -1)) {
                            console.log("tariff", d.tariff)
                            tariffs.push(d.tariff)
                        }
                    }
                ) 
            }
        );
        color.domain(tariffs);

        // helper function for applying d3.time.scale instead of the default d3.ordinales.scale
        function getDate(d) {
            return new Date(d.date);
        }

        // get max and min dates - this assumes data is sorted
        var minDate = getDate(processed_data[0]),
            maxDate = getDate(processed_data[processed_data.length-1]);

        //var x = d3.scale.ordinal()
            //.rangeRoundBands([0, width], .1);

        var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);

        //var x = d3.time.scale().domain([minDate, maxDate]).rangeRound([0, width], .1);

        var y = d3.scale.linear()
        .domain([0, d3.max(processed_data, function(d) { return d.total+1; })])
        .rangeRound([height, 0]);

        //default domains
          //x.domain(processed_data.map(function(d) { return d.date; }));
          //y.domain([0, d3.max(processed_data, function(d) { return d.total; })]);

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

          //color.domain(varNames);

          /*data.forEach(function (d) {
            var y0 = 0;
            d.mapping = varNames.map(function (name) { 
              return {
                name: name,
                label: d[labelVar],
                y0: y0,
                y1: y0 += +d[name]
              };
            });
            d.total = d.mapping[d.mapping.length - 1].y1;
          });*/


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
                .style("font-size", "14px")
                //.style("font-weight", "bold")
                .style("font-family", "arial")
                .style("text-anchor", "middle");      
                /*.selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" );*/

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .style("font-size", "16px")
              //.style("font-weight", "bold")
              .style("font-family", "arial")
              .style("text-anchor", "end") 
              .append("text")
                .style("font-size", "18px")
                .attr('dy', '-2.05em')
                .attr('dx', '3em')
                .text('CONSUM');

          svg.append("g")
              .attr("class", "y axis")
              //.call(yAxis)
              .append("text")
                //.attr("transform", "rotate(-90)")
                //.attr("y", 6)
                .attr("dy", "-1.1em")
                .attr('dx', '-1.5em')       
                .style("font-size", "16px")
                //.style("font-weight", "bold")
                .style("font-family", "arial")
                .style("text-anchor", "start")
                .text("kWh/dia");




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



          /*var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 10)
              .attr("width", 10)
              .attr("height", 10)
              .style("fill", color)
              .style("stroke", "grey");

          legend.append("text")
              .attr("x", width - 12)
              .attr("y", 6)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function (d) { return d; });*/

          //Labels definition (version dictionary)
          /*with labels: var labels = attrs.labels || {
              0: 'Day',
              1: 'Night',
              2: 'Evening'
          };
          var getLabels = function(d, i) { 
            //console.log("d is", d)
            i=0
            if (d === "total") 
              {return labels[i];} 
            else if (d !== "total")
              {return labels[i+1];}
          };*/



          //Labels definition (version range list)
          /*var labels = attrs.labels || d3.scale.ordinal()
            .range(["Day","Night","Evening","TariffX"]);
          var getLabels = function(d, i) { 
            console.log("d is", d)
            i=0
            if (d === "total") 
              {return labels(i);} 
            else if (d !== "total")
              {return labels(i+1);}
          };*/



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
                return "Tariff: " + d.tariff + 
                //with labels: return "Tarifa: " + getLabels(d.tariff) +
                       //"<br/>Consumption: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0) + " kWh"; }
                       "<br/>Consum: " + d3.round(d3.format(",")(d.value ? d.value: d.y1 - d.y0), 1) + " kWh"; }
            });
            $(this).popover('show')
          }
        return ot302a;
        };


        //It was made for extracting the scale into the Handlebars template for ot102, but it didn't worked...
        /*ot102.getKeyByValue = function (v) {
            for (var prop in Rates) {
                if(Rates.hasOwnProperty(prop)) {
                    if(Rates[prop]===v)
                       return prop;
                }
            }
        };*/

    Empowering.Graphics.OT302B = function(attrs) {

        var ot302b = {};
        if (typeof attrs.data === 'string') {
            attrs.data = JSON.parse(attrs.data);
        }

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

        //var labels = attrs.labels || d3.scale.ordinal()
         //   .range(["Night","Day","Evening","TariffX"]);

        var w = attrs.height || 150,                        //width, default: 300
            h = attrs.height || 150,                            //height, default: 300
            r = attrs.radius || 50,                          //radius, default: 100
            //r = Math.min(w, h) / 2,
            color = d3.scale.ordinal()
            .range(["#225C10","#84E464","#c4e464","#64e4c4"]),
            percentageFormat = d3.format("%");

        /*data = [{"label":"one", "value":20}, 
                {"label":"two", "value":50}, 
                {"label":"three", "value":30}];*/

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
        console.log("nesteddata is", nested);

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

        /*var arcs = vis.selectAll("g.slice")
              .data(pie)                   
              .enter()            
                  .append("svg:g")                
                      .attr("class", "slice")    
                      .on('mouseover', function(d) {
                          $("#tooltip")
                            .html(d.data.label)
                            .show();
                      })
                      .on('mousemove', function(d) {
                          $("#tooltip")
                            .css('left', d3.mouse(this)[0])
                            .css('top', d3.mouse(this)[1]-20)
                      })
                      .on('mouseout', function(d) {
                          $("#tooltip").html('').hide();
                      });*/

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
        var tarname = [];
        nested.forEach(function(d) {tarname.push(d.key);});

        var labels = attrs.labels || tarname;


console.log("labels is", labels);
        //Labels definition (version range list)
        /*var labels = attrs.labels || d3.scale.ordinal()
          .range(["Day","Night","Evening","TariffX"]);
        var getLabels = function(d, i) { 
          console.log("d is", d)
          i=0
          if (d === "total") 
            {return labels(i);} 
          else if (d !== "total")
            {return labels(i+1);}
        };*/

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
                return "Percentatge: " + percentageFormat(d.percentage) + 
                       "<br/>Consum: " + d3.round(d.values.cons, 1) + " kWh"}
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
                .style("font-family","arial")
                .style("font-size","14px")
                .style("font-weight","normal") 
                .attr("dx", "0em")
                .attr("dy", "-0.5em")                        //center the text on it's origin
                .text(function(d,i) { 
                //return d.data.key; //get the label from our original data array
                return labels[i];
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
                .style("font-family","arial")
                .style("font-size","16px") 
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

        var width = attrs.width || 600;
        var height = attrs.height || 300;
        //var height = attrs.height || 100%;
        var tpl = attrs.tpl || 3;
        var tipWidth = (width / tpl) -5;
        var iconSize = attrs.iconSize || 80;

        ot401.plot = d3.select(attrs.container)
                .append('div')
                .attr('style', 'width: ' + width + 'px; height: ' +
                                height + 'px')
                .attr('class', 'ot401');

        var tip = ot401.plot.selectAll('div')
            .data(attrs.data)
            .enter().append('div')
            .attr('class', 'tip')
            .attr('style', 'width: ' + tipWidth + 'px');

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

        var margin = {top: 50, right: 28, bottom: 35, left: 40};
        var width = (attrs.width || 800) - margin.left - margin.right;
        var height = (attrs.height || 400) - margin.top - margin.bottom;

        ///***Definition of primary chart environment: Bar chart***
        var barWidth = width / data.length;

        var svg = d3.select(attrs.container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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
        var locale = Empowering.LOCALES[attrs.locale || "ca_ES"];

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
            .style("font-size", "10px")
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
            0: 'Consum',
            1: 'Temperatura',
        };
        ///when a specific style is defined in CSS file, put it here
        /*var styles = [
         'styleclass1',
         'styleclass2'
        ];*/
        ///BOTTOM VISUALIZATION FOR THE TEXT (LABELS)
        /*[0, 1].forEach(function(idx) {
            svg.append('g')
                .attr('class', 'legend')
                .append('text')
                .style("text-align", "left")
                .style("text-anchor", "end") 
                .attr('x', width/2.5+120*idx)
                .attr('y', height + margin.bottom/1.1)
                //.attr('class', styles[idx]) ///when a specific style is defined in CSS file, put it here
                .text(labels[idx]);

        });*/

        ///UPPER VISUALIZATION FOR THE TEXT (LABELS)
        ///yAxisLeft
        svg.append("g") 
        .attr("class", "y axis")
        //.attr("transform", "translate(-5,0)") //move to left
        .call(yAxisLeft)
            .style("font-size", "16px")
            //.style("font-weight", "bold")
            .style("text-anchor", "end") 
            .append("text")
            .style("font-size", "18px")
            .style("text-transform", "uppercase")
            .attr('dy', '-1.05em')
            //.attr('dx', '4.8em') //left xtreme
            .attr('dx', '14em')
            .text(labels[0]);

        svg.append("g") 
        .attr("class", "y axis")
        //.attr("transform", "translate(-5,0)") //move to left
        //.call(yAxisLeft)
            .append("text")
            .attr("dy", "-0.1em")
            .attr('dx', '-2.2em')       
            .style("font-size", "16px")
            //.style("font-weight", "bold")
            .style("text-anchor", "start")
            .text("kWh/mes");

        ///yAxisRight
        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width) + " ,0)") //move to right
        .call(yAxisRight)
            .style("font-size", "16px")
            //.style("font-weight", "bold")
            .style("text-anchor", "end") 
            .append("text")
            .style("font-size", "18px")
            .style("text-transform", "uppercase")
            .attr('dy', '-1.05em')
            //.attr('dx', '1.5em') //right xtreme
            .attr('dx', '-6.5em')
            .text(labels[1]);

        svg.append("g") 
        .attr("class", "y axis") 
        .attr("transform", "translate(" + (width) + " ,0)") //move to right
        //.call(yAxisRight)
            .append("text")
            .attr("dy", "-0.1em")
            .attr('dx', '0.6em')       
            .style("font-size", "16px")
            //.style("font-weight", "bold")
            .style("text-anchor", "start")
            .text("ºC");

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
              .attr("y", 17-margin.top)
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
                .attr("cx", width-300+1.1*x.rangeBand()/2)
                .attr("cy", 25-margin.top)
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
                .attr("x", width-300) 
                .attr("y", 25-margin.top)
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
            return "Consum: " + d.consumption + " kWh";
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
            return "Temperatura: " + d.temperature + " ºC";
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

        var locale = Empowering.LOCALES[attrs.locale || 'ca_ES'];

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
    var mobileMaxWidth= 1000; //Define this to whatever size you want, original: var mobileMaxWidth=560;
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