import { tag, Tag } from '@storefront/core';
import List from '../list';

export const DEFAULT_ITEM_ALIAS = 'item';
export const DEFAULT_INDEX_ALIAS = 'i';

@tag('gb-list-item', '<yield/>')
class ListItem {
  item: any;
  i: number;
  state: ListItem.State = { item: null, index: -1 };
  props: ListItem.Props = {
    itemAlias: DEFAULT_ITEM_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS,
  };

  init() {
    this.provide(this.props.itemAlias, (_, { item }) => item);
    this.provide(this.props.indexAlias, (_, { index }) => index);
  }

  onBeforeMount() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    this.state = { ...this.state, item: this.item, index: this.i };
  }
}

interface ListItem extends Tag<ListItem.Props, ListItem.State> {}

namespace ListItem {
  export interface Props {
    itemAlias?: string;
    indexAlias?: string;
  }

  export interface State {
    item: any;
    index: number;
  }
}

export default ListItem;
