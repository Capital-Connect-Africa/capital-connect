import { User } from "../../features/users/models";

export interface CreateBookingRequest {
    calendlyEventId: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    orderTrackingId: string;
    redirectUrl: string;
    paymentId: number;
}


export interface Invitee {
  email: string;
  displayName: string;
}

export interface Meeting {
  title: string;
  start: string; // ISO date string format
  end: string;   // ISO date string format
  timezone: string;
  invitees: Invitee[];
  bookingId:string
}

export interface MeetingResponse{
  id: string,
  meetingNumber: string,
  title: string,
  password: string,
  phoneAndVideoSystemPassword: string,
  meetingType: string,
  state: string,
  timezone: string,
  start: string,
  end: string,
  hostUserId: string,
  hostDisplayName: string,
  hostEmail: string,
  hostKey: string,
  siteUrl: string,
  webLink: string,
  sipAddress: string,
  dialInIpAddress: string,
  enabledAutoRecordMeeting: boolean,
  allowAuthenticatedDevices: boolean,
  enabledJoinBeforeHost: boolean,
  joinBeforeHostMinutes: number,
  enableConnectAudioBeforeHost: boolean,
  excludePassword: boolean,
  publicMeeting: boolean,
  enableAutomaticLock: boolean,
  unlockedMeetingJoinSecurity: string,
  meetingOptions: {
    enabledChat: boolean,
    enabledVideo: boolean,
    enabledFileTransfer: boolean
  },
  attendeePrivileges: {
    enabledShareContent: boolean,
    enabledSaveDocument: boolean,
    enabledPrintDocument: boolean,
    enabledAnnotate: boolean,
    enabledViewParticipantList: boolean,
    enabledViewThumbnails: boolean,
    enabledRemoteControl: boolean,
    enabledViewAnyDocument: boolean,
    enabledViewAnyPage: boolean,
    enabledContactOperatorPrivately: boolean,
    enabledChatHost: boolean,
    enabledChatPresenter: boolean,
    enabledChatOtherParticipants: boolean
  },
  sessionTypeId: number,
  scheduledType: string,
  simultaneousInterpretation: {
    enabled: boolean
  },
  enabledVisualWatermark: boolean,
  enabledBreakoutSessions: boolean,
  audioConnectionOptions: {
    audioConnectionType: string,
    enabledTollFreeCallIn: boolean,
    enabledGlobalCallIn: boolean,
    enabledAudienceCallBack: boolean,
    entryAndExitTone: string,
    allowHostToUnmuteParticipants: boolean,
    allowAttendeeToUnmuteSelf: boolean,
    muteAttendeeUponEntry: boolean
  },
  enabledLiveStream: boolean,
  accessToken: string
}



export interface Payment {
    id: number;
    currency: string;
    amount: number;
    description: string;
    status: 'initiated' | 'completed' | 'failed'; 
    orderTrackingId: string;
    createdAt: string; 
    updatedAt: string; 
  }
  
export interface BookingResponse{
  data: Booking[]
}

export interface Booking {
  id: number;
  calendlyEventId: string;
  createdAt: string; 
  updatedAt: string; 
  payments: Payment[];
  notes:string,
  user:User,
  advisor:User,
  meetingLink:string,
  meetingEndTime:string,
  meetingStartTime:string,
  meetingId:string
}

export interface SaveMeetingPayload{
  calendlyEventId: string,
  notes: string
}


