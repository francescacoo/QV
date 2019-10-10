import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.page.html',
  styleUrls: ['./goal.page.scss'],
})
export class GoalPage implements OnInit {

  databaseObj: SQLiteObject; // Database instance object
  name_model:string = ""; // Input field model
  row_data: any = []; // Table rows
  readonly database_name:string = 'QV.db'; // DB name
  readonly table_name:string = "pufflog"; // Table name
  tot_puffs_yesterday: number;
  total_day_puffs_yesterday: number;

  today = Date.now();
  lastLoggedDay: any;
  manual_puff: any;

  constructor(   private platform: Platform,
    private sqlite: SQLite) { 
    
  }

  ngOnInit() {
    // select the total puffs of day before
    this.databaseObj.executeSql('SELECT SUM(puffn) AS \'somma\' FROM ' + this.table_name +' WHERE DATE(created_at) = DATEADD(day, -1, convert(date, GETDATE()))', [])
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
     alert(this.total_day_puffs_yesterday);
    })
    .catch(e => {
      alert('error ' + JSON.stringify(e));
    });


  }



 

  


}
