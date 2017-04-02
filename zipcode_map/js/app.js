(function() {
  // call the heatmap constructor
  var iMap = NewMap();

  d3.queue()
    .defer(d3.json, "data/us-albers.cb_2015_us_zcta510_500k.json-topo.json-quantized.json")
    //.defer(d3.tsv, "unemployment.tsv", function(d) { unemployment.set(d.id, +d.rate); })
    .await(ready);

  function ready(error,us){
    if (error) throw error;

    var dataObj = {"us":us};

    //iMap.height( (myHeatmap.gridSize()*rowCount) +  myHeatmap.margin().top + myHeatmap.margin().bottom)
    //iMap.width( (myHeatmap.gridSize()*colCount) + myHeatmap.margin().right + myHeatmap.margin().left)
    var container = d3.select("body")
      .append("svg")
      .attr("height",960)
      .attr("width",600)
      .attr("id","viz-container")
      .selectAll('#'+iMap.id())
      .data([dataObj])
      .enter().append("g")
      .attr('id',iMap.id())
      .call(iMap)
  }
})()
