import { Injectable } from '@angular/core';

interface Begivenhed {
  id: string,
  titel: string,
  subtitel: string,
  Billede: string,
  Beskrivelse: string,
  By: string,
  Email?: string,
  Kontaktperson?: string,
  TelefonNummer?: string,
  latitude?: string,
  longtitude?: string,
  deltagere?: string,
  adresse?: string,
  firmaNavn?: string,
  tid?: string,
  dato?: string,
  kategori?: string,
}

@Injectable({
  providedIn: 'root'
})
export class BegivenhederService {

  public begivenhed: Begivenhed[] = [];

  constructor() { 

  this.begivenhed = [
    { id : "1", titel : "Mobil Messen", subtitel : "Få en på opleveren!", Billede : "../../assets/img/bajer.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "2", titel : "Økologisk blomster pluk!", subtitel : "Hvis brune fingre er lige dig.", Billede : "../../assets/img/people.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "3", titel : "Skydiving fra højhus", subtitel : "No Fear", Billede : "../../assets/img/solsikke.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "4", titel : "Livet som bondemand", subtitel : "Lær at flække en ruge", Billede : "../../assets/img/computer.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "5", titel : "Fra skrot til forbrænding", subtitel : "Rust når det er bedst", Billede : "../../assets/img/ugle.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "6", titel : "Prøv dit handicap", subtitel : "På tur med tiger wolf", Billede : "../../assets/img/solsikke2.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" },
    { id : "7", titel : "Udflugt i skoven", subtitel : "Det bliver grinern", Billede : "../../assets/img/computer1.jpg", Beskrivelse : "Test beskrivelse af tekst dette kan være alting.", By : "Lyngby" }
  ];
}

  getBegivenhed(id): Begivenhed {
    return this.begivenhed.find(begivenhed => begivenhed.id === id);
  }

}
