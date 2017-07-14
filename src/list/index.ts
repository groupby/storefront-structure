import { tag, Tag } from '@storefront/core';

@tag('gb-list', require('./index.html'))
class List {

  props: List.Props = {
    inline: true,
    items: [],
    itemAlias: 'item',
    indexAlias: 'i',
    shouldRender: (item) => typeof item.shouldRender !== 'function' || item.shouldRender()
  };

  init() {
    this.expose('list', this.props);
  }
}

interface List extends Tag<List.Props> { }
namespace List {
  export interface Props {
    inline?: boolean;
    items?: any[];
    itemAlias?: string;
    indexAlias?: string;
    shouldRender?: (item: { shouldRender?: () => boolean }) => boolean;
  }
}

export default List;
