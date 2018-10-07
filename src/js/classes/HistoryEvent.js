import * as moment from 'moment';

class HistoryEvent {
  constructor({
    date,
    title,
    description = '',
    mark,
  }: {
    date: moment.Moment,
    title: String,
    description: String,
    mark: String,
  }) {
    this.date = date;
    this.title = title;
    this.description = description;
    this.mark = mark;
  }
}

export default HistoryEvent;
