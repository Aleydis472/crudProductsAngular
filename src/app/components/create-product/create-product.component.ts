import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  createProduct: FormGroup;
  product = {}
  submitted = false;
  loading = false;
  id: string | null;
  title = 'Agregar Producto';
  countries: any
  default: string = 'Colombia';
  file: any;
  imagen: any;
  selectedFile = null;

  url = "gs://crudproductosangular-60c61.appspot.com/"
  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private toastr: ToastrService, private aRoute: ActivatedRoute, private storage: AngularFireStorage) {
    this.createProduct = this.fb.group({
      _id: ['', Validators.required],
      nombre: ['', Validators.required],
      caracteristicas: ['', Validators.required],
      fechaLanzamiento: ['', Validators.required],
      correoFabricante: ['', Validators.required],
      paisFabricacion: ['', Validators.required],
      precio: ['', Validators.required],
      unidadesD: ['', Validators.required],
      unidadesV: ['', Validators.required],
      imagen: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.getcoutries();
  }
  ngOnInit(): void {
    this.setProduct();
  }


  addEditProduct() {
    this.submitted = true;

    if (this.createProduct.invalid) {
      return;
    }

    if (this.id === null) {
      this.addProduct();
    } else {
      this.editProduct(this.id);
    }

  }


  addProduct() {

    const product: any = {
      _id: this.createProduct.value._id,
      nombre: this.createProduct.value.nombre,
      caracteristicas: this.createProduct.value.caracteristicas,
      fechaLanzamiento: this.createProduct.value.fechaLanzamiento,
      correoFabricante: this.createProduct.value.correoFabricante,
      paisFabricacion: this.createProduct.value.paisFabricacion,
      precio: this.createProduct.value.precio,
      unidadesD: this.createProduct.value.unidadesD,
      unidadesV: this.createProduct.value.unidadesV,
      imagen: this.createProduct.value.imagen,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    product.imagen = this.selectedFile

    console.log(this.selectedFile)
    this.loading = true
    this.productService.addProduct(product).then(() => {
      this.toastr.success('El producto se registro con exito.', 'Producto registrado');
      this.router.navigate(['/list-products']);
    }).catch(error => {
      this.toastr.error('Ha ocurrido un error!', 'ERROR');
    })

  }



  uploadImage(event: any) {
    // si se eligió la imagen
    if (event.target.files.length !== 0 || event.target.files[0] != null) {
      // obtengo el archivo completo de la img (nombre, tipo, tamaño, etc..)
      const file = event.target.files[0];
      // obtengo solo el nombre de la imagen
      const name = file.name;
      const fileRef = this.storage.ref(name);
      // subo imagen a firestorage con el nombre y todas sus prop(tipo, tamaño, etc..)
      const task = this.storage.upload(name, file);
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            this.imagen = fileRef.getDownloadURL();
            this.imagen.subscribe((url: any) => {
              console.log(url)
              this.selectedFile = url;


            });
          })
        )
        .subscribe();
    }
  }


  editProduct(id: string) {
    const product: any = {
      _id: this.createProduct.value._id,
      nombre: this.createProduct.value.nombre,
      caracteristicas: this.createProduct.value.caracteristicas,
      fechaLanzamiento: this.createProduct.value.fechaLanzamiento,
      correoFabricante: this.createProduct.value.correoFabricante,
      paisFabricacion: this.createProduct.value.paisFabricacion,
      precio: this.createProduct.value.precio,
      unidadesD: this.createProduct.value.unidadesD,
      unidadesV: this.createProduct.value.unidadesV,
      imagen: this.createProduct.value.imagen,
      fechaActualizacion: new Date()
    }
    product.imagen = this.selectedFile
    this.loading = true;
    this.productService.putProduct(id, product).then(() => {
      this.loading = false;
      this.toastr.info('El producto fue modificado con exito.', 'Producto modificado');
      this.router.navigate(['/list-products']);
    })
  }

  setProduct() {
    if (this.id !== null) {
      this.title = 'Editar Producto'
      this.loading = true;
      this.productService.getProduct(this.id).subscribe(data => {
        this.loading = false;
        console.log(data);
        this.createProduct.setValue({
          _id: data.payload.data()['_id'],
          nombre: data.payload.data()['nombre'],
          caracteristicas: data.payload.data()['caracteristicas'],
          fechaLanzamiento: data.payload.data()['fechaLanzamiento'],
          correoFabricante: data.payload.data()['correoFabricante'],
          paisFabricacion: data.payload.data()['paisFabricacion'],
          precio: data.payload.data()['precio'],
          unidadesD: data.payload.data()['unidadesD'],
          unidadesV: data.payload.data()['unidadesV'],
          imagen: data.payload.data()['imagen'],
        })
      })
    }
  }

  getcoutries() {
    this.productService.countries().subscribe(res => {
      this.countries = Object.values(res);
      this.createProduct.controls['paisFabricacion'].setValue(this.default,
        { onlySelf: true });
      this.createProduct.get('pais');
      //console.log(this.countries, 'esta llegando');
    })


  }



}



