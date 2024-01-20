import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LearningService } from '../../../learning/services/learning.service';
import { DialogComponent } from '../../payments/dialog/dialog.component';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeacherDialogComponent implements OnInit {

  isGlobal: Boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private api: CreateservicesService, private api2: LearningService, private dialog: MatDialog) {
    localStorage.getItem('schoolId') ? this.isGlobal = false : this.isGlobal = true
    this.schoolId = localStorage.getItem('schoolId')
    if (data.filters) {
      this.applyFilters(data.filters)
    }
    this.getSchools()

  }
  filterData: any = {
    searchValue: '',
    filterKeysArray: ['name', 'username'],
    flag: "teacher",
    designation: "teacher",
  }
  displayedColumns: string[] = ['name', 'phone', 'gender', 'school'];
  dataSource: any;
  resultsLength: any;
  schoolId: any;

  states: any;
  cities: any;
  qualification: Array<string> = [
    'Not Educated',
    'Primary',
    'High School',
    '10th',
    '12th',
    'BA',
    'HAFIZ',
    'AALIM',
    'BCOM',
    'BBM',
    'BSc',
    'BBA',
    'BHM',
    'BCA',
    'BE',
    'BPharma',
    'MBBS',
    'BUMS',
    'BAMS',
    'MCOM',
    'MCA',
    'ME',
    'MS',
    'MBA',
    'PhD',
    'others'
  ];
  religions: Array<string> = [
    'Hinduism',
    'Islam',
    'Christianity',
    'Sikhism',
    'Buddhism',
    'Jainism',
    'Zoroastrianism',
    'Others',
  ];
  classes: any;
  schools: any;

  selectedGender: any;
  selectedState: any;
  selectedCity: any;
  selectedBloodgroup: any;
  selectedMarital: any;
  selectedQualification: any;
  selectedSSLC: any;
  selected12: any;
  selectedgraduation: any;
  selectedmaster: any;
  selectedReligion: any;
  selectedClass: any;
  selectedExperience: any;
  selectedAge: any;
  selectedSchool: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getClasses()
    console.log(this.data)
    this.states = this.data.states
    this.cities = this.data.cities
  }
  ngAfterViewInit() {

  }

  filter = async () => {

    // Gender 
    this.filterData['gender'] ? delete this.filterData['gender'] : '';
    this.filterData['gender'] = await this.selectedGender;
    if (this.filterData.gender == null) {
      delete this.filterData['gender']
    }
    // State
    this.filterData['state'] ? delete this.filterData['state'] : '';
    this.filterData['state'] = await this.selectedState;
    if (this.filterData.state == null) {
      delete this.filterData['state']
    }
    // City
    this.filterData['city'] ? delete this.filterData['city'] : '';
    this.filterData['city'] = await this.selectedCity;
    if (this.filterData.city == null) {
      delete this.filterData['city']
    }
    // Experience
    this.filterData['experience'] ? delete this.filterData['experience'] : '';
    this.filterData['experience'] = await this.selectedExperience
    if (this.filterData.experience == null) {
      delete this.filterData['experience']
    }
    // Age Group
    this.filterData['age'] ? delete this.filterData['age'] : '';
    this.filterData.age = await this.selectedAge
    if (this.filterData.age == null) {
      delete this.filterData['age']
    }
    // Blood Group
    this.filterData['blood_gr'] ? delete this.filterData['blood_gr'] : '';
    this.filterData['blood_gr'] = await this.selectedBloodgroup;
    if (this.filterData.blood_gr == null) {
      delete this.filterData['blood_gr']
    }
    // Primary Class
    this.filterData['primary_class'] ? delete this.filterData['primary_class'] : '';
    this.filterData['primary_class'] = await this.selectedClass;
    if (this.filterData.primary_class == null) {
      delete this.filterData['primary_class']
    }
    // Martial Status
    this.filterData['marital_status'] ? delete this.filterData['marital_status'] : '';
    this.filterData['marital_status'] = await this.selectedMarital;
    if (this.filterData.marital_status == null) {
      delete this.filterData['marital_status']
    }
    // Qualification
    this.filterData['qualification'] ? delete this.filterData['qualification'] : '';
    this.filterData['qualification'] = await this.selectedQualification;
    if (this.filterData.qualification == null) {
      delete this.filterData['qualification']
    }
    // 10th
    this.filterData['ten_details'] ? delete this.filterData['ten_details'] : '';
    this.filterData['ten_details'] = await this.selectedSSLC;
    if (this.filterData.ten_details == null) {
      delete this.filterData['ten_details']
    }
    // 12th
    this.filterData['twelve_details'] ? delete this.filterData['twelve_details'] : '';
    this.filterData['twelve_details'] = await this.selected12;
    if (this.filterData.twelve_details == null) {
      delete this.filterData['twelve_details']
    }
    // Graduation
    this.filterData['graduation_details'] ? delete this.filterData['graduation_details'] : '';
    this.filterData['graduation_details'] = await this.selected12;
    if (this.filterData.graduation_details == null) {
      delete this.filterData['graduation_details']
    }
    // Masters
    this.filterData['masters_details'] ? delete this.filterData['masters_details'] : '';
    this.filterData['masters_details'] = await this.selected12;
    if (this.filterData.masters_details == null) {
      delete this.filterData['masters_details']
    }
    // Qualification
    this.filterData['religion'] ? delete this.filterData['religion'] : '';
    this.filterData['religion'] = await this.selectedReligion;
    if (this.filterData.religion == null) {
      delete this.filterData['religion']
    }
    // School
    this.filterData['school_id'] ? delete this.filterData['school_id'] : '';
    this.filterData['school_id'] = await this.selectedSchool;
    if (this.filterData.school_id == null) {
      delete this.filterData['school_id']
    }

    // Assigning Filter
    this.data = this.filterData
    console.log('Filter', this.data)
    let selectedFilters = {
      selectedGender: this.selectedGender,
      selectedState: this.selectedState,
      selectedCity: this.selectedCity,
      selectedBloodgroup: this.selectedBloodgroup,
      selectedMarital: this.selectedMarital,
      selectedQualification: this.selectedQualification,
      selectedSSLC: this.selectedSSLC,
      selected12: this.selected12,
      selectedgraduation: this.selectedgraduation,
      selectedmaster: this.selectedmaster,
      selectedReligion: this.selectedReligion,
      selectedClass: this.selectedClass,
      selectedExperience: this.selectedExperience,
      selectedAge: this.selectedAge,
      selectedSchool: this.selectedSchool,

    }
    this.dialogRef.close({ data: this.data, filters: selectedFilters, cities: this.cities })
  }



  getClasses() {
    if (this.schoolId) {
      this.api.getSchool(this.schoolId).subscribe((res: any) => {
        this.classes = res.body.data[0].classList
        console.log(this.classes)
      })
    } else {
      this.api.getGobalClasses().subscribe((res: any) => {
        this.classes = res.body.data
        console.log('Classes', this.classes)
      })
    }
  }

  getSchools() {
    this.api.getallinstitute().subscribe((res: any) => {
      this.schools = res.body.data;
      console.log(this.schools)
    })
  }

  applyFilters(filters: any) {
    filters.selectedGender ? this.selectedGender = filters.selectedGender : ''
    filters.selectedState ? this.selectedState = filters.selectedState : ''
    filters.selectedCity ? this.selectedCity = filters.selectedCity : ''
    filters.selectedBloodgroup ? this.selectedBloodgroup = filters.selectedBloodgroup : ''
    filters.selectedMarital ? this.selectedMarital = filters.selectedMarital : ''
    filters.selectedQualification ? this.selectedQualification = filters.selectedQualification : ''
    filters.selectedSSLC ? this.selectedSSLC = filters.selectedSSLC : ''
    filters.selected12 ? this.selected12 = filters.selected12 : ''
    filters.selectedgraduation ? this.selectedgraduation = filters.selectedgraduation : ''
    filters.selectedmaster ? this.selectedmaster = filters.selectedmaster : ''
    filters.selectedReligion ? this.selectedReligion = filters.selectedReligion : ''
    filters.selectedClass ? this.selectedClass = filters.selectedClass : ''
    filters.selectedExperience ? this.selectedExperience = filters.selectedExperience : ''
    filters.selectedAge ? this.selectedAge = filters.selectedAge : ''
    filters.selectedSchool ? this.selectedSchool = filters.selectedSchool : ''
  }

  stateSelected() {
    this.api.getCitybyId(this.selectedState).subscribe((res: any) => {
      console.log(res)
      this.cities = res.body.data
    })
  }
}
