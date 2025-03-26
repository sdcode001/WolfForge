import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { ResponseData } from './dashboard.model';


@Injectable({providedIn: 'root'})
export class DashboardService {
    //primary server
    private readonly REST_API_SERVER = 'http://localhost:3000/create' 

    constructor(private http: HttpClient){}

    public createProject(username: string, template: string): Observable<ResponseData> {
        let params = new HttpParams();
        params = params.append('template', template);
        params = params.append('username', username);

        return this.http.get<ResponseData>(this.REST_API_SERVER, {params: params});
    }
}