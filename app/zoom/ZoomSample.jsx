"use client";
// import { ZoomMtg } from "@zoomus/websdk";
import React, { useEffect } from "react";
if (typeof window !== "undefined") {
  window.React = React;
}

// ZoomMtg.setZoomJSLib("https://source.zoom.us/2.13.0/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

function ZoomSample() {
  //   const authEndpoint = ""; // http://localhost:4000
  const sdkKey = "UoCjUegUT16YHg1qRgb0Dg";
  const meetingNumber = "85210613430";
  const passWord = "9N1Qck";
  //   const role = 0;
  const userName = "React";
  const userEmail = "Testmail@test.com";
  //   const registrantToken = "";
  //   const zakToken = "";
  const leaveUrl = "http://localhost:3000";

  //   const getSignature = async () => {
  //     try {
  //       const req = await fetch(authEndpoint, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           meetingNumber: meetingNumber,
  //           role: role,
  //         }),
  //       });
  //       const res = await req.json()
  //       const signature = res.signature ;
  //       startMeeting(signature)
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  function startMeeting(ZoomMtg) {
    // document.getElementById("zmmtg-root")!.style.display = "block";
    console.log("This is ZoomMtg inside start meeting scope", ZoomMtg);
    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success) => {
        console.log(success);
        // can this be async?
        ZoomMtg.join({
          signature:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZGtLZXkiOiJVb0NqVWVnVVQxNllIZzFxUmdiMERnIiwibW4iOiI4NTIxMDYxMzQzMCIsInJvbGUiOjEsImlhdCI6MTc0NDAzNzM3NiwiZXhwIjoxNzQ0MDQ0NTc2LCJ0b2tlbkV4cCI6MTc0NDA0NDU3Nn0.FeGScQWU5jOrEzf6TqCrj9tTDy1o2jx2ywsbIfNF-_s",
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          //   tk: registrantToken,
          //   zak: zakToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    const loadZoomSDK = async () => {
      const { ZoomMtg } = await import("@zoom/meetingsdk");
      ZoomMtg.setZoomJSLib("https://source.zoom.us/3.12.0/lib", "/av");
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
      startMeeting(ZoomMtg); // Call startMeeting here, AFTER ZoomMtg is imported and initialized.
    };

    loadZoomSDK();
  }, []);

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>
        {/* <button onClick={getSignature}>Join Meeting</button> */}
      </main>
    </div>
  );
}

export default ZoomSample;
