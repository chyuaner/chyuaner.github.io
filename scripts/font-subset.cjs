
const fs = require('fs/promises');
const path = require('path');
const glob = require('glob');
const subsetFont = require('subset-font');

const crypto = require('crypto');

const DIST_DIR = 'dist';
const FONTS_DIR = 'public/fonts';
const OUTPUT_FONTS_DIR = 'dist/fonts';

// Configuration for multiple fonts
const FONTS = [
    {
        src: 'jf-openhuninn-2.1.ttf',
        baseDest: 'jf-openhuninn-2.1'
    }
];

async function scanHtmlForCharacters() {
    const htmlFiles = glob.sync(`${DIST_DIR}/**/*.html`);
    const characters = new Set();

    const defaults = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{};':\",./<>?`~";
    for (const char of defaults) {
        characters.add(char);
    }

    console.log(`Scanning ${htmlFiles.length} HTML files...`);

    for (const file of htmlFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const textContent = content.replace(/<[^>]*>/g, ' '); 
        
        for (const char of textContent) {
            if (!characters.has(char) && !/\s/.test(char)) {
                characters.add(char);
            }
        }
    }

    return Array.from(characters).join('');
}

async function createSubsets(text) {
    console.log(`Unique characters found: ${text.length}`);
    
    await fs.mkdir(OUTPUT_FONTS_DIR, { recursive: true });

    for (const fontConfig of FONTS) {
        try {
            console.log(`Processing font: ${fontConfig.src}`);
            const fontPath = path.join(FONTS_DIR, fontConfig.src);
            
            try {
                await fs.access(fontPath);
            } catch (e) {
                console.warn(`Warning: Source font not found at ${fontPath}, skipping.`);
                continue;
            }

            const fontbuffer = await fs.readFile(fontPath);
            
            const subsetBuffer = await subsetFont(fontbuffer, text, {
                targetFormat: 'woff2',
            });

            // Calculate hash from subset buffer
            const hash = crypto.createHash('md5').update(subsetBuffer).digest('hex').slice(0, 8);
            fontConfig.dest = `${fontConfig.baseDest}.${hash}.woff2`;

            const outputPath = path.join(OUTPUT_FONTS_DIR, fontConfig.dest);
            await fs.writeFile(outputPath, subsetBuffer);
            
            console.log(`✓ Created subset: ${fontConfig.dest}`);
            console.log(`  Original: ${(fontbuffer.length / 1024 / 1024).toFixed(2)} MB`);
            console.log(`  Subset: ${(subsetBuffer.length / 1024).toFixed(2)} KB`);
            
        } catch (err) {
            console.error(`Error processing font ${fontConfig.src}:`, err);
        }
    }
}

async function updateCssReferences() {
    const cssFiles = glob.sync(`${DIST_DIR}/_astro/*.css`);
    
    for (const file of cssFiles) {
        let content = await fs.readFile(file, 'utf-8');
        let fileChanged = false;

        for (const fontConfig of FONTS) {
            if (!fontConfig.dest) continue;

            const srcName = fontConfig.src;
            const destName = fontConfig.dest;

            if (content.includes(srcName)) {
                 const regex = new RegExp(`url\\((['"]?)/fonts/${srcName.replace(/\./g, '\\.')}\\1\\)\\s*format\\("truetype"\\)`, 'g');
                 
                 if (regex.test(content)) {
                     const newContent = content.replace(regex, `url("/fonts/${destName}") format("woff2")`);
                     if (content !== newContent) {
                        content = newContent;
                        fileChanged = true;
                        console.log(`Updated reference: ${srcName} -> ${destName}`);
                     }
                 }
            }
        }

        if (fileChanged) {
            await fs.writeFile(file, content, 'utf-8');
            console.log(`Saved CSS file: ${file}`);
        }
    }
}

async function main() {
    try {
        const text = await scanHtmlForCharacters();
        if (text.length === 0) {
            console.log("No characters found to subset.");
            return;
        }
        await createSubsets(text);
        await updateCssReferences();
        console.log("All font operations complete!");
    } catch (err) {
        console.error("Fatal error during font subsetting:", err);
        process.exit(1);
    }
}

main();
