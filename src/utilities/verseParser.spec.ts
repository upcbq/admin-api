import { parseVerses, Reference } from './verseParser';
import { expect } from 'chai';

describe('parseVerses', () => {
  describe('when a value with only a book is passed (Genesis)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis');
    });
    it('should include the entire book', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 1, verse: 31 },
        { book: 'genesis', chapter: 15, verse: 1 },
        { book: 'genesis', chapter: 50, verse: 26 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'exodus', chapter: 1, verse: 1 }]);
      expect(result.length).to.equal(1533);
    });
  });
  describe('when a value with only a book and chapter is passed (Genesis.1)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.1');
    });
    it('should include the entire chapter', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 1, verse: 31 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 2, verse: 1 }]);
      expect(result.length).to.equal(31);
    });
  });
  describe('when a value with multiple chapters separated by commas is passed (john.1,2,3,4)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('john.1,2,3,4');
    });
    it('should return each entire chapter', () => {
      expect(result).to.include.deep.members([
        { book: 'john', chapter: 1, verse: 1 },
        { book: 'john', chapter: 4, verse: 1 },
      ]);
      expect(result.length).to.equal(166);
    });
  });
  describe('when a value a single book, chapter, and verse is passed (Genesis.1:1)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.1:1');
    });
    it('should include the specified verse only', () => {
      expect(result).to.include.deep.members([{ book: 'genesis', chapter: 1, verse: 1 }]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 1, verse: 2 }]);
      expect(result.length).to.equal(1);
    });
  });
  describe('when a range of verses is specified (Genesis.1:1-13)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.1:1-13');
    });
    it('should include the specified range', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 1, verse: 13 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 1, verse: 14 }]);
      expect(result.length).to.equal(13);
    });
  });
  describe('when a range of verses is specified including chapter (Genesis.1:1-2:13)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.1:1-2:13');
    });
    it('should include the specified range', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 2, verse: 13 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 2, verse: 14 }]);
      expect(result.length).to.equal(44);
    });
  });
  describe('when a range of verses is specified including book (Genesis.50:1-Exodus.1:15)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.50:1-Exodus.1:15');
    });
    it('should include the specified range', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 50, verse: 1 },
        { book: 'genesis', chapter: 50, verse: 26 },
        { book: 'exodus', chapter: 1, verse: 1 },
        { book: 'exodus', chapter: 1, verse: 15 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 49, verse: 33 }]);
      expect(result.length).to.equal(41);
    });
  });
  describe('when multiple ranges are passed separated by commas (Genesis.10:1-5,Exodus.1:1-6,Revelation.22:1-4)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.10:1-5,Exodus.1:1-6,Revelation.22:1-4,6,9,1 John.3:16');
    });
    it('should include the specified range', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 10, verse: 1 },
        { book: 'genesis', chapter: 10, verse: 5 },
        { book: 'exodus', chapter: 1, verse: 1 },
        { book: 'exodus', chapter: 1, verse: 6 },
        { book: 'revelation', chapter: 22, verse: 1 },
        { book: 'revelation', chapter: 22, verse: 4 },
        { book: 'revelation', chapter: 22, verse: 6 },
        { book: 'revelation', chapter: 22, verse: 9 },
        { book: '1-john', chapter: 3, verse: 16 },
      ]);
      expect(result.length).to.equal(18);
    });
  });
  describe('when a value with multiple hyphens is passed (Genesis.1-2-3)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis.1-2-3');
    });
    it('all ranges should be included', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 1, verse: 31 },
        { book: 'genesis', chapter: 2, verse: 1 },
        { book: 'genesis', chapter: 2, verse: 25 },
        { book: 'genesis', chapter: 3, verse: 1 },
        { book: 'genesis', chapter: 3, verse: 24 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'genesis', chapter: 4, verse: 1 }]);
    });
  });
  describe('when a value with multiple books is passed (Genesis,Matthew)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('Genesis,Matthew');
    });
    it('should include all specified books', () => {
      expect(result).to.include.deep.members([
        { book: 'genesis', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 50, verse: 26 },
        { book: 'matthew', chapter: 1, verse: 1 },
        { book: 'genesis', chapter: 28, verse: 20 },
      ]);
      expect(result).not.to.include.deep.members([{ book: 'exodus', chapter: 1, verse: 1 }]);
      expect(result.length).to.equal(1533 + 1071);
    });
  });
  describe('when a value with a single reference is passed (John.3:16)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('John.3:16');
    });
    it('should include only the specified verse', () => {
      expect(result).to.include.deep.members([{ book: 'john', chapter: 3, verse: 16 }]);
      expect(result.length).to.equal(1);
    });
  });
  describe('when a value with two references is passed (John.3:16,18)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('John.3:16,18');
    });
    it('should include only the specified verse', () => {
      expect(result).to.include.deep.members([
        { book: 'john', chapter: 3, verse: 16 },
        { book: 'john', chapter: 3, verse: 18 },
      ]);
      expect(result.length).to.equal(2);
    });
  });
  describe('when a value with a trailing colon is passed (John.3:16,18:,john.19)', () => {
    let result: Reference[];
    beforeEach(() => {
      result = parseVerses('John.3:16,18:,john.19');
    });
    it('should treat the value with the trailing colon like a chapter', () => {
      expect(result).to.include.deep.members([
        { book: 'john', chapter: 3, verse: 16 },
        { book: 'john', chapter: 18, verse: 1 },
        { book: 'john', chapter: 19, verse: 42 },
      ]);
      expect(result.length).to.equal(83);
    });
  });
});
