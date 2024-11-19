import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private _headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(private _http: HttpClient) { }

  // Create a new item
  create(url: string, item: unknown, headers = this._headers): Observable<unknown> {
    return this._http.post<unknown>(url,item, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Read all items
  read(url: string,  headers = this._headers): Observable<unknown[]> {
    return this._http.get<unknown[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Read a single item by ID
  readById(url: string, id: number,  headers = this._headers): Observable<unknown> {
    return this._http.get<unknown>(`${url}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  put(url: string, headers =this._headers): Observable<unknown>{
    return this._http.put<unknown>(`${url}`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  putPost(url: string,item:unknown, headers =this._headers): Observable<unknown>{
    return this._http.put<unknown>(`${url}`, item, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an item using put request
  update(url: string, id: number, updatedItem: unknown,  headers = this._headers): Observable<unknown> {
    return this._http.put<unknown>(`${url}/${id}`, updatedItem, { headers }).pipe(
      catchError(this.handleError)
    );
  }

    // Update an item using patch request
    updatePatch(url: string, id: number, updatedItem: unknown,  headers = this._headers): Observable<unknown> {
      return this._http.patch<unknown>(`${url}/${id}`, updatedItem, { headers }).pipe(
        catchError(this.handleError)
      );
    }

  // Delete an item
  delete(url: string, id: number,  headers = this._headers): Observable<unknown> {
    return this._http.delete<unknown>(`${url}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 
  // downloadCsv(url: string, id: number, status: string): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'text/csv'
  //   });
  
  //   return this._http.get<Blob>(`${url}/${id}?status=${status}`, {
  //     headers,
  //     responseType: 'blob' as 'json' // Ensure responseType is 'blob'
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  downloadExcel(url: string, id: number, status: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    return this._http.get<Blob>(`${url}/${id}?status=${status}`, {
      headers,
      responseType: 'blob' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  

  // Handle HTTP error
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    const err = new Error(errorMessage);
    return throwError(() => err);
  }
}
