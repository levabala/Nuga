import { el, mount } from 'redom';
import Card from './Card';
import DataInterface from '../classes/DataInterface';

class BioTableHead {
  constructor(title) {
    this.el = el('div', { id: 'name', class: 'bioHead' }, title);
  }
}

class BioTableRow {
  constructor(property, value: DataInterface | Array<DataInterface>) {
    let valueElement;
    if (Array.isArray(value))
      valueElement = el('div', [
        ...value.map((d: DataInterface, index, { length }) =>
          d.generateElementOneOfMany(index === length - 1),
        ),
      ]);
    else valueElement = value.generateElement();

    this.el = el('div', { class: 'bioRow' }, [
      el('div', { class: 'bioCell bioProperty' }, property),
      el('div', { class: 'bioCell bioValue' }, valueElement),
    ]);
  }
}

class BioTable {
  constructor(title: String, data: Array<Object<String, String>>) {
    this.el = el('div', { id: 'bio-table', class: 'bioTable' }, [
      new BioTableHead(title),
      ...Object.entries(data).map(
        entrie => new BioTableRow(entrie[0], entrie[1]),
      ),
    ]);
  }
}

class BioCard extends Card {
  constructor({ title, data, avatarURL }) {
    super({ width: '700px' });
    const child = el('div', { id: 'info' }, [
      el(
        'i',
        {
          class: 'material-icons mdc-icon-button',
          style: 'float: right; margin-right: -0.75rem; margin-top: -0.75rem;',
        },
        'list',
      ),
      el('img', {
        src: avatarURL,
        style: 'float:right',
        alt: 'Avatar',
        class: 'avatar',
      }),
      new BioTable(title, data),
    ]);

    mount(this.el, child);
  }
}

export default BioCard;
