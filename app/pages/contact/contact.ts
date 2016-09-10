import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DataServices} from '../../providers/data/data';

@Component({
  templateUrl: 'build/pages/contact/contact.html',
  providers: [DataServices]
})
export class ContactPage {
  lstDest: any = [];
  constructor(private navCtrl: NavController, private dataServices: DataServices) {

  }
  ngOnInit() {
    this.dataServices.getData('rights').then(response => {
      this.lstDest = response['membersauthorized'];
    }, error => { })
  }
  callIT(passedNumber) {
    let url='tel:'+passedNumber;
    window.location.assign(url);
  }
}
