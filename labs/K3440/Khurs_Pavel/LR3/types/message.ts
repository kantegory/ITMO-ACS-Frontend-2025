export interface Message {
  id: string;
  propertyId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CreateMessageData {
  recipientId: string;
  propertyId: string;
  text: string;
}
