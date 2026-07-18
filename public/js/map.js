const listingLocation = document
    .getElementById("listing-location")
    .dataset.location;

async function loadMap() {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listingLocation)}`
    );

    const data = await response.json();

    if (data.length === 0) {
        alert("Location not found!");
        return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;

    // Create map
    const map = L.map("map").setView([lat, lon], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Creates a red marker with the coffee icon
    const redMarker = L.AwesomeMarkers.icon({
        icon: 'location-dot',
        prefix: "fa",
        markerColor: 'red'
    });

    console.log(redMarker);
    console.log(redMarker instanceof L.Icon);


    // Add marker
    L.marker([lat, lon], {icon: redMarker})
        .addTo(map)
        .bindPopup(listingLocation)
        .openPopup();
        
}
loadMap();