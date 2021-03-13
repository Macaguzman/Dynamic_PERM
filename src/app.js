// if the data you are going to import is small, then you can import it using es6 import
// (I like to use use screaming snake case for imported json)
// import MY_DATA from './app/data/example.json'

import "intersection-observer";
import scrollama from "scrollama";
import { json } from 'd3-fetch';
import * as d3 from "d3";
import './main.css';

// this command imports the css file, if you remove it your css wont be applied!
// this is just one example of how to import data. there are lots of ways to do it!
//This part of the code is just for the portion of the zoom circle packing chat!
//function to create the Circle Packing Graph, I use as a base the code on Source 7(See below)
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
    .padding(8)
    (d3.hierarchy(data)
    .sum(d => d.total)) //Sum the petitions to get the parent node
  
  //Create a color Palette on demand
  var parents = ['US',"Total PERM petitions: 263,746", "", "Africa", "Asia", "Europe", "Australia/Oceania", "North America", "South America"]
  var color = d3.scaleOrdinal().domain(parents)
  .range(['#FFFFFF',"#FFFFFF", "#FFFFFF", "green", "blue", 'yellow','#50c9bc', 'red', 'pink']); 

  //Define the root of hierarchical info
  const root = pack(data);
    let focus = root;
    let view;

  const svg = d3.select('#figure').append("svg")
      .style('width', 400)
      .style('height', 400)
      .attr("viewBox", `-${width /2} -${height /2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", '#faf9e0')
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root))

  
  const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(0))
      .join("circle")
      .attr("class", function(d) {if (parents.includes(d.data.name)){return (d.data.name)}{return 'other'}})
        .style("stroke", d => !d.data.name ? "" : "#02021b")
        .style("stroke-opacity", 0.7)
        .style("stroke-width", 40)
        .attr("fill", function(d){if (parents.includes(d.data.name)){return color(d.data.name)}{return '#FFF7EC'}})
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));


  const label = svg.append("g")
      .style("font", "400px Comic Sans")
      .attr("text-anchor", "middle")
      .attr('font-weight', 900)
      .selectAll("text")
      .data(root.descendants().filter(function (d){return d.data.total > 100}))
      .join("text")
      .attr('dx', function(d){if (d.data.name == "Africa")
      {return "-4.5em"}{if (d.data.name == "Australia/Oceania"){return "-5.2em"}
      {if (d.data.name == "North America"){return "4em"}
      {if (d.data.name == "Total PERM petitions: 263,746"){return "7em"}{}}}}})
      .attr('dy', function(d){if (d.data.name == "Total PERM petitions: 263,746")
        {return "-1.3em"}{if (d.data.name == "South America"){return "-4em"}
        {if(d.data.name == "Europe"){return "-6em"}
        {if(d.data.name == "Asia"){return "-15em"}
        {if(d.data.name == "North America"){return "5em"}{return "0.3em"}}}}}})
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

//This part of the code is just for the portion of the donut chat! I used as a base Source 1
//Then I personalize details on demand
json('./data/grouped2.json').then((data, error) => {
    if (error){
        return console.warn(error)
    }
    else{

    const width = 900;
    const height = 400;
    const margin = {left:20, top:100, bottom:100, right:100};
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;
    var donut_w = 65;


    var svg = d3.select('#donut_chart').append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform","translate(" + (width/2) +"," + (height/2)+ ")");
    
    var arc = d3.arc().innerRadius (radius - donut_w).outerRadius(radius);
    var cont = ['US',"PERM", "", "Africa", "Asia", "Europe", "Australia and Oceania", "North America", "South America"]
    var color = d3.scaleOrdinal().domain(cont)
    .range(['#FFFFFF',"#015e54", "#FFFFFF", "green", "blue", 'yellow','#50c9bc', 'red', 'pink']); 

    var pie = d3.pie().value(function (d){
      return d['2015'];});
    
    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) {
            return color(d.data.complete_c);
      })
      .attr('transform', 'translate(0, 0)')

      //Legend
      var continents = ['Europe', 'Asia', "South America", "North America", "Australia and Oceania", "Africa"]

      //Circles on the legend
      svg.selectAll("mydots")
      .data(continents)
      .enter()
      .append("circle")
      .attr("cx", -400)
      .attr("cy", function(d,i){ return -120 + i*30}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 12)
      .style("fill", function(d){ return color(d)})

      //Labels for each circle
      var size=25;
      svg.append('text')
      .attr("x", -405)
      .attr("y", -150).text('Region')
      .style("font-size", "12px")
      .attr("font-weight", 850).attr('text-decoration', 'underline')

      //Labels for each circle
      svg.selectAll("labels")
      .data(continents)
      .enter()
      .append("text")
      .attr("x", -360)
      .attr("y", function(d,i){ return  -135+ i*(size+5) + size/2})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("text", "middle")
      .style("font-size", "12px")
      .style("alignment-baseline", "middle")
    
    //Function to change the years
    function new_year(data, col) {
      var pie = d3.pie()
          .value(function (d) {
              return d[col];
          }).sort(null);

      var width = 400;
      var height = 400;
      var radius = Math.min(width, height) / 2;
      var donutWidth = 85;

      var path = d3.select("#donut_chart")
          .selectAll("path")
          .data(pie(data))
            
      var arc = d3.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);
      
      path.transition().duration(500).attr("d", arc); 
      
      }
      //Call the new year based on the selected option
      d3.select('#select')
      .on('change', function() {
      var result = eval(d3.select(this).property('value'));
      new_year(data, result);
      })
    }
})

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



//Scroll on the web I used the code on Scrollama(Source 9), and then I personalize to set the details on demant
      var main = d3.select("main");
      var scrolly = d3.select("#scrolly");
      var figure = scrolly.select("figure");
      var article = scrolly.select("article");
      var step = article.selectAll(".step");

      // initialize the scrollama
      var scroller = scrollama();

      // generic window resize listener event
      function handleResize() {
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
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
          console.log(response.index+1);
          console.log(response.direction);
          click('US');
        }
        else if(response.index+1 == 2){
          console.log(response.index+1);
          click('PERM')
        }
        else if(response.index+1 == 3){
          console.log(response.index+1);
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
            debug: true
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
