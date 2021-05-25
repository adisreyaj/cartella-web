import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@cartella/config/routes.config';
import { ToastService } from '@cartella/services/toast/toast.service';
import { GetLoggedInUser } from '@cartella/store/actions/user.action';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';

@Component({
  template: '',
})
export class LoginHandlerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private toast: ToastService,
  ) {}
  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    if (query && query?.code === 'SUCCESS') {
      localStorage.setItem('token', query.token);
      this.store
        .dispatch(new GetLoggedInUser())
        .pipe(take(1))
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          () => {
            this.router.navigate([ROUTES.auth.root, ROUTES.auth.login]);
          },
        );
    } else {
      this.toast.showErrorToast(query.message);
      this.router.navigate([ROUTES.auth.root, ROUTES.auth.login]);
    }
  }
}
