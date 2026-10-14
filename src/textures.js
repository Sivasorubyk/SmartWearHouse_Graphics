import * as THREE from 'three';

function canvasTexture(draw, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  draw(ctx, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function concreteTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#687178'; ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2500; i++) {
      const v = 85 + Math.random() * 55;
      ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * .15})`;
      ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2);
    }
    ctx.strokeStyle = 'rgba(30,40,45,.35)'; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size-2, size-2);
  }, 8, 8);
}

export function cardboardTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#a76f3d'; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#c59a63'; ctx.fillRect(112, 0, 32, size);
    ctx.strokeStyle = '#70451f'; ctx.lineWidth = 3; ctx.strokeRect(2, 2, size-4, size-4);
    ctx.fillStyle = '#5e3b20'; ctx.font = 'bold 20px sans-serif'; ctx.fillText('FRAGILE', 70, 145);
    ctx.strokeRect(76, 156, 104, 38);
  });
}

export function warningTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#f4c430'; ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#101820'; ctx.lineWidth = 30;
    for (let x=-size; x<size*2; x+=80) { ctx.beginPath(); ctx.moveTo(x, size); ctx.lineTo(x+size, 0); ctx.stroke(); }
  }, 10, 1);
}
