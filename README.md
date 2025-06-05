# 🇮🇹 Ruta Turística por Italia - Versión HTML/CSS/JavaScript

Una aplicación web simple y completa para explorar la ruta turística optimizada por Italia, construida con **HTML, CSS y JavaScript vanilla** para máxima compatibilidad y facilidad de uso.

## 🌟 **Características**

- **✅ Sin dependencias**: Solo HTML, CSS y JavaScript puro
- **🗺️ Mapa interactivo**: Integración con Google Maps API
- **📱 Totalmente responsivo**: Funciona en móviles, tablets y escritorio
- **🚀 Rápido**: Carga instantánea, sin procesos de build
- **🎨 Diseño italiano**: Inspirado en los colores de la bandera italiana
- **📍 143 puntos de interés**: Categorizados y verificados
- **🛣️ 18 ciudades optimizadas**: Ruta de 1,323.3 km total

## 🏙️ **Ruta Completa**

**Treviso** → Bologna → Venezia → Pistoia → San Gimignano → Lucca → Monteriggioni → Pisa → Bagno Maurizio → **Florencia** → Viareggio → Cinque Terre → **La Spezia** → Montalcino → Val d'Orcia → **Siena** → Cortona → **Asís**

## 🚀 **Instalación Rápida**

### **Opción 1: Usar directamente (Sin servidor local)**
```bash
# 1. Descarga o clona el proyecto
git clone [tu-repositorio] ruta-italia-html
cd ruta-italia-html

# 2. Abre index.html en tu navegador
# Windows: start index.html
# macOS: open index.html  
# Linux: xdg-open index.html
```

### **Opción 2: Con servidor local (Recomendado)**
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes npx)
npx http-server

# Con PHP
php -S localhost:8000

# Luego abre: http://localhost:8000
```

## 🔧 **Configuración Google Maps**

### **1. Obtener API Key (Opcional pero recomendado)**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita **Google Maps JavaScript API**
4. Crea una clave API
5. Edita `assets/js/main.js` línea 16:
   ```javascript
   apiKey: 'TU_CLAVE_API_AQUI',
   ```

### **2. Sin API Key**
La aplicación funciona sin API key pero con funcionalidad limitada:
- ✅ Mapa estático básico
- ✅ Marcadores y popups
- ❌ Sin clustering avanzado
- ❌ Sin rutas direccionales

## 📁 **Estructura del Proyecto**

```
ruta-italia-html/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css       # Todos los estilos
│   ├── js/
│   │   └── main.js          # JavaScript principal
│   ├── data/
│   │   ├── optimized_route.json       # Ruta optimizada
│   │   └── italian_tourism_points.json # Puntos de interés
│   ├── kml/
│   │   ├── italian_route_google_maps.kml   # Para Google Maps
│   │   └── italian_route_google_earth.kml  # Para Google Earth
│   ├── docs/
│   │   └── sugerencias_adicionales.md      # Guía de viaje
│   └── images/             # Imágenes (opcional)
├── README.md               # Esta documentación
└── config.html            # Página de configuración
```

## 🎯 **Funcionalidades Principales**

### **🗺️ Mapa Interactivo**
- **Marcadores categorizados**: 
  - 🔴 Monumentos históricos (53 puntos)
  - 🟢 Paisajes naturales (36 puntos)  
  - 🟠 Lugares gastronómicos (54 puntos)
  - 🔵 Ciudades principales (18 puntos)
- **Controles del mapa**: Zoom automático, clustering, mostrar ruta
- **Popups informativos**: Descripción detallada de cada punto

### **🏛️ Sección de Ciudades**
- **18 tarjetas interactivas** con información de cada ciudad
- **Puntos de interés organizados** por categoría
- **Click para enfocar** en el mapa
- **Información práctica**: distancias, coordenadas, región

### **📥 Descargas**
- **Archivos KML** listos para usar
- **Guía de viaje** completa en PDF
- **Instrucciones de uso** paso a paso

## 🛠️ **Personalización**

### **Colores y Estilos**
Edita `assets/css/styles.css` líneas 8-30:
```css
:root {
  --primary-color: #0066cc;    /* Color principal */
  --italy-green: #009246;      /* Verde Italia */
  --italy-red: #ce2b37;        /* Rojo Italia */
  /* ... más variables ... */
}
```

### **Añadir Nuevos Puntos**
Edita `assets/data/italian_tourism_points.json`:
```json
{
  "cities": {
    "NuevaCiudad": {
      "monuments": [
        {
          "name": "Nuevo Monumento",
          "description": "Descripción...",
          "coordinates": {
            "latitude": 45.1234,
            "longitude": 12.5678
          }
        }
      ]
    }
  }
}
```

### **Configurar Mapa**
Edita `assets/js/main.js` líneas 12-30:
```javascript
const CONFIG = {
  defaultCenter: { lat: 44.0, lng: 12.0 },
  defaultZoom: 7,
  // ... más opciones ...
};
```

## 📱 **Compatibilidad**

### **Navegadores Soportados**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Dispositivos**
- ✅ **Desktop**: 1200px+ (experiencia completa)
- ✅ **Tablet**: 768px - 1199px (layout adaptado)
- ✅ **Móvil**: 320px - 767px (diseño móvil)

## 🚀 **Despliegue**

### **GitHub Pages**
```bash
# 1. Sube tu código a GitHub
git add .
git commit -m "Add Italian route web app"
git push origin main

