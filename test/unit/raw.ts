import Raw from '../../src/raw';
import suite from './_suite';

suite('Raw', ({ expect, spy }) => {
  let raw: Raw;

  beforeEach(() => raw = new Raw());

  describe('onBeforeMount()', () => {
    it('should call updateContent()', () => {
      const updateContent = raw.updateContent = spy();

      raw.onBeforeMount();

      expect(updateContent).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateContent()', () => {
      const updateContent = raw.updateContent = spy();
      raw.content = 'my content';
      raw.props = { content: 'other content' };

      raw.onUpdate();

      expect(updateContent).to.be.called;
    });

    it('should not call updateContent()', () => {
      const content = raw.content = 'my content';
      raw.updateContent = () => expect.fail();
      raw.props = { content };

      raw.onUpdate();
    });
  });

  describe('updateContent()', () => {
    it('should set root.innerHTML and content', () => {
      const content = 'my content';
      const root = raw.root = <any>{};
      raw.props = <any>{ content };

      raw.updateContent();

      expect(root.innerHTML).to.eq(content);
      expect(raw.content).to.eq(content);
    });
  });
});
