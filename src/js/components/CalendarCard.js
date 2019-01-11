import interact from 'interactjs';
import * as moment from 'moment';
import { el, mount } from 'redom';
import Card from './Card';
import DayData from '../classes/dataTypes/DayData';
import CalendarDay from './calendarComponents/CalendarDay';

// import '../../scss/calendar.scss';

interact.dynamicDrop(true);

class CalendarCard extends Card {
  days: Array<CalendarDay>;

  constructor(
    data: Array<DayData>,
    requestNewDay: (date: moment.Moment) => DayData,
  ) {
    super();

    this.data = data;
    this.requestNewDay = requestNewDay;
    this.days = [];
    this.stickyPositionsRow = null;
    this.hiddenDays = 0;
    this.idCounter = 0;

    this.addDayCooldowned = true;
    this.addDayCountdown = 30;

    const averageIndex = Math.floor(this.data.length / 2);
    this.loadedBorder = [averageIndex, averageIndex];

    this.wrapper = el('div', { class: 'calendarCard' });
    mount(this.el, this.wrapper);

    let isScrolling;

    window.addEventListener(
      'scroll',
      () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => this.handleVerticalBorders(), 66);
      },
      false,
    );

    this.handleVerticalBorders();
    setTimeout(() => this.handleVerticalBorders());
  }

  handleTableHiding(e) {
    this.hiddenDays += e.hidden ? 1 : -1;
    // console.log(this.hiddenDays);
  }

  // DEBUG_FUNC
  countAllHiddenTables() {
    return this.days.reduce(
      (count: number, day: CalendarDay) =>
        // console.log(day.table.layoutInfo.hidden);
        count + (day.table.layoutInfo.hidden ? 1 : 0),
      0,
    );
  }

  // DEBUG_FUNC
  countAllActiveTables() {
    return this.days.reduce(
      (count: number, day: CalendarDay) =>
        // console.log(day.table.layoutInfo.hidden);
        count + (day.table.layoutInfo.hidden ? 0 : 1),
      0,
    );
  }

  // DEBUG_FUNC
  countAllActiveDropzones() {
    return this.days.reduce(
      (count: number, day: CalendarDay) =>
        count +
        day.table.layoutComponents.gridCells.reduce(
          (acc, cell) => acc + (cell.dropzoneActive ? 1 : 0),
          0,
        ),
      0,
    );
  }

  handleVerticalBorders() {
    if (!this.addDayCooldowned) return;

    const bodyRect = document.body.getBoundingClientRect();
    const trigger = window.innerHeight * 2;

    // check top border
    const needLoadTop = -bodyRect.y < trigger;
    if (needLoadTop) this.loadTopDay();

    // check bottom border
    const diff = bodyRect.bottom - window.innerHeight;
    const needLoadBottom = diff < trigger;
    if (needLoadBottom) this.loadBottomDay();

    if (needLoadTop || needLoadBottom) {
      this.addDayCooldowned = false;
      setTimeout(() => {
        this.addDayCooldowned = true;
        this.handleVerticalBorders();
      }, this.addDayCountdown);
    }
  }

  loadTopDay() {
    const newDate = this.data[0].date.clone().add(1, 'days');
    this.loadNewDay(newDate, false);
  }

  loadBottomDay() {
    const newDate = this.data[this.data.length - 1].date
      .clone()
      .subtract(1, 'days');
    this.loadNewDay(newDate, true);
  }

  async loadNewDay(date: moment.Moment, older: boolean) {
    const topIndex = this.loadedBorder[0] - 1;
    const mockDayData = new DayData({ date, visits: [] });
    const day = new CalendarDay(
      ++this.idCounter,
      mockDayData,
      topIndex === 0,
      this.days,
    );

    let renderedDay = null;
    const scrollBefore = window.scrollY;
    if (older) {
      this.days.push(day);
      this.data.push(mockDayData);

      [renderedDay] = this.days;

      mount(this.wrapper, day);
    } else {
      this.days.unshift(day);
      this.data.unshift(mockDayData);
      renderedDay = this.days[this.days.length - 1];

      mount(this.wrapper, day, this.wrapper.children[0]);
    }

    setTimeout(() => {
      if (older || scrollBefore !== window.scrollY) return;

      const scroll = renderedDay.el.offsetHeight;

      window.scrollBy(0, scroll);
    });

    const dayData = await this.requestNewDay(date);
    day.setData(dayData);
  }

  /*
  async loadTopDay() {
    let topIndex = this.loadedBorder[0] - 1;
    if (topIndex < 0) {
      const topDay = await this.requestTopDay(this.data[0]);
      if (topDay === null) return;

      topIndex++;
      this.data.unshift(topDay);
    }

    this.loadedBorder[0] = topIndex;

    const day = new CalendarDay(
      ++this.idCounter,
      this.data[topIndex],
      topIndex === 0,
      this.days,
    );
    day.table.addEventListener(
      'visibilityChanged',
      this.handleTableHiding.bind(this),
    );

    const child = el('div', { class: 'calendarCard' }, day);
    this.days.unshift(day);
    mount(this.el, child, this.el.children[0]);

    if (window.scrollY === 0) {
      console.log('SCroool is ZERO!!! Fallllback!');
      const cardRect = this.days[0].el.getBoundingClientRect();
      const scrollHeightTarget = cardRect.height;
      setTimeout(() => {
        window.scrollTo(0, scrollHeightTarget);
      });
    }

    // console.log('Loaded TOP day');
  }

  async loadBottomDay() {
    const bottomIndex = this.loadedBorder[1] + 1;
    if (bottomIndex >= this.data.length) {
      const bottomDay = await this.requestBottomDay(
        this.data[this.data.length - 1],
      );
      if (bottomDay === null) return;

      this.data.push(bottomDay);
    }

    this.loadedBorder[1] = bottomIndex;

    const day = new CalendarDay(
      ++this.idCounter,
      this.data[bottomIndex],
      bottomIndex === 0,
      this.days,
    );

    day.table.addEventListener(
      'visibilityChanged',
      this.handleTableHiding.bind(this),
    );

    const child = el('div', { class: 'calendarCard' }, day);
    this.days.push(day);
    mount(this.el, child);

    // console.log('Loaded BOTTOM day');
  }
  */

  // UNUSABLE
  hadleResizing() {
    clearTimeout(this.resizeFinishTimeout);

    this.resizeFinishTimeout = setTimeout(() => {
      // console.log('resize end');
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
