/* ========================================
   🇮🇹 Ruta Turística por Italia - Main JS
   ======================================== */

// Global variables
let map;
let markers = [];
let routeData = null;
let tourismPoints = null;
let directionsService;
let directionsRenderer;
let clustersEnabled = true;
let markerCluster = null;

// Configuration
const CONFIG = {
  defaultCenter: { lat: 44.0, lng: 12.0 }, // Centro de Italia
  defaultZoom: 7,
  apiKey: localStorage.getItem('google_maps_api_key') || 'AIzaSyAtBegx6IWWvvH06GVqKPJ5uxF4eiWOB1o', // Try localStorage first
  mapOptions: {
    zoom: 7,
    center: { lat: 44.0, lng: 12.0 },
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
      }
    ]
  }
};

// Color mapping for different point types
const POINT_COLORS = {
  monument: '#8B0000',    // Dark red
  nature: '#008000',      // Green
  food: '#FF8C00',        // Orange
  city: '#0066CC'         // Blue
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🇮🇹 Inizializzazione applicazione...');
  
  // Initialize components
  initNavigation();
  initScrollEffects();
  initLoadingScreen();
  initBackToTop();
  
  // Load data and initialize map
  loadDataAndInitialize();
});

// Loading screen management
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Hide loading screen after content is loaded
  window.addEventListener('load', function() {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1500); // Show loading for at least 1.5 seconds
  });
}

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active navigation link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Scroll effects and animations
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe elements for animations
  const elementsToAnimate = document.querySelectorAll('.city-card, .info-card, .download-card');
  elementsToAnimate.forEach(el => observer.observe(el));

  // Number counting animation for hero stats
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll('[id$="-count"]');
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 20);
        observer.unobserve(counter);
      }
    });
  });

  counters.forEach(counter => observer.observe(counter));
}

// Back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Data loading and map initialization
async function loadDataAndInitialize() {
  try {
    console.log('📊 Cargando datos de la ruta...');
    
    // Load route data
    const routeResponse = await fetch('assets/data/optimized_route.json');
    if (!routeResponse.ok) {
      throw new Error('No se pudo cargar la ruta optimizada');
    }
    routeData = await routeResponse.json();
    
    // Load tourism points
    const tourismResponse = await fetch('assets/data/italian_tourism_points.json');
    if (!tourismResponse.ok) {
      throw new Error('No se pudieron cargar los puntos turísticos');
    }
    tourismPoints = await tourismResponse.json();
    
    console.log('✅ Datos cargados correctamente');
    console.log(`📍 ${routeData.route_info.total_cities} ciudades`);
    console.log(`🏛️ ${Object.keys(tourismPoints.cities).length} ciudades con puntos de interés`);
    
    // Populate route path
    populateRoutePath();
    
    // Populate cities grid
    populateCitiesGrid();
    
    // Initialize map
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
    } else {
      console.warn('⚠️ Google Maps API no disponible, mostrando mapa de respaldo');
      showMapFallback();
    }
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    showError('No se pudieron cargar los datos de la ruta. Por favor, recarga la página.');
  }
}

// Initialize Google Maps
function initMap() {
  try {
    console.log('🗺️ Inicializando Google Maps...');
    
    const mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, CONFIG.mapOptions);
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: CONFIG.routeColor || '#0066CC',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });
    directionsRenderer.setMap(map);
    
    // Add markers for cities and points of interest
    addMapMarkers();
    
    // Initialize map controls
    initMapControls();
    
    console.log('✅ Mapa inicializado correctamente');
    
  } catch (error) {
    console.error('❌ Error inicializando mapa:', error);
    showMapFallback();
  }
}

