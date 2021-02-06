import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetTechnologies } from '@app/store/actions/technology.action';
import { GetLoggedInUser } from '@app/store/actions/user.action';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedUserDetails();
    this.getTechnologies();
  }

  private getLoggedUserDetails() {
    this.store.dispatch(new GetLoggedInUser()).subscribe(
      () => {},
      () => {
        this.router.navigate(['/auth/login']);
      }
    );
  }

  private getTechnologies() {
    this.store.dispatch(new GetTechnologies());
  }
}
