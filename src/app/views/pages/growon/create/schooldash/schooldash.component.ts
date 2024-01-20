import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { LoadingService } from '../../../loader/loading/loading.service';
import { CreateservicesService } from '../services/createservices.service';

@Component({
  selector: 'kt-schooldash',
  templateUrl: './schooldash.component.html',
  styleUrls: ['./schooldash.component.scss']
})
export class SchooldashComponent implements OnInit {
  isOwner: boolean;
  schoolDetails: any = {
    schoolName: '',
    schoolCode: 0,
    schoolImage: ''
  };
  assignment: any
  livePoll: any
  event: any
  check_list: any
  announcement: any
  data: any;
  schools: any;
  test: any;
  totalStudent: any = 0;

  constructor(private api: CreateservicesService, private loaderService: LoadingService) {
    try {
      this.getTasksData()
      this.getStudentsCount()
    } catch (err) {
      console.log('Error', err)
    }
    if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
      this.schoolDetails.schoolCode = localStorage.getItem('schoolCode')
      this.schoolDetails.schoolImage = localStorage.getItem('schoolImage')
      this.schoolDetails.schoolName = localStorage.getItem('schoolName')
    } else {
      this.isOwner = false
    }
    console.log(this.isOwner)
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
  }

  getTasksData = async () => {
    this.loaderService.show();
    let id = localStorage.getItem('schoolId')
    this.api.getdashboarddetail(id).subscribe(async (res: any) => {
      this.loaderService.hide();
      this.data = await res;
      this.updateTasks()
    })
  }

  updateTasks() {
    this.data.data.forEach((item: any) => {
      if (item._id == 'Assignment') {
        this.assignment = item.num
        console.log(this.assignment)
      } else if (item._id == 'Announcement') {
        this.announcement = item.num
      } else if (item._id == 'LivePoll') {
        this.livePoll = item.num
      } else if (item._id == 'Event') {
        this.event = item.num
      } else {
        this.check_list = item.num
      }
    })
  }

  getStudentsCount() {
    this.loaderService.show();
    let id = localStorage.getItem('schoolId')
    id ? this.api.getStudentRecordCount(id).subscribe((data: any) => {
      this.loaderService.hide();
      this.totalStudent = data.body.count
    }) : this.api.getGlobalStudentCount().subscribe((res: any) => {
      this.loaderService.hide();
      this.totalStudent = res
      console.log(res)
    })
  }

 
}
