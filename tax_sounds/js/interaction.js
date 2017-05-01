
// add elements in which to place the chart
function Interaction(){
  var width =960
    , height = 600
    , id = "interaction-layer"
    , mDispatch
    , noteStateHover;
  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
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

      */
      var regions = data.regions
        , districts = data.districts
        , state_array = data.state_array
        , state_lookup = data.state_lookup;

      noteStateHover = function(d){
        // change state class on map
        d3.selectAll(".state")
          .style("opacity",0.20)

        // change state class on map
        d3.select("#states-state"+d.STATEFIPS)
          .attr("class", "state-hover")
          .style("opacity",1)

        // change note class in system
        d3.select("#note-state"+d.STATEFIPS)
          .attr("rx", d => d.rx * 2)
          .attr("ry",d => d.ry * 2)

      }
      noteStateOut = function(d){
        // change state class on map
        d3.selectAll(".state")
          .style("opacity",0.80)

        d3.select("#states-state"+d.STATEFIPS)
          .classed("state-hover", false)
          .style("opacity",0.80)
          .classed("state",true)
        // change note class in system
        d3.select("#note-state"+d.STATEFIPS)
          .attr("rx",d => d.rx )
          .attr("ry",d => d.ry )

      }

    // end selection.each
    })

  // end chart
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
  chart.mDispatch = function(m) {
    if (!arguments.length) { return mDispatch; }
    mDispatch = m;
    return chart;
  };
  chart.noteStateHover = function(nI) {
    if (!arguments.length) { return noteStateHover; }
    noteStateHover = nI;
    return chart;
  };
  chart.noteStateOut = function(nO) {
    if (!arguments.length) { return noteStateOut; }
    noteStateOut = nO;
    return chart;
  };
  return chart
}
