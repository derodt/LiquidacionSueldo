import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, AuthToken, Usuario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'auth_token';
  
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar token al inicializar
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.validateToken(token).subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user as Usuario);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private validateToken(token: string): Observable<Usuario> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Usuario>(`${this.API_URL}/auth/validate`, { headers });
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === role;
  }

  hasPermission(permission: string): boolean {
    // Implementar lógica de permisos
    const user = this.currentUserSubject.value;
    if (!user) return false;
    
    // Por ahora, permisos básicos por rol
    switch (user.rol) {
      case 'ADMIN_GENERAL':
        return true;
      case 'ADMIN_EMPRESA':
        return !permission.includes('GENERAL');
      case 'ADMIN_INSTALACION':
        return permission.includes('INSTALACION') || permission.includes('TRABAJADOR');
      default:
        return permission.includes('READ');
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }
}
