import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  imports: [
    FormsModule
  ],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.css'
})
export class RadioButtonComponent {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();

  onValueChange(){
    this.selectedValueChange.emit(this.value);
  }
}
