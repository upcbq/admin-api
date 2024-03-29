import { Reference, parseVerses } from '@shared/utilities/verseParser';
import fs from 'fs';
import path from 'path';
import '@/config/db';
import { IVerseListJson, IVerseListVerseJson } from '@shared/verseList.model';
import VerseList from '@/apiV1/verse-list/verseList.model';

interface IDivisionFile {
  path: string;
  organization: string;
  year: number;
  division: string;
}

(async () => {
  try {
    const argYear = process.argv[2];
    const orgs = ['upci'];

    const divisionFiles: Array<IDivisionFile> = [];

    for (const org of orgs) {
      const orgPath = path.join('./data', org);
      const years = fs
        .readdirSync(orgPath, { withFileTypes: true })
        .filter((f) => f.isDirectory() && /^\d+$/.test(f.name));
      for (const year of years) {
        if (argYear && year.name !== argYear) continue;
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

    const verseLists: IVerseListJson[] = [];

    for (const file of divisionFiles) {
      const references: IVerseListVerseJson[] = [];
      const fileResults: Reference[] = [];
      const lines = fs.readFileSync(file.path, 'utf8').split('\n').filter(Boolean);
      const name = lines[0];
      const translation = lines[1];
      const verseLines = lines.slice(2);
      for (let lineNumber = 0; lineNumber < verseLines.length; lineNumber++) {
        const line = verseLines[lineNumber];
        const lineResults = parseVerses(line);
        fileResults.push(...lineResults.map((r) => ({...r})));
      }
      
      const deduplicatedFileResults = fileResults.reduce((vs, v) => {
        if (!vs.some((ov) => ov.book === v.book && ov.chapter === v.chapter && ov.verse === v.verse)) {
          vs.push(v);
        } else {
          console.log(`  - dupe found for ${file.year} ${file.division} ${v.book} ${v.chapter}:${v.verse}`);
        }
        return vs;
      }, [] as Reference[]);
      references.push(...deduplicatedFileResults.map((r, i) => ({ ...r, sortOrder: references.length + i })));

      const verseList = {
        verses: references,
        name,
        translation,
        year: file.year,
        division: file.division,
        organization: file.organization,
        count: references.length,
      };
      if (verseList.count > 0) {
        verseLists.push(verseList);
      }

      console.log(
        `parsed verse list ${verseList.organization} ${verseList.year} "${verseList.name}" ${verseList.division} with ${verseList.count} verses`,
      );
    }

    await VerseList.bulkWrite(verseLists.map((vl) => ({
      updateOne: {
        filter: { year: vl.year, division: vl.division, organization: vl.organization },
        update: vl,
        upsert: true,
      },
    })));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();
