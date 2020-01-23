import { Component, OnInit } from '@angular/core';
import { BegivenhederService } from "../../services/begivenheder.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public begivenhed;

  constructor(public eventService:BegivenhederService, private route: ActivatedRoute) { }

  ionViewWillEnter(){
    let eventId = this.route.snapshot.paramMap.get('id'); // Opretter en ny variable "let" og insætter snapshot fra forrige side "id"
    this.begivenhed = this.eventService.getBegivenhed(eventId); // Her kalder vi begivenheds services som giver os ID svareden til EventID som er begivenhed.id i begivenheds servicen
  }

  ngOnInit() {
  }

}
