import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-organiser',
  templateUrl: './organiser.page.html',
  styleUrls: ['./organiser.page.scss'],
})
export class OrganiserPage implements OnInit {
  organiser;
  myContests = [];
  contests = [];
  checked = [];
  criteria;
  contest;
  criterias = [];
  criteriasNumber;
  showCriterias: boolean;
  found: boolean;
  confirm: boolean;
  criteriasName = [];
  criteriasMin = [];
  criteriasMax = [];
  teams = [];
  contestantsNumber: number;
  type;
  rounds: number;
  series: number;
  contestantsNumberPerRound: number;
  doneClicked: boolean;
  showTeams: boolean;
  showCriteriasNumber: boolean;
  teamNames = [];
  form = [];
  continue: boolean;
  options;
    constructor(private route: ActivatedRoute, public fdb:AngularFireDatabase) {
      this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
        this.contests = __contests;
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
    }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.organiser = JSON.parse(params["loggedOrganiser"]);
      });
    }

    findContests(){ 
      for(var i = 0; i < this.contests.length; i++){
        for(var j = 0; j < this.contests[i].organisers.length; j++){
          if(this.organiser.name == this.contests[i].organisers[j].name && this.checked[i] == false){
            this.found = true;
            this.contest = this.contests[i];
            this.myContests.push(this.contests[i]);
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
      this.doneClicked = true;
      
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
    }

    confirmTeams(){
      for(var i = 0 ; i < this.contestantsNumber; i++){
        this.teams[i] = this.teamNames[i];
      }
      this.showTeams = false;
      this.showCriteriasNumber = true;
    }

    numberIntroduced(){
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

    finish(){
      for(var i = 0 ; i < this.criteriasNumber; i++){
        this.criterias[i].name = this.criteriasName[i];
        this.criterias[i].min = this.criteriasMin[i];
        this.criterias[i].max = this.criteriasMax[i];
      }

      this.fdb.list("/contests/").remove(this.contest.$key);

      this.contest = {
        name: this.contest.name,
        jurorsNumber: this.contest.jurorsNumber,
        organisersNumber: this.contest.organisersNumber,
        jurors: this.contest.jurors,
        organisers: this.contest.organisers,
        criterias: this.criterias,
        options: this.options,
        teams: this.teams,
      }
      
      this.fdb.list("/contests/").push(this.contest);
    }

  }
