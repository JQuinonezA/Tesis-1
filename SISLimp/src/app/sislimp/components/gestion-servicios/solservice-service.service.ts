import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { SolService } from 'src/app/page/components/sharedpage/models/solservice.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolserviceServiceService {

  url: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.API_URL;
  }
  getAllSolServices(): Observable<SolService[]>{
    let url = this.url + `/solServices`;
    return this.http.get(url).pipe(map(res => res as SolService[] ));
  }
  getSolServices(codeUser: number): Observable<SolService[]>{
    let url = this.url + `/solServices/${codeUser}`;
    return this.http.get(url).pipe(map(res => res as SolService[] ));
  }
  updateSolicitud(item: SolService){
    let url = this.url + '/updateSolService';
    return this.http.post(url, item).pipe(map( res => res as SolService));
  }
  deleteSolService(id: number): Observable<any>{
    let url = this.url + `/deleteSolService/${id}`;
    return this.http.delete(url).pipe(map( res => res as any));
  }
}
