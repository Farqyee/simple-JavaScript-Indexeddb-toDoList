import { generateListData } from "./dom.js";
let db;
const dbName = "ToDoList";
const tbName = "task";
let cursor;
let request;

export function openDBConnection(version = 1) {
  return new Promise((resolve, reject) => {
    request = indexedDB.open(dbName, version);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
export function deleteDb() {
  indexedDB.deleteDatabase(dbName);
}
export function openDatabase(callback) {
  const request = indexedDB.open("ToDoList", 1);
  request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("task")) {
      const objectStore = db.createObjectStore("task", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("nama", "nama", { unique: false });
      objectStore.createIndex("completed", "completed", {
        unique: false,
      });
      objectStore.createIndex("user", "user", { unique: false });
    }
  };
  request.onsuccess = function (event) {
    db = event.target.result;

    if (callback) {
      callback(generateListData);
    }
  };
  request.onerror = function (event) {
    console.log(
      "Error creating tabel / opening database" + event.target.errorCode
    );
  };
}
export function clearRecord() {
  openDBConnection().then((db) => {
    const transaction = db.transaction(tbName, "readwrite");
    const objectStore = transaction.objectStore(tbName);
    objectStore.clear();
  });
}

export function getData(callback) {
  openDBConnection()
    .then((db) => {
      const transaction = db
        .transaction("task", "readonly")
        .objectStore("task");
      const getData = transaction.openCursor();
      getData.onsuccess = function (event) {
        cursor = event.target.result;
        if (cursor) {
          const cursorData = {
            id: cursor.key,
            nama: cursor.value.name,
            user: cursor.value.user,
            status: cursor.value.completed,
          };
          callback(cursorData);
          cursor.continue();
        } else {
          console.log("entries empty");
        }
      };
      getData.onerror = function (event) {
        console.log("error getting data" + event.target.error);
      };
    })
    .catch((err) => console.log(err));
}
export function getDataById(id) {
  return new Promise((resolve, reject) => {
    openDBConnection()
      .then((db) => {
        const transaction = db.transaction(tbName, "readwrite");
        const objectStore = transaction.objectStore(tbName);
        const req = objectStore.get(id);
        req.onsuccess = function (event) {
          let data = event.target.result;
          let dataO = {
            id: data.id,
            nama: data.name,
            user: data.user,
            status: data.completed,
          };
          resolve(dataO);
        };
        return req.onsuccess;
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function addData(namaTask, namaUser, callback) {
  openDBConnection().then((db) => {
    const transaction = db.transaction("task", "readwrite");
    const objectStore = transaction.objectStore("task");
    const data = { name: namaTask, user: namaUser, completed: "not-completed" };
    const addRequest = objectStore.add(data);
    addRequest.onsuccess = async function (event) {
      console.log("data sukses ditambahkan dg id: " + event.target.result);
      let dataO = await getDataById(event.target.result);

      if (callback) callback(dataO);
    };
    addRequest.onerror = function (error) {
      console.log(error);
    };
  });
}
export function changeStatusDB(id, text) {
  openDBConnection().then((db) => {
    const transaction = db.transaction(tbName, "readwrite").objectStore(tbName);
    const request = transaction.get(Number(id));
    request.onsuccess = function (event) {
      let data = event.target.result;
      data.completed = text;
      const update = transaction.put(data);
      update.onsuccess = () => console.log(`Status changed to ${text}`);
    };
  });
}
export function updateData(id, data) {
  openDBConnection().then((db) => {
    const objectStore = db.transaction(tbName, "readwrite").objectStore(tbName);

    const req = objectStore.get(Number(id));
    req.onsuccess = function (event) {
      const _data = event.target.result;
      _data.name = data.nama;
      _data.user = data.user;
      const update = objectStore.put(_data);
      update.onsuccess = function (event) {
        console.log(`data ${event.target.result} berhasil diubah`);
      };
    };
  });
}
export function deleteData(id) {
  const request = indexedDB.open(dbName, 1);
  request.onsuccess = () => (db = request.result);
  const transaction = db.transaction(tbName, "readwrite").objectStore(tbName);
  const req = transaction.delete(Number(id));
  req.onsuccess = function (event) {
    console.log(`data ${event.target.result} berhasil dihapus`);
  };
}
export function deleteObjectStore() {
  const request = indexedDB.open(dbName, 2);
  request.onupgradeneeded = function (event) {
    console.log("tes2");
    db = event.target.result;
    if (db.objectStoreNames.contains(tbName)) {
      db.deleteObjectStore(tbName);
      console.log("Object store deleted.");
    } else {
      console.log("Object store does not exist.");
    }
  };
}
