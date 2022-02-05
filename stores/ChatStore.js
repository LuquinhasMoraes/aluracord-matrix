import { flow, getSnapshot, types } from 'mobx-state-tree'
import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient('https://bfomzoczejfqvfooluii.supabase.co', process.env.PRIVATE_KEY)

const Like = types.model({
    curti: types.optional(types.frozen({}), {}),
    amei: types.optional(types.frozen({}), {}),
    haha: types.optional(types.frozen({}), {}),
    uau: types.optional(types.frozen({}), {}),
    triste: types.optional(types.frozen({}), {}),
    grr: types.optional(types.frozen({}), {}),
    olha: types.optional(types.frozen({}), {})
})

const Message = types.model('Message', {
  id: types.optional(types.maybeNull(types.number), 0),
  textMessage: types.optional(types.string, ''),
  from: types.optional(types.string, ''),
  like: types.optional(Like, {}),
  created_at: types.optional(types.maybeNull(types.string), null),
  updated_at: types.optional(types.maybeNull(types.string), ''),
  deleted: types.optional(types.boolean, false),
  isEdinting: types.optional(types.boolean, false)
}).actions(self => ({
  delete: flow( function * () {
    // delete from supabase
    const res = yield supabaseClient
      .from('messages')
      .update({ deleted: true })
      .match({ id: self.id })

      if(res.error === null) {
        self.deleted = true
        const audio = new Audio('./../sounds/send-trash.mp3')
        audio.play()
      }
      else
        console.error('Erro ao deletar mensagem: ', error)
    
  }),
  update: flow( function * (dataToUpdate) {
    const res = yield supabaseClient
      .from('messages')
      .update(dataToUpdate)
      .match({ id: self.id })
      if(res.error === null) {
        self.like = res[0].like
        self.textMessage = res[0].textMessage
        self.updated_at = res[0].updated_at
      }
      else
        console.error('Erro ao deletar mensagem: ', error)
  }),
  setIsEdinting: (value) => {
    self.isEdinting = value
  } 
    

}))

export const ChatStore = types.model('ChatStore', {
  messages: types.optional(types.array(Message), []),
}).actions(self => ({
  getMessages: flow(function *  () {
    const response = yield supabaseClient
      .from('messages')
      .select('*')
      .match({deleted: false})
      .order('id', { ascending: false})

    self.messages = response.data

    return self.messages
  }),
  sendMessage: flow( function * (message) {
    yield supabaseClient.from('messages').insert([message])
  }),
  addMessage: (newMessage) => {
    self.messages = [
      newMessage,
      ...self.messages
    ]
  }
}))
