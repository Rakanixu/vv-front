import React from 'react'
import { Tabs, Tab} from 'material-ui'

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Tabs>
          <Tab label="&nbsp;Item 1&nbsp;" />
          <Tab label="&nbsp;Item 2&nbsp;" />
          <Tab label="&nbsp;Item 3&nbsp;" />
          <Tab label="&nbsp;Item 4&nbsp;" />
        </Tabs>
      </nav>
    )
  }
}

export default Nav;
