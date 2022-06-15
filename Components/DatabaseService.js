// Created using this tutorial:
// https://infinitbility.com/react-native-sqlite-storage-examples-of-query

// TODO: more abstract SQL queries
// TODO: models support

import {openDatabase} from 'react-native-sqlite-storage';

class Database {
  #tableName;
  #database;

  constructor(name, createFromLocation, tableName) {
    this.#tableName = tableName;
    this.#database = openDatabase({
      name: name,
      createFromLocation: createFromLocation,
    });
  }

  ExecuteQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      this.#database.transaction(trans => {
        trans.executeSql(
          sql,
          params,
          (trans, results) => {
            resolve(results);
          },
          error => {
            reject(error);
          },
        );
      });
    });

  async createTable() {
    await this.ExecuteQuery(
      `CREATE TABLE '${this.#tableName}' (
        "id"	INTEGER NOT NULL UNIQUE,
        "time"	TEXT NOT NULL,
        "description"	TEXT,
        "isEnabled"	INTEGER NOT NULL,
        "radio"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      )`,
    );
  }

  async insert(time, description, radio, isEnabled = 1) {
    await this.ExecuteQuery(
      `INSERT INTO ${
        this.#tableName
      } (time, description, isEnabled, radio) VALUES (?, ?, ?, ?)`,
      [time, description, isEnabled, radio],
    );
    console.log('Inserted successfully');
  }

  async update(id, time, description, radio, isEnabled = 1) {
    await this.ExecuteQuery(
      `UPDATE ${
        this.#tableName
      } SET time = ? , description = ? , isEnabled = ? , radio = ? WHERE id = ?`,
      [time, description, isEnabled, radio, id],
    );
    console.log('Updated successfully');
  }

  async get(id) {
    let selectQuery = await this.ExecuteQuery(
      `SELECT * FROM ${this.#tableName} WHERE id = ?`,
      [id],
    );
    return selectQuery.rows.raw()[0];
  }

  async all() {
    let selectQuery = await this.ExecuteQuery(
      `SELECT * FROM ${this.#tableName}`,
    );
    return selectQuery.rows.raw();
  }

  async delete(id) {
    await this.ExecuteQuery(`DELETE FROM ${this.#tableName} WHERE id = ?`, [
      id,
    ]);
    console.log('Deleted item successfully');
  }

  async recreate() {
    await this.ExecuteQuery(`DROP TABLE ${this.#tableName}`);
    await this.createTable();
  }
}

export {Database};
