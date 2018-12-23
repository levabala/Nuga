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
    this.data = data;
    this.isFirst = isFirst;
    this.otherDays = otherDays;

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

    window.addEventListener('keydown', e => {
      console.log(e.code);
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

    /*
    stickybits('.calendar-card', {
      scrollEl: 'calendar-container',
    });
    */
  }

  turnPageRight() {
    this.scrollableArea.scrollLeft += 100;
  }

  turnPageLeft() {
    this.scrollableArea.scrollLeft -= 100;
  }
}

export default CalendarTable;
