import { el } from 'redom';
import DataInterface from '../DataInterface';

class MoneyData implements DataInterface {
  constructor({ amount, currency = 'eur' }) {
    // TODO: realize currency switching
    this.amount = amount;
    this.currency = currency;
  }

  toString() {
    return `${this.amount} ${this.currency}`;
  }

  generateElement() {
    return el('div', this.toString());
  }

  generateElementOneOfMany(final: boolean) {
    const str = this.toString();
    console.log(str);
    return el('div', { style: 'display: block-inline; float: left' }, [
      str,
      final ? '' : ',\u00a0', // hard space
    ]);
  }
}
export default MoneyData;
