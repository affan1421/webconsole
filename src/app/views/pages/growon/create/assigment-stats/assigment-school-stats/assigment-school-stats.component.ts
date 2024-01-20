import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-assigment-school-stats',
  templateUrl: './assigment-school-stats.component.html',
  styleUrls: ['./assigment-school-stats.component.scss']
})
export class AssigmentSchoolStatsComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  id: any;
  displayedColumns: string[] = ['name', 'status', 'totalassignment', 'submitted', 'evaluated'];
  dataSource: any;
  classList: any;
  schoolName: any;
  date: any
  percentage: any;

  monthData: any = {
    SchoolData: '',
    TotalSubmitted: 0,
    TotalAssignments: 0,
    Evaluated: 0,
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private api: CreateservicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log('Params', params)
      this.id = params.get('id');
      this.schoolName = params.get('name')
      this.date = new Date(params.get('date'))
      this.percentage = `${parseInt(params.get('percentage'))}%`
      console.log(params.get('percentage'))
    });
  }

  ngAfterViewInit() {
    this.getReportData(this.date)
  }

  getReportData(dateISO?) {
    this.api.getAssigmentsStatisticsbySchool(dateISO ? dateISO.toLocaleDateString() : new Date().toLocaleDateString(), this.id).subscribe((res: any) => {
      this.classList = res.body.data.sectionData;

      this.monthData.SchoolData = this.schoolName
      this.monthData.TotalSubmitted = res.body.data.schoolData.totalsubmitted
      this.monthData.TotalAssignments = res.body.data.schoolData.totalAssignments
      this.monthData.Evaluated = res.body.data.schoolData.evaluated

      this.dataSource = new MatTableDataSource(this.classList)
      this.dataSource.paginator = this.paginator;
    })
  }

  ExportTOExcel() {
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    // let wsjson: any = XLSX.utils.sheet_to_json(ws)
    // ws = XLSX.utils.json_to_sheet(wsjson)

    let monthSchoolData = [
      {
        'School Data': this.monthData.SchoolData,
        'Total Submitted': this.monthData.TotalSubmitted,
        'Total Assignments': this.monthData.TotalAssignments,
        'Evaluated': this.monthData.Evaluated,
      }

    ]
    let schoolWS: XLSX.WorkSheet = XLSX.utils.json_to_sheet(monthSchoolData);

    XLSX.utils.book_append_sheet(wb, ws, `Daily School Data`);
    XLSX.utils.book_append_sheet(wb, schoolWS, 'Monthly School Data');

    XLSX.writeFile(wb, `${this.schoolName} - ${this.date.toLocaleDateString()}.xlsx`);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  dateFilter(value: any) {
    let date = new Date(value)
    this.getReportData(date)
  }

}
