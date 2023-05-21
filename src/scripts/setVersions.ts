import Version, { IVersion } from '@/apiV1/version/version.model';
import '@/config/db';

(async () => {
  try {
    const DATA = {
      'admin-api': '1.0.1',
      'analysis-api': '1.0.0',
      'bible-api': '1.0.0',
      'learn-ui': '0.0.0',
      'material-ui': '0.0.3',
      'quote-ui': '0.1.3',
      'reference-ui': '0.0.0',
      shared: '1.0.0',
      upcbq: '0.0.3',
    };

    const versions: IVersion[] = [];
    for (const key in DATA) {
      versions.push(
        new Version({
          name: key,
          value: DATA[key],
        }),
      );
    }
    await Version.insertMany(versions);
  } catch (e) {
    process.exit(1);
  }
  process.exit(0);
})();
