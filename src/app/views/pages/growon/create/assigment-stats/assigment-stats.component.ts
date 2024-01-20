import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreateservicesService } from '../services/createservices.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'kt-assigment-stats',
  templateUrl: './assigment-stats.component.html',
  styleUrls: ['./assigment-stats.component.scss']
})
export class AssigmentStatsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('TABLE2') table2: ElementRef;
  displayedColumns: string[] = ['schoolname', 'totalassignment', 'usage', 'submitted', 'evaluated', 'action'];
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
    this.api.getAssigmentsStatistics(date ? date : new Date().toLocaleDateString()).subscribe((res: any) => {
      this.schoolList = res.body.data
      this.totalCount = this.schoolList.length
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

  schoolData(id: string, percentage: number, name: string) {
    let date = this.date.toLocaleDateString()
    this.router.navigate([`create/assignment/${id}`, { date: new Date(date).toLocaleDateString(), percentage: percentage, name: name }])
  }

  dateFilter(value: any) {
    let date = new Date(value).toLocaleDateString()
    // let date = new Date(new Date(value).valueOf() + 1000 * 3600 * 24);
    console.log(date)
    this.getAllSchools(date)
  }

  ExportTOExcel = async () => {
    let ws: XLSX.WorkSheet = await XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    const wb: XLSX.WorkBook = await XLSX.utils.book_new();
    const wsjson: any = XLSX.utils.sheet_to_json(ws)
    ws = XLSX.utils.json_to_sheet(wsjson)
    XLSX.utils.book_append_sheet(wb, ws, 'School Report');
    XLSX.writeFile(wb, `Schools Report - ${this.date.toLocaleDateString()}.xlsx`);

  }
}
