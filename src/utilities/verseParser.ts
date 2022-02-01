import { ORDERED_BOOKS, ChapterVerseCount } from '@/utilities/constants/bible.constants';
import Fuse from 'fuse.js';

export interface Reference {
  book: string;
  chapter: number;
  verse: number;
}
/**
 * Accepts partial verse lists in the following formats:
 * Book
 * Book.1
 * Book.1:1
 * Book.1:1-2
 * Book.1:1-3:2
 * Book.1:1-Book.1:2
 * Book.1:1,3:3,4-7,5:4-9,4-12
 */
export function parseVerses(refString: string): Reference[] {
  const verses: Reference[] = [];
  try {
    const commaSplit = refString.split(',');

    let book = '';
    let chapter: number | undefined = undefined;
    let verse: number | undefined = undefined;

    // Split on commas as either side of comma is information for a reference or range
    for (const commaSec of commaSplit) {
      const hyphenSplit = commaSec.split('-');

      const hyphenVerses: Reference[] = [];

      // Split on hyphens as either side of a hyphen is information for a reference
      for (const hyphenSec of hyphenSplit) {
        const dotSplit = hyphenSec.split('.');

        // If the match is a chapter or verse, there was no dot and this is a reference corresponding
        //  to the book previously in context.
        if (/^\d+:?(?:\d+)?$/.test(dotSplit[0])) {
          ({ chapter, verse } = parseChapterVerse(dotSplit[0], false, chapter, verse));

          if (chapter && !verse) {
            hyphenVerses.push(...getChapter(book, chapter));
            continue;
          }
          hyphenVerses.push({
            book,
            chapter,
            verse,
          });
        } else if (/^(([1-3]|(I{1,3}))\s)?\w+$/.test(dotSplit[0])) {
          book = searchBook(dotSplit[0]);
          chapter = undefined;
          verse = undefined;
          if (dotSplit.length === 1) {
            hyphenVerses.push(...getBook(book));
            continue;
          }

          ({ chapter, verse } = parseChapterVerse(dotSplit[1], true, chapter, verse));

          if (chapter && !verse) {
            hyphenVerses.push(...getChapter(book, chapter));
            continue;
          }

          hyphenVerses.push({
            book,
            chapter,
            verse,
          });
        }
      }

      if (hyphenVerses.length === 2) {
        verses.push(...versesBetween(hyphenVerses[0], hyphenVerses[1]));
      } else {
        verses.push(...hyphenVerses);
      }
    }

    return verses;
  } catch (e) {
    return verses;
  }
}

export function parseChapterVerse(
  input: string,
  bookPreceded: boolean,
  contextChapter: number | undefined,
  contextVerse: number | undefined,
): { chapter: number | undefined; verse: number | undefined } {
  let chapter: number | undefined = contextChapter;
  let verse: number | undefined;
  const colonSplit = input.split(':');

  if (colonSplit.length === 1) {
    if (contextVerse !== undefined && !bookPreceded) {
      verse = +colonSplit[0];
    } else {
      chapter = +colonSplit[0];
      verse = undefined;
    }
  } else {
    chapter = +colonSplit[0];
    verse = +colonSplit[1];
  }

  return {
    chapter,
    verse,
  };
}

export function searchBook(fuzzyBook: string): string {
  const bookSearch = new Fuse(ORDERED_BOOKS, { threshold: 0.5 });
  const result = bookSearch.search(fuzzyBook);
  if (result[0]) {
    return result[0].item;
  }
  return '';
}

export function getBook(book: string): Reference[] {
  let lastChapter = 0;
  for (const chapter in ChapterVerseCount[book]) {
    if (+chapter > lastChapter) {
      lastChapter = +chapter;
    }
  }
  return versesBetween(
    { book, chapter: 1, verse: 1 },
    { book, chapter: lastChapter, verse: ChapterVerseCount[book][lastChapter] },
  );
}

export function getChapter(book: string, chapter: number): Reference[] {
  return versesBetween({ book, chapter, verse: 1 }, { book, chapter, verse: ChapterVerseCount[book][chapter] });
}

export function versesBetween(ref1: Reference, ref2: Reference): Reference[] {
  let book = ref1.book;
  let chapter = ref1.chapter;
  let verse = ref1.verse;

  const refs = [
    {
      book,
      chapter,
      verse,
    },
  ];

  do {
    if (verse++ >= ChapterVerseCount[book][chapter]) {
      verse = 1;
      chapter++;
    }
    if (ChapterVerseCount[book][chapter] === undefined) {
      chapter = 1;
      book = ORDERED_BOOKS[ORDERED_BOOKS.indexOf(book) + 1];
    }
    refs.push({
      book,
      chapter,
      verse,
    });
  } while (verse !== ref2.verse || chapter !== ref2.chapter || book !== ref2.book);

  return refs;
}
