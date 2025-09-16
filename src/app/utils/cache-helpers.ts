export function WordListCacheKey(length: number): string {
    return `wordList_${length}`;
}

export function UsedWordsCacheKey(length: number): string {
    return `usedWords_${length}`;
}

export function WordOfDayCacheKey(length?: number): string {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();

    let utcDateStr = `${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

    if (length !== undefined) {
        utcDateStr += length.toString();
    }

    return utcDateStr;
}

export function cleanUpWordOfDayStorage() {
    const todayPrefix = WordOfDayCacheKey();
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && /^\d{8}\d+$/.test(key) && !key.startsWith(todayPrefix)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key));
}