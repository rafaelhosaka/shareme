import React from "react";

function withToolTip(Component) {
  return class WithToolTip extends React.Component {
    state = {
      showToolTip: false,
    };

    mouseOut = () => {
      this.setState({ showToolTip: false });
    };

    mouseOver = () => {
      this.setState({ showToolTip: true });
    };

    render() {
      return (
        <div
          className="tooltip-container"
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseOut}
        >
          <Component {...this.props} showToolTip={this.state.showToolTip} />
        </div>
      );
    }
  };
}

export default withToolTip;
