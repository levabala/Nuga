import { el } from 'redom';
import DayData from '../../classes/dataTypes/DayData';
import CalendarTable from './grid/CalendarTable';
import CalendarDayHeader from './CalendarDayHeader';

class CalendarDay {
  constructor(
    id: number,
    data: ?DayData,
    isFirst: boolean = false,
    otherDays: Array<CalendarDay>,
  ) {
    this.id = id;
    this.otherDays = otherDays;
    this.data = data;
    this.table = new CalendarTable(id, data, isFirst, otherDays);
    this.header = new CalendarDayHeader(data);

    this.el = el('div', { class: 'calendarDay', tabindex: 0 }, [
      this.header.el,
      this.table.el,
    ]);
  }

  setData(data: DayData) {
    this.data = data;
    this.table.setData(data);
    this.header.setData(data);
  }
}

export default CalendarDay;
