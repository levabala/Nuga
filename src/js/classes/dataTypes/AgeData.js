import { el } from 'redom';
import DataInterface from '../DataInterface';

class AgeData implements DataInterface {
  constructor({ birthDate, age }: { birthDate: Date, age: Number }) {
    this.birthDate = birthDate;
    this.age = age;
    if (!birthDate && !age) throw Error('No data about age or birth date!');

    if (!age) this.age = Date.now() - birthDate.getTime();
    else if (!birthDate) this.birthDate = new Date(this.age);
  }

  toString() {
    const seconds = this.age / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const monthes = days / 30;
    const years = monthes / 12;
    const val = Math.floor(years);
    return `${val} лет  `;
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

export default AgeData;
