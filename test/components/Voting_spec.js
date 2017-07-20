import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} from 'react-addons-test-utils';
import Voting from '../../src/components/Voting';
import {expect} from 'chai';
import {List} from 'immutable';

describe('Voting', () => {

  it('renders a pair of buttons', () => {
    const component = renderIntoDocument(
      <Voting pair={["Django", "Kill Bill"]} />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent).to.equal("Django");
    expect(buttons[1].textContent).to.equal("Kill Bill");
  });

  it('invokes a callback when a button is clicked', () => {
    let votedWith;
    const vote = (entry) => votedWith = entry;
    const component = renderIntoDocument(
      <Voting pair = {['Memento', 'Inception']}
        vote = {vote} />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(buttons[0]);

    expect(votedWith).to.equal('Memento');
  });

  it('disables buttons when user has voted', () => {
    const component = renderIntoDocument(
      <Voting pair = {["Memento", "Inception"]} hasVoted = "Memento" />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(2);
    expect(buttons[0].hasAttribute('disabled')).to.equal(true);
    expect(buttons[1].hasAttribute('disabled')).to.equal(true);
  });

  it('adds a label to the voted entry', () => {
    const component = renderIntoDocument(
      <Voting pair = {["Memento", "Inception"]} hasVoted = "Memento" />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    expect(buttons[0].textContent).to.contain('Voted');
  });

  it('render just the winner if there is one', () => {
    const component = renderIntoDocument(
      <Voting winner = "Memento" />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    expect(buttons.length).to.equal(0)

    const winner = ReactDOM.findDOMNode(component.refs.winner);
    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain("Memento");
  })

  it('renders as a pure component', () => {
    //with this test we prove that althoug we mutate the entry pair
    //the changes will not reflect in the UI, because we are using pure components
    //and a PureRenderMixin !T
    const pair = ["Memento", "Inception"];
    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Voting pair = {pair} />,
      container
    );

    let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.textContent).to.equal("Memento");

    pair[0] = "Prestige";
    component = ReactDOM.render(
      <Voting pair = {pair} />,
      container
    );
    firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.textContent).to.equal("Memento");

  });

  it('does update DOM when prop changes', () => {
    const pair = List.of("Memento", "Inception");
    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Voting pair = {pair} />,
      container
    );

    let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.textContent).to.equal("Memento");

    const newPair = pair.set(0, "Prestige");
    component = ReactDOM.render(
      <Voting pair = {newPair} />,
      container
    );
    firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.textContent).to.equal('Prestige');
  });
});
