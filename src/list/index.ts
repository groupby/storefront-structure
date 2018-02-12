import { tag, Tag } from '@storefront/core';
import ListItem from '../list-item';

export const DEFAULT_ITEM_ALIAS = 'item';
export const DEFAULT_INDEX_ALIAS = 'i';

@tag('gb-list', require('./index.html'), require('./index.css'))
class List {

  refs: {
    wrapper: HTMLUListElement
  };

  tags: {
    'gb-list-item': ListItem[];
  };

  props: List.Props = {
    items: [],
    itemAlias: DEFAULT_ITEM_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS,
    layout: 'list',
    shouldRender: (item) => typeof item.shouldRender !== 'function' || item.shouldRender(),
  };

  init() {
    this.expose('list', this.props);
  }

  isGrid() {
    const layout = this.props.layout.toLocaleLowerCase();

    switch (layout) {
      case 'grid':
        return 'gb-list__wrapper--grid';
      case 'column':
        return 'gb-list__wrapper--column';
      case 'shelf':
        return 'gb-list__wrapper--shelf';
      default:
        return 'gb-list__wrapper--column';
    }
  }
}

interface List extends Tag<List.Props> { }
namespace List {
  export interface Props extends Tag.Props {
    items?: any[];
    itemAlias?: string;
    indexAlias?: string;
    layout?: string;
    shouldRender?: (item: { shouldRender?: () => boolean }) => boolean;
  }
}

export default List;
