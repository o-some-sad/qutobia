import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, StripeElementsDirective } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-form',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [StripeElementsDirective, StripeCardComponent, ReactiveFormsModule]
})
export class CheckoutComponent {
 


  pay(){
    fetch("/api/payment/create", {
      method: "POST"
    }).then(d=>d.json()).then(result=>{      
      window.location.href = result.url
    })
  }
}