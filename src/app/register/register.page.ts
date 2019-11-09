import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email:string;
  password:string;
  repassword:string;
  admins = [];
  data:string;
  constructor(private fire: AngularFireAuth, public fdb: AngularFireDatabase, public alertCtrl:AlertController,
    public navCtrl:NavController) { 
    this.fdb.list("/admins/").valueChanges().subscribe(__admins => {
      this.admins = __admins;
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

  register(){
    var errors = 0;
    if(this.email.length < 7){
      errors++;
      this.alert("Email too short");
    }
    if(this.password.length < 7){
      errors++;
      this.alert("Password too short");
    }
    if(this.password.length == 0 || this.repassword.length == 0 || this.email.length == 0){
      errors++;
      this.alert("Please fill all fields");
    }
    if(this.password != this.repassword){
      errors++;
      this.alert("Passwords are different");
    }
    for(var i = 0; i < this.admins.length; i++){
      if(this.email == this.admins[i]){
        errors++;
        this.alert("That email address is already in use");
        break;
      }
    }
    if(errors == 0){
      this.fire.auth.createUserWithEmailAndPassword(this.email, this.password).then((data) => {
        console.log("User "+this.email+" registered with password "+this.password);
        this.alert("You have registered successfully!");
        this.fire.auth.currentUser.sendEmailVerification();
        this.data = "";
        this.data = this.data.concat(this.email);
        this.fdb.list("/users/").push(this.data);
        this.navCtrl.navigateForward('login');
      })
      .catch(error => {
        console.log("Some error");
        this.alert(error.message);
      });
    }
  }
}
