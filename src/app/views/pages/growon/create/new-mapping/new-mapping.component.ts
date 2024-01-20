import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../loader/loading/loading.service';
import { CreateservicesService } from '../services/createservices.service';

@Component({
  selector: 'kt-new-mapping',
  templateUrl: './new-mapping.component.html',
  styleUrls: ['./new-mapping.component.scss']
})
export class NewMappingComponent implements OnInit {
  classes: any = []
  constructor(private apiService: CreateservicesService, private loadingService: LoadingService) {
    this.getMapDetails()
  }

  ngOnInit() {
  }

  getMapDetails() {
    this.apiService.getMappingDetails().subscribe((response: any) => {
      this.loadingService.show()
      this.classes = response.body.data
      this.loadingService.hide()
    })
  }
}
