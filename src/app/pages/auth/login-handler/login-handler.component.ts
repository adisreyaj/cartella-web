import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.scss'],
})
export class LoginHandlerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    if (query && query?.code === 'SUCCESS') {
      localStorage.setItem('token', query.token);
      this.auth.getUserAssociatedWithToken(query.token);
      // this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
