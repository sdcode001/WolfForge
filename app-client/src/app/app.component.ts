import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { EncryptionService } from '../utils/encrypt-decrypt-util';


/* If you dynamically load a child component (e.g., via *ngIf, ngSwitch, or component outlet), Angular 
destroys the previously rendered child component when switching to another. The parent component is not 
destroyed unless explicitly removed or the parent route/component is destroyed. */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
   //TODO- create landing page like Replit
   //if user is already signed in and session is not expired then redirect to dashboard

   userId = 'sdcode001'

   constructor(private router: Router, private encryptionService: EncryptionService){ }

   async ngOnInit() {
      this.encryptionService.generateKey();
      this.router.navigate(['/dashboard', this.userId])
   }

}
