import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../services/createservices.service';
import { LoadingService } from '../../../loader/loading/loading.service';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'kt-bulk-profile-updater',
  templateUrl: './bulk-profile-updater.component.html',
  styleUrls: ['./bulk-profile-updater.component.scss']
})
export class BulkProfileUpdaterComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["name", "phone", "gender", "class", "section", "action"];
  totalStudents: any;
  resultsLength: any;
  pageIndex: number = 0;
  pageSize: number = 5;
  schoolId: any;
  filterData: any = {
    "searchValue": "",
    "filterKeysArray": [
      "name",
      "username"
    ],
  };
  search: any
  selectedClass: any;
  selectedSection: any;
  classes: any[];
  sections: any[];
  selectedStudent: string = ''
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(private api: CreateservicesService, private loading: LoadingService) {
    this.schoolId = localStorage.getItem("schoolId");
    this.filterData.school_id = this.schoolId
  }

  ngOnInit() {
    this.getClasses()
    this.getStudentCount();
    this.getStudent(this.pageIndex + 1, this.pageSize);

    // Debounce the filter input
    // fromEvent(document.getElementById('filterInput'), 'keyup')
    //   .pipe(debounceTime(500), distinctUntilChanged())
    //   .subscribe((event: KeyboardEvent) => {
    //     this.applyFilter((event.target as HTMLInputElement).value);
    //   });
  }

  onPageFired(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getStudent(this.pageIndex + 1, this.pageSize);
  }

  onClassChange() {
    if (this.selectedClass) {
      const classId = this.selectedClass.id;
    } else {
      this.sections = [];
      this.selectedSection = null;
    }
  }

  onSectionChange() {
  }

  getStudent(page: number, limit: number) {
    this.loading.show();
    this.api.getallstudentPostFilter(this.schoolId, page, limit, this.filterData).subscribe((resp: any) => {
      let students = resp.body.data
      students.forEach(element => {
        element.preview = false
      });
      this.dataSource = new MatTableDataSource(students);
      this.loading.hide();
    });
  }

  getStudentCount() {
    this.api.getStudentCount(this.schoolId).subscribe((response: any) => {
      this.resultsLength = response.body.count;
    });
  }

  openFilePicker(event: Event, studentId: string) {
    this.selectedStudent = studentId
    event.preventDefault();
    this.fileInput.nativeElement.click();
  }

  deleteProfile(student_id: string) {
    this.api.updateProfile(null, student_id).subscribe((response) => {
      if (response.status == 200) {
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Profile Deleted Successfully' });
        this.getStudent(this.pageIndex, this.pageSize)
      }
    })
  }

  applyFilter() {
    this.filterData.searchValue = this.search;
    if (this.classSelected) {
      this.filterData.class = this.selectedClass
    }
    if (this.filterData.class == null) {
      delete this.filterData['class']
    }
    if (this.selectedSection) {
      this.filterData.section = this.selectedSection
    }
    if (this.filterData.section == null) {
      delete this.filterData['section']
    }
    this.paginator.firstPage();
    this.getStudent(this.pageIndex, this.pageSize);
    this.api.getStudentRecordCountPostFilter(this.schoolId, this.filterData).subscribe((response: any) => {
      if (response && response.status == 200) {
        this.resultsLength = response.body.count;
      }
    });
  }

  clear(type: string) {
    if (type == 'class') {
      this.selectedClass = null
      delete this.filterData.class
    } else {
      this.selectedSection = null
      delete this.filterData.section
    }
  }

  onFileUpload(event: any) {
    this.loading.show()
    const file = event.target.files[0];
    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
      const reader = new FileReader();
      // reader.onload = e => this.filePreview = reader.result;
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      this.api.uploadFile(formData).subscribe((response: any) => {
        if (response.status === 201) {
          this.loading.hide()
          let studentProfile = response.body.message
          this.api.updateProfile(studentProfile, this.selectedStudent).subscribe((response) => {
            if (response.status == 200) {
              this.getStudent(this.pageIndex, this.pageSize)
              Swal.fire({ icon: 'success', title: 'Uploaded', text: 'Profile Uploaded Successfully' });
            }
          })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
          return;
        }
      }, (error) => {
        if (error.status == 400) {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
          return;
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
          return;
        }
      });
    }
    else {
      alert("Please upload png or jpg file");
    }

  }

  getClasses() {
    if (this.schoolId) {
      this.api.getSchool(this.schoolId).subscribe((res: any) => {
        this.classes = res.body.data[0].classList
        console.log(this.classes)
      })
    }
  }

  classSelected() {
    if (this.schoolId) {
      this.api.getSections(this.selectedClass).subscribe((res: any) => {
        this.sections = res.body.data
      })
    }
  }
}
