import { Component } from '@angular/core';
import { profileData } from '../dummy.data';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    profileData = profileData;
}
