import { alias, tag, Tag } from '@storefront/core';
import * as classnames from 'classnames';

@tag('gb-carousel-track', require('./track.html'), require('./track.css'))
class Track {

    imageStyle: any = {
        styleOne: {},
        styleTwo: {},
        styleThree: {},
    };

    activeStyle: any = {
        'border-width': '5px',
        'border-style': 'dashed'
    };

    trackPos: number = 0;

    classOne: string = 'slide fade';
    // classTwo: any = {active: true};
    classTwo: string = this.classOne;

    classThree: string = 'slide fade active';

    classNames: any = [this.classOne, this.classTwo, this.classThree];

    // why type can't be string??
    getSlideClasses: any = () => {
        const style = '';
        return style;
    }

    getSlideStyle: object = () => {
        const style = {};
        return style;
    }

    onBeforeMount() {
        // console.log('haadsad');
    }

    onUpdated() {
        const { currentSlide } = this.props;
        const pos = calcPos(currentSlide, 300);
    }

}

function calcPos(currS: number, imageWidth: number): number {
    return currS * imageWidth ;
}

interface Track extends Tag<Track.Props> { }
namespace Track {
    export interface Props extends Tag.Props  {
        currentSlide: number;
    }
    export interface State {
    }
    export interface Event {
    }
}

const getSlideClasses = (spec) => {
    let gbActive;
    let gbCloned;
    let index;

    index = spec.index;
    gbCloned = (index < 0) || (index >= spec.slideCount);
    gbActive = (spec.currentSlide <= index) && (index < spec.currentSlide + spec.slidesToShow);

    return classnames({
        'gb-slide': true,
        'gb-active': gbActive,
        'gb-cloned': gbCloned
    });
};

const getSlideStyle = (spec) => {
    let style = {};


    // style = {width: 1211.5833740234375} width of the div, subject to screen width
    return style;
};

const renderSlides = (spec) => {
    let key;
    let slides = [];
    let preCloneSlides = [];
    let postCloneSlides = [];
    // let count = React.Children.count(spec.children);

};
