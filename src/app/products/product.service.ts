import { Subject } from 'rxjs';
import { Product } from "./product.model";
import { map } from 'rxjs/operators/map';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';

@Injectable()
export class ProductService{
    productsChanged = new Subject<Product[]>();
    productChanged = new Subject<Product>();
    private availableProducts: Product[]; 
    private selectedProduct:Product;

    constructor(private db: AngularFirestore) { }

    fetchAllProducts(){
        this.db
          .collection<Product>('products')
          .snapshotChanges()
          .pipe(
              map( docArray => {
                  return docArray.map(doc => {
                      let product: Product = {
                          id: doc.payload.doc.id,
                          name: doc.payload.doc.data().name,
                          description: doc.payload.doc.data().description,
                          price:  doc.payload.doc.data().price,
                          creationDate: doc.payload.doc.data().creationDate
                      };
                      return product;
                  })
              })
          ).subscribe( (products: Product[]) => {
              this.availableProducts = products;
              this.productsChanged.next([...products]);
          })
      }

      
  addProduct(product: Product){
    this.db.collection("products").add({
      name: product.name,
      description: product.description,
      price: product.price,
      creationDate: new Date()
    })
  }

  updateProduct(product: Product){
    this.db.collection('products').doc(product.id).update({
      ...product
    })
  }

  deleteProduct(id){
    this.db.collection("products").doc(id).delete().then(function() {
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    }
}