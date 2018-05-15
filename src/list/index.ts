import { provide, tag, Tag } from '@storefront/core';
import ListItem from '../list-item';

@provide('list', (props) => props)
@tag('gb-list', require('./index.html'), require('./index.css'))
class List {
  refs: {
    wrapper: HTMLUListElement;
  };
  tags: {
    'gb-list-item': ListItem[];
  };
  props: List.Props = {
    items: [],
    layout: 'list',
    shouldRender: (item) => typeof item.shouldRender !== 'function' || item.shouldRender(),
  };

  childProps() {
    const { itemAlias, indexAlias, itemProps } = this.props;
    return { ...itemProps, itemAlias, indexAlias };
  }

  isGrid() {
    return this.props.layout.toLowerCase() === 'grid';
  }
}

interface List extends Tag<List.Props> {}
namespace List {
  export interface Props extends Tag.Props {
    items?: any[];
    itemProps?: ListItem.Props;
    itemAlias?: string;
    indexAlias?: string;
    layout?: string;
    shouldRender?: (item: { shouldRender?: () => boolean }) => boolean;
  }
}

export default List;
