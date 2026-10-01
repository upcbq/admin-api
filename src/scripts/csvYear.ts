import { Reference, parseVerses } from '@shared/utilities/verseParser';
import fs from 'fs';
import path from 'path';
import '@/config/db';
import { IVerseList, IVerseListJson, IVerseListVerseJson } from '@shared/verseList.model';
import VerseList from '@/apiV1/verse-list/verseList.model';
import { IReference } from '@shared/types/reference';

export function displayBook(book: string) {
  return book
    .split('-')
    .map((s) => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`)
    .join(' ');
}

export function referenceToString(ref: IReference) {
  return `${displayBook(ref.book)} ${ref.chapter}:${ref.verse}`;
}

(async () => {
  try {
    const argYear = process.argv[2];

    const results = await VerseList.find({ year: +argYear, organization: 'upci' });
    let result = 'Beginner,Junior,Intermediate,Experienced';
    const maxLen = Math.max(...results.map((r) => r.verses.length));
    const vls = results.reduce(
      (arr, vl) => {
        const index = ['beginner', 'junior', 'intermediate', 'experienced'].indexOf(vl.division);
        arr[index] = vl;
        return arr;
      },
      [undefined, undefined, undefined, undefined] as [
        IVerseList | undefined,
        IVerseList | undefined,
        IVerseList | undefined,
        IVerseList | undefined,
      ],
    );
    for (let i = 0; i < maxLen; i++) {
      result += `\n${vls.map((vl) => (vl?.verses[i] ? referenceToString(vl.verses[i]) : '')).join(',')}`;
    }
    console.log(result);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();
