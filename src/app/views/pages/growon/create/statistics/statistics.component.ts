import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreateservicesService } from '../services/createservices.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'kt-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  displayedColumns: string[] = ['SchoolName', 'noofstudents', 'percentage', 'usage', 'action'];
  dataSource: any
  classList: any;
  schoolList: any;
  date: any;
  totalCount: number = 1000
  constructor(private api: CreateservicesService, private router: Router) {
  }

  ngOnInit() {
    this.date = new Date()
    console.log(this.date)
  }

  ngAfterViewInit() {
    this.getAllSchools();
  }

  getAllSchools(date?) {
    let data = {
      date: date ? date : new Date().toLocaleDateString()
    }
    this.api.getallSchools(data).subscribe((res: any) => {
      console.log(res.body.data)
      this.schoolList = res.body.data
      this.totalCount = this.schoolList.length
      this.schoolList.forEach((school: any) => {
        school.usage = school.present_count / school.totalStudents * 100
      })
      this.dataSource = new MatTableDataSource(this.schoolList);
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: string) {
    console.log(filterValue)
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  schoolData(id: string, percentage: number) {
    let date = this.date.toLocaleDateString()
    this.router.navigate([`create/statistics/${id}`, { date: date, percentage: percentage }])
  }

  dateFilter(value: any) {
    let date = new Date(value).toLocaleDateString()
    // let date = new Date(new Date(value).valueOf() + 1000 * 3600 * 24);
    console.log(date)
    this.getAllSchools(date)
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'School Report');
    XLSX.writeFile(wb, `Schools Report - ${this.date.toLocaleDateString()}.xlsx`);
  }
}
