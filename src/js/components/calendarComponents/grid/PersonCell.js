import { el } from 'redom';
import interact from 'interactjs';
import PersonData from '../../../classes/dataTypes/PersonData';
import generateConfig from '../../../scripts/dragConfig';

class PersonCell {
  constructor(cellX: number, cellY: number, person: ?PersonData) {
    this.person = person;
    this.cellX = cellX;
    this.cellY = cellY;

    this.el = el('div', { class: 'personCell' }, person.name);

    interact(this.el).draggable(generateConfig());
    // interact(this.el).styleCursor(false);
  }
}

export default PersonCell;
