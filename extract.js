const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extract() {
  const input = 'c:\\kaleng\\3D_parallax_transition_zoom_1080p_202606261827-ezgif.com-video-to-webp-converter.webp';
  const outDir = 'c:\\kaleng\\kaleng\\public\\sequence';
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    const metadata = await sharp(input).metadata();
    const pages = metadata.pages || 1;
    console.log(`Total frames found: ${pages}`);

    for (let i = 0; i < pages; i++) {
      await sharp(input, { page: i })
        .toFile(path.join(outDir, `frame_${(i + 1).toString().padStart(3, '0')}.webp`));
      if ((i + 1) % 10 === 0) {
        console.log(`Extracted ${i + 1} frames...`);
      }
    }
    console.log('Extraction complete!');
  } catch (err) {
    console.error('Error extracting frames:', err);
  }
}

extract();