// Add markers to the map
function addMapMarkers() {
  if (!routeData || !tourismPoints) return;

  // Clear existing markers
  clearMarkers();

  // Add city markers
  routeData.route_sequence.forEach((city, index) => {
    const marker = new google.maps.Marker({
      position: { lat: city.coordinates.latitude, lng: city.coordinates.longitude },
      map: map,
      title: city.city_name,
      icon: {
        url: createMarkerIcon(POINT_COLORS.city, index + 1),
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: createCityInfoWindow(city, index + 1)
    });

    marker.addListener('click', () => {
      closeAllInfoWindows();
      infoWindow.open(map, marker);
    });

    markers.push({ marker, infoWindow, type: 'city' });
  });

  // Add tourism points
  Object.keys(tourismPoints.cities).forEach(cityName => {
    const cityPoints = tourismPoints.cities[cityName];
    
    ['monuments', 'nature', 'food'].forEach(category => {
      if (cityPoints[category]) {
        cityPoints[category].forEach(point => {
          const marker = new google.maps.Marker({
            position: { lat: point.coordinates.latitude, lng: point.coordinates.longitude },
            map: map,
            title: point.name,
            icon: {
              url: createMarkerIcon(POINT_COLORS[category === 'monuments' ? 'monument' : category]),
              scaledSize: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 30)
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: createPointInfoWindow(point, category)
          });

          marker.addListener('click', () => {
            closeAllInfoWindows();
            infoWindow.open(map, marker);
          });

          markers.push({ marker, infoWindow, type: category });
        });
      }
    });
  });

  // Enable clustering by default
  enableClustering();
}

// Create marker icon
function createMarkerIcon(color, number = null) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 40;
  canvas.height = 40;

  // Draw circle
  context.beginPath();
  context.arc(20, 20, 18, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = '#fff';
  context.lineWidth = 3;
  context.stroke();

  // Draw number if provided
  if (number) {
    context.fillStyle = '#fff';
    context.font = 'bold 14px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), 20, 20);
  }

  return canvas.toDataURL();
}

// Create info window content for cities
function createCityInfoWindow(city, sequence) {
  return `
    <div style="max-width: 300px; font-family: 'Inter', sans-serif;">
      <h3 style="margin: 0 0 10px 0; color: #0066CC; font-size: 18px;">
        ${sequence}. ${city.city_name}
      </h3>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">
        <strong>Coordenadas:</strong> ${city.coordinates.latitude.toFixed(4)}°, ${city.coordinates.longitude.toFixed(4)}°
      </p>
      ${city.distance_from_previous_km > 0 ? `
        <p style="margin: 5px 0; font-size: 14px; color: #666;">
          <strong>Distancia desde anterior:</strong> ${city.distance_from_previous_km} km
        </p>
      ` : ''}
      <p style="margin: 5px 0; font-size: 14px; color: #666;">
        <strong>Distancia acumulada:</strong> ${city.cumulative_distance_km} km
      </p>
    </div>
  `;
}

// Create info window content for points of interest
function createPointInfoWindow(point, category) {
  const categoryNames = {
    monuments: 'Monumento Histórico',
    nature: 'Paisaje Natural',
    food: 'Lugar Gastronómico'
  };

  const categoryIcons = {
    monuments: '🏛️',
    nature: '🌿',
    food: '🍝'
  };

  return `
    <div style="max-width: 300px; font-family: 'Inter', sans-serif;">
      <h3 style="margin: 0 0 10px 0; color: ${POINT_COLORS[category === 'monuments' ? 'monument' : category]}; font-size: 16px;">
        ${categoryIcons[category]} ${point.name}
      </h3>
      <p style="margin: 5px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">
        ${categoryNames[category]}
      </p>
      <p style="margin: 5px 0; font-size: 14px; color: #333; line-height: 1.4;">
        ${point.description}
      </p>
      <p style="margin: 5px 0; font-size: 12px; color: #666;">
        <strong>Ubicación:</strong> ${point.coordinates.latitude.toFixed(4)}°, ${point.coordinates.longitude.toFixed(4)}°
      </p>
    </div>
  `;
}

// Map controls
function initMapControls() {
  // Show all button
  document.getElementById('show-all-btn').addEventListener('click', showAllMarkers);
  
  // Toggle clusters button
  document.getElementById('toggle-clusters-btn').addEventListener('click', toggleClustering);
  
  // Show route button
  document.getElementById('show-route-btn').addEventListener('click', toggleRoute);
}

function showAllMarkers() {
  if (!map || markers.length === 0) return;

  const bounds = new google.maps.LatLngBounds();
  markers.forEach(item => {
    bounds.extend(item.marker.getPosition());
  });
  
  map.fitBounds(bounds);
  
  // Add some padding
  setTimeout(() => {
    const currentZoom = map.getZoom();
    if (currentZoom > 12) {
      map.setZoom(12);
    }
  }, 100);
}

function toggleClustering() {
  clustersEnabled = !clustersEnabled;
  const btn = document.getElementById('toggle-clusters-btn');
  
  if (clustersEnabled) {
    enableClustering();
    btn.innerHTML = '<i class="fas fa-layer-group"></i> Desagrupar';
  } else {
    disableClustering();
    btn.innerHTML = '<i class="fas fa-layer-group"></i> Agrupar Marcadores';
  }
}

function enableClustering() {
  if (typeof MarkerClusterer !== 'undefined' && markers.length > 0) {
    const markerList = markers.map(item => item.marker);
    markerCluster = new MarkerClusterer(map, markerList, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      maxZoom: 15,
      gridSize: 50
    });
  }
}