# 2. Ve a Settings → Pages en tu repositorio
# 3. Selecciona "Deploy from branch: main"
# 4. Tu sitio estará en: https://usuario.github.io/repositorio
```

### **Netlify**
1. Arrastra la carpeta `ruta-italia-html` a [Netlify Drop](https://app.netlify.com/drop)
2. ¡Listo! URL automática generada

### **Vercel**
```bash
# Con Vercel CLI
npm i -g vercel
cd ruta-italia-html
vercel --prod
```

### **Servidor Web Simple**
- Sube todos los archivos a tu hosting
- Asegúrate que `index.html` esté en la raíz
- Configura HTTPS si usas Google Maps API

## 🐛 **Solución de Problemas**

### **El mapa no se carga**
1. Verifica tu conexión a internet
2. Comprueba la consola del navegador (F12)
3. Verifica que tu API key de Google Maps sea válida
4. Asegúrate de servir desde un servidor (no file://)

### **Los datos no aparecen**
1. Verifica que los archivos JSON estén en `assets/data/`
2. Comprueba la consola para errores
3. Asegúrate de usar un servidor HTTP (no abrir directamente el archivo)

### **Estilos rotos**
1. Verifica que `assets/css/styles.css` exista
2. Comprueba las rutas relativas en `index.html`
3. Asegúrate de que no hay errores en el CSS

## 📚 **Recursos Adicionales**

- **Google Maps API**: [Documentación oficial](https://developers.google.com/maps/documentation/javascript)
- **KML Reference**: [Cómo usar archivos KML](https://developers.google.com/kml/documentation)
- **Guía de viaje**: Ver `assets/docs/sugerencias_adicionales.md`

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 **Licencia**

MIT License - Ve el archivo `LICENSE` para más detalles.

## 🙏 **Créditos**

- **Google Maps** por la API de mapas
- **Font Awesome** por los iconos
- **Google Fonts** por las tipografías
- **Datos turísticos** verificados con múltiples fuentes

---

**¡Disfruta explorando Italia! 🇮🇹✨**

*Buon viaggio attraverso il Bel Paese!*

## 📞 **Soporte**

Si tienes problemas:
1. Revisa esta documentación
2. Verifica la consola del navegador (F12)
3. Asegúrate de seguir los pasos de instalación
4. Abre un issue en GitHub con detalles del error

**¡La aventura italiana te espera! 🗺️🍝🏛️**
