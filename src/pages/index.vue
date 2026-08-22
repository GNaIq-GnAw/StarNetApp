<script setup>
    import {migrate} from "@/hooks/useSqlite/core/migrate.js";
    import userDb, {USER_MIGRATIONS, USER_SCHEMA_VERSION} from "@/hooks/useSqlite/db/user-db.js";

    const router = useRouter();

    onLoad(async () => {
        try {
            await defineSqlite(async resolveInstance => {
                const user = resolveInstance({name: "user"});

                await user.initialize(userDb);
                // 存量库结构升级：版本号 + 列存在性检查双保险，新装用户自动跳过
                await migrate(user, {version: USER_SCHEMA_VERSION, steps: USER_MIGRATIONS});

                return {user};
            });

            // #ifdef APP-PLUS
            await sleep(3000);
            plus.navigator.closeSplashscreen();
            // #endif

            uni.showLoading({mask: true});

            await router.replaceAll({path: "/pages/home"});

            uni.hideLoading();
        } catch (e) {
            console.log("defineSqlite -> failed", e);
        }
    });
</script>

<template>
    <view />
</template>
