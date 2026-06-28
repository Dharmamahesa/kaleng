/**
 * convert-to-bocchi-sequence.js
 * Converts all 293 PNGs from c:\kaleng\sequence\ to WebP
 * Output: public/sequence/frame_000.webp ... frame_292.webp
 */
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const INPUT_DIR = path.resolve('C:\\kaleng\\sequence')
const OUTPUT_DIR = path.resolve(__dirname, 'public/sequence')

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const files = fs.readdirSync(INPUT_DIR)
  .filter(f => f.endsWith('.png'))
  .sort()

console.log(`Found ${files.length} PNG files. Converting to WebP...`)

const CONCURRENCY = 8
let idx = 0
let done = 0
const total = files.length
const startTime = Date.now()

async function convertFile(file, frameIdx) {
  const inputPath = path.join(INPUT_DIR, file)
  const paddedIdx = String(frameIdx).padStart(3, '0')
  const outputPath = path.join(OUTPUT_DIR, `frame_${paddedIdx}.webp`)

  // Skip if already converted
  if (fs.existsSync(outputPath)) {
    done++
    if (done % 30 === 0 || done === total) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`  [${done}/${total}] ${elapsed}s elapsed (skipped existing)`)
    }
    return
  }

  await sharp(inputPath)
    .webp({ quality: 80, effort: 4 })
    .toFile(outputPath)

  done++
  if (done % 30 === 0 || done === total) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`  [${done}/${total}] frame_${paddedIdx}.webp — ${elapsed}s elapsed`)
  }
}

async function runBatch() {
  const queue = files.map((file, i) => ({ file, i }))
  
  async function worker() {
    while (queue.length > 0) {
      const { file, i } = queue.shift()
      await convertFile(file, i)
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker())
  await Promise.all(workers)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✅ Done! ${total} frames converted in ${elapsed}s`)
  console.log(`📁 Output: ${OUTPUT_DIR}`)
}

runBatch().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
