import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-school-data',
  templateUrl: './school-data.component.html',
  styleUrls: ['./school-data.component.scss']
})
export class SchoolDataComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  id: any;
  displayedColumns: string[] = ['name', 'status', 'noofstudents', 'percentage', 'time'];
  dataSource: any;
  classList: any;
  schoolName: any;
  date: any
  percentage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private api: CreateservicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log('Params', params)
      this.id = params.get('id');
      this.date = new Date(params.get('date'))
      this.percentage = `${parseInt(params.get('percentage'))}%`
      console.log(params.get('percentage'))
    });
  }

  ngAfterViewInit() {
    this.getReportData(this.date)
  }

  getReportData(dateISO?) {
    let data = {
      school_id: this.id,
      date: dateISO ? dateISO : new Date().toLocaleDateString()
    }
    this.api.getschoolReport(data).subscribe((res: any) => {
      this.schoolName = res.body.data[0].name
      this.classList = res.body.data[0].classList;
      this.classList.forEach((element: any) => {
        if (element.marked_At) {
          let markedTime = new Date(element.marked_At)
          element.marked_At = markedTime.toLocaleTimeString()
        }
        if (element.present_count) {
          element.count = `${element.present_count} / ${element.totalStudent}`
          element.percentage = Math.floor(element.percentage).toString()
          console.log(element.percentage)
        }
      });
      this.dataSource = new MatTableDataSource(this.classList)
      this.dataSource.paginator = this.paginator;
    })
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'School Report');
    XLSX.writeFile(wb, `${this.schoolName} - ${this.date.toLocaleDateString()}.xlsx`);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  dateFilter(value: any) {
    let date = new Date(value)
    // let date = new Date(new Date(value).valueOf() + 1000 * 3600 * 24);
    this.getReportData(date)
  }

}



