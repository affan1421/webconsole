import { LoadingService } from './../../../../loader/loading/loading.service';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RolesService } from '../../../roles-permission/services/roles.service';
import { CreateservicesService } from '../../services/createservices.service';

@Component({
  selector: 'kt-edit-all-management',
  templateUrl: './edit-all-management.component.html',
  styleUrls: ['./edit-all-management.component.scss']
})
export class EditAllManagementComponent implements OnInit {

  updateManagementForm: FormGroup;
  authorized: string[] = ['Yes', 'No'];
  isAuthorized: any = false;

  // Message authorisation
  mauthorized: string[] = ['Yes', 'No'];
  mAuthorized: any = false;
  gender: Array<string> = ['Male', 'Female'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  yearOfPassing: Array<any> = [];
  randomPass: any = Math.random().toString(36).slice(-12);
  branches: Array<any> = [];
  profilePicture: any;
  filePreview: any;
  countries = [];
  states = [];
  cities = [];
  qualification: string[] = [];
  maritalStatuses: Array<string> = ['Married', 'Single'];
  @Input() managements: any;
  userExistFlag: boolean = false; schoolId: string;
  ;

  constructor(public _formBuilder: FormBuilder, public activeModal: NgbActiveModal,
    public createApiServices: CreateservicesService, private apiService: RolesService,
    public cdr: ChangeDetectorRef, private loaderService: LoadingService) {

    this.createApiServices.getQualification().subscribe((res: any) => {
      this.qualification = res.body.data.userQualifications
      console.log(res.body.data.userQualifications)
    })
  }

  ngOnInit(): void {
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
    this.createUpdateForm();
    console.log(this.managements)
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    //this.getManagementdetail();
  }

  checkAlreadyExist(value) {
    this.loaderService.show();
    this.userExistFlag = false;
    if (value != this.managements.mobile) {
      let obj = {
        school_id: this.schoolId,
        mobile: value,
        type: 'management'
      }
      this.createApiServices.checkUserExist(obj).subscribe(
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
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        error => {
          this.loaderService.hide();
        }
      )

    } else {
      this.loaderService.hide();
    }

  }

  getCities() {
    this.createApiServices.getCities().subscribe((response: any) => {
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.updateManagementForm.controls.state.value

      })
      // this.cities = response.body.data;
    })
  }

  getCountries() {
    this.createApiServices.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      console.log(response.body.data)
    })
  }

  getStates() {
    this.createApiServices.getStates().subscribe((response: any) => {
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.updateManagementForm.controls.country.value
      })
      // this.states = response.body.data;
    })
  }

  getBranches() {
    this.createApiServices.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;
    })
  }

  createUpdateForm() {
    console.log(this.managements);

    this.isAuthorized = this.managements.authorized;
    this.updateManagementForm = this._formBuilder.group({
      school_id: [this.managements.school_id._id],
      role: ['management'],
      name: [this.managements.name, [Validators.required, Validators.maxLength(50)]],
      mobile: [this.managements.mobile, [Validators.required]],
      email: [this.managements.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      gender: [this.managements.gender, Validators.required],
      authorized: [this.managements.authorized],
      mauthorized: [this.managements?.permissions?.can_send_announcement_sms],
      marital_status: [this.managements.marital_status],
      branch_id: [this.managements.branch_id ? this.managements.branch_id._id : '', Validators.required],
      // dob: [this.managements.dob != "" ? new Date(this.managements.dob) : ""],
      dob: [this.managements.dob != "" ? new Date(this.managements.dob) : ''],
      password: [this.managements.password],
      address: [this.managements.address, [Validators.maxLength(150)]],
      city: [this.managements?.city?._id],
      state: [this.managements?.state?._id],
      country: [this.managements?.country?._id],
      pincode: [this.managements.pincode, [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      aadhar_card: [this.managements.aadhar_card, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      blood_gr: [this.managements.blood_gr],
      profile_image: [this.managements.profile_image],
      mother_tounge: [this.managements.mother_tounge],
      religion: [this.managements.religion],
      caste: [this.managements.caste],
      profile_type: this.managements.profile_type,
      qualification: this.managements.qualification,
      _id: [this.managements._id],
    });
    if (this.updateManagementForm.controls.dob.value == 'Invalid Date') {
      // this.updateManagementForm.get('dob').clearValidators()
      this.updateManagementForm.controls.dob.patchValue(new Date(0))
    }
    this.filePreview = this.managements.profile_image;
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
      const reader = new FileReader();
      reader.onload = e => this.filePreview = reader.result;
      reader.readAsDataURL(file);
      this.cdr.detectChanges();
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      this.createApiServices.uploadFile(formData).subscribe((response: any) => {
        if (response.status === 201) {
          this.profilePicture = response.body.message;
          this.updateManagementForm.controls['profile_image'].setValue(response.body.message)
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


  updateManagement() {
    console.log(this.updateManagementForm.value)

    let data: any = this.updateManagementForm.value
    data.permissions = {
      can_send_announcement_sms: null
    }

    data.permissions.can_send_announcement_sms = this.updateManagementForm.value.mauthorized;
    this.updateManagementForm.value.designation = 'management'
    console.log(this.updateManagementForm.value.dob == 'Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)')
    if (this.updateManagementForm.value.dob == 'Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)') {
      this.updateManagementForm.value.dob = ''
    }
    if (this.updateManagementForm.value.dob != "") {
      this.updateManagementForm.value.dob = new Date(this.updateManagementForm.value.dob).toLocaleDateString();
    }
    if (this.updateManagementForm.value.role == 'teacher') {
      data.profile_type = {
        _id: "5fd2f18f9cc6537951f0b35c",
        role_name: "teacher"
      }
      data.designation = 'teacher'
    } else if (this.updateManagementForm.value.role == 'management') {
      data.profile_type = {
        _id: "5fd1c839ba54044664ff8c10",
        role_name: "management"
      }
      data.designation = 'management'
    } else if (this.updateManagementForm.value.role == 'principal') {
      data.profile_type = {
        _id: "5fd1c755ba54044664ff8c0f",
        role_name: "principal"
      }
      data.designation = 'principal'
    }
    this.apiService.updateUser(data).subscribe((response: any) => {
      Swal.fire('Success', 'Management updated ', 'success');
      let element = document.getElementById('reset') as HTMLElement;
      element.click();
      this.activeModal.close('success');

    }, (error) => {
      console.log(error)
      if (error) {
        if (error?.status == 400) {
          Swal.fire({ icon: 'error', title: 'Error', text: error?.error?.data });
          // return;
        } else {

          Swal.fire({ icon: 'error', title: 'Error', text: error ? error?.error?.data : '' });
          //   return;
        }
      }
    })
  }

}
