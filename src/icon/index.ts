import { tag, Tag } from '@storefront/core';

export const IMAGE_PATTERN = /.*\..*/;
export const DATA_URL_PREFIX = 'data:image/';

@tag('gb-icon', require('./index.html'))
class Icon {

  isImage: boolean;

  onBeforeMount() {
    this.checkImage();
  }

  onUpdate() {
    this.checkImage();
  }

  checkImage() {
    const { image } = this.props;
    this.isImage = IMAGE_PATTERN.test(image) || image.startsWith(DATA_URL_PREFIX);
  }
}

interface Icon extends Tag<Icon.Props> { }
namespace Icon {
  export interface Props extends Tag.Props {
    image: string;
  }
}

export default Icon;
