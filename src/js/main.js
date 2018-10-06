import { mount } from 'redom';
import 'tippy.js/dist/tippy.css';
import BioCard from './components/BioCard';
import PersonData from './classes/PersonData';
import TextData from './classes/TextData';
import PhoneData from './classes/PhoneData';
import MoneyData from './classes/MoneyData';
import PersonsList from './classes/PersonsList';
import AgeData from './classes/AgeData';

const persons = new PersonsList([
  new PersonData({ name: 'Евгения', surname: 'Коршова' }),
  new PersonData({ name: 'Дмитрий', surname: 'Дюжов' }),
  new PersonData({ name: 'Мария', surname: 'Першина' }),
]);

const bioData = {
  title: 'Алексей Долматов',
  data: {
    Адресс: new TextData({ text: 'Москва' }),
    Телефон: new PhoneData({ phone_number: '+371 28481181' }),
    Возраст: new AgeData({ birthDate: new Date(1971, 10, 21) }),
    Рейтинг: new TextData({ text: '20' }),
    Друзья: [
      persons.get('Евгения', 'Коршова'),
      persons.get('Дмитрий', 'Дюжов'),
      persons.get('Мария', 'Першина'),
    ],
    'Средний чек': new MoneyData({ amount: 500, currency: 'eur' }),
    'Пригласил/а': persons.get('Мария', 'Першина'),
  },
  avatarURL: 'images/avatar.png',
};
const card = new BioCard(bioData);
card.el.setAttribute(
  'style',
  `${card.el.getAttribute('style')} position: absolute; left: 50px; top: 50px`,
);
mount(document.body, card);
