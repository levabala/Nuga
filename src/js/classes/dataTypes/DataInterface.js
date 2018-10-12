// @flow

import { Element } from 'redom';

interface DataElement {
  toString(): string;
  generateElement(): Element;
  generateElementOneOfMany(boolean): Element;
}

export type IDataElement = DataElement;  
