import type { ClaxonMessage } from "./types";

// Mock alert templates that would come from the database
const mockTemplates = {
  compliment: {
    _id: "template_1",
    category: "compliment",
    message_en: "Thank you for your excellent parking!",
    message_ro: "Mulțumesc pentru parcarea excelentă!",
    message_ru: "Спасибо за отличную парковку!",
    icon: "👍",
    is_active: true,
  },
  complaint: {
    _id: "template_2",
    category: "complaint",
    message_en: "Please check your parking - you're blocking the entrance.",
    message_ro: "Vă rog să verificați parcarea - blocați intrarea.",
    message_ru: "Пожалуйста, проверьте парковку - вы блокируете вход.",
    icon: "⚠️",
    is_active: true,
  },
  question: {
    _id: "template_3",
    category: "question",
    message_en: "Could you please move your car? I need to get out.",
    message_ro: "Ați putea să vă mutați mașina? Trebuie să ies.",
    message_ru: "Не могли бы вы передвинуть машину? Мне нужно выехать.",
    icon: "❓",
    is_active: true,
  },
  notification: {
    _id: "template_4",
    category: "notification",
    message_en: "Your headlights are still on.",
    message_ro: "Farurile sunt încă aprinse.",
    message_ru: "Ваши фары все еще включены.",
    icon: "💡",
    is_active: true,
  },
};

// Mock user profiles
const mockUsers = {
  user1: {
    _id: "user_1",
    first_name: "Maria",
    last_name: "Popescu",
    avatar: undefined,
  },
  user2: {
    _id: "user_2",
    first_name: "Alexandru",
    last_name: "Ionescu",
    avatar: undefined,
  },
  user3: {
    _id: "user_3",
    first_name: "Elena",
    last_name: "Dumitrescu",
    avatar: undefined,
  },
  user4: {
    _id: "user_4",
    first_name: "Andrei",
    last_name: "Radu",
    avatar: undefined,
  },
  currentUser: {
    _id: "current_user",
    first_name: "You",
    last_name: "",
    avatar: undefined,
  },
};

const now = Date.now();
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * oneHour;

export const mockMessages: ClaxonMessage[] = [
  // Recent unread received message
  {
    _id: "msg_1",
    _creationTime: now - 30 * 60 * 1000, // 30 minutes ago
    read: false,
    license_plate: "C 123 ABC",
    sender_id: "user_1",
    vehicle_id: "vehicle_1",
    recipient_id: "current_user",
    template_id: "template_2",
    type: "predefined",
    sender_language: "en",
    sender: mockUsers.user1,
    recipient: mockUsers.currentUser,
    template: mockTemplates.complaint,
    messageType: "predefined",
    displayMessage: mockTemplates.complaint.message_en,
    isReceived: true,
  },

  // Custom message received
  {
    _id: "msg_2",
    _creationTime: now - 2 * oneHour, // 2 hours ago
    read: false,
    license_plate: "B 456 DEF",
    sender_id: "user_2",
    vehicle_id: "vehicle_2",
    recipient_id: "current_user",
    custom_message: "Hi! I think you dropped your keys near your car. They're at the security desk.",
    type: "custom",
    sender_language: "en",
    sender: mockUsers.user2,
    recipient: mockUsers.currentUser,
    messageType: "custom",
    displayMessage: "Hi! I think you dropped your keys near your car. They're at the security desk.",
    isReceived: true,
  },

  // Sent message (read)
  {
    _id: "msg_3",
    _creationTime: now - 4 * oneHour, // 4 hours ago
    read: true,
    license_plate: "M 789 GHI",
    sender_id: "current_user",
    vehicle_id: "vehicle_3",
    recipient_id: "user_3",
    template_id: "template_1",
    type: "predefined",
    sender_language: "en",
    sender: mockUsers.currentUser,
    recipient: mockUsers.user3,
    template: mockTemplates.compliment,
    messageType: "predefined",
    displayMessage: mockTemplates.compliment.message_en,
    isReceived: false,
  },

  // Older received message (read)
  {
    _id: "msg_4",
    _creationTime: now - oneDay, // 1 day ago
    read: true,
    license_plate: "C 321 JKL",
    sender_id: "user_4",
    vehicle_id: "vehicle_4",
    recipient_id: "current_user",
    template_id: "template_4",
    type: "predefined",
    sender_language: "en",
    sender: mockUsers.user4,
    recipient: mockUsers.currentUser,
    template: mockTemplates.notification,
    messageType: "predefined",
    displayMessage: mockTemplates.notification.message_en,
    isReceived: true,
  },

  // Another sent message
  {
    _id: "msg_5",
    _creationTime: now - 2 * oneDay, // 2 days ago
    read: true,
    license_plate: "B 654 MNO",
    sender_id: "current_user",
    vehicle_id: "vehicle_5",
    recipient_id: "user_1",
    custom_message: "Thanks for letting me know about the parking spot!",
    type: "custom",
    sender_language: "en",
    sender: mockUsers.currentUser,
    recipient: mockUsers.user1,
    messageType: "custom",
    displayMessage: "Thanks for letting me know about the parking spot!",
    isReceived: false,
  },

  // Question message (unread)
  {
    _id: "msg_6",
    _creationTime: now - 3 * oneDay, // 3 days ago
    read: false,
    license_plate: "M 987 PQR",
    sender_id: "user_3",
    vehicle_id: "vehicle_6",
    recipient_id: "current_user",
    template_id: "template_3",
    type: "predefined",
    sender_language: "en",
    sender: mockUsers.user3,
    recipient: mockUsers.currentUser,
    template: mockTemplates.question,
    messageType: "predefined",
    displayMessage: mockTemplates.question.message_en,
    isReceived: true,
  },

  // Older sent message
  {
    _id: "msg_7",
    _creationTime: now - 5 * oneDay, // 5 days ago
    read: true,
    license_plate: "C 147 STU",
    sender_id: "current_user",
    vehicle_id: "vehicle_7",
    recipient_id: "user_2",
    template_id: "template_2",
    type: "predefined",
    sender_language: "en",
    sender: mockUsers.currentUser,
    recipient: mockUsers.user2,
    template: mockTemplates.complaint,
    messageType: "predefined",
    displayMessage: mockTemplates.complaint.message_en,
    isReceived: false,
  },

  // Very recent custom message (unread)
  {
    _id: "msg_8",
    _creationTime: now - 10 * 60 * 1000, // 10 minutes ago
    read: false,
    license_plate: "B 258 VWX",
    sender_id: "user_4",
    vehicle_id: "vehicle_8",
    recipient_id: "current_user",
    custom_message: "Your car alarm has been going off for 20 minutes. Could you please check it?",
    type: "custom",
    sender_language: "en",
    sender: mockUsers.user4,
    recipient: mockUsers.currentUser,
    messageType: "custom",
    displayMessage: "Your car alarm has been going off for 20 minutes. Could you please check it?",
    isReceived: true,
  },
];
