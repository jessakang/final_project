var countryArray = [];

// storing the entire d3 chart formation in a function to render onto the page

var showCountryData = function(country, countryNumber) {
    // debugger;

    // Appending the function to the popup div which then gets appended to the body
    var popup = $("<div id='popup'><span id='close'>x</span></div>");
    if ($("#popup").length === 0) {
        $('body').append(popup);
    }
    var margin = {
            top: 70,
            right: 20,
            bottom: 30,
            left: 50
        },
        w = 1000 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%y").parse;

    // Setting up domains on the x and y axis. Linear because we are dealing with numbers only.
    var x = d3.scale.linear()
        .domain([2000, 2014])
        .range([0, w]);

    var y = d3.scale.linear()
        .domain([0, 50])
        .range([h, 0]);

    // Setting up the orientation of the x and y axis.

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

    // Using the library d3-tip to add tooltips to the d3 line graph. This is where I will be displaying the y-values for each plot point.

    var tip = d3.tip()
        .attr("class", "country" + countryNumber)
        .offset([-10, 0])
        .html(function(data) {
            return "<span style='color:red'>" + data.Value + "%" + "</span>";
        })

    // Creating a grid system that will distribute plot points evenly on the chart.

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

    // Appending the svg elements to the popup div, which will display the line chart in it.

    var svg = d3.select("#popup").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 458)
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

    // We are collecting data from a CSV file.

    d3.csv("GENDER_EMP_11072016050959084.csv", function(error, data) {
        // debugger;
        data = _.groupBy(data, "Country");
        // Collecting the data by Country name.
        console.log(country);
        data = data[country];
        // debugger
        data.forEach(function(data) {
            // For each country, we will need to grab the years as well as the values (percentages) for corresponding years.
            // debugger
            data.time = parseDate(data.TIME);
            data.value = +data.Value;
        });

        // debugger;

        // Appending the years along the x axis
        x.domain(d3.extent(data, function(data) {
            return data.TIME;
        }));

        // Creating the line
        var line = d3.svg.line()
            .x(function(data) {
                return x(data.TIME);
            })
            .y(function(data) {
                return y(data.Value);
            });
        // Adding a title to the line chart
        var title = svg.append("g")
            .attr("class", "title");

        title.append("text")
            .attr("x", (w / 2))
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "35px")
            .text( country );

        // Appending a line path joining all points on the line
        svg.append("path")
            .datum(data)
            .attr("class", "line countryLine" + countryNumber)
            .attr("d", line);

        // Append country's name to the line path
        // svg.append("text")
        //     .attr("transform", "translate(" + (w+3) + "," + y(data[0].Country) + ")")
        //     .attr("dy", ".35em")
        //     .attr("text-anchor", "start")
        //     .style("fill", "green")
        //     .text("Canada");

        // Selecting all circle points and displaying their y values using mouseover
        var plotpoints = svg.selectAll("circle.country" + countryNumber)
            .data(data)
            .enter()
            .append("svg:circle")
            .attr("class", "country" + countryNumber)
            .attr("cx", function(data) {
                return x(data.TIME);
            })
            .attr("cy", function(data) {
                return y(data.Value);
            })
            .attr("r", 5)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        // console.log( test.length );

        plotpoints.call(tip)
    });
};
// When a country is clicked on the map, take the title of that country and return it to the showCountryData function

map.addListener("clickMapObject", function(event) {
    event.event.stopPropagation();
    event.event.stopImmediatePropagation();
    country = event.mapObject.title

    // When the toggle button is switched (true), each country clicked gets pushed into the countryArray
    if (multipick) {
        // console.log("multipick ran")

        // add another if statement to make sure the country you are pushing is unique. if indexOf ...
        // var unique = [];
        //   $.each(country, function(i, el){
        //     if($.inArray(el, unique) === -1) unique.push(el);
        //     });

        var arrayLength = countryArray.length;
        countryArray.push(country);

        if (countryArray.length < 2) {
            return false;
        } else {
            // console.log(countryArray);
            showCountryData(countryArray[0], 0);
            // window.setTimeout(function () {
            showCountryData(countryArray[1], 1);
            // }, 1000);
            return true;
        }
        // debugger
    }
    showCountryData(country, 0);

});
$('body').on("click", "#close", function() {
    // if the array is equal or greater to two, clear the array. Refresh!
    if (countryArray.length >= 2) {
        countryArray = [];
    }
    $("#popup").remove();
});
// By default, the multipick is false until it is clicked

var multipick = false;

$(document).ready(function() {
    // Switch click handler

    var clickedButton = _.debounce(function() {
        if (multipick) {
            multipick = false;
            // console.log("Tell me lies, tell me sweet little lies...");
        } else {
            multipick = true;
            // console.log("True that... DOUBLE TRUE.");
        }
    }, 300)

    // listener
    $(".switch").on("click", clickedButton)

})
