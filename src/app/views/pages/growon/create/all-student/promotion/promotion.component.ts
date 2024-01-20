import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../../services/createservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  classes: any = []
  sections: any = []
  selectedclass: any;
  selectedsection: any;

  dselectedclass: any;
  dsections: any = []
  dclasses: any = []
  dselectedsection: any;

  dataSource: any;
  displayedColumns: string[] = ['status', 'name', 'phone', 'class', 'section'];
  resultsLength: any;
  pageIndex: any;
  pageSize: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private api: CreateservicesService) {
    this.getSchool()
  }

  ngOnInit() {
  }

  getSchool = () => {
    this.api.getSchool(localStorage.getItem('schoolId')).subscribe(async (response: any) => {
      this.classes = response.body.data[0].classList
      this.selectedclass = this.classes[0].classId
      this.sections = await this.getSections(this.selectedclass)

      this.dclasses = response.body.data[0].classList
      this.dselectedclass = this.classes[0].classId
      this.dsections = await this.getSections(this.dselectedclass)
    })
  }

  getSections(classId: string) {
    let selectedClass = this.classes.filter((item: any) => {
      return item.classId === classId
    })
    this.sections = selectedClass[0].section
  }

  getDsections(classId: string) {
    let selectedClass = this.classes.filter((item: any) => {
      return item.classId === classId
    })
    this.dsections = selectedClass[0].section
  }

  getSectionsinTable(classId: string) {
    let selectedClass = this.classes.filter((item: any) => {
      return item.classId === classId
    })
    return selectedClass[0].section
  }

  fetchStudents() {
    this.api.getStudentsbySection(this.selectedsection).subscribe((response: any) => {
      if (response.body.count > 0) {
        this.dataSource = new MatTableDataSource(response.body.data)
        this.dataSource.paginator = this.paginator;
      } else {
        Swal.fire('No Students', '', 'error')
      }
    })
  }

  onPageFired(event) {
    console.log('Page Fired', event.pageIndex + 1, event.pageSize)
  }

  classChanged(classid?: string) {
    this.getSections(classid)
    console.log(this.dataSource);
  }

  promote() {
    let selectedstudents = this.dataSource.data.filter((student: any) => {
      return student.status
    })
    let students = selectedstudents.map((student: any) => {
      return {
        id: student._id,
        class: student.class,
        section: student.section
      }
    })
    this.api.promoteStudents({ studentList: students }).subscribe((response: any) => {
      this.api.getStudentsbySection(this.dselectedsection).subscribe((response: any) => {
        if (response.body.count > 0) {
          this.dataSource = new MatTableDataSource(response.body.data)
          this.dataSource.paginator = this.paginator;
        } else {
          Swal.fire('No Students', '', 'error')
        }
      })
      if (response.body.isSuccess) {
        Swal.fire('Operation Succesful', '', 'success')
      }
    })
  }

  addDefault() {
    this.dataSource.data.forEach((item: any) => {
      item.class = this.dselectedclass
      item.section = this.dselectedsection
      item.status = true
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkStudent(student: any) {
    if (student.status) {
      if (this.dselectedclass) {
        student.class = this.dselectedclass
      }
      if (this.dselectedsection) {
        student.section = this.dselectedsection
      }
    }
  }
}
