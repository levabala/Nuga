import { el } from 'redom';

class Card {
  constructor({ width } = { width: 'auto' }) {
    this.el = el('div', {
      class: 'mdc-card mdc-elevation--z8',
      style: `width: ${width};`,
    });
  }
}

export default Card;
