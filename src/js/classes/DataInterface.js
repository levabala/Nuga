// @flow
import { el } from 'redom';

export interface DataInterface {
  toString(): String;
  generateElement(): el;
  generateElementOneOfMany(boolean): el;
}
