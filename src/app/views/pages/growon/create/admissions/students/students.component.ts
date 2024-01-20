import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import { CreateservicesService } from '../../services/createservices.service';
import { MatDialog } from '@angular/material/dialog';
import { UserSignupDialogComponent } from '../user-signup-dialog/user-signup-dialog.component';
@Component({
  selector: 'kt-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phoneno', 'class', 'section', 'approve', 'reject'];
  dataSource: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  userActive: any;
  id: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
  }
  constructor(private api: CreateservicesService, private loaderService: LoadingService, private dialog: MatDialog) {
    this.id = localStorage.getItem('schoolId')
    console.log(this.id)
    if (this.id) {
      this.getSchool()
    }
  }

  ngOnInit() {
    this.getRequestedUsers()
  }

  getRequestedUsers() {
    let data = {
      searchValue: "",
      filterKeysArray: [
        'name',
        'username'
      ],
      school_id: `${localStorage.getItem('schoolId')}`,
      profileStatus: "PENDING"
    }
    this.api.getGlobalStudentPaginationPostFilter(this.pageIndex, this.pageSize, data).subscribe((res: any) => {
      console.log('res', res)
      this.dataSource = new MatTableDataSource(res.body.data);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource)
    })
  }

  approve(id: string) {
    let data = {
      userId: id,
      status: "APPROVED"
    }
    this.api.updateRequest(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.getRequestedUsers()
      }
    })
  }

  reject(id: string) {
    let data = {
      userId: id,
      status: "BLOCKED"
    }
    this.api.updateRequest(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.getRequestedUsers()
      }
    })
  }

  userSignup() {
    let dialogRef = this.dialog.open(UserSignupDialogComponent, {
      width: '500px',
      data: this.userActive
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.confirmed) {
        let id = localStorage.getItem('schoolId')
        let data = {
          school_id: id,
          studSignup: !this.userActive,
        }
        this.loaderService.show()
        this.api.userSignup(data).subscribe((res: any) => {
          this.userActive = !this.userActive
          this.loaderService.hide()
          console.log(res)
        }, err => {
          this.loaderService.hide()
        })
      }
    })

  }


  getSchool() {
    this.api.getSchool(this.id).subscribe((res: any) => {
      this.userActive = res.body.data[0].studSignup
      console.log(this.userActive)
      this.loaderService.hide()
    }, (err: any) => {
      this.loaderService.hide()
    })
  }
}
