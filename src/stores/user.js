export const useUserStore = defineStore("user", () => {
    const token = ref(uni.getStorageSync(Cache.Token) || "");
    const refreshToken = ref(uni.getStorageSync(Cache.RefreshToken) || "");
    const userInfo = ref(uni.getStorageSync(Cache.UserInfo) || null);

    const updateUserToken = data => {
        token.value = data?.accessToken || "";
        refreshToken.value = data?.refreshToken || "";
    };

    const login = async params => {
        try {
            const {data} = await Apis.login.appLoginByTel({params, meta: {authRole: "login"}});

            updateUserToken(data);

            return true;
        } catch (e) {
            console.log("login -> failed", e);
            updateUserToken();

            return Promise.reject(e);
        }
    };

    const clearUserData = () => {
        updateUserToken();
        userInfo.value = null;
        uni.removeStorageSync(Cache.UserInfo);
    };

    const logout = async () => {
        try {
            await Apis.login.loginOut({params: {refreshToken: refreshToken.value}, meta: {authRole: "logout"}});

            return true;
        } catch (e) {
            console.log("mpLogout error", e);

            return true;
        } finally {
            clearUserData();
        }
    };

    // 获取用户信息
    const getUserInfo = async () => {
        try {
            const {data} = await Apis.login.getAppLoginInfo();

            uni.setStorageSync(Cache.UserInfo, data);

            userInfo.value = data;

            return true;
        } catch (e) {
            console.log("e", e);

            return Promise.reject(e);
        }
    };

    return {
        token,
        refreshToken,
        userInfo,
        login,
        logout,
        updateUserToken,
        getUserInfo,
        clearUserData
    };
});
