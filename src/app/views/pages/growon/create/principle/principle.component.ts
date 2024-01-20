// Angular
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
// RxJS
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { CreateservicesService } from "../services/createservices.service";
import Swal from "sweetalert2";
import { defaultRoles } from "../../roles-permission/default-roles";
import { X } from "@angular/cdk/keycodes";
import { LoadingService } from "../../../loader/loading/loading.service";
import { RolesService } from "../../roles-permission/services/roles.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "kt-principle",
  templateUrl: "./principle.component.html",
  styleUrls: ["./principle.component.scss"],
})
export class PrincipleComponent implements OnInit {
  @Input() updateFlag;
  @Input() user;
  authorized: string[] = ["Yes", "No"];
  isAuthorized: any = false;

  mauthorized: string[] = ["Yes", "No"];
  mAuthorized: any = false;

  principleForm: FormGroup;
  gender: Array<string> = ["Male", "Female"];
  teachingLevels: Array<string> = [
    "Pre-primary school",
    "primary school",
    "middle school",
    "high school",
    "college",
    "graduation",
    "masters",
  ];
  maritalStatus: Array<string> = [
    "Married",
    "Unmarried",
    "Divorce",
    "Widow",
    "Widower",
  ];
  yearOfPassing: Array<any> = [];
  randomPass: any = Math.random().toString(36).slice(-12);
  cities: Array<any> = ["Bangalore"];
  states: Array<any> = ["karnataka"];
  branches: Array<any> = [];
  countries: Array<any>;
  cvDoc: any;
  tenthDoc: any;
  twelveDoc: any;
  gradDoc: any;
  masterDoc: any;
  otherDegrees: Array<any> = [];
  certifications: Array<any> = [];
  extraCurricularAchievements: Array<any> = [];
  profilePicture: any;
  filePreview: any;
  classes: Array<any>;
  class: Array<any>;
  primarysections: Array<any>;
  secondarySection1: Array<any>;
  secondarySection2: Array<any>;
  secondarySection3: Array<any>;
  secondarySection4: Array<any>;
  secondarySection5: Array<any>;
  secondaryClasses: any = [];
  userExistFlag: boolean = false;
  schoolId: any;
  pipeRefreshCounter = 0;
  classLength: number = 0;
  qualification: string[] = [];
  experiences: FormArray;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiService: CreateservicesService,
    private loaderService: LoadingService,
    private roleService: RolesService,
    @Optional() private activeModal: NgbActiveModal
  ) {
    this.apiService.getQualification().subscribe((res: any) => {
      this.qualification = res.body.data.userQualifications;
      console.log(res.body.data.userQualifications);
    });
  }

  ngOnInit(): void {
    console.log(this.user);
    this.principleForm = this._formBuilder.group({
      name: [, [Validators.required, Validators.maxLength(50)]],
      role: ['principal'],
      contact: [
        ,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.required,
        ],
      ],
      password: [this.randomPass],
      gender: ["", Validators.required],
      authorized: [],
      mauthorized: [],
      dob: [""],

      primaryClass: [null],
      section: [null],
      secondaryClass: this._formBuilder.array([
        this.addSecondaryClassFormGroup(),
      ]),
      branch: [null /*  Validators.required */],
      qualification: [""],
      email: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
      address: ["", [Validators.maxLength(150)]],
      aadhaarNo: [
        "",
        [Validators.maxLength(25), Validators.pattern("^[0-9]*$")],
      ],
      bloodGroup: [""],
      religion: [""],
      city: [null],
      state: [null],
      country: [null],
      pinCode: ["", [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      caste: [""],
      motherTongue: [""],
      maritalStatus: [""],
      teachingExperience: [""],
      teachingLevels: [""],
      cv: [""],
      leadershipExperience: [""],
      /* city : [''],
      state : [''],
      country : [''],
      pinCode : [''], */
      // 10th Details
      tenthSchool: [],
      tenthBoard: [],
      tenthPercentage: [],
      tenthPassedYear: [],
      // tenthDoc : ['',Validators.required],
      // twelve Details
      twelveSchool: [],
      twelveBoard: [],
      twelvePercentage: [],
      twelvePassedYear: [],
      // twelveDoc : ['',Validators.required],
      // Graduation Details
      gradSchool: [],
      gradBoard: [],
      gradPercentage: [],
      gradPassedYear: [],
      // gradDoc : ['',Validators.required],
      // Masters Details
      masterSchool: [],
      masterBoard: [],
      masterPercentage: [],
      masterPassedYear: [],
      // masterDoc : [''],
      // otherDegrees
      // otherDegrees: [''],
      // certifications: [''],
      // extraCurricularAchievements: ['']
      experience_list: new FormArray([]),
    });
    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
    }
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    this.getClasses();
    //this.getSections();
    this.getallinstitutes();
    this.getAdmin();
    if (this.updateFlag) {
      this.getUpdatePrinciple();
      if (this.principleForm.controls.experience_list.value.length == 0) {
        this.addItem();
      }
    } else {
      this.addItem();
    }
  }

  getAdmin() {
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);
    console.log(user);
    let id: any;
    if (
      user.user_info[0].profile_type.role_name == "school_admin" ||
      user.user_info[0].profile_type.role_name == "teacher" ||
      user.user_info[0].profile_type.role_name == "principal" ||
      user.user_info[0].profile_type.role_name == "management"
    ) {
      this.schoolId = localStorage.getItem("schoolId");
    } else if (localStorage.getItem("schoolId")) {
      this.schoolId = localStorage.getItem("schoolId");
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id;
      } else {
        this.schoolId = user.user_info[0]._id;
      }
      // this.schoolId = user.user_info[0].id
    }
  }

  checkAlreadyExist(value) {
    this.loaderService.show();
    this.userExistFlag = false;
    if (value && (!this.updateFlag || this.user.mobile != value)) {
      let obj = {
        school_id: this.schoolId,
        mobile: value,
        type: "principal",
      };
      this.apiService.checkUserExist(obj).subscribe(
        (response: any) => {
          if (response && response.body) {
            if (response.body.flag) {
              this.userExistFlag = true;
              this.loaderService.hide();
            } else {
              this.userExistFlag = false;
              this.loaderService.hide();
            }
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    } else {
      this.loaderService.hide();
    }
  }

  getallinstitutes() {
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = localStorage.getItem("schoolId");
    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.class = data.body.data[0].classList;
      this.classLength = this.class.length;

      console.log(this.class, "this.class");

      this.cdr.detectChanges();
    });
  }

  addSecondaryClassFormGroup(): FormGroup {
    return this._formBuilder.group({
      secondClasses: [,],
      section: [""],
      tempSection: [""],
    });
  }

  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
    });
  }

  getStates() {
    console.log(this.updateFlag);
    this.loaderService.show();
    // this.principleForm.get('country').valueChanges.subscribe(val => {
    this.apiService.getStates().subscribe(
      (response: any) => {
        console.log("States", response);
        if (this.updateFlag) {
          this.states = response.body.data.filter((usr) => {
            return (
              usr?.country_id ==
              (this.user?.country?._id
                ? this.user?.country?._id
                : this.principleForm.controls.country?.value?._id)
            );
          });
        } else {
          this.states = response.body.data.filter((usr) => {
            return (
              usr?.country_id == this.principleForm.controls.country?.value
            );
          });
        }
        console.log(this.states);
        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
    // })
  }

  getCities() {
    this.loaderService.show();
    // this.principleForm.get('state').valueChanges.subscribe(val => {
    this.apiService.getCities().subscribe(
      (response: any) => {
        // this.cities = response.body.data
        if (this.updateFlag) {
          this.cities = response.body.data.filter((usr) => {
            return (
              usr?.state_id ==
              (this.user?.state?._id
                ? this.user?.state?._id
                : this.principleForm.controls?.state?.value?._id)
            );
          });
        } else {
          this.cities = response.body.data.filter((usr) => {
            return usr?.state_id == this.principleForm.controls?.state?.value;
          });
        }

        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
    // })
  }

  getBranches() {
    this.apiService
      .getBranch(localStorage.getItem("schoolId"))
      .subscribe((response: any) => {
        this.branches = response.body.data[0].branch;
      });
  }

  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }

  getPrimarySections(classId: string) {
    this.apiService.getSections(classId).subscribe((response: any) => {
      this.primarysections = response.body.data;
    });
  }

  async getUpdatePrinciple() {
    console.log("User", this.user);
    // this.isAuthorized = this.user.authorized;
    this.principleForm = this._formBuilder.group({
      name: [this.user.name, [Validators.required, Validators.maxLength(50)]],
      role: ['principal'],
      contact: [
        this.user.mobile,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.required,
        ],
      ],
      password: [this.user.password],
      gender: [this.user.gender, Validators.required],
      authorized: [this.user.authorized, Validators.required],
      mauthorized: [this.user.permissions.can_send_announcement_sms],
      dob: [this.user.dob != "" ? new Date(this.user.dob) : ""],
      primaryClass: [this.user.primary_class],
      section: [this.user.primary_section],
      secondaryClass: this._formBuilder.array([]),
      branch: [this.user.branch_id ? this.user.branch_id._id : ""],
      qualification: [this.user.qualification],
      email: [
        this.user.email,
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
      address: [this.user.address, [Validators.maxLength(150)]],
      aadhaarNo: [
        this.user.aadhar_card,
        [Validators.maxLength(25), Validators.pattern("^[0-9]*$")],
      ],
      bloodGroup: [this.user.blood_gr],
      religion: [this.user.religion],
      city: [this.user.city != "" ? this.user.city?._id : ""],
      state: [this.user.state != "" ? this.user.state?._id : ""],
      country: [this.user.country != "" ? this.user.country?._id : ""],
      pinCode: [
        this.user.pincode,
        [Validators.maxLength(10), Validators.pattern("^[0-9]*$")],
      ],
      caste: [this.user.caste],
      motherTongue: [this.user.mother_tounge],
      maritalStatus: [this.user.marital_status],
      teachingExperience: [
        this.user.experience != "" ? this.user.experience : "",
      ],
      teachingLevels: [this.user.level],
      cv: [this.user.cv !== "" ? this.user.cv : ""],
      leadershipExperience: [this.user.leaderShip_Exp],
      tenthBoard: [this.user.ten_details ? this.user.ten_details.Board : ""],
      tenthPercentage: [
        this.user.ten_details ? this.user.ten_details.percentage : "",
      ],
      tenthSchool: [this.user.ten_details ? this.user.ten_details.school : ""],
      tenthPassedYear: [
        this.user.ten_details ? this.user.ten_details.year_of_passing : "",
      ],
      twelveBoard: [
        this.user.twelve_details ? this.user.twelve_details.Board : "",
      ],
      twelvePercentage: [
        this.user.twelve_details ? this.user.twelve_details.percentage : "",
      ],
      twelveSchool: [
        this.user.twelve_details ? this.user.twelve_details.school : "",
      ],
      twelvePassedYear: [
        this.user.twelve_details
          ? this.user.twelve_details.year_of_passing
          : "",
      ],
      gradBoard: [
        this.user.graduation_details ? this.user.graduation_details.Board : "",
      ],
      gradPercentage: [
        this.user.graduation_details
          ? this.user.graduation_details.percentage
          : "",
      ],
      gradSchool: [
        this.user.graduation_details ? this.user.graduation_details.school : "",
      ],
      gradPassedYear: [
        this.user.graduation_details
          ? this.user.graduation_details.year_of_passing
          : "",
      ],
      masterSchool: [
        this.user.masters_details ? this.user.masters_details.school : "",
      ],
      masterBoard: [
        this.user.masters_details ? this.user.masters_details.Board : "",
      ],
      masterPercentage: [
        this.user.masters_details ? this.user.masters_details.percentage : "",
      ],
      masterPassedYear: [
        this.user.masters_details
          ? this.user.masters_details.year_of_passing
          : "",
      ],
      experience_list: new FormArray([]),
    });
    this.user.experience_list?.forEach((item: any) => {
      this.addItem(item);
    });
    if (this.principleForm.get("primaryClass").value) {
      this.getPrimarySections(this.principleForm.get("primaryClass").value);
    }
    this.profilePicture = this.user.profile_image;
    this.filePreview = this.user.profile_image;
    if (this.user?.secondary_class?.length) {
      for (let i = 0; i < this.user.secondary_class.length; i++) {
        await this.apiService
          .getSections(this.user.secondary_class[i].secondClasses)
          .subscribe((response: any) => {
            (<FormArray>this.principleForm.get("secondaryClass")).push(
              this._formBuilder.group({
                secondClasses: [this.user.secondary_class[i].secondClasses],
                section: [this.user.secondary_class[i].section],
                tempSection: [response.body.data],
              })
            );
            console.log(this.principleForm.value);
            this.cdr.detectChanges();
          });
      }
    }

    this.getStates();
    console.log(this.principleForm);
    this.cdr.detectChanges();
  }

  // onFileInput
  onFileInput(event, type, i?: number) {
    this.loaderService.show();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.apiService.uploadFile(formData).subscribe(
      (response: any) => {
        if (response.status == 201) {
          switch (type) {
            case "cv":
              this.cvDoc = response.body.message;
              this.loaderService.hide();
              break;
            case "10th":
              this.tenthDoc = response.body.message;
              this.loaderService.hide();
              break;
            case "12th":
              this.twelveDoc = response.body.message;
              this.loaderService.hide();
              break;
            case "grad":
              this.gradDoc = response.body.message;
              this.loaderService.hide();
              break;
            case "master":
              this.masterDoc = response.body.message;
              this.loaderService.hide();
              break;
            case "otherDeg":
              this.otherDegrees = response.body.message;
              this.loaderService.hide();
              break;
            case "certi":
              this.certifications = response.body.message;
              this.loaderService.hide();
              break;
            case "extraCur":
              this.extraCurricularAchievements = response.body.message;
              this.loaderService.hide();
              break;
            case "experience":
              this.principleForm.controls.experience_list.value[
                i
              ].experience_certificate = response.body.message;
              this.loaderService.hide();
          }
        } else {
          this.loaderService.hide();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was a problem uploding your fie please try again",
          });
          return;
        }
      },
      (error) => {
        this.loaderService.hide();
        if (error.status == 400) {
          console.log("error => ", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.error.message.message,
          });
          return;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was a problem uploding your fie please try again",
          });
          return;
        }
      }
    );
  }
  // onFileUpload
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => (this.filePreview = reader.result);
      reader.readAsDataURL(file);
      this.cdr.detectChanges();
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      this.apiService.uploadFile(formData).subscribe(
        (response: any) => {
          if (response.status === 201) {
            this.profilePicture = response.body.message;
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Something went wrong please try again",
            });
            return;
          }
        },
        (error) => {
          if (error.status == 400) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.error.message.message,
            });
            return;
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "There was a problem uploding your file please try again",
            });
            return;
          }
        }
      );
    } else {
      alert("Please upload png or jpg file");
    }
  }

  primaryClassChange(event: any) {
    if (event.value == "") {
      this.principleForm.controls.section.setValue("");
    } else {
      this.getPrimarySections(event.value);
      (<FormArray>this.principleForm.controls.secondaryClass).controls = [];
      this.addSecondaryClass();
      this.principleForm.controls.section.setValue("");
    }
  }
  primarySectionSelection() {
    (<FormArray>this.principleForm.controls.secondaryClass).controls = [];
    this.addSecondaryClass();
  }

  secondaryClassChange(event: any, i: any) {
    console.log(event);
    this.pipeRefreshCounter++;
    let secondaryClass = this.principleForm.controls
      .secondaryClass as FormArray;
    if (event.value == "") {
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    } else {
      this.apiService.getSections(event.value).subscribe((response: any) => {
        if (this.principleForm.controls.primaryClass.value == event.value) {
          console.log(response.body.data);
          console.log(
            response.body.data.filter(
              (x) => x._id !== this.principleForm.controls.section.value
            )
          );
          formGrp.controls.tempSection.setValue(
            response.body.data.filter(
              (x) => x._id !== this.principleForm.controls.section.value
            )
          );
          console.log("same");
          console.log(this.principleForm.controls.section.value);
          this.cdr.detectChanges();
        } else {
          formGrp.controls.tempSection.setValue(response.body.data);
          this.cdr.detectChanges();
        }
        console.log(response.body.data);
        //console.log(secondaryClass.value)
      });
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
  }

  createPrinciple() {
    console.log(this.mAuthorized);
    this.secondaryClasses = [];

    this.principleForm.controls.secondaryClass.value.forEach(
      (x: any, index: any) => {
        let data = { secondClasses: "", section: "" };
        if (x.secondClasses == null || x.secondClasses == undefined) {
          this.principleForm.controls.secondaryClass.value[
            index
          ].secondClasses = "";
          this.principleForm.controls.secondaryClass.value[index].section = "";
        } else if (x.section == null || x.section == undefined) {
          this.principleForm.controls.secondaryClass.value[index].section = "";
          data.secondClasses =
            this.principleForm.controls.secondaryClass.value[
              index
            ].secondClasses;
          data.section =
            this.principleForm.controls.secondaryClass.value[index].section;
        } else {
          data.secondClasses =
            this.principleForm.controls.secondaryClass.value[
              index
            ].secondClasses;
          data.section =
            this.principleForm.controls.secondaryClass.value[index].section;
        }
        if (data.secondClasses != "") {
          this.secondaryClasses.push(data);
        }
      }
    );

    for (
      let i = 0;
      i < this.principleForm.get("secondaryClass").value.length;
      i++
    ) {
      delete this.principleForm.controls.secondaryClass.value[i].tempSection;
    }

    if (this.updateFlag) {
      console.log(this.principleForm.controls.mauthorized.value);
      const principalData = {
        profile_image: this.profilePicture,
        _id: this.user._id,
        profile_type: this.user.profile_type,
        school_id: this.user.school_id._id,
        branch_id: this.user.branch_id
          ? this.user.branch_id._id
          : this.principleForm.controls.branch.value,
        primary_class: this.principleForm.controls.primaryClass.value
          ? this.principleForm.controls.primaryClass.value
          : null,
        primary_section: this.principleForm.controls.section.value,
        secondary_class: this.secondaryClasses,
        name: this.principleForm.controls.name.value,
        mobile: this.principleForm.controls.contact.value,
        gender: this.principleForm.controls.gender.value,
        authorized: this.principleForm.controls.authorized.value,
        permissions: {
          can_send_announcement_sms:
            this.principleForm.controls.mauthorized.value,
        },
        // message authorization
        password: this.principleForm.controls.password.value,
        qualification: this.principleForm.controls.qualification.value,
        dob:
          this.principleForm.controls.dob.value != "" &&
            this.principleForm.controls.dob.value != null
            ? new Date(
              this.principleForm.controls.dob.value
            ).toLocaleDateString()
            : "",
        email: this.principleForm.controls.email.value,
        username: this.principleForm.controls.email.value,
        address: this.principleForm.controls.address.value,
        aadhar_card: this.principleForm.controls.aadhaarNo.value,
        blood_gr: this.principleForm.controls.bloodGroup.value,
        religion: this.principleForm.controls.religion.value,
        caste: this.principleForm.controls.caste.value,
        mother_tounge: this.principleForm.controls.motherTongue.value,
        marital_status: this.principleForm.controls.maritalStatus.value,
        experience: this.principleForm.controls.teachingExperience.value,
        level: this.principleForm.controls.teachingLevels.value,
        city: this.principleForm.controls.city.value,
        state: this.principleForm.controls.state.value,
        country: this.principleForm.controls.country.value,
        pincode: this.principleForm.controls.pinCode.value,
        leaderShip_Exp: this.principleForm.controls.leadershipExperience.value,
        cv: this.cvDoc && this.cvDoc !== "" ? this.cvDoc : this.user.cv,
        ten_details: {
          school: this.principleForm.controls.tenthSchool.value,
          Board: this.principleForm.controls.tenthBoard.value,
          percentage: this.principleForm.controls.tenthPercentage.value,
          year_of_passing: this.principleForm.controls.tenthPassedYear.value,
          Attach_doc:
            this.tenthDoc && this.tenthDoc !== ""
              ? this.tenthDoc
              : this.user.ten_details.Attach_doc,
        },
        twelve_details: {
          school: this.principleForm.controls.twelveSchool.value,
          Board: this.principleForm.controls.twelveBoard.value,
          percentage: this.principleForm.controls.twelvePercentage.value,
          year_of_passing: this.principleForm.controls.twelvePassedYear.value,
          Attach_doc:
            this.twelveDoc && this.twelveDoc !== ""
              ? this.twelveDoc
              : this.user.twelve_details.Attach_doc,
        },
        graduation_details: {
          school: this.principleForm.controls.gradSchool.value,
          Board: this.principleForm.controls.gradBoard.value,
          percentage: this.principleForm.controls.gradPercentage.value,
          year_of_passing: this.principleForm.controls.gradPassedYear.value,
          Attach_doc:
            this.gradDoc && this.gradDoc !== ""
              ? this.gradDoc
              : this.user.graduation_details.Attach_doc,
        },
        masters_details: {
          school: this.principleForm.controls.masterSchool.value,
          Board: this.principleForm.controls.masterBoard.value,
          percentage: this.principleForm.controls.masterPercentage.value,
          year_of_passing: this.principleForm.controls.masterPassedYear.value,
          Attach_doc:
            this.masterDoc && this.masterDoc !== ""
              ? this.masterDoc
              : this.user.masters_details.Attach_doc,
        },
        other_degrees:
          this.otherDegrees && this.otherDegrees[0] !== ""
            ? this.otherDegrees
            : this.user.other_degrees[0],
        certifications:
          this.certifications && this.certifications[0] !== ""
            ? this.certifications
            : this.user.certifications[0],
        extra_achievement:
          this.extraCurricularAchievements &&
            this.extraCurricularAchievements[0] !== ""
            ? this.extraCurricularAchievements
            : this.user.extra_achievement,
        designation: "principal",
        experience_list: this.principleForm.controls.experience_list.value,
      };
      if (this.principleForm.value.role == 'teacher') {
        principalData.profile_type = {
          _id: "5fd2f18f9cc6537951f0b35c",
          role_name: "teacher"
        } 
        principalData.designation = 'teacher'
      } else if (this.principleForm.value.role == 'management') {
        principalData.profile_type = {
          _id: "5fd1c839ba54044664ff8c10",
          role_name: "management"
        }
        principalData.designation = 'management'
      } else if (this.principleForm.value.role == 'principal') {
        principalData.profile_type = {
          _id: "5fd1c755ba54044664ff8c0f",
          role_name: "principal"
        }
        principalData.designation = 'principal'
      }
      this.roleService.updateUser(principalData).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status == 201 || response.status == 204) {
            Swal.fire(
              "Account Updated",
              "Principle account Updated successfully",
              "success"
            );
            this.principleForm.reset();
            this.activeModal.close("success");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.body.data,
            });
            return;
          }
        },
        (error) => {
          if (error.status == 400) {
            console.log("error => ", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error ? error?.error?.data : "",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error ? error?.error?.data : "",
            });
          }
        }
      );
    } else {
      const principleData = {
        profile_image: this.profilePicture,
        profile_type: defaultRoles.find((role) => {
          return role.role_name == "principal";
        }).id,
        school_id: localStorage.getItem("schoolId"),
        branch_id: this.principleForm.controls.branch.value,
        primary_class: this.principleForm.controls.primaryClass.value
          ? this.principleForm.controls.primaryClass.value
          : null,
        primary_section: this.principleForm.controls.section.value
          ? this.principleForm.controls.section.value
          : null,
        secondary_class: this.secondaryClasses,
        name: this.principleForm.controls.name.value,
        mobile: this.principleForm.controls.contact.value,
        gender: this.principleForm.controls.gender.value,
        authorized: this.principleForm.controls.authorized.value,
        permissions: {
          can_send_announcement_sms:
            this.principleForm.controls.mauthorized.value,
        },
        //message authorization
        password: this.principleForm.controls.password.value,
        qualification: this.principleForm.controls.qualification.value,
        dob:
          this.principleForm.controls.dob.value != "" &&
            this.principleForm.controls.dob.value != null
            ? new Date(
              this.principleForm.controls.dob.value
            ).toLocaleDateString()
            : "",
        email: this.principleForm.controls.email.value,
        username: this.principleForm.controls.email.value,
        address: this.principleForm.controls.address.value,
        aadhar_card: this.principleForm.controls.aadhaarNo.value,
        blood_gr: this.principleForm.controls.bloodGroup.value,
        religion: this.principleForm.controls.religion.value,
        caste: this.principleForm.controls.caste.value,
        mother_tounge: this.principleForm.controls.motherTongue.value,
        marital_status: this.principleForm.controls.maritalStatus.value,
        experience: this.principleForm.controls.teachingExperience.value,
        level: this.principleForm.controls.teachingLevels.value,
        city: this.principleForm.controls.city.value,
        state: this.principleForm.controls.state.value,
        country: this.principleForm.controls.country.value,
        pincode: this.principleForm.controls.pinCode.value,
        leaderShip_Exp: this.principleForm.controls.leadershipExperience.value,
        cv: this.cvDoc,
        ten_details: {
          school: this.principleForm.controls.tenthSchool.value,
          Board: this.principleForm.controls.tenthBoard.value,
          percentage: this.principleForm.controls.tenthPercentage.value,
          year_of_passing: this.principleForm.controls.tenthPassedYear.value,
          Attach_doc: this.tenthDoc,
        },
        twelve_details: {
          school: this.principleForm.controls.twelveSchool.value,
          Board: this.principleForm.controls.twelveBoard.value,
          percentage: this.principleForm.controls.twelvePercentage.value,
          year_of_passing: this.principleForm.controls.twelvePassedYear.value,
          Attach_doc: this.twelveDoc,
        },
        graduation_details: {
          school: this.principleForm.controls.gradSchool.value,
          Board: this.principleForm.controls.gradBoard.value,
          percentage: this.principleForm.controls.gradPercentage.value,
          year_of_passing: this.principleForm.controls.gradPassedYear.value,
          Attach_doc: this.gradDoc,
        },
        masters_details: {
          school: this.principleForm.controls.masterSchool.value,
          Board: this.principleForm.controls.masterBoard.value,
          percentage: this.principleForm.controls.masterPercentage.value,
          year_of_passing: this.principleForm.controls.masterPassedYear.value,
          Attach_doc: this.masterDoc,
        },
        other_degrees: this.otherDegrees,
        certifications: this.certifications,
        extra_achievement: this.extraCurricularAchievements,
        designation: "principal",
        experience_list: this.principleForm.controls.experience_list.value,
      };
      this.apiService.signUp(principleData).subscribe(
        (response: any) => {
          console.log("principle reg Data", response);
          if (response.status == 201) {
            if (response.status == 201) {
              Swal.fire("Principal", response.body.data, "success");
              this.principleForm.reset();
              this.profilePicture = "";
              this.filePreview = "";
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.body.data,
              });
              return;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Error, please try again",
              text: response.body.data,
            });
            return;
          }
        },
        (error) => {
          console.log("principle error Data", error);
          if (error.status == 400) {
            console.log("error => ", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.error.data,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.error.data,
            });
          }
        }
      );
    }
  }

  removeControls() {
    this.principleForm.controls.secondaryClass.value.forEach(
      (element: any, i: any) => {
        if (element.secondClasses == "") {
          this.removeSecodaryClass(i);
        }
      }
    );
  }

  addSecondaryClass(): void {
    (<FormArray>this.principleForm.get("secondaryClass")).push(
      this.addSecondaryClassFormGroup()
    );
  }

  removeSecodaryClass(index) {
    (<FormArray>this.principleForm.get("secondaryClass")).removeAt(index);
  }

  secondaryClassformArray() {
    return <FormArray>this.principleForm.get("secondaryClass");
  }

  getControls() {
    return (this.principleForm.get("experience_list") as FormArray).controls;
  }

  createItem(existingValue?: any): FormGroup {
    if (!existingValue) {
      return this._formBuilder.group({
        institution_name: "",
        served_as: "",
        joining_date: "",
        reliving_date: "",
        served_for: 0,
        experience_certificate: "",
      });
    } else {
      return this._formBuilder.group({
        institution_name: existingValue.institution_name,
        served_as: existingValue.served_as,
        joining_date: existingValue.joining_date,
        reliving_date: existingValue.reliving_date,
        served_for: existingValue.served_for,
        experience_certificate: existingValue.experience_certificate,
      });
    }
  }

  addItem(existingValue?: any): void {
    if (!existingValue) {
      this.loaderService.show();
      console.log(this.principleForm);
      this.experiences = this.principleForm.get("experience_list") as FormArray;
      this.experiences.push(this.createItem());
      this.loaderService.hide();
    } else {
      this.loaderService.show();
      console.log(this.principleForm);
      this.experiences = this.principleForm.get("experience_list") as FormArray;
      this.experiences.push(this.createItem(existingValue));
      this.loaderService.hide();
    }
  }

  removeExperience(i) {
    (<FormArray>this.principleForm.get("experience_list")).removeAt(i);
  }

  removeDOC(doc: string, i?: number) {
    console.log(this.user);
    const principalData = {
      profile_image: this.profilePicture,
      _id: this.user._id,
      profile_type: this.user.profile_type,
      school_id: this.user.school_id._id,
      branch_id: this.user.branch_id
        ? this.user.branch_id._id
        : this.principleForm.controls.branch.value,
      primary_class: this.principleForm.controls.primaryClass.value
        ? this.principleForm.controls.primaryClass.value
        : null,
      primary_section: this.principleForm.controls.section.value
        ? this.principleForm.controls.section.value
        : null,
      secondary_class: this.secondaryClasses,
      name: this.principleForm.controls.name.value,
      mobile: this.principleForm.controls.contact.value,
      gender: this.principleForm.controls.gender.value,
      authorized: this.principleForm.controls.authorized.value,
      permissions: {
        can_send_announcement_sms:
          this.principleForm.controls.mauthorized.value,
      },
      //message authorization
      password: this.principleForm.controls.password.value,
      qualification: this.principleForm.controls.qualification.value,
      dob:
        this.principleForm.controls.dob.value != "" &&
          this.principleForm.controls.dob.value != null
          ? new Date(this.principleForm.controls.dob.value).toLocaleDateString()
          : "",
      email: this.principleForm.controls.email.value,
      username: this.principleForm.controls.email.value,
      address: this.principleForm.controls.address.value,
      aadhar_card: this.principleForm.controls.aadhaarNo.value,
      blood_gr: this.principleForm.controls.bloodGroup.value,
      religion: this.principleForm.controls.religion.value,
      caste: this.principleForm.controls.caste.value,
      mother_tounge: this.principleForm.controls.motherTongue.value,
      marital_status: this.principleForm.controls.maritalStatus.value,
      experience: this.principleForm.controls.teachingExperience.value,
      level: this.principleForm.controls.teachingLevels.value,
      city: this.principleForm.controls.city.value,
      state: this.principleForm.controls.state.value,
      country: this.principleForm.controls.country.value,
      pincode: this.principleForm.controls.pinCode.value,
      leaderShip_Exp: this.principleForm.controls.leadershipExperience.value,
      cv: this.cvDoc && this.cvDoc !== "" ? this.cvDoc : this.user.cv,
      ten_details: {
        school: this.principleForm.controls.tenthSchool.value,
        Board: this.principleForm.controls.tenthBoard.value,
        percentage: this.principleForm.controls.tenthPercentage.value,
        year_of_passing: this.principleForm.controls.tenthPassedYear.value,
        Attach_doc:
          this.tenthDoc && this.tenthDoc !== ""
            ? this.tenthDoc
            : this.user.ten_details.Attach_doc,
      },
      twelve_details: {
        school: this.principleForm.controls.twelveSchool.value,
        Board: this.principleForm.controls.twelveBoard.value,
        percentage: this.principleForm.controls.twelvePercentage.value,
        year_of_passing: this.principleForm.controls.twelvePassedYear.value,
        Attach_doc:
          this.twelveDoc && this.twelveDoc !== ""
            ? this.twelveDoc
            : this.user.twelve_details.Attach_doc,
      },
      graduation_details: {
        school: this.principleForm.controls.gradSchool.value,
        Board: this.principleForm.controls.gradBoard.value,
        percentage: this.principleForm.controls.gradPercentage.value,
        year_of_passing: this.principleForm.controls.gradPassedYear.value,
        Attach_doc:
          this.gradDoc && this.gradDoc !== ""
            ? this.gradDoc
            : this.user.graduation_details.Attach_doc,
      },
      masters_details: {
        school: this.principleForm.controls.masterSchool.value,
        Board: this.principleForm.controls.masterBoard.value,
        percentage: this.principleForm.controls.masterPercentage.value,
        year_of_passing: this.principleForm.controls.masterPassedYear.value,
        Attach_doc:
          this.masterDoc && this.masterDoc !== ""
            ? this.masterDoc
            : this.user.masters_details.Attach_doc,
      },
      other_degrees: this.otherDegrees,
      certifications: this.certifications,
      extra_achievement: this.extraCurricularAchievements,
      designation: "principal",
      experience_list: this.principleForm.controls.experience_list.value,
    };
    console.log(principalData);

    switch (doc) {
      case "cv":
        principalData.cv = "";
        break;
      case "experience_list":
        principalData.experience_list[i].experience_certificate = "";
        break;
      case "ten_details":
        principalData.ten_details.Attach_doc = "";
        break;
      case "twelve_details":
        principalData.twelve_details.Attach_doc = "";
        break;
      case "graduation_details":
        principalData.graduation_details.Attach_doc = "";
        break;
      case "masters_details":
        principalData.masters_details.Attach_doc = "";
        break;
      case "other_degrees":
        principalData.other_degrees = [];
        break;
      case "certifications":
        principalData.certifications = [];
        break;
      case "extra_achievement":
        principalData.extra_achievement = [];
        break;
    }
    this.roleService.updateUser(principalData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == 201 || response.status == 204) {
          Swal.fire(
            "Account Updated",
            "Teacher account Updated successfully",
            "success"
          );
          this.activeModal.close("success");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.body.data,
          });
          return;
        }
      },
      (error) => {
        if (error.status == 400) {
          console.log("error => ", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error ? error.error?.data : "",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error ? error.error?.data : "",
          });
        }
      }
    );
  }
}
