import { parseVerses, Reference } from '@/utilities/verseParser';
import fs from 'fs';
import path from 'path';
// import '@/config/db';

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
