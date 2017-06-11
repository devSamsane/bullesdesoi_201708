import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bds-logout',
  template: `
    <div fxLayout="row" fxFlex>
      <button md-button color="warn" (click)="onLogout()">Déconnexion</button>
    </div>
  `,
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  onLogout() {

  }
  constructor() { }

  ngOnInit() {
  }

}
