import { el } from 'redom';
import DayData from '../../classes/dataTypes/DayData';
import CalendarTable from './grid/CalendarTable';
import CalendarDayHeader from './CalendarDayHeader';

class CalendarDay {
  constructor(
    id: number,
    data: DayData,
    isFirst: boolean = false,
    otherDays: Array<CalendarDay>,
  ) {
    this.id = id;
    this.otherDays = otherDays;
    this.table = new CalendarTable(id, data, isFirst, otherDays);
    this.el = el(
      'div',
      { class: 'calendar-day', tabindex: 0 },
      new CalendarDayHeader(data),
      this.table,
    );
  }
}

export default CalendarDay;
