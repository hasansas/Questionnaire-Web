// composables/useSocket.ts
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

let socket: Socket | null = null
const isConnected = ref(false)

export function useSocket() {
  const config = useRuntimeConfig()

  function connect(userId?: string) {
    if (socket) return socket
    socket = io(config.public.apiBase)

    socket.on('connect', () => {
      isConnected.value = true
      if (userId) {
        socket!.emit('connected', { userId })
      }
    })

    socket.on('disconnect', () => {
      isConnected.value = false
    })

    return socket
  }

  function disconnect() {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  // ❌ this was killing the socket on every component unmount
  // onUnmounted(disconnect)

  return {
    socket,
    connect,
    disconnect,
    isConnected
  }
}
