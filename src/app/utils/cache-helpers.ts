export function WordListCacheKey(length: number): string {
    return `wordList_${length}`;
}

export function UsedWordsCacheKey(length: number): string {
    return `usedWords_${length}`;
}

export function WordOfDayCacheKey(length: number): string {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();
    const utcDateStr = `${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${length}`;

    return utcDateStr;
}