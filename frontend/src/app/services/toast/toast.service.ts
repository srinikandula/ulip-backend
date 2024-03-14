import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toastMessageObj:{
    "severity":  string,
    "summary": string,
    "detail":string
  } = { severity: 'success', summary: 'Success', detail: 'Message Content' }
  constructor() { }
}
