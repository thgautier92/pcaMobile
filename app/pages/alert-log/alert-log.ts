import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the AlertLogPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/alert-log/alert-log.html',
})
export class AlertLogPage {
  sendLog: any = {};
  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.sendLog = this.navParams['data'];
  }
  close() {
    this.navCtrl.pop();
  }
}

