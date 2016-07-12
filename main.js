var margin = {top: 70, right: 20, bottom: 30, left: 50},
w = 400 - margin.left - margin.right,
h = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%y").parse;

var x = d3.time.scale().range([0, w]);
var y = d3.scale.linear().range([h, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var xGrid = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5)
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

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + h + ")")
    .call(xGrid);

  svg.append("g")
    .attr("class", "grid")
    .call(yGrid);

d3.csv("GENDER_EMP_11072016050959084.csv", function (error, data) {
  // debugger
  data.forEach(function (data) {
    // debugger
    data.time = parseDate(data.TIME);
    data.value = +data.Value;
  });
  // debugger;
  x.domain(d3.extent(data, function (data) {
    return data.TIME;
  }));
  y.domain(d3.extent(data, function (data) {
    return data.Value;
  }));

  var line = d3.svg.line()
    .x(function (data) { return x(data.TIME); })
    .y(function (data) { return y(data.Value); });


  var labels = svg.append("g")
    .attr("class", "labels")

  labels.append("text")
    .attr("transform", "translate(0," + h + ")")
    .attr("x", (w-margin.right))
    .attr("dx", "-1.0em")
    .attr("dy", "2.0em")
    .text("[Years]");

  labels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Percentage");

  var title = svg.append("g")
    .attr("class", "title");

  title.append("text")
    .attr("x", (w / 2))
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .text("A D3 line chart from CSV file");

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("data", line);

});
