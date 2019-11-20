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
confirmCriterias: boolean;
  constructor(private route: ActivatedRoute, public fdb:AngularFireDatabase, private fire: AngularFireAuth, private alertCtrl: AlertController, private router: Router) {
    this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
      this.contests = __contests;
    });
    for(var i = 0; i < 99999 ; i++){
      this.checked[i] = false;
    }
    this.found = false;
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
          this.contest = this.contests[i];
          this.myContests.push(this.contests[i]);
        }
      }
      this.checked[i] = true;
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
}