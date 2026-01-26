import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const items = [
  "Akrisae%27s_hood", "Akrisae%27s_war_mace", "Akrisae%27s_robe_top", "Akrisae%27s_robe_skirt",
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const downloadAll = async () => {
  const outputDir = path.join(__dirname, 'public', 'barrows-items');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('Created directory: public/barrows-items\n');
  }

  console.log(`Starting download of ${items.length} images...\n`);

  for (const item of items) {
    const url = `https://runescape.wiki/images/${item}.png`;
    const filename = item.replace(/%27/g, '').replace(/-/g, '_') + '.png';
    const filepath = path.join(outputDir, filename);
    
    try {
      await downloadImage(url, filepath);
      await new Promise(resolve => setTimeout(resolve, 300)); // Delay between downloads
    } catch (error) {
      console.error(`✗ Error downloading ${item}:`, error.message);
    }
  }
  
  console.log('\n✓ Download complete!');
};

downloadAll();