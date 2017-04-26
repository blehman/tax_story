
// add elements in which to place the chart
function MusicalScore(){
  var width =960
    , height = 600
    , id = "tax-sounds"
    , system_width = 200 // horizontal length of score
    , system_height = 400 // vertical length of score
    , columns_per_measure = 12 // number of beats per measure
    , measures_per_line = 3 // number of columns per line
    , line_height = 30 // vertical distance of lines, which is a collection of the 5 staves
    , distance_between_lines = 10 // separation between lines
    , distance_between_staves = line_height/5
    , stave_xstart = 20
    , stave_ystart = 20
    , num_staves = 5
    , num_notes_per_line = 9
    , num_breaks = 3 // number of columns per line
    , rx = 3
    , ry = 2
    , adj = 2; // make the notes appear on lines or between lines

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

      // define staves (regions) spacing
      //var stave_spacing = 40
      //  , stave_xstart = 50
      //  , stave_ystart = 60
      //  , stave_length = 500

      var stave_rows = [] // 9 notes in each line
        , rows = []
        , columns = []
        , num_columns = columns_per_measure*measures_per_line;

      for (var i = 0; i < num_staves; i++) {
        stave_rows.push(i);
      }

      for (var i = 0; i < num_notes_per_line; i++) {
        rows.push(i);
      }

      for (var i = 0; i < num_columns; i++) {
        columns.push(i);
      }

      var distance_between_beats = system_width/columns.length
        , vertical_distance_between_notes = line_height/(num_notes_per_line)
        , vertical_distance_between_staves = line_height/(num_staves)
        // find the points for all of the x values
        , xScale_range = columns.map(d => d*distance_between_beats)
        // find the points for y values in each line
        , yScale_notesRange = rows.map(d => d*vertical_distance_between_notes)
        , yScale_notesRange_rev = yScale_notesRange.slice().reverse()
        , yScale_staveRange = stave_rows.map(d => d*vertical_distance_between_staves)
        , yScale_staveRange_rev = yScale_staveRange.slice().reverse()
        , district_color = d3.scaleOrdinal(d3.schemeCategory10)
          .domain(districts);

      // create color scale by district
      var district_color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(districts);

      // get extent of energy credits per return
      var energyCreditsPerReturnsExtent = d3.extent(state_array,d => (d.nEnergyCredits/d.returns));

      // get extent of tax liability per return
      var taxLiabilityPerIncomeExtent = d3.extent(state_array,d => (d.aTaxLiability/d.returns));
      //var staveIncrements = (energyCreditsPerReturnsExtent[1]-energyCreditsPerReturnsExtent[0]) / num_notes_per_line;
      //var staveLocations = rows.map(d => energyCreditsPerReturnsExtent[0]+(d*staveIncrements))

      //console.log(taxLiabilityPerIncomeExtent)

      // y == energy credits per return
      var yScale = d3.scaleQuantize()
        .domain(energyCreditsPerReturnsExtent)
        .range(yScale_notesRange_rev);

      var yScaleDomainBands = yScale_notesRange_rev.map( d => yScale.invertExtent(d) )

      // stave locations
      var staveLocations = []
      yScaleDomainBands.map(function(d,i){
        if (i%2 ==0){
          staveLocations.push(d[0]) // append the min of each band
        }
      })

      // x == tax liability per return
      var xScale = d3.scaleQuantize()
        .domain(taxLiabilityPerIncomeExtent)
        .range(xScale_range);

/*
      // notes scale
      var yScale_notes = d3.scaleQuantize()
        .domain(d3.extent(rows))
        .range(yScale_notesRange_rev);
*/
      // stave scale
      var yScale_staves = d3.scaleQuantize()
        .domain(d3.extent(stave_rows))
        .range(yScale_staveRange);

      // music container
      var musicScore = selection.append("g")
        .attr("id","score-container")
        .attr("transform","translate("+stave_xstart+","+stave_ystart+")");


      // for each region append 5 staves.
      regions.forEach(function(region,i){
        // create translation
        var translation = "translate(0,"+((i*distance_between_lines)+(i*line_height))+") ROTATE";

        // create staves container
        var staves = musicScore.selectAll(".stave-region-"+region)
          .data([region])
         .enter().append("g")
          .classed("regions",true)
          .attr("id", "stave-region-"+region)
          .attr("transform",translation.replace("ROTATE",""));

        // add staves
        staves.selectAll(".staves")
          .data(stave_rows)
         .enter().append("path")
          .classed("staves",true)
          .attr("d",function(d,i){
            var y = yScale(staveLocations[i])
              , x1 = 0
              , x2 = system_width;
            var linePath = "M "+ x1 + "," + y + "L" + x2 + "," + y;
            return linePath
          });

        // add notes per region region
        var regional_states = [];

        // pack states
        state_array.map(function(d,i){
          if(d.region_name == region){
            regional_states.push(d)
          }
        })

        // use state packing to append notes to a specific line
        var notes = staves.selectAll(".notes-"+region)
          .data(regional_states)
         .enter().append("ellipse")
          .attr("id", d => "note-state"+d.STATEFIPS)
          .attr("class", "note-"+region)
          .classed("note",true)
          .attr("cx", d => rx + xScale(d.aTaxLiability/d.returns))
          .attr("cy",d=>yScale(d.nEnergyCredits/d.returns))
          .attr("rx",rx)
          .attr("ry",ry)
          .attr("transform", d=>"translate (0,1.4) rotate("+[-25,xScale(d.aTaxLiability/d.returns),yScale(d.nEnergyCredits/d.returns)].join(",")+")")
          .style("fill",d=>district_color(d.district_name));

        // use state packing to append stems to a specific line
        var notes = staves.selectAll(".notes-"+region)
          .data(regional_states)
         .enter().append("path")
          .attr("id", d => "stem-state"+d.STATEFIPS)
          .attr("class", "stem-"+region)
          .classed("stem",true)
          .attr("d",function(d,i){
            var x = rx + xScale(d.aTaxLiability/d.returns)
            //var x = (notes_xScale((d.aTaxLiability/d.aTotalIncome)) +circle_radius)
              , y1 = yScale(d.nEnergyCredits/d.returns)
              , y2 = y1 - 20
              //, y1 = stave_yValues[d.region_name]
              //, y2 = y1 - energyCredits_yScale(d.nEnergyCredits/d.returns);
            var linePath = "M "+ x + "," + y1 + "L" + x + "," + y2
            return linePath;
          })
          //.attr("cx", d => rx + xScale(d.aTaxLiability/d.returns))
          //.attr("cy",d=>yScale(d.nEnergyCredits/d.returns))
          //.attr("rx",rx)
          //.attr("ry",ry)
          .attr("transform", d=>"translate (0,1.4) ")
          //.style("fill",d=>district_color(d.district_name));

      // end regions.forEach
      })

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
  return chart
}
