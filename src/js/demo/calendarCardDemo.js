import * as moment from 'moment';
import CalendarCard from '../components/CalendarCard';
import PersonData from '../classes/dataTypes/PersonData';
import PersonsList from '../classes/PersonsList';
import DayData from '../classes/dataTypes/DayData';

const persons = new PersonsList([
  new PersonData({
    name: 'Michael',
    surname: 'Allen',
    url: '/src/images/avatar1.jpeg',
  }),
  new PersonData({
    name: 'Patricia',
    surname: 'Ball',
    url: '/src/images/avatar2.png',
  }),
  new PersonData({
    name: 'Andrew',
    surname: 'Brewster',
    url: '/src/images/avatar3.jpeg',
  }),
  new PersonData({
    name: 'Philip',
    surname: 'Capp',
    url: '/src/images/avatar4.jpeg',
  }),
  new PersonData({
    name: 'Derek',
    surname: 'Carroll',
    url: '/src/images/avatar5.jpeg',
  }),
  new PersonData({
    name: 'Gerald',
    surname: 'Cheeseman',
    url: '/src/images/avatar6.jpg',
  }),
  new PersonData({
    name: 'John',
    surname: 'Chester',
    url: '/src/images/avatar7.jpg',
  }),
  new PersonData({
    name: 'Joanne',
    surname: 'Cooper',
    url: '/src/images/avatar8.jpeg',
  }),
  new PersonData({
    name: 'Timothy',
    surname: 'George',
    url: '/src/images/avatar9.jpg',
  }),
  new PersonData({
    name: 'Twister',
    surname: 'Karry',
    url: '/src/images/avatar3.jpeg',
  }),
  /*
  new PersonData({ name: 'Martin', surname: 'Milkway' }),
  new PersonData({ name: 'Kitty', surname: 'South' }),
  new PersonData({ name: 'Lammy', surname: 'Blacksm' }),
  new PersonData({ name: 'Mundak', surname: 'Rismatch' }),
  new PersonData({ name: 'Bally', surname: 'Perpy' }), */
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

card.el.setAttribute(
  'style',
  `position: absolute; left: 20px; top: 20px;`, // right: 20px;`,
);

export default card;
export const calendarCardDemo = card;
