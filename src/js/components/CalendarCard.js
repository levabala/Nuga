import * as moment from 'moment';
import interact from 'interactjs';
import { el, mount, setChildren, setAttr } from 'redom';
import { Reactor } from 'assemblies';
import Card from './Card';
import PersonData from '../classes/dataTypes/PersonData';
import dragConfig from '../scripts/drag';
import dropConfig from '../scripts/drop';

const emptyPerson = new PersonData({ name: '', surname: '' });

class PersonCell {
  constructor(x: number, y: number, person: ?PersonData) {
    const personToAdd = person || emptyPerson;

    this.mock = person === null;
    this.x = x;
    this.y = y;

    // FIXIT: disable placing mocking empty element
    this.el = el(
      'div',
      {
        class: 'personCell',
        'data-coord-x': x,
        'data-coord-y': y,
        style: `${
          person ? '' : 'visibility: hidden; background: transparent;'
        }`,
      },
      [
        el(
          'div',
          { class: 'block' },
          el('img', {
            src: 'images/avatar.png',
            alt: 'Avatar',
            class: 'avatar',
          }),
          el('div', { class: 'text-info' }, [
            el(
              'div',
              { class: 'primary-info' },
              `${personToAdd.surname} ${personToAdd.name}`,
            ),
            el('div', { class: 'secondary-info' }, '248811134'),
          ]),
        ),
        el(
          'div',
          { class: 'block' },
          el(
            'div',
            { class: 'points' },
            Math.round(Math.random() * 20).toString(),
          ),
        ),
      ],
    );

    interact(this.el).draggable(dragConfig);
  }
}

class CalendarCell extends Reactor {
  constructor(x: number, y: number, person: ?PersonData) {
    super();

    const cell = this;
    this.x = x;
    this.y = y;
    this.personCell = null;

    this.el = el('div', {
      class: 'calendarCell',
      'data-empty': person === null,
      'data-coord-x': x,
      'data-coord-y': y,
    });

    this.setChildPerson(person);

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

      dropzoneElement.classList.remove('readyToGetDrop');

      // check if something is in
      cell.dispatchEvent('insertElement', {
        target: cell,
        relatedTarget: draggableElement,
      });
    };
    interact(this.el).dropzone(config);

    this.registerEvent('insertElement');
  }

  setChildPerson(person: PersonData) {
    this.personCell = new PersonCell(this.x, this.y, person);
    setChildren(this, this.personCell);
  }

  setChildPersonCell(personCell) {
    this.personCell = personCell;
    this.personCell.x = this.x;
    this.personCell.y = this.y;
    setChildren(this, this.personCell);
  }
}

class CalendarTable {
  constructor(data: Array<{ date: moment.Moment, client: PersonData }>) {
    this.data = data;
    this.cells = [];

    const arr = [];
    for (let i = 0; i < 5; i++) {
      const arr2 = [];
      this.cells.push([]);
      for (let i2 = 0; i2 < 3; i2++) {
        const exist = Math.random() > 0.7;

        const cell = new CalendarCell(
          i2,
          i,
          exist
            ? data[Math.round(Math.random() * (data.length - 1))].client
            : null,
        );
        cell.addEventListener('insertElement', this.insertCell.bind(this));

        arr2.push(el('div', { class: 'table-cell' }, cell));
        this.cells[i].push(cell);
      }

      arr.push(el('div', { class: 'table-row' }, arr2));
    }

    this.el = el('div', { class: 'table' }, arr);
  }

  insertCell(args) {
    const { target, relatedTarget } = args;
    const px = relatedTarget.attributes['data-coord-x'].value;
    const py = relatedTarget.attributes['data-coord-y'].value;

    const targetCalendarCell = target;
    const originCalendarCell = this.cells[py][px];

    const tx = targetCalendarCell.x;
    const ty = targetCalendarCell.y;

    const success = this.freeCell(tx, ty);
    if (!success) return;

    this.constructor.movePersonCell(originCalendarCell, targetCalendarCell);
  }

  static movePersonCell(originCalendarCell, targetCalendarCell) {
    const tx = targetCalendarCell.x;
    const ty = targetCalendarCell.y;

    const { personCell } = originCalendarCell;

    // update empty-state for calendar cells
    setAttr(originCalendarCell, 'data-empty', true);
    setAttr(targetCalendarCell, 'data-empty', false);

    // update personCell position
    setAttr(personCell, 'data-coord-x', tx);
    setAttr(personCell, 'data-coord-y', ty);

    // set personCell as child of targetCalendarCell
    targetCalendarCell.setChildPersonCell(personCell);

    // set mocking emptyPersonCell as child of originCalendarCell
    originCalendarCell.setChildPerson(null);
  }

  freeCell(x, y) {
    const checkDeltas = [
      [0, 0], // center
      [-1, 0], // left
      // [-1, -1], // left-top
      // [0, -1], // top
      // [1, -1], // right-top
      [1, 0], // right
      // [1, 1], // right-bottom
      // [0, 1], // bottom
      // [-1, 1], // bottom-left
    ];

    function findPos(tx, ty, cells) {
      console.log(tx, ty);
      try {
        console.log(cells[ty][tx].personCell.mock);
      } catch (e) {
        /**/
      }
      if (
        tx >= 0 &&
        tx < cells[0].length &&
        ty >= 0 &&
        ty < cells.length &&
        cells[ty][tx].personCell.mock
      )
        return [tx, ty];

      return false;
    }

    let pos = false;
    for (let i = 0; i < checkDeltas.length; i++) {
      const delta = checkDeltas[i];
      console.log(delta[0], delta[1]);
      pos = findPos(x + delta[0], y + delta[1], this.cells);
      if (pos) break;
    }

    // if no available cells around
    if (!pos) return false;

    // if delta == [0, 0]
    if (pos[0] === x && pos[1] === y) return true;

    // if a cell is free
    this.constructor.movePersonCell(
      this.cells[y][x],
      this.cells[pos[1]][pos[0]],
    );

    return true;
  }
}

class CalendarCard extends Card {
  constructor(data: Array<{ date: moment.Moment, client: PersonData }>) {
    super();

    this.data = data;
    const child = el('div', new CalendarTable(data));

    mount(this.el, child);
  }
}

export default CalendarCard;
