function getCount(inputArray) {
    var counts = {};
    outputArray = [];
    c = 0;
    for (var i = 0; i < inputArray.length; i++) {
        c = inputArray[i].mutation;
        count = counts[c]
        counts[c] = count ? count + 1 : 1;
    }
    for (i in counts) {
        outputArray.push(counts[i]);
    }
    return outputArray;
}

function mutation(dataArray) {
    var margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 40
        },
        width = 960,
        height = 500;


    var x = d3.scale.ordinal().rangeRoundBands([0, width / 1.5], .1);
    var y = d3.scale.linear().range([height, 0]);
    var chart = d3.select("#mutations-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    d3.json("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc", function(error, data) {
        x.domain(data.hits.map(function(d) {

            return d.mutation
        }));
        y.domain([0, 100]);

        var barWidth = width / 30;

        var bar = chart.selectAll("g")
            .data(data.hits)
            .enter()
            .append("g")

            .attr("transform", function(d, i) {

                return "translate(" + (40 + i * barWidth) + ", 0)";

            });
        var countsArray = [];
        if (dataArray == undefined || dataArray.length == 0) {
            countsArray = getCount(data.hits);
        } else {
            countsArray = dataArray;
        }

        bar.append("rect")
            .attr("y", function(d, i) {
                return y(countsArray[i]);
            })
            .attr("height", function(d, i) {
                return height - y(countsArray[i]);
            })
            .attr("width", barWidth - 1);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("");
    });

}

mutation()

function chromo() {
    var margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        width = 500 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom,
        radius = width / 2;

    var color = d3.scale.ordinal()
        .range(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);

   
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var svg = d3.select("#chromosomes-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.json("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc", function(error, data) {
        if (error) throw error;

        data.hits.map(function(d) {
            d.chromosome = d.chromosome;

        })

        var counts = {};
        var countsArray = [];
        var countsArray2 = [];
        c = 0;
        for (var i = 0; i < data.hits.length; i++) {
            c = data.hits[i].chromosome;
            count = counts[c]
            counts[c] = count ? count + 1 : 1;
        }

        for (i in counts) {
            countsArray.push(counts[i]);
            countsArray2.push(i);
        }


        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d, i) {
                return countsArray[i];
            });

        var g = svg.selectAll(".arc")
            .data(pie(data.hits))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) {
                return color(i);
            })
            .on("click", function(d, i) {
                newData = [];


                for (var x = 0; x < data.hits.length; x++) {
                    newData.push(data.hits[x].mutation)
                }

                newData = newData.filter(function(item, i, newData) {
                    return newData.indexOf(item) == i;
                });

                for (var j = 0; j < data.hits.length; j++) {
                    if (countsArray2[i] == data.hits[j].chromosome) {
                        newData.push(data.hits[j].mutation);
                    }
                }
                newDataCount = {}
                for (var i = 0; i < newData.length; i++) {
                    c = newData[i];
                    count = newDataCount[c]
                    newDataCount[c] = count ? count + 1 : 1;
                }
                newDataBar = [];

                for (a in newDataCount) {
                    newDataBar.push(newDataCount[a]);
                }
                newDataBar2 = [];
                for (b in newDataBar) {
                    newDataBar2.push(newDataBar[b] - 1)
                }
                console.log(newDataBar2)
                mutationFilter(newDataBar2, "#mutations-chart", "rect")
                d3.event.stopPropagation();
            })




        g.append("text")
            .attr("transform", function(d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function(d, i) {
                return countsArray2[i];
            });
    });

}
chromo()


function mutationFilter(d, chartid, element) {

    var specificRect = d3.select(chartid)
        .selectAll("rect").data(d)
        .filter(function(d) {
            return d
        })

    specificRect
        .style('fill', '#ff0000')
}
