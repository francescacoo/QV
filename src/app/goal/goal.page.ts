import { Component, ChangeDetectorRef  } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';


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
  rangevalue: any;

  constructor(   
    private platform: Platform,
    private CD: ChangeDetectorRef,
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

  changerange($event: any){
    this.rangevalue=$event.detail.value;
    this.createPlan1(this.rangevalue);
  }


// quit in 10 days
createPlan1(selecteddays){


this.plan_days =[];
 // alert(selecteddays);

 

 // divide the current daily puffs by 10 (on one day or more days and do average)
  //this.stepdown = this.total_day_puffs_yesterday/selecteddays;
  var i=0;
  var integerPart = Math.round(this.total_day_puffs_yesterday/selecteddays);


  //alert(integerPart);

  var newtotalpuffs = this.total_day_puffs_yesterday;
    for(i=1;i<=selecteddays;i++){
     // alert("inside for");

     this.plan_days[i]=new Date();
     this.plan_days[i]=this.plan_days[i].setDate(this.plan_days[i].getDate()+i);
     alert(this.plan_days[i]);

     this.plan_days[i]=newtotalpuffs - (integerPart);
     newtotalpuffs= newtotalpuffs-(integerPart);
      integerPart=Math.round(newtotalpuffs/(selecteddays-i));
 

    /*  if(floatingPointPart==0){
      this.plan_days[i]=newtotalpuffs - (integerPart);
      newtotalpuffs= newtotalpuffs-(integerPart);
      }
*/
    

      }

    //  alert(integerPart);
      // to force ngfor to update
      this.CD.detectChanges();
   //   alert(this.plan_days[i]);
    
  
}

// quit in 15 days
createPlan2(){}

// quit in 30 days
createPlan3(){}

//custom plan


}