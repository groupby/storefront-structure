import { provide, tag, Tag } from '@storefront/core';

@provide('swatch', (props) => props)
@tag('gb-swatch', require('./index.html'))
class Swatch {}

interface Swatch extends Tag<Swatch.Props> {}
namespace Swatch {
  export interface Props extends Tag.Props {
    color: string;
    image: string;
    label: string;
    onClick(index: number): void;
  }
}

export default Swatch;
