import interact from 'interactjs';
import { el, setChildren } from 'redom';
import Reactor from '../../scripts/reactor';
import PersonData from '../../classes/dataTypes/PersonData';
import generateConfig from '../../scripts/drag';
import PersonCell from './PersonCell';

class CalendarCell extends Reactor {
  constructor(
    x: number,
    y: number,
    person: ?PersonData,
    tableDiv: Node,
    dayId: string,
    locked: boolean = false,
  ) {
    super();

    this.parentTableDiv = tableDiv;
    this.x = x;
    this.y = y;
    this.locked = locked;
    this.personCell = null;
    this.id = `tableCell_${this.x}_${this.y}`;
    this.personId = `${this.id}_person`;
    this.dayId = dayId;

    this.container = el('div', {
      // class: `calendarCell-container`,
    });

    this.el = el(
      'div',
      {
        class: `calendarCell`,
        id: this.id,
        'data-empty': person === null,
        'data-coord-x': x,
        'data-coord-y': y,
      },
      this.container,
    );

    this.setChildPerson(person);
  }

  setChildPerson(person: PersonData) {
    const personCell = new PersonCell(
      this.personId,
      this.x,
      this.y,
      person,
      this.x === 0 || this.x === 1,
    );
    this.setChildPersonCell(personCell);
  }

  setChildPersonCell(personCell) {
    this.personCell = personCell;
    this.personCell.x = this.x;
    this.personCell.y = this.y;
    this.personCell.setId(this.personId);
    this.personCell.setDayId(this.dayId);
    this.personCell.discardMoveBackAnimation();
    // const mock = new ReadyToAddCell();
    // if (Math.random() > 0.5) setChildren(this, mock);
    // else setChildren(this, new PersonCell(0, 0, 0, null));
    setChildren(this.container, this.personCell);

    if (this.personCell.mock) return;

    interact(this.personCell.el).draggable(generateConfig(this.parentTableDiv));
    interact(this.personCell.el).styleCursor(false);
  }

  // modifyPersonByCell(cell) {}
}

export default CalendarCell;
