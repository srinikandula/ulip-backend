import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})


export class apiService {
    // mainUrl = 'http://localhost:5000/';
    mainUrl = environment.baseUrl;
}
