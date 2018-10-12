// @flow

import { el, setAttr, mount, setChildren } from 'redom';
import type { IDataElement } from './DataInterface';

class DataCollection implements IDataElement {
  collection: Array<IDataElement>;
  constructor(elements: Array<IDataElement>) {
    this.collection = elements;
  }

  generateElement(): Element {
    const elem = el('div');
    const children = [];
    for (const child of this.collection)
      children.push(child.generateElement());

    setChildren(elem, children);
    return elem;
  }

  generateElementOneOfMany(final: boolean) {
    const element = this.generateElement();
    setAttr(element, { style: 'display: block-inline; float: left' });
    mount(element, el('a', final ? '' : ',\u00a0'));
    return element;
  }
}

export default DataCollection;