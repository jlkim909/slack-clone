const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';

export const setCurrentChannel = (channel:any) => ({type:SET_CURRENT_CHANNEL, currentChannel:channel});

const initialState = {currentChannel:null};

const channelReducer = (state=initialState, action:any) => {
    switch(action.type){
        case SET_CURRENT_CHANNEL:
            return{
                currentChannel:action.currentChannel
            }
        default:
            return state;
    }
}

export default channelReducer;