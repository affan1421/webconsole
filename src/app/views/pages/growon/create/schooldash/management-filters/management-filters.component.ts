import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'node_modules/chart.js';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import { LearningService } from '../../../learning/services/learning.service';
import { EditAllManagementComponent } from '../../all-management/edit-all-management/edit-all-management.component';
import { ManagementComponent } from '../../management/management.component';
import { PrincipleComponent } from '../../principle/principle.component';
import { CreateservicesService } from '../../services/createservices.service';
import { ManagementDialogComponent } from '../management-dialog/management-dialog.component';
import { DeleteDialogComponent } from '../student-filter/delete-dialog/delete-dialog.component';
import * as XLSX from 'xlsx';
import { ProfileDownloadDialogComponent } from '../profile-download-dialog/profile-download-dialog.component';


@Component({
  selector: 'kt-management-filters',
  templateUrl: './management-filters.component.html',
  styleUrls: ['./management-filters.component.scss']
})
export class ManagementFiltersComponent implements OnInit {


  isGlobal: Boolean;
  filterData: any = {
    searchValue: '',
    filterKeysArray: ['name', 'username'],
    designation: 'management',
    flag: 'management',
  }
  filters: any;
  states: any;
  cities: any;
  classes: any;
  selectedState: any;
  displayedColumns: string[] = ['name', 'phone', 'gender', 'school', 'status', 'action'];
  dataSource: any;
  resultsLength: any;
  schoolId: any;
  pageIndex: any;
  pageSize: any;
  searchText: any;

