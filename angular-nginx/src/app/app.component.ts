import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';

  makeApiCalls() {
    for (let i = 1; i <= 50; i++) {
      fetch('/api/test')
        .then(r => console.log(`Request ${i}: ${r.status}`))
        .catch(console.error);
    }
  }
}
