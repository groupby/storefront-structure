import { view, Component } from '@storefront/core';
import List from '../list';

@view('gb-list-item', '<yield/>', require('./index.css'))
export default class ListItem extends Component {
  $list: List.Props;
  item: any;
  i: number;

  constructor() {
    super();
    this.unexpose('list');
  }

  onBeforeMount() {
    this.expose(this.$list.itemAlias, this.item);
    this.expose(this.$list.indexAlias, this.i);
  }
}
