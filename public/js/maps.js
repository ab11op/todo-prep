class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        // Map data with direct image URLs
        this.maps = {
            rivers: {
                title: 'Rivers of India',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/India_rivers_map.png',
                description: 'Major Rivers of India'
            },
            mountains: {
                title: 'Mountain Ranges',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/India_geographic_map.png',
                description: 'Mountain Ranges of India'
            },
            states: {
                title: 'States & Union Territories',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/India_states_and_union_territories_map.png',
                description: 'States and Union Territories of India'
            },
            agriculture: {
                title: 'Agricultural Regions',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/India_agriculture_map.png',
                description: 'Agricultural Regions of India'
            }
        };

        this.bindEvents();
    }

    bindEvents() {
        this.mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mapType = button.dataset.mapType;
                this.showMap(mapType);
                this.mapButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        document.getElementById('show-maps').addEventListener('click', () => {
            this.mapModal.show();
            this.showMap('rivers');
        });
    }

    showMap(type) {
        const mapData = this.maps[type];
        if (!mapData) return;

        this.mapContainer.innerHTML = `
            <div class="map-content">
                <h4>${mapData.title}</h4>
                <div class="map-image">
                    <img src="${mapData.imageUrl}" 
                         alt="${mapData.description}" 
                         class="img-fluid"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22>Image not available</text></svg>';">
                </div>
                <p class="text-muted mt-2">${mapData.description}</p>
            </div>
        `;
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UPSCMaps();
});