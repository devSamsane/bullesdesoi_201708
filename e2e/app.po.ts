import { browser, by, element } from 'protractor';

export class BullesdesoiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bds-root h1')).getText();
  }
}
