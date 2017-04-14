
// add elements in which to place the chart
function Map(){
  var width =960
    , height = 600
    , id = "us-map";

  // set projection
  var projection = d3.geoAlbersUsa()
      .scale(300)
      .translate([280,300]);
  // create function for path
  var geoPath = d3.geoPath()
      .projection(projection)

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
      console.log(data)
      console.log(selection)
      console.log(this)
      var regions = data.regions
        , districts = data.districts
        , state_array = data.state_array
        , state_lookup = data.state_lookup
        , us = data.us;

      // grab svg

      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(districts);
        console.log(districts)

      var map = selection.append("g")
          .attr("id","map")
          .selectAll(".state")
          .data(topojson.feature(us,us.objects.states).features)
         .enter().append("path")
          .attr("class",function(d){
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return "none";
            }else{
              return "region-"+state_lookup["state"+d.id].region_name
            } })
          .classed("state",true)
          .attr("d",geoPath)
          .style("fill",function(d){
            console.log("state"+d.id)
            if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return "none";
            }else{
              var color = district_color( state_lookup["state"+d.id].district_name );
              console.log(color)
              return district_color( state_lookup["state"+d.id].district_name )
            }
          })

      // move region-West
      d3.selectAll(".region-West")
        .attr("transform","translate(0,10)");

      // move regions
      d3.selectAll(".region-South")
        .attr("transform","translate(-10,0)");

      // move regions
      d3.selectAll(".region-Northeast")
        .attr("transform","translate(10,0)");
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
