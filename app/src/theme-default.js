import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, blue600, grey600} from 'material-ui/styles/colors';
import {customgrey} from './theme-colors';

const themeDefault = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    accent1Color: blue600
  },
  appBar: {
    height: 58,
    color: white
  },
  drawer: {
    width: 280,
    color: customgrey,
  },
  raisedButton: {
    primaryColor: blue600,
  },
  textField: {
    underlineFocusStyle: blue600,
    underlineStyle: blue600,
    hintStyle: blue600
  }
});


export default themeDefault;