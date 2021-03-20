import "intersection-observer";
import scrollama from "scrollama";
import {json} from 'd3-fetch';
import * as d3 from "d3";
import {keys} from 'd3-collection';
import "d3-time-format";
import './main.css';

//Line chart animation
json('./data/petitions.json').then((data, error) => {
  if (error){
      return console.warn(error)
  }
  else{
    LineChart(data)}})

//Function to create the Line Chart
function LineChart(data){
  //Variables
  var margin = {top: 40, right: -10, bottom:5, left: 130},
  width = 630 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

  //Transform year to date format
  var parseTime = d3.timeParse("%Y")
  data.forEach(function (d) {
    d.year = parseTime(d.year);});

  var commas = d3.format(",");
    
  //Pallete for lines, depending of each case status
  var color = d3.scaleOrdinal()
  .range(["#000000","green", "#DD98D6", "red", "#08B2B2"])
  data.forEach(function (d) {
    color.domain(keys(d).filter(function(key) {return key !== "year"}))});
    
  //Function to create a new dataset with key/values
  var case_s = color.domain().map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {year: d.year, petitions: d[id], id: id};})};});
    
  //x, y Axis Scale. X is based on a ScaleTime (Years) and Y is based on the Total Petitions
  const y = d3.scaleLinear().range([height - margin.bottom, margin.top]).domain([0,120000]);
  var xExtent = d3.extent(data, d => d.year);
  const x = d3.scaleTime().range([margin.left, width - margin.right]).domain(xExtent);

  //Define the SVG alocation and size
  var svg = d3.select("#figure0").append("svg")
  .attr("width", 800)
  .attr("height", 500)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  //x, y Axis alocating in the svg figure
  var xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat((d3.timeFormat("%Y"))))

  var yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))
  .call(g => g.select(".domain"))
  .call(g => g.select(".tick:last-of-type text").clone())

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  
  //New div to allocate the tooltip
  var div = d3.select("#figure0").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
    
  //Create and add the line to the svg, call the transition functions
  svg.selectAll(".line")
  .data(case_s)
  .enter()
  .append("path")
    .attr("fill", "none")
    .attr("stroke", function(d){return color(d.id)})
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
      return d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.petitions); })
        (d.values)
    }).call(transition)

  //Add points to the line, and assign the appropiate transition and tooltip
  var points = svg.selectAll("dot")
  .data(case_s)
  .enter().append("g")
  .selectAll("cicle")
  .data(d => d.values)
  .enter()
  .append('circle')

  //Transition points
  points
  .attr("r", 5)
  .attr("cx", d => x(d.year))
  .attr("cy", d => y(d.petitions))
  .transition()
  .duration(15000)
  .attr("fill", function(d){return color(d.id)})
  .attr("fill-opacity", 1)

  //tooltip
  points.on("mouseover", function(event,d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(function (){if(d.id == "Total Petitions")
    {return d.id + " in US: "+ commas(d.petitions)}
    {return d.id + " petitions: "+ commas(d.petitions)}})
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY) + "px")})
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);});

  //Label Text for X axis
  svg.append("text")
  .attr("class", 'axis_a')
  .attr("x", width-200)             
  .attr("y", 430)
  .attr("text-anchor", "middle")  
  .text("Year");

  //Label for Y axis
  svg.append("text")
  .attr("class", 'axis_a')
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(90)")
  .attr('x', 180)
  .attr("y", -60)
  .text("Number of Petitions");
  
  //Label for Title
  svg.append("text")
  .attr("x", 210)             
  .attr("y", -10)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .attr("font-weight", 550)
  .text("Total PERM petitions evolution by year and status");

  //Label for Sub-Title
  svg.append("text")
  .attr("x", 210)             
  .attr("y", 10)
  .attr("text-anchor", "middle")
  .style("fill", "red")
  .style("font-size", "12px") 
  .attr("font-weight", 550)
  .text("Hover the points to get more details!");

  //Legends
  //Title of my Leyend
  svg.append("text")
  .attr("id", 'legend')
  .attr("x", -40)             
  .attr("y", 120)
  .attr("text-anchor", "middle")  
  .text("Case Status");

  //legend size and spacing
  var legendRectSize = 15;
  var legendSpacing = 7;
  var legend = svg.selectAll('.legend') //the legend and placement
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'circle-legend')
      .attr('transform', function (d, i) {
          var height = legendRectSize + legendSpacing;
          var offset = height * color.domain().length / 2;
          var horz = -4 * legendRectSize - 13;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

  //Legend lines
  legend.append("rect")
  .attr("width", 10).attr("height", 0.8)
  .style('fill', color)
  .style('stroke', color)
  .attr('x', -10)
  .attr('y', 195)
  
  //Legend text
  legend.append('text')
  .attr('x', 10)
  .attr('y', 200)
  .text(function (d) {
      return d;
  });

  //Functions to call the transition on the lines
  function transition(path) {
    path.transition()
        .duration(10000)
        .attrTween("stroke-dasharray", Dash)
        .on("end", () => { d3.select(this).call(transition); });
  }
  function Dash() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
  }
}
//----------------------------------------END OF LINE CHART-----------------------------------------//
//This part of the code is just for the portion of the zoom circle packing chart!
//I use as a base the code on Source 7(See below)
//I changed on demand many attributes of the graph
json('./data/dictiona.json').then((data, error) => {
  if (error){
      return console.warn(error)
  }
  else{

  //Define the basics before start
  var height = 15000
  var width = 16000
  var pack = data => d3.pack()
    .size([width, height])
    .padding(20)
    (d3.hierarchy(data)
    .sum(d => d.total)) //Sum the petitions to get the parent node
  
  //Create a color Palette on demand
  var parents = ['US',"Total PERM petitions: 0.26M", "US Employment at 2019: 157.5M", "Africa", "Asia", "Europe", "Australia/Oceania", "North America", "South America"]
  var color = d3.scaleOrdinal().domain(parents)
  .range(['#FFFFFF',"#FFFFFF", "#FFFFFF", "rgb(53, 182, 53)", "rgb(0, 110, 255)", 'yellow','#50c9bc', 'red', 'pink']); 

  //Define the root of hierarchical info
  const root = pack(data);
    let focus = root;
    let view;

  //Create a svg and assign to the id division
  const svg = d3.select('#figure').append("svg")
      .style('width', 400)
      .style('height', 400)
      .attr("viewBox", `-${width /2} -${height /2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", '#FFFFFF')
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root))

  
  const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(0))
      .join("circle")
      .attr("class", function(d) {if (parents.includes(d.data.name)){return (d.data.name)}{return 'other'}})
        .style("stroke", function(d) {if (d.data.name == "US Employment at 2019: 157.5M"){return "#FFFFFF"}{return '#000000'}})
        .style("stroke-opacity", 0.7)
        .style("stroke-width", 40)
        .attr("fill", function(d){if (parents.includes(d.data.name)){return color(d.data.name)}{return '#FFF7EC'}})
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

  //Assign labels to each of the nodes, and specify the position of each of them  
  const label = svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants().filter(function (d){return d.data.total > 240}))
      .join("text")
      .attr('font-weight', function(d) {if ((d.data.name == "US Employment at 2019: 157.5M") ||
      (d.data.name == "Total PERM petitions: 0.26M"))
      {return 900}{return 600}})
      .style("font",function(d) {if ((d.data.name == "US Employment at 2019: 157.5M") ||
      (d.data.name == "Total PERM petitions: 0.26M"))
      {return "600px Comic Sans"}{return "450px Comic Sans"}})
      .attr('dx', function(d){if (d.data.name == "Africa")
      {return "-5.5em"}{if (d.data.name == "Australia/Oceania"){return "-5.7em"}
      {if (d.data.name == "North America"){return "4em"}
      {if (d.data.name == "Total PERM petitions: 0.26M"){return "6em"}{}}}}})
      .attr('dy', function(d){if (d.data.name == "Total PERM petitions: 0.26M")
        {return "-1.3em"}{if (d.data.name == "South America"){return "-3.5em"}
        {if(d.data.name == "Europe"){return "-5.5em"}
        {if(d.data.name == "Asia"){return "-11.8em"}
        {if(d.data.name == "North America"){return "5em"}
        {if(d.data.name == "US Employment at 2019: 157.5M"){return "-10em"}
        {if (d.data.name == "Total PERM petitions: 0.26M"){return "20em"}}}}}}}})
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

    zoomTo([root.x, root.y, root.r * 3]);

    //Create two functions to zoom the map based on 'click'
    function zoomTo(v) {

        const k = width / v[2];
        view = v;
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
      }
    
      function zoom(event, d) {
        const focus0 = focus;
        focus = d;
        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 950)
            .tween("zoom", d => {
              const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
              return t => zoomTo(i(t));
            });
    
        label
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
      return svg.node();
    }
})

//-----------------------------------END Circle Packing Code-----------------------------------------//
//This part of the code is just for the portion of the donut chat! I used as a base Source 1
//Then I personalize details on demand
json('./data/grouped2.json').then((data, error) => {
    if (error){
        return console.warn(error)
    }
    else{
      donut(data, "T2015");}})

function donut(data, col){
    //Define basic variables
    const width = 900;
    const height = 400;
    const radius = Math.min(width, height) /2.5;
    var donut_w = 85;

    //Get a number format
    var commas = d3.format(",");

    //Construct an svg
    var svg = d3.select('#donut_chart').append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform","translate(" + (width/2) +"," + (height/2)+ ")");
    
    var arc = d3.arc().innerRadius (radius - donut_w).outerRadius(radius);
    var cont = ['US',"PERM", "", "Africa", "Asia", "Europe", "Australia and Oceania", "North America", "South America"]
    var color = d3.scaleOrdinal().domain(cont)
    .range(['#FFFFFF',"#015e54", "#FFFFFF", "rgb(53, 182, 53)", "rgb(0, 110, 255)", 'yellow','#50c9bc', 'red', 'pink']); 

    //Create the pie chart
    var pie = d3.pie().value(function (d){
      return d[col];});
    
    //New div with tooltip class
    var div = d3.select("#donut_chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) {return color(d.data.complete_c);})
      .attr('transform', 'translate(0, 0)')
      .on('mouseover', function (event, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85');
        div.transition()
            .duration(50)
            .style("opacity", 1);
        div.html("Total Petitions on " + i.data.complete_c+ ": "+commas(i['data'][col]))
            .style("left", (event.pageX )+"px")
            .style("top", (event.pageY) + "px");
          })
      .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        div.transition()
            .duration('50')
            .style("opacity", 0);
          });

      //Legend
      var continents = ['Europe', 'Asia', "South America", "North America", "Australia and Oceania", "Africa"]

      //Circles on the legend
      svg.selectAll("mydots")
      .data(continents)
      .enter()
      .append("circle")
      .attr("cx", -400)
      .attr("cy", function(d,i){ return -70 + i*30})
      .attr("r", 12)
      .style("fill", function(d){ return color(d)})

      //Title for Legend
      var size=25;
      svg.append('text')
      .attr("x", -405)
      .attr("y", -100).text('Region')
      .style("font-size", "15px")
      .attr("font-weight", 850).attr('text-decoration', 'underline')

      //Labels for each circle
      svg.selectAll("labels")
      .data(continents)
      .enter()
      .append("text")
      .attr("x", -360)
      .attr("y", function(d,i){ return  -80+ i*(size+5) + size/2})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("text", "middle")
      .style("font-size", "12px")
      .style("alignment-baseline", "middle")

    //Label for Title
      svg.append("text")
      .attr("x", -100)             
      .attr("y", -180)
      .attr("text-anchor", "middle")  
      .style("font-size", "20px") 
      .attr("font-weight", 550)
      .text("Approved of PERM petitions evolution by year and continent");

    //Label for Sub-Title
    svg.append("text")
    .attr("x", -300)             
    .attr("y", -160)
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("fill", "red")
    .attr("font-weight", 550)
    .text("Hover the arcs to get more details!");
      
  //Function to change the years
  function new_year(data, col) {
    var pie = d3.pie()
        .value(function (d) {
            return d[col];
        }).sort(null);

    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2.5;
    var donutWidth = 85;

    var commas = d3.format(",");

    var path = d3.select("#donut_chart")
        .selectAll("path")
        .data(pie(data))
        .on('mouseover', function (event, i) {
          d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.85');
          div.transition()
              .duration(50)
              .style("opacity", 1);
        div.html("Total Petitions on " + i.data.complete_c+ ": "+commas(i['data'][col]))
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px");
            })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
              .duration('50')
              .attr('opacity', '1');
          div.transition()
              .duration('50')
              .style("opacity", 0);
            });
            
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    
    path.transition().duration(700).attr("d", arc); 
      
      }
      //Call the new year based on the selected option
      d3.select('#select')
      .on('change', function() {
      var result = d3.select(this).property('value');
      new_year(data,result);
      })
    }
///---------------------------------------END OF DONUT FUNCTION-----------------------------------//
//Function that simulates a click on a specific class of the document - Source 11
function click(name){
  var type = document.createEvent("MouseEvent");
  var click_class = document.getElementsByClassName(name)[0];
  type.initMouseEvent(
      "click",
      true /* bubble */, true /* cancelable */,
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
  );
  click_class.dispatchEvent(type);
}

//Scroll on the web I used the code on Scrollama(Source 9), and then I personalize to set the details on demand

      var scrolly = d3.select("#scrolly");
      var figure = scrolly.select("figure");
      var article = scrolly.select("article");
      var step = article.selectAll(".step");

      // initialize the scrollama
      var scroller = scrollama();

      // generic window resize listener event
      function handleResize() {
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.65);
        step.style("height", stepH + "px");

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 8;

        figure
          .style("height", figureHeight + "px")
          .style("top", figureMarginTop + "px");

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
      }

      // scrollama event handlers
      function handleStepEnter(response) {

        // add color to current step only
        step.classed("is-active", function(d, i) {
          return i === response.index;
        });

        // update graphic based on step
        if((response.index+1 == 1)){
          click('US');
        }
        else if(response.index+1 == 2){
          click('Total PERM petitions: 0.26M')
        }
        else if(response.index+1 == 3){
          click('Asia')
        }
        else if(response.index + 1 == 4){
          click('Europe')
        }
        else if(response.index+1 == 5){
          click('North America');
        }
        else if(response.index+1 == 6){
          click('South America');
        }
        else if(response.index+1 == 7){
          click('Africa');
        }
        else if((response.index+1 == 8)){
          click('Australia/Oceania');
        }
      }

      function setupStickyfill() {
        d3.selectAll(".sticky").each(function() {
          Stickyfill.add(this);
        });
      }

      function init() {
        setupStickyfill();

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
          .setup({
            step: "#scrolly article .step",
            offset: 0.5,
            debug: false
          })
          .onStepEnter(handleStepEnter);

        // setup resize event
        window.addEventListener("resize", handleResize);
      }

      // kick things off
      init();

//Source1: https://medium.com/@kj_schmidt/making-an-animated-donut-chart-with-d3-js-17751fde4679 - Donut Chart Creation
//Source 2: https://www.w3schools.com/css/default.asp - CSS Tutorial
//Source 3: https://www.d3-graph-gallery.com/graph/custom_color.html - Color Pallete
//Source 4: https://stackoverflow.com/questions/24193593/d3-how-to-change-dataset-based-on-drop-down-box-selection - drop down
//Source 5: https://www.w3schools.com/howto/howto_css_three_columns.asp - Div sections
//Source 6: https://www.d3-graph-gallery.com/graph/custom_legend.html - Legends
//Source 7: https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb - Circle Packing
//source 8: https://www.d3-graph-gallery.com/circularpacking.html - Circle Pack
//source 9: https://github.com/russellgoldenberg/scrollama - Instructions for Scrollama
//Source 10: https://www.npmjs.com/package/scrollama - npm scrollama
//Source 11: http://jsfiddle.net/ur5rx/1/ - Simulation
//Source 12: https://observablehq.com/@d3/d3-hierarchy - Understand Hierarchical elements
//source 13: https://bl.ocks.org/LemoNode/a9dc1a454fdc80ff2a738a9990935e9d - Multichart

