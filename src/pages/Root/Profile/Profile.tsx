import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../store/userDetails/selector";
import { Suspense } from "react";



export const Profile = () => {

    // get profile data from axios api call 
    const [profile, setProfile] = useState<any>(null);
    const {userId} = useSelector(userDetailsSelector)
    const [loading, setLoading] = useState(true);

    const getProfile = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/userprofile/${userId}`);
            setProfile(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if(userId){
          getProfile();
        }
    }, [getProfile, userId]);

    return (
        <Suspense children={
<div id="profile">
            <h1>User Profile</h1>
            <p>
                <b>Name:</b> {profile?.first_name + " " + profile?.last_name}
            </p>
            <p>
                <b>Email:</b> {profile?.email}
            </p>
            <p>
                <b>Section:</b> {profile?.section}
            </p>
            <p>
                <b>Roll No:</b> {profile?.roll_no}
            </p>
            <p>
                <b>Course: </b> {profile?.course_name}
            </p>
        </div>
        } fallback={<div>Loading </div>} />
        
        
    );
}
