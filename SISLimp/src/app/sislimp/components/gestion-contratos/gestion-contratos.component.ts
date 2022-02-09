import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { CataloguesService } from 'src/app/sharedAll/serviceShared/catalogues.service';
import { FuntionsSharedService } from 'src/app/sharedAll/serviceShared/funtions-shared.service';
import { Agreement } from '../../shared/models/agreements.model';
import { Employee } from '../../shared/models/employee.model';
import { ServiceAdd } from '../agendamiento-citas/agendamiento-citas.component';
import { EmployeeService } from '../gestion-empleados/employee.service';
import { AgreementService } from './agreement.service';
const CODECAT = 'SERVICETYPE'
@Component({
  selector: 'app-gestion-contratos',
  templateUrl: './gestion-contratos.component.html',
  styleUrls: ['./gestion-contratos.component.css'],
  providers: [MessageService]
})
export class GestionContratosComponent implements OnInit {

  drop: SelectItem[] = [];
  fordropt: any

  //table
  cols: any[];
  dataFromdb: Agreement[] = [];
  sizeRecords: number = 50;
  sizeRecordsToAsig: number = 10;
  sizeRecordsAsigned: number = 10;
  pageSize: number = 50;

  selectedFather: Agreement = new Agreement();
  employeesAsignated: number = 0;

  //employees
  colsEmployees: any[] = [];
  employesToAssig: Employee[] = [];
  employesAssigned: Employee[] = [];
  showEmployesAssigned: boolean = false;
  showEmployes: boolean = false;
  showLegalperson: boolean = false;
  selectdEmployes: Employee[] = [];
  formcontracts: FormGroup = new FormGroup({});
  agreementContainer: Agreement = new Agreement();
  seqLegalperson: number = 0;

