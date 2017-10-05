import Icon from '../../src/icon';
import suite from './_suite';

suite('Icon', ({ expect, spy, stub }) => {
  let icon: Icon;

  beforeEach(() => icon = new Icon());

  describe('checkImage()', () => {
    it('should return true for data URLs', () => {
      icon.props = <any>{ image: 'data:image/1312311' };

      icon.checkImage();

      expect(icon.isImage).to.be.true;
    });

    it('should return true for image path', () => {
      icon.props = <any>{ image: 'image.jpg' };

      icon.checkImage();

      expect(icon.isImage).to.be.true;
    });

    it('should return false for class list', () => {
      icon.props = <any>{ image: 'this that' };

      icon.checkImage();

      expect(icon.isImage).to.be.false;
    });
  });

  describe('onUpdate()', () => {
    it('should call checkImage()', () => {
      const checkImage = stub(icon, 'checkImage');

      icon.onUpdate();

      expect(checkImage).to.be.calledOnce;
    });
  });

  describe('onBeforeMount()', () => {
    it('should call checkImage()', () => {
      const checkImage = stub(icon, 'checkImage');

      icon.onBeforeMount();

      expect(checkImage).to.be.calledOnce;
    });
  });
});
