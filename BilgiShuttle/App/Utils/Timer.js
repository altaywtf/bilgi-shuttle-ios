import React, {Text, AppStateIOS} from 'react-native';

var Timer = React.createClass({
  getInitialState: function() {
    return {
      timeRemaining: this.props.seconds, 
      timeDisplay: 'Loading',
      currentAppState: AppStateIOS.currentState,
      sleepTime: '',
      wakeUpTime: ''
    };
  },
  
  tick: function() {
    if(this.state.timeRemaining == 'Done For Today!'){
      this.setState({timeDisplay: 'Done For Today!'});
    } else {
      this.setState({timeRemaining: this.state.timeRemaining - 1})

    	var timer = this.state.timeRemaining;

      var hours = parseInt(timer / 3600, 10)
      var t2 = timer - (hours * 3600)
      var minutes = parseInt(t2 / 60, 10)
      var seconds = parseInt(timer % 60, 10);

      hours = hours < 10 ? '0' + hours : hours;
      hours = hours == 0 ? '' : hours + ':';
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.setState({timeDisplay: hours + minutes + ':' + seconds});
    }

    if (this.state.timeRemaining <= 0) {
      if(this.props.nextOne == 'Done!') {
        this.setState({timeRemaining: 'Done For Today!'});
      } else {
        let c = new Date();
        let d = new Date();
        let nt1 = this.props.nextOne.split(':')[0];
        let nt2 = this.props.nextOne.split(':')[1];
        d.setHours(nt1, nt2, 0);
        let newTimeDiff = (d-c) / 1000;
        this.setState({timeRemaining: newTimeDiff});
      }
    }
  },
  
  componentDidMount: function() {
    // tick runs every secs
    this.interval = setInterval(this.tick, 1000);
    // listening for appstate change
    AppStateIOS.addEventListener('change', this._handleAppStateChange);
  },
  
  componentWillUnmount: function() {
    // tick runs every secs
    clearInterval(this.interval);
    // removing event listener on appstate change
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  },

  _handleAppStateChange: function(currentAppState) {
    // set currentAppState
    this.setState({ currentAppState });
    // app goes to sleep
    if(this.state.currentAppState == 'background') {
      // set a sleep time so we know when app went sleep
      this.setState({sleepTime: new Date()});
    } else if (this.state.currentAppState == 'active') {
      // set timedisplay to loading (a little space for calculation)
      this.setState({timeDisplay: 'Loading'});
      // set wakeuptime so we can compare it with sleep time
      this.setState({wakeUpTime: new Date()});
      // calculating time elapsed between sleep and wakeup
      let sleepWakeUpDiff = parseInt((this.state.wakeUpTime-this.state.sleepTime)/1000);
      // still on the current shuttle
      if(sleepWakeUpDiff <= this.state.timeRemaining){
        this.setState({timeRemaining: this.state.timeRemaining - sleepWakeUpDiff});
      } else { // skipped to the next
        if(this.props.nextOne == 'Done!') {
        this.setState({timeRemaining: 'Done For Today!'});
        } else {
          let c = new Date();
          let d = new Date();
          let nt1 = this.props.nextOne.split(':')[0];
          let nt2 = this.props.nextOne.split(':')[1];
          d.setHours(nt1, nt2, 0);
          let newTimeDiff = (d-c) / 1000;
          this.setState({timeRemaining: newTimeDiff});
        }
      }
    }
  },
  
  render: function() {
    return (
      <Text>{this.state.timeDisplay}</Text>
    );
  }
});

export default Timer;