<script setup>
    // #ifdef APP-PLUS
    import checkUpdate from "@/uni_modules/uni-upgrade-center-app/utils/check-update";

    // 启动后检查更新，限制一天执行一次
    const checkAppUpdate = async () => {
        const today = formatDate(Date.now());

        // 获取最后一次检查更新的日期
        const lastCheckUpdateDate = uni.getStorageSync(Cache.LastCheckUpdateDate);

        if (today === lastCheckUpdateDate) return;

        try {
            await checkUpdate();
        } catch (e) {
            uni.showToast({title: e.message, icon: "none"});
        } finally {
            // 记录今天已检查
            uni.setStorageSync(Cache.LastCheckUpdateDate, today);
        }
    };
    // #endif

    onLaunch(() => {
        // #ifdef APP-PLUS
        checkAppUpdate();
        // #endif
        console.log("onLaunch");
    });
</script>

<style lang="scss">
    @use "@wot-ui/ui/styles/theme/index.scss" as *;
    @use "@/styles/app.scss";
    @use "@/static/iconfont/iconfont.css";
</style>
