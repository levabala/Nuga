import { el } from 'redom';
import DataInterface from '../DataInterface';

class TextData implements DataInterface {
  constructor({ text }) {
    this.text = text;
  }

  toString() {
    return this.text;
  }

  generateElement() {
    return el('div', this.text);
  }

  generateElementOneOfMany(final: boolean) {
    const str = this.toString();
    console.log(str);
    return el('div', { style: 'display: block-inline; float: left' }, [
      str,
      final ? '' : ',\u00a0', // hard space
    ]);
  }
}

export default TextData;
