import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatFormField, MatLabel, MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, MatOptionModule, 
            MatSelectModule, MatFormFieldModule],
  providers: [TranslateService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crew-management-app';
  
  languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'pt', label: 'Portuguese' }
  ];

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['en', 'fr', 'pt']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLanguage(event: MatSelectChange) {
    const lang = event.value || 'en'; // Eğer event.value boşsa 'en' kullan
    this.translate.use(lang);  // Çeviri servisini güncelle
  }
    
}
