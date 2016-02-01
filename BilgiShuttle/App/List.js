import React, {
	View,
	ScrollView,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight
} from 'react-native';

import Detail from './Detail';
import slugify from './Utils/Slugify';

// Device Width for Responsive Units
import Dimensions from 'Dimensions';
const deviceWidth = Dimensions.get('window').width;

// baseURL for api calls
const baseURL = 'http://localhost:8000';

export default class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nodes: []
		}
	}

	componentDidMount(){
		this.fetchData();
	}

	fetchData() {
		fetch(baseURL+'/index.json')
			.then((res) => res.json())
			.then((res) => this.setState({nodes: res.nodes}))
			.done();
	}

	goToRoutePage(route) {
		routeSlug = slugify(route);

		fetch(baseURL+'/'+routeSlug+'.json')
			.then((res) => res.json())
			.then((res) => {
        this.props.navigator.push({
          component: Detail,
          title: route,
          passProps: {
            routes: res.routes,
            start_node: res.start_node,
          }
        });
      })
	}

	render() {
		const nodeList = this.state.nodes.map((node, index) => {			
			return (
				<TouchableHighlight
					key={index}
					onPress={this.goToRoutePage.bind(this, node.name)}
					underlayColor='transparent'
				>
					<View style={styles.nodeBox}>
						<Image
	          source={{uri: baseURL+node.image}}
	          style={styles.nodeImage}
	          resizeMode='contain'
	        	/>
						<Text style={styles.nodeTitle}>{node.name}</Text>
					</View>
				</TouchableHighlight>
			);
		});

		return (
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			 {nodeList}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor: '#F0F0F0',
	},

  contentContainer: {
  	flexDirection: 'row',
    flexWrap: 'wrap',
    
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 5,

    backgroundColor: '#F0F0F0'
  },

  nodeBox: {
  	alignItems: 'center',
    justifyContent: 'center',

    margin: 10,
    width: (deviceWidth/2)-30,
    height: 130,
    backgroundColor: '#F6F6F6',

    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#DDD',
    borderBottomColor: '#D50000',
  },
  nodeImage: {
    width: (deviceWidth/4),
    height: (deviceWidth/4)-40,
  },
  nodeTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    color: '#151515'
  },
  emptyArea: {
  	flex: 1,
  	height: 250,
  	backgroundColor: 'black'
  }
});