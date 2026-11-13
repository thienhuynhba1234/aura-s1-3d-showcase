import * as THREE from 'three';

let cachedBrushedMap = null;
let cachedLeatherMap = null;
let cachedGrilleMap = null;

/**
 * Generates an offscreen CanvasTexture simulating fine brushed anodized aluminum.
 * Runs synchronously in memory with zero external network dependencies.
 */
export function getBrushedMetalTexture() {
  if (cachedBrushedMap) return cachedBrushedMap;
  if (typeof document === 'undefined') return null;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y++) {
    const shade = 115 + Math.floor(Math.random() * 28);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, size, 1);
  }

  for (let i = 0; i < 420; i++) {
    const y = Math.random() * size;
    const x = Math.random() * size;
    const len = 24 + Math.random() * 90;
    const alpha = 0.06 + Math.random() * 0.1;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  cachedBrushedMap = texture;
  return texture;
}

/**
 * Generates an offscreen CanvasTexture simulating fine lambskin leather grain.
 */
export function getLeatherGrainTexture() {
  if (cachedLeatherMap) return cachedLeatherMap;
  if (typeof document === 'undefined') return null;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#828282';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 3600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.8 + Math.random() * 1.9;
    const tone = Math.random() > 0.45 ? 148 : 108;
    ctx.fillStyle = `rgba(${tone},${tone},${tone},0.28)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  cachedLeatherMap = texture;
  return texture;
}

/**
 * Generates an acoustic micro-perforated grille bump/roughness pattern.
 */
export function getAcousticGrilleTexture() {
  if (cachedGrilleMap) return cachedGrilleMap;
  if (typeof document === 'undefined') return null;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b4b4b4';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#363636';
  const step = 8;
  for (let y = 0; y < size; y += step) {
    const offset = (y / step) % 2 === 0 ? 0 : step / 2;
    for (let x = 0; x < size; x += step) {
      ctx.beginPath();
      ctx.arc((x + offset) % size, y + step / 2, 1.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  cachedGrilleMap = texture;
  return texture;
}
