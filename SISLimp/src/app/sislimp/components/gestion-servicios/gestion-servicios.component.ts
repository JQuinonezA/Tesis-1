import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, SelectItem, MessageService } from 'primeng/api';
import { ServiceShowService } from '../../../page/components/services-cli/service-show.service';
import { SolserviceServiceService } from './solservice-service.service';
import { SolService } from '../../../page/components/sharedpage/models/solservice.model';
import { ServicesQuantity } from '../../../page/components/services-cli/services-cli.component';
import { CataloguesService } from '../../../sharedAll/serviceShared/catalogues.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FuntionsSharedService } from '../../../sharedAll/serviceShared/funtions-shared.service';
import { Simplemeet } from '../../shared/models/simplemeet.model';
import { AuthService } from '../../../sharedAll/serviceShared/auth.service';
import { SimpleMeetService } from '../agendamiento-citas/simple-meet.service';
import { CatServices } from '../../shared/models/catservices.model';
import { ServiceAdd } from '../agendamiento-citas/agendamiento-citas.component';
import { UsersGeneralService } from '../../../page/components/login/users-general.service';
import { UserGeneralModel } from '../../../sharedAll/models/usergeneral.model';
const SERVICETYPE = 'SERVICETYPE';
const CITYCAT = 'CITYCAT';
const PROVINCECAT = 'PROVINCECAT';
@Component({
  selector: 'app-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.css'],
  providers: [MessageService]

})
export class GestionServiciosComponent implements OnInit {

  cols: any[];
  showDetail: boolean = false;
  dataFromdb: SolService[] = [];
  sizeRecords: number = 50;
  pageSize: number = 50;

  dropType: SelectItem[] = [];
  //formulario 
  formCita: FormGroup = new FormGroup({});
  dropCity: SelectItem[] = [];
  dropProvince: SelectItem[] = [];
  dropTools: SelectItem[] = [
    { value: '', label: 'Seleccione' },
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' }
  ];
  simpleMeet: Simplemeet = new Simplemeet();
  idSolService: number = 0;



  constructor(
    private serviceShowService: ServiceShowService,
    private solServiceServices: SolserviceServiceService,
    private catalogueService: CataloguesService,
    private formBuilder: FormBuilder,
    public sharedFuntions: FuntionsSharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private simpleMeetService: SimpleMeetService,
    private usersGeneralService: UsersGeneralService

  ) { }

  ngOnInit(
  ): void {
    this.createCols();
    this.getCatalogues();
    this.createForm();
    this.addService();


  }

