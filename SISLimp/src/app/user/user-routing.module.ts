import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailComponent } from './components/account-detail/account-detail.component';
import { BuyHistoryComponent } from './components/buy-history/buy-history.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OutComponent } from './components/out/out.component';
import { NavigationComponent } from './components/shared/navigation/navigation.component';

const routes: Routes = [
  {
    path: '', component: NavigationComponent, children:[
      {path: 'accountdetail', component: AccountDetailComponent},
      {path: 'bouyhysto', component: BuyHistoryComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'out', component: OutComponent},
      { path: '**', redirectTo: 'bouyhysto' },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
