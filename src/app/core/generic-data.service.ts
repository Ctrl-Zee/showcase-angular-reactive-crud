import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiRoot = environment.apiRoot;

@Injectable({
  providedIn: 'root',
})
export class GenericDataService {
  token = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    }),
    params: new HttpParams(),
  };

  // Define header options to be applied to all requests
  constructor(private http: HttpClient) {}

  public list<T>(endPoint: string): Observable<T> {
    return this.http.get<T>(`${apiRoot}/${endPoint}`, this.httpOptions);
  }

  // List by Post
  public listByPost<T>(endPoint: string, request: T | any): Observable<T> {
    return this.http.post<T>(
      `${apiRoot}/${endPoint}`,
      request,
      this.httpOptions
    );
  }

  // Post
  public post<T>(endPoint: string, request: T | any): Observable<T> {
    return this.http.post<T>(
      `${apiRoot}/${endPoint}`,
      request,
      this.httpOptions
    );
  }

  // Read
  public read<T>(endPoint: string, id?: number | string): Observable<T> {
    return this.http.get<T>(
      `${apiRoot}/${endPoint}/${id ?? ''}`,
      this.httpOptions
    );
  }

  // Create
  public create<T>(endPoint: string, objToCreate: T | any): Observable<T> {
    return this.http.post<T>(
      `${apiRoot}/${endPoint}`,
      objToCreate,
      this.httpOptions
    );
  }

  // Update
  public update<T>(endPoint: string, objToUpdate: T | any): Observable<T> {
    return this.http.put<T>(
      `${apiRoot}/${endPoint}/${objToUpdate.id}`,
      objToUpdate,
      this.httpOptions
    );
  }

  // Delete
  public delete<T>(endPoint: string, id: number | string): Observable<T> {
    return this.http.delete<T>(
      `${apiRoot}/${endPoint}/${id ?? ''}`,
      this.httpOptions
    );
  }
}