function disableClustering() {
  if (markerCluster) {
    markerCluster.clearMarkers();
    markerCluster = null;
  }
}

function toggleRoute() {
  // Implementation for showing/hiding route would go here
  // This would use DirectionsService to show the route between cities
  console.log('🛣️ Toggle route functionality');
}

// Utility functions
function clearMarkers() {
  markers.forEach(item => {
    item.marker.setMap(null);
  });
  markers = [];
  
  if (markerCluster) {
    markerCluster.clearMarkers();
    markerCluster = null;
  }
}

function closeAllInfoWindows() {
  markers.forEach(item => {
    item.infoWindow.close();
  });
}

function showMapFallback() {
  const mapElement = document.getElementById('map');
  const fallbackElement = document.getElementById('map-fallback');
  
  mapElement.style.display = 'none';
  fallbackElement.style.display = 'flex';
}

// Populate route path
function populateRoutePath() {
  if (!routeData) return;

  const routePath = document.getElementById('route-path');
  const mainCities = ['Treviso', 'Firenze', 'La Spezia', 'Siena', 'Assisi'];
  
  let pathHTML = '';
  
  routeData.route_sequence.forEach((city, index) => {
    const isMainCity = mainCities.includes(city.city_name);
    const cityClass = isMainCity ? 'route-city main-city' : 'route-city';
    
    pathHTML += `<span class="${cityClass}" data-city="${city.city_name}">${city.city_name}</span>`;
    
    if (index < routeData.route_sequence.length - 1) {
      pathHTML += '<span class="route-arrow">→</span>';
    }
  });
  
  routePath.innerHTML = pathHTML;

  // Add click handlers for route cities
  routePath.querySelectorAll('.route-city').forEach(cityElement => {
    cityElement.addEventListener('click', function() {
      const cityName = this.dataset.city;
      scrollToCityCard(cityName);
    });
  });
}

// Populate cities grid
function populateCitiesGrid() {
  if (!routeData || !tourismPoints) return;

  const citiesGrid = document.getElementById('cities-grid');
  let citiesHTML = '';

  routeData.route_sequence.forEach((city, index) => {
    const cityPoints = tourismPoints.cities[city.city_name];
    
    if (cityPoints) {
      citiesHTML += createCityCard(city, cityPoints, index + 1);
    }
  });

  citiesGrid.innerHTML = citiesHTML;

  // Add click handlers for city cards
  citiesGrid.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', function() {
      const cityName = this.dataset.city;
      focusOnCity(cityName);
    });
  });
}

