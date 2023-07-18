import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  eventsList: Event[] = [];
  eventObj: Event = {
    id: '',
    name: '',
    description: ''
  };
  id: string = '';
  name: string = '';
  description: string = '';

  constructor(private auth: AuthService, private data: DataService) { }

  ngOnInit(): void {
    // debugger;
    // this.auth.userChanges();
    this.getAllEvents();
  }

  getAllEvents() {

    this.data.getAllEvents().subscribe(res => {

      this.eventsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })

    }, err => {
      alert('Error while fetching event data');
    })

  }

  resetForm() {
    this.id = '';
    this.name = '';
    this.description = '';
  }

  addEvent() {
    if (this.name == '' || this.description == '') {
      alert('Fill all input fields');
      return;
    }

    this.eventObj.id = '';
    this.eventObj.name = this.name;
    this.eventObj.description = this.description;

    this.data.addEvent(this.eventObj);
    this.resetForm();

  }

  updateEvent() {

  }

  deleteEvent(event: Event) {
    if (window.confirm('Are you sure you want to delete ' + event.name + ' ?')) {
      this.data.deleteEvent(event);
    }
  }

}
