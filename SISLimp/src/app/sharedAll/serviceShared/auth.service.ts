import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../models/user.interfa';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ErrorLogin, UserGeneralModel } from '../models/usergeneral.model';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public codeUser: number;
  public username: string;
  public userLogged = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    this.checktoken();
  }
  getIslogged(): Observable<boolean> {
    return this.userLogged.asObservable();
  }

   login(authData: User): Observable<UserGeneralModel> {
    return this.http.post<any>(`${environment.API_URL}/auth/login`, authData).pipe(map(res => {
      if (res.hasOwnProperty('codeuser')) {
        this.saveToken(res.token, res.loginusercol, res.codeuser, res.username);
        this.userLogged.next(true);
        return res;
      }
    }),
      catchError(error => this.handleError(error))
    );
  }
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('code');
    localStorage.removeItem('username');
    this.userLogged.next(false);
  }
  private checktoken(): void {
    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);
    this.codeUser = Number(localStorage.getItem('code'));
    this.username = localStorage.getItem('username');
    console.log('isExpired', isExpired);
    if (isExpired) {
      this.logOut();
    } else {
      this.userLogged.next(true);
    }
    // setear userlogged = isExpired
  }
  private saveToken(token: string, role: string, code: number, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    localStorage.setItem('code', code + "");
    this.codeUser = Number(localStorage.getItem('code'));
    this.username = localStorage.getItem('username');
  }
  private handleError(error): Observable<never> {

    let errorMessage = 'An error occurred retriving data';
    if (error) {
      errorMessage = `Error: code ${error.message}`
    }
    console.log(errorMessage);
    return throwError(errorMessage);

  }
}
