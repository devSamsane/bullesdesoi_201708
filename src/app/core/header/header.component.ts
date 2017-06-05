import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bds-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
