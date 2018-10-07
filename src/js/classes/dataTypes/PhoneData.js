import { el } from 'redom';
import DataInterface from '../DataInterface';

class PhoneData implements DataInterface {
  constructor({ phone_number }) {
    this.phone_number = phone_number;
  }

  toString() {
    return this.phone_number;
  }

  generateElement() {
    return el('div', el('a', { href: '' }, this.toString()));
  }

  generateElementOneOfMany(final: boolean) {
    const str = this.toString();
    console.log(str);
    return el('div', { style: 'display: block-inline; float: left' }, [
      el('a', { href: '' }, str),
      final ? '' : ',\u00a0', // hard space
    ]);
  }
}
export default PhoneData;
