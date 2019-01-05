import { el, setChildren } from 'redom';
import interact from 'interactjs';
import PersonCell from './PersonCell';

class CalendarCell {
  personCell: ?PersonCell;

  constructor(xCoord: number, yCoord: number) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.personCell = null;

    this.el = el('div', { class: 'item calendarCell' });

    interact(this.el).dropzone({
      ondrop: e => {
        console.log('dropped', e);
      },
    });
    interact(this.el).styleCursor(false);
  }

  assignPersonCell(personCell: PersonCell) {
    this.personCell = personCell;
    setChildren(this.el, personCell);
  }
}

export default CalendarCell;
