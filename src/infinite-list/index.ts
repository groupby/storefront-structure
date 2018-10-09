import { provide, tag, Tag } from '@storefront/core';
import List from '../list';

@provide('infiniteList', (props) => props)
@tag('gb-infinite-list', require('./index.html'), require('./index.css'))
class InfiniteList extends List {}

namespace InfiniteList {
  export interface Props extends List.Props {
    clickPrev: (event: MouseEvent & Tag.Event) => void;
    clickMore: (event: MouseEvent & Tag.Event) => void;
    loaderLabel: string;
    isFetchingForward: boolean;
    isFetchingBackward: boolean;
    loadMore: boolean;
    prevExists?: boolean;
    moreExists?: boolean;
  }
}

export default InfiniteList;
