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
competingTeams = [];
teamGrades = [];
competed = [];
ended: boolean;
contest;
counter;
hide:boolean;
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
    for(var i = 0 ; i < 99999; i++){
      this.competed[i] = false;
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
    this.counter = 0;
    this.hide = false;
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
            this.contest = this.contests[i];
            this.started = true;
            this.name = this.contests[i].name;
            this.rounds = this.contests[i].options.rounds;
            this.roundTime = this.contests[i].roundTime;
            this.roundTimeFixed = this.contests[i].roundTime;
            this.teams = this.contests[i].teams;
            this.series = this.contests[i].options.series;
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
    while(this.counter < this.contest.options.contestantsNumberPerRound*this.currentRound){
      this.competingTeams.push(this.contest.teams[this.counter]);
      this.counter++;
    }
    //console.log(this.competingTeams.length);
    //console.log(this.competingTeams);
    //this.myGrades.length = this.competingTeams.length;
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
    this.myGrades = this.myGrades.splice(0, this.contest.options.contestantsNumberPerRound);
    this.fdb.list("/grades/").push(this.grade);
    var length = this.competingTeams.length;
      for(var i = 0; i <= length; i++){
        this.competingTeams.pop();
    } 
    if(this.currentRound < this.rounds){
      this.currentRound++;
      while(this.counter < this.contest.options.contestantsNumberPerRound*this.currentRound){
        this.competingTeams.push(this.contest.teams[this.counter]);
        this.counter++;
      }
      this.disableInput = true;
      this.roundTime = this.roundTimeFixed;
      this.startTimer();
    }
    else{
      this.hide = true;
      //Ia [cumva] echipele care au trecut mai departe din organiser
      //Same shit for alea -> DONE !!
      /*if(this.currentSeries < this.series){
        this.currentSeries++;
        this.currentRound = 1;
        while(this.counter < this.contest.options.contestantsNumberPerRound*this.currentSeries){
          this.competingTeams.push(this.contest.teams[this.counter]);
          this.counter++;
        }
        this.vote();
      }
      else{
        this.ended = true;
        this.logoutEnd();
      }*/
    }
  }
}
