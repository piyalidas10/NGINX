import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  makeApiCalls() {
    for (let i = 1; i <= 50; i++) {
      fetch('/api/test')
        .then(r => console.log(`Request ${i}: ${r.status}`))
        .catch(console.error);
    }
  }
}
