import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MercadopagoApiService } from '../services/mercadopago-api/mercadopago-api.service';
import { mobilePhone } from '../../models/mobilePhoneInterface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

  mobilePhones : mobilePhone[] = [
    {
      id : '1234',
      name : 'Samsung - Galaxy S10',
      description : 'Telefono celular marca Samsung modelo Galaxy S10 liberado',
      image : 'https://www.nexon.com.ar/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/0/1/017671.jpg',
      quantity : 1,
      price : 80000.00
    },
    {
      id : '1234',
      name : 'Samsung - Galaxy S20',
      description : 'Telefono celular marca Samsung modelo Galaxy S20 liberado',
      image : 'https://images.samsung.com/in/smartphones/galaxy-s20/buy/1-9-hubble-x1-cosmic-gray-gallery-mobile-img.jpg',
      quantity : 1,
      price : 100000.00
    },    {
      id : '1234',
      name : 'Apple - Iphone X',
      description : 'Telefono celular marca Apple modelo Iphone X liberado',
      image : 'https://tienda.claro.com.ar/wcsstore/Claro/images/catalog/productos/646x1000/70007365.jpg',
      quantity : 1,
      price : 95000.00
    },    {
      id : '1234',
      name : 'Apple - Iphone XR',
      description : 'Telefono celular marca Apple modelo Iphone XR liberado',
      image : 'https://cdn.alzashop.com/ImgW.ashx?fd=f3&cd=RI027b2',
      quantity : 1,
      price : 77000.00
    }
  ]

  constructor( private alertCtrl : AlertController,
               private mercadopagoSvc : MercadopagoApiService ) {}

  async showItemDetails( index : number ){

    let alert = await this.alertCtrl.create({
      header : this.mobilePhones[ index ].name,
      subHeader : this.mobilePhones[ index ].price.toString(),
      message : `<h10>${ this.mobilePhones[ index ].description }</h10>` +
                `<img src="${ this.mobilePhones[ index ].image }">`,
      buttons : [
        {
          text : 'Pagar la compra!',
          handler : () => {
            this.payItem( this.mobilePhones[ index ] );
          }
        },
        {
          text : 'Cancelar'
        }
      ]
      
    });

    await alert.present();

  }

  private payItem( phone : mobilePhone ){
    console.log( 'pagando item...' );

    this.mercadopagoSvc.proceedToCheckout( phone ).then(()=>{

    }).catch(( error )=>{

    });
  }

}




