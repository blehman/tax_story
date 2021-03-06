
// add elements in which to place the chart
function Circles(){
  var width =960
    , height = 600
    , clickArray = []
    , id = "tax-circle"
    , circle_radius = 4
    , circle_radius_max = 15
    , stem_scale_factor = 0.90
    , line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        //.curve(d3.curveCardinal.tension(0.5));
        //.curve(d3.curveBundle.beta(1));
        .curve(d3.curveBasis);
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

      // staves (regions) container
      var musicScore = svg.append("g")
        .attr("id","score-container")
        .attr("transform","translate("+stave_xstart+","+stave_ystart+")");

      // locate y setpoints for staves
      var stave_yValues = {};

      // draw staves
      var staves = musicScore
        .append("g")
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

      var note_stem_container = musicScore.append("g").attr("id","note-stem-container")

      // build stems
      var stems = note_stem_container
        //musicScore
        //.append("g")
        //.attr("id","stem-container")
        .selectAll(".stem")
        .data(state_array)
       .enter().append("path")
        .attr("id",d => "stem-"+d.STATE + d.STATEFIPS)
        .attr("class",d => d.STATE)
        .classed("stem",true)
        .attr("d",function(d,i){
          var x = (notes_xScale((d.aTaxLiability/d.aTotalIncome)) +circle_radius)
            , y1 = stave_yValues[d.region_name]
            , y2 = y1 - energyCredits_yScale(d.nEnergyCredits/d.returns);
          var linePath = "M "+ x + "," + y1 + "L" + x + "," + y2
          return linePath;
        });

      // build notes
      var notes = note_stem_container
        //musicScore
        //.append("g")
        //.attr("id","notes-container")
        .selectAll(".note")
        .data(state_array)
       .enter().append("circle")
        .attr("id",d => "note-"+d.STATE + d.STATEFIPS)
        .attr("class",d => d.STATE)
        .classed("note",true)
        .attr("r",circle_radius)
        .attr("cy",d => stave_yValues[d.region_name])
        .attr("cx",d => notes_xScale( (d.aTaxLiability/d.aTotalIncome) ))
        .style("fill",d => district_color(d.district_name));

      // add state text to note
      var stateText = note_stem_container
        .selectAll(".state-text")
        .data(state_array)
       .enter().append("text")
        .attr("x", d => notes_xScale( (d.aTaxLiability/d.aTotalIncome) ))
        .attr("y", d => stave_yValues[d.region_name])
        .attr("id",d => "stateText-"+d.STATE + d.STATEFIPS)
        .classed("state-text",true)
        .text(d=>d.STATE);

      // build flags
      var flags = note_stem_container.selectAll(".flags")
        .data(state_array)
       .enter().append("path")
        .attr("id",d => "flags-"+ d.STATE + d.STATEFIPS)
        .classed("flags",true)
        .attr("d",function(d,i){
          var x = (notes_xScale((d.aTaxLiability/d.aTotalIncome)) +circle_radius)
            , y1 = stave_yValues[d.region_name]
            , y2 = y1 - energyCredits_yScale(d.nEnergyCredits/d.returns)
            , p1 = [x,y2]
            , p2 = [x+1,y2+1]
            , p3 = [x+1,y2+3]
            , p4 = [x+2,y2+6]
            , p5 = [x+3, y2+7]
            , p6 = [x+4,y2+8];
          var points = [p1,p2,p3,p4,p5,p6]
          return line(points)
        })
      // put the stems and notes in order on the svg
      state_array.map(function(d,i){
        var key = d.STATE + d.STATEFIPS;
        d3.select("#stem-"+key).raise()
        d3.select("#note-"+key).raise()
        d3.select("#flags-"+key).raise()
        d3.select("#stateText-"+key).raise()
      })

        //.style("fill",d => district_color(d.district_name));

      // build voronoi
      var voronoi = d3.voronoi()
        .x(d => notes_xScale((d.aTaxLiability/d.aTotalIncome)) )
        .y(d => stave_yValues[d.region_name])
        .extent([[-20,-40],[stave_length+20 , (stave_spacing * regions.length)]]);

      // draw voronoi polygons
      var voronoi_polygons = musicScore
        //.append("g")
        //.attr("id","voronoi-container")
        .selectAll(".voronoi")
        .data(voronoi.polygons(state_array))
       .enter().append("path")
        .classed("voronoi",true)
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

      // mouseover
      voronoi_polygons.on('mouseover',function(d,i){
        // increase note radious
        d3.select("#note-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .attr("r",circle_radius_max)
          .style("stroke-width","2px");
        // move and fill stem
        d3.select("#stem-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity",1)
          .style("stroke-width","2px")
          .attr("transform","translate("+(circle_radius_max-circle_radius)+",0)");
        // move flag
        d3.select("#flags-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity", d3.select("#flags-"+d.data.STATE + d.data.STATEFIPS).style("opacity")*2)
          .style("stroke-width","2px")
          .attr("transform","translate("+(circle_radius_max-circle_radius)+",0)");
        d3.select("#stateText-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity", 1)
          .attr("transform","translate("+0+","+3.5+")");
        d3.select(".arc").raise()
      })
      // mouseout
      voronoi_polygons.on('mouseout',function(d,i){
        // decrease note radius
        d3.select("#note-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .attr("r",circle_radius)
          .style("stroke-width","0.50px");
        // move stem
        d3.select("#stem-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity",0.50)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        // move flag
        d3.select("#flags-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity",d3.select("#flags-"+d.data.STATE + d.data.STATEFIPS).style("opacity")/2)
          .style("stroke-width","0.50px")
          .attr("transform","translate(0,0)");
        d3.select("#stateText-"+d.data.STATE + d.data.STATEFIPS)
          .raise()
          .style("opacity", 0)
        // raise arc to always be on top
        d3.select(".arc").raise()
      })
      // click
      voronoi_polygons.on('click',function(d,i){
        var key = d.data.STATE + d.data.STATEFIPS
        , keyLocation = clickArray.indexOf(key)
        , keyInClickArray = (keyLocation > -1)

        // add key
        add(key)
        // if repeated key, remove all instance of key
        if (keyInClickArray){
          clear(key)
        }
        // if newly selected comparison, remove second item
        if (clickArray.length==3){
          clear(clickArray[1])
        }
        // if two items remain, make comparison
        if (clickArray.length==2){
          comp()
        }else{
          removeArc()
          removeText()
        }
        function clear(k){
          clickArray = clickArray.filter(d => d!=k)
          //console.log(clickArray)
          removeFlag(k)
          removeArc(k)
        }
        function add(k){
          clickArray.push(k)
          //console.log(clickArray)
          addFlag(k)
        }
        function addFlag(k){
          d3.select("#note-"+k)
            .style("stroke-width","1.5px");
          d3.select("#flags-"+k)
            .style("opacity",1)
        }
        function removeFlag(k){
          d3.select("#note-"+k)
            .style("stroke-width","0.25px");
          d3.select("#flags-"+k)
            .style("opacity",0.0);
        }
        function comp(){
          var linePoints = []
          var compValues = {}
          // iterate through clickArray
          clickArray.map(function(k,i){
            // remove flags
            //removeFlag(k)
            // get coordiinates for line
            d3.select("#note-"+k).each(function(d){
              var x1 = (notes_xScale((d.aTaxLiability/d.aTotalIncome)) +circle_radius)
                , y1 = stave_yValues[d.region_name]
                , y2 = y1 - energyCredits_yScale(d.nEnergyCredits/d.returns)
                , cy = stave_yValues[d.region_name]
                , cx = notes_xScale( (d.aTaxLiability/d.aTotalIncome) )
              linePoints.push([cx,cy])
              compValues[k] = d
            })
          })
          drawArc(linePoints)
          addText(compValues)
        }
        function drawArc(coords){
          /*
          var line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveCardinal.tension(0.5));
          */
          // draw arc
          note_stem_container.selectAll(".arc")
            .data([coords])
           .enter().append("path")
            .classed("arc",true)
            .attr("d",function(d){
              var x1 = d[0][0]
                , y1 = d[0][1]
                , x2 = d[1][0]
                , y2 = d[1][1];
              var dx = x2 - x1,
                  dy = y2 - y1,
                  dr = Math.sqrt(dx * dx + dy * dy);
              return "M" + x1 + "," + y1 + "A" + dr + "," + dr +
          " 0 0,0 " + x2 + "," + y2;
            })
            /*
            .attr("d",function(d){
              var x1 = d[0][0]
                , y1 = d[0][1]
                , x2 = d[1][0]
                , y2 = d[1][1];
              return "M"+x1+","+y1+"L"+x2+","+y2;
            })
            */
            //.attr("d",line)
        }
        function removeArc(){
          d3.selectAll(".arc").remove()
        }
        function addText(compValues){
          removeText()
          //console.log(compValues)
          var state1 = clickArray[0]
            , state2 = clickArray[1];

          var insight1 = compValues[state1].STATE +" saved $"+compValues[state1].aEnergyCredits +" from energy credits compared to "+ compValues[state2].STATE +"'s $"+compValues[state2].aEnergyCredits+" savings";
          //console.log(insight1);
          musicScore.append("g")
            .classed("insights",true)
            .append("text")
            .attr("x",0)
            .attr("y",140)
            .style("fill","black")
            .style("stroke","black")
            .style("font-size","12")
            .style("opacity",0.70)
            .text(insight1)

        }
        function removeText(){
          musicScore.select(".insights").remove()
          //console.log("test: removeText")
        }

        // decrease note radious
        //d3.select("#note-"+d.data.STATE + d.data.STATEFIPS)
        //  .each(d => console.log(d))
        // decrease note radious
        //d3.select("#stem-"+d.data.STATE + d.data.STATEFIPS)
        //  .each(d => console.log(d))
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
