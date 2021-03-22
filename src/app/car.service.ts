import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Car } from './car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  baseUrl = 'http://localhost/api';
cars: Car[] = [];

constructor(private http: HttpClient) { }

  getAll(): Observable<Car[]> {
    return this.http.get(`${this.baseUrl}/list`).pipe(
      map((res:any) => {
        this.cars = res['data'];
        return this.cars;
    }),
    catchError(this.handleError));
  }

  store(car: Car): Observable<Car[]> {
    return this.http.post(`${this.baseUrl}/store`, { data: car })
      .pipe(map((res:any) => {
        this.cars.push(res['data']);
        return this.cars;
      }),
      catchError(this.handleError));
  }

  update(car: Car): Observable<Car[]> {
    return this.http.put(`${this.baseUrl}/update`, { data: car })
      .pipe(map((res:any) => {
        const theCar:any = this.cars.find((item:any) => {
          return +item['id'] === +res['id'];
        });
        if (theCar) {
          theCar['price'] = +res['price'];
          theCar['model'] = res['model'];
        }
        return this.cars;
      }),
      catchError(this.handleError));
  }

  delete(id: number): Observable<Car[]> {
    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.delete(`${this.baseUrl}/delete`, { params: params })
      .pipe(map(res => {
        const filteredCars = this.cars.filter((car:any) => {
          return +car['id'] !== +id;
        });
        return this.cars = filteredCars;
      }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
