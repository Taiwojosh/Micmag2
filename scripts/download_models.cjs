const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

async function download(url, filename) {
  console.log(`Starting fetch: ${filename} from ${url}`);
  const dest = path.join(modelsDir, filename);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
  console.log(`Successfully saved ${filename}: ${(buffer.byteLength / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  const models = [
    {
      url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb',
      name: 'sofa.glb'
    },
    {
      url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
      name: 'chair.glb'
    },
    {
      url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
      name: 'lamp.glb'
    }
  ];

  for (const m of models) {
    try {
      await download(m.url, m.name);
    } catch (e) {
      console.error(`Failed ${m.name}:`, e.message);
    }
  }
  console.log('All models finished!');
}

main();
