import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { GetTechnologies } from '@app/store/actions/technology.action';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getLoggedUserDetails();
    this.getTechnologies();
  }

  private getLoggedUserDetails() {
    const token = localStorage.getItem('token') || null;
    if (token) {
      const res = this.auth.getUserAssociatedWithToken(token);
      if (res instanceof Error) {
        this.router.navigate(['/auth/login']);
      } else {
        res.subscribe((user) => {
          console.log(user);
          this.auth.setLoggedInUser(user as any);
        });
      }
    }
  }

  private getTechnologies() {
    this.store.dispatch(new GetTechnologies());
  }
}
