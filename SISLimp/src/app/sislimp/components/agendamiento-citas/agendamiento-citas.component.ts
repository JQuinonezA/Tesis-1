import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { CataloguesService } from 'src/app/sharedAll/serviceShared/catalogues.service';
import { FuntionsSharedService } from 'src/app/sharedAll/serviceShared/funtions-shared.service';
import { Employee } from '../../shared/models/employee.model';
import { Simplemeet } from '../../shared/models/simplemeet.model';
import { AgreementService } from '../gestion-contratos/agreement.service';
import { EmployeeService } from '../gestion-empleados/employee.service';
import { SimpleMeetService } from './simple-meet.service';
import { SimplemeetHistory } from '../../shared/models/siemplemeetHistory.model';
const CITYCAT = 'CITYCAT';
const PROVINCECAT = 'PROVINCECAT';
const SERVICETYPE = 'SERVICETYPE';
const REQUESTSTATUSCAT = 'REQUESTSTATUSCAT';
@Component({
  selector: 'app-agendamiento-citas',
  templateUrl: './agendamiento-citas.component.html',
  styleUrls: ['./agendamiento-citas.component.css'],
  providers: [MessageService]
})
export class AgendamientoCitasComponent implements OnInit {
  activeIndex1: number = 0;
  cars: any[] = [];
  drop: SelectItem[] = [];
  fordropt: any
  dropCity: SelectItem[] = [];
  dropProvince: SelectItem[] = [];
  dropType: SelectItem[] = [];
  dropCityTwo: SelectItem[] = [];
  dropCityTwoProcesed: SelectItem[] = [];
  dropTools: SelectItem[] = [
    { value: '', label: 'Seleccione' },
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' }
  ];
  //table
  cols: any[];
  dataFromdb: Simplemeet[] = [];
  dataFromdbProcesed: SimplemeetHistory[] = [];
  sizeRecords: number = 10;
  pageSize: number = 10;
  pageSizeProcessed: number = 10;
  sizeRecordsPro: number = 10;
  fromPro: number = 0;
  toPro: number = 10;
  //employees
  colsEmployees: any[] = [];
  showEmployes: boolean = false;
  showEmployesAssignated: boolean = false;
  showEmployesAssigned: boolean = false;
  showEmployesAssignedProccessed: boolean = false;
  sizeRecordsToAsig: number = 10;
  sizeRecordsAsigned: number = 10;
  employesToAssig: Employee[] = [];
  employesAssigned: Employee[] = [];
  employeesAsignated: number = 0;

  selectdEmployes: Employee[] = [];
  selectedFather: Simplemeet = new Simplemeet();

  //fomrs
  formCita: FormGroup = new FormGroup({});
  formServices: FormGroup = new FormGroup({});
  simpleMeet: Simplemeet = new Simplemeet();

  //sevice extras
  extraServices: ServiceAdd[] = [];

  fromEdit: boolean = false;
  meetToUpdate: Simplemeet = new Simplemeet();
  historyMeet: SimplemeetHistory = new SimplemeetHistory();
  constructor(
    private simpleMeetService: SimpleMeetService,
    private formBuilder: FormBuilder,
    private catalogueService: CataloguesService,
    private messageService: MessageService,
    private agreeService: AgreementService,
    private employeeService: EmployeeService,
    private sharedFuntions: FuntionsSharedService,
    private authService: AuthService,
  ) { }
  ngOnInit(): void {
    this.createCols();
    this.createForm();
    this.addService();
    this.getCatalogues();
  }

