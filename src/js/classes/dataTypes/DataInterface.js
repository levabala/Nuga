// @flow

import { Element } from 'redom';

interface DataElement {
  toString(): String;
  generateElement(): Element;
  generateElementOneOfMany(boolean): Element;
}

export type IDataElement = DataElement;  
