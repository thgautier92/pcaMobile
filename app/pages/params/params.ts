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
  }
  loadMode() {
    this.local.get("mode").then(response => {
      console.log(response);
      this.mode = JSON.parse(response);
    }, error => {
      this.mode = { "test": false, "phone": "" };
    })
  }
  activate() {
    console.log(this.mode);
    this.local.set("mode", JSON.stringify(this.mode)).then(response => {
      let toast = this.toast.create({ "message": "Mode test activé", duration: 3000 });
      toast.present();
    }, error => {
      console.log(error)
      let toast = this.toast.create({ "message": error, duration: 3000, cssClass: "error" });
      toast.present();
    })
  }
  reset() {
    this.local.remove('pca_phonenumber').then(response => {
      let toast = this.toast.create({ "message": "Propriétaire éffacé", duration: 3000 });
      toast.present();
    }, error => {
      console.log(error)
      let toast = this.toast.create({ "message": error, duration: 3000, cssClass: "error" });
      toast.present();
    });
  }
}
