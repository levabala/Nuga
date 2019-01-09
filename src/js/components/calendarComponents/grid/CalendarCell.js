import { el, setChildren } from 'redom';
import interact from 'interactjs';
import PersonCell from './PersonCell';
import CalendarTable from './CalendarTable';

class CalendarCell {
  personCell: ?PersonCell;

  constructor(
    parentTable: CalendarTable,
    xCoord: number,
    yCoord: number,
    freePlaceCallback: (x: number, y: number) => boolean,
  ) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.personCell = null;
    this.dropzoneActive = false;
    this.parentTable = parentTable;

    this.callbacks = {
      freePlaceCallback,
    };

    this.el = el('div', { class: 'item calendarCell' });

    this.activateDropzone();
  }

  activateDropzone() {
    interact(this.el).dropzone({
      ondrop: e => {
        const { personCell } = e.relatedTarget;
        if (
          personCell.cellX === this.xCoord &&
          personCell.cellY === this.yCoord
        )
          return;

        this.assignPersonCell(personCell);
      },
      ondragenter: e => {
        if (e.target.children.length === 0) e.target.style.background = 'gray';
      },
      ondragleave: e => {
        e.target.style.background = '';
      },
      ondropdeactivate: e => {
        e.target.style.background = '';
      },
    });
    interact(this.el).styleCursor(false);

    this.dropzoneActive = true;
  }

  disactivateDropzone() {
    interact(this.el).dropzone(false);

    this.dropzoneActive = false;
  }

  assignPersonCell(personCell: PersonCell) {
    // check if here is or not a cell
    if (this.personCell !== null)
      if (
        !this.callbacks.freePlaceCallback(
          personCell.el.calendarCell,
          this.xCoord,
          this.yCoord,
        )
      )
        // request parent table to try to free up the cell (return value = success)
        // so we cannot assign the personCell to this
        return;

    this.personCell = personCell;
    this.personCell.handleAssigment(this);

    setChildren(this, personCell);
  }

  unassignPersonCell() {
    if (this.personCell === null) return null;
    this.personCell.el.calendarCell = null;

    const { personCell } = this;
    this.personCell = null;

    setChildren(this, []);

    return personCell;
  }
}

export default CalendarCell;
