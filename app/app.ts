import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, ionicBootstrap, Storage, LocalStorage, ToastController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {HomePage} from './pages/home/home';
import {SupportPage} from './pages/support/support';
import {NetworkInfo} from './components/network/network';
import {PcaServices} from './providers/pca-services/pca-services';
import {DataServices} from './providers/data/data';

@Component({
  templateUrl: 'build/app.html',
  directives: [NetworkInfo],
  providers: [PcaServices, DataServices],
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private rootPage: any;
  local: any;
  pages: Array<{ title: string, component: any, icon: string, color: string }>;
  constructor(private platform: Platform, private menu: MenuController, private toast: ToastController, private pcaServices: PcaServices) {
    this.rootPage = TabsPage;
    this.pages = [
      { title: 'Accueil', component: HomePage, icon: 'home', color: "primary" },
      { title: 'Contactez le support', component: SupportPage, icon: 'help-buoy', color: "danger" }
    ];
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
  openPage(page) {
    console.log(page);
    this.menu.close();
    this.nav.setRoot(page['component']);
  }
  reset() {
    this.menu.close();
    this.local = new Storage(LocalStorage);
    this.local.remove('pca_phonenumber').then(response => {
      let toast = this.toast.create({ "message": "Propriétaire éffacé", duration: 3000 });
      toast.present();
    }, error => {
      console.log(error)
      let toast = this.toast.create({ "message": error, duration: 3000, cssClass: "error" });
      toast.present();
    });
  }
  getColor() {
    return this.pcaServices.getRandomColor();
  };
}

ionicBootstrap(MyApp, [], {
  backButtonText: 'retour',
  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',
  tabsPlacement: 'bottom',
});
