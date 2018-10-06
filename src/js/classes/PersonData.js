// import tippy from 'tippy.js';
import { el } from 'redom';
import DataInterface from './DataInterface';

class PersonData implements DataInterface {
  constructor({ name, surname, url = '' }) {
    this.name = name;
    this.surname = surname;
    this.url = url;
  }

  toString() {
    return `${this.name} ${this.surname}`;
  }

  generateElement() {
    return el(
      'div',
      {
        class: 'tooltip personDataElement',
        'data-tippy-content': "I'm a Tippy tooltip!",
      },
      [el('a', { href: '' }, this.toString())],
    );
  }

  generateElementOneOfMany(final: boolean) {
    const str = this.toString();
    return el('div', { style: 'display: block-inline; float: left' }, [
      el('a', { href: '' }, str),
      final ? '' : ',\u00a0', // hard space
    ]);
  }
}

export default PersonData;
