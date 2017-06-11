import { tag, Tag } from '@storefront/core';
import List from '../list';

@tag('gb-list-item', '<yield/>')
class ListItem {

  $list: List.Props;
  itemAlias: string;
  indexAlias: string;
  item: any;
  i: number;

  init() {
    this.expose(this.itemAlias = this.$list.itemAlias, this.item);
    this.expose(this.indexAlias = this.$list.indexAlias, this.i);
    this.unexpose('list');
  }

  onUpdate() {
    this.updateAlias(this.itemAlias, this.item);
    this.updateAlias(this.indexAlias, this.i);
  }
}

interface ListItem extends Tag { }

export default ListItem;
