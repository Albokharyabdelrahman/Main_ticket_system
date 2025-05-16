import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/profile", {
          withCredentials: true, // This allows cookies (token) to be sent
        });
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      {profile.profilePicture && (
        <img src={profile.profilePicture} alt="Profile" width="100" />
      )}
    </div>
  );
}
