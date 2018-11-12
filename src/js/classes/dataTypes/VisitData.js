import { Moment } from 'moment';
import PersonData from './PersonData';

class VisitData {
  date: Moment;
  client: PersonData;

  constructor({ date, client }) {
    this.date = date;
    this.clients = client;
  }
}

export default VisitData;
