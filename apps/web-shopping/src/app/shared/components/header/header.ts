import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'esh-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  @Input()
  url: string = '';
}
