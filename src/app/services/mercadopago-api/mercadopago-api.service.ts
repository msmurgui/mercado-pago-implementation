import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { mobilePhone } from '../../../models/mobilePhoneInterface';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoApiService {

  //Modo Sandbox
  private prod_access_token = 'APP_USR-6317427424180639-090914-5c508e1b02a34fcce879a999574cf5c9-469485398';
  private sbx_access_token = 'TEST-6317427424180639-090914-d7e31028329ff046e873fae82ed7b93c-469485398';
  private prod_public_key = 'APP_USR-a83913d5-e583-4556-8c19-d2773746b430'; 
  
  private back_url_success : string = 'localhost:8100/home';
  private back_url_pending : string = 'pending';
  private back_url_failure : string = 'failure';

  constructor( private advanced_http : HttpClient,
               private iab : InAppBrowser, 
               private platform : Platform
               ) {}

  proceedToCheckout( phone : mobilePhone ){

    let preference = {
        items: [{
          id : phone.id,
          title : phone.name,
          description : phone.description,
          quantity : phone.quantity,
          picture_url : phone.image,
          unit_price : phone.price,
          currency_id: 'ARS'
        }
      ],

        auto_return: 'approved',
        payer: {
          email:'test_user_63274575@testuser.com',
        },
       
        payment_methods: {
          excluded_payment_types: [
            { id: 'atm' }
          ],
          excluded_payment_methods: [
            { id : 'amex' }
          ],
          installments: 6,  
        },
        back_urls:{
          success: this.back_url_success,
          pending: this.back_url_pending,
          failure: this.back_url_failure
        },
        external_reference : 'ABCD1234'
      //}
    };
    
    console.log(preference);

    return new Promise ( ( resolve, reject ) =>{
      
      //this.advanced_http.setDataSerializer('json');
      this.advanced_http.post('https://api.mercadopago.com/checkout/preferences?access_token=' + this.sbx_access_token, preference )
                        .subscribe( (response :any )=>{      
        
        console.log( response );

        let browser = this.iab.create( response.sandbox_init_point, '_blank' , 'location=no');    //This will open link in InAppBrowser
        
        let subStart : Subscription;
        let subExit : Subscription;
        let subError : Subscription;
        
        subStart = browser.on('loadstart').subscribe((event:InAppBrowserEvent )=>{
    
          if( event.url.startsWith( 'http://' + this.back_url_success ) ){
            browser.close();
            subStart.unsubscribe();   //This will close InAppBrowser Automatically when closeUrl Started 
            if( !subExit.closed ) subExit.unsubscribe();
            if( !subError.closed ) subError.unsubscribe();
            resolve( 1 );  
          }
        });

        subExit = browser.on('exit').subscribe(( event: InAppBrowserEvent )=>{

          browser.close();
          subExit.unsubscribe();
          if( !subStart.closed ) subStart.unsubscribe();
          if( !subError.closed ) subError.unsubscribe();
          resolve( 2 );
          
        });

        subError = browser.on('loaderror').subscribe(( event:InAppBrowserEvent )=>{

          browser.close();
          subError.unsubscribe();
          if( !subStart.closed ) subStart.unsubscribe();
          if( !subExit.closed ) subExit.unsubscribe();
          resolve( 3 );
          
        });
          
        
      }, (error) =>{
        console.error( error );
        reject( error ); 
      });
      
    });  
  }

  

}
