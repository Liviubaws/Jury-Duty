import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
created:boolean;
contests = [];
contest;
name:string;
jurors:number;
organisers:number;
jurorCodes = [];
organiserCodes = [];
  constructor() { 
    this.created = false;
  }

  ngOnInit() {

  }
  create() {
    this.created = true; 
  }
  save(){
    for(var i = 0; i < this.jurors; i++){
      var code = this.generateJuryCode();
      this.jurorCodes.push(code);
    }
    for(var i = 0; i < this.organisers; i++){
      var code = this.generateJuryCode();
      this.organiserCodes.push(code);
    }
    this.contest = {
      name: this.name,
      jurors: this.jurors,
      organiserCodes: this.organiserCodes,
      jurorCodes: this.jurorCodes
    }
    console.log(this.contest);
    this.contests.push(this.contest);
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
