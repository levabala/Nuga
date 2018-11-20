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

interact.dynamicDrop(true);

class ReadyToAddCell {
  constructor() {
    this.el = el(
      'div',
      { style: 'position: relative' },
      el(
        'div',
        { class: 'readyToAddCell' },
        el(
          'div',
          {
            class: 'content-block',
            style: 'text-align: center;',
          },
          el(
            'i',
            {
              class: 'material-icons',
              style: 'padding: 0',
            },
            'add',
          ),
          'Добавить запись',
        ),
      ),
    );
  }
}

class PersonCell {
  constructor(id: string, x: number, y: number, person: ?PersonData) {
    this.person = person || emptyPerson;
    this.mock = person === null;
    this.x = x;
    this.y = y;
    this.dayId = '';

    this.id = null;

    // FIXIT: disable placing mocking empty element
    this.el = el(
      'div',
      {
        id,
        class: 'calendarCell-container personCell',
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
              src: '/src/images/avatar.png',
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
    this.setId(id);

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
    setAttr(this, 'data-person-id', id);
  }

  setDayId(id) {
    this.dayId = id;
    setAttr(this, 'data-day-id', id);
  }
}

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

    const cell = this;
    this.parentTableDiv = tableDiv;
    this.x = x;
    this.y = y;
    this.locked = locked;
    this.personCell = null;
    this.id = `tableCell_${this.x}_${this.y}`;
    this.personId = `${this.id}_person`;
    this.dayId = dayId;

    this.container = el('div', {
      class: `.calendarCell-container`,
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

    let addTimeout = null;
    const enterTime = 0; // 100;

    this.el.addEventListener('mouseenter', () => {
      if (this.locked) return;

      addTimeout = setTimeout(() => {
        if (this.personCell.mock) {
          this.el.parentNode.classList.add('readyToAdd');
          setChildren(this.container, new ReadyToAddCell());
        }
      }, enterTime);
    });

    this.el.addEventListener('mouseleave', () => {
      if (this.locked) return;

      clearTimeout(addTimeout);
      if (!this.el.parentNode.classList.contains('readyToAdd')) return;

      this.el.parentNode.classList.remove('readyToAdd');
      setChildren(this.container, new PersonCell(0, 0, 0, null));
    });

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

      dropzoneElement.classList.remove('readyToGetDrop');
      draggableElement.classList.remove('readyToBeDropped');
      draggableElement.parentNode.parentNode.parentNode.classList.remove(
        'draggingOrigin',
      );

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
    this.personCell.setDayId(this.dayId);
    this.personCell.el.dispatchEvent(new Event('animationend'));
    // const mock = new ReadyToAddCell();
    // if (Math.random() > 0.5) setChildren(this, mock);
    // else setChildren(this, new PersonCell(0, 0, 0, null));
    setChildren(this.container, this.personCell);

    interact(this.personCell.el).draggable(generateConfig(this.parentTableDiv));
  }

  // modifyPersonByCell(cell) {}
}

class CalendarTable {
  constructor(
    data: DayData,
    isFirst: boolean,
    otherDays: Array<CalendarTable>,
  ) {
    this.data = data;
    this.cells = [];
    this.otherDays = otherDays;
    this.id = data.date.format('DD MMM YY');

    const arr = [];
    const height = 5;
    const width = 10;

    this.el = el('div', {
      class: `calendar-table ${isFirst ? 'first' : ''}`,
    });
    this.scrolledCellIndex = 0;
    this.scrollEnded = true;
    this.cellsPerPage = 3;
    this.lastScrollDirection = 'start';
    this.turnCooldownTime = 1500;
    this.turnCooldownBorder = Date.now();
    this.timeCells = [];

    /*
    let [dx, dy] = [0, 0];
    const turnBorder = 500;
    let clearDeltaTimeout = null;
    const clearDeltaTime = 1000;
    this.el.addEventListener('wheel', event => {
      return; 
      dx += event.deltaX;
      dy += event.deltaY;

      if (Math.abs(dx) > turnBorder) {
        if (Math.sign(dx) === -1) this.turnPageLeft();
        else this.turnPageRight();

        [dx, dy] = [0, 0];
      }

      clearTimeout(clearDeltaTimeout);
      clearDeltaTimeout = setTimeout(() => {
        [dx, dy] = [0, 0];
      }, clearDeltaTime);

      event.preventDefault();
    });
    */

    const cooldownAfterScroolMax = 1000;
    let cooldownAfterScroolBorder = Date.now();
    this.el.addEventListener('draggableMoved', event => {
      const target = event.detail;
      const targetBoundRect = target.getBoundingClientRect();
      const targetBottomBorder = targetBoundRect.y + targetBoundRect.height;
      const targetTopBorder = targetBoundRect.y;
      const windowHeight = window.innerHeight;

      if (
        targetBottomBorder > windowHeight &&
        Date.now() > cooldownAfterScroolBorder
      ) {
        this.scrollToNextDay();
        cooldownAfterScroolBorder = Date.now() + cooldownAfterScroolMax;
      } else if (
        targetTopBorder < 0 &&
        Date.now() > cooldownAfterScroolBorder
      ) {
        this.scrollToPreviousDay();
        cooldownAfterScroolBorder = Date.now() + cooldownAfterScroolMax;
      }

      const boundRect = this.el.getBoundingClientRect();
      const l = targetBoundRect.width / 2 + 60;
      const n = targetBoundRect.x + targetBoundRect.width / 2;
      const r = boundRect.x + boundRect.width - 60;
      // console.log(Math.floor(n - l));

      if (Date.now() < this.turnCooldownBorder) {
        return;
      }

      // TODO: optimize
      if (n > r) {
        this.turnPageRight();
        this.turnCooldownBorder = Date.now() + this.turnCooldownTime;
      } else if (n < l) {
        this.turnPageLeft();
        this.turnCooldownBorder = Date.now() + this.turnCooldownTime;
      }
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
          el('span', { class: 'secondaryTime' }, ` 00`),
        ),
      );
      this.timeCells.push(timeCell);
      arr2.push(timeCell);

      // test

      for (let i2 = 0; i2 < width; i2++) {
        const locked = Math.random() > 0.8;
        const exist = Math.random() > 0.7;

        const cell = new CalendarCell(
          i2,
          i,
          exist
            ? data.visits[Math.round(Math.random() * (data.visits.length - 1))]
                .client
            : null,
          this.el,
          this.id,
          locked,
        );
        cell.addEventListener('insertElement', this.insertCell.bind(this));

        arr2.push(
          el(
            'div',
            {
              class: `calendar-table-cell ${locked && !exist ? 'locked' : ''}`,
            },
            cell,
          ),
        );
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

    // launch time column width fixer
    this.updateLeftMargin();
    setInterval(() => this.updateLeftMargin(), 300);
  }

  static isInViewport(t) {
    let target = t;
    let top = target.offsetTop;
    let left = target.offsetLeft;
    const width = target.offsetWidth;
    const height = target.offsetHeight;

    while (target.offsetParent) {
      target = target.offsetParent;
      top += target.offsetTop;
      left += target.offsetLeft;
    }

    const isVisible =
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset;
    return isVisible;
  }

  updateLeftMargin() {
    this.lastTimeCellWidth = this.lastTimeCellWidth || 0;
    let maxWidth = 0;
    this.timeCells.forEach(cell => {
      maxWidth = Math.max(maxWidth, cell.clientWidth);
    });

    if (this.lastTimeCellWidth !== maxWidth) {
      console.log(this.lastTimeCellWidth, maxWidth);
      this.el.style['margin-left'] = `${maxWidth}px`;
      this.lastTimeCellWidth = maxWidth;
    }
  }

  lastDayIndexInViewport() {
    const arr = [];
    for (let i = 0; i < this.otherDays.length; i++) {
      const target = this.otherDays[i].el;
      arr.push(this.constructor.isInViewport(target));
    }
    return arr.length - 1 - arr.reverse().indexOf(true);
  }

  firstDayIndexInViewport() {
    const arr = [];
    for (let i = 0; i < this.otherDays.length; i++) {
      const target = this.otherDays[i].el;
      arr.push(this.constructor.isInViewport(target));
    }
    return arr.indexOf(true);
  }

  scrollToNextDay() {
    console.log('scroll to next day');
    let currentDayIndex = this.otherDays.findIndex(
      day => day.table.id === this.id,
    );
    if (currentDayIndex === this.otherDays.length - 1) currentDayIndex -= 1;

    const lastDayIndex = this.lastDayIndexInViewport();
    const dayToScrollIndex = lastDayIndex;
    const nextDay = this.otherDays[dayToScrollIndex];

    console.log(`scroll down to ${dayToScrollIndex}`);
    nextDay.el.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'start',
    });

    this.scrollEnded = false;
    let scrollTimeout = null;

    const callback = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        console.log('Scroll ended');
        this.scrollEnded = true;
        this.el.removeEventListener('scroll', callback);
      }, 100);
    };

    this.el.addEventListener('scroll', callback);
  }

  scrollToPreviousDay() {
    const currentDayIndex = this.otherDays.findIndex(
      day => day.table.id === this.id,
    );
    if (currentDayIndex === 0) return;

    const firstDayIndex = this.firstDayIndexInViewport();
    const dayToScrollIndex = Math.max(firstDayIndex - 1, 0);
    const nextDay = this.otherDays[dayToScrollIndex];

    console.log(`scroll down to ${dayToScrollIndex}`);
    nextDay.el.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'start',
    });

    this.scrollEnded = false;
    let scrollTimeout = null;

    const callback = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        console.log('Scroll ended');
        this.scrollEnded = true;
        this.el.removeEventListener('scroll', callback);
      }, 100);
    };

    this.el.addEventListener('scroll', callback);
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

    for (
      let x = this.scrolledCellIndex;
      x < this.scrolledCellIndex + this.cellsPerPage;
      x++
    ) {
      for (let y = 0; y < this.cells.length; y++) console.log(x, y);
    }
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
    // TODO: realize cross-days moving cells

    const { target, relatedTarget } = args;
    const px = relatedTarget.attributes['data-coord-x'].value;
    const py = relatedTarget.attributes['data-coord-y'].value;
    const dayId = relatedTarget.attributes['data-day-id'].value;
    const originDay = this.otherDays.find(day => day.table.id === dayId);
    const originTable = originDay.table;

    const targetCalendarCell = target;
    const originCalendarCell = originTable.cells[py][px];

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
  constructor(
    data: DayData,
    isFirst: boolean = false,
    otherDays: Array<CalendarDay>,
  ) {
    this.otherDays = otherDays;
    this.table = new CalendarTable(data, isFirst, otherDays);
    this.el = el(
      'div',
      { class: 'calendar-day', tabindex: 0 },
      this.table,
      new CalendarDayFooter(data),
    );
  }
}

class CalendarCard extends Card {
  constructor(data: Array<DayData>) {
    super();

    this.data = data;
    this.days = [];
    for (let i = 0; i < data.length; i++) {
      const day = new CalendarDay(data[i], i === 0, this.days);
      const child = el('div', { class: 'calendar-card' }, day);
      this.days.push(day);
      mount(this.el, child);
    }
  }
}

export default CalendarCard;
