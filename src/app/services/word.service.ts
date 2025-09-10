import { Injectable } from '@angular/core';
import { UsedWordsCacheKey, WordListCacheKey, WordOfDayCacheKey } from '../utils/cache-helpers';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  public constructor() { }

  public async getWordList(length: number): Promise<string[]> {
    const key = WordListCacheKey(length);
    const cached = localStorage.getItem(key);

    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from API
    const url = `https://api.datamuse.com/words?sp=${'?'.repeat(length)}&max=1000`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const words: { word: string; score: number }[] = await response.json();
      const filtered = words.map(items => items.word)
        .filter(word => /^[a-z]+$/.test(word));

      localStorage.setItem(key, JSON.stringify(filtered));
      return filtered;
    }
    catch (err) {
      console.error('Failed to fetch word pool', err);
      return [];
    }
  }

  public async getWordOfDay(length: number): Promise<string> {
    const list = await this.getWordList(length);
    if (list.length === 0) {
      throw new Error('Unable to fetch word');
    }

    const dayKey = WordOfDayCacheKey(length);

    let hash = 0;
    for (let i = 0; i < dayKey.length; i++) {
      hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
    }
    let index = hash % list.length;

    // Ensure no word repeats
    const usedKey = UsedWordsCacheKey(length);
    const used: string[] = JSON.parse(localStorage.getItem(usedKey) || '[]');
    let word = list[index];
    let attempts = 0;

    while (used.includes(word) && attempts < list.length) {
      index = (index + 1) % list.length;
      word = list[index];
      attempts++;
    }

    // Save todays word to localStorage
    localStorage.setItem(dayKey, word);
    used.push(word);
    localStorage.setItem(usedKey, JSON.stringify(used));

    return word;
  }

  public async isValidWord(word: string): Promise<boolean> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
      const response = await fetch(url);
      return response.ok;
    }
    catch {
      return false;
    }
  }
}
