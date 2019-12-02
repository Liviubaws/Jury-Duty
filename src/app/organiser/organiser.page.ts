import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-organiser',
  templateUrl: './organiser.page.html',
  styleUrls: ['./organiser.page.scss'],
})
export class OrganiserPage implements OnInit {
  organiser;
  criteria;
  contest;
  type;
  roundTime;
  criteriasNumber;
  options;
  admin;
  criterias = [];
  myContests = [];
  contests = [];
  checked = [];
  teamNames = [];
  form = [];
  criteriasName = [];
  criteriasMin = [];
  criteriasMax = [];
  teamSets = [];
  teams = [];
  contestantsNumber: number;
  rounds: number;
  series: number;
  contestantsNumberPerRound: number;
  finished: boolean;
  showCriterias: boolean;
  found: boolean;
  confirm: boolean;
  continue: boolean;
  doneClicked: boolean;
  showTeams: boolean;
  showCriteriasNumber: boolean;
  complete: boolean;
  started: boolean;
  disableInput: boolean;
  showResults: boolean;
  timer;
  currentSeries;
  seriesTeams = [];
  ended;
  grades = [];
  roundGrades = [];
  teamGrades:number[] = [];
  seriesStarted: boolean;
  seriesToShow;
    constructor(private route: ActivatedRoute, public fdb:AngularFireDatabase, private fire: AngularFireAuth, public router: Router, private alertCtrl: AlertController) {
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
      this.continue = false;
      this.showCriterias = false;
      this.confirm = false;
      this.doneClicked = false;
      this.showTeams= false;
      this.finished = false;
      this.showCriteriasNumber = false;
      this.complete = false;
      this.started = false;
      this.ended = false;
      this.currentSeries = 1;
      this.seriesStarted = false;
      this.showResults = false;
      this.seriesToShow = 1;
    }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.organiser = JSON.parse(params["loggedOrganiser"]);
      });
    }
    ok(){
      this.showResults = false;
    }
    ok2(){
      this.finished = false;
    }
    findContests(){ 
      this.refreshVariables();
      for(var i = 0; i < this.contests.length; i++){
        for(var j = 0; j < this.contests[i].organisers.length; j++){
          if(this.organiser.name == this.contests[i].organisers[j].name && this.checked[i] == false){
            this.found = true;
            this.admin = this.contests[i].admin;
            this.contest = this.contests[i];
            this.myContests.push(this.contests[i]);
            
            if(this.contest.complete == true){
              this.complete = true;
            }
            break;
          }
        }
        this.checked[i] = true;
      }
    }

    continueFct(){
      this.continue = true;
    }

    done(){
      var errors = 0;
      
      if(this.type == null){
        alert("Please select a type for your contest");
        errors++;
      }
      if(this.contestantsNumber == null || this.contestantsNumber == 0 || this.contestantsNumber % 2 != 0){
        alert("Please enter a contestants number that is dividable by 2");
        errors++;
      }
      if(this.rounds == null || this.rounds == 0){
        alert("Please enter number of rounds");
        errors++;
      }
      if(this.type != "battle") {
        if(this.contestantsNumberPerRound == null || this.contestantsNumberPerRound == 0){
          alert("Please enter contestants number per round");
          errors++;
        }
        if(this.contestantsNumber % this.contestantsNumberPerRound != 0){
          alert("Please make sure you enter good numbers");
          errors++;
        }
        else{
          this.series = this.contestantsNumber/this.contestantsNumberPerRound;
        }
      }
      else{
        this.contestantsNumberPerRound = 2;
        this.series = Math.log2(this.contestantsNumber);
      }
      if(errors == 0){
        this.options = {
          type: this.type,
          contestantsNumber: this.contestantsNumber,
          rounds: this.rounds,
          series: this.series,
          contestantsNumberPerRound: this.contestantsNumberPerRound
        };
  
        for(var i = 0 ; i < this.contestantsNumber; i++){
          this.teams.push("");
        }
        this.showTeams = true;
        this.doneClicked = true;
      }
    }

    confirmTeams(){
      var errors = 0;
      for(var i = 0 ; i < this.contestantsNumber; i++){
        if(this.teamNames[i] == "" || this.teamNames[i] == null){
          var j = i + 1;
          alert("Please insert name for team #" + j)
          errors++;
        }
        else{
          this.teams[i] = this.teamNames[i];
        }
      }
      if(errors == 0){
        this.showTeams = false;
        this.showCriterias = true;
        this.showCriteriasNumber = true;
        this.numberIntroduced();
      }
    }

    numberIntroduced(){
      this.criteriasNumber = 1;
      if(this.criteriasNumber == 0 || this.criteriasNumber == null){
        alert("Please insert number of criterias");
      }
      else{
        this.confirm = true;
        for(var i = 0; i < this.criteriasNumber; i++){
          this.criteria = {
            name: "undefined",
            min: 0,
            max: 0
          }
          this.criterias.push(this.criteria);
        }
        this.showCriterias = true;
        this.showCriteriasNumber = false;
      }
    }

    finish(){
      var errors = 0;
      for(var i = 0 ; i < this.criteriasNumber; i++){
        this.criterias[i].name = this.criteriasName[i];
        this.criterias[i].min = this.criteriasMin[i];
        this.criterias[i].max = this.criteriasMax[i];
        if(this.criteriasName[i] == "" || this.criteriasName[i] == null){
          var j = i + 1;
          alert("Please insert criteria name for criteria #" + j);
          errors++;
        }
        if(this.criteriasMin[i] == 0 || this.criteriasMin[i] == null){
          var j = i + 1;
          alert("Please insert criteria minimum value for criteria #" + j);
          errors++;
        }
        if(this.criteriasMax[i] == "" || this.criteriasMax[i] == null){
          var j = i + 1;
          alert("Please insert criteria maximum value for criteria #" + j);
          errors++;
        }
        if(this.criteriasMax[i] <= this.criteriasMin || this.criteriasMax[i] == 0){
          var j = i + 1;
          alert("Please insert correct values for criteria #" + j);
          errors++;
        }
      }
      if(errors == 0){
        this.fdb.list("/contests/").remove(this.contest.$key);
        this.complete = true;
        this.contest = {
          admin: this.admin,
          name: this.contest.name,
          jurorsNumber: this.contest.jurorsNumber,
          organisersNumber: this.contest.organisersNumber,
          jurors: this.contest.jurors,
          organisers: this.contest.organisers,
          criterias: this.criterias,
          options: this.options,
          teams: this.teams,
          complete: this.complete
        }
        
        this.fdb.list("/contests/").push(this.contest);
        this.finished = true;
        this.showCriterias = false;
        this.found = false;
      }
    }
    refreshVariables(){
      this.found = false;
      this.continue = false;
      this.showCriterias = false;
      this.confirm = false;
      this.doneClicked = false;
      this.showTeams= false;
      this.finished = false;
      this.criteria = null;
      this.contest = null;
      this.type = null;
      this.criteriasNumber = null;
      this.options = null;
      this.criterias =  [];
      this.myContests =  [];
      this.teamNames = [];
      this.form = [];
      this.criteriasName = [];
      this.criteriasMin = [];
      this.criteriasMax = [];
      this.teams = [];
      this.contestantsNumber = null;
      this.rounds = null;
      this.series = null;;
      this.contestantsNumberPerRound = null;
      this.complete = false;
      this.started = false;
      for(var i = 0; i < 99999 ; i++){
        this.checked[i] = false;
      }
    }
    logout(){
      this.alert("You logged you");
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
    startContest(){
      this.started = true;
      this.fdb.list("/contests/").remove(this.contest.$key);
      this.contest = {
        admin: this.admin,
        name: this.contest.name,
        jurorsNumber: this.contest.jurorsNumber,
        organisersNumber: this.contest.organisersNumber,
        jurors: this.contest.jurors,
        organisers: this.contest.organisers,
        criterias: this.contest.criterias,
        options: this.contest.options,
        teams: this.contest.teams,
        complete: true,
        started: this.started,
        ended: this.ended
      }
      this.fdb.list("/contests/").push(this.contest);
    }
    startSeries(){
      this.seriesStarted = true;
      this.teamGrades.length = this.contest.teams.length;
      for(var i = 0 ; i < this.contest.teams.length; i++){
        this.teamGrades[this.contest.teams[i]] = 0;
      }
      
      this.fdb.list("/contests/").remove(this.contest.$key);
      this.contest = {
        admin: this.admin,
        name: this.contest.name,
        jurorsNumber: this.contest.jurorsNumber,
        organisersNumber: this.contest.organisersNumber,
        jurors: this.contest.jurors,
        organisers: this.contest.organisers,
        criterias: this.contest.criterias,
        options: this.contest.options,
        teams: this.contest.teams,
        complete: true,
        started: this.started,
        roundTime: this.roundTime,
        currentSeries: this.currentSeries,
        ended: this.ended
      }
      this.fdb.list("/contests/").push(this.contest);
      
    }
    getSeriesVotes(){
      this.showResults = true;
      for(var i = 0 ; i < this.grades.length;i++){
        for(let team in this.grades[i].grades){
          this.teamGrades[team] = Number(this.teamGrades[team]) + Number(this.grades[i].grades[team]);
        }
      }
      for(let team in this.teamGrades){
        this.roundGrades.push(this.teamGrades[team]);
      }
      var runde = [];
      runde.length = this.contest.options.contestantsNumberPerRound;
      var ind = 0;
      for(var i = 0 ; i < 4 ; i = i + 2){
        runde[ind] = this.roundGrades.splice(0, 2);
        ind++;
      }
      var max = [];
      max.length = this.contest.options.rounds;
      for(var i = 0 ; i < runde.length; i++){
        max[i] = Math.max.apply(Math, runde[i]);
      }
      for(var i = 0 ; i < this.contest.teams.length;i++){
        this.teams.pop();
      }
      for(var i = 0 ; i < this.grades.length; i++){
        for(let team in this.grades[i].grades){
          for(var j = 0 ; j < max.length; j++){
            if(this.grades[i].grades[team] == max[j]){
              this.teams.push(team);
            }
          }
        }
      }
      if(this.currentSeries <= this.contest.options.series){
        this.currentSeries ++ ;
        this.seriesToShow = this.currentSeries - 1 ;
      }
      else{
        this.ended = true;
        this.alert("Contest ended");
      }
      this.fdb.list("/contests/").remove(this.contest.$key);
      this.contest = {
        admin: this.admin,
        name: this.contest.name,
        jurorsNumber: this.contest.jurorsNumber,
        organisersNumber: this.contest.organisersNumber,
        jurors: this.contest.jurors,
        organisers: this.contest.organisers,
        criterias: this.contest.criterias,
        options: this.contest.options,
        teams: this.teams,
        complete: true,
        started: this.started,
        roundTime: this.roundTime,
        currentSeries: this.currentSeries,
        ended: this.ended
      }
      this.fdb.list("/contests/").push(this.contest);
      this.seriesStarted = false;
    }
  }
