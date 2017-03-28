import { view } from '@storefront/core';

@view('gb-badge', '<span><yield/></span>', require('./index.css'))
export default class Badge { }
