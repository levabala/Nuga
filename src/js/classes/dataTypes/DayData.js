import { Moment } from 'moment';
import PersonData from './PersonData';

class DayData {
  date: Moment;
  visits: Array<PersonData>;

  constructor({ date, visits }) {
    this.date = date;
    this.visits = visits;
  }
}

export default DayData;
