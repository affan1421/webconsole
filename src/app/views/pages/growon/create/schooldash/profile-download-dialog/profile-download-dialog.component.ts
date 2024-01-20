import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';


@Component({
  selector: 'kt-profile-download-dialog',
  templateUrl: './profile-download-dialog.component.html',
  styleUrls: ['./profile-download-dialog.component.scss']
})
export class ProfileDownloadDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ProfileDownloadDialogComponent>, private loader: LoadingService) { }

  ngOnInit() {
    this.loader.show()
    console.log(this.data)
    this.loader.hide()
    this.data.experience_list.forEach(element => {
      element.joining_date = new Date(element.joining_date).toLocaleDateString() 
      element.reliving_date = new Date(element.reliving_date).toLocaleDateString() 
    });
  }

  close(){
    this.dialogRef.close()
  }


}
