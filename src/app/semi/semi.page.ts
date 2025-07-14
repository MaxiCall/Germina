import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  NavController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-semi',
  templateUrl: './semi.page.html',
  styleUrls: ['./semi.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardContent,
  ]
})
export class SemiPage implements OnInit {

  constructor(private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }

  goToDettagli(id: string) {
    this.router.navigate(['/dettagli-semi', id]);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}