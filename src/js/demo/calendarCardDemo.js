import * as moment from 'moment';
import CalendarCard from '../components/CalendarCard';
import PersonData from '../classes/dataTypes/PersonData';
import PersonsList from '../classes/PersonsList';
import DayData from '../classes/dataTypes/DayData';

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
  new PersonData({ name: 'Twister', surname: 'Karry' }),
  new PersonData({ name: 'Martin', surname: 'Milkway' }),
  new PersonData({ name: 'Kitty', surname: 'South' }),
  new PersonData({ name: 'Lammy', surname: 'Blacksm' }),
  new PersonData({ name: 'Mundak', surname: 'Rismatch' }),
  new PersonData({ name: 'Bally', surname: 'Perpy' }),
]);

const visits = [];
for (let i = 0; i < persons.count; i++)
  visits.push({
    date: moment({
      y: 2018,
      M: 11,
      d: Math.round(Math.random() * 21),
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    client: persons.getByIndex(i),
  });

const days: Array<DayData> = [
  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 2,
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    visits,
  }),

  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 3,
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    visits,
  }),

  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 4,
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    visits,
  }),

  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 5,
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    visits,
  }),

  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 6,
      h: Math.round(Math.random() * 23),
      m: Math.round(Math.random() * 59),
    }),
    visits,
  }),
];

const card = new CalendarCard(days);

card.el.setAttribute('style', `position: absolute; left: 20px; top: 20px`);

export default card;
export const calendarCardDemo = card;
