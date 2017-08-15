import { tag, Tag } from '@storefront/core';
import { DEFAULT_INDEX_ALIAS, DEFAULT_ITEM_ALIAS } from '../list';

@tag('gb-filtered-list', require('./index.html'))
class FilteredList {

  refs: { filter: HTMLInputElement };
  items: FilteredList.Item[];
  props: FilteredList.Props = {
    items: [],
    itemAlias: DEFAULT_ITEM_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS,
  };

  onBeforeMount() {
    this.updateItems('');
  }

  onUpdate() {
    this.updateItems();
  }

  onFilterChange(event: Tag.Event) {
    this.updateItems();
  }

  updateItems(value: string = this.refs.filter.value) {
    value = value.trim().toLowerCase();
    this.items = this.props.items.filter((item) => {
      if (!item) {
        return false;
      } else if (typeof item === 'string') {
        return item.toLowerCase().includes(value);
      } else if (typeof item.value === 'string') {
        return item.value.toLowerCase().includes(value);
      } else {
        return false;
      }
    });
  }
}

interface FilteredList extends Tag<FilteredList.Props> { }
namespace FilteredList {
  export interface Props extends Tag.Props {
    items?: Item[];
    itemAlias?: string;
    indexAlias?: string;
  }

  export type Item = string | { value: string };
}

export default FilteredList;
