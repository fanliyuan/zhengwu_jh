/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/28
 *
 * 描述 ：全局状态树
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        navName: {
            parentName: [],
            childName: ''
        }
    },
    modules: {

    },
    mutations: {
        activeUrl (state, name) {
            state.navName.childName = name;
            sessionStorage.setItem('activeName', name);
        }
    },
    getters: {
        setActiveUrl: (state) => (navs) => {
            if (state.navName.childName === '') {
                state.navName.childName = sessionStorage.getItem('activeName');
            }
            for (let i = 0, len = navs.length; i< len; i++) {
                if (navs[i].childrenUrl && navs[i].childrenUrl.indexOf(state.navName.childName) !== -1) {
                  state.navName.parentName = [];
                  state.navName.parentName.push(navs[i].navId);
                  break;
                }
            }
            return state.navName;
        }
    },
    actions: {

    }
});

export default store
