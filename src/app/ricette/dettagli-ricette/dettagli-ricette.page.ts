
// Limpieza de métodos duplicados innecesarios
// src/app/dettagli-semi/dettagli-semi.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonCard, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dettagli-ricette',
  templateUrl: './dettagli-ricette.page.html',
  styleUrls: ['./dettagli-ricette.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardTitle, IonCardContent,
    CommonModule
  ]
})
export class DettagliRicettePage implements OnInit {
  ricetta: any; // Aquí guardaremos los datos de la receta

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener el ID de la receta de la URL (si usas rutas con parámetros)
    this.activatedRoute.paramMap.subscribe(params => {
      const ricettaId = params.get('id'); // Asume que el ID de la receta es un parámetro de ruta
      if (ricettaId) {
        this.loadRicettaDetails(ricettaId);
      }
    });
  }

  loadRicettaDetails(id: string) {
    if (id === 'zuppa-di-fagioli-americani') {
      this.ricetta = {
        id: 'zuppa-di-fagioli-americani',
        name: 'Zuppa di fagioli americani',
        imageUrl: 'assets/semi4.png',
        ingredienti: [
          '300g di fagioli',
          'olio evo q.b.',
          '1 carota',
          '1 cucchiaio di concentrato di pomodoro',
          '1 cipolla',
          '1/2 porro',
          '1 costa di sedano',
          '200 ml di brodo di pollo',
          '1 spicchio di aglio',
          'sale e pepe q.b.',
          'pomodorini q.b.',
        ],
        preparazione: `Per la zuppa di fagioli dei pionieri, iniziamo mettendo dentro una pentola capiente, l'olio evo, aglio, cipolla, carota, sedano e porro. Lasciamo soffriggere per qualche secondo. Aggiungiamo il concentrato di pomodoro e il brodo di pollo caldo. Lasciamo cuocere per`,
        autore: { name: 'Antonietta', image: 'assets/farmer-4.png' }
      };

    } else if (id === 'zuppa-di-fagioli-americani2') {
      this.ricetta = {
        id: 'zuppa-di-fagioli-americani2',
        name: 'Zuppa di fagioli americani',
        imageUrl: 'assets/semi5.png',
        ingredienti: [
          '300g di fagioli',
          'olio evo q.b.',
          '1 carota',
          '1 cucchiaio di concentrato di pomodoro',
          '1 cipolla',
          '1/2 porro',
          '1 costa di sedano',
          '200 ml di brodo di pollo',
          '1 spicchio di aglio',
          'sale e pepe q.b.',
          'pomodorini q.b.',
        ],
        preparazione: `Per la zuppa di fagioli dei pionieri, iniziamo mettendo dentro una pentola capiente, l'olio evo, aglio, cipolla, carota, sedano e porro. Lasciamo soffriggere per qualche secondo. Aggiungiamo il concentrato di pomodoro e il brodo di pollo caldo. Lasciamo cuocere per`,
        autore: { name: 'Ugo', image: 'assets/farmer-1.png' }
      };
    }
  }


  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goToMappa() {
    this.router.navigateByUrl('/mappa');
  }

}