  activeIndex1: number = 0;
  fromEdit: boolean = false;
  agrrementToUpdate: Agreement = new Agreement();
  fromChangeEdit: boolean = false;
  formServices: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private catalogueService: CataloguesService,
    private messageService: MessageService,
    private agreeService: AgreementService,
    private emplyeeservice: EmployeeService,
    private sharedFuntions: FuntionsSharedService,
  ) { }
  ngOnInit(): void {
    this.createCols();
    this.createForm();
    this.getCatalogues();
    this.addService();
  }

  createCols() {
    this.cols = [
      { field: 'codeContract', header: 'Código contrato' },
      { field: 'datestart', header: 'Fecha inicio' },
      { field: 'dateend', header: 'Fecha fin' },
      { field: 'nameEnterprice', header: 'Nombre empresa' },
      { field: 'respresent', header: 'Responsable empresa' },
      { field: '', header: 'Ver/Asignar empleado' },
      { field: '', header: 'Editar' },
    ]
    this.colsEmployees = [
      { field: 'nameEmploye', header: 'Nombre' },
      { field: 'charge', header: 'Cargo' },
    ]
  }

  showAssignation() {
    this.showEmployes = true;
  }
  showAssignated() {
    this.showEmployesAssigned = true;
  }
  getEmployees(event: LazyLoadEvent) {
    this.emplyeeservice.getEmployesToBesAssigned().subscribe(res => {
      res.forEach(item => {
        item.img = this.sharedFuntions.repair(item.img);
      })
      this.employesToAssig = res;
      this.sizeRecordsToAsig = res.length;
    })
  }
  getEmployeesAssigned() {
    this.emplyeeservice.getEmployessAssigned(null, this.selectedFather.seqagree).subscribe(res => {
      res.forEach(item => {
        item.img = this.sharedFuntions.repair(item.img);
      })
      this.employesAssigned = res;
      this.employesAssigned.length > 0 ? this.employeesAsignated = this.employesAssigned.length : 0;
      this.sizeRecordsAsigned = res.length;
    })
  }

  showLegal() {
    this.showLegalperson = true;
  }
  getLegal(event) {
    if (event) {
      this.seqLegalperson = event.seqlegalperson;
      this.formcontracts.patchValue({
        legalperson: event.name + " " + event.lastname
      });
      this.fromChangeEdit = true;
      this.showLegalperson = false;

    }


  }
  validateForm() {
    this.formcontracts.markAllAsTouched();
    if (!this.formcontracts.valid) {
      this.messageService.add({ severity: 'error', detail: 'Formulario no valido' });
    } else {
      if (this.services.length > 0) {
        if (this.fromEdit && !this.fromChangeEdit) {
          this.agreementContainer.seqagree = this.agrrementToUpdate.seqagree;
          this.agreementContainer.legalperson_seqlegalperson = this.formcontracts.controls.legalperson.value;
        } else {
          this.agreementContainer.legalperson_seqlegalperson = this.seqLegalperson;
        }
        this.agreementContainer.ruc = this.formcontracts.controls.ruc.value;
        this.agreementContainer.name = this.formcontracts.controls.name.value;
        this.agreementContainer.location = this.formcontracts.controls.serviceAddress.value;
        this.agreementContainer.principallocation = this.formcontracts.controls.principaladdress.value;
        this.agreementContainer.phone = this.formcontracts.controls.phone.value;
        this.agreementContainer.type = this.formcontracts.controls.services.value[0]?.typeService;
        this.agreementContainer.datestart = this.formcontracts.controls.stardate.value;
        this.agreementContainer.dateend = this.formcontracts.controls.endate.value;
        this.agreementContainer.schedule = this.formcontracts.controls.schedule.value;
        this.agreementContainer.servicedetail = this.formcontracts.controls.detailService.value;
        this.agreementContainer.subtotal = this.formcontracts.controls.subtotal.value;
        this.agreementContainer.area = this.formcontracts.controls.workarea.value;
        this.agreementContainer.addededServices = JSON.stringify(this.formcontracts.controls.services.value);
        this.fromChangeEdit = false;
        this.saveForm(this.agreementContainer);
      } else {
        this.messageService.add({ severity: 'error', detail: 'Se requiere al menos un servicio' });
      }
    }
  }
  chargeData(event: LazyLoadEvent) {
    this.agreeService.getAgreements().subscribe(rest => {
      if (rest.length > 0) {
        console.log(rest);
        rest.forEach(item => item.elementAsArray = item.addededServices ? JSON.parse(item.addededServices) : [])
        this.dataFromdb = rest;
        this.sizeRecords = rest.length;
      }

    });
  }

  createForm() {
    this.formcontracts = this.formBuilder.group({
      ruc: ['', Validators.required],
      name: ['', Validators.required],
      legalperson: ['', [Validators.required]],
      principaladdress: ['', Validators.required],
      serviceAddress: ['', Validators.required],
      phone: ['', Validators.required],
      workarea: ['', Validators.required],
      stardate: ['', Validators.required],
      endate: ['', Validators.required],
      subtotal: ['', Validators.required],
      schedule: ['', Validators.required],
      detailService: ['', Validators.required],
      services: this.formBuilder.array([]),
    });
  }

  getCatalogues() {
    this.catalogueService.getCataloguebyCodeCat(CODECAT).then(rest => {
      this.drop = this.catalogueService.constructModel(rest);
    })
  }

  saveForm(container: Agreement) {
    if (container.legalperson_seqlegalperson > 0) {
      this.agreeService.saveAgreement(container).subscribe(res => {
        if (res != null) {
          this.messageService.add({ severity: 'success', detail: 'Registrado correctamente' });
          this.formcontracts.reset();
          while (this.services.controls.length > 1) {
            this.deleteService(0);
          }
          this.seqLegalperson = 0;
          this.chargeData(null);
          this.activeIndex1 = 0;
          this.fromEdit = false
        } else {
          this.messageService.add({ severity: 'error', detail: 'Ocurrio un error' });

        }
      });
    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione una persona legal' });
    }
  }

  onRowSelect(event: any) {
    event.data.assigmentdayte = this.selectedFather.datestart;
    event.data.seqcontractassig = this.selectedFather.seqagree;
    this.selectdEmployes.push(event.data);
    console.log("this.selectdEmployes", this.selectdEmployes);
  }
  onRowSelectAssigned(event: Agreement) {
    this.selectedFather = event;
    this.getEmployeesAssigned();
  }
  saveAssigment() {
    if (this.selectdEmployes.length > 0) {
      this.selectdEmployes.forEach(item => {
        this.emplyeeservice.updateEmployee(item).subscribe(update => {
          if (update) this.messageService.add({ severity: 'success', detail: 'Empleado asignado' })
          else this.messageService.add({ severity: 'error', detail: 'No se logro asignar' });
          this.getEmployeesAssigned();
          this.showEmployes = false;
        })
      })
    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione al menos un empleado' });
    }

  }
  onRowSelectFather(event: Agreement) {
    // console.log(event);
    this.selectedFather = event;
  }

  // for edit 
  get services() {
    return this.formcontracts.controls["services"] as FormArray;
  }
  addService() {
    const formServices = this.formBuilder.group({
      typeService: ['', Validators.required],
      serviceName: ['', Validators.required]
    });
    this.services.push(formServices);
  }
  onEditContract(dataFrom: Agreement) {
    console.log('On edit', dataFrom);
    this.fromEdit = true;
    this.activeIndex1 = 1;
    this.populateDataEdit(dataFrom);
    this.agrrementToUpdate = dataFrom;
  }
  populateDataEdit(data: Agreement) {
    this.formcontracts.patchValue({
      ruc: data.ruc,
      name: data.name,
      legalperson: data.legalperson_seqlegalperson,
      principaladdress: data.principallocation,
      serviceAddress: data.location,
      phone: data.phone,
      workarea: data.area,
      stardate: new Date(data.datestart),
      endate: new Date(data.dateend),
      subtotal: data.subtotal,
      schedule: data.schedule,
      detailService: data.servicedetail,
      services: this.populateServices(data.elementAsArray)
    });
    console.warn(this.formcontracts.value);
  }
  populateServices(service: ServiceAdd[]) {
    this.deleteService(0);
    service.forEach(() => this.addService());
    if (this.services.length == this.services.length) this.services.patchValue(service)
  }
  deleteService(serviceIndex: number) {
    this.services.removeAt(serviceIndex);
  }
}
