// import * as moment from 'moment';
import interact from 'interactjs';
import { el, mount, setChildren, setAttr } from 'redom';
import Reactor from '../scripts/reactor';
import Card from './Card';
import PersonData from '../classes/dataTypes/PersonData';
import generateConfig from '../scripts/drag';
import dropConfig from '../scripts/drop';
import DayData from '../classes/dataTypes/DayData';

const emptyPerson = new PersonData({ name: '', surname: '' });

class PersonCell {
  constructor(id: string, x: number, y: number, person: ?PersonData) {
    this.person = person || emptyPerson;
    this.mock = person === null;
    this.x = x;
    this.y = y;

    this.id = null;
    this.setId(id);

    // FIXIT: disable placing mocking empty element
    this.el = el(
      'div',
      {
        id,
        class: 'personCell',
        'data-coord-x': x,
        'data-coord-y': y,
        style: `${
          person ? '' : 'visibility: hidden; background: transparent;'
        }`,
      },
      [
        el(
          'div',
          { class: 'wrapper-block' },
          el(
            'div',
            { class: 'content-block' },
            el('img', {
              src: 'images/avatar.png',
              alt: 'Avatar',
              class: 'avatar',
            }),
            el('div', { class: 'text-info' }, [
              el(
                'div',
                { class: 'primary-info' },
                `${this.person.surname} ${this.person.name}`,
              ),
              el('div', { class: 'secondary-info' }, this.person.code),
            ]),
          ),
        ),
        el(
          'div',
          { class: 'wrapper-block' },
          el(
            'div',
            { class: 'content-block' },
            el('div', { class: 'points' }, this.person.points),
          ),
        ),
      ],
    );

    this.el.addEventListener('animationend', () => {
      if (this.mock) return;
      this.discardMoveBackAnimation();
    });
  }

  discardMoveBackAnimation() {
    this.el.setAttribute('style', `width: auto`);
    this.el.classList.remove('isDragging');
    this.el.classList.remove('movingBack');
  }

  setId(id) {
    this.id = id;
    setAttr(this, 'id', id);
  }
}

class CalendarCell extends Reactor {
  constructor(x: number, y: number, person: ?PersonData, tableDiv: Node) {
    super();

    const cell = this;
    this.parentTableDiv = tableDiv;
    this.x = x;
    this.y = y;
    this.personCell = null;
    this.id = `tableCell_${this.x}_${this.y}`;
    this.personId = `${this.id}_person`;

    this.el = el('div', {
      class: `calendarCell`,
      id: this.id,
      'data-empty': person === null,
      'data-coord-x': x,
      'data-coord-y': y,
    });

    this.setChildPerson(person);

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

      dropzoneElement.classList.remove('readyToGetDrop');
      draggableElement.classList.remove('readyToBeDropped');

      cell.dispatchEvent('insertElement', {
        target: cell,
        relatedTarget: draggableElement,
      });
    };
    interact(this.el).dropzone(config);

    this.registerEvent('insertElement');
  }

  setChildPerson(person: PersonData) {
    const personCell = new PersonCell(this.personId, this.x, this.y, person);
    this.setChildPersonCell(personCell);
  }

  setChildPersonCell(personCell) {
    this.personCell = personCell;
    this.personCell.x = this.x;
    this.personCell.y = this.y;
    this.personCell.setId(this.personId);
    this.personCell.el.dispatchEvent(new Event('animationend'));
    setChildren(this, this.personCell);

    interact(this.personCell.el).draggable(generateConfig(this.parentTableDiv));
  }
}

