import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  items: MenuItem[];
  items2: MenuItem[];

  ngOnInit() {
    this.items2 = [
      {
        label: 'Menu',
        style: 'font-size: 0.9rem !important',
        items: [
          {
            label: 'Angendamiento de citas',
            icon: 'pi pi-th-large',
            routerLink: ['/system/booking']

          },
          {
            label: 'Atencion al cliente',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/system/customerattention']
          },
          {
            label: 'Gestión de servicios',
            icon: 'pi pi-users',
            routerLink: ['/system/servicesmanagement']
          }
        ]
      },
      {
        label: 'Catalogo',
        style: 'font-size: 0.9rem !important',
        items: [
          {
            label: 'Catalogo de servicios',
            icon: 'pi pi-book',
            routerLink: ['/system/catServices']
          },
          {
            label: 'Catalogo de productos',
            icon: 'pi pi-book',
            routerLink: ['/system/catProducts']
          }
        ]
      }
    ];
  }
}
