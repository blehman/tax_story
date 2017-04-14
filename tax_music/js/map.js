
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
      .translate([465,120]);
  // create function for path
  var geoPath = d3.geoPath()
      .projection(projection)

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
      var regions = data.regions
        , districts = data.districts
        , state_array = data.state_array
        , state_lookup = data.state_lookup
        , us = data.us;

      // grab svg

      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(districts);

      var regionalMap = selection.append("g")
          .attr("id","map")
          .selectAll(".state")
          .data(topojson.feature(us,us.objects.states).features)
         .enter().append("path")
          .attr("id",d => "states-"+d.id)
          .attr("class",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return "none";
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

      regionalMap.on("mouseover", function(d) {
        // state map
        var state = d3.select(this);
        state
          .style("stroke-width","2px")
          .style("opacity",1);
        // increase note radious
        d3.select("#note-state" + d.id)
          .raise()
          .attr("r",circle_radius_max)
          .style("stroke-width","2px")
          .style("opacity",1);
        // move and fill stem
        d3.select("#stem-state"+ d.id)
          .raise()
          .style("opacity",1)
          .style("stroke-width","2px")
          .attr("transform","translate("+(circle_radius_max-circle_radius)+",0)");
        // move flag
        d3.select("#flags-state"+ d.id)
          .raise()
          .style("opacity", d3.select("#flags-state" + d.id).style("opacity")*2)
          .style("stroke-width","2px")
          .attr("transform","translate("+(circle_radius_max-circle_radius)+",0)");
        d3.select("#stateText-state"+ d.id)
          .raise()
          .style("opacity", 1)
          .attr("transform","translate("+0+","+3.5+")");
        d3.select(".arc").raise()
      })

      regionalMap.on("mouseout", function(d) {
        // state map
        var state = d3.select(this);
        state
          .style("stroke-width","0.50px")
          .style("opacity",0.7)
        d3.select("#note-state" + d.id)
          .raise()
          .attr("r",circle_radius)
          .style("stroke-width","0.50px");
        // move stem
        d3.select("#stem-state" + d.id)
          .raise()
          .style("opacity",0.50)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        // move flag
        d3.select("#flags-state" + d.id)
          .raise()
          .style("opacity",d3.select("#flags-state" + d.id).style("opacity")/2)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        d3.select("#stateText-state" + d.id)
          .raise()
          .style("opacity", 0)
        // select map
        d3.select("#states-"+d.id)
          .style("stroke-width","0.5px")
          .style("opacity",0.7)
        // raise arc to always be on top
        d3.select(".arc").raise()

      })


      // move region-West
      d3.selectAll(".region-West")
        .attr("transform","translate(0,7)");

      // move regions
      d3.selectAll(".region-South")
        .attr("transform","translate(-7,0)");

      // move regions
      d3.selectAll(".region-Northeast")
        .attr("transform","translate(7,0)");
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
