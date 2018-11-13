// @flow
import { el } from 'redom';

class Card {
  el: Element;
  constructor({ width }: { [string]: string } = { width: 'auto' }) {
    this.el = el('div', {
      class: 'card',
      style: `width: ${width};`,
    });
  }
}

export default Card;
