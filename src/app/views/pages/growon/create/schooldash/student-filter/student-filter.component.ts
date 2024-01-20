import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "node_modules/chart.js";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { LearningService } from "../../../learning/services/learning.service";
import { CreateservicesService } from "../../services/createservices.service";
import { TeacherDialogComponent } from "../teacher-dialog/teacher-dialog.component";
import { LoadingService } from "../../../../loader/loading/loading.service";
import { TeacherComponent } from "../../teacher/teacher.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditAllStudentComponent } from "../../all-student/edit-all-student/edit-all-student.component";
import { StudentDialogComponent } from "../student-dialog/student-dialog.component";
import { ErrorModule } from "src/app/views/pages/error/error.module";
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { startWith } from "rxjs/operators/startWith";
import { map } from "rxjs/operators/map";
import { ExceldownloadComponent } from "./exceldownload/exceldownload.component";
import { saveAs } from "file-saver";
import { log } from "console";

export class Student {
  constructor(public name: string, public _id: string, public className: string, public section: string, private http: HttpClient) { }
}
@Component({
  selector: "kt-student-filter",
  templateUrl: "./student-filter.component.html",
  styleUrls: ["./student-filter.component.scss"],
})
export class StudentFilterComponent {
  isGlobal: Boolean;
  searchText: any = "";
  filterData: any = {
    searchValue: this.searchText,
    filterKeysArray: ["name", "username"],
  };
  states: any;
  cities: any;
  classes: any;
  selectedState: any;
  displayedColumns: string[] = ["checkbox", "name", "phone", "gender", "class", "section", "school", "status", "action"];
  dataSource: any;
  resultsLength: any;
  totalStudents: any;
  schoolId: any;
  pageIndex: any;
  pageSize: any;
  filters: any;
  data: any;
  pdata: any;

  // #AutoComplete
  options: Student[] = [];

  searchCtrl: FormControl;
  filteredItems: Observable<any[]>;

  checkedStudents: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("TABLE") table: ElementRef;
  constructor(private dialog: MatDialog, private api: CreateservicesService, private api2: LearningService, private loading: LoadingService, private modalService: NgbModal) {
    // #AutoComplete
    this.searchCtrl = new FormControl();
    this.filteredItems = this.searchCtrl.valueChanges.pipe(
      // startWith(''),
      map((state) => (state ? this.filterStates(state) : this.options.slice()))
    );

    localStorage.getItem("schoolId") ? (this.isGlobal = false) : (this.isGlobal = true);
    this.schoolId = localStorage.getItem("schoolId");
    this.getStates();
    this.schoolId ? this.getStats() : "";
  }

  ngAfterViewInit() {
    if (this.isGlobal) {
      // To Get Count
      this.api.getGlobalStudentCountPostFilter(this.filterData).subscribe((res: any) => {
        this.resultsLength = res.body.result;
        this.totalStudents = res.body.result;
        console.log(this.resultsLength);
      });
      // To Get Teachers
      this.api.getGlobalStudentPaginationPostFilter(1, 5, this.filterData).subscribe((resp: any) => {
        this.dataSource = new MatTableDataSource(resp.body.data);
        this.dataSource.paginator = this.paginator;
      });

      // Get Total count of students all over
      this.api.getStudentCount().subscribe((response: any) => {
        this.resultsLength = response.body.count;
      });
    } else {
      this.filterData.school_id = this.schoolId;
      // To Get Count
      this.api.getStudentRecordCountPostFilter(this.schoolId, this.filterData).subscribe((res: any) => {
        this.resultsLength = res.body.count;
        this.totalStudents = res.body.count;
        console.log("Student Count", this.resultsLength);
      });
      // To Get Teachers
      this.api.getallstudentPostFilter(this.schoolId, 1, 5, this.filterData).subscribe((resp: any) => {
        this.dataSource = new MatTableDataSource(resp.body.data);
        this.dataSource.paginator = this.paginator;
        console.log("School Data", resp.body.data);
      });
      this.api.getStudentCount(localStorage.getItem("schoolId")).subscribe((response: any) => {
        this.loading.hide();
        this.resultsLength = response.body.count;
      });
    }
  }

