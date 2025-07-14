import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchBookmarkTitle(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    return $('title').text().trim() || null;
  } catch (err) {
    console.warn('Failed to fetch title:', err);
    return null;
  }
}
