import React, { useEffect, useState } from "react";
import { Button, Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
	const {activityStore} = useStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedAcitvity] = useState< Activity | undefined >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  	agent.Activities.list().then(res => {
  		let activities: Activity[] = [];
			res.forEach(act=>{
				act.date = act.date.split('T')[0];
				activities.push(act);
			});
			setActivities(activities);
			setLoading(false);
		});
    // axios
    //   .get<Activity[]>("http://localhost:5000/api/activities")
    //   .then((response) => {
    //     setActivities(response.data);
    //   });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedAcitvity(activities.find((x) => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedAcitvity(undefined);
	}
	
	function handleFormOpen(id?: string) {
		id ? handleSelectActivity(id) : handleCancelSelectActivity();
		setEditMode(true);
	}
	function handleFormClose() {
		setEditMode(false);
	}
	const handleCreateOrEditActivity = (activity: Activity) => {
		setSubmitting(true);
		if (activity.id){
			agent.Activities.update(activity).then(()=>{
				setActivities([...activities.filter(x=>x.id !==activity.id), activity]);
				setSelectedAcitvity(activity);
				setEditMode(false);
				setSubmitting(false);
			});
		} else {
			activity.id = uuid();
			agent.Activities.create(activity).then(()=>{
				setActivities([...activities, activity]);
				setSelectedAcitvity(activity);
				setEditMode(false);
				setSubmitting(false);
			});
		}
	};
	const handleDeleteActivity = (id: string) => {
		// setActivities([...activities.filter(x=>x.id !== id)]);
		//my try
		setSubmitting(true);
		agent.Activities.delete(id).then(()=>{
			setActivities(activities.filter(x=>x.id !== id));
			setSubmitting(false);
		});
	}
	if (loading) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
				<h2>{activityStore.title}</h2>
				<Button content='Add ex' positive onClick={activityStore.setTitle}/>
        <ActivityDashboard 
					activities={activities}
					selectedActivity={selectedActivity}
					selectActivity={handleSelectActivity}
					cancelSelectActivity={handleCancelSelectActivity}
					editMode = {editMode}
					openForm = {handleFormOpen}
					closeForm = {handleFormClose}
					createOrEdit = {handleCreateOrEditActivity}
					deleteActivity = {handleDeleteActivity}
					submitting={submitting}
				/>
      </Container>
    </>
  );
}

// export default App;
export default observer(App);