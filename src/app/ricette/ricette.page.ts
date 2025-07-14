import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-ricette',
  templateUrl: './ricette.page.html',
  styleUrls: ['./ricette.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonCardTitle]
})
export class RicettePage implements OnInit {

  ingredienti: string = '';
  textareaHeight: number = 120;
  maxHeight: number = 300; // Límite máximo de altura en px
  get imgHeight(): string {
    return Math.min(this.textareaHeight, this.maxHeight) + 'px';
  }
  onInput(event?: Event) {
    // Ajustar la altura del textarea y la imagen según el contenido
    const textarea = event?.target as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight * 1.7;
      textarea.style.height = Math.min(newHeight, this.maxHeight) + 'px';
      textarea.style.overflowY = newHeight > this.maxHeight ? 'auto' : 'hidden';
      this.textareaHeight = newHeight;
    }
  }


  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goToDettagliRicette(id: string) {
    this.router.navigate(['/dettagli-ricette', id]);
  }
  constructor(private router: Router) { }

  ngOnInit() {
  }

}