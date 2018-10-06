import { el } from 'redom';

class Card {
  constructor({ width }) {
    this.el = el('div', { class: 'card', style: `width: ${width};` });
  }
}

export default Card;
