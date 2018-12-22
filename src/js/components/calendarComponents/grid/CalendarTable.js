import { el } from 'redom';
import DayData from '../../../classes/dataTypes/DayData';

class CalendarTable {
  constructor(
    data: DayData,
    isFirst: boolean,
    otherDays: Array<CalendarTable>,
  ) {
    this.data = data;
    this.isFirst = isFirst;
    this.otherDays = otherDays;

    this.el = el('div', {
      class: 'calendarTable',
    });
  }
}

export default CalendarTable;