  createCols() {
    this.cols = [
      { field: 'date', header: 'Fecha inicio' },
      { field: 'dateEnd', header: 'Fecha fin' },
      { field: 'status', header: 'Estado' },
      { field: 'client', header: 'Cliente' },
      { field: 'agent', header: 'Agendador' },
      { field: 'daysassigned', header: 'Dias asignados' },
      { field: 'basecost', header: 'Valor estimado' },
      { field: 'toolsneed', header: 'Utencilios incluidos' },
      { field: '', header: 'Ver/Asignar empleado' },
    ]
    this.colsEmployees = [
      { field: 'nameEmploye', header: 'Nombre' },
      { field: 'charge', header: 'Cargo' },
    ]
  }
  chargeData(event: LazyLoadEvent) {
    this.simpleMeetService.getSimpleMeets().subscribe(rest => {
      if (rest.length > 0) {
        rest.forEach(item => item.elementAsArray = item.addededServices ? JSON.parse(item.addededServices) : [])
        this.dataFromdb = rest.filter(item => item.status === 'process' || item.status === 'hold');
        this.dataFromdb.forEach(item => this.completeCityDrop(item.cliProvince, 'dataFromdb'));
        console.log('dataFromdb', this.dataFromdb);
      }
    });
    if (event) {
      this.fromPro = event.first;
      this.toPro = event.rows;
    }
    this.simpleMeetService.getSimpleMeetsHistory(this.fromPro, this.toPro).subscribe(rest => {
      if (rest) {
        this.dataFromdbProcesed = rest.list;
        this.sizeRecordsPro = rest.count;
        this.dataFromdbProcesed.forEach(item => item.employeesAssig != "[]" ? item.elementsAsArray = JSON.parse(item.employeesAssig) : [])
        console.log('dataFromdb', this.dataFromdbProcesed);
      }
    });
  }
  completeCityDrop(codeFather: string, array: string) {
    this.catalogueService.getCataloguebyCodeCatAndCodeFather(CITYCAT, PROVINCECAT, codeFather).then(rest => {
      if (rest) {
        if (array == 'dataFromdb') this.dropCityTwo.push(rest[0]);
        else this.dropCityTwoProcesed.push(rest[0]);
      }
    });
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
    }, { validator: this.emailValidator("email") });
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
  validateForm() {
    // console.log("this.services", JSON.stringify(this.formCita.controls.services.value));
    this.formCita.markAllAsTouched();
    this.formCita.markAsDirty();
    if (!this.formCita.valid) {
      this.messageService.add({ severity: 'error', detail: 'Formulario no valido' });
      console.log(this.formCita.value);
    } else {
      if (this.services.length > 0) {
        if (this.fromEdit) {
          this.simpleMeet.seqsimplemeet = this.meetToUpdate.seqsimplemeet;
          this.simpleMeet.status = this.meetToUpdate.status;
        } else {
          this.simpleMeet.status = 'hold';
        }
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
        this.formCita.reset();
        while (this.services.controls.length > 1) {
          this.deleteService(0);
        }
        this.chargeData(null);
        this.activeIndex1 = 0;
        this.fromEdit = false;
      } else {
        this.messageService.add({ severity: 'error', detail: 'Ocurrio un error' });

      }
    })
  }

  async getCatalogues() {
    await this.catalogueService.getCataloguebyCodeCat(PROVINCECAT).then(rest => {
      this.dropProvince = this.catalogueService.constructModel(rest);
    });
    await this.catalogueService.getCataloguebyCodeCat(SERVICETYPE).then(rest => {
      this.dropType = this.catalogueService.constructModel(rest);
    });

    this.catalogueService.getCataloguebyCodeCat(REQUESTSTATUSCAT).then(rest => {
      this.drop = this.catalogueService.constructModel(rest);
    })
  }
  onChangueProvince(event: any) {
    this.catalogueService.getCataloguebyCodeCatAndCodeFather(CITYCAT, PROVINCECAT, event.value).then(rest => {
      this.dropCity = this.catalogueService.constructModel(rest);
    });
  }

  //dialog
  showAssignation() {
    this.showEmployes = true;
  }
  showAssignated() {
    this.showEmployesAssigned = true;
  }
  showAssignatedProcessed(history: SimplemeetHistory) {
    this.historyMeet = { ...history };
    this.showEmployesAssignedProccessed = true;
  }

  getEmployees(event: LazyLoadEvent) {
    this.employeeService.getEmployesToBesAssigned().subscribe(res => {
      res.forEach(item => {
        item.img = this.sharedFuntions.repair(item.img);
      })
      this.employesToAssig = res;
      this.sizeRecordsToAsig = res.length;
    })
  }
  getEmployeesAssigned() {
    this.employeeService.getEmployessAssigned(this.selectedFather.seqsimplemeet, null).subscribe(res => {
      res.forEach(item => {
        item.img = this.sharedFuntions.repair(item.img);
      })
      this.employesAssigned = res;
      this.employesAssigned.length > 0 ? this.employeesAsignated = this.employesAssigned.length : 0;
      this.sizeRecordsAsigned = res.length;
    })
  }

  onRowSelect(event: any) {
    event.data.assigmentdayte = this.selectedFather.dateService;
    event.data.endassigmentdate = this.selectedFather.dateEnd;
    event.data.seqmeet = this.selectedFather.seqsimplemeet;
    this.selectdEmployes.push(event.data);
    console.log("this.selectdEmployes", this.selectdEmployes);
  }
  saveAssigment() {
    if (this.selectdEmployes.length > 0) {
      this.selectdEmployes.forEach(item => {
        this.employeeService.updateEmployee(item).subscribe(update => {
          if (update) this.messageService.add({ severity: 'success', detail: 'Empleado asignado' })
          else this.messageService.add({ severity: 'error', detail: 'No se logro asignar' });
          this.getEmployeesAssigned();
          this.getEmployees(null);
          this.showEmployes = false;
        })
      })
    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione al menos un empleado' });
    }

  }
  onRowSelectFather(event: Simplemeet) {
    this.selectedFather = event;
  }
  onRowSelectAssigned(event: Simplemeet) {
    this.selectedFather = event;
    this.getEmployeesAssigned();
  }

  fillDataToUpdate(item: Simplemeet) {
    console.log("this.item)", item);
    if (item.status != 'hold') {
      if (item.status == 'process') {
        this.employeeService.getEmployessAssigned(item.seqsimplemeet, null).subscribe(res => {
          if (res.length <= 0) {
            this.messageService.add({ severity: 'error', detail: 'Debe haber al menos un empleado asignado' });
          } else {
            this.simpleMeetService.updateSimpleMeet(item).subscribe(rest => {
              if (rest) this.messageService.add({ severity: 'success', detail: 'Solicitud actualizada' });
              this.chargeData(null);
            });
          }
        })
      } else {
        this.getEmployesAndUpdate(item.seqsimplemeet, item);
        this.simpleMeetService.updateSimpleMeet(item).subscribe(rest => {
          if (rest) this.messageService.add({ severity: 'success', detail: 'Solicitud actualizada' });
          this.chargeData(null);
        });
      }


    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione un estado diferente a en espera' });
    }
  }
  getEmployesAndUpdate(seqmeet: number, meet: Simplemeet) {
    this.employeeService.getEmployessAssigned(seqmeet, null).subscribe(rest => {
      if (rest) {
        this.saveHistory(rest, meet);
        rest.forEach(item => {
          item.img = this.sharedFuntions.repair(item.img);
          item.assigmentdayte = null;
          item.endassigmentdate = null;
          item.seqmeet = null;
          this.employeeService.updateEmployee(item).subscribe(() => console.log('employee removed'));
        });
      }
    })
  }
  saveHistory(employees: Employee[], meet: Simplemeet) {
    console.log("employees", employees);
    const historymeet = this.createHistoryMeet(meet);
    historymeet.employeesAssig = JSON.stringify(employees.length > 0 ? employees : []);
    this.simpleMeetService.saveSimpleMeetHistory(historymeet).subscribe(rest => {
      if (rest) {
        this.messageService.add({ severity: 'success', detail: 'Historial actualzado' });
        this.chargeData(null)
      } else
        this.messageService.add({ severity: 'error', detail: 'Error, al actualziar' });
    });
  }
  createHistoryMeet(simplemeet: Simplemeet) {
    const history: SimplemeetHistory = new SimplemeetHistory();
    history.seqsimplemeethistory = simplemeet.seqsimplemeet;
    history.dateService = simplemeet.dateService;
    history.dateEnd = simplemeet.dateEnd;
    history.address = simplemeet.address;
    history.cliName = simplemeet.cliName;
    history.cliLastName = simplemeet.cliLastName;
    history.cliDni = simplemeet.cliDni;
    history.cliEmail = simplemeet.cliEmail;
    history.cliCity = simplemeet.cliCity;
    history.cliProvince = simplemeet.cliProvince;
    history.typeService = simplemeet.typeService;
    history.services = simplemeet.services;
    history.hoursStimated = simplemeet.hoursStimated;
    history.status = simplemeet.status;

    history.codeUser = simplemeet.codeUser;
    history.tools = simplemeet.tools;
    history.stimatedValue = simplemeet.stimatedValue;
    history.phone = simplemeet.phone;
    history.addededServices = simplemeet.addededServices;
    return history;

  }
  onEditMeet(dataFrom: Simplemeet) {
    console.log('On edit', dataFrom);
    this.fromEdit = true;
    this.activeIndex1 = 2;
    this.populateDataEdit(dataFrom);
    this.meetToUpdate = dataFrom;
  }
  cancelEdit() {
    this.formCita.reset();
    while (this.services.controls.length > 1) {
      this.deleteService(0);
    }
    this.chargeData(null);
    this.activeIndex1 = 0;
    this.fromEdit = false;
  }
  populateDataEdit(data: Simplemeet) {
    this.formCita.patchValue({
      dni: data.cliDni,
      name: data.cliName,
      lastname: data.cliLastName,
      phone: data.phone,
      email: data.cliEmail,
      province: data.cliProvince,
      city: data.cliCity,
      address: data.address,
      hoursNumber: data.hoursStimated,
      dateService: new Date(data.dateService),
      dateEnd: new Date(data.dateEnd),
      tools: data.tools,
      services: this.populateServices(data.elementAsArray)
    });
    console.warn(this.formCita);
  }
  populateServices(service: ServiceAdd[]) {
    this.deleteService(0);
    service.forEach(() => this.addService());
    if (this.services.length == this.services.length) this.services.patchValue(service)
  }
  saveUpdate(simplemeet: Simplemeet) {
  }

  enterOnlyNumbers(evt: any) {
    if (window.onkeyup) {
      var keynum = evt.keyCode;
    } else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá ascii.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    } else {
      //incorporar mensaje
      return false;
    }
  }
  emailValidator(emailControl: string) {
    // external validator
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[emailControl];
      if (control.errors && !control.errors.mustMatch) {
        return;
      }
      if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(control?.value)) {
        control.setErrors(null);
      } else {
        control.setErrors({ mustMatch: 'Correo incorrecto' });
      }
    }
  }
}

export class ServiceAdd {
  nameService: string;
  tipeService: string;
  constructor() {
    this.nameService = '';
    this.tipeService = ''
  }
}
