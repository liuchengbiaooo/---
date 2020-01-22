import { channels } from "@/api/realtime"
import { AdministratorList } from "@/api/permission";

const page = {
    state: {
        shadow: false,
        isNewrole: false,
        channel: [],
        administrator:[]
    },
    mutations: {
        SWITCH_SHADOW: (state, shadow) => {
            state.shadow = shadow
        },
        SWITCH_ISNeWROLE: (state, isNewrole) => {
            state.isNewrole = isNewrole
        },
        CHANNEL_LIST: (state, channel) => {
            state.channel = channel
        },
        ADMINISTRATORS: (state ,administrator)=>{
            state.administrator = administrator
        }
    },
    actions: {
        Accordingto({ commit }, shadow) {
            commit('SWITCH_SHADOW', shadow)
        },
        CloseBounced({ commit }, isNewrole) {
            commit('SWITCH_ISNeWROLE', isNewrole)
        },
        async channelList({ commit }, appId) {
            const result = await channels(appId)
            let channel = result.info.list
            commit('CHANNEL_LIST', channel);
        },
        async administrators({ commit }){
            const result = await AdministratorList()
            let administrator = result.info.list
            commit('ADMINISTRATORS',administrator)
        }
    }
}
export default page
