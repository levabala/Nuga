import * as moment from 'moment';
import CalendarCard from '../components/CalendarCard';
import PersonData from '../classes/dataTypes/PersonData';
import PersonsList from '../classes/PersonsList';
import DayData from '../classes/dataTypes/DayData';

const persons = new PersonsList([
  new PersonData({
    name: 'Michaeliachol',
    surname: 'Allenangolikoprichev',
    patronymic: 'Dmirtievich',
    url: '/src/images/avatar1.jpeg',
  }),
  new PersonData({
    name: 'Patricia',
    surname: 'Ball',
    patronymic: 'WithIn',
    url: '/src/images/avatar2.png',
  }),
  new PersonData({
    name: 'Andrew',
    surname: 'Brewster',
    patronymic: 'Afanasev',
    url: '/src/images/avatar3.jpeg',
  }),
  new PersonData({
    name: 'Philip',
    surname: 'Capp', // -Big-Car',
    url: '/src/images/avatar4.jpeg',
  }),
  new PersonData({
    name: 'Derek',
    surname: 'Carroll', // Scroll To Bottom',
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
]);

const visits: Array<{
  date: moment.Moment,
  client: PersonData,
  position: number,
}> = [];
const scale = 10;
for (let i = 0; i < persons.count * scale; i++)
  visits.push({
    date: moment({
      y: 2018,
      M: 11,
      d: Math.round(Math.random() * 6),
      h: 7 + Math.round(Math.random() * 0),
      m: Math.round(Math.random() * 59),
    }),
    client: persons.getByIndex(Math.floor(i / scale)),
    position: Math.round(Math.random() * 12),
  });

const days: Array<DayData> = [
  new DayData({
    date: moment({
      y: 2018,
      M: 11,
      d: 3,
    }),
    visits: [],
  }),
];

const loadNewDay = async (date: moment.Moment) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return new DayData({
    date,
    visits:
      visits.filter(
        visit =>
          Math.abs(
            visit.date
              .clone()
              .startOf('day')
              .diff(date.clone().startOf('day'), 'days'),
          ) < 1 && visit.date.day() === date.day(),
      ) || [],
  });
};

console.log(days);
const card = new CalendarCard(days, loadNewDay);

window.testCard = card;

card.el.setAttribute('style', `margin: 30px; display: block;`);

export default card;
export const calendarCardDemo = card;
