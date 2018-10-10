import { el } from 'redom';
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

class CalendarTable {
  constructor(data) {
    this.data = data;

    this.el = el('div', { class: 'calendar-table' }, [
      new CalendarRowTop(),
      new CalendarRow(),
      new CalendarRow(),
    ]);
  }
}

class CalendarCard extends Card {
  constructor() {
    super({ width: '600px' });
    this.el = el('div', new CalendarTable());
  }
}

export default CalendarCard;
