import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/interfaces/user.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.auth.user$;
  }

  logout() {
    this.router.navigate(['auth/login']);
    this.auth.logout();
  }
}
