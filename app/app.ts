import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {HomePage} from './pages/home/home';
import {SupportPage} from './pages/support/support';
import {ParamsPage} from './pages/params/params';
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
  version: any;
  pages: Array<{ title: string, component: any, icon: string, color: string }>;
  constructor(private platform: Platform, private menu: MenuController, private pcaServices: PcaServices) {
    this.rootPage = TabsPage;
    this.pages = [
      { title: 'Accueil', component: HomePage, icon: 'home', color: "primary" },
      { title: 'Contactez le support', component: SupportPage, icon: 'help-buoy', color: "danger" },
      { title: 'Paramètres', component: ParamsPage, icon: 'cog', color: "primary" }
    ];
    platform.ready().then(() => {
      //StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString('#ffffff');
      this.pcaServices.getVersionApp().then(response => {
        console.log("VERSION", response);
        this.version = response;
      }, error => {
        console.log(error);
        this.version = "";
      });
    });
  }
  ngOnInit() {

  }
  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page['component']);
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
