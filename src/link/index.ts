import { view, Component } from '@storefront/core';

@view('gb-link', require('./index.html'))
export default class Link extends Component {
  p: { onClick(): void };

  onClick = (event: MouseEvent & { preventUpdate?: boolean }) => {
    event.preventUpdate = true;
    event.preventDefault();
    if (this.p.onClick) {
      this.p.onClick();
    }
  }
}
