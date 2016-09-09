import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SMS } from 'ionic-native';
import 'rxjs/add/operator/map';
import {DataServices} from '../data/data';

/*
  Generated class for the PcaServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PcaServices {
  listeMembersAuthorized: any;
  constructor(private http: Http, private dataServices: DataServices) { }

  checkUserAuthorizedByPhoneNumber(pn) {
    return new Promise((resolve, reject) => {
      this.dataServices.getData('rights').then(response => {
        console.log(response);
        this.listeMembersAuthorized = response['membersauthorized'];
        let p = this.listeMembersAuthorized.filter(item => item['telephone'] === pn);
        if (p.length > 0) {
          let ret = { "phoneNumber": p[0].telephone, "emetteur": p[0].nom };
          resolve(ret);
        } else {
          reject({ "error": "auth", "lib": "Vous n'êtes pas autorisé à déclencher un PCA." });
        }
      }, error => {
        this.listeMembersAuthorized = null;
        reject({ "error": "errParam", "lib": "L'application ne dispose pas du paramétrage requis." });
      });
    });
  }
  sendSMS(listePersonnes, message, site) {
    return new Promise((resolve, reject) => {
      var sendLog = {};
      // Envoi des SMS
      let lstTel = []
      for (var key in listePersonnes) {
        let value = listePersonnes[key];
        lstTel.push(value['telephone']);
      }
      let telOut = lstTel.join();
      try {
        SMS.send(telOut, message).then(response => {
          sendLog={ "site": site, "person": listePersonnes, "sendOK": true, "msg": "" };
          resolve(sendLog);
        }, error => {
          console.log(error);
          sendLog={ "site": site, "person": listePersonnes, "sendOK": false, "msg": error };
          reject(sendLog);
        });
      } catch (err) {
        console.log(err);
        sendLog={ "site": site, "person": listePersonnes, "sendOK": false, "msg": err };
        reject(sendLog);
      }
    });
  }
  getRandomColor() {
    var color = '#'; // hexadecimal starting symbol
    var letters = ['9CF4D7', '9CD7F4', '00FF00', '5B74F0', 'FFFF00', 'DF5F86', 'CCD0F3', '5B6AF4']; //Set your colors here
    color += letters[Math.floor(Math.random() * letters.length)];

    return color;
  }
}
