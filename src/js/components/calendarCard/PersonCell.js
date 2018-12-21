import { el, setAttr } from 'redom';
import PersonData from '../../classes/dataTypes/PersonData';
import ColorVariables from '../../../scss/colors.scss';

const emptyPerson = new PersonData({ name: '', surname: '' });

class PersonCell {
  constructor(
    id: string,
    x: number,
    y: number,
    person: ?PersonData,
    first: boolean = false,
  ) {
    this.person = person || emptyPerson;
    this.mock = person === null;
    this.x = x;
    this.y = y;
    this.dayId = '';

    this.id = null;

    // FIXIT: disable placing mocking empty element
    if (this.mock && !first) {
      this.el = null;
      return;
    }
    this.el = el(
      'div',
      {
        id,
        class: 'calendarCell-container personCell',
        'data-coord-x': x,
        'data-coord-y': y,
        style: `${
          person ? '' : 'visibility: hidden; background: transparent;'
        }`,
      },
      [
        el('div', {
          class: 'leftMarker',
          style: `background: ${
            Math.random() > 0.4
              ? ColorVariables[`colorMark${this.person.leftMarker}`]
              : 'none'
          }`,
        }),

        el(
          'div',
          { class: 'wrapper-block' },
          el(
            'div',
            { class: 'content-block' },
            el('img', {
              src: this.person.url,
              alt: 'Avatar',
              class: 'avatar',
              draggable: false,
            }),
          ),
        ),
        el(
          'div',
          { class: 'wrapper-block text-block' },
          el(
            'div',
            { class: 'content-block' },

            el('div', { class: 'text-info' }, [
              el(
                'div',
                { class: 'primary-info' },
                el(
                  'span',
                  { class: 'primary-info-block' },
                  `${this.person.surname} `,
                ),
                el(
                  'span',
                  { class: 'primary-info-block' },
                  `${this.person.name} `,
                ),
                el(
                  'span',
                  { class: 'primary-info-block' },
                  el(
                    'span',
                    { class: '' },
                    this.person.patronymic.length > 0
                      ? `${this.person.patronymic[0]}.`
                      : '',
                  ),
                  // el('&nbsp'),
                  el(
                    'span',
                    { class: 'visitsCount' },
                    ` ${this.person.visitsCount}`,
                  ),
                  el(
                    'span',
                    {
                      class: '',
                      style: `color: ${
                        { A: 'blue', B: 'green', C: 'red' }[this.person.grade]
                      }`,
                    },
                    ` ${this.person.grade}`,
                  ),
                ),
              ),
              el('div', { class: 'secondary-info' }, this.person.code),
            ]),
          ),
        ),
        el(
          'div',
          { class: 'wrapper-block points-block' },
          el(
            'div',
            { class: 'content-block' },
            el('span', { class: 'points' }, this.person.points),
          ),
        ),
      ],
    );
    this.setId(id);

    this.el.addEventListener('animationend', () => {
      if (this.mock) return;
      this.discardMoveBackAnimation();
    });
  }

  discardMoveBackAnimation() {
    if (this.mock) return;

    this.el.setAttribute('style', `width: auto`);
    this.el.classList.remove('isDragging');
    this.el.classList.remove('movingBack');
  }

  setId(id) {
    if (this.mock) return;

    this.id = id;
    setAttr(this, 'data-person-id', id);
  }

  setDayId(id) {
    if (this.mock) return;

    this.dayId = id;
    setAttr(this, 'data-day-id', id);
  }
}

export default PersonCell;
