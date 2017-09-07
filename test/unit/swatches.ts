import Swatches from '../../src/swatches';
import suite from './_suite';

suite('Swatches', ({ expect, spy, itShouldHaveAlias }) => {
  let swatches: Swatches;

  beforeEach(() => swatches = new Swatches());

  itShouldHaveAlias(Swatches, 'swatches');

  describe('constructor()', () => {
    describe('state', () => {
      describe('onClick()', () => {
        it('should call props.onClick() with the index of the clicked swatch', () => {
          const index = 9;
          const onClick = spy();
          swatches.props = <any>{ onClick };

          swatches.state.onClick(<any>{ item: { i: index } });

          expect(onClick).to.be.calledWith(index);
        });

        it('should not fail if props.onClick() not provided', () => {
          swatches.props = <any>{};

          expect(() => swatches.state.onClick(<any>{ item: {} })).to.not.throw();
        });
      });

      describe('onActivate()', () => {
        it('should call props.onChange() with the index of the active swatch', () => {
          const index = 9;
          const onChange = spy();
          swatches.props = <any>{ onChange };

          swatches.state.onActivate(<any>{ item: { i: index } });

          expect(onChange).to.be.calledWith(index, true);
        });

        it('should not fail if props.onChange() not provided', () => {
          swatches.props = <any>{};

          expect(() => swatches.state.onActivate(<any>{ item: {} })).to.not.throw();
        });
      });

      describe('onDeactivate()', () => {
        it('should call props.onChange() with the index of the inactive swatch', () => {
          const index = 9;
          const onChange = spy();
          swatches.props = <any>{ onChange };

          swatches.state.onDeactivate(<any>{ item: { i: index } });

          expect(onChange).to.be.calledWith(index, false);
        });

        it('should not fail if props.onChange() not provided', () => {
          swatches.props = <any>{};

          expect(() => swatches.state.onDeactivate(<any>{ item: {} })).to.not.throw();
        });
      });
    });
  });
});
