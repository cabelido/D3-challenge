// @TODO: YOUR CODE HERE!
// Set the dimensions of the SVG.
var svgWidth = 1000
var svgHeight = 650

var margin = {
    top:20,
    right:40,
    bottom:80,
    left:100
}

var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// Create an SVG wrapper, append an SVG Group that will hold our chart, and shift the latter by left 
// and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// Import data and create function to handle errors.
d3.csv("assets/data/data.csv").then(success, error);

function error(error) {
    throw error;
}
// Cast pertinent data as numbers.
function success(statData) {
    statData.map(function (data) {
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
        data.age = +data.age
    });    
    
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
       .domain([8, 24])
       .range([0, width])

    var yLinearScale = d3.scaleLinear()
       .domain([3,26])
       .range([height, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
        

    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(statData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r","13")
        .attr("fill","green")
        .attr("opacity",".5")
        
    
    // Append text to circles 

    var circlesGroup = chartGroup.selectAll()
        .data(statData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr))
        .style("font-weight","bold")
        .style("alignment-baseline","central")

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`Poverty: ${d.poverty}<br>Healthcare:${d.healthcare}`);
    });

    // Creat tool tip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data){
    toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data){
        toolTip.hide(data);
        });

    // Create axes labels

    chartGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0-margin.left+40)
        .attr("x",0-(height/2))
        .attr("dy", "1em")
        .attr("class","axisText")
        .text("Healthcare (%)")
        .style("font-weight","bold")
        .style("font-size","20px")

    chartGroup.append("text")
        .attr("transform", `translate(${width/2},${height+margin.top + 30})`)
        .attr("class","axisText")
        .text(" In Poverty (%)")
        .style("font-weight","bold")
        .style("font-size","20px")
}
