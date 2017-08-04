import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, blue600, grey600} from 'material-ui/styles/colors';
import {customgrey} from './theme-colors';

const themeDefault = getMuiTheme({
  palette: {
  },
  appBar: {
    height: 57,
    color: white
  },
  drawer: {
    width: 280,
    color: customgrey,

  },
  raisedButton: {
    primaryColor: blue600,
  },

});


export default themeDefault;