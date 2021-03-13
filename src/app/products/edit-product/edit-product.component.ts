import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Product } from '../product.model';
import { NgForm } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.less']
})
export class EditProductComponent implements OnInit {
  @Input() product: Product;
  @Input() title: string;
  @Output() modalClose = new EventEmitter<void>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    if(this.product !== null){
      this.productService.updateProduct({
        id: this.product.id,
        name: form.value.name,
        description: form.value.description,
        price: form.value.price
      })
      
    } else {
      this.productService.addProduct({
        name: form.value.name,
        description: form.value.description,
        price: form.value.price
      })
      form.reset();
      this.modalClose.emit()
    }
    
  }
}
