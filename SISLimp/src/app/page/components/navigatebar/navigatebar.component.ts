import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigatebar',
  templateUrl: './navigatebar.component.html',
  styleUrls: ['./navigatebar.component.css']
})
export class NavigatebarComponent implements OnInit {

  showLogin: boolean = true;
  showModule: boolean = false;
  constructor(
    @Inject(DOCUMENT) document
  ) { }
  ngOnInit(): void {
    this.isUser();
  }
  isUser() {
    let role = localStorage.getItem('role');
    if (role == 'USER') {
      this.showLogin = false;
    }
  }

  styleAdd() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('navbar-mobile');
  }
}
