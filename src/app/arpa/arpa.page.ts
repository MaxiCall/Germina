import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonCardContent, IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-arpa',
  templateUrl: './arpa.page.html',
  styleUrls: ['./arpa.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonCardContent, IonCard, IonCardTitle]
})
export class ArpaPage implements OnInit {

  commenti: string = '';
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





  constructor() { }

  ngOnInit() {

  }
}
