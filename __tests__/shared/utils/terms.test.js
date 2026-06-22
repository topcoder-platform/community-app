import {
  getDocuSignTemplateIdForTerm,
  isNdaTerm,
} from 'utils/terms';

describe('terms utils', () => {
  const NEW_NDA_TEMPLATE_ID = '400b989d-1c75-4889-b6f6-421e1f924709';

  test('detects NDA terms by title', () => {
    expect(isNdaTerm({ title: 'Appirio NDA v2.0' })).toBe(true);
    expect(isNdaTerm({ title: 'Competition Non-Disclosure Agreement' })).toBe(true);
    expect(isNdaTerm({ title: 'Assignment Terms' })).toBe(false);
  });

  test('uses configured DocuSign template for NDA terms', () => {
    expect(getDocuSignTemplateIdForTerm({
      docusignTemplateId: 'old-template-id',
      title: 'Appirio NDA v2.0',
    })).toBe(NEW_NDA_TEMPLATE_ID);
  });

  test('keeps terms-service template for non-NDA terms', () => {
    expect(getDocuSignTemplateIdForTerm({
      docusignTemplateId: 'assignment-template-id',
      title: 'Assignment Terms',
    })).toBe('assignment-template-id');
  });

  test('handles missing terms details', () => {
    expect(isNdaTerm(null)).toBe(false);
    expect(isNdaTerm()).toBe(false);
    expect(getDocuSignTemplateIdForTerm(null)).toBe(undefined);
    expect(getDocuSignTemplateIdForTerm()).toBe(undefined);
  });
});
