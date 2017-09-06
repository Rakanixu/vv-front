import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import './ConfirmationDialog.css';

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false
    };
/*     title="Confirm deletion"
    message="Are you sure to do this? Can't be undone."
    confirmLabel="Confirm"
    cancelLabel="Cancel"
    onConfirm={this._deleteEvent.bind(this)}
    onCancel={this._hideConfirmation.bind(this)} */
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.showDialog) {
      this._handleDialogOpen();
    } else {
      this._handleDialogClose();
    }
  }

  _handleDialogOpen = () => {
    this.setState({ openDialog: true });
  };

  _handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  _handleCondfirm() {
    this.props.onConfirm();
    this._handleDialogClose();
  }

  render() {
    return (
      <Dialog title={this.props.title}
              modal={false}
              contentStyle={{width: 260}}
              open={this.state.openDialog}
              onRequestClose={this._handleDialogClose}
              autoScrollBodyContent={true}>
        <div>
          <p>{this.props.message}</p>

          <div className="dialog-actions">
            <RaisedButton label={this.props.cancelLabel}
                          className="cancel-button"
                          onTouchTap={this.props.onCancel} />
            <span className="separator"></span>
            <RaisedButton label={this.props.confirmLabel}
                          className="confirm-button"
                          onTouchTap={this._handleCondfirm.bind(this)} />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
