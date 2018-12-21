import { el } from 'redom';
import DayData from '../../classes/dataTypes/DayData';
import CalendarTable from './CalendarTable';
import CalendarDayHeader from './CalendarDayHeader';

class CalendarDay {
  constructor(
    data: DayData,
    isFirst: boolean = false,
    otherDays: Array<CalendarDay>,
  ) {
    this.otherDays = otherDays;
    this.table = new CalendarTable(data, isFirst, otherDays);
    this.el = el(
      'div',
      { class: 'calendar-day', tabindex: 0 },
      new CalendarDayHeader(data),
      this.table,
    );
  }
}

export default CalendarDay;
