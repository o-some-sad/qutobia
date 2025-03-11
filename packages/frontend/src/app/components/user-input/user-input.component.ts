import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-input',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css'
})
export class UserInputComponent {
  @Input() control: FormControl = new FormControl();
  @Input() type: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
}