  // #AutoComplete
  filterStates(name: string) {
    return this.options.filter((state) => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onEnter(evt: any) {
    this.loading.show();
    console.log(evt.source.value._id);
    this.api.searchbyId(evt.source.value._id).subscribe((res: any) => {
      this.dataSource = res.body.data;
      this.dataSource.paginator = this.paginator;
      this.resultsLength = 1;
      this.loading.hide();
    });
  }

  displayFn(item: any): {} {
    console.log(item);
    return item && item.name;
  }

  onPageFired(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    console.log("Page Fired", event.pageIndex + 1, event.pageSize);
    this.getStudents(event.pageIndex + 1, event.pageSize);
  }

  getStudents(pageIndex: number, pageSize: number) {
    this.loading.show();
    if (this.isGlobal) {
      this.api.getGlobalStudentPaginationPostFilter(pageIndex, pageSize, this.filterData).subscribe(
        (resp: any) => {
          this.loading.hide();
          this.dataSource = resp.body.data;
          // Get Total count of students all over
          this.api.getStudentCount().subscribe((response: any) => {
            this.resultsLength = response.body.count;
          });
          this.dataSource.paginator = this.paginator;
          // this.resultsLength =
        },
        (err: any) => {
          this.loading.hide();
        }
      );
    } else {
      this.filterData.school_id = this.schoolId;
      this.api.getallstudentPostFilter(this.schoolId, pageIndex, pageSize, this.filterData).subscribe(
        (resp: any) => {
          this.loading.hide();
          this.dataSource = resp.body.data;
          this.loading.show();
          this.api.getStudentCount(localStorage.getItem("schoolId")).subscribe((response: any) => {
            this.loading.hide();
            this.totalStudents = response.body.count;
            this.resultsLength = response.body.count;
          });
          this.dataSource.paginator = this.paginator;
        },
        (err: any) => {
          this.loading.hide();
        }
      );
    }
  }

  applyFilter(pageIndex: number, pageSize: number) {
    this.loading.show();
    this.filterData.searchValue = this.searchText;
    if (this.isGlobal) {
      this.api.getGlobalStudentCountPostFilter(this.filterData).subscribe(
        (res: any) => {
          this.loading.hide();
          // Get Total count of students all over
          this.api.getStudentCount().subscribe((response: any) => {
            this.resultsLength = response.body.count;
            this.totalStudents = response.body.count;
          });
          console.log("Result Length", this.resultsLength);
          if (res) {
            this.api.getGlobalStudentPaginationPostFilter(pageIndex, pageSize, this.filterData).subscribe((resp: any) => {
              this.dataSource = resp.body.data;
              this.dataSource.paginator = this.paginator;
              this.api.getStudentCount(localStorage.getItem("schoolId")).subscribe((response: any) => {
                this.loading.hide();
                this.resultsLength = response.body.count;
              });
            });
          }
        },
        (err: any) => {
          this.loading.hide();
        }
      );
    } else {
      this.filterData.filterKeysArray = ["name"];
      this.filterData.school_id = this.schoolId;
      this.api.getStudentRecordCountPostFilter(this.schoolId, this.filterData).subscribe(
        (res: any) => {
          this.loading.hide();
          this.resultsLength = res.body.count;
          this.totalStudents = res.body.count;
          console.log("Result Length", this.resultsLength);
          if (res) {
            this.api.getallstudentPostFilter(this.schoolId, 1, 5, this.filterData).subscribe((resp: any) => {
              this.dataSource = new MatTableDataSource(resp.body.data);
              this.dataSource.paginator = this.paginator;
              console.log("School Data", resp.body.data);
            });
          }
        },
        (err: any) => {
          this.loading.hide();
        }
      );
    }
  }

  search(pageIndex, pageSize) {
    this.options = [];
    if (this.searchText.length >= 4) {
      let data: any = {
        searchVal: this.searchText.toString(),
        // filterKeysArray: [
        //   'name'
        // ],
        page: Number(pageIndex),
        limit: Number(pageSize),
      };
      if (!this.isGlobal) {
        data.school_id = localStorage.getItem("schoolId");
      }
      this.api.searchStudents(data).subscribe(
        (response: any) => {
          if (response) {
            this.options = response.body.data.map((item: any) => {
              return {
                name: item.name,
                className: item.className,
                section: item.section ? item.section : "",
                _id: item._id,
              };
            });
            console.log(this.options);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else if (this.searchText.length == 0) {
      this.getStudents(1, 5);
    }
  }

  openDialog(element?: any) {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      hasBackdrop: true,
      data: {
        filters: this.filters,
        states: this.states,
        cities: this.cities,
      },
      width: "800px",
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log("Result", result);
      if (result) {
        this.filterData = await result.data;
        this.filters = await result.filters;
        this.cities = await result.cities;
        this.applyFilter(1, 5);
      }
    });
  }

  deactivateAccount(user: any) {
    let status = user.activeStatus ? false : true;
    let data = {
      activeStatus: status,
    };
    this.api.changeActiveDeactiveStatusAllUser(user._id, data).subscribe((res) => {
      console.log(res);
      this.getStudents(this.pageIndex, this.pageSize);
    });
  }

  edit(user: any) {
    const modalRef = this.modalService.open(EditAllStudentComponent, { size: "xl", backdrop: "static" });
    modalRef.componentInstance.students = user;
    modalRef.result.then(
      (result) => {
        if (result === "success") {
          this.getStudents(this.pageIndex, this.pageSize);
        }
        // Refresh data in table grid
      },
      (reason) => { }
    );
  }

  deleteUser(user: any) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "500px",
      height: "200px",
      data: {
        message: ` Do you want to Delete ${user.name}`,
        hasAction: true,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res.action);
      if (res.action) {
        let data = {
          userId: user._id,
          isGlobal: false,
          isStudent: true,
          repositoryId: this.isGlobal ? user.school_id._id : this.schoolId,
        };
        this.api.deleteUser(data).subscribe(
          (res: any) => {
            if ((res.status = 200)) {
              this.getStudents(this.pageIndex, this.pageSize);
            }
          },
          (err: any) => {
            let dialogRef = this.dialog.open(DeleteDialogComponent, {
              width: "500px",
              height: "200px",
              data: {
                message: `${err.error.message}`,
                hasAction: false,
              },
            });
          }
        );
      }
    });
  }

  clearText() {
    this.searchText = "";
    this.applyFilter(1, 5);
  }

  clearFilters() {
    this.filters = null;
    this.filterData = {
      searchValue: this.searchText,
      filterKeysArray: ["name", "username"],
    };
    this.pageIndex = 1;
    this.pageSize = 5;
    this.getStudents(1, 5);
  }

  getStates() {
    this.api.getStates().subscribe((res: any) => {
      this.states = res.body.data;
    });
  }

  getStats() {
    this.api.getStats(this.schoolId).subscribe(
      (res: any) => {
        this.data = res.body.data.student;
        this.pdata = res.body.data.parent;
        console.log("Stats", this.data);
        this.populateCharts();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  populateCharts() {
    console.log(this.data.bloodGroup);

    // Blood Group
    let labels = this.data.bloodGroup.map((e) => e.name.toString() + " " + e.count.toString());
    let data = this.data.bloodGroup.map((ele) => ele.count);
    const canvas = document.getElementById("blood-data-chart");
    const dataChart = new Chart(canvas, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Mode of Transportation
    let motLabels = this.data.modeOfTransp.map((e) => e.name.toString() + " " + e.count.toString());
    let motData = this.data.modeOfTransp.map((e) => e.count);
    const motCanvas = document.getElementById("motCanvas");
    const motChart = new Chart(motCanvas, {
      type: "bar",
      data: {
        labels: motLabels,
        datasets: [
          {
            label: "Mode of Transportation",
            data: motData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    let mtLables = this.data.motherTongue.map((e) => e.name.toString() + " " + e.count.toString());
    let mtData = this.data.motherTongue.map((e) => e.count);
    const mtCanvas = document.getElementById("mtCanvas");
    const mtChart = new Chart(mtCanvas, {
      type: "bar",
      data: {
        labels: mtLables,
        datasets: [
          {
            label: "Mother Tongue",
            data: mtData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)", "rgb(0, 172, 115)", "rgb(227, 227, 227)", "rgb(137, 171, 165)", "rgb(42, 136, 163)", "rgb(211, 0, 2)", "rgb(37, 38, 39)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    let medLabels = this.data.medicalCond.map((e) => e.name.toString() + " " + e.count.toString());
    let medData = this.data.medicalCond.map((e) => e.count);
    const medCanvas = document.getElementById("medCanvas");
    const medChart = new Chart(medCanvas, {
      type: "pie",
      data: {
        labels: medLabels,
        datasets: [
          {
            data: medData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(0, 172, 115)", "rgb(227, 227, 227)", "rgb(137, 171, 165)", "rgb(42, 136, 163)", "rgb(211, 0, 2)", "rgb(37, 38, 39)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        showAllTooltips: true,
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Wear Glasses
    let wgLabels = this.data.wearGlasses.map((e) => e.name.toString() + " " + e.count.toString());
    let wgdData = this.data.wearGlasses.map((e) => e.count);
    const wgCanvas = document.getElementById("wgCanvas");
    const wgChart = new Chart(wgCanvas, {
      type: "pie",
      data: {
        labels: wgLabels,
        datasets: [
          {
            data: wgdData,
            backgroundColor: ["rgb(55, 136, 246)", "rgb(112, 196, 243)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Gender
    let gLables = this.data.gender.map((e) => e.name.toString() + " " + e.count.toString());
    let gData = this.data.gender.map((e) => e.count);
    const gCanvas = document.getElementById("gCanvas");
    const gChart = new Chart(gCanvas, {
      type: "pie",
      data: {
        labels: gLables,
        datasets: [
          {
            data: gData,
            backgroundColor: ["rgb(55, 136, 246)", "rgb(112, 196, 243)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Parent

    // Language proficiency
    let langLables = this.pdata.Language_proficiency.map((e) => e.name.toString() + " " + e.count.toString());
    let langData = this.pdata.Language_proficiency.map((e) => e.count);
    const langCanvas = document.getElementById("langCanvas");
    const langChart = new Chart(langCanvas, {
      type: "bar",
      data: {
        labels: langLables,
        datasets: [
          {
            label: "Language proficiency",
            data: langData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)", "rgb(0, 172, 115)", "rgb(227, 227, 227)", "rgb(137, 171, 165)", "rgb(42, 136, 163)", "rgb(211, 0, 2)", "rgb(37, 38, 39)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Occupation
    let occupLables = this.pdata.occupation.map((e) => e.name.toString() + " " + e.count.toString());
    let occupData = this.pdata.occupation.map((e) => e.count);
    const occupCanvas = document.getElementById("occupCanvas");
    const occupChart = new Chart(occupCanvas, {
      type: "bar",
      data: {
        labels: occupLables,
        datasets: [
          {
            label: "Occupation",
            data: occupData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)", "rgb(0, 172, 115)", "rgb(227, 227, 227)", "rgb(137, 171, 165)", "rgb(42, 136, 163)", "rgb(211, 0, 2)", "rgb(37, 38, 39)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Qualification
    let qualLables = this.pdata.qualification.map((e) => e.name.toString() + " " + e.count.toString());
    let qualData = this.pdata.qualification.map((e) => e.count);
    const qualCanvas = document.getElementById("qualCanvas");
    const qualChart = new Chart(qualCanvas, {
      type: "bar",
      data: {
        labels: qualLables,
        datasets: [
          {
            label: "Qualification",
            data: qualData,
            backgroundColor: ["rgb(255, 0, 84)", "rgb(238, 48, 0)", "rgb(0, 135, 141)", "rgb(0, 168, 150)", "rgb(184, 214, 234)", "rgb(121, 158, 178)", "rgb(0, 172, 115)", "rgb(227, 227, 227)", "rgb(137, 171, 165)", "rgb(42, 136, 163)", "rgb(211, 0, 2)", "rgb(37, 38, 39)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  openDialogforStudentsDownload() {
    if (this.resultsLength !== 0) {
      this.pageSize > this.resultsLength ? (this.pageSize = this.resultsLength) : null;
      const dialogRef = this.dialog.open(ExceldownloadComponent, {
        data: {
          current: this.pageSize ? this.pageSize : 5,
          all: this.resultsLength,
        },
        hasBackdrop: true,
        width: "450px",
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log(result);
        if (result === "all") {
          this.api.getStudentDownload({ schoolId: localStorage.getItem("schoolId") }).subscribe(async (response: any) => {
            let blob = await new Blob([new Uint8Array(response.body.data)]);
            await saveAs(blob, `Students.xlsx`);
          });
        } else if (result === "current") {
          this.ExportTOExcel();
        }
      });
    } else {
      Swal.fire("No Students", "No students found.");
    }
  }

  ExportTOExcel() {
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    let wsjson: any = XLSX.utils.sheet_to_json(ws);
    wsjson = wsjson.map((item) => {
      delete item.Status;
      delete item.Action;
      return item;
    });
    ws = XLSX.utils.json_to_sheet(wsjson);
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Students.xlsx`);
  }

  toggleCheckbox(studentId: string, checked: boolean) {
    if (checked) {
      // Add the student ID to the array
      this.checkedStudents.push(studentId);
    } else {
      // Remove the student ID from the array
      const index = this.checkedStudents.indexOf(studentId);
      if (index !== -1) {
        this.checkedStudents.splice(index, 1);
      }
    }
    console.log(this.checkedStudents);
  }

  isStudentsChecked(studentId: string) {
    return this.checkedStudents.includes(studentId);
  }

  deleteStudents() {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "500px",
      height: "200px",
      data: {
        message: ` Do you want to Delete ${this.checkedStudents.length} students`,
        hasAction: true,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.action) {
        this.api.deleteStudents({ studentIds: this.checkedStudents }).subscribe(async (response: any) => {
          if (response.status === 200) {
            if (response.body.data) {
              await Swal.fire("success", `Students Deleted ${response.body.data.deletedStudents.length} Students not deleted ${response.body.data.unDeletedStudents.length}`);
              this.getStudents(this.pageIndex, this.pageSize);
            }
          }
        }, (err: any) => {
          let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: "500px",
            height: "200px",
            data: {
              message: `${err.error.message}`,
              hasAction: false,
            },
          });
        });
        this.checkedStudents.splice(0, this.checkedStudents.length)
      }
    });
  }
}
