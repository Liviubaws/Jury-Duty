import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController} from '@ionic/angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
created:boolean;
extended:boolean;
done:boolean;
found:boolean;
name:string;
organisersNumber:number;
jurorsNumber:number;
editClicked:boolean;
contest;
juror;
organiser;
contests = [];
jurors = [];
organisers = [];
organisersNames = [];
jurorsNames = [];
checked = [];
myContests = [];
edited = [];

  constructor(public fdb: AngularFireDatabase, public alertCtrl: AlertController, public fire: AngularFireAuth, private router: Router) {
    this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
      this.contests = __contests;
    });
    this.fdb.list("/organisers/").valueChanges().subscribe(__organisers => {
      this.organisers = __organisers;
    });
    this.fdb.list("/jurors/").valueChanges().subscribe(__jurors => {
      this.jurors = __jurors;
    });
    for(var i = 0; i < 99999 ; i++){
      this.checked[i] = false;
      this.edited[i] = false;
    }
    this.created = false;
    this.extended = false;
    this.done = false;
    this.found = false;
    this.editClicked = false;
  }

  ngOnInit() {

  }
  async alert(msg: string) {
    const alert = await this.alertCtrl.create({
    message: msg,
    buttons: ['OK']
   });
   await alert.present(); 
  }
  create() {
    this.created = true; 
  }
  extend(){
    var errors = 0;
    if(this.name.length == 0){
      this.alert("Enter a name for the contest");
      errors ++;
    }
    if(this.organisersNumber == 0 || this.organisersNumber == null){
      this.alert("Enter organisers number");
      errors ++;
    }
    if(this.jurorsNumber == 0 || this.jurorsNumber == null){
      this.alert("Enter jurors number");
      errors ++;
    }
    if(errors == 0){
      this.extended = true;
      this.organisers.length = this.organisersNumber;
      this.jurors.length = this.jurorsNumber;
      this.organisersNames.length = this.organisersNumber;
      this.jurorsNames.length = this.jurorsNumber;
    }
  }
  save(){
    var errors = 0;
    for(var i = 0; i < this.jurorsNumber; i++){
      if(this.jurorsNames[i] == null || this.jurorsNames[i] == ""){
        var j = i + 1;
        this.alert("Enter name for juror #" + j);
        errors ++;
      }
      else{
        var code = this.generateCode();
        this.jurors[i] = {
          number: i,
          name: this.jurorsNames[i],
          jurorCode: code
        }
      }
    }
    for(var i = 0; i < this.organisersNumber; i++){
      if(this.organisersNames[i] == null || this.organisersNames[i] == ""){
        var j = i + 1;
        this.alert("Enter name for organiser #" + j);
        errors ++;
      }
      else{
        var code = this.generateCode();
        this.organisers[i] = {
          number: i,
          name: this.organisersNames[i],
          organiserCode: code
        }
      }
    }
    if(errors == 0) {
      console.log(this.organisers);
      console.log(this.jurors);
      this.contest = {
        admin: this.fire.auth.currentUser.email,
        name: this.name,
        jurorsNumber: this.jurorsNumber,
        organisersNumber: this.organisersNumber,
        jurors: this.jurors,
        organisers: this.organisers
      }
      console.log(this.contest);
      this.fdb.list("/contests/").push(this.contest);
      this.contests.push(this.contest);
      this.done = true;
    }
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
  refreshVariables(){
    this.created = false;
    this.extended = false;
    this.done = false;
    this.editClicked = false;
    this.jurorsNumber = null;
    this.organisersNumber = null;
    this.contest = null;
    this.juror = null;
    this.organiser = null;
    this.name = "";
    this.jurors = [];
    this.organisers = [];
    this.jurorsNames = [];
    this.organisersNames = [];
    for(var i = 0; i < 99999 ; i++){
      this.checked[i] = false;
    }
    this.found = false;
  }
  logout(){
    this.alert("You logged you");
    this.fire.auth.signOut();
    this.router.navigate(['/login']);
  }
  findContests(){ 
    this.refreshVariables();
    for(var i = 0; i < this.contests.length; i++){
      if(this.fire.auth.currentUser.email == this.contests[i].admin && this.checked[i] == false){
        this.found = true;
        this.myContests.push(this.contests[i]);
      }
      this.checked[i] = true;
    }
  }
  deleteContest(myContest){
    var index = -1;
    for(var i = 0; i < this.myContests.length; i++){
      if(this.myContests[i] == myContest){
        index = i;
      }
    }
    if(index != -1) {
      this.myContests.splice(index, 1);
      this.fdb.list("/contests/").remove(myContest.$key);
    }
  }
  editContest(myContest){
    this.editClicked = true;
    var index = -1;
    for(var i = 0; i < this.myContests.length; i++){
      if(this.myContests[i] == myContest){
        index = i;
        this.edited.push(this.myContests[i]);
      }
    }
  }
  finishEdit(){
    this.editClicked = false;
  }
}
