// import tippy from 'tippy.js';
import { el } from 'redom';
import tippy from 'tippy.js';
import DataInterface from './DataInterface';
import PersonTooltip from './PersonTooltip';

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
    const element = el('div', { style: 'display: inline-block' }, [
      el('a', { href: '' }, this.toString()),
    ]);
    tippy(element, {
      placement: 'bottom',
      theme: 'white',
      content: new PersonTooltip().el,
      size: 'small',
      interactive: true,
      showOnInit: true,
      arrow: false, // TODO: realize sharp svg arrow
      arrowType: 'round',
    });
    return element;
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
