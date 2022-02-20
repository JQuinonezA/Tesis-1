import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendamientoCitasComponent } from './components/agendamiento-citas/agendamiento-citas.component';
import { AtencionClienteComponent } from './components/atencion-cliente/atencion-cliente.component';
import { CalendarAllComponent } from './components/calendar-all/calendar-all.component';
import { CatalogoProductsComponent } from './components/catalogo-products/catalogo-products.component';
import { CatalogoServicesComponent } from './components/catalogo-services/catalogo-services.component';
import { GestionContratosComponent } from './components/gestion-contratos/gestion-contratos.component';
import { GestionEmpleadosComponent } from './components/gestion-empleados/gestion-empleados.component';
import { GestionInventarioProductsComponent } from './components/gestion-inventario-products/gestion-inventario-products.component';
import { GestionProvedoresComponent } from './components/gestion-provedores/gestion-provedores.component';
import { GestionServiciosComponent } from './components/gestion-servicios/gestion-servicios.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RequestsAllComponent } from './components/requests-all/requests-all.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
const routes: Routes = [
  {
    path: '', component: PrincipalComponent, children:[
      {path: 'booking', component: AgendamientoCitasComponent},
      {path: 'customerattention', component: AtencionClienteComponent},
      {path: 'servicesmanagement', component: GestionServiciosComponent},
      {path: 'catProducts', component: CatalogoProductsComponent},
      {path: 'catServices', component: CatalogoServicesComponent},
      {path: 'employees', component: GestionEmpleadosComponent},
      {path: 'contracts', component: GestionContratosComponent},
      {path: 'providers', component: GestionProvedoresComponent},
      {path: 'inventory/products', component: GestionInventarioProductsComponent},
      {path: 'schedule', component: CalendarAllComponent},
      {path: 'solmanagement', component: RequestsAllComponent},
      {path: 'users', component: UsersManagementComponent},
      { path: '**', redirectTo: 'booking' },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SislimpRoutingModule { }
