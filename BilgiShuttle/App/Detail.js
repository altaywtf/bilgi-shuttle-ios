import React, {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import Timer from './Utils/Timer';

export default class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			routes: this.props.routes,
			start_node: this.props.start_node,
		}
	}

	render() {
		const routeList = this.state.routes.map((route, index) => {

			const destination = route.destination;
			const rawData = route.raw_data;
			const nextOne = route.next.next_next_one;
			let timeRemaining = route.next.in_secs;

			return (
				<View key={index} style={styles.routeBox}>
					<Text style={styles.routeDestination}> {destination} </Text>
					<Text style={styles.routeTime}> {nextOne == 'DONE' ? 'Done for Today!' : (route.next.ring == true ? 'Ring' : <Timer seconds={timeRemaining}/>)} </Text>
					<Text style={styles.routeRawData}> {rawData} </Text>
					<Text style={styles.routeNextOne}> {nextOne == 'DONE' ? ' ' : 'NEXT: '+nextOne} </Text>
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
  	fontSize: 20,
  	fontWeight: '600',
  	color: '#151515',
    marginTop: 5,
  	marginBottom: 20
  },
  routeTime: {
  	fontSize: 16,
    fontWeight: '600',
  	color: '#D50000',
  	marginBottom: 5
  },
  routeRawData: {
    paddingLeft: 10,
    paddingRight: 10,
  	textAlign: 'center',
    fontSize: 8,
    marginTop: 15,
    marginBottom: 15,
    color: '#424242',
    lineHeight: 10
  },
  routeNextOne: {
  	fontSize: 10,
  	color: '#151515'
  }
});