import { Component } from 'react';
import PropTypes from 'prop-types';
//import ReactDOM from 'react-dom';

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    el: null,
    target: null,
  };

  componentDidMount() {
    this.setState(
      { el: document.createElement('div'), target: document.body },
      () => {
        this.state.target.appendChild(this.state.el);
      }
    );
  }

  componentWillUnmount() {
    this.state.target && this.state.target.removeChild(this.state.el);
  }

  render() {
    const { children } = this.props;

    if (this.state.el) {
      return ReactDOM.createPortal(children, this.state.el);
    }

    return null;
  }
}
