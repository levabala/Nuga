import { el } from 'redom';
import * as moment from 'moment';
import HistoryEvent from '../classes/HistoryEvent';

class HistoryCard {
  events: Array<HistoryEvent>;
  animationDuration: Number;
  animationFinishTime: Date;
  animationFinished: boolean;
  animationsPendingCount: Number;
  minAnimationTimeout: Number;

  constructor(events) {
    this.events = [];
    this.minAnimationTimeout = 100;
    this.animationFinished = true;
    this.animationFinishTime = new Date(0);
    this.animationsPendingCount = 0;
    this.animationDuration = 2100;

    this.el = el('div', { class: 'history-card' }, [
      el('div', { id: 'title', class: 'history-title' }, 'История'),
    ]);

    this.addPastEvents(events);
  }

  addNewEvent(historyEvent: HistoryEvent, realtime: boolean = false) {
    const block = el('div', {
      class: `history-add-block ${realtime ? 'collapsed' : ''}`,
    });
    // TODO: calc 'even' right way
    const even = this.events.length % 2 === 0;
    const element = this.constructor.createEventElement(historyEvent, even);

    const add_divider =
      this.events.length === 0 ||
      this.events[0].date.isBefore(historyEvent.date, 'day');

    this.events.unshift(historyEvent);
    block.appendChild(element);
    if (add_divider) block.appendChild(this.createDateDivider(historyEvent));

    const firstBlock = this.el.querySelector('.history-add-block');
    firstBlock.parentNode.insertBefore(block, firstBlock);

    if (realtime) {
      this.animationFinishTime =
        Math.max(this.animationFinishTime, Date.now()) + this.animationDuration;
      const timeout = Math.max(
        this.animationFinishTime - this.animationDuration - Date.now(),
        this.minAnimationTimeout,
      );

      setTimeout(() => {
        block.classList.toggle('collapsed');
      }, timeout);
    }
  }

  addPastEvents(new_events: Array<HistoryEvent>, realtime: boolean = false) {
    // TODO: make it not deleting the same divider

    // remove (if exists) last date divider
    if (this.events.length > 0) {
      const dates = this.el.lastChild.querySelectorAll('.history-date');
      const toRemove = dates[dates.length - 1];
      toRemove.remove();
    }

    // add to existing collection
    const new_length = this.events.length + new_events.length;
    this.events.push(...new_events);

    const block = el('div', {
      class: `history-add-block ${realtime ? 'collapsed' : ''}`,
    });

    for (let i = this.events.length - new_events.length; i < new_length; i++) {
      // check if we need to add divider
      let add_divider = false;
      if (!add_divider && i !== 0)
        add_divider = !this.events[i - 1].date.isSameOrBefore(
          this.events[i].date,
          'day',
        );
      if (add_divider)
        block.appendChild(this.createDateDivider(this.events[i - 1]));

      // generating event card
      const historyEvent = this.events[i];
      const even = (i + 1) % 2 === 0;
      const element = this.constructor.createEventElement(historyEvent, even);

      // adding to parent
      block.appendChild(element);
    }

    // closing divider
    block.appendChild(
      this.createDateDivider(this.events[this.events.length - 1]),
    );

    this.el.appendChild(block);

    if (realtime) setTimeout(() => block.classList.toggle('collapsed'));
  }

  static createEventElement(historyEvent, even) {
    const evennessClass = even ? 'even' : 'odd';
    return el(
      'div',
      { class: `history-event ${evennessClass}` },
      el(
        'div',
        {
          class: `.history-event content ${evennessClass}`,
          style: `--tick-color: ${historyEvent.mark}`,
        },
        [
          el('b', `${historyEvent.date.format('hh:mm')} `),
          el('span', { class: 'history-event-title' }, historyEvent.title),
          ...(historyEvent.description.length > 0
            ? [el('p', historyEvent.description)]
            : []),
        ],
      ),
    );
  }

  createDateDivider(event) {
    return el(
      'div',
      { class: 'history-date' },
      this.constructor.getDateString(event.date),
    );
  }

  static getDateString(date: moment.Moment): String {
    return date.calendar();
  }
}

export default HistoryCard;
