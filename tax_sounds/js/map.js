
// add elements in which to place the chart
function Map(){
  var width =960
    , height = 600
    , id = "us-map"
    , circle_radius = 4
    , circle_radius_max = 15;

  // set projection
  var projection = d3.geoAlbersUsa()
      .scale(200)
      //.translate([465,120]);
  // create function for path
  var geoPath = d3.geoPath()
      .projection(projection)

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){

      var container = selection.append("g")
          .attr("id","map-details-container")
          .attr("transform","translate(-150,-160)");

      var regions = data.regions
        , districts = data.districts
        , state_array = data.state_array
        , state_lookup = data.state_lookup
        , us = data.us;

      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(districts);

      var states = topojson.feature(us,us.objects.states).features;

      console.log(states)

      states.map( d => d.properties["centroid"] = geoPath.centroid(d))

      var regionalMap = container.append("g")
          .attr("id","map-container")
          .selectAll(".state")
          .data(states)
         .enter().append("path")
          .attr("id",d => "states-state"+d.id)
          //.attr("centroid",d => geoPath.centroid(d))
          .attr("class",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              return "region-"+state_lookup["state"+d.id].region_name
            } })
          .classed("state",true)
          .attr("d",geoPath)
          .style("fill",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return "none";
            }else{
              var color = district_color( state_lookup["state"+d.id].district_name );
              return district_color( state_lookup["state"+d.id].district_name )
            }
          })

      var regionShift = {
        "Northeast":[7,0]
        ,"Midwest":[0,0]
        ,"South":[0,7]
        ,"West":[-7,0]
        }
      // move region-West
      d3.selectAll(".state")
        .attr("transform",function(d){
          if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              var state = "state"+d.properties.STATEFP;
              var region = state_lookup[state].region_name;
              return "translate("+regionShift[region][0]+","+regionShift[region][1]+")"
            }
        });

      var centroidStarBackground = container.append("g")
          .classed("bstars-container",true)
          .selectAll(".stars-background")
          .data(states)
         .enter().append("path")
          .attr("class",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              return "region-"+state_lookup["state"+d.id].region_name
            } })
          .classed("stars-background",true)
          .attr("id",d=>"bstar-state"+d.id)
          .attr("d", d3.symbol().size([5]).type(d3.symbolStar))
          .attr("transform",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              var state = "state"+d.properties.STATEFP;
              var region = state_lookup[state].region_name;
              var x_shift = regionShift[region][0]
                , y_shift = regionShift[region][1]
              return "translate("+(d.properties.centroid[0]+x_shift)+","+(d.properties.centroid[1]+y_shift)+")";
            }});

      var centroidStars = container.append("g")
          .classed("stars-container",true)
          .selectAll(".stars")
          .data(states)
         .enter().append("path")
          .attr("class",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              return "region-"+state_lookup["state"+d.id].region_name
            } })
          .classed("stars",true)
          .attr("id",d=>"star-state"+d.id)
          .attr("d", d3.symbol().size([1]).type(d3.symbolStar))
          .attr("transform",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              var state = "state"+d.properties.STATEFP;
              var region = state_lookup[state].region_name;
              var x_shift = regionShift[region][0]
                , y_shift = regionShift[region][1]
              return "translate("+(d.properties.centroid[0]+x_shift)+","+(d.properties.centroid[1]+y_shift)+")";
            }});

      regionalMap.on("mouseover", function(d) {
        // select state map
        d3.select("#states-state"+d.id)
          .raise()
          .transition()
          .duration(200)
          .style("stroke-width","2px")
          .style("opacity",1.0);
        // increase note radious
        d3.select("#note-state" + d.id)
          .raise()
          .transition()
          .duration(200)
          .attr("r",circle_radius_max)
          .style("stroke-width","2px")
          .style("opacity",1);
        // move and fill stem
        d3.select("#stem-state"+ d.id)
          .raise()
          .transition()
          .duration(200)
          .style("opacity",1)
          .style("stroke-width","2px")
          .attr("transform","translate("+((circle_radius_max-circle_radius)+1)+",0)");
        // move flag
        d3.select("#flags-state"+ d.id)
          .raise()
          .transition()
          .duration(200)
          .style("stroke-width","2px")
          .attr("transform","translate("+((circle_radius_max-circle_radius)+1)+",0)");
        // only change opacity for selected notes
        if (d3.select("#note-state"+d.id).attr("selected")==true){
          d3.select("#flags-state" + d.id)
          .style("opacity",1)
        }
        d3.select("#stateText-state"+ d.id)
          .raise()
          .transition()
          .duration(200)
          .style("opacity", 1)
          .attr("transform","translate("+0+","+3.5+")");
        d3.select(".arc").raise()
      })

      regionalMap.on("mouseout", function(d) {
        // decrease note radius
        d3.select("#note-state" + d.id)
          .transition()
          .duration(0)
          .attr("r",circle_radius)
          .style("stroke-width","0.50px");
        // move stem
        d3.select("#stem-state" + d.id)
          .transition()
          .duration(0)
          .style("opacity",0.50)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        // move flag
        d3.select("#flags-state" + d.id)
          .transition()
          .duration(0)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        if (d3.select("#note-state"+d.id).attr("selected")==true){
          d3.select("#flags-state" + d.id)
          .style("opacity",1)
        }
        d3.select("#stateText-state" + d.id)
          .transition()
          .duration(0)
          .style("opacity", 0)
        // select map
        d3.select("#states-state"+d.id)
          .transition()
          .duration(0)
          .style("stroke-width","0.5px")
          .style("opacity",0.7)
        // raise arc to always be on top
        d3.select(".arc").raise()
      })



/*
      // define staves (regions) spacing
      var stave_spacing = 40
        , stave_xstart = 20
        , stave_ystart = 100
        , stave_length = 500;

      // create color scale by district
      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(regions);

      // get extent for stems
      var energyCreditsPerReturnsExtent = d3.extent(state_array,d => (d.nEnergyCredits/d.returns));
      var energyCredits_yScale = d3.scaleLinear()
        .domain(energyCreditsPerReturnsExtent)
        .range([0,stave_spacing * stem_scale_factor])

      // get extent for notes across x-axis
      //var taxLiabilityPerLiableExtent = d3.extent(state_array,d => (d.aTaxLiability/d.aTotalIncome));
      var taxLiabilityPerIncomeExtent = d3.extent(state_array,d => (d.aTaxLiability/d.aTotalIncome));
      // define xScale for notes
      var notes_xScale = d3.scaleLog()
        .domain(taxLiabilityPerIncomeExtent)
        .range([circle_radius,stave_length-circle_radius])
*/
      function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
        {
          var results = "";

          var angle = Math.PI / arms;

          for (var i = 0; i < 2 * arms; i++)
          {
            // Use outer or inner radius depending on what iteration we are in.
            var r = (i & 1) == 0 ? outerRadius : innerRadius;

            var currX = centerX + Math.cos(i * angle) * r;
            var currY = centerY + Math.sin(i * angle) * r;

            // Our first time we simply append the coordinates, subsequet times
            // we append a ", " to distinguish each coordinate pair.
            if (i == 0)
            {
               results = currX + "," + currY;
            }
            else
            {
               results += ", " + currX + "," + currY;
            }
          }
          return results;
        }

    })
  }

  chart.width = function(w) {
    if (!arguments.length) { return width; }
    width = w;
    return chart;
  };

  chart.height = function(h) {
    if (!arguments.length) { return height; }
    height = h;
    return chart;
  };

  chart.id = function(i) {
    if (!arguments.length) { return id; }
    id = i;
    return chart;
  };
  return chart
}
