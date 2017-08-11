import Icon from '../../src/icon';
import suite from './_suite';

suite('Icon', ({ expect, spy }) => {
  let icon: Icon;

  beforeEach(() => icon = new Icon());

  describe('onUpdate()', () => {
    it('should return true for data URLs', () => {
      icon.props = <any>{ image: 'data:image/1312311' };

      icon.onUpdate();

      expect(icon.isImage).to.be.true;
    });

    it('should return true for image path', () => {
      icon.props = <any>{ image: 'image.jpg' };

      icon.onUpdate();

      expect(icon.isImage).to.be.true;
    });

    it('should return false for class list', () => {
      icon.props = <any>{ image: 'this that' };

      icon.onUpdate();

      expect(icon.isImage).to.be.false;
    });
  });
});
