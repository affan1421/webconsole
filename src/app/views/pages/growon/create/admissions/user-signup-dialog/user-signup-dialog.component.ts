import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'kt-user-signup-dialog',
  templateUrl: './user-signup-dialog.component.html',
  styleUrls: ['./user-signup-dialog.component.scss']
})
export class UserSignupDialogComponent implements OnInit {
  isActive: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UserSignupDialogComponent>) {
    this.isActive = data
    console.log(this.isActive)
  }

  ngOnInit() {
  }

  confirmed() {
    this.dialogRef.close({ confirmed: true })
  }
  cancel() {
    this.dialogRef.close({ confirmed: false })
  }
}
