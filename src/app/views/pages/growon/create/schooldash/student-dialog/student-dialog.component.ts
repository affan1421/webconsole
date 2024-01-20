import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { LearningService } from '../../../learning/services/learning.service';
import { DialogComponent } from '../../payments/dialog/dialog.component';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {
  isGlobal: Boolean;

  filterData: any = {
    searchValue: '',
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
  sections: any;

  schools: any;
  transportationMode: Array<string> = ['Parent', 'Private Auto', 'Private Bus', 'By Walk', 'By Cycle'];
  medicalConditions: Array<string> = ['None', 'Asthma', 'Allergies', 'Diabetes', 'Epilepsy', 'Heart Disease', 'Ophthalmic Defect', 'Auditory defect', 'hearing loss', 'Differently Able'];

  selectedGender: any;
  selectedState: any;
  selectedCity: any;
  selectedtransportation: any;
  selectedBloodgroup: any;
  selectedMedical: any;
  selectedGlasses: any;
  selectedReligion: any;

  selectedSchool: any;
  selectedClass: any;
  selectedSection: any;
  selectedRTE: any;

  hasParent: any;
  selectedFatherQualification: any;
  selectedMotherQualification: any;
  selectedGuardianQualification: any;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private api: CreateservicesService, private api2: LearningService, private dialog: MatDialog) {
    localStorage.getItem('schoolId') ? this.isGlobal = false : this.isGlobal = true
    this.schoolId = localStorage.getItem('schoolId')
    this.getSchools()
    this.states = data.states
    this.cities = data.cities
    if (data.filters) {
      this.applyFilters(data.filters)
    }
  }
  ngOnInit() {
    this.getClasses()
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
    this.filterData['state_id'] ? delete this.filterData['state_id'] : '';
    this.filterData['state_id'] = await this.selectedState;
    if (this.filterData.state_id == null) {
      delete this.filterData['state_id']
    }
    // City
    this.filterData['city_id'] ? delete this.filterData['city_id'] : '';
    this.filterData['city_id'] = await this.selectedCity;
    if (this.filterData.city_id == null) {
      delete this.filterData['city_id']
    }
    // rte_student
    this.filterData['rte_student'] ? delete this.filterData['rte_student'] : '';
    this.filterData['rte_student'] = await this.selectedRTE
    if (this.filterData.rte_student == null) {
      delete this.filterData['rte_student']
    }
    // mode_of_transp
    this.filterData['mode_of_transp'] ? delete this.filterData['mode_of_transp'] : '';
    this.filterData.mode_of_transp = await this.selectedtransportation
    if (this.filterData.mode_of_transp == null) {
      delete this.filterData['mode_of_transp']
    }
    // Blood Group
    this.filterData['blood_gr'] ? delete this.filterData['blood_gr'] : '';
    this.filterData['blood_gr'] = await this.selectedBloodgroup;
    if (this.filterData.blood_gr == null) {
      delete this.filterData['blood_gr']
    }
    // Class
    this.filterData['class'] ? delete this.filterData['class'] : '';
    this.filterData['class'] = await this.selectedClass;
    if (this.filterData.class == null) {
      delete this.filterData['class']
    }
    // Section
    this.filterData['section'] ? delete this.filterData['section'] : '';
    this.filterData['section'] = await this.selectedSection;
    if (this.filterData.section == null) {
      delete this.filterData['section']
    }
    // Medical Condition
    this.filterData['medical_cond'] ? delete this.filterData['medical_cond'] : '';
    this.filterData['medical_cond'] = await this.selectedMedical;
    if (this.filterData.medical_cond == null) {
      delete this.filterData['medical_cond']
    }
    // Child Wear Glasses
    this.filterData['wear_glasses'] ? delete this.filterData['wear_glasses'] : '';
    this.filterData['wear_glasses'] = await this.selectedGlasses;
    if (this.filterData.wear_glasses == null) {
      delete this.filterData['wear_glasses']
    }
    // Father Qualification
    this.filterData['father_qualification'] ? delete this.filterData['father_qualification'] : '';
    this.filterData['father_qualification'] = await this.selectedFatherQualification;
    if (this.filterData.father_qualification == null) {
      delete this.filterData['father_qualification']
    }
    // Mother Qualification
    this.filterData['mother_qualification'] ? delete this.filterData['mother_qualification'] : '';
    this.filterData['mother_qualification'] = await this.selectedMotherQualification;
    if (this.filterData.mother_qualification == null) {
      delete this.filterData['mother_qualification']
    }
    // Guardian Qualification
    this.filterData['guardian_qualification'] ? delete this.filterData['guardian_qualification'] : '';
    this.filterData['guardian_qualification'] = await this.selectedGuardianQualification;
    if (this.filterData.guardian_qualification == null) {
      delete this.filterData['guardian_qualification']
    }
    // Religion
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
    let selectedFilters = {
      selectedGender: this.selectedGender,
      selectedState: this.selectedState,
      selectedCity: this.selectedCity,
      selectedtransportation: this.selectedtransportation,
      selectedBloodgroup: this.selectedBloodgroup,
      selectedMedical: this.selectedMedical,
      selectedGlasses: this.selectedGlasses,
      selectedReligion: this.selectedReligion,

      selectedSchool: this.selectedSchool,
      selectedClass: this.selectedClass,
      selectedSection: this.selectedSection,
      selectedRTE: this.selectedRTE,

      hasParent: this.hasParent,
      selectedFatherQualification: this.selectedFatherQualification,
      selectedMotherQualification: this.selectedMotherQualification,
      selectedGuardianQualification: this.selectedGuardianQualification,
    }

    this.data = this.filterData
    this.dialogRef.close({ data: this.data, filters: selectedFilters, cities: this.cities })
  }

  stateSelected() {
    console.log('State', this.selectedState)
    this.api.getCitybyId(this.selectedState).subscribe((res: any) => {
      console.log(res)
      this.cities = res.body.data
    })
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

  hasParentchanged() {
    console.log(this.hasParent)
    if (this.hasParent === 'yes') {
      this.selectedGuardianQualification = null
      delete this.filterData['guardian_qualification']
    } else {
      this.selectedFatherQualification = null
      this.selectedMotherQualification = null
      delete this.filterData['mother_qualification']
      delete this.filterData['father_qualification']
    }
  }

  applyFilters(filters: any) {
    filters.selectedGender ? this.selectedGender = filters.selectedGender : ''
    filters.selectedState ? this.selectedState = filters.selectedState : ''
    filters.selectedCity ? this.selectedCity = filters.selectedCity : ''
    filters.selectedtransportation ? this.selectedtransportation = filters.selectedtransportation : ''
    filters.selectedBloodgroup ? this.selectedBloodgroup = filters.selectedBloodgroup : ''
    filters.selectedMedical ? this.selectedMedical = filters.selectedMedical : ''
    filters.selectedGlasses ? this.selectedGlasses = filters.selectedGlasses : ''
    filters.selectedReligion ? this.selectedReligion = filters.selectedReligion : ''
    filters.selectedSchool ? this.selectedSchool = filters.selectedSchool : ''
    filters.selectedClass ? this.selectedClass = filters.selectedClass : ''
    filters.selectedSection ? this.selectedSection = filters.selectedSection : ''
    filters.selectedRTE ? this.selectedRTE = filters.selectedRTE : ''

    // filters.hasParent ? this.hasParent = filters.this.hasParent : ''
    filters.selectedFatherQualification ? this.selectedFatherQualification = filters.selectedFatherQualification : ''
    filters.selectedMotherQualification ? this.selectedMotherQualification = filters.selectedMotherQualification : ''
    filters.selectedGuardianQualification ? this.selectedGuardianQualification = filters.selectedGuardianQualification : ''
    console.log('Filters', filters)
  }

  classSelected() {
    if (this.schoolId) {
      this.api.getSections(this.selectedClass).subscribe((res: any) => {
        this.sections = res.body.data
      })
    }
  }
}
