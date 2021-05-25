import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ConfigurationService } from '@cartella/services/configuration/configuration.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[feature]',
})
export class FeatureDirective implements OnInit {
  @Input() feature = '';
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private configService: ConfigurationService,
  ) {}

  ngOnInit() {
    const isEnabled = this.configService.isFeatureEnabled(this.feature) || false;
    if (isEnabled) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
