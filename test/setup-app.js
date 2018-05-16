import 'raf/polyfill';
import { jsdom } from 'jsdom';
import hook from 'css-modules-require-hook';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import chai from 'chai';

configure({ adapter: new Adapter() });
chai.should();

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});
