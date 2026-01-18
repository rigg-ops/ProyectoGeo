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

        // Standard OpenStreetMap (More details: roads, topography, labels - "With things")
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
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

    // Practice 4: Zonas Validas (Loading Shapefile)
    const mapP4 = initMap('map-p4', valenciaCoords, 10);

    // Practice 4: Zonas Validas (Loading Local Data)
    // const mapP4 = initMap('map-p4', valenciaCoords, 10); // Removed duplicate call

    // Check if data loaded correctly from the script tag
    if (typeof zonasValidasData !== 'undefined') {
        const p4Layer = L.geoJSON(zonasValidasData, {
            style: function (feature) {
                return {
                    color: '#ff7800',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.2
                };
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    let popupContent = "<b>Información:</b><br>";
                    for (const [key, value] of Object.entries(feature.properties)) {
                        popupContent += `${key}: ${value}<br>`;
                    }
                    layer.bindPopup(popupContent);
                }
            }
        }).addTo(mapP4);

        // Auto-center map to the loaded data
        try {
            const bounds = p4Layer.getBounds();
            if (bounds.isValid()) {
                mapP4.fitBounds(bounds);
            }
        } catch (e) {
            console.log("Could not auto-center map P4", e);
        }

    } else {
        console.error("Error: zonasValidasData not found. Make sure assets/zonas_validas_data.js is loaded.");
    }

    // Practice 5: Severidad (Fire severity)
    const mapP5 = initMap('map-p5', valenciaCoords, 10); // Standard zoom

    if (typeof severidadData !== 'undefined') {
        // 1. Convert Base64 to ArrayBuffer
        const binaryString = window.atob(severidadData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // 2. Parse GeoTIFF
        parseGeoraster(arrayBuffer).then(georaster => {
            // 3. Create Layer
            const layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.7,
                resolution: 256 // Higher value = sharper image (default was too low)
            });
            layer.addTo(mapP5);

            // 4. Fit bounds
            mapP5.fitBounds(layer.getBounds());

        }).catch(e => console.error("Error parsing TIF P5:", e));
    } else {
        console.error("Error: severidadData not found.");
    }

    // Practice 8: Contenedores (Urban scale)
    const mapP8 = initMap('map-p8', madridCoords, 13);

    // Practice 9: SAVI & EVI
    const mapP9 = initMap('map-p9', valenciaCoords, 11);

    // Practice 10: Indices
    const mapP10 = initMap('map-p10', valenciaCoords, 11);


    // --- Image Lightbox Logic ---
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img-in-modal");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementsByClassName("close-modal")[0];

    // Get all images that are insides 'media-box' (or you can select all images with 'img')
    // We filter for images that have a source
    const images = document.querySelectorAll('.media-box img');

    images.forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    // Close logic
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Close on click outside
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});
