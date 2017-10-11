import { alias, tag, Tag } from '@storefront/core';
import * as classnames from 'classnames';

@tag('gb-carousel-track', require('./track.html'), require('./track.css'))
class Track {

    trackPos: number = 0;

    windowSize: number = window.innerWidth;

    slideWidth: number = this.windowSize;

    slideStyle: any = {
        width: `${this.slideWidth}px`
    };

    trackStyle: any = {
        'max-height': '300px',
        opacity: 1,
        // change to slideCount + 1 ? why + 1
        width: `${ 4 * this.slideWidth}px` || '10000px',
        transform: `translate3d(${this.trackPos}px, 0px, 0px)`,
        'webkit-transform': `translate3d(${this.trackPos}px, 0px, 0px)`,
        transition: '',
        'webkit-transition': '',
        'ms-transform': `translate3d(${this.trackPos}px, 0px, 0px)`
    };

    getTrackWidth: any = () => {
        return this.props.slideCount * this.slideWidth;
    }


    onBeforeMount() {
        if (!window) {
            return;
        }
        if (window.addEventListener) {
            window.addEventListener('resize', () => {
                const { currentSlide } = this.props;
                this.windowSize = window.innerWidth;
                this.updateSlideWidth(this.windowSize);
                this.update();
            });
        }
    }

    onUpdate() {
        const { currentSlide } = this.props;

        this.updateTrackPos(currentSlide, this.windowSize);
        console.log('windowSize', this.windowSize);
    }

    updateTrackPos: any = (currentSlide, moveDistance) => {
        const pos = calcPos(currentSlide, moveDistance);
        console.log('pos is', pos, 'window size is', moveDistance)
        console.log(`translate3d(-${pos}px, 0px, 0px)`)
        this.trackStyle.transform = `translate3d(-${pos}px, 0px, 0px)`;
        console.log('trackStyle updated', this.trackStyle)
    }

    updateSlideWidth: any = (slideWidth: number) => {
        this.slideStyle.width = `${slideWidth}px`;
    }

}

const calcPos = (currS: number, moveDistance: number): number => {
    return (currS) * moveDistance;
};

interface Track extends Tag<Track.Props> { }
namespace Track {
    export interface Props extends Tag.Props {
        currentSlide: number;
        windowSize: number;
        slideCount: number;
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
