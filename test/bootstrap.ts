import * as chai from 'chai';
import * as mock from 'mock-require';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

mock('../src/button/index.html', {});
mock('../src/custom-select/index.html', {});
mock('../src/custom-select/index.css', {});
mock('../src/icon/index.html', {});
mock('../src/link/index.html', {});
mock('../src/list/index.html', {});
mock('../src/list/index.css', {});
mock('../src/native-select/index.html', {});
mock('../src/select/index.html', {});
