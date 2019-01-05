import { el } from 'redom';
import PersonData from '../../../classes/dataTypes/PersonData';

class PersonCell {
  constructor(cellX: number, cellY: number, person: ?PersonData) {
    this.person = person;
    this.cellX = cellX;
    this.cellY = cellY;

    this.el = el('div', { class: 'personCell' });
  }
}

export default PersonCell;
