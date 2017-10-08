import { alias, tag, Tag } from '@storefront/core';

@tag('gb-carousel-track', require('./track.html'), require('./track.css'))
class Track {

    // imageStyle: any = {
    //     styleOne: {},
    //     styleTwo: {},
    //     styleThree: {},
    // };

    // activeStyle: any = {
    //     'border-width': '5px',
    //     'border-style': 'dashed'
    // };

    // classOne: string = 'slide fade';
    // // classTwo: any = {active: true};
    // classTwo: string = this.classOne;

    // classThree: string = 'slide fade active';

    // // classNames: any = [this.classOne, this.classTwo, this.classThree];

    // // classNames.map((className: any, index: number) => {
    // //     className.subString('active') ? imageStyle[Object.keys[index]] = activeStyle : null
    // // })

    // // why type can't be string??
    // getSlideClasses: any = () => {
    //     const style = '';
    //     return style;
    // }

    // getSlideStyle: object = () => {
    //     const style = {};
    //     return style;
    // }



    onBeforeMount() {
        console.log('haadsad');
    }
}
namespace Track {
    export interface Props {
    }
    export interface State {
    }
    export interface Event {
    }
}