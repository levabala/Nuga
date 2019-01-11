import { el } from 'redom';
import interact from 'interactjs';
import PersonData from '../../../classes/dataTypes/PersonData';
import generateConfig from '../../../scripts/dragConfig';
import CalendarCell from './CalendarCell';
import CalendarTable from './CalendarTable';

class PersonCell {
  constructor(
    cellX: number,
    cellY: number,
    person: ?PersonData,
    moveCallback: (
      sender: PersonCell,
      x: number,
      y: number,
      cellWidth: number,
      cellHeight: number,
    ) => void,
  ) {
    this.person = person;
    this.cellX = cellX;
    this.cellY = cellY;
    this.currentTable = null;
    this.tempTable = null;

    this.el = el('div', { class: 'personCell' }, [
      el('div', { class: 'marker' }),
      el('div', { class: 'avatar' }),
      el(
        'div',
        { class: 'mainInfoWrapper' },
        el('div', [
          el('div', { class: 'content' }, [
            el('span', { class: 'surname' }, 'Surname '),
            el('span', { class: 'name' }, 'Name '),
            el('span', { class: 'patronymic' }, 'P. '),
            el('span', { class: 'visits' }, '34 '),
            el('span', { class: 'grade' }, 'B'),
          ]),
          el('div', { class: 'content' }, [
            el('span', { class: 'number' }, '7871332'),
          ]),
        ]),
      ),
      el(
        'div',
        { class: 'pointsWrapper' },
        el('div', { class: 'content' }, '13'),
      ),
    ]);
    this.el.personCell = this;

    interact(this.el).draggable(
      generateConfig((...args) => moveCallback(this, ...args)),
    );
  }

  handleAssigment(targetCell: CalendarCell) {
    this.cellX = targetCell.xCoord;
    this.cellY = targetCell.yCoord;

    // create cross-DOM-link
    if (this.el.calendarCell) this.el.calendarCell.unassignPersonCell();
    this.el.calendarCell = targetCell;

    this.currentTable = targetCell.parentTable;
    this.assignTempTable(this.currentTable);
  }

  assignTempTable(calendarTable: CalendarTable) {
    this.tempTable = calendarTable;
  }
}

export default PersonCell;
