import { el, mount } from 'redom';
import * as moment from 'moment';
import 'tippy.js/dist/tippy.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import HistoryCard from '../components/HistoryCard';
import HistoryEvent from '../classes/HistoryEvent';

moment.locale('ru');
moment.updateLocale('ru', {
  weekdays: 'Понедельник Вторник Среда Четверг Пятница Суббота Воскресенье'.split(
    ' ',
  ),
  monthsShort: 'Янв Фев Мар Апр Май Июн Июл Авг Сен Окт Ноя Дек'.split(' '),
  weekdaysShort: 'Пн Вт Ср Чт Пт Сб Вс'.split(' '),
  calendar: {
    sameDay: '[Сегодня]',
    nextDay: '[Завтра]',
    nextWeek: 'dddd',
    lastDay: '[Вчера]',
    lastWeek: 'D MMM',
    sameElse: 'DD.MM.YYYY',
  },
  week: {
    dow: 1,
  },
});

const events = [
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 7, h: 20, m: 15 }),
    title: 'Запись на кульбит #4',
    mark: 'blue',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 7, h: 14, m: 45 }),
    title: 'Запись на кульбит #3',
    mark: 'blue',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 7, h: 12, m: 33 }),
    title: 'Запись на кульбит #2',
    mark: 'blue',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 7, h: 11, m: 15 }),
    title: 'Запись на кульбит',
    mark: 'blue',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 6, h: 17, m: 34 }),
    title: 'Запись на визит',
    description: 'Ну тут великолепное описание визита. Как же ещё?',
    mark: 'red',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 6, h: 13, m: 34 }),
    title: 'Запись на визит в тот же день',
    description: 'Визит в день перед визитом?',
    mark: 'red',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 9, d: 2, h: 20, m: 22 }),
    title: 'Балет на запись',
    description: 'Ну тут великолепное описание балета на запись. Как же ещё?',
    mark: 'transparent',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 8, d: 23, h: 4, m: 5 }),
    title: 'Покупка оборудования',
    description: 'Купил оборудования много. Очень.',
    mark: 'darkgreen',
  }),
  new HistoryEvent({
    date: moment({ y: 2018, M: 8, d: 20, h: 13, m: 23 }),
    title: 'Приём у специалиста',
    description: 'Специлист был великолепен',
    mark: 'transparent',
  }),
  new HistoryEvent({
    date: moment({ y: 2017, M: 3, d: 10, h: 10, m: 0 }),
    title: 'Прошлогоднее событие',
    description: 'Это было давно. Очень.',
    mark: 'black',
  }),
  new HistoryEvent({
    date: moment({ y: 2017, M: 3, d: 10, h: 9, m: 59 }),
    title: 'Прошлогоднее событие за минуту до следующего!',
    description: 'Их разделяет почти ничего',
    mark: 'orange',
  }),
];

const card = new HistoryCard([events[4], events[5]]);
card.el.setAttribute('style', `position: absolute; left: 10px; top: 10px`);

function addNewEvent() {
  card.addNewEvent(
    new HistoryEvent({
      date: moment(),
      title: 'Запись на визит прямо сейчас',
      description: 'По нажатию кнопки?',
      mark: 'red blue darkgreen transparent orange yellow'.split(' ')[
        Math.floor(Math.random() * 5)
      ],
    }),
    true,
  );
}
const add_button = el(
  'a',
  {
    class: 'waves-effect waves-light btn',
    style: 'position: absolute; right: 10px; top: 10px;',
    onclick: addNewEvent,
  },
  'add event',
);

const container = el('div');
mount(container, card);
mount(container, add_button);

/*
setTimeout(
  () => card.addPastEvents([events[7], events[8], events[9], events[10]], true),
  0,
); */

export default container;
export const historyCardDemo = container;
