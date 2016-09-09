import { Component } from '@angular/core';
import { NavController, Storage, LocalStorage, ToastController } from 'ionic-angular';

/*
  Generated class for the ParamsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/params/params.html',
})
export class ParamsPage {
  local: LocalStorage;
  mode: any = {};
  constructor(private navCtrl: NavController, private toast: ToastController) {
    this.local = new Storage(LocalStorage);
    this.mode = { "test": false, "phone": "" };
  }
  ngOnInit() {
    this.local.get("mode").then(response => {
      if (response) {
        this.mode = JSON.parse(response);
      } else {
        this.mode = { "test": false, "phone": "" };
      }
    }, error => {
      console.log(error);
      this.mode = { "test": false, "phone": "" };
    })
  }
  activate(event) {
    if (this.mode['test']) {
      if (this.mode['phone'] !== "") {
        this.storeMode();
        let toast = this.toast.create({ "message": "Mode test activé", duration: 3000 });
        toast.present();
      } else {
        event['_checked'] = false;
        let toast = this.toast.create({ "message": "Veuillez saisie un numéro de telephone", duration: 3000 });
        toast.present();
      }
    } else {
      this.storeMode();
      let toast = this.toast.create({ "message": "Mode test inactif", duration: 3000 });
      toast.present();
    }
  }
  storeMode() {
    this.local.set("mode", JSON.stringify(this.mode)).then(response => {
    }, error => {
      console.log(error);
    })
  }
  reset() {
    this.local.remove('pca_phonenumber').then(response => {
      this.local.remove('mode').then(response => {
        let toast = this.toast.create({ "message": "Propriétaire éffacé", duration: 3000 });
        toast.present();
      }, error => { });
    }, error => {
      console.log(error)
      let toast = this.toast.create({ "message": error, duration: 3000, cssClass: "error" });
      toast.present();
    });
  }
}
