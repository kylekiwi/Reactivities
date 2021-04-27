import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityForm from '../from/ActivityForm';
import ActivityDetails from './ActivityDetails';
import ActivityList from './ActivityList';

interface Prop {
	activities : Activity[]
}
const ActivityDashboard = ({activities}:Prop) => {
	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityList activities={activities}/>
			</Grid.Column>
			<Grid.Column width='6'>
				{activities[0] && 
					<ActivityDetails activity={activities[0]} />}
					<ActivityForm/>
			</Grid.Column>
		</Grid>
	);
};

export default ActivityDashboard;