// Create city card HTML
function createCityCard(city, cityPoints, sequence) {
  const monuments = cityPoints.monuments || [];
  const nature = cityPoints.nature || [];
  const food = cityPoints.food || [];

  return `
    <div class="city-card" data-city="${city.city_name}">
      <div class="city-header">
        <div class="city-sequence">${sequence}</div>
        <h3 class="city-title">${city.city_name}</h3>
      </div>
      <div class="city-content">
        <div class="city-info">
          <div><strong>Región:</strong> ${getRegionForCity(city.city_name)}</div>
          <div><strong>Coordenadas:</strong> ${city.coordinates.latitude.toFixed(3)}°, ${city.coordinates.longitude.toFixed(3)}°</div>
          ${city.distance_from_previous_km > 0 ? `<div><strong>Desde anterior:</strong> ${city.distance_from_previous_km} km</div>` : ''}
          <div><strong>Acumulado:</strong> ${city.cumulative_distance_km} km</div>
        </div>
        
        ${monuments.length > 0 ? `
          <div class="city-points">
            <h4><i class="fas fa-monument"></i> Monumentos Históricos</h4>
            <div class="points-list">
              ${monuments.slice(0, 3).map(point => `
                <div class="point-item">
                  <div class="point-icon monument">🏛️</div>
                  <span>${point.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${nature.length > 0 ? `
          <div class="city-points">
            <h4><i class="fas fa-tree"></i> Paisajes Naturales</h4>
            <div class="points-list">
              ${nature.slice(0, 2).map(point => `
                <div class="point-item">
                  <div class="point-icon nature">🌿</div>
                  <span>${point.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${food.length > 0 ? `
          <div class="city-points">
            <h4><i class="fas fa-utensils"></i> Lugares Gastronómicos</h4>
            <div class="points-list">
              ${food.slice(0, 3).map(point => `
                <div class="point-item">
                  <div class="point-icon food">🍝</div>
                  <span>${point.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Helper functions
function getRegionForCity(cityName) {
  const regions = {
    'Treviso': 'Veneto',
    'Venezia': 'Veneto',
    'Bologna': 'Emilia-Romagna',
    'Pistoia': 'Toscana',
    'San Gimignano': 'Toscana',
    'Lucca': 'Toscana',
    'Monteriggioni': 'Toscana',
    'Pisa': 'Toscana',
    'Bagno Maurizio': 'Toscana',
    'Firenze': 'Toscana',
    'Viareggio': 'Toscana',
    'Cinque Terre': 'Liguria',
    'La Spezia': 'Liguria',
    'Montalcino': 'Toscana',
    "Val d'Orcia (San Quirico d'Orcia)": 'Toscana',
    'Siena': 'Toscana',
    'Cortona': 'Toscana',
    'Assisi': 'Umbria'
  };
  
  return regions[cityName] || 'Italia';
}

function scrollToCityCard(cityName) {
  const cityCard = document.querySelector(`[data-city="${cityName}"]`);
  if (cityCard) {
    cityCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight the card temporarily
    cityCard.style.transform = 'scale(1.02)';
    cityCard.style.boxShadow = '0 20px 40px rgba(0, 102, 204, 0.3)';
    
    setTimeout(() => {
      cityCard.style.transform = '';
      cityCard.style.boxShadow = '';
    }, 2000);
  }
}

function focusOnCity(cityName) {
  if (!map || !routeData) return;

  const city = routeData.route_sequence.find(c => c.city_name === cityName);
  if (city) {
    map.setCenter({ lat: city.coordinates.latitude, lng: city.coordinates.longitude });
    map.setZoom(13);
  }
}

function showError(message) {
  console.error('❌ Error:', message);
  
  // Show error in UI
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: 'Inter', sans-serif;
  `;
  errorDiv.innerHTML = `
    <strong>Error:</strong> ${message}
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: white;
      float: right;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
    ">×</button>
  `;
  
  document.body.appendChild(errorDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Export functions for global access
window.initMap = initMap;
window.showAllMarkers = showAllMarkers;
window.toggleClustering = toggleClustering;
window.toggleRoute = toggleRoute;

console.log('🚀 Aplicación Ruta Turística Italia cargada');
