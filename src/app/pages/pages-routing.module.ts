import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Component pages
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { StoreListComponent } from './store-list/store-list.component'; 
import { StoreStockComponent } from './store-stock/store-stock.component';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { StoreAddComponent } from './store-add/store-add.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  // },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
  // },
    {
    path: '',   
    component: StoreListComponent
    },
   {
    path: 'store/:storeName/stock',  
    component: StoreStockComponent,
   },
   {
    path:'edit-stock/:id',
    component: EditStockComponent
   },
   {
    path:'store/add',
    component:StoreAddComponent
   }
   
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
