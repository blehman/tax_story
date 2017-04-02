// add elements in which to place the chart
function NewMap(){
  var width =600
    , height = 960
    , id = "map-container"
    , path = d3.geoPath()
    , colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
        console.log(data)
        console.log(height)
        var us = data["us"];

        var gMap = selection.append("g")
            .classed("zips",true)
            .selectAll("path")
            .data(topojson.feature(us, us.objects.zipcodes).features)
           .enter().append("path")
            .attr("fill", function(d,i) { return colorScale(i) })
            .attr("d", path);
      // position map
      gMap.attr("transform","translate(-200,50)")

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
