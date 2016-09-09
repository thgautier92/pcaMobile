import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SitesPcaService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataServices {

  constructor(private http: Http) { }
  getData(file) {
    return new Promise((resolve, reject) => {
      this.http.get('data/' + file + '.json')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
          reject("No file " + file);
        });
    });

  };
}

