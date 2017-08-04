import React from 'react'
import { Tabs, Tab} from 'material-ui'

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav>
        <Tabs value={this.props.tabIndex}>
          {this.props.tabs.map((tab, i) => (
            <Tab key={i} onActive={tab.handleActive} label={tab.title} />
          ))}
        </Tabs>
      </nav>
    )
  }
}

export default Nav;
