import interact from 'interactjs';
import { el, mount } from 'redom';
import Card from './Card';
import DayData from '../classes/dataTypes/DayData';
import CalendarDay from './calendarComponents/CalendarDay';

interact.dynamicDrop(true);

class CalendarCard extends Card {
  days: Array<CalendarDay>;

  constructor(
    data: Array<DayData>,
    requestTopDay: () => ?void = () => null,
    requestBottomDay: () => ?void = () => null,
  ) {
    super();

    this.data = data;
    this.requestTopDay = requestTopDay;
    this.requestBottomDay = requestBottomDay;
    this.days = [];
    this.stickyPositionsRow = null;

    const averageIndex = Math.floor(this.data.length / 2);
    this.loadedBorder = [averageIndex, averageIndex];

    const day = new CalendarDay(
      data[averageIndex],
      averageIndex === 0,
      this.days,
    );
    const child = el('div', { class: 'calendar-card' }, day);
    this.days.push(day);
    mount(this.el, child);

    window.addEventListener('scroll', this.handleVerticalBorders.bind(this));

    this.handleVerticalBorders();
  }

  handleVerticalBorders() {
    const bodyRect = document.body.getBoundingClientRect();
    const trigger = window.innerHeight;

    // check top border
    const needLoadTop = -bodyRect.y < trigger;
    if (needLoadTop) this.loadTopDay();

    // check bottom border
    const diff = bodyRect.bottom - window.innerHeight;
    const needLoadBottom = diff < trigger;
    if (needLoadBottom) this.loadBottomDay();

    if (needLoadTop || needLoadBottom)
      setTimeout(() => this.handleVerticalBorders());
  }

  loadTopDay() {
    let topIndex = this.loadedBorder[0] - 1;
    if (topIndex < 0) {
      const topDay = this.requestTopDay(this.data[0]);
      if (topDay === null) return;

      topIndex++;
      this.data.unshift(topDay);
    }

    this.loadedBorder[0] = topIndex;

    const day = new CalendarDay(this.data[topIndex], topIndex === 0, this.days);
    const child = el('div', { class: 'calendar-card' }, day);
    this.days.unshift(day);
    mount(this.el, child, this.el.children[0]);

    if (window.scrollY === 0) {
      const cardRect = this.days[0].el.getBoundingClientRect();
      const scrollHeightTarget = cardRect.height;
      window.scrollTo(0, scrollHeightTarget);
    }

    console.log('Loaded TOP day');
  }

  loadBottomDay() {
    const bottomIndex = this.loadedBorder[1] + 1;
    if (bottomIndex >= this.data.length) {
      const bottomDay = this.requestBottomDay(this.data[this.data.length - 1]);
      if (bottomDay === null) return;

      this.data.push(bottomDay);
    }

    this.loadedBorder[1] = bottomIndex;

    const day = new CalendarDay(
      this.data[bottomIndex],
      bottomIndex === 0,
      this.days,
    );
    const child = el('div', { class: 'calendar-card' }, day);
    this.days.push(day);
    mount(this.el, child);

    console.log('Loaded BOTTOM day');
  }

  // UNUSABLE
  hadleResizing() {
    clearTimeout(this.resizeFinishTimeout);

    this.resizeFinishTimeout = setTimeout(() => {
      console.log('resize end');
      this.days[0].table.tryUpdateCellsWidth();
    }, this.resizeFinishTime);
  }

  // DEPRECATED
  makePositionsStickyAgain() {
    function stickPositionsRow(tableEl) {
      const row = tableEl.querySelector('.calendar-table-row.positions');

      row.style.position = 'sticky';
      row.style.top = 0;
      row.style.left = 0;
      row.style['z-index'] = 100;
    }

    for (let i = 0; i < this.days.length; i++) {
      const tableEl = this.days[i].table.el;
      const rect = tableEl.getBoundingClientRect();

      // our case
      if (rect.y < 0 && rect.y + rect.height > 0) {
        stickPositionsRow(tableEl);
        break;
      }

      // stop finding case
      if (rect.y > 0) break;
    }
  }
}

export default CalendarCard;
