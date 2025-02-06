class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        // Map data
        this.maps = {
            rivers: {
                title: 'Rivers of India',
                content: `
                    <div class="map-info">
                        <h4>Major Rivers of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-primary">Himalayan Rivers</h5>
                                <ul>
                                    <li>Indus System: Indus, Jhelum, Chenab, Ravi, Beas, Sutlej</li>
                                    <li>Ganga System: Ganga, Yamuna, Son, Gomti, Ghaghra, Gandak, Kosi</li>
                                    <li>Brahmaputra System: Brahmaputra, Tista, Manas</li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-success">Peninsular Rivers</h5>
                                <ul>
                                    <li>West Flowing: Narmada, Tapi, Sabarmati, Mahi</li>
                                    <li>East Flowing: Mahanadi, Godavari, Krishna, Kaveri</li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/India_rivers_map.png" 
                                 alt="Rivers of India Map" 
                                 class="img-fluid">
                            <div class="text-center text-muted mt-2">
                                <small>Map temporarily unavailable</small>
                            </div>
                        </div>
                    </div>
                `
            },
            mountains: {
                title: 'Mountain Ranges',
                content: `
                    <div class="map-info">
                        <h4>Mountain Ranges of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-primary">Himalayas</h5>
                                <ul>
                                    <li>Greater Himalayas (Himadri): Average height 6,000m</li>
                                    <li>Lesser Himalayas (Himachal): Average height 3,000m</li>
                                    <li>Outer Himalayas (Siwaliks): Average height 900-1,200m</li>
                                    <li>Major Peaks: Mount Everest, K2, Kanchenjunga</li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-success">Other Major Ranges</h5>
                                <ul>
                                    <li>Western Ghats (Sahyadri): Runs parallel to west coast, average height 1,200m</li>
                                    <li>Eastern Ghats: Discontinuous range along east coast</li>
                                    <li>Aravalli Range: Oldest mountain range in India</li>
                                    <li>Vindhya Range: Natural boundary between North and South India</li>
                                    <li>Satpura Range: Parallel to Vindhya Range</li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/India_geographic_map.png" 
                                 alt="Mountain Ranges of India Map" 
                                 class="img-fluid">
                            <div class="text-center text-muted mt-2">
                                <small>Map temporarily unavailable</small>
                            </div>
                        </div>
                    </div>
                `
            },
            states: {
                title: 'States & Union Territories',
                content: `
                    <div class="map-info">
                        <h4>States and Union Territories</h4>
                        <div class="row">
                            <div class="col-md-6">
                                <h5 class="text-primary">States (28)</h5>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <strong>North India:</strong>
                                        <ul>
                                            <li>Himachal Pradesh: Capital - Shimla</li>
                                            <li>Punjab: Capital - Chandigarh</li>
                                            <li>Uttarakhand: Capital - Dehradun</li>
                                            <li>Haryana: Capital - Chandigarh</li>
                                        </ul>
                                    </div>
                                    <div class="list-group-item">
                                        <strong>South India:</strong>
                                        <ul>
                                            <li>Kerala: Capital - Thiruvananthapuram</li>
                                            <li>Tamil Nadu: Capital - Chennai</li>
                                            <li>Karnataka: Capital - Bengaluru</li>
                                            <li>Andhra Pradesh: Capital - Amaravati</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h5 class="text-info">Union Territories (8)</h5>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <ul>
                                            <li>Delhi: National Capital Territory</li>
                                            <li>Puducherry: Former French Colony</li>
                                            <li>Ladakh: Newest UT (2019)</li>
                                            <li>Jammu & Kashmir</li>
                                            <li>Andaman & Nicobar Islands</li>
                                            <li>Lakshadweep</li>
                                            <li>Chandigarh</li>
                                            <li>Dadra and Nagar Haveli and Daman and Diu</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/India_states_and_union_territories_map.png" 
                                 alt="States and UTs of India Map" 
                                 class="img-fluid">
                            <div class="text-center text-muted mt-2">
                                <small>Map temporarily unavailable</small>
                            </div>
                        </div>
                    </div>
                `
            },
            agriculture: {
                title: 'Agricultural Regions',
                content: `
                    <div class="map-info">
                        <h4>Agricultural Regions of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-success">Major Crop Regions</h5>
                                <ul>
                                    <li>Northern Plains (Wheat Belt):
                                        <ul>
                                            <li>Major producers: Punjab, Haryana, UP</li>
                                            <li>Crops: Wheat, Rice, Sugarcane</li>
                                        </ul>
                                    </li>
                                    <li>Eastern Region (Rice Bowl):
                                        <ul>
                                            <li>Major producers: West Bengal, Bihar</li>
                                            <li>Crops: Rice, Jute, Tea</li>
                                        </ul>
                                    </li>
                                    <li>Western Region (Cotton Belt):
                                        <ul>
                                            <li>Major producers: Gujarat, Maharashtra</li>
                                            <li>Crops: Cotton, Groundnut, Oil seeds</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-warning">Agricultural Seasons</h5>
                                <ul>
                                    <li>Kharif (July-October): 
                                        <ul>
                                            <li>Crops: Rice, Maize, Sorghum, Cotton, Groundnut</li>
                                            <li>Dependent on monsoon rains</li>
                                        </ul>
                                    </li>
                                    <li>Rabi (October-March):
                                        <ul>
                                            <li>Crops: Wheat, Barley, Peas, Gram</li>
                                            <li>Requires irrigation</li>
                                        </ul>
                                    </li>
                                    <li>Zaid (March-July):
                                        <ul>
                                            <li>Crops: Watermelon, Cucumber, Vegetables</li>
                                            <li>Short duration crops</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/India_agriculture_map.png" 
                                 alt="Agricultural Map of India" 
                                 class="img-fluid">
                            <div class="text-center text-muted mt-2">
                                <small>Map temporarily unavailable</small>
                            </div>
                        </div>
                    </div>
                `
            }
        };

        this.bindEvents();
    }

    bindEvents() {
        // Bind map category buttons
        this.mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mapType = button.dataset.mapType;
                this.showMap(mapType);

                // Update active button
                this.mapButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Show maps modal
        document.getElementById('show-maps').addEventListener('click', () => {
            this.mapModal.show();
            // Show default map (rivers)
            this.showMap('rivers');
            console.log('Map modal opened');
        });
    }

    showMap(type) {
        const mapData = this.maps[type];
        if (!mapData) {
            console.error('Map type not found:', type);
            return;
        }

        // Show loading state
        this.mapContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

        // Set the content after a brief delay to ensure modal transition is complete
        setTimeout(() => {
            this.mapContainer.innerHTML = mapData.content;
        }, 100);
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing UPSC Maps');
    new UPSCMaps();
});