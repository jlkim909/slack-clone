const SET_THEME = 'SET_THEME';

export const setTheme = (mainTheme:any, subTheme:any) => ({type:SET_THEME, mainTheme, subTheme})

const initialState = {
    mainTheme : '#4c3c4c',
    subTheme:'#eee'
}

const themeReducer = (state = initialState, action:any) => {
    switch(action.type){
        case SET_THEME:
            return{
                mainTheme:action.mainTheme,
                subTheme:action.subTheme
            };
        default:
            return state;
    }
}

export default themeReducer;