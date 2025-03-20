import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crew-card',
  standalone: true,
  templateUrl: './crew-card.component.html',
  styleUrls: ['./crew-card.component.scss'],
  imports: []
})
export class CrewCardComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // URL'deki ID'yi al
    console.log('Crew Member ID:', id);
  }
}