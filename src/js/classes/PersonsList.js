import PersonData from './dataTypes/PersonData';

class PersonsList {
  constructor(persons: Array<PersonData> = []) {
    this.persons = persons;
  }

  get count() {
    return this.persons.length
  }

  getByIndex(index) {
    return this.persons[index]
  }

  get(name: String, surname: String) {
    return this.persons.find(
      person =>
        person.name.toLowerCase() === name.toLowerCase() &&
        person.surname.toLowerCase() === surname.toLowerCase(),
    );
  }
}

export default PersonsList;
