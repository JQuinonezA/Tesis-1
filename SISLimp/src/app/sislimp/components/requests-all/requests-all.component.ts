import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { PoductsQuantity, ProductEquleton } from 'src/app/page/components/products/products.component';
import { ProoductShowService } from 'src/app/page/components/products/prooduct-show.service';
import { SolProduct } from 'src/app/page/components/sharedpage/models/solproduct.model';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { CataloguesService } from 'src/app/sharedAll/serviceShared/catalogues.service';
import { FuntionsSharedService } from 'src/app/sharedAll/serviceShared/funtions-shared.service';
import { Agreement } from '../../shared/models/agreements.model';
import { CatProducts } from '../../shared/models/catproduct.model';
import { Employee } from '../../shared/models/employee.model';
import { ProductModel } from '../../shared/models/products.model';
import { AgreementService } from '../gestion-contratos/agreement.service';
import { EmployeeService } from '../gestion-empleados/employee.service';
import { ProductosService } from '../gestion-inventario-products/productos.service';
import { RequestsService } from './requests.service';
const REQUESTSTATUSCAT = 'REQUESTSTATUSCAT'
@Component({
  selector: 'app-requests-all',
  templateUrl: './requests-all.component.html',
  styleUrls: ['./requests-all.component.css'],
  providers: [MessageService]
})
export class RequestsAllComponent implements OnInit {

  drop: SelectItem[] = [];
  fordropt: any

  //table
  cols: any[];
  colWatch: any[];
  dataFromdb: SolProduct[] = [];
  dataFromdbWatch: SolProduct[] = [];
  sizeRecords: number = 50;
  sizeRecordsToAsig: number = 10;
  sizeRecordsAsigned: number = 10;
  pageSize: number = 50;
  pureProducts: CatProducts[] = [];
  itemToSend: SolProduct = new SolProduct();
  statusSol: any;
  selectedProduct: any;
  selectedSoli: any;

  selectedFather: SolProduct = new SolProduct();
  employeesAsignated: number = 0

  //employees
  colsProducts: any[] = [];
  employesToAssig: Employee[] = [];
  employesAssigned: Employee[] = [];
  showEmployesAssigned: boolean = false;
  showEmployes: boolean = false;
  showLegalperson: boolean = false;
  selectdProducts: any[] = [];
  formcontracts: FormGroup = new FormGroup({});
  agreementContainer: Agreement = new Agreement();
  seqLegalperson: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private catalogueService: CataloguesService,
    private messageService: MessageService,
    private sharedFuntions: FuntionsSharedService,
    private requetsService: RequestsService,
    private authService: AuthService,
    private productsService: ProductosService,
    private productShowService: ProoductShowService,
  ) { }
  ngOnInit(): void {
    this.createCols();
    this.getCatalogues();
    this.getproducts();
  }

  createCols() {
    this.cols = [
      { field: 'nameuser', header: 'Usuario' },
      { field: 'conactnumber', header: 'Número de contacto' },
      { field: 'email', header: 'Correo electrónico' },
      { field: 'dateCreate', header: 'Fecha solicitud' },
      { field: 'status', header: 'Estado' },
      { field: '', header: 'Cambiar estado' },
      { field: '', header: 'Guardar' },
    ]
    this.colsProducts = [
      { field: 'codeproduct', header: 'Código producto' },
      { field: 'name', header: 'Nombre' },
      { field: 'quantity', header: 'Cantidad' },
      { field: 'saleprice', header: 'PVP' },
    ]
    this.colWatch = [
      { field: 'nameuser', header: 'Usuario' },
      { field: 'conactnumber', header: 'Número de contacto' },
      { field: 'email', header: 'Correo electrónico' },
      { field: 'dateCreate', header: 'Fecha solicitud' },
      { field: 'status', header: 'Estado' }
    ]
  }
  getCatalogues() {
    this.catalogueService.getCataloguebyCodeCat(REQUESTSTATUSCAT).then(rest => {
      this.drop = this.catalogueService.constructModel(rest);
    })
  }


  onRowSelect(event: any) {
    this.selectdProducts.push(event.data);
  }
  onRowUnselectChild(event: any) {
    this.selectdProducts = this.selectdProducts.filter(item => item.seqprod != event.data.seqprod);
  }
  saveConfirmation(father: SolProduct, items: ProductModel[]) {
    if (items.length > 0) {
      father.products = JSON.stringify(this.constructJSON(items));
      this.messageService.add({ severity: 'success', detail: 'Confirmado' });
    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione al menos uno.' });
    }
  }
  getproducts() {
    this.productShowService.getCatProducts().subscribe(rest => {
      this.pureProducts = rest;
    });
  }
  constructJSON(products: ProductModel[]) {
    let productsSend: PoductsQuantity[] = [];
    for (let item of products) {
      const filtered = this.pureProducts.find(itemfil => itemfil.codeproduct == item.codeproduct);
      const productsQuantity: PoductsQuantity = new PoductsQuantity();
      productsQuantity.codeProd = filtered.codeproduct;
      productsQuantity.quantity = item.quantity;
      productsSend.push(productsQuantity);
    }
    return productsSend;
  }
  onRowSelectFather(event: any) {
    this.selectedFather = event.data;
  }
  transformFromJSON(value: string) {
    return JSON.parse(value);
  }

  fillDataToUpdate(item: SolProduct) {
    if (item.status != 'hold') {
      if (item.status != 'process') {
        this.requetsService.updateSolicitud(item).subscribe(rest => {
          if (rest) {
            this.messageService.add({ severity: 'success', detail: 'Solicitud actualizada' });
            this.getSolProducts(null);
          }
        });
      } else {
        if (item.products == '') {
          this.messageService.add({ severity: 'error', detail: 'Debe confirmar al menos un producto' });
        } else {
          this.requetsService.updateSolicitud(item).subscribe(rest => {
            if (rest) {
              this.messageService.add({ severity: 'success', detail: 'Solicitud actualizada' });
              this.getSolProducts(null);
            }
          });
        }
      }
    } else {
      this.messageService.add({ severity: 'error', detail: 'Seleccione un estado diferente' });
    }

  }
  //para llenar
  async getProductsRelated(products: PoductsQuantity[]) {
    let prods = [];
    let seen = new Set();
    const filtered = products.filter(item => {
      const duplicate = seen.has(item.codeProd);
      seen.add(item.codeProd);
      return !duplicate;
    });
    for (let item of filtered) {
      await this.productsService.getEspecifict(item.codeProd).then(rest => {
        prods.push(rest);
      });
    }
    return prods;
  }
  async getSolProducts(event: LazyLoadEvent) {
    this.requetsService.getAllSolProducts().subscribe(rest => {
      rest.forEach(async item => {
        let productsQuantity: PoductsQuantity[] = [];
        productsQuantity = [...productsQuantity, ...this.transformFromJSON(item.products)];
        item.elementAsArray = await this.getProductsRelated(productsQuantity);
      });
      this.dataFromdb = rest.filter(item => item.status == 'process' || item.status == 'hold');
      this.dataFromdbWatch = rest.filter(item => item.status != 'process' && item.status != 'hold');
    });
  }


}
