## https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html

curl http://www2.census.gov/geo/tiger/GENZ2016/shp/cb_2016_us_nation_5m.zip -o data/cb_2016_us_nation_5m.zip

open data/cb_2016_us_nation_5m.zip

cd data/cb_2016_us_nation_5m

## convert shp file to GeoJSON
shp2json cb_2016_us_county_5m.shp > us-counties.json

## parse each county to a newline
ndjson-split 'd.features' < us-counties.json > counties-no-id.ndjson

## add an id to each county
ndjson-map 'd.id = d.properties.GEOID, d' < counties-no-id.ndjson > counties.ndjson

## convert newline to geoJSON
#ndjson-reduce < counties-id.ndjson > counties.json

## convert geoJSON to topoJSON (this file DOES NOT have a counties object)
geo2topo -n counties.ndjson > counties-topo.json

## parse states (the combined file now has both states and counties)
topomerge states=counties -k 'd.id.slice(0, 2)' < counties-topo.json > states-topo.json

## parse nation (the combined file now has nation, states, and counties)
topomerge nation=states < states-topo.json > us-topo.json
