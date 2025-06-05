#!/bin/bash

# 🇮🇹 Setup Script para Ruta Turística por Italia (HTML Version)
# Script de configuración rápida

echo "🇮🇹 =============================================="
echo "   Ruta Turística por Italia - Setup HTML"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html"
    echo "   Asegúrate de ejecutar este script desde el directorio ruta-italia-html"
    exit 1
fi

echo "✅ Directorio correcto detectado"

# Verificar archivos críticos
echo "🔍 Verificando archivos críticos..."

CRITICAL_FILES=(
    "index.html"
    "config.html"
    "assets/css/styles.css"
    "assets/js/main.js"
    "assets/data/optimized_route.json"
    "assets/data/italian_tourism_points.json"
    "assets/kml/italian_route_google_maps.kml"
    "assets/kml/italian_route_google_earth.kml"
    "README.md"
)

ALL_FILES_OK=true

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTANTE"
        ALL_FILES_OK=false
    fi
done

if [ "$ALL_FILES_OK" = false ]; then
    echo ""
    echo "❌ Algunos archivos críticos están faltando."
    echo "   Por favor, verifica la integridad del proyecto."
    exit 1
fi

echo ""
echo "✅ Todos los archivos críticos están presentes"

# Verificar estructura de datos
echo ""
echo "📊 Verificando integridad de datos..."

if [ -f "assets/data/optimized_route.json" ]; then
    CITIES_COUNT=$(grep -o '"sequence"' assets/data/optimized_route.json | wc -l)
    echo "✅ Ruta optimizada: $CITIES_COUNT ciudades"
else
    echo "❌ Archivo de ruta no encontrado"
fi

if [ -f "assets/data/italian_tourism_points.json" ]; then
    POINTS_COUNT=$(grep -o '"name"' assets/data/italian_tourism_points.json | wc -l)
    echo "✅ Puntos de interés: $POINTS_COUNT ubicaciones"
else
    echo "❌ Archivo de puntos turísticos no encontrado"
fi

# Verificar archivos KML
KML_MAPS_SIZE=$(du -h assets/kml/italian_route_google_maps.kml 2>/dev/null | cut -f1)
KML_EARTH_SIZE=$(du -h assets/kml/italian_route_google_earth.kml 2>/dev/null | cut -f1)

if [ ! -z "$KML_MAPS_SIZE" ]; then
    echo "✅ KML Google Maps: $KML_MAPS_SIZE"
else
    echo "❌ KML Google Maps no encontrado"
fi

if [ ! -z "$KML_EARTH_SIZE" ]; then
    echo "✅ KML Google Earth: $KML_EARTH_SIZE"
else
    echo "❌ KML Google Earth no encontrado"
fi

echo ""
echo "🌐 Opciones para ejecutar la aplicación:"
echo ""

# Detectar herramientas disponibles
PYTHON_AVAILABLE=false
NODE_AVAILABLE=false
PHP_AVAILABLE=false

if command -v python3 &> /dev/null; then
    PYTHON_AVAILABLE=true
    echo "1️⃣  Servidor Python (Recomendado):"
    echo "   python3 -m http.server 8000"
    echo "   Luego abre: http://localhost:8000"
    echo ""
fi

if command -v node &> /dev/null || command -v npx &> /dev/null; then
    NODE_AVAILABLE=true
    echo "2️⃣  Servidor Node.js:"
    echo "   npx http-server -p 8000"
    echo "   Luego abre: http://localhost:8000"
    echo ""
fi

if command -v php &> /dev/null; then
    PHP_AVAILABLE=true
    echo "3️⃣  Servidor PHP:"
    echo "   php -S localhost:8000"
    echo "   Luego abre: http://localhost:8000"
    echo ""
fi

echo "4️⃣  Abrir directamente (Funcionalidad limitada):"
case "$(uname -s)" in
    Darwin*)
        echo "   open index.html"
        ;;
    Linux*)
        echo "   xdg-open index.html"
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        echo "   start index.html"
        ;;
    *)
        echo "   Abre index.html en tu navegador"
        ;;
esac

echo ""
echo "📝 Próximos pasos recomendados:"
echo ""
echo "1. Ejecuta un servidor local (opciones arriba)"
echo "2. Ve a http://localhost:8000/config.html para configurar Google Maps"
echo "3. Luego abre http://localhost:8000 para usar la aplicación"
echo ""

# Preguntar si quiere iniciar servidor automáticamente
echo "¿Quieres iniciar un servidor automáticamente? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    if [ "$PYTHON_AVAILABLE" = true ]; then
        echo "🚀 Iniciando servidor Python en puerto 8000..."
        echo "   Abre tu navegador en: http://localhost:8000"
        echo "   Presiona Ctrl+C para detener el servidor"
        echo ""
        python3 -m http.server 8000
    elif [ "$NODE_AVAILABLE" = true ]; then
        echo "🚀 Iniciando servidor Node.js en puerto 8000..."
        echo "   Abre tu navegador en: http://localhost:8000"
        echo "   Presiona Ctrl+C para detener el servidor"
        echo ""
        npx http-server -p 8000
    elif [ "$PHP_AVAILABLE" = true ]; then
        echo "🚀 Iniciando servidor PHP en puerto 8000..."
        echo "   Abre tu navegador en: http://localhost:8000"
        echo "   Presiona Ctrl+C para detener el servidor"
        echo ""
        php -S localhost:8000
    else
        echo "❌ No se encontró Python, Node.js o PHP"
        echo "   Abre index.html directamente en tu navegador"
    fi
else
    echo "👍 Perfecto. Usa cualquiera de las opciones mostradas arriba."
fi

echo ""
echo "🎉 Setup completado"
echo "🇮🇹 ¡Buon viaggio attraverso l'Italia!"
