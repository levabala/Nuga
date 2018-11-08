import * as moment from 'moment';
import CalendarCard from '../components/CalendarCard';
import PersonData from '../classes/dataTypes/PersonData';
import PersonsList from '../classes/PersonsList';

const persons = new PersonsList([
  new PersonData({ name: 'Michael', surname: 'Allen' }),
  new PersonData({ name: 'Patricia', surname: 'Ball' }),
  new PersonData({ name: 'Andrew', surname: 'Brewster' }),
  new PersonData({ name: 'Philip', surname: 'Capp' }),
  new PersonData({ name: 'Derek', surname: 'Carroll' }),
  new PersonData({ name: 'Gerald', surname: 'Cheeseman' }),
  new PersonData({ name: 'John', surname: 'Chester' }),
  new PersonData({ name: 'Joanne', surname: 'Cooper' }),
  new PersonData({ name: 'Timothy', surname: 'George' }),
]);

const clients = [];

for (let i = 0; i < persons.count; i++)
  clients.push({
    date: moment({
      y: 2018,
      M: 11,
      d: Math.round(Math.random() * 21),
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    client: persons.getByIndex(i),
  });

const card = new CalendarCard(clients);

export default card;
export const calendarCardDemo = card;
