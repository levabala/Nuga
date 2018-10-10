import { el } from 'redom';
import PersonData from './dataTypes/PersonData';

class PersonTooltip {
  /* eslint-disable-next-line */
  constructor(data: PersonData) {
    const editURL = '';
    const followURL = '';
    this.el = el('div', { class: 'table' }, [
      el('div', { class: 'row' }, [
        el(
          'i',
          {
            class: 'material-icons smallIcon blackIcon cell',
          },
          'edit',
        ),
        el('a', { href: editURL, class: 'linkAsText cell' }, 'Редактировать'),
      ]),
      el('div', { class: 'row' }, [
        el('i', { class: 'material-icons smallIcon blackIcon cell' }, 'link'),
        el(
          'a',
          { href: followURL, class: 'linkAsText cell' },
          'Перейти по ссылке',
        ),
      ]),
    ]);
  }
}

export default PersonTooltip;
