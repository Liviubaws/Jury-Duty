import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string;
  password:string;
  users = [];
  constructor(private router:Router, private fire: AngularFireAuth, public fdb:AngularFireDatabase, public alertCtrl:AlertController) { 
    this.fdb.list("/users/").valueChanges().subscribe(__users => {
      this.users = __users;
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
  jury(){

  }
  organiser(){
    
  }
}
