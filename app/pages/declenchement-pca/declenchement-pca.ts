import { Component } from '@angular/core';
import { NavController, AlertController, Storage, LocalStorage, ToastController, LoadingController} from 'ionic-angular';
import {DataServices} from '../../providers/data/data';
import {PcaServices} from '../../providers/pca-services/pca-services';
import {AlertLogPage} from '../alert-log/alert-log'

/*
  Generated class for the DeclenchementPcaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/declenchement-pca/declenchement-pca.html',
  providers: [DataServices, PcaServices]
})
export class DeclenchementPcaPage {
  local: LocalStorage;
  sitesParam: any;
  persons: any
  pca: any;
  mode: any;
  constructor(private navCtrl: NavController, private toast: ToastController, private dataServices: DataServices, private pcaServices: PcaServices, private alertCtrl: AlertController, private loading: LoadingController) {
    this.local = new Storage(LocalStorage);
    this.sitesParam = [];
    this.pca = { "site": "", "person": "" };
  }
  ngOnInit() {
    this.loadSites();
    this.local.get("mode").then(response => {
      this.mode = JSON.parse(response);
    }, error => {
      this.mode = { "test": false, "phone": "" };
    })
  }
  loadSites() {
    this.dataServices.getData('sites').then(response => {
      this.sitesParam = response;
    },
      error => {
        console.log(error);
      });
  }
  loadPersons() {
    console.log("Filter for ", this.pca.site)
    this.persons = this.sitesParam['personnels'].filter(item => item['site'] == this.pca['site'])
  }
  verifAuth(person) {
    this.pca.person = person;
    this.checkPhoneNumberUser(person);
  }
  inputPhoneNumber() {
    // Saisie du numéro de téléphone et stockage local
    let prompt = this.alertCtrl.create({
      title: 'Identifiez-vous',
      message: "Veuillez saisir votre numéro de téléphone mobile",
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
            this.local.remove('pca_phonenumber');
          }
        },
        {
          text: 'Valider',
          handler: data => {
            console.log('Saved clicked', data);
            this.local.set('pca_phonenumber', data[0]);
          }
        }
      ]
    });
    prompt.addInput({ type: 'tel', label: 'Téléphone', value: '' });
    prompt.present();
  }
  checkPhoneNumberUser(person) {
    this.local.get('pca_phonenumber').then(phoneNumber => {
      console.log("Local : ", phoneNumber);
      if (phoneNumber && phoneNumber !== null && phoneNumber.length > 0) {
        if (person['telephone'] === phoneNumber) {
          //console.log("Envoie du SMS");
          this.dataServices.getData('rights').then(response => {
            let loader = this.loading.create({ content: "Envoi en cours...", duration: 3000 });
            loader.present();
            var message = 'SMA-Alerte PCA : Un incident a été rencontré sur le site ' + this.pca.site + '. Votre correspondant doit prendre contact avec ' + person['nom'] + ' au ' + phoneNumber + ' dans les plus brefs délais.';
            let lstDest = response['membersauthorized'];
            lstDest = lstDest.concat(this.persons);
            //console.log("DESTINATAIRES", lstDest);
            this.pcaServices.sendSMS(lstDest, message, this.pca.site, this.mode).then(sendLog => {
              //console.log(sendLog);
              loader.dismiss();
              this.navCtrl.push(AlertLogPage, sendLog);
            }, sendError => {
              //console.log(sendError);
              loader.dismiss();
              this.navCtrl.push(AlertLogPage, sendError);
            });
          }, error => {
            let toast = this.toast.create({ "message": "L'application n'est pas correctement paramétrée. Veuillez contacter le Support", duration: 3000, cssClass: "error" });
            toast.present();
          })
        } else {
          let toast = this.toast.create({ "message": "Vous n'êtes pas autorisé à déclencher une alerte sur ce site", duration: 3000, cssClass: "error" });
          toast.present();
        }
      } else {
        this.inputPhoneNumber();
      }
    }, error => {
      console.log(error);
      let toast = this.toast.create({ message: error['lib'], duration: 3000, cssClass: "error" });
      toast.present();
    });
  }
}
