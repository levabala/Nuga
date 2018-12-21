import interact from 'interactjs';
import { el, mount } from 'redom';
import CalendarCell from './CalendarCell';
import ReadyToAddCell from './ReadyToAddCell';
import dropConfig from '../../scripts/drop';

class CalendarTableCell {
  calendarCell: CalendarCell;

  constructor(childCell, locked) {
    this.calendarCell = childCell;

    this.el = el(
      'div',
      {
        class: `calendar-table-cell main-grid ${locked ? 'locked' : ''}`,
      },
      childCell,
      // el('div', { class: 'calendar-additional-border' }),
    );
    const cell = this.calendarCell;

    const addTimeout = null;
    // const enterTime = 0; // 100;

    // FIXIT: blinking when point on bottom border
    this.el.addEventListener('mouseenter', () => {
      // console.log('enter');
      if (this.locked || this.el.classList.contains('readyToAdd')) return;

      // addTimeout = setTimeout(() => {
      if (this.calendarCell.personCell.mock) {
        this.el.classList.add('readyToAdd');
        mount(this.calendarCell.container, new ReadyToAddCell());
      }
      // }, enterTime);
    });

    this.el.addEventListener('mouseleave', () => {
      // console.log('leave');
      if (this.locked) return;
      // return;

      clearTimeout(addTimeout);
      if (!this.el.classList.contains('readyToAdd')) return;

      this.el.classList.remove('readyToAdd');
      // setChildren(this.calendarCell.container, new PersonCell(0, 0, 0, null));
      this.calendarCell.setChildPerson(null);
    });

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

      // debugger;
      dropzoneElement.classList.remove('readyToGetDrop');
      draggableElement.classList.remove('readyToBeDropped');
      draggableElement.parentNode.parentNode.parentNode.classList.remove(
        'draggingOrigin',
      );

      cell.dispatchEvent('insertElement', {
        target: cell,
        relatedTarget: draggableElement,
      });
    };
    interact(this.el).dropzone(config);
  }
}
export default CalendarTableCell;
