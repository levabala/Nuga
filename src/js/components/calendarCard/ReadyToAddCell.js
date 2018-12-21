import { el } from 'redom';

class ReadyToAddCell {
  constructor() {
    this.el = el(
      'div',
      { style: 'position: relative' },
      el(
        'div',
        { class: 'readyToAddCell' },
        el(
          'div',
          {
            class: 'content-block',
            style: 'text-align: center;',
          },
          el(
            'i',
            {
              class: 'material-icons addButton',
            },
            'add',
          ),
          el(
            'span',
            {
              class: 'text',
            },
            'Добавить запись',
          ),
        ),
      ),
    );
  }
}

export default ReadyToAddCell;
