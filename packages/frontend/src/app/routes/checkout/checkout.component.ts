import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, StripeElementsDirective } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-payment-form',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
 


  pay(){
    fetch("/api/payment/create", {
      method: "POST"
    }).then(async d=>{
      if(d.ok)return d.json()
      return Promise.reject({status: d.status, data: await d.json()})
    }).catch(e=>{
      toast.error(e.data.message)
      
    })
  }
}