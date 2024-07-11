
mapboxgl.accessToken =  mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates);

const marker = new mapboxgl.Marker({color:"red"})
  .setPopup( new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
  .setLngLat(e.lngLat)
  .setHTML("<h1>Hello World!</h1>")
  .setMaxWidth("300px")
  .addTo(map))
.setLngLat(coordinates) //listing.geometry.coordinates
  .addTo(map);
