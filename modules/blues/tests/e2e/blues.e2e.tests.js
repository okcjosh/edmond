'use strict';

describe('Blues E2E Tests:', function () {
  describe('Test Blues page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/blues');
      expect(element.all(by.repeater('blue in blues')).count()).toEqual(0);
    });
  });
});
