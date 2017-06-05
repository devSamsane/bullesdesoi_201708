import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bds-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'Bulles de Soi';

  constructor() { }

  ngOnInit() {
  }

}
