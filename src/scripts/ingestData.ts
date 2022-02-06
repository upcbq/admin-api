import { parseVerses } from '@/utilities/verseParser';
import fs from 'fs';
import path from 'path';
import '@/config/db';
import VerseList, { IVerseListJson, IVerseListVerseJson } from '@/apiV1/verse-list/verseList.model';

interface IDivisionFile {
  path: string;
  organization: string;
  year: number;
  division: string;
}

(async () => {
  try {
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

    const verseLists: IVerseListJson[] = [];

    for (const file of divisionFiles) {
      const references: IVerseListVerseJson[] = [];
      const lines = fs.readFileSync(file.path, 'utf8').split('\n').filter(Boolean);
      const name = lines[0];
      const translation = lines[1];
      const verseLines = lines.slice(2);
      for (let lineNumber = 0; lineNumber < verseLines.length; lineNumber++) {
        const line = verseLines[lineNumber];
        const lineResults = parseVerses(line);
        references.push(...lineResults.map((r, i) => ({ ...r, sortOrder: references.length + i })));
      }
      const verseList = {
        verses: references,
        name,
        translation,
        year: file.year,
        division: file.division,
        organization: file.organization,
        count: references.length,
      };
      verseLists.push(verseList);

      console.log(
        `parsed verse list ${verseList.organization} ${verseList.year} "${verseList.name}" ${verseList.division} with ${verseList.count} verses`,
      );
    }

    await VerseList.insertMany(verseLists);
  } catch (e) {
    process.exit(1);
  }
  process.exit(0);
})();
