"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

const API_BASE = process.env.NEXT_PUBLIC_DBURL;

export default function Zoom() {
  const [user, setUser] = useState({});
  const [meeting, setMeeting] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 1, // 1 = host, 0 = participant
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // Load and initialize Zoom SDK when script is ready
  useEffect(() => {
    console.log("sdk available", window.ZoomMtg);
    if (isSdkLoaded && window.ZoomMtg) {
      console.log("Initializing Zoom SDK");
      window.ZoomMtg.setZoomJSLib("https://source.zoom.us/3.12.0/lib", "/av");
      window.ZoomMtg.preLoadWasm();
      window.ZoomMtg.prepareWebSDK();
      console.log("Zoom SDK initialized");
    }
  }, [isSdkLoaded]);

  const registerUser = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (data.token) setUser(data);
      else setError(data.message || "Registration failed");
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  const loginUser = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (data.token) setUser(data);
      else setError(data.message || "Login failed");
    } catch (error) {
      setError(error.message || "Login failed");
    }
  };

  const createMeeting = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/create-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: "Test Meeting",
          start_time: new Date().toISOString(),
          // start_time: "2025-04-07T1:00:00",
          duration: 30,
          timezone: "UTC",
        }),
      });
      const data = await response.json();
      console.log("Meeting created:", data);
      setMeeting(data);
    } catch (error) {
      console.error("Failed to create meeting:", error);
      setError(error.message || "Failed to create meeting");
    }
  };

  const startMeeting = async () => {
    if (!meeting?.id) {
      setError("No meeting ID available");
      console.log("No meeting ID");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching meeting data for ID:", meeting.id);
      const meetingData = await fetch(
        `${API_BASE}/api/meetings/${meeting.id}/data`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ role: formData.role }),
        }
      ).then((res) => res.json());

      console.log("Meeting data:", meetingData.signature);

      window.ZoomMtg.init({
        leaveUrl: "http://localhost:3000", // Adjust to your app’s URL
        isSupportAV: true,
        success: () => {
          console.log("ZoomMtg.init success");
          window.ZoomMtg.join({
            // signature: meetingData.signature,
            signature: meetingData.signature,
            meetingNumber: meetingData.meetingNumber,
            userName: formData.name || "Zoom User",
            sdkKey: "S0KY6waRXbOkH6Ag7uIA", // Your SDK Key
            userEmail: formData.email || "zoomtest@test.com",
            passWord: meetingData.password,
            success: () => {
              console.log("Joined meeting successfully");
            },
            error: (err) => {
              console.error("Join error:", err);
              setError(err.message || "Failed to join meeting");
            },
          });
        },
        error: (err) => {
          console.error("Init error:", err);
          setError(err.message || "Failed to initialize Zoom");
        },
      });
    } catch (err) {
      console.error("Start error:", err);
      setError(err.message || "Failed to start meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://source.zoom.us/3.12.0/lib/vendor/react.min.js"
        strategy="afterInteractive"
        onError={(e) => console.error("Failed to load React:", e)}
      />
      <Script
        src="https://source.zoom.us/3.12.0/lib/vendor/react-dom.min.js"
        strategy="afterInteractive"
        onError={(e) => console.error("Failed to load React DOM:", e)}
      />
      <Script
        src="https://source.zoom.us/3.12.0/lib/vendor/redux.min.js"
        strategy="afterInteractive"
        onError={(e) => console.error("Failed to load Redux:", e)}
      />
      <Script
        src="https://source.zoom.us/3.12.0/lib/vendor/redux-thunk.min.js"
        strategy="afterInteractive"
        onError={(e) => console.error("Failed to load Redux Thunk:", e)}
      />
      <Script
        src="https://source.zoom.us/3.12.0/lib/vendor/lodash.min.js"
        strategy="afterInteractive"
        onError={(e) => console.error("Failed to load Lodash:", e)}
      />

      <Script
        src="https://source.zoom.us/zoom-meeting-3.12.0.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Zoom Web SDK loaded successfully");
          setIsSdkLoaded(true);
        }}
        onError={(e) => {
          console.error("Failed to load Zoom Web SDK:", e);
          setError("Failed to load Zoom SDK");
        }}
      />

      <div>
        <main>
          <h1>Zoom Meeting App</h1>
          {error && <div className="error">{error}</div>}
          {isLoading && <div>Processing...</div>}
          {!isSdkLoaded && <div>Loading Zoom SDK...</div>}

          <div className="auth-section">
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: parseInt(e.target.value) })
              }
            >
              <option value={1}>Host</option>
              <option value={0}>Participant</option>
            </select>
            <div className="auth-buttons gap-x-[50px] flex flex-row">
              <button onClick={registerUser} disabled={isLoading}>
                Register
              </button>
              <button onClick={loginUser} disabled={isLoading}>
                Login
              </button>
            </div>
          </div>

          {user.token && (
            <div className="meeting-controls">
              <button onClick={createMeeting} disabled={isLoading}>
                Create Meeting
              </button>
              {meeting?.id && (
                <button
                  onClick={startMeeting}
                  disabled={isLoading || !isSdkLoaded}
                >
                  {formData.role === 1 ? "Start Meeting" : "Join Meeting"}
                </button>
              )}
            </div>
          )}

          {meeting?.id && (
            <div className="meeting-info ">
              <h3>Meeting ID: {meeting.id}</h3>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
