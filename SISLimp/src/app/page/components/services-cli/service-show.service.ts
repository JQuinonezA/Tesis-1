import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CatServices } from 'src/app/sislimp/shared/models/catservices.model';
import { SolService } from '../sharedpage/models/solservice.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceShowService {

  url: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.API_URL;
  }
  getCatServices(): Observable<CatServices[]>{
    let url = this.url + '/catservices';
    return this.http.get(url).pipe(map(res => res as CatServices[] ));
  }
  getCatServiceUnique(codeService: string): Promise<CatServices>{
    let url = this.url + `/getUniqueService/${codeService}`;
    return this.http.get(url).pipe(map(res => res as CatServices )).toPromise();
  }

  saveSolService(solProducts: SolService): Observable<any>{
    let url = this.url + `/addSolServices`;
    return this.http.post(url, solProducts).pipe(map(res => res as any ));
  }
}
