import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function crop() {
    const input = path.join(__dirname, 'public', 'assets', 'avis-logo-raw.png');
    const output = path.join(__dirname, 'public', 'assets', 'avis-logo.png');

    try {
        const metadata = await sharp(input).metadata();
        // The image is 1629x832. 
        // We want a square from the center.
        const size = Math.min(metadata.width, metadata.height);
        const left = Math.floor((metadata.width - size) / 2);
        const top = Math.floor((metadata.height - size) / 2);

        await sharp(input)
            .extract({ left, top, width: size, height: size })
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(output);
        console.log("Successfully extracted exact logo center to ", output);
    } catch (err) {
        console.error("Failed to extract:", err);
    }
}
crop();
