
// add elements in which to place the chart
function Map(){
  var width =960
    , height = 600
    , id = "us-map"
    , circle_radius = 4
    , circle_radius_max = 15
    , mDispatch;

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

      // get states geoJSON object
      var states = topojson.feature(us,us.objects.states).features;

      // calculate the centroid of each state
      states.map( d => d.properties["centroid"] = geoPath.centroid(d))

      // draw each state
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
              return "state region-"+state_lookup["state"+d.id].region_name
            } })
          .classed("state-neutral",true)
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

      // explode the map to regions
      var statesObj = d3.selectAll(".state")
        .attr("transform",function(d){
          if (d.id == "72" || d.id == "69" || d.id == "60" || d.id == "78" || d.id == "66"){
              return;
            }else{
              var state = "state"+d.properties.STATEFP;
              var region = state_lookup[state].region_name;
              return "translate("+regionShift[region][0]+","+regionShift[region][1]+")"
            }
        });


      statesObj.on("mouseover",function(d){
        var result = {"STATEFIPS":d.properties.STATEFP}
        mDispatch.call("note-state--hover",this,result)
      })
      statesObj.on("mouseout",function(d){
        var result = {"STATEFIPS":d.properties.STATEFP}
        mDispatch.call("note-state--out",this,result)
      })
      /*
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
  chart.mDispatch = function(mD) {
    if (!arguments.length) { return mDispatch; }
    mDispatch = mD;
    return chart;
  };

  return chart
}
