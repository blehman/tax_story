# Now use shp2json to convert to GeoJSON
shp2json cb_2016_us_county_5m.shp -o transform/us.json

# To convert a GeoJSON feature collection to a newline-delimited stream of GeoJSON features, use ndjson-split
ndjson-split 'd.features' < transform/us.json > transform/us.ndjson

# Manipulate 
