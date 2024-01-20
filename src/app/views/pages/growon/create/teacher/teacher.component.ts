import { value } from './../../../../../global.model';
// Angular
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, filter } from 'rxjs/operators';
// AWS
import { environment } from '../../../../../../environments/environment';
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { defaultRoles } from '../../roles-permission/default-roles';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../../roles-permission/services/roles.service';
import { LoadingService } from '../../../loader/loading/loading.service';

@Component({
  selector: 'kt-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  @Input() teacherUpdate;
  @Input() updateFlag;
  test: any;
  teacherForm: FormGroup;
  gender: Array<string> = ['Male', 'Female'];
  authorized: string[] = ['Yes', 'No'];
  isAuthorized: any = false;

  // Message
  mauthorized: string[] = ['Yes', 'No'];
  misAuthorized: any = false;

  teachingLevels: Array<string> = ['Pre-primary school', 'primary school', 'middle school', 'high school', 'college', 'graduation', 'masters'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  yearOfPassing: Array<any> = [];
  schools: Array<any> = [];
  cvDoc: any;
  tenthDoc: any;
  twelveDoc: any;
  gradDoc: any;
  masterDoc: any;
  otherDoc: any;
  otherDegrees: Array<any> = [];
  certifications: Array<any> = [];
  extraCurricularAchievements: Array<any> = [];
  randomPass: any = Math.random().toString(36).slice(-12);
  cities: Array<any> = ['Bangalore'];
  states: Array<any> = ['karnataka'];
  branches: Array<any> = [];
  countries: Array<any>;
  syllabus: Array<any>;
  subjects: Array<any>;
  classes: Array<any>;
  class: Array<any> = [];
  sections: Array<any>;
  secondarySection1: Array<any>;
  secondarySection2: Array<any>;
  secondarySection3: Array<any>;
  secondarySection4: Array<any>;
  secondarySection5: Array<any>;
  profilePicture: any;
  filePreview: any;
  secondaryClasses: any = [];
  userExistFlag: boolean = false;
  schoolId: any;
  classLength: any;
  pipeRefreshCounter: number;
  qualification: string[] = [];
  experiences: FormArray;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiService: CreateservicesService,
    private roleService: RolesService,
    @Optional() private activeModal: NgbActiveModal,
    private loaderService: LoadingService,
  ) {
    this.apiService.getQualification().subscribe((res: any) => {
      this.qualification = res.body.data.userQualifications
      this.qualification.forEach((item: any, index: number) => {
        if (item = '') {
          delete this.qualification[index]
        }
      })
      console.log(res.body.data.userQualifications)
    })
  }

  async ngOnInit() {
    console.log(this.teacherUpdate)
    this.teacherForm = this._formBuilder.group({
      name: [, [Validators.required, Validators.maxLength(50)]],
      role: ['teacher'],
      contact: [, [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      password: [this.randomPass, Validators.required],
      gender: [, Validators.required],
      authorized: [],
      mauthorized: [],
      dob: [''],
      branch: [''],
      primaryClass: [''],
      section: [''],
      secondaryClass: this._formBuilder.array([
        this.addSecondaryClassFormGroup()
      ]),
      subject: [''],
      qualification: ['',],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: ['', Validators.maxLength(150)],
      aadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      bloodGroup: [''],
      religion: [''],
      caste: [''],
      city: [''],
      state: [''],
      country: [''],
      pinCode: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      motherTongue: [''],
      maritalStatus: [''],
      teachingExperience: [''],
      teachingLevels: [''],
      cv: [''],
      // PFI AND ESI NUMBER
      esi_number: [''],
      pf_number: [''],
      // 10th Details
      tenthSchool: [''],
      tenthBoard: [''],
      tenthPercentage: [''],
      tenthPassedYear: [''],
      // tenthDoc : ['',Validators.required],
      // twelve Details
      twelveSchool: [''],
      twelveBoard: [''],
      twelvePercentage: [''],
      twelvePassedYear: [''],
      // twelveDoc : ['',Validators.required],
      // Graduation Details
      gradSchool: [''],
      gradBoard: [''],
      gradPercentage: [''],
      gradPassedYear: [''],
      // gradDoc : ['',Validators.required],
      // Masters Details
      masterSchool: [''],
      masterBoard: [''],
      masterPercentage: [''],
      masterPassedYear: [''],

      // otherEducation Details
      otherEducationSchool: [''],
      otherEducationBoard: [''],
      otherEducationPercentage: [''],
      otherEducationPassedYear: [''],
      // experiences: [
      //   []
      // ],
      experience_list: new FormArray([])
    });

    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
    }
    await this.apiService.getSchools().subscribe((response: any) => {
      this.schools = response.body.data.schoolData;
    })
    //console.log(this.teacherForm)
    await this.getCountries();
    await this.getStates();
    await this.getCities();
    await this.getBranches();
    // this.getSyllabus();
    await this.getSubjects();
    await this.getClasses();
    await this.getallinstitutes();
    //this.getSections();
    if (this.updateFlag) {
      console.log('Rec Teacher', this.teacherUpdate)
      this.setUpdateTeacherValue()
      if (this.teacherForm.controls.experience_list.value.length == 0) {
        this.addItem()
      }
    } else {
      this.addItem()
    }
  }

  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;

  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;
    if (user.user_info[0].profile_type.role_name == 'school_admin' || user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'principal' || user.user_info[0].profile_type.role_name == 'management') {

      this.schoolId = localStorage.getItem('schoolId');
    } else if (localStorage.getItem('schoolId')) {
      this.schoolId = localStorage.getItem('schoolId');
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        this.schoolId = user.user_info[0]._id
      }
      // this.schoolId = user.user_info[0].id
    }
  }

  checkAlreadyExist(value) {
    this.loaderService.show();
    this.userExistFlag = false;
    if (value && (!this.updateFlag || this.teacherUpdate.mobile != value)) {
      let obj = {
        school_id: this.schoolId,
        mobile: value,
        type: 'teacher'
      }
      console.log(obj)
      this.apiService.checkUserExist(obj).subscribe(
        (response: any) => {
          if (response && response.body) {
            if (response.body.flag) {
              this.userExistFlag = true;
              this.loaderService.hide();
            }
            else {
              this.userExistFlag = false;
              this.loaderService.hide();
            }
          }
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide();
        }
      )
    } else {
      this.loaderService.hide();
    }
  }


  setUpdateTeacherValue() {
    console.log('this Teacher', this.teacherUpdate)
    this.teacherForm = this._formBuilder.group({
      name: [this.teacherUpdate.name, [Validators.required, Validators.maxLength(50)]],
      role: ['teacher'],
      contact: [this.teacherUpdate.mobile, [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      password: [this.teacherUpdate.password, Validators.required],
      gender: [this.teacherUpdate.gender, Validators.required],
      authorized: [this.teacherUpdate.authorized],
      mauthorized: [this.teacherUpdate.permissions.can_send_announcement_sms],
      dob: [this.teacherUpdate.dob != "" ? new Date(this.teacherUpdate.dob) : ""],
      branch: [this.teacherUpdate.branch_id ? this.teacherUpdate.branch_id._id : ''],
      primaryClass: [this.teacherUpdate.primary_class],
      section: [this.teacherUpdate.primary_section],
      subject: [this.teacherUpdate.subject != "" ? this.teacherUpdate.subject : ""],
      secondaryClass: this._formBuilder.array([]),
      // secondaryClass:[
      //  await this.teacherUpdate.secondary_class.forEach(element => {
      //     this.apiService.getSections(element.classId).subscribe((response: any) => {
      //      element['tempSection']=response.body.data;
      //       //console.log(secondaryClass.value)
      //     })
      //     this.teacherForm.get('secondaryClass').value.push(element);
      //   })
      // ],
      qualification: [this.teacherUpdate.qualification != "" ? this.teacherUpdate.qualification : ""],
      email: [this.teacherUpdate.email != "" ? this.teacherUpdate.email : "", [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: [this.teacherUpdate.address != "" ? this.teacherUpdate.address : "", Validators.maxLength(150)],
      aadhaarNo: [this.teacherUpdate.aadhar_card != "" ? this.teacherUpdate.aadhar_card : "", [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      bloodGroup: [this.teacherUpdate.blood_gr != "" ? this.teacherUpdate.blood_gr : ""],
      religion: [this.teacherUpdate.religion != "" ? this.teacherUpdate.religion : ""],
      caste: [this.teacherUpdate.caste != "" ? this.teacherUpdate.caste : ""],
      city: [this.teacherUpdate.city != "" ? this.teacherUpdate.city?._id : ""],
      state: [this.teacherUpdate.state != "" ? this.teacherUpdate.state?._id : ""],
      country: [this.teacherUpdate.country != "" ? this.teacherUpdate.country?._id : ""],
      pinCode: [this.teacherUpdate.pincode != "" ? this.teacherUpdate.pincode : "", [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      motherTongue: [this.teacherUpdate.mother_tounge != "" ? this.teacherUpdate.mother_tounge : ""],
      maritalStatus: [this.teacherUpdate.marital_status != "" ? this.teacherUpdate.marital_status : ""],
      teachingExperience: [this.teacherUpdate.experience != "" ? this.teacherUpdate.experience : ""],
      teachingLevels: [this.teacherUpdate.level != "" ? this.teacherUpdate.level : ""],
      cv: [this.teacherUpdate.cv !== '' ? this.teacherUpdate.cv : ''],
      // PFI AND ESI NUMBER
      esi_number: [this.teacherUpdate.esi_number != '' ? this.teacherUpdate.esi_number : ''],
      pf_number: [this.teacherUpdate.pf_number != '' ? this.teacherUpdate.pf_number : ''],
      // 10th Details
      tenthSchool: [this.teacherUpdate.ten_details ? this.teacherUpdate.ten_details.school : '' != "" ? this.teacherUpdate.ten_details.school : ""],
      tenthBoard: [this.teacherUpdate.ten_details ? this.teacherUpdate.ten_details.Board : '' != "" ? this.teacherUpdate.ten_details.Board : ""],
      tenthPercentage: [this.teacherUpdate.ten_details ? this.teacherUpdate.ten_details.percentage : '' != "" ? this.teacherUpdate.ten_details.percentage : ""],
      tenthPassedYear: [this.teacherUpdate.ten_details ? this.teacherUpdate.ten_details.year_of_passing : '' != "" ? this.teacherUpdate.ten_details.year_of_passing : ""],
      // tenthDoc : ['',Validators.required],
      // twelve Details
      twelveSchool: [this.teacherUpdate.twelve_details ? this.teacherUpdate.twelve_details.school : '' != "" ? this.teacherUpdate.twelve_details.school : ""],
      twelveBoard: [this.teacherUpdate.twelve_details ? this.teacherUpdate.twelve_details.Board : '' != "" ? this.teacherUpdate.twelve_details.Board : ""],
      twelvePercentage: [this.teacherUpdate.twelve_details ? this.teacherUpdate.twelve_details.percentage : '' != "" ? this.teacherUpdate.twelve_details.percentage : ""],
      twelvePassedYear: [this.teacherUpdate.twelve_details ? this.teacherUpdate.twelve_details.year_of_passing : '' != "" ? this.teacherUpdate.twelve_details.year_of_passing : ""],
      // twelveDoc : ['',Validators.required],
      // Graduation Details
      gradSchool: [this.teacherUpdate.graduation_details ? this.teacherUpdate.graduation_details.school : '' != "" ? this.teacherUpdate.graduation_details.school : ""],
      gradBoard: [this.teacherUpdate.graduation_details ? this.teacherUpdate.graduation_details.Board : '' != "" ? this.teacherUpdate.graduation_details.Board : ""],
      gradPercentage: [this.teacherUpdate.graduation_details ? this.teacherUpdate.graduation_details.percentage : '' != "" ? this.teacherUpdate.graduation_details.percentage : ""],
      gradPassedYear: [this.teacherUpdate.graduation_details ? this.teacherUpdate.graduation_details.year_of_passing : '' != "" ? this.teacherUpdate.graduation_details.year_of_passing : ""],
      // gradDoc : ['',Validators.required],
      // Masters Details
      masterSchool: [this.teacherUpdate.masters_details ? this.teacherUpdate.masters_details.school : '' != "" ? this.teacherUpdate.masters_details.school : ""],
      masterBoard: [this.teacherUpdate.masters_details ? this.teacherUpdate.masters_details.Board : '' != "" ? this.teacherUpdate.masters_details.Board : ""],
      masterPercentage: [this.teacherUpdate.masters_details ? this.teacherUpdate.masters_details.percentage : '' != "" ? this.teacherUpdate.masters_details.percentage : ""],
      masterPassedYear: [this.teacherUpdate.masters_details ? this.teacherUpdate.masters_details.year_of_passing : '' != "" ? this.teacherUpdate.masters_details.year_of_passing : ""],

      // Other Details
      otherEducationSchool: [this.teacherUpdate.other_education ? this.teacherUpdate.other_education.school : '' != "" ? this.teacherUpdate.other_education.school : ""],
      otherEducationBoard: [this.teacherUpdate.other_education ? this.teacherUpdate.other_education.Board : '' != "" ? this.teacherUpdate.other_education.Board : ""],
      otherEducationPercentage: [this.teacherUpdate.other_education ? this.teacherUpdate.other_education.percentage : '' != "" ? this.teacherUpdate.other_education.percentage : ""],
      otherEducationPassedYear: [this.teacherUpdate.other_education ? this.teacherUpdate.other_education.year_of_passing : '' != "" ? this.teacherUpdate.other_education.year_of_passing : ""],

      experience_list: new FormArray([])

    });
    this.teacherUpdate.experience_list?.forEach((item: any) => {
      this.addItem(item)
    })


    if (this.teacherForm.get('primaryClass').value) {
      this.getPrimarySections(this.teacherForm.get('primaryClass').value);
    }
    this.filePreview = this.teacherUpdate.profile_image;
    this.profilePicture = this.teacherUpdate.profile_image;
    if (this.teacherUpdate.secondary_class && this.teacherUpdate.secondary_class.length) {
      for (let i = 0; i < this.teacherUpdate.secondary_class.length; i++) {
        this.apiService.getSections(this.teacherUpdate.secondary_class[i].secondClasses).subscribe((response: any) => {
          (<FormArray>this.teacherForm.get('secondaryClass')).push(
            this._formBuilder.group({
              secondClasses: [this.teacherUpdate.secondary_class[i].secondClasses,],
              section: [this.teacherUpdate.secondary_class[i].section,],
              tempSection: [response.body.data,],
            }));
          console.log(this.teacherForm.value);
          this.cdr.detectChanges();
        })
      }
    }
    console.log(this.teacherForm.value)
    this.cdr.detectChanges();
  }



  addSecondaryClassFormGroup(): FormGroup {
    return this._formBuilder.group({
      secondClasses: ['',],
      section: ['',],
      tempSection: ['',],
    })
  }

  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
    })
  }

  getStates() {
    console.log('Event Triggered');

    // this.teacherForm.get('country').valueChanges.subscribe(val => {
    this.apiService.getStates().subscribe((response: any) => {
      // this.states = response.body.data
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.teacherForm.controls.country.value
      })
    })
    // })
  }

  getCities() {
    // this.teacherForm.get('state').valueChanges.subscribe(val => {
    this.apiService.getCities().subscribe((response: any) => {
      // this.cities = response.body.data
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.teacherForm.controls.state.value
      })
    })
    // })
  }

  getBranches() {
    this.apiService.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      //console.log(response.body.data)
      this.branches = response.body.data[0].branch;
      console.log('Branch', this.branches)
    })
  }

  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabus = response.body.data;
    })
  }

  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }

  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }

  getallinstitutes() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      this.schoolId = localStorage.getItem('schoolId');
    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.class = data.body.data[0].classList;
      this.classLength = this.class.length;
      //console.log(this.classLength)
      //console.log(this.class, "this.class")
      this.cdr.detectChanges();
    })
  }

  getPrimarySections(classId: string) {
    this.apiService.getSections(classId).subscribe((response: any) => {
      this.sections = response.body.data;
      console.log(this.sections)
    })
  }

  // onFileInput
  onFileInput(event, type, i?) {
    this.loaderService.show()
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.apiService.uploadFile(formData).subscribe((response: any) => {
      if (response.status == 201) {
        switch (type) {
          case 'cv':
            this.cvDoc = response.body.message;
            this.loaderService.hide()
            break;
          case '10th':
            this.tenthDoc = response.body.message;
            this.loaderService.hide()
            break;
          case '12th':
            this.twelveDoc = response.body.message;
            this.loaderService.hide()
            break;
          case 'grad':
            this.gradDoc = response.body.message;
            this.loaderService.hide()
            break;
          case 'master':
            this.masterDoc = response.body.message;
            this.loaderService.hide()
            break;
          case 'otherDoc':
            this.otherDoc = response.body.message;
            this.loaderService.hide()
            break;
          case 'otherDeg':
            this.otherDegrees = response.body.message;
            this.loaderService.hide()
            break;
          case 'certi':
            this.certifications = response.body.message;
            this.loaderService.hide()
            break;
          case 'extraCur':
            this.extraCurricularAchievements = response.body.message;
            this.loaderService.hide()
            break;
          case 'experience':
            this.teacherForm.controls.experience_list.value[i].experience_certificate = response.body.message;
            this.loaderService.hide()
        }
      } else {
        this.loaderService.hide()
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
        return;
      }
    }, (error) => {
      this.loaderService.hide()
      if (error.status == 400) {
        //console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
        return;
      }
    });
  }
  // onFileUpload
  onFileUpload(event: any) {

    const file = event.target.files[0];
    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
      const reader = new FileReader();
      reader.onload = e => this.filePreview = reader.result;
      reader.readAsDataURL(file);
      this.cdr.detectChanges();
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      this.apiService.uploadFile(formData).subscribe((response: any) => {
        if (response.status === 201) {
          this.profilePicture = response.body.message;
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

  primaryClassChange(event: any) {
    if (event.value == "") {
      this.teacherForm.controls.section.setValue("");
    }
    else {
      this.getPrimarySections(event.value);
      (<FormArray>this.teacherForm.controls.secondaryClass).controls = [];
      this.addSecondaryClass();
      this.teacherForm.controls.section.setValue("");
    }
  }

  primarySectionSelection() {
    (<FormArray>this.teacherForm.controls.secondaryClass).controls = [];
    this.addSecondaryClass();
  }

  secondaryClassChange(event: any, i: any) {
    console.log(event);
    this.pipeRefreshCounter++;
    let secondaryClass = this.teacherForm.controls.secondaryClass as FormArray;
    if (event.value == "") {
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
    else {
      this.apiService.getSections(event.value).subscribe((response: any) => {

        if (this.teacherForm.controls.primaryClass.value == event.value) {
          console.log(response.body.data)
          console.log(response.body.data.filter(x => x._id !== this.teacherForm.controls.section.value))
          formGrp.controls.tempSection.setValue(response.body.data.filter(x => x._id !== this.teacherForm.controls.section.value));
          console.log("same");
          console.log(this.teacherForm.controls.section.value);
          this.cdr.detectChanges();
        } else {
          formGrp.controls.tempSection.setValue(response.body.data);
          this.cdr.detectChanges();
        }
        console.log(response.body.data)
        //console.log(secondaryClass.value)
      })
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
  }


  createTeacher() {
    console.log(this.teacherForm)
    console.log('this.updateFlag', this.updateFlag)
    this.loaderService.show();
    this.secondaryClasses = [];

    this.teacherForm.controls.secondaryClass.value.forEach((x: any, index: any) => {
      let data = { secondClasses: "", section: "" };
      if (x.secondClasses == null || x.secondClasses == undefined) {
        this.teacherForm.controls.secondaryClass.value[index].secondClasses = "";
        this.teacherForm.controls.secondaryClass.value[index].section = "";
      }
      else if (x.section == null || x.section == undefined) {
        this.teacherForm.controls.secondaryClass.value[index].section = "";
        data.secondClasses = this.teacherForm.controls.secondaryClass.value[index].secondClasses;
        data.section = this.teacherForm.controls.secondaryClass.value[index].section;
      }
      else {
        data.secondClasses = this.teacherForm.controls.secondaryClass.value[index].secondClasses;
        data.section = this.teacherForm.controls.secondaryClass.value[index].section;
      }
      if (data.secondClasses != "") {
        this.secondaryClasses.push(data);
      }
    })

    for (let i = 0; i < (<FormArray>this.teacherForm.get('secondaryClass')).length; i++) {
      delete this.teacherForm.controls.secondaryClass.value[i].tempSection;
    }

    if (this.updateFlag) {
      console.log(this.teacherUpdate);
      const teacherData: any = {
        'profile_image': this.profilePicture,
        '_id': this.teacherUpdate._id,
        'profile_type': this.teacherUpdate.profile_type,
        'school_id': this.teacherUpdate.school_id._id,
        'branch_id': this.teacherUpdate.branch_id ?
          (this.teacherUpdate.branch_id._id ? this.teacherUpdate.branch_id._id : null) :
          (this.teacherForm.controls.branch.value == "" ? null : this.teacherForm.controls.branch.value),
        'primary_class': this.teacherForm.controls.primaryClass.value,
        'primary_section': this.teacherForm.controls.section.value,
        'secondaryClass': this.secondaryClasses,
        'name': this.teacherForm.controls.name.value,
        'mobile': this.teacherForm.controls.contact.value,
        'gender': this.teacherForm.controls.gender.value,
        'authorized': this.teacherForm.controls.authorized.value,
        permissions: {
          can_send_announcement_sms: this.teacherForm.controls.mauthorized.value,
        },
        // 'mauthorized': this.teacherForm.controls.mauthorized.value,
        'password': this.teacherForm.controls.password.value,
        'qualification': this.teacherForm.controls.qualification.value,
        'dob': this.teacherForm.controls.dob.value != "" ? new Date(this.teacherForm.controls.dob.value).toLocaleDateString() : "",
        'email': this.teacherForm.controls.email.value,
        'username': this.teacherForm.controls.email.value,
        'address': this.teacherForm.controls.address.value,
        'aadhar_card': this.teacherForm.controls.aadhaarNo.value,
        'blood_gr': this.teacherForm.controls.bloodGroup.value,
        'religion': this.teacherForm.controls.religion.value,
        'caste': this.teacherForm.controls.caste.value,
        'mother_tounge': this.teacherForm.controls.motherTongue.value,
        'marital_status': this.teacherForm.controls.maritalStatus.value,
        'experience': this.teacherForm.controls.teachingExperience.value,
        'level': this.teacherForm.controls.teachingLevels.value,
        'pf_number': this.teacherForm.controls.pf_number.value,
        'esi_number': this.teacherForm.controls.esi_number.value,
        'city': this.teacherForm.controls.city.value ? this.teacherForm.controls.city.value : null,
        'state': this.teacherForm.controls.state.value ? this.teacherForm.controls.state.value : null,
        'country': this.teacherForm.controls.country.value ? this.teacherForm.controls.country.value : null,
        'pincode': this.teacherForm.controls.pinCode.value,
        'cv': this.teacherUpdate.cv && this.teacherUpdate.cv !== '' ? this.teacherUpdate.cv : this.cvDoc,
        'ten_details': {
          'school': this.teacherForm.controls.tenthSchool.value,
          'Board': this.teacherForm.controls.tenthBoard.value,
          'percentage': this.teacherForm.controls.tenthPercentage.value,
          'year_of_passing': this.teacherForm.controls.tenthPassedYear.value,
          'Attach_doc': this.teacherUpdate.ten_details?.Attach_doc && this.teacherUpdate.ten_details?.Attach_doc !== '' ? this.teacherUpdate.ten_details?.Attach_doc : this.tenthDoc
        },
        'twelve_details': {
          'school': this.teacherForm.controls.twelveSchool.value,
          'Board': this.teacherForm.controls.twelveBoard.value,
          'percentage': this.teacherForm.controls.twelvePercentage.value,
          'year_of_passing': this.teacherForm.controls.twelvePassedYear.value,
          'Attach_doc': this.teacherUpdate.twelve_details?.Attach_doc && this.teacherUpdate.twelve_details?.Attach_doc !== '' ? this.teacherUpdate.twelve_details?.Attach_doc : this.twelveDoc
        },
        'graduation_details': {
          'school': this.teacherForm.controls.gradSchool.value,
          'Board': this.teacherForm.controls.gradBoard.value,
          'percentage': this.teacherForm.controls.gradPercentage.value,
          'year_of_passing': this.teacherForm.controls.gradPassedYear.value,
          'Attach_doc': this.teacherUpdate.graduation_details?.Attach_doc && this.teacherUpdate.graduation_details?.Attach_doc !== '' ? this.teacherUpdate.graduation_details?.Attach_doc : this.gradDoc
        },
        'masters_details': {
          'school': this.teacherForm.controls.masterSchool.value,
          'Board': this.teacherForm.controls.masterBoard.value,
          'percentage': this.teacherForm.controls.masterPercentage.value,
          'year_of_passing': this.teacherForm.controls.masterPassedYear.value,
          'Attach_doc': this.teacherUpdate.masters_details?.Attach_doc && this.teacherUpdate.masters_details?.Attach_doc !== '' ? this.teacherUpdate.masters_details?.Attach_doc : this.masterDoc
        },
        'other_education': {
          'school': this.teacherForm.controls.otherEducationSchool.value,
          'Board': this.teacherForm.controls.otherEducationBoard.value,
          'percentage': this.teacherForm.controls.otherEducationPercentage.value,
          'year_of_passing': this.teacherForm.controls.otherEducationPassedYear.value,
          'Attach_doc': this.teacherUpdate.other_education?.Attach_doc && this.teacherUpdate.other_education?.Attach_doc !== '' ? this.teacherUpdate.other_education?.Attach_doc : this.otherDoc
        },

        'other_degrees':
          // this.otherDegrees.length !== 0 ? this.otherDegrees : (this.teacherUpdate.otherDegrees ? this.teacherUpdate.otherDegree : []),
          (this.teacherUpdate.other_degrees && this.teacherUpdate.other_degrees.length !== 0) ?
            this.teacherUpdate.other_degrees :
            this.otherDegrees
        ,
        'certifications':
          // this.certifications.length !== 0 ? this.certifications : this.teacherUpdate.certifications ? this.teacherUpdate.certifications : [],
          (this.teacherUpdate.certifications && this.teacherUpdate.certifications.length !== 0) ?
            this.teacherUpdate.certifications :
            this.certifications
        ,
        'extra_achievement':
          // this.extraCurricularAchievements.length !== 0 ? this.extraCurricularAchievements : (this.teacherUpdate.extraCurricularAchievements ? this.teacherUpdate.extraCurricularAchievements : []),
          // (this.teacherUpdate.extra_achievement && this.teacherUpdate.extra_achievement[0] !== '') ? this.teacherUpdate.extra_achievement : this.extraCurricularAchievements,
          (this.teacherUpdate.extra_achievement && this.teacherUpdate.extra_achievement.length !== 0) ?
            this.teacherUpdate.extra_achievement :
            this.extraCurricularAchievements,
        designation: 'teacher',
        'experience_list': this.teacherForm.controls.experience_list.value
      }
      if (this.teacherForm.value.role == 'teacher') {
        teacherData.profile_type = {
          _id: "5fd2f18f9cc6537951f0b35c",
          role_name: "teacher"
        } 
        teacherData.designation = 'teacher'
      } else if (this.teacherForm.value.role == 'management') {
        teacherData.profile_type = {
          _id: "5fd1c839ba54044664ff8c10",
          role_name: "management"
        }
        teacherData.designation = 'management'
      } else if (this.teacherForm.value.role == 'principal') {
        teacherData.profile_type = {
          _id: "5fd1c755ba54044664ff8c0f",
          role_name: "principal"
        }
        teacherData.designation = 'principal'
      }
      teacherData.experience_list.forEach((item: any) => {
        item.joining_date != '' ? item.joining_date = new Date(item.joining_date).toLocaleDateString() : ''
        item.reliving_date != '' ? item.reliving_date = new Date(item.reliving_date).toLocaleDateString() : ''
      })
      console.log(teacherData);
      console.log(this.isAuthorized)
      this.roleService.updateUser(teacherData).subscribe((response: any) => {
        console.log(response)
        if (response.status == 201 || response.status == 204) {
          Swal.fire('Account Updated', 'Teacher account Updated successfully', 'success');
          this.activeModal.close('success');
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
          return;
        }
      }, (error) => {
        if (error.status == 400) {
          console.log('error => ', error)
          Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error?.data : '' })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error?.data : '' })
        }
      })
    }
    else {
      const teacherData = {
        'profile_image': this.profilePicture,
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        'school_id': localStorage.getItem('schoolId'),
        'branch_id': this.teacherForm.controls.branch.value ? this.teacherForm.controls.branch.value : null,
        'primary_class': this.teacherForm.controls.primaryClass.value ? this.teacherForm.controls.primaryClass.value : null,
        'primary_section': this.teacherForm.controls.section.value ? this.teacherForm.controls.section.value : null,
        'secondary_class': this.secondaryClasses,
        'name': this.teacherForm.controls.name.value,
        'mobile': this.teacherForm.controls.contact.value,
        'gender': this.teacherForm.controls.gender.value,
        'authorized': this.teacherForm.controls.authorized.value,
        permissions: {
          can_send_announcement_sms: this.teacherForm.controls.mauthorized.value,
        },
        // 'mauthorized': this.teacherForm.controls.mauthorized.value,
        'password': this.teacherForm.controls.password.value,
        'qualification': this.teacherForm.controls.qualification.value,
        'dob': this.teacherForm.controls.dob.value != "" ? new Date(this.teacherForm.controls.dob.value).toLocaleDateString() : "",
        'email': this.teacherForm.controls.email.value,
        'username': this.teacherForm.controls.email.value,
        'address': this.teacherForm.controls.address.value,
        'aadhar_card': this.teacherForm.controls.aadhaarNo.value,
        'blood_gr': this.teacherForm.controls.bloodGroup.value,
        'religion': this.teacherForm.controls.religion.value,
        'caste': this.teacherForm.controls.caste.value,
        'mother_tounge': this.teacherForm.controls.motherTongue.value,
        'marital_status': this.teacherForm.controls.maritalStatus.value,
        'experience': this.teacherForm.controls.teachingExperience.value,
        'level': this.teacherForm.controls.teachingLevels.value,
        'city': this.teacherForm.controls.city.value ? this.teacherForm.controls.city.value : null,
        'state': this.teacherForm.controls.state.value ? this.teacherForm.controls.state.value : null,
        'country': this.teacherForm.controls.country.value ? this.teacherForm.controls.country.value : null,
        'pincode': this.teacherForm.controls.pinCode.value,
        'cv': this.cvDoc,
        'pf_number': this.teacherForm.controls.pf_number.value,
        'esi_number': this.teacherForm.controls.esi_number.value,
        'ten_details': {
          'school': this.teacherForm.controls.tenthSchool.value,
          'Board': this.teacherForm.controls.tenthBoard.value,
          'percentage': this.teacherForm.controls.tenthPercentage.value,
          'year_of_passing': this.teacherForm.controls.tenthPassedYear.value.toString(),
          'Attach_doc': this.tenthDoc
        },
        'twelve_details': {
          'school': this.teacherForm.controls.twelveSchool.value,
          'Board': this.teacherForm.controls.twelveBoard.value,
          'percentage': this.teacherForm.controls.twelvePercentage.value,
          'year_of_passing': this.teacherForm.controls.twelvePassedYear.value,
          'Attach_doc': this.twelveDoc
        },
        'graduation_details': {
          'school': this.teacherForm.controls.gradSchool.value,
          'Board': this.teacherForm.controls.gradBoard.value,
          'percentage': this.teacherForm.controls.gradPercentage.value,
          'year_of_passing': this.teacherForm.controls.gradPassedYear.value,
          'Attach_doc': this.gradDoc
        },
        'masters_details': {
          'school': this.teacherForm.controls.masterSchool.value,
          'Board': this.teacherForm.controls.masterBoard.value,
          'percentage': this.teacherForm.controls.masterPercentage.value,
          'year_of_passing': this.teacherForm.controls.masterPassedYear.value,
          'Attach_doc': this.masterDoc
        },
        'other_education': {
          'school': this.teacherForm.controls.otherEducationSchool.value,
          'Board': this.teacherForm.controls.otherEducationBoard.value,
          'percentage': this.teacherForm.controls.otherEducationPercentage.value,
          'year_of_passing': this.teacherForm.controls.otherEducationPassedYear.value,
          'Attach_doc': this.otherDoc
        },

        'other_degrees': this.otherDegrees,
        'certifications': this.certifications,
        'extra_achievement': this.extraCurricularAchievements,
        designation: 'teacher',
        'experience_list': this.teacherForm.controls.experience_list.value
      }
      teacherData.experience_list.forEach((item: any) => {
        item.joining_date != '' ? item.joining_date = new Date(item.joining_date).toLocaleDateString() : ''
        item.reliving_date != '' ? item.reliving_date = new Date(item.reliving_date).toLocaleDateString() : ''
      })
      console.log('Teacher', this.teacherForm, teacherData);
      this.apiService.signUp(teacherData).subscribe((response: any) => {
        //console.log(response)
        if (response.status == 201) {
          Swal.fire('Account Created', 'Teacher account created successfully', 'success');
          this.teacherForm.reset();
          this.profilePicture = "";
          this.filePreview = "";
          this.loaderService.hide();
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
          this.loaderService.hide();
          return;
        }
      }, (error) => {
        //console.log(error)
        if (error.status == 400) {
          this.loaderService.hide();
          //console.log('error => ', error)
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
        } else {
          this.loaderService.hide();
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
        }
      })
    }
  }

  addSecondaryClass(): void {
    (<FormArray>this.teacherForm.get('secondaryClass')).push(this.addSecondaryClassFormGroup());
    this.pipeRefreshCounter++;
  }
  removeSecodaryClass(index) {
    this.pipeRefreshCounter++;
    (<FormArray>this.teacherForm.get('secondaryClass')).removeAt(index);
  }

  secondaryClassformArray() {
    return <FormArray>this.teacherForm.get('secondaryClass');
  }

  createItem(existingValue?: any): FormGroup {

    if (!existingValue) {

      return this._formBuilder.group({
        institution_name: '',
        served_as: '',
        joining_date: '',
        reliving_date: '',
        served_for: 0,
        experience_certificate: ''
      });
    } else {
      return this._formBuilder.group({
        institution_name: existingValue.institution_name,
        served_as: existingValue.served_as,
        joining_date: existingValue.joining_date,
        reliving_date: existingValue.reliving_date,
        served_for: existingValue.served_for,
        experience_certificate: existingValue.experience_certificate
      });
    }
  }

  addItem(existingValue?: any): void {

    if (!existingValue) {
      this.loaderService.show()
      console.log(this.teacherForm)
      this.experiences = this.teacherForm.get('experience_list') as FormArray;
      this.experiences.push(this.createItem());
      this.teacherUpdate?.experience_list?.push({
        institution_name: '',
        served_as: '',
        joining_date: '',
        reliving_date: '',
        served_for: 0,
        experience_certificate: ''
      })
      console.log(this.teacherUpdate)
      this.loaderService.hide()
    } else {
      this.loaderService.show()
      console.log(this.teacherForm)
      this.experiences = this.teacherForm.get('experience_list') as FormArray;
      this.experiences.push(this.createItem(existingValue));
      console.log(this.teacherUpdate)
      this.loaderService.hide()
    }

  }

  getControls() {
    return (this.teacherForm.get('experience_list') as FormArray).controls;
  }

  removeDOC(doc: string, i?: number) {
    console.log(this.teacherUpdate)
    const teacherData = {
      'profile_image': this.profilePicture,
      '_id': this.teacherUpdate._id,
      'profile_type': this.teacherUpdate.profile_type,
      'school_id': this.teacherUpdate.school_id._id,
      'branch_id': this.teacherUpdate.branch_id ?
        (this.teacherUpdate.branch_id._id ? this.teacherUpdate.branch_id._id : null) :
        (this.teacherForm.controls.branch.value == "" ? null : this.teacherForm.controls.branch.value),
      'primary_class': this.teacherForm.controls.primaryClass.value,
      'primary_section': this.teacherForm.controls.section.value,
      'secondaryClass': this.secondaryClasses,
      'name': this.teacherForm.controls.name.value,
      'mobile': this.teacherForm.controls.contact.value,
      'gender': this.teacherForm.controls.gender.value,
      'authorized': this.teacherForm.controls.authorized.value,
      permissions: {
        can_send_announcement_sms: this.teacherForm.controls.mauthorized.value,
      },
      // 'mauthorized': this.teacherForm.controls.mauthorized.value,
      'password': this.teacherForm.controls.password.value,
      'qualification': this.teacherForm.controls.qualification.value,
      'dob': this.teacherForm.controls.dob.value != "" ? new Date(this.teacherForm.controls.dob.value).toLocaleDateString() : "",
      'email': this.teacherForm.controls.email.value,
      'username': this.teacherForm.controls.email.value,
      'address': this.teacherForm.controls.address.value,
      'aadhar_card': this.teacherForm.controls.aadhaarNo.value,
      'blood_gr': this.teacherForm.controls.bloodGroup.value,
      'religion': this.teacherForm.controls.religion.value,
      'caste': this.teacherForm.controls.caste.value,
      'mother_tounge': this.teacherForm.controls.motherTongue.value,
      'marital_status': this.teacherForm.controls.maritalStatus.value,
      'experience': this.teacherForm.controls.teachingExperience.value,
      'level': this.teacherForm.controls.teachingLevels.value,
      'pf_number': this.teacherForm.controls.pf_number.value,
      'esi_number': this.teacherForm.controls.esi_number.value,
      'city': this.teacherForm.controls.city.value ? this.teacherForm.controls.city.value : null,
      'state': this.teacherForm.controls.state.value ? this.teacherForm.controls.state.value : null,
      'country': this.teacherForm.controls.country.value ? this.teacherForm.controls.country.value : null,
      'pincode': this.teacherForm.controls.pinCode.value,
      'cv': this.teacherForm.controls.cv.value,
      'ten_details': {
        'school': this.teacherForm.controls.tenthSchool.value,
        'Board': this.teacherForm.controls.tenthBoard.value,
        'percentage': this.teacherForm.controls.tenthPercentage.value,
        'year_of_passing': this.teacherForm.controls.tenthPassedYear.value.toString(),
        'Attach_doc': this.teacherUpdate.ten_details.Attach_doc
      },
      'twelve_details': {
        'school': this.teacherForm.controls.twelveSchool.value,
        'Board': this.teacherForm.controls.twelveBoard.value,
        'percentage': this.teacherForm.controls.twelvePercentage.value,
        'year_of_passing': this.teacherForm.controls.twelvePassedYear.value,
        'Attach_doc': this.teacherUpdate.twelve_details.Attach_doc
      },
      'graduation_details': {
        'school': this.teacherForm.controls.gradSchool.value,
        'Board': this.teacherForm.controls.gradBoard.value,
        'percentage': this.teacherForm.controls.gradPercentage.value,
        'year_of_passing': this.teacherForm.controls.gradPassedYear.value,
        'Attach_doc': this.teacherUpdate.graduation_details.Attach_doc
      },
      'masters_details': {
        'school': this.teacherForm.controls.masterSchool.value,
        'Board': this.teacherForm.controls.masterBoard.value,
        'percentage': this.teacherForm.controls.masterPercentage.value,
        'year_of_passing': this.teacherForm.controls.masterPassedYear.value,
        'Attach_doc': this.teacherUpdate.masters_details.Attach_doc
      },
      'other_education': {
        'school': this.teacherForm.controls.otherEducationSchool.value,
        'Board': this.teacherForm.controls.otherEducationBoard.value,
        'percentage': this.teacherForm.controls.otherEducationPercentage.value,
        'year_of_passing': this.teacherForm.controls.otherEducationPassedYear.value,
        'Attach_doc': this.teacherUpdate.other_education.Attach_doc
      },

      'other_degrees': (this.teacherUpdate?.other_degrees == null) ? [] : this.teacherUpdate?.other_degrees[0] ? this.teacherUpdate.other_degrees[0] : [],
      'certifications': (this.teacherUpdate?.certifications == null) ? [] : this.teacherUpdate?.certifications[0] ? this.teacherUpdate.certifications[0] : [],
      'extra_achievement': (this.teacherUpdate?.extra_achievement == null) ? [] : this.teacherUpdate?.extra_achievement[0] ? this.teacherUpdate.extra_achievement[0] : [],
      designation: 'teacher',
      'experience_list': this.teacherForm.controls.experience_list.value
    }
    switch (doc) {
      case 'cv':
        teacherData.cv = ''
        break;
      case 'experience_list':
        teacherData.experience_list[i].experience_certificate = ''
        break;
      case 'ten_details':
        teacherData.ten_details.Attach_doc = ''
        break;
      case 'twelve_details':
        teacherData.twelve_details.Attach_doc = ''
        break;
      case 'graduation_details':
        teacherData.graduation_details.Attach_doc = ''
        break;
      case 'masters_details':
        teacherData.masters_details.Attach_doc = ''
        break;
      case 'other_education':
        teacherData.other_education.Attach_doc = ''
        break;
      case 'other_degrees':
        teacherData.other_degrees = []
        break;
      case 'certifications':
        teacherData.certifications = []
        break;
      case 'extra_achievement':
        teacherData.extra_achievement = []
        break;
    }
    this.roleService.updateUser(teacherData).subscribe((response: any) => {
      console.log(response)
      if (response.status == 201 || response.status == 204) {
        Swal.fire('Account Updated', 'Teacher account Updated successfully', 'success');
        this.activeModal.close('success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error?.data : '' })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error?.data : '' })
      }
    })
  }

  removeExperience(i) {
    (<FormArray>this.teacherForm.get('experience_list')).removeAt(i)
  }
}
