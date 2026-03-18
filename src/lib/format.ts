/**
 * Formats gallery titles according to specific rules:
 * 1. Replaces - and _ with spaces
 * 2. Splits into words
 * 3. If a word ends with "s", length > 3, and no apostrophe: converts s -> 's
 * 4. Capitalizes each word (First letter uppercase, rest lowercase)
 */
export function formatGalleryTitle(title: string): string {
    if (!title) return '';

    // 1. Replace - and _ with spaces
    const withSpaces = title.replace(/[-_]/g, ' ');

    // 2. Split into words
    const words = withSpaces.split(/\s+/).filter(Boolean);

    // 3. Process each word
    const transformedWords = words.map((word) => {
        let newWord = word;

        // Check if word ends with 's', length > 3, and doesn't contain '\''
        // Using toLowerCase() for the check to be safe
        if (newWord.toLowerCase().endsWith('s') && newWord.length > 3 && !newWord.includes("'")) {
            // Convert s -> 's
            newWord = newWord.slice(0, -1) + "'s";
        }

        // 4. Capitalize (First letter uppercase, rest lowercase)
        if (newWord.length > 0) {
            newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
        }

        return newWord;
    });

    // 5. Join words back
    return transformedWords.join(' ');
}