class CalendarTable {
  constructor(data: DayData, isFirst: boolean) {
    this.data = data;
    this.cells = [];

    const arr = [];
    const height = 5;
    const width = 10;

    this.el = el('div', {
      class: `calendar-table ${isFirst ? 'first' : ''}`,
      tabindex: 0,
    });
    this.scrolledCellIndex = 0;
    this.cellsPerPage = 3;
    this.lastScrollDirection = 'start';
    this.turnCooldownTime = 3000;
    this.turnCooldownBorder = Date.now();

    this.el.addEventListener('draggableMoved', event => {
      if (Date.now() < this.turnCooldownBorder) return;

      const boundRect = this.el.getBoundingClientRect();
      const l = event.detail.x + event.detail.width / 2;
      const r = boundRect.x + boundRect.width - 60;
      console.log(l, r);
      if (l > r) {
        this.turnPageRight();
      }

      this.turnCooldownBorder += this.turnCooldownTime;
    });

    // create positions row
    const positionCells = [
      // create empty left-top cell
      el('div', { class: 'calendar-table-cell timeCell' }, ''),
    ];
    for (let i2 = 0; i2 < width; i2++) {
      const element = el(
        'div',
        { class: 'calendar-table-cell positionCell' },
        `Position ${i2 + 1}`,
      );

      positionCells.push(element);
    }
    arr.push(el('div', { class: 'calendar-table-row' }, positionCells));

    // create main grid
    for (let i = 0; i < height; i++) {
      const arr2 = [];
      this.cells.push([]);

      // create time cell
      const timeCell = el(
        'div',
        {
          class: 'calendar-table-cell  timeCell ',
        },
        el(
          'div',
          { class: 'content-block' },
          el('span', `${10 + i}`),
          el('span', { class: 'secondaryTime' }, `:00`),
        ),
      );
      arr2.push(timeCell);

      for (let i2 = 0; i2 < width; i2++) {
        const exist = Math.random() > 0.7;

        const cell = new CalendarCell(
          i2,
          i,
          exist
            ? data.visits[Math.round(Math.random() * (data.visits.length - 1))]
                .client
            : null,
          this.el,
        );
        cell.addEventListener('insertElement', this.insertCell.bind(this));

        arr2.push(el('div', { class: 'calendar-table-cell' }, cell));
        this.cells[i].push(cell);
      }

      arr.push(el('div', { class: 'calendar-table-row' }, arr2));
    }

    setChildren(this.el, arr);

    this.el.onkeyup = event => {
      if (event.keyCode === 39) {
        this.turnPageRight();
        event.preventDefault();
      }
      if (event.keyCode === 37) {
        this.turnPageLeft();
        event.preventDefault();
      }
    };
  }

  updateTableScrool() {
    console.log(
      `scroll to index ${this.scrolledCellIndex}(${this.scrolledCellIndex +
        1})`,
    );
    const element = this.cells[0][this.scrolledCellIndex].el;
    element.parentNode.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }

  turnPageRight() {
    this.scrolledCellIndex = Math.min(
      this.scrolledCellIndex + this.cellsPerPage,
      this.cells[0].length - 1,
    );
    this.lastScrollDirection = 'start';
    this.updateTableScrool('start');
  }

  turnPageLeft() {
    this.scrolledCellIndex = Math.max(
      this.scrolledCellIndex - this.cellsPerPage,
      0,
    );
    this.lastScrollDirection = 'end';
    this.updateTableScrool('end');
  }

  insertCell(args) {
    const { target, relatedTarget } = args;
    const px = relatedTarget.attributes['data-coord-x'].value;
    const py = relatedTarget.attributes['data-coord-y'].value;

    const targetCalendarCell = target;
    const originCalendarCell = this.cells[py][px];

    const tx = targetCalendarCell.x;
    const ty = targetCalendarCell.y;

    const success = this.freeCell(originCalendarCell, tx, ty);
    if (success) {
      // discard move back animation
      relatedTarget.dispatchEvent(new Event('animationend'));
    }
  }

  static movePersonCell(originCalendarCell, targetCalendarCell) {
    const tx = targetCalendarCell.x;
    const ty = targetCalendarCell.y;

    const { personCell } = originCalendarCell;

    // update empty-state for calendar cells
    setAttr(originCalendarCell, 'data-empty', true);
    setAttr(targetCalendarCell, 'data-empty', false);

    // update personCell position
    setAttr(personCell, 'data-coord-x', tx);
    setAttr(personCell, 'data-coord-y', ty);

    // set personCell as child of targetCalendarCell
    targetCalendarCell.setChildPersonCell(personCell);

    // set mocking emptyPersonCell as child of originCalendarCell
    originCalendarCell.setChildPerson(null);
  }

