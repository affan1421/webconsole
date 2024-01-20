import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import { CreateservicesService } from '../../services/createservices.service';
import { UserSignupDialogComponent } from '../user-signup-dialog/user-signup-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'kt-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phoneno', 'gender', 'role', 'approve', 'reject'];
  dataSource: any;
  pageIndex: any = 1;
  pageSize: any = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  id: any;
  userActive: any;
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
    let id = localStorage.getItem('schoolId')
    this.api.getRequestedUsers(id).subscribe((res: any) => {
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
          userSignup: !this.userActive,
        }
        this.loaderService.show()

        this.api.userSignup(data).subscribe((res: any) => {
          this.loaderService.hide()
          this.userActive = !this.userActive
          console.log(res)
        }, err => {
          this.loaderService.hide()
        })
      }
    })

  }

  getSchool() {
    this.api.getSchool(this.id).subscribe((res: any) => {
      this.userActive = res.body.data[0].userSignup
      console.log(this.userActive)
      this.loaderService.hide()
    }, (err: any) => {
      this.loaderService.hide()
    })
  }
}
