import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { Button } from 'react-native';

export default function Home({ navigation }: { navigation: any }) {
	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 42, textAlign: 'center' }}>Welcome to the Trivia Challenge!</Text>

			<View>
				<Text style={styles.title}>You will be presented with 10 True or False Questions.</Text>
				<Text style={styles.title}>Can you score 100%?</Text>
			</View>
			
			<Button
				title="Begin!"
				onPress={() =>
					navigation.navigate('Quiz')
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 20
	},
	title: {
		fontSize: 24,
		color: 'grey',
		paddingVertical: 20,
		textAlign: 'center'
	},
});