import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'kt-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  message: any
  hasAction: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteDialogComponent>) {
    this.message = data.message
    this.hasAction = data.hasAction
  }

  ngOnInit() {
  }

  action(action: boolean) {
    this.dialogRef.close({ action: action })
  }

}
