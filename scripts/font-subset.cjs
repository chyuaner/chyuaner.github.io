
const fs = require('fs/promises');
const path = require('path');
const glob = require('glob');
const subsetFont = require('subset-font');

const DIST_DIR = 'dist';
const FONTS_DIR = 'public/fonts';
const OUTPUT_FONTS_DIR = 'dist/fonts';

// Configuration for multiple fonts
const FONTS = [
    {
        src: 'jf-openhuninn-2.1.ttf',
        dest: 'jf-openhuninn-2.1.woff2'
    }
    // Add more fonts here in the future
    // { src: 'another-font.ttf', dest: 'another-font.woff2' }
];

async function scanHtmlForCharacters() {
    const htmlFiles = glob.sync(`${DIST_DIR}/**/*.html`);
    const characters = new Set();

    // Default characters to include (e.g. English, Punctuation, Numbers)
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
    
    // Ensure output directory exists before processing any fonts
    await fs.mkdir(OUTPUT_FONTS_DIR, { recursive: true });

    for (const fontConfig of FONTS) {
        try {
            console.log(`Processing font: ${fontConfig.src}`);
            const fontPath = path.join(FONTS_DIR, fontConfig.src);
            
            // Check if source font exists
            try {
                await fs.access(fontPath);
            } catch (e) {
                console.warn(`Warning: Source font not found at ${fontPath}, skipping.`);
                continue;
            }

            // Read original font
            const fontbuffer = await fs.readFile(fontPath);
            
            // Create subset
            const subsetBuffer = await subsetFont(fontbuffer, text, {
                targetFormat: 'woff2',
            });

            // Write subset font
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
            const srcName = fontConfig.src;
            const destName = fontConfig.dest;

            // Simple check to avoid running regex if not needed
            if (content.includes(srcName)) {
                 // Regex to match: url(possible_quote/fonts/jf-openhuninn-2.1.ttfpossible_quote)(optional_space)format("truetype")
                 const regex = new RegExp(`url\\((['"]?)/fonts/${srcName}\\1\\)\\s*format\\("truetype"\\)`, 'g');
                 
                 if (regex.test(content)) {
                     const newContent = content.replace(regex, `url("/fonts/${destName}") format("woff2")`);
                     if (content !== newContent) {
                        content = newContent; // Update variable for next iteration/save
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
