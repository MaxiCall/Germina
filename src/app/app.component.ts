/// <reference types="google.maps" />
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonRouterOutlet,
  ],
})
export class AppComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }


  isActive(path: string): boolean {
    return this.router.url === path;
  }

  isLaunchScreen(): boolean {
    return this.router.url === '/launch-screen';
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}