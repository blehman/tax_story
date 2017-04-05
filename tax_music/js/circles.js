
// add elements in which to place the chart
function Circles(){
  var width =960
    , height = 600
    , id = "tax-circle"
    , circle_radius = 2
    , circle_radius_max = 5;
  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
      console.log(data)
      /*
       * SAMPLE DATA
      {'STATE': 'AK',
      'STATEFIPS': '02',
      'aBusinessIncome': 6739840,
      'aEnergyCredits': 3914,
      'aIncomeTax': 1861172,
      'aTaxDue': 796046,
      'aTaxLiability': 7160428,
      'aTotalIncome': 49444220,
      'aUnemployment': 462844,
      'district_name': 'Pacific',
      'energy_cost': {'Average Monthly Bill (Dollar and cents)': 119.64,
       'Average Monthly Consumption (kWh)': 603.0,
       'Average Price (cents/kWh)': 19.83,
       'Number of Customers': 282282.0},
      'nBusinessIncome': 109970,
      'nEnergyCredits': 11170,
      'nIncomeTax': 569820,
      'nTaxDue': 183940,
      'nTaxLiability': 597170,
      'nTotalIncome': 715360,
      'nUnemployment': 169580,
      'region_name': 'South',
      'returns': 715360},

      var testPath = selection.append("path")
          .attr("d","M 100 100 L 300 100 L 200 300 z")
          .style("fill","orange")
          .attr("stroke","black")
          .attr("stroke-width",3);
      */
      var regions = data.regions
        , districts = data.districts
        , state_array = data.state_array
        , state_lookup = data.state_lookup;

      // grab svg
      var svg = d3.select("#viz-container");

      // define staves (regions) spacing
      var stave_spacing = 40
        , stave_xstart = 100
        , stave_ystart = 100
        , stave_length = 300;

      // create color scale by district
      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(regions);

      // get extent for stems
      var energyCreditsPerReturnsExtent = d3.extent(state_array,d => (d.nEnergyCredits/d.returns));
      var energyCredits_yScale = d3.scaleLinear()
        .domain(energyCreditsPerReturnsExtent)
        .range([0,stave_spacing*1.2])

      // get extent for notes across x-axis
      var taxLiabilityPerLiableExtent = d3.extent(state_array,d => (d.aTaxLiability/d.nTaxLiability));
      // define xScale for notes
      var notes_xScale = d3.scaleLinear()
        .domain(taxLiabilityPerLiableExtent)
        .range([circle_radius,stave_length-circle_radius])

      // staves (regions) container
      var musicScore = svg.append("g")
        .attr("id","score-container")
        .attr("transform","translate("+stave_xstart+","+stave_ystart+")");

      // locate y setpoints for staves
      var stave_yValues = {};

      // draw staves
      var staves = musicScore.append("g")
        .attr("id","staves-container")
        .selectAll(".stave")
        .data(regions)
       .enter().append("path")
        .attr("class",d => d.STATE)
        .classed("stave",true)
        .attr("id",d => "stave-"+d.region_name)
        .attr("d",function(d,i) {
          // pack y-values
          stave_yValues[d] = stave_spacing*(i)
          return "M 0,"+  (stave_yValues[d])+"L"+ stave_length +","+(stave_yValues[d]);
        });

      // buld notes
      var notes = musicScore.append("g")
        .attr("id","notes-container")
        .selectAll(".note")
        .data(state_array)
       .enter().append("circle")
        .attr("id",d => "note-"+d.STATE + d.STATEFIPS)
        .attr("class",d => d.STATE)
        .classed("note",true)
        .attr("r",circle_radius)
        .attr("cy",d => stave_yValues[d.region_name])
        .attr("cx",d => notes_xScale( (d.aTaxLiability/d.nTaxLiability) ))
        .style("fill",d => district_color(d.district_name));

      // build stems
      var stems = musicScore.append("g")
        .attr("id","stem-container")
        .selectAll(".stem")
        .data(state_array)
       .enter().append("path")
        .attr("id",d => "stem-"+d.STATE + d.STATEFIPS)
        .attr("class",d => d.STATE)
        .classed("stem",true)
        .attr("d",function(d,i){
          var x = (notes_xScale((d.aTaxLiability/d.nTaxLiability)) +circle_radius)
            , y1 = stave_yValues[d.region_name]
            , y2 = y1 - energyCredits_yScale(d.nEnergyCredits/d.returns);
          var linePath = "M "+ x + "," + y1 + "L" + x + "," + y2
          return linePath;
        });
        //.style("fill",d => district_color(d.district_name));

      // build voronoi
      var voronoi = d3.voronoi()
        .x(d => notes_xScale((d.aTaxLiability/d.nTaxLiability)) )
        .y(d => stave_yValues[d.region_name])
        .extent([[-20,-40],[stave_length+20 , (stave_spacing * regions.length)]]);

      // draw voronoi polygons
      var voronoi_polygons = musicScore.append("g")
        .attr("id","voronoi-container")
        .selectAll(".voronoi")
        .data(voronoi.polygons(state_array))
       .enter().append("path")
        .classed("voronoi",true)
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

      // mouseover
      voronoi_polygons.on('mouseover',function(d,i){
        d3.select("#note-"+d.data.STATE + d.data.STATEFIPS)
          .attr("r",circle_radius_max);
        d3.select("#stem-"+d.data.STATE + d.data.STATEFIPS)
          .attr("transform","translate("+(circle_radius_max-circle_radius)+",0)");
      })
      // mouseout
      voronoi_polygons.on('mouseout',function(d,i){
        d3.select("#note-"+d.data.STATE + d.data.STATEFIPS)
          .attr("r",circle_radius);
        d3.select("#stem-"+d.data.STATE + d.data.STATEFIPS)
          .attr("transform","translate(0,0)");
      })

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
