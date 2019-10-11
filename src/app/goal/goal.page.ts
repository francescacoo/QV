import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.page.html',
  styleUrls: ['./goal.page.scss'],
})
export class GoalPage {

  databaseObj: SQLiteObject; // Database instance object
  name_model:string = ""; // Input field model
  row_data: any = []; // Table rows
  readonly database_name:string = 'QV.db'; // DB name
  readonly table_name:string = "pufflog"; // Table name
  tot_puffs_yesterday: number;
  total_day_puffs_yesterday: number;
  stepdown: number;
  plan_days: any=[];

  today = Date.now();
  lastLoggedDay: any;
  manual_puff: any;

  constructor(   
    private platform: Platform,
    private sqlite: SQLite) { 
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
     //   alert('Database' + this.database_name + ' Created!');
        this.createTable();

        this.getLastDayPuffs();
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
 
  }
  createTable() {
    // tslint:disable-next-line:max-line-length
    this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.table_name + ' (pid INTEGER PRIMARY KEY, puffn INTEGER, created_at DEFAULT CURRENT_TIMESTAMP)', [])
      .then(() => {
   //     alert('Table Created!');
      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });
  }
  getLastDayPuffs(){
//    this.databaseObj.executeSql('SELECT SUM(puffn) AS \'somma\' FROM ' + this.table_name +' WHERE DATE(created_at) = date(\'now\',\'-1\',\'day\')', [])
this.databaseObj.executeSql('SELECT SUM(puffn) AS \'somma\' FROM ' + this.table_name +' WHERE DATE(created_at) = date(\'now\')', [])
    .then((res) => {
     // alert(res.toSource());
     if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        // tslint:disable-next-line:forin
        // tslint:disable-next-line:forin
        this.tot_puffs_yesterday = res.rows.item(i).somma;
      }
    }
     this.total_day_puffs_yesterday = this.tot_puffs_yesterday;
//     alert(this.total_day_puffs);
    })
    .catch(e => {
      alert('error ' + JSON.stringify(e));
    });
  }

// quit in 10 days
createPlan1(){
  // divide the current daily puffs by 10 (on one day or more days and do average)
  this.stepdown = this.total_day_puffs_yesterday/10;
  var i=0;
  var floatingPointPart = (this.total_day_puffs_yesterday/10) % 1;
  var newtotalpuffs = this.total_day_puffs_yesterday;
  if(floatingPointPart==0){
    for(i=0;i<10;i++){
     // alert("inside for");
      this.plan_days[i]=newtotalpuffs - (this.stepdown);
      newtotalpuffs= newtotalpuffs-(this.stepdown);
    //  alert(this.plan_days[i]);
    }
  }



var integerPart = Math.round(this.total_day_puffs_yesterday/10);

//  alert(floatingPointPart);
//  alert(integerPart);

}

// quit in 15 days
createPlan2(){}

// quit in 30 days
createPlan3(){}

//custom plan


}