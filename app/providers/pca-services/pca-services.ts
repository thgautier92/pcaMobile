import { Injectable } from '@angular/core';
import {ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { SMS } from 'ionic-native';
import 'rxjs/add/operator/map';
import {DataServices} from '../data/data';

/*
  Generated class for the PcaServices provider.
*/
@Injectable()
export class PcaServices {
  listeMembersAuthorized: any;
  mode: any;
  constructor(private http: Http, private dataServices: DataServices, private toast: ToastController) {
  }

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
  sendSMS(listePersonnes, message, site,mode ) {
    return new Promise((resolve, reject) => {
      var sendLog = {};
      // Envoi des SMS
      let lstTel = []
      for (var key in listePersonnes) {
        let value = listePersonnes[key];
        if (mode['test']) {
          lstTel.push(mode['phone']);
          listePersonnes[key]['telephone']=mode['phone'];
        } else {
          lstTel.push(value['telephone']);
        }
      }
      let telOut = lstTel.join();
      try {
        SMS.send(telOut, message).then(response => {
          console.log(response);
          sendLog = { "site": site, "persons": listePersonnes, "sendOK": true, "msg": "SMS envoyés" };
          resolve(sendLog);
        }, error => {
          console.log("Error return",error);
          sendLog = { "site": site, "persons": listePersonnes, "sendOK": true, "msg": "SMS envoyés" };
          reject(sendLog);
        });
      } catch (err) {
        console.log(err);
        sendLog = { "site": site, "persons": listePersonnes, "sendOK": false, "msg": "Envoie de SMS non disponible" };
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
