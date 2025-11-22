import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.scss']
})
export class EntregasComponent {
  private http = inject(HttpClient);
  entregas: any[] = [];
  cargando = false;

  ngOnInit() {
    this.obtenerEntregas();
  }

  obtenerEntregas() {
    this.cargando = true;
    this.http.get<any[]>('http://localhost:4000/api/entregas').subscribe({
      next: (data) => {
        console.log('Entregas recibidas:', data); 
        this.entregas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando entregas:', err);
        this.cargando = false;
        alert('Hubo un error al cargar las entregas.');
      },
    });
  }
  
  actualizarEstado(entregaId: number, nuevoEstado: string) {
    this.http.put(`http://localhost:4000/api/entregas/${entregaId}`, { estado: nuevoEstado })
      .subscribe({
        next: () => {
          alert(`Entrega marcada como ${nuevoEstado}`);
          this.obtenerEntregas();
        },
        error: (err) => {
          console.error('Error actualizando entrega:', err);
          alert('Hubo un error al actualizar el estado de la entrega.');
        },
      });
  }
}
