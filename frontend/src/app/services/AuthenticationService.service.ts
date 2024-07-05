import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationServiceService {

    private currentUserSubject: any = BehaviorSubject<any>;
    public currentUser: any = Observable<any>;
    constructor(private http: HttpClient) {
        // @ts-ignore
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): any {

        return this.currentUserSubject.value;
    }

    public isAuthenticated(): string {
        // @ts-ignore
        return localStorage.getItem('currentUser');
    }
}
