import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

/**
 * Ecommerce Component
 */
export class DashboardComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Dashboard', active: true },
    ];
  }
}
