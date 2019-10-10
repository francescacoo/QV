import { Component } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  databaseObj: SQLiteObject; // Database instance object
  name_model:string = ""; // Input field model
  row_data: any = []; // Table rows
  readonly database_name:string = 'QV.db'; // DB name
  readonly table_name:string = "pufflog"; // Table name
  tot_puffs: number;
  total_day_puffs: number;

  today = Date.now();
  lastLoggedDay: any;
  manual_puff: any;

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    });

  }

  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
   //     alert('Database' + this.database_name + ' Created!');
   this.createTable();
   this.getPuffs();
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });

  }

  createTable() {
    // tslint:disable-next-line:max-line-length
    this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.table_name + ' (pid INTEGER PRIMARY KEY, puffn INTEGER, created_at DEFAULT CURRENT_TIMESTAMP)', [])
      .then(() => {
    //    alert('Table Created!');
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
  }

  // from the circle button
  insertPuff() {
    this.databaseObj.executeSql('INSERT INTO ' + this.table_name + ' (puffn) VALUES (1)', [])
      .then(() => {
    //    alert('Row puffs Inserted!');
        this.getPuffs();

      })
      .catch(e => {
        alert('error ' + JSON.stringify(e))
      });
  }

  // insert puff manually
  insertPuffManually() {
    if (!this.manual_puff.length) {
      alert('Enter number');
      return;
    }
    this.databaseObj.executeSql('INSERT INTO ' + this.table_name + ' (puffn) VALUES ("' + this.manual_puff + '")', [])
      .then(() => {
        alert('Row manual Inserted!');
        this.getPuffs();

      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
  }

  getPuffs() {
    this.databaseObj.executeSql('SELECT SUM(puffn) AS \'somma\' FROM ' + this.table_name +' WHERE DATE(created_at) = date(\'now\')', [])
      .then((res) => {
       // alert(res.toSource());
       if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          // tslint:disable-next-line:forin
          // tslint:disable-next-line:forin
          this.tot_puffs = res.rows.item(i).somma;
        }
      }
       this.total_day_puffs = this.tot_puffs;
 //     alert(this.total_day_puffs);
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
  }

  resetPuffs() {
    this.databaseObj.executeSql('SELECT MAX(created_at) AS \'last\' FROM ' + this.table_name, [])
    .then((res) => {
     // alert(res.toSource());
     if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        // tslint:disable-next-line:forin
        // tslint:disable-next-line:forin
        alert(res.rows.item(i).last);
      }
    }
    this.total_day_puffs = 0;

  });
  }



  getRows() {
    this.databaseObj.executeSql("SELECT * FROM " + this.table_name, [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });

      this.lastDay();

  }

  deleteRow(item) {
    this.databaseObj.executeSql("DELETE FROM " + this.table_name + " WHERE pid = " + item.pid, [])
      .then((res) => {
        alert("Row Deleted!");
        this.getRows();
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
  }

  myFunctionFra($event: any){
    console.log('ciao');
  }

  lastDay(){
    this.databaseObj.executeSql('SELECT DATE(created_at) AS \'datanow\' FROM ' + this.table_name, [])
    .then((res) => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          alert(res.rows.item(i).datanow);
        }
      }
    })
    .catch(e => {
      alert('error ' + JSON.stringify(e));
    });
  }
}