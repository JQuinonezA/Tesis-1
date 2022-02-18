import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PoductsQuantity } from 'src/app/page/components/products/products.component';
import { SolProduct } from 'src/app/page/components/sharedpage/models/solproduct.model';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { CataloguesService } from 'src/app/sharedAll/serviceShared/catalogues.service';
import { ProductosService } from 'src/app/sislimp/components/gestion-inventario-products/productos.service';
import { ProductModel } from 'src/app/sislimp/shared/models/products.model';
import { OdersService } from './oders.service';
const REQUESTSTATUSCAT = 'REQUESTSTATUSCAT';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  cards: any[] = [];
  comingProducts: PoductsQuantity[] = [];
  realPRoducts: ProductModel[] = [];
  solProduct: SolProduct[] = [];
  drop: SelectItem[] = [];
  codeUser: number;
  constructor(
    private orderService: OdersService,
    private authService: AuthService,
    private productsService: ProductosService,
    private catalogueService: CataloguesService,
  ) { 
    this.codeUser =  this.authService.codeUser;
  }

  ngOnInit(): void {
    this.getSolProducts();
    this.getCatalogues();
  }
  getCatalogues() {
    this.catalogueService.getCataloguebyCodeCat(REQUESTSTATUSCAT).then(rest => {
      this.drop = this.catalogueService.constructModel(rest);
    })
  }

  transformFromJSON(value: string) {
    return JSON.parse(value);
  }

  async getProductsRelated(products: PoductsQuantity[]) {
    let prods = [];
    let seen = new Set();
    const filtered = products.filter(item => {
      const duplicate = seen.has(item.codeProd);
      seen.add(item.codeProd);
      return !duplicate;
    });
    for (let item of filtered) {
      console.log("Code prod", item.codeProd);
      await this.productsService.getEspecifict(item.codeProd).then(rest => {
         prods.push(rest);
      });
    }
    return prods;
  }
  async getSolProducts() {
    if(this.codeUser && this.codeUser !=0 ){
      this.orderService.getSolProducts(this.codeUser).subscribe(rest => {
        rest.forEach(async item => {
          let productsQuantity: PoductsQuantity[] = [];
          productsQuantity = [...productsQuantity, ...this.transformFromJSON(item.products)];
          item.elementAsArray =  await this.getProductsRelated(productsQuantity);
        });
        this.solProduct = rest;
        console.log(this.solProduct);
      })
    } 
  }
}