  createCols() {
    this.cols = [
      { field: '', header: 'Servicios' },
      { field: 'codeCita', header: 'Código solicitud' },
      { field: 'date', header: 'Fecha' },
      { field: 'status', header: 'Estado' },
      { field: 'client', header: 'Cliente' },
      { field: 'phone', header: 'Teléfono' },
      { field: 'phone', header: 'Correo electrónico' },
    ];
  }
  createForm() {
    this.formCita = this.formBuilder.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      services: this.formBuilder.array([]),
      hoursNumber: ['', Validators.required],
      dateService: ['', Validators.required],
      dateEnd: ['', Validators.required],
      tools: ['', Validators.required],
    }, { validator: this.sharedFuntions.emailValidator("email") });
  }
  get services() {
    return this.formCita.controls["services"] as FormArray;
  }
  addService() {
    const formServices = this.formBuilder.group({
      typeService: ['', Validators.required],
      serviceName: ['', Validators.required]
    });
    this.services.push(formServices);
  }

  deleteService(serviceIndex: number) {
    this.services.removeAt(serviceIndex);
  }
  onChangueProvince(event: any) {
    this.catalogueService.getCataloguebyCodeCatAndCodeFather(CITYCAT, PROVINCECAT, event.value).then(rest => {
      this.dropCity = this.catalogueService.constructModel(rest);
    });
  }

  validateForm() {
    this.formCita.markAllAsTouched();
    if (!this.formCita.valid) {
      this.messageService.add({ severity: 'error', detail: 'Formulario no valido' });
      console.log(this.formCita.value);
    } else {
      if (this.services.length > 0) {
        this.simpleMeet.status = 'hold';
        this.simpleMeet.dateService = this.formCita.controls.dateService.value;
        this.simpleMeet.address = this.formCita.controls.address.value;
        this.simpleMeet.cliName = this.formCita.controls.name.value;
        this.simpleMeet.cliLastName = this.formCita.controls.lastname.value;
        this.simpleMeet.cliDni = this.formCita.controls.dni.value;
        this.simpleMeet.cliEmail = this.formCita.controls.email.value;
        this.simpleMeet.cliCity = this.formCita.controls.city.value;
        this.simpleMeet.cliProvince = this.formCita.controls.province.value;
        this.simpleMeet.typeService = this.formCita.controls.services.value[0]?.typeService;
        this.simpleMeet.services = this.formCita.controls.services.value[0]?.serviceName;
        this.simpleMeet.hoursStimated = this.formCita.controls.hoursNumber.value;
        this.simpleMeet.codeUser = this.authService.codeUser;
        this.simpleMeet.phone = this.formCita.controls.phone.value;
        //falta tools, valor estiamdo y fecha fin
        this.simpleMeet.tools = this.formCita.controls.tools.value;
        this.simpleMeet.dateEnd = this.formCita.controls.dateEnd.value;
        this.simpleMeet.stimatedValue = 5.00;
        this.simpleMeet.addededServices = JSON.stringify(this.formCita.controls.services.value);
        this.saveFormsimpleMeet(this.simpleMeet);
      } else {
        this.messageService.add({ severity: 'error', detail: 'Se requiere al menos un servicio' });
      }

    }
  }
  saveFormsimpleMeet(container: Simplemeet) {
    this.simpleMeetService.saveSimpleMeet(container).subscribe(res => {
      if (res != null) {
        this.messageService.add({ severity: 'success', detail: 'Registrado correctamente' });
        this.removeSolService(this.idSolService);
        this.outFrom()
        this.chargeData(null);
      } else {
        this.messageService.add({ severity: 'error', detail: 'Ocurrio un error' });

      }
    })
  }
  removeSolService(seqSolService: number){
    if(seqSolService != 0){
      this.solServiceServices.deleteSolService(seqSolService).subscribe(rest => {
        if(rest){
          this.messageService.add({ severity: 'success', detail: 'Eliminado correctamente' });
          this.outFrom();
          this.chargeData(null);
        } else {
          this.messageService.add({ severity: 'error', detail: 'Error al eliminar' });
        }
      })
    }

  }

  chargeData(event: LazyLoadEvent) {
    this.solServiceServices.getAllSolServices().subscribe(rest => {
      if (rest.length > 0) {
        console.warn(rest)
        rest.forEach(async item => {
          let serviceQuantity: ServicesQuantity[] = [];
          serviceQuantity = [...serviceQuantity, ...JSON.parse(item.services)];
          item.elementAsArray = await this.getServicessRelated(serviceQuantity);
        })
        this.dataFromdb = rest;
      }
    });
  }
  async getCatalogues() {
    await this.catalogueService.getCataloguebyCodeCat(SERVICETYPE).then(rest => {
      this.dropType = this.catalogueService.constructModel(rest);
    });
    await this.catalogueService.getCataloguebyCodeCat(PROVINCECAT).then(rest => {
      this.dropProvince = this.catalogueService.constructModel(rest);
    });
  }
  async onRowSelect(solService: SolService) {
    console.log(solService)
    this.idSolService = solService.seqsolservice;
    const userData: UserGeneralModel = await this.usersGeneralService.getUserExtraData(solService.codeuser).then(rest => rest);
    this.formCita.patchValue({
      services: this.populateServices(solService.elementAsArray),
      name: userData.name,
      lastname: userData.lastname,
      phone: userData.phonenumber,
      email: userData.email,
      province: userData.province,
      city: userData.city
    })
    this.showDetail = true;
    console.log("simplemeet", this.simpleMeet);
  }
  populateServices(service: CatServices[]) {
    this.deleteService(0);
    service.forEach(() => this.addService());
    const new_services = this.convertFromCatService(service);
    if (this.services.length == this.services.length) this.services.patchValue(new_services);
  }
  convertFromCatService(services: CatServices[]): ServiceAddServices[] {
    const values: ServiceAddServices[] = [];
    services.forEach(servicecat => {
      const value: ServiceAddServices = new ServiceAddServices();
      value.typeService = servicecat.type;
      value.serviceName = servicecat.nameservice;
      values.push(value);
    })
    return values

  }
  onRowSelectEliminated(solService: SolService) {
    console.warn(solService)
    this.removeSolService(solService.seqsolservice);
  }
  outFrom() {
    this.simpleMeet = new Simplemeet();
    this.formCita.reset();
    while (this.services.controls.length > 1) {
      this.deleteService(0);
    }
    this.showDetail = false;
    this.idSolService = 0;
  }
  async getServicessRelated(services: ServicesQuantity[]) {
    let prods = [];
    let seen = new Set();
    const filtered = services.filter(item => {
      const duplicate = seen.has(item.codeService);
      seen.add(item.codeService);
      return !duplicate;
    });
    for (let item of filtered) {
      await this.serviceShowService.getCatServiceUnique(item.codeService).then(rest => {
        prods.push(rest);
      });
    }
    return prods;
  }

}

export class ServiceAddServices {
  serviceName: string;
  typeService: string;
  constructor() {
    this.serviceName = '';
    this.typeService = ''
  }
}