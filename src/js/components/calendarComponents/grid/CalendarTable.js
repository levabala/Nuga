import { el } from 'redom';
// import stickybits from 'stickybits';
import DayData from '../../../classes/dataTypes/DayData';
import '../../../../scss/calendarGrid.scss';

class CalendarTable {
  constructor(
    data: DayData,
    isFirst: boolean,
    otherDays: Array<CalendarTable>,
  ) {
    this.isFirst = isFirst;
    this.otherDays = otherDays;
    this.minElWidth = 100;

    this.setData(data);

    window.addEventListener('keydown', e => {
      switch (e.code) {
        case 'ArrowRight':
          this.turnPageRight();
          break;
        case 'ArrowLeft':
          this.turnPageLeft();
          break;
        default:
          break;
      }
    });
  }

  setPositionsCount(count) {
    this.layoutInfo.positionsCount = count;
    this.layoutComponents.wrapper.style.setProperty('--positions-count', count);
  }

  setMainGridWidth(width) {
    this.layoutComponents.calendarTable.style.setProperty(
      '--calendar-main-width',
      `${width}px`,
    );
  }

  /* eslint-disable-next-line */
  updateMainWidth() {
    const calcPositionsPerPage = (wrapperWidth, minElWidth) => {};

    const calcMainWidth = (positionsCount, wrapper, minElWidth) => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperWidth = rect.width;
      const positionsPerPage = calcPositionsPerPage(wrapperWidth, minElWidth);
      // const pagesCount = Math.ceil(positionsCount / positionsPerPage);
      const elWidth = wrapperWidth / positionsPerPage;
      const width = elWidth * positionsCount;

      return width;
    };

    /*
    [
      this.layoutInfo.positionsCount,
      this.layoutComponents.wrapper,
      this.minElWidth,
    ]
      |> ([positionsCount, wrapper, minElWidth]) => calcMainWidth)
      |> this.setMainGridWidth;
      */
  }

  setData(data: DayData) {
    this.data = data;

    const timeStamps = 3;
    const positionsCount = 5;

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
    };

    this.layoutComponents = {
      calendarTable: this.el,
      mainGrid,
      wrapper,
      timeColumn,
      positionsRow,
    };

    this.setPositionsCount(this.layoutInfo.positionsCount);
    this.updateMainWidth();
  }

  turnPageRight() {
    this.scrollableArea.scrollLeft += 100;
  }

  turnPageLeft() {
    this.scrollableArea.scrollLeft -= 100;
  }
}

export default CalendarTable;
