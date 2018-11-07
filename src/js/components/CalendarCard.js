import { el } from 'redom';
import Card from './Card';

class CalendarCell {
  constructor() {
    this.el = el(
      'div',
      { class: 'calendarCell' },
      el(
        'div',
        { class: 'block' },
        el('img', {
          src: 'images/avatar.png',
          alt: 'Avatar',
          class: 'avatar',
        }),
        el('div', { class: 'text-info' }, [
          el('div', { class: 'primary-info' }, 'Markus Croftwinger'),
          el('div', { class: 'secondary-info' }, '248811134'),
        ]),
      ),
      el('div', { class: 'block' }, el('div', { class: 'points' }, '17')),
    );
  }
}

class CalendarTable {
  constructor() {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const arr2 = [];
      for (let i2 = 0; i2 < 3; i2++)
        arr2.push(el('div', { class: 'table-cell' }, new CalendarCell()));

      arr.push(el('div', { class: 'table-row' }, arr2));
    }

    this.el = el('div', { class: 'table' }, arr);
  }
}

class CalendarCard extends Card {
  constructor() {
    super({ width: '600px' });
    this.el = el('div', new CalendarTable());
  }
}

export default CalendarCard;
