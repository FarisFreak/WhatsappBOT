export const Types = {
  Connection : {
      Update : 'connection.update'
  },
  Creds : {
      Update : 'creds.update'
  },
  Presence : {
      Update : 'presence.update'
  },
  Messages : {
      Upsert : 'messages.upsert',
      Update : 'messages.update',
      Delete : 'messages.delete',
      Reaction : 'messages.reaction',
      MediaUpdate : 'messages.media-update'
  },
  MessageReceipt : {
      Update : 'message-receipt.update'
  },
  MessagingHistory : {
      Set : 'messaging-history.set'
  },
  Chats : {
      Upsert : 'chats.upsert',
      Update : 'chats.update',
      Delete : 'chats.delete'
  },
  Call : 'call',
  Contacts : {
      Upsert : 'contacts.upsert',
      Update : 'contacts.update'
  },
  Groups : {
      Upsert : 'groups.upsert',
      Update : 'groups.update'
  },
  GroupParticipants : {
      Update : 'group-participants.update'
  },
  Blocklist : {
      Set : 'blocklist.set',
      Update : 'blocklist.update'
  },
  Labels : {
      Edit : 'labels.edit',
      Association : 'labels.association'
  }
}