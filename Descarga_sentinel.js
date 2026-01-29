//Docente Edwin Calle Condori
// Selección y carga de imagen Sentinel 2 Nivel-2A con todas las bandas
var imagen = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterDate('2025-01-01', '2025-06-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .filterBounds(region)
  .median()
  .reproject({crs: 'EPSG:4326', scale: 10});

print(imagen);
Map.addLayer(imagen);
Map.addLayer(region, {color: "red"});

var imagenClip = imagen.clip(region);

// Parámetros de visualización de la imagen en falso color natural
var paramsVisual = {bands: ['B4', 'B3', 'B2'], min: 1000, max: 5000, gamma: 2.1};

// Despliegue de la imagen Sentinel 2
Map.addLayer(imagenClip, paramsVisual, 'Sentinel 2 Nivel-2A - Color Natural');

// Exportar la imagen con TODAS las bandas
Export.image.toDrive({
  image: imagenClip, // Exportamos la imagen completa con todas las bandas
  description: 'sentinel_todas_bandas', 
  folder: 'GEE_export_RF', 
  fileNamePrefix: 'Sentinel2_todas_bandas', 
  region: region, 
  scale: 10, 
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// Información sobre las bandas disponibles
print('Bandas disponibles en la imagen:', imagenClip.bandNames());
print('Número de bandas:', imagenClip.bandNames().size());

// Visualización adicional con diferentes combinaciones de bandas
// Falso color 1: Infrarrojo color (B8, B4, B3)
var falsoColor1 = {bands: ['B8', 'B4', 'B3'], min: 1000, max: 5000, gamma: 1.5};
Map.addLayer(imagenClip, falsoColor1, 'Falso Color - Infrarrojo');

// Falso color 2: SWIR (B12, B8A, B4)
var falsoColor2 = {bands: ['B12', 'B8A', 'B4'], min: 1000, max: 5000, gamma: 1.5};
Map.addLayer(imagenClip, falsoColor2, 'Falso Color - SWIR');

// Centrar el mapa en la región de interés
Map.centerObject(region, 10);