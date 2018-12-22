import { el } from 'redom';
import DayData from '../../classes/dataTypes/DayData';

class CalendarDayHeader {
  constructor(data: DayData) {
    this.data = data;

    this.el = el(
      'div',
      { class: 'calendar-header' },
      el(
        'p',
        { style: 'float: left' },
        el('span', { class: 'primary-info' }, data.date.format('dddd ')),
        el('span', { class: 'secondary-info' }, data.date.format('DD.MM.gg')),
      ),
      el(
        'p',
        { class: 'visits-info' },
        el(
          'span',
          el(
            'span',
            { class: 'visits-info-potential' },
            `Было: `,
            el(
              'span',
              { class: 'font-primary-semibold' },
              Math.round(Math.random() * 100),
            ),
          ),
          el(
            'span',
            { class: 'visits-info-real' },
            `Не пришли: `,
            el(
              'span',
              { class: 'font-primary-semibold' },
              Math.round(Math.random() * 100),
            ),
          ),
        ),
      ),
    );
  }
}

export default CalendarDayHeader;
