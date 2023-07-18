import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }


  // add event
  addEvent(event: Event) {
    event.id = this.afs.createId();
    return this.afs.collection('/Events').add(event);
  }

  // get all events
  getAllEvents() {
    return this.afs.collection('/Events').snapshotChanges();
  }

  // delete event
  deleteEvent(event: Event) {
    this.afs.doc('/Events/' + event.id).delete();
  }

  // update events
  updateEvent(event: Event) {
    this.deleteEvent(event);
    this.addEvent(event);
  }

}