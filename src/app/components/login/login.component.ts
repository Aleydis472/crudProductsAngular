import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  

  log: FormGroup;
  constructor(private fb: FormBuilder) {
    this.log = this.fb.group({
      correo: ['Alep472@gmail.com', Validators.required],
      contraseña: ['123456', Validators.required],
    }) 
  }
  
  ngOnInit(): void {
  }


}
