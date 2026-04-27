/* Optimizar todas las imagenes 

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, '../src/assets/images');
const outputFolder = path.join(__dirname, '../src/assets/images-optimized');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdirSync(inputFolder).forEach(async (file) => {
  const inputPath = path.join(inputFolder, file);
  const ext = path.extname(file).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const fileName = path.basename(file, ext);
  const outputPath = path.join(outputFolder, `${fileName}.webp`);

  try {
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`✅ ${file} → ${fileName}.webp`);
  } catch (err) {
    console.error(`❌ Error con ${file}:`, err);
  }
});

Un fichero:

const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '../src/assets/images/hero-image.jpg');
const outputPath = path.join(__dirname, '../src/assets/images/hero-image.webp');

sharp(inputPath)
  .resize({ width: 3000 }) // ancho máximo, mantiene proporción
  .webp({ quality: 85 })
  .toFile(outputPath)
  .then(() => console.log('Hero image optimizada ✅'))
  .catch((err) => console.error('Error al optimizar hero image ❌', err));


/Una imagen

// scripts/optimize-images.js
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Ajustamos rutas para apuntar a la carpeta correcta dentro de src
const inputDir = path.join('src/assets/images/to_optimize');
const outputDir = path.join('src/assets/images');

// Asegurarse de que la carpeta de salida exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error leyendo carpeta de entrada ❌', err);
    return;
  }

  files.forEach(async (file) => {
    const inputPath = path.join(inputDir, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    // Solo procesar imágenes
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    const outputPath = path.join(outputDir, `${baseName}.webp`);

    try {
      await sharp(inputPath)
        .resize({ width: 1920 }) // opcional
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`Optimizada ✅: ${outputPath}`);
    } catch (error) {
      console.error(`Error al optimizar ${file} ❌`, error);
    }
  });
});

*/

/*Versión optimizada*/

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

//  Carpeta de entrada (originales)
const inputFolder = path.join(__dirname, '../public/to_optimize');

//  Carpeta de salida (listas para usar en la web)
const outputFolder = path.join(__dirname, '../public/images');

// Crear carpeta si no existe
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Leer archivos
const files = fs.readdirSync(inputFolder);

async function optimizeImages() {
  for (const file of files) {
    const inputPath = path.join(inputFolder, file);
    const ext = path.extname(file).toLowerCase();

    // Solo imágenes válidas
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const fileName = path.basename(file, ext);
    const outputPath = path.join(outputFolder, `${fileName}.webp`);

    try {
      await sharp(inputPath)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✅ ${file} → images/${fileName}.webp`);
    } catch (err) {
      console.error(`❌ Error con ${file}:`, err.message);
    }
  }

  console.log('🎉 Optimización completada');
}

optimizeImages();
