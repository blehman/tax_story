(function() {
  // get data
  d3.queue()
    .defer(d3.json, "data/statefips_counts_obj.json")
    .defer(d3.json, "data/statefips_counts_array.json")
    //.defer(d3.json, "data/county_state_nation/us-counties-states-nation.json")
    .defer(d3.json, "data/county_state_nation/us-quantized-topo.json")
    .await(ready);

  function ready(error,state_obj,state_array,us){
    if (error) throw error;
    /* SAMPLE DATA
    {
      "returns": 4042890,
      "nTotalIncome": 4042890,
      "aTotalIncome": 220605316,
      "nUnemployment": 143010,
      "aUnemployment": 427126,
      "nEnergyCredits": 74520,
      "aEnergyCredits": 29284,
      "nIncomeTax": 2568530,
      "aBusinessIncome": 24547670,
      "nBusinessIncome": 657620,
      "aIncomeTax": 5946732,
      "nTaxLiability": 2911390,
      "aTaxLiability": 26235098,
      "nTaxDue": 701810,
      "aTaxDue": 3135078,
      "STATE": "AL",
      "STATEFIPS": "01",
      "region_name": "West",
      "district_name": "East South Central",
      "energy_cost": {
        "Number of Customers": 2182616,
        "Average Monthly Consumption (kWh)": 1218,
        "Average Price (cents/kWh)": 11.7,
        "Average Monthly Bill (Dollar and cents)": 142.48
    }
    */

    //var regions = d3.map(state_array,d=>d.region_name).keys()
    var regions = ["Northeast","Midwest","South","West"]
        , districts = d3.map(state_array,d=>d.district_name).keys()
    var data = {"state_lookup":state_obj
      ,"state_array":state_array
      ,"regions":regions
      ,"districts":districts
      ,"us":us
    }
    console.log(data)

    // responsive svg: http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js#answer-25978286
    var svg = d3.select("body")
      .append("div")
        .classed("svg-container", true) //container class to make it responsive
      .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        //.attr("height",960)
        //.attr("width",600)
        //class to make it responsive
        .classed("svg-content-responsive", true)
        .attr("id","viz-container");


    // call the musical score constructor
    var iMusic = MusicalScore();

    svg.selectAll("#"+iMusic.id())
      .data([data])
     .enter().append("g")
      .attr('id',iMusic.id())
      .call(iMusic);


    // call the map constructor
    var iMap = Map();

    svg.selectAll("#"+iMap.id())
      .data([data])
     .enter().append("g")
      .attr('id',iMap.id())
      .call(iMap);




  }
}())
