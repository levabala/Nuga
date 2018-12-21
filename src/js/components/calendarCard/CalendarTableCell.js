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
    );
    const cell = this.calendarCell;

    const addTimeout = null;

    // FIXIT: blinking when point on bottom border
    this.el.addEventListener('mouseenter', () => {
      if (this.locked || this.el.classList.contains('readyToAdd')) return;

      if (this.calendarCell.personCell.mock) {
        this.el.classList.add('readyToAdd');
        mount(this.calendarCell.container, new ReadyToAddCell());
      }
    });

    this.el.addEventListener('mouseleave', () => {
      if (this.locked) return;

      clearTimeout(addTimeout);
      if (!this.el.classList.contains('readyToAdd')) return;

      this.el.classList.remove('readyToAdd');
      this.calendarCell.setChildPerson(null);
    });

    const config = dropConfig;
    config.ondrop = event => {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      console.log('drop');

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
