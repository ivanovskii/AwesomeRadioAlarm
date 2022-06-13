import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

class Database {
  #tableName;
  #database;

  constructor(name, createFromLocation, tableName) {
    this.#tableName = tableName;
    this.#database = this.getDBConnection(name, createFromLocation);
  }

  getDBConnection = async (name, createFromLocation) => {
    return openDatabase({name: name, createFromLocation: createFromLocation});
  };

  insert = (time, description, radio) => {
    return new Promise(() => {
      console.log(time, description, radio);
      this.#database.transaction(tx => {
        console.log('suck dick');
        tx.executeSql(
          'INSERT INTO alarms (time, description, isEnabled, radio) VALUES (?, ?, ?, ?)',
          [time, description, 1, radio],
          (tx, results) => {
            console.log('insertion: ' + results.insertId);
          },
        );
      });
    });
  };
}

export {Database};
