/**
 * @fileoverview Bird media API service.
 * Fetches bird images from Wikipedia and audio recordings from Wikimedia Commons.
 * Uses native fetch to avoid external dependencies.
 */

/** In-session cache to prevent repeated API calls for the same species. */
const mediaCache: Record<string, { imageUrl?: string; audioUrl?: string }> = {};

const HEADERS = { 'User-Agent': 'AvisApp/1.0 (contact: dev@avis.local)' };

/**
 * Fetches the main image for a bird from Wikipedia (Wikimedia Commons API).
 *
 * @param scientificName - The biological name of the bird (e.g. "Ciconia ciconia").
 * @returns A URL string to the image thumbnail, or undefined if not found.
 */
export const fetchBirdImage = async (scientificName: string): Promise<string | undefined> => {
    if (!scientificName) return undefined;
    if (mediaCache[scientificName]?.imageUrl) return mediaCache[scientificName].imageUrl;

    try {
        const url =
            `https://en.wikipedia.org/w/api.php` +
            `?action=query&titles=${encodeURIComponent(scientificName)}` +
            `&prop=pageimages&format=json&pithumbsize=800&redirects=1&origin=*`;

        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) return undefined;

        const data = await response.json();
        const pages = data?.query?.pages as Record<string, { thumbnail?: { source?: string } }> | undefined;

        if (pages) {
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId]?.thumbnail?.source;
            if (imageUrl) {
                mediaCache[scientificName] = { ...mediaCache[scientificName], imageUrl };
                return imageUrl;
            }
        }
    } catch (error) {
        console.warn(`Could not fetch image for ${scientificName} from Wikipedia:`, error);
    }
    return undefined;
};

/**
 * Fetches a bird song audio file from Wikimedia Commons.
 *
 * @param scientificName - The biological name of the bird (e.g. "Upupa epops").
 * @returns A URL string to the audio file, or undefined if not found.
 */
export const fetchBirdAudio = async (scientificName: string): Promise<string | undefined> => {
    if (!scientificName) return undefined;
    if (mediaCache[scientificName]?.audioUrl) return mediaCache[scientificName].audioUrl;

    try {
        const searchQuery = encodeURIComponent(`${scientificName} filetype:audio`);
        const url =
            `https://commons.wikimedia.org/w/api.php` +
            `?action=query&generator=search&gsrsearch=${searchQuery}` +
            `&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;

        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) return undefined;

        const data = await response.json();
        const pages = data?.query?.pages as Record<string, { imageinfo?: Array<{ url?: string }> }> | undefined;

        if (pages) {
            const pageId = Object.keys(pages)[0];
            const audioUrl = pages[pageId]?.imageinfo?.[0]?.url;
            if (audioUrl) {
                mediaCache[scientificName] = { ...mediaCache[scientificName], audioUrl };
                return audioUrl;
            }
        }
    } catch (error) {
        console.warn(`Could not fetch audio for ${scientificName} from Wikimedia Commons:`, error);
    }
    return undefined;
};
