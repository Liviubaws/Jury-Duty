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
organisersArray = [];
organisers = [];
organisersNumber:number;
organisersNames = [];
jurorsNames = [];
jurorsNumber:number;
criterias = [];
index = 0;
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
    for(var i = 0; i < this.organisersNumber; i++){
      this.organisersNames[i] = "undefined";
    }
    for(var i = 0; i < this.jurorsNumber; i++){
      this.jurorsNames[i] = "undefined";
    }
  }
  addCriteria(criteria){
    this.criterias[this.index] = criteria;
    this.index ++ ;
  }
  save(){
    for(var i = 0; i < this.jurorsNumber; i++){
      var code = this.generateJuryCode();
      this.juror = {
        number: this.jurorsNumber[i],
        name: this.jurorsNames[i],
        jurorCode: code
      }
      this.jurors.push(this.juror);
    }
    for(var i = 0; i < this.organisersNumber; i++){
      var code = this.generateJuryCode();
      this.organiser = {
        number: this.organisersNumber[i],
        name: this.organisersNames[i],
        organiserCode: code
      }
      this.organisers.push(this.organiser);
    }
    this.contest = {
      name: this.name,
      jurorsNumber: this.jurorsNumber,
      organisersNumber: this.organisersNumber,
      jurors: this.jurors,
      organisers: this.organisers,
      criterias: this.criterias
    }
    console.log(this.contest);
    this.contest.push(this.contest);
    this.fdb.list("/contests/").push(this.contest);
    //this.contests.push(this.contest);
    //this.created = false;
  }
  generateJuryCode(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
