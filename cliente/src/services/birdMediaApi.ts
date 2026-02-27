import axios from 'axios';

// Cache responses to prevent spamming public APIs during a session
const mediaCache: { [scientificName: string]: { imageUrl?: string; audioUrl?: string } } = {};

/**
 * Fetches the main image for a bird from Wikimedia Commons API using its scientific name.
 * Uses the English Wikipedia endpoint as it has the largest taxonomy database.
 * 
 * @param scientificName The biological name of the bird (e.g. "Ciconia ciconia")
 * @returns A URL string to the image or undefined if not found.
 */
export const fetchBirdImage = async (scientificName: string): Promise<string | undefined> => {
    if (!scientificName) return undefined;
    if (mediaCache[scientificName]?.imageUrl) return mediaCache[scientificName].imageUrl;

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(scientificName)}&prop=pageimages&format=json&pithumbsize=800&redirects=1&origin=*`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'AeryApp/1.0 (Contact: local-dev@example.com)'
            }
        });

        const pages = response.data?.query?.pages;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId]?.thumbnail?.source;
            if (imageUrl) {
                mediaCache[scientificName] = { ...mediaCache[scientificName], imageUrl };
                return imageUrl;
            }
        }
    } catch (error) {
        console.warn(`Could not fetch image for ${scientificName} from Wikipedia`, error);
    }
    return undefined;
};

/**
 * Fetches the top-rated audio recording for a bird from the Xeno-canto API.
 * 
 * @param scientificName The biological name of the bird (e.g. "Upupa epops")
 * @returns A URL string to the audio file or undefined if not found.
 */
export const fetchBirdAudio = async (scientificName: string): Promise<string | undefined> => {
    if (!scientificName) return undefined;
    if (mediaCache[scientificName]?.audioUrl) return mediaCache[scientificName].audioUrl;

    try {
        // Search Wikimedia Commons for audio files matching the scientific name
        const searchQuery = encodeURIComponent(`${scientificName} filetype:audio`);
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchQuery}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'AeryApp/1.0 (Contact: local-dev@example.com)' }
        });

        const pages = response.data?.query?.pages;
        if (pages) {
            // Get the first result's URL
            const pageId = Object.keys(pages)[0];
            const audioUrl = pages[pageId]?.imageinfo?.[0]?.url;
            if (audioUrl) {
                mediaCache[scientificName] = { ...mediaCache[scientificName], audioUrl };
                return audioUrl;
            }
        }
    } catch (error) {
        console.warn(`Could not fetch audio for ${scientificName} from Wikimedia Commons`, error);
    }

    // Fallback if not found
    return undefined;
};
