
// add elements in which to place the chart
function Circles(){
  var width =960
    , height = 600
    , id = "tax-cirlce";
  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(data){
      console.log(data)
      console.log(height)

    var testPath = selection.append("path")
        .attr("d","M 100 100 L 300 100 L 200 300 z")
        .style("fill","orange")
        .attr("stroke","black")
        .attr("stroke-width",3);

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
