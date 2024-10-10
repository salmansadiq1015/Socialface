// import { NextResponse } from "next/server";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// const APP_ID = 1101658594;
// const SERVER_SECRET = "dddc24a2b524eeadd2a1b27ef050e665";

// export async function POST(request) {
//   try {
//     const { roomID, userID, userName, callType } = await request.json();

//     console.log("Data:", roomID, userID, userName, callType);

//     if (!roomID || !userID || !userName || !callType) {
//       return NextResponse.json(
//         { error: "Missing parameters" },
//         { status: 400 }
//       );
//     }

//     const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       APP_ID,
//       SERVER_SECRET,
//       roomID,
//       userID,
//       userName,
//       callType === "video"
//         ? ZegoUIKitPrebuilt.OneONoneCall
//         : callType === "audio"
//         ? ZegoUIKitPrebuilt.VoiceCall
//         : ZegoUIKitPrebuilt.GroupCall
//     );

//     return NextResponse.json({ token });
//   } catch (error) {
//     console.error("Error generating Zego token:", error);
//     return NextResponse.json(
//       { error: "Failed to generate token" },
//       { status: 500 }
//     );
//   }
// }
