import { configureStore } from '@reduxjs/toolkit'

const initialState = { 
  status: {
    isStarted: false
  },
  input : {
    hours: 0,
    minutes: 0,
    seconds: 0
  },
  counter: {
    value: 0
  }
}

const setup = ({ hours = 0, minutes = 0, seconds = 0 }) => {
  return {
    type: 'chrono/setup',
    payload: { hours, minutes, seconds }
  }
}

const decrement = () => {
  return {
    type: 'chrono/decrement'
  }
}

const stop = () => {
  return {
    type: 'chrono/stop'
  }
}

const chronoReducer = (state = initialState, { type, payload }) => {
  switch(type) {
    case 'chrono/setup': 
      return { 
        status: {
          isStarted: false
        },
        input : {
          hours: payload.hours,
          minutes: payload.minutes,
          seconds: payload.seconds
        },
        counter: {
          value: (payload.hours * 3600) + (payload.minutes * 60) + (payload.seconds * 1)
        }
      }

    case 'chrono/decrement':
      const newValue = state.counter.value - 1 <= 0 ? 0 : state.counter.value - 1

      return {
        ...state,
        status: {
          ...state.status,
          isStarted: true
        },
        counter: {
          ...state.counter,
          value: newValue
        }
      }

    case 'chrono/stop': 
      return {
        ...state,
        status: {
          ...state.status,
          isStarted: false
        }
      }

    default:
      return state
  }
}

const store = configureStore({reducer: chronoReducer})

// Manage view
var interval = null

document.getElementById("inputHours").value = store.getState().input.hours
document.getElementById("inputMinutes").value = store.getState().input.minutes
document.getElementById("inputSeconds").value = store.getState().input.seconds

document.getElementById("setupBtn").addEventListener('click', () => {
  const hours = document.getElementById("inputHours").value
  const minutes = document.getElementById("inputMinutes").value
  const seconds = document.getElementById("inputSeconds").value

  store.dispatch(setup({hours, minutes, seconds}))
  updateView()
})

document.getElementById("decrementBtn").addEventListener('click', () => {
  interval = setInterval(() => {
    store.dispatch(decrement())
    updateView()
  }, 1000)
})

document.getElementById("stopBtn").addEventListener('click', () => {
  clearInterval(interval)
  store.dispatch(stop())
  updateView()
})

const updateView = () => {
  const value = store.getState().counter.value

  const hours = Math.floor(value / 3600)
  const minutes = Math.floor( (value - hours * 3600) / 60 )
  const seconds = Math.floor(value % 60)

  document.getElementById("hours").innerText = hours
  document.getElementById("minutes").innerText = minutes
  document.getElementById("seconds").innerText = seconds

  if(store.getState().status.isStarted && value === 0) {
    blink()
  }
  else {
    document.getElementById("body").style['background-color'] = 'white'
  }
}

const blink = () => {
  if( document.getElementById("body").style['background-color'] === 'red' )
    document.getElementById("body").style['background-color'] = 'blue'
  else
    document.getElementById("body").style['background-color'] = 'red'
}
