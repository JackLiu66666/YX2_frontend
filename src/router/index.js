import { createRouter, createWebHistory } from "vue-router";
// 导入两个模块的根组件（每个模块的 App.vue）
import AdminApp from "@/admin/App.vue";
import AgencyApp from "@/agency/App.vue";
import InsuranceCompanyApp from "@/insurance_company/App.vue";
import NurseApp from "@/nurse/App.vue";

// 导入模块的路由配置数组
import adminRoutes from "@/admin/adminRouter.js";
import agencyRoutes from "@/agency/agencyRouter.js";
import insuranceCompanyRoutes from "@/insurance_company/insuranceCompanyRouter.js";
import nurseRoutes from "@/nurse/nurseRouter.js";

import { ElMessage } from "element-plus";
import request from "@/utils/request";
// 构建主路由
const routes = [
  {
    path: "/admin",
    component: AdminApp,
    children: adminRoutes,
  },
  {
    path: "/agency",
    component: AgencyApp,
    children: agencyRoutes,
  },
  {
    path: "/insurance_company",
    component: InsuranceCompanyApp,
    children: insuranceCompanyRoutes,
  },
  {
    path: "/nurse",
    component: NurseApp,
    children: nurseRoutes,
  },
  {
    path: "/",
    redirect: "/admin/login",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 全局路由守卫 - 设置页面标题
router.beforeEach(async (to, from, next) => {
  // 1. 先检查本地是否有登录标识（快速筛选）
  if (to.meta.title) {
    document.title = to.meta.title + " | 院小二管理系统";
  }

  // 2. 检查是否需要登录
  const requiresAuth = to.path.includes("/admin/") && to.path !== "/admin/login";
  if (requiresAuth) {
    try {
      // 尝试访问一个需要登录的接口来验证会话
      await request.get("/admin/hospital/provinces");
      next();
    } catch (error) {
      // 请求失败（可能是 401 或网络错误）
      if (error.response?.status === 401) {
        // session 过期，跳转登录
        ElMessage.warning("登录已过期，请重新登录");
        next("/admin/login");
      } else {
        // 其他错误，也跳转到登录页
        next("/admin/login");
      }
      return;
    }
  }

  // 3. 如果路由需要特定审核状态，则请求后端获取真实状态
  if (to.meta.requiredStatus !== undefined) {
    try {
      // 调用新接口获取 auditStatus
      const res = await request.get("/agencyAuditApplication/audit-status");
      // 假设返回格式为 { code: 200, data: { auditStatus: 1 } }
      const realStatus = res.data;

      // 可选：更新本地存储的 auditStatus（用于其他地方展示）
      const localAgent = JSON.parse(localStorage.getItem("loginAgency") || "{}");
      localAgent.auditStatus = realStatus;
      localStorage.setItem("loginAgency", JSON.stringify(localAgent));

      // 判断权限
      const required = to.meta.requiredStatus;
      const hasPermission = Array.isArray(required) ? required.includes(realStatus) : realStatus === required;

      if (!hasPermission) {
        // 跳转到对应状态页面
        const routeNameMap = {
          0: "AgencyAuditApplication",
          1: "AgencyAuditStatus",
          2: "AgencyAuditPassMaterials",
          3: "AgencyAuditFailReason",
        };
        const target = routeNameMap[realStatus] || "AgencyIndex";
        ElMessage.warning("您的账号状态与当前页面不匹配，已为您跳转");
        next({ name: target });
        return;
      }
    } catch (error) {
      // 请求失败（可能是 401 或网络错误）
      if (error.response?.status === 401) {
        // session 过期，清除本地存储并跳转登录
        localStorage.removeItem("loginAgency");
        ElMessage.warning("登录已过期，请重新登录");
        next("/agency/login");
      } else {
        // 其他错误，可以跳转到错误页或继续（但为了安全建议重新登录）
        next("/agency/login");
      }
      return;
    }
  }
  next();
});

export default router;
