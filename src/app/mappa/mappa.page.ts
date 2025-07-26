import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export interface Semilla {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

declare const google: any;

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
  userMarker: google.maps.Marker | null = null;
  activeFarmerId: string | null = null;
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
      this.activeFarmerId = params['activeFarmer'] || null;
      this.loadMap(this.filterType);
      this.getCurrentPosition();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mapElement && this.mapElement.nativeElement) {
        this.loadMap(this.filterType);
        this.getCurrentPosition();
      } else {
        console.error('El elemento del mapa no está disponible en ngAfterViewInit');
      }
    }, 100);
  }

  getCurrentPosition() {
    if (!this.map) {
      setTimeout(() => this.getCurrentPosition(), 1000);
      return;
    }

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.addUserMarker(lat, lng);
        },
        (error) => {
          console.error('❌ Error al obtener la posición actual:', error);
          console.error('Código de error:', error.code);
          console.error('Mensaje de error:', error.message);
          console.log('Intentando con opciones básicas...');
          const basicOptions = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000
          };
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              this.addUserMarker(lat, lng);
            },

          );
        },
        options
      );
    } else {
      console.error('La geolocalización no está soportada por este navegador.');
      this.addUserMarker(43.13, 12.25);
    }
  }

  private createMarkerContent(seed: Semilla): string {
    return `
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
  }

  private configurePopupCloseButton(seedId: string) {
    setTimeout(() => {
      const defaultCloseBtn = document.querySelector('button.gm-ui-hover-effect');
      if (defaultCloseBtn) {
        (defaultCloseBtn as HTMLElement).style.display = 'none';
      }
      const closeBtn = document.getElementById(`close-popup-btn-${seedId}`);
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
    }, 100);
  }

  private openPopup(seed: Semilla, marker: google.maps.Marker) {
    const contentString = this.createMarkerContent(seed);
    this.zone.run(() => {
      this.infoWindow.setContent(contentString);
      this.infoWindow.open(this.map, marker);
      this.configurePopupCloseButton(seed.id);
    });
  }

  async loadMap(filterType?: string | null) {
    const initialLat = 43.13;
    const initialLng = 12.25;
    const initialZoom = 10;

    if (!this.mapElement?.nativeElement || typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API o elemento del mapa no están disponibles.');
      return;
    }

    const mapOptions: google.maps.MapOptions = {
      center: { lat: initialLat, lng: initialLng },
      zoom: initialZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      draggable: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    const markerMap: { [id: string]: google.maps.Marker } = {};
    const seedsToDisplay = filterType
      ? this.variedades.filter(seed => seed.type === filterType)
      : this.variedades;

    this.addMarkers(seedsToDisplay, this.activeFarmerId, markerMap);

    if (this.activeFarmerId) {
      const seed = this.variedades.find(s => s.id === this.activeFarmerId);
      if (seed) {
        const marker = markerMap[this.activeFarmerId];
        if (marker) {
          this.openPopup(seed, marker);
        } else {
          console.warn(`No se encontró marcador para activeFarmerId: ${this.activeFarmerId}`);
        }
      } else {
        console.warn(`No se encontró semilla para activeFarmerId: ${this.activeFarmerId}`);
      }
    }

    this.map.addListener('click', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    });
  }

  addMarkers(seeds: Semilla[], activeFarmerId: string | null, markerMap: { [id: string]: google.maps.Marker }) {
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

      markerMap[seed.id] = marker;

      marker.addListener('click', () => {
        this.openPopup(seed, marker);
      });
    });
  }

  addUserMarker(lat: number, lng: number) {
    if (!this.map) {
      console.error('ADDUSER: El mapa no está disponible');
      return;
    }

    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    try {
      this.userMarker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: 'Tu ubicación actual',
        icon: {
          url: 'assets/map-icon-1.png',
          scaledSize: new google.maps.Size(38, 38),
          anchor: new google.maps.Point(19, 38)
        },
        animation: google.maps.Animation.DROP
      });

      if (this.userMarker && this.userMarker.getMap()) {
        console.log('ADDUSER: ✅ Marcador añadido al mapa correctamente');
      } else {
        console.error('ADDUSER: ❌ El marcador no se añadió al mapa');
      }
    } catch (error) {
      console.error('ADDUSER: ❌ Error al añadir el marcador:', error);
    }
  }
}