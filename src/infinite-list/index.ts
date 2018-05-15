import { consume, tag, Tag } from '@storefront/core';
import List from '../list';

@consume('infinite')
@tag('gb-infinite-list', require('./index.html'), require('./index.css'))
class InfiniteList extends List {}

export default InfiniteList;
