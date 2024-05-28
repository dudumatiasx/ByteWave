import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  @Input() title = 'Title';
  @Input() divider = true;
  @Input() return = true;

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  backClicked() {
    this._location.back();
  }
}
