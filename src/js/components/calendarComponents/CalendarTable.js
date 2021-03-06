import { el, setAttr, setChildren } from 'redom';
import DayData from '../../classes/dataTypes/DayData';
import CalendarTableCell from './CalendarTableCell';
import CalendarCell from './CalendarCell';
import RootVariables from '../../../scss/root.scss';
import CalendarVariables from '../../../scss/calendar.scss';

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
    const height = 10;
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
    this.firstLoadIteration = true;

    const cooldownAfterScroolMax = 1000;
    this.el.addEventListener('draggableMoved', event => {
      const target = event.detail;
      const targetBoundRect = target.getBoundingClientRect();
      const targetBottomBorder = targetBoundRect.y + targetBoundRect.height;
      const targetTopBorder = targetBoundRect.y;
      const windowHeight = window.innerHeight;

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

      const index = this.getTableByY(target);
      if (index === -1) return;

      const targetTable = this.otherDays[index];

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
      { class: 'calendar-table-row positions' },
      positionCells,
    );

    // create main grid
    for (let i = 0; i < height; i++) {
      const arr2 = [];
      this.cells.push([]);

      // create time cell
      const timeCell = el(
        'div',
        {
          class: 'calendar-table-cell timeCell ',
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

        cell.registerEvent('insertElement');
        cell.addEventListener('insertElement', this.insertCell.bind(this));

        arr2.push(new CalendarTableCell(cell, locked && !exist));
        this.cells[i].push(cell);
      }

      const finalizeMockCell = new CalendarCell(
        width,
        i,
        null,
        this.el,
        this.id,
        false,
      );

      arr2.push(finalizeMockCell);

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

    this.resizeFinishTimeout = null;
    this.resizeFinishTime = 100;
    this.isResizing = false;
    window.addEventListener('resize', this.hadleResizing.bind(this));
  }

  // UNUSABLE
  hadleResizing() {
    clearTimeout(this.resizeFinishTimeout);
    this.isResizing = true;

    this.resizeFinishTimeout = setTimeout(() => {
      console.log('resize end');
      this.isResizing = false;
    }, this.resizeFinishTime);
  }

  getTableByY(element) {
    const targetRect = element.getBoundingClientRect();
    const targetTop = targetRect.top;

    for (let i = 0; i < this.otherDays.length; i++) {
      const rect = this.otherDays[i].table.el.getBoundingClientRect();
      const dayTop = rect.top;
      const dayBottom = rect.bottom;
      if (targetTop > dayTop && targetTop < dayBottom) {
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
    if (this.isResizing) return;

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
    this.cellsPerPage = Math.min(this.cellsPerPage, this.cells[0].length);
  }

  static updateCellsWidth(widthPerCell) {
    const eps = 5;
    const lastCellWidth = document.documentElement.style.getPropertyValue(
      '--calendar-cell-width',
    );

    if (Math.abs(widthPerCell - lastCellWidth) < eps) return;

    document.documentElement.style.setProperty(
      '--calendar-cell-width',
      `${widthPerCell}px`,
    );
    document.documentElement.style.setProperty(
      '--calendar-cell-width-real',
      `${widthPerCell + parseFloat(RootVariables.thinBorderSize) * 2}px`,
    );
  }

  tryUpdateCellsWidth() {
    const borderSize = parseInt(RootVariables.thinBorderSize, 10);
    const widthPerCell = Math.floor(
      (this.lastTableWidth - borderSize * 2) / this.cellsPerPage -
        borderSize * 2,
    );

    this.constructor.updateCellsWidth(widthPerCell);
  }

  updateTableWidth() {
    function calcWidth() {
      const paddingCard = parseInt(RootVariables.paddingCard, 10);
      const card = this.el.parentNode.parentNode;
      const cardRect = card.getBoundingClientRect();
      const potentialWidth = cardRect.width - paddingCard * 2;
      return potentialWidth;
    }

    const width = Math.ceil(calcWidth.bind(this)(this.cellsPerPage));

    if (width === this.lastTableWidth) return;
    this.lastTableWidth = width;
    this.tryUpdateCellsWidth();

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
    this.scrolledCellIndex = Math.max(
      Math.min(
        this.scrolledCellIndex,
        this.cells[0].length - this.cellsPerPage,
      ),
      0,
    );

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

    let timeout = null;
    const interval = 200;
    const processor = () => {
      clearTimeout(timeout);

      const fixer = () => {
        const tableRect = this.el.getBoundingClientRect();
        const cellRect = element.getBoundingClientRect();
        const diff = cellRect.x - tableRect.x;
        setTimeout(() => {
          this.el.scrollLeft -= diff;
        });
        this.el.removeEventListener('scroll', processor);
      };
      timeout = setTimeout(fixer, interval);
    };
    this.el.addEventListener('scroll', processor);

    this.updateVisibleCells();
  }

  updateVisibleCells() {
    const leftVisibleBorder = Math.min(
      this.scrolledCellIndex,
      this.cells[0].length - this.cellsPerPage,
    );

    for (let y = 0; y < this.cells.length; y++)
      for (let x = 0; x < this.cells[0].length; x++) {
        const cell = this.cells[y][x];

        if (
          x >= leftVisibleBorder &&
          x < this.scrolledCellIndex + this.cellsPerPage
        )
          cell.el.parentNode.classList.remove('hidden');
        else {
          if (this.firstLoadIteration)
            cell.el.parentNode.classList.add('immediately');

          cell.el.parentNode.classList.add('hidden');
        }
        if (!this.firstLoadIteration)
          cell.el.parentNode.classList.remove('immediately');
      }

    this.firstLoadIteration = false;
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

export default CalendarTable;