  freeCell(insertedCell, x, y) {
    if (this.cells[y][x].personCell.mock) {
      this.constructor.movePersonCell(insertedCell, this.cells[y][x]);
      return true;
    }

    return this.tryShiftRow(insertedCell, x, y);
  }

  tryShiftRow(insertedCell, x, y) {
    // special case
    if (
      x > 0 &&
      insertedCell.x === x + 1 &&
      insertedCell.y === y &&
      this.cells[y][x - 1].personCell.mock
    ) {
      this.shiftRow(this.cells[y].slice(x, x + 2), -1);
      return true;
    }

    // check if moving in one time (x axis)
    let elementsToShift = [];
    if (insertedCell.y === y) {
      const movingPerson = insertedCell.personCell.person;

      if (x > insertedCell.x) {
        // then shift left
        elementsToShift = this.cells[y].slice(insertedCell.x + 1, x + 1);
        this.shiftRow(elementsToShift, -1);
      }
      // then shift right
      else {
        elementsToShift = this.cells[y].slice(x, insertedCell.x);
        this.shiftRow(elementsToShift.reverse(), 1);
      }

      // if (filled) this.cells[y][x].setChildPerson(movingPerson);
      this.cells[y][x].setChildPerson(movingPerson);

      return true;
    }

    // check left side
    elementsToShift = [];
    let doShift = false;
    for (let xt = x; xt >= 0; xt--) {
      const cell = this.cells[y][xt];
      if (cell.personCell.mock) {
        doShift = true;
        break;
      }

      elementsToShift.push(cell);
    }

    if (doShift) {
      this.shiftRow(elementsToShift.reverse(), -1);
      this.constructor.movePersonCell(insertedCell, this.cells[y][x]);
      return true;
    }

    // TODO: put checking into sub-function
    // check right side
    elementsToShift = [];
    for (let xt = x; xt < this.cells[0].length; xt++) {
      const cell = this.cells[y][xt];
      if (cell.personCell.mock) {
        doShift = true;
        break;
      }

      elementsToShift.push(cell);
    }

    if (doShift) {
      this.shiftRow(elementsToShift.reverse(), 1);
      this.constructor.movePersonCell(insertedCell, this.cells[y][x]);
      return true;
    }

    return false;
  }

  shiftRow(cellsToShift, deltaX) {
    const cells = cellsToShift;
    for (let i = 0; i < cells.length; i++) {
      const cellToMove = cells[i];
      const newX = cellToMove.x + deltaX;
      this.constructor.movePersonCell(
        cellToMove,
        this.cells[cellToMove.y][newX],
      );
    }
  }
}

class CalendarDayFooter {
  constructor(data: DayData) {
    this.data = data;

    this.el = el(
      'div',
      { class: 'calendar-footer' },
      el('span', { class: 'primary-info' }, data.date.format('dddd ')),
      el('span', { class: 'secondary-info' }, data.date.format('DD.MM.gg')),
    );
  }
}

class CalendarDay {
  constructor(data: DayData, isFirst: boolean = false) {
    this.el = el(
      'div',
      { class: 'calendar-day' },
      new CalendarTable(data, isFirst),
      new CalendarDayFooter(data),
    );
  }
}

class CalendarCard extends Card {
  constructor(data: Array<DayData>) {
    super();

    this.data = data;
    for (let i = 0; i < data.length; i++) {
      const child = el(
        'div',
        { class: 'calendar-card' },
        new CalendarDay(data[i], i === 0),
        el('hr', { class: 'calendar-day-divider' }),
      );
      mount(this.el, child);
    }
  }
}

export default CalendarCard;
