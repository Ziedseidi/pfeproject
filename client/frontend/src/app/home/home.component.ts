import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router : Router){}

  navigateTo(formType: string): void {
    if (formType === 'avocat') {
      this.router.navigate(['/form-avocat']);
    } else if (formType === 'client') {
      this.router.navigate(['/form-client']);
    } else if (formType === 'expert') {
      this.router.navigate(['/form-expert']);
    }
  }

}
