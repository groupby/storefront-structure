import { view, Component } from '@storefront/core';

@view('gb-list', require('./index.html'), require('./index.css'), [
  { name: 'inline', default: true },
  { name: 'items', default: ['a', 'b', 'c'] },
  { name: 'itemAlias', default: 'item' },
  { name: 'indexAlias', default: 'i' },
  { name: 'shouldRender', default: (item) => typeof item.shouldRender !== 'function' || item.shouldRender() }
])
class List extends Component {

  constructor() {
    super();
    this.exposeProps('list');
  }
}

namespace List {
  export interface Props {
    inline?: boolean;
    items?: any[];
    itemAlias?: string;
    indexAlias?: string;
    shouldRender?: (item: any) => boolean;
  }
}

export default List;
