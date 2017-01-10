var React = require('react');

class DefaultPage extends React.Component {
  render() {
    return <div>{this.props.title} in JSX!</div>;
  }
}

module.exports = DefaultPage;
