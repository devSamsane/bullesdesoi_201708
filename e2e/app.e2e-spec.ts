import { BullesdesoiPage } from './app.po';

describe('bullesdesoi App', () => {
  let page: BullesdesoiPage;

  beforeEach(() => {
    page = new BullesdesoiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bds works!');
  });
});
