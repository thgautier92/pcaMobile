import { Component } from '@angular/core';
import {Page, Platform} from 'ionic-angular';
import {Device, Network} from 'ionic-native';
//import { Sim } from 'ionic-native';
import {ValuesPipe} from '../../pipes/common';

declare var navigator: any;
/*
  Generated class for the Network component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'network',
  templateUrl: 'build/components/network/network.html',
  pipes: [ValuesPipe]
})
export class NetworkInfo {
  platform: any;
  onDevice: Boolean;
  deviceInfo: any;
  simInfo: any;
  netInfo: any;
  states: any;

  constructor(platform: Platform) {
    this.platform = platform;
    this.netInfo = {};
    this.deviceInfo = {};
    this.simInfo = null;
    this.states = [];
    this.platform.ready().then((readySource) => {
      this.onDevice = this.platform.is('ios') || this.platform.is('android') || this.platform.is('windows');
      this.deviceInfo = Device.device;
      this.checkNetwork();
    });
    // watch network for a disconnect
    let disconnectSubscription = Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-( ')
      this.checkNetwork();
    });
    let connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.checkNetwork();
    });
  }
  checkNetwork() {
    let me = this;
    this.platform.ready().then((readySource) => {
      if (this.onDevice) {
        this.netInfo.type = Network.connection;
        this.netInfo.isOffline = false;
        this.netInfo.isOnline = true;
        // Get Sim Info plugin
        try {
          (<any>window).plugins.sim.getSimInfo(function (result) {
            //console.log("SIM info : ",JSON.stringify(result));
            me.simInfo = result;
          }, function (error) {
            console.log("ERROR SIM", JSON.stringify(error));
            me.simInfo = null;
          });
        } catch (e) {
          console.log("Plugin SIM non disponible",e);
        }
        
      } else {
        this.netInfo.type = "Inconnu";
        this.netInfo.isOffline = !navigator.onLine;
        this.netInfo.isOnline = navigator.onLine;
      }
    });
  };
}
