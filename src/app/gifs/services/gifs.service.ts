import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
// const GIPHY_API_KEY = '7ewyVEncwrvCVxP0zFBUXgJ5KN3jgknc'; --> ESTO TAMBIEN ES VALIDO


@Injectable({providedIn: 'root'})
export class GifsService {

    public gifList: Gif[] = [];

    private _tagsHistory: string[] = [];
    private apiKey:       string = 'RyIvyprN3c5v4wnLqWe64rLwVBAxjI86';
    private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

    constructor( private http: HttpClient) {
      this.loadLocalStorage();
      console.log('Gifs Service Ready');
    }

    get tagsHistory() {
        return [...this._tagsHistory];
    }

    private organizehistory( tag:string ) {
      tag = tag.toLowerCase();

      if ( this._tagsHistory.includes(tag) ) {
        this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
      }

      this._tagsHistory.unshift( tag );
      this._tagsHistory = this.tagsHistory.splice(0,10);
      this.saveLocalStorage();
     }

    private saveLocalStorage():void {
      localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocalStorage():void {
      if( !localStorage.getItem('history')) return;


      //Hola hemocho


      this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

      if( this._tagsHistory.length === 0 ) return;

      this.searchTag(this._tagsHistory[0]);
    }


    async searchTag( tag: string ):Promise<void> {
      if( tag.length === 0 ) return;
      this.organizehistory( tag );

      const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10')
      .set('q', tag );


      this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
        .subscribe( (resp) => {
          this.gifList = resp.data;
          // console.log({ gifs: this.gifList });
        });
    }
}
