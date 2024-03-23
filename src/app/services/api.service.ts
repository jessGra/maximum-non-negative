import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { InputRow } from "../models/input-row";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  readonly apiUrl = "https://65fdff9db2a18489b385b087.mockapi.io/maximum-get";
  constructor(private http: HttpClient) {}

  fetchMaximumGET(req: InputRow): Observable<any> {
    const { divider, remainder, limit } = req;
    return this.http.get(
      this
        .apiUrl /* { params: { divider: divider.toString(), remainder: remainder.toString(), limit: limit.toString() } }*/
    );
  }

  fetchMaximumPOST(req: InputRow[]): Observable<any> {
    return this.http.post(this.apiUrl, req);
  }
}
