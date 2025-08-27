import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Component pages
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { StoreListComponent } from './store-list/store-list.component'; 
import { StoreStockComponent } from './store-stock/store-stock.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
  },
    {
    path: 'store-list',   
    component: StoreListComponent
  },
   {
    path: 'store/:storeName/stock',  
    component: StoreStockComponent,
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
