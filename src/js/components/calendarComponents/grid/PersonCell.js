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
            el('span', { class: 'surname' }, `${person.surname} `),
            el('span', { class: 'name' }, `${person.name} `),
            el(
              'span',
              { class: 'patronymic' },
              `${person.patronymic.length ? `${person.patronymic[0]}.` : ''} `,
            ),
            el('span', { class: 'visits' }, `${person.visitsCount} `),
            el('span', { class: 'grade' }, `${person.grade}`),
          ]),
          el('div', { class: 'content' }, [
            el('span', { class: 'number' }, `${person.code}`),
          ]),
        ]),
      ),
      el(
        'div',
        { class: 'pointsWrapper' },
        el('div', { class: 'content' }, `${person.points}`),
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
