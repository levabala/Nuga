import { el } from 'redom';
import interact from 'interactjs';
import PersonData from '../../../classes/dataTypes/PersonData';
import generateConfig from '../../../scripts/dragConfig';
import CalendarCell from './CalendarCell';

class PersonCell {
  constructor(cellX: number, cellY: number, person: ?PersonData) {
    this.person = person;
    this.cellX = cellX;
    this.cellY = cellY;

    this.el = el('div', { class: 'personCell' }, person.name);

    // create cross-DOM-link
    this.el.personCell = this;

    interact(this.el).draggable(generateConfig());
    // interact(this.el).styleCursor(false);
  }

  handleAssigment(targetCell: CalendarCell) {
    this.cellX = targetCell.xCoord;
    this.cellY = targetCell.yCoord;
    // create cross-DOM-link
    if (this.el.calendarCell) this.el.calendarCell.unassignPersonCell();
    this.el.calendarCell = targetCell;
  }
}

export default PersonCell;
