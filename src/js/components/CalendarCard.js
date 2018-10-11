import { el, mount } from 'redom';
import Card from './Card';

class CalendarPosition {
  constructor(value: String = '') {
    this.el = el('div', { class: 'calendar-table-cell position' }, value);
  }
}

class CalendarTimeCell {
  constructor(value: String = '') {
    this.el = el('div', { class: 'calendar-table-cell regTime' }, value);
  }
}

class CalendarRow {
  constructor({ positions, time } = { positions: 3, time: '12:00' }) {
    this.positions = positions;

    this.el = el('div', { class: 'calendar-table-row' }, [
      new CalendarTimeCell(time),
      ...(() => {
        const arr = [
          new CalendarPosition('testtesttesttesttest'),
          new CalendarPosition('test'),
          new CalendarPosition('test'),
        ];
        return arr;
      })(),
    ]);
  }
}

class CalendarRowTop {
  constructor({ positions_count } = { positions_count: 3 }) {
    this.positions_count = positions_count;

    this.el = el('div', { class: 'calendar-table-row' }, [
      new CalendarTimeCell(),
      ...(() => {
        const arr = [
          new CalendarPosition('Position 1'),
          new CalendarPosition('Position 2'),
        ];
        return arr;
      })(),
    ]);
  }
}

class CalendarTable extends Card {
  constructor(data) {
    super();

    this.data = data;

    /* this.el = el('div', { class: 'calendar-table' }, [
      new CalendarRowTop(),
      new CalendarRow(),
      new CalendarRow(),
    ]); */

    const child = el(
      'div',
      { class: 'mdc-data-table' },
      el('table', { class: 'mdc-data-table__content' }, [
        el(
          'thead',
          el(
            'tr',
            { class: 'mdc-data-table__row' },
            el('th', { class: 'mdc-data-table__header' }, 'Column header text'),
          ),
        ),
        el(
          'tbody',
          el(
            'tr',
            { class: 'mdc-data-table__row' },
            el('td', { class: 'mdc-data-table__cell' }, 'Cell text'),
            el('td', { class: 'mdc-data-table__cell' }, 'Cell text'),
            el('td', { class: 'mdc-data-table__cell' }, 'Cell text'),
            el('td', { class: 'mdc-data-table__cell' }, 'Cell text'),
          ),
        ),
      ]),
    );

    mount(this.el, child);
  }
}

class CalendarCard extends Card {
  constructor() {
    super({ width: '600px' });
    this.el = el('div', new CalendarTable());
  }
}

export default CalendarCard;
