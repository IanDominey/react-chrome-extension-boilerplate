import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { mount } from 'enzyme';
import Footer from '../../../app/components/Footer';
import style from '../../../app/components/Footer.css';
import { SHOW_ACTIVE, SHOW_ALL } from '../../../app/constants/TodoFilters';

function setup(propOverrides) {
  const props = {
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: sinon.spy(),
    onShow: sinon.spy(),
    ...propOverrides,
  };

  const renderer = mount(<Footer {...props} />);

  return { props, renderer };
}

function getTextContent(elem) {
  const children = Array.isArray(elem.props.children) ?
      elem.props.children : [elem.props.children];

  return children.reduce((out, child) =>
          // Children are either elements or text strings
      out + (child.props ? getTextContent(child) : child)
      , '');
}

describe('todoapp Footer component', () => {
  it('should be a footer', () => {
    const { renderer } = setup();
    renderer.type().should.equal('footer');
    renderer.hasClass(style.footer);
  });

  it('should display active count when 0', () => {
    const { renderer } = setup({ activeCount: 0 });
    const [count] = renderer.props.children;
    expect(getTextContent(count)).to.equal('No items left');
  });

  it('should display active count when above 0', () => {
    const { renderer } = setup({ activeCount: 1 });
    const [count] = renderer.props.children;
    expect(getTextContent(count)).to.equal('1 item left');
  });

  it('should render filters', () => {
    const { renderer } = setup();
    const [, filters] = renderer.props.children;
    expect(filters.type).to.equal('ul');
    expect(filters.props.className).to.equal(style.filters);
    expect(filters.props.children.length).to.equal(3);
    filters.props.children.forEach((filter, index) => {
      expect(filter.type).to.equal('li');
      const link = filter.props.children;
      expect(link.props.className).to.equal(index === 0 ? 'selected' : '');
      expect(link.props.children).to.equal(['All', 'Active', 'Completed'][index]);
    });
  });

  it('should call onShow when a filter is clicked', () => {
    const { renderer, props } = setup();
    const [, filters] = renderer.props.children;
    const filterLink = filters.props.children[1].props.children;
    filterLink.props.onClick({});
    expect(props.onShow.calledWith(SHOW_ACTIVE)).to.equal(true);
  });

  it('shouldnt show clear button when no completed todos', () => {
    const { renderer } = setup({ completedCount: 0 });
    const [, , clear] = renderer.props.children;
    expect(clear).to.equal(undefined);
  });

  it('should render clear button when completed todos', () => {
    const { renderer } = setup({ completedCount: 1 });
    const [, , clear] = renderer.props.children;
    expect(clear.type).to.equal('button');
    expect(clear.props.children).to.equal('Clear completed');
  });

  it('should call onClearCompleted on clear button click', () => {
    const { renderer, props } = setup({ completedCount: 1 });
    const [, , clear] = renderer.props.children;
    clear.props.onClick({});
    expect(props.onClearCompleted.called).to.equal(true);
  });
});
