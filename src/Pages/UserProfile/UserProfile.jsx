import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faPen } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Avatar from "../../components/Avatar/Avatar";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import "./UsersProfile.css";
import { getLoginInfo } from "../../api";

const UserProfile = ({ slideIn, handleSlideIn }) => {
  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);
  const currentProfile = users.filter((user) => user._id === id)[0];
  const [loginHistory, setLoginHistory] = useState(null);
  const currentUser = useSelector((state) => state.currentUserReducer);
  const [Switch, setSwitch] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('Profile')).result
  useEffect(() => {
    if (loggedInUser._id === id) {
      getLoginInfo(id).then(loginHistory => setLoginHistory(loginHistory.data.loginInfo)).catch(err => console.error(err));
    }
    // eslint-disable-next-line
  }, [id])
  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentProfile?.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentProfile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "}
                  {moment(currentProfile?.joinedOn).fromNow()}
                </p>
              </div>
            </div>
            {currentUser?.result._id === id && (
              <button
                type="button"
                onClick={() => setSwitch(true)}
                className="edit-profile-btn"
              >
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            )}
          </div>
          <>
            {Switch ? (
              <EditProfileForm
                currentUser={currentUser}
                setSwitch={setSwitch}
              />
            ) : (
              <ProfileBio currentProfile={currentProfile} />
            )}
          </>
          {
            loggedInUser._id === id && <div  >
              <h2 style={{ textAlign: "center" }}>Login History</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center",height:"320px",overflow:"auto" }}>
                {
                  loginHistory && loginHistory.map(history => {
                    return <div style={{ backgroundColor: "#f1f1f1", padding: '6px', width: 'fit-content', height:"fit-content", borderRadius: "6px" }} key={history.loginAt}>
                      <p>Oprating System: {history.os}</p>
                      <p>Browser: {history.browser}</p>
                      <p>IP Address: {history.ip}</p>
                      <p>Date : {new Date(history.loginAt).toLocaleDateString()} {new Date(history.loginAt).toLocaleTimeString()}</p>
                    </div>
                  })
                }
              </div>
            </div>
          }
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
