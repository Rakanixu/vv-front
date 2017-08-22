import React from 'react'
import { Tabs, Tab } from 'material-ui';
import { blue600, blue100 } from 'material-ui/styles/colors';

const styles = {
  tabs: {
    backgroundColor: blue600
  }
};

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav>
        <Tabs value={this.props.tabIndex} style={styles.tabs} tabItemContainerStyle={styles.tabs}>
          {this.props.tabs.map((tab, i) => (
            <Tab key={i} onActive={tab.handleActive} label={tab.title} />
          ))}
        </Tabs>
      </nav>
    )
  }
}

export default Nav;
