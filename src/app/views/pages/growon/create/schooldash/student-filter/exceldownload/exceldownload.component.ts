import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-exceldownload',
  templateUrl: './exceldownload.component.html',
  styleUrls: ['./exceldownload.component.scss']
})
export class ExceldownloadComponent implements OnInit {
  current: number = 0
  all: number = 0
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExceldownloadComponent>) {
    this.current = this.data.current
    this.all = this.data.all
  }

  ngOnInit() {
  }

  close(value: string) {
    this.dialogRef.close(value)
  }
}
