import { Component } from '@angular/core';

const url = "https://wttr.in/?format=3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-angular';
  contador = 0;
  clima = "";


  obtenerClima() {
    fetch(url)
      .then(response => response.text())
      .then(texto => this.clima = texto)
      .catch(razon => console.log("no se pudo obtener el clima: " + razon));
  }

  incrementar() {
    this.contador++;
  }
}
