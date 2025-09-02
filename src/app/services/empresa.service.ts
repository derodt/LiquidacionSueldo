import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Empresa, 
  SolicitudInstalacion, 
  ApiResponse, 
  PaginatedResponse, 
  FilterOptions 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly API_URL = 'http://localhost:3000/api/empresas';

  constructor(private http: HttpClient) {}

  getEmpresas(filters?: FilterOptions): Observable<PaginatedResponse<Empresa>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<PaginatedResponse<Empresa>>(this.API_URL, { params });
  }

  getEmpresa(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.API_URL}/${id}`);
  }

  createEmpresa(empresa: Omit<Empresa, 'id' | 'fechaCreacion' | 'instalacionesActuales'>): Observable<ApiResponse<Empresa>> {
    return this.http.post<ApiResponse<Empresa>>(this.API_URL, empresa);
  }

  updateEmpresa(id: number, empresa: Partial<Empresa>): Observable<ApiResponse<Empresa>> {
    return this.http.put<ApiResponse<Empresa>>(`${this.API_URL}/${id}`, empresa);
  }

  deleteEmpresa(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  // Gestión de solicitudes de instalaciones
  getSolicitudesInstalacion(empresaId?: number): Observable<SolicitudInstalacion[]> {
    const url = empresaId 
      ? `${this.API_URL}/${empresaId}/solicitudes-instalacion`
      : `${this.API_URL}/solicitudes-instalacion`;
    return this.http.get<SolicitudInstalacion[]>(url);
  }

  createSolicitudInstalacion(solicitud: Omit<SolicitudInstalacion, 'id' | 'fechaSolicitud' | 'estado'>): Observable<ApiResponse<SolicitudInstalacion>> {
    return this.http.post<ApiResponse<SolicitudInstalacion>>(
      `${this.API_URL}/${solicitud.empresaId}/solicitudes-instalacion`, 
      solicitud
    );
  }

  procesarSolicitudInstalacion(solicitudId: number, decision: {
    estado: 'APROBADA' | 'RECHAZADA';
    observaciones?: string;
  }): Observable<ApiResponse<SolicitudInstalacion>> {
    return this.http.patch<ApiResponse<SolicitudInstalacion>>(
      `${this.API_URL}/solicitudes-instalacion/${solicitudId}`, 
      decision
    );
  }

  actualizarLimiteInstalaciones(empresaId: number, nuevoLimite: number): Observable<ApiResponse<Empresa>> {
    return this.http.patch<ApiResponse<Empresa>>(
      `${this.API_URL}/${empresaId}/limite-instalaciones`, 
      { limiteInstalaciones: nuevoLimite }
    );
  }
}
