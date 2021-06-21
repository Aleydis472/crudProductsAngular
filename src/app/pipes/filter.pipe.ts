import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    const resultProducts = [];
    for(const product of value){ 
      if(product.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1 || product.paisFabricacion.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultProducts.push(product);
      }
    }
    return resultProducts;
  }

}
