import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular/standalone';
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
  private static animationsPlayed: boolean = false;
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

  constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private toastController: ToastController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterType = params['filterType'] || null;
      this.activeFarmerId = params['activeFarmer'] || null;
      this.loadMap(this.filterType);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mapElement && this.mapElement.nativeElement) {
        this.loadMap(this.filterType);
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
          this.addUserMarker(lat, lng, false);
        },
        (error) => {
          const basicOptions = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000
          };
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              this.addUserMarker(lat, lng, false);
            },

          );
        },
        options
      );
    } else {
      this.addUserMarker(43.13, 12.25, false);
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

    this.map.addListener('click', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    });
  }

  addMarkers(seeds: Semilla[], activeFarmerId: string | null, markerMap: { [id: string]: google.maps.Marker }) {
    const shouldAnimate = !MappaPage.animationsPlayed;
    
    seeds.forEach((seed, index) => {
      const iconUrl = (seed.type === 'Contadino' || seed.type === 'Contadina')
        ? 'assets/map-icon-3.png'
        : 'assets/map-icon-2.png';

      const delay = shouldAnimate ? index * 100 : 0;
      
      setTimeout(() => {
        const marker = new google.maps.Marker({
          position: { lat: seed.lat, lng: seed.lng },
          map: this.map,
          title: seed.name,
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(38, 38),
            anchor: new google.maps.Point(19, 38)
          },
          animation: shouldAnimate ? google.maps.Animation.DROP : null
        });

        markerMap[seed.id] = marker;

        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1400);
          
          this.openPopup(seed, marker);
        });

        if (activeFarmerId && seed.id === activeFarmerId) {
          setTimeout(() => {
            this.openPopup(seed, marker);
          }, 200);
        }
      }, delay);
    });
    
    if (shouldAnimate) {
      MappaPage.animationsPlayed = true;
    }
  }

  addUserMarker(lat: number, lng: number, centerMap: boolean = false) {
    if (!this.map) {
      return;
    }

    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    const shouldAnimate = !MappaPage.animationsPlayed;
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
        animation: shouldAnimate ? google.maps.Animation.DROP : null
      });

      if (centerMap) {
        this.map.setCenter({ lat, lng });
        this.map.setZoom(13);
      }
    } catch (error) {
    }
  }

  goToUserLocation() {
    if (!this.map) {
      return;
    }

    if (this.userMarker && this.userMarker.getPosition()) {
      const position = this.userMarker.getPosition();
      if (position) {
        this.map.setCenter(position);
        this.map.setZoom(15);
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          if (this.userMarker) {
            this.userMarker.setAnimation(null);
          }
        }, 2000);
      }
    } else {
      this.requestUserLocation(true);
    }
  }

  private requestUserLocation(centerMap: boolean = false) {
    if (!navigator.geolocation) {
      this.showToast('La geolocalización no está soportada por este navegador.');
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.addUserMarker(lat, lng, centerMap);
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            this.showToast('Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            this.showToast('La información de ubicación no está disponible.');
            break;
          case error.TIMEOUT:
            this.showToast('La solicitud de ubicación ha expirado. Inténtalo de nuevo.');
            break;
          default:
            this.showToast('Ha ocurrido un error desconocido al obtener tu ubicación.');
            break;
        }
      },
      options
    );
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'top',
      color: 'warning'
    });
    toast.present();
  }
}