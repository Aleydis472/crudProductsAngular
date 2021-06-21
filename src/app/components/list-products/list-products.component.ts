import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: any[]= [];
  filterProducts = ''
  path: any; 
  countries: any[]= [];
  
  
  constructor(private productService:ProductService, private toastr: ToastrService) {}
  paginator: number = 1;
  
  ngOnInit(): void {
    this.getProducts();
  } 

  getProducts(){ 
    this.productService.getProducts().subscribe(data =>{
      this.products = [];
      data.forEach((element:any) => {
        this.products.push({ 
          id:element.payload.doc.id, 
          ...element.payload.doc.data()
        })
      });
      console.log(this.products)
    })
  } 

  deletedProduct(id:string){ 
    this.productService.deleteProduct(id).then(() =>{ 
      this.toastr.error('El producto fue eliminado con exito!', 'Registro Eliminado');
    }).catch(error =>{
      console.log(error);
    });
  }

  order(){
    this.productService.order().subscribe(data => {
      console.log(data, 'esta actualzando');
      this.products = [];
      data.forEach((element:any) => {
        this.products.push({ 
          id:element.payload.doc.id, 
          ...element.payload.doc.data()
        })
      });
    });
  }
 

 
}
