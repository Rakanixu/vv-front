import React from 'react';
import TextField from 'material-ui/TextField';
import {black, blue500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

const SearchBox = () => {

  const styles = {
    searchWrap: {
      position: 'relative'
    },
    iconButton: {
      position: 'absolute',
        top: -5,
        right: 40
    },
    textField: {
      marginRight: 50,
      color: '#6a798f',
      backgroundColor: '#f1f1f1',
      borderRadius: 2,
      width: 150,
      height: 35
    },
    inputStyle: {
      color: '#6a798f',
      width: 120,
      paddingLeft: 5,
    },
    hintStyle: {
      top: '20%',
      height: 16,
      paddingLeft: 5,
      color: '#6a798f'
    }
  };

  return (
    <div style={styles.searchWrap}>
      <IconButton style={styles.iconButton} >
        <Search color={black} />
      </IconButton>
      <TextField
        hintText="Search..."
        underlineShow={false}
        fullWidth={false}
        style={styles.textField}
        inputStyle={styles.inputStyle}
        hintStyle={styles.hintStyle}
      />
    </div>
  );
};

export default SearchBox;