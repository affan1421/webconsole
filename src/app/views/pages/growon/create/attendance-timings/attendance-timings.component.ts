import { Component, OnInit } from '@angular/core';
import { CreateservicesService } from '../services/createservices.service';
import { LoadingService } from '../../../loader/loading/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-attendance-timings',
  templateUrl: './attendance-timings.component.html',
  styleUrls: ['./attendance-timings.component.scss']
})
export class AttendanceTimingsComponent implements OnInit {
  longitude: String;
  latitude: String;
  radius: any = 0;
  map: ''
  showMap = true;
  startTime: any = new Date()
  loginTime: any = new Date()
  logoutTime: any = new Date()
  constructor(
    private apiService: CreateservicesService,
    private loaderService: LoadingService,
    private _snackBar: MatSnackBar
  ) {
    this.updateExistingData()
  }

  ngOnInit() {
  }
  update = async () => {
    this.loaderService.show()
    let data = {
      startTime: this.startTime ? await this.timeFormater(this.startTime) : '',
      loginTime: this.loginTime ? await this.timeFormater(this.loginTime) : '',
      logoutTime: this.logoutTime ? await this.timeFormater(this.logoutTime) : '',
      longitude: this.longitude,
      latitude: this.latitude,
      radius: (this.radius / 1609), // Converting into Miles
    }
    this.apiService.updateLocation(data, localStorage.getItem('schoolId')).subscribe((res: any) => {
      this.loaderService.hide()
      if (res.status = 200) {
        this._snackBar.open(res.body.message, 'OK', { duration: 1500 })
      }
    }, (err: any) => {
      Swal.fire({ icon: 'error', title: 'Error', text: `${err}` });
    })
  }

  onRadiusChange(event: any) {
    this.radius = event.value
  }

  extractLocation() {
    try {
      this.latitude = this.map.toString().split('@')[1].split(',')[0]
      this.longitude = this.map.toString().split('@')[1].split(',')[1]
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Invalid URL', text: `Please Enter Invalid URL` });
    }
  }

  updateExistingData() {
    this.loaderService.show()
    this.apiService.getSchool(localStorage.getItem('schoolId')).subscribe((res: any) => {
      this.loaderService.hide()
      let data = res.body.data[0]

      // If Coordinates Exists Hide Map Link
      if (data.location.coordinates) {
        this.showMap = false
      }
      this.longitude = data.location.coordinates[0]
      this.latitude = data.location.coordinates[1]
      this.radius = (data.location.radius * 1609).toFixed(0)

      this.startTime = data.startTime ? this.timeFormatertoString(data.startTime) : ''
      this.loginTime = data.loginTime ? this.timeFormatertoString(data.loginTime) : ''
      this.logoutTime = data.logoutTime ? this.timeFormatertoString(data.logoutTime) : ''

      console.log(this.startTime)
    })
  }

  timeFormater(dateString: any) {
    let hour = dateString.toString().split(':')[0]

    if (dateString.toString().split(' ')[1].toString().toLowerCase() == 'pm') {
      hour = hour < 12 ? parseInt(hour) + 12 : hour
      console.log(hour);
    }
    let minutes = dateString.split(':')[1].split(' ')[0]
    const time = new Date().setHours(hour, minutes);
    return new Date(time)
  }

  timeFormatertoString(time: any) {
    let hour = new Date(time).toLocaleTimeString().toString().split(':')[0]
    let minutes = new Date(time).toLocaleTimeString().toString().split(':')[1]
    let AMPM = new Date(time).toLocaleTimeString().toString().split(':')[2].split(' ')[1]
    return (`${hour}:${minutes} ${AMPM}`).toString()
  }
}
