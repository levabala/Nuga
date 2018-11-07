import { el, mount } from 'redom';
import Card from './Card';

class CalendarCard extends Card {
  constructor() {
    super({ width: '600px' });
    this.el = el('div');
  }
}

export default CalendarCard;
