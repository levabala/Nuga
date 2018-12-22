// @flow

import { el, mount, Element } from 'redom';
import Card from './Card';
import type { IDataElement } from '../classes/dataTypes/DataInterface';
import '../../scss/bio.scss';

class BioTableHead {
  el: Element;

  constructor(title) {
    this.el = el('div', { id: 'name', class: 'bioHead' }, title);
  }
}

class BioTableRow {
  el: Element;

  constructor(property, value: IDataElement) {
    let valueElement;
    if (Array.isArray(value))
      valueElement = el('div', [
        ...value.map((d: IDataElement, index, { length }) =>
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

type DataType = Map<string, IDataElement>;
export type BioData = {
  title: string,
  avatarURL: string,
  data: DataType,
};

class BioTable {
  el: Element;

  constructor(title: string, data: DataType) {
    this.el = el('div', { id: 'bio-table', class: 'bioTable' }, [
      new BioTableHead(title),
      ...Array.from(data, ([prop, val]) => new BioTableRow(prop, val)),
    ]);
  }
}

class BioCard extends Card {
  constructor({ title, data, avatarURL }: BioData) {
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
