import { BookShortNameMap, ChapterVerseCount, ORDERED_BOOKS } from '@/utilities/constants/bible.constants';
import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';
// import '@/config/db';

interface Reference {
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
function parseVerses(refString: string): Reference[] {
  try {
    const verses: Reference[] = [];

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
          const colonSplit = dotSplit[0].split(':');

          if (colonSplit.length === 1) {
            if (verse !== undefined) {
              verse = +colonSplit[0];
            } else {
              chapter = +colonSplit[0];
              verse = undefined;
              hyphenVerses.push(...getChapter(book, chapter));
              continue;
            }
          } else {
            chapter = +colonSplit[0];
            verse = +colonSplit[1];
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

          const colonSplit = dotSplit[1].split(':');

          if (colonSplit.length === 1) {
            chapter = +colonSplit[0];
            verse = undefined;
            hyphenVerses.push(...getChapter(book, chapter));
            continue;
          } else {
            chapter = +colonSplit[0];
            verse = +colonSplit[1];
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
    console.error(e);
    process.exit(-1);
  }
}

function parseChapterVerse(
  input: string,
  bookPreceded: boolean,
  contextVerse: number | undefined,
): { chapter: number | undefined; verse: number | undefined } {
  let chapter: number | undefined;
  let verse: number | undefined;
  const colonSplit = input[1].split(':');

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

function searchBook(fuzzyBook: string): string {
  const bookSearch = new Fuse(ORDERED_BOOKS, { threshold: 0.5 });
  const result = bookSearch.search(fuzzyBook);
  if (result[0]) {
    return result[0].item;
  }
  return '';
}

function getBook(book: string): Reference[] {
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

function getChapter(book: string, chapter: number): Reference[] {
  return versesBetween({ book, chapter, verse: 1 }, { book, chapter, verse: ChapterVerseCount[book][chapter] });
}

function versesBetween(ref1: Reference, ref2: Reference): Reference[] {
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

interface IDivisionFile {
  path: string;
  organization: string;
  year: number;
  division: string;
}

interface IIngestList extends IDivisionFile {
  verses: Reference[];
  translation: string;
  name: string;
}

(async () => {
  const orgs = ['upci'];

  const divisionFiles: Array<IDivisionFile> = [];

  for (const org of orgs) {
    const orgPath = path.join('./data', org);
    const years = fs
      .readdirSync(orgPath, { withFileTypes: true })
      .filter((f) => f.isDirectory() && /^\d+$/.test(f.name));
    for (const year of years) {
      const yearPath = path.join(orgPath, year.name);
      const divisions = fs
        .readdirSync(yearPath, { withFileTypes: true })
        .filter((f) => !f.isDirectory() && /^.*?\.txt$/.test(f.name));
      for (const division of divisions) {
        const divisionPath = path.join(yearPath, division.name);
        divisionFiles.push({
          path: divisionPath,
          organization: org,
          year: +year.name,
          division: division.name.replace(/\.txt$/, ''),
        });
      }
    }
  }

  const verseLists: IIngestList[] = [];

  for (const file of divisionFiles) {
    const references: Reference[] = [];
    const lines = fs.readFileSync(file.path, 'utf8').split('\n').filter(Boolean);
    const name = lines[0];
    const translation = lines[1];
    const verseLines = lines.slice(2);
    for (let lineNumber = 0; lineNumber < verseLines.length; lineNumber++) {
      const line = verseLines[lineNumber];
      const lineResults = parseVerses(line);
      references.push(...lineResults);
    }
    verseLists.push({
      verses: references,
      name,
      translation,
      ...file,
    });
  }

  console.log(
    'verseLists',
    verseLists.map((l, i) => ({ ...l, index: i, count: l.verses.length, verses: undefined })),
  );
  // console.log(JSON.stringify({ ...verseLists[3], count: verseLists[3].verses.length }, null, 2));
})();
