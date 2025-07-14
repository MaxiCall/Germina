import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class LaunchScreenPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Navigate to map page after 1.5 seconds
    setTimeout(() => {
      this.router.navigate(['/mappa']);
    }, 1500);
  }
} 