import { Injectable } from '@angular/core';
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
  
  private localhost : string = 'localhost:5000/';
  //private localhost : string = 'https://mercado-pago-certification.herokuapp.com/';

  private back_url_success : string = this.localhost + '?status=success';
  private back_url_pending : string = this.localhost + '?status=pending';
  private back_url_failure : string = this.localhost + '?status=failure';

  constructor( private http : HttpClient ) {}

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
        }],
        auto_return: 'approved',
        payer: {
          name: 'Lalo',
          surname : 'Landa',
          email:'test_user_63274575@testuser.com',
          phone : {
            area_code : '011',
            number : ' 2222-3333'
          },
          identification : {
            type : 'DNI',
            number : '22.333.444'
          },
          adress : {
            zip_code : '1111',
            street_name : 'Falsa',
            street_number : 123
          }

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
        notification_url : '',
        back_urls:{
          success: this.back_url_success,
          pending: this.back_url_pending,
          failure: this.back_url_failure
        },
        external_reference : 'ABCD1234'
      //}
    };
    

    return new Promise ( ( resolve, reject ) =>{
      
      //this.http.setDataSerializer('json');
      this.http.post('https://api.mercadopago.com/checkout/preferences?access_token=' + this.sbx_access_token, preference )
                        .subscribe( async (response :any )=>{      
        
        resolve( response.sandbox_init_point );
                
      }, (error) =>{
        console.error( error );
        reject( error ); 
      });
      
    });  
  }

  getPayment( id : string ){
    return new Promise(( resolve, reject )=>{
      this.http.get(`https://api.mercadopago.com/v1/payments/${ id }?access_token=` + this.sbx_access_token)
               .subscribe(( response : any )=>{
                 resolve( response );
               }, error =>{
                 console.error( 'Mercado Api Service Error | getPayment(): ', error );
                 reject();
               });
    })
  }
  

}
