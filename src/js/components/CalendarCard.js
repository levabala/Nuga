import * as moment from 'moment';
import interact from 'interactjs';
import { el, mount, setChildren } from 'redom';
import Card from './Card';
import PersonData from '../classes/dataTypes/PersonData';
import dragConfig from '../scripts/drag';
import dropConfig from '../scripts/drop';

const emptyPerson = new PersonData({ name: '', surname: '' });

class PersonCell {
  constructor(person: ?PersonData) {
    const personToAdd = person || emptyPerson;

    // FIXIT: disable placing mocking empty element
    this.el = el(
      'div',
      {
        class: 'personCell',
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

class CalendarCell {
  constructor(x: number, y: number, person: ?PersonData) {
    this.el = el(
      'div',
      {
        class: 'calendarCell',
        'data-empty': person !== null,
        'data-coord-x': x,
        'data-coord-y': y,
      },
      new PersonCell(person),
    );

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

      dropzoneElement.classList.remove('readyToGetDrop');

      // check if something is in
      if (dropzoneElement.attributes['data-empty'].value === 'true') return;

      setChildren(draggableElement.parentNode, new PersonCell());
      setChildren(dropzoneElement, draggableElement);

      draggableElement.setAttribute('data-x', 0);
      draggableElement.setAttribute('data-y', 0);
    };
    interact(this.el).dropzone(config);
  }
}

class CalendarTable {
  constructor(data: Array<{ date: moment.Moment, client: PersonData }>) {
    this.data = data;

    const arr = [];
    for (let i = 0; i < 5; i++) {
      const arr2 = [];
      for (let i2 = 0; i2 < 3; i2++) {
        const exist = Math.random() > 0.7;

        arr2.push(
          el(
            'div',
            { class: 'table-cell' },
            new CalendarCell(
              i2,
              i,
              exist
                ? data[Math.round(Math.random() * (data.length - 1))].client
                : null,
            ),
          ),
        );
      }

      arr.push(el('div', { class: 'table-row' }, arr2));
    }

    this.el = el('div', { class: 'table' }, arr);
    this.cells = arr;
  }

  /* eslint-disable-next-line */
  _insertCell(dropzone) {
    const x = parseInt(dropzone.attributes['data-coord-x'].value, 10);
    const y = parseInt(dropzone.attributes['data-coord-y'].value, 10);
    //TODO: inserting
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
