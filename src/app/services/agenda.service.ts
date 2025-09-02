import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  AgendaTurnos, 
  TurnoPlanificado, 
  TurnoRealizado, 
  AgendaData, 
  TurnoAgenda, 
  ValidationResult,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener agenda completa para una instalación y período
  getAgenda(instalacionId: number, año: number, mes: number): Observable<AgendaData> {
    return this.http.get<AgendaData>(`${this.API_URL}/instalaciones/${instalacionId}/agenda/${año}/${mes}`);
  }

  // Crear nueva agenda mensual
  createAgenda(instalacionId: number, año: number, mes: number): Observable<ApiResponse<AgendaTurnos>> {
    return this.http.post<ApiResponse<AgendaTurnos>>(
      `${this.API_URL}/instalaciones/${instalacionId}/agenda`,
      { año, mes }
    );
  }

  // Asignar o actualizar turno
  assignTurno(
    instalacionId: number, 
    trabajadorId: number, 
    fecha: Date, 
    turno: TurnoAgenda
  ): Observable<ApiResponse<TurnoPlanificado>> {
    return this.http.post<ApiResponse<TurnoPlanificado>>(
      `${this.API_URL}/instalaciones/${instalacionId}/agenda/turnos`,
      {
        trabajadorId,
        fechaTurno: fecha.toISOString(),
        ...turno
      }
    );
  }

  // Actualizar turno existente
  updateTurno(turnoId: number, turno: Partial<TurnoPlanificado>): Observable<ApiResponse<TurnoPlanificado>> {
    return this.http.put<ApiResponse<TurnoPlanificado>>(
      `${this.API_URL}/agenda/turnos/${turnoId}`,
      turno
    );
  }

  // Eliminar turno
  deleteTurno(turnoId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/agenda/turnos/${turnoId}`);
  }

  // Validar asignación de turno
  validateTurnoAssignment(
    trabajadorId: number,
    fecha: Date,
    horaInicio: string,
    horaFin: string
  ): Observable<ValidationResult> {
    const params = new HttpParams()
      .set('trabajadorId', trabajadorId.toString())
      .set('fecha', fecha.toISOString())
      .set('horaInicio', horaInicio)
      .set('horaFin', horaFin);

    return this.http.get<ValidationResult>(`${this.API_URL}/agenda/validate-turno`, { params });
  }

  // Cerrar agenda mensual
  closeAgenda(agendaId: number): Observable<ApiResponse<AgendaTurnos>> {
    return this.http.patch<ApiResponse<AgendaTurnos>>(
      `${this.API_URL}/agenda/${agendaId}/cerrar`,
      {}
    );
  }

  // Confirmar turnos realizados
  confirmTurnos(turnos: TurnoRealizado[]): Observable<ApiResponse<TurnoRealizado[]>> {
    return this.http.post<ApiResponse<TurnoRealizado[]>>(
      `${this.API_URL}/agenda/confirmar-turnos`,
      { turnos }
    );
  }

  // Obtener turnos realizados por período
  getTurnosRealizados(
    instalacionId: number, 
    año: number, 
    mes: number,
    trabajadorId?: number
  ): Observable<TurnoRealizado[]> {
    let params = new HttpParams()
      .set('año', año.toString())
      .set('mes', mes.toString());
    
    if (trabajadorId) {
      params = params.set('trabajadorId', trabajadorId.toString());
    }

    return this.http.get<TurnoRealizado[]>(
      `${this.API_URL}/instalaciones/${instalacionId}/turnos-realizados`,
      { params }
    );
  }

  // Copiar agenda de un mes anterior
  copyAgenda(
    instalacionId: number,
    añoOrigen: number,
    mesOrigen: number,
    añoDestino: number,
    mesDestino: number
  ): Observable<ApiResponse<AgendaTurnos>> {
    return this.http.post<ApiResponse<AgendaTurnos>>(
      `${this.API_URL}/instalaciones/${instalacionId}/agenda/copy`,
      {
        añoOrigen,
        mesOrigen,
        añoDestino,
        mesDestino
      }
    );
  }

  // Obtener resumen de horas por trabajador
  getResumenHoras(instalacionId: number, año: number, mes: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API_URL}/instalaciones/${instalacionId}/agenda/${año}/${mes}/resumen-horas`
    );
  }
}
