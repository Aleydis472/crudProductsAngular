import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private URL_API = 'https://restcountries.eu/rest/v2/all';
  constructor(private firestore: AngularFirestore, private http: HttpClient) { 
    
  }


  addProduct(product:ProductService){ 
    return this.firestore.collection('products').add(product);
  } 

  getProducts():Observable<any>{ 
    return this.firestore.collection('products', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  } 

  deleteProduct(id:string):Promise<any>{ 
    return this.firestore.collection('products').doc(id).delete();
  }

  getProduct(id: string):Observable<any>{ 
    return this.firestore.collection('products').doc(id).snapshotChanges();
  }

  putProduct(id: string, data:ProductService):Promise<any>{ 
    return this.firestore.collection('products').doc(id).update(data);
  } 

  order(){ 
    return this.firestore.collection('products', ref => ref.orderBy('_id', 'desc')).snapshotChanges();
  } 
  
  countries(){ 
    return this.http.get(this.URL_API)
  } 
  


}
