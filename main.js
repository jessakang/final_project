var margin = {
        top: 70,
        right: 20,
        bottom: 30,
        left: 50
    },
    w = 1000 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%y").parse;

var x = d3.scale.linear()
    .domain([2000, 2014])
    .range([0, w]);

var y = d3.scale.linear()
    .domain([0, 50])
    .range([h, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("data"))
    .ticks(15);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d) {
        return d + "%";
    })
    .ticks(5);

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(data) {
        return "<span style='color:red'>" + data.Value + "</span>" + "%";
    })

var xGrid = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(15)
    .tickSize(-h, 0, 0)
    .tickFormat("");

var yGrid = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-w, 0, 0)
    .tickFormat("");

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append("text")
    .attr("x", 490)
    .attr("y", 30)
    .attr("dx", ".71em")
    .style("text-anchor", "middle")
    .text("Year");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (h / 2))
    .attr("y", 0 - margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Percentage");

svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + h + ")")
    .call(xGrid);

svg.append("g")
    .attr("class", "grid")
    .call(yGrid);

d3.csv("GENDER_EMP_11072016050959084.csv", function(error, data) {
    // debugger;
    data = _.groupBy(data, "Country");
    data = data["Australia"];
    // debugger
    data.forEach(function(data) {
        // debugger
        data.time = parseDate(data.TIME);
        data.value = +data.Value;
    });

    data.sort(function(a, b) {
        return a.TIME - b.TIME;
    });

    // debugger;
    x.domain(d3.extent(data, function(data) {
        return data.TIME;
    }));

    var line = d3.svg.line()
        .x(function(data) {
            return x(data.TIME);
        })
        .y(function(data) {
            return y(data.Value);
        });

    var title = svg.append("g")
        .attr("class", "title");

    title.append("text")
        .attr("x", (w / 2))
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("Gender Pay Gap");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.selectAll(".circle")
        .data(data)
        .enter()
        .append("svg:circle")
        .attr("class", "circle")
        .attr("cx", function(data) {
            return x(data.TIME);
        })
        .attr("cy", function(data) {
            return y(data.Value);
        })
        .attr("r", 5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .call(tip)
});
