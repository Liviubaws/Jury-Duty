import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController} from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string;
  password:string;
  users = [];
  organiserCode: string;
  jurorCode: string;
  contests = [];
  loggedJuror;
  loggedOrganiser;
  forgotClicked: boolean;
  forgotMail: string;
  constructor(private router:Router, private fire: AngularFireAuth, public fdb:AngularFireDatabase, public alertCtrl:AlertController, public platform:Platform) { 
    this.fdb.list("/users/").valueChanges().subscribe(__users => {
      this.users = __users;
    });
    this.fdb.list("/contests/").valueChanges().subscribe(__contests => {
      this.contests = __contests;
    });
  }
  
  async alert(msg: string) {
    const alert = await this.alertCtrl.create({
    message: msg,
    buttons: ['OK']
   });
   await alert.present(); 
  }

  ngOnInit() {
  }

  login(){
    var found = 0;
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i] == this.email){
        found = 1;
      }
    }
    if(found == 1) {
      this.fire.auth.signInWithEmailAndPassword(this.email, this.password).then(data =>{
        if(this.fire.auth.currentUser.emailVerified == true){
          this.alert('You have successfully logged in!')
          console.log("Signed in with "+this.email+" and pass "+this.password);
          this.router.navigate(['/admin']);
        }
        else{
          this.alert("Please verify your email");
        }
      })
      .catch(error => {
        console.log("Some error");
        this.alert("Email or password are wrong");
      });
    }
    else{
      console.log("Some error");
      this.alert("Email or password are wrong");
    }
  }

  goRegister(){
    this.router.navigate(['/register']);
  }

  jury(){
    for(var i = 0; i < this.contests.length; i++){
      for(var j = 0; j < this.contests[i].jurors.length; j++)
      if(this.contests[i].jurors[j].jurorCode == this.jurorCode){
        this.loggedJuror = this.contests[i].jurors[j];
        let navigationExtras: NavigationExtras = {
          queryParams: {
              "loggedJuror": JSON.stringify(this.loggedJuror)
          }
        };
        this.router.navigate(['/jury'], navigationExtras) ;
      }
    }
  }
  organiser(){
    for(var i = 0; i < this.contests.length; i++){
      for(var j = 0; j < this.contests[i].organisers.length; j++)
      if(this.contests[i].organisers[j].organiserCode == this.organiserCode){
        this.loggedOrganiser = this.contests[i].organisers[j];
        let navigationExtras: NavigationExtras = {
          queryParams: {
              "loggedOrganiser": JSON.stringify(this.loggedOrganiser)
          }
        };
        this.router.navigate(['/organiser'], navigationExtras) ;
      }
    }
  }
  forgot(){
    this.forgotClicked = true;
  }
  reset(){
    this.fire.auth.sendPasswordResetEmail(this.forgotMail).then(data => {
      this.alert("Reset password email sent");
    })
    .catch(error => {
      this.alert(error.message);
    });
    this.forgotClicked = false;
  }
}
