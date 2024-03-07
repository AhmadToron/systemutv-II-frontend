import './Settings.css';
import Navbar from "../../Navbar";
import {useState, useRef} from "react";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const getUserData = async () => {
        const userId = sessionStorage.getItem('userId');
        const url = `http://localhost:7002/v1/users/${userId}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('notifications', data.isNotificationsActivated);
                sessionStorage.setItem('funFacts', data.funFactsActivated);

                setFacts(data.funFactsActivated)
                setNotifications(data.isNotificationsActivated);
            } else {
                alert("Error fetching user data.");
            }
        } catch (error) {
            alert("Network error: " + error.message);
        }
    }

    getUserData().then(r => {
        console.log("User data fetched successfully.");
    });

    const isNotificationsActive = sessionStorage.getItem('notifications');
    const isFunFactsActivated = sessionStorage.getItem('funFacts');

    const [notifications, setNotifications] = useState(isNotificationsActive === 'true');
    const [facts, setFacts] = useState(isFunFactsActivated === 'true');
    const [deleteAcc, setDeleteAcc] = useState(false);
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleNot = async() => {
        const userId = sessionStorage.getItem('userId');
        const url = `http://localhost:7002/v1/users/${userId}`;
        let notification = notifications;

        notification = !notification;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notificationsActivated: notification,
                }),
            });

            if (response.ok) {
                setNotifications(notification);
            } else {
                alert("Unable to update notifications setting.");
            }
        } catch (error) {
            alert("Network error: " + error.message);
        }
    };

    const handleFact = async() => {
        const userId = sessionStorage.getItem('userId');
        const url = `http://localhost:7002/v1/users/${userId}`;
        let fact = facts;

        fact = !fact;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    funFactsActivated: fact,
                }),
            });

            if (response.ok) {
                setFacts(fact);
            } else {
                alert("Unable to update fun facts setting.");
            }
        } catch (error) {
            alert("Network error: " + error.message);
        }
    };

    const handleProfilePicChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePic(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleDel = (e) => {
        setDeleteAcc(!deleteAcc);
    };

    const handleLogOut = (e) => {
        navigate('/');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const deleteUserById = async () => {
        const userId = sessionStorage.getItem('userId');
        const url = `http://localhost:7002/v1/users/${userId}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password }),
            });

            if (response.status === 204) {
                alert("Account successfully deleted.");
                navigate('/');
            } else {
                alert("Error deleting account.");
            }
        } catch (error) {
            alert("Network error: " + error.message);
        }
    };

    return (
        <div className={"profile"}>
            <Navbar/>
            <div className={"main-panel-profile"}>
                <div className={"profile-container"}>
                    <div className={"profile-info"}>
                        <div className={"profile-picture"} onClick={triggerFileInput}>
                            {profilePic ? <img src={profilePic} alt="Profile" style={{width: "", height: ""}}/> : "Upload Picture"}
                            <input type="file" style={{display: "none"}} ref={fileInputRef} onChange={handleProfilePicChange} />
                        </div>
                        <h2>Your name</h2>
                        <button onClick={handleLogOut}>Log out</button>
                    </div>
                    <div className={"settings-buttons"}>
                        <button onClick={handleNot}>{notifications ? "Notifications off" : "Notifications on"}</button>
                        <button onClick={handleFact}>{facts ? "Facts off" : "Facts on"}</button>
                        <button className={"delete-acc-button"} onClick={handleDel}>Delete account</button>
                        {deleteAcc ?
                            <div className={"delete-notification"}>
                                <h1>Are you sure?</h1>
                                <input type={"password"} placeholder={"Enter your password to confirm"} onChange={handlePasswordChange}/>
                                <button className={"delete-acc-button"} onClick={deleteUserById}>Delete Account</button>
                                <h2>Changed your mind?</h2>
                                <button onClick={handleDel}>Close</button>
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;