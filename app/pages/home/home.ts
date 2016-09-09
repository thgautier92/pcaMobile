import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import{DeclenchementPcaPage} from '../declenchement-pca/declenchement-pca';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController) {
  
  }
  declencherPCA(){
  this.navCtrl.push(DeclenchementPcaPage);
  }
}
