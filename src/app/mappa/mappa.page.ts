
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Semilla {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  lat: number;
  lng: number;
}
declare const google: any;

// Extiende la interfaz Window para evitar error de tipo en __maps_reload
declare global {
  interface Window {
    __maps_reload?: boolean;
  }
}
@Component({
  selector: 'app-mappa',
  templateUrl: './mappa.page.html',
  styleUrls: ['./mappa.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MappaPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map: any;
  infoWindow: any;
  userMarker: google.maps.Marker | null = null; // Reintroducir la propiedad userMarker

  variedades: Semilla[] = [
    { id: 'fagiolino-verde-nano', name: 'Fagiolino verde nano', type: 'Fagioli', imageUrl: 'assets/seed-icon1.png', lat: 43.140, lng: 12.250 },
    { id: 'favino', name: 'Favino', type: 'Favino', imageUrl: 'assets/seed-icon2.png', lat: 43.135, lng: 12.260 },
    { id: 'zucca-da-maiali', name: 'Zucca da maiali', type: 'Zucca', imageUrl: 'assets/seed-icon3.png', lat: 43.120, lng: 12.220 },
    { id: 'fagiolino-verde-nano-2', name: 'Favino 2', type: 'favino', imageUrl: 'assets/seed-icon1.png', lat: 43.125, lng: 12.180 },
    { id: 'favino-2', name: 'Favino 2', type: 'Favino', imageUrl: 'assets/seed-icon2.png', lat: 43.090, lng: 12.290 },
    { id: 'zucca-da-maiali-2', name: 'Zucca da maiali 2', type: 'Zucca', imageUrl: 'assets/seed-icon3.png', lat: 43.085, lng: 12.300 },
    { id: 'fagiolino-verde-nano-3', name: 'Fagiolino verde nano 3', type: 'Fagioli', imageUrl: 'assets/seed-icon1.png', lat: 43.070, lng: 12.310 },
    { id: 'favino-3', name: 'Favino 3', type: 'Favino', imageUrl: 'assets/seed-icon2.png', lat: 43.150, lng: 12.290 },
    { id: 'contadini-1', name: 'Ugo', type: 'Contadino', imageUrl: 'assets/farmer-1.png', lat: 43.200, lng: 12.210 },
    { id: 'contadini-2', name: 'Gianluca', type: 'Contadino', imageUrl: 'assets/farmer-2.png', lat: 43.080, lng: 12.210 },
    { id: 'contadini-3', name: 'Giuseppe', type: 'Contadino', imageUrl: 'assets/farmer-3.png', lat: 43.175, lng: 12.275 },
    { id: 'contadini-4', name: 'Antonietta', type: 'Contadina', imageUrl: 'assets/farmer-4.png', lat: 43.140, lng: 12.170 },
    { id: 'contadini-5', name: 'Ugo 2', type: 'Contadino', imageUrl: 'assets/farmer-1.png', lat: 43.130, lng: 12.200 },
    { id: 'contadini-6', name: 'Gianluca 2', type: 'Contadino', imageUrl: 'assets/farmer-2.png', lat: 43.190, lng: 12.250 },
    { id: 'contadini-7', name: 'Giuseppe 2', type: 'Contadino', imageUrl: 'assets/farmer-3.png', lat: 43.095, lng: 12.225 },
    { id: 'contadini-8', name: 'Antonietta 2', type: 'Contadina', imageUrl: 'assets/farmer-4.png', lat: 43.110, lng: 12.270 }
  ];
  private filterType: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterType = params['filterType'] || null;
      console.log('NGONINIT: Tipo de filtro obtenido:', this.filterType);
    });
  }

  goToMap() {
    this.router.navigate(['/mappa-semi']);
  }

  goToList() {
    this.router.navigate(['/lista-semi']);
  }

  ngAfterViewInit() {
    console.log('NGAFTERVIEWINIT: Iniciando carga del mapa...');
    // Comprobación robusta para Google Maps API
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      // Si estamos en desarrollo y la API no está, recarga la página completamente una vez
      if (!window.__maps_reload) {
        window.__maps_reload = true;
        console.warn('Google Maps API no está cargada. Recargando la página para forzar la carga del script...');
        window.location.reload();
        return;
      } else {
        // Si ya recargó y sigue sin estar, muestra error
        alert('No se pudo cargar Google Maps. Por favor, reinicia el servidor de desarrollo.');
        return;
      }
    }
    this.loadMap(this.filterType);
    this.getCurrentPosition(); // Obtener la posición actual del usuario
  }

  getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log('Posición actual obtenida:', lat, lng);
                this.addUserMarker(lat, lng); // Añadir marcador en la posición actual
            },
            (error) => {
                console.error('Error al obtener la posición actual:', error);
            }
        );
    } else {
        console.error('La geolocalización no está soportada por este navegador.');
    }
}

  async loadMap(filterType?: string | null) {
    // Coordenadas y zoom para la vista inicial del mapa (como en las imágenes)
    const initialLat = 43.13;
    const initialLng = 12.25; // Ajustado ligeramente para centrar mejor la vista de las imágenes
    const initialZoom = 10;

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API no está cargada.');
      return;
    }

    if (!this.mapElement || !this.mapElement.nativeElement) {
      console.error('El elemento del mapa (#map) no está disponible.');
      return;
    }

    if (this.map) {
      this.map = null;
    }

    const mapOptions: google.maps.MapOptions = {
      center: { lat: initialLat, lng: initialLng },
      zoom: initialZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      draggable: true // El mapa es completamente arrastrable
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.infoWindow = new google.maps.InfoWindow();

    let seedsToDisplay: Semilla[] = [];
    if (filterType) {
      seedsToDisplay = this.variedades.filter(seed => seed.type === filterType);
      console.log('Semillas filtradas:', seedsToDisplay);
    } else {
      seedsToDisplay = this.variedades;
      console.log('Mostrando todas las semillas:', seedsToDisplay);
    }

    this.addMarkers(seedsToDisplay);
}

  // Eliminado el método addHomeMarker y referencias relacionadas

  // Eliminado startTrackingUserPosition()
  // Eliminado ngOnDestroy()

  addUserMarker(lat: number, lng: number) {
    // Eliminar marcador anterior del usuario si existe para que no se dupliquen
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    this.userMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Tu ubicación actual',
      icon: {
        url: 'assets/map-icon-1.png', // Icono actualizado para la ubicación actual del usuario
        scaledSize: new google.maps.Size(38, 38),
        anchor: new google.maps.Point(19, 38)
      },
      animation: google.maps.Animation.DROP
    });

    console.log('Ubicación actual del usuario mostrada en el mapa:', lat, lng);
}

  addMarkers(seeds: Semilla[]) {
    seeds.forEach(seed => {
      const iconUrl = (seed.type === 'Contadino' || seed.type === 'Contadina')
        ? 'assets/map-icon-3.png'
        : 'assets/map-icon-2.png';

      const marker = new google.maps.Marker({
        position: { lat: seed.lat, lng: seed.lng },
        map: this.map,
        title: seed.name,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(38, 38),
          anchor: new google.maps.Point(19, 38)
        },
        animation: google.maps.Animation.DROP
      });

      const contentString = `
        <div style="max-width: 270px; font-family: 'Segoe UI', Arial, sans-serif; color: #222;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${seed.imageUrl}" alt="${seed.name}" style="width: 80px; height: 80px; object-fit: cover;" />
            <div style="flex:1;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                <h3 style="margin: 5px 0 15px 0; font-size: 1.1em; color: #b48a00; flex:1;">${seed.name}</h3>
                <button id="close-popup-btn-${seed.id}" style="background: none; border: 0; outline: none; color: #b48a00; font-size: 2.1em; font-weight: bold; cursor: pointer; padding: 0 8px; line-height: 1; position: relative; top: -10px;">&times;</button>
              </div>
              <span style="font-size: 0.95em; background: #fffbe6; color: #b48a00; border-radius: 6px; padding: 2px 8px; border: 1px solid #e0c36a;">${seed.type}</span>
            </div>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        this.zone.run(() => {
          this.infoWindow.setContent(contentString);
          this.infoWindow.open(this.map, marker);
          setTimeout(() => {
            const defaultCloseBtn = document.querySelector('button.gm-ui-hover-effect');
            if (defaultCloseBtn) {
              (defaultCloseBtn as HTMLElement).style.display = 'none';
            }
            // Botón Dettagli eliminado
            const closeBtn = document.getElementById(`close-popup-btn-${seed.id}`);
            if (closeBtn) {
              closeBtn.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (this.infoWindow) {
                  this.infoWindow.close();
                }
                return false;
              };
            }
          }, 0);
        });
      });
    });

    if (this.map) {
      this.map.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
      });
    }
  }
}