import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public credentials = {

    clientId: '357d4a004a754b5688e3c07df4ed52db',
    clientSecret: '8395db256ef4439ab96968c5ca946033',
    accessToken: ''

  };

  public poolURlS = {

    authorize: 'https://accounts.spotify.com/es-ES/authorize?client_id=' +
      this.credentials.clientId + '&response_type=token' +
      '&redirect_uri=' + encodeURIComponent('http://localhost:4200/callback') +
      '&expires_in=3600',
    refreshAccessToken: 'https://accounts.spotify.com/api/token'


  };
  constructor( private _http: HttpClient) { 
    this.upDateToken()
  }

  upDateToken(){
    this.credentials.accessToken = sessionStorage.getItem('token') || '';
  }

  getQuery(query: string){

    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.credentials.accessToken})};

    return this._http.get(URL, HEADER);

  }

  checkTokenSpoLogin() {

    this.checkTokenSpo() || (sessionStorage.setItem('refererURL', location.href), window.location.href = this.poolURlS.authorize);

  }

  checkTokenSpo() {

    return !!this.credentials.accessToken;

  }

  tokenRefreshURL() {

    this.checkTokenSpo() && alert('Expiro la sesión');

    this.credentials.accessToken = '';
    sessionStorage.removeItem('token');
    this.checkTokenSpoLogin();

  }
  

  getNewReleases() {
    return this.getQuery("browse/new-releases")
      .pipe(map( (data: any) => data.albums.items));
  }

  getFeaturedPlaylists() {
    return this.getQuery(`browse/featured-playlists`)
      .pipe(map( (data: any) => data.playlists.items));
  }

  getArtistas(termino: string) {
    
    return this.getQuery(`search?q=${ termino }&type=artist&limit=20`)
      .pipe(map( (data: any) => {
        return data.artists.items;
      }));
    
    // this.http.get(`https://api.spotify.com/v1/search?q=${ termino }&type=artist&limit=15`, {headers})
    //     .pipe(map( (data: any) => {
    //       return data.artists.items;
    //     }));
  }

  getPlaylist(id: string) {
    return this.getQuery(`playlists/${id}`)
  }

  getArtista(id: string) {
    return this.getQuery(`artists/${id}`)
  }

  getTopTracks(id: string) {
    return this.getQuery(`artists/${id}/top-tracks?market=US`)
      .pipe(map( (data: any) => {
        return data["tracks"];
      }));
  }

  getTopPlaylistTracks(id: string) {
    return this.getQuery(`playlists/${id}/tracks&limit=20`)
      .pipe(map( (data: any) => {
        return data["tracks"];
      }));
  }

 
  
}
