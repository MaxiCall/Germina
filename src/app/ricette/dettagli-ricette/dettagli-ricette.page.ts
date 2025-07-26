// src/app/dettagli-semi/dettagli-semi.page.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonCard, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { MappaPage } from '../../mappa/mappa.page';

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
export class DettagliRicettePage implements OnInit, AfterViewInit {
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

  ngAfterViewInit() {
    // Método para asegurar que el componente está completamente cargado
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
        preparazione: `Per la zuppa di fagioli dei pionieri, iniziamo mettendo dentro una pentola capiente, l'olio evo, aglio, cipolla, carota, sedano e porro. Lasciamo soffriggere per qualche secondo. Aggiungiamo il concentrato di pomodoro e il brodo di pollo caldo. Lasciamo cuocere per circa 15 minuti...`,
        autore: { id: 'contadini-4', name: 'Antonietta', image: 'assets/farmer-4.png' }
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
        preparazione: `Per la zuppa di fagioli dei pionieri, iniziamo mettendo dentro una pentola capiente, l'olio evo, aglio, cipolla, carota, sedano e porro. Lasciamo soffriggere per qualche secondo. Aggiungiamo il concentrato di pomodoro e il brodo di pollo caldo. Lasciamo cuocere per circa 15 minuti..`,
        autore: { id: 'contadini-1', name: 'Ugo', image: 'assets/farmer-1.png' }
      };
    }
  }
  // Simplificar el método navigateToFarmer
  navigateToFarmer(farmerId: string) {
    this.router.navigate(['/mappa'], { queryParams: { activeFarmer: farmerId } });
  }
}
