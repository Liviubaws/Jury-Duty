import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from 'angularfire2/auth';
import { AlertController} from '@ionic/angular';
@Component({
  selector: 'app-jury',
  templateUrl: './jury.page.html',
  styleUrls: ['./jury.page.scss'],
})
export class JuryPage implements OnInit {
juror;
contests = [];
checked = [];
criteria;
criterias = [];
rounds;
criteriasNumber;
started: boolean;
showCriterias: boolean;
found: boolean;
confirm: boolean;
confirmCriterias: boolean;
roundTime;
timer;
disableInput: boolean;
juryClicked: boolean;
myGrades = [];
grades;
grade;
currentRound;
currentSeries;
roundTimeFixed;
teams;
name;
series;
ended: boolean;
  constructor(private route: ActivatedRoute, public fdb:AngularFireDatabase, private fire: AngularFireAuth, private alertCtrl: AlertController, private router: Router) {
    this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
      this.contests = __contests;
    });
    this.fdb.list("/grades/").valueChanges().subscribe(__grades => {
      this.grades = __grades;
    });
    for(var i = 0; i < 99999 ; i++){
      this.checked[i] = false;
    }
    this.found = false;
    this.started = false;
    this.disableInput = true;
    this.rounds = -1;
    this.roundTime = -1;
    this.juryClicked = false;
    this.currentRound = 1;
    this.currentSeries = 1;
    this.ended = false;
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.juror = JSON.parse(params["loggedJuror"]);
    });
  }
  findContests(){
    this.found = true;
    for(var i = 0; i < this.contests.length; i++){
      for(var j = 0; j < this.contests[i].jurors.length; j++){
        if(this.juror.name == this.contests[i].jurors[j].name && this.checked[i] == false){
          
          if(this.contests[i].started == true){
            this.started = true;
            this.name = this.contests[i].name;
            this.rounds = this.contests[i].options.rounds;
            this.roundTime = this.contests[i].roundTime;
            this.roundTimeFixed = this.contests[i].roundTime;
            this.teams = this.contests[i].teams;
            this.series = this.contests[i].series;
            this.myGrades.length = this.teams.length;
            break;
          }
          else{
            this.started = false;
          }
        }
      }
      this.checked[i] = true;
    }
  }
  logout(){
    this.alert("You logged out");
    this.fire.auth.signOut();
    this.router.navigate(['/login']);
  }
  logoutEnd(){
    this.alert("Contest ended");
    this.fire.auth.signOut();
    this.router.navigate(['/login']);
  }
  async alert(msg: string) {
    const alert = await this.alertCtrl.create({
    message: msg,
    buttons: ['OK']
   });
   await alert.present(); 
  }
  jury(){
    this.startTimer();
    this.juryClicked = true;
  }
  startTimer(){
    this.timer = setTimeout(x => 
      {
          if(this.roundTime <= 0) { }
          this.roundTime -= 1;
          console.log(this.roundTime);
          if(this.roundTime>0){
            this.disableInput = true;
            this.startTimer();
          }
          
          else{
              this.disableInput = false;
          }

      }, 1000);
  }
  vote(){
    this.grade = {
      contestName: this.name,
      series: this.currentSeries,
      round: this.currentRound,
      juror: this.juror,
      grades: this.myGrades
    }
    this.fdb.list("/grades/").push(this.grade); 
    if(this.currentRound < this.rounds){
      for(var i = 0; i < this.teams.length; i++){
        this.myGrades.pop();
      }
      this.currentRound++;
      this.disableInput = true;
      this.roundTime = this.roundTimeFixed;
      this.startTimer();
    }
    else{
      if(this.currentSeries < this.series){
        this.currentSeries++;
        this.currentRound = 1;
        this.vote();
      }
      else{
        this.ended = true;
        this.logoutEnd();
      }
    }
  }
}
