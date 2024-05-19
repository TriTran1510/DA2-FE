import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    apiRoot = 'http://127.0.0.1:5000/';
    headers: HttpHeaders;

    constructor(
        private http: HttpClient,
    ) {
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'multipart/form-data');
        // Add any other headers you need
    }

    async doGET(methodUrl: string, params: any): Promise<any> {
        const apiURL = `${this.apiRoot}${methodUrl}`;
        try {
            const data = await this.http.get(apiURL, { headers: this.headers, params }).toPromise();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async doPOST(methodUrl: string, file: File): Promise<Response | any> {
        const apiURL = `${this.apiRoot}${methodUrl}`;
        const formData: FormData = new FormData();
      
        // Append file to formData
        formData.append('file', file, file.name);
      
        try {
          const response = await fetch(apiURL, {
            method: 'POST',
            body: formData
          });
      
          return response;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
      

    // Implement other HTTP methods (PUT, DELETE, etc.) as needed
}
