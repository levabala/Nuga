import { el } from 'redom';
import DayData from '../../../classes/dataTypes/DayData';
import '../../../../scss/calendarGrid.scss';
import RootVariables from '../../../../scss/root.scss';

class CalendarTable {
  constructor(
    data: DayData,
    isFirst: boolean,
    otherDays: Array<CalendarTable>,
  ) {
    this.isFirst = isFirst;
    this.otherDays = otherDays;

    this.setData(data);

    window.addEventListener('keydown', e => {
      switch (e.code) {
        case 'ArrowRight':
          // this.turnPageRight();
          break;
        case 'ArrowLeft':
          // this.turnPageLeft();
          break;
        default:
          break;
      }
    });

    let updateTimeout = null;
    const updateIntervalLength = 100;
    window.addEventListener('resize', () => {
      const updateAll = () => {
        setTimeout(() => {
          this.updateAll();
        }, 0);

        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          updateTimeout = null;
        }, updateIntervalLength);
      };

      if (updateTimeout === null) updateAll();
    });

    window.addEventListener('scroll', () => {
      this.scrollHandler();
    });

    const totalUpdateInterval = 501;
    setInterval(this.updateAll.bind(this), totalUpdateInterval);
  }

  scrollHandler() {
    const rect = this.layoutComponents.calendarTable.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > 0) {
      this.makePositionsUnSticky();
      return;
    }

    if (rect.top < 1 && rect.bottom > 0) this.makePositionsSticky();

    if (this.layoutInfo.positionsRowSticky) {
      const rowRect = this.layoutComponents.stickyRowContainer.getBoundingClientRect();
      if (rect.bottom <= rowRect.height) this.dockPositionsBottom();
      else this.unDockPositionsBottom();
    }

    // TODO: make checks every N pixels
    this.tryToHide();
  }

  makePositionsUnSticky() {
    this.layoutInfo.positionsRowSticky = false;

    if (this.layoutComponents.stickyRowContainer) {
      // console.log('unsticky!');
      this.layoutComponents.stickyRowContainer.remove();
      this.layoutComponents.stickyRowContainer = false;
    }
  }

  dockPositionsBottom() {
    if (
      !this.layoutComponents.stickyRowContainer.classList.contains('dockBottom')
    ) {
      // console.log('dock bottom');
      this.layoutComponents.stickyRowContainer.classList.add('dockBottom');
    }
  }

  unDockPositionsBottom() {
    if (
      this.layoutComponents.stickyRowContainer.classList.contains('dockBottom')
    ) {
      // console.log('undock bottom');
      this.layoutComponents.stickyRowContainer.classList.remove('dockBottom');
    }
  }

  makePositionsSticky() {
    if (this.layoutInfo.positionsRowSticky) return;

    console.log('sticky!');

    const clonedRow = this.layoutComponents.positionsRow.cloneNode(true);
    const rowContainer = el(
      'div',
      {
        class: 'stickyContainer',
      },
      clonedRow,
    );

    this.layoutComponents.wrapper.appendChild(rowContainer);

    this.layoutInfo.positionsRowSticky = true;
    this.layoutComponents.stickyRowContainer = rowContainer;
  }

  updateAll() {
    this.updateMainWidth();
  }

  tryToHide() {
    const rect = this.layoutComponents.calendarTable.getBoundingClientRect();
    const buffer = rect.height * 2;
    const couldHide =
      rect.top < -buffer || rect.bottom > window.innerHeight + buffer;

    if (couldHide) this.layoutComponents.calendarTable.classList.add('hidden');
    else this.layoutComponents.calendarTable.classList.remove('hidden');
  }

  setPositionsCount(count) {
    this.layoutInfo.positionsCount = count;
    this.layoutComponents.wrapper.style.setProperty('--positions-count', count);
  }

  setMainFullWidth(width) {
    const val = this.layoutComponents.calendarTable.style.getPropertyValue(
      '--calendar-main-width',
    );

    if (val === width) return;

    this.layoutComponents.calendarTable.style.setProperty(
      '--calendar-main-width',
      `${width}px`,
    );
  }

  setWrapperWidth(width) {
    const val = this.layoutComponents.calendarTable.style.getPropertyValue(
      '--wrapper-width',
    );

    if (val === width) return;

    this.layoutComponents.calendarTable.style.setProperty(
      '--wrapper-width',
      `${width}px`,
    );
  }

  updateMainWidth() {
    const calcPositionsPerPage = (wrapperWidth, minElWidth, positionsCount) =>
      Math.min(Math.floor(wrapperWidth / minElWidth), positionsCount);

    const calcMainWidth = ([positionsCount, wrapper, minElWidth]) => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperWidth = rect.width;
      if (wrapperWidth === 0) return 0;

      const positionsPerPage = calcPositionsPerPage(
        wrapperWidth,
        minElWidth,
        positionsCount,
      );
      const elWidth = wrapperWidth / positionsPerPage;
      const pagesCount = Math.ceil(positionsCount / positionsPerPage);
      const width =
        elWidth * positionsCount + parseFloat(RootVariables.thinBorderSize) * 2;

      this.layoutInfo.positionsPerPage = positionsPerPage;
      this.layoutInfo.pageIndexMax = pagesCount;
      this.layoutInfo.mainGridWidth = wrapperWidth;
      this.layoutInfo.mainGridWidthInner =
        wrapperWidth + parseFloat(RootVariables.thinBorderSize);

      this.setWrapperWidth(wrapperWidth);

      return width;
    };

    /* eslint-disable-next-line no-unused-expressions */
    [
      this.layoutInfo.positionsCount,
      this.layoutComponents.wrapper,
      this.layoutInfo.minElWidth,
    ]
      |> calcMainWidth
      |> this.setMainFullWidth;
  }

  setData(data: DayData) {
    this.data = data;

    const timeStamps = 5;
    const positionsCount = 11;

    const items = [];
    const times = [el('div', { class: 'item' }, '')];
    const positions = [];

    for (let i = 0; i < positionsCount; i++) {
      const positionCell = el('div', { class: 'item' }, `p${i}`);
      positions.push(positionCell);
    }

    for (let i = 0; i < positionsCount * timeStamps; i++) {
      const item = el('div', { class: 'item' }, i);
      items.push(item);

      if (i % positionsCount === 0) {
        const timeCell = el('div', { class: 'item' }, `t${i / positionsCount}`);
        times.push(timeCell);
      }
    }

    const mainGrid = el('div', { class: 'mainGrid' }, items);
    const timeColumn = el('div', { class: 'timeColumn' }, times);
    const positionsRow = el('div', { class: 'positionsRow' }, positions);
    const wrapper = el('div', { class: 'wrapper' }, [positionsRow, mainGrid]);

    this.scrollableArea = wrapper;

    this.el = el(
      'div',
      {
        class: 'calendarTable',
      },
      [timeColumn, wrapper],
    );

    this.layoutInfo = {
      timeStamps,
      positionsCount,
      mainGridWidth: 0,
      mainGridWidthInner: 0,
      minElWidth: 100,
      pageIndex: 0,
      pageIndexMax: 1,
      positionsPerPage: 1,
      positionsRowSticky: false,
    };

    this.layoutComponents = {
      calendarTable: this.el,
      cells: items,
      mainGrid,
      wrapper,
      timeColumn,
      positionsRow,
      stickyRowContainer: el('div'),
    };

    this.setPositionsCount(this.layoutInfo.positionsCount);
    setTimeout(() => this.updateMainWidth(), 0);
  }

  turnPageRight() {
    this.layoutInfo.pageIndex += 1;
    this.layoutInfo.pageIndex = Math.max(
      0,
      Math.min(this.layoutInfo.pageIndex, this.layoutInfo.pageIndexMax),
    );
    this.updatePageScroll();
  }

  turnPageLeft() {
    this.layoutInfo.pageIndex -= 1;
    this.layoutInfo.pageIndex = Math.max(
      0,
      Math.min(this.layoutInfo.pageIndex, this.layoutInfo.pageIndexMax),
    );
    this.updatePageScroll();
  }

  updatePageScroll() {
    const targetElementIndex =
      this.layoutInfo.positionsPerPage * this.layoutInfo.pageIndex;
    const targetElement = this.layoutComponents.cells[targetElementIndex];

    targetElement.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }
}

export default CalendarTable;
