import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { Button, ScrollView, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';

export default function Quiz( props: any ) {

	const [quizContent, setQuizContent] = React.useState<any[]>([]);
	const [inputAnswers, setInputAnswers] = React.useState<boolean[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<boolean>(false);
	const [curQuesIdx, setCurQuesIdx] = React.useState<number>(0);
	const [toggledState, setToggledState] = React.useState<any>({});

	const defaultQuizConfig = {
		amount: 10,
		difficulty: 'hard',
		type: 'boolean'
	}

	const getQuizApiUrl = (params: any) => {
		const url = new URL('https://opentdb.com/api.php');
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		return url.href;
	}

	const setUserAnswer = (val: boolean) => {
		inputAnswers.push(val);
		setInputAnswers(inputAnswers);
		setCurQuesIdx(curQuesIdx => curQuesIdx + 1);
	}

	const getCorrectAns = (val: string) => val === "True";

	const getScore = () => {
		let correct = 0;
		quizContent.forEach( (c, idx) => {
			if (inputAnswers[idx] === getCorrectAns(c["correct_answer"]))
				correct += 1;
		});

		return correct + ' / ' + inputAnswers.length;
	}

	const setToggle = (idx: number) => {
		const m = {
			...toggledState,
			[idx]: !Boolean(toggledState[idx])
		}
		setToggledState(m);
	}

	React.useEffect(() => {
		if (!quizContent.length) {
			const url = getQuizApiUrl(defaultQuizConfig);
			fetch(url).then(r => r.json())
				.then(json => {
					setQuizContent(json.results);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setError(true);
				});
		}
	}, [quizContent, toggledState])


	// handle page rendering states
	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={[styles.headline, { color: 'grey' }]}>{"Failed to load quiz content."}</Text>
				<Button
					title="Try agian"
					onPress={() =>
						props.navigation.replace('Home')
					}
				/>
			</View>
		)
	}

	if (loading) {
		return (
			<View style={styles.errorContainer}>
				<Text style={[styles.headline, {color: 'grey'}]}>{"Loading..."}</Text>
			</View>
		)
	}

	return curQuesIdx < quizContent.length ? (
		<View style={styles.container}>
			<View style={{marginTop: '50%'}}>
				<Text style={styles.headline}>{quizContent[curQuesIdx].category}</Text>
				<View style={styles.questionContainer}>
					<HTML baseFontStyle={{ fontSize: 22 }} html={quizContent[curQuesIdx].question} />
				</View>
				<Text style={{ textAlign: 'center', fontSize: 24 }}>{`${curQuesIdx + 1} / ${quizContent.length}`}</Text>
			</View>

			<View style={styles.footer}>
				<TouchableOpacity
					style={[styles.button, {backgroundColor: 'red'}]}
					onPress={() => setUserAnswer(false)}
				>
					<Text style={styles.buttonText}>False</Text> 
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, { backgroundColor: 'green' }]}
					onPress={() => setUserAnswer(true)}
				>
					<Text style={styles.buttonText}>True</Text>
				</TouchableOpacity>
			</View>
		</View>
	) : (
		<View style={styles.container}>
			<View style={{paddingVertical: 10}}>
				<Text style={styles.resultHeadline}>
					You scored
				</Text>
				<Text style={styles.resultHeadline}>
					{getScore()}
				</Text>
			</View>
			
			<ScrollView>
				{quizContent.map( (c, idx) => (
					<View key={c.question} style={styles.listItem}>
						<TouchableOpacity onPress={() => setToggle(idx)}>
							<Text style={{ fontSize: 28 }}>{toggledState[idx] ? '-' : '+'}</Text>
							<View style={{flexWrap: 'nowrap'}}><HTML baseFontStyle={{ fontSize: 16 }} html={c.question} /></View>
						</TouchableOpacity>
						{toggledState[idx] ? <View style={styles.answerView}>
							<Text>
								Your answer: 
								{<Text style={{ color: (Boolean(inputAnswers[idx]) === getCorrectAns(c["correct_answer"]) ? 'green' : 'red'), fontWeight: 'bold' }}>{inputAnswers[idx] ? ' True' : ' False'}</Text>}
							</Text>
							<Text>
								Correct answer:
								{' ' + c["correct_answer"]}
							</Text>
						</View> : null}
					</View>
				))}
			</ScrollView>

			<View style={{flex: 1, width: '100%'}}>
				<Button
					title="Play Again"
					onPress={() =>
						props.navigation.replace('Home')
					}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	errorContainer: { 
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
	},
	headline: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	questionContainer: {
		display: 'flex',
		padding: 10,
		marginHorizontal: 5,
		marginVertical: 20,
		borderColor: 'grey',
		backgroundColor: '#ccc',
		borderWidth: 1,
		borderRadius: 2,
	},
	footer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
	},
	button: {
		width: '50%',
		height: 54,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonText: {
		color: '#fff', 
		fontSize: 24,
		fontWeight: 'bold',
	},
	listItem: {
		flex: 1,
		padding: 10,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 2,
		marginBottom: 10,
		marginHorizontal: 5
	},
	answerView: { 
		marginTop: 10, 
		flexDirection: 'row', 
		justifyContent: 'space-between',
	},
	resultHeadline: {
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingVertical: 5,
	}
});

