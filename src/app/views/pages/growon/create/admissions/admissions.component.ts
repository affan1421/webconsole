import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../services/createservices.service';

@Component({
  selector: 'kt-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phoneno', 'class', 'section', 'approve', 'reject'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private api: CreateservicesService) { }

  ngOnInit() {
    this.getRequestedUsers()
  }

  getRequestedUsers() {
    let id = localStorage.getItem('schoolId')
    this.api.getRequestedUsers(id).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.body.data)
      this.dataSource.paginator = this.paginator;
      console.log('REQ LIST', res.body.data)
    })
  }
}

