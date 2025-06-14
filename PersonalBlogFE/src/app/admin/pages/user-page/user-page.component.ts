import { Component, OnInit } from '@angular/core';
import { BlogAppService } from 'src/app/shared/blog-app.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  constructor(public service: BlogAppService) {

  }

  ngOnInit(): void {
    this.service.refreshUser();
  }
}
