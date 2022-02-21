import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { SislimpRoutingModule } from './sislimp-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { MegaMenuModule } from 'primeng/megamenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { PrincipalComponent } from './components/principal/principal.component';
import { AgendamientoCitasComponent } from './components/agendamiento-citas/agendamiento-citas.component';
import { AtencionClienteComponent } from './components/atencion-cliente/atencion-cliente.component';
import { FooterSysComponent } from './shared/footer-sys/footer-sys.component';
import {TabViewModule} from 'primeng/tabview';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DialogModule} from 'primeng/dialog';
import { GestionServiciosComponent } from './components/gestion-servicios/gestion-servicios.component';
import { DetailserviceComponent } from './components/gestion-servicios/detailservice/detailservice.component';
import { CatalogoServicesComponent } from './components/catalogo-services/catalogo-services.component';
import { CatalogoProductsComponent } from './components/catalogo-products/catalogo-products.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import { GestionEmpleadosComponent } from './components/gestion-empleados/gestion-empleados.component';
import { GestionContratosComponent } from './components/gestion-contratos/gestion-contratos.component';
import { GestionProvedoresComponent } from './components/gestion-provedores/gestion-provedores.component';
import { GestionInventarioProductsComponent } from './components/gestion-inventario-products/gestion-inventario-products.component';
import { CalendarAllComponent } from './components/calendar-all/calendar-all.component';
import { FullCalendarModule} from '@fullcalendar/angular';
import { ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LegalpersonComponent } from './components/legalperson/legalperson.component';
import { ProviderPipe } from './shared/pipes/provider.pipe';
import { RequestsAllComponent } from './components/requests-all/requests-all.component';
import { SolistatusPipe } from './shared/pipes/solistatus.pipe';
import { HoursPipePipe } from './shared/pipes/hours-pipe.pipe';
import { CityPipePipe } from './shared/pipes/city-pipe.pipe';
import { ForCityPipe } from './shared/pipes/for-city.pipe';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/es';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { PersonaLegalPipe } from './shared/pipes/persona-legal.pipe';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { LoginUserPipe } from './shared/pipes/login-user.pipe';
registerLocaleData(en);


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
  
]);


@NgModule({
  declarations: [
    PrincipalComponent,
    AgendamientoCitasComponent,
    AtencionClienteComponent,
    FooterSysComponent,
    GestionServiciosComponent,
    DetailserviceComponent,
    CatalogoServicesComponent,
    CatalogoProductsComponent,
    GestionEmpleadosComponent,
    GestionContratosComponent,
    GestionProvedoresComponent,
    GestionInventarioProductsComponent,
    CalendarAllComponent,
    LegalpersonComponent,
    ProviderPipe,
    RequestsAllComponent,
    SolistatusPipe,
    HoursPipePipe,
    CityPipePipe,
    ForCityPipe,
    PersonaLegalPipe,
    UsersManagementComponent,
    LoginUserPipe,
  ],
  imports: [
    CommonModule,
    SislimpRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    // primng

    SidebarModule,
    ButtonModule,
    MenubarModule,
    PanelMenuModule,
    TableModule,
    MegaMenuModule,
    TieredMenuModule,
    SplitterModule,
    InputTextModule,
    CardModule,
    InputNumberModule,
    InputMaskModule,
    InputTextareaModule,
    CalendarModule,
    ChipsModule,
    AutoCompleteModule,
    MultiSelectModule,
    ToolbarModule,
    MenuModule,
    TagModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    DynamicDialogModule,
    DialogModule,
    FileUploadModule,
    HttpClientModule,
    NzCalendarModule,
    NzDatePickerModule,
  ],
  providers:[ 
    { provide: NZ_I18N, useValue: en_US }
  ],
  exports: [
    SolistatusPipe
  ]
})
export class SislimpModule { }
