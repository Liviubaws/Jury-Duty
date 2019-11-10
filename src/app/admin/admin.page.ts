import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
created:boolean;
extended:boolean;
contests = [];
contest;
juror;
organiser;
name:string;
jurors = [];
organisers = [];
organisersNumber:number;
jurorsNumber:number;
organisersNames = [];
jurorsNames = [];
  constructor(public fdb: AngularFireDatabase) {
    this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
      this.contests = __contests;
    });
    this.fdb.list("/organisers/").valueChanges().subscribe(__organisers => {
      this.organisers = __organisers;
    });
    this.fdb.list("/jurors/").valueChanges().subscribe(__jurors => {
      this.jurors = __jurors;
    });
    this.created = false;
    this.extended = false;
  }

  ngOnInit() {

  }
  create() {
    this.created = true; 
  }
  extend(){
    this.extended = true;
    this.organisers.length = this.organisersNumber;
    this.jurors.length = this.jurorsNumber;
    this.organisersNames.length = this.organisersNumber;
    this.jurorsNames.length = this.jurorsNumber;
  }
  save(){
    for(var i = 0; i < this.jurorsNumber; i++){
      var code = this.generateCode();
      this.jurors[i] = {
        number: i,
        name: this.jurorsNames[i],
        jurorCode: code
      }
    }
    for(var i = 0; i < this.organisersNumber; i++){
      var code = this.generateCode();
      this.organisers[i] = {
        number: i,
        name: this.organisersNames[i],
        organiserCode: code
      }
    }
    console.log(this.organisers);
    console.log(this.jurors);
    this.contest = {
      name: this.name,
      jurorsNumber: this.jurorsNumber,
      organisersNumber: this.organisersNumber,
      jurors: this.jurors,
      organisers: this.organisers
    }
    console.log(this.contest);
    this.fdb.list("/contests/").push(this.contest);
    this.contests.push(this.contest);
    this.created = false;
  }
  generateCode(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
