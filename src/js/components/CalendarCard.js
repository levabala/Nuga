// import * as moment from 'moment';
import interact from 'interactjs';
import { el, mount, setChildren, setAttr } from 'redom';
import Reactor from '../scripts/reactor';
import Card from './Card';
import PersonData from '../classes/dataTypes/PersonData';
import generateConfig from '../scripts/drag';
import dropConfig from '../scripts/drop';
import DayData from '../classes/dataTypes/DayData';

// import RootVariables from '../../scss/root.scss';
import CalendarVariables from '../../scss/calendar.scss';
import ColorVariables from '../../scss/colors.scss';

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
              class: 'material-icons addButton',
            },
            'add',
          ),
          el(
            'span',
            {
              class: 'text',
            },
            'Добавить запись',
          ),
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
        el('div', {
          class: 'leftMarker',
          style: `background: ${
            Math.random() > 0.4
              ? ColorVariables[`colorMark${this.person.leftMarker}`]
              : 'none'
          }`,
        }),

        el(
          'div',
          { class: 'wrapper-block' },
          el(
            'div',
            { class: 'content-block' },
            el('img', {
              src: this.person.url,
              alt: 'Avatar',
              class: 'avatar',
              draggable: false,
            }),
          ),
        ),
        el(
          'div',
          { class: 'wrapper-block text-block' },
          el(
            'div',
            { class: 'content-block' },

            el('div', { class: 'text-info' }, [
              el(
                'div',
                { class: 'primary-info' },
                el(
                  'span',
                  { class: 'primary-info-block' },
                  `${this.person.surname} `,
                ),
                el(
                  'span',
                  { class: 'primary-info-block' },
                  el('span', { class: '' }, `${this.person.name}`),
                  el(
                    'span',
                    { class: 'visitsCount' },
                    ` ${this.person.visitsCount}`,
                  ),
                  el(
                    'span',
                    {
                      class: '',
                      style: `color: ${
                        { A: 'blue', B: 'green', C: 'red' }[this.person.grade]
                      }`,
                    },
                    ` ${this.person.grade}`,
                  ),
                ),
              ),
              el('div', { class: 'secondary-info' }, this.person.code),
            ]),
          ),
        ),
        el(
          'div',
          { class: 'wrapper-block points-block' },
          el(
            'div',
            { class: 'content-block' },
            el('span', { class: 'points' }, this.person.points),
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

    let addTimeout = null;
    const enterTime = 0; // 100;

    // FIXIT: blinking when point on bottom border
    this.el.addEventListener('mouseenter', () => {
      if (this.locked || this.el.parentNode.classList.contains('readyToAdd'))
        return;

      addTimeout = setTimeout(() => {
        if (this.personCell.mock) {
          this.el.parentNode.classList.add('readyToAdd');
          setChildren(this.container, new ReadyToAddCell());
        }
      }, enterTime);
    });

    this.el.addEventListener('mouseleave', () => {
      if (this.locked) return;
      // return;

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
    interact(this.personCell.el).styleCursor(false);
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
    this.lastTableWidth = 0;

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
    this.el.addEventListener('draggableMoved', event => {
      const target = event.detail;
      const targetBoundRect = target.getBoundingClientRect();
      const targetBottomBorder = targetBoundRect.y + targetBoundRect.height;
      const targetTopBorder = targetBoundRect.y;
      const windowHeight = window.innerHeight;

      // console.log(Math.round(targetBottomBorder), Math.round(windowHeight));
      // console.log(Math.round(targetTopBorder), 0);

      if (Date.now() < this.turnCooldownBorder) return;

      if (targetBottomBorder > windowHeight) {
        this.scrollToNextDay();
        this.turnCooldownBorder = Date.now() + cooldownAfterScroolMax;
        console.log(this.id);
        return;
      }

      if (targetTopBorder < 0) {
        this.scrollToPreviousDay();
        this.turnCooldownBorder = Date.now() + cooldownAfterScroolMax;
        console.log(this.id);
        return;
      }

      const boundRect = this.el.getBoundingClientRect();
      const l = (targetBoundRect.width / 3) * 2;
      const n = targetBoundRect.x + targetBoundRect.width / 2;
      const r = boundRect.x + boundRect.width - targetBoundRect.width / 3;
      // console.log(Math.floor(n - l));

      const index = this.getTableByY(target);
      if (index === -1) return;

      const targetTable = this.otherDays[index];

      // console.log(Math.round(l), Math.round(n), Math.round(r));
      // TODO: optimize
      if (n > r) {
        this.constructor.turnPageRight(targetTable);
        this.turnCooldownBorder = Date.now() + this.turnCooldownTime;
      } else if (n < l) {
        this.constructor.turnPageLeft(targetTable);
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
    const positionsRow = el(
      'div',
      { class: 'calendar-table-row' },
      positionCells,
    );
    // arr.push(el('div', { class: 'calendar-table-row' }, positionCells));

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
        const locked = Math.random() > 1; // 0.8;
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
            // el('div', { class: 'calendar-additional-border' }),
          ),
        );
        this.cells[i].push(cell);
      }

      arr.push(el('div', { class: 'calendar-table-row' }, arr2));
    }

    setChildren(this.el, [positionsRow, arr]);

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

    // launch js-performable layout fixers
    setTimeout(() => this.updateLayout(), 0);
    setInterval(() => this.updateLayout(), 300);
  }

  getTableByY(element) {
    // const bodyRect = document.body.getBoundingClientRect();
    const targetRect = element.getBoundingClientRect();
    const targetTop = targetRect.top;

    for (let i = 0; i < this.otherDays.length; i++) {
      const rect = this.otherDays[i].table.el.getBoundingClientRect();
      const dayTop = rect.top;
      const dayBottom = rect.bottom;
      // console.log(Math.round(targetTop), Math.round(dayTop));
      if (targetTop > dayTop && targetTop < dayBottom) {
        // console.log(`TURNING: ${i}`);
        return i;
      }
    }

    return -1;
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

  updateLayout() {
    // this.updateLeftMargin();
    this.updateCellsPerPage();
    this.updateTableWidth();
  }

  updateCellsPerPage() {
    const cardRect = this.el.parentNode.parentNode.getBoundingClientRect();
    const tableRect = this.el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const leftBorder = tableRect.x;
    const rightBorder = bodyRect.width - cardRect.x;
    const potentialWidth = rightBorder - leftBorder;
    const cellWidth = parseInt(CalendarVariables.calendarCellWidthReal, 10);

    const pagesCount = potentialWidth / cellWidth;

    this.cellsPerPage = Math.floor(pagesCount);
  }

  updateTableWidth() {
    function calcWidth(cellsPerPage) {
      const cellWidthReal = parseInt(
        CalendarVariables.calendarCellWidthReal,
        10,
      );
      // const borderSize = parseInt(RootVariables.thinBorderSize, 10);
      // return cellWidth * cellsPerPage + borderSize * 3;
      return cellWidthReal * cellsPerPage;
    }

    const width = Math.ceil(calcWidth(this.cellsPerPage));

    if (width === this.lastTableWidth) return;
    this.lastTableWidth = width;

    this.el.style.width = `${width}px`;
    setTimeout(() => this.updateVisibleCells());
  }

  // UNUSABLE
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
    // TODO: optimize

    // #1 find first which top < w.height and bottom > w.height
    for (let i = 0; i < this.otherDays.length; i++) {
      const target = this.otherDays[i].el;
      const rect = target.getBoundingClientRect();
      if (
        rect.top < window.innerHeight &&
        rect.bottom > window.innerHeight + rect.height / 3
      )
        return i;
    }

    // #2 find first which top > w.height
    for (let i = 0; i < this.otherDays.length; i++) {
      const target = this.otherDays[i].el;
      const rect = target.getBoundingClientRect();
      if (rect.top > window.innerHeight) return i;
    }

    return this.otherDays.length - 1;
  }

  firstDayIndexInViewport() {
    // TODO: optimize

    // #1 find last which top < 0 and bottom > 0
    for (let i = this.otherDays.length - 1; i > 0; i--) {
      const target = this.otherDays[i].el;
      const rect = target.getBoundingClientRect();
      if (rect.top < -rect.height / 3 && rect.bottom > 0) return i;
    }

    // #2 find first which bottom < 0
    for (let i = this.otherDays.length - 1; i > 0; i--) {
      const target = this.otherDays[i].el;
      const rect = target.getBoundingClientRect();
      if (rect.bottom <= 0) return i;
    }

    return 0;
  }

  scrollToNextDay() {
    console.log('scroll to next day');
    let currentDayIndex = this.otherDays.findIndex(
      day => day.table.id === this.id,
    );
    if (currentDayIndex === this.otherDays.length - 1) currentDayIndex -= 1;

    const lastDayIndex = this.lastDayIndexInViewport();
    const dayToScrollIndex = Math.min(lastDayIndex, this.otherDays.length);
    const nextDay = this.otherDays[dayToScrollIndex];

    console.log(`scroll up to ${dayToScrollIndex}`);
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
        window.removeEventListener('scroll', callback);
      }, 100);
    };

    window.addEventListener('scroll', callback);
  }

  scrollToPreviousDay() {
    const currentDayIndex = this.otherDays.findIndex(
      day => day.table.id === this.id,
    );
    if (currentDayIndex === 0) return;

    const firstDayIndex = this.firstDayIndexInViewport();
    const dayToScrollIndex = Math.max(firstDayIndex, 0);
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
        window.removeEventListener('scroll', callback);
      }, 100);
    };

    window.addEventListener('scroll', callback);
  }

  updateTableScrool() {
    console.log(
      `scroll to index ${this.scrolledCellIndex}(${this.scrolledCellIndex +
        1})`,
    );
    const element = this.cells[0][this.scrolledCellIndex].el;
    element.parentNode.scrollIntoView({
      behavior: 'smooth',
      inline: 'start', // forward ? 'start' : 'end',
      block: 'nearest',
    });

    /*
    let timeout = null;
    const interval = 500;
    const processor = () => {
      clearTimeout(timeout);

      const fixer = () => {
        // this.el.scrollLeft -= 100;
        this.el.removeEventListener('scroll', processor);
      };
      timeout = setTimeout(fixer, interval);
    };
    this.el.addEventListener('scroll', processor);
    */

    // force updating left margin
    /*
    setTimeout(() => {
      console.log('update!');
      const table = element.parentNode.parentNode.parentNode;
      const styles = getComputedStyle(table);
      const marginLeft = styles.getPropertyValue('margin-left');
      console.log(marginLeft);
      table.style['margin-left'] = marginLeft;
    }); */

    this.updateVisibleCells();
  }

  updateVisibleCells() {
    const leftVisibleBorder = Math.min(
      this.scrolledCellIndex,
      this.cells[0].length - this.cellsPerPage,
    );
    console.log(leftVisibleBorder, this.scrolledCellIndex + this.cellsPerPage);
    for (let y = 0; y < this.cells.length; y++)
      for (let x = 0; x < this.cells[0].length; x++) {
        const cell = this.cells[y][x];
        if (
          x >= leftVisibleBorder &&
          x < this.scrolledCellIndex + this.cellsPerPage
        )
          cell.el.parentNode.classList.remove('hidden');
        // if (!cell.personCell.el.classList.contains('isDragging'))
        else cell.el.parentNode.classList.add('hidden');
      }
  }

  static turnPageRight(t) {
    const target = t.table;
    console.log(target.scrolledCellIndex);

    target.scrolledCellIndex = Math.min(
      target.scrolledCellIndex + target.cellsPerPage,
      target.cells[0].length - 1,
    );
    target.lastScrollDirection = 'start';
    target.updateTableScrool(true);
  }

  static turnPageLeft(t) {
    const target = t.table;
    console.log(target.scrolledCellIndex);
    target.scrolledCellIndex = Math.max(
      target.scrolledCellIndex - target.cellsPerPage,
      0,
    );
    target.lastScrollDirection = 'end';
    target.updateTableScrool(false);
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
