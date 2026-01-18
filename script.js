document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });


    // --- Map Initialization Helper ---
    function initMap(elementId, center = [39.4699, -0.3763], zoom = 12) {
        // Check if element exists to avoid errors
        if (!document.getElementById(elementId)) return;

        const map = L.map(elementId).setView(center, zoom);

        // Light Clean Basemap (CartoDB Voyager) for Earth/Plant theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // --- INSTRUCTION FOR STUDENT ---
        // To add your own layers (SHP converted to GeoJSON, or Rasters), use code like this:
        /*
        fetch('assets/tus_datos.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function(feature) {
                        return {color: '#00f2ea'};
                    }
                }).addTo(map);
            });
        */

        return map;
    }

    // --- Initialize Maps for Specific Practices ---
    // Using default coordinates (Valencia, Spain example) - Change as needed
    const madridCoords = [40.4168, -3.7038];
    const valenciaCoords = [39.4699, -0.3763];

    // Practice 4: Zonas Validas
    const mapP4 = initMap('map-p4', valenciaCoords, 10);

    // Practice 5: Severidad (Fire severity often covers larger areas)
    const mapP5 = initMap('map-p5', valenciaCoords, 9);

    // Practice 8: Contenedores (Urban scale)
    const mapP8 = initMap('map-p8', madridCoords, 13);

    // Practice 9: SAVI & EVI
    const mapP9 = initMap('map-p9', valenciaCoords, 11);

    // Practice 10: Indices
    const mapP10 = initMap('map-p10', valenciaCoords, 11);

});
