import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const items = [
  "Ahrim%27s_staff", "Ahrim%27s_wand", "Ahrim%27s_book_of_magic", "Ahrim%27s_hood", "Ahrim%27s_robe_top", "Ahrim%27s_robe_skirt",
  "Dharok%27s_greataxe", "Dharok%27s_helm", "Dharok%27s_platebody", "Dharok%27s_platelegs",
  "Guthan%27s_warspear", "Guthan%27s_helm", "Guthan%27s_platebody", "Guthan%27s_chainskirt",
  "Karil%27s_crossbow", "Karil%27s_pistol_crossbow", "Karil%27s_off-hand_pistol_crossbow", "Karil%27s_coif", "Karil%27s_top", "Karil%27s_skirt",
  "Torag%27s_hammer", "Torag%27s_helm", "Torag%27s_platebody", "Torag%27s_platelegs",
  "Verac%27s_flail", "Verac%27s_helm", "Verac%27s_brassard", "Verac%27s_plateskirt",
  "Linza%27s_helm", "Linza%27s_cuirass", "Linza%27s_greaves", "Linza%27s_hammer", "Linza%27s_shield",
  "Amulet_of_the_forsaken", "Corruption_sigil"
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