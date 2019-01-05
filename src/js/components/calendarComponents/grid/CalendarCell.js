import { el, setChildren } from 'redom';
import PersonCell from './PersonCell';

class CalendarCell {
  personCell: ?PersonCell;

  constructor(xCoord: number, yCoord: number) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.personCell = null;

    this.el = el('div', { class: 'item calendarCell' });
  }

  assignPersonCell(personCell: PersonCell) {
    this.personCell = personCell;
    setChildren(this.el, personCell);
  }
}

export default CalendarCell;
