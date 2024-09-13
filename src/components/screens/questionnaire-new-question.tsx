import { Check } from "@mui/icons-material";
import { Card, CardContent, TextField, Typography, Button, Paper, List, FormGroup, FormControlLabel, Checkbox, Box, ButtonGroup } from "@mui/material";

// THIS IS CURRENTLY NOT USED, IS IMPLEMENTED IN THE QUESTIONNAIRE-NEW-QUIZ-SCREEN.TSX ASS DIALOG

const addNewQuestionCard = async () => {
	return (
		<Paper>
			<Card className="new-question"
			sx={{
				p: 3,
				width: "80%",
				display: "flex",
				flexDirection: "column",
				height: "100",
			}}>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						New Question
					</Typography>
					
					<TextField
						id="textfield-question-body"
						label="Question"
						multiline
						rows={6}
						defaultValue="Insert question here"
						fullWidth
					/>

					<Box>
						<FormGroup 
						row 
						aria-label="List of answers, correct ones should be marked with a checkmark">
							<Checkbox
								icon={<Check />}
								checkedIcon={<Check />}
								name="checkedH"
								checked={false}
								onChange={() => { } }  />
							<TextField
							variant="outlined"
							label="Insert Option"
							/>				
						</FormGroup>
					</Box>

					<ButtonGroup>
						<Button 
						size="large" 
						variant="contained" 
						color="primary">
						+ Add new Answer option
						</Button>
						<Button 
						size="large" 
						variant="contained" 
						color="primary">
						Save question
						</Button>
					</ButtonGroup>
					
				</CardContent>
			</Card>
		</Paper>
	);
};

export default addNewQuestionCard;