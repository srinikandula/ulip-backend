import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeypageService {
  public createKeyBool:boolean = false
  public backDropFilterMenu:boolean = false
  public pageNav:number = 0
  constructor() { }
}