  data: any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private dialog: MatDialog, private api: CreateservicesService,
    private api2: LearningService, private loading: LoadingService, private modalService: NgbModal) {
    localStorage.getItem('schoolId') ? this.isGlobal = false : this.isGlobal = true
    this.schoolId = localStorage.getItem('schoolId')
    this.schoolId ? this.getStats() : ''
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.isGlobal) {
      this.loading.show()
      // API to Get Teachers
      this.api.getTeachersbyFilter(this.filters, 1, 5).subscribe((res: any) => {
        this.loading.hide()
        this.resultsLength = res.body.records;
        this.dataSource = res.body.data
      }, (err: any) => {
        this.loading.hide()
      })
    } else {
      this.loading.show()
      this.filterData.school_id = this.schoolId
      // API to Get Teachers
      this.api.getTeachersbyFilter(this.filterData, 1, 5).subscribe((res: any) => {
        this.loading.hide()
        // To Get Count
        this.resultsLength = res.body.records;
        this.dataSource = res.body.data
      }, (err: any) => {
        this.loading.hide()
      })
    }
  }

  onPageFired(event) {
    this.getTeachers(event.pageIndex + 1, event.pageSize)
  }

  getTeachers(pageIndex: number, pageSize: number) {
    this.loading.show()
    if (this.isGlobal) {
      this.api.getTeachersbyFilter(this.filterData, pageIndex, pageSize).subscribe((res: any) => {
        this.loading.hide()
        this.resultsLength = res.body.records;
        this.dataSource = res.body.data
        console.log('Teachers', res.body.data)
      }, (err: any) => {
        this.loading.hide()
      })
    } else {
      this.filterData.school_id = this.schoolId
      this.api.getTeachersbyFilter(this.filterData, pageIndex, pageSize).subscribe((res: any) => {
        this.loading.hide()
        this.resultsLength = res.body.records;
        this.dataSource = res.body.data
        console.log('Teachers', res.body.data)
      }, (err: any) => {
        this.loading.hide()
      })

    }
  }

  applyFilter(pageIndex: number, pageSize: number) {
    this.loading.show()
    this.filterData.searchValue = this.searchText
    console.log(this.searchText)
    if (this.isGlobal) {
      this.api.getGlobalTeacherCount(this.filterData).subscribe((res: any) => {
        this.loading.hide()
        this.resultsLength = res.body.result
        if (res) {
          this.api2.getGlobalAllTeacherByPagination(this.filterData, pageIndex, pageSize).subscribe((resp: any) => {
            this.dataSource = resp.body.data;
            this.dataSource.paginator = this.paginator;
          })
        }
      }, (err: any) => {
        this.loading.hide()
      })

    } else {
      this.filterData.school_id = this.schoolId
      this.api.getTeacherCount(this.filterData, this.schoolId).subscribe((res: any) => {
        this.loading.hide()
        this.resultsLength = res.body.result
        if (res) {
          this.api2.getAllTecherByPagination(this.filterData, this.schoolId, 1, 5).subscribe((resp: any) => {
            this.dataSource = new MatTableDataSource(resp.body.data);
            this.dataSource.paginator = this.paginator;
            console.log('School Data', resp.body.data)
          })
        }
      }, (err: any) => {
        this.loading.hide()
      })
    }
  }

  openDialog(element?: any) {
    const dialogRef = this.dialog.open(ManagementDialogComponent, {
      hasBackdrop: true,
      data: {
        filters: this.filters,
        cities: this.cities
      },
      width: '800px',
      // height: '400px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('Result', result)
      if (result) {
        this.filterData = await result.data
        this.filters = await result.filters
        this.cities = await result.cities
        this.getTeachers(1, 5)
      }
    });
  }

  deactivateAccount(user: any) {
    let status = user.activeStatus ? false : true;
    let data = {
      activeStatus: status
    }
    this.api.changeActiveDeactiveStatusAllUser(user._id, data).subscribe((res) => {
      console.log(res)
      this.getTeachers(1, 5)
    })
  }

  edit(user: any) {
    const modalRef = this.modalService.open(EditAllManagementComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.managements = user;
    modalRef.componentInstance.updateFlag = true;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getTeachers(1, 5); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  deleteUser(user: any) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      height: '200px',
      data: {
        message: ` Do you want to Delete ${user.name}`,
        hasAction: true
      }
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res.action)
      if (res.action) {
        let data = {
          userId: user._id,
          isGlobal: false,
          isStudent: false,
          repositoryId: this.isGlobal ? user.school_id._id : this.schoolId
        }
        this.api.deleteUser(data).subscribe((res: any) => {
          if (res.status = 200) {
            this.getTeachers(1, 5)
          }
        }, (err: any) => {
          let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '500px',
            height: '200px',
            data: {
              message: `${err.error.message}`,
              hasAction: false
            }
          })
        })
      }
    })
  }

  clearText() {
    this.searchText = ''
    this.getTeachers(1, 5)
  }

  clearFilters() {
    this.filters = null;
    this.filterData = {
      searchValue: '',
      filterKeysArray: ['name', 'username'],
      designation: 'management',
    }
    this.getTeachers(1, 5)
  }

  getStats() {
    this.api.getStats(this.schoolId).subscribe((res: any) => {
      this.data = res.body.data.management
      console.log('Stats', this.data)
      this.populateCharts()
    }, (err: any) => {
      console.log(err)
    })
  }

  populateCharts() {

    // Blood Group

    let labels = this.data.bloodGroup.map(e => e.count.toString() + ' ' + e.name.toString())
    let data = this.data.bloodGroup.map(ele => ele.count)
    const canvas = document.getElementById('blood-data-chart')
    const dataChart = new Chart(
      canvas,
      {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              'rgb(255, 0, 84)',
              'rgb(238, 48, 0)',
              'rgb(0, 135, 141)',
              'rgb(0, 168, 150)',
              'rgb(184, 214, 234)',
              'rgb(121, 158, 178)',
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    )

    // Experience

    let expLabels = this.data.experience.map(e => e.name.toString() + ' Years' + ' - ' + e.count.toString())
    let expData = this.data.experience.map(e => e.count)
    const expCanvas = document.getElementById('expCanvas')
    const expChart = new Chart(expCanvas,
      {
        type: 'pie',
        data: {
          labels: expLabels,
          datasets: [{
            label: 'Teaching Experience',
            data: expData,
            backgroundColor: [
              'rgb(255, 0, 84)',
              'rgb(238, 48, 0)',
              'rgb(0, 135, 141)',
              'rgb(0, 168, 150)',
              'rgb(184, 214, 234)',
              'rgb(121, 158, 178)',
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    )

    // Maritial Status

    let msLables = this.data.maritalStatus.map(e => e.count.toString() + ' ' + e.name.toString())
    let msData = this.data.maritalStatus.map(e => e.count)
    const msCanvas = document.getElementById('msCanvas')
    const msChart = new Chart(msCanvas,
      {
        type: 'pie',
        data: {
          labels: msLables,
          datasets: [
            {
              label: 'Mother Tongue',
              data: msData,
              backgroundColor: [
                'rgb(255, 0, 84)',
                'rgb(238, 48, 0)',
                'rgb(0, 135, 141)',
                'rgb(0, 168, 150)',
                'rgb(184, 214, 234)',
                'rgb(121, 158, 178)',
                'rgb(0, 172, 115)',
                'rgb(227, 227, 227)',
                'rgb(137, 171, 165)',
                'rgb(42, 136, 163)',
                'rgb(211, 0, 2)',
                'rgb(37, 38, 39)'
              ],
              hoverOffset: 4
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    )

    // Qualification

    let qLabels = this.data.qualification.map(e => e.count.toString() + ' ' + e.name.toString())
    let qData = this.data.qualification.map(e => e.count)
    const qCanvas = document.getElementById('qCanvas')
    const qChart = new Chart(qCanvas, {
      type: 'bar',
      data: {
        labels: qLabels,
        datasets: [{
          data: qData,
          backgroundColor: [
            'rgb(255, 0, 84)',
            'rgb(238, 48, 0)',
            'rgb(0, 135, 141)',
            'rgb(0, 168, 150)',
            'rgb(184, 214, 234)',
            'rgb(0, 172, 115)',
            'rgb(227, 227, 227)',
            'rgb(137, 171, 165)',
            'rgb(42, 136, 163)',
            'rgb(211, 0, 2)',
            'rgb(37, 38, 39)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        showAllTooltips: true,
        responsive: true,
        maintainAspectRatio: false
      }
    })

    // Mother Tongue

    let mtLabels = this.data.motherTongue.map(e => e.count.toString() + ' ' + e.name.toString())
    let mtData = this.data.motherTongue.map(e => e.count)
    const mtCanvas = document.getElementById('mtCanvas')
    const mtChart = new Chart(mtCanvas, {
      type: 'pie',
      data: {
        labels: mtLabels,
        datasets: [{
          data: mtData,
          backgroundColor: [
            'rgb(55, 136, 246)',
            'rgb(112, 196, 243)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    // Religion
    let rLables = this.data.religion.map(e => e.count.toString() + ' ' + e.name.toString())
    let rData = this.data.religion.map(e => e.count)
    const rCanvas = document.getElementById('rCanvas')
    const rChart = new Chart(rCanvas, {
      type: 'pie',
      data: {
        labels: rLables,
        datasets: [{
          data: rData,
          backgroundColor: [
            'rgb(55, 136, 246)',
            'rgb(112, 196, 243)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

  }

  ExportTOExcel() {
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    let wsjson: any = XLSX.utils.sheet_to_json(ws)
    wsjson = wsjson.map((item) => {
      delete item.Status
      delete item.Action
      return item
    })
    ws = XLSX.utils.json_to_sheet(wsjson)
    XLSX.utils.book_append_sheet(wb, ws, 'Management');
    XLSX.writeFile(wb, `Management.xlsx`);
  }

  downloadProfile(data: any) {
    this.dialog.open(ProfileDownloadDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: data
    })
  }
}
