import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-detailservice',
  templateUrl: './detailservice.component.html',
  styleUrls: ['./detailservice.component.css']
})
export class DetailserviceComponent implements OnInit {

  @Output() outValue: EventEmitter<boolean> = new EventEmitter();
  cols: any[];
  dataFromdb: any[] = [];
  sizeRecords: number = 50;
  pageSize: number = 50;
  constructor() { }

  ngOnInit(): void {
    this.createCols()
    this.chargeData(null);
  }

  createCols(){
    this.cols = [
      { field: 'codeService', header: 'Código cita' },
      { field: 'date', header: 'Fecha' },
      { field: 'nameemplyee', header: 'Nombre empleado' },
      { field: 'client', header: 'Cliente'},
      { field: 'assigmenthour', header: 'Hora asignada'},
      { field: 'status', header: 'Estado'},
      { field: 'duration', header: 'Duración'},
      { field: 'price', header: 'Precio'},
      { field: '', header: 'Editar tarifa'},
      { field: '', header: 'Culminar servicio'},
      { field: '', header: 'Editar duracion'},
      { field: '', header: 'Cancelar servicio'}
    ];
  }
  chargeData(event: LazyLoadEvent){
    this.dataFromdb = [
      {codeService: '6566565', date: '17/12/2021', nameemplyee: 'Carlos', client: 'Arana', assigmenthour: '10 am',status: 'COMPLETADO',duration: '2 horas', price: 1622.00},
      {codeService: '6566565', date: '18/12/2021', nameemplyee: 'Pepe', client: 'Arana', assigmenthour: '10 am' ,status: 'COMPLETADO',duration: '3 meses', price: 1622.00},
      {codeService: '6566565', date: '20/12/2021', nameemplyee: 'Jose', client: 'Arana', assigmenthour: '10 am' ,status: 'PENDIENTE',duration: '2 horas', price: 1622.00},
    ]
  }
  outFromHere(){
    this.outValue.emit(true);
  }

}
