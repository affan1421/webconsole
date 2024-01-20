import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  @ViewChild('TABLE') table: ElementRef;
  id: any;
  schoolId: any;
  displayedColumns: string[] = ['name', 'time', 'status'];
  dataSource: any;
  teacherList: any;
  schoolName: any;
  totalCount: number = 1000;
  date: any
  percentage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private api: CreateservicesService) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log('Params', params)
      this.id = params.get('id');
      this.schoolName = params.get('schoolName')
      this.date = new Date(params.get('date'))
      this.percentage = `${parseInt(params.get('percentage'))}%`
      console.log(params.get('percentage'))
      console.log(params.get('schoolName'));
    });
  }
  ngAfterViewInit() {
    this.getReportData(this.date)
  }

  getReportData(dateISO?) {
    let data = {
      school_Id: this.id,
      date: dateISO ? new Date(dateISO).toLocaleDateString() : new Date().toLocaleDateString()
    }
    this.api.getteacherReport(data.date, data.school_Id).subscribe((res: any) => {
      this.teacherList = res.body.data;
      this.totalCount = this.teacherList.length
      this.teacherList.forEach((element: any) => {
        element.name = element.teacherId.name
        if (element.createdAt) {
          let markedTime = new Date(element.createdAt)
          element.createdAt = markedTime.toLocaleTimeString()
        }
      });
      console.log(this.teacherList);
      this.dataSource = new MatTableDataSource(this.teacherList)
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
    let date = new Date(value).toLocaleDateString()
    // let date = new Date(new Date(value).valueOf() + 1000 * 3600 * 24);
    this.getReportData(date)
  }

}
