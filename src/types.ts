export interface IMessageData {
  id?: string;
  senderId: string;
  receiverId: string;
  message: string | ArrayBuffer | null;
  type: "audio" | "text";
}
