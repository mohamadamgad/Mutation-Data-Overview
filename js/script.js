function mutation() {
    var margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 40
        },
        width = 960,
        height = 500;


    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);
    var chart = d3.select("#chart")
        .append("svg") //append svg element inside #chart
        .attr("width", width) //set width
        .attr("height", height + margin.top + margin.bottom); //set height
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom"); //orient bottom because x-axis will appear below the bars

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    d3.json("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc", function(error, data) {
        x.domain(data.hits.map(function(d) {

            return d.mutation
        }));
        y.domain([0, 100]);

        var barWidth = width / 20;

        var bar = chart.selectAll("g")
            .data(data.hits)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {

                return "translate(" + (40 + i * barWidth) + ", 0)";

            });
        var counts = {};
        var countsArray = [];
        c = 0;
        for (var i = 0; i < data.hits.length; i++) {
            c = data.hits[i].mutation;
            count = counts[c]
            counts[c] = count ? count + 1 : 1;
        }

        for (i in counts) {
            countsArray.push(counts[i]);
        }
        console.log(countsArray)

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
            .text("responses");
    });

    function type(d) {
        d.receive_date = +d.receive_date; // coerce to number
        return d;
    }

}

mutation()
