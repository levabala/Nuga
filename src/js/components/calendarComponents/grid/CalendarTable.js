import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { el } from 'redom';
import { Reactor } from 'assemblies';
import DayData from '../../../classes/dataTypes/DayData';
import '../../../../scss/calendarGrid.scss';
import RootVariables from '../../../../scss/root.scss';

const moment = extendMoment(Moment);

class CalendarTable extends Reactor {
  layoutInfo: {
    timeStamps: number,
    positionsCount: number,
    mainGridWidth: number,
    mainGridWidthInner: number,
    minElWidth: number,
    pageIndex: number,
    pageIndexMax: number,
    positionsPerPage: number,
    scrollTriggerTimeout: number,
    lastWindowScroll: number,
    positionsRowSticky: boolean,
    hidden: boolean,
    loaded: boolean,
  };

  layoutComponents: {
    calendarTable: HTMLElement,
    cells: Array<HTMLElement>,
    mainGrid: HTMLElement,
    wrapper: HTMLElement,
    timeColumn: HTMLElement,
    positionsRow: HTMLElement,
    stickyRowContainer: HTMLElement,
    stickyRowGrid: HTMLElement,
  };

  constructor(
    data: DayData,
    isFirst: boolean,
    otherDays: Array<CalendarTable>,
  ) {
    super();

    this.isFirst = isFirst;
    this.otherDays = otherDays;
    this.layoutInfo = {
      hidden: false,
      loaded: false,
    };
    this.layoutComponents = {};

    this.registerEvent('visibilityChanged');

    this.setData(data);

    window.addEventListener('keydown', e => {
      switch (e.code) {
        case 'ArrowRight':
          if (this.isBodyPercentInViewByHeight(0.4)) this.turnPageRight();
          break;
        case 'ArrowLeft':
          if (this.isBodyPercentInViewByHeight(0.4)) this.turnPageLeft();
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
    const lastWindowScroll = this.layoutInfo.lastWindowScroll || window.scrollY;
    const scrollTriggerTimeout = this.layoutInfo.scrollTriggerTimeout || 0;

    const delta = Math.abs(window.scrollY - lastWindowScroll);
    const newScrollTrigger = scrollTriggerTimeout - delta;

    this.layoutInfo.lastWindowScroll = window.scrollY;

    const rect = this.layoutComponents.calendarTable.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const newDelta = Math.abs(rect.top - bodyRect.top);

    if (rect.bottom < 0 || rect.top > 0) {
      this.makePositionsUnSticky();

      // console.log(Math.floor(newScrollTrigger));
      if (newScrollTrigger > 0) {
        this.layoutInfo.scrollTriggerTimeout = newScrollTrigger;
        // return;
      }

      // console.log('innnnnnn');
      this.layoutInfo.scrollTriggerTimeout = newDelta;

      // TODO: make checks every N pixels
      this.tryToHide(rect);
      return;
    }

    if (rect.top < 1 && rect.bottom > 0) this.makePositionsSticky();

    if (this.layoutInfo.positionsRowSticky) {
      const rowRect = this.layoutComponents.stickyRowContainer.getBoundingClientRect();
      if (rect.bottom <= rowRect.height) this.dockPositionsBottom();
      else this.unDockPositionsBottom();
    }
  }

  makePositionsUnSticky() {
    this.layoutInfo.positionsRowSticky = false;

    if (this.layoutComponents.stickyRowContainer) {
      // this.layoutComponents.stickyRowContainer.remove();
      // console.log('unsticky');
      this.layoutComponents.stickyRowContainer.classList.add('hidden');
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

    if (this.layoutComponents.stickyRowContainer) {
      this.layoutComponents.stickyRowContainer.classList.remove('hidden');
      this.layoutInfo.positionsRowSticky = true;

      this.updatePageScroll(true);

      return;
    }

    // console.log('sticky!');

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
    this.layoutComponents.stickyRowGrid = clonedRow;
  }

  updateAll() {
    this.updateMainWidth();
  }

  tryToHide(rect: DOMRect) {
    // DEBUG_VAR
    if (window.freezedHiding) return;

    // const rect = this.layoutComponents.calendarTable.getBoundingClientRect();
    const buffer = rect.height * 2;
    const couldHide =
      rect.top < -buffer || rect.bottom > window.innerHeight + buffer;

    const lastState = this.layoutComponents.calendarTable.classList.contains(
      'hidden',
    );
    if (couldHide) {
      this.layoutComponents.calendarTable.classList.add('hidden');
      this.layoutInfo.hidden = true;
    } else {
      this.layoutComponents.calendarTable.classList.remove('hidden');
      this.layoutInfo.hidden = false;
    }

    if (lastState !== this.layoutInfo.hidden) {
      this.dispatchEvent('visibilityChanged', {
        hidden: this.layoutInfo.hidden,
      });
    }

    // TODO: freeze listeners&scrolling
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
      this.layoutInfo.pageIndexMax = pagesCount - 1;
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
    function generatePositionsRow(
      prefix: string,
      range: [number, number],
    ): HTMLElement {
      const positions = [];

      for (let i = range[0]; i <= range[1]; i++) {
        const positionCell = el('div', { class: 'item' }, `Position ${i}`);
        positions.push(positionCell);
      }

      return el('div', { class: 'positionsRow' }, positions);
    }

    function generateTimeColumn(
      range: [moment.Moment, moment.Moment],
      interval: [number, string], // amount, metric unit
    ): HTMLElement {
      const timeRange = moment.range(...range);
      const timeSteps = Array.from(
        timeRange.by(interval[1], { step: interval[0] }),
      );

      const times = [el('div', { class: 'item' }, '')].concat(
        timeSteps.map(stamp =>
          el('div', { class: 'item' }, `${stamp.format('HH:mm')}`),
        ),
      );

      return el('div', { class: 'timeColumn' }, times);
    }

    function generateGrid(positionsCount, timesCount) {
      const items = [];
      let id = 0;
      for (let y = 0; y < timesCount; y++)
        for (let x = 0; x < positionsCount; x++) {
          const item = el('div', { class: 'item' }, `${x}:${y} #${id}`);
          items.push(item);

          id++;
        }

      return el('div', { class: 'mainGrid' }, items);
    }

    this.data = data;

    const timeStamps = 10;
    const positionsCount = 15;

    const testStart = moment()
      .startOf('day')
      .hours(7);
    const testEnd = moment()
      .startOf('day')
      .hours(15);
    const range = [testStart, testEnd];
    const interval = [60, 'minutes'];

    const timeColumn = generateTimeColumn(range, interval);
    const positionsRow = generatePositionsRow('Position', [1, positionsCount]);
    const mainGrid = generateGrid(
      positionsRow.childElementCount,
      timeColumn.childElementCount - 1, // -1 because of 1 mock time cell in left-top corner
    );
    const wrapper = el('div', { class: 'wrapper' }, [positionsRow, mainGrid]);

    this.scrollableArea = wrapper;

    this.el = el(
      'div',
      {
        class: 'calendarTable unloaded',
      },
      [timeColumn, wrapper],
    );

    Object.assign(this.layoutInfo, {
      timeStamps,
      positionsCount,
      mainGridWidth: 0,
      mainGridWidthInner: 0,
      minElWidth: 200,
      pageIndex: 0,
      pageIndexMax: 1,
      positionsPerPage: 1,
      positionsRowSticky: false,
    });

    this.layoutComponents = {
      calendarTable: this.el,
      cells: mainGrid.children,
      mainGrid,
      wrapper,
      timeColumn,
      positionsRow,
      stickyRowContainer: false,
    };

    this.setPositionsCount(this.layoutInfo.positionsCount);
    setTimeout(() => this.initLayout(), 0);
  }

  initLayout() {
    this.updateMainWidth();
    this.layoutInfo.loaded = true;

    this.el.classList.remove('unloaded');
  }

  isInViewport() {
    const rect = this.el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  isBodyPercentInViewByHeight(percent: number) {
    const rect = this.el.getBoundingClientRect();
    const realHeight = rect.height;
    const viewingHeight =
      Math.min(window.innerHeight, rect.bottom) - Math.max(rect.top, 0);
    const coeff = viewingHeight / realHeight;

    return coeff > percent;
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

  updatePageScroll(immediately = false) {
    const targetElementIndex = Math.min(
      this.layoutInfo.positionsPerPage * this.layoutInfo.pageIndex,
      this.layoutInfo.positionsCount - 1,
    );
    const targetElement = this.layoutComponents.cells[targetElementIndex];

    /*
    targetElement.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    }); 
    */

    const scrollLeft = targetElement.offsetLeft; //  + parseFloat(RootVariables.thinBorderSize);

    this.layoutComponents.wrapper.scrollTo({
      top: 0,
      left: scrollLeft,
      behavior: immediately ? 'auto' : 'smooth',
    });

    if (this.layoutInfo.positionsRowSticky) {
      const container = this.layoutComponents.stickyRowContainer;
      const row = this.layoutComponents.stickyRowGrid;
      if (!row || !container) return;

      const targetElementSticky = row.children[targetElementIndex];

      container.scrollTo({
        top: 0,
        left: targetElementSticky.offsetLeft,
        behavior: immediately ? 'auto' : 'smooth',
      });
    }
  }
}

export default CalendarTable;
