import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string
  ) {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      firstName,
      lastName,
      password,
      role
    });
  }

login(username: string, password: string) {
  return this.http.post<{ token: string, role: string, user: any }>(
    `${this.apiUrl}/login`,
    { username, password }
  ).pipe(
    tap(res => {
      this.setSession(res.token, res.role);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    })
  );
}

  setSession(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

getUserId(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ userId?: string }>(token);
    return decoded.userId ?? null;
  } catch (e) {
    console.error('Token decoding failed', e);
    return null;
  }
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getProfile() {
    const token = this.getToken();
    return this.http.get<any>(
      `${this.apiUrl}/me`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  uploadAvatar(formData: FormData) {
    const token = this.getToken();
    return this.http.post<{ avatar: string }>(
      `${this.apiUrl}/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

getAvatarUrl(): string | null {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user.avatar) {
      return user.avatar.startsWith('http')
        ? user.avatar
        : 'http://localhost:3000' + user.avatar;
    }
  }
  return null;
}
}
