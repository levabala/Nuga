// import tippy from 'tippy.js';
import { el, mount, setAttr } from 'redom';
import tippy from 'tippy.js';
import DataInterface from './DataInterface';
import PersonTooltip from '../PersonTooltip';

const person_tooltips_shown = {};
const grades = ['A', 'B', 'C']; // , 'D', 'E', 'F'];
class PersonData implements DataInterface {
  constructor({
    name,
    surname,
    url = '/src/images/avatar.png',
    patronymic = '',
  }) {
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
    this.url = url;
    this.points = Math.round(Math.random() * 20).toString();
    this.code = Math.round(Math.random() * 10000000 + 1000000).toString();
    this.visitsCount = Math.round(Math.random() * 130);
    this.grade = grades[Math.round(Math.random() * (grades.length - 1))];
    this.leftMarker = Math.round(Math.random() * 5 + 1);
    this.visits = [];
  }

  toString() {
    return `${this.name} ${this.surname}`;
  }

  generateElement() {
    const element = el('div', { style: 'display: inline-block' }, [
      el('a', { href: '' }, this.toString()),
    ]);
    const tip = tippy(element, {
      placement: 'bottom',
      theme: 'white',
      content: new PersonTooltip().el,
      size: 'small',
      interactive: true,
      showOnInit: false,
      arrow: false, // TODO: realize sharp svg arrow
      arrowType: 'round',
      onShown: () => {
        // we have a separated "tippy" object for each PersonData so count of instances would be 0
        const instance = tip.instances[0];
        person_tooltips_shown[instance.id] = instance;
      },
      onHidden: () => {
        const instance = tip.instances[0];
        delete person_tooltips_shown[instance.id];
      },
    });
    return element;
  }

  generateElementOneOfMany(final: boolean) {
    const element = this.generateElement();
    setAttr(element, { style: 'display: block-inline; float: left' });
    mount(element, el('a', final ? '' : ',\u00a0'));
    return element;
  }
}

export default PersonData;
