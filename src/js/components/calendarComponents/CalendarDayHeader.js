import { el, setChildren } from 'redom';
import DayData from '../../classes/dataTypes/DayData';

class CalendarDayHeader {
  constructor(data: ?DayData) {
    this.data = data;

    if (data === null) this.setDataMock();
    else {
      this.setWrappingLayout();
      this.setData(data);
    }
  }

  setWrappingLayout() {
    this.el = el('div', { class: 'calendarHeader' });
  }

  setDataMock() {
    this.setWrappingLayout();
    setChildren(this.el, [
      el(
        'p',
        { style: 'float: left' },
        el('span', { class: 'primaryInfo' }, 'dddd '),
        el('span', { class: 'secondaryInfo' }, 'DD.MM.gg'),
      ),
      el(
        'p',
        { class: 'visitsInfo' },
        el(
          'span',
          el(
            'span',
            { class: 'visitsInfoPotential' },
            `Было: `,
            el('span', { class: 'font-primary-semibold' }, 'n'),
          ),
          el(
            'span',
            { class: 'visitsInfoReal' },
            `Не пришли: `,
            el('span', { class: 'fontPrimarySemibold' }, 'n'),
          ),
        ),
      ),
    ]);
  }

  setData(data: DayData) {
    setChildren(this.el, [
      el(
        'p',
        { style: 'float: left' },
        el('span', { class: 'primaryInfo' }, data.date.format('dddd ')),
        el('span', { class: 'secondaryInfo' }, data.date.format('DD.MM.gg')),
      ),
      el(
        'p',
        { class: 'visitsInfo' },
        el(
          'span',
          el(
            'span',
            { class: 'visitsInfoPotential' },
            `Было: `,
            el(
              'span',
              { class: 'font-primary-semibold' },
              Math.round(Math.random() * 100),
            ),
          ),
          el(
            'span',
            { class: 'visitsInfoReal' },
            `Не пришли: `,
            el(
              'span',
              { class: 'fontPrimarySemibold' },
              Math.round(Math.random() * 100),
            ),
          ),
        ),
      ),
    ]);
  }
}

export default CalendarDayHeader;
