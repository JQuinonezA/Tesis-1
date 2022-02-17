import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Agreement } from '../../shared/models/agreements.model';
import { AgreementHistory } from '../../shared/models/agreementhistory.model';
import { ListAndCount } from '../../shared/models/listAndCountModel.model';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  url: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.API_URL;
  }
  saveAgreement(container: Agreement): Observable<Agreement>{
    let url = this.url + '/addAgreements';
    return this.http.post(url, container).pipe(map( res => res as any));
  }
  saveAgreementHistory(container: AgreementHistory): Observable<AgreementHistory>{
    let url = this.url + '/addAgreementsHistory';
    return this.http.post(url, container).pipe(map( res => res as AgreementHistory));
  }

  getAgreements() : Observable<Agreement[]>{
    let url = this.url + '/agreements';
    return this.http.get(url).pipe(map(res => res as Agreement[] ));
  }
  getAgreementsHIstory(from: number, to: number) : Observable<ListAndCount>{
    let url = this.url + `/agreementsHistory/${from}/${to}`;
    return this.http.get(url).pipe(map(res => res as ListAndCount));
  }
  
}
