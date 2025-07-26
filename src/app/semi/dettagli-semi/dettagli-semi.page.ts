// src/app/dettagli-semi/dettagli-semi.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonIcon, IonLabel, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dettagli-semi',
  templateUrl: './dettagli-semi.page.html',
  styleUrls: ['./dettagli-semi.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardTitle, IonCardContent,
    CommonModule
  ]
})
export class DettagliSemiPage implements OnInit {
  semilla: any; // Aquí guardaremos los datos de la semilla

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener el ID de la semilla de la URL (si usas rutas con parámetros)
    this.activatedRoute.paramMap.subscribe(params => {
      const semillaId = params.get('id'); // Asume que el ID de la semilla es un parámetro de ruta
      if (semillaId) {
        this.loadSemillaDetails(semillaId);
      }
    });
  }

  loadSemillaDetails(id: string) {
    // Aquí es donde harías una llamada a tu servicio de datos (API)
    // para obtener la información completa de la semilla basada en el ID.
    // Por ahora, usamos datos de ejemplo basados en las imágenes.
    if (id === 'fagiolino-del-trasimeno') {
      this.semilla = {
        hasRicette: true,
        id: 'fagiolino-del-trasimeno',
        name: 'Fagiolino del trasimeno',
        imageUrl: 'assets/semi2.png',
        cultivators: [
          { id: 'contadini-3', name: 'Giuseppe', image: 'assets/farmer-3.png' },
          { id: 'contadini-2', name: 'Gianluca', image: 'assets/farmer-2.png' }
        ],
        schedaTecnica: {
          avvicendamento: 'II fagiolo è considerato una coltura da rinnovo e si inserisce bene come coltura intercalare. Una corretta prassi di produzione richiederebbe di evitare il ristoppio, e di rispettare rotazioni con un intervallo minimo di due/tre anni tra due cicli successivi sullo stesso appezzamento. Si sconsiglia inoltre la successione a piante appartenenti alla stessa famiglia (Leguminose), per evitare la diffusione di patogeni comuni che possono permanere e svilupparsi sui residui colturali.'
        },
        preparazioneTerreno: {
          preparazioneTerreno: "Si consiglia una lavorazione profonda a 30-40 cm, aratura o ripuntatura in estate, seguita da un'operazione di affinamento del terreno in autunno e/o inverno. Nel caso di coltura intercalare ottimi risultati si ottengono con la lavorazione minima o con la non lavorazione."
        }
      };
    } else if (id === 'rapi-del-trasimeno') {
      this.semilla = {
        hasRicette: false,
        id: 'rapi-del-trasimeno',
        name: 'Rapi del trasimeno',
        imageUrl: 'assets/semi3.png',
        cultivators: [
          { id: 'contadini-1', name: 'Ugo', image: 'assets/farmer-1.png' }
        ],
        schedaTecnica: {
          avvicendamento: 'II fagiolo è considerato una coltura da rinnovo e si inserisce bene come coltura intercalare. Una corretta prassi di produzione richiederebbe di evitare il ristoppio, e di rispettare rotazioni con un intervallo minimo di due/tre anni tra due cicli successivi sullo stesso appezzamento. Si sconsiglia inoltre la successione a piante appartenenti alla stessa famiglia (Leguminose), per evitare la diffusione di patogeni comuni che possono permanere e svilupparsi sui residui colturali.'
        },
        preparazioneTerreno: {
          preparazioneTerreno: "Si consiglia una lavorazione profonda a 30-40 cm, aratura o ripuntatura in estate, seguita da un'operazione di affinamento del terreno in autunno e/o inverno. Nel caso di coltura intercalare ottimi risultati si ottengono con la lavorazione minima o con la non lavorazione."
        }
      };
    } else if (id === 'cipolla') {
      this.semilla = {
        hasRicette: true,
        id: 'cipolla',
        name: 'Cipolla',
        imageUrl: 'assets/semi1.png',
        cultivators: [
          { id: 'contadini-4', name: 'Antonietta', image: 'assets/farmer-4.png' }
        ],
        schedaTecnica: {
          avvicendamento: 'II fagiolo è considerato una coltura da rinnovo e si inserisce bene come coltura intercalare. Una corretta prassi di produzione richiederebbe di evitare il ristoppio, e di rispettare rotazioni con un intervallo minimo di due/tre anni tra due cicli successivi sullo stesso appezzamento. Si sconsiglia inoltre la successione a piante appartenenti alla stessa famiglia (Leguminose), per evitare la diffusione di patogeni comuni che possono permanere e svilupparsi sui residui colturali.'
        },
        preparazioneTerreno: {
          preparazioneTerreno: "Si consiglia una lavorazione profonda a 30-40 cm, aratura o ripuntatura in estate, seguita da un'operazione di affinamento del terreno in autunno e/o inverno. Nel caso di coltura intercalare ottimi risultati si ottengono con la lavorazione minima o con la non lavorazione."
        }
      };
    }
  }



  goToRicette(semillaId: string) {
    this.router.navigate(['/ricette', semillaId]);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToFarmer(farmerId: string) {
    this.router.navigate(['/mappa'], { queryParams: { activeFarmer: farmerId } });
  }
}