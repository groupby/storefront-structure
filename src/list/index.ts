import { tag, Tag } from '@storefront/core';

@tag('gb-list', require('./index.html'), require('./index.css'))
class List {

  props: List.Props = {
    items: [],
    itemAlias: 'item',
    indexAlias: 'i',
    layout: 'list',
    shouldRender: (item) => typeof item.shouldRender !== 'function' || item.shouldRender(),
  };

  init() {
    this.expose('list', this.props);
  }

  isGrid() {
    return this.props.layout.toLowerCase() === 'grid';
  }
}

interface List extends Tag<List.Props> { }
namespace List {
  export interface Props {
    items?: any[];
    itemAlias?: string;
    indexAlias?: string;
    layout?: string;
    shouldRender?: (item: { shouldRender?: () => boolean }) => boolean;
  }
}

export default List;
