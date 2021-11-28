import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CatalgogueItem } from '../models/catalogue';

@Injectable({
  providedIn: 'root'
})
export class CataloguesService {
  url: string
  constructor(
    private _http: HttpClient
  ) {
    this.url = environment.API_URL;
  }

  getCataloguebyCodeCat(codecat: string = ''): Observable<CatalgogueItem> {
    let urlsend = this.url + `/getCatalogueBycat/${codecat}`;
    return this._http.get<CatalgogueItem>(urlsend).pipe(map(rest => rest as CatalgogueItem));
  }

  constructModel(list: any) {
    const comboItems: SelectItem[] = [];
    comboItems.push({ label: 'Seleccione', value: null });
    return comboItems.concat(list.map(value => ({
      label: value.decription,
      value: value.nameItem.toString()
    })));
  }
}
export class ChannelbySeqT<T = any> {
  label?: string;
  value: T;
}

