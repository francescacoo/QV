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
  calendar_quit: any =[];

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

this.calendar_quit=[];

var today = new Date();
var nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+9);
var nextdate2="";


  var i=0;
  var integerPart = Math.round(this.total_day_puffs_yesterday/selecteddays);


  var newtotalpuffs = this.total_day_puffs_yesterday;
  for(i=0;i<selecteddays;i++){


    nextdate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+i);

    nextdate2=nextdate.getUTCDate() + "/"+ (nextdate.getUTCMonth() + 1);
    this.calendar_quit.push({"puffs": newtotalpuffs - (integerPart), "date":nextdate2});
    

   // alert(this.calendar_quit[0].puffs);

   // this.plan_days[i]=newtotalpuffs - (integerPart);
    newtotalpuffs= newtotalpuffs-(integerPart);
    integerPart=Math.round(newtotalpuffs/(selecteddays-i));
 
    //alert(this.plan_days[i].puffs);
    }

      // to force ngfor to update
      this.CD.detectChanges();
   //   alert(this.plan_days[i]);
    
  
}

insertquery(value1,value2){

  this.databaseObj.executeSql('INSERT INTO quitplan (puffn, day) VALUES ("'+value1+'","'+value2+'")',[])
  .then(() => {
 //   alert('Row puffs Inserted!');

  })
  .catch(e => {
    alert('error ' + JSON.stringify(e))
  });
}

saveplan(){

      // tslint:disable-next-line:max-line-length
      this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS quitplan (pid INTEGER PRIMARY KEY, puffn INTEGER, day TEXT)', [])
      .then(() => {
   

         for(var a=0; a<this.calendar_quit.length; a++){
   
          this.insertquery(this.calendar_quit[a].puffs,this.calendar_quit[a].date);
    
        }

alert("Plan saved!");


      })
      .catch(e => {
        alert('error ' + JSON.stringify(e));
      });

   

}

viewPlan(){
  this.databaseObj.executeSql("SELECT * FROM quitplan", [])
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
}

deleteRow(item) {
  this.databaseObj.executeSql("DELETE FROM quitplan", [])
    .then((res) => {
      alert("Row Deleted!");
    })
    .catch(e => {
      alert('error ' + JSON.stringify(e));
    });
}
}