import { Component, OnInit, AfterViewInit,  ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { MatDialog } from '@angular/material/dialog';

import { ProductFormComponent } from './product-form/product-form.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private productsSubscription: Subscription;
  displayedColumns = ['image', 'date', 'name', 'description', 'price', 'actions']; 
  dataSource = new MatTableDataSource<Product>();
  selectedProduct: Product;

  constructor(private productService: ProductService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.productsSubscription = this.productService.productsChanged.subscribe((products: Product[]) => {
      this.dataSource.data = products;
    });
    this.productService.fetchAllProducts()
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator =  this.paginator;
  }

  doFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase() ;
  }

  addNewProduct(){
    const dialogRef = this.dialog.open(ProductFormComponent, {
      
    });
    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    })
  }

  onEditProduct(product: Product){
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: product
    });
    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    })
      this.selectedProduct = product;
  }
  onNewProductSubmit(){
    this.dialog.closeAll()
  }

  onDeleteProduct(id){
    this.productService.deleteProduct(id)
  }
}
