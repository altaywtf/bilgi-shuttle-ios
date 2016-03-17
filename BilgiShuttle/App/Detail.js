import React, {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableHighlight,
  AppStateIOS
} from 'react-native';

import Timer from './Utils/Timer';
import List from './List';

// Device Width for Responsive Units
import Dimensions from 'Dimensions';
const deviceWidth = Dimensions.get('window').width;

export default class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      nodes: this.props.data.nodes,
			routes: this.props.data.routes.filter((route) => route.start == this.props.nodeID),
      currentAppState: AppStateIOS.currentAppState
		}
	}

  componentDidMount() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(currentAppState) {
    this.props.navigator.pop();
  }

  getNextValues(start, destination) {
    const routes = this.state.routes;
    const next = {
      ring: false,
      in_secs: '',
      next_next_one: ''
    };

    // DISPOSABLE VARIABLES
    const currentTime = new Date();
    const routeRequested = routes.filter((route) => (route.start==start && route.destination==destination))[0];

    const routeRawData = routeRequested.raw_data.split(' - ');
    const routeTimes = [];

    // transforming raw data to time format
    routeRawData.map((time) => {
      if(time == 'Ring'){
        routeTimes.push(time);
      } else {
        let d = new Date();
        let t = time.split(':');
        d.setHours(t[0], t[1], 0);
        routeTimes.push(d);
      }
    });

    // ring check
    routeTimes.map((time, index) => {
      if(time == 'Ring' && routeTimes[index-1]){
        if(routeTimes[index-1] < currentTime && routeTimes[index+1]>currentTime) {
          next.ring = true;
        }
      }
    });

    // find next shuttles --will be used in next steps--
    const nextShuttles = routeTimes.filter((time) => time > currentTime);

    // set next.in_secs
    if(nextShuttles[0]) {
      next.in_secs = (nextShuttles[0]-currentTime) / 1000;
    } else {
      next.in_secs = 'Done For Today!';
    }

    // set next.next_next_one
    if(next.ring == true){
      next.next_next_one = nextShuttles[0].getHours()+':'+(nextShuttles[0].getMinutes() === 0 ? '00' : nextShuttles[0].getMinutes());
    } else {
        if(nextShuttles[1]) {
          next.next_next_one = nextShuttles[1].getHours()+':'+(nextShuttles[1].getMinutes() === 0 ? '00' : nextShuttles[1].getMinutes());
        } else {
          next.next_next_one = 'Done!';
        }
    }
    return next;
  }

	render() {
		const routeList = this.state.routes.map((route, index) => {

      const start = route.start;
      const destination = route.destination;
      const destinationName = this.state.nodes.filter((node) => node.id == destination)[0].name;

      // preparing 'NEXT' values for rendering
      let nextValues = this.getNextValues(start, destination);

      let timeRemaining = nextValues.in_secs;
      let isRing = nextValues.ring;
      let nextOne = nextValues.next_next_one;

			// rawData manipulation
      let rawData = route.raw_data;
			let rawArr = rawData.split(' - ');
			let newArr = [];
			let rawNew = [];

			while(rawArr.length > 0) {
				if(deviceWidth > 320) {
					newArr.push(rawArr.splice(0, 7));
				} else {
					newArr.push(rawArr.splice(0, 6));
				}
			}

			newArr.map((item) => {
				let temp = item.join(' - ');
				rawNew.push(temp);
			});

			let rawPrint = rawNew.map((item, index) => {
				return (
					<Text key={index} style={styles.routeRawData}>{item}</Text>
				);
			});

			return (
				<View key={index} style={styles.routeBox}>
					<Text style={styles.routeDestination}> {destinationName} </Text>
					<Text style={styles.routeTime}> {isRing ? 'Ring' : (timeRemaining == 'Done For Today!' ? 'Done For Today!' : <Timer seconds={timeRemaining} nextOne={nextOne}/>)} </Text>
					<View style={styles.routeRawContainer}>{rawPrint}</View>
					<Text style={styles.routeNextOne}> {nextOne == 'Done!' ? ' ' : 'Next One: '+nextOne} </Text>
				</View>
			)
		})

		return (
			<ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
				{routeList}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  contentContainer: {
  	flexDirection: 'column',
  	marginTop: 5,
  },
  routeBox: {
  	margin: 10,
  	padding: 15,
  	justifyContent: 'center',
  	alignItems: 'center',
  	backgroundColor: '#F6F6F6',
  	borderWidth: 2,
    borderRadius: 2,
    borderColor: '#DDD',
    borderBottomColor: '#D50000'
  },
  routeDestination: {
  	fontSize: 22,
  	fontWeight: '600',
  	color: '#151515',
    marginTop: 5,
  	marginBottom: 20
  },
  routeTime: {
  	fontSize: 18,
    fontWeight: '600',
  	color: '#D50000',
  	marginBottom: 5
  },
	routeRawContainer: {
		marginTop: 15,
		marginBottom: 15,
		justifyContent: 'center',
  	alignItems: 'center'
	},
  routeRawData: {
    fontSize: 11,
    color: '#424242',
		lineHeight: 15
  },
  routeNextOne: {
  	fontSize: 12,
    fontWeight: '600',
  	color: '#151515'
  }
});
